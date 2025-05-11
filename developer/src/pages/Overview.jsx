import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Overview = () => {
  const [profileData, setProfileData] = useState({
    name: 'Developer',
    title: 'Developer Portal'
  });
  const [previewImage, setPreviewImage] = useState('https://ui-avatars.com/api/?name=Developer&background=0D8ABC&color=fff&size=200');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch profile data from backend without authentication
        console.log('Overview - Fetching profile from:', `${config.apiUrl}/api/developer/profile-public`);
        const response = await axios.get(`${config.apiUrl}/api/developer/profile-public`);
        console.log('Overview - Profile data received:', response.data);

        if (response.data) {
          setProfileData({
            name: response.data.name || 'Developer',
            title: response.data.title || 'Developer Portal'
          });

          if (response.data.profilePicture) {
            // Check if the profile picture is a Cloudinary URL or a local file
            if (response.data.profilePicture.includes('cloudinary') || response.data.profilePicture.startsWith('http')) {
              setPreviewImage(response.data.profilePicture);
            } else {
              setPreviewImage(`${config.apiUrl}/uploads/${response.data.profilePicture}`);
            }
          }
        }
      } catch (err) {
        console.error('Overview - Error fetching profile:', err);
        console.error('Overview - Error details:', err.response ? err.response.data : 'No response data');
        console.error('Overview - API URL used:', config.apiUrl);

        // Check if the error is "Developer not found"
        const isDeveloperNotFound =
          err.response &&
          err.response.data &&
          err.response.data.message === "Developer not found";

        if (isDeveloperNotFound) {
          console.log('Developer not found. This is expected if you have not yet created a developer profile.');
        }
        // Keep default values if API fails
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-800">
          <h3 className="text-lg leading-6 font-medium text-white">Developer Dashboard</h3>
          <p className="mt-1 max-w-2xl text-sm text-primary-200">
            Welcome to your developer control panel
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-sm text-gray-500">{profileData.title}</p>
              <div className="mt-2 text-sm text-gray-700">
                <p>Use this dashboard to manage your developer profile and customize the website.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Update Profile</h4>
                  <p className="text-sm text-gray-500">Edit your developer information</p>
                </div>
              </div>
              <div className="mt-4">
                <a href="/developer/profile" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Edit Profile →
                </a>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Website Settings</h4>
                  <p className="text-sm text-gray-500">Manage website configuration</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Coming Soon</span>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Theme Editor</h4>
                  <p className="text-sm text-gray-500">Customize website appearance</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Developer Resources</h3>
        </div>
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-700">Developer Profile</span>
              </div>
              <a href="/developer/profile" className="text-sm text-primary-600 hover:text-primary-800">Edit</a>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm text-gray-700">Website Customization</span>
              </div>
              <span className="text-xs text-gray-500">Coming Soon</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700">Documentation</span>
              </div>
              <span className="text-xs text-gray-500">Coming Soon</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
