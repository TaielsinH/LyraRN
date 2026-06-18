import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 24,
  },
  loadingText: {
    color: "#9ca3af",
  },
  error: {
    color: "#f87171",
    fontSize: 16,
  },
  partituraItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  partituraTitle: {
    color: "#ffffff",
    fontSize: 18,
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 40,
  },
});
