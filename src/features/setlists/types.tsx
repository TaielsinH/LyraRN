import { Timestamp } from "firebase/firestore";

export type Setlist = {
  id: string;
  codigoCompartir: string;
  fechaCreacion: Timestamp | number;
  isActive: boolean;
  nombreGrupo: string;
  ownerId: string;
  partituras: Partitura[];
  suscriptores: string[];
  titulo: string;
  ubicacion: string;
};

export type Partitura = {
  nombre: string;
  publicId: string;
  url: string;
};
export type LocalPdf = {
  name: string;
  uri: string;
  size?: number;
  mimeType?: string;
};