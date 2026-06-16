import { StyleSheet, Text, View } from "react-native";

export default function DirectorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Director</Text>
      <Text style={styles.subtitle}>Panel del director.</Text>
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