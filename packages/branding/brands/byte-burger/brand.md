# ByteBurger — Brand Specification

## Identity

**Full Name:** ByteBurger
**Type:** Retro Arcade Fast-Food Restaurant & Online Ordering Platform
**Parent:** Realms & Beyond
**Audience:** Food ordering customers, arcade & gaming culture enthusiasts
**Fictional founding year:** 2087

---

## Logo

| Asset | File | Usage |
|-------|------|-------|
| Icon / Favicon | `logo-icon.svg` | App icons, favicons, button icons |
| Full Wordmark | `logo-full.svg` | App header, menus, marketing |
| Social Banner | `banner.svg` | Open Graph, social media, launch banners |

**Logo motif:** A pixel-art stacked burger — rendered in blocky rectangular layers representing each burger component (bun, lettuce, cheese, patty). Deliberately avoids curves to reinforce the pixel aesthetic. "BYTEBURGER" is set in Share Tech Mono (monospace) to echo the terminal/arcade feel.

---

## Colour Palette

### Primary

| Role | Name | Hex | Use |
|------|------|-----|-----|
| Background | Near Black | `#0E0B08` | Page backgrounds, card surfaces |
| Primary | Hot Orange | `#D46010` | Top bun, primary CTA, logo text, borders |
| Accent | Mustard Gold | `#D4A818` | Cheese layer, "BURGER" wordmark, highlights |
| Bun Shadow | Burnt Orange | `#c05a0a` | Bottom bun, shadow/depth on primary |
| Text | Warm Cream | `#F5E8C0` | Body text, HUD readouts |
| Lettuce | Forest Green | `#4a7a28` | Lettuce layer only |
| Patty | Dark Brown | `#4a2010` | Patty layer |

### Scanline / Overlay
ByteBurger uses an orange-tinted scanline overlay — not the neutral grey used across the rest of R&B.

| Use | Colour | Opacity |
|-----|--------|---------|
| Scanline row | `#D46010` | 0.025–0.04 |
| Ambient glow | `#D46010` | 0.10–0.14 |

---

## Typography

| Tier | Font | Use |
|------|------|-----|
| **Logo / Display** | Share Tech Mono | "BYTEBURGER", "BYTE", "BURGER" — primary brand text |
| HUD / UI | Barlow Condensed | "EST. 2087", "LEVEL UP YOUR LUNCH", menu labels |
| Terminal / Sys | Share Tech Mono | "BYTEBURGER OS v2.087", boot screen copy, score readouts |

**Do not use Cinzel** — ByteBurger has its own typographic identity separated from the R&B fantasy aesthetic.

---

## Voice & Tone

- **Tone:** Playful, punchy, nostalgic — like a retro arcade cabinet that serves burgers
- **References:** 80s/90s gaming culture, DOS terminals, arcade score boards, side-scrolling fighters
- **Not:** Corporate, overly formal, or fine-dining
- **Style:** Short, punchy commands and exclamations. Favour game terminology. All-caps for emphasis.

---

## Slogans & Taglines

| Type | Copy |
|------|------|
| **Primary tagline** | **"Level Up Your Lunch"** |
| CTA / insert coin | **"INSERT COIN TO EAT"** |
| Brand identity | "Retro Flavor. Real Hunger." |
| Nostalgia line | "Powered by Nostalgia" |
| Gamer angle | "Feed the Quest" |
| Year identifier | "EST. 2087" |
| OS boot line | "BYTEBURGER OS v2.087  INITIALIZING..." |
| Score line | "HI-SCORE: 999999" |
| Menu section prefix | "LEVEL 01 — BURGERS" / "LEVEL 02 — SIDES" etc. |

---

## Usage Rules

- **Always render "BYTEBURGER" as one word** — no space, no hyphen
- The pixel burger icon must be made of pure rectangles — no rounded corners, no curves
- Never use Cinzel or EB Garamond in ByteBurger UI; this is a deliberate brand separation
- Scanlines must have an orange tint (not neutral grey) in ByteBurger-themed interfaces
- The "BYTE" portion of the wordmark is always hot orange `#D46010`
- The "BURGER" portion is always mustard gold `#D4A818`
- Border radius across all ByteBurger UI: `0px` — hard pixel edges only

---

## HUD / Arcade UI Elements

ByteBurger UIs incorporate arcade HUD patterns:
- Score display: `HI-SCORE: XXXXXX` in top bar
- Lives counter: `LIVES: ♥ ♥ ♥` in top bar
- Section prefix: `LEVEL XX —` before each section title
- Boot screen: Terminal-style OS initialisation sequence on first load
