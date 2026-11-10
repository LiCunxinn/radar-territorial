import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Alerta, Decisao, ResultadoClima, Tela } from './src/types';
import { analiseService, climaService, storageService } from './src/services';
import { cores } from './src/theme';
import { TabBar } from './src/components';
import {
  PainelScreen,
  AlertasScreen,
  AlertaDetalheScreen,
  DecisaoScreen,
  HistoricoScreen,
  SobreScreen,
} from './src/screens';

// Telas que mostram a barra de abas na parte de baixo
const TELAS_COM_ABAS: Tela[] = ['painel', 'alertas', 'historico', 'sobre'];

export default function App() {
  // ---------- ESTADO GLOBAL (fica aqui e desce para as telas via props) ----------
  const [telaAtual, setTelaAtual] = useState<Tela>('painel');
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);
  const [decisoes, setDecisoes] = useState<Decisao[]>([]);
  const [clima, setClima] = useState<ResultadoClima | null>(null); // null = carregando
  const [carregando, setCarregando] = useState(true);

  // Consulta a API de clima. Se falhar, o climaService usa cache ou dados sintéticos.
  const carregarClima = useCallback(async () => {
    setClima(null); // mostra o "carregando" no painel
    const resultado = await climaService.getClima();
    setClima(resultado);
  }, []);

  // Ao abrir o app: lê as decisões salvas e consulta o clima
  useEffect(() => {
    async function carregarDados() {
      const decisoesSalvas = await storageService.getDecisoes();
      setDecisoes(decisoesSalvas);
      setCarregando(false);
    }
    carregarDados();
    carregarClima(); // sem await: o painel aparece enquanto o clima carrega
  }, [carregarClima]);

  // Os alertas são DERIVADOS dos dados: recalculam só quando o clima muda
  const alertas = useMemo(() => analiseService.gerarAlertas(clima?.dias ?? []), [clima]);

  // ---------- NAVEGAÇÃO ----------
  const abrirAlerta = (alerta: Alerta) => {
    setAlertaSelecionado(alerta);
    setTelaAtual('alertaDetalhe');
  };

  // Botão "voltar" físico do Android: volta uma tela em vez de fechar o app
  useEffect(() => {
    const assinatura = BackHandler.addEventListener('hardwareBackPress', () => {
      if (telaAtual === 'decisao') {
        setTelaAtual('alertaDetalhe');
        return true;
      }
      if (telaAtual === 'alertaDetalhe') {
        setTelaAtual('alertas');
        return true;
      }
      if (telaAtual !== 'painel') {
        setTelaAtual('painel');
        return true;
      }
      return false; // já está no painel: deixa o sistema fechar o app
    });
    return () => assinatura.remove();
  }, [telaAtual]);

  // ---------- PERSISTÊNCIA ----------
  // Chamada pela DecisaoScreen. Se salvar() lançar erro, a tela mostra o aviso.
  const salvarDecisao = async (novaDecisao: Decisao) => {
    const listaAtualizada = await storageService.saveDecisao(novaDecisao);
    setDecisoes(listaAtualizada);
    setTelaAtual('historico');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {/* edges={['top']}: a faixa verde ocupa a área do relógio/notch; a base é tratada pela TabBar */}
      <SafeAreaView style={styles.container} edges={['top']}>
        {carregando ? (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        ) : (
          <View style={styles.corpo}>
            <View style={styles.tela}>
              {telaAtual === 'painel' && (
                <PainelScreen
                  alertas={alertas}
                  clima={clima}
                  onAtualizarClima={carregarClima}
                  onVerAlertas={() => setTelaAtual('alertas')}
                />
              )}

              {telaAtual === 'alertas' && <AlertasScreen alertas={alertas} onSelecionar={abrirAlerta} />}

              {telaAtual === 'alertaDetalhe' && alertaSelecionado && (
                <AlertaDetalheScreen
                  alerta={alertaSelecionado}
                  totalDecisoes={decisoes.filter((d) => d.alertaId === alertaSelecionado.id).length}
                  onVoltar={() => setTelaAtual('alertas')}
                  onRegistrarDecisao={() => setTelaAtual('decisao')}
                />
              )}

              {telaAtual === 'decisao' && alertaSelecionado && (
                <DecisaoScreen
                  alerta={alertaSelecionado}
                  onSalvar={salvarDecisao}
                  onCancelar={() => setTelaAtual('alertaDetalhe')}
                />
              )}

              {telaAtual === 'historico' && <HistoricoScreen decisoes={decisoes} />}

              {telaAtual === 'sobre' && <SobreScreen />}
            </View>

            {TELAS_COM_ABAS.includes(telaAtual) && (
              <TabBar abaAtiva={telaAtual} onNavegar={setTelaAtual} totalAlertas={alertas.length} />
            )}
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // O fundo verde do SafeAreaView "pinta" a área do relógio/notch junto com o cabeçalho
  container: { flex: 1, backgroundColor: cores.primaria },
  corpo: { flex: 1, backgroundColor: cores.fundo },
  tela: { flex: 1 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
});
