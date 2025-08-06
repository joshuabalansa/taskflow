import React from 'react'
import { Search, Plus, Bell, User } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks, projects, or team members..."
            className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Task</span>
        </button>

        <button className="relative p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-white/30">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-medium text-gray-800">John Doe</p>
            <p className="text-gray-500">Project Manager</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
