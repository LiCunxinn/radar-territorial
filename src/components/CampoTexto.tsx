import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { cores } from '../theme';

type Props = {
  rotulo: string;
  valor: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  erro?: string; // mensagem de validação (some quando o campo está correto)
  multiline?: boolean;
  maxLength?: number; // se informado, mostra o contador de caracteres
};

// Campo de formulário com rótulo, mensagem de erro e contador.
// O erro aparece em TEXTO (e não só na cor da borda) e é anunciado
// automaticamente por leitores de tela (accessibilityLiveRegion).
export default function CampoTexto({ rotulo, valor, onChangeText, placeholder, erro, multiline, maxLength }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea, erro ? styles.inputErro : null]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7B79"
        multiline={multiline}
        maxLength={maxLength}
        accessibilityLabel={rotulo}
        accessibilityHint={erro}
      />
      <View style={styles.rodape}>
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro ? `⚠ ${erro}` : ''}
        </Text>
        {maxLength ? <Text style={styles.contador}>{valor.length}/{maxLength}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginVertical: 6 },
  rotulo: { fontSize: 14, fontWeight: 'bold', color: cores.textoForte, marginBottom: 4 },
  input: {
    backgroundColor: cores.superficie,
    minHeight: 48,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: cores.borda,
    fontSize: 16,
    color: cores.textoForte,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  inputErro: { borderColor: cores.erro },
  rodape: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  erro: { flex: 1, fontSize: 13, color: cores.erro, fontWeight: '600' },
  contador: { fontSize: 12, color: cores.textoSuave },
});
