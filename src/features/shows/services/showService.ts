import {
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    query,
    runTransaction,
    updateDoc,
    where,
    type DocumentData,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Instrumento, InstrumentPdf, SetlistMasterItem, Show } from "../types";

type InstrumentAccessCodeParams = {
  agrupacionId: string;
  showId: string;
  instrumentoId: string;
  directorId: string;
};

type CodigoSetlistInstrumento = InstrumentAccessCodeParams & {
  codigo: string;
  suscriptores: string[];
  activo: boolean;
};

const ACCESS_CODE_RETRY_LIMIT = 10;

class AccessCodeUnavailableError extends Error {
  constructor() {
    super("El código de acceso ya está en uso.");
  }
}


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

function normalizeAccessCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function isGeneratedAccessCode(code: string) {
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(code);
}

function getShowRef(agrupacionId: string, showId: string) {
    return doc(db, "agrupaciones", agrupacionId, "shows", showId);
}

function getInstrumentosRef(agrupacionId: string, showId: string){
    return collection(db, "agrupaciones", agrupacionId, "shows", showId, "instrumentos");
}

function getCodigoSetlistInstrumentoRef(codigo: string) {
  return doc(db, "codigosSetlistInstrumento", codigo);
}

function buildCodigoSetlistInstrumento(
  params: InstrumentAccessCodeParams,
  codigo: string
): CodigoSetlistInstrumento {
  return {
    codigo,
    agrupacionId: params.agrupacionId,
    showId: params.showId,
    instrumentoId: params.instrumentoId,
    directorId: params.directorId,
    suscriptores: [],
    activo: true,
  };
}

function isSameInstrumentCode(
  data: DocumentData,
  params: InstrumentAccessCodeParams
) {
  return (
    data.agrupacionId === params.agrupacionId &&
    data.showId === params.showId &&
    data.instrumentoId === params.instrumentoId &&
    data.activo === true
  );
}

function getCodigoMetadataUpdates(
  data: DocumentData,
  params: InstrumentAccessCodeParams,
  codigo: string
) {
  const updates: Partial<CodigoSetlistInstrumento> = {};

  if (data.codigo !== codigo) updates.codigo = codigo;
  if (data.agrupacionId !== params.agrupacionId) {
    updates.agrupacionId = params.agrupacionId;
  }
  if (data.showId !== params.showId) updates.showId = params.showId;
  if (data.instrumentoId !== params.instrumentoId) {
    updates.instrumentoId = params.instrumentoId;
  }
  if (data.directorId !== params.directorId) updates.directorId = params.directorId;
  if (!Array.isArray(data.suscriptores)) updates.suscriptores = [];
  if (data.activo !== true) updates.activo = true;

  return updates;
}

async function findExistingInstrumentAccessCode(
  params: InstrumentAccessCodeParams
) {
  const codigosRef = collection(db, "codigosSetlistInstrumento");
  const q = query(
    codigosRef,
    where("agrupacionId", "==", params.agrupacionId),
    where("showId", "==", params.showId),
    where("instrumentoId", "==", params.instrumentoId),
    where("activo", "==", true),
    limit(1)
  );

  const snapshot = await getDocs(q);
  const codigoDoc = snapshot.docs[0];

  return codigoDoc ? normalizeAccessCode(codigoDoc.id) : "";
}

async function ensureInstrumentAccessCode(
  params: InstrumentAccessCodeParams,
  codigo: string
) {
  const normalizedCode = normalizeAccessCode(codigo);

  if (!isGeneratedAccessCode(normalizedCode)) {
    throw new AccessCodeUnavailableError();
  }

  const instrumentoRef = getInstrumentoRef(
    params.agrupacionId,
    params.showId,
    params.instrumentoId
  );
  const codigoRef = getCodigoSetlistInstrumentoRef(normalizedCode);

  return runTransaction(db, async (transaction) => {
    const instrumentoSnapshot = await transaction.get(instrumentoRef);
    const codigoSnapshot = await transaction.get(codigoRef);

    if (!instrumentoSnapshot.exists()) {
      throw new Error("El instrumento no existe.");
    }

    if (codigoSnapshot.exists()) {
      const codigoData = codigoSnapshot.data();

      if (!isSameInstrumentCode(codigoData, params)) {
        throw new AccessCodeUnavailableError();
      }

      const updates = getCodigoMetadataUpdates(codigoData, params, normalizedCode);

      if (Object.keys(updates).length > 0) {
        transaction.update(codigoRef, updates);
      }
    } else {
      transaction.set(
        codigoRef,
        buildCodigoSetlistInstrumento(params, normalizedCode)
      );
    }

    const instrumentoData = instrumentoSnapshot.data();
    const currentInstrumentCode = normalizeAccessCode(
      instrumentoData.codigoAcceso
    );

    if (currentInstrumentCode !== normalizedCode) {
      transaction.update(instrumentoRef, {
        codigoAcceso: normalizedCode,
      });
    }

    return normalizedCode;
  });
}

function isAccessCodeUnavailable(error: unknown) {
  return error instanceof AccessCodeUnavailableError;
}

export async function getOrCreateInstrumentAccessCode(
  params: InstrumentAccessCodeParams
): Promise<string> {
  if (
    !params.agrupacionId ||
    !params.showId ||
    !params.instrumentoId ||
    !params.directorId
  ) {
    throw new Error("Faltan datos para generar el código del instrumento.");
  }

  const existingCode = await findExistingInstrumentAccessCode(params);

  if (existingCode) {
    return ensureInstrumentAccessCode(params, existingCode);
  }

  const instrumentoRef = getInstrumentoRef(
    params.agrupacionId,
    params.showId,
    params.instrumentoId
  );
  const currentCode = await runTransaction(db, async (transaction) => {
    const instrumentoSnapshot = await transaction.get(instrumentoRef);

    if (!instrumentoSnapshot.exists()) {
      throw new Error("El instrumento no existe.");
    }

    return normalizeAccessCode(instrumentoSnapshot.data().codigoAcceso);
  });

  if (isGeneratedAccessCode(currentCode)) {
    try {
      return await ensureInstrumentAccessCode(params, currentCode);
    } catch (error) {
      if (!isAccessCodeUnavailable(error)) {
        throw error;
      }
    }
  }

  for (let attempt = 0; attempt < ACCESS_CODE_RETRY_LIMIT; attempt++) {
    try {
      return await ensureInstrumentAccessCode(params, makeAccessCode());
    } catch (error) {
      if (!isAccessCodeUnavailable(error)) {
        throw error;
      }
    }
  }

  throw new Error("No se pudo generar un código único.");
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
  nombre: string,
  directorId: string
): Promise<void> {
  const trimmedName = nombre.trim();

  if (!trimmedName) {
    throw new Error("El nombre del instrumento no puede estar vacío.");
  }

  if (!directorId) {
    throw new Error("No hay un usuario autenticado.");
  }

  const instrumentosRef = getInstrumentosRef(agrupacionId, showId);
  const instrumentoRef = doc(instrumentosRef);

  for (let attempt = 0; attempt < ACCESS_CODE_RETRY_LIMIT; attempt++) {
    const codigo = makeAccessCode();
    const codigoRef = getCodigoSetlistInstrumentoRef(codigo);

    try {
      await runTransaction(db, async (transaction) => {
        const codigoSnapshot = await transaction.get(codigoRef);

        if (codigoSnapshot.exists()) {
          throw new AccessCodeUnavailableError();
        }

        transaction.set(instrumentoRef, {
          id: instrumentoRef.id,
          nombre: trimmedName,
          activo: true,
          codigoAcceso: codigo,
          pdfsPorSetlistItem: {},
        });

        transaction.set(
          codigoRef,
          buildCodigoSetlistInstrumento(
            {
              agrupacionId,
              showId,
              instrumentoId: instrumentoRef.id,
              directorId,
            },
            codigo
          )
        );
      });

      return;
    } catch (error) {
      if (!isAccessCodeUnavailable(error)) {
        throw error;
      }
    }
  }

  throw new Error("No se pudo generar un código único.");
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
