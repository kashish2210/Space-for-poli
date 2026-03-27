import { GroupCard } from "@/components/GroupCard";
import { motion } from "framer-motion";

const parties = [
  { id: "bjp", name: "Bharatiya Janata Party", memberCount: 320000 },
  { id: "inc", name: "Indian National Congress", memberCount: 280000 },
  { id: "aap", name: "Aam Aadmi Party", memberCount: 195000 },
  { id: "tmc", name: "All India Trinamool Congress", memberCount: 112000 },
  { id: "dmk", name: "Dravida Munnetra Kazhagam", memberCount: 89000 },
  { id: "sp", name: "Samajwadi Party", memberCount: 78000 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function PartiesPage() {
  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Political Parties</h1>
        <p className="text-muted-foreground">Engage with political parties and share your perspectives.</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parties.map((p) => (
          <motion.div key={p.id} variants={item}>
            <GroupCard id={p.id} name={p.name} type="party" memberCount={p.memberCount} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
