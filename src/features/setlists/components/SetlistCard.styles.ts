import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    minHeight: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 14,

    marginHorizontal: 28,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#6D4CC2",
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,

    backgroundColor: "#F3F6FA",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 18,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#6B7280",
  },

  rightDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F6FA",
    marginLeft: 14,
  },

  checkbox: {
    marginLeft: 14,
  },
});