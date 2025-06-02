
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';
import Profile from '../components/Profile';
import BoardDetail from '../components/BoardDetail';
import Login from '../components/Login';
import CreatePin from '../components/CreatePin';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { PinProvider } from '../contexts/PinContext';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/board/:boardId" element={<BoardDetail />} />
        <Route path="/pin/create" element={<CreatePin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <PinProvider>
        <AppContent />
      </PinProvider>
    </AuthProvider>
  );
};

export default Index;
