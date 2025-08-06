import React from 'react'
import { Clock, User, ExternalLink, MoreHorizontal } from 'lucide-react'
import { useDatabaseContext } from '../contexts/DatabaseContext'

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
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="ml-2 text-gray-600">Loading recent tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
      </div>

      <div className="space-y-4">
        {recentTasks.map((task) => (
          <div key={task.id} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/40 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <a 
                    href={task.cardLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                  >
                    {task.title}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button className="p-1 hover:bg-white/20 rounded-lg transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Deployment Status</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Dev:</span>
                    <span className={task.deployments.dev ? 'text-green-600' : 'text-gray-400'}>
                      {task.deployments.dev || 'Not deployed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staging:</span>
                    <span className={task.deployments.staging ? 'text-green-600' : 'text-gray-400'}>
                      {task.deployments.staging || 'Not deployed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Production:</span>
                    <span className={task.deployments.production ? 'text-green-600' : 'text-gray-400'}>
                      {task.deployments.production || 'Not deployed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Approvals</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Dev:</span>
                    <span className={task.approvals.dev ? 'text-green-600' : 'text-gray-400'}>
                      {task.approvals.dev || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staging:</span>
                    <span className={task.approvals.staging ? 'text-green-600' : 'text-gray-400'}>
                      {task.approvals.staging || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Production:</span>
                    <span className={task.approvals.production ? 'text-green-600' : 'text-gray-400'}>
                      {task.approvals.production || 'Pending'}
                    </span>
                  </div>
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

            {task.notes.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="space-y-2">
                  {task.notes.map((note, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium text-gray-600">{note.type}:</span>
                      <span className="ml-1 text-gray-700">{note.content}</span>
                      <span className="ml-2 text-gray-500">- {note.author}</span>
                    </div>
                  ))}
                </div>
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
