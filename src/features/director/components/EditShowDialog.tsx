import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Show } from "../types";
import { styles } from "./CreateShowDialog.style";

type EditShowDialogProps = {
  visible: boolean;
  saving: boolean;
  show: Show | null;
  onClose: () => void;
  onSave: (nombre: string, fecha?: string) => Promise<void>;
};

export function EditShowDialog({
  visible,
  saving,
  show,
  onClose,
  onSave,
}: EditShowDialogProps) {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (visible) {
      setNombre(show?.nombre ?? "");
      setFecha(show?.fecha ?? "");
      setLocalError("");
    }
  }, [visible, show]);

  async function handleSave() {
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
      await onSave(trimmedName, trimmedFecha || undefined);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("No se pudo editar el show.");
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
          <Text style={styles.title}>Editar show</Text>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del show"
            style={styles.input}
            editable={!saving}
          />

          <TextInput
            value={fecha}
            onChangeText={setFecha}
            placeholder="Fecha opcional: YYYY-MM-DD"
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
