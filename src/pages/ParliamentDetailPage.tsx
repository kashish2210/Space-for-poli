import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Scale, Users } from "lucide-react";
import { motion } from "framer-motion";
import { DiscussionPost } from "@/components/DiscussionPost";
import { JoinGroupButton } from "@/components/JoinGroupButton";

const parliamentData: Record<string, { name: string; memberCount: number; discussions: any[] }> = {
  "lok-sabha": {
    name: "Lok Sabha",
    memberCount: 543000,
    discussions: [
      { author: "Amit R.", tag: "discussion" as const, content: "Today's session on the Digital India Bill was very productive. Key amendments proposed.", likes: 567, replies: 89, time: "1h ago" },
      { author: "Sunita P.", tag: "question" as const, content: "When will the revised IT Act be tabled for voting?", likes: 234, replies: 45, time: "3h ago" },
    ],
  },
  "rajya-sabha": {
    name: "Rajya Sabha",
    memberCount: 312000,
    discussions: [
      { author: "Kiran D.", tag: "appreciation" as const, content: "The debate on environmental policy was one of the best sessions this year.", likes: 445, replies: 67, time: "2h ago" },
      { author: "Rahul V.", tag: "suggestion" as const, content: "Rajya Sabha should have more frequent public Q&A sessions.", likes: 312, replies: 54, time: "5h ago" },
    ],
  },
};

const fallback = {
  name: "Parliament Group",
  memberCount: 0,
  discussions: [
    { author: "Citizen", tag: "discussion" as const, content: "Share your thoughts about parliamentary proceedings.", likes: 0, replies: 0, time: "just now" },
  ],
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ParliamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const group = parliamentData[id || ""] || { ...fallback, name: id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Parliament Group" };

  return (
    <div className="container py-10 space-y-6">
      <Link to="/parliament" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Parliament
      </Link>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <Scale className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {group.memberCount.toLocaleString()} members
          </p>
          <JoinGroupButton group={{ id: id || "", name: group.name, type: "parliament", path: `/parliament/${id}` }} className="mt-1" />
        </div>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {group.discussions.map((d, i) => (
          <motion.div key={i} variants={item}>
            <DiscussionPost {...d} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
