const NOTIFICATION_URL = "https://messaging-service-lfyh.onrender.com/send-notification"; //url del servicio de notificaciones

export async function enviarNotificacion(
  token: string,
  title: string,
  body: string
): Promise<void> {
  const response = await fetch(NOTIFICATION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, title, body }),
  });

  if (!response.ok) {
    throw new Error(`Error al enviar notificación: ${response.status}`);
  }
}

export async function notificarNuevoMusicoEnSetlist(
  tokenDirector: string,
  nombreSetlist: string
): Promise<void> {
  await enviarNotificacion(
    tokenDirector,
    "¡Nuevo músico en tu setlist!",
    `Un compañero se unió a: ${nombreSetlist}`
  );
}
