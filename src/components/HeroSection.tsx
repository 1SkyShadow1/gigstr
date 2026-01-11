import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play, Star, ShieldCheck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  const [liveUsers, setLiveUsers] = useState(1243);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  // Animate live user counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3 - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container-custom relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-none bg-primary/10 border border-primary/20 text-sm font-medium text-primary shadow-glow mb-2">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 {liveUsers.toLocaleString()} locals active now
              </div>

                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-tight tracking-tight">
                    Where hidden talent <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">gets seen & booked</span> <br />
                    <span className="text-3xl sm:text-4xl md:text-6xl text-muted-foreground">—every skill, every trade.</span>
                  </h1>
              
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 md:px-0">
                    From domestic workers and plumbers to tutors, au pairs, caregivers, electricians, builders, designers, and coders—Gigstr makes sure overlooked careers get discovered, trusted, and paid fast.
                  </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start px-4 md:px-0">
                  <Button size="xl" variant="glow" onClick={() => navigate('/create-gig')} className="w-full sm:w-auto text-lg h-14 rounded-2xl bg-primary hover:bg-primary/90">
                    Find Talent <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="xl" variant="outline" onClick={() => navigate('/gigs')} className="w-full sm:w-auto text-lg h-14 rounded-2xl border-white/10 hover:bg-white/5">
                    Find Work
                  </Button>
              </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4 text-sm font-medium text-muted-foreground px-4 md:px-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-green-500" size={18} /> ID Verified
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} /> 4.8/5 Avg Rating
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-foreground">50k+</span> Jobs Done
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-foreground">All roles</span> Welcome
                  </div>
                </div>

              {/* Mobile Visual - Single Card showcasing a profile */}
              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, duration: 0.6 }}
                 className="w-full mt-12 lg:hidden flex justify-center pb-8"
              >
                  <div className="relative w-full max-w-sm glass-card p-4 rounded-3xl z-20 border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl skew-y-3">
                     <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/50 to-purple-600/50 blur opacity-30"></div>
                     <div className="relative h-48 mb-4 rounded-2xl overflow-hidden bg-muted">
                        <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop" alt="Local Developer" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" /> 5.0
                        </div>
                     </div>
                     <div className="relative">
                         <h4 className="font-bold text-lg text-white">Thabo M.</h4>
                         <p className="text-sm text-muted-foreground mb-2">Senior React Developer</p>
                         <div className="flex justify-between items-center">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Cape Town</span>
                            <span className="font-bold text-white">R 650/hr</span>
                         </div>
                     </div>
                 </div>
              </motion.div>
          </motion.div>

          {/* Right Visuals - Local Context Collage */}
          <div className="relative h-[600px] hidden lg:block perspective-1000">
             
             {/* Card 1: The Tech Pro */}
             <motion.div 
               style={{ y: y1 }}
               className="absolute top-10 right-10 w-72 glass-card p-4 rounded-3xl z-20 border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl"
             >
                 <div className="relative h-48 mb-4 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop" alt="Local Developer" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" /> 5.0
                    </div>
                 </div>
                 <div>
                     <h4 className="font-bold text-lg text-white">Thabo M.</h4>
                     <p className="text-sm text-muted-foreground mb-2">Senior React Developer</p>
                     <div className="flex justify-between items-center">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Cape Town</span>
                        <span className="font-bold text-white">R 650/hr</span>
                     </div>
                 </div>
             </motion.div>

             {/* Card 2: The Creative - Offset */}
             <motion.div 
               className="absolute bottom-20 left-10 w-72 glass-card p-4 rounded-3xl z-10 border border-white/10 bg-black/60 backdrop-blur-xl"
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3, duration: 0.8 }}
             >
                 <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                        <img src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1000&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div>
                         <div className="font-bold text-white text-sm">Lerato K.</div>
                         <div className="text-xs text-muted-foreground">Graphic Designer</div>
                     </div>
                 </div>
                 <div className="space-y-2 mb-3">
                    <div className="bg-white/5 p-2 rounded-lg flex items-center gap-3">
                        <div className="p-1.5 bg-green-500/20 rounded-md text-green-400"><CheckCircle size={12} /></div>
                        <div className="text-xs text-gray-300">Logo Design for Startup</div>
                        <div className="ml-auto font-bold text-white text-xs">R 3.5k</div>
                    </div>
                 </div>
                 <Button size="sm" className="w-full rounded-xl bg-white/10 hover:bg-white/20 h-9 text-xs">View Profile</Button>
             </motion.div>
             
             {/* Floating Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse" />
          </div>
      </div>
    </section>
  );
};

export default HeroSection;
