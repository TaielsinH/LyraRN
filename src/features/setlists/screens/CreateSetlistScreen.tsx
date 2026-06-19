import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LocationMap } from "../components/LocationMap";
import type { LocalPdf } from "../types";
import { styles } from "./CreateSetlistScreen.styles";

export default function CreateSetlistScreen() {
  const [title, setTitle] = useState("");
  const [groupName, setGroupName] = useState("");
  const [location, setLocation] = useState("");

  const [pdfs, setPdfs] = useState<LocalPdf[]>([]);

  const [locationData, setLocationData] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [localPhotosQueue, setLocalPhotosQueue] = useState<string[]>([]);

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

  async function handleTakePhoto() {
    setLocalPhotosQueue([]); 
    setIsCameraModalVisible(true); 
  }

  async function handleCapturePage() {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'], 
        quality: 0.8,           
        allowsEditing: false, 
      });

      if (result.canceled) return;

      const newPhotoUri = result.assets[0].uri;

      setLocalPhotosQueue((currentQueue) => {
        const updatedQueue = [...currentQueue, newPhotoUri];

        setTimeout(() => {
          Alert.alert(
            `Página ${updatedQueue.length} capturada`,
            "¿Querés capturar la siguiente página de esta partitura?",
            [
              {
                text: "No, terminar",
                style: "cancel",
              },
              {
                text: "Sí, sacar otra",
                onPress: () => handleCapturePage(),
              },
            ]
          );
        }, 300);

        return updatedQueue;
      });

    } catch (error) {
      console.log("Error al capturar la foto:", error);
      Alert.alert("Error", "No se pudo capturar la foto.");
    }
  }

  function handleSaveCapturedBatch() {
    if (localPhotosQueue.length === 0) {
      Alert.alert("Cola vacia", "Saca una foto para comenzar a crear el PDF.");
      return;
    }

    const totalPages = localPhotosQueue.length;
    
    const singleCombinedPdf: LocalPdf = {
      name: `Partitura (${totalPages} ${totalPages === 1 ? 'pág' : 'págs'})`,
      uri: localPhotosQueue[0], 
      size: 1024 * 500 * totalPages,
      mimeType: "application/pdf", 
    };

    setPdfs((currentPdfs) => [...currentPdfs, singleCombinedPdf]);
    setIsCameraModalVisible(false); 
  }

  async function handleUseCurrentLocation() {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita permiso de ubicación para usar esta función.");
        setLoadingLocation(false);
        return;
      }

      const currentUserLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocationData({
        latitude: currentUserLocation.coords.latitude,
        longitude: currentUserLocation.coords.longitude,
      });

    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
    } finally {
      setLoadingLocation(false);
    }
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
            extraData={pdfs}
            keyExtractor={(item) => item.uri}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.pdfItem}>
                <View style={styles.pdfInfo}>
                  <Text style={styles.pdfName}>{item.name}</Text>
                  <Text style={styles.pdfMeta}>
                    {item.mimeType?.includes("image") 
                      ? "Imagen capturada" 
                      : `${Math.round((item.size || 0) / 1024)} KB`
                    }
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
        
        {locationData ? (
          <LocationMap coordinate={locationData} />
        ) : (
          <Text style={styles.helperText}>
            {loadingLocation ? "Cargando mapa y coordenadas..." : "Latitude and longitude not loaded"}
          </Text>
        )}

        <Pressable 
          style={[
            styles.outlineButtonFull,
            loadingLocation && styles.outlineButtonDisabled,
          ]} 
          onPress={handleUseCurrentLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.outlineButtonText}>
            {loadingLocation ? "Obteniendo ubicación..." : "Use current location"}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleCreateSetlist}>
        <Text style={styles.primaryButtonText}>Create Setlist</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>

      <Modal 
        visible={isCameraModalVisible} 
        animationType="slide" 
        transparent={false}
        onRequestClose={() => setIsCameraModalVisible(false)} 
      >
        <View style={styles.modalContainer}>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Capturar Partitura</Text>
            <Text style={styles.modalSubtitle}>Toma una foto para convertirla en PDF</Text>
            <Text style={styles.modalQueueText}>
              Páginas en cola: {localPhotosQueue.length}
            </Text>
          </View>

          <View style={styles.modalImageArea}>
            {localPhotosQueue.length > 0 ? (
              <ScrollView 
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={true}
              >
                {localPhotosQueue.map((uri, index) => (
                  <View key={index} style={styles.modalImageWrapper}>
                    <Image 
                      source={{ uri: uri }} 
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyFlex} />
            )}
          </View>

          <View style={styles.modalFooter}>
            <Pressable onPress={handleCapturePage} style={styles.captureButton}>
              <Text style={styles.modalButtonText}>Tomar Foto</Text>
            </Pressable>

            <Pressable onPress={handleSaveCapturedBatch} style={styles.saveButton}>
              <Text style={styles.modalButtonText}>Guardar</Text>
            </Pressable>
          </View>

        </View>
      </Modal>

    </ScrollView>
  );}