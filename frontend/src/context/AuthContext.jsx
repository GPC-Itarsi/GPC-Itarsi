import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
          // Update token state
          setToken(storedToken);

          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          console.log('Setting Authorization header with token:', storedToken.substring(0, 20) + '...');

          // Get user data
          const response = await axios.get(`${config.apiUrl}/api/auth/me`);
          console.log('User data from /me endpoint:', response.data);

          // Set the user data with the ID
          const userData = response.data.userData || {};
          const userWithId = {
            ...response.data.user,
            id: response.data.user._id, // Ensure ID is set correctly
            userData: userData
          };

          console.log('Setting user with ID:', userWithId);
          console.log('User ID for API calls will be:', userWithId.id);
          setUser(userWithId);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password, userType) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Attempting login with:', { username, password, userType });

      // Create the login payload based on user type
      const loginPayload = {
        username,
        password,
        userType: userType || 'admin' // Default to admin if not specified
      };

      console.log('Sending login request with payload:', loginPayload);

      const response = await axios.post(`${config.apiUrl}/api/auth/login`, loginPayload);

      const { token, user, userData } = response.data;
      console.log('Login response:', { token: token.substring(0, 20) + '...', user, userData });

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Update token state
      setToken(token);

      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Login: Setting Authorization header with token:', token.substring(0, 20) + '...');

      // Set user data with ID
      const userWithId = {
        ...user,
        id: user._id, // Ensure ID is set correctly
        userData: userData || {}
      };

      console.log('Setting user with ID after login:', userWithId);
      console.log('User ID for API calls will be:', userWithId.id);
      console.log('User role:', userWithId.role);
      setUser(userWithId);

      return userData;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Login failed. Please check your credentials and ensure the server is running.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  // Compute authentication state values
  const isAuthenticated = !loading && !!user;

  // Only check roles when user is authenticated and loaded
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isTeacher = isAuthenticated && user?.role === 'teacher';
  const isStudent = isAuthenticated && user?.role === 'student';
  const isDeveloper = isAuthenticated && user?.role === 'developer';

  const value = {
    user,
    setUser,
    token,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    isDeveloper,
    userData: user?.userData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
