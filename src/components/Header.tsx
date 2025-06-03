
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePin } from '../contexts/PinContext';
import { User, Search, Bell, MessageCircle, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { searchPins } = usePin();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/', { state: { searchQuery: searchQuery.trim() } });
      setShowSearchResults(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchPins(query.trim()).slice(0, 6);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="hidden md:block text-xl font-bold text-gray-900">Pinterest</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive('/') 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/explore')}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive('/explore') 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => navigate('/pin/create')}
              className={`px-4 py-3 rounded-full font-semibold transition-colors ${
                isActive('/pin/create') 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Create
            </button>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search for ideas"
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                {searchResults.map((pin: any) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setSearchQuery(pin.title);
                      setShowSearchResults(false);
                      navigate('/', { state: { searchQuery: pin.title } });
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img 
                      src={pin.imageUrl} 
                      alt={pin.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{pin.title}</div>
                      <div className="text-gray-500 text-xs truncate">{pin.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-gray-700" />
            </button>

            {/* Messages */}
            <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
              <MessageCircle className="h-6 w-6 text-gray-700" />
            </button>

            {/* Create Button */}
            <button
              onClick={() => navigate('/pin/create')}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Plus className="h-6 w-6 text-gray-700" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{user?.username}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 font-medium"
                  >
                    Your profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900"
                  >
                    Settings
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
