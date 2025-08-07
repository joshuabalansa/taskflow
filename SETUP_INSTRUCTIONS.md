# Quick Setup Instructions for Supabase Database

Since the database tables don't exist yet, you need to create them manually through the Supabase dashboard. Follow these simple steps:

## Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `pbatqxlfejahooopjnyb`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## Step 2: Run the Setup Script
1. Open the file `supabase/quick-setup.sql` in this project
2. Copy the entire contents of that file
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the script

## Step 3: Verify Setup
After running the script, you should see:
- Tables created: `tasks`, `team_members`, `deployments`, `notes`
- Sample data inserted
- A success message

## Step 4: Test the Application
Once the database is set up:
1. Refresh your application at http://localhost:5173/
2. Navigate to Team Management
3. Try adding a new team member

## Alternative: Manual Table Creation
If you prefer to create tables manually:
1. Go to "Table Editor" in Supabase dashboard
2. Create the tables as defined in the migration files in `supabase/migrations/`

## Troubleshooting
- If you get permission errors, make sure you're logged into the correct Supabase account
- If tables already exist, the script will skip creation (safe to run multiple times)
- Check the "Logs" section in Supabase dashboard for any error details

---

**Note**: This is a one-time setup. Once completed, your Task Management Dashboard will be fully functional with Supabase!