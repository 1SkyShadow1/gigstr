
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { ClipboardList, Plus, Calendar, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const projectForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      deadline: ''
    }
  });

  const taskForm = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      projectId: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProjects();
  }, [user, navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      
      // For each project, fetch its tasks
      const projectsWithTasks = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', project.id)
            .order('created_at', { ascending: true });
          
          if (tasksError) throw tasksError;
          
          return {
            ...project,
            tasks: tasksData || []
          };
        })
      );
      
      setProjects(projectsWithTasks);
      if (projectsWithTasks.length > 0 && !selectedProject) {
        setSelectedProject(projectsWithTasks[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewProjectDialog = () => {
    setCurrentProject(null);
    projectForm.reset({
      name: '',
      description: '',
      deadline: ''
    });
    setIsProjectDialogOpen(true);
  };

  const openEditProjectDialog = (project: any) => {
    setCurrentProject(project);
    
    const deadlineValue = project.deadline 
      ? format(new Date(project.deadline), 'yyyy-MM-dd') 
      : '';
    
    projectForm.reset({
      name: project.name,
      description: project.description || '',
      deadline: deadlineValue
    });
    
    setIsProjectDialogOpen(true);
  };

  const openNewTaskDialog = (projectId: string) => {
    taskForm.reset({
      title: '',
      description: '',
      dueDate: '',
      projectId
    });
    setIsTaskDialogOpen(true);
  };

  const onProjectSubmit = async (values: any) => {
    try {
      const projectData = {
        user_id: user!.id,
        name: values.name,
        description: values.description || null,
        deadline: values.deadline || null,
        status: 'active'
      };
      
      let result;
      if (currentProject) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        // Create new project
        result = await supabase
          .from('projects')
          .insert([projectData]);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      
      setIsProjectDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const onTaskSubmit = async (values: any) => {
    try {
      const taskData = {
        project_id: values.projectId,
        title: values.title,
        description: values.description || null,
        due_date: values.dueDate || null,
        status: 'todo'
      };
      
      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      
      setIsTaskDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update the local state to reflect the change
      setProjects(projects.map(project => ({
        ...project,
        tasks: project.tasks.map((task: any) => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      })));
      
      // Also update the selected project if needed
      if (selectedProject) {
        setSelectedProject({
          ...selectedProject,
          tasks: selectedProject.tasks.map((task: any) => 
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        });
      }
      
      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch (error: any) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getProjectProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTaskStatusElement = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="text-green-500" size={18} />;
      case 'in_progress':
        return <Circle className="text-blue-500" size={18} />;
      case 'todo':
      default:
        return <Circle className="text-gray-400" size={18} />;
    }
  };

  const getTaskDueDateElement = (dueDate: string | null) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const isPastDue = isPast(date) && !isToday(date);
    const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    return (
      <div className={`text-xs flex items-center ${isPastDue ? 'text-red-500' : isToday ? 'text-orange-500' : 'text-gray-500'}`}>
        <Calendar size={12} className="mr-1" />
        {format(date, 'MMM d')}
        {isPastDue && <AlertCircle className="ml-1" size={12} />}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Project Management" 
        description="Organize your projects with tasks, milestones, and deadlines"
      >
        <Button onClick={openNewProjectDialog} className="flex items-center gap-2">
          <Plus size={16} />
          New Project
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center my-8">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
          {/* Project list sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Your Projects</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-1 pr-3">
                    {projects.map(project => (
                      <div 
                        key={project.id} 
                        className={`px-3 py-2 rounded-md cursor-pointer ${selectedProject?.id === project.id ? 'bg-gigstr-purple text-white' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs flex justify-between mt-1">
                          <span className={selectedProject?.id === project.id ? 'text-white/80' : 'text-gray-500'}>
                            {project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}
                          </span>
                          <span className={selectedProject?.id === project.id ? 'text-white/80' : 'text-gray-500'}>
                            {getProjectProgress(project.tasks)}% done
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Project details */}
          {selectedProject && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedProject.name}</CardTitle>
                      {selectedProject.description && (
                        <CardDescription className="mt-2">
                          {selectedProject.description}
                        </CardDescription>
                      )}
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => openEditProjectDialog(selectedProject)}
                    >
                      Edit Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">
                          {getProjectProgress(selectedProject.tasks)}%
                        </span>
                      </div>
                      <Progress value={getProjectProgress(selectedProject.tasks)} />
                    </div>
                    
                    {selectedProject.deadline && (
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>
                          {format(new Date(selectedProject.deadline), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Tasks */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Tasks</CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => openNewTaskDialog(selectedProject.id)}
                    >
                      <Plus size={14} className="mr-1" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedProject.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {selectedProject.tasks.map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                        >
                          <div 
                            className="cursor-pointer mr-2"
                            onClick={() => {
                              const newStatus = task.status === 'todo' 
                                ? 'in_progress' 
                                : task.status === 'in_progress' 
                                ? 'done' 
                                : 'todo';
                              updateTaskStatus(task.id, newStatus);
                            }}
                          >
                            {getTaskStatusElement(task.status)}
                          </div>
                          
                          <div className="flex-grow">
                            <div className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            {task.due_date && getTaskDueDateElement(task.due_date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No tasks yet. Add your first task to get started!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50">
          <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't created any projects yet. Start organizing your work by creating your first project.
          </p>
          <Button onClick={openNewProjectDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Project
          </Button>
        </div>
      )}

      {/* Project Form Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-6 pt-4">
              <FormField
                control={projectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Project description"
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentProject ? 'Update Project' : 'Create Project'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Task Form Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <Form {...taskForm}>
            <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-6 pt-4">
              <input type="hidden" {...taskForm.register('projectId')} />
              
              <FormField
                control={taskForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={taskForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Task description"
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={taskForm.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Task
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
