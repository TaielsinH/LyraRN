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

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 4,
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

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },

  tableHeaderOrder: {
    width: 36,
    fontSize: 12,
    fontWeight: "700",
    color: "#CBD5E1",
  },

  tableHeaderSong: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#CBD5E1",
  },

  tableHeaderStatus: {
    width: 76,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    color: "#CBD5E1",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },

  orderContainer: {
    width: 36,
  },

  orderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#CBD5E1",
  },

  songContainer: {
    flex: 1,
    paddingRight: 12,
  },

  songName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  pdfBadge: {
    minWidth: 64,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#DFF5E1",
    alignItems: "center",
  },

  pdfBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#137333",
  },

  tacetBadge: {
    minWidth: 64,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E8EAED",
    alignItems: "center",
  },

  tacetBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6F6A75",
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
