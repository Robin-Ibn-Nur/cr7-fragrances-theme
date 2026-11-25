# Cinematic Athletic Luxury (CR7 Landing Page - Direction 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CR7 landing page into an electrifying, high-contrast "Cinematic Athletic Luxury" storefront (inspired by NikeLab, Balenciaga, and Off-White sports-luxe aesthetics) featuring sharp architectural geometry, electric neon accents, technical athletic typography, high-velocity hover zooms, and industrial spec cards.

**Architecture:** Replace Direction 1 soft glassmorphism in `assets/base.css` with sharp, high-contrast sports-luxe CSS custom properties and component rules. Enhance typography and button behaviors with angular geometry and electric neon transitions.

**Tech Stack:** Liquid, Shopify Theme Architecture (Horizon), CSS Custom Properties, GPU-accelerated CSS Transitions, Vanilla JS.

**Spec:** Direction 3 ("Cinematic Athletic Luxury") requested by the user to replace Direction 1.

## Global Constraints
- Preserve theme settings contracts and merchant customization capabilities.
- Keep all work strictly in the local workspace (`D:/Portfolio project/cr7`); DO NOT deploy or push to the live store.
- Maintain full accessibility: high text-to-background contrast and `prefers-reduced-motion` fallbacks.
- Verify both desktop (`>= 990px`) and mobile (`< 750px`) viewports on `http://127.0.0.1:9292`.

## Review Focus
- Sharp corners and borders render cleanly across all device pixel ratios without subpixel artifacting.
- Rapid image micro-zooms run at steady 60fps without triggering layout recalculations.
- Neon colors maintain WCAG AA contrast against dark backgrounds for all text content.
- Tickers and marquees flow smoothly without horizontal page overflow.
- Mobile touch taps register immediately without sticky hover styles.

---

### Task 1: Reset Direction 1 Styles and Scaffold Direction 3 Design Tokens

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `assets/base.css`
- Produces: Clean baseline with Direction 1 soft glassmorphism removed, replaced by Direction 3 athletic luxury variables and foundations.

- [ ] **Step 1: Locate and remove all Direction 1 soft rounded glass blocks from `assets/base.css`**
- [ ] **Step 2: Define Direction 3 athletic luxury design tokens in `assets/base.css`**
  ```css
  :root {
    --cr7-athletic-neon: #00ff66;
    --cr7-athletic-neon-glow: rgba(0, 255, 102, 0.4);
    --cr7-athletic-carbon: #080808;
    --cr7-athletic-border: #1a1a1a;
    --cr7-athletic-border-hover: #00ff66;
    --cr7-athletic-radius: 2px;
  }
  ```
- [ ] **Step 3: Verify clean server reload on `http://127.0.0.1:9292`**

---

### Task 2: Technical Athletic Header & High-Speed Ticker Navigation

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `#header-component`, `.header-section`, `.announcement-bar`
- Produces: Razor-sharp carbon header with electric neon bottom hairline border and athletic uppercase letter-spaced navigation.

- [ ] **Step 1: Add sharp carbon header rules with neon bottom border in `assets/base.css`**
- [ ] **Step 2: Style header menu items with athletic tracking and neon underline highlight**
- [ ] **Step 3: Style announcement bar as high-speed athletic dispatch ticker**
- [ ] **Step 4: Verify header responsiveness on desktop and mobile**

---

### Task 3: Cinematic Hero Athletic Typography & Angular Action Buttons

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `.hero`, `.button-custom`, `.button-secondary`, `[class*='text_3RtPwk']`, `[class*='text_gmgzkR']`
- Produces: Bold, electric "LEGEND" title, angular `[ CR7 // SIGNATURE ]` technical badge, and sharp neon action buttons.

- [ ] **Step 1: Style hero "LEGEND" with high-impact electric cut styling and intense drop-shadow**
- [ ] **Step 2: Style "CR7 SIGNATURE COLLECTION" as an angular technical spec pill badge**
- [ ] **Step 3: Style `.button-custom` with sharp 2px corners, electric neon green background, and arrow micro-animation**
- [ ] **Step 4: Style `.button-secondary` with carbon background, sharp neon border, and high-velocity hover shift**
- [ ] **Step 5: Verify hero section rendering on `http://127.0.0.1:9292`**

---

### Task 4: Sports-Luxe Technical Product & Collection Cards (Sharp Geometry & Rapid Zoom)

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `product-card`, `.collection-card`, `.product-media__image`, `.price`
- Produces: Sharp rectangular card framing, high-velocity athletic image zoom, electric neon price tags, and angular quick-add buttons.

- [ ] **Step 1: Add sharp architectural frame styles for `product-card` and `.collection-card`**
- [ ] **Step 2: Add high-velocity athletic image micro-zoom (`transform: scale(1.08)`)**
- [ ] **Step 3: Style product prices and titles with technical sports-luxe typography**
- [ ] **Step 4: Style badges into sharp, high-contrast athletic tags (e.g. `[ 07 // OFFICIAL ]`)**
- [ ] **Step 5: Style Quick-Add button with sharp technical borders**
- [ ] **Step 6: Verify card interactions on `http://127.0.0.1:9292`**

---

### Task 5: Cinematic Split Showcases, Speed-Lines & Athletic Ticker Marquee

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `[id*='section_Dkf3Vq']`, `[id*='section_qKHGRq']`, `.marquee-wrapper`
- Produces: High-contrast athletic split panels with sharp borders and sports broadcast style ticker marquees.

- [ ] **Step 1: Style split showcase containers with sharp carbon framing and speed-line neon border transitions**
- [ ] **Step 2: Style marquee sections with electric neon slashes and high-impact sports broadcast typography**
- [ ] **Step 3: Verify split showcases on desktop and mobile**

---

### Task 6: Industrial Sports-Luxe Perks Specification Bar (`section_E9bfwM`)

**Files:**
- Modify: `assets/base.css`

**Interfaces:**
- Consumes: `[id*='section_E9bfwM']`
- Produces: Industrial specification bar with technical carbon container, sharp dividers, and glowing athletic icons.

- [ ] **Step 1: Style `section_E9bfwM` container as a technical carbon panel with sharp 2px corners and neon accent**
- [ ] **Step 2: Add electric neon glow to perk icons and athletic specification typography**
- [ ] **Step 3: Verify perks bar on desktop and mobile**

---

### Task 7: Automated Verification & Responsive Testing

**Files:**
- Review: `assets/base.css`, `sections/hero.liquid`, `templates/index.json`

**Interfaces:**
- Consumes: Full storefront on `http://127.0.0.1:9292`
- Produces: Test results verifying 0 errors, full responsiveness, intact scrolling, and zero live deployments.

- [ ] **Step 1: Run comprehensive verification script testing all Direction 3 styles and elements**
- [ ] **Step 2: Verify smooth mouse wheel scrolling on desktop (`.page-wrapper`) and mobile**
- [ ] **Step 3: Confirm 0 git/live pushes**
