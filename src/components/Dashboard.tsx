import React, { useEffect, useState } from 'react'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  GitBranch,
  Users,
  Calendar,
  Activity
} from 'lucide-react'
import StatsCard from './StatsCard'
import RecentTasks from './RecentTasks'
import DeploymentStatus from './DeploymentStatus'
import TeamActivity from './TeamActivity'
import { useDatabaseContext } from '../contexts/DatabaseContext'

const Dashboard: React.FC = () => {
  const { getTaskStats, loading, error } = useDatabaseContext();
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    review: 0,
    completed: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const taskStats = await getTaskStats();
      setStats(taskStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };
  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats.total.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgress.toString(),
      change: '+5%',
      trend: 'up' as const,
      icon: Clock,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Pending Review',
      value: stats.review.toString(),
      change: '-2%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Completed',
      value: stats.completed.toString(),
      change: '+18%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsLoading ? (
          // Loading skeleton for stats cards
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-3 sm:w-12 sm:h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-6 sm:w-16 sm:h-8 bg-gray-200 rounded"></div>
                <div className="w-20 h-3 sm:w-24 sm:h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-6 sm:py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm sm:text-base">Error loading dashboard: {error}</p>
              <button 
                onClick={loadStats}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <RecentTasks />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <DeploymentStatus />
          <TeamActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
