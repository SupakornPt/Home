# Design: HOME

## Brand & art direction

- **Name:** HOME (wordmark simple, confident; centered in top bar).
- **Primary references:**
  - **Apple-style** pacing: large headlines, restrained motion, monochrome + one accent (**secondary blue** `#005cba`).
  - **Stitch HOME 3D interactive showcase** (`stitch_home_3d_interactive_showcase/` + embedded **DESIGN.md**): **minimalism + glassmorphism**, Inter-driven type scale, curated neutrals (**surface `#f9f9fe`**, container grays).
- **Motion:** Restrained; opening video stays the strongest entry cue. In-page: hover on rail, subtle scale-down on primary CTAs (`scale-down-click` utility).

## Layout model (single page)

1. **Gate:** Full-viewport opening video (muted); **Skip** sits bottom-center in safe area on a **liquid glass** capsule (**translucent gradient**, **heavy backdrop blur**, **saturate**, **thin white border**, **inset highlight** per design-system “liquid glass”; utility class `liquid-glass-skip` in `globals.css`); caption uses **uppercase tracking** + **white** with light drop shadow so it stays legible over video; **no sound**.
2. **Main chrome:** Fixed **glass** top bar (**StitchHeader**): filter icon (**Material `filter_list`**) toggles filters—bottom sheet below **`lg`**; **`lg+`** slides the sidebar rail closed or **open** and restores **`pl-80`** main offset when visible.
3. **Desktop filters:** Fixed **320px** left sidebar (**PropertyFilterSidebar**) with scrollable criteria and sticky Apply strip; collapses off-screen with transform when dismissed (toolbar toggles collapse/expand).
4. **Mobile filters:** Lifted bottom sheet (**FilterPanel**), not the desktop rail.
5. **Hero strip:** Tall gradient panel (~**78–82vh**) with oversized rounded **3D stage** (**32px / 48px** radius tokens), centered glass pill **“3D Interactive — drag to orbit”**, and **floating glass** prev/next disks on **`md+`**.
6. **Listing body:** Editorial block—location row + display title + **accent listing price**, five **spec tiles** (type · floors · beds · baths · parking), architectural copy, primary **Contact agent** CTA scrolling to anchored form region.
7. **Property changer:** Bottom **glass rail** (prev/next with thumbnails + `n / total`) above site footer—mirrors Stitch bottom nav metaphor.
8. **Footer:** Full-width subdued band with wordmark + legal links (**SiteFooter**).

## Horizontal carousel

- **Swipe left** (or scrollbar snap) advances properties; arrow keys unchanged from implementation hook.
- Each property is **one full-width column** inside the horizontal scroller (`PropertySwipeDeck`).

## Typography & spacing

- **Inter** (Next `next/font`) as primary UI face; aligns with Stitch “San Francisco analogue.”
- Use **tailwind extended tokens**: `display-xl`, `headline-lg`, `body-lg`, `label-sm`, `caption`, spacing keys `margin-desktop` / `margin-mobile`, **`max-w-container-max` (1200px)**.

## 3D viewport

- **Drag = orbit**; **zoom/pan disabled** by default per product.
- HUD is **non-blocking** (`pointer-events-none`) so gestures hit the canvas.
- **No sound** in 3D scene.

## Accessibility

- Visible focus on inputs and buttons despite minimal chrome (`ring-secondary`).
- Listing facts duplicated in **text + tiles** beside the canvas.
- Decorative Material icons use **`aria-hidden`** where parallel text exists.

## Responsive breakpoints

- **&lt;`lg` (~1024px):** Sidebar hidden; filters in bottom sheet.
- **`lg+`:** Fixed left filter rail; offset main (`pl-80`).

## Cross-checks

- **↔ `personas.md`:** Mobile sheet + swipe; desktop sidebar + orbital drag + rail nav.
- **↔ `product.md`:** All core flows preserved; Stitch layer is presentation on top.
