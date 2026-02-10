# Specification

## Summary
**Goal:** Make the app render in dark theme by default across all pages, using the existing Tailwind CSS variable-based theming and ThemeProvider setup.

**Planned changes:**
- Set the default theme to dark so a fresh browser session loads in dark mode without relying on OS/system theme.
- Ensure dark theme styling is consistent across the signed-in experience (shell layout, dashboard, project editor, dialogs) and the signed-out landing page.
- Update the public project page (/p/$projectId) styling to use existing design tokens (bg-background, text-foreground, card/muted/primary) instead of hardcoded gray/purple classes, keeping content (links/markdown/prose) readable and aligned with the established palette direction.

**User-visible outcome:** The app opens in dark mode by default and stays visually consistent and readable in dark mode across authenticated pages, the landing page, and public project pages.
