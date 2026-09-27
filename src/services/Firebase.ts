import { FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from '@firebase/auth';
import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

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
  if (Platform.OS === 'web') {
    autenticacao = getAuth(conexao);
  } else {
    // O SDK React Native exporta esse helper em seu entry point nativo.
    const authRN = FirebaseAuth as unknown as typeof FirebaseAuth & {
      getReactNativePersistence: (storage: typeof AsyncStorage) => import('firebase/auth').Persistence;
    };
    autenticacao = initializeAuth(conexao, {
      persistence: authRN.getReactNativePersistence(AsyncStorage),
    });
  }
} catch (error) {
  if ((error as { code?: string }).code !== 'auth/already-initialized') throw error;
  autenticacao = getAuth(conexao);
}

const armazenamento = getStorage(conexao);

export { autenticacao, armazenamento, FirebaseError };
