import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface LeetCodeStats {
  username: string;
  avatar?: string;
  realName?: string;
  problemsSolved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  submissions: {
    total: number;
  };
  contest: {
    attended: number;
    rating: number;
    ranking: number;
    totalParticipants?: number;
    topPercentage?: number;
  };
}

const Achievements = () => {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeetCodeStats();
  }, []);

  const fetchLeetCodeStats = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leetcode-stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setLastUpdated(new Date(data.lastUpdated));
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      toast({
        title: "Failed to load stats",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Failed to load LeetCode stats</p>
          <button
            onClick={fetchLeetCodeStats}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Pie chart data for problems
  const problemsData = [
    { name: 'Easy', value: stats.problemsSolved.easy, fill: '#10b981' },
    { name: 'Medium', value: stats.problemsSolved.medium, fill: '#f59e0b' },
    { name: 'Hard', value: stats.problemsSolved.hard, fill: '#ef4444' }
  ];

  // Line chart data for contest rating progression (mock data - real would come from API)
  const ratingData = [
    { month: 'Jan', rating: Math.max(0, stats.contest.rating - 200) },
    { month: 'Feb', rating: Math.max(0, stats.contest.rating - 150) },
    { month: 'Mar', rating: Math.max(0, stats.contest.rating - 50) },
    { month: 'Apr', rating: stats.contest.rating }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation Spacing */}
      <div className="h-20" />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            Coding <span className="text-gradient">Achievements</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Pie Chart - Problems Solved */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 premium-border rounded-xl p-8 bg-gradient-to-br from-black/50 to-black/30 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold mb-2">Problems Solved</h2>
            <p className="text-4xl font-bold text-primary mb-4">{stats.problemsSolved.total}</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={problemsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {problemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-6 space-y-2 text-sm">
              {problemsData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats & Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Key Stats */}
            <div className="premium-border rounded-xl p-8 bg-gradient-to-br from-black/50 to-black/30">
              <h3 className="text-xl font-bold mb-6">Contest Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-2">Rating</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.contest.rating.toFixed(0)}</p>
                </div>
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-2">Global Rank</p>
                  <p className="text-2xl font-bold">#{stats.contest.ranking.toLocaleString()}</p>
                </div>
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-2">Contests</p>
                  <p className="text-2xl font-bold">{stats.contest.attended}</p>
                </div>
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-muted-foreground text-xs mb-2">Top Percentile</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.contest.topPercentage ? `${stats.contest.topPercentage}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Chart - Rating Progression */}
            <div className="premium-border rounded-xl p-8 bg-gradient-to-br from-black/50 to-black/30">
              <h3 className="text-xl font-bold mb-6">Rating Progression</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="premium-border rounded-xl p-8 bg-gradient-to-r from-primary/10 to-accent/10 text-center"
        >
          <p className="text-muted-foreground mb-4">View complete profile and detailed statistics</p>
          <a
            href="https://leetcode.com/u/Sai_Nikhil_315/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Visit LeetCode Profile →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements;
