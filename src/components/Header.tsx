import React from 'react'
import { Search, Plus, Bell, User, Menu } from 'lucide-react'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="h-14 sm:h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 px-3 sm:px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="relative max-w-xs sm:max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm sm:text-base hidden sm:inline">New Task</span>
        </button>

        <button className="relative p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
        </button>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/30">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
          />
          <div className="text-sm hidden lg:block">
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-gray-500">Project Manager</p>
          </div>
        </div>
        
        {/* Mobile profile */}
        <div className="sm:hidden">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}

export default Header
