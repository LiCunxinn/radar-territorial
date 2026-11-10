// ============================================================
// Camada de ANÁLISE: transforma dados brutos em indicadores e
// alertas preditivos.
//
// Escolha didática: usamos REGRESSÃO LINEAR SIMPLES (uma reta que
// melhor se ajusta aos 12 meses). É um modelo fácil de explicar
// ao gestor ("se a tendência continuar...") e permite calcular a
// confiança (R²) e a margem de erro de forma transparente.
// Nada aqui é "caixa-preta": o gestor consegue entender e contestar.
// ============================================================

import { Alerta, DiaClima, Nivel, Serie, Tema } from "../types";
import { bairros, series, temas } from "../data/mock";
import { formatarDiaSemana, formatarNumero, nivelDaConfianca } from "../utils/formatadores";

const MESES_A_PROJETAR = 3;

// ---------- Estatística básica ----------

type Reta = {
  intercepto: number; // valor da reta em x = 0
  inclinacao: number; // quanto o valor muda por mês
  r2: number; // 0 a 1: quanto da variação a reta explica
  desvio: number; // desvio-padrão dos resíduos (usado como margem de erro)
};

// Mínimos quadrados: ajusta y = intercepto + inclinacao * x, com x = 0..n-1
function regressaoLinear(y: number[]): Reta {
  const n = y.length;
  const mediaX = (n - 1) / 2;
  const mediaY = y.reduce((soma, v) => soma + v, 0) / n;

  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  y.forEach((valor, x) => {
    sxy += (x - mediaX) * (valor - mediaY);
    sxx += (x - mediaX) ** 2;
    syy += (valor - mediaY) ** 2;
  });

  const inclinacao = sxy / sxx;
  const intercepto = mediaY - inclinacao * mediaX;

  // Resíduos = diferença entre o valor real e o valor da reta
  let somaResiduos2 = 0;
  y.forEach((valor, x) => {
    somaResiduos2 += (valor - (intercepto + inclinacao * x)) ** 2;
  });

  const r2 = syy === 0 ? 0 : 1 - somaResiduos2 / syy;
  const desvio = Math.sqrt(somaResiduos2 / (n - 2));
  return { intercepto, inclinacao, r2, desvio };
}

// ---------- Séries e indicadores do painel ----------

// Série de um bairro, ou a MÉDIA dos bairros quando bairroId = "todos"
function obterSerie(bairroId: string, tema: Tema): number[] {
  if (bairroId !== "todos") {
    const serie = series.find((s) => s.bairroId === bairroId && s.tema === tema);
    return serie ? serie.valores : [];
  }
  const doTema = series.filter((s) => s.tema === tema);
  return doTema[0].valores.map(
    (_, mes) => doTema.reduce((soma, s) => soma + s.valores[mes], 0) / doTema.length
  );
}

type Indicadores = {
  atual: number; // último mês
  variacao3m: number; // % vs. 3 meses atrás
  percentualLimite: number; // % da meta consumida
};

function calcularIndicadores(valores: number[], tema: Tema): Indicadores {
  const atual = valores[valores.length - 1];
  const tresMesesAtras = valores[valores.length - 4];
  return {
    atual,
    variacao3m: ((atual - tresMesesAtras) / tresMesesAtras) * 100,
    percentualLimite: (atual / temas[tema].limite) * 100,
  };
}

// ---------- Alertas de TENDÊNCIA (água, energia, resíduos) ----------

// Compara a projeção com a meta e decide o nível de risco
function nivelPelaMeta(razao: number): Nivel | null {
  if (razao >= 1.05) return "alto"; // passa da meta em mais de 5%
  if (razao >= 1.0) return "medio"; // ultrapassa a meta
  if (razao >= 0.95) return "baixo"; // chega a menos de 5% da meta
  return null; // sem alerta
}

function alertaDeTendencia(serie: Serie): Alerta | null {
  const info = temas[serie.tema];
  const reta = regressaoLinear(serie.valores);
  const n = serie.valores.length;

  // Projeta os próximos meses prolongando a reta
  const projecao = Array.from(
    { length: MESES_A_PROJETAR },
    (_, i) => reta.intercepto + reta.inclinacao * (n + i)
  );
  const projecaoFinal = projecao[projecao.length - 1];
  const razao = projecaoFinal / info.limite;
  const nivel = nivelPelaMeta(razao);
  if (!nivel) return null;

  const bairro = bairros.find((b) => b.id === serie.bairroId)!;
  const primeiro = serie.valores[0];
  const ultimo = serie.valores[n - 1];
  const variacao = ((ultimo - primeiro) / primeiro) * 100;
  const verbo = variacao > 1 ? "subiu" : variacao < -1 ? "caiu" : "ficou estável";
  // Confiança = R² em %. Limitamos a 95%: nenhuma previsão é certeza absoluta.
  const confianca = Math.min(95, Math.max(0, Math.round(reta.r2 * 100)));
  const fmt = (v: number) => formatarNumero(v, info.decimais);

  const limitacoes = [
    "Projeção linear com apenas 12 pontos mensais: não captura sazonalidade (verão/inverno, feriados).",
    `Margem de erro estimada de ±${fmt(reta.desvio * 1.96)} ${info.unidade} (95% dos meses ficam dentro dessa faixa).`,
    "Dados sintéticos de demonstração. Em produção, devem vir da concessionária ou da prefeitura.",
  ];
  if (confianca < 40) {
    limitacoes.unshift(
      `Série muito oscilante: a tendência explica só ${confianca}% da variação. Trate como indício, não como previsão.`
    );
  }

  return {
    id: `${serie.bairroId}-${serie.tema}`,
    tipo: "tendencia",
    titulo: razao >= 1
      ? `${info.nome}: projeção acima da meta`
      : `${info.nome}: consumo próximo da meta`,
    bairroId: serie.bairroId,
    bairroNome: bairro.nome,
    tema: serie.tema,
    nivel,
    justificativa:
      `O consumo de ${info.nome.toLowerCase()} em ${bairro.nome} ${verbo} de ${fmt(primeiro)} para ${fmt(ultimo)} ` +
      `${info.unidade} em 12 meses (${formatarNumero(variacao, 1)}%). Se a tendência continuar, a projeção para ` +
      `daqui a ${MESES_A_PROJETAR} meses é de ${fmt(projecaoFinal)} ${info.unidade}, ` +
      `${formatarNumero(razao * 100, 0)}% da meta de ${fmt(info.limite)}.`,
    confianca,
    nivelConfianca: nivelDaConfianca(confianca),
    limitacoes,
    historico: serie.valores,
    projecao,
    margemErro: reta.desvio * 1.96,
  };
}

// ---------- Alerta de CLIMA (dados da API) ----------

function alertaDeClima(dias: DiaClima[]): Alerta | null {
  if (dias.length === 0) return null;

  const total = dias.reduce((soma, d) => soma + d.chuvaMm, 0);
  const diaPico = dias.reduce((maior, d) => (d.chuvaMm > maior.chuvaMm ? d : maior), dias[0]);

  // Limiares didáticos (não são normas oficiais!)
  let nivel: Nivel | null = null;
  if (total >= 80 || diaPico.chuvaMm >= 50) nivel = "alto";
  else if (total >= 40 || diaPico.chuvaMm >= 30) nivel = "medio";
  else if (total >= 25) nivel = "baixo";
  if (!nivel) return null;

  // Confiança: previsões de dias mais distantes são menos confiáveis.
  // Média ponderada pela chuva de cada dia (heurística didática).
  const somaPesos = dias.reduce((soma, d) => soma + d.chuvaMm, 0);
  const confianca = Math.round(
    dias.reduce((soma, d, i) => soma + d.chuvaMm * Math.max(30, 90 - 8 * i), 0) / somaPesos
  );

  return {
    id: "cidade-clima",
    tipo: "clima",
    titulo: "Chuva acima do normal nos próximos dias",
    bairroId: "cidade",
    bairroNome: "Toda a cidade",
    tema: "clima",
    nivel,
    justificativa:
      `A previsão indica ${formatarNumero(total, 0)} mm de chuva nos próximos ${dias.length} dias, ` +
      `com pico de ${formatarNumero(diaPico.chuvaMm, 0)} mm em ${formatarDiaSemana(diaPico.data)}. ` +
      `Chuvas concentradas aumentam a demanda por drenagem, limpeza urbana e coleta de resíduos.`,
    confianca,
    nivelConfianca: nivelDaConfianca(confianca),
    limitacoes: [
      "Previsão única para a cidade inteira: não considera a drenagem nem o relevo de cada bairro.",
      "A incerteza cresce a cada dia: os dias mais distantes são menos confiáveis.",
      "Os limiares (25, 40 e 80 mm) são referências didáticas, não normas da Defesa Civil.",
    ],
  };
}

// ---------- Função principal ----------

const ordemNivel: Record<Nivel, number> = { alto: 0, medio: 1, baixo: 2 };

// Gera todos os alertas, do mais grave para o menos grave
function gerarAlertas(dias: DiaClima[]): Alerta[] {
  const alertas: Alerta[] = [];

  series.forEach((serie) => {
    const alerta = alertaDeTendencia(serie);
    if (alerta) alertas.push(alerta);
  });

  const alertaClima = alertaDeClima(dias);
  if (alertaClima) alertas.push(alertaClima);

  return alertas.sort(
    (a, b) => ordemNivel[a.nivel] - ordemNivel[b.nivel] || b.confianca - a.confianca
  );
}

export const analiseService = {
  obterSerie,
  calcularIndicadores,
  gerarAlertas,
};
