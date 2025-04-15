
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Timer, Play, Pause, RefreshCcw, Settings, Calendar, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import PageHeader from '@/components/tools/PageHeader';

const Pomodoro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Timer state
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [task, setTask] = useState('');
  
  // Timer settings
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
  });
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Set timer based on mode
  useEffect(() => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
      default:
        setTimeLeft(settings.pomodoro * 60);
    }
    setIsActive(false);
  }, [mode, settings]);

  // Timer countdown
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      clearInterval(interval!);
      
      if (mode === 'pomodoro') {
        setCyclesCompleted(prev => prev + 1);
        toast({
          title: "Pomodoro Completed!",
          description: "Time for a break. Well done!",
        });
        
        // Determine which break to take
        const nextMode = cyclesCompleted % 4 === 3 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        
        // Auto-start break if enabled
        if (settings.autoStartBreaks) {
          setIsActive(true);
        }
      } else {
        // Break completed
        toast({
          title: "Break Completed",
          description: "Time to focus again!",
        });
        setMode('pomodoro');
        
        // Auto-start pomodoro if enabled
        if (settings.autoStartPomodoros) {
          setIsActive(true);
        }
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, cyclesCompleted, settings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
    }
    setIsActive(false);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your timer settings have been updated.",
    });
    setSettingsOpen(false);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    let total;
    switch (mode) {
      case 'pomodoro':
        total = settings.pomodoro * 60;
        break;
      case 'shortBreak':
        total = settings.shortBreak * 60;
        break;
      case 'longBreak':
        total = settings.longBreak * 60;
        break;
      default:
        total = settings.pomodoro * 60;
    }
    
    return 100 - ((timeLeft / total) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Pomodoro Timer" 
        description="Boost productivity with timed work sessions and breaks"
        icon={<Timer className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="text-center pb-0">
              <CardTitle className="text-2xl">Pomodoro Timer</CardTitle>
              <div className="flex justify-center mb-2 mt-4">
                <Tabs value={mode} onValueChange={setMode} className="w-fit">
                  <TabsList>
                    <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                    <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                    <TabsTrigger value="longBreak">Long Break</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {task && (
                <CardDescription className="text-base mt-2">
                  Working on: {task}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-6">
              <div className="w-64 h-64 rounded-full border-8 border-gigstr-purple/20 flex items-center justify-center my-6 relative">
                <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="#8B5CF6" 
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                    strokeDashoffset={`${(100 - calculateProgress()) / 100 * (2 * Math.PI * 28)}`}
                    className="w-full h-full absolute"
                    style={{
                      transformOrigin: 'center',
                      transform: 'scale(4)',
                      transition: 'stroke-dashoffset 0.5s'
                    }}
                  />
                </svg>
                <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  size="lg"
                  variant={isActive ? "destructive" : "default"}
                  onClick={handleStartStop}
                  className="w-32"
                >
                  {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="w-32"
                >
                  <RefreshCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
              
              <div className="mt-8 w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              
              <div className="mt-8 w-full">
                <Input 
                  type="text" 
                  placeholder="What are you working on?" 
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="text-center"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Stats</CardTitle>
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Timer Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="pomodoro">Pomodoro</Label>
                          <Input 
                            id="pomodoro" 
                            type="number" 
                            min="1"
                            max="60"
                            value={settings.pomodoro}
                            onChange={(e) => setSettings({...settings, pomodoro: Number(e.target.value)})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="shortBreak">Short Break</Label>
                          <Input 
                            id="shortBreak" 
                            type="number" 
                            min="1"
                            max="30"
                            value={settings.shortBreak}
                            onChange={(e) => setSettings({...settings, shortBreak: Number(e.target.value)})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="longBreak">Long Break</Label>
                          <Input 
                            id="longBreak" 
                            type="number" 
                            min="1"
                            max="60"
                            value={settings.longBreak}
                            onChange={(e) => setSettings({...settings, longBreak: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Auto Start Breaks</Label>
                        <RadioGroup 
                          value={settings.autoStartBreaks ? "yes" : "no"}
                          onValueChange={(v) => setSettings({...settings, autoStartBreaks: v === "yes"})}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="autoBreakYes" />
                            <Label htmlFor="autoBreakYes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <RadioGroupItem value="no" id="autoBreakNo" />
                            <Label htmlFor="autoBreakNo">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Auto Start Pomodoros</Label>
                        <RadioGroup 
                          value={settings.autoStartPomodoros ? "yes" : "no"}
                          onValueChange={(v) => setSettings({...settings, autoStartPomodoros: v === "yes"})}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="autoPomoYes" />
                            <Label htmlFor="autoPomoYes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <RadioGroupItem value="no" id="autoPomoNo" />
                            <Label htmlFor="autoPomoNo">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveSettings}>Save Settings</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-gigstr-purple/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-gigstr-purple" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{cyclesCompleted}</div>
                  <div className="text-xs text-muted-foreground">Pomodoros Today</div>
                </div>
                
                <div className="border rounded-md p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-gigstr-purple/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-gigstr-purple" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{Math.floor(cyclesCompleted * settings.pomodoro / 60)}:{(cyclesCompleted * settings.pomodoro % 60).toString().padStart(2, '0')}</div>
                  <div className="text-xs text-muted-foreground">Hours Focused</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Recent Sessions</h3>
                <div className="space-y-2">
                  {cyclesCompleted > 0 ? (
                    Array(Math.min(cyclesCompleted, 3)).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="font-medium">{task || 'Focused Work'}</div>
                          <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{settings.pomodoro} mins</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No sessions completed yet. Start your first Pomodoro!</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">What is the Pomodoro Technique?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.
              </p>
              <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-2">
                <li>Choose a task to work on</li>
                <li>Set the timer for 25 minutes</li>
                <li>Work on the task until the timer rings</li>
                <li>Take a short break (5 minutes)</li>
                <li>After four pomodoros, take a longer break (15-30 minutes)</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
