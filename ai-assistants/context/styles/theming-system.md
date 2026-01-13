# CHORUS Web UI Theming System

## Overview

The CHORUS Web UI now features a comprehensive theming system that supports light and dark modes, with factorized styles and reusable design tokens.

## Key Features

- **Light/Dark Mode**: Seamless theme switching with system preference detection
- **CSS Variables**: All colors managed through semantic tokens
- **Utility Classes**: Reusable patterns for common UI elements
- **Component Variants**: Extended shadcn/ui components with themed variants
- **Zero Hardcoded Colors**: All styling uses theme tokens

## Architecture

### Theme Provider

Located at [src/providers/theme-provider.tsx](../src/providers/theme-provider.tsx)

Wraps the entire application in [src/app/layout.tsx](../src/app/layout.tsx) with configuration:
- `attribute="class"`: Uses CSS class-based theme switching
- `defaultTheme="dark"`: Starts in dark mode
- `enableSystem`: Respects user's system preference
- `disableTransitionOnChange`: Prevents flash during theme switch

### CSS Variables

Defined in [src/styles/globals.css](../src/styles/globals.css)

#### Semantic Color Tokens

```css
:root {
  --background: /* Main background color */
  --foreground: /* Main text color */
  --card: /* Card background */
  --card-foreground: /* Card text */
  --popover: /* Dropdown/modal background */
  --popover-foreground: /* Dropdown/modal text */
  --primary: /* Primary brand color (blue) */
  --primary-foreground: /* Text on primary */
  --secondary: /* Secondary color (cyan) */
  --accent: /* Accent color (lime green) */
  --accent-foreground: /* Text on accent */
  --muted: /* Muted text/borders */
  --destructive: /* Error/delete actions */
  --border: /* Border color */
  --input: /* Input field borders */
  --ring: /* Focus ring color */
}

.dark {
  /* All tokens redefined for dark mode */
}
```

## Utility Classes

### Glassmorphism Effects

```css
.glass-surface {
  /* Semi-transparent background with blur */
  @apply bg-background/60 backdrop-blur-sm border border-muted/40;
}

.glass-elevated {
  /* More opaque variant with shadow */
  @apply bg-background/80 backdrop-blur-md border border-muted/30 shadow-lg;
}

.glass-popover {
  /* For dropdowns and modals */
  @apply bg-popover/95 backdrop-blur-md border border-border/20 shadow-xl;
}
```

### Overlay Backgrounds

```css
.overlay-dark {
  /* Dark overlay for headers/navbars */
  @apply bg-black/85 backdrop-blur-sm;
}

.overlay-surface {
  /* Themed overlay */
  @apply bg-background/90 backdrop-blur-sm;
}
```

### Navigation Links

```css
.nav-link-base {
  /* Base navigation link styles */
  @apply inline-flex w-max items-center justify-center
         border-b-2 border-transparent bg-transparent
         text-sm font-semibold text-muted transition-colors;
}

.nav-link-hover {
  /* Hover effect */
  @apply hover:border-b-2 hover:border-accent;
}

.nav-link-active {
  /* Active/selected state */
  @apply border-b-2 border-accent text-foreground;
}
```

### Interactive Elements

```css
.interactive-hover {
  /* Generic hover effect */
  @apply transition-colors hover:bg-accent/10 hover:text-accent;
}

.interactive-item {
  /* Clickable menu item */
  @apply flex cursor-pointer items-center gap-2 rounded
         px-2 py-1.5 transition-colors hover:bg-accent/10;
}
```

### Card Variants

```css
.card-glass {
  /* Glass card style */
  @apply rounded-2xl border border-muted/40
         bg-background/60 backdrop-blur-sm;
}

.card-elevated {
  /* Elevated card with shadow */
  @apply rounded-2xl border border-muted/30
         bg-background/80 shadow-lg;
}
```

## Component Variants

### Card Component

Located at [src/components/ui/card.tsx](../src/components/ui/card.tsx)

Now supports variant prop using CVA (Class Variance Authority):

```tsx
import { Card } from '@/components/ui/card'

// Default variant
<Card>Content</Card>

// Glass variant
<Card variant="glass">Content</Card>

// Elevated variant
<Card variant="elevated">Content</Card>
```

### Navigation Menu

Located at [src/components/ui/navigation-menu.tsx](../src/components/ui/navigation-menu.tsx)

Automatically uses theme-aware navigation link styles:

```tsx
<NavigationMenuTrigger>
  {/* Uses nav-link-base, nav-link-hover, nav-link-active */}
</NavigationMenuTrigger>
```

## Theme Toggle

Located at [src/components/theme-toggle.tsx](../src/components/theme-toggle.tsx)

A button component that switches between light and dark themes:

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

// Add anywhere in your UI
<ThemeToggle />
```

Added to the main header at [src/components/header.tsx:674](../src/components/header.tsx#L674)

## Migration Guide

### Replacing Hardcoded Colors

**Before:**
```tsx
<div className="bg-black bg-opacity-85 backdrop-blur-sm text-white">
  Content
</div>
```

**After:**
```tsx
<div className="overlay-dark text-foreground">
  Content
</div>
```

### Replacing Glassmorphism Patterns

**Before:**
```tsx
<div className="bg-background/60 backdrop-blur-sm border border-muted/40">
  Content
</div>
```

**After:**
```tsx
<div className="glass-surface">
  Content
</div>
```

### Replacing Interactive Items

**Before:**
```tsx
<div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-accent/10">
  Content
</div>
```

**After:**
```tsx
<div className="interactive-item">
  Content
</div>
```

### Using Card Variants

**Before:**
```tsx
<Card className="rounded-2xl border-muted/40 bg-background/60 text-white">
  Content
</Card>
```

**After:**
```tsx
<Card variant="glass">
  Content
</Card>
```

### Dropdowns and Popovers

**Before:**
```tsx
<DropdownMenuContent className="bg-black bg-opacity-95 text-white border border-muted/20">
  Content
</DropdownMenuContent>
```

**After:**
```tsx
<DropdownMenuContent className="glass-popover">
  Content
</DropdownMenuContent>
```

## Color Reference

### Brand Colors (Light & Dark Mode)

- **Primary**: `hsl(229 100% 54%)` - Blue (#1340FF)
- **Accent**: `hsl(73.8 100% 54.3%)` - Lime (#B6FF12)
- **Secondary**: `hsl(240 75% 84.3%)` - Cyan

### Background Tokens

- `bg-background`: Main page background
- `bg-card`: Card backgrounds
- `bg-popover`: Modal/dropdown backgrounds
- `bg-primary`: Primary buttons
- `bg-accent`: Accent buttons/highlights
- `bg-muted`: Muted backgrounds

### Text Tokens

- `text-foreground`: Main text
- `text-muted`: Secondary text
- `text-muted-foreground`: Tertiary text
- `text-primary-foreground`: Text on primary
- `text-accent-foreground`: Text on accent

### Border Tokens

- `border-border`: Standard borders
- `border-muted`: Muted borders
- `border-accent`: Accent borders (hover states)

## Best Practices

1. **Always use semantic tokens** instead of hardcoded colors
2. **Prefer utility classes** for common patterns
3. **Use component variants** when available
4. **Test in both themes** after making changes
5. **Maintain contrast ratios** for accessibility

## Testing Checklist

When implementing themed components:

- [ ] Component displays correctly in light mode
- [ ] Component displays correctly in dark mode
- [ ] Theme toggle works without flash/flicker
- [ ] Text is readable in both themes
- [ ] Interactive states (hover, focus) are visible
- [ ] Borders and separators are visible
- [ ] No hardcoded colors remain
- [ ] Glassmorphism effects render properly

## Remaining Work

The following components still need migration (estimated 61 files):

### High Priority
- Forms components (dialogs, inputs)
- Table components (user-table, workspaces-table)
- Sidebar components

### Medium Priority
- Sandbox pages
- Admin pages
- Individual page components

### Low Priority
- Utility components
- Test components

## Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode/next)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [CVA (Class Variance Authority)](https://cva.style/docs)

## Support

For questions or issues with the theming system, check:
1. This documentation
2. [globals.css](../src/styles/globals.css) for available tokens
3. [theme-provider.tsx](../src/providers/theme-provider.tsx) for configuration
4. Example usage in [header.tsx](../src/components/header.tsx)
