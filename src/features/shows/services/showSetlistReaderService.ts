import {
    doc,
    onSnapshot,
    type DocumentData,
    type Unsubscribe,
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import type {
    InstrumentoDetalle,
    PdfInstrumento,
    SetlistMasterItem,
    ShowDetalle,
} from "../types";

function normalizeSetlistMaster(raw: unknown): SetlistMasterItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      const data = item as {
        id?: unknown;
        nombre?: unknown;
      };

      return {
        id: String(data.id ?? ""),
        nombre: String(data.nombre ?? ""),
      };
    })
    .filter((item) => item.id.length > 0 && item.nombre.length > 0);
}


function normalizePdfsPorSetlistItem(
  data: DocumentData
): Record<string, PdfInstrumento> {
  if (
    data.pdfsPorSetlistItem &&
    typeof data.pdfsPorSetlistItem === "object" &&
    !Array.isArray(data.pdfsPorSetlistItem)
  ) {
    return data.pdfsPorSetlistItem as Record<string, PdfInstrumento>;
  }

  const reservedFields = new Set([
    "id",
    "nombre",
    "activo",
    "active",
    "codigoAcceso",
    "createdAt",
    "updatedAt",
  ]);

  const result: Record<string, PdfInstrumento> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (reservedFields.has(key)) return;
    if (!value || typeof value !== "object" || Array.isArray(value)) return;

    const possiblePdf = value as Partial<PdfInstrumento>;

    if (
      typeof possiblePdf.nombre === "string" &&
      typeof possiblePdf.url === "string"
    ) {
      result[key] = {
        nombre: possiblePdf.nombre,
        url: possiblePdf.url,
        publicId: possiblePdf.publicId,
      };
    }
  });

  return result;
}

export function observarShowDetalle(
  agrupacionId: string,
  showId: string,
  onChange: (show: ShowDetalle | null) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const showRef = doc(db, "agrupaciones", agrupacionId, "shows", showId);

  return onSnapshot(
    showRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }

      const data = snapshot.data();

      onChange({
        id: snapshot.id,
        nombre: String(data.nombre ?? "Show sin nombre"),
        fecha: typeof data.fecha === "string" ? data.fecha : undefined,
        active: data.active ?? data.activo ?? true,
        setlistMaster: normalizeSetlistMaster(data.setlistMaster),
      });
    },
    (error) => {
      onError(error);
    }
  );
}

export function observarInstrumentoDetalle(
  agrupacionId: string,
  showId: string,
  instrumentoId: string,
  onChange: (instrumento: InstrumentoDetalle | null) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const instrumentoRef = doc(
    db,
    "agrupaciones",
    agrupacionId,
    "shows",
    showId,
    "instrumentos",
    instrumentoId
  );

  return onSnapshot(
    instrumentoRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }

      const data = snapshot.data();

      onChange({
        id: snapshot.id,
        nombre: String(data.nombre ?? "Instrumento"),
        activo: data.activo ?? data.active ?? true,
        pdfsPorSetlistItem: normalizePdfsPorSetlistItem(data),
      });
    },
    (error) => {
      onError(error);
    }
  );
}