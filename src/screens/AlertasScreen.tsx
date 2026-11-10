import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Alerta } from '../types';
import { cores } from '../theme';
import { AlertaCard, AvisoBox, Cabecalho } from '../components';

type Props = {
  alertas: Alerta[];
  onSelecionar: (alerta: Alerta) => void;
};

export default function AlertasScreen({ alertas, onSelecionar }: Props) {
  return (
    <View style={styles.tela}>
      <Cabecalho titulo="Alertas preditivos" subtitulo="Ordenados do mais grave para o menos grave" />

      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertaCard alerta={item} onPress={() => onSelecionar(item)} />}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <AvisoBox
            titulo="Apoio à decisão"
            texto="Os alertas são previsões com margem de erro. Eles indicam onde olhar primeiro, mas quem decide é o gestor."
          />
        }
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum alerta ativo no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  lista: { padding: 16, paddingBottom: 24 },
  vazio: { textAlign: 'center', marginTop: 30, color: cores.textoSuave },
});
