import MapView, { Marker } from "react-native-maps";
import { View } from "react-native";
import { styles } from "./LocationMap.styles";

type LocationMapProps = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

export function LocationMap({ coordinate }: LocationMapProps) {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={coordinate} title="Lugar del show" />
      </MapView>
    </View>
  );
}
