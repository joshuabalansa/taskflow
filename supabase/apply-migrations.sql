-- Apply all migrations script for Task Management Dashboard
-- Run this file in your Supabase SQL Editor or psql to apply all migrations at once

-- Migration 001: Initial Schema
-- =============================

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
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Migration 002: Seed Data
-- ========================

-- Insert initial team members (only if table is empty)
INSERT INTO team_members (name, role, email, phone, location, avatar, join_date, tasks_completed, current_tasks, skills, status)
SELECT * FROM (
    VALUES
    ('Sarah Chen', 'Senior Frontend Developer', 'sarah.chen@company.com', '+1 (555) 123-4567', 'San Francisco, CA', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '2023-01-15', 12, 3, '["React", "TypeScript", "CSS", "JavaScript", "Frontend Architecture"]'::jsonb, 'online'),
    ('Mike Johnson', 'Backend Developer', 'mike.johnson@company.com', '+1 (555) 234-5678', 'Austin, TX', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2023-02-01', 8, 2, '["Node.js", "Python", "PostgreSQL", "API Development", "Docker"]'::jsonb, 'online'),
    ('Emily Davis', 'UI/UX Designer', 'emily.davis@company.com', '+1 (555) 345-6789', 'New York, NY', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2023-03-10', 15, 1, '["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"]'::jsonb, 'online'),
    ('David Wilson', 'DevOps Engineer', 'david.wilson@company.com', '+1 (555) 456-7890', 'Seattle, WA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2023-01-20', 6, 4, '["AWS", "Kubernetes", "CI/CD", "Terraform", "Monitoring"]'::jsonb, 'away'),
    ('Lisa Rodriguez', 'Product Manager', 'lisa.rodriguez@company.com', '+1 (555) 567-8901', 'Los Angeles, CA', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2023-04-05', 10, 2, '["Product Strategy", "Agile", "Analytics", "User Stories", "Roadmapping"]'::jsonb, 'online'),
    ('Alex Thompson', 'QA Engineer', 'alex.thompson@company.com', '+1 (555) 678-9012', 'Chicago, IL', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2023-02-15', 9, 3, '["Test Automation", "Selenium", "Jest", "Quality Assurance", "Bug Tracking"]'::jsonb, 'online')
) AS new_members(name, role, email, phone, location, avatar, join_date, tasks_completed, current_tasks, skills, status)
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE team_members.email = new_members.email);

-- Insert initial tasks (only if table is empty)
INSERT INTO tasks (title, card_link, status, priority, assignee, avatar, due_date, pull_request, video_link)
SELECT * FROM (
    VALUES
    ('Create Project via project lists', 'https://trello.com/c/MSpWDVZB/1642-create-project-via-project-lists', 'In Progress', 'High', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '2024-01-15', 'https://github.com/company/project/pull/123', 'https://loom.com/share/demo-video'),
    ('User Authentication System', 'https://trello.com/c/ABC123/1643-user-authentication-system', 'Review', 'High', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2024-01-18', 'https://github.com/company/project/pull/124', NULL),
    ('Dashboard Analytics Widget', NULL, 'Completed', 'Medium', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2024-01-20', 'https://github.com/company/project/pull/125', NULL),
    ('Design new landing page', 'https://trello.com/c/DEF456/1644-design-new-landing-page', 'To Do', 'High', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2024-01-22', NULL, NULL),
    ('Setup CI/CD pipeline', 'https://trello.com/c/GHI789/1645-setup-cicd-pipeline', 'In Progress', 'Medium', 'David Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2024-01-25', NULL, NULL)
) AS new_tasks(title, card_link, status, priority, assignee, avatar, due_date, pull_request, video_link)
WHERE NOT EXISTS (SELECT 1 FROM tasks LIMIT 1);

-- Migration 003: Security and Functions
-- =====================================

-- Enable Row Level Security on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for authenticated users - customize as needed)
DROP POLICY IF EXISTS "Allow all operations on tasks for authenticated users" ON tasks;
CREATE POLICY "Allow all operations on tasks for authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on team_members for authenticated users" ON team_members;
CREATE POLICY "Allow all operations on team_members for authenticated users" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on deployments for authenticated users" ON deployments;
CREATE POLICY "Allow all operations on deployments for authenticated users" ON deployments
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all operations on notes for authenticated users" ON notes;
CREATE POLICY "Allow all operations on notes for authenticated users" ON notes
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'All migrations applied successfully!';
    RAISE NOTICE 'Database is ready for the Task Management Dashboard.';
    RAISE NOTICE 'Tables created: tasks, team_members, deployments, notes';
    RAISE NOTICE 'Sample data inserted for immediate testing.';
END $$;