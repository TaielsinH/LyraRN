import { Stack } from "expo-router";

import InstrumentSetlistScreen from "../../../../../../src/features/shows/screens/InstrumentSetlistScreen";

export default function InstrumentSetlistRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Instrumento",
        }}
      />

      <InstrumentSetlistScreen />
    </>
  );
}