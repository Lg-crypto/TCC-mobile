import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAutenticacaoContexto } from '@/context/autenticacao-contexto';
import { NavegacaoInferior } from '@/components/registro/navegacao-inferior';
import { observarRegistros, type Registro } from '@/services/Registros';
import { Cores, Fontes } from '@/constants/theme';

const DINHEIRO = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function InicioScreen() {
  const { usuario } = useAutenticacaoContexto();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [erroRegistros, setErroRegistros] = useState(false);
  useEffect(() => {
    if (!usuario?.uid) return;
    return observarRegistros(
      usuario.uid,
      (novosRegistros) => {
        setRegistros(novosRegistros);
        setErroRegistros(false);
      },
      () => setErroRegistros(true),
    );
  }, [usuario?.uid]);
  const totais = useMemo(() => registros.reduce((acumulado, registro) => {
    if (registro.gain) acumulado.ganhos += registro.value;
    else acumulado.gastos += registro.value;
    return acumulado;
  }, { ganhos: 0, gastos: 0 }), [registros]);
  const primeiroNome = usuario?.displayName?.split(' ')[0] || 'Olá';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.eyebrow}>VISÃO GERAL</Text>
        <Text style={styles.titulo}>Olá, {primeiroNome}</Text>

        <View style={styles.saldo}>
          <Text style={styles.rotuloSaldo}>SALDO ATUAL</Text>
          <Text style={styles.valorSaldo}>{DINHEIRO.format(totais.ganhos - totais.gastos)}</Text>
          <Text style={styles.descricaoSaldo}>Saldo calculado a partir dos seus lançamentos.</Text>
        </View>

        <View style={styles.resumos}>
          <View style={styles.cartaoResumo}>
            <Text style={styles.rotuloResumo}>Ganhos</Text>
            <Text style={[styles.valorResumo, styles.positivo]}>{DINHEIRO.format(totais.ganhos)}</Text>
          </View>
          <View style={styles.cartaoResumo}>
            <Text style={styles.rotuloResumo}>Gastos</Text>
            <Text style={[styles.valorResumo, styles.negativo]}>{DINHEIRO.format(totais.gastos)}</Text>
          </View>
        </View>

        <View style={styles.historico}>
          <Text style={styles.tituloHistorico}>Histórico de transações</Text>
          {erroRegistros ? <Text style={styles.vazio}>Não foi possível carregar os lançamentos.</Text> : registros.length === 0 ? <Text style={styles.vazio}>Nenhuma transação registrada.</Text> : registros.slice(0, 5).map((registro) => (
            <View key={registro.id} style={styles.registro}>
              <View style={styles.registroTexto}>
                <Text numberOfLines={1} style={styles.registroNome}>{registro.description}</Text>
                <Text style={styles.registroData}>{registro.date} · {registro.destination_or_source}</Text>
              </View>
              <Text style={[styles.valorResumo, registro.gain ? styles.positivo : styles.negativo]}>
                {registro.gain ? '+' : '−'}{DINHEIRO.format(registro.value)}
              </Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => router.push('/criar-registro')} style={styles.botaoAdicionar}>
          <MaterialIcons name="add" size={22} color={Cores.branco} />
          <Text style={styles.textoBotao}>Nova transação</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.rodape}>
        <NavegacaoInferior selecionado="Início" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { flexGrow: 1, padding: 22, gap: 18 },
  eyebrow: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.legenda, fontFamily: Fontes.negrito, letterSpacing: 1.2, marginTop: 12 },
  titulo: { color: Cores.texto, fontSize: Fontes.tamanhos.titulo, fontFamily: Fontes.negrito, marginTop: -13 },
  saldo: { padding: 20, borderRadius: 18, borderWidth: 1, borderColor: Cores.borda, backgroundColor: Cores.painel, gap: 7 },
  rotuloSaldo: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.legenda, fontFamily: Fontes.regular, letterSpacing: 1 },
  valorSaldo: { color: Cores.texto, fontSize: Fontes.tamanhos.destaque, fontFamily: Fontes.negrito },
  descricaoSaldo: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.regular },
  resumos: { flexDirection: 'row', gap: 12 },
  cartaoResumo: { flex: 1, minHeight: 82, justifyContent: 'center', gap: 6, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Cores.borda, backgroundColor: Cores.painel },
  rotuloResumo: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.regular },
  valorResumo: { fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.negrito },
  positivo: { color: Cores.positivo },
  negativo: { color: Cores.negativo },
  historico: { gap: 14, paddingTop: 7 },
  tituloHistorico: { color: Cores.texto, fontSize: Fontes.tamanhos.medio, fontFamily: Fontes.negrito },
  vazio: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular, paddingVertical: 18, textAlign: 'center' },
  registro: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 13, borderRadius: 12, borderWidth: 1, borderColor: Cores.borda, backgroundColor: Cores.painel },
  registroTexto: { flex: 1, gap: 4 },
  registroNome: { color: Cores.texto, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular },
  registroData: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.legenda, fontFamily: Fontes.regular },
  botaoAdicionar: { height: 48, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, borderRadius: 12, backgroundColor: Cores.verde },
  textoBotao: { color: Cores.branco, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.negrito },
  rodape: { paddingTop: 8, paddingBottom: 18 },
});
