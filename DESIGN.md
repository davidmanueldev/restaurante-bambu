---
name: "The Grill Bambú"
description: "A premium, modern restaurant design system with a natural 'Bambú' aesthetic, characterized by deep greens, vibrant accents, and organic rounded shapes."
tokens:
  colors:
    primary:
      50: "#f2fbf5"
      100: "#e1f7e9"
      200: "#c4ebd4"
      300: "#96d8b3"
      400: "#60be8b"
      500: "#3ca26d"
      600: "#298254"
      700: "#246845"
      800: "#1f5339"
      900: "#1b4430"
      950: "#0e261b"
    accent:
      fire: "#ea580c" # orange-600
      leaf: "#059669" # emerald-600
    background: "#ffffff"
    foreground: "#171717"
    surface: "#ffffff"
    overlay: "rgba(0, 0, 0, 0.8)"
  typography:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    weights:
      light: 300
      regular: 400
      medium: 500
      semibold: 600
      bold: 700
      black: 900
    tracking:
      tight: "-0.025em"
      tighter: "-0.05em"
  spacing:
    container: "max-w-7xl"
    section-padding: "py-24"
  shapes:
    radius-sm: "0.5rem" # 8px
    radius-md: "0.75rem" # 12px
    radius-lg: "1rem" # 16px
    radius-xl: "1.5rem" # 24px
    radius-2xl: "2rem" # 32px
    radius-full: "9999px"
  effects:
    blur: "backdrop-blur-md"
    shadow: "shadow-2xl"
    transition: "transition-all duration-300"
    hover-scale: "hover:scale-105"
---

# Design System: The Grill Bambú

## 1. Design Philosophy
The visual identity of **The Grill Bambú** is built on the intersection of **nature and fire**. It conveys a premium, artisan feel that is both organic and digitally modern.
- **Organic Precision:** Large border-radii (up to 32px) create a soft, welcoming feel, balanced by sharp, high-contrast typography.
- **Atmospheric Contrast:** Use of deep `bambu-950` backgrounds with white/bambu-300 text for "hero" or "dark mode" sections to evoke a high-end grill atmosphere.
- **Glassmorphism:** Use of semi-transparent overlays and backdrop blurs to add depth and a modern "app-like" feel.
- **Vibrant Interaction:** Components should feel "alive" with hover scales, soft shadows, and subtle transitions.

## 2. Colors
### The Bambú Palette
The core of the system is a custom green scale representing freshness and the restaurant's namesake.
- **Bambú 600 (#298254):** The primary brand color for CTAs and highlights.
- **Bambú 950 (#0E261B):** The foundational dark color for footers, hero overlays, and deep surfaces.
- **Bambú 50 (#F2FBF5):** Subtle background tints for secondary sections.

### Accent Roles
- **Fire/Flame:** Warm oranges and reds (`orange-600`) used sparingly to emphasize grill-related content.
- **Freshness:** Emerald greens (`emerald-600`) for health, quality, or "lealty" indicators.

## 3. Typography
- **Font:** **Outfit** is the signature font. It provides a clean, geometric sans-serif look that feels modern yet friendly.
- **Headings:** Use `font-black` (900) or `font-bold` (700) with `tracking-tighter`.
- **Body:** Use `font-light` or `font-normal` for large blocks of text to maintain readability and a "premium" airy feel.
- **Accents:** Uppercase with `tracking-wider` and `font-semibold` for badges or small labels.

## 4. Components

### Buttons
- **Primary:** `bg-bambu-600`, `text-white`, `rounded-full`, `px-8`, `py-4`, `font-bold`.
  - *Hover:* `bg-bambu-500`, `scale-105`, `shadow-[0_0_35px_rgba(34,197,94,0.45)]`.
- **Glass/Ghost:** `bg-white/10`, `backdrop-blur-md`, `border-white/30`, `rounded-full`.

### Cards
- **Feature Cards:** `rounded-[2rem]` (32px), `p-10`, white background, `border-bambu-100`.
  - *Interaction:* `hover:shadow-xl`, `hover:-translate-y-2`.
- **Sidebar Nav:** `rounded-2xl`, `font-semibold`. Active state uses `bg-bambu-50` and a `ring-2` border.

### Sections
- **Hero:** Full-height, background image with a dark gradient overlay (`from-black/80 via-black/60 to-bambu-950/90`).
- **Standard Section:** `py-24` with `max-w-7xl` centered container.

## 5. Visual Motifs
- **Gradients:** Use linear gradients for text (e.g., `from-bambu-300 to-bambu-500`) and background accents to add vibrancy.
- **Icons:** Use **Lucide React** for UI icons. Social icons should be custom SVGs within circular, colored backgrounds.
- **Imagery:** High-quality photography with rounded corners and optional logo overlays in the corners.

## 6. Do's and Don'ts
- **Do:** Use `rounded-full` for all buttons.
- **Do:** Use backdrop blurs for elements overlaying images.
- **Do:** Prioritize white space to keep the layout feeling premium and uncrowded.
- **Don't:** Use sharp corners (0px radius) for main UI elements.
- **Don't:** Use heavy, dark shadows; prefer soft, colored glows for primary actions.
