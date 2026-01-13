import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnimatedPage from "@/components/AnimatedPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { ArrowRight, Briefcase, CheckCircle, Clock, MapPin, Zap } from "lucide-react";

const statusTone = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (value === "completed") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (value === "in_progress" || value === "active") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (value === "accepted") return "bg-green-500/15 text-green-400 border-green-500/30";
  return "bg-white/5 text-muted-foreground border-white/10";
};

const formatPrice = (price?: number | null) => {
  if (!price && price !== 0) return "—";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ActiveGigs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [assignedApplications, setAssignedApplications] = useState<any[]>([]);
  const [postedGigs, setPostedGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActive = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [applicationsRes, postedRes] = await Promise.all([
        supabase
          .from("applications")
          .select("id,status,created_at,expected_rate,availability,gig_id")
          .eq("worker_id", user.id),
        supabase
          .from("gigs")
          .select(
            `id,title,description,price,category,location,status,end_date,start_date,worker_id,client_id,
             worker:profiles!gigs_worker_id_fkey(id,username,avatar_url)`
          )
          .eq("client_id", user.id)
          .in("status", ["in_progress", "active"]),
      ]);

      if (applicationsRes.error) throw applicationsRes.error;
      if (postedRes.error) throw postedRes.error;

      const gigIds = Array.from(
        new Set((applicationsRes.data || []).map((app) => app.gig_id).filter(Boolean))
      );

      const gigsRes = gigIds.length
        ? await supabase
            .from("gigs")
            .select("id,title,description,price,category,location,status,end_date,start_date,client_id,worker_id")
            .in("id", gigIds)
        : { data: [], error: null } as any;

      if (gigsRes.error) throw gigsRes.error;

      const gigById = new Map(((gigsRes.data as any[]) || []).map((g) => [g.id, { ...g, budget: g.price }]));

      const activeApps = ((applicationsRes.data as any[]) || [])
        .map((app) => ({ ...app, gig: gigById.get(app.gig_id) }))
        .filter((app) => {
          const gigStatus = (app.gig?.status || "").toLowerCase();
          const appStatus = (app.status || "").toLowerCase();
          const isGigActive = ["in_progress", "active"].includes(gigStatus);
          const isAccepted = ["accepted", "in_progress"].includes(appStatus);
          return app.gig && (isGigActive || isAccepted);
        });

      setAssignedApplications(activeApps);
      setPostedGigs(((postedRes.data as any[]) || []).map((gig) => ({ ...gig, budget: gig.price }))
        .filter((gig) => ["in_progress", "active"].includes((gig.status || "").toLowerCase())));
    } catch (err: any) {
      toast({ title: "Could not load active gigs", description: err.message, variant: "destructive" });
      setAssignedApplications([]);
      setPostedGigs([]);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  const stats = useMemo(
    () => [
      { label: "Assigned to you", value: assignedApplications.length, icon: CheckCircle, tone: "from-emerald-500/30 to-emerald-500/10" },
      { label: "Your active gigs", value: postedGigs.length, icon: Briefcase, tone: "from-blue-500/30 to-blue-500/10" },
    ],
    [assignedApplications.length, postedGigs.length]
  );

  const renderGigCard = (gig: any, extra?: React.ReactNode, status?: string, messageTargetId?: string) => (
    <Card className="group border-white/10 bg-white/5 hover:border-primary/40 transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{gig.title || "Untitled gig"}</CardTitle>
          <CardDescription className="flex items-center gap-3 text-xs md:text-sm">
            <span className="flex items-center gap-1 text-muted-foreground"><MapPin size={14} /> {gig.location || "Remote"}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={14} />
              {gig.end_date || gig.start_date
                ? `Due ${new Date(gig.end_date || gig.start_date).toLocaleDateString()}`
                : "No due date"}
            </span>
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={cn("border", statusTone(status || gig.status))}>{status || gig.status || "active"}</Badge>
          <span className="text-sm font-semibold text-white">{formatPrice(gig.price ?? gig.budget)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{gig.description || "No description provided."}</p>
        <div className="flex items-center justify-between gap-3">
          {extra}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" className="border-white/20" onClick={() => navigate(`/gigs/${gig.id}`)}>
              Open gig
            </Button>
            <Button
              variant="glow"
              size="sm"
              className="gap-1"
              onClick={() => navigate(messageTargetId ? `/messages?recipient=${messageTargetId}` : "/messages")}
            >
              Message <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-background to-background shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-primary font-semibold flex items-center gap-2"><Zap size={16} /> Workflow</p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">Active Gigs</h1>
              <p className="text-muted-foreground mt-2">Track gigs in progress, whether you are hired or managing a team.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/gigs">Find new gigs</Link>
              </Button>
              <Button variant="glow" asChild>
                <Link to="/create-gig">Post a gig</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {stats.map((item) => (
              <div key={item.label} className={cn("p-4 rounded-2xl border border-white/10 bg-gradient-to-br shadow-lg", item.tone)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <item.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70">{item.label}</p>
                    <p className="text-2xl font-heading font-bold text-white">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : (
          <Tabs defaultValue="assigned" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="assigned">Assigned to me</TabsTrigger>
              <TabsTrigger value="posted">My posted gigs</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="space-y-4">
              {assignedApplications.length === 0 ? (
                <Card className="border-dashed border-white/20 bg-white/5">
                  <CardContent className="py-10 text-center text-muted-foreground">No active gigs assigned to you yet.</CardContent>
                </Card>
              ) : (
                assignedApplications.map((app) =>
                  renderGigCard(
                    app.gig,
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>Application status: <span className="font-semibold text-white">{app.status}</span></span>
                      {app.expected_rate ? <span>Rate: {formatPrice(app.expected_rate)}</span> : null}
                    </div>,
                    app.gig?.status || app.status,
                    app.gig?.client_id
                  )
                )
              )}
            </TabsContent>

            <TabsContent value="posted" className="space-y-4">
              {postedGigs.length === 0 ? (
                <Card className="border-dashed border-white/20 bg-white/5">
                  <CardContent className="py-10 text-center text-muted-foreground">No active gigs you've posted.</CardContent>
                </Card>
              ) : (
                postedGigs.map((gig) =>
                  renderGigCard(
                    gig,
                    <div className="text-xs text-muted-foreground">
                      <span>{gig.worker?.username ? `Assigned to ${gig.worker.username}` : "Waiting for assignment"}</span>
                    </div>,
                    gig.status,
                    gig.worker?.id
                  )
                )
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AnimatedPage>
  );
};

export default ActiveGigs;
