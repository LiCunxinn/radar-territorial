import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Nivel } from '../types';
import { cores } from '../theme';
import { rotuloConfianca } from '../utils/formatadores';

type Props = {
  percentual: number; // 0 a 100
  nivel: Nivel; // "alto" aqui = confiança ALTA
};

// Cor da barra por nível de confiança (cinza = pouca confiança, não é "perigo")
const corConfianca: Record<Nivel, string> = {
  alto: cores.primaria,
  medio: cores.medio,
  baixo: cores.textoSuave,
};

// Barra de progresso que mostra o quanto o sistema confia na previsão.
export default function BarraConfianca({ percentual, nivel }: Props) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Nível de confiança: ${rotuloConfianca[nivel]}, ${percentual} por cento`}
      accessibilityValue={{ min: 0, max: 100, now: percentual }}
    >
      <Text style={styles.texto}>
        Confiança: <Text style={styles.destaque}>{rotuloConfianca[nivel]} ({percentual}%)</Text>
      </Text>
      <View style={styles.trilho}>
        <View style={[styles.preenchimento, { width: `${percentual}%`, backgroundColor: corConfianca[nivel] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  texto: { fontSize: 14, color: cores.textoForte },
  destaque: { fontWeight: 'bold' },
  trilho: { height: 10, borderRadius: 5, backgroundColor: cores.borda, marginTop: 6, overflow: 'hidden' },
  preenchimento: { height: 10, borderRadius: 5 },
});
