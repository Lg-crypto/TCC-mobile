import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Cores, Fontes } from '@/constants/theme';

export interface CabecalhoPerfilProps {
  nome: string;
  provedor: string;
  foto: string | null;
  aoTrocarFoto: () => void;
  atualizandoFoto: boolean;
}

export function CabecalhoPerfil({ nome, provedor, foto, aoTrocarFoto, atualizandoFoto }: CabecalhoPerfilProps) {
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
          {atualizandoFoto
            ? <MaterialIcons name="hourglass-top" size={18} color={Cores.texto} />
            : <MaterialIcons name="camera-alt" size={18} color={Cores.texto} />}
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
    borderColor: Cores.borda,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Cores.capaPerfil,
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
    borderColor: Cores.fundo,
    backgroundColor: Cores.avatarPerfil,
  },
  iniciais: { color: Cores.texto, fontSize: Fontes.tamanhos.grande, fontFamily: Fontes.negrito },
  foto: { width: '100%', height: '100%', borderRadius: 70 },
  indicadorCamera: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Cores.fundoControleFoto,
  },
  identificacao: { marginTop: 11, paddingHorizontal: 24, gap: 5 },
  tipoConta: { color: Cores.texto, fontSize: Fontes.tamanhos.medio, fontFamily: Fontes.regular },
  nome: { color: Cores.texto, fontSize: Fontes.tamanhos.titulo, fontFamily: Fontes.negrito, lineHeight: 31 },
});
