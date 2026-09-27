import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { FormularioTransacao } from '@/components/registro/formulario-transacao';
import { NavegacaoInferior } from '@/components/registro/navegacao-inferior';
import { Cores } from '@/constants/theme';

export default function CriarRegistroScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <FormularioTransacao />
      </ScrollView>
      <View style={styles.rodape}>
        <NavegacaoInferior />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 20,
  },
  rodape: { paddingTop: 8, paddingBottom: 18 },
});
