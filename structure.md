# Repository structure (proposed)

HOME app: separation between **presentation**, **hooks**, and **infra**. UI matches **Stitch** showcase reference under `stitch_home_3d_interactive_showcase/`.

```
HOME/
├── public/
│   ├── video_opening.mp4
│   └── data/properties.json           # Mock catalog (+ optional Stitch fields)
├── stitch_home_3d_interactive_showcase/
│   ├── home_3d_property_showcase/code.html   # Stitch HTML reference (not bundled)
│   ├── home_property_showcase_with_navigation_bar/code.html
│   └── the_design_system/DESIGN.md           # Exported tokens / principles
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Inter (next/font)
│   │   ├── page.tsx
│   │   ├── not-found.tsx              # App Router 404
│   │   └── globals.css                # Tailwind + Material Symbols; `.glass`, `.liquid-glass-skip`, `.scale-down-click`
│   ├── components/
│   │   ├── home/HomePage.tsx
│   │   ├── layout/
│   │   │   ├── StitchHeader.tsx
│   │   │   └── SiteFooter.tsx
│   │   ├── opening/                   # VideoGate, SkipButton
│   │   ├── property/
│   │   │   ├── PropertySwipeDeck.tsx
│   │   │   ├── ShowcaseHero.tsx
│   │   │   ├── PropertyShowcaseDetail.tsx
│   │   │   ├── PropertyRailNav.tsx
│   │   │   ├── PropertyFilterSidebar.tsx
│   │   │   ├── PropertyFiltersFields.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── SellerContactCard.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── three/HouseStage.tsx
│   │   └── ui/                         # Button, MaterialIcon
│   ├── hooks/                        # useProperties, useOpeningGate, useSwipeNavigation
│   ├── lib/
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── constants.ts
│   │   └── cn.ts
│   └── types/
├── *.md                               # Product / design / API docs
├── log.md
└── starter.md
```

## Notes

- `stitch_*` folders are **reference-only** exports; runtime uses React components above.
- If you drop **Vite** instead of Next, remap `src/app/` accordingly.

## Cross-checks

- **↔ `component.md`:** Every region maps to files under `components/`.
- **↔ `tech.md`:** 3D/video remain isolated under `three/` & `opening/`.
