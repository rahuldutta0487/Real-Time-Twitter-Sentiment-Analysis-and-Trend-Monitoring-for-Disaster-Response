import React, { useState } from "react";
import { useDisaster } from "@/context/DisasterContext";

export default function DisasterSelector() {
  const { currentDisaster, disasters, selectDisaster } = useDisaster();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDisaster = (disasterId: number) => {
    selectDisaster(disasterId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons text-sm mr-1 text-primary">warning</span>
        {currentDisaster?.name || "Select Disaster"}
        <span className="material-icons text-sm ml-1">keyboard_arrow_down</span>
      </button>
      
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {disasters.map(disaster => (
              <button
                key={disaster.id}
                className={`w-full text-left px-4 py-2 text-sm ${currentDisaster?.id === disaster.id ? 'bg-primary bg-opacity-10 text-primary' : 'text-neutral-700 hover:bg-neutral-100'}`}
                role="menuitem"
                onClick={() => handleSelectDisaster(disaster.id)}
              >
                {disaster.name}
                <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700">
                  {disaster.status}
                </span>
              </button>
            ))}
            
            {disasters.length === 0 && (
              <div className="px-4 py-2 text-sm text-neutral-500">
                No active disasters
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
