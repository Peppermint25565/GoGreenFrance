import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_PROJECT_URL, import.meta.env.VITE_SUPABASE_API_KEY)
export interface UploadData {
  id: string;
  path: string;
  fullPath: string;
}

export async function uploadProfilePictures(file: File, uid: string) {
  const { data } = await supabase.storage.from('profile_pictures').exists(uid + file.name)
  if (data) {
    await supabase.storage.from('profile_pictures').remove([uid + file.name])
  }
  const { error } = await supabase.storage.from('profile_pictures').upload(uid + file.name, file)
  if (error) {
    console.log(error);
    return false;
  } else {
    return `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/profile_pictures/${uid + file.name}`
  }
}

export async function uploadRequest(file: File, requestId: string) {
  const { data, error } = await supabase.storage.from('requests').upload(requestId + file.name, file)
  if (error) {
    console.log(error);
    return false;
  } else {
    return `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/request/${requestId}`
  }
}

export function getProfilePictureUrl(uid: string) {
  const { data: urlData } = supabase.storage.from('profiles_pictures').getPublicUrl(uid);
  console.log(urlData.publicUrl)
  return urlData.publicUrl;
}

export function getRequestImgUrl(requestId: string) {
  return `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/requests/${requestId}`
}

export async function uploadKyc(file: File, providerId: string, docType: string) {
  const filePath = `${providerId}/${docType}`;
  const { data } = await supabase.storage.from('kyc-docs').exists(filePath)
  if (data) {
    await supabase.storage.from('kyc-docs').remove([filePath])
  }
  const { error } = await supabase.storage.from('kyc-docs').upload(filePath, file);
  if (error) {
    throw error;
  }
  const { data: urlData } = supabase.storage.from('kyc-docs').getPublicUrl(filePath);
  return urlData.publicUrl;
}