import { databases, client } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type CommentDoc } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

export async function addComment(postId: string, userId: string, userName: string, text: string) {
  try {
    const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.COMMENTS, ID.unique(), {
      post_id: postId,
      user_id: userId,
      user_name: userName,
      text,
    });
    
    // Also increment replies count on the post
    try {
      const post = await databases.getDocument(DATABASE_ID, COLLECTIONS.POSTS, postId);
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.POSTS, postId, {
        replies: (post.replies || 0) + 1,
      });
    } catch (e) {
      console.error("Failed to update post reply count", e);
    }
    
    return doc;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
}

export async function listComments(postId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      [Query.equal('post_id', postId), Query.orderAsc('$createdAt'), Query.limit(100)]
    );
    return res.documents as unknown as CommentDoc[];
  } catch (error) {
    console.error("Failed to list comments:", error);
    return [];
  }
}

export function subscribeToComments(
  postId: string,
  onNewComment: (comment: CommentDoc) => void,
) {
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.COMMENTS}.documents`;

  return client.subscribe(channel, (response) => {
    const events = response.events || [];
    const isCreate = events.some((e: string) => e.includes('.create'));
    if (!isCreate) return;

    const payload = response.payload as any;
    if (payload.post_id !== postId) return;

    onNewComment(payload as CommentDoc);
  });
}
