import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from "@/contexts/ThemeContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, Grid, Settings, PlusCircle, Search, Bell, MessageSquare, Award, Clock, Hammer, Wrench, Home, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useMobileDetect } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import ThemeSwitch from './ThemeSwitch';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();
  const { theme, toggle } = useTheme();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="w-full bg-black/40 sticky top-0 z-50 shadow-lg flex items-center py-2 backdrop-blur-xl border-b border-white/10" style={{ minHeight: '4rem' }}>
      <div className="container mx-auto px-4 flex items-center h-full justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Trigger */}
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-white" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}

          {/* Left: Logo + Slogan */}
          <Link to="/" className="flex flex-row items-center group cursor-pointer select-none gap-3">
            <div className="relative">
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <img src="/icon.png" alt="Gigstr Icon" className="h-10 w-10 object-contain relative z-10" />
            </div>
            <span className="flex flex-col items-start justify-center leading-none">
              <span className="text-2xl font-bold font-heading text-white tracking-tight group-hover:text-primary transition-colors duration-300">Gigstr</span>
              <span className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors duration-300 hidden sm:block">Where Talent meets Opportunity</span>
            </span>
          </Link>
        </div>
        {/* Right: Navigation and Actions */}
        <div className="flex items-center gap-2">
          {/* Main navigation and quick actions for logged-in users */}
          {user && (
            <>
              <nav className="hidden md:flex items-center gap-1">
                <div className="px-2">
                   <ThemeSwitch />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10" asChild title="Home">
                      <Link to="/dashboard">
                        <Home className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white border-white/10">Home</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/10" asChild title="Browse Gigs">
                      <Link to="/gigs">
                        <Search className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white border-white/10">Browse Gigs</TooltipContent>
                </Tooltip>
              </nav>
              <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-2">
                <div className="px-2">
                   <ThemeSwitch />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-white hover:bg-white/10" asChild>
                      <Link to="/messages">
                        <MessageSquare className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white border-white/10">Messages</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-white hover:bg-white/10" asChild>
                      <Link to="/notifications">
                        <Bell className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white border-white/10">Notifications</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-white hover:bg-white/10" asChild>
                      <Link to="/tools">
                        <Wrench className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-white border-white/10">Tools</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
          {/* User menu and theme toggle */}
          <div className="flex items-center gap-3 pl-2">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 border border-white/10 hover:border-primary/50 transition-colors">
                      <Avatar className="h-full w-full">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={profile.username} />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {profile?.points && profile.points > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-black border-none animate-in zoom-in">
                          {profile.points}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 backdrop-blur-xl text-white">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    {/* Mobile nav links in dropdown */}
                    <div className="md:hidden">
                      <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link to="/dashboard">
                          <Home className="mr-2 h-4 w-4" /> Home
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link to="/gigs">
                          <Search className="mr-2 h-4 w-4" /> Browse Gigs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link to="/messages">
                          <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                        <Link to="/tools">
                          <Wrench className="mr-2 h-4 w-4" /> Tools
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="focus:bg-white/10 focus:text-white cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="focus:bg-white/10 focus:text-white cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => signOut()} className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Button size="sm" onClick={() => navigate('/auth?tab=signup')} className="bg-primary text-black hover:bg-primary/90 shadow-glow-sm">
                  Get Started
                </Button>
                <div className="ml-1">
                  <ThemeSwitch />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
