
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, Coins, Star, ArrowRight, Gem, Zap, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const RewardCard = ({ title, points, description, icon: Icon, onRedeem, disabled = false }) => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-sm font-medium flex items-center">
          <Coins className="h-4 w-4 mr-1" />
          {points} points
        </div>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex justify-center py-4">
      <div className="w-16 h-16 bg-gigstr-purple/10 rounded-full flex items-center justify-center">
        <Icon className="h-8 w-8 text-gigstr-purple" />
      </div>
    </CardContent>
    <CardFooter>
      <Button 
        className="w-full" 
        onClick={onRedeem} 
        disabled={disabled}
        variant={disabled ? "outline" : "default"}
      >
        {disabled ? "Not Enough Points" : "Redeem Reward"}
      </Button>
    </CardFooter>
  </Card>
);

const Rewards = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [points, setPoints] = useState(profile?.points || 0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rewards');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    if (profile) {
      setPoints(profile.points || 0);
    }
  }, [user, profile, navigate]);

  const handleRedeemReward = async (rewardTitle, pointsCost) => {
    if (points < pointsCost) {
      toast({
        title: "Not enough points",
        description: `You need ${pointsCost - points} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Update user's points
      const { error } = await supabase
        .from('profiles')
        .update({ points: points - pointsCost })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setPoints(prevPoints => prevPoints - pointsCost);
      
      toast({
        title: "Reward redeemed!",
        description: `You've successfully redeemed: ${rewardTitle}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate level based on points
  const level = Math.floor(points / 100) + 1;
  const pointsToNextLevel = 100 - (points % 100);
  const progressToNextLevel = (points % 100);

  const rewardsList = [
    { 
      title: "Premium Badge", 
      points: 50, 
      description: "Get a premium badge for your profile to stand out to clients", 
      icon: Shield 
    },
    { 
      title: "Featured Profile", 
      points: 100, 
      description: "Your profile will be featured on the homepage for 3 days", 
      icon: Star 
    },
    { 
      title: "10% Cash Bonus", 
      points: 200, 
      description: "Receive a 10% bonus on your next completed gig payment", 
      icon: Coins 
    },
    { 
      title: "Priority Support", 
      points: 150, 
      description: "Get priority support for 30 days with faster response times", 
      icon: Zap 
    },
    { 
      title: "Premium Tools", 
      points: 300, 
      description: "Unlock premium tools and features for 30 days", 
      icon: Gem 
    },
  ];

  if (!user) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loyalty Rewards</h1>
          <p className="text-muted-foreground">Earn points by completing gigs and redeem them for rewards</p>
        </div>
        
        <Card className="w-full md:w-auto bg-gradient-to-r from-gigstr-purple to-gigstr-indigo text-white">
          <CardContent className="p-4 flex items-center gap-4">
            <Award className="h-8 w-8" />
            <div>
              <h2 className="font-bold text-xl">{points} points</h2>
              <p className="text-xs">Level {level} member</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {pointsToNextLevel} more points to reach level {level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressToNextLevel} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="rewards" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">Reward History</TabsTrigger>
          <TabsTrigger value="earn">How to Earn</TabsTrigger>
        </TabsList>
      
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardsList.map((reward, index) => (
              <RewardCard
                key={index}
                title={reward.title}
                points={reward.points}
                description={reward.description}
                icon={reward.icon}
                onRedeem={() => handleRedeemReward(reward.title, reward.points)}
                disabled={points < reward.points || loading}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Redemption History</CardTitle>
              <CardDescription>View your past reward redemptions</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No rewards redeemed yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't redeemed any rewards yet. 
                Complete jobs to earn points and unlock exclusive benefits.
              </p>
              <Button onClick={() => setActiveTab('rewards')}>Browse Available Rewards</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earn">
          <Card>
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
              <CardDescription>Complete tasks and activities to earn loyalty points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-green-100 p-3 rounded-full h-fit">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Complete a Job</h3>
                    <p className="text-muted-foreground mb-2">Earn 50 points for each job you successfully complete.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Receive a 5-star Rating</h3>
                    <p className="text-muted-foreground mb-2">Earn 10 bonus points when you receive a 5-star rating.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-purple-100 p-3 rounded-full h-fit">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Complete Profile</h3>
                    <p className="text-muted-foreground mb-2">Earn 25 points for completing your profile with skills and bio.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-amber-100 p-3 rounded-full h-fit">
                    <Gift className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Refer a Friend</h3>
                    <p className="text-muted-foreground mb-2">Earn 100 points when you refer a friend who completes their first gig.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
