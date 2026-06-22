import type { InstrumentPdf } from "../features/shows/types";

const CLOUD_NAME = "dgo0osrkz";
const UPLOAD_PRESET = "lyra_setlists";

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  folder: string;
};

type UploadPdfParams = {
  uri: string;
  fileName: string;
  folder: string;
};


export async function uploadPdfToCloudinary({
  uri,
  fileName,
  folder,
}: UploadPdfParams): Promise<InstrumentPdf> {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: "application/pdf",
  } as any);

  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message ?? "No se pudo subir el PDF.");
  }

  return {
    nombre: fileName,
    url: data.secure_url,
    publicId: data.public_id,
  };
}
