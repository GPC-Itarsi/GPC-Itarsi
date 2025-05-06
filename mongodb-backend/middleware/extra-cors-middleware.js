/**
 * Extra CORS middleware for problematic endpoints
 * This adds additional CORS headers for specific routes that have been causing issues
 */

module.exports = function(req, res, next) {
  // Log request information for debugging
  console.log('Extra CORS Middleware - Request path:', req.path);

  // Set CORS headers again for these specific routes
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Extra CORS Middleware - Handling OPTIONS preflight request');
    return res.status(204).end();
  }
  
  next();
};
