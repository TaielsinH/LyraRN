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
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0,
  },
  cardSelected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#625B71",
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    backgroundColor: "#F1F5F9",
  },
  cardContent: {
    flex: 1,
    paddingRight: 16,
  },
  checkbox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  cardTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
  },
  cardSubtitle: {
    marginTop: 3,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
  cardActionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
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
