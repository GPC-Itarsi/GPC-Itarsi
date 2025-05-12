import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  // Check if there's a token in localStorage
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    loading,
    hasToken: !!token,
    currentUser: currentUser ? `${currentUser.name} (${currentUser.role})` : 'No user'
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-primary-900">
      <div className="futuristic-loader"></div>
    </div>;
  }

  // If not authenticated or no token, redirect to login
  if (!isAuthenticated || !token) {
    console.log('Not authenticated, redirecting to login');
    // Clear any existing token to ensure a clean login
    localStorage.removeItem('token');
    return <Navigate to="/developer/login" state={{ from: location }} replace />;
  }

  // If authenticated but not a developer or admin, show access denied
  if (currentUser && currentUser.role !== 'developer' && currentUser.role !== 'admin') {
    console.log('User does not have developer/admin role:', currentUser.role);
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-primary-900">
      <div className="max-w-md w-full space-y-8 futuristic-card p-8">
        <div className="text-center text-red-600">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Access Denied</h2>
          <p className="mt-2 text-center text-sm text-primary-300">
            You do not have permission to access the developer dashboard.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/developer/login';
            }}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>;
  }

  return children;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/developer/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/developer/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Redirect to developer dashboard */}
        <Route path="/" element={<Navigate to="/developer" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/developer" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
