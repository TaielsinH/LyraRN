import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";
import { useAuth } from "../../auth/context/AuthContext";
import { getUserSetlistById } from "../services/setlistService";
import type {
    Partitura,
    Setlist,
} from "../types";
import { styles } from "./SetlistDetailScreen.styles";

export default function SetlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSetlist() {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        setErrorMessage("");

        const result = await getUserSetlistById(user.uid, id);

        if (!result) {
          setErrorMessage("No se encontró el setlist.");
          return;
        }

        setSetlist(result);
      } catch (error) {
        console.log("Error cargando setlist:", error);
        setErrorMessage("No se pudo cargar el setlist.");
      } finally {
        setLoading(false);
      }
    }

    loadSetlist();
  }, [user, id]);

  function openPartitura(partitura: Partitura) {
    if (!partitura.url) {
      return;
    }

    router.push({
      pathname: "/pdf-viewer",
      params: {
        url: partitura.url,
        title: partitura.nombre,
      },
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Cargando repertorio...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{setlist?.titulo ?? "Setlist"}</Text>
      <Text style={styles.subtitle}>
        Seleccioná una obra para abrir su partitura
      </Text>

      <FlatList
        data={setlist?.partituras ?? []}
        keyExtractor={(item, index) => item.publicId || item.url || String(index)}
        renderItem={({ item }) => (
          <Pressable
            style={styles.partituraItem}
            onPress={() => openPartitura(item)}
          >
            <Text style={styles.partituraTitle}>
              {item.nombre || "Partitura sin nombre"}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Este setlist no tiene partituras.</Text>
        }
      />
    </View>
  );
}

