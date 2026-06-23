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

export type ShowSetlistSuscripto = {
  codigo: string;
  agrupacionId: string;
  showId: string;
  instrumentoId: string;
  nombreShow: string;
  fechaShow: string | undefined;
  nombreInstrumento: string;
};

export type PdfInstrumento = {
  nombre: string;
  url: string;
  publicId?: string;
};

export type InstrumentoDetalle = {
  id: string;
  nombre: string;
  activo: boolean;
  pdfsPorSetlistItem: Record<string, PdfInstrumento>;
};

export type ShowDetalle = {
  id: string;
  nombre: string;
  fecha?: string;
  active: boolean;
  setlistMaster: SetlistMasterItem[];
};

export type SetlistReaderRow = {
  id: string;
  orden: number;
  nombre: string;
  pdf?: PdfInstrumento;
};