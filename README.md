# LyraRN

App mobile hecha con React Native + Expo. Usa Expo Router para las pantallas y
Firebase para autenticacion y datos de setlists.

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- Firebase Auth
- Cloud Firestore
- React Native WebView para abrir partituras PDF

## Requisitos

Antes de clonar y correr el proyecto, instalar:

- Git
- Node.js 20.19.x o superior
- npm
- Expo Go en el celular o tablet

No hace falta instalar Expo CLI globalmente. El proyecto usa Expo desde las
dependencias locales con `npx expo` o con los scripts de `npm`.

## Instalacion desde cero

```bash
git clone <URL_DEL_REPOSITORIO>
cd LyraRN
npm ci
```

Si `npm ci` falla por alguna diferencia local de versiones, probar:

```bash
npm install
```

## Correr la app en Expo Go

```bash
npm run start
```

Despues:

1. Abrir Expo Go en el celular o tablet.
2. Escanear el QR que aparece en la terminal.
3. Esperar a que Metro compile la app.

En Windows PowerShell, si aparece un error de politica de ejecucion con `npx`,
usar los ejecutables `.cmd`:

```powershell
npm.cmd run start
```

O directamente:

```powershell
npx.cmd expo start
```

## Scripts utiles

```bash
npm run start
```

Inicia Expo/Metro y muestra el QR para Expo Go.

```bash
npm run android
```

Abre la app en Android si hay un emulador o dispositivo configurado.

```bash
npm run ios
```

Abre la app en iOS. Requiere macOS/Xcode.

```bash
npm run web
```

Corre la version web.

```bash
npm run lint
```

Ejecuta el linter de Expo.

## Configuracion de Firebase

La configuracion esta en:

```text
src/services/firebase.ts
```

Actualmente el proyecto ya trae configurado un proyecto Firebase. Para poder
loguearse, el usuario tiene que existir en Firebase Authentication con email y
contrasena.

La app usa:

- `Firebase Auth` para login/logout.
- `AsyncStorage` para persistir la sesion en React Native.
- `Firestore` para leer setlists del usuario logueado.

## Datos esperados en Firestore

La pantalla principal busca setlists en esta ruta:

```text
usuarios/{uid}/setlists/{setlistId}
```

Donde `{uid}` es el ID del usuario autenticado.

Cada setlist puede tener campos como:

```ts
{
  titulo: string;
  nombreGrupo: string;
  codigoCompartir: string;
  fechaCreacion: number | Timestamp;
  isActive: boolean;
  ubicacion: string;
  ownerId: string;
  suscriptores: string[];
  partituras: {
    nombre: string;
    publicId: string;
    url: string;
  }[];
}
```

La app filtra `isActive == true` y ordena por `fechaCreacion` descendente.

## Rutas principales

El proyecto usa Expo Router, asi que las rutas salen de la carpeta `app`.

```text
app/_layout.tsx
```

Layout raiz. Envuelve toda la app con `AuthProvider` y define el stack principal.

```text
app/login.tsx
```

Pantalla de login. Usa Firebase Auth con email y contrasena.

```text
app/(tabs)/_layout.tsx
```

Layout de tabs.

```text
app/(tabs)/index.tsx
```

Tab principal de setlists.

```text
app/(tabs)/director.tsx
```

Tab del director.

```text
app/(tabs)/shows.tsx
```

Tab de shows.

```text
app/setlists/[id].tsx
```

Detalle de un setlist y listado de partituras.

```text
app/pdf-viewer.tsx
```

Visor de PDF usando `react-native-webview` y Google Docs Viewer.

## Estructura importante

```text
app/
  _layout.tsx
  login.tsx
  pdf-viewer.tsx
  (tabs)/
  setlists/

src/
  services/
    firebase.ts
  features/
    auth/
      AuthContext.tsx
      authService.ts
    setlists/
      setlistService.ts
      types.tsx
      SetlistCard.tsx
      SetlistFloatingActionMenu.tsx
```

## Flujo actual de autenticacion

1. `AuthProvider` se monta en `app/_layout.tsx`.
2. `AuthProvider` escucha Firebase con `onAuthStateChanged`.
3. La pantalla `app/login.tsx` permite iniciar sesion con email y contrasena.
4. El login llama a `loginWithEmail(email, password)`.
5. Si Firebase autentica correctamente, se navega a `/`.
6. La pantalla de setlists carga los datos desde Firestore usando el `uid` del usuario.

Nota: en el estado actual del codigo, `app/_layout.tsx` define primero el grupo
`(tabs)`, por lo que la app puede abrir directamente en las tabs. Si se quiere
forzar login antes de entrar a la app, hay que agregar una redireccion segun el
estado de `user` en el layout correspondiente.

## Problemas comunes

### Pantalla en blanco despues de escanear el QR

Probar limpiar cache de Metro:

```bash
npm run start -- --clear
```

En PowerShell:

```powershell
npm.cmd run start -- --clear
```

Tambien revisar que la version de Expo Go sea compatible con Expo SDK 54.

### La tablet o celular no conecta al QR

Verificar que la computadora y el dispositivo esten en la misma red Wi-Fi. Si
la red bloquea conexiones locales, iniciar Expo con tunnel:

```bash
npx expo start --tunnel
```

En PowerShell:

```powershell
npx.cmd expo start --tunnel
```

### El login falla

Revisar:

- Que el email y contrasena existan en Firebase Authentication.
- Que el metodo Email/Password este habilitado en Firebase.
- Que la configuracion de `src/services/firebase.ts` apunte al proyecto correcto.

### Login correcto pero no aparecen setlists

Revisar:

- Que el usuario tenga documentos en `usuarios/{uid}/setlists`.
- Que los documentos tengan `isActive: true`.
- Que `fechaCreacion` exista para poder ordenar.
- Que las reglas de Firestore permitan leer esos documentos.

## Verificaciones antes de subir cambios

```bash
npm run lint
```

Tambien conviene correr TypeScript:

```bash
npx tsc --noEmit
```

En PowerShell:

```powershell
npx.cmd tsc --noEmit
```
