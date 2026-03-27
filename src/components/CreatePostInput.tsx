import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Image, Video, X, Loader2, Send } from "lucide-react";
import { TagBadge, type TagVariant } from "./TagBadge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AVAILABLE_TAGS: TagVariant[] = [
  "discussion", "question", "suggestion", "appreciation", "complaint", "update", "announcement"
];

interface CreatePostInputProps {
  onSubmit: (content: string, tag: TagVariant, file?: File | null) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export function CreatePostInput({ onSubmit, placeholder = "What's on your mind?", className = "" }: CreatePostInputProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<TagVariant>("discussion");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Check size (e.g. 10MB limit)
    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim() && !file) return;
    if (!user) {
      toast.error("Please sign in to post");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content, tag, file);
      setContent("");
      removeFile();
      setTag("discussion");
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`glass-panel rounded-lg p-4 border border-white/10 ${className}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
          {user ? (user.name?.[0] || user.email?.split("@")[0][0] || "U").toUpperCase() : "?"}
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!user || isSubmitting}
            placeholder={user ? placeholder : "Sign in to post your views"}
            className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[80px]"
          />

          <AnimatePresence>
            {previewUrl && file && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative mb-3 rounded-lg overflow-hidden border border-border">
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full z-10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {file.type.startsWith("video/") ? (
                  <video src={previewUrl} controls className="w-full max-h-[300px] object-contain bg-black/5" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full max-h-[300px] object-cover" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!user || isSubmitting}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50"
                title="Attach Media"
              >
                <Image className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/mp4,video/webm"
                className="hidden"
              />

              {/* Tag Selector */}
              <div className="relative group">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as TagVariant)}
                  disabled={!user || isSubmitting}
                  className="appearance-none bg-secondary/50 text-xs font-medium px-3 py-1.5 rounded-full outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent hover:border-border disabled:opacity-50 pr-8"
                >
                  {AVAILABLE_TAGS.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={(!content.trim() && !file) || !user || isSubmitting}
              className="flex items-center gap-2 px-5 py-2 md:py-1.5 md:h-9 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all shrink-0 shadow-md shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
