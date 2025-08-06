import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import TaskBoard from './components/TaskBoard'
import DeploymentTracker from './components/DeploymentTracker'
import TeamManagement from './components/TeamManagement'
import Analytics from './components/Analytics'
import { DatabaseProvider } from './contexts/DatabaseContext'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'tasks':
        return <TaskBoard />
      case 'deployments':
        return <DeploymentTracker />
      case 'team':
        return <TeamManagement />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-inter">
        <div className="flex">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {renderActiveView()}
            </main>
          </div>
        </div>
      </div>
    </DatabaseProvider>
  )
}

export default App
