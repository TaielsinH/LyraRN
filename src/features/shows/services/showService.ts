import {
    collection,
    doc,
    onSnapshot,
    query,
    runTransaction,
    setDoc,
    updateDoc,
    where,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Instrumento, InstrumentPdf, SetlistMasterItem, Show } from "../types";


export async function updateSetlistMasterOrder(
    agrupacionId: string,
    showId: string,
    items: SetlistMasterItem[]
): Promise<void> {
    const showRef = getShowRef(agrupacionId, showId);
    await updateDoc(showRef, {
        setlistMaster: items,
    });
}

function getInstrumentoRef(
  agrupacionId: string,
  showId: string,
  instrumentoId: string
) {
  return doc(
    db,
    "agrupaciones",
    agrupacionId,
    "shows",
    showId,
    "instrumentos",
    instrumentoId
  );
}

function makeLocalId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function makeAccessCode(codeLength = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

function getShowRef(agrupacionId: string, showId: string) {
    return doc(db, "agrupaciones", agrupacionId, "shows", showId);
}

function getInstrumentosRef(agrupacionId: string, showId: string){
    return collection(db, "agrupaciones", agrupacionId, "shows", showId, "instrumentos");
}

export function subscribeShow(
  agrupacionId: string,
  showId: string,
  onData: (show: Show | null) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getShowRef(agrupacionId, showId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }

      const data = snapshot.data();

      onData({
        id: snapshot.id,
        nombre: data.nombre ?? "",
        fecha: data.fecha,
        active: data.active ?? data.activo ?? true,
        setlistMaster: Array.isArray(data.setlistMaster) ? data.setlistMaster : [],
      });
    },
    onError
  );
}

export function subscribeInstrumentos(
  agrupacionId: string,
  showId: string,
  onData: (instrumentos: Instrumento[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(getInstrumentosRef(agrupacionId, showId), where("activo", "==", true));

  return onSnapshot(
    q,
    (snapshot) => {
      const instrumentos = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            nombre: data.nombre ?? "",
            codigoAcceso: data.codigoAcceso,
            activo: data.activo ?? true,
            pdfsPorSetlistItem: data.pdfsPorSetlistItem ?? {},
          } satisfies Instrumento;
        })
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      onData(instrumentos);
    },
    onError
  );
}
export function subscribeInstrumento(
  agrupacionId: string,
  showId: string,
  instrumentoId: string,
  onData: (instrumento: Instrumento | null) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getInstrumentoRef(agrupacionId, showId, instrumentoId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }

      const data = snapshot.data();

      onData({
        id: snapshot.id,
        nombre: data.nombre ?? "",
        codigoAcceso: data.codigoAcceso ?? "",
        activo: data.activo ?? true,
        pdfsPorSetlistItem: data.pdfsPorSetlistItem ?? {},
      });
    },
    onError
  );
}
export async function saveInstrumentPdfs(
  agrupacionId: string,
  showId: string,
  instrumentoId: string,
  pdfsPorSetlistItem: Record<string, InstrumentPdf>
): Promise<void> {
  const instrumentoRef = getInstrumentoRef(
    agrupacionId,
    showId,
    instrumentoId
  );

  await updateDoc(instrumentoRef, {
    pdfsPorSetlistItem,
  });
}

export async function createInstrumento(
  agrupacionId: string,
  showId: string,
  nombre: string
): Promise<void> {
  const trimmedName = nombre.trim();

  if (!trimmedName) {
    throw new Error("El nombre del instrumento no puede estar vacío.");
  }

  const instrumentosRef = getInstrumentosRef(agrupacionId, showId);
  const instrumentoRef = doc(instrumentosRef);

  await setDoc(instrumentoRef, {
    id: instrumentoRef.id,
    nombre: trimmedName,
    activo: true,
    codigoAcceso: makeAccessCode(),
    pdfsPorSetlistItem: {},
  });
}

export async function addSetlistMasterItem(
  agrupacionId: string,
  showId: string,
  nombre: string
): Promise<void> {
  const trimmedName = nombre.trim();

  if (!trimmedName) {
    throw new Error("El nombre de la obra no puede estar vacío.");
  }

  const showRef = getShowRef(agrupacionId, showId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(showRef);

    if (!snapshot.exists()) {
      throw new Error("El show no existe.");
    }

    const data = snapshot.data();
    const currentSetlist = Array.isArray(data.setlistMaster)
      ? (data.setlistMaster as SetlistMasterItem[])
      : [];

    const newItem: SetlistMasterItem = {
      id: makeLocalId(),
      nombre: trimmedName,
    };

    transaction.update(showRef, {
      setlistMaster: [...currentSetlist, newItem],
    });
  });
}
