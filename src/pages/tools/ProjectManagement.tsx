
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Calendar, CheckCircle, AlertCircle, ClipboardList, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/PageHeader';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('active');
  const [projectDeadline, setProjectDeadline] = useState<Date | undefined>(undefined);
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const [taskProject, setTaskProject] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTasks();
    }
  }, [user]);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects. ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name)
        `)
        .order('due_date', { ascending: true });
        
      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateProject = async () => {
    if (!projectName) {
      toast({
        title: 'Missing Fields',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newProject = {
        user_id: user?.id,
        name: projectName,
        description: projectDescription || null,
        status: projectStatus,
        deadline: projectDeadline ? projectDeadline.toISOString() : null,
      };
      
      const { error } = await supabase
        .from('projects')
        .insert([newProject]);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Project created successfully!',
      });
      
      resetProjectForm();
      setOpenDialog(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create project. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateProject = async () => {
    if (!projectName || !currentProject) {
      toast({
        title: 'Missing Fields',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const updatedProject = {
        name: projectName,
        description: projectDescription || null,
        status: projectStatus,
        deadline: projectDeadline ? projectDeadline.toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', currentProject.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Project updated successfully!',
      });
      
      resetProjectForm();
      setOpenDialog(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update project. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', currentProject.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Project deleted successfully!',
      });
      
      setOpenDeleteDialog(false);
      fetchProjects();
      fetchTasks(); // Refresh tasks as some might be linked to the deleted project
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete project. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleCreateTask = async () => {
    if (!taskTitle || !taskProject) {
      toast({
        title: 'Missing Fields',
        description: 'Task title and project are required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newTask = {
        project_id: taskProject,
        title: taskTitle,
        description: taskDescription || null,
        status: taskStatus,
        due_date: taskDueDate ? taskDueDate.toISOString() : null,
      };
      
      const { error } = await supabase
        .from('tasks')
        .insert([newTask]);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task created successfully!',
      });
      
      resetTaskForm();
      setOpenTaskDialog(false);
      fetchTasks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create task. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateTask = async () => {
    if (!taskTitle || !currentTask) {
      toast({
        title: 'Missing Fields',
        description: 'Task title is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const updatedTask = {
        title: taskTitle,
        description: taskDescription || null,
        status: taskStatus,
        project_id: taskProject,
        due_date: taskDueDate ? taskDueDate.toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(updatedTask)
        .eq('id', currentTask.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      });
      
      resetTaskForm();
      setOpenTaskDialog(false);
      fetchTasks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update task. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteTask = async () => {
    if (!currentTask) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', currentTask.id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Task deleted successfully!',
      });
      
      setOpenDeleteTaskDialog(false);
      fetchTasks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete task. ' + error.message,
        variant: 'destructive',
      });
    }
  };
  
  const resetProjectForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectStatus('active');
    setProjectDeadline(undefined);
    setCurrentProject(null);
  };
  
  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('todo');
    setTaskDueDate(undefined);
    setTaskProject(undefined);
    setCurrentTask(null);
  };
  
  const editProject = (project: Project) => {
    setCurrentProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setProjectStatus(project.status);
    setProjectDeadline(project.deadline ? new Date(project.deadline) : undefined);
    setOpenDialog(true);
  };
  
  const editTask = (task: Task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskStatus(task.status);
    setTaskDueDate(task.due_date ? new Date(task.due_date) : undefined);
    setTaskProject(task.project_id);
    setOpenTaskDialog(true);
  };
  
  const confirmDeleteProject = (project: Project) => {
    setCurrentProject(project);
    setOpenDeleteDialog(true);
  };
  
  const confirmDeleteTask = (task: Task) => {
    setCurrentTask(task);
    setOpenDeleteTaskDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'on-hold':
        return <Badge className="bg-yellow-500">On Hold</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" className="border-gray-400 text-gray-700">To Do</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'done':
        return <Badge className="bg-green-500">Done</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Blocked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Function to check if a date is today
  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Group tasks by project
  const tasksByProject = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.project_id]) {
      acc[task.project_id] = [];
    }
    acc[task.project_id].push(task);
    return acc;
  }, {});
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
            <p className="mb-4">You need to sign in to manage your projects.</p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Project Management"
        description="Organize your projects with tasks, milestones, and deadlines"
      >
        <div className="flex gap-2">
          <Button onClick={() => {
            resetProjectForm();
            setOpenDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
          <Button variant="outline" onClick={() => {
            resetTaskForm();
            setOpenTaskDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </PageHeader>
      
      <Tabs defaultValue="projects" className="mt-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="mt-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gigstr-purple mx-auto"></div>
              <p className="mt-4">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
              <p className="text-gray-500">Create your first project to get started.</p>
              <Button className="mt-4" onClick={() => {
                resetProjectForm();
                setOpenDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {getStatusBadge(project.status)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => editProject(project)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeleteProject(project)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2">{project.description || 'No description'}</p>
                    {project.deadline && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Tasks</h4>
                      {tasksByProject[project.id] && tasksByProject[project.id].length > 0 ? (
                        <ul className="space-y-1">
                          {tasksByProject[project.id].slice(0, 3).map(task => (
                            <li key={task.id} className="text-sm flex items-center justify-between">
                              <span className="truncate">{task.title}</span>
                              {getTaskStatusBadge(task.status)}
                            </li>
                          ))}
                          {tasksByProject[project.id].length > 3 && (
                            <li className="text-sm text-gray-500">
                              +{tasksByProject[project.id].length - 3} more tasks
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No tasks</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                      setTaskProject(project.id);
                      resetTaskForm();
                      setOpenTaskDialog(true);
                    }}>
                      Add Task
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gigstr-purple mx-auto"></div>
              <p className="mt-4">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No tasks yet</h3>
              <p className="text-gray-500">Create your first task to get started.</p>
              <Button className="mt-4" onClick={() => {
                resetTaskForm();
                setOpenTaskDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        {/* @ts-ignore - We know projects exists on the task due to our query */}
                        {task.projects?.name || 'Unknown project'}
                      </TableCell>
                      <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        {task.due_date ? (
                          <span className={isToday(task.due_date) ? 'text-orange-500 font-medium' : ''}>
                            {format(new Date(task.due_date), 'MMM dd, yyyy')}
                          </span>
                        ) : (
                          'No due date'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => editTask(task)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeleteTask(task)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Upcoming Deadlines</h3>
              {tasks.filter(task => task.due_date).length === 0 && projects.filter(project => project.deadline).length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No upcoming deadlines</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Project deadlines */}
                  {projects.filter(project => project.deadline).map(project => (
                    <div key={project.id} className="flex justify-between items-center p-3 rounded-md border">
                      <div>
                        <div className="flex items-center">
                          <Badge className="bg-purple-500 mr-2">Project</Badge>
                          <h4 className="font-medium">{project.name}</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {project.deadline ? format(new Date(project.deadline), 'MMMM dd, yyyy') : 'No deadline'}
                        </p>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  ))}
                  
                  {/* Task deadlines */}
                  {tasks.filter(task => task.due_date).map(task => (
                    <div key={task.id} className="flex justify-between items-center p-3 rounded-md border">
                      <div>
                        <div className="flex items-center">
                          <Badge className="bg-blue-500 mr-2">Task</Badge>
                          <h4 className="font-medium">{task.title}</h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {task.due_date ? format(new Date(task.due_date), 'MMMM dd, yyyy') : 'No deadline'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {/* @ts-ignore - We know projects exists on the task due to our query */}
                          Project: {task.projects?.name || 'Unknown project'}
                        </p>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Project Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              {currentProject ? 'Update your project details.' : 'Add a new project to your workspace.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={projectStatus}
                onValueChange={setProjectStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {projectDeadline ? format(projectDeadline, "PPP") : "Select deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={projectDeadline}
                      onSelect={setProjectDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetProjectForm();
              setOpenDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={currentProject ? handleUpdateProject : handleCreateProject}>
              {currentProject ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Task Dialog */}
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {currentTask ? 'Update your task details.' : 'Add a new task to your project.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectId" className="text-right">
                Project
              </Label>
              <Select
                value={taskProject}
                onValueChange={setTaskProject}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskStatus" className="text-right">
                Status
              </Label>
              <Select
                value={taskStatus}
                onValueChange={setTaskStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {taskDueDate ? format(taskDueDate, "PPP") : "Select due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={taskDueDate}
                      onSelect={setTaskDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetTaskForm();
              setOpenTaskDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={currentTask ? handleUpdateTask : handleCreateTask}>
              {currentTask ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Project Confirmation */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{currentProject?.name}" and all associated tasks.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Task Confirmation */}
      <AlertDialog open={openDeleteTaskDialog} onOpenChange={setOpenDeleteTaskDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{currentTask?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectManagement;
