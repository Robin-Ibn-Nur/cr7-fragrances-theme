# Dark Luxury & Emerald Glow (CR7 Landing Page) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CR7 store landing page into a luxury, premium digital experience featuring obsidian glassmorphism, metallic emerald glows, micro-interaction elevations on product and collection cards, floating frosted navigation, and ambient lighting depth.

**Architecture:** Apply targeted, settings-aligned CSS custom properties and component rules in `assets/base.css` and `sections/hero.liquid`, with layout and spacing refinements in `templates/index.json` and `sections/header-group.json`. No external dependencies or heavy frameworks.

**Tech Stack:** Liquid, Shopify Theme Architecture (Horizon), CSS Custom Properties, GPU-accelerated CSS Transitions, Vanilla JS.

**Spec:** Direction 1 ("Dark Luxury & Emerald Glow") approved in brainstorming.

## Global Constraints
- Preserve theme settings contracts and merchant customization capabilities.
- Keep all work strictly in the local workspace (`D:/Portfolio project/cr7`); DO NOT deploy or push to the live store.
- Maintain full accessibility: high text-to-background contrast and `prefers-reduced-motion` fallbacks.
- Verify both desktop (`>= 990px`) and mobile (`< 750px`) viewports on `http://127.0.0.1:9292`.

## Review Focus
- Floating header transparency does not cause text illegibility over complex hero images.
- Card hover elevations perform at 60fps on GPU without triggering layout reflows.
- Emerald text gradients gracefully fall back to solid `#00ff80` on unsupported browsers.
- Dark ambient glows do not wash out product photography or bottle details.
- Mobile touch interactions feel responsive without sticky hover states.

---

### Task 1: Glassmorphism Floating Header & Navigation Styling

**Files:**
- Modify: `assets/base.css`
- Modify: `sections/header-group.json`

**Interfaces:**
- Consumes: `#header-group`, `.header-section`, `.announcement-bar`
- Produces: Frosted glass header styles with subtle emerald glow border and luxury menu item hover underlines.

- [ ] **Step 1: Inspect header component selectors and existing rules in `assets/base.css`**
- [ ] **Step 2: Add glassmorphism styling for sticky/floating header in `assets/base.css`**
  ```css
  #header-component {
    background: rgba(10, 10, 10, 0.8) !important;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 255, 128, 0.12);
    transition: background 0.3s ease, border-color 0.3s ease;
  }
  ```
- [ ] **Step 3: Refine announcement bar styling in `sections/header-group.json` and `assets/base.css`**
  Add elegant letter-spacing and sleek divider accent.
- [ ] **Step 4: Verify header appearance on `http://127.0.0.1:9292`**
  Ensure menu links, cart icon, and search retain high contrast and crisp legibility.

---

### Task 2: Hero Banner Luxury Typography & Button Micro-interactions

**Files:**
- Modify: `sections/hero.liquid`
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `#Hero-{{ section.id }}`, `.hero__content-wrapper`, `.button-custom`, `.button-secondary`
- Produces: Metallic emerald gradient text effect, frosted badge treatment, luxury button glow animations.

- [ ] **Step 1: Add metallic emerald gradient and luxury glow rules for hero headings in `assets/base.css`**
  ```css
  .hero-luxury-title {
    background: linear-gradient(135deg, #ffffff 0%, #00ff80 50%, #00a83b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 24px rgba(0, 255, 128, 0.25));
  }
  ```
- [ ] **Step 2: Add luxury button hover micro-interactions in `assets/base.css`**
  Refine `.button-custom` and `.button-secondary` with smooth glow transition, slight elevation (`translateY(-2px)`), and subtle inner sheen.
- [ ] **Step 3: Update hero pill tag styling in `sections/hero.liquid`**
  Ensure "CR7 SIGNATURE COLLECTION" appears as a clean frosted glass pill with 1px border.
- [ ] **Step 4: Verify hero typography and buttons on `http://127.0.0.1:9292`**

---

### Task 3: Product Cards & Collection Cards Luxury Elevation and Image Micro-zoom

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `product-card`, `._collection-card`, `.group-block`
- Produces: Ambient emerald card hover shadow, 1px translucent glass border, and smooth `scale(1.04)` image micro-zoom.

- [ ] **Step 1: Add card container base glass border and shadow styles in `assets/base.css`**
  ```css
  product-card,
  ._collection-card {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 8px;
  }
  product-card:hover,
  ._collection-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 0 20px -2px rgba(0, 255, 128, 0.12);
  }
  ```
- [ ] **Step 2: Add smooth image micro-zoom on card media**
  ```css
  product-card:hover img,
  ._collection-card:hover img {
    transform: scale(1.04);
  }
  product-card img,
  ._collection-card img {
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  ```
- [ ] **Step 3: Enhance price typography and badges**
  Give price tags clear contrast and refine product badges into luxury pills.
- [ ] **Step 4: Verify card hover interactions on `http://127.0.0.1:9292`**

---

### Task 4: Ambient Emerald Lighting (Mesh Glows) & Split Showcases

**Files:**
- Modify: `assets/base.css`
- Modify: `templates/index.json`

**Interfaces:**
- Consumes: `.section-resource-list`, `.split-showcase`, `section_Dkf3Vq`, `section_qKHGRq`
- Produces: Spatial depth through subtle background radial glows behind key showcase sections.

- [ ] **Step 1: Add ambient emerald background glow utilities in `assets/base.css`**
  ```css
  .ambient-emerald-glow {
    position: relative;
  }
  .ambient-emerald-glow::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(0, 168, 59, 0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  ```
- [ ] **Step 2: Refine split showcase cards with subtle borders and rounded corners**
  Add `border-radius: 12px` and subtle translucent dark borders on split showcase image panels.
- [ ] **Step 3: Verify ambient depth on `http://127.0.0.1:9292`**

---

### Task 5: Trust Badges / Perks Modernization (`section_E9bfwM`)

**Files:**
- Modify: `assets/base.css`
- Modify: `templates/index.json`

**Interfaces:**
- Consumes: `section_E9bfwM` ("100% Authentic Guaranteed", "Complimentary Delivery", etc.)
- Produces: Luxury carbon glass panel with glowing emerald icon accents.

- [ ] **Step 1: Style `section_E9bfwM` container as a sleek floating glass panel**
  ```css
  #shopify-section-template--24629955559640__section_E9bfwM .section-content-wrapper {
    background: rgba(14, 14, 14, 0.85);
    border: 1px solid rgba(0, 255, 128, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.05);
  }
  ```
- [ ] **Step 2: Add subtle emerald glow to perk icons**
  ```css
  #shopify-section-template--24629955559640__section_E9bfwM img {
    filter: drop-shadow(0 0 6px rgba(0, 255, 128, 0.45));
  }
  ```
- [ ] **Step 3: Verify perk bar on desktop and mobile on `http://127.0.0.1:9292`**

---

### Task 6: Final Verification & Evidence Collection

**Files:**
- Review: `assets/base.css`, `sections/hero.liquid`, `templates/index.json`, `layout/theme.liquid`

**Interfaces:**
- Consumes: Full storefront rendered markup on `http://127.0.0.1:9292`
- Produces: Verification logs confirming 0 console errors, 60fps animations, intact responsiveness.

- [ ] **Step 1: Check HTTP response codes and asset delivery**
- [ ] **Step 2: Verify desktop layout (`>= 990px`) and smooth scroll behavior**
- [ ] **Step 3: Verify mobile layout (`< 750px`) and responsive card sizing**
- [ ] **Step 4: Confirm zero git/live push occurred**
