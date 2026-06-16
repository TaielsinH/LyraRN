import { Pressable, StyleSheet, Text } from "react-native";
import { Setlist } from "./types";

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
});