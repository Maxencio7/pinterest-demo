
import React, { useState } from 'react';
import { Heart, Bookmark, Link as LinkIcon, User, Upload } from 'lucide-react';
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
    console.log('Opening pin detail:', pin.id);
  };

  const isLiked = user ? pin.likedBy.includes(user.id) : false;

  return (
    <>
      <div 
        className="relative bg-white rounded-2xl overflow-hidden cursor-zoom-in group transition-all duration-200 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl">
          {!imageLoaded && (
            <div 
              className="w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl flex items-center justify-center"
              style={{ height: Math.random() * 200 + 250 }}
            >
              <div className="text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className={`w-full object-cover rounded-2xl transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            } ${isHovered ? 'transform scale-105' : ''}`}
            style={{ 
              height: 'auto',
              maxHeight: '500px'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black transition-all duration-200 ${
            isHovered && imageLoaded ? 'bg-opacity-20' : 'bg-opacity-0'
          } rounded-2xl`}>
            {/* Top Right Actions */}
            <div className={`absolute top-3 right-3 transition-all duration-200 ${
              isHovered && imageLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            }`}>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors shadow-lg"
              >
                Save
              </button>
            </div>

            {/* Bottom Actions */}
            <div className={`absolute bottom-3 left-3 right-3 flex justify-between items-end transition-all duration-200 ${
              isHovered && imageLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            }`}>
              <div className="flex space-x-2">
                {pin.link && (
                  <a
                    href={pin.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-gray-900 bg-opacity-80 text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={handleSave}
                  className="p-2 bg-gray-900 bg-opacity-80 text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={handleLike}
                className="p-2 bg-gray-900 bg-opacity-80 text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg"
              >
                <Heart 
                  className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Pin Info */}
        {(pin.title || pin.description) && (
          <div className="p-3">
            {pin.title && (
              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
                {pin.title}
              </h3>
            )}
            
            {pin.description && (
              <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">
                {pin.description}
              </p>
            )}

            {/* User info */}
            <div className="flex items-center justify-between">
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
                <span className="text-xs text-gray-700 font-medium truncate max-w-24">
                  {pin.username}
                </span>
              </div>

              {/* More options */}
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>
        )}
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
