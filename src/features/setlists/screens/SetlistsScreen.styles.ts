import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F172A",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
    gap: 8,
  },
  loadingText: {
    color: "#CBD5E1",
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
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  error: {
    color: "#FCA5A5",
    marginBottom: 12,
  },
  empty: {
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 40,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
