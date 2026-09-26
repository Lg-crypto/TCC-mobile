import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { CabecalhoPerfil } from '@/components/perfil/cabecalho-perfil';
import { InformacaoPerfil } from '@/components/perfil/informacao-perfil';
import { NavegacaoInferior } from '@/components/registro/navegacao-inferior';
import { useAutenticacaoContexto } from '@/context/autenticacao-contexto';
import { autenticacao, armazenamento } from '@/services/Firebase';
import { useAutenticacao } from '@/hooks/use-autenticacao';

export default function PerfilScreen() {
  const { usuario } = useAutenticacaoContexto();
  const { sair } = useAutenticacao();
  const { salvarSessao } = useAutenticacaoContexto();
  const [atualizandoFoto, setAtualizandoFoto] = useState(false);
  const nome = usuario?.displayName?.trim() || usuario?.email?.split('@')[0] || 'Usuário';
  const partesNome = nome.split(' ').filter(Boolean);
  const provedorId = usuario?.providerId;
  const provedor = provedorId === 'google.com' ? 'Google' : provedorId === 'password' ? 'E-mail e senha' : 'Conta WWallet';
  const informacoes = [
    { rotulo: 'Primeiro Nome', valor: partesNome[0] || 'Não informado' },
    { rotulo: 'Último Nome', valor: partesNome.slice(1).join(' ') || 'Não informado' },
    { rotulo: 'Senha', valor: '••••••••••' },
    { rotulo: 'Endereço de Email', valor: usuario?.email || 'Não informado' },
  ];

  const trocarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso às fotos para escolher uma imagem de perfil.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.85,
    });
    if (resultado.canceled || !resultado.assets[0]) return;
    const conta = autenticacao.currentUser;
    if (!conta) return;
    setAtualizandoFoto(true);
    try {
      const imagem = resultado.assets[0];
      const resposta = await fetch(imagem.uri);
      const blob = await resposta.blob();
      const destino = ref(armazenamento, `profile-photos/${conta.uid}/avatar.jpg`);
      await uploadBytes(destino, blob, { contentType: imagem.mimeType ?? 'image/jpeg' });
      const url = await getDownloadURL(destino);
      await updateProfile(conta, { photoURL: url });
      await salvarSessao(conta);
    } catch {
      Alert.alert('Foto de perfil', 'Não foi possível atualizar a foto. Verifique se o Firebase Storage está configurado.');
    } finally {
      setAtualizandoFoto(false);
    }
  };

  const encerrarSessao = async () => {
    try {
      await sair();
      router.replace('/');
    } catch {
      Alert.alert('Sair da conta', 'Não foi possível encerrar a sessão. Tente novamente.');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.tela}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <CabecalhoPerfil nome={nome} provedor={provedor} foto={usuario?.photoURL ?? null} aoTrocarFoto={trocarFoto} atualizandoFoto={atualizandoFoto} />
        <View style={styles.informacoes}>
          {informacoes.map((informacao) => (
            <InformacaoPerfil
              key={informacao.rotulo}
              rotulo={informacao.rotulo}
              valor={informacao.valor}
            />
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={encerrarSessao} style={styles.botaoSair}>
          <Text style={styles.textoSair}>Sair da conta</Text>
        </Pressable>
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
  botaoSair: { marginHorizontal: 24, marginTop: 8, marginBottom: 24, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#653843', borderRadius: 12, backgroundColor: '#21151a' },
  textoSair: { color: '#ff839c', fontSize: 14, fontWeight: '600' },
  rodape: { paddingTop: 8, paddingBottom: 18 },
});
