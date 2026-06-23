import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { styles } from "./JoinShowByCodeDialog.styles";

type JoinShowByCodeDialogProps = {
  visible: boolean;
  joining: boolean;
  onClose: () => void;
  onJoin: (codigo: string) => Promise<void>;
};

function normalizeCodeInput(value: string) {
  return value.replace(/\s/g, "").toUpperCase().slice(0, 6);
}

export function JoinShowByCodeDialog({
  visible,
  joining,
  onClose,
  onJoin,
}: JoinShowByCodeDialogProps) {
  const [codigo, setCodigo] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!visible) {
      setCodigo("");
      setLocalError("");
    }
  }, [visible]);

  async function handleJoin() {
    const normalizedCode = normalizeCodeInput(codigo);

    if (!normalizedCode) {
      setLocalError("Ingresá un código.");
      return;
    }

    if (normalizedCode.length !== 6) {
      setLocalError("El código debe tener 6 caracteres.");
      return;
    }

    try {
      setLocalError("");
      await onJoin(normalizedCode);
      setCodigo("");
    } catch (error) {
      if (error instanceof Error) {
        setLocalError(error.message);
      } else {
        setLocalError("No se pudo unir al show.");
      }
    }
  }

  function handleClose() {
    if (joining) return;

    setCodigo("");
    setLocalError("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Unirse a show</Text>

          <TextInput
            value={codigo}
            onChangeText={(value) => setCodigo(normalizeCodeInput(value))}
            placeholder="Código de instrumento"
            style={styles.input}
            editable={!joining}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            returnKeyType="done"
            onSubmitEditing={handleJoin}
          />

          {localError ? (
            <Text style={styles.errorText}>{localError}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={styles.secondaryButton}
              disabled={joining}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleJoin}
              style={styles.primaryButton}
              disabled={joining}
            >
              {joining ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.primaryButtonText}>Unirme</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
