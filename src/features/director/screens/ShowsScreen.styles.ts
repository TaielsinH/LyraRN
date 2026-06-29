import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  hamburgerButton: {
    padding: 4,
  },
  backText: {
    color: "#93C5FD",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#CBD5E1",
  },
  listContent: {
    gap: 12,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardSelected: {
    borderColor: "#60A5FA",
    backgroundColor: "#172554",
  },
  checkbox: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  cardSubtitle: {
    marginTop: 6,
    color: "#CBD5E1",
  },
  cardMeta: {
    marginTop: 8,
    color: "#94A3B8",
    fontSize: 13,
  },
  emptyText: {
    marginTop: 24,
    color: "#CBD5E1",
    textAlign: "center",
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 12,
  },
});
