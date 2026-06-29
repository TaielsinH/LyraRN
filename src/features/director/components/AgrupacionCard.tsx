import { ImageBackground, Pressable, Text, View } from "react-native";

import { SelectionCheckbox } from "../../../shared/components/SelectionCheckbox";
import { styles } from "./AgrupacionCard.styles";

const CARD_BACKGROUND = require("../../../../assets/images/bg_agrupacion_card.png");

type AgrupacionCardProps = {
  nombre: string;
  showCount: number;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function formatShowCount(showCount: number) {
  return `${showCount} show${showCount === 1 ? "" : "s"}`;
}

export function AgrupacionCard({
  nombre,
  showCount,
  selected,
  selectionMode,
  onPress,
  onLongPress,
}: AgrupacionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <ImageBackground
        source={CARD_BACKGROUND}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.scrim} />
        {selected ? <View style={styles.selectionOverlay} /> : null}

        <View style={[styles.content, selectionMode && styles.contentWithCheckbox]}>
          <Text style={styles.title} numberOfLines={2}>
            {nombre}
          </Text>

          <Text style={styles.showCount}>{formatShowCount(showCount)}</Text>
        </View>

        {selectionMode ? (
          <SelectionCheckbox selected={selected} style={styles.checkbox} />
        ) : null}
      </ImageBackground>
    </Pressable>
  );
}
