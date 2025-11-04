import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchResults from "./components/SearchResults";
import CategoryPage from "./CategoryPage";
import VideoPage from "./pages/VideoPage";
import LoginPage from "./pages/LoginPage";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1">
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchResults/>}/>
                  <Route path="/category/:category" element={<CategoryPage/>}/>
                  <Route path="/video/:id" element={<VideoPage/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  {/* Add your other routes here */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
