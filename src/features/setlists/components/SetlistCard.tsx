import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { SelectionCheckbox } from "../../../shared/components/SelectionCheckbox";
import type { Setlist } from "../types";
import { styles } from "./SetlistCard.styles";

type SetlistCardProps = {
  setlist: Setlist;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  selectionMode?: boolean;
};

export function SetlistCard({
  setlist,
  onPress,
  onLongPress,
  selected = false,
  selectionMode = false,
}: SetlistCardProps) {
  const scoreCount = setlist.partituras?.length ?? 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="playlist-music"
          size={28}
          color="#111827"
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {setlist.titulo}
        </Text>

        <Text numberOfLines={1} style={styles.subtitle}>
          {setlist.nombreGrupo || "Sin grupo"} - {scoreCount}{" "}
          {scoreCount === 1 ? "score" : "scores"}
        </Text>
      </View>

      {selectionMode ? (
        <SelectionCheckbox selected={selected} style={styles.checkbox} />
      ) : (
        <View style={styles.rightDot} />
      )}
    </Pressable>
  );
}