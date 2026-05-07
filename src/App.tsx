import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const Intervu = lazy(() => import("./pages/Intervu"));
const MMCCLanding = lazy(() => import("./pages/mmcc/Landing"));
const MMCCAuth = lazy(() => import("./pages/mmcc/Auth"));
const MMCCDashboard = lazy(() => import("./pages/mmcc/Dashboard"));
const MMCCQuiz = lazy(() => import("./pages/mmcc/Quiz"));
const MMCCRoadmap = lazy(() => import("./pages/mmcc/Roadmap"));
const MMCCCheckout = lazy(() => import("./pages/mmcc/Checkout"));
const MMCCAdmin = lazy(() => import("./pages/mmcc/AdminPanel"));
const ProtectedRoute = lazy(() => import("./pages/mmcc/ProtectedRoute"));

const queryClient = new QueryClient();

const Fallback = <div className="min-h-screen bg-background" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={Fallback}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/intervu" element={<Intervu />} />
              <Route path="/challenge" element={<Intervu />} />

              {/* MindMap Career Compass */}
              <Route path="/MindMapCareerCompass" element={<MMCCLanding />} />
              <Route path="/mindmap-career-compass" element={<Navigate to="/MindMapCareerCompass" replace />} />
              <Route path="/MindMapCareerCompass/auth" element={<MMCCAuth />} />
              <Route path="/MindMapCareerCompass/quiz" element={<MMCCQuiz />} />
              <Route path="/MindMapCareerCompass/roadmap" element={<MMCCRoadmap />} />
              <Route path="/MindMapCareerCompass/checkout" element={<ProtectedRoute><MMCCCheckout /></ProtectedRoute>} />
              <Route path="/MindMapCareerCompass/dashboard" element={<ProtectedRoute><MMCCDashboard /></ProtectedRoute>} />
              <Route path="/MindMapCareerCompass/admin" element={<ProtectedRoute><MMCCAdmin /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
