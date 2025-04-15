
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Clock, 
  Calendar, 
  FileText, 
  BarChart3, 
  ChevronRight,
  Laptop,
  PenLine,
  Receipt,
  Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ToolCard = ({ title, description, icon: Icon, path, badge = null }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full hover:border-gigstr-purple/40 transition-colors group cursor-pointer" onClick={() => navigate(path)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="bg-gigstr-purple/10 p-3 rounded-lg group-hover:bg-gigstr-purple/20 transition-colors">
            <Icon className="h-6 w-6 text-gigstr-purple" />
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-gray-100">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-between group-hover:text-gigstr-purple transition-colors">
          Open Tool
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Tools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Productivity Tools</h1>
          <p className="text-muted-foreground">Boost your productivity with our suite of professional tools</p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="time">Time Management</TabsTrigger>
          <TabsTrigger value="project">Project Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              title="Invoicing"
              description="Create and manage professional invoices for your clients"
              icon={FileText}
              path="/tools/invoicing"
              badge="Popular"
            />
            
            <ToolCard
              title="Time Tracking"
              description="Track your working hours and monitor your productivity"
              icon={Clock}
              path="/tools/time-tracking"
            />
            
            <ToolCard
              title="Project Management"
              description="Organize your projects with tasks, milestones, and deadlines"
              icon={ClipboardList}
              path="/tools/project-management"
            />
            
            <ToolCard
              title="Schedule Planner"
              description="Plan your weekly schedule and manage your availability"
              icon={Calendar}
              path="/tools/schedule-planner"
            />
            
            <ToolCard
              title="Analytics Dashboard"
              description="View insights about your earnings, time spent, and productivity"
              icon={BarChart3}
              path="/tools/analytics"
            />
            
            <ToolCard
              title="Contract Creator"
              description="Create professional contracts for your freelance work"
              icon={PenLine}
              path="/tools/contracts"
              badge="New"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="finance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              title="Invoicing"
              description="Create and manage professional invoices for your clients"
              icon={FileText}
              path="/tools/invoicing"
              badge="Popular"
            />
            
            <ToolCard
              title="Expense Tracker"
              description="Track your business expenses and generate reports"
              icon={Receipt}
              path="/tools/expenses"
            />
            
            <ToolCard
              title="Contract Creator"
              description="Create professional contracts for your freelance work"
              icon={PenLine}
              path="/tools/contracts"
              badge="New"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="time" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              title="Time Tracking"
              description="Track your working hours and monitor your productivity"
              icon={Clock}
              path="/tools/time-tracking"
            />
            
            <ToolCard
              title="Schedule Planner"
              description="Plan your weekly schedule and manage your availability"
              icon={Calendar}
              path="/tools/schedule-planner"
            />
            
            <ToolCard
              title="Pomodoro Timer"
              description="Boost productivity with timed work sessions and breaks"
              icon={Timer}
              path="/tools/pomodoro"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="project" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              title="Project Management"
              description="Organize your projects with tasks, milestones, and deadlines"
              icon={ClipboardList}
              path="/tools/project-management"
            />
            
            <ToolCard
              title="Client Portal"
              description="Share progress and files with clients in a professional portal"
              icon={Laptop}
              path="/tools/client-portal"
            />
            
            <ToolCard
              title="Analytics Dashboard"
              description="View insights about your earnings, time spent, and productivity"
              icon={BarChart3}
              path="/tools/analytics"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Featured Tool */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Featured Tool</h2>
      </div>
      
      <Card className="bg-gradient-to-r from-gigstr-purple/10 to-gigstr-blue/5 border-gigstr-purple/20 mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Invoicing System</CardTitle>
              <CardDescription className="text-base mt-2">
                Create professional invoices, track payments, and manage your finances all in one place.
              </CardDescription>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <FileText className="h-8 w-8 text-gigstr-purple" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Easy Invoice Creation</h3>
              <p className="text-sm text-gray-600">Create professional invoices with our templates in minutes</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Payment Tracking</h3>
              <p className="text-sm text-gray-600">Track your pending and received payments effortlessly</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">Tax Management</h3>
              <p className="text-sm text-gray-600">Automatically calculate taxes and prepare for tax season</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto" onClick={() => showComingSoon()}>
            Try Invoicing Tool
          </Button>
        </CardFooter>
      </Card>
      
      {/* Recently Used Tools */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Recently Used Tools</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Clock className="h-5 w-5 text-gigstr-purple mb-2" />
            <CardTitle className="text-base">Time Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground py-2">
            Last used 2 days ago
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs" onClick={() => showComingSoon()}>
              Resume Tracking
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <FileText className="h-5 w-5 text-gigstr-purple mb-2" />
            <CardTitle className="text-base">Invoice #INV-2023-07</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground py-2">
            Draft saved 4 days ago
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs" onClick={() => showComingSoon()}>
              Continue Editing
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <ClipboardList className="h-5 w-5 text-gigstr-purple mb-2" />
            <CardTitle className="text-base">Project: Website Redesign</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground py-2">
            2 tasks due soon
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs" onClick={() => showComingSoon()}>
              View Project
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Tools;
