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
| `primary` / `primary-foreground` | Brand blue — structural, identity |
| `accent` / `accent-foreground` | Lime — CTAs, active states, attention |
| `secondary` | Aliased to muted (legacy — do not use directly) |
| `muted` / `muted-foreground` | De-emphasized surfaces & text |
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

See `color-behavior-spec.md` for full rules. Summary:

| Element | Hover | Active/Selected |
|---------|-------|-----------------|
| Link (body) | `text-accent` | — |
| Link (nav/sidebar) | `text-accent` | `bg-accent/15 text-accent` |
| Row | `hover:bg-muted/10` | `bg-accent/10 text-accent` |
| Card (clickable) | `hover:border-accent/40` | — |
| Tab/filter (active) | — | `bg-accent text-accent-foreground` |
| Disabled | `opacity-50 pointer-events-none` | — |

**Rules:**
- Links: text color shift only on hover. No background change.
- Rows: subtle muted background on hover. No text/border change.
- Cards: border tint on hover. No background/shadow change.
- Active = lime accent everywhere (sidebar, nav, filters, tabs).

## Glassmorphism

| Class | Purpose |
|-------|---------|
| `glass-surface` | Semi-transparent with blur |
| `glass-elevated` | More opaque with shadow |
| `glass-popover` | Dropdowns/modals |
| `card-glass` | Card variant |
| `card-elevated` | Card variant |
