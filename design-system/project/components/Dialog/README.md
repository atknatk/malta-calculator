# Dialog

A Radix modal dialog (`ui/dialog.tsx`): a centred `background` panel up to 512px wide, with a black 80% overlay, a close ✕ and Header, Title, Description and Footer parts.

- **Use** to confirm destructive or irreversible actions (deleting an employee, cancelling a plan) and for short focused forms.
- **Consumer provides:** `open`/`onOpenChange`, a `DialogTrigger`, and `DialogContent` holding `DialogHeader` (`DialogTitle` + `DialogDescription`) and a `DialogFooter` with the actions: the safe one as `outline`, the main one last.
- The preview opens it non-modally so the page stays usable. In the app it's modal.
