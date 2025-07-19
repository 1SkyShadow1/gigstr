
import React from 'react';
// Replace Lucide icons with custom SVGs for more visual appeal
const featureIcons = [
  // SVGs for each feature
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#a259d9" fillOpacity="0.12"/><path d="M10 16h12M16 10v12" stroke="#a259d9" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="4" fill="#6d28d9" fillOpacity="0.12"/><path d="M8 20h16M8 16h16" stroke="#6d28d9" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#10b981" fillOpacity="0.10"/><path d="M10 16l4 4 8-8" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="8" y="8" width="16" height="16" rx="8" fill="#2563eb" fillOpacity="0.10"/><path d="M16 12v8M12 16h8" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#f59e42" fillOpacity="0.10"/><path d="M16 10v8l4 4" stroke="#f59e42" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="6" y="6" width="20" height="20" rx="6" fill="#6366f1" fillOpacity="0.10"/><path d="M12 20l8-8" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round"/></svg>
  ),
];

const features = [
  {
    title: "Find Work Easily",
    description: "Our smart algorithms match you with relevant gigs that fit your skills and preferences."
  },
  {
    title: "Get Paid Fast",
    description: "Receive payment within 24 hours after completing your work. No more lengthy wait times."
  },
  {
    title: "Secure Transactions",
    description: "All payments and communications are secured with enterprise-grade encryption."
  },
  {
    title: "Flexible Schedule",
    description: "Work whenever you want. Pick projects that fit your availability and lifestyle."
  },
  {
    title: "Loyalty Rewards",
    description: "Earn points for completed jobs and redeem them for premium features or cash bonuses."
  },
  {
    title: "Powerful Tools",
    description: "Access invoicing, time tracking, and project management tools to boost your productivity."
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="section-padding bg-white relative overflow-x-clip">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
      </div>
      {/* Floating SVG shape for extra flair */}
      <svg className="absolute -top-16 right-1/4 animate-float-slow z-0" width="180" height="80" viewBox="0 0 180 80" fill="none">
        <ellipse cx="90" cy="40" rx="90" ry="40" fill="#a259d9" fillOpacity="0.07" />
      </svg>
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
              className="bg-glass p-6 rounded-xl shadow-glass border border-gigstr-purple/10 card-hover backdrop-blur-sm group transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.12 + 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-white to-purple-50 group-hover:scale-110 transition-transform duration-300">
                {featureIcons[index]}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-gigstr-purple transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 0.7s cubic-bezier(.4,2,.3,1) forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .card-hover:hover {
          box-shadow: 0 8px 32px 0 rgba(80,0,120,0.15), 0 0 32px 8px #a259d9;
        }
      `}</style>
    </section>
  );
};

export default FeatureSection;
