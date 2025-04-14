
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative bg-gradient-to-br from-white to-purple-50 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 right-0 h-full bg-[url('https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-cover bg-center"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="heading-gradient">Find Workers</span> When You Need Them
            </h1>
            <p className="text-xl text-gray-600">
              Connect with skilled plumbers, electricians, domestic workers and more in South Africa. Get your problems fixed fast.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">Verified local workers you can trust</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">Same-day service for emergencies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">Affordable rates with no hidden fees</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="btn-primary text-lg h-12 px-8 shadow-xl hover:shadow-gigstr-purple/20"
                onClick={() => navigate('/gigs')}
              >
                Find Workers Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10 text-lg h-12"
                onClick={() => navigate('/create-gig')}
              >
                Offer Your Services
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-gigstr-purple/30 to-gigstr-blue/30 rounded-full blur-3xl"></div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-float">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gigstr-purple to-gigstr-blue flex items-center justify-center text-white font-bold text-lg">SM</div>
                <div>
                  <h3 className="font-semibold">Sipho Mabaso</h3>
                  <p className="text-sm text-gray-500">Plumber</p>
                </div>
                <div className="ml-auto flex items-center">
                  <span className="font-bold text-gigstr-purple">R350</span>
                  <span className="text-gray-500 text-sm">/hr</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Plumbing</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Maintenance</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Emergency</span>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                "I've been helping families in Johannesburg with their plumbing emergencies for over 10 years. Available 24/7 for urgent repairs."
              </p>
              <Button className="w-full bg-gradient-to-r from-gigstr-purple to-gigstr-blue">
                Hire Sipho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
