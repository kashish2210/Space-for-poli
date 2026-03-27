import { databases } from '@/integrations/appwrite/client';
import { DATABASE_ID, COLLECTIONS, type RallyRoomDoc } from '@/integrations/appwrite/collections';
import { Query } from 'appwrite';

export async function listRallies(liveOnly = true) {
  try {
    const queries: string[] = [Query.orderDesc('$createdAt'), Query.limit(20)];
    if (liveOnly) queries.push(Query.equal('is_live', true));
    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.RALLY_ROOMS, queries);
    return res.documents as unknown as RallyRoomDoc[];
  } catch {
    return [];
  }
}

export async function getRally(id: string) {
  try {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.RALLY_ROOMS, id) as unknown as RallyRoomDoc;
  } catch {
    return null;
  }
}

/**
 * Generate a Google Calendar "Add Event" URL for a rally reminder.
 */
export function getRallyCalendarUrl(title: string, topic: string, rallyId: string) {
  const now = new Date();
  const start = new Date(now.getTime() + 30 * 60000); // 30 min from now
  const end = new Date(start.getTime() + 60 * 60000); // 1 hour duration

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Space Rally: ${title}`,
    details: `${topic}\n\nJoin at: ${window.location.origin}/rallies/${rallyId}`,
    dates: `${fmt(start)}/${fmt(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
