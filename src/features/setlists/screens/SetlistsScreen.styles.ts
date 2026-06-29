import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F172A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  loadingIndicatorShell: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  loadingTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 6,
    color: "#CBD5E1",
    textAlign: "center",
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
