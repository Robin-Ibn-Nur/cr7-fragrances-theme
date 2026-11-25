# Editorial High-Fashion Minimalist (CR7 Landing Page - Direction 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CR7 landing page into an "Editorial High-Fashion Minimalist" storefront (inspired by Celine, Saint Laurent, and Tom Ford runway aesthetics) featuring monochrome black & white contrast, razor-thin hairline borders, delicate high-fashion typography, graceful gallery-style micro-zooms, and understated quiet-luxury buttons.

**Architecture:** Replace Direction 3 high-voltage athletic rules in `assets/base.css` with clean, editorial high-fashion design tokens and component styling.

**Tech Stack:** Liquid, Shopify Theme Architecture (Horizon), CSS Custom Properties, GPU-accelerated CSS Transitions, Vanilla JS.

**Spec:** Direction 2 ("Editorial High-Fashion Minimalist") requested by the user.

## Global Constraints
- Preserve theme settings contracts and merchant customization capabilities.
- Keep all work strictly in the local workspace (`D:/Portfolio project/cr7`); DO NOT deploy or push to the live store.
- Maintain full accessibility: high text-to-background contrast and `prefers-reduced-motion` fallbacks.
- Verify both desktop (`>= 990px`) and mobile (`< 750px`) viewports on `http://127.0.0.1:9292`.

## Review Focus
- Monochrome contrast maintains WCAG AA compliance across all light and dark text elements.
- Clean hairline borders (1px) render sharply across HiDPI and standard displays.
- Gallery-style image micro-zooms remain gentle (1.03x) and smooth at 60fps.
- Inverted button states provide crisp visual feedback without layout jitter.
- Mobile viewport retains quiet-luxury spacing without visual clutter.

---

### Task 1: Reset Direction 3 Styles & Scaffold Direction 2 Editorial Tokens

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `assets/base.css`
- Produces: Clean baseline removing Direction 3 neon athletic styles, replacing with Direction 2 editorial high-fashion tokens.

- [ ] **Step 1: Locate and remove all Direction 3 neon athletic rules from `assets/base.css`**
- [ ] **Step 2: Define Direction 2 editorial tokens (monochrome palette, hairline borders, deliberate luxury easing)**
- [ ] **Step 3: Verify clean server sync on `http://127.0.0.1:9292`**

---

### Task 2: Understated High-Fashion Header & Editorial Announcement Bar

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `#header-component`, `.header-section`, `.announcement-bar`
- Produces: Understated matte obsidian header with razor-thin hairline border and high-fashion letter-spaced navigation.

- [ ] **Step 1: Style header with matte black backdrop and 1px hairline border**
- [ ] **Step 2: Add high-fashion tracking (`letter-spacing: 0.22em`) to navigation items with subtle opacity transitions**
- [ ] **Step 3: Style announcement bar as an editorial dispatch bar**
- [ ] **Step 4: Verify header appearance on desktop and mobile**

---

### Task 3: Hero Section High-Fashion Editorial Typography & Monochrome Buttons

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `.hero`, `.button-custom`, `.button-secondary`, `[class*='text_3RtPwk']`, `[class*='text_gmgzkR']`
- Produces: Elegant serif "LEGEND" typography, delicate editorial subtitle tag, and quiet-luxury inverted monochrome buttons.

- [ ] **Step 1: Style hero "LEGEND" title with pristine platinum-white serif typography and understated depth**
- [ ] **Step 2: Style "CR7 SIGNATURE COLLECTION" as an editorial hairline badge (`letter-spacing: 0.25em`)**
- [ ] **Step 3: Style `.button-custom` as solid white with black text, inverting to black with white border on hover**
- [ ] **Step 4: Style `.button-secondary` as translucent with razor-thin white border, inverting to white on hover**
- [ ] **Step 5: Verify hero section rendering on `http://127.0.0.1:9292`**

---

### Task 4: Gallery-Style Product & Collection Cards (Delicate 1.03x Zoom & Crisp Typography)

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `product-card`, `.collection-card`, `.product-media__image`, `.price`
- Produces: Gallery-style card presentation with subtle hairline borders, delicate 1.03x image zoom, and editorial monochrome pricing.

- [ ] **Step 1: Style cards with sleek gallery borders (`1px solid rgba(255, 255, 255, 0.08)`) and gentle elevation**
- [ ] **Step 2: Add graceful editorial image micro-zoom (`transform: scale(1.03)`) with 0.8s luxury easing**
- [ ] **Step 3: Style product titles and prices in crisp editorial monochrome**
- [ ] **Step 4: Style product badges as quiet luxury editorial tags**
- [ ] **Step 5: Style Quick-Add button with minimal outline styling**
- [ ] **Step 6: Verify card interactions on `http://127.0.0.1:9292`**

---

### Task 5: Editorial Split Showcases & Refined Monochrome Marquee

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `[id*='section_Dkf3Vq']`, `[id*='section_qKHGRq']`, `.marquee-wrapper`
- Produces: Seamless split showcase panels and quiet editorial marquee ticker.

- [ ] **Step 1: Style split showcases with understated dark borders and subtle hover elevation**
- [ ] **Step 2: Style marquee with refined letter-spacing and delicate bullet accents (`·`)**
- [ ] **Step 3: Verify split showcases on desktop and mobile**

---

### Task 6: Minimalist Trust Perks Bar (`section_E9bfwM`)

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `[id*='section_E9bfwM']`
- Produces: Clean editorial service strip with hairline dividers and monochrome iconography.

- [ ] **Step 1: Style `section_E9bfwM` container with matte carbon background and razor-thin hairline borders**
- [ ] **Step 2: Style perk icons with clean monochrome contrast and editorial serif/sans copy**
- [ ] **Step 3: Verify perks bar on desktop and mobile**

---

### Task 7: Automated Verification & Responsive Testing

**Files:**
- Review: `assets/base.css`, `sections/hero.liquid`, `templates/index.json`

**Interfaces:**
- Consumes: Storefront on `http://127.0.0.1:9292`
- Produces: Verification results confirming 0 errors, full responsiveness, smooth scrolling, and zero live deployments.

- [ ] **Step 1: Run comprehensive verification script for Direction 2 styles**
- [ ] **Step 2: Verify smooth mouse scrolling on desktop and mobile**
- [ ] **Step 3: Confirm 0 git/live pushes**
