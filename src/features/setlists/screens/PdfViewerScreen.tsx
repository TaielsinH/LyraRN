import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { styles } from "./PdfViewerScreen.styles";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic"];

function isImageUrl(value: string): boolean {
  const withoutQuery = value.split("?")[0].toLowerCase();
  return IMAGE_EXTENSIONS.some((extension) =>
    withoutQuery.endsWith(extension)
  );
}

export default function PdfViewerScreen() {
  const { url, title } = useLocalSearchParams<{
    url: string;
    title?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const pdfUrl = String(url ?? "");
  const isImage = isImageUrl(pdfUrl);

  const [useFallbackViewer, setUseFallbackViewer] = useState(
    Platform.OS === "android"
  );

  const fallbackViewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
    pdfUrl
  )}`;

  const sourceUrl = useFallbackViewer ? fallbackViewerUrl : pdfUrl;

  if (!pdfUrl) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se encontró la URL del archivo.</Text>
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
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : null}

      {isImage ? (
        <Image
          source={{ uri: pdfUrl }}
          style={styles.image}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
        />
      ) : (
        <WebView
          key={sourceUrl}
          source={{ uri: sourceUrl }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            if (!useFallbackViewer) {
              setUseFallbackViewer(true);
              setLoading(true);
              return;
            }

            setLoading(false);
            setHasError(true);
          }}
          onHttpError={() => {
            if (!useFallbackViewer) {
              setUseFallbackViewer(true);
              setLoading(true);
              return;
            }

            setLoading(false);
            setHasError(true);
          }}
        />
      )}
    </View>
  );
}
