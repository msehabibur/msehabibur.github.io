// ══════════════════════════════════════════════════════════════════════════════
// SECTION STYLES — Master style guide for ALL chapters in MaterialStudio
// ══════════════════════════════════════════════════════════════════════════════
//
// HOW TO USE THIS FILE:
//   import { T, FONT, LAYOUT, ANALOGY, BUTTON, PANEL, NCARD, SVG } from "./sectionStyles.js";
//
// Every chapter file should import from here instead of defining its own
// theme object. This keeps colors, fonts, spacing, and layout consistent.
//
// ══════════════════════════════════════════════════════════════════════════════

// ── Single accent color ──────────────────────────────────────────────────────
// All chapters use ONE accent color. No multi-color schemes.
const ACCENT = "#7c3aed"; // purple

// ══════════════════════════════════════════════════════════════════════════════
// 1. THEME COLORS
// ══════════════════════════════════════════════════════════════════════════════
//
// Neutral palette for backgrounds, text, borders:
//   bg       — page background (#f0f2f5)
//   panel    — card/box background (#ffffff)
//   surface  — subtle raised surface (#f7f8fa)
//   border   — borders and dividers (#d4d8e0)
//   ink      — primary text (#1a1e2e)
//   muted    — secondary/label text (#6b7280)
//   dim      — very faint lines/text (#c0c6d0)
//
// Accent color for ALL highlights, borders, active states, headings:
//   accent   — purple (#7c3aed)
//
// Legacy aliases (all point to ACCENT — do NOT use different colors):
//   eo_e, eo_hole, eo_photon, eo_valence, eo_core, eo_gap, eo_cond
//
export const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  accent: ACCENT,
  eo_e: ACCENT, eo_hole: ACCENT, eo_photon: ACCENT,
  eo_valence: ACCENT, eo_core: ACCENT, eo_gap: ACCENT, eo_cond: ACCENT,
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. FONT SIZES
// ══════════════════════════════════════════════════════════════════════════════
//
// Use these constants everywhere. Never use raw numbers.
//   xs   (9)  — tiny labels, footnotes, subscripts
//   sm   (11) — secondary info, button text, small labels
//   base (12) — default body text, analogy text, info rows, table cells
//   md   (13) — SVG text, descriptions, emphasis
//   lg   (14) — card titles, formula text, subheadings
//   xl   (15) — section titles
//
// Font family: always "monospace" for code/science look.
//
export const FONT = {
  xs: 9,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 15,
};

// ══════════════════════════════════════════════════════════════════════════════
// 3. LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
//
// Every section follows this structure:
//
//   <div style={LAYOUT.section}>          ← outer wrapper (column, gap 14)
//     <AnalogyBox>...</AnalogyBox>        ← simple analogy at top
//     <div style={LAYOUT.svgWrapper}>     ← SVG centered at top
//       <div>{renderSVG()}</div>          ← the figure
//       <div style={LAYOUT.contentBelow}> ← controls + info below
//         ...buttons, panels, cards...
//       </div>
//     </div>
//     <NCard>...</NCard>                  ← numerical examples
//   </div>
//
// Rules:
//   - SVG/figure is always centered at the TOP, never side-by-side
//   - Content (buttons, info panels, cards) goes BELOW the figure
//   - Use flexDirection: "column" with alignItems: "center"
//   - Never use flexWrap: "wrap" for main section layout
//   - Inner info panels can use row layout for small items
//
export const LAYOUT = {
  // Outer section container
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    fontFamily: "monospace",
    color: T.ink,
  },

  // SVG + content wrapper (figure centered at top, content below)
  svgWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  // Content area below SVG
  contentBelow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  // SVG max width (10% larger than default 340)
  svgMaxWidth: 374,

  // Border radius scale
  radiusSm: 4,   // buttons, small tags
  radiusMd: 6,   // info panels
  radiusLg: 8,   // SVG containers, cards
  radiusXl: 10,  // analogy box, NCards
};

// ══════════════════════════════════════════════════════════════════════════════
// 4. ANALOGY BOX
// ══════════════════════════════════════════════════════════════════════════════
//
// Every section starts with a simple analogy box. Rules:
//   - Use simple, everyday English (no jargon, no hard words)
//   - 2-4 sentences max
//   - Compare the science concept to something from daily life
//   - No emojis or icons
//   - Title is always "Simple Analogy"
//   - Purple-tinted background with purple title
//
// Usage:
//   function AnalogyBox({ children }) {
//     return (
//       <div style={ANALOGY.box}>
//         <div style={ANALOGY.title}>Simple Analogy</div>
//         <div style={ANALOGY.body}>{children}</div>
//       </div>
//     );
//   }
//
export const ANALOGY = {
  box: {
    background: ACCENT + "08",
    border: `1.5px solid ${ACCENT}33`,
    borderRadius: LAYOUT.radiusXl,
    padding: "10px 16px",
    marginBottom: 12,
    width: "100%",
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: FONT.base,
    fontWeight: 700,
    color: ACCENT,
    marginBottom: 4,
  },
  body: {
    fontSize: FONT.base,
    lineHeight: 1.8,
    color: T.ink,
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// 5. BUTTONS
// ══════════════════════════════════════════════════════════════════════════════
//
// Toggle buttons for switching between modes, models, materials, etc.
//   - Active: purple background, white text
//   - Inactive: white background, dark text, gray border
//   - Always use BUTTON.toggle(isActive) helper
//   - Never use different colors for different buttons
//   - Font: monospace, 11px
//
export const BUTTON = {
  base: {
    fontFamily: "monospace",
    fontSize: FONT.sm,
    cursor: "pointer",
    borderRadius: LAYOUT.radiusSm,
  },
  toggle: (isActive) => ({
    padding: "5px 8px",
    borderRadius: LAYOUT.radiusSm,
    border: `1px solid ${isActive ? ACCENT : T.border}`,
    background: isActive ? ACCENT : T.panel,
    color: isActive ? "#fff" : T.ink,
    fontFamily: "monospace",
    fontSize: FONT.sm,
    cursor: "pointer",
    lineHeight: 1.2,
  }),
};

// ══════════════════════════════════════════════════════════════════════════════
// 6. INFO PANELS
// ══════════════════════════════════════════════════════════════════════════════
//
// Small info boxes that display properties, values, details.
//   - White background, gray border, rounded corners
//   - Label in muted gray, value in dark ink
//   - Title in bold, 14px
//
export const PANEL = {
  base: {
    background: T.panel,
    border: `1px solid ${T.border}`,
    borderRadius: LAYOUT.radiusMd,
    padding: 10,
  },
  title: {
    fontSize: FONT.lg,
    fontWeight: "bold",
    marginBottom: 6,
  },
  label: {
    fontSize: FONT.base,
    color: T.muted,
    marginBottom: 4,
  },
  value: {
    fontSize: FONT.base,
    fontWeight: 600,
    color: T.ink,
  },
  smallText: {
    fontSize: FONT.sm,
    marginBottom: 4,
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// 7. NUMERICAL EXAMPLE CARDS (NCard)
// ══════════════════════════════════════════════════════════════════════════════
//
// Cards that show worked numerical examples with formulas.
//   - Purple left border (4px), light purple border around
//   - Title in purple, uppercase removed (use normal case)
//   - Formula in Georgia serif font, subtle purple background
//   - No emojis, no icons in titles
//   - Use proper subscript notation (<sub>) not underscores
//
export const NCARD = {
  container: () => ({
    background: T.panel,
    border: `1.5px solid ${ACCENT}44`,
    borderLeft: `4px solid ${ACCENT}`,
    borderRadius: LAYOUT.radiusXl,
    padding: "16px 18px",
    marginBottom: 14,
  }),
  title: () => ({
    fontSize: FONT.base,
    letterSpacing: 2,
    color: ACCENT,
    fontWeight: 700,
  }),
  formula: () => ({
    fontFamily: "'Georgia',serif",
    fontSize: FONT.lg,
    color: T.ink,
    background: ACCENT + "11",
    padding: "2px 10px",
    borderRadius: LAYOUT.radiusSm,
    border: `1px solid ${ACCENT}33`,
  }),
};

// ══════════════════════════════════════════════════════════════════════════════
// 8. SVG DEFAULTS
// ══════════════════════════════════════════════════════════════════════════════
//
// Default values for SVG visualizations:
//   - Background: T.bg (light gray)
//   - All text: monospace font
//   - All accent strokes/fills: use T.accent (purple)
//   - Never use hardcoded color hex values — always reference T.xxx
//   - SVG container: borderRadius 8, border 1px solid T.border
//
export const SVG = {
  background: T.bg,
  borderRadius: LAYOUT.radiusLg,
  textFont: "monospace",
  textSize: FONT.md,
  labelSize: FONT.base,
  smallLabel: FONT.sm,
  strokeWidth: 1.5,
  thinStroke: 1,
};

// ══════════════════════════════════════════════════════════════════════════════
// STYLE RULES CHECKLIST (for all chapters)
// ══════════════════════════════════════════════════════════════════════════════
//
// Colors:
//   [ ] Only ONE accent color (purple #7c3aed) — no blue, red, green, etc.
//   [ ] Use T.accent or T.eo_* aliases (all resolve to purple)
//   [ ] Neutral palette for backgrounds/text: T.bg, T.panel, T.surface, etc.
//   [ ] No hardcoded hex colors for accents — always use T.xxx
//
// Fonts:
//   [ ] All text uses monospace font family
//   [ ] Use FONT.xs/sm/base/md/lg/xl — no raw font sizes
//   [ ] No textTransform: "uppercase" anywhere
//   [ ] No ALL CAPS in titles or headings
//
// Layout:
//   [ ] SVG/figure centered at top of each section
//   [ ] Content (buttons, panels, cards) stacked below
//   [ ] Use LAYOUT.svgWrapper for figure container
//   [ ] Use LAYOUT.contentBelow for content under figure
//   [ ] Never use side-by-side (flex-row + flexWrap) for main layout
//
// Analogy:
//   [ ] Every section starts with AnalogyBox
//   [ ] Simple, everyday English — no hard words or jargon
//   [ ] 2-4 short sentences
//   [ ] No emojis or icons
//
// Equations:
//   [ ] Use proper subscripts: <sub>n</sub> not _n
//   [ ] Use unicode subscripts in string attributes: Eₙ not E_n
//   [ ] Use <sub>/<sup> tags in JSX content
//
// Icons:
//   [ ] No emojis anywhere
//   [ ] No icon props — use icon: "" (empty string)
//   [ ] No decorative symbols
//
// Components:
//   [ ] AnalogyBox uses ANALOGY styles from this file
//   [ ] NCard uses NCARD styles from this file
//   [ ] Buttons use BUTTON.toggle() helper
//   [ ] Info panels use PANEL styles
//
