import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Disaster, User } from '@/types';

interface Filters {
  keywords: string[];
  geography: string | null;
  timeframe: string | null;
}

interface DisasterContextProps {
  currentDisaster: Disaster | null;
  disasters: Disaster[];
  filters: Filters;
  currentUser: User;
  selectDisaster: (disasterId: number) => void;
  updateFilters: (newFilters: Filters) => void;
  isLoading: boolean;
}

const DisasterContext = createContext<DisasterContextProps | undefined>(undefined);

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (context === undefined) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};

interface DisasterProviderProps {
  children: ReactNode;
}

export const DisasterProvider = ({ children }: DisasterProviderProps) => {
  const [currentDisasterId, setCurrentDisasterId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    keywords: ['hurricane', 'flood', 'evacuation', 'damage', 'rescue'],
    geography: 'North Carolina',
    timeframe: 'Last 24 hours'
  });
  
  // Default user for the system
  const [currentUser] = useState<User>({
    id: 1,
    username: 'jdavis',
    password: '', // Not exposing password here
    fullName: 'Jamie Davis',
    role: 'Disaster Response Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  // Fetch all disasters
  const { data: disasters = [], isLoading } = useQuery<Disaster[]>({
    queryKey: ['/api/disasters'],
  });

  // Find the current disaster from the list of disasters
  const currentDisaster = disasters.find(d => d.id === currentDisasterId) || null;

  // Select the first disaster by default if none is selected
  useEffect(() => {
    if (!isLoading && disasters.length > 0 && currentDisasterId === null) {
      setCurrentDisasterId(disasters[0].id);
    }
  }, [disasters, isLoading, currentDisasterId]);

  const selectDisaster = (disasterId: number) => {
    setCurrentDisasterId(disasterId);
  };

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const value = {
    currentDisaster,
    disasters,
    filters,
    currentUser,
    selectDisaster,
    updateFilters,
    isLoading
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
};
