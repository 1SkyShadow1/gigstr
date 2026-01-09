import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Clock, Award, Briefcase } from 'lucide-react';

const features = [
	{
		icon: Briefcase,
		title: 'Find Work Easily',
		description:
			'Smart algorithms match you with gigs that fit your skills perfectly.',
		color: 'text-purple-400 bg-purple-400/10',
	},
	{
		icon: Zap,
		title: 'Get Paid Fast',
		description: 'Receive payment within 24 hours. No more chasing invoices.',
		color: 'text-yellow-400 bg-yellow-400/10',
	},
	{
		icon: Shield,
		title: 'Secure Transactions',
		description: 'Bank-grade encryption for all your payments and data.',
		color: 'text-green-400 bg-green-400/10',
	},
	{
		icon: Clock,
		title: 'Flexible Schedule',
		description: 'Work on your terms. Pick projects that fit your availability.',
		color: 'text-blue-400 bg-blue-400/10',
	},
	{
		icon: Award,
		title: 'Loyalty Rewards',
		description: 'Earn points for completed jobs and unlock premium perks.',
		color: 'text-pink-400 bg-pink-400/10',
	},
	{
		icon: Sparkles,
		title: 'Powerful Tools',
		description: 'Built-in invoicing, contracts, and project management.',
		color: 'text-cyan-400 bg-cyan-400/10',
	},
];

const FeatureSection = () => {
	return (
		<section className="py-24 relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
			<div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0" />

			<div className="container-custom relative z-10">
				<div className="text-center mb-16 space-y-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-muted-foreground mb-4"
					>
						Why Choose Gigstr
					</motion.div>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-4xl md:text-5xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
					>
						Everything you need to <br /> succeed.
					</motion.h2>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -5 }}
							className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

							<div
								className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feature.color}`}
							>
								<feature.icon size={24} />
							</div>

							<h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
								{feature.title}
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeatureSection;
