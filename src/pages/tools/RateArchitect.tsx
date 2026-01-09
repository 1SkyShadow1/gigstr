import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Briefcase, Calendar, Calculator, Save, TrendingUp, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const formatRand = (amount: number) =>
    new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        maximumFractionDigits: 0,
    }).format(amount || 0);

const RateArchitect = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // Inputs
    const [annualGoal, setAnnualGoal] = useState(100000);
    const [billableHours, setBillableHours] = useState(25);
    const [weeksOff, setWeeksOff] = useState(4);
    const [monthlyExpenses, setMonthlyExpenses] = useState(2000);
    const [taxRate, setTaxRate] = useState(25);

    // Results
    const [hourlyRate, setHourlyRate] = useState(0);
    const [savedRates, setSavedRates] = useState<any[]>([]);

    useEffect(() => {
        calculateRate();
    }, [annualGoal, billableHours, weeksOff, monthlyExpenses, taxRate]);

    useEffect(() => {
        if (user) fetchSavedRates();
    }, [user]);

    const calculateRate = () => {
        // Total needed = (Annual Goal + (Monthly Expenses * 12)) / (1 - Tax Rate / 100)
        // This is a simplified view: You need enough pre-tax money to cover taxes + expenses + goal (net).
        // Let's assume Annual Goal is NET income desired.
        
        const annualExpenses = monthlyExpenses * 12;
        const totalNetNeeded = annualGoal + annualExpenses;
        
        // Gross needed to cover taxes: Gross = Net / (1 - TaxRate)
        const grossRevenueNeeded = totalNetNeeded / (1 - (taxRate / 100));
        
        const workingWeeks = 52 - weeksOff;
        const totalBillableHours = workingWeeks * billableHours;
        
        const rate = totalBillableHours > 0 ? grossRevenueNeeded / totalBillableHours : 0;
        setHourlyRate(Math.round(rate));
    };

    const fetchSavedRates = async () => {
        const { data } = await supabase.from('rate_calculations').select('*').order('created_at', { ascending: false });
        if (data) setSavedRates(data);
    };

    const saveCalculation = async () => {
        if (!user) return;
        try {
            const { error } = await supabase.from('rate_calculations').insert({
                user_id: user.id,
                name: `Goal: ${formatRand(annualGoal)}`,
                target_annual_income: annualGoal,
                billable_hours_per_week: billableHours,
                weeks_off: weeksOff,
                monthly_expenses: monthlyExpenses,
                tax_rate: taxRate,
                calculated_hourly_rate: hourlyRate
            });
            if (error) throw error;
            toast({ title: "Saved!", description: "Rate calculation saved to history." });
            fetchSavedRates();
        } catch (error: any) { // Removed unused variable warning
             toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <AnimatedPage>
             <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 mb-2">
                        Rate Architect
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Reverse-engineer your hourly rate based on your lifestyle goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calculator Inputs */}
                    <Card className="border-0 shadow-xl shadow-emerald-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-emerald-600" /> Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="font-semibold text-gray-700">Desired Annual Net Income</Label>
                                    <span className="text-emerald-600 font-bold">{formatRand(annualGoal)}</span>
                                </div>
                                <Slider 
                                    value={[annualGoal]} 
                                    onValueChange={(v) => setAnnualGoal(v[0])} 
                                    max={300000} 
                                    step={1000} 
                                    className="py-2"
                                />
                                <p className="text-xs text-muted-foreground">The amount you want to take home after taxes and business expenses.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="font-semibold text-gray-700">Billable Hours / Week</Label>
                                    <span className="text-blue-600 font-bold">{billableHours} hrs</span>
                                </div>
                                <Slider 
                                    value={[billableHours]} 
                                    onValueChange={(v) => setBillableHours(v[0])} 
                                    max={60} 
                                    step={1} 
                                    className="py-2"
                                />
                                <p className="text-xs text-muted-foreground">Realistic hours you can bill clients (excludes admin time).</p>
                            </div>

                             <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="font-semibold text-gray-700">Vacation & Sick Weeks</Label>
                                    <span className="text-orange-500 font-bold">{weeksOff} weeks</span>
                                </div>
                                <Slider 
                                    value={[weeksOff]} 
                                    onValueChange={(v) => setWeeksOff(v[0])} 
                                    max={12} 
                                    step={1} 
                                    className="py-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Monthly Expenses (R)</Label>
                                    <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Est. Tax Rate (%)</Label>
                                    <Input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={saveCalculation} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                <Save className="mr-2 h-4 w-4" /> Save Calculation
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Results Display */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={hourlyRate}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Card className="border-0 bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <CardContent className="p-10 text-center relative z-10">
                                    <h3 className="text-slate-400 font-medium tracking-widest uppercase text-sm mb-4">Your Target Rate</h3>
                                    <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-200">
                                        {formatRand(hourlyRate)}
                                    </div>
                                    <p className="text-slate-400 mt-2 font-medium">per hour</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800">
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider">Gross Revenue</p>
                                            <p className="text-xl font-bold text-white">{formatRand(Math.round(hourlyRate * billableHours * (52 - weeksOff)))}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider">Weekly Target</p>
                                            <p className="text-xl font-bold text-white">{formatRand(Math.round(hourlyRate * billableHours))}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {savedRates.length === 0 ? (
                                        <p className="text-sm text-gray-500">No saved calculations yet.</p>
                                    ) : (
                                        savedRates.map((calc: any) => (
                                            <div key={calc.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{calc.name}</p>
                                                    <p className="text-xs text-gray-500">{new Date(calc.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                    {`${formatRand(calc.calculated_hourly_rate)}/hr`}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
             </div>
        </AnimatedPage>
    );
};

export default RateArchitect;
