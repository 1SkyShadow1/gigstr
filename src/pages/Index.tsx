import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import PopularServices from '@/components/PopularServices';
import SafetySection from '@/components/SafetySection';
import OpportunitySpectrum from '@/components/OpportunitySpectrum';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AnimatedPage from '@/components/AnimatedPage';

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
      }, 3000); // Reduced load time for snappier feel
      return () => clearTimeout(timer);
    }
  }, [user, showLoader, navigate]);

  if (showLoader) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen min-w-full bg-background"
      >
          {/* Custom Modern Loader */}
          <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 bg-primary/10 rounded-full blur-md animate-pulse"></div>
          </div>
          <h2 className="mt-8 text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Gigstr</h2>
      </div>
    );
  }

  return (
    <AnimatedPage>
        <div className="bg-background text-foreground min-h-screen selection:bg-primary/30">
          <Header sidebarOpen={false} setSidebarOpen={() => {}} />
          <main>
            <HeroSection />
            <PopularServices />
            <OpportunitySpectrum />
            <FeatureSection />
            <HowItWorks />
            <SafetySection />
            <TestimonialSection />
          </main>
          <Footer />
        </div>
    </AnimatedPage>
  );
};

export default Index;
