import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tela } from '../types';
import { cores, ALVO_MINIMO } from '../theme';

type Props = {
  abaAtiva: Tela;
  onNavegar: (tela: Tela) => void;
  totalAlertas: number; // número mostrado como "selo" na aba Alertas
};

// As 4 abas principais. As demais telas (detalhe, decisão) são abertas "por cima".
const abas: { tela: Tela; rotulo: string; icone: string }[] = [
  { tela: 'painel', rotulo: 'Painel', icone: '📊' },
  { tela: 'alertas', rotulo: 'Alertas', icone: '🔔' },
  { tela: 'historico', rotulo: 'Decisões', icone: '📋' },
  { tela: 'sobre', rotulo: 'Sobre', icone: 'ℹ️' },
];

// Barra de navegação inferior (substitui uma biblioteca de navegação,
// mantendo o padrão "telaAtual" do projeto anterior).
export default function TabBar({ abaAtiva, onNavegar, totalAlertas }: Props) {
  // Respeita a área segura do aparelho (ex.: barra de gestos do iPhone)
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 4) }]} accessibilityRole="tablist">
      {abas.map((aba) => {
        const ativa = aba.tela === abaAtiva;
        const rotuloAcessivel =
          aba.tela === 'alertas' && totalAlertas > 0 ? `${aba.rotulo}, ${totalAlertas} ativos` : aba.rotulo;
        return (
          <TouchableOpacity
            key={aba.tela}
            style={styles.aba}
            onPress={() => onNavegar(aba.tela)}
            accessibilityRole="tab"
            accessibilityLabel={rotuloAcessivel}
            accessibilityState={{ selected: ativa }}
          >
            <Text style={styles.icone}>{aba.icone}</Text>
            <Text style={[styles.rotulo, ativa && styles.rotuloAtivo]}>{aba.rotulo}</Text>
            {aba.tela === 'alertas' && totalAlertas > 0 && (
              <View style={styles.contador}>
                <Text style={styles.contadorTexto}>{totalAlertas}</Text>
              </View>
            )}
            {ativa && <View style={styles.indicador} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  aba: { flex: 1, minHeight: ALVO_MINIMO + 8, alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  icone: { fontSize: 18 },
  rotulo: { fontSize: 12, color: cores.textoSuave, marginTop: 2 },
  rotuloAtivo: { color: cores.primaria, fontWeight: 'bold' },
  indicador: { position: 'absolute', top: 0, width: 36, height: 3, borderRadius: 2, backgroundColor: cores.primaria },
  contador: {
    position: 'absolute',
    top: 4,
    right: '22%',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: cores.alto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contadorTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
