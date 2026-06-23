import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./SearchBar.styles";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = "Buscar..." }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} style={styles.clearButton} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#9ca3af" />
        </Pressable>
      )}
    </View>
  );
}
