import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    try {
      console.log('Checking authentication on page load');
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found in localStorage');
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      console.log('Token found in localStorage:', token.substring(0, 20) + '...');

      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Setting Authorization header with token:', `Bearer ${token.substring(0, 20)}...`);

      // Fetch user profile with the token
      fetchUserProfile(token);
    } catch (err) {
      console.error('Error checking authentication:', err);
      // Clear token if there's an error
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      setLoading(true);
      console.log('Fetching user profile with token:', token.substring(0, 20) + '...');

      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(`${config.apiUrl}/api/developer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('User profile fetched successfully:', response.data);
      setCurrentUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      console.error('Error details:', err.response?.data || err.message);

      // Clear token if it's invalid
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      setLoading(false);

      // Show error toast
      toast.error('Session expired. Please login again.');
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Attempting login with:', { username, password });
      console.log('API URL:', `${config.apiUrl}/api/auth/login`);

      // Clear any existing token and headers
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      // Include userType parameter to specify developer role
      const response = await axios.post(`${config.apiUrl}/api/auth/login`, {
        username,
        password,
        userType: 'developer' // Explicitly set userType to developer
      });

      // Check if response contains token and user
      if (!response.data || !response.data.token || !response.data.user) {
        console.error('Invalid login response:', response.data);
        setError('Invalid response from server. Please try again.');
        setLoading(false);
        return false;
      }

      const { token, user } = response.data;

      console.log('Login response:', {
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        user: user ? { ...user, _id: user._id } : 'No user'
      });

      // Check if user is a developer or admin
      if (user.role !== 'developer' && user.role !== 'admin') {
        setError('Access denied. Only developers and admins can access this portal.');
        setLoading(false);
        return false;
      }

      // Save token to localStorage
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage:', token.substring(0, 20) + '...');

      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Setting Authorization header with token:', `Bearer ${token.substring(0, 20)}...`);

      // Verify token was set correctly
      const currentToken = localStorage.getItem('token');
      console.log('Verifying token in localStorage:', currentToken ? currentToken.substring(0, 20) + '...' : 'No token');

      // Set current user
      setCurrentUser(user);
      setLoading(false);
      toast.success('Login successful!');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error details:', err.response?.data || err.message);

      // Clear any existing token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Remove Authorization header from axios defaults
    delete axios.defaults.headers.common['Authorization'];

    // Clear current user state
    setCurrentUser(null);

    // Show success message
    toast.info('Logged out successfully');
  };

  // Function to check if token is valid and refresh auth state
  const checkTokenValidity = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found during validity check');
        setCurrentUser(null);
        return false;
      }

      console.log('Checking token validity:', token.substring(0, 20) + '...');

      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Make a request to verify the token
      const response = await axios.get(`${config.apiUrl}/api/developer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data._id) {
        console.log('Token is valid, user profile retrieved:', response.data.name);
        setCurrentUser(response.data);
        return true;
      } else {
        console.log('Invalid response from server during token check');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
        return false;
      }
    } catch (err) {
      console.error('Token validation error:', err);
      console.error('Error details:', err.response?.data || err.message);

      // Clear invalid token
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    checkTokenValidity,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
