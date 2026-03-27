import { GroupCard } from "@/components/GroupCard";
import { TagBadge, type TagVariant } from "@/components/TagBadge";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ThumbsUp, Share2, MessageSquare } from "lucide-react";

const cities = [
  { id: "delhi", name: "New Delhi", memberCount: 245000 },
  { id: "mumbai", name: "Mumbai", memberCount: 198000 },
  { id: "bangalore", name: "Bangalore", memberCount: 167000 },
  { id: "chennai", name: "Chennai", memberCount: 112000 },
  { id: "kolkata", name: "Kolkata", memberCount: 95000 },
  { id: "hyderabad", name: "Hyderabad", memberCount: 134000 },
  { id: "pune", name: "Pune", memberCount: 89000 },
  { id: "ahmedabad", name: "Ahmedabad", memberCount: 76000 },
  { id: "jaipur", name: "Jaipur", memberCount: 65000 },
];

interface CrossCityPost {
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

const crossCityPosts: CrossCityPost[] = [
  { author: "Rekha M.", tag: "appreciation", content: "My child's government school in Dwarka now has smart boards and AC classrooms. Incredible transformation!", likes: 389, replies: 24, time: "1h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Education", ministryId: "delhi-education" },
  { author: "Pooja D.", tag: "appreciation", content: "Mumbai Metro Line 3 trial run was fantastic! This will change how millions commute daily.", likes: 456, replies: 34, time: "1h ago", city: "Mumbai", cityId: "mumbai", ministry: "Urban Development", ministryId: "mh-urban" },
  { author: "Deepak R.", tag: "appreciation", content: "The new startup policy is exactly what Bangalore needed. Tax holidays will attract global companies.", likes: 378, replies: 26, time: "1h ago", city: "Bangalore", cityId: "bangalore", ministry: "IT & BT Dept.", ministryId: "ka-it" },
  { author: "Nisha R.", tag: "discussion", content: "Should Delhi prioritize expanding the metro or improving bus connectivity? Both need investment.", likes: 345, replies: 67, time: "3h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
  { author: "Selvi R.", tag: "appreciation", content: "Naan Mudhalvan program got my son a job at TCS right after college. Thank you Tamil Nadu!", likes: 345, replies: 28, time: "2h ago", city: "Chennai", cityId: "chennai", ministry: "School Education", ministryId: "tn-education" },
  { author: "Neha T.", tag: "complaint", content: "Water supply in East Delhi is irregular. Contaminated water is causing health issues in our area.", likes: 267, replies: 38, time: "4h ago", city: "New Delhi", cityId: "delhi", ministry: "Delhi Jal Board", ministryId: "delhi-water" },
  { author: "Rajesh P.", tag: "complaint", content: "Coastal road project causing massive waterlogging in Worli. Drainage planning was clearly inadequate.", likes: 289, replies: 45, time: "6h ago", city: "Mumbai", cityId: "mumbai", ministry: "Urban Development", ministryId: "mh-urban" },
  { author: "Sourav D.", tag: "appreciation", content: "Swasthya Sathi health insurance saved us ₹2 lakh on my mother's surgery. Great initiative!", likes: 312, replies: 24, time: "2h ago", city: "Kolkata", cityId: "kolkata", ministry: "Health Dept.", ministryId: "wb-health" },
  { author: "Srinivas R.", tag: "appreciation", content: "New IT Tower in Kokapet is world-class. Hyderabad is truly becoming a global tech hub.", likes: 345, replies: 22, time: "1h ago", city: "Hyderabad", cityId: "hyderabad", ministry: "IT Dept.", ministryId: "ts-it" },
  { author: "Snehal M.", tag: "appreciation", content: "Pune Metro Phase 1 has reduced my commute from 90 minutes to 30. Life-changing!", likes: 289, replies: 18, time: "2h ago", city: "Pune", cityId: "pune", ministry: "Urban Development", ministryId: "mh-pune-urban" },
  { author: "Hardik P.", tag: "appreciation", content: "Smart city initiative has transformed the riverfront area. Beautiful walking paths and greenery!", likes: 234, replies: 16, time: "2h ago", city: "Ahmedabad", cityId: "ahmedabad", ministry: "Urban Development", ministryId: "gj-urban" },
  { author: "Aakash R.", tag: "appreciation", content: "Night tourism circuit in Jaipur is magical. Amer Fort lit up at night is unforgettable!", likes: 312, replies: 22, time: "1h ago", city: "Jaipur", cityId: "jaipur", ministry: "Tourism Dept.", ministryId: "rj-tourism" },
  { author: "Sanjay M.", tag: "suggestion", content: "DTC app should show real-time bus locations. Currently the ETA feature is completely unreliable.", likes: 203, replies: 19, time: "5h ago", city: "New Delhi", cityId: "delhi", ministry: "Dept. of Transport", ministryId: "delhi-transport" },
  { author: "Lakshmi V.", tag: "complaint", content: "BBMP garbage collection in Whitefield is inconsistent. Bins overflow for days sometimes.", likes: 189, replies: 27, time: "3h ago", city: "Bangalore", cityId: "bangalore", ministry: "Urban Development", ministryId: "ka-urban" },
  { author: "Priya N.", tag: "discussion", content: "Should Tamil Nadu follow NEET for medical admissions or push for state-level exams?", likes: 456, replies: 89, time: "6h ago", city: "Chennai", cityId: "chennai", ministry: "School Education", ministryId: "tn-education" },
  { author: "Ritika S.", tag: "complaint", content: "Waterlogging in Salt Lake after every rain. Drainage infrastructure needs urgent attention.", likes: 234, replies: 35, time: "5h ago", city: "Kolkata", cityId: "kolkata", ministry: "Urban Development", ministryId: "wb-urban" },
  { author: "Kavita J.", tag: "suggestion", content: "Jaipur needs a heritage conservation fund. Many havelis in the walled city are crumbling.", likes: 267, replies: 31, time: "5h ago", city: "Jaipur", cityId: "jaipur", ministry: "Tourism Dept.", ministryId: "rj-tourism" },
  { author: "Vikram T.", tag: "complaint", content: "Pune's air quality is deteriorating rapidly. Construction dust and traffic fumes are major concerns.", likes: 234, replies: 29, time: "5h ago", city: "Pune", cityId: "pune", ministry: "Environment Dept.", ministryId: "mh-pune-env" },
];

const allTags: TagVariant[] = ["appreciation", "complaint", "suggestion", "question", "discussion", "update", "announcement"];
const allCityNames = cities.map((c) => c.name);
const allDeptNames = [...new Set(crossCityPosts.map((p) => p.ministry))];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function CitiesPage() {
  const [activeCity, setActiveCity] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<TagVariant | "all">("all");
  const [activeDept, setActiveDept] = useState<string>("all");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [copiedPost, setCopiedPost] = useState<number | null>(null);

  const filteredPosts = crossCityPosts.filter((p) => {
    const cityMatch = activeCity === "all" || p.city === activeCity;
    const tagMatch = activeTag === "all" || p.tag === activeTag;
    const deptMatch = activeDept === "all" || p.ministry === activeDept;
    return cityMatch && tagMatch && deptMatch;
  });

  const visibleDepts = activeCity === "all"
    ? allDeptNames
    : [...new Set(crossCityPosts.filter((p) => p.city === activeCity).map((p) => p.ministry))];

  const availableTags = allTags.filter((t) => crossCityPosts.some((p) => p.tag === t));

  const toggleLike = (idx: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const sharePost = (idx: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPost(idx);
    setTimeout(() => setCopiedPost(null), 2000);
  };

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">City Groups</h1>
        <p className="text-muted-foreground">Connect with fellow citizens and local authorities in your city.</p>
      </div>

      {/* City Cards Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <motion.div key={c.id} variants={item}>
            <GroupCard id={c.id} name={c.name} type="city" memberCount={c.memberCount} />
          </motion.div>
        ))}
      </motion.div>

      {/* Cross-City Discussion Feed */}
      <section>
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" /> Voices Across Cities
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Filter discussions across all cities by department and tag.</p>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          {/* City filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCity("all"); setActiveDept("all"); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCity === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              All Cities
            </button>
            {allCityNames.map((c) => (
              <button
                key={c}
                onClick={() => { setActiveCity(c); setActiveDept("all"); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeCity === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {c}
              </button>
            ))}
          </div>
          {/* Department filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDept("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeDept === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              All Departments
            </button>
            {visibleDepts.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeDept === d ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {d}
              </button>
            ))}
          </div>
          {/* Tag filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag("all")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${activeTag === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              All Tags
            </button>
            {availableTags.map((t) => (
              <button key={t} onClick={() => setActiveTag(t)}>
                <TagBadge variant={t} label={t.charAt(0).toUpperCase() + t.slice(1)} className={`cursor-pointer ${activeTag === t ? "ring-2 ring-ring ring-offset-1" : "opacity-70 hover:opacity-100"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No discussions match the current filters.</p>
          ) : (
            filteredPosts.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="rounded-lg border bg-card p-4 hover:border-accent/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {post.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-card-foreground">{post.author}</span>
                        <TagBadge variant={post.tag} label={post.tag.charAt(0).toUpperCase() + post.tag.slice(1)} />
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-card-foreground leading-relaxed mb-3">{post.content}</p>

                  <Link
                    to={`/ministries/${post.ministryId}`}
                    className="inline-flex items-center gap-2 rounded-md border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors mb-3"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{post.ministry}</span>
                    <span className="text-muted-foreground">·</span>
                    <Link to={`/cities/${post.cityId}`} className="text-accent hover:underline" onClick={(e) => e.stopPropagation()}>
                      {post.city}
                    </Link>
                  </Link>

                  <div className="flex items-center gap-4 pt-2 border-t">
                    <button
                      onClick={() => toggleLike(i)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedPosts.has(i) ? "text-accent" : "text-muted-foreground hover:text-card-foreground"}`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${likedPosts.has(i) ? "fill-accent" : ""}`} />
                      {post.likes + (likedPosts.has(i) ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />{post.replies} replies
                    </span>
                    <button
                      onClick={() => sharePost(i, post.content)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-card-foreground transition-colors ml-auto"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      {copiedPost === i ? "Copied!" : "Share"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
