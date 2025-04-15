
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Laptop, Search, Plus, Share2, Users, FileText, MessageSquare, CreditCard, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/tools/PageHeader';

const mockClients = [
  { 
    id: 1, 
    name: 'Acme Inc.', 
    projects: 3, 
    status: 'active'
  },
  { 
    id: 2, 
    name: 'TechStart', 
    projects: 1, 
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Design Co', 
    projects: 2, 
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Marketing Pro', 
    projects: 1, 
    status: 'inactive'
  },
];

const ClientPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is coming soon! Check back later.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Client Portal" 
        description="Share progress and files with clients in a professional portal"
        icon={<Laptop className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Search clients..." className="pl-8" />
          </div>
        </div>
        
        <Button onClick={showComingSoon} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Client
        </Button>
      </div>
      
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="portals">Active Portals</TabsTrigger>
          <TabsTrigger value="templates">Portal Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockClients.map((client) => (
              <Card key={client.id} className={client.status === 'inactive' ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {client.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {client.projects} {client.projects === 1 ? 'Project' : 'Projects'}
                      </CardDescription>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={showComingSoon}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      View Portal
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={showComingSoon}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed hover:border-gigstr-purple/30 transition-colors cursor-pointer" onClick={showComingSoon}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[150px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Plus className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-base mb-2 text-center">Add New Client</CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Create a new client profile
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portals">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Client Portals Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're still working on this feature. Check back soon!
                </p>
                <Button variant="outline" onClick={() => navigate('/tools')}>
                  Return to Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:border-gigstr-purple/30 transition-colors cursor-pointer" onClick={showComingSoon}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <FileText className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-base mb-2 text-center">Projects</CardTitle>
                <p className="text-xs text-muted-foreground text-center">
                  Project overview and milestone tracking
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-gigstr-purple/30 transition-colors cursor-pointer" onClick={showComingSoon}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <CreditCard className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-base mb-2 text-center">Invoices</CardTitle>
                <p className="text-xs text-muted-foreground text-center">
                  Invoice management and payment processing
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-gigstr-purple/30 transition-colors cursor-pointer" onClick={showComingSoon}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <MessageSquare className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-base mb-2 text-center">Messages</CardTitle>
                <p className="text-xs text-muted-foreground text-center">
                  Client communication and file sharing
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:border-gigstr-purple/30 transition-colors cursor-pointer" onClick={showComingSoon}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Calendar className="h-5 w-5 text-gigstr-purple" />
                </div>
                <CardTitle className="text-base mb-2 text-center">Calendar</CardTitle>
                <p className="text-xs text-muted-foreground text-center">
                  Meeting scheduling and availability
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-gigstr-purple/5 to-transparent border-gigstr-purple/10">
          <CardHeader>
            <CardTitle>Introducing Client Portals</CardTitle>
            <CardDescription>
              Create professional client portals to share project updates, files, and invoices in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-gigstr-purple mr-2" />
                  <h3 className="font-medium">Client Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Organize client information, projects, and communication in one place.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Share2 className="h-5 w-5 text-gigstr-purple mr-2" />
                  <h3 className="font-medium">Custom Portals</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create branded client portals with custom domains and logos.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-gigstr-purple mr-2" />
                  <h3 className="font-medium">Streamlined Communication</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep all client communication and file sharing in one organized place.
                </p>
              </div>
            </div>
            
            <Button className="mt-6" onClick={showComingSoon}>
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPortal;
