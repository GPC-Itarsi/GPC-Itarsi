import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config';
import collegeLogo from '../assets/college-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Default to student login type
  const [userType, setUserType] = useState('student');
  console.log('Initial userType:', userType);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  // This function handles all login types
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Log the current userType state before attempting login
      console.log('Current userType before login attempt:', userType);
      console.log('Attempting login with:', { username, password, userType });

      // Use the login function from AuthContext
      await login(username, password, userType);

      // Get the user from localStorage (it's set by the login function)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token received after login');
      }

      // Get the user role from the JWT token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);

        // Redirect based on user role
        if (payload.role === 'admin') {
          navigate('/admin');
        } else if (payload.role === 'teacher') {
          navigate('/teacher');
        } else if (payload.role === 'student') {
          navigate('/student');
        } else if (payload.role === 'developer') {
          navigate('/developer');
        } else if (payload.role === 'hod') {
          navigate('/teacher'); // HODs use the teacher dashboard for now
        } else if (payload.role === 'principal') {
          navigate('/admin'); // Principal uses the admin dashboard for now
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        // Default to home page if we can't determine the role
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your username and password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-primary-200 shadow-lg">
            <img src={collegeLogo} alt="College Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-secondary-900">GPC Itarsi</h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Sign in to your account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUserType('student');
                console.log('Set userType to student');
              }}
              className={`px-3 py-2 rounded-md ${
                userType === 'student' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('teacher');
                console.log('Set userType to teacher');
              }}
              className={`px-3 py-2 rounded-md ${
                userType === 'teacher' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('hod');
                console.log('Set userType to hod');
              }}
              className={`px-3 py-2 rounded-md ${
                userType === 'hod' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              HOD
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('principal');
                console.log('Set userType to principal');
              }}
              className={`px-3 py-2 rounded-md ${
                userType === 'principal' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Principal
            </button>
            <button
              type="button"
              onClick={() => {
                setUserType('admin');
                console.log('Set userType to admin');
              }}
              className={`px-3 py-2 rounded-md ${
                userType === 'admin' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-700'
              }`}
            >
              Admin
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  {userType === 'student' ? 'Roll Number' : 'Username'}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input"
                  placeholder={
                    userType === 'student'
                      ? 'Enter your roll number'
                      : userType === 'admin'
                        ? 'Enter admin username'
                        : userType === 'hod'
                          ? 'Enter HOD username'
                          : userType === 'principal'
                            ? 'Enter principal username'
                            : 'Enter your username'
                  }
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-primary-400/30 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="flex items-center justify-center mt-4">
              <Link
                to="/forgot-password"
                className="font-medium text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                Forgot password?
              </Link>
            </div>
          </form>

          {userType === 'student' && (
            <div className="mt-4 text-center text-sm text-secondary-600">
              <p>Enter your roll number and password</p>
            </div>
          )}

          {userType === 'teacher' && (
            <div className="mt-4 text-center text-sm text-secondary-600">
              <p>Enter your username and password</p>
            </div>
          )}

          {userType === 'admin' && (
            <div className="mt-4 text-center text-sm text-secondary-600">
              <p>Enter admin username and password</p>
            </div>
          )}

          {userType === 'hod' && (
            <div className="mt-4 text-center text-sm text-secondary-600">
              <p>Enter HOD username and password</p>
            </div>
          )}

          {userType === 'principal' && (
            <div className="mt-4 text-center text-sm text-secondary-600">
              <p>Enter principal username and password</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
