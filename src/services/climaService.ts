// ============================================================
// Camada de API: previsão do tempo da API pública Open-Meteo
// (https://open-meteo.com). Não exige chave e envia APENAS as
// coordenadas do centro da cidade (nenhum dado de cidadão).
//
// Estratégia de resiliência (3 níveis):
//   1) API no ar            -> fonte "api"       (e salva no cache)
//   2) API fora / sem rede  -> fonte "cache"     (última resposta boa)
//   3) sem cache ainda      -> fonte "sintetico" (dados de demonstração)
// A tela mostra a fonte para o gestor saber o quanto confiar.
// ============================================================

import { DiaClima, ResultadoClima } from "../types";
import { climaSinteticoBase } from "../data/mock";
import { storageService } from "./storageService";

// Centro de São Paulo
const LATITUDE = -23.55;
const LONGITUDE = -46.63;
const URL_API =
  `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
  `&daily=precipitation_sum,temperature_2m_max&forecast_days=7&timezone=America%2FSao_Paulo`;

const TEMPO_LIMITE_MS = 8000;

// Date -> "AAAA-MM-DD" (no fuso local)
function paraIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// Chama a API e converte a resposta para o nosso tipo DiaClima[]
async function buscarNaApi(): Promise<DiaClima[]> {
  // AbortController cancela a requisição se ela demorar demais
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(URL_API, { signal: controlador.signal });
    if (!resposta.ok) {
      throw new Error(`Open-Meteo respondeu ${resposta.status}`);
    }
    const json = await resposta.json();

    const datas: string[] = json?.daily?.time;
    const chuvas: (number | null)[] = json?.daily?.precipitation_sum;
    const temps: (number | null)[] = json?.daily?.temperature_2m_max;
    if (!Array.isArray(datas) || !Array.isArray(chuvas) || !Array.isArray(temps)) {
      throw new Error("Resposta da API em formato inesperado");
    }

    // A API pode devolver null em algum dia: tratamos como 0
    return datas.map((data, i) => ({
      data,
      chuvaMm: chuvas[i] ?? 0,
      tempMax: temps[i] ?? 0,
    }));
  } finally {
    clearTimeout(timer);
  }
}

// Gera 7 dias de dados de demonstração a partir de hoje
function climaSintetico(): DiaClima[] {
  return climaSinteticoBase.map((dia, i) => {
    const data = new Date();
    data.setDate(data.getDate() + i);
    return { ...dia, data: paraIso(data) };
  });
}

export const climaService = {
  async getClima(): Promise<ResultadoClima> {
    try {
      const dias = await buscarNaApi();
      await storageService.saveClimaCache(dias);
      return { dias, fonte: "api" };
    } catch (error) {
      console.warn("Falha ao consultar a API de clima:", error);

      const cache = await storageService.getClimaCache();
      if (cache && cache.length > 0) {
        return { dias: cache, fonte: "cache" };
      }
      return { dias: climaSintetico(), fonte: "sintetico" };
    }
  },
};
