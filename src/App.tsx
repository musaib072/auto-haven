import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ScrollManager } from "@/components/layout/ScrollManager";
import Index from "./pages/Index";

const Browse = lazy(() => import("./pages/Browse"));
const CarDetail = lazy(() => import("./pages/CarDetail"));
const Sell = lazy(() => import("./pages/Sell"));
const CarSpa = lazy(() => import("./pages/CarSpa"));
const Inspectify = lazy(() => import("./pages/Inspectify"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Legal = lazy(() => import("./pages/Legal"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollManager />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/buy" element={<Browse />} />
              <Route path="/car/:id" element={<CarDetail />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/car-spa" element={<CarSpa />} />
              <Route path="/inspectify" element={<Inspectify />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Legal kind="privacy" />} />
              <Route path="/terms" element={<Legal kind="terms" />} />
              <Route path="/admin" element={<Admin />} />
              {/* Legacy URLs */}
              <Route path="/browse" element={<Navigate to="/buy" replace />} />
              <Route path="/service" element={<Navigate to="/car-spa" replace />} />
              <Route path="/how-it-works" element={<Navigate to="/about" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
