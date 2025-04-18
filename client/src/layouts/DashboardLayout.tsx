import React, { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useDisaster } from "@/context/DisasterContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading } = useDisaster();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-100">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white mb-4">
            <span className="material-icons text-sm">public</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">DisasterSense</h1>
          <p className="text-sm text-neutral-600 mb-4">Loading disaster data...</p>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
