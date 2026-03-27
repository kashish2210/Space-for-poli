import { Shield, Phone, Mail, ExternalLink, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

export interface Official {
  name: string;
  designation: string;
  department?: string;
  phone?: string;
  email?: string;
  image?: string;
  link?: string;
}

interface OfficialsListProps {
  officials: Official[];
  isOpen: boolean;
}

export function OfficialsList({ officials, isOpen }: OfficialsListProps) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const roles = useMemo(() => [...new Set(officials.map((o) => o.designation))], [officials]);
  const depts = useMemo(() => [...new Set(officials.map((o) => o.department).filter(Boolean))], [officials]);

  const filtered = useMemo(() => officials.filter((o) => {
    const roleMatch = roleFilter === "all" || o.designation === roleFilter;
    const deptMatch = deptFilter === "all" || o.department === deptFilter;
    return roleMatch && deptMatch;
  }), [officials, roleFilter, deptFilter]);

  const hasFilters = roleFilter !== "all" || deptFilter !== "all";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Key Officials ({filtered.length})
              </h3>
              {hasFilters && (
                <button
                  onClick={() => { setRoleFilter("all"); setDeptFilter("all"); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Filter bar */}
            {(roles.length > 1 || depts.length > 1) && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {roles.length > 1 && (
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">All Roles</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                )}
                {depts.length > 1 && (
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">All Departments</option>
                    {depts.map((d) => (
                      <option key={d} value={d!}>{d}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {filtered.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2.5 group"
                >
                  {o.link ? (
                    <Link to={o.link} className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 hover:bg-primary/30 transition-colors">
                      {o.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </Link>
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {o.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {o.link ? (
                      <Link to={o.link} className="text-sm font-medium text-card-foreground truncate block hover:text-primary transition-colors">{o.name}</Link>
                    ) : (
                      <p className="text-sm font-medium text-card-foreground truncate">{o.name}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground truncate">{o.designation}</p>
                    {o.department && (
                      <p className="text-[10px] text-muted-foreground/70 truncate">{o.department}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {o.link && (
                      <Link to={o.link} className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors" title="View group">
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    )}
                    {o.phone && (
                      <a href={`tel:${o.phone}`} className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors" title={o.phone}>
                        <Phone className="h-3 w-3 text-muted-foreground" />
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors" title={o.email}>
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
