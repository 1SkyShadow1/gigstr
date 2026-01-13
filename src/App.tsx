import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { Suspense, lazy } from "react";

import MainLayout from "./layouts/MainLayout";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import Loader from "./components/ui/loader";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Gigs = lazy(() => import("./pages/Gigs"));
const GigDetail = lazy(() => import("./pages/GigDetail"));
const ActiveGigs = lazy(() => import("./pages/ActiveGigs"));
const CreateGig = lazy(() => import("./pages/CreateGig"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Help = lazy(() => import("./pages/Help"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Rewards = lazy(() => import("./pages/Rewards"));
const Tools = lazy(() => import("./pages/Tools"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

// Tool pages
const Invoicing = lazy(() => import("./pages/tools/Invoicing"));
const ProjectManagement = lazy(() => import("./pages/tools/ProjectManagement"));
const Contracts = lazy(() => import("./pages/tools/Contracts"));
const TrustLock = lazy(() => import("./pages/tools/TrustLock"));
const Analytics = lazy(() => import("./pages/tools/Analytics"));
const ProposalAI = lazy(() => import("./pages/tools/ProposalAI"));
const ClientCommandCenter = lazy(() => import("./pages/tools/ClientCommandCenter"));
const PricingScopeEngine = lazy(() => import("./pages/tools/PricingScopeEngine"));
const TaxVault = lazy(() => import("./pages/tools/TaxVault"));
const FocusTimer = lazy(() => import("./pages/tools/FocusTimer"));
const ShowcaseBuilder = lazy(() => import("./pages/tools/ShowcaseBuilder"));
const SyncUp = lazy(() => import("./pages/tools/SyncUp"));
const RateArchitect = lazy(() => import("./pages/tools/RateArchitect"));
const TeamBridge = lazy(() => import("./pages/tools/TeamBridge"));

const queryClient = new QueryClient();

function PublicRoute({ children }: { children: React.ReactElement }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  
  // If user has a profile but hasn't completed onboarding, and isn't already on the onboarding page
  if (profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has completed onboarding and tries to access onboarding page
  if (profile && profile.onboarding_completed && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <PWAInstallPrompt />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
              <Route path="/active-gigs" element={<PrivateRoute><MainLayout><ActiveGigs /></MainLayout></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><MainLayout><Profile /></MainLayout></PrivateRoute>} />
              <Route path="/profile/:id" element={<PrivateRoute><MainLayout><Profile /></MainLayout></PrivateRoute>} />
              <Route path="/gigs" element={<PrivateRoute><MainLayout><Gigs /></MainLayout></PrivateRoute>} />
              <Route path="/gigs/:id" element={<PrivateRoute><MainLayout><GigDetail /></MainLayout></PrivateRoute>} />
              <Route path="/create-gig" element={<PrivateRoute><MainLayout><CreateGig /></MainLayout></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><MainLayout><Messages /></MainLayout></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><MainLayout><Notifications /></MainLayout></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><MainLayout><Settings /></MainLayout></PrivateRoute>} />
              <Route path="/rewards" element={<PrivateRoute><MainLayout><Rewards /></MainLayout></PrivateRoute>} />
              {/* Tools routes */}
              <Route path="/tools" element={<PrivateRoute><MainLayout><Tools /></MainLayout></PrivateRoute>} />
              <Route path="/tools/invoicing" element={<PrivateRoute><MainLayout><Invoicing /></MainLayout></PrivateRoute>} />
              <Route path="/tools/project-management" element={<PrivateRoute><MainLayout><ProjectManagement /></MainLayout></PrivateRoute>} />
              <Route path="/tools/contracts" element={<PrivateRoute><MainLayout><Contracts /></MainLayout></PrivateRoute>} />
              <Route path="/tools/trustlock" element={<PrivateRoute><MainLayout><TrustLock /></MainLayout></PrivateRoute>} />
              <Route path="/tools/proposal-ai" element={<PrivateRoute><MainLayout><ProposalAI /></MainLayout></PrivateRoute>} />
              <Route path="/tools/analytics" element={<PrivateRoute><MainLayout><Analytics /></MainLayout></PrivateRoute>} />
              <Route path="/tools/client-center" element={<PrivateRoute><MainLayout><ClientCommandCenter /></MainLayout></PrivateRoute>} />
              <Route path="/tools/pricing-scope" element={<PrivateRoute><MainLayout><PricingScopeEngine /></MainLayout></PrivateRoute>} />
              <Route path="/tools/tax-vault" element={<PrivateRoute><MainLayout><TaxVault /></MainLayout></PrivateRoute>} />
              <Route path="/tools/focus-timer" element={<PrivateRoute><MainLayout><FocusTimer /></MainLayout></PrivateRoute>} />
              <Route path="/tools/showcase" element={<PrivateRoute><MainLayout><ShowcaseBuilder /></MainLayout></PrivateRoute>} />
              <Route path="/tools/sync-up" element={<PrivateRoute><MainLayout><SyncUp /></MainLayout></PrivateRoute>} />
              <Route path="/tools/rate-architect" element={<PrivateRoute><MainLayout><RateArchitect /></MainLayout></PrivateRoute>} />
              <Route path="/tools/team-bridge" element={<PrivateRoute><MainLayout><TeamBridge /></MainLayout></PrivateRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/community" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/tutorials" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/partners" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/careers" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/blog" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/press" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/security" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/cookies" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/accessibility" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="/sitemap" element={<MainLayout><NotFound /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
