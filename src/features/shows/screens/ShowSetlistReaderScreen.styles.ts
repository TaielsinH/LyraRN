import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: "#625B71",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1D1B20",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#625B71",
  },

  errorText: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FCEEEE",
    color: "#B3261E",
    fontSize: 14,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E0EC",
  },

  tableHeaderOrder: {
    width: 36,
    fontSize: 12,
    fontWeight: "700",
    color: "#625B71",
  },

  tableHeaderSong: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#625B71",
  },

  tableHeaderStatus: {
    width: 76,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    color: "#625B71",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E7E0EC",
  },

  orderContainer: {
    width: 36,
  },

  orderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#625B71",
  },

  songContainer: {
    flex: 1,
    paddingRight: 12,
  },

  songName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1B20",
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
    color: "#1D1B20",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#625B71",
    textAlign: "center",
  },
});