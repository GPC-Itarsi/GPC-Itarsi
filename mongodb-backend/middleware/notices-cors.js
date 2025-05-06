/**
 * Special CORS middleware specifically for the notices endpoint
 * This middleware is designed to fix the persistent CORS issues with the notices endpoint
 */

module.exports = function(req, res, next) {
  // Log detailed information about the request
  console.log('NOTICES CORS MIDDLEWARE');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Headers:', req.headers);
  
  // Set CORS headers for all responses from this route
  // Allow specific origin that's having issues
  res.header('Access-Control-Allow-Origin', 'https://gpc-itarsi-9cl7.onrender.com');
  
  // If that doesn't work, try wildcard
  // res.header('Access-Control-Allow-Origin', '*');
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for notices endpoint');
    return res.status(204).send();
  }
  
  next();
};
