import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 28,
    bottom: 100,
    alignItems: "center",
  },
  actionContainer: {
    position: "absolute",
    alignItems: "center",
  },
  smallButton: {
    width: 68,
    height: 68,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  codeButton: {
    backgroundColor: "#4caf50",
  },
  createButton: {
    backgroundColor: "#2563eb",
  },
  mainButton: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#5b3f96",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  label: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
});
