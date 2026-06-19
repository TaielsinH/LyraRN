import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View
} from "react-native";

import { FloatingActionButton } from "../../../shared/components/FloatingActionButton";
import { useAuth } from "../../auth/context/AuthContext";
import { CreateAgrupacionDialog } from "../components/CreateAgrupacionDialog";
import { useAgrupaciones } from "../hooks/useAgrupaciones";
import type { Agrupacion } from "../types";
import { styles } from "./DirectorScreen.styles";

export default function DirectorScreen() {
  const { user } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  const {
    agrupaciones,
    loading,
    creating,
    errorMessage,
    createNewAgrupacion,
  } = useAgrupaciones(user?.uid);

  async function handleCreateAgrupacion(nombre: string) {
    await createNewAgrupacion(nombre);
  }

  function renderAgrupacion({ item }: { item: Agrupacion }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de director</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={agrupaciones}
          keyExtractor={(item) => item.id}
          renderItem={renderAgrupacion}
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

      <FloatingActionButton onPress={() => setDialogVisible(true)} />

      <CreateAgrupacionDialog
        visible={dialogVisible}
        creating={creating}
        onClose={() => setDialogVisible(false)}
        onCreate={handleCreateAgrupacion}
      />
    </View>
  );
}