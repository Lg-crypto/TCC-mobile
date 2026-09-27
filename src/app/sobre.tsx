import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { NavegacaoInferior } from '@/components/registro/navegacao-inferior';
import { Cores, Fontes } from '@/constants/theme';

const FUNCIONALIDADES = [
  'Registre receitas e despesas com categoria, valor e comentário.',
  'Acompanhe seu saldo e o histórico de movimentações.',
  'Organize seus dados com uma conta protegida pelo Firebase Authentication.',
];

const INTEGRANTES = [
  'Francisco Halejandro',
  'Caio de Matos',
  'Bernardo Matos Yoshida',
  'Higor Gabriel',
];

export default function SobreScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.sobretitulo}>WWALLET</Text>
        <Text style={styles.titulo}>Sobre o aplicativo</Text>
        <Text style={styles.descricao}>
          O WWallet ajuda cada pessoa a acompanhar o dinheiro que recebe e gasta,
          reunindo seus lançamentos em um só lugar.
        </Text>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Objetivo</Text>
          <Text style={styles.texto}>
            Simplificar o controle financeiro pessoal para que o usuário entenda
            sua movimentação e tome decisões com mais clareza.
          </Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Funcionalidades</Text>
          {FUNCIONALIDADES.map((funcionalidade) => (
            <Text key={funcionalidade} style={styles.itemLista}>• {funcionalidade}</Text>
          ))}
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Integrantes</Text>
          {INTEGRANTES.map((integrante) => (
            <Text key={integrante} style={styles.integrante}>{integrante}</Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.rodape}>
        <NavegacaoInferior selecionado="Sobre" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { flexGrow: 1, padding: 22, paddingBottom: 30, gap: 16 },
  sobretitulo: { marginTop: 12, color: Cores.verde, fontSize: Fontes.tamanhos.pequeno, fontFamily: Fontes.negrito, letterSpacing: 1.4 },
  titulo: { color: Cores.texto, fontSize: Fontes.tamanhos.titulo, fontFamily: Fontes.negrito },
  descricao: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular, lineHeight: 22, marginBottom: 4 },
  cartao: { padding: 18, gap: 10, borderWidth: 1, borderColor: Cores.borda, borderRadius: 16, backgroundColor: Cores.painel },
  tituloSecao: { color: Cores.texto, fontSize: Fontes.tamanhos.subtitulo, fontFamily: Fontes.negrito },
  texto: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular, lineHeight: 22 },
  itemLista: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular, lineHeight: 22 },
  integrante: { color: Cores.texto, fontSize: Fontes.tamanhos.medio, fontFamily: Fontes.regular },
  rodape: { paddingTop: 8, paddingBottom: 18 },
});
