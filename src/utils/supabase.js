import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqvmbptxvwthmvntjfss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxdm1icHR4dnd0aG12bnRqZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5ODEyNTYsImV4cCI6MjA0NTU1NzI1Nn0.NOOw6lvyTjAFp7YbCEe0pZH1y5QvMkQbWoqP4uxvOyE';

export const supabase = createClient(supabaseUrl, supabaseKey);