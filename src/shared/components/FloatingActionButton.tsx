import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { styles } from "./FloatingActionButton.styles";

type FloatingActionButtonProps = {
  onPress: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable style={styles.mainButton} onPress={onPress}>
        <Ionicons name="add" size={34} color="#ffffff" />
      </Pressable>
    </View>
  );
}