export type DirectorSection = "director" | "shows";

export type Agrupacion = {
    id: string;
    nombre: string;
    directorId: string;
    active: boolean;
}
export type Show = {
    id: string;
    nombre: string;
    fecha: string | null;
    active: boolean;
    setlistMaster: SetlistMasterItem[];
}
export type SetlistMasterItem = {
    id: string;
    nombre: string;
};
