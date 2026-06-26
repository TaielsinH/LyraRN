import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
export async function guardarTokenFcm(
  userId: string,
  token: string
): Promise<void> {
  const userRef = doc(db, "usuarios", userId);
  await setDoc(userRef, { fcmToken: token }, { merge: true });
}

export async function obtenerTokenFcmDeUsuario(
  userId: string
): Promise<string | null> {
  const userRef = doc(db, "usuarios", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return (snapshot.data().fcmToken as string | undefined) ?? null;
}
