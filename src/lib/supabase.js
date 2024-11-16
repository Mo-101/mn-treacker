import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqvmbptxvwthwvntjfss.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const supabase = createClient(supabaseUrl, supabaseKey);