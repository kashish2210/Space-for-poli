import { MinistryCard } from "@/components/MinistryCard";
import { motion } from "framer-motion";

const allMinistries = [
  { id: "health", name: "Ministry of Health & Family Welfare", level: "central" as const, memberCount: 124500, latestUpdate: "New guidelines on mental health awareness released" },
  { id: "education", name: "Ministry of Education", level: "central" as const, memberCount: 98200, latestUpdate: "NEP 2025 draft open for public feedback" },
  { id: "finance", name: "Ministry of Finance", level: "central" as const, memberCount: 156000, latestUpdate: "Budget session highlights published" },
  { id: "it", name: "Ministry of Electronics & IT", level: "central" as const, memberCount: 87400, latestUpdate: "Digital India 3.0 roadmap announced" },
  { id: "defence", name: "Ministry of Defence", level: "central" as const, memberCount: 67800 },
  { id: "agriculture", name: "Ministry of Agriculture", level: "central" as const, memberCount: 91200, latestUpdate: "Kisan Samman Nidhi disbursement update" },
  { id: "railways", name: "Ministry of Railways", level: "central" as const, memberCount: 145000, latestUpdate: "New Vande Bharat routes announced" },
  { id: "home", name: "Ministry of Home Affairs", level: "central" as const, memberCount: 78300 },
  { id: "up-health", name: "Dept. of Health - Uttar Pradesh", level: "state" as const, memberCount: 34500 },
  { id: "mh-urban", name: "Urban Development - Maharashtra", level: "state" as const, memberCount: 28900 },
  { id: "ka-it", name: "IT & BT Dept. - Karnataka", level: "state" as const, memberCount: 42100 },
  { id: "tn-education", name: "School Education - Tamil Nadu", level: "state" as const, memberCount: 31700 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MinistriesPage() {
  const central = allMinistries.filter((m) => m.level === "central");
  const state = allMinistries.filter((m) => m.level === "state");

  return (
    <div className="container py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-1">Ministries & Departments</h1>
        <p className="text-muted-foreground">Engage directly with government ministries at central and state levels.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Central Government</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {central.map((m) => (
            <motion.div key={m.id} variants={item}><MinistryCard {...m} /></motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">State Government</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.map((m) => (
            <motion.div key={m.id} variants={item}><MinistryCard {...m} /></motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
