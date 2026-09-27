import { addDoc, collection, onSnapshot, orderBy, query, type Unsubscribe } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import { autenticacao, firebaseConfigurado } from '@/services/Firebase';

export type Registro = {
  id: string;
  gain: boolean;
  value: number;
  date: string;
  dateKey: string;
  description: string;
  destination_or_source: string;
  comment: string;
};

const banco = getFirestore(autenticacao.app);

/**
 * Observa em tempo real os lançamentos do usuário no Firestore. Recebe o UID,
 * um callback com os registros ordenados por data decrescente e um callback
 * de erro; devolve a inscrição que deve ser cancelada ao sair da tela.
 */
export function observarRegistros(uid: string, aoAtualizar: (registros: Registro[]) => void, aoFalhar: (erro: Error) => void): Unsubscribe {
  const consulta = query(collection(banco, 'users', uid, 'records'), orderBy('dateKey', 'desc'));
  return onSnapshot(consulta, (snapshot) => {
    aoAtualizar(snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() }) as Registro));
  }, aoFalhar);
}

/** Cria um documento de transação na coleção privada do usuário e devolve a referência criada pelo Firestore. */
export async function criarRegistro(registro: Omit<Registro, 'id'>) {
  const usuario = autenticacao.currentUser;
  if (!firebaseConfigurado || !usuario) throw new Error('Entre na sua conta para salvar uma transação.');
  return addDoc(collection(banco, 'users', usuario.uid, 'records'), registro);
}
