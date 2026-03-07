import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htxvabvovqfgfemfofyi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eHZhYnZvdnFmZ2ZlbWZvZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTIyNzIsImV4cCI6MjA4ODQ4ODI3Mn0.BEea2gD8NiSRQf1gIEdHUV-e9ijKk-UptCn_Y8nK-VY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
