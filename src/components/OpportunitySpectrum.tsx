import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  HandHeart,
  Wrench,
  GraduationCap,
  Baby,
  Stethoscope,
  Zap,
  Laptop,
  Paintbrush2,
  Hammer,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const roleTiles = [
  { label: "Domestic Workers", icon: Home, accent: "from-emerald-400/50 to-green-600/30" },
  { label: "Plumbers", icon: Wrench, accent: "from-sky-400/50 to-blue-600/30" },
  { label: "Electricians", icon: Zap, accent: "from-amber-400/60 to-orange-500/30" },
  { label: "Tutors", icon: GraduationCap, accent: "from-indigo-400/60 to-purple-500/30" },
  { label: "Au Pairs", icon: Baby, accent: "from-pink-400/50 to-rose-500/30" },
  { label: "Care Givers", icon: HandHeart, accent: "from-red-400/50 to-orange-400/30" },
  { label: "Builders & Handymen", icon: Hammer, accent: "from-yellow-400/50 to-amber-500/30" },
  { label: "Designers", icon: Paintbrush2, accent: "from-fuchsia-400/50 to-purple-500/30" },
  { label: "Developers", icon: Laptop, accent: "from-cyan-400/50 to-blue-500/30" },
  { label: "Healthcare", icon: Stethoscope, accent: "from-teal-400/50 to-emerald-500/30" },
];

const OpportunitySpectrum = () => {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-purple-500/5" />
      <div className="container-custom relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles size={16} /> Built for the overlooked
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
            Every craft. Every hustle. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Everywhere.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Domestic workers, plumbers, tutors, au pairs, caregivers, electricians, builders, designers, developers—every career that can be hired lives here. Add your own skills and we’ll surface you in gigs and alerts the moment someone needs what you do.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Bridges, not barriers</h3>
              <p>We elevate work that is often ignored—cleaning, care, trades, tutoring, creative, and tech—so pros get steady gigs and respect.</p>
            </div>
            <div className="p-4 rounded-2xl bg-card/60 border border-border/60 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Local first, always</h3>
              <p>Verified IDs, safe payments in Rands, and demand across SA towns and cities—so earning feels fair and fast.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="glow" className="h-12 rounded-xl">Post a job for free</Button>
            <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/10">Join as a pro</Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {roleTiles.map((role, idx) => (
            <div
              key={role.label}
              className="relative p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.accent} opacity-20`} />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/30 flex items-center justify-center text-white border border-white/10">
                  <role.icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{role.label}</p>
                  <p className="text-xs text-muted-foreground">Accepted. Visible. In demand.</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OpportunitySpectrum;
