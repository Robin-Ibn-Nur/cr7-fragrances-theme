# Olfactory Fragrance Discovery & Interactive Note Search System

**Date:** 2026-11-20
**Topic:** Interactive Olfactory Note Search & Perfume Discovery Modal (CR7 Storefront)
**Status:** Pending Approval

---

## 1. Intent & The Why
In luxury perfumery, customers often search not just by product name, but by olfactory memories and key ingredients (e.g. "I love woody cedarwood scents" or "I want fresh Calabrian bergamot"). Standard e-commerce search bars show a simple text dropdown that fails to inspire.

Inspired by high-end bespoke perfume registries (as seen in the provided reference video), this feature transforms the CR7 search bar into an immersive, interactive **Olfactory Fragrance Discovery & Ingredient Explorer**. Customers can browse by scent families, explore botanical note ingredients with high-fidelity visuals, and click any note to instantly drill down into a dedicated perfumer's breakdown and see which CR7 fragrances feature that note.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Immersive Full-Screen / Modal Experience:** When the search icon in the header is clicked, reveal a spacious, luxury dark-editorial overlay with a top search bar, live category sidebar, and interactive notes grid.
- **Olfactory Family Categorization:** Allow filtering notes by families:
  - `All` (All curated notes)
  - `Citrus & Fresh` (Bergamot, Mandarin Orange, Grapefruit, Lemon, Green Apple)
  - `Aromatic & Herbs` (Lavender, Clary Sage, Bay Leaf, Rosemary, Artemisia)
  - `Woods & Earth` (Cedarwood, Sandalwood, Vetiver, Patchouli, Guaiac Wood)
  - `Spices & Fire` (Cardamom, Cinnamon, Pink Pepper, Nutmeg)
  - `Amber & Sensual Musk` (Tonka Bean, Ambergris / Amber, Vanilla, Ambroxan, Musk)
  - `Aquatic & Marine` (Sea Notes, Crisp Ice)
- **Interactive Drill-Down (The Core Feature):**
  - Clicking any note smoothly transitions the view:
    - **Left Column:** Back button (`← All Notes`), high-definition visual of the note, Note Name (e.g., `CALABRIAN BERGAMOT`), Olfactory Group badge (`• Group Citrus & Fresh`), and an evocative perfumer's profile description.
    - **Right Column:** Product cards of the exact CR7 perfumes containing that note (with bottle photography, title, price, and direct link / quick view).
- **Direct Search Synergy:** When typing in the search bar, instantly filter both the visual notes and matching perfumes in real-time, with seamless fallback to Shopify predictive search.
- **Accessibility & Motion:** Support `Escape` key close, click-outside dismissal, smooth 60fps GPU transitions, and reduced-motion fallbacks.

### Non-Goals
- Modifying Shopify checkout, payment gateways, or customer account logic.
- Building a standalone external web app; everything runs natively inside the existing theme.

### Anti-Goals
- Stalling the main thread or causing layout reflows during note switching.
- Overriding core theme search functionality for non-perfume assets if Shopify predictive search is active.

---

## 3. Constraints
- Must integrate cleanly with the existing theme header actions and dialog component architecture (`snippets/search-modal.liquid` and `snippets/search.liquid`).
- Consistent with the active **Editorial High-Fashion Minimalist** design system (pure black `#060606`, razor-thin hairline borders `rgba(255, 255, 255, 0.12)`, uppercase wide-tracked typography, crisp white accents).
- High performance: fast client-side filtering without unnecessary network roundtrips for note switching.

---

## 4. Approaches Considered

* **Approach 1 (Picked — Full-Screen Luxury Note Explorer Modal):**
  Transform `search-modal.liquid` into an interactive full-screen luxury overlay with integrated notes registry, live category filtering, instant drill-down note detail with perfume matching, and real-time search.
  *Why Picked:* Accurately matches the provided reference video and gives instant gratification directly upon clicking the search icon on any page.
* **Approach 2 (Standalone Page):**
  Create a static `/pages/fragrance-finder` and keep the search modal standard.
  *Tradeoff:* Loses the seamless modal discovery flow shown in the video.

---

## 5. Architectural & Component Design

### 5.1 Architecture
The system consists of:
1. **Markup & Template (`snippets/search-modal.liquid`):**
   - Replaces the generic search layout with a dual-mode component:
     - Header: Prominent search input with icon, clear button, and close `✕` button.
     - Body: Two-column layout containing `#olfactory-sidebar` and `#olfactory-content-grid`.
2. **Component Controller (`assets/olfactory-search.js`):**
   - Lightweight custom element / module managing:
     - Active category filter (`all`, `citrus`, `woods`, `spices`, `aromatic`, `amber`).
     - Note selection & drill-down state transition (showing note hero + matching CR7 fragrances).
     - Back navigation (`← Back to notes`).
     - Search input debouncing and simultaneous query matching across notes and products.
3. **Styles (`assets/olfactory-search.css` or scoped inside theme stylesheet):**
   - High-fashion dark luxury aesthetic: `#070707` backdrop, smooth blur, hairline borders, responsive CSS grid, 60fps card transforms.
4. **Data Registry (`assets/cr7-fragrance-notes-data.js` or inline JSON):**
   - Structured registry containing:
     - 20+ signature fragrance notes mapped to real botanical imagery, descriptions, and their olfactory family.
     - The 8 active CR7 perfumes with their official top, heart, and base notes.

---

## 6. CR7 Fragrance & Note Mapping Data Model

| Fragrance | Authentic Olfactory Notes | Primary Olfactory Families |
| :--- | :--- | :--- |
| **CR7 Origins** | Pineapple, Mandarin Orange, Bay Leaf, Clary Sage, Geranium, Lavender, Patchouli, Vetiver | Citrus, Aromatic, Woods |
| **CR7 Game On** | Papaya, Cardamom, Ice Accord, Lavender, Violet, Tonka Bean, Cedarwood, Guaiac Wood, Amber | Spices, Aromatic, Woods, Amber |
| **CR7 Play It Cool** | Mandarin Orange, Pear, Bergamot, Sea Notes, Lavender, Cardamom, Tonka Bean, Amberwood, Musk | Citrus, Aquatic, Aromatic, Amber |
| **CR7 Classic Red** | Bergamot, Artemisia, Cardamom, Lavender, Cinnamon, Cedarwood, Iris, Tobacco, Sandalwood, Vanilla, Amber | Citrus, Spices, Woods, Amber |
| **Cristiano Ronaldo Legacy** | Bergamot, Cinnamon, Green Apple, Lavender, Orris Root, Cedarwood, Violet, Rosemary, Sage, Patchouli, Ambergris, Smoked Vetiver | Citrus, Spices, Aromatic, Woods |
| **Cristiano Ronaldo Fearless** | Grapefruit, Violet Leaf, Bay Leaf, Red Apple, Geranium, Nutmeg, Ambroxan, Cashmeran, Vanilla, Labdanum | Citrus, Spices, Amber, Woods |
| **Cristiano Ronaldo Discover** | Citrus, Orange, Lemon, Mandarin, Clary Sage, Petitgrain, Labdanum, Vetiver, Patchouli, Precious Woods | Citrus, Aromatic, Woods |
| **CR7 Energy** | Bergamot, Mandarin, Pink Pepper, Cardamom, Geranium, Clary Sage, Cedarwood, Amber, Musk | Citrus, Spices, Aromatic, Woods |

---

## 7. UI / UX State Flow

```
[ User clicks Search Icon in Header ]
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      SEARCH OVERLAY                         │
│  [🔍 Search by fragrance, brand, notes...]              [✕] │
├──────────────────────────────┬──────────────────────────────┤
│ SIDEBAR (Olfactory Families) │ NOTES GRID                   │
│ • Description Guide          │ [Bergamot] [Lavender]        │
│ • All (22)                   │ [Cedarwood] [Cardamom]       │
│ • Citrus & Fresh (5)         │ [Tonka Bean] [Vanilla]       │
│ • Woods & Earth (5)          │ [Patchouli] [Vetiver]        │
│ • Spices & Fire (4)          │ [Cinnamon] [Pink Pepper]     │
│ • Aromatic & Herbs (5)       │ [Sea Notes] [Ambergris]      │
│ • Amber & Musk (4)           │                              │
└──────────────────────────────┴──────────────────────────────┘
               │ (User clicks on "Bergamot")
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      SEARCH OVERLAY                         │
│  [🔍 Search by fragrance, brand, notes...]              [✕] │
├──────────────────────────────┬──────────────────────────────┤
│ NOTE DETAIL DRILL-DOWN       │ MATCHING CR7 PERFUMES        │
│ ← Back to all notes          │ ┌──────────┐  ┌──────────┐   │
│ [Image: Calabrian Bergamot]  │ │ CR7      │  │ Cristiano│   │
│ CALABRIAN BERGAMOT           │ │ Play     │  │ Ronaldo  │   │
│ • Group Citrus & Fresh       │ │ It Cool  │  │ Legacy   │   │
│ "Prized for its sparkling,   │ │ $190.00  │  │ $156.00  │   │
│ sun-drenched radiance..."    │ └──────────┘  └──────────┘   │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 8. What's Left to the Builder
- Implementing the component markup and styles.
- Integrating high-resolution note photography and curated perfumery descriptions.
- Wiring the live event listeners for category switching, drill-down navigation, and search queries.
- Verifying cross-device responsiveness (Desktop wide screen, Tablet, Mobile) and keyboard accessibility.
