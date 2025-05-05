import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({
  title,
  children,
  icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  noPadding = false,
  actions = null,
  isLoading = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      {title && (
        <div className={`flex justify-between items-center px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-center space-x-2">
            {icon && <span className="text-accent-600">{icon}</span>}
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-4'} ${bodyClassName}`}>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  noPadding: PropTypes.bool,
  actions: PropTypes.node,
  isLoading: PropTypes.bool
};

export default DashboardCard;
