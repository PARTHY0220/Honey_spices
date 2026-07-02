import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbrbtlnqolcevdhqwjmm.supabase.co';
const supabaseKey = 'sb_publishable_0CemXq-FoJC8r5NN71o8jA_3uoJGdTj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const testEmail = `test_${Date.now()}@example.com`;
  console.log(`Testing signup with ${testEmail}`);
  
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Password123!',
    options: {
      data: {
        full_name: 'Test User',
        phone: '1234567890',
      }
    }
  });

  if (error) {
    console.error('Signup Error:', error);
    return;
  }
  
  console.log('Signup Success:', data.user ? 'User created' : 'No user', 'Session:', data.session ? 'Yes' : 'No');

  // Try to fetch the profile to see if the trigger worked
  if (data.user) {
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profError) {
      console.error('Profile fetch error (Trigger failed or table missing?):', profError);
    } else {
      console.log('Profile created successfully by trigger:', profile);
    }
  }
}

testSignup();
