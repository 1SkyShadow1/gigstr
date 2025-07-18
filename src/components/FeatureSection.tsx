
import React from 'react';
import { Search, DollarSign, Shield, Calendar, Gift, Settings } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Find Work Easily",
    description: "Our smart algorithms match you with relevant gigs that fit your skills and preferences."
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Get Paid Fast",
    description: "Receive payment within 24 hours after completing your work. No more lengthy wait times."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Transactions",
    description: "All payments and communications are secured with enterprise-grade encryption."
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Flexible Schedule",
    description: "Work whenever you want. Pick projects that fit your availability and lifestyle."
  },
  {
    icon: <Gift className="h-6 w-6" />,
    title: "Loyalty Rewards",
    description: "Earn points for completed jobs and redeem them for premium features or cash bonuses."
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Powerful Tools",
    description: "Access invoicing, time tracking, and project management tools to boost your productivity."
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="section-padding bg-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 heading-gradient">
            Features You'll Love
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed in the gig economy, all in one platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-glass p-6 rounded-xl shadow-glass border border-gigstr-purple/10 card-hover backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-gigstr-purple mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
