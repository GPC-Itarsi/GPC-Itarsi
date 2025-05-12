import React, { useEffect, useRef } from 'react';
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
  isLoading = false,
  futuristic = true,
  noHoverEffect = false
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (futuristic && cardRef.current && !noHoverEffect) {
      const card = cardRef.current;

      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        // Apply subtle rotation and shadow effect
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = `
          0 5px 15px rgba(0, 0, 0, 0.1),
          0 0 20px rgba(99, 102, 241, 0.2),
          ${rotateY / 2}px ${rotateX / 2}px 10px rgba(0, 0, 0, 0.1)
        `;
      };

      const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 10px rgba(99, 102, 241, 0.1)';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [futuristic, noHoverEffect]);

  const cardClass = futuristic
    ? `student-card ${className}`
    : `bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`;

  const headerClass = futuristic
    ? `flex justify-between items-center px-4 py-3 border-b border-gray-200 student-card-header ${headerClassName}`
    : `flex justify-between items-center px-4 py-3 border-b border-gray-200 ${headerClassName}`;

  return (
    <div ref={cardRef} className={cardClass}>
      {title && (
        <div className={headerClass}>
          <div className="flex items-center space-x-2">
            {icon && <span className={futuristic ? "text-white" : "text-accent-600"}>{icon}</span>}
            <h3 className={futuristic ? "text-lg font-medium text-white" : "text-lg font-medium text-gray-900"}>{title}</h3>
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
  isLoading: PropTypes.bool,
  futuristic: PropTypes.bool,
  noHoverEffect: PropTypes.bool
};

export default DashboardCard;
