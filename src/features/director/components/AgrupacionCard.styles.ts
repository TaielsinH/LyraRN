import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#003D35",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#60A5FA",
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.52)",
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(37, 99, 235, 0.38)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  contentWithCheckbox: {
    paddingRight: 58,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  showCount: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  checkbox: {
    position: "absolute",
    top: 14,
    right: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
});
