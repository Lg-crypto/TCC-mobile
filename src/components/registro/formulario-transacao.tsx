import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { criarRegistro } from '@/services/Registros';

const CORES = {
  painel: '#17191f',
  campo: '#101218',
  borda: '#2b2e38',
  texto: '#f5f5f6',
  secundario: '#aeb2be',
  verde: '#23cb6b',
};

export function FormularioTransacao() {
  const [tipo, setTipo] = useState('Ganhos');
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    const valorNumerico = Number(valor.trim().replace(/\./g, '').replace(',', '.'));
    if (!nome.trim() || !Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Dados inválidos', 'Informe o nome da transação e um valor maior que zero.');
      return;
    }
    const agora = new Date();
    const data = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`;
    const dateKey = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    setSalvando(true);
    try {
      await criarRegistro({
        gain: tipo === 'Ganhos', value: valorNumerico, date: data, dateKey,
        description: nome.trim(), destination_or_source: tipo === 'Ganhos' ? 'Other' : 'Food',
        comment: comentario.trim(),
      });
      Alert.alert('Transação salva', 'O lançamento foi adicionado ao seu histórico.');
      router.replace('/inicio');
    } catch (erro) {
      Alert.alert('Não foi possível salvar', erro instanceof Error ? erro.message : 'Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.cartao}>
      <View style={styles.introducao}>
        <Text style={styles.titulo}>Nova transação</Text>
        <Text style={styles.descricao}>
          Preencha os campos abaixo para registrar um novo lançamento.
        </Text>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Nome</Text>
        <View style={styles.entradaComIcone}>
          <Text style={styles.iconeCampo}>◇</Text>
          <TextInput
            accessibilityLabel="Nome da transação"
            placeholder="Ex.: Salgado da cantina"
            placeholderTextColor={CORES.secundario}
            onChangeText={setNome}
            style={styles.entradaTexto}
            value={nome}
          />
        </View>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Tipo</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Tipo da transação: ${tipo}`}
          onPress={() => setSeletorAberto(true)}
          style={styles.seletor}
        >
          <Text style={styles.iconeCampo}>▣</Text>
          <Text style={styles.valorSeletor}>{tipo}</Text>
          <Text style={styles.seta}>⌄</Text>
        </Pressable>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Valor</Text>
        <View style={styles.entradaComIcone}>
          <Text style={styles.iconeCampo}>$</Text>
          <TextInput
            accessibilityLabel="Valor da transação"
            keyboardType="decimal-pad"
            placeholder="R$ 0,00"
            placeholderTextColor={CORES.secundario}
            onChangeText={setValor}
            style={styles.entradaTexto}
            value={valor}
          />
        </View>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Comentário</Text>
        <TextInput
          accessibilityLabel="Comentário da transação"
          multiline
          placeholder="Adicione uma observação (opcional)"
          placeholderTextColor={CORES.secundario}
          onChangeText={setComentario}
          style={[styles.entradaTexto, styles.comentario]}
          textAlignVertical="top"
          value={comentario}
        />
      </View>

      <View style={styles.acoes}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.botaoCancelar}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={salvando} onPress={salvar} style={styles.botaoSalvar}>
          <Text style={styles.mais}>＋</Text>
          <Text style={styles.textoSalvar}>{salvando ? 'Salvando…' : 'Salvar transação'}</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={seletorAberto}
        onRequestClose={() => setSeletorAberto(false)}
      >
        <View style={styles.fundoModal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar opções de tipo"
            onPress={() => setSeletorAberto(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.opcoesTipo}>
            {['Ganhos', 'Gastos'].map((opcao) => (
              <Pressable
                accessibilityRole="button"
                key={opcao}
                onPress={() => {
                  setTipo(opcao);
                  setSeletorAberto(false);
                }}
                style={styles.opcaoTipo}
              >
                <Text style={styles.valorSeletor}>{opcao}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CORES.borda,
    backgroundColor: CORES.painel,
    padding: 20,
    gap: 14,
  },
  introducao: { gap: 4, marginBottom: 1 },
  titulo: { color: CORES.texto, fontSize: 20, fontWeight: '700' },
  descricao: { color: CORES.secundario, fontSize: 12, lineHeight: 16 },
  campoGrupo: { gap: 7 },
  rotulo: { color: '#d6d8df', fontSize: 12, fontWeight: '500' },
  entradaComIcone: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    backgroundColor: CORES.campo,
  },
  iconeCampo: { color: CORES.secundario, fontSize: 17, minWidth: 16 },
  entradaTexto: {
    flex: 1,
    minHeight: 44,
    color: CORES.texto,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  seletor: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    backgroundColor: CORES.campo,
  },
  valorSeletor: { color: CORES.texto, fontSize: 13, flex: 1 },
  seta: { color: CORES.secundario, fontSize: 20, marginTop: -7 },
  comentario: {
    minHeight: 82,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 12,
    backgroundColor: CORES.campo,
    paddingHorizontal: 12,
  },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 2 },
  botaoCancelar: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#30343f',
    borderRadius: 12,
  },
  textoCancelar: { color: '#d7d9df', fontSize: 13 },
  botaoSalvar: {
    flex: 1.25,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 12,
    backgroundColor: CORES.verde,
  },
  mais: { color: 'white', fontSize: 20, fontWeight: '600' },
  textoSalvar: { color: 'white', fontSize: 12, fontWeight: '700' },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#00000099',
    overflow: 'hidden',
  },
  opcoesTipo: {
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 14,
    backgroundColor: CORES.painel,
    paddingHorizontal: 16,
  },
  opcaoTipo: { paddingVertical: 17 },
});
