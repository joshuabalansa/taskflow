-- Security and utility functions migration for Task Management Dashboard
-- This adds Row Level Security policies and useful database functions

-- Enable Row Level Security on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
-- Allow all operations for authenticated users (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on tasks for authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for team_members table
CREATE POLICY "Allow all operations on team_members for authenticated users" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for deployments table
CREATE POLICY "Allow all operations on deployments for authenticated users" ON deployments
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for notes table
CREATE POLICY "Allow all operations on notes for authenticated users" ON notes
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to get task statistics
CREATE OR REPLACE FUNCTION get_task_statistics()
RETURNS TABLE(
    total_tasks BIGINT,
    todo_tasks BIGINT,
    in_progress_tasks BIGINT,
    review_tasks BIGINT,
    completed_tasks BIGINT,
    high_priority_tasks BIGINT,
    medium_priority_tasks BIGINT,
    low_priority_tasks BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'To Do') as todo_tasks,
        COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'Review') as review_tasks,
        COUNT(*) FILTER (WHERE status = 'Completed') as completed_tasks,
        COUNT(*) FILTER (WHERE priority = 'High') as high_priority_tasks,
        COUNT(*) FILTER (WHERE priority = 'Medium') as medium_priority_tasks,
        COUNT(*) FILTER (WHERE priority = 'Low') as low_priority_tasks
    FROM tasks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get team member workload
CREATE OR REPLACE FUNCTION get_team_workload()
RETURNS TABLE(
    member_name TEXT,
    member_email TEXT,
    member_role TEXT,
    active_tasks BIGINT,
    completed_tasks_count INTEGER,
    workload_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH task_counts AS (
        SELECT 
            tm.name,
            tm.email,
            tm.role,
            tm.tasks_completed,
            COUNT(t.id) FILTER (WHERE t.status IN ('To Do', 'In Progress', 'Review')) as active_count,
            COUNT(t.id) as total_assigned
        FROM team_members tm
        LEFT JOIN tasks t ON t.assignee = tm.name
        GROUP BY tm.id, tm.name, tm.email, tm.role, tm.tasks_completed
    ),
    max_workload AS (
        SELECT MAX(active_count) as max_active FROM task_counts
    )
    SELECT 
        tc.name,
        tc.email,
        tc.role,
        tc.active_count,
        tc.tasks_completed,
        CASE 
            WHEN mw.max_active = 0 THEN 0
            ELSE ROUND((tc.active_count::NUMERIC / mw.max_active::NUMERIC) * 100, 2)
        END as workload_percentage
    FROM task_counts tc
    CROSS JOIN max_workload mw
    ORDER BY tc.active_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get deployment success rate
CREATE OR REPLACE FUNCTION get_deployment_stats()
RETURNS TABLE(
    environment TEXT,
    total_deployments BIGINT,
    successful_deployments BIGINT,
    failed_deployments BIGINT,
    pending_deployments BIGINT,
    success_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.environment,
        COUNT(*) as total_deployments,
        COUNT(*) FILTER (WHERE d.status = 'success') as successful_deployments,
        COUNT(*) FILTER (WHERE d.status = 'failed') as failed_deployments,
        COUNT(*) FILTER (WHERE d.status = 'pending') as pending_deployments,
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE d.status = 'success')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        END as success_rate
    FROM deployments d
    GROUP BY d.environment
    ORDER BY d.environment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    activity_type TEXT,
    activity_description TEXT,
    activity_date TIMESTAMPTZ,
    related_task_id BIGINT,
    related_task_title TEXT,
    actor TEXT
) AS $$
BEGIN
    RETURN QUERY
    (
        SELECT 
            'task_created'::TEXT as activity_type,
            'Task "' || t.title || '" was created'::TEXT as activity_description,
            t.created_at as activity_date,
            t.id as related_task_id,
            t.title as related_task_title,
            t.assignee as actor
        FROM tasks t
        WHERE t.created_at >= NOW() - INTERVAL '30 days'
    )
    UNION ALL
    (
        SELECT 
            'task_updated'::TEXT as activity_type,
            'Task "' || t.title || '" was updated'::TEXT as activity_description,
            t.updated_at as activity_date,
            t.id as related_task_id,
            t.title as related_task_title,
            t.assignee as actor
        FROM tasks t
        WHERE t.updated_at >= NOW() - INTERVAL '30 days'
        AND t.updated_at != t.created_at
    )
    UNION ALL
    (
        SELECT 
            'deployment'::TEXT as activity_type,
            'Deployment to ' || d.environment || ' - ' || d.status::TEXT as activity_description,
            COALESCE(d.deployed_at, d.approved_at) as activity_date,
            d.task_id as related_task_id,
            t.title as related_task_title,
            t.assignee as actor
        FROM deployments d
        JOIN tasks t ON t.id = d.task_id
        WHERE COALESCE(d.deployed_at, d.approved_at) >= NOW() - INTERVAL '30 days'
    )
    UNION ALL
    (
        SELECT 
            'note_added'::TEXT as activity_type,
            'Note added to "' || t.title || '" by ' || n.author::TEXT as activity_description,
            n.created_at as activity_date,
            n.task_id as related_task_id,
            t.title as related_task_title,
            n.author as actor
        FROM notes n
        JOIN tasks t ON t.id = n.task_id
        WHERE n.created_at >= NOW() - INTERVAL '30 days'
    )
    ORDER BY activity_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update team member task counts (can be called after task changes)
CREATE OR REPLACE FUNCTION update_team_member_task_counts()
RETURNS VOID AS $$
BEGIN
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update team member counts when tasks change
CREATE OR REPLACE FUNCTION trigger_update_team_member_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update counts for the affected assignee(s)
    IF TG_OP = 'DELETE' THEN
        PERFORM update_team_member_task_counts();
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM update_team_member_task_counts();
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        PERFORM update_team_member_task_counts();
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on tasks table
CREATE TRIGGER trigger_tasks_update_team_counts
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_team_member_counts();

-- Create view for task dashboard summary
CREATE OR REPLACE VIEW task_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM tasks) as total_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'To Do') as todo_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'In Progress') as in_progress_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'Review') as review_tasks,
    (SELECT COUNT(*) FROM tasks WHERE status = 'Completed') as completed_tasks,
    (SELECT COUNT(*) FROM team_members WHERE status = 'online') as online_members,
    (SELECT COUNT(*) FROM deployments WHERE status = 'pending') as pending_deployments,
    (SELECT COUNT(*) FROM deployments WHERE status = 'success' AND deployed_at >= CURRENT_DATE) as todays_deployments;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION get_task_statistics() IS 'Returns comprehensive task statistics for dashboard';
COMMENT ON FUNCTION get_team_workload() IS 'Returns team member workload analysis';
COMMENT ON FUNCTION get_deployment_stats() IS 'Returns deployment statistics by environment';
COMMENT ON FUNCTION get_recent_activity(INTEGER) IS 'Returns recent activity feed for the dashboard';
COMMENT ON VIEW task_dashboard_summary IS 'Summary view for dashboard metrics';