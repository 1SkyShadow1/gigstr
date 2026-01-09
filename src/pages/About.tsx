
import React from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Users, Target, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <AnimatedPage>
        <div className="bg-background min-h-screen">
        <Header sidebarOpen={false} setSidebarOpen={() => {}} />
        
        <main>
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 z-0" />
                <div className="container px-4 md:px-6 relative z-10 text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                    >
                        Our Story
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold font-heading mb-6"
                    >
                        Empowering South Africa's <br/>
                        <span className="text-primary">Gig Economy</span>
                    </motion.h1>
                    <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
                        Gigstr is more than a marketplace. We are a movement dedicated to rewriting the future of work in Africa, connecting hidden talent with real opportunity.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Grid */}
            <section className="py-20 bg-card">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                To democratize access to work by building a frictionless, safe, and transparent platform where skills matter more than connections.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-colors">
                             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                A future where every South African professional has the tools, protection, and visibility to build a thriving independent career.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-background border border-border hover:border-primary/50 transition-colors">
                             <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Our Community</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We are building a network of trust. From verified identities to secure payments, we put the safety of our community first.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Stats Section */}
             <section className="py-20 border-y border-border bg-background">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">R20M+</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Paid to Freelancers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">98%</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Satisfaction Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Local Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                 <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to join the revolution?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Whether you're looking to hire top talent or find your next big gig, Gigstr is your home.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="rounded-xl h-12 px-8 shadow-glow">
                            Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                 </div>
            </section>
        </main>
        
        <Footer />
        </div>
    </AnimatedPage>
  );
};

export default About;
