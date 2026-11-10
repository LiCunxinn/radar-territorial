import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  texto: string;
  cor: string;
};

// Selo (badge) colorido, igual ao usado nos cards do projeto anterior.
// O TEXTO sempre aparece junto da cor: ninguém depende só da cor para entender.
export default function Selo({ texto, cor }: Props) {
  return (
    <View style={[styles.selo, { backgroundColor: cor }]}>
      <Text style={styles.texto}>{texto.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  texto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
