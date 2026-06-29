import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../features/auth/context/AuthContext";
import { logout } from "../../features/auth/services/authService";
import { useAgrupaciones } from "../../features/director/hooks/useAgrupaciones";
import { styles } from "./HamburgerMenu.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const ANIMATION_DURATION = 240;

const AGRUPACION_COLORS = [
  "#4CAF50",
  "#9C27B0",
  "#2196F3",
  "#FF9800",
  "#E91E63",
  "#00BCD4",
  "#FF5722",
  "#607D8B",
];

export function HamburgerMenu({ visible, onClose }: Props) {
  const { user } = useAuth();
  const { agrupaciones } = useAgrupaciones(user?.uid);

  const [isModalRendered, setIsModalRendered] = useState(false);
  const translateX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsModalRendered(true);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SCREEN_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalRendered(false);
      });
    }
  }, [backdropOpacity, translateX, visible]);

  async function handleLogout() {
    onClose();
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.log("Error cerrando sesion:", error);
    }
  }

  function handleShowsPress() {
    onClose();
    router.push("/(tabs)/shows");
  }

  function handleSetlistsPress() {
    onClose();
    router.push("/");
  }

  function handleAgrupacionPress(agrupacionId: string, nombre: string) {
    onClose();
    router.push({
      pathname: "/agrupaciones/[agrupacionId]/shows",
      params: { agrupacionId, nombre },
    });
  }

  return (
    <Modal
      visible={isModalRendered}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay} pointerEvents={visible ? "auto" : "none"}>
        {/* bd */}
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents={visible ? "auto" : "none"}
        >
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        {/* dw */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            
            <Text style={styles.sectionLabel}>SHOWS</Text>
            <View style={styles.sectionDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleShowsPress}
              activeOpacity={0.6}
            >
              <Ionicons name="calendar-outline" size={19} color="#94A3B8" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Shows</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSetlistsPress}
              activeOpacity={0.6}
            >
              <Ionicons name="musical-notes-outline" size={19} color="#94A3B8" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Mis Setlists</Text>
            </TouchableOpacity>

            {/* DIRECTOR */}
            {agrupaciones.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                  DIRECTOR
                </Text>
                <View style={styles.sectionDivider} />

                {agrupaciones.map((agrupacion, index) => {
                  const color = AGRUPACION_COLORS[index % AGRUPACION_COLORS.length];
                  return (
                    <TouchableOpacity
                      key={agrupacion.id}
                      style={styles.menuItem}
                      onPress={() => handleAgrupacionPress(agrupacion.id, agrupacion.nombre)}
                      activeOpacity={0.6}
                    >
                      <View style={[styles.agrupacionDot, { backgroundColor: color }]} />
                      <Text style={styles.menuItemText}>{agrupacion.nombre}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </ScrollView>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
