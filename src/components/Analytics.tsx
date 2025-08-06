import React from 'react'
import { BarChart3, TrendingUp, Clock, Target, Calendar } from 'lucide-react'

const Analytics: React.FC = () => {
  const metrics = [
    {
      title: 'Task Completion Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Average Completion Time',
      value: '3.2 days',
      change: '-0.5 days',
      trend: 'up',
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Team Productivity',
      value: '94%',
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'On-Time Delivery',
      value: '91%',
      change: '+3%',
      trend: 'up',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const deploymentStats = [
    { environment: 'Development', deployments: 45, success: 43, failed: 2 },
    { environment: 'Staging', deployments: 28, success: 26, failed: 2 },
    { environment: 'Production', deployments: 15, success: 15, failed: 0 }
  ]

  const tasksByStatus = [
    { status: 'Completed', count: 222, percentage: 74 },
    { status: 'In Progress', count: 18, percentage: 6 },
    { status: 'Review', count: 7, percentage: 2 },
    { status: 'Todo', count: 53, percentage: 18 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your team's performance and project insights</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>Data updated 10 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Deployment Statistics</h3>
          <div className="space-y-4">
            {deploymentStats.map((stat, index) => (
              <div key={index} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{stat.environment}</h4>
                  <span className="text-sm text-gray-600">{stat.deployments} total</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600">Success: {stat.success}</span>
                      <span className="text-red-500">Failed: {stat.failed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(stat.success / stat.deployments) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-800">
                      {Math.round((stat.success / stat.deployments) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Task Distribution</h3>
          <div className="space-y-4">
            {tasksByStatus.map((task, index) => (
              <div key={index} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{task.status}</span>
                  <span className="text-sm text-gray-600">{task.count} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${task.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">{task.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Performance Trends</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-600 mb-2">{day}</div>
              <div className="bg-white/30 backdrop-blur-sm rounded-lg p-2">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm mx-auto"
                  style={{ 
                    height: `${Math.random() * 60 + 20}px`,
                    width: '20px'
                  }}
                ></div>
                <div className="text-xs text-gray-700 mt-1">
                  {Math.floor(Math.random() * 10 + 5)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">Tasks completed per day this week</p>
      </div>
    </div>
  )
}

export default Analytics
