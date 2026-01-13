import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitch from './ThemeSwitch';
import { 
  Home, 
  BriefcaseBusiness, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle,
  Settings,
  LogOut,
  Award,
  CreditCard,
  Briefcase,
  FileText,
  Clock,
  LayoutDashboard,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobileDetect } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem = ({ icon: Icon, label, to, onClick, badge }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 my-1 rounded-xl transition-all duration-300 group",
        isActive 
          ? "bg-primary/10 text-primary shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onClick}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
      <span className="font-medium tracking-wide">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-glow">
          {badge}
        </span>
      )}
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useMobileDetect();
  const location = useLocation();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  const sidebarVariants = {
    open: { 
      x: 0,
      width: "18rem", // w-72 matches
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    closed: { 
      x: "-100%", 
      width: "18rem", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  if(!user) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Permanent) & Mobile Drawer */}
      <motion.aside 
        initial={isMobile ? "closed" : "open"}
        animate={isOpen || !isMobile ? "open" : "closed"}
        variants={isMobile ? sidebarVariants : undefined}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col pt-20 pb-6 glass-panel border-r border-border/50",
          !isMobile && "sticky top-0 h-screen w-72 bg-transparent border-none shadow-none translate-x-0"
        )}
      >
        <div className="px-6 mb-8 pt-4">
             {/* Logo or Brand could go here if header wasn't prevalent */}
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-glow">
                    <span className="font-heading font-bold text-white text-xl">G</span>
                </div>
                <span className="font-heading font-bold text-2xl tracking-tight hidden md:block text-foreground">Gigstr</span>
            </div>

            <Button 
                variant="glow" 
                className="w-full justify-center gap-2 py-6 text-sm shadow-lg group relative overflow-hidden"
                asChild
              >
                <Link to="/create-gig">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-20 group-hover:animate-shimmer bg-[length:200%_100%] transition-all" />
                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Post a Gig</span>
                </Link>
            </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
            <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Main</p>
                <SidebarItem icon={Home} label="Dashboard" to="/dashboard" />
                <SidebarItem icon={CheckCircle} label="Active Gigs" to="/active-gigs" />
                <SidebarItem icon={BriefcaseBusiness} label="Find Gigs" to="/gigs" />
                <SidebarItem icon={MessageSquare} label="Messages" to="/messages" badge={0} />
                <SidebarItem icon={Bell} label="Notifications" to="/notifications" />
                
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Tools</p>
                <SidebarItem icon={LayoutDashboard} label="Tools Hub" to="/tools" />
                <SidebarItem icon={CreditCard} label="Invoicing" to="/tools/invoicing" />
                <SidebarItem icon={Clock} label="Time Tracking" to="/tools/time-tracking" />
                
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Account</p>
                <SidebarItem icon={User} label="Profile" to="/profile" />
                <SidebarItem icon={Award} label="Rewards" to="/rewards" />
                <SidebarItem icon={Settings} label="Settings" to="/settings" />
            </div>
        </ScrollArea>

        <div className="px-4 mt-auto">
            {/* Theme Toggle for Desktop Sidebar */}
            <div className="mb-4 px-2 flex justify-between items-center">
                 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</span>
                 <ThemeSwitch />
            </div>

            <Link to="/profile" className="glass p-4 rounded-xl flex items-center gap-3 mb-4 cursor-pointer hover:bg-white/5 transition-colors group">
                 {/* User Mini Profile */}
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.email?.charAt(0).toUpperCase()
                    )}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">{profile?.username || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-muted-foreground truncate">View Profile</p>
                 </div>
            </Link>

            <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                onClick={signOut}
            >
                <LogOut size={18} />
                <span>Log Out</span>
            </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
