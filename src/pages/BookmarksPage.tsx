import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBookmarks } from "@/services/bookmarkService";
import { aggregatedCityPosts, type CityPost } from "@/pages/Index";
import { DiscussionPost } from "@/components/DiscussionPost";
import { Bookmark, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{post: CityPost, id: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getUserBookmarks(user.$id).then(bookmarks => {
      // Find which of the static posts match the bookmarked IDs
      // The IDs generated in Index.tsx are: `${post.cityId}-${post.ministryId}-${post.author.replace(/[^a-zA-Z0-9]/g, '')}-${i}`
      const userBookmarks: {post: CityPost, id: string}[] = [];
      
      aggregatedCityPosts.forEach((post, i) => {
        const pId = `${post.cityId}-${post.ministryId}-${post.author.replace(/[^a-zA-Z0-9]/g, '')}-${i}`;
        if (bookmarks.has(pId)) {
          userBookmarks.push({ post, id: pId });
        }
      });

      setBookmarkedPosts(userBookmarks);
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
            <p className="text-muted-foreground">When you bookmark a post in the feed, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarkedPosts.map(({ post, id }, i) => (
              <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <DiscussionPost
                  postId={id}
                  author={post.author}
                  tag={post.tag}
                  content={post.content}
                  likes={post.likes}
                  replies={post.replies}
                  time={post.time}
                >
                  <Link
                    to={`/ministries/${post.ministryId}`}
                    className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Building2 className="h-3 w-3" />
                    {post.ministry}
                  </Link>
                  <Link
                    to={`/cities/${post.cityId}`}
                    className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors ml-1.5"
                  >
                    {post.city}
                  </Link>
                </DiscussionPost>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
