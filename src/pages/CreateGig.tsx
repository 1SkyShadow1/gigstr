
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import Loader from '@/components/ui/loader';

const categories = [
  "Plumbing",
  "Electrical",
  "Domestic Work",
  "Gardening",
  "Cleaning",
  "Childcare",
  "Transportation",
  "Repairs",
  "Painting",
  "Construction",
  "Security",
  "IT Support",
  "Teaching",
  "Cooking",
  "Other"
];

const locations = [
  "Johannesburg",
  "Cape Town",
  "Durban",
  "Pretoria",
  "Port Elizabeth",
  "Bloemfontein", 
  "East London",
  "Polokwane",
  "Nelspruit",
  "Kimberley",
  "Remote",
  "Other"
];

const CreateGig = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a gig",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const gigData = {
        title,
        description,
        category,
        price: parseFloat(price),
        location: location || 'Remote',
        client_id: user?.id,
        status: 'open'
      };
      
      const { data, error } = await supabase
        .from('gigs')
        .insert(gigData)
        .select('id')
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Gig posted successfully",
        description: "Your gig has been posted and is now visible to workers",
      });
      
      navigate(`/gigs/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating gig",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--color-card)] py-12">
      <div className="container-custom max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Gig</h1>
          <p className="text-muted-foreground">Describe the work you need done and find skilled workers</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Gig Details</CardTitle>
              <CardDescription>Provide details about the work you need completed</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="mb-2 block">Gig Title*</Label>
                <Input 
                  id="title" 
                  placeholder="E.g., Fix kitchen sink leak"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="mb-2 block">Description*</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the work, requirements, timeline, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category" className="mb-2 block">Category*</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price" className="mb-2 block">Budget (ZAR)*</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">R</span>
                    <Input 
                      id="price" 
                      type="number"
                      placeholder="Amount in ZAR"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-8"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="location" className="mb-2 block">Location</Label>
                <Select
                  value={location}
                  onValueChange={setLocation}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location or remote" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/gigs')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : "Post Gig"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateGig;
