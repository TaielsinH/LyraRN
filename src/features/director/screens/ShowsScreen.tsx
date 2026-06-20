import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { FloatingActionButton } from "../../../shared/components/FloatingActionButton";
import { SelectionActionBar } from "../../../shared/components/SelectionActionBar";
import { SelectionCheckbox } from "../../../shared/components/SelectionCheckbox";
import { CreateShowDialog } from "../components/CreateShowDialog";
import { EditShowDialog } from "../components/EditShowDialog";
import { useShows } from "../hooks/useShows";
import type { Show } from "../types";
import { styles } from "./ShowsScreen.styles";

export default function ShowsScreen() {
  const params = useLocalSearchParams<{
    agrupacionId?: string;
    nombre?: string;
  }>();

  const agrupacionId = params.agrupacionId;
  const agrupacionNombre = params.nombre ?? "Agrupación";

  const [dialogVisible, setDialogVisible] = useState(false);

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
    }
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
            } catch {

            }
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

  return (
    <View style={styles.container}>
      {selectionMode ? (
        <SelectionActionBar
          selectedCount={selectedIds.size}
          onCancel={exitSelectionMode}
          onEdit={handleEditPress}
          onDelete={handleDeletePress}
          deleting={deleting}
        />
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>{agrupacionNombre}</Text>
        </View>
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
              Todavía no creaste shows para esta agrupación.
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
    </View>
  );
}
