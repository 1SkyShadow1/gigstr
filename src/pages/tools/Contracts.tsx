
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
import AnimatedPage from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
    PenLine, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Download, 
    FileSignature, 
    ShieldCheck, 
    FileText,
    Check
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Contract Templates
const TEMPLATES = [
    {
        id: 'freelance-std',
        title: "Standard Service Agreement",
        description: "Comprehensive contract covering scope, payment, and IP rights.",
        icon: FileText
    },
    {
        id: 'nda',
        title: "Non-Disclosure Agreement (NDA)",
        description: "Protect your confidential information and trade secrets.",
        icon: ShieldCheck
    },
    {
        id: 'retainer',
        title: "Retainer Agreement",
        description: "For ongoing work with a fixed monthly fee and scope.",
        icon: FileSignature
    }
];

const Contracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      clientName: '',
      startDate: '',
      endDate: '',
      scope: '',
      amount: ''
    }
  });

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) {
         toast({ title: 'Could not load contracts', description: error.message, variant: 'destructive' });
         setContracts([]);
      } else {
         setContracts(data || []);
      }
    } catch (error) {
      toast({ title: 'Could not load contracts', description: (error as any)?.message, variant: 'destructive' });
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchContracts();
  }, [user, navigate, fetchContracts]);

  const handleCreateClick = (templateId: string) => {
      setSelectedTemplate(templateId);
      const template = TEMPLATES.find(t => t.id === templateId);
      form.reset({
          title: template ? `${template.title} - [Client Name]` : '',
          clientName: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          scope: '',
          amount: ''
      });
      setIsDialogOpen(true);
  };

    const onSubmit = async (values: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Login required', description: 'Please sign in to create contracts.' });
      return;
    }

    try {
      const { error } = await supabase.from('contracts').insert({
        user_id: user.id,
        title: values.title,
        client_name: values.clientName,
        start_date: values.startDate,
        end_date: values.endDate || null,
        scope: values.scope,
        amount: values.amount ? Number(values.amount) : null,
        status: 'draft'
      });

      if (error) throw error;
      toast({ title: 'Contract drafted', description: 'Saved to your workspace.' });
      setIsDialogOpen(false);
      fetchContracts();
    } catch (err: any) {
      toast({ title: 'Could not save', description: err.message, variant: 'destructive' });
    }
    };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'active': return <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200">Active</Badge>;
          case 'signed': return <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"><Check size={12} className="mr-1"/> Signed</Badge>;
          default: return <Badge variant="outline">Draft</Badge>;
      }
  };

  return (
    <AnimatedPage>
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-heading">Contract Creator</h1>
            <p className="text-muted-foreground">Draft legally binding agreements in minutes, not hours.</p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="w-full">
          <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="templates" className="rounded-lg px-6 py-2">Templates</TabsTrigger>
              <TabsTrigger value="my-contracts" className="rounded-lg px-6 py-2">My Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {TEMPLATES.map((template) => (
                      <Card key={template.id} className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group" onClick={() => handleCreateClick(template.id)}>
                          <CardHeader>
                              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <template.icon size={24} />
                              </div>
                              <CardTitle>{template.title}</CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">Use Template</Button>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </TabsContent>

          <TabsContent value="my-contracts">
             <Card>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contract Title</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">Loading contracts...</TableCell>
                        </TableRow>
                      )}
                      {!loading && contracts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">No contracts yet. Draft your first agreement.</TableCell>
                        </TableRow>
                      )}
                      {!loading && contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-muted-foreground" />
                                        {contract.title}
                                    </div>
                                </TableCell>
                                <TableCell>{contract.client_name}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {contract.start_date} - {contract.end_date}
                                </TableCell>
                                <TableCell>{getStatusBadge(contract.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon"><Eye size={16}/></Button>
                                        <Button variant="ghost" size="icon"><Download size={16}/></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                      ))}
                    </TableBody>
                 </Table>
             </Card>
          </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Draft New Contract</DialogTitle>
            <DialogDescription>
                Customize the {TEMPLATES.find(t => t.id === selectedTemplate)?.title} for your client.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development Agreement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Legal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company or Individual Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Value (ZAR)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope of Work</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detail the deliverabes, milestones, and responsibilities..."
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Contract
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
    </AnimatedPage>
  );
};

export default Contracts;
