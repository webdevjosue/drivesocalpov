// Supabase Configuration for DriveSoCal POV
// Initialize the Supabase client with credentials

const SUPABASE_URL = 'https://tvhgvmdlfyunmwducsiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aGd2bWRsZnl1bm13ZHVjc2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDMyMzIsImV4cCI6MjA4NjgxOTIzMn0.RIeEezdFG2L0_IvdqXlTpg7ICfA_xQWpzGPXkqV14bg';

// Create and export the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}

// Make available globally for the landing page
window.supabaseClient = supabase;

console.log('Supabase client initialized');
