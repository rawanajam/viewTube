import { Home, Compass, PlaySquare, Clock, ThumbsUp, Flame, Music, Gamepad2, Newspaper, Trophy } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Explore", icon: Compass, url: "#" },
  { title: "Subscriptions", icon: PlaySquare, url: "#" },
];

const libraryItems = [
  { title: "History", icon: Clock, url: "#" },
  { title: "Liked Videos", icon: ThumbsUp, url: "#" },
];

const exploreItems = [
  { title: "Trending", icon: Flame, url: "#" },
  { title: "Music", icon: Music, url: "#" },
  { title: "Gaming", icon: Gamepad2, url: "#" },
  { title: "News", icon: Newspaper, url: "#" },
  { title: "Sports", icon: Trophy, url: "#" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border pt-14">
      <SidebarContent>
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
