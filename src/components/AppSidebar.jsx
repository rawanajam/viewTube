import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  Code, // ✅ <-- make sure this line is included
  Download,
  icons,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Explore", icon: Compass, url: "#" },
  { title: "Subscriptions", icon: PlaySquare, url: "#" },
];

const libraryItems = [
  { title: "History", icon: Clock, url: "#" },
  { title: "Liked Videos", icon: ThumbsUp, url: "#" },
  { title: "Downloads", icon: Download, url:'#'},
];

const exploreItems = [
  { title: "Trending", icon: Flame, url: "#" },
  { title: "Music", icon: Music, url: "/category/music" },
  { title: "Gaming", icon: Gamepad2, url: "/category/gaming" },
  { title: "Programming", icon: Code, url: "/category/programming" }, // ✅ now works
  { title: "News", icon: Newspaper, url: "/category/news" },
  { title: "Sports", icon: Trophy, url: "/category/sports" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border pt-14">
      <SidebarContent>
        {/* MAIN */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-youtube-hover">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* LIBRARY */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-youtube-hover">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* EXPLORE */}
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exploreItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-youtube-hover">
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
