import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
            style={styles.entradaTexto}
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
            style={styles.entradaTexto}
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
          style={[styles.entradaTexto, styles.comentario]}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.acoes}>
        <View style={styles.botaoCancelar}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </View>
        <View style={styles.botaoSalvar}>
          <Text style={styles.mais}>＋</Text>
          <Text style={styles.textoSalvar}>Salvar transação</Text>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={seletorAberto}
        onRequestClose={() => setSeletorAberto(false)}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar opções de tipo"
          onPress={() => setSeletorAberto(false)}
          style={styles.fundoModal}
        >
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
        </Pressable>
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
