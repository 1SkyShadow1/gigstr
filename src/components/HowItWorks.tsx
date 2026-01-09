import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Search, CheckCircle, CreditCard, FileText, Briefcase, Smile, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const clientSteps = [
	{
		icon: Search,
		title: 'Post a Job',
		description: 'Describe what you need done, from plumbing to web design. It’s free to post.',
	},
	{
		icon: FileText,
		title: 'Review Quotes',
		description: 'Get offers from verified locals. Compare profiles, ratings, and prices.',
	},
	{
		icon: CreditCard,
		title: 'Hire Securely',
		description: 'Choose your pro and deposit funds into our secure escrow system.',
	},
	{
		icon: Smile,
		title: 'Task Complete',
		description: 'Release funds only when you’re happy with the work. Done!',
	},
];

const freelancerSteps = [
    {
        icon: UserCircle,
        title: 'Create Profile',
        description: 'Sign up, verify your ID, and showcase your best skills and portfolio.',
    },
    {
        icon: Briefcase,
        title: 'Browse Gigs',
        description: 'Find jobs in your area or online that match your expertise.',
    },
    {
        icon: FileText,
        title: 'Send Quotes',
        description: 'Pitch your price. No hidden fees for bidding on jobs.',
    },
    {
        icon: Banknote,
        title: 'Get Paid Fast',
        description: 'Complete the job and get paid directly to your bank account within 24h.',
    },
];

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

	return (
		<section className="py-24 relative overflow-hidden bg-background">
			<div className="container px-4 md:px-6 relative z-10">
				<div className="text-center mb-12">
                    <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-2 block">Simple Process</span>
					<motion.h2
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="text-4xl md:text-5xl font-bold font-heading mb-6"
					>
						How Gigstr works for you
					</motion.h2>
					
                    {/* Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-muted p-1 rounded-full inline-flex relative">
                             {/* Animated Background for Tab */}
                             <motion.div 
                                className="absolute top-1 bottom-1 bg-background rounded-full shadow-sm z-0"
                                initial={false}
                                animate={{ 
                                    left: activeTab === 'client' ? '4px' : '50%', 
                                    width: 'calc(50% - 4px)' 
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             />
                            <button 
                                onClick={() => setActiveTab('client')}
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === 'client' ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                I need work done
                            </button>
                            <button 
                                onClick={() => setActiveTab('freelancer')}
                                className={`relative z-10 px-8 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === 'freelancer' ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                                I want to earn
                            </button>
                        </div>
                    </div>
				</div>

				<div className="relative">
					{/* Connecting Line (Desktop) */}
					<div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

					<div className="grid md:grid-cols-4 gap-8">
						{(activeTab === 'client' ? clientSteps : freelancerSteps).map((step, index) => (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="relative z-10 flex flex-col items-center text-center group"
							>
								<div className="w-[120px] h-[120px] rounded-full bg-card border border-border flex items-center justify-center mb-6 shadow-sm relative group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/50">
									<div className={`absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${activeTab === 'client' ? 'from-primary to-purple-500' : 'from-green-500 to-emerald-500'}`} />
									<step.icon
										size={40}
										className={`${activeTab === 'client' ? 'text-primary' : 'text-green-500'} relative z-10 transition-colors duration-300`}
									/>
									<div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-background ${activeTab === 'client' ? 'bg-primary' : 'bg-green-500'}`}>
										{index + 1}
									</div>
								</div>
								<h3 className="text-xl font-bold mb-3">{step.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed px-2">
									{step.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
                
                <div className="text-center mt-16">
                     <Button size="lg" className={`rounded-xl px-8 h-12 shadow-glow ${activeTab === 'client' ? 'bg-primary hover:bg-primary/90' : 'bg-green-600 hover:bg-green-700'}`}>
                         {activeTab === 'client' ? 'Post a Job for Free' : 'Join as a Pro'}
                     </Button>
                </div>
			</div>
		</section>
	);
};

export default HowItWorks;
