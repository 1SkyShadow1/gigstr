import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useMobileDetect } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Home, Briefcase, MessageSquare, User, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeSwitch from '@/components/ThemeSwitch';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobileDetect();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[100px] animate-blob animation-delay-4000" />
          {/* subtle mesh grid overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ opacity: 0.03 }} />
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative h-screen overflow-hidden">
        {/* Header only on mobile or if needed. We might hide it on desktop if sidebar has search */}
        <div className="md:hidden">
             <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        <main className={cn(
            "flex-1 overflow-y-auto no-scrollbar scroll-smooth p-4 md:p-8 pt-20 md:pt-8 w-full max-w-[1600px] mx-auto",
            isMobile && "pb-24" // Extra padding for bottom bar
        )}>
            {children}
        </main>
      </div>

      {/* Mobile "Dynamic Island" Navigation Bar */}
      {isMobile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
           <div className="glass-panel px-6 py-4 rounded-2xl flex items-center justify-between shadow-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
              <Link to="/dashboard" className={cn("p-2 rounded-xl transition-colors", location.pathname === '/dashboard' ? "text-primary bg-white/10" : "text-muted-foreground")}>
                  <Home size={24} />
              </Link>
              <Link to="/gigs" className={cn("p-2 rounded-xl transition-colors", location.pathname === '/gigs' ? "text-primary bg-white/10" : "text-muted-foreground")}>
                  <Briefcase size={24} />
              </Link>
              <Link to="/create-gig" className="p-3 bg-primary text-white rounded-full -mt-8 shadow-glow ring-4 ring-background transform active:scale-95 transition-transform">
                  <PlusCircle size={28} />
              </Link>
              <Link to="/messages" className={cn("p-2 rounded-xl transition-colors", location.pathname === '/messages' ? "text-primary bg-white/10" : "text-muted-foreground")}>
                  <MessageSquare size={24} />
              </Link>
              <Link to="/profile" className={cn("p-2 rounded-xl transition-colors", location.pathname === '/profile' ? "text-primary bg-white/10" : "text-muted-foreground")}>
                  <User size={24} />
              </Link>
           </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
