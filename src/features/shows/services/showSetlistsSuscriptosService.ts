import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { ShowSetlistSuscripto } from "../types";

type CodigoSetlistInstrumentoFirestore = {
  activo?: boolean;
  agrupacionId?: string;
  showId?: string;
  instrumentoId?: string;
  codigo?: string;
  suscriptores?: string[];
};

type ShowFirestore = {
  nombre?: string;
  fecha?: string;
  active?: boolean;
  activo?: boolean;
};

type InstrumentoFirestore = {
  nombre?: string;
  active?: boolean;
  activo?: boolean;
};

export async function cargarShowSetlistsSuscriptos(
  userId: string
): Promise<ShowSetlistSuscripto[]> {
  const codigosRef = collection(db, "codigosSetlistInstrumento");

  const q = query(
    codigosRef,
    where("suscriptores", "array-contains", userId),
    where("activo", "==", true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  const tareas = snapshot.docs.map(async (codigoDoc) => {
    const codigoData =
      codigoDoc.data() as CodigoSetlistInstrumentoFirestore;

    const agrupacionId = codigoData.agrupacionId ?? "";
    const showId = codigoData.showId ?? "";
    const instrumentoId = codigoData.instrumentoId ?? "";

    if (!agrupacionId || !showId || !instrumentoId) {
      return null;
    }

    const showRef = doc(
      db,
      "agrupaciones",
      agrupacionId,
      "shows",
      showId
    );

    const instrumentoRef = doc(
      db,
      "agrupaciones",
      agrupacionId,
      "shows",
      showId,
      "instrumentos",
      instrumentoId
    );

    const [showSnapshot, instrumentoSnapshot] = await Promise.all([
      getDoc(showRef),
      getDoc(instrumentoRef),
    ]);

    const show = showSnapshot.exists()
      ? (showSnapshot.data() as ShowFirestore)
      : null;

    const instrumento = instrumentoSnapshot.exists()
      ? (instrumentoSnapshot.data() as InstrumentoFirestore)
      : null;

    return {
      codigo: codigoData.codigo ?? codigoDoc.id,
      agrupacionId,
      showId,
      instrumentoId,
      nombreShow: show?.nombre ?? "Show sin nombre",
      fechaShow: show?.fecha,
      nombreInstrumento: instrumento?.nombre ?? "Instrumento",
    } satisfies ShowSetlistSuscripto;
  });

  const lista = await Promise.all(tareas);

  return lista.filter(
    (item): item is ShowSetlistSuscripto => item !== null
  );
}