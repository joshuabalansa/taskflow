-- Seed data migration for Task Management Dashboard
-- This populates the database with initial sample data

-- Insert initial team members
INSERT INTO team_members (name, role, email, phone, location, avatar, join_date, tasks_completed, current_tasks, skills, status) VALUES
('Sarah Chen', 'Senior Frontend Developer', 'sarah.chen@company.com', '+1 (555) 123-4567', 'San Francisco, CA', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '2023-01-15', 12, 3, '["React", "TypeScript", "CSS", "JavaScript", "Frontend Architecture"]'::jsonb, 'online'),
('Mike Johnson', 'Backend Developer', 'mike.johnson@company.com', '+1 (555) 234-5678', 'Austin, TX', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2023-02-01', 8, 2, '["Node.js", "Python", "PostgreSQL", "API Development", "Docker"]'::jsonb, 'online'),
('Emily Davis', 'UI/UX Designer', 'emily.davis@company.com', '+1 (555) 345-6789', 'New York, NY', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2023-03-10', 15, 1, '["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"]'::jsonb, 'online'),
('David Wilson', 'DevOps Engineer', 'david.wilson@company.com', '+1 (555) 456-7890', 'Seattle, WA', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2023-01-20', 6, 4, '["AWS", "Kubernetes", "CI/CD", "Terraform", "Monitoring"]'::jsonb, 'away'),
('Lisa Rodriguez', 'Product Manager', 'lisa.rodriguez@company.com', '+1 (555) 567-8901', 'Los Angeles, CA', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2023-04-05', 10, 2, '["Product Strategy", "Agile", "Analytics", "User Stories", "Roadmapping"]'::jsonb, 'online'),
('Alex Thompson', 'QA Engineer', 'alex.thompson@company.com', '+1 (555) 678-9012', 'Chicago, IL', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2023-02-15', 9, 3, '["Test Automation", "Selenium", "Jest", "Quality Assurance", "Bug Tracking"]'::jsonb, 'online')
ON CONFLICT (email) DO NOTHING;

-- Insert initial tasks
INSERT INTO tasks (title, card_link, status, priority, assignee, avatar, due_date, pull_request, video_link) VALUES
('Create Project via project lists', 'https://trello.com/c/MSpWDVZB/1642-create-project-via-project-lists', 'In Progress', 'High', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '2024-01-15', 'https://github.com/company/project/pull/123', 'https://loom.com/share/demo-video'),
('User Authentication System', 'https://trello.com/c/ABC123/1643-user-authentication-system', 'Review', 'High', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2024-01-18', 'https://github.com/company/project/pull/124', NULL),
('Dashboard Analytics Widget', NULL, 'Completed', 'Medium', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2024-01-20', 'https://github.com/company/project/pull/125', NULL),
('Design new landing page', 'https://trello.com/c/DEF456/1644-design-new-landing-page', 'To Do', 'High', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2024-01-22', NULL, NULL),
('Setup CI/CD pipeline', 'https://trello.com/c/GHI789/1645-setup-cicd-pipeline', 'In Progress', 'Medium', 'David Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2024-01-25', NULL, NULL),
('API Documentation', 'https://trello.com/c/JKL012/1646-api-documentation', 'Review', 'Low', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2024-01-16', 'https://github.com/company/project/pull/126', NULL),
('Mobile App Wireframes', NULL, 'To Do', 'Medium', 'Emily Davis', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', '2024-01-28', NULL, NULL),
('Database Optimization', 'https://trello.com/c/MNO345/1647-database-optimization', 'In Progress', 'High', 'Mike Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '2024-01-30', NULL, NULL),
('User Testing Session', NULL, 'To Do', 'Medium', 'Alex Thompson', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '2024-02-01', NULL, NULL),
('Security Audit', 'https://trello.com/c/PQR678/1648-security-audit', 'To Do', 'High', 'David Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2024-02-05', NULL, NULL);

-- Insert sample deployments
INSERT INTO deployments (task_id, environment, deployed_at, approved_at, status) VALUES
(1, 'development', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'success'),
(1, 'staging', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'success'),
(2, 'development', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'success'),
(2, 'staging', NOW() - INTERVAL '1 day', NULL, 'pending'),
(3, 'development', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', 'success'),
(3, 'staging', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'success'),
(3, 'production', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'success'),
(5, 'development', NOW() - INTERVAL '1 day', NULL, 'pending'),
(8, 'development', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'success');

-- Insert sample notes
INSERT INTO notes (task_id, type, content, author) VALUES
(1, 'dev', 'Implemented the basic project creation functionality. Need to add validation for project names.', 'Sarah Chen'),
(1, 'testing', 'Tested the happy path, works well. Need to test edge cases with special characters in project names.', 'Alex Thompson'),
(1, 'project_owner', 'Great progress! Please ensure the project creation follows our naming conventions.', 'Lisa Rodriguez'),
(2, 'dev', 'Authentication system is complete. Implemented JWT tokens and refresh token mechanism.', 'Mike Johnson'),
(2, 'testing', 'Found an issue with password reset flow. Creating a bug report.', 'Alex Thompson'),
(3, 'dev', 'Analytics widget is complete with real-time data updates and responsive design.', 'Emily Davis'),
(3, 'project_owner', 'Excellent work! The analytics provide great insights. Ready for production.', 'Lisa Rodriguez'),
(5, 'dev', 'CI/CD pipeline setup in progress. Configured GitHub Actions for automated testing.', 'David Wilson'),
(5, 'project_owner', 'This will greatly improve our deployment process. Looking forward to the completion.', 'Lisa Rodriguez'),
(8, 'dev', 'Database queries optimized. Reduced average response time by 40%.', 'Mike Johnson'),
(8, 'testing', 'Performance testing shows significant improvement. No regressions found.', 'Alex Thompson');

-- Update team member task counts based on current assignments
UPDATE team_members SET 
    current_tasks = (
        SELECT COUNT(*) 
        FROM tasks 
        WHERE tasks.assignee = team_members.name 
        AND tasks.status IN ('To Do', 'In Progress', 'Review')
    ),
    tasks_completed = (
        SELECT COUNT(*) 
        FROM tasks 
        WHERE tasks.assignee = team_members.name 
        AND tasks.status = 'Completed'
    );

-- Add some additional sample data for better demo experience
INSERT INTO tasks (title, status, priority, assignee, avatar, due_date) VALUES
('Code Review Guidelines', 'Completed', 'Low', 'Lisa Rodriguez', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '2024-01-10'),
('Performance Monitoring Setup', 'Completed', 'Medium', 'David Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '2024-01-12'),
('Bug Fix: Login Form Validation', 'Completed', 'High', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '2024-01-14');

-- Final update of team member statistics
UPDATE team_members SET 
    current_tasks = (
        SELECT COUNT(*) 
        FROM tasks 
        WHERE tasks.assignee = team_members.name 
        AND tasks.status IN ('To Do', 'In Progress', 'Review')
    ),
    tasks_completed = (
        SELECT COUNT(*) 
        FROM tasks 
        WHERE tasks.assignee = team_members.name 
        AND tasks.status = 'Completed'
    );