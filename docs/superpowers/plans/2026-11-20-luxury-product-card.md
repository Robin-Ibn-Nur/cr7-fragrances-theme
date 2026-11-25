# Trendy & Modern Luxury Product Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate a bespoke, modern e-commerce product card snippet (`snippets/luxury-product-card.liquid`) featuring dual-image hover cross-fade, floating wishlist toggle, curated olfactory notes badge, and a smooth slide-up Quick Add button with direct Cart Drawer Ajax integration.

**Architecture:** Encapsulate the entire card layout into `snippets/luxury-product-card.liquid` with high-performance CSS in `assets/base.css` and a lightweight Vanilla JS component for 1-click Ajax cart addition and wishlist state persistence. Integrate cleanly into `sections/product-list.liquid`.

**Tech Stack:** Liquid, Shopify Theme Architecture (Horizon), CSS Custom Properties, Vanilla JS, Shopify Ajax Cart API (`/cart/add.js`).

**Spec:** [docs/superpowers/specs/2026-11-20-luxury-product-card-design.md](file:///D:/Portfolio%20project/cr7/docs/superpowers/specs/2026-11-20-luxury-product-card-design.md)

## Global Constraints
- Work strictly in the local workspace (`D:/Portfolio project/cr7`); DO NOT deploy or push to live store.
- Preserve theme settings contracts, Shopify variant pricing, and checkout semantics.
- Maintain full accessibility: high text-to-background contrast (WCAG AA) and `prefers-reduced-motion` fallbacks.
- Verify both desktop (`>= 990px`) and mobile (`< 750px`) viewports on `http://127.0.0.1:9292`.

## Review Focus
- Dual-image hover transitions run at steady 60fps on GPU without triggering layout recalculations.
- Quick Add button accurately posts to `/cart/add.js` and opens the native Cart Drawer.
- Products with a single image fall back gracefully without broken image placeholders.
- Wishlist toggle state persists across page refreshes via `localStorage`.
- Mobile viewport displays the Quick Add action cleanly without requiring cursor hover.

---

### Task 1: Create `snippets/luxury-product-card.liquid`

**Files:**
- Create: `snippets/luxury-product-card.liquid`

**Interfaces:**
- Consumes: `product` (Shopify Product Drop)
- Produces: Complete semantic markup for the product card (`.luxury-product-card`)

- [ ] **Step 1: Write `snippets/luxury-product-card.liquid` with full data model and markup**
  - Primary image: `product.featured_media.preview_image | image_url: width: 600`
  - Secondary image: `product.media[1].preview_image | image_url: width: 600` (falls back to primary if no second image)
  - Floating Badge: `BESTSELLER` for flagship scents, `NEW` for new arrivals, or `SAVE X%` if `compare_at_price > price`
  - Wishlist Heart Button: `<button type="button" class="luxury-product-card__wishlist" data-wishlist-toggle data-product-handle="{{ product.handle }}">`
  - Scent Notes Mapping: Liquid `case` matching `product.handle` to signature accords (e.g., `cr7-energy-1` -> `Bergamot • Pink Pepper • Cedarwood`, `cristiano-ronaldo-legacy` -> `Bergamot • Cinnamon • Ambergris`, `cr7-game-on` -> `Cardamom • Violet • Tonka Bean`)
  - Subtitle: `CR7 FRAGRANCE • EAU DE PARFUM`
  - Product Title: `{{ product.title | escape }}` linked to `{{ product.url }}`
  - Price formatting: Regular price + compare-at strike-through using Shopify's `money` filter
  - Quick Add Button: `<button type="button" class="luxury-product-card__quick-add" data-quick-add data-variant-id="{{ product.selected_or_first_available_variant.id }}">`

- [ ] **Step 2: Verify Liquid syntax and presence of snippet**
  Run: `Test-Path snippets\luxury-product-card.liquid` in powershell.
  Expected: `True`

---

### Task 2: Implement Component Styles in `assets/base.css`

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: Classes defined in `snippets/luxury-product-card.liquid` (`.luxury-product-card`, `.luxury-product-card__gallery`, `.luxury-product-card__quick-add`, etc.)
- Produces: High-fashion dark luxury styling, 60fps image hover transitions, slide-up button animation, and responsive adjustments

- [ ] **Step 1: Add `.luxury-product-card` CSS rules to `assets/base.css`**
  - Container: `#080808` matte black background, `1px solid rgba(255, 255, 255, 0.1)` hairline border, 0px radius, padding `14px`, transition `all 0.35s ease`.
  - Hover: Subtle elevation `transform: translateY(-4px)`, border highlighted to `rgba(255, 255, 255, 0.35)`, deep shadow `0 16px 35px rgba(0, 0, 0, 0.85)`.
  - Media container: `position: relative; overflow: hidden; background: #030303; aspect-ratio: 1 / 1.15;`.
  - Image cross-fade: `.luxury-product-card__image--primary` and `.luxury-product-card__image--secondary` with `position: absolute; inset: 0; object-fit: cover; transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);`. On hover, primary fades/scales and secondary becomes visible.
  - Floating Badges: Top-left pill badge (`background: rgba(0, 0, 0, 0.8); border: 1px solid rgba(255, 255, 255, 0.3); font-size: 0.625rem; letter-spacing: 0.16em; text-transform: uppercase; color: #fff; padding: 4px 10px;`).
  - Floating Wishlist Heart: Top-right circular button with frosted blur `rgba(0,0,0,0.6)`, SVG heart icon, hover scale `1.15`, active filled red state.
  - Slide-Up Quick Add: Desktop `position: absolute; bottom: 12px; left: 12px; right: 12px; transform: translateY(120%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); background: #ffffff; color: #000000; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px; border: none; cursor: pointer;`. On card hover: `transform: translateY(0);`.
  - Typography: Kicker (`font-size: 0.6875rem; letter-spacing: 0.22em; color: #888; text-transform: uppercase; margin-top: 12px;`), Title (`font-size: 0.9375rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #ffffff;`), Scent Notes pill (`display: inline-block; font-size: 0.6875rem; letter-spacing: 0.08em; color: #aaaaaa; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); padding: 3px 8px; margin-block: 6px;`), Price (`font-size: 0.9375rem; font-weight: 700; color: #ffffff; letter-spacing: 0.06em;`).
  - Mobile breakpoint (`@media (max-width: 749px)`): Quick Add button positioned statically or always accessible without requiring hover.

- [ ] **Step 2: Verify CSS rules presence and syntax**
  Run search in `assets/base.css` for `.luxury-product-card`.

---

### Task 3: Interactive Quick Add (Ajax Cart) & Wishlist Persistence

**Files:**
- Create or embed: `assets/luxury-product-card.js` (or embedded script module in snippet)

**Interfaces:**
- Consumes: `button[data-quick-add]`, `button[data-wishlist-toggle]`
- Produces: Direct `fetch('/cart/add.js')`, triggers Shopify Cart Drawer update, and stores wishlist state in `localStorage`

- [ ] **Step 1: Implement Quick Add Ajax submission**
  - Event listener on `[data-quick-add]` click:
    - Prevent card navigation
    - Show loading spinner or "ADDING..." text
    - `fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: variantId, quantity: 1 }) })`
    - On success: Change button text to "ADDED ✓" for 1.5s
    - Dispatch theme event (`document.dispatchEvent(new CustomEvent('cart:refresh'))` and open cart drawer `#cart-drawer`) so user sees their new item in the drawer immediately.
    - On error: Revert text and log error gracefully.

- [ ] **Step 2: Implement Wishlist Toggle**
  - Reads `localStorage.getItem('cr7_wishlist')` on init, highlights active hearts.
  - On click: toggles handle in localStorage array, updates SVG fill and `aria-pressed`.

- [ ] **Step 3: Test Ajax Cart API locally via curl or browser fetch**
  Verify `/cart/add.js` returns HTTP 200 with JSON cart response.

---

### Task 4: Integrate into `sections/product-list.liquid` & Verify

**Files:**
- Modify: `sections/product-list.liquid`

**Interfaces:**
- Consumes: `snippets/luxury-product-card.liquid`
- Produces: Rendered luxury product cards in the Featured Products / New Arrivals section on the homepage

- [ ] **Step 1: Replace block-based card rendering with `{% render 'luxury-product-card', product: product %}` in `sections/product-list.liquid`**
- [ ] **Step 2: Test live page in local server `http://127.0.0.1:9292`**
  - Verify all products in the New Arrivals grid render with the new luxury styling.
  - Hover over a card: verify dual-image transition and slide-up Quick Add button.
  - Click Quick Add: verify product adds to cart and drawer opens.
  - Click Wishlist heart: verify active fill toggle.
  - Check mobile viewport (< 750px): verify layout stays clean and accessible.
