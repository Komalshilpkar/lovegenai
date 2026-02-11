const SUPABASE_URL = "https://wqdkvdnxxaqgynypwnee.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZGt2ZG54eGFxZ3lueXB3bmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTMxNTksImV4cCI6MjA4NjM2OTE1OX0.zTMgJCoHEbjpfrO6tvo6w4JfNTa06vw4W04EstAJ_KA";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
