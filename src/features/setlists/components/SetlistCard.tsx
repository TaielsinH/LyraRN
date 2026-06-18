import { Pressable, Text } from "react-native";
import type { Setlist } from "../types";
import { styles } from "./SetlistCard.styles";

type SetlistCardProps = {
  setlist: Setlist;
  onPress?: () => void;
};

export function SetlistCard({ setlist, onPress }: SetlistCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{setlist.titulo}</Text>

      {setlist.nombreGrupo ? (
        <Text style={styles.subtitle}>{setlist.nombreGrupo}</Text>
      ) : null}

      <Text style={styles.meta}>
        {setlist.partituras.length ?? 0} partituras
      </Text>
    </Pressable>
  );
}

