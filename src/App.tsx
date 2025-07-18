
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/gigs" element={<MainLayout><Gigs /></MainLayout>} />
            <Route path="/gigs/:id" element={<MainLayout><GigDetail /></MainLayout>} />
            <Route path="/create-gig" element={<MainLayout><CreateGig /></MainLayout>} />
            <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
            <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="/rewards" element={<MainLayout><Rewards /></MainLayout>} />
            
            {/* Tools routes */}
            <Route path="/tools" element={<MainLayout><Tools /></MainLayout>} />
            <Route path="/tools/invoicing" element={<MainLayout><Invoicing /></MainLayout>} />
            <Route path="/tools/time-tracking" element={<MainLayout><TimeTracking /></MainLayout>} />
            <Route path="/tools/project-management" element={<MainLayout><ProjectManagement /></MainLayout>} />
            <Route path="/tools/schedule-planner" element={<MainLayout><SchedulePlanner /></MainLayout>} />
            <Route path="/tools/contracts" element={<MainLayout><Contracts /></MainLayout>} />
            <Route path="/tools/trustlock" element={<MainLayout><TrustLock /></MainLayout>} />
            <Route path="/tools/analytics" element={<MainLayout><Analytics /></MainLayout>} />
            
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
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
