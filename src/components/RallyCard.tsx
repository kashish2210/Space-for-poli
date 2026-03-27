import { Mic, Users, MapPin, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getRallyCalendarUrl } from "@/services/rallyService";

interface RallyCardProps {
  id?: string;
  title: string;
  host: string;
  listenerCount: number;
  isLive: boolean;
  scope?: string;
  scopeType?: "city" | "state";
}

export function RallyCard({ id, title, host, listenerCount, isLive, scope, scopeType }: RallyCardProps) {
  const slug = id || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const content = (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-card rounded-lg p-4 relative overflow-hidden cursor-pointer"
    >
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-rally opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rally" />
          </span>
          <span className="text-[10px] font-bold text-rally uppercase tracking-wider">Live</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rally/20 text-rally">
          <Mic className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-card-foreground leading-tight text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground">Hosted by {host}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {scope && (
            <span className="flex items-center gap-1">
              {scopeType === "city" ? <MapPin className="h-3 w-3" /> : <Landmark className="h-3 w-3" />}
              {scope}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />{listenerCount.toLocaleString()} listening
          </span>
        </div>
        {isLive ? (
          <span className="rounded-full bg-rally px-4 py-1.5 text-xs font-semibold text-rally-foreground hover:opacity-90 transition-opacity">
            Join
          </span>
        ) : (
          <a
            href={getRallyCalendarUrl(title, host, slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-rally px-4 py-1.5 text-xs font-semibold text-rally-foreground hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Remind Me
          </a>
        )}
      </div>
    </motion.div>
  );

  return isLive ? <Link to={`/rallies/${slug}`}>{content}</Link> : content;
}
