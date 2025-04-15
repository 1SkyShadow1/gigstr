
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PenLine, Plus, FileText, Download, Eye, Trash2, Copy, Check, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/tools/PageHeader';

const mockTemplates = [
  { id: 1, name: 'Freelance Service Agreement', category: 'Services', uses: 245 },
  { id: 2, name: 'Website Development Contract', category: 'Development', uses: 189 },
  { id: 3, name: 'Graphic Design Agreement', category: 'Design', uses: 127 },
  { id: 4, name: 'Digital Marketing Contract', category: 'Marketing', uses: 98 },
  { id: 5, name: 'General Consulting Agreement', category: 'Consulting', uses: 156 },
];

const mockContracts = [
  { id: 'CON-2023-001', name: 'Acme Inc - Website Redesign', status: 'draft', template: 'Website Development Contract', date: '2023-04-10' },
  { id: 'CON-2023-002', name: 'TechStart - Mobile App Development', status: 'sent', template: 'Freelance Service Agreement', date: '2023-04-05' },
  { id: 'CON-2023-003', name: 'Design Co - Brand Identity', status: 'signed', template: 'Graphic Design Agreement', date: '2023-03-28' },
  { id: 'CON-2023-004', name: 'Marketing Pro - Social Media Campaign', status: 'expired', template: 'Digital Marketing Contract', date: '2023-02-15' },
];

const Contracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateContractOpen, setIsCreateContractOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const filteredContracts = mockContracts.filter(contract => {
    // Filter based on status if not on 'all' tab
    if (activeTab !== 'all' && contract.status !== activeTab) {
      return false;
    }
    
    // Filter based on search term
    if (searchTerm && !contract.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !contract.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleCreateContract = () => {
    toast({
      title: "Contract Created",
      description: "Your new contract has been created successfully.",
    });
    setIsCreateContractOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'sent':
        return <Badge variant="secondary">Sent</Badge>;
      case 'signed':
        return <Badge variant="default">Signed</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Contract Creator" 
        description="Create professional contracts for your freelance work"
        icon={<PenLine className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Search contracts..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Dialog open={isCreateContractOpen} onOpenChange={setIsCreateContractOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Generate a new contract from our templates or start from scratch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="contract-name">Contract Name</Label>
                <Input id="contract-name" placeholder="e.g. Client Name - Project Name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contract-template">Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contract-client">Client</Label>
                <Input id="contract-client" placeholder="Client name or company" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contract-start">Start Date</Label>
                  <Input id="contract-start" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contract-end">End Date</Label>
                  <Input id="contract-end" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateContract}>Create Contract</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="contracts">My Contracts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Your Contracts</CardTitle>
                <Tabs defaultValue="all" className="w-auto" onValueChange={setActiveTab} value={activeTab}>
                  <TabsList className="grid w-auto grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="signed">Signed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.length > 0 ? (
                    filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.name}</TableCell>
                        <TableCell>{contract.template}</TableCell>
                        <TableCell>{new Date(contract.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
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
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No contracts found. Create your first contract to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="hover:border-gigstr-purple/30 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FileText className="h-5 w-5 text-gigstr-purple" />
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Used {template.uses} times
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Use
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed hover:border-gigstr-purple/30 transition-colors cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Plus className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-lg mb-2 text-center">Create Custom Template</CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Design your own contract template for future use
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;
