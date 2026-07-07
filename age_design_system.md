# Al Ghassani Enterprises (AGE): Brand Design System

This document defines the visual guidelines, typography, motion mechanics, and component specifications for Al Ghassani Enterprises. All future pages, documents, and media should inherit these parameters to preserve absolute visual trust and brand authority with CEOs, family offices, and sovereign wealth entities.

---

## 1. Core Principles
* **Trust Above Glitz:** The visual system should feel quiet, intentional, and effortless.
* **Proportion and Space:** Generous vertical whitespace communicates corporate confidence and prestige.
* **Premium Executive Contrast:** Rich midnight navy backgrounds layered with soft gold and titanium white typography.

---

## 2. Color System

| Token Name | Hex Value | Role |
| :--- | :--- | :--- |
| `navy-base` | `#0B1F3A` | Primary background canvas |
| `gold` | `#C9A227` | Accents, badges, active indicators, and borders |
| `white-primary` | `#FFFFFF` | Primary headers and high-contrast text |
| `gray-secondary` | `#D1D5DB` | Body copy and secondary descriptions |
| `gray-muted` | `#8C9BA5` | Captions, dates, and minor helper labels |
| `surface-glass` | `rgba(46, 49, 56, 0.45)` | Backdrop-filtered container surfaces |

---

## 3. Typographic Hierarchy & Letter-Spacing
We use a premium pairing of **Cormorant Garamond** (Editorial Serif) and **Inter** (Structured Sans-Serif).

* **Header 1 (Massive Cinematic Titles):**
  * Font: `Cormorant Garamond`
  * Weight: `300` (Light & Classic)
  * Letter-Spacing: `-0.03em`
  * Line-Height: `0.95`
* **Standard Headers (h2, h3):**
  * Font: `Cormorant Garamond`
  * Weight: `600`
  * Letter-Spacing: `-0.025em`
  * Line-Height: `1.1`
* **Subtitles & Badges:**
  * Font: `Cormorant Garamond` or `Inter`
  * Letter-Spacing: `0.14em`
  * Case: `UPPERCASE`
  * Font-Size: `0.82rem`
* **Body Copy (p):**
  * Font: `Inter`
  * Weight: `400`
  * Line-Height: `1.75` (Spacious and easy to scan)

---

## 4. Spacing System
Luxury interfaces use whitespace as a premium design asset.
* **Vertical Section Padding:** **`12rem 0`** (192px) on desktop to let sections sit independently and breathe.
* **Grid Gaps:** Standardized at `1.5rem` for cards and `4rem` for major section divisions.

---

## 5. Motion & Transitions
Transitions must feel weighted, smooth, and unified:
* **Base Transition Variable:**
  ```css
  --transition-normal: 280ms cubic-bezier(0.25, 0.8, 0.25, 1);
  ```
* **Reveal-on-Scroll Trigger:**
  * Initial State: `opacity: 0; transform: translateY(40px) scale(0.98);`
  * End State: `opacity: 1; transform: translateY(0) scale(1);`
  * Duration: `1.2s` with custom ease-out.

---

## 6. Components

### A. Executive Dashboard Cards (`.metric-grid-card`)
* Background: `rgba(11, 31, 58, 0.45)` with `backdrop-filter: blur(12px)`.
* Border: `1px solid rgba(255, 255, 255, 0.03)`.
* Hover: Translate up `6px`, transition border to gold glow.

### B. Gold Buttons (`.btn-primary`)
* Background: Solid gold to yellow-gold gradient.
* Hover: Soft gold outer drop shadow, scale transition.

### C. Client Workspace Tables & Charts
* Minimalist presentation, quiet SVG area lines, avoiding colorful SaaS graphs.
