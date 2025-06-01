
import React, { useState } from 'react';
import { Heart, Bookmark, Link as LinkIcon, User } from 'lucide-react';
import { Pin, usePin } from '../contexts/PinContext';
import { useAuth } from '../contexts/AuthContext';
import SaveToBoardModal from './SaveToBoardModal';

interface PinCardProps {
  pin: Pin;
}

const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { likePin } = usePin();
  const { user } = useAuth();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      likePin(pin.id, user.id);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  const handleImageClick = () => {
    // In a real app, this would open a detailed view
    console.log('Opening pin detail:', pin.id);
  };

  const isLiked = user ? pin.likedBy.includes(user.id) : false;

  return (
    <>
      <div 
        className="relative bg-white rounded-2xl overflow-hidden cursor-zoom-in group transition-transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        {/* Image */}
        <div className="relative">
          {!imageLoaded && (
            <div 
              className="w-full bg-gray-200 animate-pulse rounded-t-2xl"
              style={{ height: Math.random() * 200 + 200 }}
            />
          )}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className={`w-full object-cover rounded-t-2xl transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              height: 'auto',
              maxHeight: '400px'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Hover overlay */}
          {isHovered && imageLoaded && (
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-2xl flex items-end p-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart 
                      className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                    />
                  </button>
                  {pin.link && (
                    <a
                      href={pin.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <LinkIcon className="h-4 w-4 text-gray-600" />
                    </a>
                  )}
                </div>
                
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {pin.title && (
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {pin.title}
            </h3>
          )}
          
          {pin.description && (
            <p className="text-gray-600 text-xs line-clamp-3 mb-2">
              {pin.description}
            </p>
          )}

          {/* User info */}
          <div className="flex items-center space-x-2">
            {pin.userAvatar ? (
              <img 
                src={pin.userAvatar} 
                alt={pin.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-gray-600" />
              </div>
            )}
            <span className="text-xs text-gray-600 font-medium">{pin.username}</span>
          </div>

          {/* Stats */}
          {(pin.likes > 0 || pin.comments.length > 0) && (
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              {pin.likes > 0 && (
                <span>{pin.likes} like{pin.likes !== 1 ? 's' : ''}</span>
              )}
              {pin.comments.length > 0 && (
                <span>{pin.comments.length} comment{pin.comments.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {pin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pin.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSaveModal && (
        <SaveToBoardModal
          pin={pin}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  );
};

export default PinCard;
