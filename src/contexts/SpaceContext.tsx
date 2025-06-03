'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SpaceContextType {
  currentSpaceId: string | null;
  setCurrentSpaceId: (id: string | null) => void;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSpaceId, setCurrentSpaceIdState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('currentSpaceId');
    if (stored) setCurrentSpaceIdState(stored);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (currentSpaceId) {
      localStorage.setItem('currentSpaceId', currentSpaceId);
    } else {
      localStorage.removeItem('currentSpaceId');
    }
  }, [currentSpaceId]);

  const setCurrentSpaceId = (id: string | null) => {
    setCurrentSpaceIdState(id);
  };

  return (
    <SpaceContext.Provider value={{ currentSpaceId, setCurrentSpaceId }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) throw new Error('useSpace must be used within a SpaceProvider');
  return context;
}; 