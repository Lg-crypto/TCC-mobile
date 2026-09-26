import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { autenticacao } from '@/services/Firebase';

export type UsuarioSessao = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string | null;
};

type AutenticacaoContextoTipo = {
  usuario: UsuarioSessao | null;
  carregando: boolean;
  salvarSessao: (usuario: User) => Promise<void>;
  limparSessao: () => Promise<void>;
};
const AutenticacaoContexto = createContext<AutenticacaoContextoTipo | undefined>(undefined);
const CHAVE_SESSAO = '@WWallet:usuario';

function converterUsuario(usuario: User): UsuarioSessao {
  return {
    uid: usuario.uid,
    email: usuario.email,
    displayName: usuario.displayName,
    photoURL: usuario.photoURL,
    phoneNumber: usuario.phoneNumber,
    providerId: usuario.providerData[0]?.providerId ?? null,
  };
}

export function AutenticacaoProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function salvarSessao(usuarioAutenticado: User) {
    const sessao = converterUsuario(usuarioAutenticado);
    setUsuario(sessao);
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  }

  async function limparSessao() {
    setUsuario(null);
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  }

  useEffect(
    () => onAuthStateChanged(autenticacao, async (usuarioAutenticado) => {
      try {
        if (usuarioAutenticado) {
          await salvarSessao(usuarioAutenticado);
        } else {
          const sessaoSalva = await AsyncStorage.getItem(CHAVE_SESSAO);
          setUsuario(sessaoSalva ? JSON.parse(sessaoSalva) as UsuarioSessao : null);
        }
      } catch (erro) {
        console.warn('Não foi possível carregar a sessão salva.', erro);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }),
    [],
  );

  return (
    <AutenticacaoContexto.Provider value={{ usuario, carregando, salvarSessao, limparSessao }}>
      {children}
    </AutenticacaoContexto.Provider>
  );
}

export function useAutenticacaoContexto() {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) throw new Error('AutenticacaoProvider ausente na aplicação.');
  return contexto;
}
