import { useCallback, useEffect, useState } from "react";

import {
    getOrCreateInstrumentAccessCode,
    saveInstrumentPdfs,
    subscribeInstrumento,
    subscribeShow,
} from "../services/showService";
import type { Instrumento, InstrumentPdf, Show } from "../types";

export function useInstrumentSetlist(
  agrupacionId: string,
  showId: string,
  instrumentoId: string,
  directorId: string
) {
  const [show, setShow] = useState<Show | null>(null);
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeLoading, setAccessCodeLoading] = useState(false);
  const [accessCodeError, setAccessCodeError] = useState("");

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

  useEffect(() => {
    setAccessCode("");
    setAccessCodeError("");

    if (!agrupacionId || !showId || !instrumentoId || !directorId) {
      setAccessCodeLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAccessCode() {
      try {
        setAccessCodeLoading(true);

        const nextAccessCode = await getOrCreateInstrumentAccessCode({
          agrupacionId,
          showId,
          instrumentoId,
          directorId,
        });

        if (!cancelled) {
          setAccessCode(nextAccessCode);
        }
      } catch (error) {
        console.error("Error cargando código de instrumento:", error);

        if (!cancelled) {
          setAccessCodeError("No se pudo generar el código del instrumento.");
        }
      } finally {
        if (!cancelled) {
          setAccessCodeLoading(false);
        }
      }
    }

    void loadAccessCode();

    return () => {
      cancelled = true;
    };
  }, [agrupacionId, directorId, instrumentoId, showId]);

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
    accessCode,
    accessCodeLoading,
    accessCodeError,
    saveChanges,
  };
}
