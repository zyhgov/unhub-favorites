import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfpivkkeottocxbqgzen.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcGl2a2tlb3R0b2N4YnFnemVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzAxMTMsImV4cCI6MjA3NzgwNjExM30.ZKm4IEZCVZuWOcE88ni1DdxmJCVKMY9AFTQ0gjP48kM' // 从 Supabase Dashboard -> Settings -> API 获取

export const supabase = createClient(supabaseUrl, supabaseAnonKey)