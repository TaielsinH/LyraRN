import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function crearCanalNotificacionesAndroid(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Notificaciones",
    importance: Notifications.AndroidImportance.DEFAULT,
    description: "Notificaciones de la aplicación",
  });
}

export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn("Las notificaciones push requieren un dispositivo físico.");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function obtenerTokenFcmNativo(): Promise<string | null> {
  try {
    const tokenResponse = await Notifications.getDevicePushTokenAsync();

    if (tokenResponse.type !== "android") {
      console.warn(
        `Tipo de token inesperado: ${tokenResponse.type}. Se esperaba 'android'.`
      );
    }

    return tokenResponse.data;
  } catch (error) {
    console.warn("No se pudo obtener el token FCM nativo:", error);
    return null;
  }
}

export async function registrarParaNotificacionesPush(): Promise<string | null> {
  await crearCanalNotificacionesAndroid();

  const permisoOtorgado = await pedirPermisoNotificaciones();
  if (!permisoOtorgado) {
    console.warn("El usuario no otorgó permiso de notificaciones.");
    return null;
  }

  return obtenerTokenFcmNativo();
}
