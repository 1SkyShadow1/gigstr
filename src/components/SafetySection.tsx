import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, UserCheck, Scale, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SafetySection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black/40 border-y border-white/5">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

        <div className="container px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-sm font-medium">
                        <ShieldCheck size={16} /> Trust & Safety First
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold font-heading leading-tight">
                        Your peace of mind is <br />
                        <span className="text-white">our top priority.</span>
                    </h2>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        We've built Gigstr specifically for the South African market, addressing local concerns about safety, reliability, and payment security head-on.
                    </p>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">ID Verification</h3>
                                <p className="text-muted-foreground">Every freelancer's identity is verified against South African Home Affairs data specifically to ensure you know exactly who you're hiring.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Secure Escrow Payments</h3>
                                <p className="text-muted-foreground">Funds are held safely in escrow and only released to the freelancer when you are 100% satisfied with the completed work.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Scale size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Fair Dispute Resolution</h3>
                                <p className="text-muted-foreground">If things don't go as planned, our local support team steps in to mediate and ensure a fair outcome for both parties.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Visual representation of safety */}
                    <div className="relative z-10 bg-card border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Transaction Status</div>
                                <div className="text-green-500 font-bold flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Payment Secured
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                                <div className="text-2xl font-bold">R 4,500.00</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-sm">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">1</div>
                                <div className="flex-1">Client funds deposit verified</div>
                                <CheckCircle2 size={16} className="text-green-500" />
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-sm">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">2</div>
                                <div className="flex-1">Work submitted by freelancer</div>
                                <CheckCircle2 size={16} className="text-green-500" />
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/20 border border-primary/50 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white animate-pulse">3</div>
                                <div className="flex-1 font-medium text-white">Waiting for your approval</div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-xs text-muted-foreground mb-4">Protected by Gigstr SafePay™ Guarantee</p>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-12 rounded-xl">
                                Approve & Release Funds
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default SafetySection;
