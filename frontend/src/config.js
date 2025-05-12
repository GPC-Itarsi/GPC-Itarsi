
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://gpc-itarsi-backend-8dod.onrender.com',
  defaultProfileImage: '/images/placeholder.svg',
  uploadPath: '/uploads/profiles/',
};

// Log the API URL for debugging
console.log('API URL configured as:', config.apiUrl);

export default config;
