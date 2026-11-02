---
name: The Design System
colors:
  surface: '#f9f9fe'
  surface-dim: '#d9dade'
  surface-bright: '#f9f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f8'
  surface-container: '#ededf2'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e7'
  on-surface: '#1a1c1f'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f0f0f5'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#005cba'
  on-secondary: '#ffffff'
  secondary-container: '#5095fe'
  on-secondary-container: '#002d61'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1d'
  on-tertiary-container: '#838486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#d7e3ff'
  secondary-fixed-dim: '#aac7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#00458e'
  tertiary-fixed: '#e2e2e4'
  tertiary-fixed-dim: '#c6c6c8'
  on-tertiary-fixed: '#1a1c1d'
  on-tertiary-fixed-variant: '#454749'
  background: '#f9f9fe'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e7'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.022em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.021em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.019em
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: -0.011em
  body-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.47'
    letterSpacing: -0.011em
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  section-gap: 120px
---

## Brand & Style

The design system is rooted in the philosophy of "Invisibility through Precision." It targets a high-end audience that values clarity, performance, and understated luxury. The aesthetic is a hybrid of **Minimalism** and **Glassmorphism**, emphasizing high-quality typography and intentional white space to create a "gallery-like" experience for content.

The emotional response should be one of calm authority and effortless sophistication. Surfaces should feel tactile yet ethereal, utilizing translucency to maintain a sense of context and depth without visual clutter.

## Colors

The palette is strictly curated to ensure high contrast and focus. 
- **Core Tones:** Pure White (#FFFFFF) serves as the primary canvas, while Deep Black (#000000) is reserved for primary text and high-impact structural elements.
- **Accents:** Apple Blue (#0066CC) is used sparingly for interactive cues, links, and active states.
- **Neutrals:** Soft Grays (#F5F5F7 and #E8E8ED) define subtle component backgrounds and secondary information.
- **Translucency:** Overlays utilize a 70-80% opacity white with a 20px-40px backdrop blur to achieve a "liquid glass" effect.

## Typography

This design system utilizes **Inter** as the primary typeface to emulate the systematic, utilitarian precision of San Francisco. 
- **Hierarchy:** Dramatic contrast between large, bold headlines and readable, spacious body text.
- **Tight Kerning:** Headlines should use negative letter-spacing for a "locked-in" premium feel.
- **Optical Sizing:** Larger display styles use semi-bold weights, while body text remains regular weight to ensure maximum legibility against white backgrounds.

## Layout & Spacing

A **fixed-width grid** approach is preferred for desktop to maintain editorial control over line lengths and image placement. 
- **Grid:** Use a 12-column grid with a maximum container width of 1200px.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Vertical Air:** Large "Section Gaps" (120px+) are encouraged to separate distinct product narratives, mimicking the pacing of a physical high-end brochure.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and high-fidelity **Ambient Shadows**.
- **The Glass Stack:** Floating modals and navigation bars use a semi-transparent background blur (Backdrop Filter) to allow content colors to bleed through subtly.
- **Shadows:** Use extremely diffused, multi-layered shadows. For example, a "Level 2" shadow should have a 40px blur with only 4-6% opacity black, creating a natural lift rather than a hard edge.
- **Layering:** Elements closer to the user are lighter and more transparent; background elements are solid white or light gray.

## Shapes

The shape language is characterized by **Subtle Geometric Softness**. 
- **Standard Radius:** 8px (0.5rem) for standard buttons and inputs.
- **Large Radius:** 16px (1rem) for cards and containers.
- **Extra Large:** 24px (1.5rem) for main hero sections or large overlays.
All corners should feel modern and intentional—never fully circular (except for icons/pills) and never sharp.

## Components

### Buttons
- **Primary:** Solid black background, white text, 8px corner radius. Subtle scale-down effect (0.98) on click.
- **Secondary:** Light gray background (#F5F5F7), black text.
- **Ghost:** No background, Blue (#0066CC) text with an arrow icon.

### Interactive Inputs
- **Sliders:** A thin gray track with a solid white circular thumb and a high-diffusion shadow.
- **Input Fields:** Minimalist border-bottom or subtle light gray fill. Focus state uses a 2px blue ring with offset.

### Navigation Overlays
- Use the "Liquid Glass" effect. Sticky headers should blur the content behind them as the user scrolls.

### Cards
- Borderless. Use either a very light gray background or a subtle "lifted" shadow on hover to indicate interactivity.

### Icons
- Line-based, consistent stroke weight (1.5px to 2px), with rounded terminals to match the shape language.