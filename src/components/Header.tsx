
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
  const themeMode = theme.mode;

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="w-full bg-white/30 sticky top-0 z-50 shadow-sm flex items-center py-2 rounded-full backdrop-blur-lg border border-white/30" style={{ minHeight: '3.5rem' }}>
      <div className="container-custom max-w-5xl mx-auto flex items-center h-full justify-between pl-0 w-full">
        {/* Left: Logo + Slogan */}
        <Link to="/" className="flex flex-row items-center group cursor-pointer select-none gap-2 ml-0">
          <img src="/icon.png" alt="Gigstr Icon" className="h-16 w-16 object-contain shrink-0 transition duration-200 group-hover:drop-shadow-[0_0_12px_#a259d9] group-hover:brightness-110 group-hover:saturate-150" style={{filter: 'none'}} />
          <span className="flex flex-col items-start justify-center leading-tight">
            <span className="text-2xl font-extrabold text-black transition-colors duration-200 group-hover:text-gigstr-purple" style={{fontFamily: 'Lato, serif'}}>Gigstr</span>
            <span className="text-sm text-gray-600 -mt-0.5 transition-colors duration-200 group-hover:text-gigstr-purple">Where Talent meets opportunity</span>
          </span>
        </Link>
        {/* Right: Navigation and Actions */}
        <div className="flex items-center gap-4">
          {/* Main navigation and quick actions for logged-in users */}
          {user && (
            <>
              <nav className="hidden md:flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild title="Home">
                      <Link to="/dashboard">
                        <Home className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Home</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild title="Browse Gigs">
                      <Link to="/gigs">
                        <Search className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Browse Gigs</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild title="Settings">
                      <Link to="/settings">
                        <Settings className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </nav>
              <div className="hidden md:flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <Link to="/messages">
                        <MessageSquare className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Messages</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <Link to="/notifications">
                        <Bell className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <Link to="/rewards">
                        <Award className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rewards</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <Link to="/tools">
                        <Clock className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tools</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
          {/* User menu and theme toggle */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0">
                      <Avatar>
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={profile.username} />
                        ) : (
                          <AvatarFallback className="bg-gigstr-purple text-white">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {profile?.points && profile.points > 0 && (
                        <Badge variant="default" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                          {profile.points}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Mobile nav links in dropdown */}
                    <div className="md:hidden">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <Home className="mr-2 h-4 w-4" /> Home
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/gigs">
                          <Search className="mr-2 h-4 w-4" /> Browse Gigs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings">
                          <Settings className="mr-2 h-4 w-4" /> Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/messages">
                          <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/notifications">
                          <Bell className="mr-2 h-4 w-4" /> Notifications
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/rewards">
                          <Award className="mr-2 h-4 w-4" /> Rewards
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/tools">
                          <Clock className="mr-2 h-4 w-4" /> Tools
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Custom Theme Switch */}
                <ThemeSwitch />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth?tab=signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
