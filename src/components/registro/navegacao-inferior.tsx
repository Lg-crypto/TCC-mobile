import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

const ITENS = [
  { rotulo: 'Início', simbolo: { ios: 'house', android: 'home', web: 'home' }, rota: '/inicio' as const },
  { rotulo: 'Nova transação', simbolo: { ios: 'plus', android: 'add', web: 'add' }, rota: '/criar-registro' as const },
  { rotulo: 'Perfil', simbolo: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }, rota: '/perfil' as const },
] as const;

export function NavegacaoInferior({ selecionado = 'Nova transação' }: { selecionado?: string }) {
  return (
    <View accessibilityRole="tablist" style={styles.barra}>
      {ITENS.map((item, index) => (
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel={item.rotulo}
          accessibilityState={{ selected: item.rotulo === selecionado }}
          key={item.rotulo}
          onPress={() => router.replace(item.rota)}
          style={styles.item}
        >
          <SymbolView
            name={item.simbolo}
            size={item.rotulo === selecionado ? 29 : 25}
            tintColor="#4c4c4c"
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    height: 48,
    width: 208,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: '#dedede',
  },
  item: { width: 56, height: 44, alignItems: 'center', justifyContent: 'center' },
});
