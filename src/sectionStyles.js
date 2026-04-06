// ══════════════════════════════════════════════════════════════════════════════
// SECTION STYLES — Shared metadata for consistent styling across all modules
// ══════════════════════════════════════════════════════════════════════════════

// ── Single accent color ──────────────────────────────────────────────────────
const ACCENT = "#7c3aed"; // purple — used everywhere for borders, highlights, active states

// ── Theme colors (canonical source) ──────────────────────────────────────────
export const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  accent: ACCENT,
  // Keep semantic aliases all pointing to the same purple
  eo_e: ACCENT, eo_hole: ACCENT, eo_photon: ACCENT,
  eo_valence: ACCENT, eo_core: ACCENT, eo_gap: ACCENT, eo_cond: ACCENT,
};

// ── Font sizes ───────────────────────────────────────────────────────────────
export const FONT = {
  xs: 9,       // tiny labels, subscripts
  sm: 11,      // secondary info, button text, small labels
  base: 12,    // default body text, analogy text, info rows
  md: 13,      // SVG text, descriptions, emphasis text
  lg: 14,      // card titles, formula text
  xl: 15,      // section titles
};

// ── Layout constants ─────────────────────────────────────────────────────────
export const LAYOUT = {
  // Section container — every section wraps in this
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    fontFamily: "monospace",
    color: T.ink,
  },

  // SVG container — centered at top
  svgWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },

  // Content area below SVG — full width
  contentBelow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  // SVG max width
  svgMaxWidth: 374,

  // Border radius
  radiusSm: 4,
  radiusMd: 6,
  radiusLg: 8,
  radiusXl: 10,
};

// ── Analogy box ──────────────────────────────────────────────────────────────
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

// ── Buttons ──────────────────────────────────────────────────────────────────
export const BUTTON = {
  base: {
    fontFamily: "monospace",
    fontSize: FONT.sm,
    cursor: "pointer",
    borderRadius: LAYOUT.radiusSm,
  },
  // Helper to get active/inactive button style
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

// ── Info panel ───────────────────────────────────────────────────────────────
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

// ── NCard (numerical example cards) ──────────────────────────────────────────
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

// ── SVG defaults ─────────────────────────────────────────────────────────────
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
