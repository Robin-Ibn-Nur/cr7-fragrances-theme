# Modern Off-Canvas Luxury Side Drawer & Header Design

**Date:** 2026-11-20  
**Topic:** Trendy Luxury Header & Off-Canvas Side Navigation (CR7 Storefront)  
**Status:** Pending Approval  

---

## 1. Intent & The Why
Modern top-tier luxury e-commerce brands (such as Balenciaga, Byredo, Kith, and Tom Ford) eschew cluttered desktop horizontal text links across their hero banners. Instead, they employ an ultra-clean, balanced 3-column floating header paired with a dramatic **Off-Canvas Luxury Side Drawer** that glides in smoothly when activated.

This design keeps the cinematic CR7 hero imagery unobstructed while giving shoppers an immersive, editorial magazine-like navigation experience with rich media previews and quick shopping access.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Balanced 3-Column Floating Header Bar:**
  - **Left:** Modern `[ ☰ MENU ]` luxury toggle button with micro-animated 2-bar icon.
  - **Center:** Perfectly centered CR7 Brand Logo.
  - **Right:** High-end action suite: Search trigger, Wishlist toggle (with live count badge), and Cart Bag (with live item bubble).
  - Sticky glassmorphism on scroll with frosted backdrop blur (`rgba(7, 7, 7, 0.75)` + `backdrop-filter: blur(20px)`).
- **Off-Canvas Luxury Side Drawer (Desktop & Mobile Unified):**
  - Full-height panel sliding gracefully from the left (`transform: translateX(-100%)` to `0`) with a deep obsidian frosted backdrop (`rgba(6, 6, 6, 0.92)`).
  - **Primary Navigation Links:** Bold, oversized uppercase typography (`ALL FRAGRANCES`, `CR7 SIGNATURE COLLECTION`, `NEW ARRIVALS`, `BEYOND THE LEGEND`, `EXCLUSIVE OFFERS`) featuring smooth slide-right hover transitions with sleek arrow indicators (`→`).
  - **Featured Scent Showcase Card:** An editorial mini-card inside the drawer highlighting a flagship fragrance (`CR7 Energy` or `CR7 Legacy`) with bottle photography and a direct `Shop Now` link.
  - **Drawer Footer & Utilities:** Fast links (`Track Order`, `Help & FAQs`, `Currency / UK`) plus crisp social media icons.
- **Micro-Interactions & Accessibility:** Smooth 60fps GPU easing, Escape key close, click-outside backdrop dismissal, and logical tab navigation.

### Non-Goals
- Altering the checkout template or Shopify account authentication backend.
- Changing products or collections URLs.

### Anti-Goals
- Layout shifts or body scroll jitter when the drawer opens (uses body scroll-lock).
- Low contrast or illegible menu text against the dark backdrop.

---

## 3. Constraints
- Work strictly inside the local theme repository (`D:/Portfolio project/cr7`).
- Native Shopify theme component framework compatibility (`snippets/header-drawer.liquid`, `sections/header.liquid`, `assets/header-drawer.js`).
- Fast, smooth performance on both desktop (`≥ 990px`) and mobile (`< 750px`) viewports.

---

## 4. Approaches Considered
- **Option 1 (Picked — Modern Off-Canvas Luxury Side Drawer):**
  A unified luxury off-canvas drawer triggered by a minimalist `[ ☰ MENU ]` button on both desktop and mobile, with bold editorial typography, featured fragrance mini-card, and utility footer.
  *Why Picked:* Keeps the hero visuals 100% clean and modern, matching contemporary luxury brand aesthetics.
- **Option 2 (Floating Horizontal Mega-Menu):**
  Standard horizontal top links with hover dropdowns.
  *Tradeoffs:* Clutters the top hero area and doesn't provide the high-fashion editorial feel requested by the user.

---

## 5. Component Anatomy & Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│ [ ☰ MENU ]                 [ CR7 LOGO ]      [🔍] [♡ 2] [🛍️ 1] │
└─────────────────────────────────────────────────────────────┘
                               ▲
                 (User clicks [ ☰ MENU ])
                               │
                               ▼
┌────────────────────────────┬────────────────────────────────┐
│  CR7 MONOGRAM          [✕] │                                │
│                            │                                │
│  01. ALL FRAGRANCES   →    │                                │
│  02. SIGNATURE SCENTS →    │                                │
│  03. NEW ARRIVALS     →    │         BLURRED FROSTED        │
│  04. BEYOND THE LEGEND→    │            BACKDROP            │
│  05. TRUST & PERKS    →    │                                │
│                            │      (Click to dismiss)        │
│  ┌──────────────────────┐  │                                │
│  │ FEATURED SCENT       │  │                                │
│  │ [Image: CR7 Energy]  │  │                                │
│  │ CR7 Energy • $167    │  │                                │
│  │ Shop Now →           │  │                                │
│  └──────────────────────┘  │                                │
│                            │                                │
│  Track Order • FAQs • UK   │                                │
│  [IG] [X] [FB] [YT]        │                                │
└────────────────────────────┴────────────────────────────────┘
```

---

## 6. Files Touched
1. `sections/header-group.json`: Set header layout parameters (`logo_position: "center"`, `menu_style: "drawer"`).
2. `snippets/header-drawer.liquid`: Re-architect drawer markup to include editorial numbered navigation links, featured fragrance mini-card, and utility footer.
3. `snippets/header-actions.liquid`: Add Wishlist quick link with counter bubble.
4. `assets/base.css`: Luxury drawer animations, slide-in geometry, typography, and frosted glass styles.
