# DESIGN.md — The Roots

> The visual system. Source of truth lives in code at `src/theme/colors.ts` and
> `src/theme/theme.ts`; this file explains intent. Direction: **Style 3 暖陽軟石
> Warm Clay** — a warm, tactile, softly-embossed clay world.

---

## Direction in one line

Warm sand surfaces, honey/sun accents, and soft neumorphic "embossed" forms that
feel calm, gentle, and hand-shaped — never clinical or corporate.

## Color

Warm and clay-like. Every neutral is tinted warm; never pure `#fff` / `#000`.
Strategy: **restrained** overall (sand + tinted neutrals), with honey as the one
committed accent that carries hero moments.

| Role | Token | Hex | Use |
|---|---|---|---|
| Sand (base) | `background.primary` | `#EFE9DC` | App background, the clay material |
| Highlight | `neutral.white` | `#FFFDF6` | Warm white, raised faces, never pure white |
| Card surface | `background.secondary` | `#F5EFE2` | Lifted cards on sand |
| Honey (primary) | `primary.indigo` | `#E3A82E` | Main action, active state, hero card |
| Sun (brand) | `primary.lavender` | `#F6862E` | Brand, greeting, illustration accent |
| Leaf (growth) | `semantic.success` | `#5C8B45` / `#7FA653` | Progress, completion, journey stages |
| Lavender (admin) | `categories.admin` | `#B7A8E0` | Documents / admin category |
| Peach (gentle) | `categories.culture` | `#E8AFA4` | Health, soft reminders |
| Ink (text) | `text.primary` | `#211D16` | Primary text |
| Ink-2 | `text.secondary` | `#6B6457` | Secondary text |

Note on warm surfaces: text on the honey hero uses a **soft warm brown**
(`#6E5226`), not near-black ink, to stay gentle.

## Typography

- **Display / headings:** Plus Jakarta Sans (700 Bold) — friendly geometric.
- **Body / labels:** Noto Sans — universal, survives 1000+ languages.
- Hierarchy through scale + weight, not color. Scale in `theme.typography.fontSize`.
- **i18n gap (tracked):** only Noto Sans (Latin) is currently loaded. CJK / Arabic
  need Noto Sans TC / Arabic added before those languages render correctly.

## Elevation — neumorphism (the signature)

Surfaces are lifted by **dual-tone soft shadow**, not borders or hard drop shadows:
- light highlight top-left (晨光 `#FFFDF6`)
- warm shadow bottom-right (沙影 `#B9A887`)

Tokens in `theme.shadows` (`sm` resting · `md` raised · `lg` lifted) as
`boxShadow` strings (works on RN 0.81+ and web). Surfaces must sit on sand to read.

## Shape

Soft, clay-like radii (`theme.borderRadius`): cards ~22px, hero ~28px, buttons
full pill, icon containers circular ("pebbles").

## Components

- **Cards:** sand-tinted surface, soft radius, neumorphic `shadows.sm`. No
  side-stripe accent borders (banned — they read as clutter and AI-slop).
- **Icon "pebbles":** circular tinted container holding a single line icon; the
  pebble's color carries category/urgency meaning.
- **Buttons:** full-pill. Primary = honey (gradient `#F4C863 → #E3A82E` is the
  target gloss; flat honey is the current state). Secondary = raised sand pill.
- **Tab bar:** soft, icons vertically centered, active tint = honey.

## Banned

Side-stripe borders, gradient text, decorative glassmorphism, identical card
grids, hero-metric templates, em dashes in UI copy, decorative emoji in chrome
(use drawn vector marks instead).
