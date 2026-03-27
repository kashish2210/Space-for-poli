import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  announcements: any[];
  canPost: boolean;
  onPost: (data: { title: string; content: string }) => void;
  isPosting: boolean;
}

export function AnnouncementsPanel({ announcements, canPost, onPost, isPosting }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onPost({ title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Official Announcements</h3>
        </div>
        {canPost && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[10px] font-medium text-primary hover:underline"
          >
            {showForm ? "Cancel" : "+ Post"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="space-y-2 mb-3 p-3 rounded-md border bg-secondary/20">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full rounded-md border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Announcement details..."
            className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isPosting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="h-3 w-3" /> Post Announcement
          </button>
        </div>
      )}

      {announcements.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No announcements yet.</p>
      ) : (
        <div className="space-y-2">
          {announcements.map((a: any) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border bg-secondary/30 p-3"
            >
              <h4 className="text-xs font-semibold text-card-foreground">{a.title}</h4>
              <p className="text-[11px] text-muted-foreground mt-1">{a.content}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
