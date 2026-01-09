import React, { useMemo, useState, useEffect } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Receipt, ShieldCheck, ArrowRight, Calculator, FileText, ListChecks } from 'lucide-react';

const DEFAULT_PACKAGES = [
  { id: 'starter', name: 'Starter', price: 8500, timeline: '1-2 weeks', items: ['Discovery workshop', 'Landing page', 'Basic analytics'], risk: 'Low' },
  { id: 'growth', name: 'Growth', price: 18500, timeline: '3-4 weeks', items: ['Product site', 'Messaging revamp', 'CRO experiments'], risk: 'Medium' },
  { id: 'enterprise', name: 'Enterprise', price: 36000, timeline: '6-8 weeks', items: ['Multi-page site', 'Design system starter', 'Performance budget'], risk: 'Medium' },
];

const formatRand = (amount: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

const PricingScopeEngine: React.FC = () => {
  const { toast } = useToast();
  
  const [problem, setProblem] = useState(() => localStorage.getItem('gigstr_pricing_problem') || '');
  const [audience, setAudience] = useState(() => localStorage.getItem('gigstr_pricing_audience') || '');
  const [packageBaseline, setPackageBaseline] = useState(DEFAULT_PACKAGES);
  const [riskNotes, setRiskNotes] = useState(() => localStorage.getItem('gigstr_pricing_risks') || 'Scope creep risk: unclear success metrics. Add change-order clause.');

  useEffect(() => {
    localStorage.setItem('gigstr_pricing_problem', problem);
    localStorage.setItem('gigstr_pricing_audience', audience);
    localStorage.setItem('gigstr_pricing_risks', riskNotes);
  }, [problem, audience, riskNotes]);

  const scopePoints = useMemo(() => {
    if (!problem && !audience) return [
      'Define goals, success metrics, and decision-makers.',
      'Set communication cadence and demo checkpoints.',
      'List explicit inclusions and exclusions to prevent scope creep.'
    ];
    return [
      `Target audience: ${audience || 'unspecified'} — clarify segments and decision-makers.`,
      `Problem focus: ${problem || 'not stated'} — tie deliverables to measurable outcomes.`,
      'Add change-order language and acceptance criteria per milestone.'
    ];
  }, [problem, audience]);

  const tweakPrice = (base: number) => {
    const delta = (Math.random() * 0.08) - 0.04; // +/-4% to simulate recalibration
    const updated = Math.max(2000, Math.round(base * (1 + delta)));
    return updated;
  };

  const regenerate = () => {
    setPackageBaseline((prev) => prev.map(pkg => ({ ...pkg, price: tweakPrice(pkg.price) })));
    toast({ title: 'Packages refreshed', description: 'Recalibrated tiers in ZAR.' });
  };

  const resetDefaults = () => {
    setPackageBaseline(DEFAULT_PACKAGES);
    toast({ title: 'Defaults restored', description: 'Package pricing reset to baseline.' });
  };

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Calculator size={16} /> Pricing & Scope Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">Package, price, and protect scope</h1>
            <p className="text-muted-foreground">Generate tiered offers with timelines, risks, and change-order guardrails.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={regenerate}>
              <Sparkles className="w-4 h-4 mr-2" /> Regenerate packages
            </Button>
            <Button variant="outline" onClick={resetDefaults}>
              Reset to defaults
            </Button>
          </div>
        </div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>Project inputs</CardTitle>
            <CardDescription>We’ll tailor packages and scope points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Problem statement</label>
                <Textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. Conversion on mobile is weak; need a focused CRO sprint." className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Audience / buyer</label>
                <Textarea value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. B2B marketing leads; COO is final decision-maker." className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="scope">Scope & guardrails</TabsTrigger>
            <TabsTrigger value="handoff">Handoff docs</TabsTrigger>
          </TabsList>

          <TabsContent value="packages" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packageBaseline.map(pkg => (
                <Card key={pkg.id} className="border-border/80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{pkg.name}</CardTitle>
                      <Badge variant="outline" className="capitalize">{pkg.risk} risk</Badge>
                    </div>
                    <CardDescription>{pkg.timeline}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold">{formatRand(pkg.price)}</div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {pkg.items.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                    <Button className="mt-2" variant="secondary">
                      <ArrowRight className="w-4 h-4 mr-2" /> Export to proposal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks className="w-4 h-4" /> Acceptance & exclusions</CardTitle>
                <CardDescription>Prevent scope creep with crisp boundaries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {scopePoints.map((point, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/30">{point}</div>
                ))}
                <Separator className="my-2" />
                <Textarea value={riskNotes} onChange={(e) => setRiskNotes(e.target.value)} className="font-mono text-sm" rows={3} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="handoff" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{title: 'SOW draft', icon: FileText, desc: 'Deliverables, scope, timeline, payment schedule.'},{title: 'Contract', icon: ShieldCheck, desc: 'IP, confidentiality, change-order clause.'},{title: 'Invoice draft', icon: Receipt, desc: 'Deposit + milestone schedule with dates.'}].map((item, idx) => (
                <Card key={idx} className="border-border/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><item.icon className="w-4 h-4" /> {item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={() => toast({ title: `${item.title} queued`, description: 'We’ll prefill with your current package data once connected.' })}>Generate</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default PricingScopeEngine;
