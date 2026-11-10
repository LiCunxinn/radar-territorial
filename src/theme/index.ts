// ============================================================
// Identidade visual do Radar Territorial.
// Centralizar cores e medidas aqui deixa o app coerente: se o
// grupo quiser mudar a cor principal, basta mudar em UM lugar.
// ============================================================

export const cores = {
  // Marca: verde-petróleo (confiança, território, sustentabilidade)
  primaria: "#0B6E6E",
  primariaEscura: "#074C4C",
  primariaClara: "#D7EEEC",

  fundo: "#F2F6F5",
  superficie: "#FFFFFF",
  borda: "#D5DEDC",

  textoForte: "#14201F",
  textoSuave: "#4A5C5A", // contraste mínimo 4.5:1 sobre o fundo (acessibilidade)

  // Níveis de risco (mesmas cores do projeto anterior, para manter o padrão)
  baixo: "#2E7D32",
  medio: "#B45309",
  alto: "#C62828",

  // Séries do gráfico
  projecao: "#E0A458",
  erro: "#C62828",
};

export const corDoNivel = (nivel: "baixo" | "medio" | "alto") => cores[nivel];

export const espaco = {
  p: 8,
  m: 12,
  g: 16,
};

// Tamanho mínimo recomendado de área de toque (acessibilidade)
export const ALVO_MINIMO = 48;
