import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { styles } from "./CreateAgrupacionDialog.styles";

type CreateAgrupacionDialogProps = {
  visible: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (nombre: string) => Promise<void>;
};

export function CreateAgrupacionDialog({
  visible,
  creating,
  onClose,
  onCreate,
}: CreateAgrupacionDialogProps) {
  const [nombre, setNombre] = useState("");
  const [localError, setLocalError] = useState("");

  async function handleCreate() {
    const trimmedName = nombre.trim();

    if (!trimmedName) {
      setLocalError("Ingresá un nombre para la agrupación.");
      return;
    }

    try {
      setLocalError("");
      await onCreate(trimmedName);
      setNombre("");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("No se pudo crear la agrupación.");
      }
    }
  }

  function handleClose() {
    if (creating) return;

    setNombre("");
    setLocalError("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Crear agrupación</Text>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la agrupación"
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