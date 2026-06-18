import { Text, View } from "react-native";
import { styles } from "./DirectorScreen.styles";

export default function DirectorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Director</Text>
      <Text style={styles.subtitle}>Panel del director.</Text>
    </View>
  );
}

