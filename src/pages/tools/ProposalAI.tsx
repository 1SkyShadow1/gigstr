import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Copy, Check, Wand2, RefreshCw, Download, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const PRESETS = [
    { id: 'web-app', label: 'Web App MVP', data: { jobDescription: 'Build a React/Node SaaS MVP with auth and payments.', outcomes: 'Functional MVP ready for investors.', timeline: '4-6 weeks', budget: '45,000' } },
    { id: 'marketing-site', label: 'Marketing Site', data: { jobDescription: 'Design and develop a high-converting landing page for a B2B startup.', outcomes: '+15% conversion rate, fast load times.', timeline: '2 weeks', budget: '15,000' } },
    { id: 'seo-audit', label: 'SEO Audit', data: { jobDescription: 'Comprehensive technical SEO audit and content strategy.', outcomes: 'Actionable roadmap to double organic traffic.', timeline: '1 week', budget: '8,500' } },
];


const ProposalAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [jobDescription, setJobDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [tone, setTone] = useState('professional');
    const [outcomes, setOutcomes] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [length, setLength] = useState<'concise' | 'detailed'>('concise');
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePreset = (preset: typeof PRESETS[0]) => {
      setJobDescription(preset.data.jobDescription);
      setOutcomes(preset.data.outcomes);
      setTimeline(preset.data.timeline);
      setBudget(preset.data.budget);
      toast({ title: "Preset loaded", description: `${preset.label} template applied.` });
  };

  const handleDownload = () => {
        const blob = new Blob([generatedProposal], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposal-${clientName || 'draft'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Proposal saved as .txt file" });
  };

  // Simulated AI Generation
  const handleGenerate = () => {
    if (!jobDescription) {
        toast({
            title: "Input Required",
            description: "Please paste the job description first.",
            variant: "destructive"
        });
        return;
    }

    setIsGenerating(true);
    setGeneratedProposal('');

        // Simulate thinking time
        setTimeout(() => {
                const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

                const toneOpeners: Record<string, string[]> = {
                    professional: [
                        `I reviewed your ${clientName || 'project'} requirements and mapped a clear delivery path.`,
                        `Thanks for sharing the scope. I’ve delivered similar work and can execute with minimal friction.`
                    ],
                    persuasive: [
                        `This is exactly the kind of problem I solve—let’s make this an easy win for your team.`,
                        `If you want fast impact without hand-holding, I can drive this from brief to launch.`
                    ],
                    casual: [
                        `Appreciate the details—this looks fun and right up my alley.`,
                        `I can jump in and get you quick wins while keeping things simple.`
                    ],
                    urgent: [
                        `Speed matters here. I can start immediately with a slim, high-impact plan.`,
                        `Let’s move fast: I’ll ship a first milestone in days, not weeks.`
                    ],
                };

                const deliverables = [
                    'Discovery & success criteria (fast alignment)',
                    'Design/architecture + clear milestones',
                    'Implementation with weekly demos',
                    'QA + acceptance sign-off',
                    'Launch + 14 days of post-launch fixes'
                ];

                const risks = [
                    'Scope creep without acceptance criteria',
                    'Slow feedback cycles delaying delivery',
                    'Unclear success metrics for go-live'
                ];

                const outcomeLine = outcomes ? `Outcomes to hit: ${outcomes}` : 'We’ll agree measurable outcomes (traffic, conversion, uptime, or SLAs).';
                const budgetLine = budget ? `Estimated investment: R ${budget}` : 'Investment: we can price per milestone or fixed-fee once scope is locked.';
                const timelineLine = timeline ? `Target timeline: ${timeline}` : 'I’ll propose a 2-3 phase plan with clear checkpoints.';
                const toneOpening = random(toneOpeners[tone] || toneOpeners.professional);
                const lengthNote = length === 'detailed' ? 'Detail level: expanded (includes risks and guardrails).' : 'Detail level: concise summary.';

                const body = [
                    toneOpening,
                    outcomeLine,
                    timelineLine,
                    budgetLine,
                    '',
                    'Plan & deliverables:',
                    ...deliverables.map(d => `• ${d}`),
                    '',
                    'Risk & guardrails:',
                    ...risks.map(r => `• ${r}`),
                    '• Change-orders only if new scope is added (keeps budget safe).',
                    '',
                    'Why me:',
                    `• Relevant experience: ${jobDescription.slice(0, 80) || 'I’ve shipped similar projects end-to-end.'}`,
                    '• Communication: async updates + weekly demo cadence.',
                    '• Tooling: Vercel/Supabase/Vite stack friendly.',
                    '',
                    'Next steps:',
                    '1) 15-min alignment call.',
                    '2) Lock scope + milestones.',
                    '3) Kickoff within 48 hours.',
                    '',
                    portfolio ? `Work samples: ${portfolio}` : 'Work samples available on request.',
                    lengthNote,
                ].join('\n');

                const result = `Dear ${clientName || 'Hiring Manager'},\n\n${body}\n\nLooking forward to collaborating.\nBest,\n${user?.email?.split('@')[0] || 'Freelancer'}`;

                setGeneratedProposal(result);
                setIsGenerating(false);
        }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatedPage>
        <div className="container px-4 pt-6 pb-24 sm:pb-12 max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium mb-4 border border-purple-500/20">
                    <Sparkles size={16} /> Beta Feature
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3">
                    Proposal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Copilot</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto md:mx-0">
                    Stop staring at a blank screen. Let our AI craft the perfect proposal to win your next gig in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 h-full">
                {/* Input Section */}
                <Card className="border-border/60 shadow-sm h-full flex flex-col rounded-2xl">
                    <CardContent className="p-4 sm:p-6 flex flex-col h-full gap-5 sm:gap-6">
                        <div className="flex gap-2 items-center overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1 mr-1">
                                <Library size={12} /> Templates:
                            </span>
                            {PRESETS.map(p => (
                                <button 
                                    key={p.id}
                                    onClick={() => handlePreset(p)}
                                    className="px-3 py-1 bg-secondary/60 hover:bg-secondary text-xs rounded-full transition-colors border border-border/50 whitespace-nowrap"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <Label className="mb-2 block">Client Name (Optional)</Label>
                            <Input 
                                placeholder="e.g. John Smith or TechCorp" 
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <Label className="mb-2 block">Outcomes to emphasize</Label>
                                <Input 
                                    placeholder="e.g. +20% conversion, faster onboarding" 
                                    value={outcomes}
                                    onChange={(e) => setOutcomes(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Budget (optional)</Label>
                                <Input 
                                    placeholder="e.g. 35,000" 
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Timeline target</Label>
                                <Input 
                                    placeholder="e.g. 4-6 weeks" 
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <Label className="mb-2 block">Job Description / Requirements</Label>
                            <Textarea 
                                placeholder="Paste the client's job post here..." 
                                className="h-full min-h-[200px] resize-none font-mono text-sm leading-relaxed"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                             <div>
                                <Label className="mb-2 block">Tone</Label>
                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="persuasive">Persuasive</SelectItem>
                                        <SelectItem value="casual">Friendly / Casual</SelectItem>
                                        <SelectItem value="urgent">Direct / Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                             <div>
                                <Label className="mb-2 block">Length</Label>
                                <Select value={length} onValueChange={(val) => setLength(val as 'concise' | 'detailed')}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="concise">Concise</SelectItem>
                                        <SelectItem value="detailed">Detailed</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                             <div className="flex items-end sm:col-span-1">
                                <Button 
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-glow"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>Generating...</>
                                    ) : (
                                        <><Wand2 className="mr-2 h-4 w-4" /> Generate Magic</>
                                    )}
                                </Button>
                             </div>
                        </div>

                        <div>
                            <Label className="mb-2 block">Portfolio / proof (optional)</Label>
                            <Input 
                                placeholder="Link to case study, repo, or demo"
                                value={portfolio}
                                onChange={(e) => setPortfolio(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="border-border/50 shadow-sm bg-muted/30 relative overflow-hidden h-full min-h-[420px] rounded-2xl">
                    <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
                            <Label>Generated Proposal</Label>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={!generatedProposal}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!generatedProposal}>
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!generatedProposal}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 rounded-xl bg-background border border-border p-4 sm:p-6 shadow-inner overflow-y-auto relative">
                           {isGenerating && (
                               <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                                   <div className="flex flex-col items-center">
                                       <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mb-4" />
                                       <p className="text-sm text-purple-500 font-medium animate-pulse">Analyzing requirements...</p>
                                   </div>
                               </div>
                           )}
                           
                           {!generatedProposal && !isGenerating ? (
                               <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                   <Sparkles className="h-12 w-12 mb-4" />
                                   <p>Your AI-crafted proposal will appear here</p>
                               </div>
                           ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans"
                            >
                                {generatedProposal}
                            </motion.div>
                           )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile action bar for quick access */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-xl md:hidden z-40">
                <div className="flex gap-2 bg-background/90 backdrop-blur-xl border border-border/60 shadow-2xl rounded-2xl px-4 py-3">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                    <Button variant="secondary" className="flex-1" onClick={handleCopy} disabled={!generatedProposal}>
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
            </div>
        </div>
    </AnimatedPage>
  );
};

export default ProposalAI;