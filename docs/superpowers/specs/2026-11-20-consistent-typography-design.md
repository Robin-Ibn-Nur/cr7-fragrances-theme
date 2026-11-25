# Consistent Typography Design (CR7 Storefront)

**Date:** 2026-11-20
**Topic:** Storefront Typography System Standardization (Option 1: Editorial Luxury)

## 1. Intent & The Why
The CR7 storefront currently features disparate typography across sections: mixed heading tags (`h1`, `h2`, `h3`, `<p>`), mismatched font families (`Playfair Display` serif vs `Montserrat` sans), inconsistent letter-tracking, and uneven descriptions. The goal is to establish a unified, cohesive, high-fashion editorial typography hierarchy across the entire landing page, reinforcing the luxury fragrance and lifestyle aesthetic of the CR7 brand.

## 2. Goals, Non-Goals, Anti-Goals
- **Goals:**
  - Standardize all section kickers/eyebrows to uppercase, wide-tracked sans-serif (`Montserrat`, `letter-spacing: 0.22em`, `font-size: 0.6875rem–0.75rem`).
  - Standardize all major section headings to uppercase, refined serif (`Playfair Display`, `clamp(1.75rem, 3.5vw, 2.5rem)`, `letter-spacing: 0.08em`, crisp `#ffffff`).
  - Standardize all section descriptions and subtitles to clean, readable sans-serif (`Montserrat`, `0.9375rem`, `line-height: 1.65`, `letter-spacing: 0.04em`, muted tone `#999999` / `rgba(255, 255, 255, 0.7)`).
  - Clean up raw text casing (e.g. removing trailing periods from showcase titles like `Unleash Your Energy. Own Your Journey.` -> uppercase clean display titles).
  - Implement reusable CSS utility tokens and targeted rules in `assets/base.css` so changes stay consistent without breaking merchant settings.
- **Non-Goals:**
  - Altering section layout structures, product grids, images, or media assets.
  - Modifying checkout or unrelated backend theme templates.
- **Anti-Goals:**
  - Overriding product pricing, badges, or buttons with inappropriate font sizing or illegible colors.
  - Causing horizontal overflow or text clipping on mobile screens (`< 750px`).

## 3. Constraints
- Must align with Shopify Theme Architecture (Horizon / Dawn derived).
- Maintain WCAG AA contrast against dark backgrounds (`#000000` / `#060606`).
- Responsive across all viewports (Mobile `< 750px`, Tablet `750px–989px`, Desktop `≥ 990px`).
- Hot-reload active in local dev (`http://127.0.0.1:9292`).

## 4. Approaches Considered
- **Option 1 (Picked): Editorial Luxury (Serif Headings + Wide-Tracked Sans Subheadings & Descriptions)**
  - *Tradeoffs:* Elevates brand perception into high-fashion luxury (Vogue / Tom Ford / CR7 signature prestige), high contrast between headings and body text. Requires syncing section title typography tokens.
  - *Why Picked:* Selected by the user to match the active Direction 2 "Editorial High-Fashion Minimalist" design theme.
- **Option 2 (Alternative): Contemporary Architectural Sans (All Sans-Serif)**
  - *Tradeoffs:* More modern sportswear feel (NikeLab/Balenciaga), but lacks the bespoke prestige of the signature CR7 fragrance brand.

## 5. Specification & Typography Tokens
- **Subheading (Eyebrow / Kicker):**
  - Font family: `var(--font-body--family)` (Montserrat)
  - Font size: `0.75rem` (12px) desktop, `0.6875rem` (11px) mobile
  - Font weight: `600` (Semi-bold)
  - Letter spacing: `0.22em`
  - Text transform: `uppercase`
  - Color: `#bbbbbb`
- **Heading (Section Title):**
  - Font family: `var(--font-heading--family)` (Playfair Display)
  - Font size: `clamp(1.75rem, 3.5vw, 2.5rem)` (with Hero display heading retaining its signature hero scale)
  - Font weight: `700` (Bold)
  - Letter spacing: `0.08em`
  - Text transform: `uppercase`
  - Line height: `1.2`
  - Color: `#ffffff`
- **Description (Body / Subtitle):**
  - Font family: `var(--font-body--family)` (Montserrat)
  - Font size: `0.9375rem` (15px)
  - Font weight: `400` (Regular)
  - Letter spacing: `0.04em`
  - Line height: `1.65`
  - Color: `rgba(255, 255, 255, 0.7)` / `#999999`
  - Max width: `540px` (centered or aligned to parent)

## 6. Implementation Scope
- `assets/base.css`: Add standardized typography classes and scoped section overrides for:
  - Hero kickers, titles, and descriptions (`hero_jVaWmY`, `hero_z4DeGb`)
  - Collection list header (`collection_list_jgmNBx`)
  - Product list header (`product_list_MhFCTe`)
  - Story showcase section (`section_rtDKDm`)
  - Split showcases (`section_Dkf3Vq`, `section_qKHGRq`)
  - Trust perks bar (`section_E9bfwM`)
- `templates/index.json`: Align text block content, presets, and casing where appropriate for clean semantic rendering.
