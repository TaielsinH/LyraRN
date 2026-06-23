import { Dimensions, StyleSheet } from "react-native";

const DRAWER_WIDTH = 280;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  backdropPressable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#ffffff",
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
    color: "#9ca3af",
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
    backgroundColor: "#e5e7eb",
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
    color: "#1f2937",
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
    borderTopColor: "#e5e7eb",
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "500",
  },
});
