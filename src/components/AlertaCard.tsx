import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Alerta } from '../types';
import { cores, corDoNivel } from '../theme';
import { rotuloConfianca, rotuloRisco } from '../utils/formatadores';
import Selo from './Selo';

type Props = {
  alerta: Alerta;
  onPress: () => void;
};

// Card de alerta para a lista: mesmo padrão do OcorrenciaCard do projeto anterior
// (borda colorida à esquerda + selo de risco), agora com a confiança do modelo.
export default function AlertaCard({ alerta, onPress }: Props) {
  const corRisco = corDoNivel(alerta.nivel);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: corRisco }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        `Alerta de risco ${rotuloRisco[alerta.nivel]}. ${alerta.titulo}. ${alerta.bairroNome}. ` +
        `Confiança ${rotuloConfianca[alerta.nivelConfianca]}, ${alerta.confianca} por cento.`
      }
      accessibilityHint="Abre os detalhes do alerta"
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>{alerta.titulo}</Text>
        <Selo texto={rotuloRisco[alerta.nivel]} cor={corRisco} />
      </View>
      <Text style={styles.local}>{alerta.bairroNome}</Text>
      <Text style={styles.confianca}>
        Confiança {rotuloConfianca[alerta.nivelConfianca].toLowerCase()} ({alerta.confianca}%)
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { flex: 1, fontSize: 16, fontWeight: 'bold', color: cores.textoForte, marginRight: 8 },
  local: { fontSize: 14, color: cores.textoSuave, marginTop: 6 },
  confianca: { fontSize: 12, color: cores.textoSuave, marginTop: 4 },
});
