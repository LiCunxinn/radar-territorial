// ============================================================
// Funções pequenas de formatação, usadas por várias telas.
// ============================================================

import { Nivel } from "../types";

// 1234.5 -> "1234,5" (padrão brasileiro: vírgula decimal)
export function formatarNumero(valor: number, decimais: number = 0): string {
  return valor.toFixed(decimais).replace(".", ",");
}

// Data de hoje no formato DD/MM/AAAA (mesmo formato do projeto anterior)
export function dataHoje(): string {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${hoje.getFullYear()}`;
}

// "2026-11-06" -> "qui 06/11"
export function formatarDiaSemana(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  const nomes = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const data = new Date(ano, mes - 1, dia);
  return `${nomes[data.getDay()]} ${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`;
}

// Converte o percentual de confiança (0-100) em um nível.
// "alto" aqui significa confiança ALTA (e não risco alto!).
export function nivelDaConfianca(percentual: number): Nivel {
  if (percentual >= 70) return "alto";
  if (percentual >= 40) return "medio";
  return "baixo";
}

export const rotuloRisco: Record<Nivel, string> = {
  baixo: "ATENÇÃO",
  medio: "MÉDIO",
  alto: "ALTO",
};

export const rotuloConfianca: Record<Nivel, string> = {
  baixo: "Baixa",
  medio: "Média",
  alto: "Alta",
};
