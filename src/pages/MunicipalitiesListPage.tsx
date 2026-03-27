import { Link } from "react-router-dom";
import { Building, Users, Layers, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { municipalities } from "@/data/municipalities";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function MunicipalitiesListPage() {
  const muniList = Object.values(municipalities);
  const tier1 = muniList.filter((m) => !m.tier || m.tier === "Tier 1");
  const tier2 = muniList.filter((m) => m.tier === "Tier 2");
  const tier3 = muniList.filter((m) => m.tier === "Tier 3");

  const renderGrid = (list: typeof muniList) => (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((muni) => (
        <motion.div key={muni.id} variants={item}>
          <Link
            to={`/municipalities/${muni.cityId}`}
            className="block rounded-lg border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Building className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                  {muni.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{muni.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{muni.memberCount.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{muni.totalWards} wards</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{muni.zones.length} zones</span>
              <span className="bg-secondary px-1.5 py-0.5 rounded-full text-[10px]">{muni.type}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Municipalities</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore municipal corporations across India — zones, wards, departments & ground-level officials.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">TIER 1</span>
          Metro Cities
        </h2>
        {renderGrid(tier1)}
      </section>

      {tier2.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="bg-accent/20 text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">TIER 2</span>
            Emerging Cities
          </h2>
          {renderGrid(tier2)}
        </section>
      )}

      {tier3.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">TIER 3</span>
            Heritage & Growth Cities
          </h2>
          {renderGrid(tier3)}
        </section>
      )}
    </div>
  );
}
