import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AnimatedPage from '@/components/AnimatedPage';

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  deadline: string | null;
  created_at: string;
  user_id: string;
};

type Task = {
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    due_date: string | null;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
};

const ProjectManagement = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    // Form State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('todo');

    const fetchProjects = useCallback(async () => {
        if (!user) return [] as Project[];
        try {
            setLoadingProjects(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            const projectsData = data || [];
            setProjects(projectsData);
            return projectsData;
        } catch (err: any) {
            toast({ title: 'Could not load projects', description: err.message, variant: 'destructive' });
            setProjects([]);
            return [] as Project[];
        } finally {
            setLoadingProjects(false);
        }
    }, [user, toast]);

    const fetchTasks = useCallback(async (projectIds?: string[]) => {
        if (!user) return;
        const ids = (projectIds ?? projects.map(p => p.id)).filter(Boolean);
        if (ids.length === 0) {
            setTasks([]);
            return;
        }
        try {
            setLoadingTasks(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .in('project_id', ids)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setTasks((data as Task[]) || []);
        } catch (err: any) {
            toast({ title: 'Could not load tasks', description: err.message, variant: 'destructive' });
            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    }, [user, toast, projects]);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const projectsData = await fetchProjects();
            await fetchTasks(projectsData.map(p => p.id));
        })();
    }, [user, fetchProjects, fetchTasks]);

    const filteredTasks = tasks.filter(t => {
        const matchesProject = selectedProjectId === 'all' || t.project_id === selectedProjectId;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesProject && matchesSearch;
    });

    const getTasksByStatus = (status: Task['status']) => filteredTasks.filter(t => t.status === status);

    const handleCreateTask = () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Login required', description: 'Please sign in to add tasks.' });
            return;
        }
        const projectId = selectedProjectId === 'all' ? projects[0]?.id : selectedProjectId;
        if (!projectId) {
            toast({ variant: 'destructive', title: 'Add a project first', description: 'Create a project before adding tasks.' });
            return;
        }
        if (!newTaskTitle) {
            toast({ variant: 'destructive', title: 'Title required', description: 'Give the task a name.' });
            return;
        }
        const payload = {
            project_id: projectId,
            title: newTaskTitle,
            description: '',
            status: newTaskStatus as Task['status'],
            due_date: new Date().toISOString(),
        };
        supabase.from('tasks').insert({
            ...payload,
            // Task ownership is enforced via project_id and RLS on projects
        }).then(({ error }) => {
            if (error) {
                toast({ title: 'Could not create task', description: error.message, variant: 'destructive' });
                return;
            }
            setIsTaskModalOpen(false);
            setNewTaskTitle('');
            toast({ title: "Task Created", description: "Added to your board." });
            fetchTasks();
        });
    };

    const StatusColumn = ({ title, status, color }: { title: string, status: Task['status'], color: string }) => {
        const columnTasks = getTasksByStatus(status);
        
        return (
            <div className="flex flex-col h-full min-w-[300px] w-full max-w-sm rounded-xl bg-gray-50/50 border border-gray-100">
                <div className={`p-4 border-b border-gray-100 flex items-center justify-between ${color} bg-opacity-5`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${color.replace('bg-', 'bg-').replace('/10', '')}`} />
                        <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
                        <Badge variant="secondary" className="bg-white text-gray-500 text-xs shadow-sm ml-2">
                            {columnTasks.length}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                        setNewTaskStatus(status);
                        setIsTaskModalOpen(true);
                    }}>
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
                
                <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                        {columnTasks.map(task => (
                            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 shadow-sm bg-white">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border-0 ${
                                            task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {task.priority}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger><MoreHorizontal className="w-4 h-4 text-gray-400" /></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => {
                                                    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'done' } : t));
                                                }}>Move to Done</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h4 className="font-medium text-sm text-gray-900 mb-1 leading-snug">{task.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <span className="truncate max-w-[100px]">{projects.find(p => p.id === task.project_id)?.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                        <div className="flex -space-x-2">
                                             <Avatar className="w-6 h-6 border-2 border-white">
                                                <AvatarFallback className="text-[9px] bg-indigo-100 text-indigo-600">JD</AvatarFallback>
                                             </Avatar>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM d') : ''}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button 
                            variant="ghost" 
                            className="w-full text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-white"
                            onClick={() => {
                                setNewTaskStatus(status);
                                setIsTaskModalOpen(true);
                            }}
                        >
                            <Plus className="w-3 h-3 mr-1" /> Add Task
                        </Button>
                    </div>
                </ScrollArea>
            </div>
        );
    };

    return (
        <AnimatedPage>
            <div className="h-[calc(100vh-4rem)] flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tight">Project Board</h1>
                        <p className="text-sm text-gray-500">Manage your tasks and deliverables efficiently.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <Button 
                                variant={viewMode === 'board' ? 'white' : 'ghost'} 
                                size="sm" 
                                className={`h-8 ${viewMode === 'board' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                onClick={() => setViewMode('board')}
                            >
                                <LayoutGrid className="w-4 h-4 mr-2" /> Board
                            </Button>
                            <Button 
                                variant={viewMode === 'list' ? 'white' : 'ghost'} 
                                size="sm" 
                                className={`h-8 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <ListIcon className="w-4 h-4 mr-2" /> List
                            </Button>
                        </div>
                        <Button className="bg-indigo-600 shadow-md shadow-indigo-200 hover:bg-indigo-700" onClick={() => setIsTaskModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> New Task
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Search tasks..." 
                            className="pl-9 bg-white border-gray-200" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                         <Button 
                            variant={selectedProjectId === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedProjectId('all')}
                            className="whitespace-nowrap rounded-full"
                        >
                            All Projects
                        </Button>
                         {projects.map(p => (
                             <Button 
                                key={p.id}
                                variant={selectedProjectId === p.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedProjectId(p.id)}
                                className="whitespace-nowrap rounded-full"
                             >
                                {p.name}
                             </Button>
                         ))}
                    </div>
                </div>

                {/* Kanban Board */}
                {viewMode === 'board' ? (
                    <div className="flex-1 overflow-x-auto pb-4">
                        {loadingTasks ? (
                            <div className="text-center text-muted-foreground py-8">Loading tasks...</div>
                        ) : (
                        <div className="flex gap-6 h-full min-w-max">
                            <StatusColumn title="To Do" status="todo" color="bg-gray-500" />
                            <StatusColumn title="In Progress" status="in_progress" color="bg-blue-500" />
                            <StatusColumn title="Completed" status="done" color="bg-green-500" />
                        </div>
                        )}
                    </div>
                ) : (
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Task List</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-1">
                                 {loadingTasks && <div className="text-center py-8 text-gray-500">Loading tasks...</div>}
                                 {!loadingTasks && filteredTasks.length === 0 && <div className="text-center py-8 text-gray-500">No tasks found.</div>}
                                 {!loadingTasks && filteredTasks.map(task => (
                                     <div key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-0">
                                         <div className="flex items-center gap-3">
                                             <div onClick={() => {
                                                  setTasks(tasks.map(t => t.id === task.id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
                                             }} className="cursor-pointer">
                                                 {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                             </div>
                                             <div>
                                                 <h4 className={`font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h4>
                                                 <p className="text-xs text-gray-500">{projects.find(p => p.id === task.project_id)?.name}</p>
                                             </div>
                                         </div>
                                         <div className="flex items-center gap-4">
                                              <Badge variant="outline">{task.status.replace('_', ' ')}</Badge>
                                              <div className="text-sm text-gray-500 w-24 text-right">
                                                  {task.due_date ? format(new Date(task.due_date), 'MMM d') : '-'}
                                              </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </CardContent>
                    </Card>
                )}

                <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Task Title</Label>
                                <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="What needs to be done?" />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={newTaskStatus} onValueChange={setNewTaskStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTask}>Create Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AnimatedPage>
    );
};

export default ProjectManagement;
