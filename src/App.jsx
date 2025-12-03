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
import CategoryPage from "./pages/CategoryPage";
import VideoPage from "./pages/VideoPage";
import LoginPage from "./pages/LoginPage";
import LikedVideosPage from "./pages/LikedVideosPage";
import DownloadsPage from "./pages/DownloadsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import ChannelPage from "./pages/ChannelPage";
import TrendingPage from "./pages/TrendingPage";
import ExplorePage from "./pages/ExplorePage";
import HistoryPage from "./pages/HistoryPage";
import UserHomePage from "./UserHomePage";
import CreateChannelPage from "./CreateChannelPage";
import CreateVideoPage from "./CreateVideoPage";
import ChannelVideoPage from "./pages/ChannelVideoPage";
import EditProfile from "./pages/EditProfile";
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
                  <Route path="/liked-videos" element={<LikedVideosPage />} />
                  <Route path="/subscriptions" element={<SubscriptionsPage />} />
                  <Route path="/downloads" element={<DownloadsPage />} />
                  <Route path="/channel/:id" element={<ChannelPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/user-home" element={<UserHomePage />} />
                  <Route path="/create-channel" element={<CreateChannelPage />} />
                  <Route path="/create-video" element={<CreateVideoPage />} />
                  <Route path="/channel/video/:id" element={<ChannelVideoPage />} />
                  <Route path="/edit-profile" element={<EditProfile/>} />
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
