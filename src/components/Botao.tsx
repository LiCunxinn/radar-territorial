import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, ALVO_MINIMO } from '../theme';

type Props = {
  titulo: string;
  onPress: () => void;
  // primario = ação principal | secundario = ação de apoio (contorno)
  variante?: 'primario' | 'secundario';
  desabilitado?: boolean;
  dica?: string; // texto extra lido por leitores de tela (accessibilityHint)
};

// Botão padrão do app. Usamos TouchableOpacity (em vez do <Button> nativo)
// para termos a MESMA aparência no Android, iOS e web.
export default function Botao({ titulo, onPress, variante = 'primario', desabilitado = false, dica }: Props) {
  const ehPrimario = variante === 'primario';

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        ehPrimario ? styles.primario : styles.secundario,
        desabilitado && styles.desabilitado,
      ]}
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: desabilitado }}
    >
      <Text style={[styles.texto, ehPrimario ? styles.textoPrimario : styles.textoSecundario]}>
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: ALVO_MINIMO,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.superficie, borderWidth: 1.5, borderColor: cores.primaria },
  desabilitado: { opacity: 0.5 },
  texto: { fontSize: 16, fontWeight: 'bold' },
  textoPrimario: { color: '#fff' },
  textoSecundario: { color: cores.primaria },
});
