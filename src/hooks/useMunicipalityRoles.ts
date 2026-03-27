import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases } from "@/integrations/appwrite/client";
import {
  DATABASE_ID,
  COLLECTIONS,
  type MunicipalityUserRoleDoc,
  type MunicipalityRoleRequestDoc,
  type MunicipalityAnnouncementDoc,
  type MunicipalityPressQuestionDoc,
  type MunicipalityRole,
} from "@/integrations/appwrite/collections";
import { useAuth } from "@/contexts/AuthContext";
import { Query, ID } from "appwrite";
import { toast } from "sonner";

export type { MunicipalityRole };
export type RoleRequestStatus = "pending" | "approved" | "rejected";

export interface UserRole {
  id: string;
  user_id: string;
  role: MunicipalityRole;
  municipality_id: string;
  zone_id: string | null;
  ward_id: string | null;
  assigned_at: string;
}

export interface RoleRequest {
  id: string;
  user_id: string;
  role: MunicipalityRole;
  municipality_id: string;
  zone_id: string | null;
  ward_id: string | null;
  status: RoleRequestStatus;
  reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export function useMunicipalityRoles(municipalityId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userRoles = [] } = useQuery({
    queryKey: ["municipality-roles", municipalityId, user?.$id],
    queryFn: async (): Promise<UserRole[]> => {
      if (!user) return [];
      try {
        const res = await databases.listDocuments<MunicipalityUserRoleDoc>(
          DATABASE_ID,
          COLLECTIONS.MUNICIPALITY_USER_ROLES,
          [Query.equal("user_id", user.$id), Query.equal("municipality_id", municipalityId)]
        );
        return res.documents.map((d) => ({
          id: d.$id,
          user_id: d.user_id,
          role: d.role,
          municipality_id: d.municipality_id,
          zone_id: d.zone_id,
          ward_id: d.ward_id,
          assigned_at: d.$createdAt,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ["municipality-role-requests", municipalityId, user?.$id],
    queryFn: async (): Promise<RoleRequest[]> => {
      if (!user) return [];
      try {
        const res = await databases.listDocuments<MunicipalityRoleRequestDoc>(
          DATABASE_ID,
          COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS,
          [Query.equal("user_id", user.$id), Query.equal("municipality_id", municipalityId)]
        );
        return res.documents.map((d) => ({
          id: d.$id,
          user_id: d.user_id,
          role: d.role,
          municipality_id: d.municipality_id,
          zone_id: d.zone_id,
          ward_id: d.ward_id,
          status: d.status,
          reason: d.reason,
          reviewed_by: d.reviewed_by,
          reviewed_at: d.reviewed_at,
          created_at: d.$createdAt,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ["municipality-pending-requests", municipalityId],
    queryFn: async (): Promise<RoleRequest[]> => {
      if (!user) return [];
      try {
        const res = await databases.listDocuments<MunicipalityRoleRequestDoc>(
          DATABASE_ID,
          COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS,
          [Query.equal("municipality_id", municipalityId), Query.equal("status", "pending")]
        );
        return res.documents.map((d) => ({
          id: d.$id,
          user_id: d.user_id,
          role: d.role,
          municipality_id: d.municipality_id,
          zone_id: d.zone_id,
          ward_id: d.ward_id,
          status: d.status,
          reason: d.reason,
          reviewed_by: d.reviewed_by,
          reviewed_at: d.reviewed_at,
          created_at: d.$createdAt,
        }));
      } catch {
        return [];
      }
    },
    enabled: !!user && userRoles.some((r) => r.role === "city_official"),
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["municipality-announcements", municipalityId],
    queryFn: async () => {
      try {
        const res = await databases.listDocuments<MunicipalityAnnouncementDoc>(
          DATABASE_ID,
          COLLECTIONS.MUNICIPALITY_ANNOUNCEMENTS,
          [Query.equal("municipality_id", municipalityId), Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        return res.documents.map((d) => ({
          id: d.$id,
          user_id: d.user_id,
          municipality_id: d.municipality_id,
          zone_id: d.zone_id,
          ward_id: d.ward_id,
          title: d.title,
          content: d.content,
          created_at: d.$createdAt,
        }));
      } catch {
        return [];
      }
    },
  });

  const { data: pressQuestions = [] } = useQuery({
    queryKey: ["municipality-press-questions", municipalityId],
    queryFn: async () => {
      try {
        const res = await databases.listDocuments<MunicipalityPressQuestionDoc>(
          DATABASE_ID,
          COLLECTIONS.MUNICIPALITY_PRESS_QUESTIONS,
          [Query.equal("municipality_id", municipalityId), Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        return res.documents.map((d) => ({
          id: d.$id,
          user_id: d.user_id,
          municipality_id: d.municipality_id,
          question: d.question,
          answer: d.answer,
          answered_at: d.answered_at,
          answered_by: d.answered_by,
          created_at: d.$createdAt,
        }));
      } catch {
        return [];
      }
    },
  });

  const requestRole = useMutation({
    mutationFn: async ({ role, reason, zoneId, wardId }: { role: MunicipalityRole; reason: string; zoneId?: string; wardId?: string }) => {
      if (!user) throw new Error("Must be logged in");
      await databases.createDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS, ID.unique(), {
        user_id: user.$id,
        role,
        municipality_id: municipalityId,
        zone_id: zoneId || null,
        ward_id: wardId || null,
        reason,
        status: "pending",
      });
    },
    onSuccess: () => {
      toast.success("Role request submitted for review");
      queryClient.invalidateQueries({ queryKey: ["municipality-role-requests"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to submit request"),
  });

  const approveRequest = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error("Must be logged in");
      // Get request details
      const req = await databases.getDocument<MunicipalityRoleRequestDoc>(
        DATABASE_ID,
        COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS,
        requestId
      );

      // Update request status
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS, requestId, {
        status: "approved",
        reviewed_by: user.$id,
        reviewed_at: new Date().toISOString(),
      });

      // Assign role
      await databases.createDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_USER_ROLES, ID.unique(), {
        user_id: req.user_id,
        role: req.role,
        municipality_id: req.municipality_id,
        zone_id: req.zone_id,
        ward_id: req.ward_id,
      });
    },
    onSuccess: () => {
      toast.success("Role approved");
      queryClient.invalidateQueries({ queryKey: ["municipality-pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["municipality-roles"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to approve"),
  });

  const rejectRequest = useMutation({
    mutationFn: async (requestId: string) => {
      if (!user) throw new Error("Must be logged in");
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_ROLE_REQUESTS, requestId, {
        status: "rejected",
        reviewed_by: user.$id,
        reviewed_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["municipality-pending-requests"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to reject"),
  });

  const postAnnouncement = useMutation({
    mutationFn: async ({ title, content, zoneId, wardId }: { title: string; content: string; zoneId?: string; wardId?: string }) => {
      if (!user) throw new Error("Must be logged in");
      await databases.createDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_ANNOUNCEMENTS, ID.unique(), {
        user_id: user.$id,
        municipality_id: municipalityId,
        zone_id: zoneId || null,
        ward_id: wardId || null,
        title,
        content,
      });
    },
    onSuccess: () => {
      toast.success("Announcement posted");
      queryClient.invalidateQueries({ queryKey: ["municipality-announcements"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to post"),
  });

  const submitPressQuestion = useMutation({
    mutationFn: async (question: string) => {
      if (!user) throw new Error("Must be logged in");
      await databases.createDocument(DATABASE_ID, COLLECTIONS.MUNICIPALITY_PRESS_QUESTIONS, ID.unique(), {
        user_id: user.$id,
        municipality_id: municipalityId,
        question,
      });
    },
    onSuccess: () => {
      toast.success("Press question submitted");
      queryClient.invalidateQueries({ queryKey: ["municipality-press-questions"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed to submit question"),
  });

  const hasRole = (role: MunicipalityRole) => userRoles.some((r) => r.role === role);
  const isOfficial = userRoles.length > 0;
  const isAdmin = hasRole("city_official");
  const isJournalist = hasRole("journalist");
  const hasPendingRequest = (role: MunicipalityRole) => myRequests.some((r) => r.role === role && r.status === "pending");

  return {
    userRoles,
    myRequests,
    pendingRequests,
    announcements,
    pressQuestions,
    hasRole,
    isOfficial,
    isAdmin,
    isJournalist,
    hasPendingRequest,
    requestRole,
    approveRequest,
    rejectRequest,
    postAnnouncement,
    submitPressQuestion,
  };
}
