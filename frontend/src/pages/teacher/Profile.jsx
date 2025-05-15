import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getProfileImageUrl, handleImageError } from '../../utils/imageUtils';
import config from '../../config';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { isEqual } from 'lodash';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    experience: '',
    subjects: [],
    bio: ''
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);
  const saveButtonRef = useRef(null);
  const lastSubmitTime = useRef(0);

  // Always fetch the latest teacher profile data
  useEffect(() => {
    if (user) {
      fetchTeacherProfile();
    }
  }, [user]);

  // Reset form modification state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      // When entering edit mode, reset the form modification state
      setIsFormModified(false);
    }
  }, [isEditing]);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      console.log('Fetching teacher profile data...');
      const response = await axios.get(`${config.apiUrl}/api/teachers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Teacher profile data received:', response.data);

      // Update the teacher data state
      setTeacherData(response.data);

      // Create form data object
      const newFormData = {
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        department: response.data.department || '',
        qualification: response.data.qualification || '',
        experience: response.data.experience || '',
        subjects: response.data.subjects || [],
        bio: response.data.bio || ''
      };

      // Update the form data
      setFormData(newFormData);

      // Store the original form data for comparison
      setOriginalFormData(newFormData);

      // Reset form modification state
      setIsFormModified(false);

      // Update the user context with the latest teacher data
      // This ensures the data is available throughout the application
      updateProfile(response.data);

      // If profile is not complete, automatically enter edit mode
      if (response.data.profileComplete === false) {
        setIsEditing(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      setError(error.response?.data?.message || 'Failed to load profile');
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess('');

      const token = localStorage.getItem('token');

      await axios.post(
        `${config.apiUrl}/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Reset form and close modal
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePasswordModal(false);

      setSuccess('Password changed successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profileImage) {
      setError('Please select an image to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess('');

      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('profilePicture', profileImage);

      console.log('Uploading profile picture...');
      const response = await axios.put(
        `${config.apiUrl}/api/teacher-profile/update-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Profile picture update response:', response.data);

      // Update user profile in context with the new profile picture
      updateProfile({ profilePicture: response.data.profilePicture });

      setSuccess('Profile picture updated successfully!');
      setProfileImage(null);
      setPreviewUrl('');
      setLoading(false);

      // Refresh teacher profile to get all updated data
      setTimeout(() => {
        fetchTeacherProfile();
      }, 500);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setError(error.response?.data?.message || 'Failed to update profile picture');
      setLoading(false);
    }
  };

  // Check if form data has been modified from original
  const checkFormModified = (updatedFormData) => {
    if (!originalFormData) return false;
    return !isEqual(updatedFormData, originalFormData);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedFormData);
    setIsFormModified(checkFormModified(updatedFormData));
  };

  const handleSubjectsChange = (e) => {
    const subjectsArray = e.target.value
      ? e.target.value.split(',').map(subject => subject.trim())
      : [];

    const updatedFormData = {
      ...formData,
      subjects: subjectsArray
    };

    setFormData(updatedFormData);
    setIsFormModified(checkFormModified(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no changes were made, don't submit
    if (!isFormModified) {
      console.log('No changes detected, skipping submission');
      return;
    }

    // Prevent multiple rapid submissions (throttle to once per second)
    const now = Date.now();
    if (now - lastSubmitTime.current < 1000) {
      console.log('Submission throttled, please wait');
      return;
    }
    lastSubmitTime.current = now;

    // Validate required fields for profile completion
    if (!formData.qualification) {
      setError('Qualification is required to complete your profile');
      return;
    }

    if (!formData.experience) {
      setError('Experience is required to complete your profile');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess('');

      const token = localStorage.getItem('token');

      console.log('Submitting profile update with data:', formData);

      const response = await axios.put(
        `${config.apiUrl}/api/teacher-profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Profile update response:', response.data);

      // Update teacher data with the response
      const updatedTeacher = response.data.teacher;
      setTeacherData(updatedTeacher);

      // Update user profile in context to ensure data consistency
      updateProfile(updatedTeacher);

      // Show appropriate success message based on profile completion
      if (teacherData?.profileComplete === false && updatedTeacher.profileComplete === true) {
        setSuccess('Profile completed successfully! Thank you for providing your details.');
      } else {
        setSuccess('Profile updated successfully!');
      }

      // Exit edit mode
      setIsEditing(false);
      setLoading(false);

      // Reset form modification state
      setIsFormModified(false);

      // Update original form data to match current data
      setOriginalFormData({...formData});

      // Refresh the teacher profile data to ensure we have the latest data
      setTimeout(() => {
        fetchTeacherProfile();
      }, 500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Failed to update profile'
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Teacher Profile</h1>

      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative
          animate-pulse shadow-lg transition-all duration-500"
          style={{
            boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)',
            background: 'linear-gradient(to right, rgba(254, 226, 226, 0.9), rgba(254, 202, 202, 0.9))'
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative
          shadow-lg transition-all duration-500"
          style={{
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
            background: 'linear-gradient(to right, rgba(209, 250, 229, 0.9), rgba(167, 243, 208, 0.9))'
          }}
        >
          {success}
        </div>
      )}

      {/* Profile Completion Notification */}
      {teacherData && teacherData.profileComplete === false && (
        <div className="mt-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded relative
          shadow-lg transition-all duration-500 animate-pulse"
          style={{
            boxShadow: '0 0 15px rgba(0, 0, 255, 0.2)',
            background: 'linear-gradient(to right, rgba(219, 234, 254, 0.9), rgba(191, 219, 254, 0.9))'
          }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                Welcome! Please complete your profile by filling in your qualification, experience, and other details.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && !teacherData ? (
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-r-2 border-green-500"
            style={{
              boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
              background: 'radial-gradient(circle, rgba(209, 250, 229, 0.1), transparent)'
            }}
          ></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Picture */}
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-xl"
            style={{
              background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
              boxShadow: '0 0 15px rgba(0, 200, 0, 0.1)'
            }}
          >
            <div className="px-4 py-5 sm:px-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-100 transition-all duration-300 hover:border-green-200"
                style={{
                  boxShadow: '0 0 20px rgba(0, 200, 0, 0.2)'
                }}
              >
                <img
                  src={previewUrl || getProfileImageUrl(user?.profilePicture)}
                  alt="Profile"
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  onError={handleImageError}
                />
              </div>
              <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">{teacherData?.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{user?.username}</p>

              <div className="mt-6 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Update Profile Picture
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-200 border-dashed rounded-md
                  transition-all duration-300 hover:border-green-300 bg-gradient-to-b from-white to-green-50"
                  style={{
                    boxShadow: '0 0 10px rgba(0, 200, 0, 0.1)'
                  }}
                >
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <div className="mb-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto h-32 w-32 rounded-full object-cover border-2 border-green-200"
                          style={{
                            boxShadow: '0 0 15px rgba(0, 200, 0, 0.2)'
                          }}
                        />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-green-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="profile-image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500
                        focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500
                        transition-all duration-300 hover:bg-green-50 px-2 py-1"
                      >
                        <span>Upload a file</span>
                        <input
                          id="profile-image"
                          name="profile-image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1 py-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUpdateProfilePicture}
                  disabled={!profileImage || loading}
                  className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                  bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
                  transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)',
                    textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {loading ? 'Updating...' : 'Update Picture'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md
                text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                style={{
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)'
                }}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 bg-white shadow-lg overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-xl"
            style={{
              background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
              boxShadow: '0 0 15px rgba(0, 200, 0, 0.1)'
            }}
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Teacher Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and subjects.</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
                  transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  style={{
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
                    textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <FaEdit className="mr-2 animate-pulse" /> Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // Reset form data to original values when canceling
                      if (originalFormData) {
                        setFormData({...originalFormData});
                      }
                      setIsFormModified(false);
                      setIsEditing(false);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
                    text-gray-700 bg-white hover:bg-gray-50
                    transition-all duration-300 transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                  <button
                    form="edit-profile-form"
                    type="submit"
                    ref={saveButtonRef}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                    transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                    ${isFormModified
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'}`}
                    style={{
                      boxShadow: isFormModified ? '0 0 15px rgba(0, 255, 0, 0.3)' : 'none',
                      textShadow: isFormModified ? '0 0 5px rgba(255, 255, 255, 0.5)' : 'none',
                      opacity: isFormModified ? '1' : '0.7'
                    }}
                    disabled={loading || !isFormModified}
                    title={!isFormModified ? "No changes to save" : "Save changes"}
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <FaSave className={`mr-2 ${isFormModified ? 'animate-pulse' : ''}`} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.username}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.email || 'Not provided'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.phone || 'Not provided'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.department}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Qualification</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.qualification || 'Not provided'}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{teacherData?.experience || 'Not provided'}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Teacher</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Subjects</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {teacherData?.subjects && teacherData.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teacherData.subjects.map((subject, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'No subjects assigned'
                      )}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Bio</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {teacherData?.bio || 'No bio provided'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Study Materials</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {teacherData?.studyMaterials?.length || 0} materials uploaded
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-gray-50 to-white">
                <form id="edit-profile-form" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-1 sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department *
                      </label>
                      <input
                        type="text"
                        name="department"
                        id="department"
                        required
                        value={formData.department}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        id="qualification"
                        value={formData.qualification}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Experience
                      </label>
                      <input
                        type="text"
                        name="experience"
                        id="experience"
                        value={formData.experience}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">
                        Subjects (comma separated)
                      </label>
                      <input
                        type="text"
                        name="subjects"
                        id="subjects"
                        value={formData.subjects.join(', ')}
                        onChange={handleSubjectsChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        id="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleFormChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                        border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                        transition-all duration-300 hover:shadow-md focus:shadow-lg"
                        style={{
                          boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                        }}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-filter backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
              animate-fadeIn"
              style={{
                boxShadow: '0 0 25px rgba(0, 200, 0, 0.3)',
                background: 'linear-gradient(to bottom, #ffffff, #f9fafb)'
              }}
            >
              <form onSubmit={handleChangePassword}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            required
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                            border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                            transition-all duration-300 hover:shadow-md focus:shadow-lg"
                            style={{
                              boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                            }}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            required
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                            border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                            transition-all duration-300 hover:shadow-md focus:shadow-lg"
                            style={{
                              boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                            }}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            required
                            className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm
                            border-gray-300 rounded-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm
                            transition-all duration-300 hover:shadow-md focus:shadow-lg"
                            style={{
                              boxShadow: '0 0 5px rgba(0, 200, 0, 0.1)',
                            }}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2
                    bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600
                    text-base font-medium text-white transition-all duration-300 transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    style={{
                      boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)',
                      textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2
                    bg-white text-base font-medium text-gray-700 hover:bg-gray-50
                    transition-all duration-300 transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setShowChangePasswordModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
