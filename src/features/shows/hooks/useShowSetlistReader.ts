import { useEffect, useMemo, useState } from "react";

import {
    observarInstrumentoDetalle,
    observarShowDetalle,
} from "../services/showSetlistReaderService";
import type {
    InstrumentoDetalle,
    SetlistReaderRow,
    ShowDetalle,
} from "../types";

type UseShowSetlistReaderParams = {
  agrupacionId: string;
  showId: string;
  instrumentoId: string;
};

export function useShowSetlistReader({
  agrupacionId,
  showId,
  instrumentoId,
}: UseShowSetlistReaderParams) {
  const [show, setShow] = useState<ShowDetalle | null>(null);
  const [instrumento, setInstrumento] = useState<InstrumentoDetalle | null>(
    null
  );

  const [showLoaded, setShowLoaded] = useState(false);
  const [instrumentoLoaded, setInstrumentoLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setShow(null);
    setInstrumento(null);
    setShowLoaded(false);
    setInstrumentoLoaded(false);
    setErrorMessage("");

    if (!agrupacionId || !showId || !instrumentoId) {
      setErrorMessage("Faltan datos para cargar el setlist.");
      setShowLoaded(true);
      setInstrumentoLoaded(true);
      return;
    }

    const unsubscribeShow = observarShowDetalle(
      agrupacionId,
      showId,
      (nextShow) => {
        setShow(nextShow);
        setShowLoaded(true);
      },
      (error) => {
        console.error("Error escuchando show", error);
        setErrorMessage("Error al escuchar cambios del show.");
        setShowLoaded(true);
      }
    );

    const unsubscribeInstrumento = observarInstrumentoDetalle(
      agrupacionId,
      showId,
      instrumentoId,
      (nextInstrumento) => {
        setInstrumento(nextInstrumento);
        setInstrumentoLoaded(true);
      },
      (error) => {
        console.error("Error escuchando instrumento", error);
        setErrorMessage("Error al escuchar cambios del instrumento.");
        setInstrumentoLoaded(true);
      }
    );

    return () => {
      unsubscribeShow();
      unsubscribeInstrumento();
    };
  }, [agrupacionId, showId, instrumentoId]);

  const rows = useMemo<SetlistReaderRow[]>(() => {
    if (!show) return [];

    return show.setlistMaster.map((item, index) => {
      const pdf = instrumento?.pdfsPorSetlistItem[item.id];

      return {
        id: item.id,
        orden: index + 1,
        nombre: item.nombre,
        pdf,
      };
    });
  }, [show, instrumento]);

  return {
    show,
    instrumento,
    rows,
    loading: !showLoaded || !instrumentoLoaded,
    errorMessage,
  };
}