import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import type { LocalPdf } from "../../src/features/setlists/types";

export default function CreateSetlistScreen() {
  const [title, setTitle] = useState("");
  const [groupName, setGroupName] = useState("");
  const [location, setLocation] = useState("");

  const [pdfs, setPdfs] = useState<LocalPdf[]>([]);

  async function handlePickPdf() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedPdfs: LocalPdf[] = result.assets.map((asset) => ({
        name: asset.name,
        uri: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType,
      }));

      setPdfs((currentPdfs) => [...currentPdfs, ...selectedPdfs]);
    } catch (error) {
      console.log("Error seleccionando PDF:", error);
      Alert.alert("Error", "No se pudo seleccionar el PDF.");
    }
  }

  function handleTakePhoto() {
    Alert.alert("Mock", "Después implementamos tomar foto.");
  }

  function handleUseCurrentLocation() {
    Alert.alert("Mock", "Después implementamos ubicación actual.");
  }

  function handleRemovePdf(uri: string) {
    setPdfs((currentPdfs) => currentPdfs.filter((pdf) => pdf.uri !== uri));
  }

  function handleCreateSetlist() {
    console.log("Crear setlist mock:", {
      title,
      groupName,
      location,
      pdfs,
    });

    Alert.alert(
      "Mock",
      `Setlist listo para crear con ${pdfs.length} PDF(s). Después conectamos Cloudinary y Firestore.`
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Setlist</Text>
      <Text style={styles.subtitle}>
        Organize your songs and material for the show
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Setlist Name"
          placeholderTextColor="#8b95a7"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Group or artist"
          placeholderTextColor="#8b95a7"
          value={groupName}
          onChangeText={setGroupName}
        />

        <TextInput
          style={styles.input}
          placeholder="Event location"
          placeholderTextColor="#8b95a7"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Material</Text>

        <View style={styles.row}>
          <Pressable style={styles.outlineButton} onPress={handlePickPdf}>
            <Text style={styles.outlineButtonText}>Add PDF</Text>
          </Pressable>

          <Pressable style={styles.outlineButton} onPress={handleTakePhoto}>
            <Text style={styles.outlineButtonText}>Take photo</Text>
          </Pressable>
        </View>

        {pdfs.length === 0 ? (
          <Text style={styles.helperText}>You have not added songs yet</Text>
        ) : (
          <FlatList
            data={pdfs}
            keyExtractor={(item) => item.uri}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.pdfItem}>
                <View style={styles.pdfInfo}>
                  <Text style={styles.pdfName}>{item.name}</Text>
                  <Text style={styles.pdfMeta}>
                    {item.size ? `${Math.round(item.size / 1024)} KB` : "PDF local"}
                  </Text>
                </View>

                <Pressable onPress={() => handleRemovePdf(item.uri)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.helperText}>Latitude and longitude not loaded</Text>

        <Pressable style={styles.outlineButtonFull} onPress={handleUseCurrentLocation}>
          <Text style={styles.outlineButtonText}>Use current location</Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleCreateSetlist}>
        <Text style={styles.primaryButtonText}>Create Setlist</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28,
  },
  section: {
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#1e293b",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineButtonFull: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  outlineButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  helperText: {
    color: "#9ca3af",
    fontSize: 15,
  },
  pdfItem: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pdfInfo: {
    flex: 1,
    paddingRight: 12,
  },
  pdfName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  pdfMeta: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  removeText: {
    color: "#f87171",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    paddingVertical: 18,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontWeight: "700",
  },
});