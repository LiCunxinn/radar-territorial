// ============================================================
// DADOS SINTÉTICOS (fictícios) para demonstração.
// Não representam o consumo real de nenhum bairro. Foram
// escolhidos para exercitar os diferentes cenários do painel:
//   - tendência forte e confiável  -> alerta com confiança ALTA
//   - série muito oscilante        -> alerta com confiança BAIXA
//   - série estável                -> nenhum alerta
// Todos os valores são AGREGADOS por bairro (sem dados pessoais).
// ============================================================

import { Bairro, DiaClima, Serie, Tema, TemaInfo } from "../types";

// Últimos 12 meses (nov/2025 a out/2026)
export const MESES = [
  "Nov", "Dez", "Jan", "Fev", "Mar", "Abr",
  "Mai", "Jun", "Jul", "Ago", "Set", "Out",
];

export const bairros: Bairro[] = [
  { id: "itaquera", nome: "Itaquera", regiao: "Zona Leste" },
  { id: "capao", nome: "Capão Redondo", regiao: "Zona Sul" },
  { id: "pinheiros", nome: "Pinheiros", regiao: "Zona Oeste" },
  { id: "santana", nome: "Santana", regiao: "Zona Norte" },
];

// Meta/limite de cada tema: ultrapassar a meta é o gatilho dos alertas
export const temas: Record<Tema, TemaInfo> = {
  agua: { nome: "Água", unidade: "L/hab/dia", limite: 160, decimais: 0 },
  energia: { nome: "Energia", unidade: "kWh/domicílio/mês", limite: 200, decimais: 0 },
  residuos: { nome: "Resíduos", unidade: "kg/hab/mês", limite: 34, decimais: 1 },
};

export const listaTemas: Tema[] = ["agua", "energia", "residuos"];

export const series: Serie[] = [
  // ----- ÁGUA -----
  { bairroId: "itaquera", tema: "agua", valores: [128, 130, 133, 135, 139, 141, 144, 147, 149, 153, 156, 158] },
  { bairroId: "capao", tema: "agua", valores: [140, 152, 138, 155, 143, 158, 141, 153, 147, 160, 145, 157] },
  { bairroId: "pinheiros", tema: "agua", valores: [150, 148, 149, 147, 146, 148, 145, 144, 146, 143, 142, 141] },
  { bairroId: "santana", tema: "agua", valores: [132, 133, 131, 135, 138, 136, 140, 141, 139, 143, 145, 144] },

  // ----- ENERGIA -----
  { bairroId: "itaquera", tema: "energia", valores: [168, 166, 170, 169, 172, 171, 174, 173, 175, 174, 176, 175] },
  { bairroId: "capao", tema: "energia", valores: [150, 152, 151, 155, 154, 156, 153, 157, 158, 156, 159, 158] },
  { bairroId: "pinheiros", tema: "energia", valores: [170, 172, 178, 181, 179, 186, 190, 193, 192, 198, 203, 207] },
  { bairroId: "santana", tema: "energia", valores: [182, 185, 190, 186, 192, 195, 189, 196, 194, 199, 193, 198] },

  // ----- RESÍDUOS -----
  { bairroId: "itaquera", tema: "residuos", valores: [27, 27.4, 27.2, 28, 28.1, 28.6, 28.4, 29, 29.3, 29.1, 29.8, 30] },
  { bairroId: "capao", tema: "residuos", valores: [28, 28.5, 29, 30, 29.8, 31, 31.5, 32.4, 33, 33.2, 34.1, 34.8] },
  { bairroId: "pinheiros", tema: "residuos", valores: [31, 30.5, 31.2, 30.8, 31, 30.6, 31.1, 30.9, 31.3, 30.7, 31, 31.2] },
  { bairroId: "santana", tema: "residuos", valores: [26, 26.5, 26.2, 27, 27.5, 27.3, 28, 28.4, 28.1, 28.9, 29.2, 29.5] },
];

// Previsão sintética de 7 dias: usada SOMENTE se a API e o cache falharem
// (ex.: primeiro acesso sem internet). As datas são geradas no climaService.
export const climaSinteticoBase: Omit<DiaClima, "data">[] = [
  { chuvaMm: 4, tempMax: 27 },
  { chuvaMm: 18, tempMax: 25 },
  { chuvaMm: 32, tempMax: 23 },
  { chuvaMm: 12, tempMax: 24 },
  { chuvaMm: 2, tempMax: 26 },
  { chuvaMm: 0, tempMax: 28 },
  { chuvaMm: 6, tempMax: 27 },
];
