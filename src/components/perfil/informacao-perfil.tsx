import { StyleSheet, Text, View } from 'react-native';
import { Cores, Fontes } from '@/constants/theme';

export interface InformacaoPerfilProps {
  rotulo: string;
  valor: string;
}

export function InformacaoPerfil({ rotulo, valor }: InformacaoPerfilProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text selectable style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7, paddingVertical: 2 },
  rotulo: { color: Cores.textoSecundario, fontSize: Fontes.tamanhos.corpo, fontFamily: Fontes.regular },
  valor: { color: Cores.texto, fontSize: Fontes.tamanhos.medio, fontFamily: Fontes.regular },
});
