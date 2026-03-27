import { motion } from "framer-motion";
import { MinistryCard } from "@/components/MinistryCard";
import { RallyCard } from "@/components/RallyCard";
import { GroupCard } from "@/components/GroupCard";
import { TagBadge, type TagVariant } from "@/components/TagBadge";
import { DiscussionPost } from "@/components/DiscussionPost";
import { ArrowRight, Megaphone, Building2, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, Bookmark, Hash, TrendingUp, ThumbsUp, MessageSquare, Landmark, Scale, Search, Bell, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useJoinedGroups } from "@/contexts/JoinedGroupsContext";

const trendingPosts = [
  { content: "PM Modi's vision for Viksit Bharat 2047 is setting clear development goals.", author: "Vikram S.", tag: "appreciation" as TagVariant, likes: 1234, replies: 189, time: "1h ago", source: "BJP", sourceLink: "/parties/bjp" },
  { content: "Delhi's education model is being studied by 5 other states. Proof that governance works!", author: "Neha T.", tag: "appreciation" as TagVariant, likes: 967, replies: 142, time: "2h ago", source: "AAP", sourceLink: "/parties/aap" },
  { content: "Mumbai Metro Line 3 trial run was fantastic! This will change how millions commute.", author: "Pooja D.", tag: "appreciation" as TagVariant, likes: 856, replies: 98, time: "1h ago", source: "Mumbai", sourceLink: "/cities/mumbai" },
  { content: "Should Delhi prioritize expanding the metro or improving bus connectivity?", author: "Nisha R.", tag: "discussion" as TagVariant, likes: 723, replies: 167, time: "3h ago", source: "New Delhi", sourceLink: "/cities/delhi" },
  { content: "NEP 2025 draft is open for public feedback — everyone should participate!", author: "Ankit M.", tag: "announcement" as TagVariant, likes: 645, replies: 78, time: "4h ago", source: "Education Ministry", sourceLink: "/ministries/education" },
];

const ministries = [
  { id: "health", name: "Ministry of Health & Family Welfare", level: "central" as const, memberCount: 124500, latestUpdate: "New guidelines on mental health awareness released" },
  { id: "education", name: "Ministry of Education", level: "central" as const, memberCount: 98200, latestUpdate: "NEP 2025 draft open for public feedback" },
  { id: "finance", name: "Ministry of Finance", level: "central" as const, memberCount: 156000, latestUpdate: "Budget session highlights published" },
  { id: "it", name: "Ministry of Electronics & IT", level: "central" as const, memberCount: 87400, latestUpdate: "Digital India 3.0 roadmap announced" },
];

const cities = [
  { id: "delhi", name: "New Delhi", memberCount: 245000 },
  { id: "mumbai", name: "Mumbai", memberCount: 198000 },
  { id: "bangalore", name: "Bangalore", memberCount: 167000 },
  { id: "chennai", name: "Chennai", memberCount: 112000 },
];

const parties = [
  { id: "bjp", name: "Bharatiya Janata Party", memberCount: 320000 },
  { id: "inc", name: "Indian National Congress", memberCount: 280000 },
  { id: "aap", name: "Aam Aadmi Party", memberCount: 195000 },
];

const states = [
  { id: "maharashtra", name: "Maharashtra", memberCount: 425000 },
  { id: "karnataka", name: "Karnataka", memberCount: 312000 },
  { id: "tamil-nadu", name: "Tamil Nadu", memberCount: 298000 },
  { id: "uttar-pradesh", name: "Uttar Pradesh", memberCount: 390000 },
];

const parliamentGroups = [
  { id: "lok-sabha", name: "Lok Sabha", memberCount: 543000 },
  { id: "rajya-sabha", name: "Rajya Sabha", memberCount: 312000 },
  { id: "budget-session", name: "Budget Session 2025", memberCount: 189000 },
];

const liveRallies = [
  { id: "union-budget-2025", title: "Union Budget Discussion 2025", host: "Finance Ministry", listenerCount: 12400, isLive: true, scope: "National", scopeType: "state" as const },
  { id: "mumbai-clean-city", title: "Clean City Initiative - Mumbai", host: "Mumbai Municipal Corp.", listenerCount: 890, isLive: true, scope: "Mumbai", scopeType: "city" as const },
  { id: "karnataka-infra", title: "Karnataka Infrastructure Summit", host: "Karnataka Govt.", listenerCount: 2100, isLive: true, scope: "Karnataka", scopeType: "state" as const },
];

export interface CityPost {
  author: string;
  tag: TagVariant;
  content: string;
  likes: number;
  replies: number;
  time: string;
  city: string;
  cityId: string;
  ministry: string;
  ministryId: string;
}

export const aggregatedCityPosts: CityPost[] = [
  { author: "Rekha M.", tag: "appreciation", content: "My child's government school in Dwarka now has smart boards and AC classrooms. Incredible transformation!", likes: 389, replies: 24, time: "1h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Education", ministryId: "delhi-education" },
  { author: "Pooja D.", tag: "appreciation", content: "Mumbai Metro Line 3 trial run was fantastic! This will change how millions commute daily.", likes: 456, replies: 34, time: "1h ago", city: "Mumbai", cityId: "mumbai", ministry: "Urban Development", ministryId: "mh-urban" },
  { author: "Deepak R.", tag: "appreciation", content: "The new startup policy is exactly what Bangalore needed. Tax holidays will attract global companies.", likes: 378, replies: 26, time: "1h ago", city: "Bangalore", cityId: "bangalore", ministry: "IT & BT Dept.", ministryId: "ka-it" },
  { author: "Nisha R.", tag: "discussion", content: "Should Delhi prioritize expanding the metro or improving bus connectivity? Both need investment.", likes: 345, replies: 67, time: "3h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
  { author: "Neha T.", tag: "complaint", content: "Water supply in East Delhi is irregular. Contaminated water is causing health issues in our area.", likes: 267, replies: 38, time: "4h ago", city: "New Delhi", cityId: "delhi", ministry: "Delhi Jal Board", ministryId: "delhi-water" },
  { author: "Selvi R.", tag: "appreciation", content: "Naan Mudhalvan program got my son a job at TCS right after college. Thank you Tamil Nadu!", likes: 345, replies: 28, time: "2h ago", city: "Chennai", cityId: "chennai", ministry: "School Education", ministryId: "tn-education" },
  { author: "Rajesh P.", tag: "complaint", content: "Coastal road project causing massive waterlogging in Worli. Drainage planning was clearly inadequate.", likes: 289, replies: 45, time: "6h ago", city: "Mumbai", cityId: "mumbai", ministry: "Urban Development", ministryId: "mh-urban" },
  { author: "Srinivas R.", tag: "appreciation", content: "New IT Tower in Kokapet is world-class. Hyderabad is truly becoming a global tech hub.", likes: 345, replies: 22, time: "1h ago", city: "Hyderabad", cityId: "hyderabad", ministry: "IT Dept.", ministryId: "ts-it" },
  { author: "Sanjay M.", tag: "suggestion", content: "DTC app should show real-time bus locations. Currently the ETA feature is completely unreliable.", likes: 203, replies: 19, time: "5h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
  { author: "Priya N.", tag: "discussion", content: "Should Tamil Nadu follow NEET for medical admissions or push for state-level exams?", likes: 456, replies: 89, time: "6h ago", city: "Chennai", cityId: "chennai", ministry: "School Education", ministryId: "tn-education" },
  { author: "Lakshmi V.", tag: "complaint", content: "BBMP garbage collection in Whitefield is inconsistent. Bins overflow for days sometimes.", likes: 189, replies: 27, time: "3h ago", city: "Bangalore", cityId: "bangalore", ministry: "Urban Development", ministryId: "ka-urban" },
  { author: "Sourav D.", tag: "appreciation", content: "Swasthya Sathi health insurance saved us ₹2 lakh on my mother's surgery. Great initiative!", likes: 312, replies: 24, time: "2h ago", city: "Kolkata", cityId: "kolkata", ministry: "Health Dept.", ministryId: "wb-health" },
];

const allTags: TagVariant[] = ["appreciation", "complaint", "suggestion", "question", "discussion", "update", "announcement"];
const allCityNames = [...new Set(aggregatedCityPosts.map((p) => p.city))];
const allDeptNames = [...new Set(aggregatedCityPosts.map((p) => p.ministry))];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

const searchableItems = [
  { name: "Ministry of Health & Family Welfare", path: "/ministries/health", type: "Ministry" },
  { name: "Ministry of Education", path: "/ministries/education", type: "Ministry" },
  { name: "Ministry of Finance", path: "/ministries/finance", type: "Ministry" },
  { name: "Ministry of Electronics & IT", path: "/ministries/it", type: "Ministry" },
  { name: "Ministry of Defence", path: "/ministries/defence", type: "Ministry" },
  { name: "Ministry of Agriculture", path: "/ministries/agriculture", type: "Ministry" },
  { name: "Ministry of Railways", path: "/ministries/railways", type: "Ministry" },
  { name: "Ministry of Home Affairs", path: "/ministries/home", type: "Ministry" },
  { name: "New Delhi", path: "/cities/delhi", type: "City" },
  { name: "Mumbai", path: "/cities/mumbai", type: "City" },
  { name: "Bangalore", path: "/cities/bangalore", type: "City" },
  { name: "Chennai", path: "/cities/chennai", type: "City" },
  { name: "Kolkata", path: "/cities/kolkata", type: "City" },
  { name: "Hyderabad", path: "/cities/hyderabad", type: "City" },
  { name: "Pune", path: "/cities/pune", type: "City" },
  { name: "Maharashtra", path: "/states/maharashtra", type: "State" },
  { name: "Karnataka", path: "/states/karnataka", type: "State" },
  { name: "Tamil Nadu", path: "/states/tamil-nadu", type: "State" },
  { name: "Uttar Pradesh", path: "/states/uttar-pradesh", type: "State" },
  { name: "Delhi", path: "/states/delhi", type: "State" },
  { name: "Rajasthan", path: "/states/rajasthan", type: "State" },
  { name: "Gujarat", path: "/states/gujarat", type: "State" },
  { name: "Bharatiya Janata Party", path: "/parties/bjp", type: "Party" },
  { name: "Indian National Congress", path: "/parties/inc", type: "Party" },
  { name: "Aam Aadmi Party", path: "/parties/aap", type: "Party" },
  { name: "Lok Sabha", path: "/parliament/lok-sabha", type: "Parliament" },
  { name: "Rajya Sabha", path: "/parliament/rajya-sabha", type: "Parliament" },
  { name: "Dept. of Education (Delhi)", path: "/ministries/delhi-education", type: "Dept" },
  { name: "Dept. of Health (Delhi)", path: "/ministries/delhi-health", type: "Dept" },
  { name: "Dept. of Transport (Delhi)", path: "/ministries/delhi-transport", type: "Dept" },
  { name: "Delhi Jal Board", path: "/ministries/delhi-water", type: "Dept" },
];

const Index = () => {
  const navigate = useNavigate();
  const { joinedGroups, totalNotifications } = useJoinedGroups();
  const [activeCity, setActiveCity] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<TagVariant | "all">("all");
  const [activeDept, setActiveDept] = useState<string>("all");
  const [votes, setVotes] = useState<Record<number, "up" | "down" | null>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = searchQuery.length >= 2
    ? searchableItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const filteredPosts = aggregatedCityPosts.filter((p) => {
    const cityMatch = activeCity === "all" || p.city === activeCity;
    const tagMatch = activeTag === "all" || p.tag === activeTag;
    const deptMatch = activeDept === "all" || p.ministry === activeDept;
    return cityMatch && tagMatch && deptMatch;
  });

  const visibleDepts = activeCity === "all"
    ? allDeptNames
    : [...new Set(aggregatedCityPosts.filter((p) => p.city === activeCity).map((p) => p.ministry))];

  const availableTags = allTags.filter((t) => aggregatedCityPosts.some((p) => p.tag === t));

  const toggleVote = (idx: number, dir: "up" | "down") => {
    setVotes((prev) => ({ ...prev, [idx]: prev[idx] === dir ? null : dir }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-white/10 glass-panel relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        <div className="container py-8 relative">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">welcome</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight mb-2 text-foreground">
              Speak directly to your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Government</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Space connects citizens with ministries, city authorities, and political parties. 
              Share appreciation, raise complaints, suggest improvements — and join live rallies.
            </p>
            <div className="flex gap-2">
              <Link
                to="/ministries"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Explore Ministries <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/rallies"
                className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <Megaphone className="h-4 w-4" /> Join a Rally
              </Link>
            </div>
            {/* Search bar */}
            <div className="relative mt-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ministries, cities, states, parties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-white/10 glass-panel shadow-lg z-50 overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onMouseDown={() => { navigate(r.path); setSearchQuery(""); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-16 shrink-0">{r.type}</span>
                      <span className="text-sm text-popover-foreground truncate">{r.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-6 space-y-8">
        {/* Your Groups — Quick access */}
        {joinedGroups.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4" /> Your Groups
                {totalNotifications > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground min-w-[18px]">
                    {totalNotifications}
                  </span>
                )}
              </h2>
            </div>
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2">
              {joinedGroups.map((g) => (
                <motion.div key={g.id} variants={item}>
                  <Link
                    to={g.path}
                    className="relative inline-flex items-center gap-2 rounded-lg text-sm font-medium text-card-foreground glass-button hover:border-primary/40 group"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{g.type}</span>
                    <span className="truncate max-w-[140px]">{g.name}</span>
                    {g.notifications > 0 && (
                      <span className="flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold min-w-[16px] h-4 px-1">
                        {g.notifications}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Live Rallies */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-rally opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rally" />
              </span>
              Live Now
            </h2>
            <Link to="/rallies" className="text-xs text-primary font-medium hover:underline">View all</Link>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2">
            {liveRallies.map((rally, i) => (
              <motion.div key={i} variants={item}>
                <RallyCard {...rally} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Trending
            </h2>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {trendingPosts.map((t, i) => (
              <motion.div key={i} variants={item}>
                <div className="glass-card rounded-lg p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <TagBadge variant={t.tag} label={t.tag.charAt(0).toUpperCase() + t.tag.slice(1)} />
                    <span className="text-[11px] text-muted-foreground ml-auto">{t.time}</span>
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed line-clamp-2 mb-3 flex-1">{t.content}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <Link to={t.sourceLink} className="text-[11px] font-medium text-primary hover:underline truncate max-w-[50%]">{t.source}</Link>
                    <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><ThumbsUp className="h-3 w-3" />{t.likes}</span>
                      <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{t.replies}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1">{t.author}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Ministries */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ministries</h2>
            <Link to="/ministries" className="text-xs text-primary font-medium hover:underline">View all</Link>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ministries.map((m) => (
              <motion.div key={m.id} variants={item}>
                <MinistryCard {...m} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* City Voices Feed */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Feed
            </h2>
            <Link to="/cities" className="text-xs text-primary font-medium hover:underline">All Cities</Link>
          </div>

          {/* Filters — Reddit/Discord tab style */}
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setActiveCity("all"); setActiveDept("all"); }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${activeCity === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All Cities
              </button>
              {allCityNames.map((c) => (
                <button
                  key={c}
                  onClick={() => { setActiveCity(c); setActiveDept("all"); }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${activeCity === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveDept("all")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${activeDept === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All Depts
              </button>
              {visibleDepts.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDept(d)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${activeDept === d ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTag("all")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${activeTag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                All Tags
              </button>
              {availableTags.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)}>
                  <TagBadge variant={t} label={t.charAt(0).toUpperCase() + t.slice(1)} className={`cursor-pointer ${activeTag === t ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "opacity-60 hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Posts — Reddit style with vote rail */}
          <div className="space-y-1 rounded-lg overflow-hidden">
            {filteredPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No posts match the current filters.</p>
            ) : (
              filteredPosts.map((post, i) => {
                const pId = `${post.cityId}-${post.ministryId}-${post.author.replace(/[^a-zA-Z0-9]/g, '')}-${i}`;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <DiscussionPost
                      postId={pId}
                      author={post.author}
                      tag={post.tag}
                      content={post.content}
                      likes={post.likes}
                      replies={post.replies}
                      time={post.time}
                    >
                      <Link
                        to={`/ministries/${post.ministryId}`}
                        className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Building2 className="h-3 w-3" />
                        {post.ministry}
                      </Link>
                      <Link
                        to={`/cities/${post.cityId}`}
                        className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors ml-1.5"
                      >
                        {post.city}
                      </Link>
                    </DiscussionPost>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Groups sidebar — Reddit-style */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <section className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">City Groups</h2>
              <Link to="/cities" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {cities.map((c) => (
                <GroupCard key={c.id} id={c.id} name={c.name} type="city" memberCount={c.memberCount} />
              ))}
            </div>
          </section>
          <section className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">State Groups</h2>
              <Link to="/states" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {states.map((s) => (
                <GroupCard key={s.id} id={s.id} name={s.name} type="city" memberCount={s.memberCount} icon={<Landmark className="h-4 w-4" />} />
              ))}
            </div>
          </section>
          <section className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Political Parties</h2>
              <Link to="/parties" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {parties.map((p) => (
                <GroupCard key={p.id} id={p.id} name={p.name} type="party" memberCount={p.memberCount} />
              ))}
            </div>
          </section>
          <section className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Parliament</h2>
              <Link to="/parliament" className="text-xs text-primary font-medium hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {parliamentGroups.map((p) => (
                <GroupCard key={p.id} id={p.id} name={p.name} type="city" memberCount={p.memberCount} icon={<Scale className="h-4 w-4" />} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
