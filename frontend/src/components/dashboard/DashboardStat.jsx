import React from 'react';
import PropTypes from 'prop-types';

const DashboardStat = ({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'bg-primary-500',
  iconColor = 'text-white',
  change,
  changeType = 'neutral',
  className = '',
  isLoading = false
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-500';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      );
    }
    if (changeType === 'negative') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3 mr-4`}>
          <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
        </div>
        <div className="w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              {isLoading ? (
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{value}</div>
                  {change && (
                    <div className={`ml-2 flex items-center text-sm font-medium ${getChangeColor()}`}>
                      {getChangeIcon()}
                      <span className="ml-1">{change}</span>
                    </div>
                  )}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

DashboardStat.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node.isRequired,
  iconBgColor: PropTypes.string,
  iconColor: PropTypes.string,
  change: PropTypes.string,
  changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
  className: PropTypes.string,
  isLoading: PropTypes.bool
};

export default DashboardStat;
