import { Link, useLocation } from "react-router-dom";
import { Building2, Mic, Home, MapPin, Users, Hash, ChevronDown, Landmark, Scale, Bell, LogOut, LogIn, Building, Bookmark, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useJoinedGroups } from "@/contexts/JoinedGroupsContext";
import { useAuth } from "@/contexts/AuthContext";
import { EmergencyButton } from "./EmergencyButton";

const channels = [
  { to: "/", label: "home", icon: Home, category: null },
  { to: "/ministries", label: "ministries", icon: Building2, category: "GROUPS" },
  { to: "/cities", label: "cities", icon: MapPin, category: "GROUPS" },
  { to: "/municipalities", label: "municipalities", icon: Building, category: "GROUPS" },
  { to: "/parties", label: "parties", icon: Users, category: "GROUPS" },
  { to: "/states", label: "states", icon: Landmark, category: "GROUPS" },
  { to: "/parliament", label: "parliament", icon: Scale, category: "GROUPS" },
  { to: "/rallies", label: "rallies", icon: Mic, category: "LIVE" },
  { to: "/bookmarks", label: "bookmarks", icon: Bookmark, category: null },
];

export function AppNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { joinedGroups, totalNotifications } = useJoinedGroups();
  const { user, signOut } = useAuth();

  const categories = [...new Set(channels.map((c) => c.category).filter(Boolean))];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] glass-panel z-50 border-r-white/10">
        {/* Server header */}
        <div className="h-12 flex items-center px-4 border-b border-sidebar-border shadow-sm">
          <Link to="/" className="flex items-center gap-2 font-bold text-base tracking-tight text-sidebar-accent-foreground group">
            <img src="/logo.jpg" alt="Space Logo" className="h-7 w-7 rounded-lg object-cover transition-transform group-hover:scale-110" />
            <span>Space</span>
          </Link>
        </div>

        {/* Channels */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          <div className="px-2 mb-4">
            <EmergencyButton />
          </div>

          {/* Home channel */}
          {channels.filter((c) => !c.category).map((ch) => {
            const active = location.pathname === ch.to;
            return (
              <Link
                key={ch.to}
                to={ch.to}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <ch.icon className="h-4 w-4 shrink-0" />
                {ch.label}
              </Link>
            );
          })}

          {categories.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-1 px-1 mb-1">
                <ChevronDown className="h-3 w-3 text-sidebar-foreground/40" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">{cat}</span>
              </div>
              {channels.filter((c) => c.category === cat).map((ch) => {
                const active = location.pathname === ch.to || (ch.to !== "/" && location.pathname.startsWith(ch.to));
                return (
                  <Link
                    key={ch.to}
                    to={ch.to}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Hash className="h-4 w-4 shrink-0 opacity-60" />
                    {ch.label}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Joined groups with notifications */}
          {joinedGroups.length > 0 && (
            <div>
              <div className="flex items-center gap-1 px-1 mb-1">
                <ChevronDown className="h-3 w-3 text-sidebar-foreground/40" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">Your Groups</span>
                {totalNotifications > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground min-w-[14px] h-[14px]">
                    {totalNotifications}
                  </span>
                )}
              </div>
              {joinedGroups.map((g) => {
                const active = location.pathname === g.path || location.pathname.startsWith(g.path + "/");
                return (
                  <Link
                    key={g.id}
                    to={g.path}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Hash className="h-4 w-4 shrink-0 opacity-60" />
                    <span className="truncate flex-1">{g.name}</span>
                    {g.notifications > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold min-w-[14px] h-[14px] px-1 shrink-0">
                        {g.notifications}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User bar */}
        <div className="h-[52px] flex items-center gap-2 px-3 bg-black/20 border-t border-white/10">
          {user ? (
            <>
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-online border-2 border-sidebar" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-accent-foreground truncate">
                  {user.name || user.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-sidebar-foreground/50">Online</p>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setChatOpen(!chatOpen)}
                  className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors relative" 
                  title="Messages"
                >
                  <MessageSquare className="h-4 w-4 text-sidebar-foreground/70" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border-2 border-sidebar" />
                </button>
              </div>
              {/* Chat panel — rendered outside the button so it doesn't overlap the nav */}
              {chatOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setChatOpen(false)}
                  />
                  <div className="fixed left-[248px] bottom-4 z-50 w-72 glass-panel rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center">
                      <span className="text-xs font-semibold">Active Chats</span>
                      <Link to="/rallies" onClick={() => setChatOpen(false)} className="text-[10px] text-primary hover:underline">View All</Link>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      <Link to="/rallies/union-budget-2025" onClick={() => setChatOpen(false)} className="flex items-center gap-3 p-3 hover:bg-sidebar-accent/50 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-rally/20 flex items-center justify-center text-rally shrink-0">
                          <Mic className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">Union Budget Discussion</p>
                          <p className="text-[10px] text-muted-foreground truncate">Last msg: Thanks for answering...</p>
                        </div>
                      </Link>
                      <Link to="/rallies/mumbai-clean-city" onClick={() => setChatOpen(false)} className="flex items-center gap-3 p-3 hover:bg-sidebar-accent/50 transition-colors">
                        <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <Building className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">Mumbai Clean City</p>
                          <p className="text-[10px] text-muted-foreground truncate">Live Q&A active right now</p>
                        </div>
                      </Link>
                      {joinedGroups.slice(0, 3).map((g) => (
                        <Link key={g.id} to={g.path} onClick={() => setChatOpen(false)} className="flex items-center gap-3 p-3 hover:bg-sidebar-accent/50 transition-colors">
                          <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-accent-foreground shrink-0">
                            {g.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{g.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{g.notifications > 0 ? `${g.notifications} new messages` : "No new messages"}</p>
                          </div>
                          {g.notifications > 0 && (
                            <span className="shrink-0 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold min-w-[16px] h-[16px] px-1">
                              {g.notifications}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors" title="Sign out">
                <LogOut className="h-4 w-4 text-sidebar-foreground/70" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 w-full py-1">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-accent-foreground">Sign In</p>
                <p className="text-[10px] text-sidebar-foreground/50">Join groups & get updates</p>
              </div>
              <LogIn className="h-4 w-4 text-sidebar-foreground/50" />
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-50 h-12 flex items-center justify-between px-4 glass-panel border-b-white/10">
        <Link to="/" className="flex items-center gap-2 font-bold text-sm text-sidebar-accent-foreground">
          <img src="/logo.jpg" alt="Space Logo" className="h-6 w-6 rounded-lg object-cover" />
          Space
        </Link>
        <div className="flex items-center gap-2">
          <EmergencyButton />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Hash className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-12 z-40 glass-panel">
          <nav className="p-4 space-y-1">
            {channels.map((ch) => {
              const active = location.pathname === ch.to || (ch.to !== "/" && location.pathname.startsWith(ch.to));
              return (
                <Link
                  key={ch.to}
                  to={ch.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <Hash className="h-4 w-4 opacity-60" />
                  {ch.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
