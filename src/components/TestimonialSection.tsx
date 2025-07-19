
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Graphic Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Gigstr completely transformed my freelance career. I've been able to find consistent work and build long-term relationships with amazing clients.",
    rating: 5,
    featured: true
  },
  {
    name: "Michael Chen",
    role: "Web Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "The payment protection system gives me peace of mind, and I love how easy it is to showcase my portfolio to potential clients.",
    rating: 5
  },
  {
    name: "Emma Rodriguez",
    role: "Content Writer",
    image: "https://randomuser.me/api/portraits/women/63.jpg",
    quote: "As someone who juggles multiple clients, Gigstr's project management tools have been a lifesaver for staying organized and productive.",
    rating: 4
  },
  {
    name: "David Smith",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    quote: "Since joining Gigstr, I've increased my client base by 70% and doubled my monthly income. The platform's visibility is incredible!",
    rating: 5
  },
  {
    name: "Sophia Lee",
    role: "Marketing Specialist",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote: "The client matching algorithm is spot on! I'm getting connected with exactly the type of businesses I want to work with.",
    rating: 5
  }
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-white relative overflow-x-clip">
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-no-repeat bg-fixed bg-center"></div>
      </div>
      {/* Floating SVG for extra flair */}
      <svg className="absolute -bottom-16 left-1/4 animate-float-slow z-0" width="180" height="80" viewBox="0 0 180 80" fill="none">
        <ellipse cx="90" cy="40" rx="90" ry="40" fill="#a259d9" fillOpacity="0.07" />
      </svg>
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 heading-gradient">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied freelancers who have boosted their careers with Gigstr
          </p>
        </div>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-1">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-1 basis-full md:basis-1/2 lg:basis-1/3 animate-fade-in-up" style={{ animationDelay: `${index * 0.12 + 0.1}s` }}>
                <div className={`bg-glass p-8 rounded-xl shadow-glass border border-gigstr-purple/10 relative h-full card-hover backdrop-blur-sm group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${testimonial.featured ? 'ring-2 ring-gigstr-purple/60' : ''}`}>
                  <div className="absolute top-6 right-8 text-gray-200">
                    <Quote size={48} />
                  </div>
                  {testimonial.featured && (
                    <span className="absolute top-4 left-4 bg-gigstr-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce-once z-10">Featured</span>
                  )}
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gigstr-purple/30 group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div>
                      <h3 className="font-semibold group-hover:text-gigstr-purple transition-colors duration-300">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={18}
                        className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic relative z-10">{testimonial.quote}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
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

export default TestimonialSection;
