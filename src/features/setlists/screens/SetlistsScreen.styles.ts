import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#6b7280",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  hamburgerButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  error: {
    color: "#dc2626",
    marginBottom: 12,
  },
  empty: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 24,
  },
});
