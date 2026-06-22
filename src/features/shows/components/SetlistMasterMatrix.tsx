import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type DragEndParams,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import type { Instrumento, SetlistMasterItem } from "../types";

type Props = {
  items: SetlistMasterItem[];
  instrumentos: Instrumento[];
  onAddObra: (nombre: string) => Promise<void>;
  onReorderItems: (items: SetlistMasterItem[]) => Promise<void>;
};

const ROW_HEIGHT = 48;
const OBRA_WIDTH = 220;
const CELL_WIDTH = 92;

export function SetlistMasterMatrix({ items, instrumentos, onAddObra, onReorderItems }: Props) {
    const [obra, setObra] = useState("");
    const [saving, setSaving] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);
    const [orderedItems, setOrderedItems] = useState(items);

    useEffect(() => {
        setOrderedItems(items);
    }, [items]);

    async function submitObra(){
         if (!obra.trim() || saving) return;

        try {
            setSaving(true);
            await onAddObra(obra);
            setObra("");
        } finally {
            setSaving(false);
        }
    }
    function hasPdf(instrumento: Instrumento, item: SetlistMasterItem) {
        return Boolean(instrumento.pdfsPorSetlistItem?.[item.id]);
    }

    const handleDragEnd = useCallback(
        async ({ data, from, to }: DragEndParams<SetlistMasterItem>) => {
            if (from === to) return;

            const previousItems = orderedItems;

            setOrderedItems(data);
            setSavingOrder(true);

            try {
                await onReorderItems(data);
            } catch (error) {
                console.log("Error actualizando orden del setlist master:", error);
                setOrderedItems(previousItems);
                Alert.alert(
                    "No se pudo guardar",
                    "El orden del setlist master no se actualizó. Probá de nuevo."
                );
            } finally {
                setSavingOrder(false);
            }
        },
        [onReorderItems, orderedItems]
    );

    const renderObra = useCallback(
        ({ item, drag, getIndex, isActive }: RenderItemParams<SetlistMasterItem>) => {
            const index = getIndex() ?? orderedItems.findIndex((obraItem) => obraItem.id === item.id);

            return (
                <ScaleDecorator>
                    <View style={[styles.obraRow, isActive && styles.obraRowActive]}>
                        <Pressable
                            accessibilityLabel={`Mover ${item.nombre}`}
                            accessibilityRole="button"
                            delayLongPress={120}
                            disabled={savingOrder || isActive}
                            hitSlop={8}
                            onLongPress={drag}
                            style={({ pressed }) => [
                                styles.dragHandle,
                                pressed && !savingOrder ? styles.dragHandlePressed : null,
                            ]}
                        >
                            <Text style={styles.drag}>⋮⋮</Text>
                        </Pressable>
                        <Text style={styles.order}>{index + 1}-</Text>
                        <Text style={styles.obraText} numberOfLines={1}>
                            {item.nombre}
                        </Text>
                    </View>
                </ScaleDecorator>
            );
        },
        [orderedItems, savingOrder]
    );

    return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>SETLIST MASTER</Text>

      <View style={styles.matrix}>
        <View style={styles.obraColumn}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Obra</Text>
          </View>

          <DraggableFlatList
            data={orderedItems}
            extraData={savingOrder}
            keyExtractor={(item) => item.id}
            onDragEnd={handleDragEnd}
            renderItem={renderObra}
            scrollEnabled={false}
            containerStyle={styles.obrasList}
          />

          <TextInput
            value={obra}
            onChangeText={setObra}
            placeholder="Escribir obra..."
            placeholderTextColor="#8f9bb3"
            style={styles.addInput}
            returnKeyType="done"
            onSubmitEditing={submitObra}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.instrumentHeaderRow}>
              {instrumentos.map((instrumento) => (
                <View key={instrumento.id} style={styles.instrumentHeaderCell}>
                  <Text style={styles.headerText} numberOfLines={1}>
                    {instrumento.nombre}
                  </Text>
                </View>
              ))}
            </View>

            {orderedItems.map((item) => (
              <View key={item.id} style={styles.cellsRow}>
                {instrumentos.map((instrumento) => {
                  const loaded = hasPdf(instrumento, item);

                  return (
                    <View key={`${item.id}-${instrumento.id}`} style={styles.statusCell}>
                      <Text style={[styles.statusText, loaded ? styles.ok : styles.missing]}>
                        {loaded ? "✓" : "✕"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  sectionLabel: {
    color: "#94a3b8",
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 18,
  },
  matrix: {
    flexDirection: "row",
  },
  obraColumn: {
    width: OBRA_WIDTH,
  },
  obrasList: {
    flexGrow: 0,
  },
  headerCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
  },
  headerText: {
    color: "#f8fafc",
    fontSize: 15,
  },
  obraRow: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  obraRowActive: {
    backgroundColor: "#1e293b",
  },
  dragHandle: {
    height: ROW_HEIGHT,
    width: 22,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dragHandlePressed: {
    opacity: 0.7,
  },
  drag: {
    color: "#94a3b8",
    fontSize: 16,
  },
  order: {
    width: 32,
    color: "#f8fafc",
    fontSize: 18,
  },
  obraText: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 18,
  },
  addInput: {
    height: ROW_HEIGHT,
    color: "#f8fafc",
    fontSize: 17,
    paddingLeft: 54,
  },
  instrumentHeaderRow: {
    height: ROW_HEIGHT,
    flexDirection: "row",
  },
  instrumentHeaderCell: {
    width: CELL_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  cellsRow: {
    height: ROW_HEIGHT,
    flexDirection: "row",
  },
  statusCell: {
    width: CELL_WIDTH,
    height: ROW_HEIGHT,
    backgroundColor: "#1f2a3d",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 30,
    fontWeight: "700",
  },
  ok: {
    color: "#22c55e",
  },
  missing: {
    color: "#ef4444",
  },
});
