import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import { useAuth } from "../../auth/context/AuthContext";
import { cargarShowSetlistsSuscriptos } from "../services/showSetlistsSuscriptosService";
import type { ShowSetlistSuscripto } from "../types";

export function useShowSetlistsSuscriptos() {
  const { user } = useAuth();

  const [setlists, setSetlists] = useState<ShowSetlistSuscripto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSetlists = useCallback(
    async (asRefresh = false) => {
      if (!user) {
        setSetlists([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        setErrorMessage("");

        if (asRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result = await cargarShowSetlistsSuscriptos(user.uid);
        setSetlists(result);
      } catch (error) {
        console.error("Error cargando show setlists suscriptos", error);
        setErrorMessage("No se pudieron cargar tus shows.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useFocusEffect(
    useCallback(() => {
      loadSetlists();
    }, [loadSetlists])
  );

  const refresh = useCallback(() => {
    loadSetlists(true);
  }, [loadSetlists]);

  return {
    setlists,
    loading,
    refreshing,
    errorMessage,
    refresh,
  };
}
