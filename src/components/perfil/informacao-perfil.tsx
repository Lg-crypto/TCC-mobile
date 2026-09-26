import { StyleSheet, Text, View } from 'react-native';

export function InformacaoPerfil({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text selectable style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7, paddingVertical: 2 },
  rotulo: { color: '#91939f', fontSize: 15 },
  valor: { color: '#f1f2f5', fontSize: 17 },
});
