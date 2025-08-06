import React, { useState, useEffect } from 'react'
import { Plus, Filter, Search, Edit, Trash2, X } from 'lucide-react'
import { useDatabaseContext } from '../contexts/DatabaseContext'
import { Task } from '../services/database'

const TaskBoard: React.FC = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, teamMembers } = useDatabaseContext();
  const [searchTerm, setSearchTerm] = useState('')
  const [tasksByStatus, setTasksByStatus] = useState<Record<string, Task[]>>({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({
    title: '',
    status: 'To Do',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
    cardLink: '',
    pullRequest: '',
    videoLink: ''
  });

  useEffect(() => {
    organizeTasksByStatus();
  }, [tasks, searchTerm]);

  const organizeTasksByStatus = () => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const organized = {
      todo: filtered.filter(task => task.status === 'To Do'),
      progress: filtered.filter(task => task.status === 'In Progress'),
      review: filtered.filter(task => task.status === 'Review'),
      done: filtered.filter(task => task.status === 'Completed')
    };
    
    setTasksByStatus(organized);
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100', count: tasksByStatus.todo?.length || 0 },
    { id: 'progress', title: 'In Progress', color: 'bg-blue-100', count: tasksByStatus.progress?.length || 0 },
    { id: 'review', title: 'Review', color: 'bg-yellow-100', count: tasksByStatus.review?.length || 0 },
    { id: 'done', title: 'Done', color: 'bg-green-100', count: tasksByStatus.done?.length || 0 }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: '',
      dueDate: '',
      cardLink: '',
      pullRequest: '',
      videoLink: ''
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
      cardLink: task.cardLink || '',
      pullRequest: task.pullRequest || '',
      videoLink: task.videoLink || ''
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id!, taskForm);
      } else {
        await createTask(taskForm);
      }
      setShowTaskModal(false);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    try {
      await updateTask(task.id!, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading tasks: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
          <p className="text-gray-600 mt-1">Manage and track your team's tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
              </div>
              <span className="bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                {column.count}
              </span>
            </div>

            <div className="space-y-3">
              {tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task) => (
                <div key={task.id} className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:bg-white/40 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800 flex-1 pr-2">{task.title}</h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id!)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {getInitials(task.assignee)}
                      </div>
                      <span className="text-sm text-gray-600">{task.assignee}</span>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value as Task['status'])}
                      className="text-xs bg-white/50 border border-white/60 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleCreateTask}
                className="w-full py-3 border-2 border-dashed border-white/40 rounded-xl text-gray-500 hover:border-white/60 hover:text-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as Task['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee *</label>
                <select
                  required
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select assignee</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Link</label>
                <input
                  type="url"
                  value={taskForm.cardLink}
                  onChange={(e) => setTaskForm({ ...taskForm, cardLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://trello.com/c/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pull Request</label>
                <input
                  type="url"
                  value={taskForm.pullRequest}
                  onChange={(e) => setTaskForm({ ...taskForm, pullRequest: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Link</label>
                <input
                  type="url"
                  value={taskForm.videoLink}
                  onChange={(e) => setTaskForm({ ...taskForm, videoLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://loom.com/share/..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskBoard
