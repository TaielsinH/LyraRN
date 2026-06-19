import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { FloatingActionButton } from "../../../shared/components/FloatingActionButton";
import { CreateShowDialog } from "../components/CreateShowDialog";
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

  const {
    shows,
    loading,
    creating,
    errorMessage,
    createNewShow,
  } = useShows(agrupacionId);

  async function handleCreateShow(nombre: string, fecha?: string) {
    await createNewShow(nombre, fecha);
  }

  function renderShow({ item }: { item: Show }) {
    return (
      <Pressable style={styles.card}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>

        <Text style={styles.cardSubtitle}>
          {item.fecha ? `Fecha: ${item.fecha}` : "Sin fecha definida"}
        </Text>

        <Text style={styles.cardMeta}>
          {item.setlistMaster.length} obras en setlist
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{agrupacionNombre}</Text>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={shows}
          keyExtractor={(item) => item.id}
          renderItem={renderShow}
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

      <FloatingActionButton onPress={() => setDialogVisible(true)} />

      <CreateShowDialog
        visible={dialogVisible}
        creating={creating}
        onClose={() => setDialogVisible(false)}
        onCreate={handleCreateShow}
      />
    </View>
  );
}