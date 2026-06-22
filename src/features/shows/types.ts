export type SetlistMasterItem = {
    id: string;
    nombre: string;
}

export type Show = {
    id: string;
    nombre: string;
    fecha?: string;
    active: boolean;
    setlistMaster: SetlistMasterItem[];
}
export type InstrumentPdf = {
    nombre: string;
    url: string;
    publicId: string;
}

export type Instrumento = {
    id: string;
    nombre: string;
    codigoAcceso?: string;
    activo: boolean;
    pdfsPorSetlistItem?: Record<string, InstrumentPdf>;
}