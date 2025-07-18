
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
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
import { PenLine, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Contracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      clientName: '',
      startDate: '',
      endDate: '',
      terms: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchContracts();
  }, [user, navigate]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast({
        title: "Error",
        description: "Failed to load contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewContractDialog = () => {
    setCurrentContract(null);
    form.reset({
      title: '',
      clientName: '',
      startDate: '',
      endDate: '',
      terms: ''
    });
    setIsDialogOpen(true);
  };

  const openEditContractDialog = (contract: any) => {
    setCurrentContract(contract);
    
    form.reset({
      title: contract.title,
      clientName: contract.client_name,
      startDate: contract.start_date ? format(new Date(contract.start_date), 'yyyy-MM-dd') : '',
      endDate: contract.end_date ? format(new Date(contract.end_date), 'yyyy-MM-dd') : '',
      terms: contract.terms || ''
    });
    
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: any) => {
    try {
      const contractData = {
        user_id: user!.id,
        title: values.title,
        client_name: values.clientName,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        terms: values.terms || null,
        status: 'draft'
      };
      
      let result;
      if (currentContract) {
        // Update existing contract
        result = await supabase
          .from('contracts')
          .update(contractData)
          .eq('id', currentContract.id);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Contract updated successfully",
        });
      } else {
        // Create new contract
        result = await supabase
          .from('contracts')
          .insert([contractData]);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Contract created successfully",
        });
      }
      
      setIsDialogOpen(false);
      fetchContracts();
    } catch (error: any) {
      console.error("Error saving contract:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save contract",
        variant: "destructive",
      });
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
      
      fetchContracts();
    } catch (error: any) {
      console.error("Error deleting contract:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete contract",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Active</Badge>;
      case 'signed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Signed</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Expired</Badge>;
      case 'draft':
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Draft</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Contract Creator" 
        description="Create professional contracts for your freelance work"
      >
        <Button onClick={openNewContractDialog} className="flex items-center gap-2">
          <Plus size={16} />
          New Contract
        </Button>
      </PageHeader>

      <div className="mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded flex items-center justify-between">
          <div>
            <span className="font-semibold text-blue-700">Want a more secure, verified agreement?</span>
            <span className="ml-2 text-blue-700">Try <b>TrustLock</b> for premium protection and dispute resolution.</span>
          </div>
          <Button variant="secondary" onClick={() => navigate('/tools/trustlock')}>
            Start TrustLock Agreement
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">Loading contracts...</div>
      ) : contracts.length > 0 ? (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden lg:table-cell">Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.title}</TableCell>
                  <TableCell>{contract.client_name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(contract.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {contract.start_date && contract.end_date 
                      ? `${format(new Date(contract.start_date), 'MMM d, yyyy')} - ${format(new Date(contract.end_date), 'MMM d, yyyy')}` 
                      : 'Not specified'
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Contract">
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit Contract"
                        onClick={() => openEditContractDialog(contract)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download Contract">
                        <Download size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Delete Contract"
                        onClick={() => deleteContract(contract.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50">
          <PenLine className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Contracts Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't created any contracts yet. Start by creating your first professional contract.
          </p>
          <Button onClick={openNewContractDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Contract
          </Button>
        </div>
      )}

      {/* Contract Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentContract ? 'Edit Contract' : 'Create New Contract'}
            </DialogTitle>
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
                      <Input placeholder="e.g., Web Development Services Agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (Optional)</FormLabel>
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
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Terms</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter contract terms and conditions"
                        className="resize-none h-[200px]"
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
                  {currentContract ? 'Update Contract' : 'Create Contract'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
