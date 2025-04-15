
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Info, 
  Repeat, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { format, parseISO, isSameDay, addDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

const SchedulePlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentSchedule, setCurrentSchedule] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      recurrence: 'none'
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchSchedules();
  }, [user, navigate]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      setSchedules(data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewScheduleDialog = () => {
    setCurrentSchedule(null);
    
    const now = new Date();
    const formattedDate = format(selectedDate || now, "yyyy-MM-dd");
    const formattedTime = format(now, "HH:mm");
    
    form.reset({
      title: '',
      description: '',
      startDate: formattedDate,
      startTime: formattedTime,
      endDate: formattedDate,
      endTime: format(addDays(now, 1), "HH:mm"),
      recurrence: 'none'
    });
    
    setIsDialogOpen(true);
  };

  const openEditScheduleDialog = (schedule: any) => {
    setCurrentSchedule(schedule);
    
    const startDateTime = new Date(schedule.start_time);
    const endDateTime = new Date(schedule.end_time);
    
    form.reset({
      title: schedule.title,
      description: schedule.description || '',
      startDate: format(startDateTime, "yyyy-MM-dd"),
      startTime: format(startDateTime, "HH:mm"),
      endDate: format(endDateTime, "yyyy-MM-dd"),
      endTime: format(endDateTime, "HH:mm"),
      recurrence: schedule.recurrence || 'none'
    });
    
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: any) => {
    try {
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);
      
      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        toast({
          title: "Invalid Time Range",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
      
      const scheduleData = {
        user_id: user!.id,
        title: values.title,
        description: values.description || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        recurrence: values.recurrence === 'none' ? null : values.recurrence
      };
      
      let result;
      if (currentSchedule) {
        // Update existing schedule
        result = await supabase
          .from('schedules')
          .update(scheduleData)
          .eq('id', currentSchedule.id);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        });
      } else {
        // Create new schedule
        result = await supabase
          .from('schedules')
          .insert([scheduleData]);
          
        if (result.error) throw result.error;
        
        toast({
          title: "Success",
          description: "Schedule created successfully",
        });
      }
      
      setIsDialogOpen(false);
      fetchSchedules();
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save schedule",
        variant: "destructive",
      });
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
      
      fetchSchedules();
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete schedule",
        variant: "destructive",
      });
    }
  };

  const getEventsForSelectedDate = () => {
    return schedules.filter(schedule => {
      const startDate = new Date(schedule.start_time);
      return isSameDay(startDate, selectedDate);
    });
  };

  const hasEventsOnDate = (date: Date) => {
    return schedules.some(schedule => {
      const startDate = new Date(schedule.start_time);
      return isSameDay(startDate, date);
    });
  };

  const getRecurrenceText = (recurrence: string | null) => {
    if (!recurrence) return null;
    
    switch (recurrence) {
      case 'daily': return 'Repeats daily';
      case 'weekly': return 'Repeats weekly';
      case 'monthly': return 'Repeats monthly';
      case 'yearly': return 'Repeats yearly';
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Schedule Planner" 
        description="Plan your weekly schedule and manage your availability"
      >
        <Button onClick={openNewScheduleDialog} className="flex items-center gap-2">
          <Plus size={16} />
          Add Event
        </Button>
      </PageHeader>

      {loading ? (
        <div className="flex justify-center my-8">Loading schedule...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-8">
          <div>
            <Card className="border shadow">
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md"
                  modifiers={{
                    hasEvent: (date) => hasEventsOnDate(date),
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      fontWeight: "bold",
                      backgroundColor: "rgba(124, 58, 237, 0.1)", 
                      color: "#7c3aed"
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedDate(new Date())}
                size="sm"
              >
                Today
              </Button>
            </div>
            
            <div className="space-y-4">
              {getEventsForSelectedDate().length > 0 ? (
                getEventsForSelectedDate().map((event) => (
                  <Card key={event.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{event.title}</h3>
                          
                          <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}</span>
                            </div>
                            
                            {event.recurrence && (
                              <div className="flex items-center gap-1">
                                <Repeat className="h-4 w-4" />
                                <span>{getRecurrenceText(event.recurrence)}</span>
                              </div>
                            )}
                          </div>
                          
                          {event.description && (
                            <div className="flex items-start gap-1 text-sm text-gray-600 mt-3">
                              <Info className="h-4 w-4 mt-0.5" />
                              <p>{event.description}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Edit Event"
                            onClick={() => openEditScheduleDialog(event)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete Event"
                            onClick={() => deleteSchedule(event.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Events</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    You don't have any events scheduled for this day.
                  </p>
                  <Button onClick={openNewScheduleDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentSchedule ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
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
                        placeholder="Event description"
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeats</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Does not repeat</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentSchedule ? 'Update Event' : 'Add Event'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePlanner;
