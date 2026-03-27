import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        appreciation: "bg-tag-appreciation text-tag-appreciation-foreground",
        complaint: "bg-tag-complaint text-tag-complaint-foreground",
        suggestion: "bg-tag-suggestion text-tag-suggestion-foreground",
        question: "bg-tag-question text-tag-question-foreground",
        discussion: "bg-tag-discussion text-tag-discussion-foreground",
        update: "bg-tag-update text-tag-update-foreground",
        announcement: "bg-tag-announcement text-tag-announcement-foreground",
      },
    },
    defaultVariants: {
      variant: "discussion",
    },
  }
);

export type TagVariant = "appreciation" | "complaint" | "suggestion" | "question" | "discussion" | "update" | "announcement";

interface TagBadgeProps extends VariantProps<typeof tagVariants> {
  label: string;
  className?: string;
}

export function TagBadge({ variant, label, className }: TagBadgeProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)}>
      {label}
    </span>
  );
}
