import React from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from '../../utils/sanitizeHtml';

/**
 * A component to display a notice with clickable links
 * 
 * @param {Object} props - Component props
 * @param {Object} props.notice - The notice object to display
 * @param {boolean} props.darkTheme - Whether to use dark theme styling
 * @param {boolean} props.truncate - Whether to truncate the content
 * @param {number} props.maxLength - Maximum length of content before truncation
 */
const NoticeDetail = ({ 
  notice, 
  darkTheme = false, 
  truncate = false, 
  maxLength = 150 
}) => {
  if (!notice) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Prepare content with proper HTML sanitization
  const prepareContent = () => {
    if (!notice.content) return '';
    
    if (truncate && notice.content.length > maxLength) {
      return sanitizeHtml(`${notice.content.substring(0, maxLength)}...`);
    }
    
    return sanitizeHtml(notice.content);
  };

  return (
    <div className="notice-detail">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-medium ${darkTheme ? 'text-white' : 'text-primary-600'} break-words`}>
          {notice.title}
          {notice.important && (
            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              darkTheme 
                ? 'bg-red-800/50 text-red-200' 
                : 'bg-red-100 text-red-800'
            }`}>
              Important
            </span>
          )}
        </h3>
        <div className="flex-shrink-0">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            darkTheme 
              ? 'bg-primary-800/50 text-gray-200 border border-primary-700/30' 
              : 'bg-green-100 text-green-800'
          }`}>
            {formatDate(notice.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="mt-2">
        <div className={`text-sm ${
          darkTheme ? 'text-gray-300 dark-theme' : 'text-gray-600'
        } notice-content`}>
          <div 
            dangerouslySetInnerHTML={{ __html: prepareContent() }} 
            className="break-words"
          />
        </div>
      </div>
    </div>
  );
};

NoticeDetail.propTypes = {
  notice: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    important: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  darkTheme: PropTypes.bool,
  truncate: PropTypes.bool,
  maxLength: PropTypes.number,
};

export default NoticeDetail;
