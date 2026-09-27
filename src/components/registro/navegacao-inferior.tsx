import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Cores } from '@/constants/theme';

const ITENS = [
  { rotulo: 'Início', simbolo: 'home' as const, rota: '/inicio' as const },
  { rotulo: 'Nova transação', simbolo: 'add-circle-outline' as const, rota: '/criar-registro' as const },
  { rotulo: 'Perfil', simbolo: 'account-circle' as const, rota: '/perfil' as const },
  { rotulo: 'Sobre', simbolo: 'info-outline' as const, rota: '/sobre' as const },
] as const;

export interface NavegacaoInferiorProps {
  selecionado?: string;
}

export function NavegacaoInferior({ selecionado = 'Nova transação' }: NavegacaoInferiorProps) {
  return (
    <View accessibilityRole="tablist" style={styles.barra}>
      {ITENS.map((item) => (
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel={item.rotulo}
          accessibilityState={{ selected: item.rotulo === selecionado }}
          key={item.rotulo}
          onPress={() => router.replace(item.rota)}
          style={styles.item}
        >
          <MaterialIcons
            name={item.simbolo}
            size={item.rotulo === selecionado ? 29 : 25}
            color={Cores.iconeBarra}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    height: 48,
    width: 264,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: Cores.barraInferior,
  },
  item: { width: 56, height: 44, alignItems: 'center', justifyContent: 'center' },
});
