# Modern Off-Canvas Luxury Side Drawer & Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CR7 header into a trendy, high-fashion 3-column layout (Left: `[ ☰ MENU ]`, Center: Logo, Right: Actions with Wishlist & Cart) paired with an immersive, full-height Off-Canvas Luxury Side Drawer featuring editorial navigation links, a featured scent showcase mini-card, and utility footer.

**Architecture:** Configure `sections/header-group.json` for centered-logo drawer navigation, re-architect `snippets/header-drawer.liquid` with modern luxury editorial markup, integrate Wishlist actions into `snippets/header-actions.liquid`, and apply high-performance GPU-accelerated styling in `assets/base.css`.

**Tech Stack:** Liquid, Shopify Theme Architecture (Horizon), CSS Custom Properties, Vanilla JS, GPU-accelerated Transitions.

**Spec:** [docs/superpowers/specs/2026-11-20-luxury-header-drawer-design.md](file:///D:/Portfolio%20project/cr7/docs/superpowers/specs/2026-11-20-luxury-header-drawer-design.md)

## Global Constraints
- Work strictly in the local workspace (`D:/Portfolio project/cr7`); DO NOT deploy or push to live store.
- Preserve theme settings contracts, accessibility standards, and search/cart dialog lifecycle.
- Maintain full accessibility: high text contrast (WCAG AA), Escape key dismissal, and `prefers-reduced-motion` fallbacks.
- Verify both desktop (`>= 990px`) and mobile (`< 750px`) viewports on `http://127.0.0.1:9292`.

## Review Focus
- Off-canvas drawer slides smoothly at 60fps from the left without horizontal layout jank.
- Body scroll is locked while the drawer is open to prevent underlying page scroll jitter.
- The 3-column header remains perfectly balanced on wide desktops and narrow mobile screens.
- Wishlist icon reflects live saved count from `localStorage`.
- All drawer navigation links route to valid collections and anchor sections.

---

### Task 1: Re-architect `snippets/header-drawer.liquid` Markup

**Files:**
- Modify: `snippets/header-drawer.liquid`

**Interfaces:**
- Consumes: Theme drawer details/summary toggle
- Produces: Enhanced off-canvas luxury side navigation tree with numbered editorial links, featured fragrance spotlight card, and utility footer

- [ ] **Step 1: Update drawer structure in `snippets/header-drawer.liquid`**
  - Trigger button: Render sleek `[ ☰ MENU ]` text button with minimal 2-bar SVG icon.
  - Drawer Top: Brand Monogram `CR7` + Close button `✕`.
  - Primary Navigation: Clean list of high-fashion links:
    - `01. ALL FRAGRANCES` -> `/collections/all`
    - `02. SIGNATURE COLLECTION` -> `/collections/all`
    - `03. NEW ARRIVALS` -> `/#shopify-section-product_list_MhFCTe`
    - `04. BEYOND THE LEGEND` -> `/#shopify-section-section_rtDKDm`
    - `05. SPLIT SHOWCASES` -> `/#shopify-section-section_Dkf3Vq`
  - Featured Fragrance Spotlight Card:
    - Image: Flagship fragrance thumbnail (`CR7 Energy` bottle shot)
    - Badge: `SPOTLIGHT SCENT`
    - Title: `CR7 ENERGY • EAU DE PARFUM`
    - Link: `Shop Flagship Drop →`
  - Drawer Footer:
    - Fast utility links: `Track Order`, `Help & FAQs`, `Complimentary UK Shipping`
    - Social Media Links with SVG icons (Instagram, YouTube, X, Facebook)

- [ ] **Step 2: Verify Liquid syntax and rendering of `snippets/header-drawer.liquid`**
  Run: Check local dev log for clean Liquid parsing.

---

### Task 2: Configure Header Layout in `sections/header-group.json` & `snippets/header-actions.liquid`

**Files:**
- Modify: `sections/header-group.json`
- Modify: `snippets/header-actions.liquid`

**Interfaces:**
- Consumes: Header group settings and actions layout
- Produces: 3-column centered logo layout with integrated Wishlist counter button

- [ ] **Step 1: Update `sections/header-group.json`**
  - Set `logo_position: "center"`
  - Set `menu_position: "left"`
  - Verify `show_search: true` and actions positioning
- [ ] **Step 2: Add Wishlist action button to `snippets/header-actions.liquid`**
  - Add a dedicated Wishlist button in header actions: `<button class="header-actions__action header-actions__wishlist button-unstyled" ...>` with heart SVG and live badge `<span class="header-actions__wishlist-count" data-wishlist-header-count hidden>0</span>`.
- [ ] **Step 3: Update `assets/luxury-product-card.js` to sync header wishlist counter**
  - When wishlist is toggled or page loads, update `data-wishlist-header-count` with `list.length`.

---

### Task 3: Implement Off-Canvas Luxury Drawer Styles in `assets/base.css`

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: Classes from Task 1 and Task 2 (`.header-drawer`, `.menu-drawer`, `.menu-drawer__luxury-content`, etc.)
- Produces: Dark obsidian glassmorphic drawer panel, smooth 60fps GPU slide-in, bold typography, and 3-column header balance

- [ ] **Step 1: Author `.menu-drawer` luxury styling in `assets/base.css`**
  - Position & Dimensions: `width: clamp(340px, 32vw, 480px); height: 100vh; position: fixed; top: 0; left: 0; background: rgba(8, 8, 8, 0.94); backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px); border-right: 1px solid rgba(255, 255, 255, 0.12); z-index: var(--layer-menu-drawer); overflow-y: auto; display: flex; flex-direction: column; padding: 36px 32px;`.
  - Backdrop: Frosted dimmed overlay covering the remainder of the viewport (`background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px);`).
  - Navigation Typography: `font-size: clamp(1.15rem, 1.8vw, 1.5rem); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #ffffff; padding-block: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); transition: transform 0.3s ease, color 0.3s ease;`.
  - Hover micro-interaction: `transform: translateX(8px); color: #ffffff;` with sleek arrow indicator (`→`) appearing smoothly on hover.
  - Featured Spotlight Card: Styled with hairline border, subtle dark gradient, bottle image thumbnail, and call-to-action button.
  - Header 3-Column Balancing:
    - Left column: Prominent `[ ☰ MENU ]` button.
    - Center column: Perfectly centered CR7 Logo.
    - Right column: Clean row of Search, Wishlist (with badge), and Cart bag.
  - Mobile Responsiveness (`< 750px`): Drawer expands to 100% or `88vw` with comfortable touch targets.

- [ ] **Step 2: Verify CSS rules presence in `assets/base.css`**
  Run search in `assets/base.css` for `.menu-drawer__luxury`.

---

### Task 4: Verify Live Experience on `http://127.0.0.1:9292`

**Files:**
- Verify: Full storefront on `http://127.0.0.1:9292`

**Interfaces:**
- Consumes: Live dev server
- Produces: Verified 3-column floating header and off-canvas luxury side drawer

- [ ] **Step 1: Check live header on `http://127.0.0.1:9292`**
  - Verify left `[ ☰ MENU ]` button, center logo, and right action buttons (Search, Wishlist, Cart).
  - Click `[ ☰ MENU ]`: verify off-canvas drawer glides in smoothly from the left.
  - Check numbered navigation links, featured scent spotlight card, and footer utilities.
  - Click Wishlist heart on a product card: verify header wishlist counter updates live!
  - Click Close `✕` or click backdrop: verify drawer slides away cleanly without scroll lock leaks.
  - Check mobile viewport (< 750px): verify layout adapts seamlessly.
