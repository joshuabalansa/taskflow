-- Quick setup script for Supabase SQL Editor
-- Copy and paste this entire script into your Supabase SQL Editor

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
    skills JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks (assignee);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members (email);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members (status);
CREATE INDEX IF NOT EXISTS idx_deployments_task_id ON deployments (task_id);
CREATE INDEX IF NOT EXISTS idx_deployments_environment ON deployments (environment);
CREATE INDEX IF NOT EXISTS idx_notes_task_id ON notes (task_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tasks table
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (allow all operations)
CREATE POLICY "Allow all operations for authenticated users" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON team_members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON deployments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON notes
    FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO team_members (name, role, email, phone, location, avatar, join_date, tasks_completed, current_tasks, skills, status) VALUES
('Sarah Chen', 'Senior Frontend Developer', 'sarah.chen@company.com', '+1 (555) 123-4567', 'San Francisco, CA', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '2023-01-15', 45, 3, '["React", "TypeScript", "CSS", "JavaScript"]', 'online'),
('Mike Johnson', 'Backend Developer', 'mike.johnson@company.com', '+1 (555) 234-5678', 'Austin, TX', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '2023-02-20', 38, 2, '["Node.js", "Python", "PostgreSQL", "Docker"]', 'away'),
('Emily Davis', 'UI/UX Designer', 'emily.davis@company.com', '+1 (555) 345-6789', 'New York, NY', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '2023-03-10', 52, 4, '["Figma", "Adobe XD", "Sketch", "Prototyping"]', 'online'),
('David Wilson', 'DevOps Engineer', 'david.wilson@company.com', '+1 (555) 456-7890', 'Seattle, WA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '2023-04-05', 29, 1, '["AWS", "Kubernetes", "Terraform", "CI/CD"]', 'offline')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, card_link, status, priority, assignee, avatar, due_date, pull_request, video_link) VALUES
('Create Project via project lists', 'https://trello.com/c/MSpWDVZB/1642-create-project-via-project-lists', 'In Progress', 'High', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', '2024-01-15', 'https://github.com/company/project/pull/123', 'https://loom.com/share/demo-video'),
('User Authentication System', 'https://trello.com/c/ABC123/1643-user-authentication-system', 'Review', 'Medium', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', '2024-01-18', 'https://github.com/company/project/pull/124', NULL),
('Dashboard Analytics Widget', NULL, 'Completed', 'Low', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', '2024-01-20', NULL, NULL),
('Design new landing page', NULL, 'To Do', 'High', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', '2024-01-20', NULL, NULL),
('Setup CI/CD pipeline', NULL, 'To Do', 'Medium', 'David Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', '2024-01-22', NULL, NULL),
('API Documentation', NULL, 'Review', 'Low', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', '2024-01-16', NULL, NULL);

-- Success message
SELECT 'Database schema created successfully! You can now use the Task Management Dashboard.' as message;