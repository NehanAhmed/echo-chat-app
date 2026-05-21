# Design System — echo-chat-app

## Philosophy

Clean, airy, premium. Every element earns its space. Nothing feels busy.

- **White space is a feature.** Generous padding, loose layouts, lots of breathing room.
- **No gradients, no funky backgrounds, no visual overload.** Flat colors, subtle borders, clean surfaces.
- **Dark mode is equal quality, not an afterthought.** Both themes get same attention to contrast and hierarchy.
- **Micro-motion is the only motion.** Small, purposeful transitions that feel tactile and responsive — never decorative or cinematic.

---

## Typography

| Role | Font | Weight |
|------|------|--------|
| Body / UI | `DM Sans Variable` | 400 (regular), 500 (medium) |
| Headings | `Montserrat Variable` | 500 (medium), 600 (semibold), 700 (bold) |

- Use `font-sans` (DM Sans) for all UI text by default.
- Use `font-heading` (Montserrat) for headings, titles, large hero text only.
- Line-height: tight for headings (`leading-tight`), relaxed for body (`leading-relaxed`).
- Font sizes: prefer `text-xs` (12px) for labels/metadata, `text-sm` (14px) for body, `text-base` (16px) for large body, `text-lg`+ for headings.

---

## Colors (Tailwind theme tokens)

All colors are defined as CSS variables in `index.css` and mapped via `@theme inline`. **Use only these semantic tokens — never raw hex/oklch values.**

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-background` | White (`oklch(1 0 0)`) | Near-black (`oklch(0.147...)`) | Page background |
| `text-foreground` | Dark gray | Near-white | Primary body text |
| `bg-card` | White | Dark card | Card, container surfaces |
| `text-card-foreground` | Dark gray | Near-white | Text on card |
| `bg-primary` | Green | Green (darker) | Primary actions, active states, key accents |
| `text-primary-foreground` | White | White | Text on primary bg |
| `bg-secondary` | Light warm | Dark warm | Subtle surfaces, secondary actions |
| `text-secondary-foreground` | Dark | White | Text on secondary |
| `bg-muted` | Off-white | Dark muted | Hover states, subtle backgrounds |
| `text-muted-foreground` | Warm gray | Warm gray-light | Secondary text, placeholders, captions |
| `bg-accent` | Green | Green (darker) | Highlights, tags, badges (same as primary) |
| `text-accent-foreground` | White | White | Text on accent bg |
| `border-border` | Light border | White/10% | Dividers, card borders, input borders |
| `ring-ring` | Warm gray | Warm gray | Focus rings, active indicators |
| `bg-destructive` | Red tint | Red tint | Destructive actions, errors |
| `text-destructive` | Red | Red light | Error text, delete labels |

### Color rules

- **Primary = green. Do not change.** It is the single accent color.
- Use `bg-muted` / `text-muted-foreground` for anything secondary (timestamps, subtext, disabled states).
- Borders should be subtle: `border-border` only, never strong strokes.
- Focus rings: always use `focus-visible:ring-2 focus-visible:ring-ring/30`.

---

## Spacing & Layout

- Default padding: `p-4` (16px) minimum on containers, `p-6` (24px) for cards/dialogs.
- Gap between related elements: `gap-2` (8px) or `gap-3` (12px).
- Gap between sections: `gap-6` (24px) or `gap-8` (32px).
- Max width for content panels: `max-w-lg` (512px) or `max-w-xl` (576px). Never full-width for reading content.
- **Generous whitespace over cramped layouts.** When in doubt, add more padding.

---

## Border Radius

Use `rounded-lg` (10px) for cards and containers by default.
Smaller elements: `rounded-md` (8px), `rounded-sm` (6px).
Pills/tags: `rounded-full`.

---

## shadcn/ui Components

### Usage rules

- Use only components from `@/components/ui/`. Do not create custom styled components outside this directory.
- **Do not modify** the internal structure, variants, or CSS of existing shadcn components (button, dialog, input, etc.).
- Composition is preferred over customization. Layer shadcn components using standard React patterns (wrapping, `asChild`, etc.).
- If a shadcn component doesn't exist yet, add it via `pnpm dlx shadcn@latest add <component>` to get the canonical version.

### Adding new components

```bash
pnpm dlx shadcn@latest add <component-name> --yes
```

This installs the component into `@/components/ui/` with the project's preset (radix-mira style, CSS variables). Do not hand-write UI primitives.

### Override pattern

When you need different styling for a shadcn component, wrap it in a parent div/container and apply classes there, or compose it with className. Example:

```tsx
// Good — compose via className
<div className="space-y-1">
  <Label htmlFor="name">Name</Label>
  <Input id="name" className="bg-muted" />
</div>

// BAD — do not copy and rewrite the shadcn component
```

---

## Shadows & Elevation

- Cards: `shadow-sm` for subtle separation.
- Modals/dialogs: `shadow-lg` or `shadow-xl`.
- Dropdowns/popovers: `shadow-md`.
- No heavy or colored shadows. Keep them diffused and neutral.

---

## Animation & Motion

### Principles

- Motion must feel **tactile and responsive**, not flashy.
- Only animate `transform` and `opacity`. Never layout properties.
- **Enter**: slightly slower (200–300ms). **Exit**: faster (150–200ms).
- Use CSS transitions by default. Use Framer Motion only when you need spring physics or gesture-driven animation.

### Timing reference

| Element | Duration | Easing |
|---------|----------|--------|
| Hover state (color shift) | 150–200ms | `ease` |
| Button press | 100–160ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Panel/drawer slide | 250–300ms | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Dialog/modal entrance | 200–300ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Staggered list (per item) | 30–50ms | `ease-out` (max 300ms total stagger) |

### Micro-interactions

Every interactive element must respond on hover/click:

- **Buttons**: `hover:bg-primary/80` with 150ms transition on background. On click: subtle `translate-y-px` press effect (already built into the shadcn button variant).
- **Cards/rows**: `hover:bg-muted` with 150ms transition. Optional subtle `hover:-translate-y-0.5` with `shadow-sm` → `shadow-md` for actionable cards.
- **Inputs**: border color transition from `border-border` to `ring-ring` on focus (built into shadcn).
- **List items**: `hover:bg-muted` with 150ms transition.
- **Presence indicators**: smooth opacity crossfade on enter/leave.

### What NOT to animate

- Page transitions (not yet — keep it simple).
- Decorative floating/rotating elements.
- Anything that triggers layout (width, height, top, left).
- Looping animations.

---

## Iconography

- Use `@hugeicons/react` exclusively. The project is configured with `"iconLibrary": "hugeicons"` in `components.json`.
- Icon size: `size-4` (16px) for inline icons, `size-5` (20px) for standalone.
- Icon color: inherit from text color (`currentColor`). Do not set explicit icon colors.

---

## Dark Mode

- Supported via `.dark` class on `<html>`.
- The `ThemeProvider` component in `@/components/theme-provider.tsx` handles toggling.
- All design tokens already have dark variants in `index.css`. Do not add inline dark overrides.
- Test every component/ page in both modes before considering it done.

---

## Do Not

- Do not add gradients, heavy shadows, animated backgrounds, or decorative flourishes.
- Do not use raw color values (hex, oklch, rgb) in component code — always use Tailwind semantic tokens.
- Do not modify shadcn component source files.
- Do not create custom UI primitives — use shadcn's or extend via composition.
- Do not animate for the sake of animating. Every transition must serve feedback or orientation.
- Do not use `ease-in` for entrances — it feels sluggish. Prefer the custom curves from the timing table.
