import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";

function SearchCommand() {
  return (
    <CommandDialog>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem>
            Home
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem>
            Preferences
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Logout
            <CommandShortcut>⇧⌘Q</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
