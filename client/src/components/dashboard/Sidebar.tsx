import React from "react";
import { Link, useLocation } from "wouter";
import { useDisaster } from "@/context/DisasterContext";

export default function Sidebar() {
  const [location] = useLocation();
  const { currentUser } = useDisaster();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-full overflow-y-auto hidden md:block">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white mr-2">
            <span className="material-icons text-sm">public</span>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">DisasterSense</h1>
        </div>
      </div>
      
      <nav className="p-2">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 pb-1">
            Monitoring
          </h2>
          <Link href="/">
            <a className={`flex items-center px-3 py-2 rounded-md mb-1 font-medium ${
              location === "/" 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <span className="material-icons text-sm mr-3">dashboard</span>
              Dashboard
            </a>
          </Link>
          <Link href="/trends">
            <a className={`flex items-center px-3 py-2 rounded-md mb-1 font-medium ${
              location === "/trends" 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <span className="material-icons text-sm mr-3">trending_up</span>
              Trends
            </a>
          </Link>
          <Link href="/geographic">
            <a className={`flex items-center px-3 py-2 rounded-md mb-1 font-medium ${
              location === "/geographic" 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <span className="material-icons text-sm mr-3">map</span>
              Geographic View
            </a>
          </Link>
          <Link href="/alerts">
            <a className={`flex items-center px-3 py-2 rounded-md mb-1 font-medium ${
              location === "/alerts" 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <span className="material-icons text-sm mr-3">campaign</span>
              Alerts
              <span className="ml-auto bg-secondary text-white text-xs rounded-full px-2 py-0.5">3</span>
            </a>
          </Link>
        </div>
        
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 pb-1">
            Configuration
          </h2>
          <Link href="/settings">
            <a className={`flex items-center px-3 py-2 rounded-md mb-1 font-medium ${
              location === "/settings" 
                ? "bg-primary bg-opacity-10 text-primary" 
                : "text-neutral-700 hover:bg-neutral-100"
            }`}>
              <span className="material-icons text-sm mr-3">settings</span>
              Settings
            </a>
          </Link>
          <Link href="/settings#keywords">
            <a className="flex items-center px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 mb-1 font-medium">
              <span className="material-icons text-sm mr-3">tune</span>
              Keyword Management
            </a>
          </Link>
          <Link href="/settings#filters">
            <a className="flex items-center px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 mb-1 font-medium">
              <span className="material-icons text-sm mr-3">filter_alt</span>
              Filter Rules
            </a>
          </Link>
        </div>
        
        <div>
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 pb-1">
            System
          </h2>
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 mb-1 font-medium">
            <span className="material-icons text-sm mr-3">admin_panel_settings</span>
            Admin
          </a>
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-neutral-700 hover:bg-neutral-100 mb-1 font-medium">
            <span className="material-icons text-sm mr-3">help_outline</span>
            Help & Support
          </a>
        </div>
      </nav>
      
      <div className="p-4 mt-auto border-t border-neutral-200">
        <div className="flex items-center">
          <img 
            src={currentUser.avatarUrl || "https://via.placeholder.com/40"} 
            alt="User avatar" 
            className="w-8 h-8 rounded-full mr-2" 
          />
          <div>
            <p className="text-sm font-medium text-neutral-900">{currentUser.fullName}</p>
            <p className="text-xs text-neutral-500">{currentUser.role}</p>
          </div>
          <button className="ml-auto text-neutral-400 hover:text-neutral-500">
            <span className="material-icons text-sm">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
