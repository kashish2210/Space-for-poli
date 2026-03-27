import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Shield, Building2, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { municipalities } from "@/data/municipalities";
import { OfficialsList } from "@/components/OfficialsList";
import { JoinGroupButton } from "@/components/JoinGroupButton";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function WardDetailPage() {
  const { cityId, wardId } = useParams();
  const muni = municipalities[cityId || ""];
  const [showOfficials, setShowOfficials] = useState(true);

  // Find ward across zones
  let ward = null;
  let zone = null;
  if (muni) {
    for (const z of muni.zones) {
      const w = z.wards.find((w) => w.id === wardId);
      if (w) { ward = w; zone = z; break; }
    }
  }

  if (!muni || !ward || !zone) {
    return (
      <div className="container py-8">
        <Link to="/cities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cities
        </Link>
        <p className="mt-8 text-center text-muted-foreground">Ward not found.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Link to={`/municipalities/${cityId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to {muni.name}
      </Link>

      {/* Ward header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0 text-lg font-bold">
            {ward.number}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-card-foreground">Ward {ward.number} — {ward.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{zone.name} · {muni.name}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />Pop. {ward.population.toLocaleString()}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ward.area} sq km</span>
              <JoinGroupButton group={{ id: `ward-${ward.id}`, name: `Ward ${ward.number} - ${ward.name}`, type: "city", path: `/municipalities/${cityId}/ward/${ward.id}` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Councillor */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Ward Councillor
        </h2>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {ward.councillor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-card-foreground">{ward.councillor.name}</h3>
              <p className="text-sm text-muted-foreground">{ward.councillor.designation}</p>
              <p className="text-xs text-muted-foreground/70">{ward.councillor.department}</p>
              <div className="flex items-center gap-3 mt-2">
                {ward.councillor.phone && (
                  <a href={`tel:${ward.councillor.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {ward.councillor.phone}
                  </a>
                )}
                {ward.councillor.email && (
                  <a href={`mailto:${ward.councillor.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {ward.councillor.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ward Officials */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Ground-Level Officials
        </h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
          {ward.officials.map((o, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
            >
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground shrink-0">
                {o.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{o.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{o.designation}</p>
                {o.department && <p className="text-[10px] text-muted-foreground/70 truncate">{o.department}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {o.phone && (
                  <a href={`tel:${o.phone}`} className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors" title={o.phone}>
                    <Phone className="h-3 w-3 text-muted-foreground" />
                  </a>
                )}
                {o.email && (
                  <a href={`mailto:${o.email}`} className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors" title={o.email}>
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Zone context */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Other Wards in {zone.name}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {zone.wards.filter(w => w.id !== wardId).map((w) => (
            <Link
              key={w.id}
              to={`/municipalities/${cityId}/ward/${w.id}`}
              className="rounded-md border bg-card p-3 hover:bg-secondary/50 transition-colors group"
            >
              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                Ward {w.number} — {w.name}
              </h4>
              <p className="text-[10px] text-muted-foreground mt-1">
                Pop. {w.population.toLocaleString()} · {w.councillor.name}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
