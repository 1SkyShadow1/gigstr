import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";

import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import ActiveGigs from "./pages/ActiveGigs";
import CreateGig from "./pages/CreateGig";
import ResetPassword from "./pages/ResetPassword";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Rewards from "./pages/Rewards";
import Tools from "./pages/Tools";
import AuthCallback from "./pages/AuthCallback";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

// Tool pages
import Invoicing from "./pages/tools/Invoicing";
import TimeTracking from "./pages/tools/TimeTracking";
import ProjectManagement from "./pages/tools/ProjectManagement";
import SchedulePlanner from "./pages/tools/SchedulePlanner"; // Deleted
import Contracts from "./pages/tools/Contracts";
import TrustLock from "./pages/tools/TrustLock";
import Analytics from "./pages/tools/Analytics";
import ProposalAI from "./pages/tools/ProposalAI";
import ClientCommandCenter from "./pages/tools/ClientCommandCenter";
import PricingScopeEngine from "./pages/tools/PricingScopeEngine";
import TaxVault from "./pages/tools/TaxVault";
import FocusTimer from "./pages/tools/FocusTimer";
import ShowcaseBuilder from "./pages/tools/ShowcaseBuilder";
import SyncUp from "./pages/tools/SyncUp";
import RateArchitect from "./pages/tools/RateArchitect";
import TeamBridge from "./pages/tools/TeamBridge";

const queryClient = new QueryClient();

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function PrivateRoute({ children }) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  
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
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
