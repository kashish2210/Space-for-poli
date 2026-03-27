import { databases, client } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type CommentDoc } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

const getLocalComments = () => JSON.parse(localStorage.getItem('local_comments') || '{}');
const saveLocalComments = (data: any) => localStorage.setItem('local_comments', JSON.stringify(data));

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
      // ignore silently
    }
    
    return doc;
  } catch (error: any) {
    // Fallback for any Appwrite error to allow demo mode
    console.warn("Appwrite error adding comment - falling back to local storage.", error);
    const local = getLocalComments();
    if (!local[postId]) local[postId] = [];
    const newComment = {
      $id: Date.now().toString(),
      $createdAt: new Date().toISOString(),
      post_id: postId,
      user_id: userId,
      user_name: userName,
      text
    };
    local[postId].push(newComment);
    saveLocalComments(local);
    return newComment;
  }
}

export async function listComments(postId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      [Query.equal('post_id', postId), Query.orderAsc('$createdAt'), Query.limit(100)]
    );
    const dbComments = res.documents as unknown as CommentDoc[];
    const local = getLocalComments()[postId] || [];
    // Sort combined comments by date
    return [...dbComments, ...local].sort((a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime());
  } catch (error: any) {
    return getLocalComments()[postId] || [];
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
