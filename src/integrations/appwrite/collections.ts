// Database ID
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// Collection IDs — match the collections you create in Appwrite Console
export const COLLECTIONS = {
  JOINED_GROUPS: 'joined_groups',
  NOTIFICATIONS: 'notifications',
  PROFILES: 'profiles',
  MUNICIPALITY_ANNOUNCEMENTS: 'municipality_announcements',
  MUNICIPALITY_PRESS_QUESTIONS: 'municipality_press_questions',
  MUNICIPALITY_ROLE_REQUESTS: 'municipality_role_requests',
  MUNICIPALITY_USER_ROLES: 'municipality_user_roles',
  POSTS: 'posts',
  POST_VOTES: 'post_votes',
  BOOKMARKS: 'bookmarks',
  CHAT_MESSAGES: 'chat_messages',
  RALLY_ROOMS: 'rally_rooms',
  COMMENTS: 'comments',
  QA_MESSAGES: 'qa_messages',
} as const;

// ---------- Document Interfaces ----------

export interface JoinedGroupDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  group_id: string;
  group_name: string;
  group_type: string;
  group_path: string;
}

export interface NotificationDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  group_id: string;
  group_name: string;
  message: string;
  official_name: string | null;
  is_read: boolean;
}

export interface ProfileDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  display_name: string | null;
}

export interface MunicipalityAnnouncementDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  municipality_id: string;
  zone_id: string | null;
  ward_id: string | null;
  title: string;
  content: string;
}

export interface MunicipalityPressQuestionDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  municipality_id: string;
  question: string;
  answer: string | null;
  answered_at: string | null;
  answered_by: string | null;
}

export type MunicipalityRole = 'city_official' | 'zonal_officer' | 'ward_councillor' | 'journalist';
export type RoleRequestStatus = 'pending' | 'approved' | 'rejected';

export interface MunicipalityRoleRequestDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  role: MunicipalityRole;
  municipality_id: string;
  zone_id: string | null;
  ward_id: string | null;
  status: RoleRequestStatus;
  reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface MunicipalityUserRoleDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  role: MunicipalityRole;
  municipality_id: string;
  zone_id: string | null;
  ward_id: string | null;
}

// ---------- Posts ----------

export interface PostDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  user_name: string;
  content: string;
  tag: string;
  city: string;
  city_id: string;
  ministry: string;
  ministry_id: string;
  group_id: string;
  likes: number;
  replies: number;
}

export interface PostVoteDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  post_id: string;
  vote: 'up' | 'down';
}

export interface BookmarkDoc {
  $id: string;
  $createdAt: string;
  user_id: string;
  post_id: string;
}

export interface ChatMessageDoc {
  $id: string;
  $createdAt: string;
  rally_id: string;
  user_id: string;
  user_name: string;
  role: string;
  text: string;
}

export interface CommentDoc {
  $id: string;
  $createdAt: string;
  post_id: string;
  user_id: string;
  user_name: string;
  text: string;
}

export interface QAMessageDoc {
  $id: string;
  $createdAt: string;
  session_id: string;
  user_id: string;
  user_name: string;
  text: string;
  is_ai: boolean;
}

export interface RallyRoomDoc {
  $id: string;
  $createdAt: string;
  title: string;
  host: string;
  scope: string;
  scope_type: string;
  topic: string;
  listener_count: number;
  is_live: boolean;
}
