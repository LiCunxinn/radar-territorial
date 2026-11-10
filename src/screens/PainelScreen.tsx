import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Alerta, FonteClima, ResultadoClima, Tema } from '../types';
import { bairros, listaTemas, MESES, temas } from '../data/mock';
import { analiseService } from '../services';
import { cores } from '../theme';
import { formatarDiaSemana, formatarNumero } from '../utils/formatadores';
import { Botao, Cabecalho, Chip, GraficoBarras, IndicadorCard } from '../components';

type Props = {
  alertas: Alerta[];
  clima: ResultadoClima | null; // null = ainda carregando
  onAtualizarClima: () => void;
  onVerAlertas: () => void;
};

// Texto que explica ao gestor de onde vieram os dados do clima
const textoFonte: Record<FonteClima, string> = {
  api: 'Dados ao vivo (Open-Meteo)',
  cache: 'Sem conexão: exibindo a última consulta salva',
  sintetico: 'Sem conexão e sem histórico: dados de demonstração',
};

export default function PainelScreen({ alertas, clima, onAtualizarClima, onVerAlertas }: Props) {
  // Filtros da tela (estado LOCAL: só esta tela usa)
  const [bairroId, setBairroId] = useState<string>('todos');
  const [tema, setTema] = useState<Tema>('agua');

  const info = temas[tema];
  const valores = analiseService.obterSerie(bairroId, tema);
  const indicadores = analiseService.calcularIndicadores(valores, tema);
  const nomeBairro = bairroId === 'todos' ? 'Média dos bairros' : bairros.find((b) => b.id === bairroId)!.nome;

  const altos = alertas.filter((a) => a.nivel === 'alto').length;
  const corLimite =
    indicadores.percentualLimite >= 100 ? cores.alto : indicadores.percentualLimite >= 90 ? cores.medio : cores.baixo;

  return (
    <View style={styles.tela}>
      <Cabecalho titulo="Radar Territorial" subtitulo="Painel de inteligência para o gestor público" />

      <ScrollView contentContainerStyle={styles.conteudo}>
        {/* Resumo dos alertas */}
        <View style={styles.resumo}>
          <Text style={styles.resumoTexto}>
            <Text style={styles.resumoNumero}>{alertas.length}</Text> alertas ativos
            {altos > 0 ? ` • ${altos} de risco alto` : ''}
          </Text>
          <Botao titulo="Ver alertas" variante="secundario" onPress={onVerAlertas} />
        </View>

        {/* Filtros */}
        <Text style={styles.secao}>Bairro</Text>
        <View style={styles.chips}>
          <Chip rotulo="Todos" selecionado={bairroId === 'todos'} onPress={() => setBairroId('todos')} />
          {bairros.map((b) => (
            <Chip key={b.id} rotulo={b.nome} selecionado={bairroId === b.id} onPress={() => setBairroId(b.id)} />
          ))}
        </View>

        <Text style={styles.secao}>Tema</Text>
        <View style={styles.chips}>
          {listaTemas.map((t) => (
            <Chip key={t} rotulo={temas[t].nome} selecionado={tema === t} onPress={() => setTema(t)} />
          ))}
        </View>

        {/* Indicadores */}
        <View style={styles.linhaIndicadores}>
          <IndicadorCard
            titulo="Último mês"
            valor={formatarNumero(indicadores.atual, info.decimais)}
            detalhe={info.unidade}
          />
          <View style={styles.espacador} />
          <IndicadorCard
            titulo="vs. 3 meses atrás"
            valor={`${indicadores.variacao3m > 0 ? '+' : ''}${formatarNumero(indicadores.variacao3m, 1)}%`}
            detalhe="variação"
          />
          <View style={styles.espacador} />
          <IndicadorCard
            titulo="% da meta"
            valor={`${formatarNumero(indicadores.percentualLimite, 0)}%`}
            detalhe={`meta ${formatarNumero(info.limite, info.decimais)}`}
            corValor={corLimite}
          />
        </View>

        {/* Gráfico do tema escolhido */}
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>
            {info.nome} {'–'} {nomeBairro}
          </Text>
          <Text style={styles.cartaoSub}>Últimos 12 meses ({info.unidade})</Text>
          <GraficoBarras
            valores={valores}
            rotulos={MESES}
            unidade={info.unidade}
            decimais={info.decimais}
            limite={info.limite}
          />
        </View>

        {/* Clima: dado vindo da API */}
        <View style={styles.cartao}>
          <Text style={styles.cartaoTitulo}>Clima {'–'} próximos 7 dias</Text>
          {clima === null ? (
            <ActivityIndicator size="small" color={cores.primaria} style={{ marginVertical: 24 }} />
          ) : (
            <>
              <Text style={styles.cartaoSub}>Chuva prevista em mm {'•'} {textoFonte[clima.fonte]}</Text>
              <GraficoBarras
                valores={clima.dias.map((d) => d.chuvaMm)}
                rotulos={clima.dias.map((d) => formatarDiaSemana(d.data).split(' ')[0])}
                unidade="mm de chuva"
                decimais={0}
                cor="#3C7DA6"
                mostrarTodosValores
              />
            </>
          )}
          <View style={{ marginTop: 12 }}>
            <Botao titulo="Atualizar clima" variante="secundario" onPress={onAtualizarClima} />
          </View>
        </View>

        <Text style={styles.nota}>
          Dados de consumo sintéticos, agregados por bairro. Nenhum dado pessoal é coletado.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: 16, paddingBottom: 24 },
  resumo: {
    backgroundColor: cores.superficie,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  resumoTexto: { fontSize: 15, color: cores.textoForte, marginBottom: 10 },
  resumoNumero: { fontSize: 20, fontWeight: 'bold', color: cores.primaria },
  secao: { fontSize: 13, fontWeight: 'bold', color: cores.textoSuave, marginTop: 8, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  linhaIndicadores: { flexDirection: 'row', marginTop: 8, marginBottom: 4 },
  espacador: { width: 8 },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cartaoTitulo: { fontSize: 16, fontWeight: 'bold', color: cores.textoForte },
  cartaoSub: { fontSize: 12, color: cores.textoSuave, marginTop: 2, marginBottom: 12 },
  nota: { fontSize: 12, color: cores.textoSuave, textAlign: 'center', marginTop: 16 },
});
