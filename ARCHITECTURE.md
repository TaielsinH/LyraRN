# Arquitectura del proyecto

Este proyecto usa una arquitectura feature-first sobre React Native con Expo Router.
La idea es separar la responsabilidad de routing de la responsabilidad de producto:
`app/` define las rutas publicas y `src/` contiene la implementacion real.

No es una Clean Architecture completa. Es una estructura simple, escalable y facil
de defender: cada feature agrupa sus pantallas, componentes, servicios, hooks y
tipos; lo compartido queda en `src/shared`; la infraestructura global queda en
`src/services`.

## Por que `app/` solo contiene rutas

Expo Router necesita la carpeta `app/` para construir la navegacion a partir del
sistema de archivos. Por eso `app/` sigue existiendo.

Los archivos de `app/` deben ser delgados: importan una pantalla o layout desde
`src/` y la exportan como default. Asi las rutas publicas no cambian, pero la
logica no queda mezclada con el router.

Ejemplo:

```tsx
import CreateSetlistScreen from "../../src/features/setlists/screens/CreateSetlistScreen";

export default CreateSetlistScreen;
```

## Que va en `features`

`src/features` contiene codigo que pertenece a una capacidad de negocio concreta.
Cada feature puede tener:

- `screens/`: pantallas completas que se renderizan desde una ruta.
- `components/`: componentes usados solo por esa feature.
- `hooks/`: hooks propios de la feature cuando la logica de pantalla crece.
- `services/`: acceso a datos o integraciones especificas de la feature.
- `context/`: providers o contexto de una feature, como autenticacion.
- `types.ts`: tipos compartidos dentro de la feature.

Ejemplos actuales:

- `auth`: login, contexto de autenticacion y servicio de auth.
- `setlists`: listado, creacion, detalle, visor de partituras, mapa y servicios de setlists.
- `director`: pantallas de director y shows.

## Que va en `shared`

`src/shared` contiene piezas reutilizables que no pertenecen a una sola feature:

- `components/`: UI reutilizable, componentes del template, navegacion compartida.
- `hooks/`: hooks genericos, como color scheme o theme color.
- `utils/`: helpers puros reutilizables.
- `constants/`: constantes sin dependencia visual fuerte.
- `theme/`: colores, fuentes y tokens visuales globales.

Una regla practica: si un archivo menciona conceptos de negocio como setlists,
partituras, usuarios o shows, normalmente no va en `shared`.

## Que va en `services`

`src/services` contiene infraestructura global compartida por varias features.
Firebase vive ahi porque no es una feature: es el cliente de infraestructura que
usan servicios de negocio como `authService` o `setlistService`.

Ejemplo actual:

```txt
src/services/firebase.ts
```

## Flujo recomendado

Cuando una pantalla necesita datos externos, el flujo recomendado es:

```txt
Screen -> Hook -> Service -> Firebase
```

Ejemplo futuro:

```txt
SetlistsScreen
  -> useSetlists
  -> setlistService
  -> firebase.ts
```

Para pantallas simples, la pantalla puede llamar al service directamente. Cuando
la pantalla acumula carga, errores, refresh, filtros o transformaciones, conviene
mover esa logica a un hook de la feature.

## Como crear una nueva feature

1. Crear una carpeta en `src/features/<feature-name>`.
2. Agregar `screens/` para pantallas renderizadas por Expo Router.
3. Agregar `components/` para componentes propios de la feature.
4. Agregar `services/` si la feature habla con Firebase u otra API.
5. Agregar `hooks/` cuando haya logica reutilizable o mucha logica de estado.
6. Agregar `types.ts` para tipos compartidos dentro de la feature.
7. Crear el archivo de ruta en `app/` como wrapper delgado.

Ejemplo:

```txt
src/features/profile/
  screens/ProfileScreen.tsx
  screens/ProfileScreen.styles.ts
  services/profileService.ts
  types.ts

app/profile.tsx
```

`app/profile.tsx` deberia tener solo:

```tsx
import ProfileScreen from "../src/features/profile/screens/ProfileScreen";

export default ProfileScreen;
```

## Regla para decidir entre `shared` y una feature

Va dentro de una feature cuando:

- Solo se usa en esa feature.
- Usa tipos o conceptos de esa feature.
- Cambiaria si cambia el negocio de esa feature.

Va en `shared` cuando:

- Puede usarse en varias features sin depender de sus tipos.
- Es UI generica, un hook generico, una utilidad pura o una constante global.
- No conoce reglas de negocio.

Si hay duda, empezar dentro de la feature. Mover a `shared` solo cuando exista un
segundo uso real.
