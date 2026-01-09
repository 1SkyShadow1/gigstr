
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8 border-t border-border">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8">
          <div className="lg:col-span-4 flex flex-col">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-4 font-heading">
              Gigstr
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              South Africa's most trusted marketplace for skilled professionals. Connecting local talent with opportunity, safely and securely.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground">For Clients</h3>
            <ul className="space-y-3">
              <li><Link to="/create-gig" className="text-muted-foreground hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link to="/create-gig" className="text-muted-foreground hover:text-primary transition-colors">Find Professionals</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground">For Freelancers</h3>
            <ul className="space-y-3">
              <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Dispute Policy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:support@gigstr.co.za" className="text-muted-foreground hover:text-primary transition-colors">support@gigstr.co.za</a>
              </li>
              <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">Sandton, Johannesburg<br/>South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} Gigstr (Pty) Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
               <span className="text-xs text-muted-foreground">Proudly South African</span>
               <div className="w-4 h-3 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-sm opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
