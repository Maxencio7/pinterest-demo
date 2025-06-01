
import React, { useState, useEffect } from 'react';
import PinCard from './PinCard';
import { usePin, Pin } from '../contexts/PinContext';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { pins } = usePin();
  const { user } = useAuth();
  const [displayedPins, setDisplayedPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PINS_PER_PAGE = 20;

  useEffect(() => {
    // Initialize with first batch of pins
    setDisplayedPins(pins.slice(0, PINS_PER_PAGE));
    setPage(1);
  }, [pins]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMorePins();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, pins, loading]);

  const loadMorePins = () => {
    if (loading || displayedPins.length >= pins.length) return;

    setLoading(true);
    setTimeout(() => {
      const nextPins = pins.slice(0, (page + 1) * PINS_PER_PAGE);
      setDisplayedPins(nextPins);
      setPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  if (pins.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No pins yet</h3>
          <p className="text-gray-500 mb-6">Start creating pins to see them here!</p>
          <a
            href="/pin/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Create your first pin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Masonry Grid */}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {displayedPins.map((pin) => (
          <div key={pin.id} className="break-inside-avoid mb-4">
            <PinCard pin={pin} />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* End message */}
      {!loading && displayedPins.length >= pins.length && pins.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
