
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const HeroSection = () => {
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
              <span className="heading-gradient">Earn Money</span> Doing What You Love
            </h1>
            <p className="text-xl text-gray-600">
              Connect with clients looking for your talents. Freelance with ease and get paid faster.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">No middleman fees, keep more of what you earn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">Get paid within 24 hours of job completion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700">Thousands of new jobs posted daily</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="btn-primary text-lg h-12 px-8 shadow-xl hover:shadow-gigstr-purple/20">
                Find Gigs Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10 text-lg h-12">
                Hire Talent
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-gigstr-purple/30 to-gigstr-blue/30 rounded-full blur-3xl"></div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-float">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gigstr-purple to-gigstr-blue flex items-center justify-center text-white font-bold text-lg">JD</div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-500">Web Developer</p>
                </div>
                <div className="ml-auto flex items-center">
                  <span className="font-bold text-gigstr-purple">$75</span>
                  <span className="text-gray-500 text-sm">/hr</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">React</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">TypeScript</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Node.js</span>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                "I've earned over $45,000 in my first year on Gigstr. The platform makes connecting with quality clients so simple!"
              </p>
              <Button className="w-full bg-gradient-to-r from-gigstr-purple to-gigstr-blue">
                Hire John
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
