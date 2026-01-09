import React from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
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
                        <Scale className="w-8 h-8" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold font-heading mb-4"
                    >
                        Terms of Service
                    </motion.h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The rules of the road for the Gigstr community.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="container px-4 md:px-6 max-w-4xl prose prose-gray dark:prose-invert lg:prose-lg mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                        <h3 className="flex items-center gap-2 text-xl font-bold mt-0">
                            <FileText className="text-primary" /> 
                            Agreement Overview
                        </h3>
                        <p className="mb-0">
                            By accessing or using the Gigstr platform ("Service"), you agree to be bound by these Terms. 
                            If you disagree with any part of the terms, strict adherence to South African Consumer Protection Act (CPA) applies where relevant.
                        </p>
                    </div>

                    <h3>1. Account Registration</h3>
                    <p>
                        You must be 18 years or older to use this Service. You agree to provide accurate, current, and complete information 
                        during the registration process and to update such information to keep it accurate, current, and complete.
                    </p>

                    <h3>2. User Conduct</h3>
                    <p>
                        Users agreed to conduct themselves professionally. Harassment, hate speech, or fraudulent activity will result in immediate 
                        account suspension. We maintain a zero-tolerance policy for discrimination based on race, gender, religion, or nationality.
                    </p>

                    <h3>3. Payment Terms</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>All financial transactions are processed in South African Rand (ZAR).</li>
                        <li>Payments are held in escrow until job completion is verified.</li>
                        <li>A service fee is deducted from the final payout amount as per our Fee Schedule.</li>
                    </ul>

                    <h3>4. Dispute Resolution</h3>
                    <p>
                        In the event of a dispute between a Client and a Freelancer, Gigstr will provide mediation services. 
                        Our decision in such matters is final, binding, and based on the evidence provided by both parties.
                    </p>

                    <h3>5. Liability</h3>
                    <p>
                        Gigstr acts as a venue for connecting users. We are not a party to any contract between Client and Freelancer. 
                        Users strictly agree to indemnify Gigstr against any claims arising from their use of the platform.
                    </p>

                    <div className="mt-12 pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground text-center">
                            Questions about the Terms of Service should be sent to us at legal@gigstr.co.za
                        </p>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
        </div>
    </AnimatedPage>
  );
};

export default Terms;
