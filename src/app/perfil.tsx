import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { CabecalhoPerfil } from '@/components/perfil/cabecalho-perfil';
import { InformacaoPerfil } from '@/components/perfil/informacao-perfil';
import { NavegacaoInferior } from '@/components/registro/navegacao-inferior';
import { useAutenticacaoContexto } from '@/context/autenticacao-contexto';

export default function PerfilScreen() {
  const { usuario } = useAutenticacaoContexto();
  const nome = usuario?.displayName?.trim() || usuario?.email?.split('@')[0] || 'Usuário';
  const partesNome = nome.split(' ').filter(Boolean);
  const provedorId = usuario?.providerId;
  const provedor = provedorId === 'google.com' ? 'Google' : provedorId === 'password' ? 'E-mail e senha' : 'Conta WWallet';
  const informacoes = [
    { rotulo: 'Primeiro Nome', valor: partesNome[0] || 'Não informado' },
    { rotulo: 'Último Nome', valor: partesNome.slice(1).join(' ') || 'Não informado' },
    { rotulo: 'Número de telefone', valor: usuario?.phoneNumber || 'Não informado' },
    { rotulo: 'Senha', valor: '••••••••••' },
    { rotulo: 'Endereço de Email', valor: usuario?.email || 'Não informado' },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoPerfil nome={nome} provedor={provedor} foto={usuario?.photoURL ?? null} />
        <View style={styles.informacoes}>
          {informacoes.map((informacao) => (
            <InformacaoPerfil
              key={informacao.rotulo}
              rotulo={informacao.rotulo}
              valor={informacao.valor}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.rodape}>
        <NavegacaoInferior selecionado="Perfil" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#0c0d10' },
  conteudo: { paddingTop: 0, paddingBottom: 18 },
  informacoes: { gap: 21, paddingHorizontal: 46, paddingBottom: 20 },
  rodape: { paddingTop: 8, paddingBottom: 18 },
});
