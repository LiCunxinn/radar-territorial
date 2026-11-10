import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Alerta } from '../types';
import { MESES, temas } from '../data/mock';
import { cores, corDoNivel } from '../theme';
import { formatarNumero, rotuloRisco } from '../utils/formatadores';
import { AvisoBox, BarraConfianca, Botao, Cabecalho, GraficoBarras, Selo } from '../components';

type Props = {
  alerta: Alerta;
  totalDecisoes: number; // quantas decisões já foram registradas para este alerta
  onVoltar: () => void;
  onRegistrarDecisao: () => void;
};

// Os 3 meses seguintes ao último mês do histórico (Out -> Nov, Dez, Jan)
function rotulosDaProjecao(quantidade: number): string[] {
  const ultimo = MESES.length - 1;
  return Array.from({ length: quantidade }, (_, i) => MESES[(ultimo + 1 + i) % MESES.length]);
}

export default function AlertaDetalheScreen({ alerta, totalDecisoes, onVoltar, onRegistrarDecisao }: Props) {
  const corRisco = corDoNivel(alerta.nivel);
  // Só os alertas de tendência têm histórico e projeção para o gráfico
  const info = alerta.tema !== 'clima' ? temas[alerta.tema] : null;

  return (
    <View style={styles.tela}>
      <Cabecalho titulo="Detalhe do alerta" onVoltar={onVoltar} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <View style={styles.linhaTitulo}>
            <Text style={styles.titulo}>{alerta.titulo}</Text>
            <Selo texto={rotuloRisco[alerta.nivel]} cor={corRisco} />
          </View>
          <Text style={styles.local}>{alerta.bairroNome}</Text>

          <Text style={styles.secao}>Por que este alerta foi gerado?</Text>
          <Text style={styles.texto}>{alerta.justificativa}</Text>

          <View style={styles.bloco}>
            <BarraConfianca percentual={alerta.confianca} nivel={alerta.nivelConfianca} />
          </View>
        </View>

        {/* Gráfico: histórico + projeção (somente alertas de tendência) */}
        {info && alerta.historico && alerta.projecao && (
          <View style={styles.card}>
            <Text style={styles.secaoSemMargem}>Histórico e projeção</Text>
            <Text style={styles.cartaoSub}>
              Margem de erro estimada: {'±'}{formatarNumero(alerta.margemErro ?? 0, info.decimais)} {info.unidade}
            </Text>
            <GraficoBarras
              valores={alerta.historico}
              projecao={alerta.projecao}
              rotulos={[...MESES, ...rotulosDaProjecao(alerta.projecao.length)]}
              unidade={info.unidade}
              decimais={info.decimais}
              limite={info.limite}
            />
          </View>
        )}

        {/* Limitações: obrigatórias em todo alerta */}
        <AvisoBox tipo="atencao" titulo="Limitações desta previsão" itens={alerta.limitacoes} />

        <AvisoBox
          titulo="A decisão é humana"
          texto="Este app não aciona equipes nem altera serviços automaticamente. Registre a sua decisão e a justificativa."
        />

        {totalDecisoes > 0 && (
          <Text style={styles.nota}>
            Já existe(m) {totalDecisoes} decisão(ões) registrada(s) para este alerta.
          </Text>
        )}

        <View style={{ marginTop: 12 }}>
          <Botao
            titulo="Registrar decisão"
            onPress={onRegistrarDecisao}
            dica="Abre o formulário para você registrar o que decidiu fazer"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: 16, paddingBottom: 24 },
  card: {
    backgroundColor: cores.superficie,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  linhaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { flex: 1, fontSize: 18, fontWeight: 'bold', color: cores.textoForte, marginRight: 8 },
  local: { fontSize: 14, color: cores.textoSuave, marginTop: 4 },
  secao: { fontSize: 14, fontWeight: 'bold', color: cores.textoForte, marginTop: 16 },
  secaoSemMargem: { fontSize: 14, fontWeight: 'bold', color: cores.textoForte },
  cartaoSub: { fontSize: 12, color: cores.textoSuave, marginTop: 2, marginBottom: 12 },
  texto: { fontSize: 15, color: cores.textoForte, marginTop: 6, lineHeight: 22 },
  bloco: { marginTop: 16 },
  nota: { fontSize: 13, color: cores.textoSuave, textAlign: 'center', marginTop: 8 },
});
