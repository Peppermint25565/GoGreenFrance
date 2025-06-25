import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload une seule image dans le bucket « avatars ».
 * @returns l'URL publique
 */
export const uploadAvatar = async (uid: string, file: File) => {
  const extension = file.name.split(".").pop();
  const filePath = `avatars/${uid}.${extension}`;
  const { error } = await supabase.storage.from("avatars").upload(filePath, file, {
    upsert: true,          // remplace si déjà présent
    contentType: file.type // permet de servir le bon MIME
  });
  if (error) throw error;

  // URL publique immédiate
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Upload plusieurs images pour une demande cliente.
 * Renvoie la liste des URLs publiques.
 */
export const uploadRequestImages = async (
  requestId: string,
  files: File[]
) => {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const filePath = `requests/${requestId}/${uuidv4()}.${ext}`;

    const { error } = await supabase.storage
      .from("requests")
      .upload(filePath, file, { contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from("requests").getPublicUrl(filePath);
    urls.push(data.publicUrl);
  }

  return urls;
};
