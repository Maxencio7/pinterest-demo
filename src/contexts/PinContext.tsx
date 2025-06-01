
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  userId: string;
  username: string;
  userAvatar?: string;
  boardId?: string;
  boardName?: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: Comment[];
  createdAt: string;
  dominantColor?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  userId: string;
  pinIds: string[];
  isSecret: boolean;
  createdAt: string;
  coverImage?: string;
}

interface PinContextType {
  pins: Pin[];
  boards: Board[];
  addPin: (pin: Omit<Pin, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>) => void;
  updatePin: (pinId: string, updates: Partial<Pin>) => void;
  deletePin: (pinId: string) => void;
  likePin: (pinId: string, userId: string) => void;
  addComment: (pinId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'pinIds'>) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  addPinToBoard: (pinId: string, boardId: string) => void;
  removePinFromBoard: (pinId: string, boardId: string) => void;
  searchPins: (query: string) => Pin[];
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const usePin = () => {
  const context = useContext(PinContext);
  if (context === undefined) {
    throw new Error('usePin must be used within a PinProvider');
  }
  return context;
};

export const PinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedPins = localStorage.getItem('pinterest_pins');
    const savedBoards = localStorage.getItem('pinterest_boards');
    
    if (savedPins) {
      setPins(JSON.parse(savedPins));
    }
    
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }
  };

  const savePins = (newPins: Pin[]) => {
    setPins(newPins);
    localStorage.setItem('pinterest_pins', JSON.stringify(newPins));
  };

  const saveBoards = (newBoards: Board[]) => {
    setBoards(newBoards);
    localStorage.setItem('pinterest_boards', JSON.stringify(newBoards));
  };

  const addPin = (pinData: Omit<Pin, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>) => {
    const newPin: Pin = {
      ...pinData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    
    savePins([newPin, ...pins]);
  };

  const updatePin = (pinId: string, updates: Partial<Pin>) => {
    const updatedPins = pins.map(pin => 
      pin.id === pinId ? { ...pin, ...updates } : pin
    );
    savePins(updatedPins);
  };

  const deletePin = (pinId: string) => {
    const updatedPins = pins.filter(pin => pin.id !== pinId);
    savePins(updatedPins);
    
    // Remove from boards
    const updatedBoards = boards.map(board => ({
      ...board,
      pinIds: board.pinIds.filter(id => id !== pinId)
    }));
    saveBoards(updatedBoards);
  };

  const likePin = (pinId: string, userId: string) => {
    const updatedPins = pins.map(pin => {
      if (pin.id === pinId) {
        const isLiked = pin.likedBy.includes(userId);
        return {
          ...pin,
          likes: isLiked ? pin.likes - 1 : pin.likes + 1,
          likedBy: isLiked 
            ? pin.likedBy.filter(id => id !== userId)
            : [...pin.likedBy, userId]
        };
      }
      return pin;
    });
    savePins(updatedPins);
  };

  const addComment = (pinId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedPins = pins.map(pin => 
      pin.id === pinId 
        ? { ...pin, comments: [...pin.comments, newComment] }
        : pin
    );
    savePins(updatedPins);
  };

  const addBoard = (boardData: Omit<Board, 'id' | 'createdAt' | 'pinIds'>) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      pinIds: []
    };
    
    saveBoards([...boards, newBoard]);
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    const updatedBoards = boards.map(board => 
      board.id === boardId ? { ...board, ...updates } : board
    );
    saveBoards(updatedBoards);
  };

  const deleteBoard = (boardId: string) => {
    const updatedBoards = boards.filter(board => board.id !== boardId);
    saveBoards(updatedBoards);
  };

  const addPinToBoard = (pinId: string, boardId: string) => {
    const updatedBoards = boards.map(board => 
      board.id === boardId && !board.pinIds.includes(pinId)
        ? { ...board, pinIds: [...board.pinIds, pinId] }
        : board
    );
    saveBoards(updatedBoards);

    // Update pin with board info
    const board = boards.find(b => b.id === boardId);
    if (board) {
      updatePin(pinId, { boardId, boardName: board.name });
    }
  };

  const removePinFromBoard = (pinId: string, boardId: string) => {
    const updatedBoards = boards.map(board => 
      board.id === boardId
        ? { ...board, pinIds: board.pinIds.filter(id => id !== pinId) }
        : board
    );
    saveBoards(updatedBoards);

    // Remove board info from pin
    updatePin(pinId, { boardId: undefined, boardName: undefined });
  };

  const searchPins = (query: string): Pin[] => {
    if (!query.trim()) return pins;
    
    const lowercaseQuery = query.toLowerCase();
    return pins.filter(pin => 
      pin.title.toLowerCase().includes(lowercaseQuery) ||
      pin.description.toLowerCase().includes(lowercaseQuery) ||
      pin.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const exportData = (): string => {
    const data = {
      pins,
      boards,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.pins && data.boards) {
        savePins(data.pins);
        saveBoards(data.boards);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <PinContext.Provider value={{
      pins,
      boards,
      addPin,
      updatePin,
      deletePin,
      likePin,
      addComment,
      addBoard,
      updateBoard,
      deleteBoard,
      addPinToBoard,
      removePinFromBoard,
      searchPins,
      exportData,
      importData
    }}>
      {children}
    </PinContext.Provider>
  );
};
