import React from 'react'
import { Activity } from 'lucide-react'

const TeamActivity: React.FC = () => {
  const activities = [
    {
      user: 'Sarah Chen',
      action: 'completed task',
      target: 'User Dashboard',
      time: '5 min ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    {
      user: 'Mike Johnson',
      action: 'deployed to',
      target: 'staging',
      time: '15 min ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      user: 'Emily Davis',
      action: 'created pull request',
      target: '#124',
      time: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  ]

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-bold text-gray-800">Team Activity</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <img 
              src={activity.avatar} 
              alt={activity.user}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamActivity
