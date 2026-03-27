import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

interface GroupCardProps {
  id: string;
  name: string;
  type: "city" | "party";
  memberCount: number;
  icon?: React.ReactNode;
}

export function GroupCard({ id, name, type, memberCount, icon }: GroupCardProps) {
  const basePath = type === "city" ? "/cities" : "/parties";
  return (
    <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
      <Link
        to={`${basePath}/${id}`}
        className="flex items-center gap-3 rounded-md glass-card px-3 py-2.5 group hover:bg-white/10"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0">
          {icon || (type === "city" ? <MapPin className="h-4 w-4" /> : <Users className="h-4 w-4" />)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-card-foreground truncate">{name}</h3>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />{memberCount.toLocaleString()} members
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      </Link>
    </motion.div>
  );
}
