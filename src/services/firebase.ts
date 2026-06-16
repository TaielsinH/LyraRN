import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    Auth,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBocuIyaDyh_ljwXi6_dg8jOiZydSp_ffM",
  authDomain: "apporgartistas.firebaseapp.com",
  projectId: "apporgartistas",
  storageBucket: "apporgartistas.firebasestorage.app",
  messagingSenderId: "155479669586",
  appId: "1:155479669586:web:5374d735f1a77c3fefd88b",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
