import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../auth/context/AuthContext";
import { logout } from "../../auth/services/authService";
import { SetlistCard } from "../components/SetlistCard";
import { SetlistFloatingActionMenu } from "../components/SetlistFloatingActionMenu";
import { getUserSetlists } from "../services/setlistService";
import type { Setlist } from "../types";
import { styles } from "./SetlistsScreen.styles";

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

