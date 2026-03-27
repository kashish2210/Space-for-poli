import { useState } from "react";
import { Shield, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { MunicipalityRole } from "@/hooks/useMunicipalityRoles";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const roleLabels: Record<MunicipalityRole, { label: string; description: string }> = {
  city_official: { label: "City Official", description: "Mayor, Commissioner — post announcements, manage roles" },
  zonal_officer: { label: "Zonal Officer", description: "Zone-level admin — manage wards in your zone" },
  ward_councillor: { label: "Ward Councillor", description: "Ward-level official — manage ward content" },
  journalist: { label: "Journalist", description: "Verified press — submit questions, press access" },
};

interface Props {
  municipalityId: string;
  hasPendingRequest: (role: MunicipalityRole) => boolean;
  hasRole: (role: MunicipalityRole) => boolean;
  onSubmit: (data: { role: MunicipalityRole; reason: string }) => void;
  isSubmitting: boolean;
}

export function RoleRequestPanel({ municipalityId, hasPendingRequest, hasRole, onSubmit, isSubmitting }: Props) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<MunicipalityRole | null>(null);
  const [reason, setReason] = useState("");

  if (!user) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">Request a Role</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Sign in to request an official role in this municipality.</p>
        <Link to="/auth" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
          Sign In →
        </Link>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selectedRole || !reason.trim()) return;
    onSubmit({ role: selectedRole, reason: reason.trim() });
    setSelectedRole(null);
    setReason("");
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Request a Role</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.entries(roleLabels) as [MunicipalityRole, typeof roleLabels[MunicipalityRole]][]).map(([role, info]) => {
          const pending = hasPendingRequest(role);
          const assigned = hasRole(role);
          return (
            <button
              key={role}
              onClick={() => !pending && !assigned && setSelectedRole(selectedRole === role ? null : role)}
              disabled={pending || assigned}
              className={`text-left rounded-md border p-3 transition-all ${
                assigned
                  ? "border-green-500/30 bg-green-500/5 cursor-default"
                  : pending
                  ? "border-yellow-500/30 bg-yellow-500/5 cursor-default"
                  : selectedRole === role
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-primary/40 hover:bg-secondary/30 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-card-foreground">{info.label}</span>
                {assigned && <CheckCircle className="h-3.5 w-3.5 text-green-500" />}
                {pending && <Clock className="h-3.5 w-3.5 text-yellow-500" />}
              </div>
              <p className="text-[10px] text-muted-foreground">{info.description}</p>
              {pending && <p className="text-[10px] text-yellow-600 mt-1 font-medium">Pending approval</p>}
              {assigned && <p className="text-[10px] text-green-600 mt-1 font-medium">Assigned</p>}
            </button>
          );
        })}
      </div>

      {selectedRole && (
        <div className="mt-3 space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Why should you be assigned the ${roleLabels[selectedRole].label} role?`}
            className="w-full rounded-md border bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="h-3 w-3" /> Submit Request
          </button>
        </div>
      )}
    </div>
  );
}
