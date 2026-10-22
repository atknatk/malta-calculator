# Tooltip

A Radix tooltip (`ui/tooltip.tsx`): a `popover` surface, `border`, `radius-md`, 14px text, 4px offset, with fade and zoom in.

- **Use** to explain a term or figure next to an info icon. Never put content the user needs only in a tooltip.
- **Consumer provides:** a `TooltipProvider` at the root, then `Tooltip` > `TooltipTrigger` + `TooltipContent`.
