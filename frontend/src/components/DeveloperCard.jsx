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

            {/* Social media icons - Hidden but available in the component */}
            <div className="hidden">
              {developer.socialLinks?.github && (
                <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              )}
              {developer.socialLinks?.linkedin && (
                <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {developer.socialLinks?.instagram && (
                <a href={developer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              )}
              {developer.socialLinks?.twitter && (
                <a href={developer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
              )}
              {developer.socialLinks?.portfolio && (
                <a href={developer.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
