-- Initial schema migration for Task Management Dashboard
-- This creates all the core tables with proper constraints and indexes

-- Enable UUID extension for better ID generation (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    card_link TEXT,
    status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Review', 'Completed')),
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    assignee TEXT NOT NULL,
    avatar TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    pull_request TEXT,
    video_link TEXT
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    location TEXT,
    avatar TEXT,
    join_date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    current_tasks INTEGER DEFAULT 0,
    skills JSONB DEFAULT '[]'::jsonb, -- Using JSONB for better performance
    status TEXT NOT NULL CHECK (status IN ('online', 'away', 'offline'))
);

-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
    deployed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('dev', 'testing', 'project_owner')),
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks (assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);

CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members (email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members (status);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members (role);

CREATE INDEX IF NOT EXISTS idx_deployments_task_id ON deployments (task_id);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments (environment);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments (status);
CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at ON deployments (deployed_at);

CREATE INDEX IF NOT EXISTS idx_notes_task_id ON notes (task_id);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes (type);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on tasks table
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Main tasks table for project management';
COMMENT ON TABLE team_members IS 'Team members and their information';
COMMENT ON TABLE deployments IS 'Deployment tracking for tasks';
COMMENT ON TABLE notes IS 'Notes and comments related to tasks';

COMMENT ON COLUMN tasks.status IS 'Current status of the task';
COMMENT ON COLUMN tasks.priority IS 'Priority level of the task';
COMMENT ON COLUMN team_members.skills IS 'JSON array of team member skills';
COMMENT ON COLUMN deployments.environment IS 'Deployment environment';
COMMENT ON COLUMN notes.type IS 'Type of note (dev, testing, project_owner)';