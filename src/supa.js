import { createClient } from '@supabase/supabase-js'

// URL + anon key are public by design (the browser needs them). Data is protected
// by Supabase row-level security: a signed-in user can only read their own client.
export const supabase = createClient(
  'https://dxocfmwjwzzseepujfji.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4b2NmbXdqd3p6c2VlcHVqZmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMDYxODEsImV4cCI6MjEwMDc4MjE4MX0.id5f4bAwWHSYmIumwvSQ0X1g7R6PqUH-HnGs_5SKFq4'
)
