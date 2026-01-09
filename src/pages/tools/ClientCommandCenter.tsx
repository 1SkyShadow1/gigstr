import React, { useMemo, useState, useEffect, useRef } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  CalendarClock,
  Target,
  TrendingUp,
  ClipboardCheck,
  Plus,
  Filter
} from 'lucide-react';

type ClientRecord = {
  id: string;
  user_id: string;
  name: string;
  stage: string;
  value: number;
  last_contact?: string | null;
  next_step?: string | null;
  owner?: string | null;
  created_at?: string;
};

const PIPELINE_ORDER = ['Discovery', 'Proposal Sent', 'Negotiation', 'Closed Won'];

const ClientCommandCenter: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [missingTable, setMissingTable] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const warnedMissing = useRef(false);
  
  const [quickName, setQuickName] = useState('');
  const [quickValue, setQuickValue] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');

  useEffect(() => {
    if (!user || missingTable) return;
    const loadClients = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                const isMissing = error?.status === 404 || error?.code === '42P01' || error?.message?.toLowerCase().includes('does not exist') || error?.message?.toLowerCase().includes('clients');
                if (isMissing) {
                  setMissingTable(true);
                  if (!warnedMissing.current) {
                    toast({ title: 'Clients table not found', description: 'Deploy the clients table migration to stop this error.', variant: 'destructive' });
                    warnedMissing.current = true;
                  }
                } else {
                  toast({ title: 'Could not load clients', description: error.message, variant: 'destructive' });
                }
                setFetchError(error.message);
                setClients([]);
                return;
            }
            setClients(data || []);
            setFetchError(null);
        } catch (err: any) {
            toast({ title: 'Could not load clients', description: err.message, variant: 'destructive' });
            setClients([]);
            setFetchError(err.message);
        } finally {
            setLoading(false);
        }
    };

    loadClients();
  }, [user, toast, missingTable]);

  const metrics = useMemo(() => {
    const pipelineValue = clients
      .filter(c => (c.stage || '').toLowerCase() !== 'closed won')
      .reduce((acc, curr) => acc + (curr.value || 0), 0);
    const closedValue = clients
      .filter(c => (c.stage || '').toLowerCase() === 'closed won')
      .reduce((acc, curr) => acc + (curr.value || 0), 0);
    const followUps = clients.filter(c => (c.next_step || '').trim().length > 0).length;
    return {
      pipelineValue,
      closedValue,
      followUps
    };
  }, [clients]);

  const stageBreakdown = useMemo(() => {
    return PIPELINE_ORDER.reduce<Record<string, { count: number; value: number }>>((acc, stage) => {
      const stageClients = clients.filter(c => (c.stage || '').toLowerCase() === stage.toLowerCase());
      const value = stageClients.reduce((sum, c) => sum + (c.value || 0), 0);
      acc[stage] = { count: stageClients.length, value };
      return acc;
    }, {});
  }, [clients]);

  const nextSteps = useMemo(() => {
    return clients
      .filter(c => (c.next_step || '').trim().length > 0)
      .sort((a, b) => {
        const aDate = a.last_contact ? new Date(a.last_contact).getTime() : 0;
        const bDate = b.last_contact ? new Date(b.last_contact).getTime() : 0;
        return aDate - bDate;
      })
      .slice(0, 6);
  }, [clients]);

  const formatDate = (value?: string | null) => {
    if (!value) return '';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  const filteredClients = useMemo(() => {
    if (filterStage === 'all') return clients;
    return clients.filter(c => (c.stage || '').toLowerCase() === filterStage.toLowerCase());
  }, [clients, filterStage]);

  const handleQuickAdd = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Login required', description: 'Sign in to add clients.' });
      return;
    }
    if (missingTable) {
      toast({ variant: 'destructive', title: 'Clients table missing', description: 'Run the clients migration then reload.' });
      return;
    }
    if (!quickName || !quickValue) {
      toast({ title: 'Missing info', description: 'Add a name and deal value first.', variant: 'destructive' });
      return;
    }
    const value = Number(quickValue) || 0;
    const payload = {
      user_id: user.id,
      name: quickName.trim(),
      stage: 'Discovery',
      value,
      last_contact: new Date().toISOString(),
      next_step: 'Schedule discovery call',
      owner: user.email || 'You'
    } satisfies Omit<ClientRecord, 'id' | 'created_at'>;

    const { error, data } = await supabase.from('clients').insert(payload).select().single();
    if (error) {
      toast({ title: 'Could not add client', description: error.message, variant: 'destructive' });
      return;
    }

    setQuickName('');
    setQuickValue('');
    toast({ title: 'Lead captured', description: 'Added to Discovery.' });
    setClients(prev => [data as ClientRecord, ...prev]);
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              <Users size={16} /> Client Command Center
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading">Relationships, pipeline, follow-ups</h1>
            <p className="text-muted-foreground">See every client, next step, and value in one place. Never miss a follow-up.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleQuickAdd}>
              <Plus className="w-4 h-4 mr-2" /> Quick add
            </Button>
          </div>
        </div>

        {missingTable && (
          <div className="p-4 border border-destructive/40 bg-destructive/5 text-sm rounded-lg text-destructive">
            Clients table is missing in Supabase. Apply the migration in <span className="font-semibold">supabase/create_clients_table.sql</span> and reload.
          </div>
        )}
        {fetchError && !missingTable && (
          <div className="p-4 border border-destructive/40 bg-destructive/5 text-sm rounded-lg text-destructive">
            {fetchError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Pipeline (open)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R {metrics.pipelineValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Discovery → Negotiation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4" /> Closed won</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R {metrics.closedValue.toLocaleString()}</div>
              <p className="text-xs text-green-600">Momentum: keep the streak.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><CalendarClock className="w-4 h-4" /> Follow-ups due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.followUps}</div>
              <p className="text-xs text-muted-foreground">Send one nudge now.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/80">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle>Pipeline view</CardTitle>
                <CardDescription>Segment by stage and act on next steps.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Tabs value={filterStage} onValueChange={setFilterStage} className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {PIPELINE_ORDER.map(stage => (
                      <TabsTrigger key={stage} value={stage}>{stage}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="icon" title="Reset filters" onClick={() => setFilterStage('all')}><Filter className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input placeholder="Client name" value={quickName} onChange={(e) => setQuickName(e.target.value)} />
              <Input type="number" placeholder="Deal value (R)" value={quickValue} onChange={(e) => setQuickValue(e.target.value)} />
              <Button onClick={handleQuickAdd} className="w-full md:w-auto">Add to Discovery</Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Last contact</TableHead>
                    <TableHead>Next step</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">Loading clients...</TableCell>
                    </TableRow>
                  )}
                  {!loading && filteredClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">No clients yet. Add a lead to get started.</TableCell>
                    </TableRow>
                  )}
                  {!loading && filteredClients.map(client => (
                    <TableRow key={client.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{client.stage}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">R {Number(client.value || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(client.last_contact) || '—'}</TableCell>
                      <TableCell className="text-sm">{client.next_step || '—'}</TableCell>
                      <TableCell className="text-sm">{client.owner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Next steps queue</CardTitle>
              <CardDescription>Clients with defined next steps appear here first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextSteps.length === 0 && (
                <div className="p-3 rounded-lg border border-dashed text-sm text-muted-foreground text-center">Add a next step on any client to start a queue.</div>
              )}
              {nextSteps.map(item => (
                <div key={item.id} className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.next_step}</p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{item.stage}</div>
                    <div>Last contact: {formatDate(item.last_contact) || '—'}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Stage breakdown</CardTitle>
              <CardDescription>Live view of where clients sit in the pipeline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {PIPELINE_ORDER.map(stage => {
                const stats = stageBreakdown[stage] || { count: 0, value: 0 };
                return (
                  <div key={stage} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="font-medium">{stage}</p>
                      <p className="text-sm text-muted-foreground">R {stats.value.toLocaleString()} total</p>
                    </div>
                    <Badge variant="secondary">{stats.count} {stats.count === 1 ? 'deal' : 'deals'}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ClientCommandCenter;
