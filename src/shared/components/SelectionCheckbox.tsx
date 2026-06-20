import { Ionicons } from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

type SelectionCheckboxProps = {
  selected: boolean;
  style?: StyleProp<TextStyle>;
};

export function SelectionCheckbox({ selected, style }: SelectionCheckboxProps) {
  return (
    <Ionicons
      name={selected ? "checkmark-circle" : "ellipse-outline"}
      size={24}
      color={selected ? "#5b3f96" : "#c0c0c0"}
      style={style}
    />
  );
}
