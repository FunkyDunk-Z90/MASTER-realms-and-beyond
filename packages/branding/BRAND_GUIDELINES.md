# Realms & Beyond — Master Brand Guidelines

## Overview

Realms & Beyond is a private holding company operating multiple distinct product brands under one unified technology ecosystem. Each product has its own identity and voice while sharing common roots in the R&B design language: retro-arcade warmth, pixel-sharp precision, and editorial craft.

---

## The Brand Family

| Brand | Type | Theme | Primary Colour |
|-------|------|-------|----------------|
| [Realms & Beyond](./brands/realms-and-beyond/brand.md) | Holding Company | Portal / Gateway | Amber `#a87a3a` |
| [Aetherscribe](./brands/aetherscribe/brand.md) | TTRPG Platform | Mystical / Literary | Sage `#8c9657` |
| [ByteBurger](./brands/byte-burger/brand.md) | Food Ordering | Retro Arcade | Hot Orange `#D46010` |
| [Nexus Serve](./brands/nexus-serve/brand.md) | POS / Operations | Professional / Tech | Teal Blue `#2a7abf` |

---

## Shared Design Language

### What all R&B brands share

- **Pixel-sharp geometry** — border radii of 0–4px; no large rounded corners
- **Retro-warm palette roots** — even technical brands start from warm, muted bases
- **Cinzel for display type** — the connecting thread across all brands (except ByteBurger)
- **Barlow Condensed for UI labels** — compact, arcade-HUD feel
- **Share Tech Mono for data** — technical readouts, IDs, terminal text
- **Scanline texture** — subtle CRT-scanline overlays at ≤0.04 opacity
- **Glow over shadow** — brand moments use colour glow (amber, sage, teal) not hard drop shadows
- **Transition speed** — base 0.18s, slow 0.35s

### What each brand owns separately

| Element | R&B | Aetherscribe | ByteBurger | Nexus Serve |
|---------|-----|--------------|------------|-------------|
| Background | `#262425` warm dark | `#262425` warm dark | `#0E0B08` near-black | `#0f1a24` deep navy |
| Primary colour | Sage `#8c9657` | Sage `#8c9657` | Hot Orange `#D46010` | Teal Blue `#2a7abf` |
| Accent | Amber `#a87a3a` | Amber `#a87a3a` | Mustard `#D4A818` | Mint `#4abfab` |
| Display font | Cinzel | Cinzel | **Share Tech Mono** | Cinzel |
| Motif | Gateway arch | Quill + rune ring | Pixel burger | Hex network |
| Tone | Visionary | Mystical | Playful arcade | Professional |

---

## Logo Asset Locations

```
packages/branding/brands/
├── realms-and-beyond/
│   ├── logo-icon.svg      — 64×64 gateway arch icon
│   ├── logo-full.svg      — 400×90 full wordmark
│   ├── banner.svg         — 1200×630 social banner
│   └── brand.md           — full brand specification
├── aetherscribe/
│   ├── logo-icon.svg      — 64×64 quill + arcane ring
│   ├── logo-full.svg      — 420×90 full wordmark
│   ├── banner.svg         — 1200×630 social banner
│   └── brand.md
├── byte-burger/
│   ├── logo-icon.svg      — 64×64 pixel burger stack
│   ├── logo-full.svg      — 400×90 full wordmark
│   ├── banner.svg         — 1200×630 social banner
│   └── brand.md
└── nexus-serve/
    ├── logo-icon.svg      — 64×64 hexagonal network node
    ├── logo-full.svg      — 400×90 full wordmark
    ├── banner.svg         — 1200×630 social banner
    └── brand.md
```

---

## Favicon Implementation (Next.js)

Place the `logo-icon.svg` content in `app/icon.svg` for each Next.js app, or reference it as `app/favicon.ico` after converting. Next.js 13+ supports `app/icon.svg` natively for `<link rel="icon">` injection.

---

## Colour Quick Reference

### Realms & Beyond
```
Background:  #262425   Sage primary: #8c9657   Amber accent: #a87a3a   Text: #f0e5d9
```

### Aetherscribe
```
Background:  #262425   Sage primary: #8c9657   Amber accent: #a87a3a   Amethyst: #7b4fa8
```

### ByteBurger
```
Background:  #0E0B08   Orange:       #D46010   Mustard:      #D4A818   Cream: #F5E8C0
```

### Nexus Serve
```
Background:  #0f1a24   Teal blue:    #2a7abf   Mint teal:    #4abfab   Ice: #e4f0f8
```

---

## Typography Quick Reference

```
Cinzel            — display, headings, logo wordmarks (all brands except ByteBurger)
Barlow Condensed  — UI labels, tags, sub-taglines, HUD copy
EB Garamond       — long-form body text (R&B, Aetherscribe)
Share Tech Mono   — logo (ByteBurger), code, IDs, data readouts, terminal text
```

---

## Slogan Quick Reference

| Brand | Primary Tagline |
|-------|-----------------|
| Realms & Beyond | "Where Ideas Become Worlds" |
| Aetherscribe | "Inscribe Infinity" |
| ByteBurger | "Level Up Your Lunch" |
| Nexus Serve | "Command Center for Every Service" |
