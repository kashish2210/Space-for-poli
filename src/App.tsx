import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { AppNavbar } from "@/components/AppNavbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { JoinedGroupsProvider } from "@/contexts/JoinedGroupsContext";
import Index from "./pages/Index";
import MinistriesPage from "./pages/MinistriesPage";
import MinistryDetailPage from "./pages/MinistryDetailPage";
import CitiesPage from "./pages/CitiesPage";
import CityDetailPage from "./pages/CityDetailPage";
import PartiesPage from "./pages/PartiesPage";
import PartyDetailPage from "./pages/PartyDetailPage";
import RalliesPage from "./pages/RalliesPage";
import RallyRoomPage from "./pages/RallyRoomPage";
import StatesPage from "./pages/StatesPage";
import StateDetailPage from "./pages/StateDetailPage";
import ParliamentPage from "./pages/ParliamentPage";
import ParliamentDetailPage from "./pages/ParliamentDetailPage";
import AuthPage from "./pages/AuthPage";
import MunicipalityPage from "./pages/MunicipalityPage";
import MunicipalitiesListPage from "./pages/MunicipalitiesListPage";
import WardDetailPage from "./pages/WardDetailPage";
import BookmarksPage from "./pages/BookmarksPage";
import QASessionPage from "./pages/QASessionPage";
import EmergencyRoomPage from "./pages/EmergencyRoomPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({});

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/ministries/:id" element={<MinistryDetailPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/cities/:id" element={<CityDetailPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/parties" element={<PartiesPage />} />
          <Route path="/parties/:id" element={<PartyDetailPage />} />
          <Route path="/rallies" element={<RalliesPage />} />
          <Route path="/rallies/:id" element={<RallyRoomPage />} />
          <Route path="/qa/:sessionId" element={<QASessionPage />} />
          <Route path="/emergency/:cityId" element={<EmergencyRoomPage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/states/:id" element={<StateDetailPage />} />
          <Route path="/parliament" element={<ParliamentPage />} />
          <Route path="/parliament/:id" element={<ParliamentDetailPage />} />
          <Route path="/municipalities" element={<MunicipalitiesListPage />} />
          <Route path="/municipalities/:cityId" element={<MunicipalityPage />} />
          <Route path="/municipalities/:cityId/ward/:wardId" element={<WardDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';

  if (isAuth) {
    return (
      <main className="min-h-screen relative z-0">
        <AnimatedRoutes />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <AppNavbar />
      {/* Global Background Image */}
      <div className="fixed inset-0 z-[-2] w-full h-full overflow-hidden bg-black">
        <img
          src="/image.png"
          alt="Background"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70"
        />
        {/* Dark gradient overlay + slight blur for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F19]/80 via-[#0B0F19]/40 to-[#0B0F19]/80 backdrop-blur-[3px] pointer-events-none"></div>
      </div>
      <main className="md:ml-[240px] min-h-screen relative z-0">
        <AnimatedRoutes />
      </main>
    </ProtectedRoute>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <JoinedGroupsProvider>
              {showSplash ? (
                <SplashScreen onComplete={() => setShowSplash(false)} />
              ) : (
                <AppContent />
              )}
            </JoinedGroupsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
