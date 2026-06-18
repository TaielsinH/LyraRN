import { Text, View } from "react-native";
import { styles } from "./ShowsScreen.styles";

export default function ShowsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shows</Text>
      <Text style={styles.subtitle}>Acá después listamos los shows.</Text>
    </View>
  );
}

