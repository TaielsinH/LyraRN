// src/features/shows/screens/ShowMasterScreen.styles.ts

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
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
  section: {
    marginTop: 36,
  },
  sectionLabel: {
    color: "#94a3b8",
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 8,
  },
  error: {
    color: "#f87171",
    fontSize: 16,
  },
});