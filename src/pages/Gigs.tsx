import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Search, Filter, Heart, ArrowUpRight, Zap, Briefcase, LayoutList, Map as MapIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedPage from '@/components/AnimatedPage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Loader from '@/components/ui/loader';
import { BaseMap, Marker, Popup } from '@/components/ui/Map';

const categories = [
  "All Categories",
  "Plumbing", "Electrical", "Domestic Work", "Gardening", 
  "Cleaning", "Childcare", "Transportation", "Repairs", "IT Support"
];

const getGigCoordinates = (gig: any): [number, number] => {
    if (gig.latitude && gig.longitude) {
        return [gig.latitude, gig.longitude];
    }
    // Deterministic random based on ID
    const hash = (gig.id || 'default').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    // Pseudo-random offset from JHB center (approx 10km radius)
    const latOffset = ((hash % 1000) - 500) / 10000; 
    const lngOffset = (((hash * 13) % 1000) - 500) / 10000;
    return [-26.2041 + latOffset, 28.0473 + lngOffset];
};

const Gigs = () => {
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const navigate = useNavigate();
    const { toast } = useToast();

    const fetchGigs = React.useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        const { data: gigsData, error } = await supabase
            .from('gigs')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (error) {
            setLoadError(error.message || 'Unable to load gigs right now.');
            toast({ title: 'Error loading gigs', description: error.message, variant: 'destructive' });
            setGigs([]);
        } else {
            setGigs(gigsData || []);
            setLastFetchedAt(Date.now());
        }

        setLoading(false);
    }, [toast]);

    // Fetch Logic remains the same, simplified for clarity in UI update
    useEffect(() => {
        fetchGigs();
    }, [fetchGigs]);

    const filteredGigs = gigs.filter(gig => {
        const matchesSearch = gig.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            gig.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All Categories' || gig.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <AnimatedPage>
            <div className="space-y-8">
                {/* Header Filter Section */}
                <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between sticky top-0 md:top-4 z-30 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input 
                                placeholder="Search for opportunities..." 
                                className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    viewMode === 'list' ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-white"
                                )}
                                title="List View"
                            >
                                <LayoutList size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    viewMode === 'map' ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:text-white"
                                )}
                                title="Map View"
                            >
                                <MapIcon size={20} />
                            </button>
                        </div>
                    </div>
                     
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full lg:w-auto">
                         {categories.slice(0, 5).map(cat => (
                             <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all border",
                                    categoryFilter === cat 
                                        ? "bg-primary text-white border-primary shadow-glow" 
                                        : "bg-white/5 text-muted-foreground border-transparent hover:bg-white/10"
                                )}
                             >
                                 {cat}
                             </button>
                         ))}
                         {/* More dropdown logic could go here */}
                    </div>
                </div>

                {/* Masonry Grid Layout */}
                {loadError && !loading && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{loadError}</p>
                            {lastFetchedAt && (
                                <p className="text-xs text-destructive/80">Last attempt: {new Date(lastFetchedAt).toLocaleTimeString()}</p>
                            )}
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchGigs}>Retry</Button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-6 w-20 bg-white/10 rounded" />
                                    <div className="h-6 w-16 bg-white/10 rounded" />
                                </div>
                                <div className="h-4 w-3/4 bg-white/10 rounded" />
                                <div className="h-3 w-full bg-white/10 rounded" />
                                <div className="h-3 w-2/3 bg-white/10 rounded" />
                                <div className="flex justify-between pt-4 border-t border-white/10">
                                    <div className="h-3 w-20 bg-white/10 rounded" />
                                    <div className="h-3 w-16 bg-white/10 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : viewMode === 'map' ? (
                     <div className="h-[calc(100vh-250px)] rounded-2xl overflow-hidden border border-white/10 relative z-0">
                        <BaseMap center={[-26.2041, 28.0473]} zoom={11} className="h-full w-full">
                            {filteredGigs.map(gig => {
                                const [lat, lng] = getGigCoordinates(gig);
                                return (
                                    <Marker key={gig.id} position={[lat, lng]}>
                                        <Popup>
                                            <div className="min-w-[200px]">
                                                <h3 className="font-bold text-black text-sm mb-1">{gig.title}</h3>
                                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">{gig.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <Badge className="bg-primary text-white text-[10px] h-5">{gig.category}</Badge>
                                                    <span className="text-green-600 font-bold text-xs">R {gig.price}</span>
                                                </div>
                                                <Button 
                                                    size="sm" 
                                                    className="w-full mt-2 h-7 text-xs"
                                                    onClick={() => navigate(`/gigs/${gig.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </BaseMap>
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredGigs.map((gig, index) => (
                                <motion.div
                                    key={gig.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    layout
                                >
                                    <Card className="h-full flex flex-col group cursor-pointer hover:border-primary/50 relative overflow-hidden" onClick={() => navigate(`/gigs/${gig.id}`)}>
                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <CardContent className="p-6 flex-1 flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="bg-white/5 border-white/10 text-xs">
                                                    {gig.category}
                                                </Badge>
                                                <span className="text-xl font-bold font-heading text-green-400">
                                                    R {Number(gig.price || 0).toLocaleString()}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{gig.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {gig.description}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-primary" />
                                                    <span>{gig.location || 'Remote'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    <span>Posted recently</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        
                                        {/* Action Button that appears on hover */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <Button size="sm" className="rounded-full w-10 h-10 p-0 shadow-glow">
                                                <ArrowUpRight size={18} />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                
                {!loading && filteredGigs.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold mb-2">No Gigs Found</h3>
                        <p>Try adjusting your search criteria to find more opportunities.</p>
                        {lastFetchedAt && (
                            <p className="text-xs text-muted-foreground mt-2">Last updated {new Date(lastFetchedAt).toLocaleTimeString()}</p>
                        )}
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
};

export default Gigs;
