
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8">
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gigstr-purple to-gigstr-blue mb-4">
              Gigstr
            </h2>
            <p className="text-gray-400 mb-6">
              Connecting talented freelancers with amazing clients. Join our growing community today!
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <a href="mailto:support@gigstr.com" className="text-gray-400 hover:text-white transition-colors">support@gigstr.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="md:flex md:justify-between md:items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Gigstr. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
