/**
 * Global CORS middleware to ensure all responses have proper CORS headers
 * This middleware is applied to all routes and adds CORS headers to every response
 */

module.exports = function(req, res, next) {
  // Log request information for debugging
  console.log('Global CORS Middleware - Request path:', req.path);
  console.log('Global CORS Middleware - Request from origin:', req.headers.origin);
  console.log('Global CORS Middleware - Request method:', req.method);

  // Get the origin from the request headers
  const origin = req.headers.origin;

  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Global CORS Middleware - Handling OPTIONS preflight request');
    return res.status(204).end();
  }

  next();
};
