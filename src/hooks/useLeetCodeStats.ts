import { useQuery } from '@tanstack/react-query';

export interface LeetCodeStats {
  username: string;
  avatar: string;
  realName: string;
  aboutMe: string;
  problemsSolved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    easySub: number;
    mediumSub: number;
    hardSub: number;
  };
  submissions: {
    total: number;
    calendar: string;
  };
  contest: {
    attended: number;
    rating: number;
    ranking: number;
    totalParticipants: number;
    topPercentage: number;
  };
  contestHistory: Array<{
    attended: boolean;
    rating: number;
    ranking: number;
    contest: {
      title: string;
      startTime: number;
    };
  }>;
  stats: {
    totalSubmissions: number;
  };
}

interface LeetCodeResponse {
  success: boolean;
  data: LeetCodeStats;
  cached?: boolean;
  stale?: boolean;
  lastUpdated?: string;
  error?: string;
}

const fetchLeetCodeStats = async (): Promise<LeetCodeResponse> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/api/leetcode-stats`);
  if (!res.ok) throw new Error(`LeetCode stats request failed (${res.status})`);
  const json: LeetCodeResponse = await res.json();
  if (!json.success || !json.data)
    throw new Error(json.error || 'LeetCode stats unavailable');
  return json;
};

/** Single shared fetch for Hero + Achievements (react-query dedupes). */
export const useLeetCodeStats = () =>
  useQuery({
    queryKey: ['leetcode-stats'],
    queryFn: fetchLeetCodeStats,
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
