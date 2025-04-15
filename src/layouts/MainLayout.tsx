
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 mt-16 ${!isMobile ? 'lg:pl-[280px]' : ''}`}>
        <div className="container-custom py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
