import { Stack } from "expo-router";

import ShowMasterScreen from "../../../../../src/features/shows/screens/ShowMasterScreen";

export default function ShowMasterRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Show",
        }}
      />

      <ShowMasterScreen />
    </>
  );
}