import { router, useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../auth/context/AuthContext";
import { InstrumentStories } from "../components/InstrumentStories";
import { SetlistMasterMatrix } from "../components/SetlistMasterMatrix";
import { useShowMaster } from "../hooks/useShowMaster";
import type { Instrumento } from "../types";
import { styles } from "./ShowMasterScreen.styles";

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

export default function ShowMasterScreen() {
    const { user } = useAuth();
    const params = useLocalSearchParams<{
        agrupacionId?: string;
        showId?: string;
    }>();

    const agrupacionId = getParam(params.agrupacionId);
    const showId = getParam(params.showId);

    const {
        show,
        instrumentos,
        loading,
        errorMessage,
        addInstrumento,
        addObra,
        reorderObras,
    } = useShowMaster(agrupacionId, showId, user?.uid ?? "");

    if (loading) {
        return (
            <SafeAreaView style={styles.screen}>
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    if (errorMessage) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.error}>{errorMessage}</Text>
            </SafeAreaView>
        )
    }

    if (!show) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.error}>Show not found</Text>
            </SafeAreaView>
        );
    }
    function handleInstrumentPress(instrumento: Instrumento) {
        router.push({
            pathname:
            "/agrupaciones/[agrupacionId]/shows/[showId]/instrumentos/[instrumentoId]",
            params: {
            agrupacionId,
            showId,
            instrumentoId: instrumento.id,
            },
        });
    }

    return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Shows</Text>
        </Pressable>

        <Text style={styles.title}>{show.nombre}</Text>

        {!!show.fecha && <Text style={styles.date}>{show.fecha}</Text>}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INSTRUMENTOS</Text>

          <InstrumentStories
            instrumentos={instrumentos}
            onAddInstrumento={addInstrumento}
            onInstrumentPress={handleInstrumentPress}
          />
        </View>

        <SetlistMasterMatrix
          items={show.setlistMaster}
          instrumentos={instrumentos}
          onAddObra={addObra}
          onReorderItems={reorderObras}
        />
      </ScrollView>
    </SafeAreaView>
  );

}
