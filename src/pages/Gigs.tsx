
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import WorkerBadge from '@/components/WorkerBadge';

// Custom currency icon for South African Rand
const CurrencyRand = () => (
  <div className="flex items-center justify-center w-4 h-4">
    <span className="font-bold text-xs">R</span>
  </div>
);

const categories = [
  "All Categories",
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
      
      // Improved query that fetches gigs along with their client profiles in a single request
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          client:client_id (
            id,
            profiles:profiles (
              username,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched gigs:', data);
      setGigs(data || []);
    } catch (error: any) {
      console.error("Gigs fetch error:", error);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredGigs = handleSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Gigs</h1>
            <p className="text-muted-foreground">Find work opportunities in your area</p>
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{gig.title}</CardTitle>
                      <CardDescription>
                        Posted by {gig.client?.profiles?.[0]?.username || 'Anonymous'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gigstr-purple/10 text-gigstr-purple">
                      {gig.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm mb-4">{gig.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <CurrencyRand />
                      <span className="ml-1">{formatPrice(gig.price)}</span>
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gigstr-purple" />
                      {gig.location || 'Remote'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gigstr-purple" />
                      {new Date(gig.created_at).toLocaleDateString('en-ZA')}
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
                : "No gigs are currently available in your area"}
            </p>
            <Button onClick={() => navigate('/create-gig')}>Post a New Gig</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
