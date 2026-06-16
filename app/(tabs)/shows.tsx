import { StyleSheet, Text, View } from "react-native";

export default function ShowsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shows</Text>
      <Text style={styles.subtitle}>Acá después listamos los shows.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
});