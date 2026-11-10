import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme';

type Props = {
  titulo?: string;
  texto?: string;
  itens?: string[]; // lista de tópicos (ex.: limitações)
  // info = recado neutro | atencao = ponto de cuidado
  tipo?: 'info' | 'atencao';
};

// Caixa de aviso. Usada para lembrar que o app APOIA a decisão humana,
// para listar limitações das previsões e para avisos de privacidade.
export default function AvisoBox({ titulo, texto, itens, tipo = 'info' }: Props) {
  const corFaixa = tipo === 'atencao' ? cores.medio : cores.primaria;
  const fundo = tipo === 'atencao' ? '#FFF4E5' : cores.primariaClara;

  return (
    <View style={[styles.caixa, { backgroundColor: fundo, borderLeftColor: corFaixa }]}>
      {titulo ? (
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
      ) : null}
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
      {itens?.map((item, i) => (
        <Text key={i} style={styles.item}>
          {'•'} {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { padding: 12, borderRadius: 8, borderLeftWidth: 5, marginVertical: 8 },
  titulo: { fontSize: 14, fontWeight: 'bold', color: cores.textoForte, marginBottom: 4 },
  texto: { fontSize: 14, color: cores.textoForte, lineHeight: 20 },
  item: { fontSize: 14, color: cores.textoForte, lineHeight: 20, marginTop: 4 },
});
