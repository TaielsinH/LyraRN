import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
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

function normalizeCode(codigo: string) {
  return codigo.replace(/\s/g, "").toUpperCase();
}

async function buildShowSetlistSuscripto(
  codigoId: string,
  codigoData: CodigoSetlistInstrumentoFirestore
): Promise<ShowSetlistSuscripto | null> {
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
    codigo: codigoData.codigo ?? codigoId,
    agrupacionId,
    showId,
    instrumentoId,
    nombreShow: show?.nombre ?? "Show sin nombre",
    fechaShow: show?.fecha,
    nombreInstrumento: instrumento?.nombre ?? "Instrumento",
  } satisfies ShowSetlistSuscripto;
}

export async function suscribirseAShowPorCodigo(
  codigo: string,
  userId: string
): Promise<ShowSetlistSuscripto> {
  const codigoNormalizado = normalizeCode(codigo);

  if (!codigoNormalizado) {
    throw new Error("Ingresá un código.");
  }

  if (codigoNormalizado.length !== 6) {
    throw new Error("El código debe tener 6 caracteres.");
  }

  if (!userId) {
    throw new Error("No hay un usuario autenticado.");
  }

  const codigoRef = doc(db, "codigosSetlistInstrumento", codigoNormalizado);
  const codigoSnapshot = await getDoc(codigoRef);

  if (!codigoSnapshot.exists()) {
    throw new Error("Código no encontrado.");
  }

  const codigoData =
    codigoSnapshot.data() as CodigoSetlistInstrumentoFirestore & {
      directorId?: string;
    };

  if (codigoData.activo === false) {
    throw new Error("Este código está inactivo.");
  }

  if (codigoData.directorId === userId) {
    throw new Error("Este show fue creado por tu usuario.");
  }

  if (!codigoData.agrupacionId || !codigoData.showId || !codigoData.instrumentoId) {
    throw new Error("El código está incompleto.");
  }

  if (codigoData.suscriptores?.includes(userId)) {
    throw new Error("Ya estás suscripto a este show.");
  }

  await updateDoc(codigoRef, {
    suscriptores: arrayUnion(userId),
  });

  const showSuscripto = await buildShowSetlistSuscripto(
    codigoSnapshot.id,
    codigoData
  );

  if (!showSuscripto) {
    throw new Error("El código está incompleto.");
  }

  return showSuscripto;
}

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

    return buildShowSetlistSuscripto(codigoDoc.id, codigoData);
  });

  const lista = await Promise.all(tareas);

  return lista.filter(
    (item): item is ShowSetlistSuscripto => item !== null
  );
}
