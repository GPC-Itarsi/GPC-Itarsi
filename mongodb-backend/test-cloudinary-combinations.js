require('dotenv').config();
const axios = require('axios');

// Possible cloud names
const cloudNames = [
  'daf99zwr2',
  'daf99zwr2'
];

// Possible API keys
const apiKeys = [
  '913341681574171',
  '913341861574171'
];

// Possible API secrets
const apiSecrets = [
  'qTADLCaw8Fsh6HwtC4tLdgpObvU',
  'qTADLCaw8FaI6HwrC4tLdgpObrU'
];

// Test Cloudinary connection using a direct API call
async function testDirectApiCall(cloudName, apiKey, apiSecret) {
  try {
    console.log(`\nTesting combination: cloud_name=${cloudName}, api_key=${apiKey}, api_secret=[HIDDEN]`);
    
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/ping`;
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SUCCESS! This combination works!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Failed with error:');
    console.error('Status:', error.response?.status);
    console.error('Error message:', error.response?.data?.error?.message || error.message);
    
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Testing all combinations of cloud names, API keys, and API secrets...');
  
  let foundWorkingCombination = false;
  
  for (const cloudName of cloudNames) {
    for (const apiKey of apiKeys) {
      for (const apiSecret of apiSecrets) {
        const result = await testDirectApiCall(cloudName, apiKey, apiSecret);
        
        if (result) {
          foundWorkingCombination = true;
          console.log(`\n✅ Found working configuration!`);
          console.log(`Cloud Name: ${cloudName}`);
          console.log(`API Key: ${apiKey}`);
          console.log(`API Secret: [HIDDEN]`);
          
          console.log(`\nUpdate your .env file with these values:`);
          console.log(`CLOUDINARY_CLOUD_NAME=${cloudName}`);
          console.log(`CLOUDINARY_API_KEY=${apiKey}`);
          console.log(`CLOUDINARY_API_SECRET=${apiSecret}`);
          console.log(`CLOUDINARY_URL=cloudinary://${apiKey}:${apiSecret}@${cloudName}`);
          
          // Exit early once we find a working combination
          return true;
        }
      }
    }
  }
  
  if (!foundWorkingCombination) {
    console.log('\n❌ None of the tested combinations worked.');
    console.log('Please check your Cloudinary dashboard for the correct credentials.');
  }
  
  return foundWorkingCombination;
}

// Run all tests
runTests().catch(err => {
  console.error('Unexpected error during tests:', err);
});
