import { GroupCard } from "@/components/GroupCard";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const parliamentGroups = [
  { id: "lok-sabha", name: "Lok Sabha", memberCount: 543000 },
  { id: "rajya-sabha", name: "Rajya Sabha", memberCount: 312000 },
  { id: "budget-session", name: "Budget Session 2025", memberCount: 189000 },
  { id: "question-hour", name: "Question Hour", memberCount: 145000 },
  { id: "standing-committees", name: "Standing Committees", memberCount: 98000 },
  { id: "joint-sessions", name: "Joint Parliamentary Sessions", memberCount: 76000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ParliamentPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Parliament</h1>
        <p className="text-muted-foreground">Follow parliamentary sessions, debates, and legislative discussions.</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parliamentGroups.map((p) => (
          <motion.div key={p.id} variants={item}>
            <GroupCard
              id={p.id}
              name={p.name}
              type="city"
              memberCount={p.memberCount}
              icon={<Scale className="h-4 w-4" />}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
