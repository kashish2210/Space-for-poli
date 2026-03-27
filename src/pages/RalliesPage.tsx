import { RallyCard } from "@/components/RallyCard";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const rallies = [
  { id: "union-budget-2025", title: "Union Budget Discussion 2025", host: "Finance Ministry", listenerCount: 12400, isLive: true, scope: "National", scopeType: "state" as const },
  { id: "education-reform", title: "Education Reform Town Hall", host: "Youth Coalition", listenerCount: 3200, isLive: true, scope: "National", scopeType: "state" as const },
  { id: "mumbai-clean-city", title: "Clean City Initiative - Mumbai", host: "Mumbai Municipal Corp.", listenerCount: 890, isLive: true, scope: "Mumbai", scopeType: "city" as const },
  { id: "karnataka-infra", title: "Karnataka Infrastructure Summit", host: "Karnataka Govt.", listenerCount: 2100, isLive: true, scope: "Karnataka", scopeType: "state" as const },
  { id: "delhi-traffic", title: "Delhi Traffic & Metro Expansion", host: "Delhi Transport Dept.", listenerCount: 1540, isLive: true, scope: "Delhi", scopeType: "city" as const },
  { id: "tamil-nadu-water", title: "Tamil Nadu Water Crisis Response", host: "TN Water Resources", listenerCount: 760, isLive: true, scope: "Tamil Nadu", scopeType: "state" as const },
  { title: "Healthcare Access in Rural India", host: "Health Ministry", listenerCount: 0, isLive: false },
  { title: "Digital Privacy & Data Protection", host: "IT Ministry", listenerCount: 0, isLive: false },
  { title: "Water Conservation Strategy 2025", host: "Jal Shakti Ministry", listenerCount: 0, isLive: false },
  { title: "Bangalore Smart City Town Hall", host: "BBMP", listenerCount: 0, isLive: false, scope: "Bangalore", scopeType: "city" as const },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function RalliesPage() {
  const live = rallies.filter((r) => r.isLive);
  const upcoming = rallies.filter((r) => !r.isLive);

  return (
    <div className="container py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
          <Mic className="h-7 w-7 text-rally" /> Rallies
        </h1>
        <p className="text-muted-foreground">Join live audio rooms for city, state, and national discussions.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-rally opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rally" />
          </span>
          Live Now · {live.length}
        </h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {live.map((r, i) => (
            <motion.div key={i} variants={item}><RallyCard {...r} /></motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((r, i) => (
            <motion.div key={i} variants={item}><RallyCard {...r} /></motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
