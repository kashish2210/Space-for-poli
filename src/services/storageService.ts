import { storage } from '@/integrations/appwrite/client';
import { ID } from 'appwrite';

const BUCKET_ID = 'media';

export async function uploadMedia(file: File): Promise<string | null> {
  try {
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
    
    const fileUrl = storage.getFileView(BUCKET_ID, response.$id);
    return fileUrl.toString();
  } catch (error: any) {
    // Fallback on any error to ensure local demo works even if bucket is missing or unauthorized
    console.warn("Appwrite upload failed - falling back to blob URL.", error);
    return URL.createObjectURL(file);
  }
}

export async function deleteMedia(fileId: string) {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
    return true;
  } catch (error) {
    console.error("Failed to delete media:", error);
    return false;
  }
}
