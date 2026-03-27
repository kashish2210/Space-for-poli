import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const roleVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        mp: "bg-primary text-primary-foreground",
        mla: "bg-accent text-accent-foreground",
        "former-mp": "bg-muted text-muted-foreground border",
        "former-mla": "bg-muted text-muted-foreground border",
        minister: "bg-tag-suggestion text-tag-suggestion-foreground",
        worker: "bg-secondary text-secondary-foreground",
        leader: "bg-tag-appreciation text-tag-appreciation-foreground",
      },
    },
    defaultVariants: {
      variant: "worker",
    },
  }
);

export type RoleVariant = "mp" | "mla" | "former-mp" | "former-mla" | "minister" | "worker" | "leader";

interface RoleBadgeProps extends VariantProps<typeof roleVariants> {
  label: string;
  className?: string;
}

export function RoleBadge({ variant, label, className }: RoleBadgeProps) {
  return (
    <span className={cn(roleVariants({ variant }), className)}>
      {label}
    </span>
  );
}
