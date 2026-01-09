import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, Link, Plus, Video, User, Briefcase, Settings, Copy } from 'lucide-react';
import { format } from 'date-fns';

const SyncUp = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    // New Meeting Form
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [duration, setDuration] = useState('30');
    const [platform, setPlatform] = useState('Google Meet');

    useEffect(() => {
        if (user) fetchMeetings();
    }, [user]);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('scheduler_meetings')
                .select('*')
                .gte('start_time', new Date().toISOString())
                .order('start_time', { ascending: true });
                
            if (error) {
                // If table doesn't exist yet, just ignore for now (user might not have run SQL)
                if (error.code === '42P01') {
                    console.log("Table not found yet");
                    return;
                }
                throw error;
            }
            setMeetings(data || []);
        } catch (error: any) {
            console.error("Error fetching meetings:", error);
         } finally {
            setLoading(false);
        }
    };

    const handleCreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsCreating(true);
            if (!date || !meetingTime) { 
                toast({ title: "Incomplete", description: "Please select a date and time", variant: "destructive" }); 
                return;
            }

            // Construct timestamp
            const [hours, minutes] = meetingTime.split(':');
            const startDateTime = new Date(date);
            startDateTime.setHours(parseInt(hours), parseInt(minutes));
            
            const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60000);

            const { error } = await supabase.from('scheduler_meetings').insert({
                user_id: user?.id,
                client_name: clientName,
                client_email: clientEmail,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                meeting_link: "https://meet.google.com/new", // Creating a mock placeholder link
                status: 'scheduled'
            });

            if (error) throw error;
            
            toast({ title: "Meeting Scheduled", description: `Meeting with ${clientName} created.` });
            setClientName('');
            setClientEmail('');
            setMeetingTime('');
            fetchMeetings();
        } catch (error: any) {
             toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AnimatedPage>
             <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                            Sync Up
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            Effortless meeting scheduling & availability management.
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2 hidden md:flex" onClick={() => toast({ title: "Copied!", description: "Your booking link has been copied." })}>
                        <Copy className="h-4 w-4" /> Copy Booking Link
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Calendar & Availability */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg shadow-blue-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" /> Calendar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border shadow-sm p-4 w-full"
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-blue-50 to-white">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-blue-900">Quick Availability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-blue-800">Allow instant bookings</Label>
                                    <Switch />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Label className="text-blue-800">Buffer time (15m)</Label>
                                    <Switch defaultChecked />
                                </div>
                                <Button variant="secondary" className="w-full text-blue-700 bg-blue-100 hover:bg-blue-200">
                                    <Settings className="mr-2 h-4 w-4" /> Configure Weekly Schedule
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Upcoming & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                         <Card className="border-0 shadow-xl shadow-slate-200/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl">Upcoming Meetings</CardTitle>
                                    <CardDescription>You have {meetings.length} meetings scheduled.</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                                            <Plus className="mr-2 h-4 w-4" /> Schedule New
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Schedule Meeting</DialogTitle>
                                            <DialogDescription>Manually add a meeting to your calendar.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateMeeting} className="space-y-4 pt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Client Name</Label>
                                                    <Input placeholder="John Doe" value={clientName} onChange={e => setClientName(e.target.value)} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Client Email</Label>
                                                    <Input type="email" placeholder="john@example.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Date</Label>
                                                    <div className="border rounded-md p-2 text-sm bg-gray-50">{date ? format(date, 'PPP') : 'Select on calendar'}</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time</Label>
                                                    <Input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Duration (minutes)</Label>
                                                 <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={isCreating}>{isCreating ? "Scheduling..." : "Confirm Booking"}</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {meetings.length === 0 ? (
                                        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-100">
                                            <div className="bg-blue-50 p-3 rounded-full inline-flex mb-3">
                                                <Clock className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <h3 className="text-slate-900 font-medium">No meetings found</h3>
                                            <p className="text-slate-500 text-sm">Your schedule is clear for now.</p>
                                        </div>
                                    ) : (
                                        meetings.map((meeting) => (
                                            <div key={meeting.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-50 p-3 rounded-lg text-center min-w-[60px]">
                                                        <span className="block text-xs font-bold text-blue-600 uppercase">
                                                            {format(new Date(meeting.start_time), 'MMM')}
                                                        </span>
                                                        <span className="block text-xl font-extrabold text-slate-700">
                                                            {format(new Date(meeting.start_time), 'd')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                            {meeting.client_name}
                                                            {meeting.status === 'scheduled' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[10px] px-2">Confirmed</Badge>}
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(meeting.start_time), 'h:mm a')}</span>
                                                            <span className="flex items-center gap-1"><Video className="h-3 w-3" /> Google Meet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                     <Button variant="outline" size="sm" asChild>
                                                        <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer">Join</a>
                                                     </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                         </Card>

                         <Card className="border-0 bg-slate-900 text-white shadow-2xl">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Connect Your Calendar</h3>
                                    <p className="text-slate-400 mb-0">Sync with Google or Outlook to avoid double bookings.</p>
                                </div>
                                <Button className="bg-white text-slate-900 hover:bg-blue-50">Connect Now</Button>
                            </CardContent>
                         </Card>
                    </div>
                </div>
             </div>
        </AnimatedPage>
    );
};

export default SyncUp;
