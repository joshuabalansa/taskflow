import React from 'react'
import { GitBranch, CheckCircle, Clock, AlertCircle, ExternalLink, Calendar } from 'lucide-react'

const DeploymentTracker: React.FC = () => {
  const deployments = [
    {
      id: 1,
      task: 'Create Project via project lists',
      cardLink: 'https://trello.com/c/MSpWDVZB/1642-create-project-via-project-lists',
      developer: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      environments: {
        development: {
          deployed: '2024-01-10',
          approved: '2024-01-10',
          status: 'success'
        },
        staging: {
          deployed: '2024-01-12',
          approved: '2024-01-12',
          status: 'success'
        },
        production: {
          deployed: null,
          approved: null,
          status: 'pending'
        }
      },
      pullRequest: 'https://github.com/company/project/pull/123',
      videoLink: 'https://loom.com/share/demo-video',
      notes: [
        { type: 'dev', content: 'API endpoints implemented successfully', author: 'Sarah Chen', date: '2024-01-10' },
        { type: 'testing', content: 'All UI tests passing', author: 'QA Team', date: '2024-01-11' }
      ]
    },
    {
      id: 2,
      task: 'User Authentication System',
      cardLink: 'https://trello.com/c/ABC123/1643-user-authentication-system',
      developer: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      environments: {
        development: {
          deployed: '2024-01-08',
          approved: '2024-01-08',
          status: 'success'
        },
        staging: {
          deployed: null,
          approved: null,
          status: 'pending'
        },
        production: {
          deployed: null,
          approved: null,
          status: 'pending'
        }
      },
      pullRequest: 'https://github.com/company/project/pull/124',
      videoLink: null,
      notes: [
        { type: 'dev', content: 'OAuth integration complete', author: 'Mike Johnson', date: '2024-01-08' }
      ]
    },
    {
      id: 3,
      task: 'Dashboard Analytics Widget',
      cardLink: 'https://trello.com/c/DEF456/1644-dashboard-analytics-widget',
      developer: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      environments: {
        development: {
          deployed: '2024-01-05',
          approved: '2024-01-05',
          status: 'success'
        },
        staging: {
          deployed: '2024-01-07',
          approved: '2024-01-07',
          status: 'success'
        },
        production: {
          deployed: '2024-01-09',
          approved: '2024-01-09',
          status: 'success'
        }
      },
      pullRequest: 'https://github.com/company/project/pull/122',
      videoLink: 'https://loom.com/share/analytics-demo',
      notes: [
        { type: 'project_owner', content: 'Approved for production deployment', author: 'Project Owner', date: '2024-01-09' }
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Deployment Tracker</h1>
          <p className="text-gray-600 mt-1">Track deployment status across all environments</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: 5 minutes ago</span>
        </div>
      </div>

      <div className="space-y-6">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <a 
                    href={deployment.cardLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    {deployment.task}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={deployment.avatar} 
                    alt={deployment.developer}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-600">Developer: {deployment.developer}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {deployment.pullRequest && (
                  <a 
                    href={deployment.pullRequest} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg text-sm text-blue-600 hover:text-blue-700 hover:bg-white/40 transition-all duration-200"
                  >
                    <GitBranch className="w-3 h-3" />
                    Pull Request
                  </a>
                )}
                {deployment.videoLink && (
                  <a 
                    href={deployment.videoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg text-sm text-purple-600 hover:text-purple-700 hover:bg-white/40 transition-all duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Demo Video
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(deployment.environments).map(([env, data]) => (
                <div key={env} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 capitalize">{env}</h4>
                    {getStatusIcon(data.status)}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Deployment Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {data.deployed || 'Not deployed'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Approval Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {data.approved || 'Pending approval'}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(data.status)}`}>
                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {deployment.notes.length > 0 && (
              <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Notes & Comments</h4>
                <div className="space-y-3">
                  {deployment.notes.map((note, index) => (
                    <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 capitalize">
                          {note.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{note.content}</p>
                      <p className="text-xs text-gray-500">— {note.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeploymentTracker
