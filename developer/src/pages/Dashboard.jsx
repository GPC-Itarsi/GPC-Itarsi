import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import useMobileSidebar from '../../../frontend/src/hooks/useMobileSidebar';
import { createSwipeHandler } from '../../../frontend/src/utils/touchUtils';
import collegeLogo from '../../../frontend/src/assets/college-logo.png';

// Developer Components
import Profile from './Profile';
import Overview from './Overview';

const Dashboard = () => {
  const location = useLocation();
  const { isSidebarOpen: isMobileSidebarOpen, toggleSidebar: toggleMobileSidebar, closeSidebar: closeMobileSidebar } = useMobileSidebar();

  // Set up touch handlers for mobile
  useEffect(() => {
    const handleSwipe = createSwipeHandler({
      onSwipeLeft: closeMobileSidebar,
      onSwipeRight: toggleMobileSidebar,
    });

    document.addEventListener('touchstart', handleSwipe.touchStart);
    document.addEventListener('touchmove', handleSwipe.touchMove);
    document.addEventListener('touchend', handleSwipe.touchEnd);

    return () => {
      document.removeEventListener('touchstart', handleSwipe.touchStart);
      document.removeEventListener('touchmove', handleSwipe.touchMove);
      document.removeEventListener('touchend', handleSwipe.touchEnd);
    };
  }, [closeMobileSidebar, toggleMobileSidebar]);

  // No authentication needed

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 flex z-40 transition-opacity duration-300 ease-linear ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileSidebar}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={closeMobileSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-12 w-auto" src={collegeLogo} alt="College Logo" />
            </div>
            <div className="mt-5 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-300">
                <img
                  src={'https://ui-avatars.com/api/?name=Developer&background=0D8ABC&color=fff&size=200'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="mt-2 text-lg font-medium text-white">Developer</h2>
              <p className="text-sm text-primary-300">Developer Portal</p>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="/developer"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/developer'
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Overview
              </Link>
              <Link
                to="/developer/profile"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/developer/profile'
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                }`}
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </Link>

            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="h-12 w-auto" src={collegeLogo} alt="College Logo" />
              </div>
              <div className="mt-5 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-300">
                  <img
                    src={'https://ui-avatars.com/api/?name=Developer&background=0D8ABC&color=fff&size=200'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="mt-2 text-lg font-medium text-white">Developer</h2>
                <p className="text-sm text-primary-300">Developer Portal</p>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/developer"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/developer'
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Overview
                </Link>
                <Link
                  to="/developer/profile"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/developer/profile'
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>

              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={toggleMobileSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="ml-4">
            <h1 className="text-lg font-semibold text-primary-700">Developer Dashboard</h1>
          </div>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-4 md:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
