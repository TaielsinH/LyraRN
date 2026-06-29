import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { styles } from "./SelectionActionBar.styles";

type SelectionActionBarProps = {
  selectedCount: number;
  onCancel: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  deleting?: boolean;
};

export function SelectionActionBar({
  selectedCount,
  onCancel,
  onEdit,
  onDelete,
  deleting = false,
}: SelectionActionBarProps) {
  const canEdit = selectedCount === 1 && !deleting;
  const canDelete = selectedCount > 0 && !deleting;

  return (
    <View style={styles.container}>
      <Pressable onPress={onCancel} style={styles.cancelButton} hitSlop={8}>
        <Ionicons name="close" size={24} color="#E5E7EB" />
      </Pressable>

      <Text style={styles.countText}>
        {selectedCount} seleccionado{selectedCount === 1 ? "" : "s"}
      </Text>

      <View style={styles.actions}>
        {onEdit ? (
          <Pressable
            onPress={onEdit}
            disabled={!canEdit}
            style={[styles.actionButton, !canEdit && styles.actionButtonDisabled]}
            hitSlop={8}
          >
            <Ionicons name="pencil" size={20} color={canEdit ? "#E5E7EB" : "#64748B"} />
          </Pressable>
        ) : null}

        <Pressable
          onPress={onDelete}
          disabled={!canDelete}
          style={[styles.actionButton, !canDelete && styles.actionButtonDisabled]}
          hitSlop={8}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#E5E7EB" />
          ) : (
            <Ionicons name="trash" size={20} color={canDelete ? "#E5E7EB" : "#64748B"} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
