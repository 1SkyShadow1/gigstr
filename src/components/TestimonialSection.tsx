import React from 'react';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Thabo Moloi",
    role: "Freelance Developer, JHB",
    quote: "Gigstr connects me with real businesses in Sandton without the agency fees. I've doubled my client base in 3 months.",
    rating: 5,
  },
  {
    name: "Sarah van der Merwe",
    role: "Copywriter, Cape Town",
    quote: "Finally, a platform that pays on time! The escrow system gives me total peace of mind for every project.",
    rating: 5
  },
  {
    name: "Priya Naidoo",
    role: "Graphic Designer, Durban",
    quote: "The interface is world-class. It feels built for professionals who take their hustle seriously.",
    rating: 5
  },
  {
    name: "Mike Williams",
    role: "Handyman, Pretoria",
    quote: "I find consistent work fixing home appliances. The ID verification helps clients trust me immediately.",
    rating: 4
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-heading mb-4"
          >
            Locals love Gigstr
          </motion.h2>
          <p className="text-muted-foreground text-lg">Join thousands of South Africans getting work done every day.</p>
        </div>
        
        <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full p-8 rounded-3xl bg-card border border-border/50 relative hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 block"
                >
                  <Quote className="absolute top-6 right-6 text-muted-foreground/10 w-10 h-10" />
                  
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={14}
                        className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-700"} 
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">"{testimonial.quote}"</p>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="bg-background border-border hover:bg-muted" />
            <CarouselNext className="bg-background border-border hover:bg-muted" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
