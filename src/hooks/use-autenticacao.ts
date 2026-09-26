import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { autenticacao } from '@/services/Firebase';
import { useAutenticacaoContexto } from '@/context/autenticacao-contexto';

export function useAutenticacao() {
  const { salvarSessao, limparSessao } = useAutenticacaoContexto();

  async function entrar(email: string, senha: string) {
    const credencial = await signInWithEmailAndPassword(autenticacao, email.trim(), senha);
    await salvarSessao(credencial.user);
    return credencial;
  }

  async function criarConta(email: string, senha: string, nome: string) {
    const credencial = await createUserWithEmailAndPassword(autenticacao, email.trim(), senha);
    await updateProfile(credencial.user, { displayName: nome.trim() });
    await salvarSessao(credencial.user);
    return credencial;
  }

  async function redefinirSenha(email: string) {
    return sendPasswordResetEmail(autenticacao, email.trim());
  }

  async function sair() {
    await limparSessao();
    return signOut(autenticacao);
  }

  return { entrar, criarConta, redefinirSenha, sair };
}
