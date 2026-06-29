import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

import { styles } from "./TabsLayout.styles";

type TabIconName = keyof typeof Ionicons.glyphMap;

function TabBarIcon({
  color,
  focused,
  name,
}: {
  color: string;
  focused: boolean;
  name: TabIconName;
}) {
  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#C7C4CC",
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Setlists",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name="musical-notes-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="director"
        options={{
          title: "Director",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="person-outline" />
          ),
        }}
      />

      <Tabs.Screen
        name="shows"
        options={{
          title: "Shows",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              name="calendar-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}
