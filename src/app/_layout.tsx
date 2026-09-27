import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AutenticacaoProvider, useAutenticacaoContexto } from '@/context/autenticacao-contexto';
import { Fontes } from '@/constants/theme';

void SplashScreen.preventAutoHideAsync();

function NavegacaoRaiz() {
  const { usuario, carregando } = useAutenticacaoContexto();
  const [fontesCarregadas, erroFontes] = useFonts({
    [Fontes.leve]: require('../../assets/fonts/Montserrat-Light.ttf'),
    [Fontes.regular]: require('../../assets/fonts/Montserrat-Regular.ttf'),
    [Fontes.negrito]: require('../../assets/fonts/Montserrat-Bold.ttf'),
  });
  const pronto = fontesCarregadas || Boolean(erroFontes);
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando || !pronto) return;
    const segmentoAtual = segmentos[0] as string;
    const rotaPublica = segmentoAtual === 'index' || segmentoAtual === 'criar-conta';
    if (!usuario && !rotaPublica) router.replace('/');
    if (usuario && rotaPublica) router.replace('/inicio');
  }, [carregando, pronto, segmentos, usuario, router]);

  useEffect(() => {
    if (pronto && !carregando) SplashScreen.hide();
  }, [carregando, pronto]);

  if (carregando || !pronto) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AutenticacaoProvider>
      <NavegacaoRaiz />
    </AutenticacaoProvider>
  );
}
