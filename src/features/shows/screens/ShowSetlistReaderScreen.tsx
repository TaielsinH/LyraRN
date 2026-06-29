import { router, useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import { useShowSetlistReader } from "../hooks/useShowSetlistReader";
import type { SetlistReaderRow } from "../types";
import { styles } from "./ShowSetlistReaderScreen.styles";

function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function openPdf(row: SetlistReaderRow) {
  if (!row.pdf?.url) return;

  router.push({
    pathname: "/pdf-viewer",
    params: {
      url: row.pdf.url,
      title: row.pdf.nombre,
    },
  });
}

function SetlistReaderItem({ row }: { row: SetlistReaderRow }) {
  const hasPdf = Boolean(row.pdf?.url);

  return (
    <View style={styles.row}>
      <View style={styles.orderContainer}>
        <Text style={styles.orderText}>{row.orden}</Text>
      </View>

      <View style={styles.songContainer}>
        <Text style={styles.songName}>{row.nombre}</Text>
      </View>

      {hasPdf ? (
        <Pressable style={styles.pdfBadge} onPress={() => openPdf(row)}>
          <Text style={styles.pdfBadgeText}>PDF</Text>
        </Pressable>
      ) : (
        <View style={styles.tacetBadge}>
          <Text style={styles.tacetBadgeText}>Tacet</Text>
        </View>
      )}
    </View>
  );
}

export function ShowSetlistReaderScreen() {
  const params = useLocalSearchParams();

  const agrupacionId = getParam(params.agrupacionId);
  const showId = getParam(params.showId);
  const instrumentoId = getParam(params.instrumentoId);

  const { show, instrumento, rows, loading, errorMessage } =
    useShowSetlistReader({
      agrupacionId,
      showId,
      instrumentoId,
    });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color="#FFFFFF" />
        <Text style={styles.loadingText}>Cargando setlist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{show?.nombre ?? "Show sin nombre"}</Text>
        <Text style={styles.subtitle}>
          {instrumento?.nombre ?? "Instrumento"}
          {show?.fecha ? ` • ${show.fecha}` : ""}
        </Text>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderOrder}>#</Text>
        <Text style={styles.tableHeaderSong}>Obra</Text>
        <Text style={styles.tableHeaderStatus}>Material</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          rows.length === 0 ? styles.emptyListContent : styles.listContent
        }
        renderItem={({ item }) => <SetlistReaderItem row={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Setlist vacío</Text>
            <Text style={styles.emptyText}>
              El director todavía no cargó obras en el setlist master.
            </Text>
          </View>
        }
      />
    </View>
  );
}
