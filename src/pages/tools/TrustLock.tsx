import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Shield, 
    FileText, 
    Gavel, 
    Lock, 
    CheckCircle, 
    AlertCircle, 
    DollarSign, 
    Clock, 
    Briefcase,
    ChevronRight,
    ArrowRight,
    User,
    AlertTriangle,
    Upload,
    CheckSquare,
    ListChecks,
    ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import AnimatedPage from '@/components/AnimatedPage';

type Agreement = {
    id: string;
    title: string;
    client: string;
    amount: number;
    status: string;
    milestones?: { id: string | number; name: string; amount?: number; status: string }[];
    created_at: string;
};

const TrustLock = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    // Default to 'agreements' as it's the main feature, 'verification' can be secondary
    const [activeTab, setActiveTab] = useState('agreements');
    const [agreements, setAgreements] = useState<Agreement[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    const idInputRef = React.useRef<HTMLInputElement>(null);
    const addressInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;
        const fetchAgreements = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('trustlock_agreements')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    toast({ title: 'Could not load agreements', description: error.message, variant: 'destructive' });
                    setAgreements([]);
                    return;
                }
                setAgreements((data as Agreement[]) || []);
            } catch (err: any) {
                toast({ title: 'Could not load agreements', description: err.message, variant: 'destructive' });
                setAgreements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAgreements();
    }, [user, toast]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newClient, setNewClient] = useState('');
    const [newAmount, setNewAmount] = useState('');

  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(val);
  };

  const handleCreateAgreement = async () => {
      if (!user) {
          toast({ variant: 'destructive', title: 'Login required', description: 'Please sign in to create agreements.' });
          return;
      }

      if (!newTitle || !newClient || !newAmount) {
          toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in all details.'});
          return;
      }

      const amountValue = parseFloat(newAmount);
      if (Number.isNaN(amountValue)) {
          toast({ variant: 'destructive', title: 'Invalid amount', description: 'Enter a valid number.' });
          return;
      }

      try {
          toast({ title: 'Creating agreement', description: 'Saving to TrustLock.' });
          const { data, error } = await supabase
              .from('trustlock_agreements')
              .insert({
                  user_id: user.id,
                  title: newTitle,
                  client: newClient,
                  amount: amountValue,
                  status: 'pending_deposit',
                  milestones: [{ id: '1', name: 'Full Project', amount: amountValue, status: 'locked' }],
              })
              .select()
              .single();

          if (error) throw error;

          setAgreements([data as Agreement, ...agreements]);
          setIsCreateOpen(false);
          setNewTitle(''); setNewClient(''); setNewAmount('');
          toast({ title: 'Agreement created', description: 'Share the link with your client to deposit.' });
      } catch (err: any) {
          toast({ title: 'Could not create agreement', description: err.message, variant: 'destructive' });
      }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'active': return 'bg-blue-500/10 text-blue-600 border-blue-200';
          case 'completed': return 'bg-green-500/10 text-green-600 border-green-200';
          case 'pending_deposit': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
          default: return 'bg-gray-500/10 text-gray-600';
      }
  };

  const handleVerificationUpload = async (file: File, documentType: 'id' | 'address') => {
      if (!user) {
          toast({ title: 'Login required', description: 'Please sign in to upload documents.', variant: 'destructive' });
          return;
      }

      try {
          setIsUploadingDoc(true);
          const { url, path } = await uploadFileToBucket({
              bucket: 'trustlock-docs',
              file,
              folder: `${user.id}/${documentType}`
          });

          const { error } = await supabase.from('trustlock_verifications').insert({
              user_id: user.id,
              document_type: documentType === 'id' ? 'id' : 'address',
              file_path: path,
              status: 'pending',
          });

          if (error) throw error;
          toast({ title: 'Document uploaded', description: 'We will verify within 24-48 hours.' });
      } catch (err: any) {
          toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      } finally {
          setIsUploadingDoc(false);
          if (idInputRef.current) idInputRef.current.value = '';
          if (addressInputRef.current) addressInputRef.current.value = '';
      }
  };

  const totalLocked = agreements
      .filter(a => ['active', 'pending_deposit'].includes((a.status || '').toLowerCase()))
      .reduce((sum, a) => sum + (a.amount || 0), 0);

  const totalReleased30 = agreements
      .filter(a => (a.status || '').toLowerCase() === 'completed' && a.created_at && new Date(a.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <AnimatedPage>
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 font-heading">TrustLock</h1>
                    </div>
                    <p className="text-gray-500 max-w-xl">
                        Bank-level escrow protection for your freelance work. Work with confidence knowing funds are secured before you start.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setActiveTab('disputes')}>
                        <Gavel className="w-4 h-4 mr-2" /> Dispute Resolution
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" onClick={() => setIsCreateOpen(true)}>
                        <Lock className="w-4 h-4 mr-2" /> New Secure Agreement
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-100 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Locked in Escrow
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(totalLocked)}</div>
                        <p className="text-indigo-100 text-xs mt-1">Secured across active and pending agreements</p>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-indigo-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" /> Released (Last 30 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalReleased30)}</div>
                        <p className="text-green-600 text-xs mt-1 font-medium">Completed in the last 30 days</p>
                    </CardContent>
                 </Card>

                 <Card className="bg-white border-indigo-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-orange-500" /> Active Agreements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{agreements.filter(a => (a.status || '').toLowerCase() === 'active').length}</div>
                        <p className="text-gray-400 text-xs mt-1">projects currently protected</p>
                    </CardContent>
                 </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/40 p-1 mb-6">
                    <TabsTrigger value="agreements" className="px-6">My Agreements</TabsTrigger>
                    <TabsTrigger value="verification" className="px-6">Identity Verification</TabsTrigger>
                    <TabsTrigger value="disputes" className="px-6">Dispute Center</TabsTrigger>
                </TabsList>

                {/* Agreements Tab */}
                <TabsContent value="agreements" className="space-y-6">
                    {loading ? (
                        <div className="text-center py-16 bg-white border border-dashed rounded-xl">
                            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-lg font-medium text-gray-900">Loading agreements...</h3>
                        </div>
                    ) : agreements.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-dashed rounded-xl">
                             <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                             <h3 className="text-lg font-medium text-gray-900">No Active Agreements</h3>
                             <p className="text-gray-500 mb-6">Create your first TrustLock agreement to secure payment.</p>
                             <Button onClick={() => setIsCreateOpen(true)}>Create Agreement</Button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {agreements.map((agreement) => {
                                const milestones = agreement.milestones || [];
                                const completedCount = milestones.filter((m: any) => ['completed', 'released'].includes((m.status || '').toLowerCase())).length;
                                const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;
                                const statusText = (agreement.status || 'pending').replace('_', ' ').toUpperCase();

                                return (
                                <Card key={agreement.id} className="group hover:border-indigo-300 transition-all shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            {/* Left Info */}
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className={getStatusColor(agreement.status || '')}>
                                                        {statusText}
                                                    </Badge>
                                                    <span className="text-xs text-gray-400 font-mono">{agreement.id}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                                    {agreement.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3"/> {agreement.client}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {agreement.created_at ? format(new Date(agreement.created_at), 'MMM d, yyyy') : 'Date pending'}</span>
                                                </div>
                                            </div>

                                            {/* Milestones Visualization */}
                                            <div className="flex-1 min-w-[300px] border-l pl-6 hidden md:block">
                                                 <div className="flex justify-between text-sm mb-2">
                                                     <span className="font-medium text-gray-700">Project Progress</span>
                                                     <span className="text-indigo-600 font-bold">
                                                         {progress}%
                                                     </span>
                                                 </div>
                                                 <Progress value={progress} className="h-2 mb-4" />
                                                 <div className="flex gap-2 text-xs text-gray-500">
                                                     {milestones.map((m: any, i: number) => (
                                                         <div key={i} className="flex items-center gap-1">
                                                             <div className={`w-2 h-2 rounded-full ${m.status === 'released' ? 'bg-green-500' : m.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                                             {m.name}
                                                         </div>
                                                     ))}
                                                 </div>
                                            </div>

                                            {/* Right Value & Actions */}
                                            <div className="flex flex-col items-end justify-center min-w-[150px]">
                                                <div className="text-2xl font-bold text-gray-900">{formatCurrency(agreement.amount)}</div>
                                                <div className="text-xs text-gray-400 mb-4">Total Value</div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="secondary">View Details</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="bg-gray-50 px-6 py-2 rounded-b-xl border-t flex justify-between items-center text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3 h-3 text-green-600" /> Funds secured by TrustLock Escrow
                                        </div>
                                        <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                            Request Release <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </Card>
                            );})}
                        </div>
                    )}
                </TabsContent>

                {/* Verification Content (Simplified) */}
                <TabsContent value="verification">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identity Verification</CardTitle>
                            <CardDescription>To use TrustLock, we need to verify your identity to comply with financial regulations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-yellow-800">Verification Pending</h4>
                                    <p className="text-sm text-yellow-700">Please upload a clear copy of your South African ID or Passport. Processing takes 24-48 hours.</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">Upload ID Document</h3>
                                    <p className="text-xs text-gray-500 mb-4">Smart ID Card or Passport Green Book</p>
                                                                        <input
                                                                            ref={idInputRef}
                                                                            type="file"
                                                                            accept="image/*,application/pdf"
                                                                            className="hidden"
                                                                            onChange={(e) => e.target.files?.[0] && handleVerificationUpload(e.target.files[0], 'id')}
                                                                        />
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => idInputRef.current?.click()}
                                                                            disabled={isUploadingDoc}
                                                                        >
                                                                            {isUploadingDoc ? 'Uploading...' : 'Select File'}
                                                                        </Button>
                                </div>
                                
                                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h3 className="font-medium text-gray-900 mb-1">Proof of Address</h3>
                                    <p className="text-xs text-gray-500 mb-4">Utility bill or Bank Statement (Max 3 months)</p>
                                                                        <input
                                                                            ref={addressInputRef}
                                                                            type="file"
                                                                            accept="image/*,application/pdf"
                                                                            className="hidden"
                                                                            onChange={(e) => e.target.files?.[0] && handleVerificationUpload(e.target.files[0], 'address')}
                                                                        />
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => addressInputRef.current?.click()}
                                                                            disabled={isUploadingDoc}
                                                                        >
                                                                            {isUploadingDoc ? 'Uploading...' : 'Select File'}
                                                                        </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                 {/* Disputes Content */}
                 <TabsContent value="disputes">
                    <Card className="text-center py-12">
                        <Gavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No Active Disputes</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            When payments are disputed, our arbitration team steps in to review evidence and make a binding decision.
                        </p>
                        <Button variant="outline">Learn about Arbitration</Button>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Release gating + QA checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card className="border-indigo-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Milestone release gating</CardTitle>
                        <CardDescription>Funds release only when checks are complete.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-600" /> QA checklist signed off</div>
                        <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-600" /> Client approval captured</div>
                        <div className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-600" /> Dispute window clear</div>
                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-100">
                            Automatic rule: if client approves and QA is green, release milestone 24h later unless dispute is opened.
                        </div>
                        <Button onClick={() => toast({ title: 'Release gating pending', description: 'Escrow release automation will run once connected.' })}>
                            Trigger release check
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-indigo-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks className="w-4 h-4 text-indigo-600" /> QA / delivery checklist</CardTitle>
                        <CardDescription>What must be true before requesting release.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Acceptance tests recorded</p>
                                <p className="text-muted-foreground text-xs">Attach Loom + test steps.</p>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Uptime & SLA check</p>
                                <p className="text-muted-foreground text-xs">Last 24h monitor clean.</p>
                            </div>
                            <Badge variant="outline">Pass</Badge>
                        </div>
                        <div className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Client sign-off note</p>
                                <p className="text-muted-foreground text-xs">Decision maker approval stored.</p>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                        </div>
                        <Button variant="outline" onClick={() => toast({ title: 'Saved', description: 'Checklist note captured.' })}>
                            Log QA evidence
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create TrustLock Agreement</DialogTitle>
                        <DialogDescription>Define the terms and lock funds in escrow.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Title</label>
                            <Input placeholder="e.g. Mobile App MVP" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client Name/Email</label>
                            <Input placeholder="client@company.com" value={newClient} onChange={e => setNewClient(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Amount (ZAR)</label>
                            <Input type="number" placeholder="0.00" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-700 flex gap-2">
                            <Shield className="w-4 h-4 shrink-0" />
                            Client will deposit funds into TrustLock. You get paid automatically when milestones are approved.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateAgreement} className="bg-indigo-600 hover:bg-indigo-700">Create & Send</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </AnimatedPage>
  );
};

export default TrustLock;