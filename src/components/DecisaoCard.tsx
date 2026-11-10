import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AcaoDecisao, Decisao } from '../types';
import { cores } from '../theme';
import Selo from './Selo';

type Props = {
  decisao: Decisao;
};

// Texto e cor de cada ação possível do gestor
export const infoAcao: Record<AcaoDecisao, { rotulo: string; cor: string }> = {
  acionar: { rotulo: 'Equipe acionada', cor: cores.primaria },
  monitorar: { rotulo: 'Monitorar', cor: cores.medio },
  descartar: { rotulo: 'Descartado', cor: cores.textoSuave },
};

// Card do histórico: mostra quem decidiu, o quê e POR QUÊ (rastreabilidade).
export default function DecisaoCard({ decisao }: Props) {
  const { rotulo, cor } = infoAcao[decisao.acao];

  return (
    <View
      style={[styles.card, { borderLeftColor: cor }]}
      accessible
      accessibilityLabel={
        `${rotulo}. ${decisao.alertaTitulo}, ${decisao.bairroNome}. ` +
        `Registrada em ${decisao.data} por ${decisao.responsavel}. Justificativa: ${decisao.justificativa}`
      }
    >
      <View style={styles.header}>
        <Text style={styles.titulo}>{decisao.alertaTitulo}</Text>
        <Selo texto={rotulo} cor={cor} />
      </View>
      <Text style={styles.local}>{decisao.bairroNome}</Text>
      <Text style={styles.justificativa}>{decisao.justificativa}</Text>
      <Text style={styles.rodape}>
        {decisao.data} {'•'} {decisao.responsavel}
      </Text>
    </View>
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
  titulo: { flex: 1, fontSize: 15, fontWeight: 'bold', color: cores.textoForte, marginRight: 8 },
  local: { fontSize: 13, color: cores.textoSuave, marginTop: 4 },
  justificativa: { fontSize: 14, color: cores.textoForte, marginTop: 8, lineHeight: 20 },
  rodape: { fontSize: 12, color: cores.textoSuave, marginTop: 8 },
});
