
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://gpc-itarsi-backend-8dod.onrender.com',
  defaultProfileImage: '/images/placeholder.svg',
  uploadPath: '/uploads/profiles/',
  developerPanelUrl: import.meta.env.VITE_DEVELOPER_PANEL_URL || 'http://localhost:5175',
};

// Log the API URL for debugging
console.log('API URL configured as:', config.apiUrl);
console.log('Developer Panel URL configured as:', config.developerPanelUrl);

export default config;
