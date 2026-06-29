import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: "#CBD5E1",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: "#CBD5E1",
  },

  errorText: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#451A1A",
    color: "#FCA5A5",
    fontSize: 14,
  },

  listContent: {
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  titleContainer: {
    flex: 1,
  },

  showName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  instrumentName: {
    marginTop: 2,
    fontSize: 14,
    color: "#CBD5E1",
  },

  infoRow: {
    marginTop: 14,
  },

  infoText: {
    fontSize: 13,
    color: "#94A3B8",
  },

  codeText: {
    marginTop: 10,
    fontSize: 12,
    color: "#94A3B8",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
  },
});
