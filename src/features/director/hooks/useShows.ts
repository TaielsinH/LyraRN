import { useCallback, useEffect, useState } from "react";

import {
    createShow,
    getShowsByAgrupacion,
} from "../services/showService";
import type { Show } from "../types";

export function useShows(agrupacionId?: string) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadShows = useCallback(async () => {
    if (!agrupacionId) {
      setShows([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getShowsByAgrupacion(agrupacionId);
      setShows(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar los shows.");
    } finally {
      setLoading(false);
    }
  }, [agrupacionId]);

  const createNewShow = useCallback(
    async (nombre: string, fecha?: string) => {
      if (!agrupacionId) {
        throw new Error("No se encontró la agrupación.");
      }

      try {
        setCreating(true);
        setErrorMessage("");

        const nuevoShow = await createShow({
          agrupacionId,
          nombre,
          fecha,
        });

        setShows((current) =>
          [...current, nuevoShow].sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
        );

        return nuevoShow;
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setErrorMessage(error.message);
          throw error;
        }

        const fallbackMessage = "No se pudo crear el show.";
        setErrorMessage(fallbackMessage);
        throw new Error(fallbackMessage);
      } finally {
        setCreating(false);
      }
    },
    [agrupacionId]
  );

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  return {
    shows,
    loading,
    creating,
    errorMessage,
    loadShows,
    createNewShow,
  };
}