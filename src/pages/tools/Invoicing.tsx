import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Send,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer, 
  Search,
  Filter,
  Link,
  Repeat
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const Invoicing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentLinks] = useState<any[]>([]);
  const [subscriptions] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const form = useForm({
    defaultValues: {
      clientName: '',
      clientEmail: '',
      amount: '',
      dueDate: '',
      invoiceNumber: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchInvoices();
  }, [user, navigate]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) {
           toast({ title: 'Could not load invoices', description: error.message, variant: 'destructive' });
           setInvoices([]);
      } else {
           setInvoices(data || []);
      }
    } catch (error: any) {
      toast({ title: 'Could not load invoices', description: error.message, variant: 'destructive' });
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const openNewInvoiceDialog = () => {
    setCurrentInvoice(null);
    form.reset({
      clientName: '',
      clientEmail: '',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const openEditInvoiceDialog = (invoice: any) => {
    setCurrentInvoice(invoice);
    form.reset({
      clientName: invoice.client_name,
      clientEmail: invoice.client_email || '',
      amount: String(invoice.amount),
      dueDate: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '', // Fix Date parsing
      invoiceNumber: invoice.invoice_number,
      notes: invoice.notes || ''
    });
    setIsDialogOpen(true);
  };

    const onSubmit = async (values: any) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Login required', description: 'Please sign in to manage invoices.' });
      return;
    }

    const amountNumber = parseFloat(values.amount);
    if (Number.isNaN(amountNumber)) {
      toast({ variant: 'destructive', title: 'Invalid amount', description: 'Enter a valid number.' });
      return;
    }

    const payload = {
      user_id: user.id,
      client_name: values.clientName,
      client_email: values.clientEmail || null,
      amount: amountNumber,
      due_date: values.dueDate || null,
      invoice_number: values.invoiceNumber,
      notes: values.notes || null,
      status: currentInvoice?.status || 'pending',
      issued_date: currentInvoice?.issued_date || new Date().toISOString(),
    };

    try {
      const request = currentInvoice
        ? supabase.from('invoices').update(payload).eq('id', currentInvoice.id).eq('user_id', user.id).select().single()
        : supabase.from('invoices').insert(payload).select().single();

      const { error } = await request;
      if (error) throw error;

      toast({
        title: currentInvoice ? 'Invoice updated' : 'Invoice created',
        description: currentInvoice ? 'Saved changes to invoice.' : 'Invoice saved.',
      });
      setIsDialogOpen(false);
      await fetchInvoices();
    } catch (err: any) {
      toast({ title: 'Save failed', description: err.message, variant: 'destructive' });
    }
    };

  const deleteInvoice = (id: string) => {
    if (!user) return;
    supabase.from('invoices').delete().eq('id', id).eq('user_id', user.id).then(({ error }) => {
      if (error) {
        toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
        return;
      }
      fetchInvoices();
      toast({ title: 'Invoice deleted', description: 'The invoice has been removed.' });
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200"><CheckCircle size={12} className="mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200"><Clock size={12} className="mr-1" /> Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-200"><AlertCircle size={12} className="mr-1" /> Overdue</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-500">Draft</Badge>;
    }
  };

  const handleAction = (action: string, invoice: any) => {
      if (action === 'download') {
        toast({
            title: "Generating PDF",
            description: `Preparing ${invoice.invoice_number}.pdf...`,
        });
      }
      if (action === 'send') {
        toast({
            title: "Queued to send",
            description: `We will email ${invoice.client_email || 'the client'} once delivery is wired.`,
        });
      }
  };

  const copyLink = (url: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
    }
    toast({ title: 'Payment link copied', description: url });
  };
  
  // Stats calculation
    const stats = {
      total: invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0),
      paid: invoices.filter(i => (i.status || '').toLowerCase() === 'paid').reduce((acc, curr) => acc + (curr.amount || 0), 0),
      pending: invoices.filter(i => (i.status || '').toLowerCase() === 'pending').reduce((acc, curr) => acc + (curr.amount || 0), 0),
      overdue: invoices.filter(i => (i.status || '').toLowerCase() === 'overdue').reduce((acc, curr) => acc + (curr.amount || 0), 0),
    };

    const filteredInvoices = invoices.filter(i => 
      (i.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (i.invoice_number || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-heading">Invoices</h1>
            <p className="text-muted-foreground">Manage payments and track your earnings.</p>
        </div>
        <Button onClick={openNewInvoiceDialog} className="shadow-lg shadow-primary/20">
          <Plus size={18} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card">
            <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">Total Invoiced</div>
                <div className="text-2xl font-bold">{formatPrice(stats.total)}</div>
            </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-200/50">
            <CardContent className="p-6">
                <div className="text-sm font-medium text-green-600 mb-2">Total Paid</div>
                <div className="text-2xl font-bold text-green-700">{formatPrice(stats.paid)}</div>
            </CardContent>
        </Card>
        <Card className="bg-yellow-500/5 border-yellow-200/50">
            <CardContent className="p-6">
                <div className="text-sm font-medium text-yellow-600 mb-2">Pending</div>
                <div className="text-2xl font-bold text-yellow-700">{formatPrice(stats.pending)}</div>
            </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-200/50">
            <CardContent className="p-6">
                <div className="text-sm font-medium text-red-600 mb-2">Overdue</div>
                <div className="text-2xl font-bold text-red-700">{formatPrice(stats.overdue)}</div>
            </CardContent>
        </Card>
      </div>

      {/* Function Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
                placeholder="Search invoices..." 
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
        <Button variant="outline" size="icon">
            <Filter size={18} />
        </Button>
      </div>

      {/* Payment Links & Recurring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Link className="w-4 h-4" /> Payment links</CardTitle>
            <CardDescription>Shareable links for deposits and retainers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
              {paymentLinks.length === 0 && (
                <div className="p-3 rounded-lg border border-dashed text-sm text-muted-foreground text-center">
                  No payment links yet. Connect your payment provider to start sharing links.
                </div>
              )}
              {paymentLinks.map(link => (
                <div key={link.id} className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(link.amount)} • {link.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => copyLink(link.url)}>Copy</Button>
                    <Button size="sm" onClick={() => toast({ title: 'Sending link', description: 'We will email the client once email delivery is wired.' })}>Send</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => toast({ title: 'Payment links coming soon', description: 'Connect Stripe/Paystack to create links.' })}>Create link</Button>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Repeat className="w-4 h-4" /> Recurring & overdue</CardTitle>
            <CardDescription>Automate retainers and dunning nudges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
              {subscriptions.length === 0 && (
                <div className="p-3 rounded-lg border border-dashed text-sm text-muted-foreground text-center">
                  No recurring plans yet. Create a subscription once billing is connected.
                </div>
              )}
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-3 rounded-lg border border-border/60 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.cadence} • {formatPrice(sub.amount)} • {sub.status}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => toast({ title: 'Not yet connected', description: 'Subscription management will be available once billing is wired.' })}>Manage</Button>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-sm space-y-1">
                <div className="font-semibold">Overdue playbook</div>
                <div className="text-muted-foreground">Enable dunning once email + payments are configured.</div>
                <Button size="sm" className="mt-2" onClick={() => toast({ title: 'Automation pending', description: 'Connect billing to activate overdue nudges.' })}>Activate</Button>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Date Issue</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium font-mono text-xs md:text-sm">{invoice.invoice_number}</TableCell>
                  <TableCell className="font-medium">{invoice.client_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {invoice.issued_date ? format(new Date(invoice.issued_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatPrice(invoice.amount)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditInvoiceDialog(invoice)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('download', invoice)}>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('send', invoice)}>
                            <Send className="mr-2 h-4 w-4" /> Send to Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteInvoice(invoice.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No invoices found.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </DialogTitle>
          </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Client name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="client@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Amount (R)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or payment instructions"
                        className="resize-none"
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
                  {currentInvoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoicing;
