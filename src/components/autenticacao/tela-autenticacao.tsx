import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import * as WebBrowser from 'expo-web-browser';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';

import { firebaseConfigurado } from '@/services/Firebase';
import { useAutenticacao } from '@/hooks/use-autenticacao';

type Modo = 'login' | 'cadastro';

WebBrowser.maybeCompleteAuthSession();

export function TelaAutenticacao({ modo }: { modo: Modo }) {
  const cadastro = modo === 'cadastro';
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [ultimoNome, setUltimoNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviandoGoogle, setEnviandoGoogle] = useState(false);
  const respostaProcessada = useRef<unknown>(null);
  const { entrar, criarConta, entrarComGoogle, redefinirSenha } = useAutenticacao();
  const [requisicaoGoogle, respostaGoogle, abrirGoogle] = useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? 'google-web-client-not-configured',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? 'google-ios-client-not-configured',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? 'google-android-client-not-configured',
    selectAccount: true,
  }, { scheme: 'wwallet' });

  const mostrarErro = (erro: unknown) => {
    const mensagem = erro instanceof FirebaseError
      ? erro.code === 'auth/invalid-credential'
        ? 'E-mail, senha ou credencial Google inválidos. Tente novamente.'
        : erro.code === 'auth/account-exists-with-different-credential'
          ? 'Já existe uma conta com este e-mail. Entre com o método usado no cadastro.'
          : erro.code === 'auth/email-already-in-use'
            ? 'Este e-mail já possui uma conta.'
            : erro.code === 'auth/weak-password'
              ? 'Use uma senha com pelo menos 6 caracteres.'
          : erro.message
      : 'Não foi possível concluir. Tente novamente.';
    Alert.alert('Autenticação', mensagem);
  };

  useEffect(() => {
    if (!respostaGoogle || respostaProcessada.current === respostaGoogle) return;
    respostaProcessada.current = respostaGoogle;
    if (respostaGoogle.type === 'cancel' || respostaGoogle.type === 'dismiss') {
      return;
    }
    if (respostaGoogle.type !== 'success') {
      Promise.resolve()
        .then(() => Alert.alert('Login com Google', 'Não foi possível concluir a autenticação. Tente novamente.'))
        .finally(() => setEnviandoGoogle(false));
      return;
    }

    const idToken = respostaGoogle.params.id_token;
    if (!idToken) {
      Promise.resolve()
        .then(() => Alert.alert('Login com Google', 'O Google não retornou um token. Confira os IDs OAuth configurados.'))
        .finally(() => setEnviandoGoogle(false));
      return;
    }

    entrarComGoogle(idToken)
      .then(() => router.replace('/inicio'))
      .catch(mostrarErro)
      .finally(() => setEnviandoGoogle(false));
  }, [respostaGoogle, entrarComGoogle]);

  const enviar = async () => {
    if (!firebaseConfigurado) {
      Alert.alert('Firebase não configurado', 'Preencha as variáveis EXPO_PUBLIC_FIREBASE no arquivo .env.');
      return;
    }
    if (!email.trim() || !senha || (cadastro && (!primeiroNome.trim() || !ultimoNome.trim()))) {
      Alert.alert('Campos obrigatórios', 'Preencha os campos necessários para continuar.');
      return;
    }
    setEnviando(true);
    try {
      if (cadastro) {
        await criarConta(email, senha, `${primeiroNome.trim()} ${ultimoNome.trim()}`);
      } else {
        await entrar(email, senha);
      }
      router.replace('/inicio');
    } catch (erro) {
      mostrarErro(erro);
    } finally {
      setEnviando(false);
    }
  };

  const enviarRedefinicao = async () => {
    if (!email.trim()) {
      Alert.alert('Recuperar senha', 'Informe seu e-mail para receber o link de redefinição.');
      return;
    }
    if (!firebaseConfigurado) {
      Alert.alert('Firebase não configurado', 'Preencha as variáveis EXPO_PUBLIC_FIREBASE no arquivo .env.');
      return;
    }
    try {
      await redefinirSenha(email);
      Alert.alert('Recuperar senha', 'Enviamos um link de redefinição para seu e-mail.');
    } catch (erro) {
      mostrarErro(erro);
    }
  };

  const enviarComGoogle = async () => {
    if (!firebaseConfigurado) {
      Alert.alert('Firebase não configurado', 'Preencha as variáveis EXPO_PUBLIC_FIREBASE no arquivo .env.');
      return;
    }
    const idCliente = Platform.select({
      ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
    if (!idCliente) {
      Alert.alert('Google não configurado', 'Adicione o ID OAuth correspondente à plataforma no arquivo .env.');
      return;
    }
    if (!requisicaoGoogle) {
      Alert.alert('Login com Google', 'A autenticação ainda está sendo preparada. Tente novamente em instantes.');
      return;
    }
    setEnviandoGoogle(true);
    try {
      const resultado = await abrirGoogle();
      if (resultado.type === 'cancel' || resultado.type === 'dismiss') setEnviandoGoogle(false);
    } catch (erro) {
      setEnviandoGoogle(false);
      mostrarErro(erro);
    }
  };

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.teclado}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.abas}>
            <Pressable onPress={() => router.replace('/criar-conta')} style={styles.aba}>
              <Text style={[styles.textoAba, cadastro && styles.abaAtiva]}>Sign up</Text>
              {cadastro && <View style={styles.sublinhado} />}
            </Pressable>
            <Pressable onPress={() => router.replace('/')} style={styles.aba}>
              <Text style={[styles.textoAba, !cadastro && styles.abaAtiva]}>Login</Text>
              {!cadastro && <View style={styles.sublinhado} />}
            </Pressable>
          </View>

          <View style={styles.formulario}>
            <Text style={styles.titulo}>{cadastro ? 'Create an account' : 'Login'}</Text>

            {cadastro && (
              <View style={styles.linhaNome}>
                <TextInput
                  accessibilityLabel="Primeiro nome"
                  autoCapitalize="words"
                  onChangeText={setPrimeiroNome}
                  placeholder="First Name"
                  placeholderTextColor={CORES.secundaria}
                  style={[styles.entrada, styles.nomeEntrada]}
                  value={primeiroNome}
                />
                <TextInput
                  accessibilityLabel="Último nome"
                  autoCapitalize="words"
                  onChangeText={setUltimoNome}
                  placeholder="Last Name"
                  placeholderTextColor={CORES.secundaria}
                  style={[styles.entrada, styles.nomeEntrada]}
                  value={ultimoNome}
                />
              </View>
            )}

            <View style={styles.entradaComIcone}>
              <Text style={styles.icone}>@</Text>
              <TextInput
                accessibilityLabel="E-mail"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={CORES.secundaria}
                style={styles.entradaTexto}
                value={email}
              />
            </View>

            <TextInput
              accessibilityLabel="Senha"
              autoComplete={cadastro ? 'new-password' : 'password'}
              onChangeText={setSenha}
              placeholder="Enter your password"
              placeholderTextColor={CORES.secundaria}
              secureTextEntry
              style={styles.entrada}
              value={senha}
            />

            {!cadastro && (
              <Pressable onPress={enviarRedefinicao} style={styles.recuperar}>
                <Text style={styles.linkRecuperacao}>forget my password</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={enviando}
              onPress={enviar}
              style={({ pressed }) => [styles.botaoPrimario, pressed && styles.pressionado]}
            >
              <Text style={styles.textoBotao}>{enviando ? 'Please wait…' : cadastro ? 'Create an account' : 'Sign in'}</Text>
            </Pressable>

            <View style={styles.divisor}>
              <View style={styles.linha} />
              <Text style={styles.textoDivisor}>or sign in with</Text>
              <View style={styles.linha} />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar com Google"
              disabled={enviando || enviandoGoogle}
              onPress={enviarComGoogle}
              style={({ pressed }) => [styles.botaoGoogle, pressed && styles.pressionado, (enviando || enviandoGoogle) && styles.botaoDesabilitado]}
            >
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.textoGoogle}>{enviandoGoogle ? 'Conectando…' : 'Google'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const CORES = { fundo: '#0c0d10', painel: '#25262d', borda: '#41434d', secundaria: '#c0c1ca', verde: '#20c665' };
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  teclado: { flex: 1 },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 27,
    paddingTop: 42,
    paddingBottom: 30,
  },
  abas: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 42,
    marginBottom: "auto",
    paddingBottom: 40,
  },
  aba: { minWidth: 48, alignItems: "center", gap: 5 },
  textoAba: { color: "#a8a8b1", fontSize: 14 },
  abaAtiva: { color: "#f3f3f5" },
  sublinhado: { width: 35, height: 1, backgroundColor: "#f2f2f2" },
  formulario: { gap: 15, marginTop: 56, marginBottom: "auto" },
  titulo: {
    color: "#f5f5f6",
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 3,
  },
  linhaNome: { flexDirection: "row", gap: 14 },
  nomeEntrada: { flex: 1, minWidth: 0 },
  entrada: {
    height: 43,
    borderRadius: 9,
    backgroundColor: CORES.painel,
    color: "#f5f5f6",
    paddingHorizontal: 15,
    fontSize: 13,
    borderWidth: 1,
    borderColor: "transparent",
  },
  entradaComIcone: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 9,
    backgroundColor: CORES.painel,
    paddingLeft: 12,
  },
  icone: { color: CORES.secundaria, fontSize: 16 },
  entradaTexto: {
    flex: 1,
    height: 43,
    color: "#f5f5f6",
    paddingHorizontal: 5,
    fontSize: 13,
  },
  recuperar: { alignSelf: "flex-start", marginTop: -6, marginLeft: 10 },
  linkRecuperacao: {
    color: "#b8b8c0",
    fontSize: 10,
    textDecorationLine: "underline",
  },
  botaoPrimario: {
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: CORES.verde,
    marginTop: 39,
  },
  pressionado: { opacity: 0.82 },
  textoBotao: { color: "white", fontSize: 16, fontWeight: "600" },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 19,
    marginTop: 22,
  },
  linha: { height: 1, flex: 1, backgroundColor: "#b8b8bc" },
  textoDivisor: { color: "#b8b8bc", fontSize: 12 },
  botaoGoogle: {
    height: 43,
    width: "88%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 11,
    borderRadius: 10,
    backgroundColor: "#eeeeef",
  },
  botaoDesabilitado: { opacity: 0.6 },
  googleG: { color: "#4285f4", fontSize: 21, fontWeight: "800" },
  textoGoogle: { color: "#121212", fontSize: 16, fontWeight: "600" },
});
