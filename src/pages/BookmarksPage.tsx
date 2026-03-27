import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookmarks } from "@/services/bookmarkService";
import { aggregatedCityPosts, type CityPost } from "@/pages/Index";
import { DiscussionPost } from "@/components/DiscussionPost";
import { Bookmark, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { TagVariant } from "@/components/TagBadge";

interface LocalBookmarkedPost {
  postId: string;
  author: string;
  tag: TagVariant;
  content: string;
  likes: number;
  replies: number;
  time: string;
  media_url?: string | null;
  media_type?: string | null;
  cityId?: string;
  ministryId?: string;
  city?: string;
  ministry?: string;
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<LocalBookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getUserBookmarks(user.$id).then(bookmarkSet => {
      const result: LocalBookmarkedPost[] = [];

      // 1. Read full snapshots from localStorage (set when user bookmarks a post)
      const localSnapshots: Record<string, LocalBookmarkedPost> = JSON.parse(
        localStorage.getItem("local_bookmark_posts") || "{}"
      );
      Object.values(localSnapshots).forEach(snap => {
        if (bookmarkSet.has(snap.postId)) result.push(snap);
      });

      // 2. Also include any static posts whose IDs are bookmarked (Appwrite mode)
      aggregatedCityPosts.forEach((post, i) => {
        const pId = `${post.cityId}-${post.ministryId}-${post.author.replace(/[^a-zA-Z0-9]/g, "")}-${i}`;
        if (bookmarkSet.has(pId) && !result.some(r => r.postId === pId)) {
          result.push({ ...post, postId: pId });
        }
      });

      setBookmarkedPosts(result);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <main className="container max-w-2xl py-6 md:py-8 space-y-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary fill-primary" />
            Saved Bookmarks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Posts and discussions you've saved for later.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !user ? (
          <div className="text-center py-12 glass-panel rounded-xl">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-lg font-semibold mb-2">Sign in required</h2>
            <p className="text-muted-foreground">Please sign in to view your saved bookmarks.</p>
            <Link to="/auth" className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium">Sign In</Link>
          </div>
        ) : bookmarkedPosts.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-lg font-semibold mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground">Tap the bookmark icon on any post in the feed to save it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPosts.map((post, i) => (
              <motion.div key={post.postId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <DiscussionPost
                  postId={post.postId}
                  author={post.author}
                  tag={post.tag}
                  content={post.content}
                  likes={post.likes}
                  replies={post.replies}
                  time={post.time}
                  media_url={post.media_url}
                  media_type={post.media_type}
                >
                  {post.ministryId && (
                    <Link
                      to={`/ministries/${post.ministryId}`}
                      className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Building2 className="h-3 w-3" />
                      {post.ministry}
                    </Link>
                  )}
                  {post.cityId && (
                    <Link
                      to={`/cities/${post.cityId}`}
                      className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors ml-1.5"
                    >
                      {post.city}
                    </Link>
                  )}
                </DiscussionPost>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

