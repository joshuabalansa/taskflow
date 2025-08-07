import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { databaseService, Task, TeamMember } from '../services/database';
import LoadingScreen from '../components/LoadingScreen';

interface DatabaseContextType {
  isInitialized: boolean;
  tasks: Task[];
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  
  // Task operations
  createTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (id: number, updates: Partial<Omit<Task, 'id'>>) => Promise<Task | null>;
  deleteTask: (id: number) => Promise<boolean>;
  refreshTasks: () => Promise<void>;
  
  // Team member operations
  createTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<TeamMember>;
  updateTeamMember: (id: number, updates: Partial<Omit<TeamMember, 'id'>>) => Promise<TeamMember | null>;
  deleteTeamMember: (id: number) => Promise<boolean>;
  refreshTeamMembers: () => Promise<void>;
  
  // Database operations
  clearDatabase: () => void;
  
  // Utility functions
  getTasksByStatus: () => Promise<Record<string, Task[]>>;
  getTaskStats: () => Promise<{ total: number; inProgress: number; review: number; completed: number }>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await databaseService.initialize();
      setIsInitialized(true);
      
      // Load initial data
      await Promise.all([
        refreshTasks(),
        refreshTeamMembers()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
      console.error('Database initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = async () => {
    try {
      const tasksData = await databaseService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    }
  };

  const refreshTeamMembers = async () => {
    try {
      const membersData = await databaseService.getTeamMembers();
      setTeamMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
      console.error('Error fetching team members:', err);
    }
  };

  const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    try {
      const newTask = await databaseService.createTask(task);
      await refreshTasks();
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTask = async (id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null> => {
    try {
      const updatedTask = await databaseService.updateTask(id, updates);
      await refreshTasks();
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      const result = await databaseService.deleteTask(id);
      await refreshTasks();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    try {
      const newMember = await databaseService.createTeamMember(member);
      await refreshTeamMembers();
      return newMember;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create team member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTeamMember = async (id: number, updates: Partial<Omit<TeamMember, 'id'>>): Promise<TeamMember | null> => {
    try {
      const updatedMember = await databaseService.updateTeamMember(id, updates);
      await refreshTeamMembers();
      return updatedMember;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update team member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTeamMember = async (id: number): Promise<boolean> => {
    try {
      const result = await databaseService.deleteTeamMember(id);
      await refreshTeamMembers();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete team member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getTasksByStatus = async (): Promise<Record<string, Task[]>> => {
    try {
      return await databaseService.getTasksByStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get tasks by status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getTaskStats = async (): Promise<{ total: number; inProgress: number; review: number; completed: number }> => {
    try {
      return await databaseService.getTaskStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get task stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const clearDatabase = () => {
    databaseService.clearDatabase();
    setTasks([]);
    setTeamMembers([]);
    setError(null);
  };

  const value: DatabaseContextType = {
    isInitialized,
    tasks,
    teamMembers,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    refreshTeamMembers,
    clearDatabase,
    getTasksByStatus,
    getTaskStats
  };

  // Show loading screen while initializing
  if (loading && !isInitialized) {
    return (
      <LoadingScreen 
        message="Connecting to your workspace..." 
        showProgress={true} 
      />
    );
  }

  // Show error screen if initialization failed
  if (error && !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Connection Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">
              Please make sure your database is set up correctly. 
              Check the SETUP_INSTRUCTIONS.md file for help.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};