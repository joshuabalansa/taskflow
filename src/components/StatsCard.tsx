import React from 'react'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend, icon: Icon, color }) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 hover:bg-white/25 transition-all duration-200 shadow-lg">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-500'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-gray-600 text-xs sm:text-sm">{title}</p>
      </div>
    </div>
  )
}

export default StatsCard
