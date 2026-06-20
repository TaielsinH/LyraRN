const CLOUD_NAME = "dgo0osrkz";
const UPLOAD_PRESET = "lyra_setlists";

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
};

export async function uploadPdfToCloudinary(
  uri: string,
  fileName: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: "application/pdf",
  } as unknown as Blob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("resource_type", "auto");

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ?? "No se pudo subir el archivo a Cloudinary.";
    throw new Error(message);
  }

  return {
    publicId: data.public_id,
    url: data.secure_url,
  };
}
