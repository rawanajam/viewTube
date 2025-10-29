import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ExampleDropdown() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedView, setSelectedView] = useState("grid");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={showNotifications}
          onCheckedChange={() => setShowNotifications(!showNotifications)}
        >
          Show Notifications
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>View Mode</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioItem
              checked={selectedView === "grid"}
              onSelect={() => setSelectedView("grid")}
            >
              Grid
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              checked={selectedView === "list"}
              onSelect={() => setSelectedView("list")}
            >
              List
            </DropdownMenuRadioItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
