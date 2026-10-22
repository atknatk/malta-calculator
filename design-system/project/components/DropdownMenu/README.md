# DropdownMenu

A Radix dropdown menu (`ui/dropdown-menu.tsx`) on a `popover` surface, with items, checkbox and radio items, labels, separators, shortcuts and submenus.

- **Use** for secondary actions behind one trigger, such as Export or row actions in the employee table.
- **Consumer provides:** `DropdownMenu` > `DropdownMenuTrigger` (usually `asChild` with a `Button`) + `DropdownMenuContent` holding the items. `DropdownMenuShortcut` right-aligns a key hint.
- Items highlight in `accent`. Keep labels in Title Case and put destructive items last.
