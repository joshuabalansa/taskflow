import React from 'react'
import { Clock, User, ExternalLink, MoreHorizontal } from 'lucide-react'
import { useDatabaseContext } from '../contexts/DatabaseContext'
import LoadingSpinner from './LoadingSpinner'

const RecentTasks: React.FC = () => {
  const { tasks, loading, error } = useDatabaseContext();
  // Get the 5 most recent tasks (sorted by ID descending)
  const recentTasks = tasks.slice().sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="h-32">
          <LoadingSpinner size="md" message="Loading recent tasks..." className="h-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="text-center py-6 sm:py-8">
          <p className="text-red-600 text-sm sm:text-base">Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Tasks</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">View All</button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {recentTasks.map((task) => (
          <div key={task.id} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-3 sm:p-4 hover:bg-white/40 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <a 
                    href={task.cardLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{task.title}</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200 flex-shrink-0">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Task Details</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="flex justify-between">
                      <span>Due:</span>
                      <span className="text-gray-600">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assignee</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(task.assignee)}
                    </div>
                    <span className="text-gray-700 font-medium">{task.assignee}</span>
                  </div>
                  {task.createdAt && (
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="text-gray-600">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Links</h4>
                <div className="space-y-1">
                  {task.pullRequest && (
                    <a 
                      href={task.pullRequest} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Pull Request
                    </a>
                  )}
                  {task.videoLink && (
                    <a 
                      href={task.videoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo Video
                    </a>
                  )}
                </div>
              </div>
            </div>

            {task.cardLink && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Card Link</h4>
                <a 
                  href={task.cardLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Task Card
                </a>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {getInitials(task.assignee)}
                </div>
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Due {task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTasks
