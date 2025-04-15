
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, DollarSign, Clock, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import PageHeader from '@/components/tools/PageHeader';

// Mock data for charts
const revenueData = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Feb', revenue: 3600 },
  { name: 'Mar', revenue: 2800 },
  { name: 'Apr', revenue: 4200 },
  { name: 'May', revenue: 5000 },
  { name: 'Jun', revenue: 3500 },
  { name: 'Jul', revenue: 4800 },
];

const timeData = [
  { name: 'Mon', hours: 6.5 },
  { name: 'Tue', hours: 7.8 },
  { name: 'Wed', hours: 5.3 },
  { name: 'Thu', hours: 8.2 },
  { name: 'Fri', hours: 6.9 },
  { name: 'Sat', hours: 3.1 },
  { name: 'Sun', hours: 1.2 },
];

const projectData = [
  { name: 'Website Redesign', value: 35 },
  { name: 'Mobile App Dev', value: 25 },
  { name: 'Brand Identity', value: 20 },
  { name: 'Marketing', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981'];

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader 
        title="Analytics Dashboard" 
        description="View insights about your earnings, time spent, and productivity"
        icon={<BarChart3 className="h-5 w-5 text-gigstr-purple" />}
      />
      
      <div className="flex items-center justify-between mb-6">
        <Select defaultValue="month">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                18%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hours Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">164.5</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                2
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                3
              </span>
              <span className="text-xs text-muted-foreground ml-1">new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList>
          <TabsTrigger value="earnings" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Productivity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="earnings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Your monthly revenue for this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>Revenue by client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gigstr-purple mr-2"></div>
                      <span>Acme Inc</span>
                    </div>
                    <span className="font-medium">$5,240</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                      <span>TechStart</span>
                    </div>
                    <span className="font-medium">$4,350</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                      <span>Design Co</span>
                    </div>
                    <span className="font-medium">$3,820</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                      <span>Marketing Pro</span>
                    </div>
                    <span className="font-medium">$2,970</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                      <span>WebDev LLC</span>
                    </div>
                    <span className="font-medium">$2,180</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="time" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Hours</CardTitle>
                <CardDescription>Hours tracked per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#8B5CF6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>By project category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {projectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Project Analytics Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're still working on this feature. Check back soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="productivity" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <h3 className="text-lg font-medium mb-2">Productivity Insights Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  We're still working on this feature. Check back soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
