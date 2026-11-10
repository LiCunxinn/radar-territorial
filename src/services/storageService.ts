// ============================================================
// Camada de PERSISTÊNCIA (AsyncStorage).
// Regra do projeto: as telas NUNCA falam direto com o storage;
// tudo passa por aqui. Guardamos apenas:
//   - o histórico de decisões do gestor
//   - o último clima baixado (cache para uso offline)
// Nenhum dado pessoal de cidadão é armazenado.
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Decisao, DiaClima } from "../types";

const CHAVE_DECISOES = "@radar_decisoes";
const CHAVE_CLIMA = "@radar_clima_cache";

export const storageService = {
  // ----- Decisões -----
  async getDecisoes(): Promise<Decisao[]> {
    try {
      const data = await AsyncStorage.getItem(CHAVE_DECISOES);
      return data !== null ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao buscar decisões:", error);
      return [];
    }
  },

  // Salva a decisão no topo da lista e devolve a lista atualizada
  async saveDecisao(novaDecisao: Decisao): Promise<Decisao[]> {
    try {
      const atuais = await this.getDecisoes();
      const atualizadas = [novaDecisao, ...atuais];
      await AsyncStorage.setItem(CHAVE_DECISOES, JSON.stringify(atualizadas));
      return atualizadas;
    } catch (error) {
      console.error("Erro ao salvar decisão:", error);
      throw error;
    }
  },

  // ----- Cache do clima -----
  async getClimaCache(): Promise<DiaClima[] | null> {
    try {
      const data = await AsyncStorage.getItem(CHAVE_CLIMA);
      return data !== null ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao ler cache do clima:", error);
      return null;
    }
  },

  async saveClimaCache(dias: DiaClima[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CHAVE_CLIMA, JSON.stringify(dias));
    } catch (error) {
      // Falhar ao gravar o cache não pode quebrar o app: só registramos.
      console.error("Erro ao salvar cache do clima:", error);
    }
  },
};
