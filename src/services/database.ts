import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Task {
  id?: number;
  title: string;
  cardLink?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  avatar?: string;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
  pullRequest?: string;
  videoLink?: string;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  joinDate: string;
  tasksCompleted: number;
  currentTasks: number;
  skills: string[];
  status: 'online' | 'away' | 'offline';
}

export interface Deployment {
  id?: number;
  taskId: number;
  environment: 'development' | 'staging' | 'production';
  deployedAt?: string;
  approvedAt?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface Note {
  id?: number;
  taskId: number;
  type: 'dev' | 'testing' | 'project_owner';
  content: string;
  author: string;
  createdAt?: string;
}

class DatabaseService {
  private supabase: SupabaseClient;
  private isInitialized = false;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env file.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Test the connection
      const { error } = await this.supabase.from('tasks').select('count', { count: 'exact', head: true });
      if (error && !error.message.includes('relation "tasks" does not exist')) {
        throw error;
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Supabase connection:', error);
      throw error;
    }
  }

  // Task CRUD operations
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const taskData = {
      title: task.title,
      card_link: task.cardLink || null,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      avatar: task.avatar || null,
      due_date: task.dueDate,
      pull_request: task.pullRequest || null,
      video_link: task.videoLink || null
    };

    const { data, error } = await this.supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw error;
    
    return this.mapTaskFromDb(data);
  }

  async getTasks(): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(this.mapTaskFromDb);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return this.mapTaskFromDb(data);
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null> {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.cardLink !== undefined) updateData.card_link = updates.cardLink;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.assignee !== undefined) updateData.assignee = updates.assignee;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
    if (updates.pullRequest !== undefined) updateData.pull_request = updates.pullRequest;
    if (updates.videoLink !== undefined) updateData.video_link = updates.videoLink;

    const { data, error } = await this.supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return this.mapTaskFromDb(data);
  }

  async deleteTask(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Team Member CRUD operations
  async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const memberData = {
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone || null,
      location: member.location || null,
      avatar: member.avatar || null,
      join_date: member.joinDate,
      tasks_completed: member.tasksCompleted || 0,
      current_tasks: member.currentTasks || 0,
      skills: member.skills || [],
      status: member.status
    };

    const { data, error } = await this.supabase
      .from('team_members')
      .insert([memberData])
      .select()
      .single();

    if (error) throw error;
    
    return this.mapTeamMemberFromDb(data);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data.map(this.mapTeamMemberFromDb);
  }

  async updateTeamMember(id: number, updates: Partial<Omit<TeamMember, 'id'>>): Promise<TeamMember | null> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.location !== undefined) updateData.location = updates.location;
    if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
    if (updates.joinDate !== undefined) updateData.join_date = updates.joinDate;
    if (updates.tasksCompleted !== undefined) updateData.tasks_completed = updates.tasksCompleted;
    if (updates.currentTasks !== undefined) updateData.current_tasks = updates.currentTasks;
    if (updates.skills !== undefined) updateData.skills = updates.skills;
    if (updates.status !== undefined) updateData.status = updates.status;

    const { data, error } = await this.supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return this.mapTeamMemberFromDb(data);
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Utility methods
  async getTasksByStatus(): Promise<Record<string, Task[]>> {
    const tasks = await this.getTasks();
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }

  async getTaskStats(): Promise<{ total: number; inProgress: number; review: number; completed: number }> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      inProgress: data.filter(t => t.status === 'In Progress').length,
      review: data.filter(t => t.status === 'Review').length,
      completed: data.filter(t => t.status === 'Completed').length
    };

    return stats;
  }

  // Database mapping helpers
  private mapTaskFromDb(dbTask: any): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      cardLink: dbTask.card_link,
      status: dbTask.status,
      priority: dbTask.priority,
      assignee: dbTask.assignee,
      avatar: dbTask.avatar,
      dueDate: dbTask.due_date,
      createdAt: dbTask.created_at,
      updatedAt: dbTask.updated_at,
      pullRequest: dbTask.pull_request,
      videoLink: dbTask.video_link
    };
  }

  private mapTeamMemberFromDb(dbMember: any): TeamMember {
    return {
      id: dbMember.id,
      name: dbMember.name,
      role: dbMember.role,
      email: dbMember.email,
      phone: dbMember.phone || '',
      location: dbMember.location || '',
      avatar: dbMember.avatar || '',
      joinDate: dbMember.join_date,
      tasksCompleted: dbMember.tasks_completed || 0,
      currentTasks: dbMember.current_tasks || 0,
      skills: dbMember.skills || [],
      status: dbMember.status
    };
  }

  // Legacy methods for compatibility
  clearDatabase(): void {
    console.warn('clearDatabase() is not supported with Supabase. Use Supabase dashboard to manage data.');
  }
}

export const databaseService = new DatabaseService();