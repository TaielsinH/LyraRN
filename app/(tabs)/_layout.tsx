import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />

      <Tabs.Screen
        name="setlists"
        options={{
          title: "Setlists",
        }}
      />

      <Tabs.Screen
        name="agrupaciones"
        options={{
          title: "Agrupaciones",
        }}
      />
    </Tabs>
  );
}