import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingActionButton } from "../../../shared/components/FloatingActionButton";
import { HamburgerMenu } from "../../../shared/components/HamburgerMenu";
import { SelectionActionBar } from "../../../shared/components/SelectionActionBar";
import { SelectionCheckbox } from "../../../shared/components/SelectionCheckbox";
import { useHamburgerMenu } from "../../../shared/hooks/useHamburgerMenu";
import { CreateShowDialog } from "../components/CreateShowDialog";
import { EditShowDialog } from "../components/EditShowDialog";
import { useShows } from "../hooks/useShows";
import type { Show } from "../types";
import { styles } from "./ShowsScreen.styles";

export default function ShowsScreen({ showHamburger = true }: { showHamburger?: boolean }) {
  const params = useLocalSearchParams<{
    agrupacionId?: string;
    nombre?: string;
  }>();

  const agrupacionId = getParam(params.agrupacionId);
  const agrupacionNombre = getParam(params.nombre) || "Shows";

  const [dialogVisible, setDialogVisible] = useState(false);
  const { menuVisible, openMenu, closeMenu } = useHamburgerMenu();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  const selectionMode = selectedIds.size > 0;

  const {
    shows,
    loading,
    creating,
    updating,
    deleting,
    errorMessage,
    createNewShow,
    updateShowNombre,
    deleteShows,
  } = useShows(agrupacionId);

  function getParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value ?? "";
  }

  async function handleCreateShow(nombre: string, fecha?: string) {
    await createNewShow(nombre, fecha);
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

  function handleLongPress(show: Show) {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.add(show.id);
      return next;
    });
  }

  function handleCardPress(show: Show) {
    if (selectionMode) {
      toggleSelected(show.id);
      return;
    }

    if (!agrupacionId) {
      Alert.alert("Error", "No se encontró la agrupación.");
      return;
    }

    router.push({
      pathname: "/agrupaciones/[agrupacionId]/shows/[showId]",
      params: { agrupacionId, showId: show.id },
    });
  }

  function handleEditPress() {
    if (selectedIds.size !== 1) return;
    const [id] = Array.from(selectedIds);
    const show = shows.find((item) => item.id === id) ?? null;
    if (!show) return;
    setEditingShow(show);
    setEditDialogVisible(true);
  }

  async function handleSaveEdit(nombre: string, fecha?: string) {
    if (!editingShow) return;
    await updateShowNombre(editingShow.id, nombre, fecha);
    exitSelectionMode();
  }

  function handleCloseEditDialog() {
    setEditDialogVisible(false);
    setEditingShow(null);
  }

  function handleDeletePress() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    Alert.alert(
      ids.length === 1 ? "Eliminar show" : "Eliminar shows",
      ids.length === 1
        ? "¿Querés eliminar el show seleccionado?"
        : `¿Querés eliminar los ${ids.length} shows seleccionados?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteShows(ids);
              exitSelectionMode();
            } catch {}
          },
        },
      ]
    );
  }

  function renderShow({ item }: { item: Show }) {
    const selected = selectedIds.has(item.id);

    return (
      <Pressable
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => handleCardPress(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardSubtitle}>
          {item.fecha ? `Fecha: ${item.fecha}` : "Sin fecha definida"}
        </Text>
        <Text style={styles.cardMeta}>
          {item.setlistMaster.length} obras en setlist
        </Text>
        {selectionMode ? (
          <SelectionCheckbox selected={selected} style={styles.checkbox} />
        ) : null}
      </Pressable>
    );
  }

  const Container = showHamburger ? SafeAreaView : View;

  return (
    <Container style={styles.container}>
      {selectionMode ? (
        <SelectionActionBar
          selectedCount={selectedIds.size}
          onCancel={exitSelectionMode}
          onEdit={handleEditPress}
          onDelete={handleDeletePress}
          deleting={deleting}
        />
      ) : (
        showHamburger ? (
          <View style={styles.header}>
            <Pressable onPress={openMenu} style={styles.hamburgerButton} hitSlop={8}>
              <Ionicons name="menu" size={26} color="#111827" />
            </Pressable>
            <Text style={styles.title}>{agrupacionNombre}</Text>
          </View>
        ) : null
      )}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={shows}
          keyExtractor={(item) => item.id}
          renderItem={renderShow}
          extraData={selectedIds}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {agrupacionId
                ? "Todavía no creaste shows para esta agrupación."
                : "Seleccioná una agrupación desde el menú para ver sus shows."}
            </Text>
          }
        />
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {!selectionMode ? (
        <FloatingActionButton onPress={() => setDialogVisible(true)} />
      ) : null}

      <CreateShowDialog
        visible={dialogVisible}
        creating={creating}
        onClose={() => setDialogVisible(false)}
        onCreate={handleCreateShow}
      />

      <EditShowDialog
        visible={editDialogVisible}
        saving={updating}
        show={editingShow}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />

      <HamburgerMenu visible={menuVisible} onClose={closeMenu} />
    </Container>
  );
}
