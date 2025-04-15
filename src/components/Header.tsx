
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, Grid, Settings, PlusCircle, Search, Bell, MessageSquare, Award, Clock } from 'lucide-react';
import { useMobileDetect } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="container-custom flex items-center justify-between py-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu size={24} />
          </Button>
        )}
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold heading-gradient">
          Gigstr
        </Link>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-4 lg:mx-8 relative">
          <div className="flex items-center w-full max-w-xl relative">
            <Search className="absolute left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for gigs or workers..."
              className="w-full pl-10 py-2 px-4 rounded-full border focus:border-gigstr-purple focus:ring-1 focus:ring-gigstr-purple outline-none"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Quick action buttons */}
              <div className="hidden md:flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link to="/rewards">
                    <Award className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link to="/tools">
                    <Clock className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              {/* User menu */}
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
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Grid className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/create-gig')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post a Gig
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/rewards')}>
                    <Award className="mr-2 h-4 w-4" />
                    Rewards ({profile?.points || 0})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/tools')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Tools
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    </header>
  );
};

export default Header;
