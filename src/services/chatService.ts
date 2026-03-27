import { databases, client } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type ChatMessageDoc } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

export async function sendChatMessage(
  rallyId: string,
  userId: string,
  userName: string,
  role: string,
  text: string,
) {
  try {
    return await databases.createDocument(DATABASE_ID, COLLECTIONS.CHAT_MESSAGES, ID.unique(), {
      rally_id: rallyId,
      user_id: userId,
      user_name: userName,
      role,
      text,
    });
  } catch (error: any) {
    // Fallback to local object on any Appwrite error so UI always works
    console.warn("Appwrite chat error - falling back to local message", error);
    return {
      $id: Date.now().toString(),
      $createdAt: new Date().toISOString(),
      rally_id: rallyId,
      user_id: userId,
      user_name: userName,
      role,
      text,
    };
  }
}

export async function listChatMessages(rallyId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHAT_MESSAGES,
      [Query.equal('rally_id', rallyId), Query.orderAsc('$createdAt'), Query.limit(200)]
    );
    return res.documents as unknown as ChatMessageDoc[];
  } catch {
    return [];
  }
}

/**
 * Subscribe to new chat messages for a rally room.
 * Returns an unsubscribe function.
 */
export function subscribeToChatMessages(
  rallyId: string,
  onNewMessage: (msg: ChatMessageDoc) => void,
) {
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.CHAT_MESSAGES}.documents`;

  return client.subscribe(channel, (response) => {
    const events = response.events || [];
    const isCreate = events.some((e: string) => e.includes('.create'));
    if (!isCreate) return;

    const payload = response.payload as any;
    if (payload.rally_id !== rallyId) return;

    onNewMessage(payload as ChatMessageDoc);
  });
}
