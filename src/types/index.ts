// ============================================================
// Tipagens globais do app "Radar Territorial".
// Todos os dados são AGREGADOS por bairro: nenhum dado pessoal
// de cidadão é modelado aqui (privacidade por design / LGPD).
// ============================================================

// Navegação: cada valor é uma tela do app (mesmo padrão do projeto anterior)
export type Tela =
  | "painel"
  | "alertas"
  | "alertaDetalhe"
  | "decisao"
  | "historico"
  | "sobre";

// Níveis usados tanto para o risco do alerta quanto para a confiança
export type Nivel = "baixo" | "medio" | "alto";

// Temas monitorados pelo painel
export type Tema = "agua" | "energia" | "residuos";

export type Bairro = {
  id: string;
  nome: string;
  regiao: string;
};

// Metadados de cada tema (nome, unidade e a meta/limite de referência)
export type TemaInfo = {
  nome: string;
  unidade: string;
  limite: number; // valor a partir do qual o consumo vira motivo de atenção
  decimais: number; // casas decimais ao exibir
};

// Série histórica mensal (12 meses) de um tema em um bairro
export type Serie = {
  bairroId: string;
  tema: Tema;
  valores: number[];
};

// Previsão de chuva/temperatura de um dia (vem da API Open-Meteo)
export type DiaClima = {
  data: string; // AAAA-MM-DD
  chuvaMm: number;
  tempMax: number;
};

// De onde vieram os dados de clima (transparência para o gestor)
export type FonteClima = "api" | "cache" | "sintetico";

export type ResultadoClima = {
  dias: DiaClima[];
  fonte: FonteClima;
};

// Alerta preditivo: sempre com justificativa, confiança e limitações
export type Alerta = {
  id: string;
  tipo: "tendencia" | "clima";
  titulo: string;
  bairroId: string; // "cidade" para alertas de clima (válidos para toda a cidade)
  bairroNome: string;
  tema: Tema | "clima";
  nivel: Nivel;
  justificativa: string;
  confianca: number; // 0 a 100
  nivelConfianca: Nivel;
  limitacoes: string[];
  // Só nos alertas de tendência: histórico + projeção para o gráfico
  historico?: number[];
  projecao?: number[];
  margemErro?: number;
};

// Ações possíveis do gestor. O app NUNCA executa nenhuma delas sozinho:
// ele apenas REGISTRA a decisão humana.
export type AcaoDecisao = "acionar" | "monitorar" | "descartar";

export type Decisao = {
  id: string;
  alertaId: string;
  alertaTitulo: string;
  bairroNome: string;
  acao: AcaoDecisao;
  justificativa: string;
  responsavel: string;
  data: string; // DD/MM/AAAA
};
