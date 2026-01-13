import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
    ClipboardList, 
    FileText, 
    BarChart3, 
    PenLine,
    Receipt,
    Shield,
    Sparkles,
    Zap,
    Timer,
    Layout,
    Calendar,
    Calculator,
    Users,
    Star,
} from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { motion } from 'framer-motion';

type Tool = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    path: string;
    badge?: string;
    category: 'finance' | 'project' | 'growth';
    color: string;
    bg: string;
};

// Tool data for search/filter/sort/favorite
const TOOL_LIST: Tool[] = [
  {
        id: 'tax-vault',
    title: "Tax Vault",
    description: "Track expenses and estimate quarterly tax savings",
    icon: Receipt,
    path: "/tools/tax-vault",
    badge: "Essential",
    category: "finance",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
        id: 'focus-timer',
    title: "Focus Timer",
    description: "Track work hours and billable time directly.",
    icon: Timer,
    path: "/tools/focus-timer",
    category: "project",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
        id: 'showcase-builder',
    title: "Showcase Builder",
    description: "Create a visual portfolio and share your work.",
    icon: Layout,
    path: "/tools/showcase",
    category: "growth",
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  },
  {
        id: 'sync-up',
    title: "Sync Up",
    description: "Meeting scheduler & calendar integration.",
    icon: Calendar,
    path: "/tools/sync-up",
    category: "project",
    color: "text-blue-600",
    bg: "bg-blue-600/10"
  },
  {
        id: 'rate-architect',
    title: "Rate Architect",
    description: "Calculate your ideal hourly rate based on lifestyle.",
    icon: Calculator,
    path: "/tools/rate-architect",
    category: "finance",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10"
  },
  {
        id: 'team-bridge',
    title: "Team Bridge",
    description: "Secure client portals for files & updates.",
    icon: Users,
    path: "/tools/team-bridge",
    category: "project",
    color: "text-indigo-600",
    bg: "bg-indigo-600/10"
  },
  {
        id: 'proposal-ai',
    title: "Proposal Copilot",
    description: "AI-powered proposal generator to win more gigs instantly.",
    icon: Sparkles,
    path: "/tools/proposal-ai",
    badge: "AI Beta",
    category: "growth",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
        id: 'invoicing',
    title: "Smart Invoicing",
        description: "Create invoices, payment links, and recurring billing",
    icon: FileText,
    path: "/tools/invoicing",
    badge: "Popular",
    category: "finance",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
    {
                id: 'client-center',
        title: "Client Command Center",
        description: "CRM-lite pipeline with follow-ups and value tracking",
        icon: ClipboardList,
        path: "/tools/client-center",
        badge: "New",
        category: "growth",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        id: 'pricing-scope',
        title: "Pricing & Scope Engine",
        description: "Tiered packages, SOW guardrails, and change-order prep",
        icon: Receipt,
        path: "/tools/pricing-scope",
        badge: "New",
        category: "finance",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
  {
        id: 'project-management',
    title: "Project Management",
    description: "Organize your projects with tasks, milestones, and deadlines",
    icon: ClipboardList,
    path: "/tools/project-management",
    category: "project",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
        id: 'analytics',
    title: "Analytics Dashboard",
    description: "View insights about your earnings, time spent, and productivity",
    icon: BarChart3,
    path: "/tools/analytics",
    category: "growth",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
        id: 'contracts',
    title: "Contract Creator",
    description: "Create professional contracts for your freelance work",
    icon: PenLine,
    path: "/tools/contracts",
    badge: "New",
    category: "finance",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
        id: 'trustlock',
    title: "TrustLock Agreement",
    description: "Create secure, verified agreements and resolve disputes with confidence.",
    icon: Shield,
    path: "/tools/trustlock",
    badge: "Premium",
    category: "project",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  }
];

const Tools = () => {
    const navigate = useNavigate();
        const [searchTerm, setSearchTerm] = useState('');
        const [favoriteOnly, setFavoriteOnly] = useState(false);
        const [favorites, setFavorites] = useState<string[]>(() => {
            try {
                const stored = localStorage.getItem('toolFavorites');
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Failed to parse favorites', error);
                return [];
            }
        });

        const handleOpenTool = (path: string, id: string) => {
            navigate(path);
        };

        const handleToggleFavorite = (id: string) => {
            setFavorites((prev) => {
                const updated = prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id];
                localStorage.setItem('toolFavorites', JSON.stringify(updated));
                return updated;
            });
        };

        const filterTools = useCallback(
            (category?: Tool['category']) => {
                const term = searchTerm.trim().toLowerCase();
                return TOOL_LIST.filter((tool) => {
                    const matchesCategory = !category || tool.category === category;
                    const matchesSearch = !term || tool.title.toLowerCase().includes(term) || tool.description.toLowerCase().includes(term);
                    const matchesFavorite = !favoriteOnly || favorites.includes(tool.id);
                    return matchesCategory && matchesSearch && matchesFavorite;
                });
            },
            [favorites, favoriteOnly, searchTerm]
        );

        const renderTools = (category?: Tool['category']) => {
            const list = filterTools(category);
            if (!list.length) {
                return (
                    <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-muted-foreground">
                        No tools found. Try a different filter or clear your search.
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleOpenTool(tool.path, tool.id)}
                            className="group cursor-pointer bg-card border border-border hover:border-primary/50 p-6 rounded-2xl transition-all hover:shadow-lg relative"
                        >
                            <button
                                aria-label="Toggle favorite"
                                className={`absolute right-3 top-3 rounded-full p-2 transition-colors ${favorites.includes(tool.id) ? 'text-amber-400 bg-amber-400/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleToggleFavorite(tool.id);
                                }}
                            >
                                <Star size={16} fill={favorites.includes(tool.id) ? 'currentColor' : 'none'} />
                            </button>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <tool.icon size={24} />
                                </div>
                                {tool.badge && (
                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                        {tool.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                        </motion.div>
                    ))}
                </div>
            );
        };

    return (
        <AnimatedPage>
            <div className="container mx-auto p-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">My Toolkit</h1>
                        <p className="text-muted-foreground text-lg">Manage your freelance business with world-class utilities.</p>
                    </div>
                    {/* Quick Action Bar */}
                    <div className="flex gap-2">
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                                                    onClick={() => handleOpenTool('/tools/proposal-ai', 'proposal-ai')}
                                                >
                                                        <Zap size={18} /> Quick Action
                        </button>
                    </div>
                </div>

                                {/* Filters */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                                    <div className="w-full md:w-1/2">
                                        <Input
                                            placeholder="Search tools by name or description"
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            className="bg-card border-border"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setFavoriteOnly((prev) => !prev)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${favoriteOnly ? 'border-amber-400/60 bg-amber-400/10 text-amber-400' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}
                                        >
                                            <Star size={14} fill={favoriteOnly ? 'currentColor' : 'none'} />
                                            Favorites only
                                        </button>
                                    </div>
                                </div>

                {/* Hero Feature */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white shadow-xl"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4 border border-white/10">
                                <Sparkles size={14} /> New AI Feature
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Win more clients with Proposal Copilot</h2>
                            <p className="text-white/80 mb-8 text-lg">Stop writing cover letters from scratch. Let our AI analyze the job post and craft a winning proposal in seconds.</p>
                            <button 
                                onClick={() => navigate('/tools/proposal-ai')}
                                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
                            > 
                                Try it now
                            </button>
                        </div>
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none" />
                    </motion.div>

                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                         <div className="mb-4">
                             <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                                 <Receipt size={24} />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Pending Invoices</h3>
                             <p className="text-muted-foreground text-sm">You have 2 invoices overdue by 3 days.</p>
                         </div>
                         <div className="mt-auto">
                             <div className="text-2xl font-bold text-foreground">R 4,500.00</div>
                             <div className="text-xs text-muted-foreground mb-4">Outstanding Amount</div>
                             <button 
                                onClick={() => navigate('/tools/invoicing')}
                                className="w-full py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                            >
                                View Invoices
                             </button>
                         </div>
                    </div>
                </div>

                {/* Tool Grid */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-8 w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger value="all" className="rounded-lg px-4 py-2">All Tools</TabsTrigger>
                        <TabsTrigger value="finance" className="rounded-lg px-4 py-2">Finance</TabsTrigger>
                        <TabsTrigger value="project" className="rounded-lg px-4 py-2">Projects</TabsTrigger>
                        <TabsTrigger value="growth" className="rounded-lg px-4 py-2">Growth</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-8">
                        {renderTools()}
                    </TabsContent>
                    
                    <TabsContent value="finance">
                        {renderTools('finance')}
                    </TabsContent>

                    <TabsContent value="project">
                        {renderTools('project')}
                    </TabsContent>

                    <TabsContent value="growth">
                        {renderTools('growth')}
                    </TabsContent>
                </Tabs>
            </div>
        </AnimatedPage>
    );
};

export default Tools;
