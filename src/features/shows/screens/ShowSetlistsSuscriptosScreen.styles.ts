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

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1B20",
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 16,
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

  listContent: {
    paddingBottom: 24,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7E0EC",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EADDFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4F378B",
  },

  titleContainer: {
    flex: 1,
  },

  showName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1D1B20",
  },

  instrumentName: {
    marginTop: 2,
    fontSize: 14,
    color: "#625B71",
  },

  infoRow: {
    marginTop: 14,
  },

  infoText: {
    fontSize: 13,
    color: "#625B71",
  },

  codeText: {
    marginTop: 10,
    fontSize: 12,
    color: "#79747E",
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