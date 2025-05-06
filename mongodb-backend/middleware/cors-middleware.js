/**
 * Custom CORS middleware to ensure all requests have proper CORS headers
 * This is a more direct approach than using the cors package
 */

module.exports = function(req, res, next) {
  // Log request information for debugging
  console.log('CORS Middleware - Request from origin:', req.headers.origin);
  console.log('CORS Middleware - Request method:', req.method);
  console.log('CORS Middleware - Request path:', req.path);

  // Get the origin from the request headers
  const origin = req.headers.origin;

  // Get frontend URLs from environment variables
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const productionFrontendUrl = process.env.PRODUCTION_FRONTEND_URL || 'https://gpc-itarsi-9cl7.onrender.com';
  const developerFrontendUrl = process.env.DEVELOPER_FRONTEND_URL || 'https://gpc-itarsi-developer.onrender.com';

  // List of allowed origins
  const allowedOrigins = [
    productionFrontendUrl,
    developerFrontendUrl,
    frontendUrl,
    'https://gpc-itarsi-9cl7.onrender.com',
    'https://gpc-itarsi-developer.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ];

  // Check if the request origin is in our list of allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    // Set the specific origin instead of wildcard '*'
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`CORS Middleware - Allowing specific origin: ${origin}`);
  } else {
    // For all other origins, use wildcard (or you could deny them)
    res.header('Access-Control-Allow-Origin', '*');
    console.log('CORS Middleware - Using wildcard origin');
  }

  // Set other CORS headers
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
