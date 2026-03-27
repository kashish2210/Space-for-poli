import { useJoinedGroups, type JoinedGroup } from "@/contexts/JoinedGroupsContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";

interface JoinGroupButtonProps {
  group: Omit<JoinedGroup, "notifications">;
  className?: string;
}

export function JoinGroupButton({ group, className = "" }: JoinGroupButtonProps) {
  const { isJoined, toggleGroup } = useJoinedGroups();
  const { user } = useAuth();
  const joined = isJoined(group.id);

  if (!user) {
    return (
      <Link
        to="/auth"
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors bg-primary text-primary-foreground hover:opacity-90 ${className}`}
      >
        <UserPlus className="h-3.5 w-3.5" /> Sign in to Join
      </Link>
    );
  }

  return (
    <button
      onClick={() => toggleGroup(group)}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
        joined
          ? "bg-secondary text-secondary-foreground hover:bg-destructive/20 hover:text-destructive"
          : "bg-primary text-primary-foreground hover:opacity-90"
      } ${className}`}
    >
      {joined ? (
        <>
          <UserMinus className="h-3.5 w-3.5" /> Leave
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" /> Join
        </>
      )}
    </button>
  );
}
