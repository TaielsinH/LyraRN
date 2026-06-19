import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { styles } from "./CreateShowDialog.style";

type CreateShowDialogProps = {
  visible: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (nombre: string, fecha?: string) => Promise<void>;
};

export function CreateShowDialog({
  visible,
  creating,
  onClose,
  onCreate,
}: CreateShowDialogProps) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [localError, setLocalError] = useState("");

  async function handleCreate() {
    const trimmedName = nombre.trim();
    const trimmedFecha = fecha.trim();

    if (!trimmedName) {
      setLocalError("Ingresá un nombre para el show.");
      return;
    }

    if (trimmedFecha && !/^\d{4}-\d{2}-\d{2}$/.test(trimmedFecha)) {
      setLocalError("La fecha debe tener formato YYYY-MM-DD.");
      return;
    }

    try {
      setLocalError("");
      await onCreate(trimmedName, trimmedFecha || undefined);
      setNombre("");
      setFecha("");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("No se pudo crear el show.");
      }
    }
  }

  function handleClose() {
    if (creating) return;

    setNombre("");
    setFecha("");
    setLocalError("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Crear show</Text>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del show"
            style={styles.input}
            editable={!creating}
          />

          <TextInput
            value={fecha}
            onChangeText={setFecha}
            placeholder="Fecha opcional: YYYY-MM-DD"
            style={styles.input}
            editable={!creating}
          />

          {localError ? (
            <Text style={styles.errorText}>{localError}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={styles.secondaryButton}
              disabled={creating}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleCreate}
              style={styles.primaryButton}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.primaryButtonText}>Crear</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}