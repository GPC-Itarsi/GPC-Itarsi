import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import config from '../config';
import { getProfileImageUrl } from '../utils/imageUtils';

const DeveloperCard = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const socialRef = useRef(null);

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch developer data
  useEffect(() => {
    if (isOpen) {
      const fetchDeveloperData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(`${config.apiUrl}/api/developer/s`);
          if (response.data && response.data.length > 0) {
            setDeveloper(response.data[0]); // Assuming the first developer is the one we want to display
          }
        } catch (err) {
          console.error('Error fetching developer data:', err);
          setError('Failed to load developer information');
        } finally {
          setLoading(false);
        }
      };

      fetchDeveloperData();
    }
  }, [isOpen]);

  // Animation for opening the card
  useEffect(() => {
    if (isOpen && cardRef.current && !loading) {
      // Reset any previous animations
      gsap.set(cardRef.current, { scale: 0.9, opacity: 0 });
      gsap.set(imageRef.current, { y: 20, opacity: 0 });
      gsap.set(contentRef.current, { y: 30, opacity: 0 });
      gsap.set(socialRef.current, { y: 20, opacity: 0 });

      // Create animation timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(cardRef.current, { scale: 1, opacity: 1, duration: 0.4 })
        .to(imageRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
        .to(contentRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .to(socialRef.current, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
    }
  }, [isOpen, loading]);

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="relative max-w-xs w-full mx-auto overflow-hidden"
      >
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-primary-800 to-primary-900 text-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out border border-primary-700/50"
        >
          {/* Tech-inspired header pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-board" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 0h100v100H0z" fill="none" />
                  <path d="M30 10h10v10H30zM10 30h10v10H10zM50 30h10v10H50zM30 50h10v10H30zM70 50h10v10H70zM50 70h10v10H50zM10 70h10v10H10zM70 10h10v10H70z" fill="currentColor" />
                  <path d="M10 10h10v10H10zM30 30h10v10H30zM70 30h10v10H70zM10 50h10v10H10zM50 50h10v10H50zM30 70h10v10H30zM70 70h10v10H70zM90 10h10v10H90zM90 30h10v10H90zM90 50h10v10H90zM90 70h10v10H90z" fill="currentColor" />
                  <path d="M30 10v20M10 30h20M50 30h20M30 50v20M70 50v20M50 70h20M10 70h20M70 10v20" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-board)" />
            </svg>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white p-1.5 rounded-md hover:bg-blue-600/50 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header with profile image */}
          <div className="relative pt-6 pb-6 px-4 text-center">
            {/* Tech-inspired decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400"></div>

            {/* Profile image */}
            <div ref={imageRef} className="relative inline-block">
              <div className="w-24 h-24 rounded-full border-2 border-accent-400 overflow-hidden shadow-lg mx-auto p-1 bg-primary-900/50">
                <img
                  src={getProfileImageUrl(developer.profilePicture)}
                  alt={developer.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=0D8ABC&color=fff&size=200`;
                  }}
                />
              </div>
              {/* Tech badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-md bg-accent-600 flex items-center justify-center text-white text-xs font-bold shadow-lg border border-accent-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-3 mb-0.5">{developer.name}</h3>
            <p className="text-accent-300 text-sm font-medium">{developer.title}</p>
          </div>

          {/* Content area */}
          <div ref={contentRef} className="bg-gradient-to-b from-primary-900/80 to-secondary-900/90 px-5 pt-4 pb-5 border-t border-primary-700/30">
            {/* Bio section with tech-inspired design */}
            <div className="bg-primary-800/30 p-3 rounded border border-primary-700/30 mb-4">
              <p className="text-primary-100 text-sm leading-relaxed">
                {developer.bio?.length > 100 ? `${developer.bio.substring(0, 100)}...` : developer.bio}
              </p>
            </div>

            {/* Social media links */}
            <div ref={socialRef} className="flex justify-center space-x-3">
              {developer.socialLinks?.github && (
                <a
                  href={developer.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-700 p-2 rounded hover:bg-accent-600 transition-all duration-300 transform hover:scale-110 shadow-md group"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {developer.socialLinks?.portfolio && (
                <a
                  href={developer.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-700 p-2 rounded hover:bg-accent-600 transition-all duration-300 transform hover:scale-110 shadow-md group"
                  aria-label="Portfolio"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                  </svg>
                </a>
              )}
              {developer.socialLinks?.instagram && (
                <a
                  href={developer.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-700 p-2 rounded hover:bg-accent-600 transition-all duration-300 transform hover:scale-110 shadow-md group"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {developer.socialLinks?.email && (
                <a
                  href={`mailto:${developer.socialLinks.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-700 p-2 rounded hover:bg-accent-600 transition-all duration-300 transform hover:scale-110 shadow-md group"
                  aria-label="Email"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Contact button with tech style */}
            <div className="mt-4 text-center">
              <a
                href={`mailto:${developer.socialLinks?.email || 'anmolmalviya4328@gmail.com'}`}
                className="inline-block px-4 py-2 bg-gradient-to-r from-accent-600 to-accent-500 rounded text-white text-xs font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-accent-400/30"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Contact Me</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
