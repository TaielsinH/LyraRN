import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../src/features/auth/AuthContext";
import { logout } from "../../src/features/auth/authService";
import { SetlistCard } from "../../src/features/setlists/SetlistCard";
import { SetlistFloatingActionMenu } from "../../src/features/setlists/SetlistFloatingActionMenu";
import { getUserSetlists } from "../../src/features/setlists/setlistService";
import type { Setlist } from "../../src/features/setlists/types";

export default function SetlistsScreen() {
  const { user } = useAuth();

  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSetlists = useCallback(async () => {
    if (!user) {
      setSetlists([]);
      setLoading(false);
      setRefreshing(false);
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
  }, [user]);

  useEffect(() => {
    loadSetlists();
  }, [loadSetlists]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadSetlists();
  }

  async function handleLogout() {
    try {
      setLogoutLoading(true);
      setErrorMessage("");

      await logout();

      router.replace("/login");
    } catch (error) {
      console.log("Error cerrando sesion:", error);
      setErrorMessage("No se pudo cerrar sesion.");
    } finally {
      setLogoutLoading(false);
    }
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
      <View style={styles.header}>
        <Text style={styles.title}>Setlists</Text>

        <Pressable
          disabled={logoutLoading}
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            (pressed || logoutLoading) && styles.logoutButtonPressed,
          ]}
        >
          {logoutLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
          )}
        </Pressable>
      </View>

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
      <SetlistFloatingActionMenu
        onCreatePress={() => {
          router.push("/setlists/create");
        }}
        onCodePress={() => {
          console.log("Generar o compartir codigo");
        }}
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
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 118,
    paddingHorizontal: 14,
  },
  logoutButtonPressed: {
    opacity: 0.75,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
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
