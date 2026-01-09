import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Code, Camera, GraduationCap, Home, Truck, Palette, PartyPopper } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    icon: Wrench,
    title: 'Home Services',
    description: 'Plumbers, Electricians, Handymen',
    count: '1.2k+ Pros',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Code,
    title: 'Tech & Dev',
    description: 'Web Devs, App Builders, IT Support',
    count: '800+ Pros',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Palette,
    title: 'Design & Creative',
    description: 'Logo Design, UI/UX, Illustrators',
    count: '2k+ Pros',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    icon: Home,
    title: 'Domestic Help',
    description: 'Cleaning, Laundry, Gardening',
    count: '3.5k+ Pros',
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    icon: PartyPopper,
    title: 'Events & Weddings',
    description: 'DJs, Caterers, Photographers',
    count: '600+ Pros',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  },
  {
    icon: Truck,
    title: 'Movers & Transport',
    description: 'Furniture Moving, Deliveries',
    count: '400+ Pros',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    icon: GraduationCap,
    title: 'Tutoring',
    description: 'Math, Science, Languages',
    count: '900+ Pros',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  }
];

const PopularServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-primary/5">
              Explore Categories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-heading">
              Find exactly what you <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">need done.</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/gigs')}
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all categories <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
             <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
             >
               <Card 
                onClick={() => navigate('/gigs')}
                className="h-full border-border/40 hover:border-primary/50 transition-colors cursor-pointer group hover:bg-card/50"
               >
                 <CardContent className="p-6">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                     <cat.icon size={24} />
                   </div>
                   <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{cat.title}</h3>
                   <p className="text-muted-foreground text-sm mb-3">{cat.description}</p>
                   <div className="text-xs font-medium text-muted-foreground/80 bg-muted/50 w-fit px-2 py-1 rounded-full">
                     {cat.count}
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
          ))}
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.8 }}
             className="md:hidden"
             onClick={() => navigate('/gigs')}
          >
             <Card className="h-full border-dashed border-border flex items-center justify-center min-h-[180px] hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-2 text-primary font-medium">
                   View all categories <ArrowRight size={18} />
                </div>
             </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
