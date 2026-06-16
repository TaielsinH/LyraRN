import { Stack } from "expo-router";
import { AuthProvider } from "../src/features/auth/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="setlists/[id]"
          options={{
            title: "Repertorio",
          }}
        />

        <Stack.Screen
          name="pdf-viewer"
          options={{
            title: "Partitura",
          }}
        />

        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}