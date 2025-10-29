import { Search, Menu, Video, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";

export const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background px-4 h-14">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-youtube-hover"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <Video className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">ViewTube</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search"
              className="w-full bg-secondary border-border pl-4 pr-4 h-10 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Button size="icon" className="bg-secondary hover:bg-youtube-hover border border-border">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hover:bg-youtube-hover">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-youtube-hover">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-youtube-hover">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
