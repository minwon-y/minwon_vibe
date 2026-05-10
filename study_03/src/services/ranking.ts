const STORAGE_KEY = 'quiz_ranking';
const MAX_ENTRIES = 500;

export interface RankingEntry {
  id: string;
  nickname: string;
  totalScore: number;
  categoryScores: Record<string, number>;
  playTimeSec: number;
  playedAt: string; // ISO8601
}

function sortEntries(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.playTimeSec !== b.playTimeSec) return a.playTimeSec - b.playTimeSec;
    return a.playedAt.localeCompare(b.playedAt);
  });
}

export function loadRanking(): RankingEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sortEntries(JSON.parse(raw) as RankingEntry[]);
  } catch {
    return [];
  }
}

export function addEntry(data: Omit<RankingEntry, 'id'>): RankingEntry {
  const entry: RankingEntry = { id: crypto.randomUUID(), ...data };
  let entries = sortEntries([...loadRanking(), entry]);
  if (entries.length > MAX_ENTRIES) {
    entries = entries.slice(0, MAX_ENTRIES);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
  return entry;
}

export function getMyRank(id: string): number {
  const sorted = loadRanking();
  const idx = sorted.findIndex((e) => e.id === id);
  return idx === -1 ? -1 : idx + 1;
}
