import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToBucket } from '@/lib/storage';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, FolderOpen, FileText, MessageSquare, Plus, ExternalLink, Lock, Send, Download } from 'lucide-react';
import { format } from 'date-fns';

const TeamBridge = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [portals, setPortals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPortal, setSelectedPortal] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Create Form
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [projectName, setProjectName] = useState('');

    // Inside Portal State
    const [files, setFiles] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [newFileUrl, setNewFileUrl] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) fetchPortals();
    }, [user]);

    useEffect(() => {
        if (selectedPortal) {
            fetchPortalDetails(selectedPortal.id);
        }
    }, [selectedPortal]);

    const fetchPortals = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('client_portals').select('*').order('created_at', { ascending: false });
            // Ignore if table missing initially
            if (error && error.code !== '42P01') throw error;
            setPortals(data || []);
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPortalDetails = async (portalId: string) => {
        const { data: filesData } = await supabase.from('portal_files').select('*').eq('portal_id', portalId).order('uploaded_at', { ascending: false });
        setFiles(filesData || []);

        const { data: commentsData } = await supabase.from('portal_comments').select('*').eq('portal_id', portalId).order('created_at', { ascending: true });
        setComments(commentsData || []);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedPortal || !user) return;
        try {
            setIsUploadingFile(true);
            const { url, path } = await uploadFileToBucket({
                bucket: 'portal-files',
                file,
                folder: `${user.id}/${selectedPortal.id}`
            });

            await supabase.from('portal_files').insert({
                portal_id: selectedPortal.id,
                name: file.name,
                file_url: url,
                file_type: file.type || 'file',
                uploaded_at: new Date().toISOString()
            });
            fetchPortalDetails(selectedPortal.id);
            toast({ title: 'File uploaded', description: file.name });
        } catch (error: any) {
            toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCreatePortal = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const { data, error } = await supabase.from('client_portals').insert({
                user_id: user?.id,
                client_name: clientName,
                client_email: clientEmail,
                project_name: projectName,
                portal_password: Math.random().toString(36).slice(-8)
            }).select();

            if (error) throw error;
            toast({ title: "Portal Created", description: `Client portal for ${clientName} is ready.` });
            setClientName('');
            setClientEmail('');
            setProjectName('');
            fetchPortals();
        } catch (error: any) {
             toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPortal) return;
        try {
            const { error } = await supabase.from('portal_comments').insert({
                portal_id: selectedPortal.id,
                author_name: 'You',
                message: newMessage
            });
            if (error) throw error;
            setNewMessage('');
            fetchPortalDetails(selectedPortal.id);
        } catch(error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    if (selectedPortal) {
        return (
            <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Button variant="ghost" onClick={() => setSelectedPortal(null)} className="pl-0 hover:pl-2 transition-all text-slate-500">
                            &larr; Back to Portals
                        </Button>
                        <h2 className="text-3xl font-bold text-slate-900">{selectedPortal.project_name}</h2>
                        <p className="text-slate-500">Client: {selectedPortal.client_name} ({selectedPortal.client_email})</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => toast({ title: "Copied!", description: `Link: gigstr.com/portal/${selectedPortal.id}` })}>
                            <ExternalLink className="mr-2 h-4 w-4" /> Share Link
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
                    {/* Files Section */}
                    <Card className="lg:col-span-2 flex flex-col overflow-hidden border-0 shadow-lg">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FolderOpen className="h-5 w-5 text-blue-600" /> Project Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden p-0">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-2">
                                    {files.length === 0 ? (
                                        <div className="text-center py-12 text-slate-400">
                                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                            <p>No files shared yet.</p>
                                        </div>
                                    ) : (
                                        files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 p-2 rounded">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{format(new Date(file.uploaded_at), 'MMM d, yyyy')}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-4 w-4 text-slate-400" />
                                                    </a>
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-4 bg-slate-50 border-t">
                            <div className="flex gap-2">
                                                                <input
                                                                    ref={fileInputRef}
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={handleFileUpload}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    disabled={isUploadingFile}
                                                                >
                                                                    {isUploadingFile ? 'Uploading...' : 'Upload File'}
                                                                </Button>
                                <Input  placeholder="File Name" value={newFileName} onChange={e => setNewFileName(e.target.value)} className="w-1/3" />
                                <Input placeholder="File URL (e.g. Dropbox/Drive link)" value={newFileUrl} onChange={e => setNewFileUrl(e.target.value)} className="flex-grow" />
                                <Button onClick={async () => {
                                    if(!newFileName || !newFileUrl) return;
                                    await supabase.from('portal_files').insert({
                                        portal_id: selectedPortal.id,
                                        name: newFileName,
                                        file_url: newFileUrl,
                                        file_type: 'link'
                                    });
                                    setNewFileName('');
                                    setNewFileUrl('');
                                    fetchPortalDetails(selectedPortal.id);
                                }}>Add File</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Chat Section */}
                    <Card className="flex flex-col overflow-hidden border-0 shadow-lg">
                         <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MessageSquare className="h-5 w-5 text-indigo-600" /> Discussion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden p-4 bg-slate-50/50">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className={`flex flex-col ${comment.author_name === 'You' ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${comment.author_name === 'You' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none shadow-sm'}`}>
                                                <p>{comment.message}</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">{comment.author_name} • {format(new Date(comment.created_at), 'h:mm a')}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-3 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-grow rounded-full bg-slate-100 border-transparent focus:bg-white transition-all" />
                                <Button type="submit" size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <AnimatedPage>
             <div className="container mx-auto px-4 py-8 max-w-6xl">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                            Team Bridge
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            Secure client portals for deliverables and communication.
                        </p>
                    </div>
                    
                    <Dialog open={isCreating} onOpenChange={setIsCreating}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                <Plus className="mr-2 h-4 w-4" /> Create New Portal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Client Portal</DialogTitle>
                                <DialogDescription>Create a secure space for a new project.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreatePortal} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input placeholder="e.g. Website Redesign" value={projectName} onChange={e => setProjectName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client Name</Label>
                                    <Input placeholder="Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client Email</Label>
                                    <Input type="email" placeholder="contact@acme.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Portal</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portals.map((portal) => (
                        <Card key={portal.id} className="cursor-pointer hover:shadow-xl transition-all border-0 shadow-md group" onClick={() => setSelectedPortal(portal)}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                        <Users className="h-5 w-5 text-indigo-600 group-hover:text-white" />
                                    </div>
                                    <Badge variant={(portal.status || 'active') === 'active' ? 'default' : 'secondary'}>
                                        {portal.status || 'active'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{portal.project_name}</CardTitle>
                                <CardDescription>{portal.client_name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                    <Lock className="h-3 w-3" /> Protected Access
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 border-t bg-slate-50/50 p-4">
                                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
                                    Enter Portal &rarr;
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {portals.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                            <h3 className="text-slate-900 font-medium">No active portals</h3>
                            <p className="text-slate-500 mb-6">Create your first client portal to get started.</p>
                            <Button variant="outline" onClick={() => setIsCreating(true)}>Create Portal</Button>
                        </div>
                    )}
                </div>
             </div>
        </AnimatedPage>
    );
};

export default TeamBridge;
