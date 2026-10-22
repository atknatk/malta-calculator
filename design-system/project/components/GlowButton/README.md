# GlowButton

The hero call to action: a gold `gradient-primary` fill with `shadow-btn-glow`, a shine sweep on hover and a 2px lift. It's paired with a glass secondary button.

- **Use** once, in the home or landing hero only, for the single action the page exists for ("Calculate Now").
- **Consumer provides:** a label and an optional trailing 20px Lucide icon (ArrowDown bounces in the hero). In the codebase it's a plain element with `className="btn-glow … rounded-2xl px-8 py-4 text-white font-semibold text-lg"`, not a React component.
- The partner button is `.glass` with a `border/50` hairline and `radius-2xl` at the same size.
- **Don't** use it inside calculators or forms; use `Button` there. White on the gradient's first stop is 3.27:1, so the label must stay 18px semibold or larger.
