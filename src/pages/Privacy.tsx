import React from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Server, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
    const sections = [
        {
            icon: Eye,
            title: "Information Collection",
            content: "We collect information you provide directly to us when you create an account, verify your identity (FICA/RICA compliance), or communicate with us. This includes contact details, banking information for payouts, and profile data."
        },
        {
            icon: Lock,
            title: "Data Usage",
            content: "Your data is used to facilitate services, process payments, and ensure platform safety. We do not sell your personal data. We use it to match you with relevant gigs and protect the integrity of our marketplace."
        },
        {
            icon: Shield,
            title: "POPIA Compliance",
            content: "We are fully compliant with the Protection of Personal Information Act (POPIA) of South Africa. Your right to privacy is paramount, and we have implemented strict measures to prevent unauthorized access to your personal information."
        },
        {
            icon: Server,
            title: "Data Security",
            content: "We employ banking-grade encryption (AES-256) for all sensitive data. Your payment details are tokenized and never stored directly on our servers."
        }
    ];

  return (
    <AnimatedPage>
        <div className="bg-background min-h-screen flex flex-col">
        <Header sidebarOpen={false} setSidebarOpen={() => {}} />
        
        <main className="flex-grow">
            <section className="relative py-20 bg-primary/5">
                <div className="container px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                         className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
                    >
                        <Shield className="w-8 h-8" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold font-heading mb-4"
                    >
                        Privacy Policy
                    </motion.h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Your trust is the foundation of our community. Here is how we protect it.
                        <br/>
                        <span className="text-sm opacity-70">Last updated: October 2023</span>
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container px-4 md:px-6 max-w-4xl">
                    <div className="grid gap-8">
                        {sections.map((section, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-6 p-6 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
                                        <section.icon size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border text-center">
                        <h3 className="font-semibold mb-2">Have specific privacy concerns?</h3>
                        <p className="text-muted-foreground mb-4">Our Data Protection Officer is available to address your queries.</p>
                        <a href="mailto:privacy@gigstr.co.za" className="text-primary hover:underline font-medium">privacy@gigstr.co.za</a>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
        </div>
    </AnimatedPage>
  );
};

export default Privacy;
