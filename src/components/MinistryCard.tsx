import { Link } from "react-router-dom";
import { Building2, ChevronRight, Users } from "lucide-react";
import { motion } from "framer-motion";

interface MinistryCardProps {
  id: string;
  name: string;
  level: "central" | "state";
  memberCount: number;
  latestUpdate?: string;
}

export function MinistryCard({ id, name, level, memberCount, latestUpdate }: MinistryCardProps) {
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
      <Link
        to={`/ministries/${id}`}
        className="block glass-card rounded-lg p-3.5 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground leading-tight">{name}</h3>
              <p className="text-[11px] text-muted-foreground capitalize">{level}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
        </div>
        <div className="mt-2 flex items-center text-[11px] text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />{memberCount.toLocaleString()} members
        </div>
        {latestUpdate && (
          <p className="mt-2 text-xs text-muted-foreground/80 line-clamp-1 border-t border-border pt-2">
            📢 {latestUpdate}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
