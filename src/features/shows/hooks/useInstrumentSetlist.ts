import { useCallback, useEffect, useState } from "react";

import {
    saveInstrumentPdfs,
    subscribeInstrumento,
    subscribeShow,
} from "../services/showService";
import type { Instrumento, InstrumentPdf, Show } from "../types";

export function useInstrumentSetlist(
  agrupacionId: string,
  showId: string,
  instrumentoId: string
) {
  const [show, setShow] = useState<Show | null>(null);
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!agrupacionId || !showId || !instrumentoId) return;

    setLoading(true);
    setErrorMessage("");

    let showLoaded = false;
    let instrumentoLoaded = false;

    function updateLoading() {
      setLoading(!(showLoaded && instrumentoLoaded));
    }

    const unsubscribeShow = subscribeShow(
      agrupacionId,
      showId,
      (nextShow) => {
        setShow(nextShow);
        showLoaded = true;
        updateLoading();
      },
      (error) => {
        setErrorMessage(error.message);
        setLoading(false);
      }
    );

    const unsubscribeInstrumento = subscribeInstrumento(
      agrupacionId,
      showId,
      instrumentoId,
      (nextInstrumento) => {
        setInstrumento(nextInstrumento);
        instrumentoLoaded = true;
        updateLoading();
      },
      (error) => {
        setErrorMessage(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeShow();
      unsubscribeInstrumento();
    };
  }, [agrupacionId, showId, instrumentoId]);

  const saveChanges = useCallback(
    async (pdfsPorSetlistItem: Record<string, InstrumentPdf>) => {
      await saveInstrumentPdfs(
        agrupacionId,
        showId,
        instrumentoId,
        pdfsPorSetlistItem
      );
    },
    [agrupacionId, showId, instrumentoId]
  );

  return {
    show,
    instrumento,
    loading,
    errorMessage,
    saveChanges,
  };
}
