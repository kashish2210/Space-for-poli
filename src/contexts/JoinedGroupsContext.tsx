import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { databases, client } from "@/integrations/appwrite/client";
import { DATABASE_ID, COLLECTIONS, type JoinedGroupDoc, type NotificationDoc } from "@/integrations/appwrite/collections";
import { useAuth } from "@/contexts/AuthContext";
import { Query, ID } from "appwrite";

export interface JoinedGroup {
  id: string;
  name: string;
  type: "city" | "state" | "ministry" | "party" | "parliament";
  path: string;
  notifications: number;
}

interface Notification {
  id: string;
  group_id: string;
  group_name: string;
  message: string;
  official_name: string | null;
  is_read: boolean;
  created_at: string;
}

const DEFAULT_GROUPS: JoinedGroup[] = [
  { id: "delhi", name: "New Delhi", type: "city", path: "/cities/delhi", notifications: 3 },
  { id: "maharashtra", name: "Maharashtra", type: "state", path: "/states/maharashtra", notifications: 1 },
  { id: "health", name: "Ministry of Health", type: "ministry", path: "/ministries/health", notifications: 5 },
  { id: "bjp", name: "Bharatiya Janata Party", type: "party", path: "/parties/bjp", notifications: 2 },
  { id: "lok-sabha", name: "Lok Sabha", type: "parliament", path: "/parliament/lok-sabha", notifications: 0 },
];

interface JoinedGroupsContextType {
  joinedGroups: JoinedGroup[];
  notifications: Notification[];
  unreadCount: number;
  isJoined: (id: string) => boolean;
  joinGroup: (group: Omit<JoinedGroup, "notifications">) => void;
  leaveGroup: (id: string) => void;
  toggleGroup: (group: Omit<JoinedGroup, "notifications">) => void;
  totalNotifications: number;
  markNotificationRead: (id: string) => void;
  markAllRead: (groupId?: string) => void;
}

const JoinedGroupsContext = createContext<JoinedGroupsContextType | null>(null);

export function JoinedGroupsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [joinedGroups, setJoinedGroups] = useState<JoinedGroup[]>(DEFAULT_GROUPS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load joined groups from DB when authenticated
  useEffect(() => {
    if (!user) {
      setJoinedGroups(DEFAULT_GROUPS);
      setNotifications([]);
      return;
    }

    const loadData = async () => {
      try {
        // Load joined groups
        const groupsRes = await databases.listDocuments<JoinedGroupDoc>(
          DATABASE_ID,
          COLLECTIONS.JOINED_GROUPS,
          [Query.equal("user_id", user.$id)]
        );

        if (groupsRes.documents.length > 0) {
          // Load unread notifications
          const notifsRes = await databases.listDocuments<NotificationDoc>(
            DATABASE_ID,
            COLLECTIONS.NOTIFICATIONS,
            [Query.equal("user_id", user.$id), Query.equal("is_read", false)]
          );

          const notifCounts: Record<string, number> = {};
          notifsRes.documents.forEach((n) => {
            notifCounts[n.group_id] = (notifCounts[n.group_id] || 0) + 1;
          });

          setJoinedGroups(
            groupsRes.documents.map((g) => ({
              id: g.group_id,
              name: g.group_name,
              type: g.group_type as JoinedGroup["type"],
              path: g.group_path,
              notifications: notifCounts[g.group_id] || 0,
            }))
          );
          setNotifications(
            notifsRes.documents.map((n) => ({
              id: n.$id,
              group_id: n.group_id,
              group_name: n.group_name,
              message: n.message,
              official_name: n.official_name,
              is_read: n.is_read,
              created_at: n.$createdAt,
            }))
          );
        } else {
          // First login: seed default groups
          const promises = DEFAULT_GROUPS.map((g) =>
            databases.createDocument(DATABASE_ID, COLLECTIONS.JOINED_GROUPS, ID.unique(), {
              user_id: user.$id,
              group_id: g.id,
              group_name: g.name,
              group_type: g.type,
              group_path: g.path,
            })
          );
          await Promise.allSettled(promises);
          setJoinedGroups(DEFAULT_GROUPS);
        }
      } catch {
        // DB not set up yet — use defaults
        setJoinedGroups(DEFAULT_GROUPS);
      }
    };

    loadData();
  }, [user]);

  // Realtime notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOTIFICATIONS}.documents`;
    const unsubscribe = client.subscribe(channel, (response) => {
      const events = response.events || [];
      const isCreate = events.some((e: string) => e.includes(".create"));
      if (!isCreate) return;

      const n = response.payload as any;
      if (n.user_id !== user.$id) return;

      setNotifications((prev) => [
        {
          id: n.$id,
          group_id: n.group_id,
          group_name: n.group_name,
          message: n.message,
          official_name: n.official_name,
          is_read: n.is_read,
          created_at: n.$createdAt,
        },
        ...prev,
      ]);
      setJoinedGroups((prev) =>
        prev.map((g) =>
          g.id === n.group_id ? { ...g, notifications: g.notifications + 1 } : g
        )
      );
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const isJoined = useCallback((id: string) => joinedGroups.some((g) => g.id === id), [joinedGroups]);

  const joinGroup = useCallback(
    async (group: Omit<JoinedGroup, "notifications">) => {
      setJoinedGroups((prev) => {
        if (prev.some((g) => g.id === group.id)) return prev;
        return [...prev, { ...group, notifications: 0 }];
      });
      if (user) {
        try {
          await databases.createDocument(DATABASE_ID, COLLECTIONS.JOINED_GROUPS, ID.unique(), {
            user_id: user.$id,
            group_id: group.id,
            group_name: group.name,
            group_type: group.type,
            group_path: group.path,
          });
        } catch {
          // ignore if already joined
        }
      }
    },
    [user]
  );

  const leaveGroup = useCallback(
    async (id: string) => {
      setJoinedGroups((prev) => prev.filter((g) => g.id !== id));
      if (user) {
        try {
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.JOINED_GROUPS, [
            Query.equal("user_id", user.$id),
            Query.equal("group_id", id),
          ]);
          for (const doc of res.documents) {
            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.JOINED_GROUPS, doc.$id);
          }
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const toggleGroup = useCallback(
    (group: Omit<JoinedGroup, "notifications">) => {
      if (isJoined(group.id)) {
        leaveGroup(group.id);
      } else {
        joinGroup(group);
      }
    },
    [isJoined, joinGroup, leaveGroup]
  );

  const markNotificationRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      if (user) {
        try {
          await databases.updateDocument(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, id, { is_read: true });
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const markAllRead = useCallback(
    async (groupId?: string) => {
      setNotifications((prev) =>
        prev.map((n) => (groupId ? (n.group_id === groupId ? { ...n, is_read: true } : n) : { ...n, is_read: true }))
      );
      setJoinedGroups((prev) =>
        prev.map((g) => (groupId ? (g.id === groupId ? { ...g, notifications: 0 } : g) : { ...g, notifications: 0 }))
      );
      if (user) {
        try {
          const queries = [Query.equal("user_id", user.$id), Query.equal("is_read", false)];
          if (groupId) queries.push(Query.equal("group_id", groupId));
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, queries);
          await Promise.allSettled(
            res.documents.map((doc) =>
              databases.updateDocument(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, doc.$id, { is_read: true })
            )
          );
        } catch {
          // ignore
        }
      }
    },
    [user]
  );

  const totalNotifications = joinedGroups.reduce((sum, g) => sum + g.notifications, 0);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <JoinedGroupsContext.Provider
      value={{ joinedGroups, notifications, unreadCount, isJoined, joinGroup, leaveGroup, toggleGroup, totalNotifications, markNotificationRead, markAllRead }}
    >
      {children}
    </JoinedGroupsContext.Provider>
  );
}

export function useJoinedGroups() {
  const ctx = useContext(JoinedGroupsContext);
  if (!ctx) throw new Error("useJoinedGroups must be used within JoinedGroupsProvider");
  return ctx;
}
