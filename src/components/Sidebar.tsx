import React from 'react'
import { 
  LayoutDashboard, 
  CheckSquare, 
  GitBranch, 
  Users, 
  BarChart3,
  Settings,
  Bell
} from 'lucide-react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare },
    { id: 'deployments', label: 'Deployments', icon: GitBranch },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="w-64 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id
                  ? 'bg-white/20 backdrop-blur-sm text-blue-700 shadow-lg'
                  : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-8 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white/10 hover:text-gray-800 transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-white/10 hover:text-gray-800 transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
