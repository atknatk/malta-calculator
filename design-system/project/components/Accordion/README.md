# Accordion

A Radix accordion (`ui/accordion.tsx`) with `border`-ruled items, a 16px medium trigger that underlines on hover, and a chevron that rotates 180° when open.

- **Use** for FAQs (pair with `CustomFAQJsonLd`) and collapsible explanations under results.
- **Consumer provides:** `type` (`single`/`multiple`) and `AccordionItem`s, each with a `value`, `AccordionTrigger` and `AccordionContent`.
- Open and close animate height over 0.2s ease-out.
