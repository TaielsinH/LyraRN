import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../../src/features/auth/AuthContext";
import { getUserSetlistById } from "../../src/features/setlists/setlistService";
import type {
    Partitura,
    Setlist,
} from "../../src/features/setlists/types";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 24,
  },
  loadingText: {
    color: "#9ca3af",
  },
  error: {
    color: "#f87171",
    fontSize: 16,
  },
  partituraItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  partituraTitle: {
    color: "#ffffff",
    fontSize: 18,
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
});