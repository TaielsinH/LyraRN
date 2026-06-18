import { Text, View } from "react-native";
import { styles } from "./LocationMap.web.styles";

type LocationMapProps = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

export function LocationMap({ coordinate }: LocationMapProps) {
  return (
    <View style={styles.mapFallback}>
      <Text style={styles.mapFallbackTitle}>Ubicacion seleccionada</Text>
      <Text style={styles.mapFallbackText}>
        Latitud: {coordinate.latitude.toFixed(6)}
      </Text>
      <Text style={styles.mapFallbackText}>
        Longitud: {coordinate.longitude.toFixed(6)}
      </Text>
    </View>
  );
}
