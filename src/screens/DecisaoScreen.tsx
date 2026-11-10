import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AcaoDecisao, Alerta, Decisao } from '../types';
import { cores, ALVO_MINIMO } from '../theme';
import { dataHoje } from '../utils/formatadores';
import { ErrosDecisao, validarDecisao } from '../utils/validacao';
import { AvisoBox, Botao, Cabecalho, CampoTexto } from '../components';

type Props = {
  alerta: Alerta;
  onSalvar: (decisao: Decisao) => Promise<void>; // quem salva de verdade é o App (via services)
  onCancelar: () => void;
};

// As três respostas possíveis do gestor diante de um alerta
const opcoes: { acao: AcaoDecisao; titulo: string; descricao: string }[] = [
  { acao: 'acionar', titulo: 'Acionar equipe', descricao: 'Registrar que uma equipe será enviada ao local.' },
  { acao: 'monitorar', titulo: 'Continuar monitorando', descricao: 'Aguardar mais dados antes de agir.' },
  { acao: 'descartar', titulo: 'Descartar alerta', descricao: 'Considerar o alerta improcedente.' },
];

export default function DecisaoScreen({ alerta, onSalvar, onCancelar }: Props) {
  const [acao, setAcao] = useState<AcaoDecisao | null>(null);
  const [justificativa, setJustificativa] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [erros, setErros] = useState<ErrosDecisao>({});
  const [tentouSalvar, setTentouSalvar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Depois da 1ª tentativa de salvar, os erros são recalculados a cada digitação
  // (feedback imediato). Antes disso não "gritamos" erro em campo ainda vazio.
  const revalidar = (novos: { acao?: AcaoDecisao | null; justificativa?: string; responsavel?: string }) => {
    if (!tentouSalvar) return;
    setErros(
      validarDecisao({
        acao: novos.acao !== undefined ? novos.acao : acao,
        justificativa: novos.justificativa ?? justificativa,
        responsavel: novos.responsavel ?? responsavel,
      })
    );
  };

  const handleSalvar = async () => {
    setTentouSalvar(true);
    const errosEncontrados = validarDecisao({ acao, justificativa, responsavel });
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) {
      return; // formulário inválido: as mensagens já aparecem nos campos
    }

    setSalvando(true);
    try {
      const novaDecisao: Decisao = {
        id: Date.now().toString(),
        alertaId: alerta.id,
        alertaTitulo: alerta.titulo,
        bairroNome: alerta.bairroNome,
        acao: acao as AcaoDecisao, // já validado acima: não é null
        justificativa: justificativa.trim(),
        responsavel: responsavel.trim(),
        data: dataHoje(),
      };
      await onSalvar(novaDecisao);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a decisão localmente.');
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Cabecalho titulo="Registrar decisão" subtitulo={alerta.titulo} onVoltar={onCancelar} />

      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.rotulo}>Qual a sua decisão?</Text>
        <View accessibilityRole="radiogroup">
          {opcoes.map((op) => {
            const marcada = acao === op.acao;
            return (
              <TouchableOpacity
                key={op.acao}
                style={[styles.opcao, marcada && styles.opcaoMarcada]}
                onPress={() => {
                  setAcao(op.acao);
                  revalidar({ acao: op.acao });
                }}
                accessibilityRole="radio"
                accessibilityLabel={`${op.titulo}. ${op.descricao}`}
                accessibilityState={{ checked: marcada }}
              >
                <Text style={[styles.opcaoTitulo, marcada && styles.opcaoTituloMarcada]}>
                  {marcada ? '◉' : '○'} {op.titulo}
                </Text>
                <Text style={[styles.opcaoDescricao, marcada && styles.opcaoTituloMarcada]}>{op.descricao}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.erroAcao} accessibilityLiveRegion="polite">
          {erros.acao ? `⚠ ${erros.acao}` : ''}
        </Text>

        <CampoTexto
          rotulo="Justificativa"
          placeholder="Por que você tomou esta decisão?"
          valor={justificativa}
          onChangeText={(t) => {
            setJustificativa(t);
            revalidar({ justificativa: t });
          }}
          erro={erros.justificativa}
          multiline
          maxLength={300}
        />

        <CampoTexto
          rotulo="Responsável (nome ou matrícula)"
          placeholder="Ex.: Ana Souza ou matrícula 12345"
          valor={responsavel}
          onChangeText={(t) => {
            setResponsavel(t);
            revalidar({ responsavel: t });
          }}
          erro={erros.responsavel}
          maxLength={60}
        />

        <AvisoBox
          tipo="atencao"
          titulo="Privacidade"
          texto="Não escreva CPF, e-mail, telefone ou endereço de cidadãos. O histórico fica salvo apenas neste aparelho."
        />

        {salvando ? (
          <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 16 }} />
        ) : (
          <View style={styles.acoes}>
            <Botao titulo="Salvar decisão" onPress={handleSalvar} />
            <View style={{ marginTop: 10 }}>
              <Botao titulo="Cancelar" variante="secundario" onPress={onCancelar} />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: 16, paddingBottom: 32 },
  rotulo: { fontSize: 14, fontWeight: 'bold', color: cores.textoForte, marginBottom: 6 },
  opcao: {
    minHeight: ALVO_MINIMO,
    backgroundColor: cores.superficie,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  opcaoMarcada: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  opcaoTitulo: { fontSize: 15, fontWeight: 'bold', color: cores.textoForte },
  opcaoTituloMarcada: { color: '#fff' },
  opcaoDescricao: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  erroAcao: { fontSize: 13, color: cores.erro, fontWeight: '600', minHeight: 18 },
  acoes: { marginTop: 16 },
});
