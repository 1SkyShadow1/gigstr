import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Play, Square, Pause, Timer, History, Clock } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';

const FocusTimer = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Timer State
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [description, setDescription] = useState('');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<Date | null>(null);

    // Initial Fetch
    useEffect(() => {
        if (!user) return;
        fetchEntries();
        checkActiveTimer();
        
        return () => {
             if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [user]);

    // Tick Logic
    useEffect(() => {
        if (isTimerRunning && startTimeRef.current) {
            timerRef.current = setInterval(() => {
                const now = new Date();
                const diff = differenceInSeconds(now, startTimeRef.current!);
                setElapsedSeconds(diff);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning]);

    const checkActiveTimer = async () => {
        try {
            const { data, error } = await supabase
                .from('time_entries')
                .select('*')
                .is('end_time', null)
                .order('start_time', { ascending: false })
                .maybeSingle();
            
            if (data) {
                 // Resume timer
                 setActiveEntryId(data.id);
                 setDescription(data.description || '');
                 const start = new Date(data.start_time);
                 startTimeRef.current = start;
                 
                 const now = new Date();
                 setElapsedSeconds(differenceInSeconds(now, start));
                 setIsTimerRunning(true);
            }
        } catch (error) {
            // No active timer found, acceptable
        }
    };

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('time_entries')
                .select('*')
                .not('end_time', 'is', null)
                .order('start_time', { ascending: false })
                .limit(20);

            if (error) throw error;
            setEntries(data || []);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const startTimer = async () => {
        if (!description.trim()) {
            toast({
                title: "Wait!",
                description: "What are you working on? Enter a task name.",
                variant: "destructive"
            });
            return;
        }

        try {
            const startTime = new Date();
            
            const { data, error } = await supabase
                .from('time_entries')
                .insert({
                    user_id: user?.id,
                    description,
                    start_time: startTime.toISOString(),
                })
                .select()
                .single();

            if (error) throw error;

            setActiveEntryId(data.id);
            startTimeRef.current = startTime;
            setElapsedSeconds(0);
            setIsTimerRunning(true);
            
            toast({ title: "Timer started", description: "Go get 'em!" });

        } catch (error: any) {
             toast({
                title: "Error starting timer",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const stopTimer = async () => {
        if (!activeEntryId) return;

        try {
            const endTime = new Date();
            const duration = differenceInSeconds(endTime, startTimeRef.current!);

            const { error } = await supabase
                .from('time_entries')
                .update({
                    end_time: endTime.toISOString(),
                    duration: duration
                })
                .eq('id', activeEntryId);

            if (error) throw error;

            // Reset
            setIsTimerRunning(false);
            setActiveEntryId(null);
            startTimeRef.current = null;
            setElapsedSeconds(0);
            setDescription(''); // Clear or keep? Clear usually.
            
            toast({ title: "Timer stopped", description: "Time logged successfully." });
            fetchEntries();

        } catch (error: any) {
            toast({
                title: "Error stopping timer",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatedPage>
             <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                      Focus Timer
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Track your deep work sessions and billable hours.
                    </p>
                </div>

                {/* Main Timer Card */}
                <Card className="mb-8 border-orange-100 shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                    <CardContent className="pt-10 pb-10 text-center">
                        <div className="font-mono text-7xl md:text-9xl font-bold text-gray-800 tracking-tighter mb-8 tabular-nums">
                            {formatTime(elapsedSeconds)}
                        </div>

                        <div className="max-w-md mx-auto space-y-4">
                            <Input
                                placeholder="What are you working on?"
                                className="text-center text-lg h-12 border-gray-200 focus:border-orange-500 transition-colors"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isTimerRunning}
                            />
                            
                            <div className="flex justify-center gap-4">
                                {!isTimerRunning ? (
                                    <Button 
                                        size="lg" 
                                        className="h-16 w-32 rounded-full text-xl bg-orange-600 hover:bg-orange-700 shadow-orange-200 shadow-xl transition-all hover:scale-105"
                                        onClick={startTimer}
                                    >
                                        <Play className="mr-2 h-6 w-6 fill-current" /> Start
                                    </Button>
                                ) : (
                                    <Button 
                                        size="lg" 
                                        variant="destructive"
                                        className="h-16 w-32 rounded-full text-xl bg-red-500 hover:bg-red-600 shadow-red-200 shadow-xl transition-all hover:scale-105"
                                        onClick={stopTimer}
                                    >
                                        <Square className="mr-2 h-6 w-6 fill-current" /> Stop
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <History className="mr-2 h-5 w-5 text-gray-500" /> Recent Sessions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading history...</div>
                         ) : entries.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>No time logs yet. Start the timer!</p>
                            </div>
                         ) : (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead className="text-right">Duration</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell className="text-gray-500">
                                                {format(new Date(entry.start_time), 'MMM d, HH:mm')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {entry.description ||  <span className="text-gray-400 italic">Untitled</span>}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-xs">
                                                {format(new Date(entry.start_time), 'h:mm a')} - {format(new Date(entry.end_time), 'h:mm a')}
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-bold text-orange-600">
                                                {formatTime(entry.duration || 0)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                             </Table>
                         )}
                    </CardContent>
                </Card>
             </div>
        </AnimatedPage>
    );
};

export default FocusTimer;
