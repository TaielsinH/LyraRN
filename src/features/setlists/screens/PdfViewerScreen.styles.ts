import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    padding: 12,
  },
  webview: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    zIndex: 1,
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#ffffff",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  error: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
