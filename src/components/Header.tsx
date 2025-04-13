
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container-custom flex justify-between items-center py-4">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gigstr-purple to-gigstr-blue">
              Gigstr
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-gigstr-purple transition-colors font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-gigstr-purple transition-colors font-medium">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-gigstr-purple transition-colors font-medium">
            Testimonials
          </a>
          <Button 
            variant="outline" 
            className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10"
          >
            Log In
          </Button>
          <Button className="bg-gigstr-purple hover:bg-gigstr-purple/90">
            Sign Up
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:text-gigstr-purple hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 space-y-4">
            <a 
              href="#features" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="pt-2 flex flex-col space-y-4">
              <Button 
                variant="outline" 
                className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10 w-full"
              >
                Log In
              </Button>
              <Button className="bg-gigstr-purple hover:bg-gigstr-purple/90 w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
