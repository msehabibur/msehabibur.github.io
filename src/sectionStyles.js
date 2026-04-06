// ══════════════════════════════════════════════════════════════════════════════
// SECTION STYLES — Master style guide for ALL chapters in MaterialStudio
// ══════════════════════════════════════════════════════════════════════════════
//
// This file is the single source of truth for styling across every chapter.
// Chapter 1 (Atoms World / atoms_world.jsx) was built using these rules.
// All future chapters MUST follow the same patterns.
//
// HOW TO USE:
//   import { T, FONT, LAYOUT, ANALOGY, BUTTON, PANEL, NCARD, SVG } from "./sectionStyles.js";
//
// ══════════════════════════════════════════════════════════════════════════════


// ┌─────────────────────────────────────────────────────────────────────────────
// │ WHAT WE BUILT IN CHAPTER 1 — Reference for all future chapters
// └─────────────────────────────────────────────────────────────────────────────
//
// Chapter 1 has 21 modules grouped into 6 blocks. Each module is one
// React function that renders an interactive visualization + explanation.
//
// CONTENT PATTERN (every module follows this):
// ──────────────────────────────────────────────
//   1. AnalogyBox        — 2-3 sentences, plain English, no jargon
//   2. Interactive SVG    — centered at top, animated with useEffect + setInterval
//   3. Toggle buttons     — switch between modes/models/materials
//   4. Info panel(s)      — show current state, properties, labels
//   5. NCard(s)           — worked numerical examples with step-by-step math
//   6. Interpretation box — short "what this means" summary
//
// EXAMPLE SECTION STRUCTURE (from AtomicModelsSection):
// ─────────────────────────────────────────────────────
//   function AtomicModelsSection() {
//     const [model, setModel] = useState(0);
//     const [frame, setFrame] = useState(0);
//     useEffect(() => {
//       const id = setInterval(() => setFrame(f => f + 1), 50);
//       return () => clearInterval(id);
//     }, []);
//
//     return (
//       <div style={LAYOUT.section}>
//         <AnalogyBox>
//           2-3 simple sentences comparing concept to everyday life.
//         </AnalogyBox>
//
//         <div style={LAYOUT.svgWrapper}>
//           <div style={{ flexShrink: 0 }}>
//             <svg viewBox="0 0 340 340"
//               style={{ background: T.surface, borderRadius: 8,
//                        border: `1px solid ${T.border}`,
//                        width: "100%", maxWidth: LAYOUT.svgMaxWidth }}>
//               {/* animated visualization */}
//             </svg>
//           </div>
//
//           <div style={LAYOUT.contentBelow}>
//             {/* toggle buttons */}
//             <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
//               {items.map((item, i) => (
//                 <button key={i} onClick={() => setModel(i)}
//                   style={BUTTON.toggle(model === i)}>
//                   {item.name}
//                 </button>
//               ))}
//             </div>
//
//             {/* info panel */}
//             <div style={PANEL.base}>
//               <div style={PANEL.title}>{item.name}</div>
//               <div style={PANEL.smallText}>Key fact here</div>
//             </div>
//           </div>
//         </div>
//
//         {/* numerical example */}
//         <NCard title="Example: ..." formula="E = mc²">
//           <InfoRow label="Given" value="..." />
//           <CalcRow eq="E = ..." result="value" />
//           <div style={{ ... }}>Interpretation: what this means</div>
//         </NCard>
//       </div>
//     );
//   }
//
//
// ┌─────────────────────────────────────────────────────────────────────────────
// │ DECISIONS MADE IN CHAPTER 1 — Do the same in all chapters
// └─────────────────────────────────────────────────────────────────────────────
//
// COLORS:
//   - ONE accent color only: purple #7c3aed
//   - No multi-color schemes. No blue for electrons, red for gaps, etc.
//   - All T.eo_* aliases resolve to the same purple
//   - Neutrals: bg (#f0f2f5), panel (#fff), surface (#f7f8fa),
//               border (#d4d8e0), ink (#1a1e2e), muted (#6b7280), dim (#c0c6d0)
//
// FONTS:
//   - All text: monospace font family
//   - Font sizes: xs(9), sm(11), base(12), md(13), lg(14), xl(15)
//   - No raw font size numbers — always use FONT.xx
//   - No textTransform: "uppercase" anywhere
//   - No ALL CAPS in titles or headings — use normal case
//
// LAYOUT:
//   - SVG/figure always CENTERED at TOP of each section
//   - Content (buttons, panels, cards) stacked BELOW the figure
//   - Main wrapper: display flex, flexDirection column, alignItems center
//   - Never use side-by-side (flex-row + flexWrap) for main layout
//   - SVG maxWidth: 374 (or smaller for small diagrams, e.g. 320)
//   - Wrap large SVGs in: <div style={{ display: "flex", justifyContent: "center" }}>
//
// ANALOGY BOX:
//   - Every section starts with one AnalogyBox
//   - 2-3 sentences maximum
//   - Simple everyday English — no jargon, no hard words
//   - Compare science to: stairs, balls, cups, tiles, water, blurry photos, etc.
//   - No emojis, no icons
//   - Purple tinted background (ACCENT + "08"), purple title
//
// EQUATIONS:
//   - Use proper subscripts in JSX text: E<sub>n</sub> not E_n
//   - Use unicode subscripts in string attributes: Eₙ not E_n
//   - Use <sub> and <sup> tags, never underscore notation
//
// ICONS:
//   - No emojis anywhere in the UI
//   - Topic definitions use icon: "" (empty string)
//   - No decorative symbols (checkmarks, warning signs, etc.)
//
// SVG FIGURES:
//   - Background: T.surface or T.bg
//   - Border: 1px solid T.border, borderRadius 8
//   - All strokes/fills: use T.accent (purple) — never hardcoded hex
//   - Text inside SVG: fontFamily="monospace", fill={T.ink} or fill={T.muted}
//   - Axis labels: use proper rotation for Y-axis, centered X-axis label
//   - Keep SVG viewBox reasonable (280-400 wide, 160-340 tall)
//   - Legends and labels must fit inside the viewBox — check edges
//   - Animate with: useEffect + setInterval(50ms) + frame state
//
// NUMERICAL EXAMPLES (NCard):
//   - Purple left border (4px), light purple outline
//   - Title: normal case, no uppercase
//   - Formula: Georgia serif font, subtle purple tinted background
//   - Structure: Think of it → Step 1 → Step 2 → CalcRows → Interpretation
//   - Use InfoRow for given values, CalcRow for calculations
//   - ResultBox for final highlighted answers
//
// BUTTONS:
//   - Active state: purple background (#7c3aed), white text
//   - Inactive state: white background, dark text, gray border
//   - Use BUTTON.toggle(isActive) helper — never inline different colors
//   - Font: monospace, 11px, padding 5px 8px
//
// INFO PANELS:
//   - White background, 1px gray border, borderRadius 6
//   - Label: muted gray (FONT.base), Value: dark ink bold
//   - Padding: 10px
//
// HELPER COMPONENTS (defined in each chapter file):
//   - AnalogyBox({ children })  — uses ANALOGY.box / .title / .body
//   - NCard({ title, color, formula, children })
//   - InfoRow({ label, value })
//   - CalcRow({ eq, result, color })
//   - ResultBox({ label, value, color, sub })
//   - SectionTitle({ color, children })
//   - Tag({ color, children })
//
// TOPIC DEFINITIONS (at bottom of chapter file):
//   const SECTIONS = [
//     { id: "uniqueId", block: "blockName", label: "Display Name",
//       icon: "", color: T.accent, Component: SectionComponent },
//     ...
//   ];
//
// FILE NAMING:
//   - Chapter file name matches the chapter title in lowercase with underscores
//   - Chapter 1: "Atoms World" → atoms_world.jsx
//   - Chapter 2: "Materials Synthesis" → materials_synthesis.jsx
//   - etc.
//
// PHASE DIAGRAMS:
//   - Use real material systems (Cu-Ni, Pb-Sn, Fe-C), not fictional ones
//   - If a material doesn't have a known binary phase diagram, pick a
//     well-known system that demonstrates the same concept
//   - Cu-Ni for isomorphous (complete solid solution)
//   - Pb-Sn for eutectic
//   - Fe-C for peritectic / eutectoid
//
// ══════════════════════════════════════════════════════════════════════════════


// ── Single accent color ──────────────────────────────────────────────────────
const ACCENT = "#7c3aed"; // purple

// ══════════════════════════════════════════════════════════════════════════════
// 1. THEME COLORS
// ══════════════════════════════════════════════════════════════════════════════
export const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  accent: ACCENT,
  // Legacy aliases — all resolve to ACCENT (purple)
  eo_e: ACCENT, eo_hole: ACCENT, eo_photon: ACCENT,
  eo_valence: ACCENT, eo_core: ACCENT, eo_gap: ACCENT, eo_cond: ACCENT,
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. FONT SIZES
// ══════════════════════════════════════════════════════════════════════════════
export const FONT = {
  xs: 9,       // tiny labels, footnotes, subscripts
  sm: 11,      // button text, small labels, secondary info
  base: 12,    // body text, analogy text, info rows, table cells
  md: 13,      // SVG text, descriptions, emphasis
  lg: 14,      // card titles, formula text, subheadings
  xl: 15,      // section titles
};

// ══════════════════════════════════════════════════════════════════════════════
// 3. LAYOUT
// ══════════════════════════════════════════════════════════════════════════════
export const LAYOUT = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    fontFamily: "monospace",
    color: T.ink,
  },
  svgWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  contentBelow: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  svgMaxWidth: 374,
  radiusSm: 4,
  radiusMd: 6,
  radiusLg: 8,
  radiusXl: 10,
};

// ══════════════════════════════════════════════════════════════════════════════
// 4. ANALOGY BOX
// ══════════════════════════════════════════════════════════════════════════════
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
// QUICK-START CHECKLIST — copy this into each new chapter file as a reminder
// ══════════════════════════════════════════════════════════════════════════════
//
//  [ ] Import { T, FONT, LAYOUT, ANALOGY, BUTTON, PANEL, NCARD, SVG }
//  [ ] Delete any local const T = { ... } or color definitions
//  [ ] Replace all hardcoded hex accent colors with T.accent
//  [ ] Replace all raw font sizes with FONT.xx constants
//  [ ] Remove all textTransform: "uppercase"
//  [ ] Remove all emojis and icon characters
//  [ ] Convert all title/heading text to normal case (not ALL CAPS)
//  [ ] Convert all X_Y equations to X<sub>Y</sub> or Xᵧ unicode
//  [ ] Wrap every section's main SVG in LAYOUT.svgWrapper (centered column)
//  [ ] Move all content below the SVG (never side-by-side)
//  [ ] Add AnalogyBox at top of every section (plain English, 2-3 sentences)
//  [ ] Set SVG maxWidth to LAYOUT.svgMaxWidth (374) or smaller
//  [ ] Check all SVG text/legends fit inside the viewBox
//  [ ] Use BUTTON.toggle(isActive) for all toggle buttons
//  [ ] Use real material systems for phase diagrams
//  [ ] Set icon: "" for all topic definitions
//
