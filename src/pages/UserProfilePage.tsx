import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, User, Key, Edit3, Heart, Eye, LogOut } from 'lucide-react';
import { PropertyCard } from '../components/properties/PropertyCard'; // Assuming PropertyCard is a named export
import { mockProperties } from '../data/mockdata'; // For placeholder favorites

// Mock user data - in a real app, this would come from auth context or API
const mockUser = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex.johnson@example.com',
  joinDate: '2023-05-15',
};

const UserProfilePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email, // Typically email is not directly editable or requires verification
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Placeholder for favorite properties - fetch or get from global state in real app
  const favoriteProperties = mockProperties.slice(0, 2).map(p => ({...p, isFavorite: true})); 

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Profile updated:', profileData);
    setIsEditingProfile(false);
    // Update mockUser or actual user data source
    mockUser.firstName = profileData.firstName;
    mockUser.lastName = profileData.lastName;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords don't match!");
      return;
    }
    // TODO: API call to change password
    console.log('Password change submitted for:', passwordData.currentPassword, passwordData.newPassword);
    setIsChangingPassword(false);
    setPasswordData({currentPassword: '', newPassword: '', confirmNewPassword: ''});
  };
  
  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear token, redirect, etc.)
    console.log('User logged out');
    // For demo, redirect to home. In a real app, this would also update auth state.
    // navigate('/'); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-800 font-medium">My Profile</span>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {profileData.firstName}!</h1>
        <p className="text-lg text-gray-600">Manage your account settings and view your activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Navigation (Optional or for future use) */}
        {/* <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#profile-details" className="text-blue-900 hover:underline">Profile Details</a></li>
              <li><a href="#change-password" className="text-blue-900 hover:underline">Change Password</a></li>
              <li><a href="#my-favorites" className="text-blue-900 hover:underline">My Favorites</a></li>
            </ul>
          </div>
        </div> */}

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Details Section */}
          <section id="profile-details" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-900" /> Profile Details
              </h2>
              {!isEditingProfile && (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center text-sm text-blue-900 hover:text-blue-800 font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-gray-900 text-lg">{profileData.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-gray-900 text-lg">{profileData.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-900 text-lg">{profileData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900 text-lg">{new Date(mockUser.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" name="firstName" id="firstName" value={profileData.firstName} onChange={handleProfileChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" name="lastName" id="lastName" value={profileData.lastName} onChange={handleProfileChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (cannot be changed)</label>
                  <input type="email" name="email" id="email" value={profileData.email} readOnly className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Change Password Section */}
          <section id="change-password" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Key className="w-6 h-6 mr-2 text-blue-900" /> Change Password
              </h2>
              {!isChangingPassword && (
                 <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center text-sm text-blue-900 hover:text-blue-800 font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Change
                </button>
              )}
            </div>
            {isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700">Current Password</label>
                  <div className="relative mt-1">
                    <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative mt-1">
                    <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmNewPassword"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                   <div className="relative mt-1">
                    <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                   <button type="button" onClick={() => {setIsChangingPassword(false); setPasswordData({currentPassword: '', newPassword: '', confirmNewPassword: ''});}} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800">
                    Update Password
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">Click the button above to change your password.</p>
            )}
          </section>

          {/* My Favorite Properties Section */}
          <section id="my-favorites" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-600" /> My Favorite Properties
            </h2>
            {favoriteProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">You haven't saved any favorite properties yet.</p>
            )}
            <div className="mt-6 text-right">
                <Link to="/properties" className="text-blue-900 hover:text-blue-800 font-medium text-sm">
                    Browse all properties &rarr;
                </Link>
            </div>
          </section>

           {/* Logout Button */}
          <section className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 