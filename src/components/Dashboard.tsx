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

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const taskStats = await getTaskStats();
      setStats(taskStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="col-span-4 text-center py-8">
            <p className="text-red-600">Error loading dashboard: {error}</p>
          </div>
        ) : (
          statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTasks />
        </div>
        <div className="space-y-6">
          <DeploymentStatus />
          <TeamActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
