import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { FloatingActionButton } from "../../../shared/components/FloatingActionButton";
import { SelectionActionBar } from "../../../shared/components/SelectionActionBar";
import { SelectionCheckbox } from "../../../shared/components/SelectionCheckbox";
import { useAuth } from "../../auth/context/AuthContext";
import { CreateAgrupacionDialog } from "../components/CreateAgrupacionDialog";
import { EditAgrupacionDialog } from "../components/EditAgrupacionDialog";
import { useAgrupaciones } from "../hooks/useAgrupaciones";
import type { Agrupacion } from "../types";
import { styles } from "./DirectorScreen.styles";

export default function DirectorScreen() {
  const { user } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingAgrupacion, setEditingAgrupacion] = useState<Agrupacion | null>(
    null
  );

  const selectionMode = selectedIds.size > 0;

  const {
    agrupaciones,
    loading,
    creating,
    updating,
    deleting,
    errorMessage,
    createNewAgrupacion,
    updateAgrupacionNombre,
    deleteAgrupaciones,
  } = useAgrupaciones(user?.uid);

  async function handleCreateAgrupacion(nombre: string) {
    await createNewAgrupacion(nombre);
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

  function handleLongPress(agrupacion: Agrupacion) {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.add(agrupacion.id);
      return next;
    });
  }

  function handleCardPress(agrupacion: Agrupacion) {
    if (selectionMode) {
      toggleSelected(agrupacion.id);
      return;
    }

    handleAgrupacionPress(agrupacion);
  }

  function handleAgrupacionPress(agrupacion: Agrupacion) {
    router.push({
      pathname: "/agrupaciones/[agrupacionId]/shows",
      params: {
        agrupacionId: agrupacion.id,
        nombre: agrupacion.nombre,
      },
    });
  }

  function handleEditPress() {
    if (selectedIds.size !== 1) return;

    const [id] = Array.from(selectedIds);
    const agrupacion = agrupaciones.find((item) => item.id === id) ?? null;

    if (!agrupacion) return;

    setEditingAgrupacion(agrupacion);
    setEditDialogVisible(true);
  }

  async function handleSaveEdit(nombre: string) {
    if (!editingAgrupacion) return;

    await updateAgrupacionNombre(editingAgrupacion.id, nombre);
    exitSelectionMode();
  }

  function handleCloseEditDialog() {
    setEditDialogVisible(false);
    setEditingAgrupacion(null);
  }

  function handleDeletePress() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    Alert.alert(
      ids.length === 1 ? "Eliminar agrupación" : "Eliminar agrupaciones",
      ids.length === 1
        ? "¿Querés eliminar la agrupación seleccionada?"
        : `¿Querés eliminar las ${ids.length} agrupaciones seleccionadas?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAgrupaciones(ids);
              exitSelectionMode();
            } catch {
      
            }
          },
        },
      ]
    );
  }

  function renderAgrupacion({ item }: { item: Agrupacion }) {
    const selected = selectedIds.has(item.id);

    return (
      <Pressable
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => handleCardPress(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <Text style={styles.cardTitle}>{item.nombre}</Text>

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
        <Text style={styles.title}>Panel de director</Text>
      )}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={agrupaciones}
          keyExtractor={(item) => item.id}
          renderItem={renderAgrupacion}
          extraData={selectedIds}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Todavía no creaste ninguna agrupación.
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

      <CreateAgrupacionDialog
        visible={dialogVisible}
        creating={creating}
        onClose={() => setDialogVisible(false)}
        onCreate={handleCreateAgrupacion}
      />

      <EditAgrupacionDialog
        visible={editDialogVisible}
        saving={updating}
        agrupacion={editingAgrupacion}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
    </View>
  );
}