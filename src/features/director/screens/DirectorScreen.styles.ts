import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  hamburgerButton: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  listContent: {
    gap: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
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
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  emptyText: {
    color: "#666666",
    marginTop: 24,
    textAlign: "center",
  },
  errorText: {
    color: "#B00020",
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