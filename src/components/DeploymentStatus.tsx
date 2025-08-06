import React from 'react'
import { GitBranch, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const DeploymentStatus: React.FC = () => {
  const deployments = [
    {
      environment: 'Production',
      status: 'success',
      lastDeploy: '2 hours ago',
      version: 'v2.1.4',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      environment: 'Staging',
      status: 'deploying',
      lastDeploy: 'In progress',
      version: 'v2.1.5',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      environment: 'Development',
      status: 'failed',
      lastDeploy: '1 hour ago',
      version: 'v2.1.6',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-800">Deployment Status</h3>
      </div>

      <div className="space-y-3">
        {deployments.map((deployment, index) => {
          const Icon = deployment.icon
          return (
            <div key={index} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${deployment.color}`} />
                  <span className="font-medium text-gray-800">{deployment.environment}</span>
                </div>
                <span className="text-xs text-gray-500">{deployment.version}</span>
              </div>
              <p className="text-sm text-gray-600">{deployment.lastDeploy}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DeploymentStatus
