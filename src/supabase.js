import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://irnomzwqvizphcgtuvqv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlybm9tendxdml6cGhjZ3R1dnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzM2MDcsImV4cCI6MjA5MTg0OTYwN30.HweLzdfy9pTREcEQKLlT0m78uHf8hWg9AIN0YhhOxZA'

export const supabase = createClient(supabaseUrl, supabaseKey)