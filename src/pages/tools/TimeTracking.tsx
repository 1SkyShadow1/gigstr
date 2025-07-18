
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Clock, Play, Square, Edit, Trash2, Plus } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TimeTracking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProject, setCurrentProject] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  
  const form = useForm({
    defaultValues: {
      project: '',
      description: '',
      startTime: '',
      endTime: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchEntries();
  }, [user, navigate]);

  // Timer effect for tracking
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (isTracking && trackingStartTime) {
      timerId = setInterval(() => {
        const seconds = differenceInSeconds(new Date(), trackingStartTime);
        setElapsedTime(seconds);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTracking, trackingStartTime]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching time entries:", error);
      toast({
        title: "Error",
        description: "Failed to load time entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    if (!currentProject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }
    
    setIsTracking(true);
    setTrackingStartTime(new Date());
    setElapsedTime(0);
    
    toast({
      title: "Time tracking started",
      description: `Now tracking time for ${currentProject}`,
    });
  };

  const stopTracking = async () => {
    if (!isTracking || !trackingStartTime) return;
    
    try {
      const endTime = new Date();
      const duration = differenceInSeconds(endTime, trackingStartTime);
      
      const entryData = {
        user_id: user!.id,
        project: currentProject,
        description: currentDescription || null,
        start_time: trackingStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration
      };
      
      const { error } = await supabase
        .from('time_entries')
        .insert([entryData]);
      
      if (error) throw error;
      
      setIsTracking(false);
      setTrackingStartTime(null);
      setElapsedTime(0);
      setCurrentProject('');
      setCurrentDescription('');
      
      toast({
        title: "Time entry saved",
        description: `Tracked ${formatDuration(duration)} for ${currentProject}`,
      });
      
      fetchEntries();
    } catch (error: any) {
      console.error("Error saving time entry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save time entry",
        variant: "destructive",
      });
    }
  };

  const openNewEntryDialog = () => {
    setCurrentEntry(null);
    
    const now = new Date();
    const formattedDate = format(now, "yyyy-MM-dd");
    const formattedTime = format(now, "HH:mm");
    
    form.reset({
      project: '',
      description: '',
      startTime: `${formattedDate}T${formattedTime}`,
      endTime: `${formattedDate}T${formattedTime}`
    });
    
    setIsDialogOpen(true);
  };

  const openEditEntryDialog = (entry: any) => {
    setCurrentEntry(entry);
    
    const startDateTime = new Date(entry.start_time);
    const formattedStartDate = format(startDateTime, "yyyy-MM-dd");
    const formattedStartTime = format(startDateTime, "HH:mm");
    
    let formattedEndDate = '';
    let formattedEndTime = '';
    
    if (entry.end_time) {
      const endDateTime = new Date(entry.end_time);
      formattedEndDate = format(endDateTime, "yyyy-MM-dd");
      formattedEndTime = format(endDateTime, "HH:mm");
    }
    
    form.reset({
      project: entry.project,
      description: entry.description || '',
      startTime: `${formattedStartDate}T${formattedStartTime}`,
      endTime: entry.end_time ? `${formattedEndDate}T${formattedEndTime}` : ''
    });
    
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: any) => {
    try {
      const startTime = new Date(values.startTime).toISOString();
      const endTime = values.endTime ? new Date(values.endTime).toISOString() : null;
      const duration = endTime ? differenceInSeconds(new Date(endTime), new Date(startTime)) : null;
      
      const entryData = {
        user_id: user!.id,
        project: values.project,
        description: values.description || null,
        start_time: startTime,
        end_time: endTime,
        duration
      };
      
      let result;
      if (currentEntry) {
        // Update existing entry
        result = await supabase
          .from('time_entries')
          .update(entryData)
          .eq('id', currentEntry.id);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Time entry updated successfully",
        });
      } else {
        // Create new entry
        result = await supabase
          .from('time_entries')
          .insert([entryData]);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Time entry created successfully",
        });
      }
      
      setIsDialogOpen(false);
      fetchEntries();
    } catch (error: any) {
      console.error("Error saving time entry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save time entry",
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Time entry deleted successfully",
      });
      
      fetchEntries();
    } catch (error: any) {
      console.error("Error deleting time entry:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete time entry",
        variant: "destructive",
      });
    }
  };

  // Group entries by date for display
  const groupedEntries: { [key: string]: any[] } = {};
  entries.forEach(entry => {
    const date = format(new Date(entry.start_time), 'yyyy-MM-dd');
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }
    groupedEntries[date].push(entry);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Time Tracking" 
        description="Track your working hours and monitor your productivity"
      >
        <Button onClick={openNewEntryDialog} className="ml-auto flex items-center gap-2">
          <Plus size={16} />
          Add Entry
        </Button>
      </PageHeader>
      
      {/* Current tracking session */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Current Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <Input 
                placeholder="Project name"
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                disabled={isTracking}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <Input 
                placeholder="What are you working on?"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                disabled={isTracking}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-mono tabular-nums">
                {formatDuration(elapsedTime)}
              </div>
              {!isTracking ? (
                <Button 
                  onClick={startTracking} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!currentProject.trim()}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button 
                  onClick={stopTracking} 
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Time entries */}
      {loading ? (
        <div className="flex justify-center my-8">Loading time entries...</div>
      ) : entries.length > 0 ? (
        <div className="space-y-6">
          {Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((date) => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead className="hidden md:table-cell">End Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedEntries[date].map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.project}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {entry.description || "-"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(entry.start_time), 'h:mm a')}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {entry.end_time 
                            ? format(new Date(entry.end_time), 'h:mm a') 
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          {entry.duration 
                            ? formatDuration(entry.duration) 
                            : "-"
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Edit Entry"
                              onClick={() => openEditEntryDialog(entry)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Delete Entry"
                              onClick={() => deleteEntry(entry.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-gray-50">
          <Clock className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Time Entries Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't tracked any time yet. Start tracking your work hours or add entries manually.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => {
              setCurrentProject('My First Project');
              setCurrentDescription('');
              document.getElementById('project-input')?.focus();
            }}>
              <Play className="mr-2 h-4 w-4" />
              Start Tracking
            </Button>
            <Button variant="outline" onClick={openNewEntryDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Manually
            </Button>
          </div>
        </div>
      )}

      {/* Entry Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentEntry ? 'Edit Time Entry' : 'Add Time Entry'}
            </DialogTitle>
          </DialogHeader>
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the work done"
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentEntry ? 'Update Entry' : 'Add Entry'}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeTracking;
