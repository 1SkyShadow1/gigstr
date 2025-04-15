
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Plus, Clock, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/tools/PageHeader';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const mockEvents = [
  { id: 1, title: 'Client Meeting - Acme Inc.', start: '09:00', end: '10:30', date: '2025-04-16', type: 'meeting' },
  { id: 2, title: 'Website Design Work', start: '11:00', end: '13:00', date: '2025-04-16', type: 'work' },
  { id: 3, title: 'Team Standup', start: '14:00', end: '14:30', date: '2025-04-16', type: 'meeting' },
  { id: 4, title: 'Mobile App Development', start: '15:00', end: '17:00', date: '2025-04-16', type: 'work' },
  { id: 5, title: 'Project Planning', start: '10:00', end: '11:30', date: '2025-04-17', type: 'meeting' },
];

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const SchedulePlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const startOfCurrentWeek = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handlePreviousWeek = () => setWeekOffset(weekOffset - 1);
  const handleNextWeek = () => setWeekOffset(weekOffset + 1);
  const handleToday = () => setWeekOffset(0);

  const handleAddEvent = () => {
    toast({
      title: "Event Added",
      description: "Your new event has been added to your schedule.",
    });
    setIsAddEventOpen(false);
  };

  // Find events for a specific date and hour
  const getEventsForTimeSlot = (date: string, hour: number) => {
    const formattedHour = hour.toString().padStart(2, '0') + ':00';
    return mockEvents.filter(event => {
      return event.date === date && 
             parseInt(event.start.split(':')[0]) <= hour && 
             parseInt(event.end.split(':')[0]) > hour;
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Schedule Planner" 
        description="Plan your weekly schedule and manage your availability"
        icon={<CalendarIcon className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Calendar</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={date => date && setDate(date)}
                className="rounded-md border"
              />
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  {mockEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="border rounded-md p-2">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.start} - {event.end}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" placeholder="Enter event title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" defaultValue={format(date, 'yyyy-MM-dd')} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="event-start">Start Time</Label>
                        <Input id="event-start" type="time" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="event-end">End Time</Label>
                        <Input id="event-end" type="time" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-description">Description (Optional)</Label>
                      <Input id="event-description" placeholder="Add event description" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <CardTitle className="text-lg">Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Week header */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {weekDays.map((day, index) => (
                      <div key={index} className="text-center p-2">
                        <div className="text-xs text-muted-foreground">
                          {format(day, 'EEE')}
                        </div>
                        <div className={`text-sm font-medium ${
                          format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                            ? 'bg-gigstr-purple text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                            : ''
                        }`}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Time slots */}
                  <div className="relative">
                    {hours.map((hour) => (
                      <div key={hour} className="grid grid-cols-7 gap-1 border-t">
                        {weekDays.map((day, dayIndex) => {
                          const dayStr = format(day, 'yyyy-MM-dd');
                          const events = getEventsForTimeSlot(dayStr, hour);
                          
                          return (
                            <div 
                              key={dayIndex} 
                              className="relative h-14 group hover:bg-gray-50"
                            >
                              {dayIndex === 0 && (
                                <span className="absolute -left-16 top-1/2 -translate-y-1/2 text-xs text-gray-500 w-14 text-right">
                                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                </span>
                              )}
                              
                              {events.length > 0 && (
                                <div 
                                  className={`absolute inset-0.5 rounded-md flex items-center p-1.5 text-xs ${
                                    events[0].type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                                  }`}
                                >
                                  <span className="font-medium truncate">{events[0].title}</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                      <DropdownMenuItem>View Details</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">Delete Event</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlanner;
