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
  mapContainer: {
    width: "100%",
    height: 180, 
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  map: {
    width: "100%",
    height: "100%",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "#0b121f",
    padding: 24,
    justifyContent: 'space-between',
  },
  modalHeader: {
    marginTop: 40,
    paddingHorizontal: 4,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: "#7e8a9c",
    fontSize: 16,
    marginTop: 6,
  },
  modalQueueText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },
  modalImageArea: {
    flex: 1,
    marginVertical: 16,
  },
  modalScrollView: {
    flex: 1,
    width: '100%',
  },
  modalScrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
  modalImageWrapper: {
    width: '100%',
    height: 260,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#131c2e',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  emptyFlex: {
    flex: 1,
  },
  modalFooter: {
    marginBottom: 16,
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  captureButton: {
    backgroundColor: "#f9570c",
    borderRadius: 28,
    paddingVertical: 10,
    width: '92%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: "#10b981",
    borderRadius: 28,
    paddingVertical: 10,
    width: '92%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});