import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { AutenticacaoProvider, useAutenticacaoContexto } from '@/context/autenticacao-contexto';

function NavegacaoRaiz() {
  const { usuario, carregando } = useAutenticacaoContexto();
  const segmentos = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    const segmentoAtual = segmentos[0] as string;
    const rotaPublica = segmentoAtual === 'index' || segmentoAtual === 'criar-conta';
    if (!usuario && !rotaPublica) router.replace('/');
    if (usuario && rotaPublica) router.replace('/inicio');
  }, [carregando, segmentos, usuario, router]);

  if (carregando) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AutenticacaoProvider>
      <NavegacaoRaiz />
    </AutenticacaoProvider>
  );
}
