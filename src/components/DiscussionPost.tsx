import { TagBadge, type TagVariant } from "./TagBadge";
import { MessageCircle, ArrowBigUp, ArrowBigDown, Share2, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { voteOnPost } from "@/services/postService";
import { toggleBookmark, getUserBookmarks } from "@/services/bookmarkService";
import { CommentsPanel } from "./CommentsPanel";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface DiscussionPostProps {
  postId: string;
  author: string;
  tag: TagVariant;
  content: string;
  likes: number;
  replies: number;
  time: string;
  media_url?: string | null;
  media_type?: string | null;
  initialVote?: "up" | "down" | null;
  children?: React.ReactNode;
}

export function DiscussionPost({ postId, author, tag, content, likes, replies, time, media_url, media_type, initialVote = null, children }: DiscussionPostProps) {
  const { user } = useAuth();
  const [vote, setVote] = useState<"up" | "down" | null>(initialVote);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (user) {
      getUserBookmarks(user.$id).then(set => {
        if (set.has(postId)) setIsBookmarked(true);
      });
    }
  }, [user, postId]);

  const voteCount = likes + (vote === "up" ? 1 : vote === "down" ? -1 : 0) - (initialVote === "up" ? 1 : initialVote === "down" ? -1 : 0);

  const handleVote = async (dir: "up" | "down") => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }
    if (isVoting) return;
    
    setIsVoting(true);
    const prevVote = vote;
    const newVote = vote === dir ? null : dir;
    setVote(newVote);

    const result = await voteOnPost(postId, user.$id, dir);
    if (result === undefined) {
      // Revert on error
      setVote(prevVote);
      toast.error("Failed to register vote");
    }
    setIsVoting(false);
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Please sign in to bookmark");
      return;
    }
    
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    const success = await toggleBookmark(user.$id, postId, prev);
    if (!success) {
      setIsBookmarked(prev);
      toast.error("Failed to update bookmark");
    } else {
      // Also persist the full post snapshot so BookmarksPage can show it
      const snapshot = { postId, author, tag, content, likes, replies, time, media_url, media_type };
      const stored = JSON.parse(localStorage.getItem('local_bookmark_posts') || '{}');
      if (prev) {
        delete stored[postId];
      } else {
        stored[postId] = snapshot;
      }
      localStorage.setItem('local_bookmark_posts', JSON.stringify(stored));
      toast.success(prev ? "Removed from bookmarks" : "Saved to bookmarks");
    }
  };

  return (
    <div className="flex flex-col gap-0 glass-panel rounded-lg hover:bg-white/5 transition-colors group border-white/10 overflow-hidden">
      <div className="flex w-full">
        {/* Reddit-style vote rail */}
        <div className="flex flex-col items-center gap-0.5 py-3 px-2 rounded-l-lg shrink-0">
          <button
            onClick={() => handleVote("up")}
            disabled={isVoting}
            className={`p-0.5 rounded transition-colors ${vote === "up" ? "text-upvote" : "text-muted-foreground hover:text-upvote"}`}
          >
            <ArrowBigUp className={`h-5 w-5 ${vote === "up" ? "fill-upvote" : ""}`} />
          </button>
          <span className={`text-xs font-bold ${vote === "up" ? "text-upvote" : vote === "down" ? "text-downvote" : "text-card-foreground"}`}>
            {voteCount}
          </span>
          <button
            onClick={() => handleVote("down")}
            disabled={isVoting}
            className={`p-0.5 rounded transition-colors ${vote === "down" ? "text-downvote" : "text-muted-foreground hover:text-downvote"}`}
          >
            <ArrowBigDown className={`h-5 w-5 ${vote === "down" ? "fill-downvote" : ""}`} />
          </button>
        </div>

        {/* Post body */}
        <div className="flex-1 py-3 pr-4 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div className="h-6 w-6 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">
              {author[0]}
            </div>
            <span className="text-xs font-semibold text-card-foreground">{author}</span>
            <TagBadge variant={tag} label={tag.charAt(0).toUpperCase() + tag.slice(1)} />
            <span className="text-[11px] text-muted-foreground ml-auto">{time}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-card-foreground/90 leading-relaxed mb-3">{content}</p>

          {/* Media Attachment */}
          {media_url && (
            <div className="mb-3 rounded-lg overflow-hidden border border-border">
              {media_type?.startsWith("video/") ? (
                <video src={media_url} controls className="w-full max-h-[400px] object-contain bg-black/5" />
              ) : (
                <img src={media_url} alt="Post attachment" className="w-full max-h-[400px] object-cover" />
              )}
            </div>
          )}

          {children}

          {/* Twitter-style action bar */}
          <div className="flex items-center gap-5 mt-2.5 text-muted-foreground">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${showComments ? 'text-primary' : 'hover:text-primary'}`}
            >
              <MessageCircle className="h-4 w-4" />{replies}
            </button>
            <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 text-xs transition-colors ${isBookmarked ? 'text-primary' : 'hover:text-primary'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 w-full"
          >
            <CommentsPanel postId={postId} postContent={content} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
