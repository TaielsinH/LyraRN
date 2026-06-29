import { useCallback, useEffect, useState } from "react";

import {
    createAgrupacion,
    getAgrupacionesByDirector,
    softDeleteAgrupaciones,
    updateAgrupacion,
} from "../services/agrupacionService";
import { getActiveShowCountByAgrupacion } from "../services/showService";
import type { Agrupacion } from "../types";

type UseAgrupacionesOptions = {
  includeShowCounts?: boolean;
};

async function getShowCountsByAgrupacion(
  agrupaciones: Agrupacion[]
): Promise<Record<string, number>> {
  const entries = await Promise.all(
    agrupaciones.map(async (agrupacion) => {
      const count = await getActiveShowCountByAgrupacion(agrupacion.id);
      return [agrupacion.id, count] as const;
    })
  );

  return Object.fromEntries(entries);
}

export function useAgrupaciones(
  directorId?: string,
  options: UseAgrupacionesOptions = {}
) {
  const includeShowCounts = options.includeShowCounts ?? false;
  const [agrupaciones, setAgrupaciones] = useState<Agrupacion[]>([]);
  const [showCountsByAgrupacionId, setShowCountsByAgrupacionId] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAgrupaciones = useCallback(async () => {
    if (!directorId) {
      setAgrupaciones([]);
      setShowCountsByAgrupacionId({});
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAgrupacionesByDirector(directorId);
      const showCounts = includeShowCounts
        ? await getShowCountsByAgrupacion(data)
        : {};

      setAgrupaciones(data);
      setShowCountsByAgrupacionId(showCounts);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las agrupaciones.");
    } finally {
      setLoading(false);
    }
  }, [directorId, includeShowCounts]);

  const createNewAgrupacion = useCallback(
    async (nombre: string) => {
      if (!directorId) {
        throw new Error("No hay un usuario autenticado.");
      }

      try {
        setCreating(true);
        setErrorMessage("");

        const nuevaAgrupacion = await createAgrupacion({
          nombre,
          directorId,
        });

        setAgrupaciones((current) =>
          [...current, nuevaAgrupacion].sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
        );
        setShowCountsByAgrupacionId((current) => ({
          ...current,
          [nuevaAgrupacion.id]: 0,
        }));

        return nuevaAgrupacion;
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setErrorMessage(error.message);
          throw error;
        }

        const fallbackMessage = "No se pudo crear la agrupación.";
        setErrorMessage(fallbackMessage);
        throw new Error(fallbackMessage);
      } finally {
        setCreating(false);
      }
    },
    [directorId]
  );

  const updateAgrupacionNombre = useCallback(
    async (id: string, nombre: string) => {
      try {
        setUpdating(true);
        setErrorMessage("");

        await updateAgrupacion(id, { nombre });

        setAgrupaciones((current) =>
          current
            .map((item) =>
              item.id === id ? { ...item, nombre: nombre.trim() } : item
            )
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setErrorMessage(error.message);
          throw error;
        }

        const fallbackMessage = "No se pudo editar la agrupación.";
        setErrorMessage(fallbackMessage);
        throw new Error(fallbackMessage);
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const deleteAgrupaciones = useCallback(async (ids: string[]) => {
    try {
      setDeleting(true);
      setErrorMessage("");

      await softDeleteAgrupaciones(ids);

      setAgrupaciones((current) =>
        current.filter((item) => !ids.includes(item.id))
      );
      setShowCountsByAgrupacionId((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([id]) => !ids.includes(id))
        )
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
        throw error;
      }

      const fallbackMessage = "No se pudieron eliminar las agrupaciones.";
      setErrorMessage(fallbackMessage);
      throw new Error(fallbackMessage);
    } finally {
      setDeleting(false);
    }
  }, []);

  useEffect(() => {
    loadAgrupaciones();
  }, [loadAgrupaciones]);

  return {
    agrupaciones,
    showCountsByAgrupacionId,
    loading,
    creating,
    updating,
    deleting,
    errorMessage,
    loadAgrupaciones,
    createNewAgrupacion,
    updateAgrupacionNombre,
    deleteAgrupaciones,
  };
}
