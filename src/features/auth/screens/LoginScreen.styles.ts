import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    padding: 24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#0F172A",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: "#CBD5E1",
    marginTop: 12,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 8,
    elevation: 3,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 16,
    marginBottom: 28,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0F172A",
    borderColor: "#334155",
    borderRadius: 8,
    borderWidth: 1,
    color: "#FFFFFF",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  error: {
    color: "#FCA5A5",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
