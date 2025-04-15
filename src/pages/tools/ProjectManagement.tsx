
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, CheckCircle2, Circle, Clock, AlertCircle, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/tools/PageHeader';

const mockTasks = [
  { 
    id: 1, 
    title: 'Design homepage mockup', 
    status: 'completed', 
    project: 'Website Redesign',
    dueDate: '2023-04-18',
    priority: 'high'
  },
  { 
    id: 2, 
    title: 'Create API documentation', 
    status: 'in-progress', 
    project: 'Mobile App',
    dueDate: '2023-04-20',
    priority: 'medium'
  },
  { 
    id: 3, 
    title: 'Implement user authentication', 
    status: 'to-do', 
    project: 'Mobile App',
    dueDate: '2023-04-25',
    priority: 'high'
  },
  { 
    id: 4, 
    title: 'Write content for about page', 
    status: 'to-do', 
    project: 'Website Redesign',
    dueDate: '2023-04-22',
    priority: 'low'
  },
  { 
    id: 5, 
    title: 'Fix responsive layout issues', 
    status: 'in-progress', 
    project: 'Website Redesign',
    dueDate: '2023-04-19',
    priority: 'medium'
  }
];

const ProjectManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const filteredTasks = mockTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'to-do' && task.status === 'to-do') return true;
    if (activeTab === 'in-progress' && task.status === 'in-progress') return true;
    if (activeTab === 'completed' && task.status === 'completed') return true;
    return false;
  });

  const handleCreateProject = () => {
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully.",
    });
    setIsCreateProjectOpen(false);
  };

  const handleCreateTask = () => {
    toast({
      title: "Task Created",
      description: "Your new task has been added to the project.",
    });
    setIsCreateTaskOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'to-do':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Project Management" 
        description="Organize your projects with tasks, milestones, and deadlines"
        icon={<ClipboardList className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="text" placeholder="Search tasks..." className="pl-8" />
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input id="task-title" placeholder="Enter task title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-project">Project</Label>
                  <Input id="task-project" placeholder="Select project" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-due">Due Date</Label>
                    <Input id="task-due" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Input id="task-priority" placeholder="Set priority" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Input id="task-description" placeholder="Add task description" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to organize your tasks and track progress.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Enter project name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-client">Client</Label>
                  <Input id="project-client" placeholder="Client name (optional)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-start">Start Date</Label>
                    <Input id="project-start" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-end">End Date</Label>
                    <Input id="project-end" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Input id="project-description" placeholder="Project description" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Projects</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-1">
                <li className="px-2 py-1.5 bg-gigstr-purple/10 rounded-md text-gigstr-purple font-medium">
                  All Projects
                </li>
                <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                  Website Redesign
                </li>
                <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                  Mobile App
                </li>
                <li className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                  Brand Identity
                </li>
                <li className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Project
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Tasks</CardTitle>
                <Tabs defaultValue="all" className="w-auto" onValueChange={setActiveTab} value={activeTab}>
                  <TabsList className="grid w-auto grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="to-do">To Do</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="divide-y">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <li key={task.id} className="py-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button className="mt-0.5">
                            {getStatusIcon(task.status)}
                          </button>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center mt-1">
                              <span>{task.project}</span>
                              <span>•</span>
                              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                              <span>{getPriorityBadge(task.priority)}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Task</DropdownMenuItem>
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-muted-foreground">No tasks found matching your filter.</p>
                  </div>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
