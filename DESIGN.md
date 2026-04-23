# Design System Document: High-End Editorial Wellness

## 1. Overview & Creative North Star

### Creative North Star: "The Living Laboratory"
This design system rejects the clinical coldness of traditional medical tech in favor of an **Editorial Scientific** aesthetic. It is inspired by the precision of laboratory research and the fluidity of biological systems. We aim to create a "Living Laboratory"—an immersive digital environment that feels premium, authoritative, and deeply personal.

By leveraging intentional asymmetry, generous white space (inspired by high-end print journals), and layered translucency, we move away from "app-like" grids toward a sophisticated narrative experience. The goal is to make AI-driven wellness feel like a warm, guided journey rather than a data-crunching utility.

---

## 2. Colors

The palette is anchored by deep, sophisticated teals and lifted by a vibrant, "DNA-inspired" spectrum.

### Tonal Strategy
- **Primary Solids:** Use `primary` (#002627) and `primary_container` (#0F3D3E) for high-authority elements. 
- **Neutral Foundation:** The primary background is `surface` (#FAF9F6), a warm off-white that prevents the "digital fatigue" of pure white.
- **Vibrancy:** Use the "Signature DNA Gradient" (Teal → Blue → Purple → Pink → Orange) sparingly for high-impact moments like Hero headlines or progress indicators.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions. To separate content, transition from `surface` to `surface_container_low` or `surface_variant`. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the Material `surface_container` tiers to create depth:
1.  **Base Layer:** `surface` (#FAF9F6)
2.  **Section Layer:** `surface_container_low` (#F4F3F0)
3.  **Elevated Card:** `surface_container_lowest` (#FFFFFF)

### The "Glass & Gradient" Rule
To achieve a premium feel, use **Glassmorphism** for floating UI (e.g., navigation bars or tooltips). Apply a `backdrop-blur` of 12px-20px to a semi-transparent `surface` color. Use subtle linear gradients (e.g., `primary` to `secondary`) for CTA buttons to add "soul" and depth that flat hex codes cannot replicate.

---

## 3. Typography

Our typography is the voice of the brand: Precise, Elegant, and Authoritative.

- **Display & Headlines (Inter):** Set with tight leading and generous letter spacing (tracking: -0.02em for large sizes). These are the "editorial" anchors of the page.
- **Body (Inter):** Optimized for readability. Use `body-lg` for narrative copy and `body-md` for technical details.
- **Labels (Plus Jakarta Sans):** Used for metadata, scientific tags, and micro-copy. This secondary typeface adds a subtle "technical" contrast to the editorial Inter.

**Hierarchy as Identity:** Use extreme scale contrast. A `display-lg` headline paired with a `label-md` category tag creates a sophisticated, high-end magazine layout.

---

## 4. Elevation & Depth

We avoid the "drop shadow" look of the early 2010s in favor of **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle 2-3% difference in lightness creates a natural lift.
- **Ambient Shadows:** When a float is required (e.g., a primary action button or a modal), use a highly diffused shadow: `y: 20px, blur: 40px, color: rgba(15, 61, 62, 0.06)`. The tint should match our `primary_container` to mimic natural light passing through a teal-toned environment.
- **The "Ghost Border" Fallback:** For input fields or essential containment, use `outline_variant` at **15% opacity**. This creates a suggestion of a container without breaking the editorial flow.

---

## 5. Components

### Buttons
- **Primary:** A "Signature Gradient" fill (Teal to Pink) or a solid `secondary` (#146871). 
- **Style:** `rounded-full` (pill-shaped) to echo the DNA helix forms. High-contrast white text (`on_primary`).
- **Tertiary:** Text-only with a "Ghost Border" bottom underline that appears only on hover.

### Cards (The "Editorial Container")
- **Style:** `rounded-xl` (1.5rem). Never use dividers. 
- **Layout:** Use `surface_container_highest` for "Bento-style" layouts. Content should be separated by whitespace (minimum 32px) rather than lines.

### Chips & Tags
- **Style:** `rounded-md` (0.75rem). 
- **Color:** Use `secondary_container` with `on_secondary_container` text. These should feel like small "specimen labels" in a lab.

### Input Fields
- **Style:** `surface_container_low` background with no border. On focus, a subtle `secondary` outer glow (4px blur, 10% opacity) and the label shifts to `secondary`.

### Biological Progress Tracers
A custom component for AI-driven wellness. Use a thin, 2px blurred line using the "Accent Gradient" (Pink → Orange) to show health trends or data paths, mimicking the curves of the DNA logo.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetric layouts. Place an image off-center with text overlapping the margin.
- **Do** use `backdrop-blur` for all navigation and modal overlays.
- **Do** lean into the "Soft Teal" and "Off-White" as your primary canvas.
- **Do** use large, high-resolution photography of nature and microscopy, treated with a subtle `surface_tint`.

### Don't
- **Don't** use 100% black text. Always use `on_background` (#1B1C1A) for a softer, premium feel.
- **Don't** use dark green as a dominant background; it should only exist as a deep teal accent (`primary_container`).
- **Don't** use sharp corners. Everything must adhere to the **Roundedness Scale** (default `0.5rem` to `1.5rem`).
- **Don't** use "default" system shadows. They feel cheap; always use our ambient, tinted shadow spec.