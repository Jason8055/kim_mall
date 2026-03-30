// js/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgsqdjqdujbdwvajadxg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnc3FkanFkdWpiZHd2YWphZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NDg1MjUsImV4cCI6MjA5MDQyNDUyNX0.Afcpvs8AVcoh0eqnV47FoSBCkRz1bx1uEKuNleaOP98';

export const supabase = createClient(supabaseUrl, supabaseKey);
