
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePin } from '../contexts/PinContext';
import { useAuth } from '../contexts/AuthContext';
import PinCard from './PinCard';
import { ArrowLeft } from 'lucide-react';

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { pins, boards } = usePin();
  const { user } = useAuth();

  const board = boards.find(b => b.id === boardId);
  const boardPins = pins.filter(pin => board?.pinIds.includes(pin.id));

  if (!board) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Board not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.name}</h1>
          {board.description && (
            <p className="text-gray-600 mb-4">{board.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {boardPins.length} pin{boardPins.length !== 1 ? 's' : ''}
            {board.isSecret && ' · Secret board'}
          </p>
        </div>
      </div>

      {/* Pins Grid */}
      {boardPins.length > 0 ? (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
          {boardPins.map((pin) => (
            <div key={pin.id} className="break-inside-avoid mb-4">
              <PinCard pin={pin} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No pins in this board yet</h3>
          <p className="text-gray-500 mb-6">Save some pins to see them here</p>
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
