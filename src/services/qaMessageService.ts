import { databases, client } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type QAMessageDoc } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

export async function sendQAMessage(
  sessionId: string,
  userId: string,
  userName: string,
  text: string,
  isAi: boolean = false
) {
  try {
    return await databases.createDocument(DATABASE_ID, COLLECTIONS.QA_MESSAGES, ID.unique(), {
      session_id: sessionId,
      user_id: userId,
      user_name: userName,
      text,
      is_ai: isAi,
    });
  } catch (error) {
    console.error("Failed to send QA message:", error);
    throw error;
  }
}

export async function listQAMessages(sessionId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.QA_MESSAGES,
      [Query.equal('session_id', sessionId), Query.orderAsc('$createdAt'), Query.limit(200)]
    );
    return res.documents as unknown as QAMessageDoc[];
  } catch (error) {
    console.error("Failed to list QA messages:", error);
    return [];
  }
}

export function subscribeToQAMessages(
  sessionId: string,
  onNewMessage: (msg: QAMessageDoc) => void,
) {
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.QA_MESSAGES}.documents`;

  return client.subscribe(channel, (response) => {
    const events = response.events || [];
    const isCreate = events.some((e: string) => e.includes('.create'));
    if (!isCreate) return;

    const payload = response.payload as any;
    if (payload.session_id !== sessionId) return;

    onNewMessage(payload as QAMessageDoc);
  });
}
