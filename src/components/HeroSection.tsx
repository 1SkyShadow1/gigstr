
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const trustedByLogos = [
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [liveUsers, setLiveUsers] = useState(1200);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate live user counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect for worker card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setParallax({ x, y });
    };
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', () => setParallax({ x: 0, y: 0 }));
    }
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', () => setParallax({ x: 0, y: 0 }));
      }
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-white to-purple-50 dark:from-[#18122b] dark:to-gigstr-purple/10 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full animate-pulse-slow">
          <defs>
            <radialGradient id="bg1" cx="50%" cy="50%" r="80%" fx="50%" fy="50%" gradientTransform="rotate(20)">
              <stop offset="0%" stopColor="#a259d9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a259d9" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <ellipse cx="900" cy="200" rx="600" ry="220" fill="url(#bg1)" />
          <ellipse cx="400" cy="500" rx="400" ry="120" fill="url(#bg2)" />
        </svg>
        {/* Floating shapes */}
        <svg className="absolute left-1/4 top-10 animate-float-slow" width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="60" fill="#a259d9" fillOpacity="0.08" />
        </svg>
        <svg className="absolute right-10 bottom-10 animate-float-slower" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect width="80" height="80" rx="24" fill="#6d28d9" fillOpacity="0.07" />
        </svg>
      </div>
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight heading-gradient">
              Find Workers When You Need Them
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect with skilled plumbers, electricians, domestic workers and more in South Africa. Get your problems fixed fast.
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 dark:bg-gigstr-purple/20 shadow text-gigstr-purple font-semibold text-base animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-ping"></span>
                {liveUsers.toLocaleString()} users online now
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-200">Verified local workers you can trust</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-200">Same-day service for emergencies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-gigstr-purple h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-200">Affordable rates with no hidden fees</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="glow"
                className="text-lg h-12 px-8 animate-bounce-once"
                onClick={() => navigate('/auth')}
              >
                Find Workers Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10 text-lg h-12"
                onClick={() => navigate('/auth?tab=signup')}
              >
                Offer Your Services
              </Button>
            </div>
            {/* Trusted by logo strip */}
            <div className="mt-8">
              <span className="block text-gray-400 text-xs mb-2">Trusted by teams at</span>
              <div className="flex gap-6 items-center opacity-80">
                {trustedByLogos.map((logo, i) => (
                  <img key={i} src={logo} alt="Trusted company logo" className="h-7 grayscale hover:grayscale-0 transition duration-300" />
                ))}
              </div>
            </div>
          </div>
          {/* Worker card with parallax/floating effect */}
          <div className="relative flex justify-center items-center">
            <div
              ref={cardRef}
              style={{
                transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.04)`,
                transition: 'transform 0.2s cubic-bezier(.4,2,.3,1)',
                boxShadow: '0 8px 32px 0 rgba(80,0,120,0.15), 0 0 32px 8px #a259d9',
              }}
              className="bg-glass p-6 rounded-2xl shadow-glass border border-gigstr-purple/20 animate-float backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
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
      {/* Animations */}
      <style>{`
        .animate-float-slow {
          animation: float 7s ease-in-out infinite alternate;
        }
        .animate-float-slower {
          animation: float 12s ease-in-out infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(24px); }
        }
        .animate-bounce-once {
          animation: bounceOnce 0.8s cubic-bezier(.4,2,.3,1) 1;
        }
        @keyframes bounceOnce {
          0% { transform: scale(1); }
          30% { transform: scale(1.12); }
          60% { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite alternate;
        }
        @keyframes pulseSlow {
          0% { opacity: 0.9; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
