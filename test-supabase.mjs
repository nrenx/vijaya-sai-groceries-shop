// Simple script to test if the Supabase URL is valid
import https from 'https';
import fs from 'fs';

// Read the .env file
const envContent = fs.readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();

console.log('Testing Supabase URL:', supabaseUrl);

// Try to connect to the URL
const req = https.get(supabaseUrl, (res) => {
  console.log('Response status code:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data (first 100 chars):', data.substring(0, 100));
    console.log('Connection successful!');
  });
});

req.on('error', (error) => {
  console.error('Error connecting to Supabase:', error.message);
});

req.end();
