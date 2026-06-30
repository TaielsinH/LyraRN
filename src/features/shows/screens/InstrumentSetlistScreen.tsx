import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
    type AlertButton,
} from "react-native";
import DraggableFlatList, {
    type RenderItemParams,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";

import { uploadPdfToCloudinary } from "../../../services/cloudinary";
import { useAuth } from "../../auth/context/AuthContext";
import {
  getUserPartiturasFromSetlists,
  normalizePartituras,
} from "../../setlists/services/partituraLibraryService";
import { useInstrumentSetlist } from "../hooks/useInstrumentSetlist";
import type { InstrumentPdf } from "../types";
import { styles } from "./InstrumentSetlistScreen.styles";

type LocalPdf = {
  uri: string;
  nombre: string;
};

type MaterialSlot = {
  id: string;
  pdf: InstrumentPdf | null;
  localPdf?: LocalPdf;
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default function InstrumentSetlistScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    agrupacionId?: string;
    showId?: string;
    instrumentoId?: string;
  }>();

  const agrupacionId = getParam(params.agrupacionId);
  const showId = getParam(params.showId);
  const instrumentoId = getParam(params.instrumentoId);

  const {
    show,
    instrumento,
    loading,
    errorMessage,
    accessCode,
    accessCodeLoading,
    accessCodeError,
    saveChanges,
  } = useInstrumentSetlist(
    agrupacionId,
    showId,
    instrumentoId,
    user?.uid ?? ""
  );

  const [materialSlots, setMaterialSlots] = useState<MaterialSlot[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cloudLibrary, setCloudLibrary] = useState<InstrumentPdf[]>([]);
  const [cloudLibraryLoaded, setCloudLibraryLoaded] = useState(false);
  const [cloudLibraryLoading, setCloudLibraryLoading] = useState(false);
  const [cloudLibraryError, setCloudLibraryError] = useState("");
  const [cloudPickerVisible, setCloudPickerVisible] = useState(false);
  const [cloudPickerIndex, setCloudPickerIndex] = useState<number | null>(null);
  const [cloudSearch, setCloudSearch] = useState("");

  const masterItems = show?.setlistMaster ?? [];

  useEffect(() => {
    if (!show || !instrumento || dirty) return;

    const nextMaterialSlots = show.setlistMaster.map((item) => ({
      id: `material-${item.id}`,
      pdf: instrumento.pdfsPorSetlistItem?.[item.id] ?? null,
    }));

    setMaterialSlots(nextMaterialSlots);
  }, [show, instrumento, dirty]);

  const visibleAccessCode = accessCode || instrumento?.codigoAcceso || "";
  const canCopyCode = Boolean(visibleAccessCode);
  const canSave = dirty && !saving;

  const filteredCloudLibrary = useMemo(() => {
    const searchTerm = cloudSearch.trim().toLocaleLowerCase();

    if (!searchTerm) return cloudLibrary;

    return cloudLibrary.filter((pdf) =>
      pdf.nombre.toLocaleLowerCase().includes(searchTerm)
    );
  }, [cloudLibrary, cloudSearch]);

  const folder = useMemo(() => {
    if (user) return `usuarios/${user.uid}/partituras`;

    return `shows/${showId}/instrumentos/${instrumentoId}`;
  }, [user, showId, instrumentoId]);

  async function copyCode() {
    if (!canCopyCode) return;

    await Clipboard.setStringAsync(visibleAccessCode);
    Alert.alert("Código copiado");
  }

  function handleDragEnd(nextSlots: MaterialSlot[]) {
    setMaterialSlots(nextSlots);
    setDirty(true);
  }

  function getMaterialText(slot: MaterialSlot) {
    if (slot.localPdf) return slot.localPdf.nombre;
    if (slot.pdf) return slot.pdf.nombre;
    return "Tacet";
  }

  async function loadCloudLibrary() {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    if (cloudLibraryLoaded || cloudLibraryLoading) return;

    try {
      setCloudLibraryLoading(true);
      setCloudLibraryError("");

      setCloudLibrary(await getUserPartiturasFromSetlists(user.uid));
      setCloudLibraryLoaded(true);
    } catch (error) {
      console.log("Error cargando partituras en nube:", error);
      setCloudLibraryError("No se pudieron cargar las partituras de la nube.");
    } finally {
      setCloudLibraryLoading(false);
    }
  }

  function openCloudPicker(index: number) {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado.");
      return;
    }

    setCloudPickerIndex(index);
    setCloudSearch("");
    setCloudPickerVisible(true);
    void loadCloudLibrary();
  }

  function closeCloudPicker() {
    setCloudPickerVisible(false);
    setCloudPickerIndex(null);
    setCloudSearch("");
  }

  function selectCloudPdf(pdf: InstrumentPdf) {
    if (cloudPickerIndex === null) return;

    setMaterialSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === cloudPickerIndex
          ? {
              ...slot,
              pdf,
              localPdf: undefined,
            }
          : slot
      )
    );

    setDirty(true);
    closeCloudPicker();
  }

  function mergeCloudLibrary(pdfs: InstrumentPdf[]) {
    if (pdfs.length === 0) return;

    setCloudLibrary((current) => normalizePartituras([...current, ...pdfs]));
    setCloudLibraryLoaded(true);
  }

  function openRowDialog(index: number) {
    const masterItem = masterItems[index];
    const slot = materialSlots[index];

    if (!masterItem || !slot) return;

    const buttons: AlertButton[] = [
        {
        text: "Subir PDF local",
        onPress: () => {
            void pickLocalPdf(index);
        },
        },
        {
        text: "Elegir PDF de la nube",
        onPress: () => {
            openCloudPicker(index);
        },
        },
    ];

    if (slot.pdf || slot.localPdf) {
        buttons.push({
        text: "Eliminar PDF",
        style: "destructive",
        onPress: () => {
            removePdf(index);
        },
        });
    }

    buttons.push({
        text: "Cancelar",
        style: "cancel",
    });

    Alert.alert(masterItem.nombre, "Elegí una acción", buttons);
    }

  async function pickLocalPdf(index: number) {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setMaterialSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              pdf: null,
              localPdf: {
                uri: asset.uri,
                nombre: asset.name ?? "archivo.pdf",
              },
            }
          : slot
      )
    );

    setDirty(true);
  }

  function removePdf(index: number) {
    setMaterialSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              pdf: null,
              localPdf: undefined,
            }
          : slot
      )
    );

    setDirty(true);
  }

  async function handleSave() {
    if (!canSave) return;

    try {
      setSaving(true);

      const nextPdfsPorSetlistItem: Record<string, InstrumentPdf> = {};
      const uploadedPdfs: InstrumentPdf[] = [];

      for (let index = 0; index < masterItems.length; index++) {
        const masterItem = masterItems[index];
        const slot = materialSlots[index];

        if (!masterItem || !slot) continue;

        if (slot.localPdf) {
          const uploadedPdf = await uploadPdfToCloudinary({
            uri: slot.localPdf.uri,
            fileName: slot.localPdf.nombre,
            folder,
          });

          nextPdfsPorSetlistItem[masterItem.id] = uploadedPdf;
          uploadedPdfs.push(uploadedPdf);
          continue;
        }

        if (slot.pdf) {
          nextPdfsPorSetlistItem[masterItem.id] = slot.pdf;
        }
      }

      await saveChanges(nextPdfsPorSetlistItem);
      mergeCloudLibrary(uploadedPdfs);

      setDirty(false);
      Alert.alert("Cambios guardados");
    } catch (error) {
      console.error("Error guardando instrumento:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  }

  function renderCloudPdf({ item }: { item: InstrumentPdf }) {
    return (
      <Pressable
        style={styles.cloudPdfItem}
        onPress={() => selectCloudPdf(item)}
      >
        <Text style={styles.cloudPdfName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.cloudPdfMeta} numberOfLines={1}>
          {item.publicId}
        </Text>
      </Pressable>
    );
  }

  function renderCloudEmptyState() {
    if (cloudLibraryLoading) {
      return (
        <View style={styles.cloudState}>
          <ActivityIndicator />
          <Text style={styles.cloudStateText}>Cargando partituras...</Text>
        </View>
      );
    }

    if (cloudLibraryError) {
      return (
        <View style={styles.cloudState}>
          <Text style={styles.cloudStateText}>{cloudLibraryError}</Text>
          <Pressable
            style={styles.cloudRetryButton}
            onPress={() => {
              setCloudLibraryLoaded(false);
              void loadCloudLibrary();
            }}
          >
            <Text style={styles.cloudRetryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.cloudState}>
        <Text style={styles.cloudStateText}>
          No hay partituras en la nube para mostrar.
        </Text>
      </View>
    );
  }

  function renderItem({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<MaterialSlot>) {
    const index = getIndex() ?? 0;
    const masterItem = masterItems[index];

    if (!masterItem) return null;

    const hasMaterial = Boolean(item.pdf || item.localPdf);

    return (
      <Pressable
        style={[styles.row, isActive && styles.activeRow]}
        onPress={() => openRowDialog(index)}
      >
        <Text style={styles.order}>{index + 1}</Text>

        <Text style={styles.songName} numberOfLines={1}>
          {masterItem.nombre}
        </Text>

        <Pressable
          onLongPress={drag}
          delayLongPress={120}
          hitSlop={12}
          style={styles.dragHandle}
        >
          <Text style={styles.dragText}>⋮⋮</Text>
        </Pressable>

        <View style={styles.pdfCell}>
          <Text
            style={[
              styles.pdfText,
              !hasMaterial && styles.emptyPdfText,
            ]}
            numberOfLines={1}
          >
            {getMaterialText(item)}
          </Text>
        </View>

        <Pressable style={styles.deleteCell} onPress={() => removePdf(index)}>
          <Text style={styles.deleteMark}>X</Text>
        </Pressable>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>{errorMessage}</Text>
      </SafeAreaView>
    );
  }

  if (!show || !instrumento) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>No se encontró el instrumento.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Show</Text>
        </Pressable>

        <Text style={styles.title}>{show.nombre}</Text>

        {!!show.fecha && <Text style={styles.date}>{show.fecha}</Text>}

        <Text style={styles.instrumentName}>{instrumento.nombre}</Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeText}>
            Código:{" "}
            {accessCodeLoading && !visibleAccessCode
              ? "Cargando..."
              : visibleAccessCode || "Sin código"}
          </Text>

          <Pressable
            style={[
              styles.copyButton,
              !canCopyCode && styles.copyButtonDisabled,
            ]}
            onPress={copyCode}
            disabled={!canCopyCode}
          >
            <Text
              style={[
                styles.copyButtonText,
                !canCopyCode && styles.copyButtonTextDisabled,
              ]}
            >
              Copiar
            </Text>
          </Pressable>
        </View>

        {accessCodeError ? (
          <Text style={styles.codeErrorText}>{accessCodeError}</Text>
        ) : null}

        <Pressable
          style={[
            styles.saveButton,
            !canSave && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text
            style={[
              styles.saveButtonText,
              !canSave && styles.saveButtonTextDisabled,
            ]}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Text>
        </Pressable>

        <DraggableFlatList
          data={materialSlots}
          keyExtractor={(slot) => slot.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => handleDragEnd(data)}
          contentContainerStyle={styles.listContent}
          activationDistance={8}
        />

        <Modal
          visible={cloudPickerVisible}
          animationType="slide"
          onRequestClose={closeCloudPicker}
        >
          <SafeAreaView style={styles.cloudModalScreen}>
            <View style={styles.cloudModalContent}>
              <View style={styles.cloudModalHeader}>
                <View>
                  <Text style={styles.cloudModalTitle}>Elegir PDF de la nube</Text>
                  <Text style={styles.cloudModalSubtitle}>
                    Seleccioná una partitura ya subida por este usuario.
                  </Text>
                </View>

                <Pressable
                  style={styles.cloudCloseButton}
                  onPress={closeCloudPicker}
                >
                  <Text style={styles.cloudCloseButtonText}>Cerrar</Text>
                </Pressable>
              </View>

              <TextInput
                value={cloudSearch}
                onChangeText={setCloudSearch}
                placeholder="Buscar por nombre..."
                placeholderTextColor="#8f9bb3"
                style={styles.cloudSearchInput}
              />

              <FlatList
                data={filteredCloudLibrary}
                keyExtractor={(item) => item.publicId}
                renderItem={renderCloudPdf}
                ListEmptyComponent={renderCloudEmptyState}
                contentContainerStyle={styles.cloudListContent}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
