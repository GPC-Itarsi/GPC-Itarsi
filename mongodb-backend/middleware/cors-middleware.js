/**
 * Custom CORS middleware to ensure all requests have proper CORS headers
 * This is a more direct approach than using the cors package
 */

module.exports = function(req, res, next) {
  // Log request information for debugging
  console.log('CORS Middleware - Request from origin:', req.headers.origin);
  console.log('CORS Middleware - Request method:', req.method);
  console.log('CORS Middleware - Request path:', req.path);

  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('CORS Middleware - Handling OPTIONS preflight request');
    return res.status(204).end();
  }
  
  next();
};
