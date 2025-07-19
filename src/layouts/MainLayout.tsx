
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useMobileDetect } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobileDetect();
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-bg duration-500 relative overflow-x-clip">
      {/* Floating SVG background shapes for visual depth */}
      <svg className="absolute left-1/4 top-0 z-0 animate-float-slow pointer-events-none" width="180" height="80" viewBox="0 0 180 80" fill="none">
        <ellipse cx="90" cy="40" rx="90" ry="40" fill="#a259d9" fillOpacity="0.07" />
      </svg>
      <svg className="absolute right-0 bottom-0 z-0 animate-float-slower pointer-events-none" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="60" fill="#43e6fc" fillOpacity="0.06" />
      </svg>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 transition-all duration-500 mt-16 z-10">
        <div className="container-custom py-6 px-2 sm:px-4 md:px-8 w-full max-w-7xl mx-auto bg-[var(--color-bg-glass)] dark:bg-[var(--color-bg-glass)] rounded-2xl shadow-glass dark:shadow-glow backdrop-blur-md transition-all duration-500 border border-[var(--color-border)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
