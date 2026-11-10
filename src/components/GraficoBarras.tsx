import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme';
import { formatarNumero } from '../utils/formatadores';

type Props = {
  valores: number[]; // dados reais
  rotulos: string[]; // um rótulo por barra (reais + projeção)
  unidade: string;
  decimais?: number;
  projecao?: number[]; // barras extras, em outra cor
  limite?: number; // linha horizontal da meta
  cor?: string;
  mostrarTodosValores?: boolean; // true = escreve o valor em cima de TODAS as barras
};

const ALTURA = 150;

// Gráfico de barras feito só com <View>, sem biblioteca externa.
// A altura de cada barra é proporcional ao valor: (valor / máximo) * ALTURA.
// Assim o grupo entende exatamente como o gráfico funciona.
export default function GraficoBarras({
  valores,
  rotulos,
  unidade,
  decimais = 0,
  projecao = [],
  limite,
  cor = cores.primaria,
  mostrarTodosValores = false,
}: Props) {
  const todos = [...valores, ...projecao];
  // 15% de folga no topo para caber o texto do valor acima da maior barra
  const maximo = Math.max(...todos, limite ?? 0) * 1.15;

  // Sem destaque total, mostramos só o último valor real e a última projeção
  const destaques = projecao.length > 0 ? [valores.length - 1, todos.length - 1] : [todos.length - 1];

  // Texto alternativo: leitores de tela leem os números, já que não "enxergam" barras
  const descricao =
    `Gráfico de barras em ${unidade}. ` +
    todos.map((v, i) => `${rotulos[i]}${i >= valores.length ? ' (projeção)' : ''}: ${formatarNumero(v, decimais)}`).join('; ') +
    (limite !== undefined ? `. Meta: ${formatarNumero(limite, decimais)}.` : '.');

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={descricao}>
      <View style={styles.area}>
        {/* Linha da meta, desenhada atrás das barras */}
        {limite !== undefined && (
          <>
            <View style={[styles.linhaMeta, { bottom: (limite / maximo) * ALTURA }]} />
            <Text style={[styles.rotuloMeta, { bottom: (limite / maximo) * ALTURA + 2 }]}>
              Meta {formatarNumero(limite, decimais)}
            </Text>
          </>
        )}

        <View style={styles.barras}>
          {todos.map((valor, i) => {
            const ehProjecao = i >= valores.length;
            const altura = Math.max(2, (valor / maximo) * ALTURA);
            const mostrarValor = mostrarTodosValores || destaques.includes(i);
            return (
              <View key={i} style={styles.coluna}>
                {mostrarValor && <Text style={styles.valor}>{formatarNumero(valor, decimais)}</Text>}
                <View
                  style={[
                    styles.barra,
                    { height: altura, backgroundColor: ehProjecao ? cores.projecao : cor },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Rótulos do eixo X */}
      <View style={styles.linhaRotulos}>
        {rotulos.map((rotulo, i) => (
          <Text key={i} style={styles.rotulo}>{rotulo}</Text>
        ))}
      </View>

      {/* Legenda */}
      <View style={styles.legenda}>
        <View style={[styles.quadrado, { backgroundColor: cor }]} />
        <Text style={styles.textoLegenda}>{unidade}</Text>
        {projecao.length > 0 && (
          <>
            <View style={[styles.quadrado, { backgroundColor: cores.projecao, marginLeft: 12 }]} />
            <Text style={styles.textoLegenda}>projeção</Text>
          </>
        )}
        {limite !== undefined && (
          <>
            <View style={[styles.tracoLegenda, { backgroundColor: cores.alto }]} />
            <Text style={styles.textoLegenda}>meta</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: { height: ALTURA, justifyContent: 'flex-end', borderBottomWidth: 1, borderBottomColor: cores.borda },
  barras: { flexDirection: 'row', alignItems: 'flex-end', height: ALTURA },
  coluna: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barra: { width: '65%', borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  valor: { fontSize: 10, fontWeight: 'bold', color: cores.textoForte, width: 40, textAlign: 'center' },
  linhaMeta: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: cores.alto, opacity: 0.8 },
  rotuloMeta: {
    position: 'absolute',
    left: 0,
    fontSize: 10,
    fontWeight: 'bold',
    color: cores.alto,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 2,
  },
  linhaRotulos: { flexDirection: 'row', marginTop: 4 },
  rotulo: { flex: 1, textAlign: 'center', fontSize: 9, color: cores.textoSuave },
  legenda: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  quadrado: { width: 10, height: 10, borderRadius: 2, marginRight: 4 },
  tracoLegenda: { width: 14, height: 2, marginLeft: 12, marginRight: 4 },
  textoLegenda: { fontSize: 11, color: cores.textoSuave },
});
