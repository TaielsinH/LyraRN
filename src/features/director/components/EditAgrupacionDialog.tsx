import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Agrupacion } from "../types";
import { styles } from "./CreateAgrupacionDialog.styles";

type EditAgrupacionDialogProps = {
  visible: boolean;
  saving: boolean;
  agrupacion: Agrupacion | null;
  onClose: () => void;
  onSave: (nombre: string) => Promise<void>;
};

export function EditAgrupacionDialog({
  visible,
  saving,
  agrupacion,
  onClose,
  onSave,
}: EditAgrupacionDialogProps) {
  const [nombre, setNombre] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (visible) {
      setNombre(agrupacion?.nombre ?? "");
      setLocalError("");
    }
  }, [visible, agrupacion]);

  async function handleSave() {
    const trimmedName = nombre.trim();

    if (!trimmedName) {
      setLocalError("Ingresá un nombre para la agrupación.");
      return;
    }

    try {
      setLocalError("");
      await onSave(trimmedName);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("No se pudo editar la agrupación.");
      }
    }
  }

  function handleClose() {
    if (saving) return;

    setLocalError("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Editar agrupación</Text>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre de la agrupación"
            style={styles.input}
            editable={!saving}
          />

          {localError ? (
            <Text style={styles.errorText}>{localError}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={styles.secondaryButton}
              disabled={saving}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={styles.primaryButton}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.primaryButtonText}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
