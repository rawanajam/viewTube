import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

function FileContextMenu() {
  const [showHidden, setShowHidden] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("list");

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="p-4 border rounded-md">Right-click me</div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuLabel inset>File Options</ContextMenuLabel>

        <ContextMenuItem>
          Open
          <ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          Save As...
          <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuCheckboxItem
          checked={showHidden}
          onCheckedChange={() => setShowHidden(!showHidden)}
        >
          Show Hidden Files
        </ContextMenuCheckboxItem>

        <ContextMenuSeparator />

        <ContextMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
          <ContextMenuRadioItem value="list">List View</ContextMenuRadioItem>
          <ContextMenuRadioItem value="grid">Grid View</ContextMenuRadioItem>
        </ContextMenuRadioGroup>

        <ContextMenuSub>
          <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Option A</ContextMenuItem>
            <ContextMenuItem>Option B</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
