import { CheckCircle, XCircle, Shield, User } from "lucide-react";
import { RoleRequest } from "@/hooks/useMunicipalityRoles";

const roleLabels: Record<string, string> = {
  city_official: "City Official",
  zonal_officer: "Zonal Officer",
  ward_councillor: "Ward Councillor",
  journalist: "Journalist",
};

interface Props {
  requests: RoleRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}

export function AdminRequestsPanel({ requests, onApprove, onReject, isLoading }: Props) {
  if (requests.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-card-foreground">Pending Role Requests</h3>
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground min-w-[18px] h-[18px]">
          {requests.length}
        </span>
      </div>
      <div className="space-y-2">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center gap-3 rounded-md border bg-secondary/30 px-3 py-2.5">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-card-foreground">{req.user_id.slice(0, 8)}…</span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                  {roleLabels[req.role] || req.role}
                </span>
              </div>
              {req.reason && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{req.reason}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onApprove(req.id)}
                disabled={isLoading}
                className="p-1.5 rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => onReject(req.id)}
                disabled={isLoading}
                className="p-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
