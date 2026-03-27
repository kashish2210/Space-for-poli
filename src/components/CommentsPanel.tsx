import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addComment, listComments, subscribeToComments } from "@/services/commentService";
import { getAIReply } from "@/services/geminiService";
import type { CommentDoc } from "@/integrations/appwrite/collections";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentsPanelProps {
  postId: string;
  postContent: string;
}

export function CommentsPanel({ postId, postContent }: CommentsPanelProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTypingAI, setIsTypingAI] = useState(false);

  useEffect(() => {
    listComments(postId).then(docs => {
      setComments(docs);
      setLoading(false);
    });

    const unsub = subscribeToComments(postId, (newComment) => {
      setComments(prev => {
        if (prev.some(c => c.$id === newComment.$id)) return prev;
        return [...prev, newComment];
      });
    });

    return () => unsub();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const text = input.trim();
    setInput("");

    try {
      const userName = user.name || user.email?.split("@")[0] || "User";
      await addComment(postId, user.$id, userName, text);

      // Trigger Gemini AI Reply if it's the first few comments or randomly
      if (Math.random() > 0.5 || comments.length === 0) {
        setIsTypingAI(true);
        const aiResponse = await getAIReply(
          `The discussion is about a post: "${postContent}". 
User ${userName} just commented: "${text}".
Generate a helpful, insightful, and constructive response to keep the conversation going.`,
          text
        );
        
        if (aiResponse) {
          await addComment(postId, "gemini-ai-bot", "Community AI", aiResponse);
        }
        setIsTypingAI(false);
      }
    } catch (err) {
      console.error("Failed to post comment", err);
      setIsTypingAI(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto px-1">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(c => (
            <motion.div key={c.$id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${c.user_id === 'gemini-ai-bot' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-secondary text-secondary-foreground'}`}>
                {c.user_id === "gemini-ai-bot" ? <Sparkles className="h-3 w-3" /> : c.user_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold ${c.user_id === 'gemini-ai-bot' ? 'text-indigo-400' : 'text-foreground'}`}>
                    {c.user_name}
                  </span>
                  {c.user_id === 'gemini-ai-bot' && (
                    <span className="text-[8px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full">AI</span>
                  )}
                  <span className="text-[9px] text-muted-foreground ml-auto">
                    {new Date(c.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[13px] text-card-foreground/90 mt-0.5 leading-relaxed">{c.text}</p>
              </div>
            </motion.div>
          ))
        )}
        
        {isTypingAI && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
            <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          disabled={!user || isTypingAI}
          className="flex-1 bg-secondary/50 rounded-lg pl-3 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-shadow"
        />
        <button
          type="submit"
          disabled={!input.trim() || !user || isTypingAI}
          className="absolute right-1 top-1 h-7 w-7 rounded bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          <Send className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}
