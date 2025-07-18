
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setLoaderDone(true);
        setShowLoader(false);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    } else {
      setLoaderDone(true);
      setShowLoader(false);
    }
  }, [user]);

  if (showLoader && !loaderDone) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen min-w-full bg-[var(--color-bg)]"
      >
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight animate-fade-in">Welcome to Gigstr</h1>
        <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-12 animate-fade-in-slow tracking-wide">Where talent meets opportunity</p>
        <div className="loader-con mb-8 scale-150 md:scale-200">
          <div style={{ '--i': 0 } as React.CSSProperties} className="pfile"></div>
          <div style={{ '--i': 1 } as React.CSSProperties} className="pfile"></div>
          <div style={{ '--i': 2 } as React.CSSProperties} className="pfile"></div>
          <div style={{ '--i': 3 } as React.CSSProperties} className="pfile"></div>
          <div style={{ '--i': 4 } as React.CSSProperties} className="pfile"></div>
          <div style={{ '--i': 5 } as React.CSSProperties} className="pfile"></div>
        </div>
        <style>{`
          .loader-con {
            position: relative;
            width: 400px;
            max-width: 90vw;
            height: 120px;
            overflow: hidden;
          }
          .pfile {
            position: absolute;
            bottom: 35px;
            width: 60px;
            height: 70px;
            background: linear-gradient(90deg, #fff 0%, #e0b3ff 100%);
            border-radius: 8px;
            box-shadow: 0 8px 32px 0 rgba(80,0,120,0.15);
            transform-origin: center;
            animation: flyRight 3s ease-in-out infinite;
            opacity: 0;
            animation-delay: calc(var(--i) * 0.6s);
          }
          .pfile::before {
            content: "";
            position: absolute;
            top: 12px;
            left: 12px;
            width: 36px;
            height: 7px;
            background-color: #b324db;
            border-radius: 4px;
          }
          .pfile::after {
            content: "";
            position: absolute;
            top: 25px;
            left: 12px;
            width: 26px;
            height: 7px;
            background-color: #ac8dcb;
            border-radius: 4px;
          }
          @keyframes flyRight {
            0% {
              left: -10%;
              transform: scale(0);
              opacity: 0;
            }
            50% {
              left: 45%;
              transform: scale(1.3);
              opacity: 1;
            }
            100% {
              left: 100%;
              transform: scale(0);
              opacity: 0;
            }
          }
          @media (max-width: 600px) {
            .loader-con {
              width: 90vw;
              height: 80px;
            }
            .pfile {
              width: 36px;
              height: 44px;
              bottom: 18px;
            }
            .pfile::before {
              width: 20px;
              height: 4px;
              left: 8px;
              top: 7px;
            }
            .pfile::after {
              width: 14px;
              height: 4px;
              left: 8px;
              top: 15px;
            }
          }
          .animate-fade-in {
            animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in-slow {
            animation: fadeIn 2s cubic-bezier(0.4,0,0.2,1) both;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        
        {/* CTA Section */}
        <section className="relative bg-gray-50 dark:bg-[var(--color-card)]">
          {/* Background overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-cover bg-center"></div>
          </div>
          
          <div className="container-custom text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers who have found success on our platform. Create your account in minutes.
            </p>
            {!user && (
              <Button 
                size="lg" 
                className="bg-white text-gigstr-purple hover:bg-gray-100 text-lg h-12 px-8 shadow-lg transform transition-transform hover:scale-105 duration-300"
                onClick={() => navigate('/auth')}
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </section>
        
        <TestimonialSection />
        
        {/* Stats Section */}
        <section className="section-padding bg-gray-50 dark:bg-[var(--color-card)] relative">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:scale-105">
                <h3 className="text-4xl font-bold text-gigstr-purple mb-2">500K+</h3>
                <p className="text-gray-600">Registered Users</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:scale-105">
                <h3 className="text-4xl font-bold text-gigstr-indigo mb-2">100K+</h3>
                <p className="text-gray-600">Active Projects</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:scale-105">
                <h3 className="text-4xl font-bold text-gigstr-blue mb-2">R250M+</h3>
                <p className="text-gray-600">Payments Processed</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:scale-105">
                <h3 className="text-4xl font-bold text-gigstr-teal mb-2">4.8/5</h3>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
