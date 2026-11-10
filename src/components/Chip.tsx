import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../theme';

type Props = {
  rotulo: string;
  selecionado: boolean;
  onPress: () => void;
};

// "Chip" de filtro (ex.: escolher o bairro ou o tema no painel)
export default function Chip({ rotulo, selecionado, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selecionado && styles.chipSelecionado]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: selecionado }}
    >
      <Text style={[styles.texto, selecionado && styles.textoSelecionado]}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelecionado: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { fontSize: 14, color: cores.textoForte, fontWeight: '600' },
  textoSelecionado: { color: '#fff' },
});
