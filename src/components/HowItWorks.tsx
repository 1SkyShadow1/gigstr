
import React from 'react';
import { UserCircle, Search, FileText, CreditCard } from 'lucide-react';

const steps = [
  {
    icon: <UserCircle className="h-8 w-8" />,
    title: "Create Your Profile",
    description: "Sign up and showcase your skills, experience, and portfolio to stand out to potential clients.",
    color: "from-gigstr-purple to-gigstr-indigo"
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Find Opportunities",
    description: "Browse available gigs or get matched with projects that align with your expertise and interests.",
    color: "from-gigstr-indigo to-gigstr-blue"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Complete Your Work",
    description: "Deliver quality work on time and build your reputation through client ratings and reviews.",
    color: "from-gigstr-blue to-gigstr-teal"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Get Paid Securely",
    description: "Receive payments quickly and securely through our protected payment system.",
    color: "from-gigstr-teal to-gigstr-purple"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-gray-50 relative overflow-x-clip">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
      </div>
      {/* Animated SVG for connection line */}
      <svg className="hidden md:block absolute left-0 right-0 top-1/2 z-0" height="8" width="100%" style={{ pointerEvents: 'none' }}>
        <rect x="0" y="3" width="100%" height="2" rx="1" fill="#a259d9" fillOpacity="0.12" className="animate-glow-line" />
      </svg>
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 heading-gradient">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in just a few simple steps and begin earning on your own terms
          </p>
        </div>
        <div className="relative">
          {/* Connection line (animated) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gigstr-purple/20 via-gigstr-indigo/20 to-gigstr-blue/20 -translate-y-1/2 z-0 animate-glow-line"></div>
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-glass p-6 rounded-xl shadow-glass border border-gigstr-purple/10 backdrop-blur-sm group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15 + 0.1}s` }}
              >
                <div className={`h-20 w-20 rounded-full bg-white shadow-md flex items-center justify-center mb-6 bg-gradient-to-br ${step.color} text-white transform transition-transform duration-300 group-hover:scale-110 animate-bounce-once`}
                  style={{ animationDelay: `${index * 0.15 + 0.2}s` }}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-gigstr-purple transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
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
        .animate-glow-line {
          animation: glowLine 2.5s ease-in-out infinite alternate;
        }
        @keyframes glowLine {
          0% { filter: brightness(0.9) drop-shadow(0 0 8px #a259d9); }
          100% { filter: brightness(1.2) drop-shadow(0 0 16px #a259d9); }
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
      `}</style>
    </section>
  );
};

export default HowItWorks;
