import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Decisao } from '../types';
import { cores } from '../theme';
import { AvisoBox, Cabecalho, DecisaoCard } from '../components';

type Props = {
  decisoes: Decisao[];
};

export default function HistoricoScreen({ decisoes }: Props) {
  return (
    <View style={styles.tela}>
      <Cabecalho titulo="Decisões registradas" subtitulo="Histórico salvo neste aparelho" />

      <FlatList
        data={decisoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DecisaoCard decisao={item} />}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <AvisoBox texto="Toda decisão fica registrada com data, responsável e justificativa, para que possa ser revista e auditada." />
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma decisão registrada ainda. Abra um alerta e toque em "Registrar decisão".
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  lista: { padding: 16, paddingBottom: 24 },
  vazio: { textAlign: 'center', marginTop: 30, color: cores.textoSuave, lineHeight: 22 },
});
