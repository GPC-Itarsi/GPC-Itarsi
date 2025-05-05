require('dotenv').config();
const axios = require('axios');

// Print all environment variables related to Cloudinary
console.log('Environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[HIDDEN]' : 'Not set');

// Try different cloud names
const cloudNames = [
  process.env.CLOUDINARY_CLOUD_NAME,
  'daf99zwr2',
  'daf99zwr2'
];

// Test Cloudinary connection using a direct API call
async function testDirectApiCall(cloudName) {
  try {
    console.log(`\nTesting direct API call to Cloudinary with cloud name: ${cloudName}...`);
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/ping`;
    const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Direct API call successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('Direct API call failed:');
    console.error('Status:', error.response?.status);
    console.error('Error message:', error.response?.data || error.message);
    
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('\nTesting different cloud names...');
  
  for (const cloudName of cloudNames) {
    const result = await testDirectApiCall(cloudName);
    console.log(`Result for cloud name "${cloudName}": ${result ? 'SUCCESS' : 'FAILED'}`);
    
    if (result) {
      console.log(`\n✅ Found working configuration!`);
      console.log(`Cloud Name: ${cloudName}`);
      console.log(`API Key: ${process.env.CLOUDINARY_API_KEY}`);
      console.log(`API Secret: [HIDDEN]`);
      
      console.log(`\nUpdate your .env file with these values:`);
      console.log(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
      console.log(`CLOUDINARY_API_KEY=${process.env.CLOUDINARY_API_KEY}`);
      console.log(`CLOUDINARY_API_SECRET=${process.env.CLOUDINARY_API_SECRET}`);
      console.log(`CLOUDINARY_URL=cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${cloudName}`);
      
      return true;
    }
  }
  
  console.log('\n❌ None of the tested cloud names worked with your API key and secret.');
  console.log('Please check your Cloudinary dashboard for the correct credentials.');
  
  return false;
}

// Run all tests
runTests().catch(err => {
  console.error('Unexpected error during tests:', err);
});
