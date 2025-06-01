
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePin } from '../contexts/PinContext';
import PinCard from './PinCard';
import { User, Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { pins, boards } = usePin();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || ''
  });

  const userPins = pins.filter(pin => pin.userId === user?.id);
  const userBoards = boards.filter(board => board.userId === user?.id);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
              <User className="h-12 w-12 text-gray-600" />
            </div>
          )}
          
          <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
            <Camera className="h-4 w-4 text-gray-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {!isEditing ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
            {user.bio && (
              <p className="text-gray-600 mb-2">{user.bio}</p>
            )}
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            )}
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Edit profile
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Bio"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="url"
              value={editForm.website}
              onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              placeholder="Website"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center space-x-8 mt-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{userPins.length}</div>
            <div className="text-sm text-gray-600">Pins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{userBoards.length}</div>
            <div className="text-sm text-gray-600">Boards</div>
          </div>
        </div>
      </div>

      {/* Pins Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Pins</h2>
        
        {userPins.length > 0 ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
            {userPins.map((pin) => (
              <div key={pin.id} className="break-inside-avoid mb-4">
                <PinCard pin={pin} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No pins yet</h3>
            <p className="text-gray-500 mb-6">Pins you create will appear here</p>
            <a
              href="/pin/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Create Pin
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
