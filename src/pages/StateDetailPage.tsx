import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Landmark, Users, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { DiscussionPost } from "@/components/DiscussionPost";
import { OfficialsList } from "@/components/OfficialsList";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { stateOfficials } from "@/data/officials";

const stateData: Record<string, { name: string; description: string; memberCount: number; discussions: any[] }> = {
  maharashtra: {
    name: "Maharashtra",
    description: "Western Indian state, home to Mumbai. Major economic and cultural hub.",
    memberCount: 425000,
    discussions: [
      { author: "Rajesh K.", tag: "discussion" as const, content: "Mumbai's infrastructure projects are progressing well. The coastal road is a game changer.", likes: 234, replies: 45, time: "2h ago" },
      { author: "Priya M.", tag: "suggestion" as const, content: "Pune needs better public transport connectivity to nearby industrial areas.", likes: 189, replies: 32, time: "3h ago" },
    ],
  },
  karnataka: {
    name: "Karnataka",
    description: "South Indian state, home to Bangalore. India's IT and startup capital.",
    memberCount: 312000,
    discussions: [
      { author: "Arun V.", tag: "appreciation" as const, content: "Bangalore's tech corridor development is attracting global companies.", likes: 312, replies: 56, time: "1h ago" },
      { author: "Meena S.", tag: "complaint" as const, content: "Traffic congestion in Bangalore needs immediate attention from the state government.", likes: 456, replies: 89, time: "4h ago" },
    ],
  },
  "tamil-nadu": {
    name: "Tamil Nadu",
    description: "Southern state known for rich Dravidian culture, automobile and IT industries.",
    memberCount: 298000,
    discussions: [
      { author: "Selvi R.", tag: "appreciation" as const, content: "Naan Mudhalvan program is transforming youth employment across the state.", likes: 345, replies: 28, time: "2h ago" },
    ],
  },
  "uttar-pradesh": {
    name: "Uttar Pradesh",
    description: "India's most populous state. Rich in history with diverse economic activities.",
    memberCount: 390000,
    discussions: [
      { author: "Amit S.", tag: "discussion" as const, content: "Expressway network is connecting cities like never before. Economic growth is visible.", likes: 278, replies: 45, time: "3h ago" },
    ],
  },
  "west-bengal": {
    name: "West Bengal",
    description: "Eastern Indian state, home to Kolkata. Cultural and intellectual hub.",
    memberCount: 245000,
    discussions: [
      { author: "Sourav D.", tag: "appreciation" as const, content: "Swasthya Sathi health insurance is a lifesaver for families across the state.", likes: 312, replies: 24, time: "2h ago" },
    ],
  },
  rajasthan: {
    name: "Rajasthan",
    description: "India's largest state by area. Known for heritage, tourism, and desert culture.",
    memberCount: 218000,
    discussions: [
      { author: "Aakash R.", tag: "appreciation" as const, content: "Tourism circuit development is boosting rural employment.", likes: 189, replies: 16, time: "3h ago" },
    ],
  },
  gujarat: {
    name: "Gujarat",
    description: "Western Indian state. Major industrial and economic powerhouse.",
    memberCount: 205000,
    discussions: [
      { author: "Hardik P.", tag: "appreciation" as const, content: "Smart city projects are transforming Ahmedabad's infrastructure.", likes: 234, replies: 16, time: "2h ago" },
    ],
  },
  delhi: {
    name: "Delhi",
    description: "National Capital Territory. Center of Indian politics and governance.",
    memberCount: 245000,
    discussions: [
      { author: "Nisha R.", tag: "discussion" as const, content: "Delhi's education and healthcare models are being studied by other states.", likes: 345, replies: 67, time: "3h ago" },
    ],
  },
};

const fallback = {
  name: "State",
  description: "Explore governance and civic discussions in this state.",
  memberCount: 0,
  discussions: [
    { author: "Citizen", tag: "discussion" as const, content: "Share your thoughts about governance in this state.", likes: 0, replies: 0, time: "just now" },
  ],
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = stateData[id || ""] || { ...fallback, name: id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "State" };
  const [showOfficials, setShowOfficials] = useState(false);
  const officials = stateOfficials[id || ""] || [];

  return (
    <div className="container py-10 space-y-6">
      <Link to="/states" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to States
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Landmark className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{state.name}</h1>
            <button
              onClick={() => setShowOfficials(!showOfficials)}
              className="text-sm text-muted-foreground mt-1 leading-relaxed text-left hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 group"
            >
              <span>{state.description}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground/50 group-hover:text-foreground ${showOfficials ? "rotate-180" : ""}`} />
            </button>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{state.memberCount.toLocaleString()} members</span>
              <JoinGroupButton group={{ id: id || "", name: state.name, type: "state", path: `/states/${id}` }} />
              {officials.length > 0 && (
                <button onClick={() => setShowOfficials(!showOfficials)} className="text-primary hover:underline">
                  {officials.length} officials
                </button>
              )}
            </div>
          </div>
        </div>
        <OfficialsList officials={officials} isOpen={showOfficials} />
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {state.discussions.map((d, i) => (
          <motion.div key={i} variants={item}>
            <DiscussionPost postId={`state-${id}-${i}`} {...d} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
