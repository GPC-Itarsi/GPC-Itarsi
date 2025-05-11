import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { getProfileImageUrl, handleImageError } from '../utils/imageUtils';
import { Link } from 'react-router-dom';

const AdminDeveloperCard = () => {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${config.apiUrl}/api/developer/profile-public`);
        if (response.data) {
          setDeveloper(response.data);
        }
      } catch (err) {
        console.error('Error fetching developer data:', err);
        setError('Failed to load developer information');
        // Set default developer data if API fails
        setDeveloper({
          name: 'Anmol Malviya',
          title: 'Web Developer',
          profilePicture: null,
          socialLinks: {
            github: 'https://github.com/developer',
            email: 'anmolmalviya4328@gmail.com'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-lg shadow-lg overflow-hidden border border-primary-700/50">
      {/* Tech-inspired header pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-grid-white/10"></div>
      </div>

      <div className="relative p-4 flex items-center">
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 rounded-full border-2 border-accent-400 overflow-hidden shadow-lg bg-primary-900/50 p-0.5">
            <img
              src={getProfileImageUrl(developer?.profilePicture)}
              alt={developer?.name || 'Developer'}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(developer?.name || 'Developer')}&background=0D8ABC&color=fff&size=200`;
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{developer?.name || 'Developer'}</h3>
          <p className="text-accent-300 text-sm">{developer?.title || 'Web Developer'}</p>
          <div className="mt-2 flex space-x-2">
            {developer?.socialLinks?.github && (
              <a
                href={developer.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent-300 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {developer?.socialLinks?.email && (
              <a
                href={`mailto:${developer.socialLinks.email}`}
                className="text-white hover:text-accent-300 transition-colors"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <Link
            to="/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-accent-400 text-xs font-medium rounded-md text-white bg-accent-600 hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Developer Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDeveloperCard;
