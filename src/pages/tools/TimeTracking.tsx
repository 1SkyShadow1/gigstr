
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Pause, Calendar, BarChart3, Clock3, MoreVertical, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/tools/PageHeader';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockProjects = [
  { id: 1, name: 'Website Redesign', client: 'Acme Inc.' },
  { id: 2, name: 'Mobile App Development', client: 'TechStart' },
  { id: 3, name: 'Brand Identity', client: 'Design Co' }
];

const TimeTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedProject, setSelectedProject] = useState(mockProjects[0].id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    let intervalId: number;
    
    if (isTracking) {
      intervalId = window.setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isTracking) {
      // Starting timer
      setIsTracking(true);
      toast({
        title: "Time tracking started",
        description: `Now tracking time for: ${mockProjects.find(p => p.id === selectedProject)?.name}`
      });
    } else {
      // Stopping timer
      setIsTracking(false);
      if (seconds > 0) {
        toast({
          title: "Time tracking stopped",
          description: `You worked for ${formatTime(seconds)}`
        });
      }
    }
  };

  const handleAddManualTime = () => {
    toast({
      title: "Time Added",
      description: `Manual time entry added for ${taskName}`
    });
    setIsDialogOpen(false);
    setTaskName('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Time Tracking" 
        description="Track your working hours and monitor your productivity"
        icon={<Clock className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tracker">Time Tracker</TabsTrigger>
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracker" className="mt-6 space-y-6">
          <Card className="relative">
            <CardHeader className="pb-2">
              <CardTitle>Track Your Time</CardTitle>
              <CardDescription>Record time spent on projects and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={selectedProject.toString()} onValueChange={(v) => setSelectedProject(parseInt(v))}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map(project => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="text" 
                    placeholder="What are you working on?" 
                    className="flex-1" 
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 md:flex-none text-xl font-medium tabular-nums">
                      {formatTime(seconds)}
                    </div>
                    
                    <Button
                      variant={isTracking ? "destructive" : "default"}
                      size="icon"
                      onClick={handleStartStop}
                    >
                      {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Today's Activity</h3>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-1 h-3 w-3" /> Add Time
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Manual Time Entry</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="project">Project</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockProjects.map(project => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="task">Task Description</Label>
                          <Input 
                            id="task" 
                            value={taskName} 
                            onChange={(e) => setTaskName(e.target.value)} 
                            placeholder="What did you work on?"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="time">Time (hours)</Label>
                            <Input id="time" type="number" step="0.25" min="0.25" max="24" defaultValue="1" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddManualTime}>Add Entry</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Website Redesign</span>
                      <div className="text-sm text-muted-foreground">UI/UX Design</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2:45:00</div>
                      <div className="text-sm text-muted-foreground">10:15 AM - 1:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Mobile App</span>
                      <div className="text-sm text-muted-foreground">Development</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">1:30:00</div>
                      <div className="text-sm text-muted-foreground">2:15 PM - 3:45 PM</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Today's progress</span>
                    <span>4:15 / 8:00</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Clock3 className="h-4 w-4 mr-2" /> Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4:15:00</div>
                <p className="text-muted-foreground text-sm">53% of daily target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18:30:00</div>
                <p className="text-muted-foreground text-sm">46% of weekly target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" /> This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72:15:00</div>
                <p className="text-muted-foreground text-sm">60% of monthly target</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="entries" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Time Entries Coming Soon</h3>
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
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Time Reports Coming Soon</h3>
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
      </Tabs>
    </div>
  );
};

export default TimeTracking;
