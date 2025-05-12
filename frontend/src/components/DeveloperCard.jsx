import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { getProfileImageUrl } from '../utils/imageUtils';

const DeveloperCard = ({ isOpen, onClose, developerData }) => {
  const modalRef = useRef(null);
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use passed developer data or fetch if not provided
  useEffect(() => {
    if (isOpen) {
      if (developerData) {
        console.log('Using provided developer data:', developerData);
        setDeveloper(developerData);
        setLoading(false);
      } else {
        const fetchDeveloperData = async () => {
          try {
            setLoading(true);
            setError(null);
            console.log('Fetching developer data from API...');
            const response = await axios.get(`${config.apiUrl}/api/developer/profile-public`);
            if (response.data) {
              console.log('Developer data received:', response.data);
              setDeveloper(response.data);
            }
          } catch (err) {
            console.error('Error fetching developer data:', err);
            setError('Failed to load developer information');
            // Set default developer data
            const defaultDeveloper = {
              name: 'Anmol Malviya',
              title: 'Web Developer',
              profilePicture: null,
              bio: 'Full-stack web developer specializing in React and Node.js',
              socialLinks: {
                github: 'https://github.com/anmolmalviya',
                portfolio: 'https://anmolmalviya.com',
                instagram: 'https://instagram.com/anmolmalviya',
                linkedin: 'https://linkedin.com/in/anmolmalviya',
                twitter: 'https://twitter.com/anmolmalviya',
                email: 'anmolmalviya4328@gmail.com'
              }
            };
            console.log('Using default developer data:', defaultDeveloper);
            setDeveloper(defaultDeveloper);
          } finally {
            setLoading(false);
          }
        };

        fetchDeveloperData();
      }
    }
  }, [isOpen, developerData]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading developer information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="text-red-500 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center text-gray-700">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-center text-gray-700">No developer information available.</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Simple blue card design matching the screenshot
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="relative max-w-xs w-full mx-auto overflow-hidden animate-fadeIn"
      >
        <div className="bg-[#1e4fbe] text-white rounded-lg shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-blue-800 transition-all duration-200 z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Profile content */}
          <div className="flex flex-col items-center pt-8 pb-6">
            {/* Profile image with orange badge */}
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white mx-auto">
                <img
                  src={getProfileImageUrl(developer.profilePicture)}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Developer image error, using fallback');
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/daf99zan2/image/upload/v1746966715/gpc-itarsi/profiles/profilePicture-1746966715084-977581870.webp';
                  }}
                />
              </div>
              {/* Orange badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white">
                <span>AM</span>
              </div>
            </div>

            {/* Name and title */}
            <h3 className="text-xl font-bold text-white mb-1">{developer.name}</h3>
            <p className="text-blue-200 text-sm font-medium mb-6">{developer.title}</p>

            {/* Bio section */}
            <div className="px-8 w-full">
              <div className="bg-blue-800/30 p-3 rounded-lg mb-6">
                <p className="text-white text-sm text-center leading-relaxed">
                  {developer.bio?.length > 100 ? `${developer.bio.substring(0, 100)}...` : developer.bio}
                </p>
              </div>
            </div>

            {/* Social media icons */}
            <div className="flex justify-center space-x-4 mb-6 px-8 w-full">
              {/* No debug border or console log in production */}

              {/* GitHub */}
              <a
                href="https://github.com/anmolmalviya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/anmolmalviya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-2 rounded-full"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/anmolmalviya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 p-2 rounded-full"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com/anmolmalviya"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 p-2 rounded-full"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Contact button */}
            <div className="px-8 w-full">
              <a
                href={`mailto:${developer.socialLinks?.email || 'anmolmalviya4328@gmail.com'}`}
                className="flex items-center justify-center w-full px-4 py-3 bg-[#ff5722] rounded-md text-white font-medium shadow-md hover:bg-orange-600 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Contact Me</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
