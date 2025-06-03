
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePin } from '../contexts/PinContext';
import { useAuth } from '../contexts/AuthContext';
import PinCard from './PinCard';
import { Pin } from '../contexts/PinContext';

const Home = () => {
  const { pins, searchPins } = usePin();
  const { user } = useAuth();
  const [displayedPins, setDisplayedPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const observer = useRef<IntersectionObserver>();
  
  const PINS_PER_LOAD = 20;

  const lastPinElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePins();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMorePins = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const allPins = searchQuery ? searchPins(searchQuery) : pins;
      const currentLength = displayedPins.length;
      const newPins = allPins.slice(currentLength, currentLength + PINS_PER_LOAD);
      
      if (newPins.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedPins(prev => [...prev, ...newPins]);
      }
      
      setLoading(false);
    }, 500);
  }, [pins, displayedPins.length, searchQuery, loading, hasMore, searchPins]);

  useEffect(() => {
    // Reset and load initial pins
    setDisplayedPins([]);
    setHasMore(true);
    setLoading(true);
    
    setTimeout(() => {
      const allPins = searchQuery ? searchPins(searchQuery) : pins;
      const initialPins = allPins.slice(0, PINS_PER_LOAD);
      setDisplayedPins(initialPins);
      setHasMore(allPins.length > PINS_PER_LOAD);
      setLoading(false);
    }, 300);
  }, [pins, searchQuery, searchPins]);

  // Generate some sample pins if none exist
  useEffect(() => {
    if (pins.length === 0 && user) {
      // This would typically be handled by the backend
      // For demo purposes, we'll show a message to create pins
    }
  }, [pins.length, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Pinterest</h2>
          <p className="text-gray-600">Please log in to see your feed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Search results for "{searchQuery}"
          </h1>
          <p className="text-gray-600 mt-1">
            {displayedPins.length} {displayedPins.length === 1 ? 'Pin' : 'Pins'}
          </p>
        </div>
      )}

      {/* Pins Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {displayedPins.length > 0 ? (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4">
            {displayedPins.map((pin, index) => (
              <div 
                key={pin.id} 
                className="break-inside-avoid mb-4"
                ref={index === displayedPins.length - 1 ? lastPinElementRef : null}
              >
                <PinCard pin={pin} />
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchQuery ? 'No pins found' : 'No pins yet'}
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `We couldn't find any pins matching "${searchQuery}". Try a different search term.`
                : 'Start creating and saving pins to see them in your feed.'}
            </p>
            <button
              onClick={() => window.location.href = '/pin/create'}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Create your first Pin
            </button>
          </div>
        ) : null}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* End of Feed Message */}
        {!hasMore && displayedPins.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You've reached the end!</p>
            <button
              onClick={() => window.location.href = '/pin/create'}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Create more content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
