
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Grid, Settings, PlusCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold heading-gradient">
          Gigstr
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/gigs" className="text-gray-600 hover:text-gigstr-purple transition-colors">
            Find Gigs
          </Link>
          <Link to="/create-gig" className="text-gray-600 hover:text-gigstr-purple transition-colors">
            Post a Gig
          </Link>
          {/* More navigation links here */}
        </nav>
        
        {/* Auth / Profile */}
        <div className="hidden md:block">
          {user ? (
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth?tab=signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 flex flex-col space-y-3">
            <Link 
              to="/gigs" 
              className="text-gray-600 hover:text-gigstr-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Gigs
            </Link>
            <Link 
              to="/create-gig" 
              className="text-gray-600 hover:text-gigstr-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Post a Gig
            </Link>
            
            {user ? (
              <>
                <div className="border-t my-2"></div>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-gigstr-purple transition-colors py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Grid className="mr-2 h-4 w-4" /> Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-gigstr-purple transition-colors py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-gigstr-purple transition-colors py-2 flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t my-2"></div>
                <Link 
                  to="/auth" 
                  className="text-gray-600 hover:text-gigstr-purple transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth?tab=signup" 
                  className="bg-gigstr-purple text-white rounded-md py-2 px-3 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
