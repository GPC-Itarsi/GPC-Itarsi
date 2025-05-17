import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that provides a UI for inserting links into text content
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onInsert - Function to call when a link is inserted
 * @param {string} props.currentContent - The current content of the text area
 * @param {Function} props.setContent - Function to update the content
 */
const LinkInsertionTool = ({ onInsert, currentContent, setContent }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  // Toggle the link insertion panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
    // Reset form when opening
    if (!isOpen) {
      setLinkUrl('');
      setLinkText('');
      setError('');
    }
  };

  // Handle link insertion
  const handleInsertLink = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!linkUrl.trim()) {
      setError('URL is required');
      return;
    }

    // If no link text is provided, use the URL as the text
    const displayText = linkText.trim() || linkUrl.trim();
    
    // Format URL if needed
    let formattedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // Create the HTML link tag
    const linkHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
    
    // Insert the link at the cursor position or at the end if no selection
    if (onInsert) {
      onInsert(linkHtml);
    } else {
      // Default behavior: append to the end
      setContent(currentContent + ' ' + linkHtml);
    }
    
    // Reset and close the panel
    setLinkUrl('');
    setLinkText('');
    setError('');
    setIsOpen(false);
  };

  return (
    <div className="link-insertion-tool mb-2">
      <button
        type="button"
        onClick={togglePanel}
        className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors duration-150"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
          />
        </svg>
        {isOpen ? 'Cancel Link' : 'Insert Link'}
      </button>
      
      {isOpen && (
        <div className="mt-2 p-3 border border-primary-200 rounded-md bg-primary-50">
          <form onSubmit={handleInsertLink}>
            <div className="mb-2">
              <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-1">
                Link Text <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                If left empty, the URL will be used as the link text
              </p>
            </div>
            
            {error && (
              <div className="mb-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={togglePanel}
                className="mr-2 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

LinkInsertionTool.propTypes = {
  onInsert: PropTypes.func,
  currentContent: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired
};

export default LinkInsertionTool;
