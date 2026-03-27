// Test script to check Supabase database for business data
const { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } = require('./js/supabase-config.js');

async function testDatabase() {
    console.log('Testing Supabase connection...');
    console.log('URL:', SUPABASE_URL);
    
    try {
        // Test connection
        const { data, error } = await supabase.from('businesses').select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Error accessing businesses table:', error);
            console.log('\n💡 Possible solutions:');
            console.log('1. Create the businesses table in Supabase');
            console.log('2. Check RLS policies');
            console.log('3. Verify the Supabase credentials');
            return;
        }
        
        console.log('✅ Connection successful!');
        console.log(`📊 Businesses count: ${data || 0}`);
        
        // If no businesses, show what the structure should be
        if (!data || data === 0) {
            console.log('\n🏗️ Expected business structure:');
            console.log('Table: businesses');
            console.log('Fields: id, name, category, address, city, phone, description, website, latitude, longitude, featured, premium');
        }
        
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testDatabase();