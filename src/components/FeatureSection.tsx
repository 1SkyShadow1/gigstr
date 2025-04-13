
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
    <section id="features" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="heading-gradient">Features</span> You'll Love
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed in the gig economy, all in one platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover"
            >
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
