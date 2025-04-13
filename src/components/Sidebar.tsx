
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BriefcaseBusiness, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle,
  Search,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMobileDetect } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, onClick }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors",
        isActive && "bg-gigstr-purple/10 text-gigstr-purple font-medium"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={cn(isActive && "text-gigstr-purple")} />
      <span>{label}</span>
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const isMobile = useMobileDetect();
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 lg:left-0 z-40 w-[280px] bg-white border-r shadow-sm transition-transform duration-300",
          isOpen ? "left-0" : "-left-[280px] lg:left-0"
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b sticky top-0 bg-white z-10">
          <Link to="/" className="text-2xl font-bold heading-gradient">
            Gigstr
          </Link>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={handleToggle}>
              <X size={20} />
            </Button>
          )}
        </div>
        
        {/* Sidebar content */}
        <ScrollArea className="h-[calc(100vh-4rem)] py-2 px-2">
          <div className="mb-4">
            {user && (
              <Button 
                variant="default" 
                className="w-full justify-start gap-2 mb-2"
                asChild
              >
                <Link to="/create-gig" onClick={closeSidebarOnMobile}>
                  <PlusCircle size={18} />
                  <span>Post a Gig</span>
                </Link>
              </Button>
            )}
            
            <div className="space-y-1 py-2">
              <SidebarItem icon={Home} label="Home" to="/" onClick={closeSidebarOnMobile} />
              <SidebarItem icon={Search} label="Browse Gigs" to="/gigs" onClick={closeSidebarOnMobile} />
              <SidebarItem icon={BriefcaseBusiness} label="Dashboard" to="/dashboard" onClick={closeSidebarOnMobile} />
            </div>
            
            <Separator className="my-4" />
            
            {user ? (
              <>
                <div className="space-y-1 py-1">
                  <SidebarItem icon={MessageSquare} label="Messages" to="/messages" onClick={closeSidebarOnMobile} />
                  <SidebarItem icon={Bell} label="Notifications" to="/notifications" onClick={closeSidebarOnMobile} />
                  <SidebarItem icon={User} label="Profile" to="/profile" onClick={closeSidebarOnMobile} />
                  <SidebarItem icon={Settings} label="Settings" to="/settings" onClick={closeSidebarOnMobile} />
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      signOut();
                      closeSidebarOnMobile();
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Button className="w-full" asChild onClick={closeSidebarOnMobile}>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild onClick={closeSidebarOnMobile}>
                  <Link to="/auth?tab=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
