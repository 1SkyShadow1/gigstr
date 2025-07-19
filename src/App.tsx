
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { useState, useEffect } from "react";

import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import CreateGig from "./pages/CreateGig";
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

// Tool pages
import Invoicing from "./pages/tools/Invoicing";
import TimeTracking from "./pages/tools/TimeTracking";
import ProjectManagement from "./pages/tools/ProjectManagement";
import SchedulePlanner from "./pages/tools/SchedulePlanner";
import Contracts from "./pages/tools/Contracts";
import TrustLock from "./pages/tools/TrustLock";
import Analytics from "./pages/tools/Analytics";

const queryClient = new QueryClient();

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
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
            <Route path="/tools/time-tracking" element={<PrivateRoute><MainLayout><TimeTracking /></MainLayout></PrivateRoute>} />
            <Route path="/tools/project-management" element={<PrivateRoute><MainLayout><ProjectManagement /></MainLayout></PrivateRoute>} />
            <Route path="/tools/schedule-planner" element={<PrivateRoute><MainLayout><SchedulePlanner /></MainLayout></PrivateRoute>} />
            <Route path="/tools/contracts" element={<PrivateRoute><MainLayout><Contracts /></MainLayout></PrivateRoute>} />
            <Route path="/tools/trustlock" element={<PrivateRoute><MainLayout><TrustLock /></MainLayout></PrivateRoute>} />
            <Route path="/tools/analytics" element={<PrivateRoute><MainLayout><Analytics /></MainLayout></PrivateRoute>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/help" element={<MainLayout><Help /></MainLayout>} />
            <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
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
