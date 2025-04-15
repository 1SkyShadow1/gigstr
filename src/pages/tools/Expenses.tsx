
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Receipt, Plus, Search, Filter, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/tools/PageHeader';

const mockExpenses = [
  { id: 'EXP-001', date: '2023-04-10', category: 'Software', amount: 49.99, description: 'Design Software Subscription', status: 'complete' },
  { id: 'EXP-002', date: '2023-04-05', category: 'Office', amount: 25.50, description: 'Office Supplies', status: 'complete' },
  { id: 'EXP-003', date: '2023-03-28', category: 'Travel', amount: 125.00, description: 'Client Meeting Travel', status: 'pending' },
  { id: 'EXP-004', date: '2023-03-20', category: 'Professional', amount: 200.00, description: 'Consultant Fee', status: 'complete' },
  { id: 'EXP-005', date: '2023-03-15', category: 'Marketing', amount: 75.00, description: 'Social Media Ads', status: 'pending' },
];

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const filteredExpenses = mockExpenses.filter(expense => {
    if (searchTerm && !expense.description.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !expense.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleAddExpense = () => {
    toast({
      title: "Expense Added",
      description: "Your new expense has been added successfully.",
    });
    setIsAddExpenseOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Expense Tracker" 
        description="Track your business expenses and generate reports"
        icon={<Receipt className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Search expenses..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="expense-description">Description</Label>
                <Input id="expense-description" placeholder="Describe the expense" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input id="expense-amount" type="number" step="0.01" min="0" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input id="expense-date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expense-category">Category</Label>
                  <Select>
                    <SelectTrigger id="expense-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="office">Office Supplies</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="professional">Professional Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expense-project">Project (Optional)</Label>
                  <Input id="expense-project" placeholder="Associated project" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expense-receipt">Receipt Image (Optional)</Label>
                <Input id="expense-receipt" type="file" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$475.49</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$200.00</div>
            <p className="text-xs text-muted-foreground">2 expenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Largest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Professional</div>
            <p className="text-xs text-muted-foreground">$200.00 (42%)</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={expense.status === 'complete' ? 'default' : 'secondary'}
                      >
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No expenses found. Add your first expense to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
