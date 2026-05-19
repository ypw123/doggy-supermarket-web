# Design

## Theme

Pawberry Market is a light, warm storefront used by shoppers on phones during relaxed browsing moments. The scene is morning light on a kitchen table: fresh product photos, tidy labels, berry accents, and soft paper-like surfaces.

## Color

Use OKLCH values. The strategy is a full warm palette: berry for brand action, marigold for small highlights, leafy green for trust and care, and blue for washable utility notes. Neutrals are lightly tinted instead of pure black or pure white.

- Canvas: `oklch(0.985 0.012 70)`
- Ink: `oklch(0.255 0.035 42)`
- Muted ink: `oklch(0.47 0.032 48)`
- Berry: `oklch(0.62 0.18 18)`
- Berry deep: `oklch(0.42 0.13 18)`
- Marigold: `oklch(0.82 0.15 77)`
- Leaf: `oklch(0.58 0.10 145)`
- Sky wash: `oklch(0.90 0.055 218)`
- Line: `oklch(0.86 0.025 62)`

## Typography

Use `Cherry Bomb One` for short brand display moments and `Atkinson Hyperlegible` for body text, navigation, product details, and controls. Keep body lines under 70ch. Avoid negative letter spacing.

## Layout

Use an asymmetric merchandising layout with a shoppable hero, a compact product rail, and product cards that stay at 8px radius. Keep repeated cards functional, not decorative. Break rhythm with editorial product notes, category chips, and a curated bundle band.

## Components

- Header: sticky, compact, brand mark, category links, cart preview.
- Hero: product-first composition with one large lifestyle image and immediate product actions.
- Product card: image, category, short name, price, and static add-to-cart intent.
- Bundle band: horizontal editorial offer for future checkout.
- FAQ/contact: simple sections with mailto inquiry path.

## Motion

Use one staggered entrance sequence and small hover transforms. Respect `prefers-reduced-motion`.
