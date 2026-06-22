import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#5b3f96",
    backgroundColor: "#f5f3fb",
  },
  checkbox: {
    position: "absolute",
    top: 12,
    right: 12,
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
