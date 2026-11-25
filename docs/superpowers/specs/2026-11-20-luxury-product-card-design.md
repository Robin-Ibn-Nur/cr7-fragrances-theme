# Trendy & Modern Luxury Product Card Component Design

**Date:** 2026-11-20  
**Topic:** Bespoke Luxury E-Commerce Product Card Snippet (`luxury-product-card.liquid`)  
**Status:** Pending Approval  

---

## 1. Intent & The Why
In luxury e-commerce (such as Byredo, Tom Ford, Le Labo, and NikeLab), product cards are not merely passive image-and-text blocks. They are dynamic, interactive showcase units that captivate shoppers with micro-interactions, secondary lifestyle visuals on hover, instant olfactory note previews, floating wishlist toggles, and seamless slide-up Quick Add buttons that add items directly to the cart without leaving the page.

The goal is to replace the rigid, disjointed default product card blocks with a unified, high-performance snippet (`snippets/luxury-product-card.liquid`) that transforms the CR7 product showcase into a trendy, modern, and ultra-premium shopping experience.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Self-Contained Snippet (`snippets/luxury-product-card.liquid`):** Encapsulate all markup, media handling, badges, tags, and actions into one clean snippet.
- **Dual-Image Hover Cross-Fade:** Display the primary product bottle image, smoothly transitioning to the secondary image (or an artistic angled zoom) on cursor hover at steady 60fps.
- **Floating Badges & Wishlist Action:**
  - Top-left: Minimalist luxury badge (`BESTSELLER`, `NEW`, `SIGNATURE`).
  - Top-right: Interactive Wishlist Heart button with smooth scale & active state micro-animation.
- **Scent Notes & Concentration Subtext:**
  - Subtitle: `CR7 FRAGRANCE • EAU DE PARFUM 100ML`.
  - Olfactory Accords Tag: Curated note pills (e.g., `Bergamot • Cardamom • Cedarwood`).
- **Modern Slide-Up Quick Add Button:**
  - Desktop: Button slides up smoothly over the lower portion of the image upon card hover (`+ QUICK ADD`), providing direct 1-click cart addition with loading feedback.
  - Mobile: Visible compact pill button accessible on touch viewports without hover friction.
- **Direct Cart Drawer Integration:** Triggers the theme's native cart drawer (`cart:open` / theme events) upon adding to cart via Ajax API (`/cart/add.js`).
- **Responsive & Accessible:** Clean layout on mobile (< 750px), tablet, and desktop, honoring `prefers-reduced-motion` and keyboard accessibility.

### Non-Goals
- Changing theme checkout routes or Shopify backend data structures.
- Breaking merchant-selected product prices or currency formatters.

### Anti-Goals
- Layout shifts or stutter during hover image swaps.
- Trapping focus or blocking links to the product detail page (`/products/{handle}`).

---

## 3. Constraints
- Work strictly inside the local theme workspace (`D:/Portfolio project/cr7`).
- Strictly adhere to Shopify Theme Architecture (Liquid filters, `image_url`, variant pricing, accessibility).
- Maintain WCAG AA contrast against dark backgrounds (`#070707` / `#000000`).
- Seamless hot-reload preview on `http://127.0.0.1:9292`.

---

## 4. Approaches Considered
- **Approach 1 (Picked — Dedicated `luxury-product-card.liquid` Snippet):**
  Build a dedicated modern product card snippet and connect it to `sections/product-list.liquid`.
  *Tradeoffs:* Requires authoring a self-contained snippet, but grants 100% control over dual-image hover, wishlist micro-interaction, scent notes badge, and slide-up Quick Add.
  *Why Picked:* Selected by the user as the cleanest, most modern and trendy solution.
- **Approach 2 (CSS-only Override on Existing Blocks):**
  Retain existing nested blocks and add styling only.
  *Tradeoffs:* Cannot dynamically pull secondary images, custom scent notes, or floating wishlist buttons cleanly.

---

## 5. UI Anatomy & Component Layout

```
┌─────────────────────────────────────────────────────────┐
│ [BESTSELLER]                                      [ ♡ ] │  <-- Floating Badge & Wishlist Heart
│                                                         │
│                                                         │
│                   PRIMARY BOTTLE IMAGE                  │
│             (Fades to Secondary Image on Hover)         │
│                                                         │
│                                                         │
│  [        + QUICK ADD  •  $156.00        ]              │  <-- Slide-Up Glass/White Action Button
├─────────────────────────────────────────────────────────┤
│ CR7 FRAGRANCE • EAU DE PARFUM                           │  <-- Brand Kicker
│ CRISTIANO RONALDO LEGACY                                │  <-- Product Title (Bold, uppercase)
│ Bergamot • Lavender • Ambergris • Cedarwood             │  <-- Scent Notes Preview Pill
│ $156.00  $185.00                                        │  <-- Price & Compare Price
└─────────────────────────────────────────────────────────┘
```

---

## 6. Scent Notes Mapping for CR7 Products
The snippet will map CR7 fragrance handles to their signature note accords:
- `cr7-energy-1` / `cr7-energy`: `Bergamot • Pink Pepper • Cedarwood`
- `cristiano-ronaldo-legacy`: `Bergamot • Cinnamon • Ambergris`
- `cristiano-ronaldo-discover`: `Citrus • Mandarin • Vetiver`
- `cr7`: `Cardamom • Tobacco • Amber`
- `cr7-play-it-cool`: `Mandarin • Sea Notes • Musk`
- `cr7-game-on`: `Cardamom • Violet • Tonka Bean`
- `cristiano-ronaldo-origins`: `Mandarin • Bay Leaf • Patchouli`

---

## 7. Files Touched
1. `snippets/luxury-product-card.liquid`: The new bespoke product card snippet.
2. `assets/base.css`: Card styling, hover transformations, slide-up animations, wishlist button, and responsive rules.
3. `sections/product-list.liquid`: Renders `{% render 'luxury-product-card', product: product %}` for clean, uniform grid rendering.
