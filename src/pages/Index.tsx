
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
import Header from '@/components/Header';
import { TrendingUp, Briefcase, CreditCard, Star } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoader, setShowLoader] = useState(() => !user);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, showLoader, navigate]);

  if (showLoader) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen min-w-full animate-glow"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(60, 0, 90, 0.98) 0%, rgba(80, 0, 120, 0.92) 60%, rgba(162, 89, 217, 0.7) 100%)',
          boxShadow: '0 0 120px 40px #6d28d9, 0 0 240px 80px #a259d9',
          filter: 'blur(0px) saturate(1.2) brightness(0.85)',
        }}
      >
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-black text-white drop-shadow-[0_0_32px_#a259d9] mb-6 tracking-tight animate-fade-in" style={{textShadow: '0 0 32px #a259d9, 0 0 8px #fff'}}>Welcome to Gigstr</h1>
        <p className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-white/95 mb-16 animate-fade-in-slow tracking-wide" style={{textShadow: '0 0 16px #6d28d9, 0 0 4px #fff'}}>Where talent meets opportunity</p>
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
      <Header sidebarOpen={false} setSidebarOpen={() => {}} />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        {/* CTA Section */}
        <section className="relative bg-gray-50 dark:bg-[var(--color-card)] overflow-x-clip">
          {/* Background overlay pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-cover bg-center"></div>
          </div>
          {/* Floating SVG for extra flair */}
          <svg className="absolute -top-10 left-1/4 animate-float-slow z-0" width="180" height="80" viewBox="0 0 180 80" fill="none">
            <ellipse cx="90" cy="40" rx="90" ry="40" fill="#a259d9" fillOpacity="0.07" />
          </svg>
          <div className="container-custom text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers who have found success on our platform. Create your account in minutes.
            </p>
            <div className="flex flex-col items-center justify-center mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm shadow animate-bounce-once">
                <TrendingUp className="h-4 w-4 mr-2" />
                100% Satisfaction Guarantee
              </span>
            </div>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gigstr-purple hover:bg-gray-100 text-lg h-12 px-8 shadow-lg transform transition-transform hover:scale-105 duration-300"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-gigstr-purple text-gigstr-purple hover:bg-gigstr-purple/10 text-lg h-12 px-8"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </section>
        <TestimonialSection />
        {/* Stats Section */}
        <section className="section-padding bg-gray-50 dark:bg-[var(--color-card)] relative overflow-x-clip">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
          </div>
          {/* Floating SVG for extra flair */}
          <svg className="absolute -bottom-10 right-1/4 animate-float-slow z-0" width="180" height="80" viewBox="0 0 180 80" fill="none">
            <ellipse cx="90" cy="40" rx="90" ry="40" fill="#a259d9" fillOpacity="0.07" />
          </svg>
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <StatCard icon={<Briefcase className="h-8 w-8 text-gigstr-purple mb-2" />} value={500000} label="Registered Users" />
              <StatCard icon={<CreditCard className="h-8 w-8 text-gigstr-indigo mb-2" />} value={100000} label="Active Projects" />
              <StatCard icon={<TrendingUp className="h-8 w-8 text-gigstr-blue mb-2" />} value={250000000} label="Payments Processed" prefix="R" />
              <StatCard icon={<Star className="h-8 w-8 text-gigstr-teal mb-2" />} value={4.8} label="Average Rating" isRating />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// StatCard component for animated numbers
function StatCard({ icon, value, label, prefix, isRating }) {
  const [displayValue, setDisplayValue] = React.useState(isRating ? value : 0);
  React.useEffect(() => {
    if (isRating) return;
    let start = 0;
    const end = value;
    const duration = 1200;
    const step = Math.ceil(end / 60);
    let raf;
    function animate() {
      start += step;
      if (start >= end) {
        setDisplayValue(end);
        return;
      }
      setDisplayValue(start);
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => raf && cancelAnimationFrame(raf);
  }, [value, isRating]);
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-all hover:shadow-md hover:scale-105 flex flex-col items-center animate-fade-in-up">
      {icon}
      <h3 className="text-4xl font-bold mb-2">
        {prefix || ''}{isRating ? value : displayValue.toLocaleString()}{isRating ? '/5' : ''}
      </h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

export default Index;
