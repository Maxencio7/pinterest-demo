
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePin } from '../contexts/PinContext';
import PinCard from './PinCard';
import { User, Camera, Settings, Share, MoreHorizontal } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { pins, boards } = usePin();
  const [activeTab, setActiveTab] = useState('created');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || ''
  });

  const userPins = pins.filter(pin => pin.userId === user?.id);
  const userBoards = boards.filter(board => board.userId === user?.id);
  const savedPins = pins.filter(pin => 
    boards.some(board => board.userId === user?.id && board.pinIds.includes(pin.id))
  );

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateProfile({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  if (!user) return null;

  const renderPinsGrid = (pinsToShow: any[]) => {
    if (pinsToShow.length === 0) {
      return (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-gray-900 mb-3">
            {activeTab === 'created' ? 'Nothing to show...yet!' : 'No saved Pins yet'}
          </h3>
          <p className="text-gray-500 text-lg mb-8">
            {activeTab === 'created' 
              ? 'Pins you create will live here.' 
              : 'Save ideas you like to see them here.'}
          </p>
          <button
            onClick={() => window.location.href = '/pin/create'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Create Pin
          </button>
        </div>
      );
    }

    return (
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4">
        {pinsToShow.map((pin) => (
          <div key={pin.id} className="break-inside-avoid mb-4">
            <PinCard pin={pin} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <User className="h-16 w-16 text-gray-500" />
              </div>
            )}
            
            <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow border">
              <Camera className="h-5 w-5 text-gray-700" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          {!isEditing ? (
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-4">{user.username}</h1>
              <div className="flex items-center justify-center text-gray-600 mb-6">
                <span className="text-lg">pinterest.com/</span>
                <span className="text-lg font-medium">{user.username}</span>
              </div>
              {user.bio && (
                <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">{user.bio}</p>
              )}
              {user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:underline text-lg font-medium mb-6 inline-block"
                >
                  {user.website}
                </a>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center space-x-3 mb-8">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Share className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors font-medium"
                >
                  Edit profile
                </button>
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit your profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-center space-x-12 text-center border-b border-gray-200 pb-8">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{userPins.length}</div>
              <div className="text-gray-600">Created</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{savedPins.length}</div>
              <div className="text-gray-600">Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 sticky top-20 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('created')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'created'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'saved'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Saved
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'created' && renderPinsGrid(userPins)}
        {activeTab === 'saved' && renderPinsGrid(savedPins)}
      </div>
    </div>
  );
};

export default Profile;
