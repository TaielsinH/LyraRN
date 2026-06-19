import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { Show } from "../types";

type CreateShowParams = {
  agrupacionId: string;
  nombre: string;
  fecha?: string;
};

export async function createShow({
  agrupacionId,
  nombre,
  fecha,
}: CreateShowParams): Promise<Show> {
  const nombreNormalizado = nombre.trim();
  const fechaNormalizada = fecha?.trim() || null;

  if (!nombreNormalizado) {
    throw new Error("El nombre del show es obligatorio.");
  }

  const docRef = doc(collection(db, "agrupaciones", agrupacionId, "shows"));
  const nuevoShow: Show = {
    id: docRef.id,
    nombre: nombreNormalizado,
    fecha: fechaNormalizada,
    active: true,
    setlistMaster: [],
  };
  await setDoc(docRef, nuevoShow);
  return nuevoShow;
}
export async function getShowsByAgrupacion(
  agrupacionId: string
): Promise<Show[]> {
    const showsRef = collection(db, "agrupaciones", agrupacionId, "shows");
    const q = query(showsRef, where("active", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map((document) => document.data() as Show)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

