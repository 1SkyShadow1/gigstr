
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClipboardList, 
  Clock, 
  Calendar, 
  FileText, 
  BarChart3, 
  Laptop,
  PenLine,
  Receipt,
  Timer
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ToolCard from '@/components/tools/ToolCard';
import RecentToolCard from '@/components/tools/RecentToolCard';
import FeaturedTool from '@/components/tools/FeaturedTool';

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
  
  const invoicingFeatures = [
    {
      title: "Easy Invoice Creation",
      description: "Create professional invoices with our templates in minutes"
    },
    {
      title: "Payment Tracking",
      description: "Track your pending and received payments effortlessly"
    },
    {
      title: "Tax Management",
      description: "Automatically calculate taxes and prepare for tax season"
    }
  ];
  
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
      
      <FeaturedTool
        title="Invoicing System"
        description="Create professional invoices, track payments, and manage your finances all in one place."
        features={invoicingFeatures}
        onClick={() => navigate('/tools/invoicing')}
      />
      
      {/* Recently Used Tools */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Recently Used Tools</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentToolCard 
          icon={Clock} 
          title="Time Tracking" 
          subtitle="Last used 2 days ago"
          onClick={() => navigate('/tools/time-tracking')}
        />
        
        <RecentToolCard 
          icon={FileText} 
          title="Invoice #INV-2023-07" 
          subtitle="Draft saved 4 days ago"
          onClick={() => navigate('/tools/invoicing')}
        />
        
        <RecentToolCard 
          icon={ClipboardList} 
          title="Project: Website Redesign" 
          subtitle="2 tasks due soon"
          onClick={() => navigate('/tools/project-management')}
        />
      </div>
    </div>
  );
};

export default Tools;
