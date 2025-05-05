require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary configuration:');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key configured:', process.env.CLOUDINARY_API_KEY ? 'Yes (hidden)' : 'No');
console.log('API secret configured:', process.env.CLOUDINARY_API_SECRET ? 'Yes (hidden)' : 'No');

// Test Cloudinary connection
async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Ping Cloudinary to check connection
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful!');
    console.log('Response:', result);
    
    // Get account info to further verify connection
    const accountInfo = await cloudinary.api.usage();
    console.log('Account usage info:');
    console.log(JSON.stringify(accountInfo, null, 2));
    
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    return false;
  }
}

// Run the test
testCloudinaryConnection()
  .then(success => {
    if (success) {
      console.log('Cloudinary test completed successfully.');
    } else {
      console.log('Cloudinary test failed. Please check your credentials and network connection.');
    }
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
  });
