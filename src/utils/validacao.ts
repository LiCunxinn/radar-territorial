// ============================================================
// Validação do formulário de decisão do gestor.
// Fica separada da tela para ser fácil de ler e de testar.
// ============================================================

import { AcaoDecisao } from "../types";

export type ErrosDecisao = {
  acao?: string;
  justificativa?: string;
  responsavel?: string;
};

// Padrões simples para detectar dados pessoais digitados por engano.
// O painel trabalha só com dados agregados: não queremos CPF, e-mail
// ou telefone de cidadãos salvos no histórico (privacidade / LGPD).
const REGEX_CPF = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
const REGEX_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const REGEX_TELEFONE = /(\(?\d{2}\)?\s?)?\b9?\d{4}-?\d{4}\b/;

export function contemDadoPessoal(texto: string): boolean {
  return REGEX_CPF.test(texto) || REGEX_EMAIL.test(texto) || REGEX_TELEFONE.test(texto);
}

type CamposDecisao = {
  acao: AcaoDecisao | null;
  justificativa: string;
  responsavel: string;
};

// Retorna um objeto com UMA mensagem por campo inválido.
// Objeto vazio = formulário válido.
export function validarDecisao({ acao, justificativa, responsavel }: CamposDecisao): ErrosDecisao {
  const erros: ErrosDecisao = {};

  if (!acao) {
    erros.acao = "Escolha uma ação.";
  }

  const textoJustificativa = justificativa.trim();
  if (textoJustificativa.length < 20) {
    erros.justificativa = "Explique sua decisão com pelo menos 20 caracteres.";
  } else if (textoJustificativa.length > 300) {
    erros.justificativa = "Use no máximo 300 caracteres.";
  } else if (contemDadoPessoal(textoJustificativa)) {
    erros.justificativa = "Não inclua CPF, e-mail ou telefone de cidadãos.";
  }

  const textoResponsavel = responsavel.trim();
  if (textoResponsavel.length < 3) {
    erros.responsavel = "Informe seu nome ou matrícula (mín. 3 caracteres).";
  } else if (contemDadoPessoal(textoResponsavel)) {
    erros.responsavel = "Use apenas nome ou matrícula funcional.";
  }

  return erros;
}
