import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../../../features/auth/context/AuthContext";


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>  
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="setlists/create"
            options={{
              title: "New Setlist",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="setlists/[id]"
            options={{
              title: "Setlist",
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
           <Stack.Screen
              name="show-setlist-reader"
              options={{
                title: "Setlist",
              }}
            />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView> 
  );
}
