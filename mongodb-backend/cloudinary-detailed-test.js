require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

// Print all environment variables related to Cloudinary
console.log('Environment variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '[HIDDEN]' : 'Not set');
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? '[HIDDEN]' : 'Not set');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Print the current Cloudinary configuration
console.log('\nCloudinary configuration:');
console.log(cloudinary.config().cloud_name ? {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key ? '[HIDDEN]' : 'Not set',
  api_secret: cloudinary.config().api_secret ? '[HIDDEN]' : 'Not set'
} : 'No configuration found');

// Test Cloudinary connection using a direct API call
async function testDirectApiCall() {
  try {
    console.log('\nTesting direct API call to Cloudinary...');
    
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/ping`;
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

// Test Cloudinary connection using the SDK
async function testSdkConnection() {
  try {
    console.log('\nTesting Cloudinary SDK connection...');
    
    // Ping Cloudinary to check connection
    const result = await cloudinary.api.ping();
    console.log('SDK connection successful!');
    console.log('Response:', result);
    
    return true;
  } catch (error) {
    console.error('SDK connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.error) {
      console.error('HTTP code:', error.error.http_code);
      console.error('Error details:', error.error.message);
    }
    
    return false;
  }
}

// Run the tests
async function runTests() {
  const directApiResult = await testDirectApiCall();
  const sdkResult = await testSdkConnection();
  
  console.log('\nTest results:');
  console.log('Direct API call:', directApiResult ? 'SUCCESS' : 'FAILED');
  console.log('SDK connection:', sdkResult ? 'SUCCESS' : 'FAILED');
  
  if (!directApiResult && !sdkResult) {
    console.log('\nBoth tests failed. This indicates an issue with your Cloudinary credentials.');
    console.log('Please check that:');
    console.log('1. Your cloud name, API key, and API secret are correct');
    console.log('2. Your account is active and not suspended');
    console.log('3. Your network connection allows outbound HTTPS connections');
  } else if (directApiResult && !sdkResult) {
    console.log('\nDirect API call succeeded but SDK failed. This suggests an issue with the SDK configuration.');
  } else if (!directApiResult && sdkResult) {
    console.log('\nSDK succeeded but direct API call failed. This is unusual and suggests a network or authentication issue.');
  } else {
    console.log('\nBoth tests succeeded! Your Cloudinary connection is working properly.');
  }
}

// Run all tests
runTests().catch(err => {
  console.error('Unexpected error during tests:', err);
});
