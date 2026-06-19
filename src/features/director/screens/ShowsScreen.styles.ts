import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backText: {
    color: "#5b3f96",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#666666",
  },
  listContent: {
    gap: 12,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardSubtitle: {
    marginTop: 6,
    color: "#555555",
  },
  cardMeta: {
    marginTop: 8,
    color: "#777777",
    fontSize: 13,
  },
  emptyText: {
    marginTop: 24,
    color: "#666666",
    textAlign: "center",
  },
  errorText: {
    color: "#b00020",
    marginTop: 12,
  },
});