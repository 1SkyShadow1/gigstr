
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, DollarSign, MapPin, Search, Filter } from 'lucide-react';

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Admin",
  "Customer Service",
  "Legal",
  "Finance",
  "Other"
];

const Gigs = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('gigs')
        .select(`
          *,
          client:client_id(
            id,
            profiles:profiles(first_name, last_name, username, avatar_url)
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      setGigs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching gigs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filteredGigs = gigs.filter(gig => {
      const matchesSearch = searchQuery === '' || 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        gig.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === 'All Categories' || gig.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    return filteredGigs;
  };

  const filteredGigs = handleSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Gigs</h1>
            <p className="text-muted-foreground">Browse and apply for available opportunities</p>
          </div>
          <Button onClick={() => navigate('/create-gig')}>Post a New Gig</Button>
        </div>
        
        {/* Search & Filter */}
        <div className="bg-white shadow-sm border rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search gigs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-[200px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gigstr-purple"></div>
          </div>
        ) : filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <Card key={gig.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{gig.title}</CardTitle>
                  <CardDescription>
                    Posted by {gig.client.profiles[0]?.username || 'Anonymous'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm mb-4">{gig.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gigstr-purple" />
                      ${gig.price}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gigstr-purple" />
                      {gig.location || 'Remote'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gigstr-purple" />
                      {new Date(gig.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/gigs/${gig.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <h3 className="text-lg font-medium mb-2">No Gigs Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || categoryFilter !== 'All Categories' 
                ? "Try changing your search criteria" 
                : "No gigs are currently available"}
            </p>
            <Button onClick={() => navigate('/create-gig')}>Post a New Gig</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
