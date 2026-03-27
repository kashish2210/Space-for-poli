import { databases } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type BookmarkDoc } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

export async function addBookmark(userId: string, postId: string) {
  try {
    await databases.createDocument(DATABASE_ID, COLLECTIONS.BOOKMARKS, ID.unique(), {
      user_id: userId,
      post_id: postId,
    });
    return true;
  } catch {
    return false;
  }
}

export async function removeBookmark(userId: string, postId: string) {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOOKMARKS,
      [Query.equal('user_id', userId), Query.equal('post_id', postId)]
    );
    for (const doc of res.documents) {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.BOOKMARKS, doc.$id);
    }
    return true;
  } catch {
    return false;
  }
}

export async function getUserBookmarks(userId: string): Promise<Set<string>> {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOOKMARKS,
      [Query.equal('user_id', userId), Query.limit(200)]
    );
    return new Set((res.documents as any[]).map((d) => d.post_id));
  } catch {
    return new Set();
  }
}

export async function toggleBookmark(userId: string, postId: string, isCurrentlyBookmarked: boolean) {
  if (isCurrentlyBookmarked) {
    return removeBookmark(userId, postId);
  } else {
    return addBookmark(userId, postId);
  }
}
