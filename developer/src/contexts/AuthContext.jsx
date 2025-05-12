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
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
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

      // Include userType parameter to specify developer role
      const response = await axios.post(`${config.apiUrl}/api/auth/login`, {
        username,
        password,
        userType: 'developer' // Explicitly set userType to developer
      });

      const { token, user } = response.data;

      console.log('Login response:', {
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        user
      });

      // Check if user is a developer or admin
      if (user.role !== 'developer' && user.role !== 'admin') {
        setError('Access denied. Only developers and admins can access this portal.');
        setLoading(false);
        return false;
      }

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Set axios default headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Setting Authorization header with token:', `${token.substring(0, 20)}...`);

      // Set current user
      setCurrentUser(user);
      setLoading(false);
      toast.success('Login successful!');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error details:', err.response?.data || err.message);
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

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
