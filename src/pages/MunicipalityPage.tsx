import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Users, ChevronDown, ChevronRight, Layers, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { municipalities } from "@/data/municipalities";
import { OfficialsList } from "@/components/OfficialsList";
import { JoinGroupButton } from "@/components/JoinGroupButton";
import { useMunicipalityRoles } from "@/hooks/useMunicipalityRoles";
import { RoleRequestPanel } from "@/components/municipality/RoleRequestPanel";
import { AdminRequestsPanel } from "@/components/municipality/AdminRequestsPanel";
import { AnnouncementsPanel } from "@/components/municipality/AnnouncementsPanel";
import { PressQuestionsPanel } from "@/components/municipality/PressQuestionsPanel";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function MunicipalityPage() {
  const { cityId } = useParams();
  const muni = municipalities[cityId || ""];
  const [showTopOfficials, setShowTopOfficials] = useState(false);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const muniId = muni?.id || cityId || "";
  const {
    isOfficial, isAdmin, isJournalist,
    hasRole, hasPendingRequest,
    pendingRequests, announcements, pressQuestions,
    requestRole, approveRequest, rejectRequest,
    postAnnouncement, submitPressQuestion,
  } = useMunicipalityRoles(muniId);

  if (!muni) {
    return (
      <div className="container py-8">
        <Link to="/cities" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cities
        </Link>
        <p className="mt-8 text-center text-muted-foreground">Municipality not found.</p>
      </div>
    );
  }

  const topOfficials = [muni.mayor, muni.commissioner];

  return (
    <div className="container py-8 space-y-8">
      <Link to={`/cities/${muni.cityId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to {muni.cityId.charAt(0).toUpperCase() + muni.cityId.slice(1)}
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-card-foreground">{muni.name}</h1>
            <button
              onClick={() => setShowTopOfficials(!showTopOfficials)}
              className="text-sm text-muted-foreground mt-1 leading-relaxed text-left hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 group"
            >
              <span>{muni.description}</span>
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform text-muted-foreground/50 group-hover:text-foreground ${showTopOfficials ? "rotate-180" : ""}`} />
            </button>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{muni.memberCount.toLocaleString()} members</span>
              <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{muni.totalWards} wards</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{muni.zones.length} zones</span>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{muni.type} · Est. {muni.established}</span>
              <JoinGroupButton group={{ id: `muni-${muni.id}`, name: muni.name, type: "city", path: `/municipalities/${muni.cityId}` }} />
            </div>
          </div>
        </div>
        <OfficialsList officials={topOfficials} isOpen={showTopOfficials} />
      </motion.div>

      {/* Role-Based Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RoleRequestPanel
          municipalityId={muniId}
          hasPendingRequest={hasPendingRequest}
          hasRole={hasRole}
          onSubmit={(data) => requestRole.mutate(data)}
          isSubmitting={requestRole.isPending}
        />
        {isAdmin && (
          <AdminRequestsPanel
            requests={pendingRequests}
            onApprove={(id) => approveRequest.mutate(id)}
            onReject={(id) => rejectRequest.mutate(id)}
            isLoading={approveRequest.isPending || rejectRequest.isPending}
          />
        )}
      </div>

      {/* Announcements & Press */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AnnouncementsPanel
          announcements={announcements}
          canPost={isOfficial}
          onPost={(data) => postAnnouncement.mutate(data)}
          isPosting={postAnnouncement.isPending}
        />
        <PressQuestionsPanel
          questions={pressQuestions}
          canAsk={isJournalist}
          canAnswer={isOfficial}
          onAsk={(q) => submitPressQuestion.mutate(q)}
          isSubmitting={submitPressQuestion.isPending}
        />
      </div>

      {/* Municipal Departments */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Municipal Functions & Departments
        </h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2">
          {muni.departments.map((dept) => (
            <motion.div key={dept.id} variants={item} className="rounded-lg border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-card-foreground truncate">{dept.name}</h3>
                  <p className="text-[11px] text-muted-foreground truncate">{dept.description}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${expandedDept === dept.id ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedDept === dept.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                      <div className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {dept.head.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{dept.head.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{dept.head.designation}</p>
                        </div>
                        <span className="text-[9px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded">HEAD</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Key Functions</p>
                        <ul className="space-y-1">
                          {dept.functions.map((fn, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span> {fn}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Zones & Wards */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" /> Zones & Wards
        </h2>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {muni.zones.map((zone) => (
            <motion.div key={zone.id} variants={item} className="rounded-lg border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-md bg-accent/20 flex items-center justify-center text-accent-foreground shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-card-foreground">{zone.name}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Pop. {zone.population.toLocaleString()} · {zone.wards.length} wards · Zonal Officer: {zone.zonalOfficer.name}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${expandedZone === zone.id ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedZone === zone.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                      <div className="flex items-center gap-3 rounded-md bg-secondary/50 px-3 py-2.5">
                        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent-foreground shrink-0">
                          {zone.zonalOfficer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-card-foreground truncate">{zone.zonalOfficer.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{zone.zonalOfficer.designation}</p>
                        </div>
                        <span className="text-[9px] font-semibold bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded">ZONAL HEAD</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {zone.wards.map((ward) => (
                          <Link
                            key={ward.id}
                            to={`/municipalities/${muni.cityId}/ward/${ward.id}`}
                            className="rounded-md border bg-secondary/30 p-3 hover:bg-secondary/60 transition-colors group"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                                Ward {ward.number} — {ward.name}
                              </h4>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                              <span>Pop. {ward.population.toLocaleString()}</span>
                              <span>·</span>
                              <span>{ward.area} sq km</span>
                              <span>·</span>
                              <span className="font-medium">{ward.councillor.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
