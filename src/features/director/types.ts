export type DirectorSection = "director" | "shows";

export type Agrupacion = {
    id: string;
    nombre: string;
    directorId: string;
    active: boolean;
}
