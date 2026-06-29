import {
    collection,
    doc,
    getCountFromServer,
    getDocs,
    query,
    setDoc,
    updateDoc,
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

export async function getActiveShowCountByAgrupacion(
  agrupacionId: string
): Promise<number> {
  const showsRef = collection(db, "agrupaciones", agrupacionId, "shows");
  const q = query(showsRef, where("active", "==", true));
  const snapshot = await getCountFromServer(q);

  return snapshot.data().count;
}

type UpdateShowParams = {
    nombre: string;
    fecha?: string;
};

export async function updateShow(
    agrupacionId: string,
    id: string,
    { nombre, fecha }: UpdateShowParams
): Promise<void> {
    const nombreNormalizado = nombre.trim();
    const fechaNormalizada = fecha?.trim() || null;

    if (!nombreNormalizado) {
        throw new Error("El nombre del show es obligatorio.");
    }

    const docRef = doc(db, "agrupaciones", agrupacionId, "shows", id);

    await updateDoc(docRef, {
        nombre: nombreNormalizado,
        fecha: fechaNormalizada,
    });
}

export async function softDeleteShows(
    agrupacionId: string,
    ids: string[]
): Promise<void> {
    await Promise.all(
        ids.map((id) =>
            updateDoc(doc(db, "agrupaciones", agrupacionId, "shows", id), {
                active: false,
            })
        )
    );
}

