import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 26,
  },
  backText: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "800",
  },
  date: {
    color: "#94a3b8",
    fontSize: 20,
    marginTop: 6,
  },
  instrumentName: {
    color: "#cbd5e1",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },
  codeBox: {
    marginTop: 30,
    backgroundColor: "#1f2a3d",
    minHeight: 74,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeText: {
    color: "#f8fafc",
    fontSize: 22,
  },
  copyButton: {
    backgroundColor: "#c4b5fd",
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  copyButtonText: {
    color: "#312e81",
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    alignSelf: "flex-start",
    backgroundColor: "#c4b5fd",
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: "#1e293b",
  },
  saveButtonText: {
    color: "#312e81",
    fontSize: 16,
    fontWeight: "700",
  },
  saveButtonTextDisabled: {
    color: "#475569",
  },
  listContent: {
    paddingTop: 34,
    paddingBottom: 40,
  },
  row: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
  },
  activeRow: {
    opacity: 0.85,
    transform: [{ scale: 1.01 }],
  },
  order: {
    width: 42,
    color: "#f8fafc",
    fontSize: 24,
  },
  songName: {
    width: 210,
    color: "#f8fafc",
    fontSize: 24,
  },
  dragHandle: {
    width: 36,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  dragText: {
    color: "#94a3b8",
    fontSize: 18,
  },
  pdfCell: {
    width: 280,
    height: 58,
    backgroundColor: "#1f2a3d",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  pdfText: {
    color: "#f8fafc",
    fontSize: 22,
  },
  emptyPdfText: {
    color: "#94a3b8",
  },
  deleteCell: {
    width: 54,
    height: 58,
    backgroundColor: "#1f2a3d",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteMark: {
    color: "#ef4444",
    fontSize: 28,
  },
  error: {
    color: "#f87171",
    fontSize: 16,
  },
  cloudModalScreen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  cloudModalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  cloudModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  cloudModalTitle: {
    color: "#f8fafc",
    fontSize: 26,
    fontWeight: "800",
  },
  cloudModalSubtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 6,
  },
  cloudCloseButton: {
    backgroundColor: "#1e293b",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cloudCloseButtonText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
  },
  cloudSearchInput: {
    height: 48,
    color: "#f8fafc",
    backgroundColor: "#1f2a3d",
    borderRadius: 10,
    fontSize: 16,
    marginTop: 24,
    paddingHorizontal: 14,
  },
  cloudListContent: {
    paddingTop: 18,
    paddingBottom: 40,
    flexGrow: 1,
  },
  cloudPdfItem: {
    backgroundColor: "#1f2a3d",
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cloudPdfName: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "700",
  },
  cloudPdfMeta: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 6,
  },
  cloudState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  cloudStateText: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  cloudRetryButton: {
    backgroundColor: "#c4b5fd",
    borderRadius: 999,
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  cloudRetryButtonText: {
    color: "#312e81",
    fontSize: 15,
    fontWeight: "700",
  },
});
