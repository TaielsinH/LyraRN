import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28,
  },
  section: {
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#1e293b",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineButtonFull: {
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  outlineButtonDisabled: {
    opacity: 0.6,
  },
  outlineButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  helperText: {
    color: "#9ca3af",
    fontSize: 15,
  },
  locationSuccessText: {
    color: "#4ade80",
    fontSize: 15,
    fontWeight: "600",
  },
  pdfItem: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pdfInfo: {
    flex: 1,
    paddingRight: 12,
  },
  pdfName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  pdfMeta: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 4,
  },
  removeText: {
    color: "#f87171",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    paddingVertical: 18,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontWeight: "700",
  },
});
