import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HamburgerMenu } from "../../../shared/components/HamburgerMenu";
import { SearchBar } from "../../../shared/components/SearchBar";
import { SelectionActionBar } from "../../../shared/components/SelectionActionBar";
import { useHamburgerMenu } from "../../../shared/hooks/useHamburgerMenu";
import { useAuth } from "../../auth/context/AuthContext";
import { SetlistCard } from "../components/SetlistCard";
import { SetlistFloatingActionMenu } from "../components/SetlistFloatingActionMenu";
import { getUserSetlists, softDeleteSetlists } from "../services/setlistService";
import type { Setlist } from "../types";
import { styles } from "./SetlistsScreen.styles";

export default function SetlistsScreen() {
  const { user } = useAuth();
  const { menuVisible, openMenu, closeMenu } = useHamburgerMenu();

  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const selectionMode = selectedIds.size > 0;

  const filteredSetlists = useMemo(() => {
    if (!searchQuery.trim()) return setlists;
    const q = searchQuery.toLowerCase();
    return setlists.filter((s) => s.titulo?.toLowerCase().includes(q));
  }, [setlists, searchQuery]);

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

  function exitSelectionMode() {
    setSelectedIds(new Set());
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleLongPress(setlist: Setlist) {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.add(setlist.id);
      return next;
    });
  }

  function handleCardPress(setlist: Setlist) {
    if (selectionMode) {
      toggleSelected(setlist.id);
      return;
    }

    router.push({
      pathname: "/setlists/[id]",
      params: { id: setlist.id },
    });
  }

  function handleDeletePress() {
    if (!user) return;

    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    Alert.alert(
      ids.length === 1 ? "Eliminar setlist" : "Eliminar setlists",
      ids.length === 1
        ? "¿Querés eliminar el setlist seleccionado?"
        : `¿Querés eliminar los ${ids.length} setlists seleccionados?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await softDeleteSetlists(user.uid, ids);
              setSetlists((current) =>
                current.filter((item) => !ids.includes(item.id))
              );
              exitSelectionMode();
            } catch (error) {
              console.log("Error eliminando setlists:", error);
              setErrorMessage("No se pudieron eliminar los setlists.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Cargando setlists...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {selectionMode ? (
        <SelectionActionBar
          selectedCount={selectedIds.size}
          onCancel={exitSelectionMode}
          onDelete={handleDeletePress}
          deleting={deleting}
        />
      ) : (
        <View style={styles.header}>
          <Pressable onPress={openMenu} style={styles.hamburgerButton} hitSlop={8}>
            <Ionicons name="menu" size={26} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Mis Setlists</Text>
        </View>
      )}

      {!selectionMode && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar setlist..."
        />
      )}

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={filteredSetlists}
        keyExtractor={(item) => item.id}
        extraData={selectedIds}
        renderItem={({ item }) => (
          <SetlistCard
            setlist={item}
            selected={selectedIds.has(item.id)}
            selectionMode={selectionMode}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery
              ? "No se encontraron setlists."
              : "No hay setlists cargados."}
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {!selectionMode ? (
        <SetlistFloatingActionMenu
          onCreatePress={() => {
            router.push("/setlists/create");
          }}
          onCodePress={() => {
            console.log("Generar o compartir codigo");
          }}
        />
      ) : null}

      <HamburgerMenu visible={menuVisible} onClose={closeMenu} />
    </SafeAreaView>
  );
}
