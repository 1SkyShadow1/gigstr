
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Graphic Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Gigstr completely transformed my freelance career. I've been able to find consistent work and build long-term relationships with amazing clients.",
    rating: 5
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
  }
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="heading-gradient">What Our Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied freelancers who have boosted their careers with Gigstr
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 relative card-hover"
            >
              <div className="absolute top-6 right-8 text-gray-200">
                <Quote size={48} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="h-16 w-16 rounded-full object-cover" 
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
