import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { cores } from '../theme';
import { AvisoBox, Cabecalho } from '../components';

// Tela estática: transparência sobre dados, limitações e privacidade.
export default function SobreScreen() {
  return (
    <View style={styles.tela}>
      <Cabecalho titulo="Sobre o app" subtitulo={'Radar Territorial • versão 1.0.0'} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.texto}>
          O Radar Territorial ajuda o gestor público a antecipar problemas de água, energia, resíduos e clima
          em bairros da cidade, antes que eles afetem a população.
        </Text>

        <AvisoBox
          titulo="Fontes de dados"
          itens={[
            'Clima: API pública Open-Meteo (previsão de 7 dias para o centro de São Paulo).',
            'Consumo de água, energia e resíduos: dados sintéticos (fictícios) para demonstração.',
          ]}
        />

        <AvisoBox
          tipo="atencao"
          titulo="Limitações"
          itens={[
            'As previsões usam uma tendência linear simples e não captam sazonalidade.',
            'A confiança exibida é uma estimativa do modelo, não uma garantia.',
            'O clima é único para a cidade toda, sem detalhe por bairro.',
            'Os alertas indicam onde olhar primeiro: nunca substituem a avaliação de campo.',
          ]}
        />

        <AvisoBox
          titulo="Privacidade e decisão humana"
          itens={[
            'Todos os dados são agregados por bairro: nenhum dado pessoal de cidadão é coletado.',
            'A única informação enviada à internet são as coordenadas do centro da cidade.',
            'O histórico de decisões fica salvo apenas neste aparelho.',
            'O app nunca executa uma ação sozinho: toda decisão é registrada por uma pessoa.',
          ]}
        />

        <Text style={styles.rodape}>Global Solution 2026.2 {'•'} Cross-Platform Application Development</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: 16, paddingBottom: 24 },
  texto: { fontSize: 15, color: cores.textoForte, lineHeight: 22, marginBottom: 4 },
  rodape: { fontSize: 12, color: cores.textoSuave, textAlign: 'center', marginTop: 20 },
});
