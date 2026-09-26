import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  inMemoryPersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

const conexao = getApps().length ? getApp() : initializeApp(firebaseConfig);

let autenticacao: Auth;
try {
  autenticacao = initializeAuth(conexao, {
    persistence: inMemoryPersistence,
  });
} catch (error) {
  if ((error as { code?: string }).code !== 'auth/already-initialized') throw error;
  autenticacao = getAuth(conexao);
}

export { autenticacao, FirebaseError };
