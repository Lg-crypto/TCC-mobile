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
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import { criarRegistro } from '@/services/Registros';
import { Cores, Fontes } from '@/constants/theme';

const CORES = Cores;

const CATEGORIAS_GANHO = [
  { valor: 'Salary', rotulo: 'Salário' },
  { valor: 'Other', rotulo: 'Freelance / Outros' },
];
const CATEGORIAS_GASTO = [
  { valor: 'House', rotulo: 'Casa' },
  { valor: 'Shopping', rotulo: 'Mercado / Compras' },
  { valor: 'Food', rotulo: 'Alimentação' },
  { valor: 'Transport', rotulo: 'Transporte' },
  { valor: 'Entertainment', rotulo: 'Entretenimento' },
  { valor: 'Other', rotulo: 'Outros' },
];

export function FormularioTransacao() {
  const [tipo, setTipo] = useState('Ganhos');
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [categoria, setCategoria] = useState('Salary');
  const [seletorCategoriaAberto, setSeletorCategoriaAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);
  const categorias = tipo === 'Ganhos' ? CATEGORIAS_GANHO : CATEGORIAS_GASTO;

  const salvar = async () => {
    const valorLimpo = valor.trim().replace(/\s/g, '').replace(/^R\$/i, '');
    const valorNormalizado = valorLimpo.includes(',')
      ? valorLimpo.replace(/\./g, '').replace(',', '.')
      : valorLimpo;
    const valorNumerico = Number(valorNormalizado);
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
        description: nome.trim(), destination_or_source: categoria,
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
          <MaterialIcons name="sell" size={18} color={CORES.textoSecundario} />
          <TextInput
            accessibilityLabel="Nome da transação"
            placeholder="Ex.: Salgado da cantina"
            placeholderTextColor={CORES.textoSecundario}
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
          <MaterialIcons name="swap-vert" size={18} color={CORES.textoSecundario} />
          <Text style={styles.valorSeletor}>{tipo}</Text>
          <MaterialIcons name="arrow-drop-down" size={22} color={CORES.textoSecundario} />
        </Pressable>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Categoria</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Categoria da transação: ${categorias.find((item) => item.valor === categoria)?.rotulo ?? categoria}`}
          onPress={() => setSeletorCategoriaAberto(true)}
          style={styles.seletor}
        >
          <MaterialIcons name="label-outline" size={18} color={CORES.textoSecundario} />
          <Text style={styles.valorSeletor}>
            {categorias.find((item) => item.valor === categoria)?.rotulo ?? categoria}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={22} color={CORES.textoSecundario} />
        </Pressable>
      </View>

      <View style={styles.campoGrupo}>
        <Text style={styles.rotulo}>Valor</Text>
        <View style={styles.entradaComIcone}>
          <MaterialIcons name="payments" size={18} color={CORES.textoSecundario} />
          <TextInput
            accessibilityLabel="Valor da transação"
            keyboardType="decimal-pad"
            placeholder="R$ 0,00"
            placeholderTextColor={CORES.textoSecundario}
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
          placeholderTextColor={CORES.textoSecundario}
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
          <MaterialIcons name="add" size={20} color={CORES.branco} />
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
                  setCategoria(opcao === 'Ganhos' ? 'Salary' : 'House');
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

      <Modal
        animationType="fade"
        transparent
        visible={seletorCategoriaAberto}
        onRequestClose={() => setSeletorCategoriaAberto(false)}
      >
        <View style={styles.fundoModal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar opções de categoria"
            onPress={() => setSeletorCategoriaAberto(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.opcoesTipo}>
            {categorias.map((opcao) => (
              <Pressable
                accessibilityRole="button"
                key={opcao.valor}
                onPress={() => {
                  setCategoria(opcao.valor);
                  setSeletorCategoriaAberto(false);
                }}
                style={styles.opcaoTipo}
              >
                <Text style={styles.valorSeletor}>{opcao.rotulo}</Text>
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
  titulo: { color: CORES.texto, fontSize: Fontes.tamanhos.subtitulo, fontFamily: Fontes.negrito },
  descricao: { color: CORES.textoSecundario, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.regular, lineHeight: 16 },
  campoGrupo: { gap: 7 },
  rotulo: { color: CORES.textoSuave, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.regular },
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
  entradaTexto: {
    flex: 1,
    minHeight: 44,
    color: CORES.texto,
    fontSize: Fontes.tamanhos.corpo,
    fontFamily: Fontes.regular,
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
  valorSeletor: { color: CORES.texto, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular, flex: 1 },
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
    borderColor: CORES.bordaSecundaria,
    borderRadius: 12,
  },
  textoCancelar: { color: CORES.textoSuave, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular },
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
  textoSalvar: { color: CORES.branco, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.negrito },
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: CORES.fundoModal,
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
