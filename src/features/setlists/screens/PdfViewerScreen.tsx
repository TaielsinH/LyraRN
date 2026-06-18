import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import { styles } from "./PdfViewerScreen.styles";

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

