// Simple script to test if the Supabase API is accessible
import https from 'https';
import fs from 'fs';

// Read the .env file
const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

console.log('Testing Supabase API');
console.log('URL:', supabaseUrl);
console.log('Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

// Try to connect to the REST API
const apiUrl = `${supabaseUrl}/rest/v1/products?select=count`;
console.log('API URL:', apiUrl);

const options = {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
};

const req = https.get(apiUrl, options, (res) => {
  console.log('Response status code:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    console.log('API call completed!');
  });
});

req.on('error', (error) => {
  console.error('Error connecting to Supabase API:', error.message);
});

req.end();
