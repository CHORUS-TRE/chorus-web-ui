# CHORUS Design System Reference

Developer-facing reference for the consolidated design system.

## Import Conventions

| What | Import from |
|------|-------------|
| UI primitives (Button, Card, Link, Dialog) | `@/components/ui/*` |
| Composed app components | `@/components/*` |
| Hooks | `@/hooks/*` |
| Providers | `@/providers/*` |
| Domain models | `@/domain/*` |
| View models | `@/view-model/*` |
| Config | `@/config/*` |
| Utils | `@/lib/*` |

**Enforced by ESLint:** `~/` imports are banned. Old wrapper paths (`@/components/button`, `@/components/card`, `@/components/link`, `@/components/nav-link`) are banned.

## Button — `@/components/ui/button`

| Variant | Purpose |
|---------|---------|
| `default` | Primary action (blue) |
| `destructive` | Delete/danger |
| `outline` | Secondary bordered |
| `secondary` | Muted secondary |
| `ghost` | No background, accent on hover |
| `link` | Inline tab-style button |
| `link-underline` | Inline with underline on hover |
| `accent-ring` | Lime accent outline CTA |
| `accent-filled` | Lime accent filled CTA (light) / outline (dark) |

**Sizes:** `default`, `sm`, `lg`, `icon`, `xs`

## Card — `@/components/ui/card`

| Variant | Purpose |
|---------|---------|
| `default` | Standard card (`bg-card`) |
| `glass` | Glassmorphism surface |
| `elevated` | Raised card with shadow |

**Sub-components:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`

## Link — `@/components/ui/link`

| Variant | Purpose |
|---------|---------|
| `default` | Standard navigation link |
| `nav` | Navigation bar links |
| `muted` | De-emphasized, semibold underline |
| `flex` | Flex container link with gap |
| `rounded` | Rounded hover area |
| `plain` | No styling |
| `underline` | Underlined text link |

Wraps Next.js `Link` with active-state awareness.

## Dialog — `@/components/ui/dialog`

shadcn primitive. For the "add button + dialog" pattern, use `@/components/add-dialog`.

## Color Tokens

Use semantic tokens only — no Tailwind palette colors (`text-blue-600`) or hex values.

| Token | Purpose |
|-------|---------|
| `primary` / `primary-foreground` | Brand blue |
| `accent` / `accent-foreground` | Lime accent |
| `secondary` | Cyan |
| `muted` / `muted-foreground` | De-emphasized |
| `destructive` | Error/delete |
| `border`, `input`, `ring` | Borders, inputs, focus |
| `background` / `foreground` | Page bg/text |
| `card` / `card-foreground` | Card surfaces |

## Border Radius

| Tier | Class | Usage |
|------|-------|-------|
| Small | `rounded-md` | Inputs, badges |
| Medium | `rounded-lg` | Cards, panels, dialogs |
| Full | `rounded-full` | Chips, avatars |

## Shadows

| Tier | Class | Usage |
|------|-------|-------|
| Subtle | `shadow-sm` | Cards, surfaces |
| Elevated | `shadow-md` | Popovers, dialogs |

## Interactive States

| Pattern | Class | Usage |
|---------|-------|-------|
| Row hover | `hover:bg-accent/5` | Table rows, list items |
| Button hover | `hover:bg-accent/10` | Clickable elements |
| Active/selected | `bg-primary/20 text-primary` | Active nav, selected |
| Disabled | `text-muted-foreground/40` | Disabled items |

## Glassmorphism

| Class | Purpose |
|-------|---------|
| `glass-surface` | Semi-transparent with blur |
| `glass-elevated` | More opaque with shadow |
| `glass-popover` | Dropdowns/modals |
| `card-glass` | Card variant |
| `card-elevated` | Card variant |
