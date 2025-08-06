# API Reference

This document provides detailed information about the application's internal APIs, database service, and component interfaces.

## Database Service

The application uses a client-side SQLite database through SQL.js. All database operations are handled by the `DatabaseService` class.

### Initialization

```typescript
import { databaseService } from './services/database'

// Initialize the database (automatically called on app start)
await databaseService.initialize()
```

## Data Models

### Task Interface

```typescript
interface Task {
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
```

### TeamMember Interface

```typescript
interface TeamMember {
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
```

### Deployment Interface

```typescript
interface Deployment {
  id?: number;
  taskId: number;
  environment: 'development' | 'staging' | 'production';
  deployedAt?: string;
  approvedAt?: string;
  status: 'pending' | 'success' | 'failed';
}
```

### Note Interface

```typescript
interface Note {
  id?: number;
  taskId: number;
  type: 'dev' | 'testing' | 'project_owner';
  content: string;
  author: string;
  createdAt?: string;
}
```

## Task Management API

### Create Task

```typescript
const newTask = await databaseService.createTask({
  title: 'Implement user authentication',
  status: 'To Do',
  priority: 'High',
  assignee: 'John Doe',
  dueDate: '2024-02-15',
  cardLink: 'https://trello.com/c/abc123',
  pullRequest: 'https://github.com/repo/pull/123',
  videoLink: 'https://loom.com/share/demo'
});
```

**Returns**: `Promise<Task>` - The created task with generated ID

### Get All Tasks

```typescript
const tasks = await databaseService.getTasks();
```

**Returns**: `Promise<Task[]>` - Array of all tasks

### Get Task by ID

```typescript
const task = await databaseService.getTaskById(1);
```

**Parameters**:
- `id: number` - Task ID

**Returns**: `Promise<Task | null>` - Task object or null if not found

### Update Task

```typescript
const updatedTask = await databaseService.updateTask(1, {
  status: 'In Progress',
  assignee: 'Jane Smith'
});
```

**Parameters**:
- `id: number` - Task ID
- `updates: Partial<Omit<Task, 'id'>>` - Fields to update

**Returns**: `Promise<Task | null>` - Updated task or null if not found

### Delete Task

```typescript
const success = await databaseService.deleteTask(1);
```

**Parameters**:
- `id: number` - Task ID

**Returns**: `Promise<boolean>` - Success status

### Get Tasks by Status

```typescript
const tasksByStatus = await databaseService.getTasksByStatus();
// Returns: { 'To Do': Task[], 'In Progress': Task[], ... }
```

**Returns**: `Promise<Record<string, Task[]>>` - Tasks grouped by status

### Get Task Statistics

```typescript
const stats = await databaseService.getTaskStats();
// Returns: { total: 10, inProgress: 3, review: 2, completed: 5 }
```

**Returns**: `Promise<{ total: number; inProgress: number; review: number; completed: number }>`

## Team Management API

### Create Team Member

```typescript
const newMember = await databaseService.createTeamMember({
  name: 'Alice Johnson',
  role: 'Frontend Developer',
  email: 'alice@company.com',
  phone: '+1-555-0123',
  location: 'San Francisco, CA',
  avatar: 'https://example.com/avatar.jpg',
  joinDate: '2024-01-15',
  tasksCompleted: 0,
  currentTasks: 0,
  skills: ['React', 'TypeScript', 'CSS'],
  status: 'online'
});
```

**Returns**: `Promise<TeamMember>` - The created team member with generated ID

### Get All Team Members

```typescript
const members = await databaseService.getTeamMembers();
```

**Returns**: `Promise<TeamMember[]>` - Array of all team members

### Update Team Member

```typescript
const updatedMember = await databaseService.updateTeamMember(1, {
  status: 'away',
  currentTasks: 3
});
```

**Parameters**:
- `id: number` - Team member ID
- `updates: Partial<Omit<TeamMember, 'id'>>` - Fields to update

**Returns**: `Promise<TeamMember | null>` - Updated team member or null if not found

### Delete Team Member

```typescript
const success = await databaseService.deleteTeamMember(1);
```

**Parameters**:
- `id: number` - Team member ID

**Returns**: `Promise<boolean>` - Success status

## Database Context

The application uses React Context to provide database access throughout the component tree.

### Using the Database Context

```typescript
import { useDatabaseContext } from '../contexts/DatabaseContext';

const MyComponent = () => {
  const {
    tasks,
    teamMembers,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTaskStats
  } = useDatabaseContext();

  // Use the provided data and methods
};
```

### Context Properties

- `tasks: Task[]` - Array of all tasks
- `teamMembers: TeamMember[]` - Array of all team members
- `loading: boolean` - Loading state
- `error: string | null` - Error message if any
- `createTask: (task: Omit<Task, 'id'>) => Promise<void>` - Create task function
- `updateTask: (id: number, updates: Partial<Omit<Task, 'id'>>) => Promise<void>` - Update task function
- `deleteTask: (id: number) => Promise<void>` - Delete task function
- `createTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>` - Create team member function
- `updateTeamMember: (id: number, updates: Partial<Omit<TeamMember, 'id'>>) => Promise<void>` - Update team member function
- `deleteTeamMember: (id: number) => Promise<void>` - Delete team member function
- `getTaskStats: () => Promise<{ total: number; inProgress: number; review: number; completed: number }>` - Get task statistics

## Component APIs

### StatsCard Component

```typescript
interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

<StatsCard
  title="Total Tasks"
  value="24"
  change="+12%"
  trend="up"
  icon={CheckSquare}
  color="from-blue-500 to-blue-600"
/>
```

### Sidebar Component

```typescript
interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

<Sidebar
  activeView="dashboard"
  setActiveView={setActiveView}
/>
```

## Error Handling

All database operations include error handling:

```typescript
try {
  const task = await databaseService.createTask(taskData);
  // Handle success
} catch (error) {
  console.error('Failed to create task:', error);
  // Handle error
}
```

## Data Validation

The application includes basic validation:

- Required fields are enforced at the TypeScript level
- Date formats are validated
- Email formats are checked for team members
- Status and priority values are restricted to predefined options

## Performance Considerations

- Database operations are asynchronous
- Large datasets are handled efficiently with SQL queries
- Component re-renders are optimized with React hooks
- Local storage is used for persistence

## Security Notes

- All data is stored locally in the browser
- No sensitive data is transmitted over the network
- Input sanitization is recommended for production use
- Consider implementing authentication for multi-user scenarios

## Migration and Backup

### Database Reset

```typescript
// Clear all data and reinitialize
databaseService.clearDatabase();
await databaseService.initialize();
```

### Data Export

To export data, access the browser's localStorage:

```javascript
// In browser console
const data = localStorage.getItem('task_management_db');
console.log(data); // Copy this for backup
```

### Data Import

```javascript
// In browser console
localStorage.setItem('task_management_db', backupData);
// Refresh the application
```