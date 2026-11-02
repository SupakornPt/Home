# Personas

Implementation details (fixed **lg** filter sidebar, **mobile** filter sheet, **bottom property rail**, glass **3D** stage) follow **`stitch_home_3d_interactive_showcase`** while keeping the journeys below.

## 1. Nadia — mobile-first buyer

- **Age / context:** 32, browses listings during commute on phone.
- **Goals:** Quickly see if a home “feels right” via 3D; compare a few options fast; filter by non-negotiables (price, beds, area).
- **Frustrations:** Tiny tap targets, slow loads, unclear how to contact someone, video she cannot skip.
- **Behaviors:** Uses thumb for swipe; expects skip on video; short sessions.

**Design implications:** Large hit areas, swipe-left for next property, obvious Skip, filter sheet or compact filter bar, sticky contact CTA.

---

## 2. Marcus — deliberate desktop viewer

- **Age / context:** 45, plans move with partner; uses laptop evenings.
- **Goals:** Study details, rotate 3D carefully, copy listing reference, contact seller with a message.
- **Frustrations:** 3D that fights the cursor, missing keyboard support, low-information density without clutter.
- **Behaviors:** Mouse drag on 3D; may use trackpad horizontal scroll for “next” if offered.

**Design implications:** Desktop layout preserves Apple-like whitespace but adds clear affordances (e.g. “Next property” control), focus rings, optional arrow keys for property change.

---

## 3. Priya — listing coordinator (seller side)

- **Age / context:** 38, represents seller; not the primary end-user but affects content.
- **Goals:** Ensure accurate specs and that inquiries reach the right channel.
- **Frustrations:** Outdated phone/email on the site, spam-prone public forms.
- **Behaviors:** Rarely uses the public site except QA.

**Design implications:** Contact block driven by data (`api.md`); validation and clear confirmation after submit; optional rate limiting (backend).

---

## Cross-checks

- **↔ `design.md`:** Nadia drives mobile-first patterns; Marcus drives desktop refinements and 3D pointer UX; Priya drives contact truthfulness and confirmation states.
