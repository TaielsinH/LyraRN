import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Instrumento } from "../types";

type Props = {
  instrumentos: Instrumento[];
  onAddInstrumento: (nombre: string) => Promise<void>;
  onInstrumentPress?: (instrumento: Instrumento) => void;
};

export function InstrumentStories({ instrumentos, onAddInstrumento, onInstrumentPress }: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [saving, setSaving] = useState(false);

    async function submit(){
        if (!nombre.trim() || saving) return;

        try {
            setSaving(true);
            await onAddInstrumento(nombre);
            setNombre("");
            setModalVisible(false);
        } finally {
            setSaving(false);
        }
    }
    return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Pressable style={[styles.circle, styles.addCircle]} onPress={() => setModalVisible(true)}>
          <Text style={styles.plus}>+</Text>
        </Pressable>

        {instrumentos.map((instrumento) => (
          <Pressable key={instrumento.id} onPress={() => onInstrumentPress?.(instrumento)}
            style={styles.circle}>
              <Text style={styles.instrumentName} numberOfLines={1}>
                {instrumento.nombre}
              </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo instrumento</Text>

            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: flauta, saxo alto, violín"
              placeholderTextColor="#8f9bb3"
              style={styles.input}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submit}
            />

            <View style={styles.actions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Cancelar</Text>
              </Pressable>

              <Pressable onPress={submit} style={styles.primaryButton}>
                <Text style={styles.primaryText}>{saving ? "Guardando..." : "Crear"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
    );
}
const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  circle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#1f2a3d",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  addCircle: {
    backgroundColor: "#334155",
    borderColor: "#64748b",
  },
  plus: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "700",
  },
  instrumentName: {
    color: "#f8fafc",
    fontSize: 15,
    textAlign: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 18,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryText: {
    color: "#cbd5e1",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#c4b5fd",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primaryText: {
    color: "#1e1b4b",
    fontWeight: "700",
    fontSize: 15,
  },
});