import { Pressable, Text } from "react-native";
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
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.title}>{setlist.titulo}</Text>

      {setlist.nombreGrupo ? (
        <Text style={styles.subtitle}>{setlist.nombreGrupo}</Text>
      ) : null}

      <Text style={styles.meta}>
        {setlist.partituras.length ?? 0} partituras
      </Text>

      {selectionMode ? (
        <SelectionCheckbox selected={selected} style={styles.checkbox} />
      ) : null}
    </Pressable>
  );
}
