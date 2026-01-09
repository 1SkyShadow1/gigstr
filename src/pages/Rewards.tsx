import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Award,
    Gift,
    Coins,
    Star,
    Gem,
    Zap,
    Shield,
    Crown,
    Flame,
    CheckCircle2,
    TrendingUp,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const RewardCard = ({ title, points, description, icon: Icon, onRedeem, disabled = false, category }: any) => (
    <Card className="h-full bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-24 h-24 text-indigo-600 rotate-12 transform translate-x-4 -translate-y-4" />
        </div>
        <CardHeader>
            <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">{category}</Badge>
                <div className="flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-sm">
                    <Coins className="w-3 h-3" /> {points}
                </div>
            </div>
            <CardTitle className="text-lg group-hover:text-indigo-700 transition-colors">{title}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-indigo-600" />
            </div>
        </CardContent>
        <CardFooter>
            <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                onClick={onRedeem}
                disabled={disabled}
            >
                {disabled ? `Need ${points} pts` : 'Redeem Reward'}
            </Button>
        </CardFooter>
    </Card>
);

const EarnCard = ({ title, points, icon: Icon, done }: any) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${done ? 'bg-green-50 border-green-200 opacity-70' : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-slate-50'} transition-all`}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-green-100' : 'bg-indigo-50'}`}>
                {done ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Icon className="w-5 h-5 text-indigo-600" />}
            </div>
            <div>
                <h4 className={`font-medium ${done ? 'text-green-800' : 'text-gray-900'} text-sm`}>{title}</h4>
                <p className="text-xs text-gray-500">{done ? 'Completed' : 'Available'}</p>
            </div>
        </div>
        <div className="font-bold text-sm text-indigo-600">+{points} pts</div>
    </div>
);

const Rewards = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [points, setPoints] = useState(profile?.points ?? 0);
    const [activeTab, setActiveTab] = useState('shop');

    useEffect(() => {
        setPoints(profile?.points ?? 0);
    }, [profile]);

    const level = Math.floor(points / 1000) + 1;
    const nextLevel = level * 1000;
    const progress = ((points - (level - 1) * 1000) / 1000) * 100;

    const REWARDS = [
        { title: 'Profile Boost', points: 500, icon: Zap, description: 'Get 3x more views on your profile for 24h', category: 'Visibility' },
        { title: 'Pro Badge', points: 2000, icon: Shield, description: 'Stand out with a verified pro badge for 1 month', category: 'Trust' },
        { title: 'Premium Access', points: 5000, icon: Crown, description: 'Unlock all analytics tools forever', category: 'Software' },
        { title: 'Data Bundle', points: 1500, icon: Gift, description: '1GB Mobile Data (All Networks)', category: 'Lifestyle' },
        { title: 'Coffee Voucher', points: 800, icon: Star, description: 'R50 Voucher for major coffee chains', category: 'Lifestyle' },
    ];

    const DAILY_TASKS = [
        { title: 'Login Daily', points: 10, icon: Flame, done: false },
        { title: 'Complete a Gig', points: 100, icon: Award, done: false },
        { title: 'Share Profile', points: 50, icon: TrendingUp, done: false },
    ];

    const handleRedeemReward = async (rewardTitle: string, pointsCost: number) => {
        if (points < pointsCost) {
            toast({ variant: 'destructive', title: 'Insufficient Points', description: 'Keep working to unlock this!' });
            return;
        }
        setPoints((p) => p - pointsCost);
        toast({ title: 'Reward Redeemed!', description: `You have claimed: ${rewardTitle}` });
    };

    return (
        <AnimatedPage>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-24">
                <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden shadow-2xl p-6 md:p-10">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
                                    <Crown className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    Lvl {level}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-1">Level {level} Earner</h1>
                                <p className="text-indigo-100 text-sm md:text-base max-w-md">
                                    Track your progress and redeem perks as you earn.
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span>XP Progress</span>
                                <span>{points} / {nextLevel}</span>
                            </div>
                            <Progress value={progress} className="h-3 bg-black/20" indicatorClassName="bg-yellow-400" />
                            <div className="mt-2 text-xs text-indigo-200 text-right">
                                {nextLevel - points} XP to next level
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-white p-1 border shadow-sm rounded-lg h-auto">
                        <TabsTrigger value="shop" className="py-2 px-6">Reward Shop</TabsTrigger>
                        <TabsTrigger value="earn" className="py-2 px-6">Ways to Earn</TabsTrigger>
                        <TabsTrigger value="leaderboard" className="py-2 px-6">Leaderboard</TabsTrigger>
                    </TabsList>

                    <TabsContent value="shop" className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Gift className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-bold text-gray-900">Exchange Points</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {REWARDS.map((reward, i) => (
                                <RewardCard
                                    key={i}
                                    {...reward}
                                    onRedeem={() => handleRedeemReward(reward.title, reward.points)}
                                    disabled={points < reward.points}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="earn" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" /> Daily Boosters
                                    </CardTitle>
                                    <CardDescription>Complete these recurring tasks to maintain your streak.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {DAILY_TASKS.map((task, i) => (
                                        <EarnCard key={i} {...task} />
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none shadow-inner">
                                <CardHeader>
                                    <CardTitle className="text-orange-900 flex items-center gap-2">
                                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                                        Daily Streak
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center py-8">
                                    <div className="text-6xl font-black text-orange-600 mb-2">{profile?.streak || 0}</div>
                                    <div className="text-lg font-medium text-orange-800">Day streak</div>
                                    <p className="text-sm text-orange-700/80 mt-2">Streak tracking updates once you start completing daily actions.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="leaderboard">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Earners This Week</CardTitle>
                                <CardDescription>Leaderboards will surface once more earners join.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-lg border border-dashed text-center text-muted-foreground">
                                        Keep collecting points to climb when the leaderboard launches.
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-semibold text-indigo-700">
                                                {user?.email?.[0]?.toUpperCase() || 'ME'}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold">You</div>
                                                <div className="text-sm text-muted-foreground">Level {level}</div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-indigo-700">{points} pts</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AnimatedPage>
    );
};

export default Rewards;
