import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Image as ImageIcon, ExternalLink, Share2, Trash2, Eye, LayoutGrid, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFileToBucket } from '@/lib/storage';

const ShowcaseBuilder = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [activeFilter, setActiveFilter] = useState<string>('all');
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [tagsInput, setTagsInput] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (user) fetchProjects();
    }, [user]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('portfolio_items')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setProjects(data || []);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsAdding(true);
            const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);
            
            const { error } = await supabase
                .from('portfolio_items')
                .insert({
                    user_id: user?.id,
                    title,
                    description,
                    project_url: projectUrl,
                    image_url: imageUrl,
                    tags: tagsArray
                });

            if (error) throw error;

            toast({ title: "Project added", description: "Your showcase has been updated." });
            setTitle('');
            setDescription('');
            setProjectUrl('');
            setImageUrl('');
            setTagsInput('');
            setOpenDialog(false);
            fetchProjects();
             
        } catch (error: any) {
             toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!user) {
            toast({ title: 'Login required', description: 'Please sign in to upload.', variant: 'destructive' });
            return;
        }
        try {
            setIsUploadingImage(true);
            const { url } = await uploadFileToBucket({
                bucket: 'portfolio',
                file,
                folder: user.id,
            });
            setImageUrl(url);
            toast({ title: 'Image uploaded', description: 'Preview set for this project.' });
        } catch (err: any) {
            toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
        } finally {
            setIsUploadingImage(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };
    
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(!confirm("Are you sure?")) return;
        try {
            const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
            toast({ title: "Project deleted" });
        } catch(error: any) {
             toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const getUniqueTags = () => {
        const tags = new Set<string>();
        projects.forEach(p => p.tags && p.tags.forEach((t: string) => tags.add(t)));
        return Array.from(tags);
    };

    const filteredProjects = activeFilter === 'all' 
        ? projects 
        : projects.filter(p => p.tags && p.tags.includes(activeFilter));

    return (
        <AnimatedPage>
             {/* Hero Header */}
             <div className="relative bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white pb-32 pt-16 px-4 mb-[-80px]">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10">
                            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            <span className="text-xs font-medium text-green-200 pr-2">Public Portfolio Live</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 tracking-tight mb-4">
                            Showcase Your Mastery.
                        </h1>
                        <p className="text-blue-200/60 text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                            A stunning, auto-generated portfolio to close more deals. Share your unique link today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full px-8 shadow-xl shadow-purple-900/20"
                                onClick={() => {
                                    const link = user?.id ? `https://gigstr.com/p/${user.id}` : '';
                                    if (link && navigator?.clipboard) navigator.clipboard.writeText(link);
                                    toast({ title: link ? 'Public link copied' : 'Link unavailable', description: link || 'Sign in to generate your public link.' });
                                }}
                            >
                                <Share2 className="mr-2 h-4 w-4" /> Share Public Link
                            </Button>
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <DialogTrigger asChild>
                                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 backdrop-blur-md">
                                        <Plus className="mr-2 h-4 w-4" /> Add New Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">Add to Portfolio</DialogTitle>
                                        <DialogDescription>
                                            Show off your best work. Images with 16:9 ratio work best.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddProject} className="space-y-5 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold tracking-wide text-slate-700">Project Title</label>
                                            <Input className="bg-slate-50 border-slate-200" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Redesign for XYZ Corp" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold tracking-wide text-slate-700">Description</label>
                                            <Textarea className="bg-slate-50 border-slate-200 resize-none h-24" value={description} onChange={e => setDescription(e.target.value)} placeholder="What was the challenge? How did you solve it?" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold tracking-wide text-slate-700">Project Link</label>
                                                <Input className="bg-slate-50 border-slate-200" value={projectUrl} onChange={e => setProjectUrl(e.target.value)} placeholder="https://..." />
                                            </div>
                                             <div className="space-y-2">
                                                                                                <label className="text-sm font-semibold tracking-wide text-slate-700">Project Cover</label>
                                                                                                <div className="flex gap-2">
                                                                                                        <Input className="bg-slate-50 border-slate-200" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Paste image URL or upload" />
                                                                                                        <input
                                                                                                            ref={imageInputRef}
                                                                                                            type="file"
                                                                                                            accept="image/*"
                                                                                                            className="hidden"
                                                                                                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                                                                                        />
                                                                                                        <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isUploadingImage}>
                                                                                                            {isUploadingImage ? 'Uploading...' : 'Upload'}
                                                                                                        </Button>
                                                                                                </div>
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <label className="text-sm font-semibold tracking-wide text-slate-700">Tags</label>
                                            <Input className="bg-slate-50 border-slate-200" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="React, Branding, Mobile App (comma separated)" />
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="submit" size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800" disabled={isAdding}>
                                                {isAdding ? "Publishing..." : "Publish Project"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl pb-20">
                {/* Stats & Filters Bar */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-lg mb-10 overflow-hidden sticky top-4 z-40 transition-all">
                    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            <Button 
                                variant={activeFilter === 'all' ? "default" : "ghost"} 
                                size="sm" 
                                onClick={() => setActiveFilter('all')}
                                className={activeFilter === 'all' ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}
                            >
                                All Work <Badge className="ml-2 bg-white/20 text-current">{projects.length}</Badge>
                            </Button>
                            {getUniqueTags().map(tag => (
                                <Button
                                key={tag}
                                variant={activeFilter === tag ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveFilter(tag)}
                                className={activeFilter === tag ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-900 capitalize"}
                                >
                                {tag}
                                </Button>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-2 border-l pl-4 hidden md:flex">
                             <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}>
                                <LayoutGrid className="h-4 w-4" />
                             </Button>
                             <Button variant="ghost" size="icon" onClick={() => setViewMode('masonry')} className={viewMode === 'masonry' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}>
                                <Filter className="h-4 w-4 rotate-90" />
                             </Button>
                        </div>
                    </div>
                </Card>

                {/* Projects Grid */}
                 <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                    <AnimatePresence>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border-0 bg-white h-full flex flex-col cursor-pointer relative">
                                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200">
                                            <ImageIcon className="h-12 w-12 text-slate-300" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                                        {project.project_url && (
                                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full h-12 w-12">
                                                    <ExternalLink className="h-6 w-6" />
                                                </Button>
                                            </a>
                                        )}
                                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full h-12 w-12" onClick={() => {}}>
                                             <Eye className="h-6 w-6" />
                                        </Button>
                                    </div>

                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-lg" onClick={(e) => handleDelete(project.id, e)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-6 flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tags && project.tags.map((tag: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-indigo-100 text-indigo-600 bg-indigo-50/50">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                    
                    {projects.length === 0 && !loading && (
                        <div className="col-span-full py-24 text-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="p-6 rounded-full bg-slate-50 inline-block mb-4">
                                     <LayoutGrid className="h-12 w-12 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Portfolio Empty</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">Start showcasing your work to win more clients. Add your first masterpiece today.</p>
                                <Button onClick={() => setOpenDialog(true)}>Add Project</Button>
                            </motion.div>
                        </div>
                    )}
                 </div>
             </div>
        </AnimatedPage>
    );
};

export default ShowcaseBuilder;
