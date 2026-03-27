import { databases } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/integrations/appwrite/collections';
import { Query, ID } from 'appwrite';

// Helper for local storage fallback
const getLocalBookmarks = () => JSON.parse(localStorage.getItem('local_bookmarks') || '{}');
const saveLocalBookmarks = (data: any) => localStorage.setItem('local_bookmarks', JSON.stringify(data));

export async function addBookmark(userId: string, postId: string) {
  try {
    await databases.createDocument(DATABASE_ID, COLLECTIONS.BOOKMARKS, ID.unique(), {
      user_id: userId,
      post_id: postId,
    });
    return true;
  } catch (err: any) {
    // Fallback to local storage if Appwrite fails
    const local = getLocalBookmarks();
    if (!local[userId]) local[userId] = [];
    if (!local[userId].includes(postId)) local[userId].push(postId);
    saveLocalBookmarks(local);
    return true;
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
  } catch (err: any) {
    const local = getLocalBookmarks();
    if (local[userId]) {
      local[userId] = local[userId].filter((id: string) => id !== postId);
      saveLocalBookmarks(local);
    }
    return true;
  }
}

export async function getUserBookmarks(userId: string): Promise<Set<string>> {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOOKMARKS,
      [Query.equal('user_id', userId), Query.limit(200)]
    );
    const set = new Set((res.documents as any[]).map((d) => d.post_id));
    
    // Merge with local fallback
    const local = getLocalBookmarks()[userId] || [];
    local.forEach((id: string) => set.add(id));
    
    return set;
  } catch (err: any) {
    return new Set(getLocalBookmarks()[userId] || []);
  }
}

export async function toggleBookmark(userId: string, postId: string, isCurrentlyBookmarked: boolean) {
  if (isCurrentlyBookmarked) {
    return removeBookmark(userId, postId);
  } else {
    return addBookmark(userId, postId);
  }
}
