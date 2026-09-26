import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export function CabecalhoPerfil({ nome, provedor, foto, aoTrocarFoto, atualizandoFoto }: { nome: string; provedor: string; foto: string | null; aoTrocarFoto: () => void; atualizandoFoto: boolean }) {
  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.capa} />
      <Pressable accessibilityRole="button" accessibilityLabel={`Alterar foto de perfil de ${nome}`} onPress={aoTrocarFoto} style={styles.avatar}>
        {foto ? <Image source={{ uri: foto }} style={styles.foto} /> : <Text style={styles.iniciais}>{iniciais}</Text>}
        <View style={styles.indicadorCamera}>
          <Text style={styles.iconeCamera}>{atualizandoFoto ? '…' : '▣'}</Text>
        </View>
      </Pressable>
      <View style={styles.identificacao}>
        <Text style={styles.tipoConta}>{provedor}</Text>
        <Text style={styles.nome}>{nome}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 27 },
  capa: {
    height: 174,
    marginHorizontal: 6,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderColor: '#2c303a',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#5a7a7c',
  },
  avatar: {
    width: 136,
    height: 136,
    marginTop: -112,
    marginLeft: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
    borderWidth: 5,
    borderColor: '#0c0d10',
    backgroundColor: '#243a3e',
  },
  iniciais: { color: '#f5f5f6', fontSize: 34, fontWeight: '600' },
  foto: { width: '100%', height: '100%', borderRadius: 70 },
  indicadorCamera: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#ffffff99',
  },
  iconeCamera: { color: '#31333a', fontSize: 17 },
  identificacao: { marginTop: 11, paddingHorizontal: 24, gap: 5 },
  tipoConta: { color: '#f1f2f5', fontSize: 16 },
  nome: { color: '#f5f5f6', fontSize: 25, fontWeight: '700', lineHeight: 31 },
});
