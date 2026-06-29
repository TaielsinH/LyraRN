import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#0F172A",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  hamburgerButton: {
    padding: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  listContent: {
    gap: 16,
    paddingBottom: 120,
  },
  loadingIndicator: {
    marginTop: 32,
  },
  emptyText: {
    color: "#CBD5E1",
    marginTop: 24,
    textAlign: "center",
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 12,
  },
  floatingButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 34,
  },
});
