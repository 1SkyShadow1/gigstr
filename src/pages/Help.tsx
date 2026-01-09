import React from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, HelpCircle, FileText, Wallet, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Help = () => {
    const categories = [
        { icon: HelpCircle, label: "Getting Started", color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: FileText, label: "Account & Profile", color: "text-purple-500", bg: "bg-purple-500/10" },
        { icon: Wallet, label: "Payments", color: "text-green-500", bg: "bg-green-500/10" },
        { icon: Shield, label: "Trust & Safety", color: "text-orange-500", bg: "bg-orange-500/10" }
    ];

    const faqs = [
        {
            q: "How do I start working on Gigstr?",
            a: "Sign up as a freelancer, complete your profile verification (ID and proof of residence required for SA compliance), and browse available gigs in your category. Once you find a match, submit a proposal!"
        },
        {
            q: "Is Gigstr free to use?",
            a: "Joining Gigstr is free. We charge a small service fee on completed jobs to cover platform maintenance, secure payments, and support services."
        },
        {
            q: "How do payments work?",
            a: "We use a secure escrow system. Clients fund the project upfront, and funds are released to you once the work is completed and approved. Payouts are made directly to your SA bank account."
        },
        {
            q: "What if there is a dispute?",
            a: "Our dispute resolution team is here to help. If you and your client cannot reach an agreement, you can raise a dispute, and we will mediate based on the project terms and evidence provided."
        },
        {
             q: "Is my personal information safe?",
             a: "Absolutely. We strictly adhere to POPIA regulations and use bank-grade encryption to protect your personal and financial data."
        }
    ];

  return (
    <AnimatedPage>
        <div className="bg-background min-h-screen flex flex-col">
        <Header sidebarOpen={false} setSidebarOpen={() => {}} />
        
        <main className="flex-grow">
             {/* Hero Section */}
             <section className="relative py-20 overflow-hidden bg-primary/5">
                <div className="container px-4 md:px-6 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold font-heading mb-6"
                    >
                        How can we help you?
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto relative"
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search for articles, guides, or questions..." 
                            className="pl-10 h-12 bg-background border-primary/20 focus-visible:ring-primary text-lg"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-16 bg-card">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all cursor-pointer text-center group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                    <cat.icon size={24} />
                                </div>
                                <h3 className="font-semibold">{cat.label}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-16 bg-background">
                <div className="container px-4 md:px-6 max-w-3xl">
                    <h2 className="text-2xl font-bold font-heading mb-8 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-medium text-lg">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 border-t border-border bg-primary/5">
                <div className="container px-4 md:px-6 text-center">
                    <h2 className="text-2xl font-bold font-heading mb-8">Still need help?</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <div className="bg-background p-6 rounded-2xl border border-border flex items-center gap-4 text-left min-w-[300px]">
                            <div className="bg-blue-500/10 p-3 rounded-full text-blue-500">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email Support</h3>
                                <p className="text-sm text-muted-foreground">support@gigstr.co.za</p>
                            </div>
                        </div>
                        <div className="bg-background p-6 rounded-2xl border border-border flex items-center gap-4 text-left min-w-[300px]">
                            <div className="bg-green-500/10 p-3 rounded-full text-green-500">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Call Us</h3>
                                <p className="text-sm text-muted-foreground">0800 GIGSTR (0800 123 456)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
        </div>
    </AnimatedPage>
  );
};

export default Help;
