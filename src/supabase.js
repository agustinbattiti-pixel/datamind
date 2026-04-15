import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xglfnlgerxeuxgorbgfd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbGZubGdlcnhldXhnb3JiZ2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzkwNjQsImV4cCI6MjA5MTg1NTA2NH0.HXHPWmpuipA9Usf8ZhoIb_VkQsfxHg5CIsOqi8BNaeA'

export const supabase = createClient(supabaseUrl, supabaseKey)