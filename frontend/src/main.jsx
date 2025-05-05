import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toast.css' // Import custom toast styles
import './styles/custom-toast.css' // Import custom toast animations
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import config from './config'
import CustomToastContainer from './components/CustomToastContainer'

// Set default axios base URL and headers
axios.defaults.baseURL = config.apiUrl;
console.log('Setting axios baseURL to:', config.apiUrl);

// Set default authorization header if token exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('main.jsx: Setting default Authorization header with token:', token.substring(0, 10) + '...');
} else {
  console.log('No token found in localStorage');
}

// Add request interceptor for debugging
axios.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    console.log('Request headers:', config.headers);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  error => {
    console.error('Response error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <CustomToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </StrictMode>
)
