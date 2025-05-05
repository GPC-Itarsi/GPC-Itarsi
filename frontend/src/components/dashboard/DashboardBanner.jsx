import React from 'react';
import PropTypes from 'prop-types';

const DashboardBanner = ({
  title,
  subtitle,
  userName,
  userRole,
  actionButton,
  bgColor = 'bg-primary-800',
  className = '',
  showPattern = true
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${bgColor} ${className}`}>
      {showPattern && (
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      )}
      <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:flex-1">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl">
              {title || `Welcome back, ${userName}!`}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-white/80">
              {subtitle || `You are logged in as ${userRole}`}
            </p>
          </div>
          {actionButton && (
            <div className="mt-4 flex md:ml-4 md:mt-0">
              {actionButton}
            </div>
          )}
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 hidden md:block">
        <div className="h-64 w-64 rounded-full bg-accent-500 opacity-10"></div>
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden md:block">
        <div className="h-40 w-40 rounded-full bg-primary-400 opacity-10"></div>
      </div>
    </div>
  );
};

DashboardBanner.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  userName: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  actionButton: PropTypes.node,
  bgColor: PropTypes.string,
  className: PropTypes.string,
  showPattern: PropTypes.bool
};

export default DashboardBanner;
