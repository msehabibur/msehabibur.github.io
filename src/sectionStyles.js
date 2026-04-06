// ══════════════════════════════════════════════════════════════════════════════
// SECTION STYLES — Shared metadata for consistent styling across all modules
// ══════════════════════════════════════════════════════════════════════════════

// ── Theme colors (canonical source) ──────────────────────────────────────────
export const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  eo_e: "#2563eb", eo_hole: "#ea580c", eo_photon: "#ca8a04",
  eo_valence: "#059669", eo_core: "#7c3aed", eo_gap: "#dc2626", eo_cond: "#0284c7",
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
  svgMaxWidth: 340,

  // Border radius
  radiusSm: 4,
  radiusMd: 6,
  radiusLg: 8,
  radiusXl: 10,
};

// ── Analogy box ──────────────────────────────────────────────────────────────
export const ANALOGY = {
  box: {
    background: "#fffbeb",
    border: "1.5px solid #f59e0b33",
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
    color: "#b45309",
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
  toggle: (isActive, activeColor = T.eo_e) => ({
    padding: "5px 8px",
    borderRadius: LAYOUT.radiusSm,
    border: `1px solid ${isActive ? activeColor : T.border}`,
    background: isActive ? activeColor : T.panel,
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
  container: (color = T.eo_e) => ({
    background: T.panel,
    border: `1.5px solid ${color}44`,
    borderLeft: `4px solid ${color}`,
    borderRadius: LAYOUT.radiusXl,
    padding: "16px 18px",
    marginBottom: 14,
  }),
  title: (color = T.eo_e) => ({
    fontSize: FONT.base,
    letterSpacing: 2,
    color: color,
    textTransform: "uppercase",
    fontWeight: 700,
  }),
  formula: (color = T.eo_e) => ({
    fontFamily: "'Georgia',serif",
    fontSize: FONT.lg,
    color: T.ink,
    background: color + "11",
    padding: "2px 10px",
    borderRadius: LAYOUT.radiusSm,
    border: `1px solid ${color}33`,
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
