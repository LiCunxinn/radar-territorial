import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme';

type Props = {
  titulo: string;
  valor: string;
  detalhe?: string;
  corValor?: string;
};

// Cartão de indicador (KPI): um número grande com título e legenda.
export default function IndicadorCard({ titulo, valor, detalhe, corValor = cores.textoForte }: Props) {
  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${titulo}: ${valor}${detalhe ? `. ${detalhe}` : ''}`}
    >
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={[styles.valor, { color: corValor }]}>{valor}</Text>
      {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: cores.superficie,
    padding: 10,
    borderRadius: 8,
    borderTopWidth: 4,
    borderTopColor: cores.primaria,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: { fontSize: 12, color: cores.textoSuave, fontWeight: '600' },
  valor: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  detalhe: { fontSize: 11, color: cores.textoSuave, marginTop: 2 },
});
