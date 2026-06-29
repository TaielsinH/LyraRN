import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";
import { useShowSetlistsSuscriptos } from "../hooks/useShowSetlistsSuscriptos";
import type { ShowSetlistSuscripto } from "../types";
import { styles } from "./ShowSetlistsSuscriptosScreen.styles";

function ShowSetlistCard({ item }: { item: ShowSetlistSuscripto }) {
    function handlePress() {
    router.push({
      pathname: "/show-setlist-reader",
      params: {
        agrupacionId: item.agrupacionId,
        showId: item.showId,
        instrumentoId: item.instrumentoId,
      },
    });
  }

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>♪</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.showName}>{item.nombreShow}</Text>
          <Text style={styles.instrumentName}>{item.nombreInstrumento}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          {item.fechaShow ? item.fechaShow : "Sin fecha"}
        </Text>
      </View>

      <Text style={styles.codeText}>Código: {item.codigo}</Text>
    </Pressable>
  );
}

export function ShowSetlistsSuscriptosScreen() {
  const {
    setlists,
    loading,
    refreshing,
    errorMessage,
    refresh,
  } = useShowSetlistsSuscriptos();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#FFFFFF" />
        <Text style={styles.loadingText}>Cargando shows...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis shows</Text>
      <Text style={styles.subtitle}>
        Shows de instrumento a los que estás suscripto.
      </Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={setlists}
        keyExtractor={(item) =>
          `${item.agrupacionId}-${item.showId}-${item.instrumentoId}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={
          setlists.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        renderItem={({ item }) => <ShowSetlistCard item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No tenés shows suscriptos
            </Text>
            <Text style={styles.emptyText}>
              Cuando ingreses con un código de instrumento, el show va a
              aparecer acá.
            </Text>
          </View>
        }
      />
    </View>
  );
}
