import initSqlJs, { Database } from 'sql.js';

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
  private db: Database | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });
      
      // Try to load existing database from localStorage
      const savedDb = this.loadDatabase();
      if (savedDb) {
        this.db = new SQL.Database(savedDb);
      } else {
        this.db = new SQL.Database();
        await this.createTables();
        await this.seedInitialData();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create tasks table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        cardLink TEXT,
        status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Review', 'Completed')),
        priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
        assignee TEXT NOT NULL,
        avatar TEXT,
        dueDate TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        pullRequest TEXT,
        videoLink TEXT
      )
    `);

    // Create team_members table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        location TEXT,
        avatar TEXT,
        joinDate TEXT NOT NULL,
        tasksCompleted INTEGER DEFAULT 0,
        currentTasks INTEGER DEFAULT 0,
        skills TEXT, -- JSON string
        status TEXT NOT NULL CHECK (status IN ('online', 'away', 'offline'))
      )
    `);

    // Create deployments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS deployments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL,
        environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
        deployedAt DATETIME,
        approvedAt DATETIME,
        status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
        FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
      )
    `);

    // Create notes table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('dev', 'testing', 'project_owner')),
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
      )
    `);
  }

  private async seedInitialData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Check if data already exists
    const existingMembers = this.db.exec('SELECT COUNT(*) as count FROM team_members');
    const memberCount = existingMembers[0]?.values[0]?.[0] as number || 0;
    
    const existingTasks = this.db.exec('SELECT COUNT(*) as count FROM tasks');
    const taskCount = existingTasks[0]?.values[0]?.[0] as number || 0;

    // Only seed if tables are empty
    if (memberCount === 0) {
      // Seed team members
      const teamMembers = [
        {
          name: 'Sarah Chen',
          role: 'Senior Frontend Developer',
          email: 'sarah.chen@company.com',
          phone: '+1 (555) 123-4567',
          status: 'Active'
        },
        {
          name: 'Mike Johnson',
          role: 'Backend Developer',
          email: 'mike.johnson@company.com',
          phone: '+1 (555) 234-5678',
          status: 'Active'
        },
        {
          name: 'Emily Davis',
          role: 'UI/UX Designer',
          email: 'emily.davis@company.com',
          phone: '+1 (555) 345-6789',
          status: 'Active'
        },
        {
          name: 'David Wilson',
          role: 'DevOps Engineer',
          email: 'david.wilson@company.com',
          phone: '+1 (555) 456-7890',
          status: 'Away'
        }
      ];

      for (const member of teamMembers) {
        this.db.run(
          `INSERT OR IGNORE INTO team_members (name, role, email, phone, status) 
           VALUES (?, ?, ?, ?, ?)`,
          [member.name, member.role, member.email, member.phone, member.status]
        );
      }
    }

    if (taskCount === 0) {
      // Seed tasks
      const tasks = [
        {
          title: 'Create Project via project lists',
          cardLink: 'https://trello.com/c/MSpWDVZB/1642-create-project-via-project-lists',
          status: 'In Progress',
          priority: 'High',
          assignee: 'Sarah Chen',
          dueDate: '2024-01-15',
          pullRequest: 'https://github.com/company/project/pull/123',
          videoLink: 'https://loom.com/share/demo-video'
        },
        {
          title: 'User Authentication System',
          cardLink: 'https://trello.com/c/ABC123/1643-user-authentication-system',
          status: 'Review',
          priority: 'Medium',
          assignee: 'Mike Johnson',
          dueDate: '2024-01-18',
          pullRequest: 'https://github.com/company/project/pull/124'
        },
        {
          title: 'Dashboard Analytics Widget',
          status: 'Completed',
          priority: 'Low',
          assignee: 'Emily Davis',
          dueDate: '2024-01-20'
        },
        {
          title: 'Design new landing page',
          status: 'To Do',
          priority: 'High',
          assignee: 'Sarah Chen',
          dueDate: '2024-01-20'
        },
        {
          title: 'Setup CI/CD pipeline',
          status: 'To Do',
          priority: 'Medium',
          assignee: 'Mike Johnson',
          dueDate: '2024-01-22'
        },
        {
          title: 'API Documentation',
          status: 'Review',
          priority: 'Low',
          assignee: 'Emily Davis',
          dueDate: '2024-01-16'
        }
      ];

      for (const task of tasks) {
        this.db.run(
          `INSERT INTO tasks (title, cardLink, status, priority, assignee, dueDate, pullRequest, videoLink) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [task.title, task.cardLink || null, task.status, task.priority, task.assignee, task.dueDate, task.pullRequest || null, task.videoLink || null]
        );
      }
    }

    this.saveDatabase();
  }

  private saveDatabase(): void {
    if (!this.db) return;
    const data = this.db.export();
    localStorage.setItem('taskManagementDB', JSON.stringify(Array.from(data)));
  }

  private loadDatabase(): Uint8Array | null {
    const data = localStorage.getItem('taskManagementDB');
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return new Uint8Array(parsed);
    } catch {
      return null;
    }
  }

  public clearDatabase(): void {
    localStorage.removeItem('taskManagementDB');
    this.db = null;
    this.isInitialized = false;
  }

  // Task CRUD operations
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.run(
      `INSERT INTO tasks (title, cardLink, status, priority, assignee, avatar, dueDate, pullRequest, videoLink) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task.title, task.cardLink || null, task.status, task.priority, task.assignee, task.avatar || null, task.dueDate, task.pullRequest || null, task.videoLink || null]
    );

    this.saveDatabase();
    return { ...task, id: result.lastInsertRowid as number };
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC');
    const tasks: Task[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      tasks.push({
        id: row.id as number,
        title: row.title as string,
        cardLink: row.cardLink as string || undefined,
        status: row.status as Task['status'],
        priority: row.priority as Task['priority'],
        assignee: row.assignee as string,
        avatar: row.avatar as string || undefined,
        dueDate: row.dueDate as string,
        createdAt: row.createdAt as string,
        updatedAt: row.updatedAt as string,
        pullRequest: row.pullRequest as string || undefined,
        videoLink: row.videoLink as string || undefined
      });
    }
    
    stmt.free();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM tasks WHERE id = ?');
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        id: row.id as number,
        title: row.title as string,
        cardLink: row.cardLink as string || undefined,
        status: row.status as Task['status'],
        priority: row.priority as Task['priority'],
        assignee: row.assignee as string,
        avatar: row.avatar as string || undefined,
        dueDate: row.dueDate as string,
        createdAt: row.createdAt as string,
        updatedAt: row.updatedAt as string,
        pullRequest: row.pullRequest as string || undefined,
        videoLink: row.videoLink as string || undefined
      };
    }
    
    stmt.free();
    return null;
  }

  async updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    this.db.run(
      `UPDATE tasks SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    this.saveDatabase();
    return this.getTaskById(id);
  }

  async deleteTask(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    this.saveDatabase();
    return result.changes > 0;
  }

  // Team Member CRUD operations
  async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.run(
      `INSERT INTO team_members (name, role, email, phone, location, avatar, joinDate, tasksCompleted, currentTasks, skills, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [member.name, member.role, member.email, member.phone, member.location, member.avatar, member.joinDate, member.tasksCompleted, member.currentTasks, JSON.stringify(member.skills), member.status]
    );

    this.saveDatabase();
    return { ...member, id: result.lastInsertRowid as number };
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare('SELECT * FROM team_members ORDER BY name');
    const members: TeamMember[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      members.push({
        id: row.id as number,
        name: row.name as string,
        role: row.role as string,
        email: row.email as string,
        phone: row.phone as string,
        location: row.location as string,
        avatar: row.avatar as string,
        joinDate: row.joinDate as string,
        tasksCompleted: row.tasksCompleted as number,
        currentTasks: row.currentTasks as number,
        skills: JSON.parse(row.skills as string),
        status: row.status as TeamMember['status']
      });
    }
    
    stmt.free();
    return members;
  }

  async updateTeamMember(id: number, updates: Partial<Omit<TeamMember, 'id'>>): Promise<TeamMember | null> {
    if (!this.db) throw new Error('Database not initialized');

    const processedUpdates = { ...updates };
    if (processedUpdates.skills) {
      processedUpdates.skills = JSON.stringify(processedUpdates.skills) as any;
    }

    const setClause = Object.keys(processedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(processedUpdates);
    
    this.db.run(
      `UPDATE team_members SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    this.saveDatabase();
    const stmt = this.db.prepare('SELECT * FROM team_members WHERE id = ?');
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        id: row.id as number,
        name: row.name as string,
        role: row.role as string,
        email: row.email as string,
        phone: row.phone as string,
        location: row.location as string,
        avatar: row.avatar as string,
        joinDate: row.joinDate as string,
        tasksCompleted: row.tasksCompleted as number,
        currentTasks: row.currentTasks as number,
        skills: JSON.parse(row.skills as string),
        status: row.status as TeamMember['status']
      };
    }
    
    stmt.free();
    return null;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.run('DELETE FROM team_members WHERE id = ?', [id]);
    this.saveDatabase();
    return result.changes > 0;
  }

  // Get tasks by status for TaskBoard
  async getTasksByStatus(): Promise<Record<string, Task[]>> {
    const tasks = await this.getTasks();
    return tasks.reduce((acc, task) => {
      const status = task.status.toLowerCase().replace(' ', '');
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }

  // Get task statistics for Dashboard
  async getTaskStats(): Promise<{ total: number; inProgress: number; review: number; completed: number }> {
    if (!this.db) throw new Error('Database not initialized');

    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'Review' THEN 1 ELSE 0 END) as review,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
      FROM tasks
    `);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        total: row.total as number,
        inProgress: row.inProgress as number,
        review: row.review as number,
        completed: row.completed as number
      };
    }
    
    stmt.free();
    return { total: 0, inProgress: 0, review: 0, completed: 0 };
  }
}

export const databaseService = new DatabaseService();