---
name: Elite Athletics Cinematic System
colors:
  surface: '#17130b'
  surface-dim: '#17130b'
  surface-bright: '#3f382f'
  surface-container-lowest: '#120e06'
  surface-container-low: '#201b13'
  surface-container: '#241f16'
  surface-container-high: '#2f2920'
  surface-container-highest: '#3a342b'
  on-surface: '#ece1d3'
  on-surface-variant: '#d4c4ae'
  inverse-surface: '#ece1d3'
  inverse-on-surface: '#363026'
  outline: '#9c8f7b'
  outline-variant: '#504535'
  surface-tint: '#fabc41'
  primary: '#ffd999'
  on-primary: '#422d00'
  primary-container: '#f5b83d'
  on-primary-container: '#6a4a00'
  inverse-primary: '#7c5800'
  secondary: '#abc7ff'
  on-secondary: '#002f65'
  secondary-container: '#046dd9'
  on-secondary-container: '#f2f4ff'
  tertiary: '#ffd6c1'
  on-tertiary: '#532200'
  tertiary-container: '#ffb084'
  on-tertiary-container: '#843a00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea8'
  primary-fixed-dim: '#fabc41'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#d7e3ff'
  secondary-fixed-dim: '#abc7ff'
  on-secondary-fixed: '#001b3f'
  on-secondary-fixed-variant: '#00458e'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#17130b'
  on-background: '#ece1d3'
  surface-variant: '#3a342b'
typography:
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
  headline-xl:
    fontFamily: Bebas Neue
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: 0.03em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  headline-md:
    fontFamily: Bebas Neue
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

This design system is engineered to evoke the high-stakes, prestigious atmosphere of professional night-match football. It targets a passionate audience that values both the raw energy of sports and the refined aesthetics of luxury media.

The visual style is **Cinematic Minimalism**—a hybrid of Apple-inspired structural discipline and "Stadium-Core" drama. 

### Key Principles:
- **Atmospheric Depth:** Utilize dark surfaces with intentional "light leaks" and stadium-inspired glows to simulate a night-time arena.
- **Aggressive Sophistication:** High-contrast typography pairs with generous whitespace to command attention without clutter.
- **The Golden Ratio:** Use metallic gold accents sparingly as a symbol of victory and championship status.
- **Dynamic Glassmorphism:** Employ frosted surfaces with 20px+ blurs to represent modern digital luxury, providing separation between moving data and static backgrounds.

## Colors

The palette is strictly dark-mode first to maximize the "Cinematic" impact. 

- **Primary Gold (#F5B83D):** Reserved for victory states, championship branding, and key CTA highlights. It should have a subtle linear gradient (Top: #F5B83D to Bottom: #D99A26) to mimic metallic reflection.
- **Accent Blue & Orange:** Used exclusively for team-specific branding or data visualization (e.g., win/loss streaks or home/away markers).
- **Surface Hierarchy:** 
    - **Background (#05070B):** The deepest layer.
    - **Surface (#0D1117):** Primary section containers.
    - **Card (#111827):** Interactive elements and data modules.

## Typography

The system utilizes a high-contrast pairing of **Bebas Neue** for impact and **Inter** for legibility.

- **Headlines:** Use Bebas Neue for all headings. The condensed nature allows for larger font sizes while maintaining a sleek profile. For "Championship" moments, apply a subtle gold gradient to text.
- **Body & Data:** Inter provides the necessary geometric clarity for complex league tables and match statistics.
- **Utility Labels:** Small labels should use uppercase Inter with increased letter spacing (10%) to maintain a premium, architectural feel.

## Layout & Spacing

This design system follows a **Fluid 12-Column Grid** for desktop and a **4-Column Grid** for mobile.

- **Apple-Level Spacing:** Avoid overcrowding. Section gaps should be generous (80px+) to allow the "stadium lighting" effects to breathe.
- **Safe Margins:** Maintain a minimum 48px horizontal margin on desktop to create a focused, centered content column.
- **Reflow Rules:** On mobile, cards transition from multi-column grids to a single-column vertical stack, with the bottom navigation bar becoming the primary anchor for UX.

## Elevation & Depth

Depth is conveyed through lighting and translucency rather than heavy shadows.

- **Z-Axis Hierarchy:**
    - **Layer 0 (Base):** Solid `#05070B`.
    - **Layer 1 (Containers):** `#0D1117` with a 1px stroke of `white / 5%`.
    - **Layer 2 (Cards):** `#111827` with a subtle inner glow on the top edge.
    - **Layer 3 (Modals/Overlays):** Glassmorphism (Background Blur: 32px, Fill: `neutral_card / 70%`).
- **Glow Effects:** Use "Stadium Beams"—radial gradients with 10-20% opacity of Primary Gold or Accent Blue—placed behind key player cards or match fixtures to create a 3D spotlight effect.

## Shapes

The design system uses a consistent **Rounded (16px/1rem)** language to soften the aggressive typography.

- **Component Radius:** Standard buttons and inputs use 8px (Soft).
- **Card Radius:** Main match and player cards use 16px (Rounded).
- **Container Radius:** Section containers use 24px (rounded-xl) to create a "nested" look.
- **Visual Accents:** Use vertical pill shapes for "Live" indicators or league table position markers.

## Components

### Match Cards
- **Structure:** Team logo (Left), VS Marker (Center), Team logo (Right).
- **Styling:** Use the `Card` background. The VS marker should use `headline-md` typography. Fixture details (Date/Venue) sit in the footer with `label-sm` muted text.
- **Interaction:** On hover, apply a 1px Gold border and a subtle scale up (1.02x).

### League Tables
- **Header:** Uppercase `label-bold` with 40% opacity.
- **Rows:** Alternate row colors are not required; use thin 1px dividers.
- **Highlight:** The "Leader" (Top 1) row should have a subtle Gold left-border (4px) and a light glow effect.

### Player Cards
- **Visuals:** High-quality player cutouts overlapping the top boundary of the card.
- **Backdrop:** A vertical gradient corresponding to the team's primary accent color.
- **Stats:** Minimalist grid of 2-3 key metrics at the bottom.

### Buttons
- **Primary:** Solid Gold background, black `label-bold` text. No border.
- **Secondary:** Ghost style. 1px white/20% border, white text.
- **Action:** Micro-interaction involving a slight gold outer glow on click.

### Bottom Navigation (Mobile)
- **Design:** Blurred glass background (80% opacity).
- **Icons:** Thin-stroke (1.5px) monochrome icons. Active state turns Gold with a small dot indicator below.