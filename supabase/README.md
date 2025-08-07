# Supabase Migrations for Task Management Dashboard

This directory contains SQL migration files to set up your Supabase database for the Task Management Dashboard with Deployment Tracking.

## Migration Files

### 001_initial_schema.sql
Creates the core database schema including:
- **tasks** table - Main task management with status, priority, and assignment tracking
- **team_members** table - User profiles with skills and contact information
- **deployments** table - Deployment tracking for tasks across environments
- **notes** table - Comments and notes related to tasks
- Indexes for optimal performance
- Triggers for automatic timestamp updates
- Foreign key constraints and data validation

### 002_seed_data.sql
Populates the database with sample data including:
- 6 team members with realistic profiles and skills
- 13 sample tasks with various statuses and priorities
- Sample deployments across development, staging, and production
- Notes and comments from different team members
- Automatic calculation of team member task counts

### 003_security_and_functions.sql
Adds security and utility features:
- Row Level Security (RLS) policies
- Utility functions for analytics and reporting
- Triggers for maintaining data consistency
- Dashboard summary views
- Permission grants for authenticated users

## How to Apply Migrations

### Option 1: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not already done):
   ```bash
   supabase init
   ```

3. Link to your Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Apply migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual Application via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file content in order:
   - First: `001_initial_schema.sql`
   - Second: `002_seed_data.sql`
   - Third: `003_security_and_functions.sql`
4. Execute each migration by clicking "Run"

### Option 3: Using psql or any PostgreSQL client

```bash
psql -h db.YOUR_PROJECT_REF.supabase.co -p 5432 -d postgres -U postgres
\i 001_initial_schema.sql
\i 002_seed_data.sql
\i 003_security_and_functions.sql
```

## Database Schema Overview

### Tables

#### tasks
- Primary table for task management
- Tracks status, priority, assignee, due dates
- Links to external tools (Trello, GitHub, Loom)
- Automatic timestamp tracking

#### team_members
- User profiles and information
- Skills stored as JSONB for flexibility
- Task completion statistics
- Online status tracking

#### deployments
- Tracks deployments across environments
- Links to tasks for deployment history
- Status tracking (pending, success, failed)
- Deployment and approval timestamps

#### notes
- Comments and notes on tasks
- Categorized by type (dev, testing, project_owner)
- Author tracking and timestamps

### Utility Functions

#### get_task_statistics()
Returns comprehensive task statistics for dashboard widgets:
- Total tasks by status
- Tasks by priority level

#### get_team_workload()
Analyzes team member workload:
- Active vs completed tasks per member
- Workload percentage calculations

#### get_deployment_stats()
Deployment analytics by environment:
- Success rates
- Deployment counts by status

#### get_recent_activity(limit_count)
Activity feed for dashboard:
- Recent task changes
- Deployment activities
- Note additions

### Views

#### task_dashboard_summary
Pre-calculated dashboard metrics for quick loading:
- Task counts by status
- Online team members
- Deployment statistics

## Security Considerations

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Allow full access to authenticated users
- Can be customized for role-based access control
- Protect data from unauthorized access

### Recommended Customizations

For production use, consider implementing more granular RLS policies:

```sql
-- Example: Users can only see tasks assigned to them
CREATE POLICY "Users see own tasks" ON tasks
    FOR SELECT USING (assignee = auth.jwt() ->> 'email');

-- Example: Only admins can modify team members
CREATE POLICY "Admin team management" ON team_members
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

## Environment Variables

After setting up the database, update your application's environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Data Migration from SQL.js

If you have existing data in the SQL.js local database, you can export it and import to Supabase:

1. Export data from the browser's localStorage
2. Convert the data format to match Supabase schema
3. Use the Supabase client to insert the data

## Performance Optimization

The migrations include several performance optimizations:
- Indexes on frequently queried columns
- JSONB for flexible skill storage
- Efficient foreign key relationships
- Materialized views for complex calculations

## Backup and Recovery

Regularly backup your Supabase database:
```bash
supabase db dump --file backup.sql
```

Restore from backup:
```bash
psql -h db.YOUR_PROJECT_REF.supabase.co -p 5432 -d postgres -U postgres -f backup.sql
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're connected as a user with sufficient privileges
2. **Foreign Key Violations**: Apply migrations in the correct order
3. **RLS Blocking Queries**: Check that your application is properly authenticated

### Useful Queries

```sql
-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;

-- View active connections
SELECT * FROM pg_stat_activity;

-- Check RLS policies
SELECT * FROM pg_policies;
```

## Support

For issues with these migrations:
1. Check the Supabase documentation
2. Review the SQL error messages carefully
3. Ensure all prerequisites are met
4. Test migrations on a development database first

## License

These migration files are part of the Task Management Dashboard project and follow the same license terms.