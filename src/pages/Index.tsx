
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorks from '@/components/HowItWorks';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gigstr-purple to-gigstr-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers who have found success on our platform. Create your account in minutes.
            </p>
            <Button size="lg" className="bg-white text-gigstr-purple hover:bg-gray-100 text-lg h-12 px-8 shadow-lg">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
        
        <TestimonialSection />
        
        {/* Stats Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <h3 className="text-4xl font-bold text-gigstr-purple mb-2">500K+</h3>
                <p className="text-gray-600">Registered Users</p>
              </div>
              <div className="p-6">
                <h3 className="text-4xl font-bold text-gigstr-indigo mb-2">100K+</h3>
                <p className="text-gray-600">Active Projects</p>
              </div>
              <div className="p-6">
                <h3 className="text-4xl font-bold text-gigstr-blue mb-2">$250M+</h3>
                <p className="text-gray-600">Payments Processed</p>
              </div>
              <div className="p-6">
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
