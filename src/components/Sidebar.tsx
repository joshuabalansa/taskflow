import React from 'react'
import { 
  LayoutDashboard, 
  CheckSquare, 
  GitBranch, 
  Users, 
  BarChart3,
  Settings,
  Bell,
  X
} from 'lucide-react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, sidebarOpen, setSidebarOpen }) => {
  const handleMenuClick = (viewId: string) => {
    setActiveView(viewId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare },
    { id: 'deployments', label: 'Deployments', icon: GitBranch },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 p-4 sm:p-6
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-white/20 backdrop-blur-sm text-blue-700 shadow-lg'
                    : 'text-gray-600 hover:bg-white/10 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 sm:pt-8 space-y-1 sm:space-y-2">
          <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-600 hover:bg-white/10 hover:text-gray-800 transition-all duration-200">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-600 hover:bg-white/10 hover:text-gray-800 transition-all duration-200">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">Settings</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
