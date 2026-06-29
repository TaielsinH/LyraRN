import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    height: 92,
    paddingTop: 9,
    paddingBottom: 14,
    backgroundColor: "#1D1B20",
    borderTopColor: "#27242C",
    borderTopWidth: 1,
    elevation: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  tabBarItem: {
    justifyContent: "center",
    paddingVertical: 3,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  iconPill: {
    minWidth: 64,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: "#625B71",
  },
});
