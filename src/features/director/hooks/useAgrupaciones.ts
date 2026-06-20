import { useCallback, useEffect, useState } from "react";

import {
    createAgrupacion,
    getAgrupacionesByDirector,
    softDeleteAgrupaciones,
    updateAgrupacion,
} from "../services/agrupacionService";
import type { Agrupacion } from "../types";

export function useAgrupaciones(directorId?: string) {
  const [agrupaciones, setAgrupaciones] = useState<Agrupacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadAgrupaciones = useCallback(async () => {
    if (!directorId) {
      setAgrupaciones([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAgrupacionesByDirector(directorId);
      setAgrupaciones(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron cargar las agrupaciones.");
    } finally {
      setLoading(false);
    }
  }, [directorId]);

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