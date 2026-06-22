import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { Partitura } from "../types";

export function normalizePartituras(partituras: Partitura[]) {
  const uniquePartituras = new Map<string, Partitura>();

  partituras.forEach((partitura) => {
    const publicId = partitura.publicId?.trim();
    const url = partitura.url?.trim();

    if (!publicId || !url) return;

    uniquePartituras.set(publicId, {
      nombre: partitura.nombre?.trim() || "Partitura sin nombre",
      publicId,
      url,
    });
  });

  return [...uniquePartituras.values()].sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  );
}

export async function getUserPartiturasFromSetlists(
  userId: string
): Promise<Partitura[]> {
  const setlistsRef = collection(db, "usuarios", userId, "setlists");
  const snapshot = await getDocs(setlistsRef);

  const partituras = snapshot.docs.flatMap((document) => {
    const data = document.data();

    if (!Array.isArray(data.partituras)) return [];

    return data.partituras.map((partitura: any) => ({
      nombre: partitura.nombre ?? "",
      publicId: partitura.publicId ?? "",
      url: partitura.url ?? "",
    }));
  });

  return normalizePartituras(partituras);
}
