import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  backdropPressable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "78%",
    maxWidth: 320,
    backgroundColor: "#1E293B",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
    flexDirection: "column",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 4,
    marginTop: 4,
  },
  sectionLabelSpaced: {
    marginTop: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginTop: 8,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemIcon: {
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "400",
  },
  agrupacionDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 14,
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: "500",
  },
});
