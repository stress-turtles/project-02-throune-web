const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const cloudEnabled = Boolean(supabaseUrl && supabaseKey);

type SupabaseRun = {
  id: string;
  username: string;
  title: string;
  note: string;
  points: unknown;
  started_at: string;
  ended_at: string;
  demo: boolean;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!cloudEnabled || !supabaseUrl || !supabaseKey) throw new Error('Supabase belum dikonfigurasi.');
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase (${response.status}): ${detail.slice(0, 240)}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
}

export async function claimUsername(username: string): Promise<void> {
  const rows = await request<Array<{ username: string }>>('profiles?select=username&username=eq.' + encodeURIComponent(username));
  if (rows.length) return;
  await request('profiles', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ username }),
  });
}

export async function loadRuns(username: string): Promise<SupabaseRun[]> {
  return request(`runs?select=id,username,title,note,points,started_at,ended_at,demo&username=eq.${encodeURIComponent(username)}&order=started_at.desc`);
}

export async function upsertRun(username: string, run: {
  id: string; title: string; note: string; points: unknown;
  started: number; ended: number; demo: boolean;
}): Promise<void> {
  await request('runs?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({
      id: run.id, username, title: run.title, note: run.note, points: run.points,
      started_at: new Date(run.started).toISOString(), ended_at: new Date(run.ended).toISOString(), demo: run.demo,
    }),
  });
}

export async function deleteRun(username: string, id: string): Promise<void> {
  await request(`runs?id=eq.${encodeURIComponent(id)}&username=eq.${encodeURIComponent(username)}`, { method: 'DELETE' });
}

export function fromCloudRun(run: SupabaseRun) {
  return {
    id: run.id, title: run.title, note: run.note, points: run.points as import('./geo').Point[],
    started: Date.parse(run.started_at), ended: Date.parse(run.ended_at), demo: run.demo,
  };
}

