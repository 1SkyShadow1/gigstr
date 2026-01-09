
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Car, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Laptop, 
  PieChart, 
  Plus, 
  Receipt, 
  Search, 
  TrendingUp,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

const formatRand = (amount: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const CATEGORIES = [
  { id: 'office', label: 'Office Supplies', icon: FileText },
  { id: 'software', label: 'Software & Subscriptions', icon: Laptop },
  { id: 'marketing', label: 'Marketing & Ads', icon: TrendingUp },
  { id: 'travel', label: 'Travel & Meals', icon: Car },
  { id: 'utilities', label: 'Utilities', icon: Building },
  { id: 'other', label: 'Other', icon: CreditCard },
];

const TaxVault = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Expense Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('office');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Statistics
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  // Assuming a generic 30% tax rate for estimation
  const estTaxSavings = totalExpenses * 0.3;

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsAdding(true);
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          description,
          category,
          date,
          is_deductible: true // Default for now
        });

      if (error) throw error;

      toast({
        title: "Expense added",
        description: "Your expense has been logged successfully."
      });

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('office');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Refresh list
      fetchExpenses();
      
      // Close dialog (handled by controlled component usually, but here we just rely on submit)
      const closeButton = document.getElementById('close-dialog');
      if (closeButton) closeButton.click();

    } catch (error: any) {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter(e => e.id !== id));
      toast({ title: "Expense deleted" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return CreditCard;
    return cat.icon;
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              Tax Vault
            </h1>
            <p className="text-gray-500 mt-1">
              Track deductible expenses and estimate tax savings.
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your business expense.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (R)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      required 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center">
                            <cat.icon className="mr-2 h-4 w-4 text-gray-500" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g. Client lunch" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? "Saving..." : "Save Expense"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800 flex items-center">
                <Receipt className="h-4 w-4 mr-2" /> Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">
                {formatRand(totalExpenses)}
              </div>
              <p className="text-xs text-emerald-600 mt-1">All time deductible</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
                <PieChart className="h-4 w-4 mr-2" /> Est. Tax Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">
                {formatRand(estTaxSavings)}
              </div>
              <p className="text-xs text-blue-600 mt-1">Based on ~30% tax rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">
                {expenses.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>
              A detailed list of all your logged business expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Receipt className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No expenses yet</h3>
                <p className="text-gray-500 mb-4">Start tracking to save on taxes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => {
                      const Icon = getCategoryIcon(expense.category);
                      return (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium text-gray-600">
                            {format(new Date(expense.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="bg-gray-100 p-1.5 rounded-md mr-2">
                                <Icon className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="capitalize">{CATEGORIES.find(c => c.id === expense.category)?.label || expense.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>{expense.description || '-'}</TableCell>
                          <TableCell className="text-right font-bold text-gray-900">
                            {formatRand(Number(expense.amount))}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(expense.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default TaxVault;
