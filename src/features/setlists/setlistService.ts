import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Partitura, Setlist } from "./types";

function mapSetlist(docId: string, data: any, userId: string): Setlist {
  const partituras: Partitura[] = Array.isArray(data.partituras)
    ? data.partituras.map((partitura: any) => ({
        nombre: partitura.nombre ?? "",
        publicId: partitura.publicId ?? "",
        url: partitura.url ?? "",
      }))
    : [];

  return {
    id: docId,
    codigoCompartir: data.codigoCompartir ?? "",
    fechaCreacion: data.fechaCreacion ?? 0,
    isActive: data.isActive ?? true,
    nombreGrupo: data.nombreGrupo ?? "",
    ownerId: data.ownerId ?? userId,
    partituras,
    suscriptores: Array.isArray(data.suscriptores) ? data.suscriptores : [],
    titulo: data.titulo ?? "Sin título",
    ubicacion: data.ubicacion ?? "",
  };
}

export async function getUserSetlists(userId: string): Promise<Setlist[]> {
  const setlistsRef = collection(db, "usuarios", userId, "setlists");

  const q = query(
    setlistsRef,
    where("isActive", "==", true),
    orderBy("fechaCreacion", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) =>
    mapSetlist(document.id, document.data(), userId)
  );
}

export async function getUserSetlistById(
  userId: string,
  setlistId: string
): Promise<Setlist | null> {
  const setlistRef = doc(db, "usuarios", userId, "setlists", setlistId);

  const snapshot = await getDoc(setlistRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapSetlist(snapshot.id, snapshot.data(), userId);
}