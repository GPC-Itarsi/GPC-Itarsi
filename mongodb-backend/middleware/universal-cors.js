/**
 * Universal CORS middleware that ensures all responses have proper CORS headers
 * This is a direct approach that bypasses the cors package
 */

module.exports = function(req, res, next) {
  // Log request information for debugging
  console.log('Universal CORS Middleware - Request path:', req.path);
  console.log('Universal CORS Middleware - Request method:', req.method);
  console.log('Universal CORS Middleware - Request origin:', req.headers.origin);
  
  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Universal CORS Middleware - Handling OPTIONS preflight request for:', req.path);
    return res.status(204).send();
  }
  
  next();
};
