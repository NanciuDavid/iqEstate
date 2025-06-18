import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, User, Key, Edit3, Heart, Eye, LogOut } from 'lucide-react';
import { useAuth, useUser } from '../hooks/useAuthQuery';
import { UserFavorite } from '../services/authService';

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfilePage: React.FC = () => {
  // Use basic auth check first, then optionally load user profile
  const { 
    isAuthenticated, 
    logout,
    updateProfile,
    updateProfileError,
    isUpdatingProfile,
    changePassword,
    changePasswordError,
    isChangingPassword: isChangingPasswordMutation
  } = useAuth(false); // Don't auto-load profile to avoid 401 errors

  // Separately control user profile loading
  const [shouldLoadProfile, setShouldLoadProfile] = useState(false);
  const userQuery = useUser(shouldLoadProfile && isAuthenticated);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const [profileData, setProfileData] = useState<ProfileUpdateData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [favoriteProperties, setFavoriteProperties] = useState<UserFavorite[]>([]);
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [updateError, setUpdateError] = useState<string>('');
  const [profileLoadError, setProfileLoadError] = useState<string>('');

  // Only try to load profile after basic auth check passes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ User is authenticated, attempting to load profile...');
      setShouldLoadProfile(true);
    }
  }, [isAuthenticated]);

  // Handle profile loading errors gracefully
  useEffect(() => {
    if (userQuery.isError && shouldLoadProfile) {
      console.warn('⚠️ Profile loading failed, but keeping user logged in');
      setProfileLoadError('Unable to load profile data. Some features may be limited.');
      // Don't logout on profile load failure
    }
  }, [userQuery.isError, shouldLoadProfile]);

  // Update profile data when user data is loaded
  useEffect(() => {
    if (userQuery.data) {
      const nameParts = userQuery.data.name?.split(' ') || [];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: userQuery.data.phoneNumber || '',
      });
      setProfileLoadError(''); // Clear any previous errors
    }
  }, [userQuery.data]);

  // Load user favorites - DISABLED to prevent 401 errors
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) return;
      
      // TEMPORARILY DISABLED - this is causing 401 errors
      console.log('🔐 UserProfile - Favorites loading disabled to prevent 401 errors');
      setIsLoadingFavorites(false);
      setFavoriteProperties([]);
      
      // TODO: Re-enable when backend JWT_SECRET is fixed
      /*
      try {
        setIsLoadingFavorites(true);
        const response = await authService.getUserFavorites();
        if (response.success && response.data) {
          setFavoriteProperties(response.data);
        } else if (response.error === 'Authentication required') {
          console.warn('🔐 Authentication failed when loading favorites');
          // Don't redirect here, just show empty favorites
          setFavoriteProperties([]);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteProperties([]);
      } finally {
        setIsLoadingFavorites(false);
      }
      */
    };

    loadFavorites();
  }, [isAuthenticated]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage('');
    setUpdateError('');
    
    try {
      const updateData = {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phoneNumber: profileData.phoneNumber,
      };
      
      await updateProfile(updateData);
      setUpdateMessage('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      setUpdateError(updateProfileError?.message || 'Error updating profile. Please try again.');
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMessage('');
    setUpdateError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setUpdateError("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setUpdateError("New password must be at least 8 characters long!");
      return;
    }
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setUpdateMessage('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      setUpdateError(changePasswordError?.message || 'Error changing password. Please try again.');
      console.error('Password change error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate home even if logout fails
      navigate('/');
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your profile.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state only for initial profile load
  if (shouldLoadProfile && userQuery.isLoading && !userQuery.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show profile page even if profile data failed to load
  const user = userQuery.data;
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'user@example.com';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Load Error Warning */}
      {profileLoadError && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <p>{profileLoadError}</p>
        </div>
      )}

      {/* Success/Error Messages */}
      {updateMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {updateMessage}
        </div>
      )}
      
      {updateError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {updateError}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <nav className="flex mt-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-500 hover:text-blue-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-gray-700">Profile</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </h2>
            </div>
            
            <div className="px-6 py-6">
              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-lg text-gray-900">{displayName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-lg text-gray-900">{displayEmail}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-lg text-gray-900">{profileData.phoneNumber || 'Not provided'}</p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                      disabled={!!profileLoadError} // Disable editing if profile failed to load
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-8 bg-white shadow-sm rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Security
              </h2>
            </div>
            
            <div className="px-6 py-6">
              {!isChangingPassword ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Keep your account secure by using a strong password.
                  </p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isChangingPasswordMutation}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isChangingPasswordMutation ? 'Changing...' : 'Change Password'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({currentPassword: '', newPassword: '', confirmPassword: ''});
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Profile Actions Sidebar */}
        <div className="space-y-6">
          {/* Account Actions */}
          <div className="bg-white shadow-sm rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
            </div>
            
            <div className="px-6 py-4 space-y-3">
              <Link 
                to="/properties" 
                className="flex items-center text-gray-700 hover:text-blue-900 transition-colors"
              >
                <Eye className="w-4 h-4 mr-3" />
                View Properties
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Favorite Properties */}
          <div className="bg-white shadow-sm rounded-lg border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Favorite Properties
              </h3>
            </div>
            
            <div className="px-6 py-4">
              {isLoadingFavorites ? (
                <div className="space-y-3">
                  <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
                  <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
                </div>
              ) : favoriteProperties.length > 0 ? (
                <div className="space-y-3">
                  {favoriteProperties.slice(0, 3).map((favorite) => (
                    <div key={favorite.id} className="text-sm">
                      <Link 
                        to={`/properties/${favorite.id}`}
                        className="text-blue-900 hover:text-blue-700 font-medium"
                      >
                        {favorite.title}
                      </Link>
                      <p className="text-gray-500">{favorite.city}</p>
                    </div>
                  ))}
                  {favoriteProperties.length > 3 && (
                    <Link 
                      to="/favorites" 
                      className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                    >
                      View all {favoriteProperties.length} favorites →
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No favorite properties yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 