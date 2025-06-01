import React, { useState } from 'react';
import { usePin, Pin, Board } from '../contexts/PinContext';
import { useAuth } from '../contexts/AuthContext';

interface SaveToBoardModalProps {
  pin: Pin;
  onClose: () => void;
}

const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ pin, onClose }) => {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const { boards, addBoard, addPinToBoard } = usePin();
  const { user } = useAuth();

  const userBoards = boards.filter(board => board.userId === user?.id);

  const handleSaveToBoard = (boardId: string) => {
    addPinToBoard(pin.id, boardId);
    onClose();
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || !user) return;

    const newBoard = {
      name: newBoardName,
      description: newBoardDescription,
      userId: user.id,
      isSecret: isSecret
    };

    addBoard(newBoard);
    setNewBoardName('');
    setNewBoardDescription('');
    setShowCreateBoard(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Save Pin</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showCreateBoard ? (
            <>
              {/* Create new board button */}
              <button
                onClick={() => setShowCreateBoard(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors mb-4"
              >
                + Create board
              </button>

              {/* Existing boards */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userBoards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSaveToBoard(board.id)}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {board.coverImage ? (
                          <img 
                            src={board.coverImage} 
                            alt={board.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">Board</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{board.name}</h3>
                        <p className="text-sm text-gray-500">
                          {board.pinIds.length} pin{board.pinIds.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {userBoards.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  You don't have any boards yet. Create one to save this pin!
                </p>
              )}
            </>
          ) : (
            /* Create board form */
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board name
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder='Like "Places to go" or "Recipes to make"'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="What's your board about?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSecret"
                  checked={isSecret}
                  onChange={(e) => setIsSecret(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isSecret" className="ml-2 text-sm text-gray-700">
                  Keep this board secret
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateBoard(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveToBoardModal;
