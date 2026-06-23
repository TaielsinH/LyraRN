import { Stack } from "expo-router";

import ShowsScreen from "../../../../src/features/director/screens/ShowsScreen";

export default function ShowsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Show",
        }}
      />

      <ShowsScreen showHamburger={false} />
    </>
  );
}