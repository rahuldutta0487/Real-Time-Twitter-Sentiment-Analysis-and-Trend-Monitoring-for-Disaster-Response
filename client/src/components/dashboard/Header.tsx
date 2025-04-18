import React, { useState } from "react";
import DisasterSelector from "./DisasterSelector";
import FilterChip from "./FilterChip";
import { useDisaster } from "@/context/DisasterContext";

export default function Header() {
  const { currentDisaster, filters, updateFilters } = useDisaster();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const removeKeywordFilter = (keyword: string) => {
    updateFilters({
      ...filters,
      keywords: filters.keywords.filter(k => k !== keyword)
    });
  };

  const removeGeographicFilter = () => {
    updateFilters({
      ...filters,
      geography: null
    });
  };

  const removeTimeframeFilter = () => {
    updateFilters({
      ...filters,
      timeframe: null
    });
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 text-neutral-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-icons">menu</span>
            </button>
            
            <DisasterSelector />
          </div>
          
          <div className="flex items-center">
            {/* Live indicator */}
            <div className="mr-4 flex items-center">
              <span className="pulse-indicator bg-secondary animate-pulse"></span>
              <span className="text-xs font-medium">LIVE</span>
            </div>
            
            {/* Search */}
            <div className="relative mr-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <span className="material-icons text-sm">search</span>
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            
            {/* Notification bell */}
            <button className="p-1 rounded-full text-neutral-500 hover:text-neutral-600 relative">
              <span className="material-icons">notifications</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-secondary"></span>
            </button>
          </div>
        </div>
        
        {/* Filter bar */}
        <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-2 text-sm">
          <span className="font-medium text-neutral-700">Active Filters:</span>
          
          {filters.keywords.map((keyword) => (
            <FilterChip
              key={keyword}
              label={keyword}
              type="keyword"
              onRemove={() => removeKeywordFilter(keyword)}
            />
          ))}
          
          {filters.geography && (
            <FilterChip
              label={filters.geography}
              type="location"
              onRemove={removeGeographicFilter}
            />
          )}
          
          {filters.timeframe && (
            <FilterChip
              label={filters.timeframe}
              type="time"
              onRemove={removeTimeframeFilter}
            />
          )}
          
          <button className="ml-auto text-primary hover:text-primary-dark font-medium focus:outline-none flex items-center">
            <span className="material-icons text-sm mr-1">add</span>
            Add Filter
          </button>
        </div>
      </div>
    </header>
  );
}
