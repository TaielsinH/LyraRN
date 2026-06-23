import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    Animated,
    Pressable,
    Text,
    View,
} from "react-native";
import { styles } from "./SetlistFloatingActionMenu.styles";

type SetlistFloatingActionMenuProps = {
  onCreatePress?: () => void;
  onCodePress?: () => void;
};

export function SetlistFloatingActionMenu({
  onCreatePress,
  onCodePress,
}: SetlistFloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  function toggleMenu() {
    const nextValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue: nextValue,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();

    setIsOpen(!isOpen);
  }

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const createButtonStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -88],
        }),
      },
    ],
  };

  const codeButtonStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -176],
        }),
      },
    ],
  };

  function handleCreatePress() {
    toggleMenu();
    onCreatePress?.();
  }

  function handleCodePress() {
    toggleMenu();
    onCodePress?.();
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.actionContainer, codeButtonStyle]}>
        <Pressable style={[styles.smallButton, styles.codeButton]} onPress={handleCodePress}>
          <Ionicons name="key-outline" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.label}>Código</Text>
      </Animated.View>

      <Animated.View style={[styles.actionContainer, createButtonStyle]}>
        <Pressable style={[styles.smallButton, styles.createButton]} onPress={handleCreatePress}>
          <Ionicons name="add-circle-outline" size={26} color="#ffffff" />
        </Pressable>
        <Text style={styles.label}>Crear</Text>
      </Animated.View>

      <Pressable style={styles.mainButton} onPress={toggleMenu}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="add" size={34} color="#ffffff" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

