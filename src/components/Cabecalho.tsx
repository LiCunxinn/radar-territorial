import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, ALVO_MINIMO } from '../theme';

type Props = {
  titulo: string;
  subtitulo?: string;
  onVoltar?: () => void; // se informado, mostra o botão "Voltar"
};

// Faixa de topo com a cor da marca, repetida em todas as telas.
export default function Cabecalho({ titulo, subtitulo, onVoltar }: Props) {
  return (
    <View style={styles.faixa}>
      {onVoltar && (
        <TouchableOpacity
          style={styles.voltar}
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.voltarTexto}>{'‹'} Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { backgroundColor: cores.primaria, paddingHorizontal: 16, paddingBottom: 14, paddingTop: 10 },
  voltar: { minHeight: ALVO_MINIMO, justifyContent: 'center', alignSelf: 'flex-start' },
  voltarTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subtitulo: { color: cores.primariaClara, fontSize: 13, marginTop: 2 },
});
