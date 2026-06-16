import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function PdfViewerScreen() {
  const { url, title } = useLocalSearchParams<{
    url: string;
    title?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const pdfUrl = String(url ?? "");

  const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
    pdfUrl
  )}`;

  if (!pdfUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se encontró la URL del PDF.</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se pudo cargar la partitura.</Text>

        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL(pdfUrl)}
        >
          <Text style={styles.buttonText}>Abrir en navegador</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? "Partitura"}</Text>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Cargando PDF...</Text>
        </View>
      ) : null}

      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setHasError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    padding: 12,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    zIndex: 1,
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#ffffff",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  error: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});