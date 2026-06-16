import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../src/features/auth/AuthContext";
import { SetlistCard } from "../../src/features/setlists/SetlistCard";
import { getUserSetlists } from "../../src/features/setlists/setlistService";
import type { Setlist } from "../../src/features/setlists/types";

export default function SetlistsScreen() {
  const { user } = useAuth();

  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSetlists() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setErrorMessage("");

      const result = await getUserSetlists(user.uid);

      setSetlists(result);
    } catch (error) {
      console.log("Error cargando setlists:", error);
      setErrorMessage("No se pudieron cargar los setlists.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadSetlists();
  }, [user]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadSetlists();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Cargando setlists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setlists</Text>

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={setlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SetlistCard
            setlist={item}
            onPress={() => {
              router.push({
                pathname: "/setlists/[id]",
                params: {
                  id: item.id,
                },
              });
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No hay setlists cargados.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#6b7280",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  error: {
    color: "#dc2626",
    marginBottom: 12,
  },
  empty: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 24,
  },
});