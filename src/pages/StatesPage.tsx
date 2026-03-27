import { GroupCard } from "@/components/GroupCard";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";

const states = [
  { id: "maharashtra", name: "Maharashtra", memberCount: 425000 },
  { id: "uttar-pradesh", name: "Uttar Pradesh", memberCount: 390000 },
  { id: "karnataka", name: "Karnataka", memberCount: 312000 },
  { id: "tamil-nadu", name: "Tamil Nadu", memberCount: 298000 },
  { id: "west-bengal", name: "West Bengal", memberCount: 245000 },
  { id: "rajasthan", name: "Rajasthan", memberCount: 218000 },
  { id: "gujarat", name: "Gujarat", memberCount: 205000 },
  { id: "madhya-pradesh", name: "Madhya Pradesh", memberCount: 189000 },
  { id: "kerala", name: "Kerala", memberCount: 176000 },
  { id: "delhi", name: "Delhi", memberCount: 245000 },
  { id: "punjab", name: "Punjab", memberCount: 156000 },
  { id: "bihar", name: "Bihar", memberCount: 167000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StatesPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">State Groups</h1>
        <p className="text-muted-foreground">Join your state's community to discuss local governance and policy.</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s) => (
          <motion.div key={s.id} variants={item}>
            <GroupCard
              id={s.id}
              name={s.name}
              type="city"
              memberCount={s.memberCount}
              icon={<Landmark className="h-4 w-4" />}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
