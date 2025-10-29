import React from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function ExampleDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is the description inside the drawer. You can put any content here.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <p>Main content goes here. You can put forms, lists, or other components.</p>
        </div>

        <DrawerFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DrawerFooter>

        {/* Optional close button */}
        <DrawerClose asChild>
          <Button className="absolute top-4 right-4">X</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
