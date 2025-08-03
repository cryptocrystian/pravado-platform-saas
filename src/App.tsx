
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ContentMarketing from "./pages/ContentMarketing";
import PublicRelations from "./pages/PublicRelations";
import MediaDatabase from "./pages/MediaDatabase";
import SEOIntelligence from "./pages/SEOIntelligence";
import AICitations from "./pages/AICitations";
import Analytics from "./pages/Analytics";
import CiteMind from "./pages/CiteMind";
import Settings from "./pages/Settings";
import AITesting from "./pages/AITesting";
import NotFound from "./pages/NotFound";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import AutomateHub from "./pages/AutomateHub";
import AutomateHubEnhanced from "./pages/AutomateHubEnhanced";
import AutomateAIEnhanced from "./pages/AutomateAIEnhanced";
import ContentMarketingEnhanced from "./pages/ContentMarketingEnhanced";
import SEOIntelligenceEnhanced from "./pages/SEOIntelligenceEnhanced";
import SEOIntelligencePro from "./pages/SEOIntelligencePro";
import UnifiedCampaigns from "./pages/UnifiedCampaigns";
import PodcastSyndication from "./pages/PodcastSyndication";
import AssessAudit from "./pages/AssessAudit";
import HelpCenter from "./pages/HelpCenter";
import BetaProgram from "./pages/BetaProgram";
import CustomerSuccess from "./pages/CustomerSuccess";
import Demo from "./pages/Demo";
import ROICalculatorPage from "./pages/ROICalculatorPage";
import SuccessStories from "./pages/SuccessStories";

const queryClient = new QueryClient();

const App = () => {
  // Enable dark mode by default for PRAVADO's professional aesthetic
  useEffect(() => {
    // Apply dark mode class to document
    document.documentElement.classList.add('dark');
    
    // Apply dark theme background immediately
    document.body.style.backgroundColor = '#111827'; // Dark background
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/roi-calculator" element={<ROICalculatorPage />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/ai-testing" element={<AITesting />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="/campaigns/:id" element={
              <ProtectedRoute>
                <CampaignDetail />
              </ProtectedRoute>
            } />
            <Route path="/unified-campaigns" element={
              <ProtectedRoute>
                <UnifiedCampaigns />
              </ProtectedRoute>
            } />
            <Route path="/content-marketing" element={
              <ProtectedRoute>
                <ContentMarketing />
              </ProtectedRoute>
            } />
            <Route path="/content-marketing-enhanced" element={
              <ProtectedRoute>
                <ContentMarketingEnhanced />
              </ProtectedRoute>
            } />
            <Route path="/public-relations" element={
              <ProtectedRoute>
                <PublicRelations />
              </ProtectedRoute>
            } />
            <Route path="/media-database" element={
              <ProtectedRoute>
                <MediaDatabase />
              </ProtectedRoute>
            } />
            <Route path="/seo-intelligence" element={
              <ProtectedRoute>
                <SEOIntelligence />
              </ProtectedRoute>
            } />
            <Route path="/seo-intelligence-enhanced" element={
              <ProtectedRoute>
                <SEOIntelligenceEnhanced />
              </ProtectedRoute>
            } />
            <Route path="/seo-intelligence-pro" element={
              <ProtectedRoute>
                <SEOIntelligencePro />
              </ProtectedRoute>
            } />
            <Route path="/ai-citations" element={
              <ProtectedRoute>
                <AICitations />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/citemind" element={
              <ProtectedRoute>
                <CiteMind />
              </ProtectedRoute>
            } />
            <Route path="/automate" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate-enhanced" element={
              <ProtectedRoute>
                <AutomateHubEnhanced />
              </ProtectedRoute>
            } />
            <Route path="/automate-ai-enhanced" element={
              <ProtectedRoute>
                <AutomateAIEnhanced />
              </ProtectedRoute>
            } />
            <Route path="/podcast-syndication" element={
              <ProtectedRoute>
                <PodcastSyndication />
              </ProtectedRoute>
            } />
            <Route path="/automate/assess-audit" element={
              <ProtectedRoute>
                <AssessAudit />
              </ProtectedRoute>
            } />
            <Route path="/automate/understand-audience" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/target-strategy" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/optimize-systems" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/measure-monitor" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/accelerate-growth" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/transform-evolve" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/automate/execute-excellence" element={
              <ProtectedRoute>
                <AutomateHub />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <HelpCenter />
              </ProtectedRoute>
            } />
            <Route path="/beta" element={
              <ProtectedRoute>
                <BetaProgram />
              </ProtectedRoute>
            } />
            <Route path="/customer-success" element={
              <ProtectedRoute>
                <CustomerSuccess />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
