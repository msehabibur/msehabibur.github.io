import React, { useState, useEffect, useRef, useMemo } from "react";
import LLMLearningModule from "./llm_learning.jsx";
import LLMMovieModule from "./llm_movie.jsx";
import DefectNetFlowAnimation from "./defectnet_flow_animation.jsx";
import ElectronOriginsModule from "./electron_origins.jsx";
import DefectMovieModule from "./defect_movie.jsx";
import ChalcoMovieModule from "./chalco_movie.jsx";
import DFTMovieModule from "./dft_movie.jsx";
import DFTParamsMovieModule from "./dft_params_movie.jsx";
import DFTParamsInteractive from "./dft_params_interactive.jsx";
import SSSynthesisMovieModule from "./ss_synthesis_movie.jsx";
import MongoDBMovieModule from "./mongodb_movie.jsx";
import CdTeSolarCellModule from "./cdte_solar.jsx";
import MDMovieModule from "./md_movie.jsx";
import AboutMeModule from "./about_me.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY — catches runtime errors and shows them on screen
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, color: "#dc2626", fontSize: 14, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Runtime Error:</div>
        {this.state.error.toString()}
        <div style={{ marginTop: 12, color: "#999" }}>{this.state.error.stack}</div>
      </div>
    );
    return this.props.children;
  }
}

// ── CHAPTER REFERENCES ──
const CHAPTER_REFERENCES = {
  electrons: [
    "Griffiths, D.J. Introduction to Quantum Mechanics, 3rd ed. Cambridge University Press (2018)",
    "Kittel, C. Introduction to Solid State Physics, 8th ed. Wiley (2004)",
    "Ashcroft, N.W. & Mermin, N.D. Solid State Physics. Cengage Learning (1976)",
    "Martin, R.M. Electronic Structure: Basic Theory and Practical Methods. Cambridge University Press (2020)",
    "Sakurai, J.J. & Napolitano, J.J. Modern Quantum Mechanics, 3rd ed. Cambridge University Press (2020)",
  ],
  dft: [
    "Hohenberg, P. & Kohn, W. Inhomogeneous Electron Gas. Phys. Rev. 136, B864 (1964)",
    "Kohn, W. & Sham, L.J. Self-Consistent Equations Including Exchange and Correlation Effects. Phys. Rev. 140, A1133 (1965)",
    "Perdew, J.P., Burke, K. & Ernzerhof, M. Generalized Gradient Approximation Made Simple. Phys. Rev. Lett. 77, 3865 (1996)",
    "Kresse, G. & Furthmüller, J. Efficient Iterative Schemes for Ab Initio Total-Energy Calculations. Phys. Rev. B 54, 11169 (1996)",
    "Martin, R.M. Electronic Structure: Basic Theory and Practical Methods. Cambridge University Press (2020)",
    "Blöchl, P.E. Projector Augmented-Wave Method. Phys. Rev. B 50, 17953 (1994)",
  ],
  convexhull: [
    "Ong, S.P. et al. Python Materials Genomics (pymatgen): A Robust, Open-Source Python Library. Comput. Mater. Sci. 68, 314 (2013)",
    "Jain, A. et al. Commentary: The Materials Project. APL Mater. 1, 011002 (2013)",
    "Sun, W. et al. The Thermodynamic Scale of Inorganic Crystalline Metastability. Sci. Adv. 2, e1600225 (2016)",
    "Bartel, C.J. et al. A Critical Examination of Compound Stability Predictions from Machine-Learned Formation Energies. npj Comput. Mater. 6, 97 (2020)",
    "Curtarolo, S. et al. AFLOW: An Automatic Framework for High-Throughput Materials Discovery. Comput. Mater. Sci. 58, 218 (2012)",
  ],
  md: [
    "Allen, M.P. & Tildesley, D.J. Computer Simulation of Liquids, 2nd ed. Oxford University Press (2017)",
    "Frenkel, D. & Smit, B. Understanding Molecular Simulation, 3rd ed. Academic Press (2023)",
    "Nosé, S. A Unified Formulation of the Constant Temperature Molecular Dynamics Methods. J. Chem. Phys. 81, 511 (1984)",
    "Verlet, L. Computer Experiments on Classical Fluids. Phys. Rev. 159, 98 (1967)",
    "Car, R. & Parrinello, M. Unified Approach for Molecular Dynamics and Density-Functional Theory. Phys. Rev. Lett. 55, 2471 (1985)",
    "Swope, W.C. et al. A Computer Simulation Method for the Calculation of Equilibrium Constants. J. Chem. Phys. 76, 637 (1982)",
  ],
  defectsemi: [
    "Freysoldt, C. et al. First-Principles Calculations for Point Defects in Solids. Rev. Mod. Phys. 86, 253 (2014)",
    "Zhang, S.B. & Northrup, J.E. Chemical Potential Dependence of Defect Formation Energies in GaAs. Phys. Rev. Lett. 67, 2339 (1991)",
    "Freysoldt, C., Neugebauer, J. & Van de Walle, C.G. Fully Ab Initio Finite-Size Corrections for Charged-Defect Supercell Calculations. Phys. Rev. Lett. 102, 016402 (2009)",
    "Van de Walle, C.G. & Neugebauer, J. First-Principles Calculations for Defects and Impurities. J. Appl. Phys. 95, 3851 (2004)",
    "Kumagai, Y. & Oba, F. Electrostatics-Based Finite-Size Corrections for First-Principles Point Defect Calculations. Phys. Rev. B 89, 195205 (2014)",
    "PRX Energy 4, 032001 (2025) — A Beginner's Guide to Interpreting Defect and Defect Level Diagrams",
  ],
  cdtesolar: [
    "Metzger, W.K. et al. Exceeding 20% Efficiency with In Situ Group V Doping in Polycrystalline CdTe Solar Cells. Nat. Energy 4, 837 (2019)",
    "Green, M.A. et al. Solar Cell Efficiency Tables (Version 64). Prog. Photovolt. Res. Appl. 32, 425 (2024)",
    "Wei, S.-H. & Zhang, S.B. Chemical Trends of Defect Formation and Doping Limits in II-VI Semiconductors. Phys. Rev. B 66, 155211 (2002)",
    "Yang, J. et al. Review on First-Principles Study of Defect Properties of CdTe as a Solar Cell Absorber. Semicond. Sci. Technol. 31, 083002 (2016)",
    "Burst, J.M. et al. CdTe Solar Cells with Open-Circuit Voltage Breaking the 1 V Barrier. Nat. Energy 1, 16015 (2016)",
  ],
  forcefield: [
    "Tersoff, J. Modeling Solid-State Chemistry: Interatomic Potentials for Multicomponent Systems. Phys. Rev. B 39, 5566 (1989)",
    "Daw, M.S. & Baskes, M.I. Embedded-Atom Method: Derivation and Application. Phys. Rev. B 29, 6443 (1984)",
    "van Duin, A.C.T. et al. ReaxFF: A Reactive Force Field for Hydrocarbons. J. Phys. Chem. A 105, 9396 (2001)",
    "Lennard-Jones, J.E. On the Determination of Molecular Fields. Proc. R. Soc. Lond. A 106, 463 (1924)",
    "Stillinger, F.H. & Weber, T.A. Computer Simulation of Local Order in Condensed Phases of Silicon. Phys. Rev. B 31, 5262 (1985)",
    "Buckingham, R.A. The Classical Equation of State of Gaseous Helium, Neon and Argon. Proc. R. Soc. Lond. A 168, 264 (1938)",
  ],
  pipeline: [
    "Xie, T. & Grossman, J.C. Crystal Graph Convolutional Neural Networks for an Accurate and Interpretable Prediction of Material Properties. Phys. Rev. Lett. 120, 145301 (2018)",
    "Batatia, I. et al. MACE: Higher Order Equivariant Message Passing Neural Networks for Fast and Accurate Force Fields. NeurIPS (2022)",
    "Chen, C. & Ong, S.P. A Universal Graph Deep Learning Interatomic Potential for the Periodic Table. Nat. Comput. Sci. 2, 718 (2022)",
    "Behler, J. & Parrinello, M. Generalized Neural-Network Representation of High-Dimensional Potential-Energy Surfaces. Phys. Rev. Lett. 98, 146401 (2007)",
    "Schütt, K.T. et al. SchNet: A Continuous-Filter Convolutional Neural Network for Modeling Quantum Interactions. NeurIPS (2017)",
    "Gasteiger, J. et al. GemNet: Universal Directional Graph Neural Networks for Molecules. NeurIPS (2021)",
  ],
  llmdatamining: [
    "Brown, T.B. et al. Language Models Are Few-Shot Learners (GPT-3). NeurIPS (2020)",
    "Tshitoyan, V. et al. Unsupervised Word Embeddings Capture Latent Knowledge from Materials Science Literature. Nature 571, 95 (2019)",
    "Kim, E. et al. Materials Synthesis Insights from Scientific Literature via Text Mining. Sci. Data 4, 170127 (2017)",
    "Jain, A. et al. Commentary: The Materials Project. APL Mater. 1, 011002 (2013)",
    "Kononova, O. et al. Text-Mined Dataset of Inorganic Materials Synthesis Recipes. Sci. Data 6, 203 (2019)",
    "Swain, M.C. & Cole, J.M. ChemDataExtractor: A Toolkit for Automated Extraction of Chemical Information. J. Chem. Inf. Model. 56, 1894 (2016)",
  ],
  chalcomovie: [
    "Zakutayev, A. et al. Defect Tolerant Semiconductors for Solar Energy Conversion. J. Phys. Chem. Lett. 5, 1117 (2014)",
    "Wuttig, M. & Yamada, N. Phase-Change Materials for Rewriteable Data Storage. Nat. Mater. 6, 824 (2007)",
    "Todorov, T.K. et al. Beyond 11% Efficiency: Characteristics of State-of-the-Art Cu₂ZnSn(S,Se)₄ Solar Cells. Adv. Energy Mater. 3, 34 (2013)",
    "Walsh, A. et al. Kesterite Thin-Film Solar Cells: Advances in Materials Modelling of Cu₂ZnSnS₄. Adv. Mater. 24, 5413 (2012)",
    "Shi, T. et al. Multi-Scale Computational Screening of Defect-Tolerant Semiconductors. iScience 25, 104837 (2022)",
  ],
};

function ChapterReferences({ chapterId }) {
  const refs = CHAPTER_REFERENCES[chapterId];
  if (!refs) return null;
  return (
    <div style={{ marginTop: 32, padding: "18px 20px", borderRadius: 12, background: T.panel, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, marginBottom: 12, letterSpacing: 0.5 }}>REFERENCES</div>
      {refs.map((ref, i) => (
        <div key={i} style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginBottom: 6, paddingLeft: 16, textIndent: -16 }}>
          [{i + 1}] {ref}
        </div>
      ))}
    </div>
  );
}

// UNIFIED THEME — Light gray, readable on any screen
// ═══════════════════════════════════════════════════════════════════════════
const T = {
  bg:      "#f0f2f5",
  panel:   "#ffffff",
  surface: "#f7f8fa",
  border:  "#d4d8e0",
  ink:     "#1a1e2e",
  muted:   "#6b7280",
  dim:     "#c0c6d0",
  gold:    "#b8860b",

  // DefectNet accents (darkened for light bg)
  dn1: "#0284c7",
  dn2: "#d97706",
  dn3: "#059669",
  dn4: "#dc2626",
  dn5: "#7c3aed",
  dn6: "#ea580c",

  // Electron Origins accents
  eo_e:       "#2563eb",
  eo_hole:    "#ea580c",
  eo_photon:  "#ca8a04",
  eo_valence: "#059669",
  eo_core:    "#7c3aed",
  eo_gap:     "#dc2626",
  eo_cond:    "#0284c7",

  // Convex Hull accents
  ch_main:   "#0e7490",
  ch_stable: "#059669",
  ch_unstab: "#e11d48",
  ch_hull:   "#6366f1",
  ch_accent: "#8b5cf6",
  ch_warm:   "#f59e0b",

  // FNV Correction accents
  fnv_main:   "#7c3aed",
  fnv_elec:   "#2563eb",
  fnv_align:  "#059669",
  fnv_warn:   "#dc2626",
  fnv_accent: "#0891b2",
  fnv_warm:   "#d97706",

  // Force Field accents
  ff_bond:  "#b91c1c",
  ff_angle: "#1d4ed8",
  ff_vdw:   "#15803d",
  ff_coul:  "#7e22ce",
  ff_dih:   "#c2410c",
  ff_morse: "#0f766e",
  ff_fit:   "#9333ea",
  ff_mlff:  "#0369a1",

  // DFT Basics accents
  dft_main:   "#0e7490",
  dft_eqn:    "#1d4ed8",
  dft_xc:     "#7c3aed",
  dft_basis:  "#059669",
  dft_warn:   "#dc2626",
  dft_accent: "#0891b2",
  dft_warm:   "#d97706",

  // Molecular Dynamics accents
  md_main:    "#059669",
  md_newton:  "#2563eb",
  md_thermo:  "#7c3aed",
  md_aimd:    "#dc2626",
  md_class:   "#d97706",
  md_prop:    "#0891b2",
  md_warn:    "#ea580c",

  // Monte Carlo accents
  mc_main:    "#6366f1",
  mc_metro:   "#2563eb",
  mc_moves:   "#059669",
  mc_ising:   "#dc2626",
  mc_ce:      "#7c3aed",
  mc_kmc:     "#d97706",
  mc_accent:  "#0891b2",
  mc_warn:    "#ea580c",
};

// ═══════════════════════════════════════════════════════════════════════════
// SHARED: NextTopicCard — shows reason to continue + next topic link
// ═══════════════════════════════════════════════════════════════════════════
function NextTopicCard({ sections, activeId }) {
  const idx = sections.findIndex(s => s.id === activeId);
  const current = sections[idx];
  const next = sections[idx + 1];
  if (!current?.nextReason) return null;
  const col = current.color || T.dn1;
  return (
    <div style={{
      marginTop: 28, padding: "14px 18px", borderRadius: 10,
      background: col + "0a", border: `1.5px solid ${col}22`,
      borderLeft: `4px solid ${col}`,
    }}>
      <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
        {current.nextReason}
        {next && (
          <span> Up next: <span style={{ fontWeight: 700, color: next.color || col }}>{next.label}</span>.</span>
        )}
      </div>
    </div>
  );
}

// SHARED: Unified Card component (supports both defectnet + force-field styles)
// ═══════════════════════════════════════════════════════════════════════════
function Card({ title, color, formula, children }) {
  return (
    <div style={{
      background: T.panel,
      border: `1.5px solid ${(color || T.border)}44`,
      borderLeft: `4px solid ${color || T.dn1}`,
      borderRadius: 10,
      padding: "16px 18px",
    }}>
      {(title || formula) && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
          {title && <div style={{ fontSize: 12, letterSpacing: 2, color: color || T.dn1, textTransform: "uppercase", fontWeight: 700 }}>{title}</div>}
          {formula && <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: T.ink, background: (color || T.dn1) + "11", padding: "2px 10px", borderRadius: 4, border: `1px solid ${(color || T.dn1)}33` }}>{formula}</div>}
        </div>
      )}
      {children}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MODULE 1: DEFECTNET MLFF PIPELINE
// ═══════════════════════════════════════════════════════════════════════════


// ─── MATH (every function used in the pipeline) ───────────────────────
const sigmoid = x => 1 / (1 + Math.exp(-x));
const softplus = x => Math.log(1 + Math.exp(x));
const gaussian = (d, mu, sigma) => Math.exp(-((d - mu) ** 2) / (sigma ** 2));
const cutoffFn = (d, rc = 5.0) => d >= rc ? 0 : 0.5 * (Math.cos(d * Math.PI / rc) + 1);
const matVec = (W, x, bias) => W.map((row, i) => row.reduce((s, w, j) => s + w * (x[j] || 0), 0) + (bias ? bias[i] : 0));

// ─── EMBEDDING TABLE (3-dim per element — tiny so you see every number) ─
const EMBED = {
  1: [-0.21, 0.55, 0.18],   // H
  7: [0.63, 0.24, -0.52],   // N
  8: [0.82, -0.31, 0.41],   // O
};
const ELEM_COLOR = { 1: T.dn1, 7: T.dn3, 8: T.dn4 };

// ─── GAUSSIAN SMEARING: 4 centers ──────────────────────────────────────
const G_MU = [0.0, 1.0, 2.0, 3.0];   // 4 centers (Å)
const G_SIG = 0.8;
const gaussSmear = d => G_MU.map(mu => gaussian(d, mu, G_SIG));

// ─── ANGULAR BASIS: 4 centers ──────────────────────────────────────────
const A_MU = [-1.0, -0.33, 0.33, 1.0];
const A_SIG = 0.5;
const angBasis = cosT => A_MU.map(c => gaussian(cosT, c, A_SIG));

// ─── TWO MOLECULES ────────────────────────────────────────────────────
const MOLECULES = [
  {
    id: "h2o", name: "Water (H₂O)", refEnergy: -14.27,
    desc: "3 atoms · O–H = 0.96 Å · angle HOH = 104.5°",
    atoms: [
      { id: 0, sym: "O", Z: 8, pos: [0, 0, 0] },
      { id: 1, sym: "H", Z: 1, pos: [0.757, 0.586, 0] },
      { id: 2, sym: "H", Z: 1, pos: [-0.757, 0.586, 0] },
    ],
    svgPos: [[200, 240], [340, 100], [60, 100]],
    color: T.dn4,
  },
  {
    id: "nh3", name: "Ammonia (NH₃)", refEnergy: -19.54,
    desc: "4 atoms · N–H = 1.01 Å · angle HNH = 107°",
    atoms: [
      { id: 0, sym: "N", Z: 7, pos: [0, 0, 0.380] },
      { id: 1, sym: "H", Z: 1, pos: [0.939, 0, 0] },
      { id: 2, sym: "H", Z: 1, pos: [-0.469, 0.813, 0] },
      { id: 3, sym: "H", Z: 1, pos: [-0.469, -0.813, 0] },
    ],
    svgPos: [[200, 90], [350, 240], [90, 210], [200, 320]],
    color: T.dn3,
  },
];

// ─── WEIGHT MATRICES (written out so you can verify every multiply) ────
// 2-body: input = [h_i(3), h_j(3), e_ij(4)] = 10-dim → 6-dim (gate:3, core:3)
const W2 = [
  [0.30, -0.10, 0.20, 0.15, -0.25, 0.30, 0.20, -0.10, 0.15, 0.25],
  [-0.20, 0.35, 0.10, -0.15, 0.30, -0.20, 0.10, 0.25, -0.30, 0.15],
  [0.15, 0.20, -0.30, 0.25, 0.10, 0.15, -0.20, 0.30, 0.20, -0.15],
  [0.25, -0.30, 0.15, 0.30, -0.10, 0.20, 0.30, 0.15, -0.20, 0.25],
  [-0.15, 0.25, 0.30, -0.20, 0.25, -0.15, 0.15, -0.30, 0.25, 0.10],
  [0.30, 0.10, -0.20, 0.15, -0.30, 0.25, -0.15, 0.20, 0.10, -0.25],
];
const b2 = [0.10, -0.05, 0.08, 0.15, -0.10, 0.05];

// 3-body: input = [h_i(3), e_ij(4), e_ik(4), a(4)] = 15-dim → 6-dim
const W3 = [
  [0.20, -0.15, 0.25, 0.10, -0.20, 0.30, 0.15, -0.10, 0.20, -0.25, 0.15, 0.20, -0.30, 0.10, 0.25],
  [-0.15, 0.30, 0.10, -0.25, 0.15, -0.10, 0.20, 0.30, -0.15, 0.10, -0.20, -0.10, 0.25, 0.15, -0.30],
  [0.10, 0.20, -0.25, 0.15, 0.25, 0.10, -0.15, 0.20, 0.30, -0.10, 0.25, 0.15, -0.20, 0.30, 0.10],
  [0.25, -0.20, 0.15, 0.30, -0.15, 0.25, 0.10, -0.25, 0.15, 0.20, -0.30, 0.10, 0.20, -0.15, 0.30],
  [-0.10, 0.25, 0.20, -0.15, 0.20, -0.25, 0.30, 0.15, -0.10, 0.30, 0.10, -0.20, 0.15, 0.25, -0.10],
  [0.30, 0.15, -0.10, 0.20, -0.30, 0.15, 0.25, -0.20, 0.10, -0.15, 0.20, 0.25, -0.15, 0.20, 0.10],
];
const b3 = [0.08, -0.03, 0.12, 0.10, -0.08, 0.06];

// Energy readout: 3-dim → 1
const We = [[0.80, -0.45, 0.65]];
const be = [-0.20];

// ─── BUILD EDGES (real distances from real positions) ──────────────────
function buildEdges(atoms) {
  const edges = [];
  for (let i = 0; i < atoms.length; i++)
    for (let j = 0; j < atoms.length; j++) {
      if (i === j) continue;
      const vec = atoms[j].pos.map((p, k) => p - atoms[i].pos[k]);
      const dist = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
      if (dist < 5.0) edges.push({ src: i, dst: j, vec, dist });
    }
  return edges;
}

// ─── BUILD TRIPLETS ─────────────────────────────────────────────────────
function buildTriplets(edges, nAtoms) {
  const triplets = [];
  for (let e1 = 0; e1 < edges.length; e1++)
    for (let e2 = 0; e2 < edges.length; e2++) {
      if (e1 === e2) continue;
      if (edges[e1].src !== edges[e2].src) continue;
      const a = edges[e1], b = edges[e2];
      const dot = a.vec.reduce((s, v, k) => s + v * b.vec[k], 0);
      const cosT = dot / (a.dist * b.dist);
      triplets.push({ center: a.src, e1, e2, cosT, angle: Math.acos(Math.max(-1, Math.min(1, cosT))) * 180 / Math.PI });
    }
  return triplets;
}

// ─── RUN GNN ────────────────────────────────────────────────────────────
function runGNN(atoms, edges, triplets, mol) {
  // 1. Atom embedding
  const h0 = atoms.map(a => [...EMBED[a.Z]]);
  // 2. Edge features
  const eFeat = edges.map(e => gaussSmear(e.dist));
  const eCut = edges.map(e => cutoffFn(e.dist));
  // 3. 2-body message passing
  const h1 = h0.map(h => [...h]);
  const msgs2 = [];
  for (let ei = 0; ei < edges.length; ei++) {
    const { src, dst } = edges[ei];
    const input = [...h0[src], ...h0[dst], ...eFeat[ei]];
    const raw = matVec(W2, input, b2);
    const gate = raw.slice(0, 3).map(sigmoid);
    const core = raw.slice(3).map(softplus);
    const msg = gate.map((g, i) => g * core[i] * eCut[ei]);
    msgs2.push({ ei, input, raw, gate, core, msg, cut: eCut[ei] });
    for (let i = 0; i < 3; i++) h1[dst][i] += msg[i];
  }
  const h1a = h1.map(h => h.map(softplus));
  // 4. 3-body
  const h2 = h1a.map(h => [...h]);
  const msgs3 = [];
  for (let ti = 0; ti < triplets.length; ti++) {
    const t = triplets[ti];
    const aFeat = angBasis(t.cosT);
    const input = [...h1a[t.center], ...eFeat[t.e1], ...eFeat[t.e2], ...aFeat];
    const raw = matVec(W3, input, b3);
    const gate = raw.slice(0, 3).map(sigmoid);
    const core = raw.slice(3).map(softplus);
    const w = eCut[t.e1] * eCut[t.e2];
    const msg = gate.map((g, i) => g * core[i] * w);
    msgs3.push({ ti, input, raw, gate, core, msg, w, aFeat });
    for (let i = 0; i < 3; i++) h2[t.center][i] += msg[i];
  }
  const h2a = h2.map(h => h.map(softplus));
  // 5. Energy
  const rawE = h2a.map(h => matVec(We, h, be)[0]);
  const rawTotal = rawE.reduce((s, v) => s + v, 0) || 1;
  const scale = mol.refEnergy / rawTotal;
  const atomE = rawE.map(e => e * scale);
  const totalE = atomE.reduce((s, v) => s + v, 0);
  // 6. Forces
  const forces = atoms.map(() => [0, 0, 0]);
  for (let ei = 0; ei < edges.length; ei++) {
    const e = edges[ei];
    const mn = Math.sqrt(msgs2[ei].msg.reduce((s, v) => s + v * v, 0));
    const fm = -mn * Math.abs(scale) * 0.02;
    for (let k = 0; k < 3; k++) forces[e.dst][k] += fm * e.vec[k] / e.dist;
  }
  // 7. Stress
  const V = 10.0;
  const stress = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const e of edges)
    for (let a = 0; a < 3; a++)
      for (let b2x = 0; b2x < 3; b2x++)
        stress[a][b2x] += e.vec[a] * forces[e.dst][b2x] / V;
  const stressGPa = stress.map(r => r.map(v => v * 160.2));

  return { h0, h1: h1a, h2: h2a, eFeat, eCut, msgs2, msgs3, atomE, totalE, rawE, scale, forces, stressGPa };
}

// ─── SECTIONS ──────────────────────────────────────────────────────────
const PIPELINE_BLOCKS = [
  { id: "representation", label: "Graph Representation", color: T.dn1 },
  { id: "architecture", label: "Network Architecture", color: T.dn4 },
  { id: "physics", label: "Physics & Symmetry", color: T.dn3 },
  { id: "defectnet", label: "DefectNet & Workflow", color: T.dn2 },
];

const PIPELINE_SECTIONS = [
  // Block 1: Graph Representation
  { id: "struct",  block: "representation", label: "Structure & Graph", color: T.dn1, nextReason: "The molecular graph captures atomic topology. Atom embedding now converts discrete element labels into continuous learned vectors \u2014 placing chemically similar elements close together in a high-dimensional space." },
  { id: "embed",   block: "representation", label: "Atom Embedding", color: T.dn5, nextReason: "Elements are now embedded as vectors. Distances between atom pairs are continuous numbers, but the network needs a smooth differentiable representation \u2014 Gaussian smearing converts raw distances into local density features." },
  { id: "gauss",   block: "representation", label: "Gaussian Smearing", color: T.dn2, nextReason: "Gaussian features describe radial density. A cosine cutoff function now smoothly zeroes out interactions beyond a radius, so the network ignores irrelevant distant atoms while remaining fully differentiable." },
  { id: "cutoff",  block: "representation", label: "Cosine Cutoff", color: T.dn6, nextReason: "Radial features with a smooth cutoff are in place. Angular basis functions add bond-angle information \u2014 the 3D directional geometry that makes the representation rotationally invariant." },
  { id: "angular", block: "representation", label: "Angular Basis", color: T.dn5, nextReason: "Both radial and angular features are computed at each atom. Message passing now propagates these features across bonds \u2014 each atom iteratively aggregates its neighbors\u2019 information, building non-local representations." },
  // Block 2: Network Architecture
  { id: "conv",    block: "architecture", label: "Message Passing", color: T.dn4, nextReason: "Atom representations have converged through message passing. Prediction heads now map each atom\u2019s final representation to physical outputs: energy (summed over atoms), forces (gradient), and stress tensor." },
  { id: "predict", block: "architecture", label: "Predictions", color: T.dn3, nextReason: "Individual pieces are understood. The full pipeline animation shows all stages operating simultaneously \u2014 watch a molecular graph flow from raw coordinates through every layer to predicted energy and forces." },
  { id: "animate", block: "architecture", label: "Full Pipeline", color: T.dn1, nextReason: "The architecture is clear. Parameters dives into the engineering choices: how many layers, what embedding dimension, how many DFT training points are needed to reach chemical accuracy." },
  { id: "params",  block: "architecture", label: "Parameters", color: T.dn2, nextReason: "Network design is settled. Now we examine the fundamental symmetry requirement: equivariance \u2014 why forces must rotate with the crystal and how E(3)-equivariant architectures guarantee this automatically." },
  // Block 3: Physics & Symmetry
  { id: "equiv",   block: "physics", label: "Symmetry & Equivariance", color: T.dn1, nextReason: "Symmetry principles are clear. Local cutoffs miss long-range Coulomb interactions in ionic materials \u2014 we now explore how Ewald summation, learned charges, and large cutoffs address this." },
  { id: "longrange", block: "physics", label: "Long-Range Electrostatics", color: T.dn4, nextReason: "Long-range treatment understood. But how confident is the model? Uncertainty quantification via MC Dropout lets us flag unreliable predictions and drive active learning loops." },
  { id: "uncertainty", block: "physics", label: "Uncertainty", color: T.dn3, nextReason: "Uncertainty estimation mastered. Now see the full DefectNet architecture \u2014 how all pieces (2-body, 3-body, equivariant vectors, global conditioning) fit together for charged defect modeling." },
  // Block 4: DefectNet & Workflow
  { id: "defectnet", block: "defectnet", label: "DefectNet Deep Dive", color: T.dn2, nextReason: "DefectNet architecture understood. The MLFF workflow shows the full end-to-end process: DFT data generation \u2192 model training \u2192 active learning \u2192 deployment in large-scale MD." },
  { id: "mlflow",  block: "defectnet", label: "MLFF Flow", color: T.dn6, nextReason: "MLFF pipeline mastered. Chapter 3 (Computational Phase Diagram) applies MLFF-generated energies to a key materials science problem: mapping thermodynamic phase stability across composition space at DFT quality and MD speed." },
];

// ─── UI COMPONENTS ─────────────────────────────────────────────────────

function MR({ label, eq, result, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>
      {label && <span style={{ color: T.muted, minWidth: 80 }}>{label}</span>}
      <span style={{ color: T.ink, fontFamily: "monospace" }}>{eq}</span>
      {result !== undefined && <><span style={{ color: T.muted }}>=</span><span style={{ color: color || T.dn3, fontWeight: 700, fontFamily: "monospace" }}>{result}</span></>}
    </div>
  );
}

function Vec({ v, color, label }) {
  return (
    <div style={{ marginBottom: 6 }}>
      {label && <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>{label}</div>}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ color: T.muted }}>[</span>
        {v.map((x, i) => (
          <span key={i} style={{ background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 4, padding: "2px 7px", fontSize: 12, fontFamily: "monospace", color }}>{typeof x === "number" ? x.toFixed(4) : x}</span>
        ))}
        <span style={{ color: T.muted }}>]</span>
        <span style={{ color: T.dim, fontSize: 10 }}>dim={v.length}</span>
      </div>
    </div>
  );
}

// ─── MOLECULE SVG ──────────────────────────────────────────────────────
function MolSVG({ mol, edges, hlEdge = -1 }) {
  const sp = mol.svgPos;
  return (
    <svg viewBox="0 0 420 340" style={{ display: "block", width: "100%", maxWidth: 420 }}>
      <rect width={420} height={340} fill={T.bg} rx={8} />
      {edges.map((e, i) => {
        const [sx, sy] = sp[e.src], [ex, ey] = sp[e.dst];
        const dx = ex - sx, dy = ey - sy, len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len, R = 22;
        const x1 = sx + ux * R, y1 = sy + uy * R, x2 = ex - ux * (R + 8), y2 = ey - uy * (R + 8);
        const hl = hlEdge === i;
        return (
          <g key={i} opacity={hl ? 1 : 0.2}>
            <defs><marker id={`ar${i}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d={`M0,0 L0,6 L6,3z`} fill={hl ? T.dn2 : T.dim} /></marker></defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hl ? T.dn2 : T.dim} strokeWidth={hl ? 2.5 : 1} markerEnd={`url(#ar${i})`} />
            {hl && <text x={(x1 + x2) / 2 - uy * 14} y={(y1 + y2) / 2 + ux * 14} fill={T.dn2} fontSize={10} textAnchor="middle" fontWeight="bold">{e.dist.toFixed(3)}Å</text>}
          </g>
        );
      })}
      {mol.atoms.map((a, i) => {
        const [cx, cy] = sp[i];
        const col = ELEM_COLOR[a.Z] || T.ink;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={22} fill={`${col}22`} stroke={col} strokeWidth={2} />
            <text x={cx} y={cy - 2} textAnchor="middle" fill={col} fontSize={15} fontWeight="bold">{a.sym}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill={T.muted} fontSize={9}>id={a.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 1: STRUCTURE & GRAPH
// ═══════════════════════════════════════════════════════════════════════
function SecStruct({ mol, atoms, edges, triplets }) {
  const [hlE, setHlE] = useState(0);
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 430px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Molecule visualization" color={mol.color}>
          <MolSVG mol={mol} edges={edges} hlEdge={hlE} />
          <div style={{ marginTop: 6, fontSize: 11, color: T.muted }}>Click an edge row to highlight it →</div>
        </Card>
      </div>
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Atom positions (Å)" color={T.dn1}>
          {atoms.map(a => (
            <div key={a.id} style={{ display: "flex", gap: 8, marginBottom: 4, fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700, width: 60 }}>{a.sym} (id={a.id})</span>
              <span style={{ color: T.ink }}>[{a.pos.map(v => v.toFixed(3)).join(", ")}]</span>
            </div>
          ))}
        </Card>

        <Card title={`edge_index — shape [2, ${edges.length}]`} color={T.dn2}>
          <div style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 6 }}>
            <div><span style={{ color: T.muted }}>src: </span><span style={{ color: T.dn2 }}>[{edges.map(e => e.src).join(", ")}]</span></div>
            <div><span style={{ color: T.muted }}>dst: </span><span style={{ color: T.dn1 }}>[{edges.map(e => e.dst).join(", ")}]</span></div>
          </div>
        </Card>

        <Card title={`All ${edges.length} edges (click to highlight)`} color={T.dn3}>
          <div style={{ fontSize: 11, fontFamily: "monospace" }}>
            {edges.map((e, i) => (
              <div key={i} onClick={() => setHlE(i)} style={{ display: "flex", gap: 6, padding: "3px 4px", cursor: "pointer", borderRadius: 4, background: hlE === i ? `${T.dn2}22` : "transparent" }}>
                <span style={{ color: T.dim, width: 20 }}>e{i}</span>
                <span style={{ width: 80 }}>
                  <span style={{ color: ELEM_COLOR[atoms[e.src].Z] }}>{atoms[e.src].sym}({e.src})</span>
                  <span style={{ color: T.muted }}>→</span>
                  <span style={{ color: ELEM_COLOR[atoms[e.dst].Z] }}>{atoms[e.dst].sym}({e.dst})</span>
                </span>
                <span style={{ color: T.dn3 }}>{e.dist.toFixed(4)} Å</span>
                <span style={{ color: T.ink, flex: 1, textAlign: "right" }}>vec=[{e.vec.map(v => v.toFixed(3)).join(", ")}]</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={`${triplets.length} triplets (3-body angle groups)`} color={T.dn5}>
          <div style={{ fontSize: 11, fontFamily: "monospace" }}>
            {triplets.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, padding: "2px 0" }}>
                <span style={{ color: T.muted }}>t{i}:</span>
                <span style={{ color: ELEM_COLOR[atoms[t.center].Z] }}>center={atoms[t.center].sym}({t.center})</span>
                <span style={{ color: T.dn5 }}>cos θ={t.cosT.toFixed(4)}</span>
                <span style={{ color: T.dn2 }}>{t.angle.toFixed(1)}°</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 2: ATOM EMBEDDING
// ═══════════════════════════════════════════════════════════════════════
function SecEmbed({ atoms }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Embedding lookup table (118 × 3)" color={T.dn5}>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 10 }}>
            Each element gets a <span style={{ color: T.dn5 }}>3-dim vector</span> (real models use 64–128 dim).
            Just index by atomic number Z. Same element always gives the same vector.
          </div>
          {Object.entries(EMBED).map(([Z, vec]) => {
            const sym = { 1: "H", 7: "N", 8: "O" }[Z];
            return <Vec key={Z} v={vec} color={ELEM_COLOR[+Z]} label={`table[Z=${Z}] → ${sym}`} />;
          })}
        </Card>
      </div>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Embeddings for each atom in our molecule" color={T.dn3}>
          {atoms.map(a => (
            <div key={a.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 2 }}>
                h⁰[{a.id}] = table[Z={a.Z}] → {a.sym}
              </div>
              <Vec v={EMBED[a.Z]} color={ELEM_COLOR[a.Z]} />
              <div style={{ fontSize: 10, color: T.dim }}>Position: [{a.pos.map(v => v.toFixed(3)).join(", ")}]</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: T.muted, marginTop: 8, lineHeight: 1.7 }}>
            Note: H atoms (id 1 & 2) get the <span style={{ color: T.dn1 }}>same embedding</span> because they are the same element.
            Position does NOT affect embedding — only element type matters.
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 3: GAUSSIAN SMEARING
// ═══════════════════════════════════════════════════════════════════════
function SecGauss({ edges, atoms }) {
  const [sel, setSel] = useState(0);
  const e = edges[sel];
  const gv = gaussSmear(e.dist);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Select an edge" color={T.dn2}>
          {edges.map((ed, i) => (
            <div key={i} onClick={() => setSel(i)} style={{ display: "flex", gap: 8, padding: "4px 6px", cursor: "pointer", borderRadius: 4, background: sel === i ? `${T.dn2}22` : "transparent", fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: T.dim }}>e{i}</span>
              <span style={{ color: ELEM_COLOR[atoms[ed.src].Z] }}>{atoms[ed.src].sym}</span>
              <span style={{ color: T.muted }}>→</span>
              <span style={{ color: ELEM_COLOR[atoms[ed.dst].Z] }}>{atoms[ed.dst].sym}</span>
              <span style={{ color: T.dn3 }}>{ed.dist.toFixed(4)} Å</span>
            </div>
          ))}
        </Card>

        <Card title="Formula" color={T.dn2}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: T.dn2, textAlign: "center", padding: 6 }}>
            g_k(d) = exp( -(d - μ_k)² / σ² )
          </div>
          <MR label="σ =" eq="0.8 Å" />
          <MR label="Centers:" eq="[0.0, 1.0, 2.0, 3.0] Å" />
        </Card>
      </div>

      <div style={{ flex: "1 1 440px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={`Step-by-step for e${sel}: d = ${e.dist.toFixed(4)} Å`} color={T.dn1}>
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: T.muted }}>
              {["k", "μ_k", "d − μ", "(d−μ)²", "÷ σ²=0.64", "exp(−x)", "g_k"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {G_MU.map((mu, k) => {
                const diff = e.dist - mu;
                const sq = diff ** 2;
                const div = sq / (G_SIG ** 2);
                const hl = gv[k] > 0.15;
                return (
                  <tr key={k} style={{ background: hl ? `${T.dn2}11` : "transparent" }}>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: T.dim }}>{k}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{mu.toFixed(1)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{diff.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{sq.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{div.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>exp(−{div.toFixed(3)})</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: hl ? T.dn2 : T.dim, fontWeight: hl ? 700 : 400 }}>{gv[k].toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Result: e_ij feature vector" color={T.dn3}>
          <Vec v={gv} color={T.dn2} label={`e_ij for d=${e.dist.toFixed(4)}Å → 4-dim`} />
        </Card>

        <Card title="All edges smeared" color={T.dim}>
          {edges.map((ed, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <Vec v={gaussSmear(ed.dist)} color={T.dn2} label={`e${i} (d=${ed.dist.toFixed(3)}Å) ${atoms[ed.src].sym}→${atoms[ed.dst].sym}`} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 4: COSINE CUTOFF
// ═══════════════════════════════════════════════════════════════════════
function SecCutoff({ edges, atoms }) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Cosine Cutoff Formula" color={T.dn6}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: T.dn6, textAlign: "center", padding: 8 }}>
            w(d) = 0.5 × [cos(d × π / r_c) + 1]
          </div>
          <MR label="r_c =" eq="5.0 Å" />
          <MR label="w(0) =" eq="0.5×[cos(0)+1] = 0.5×2" result="1.0" color={T.dn3} />
          <MR label="w(5) =" eq="0.5×[cos(π)+1] = 0.5×0" result="0.0" color={T.dn4} />
        </Card>

        <Card title="Cutoff curve" color={T.dn6}>
          <svg viewBox="0 0 400 120" style={{ width: "100%", maxWidth: 400 }}>
            <rect width={400} height={120} fill={T.bg} rx={6} />
            <polyline fill="none" stroke={T.dn6} strokeWidth={2}
              points={Array.from({ length: 50 }, (_, i) => {
                const d = i * 5 / 49;
                return `${20 + d * 72},${105 - cutoffFn(d) * 85}`;
              }).join(" ")} />
            {[0, 1, 2, 3, 4, 5].map(v => (
              <text key={v} x={20 + v * 72} y={118} textAnchor="middle" fill={T.muted} fontSize={9}>{v}Å</text>
            ))}
            {edges.map((e, i) => (
              <circle key={i} cx={20 + e.dist * 72} cy={105 - cutoffFn(e.dist) * 85} r={4} fill={T.dn1} />
            ))}
          </svg>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Blue dots = our edges on the curve</div>
        </Card>
      </div>

      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Step-by-step for every edge" color={T.dn1}>
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: T.muted }}>
              {["edge", "d (Å)", "d×π/5", "cos(...)", "w(d)"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {edges.map((e, i) => {
                const arg = e.dist * Math.PI / 5;
                const cosV = Math.cos(arg);
                const w = cutoffFn(e.dist);
                return (
                  <tr key={i}>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>
                      <span style={{ color: ELEM_COLOR[atoms[e.src].Z] }}>{atoms[e.src].sym}</span>→<span style={{ color: ELEM_COLOR[atoms[e.dst].Z] }}>{atoms[e.dst].sym}</span>
                    </td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: T.dn3 }}>{e.dist.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{arg.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{cosV.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: T.dn6, fontWeight: 700 }}>{w.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Summary" color={T.dn3}>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
            All our bonds are short (&lt;2 Å), so all cutoff weights are close to 1.
            Bonds near 5 Å would get weight near 0 (smoothly fading out).
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 5: ANGULAR BASIS
// ═══════════════════════════════════════════════════════════════════════
function SecAngular({ edges, triplets, atoms }) {
  const [sel, setSel] = useState(0);
  const t = triplets[sel];
  const e1 = edges[t.e1], e2 = edges[t.e2];
  const av = angBasis(t.cosT);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Select a triplet" color={T.dn5}>
          {triplets.map((tr, i) => (
            <div key={i} onClick={() => setSel(i)} style={{ display: "flex", gap: 6, padding: "4px 6px", cursor: "pointer", borderRadius: 4, background: sel === i ? `${T.dn5}22` : "transparent", fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: T.dim }}>t{i}</span>
              <span style={{ color: ELEM_COLOR[atoms[tr.center].Z], fontWeight: 700 }}>center={atoms[tr.center].sym}({tr.center})</span>
              <span style={{ color: T.dn5 }}>cos θ = {tr.cosT.toFixed(4)}</span>
              <span style={{ color: T.dn2 }}>{tr.angle.toFixed(1)}°</span>
            </div>
          ))}
        </Card>

        <Card title="How cos θ is computed" color={T.dn2}>
          <MR label="Edge 1:" eq={`e${t.e1}: ${atoms[e1.src].sym}(${e1.src})→${atoms[e1.dst].sym}(${e1.dst}), vec=[${e1.vec.map(v => v.toFixed(3)).join(", ")}]`} />
          <MR label="Edge 2:" eq={`e${t.e2}: ${atoms[e2.src].sym}(${e2.src})→${atoms[e2.dst].sym}(${e2.dst}), vec=[${e2.vec.map(v => v.toFixed(3)).join(", ")}]`} />
          <div style={{ height: 8 }} />
          <MR label="dot product:" eq={`${e1.vec.map((v, k) => `${v.toFixed(3)}×${e2.vec[k].toFixed(3)}`).join(" + ")}`}
            result={(e1.vec[0] * e2.vec[0] + e1.vec[1] * e2.vec[1] + e1.vec[2] * e2.vec[2]).toFixed(4)} />
          <MR label="|v1|×|v2|:" eq={`${e1.dist.toFixed(4)} × ${e2.dist.toFixed(4)}`} result={(e1.dist * e2.dist).toFixed(4)} />
          <MR label="cos θ:" eq="dot / (|v1|×|v2|)" result={t.cosT.toFixed(4)} color={T.dn5} />
          <MR label="θ:" eq={`arccos(${t.cosT.toFixed(4)})`} result={`${t.angle.toFixed(1)}°`} color={T.dn2} />
        </Card>
      </div>

      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Angular basis expansion" color={T.dn5}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: T.dn5, textAlign: "center", padding: 6 }}>
            a_k(cos θ) = exp( -(cos θ - c_k)² / σ² )
          </div>
          <MR label="σ =" eq="0.5" />
          <MR label="Centers:" eq="[-1.0, -0.33, 0.33, 1.0]" />
          <div style={{ height: 10 }} />
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: T.muted }}>
              {["k", "c_k", "cos θ − c_k", "(...)²/0.25", "a_k"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {A_MU.map((c, k) => {
                const diff = t.cosT - c;
                const exp = diff ** 2 / (A_SIG ** 2);
                const hl = av[k] > 0.15;
                return (
                  <tr key={k} style={{ background: hl ? `${T.dn5}11` : "transparent" }}>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: T.dim }}>{k}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{c.toFixed(2)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{diff.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{exp.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: hl ? T.dn5 : T.dim, fontWeight: hl ? 700 : 400 }}>{av[k].toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Result: angular feature vector" color={T.dn3}>
          <Vec v={av} color={T.dn5} label={`a(cos θ = ${t.cosT.toFixed(4)}) → 4-dim`} />
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 6: MESSAGE PASSING (2-body + 3-body)
// ═══════════════════════════════════════════════════════════════════════
function SecConv({ atoms, edges, triplets, gnn }) {
  const [tab, setTab] = useState("2b");
  const [sel2, setSel2] = useState(0);
  const [sel3, setSel3] = useState(0);

  const s2 = Math.min(sel2, gnn.msgs2.length - 1);
  const s3 = Math.min(sel3, gnn.msgs3.length - 1);
  const m2 = gnn.msgs2[s2];
  const m3 = gnn.msgs3[s3];

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 100%", display: "flex", gap: 6, marginBottom: 4 }}>
        {[["2b", "2-Body Conv"], ["3b", "3-Body Conv"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: tab === k ? `${T.dn4}22` : T.panel,
            border: `1px solid ${tab === k ? T.dn4 : T.border}`,
            color: tab === k ? T.dn4 : T.muted, fontFamily: "inherit",
          }}>{l}</button>
        ))}
      </div>

      {tab === "2b" && m2 && (() => {
        const e = edges[m2.ei];
        if (!e) return null;
        return (
          <>
            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Pick edge" color={T.dn4}>
                {edges.map((ed, i) => (
                  <div key={i} onClick={() => setSel2(i)} style={{ padding: "3px 6px", cursor: "pointer", borderRadius: 4, background: s2 === i ? `${T.dn4}22` : "transparent", fontFamily: "monospace", fontSize: 11 }}>
                    e{i}: {atoms[ed.src].sym}({ed.src})→{atoms[ed.dst].sym}({ed.dst}) d={ed.dist.toFixed(3)}Å
                  </div>
                ))}
              </Card>

              <Card title="Step 1: Build input vector [h_i, h_j, e_ij]" color={T.dn1}>
                <Vec v={gnn.h0[e.dst]} color={T.dn1} label={`h_i = embed[${atoms[e.dst].sym}] (center atom ${e.dst})`} />
                <Vec v={gnn.h0[e.src]} color={T.dn3} label={`h_j = embed[${atoms[e.src].sym}] (neighbor atom ${e.src})`} />
                <Vec v={gnn.eFeat[m2.ei]} color={T.dn2} label={`e_ij = gaussSmear(${e.dist.toFixed(4)})`} />
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Concatenated: dim = 3 + 3 + 4 = <span style={{ color: T.dn3, fontWeight: 700 }}>10</span></div>
                <Vec v={m2.input} color={T.ink} label="Full input vector:" />
              </Card>

              <Card title="Step 2: W × input + b → 6-dim raw" color={T.dn5}>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  The weight matrix <span style={{ color: T.dn5 }}>W</span> has <span style={{ color: T.dn5 }}>6 rows</span>, each with 10 values.
                  Each row is like a "detector" — it dot-products with the 10-dim input to produce one number.
                </div>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  The 6 outputs are split into two groups of 3:
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, padding: "6px 10px", background: `${T.dn4}11`, border: `1px solid ${T.dn4}33`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 2 }}>Row 0–2 → gate[0,1,2]</div>
                    <div style={{ fontSize: 10, color: T.muted }}>These 3 values will go through sigmoid (0 to 1) in Step 3 to control how much signal passes</div>
                  </div>
                  <div style={{ flex: 1, padding: "6px 10px", background: `${T.dn6}11`, border: `1px solid ${T.dn6}33`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: T.dn6, fontWeight: 700, marginBottom: 2 }}>Row 3–5 → core[0,1,2]</div>
                    <div style={{ fontSize: 10, color: T.muted }}>These 3 values will go through softplus (always positive) in Step 3 as the actual message content</div>
                  </div>
                </div>
                {/* === Matrix multiplication dimension visual === */}
                <div style={{ background: `${T.dn5}08`, border: `1px solid ${T.dn5}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: T.dn5, fontWeight: 700, marginBottom: 6 }}>How does a (6×10) matrix multiply a (1×10) input?</div>
                  <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginBottom: 8 }}>
                    The input looks like a row <span style={{ color: T.muted }}>[x₀, x₁, … x₉]</span> but for multiplication we treat it as a <b>column vector (10×1)</b>:
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    {/* W matrix */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn5, marginBottom: 2 }}>W (6×10)</div>
                      <div style={{ border: `1px solid ${T.dn5}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div style={{ color: T.dn4 }}>[ w₀₀ w₀₁ … w₀₉ ]</div>
                        <div style={{ color: T.dn4 }}>[ w₁₀ w₁₁ … w₁₉ ]</div>
                        <div style={{ color: T.dn4 }}>[ w₂₀ w₂₁ … w₂₉ ]</div>
                        <div style={{ color: T.muted, fontSize: 8 }}>───────────────</div>
                        <div style={{ color: T.dn6 }}>[ w₃₀ w₃₁ … w₃₉ ]</div>
                        <div style={{ color: T.dn6 }}>[ w₄₀ w₄₁ … w₄₉ ]</div>
                        <div style={{ color: T.dn6 }}>[ w₅₀ w₅₁ … w₅₉ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>×</div>
                    {/* Input column vector */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>input (10×1)</div>
                      <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div>[ x₀ ]</div>
                        <div>[ x₁ ]</div>
                        <div>[ ⋮  ]</div>
                        <div>[ x₉ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>+</div>
                    {/* Bias */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.muted, marginBottom: 2 }}>b (6×1)</div>
                      <div style={{ border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div>[ b₀ ]</div>
                        <div>[ b₁ ]</div>
                        <div>[ ⋮  ]</div>
                        <div>[ b₅ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>=</div>
                    {/* Output */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>raw (6×1)</div>
                      <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div style={{ color: T.dn4 }}>[ gate₀ ]</div>
                        <div style={{ color: T.dn4 }}>[ gate₁ ]</div>
                        <div style={{ color: T.dn4 }}>[ gate₂ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₀ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₁ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₂ ]</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7, background: `${T.bg}88`, borderRadius: 4, padding: "6px 8px" }}>
                    <b>Example — row 0:</b> raw[0] = w₀₀×x₀ + w₀₁×x₁ + w₀₂×x₂ + … + w₀₉×x₉ + b₀<br/>
                    The <span style={{ color: T.dn5 }}>10 in the inner dimension</span> must match: W has 10 columns, input has 10 rows → they "zip together" into a dot product.<br/>
                    Result: <span style={{ color: T.dn5 }}>(6×<span style={{ textDecoration: "underline" }}>10</span>) × (<span style={{ textDecoration: "underline" }}>10</span>×1) → (6×1)</span> — the 10s cancel, leaving 6 outputs.
                  </div>
                </div>

                <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>
                  W shape: [6, 10], b shape: [6]. Formula: <span style={{ color: T.dn5 }}>raw[i] = W[i][0]×input[0] + W[i][1]×input[1] + … + W[i][9]×input[9] + b[i]</span>
                </div>
                <table style={{ fontSize: 11, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
                  <thead><tr style={{ color: T.muted }}>
                    <th style={{ padding: "3px 6px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>row</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>W·input</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>+ bias</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>= raw</th>
                  </tr></thead>
                  <tbody>
                    {m2.raw.map((v, r) => {
                      const dotP = W2[r].reduce((s, w, j) => s + w * m2.input[j], 0);
                      return (
                        <tr key={r} style={{ background: r === 3 ? `${T.border}33` : "transparent" }}>
                          <td style={{ padding: "3px 6px", color: r < 3 ? T.dn4 : T.dn6 }}>{r < 3 ? "gate" : "core"}[{r % 3}]</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.ink }}>{dotP.toFixed(4)}</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.muted }}>{b2[r] >= 0 ? "+" : ""}{b2[r].toFixed(2)}</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.dn3, fontWeight: 700 }}>{v.toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Vec v={m2.raw} color={T.dn5} label="raw output (6-dim):" />
              </Card>
            </div>

            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Step 3: Split → sigmoid(gate) ⊙ softplus(core)" color={T.dn4}>
                {/* === Why sigmoid & softplus explanation === */}
                <div style={{ background: `${T.dn4}08`, border: `1px solid ${T.dn4}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 6 }}>Why sigmoid for gate? Why softplus for core?</div>
                  <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                    The raw 6 numbers from Step 2 can be anything (negative, zero, large positive). We need to <b>reshape</b> them
                    so they have the right meaning for the network. The choice of activation function depends on the <b>role</b> each value plays:
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1, padding: "8px 10px", background: `${T.dn4}11`, border: `1px solid ${T.dn4}33`, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>Gate → sigmoid</div>
                      <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7 }}>
                        <b>Role:</b> A "dimmer switch" — controls how much signal passes through (0% to 100%).<br/>
                        <b>Why sigmoid?</b> sigmoid squashes any number into the range <span style={{ color: T.dn4 }}>(0, 1)</span>:<br/>
                        • Very negative input → ≈ 0 (gate closed, block signal)<br/>
                        • Zero → 0.5 (half open)<br/>
                        • Very positive input → ≈ 1 (gate open, pass everything)<br/>
                        <b>Formula:</b> σ(x) = 1 / (1 + e⁻ˣ)
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: "8px 10px", background: `${T.dn6}11`, border: `1px solid ${T.dn6}33`, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: T.dn6, fontWeight: 700, marginBottom: 4 }}>Core → softplus</div>
                      <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7 }}>
                        <b>Role:</b> The actual message magnitude — how strong is the interaction?<br/>
                        <b>Why softplus?</b> softplus ensures the output is always <span style={{ color: T.dn6 }}>positive (≥ 0)</span>:<br/>
                        • Very negative input → ≈ 0 (near zero, weak interaction)<br/>
                        • Zero → 0.693 (= ln(2))<br/>
                        • Positive input → ≈ input itself (grows linearly)<br/>
                        <b>Formula:</b> softplus(x) = ln(1 + eˣ)
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7, background: `${T.bg}88`, borderRadius: 4, padding: "6px 8px" }}>
                    <b>Together:</b> msg = <span style={{ color: T.dn4 }}>gate</span> ⊙ <span style={{ color: T.dn6 }}>core</span> =
                    (0-to-1 switch) × (positive magnitude). The gate decides <i>whether</i> to send a message, the core decides <i>how strong</i>.
                    This is called a <b>"gated activation"</b> — it lets the network learn to selectively pass or block information on each dimension independently.
                  </div>
                </div>

                <div style={{ fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: T.dn4 }}>Gate (first 3):</span> control how much passes through
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`sigmoid(${m2.raw[i].toFixed(4)})`} result={m2.gate[i].toFixed(4)} color={T.dn4} />
                ))}
                <Vec v={m2.gate} color={T.dn4} label="gate (range 0 to 1):" />

                <div style={{ fontSize: 12, marginTop: 10, marginBottom: 8 }}>
                  <span style={{ color: T.dn6 }}>Core (last 3):</span> the actual message content
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`softplus(${m2.raw[i + 3].toFixed(4)})`} result={m2.core[i].toFixed(4)} color={T.dn6} />
                ))}
                <Vec v={m2.core} color={T.dn6} label="core (always positive):" />
              </Card>

              <Card title="Step 4: msg = gate ⊙ core × w(d)" color={T.dn3}>
                <MR label="w(d):" eq={`cutoff(${e.dist.toFixed(4)})`} result={m2.cut.toFixed(4)} color={T.dn6} />
                <div style={{ height: 6 }} />
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`${m2.gate[i].toFixed(4)} × ${m2.core[i].toFixed(4)} × ${m2.cut.toFixed(4)}`}
                    result={m2.msg[i].toFixed(4)} color={T.dn3} />
                ))}
                <Vec v={m2.msg} color={T.dn3} label="Final message (3-dim):" />
              </Card>

              <Card title="Step 5: After scatter_add → h'_i" color={T.dn2}>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
                  All messages to atom {e.dst} ({atoms[e.dst].sym}) are summed, added to h⁰, then softplus:
                </div>
                <Vec v={gnn.h1[e.dst]} color={T.dn2} label={`h'[${e.dst}] = softplus( h⁰ + Σ msgs )`} />
              </Card>
            </div>
          </>
        );
      })()}

      {tab === "3b" && m3 && (() => {
        const t = triplets[m3.ti];
        if (!t) return null;
        const e1 = edges[t.e1], e2 = edges[t.e2];
        return (
          <>
            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Pick triplet" color={T.dn3}>
                {triplets.map((tr, i) => (
                  <div key={i} onClick={() => setSel3(i)} style={{ padding: "3px 6px", cursor: "pointer", borderRadius: 4, background: s3 === i ? `${T.dn3}22` : "transparent", fontFamily: "monospace", fontSize: 11 }}>
                    t{i}: center={atoms[tr.center].sym}({tr.center}) θ={tr.angle.toFixed(1)}°
                  </div>
                ))}
              </Card>

              <Card title="3-Body input: [h'_i, e_ij, e_ik, a(cos θ)]" color={T.dn1}>
                <Vec v={gnn.h1[t.center]} color={T.dn1} label={`h'_i (center ${atoms[t.center].sym}, after 2-body)`} />
                <Vec v={gnn.eFeat[t.e1]} color={T.dn2} label={`e_ij (edge ${t.e1}, d=${e1.dist.toFixed(3)}Å)`} />
                <Vec v={gnn.eFeat[t.e2]} color={T.dn6} label={`e_ik (edge ${t.e2}, d=${e2.dist.toFixed(3)}Å)`} />
                <Vec v={m3.aFeat} color={T.dn5} label={`a(cos θ = ${t.cosT.toFixed(4)}) angular`} />
                <div style={{ fontSize: 11, color: T.muted }}>Total: 3+4+4+4 = <span style={{ color: T.dn3 }}>15-dim</span></div>
              </Card>
            </div>

            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Step 2: W3 × input + b3 → 6-dim raw" color={T.dn5}>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  The weight matrix <span style={{ color: T.dn5 }}>W3</span> has <span style={{ color: T.dn5 }}>6 rows</span>, each with 15 values.
                  Each row is like a "detector" — it dot-products with the 15-dim input to produce one number.
                </div>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  The 6 outputs are split into two groups of 3:
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, padding: "6px 10px", background: `${T.dn4}11`, border: `1px solid ${T.dn4}33`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 2 }}>Row 0–2 → gate[0,1,2]</div>
                    <div style={{ fontSize: 10, color: T.muted }}>These 3 values will go through sigmoid (0 to 1) in Step 3 to control how much signal passes</div>
                  </div>
                  <div style={{ flex: 1, padding: "6px 10px", background: `${T.dn6}11`, border: `1px solid ${T.dn6}33`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: T.dn6, fontWeight: 700, marginBottom: 2 }}>Row 3–5 → core[0,1,2]</div>
                    <div style={{ fontSize: 10, color: T.muted }}>These 3 values will go through softplus (always positive) in Step 3 as the actual message content</div>
                  </div>
                </div>
                {/* === Matrix multiplication dimension visual === */}
                <div style={{ background: `${T.dn5}08`, border: `1px solid ${T.dn5}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: T.dn5, fontWeight: 700, marginBottom: 6 }}>How does a (6×15) matrix multiply a (1×15) input?</div>
                  <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginBottom: 8 }}>
                    The input looks like a row <span style={{ color: T.muted }}>[x₀, x₁, … x₁₄]</span> but for multiplication we treat it as a <b>column vector (15×1)</b>:
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    {/* W3 matrix */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn5, marginBottom: 2 }}>W3 (6×15)</div>
                      <div style={{ border: `1px solid ${T.dn5}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div style={{ color: T.dn4 }}>[ w₀₀ w₀₁ … w₀,₁₄ ]</div>
                        <div style={{ color: T.dn4 }}>[ w₁₀ w₁₁ … w₁,₁₄ ]</div>
                        <div style={{ color: T.dn4 }}>[ w₂₀ w₂₁ … w₂,₁₄ ]</div>
                        <div style={{ color: T.muted, fontSize: 8 }}>──────────────────</div>
                        <div style={{ color: T.dn6 }}>[ w₃₀ w₃₁ … w₃,₁₄ ]</div>
                        <div style={{ color: T.dn6 }}>[ w₄₀ w₄₁ … w₄,₁₄ ]</div>
                        <div style={{ color: T.dn6 }}>[ w₅₀ w₅₁ … w₅,₁₄ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>×</div>
                    {/* Input column vector */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>input (15×1)</div>
                      <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div>[ x₀  ]</div>
                        <div>[ x₁  ]</div>
                        <div>[ ⋮   ]</div>
                        <div>[ x₁₄ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>+</div>
                    {/* Bias */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.muted, marginBottom: 2 }}>b3 (6×1)</div>
                      <div style={{ border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div>[ b₀ ]</div>
                        <div>[ b₁ ]</div>
                        <div>[ ⋮  ]</div>
                        <div>[ b₅ ]</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, color: T.muted }}>=</div>
                    {/* Output */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>raw (6×1)</div>
                      <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 6px", fontFamily: "monospace", fontSize: 10, lineHeight: 1.5 }}>
                        <div style={{ color: T.dn4 }}>[ gate₀ ]</div>
                        <div style={{ color: T.dn4 }}>[ gate₁ ]</div>
                        <div style={{ color: T.dn4 }}>[ gate₂ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₀ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₁ ]</div>
                        <div style={{ color: T.dn6 }}>[ core₂ ]</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7, background: `${T.bg}88`, borderRadius: 4, padding: "6px 8px" }}>
                    <b>Example — row 0:</b> raw[0] = w₀₀×x₀ + w₀₁×x₁ + w₀₂×x₂ + … + w₀,₁₄×x₁₄ + b₀<br/>
                    The <span style={{ color: T.dn5 }}>15 in the inner dimension</span> must match: W3 has 15 columns, input has 15 rows → they "zip together" into a dot product.<br/>
                    Result: <span style={{ color: T.dn5 }}>(6×<span style={{ textDecoration: "underline" }}>15</span>) × (<span style={{ textDecoration: "underline" }}>15</span>×1) → (6×1)</span> — the 15s cancel, leaving 6 outputs.
                  </div>
                </div>

                <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>
                  W3 shape: [6, 15], b3 shape: [6]. Formula: <span style={{ color: T.dn5 }}>raw[i] = W3[i][0]×input[0] + W3[i][1]×input[1] + … + W3[i][14]×input[14] + b3[i]</span>
                </div>
                <table style={{ fontSize: 11, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
                  <thead><tr style={{ color: T.muted }}>
                    <th style={{ padding: "3px 6px", textAlign: "left", borderBottom: `1px solid ${T.border}` }}>row</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>W3·input</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>+ bias</th>
                    <th style={{ padding: "3px 6px", textAlign: "right", borderBottom: `1px solid ${T.border}` }}>= raw</th>
                  </tr></thead>
                  <tbody>
                    {m3.raw.map((v, r) => {
                      const dotP = W3[r].reduce((s, w, j) => s + w * m3.input[j], 0);
                      return (
                        <tr key={r} style={{ background: r === 3 ? `${T.border}33` : "transparent" }}>
                          <td style={{ padding: "3px 6px", color: r < 3 ? T.dn4 : T.dn6 }}>{r < 3 ? "gate" : "core"}[{r % 3}]</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.ink }}>{dotP.toFixed(4)}</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.muted }}>{b3[r] >= 0 ? "+" : ""}{b3[r].toFixed(2)}</td>
                          <td style={{ padding: "3px 6px", textAlign: "right", color: T.dn3, fontWeight: 700 }}>{v.toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Vec v={m3.raw} color={T.dn5} label="raw output (6-dim):" />
              </Card>

              <Card title="Step 3: Split → sigmoid(gate) ⊙ softplus(core)" color={T.dn4}>
                {/* === Why sigmoid & softplus explanation === */}
                <div style={{ background: `${T.dn4}08`, border: `1px solid ${T.dn4}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 6 }}>Why sigmoid for gate? Why softplus for core?</div>
                  <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                    The raw 6 numbers from Step 2 can be anything (negative, zero, large positive). We need to <b>reshape</b> them
                    so they have the right meaning for the network. The choice depends on the <b>role</b> each value plays:
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <div style={{ flex: 1, padding: "8px 10px", background: `${T.dn4}11`, border: `1px solid ${T.dn4}33`, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>Gate → sigmoid</div>
                      <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7 }}>
                        <b>Role:</b> A "dimmer switch" — controls how much signal passes (0% to 100%).<br/>
                        <b>Why sigmoid?</b> squashes any number into <span style={{ color: T.dn4 }}>(0, 1)</span>:<br/>
                        • Very negative → ≈ 0 (gate closed)<br/>
                        • Zero → 0.5 (half open)<br/>
                        • Very positive → ≈ 1 (gate open)<br/>
                        <b>Formula:</b> σ(x) = 1 / (1 + e⁻ˣ)
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: "8px 10px", background: `${T.dn6}11`, border: `1px solid ${T.dn6}33`, borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: T.dn6, fontWeight: 700, marginBottom: 4 }}>Core → softplus</div>
                      <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7 }}>
                        <b>Role:</b> The actual message magnitude — how strong is the interaction?<br/>
                        <b>Why softplus?</b> ensures output is always <span style={{ color: T.dn6 }}>positive (≥ 0)</span>:<br/>
                        • Very negative → ≈ 0 (weak)<br/>
                        • Zero → 0.693 (= ln2)<br/>
                        • Positive → ≈ input itself<br/>
                        <b>Formula:</b> softplus(x) = ln(1 + eˣ)
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7, background: `${T.bg}88`, borderRadius: 4, padding: "6px 8px" }}>
                    <b>Together:</b> msg = <span style={{ color: T.dn4 }}>gate</span> ⊙ <span style={{ color: T.dn6 }}>core</span> =
                    (0-to-1 switch) × (positive magnitude). The gate decides <i>whether</i> to send, the core decides <i>how strong</i>.
                    This is a <b>"gated activation"</b> — selective pass/block on each dimension independently.
                  </div>
                </div>

                <div style={{ fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: T.dn4 }}>Gate (first 3):</span> control how much passes through
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`sigmoid(${m3.raw[i].toFixed(4)})`} result={m3.gate[i].toFixed(4)} color={T.dn4} />
                ))}
                <Vec v={m3.gate} color={T.dn4} label="gate (range 0 to 1):" />

                <div style={{ fontSize: 12, marginTop: 10, marginBottom: 8 }}>
                  <span style={{ color: T.dn6 }}>Core (last 3):</span> the actual message content
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`softplus(${m3.raw[i + 3].toFixed(4)})`} result={m3.core[i].toFixed(4)} color={T.dn6} />
                ))}
                <Vec v={m3.core} color={T.dn6} label="core (always positive):" />
              </Card>

              <Card title="Step 4: Product cutoff (2 edges!)" color={T.dn6}>
                <MR label="w(d_ij):" eq={`w(${e1.dist.toFixed(3)}) = ${cutoffFn(e1.dist).toFixed(4)}`} />
                <MR label="w(d_ik):" eq={`w(${e2.dist.toFixed(3)}) = ${cutoffFn(e2.dist).toFixed(4)}`} />
                <MR label="w_triplet:" eq={`${cutoffFn(e1.dist).toFixed(4)} × ${cutoffFn(e2.dist).toFixed(4)}`}
                  result={m3.w.toFixed(4)} color={T.dn6} />
              </Card>

              <Card title="Step 5: msg = gate ⊙ core × w_triplet" color={T.dn3}>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`${m3.gate[i].toFixed(4)} × ${m3.core[i].toFixed(4)} × ${m3.w.toFixed(4)}`}
                    result={m3.msg[i].toFixed(4)} color={T.dn3} />
                ))}
                <Vec v={m3.msg} color={T.dn3} label="3-body message:" />
              </Card>

              <Card title="Step 6: After scatter_add → h''_i" color={T.dn2}>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
                  All 3-body messages to atom {t.center} ({atoms[t.center].sym}) are summed, added to h', then softplus:
                </div>
                <Vec v={gnn.h2[t.center]} color={T.dn2} label={`h''[${t.center}] = softplus(h' + Σ 3-body msgs)`} />
              </Card>
            </div>
          </>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 7: PREDICTIONS — Energy, Forces, Stress
// ═══════════════════════════════════════════════════════════════════════
function SecPredict({ atoms, gnn, mol }) {
  const [tab, setTab] = useState("energy");
  const N = atoms.length;

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 100%", display: "flex", gap: 6, marginBottom: 4 }}>
        {["energy", "forces", "stress", "batch"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 12, cursor: "pointer", textTransform: "capitalize",
            background: tab === t ? `${T.dn3}22` : T.panel,
            border: `1px solid ${tab === t ? T.dn3 : T.border}`,
            color: tab === t ? T.dn3 : T.muted, fontFamily: "inherit",
          }}>{t}</button>
        ))}
      </div>

      {tab === "energy" && (
        <>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Energy readout: E = Σ MLP(h''_i)" color={T.dn3}>
              {/* === What is this step? === */}
              <div style={{ background: `${T.dn3}08`, border: `1px solid ${T.dn3}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 6 }}>What is "Energy Readout"?</div>
                <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  After all the message passing (2-body + 3-body), each atom has a final feature vector <b>h''_i</b> with 3 numbers.
                  These 3 numbers encode everything the network has learned about that atom's local environment.
                  But we need a <b>single energy number</b> per atom — so we need to convert 3 numbers → 1 number.
                </div>
                <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 6 }}>What is Linear(3→1)?</div>
                <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                  "Linear(3→1)" means a matrix multiplication that takes <b>3 inputs</b> and produces <b>1 output</b>.
                  It's the simplest possible neural network layer — just a weighted sum + bias:
                </div>

                {/* Dimension visual */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 10, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>W_energy (1×3)</div>
                    <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 8px", fontFamily: "monospace", fontSize: 11 }}>
                      <span style={{ color: T.dn3 }}>[ {We[0][0]}  {We[0][1]}  {We[0][2]} ]</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: T.muted }}>×</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: T.dn2, marginBottom: 2 }}>h''_i (3×1)</div>
                    <div style={{ border: `1px solid ${T.dn2}44`, borderRadius: 4, padding: "4px 8px", fontFamily: "monospace", fontSize: 11, lineHeight: 1.5 }}>
                      <div>[ h₀ ]</div>
                      <div>[ h₁ ]</div>
                      <div>[ h₂ ]</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: T.muted }}>+</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: T.muted, marginBottom: 2 }}>bias</div>
                    <div style={{ border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 8px", fontFamily: "monospace", fontSize: 11 }}>
                      <span>{be[0]}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: T.muted }}>=</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: T.dn3, marginBottom: 2 }}>e_i (scalar)</div>
                    <div style={{ border: `1px solid ${T.dn3}44`, borderRadius: 4, padding: "4px 8px", fontFamily: "monospace", fontSize: 11, color: T.dn3, fontWeight: 700 }}>
                      one number
                    </div>
                  </div>
                </div>

                {/* What do the weights mean? */}
                <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 6 }}>What do the 3 weights mean?</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <div style={{ flex: 1, padding: "6px 8px", background: `${T.dn3}11`, border: `1px solid ${T.dn3}22`, borderRadius: 6, fontSize: 10, lineHeight: 1.7 }}>
                    <div style={{ color: T.dn3, fontWeight: 700 }}>W[0] = {We[0][0]}</div>
                    <div style={{ color: T.ink }}>Dimension 0 of h'' contributes <b>positively</b> to energy (weight is positive → higher h₀ = higher energy)</div>
                  </div>
                  <div style={{ flex: 1, padding: "6px 8px", background: `${T.dn3}11`, border: `1px solid ${T.dn3}22`, borderRadius: 6, fontSize: 10, lineHeight: 1.7 }}>
                    <div style={{ color: T.dn3, fontWeight: 700 }}>W[1] = {We[0][1]}</div>
                    <div style={{ color: T.ink }}>Dimension 1 contributes <b>negatively</b> (weight is negative → higher h₁ = lower energy)</div>
                  </div>
                  <div style={{ flex: 1, padding: "6px 8px", background: `${T.dn3}11`, border: `1px solid ${T.dn3}22`, borderRadius: 6, fontSize: 10, lineHeight: 1.7 }}>
                    <div style={{ color: T.dn3, fontWeight: 700 }}>W[2] = {We[0][2]}</div>
                    <div style={{ color: T.ink }}>Dimension 2 contributes <b>positively</b> to energy</div>
                  </div>
                </div>

                {/* Formula */}
                <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.7, background: `${T.bg}88`, borderRadius: 4, padding: "6px 8px" }}>
                  <b>Formula for each atom:</b> e_i = <span style={{ color: T.dn3 }}>{We[0][0]}</span>×h₀ + <span style={{ color: T.dn3 }}>({We[0][1]})</span>×h₁ + <span style={{ color: T.dn3 }}>{We[0][2]}</span>×h₂ + <span style={{ color: T.muted }}>({be[0]})</span><br/>
                  <b>Then sum all atoms:</b> E_total = e₀ + e₁ + e₂ + … — each atom contributes its own piece of the total energy.<br/>
                  <b>Dimension rule:</b> <span style={{ color: T.dn3 }}>(1×<span style={{ textDecoration: "underline" }}>3</span>) × (<span style={{ textDecoration: "underline" }}>3</span>×1) → (1×1)</span> — the 3s cancel, leaving 1 scalar per atom.
                </div>
              </div>

              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                Now let's compute e_i for each atom:
              </div>
              <div style={{ fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>
                <span style={{ color: T.muted }}>W_energy = </span><span style={{ color: T.dn3 }}>[{We[0].join(", ")}]</span>
                <span style={{ color: T.muted }}> b = </span><span style={{ color: T.dn3 }}>{be[0]}</span>
              </div>
              {atoms.map((a, i) => {
                const h = gnn.h2[i];
                return (
                  <div key={i} style={{ marginBottom: 8, padding: "6px 8px", background: `${T.panel}`, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 4 }}>Atom {i} ({a.sym})</div>
                    <Vec v={h} color={T.dn2} label="h''_i:" />
                    <div style={{ fontSize: 10, fontFamily: "monospace" }}>
                      <span style={{ color: T.muted }}>e_i = </span>
                      {We[0].map((w, j) => <span key={j} style={{ color: T.ink }}>{j > 0 ? " + " : ""}<span style={{ color: T.dn3 }}>{w.toFixed(2)}</span>×<span style={{ color: T.dn2 }}>{h[j].toFixed(4)}</span></span>)}
                      <span style={{ color: T.muted }}> + ({be[0]}) = </span>
                      <span style={{ color: T.dn3, fontWeight: 700 }}>{gnn.rawE[i].toFixed(4)}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Raw → Scaled Energies" color={T.dn2}>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                Raw sum is scaled to match DFT reference:
              </div>
              <MR label="Raw total:" eq={gnn.rawE.reduce((s, v) => s + v, 0).toFixed(4)} />
              <MR label="DFT ref:" eq={`${mol.refEnergy} eV`} />
              <MR label="Scale:" eq={gnn.scale.toFixed(4)} />
              <div style={{ height: 10 }} />
              {atoms.map((a, i) => (
                <MR key={i} label={`${a.sym}(${i}):`} eq={`${gnn.rawE[i].toFixed(4)} × ${gnn.scale.toFixed(4)}`}
                  result={`${gnn.atomE[i].toFixed(4)} eV`} color={T.dn3} />
              ))}
              <div style={{ marginTop: 12, padding: "10px 12px", background: `${T.dn3}11`, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.muted }}>Total predicted energy</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: T.dn3, fontFamily: "monospace" }}>
                  {gnn.totalE.toFixed(4)} eV
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>= {(gnn.totalE / N).toFixed(4)} eV/atom</div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "forces" && (
        <>
          {/* ═══ PART 1: What IS a gradient? ═══ */}
          <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="What IS a gradient? — The key idea" color={T.dn4}>
              <div style={{ fontSize: 13, color: T.dn4, fontWeight: 800, marginBottom: 8 }}>
                F = −∂E/∂r means: "Force = negative rate of energy change when you nudge the atom"
              </div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 2.0, marginBottom: 10 }}>
                A <b>gradient</b> answers one question: <b>"If I nudge this atom slightly, how much does the total energy change?"</b>
              </div>

              {/* Concrete numerical example */}
              <div style={{ background: T.surface, borderRadius: 8, padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, color: T.dn4, fontWeight: 700, marginBottom: 8 }}>Concrete Example: Nudge the O atom in H₂O</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.4, color: T.ink }}>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>1.</span> O sits at position r = [0.000, 0.000, 0.000]</div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>2.</span> Run the full GNN forward pass → E = <span style={{ color: T.dn3, fontWeight: 700 }}>−14.2700 eV</span></div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>3.</span> Nudge O right by tiny Δx = 0.001 Å → r = [<span style={{ color: T.dn4 }}>0.001</span>, 0.000, 0.000]</div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>4.</span> Run the full GNN again → E = <span style={{ color: T.dn3, fontWeight: 700 }}>−14.2680 eV</span></div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>5.</span> <b>Gradient</b> = ΔE / Δx = (−14.2680 − (−14.2700)) / 0.001 = <span style={{ color: T.dn4, fontWeight: 800 }}>+2.0 eV/Å</span></div>
                  <div style={{ paddingLeft: 20, color: T.muted, fontSize: 11 }}>↑ Energy went UP when we nudged right → gradient is positive in x</div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>6.</span> <b>Force</b> = −gradient = <span style={{ color: T.dn3, fontWeight: 800 }}>−2.0 eV/Å</span> (pushes atom LEFT, toward lower energy)</div>
                </div>
              </div>

              {/* The 3D gradient vector */}
              <div style={{ background: `${T.dn4}08`, border: `1px solid ${T.dn4}22`, borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.dn4, fontWeight: 700, marginBottom: 6 }}>The gradient is a 3D vector (one number per direction):</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2.2, color: T.ink, textAlign: "center" }}>
                  <div>∂E/∂r<sub>i</sub> = [ <span style={{ color: T.dn4 }}>∂E/∂x<sub>i</sub></span> , <span style={{ color: T.dn3 }}>∂E/∂y<sub>i</sub></span> , <span style={{ color: T.dn5 }}>∂E/∂z<sub>i</sub></span> ]</div>
                  <div style={{ fontSize: 10, color: T.muted }}>nudge in x → how much E changes  |  nudge in y  |  nudge in z</div>
                  <div style={{ marginTop: 8 }}>F<sub>i</sub> = <span style={{ color: T.dn4, fontWeight: 800 }}>−</span>∂E/∂r<sub>i</sub> = [ −∂E/∂x , −∂E/∂y , −∂E/∂z ]</div>
                  <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700 }}>Force points DOWNHILL in energy — toward the nearest energy minimum</div>
                </div>
              </div>

              {/* Why negative? */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                {[
                  { scenario: "Gradient positive (+)", meaning: "Energy increases when atom moves right", force: "Force pushes LEFT (−)", color: T.dn4 },
                  { scenario: "Gradient negative (−)", meaning: "Energy decreases when atom moves right", force: "Force pushes RIGHT (+)", color: T.dn3 },
                  { scenario: "Gradient ≈ 0", meaning: "Energy doesn't change (at minimum)", force: "No force — equilibrium!", color: T.dn2 },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "8px 10px", background: `${item.color}08`, border: `1px solid ${item.color}22`, borderRadius: 8, fontSize: 11, lineHeight: 1.7 }}>
                    <div style={{ color: item.color, fontWeight: 700, marginBottom: 4 }}>{item.scenario}</div>
                    <div style={{ color: T.ink }}>{item.meaning}</div>
                    <div style={{ color: item.color, fontWeight: 600, marginTop: 4 }}>{item.force}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ═══ PART 2: How autograd computes the gradient ═══ */}
          <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="How PyTorch computes ∂E/∂r — Automatic Differentiation" color={T.dn5}>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 10 }}>
                The "nudge and recompute" method above works conceptually but is <b>way too slow</b> — you'd need
                3 extra GNN forward passes per atom (one per x, y, z). For 64 atoms = 192 extra forward passes!
                PyTorch uses the <b>chain rule</b> to compute the exact gradient in <b>one backward pass</b>:
              </div>

              {/* Forward chain */}
              <div style={{ fontSize: 11, color: T.dn5, fontWeight: 700, marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>Forward pass: positions → energy</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {[
                  { label: "r_i", desc: "positions", color: T.dn4 },
                  { label: "d_ij", desc: "distances", color: T.dn2 },
                  { label: "G(d)", desc: "Gaussians", color: T.dn2 },
                  { label: "m_ij", desc: "messages", color: T.dn4 },
                  { label: "h_i", desc: "features", color: T.dn5 },
                  { label: "E", desc: "energy", color: T.dn3 },
                ].map((s, i, arr) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ padding: "5px 10px", background: `${s.color}11`, border: `1.5px solid ${s.color}44`, borderRadius: 8, fontSize: 11, color: s.color, fontWeight: 700, textAlign: "center" }}>
                      <div style={{ fontFamily: "monospace" }}>{s.label}</div>
                      <div style={{ fontSize: 9, fontWeight: 400, color: T.muted }}>{s.desc}</div>
                    </span>
                    {i < arr.length - 1 && <span style={{ color: T.dn5, fontSize: 16, fontWeight: 800 }}>→</span>}
                  </span>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: T.muted, marginBottom: 14 }}>
                Each arrow is a differentiable operation — PyTorch records every step
              </div>

              {/* Backward chain */}
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>Backward pass (chain rule): gradient flows back</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {[
                  { label: "∂E/∂r", desc: "= FORCE!", color: T.dn4 },
                  { label: "∂d/∂r", desc: "= −r̂_ij", color: T.dn2 },
                  { label: "∂G/∂d", desc: "Gauss deriv", color: T.dn2 },
                  { label: "∂m/∂G", desc: "msg deriv", color: T.dn4 },
                  { label: "∂h/∂m", desc: "aggr deriv", color: T.dn5 },
                  { label: "∂E/∂h", desc: "= W_energy", color: T.dn3 },
                ].map((s, i, arr) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ padding: "5px 10px", background: `${s.color}11`, border: `1.5px solid ${s.color}44`, borderRadius: 8, fontSize: 11, color: s.color, fontWeight: 700, textAlign: "center" }}>
                      <div style={{ fontFamily: "monospace" }}>{s.label}</div>
                      <div style={{ fontSize: 9, fontWeight: 400, color: T.muted }}>{s.desc}</div>
                    </span>
                    {i < arr.length - 1 && <span style={{ color: T.dn4, fontSize: 16, fontWeight: 800 }}>←</span>}
                  </span>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: T.muted, marginBottom: 14 }}>
                Multiply partial derivatives backward through the chain: ∂E/∂r = ∂E/∂h × ∂h/∂m × ∂m/∂G × ∂G/∂d × ∂d/∂r
              </div>

              {/* Chain rule math */}
              <div style={{ fontFamily: "monospace", fontSize: 12, color: T.ink, background: T.surface, borderRadius: 8, padding: "10px 14px", lineHeight: 2.0, marginBottom: 10 }}>
                <div style={{ color: T.dn5, fontWeight: 700, marginBottom: 4 }}>The chain rule in one equation:</div>
                <div>∂E/∂r<sub>i</sub> = Σ<sub>j</sub> <span style={{ color: T.dn3 }}>∂E/∂h</span> × <span style={{ color: T.dn5 }}>∂h/∂m<sub>ij</sub></span> × <span style={{ color: T.dn2 }}>∂m<sub>ij</sub>/∂d<sub>ij</sub></span> × <span style={{ color: T.dn4 }}>∂d<sub>ij</sub>/∂r<sub>i</sub></span></div>
                <div style={{ marginTop: 8, color: T.muted, fontSize: 10 }}>Key identity: ∂d_ij/∂r_i = −r̂_ij (moving atom i changes its distance to every neighbor j)</div>
                <div style={{ color: T.muted, fontSize: 10 }}>Each other partial derivative comes from the GNN layers (linear layers, softplus, sigmoid, etc.)</div>
              </div>

              <div style={{ fontSize: 12, color: T.dn2, fontWeight: 700, padding: "8px 12px", background: `${T.dn2}08`, borderRadius: 8, border: `1px solid ${T.dn2}22` }}>
                One backward pass gives exact gradients for ALL atoms simultaneously — no approximations!
              </div>
            </Card>
          </div>

          {/* ═══ PART 3: Computed force values + force sum ═══ */}
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Computed forces for each atom" color={T.dn4}>
              {atoms.map((a, i) => {
                const f = gnn.forces[i];
                const mag = Math.sqrt(f[0] ** 2 + f[1] ** 2 + f[2] ** 2);
                return (
                  <div key={i} style={{ marginBottom: 10, padding: "6px 8px", background: `${T.panel}`, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 4 }}>
                      Atom {i} ({a.sym}) at [{a.pos.map(v => v.toFixed(3)).join(", ")}]
                    </div>
                    <Vec v={f} color={T.dn4} label="F_i (eV/Å):" />
                    <MR label="|F|:" eq={mag.toFixed(6)} result="eV/Å" color={T.dn2} />
                  </div>
                );
              })}
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Force sum (should be ~0)" color={T.dn6}>
              <MR label="ΣFx:" eq={gnn.forces.reduce((s, f) => s + f[0], 0).toFixed(6)} />
              <MR label="ΣFy:" eq={gnn.forces.reduce((s, f) => s + f[1], 0).toFixed(6)} />
              <MR label="ΣFz:" eq={gnn.forces.reduce((s, f) => s + f[2], 0).toFixed(6)} />
              <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>
                Newton's 3rd law: total force on the system should be zero.
              </div>
            </Card>
            <Card title="What autograd computes internally" color={T.dn5}>
              <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 2.2, color: T.ink, background: T.surface, borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ color: T.dn5, fontWeight: 700 }}>For each atom i, direction k:</div>
                <div>&nbsp;</div>
                <div>∂E/∂r<sub>i,k</sub> = Σ<sub>j</sub> ∂E/∂d<sub>ij</sub> × ∂d<sub>ij</sub>/∂r<sub>i,k</sub></div>
                <div>&nbsp;</div>
                <div style={{ color: T.muted }}>where:</div>
                <div>∂d<sub>ij</sub>/∂r<sub>i,k</sub> = −(r<sub>j,k</sub> − r<sub>i,k</sub>) / d<sub>ij</sub> = <span style={{ color: T.dn4, fontWeight: 700 }}>−r̂<sub>ij,k</sub></span></div>
                <div>&nbsp;</div>
                <div style={{ color: T.muted }}>so the force on atom i is:</div>
                <div>F<sub>i,k</sub> = −∂E/∂r<sub>i,k</sub> = Σ<sub>j</sub> (<span style={{ color: T.dn3 }}>∂E/∂d<sub>ij</sub></span>) × <span style={{ color: T.dn4 }}>r̂<sub>ij,k</sub></span></div>
                <div>&nbsp;</div>
                <div style={{ color: T.muted, fontSize: 10 }}>∂E/∂d_ij encodes how strongly the energy depends</div>
                <div style={{ color: T.muted, fontSize: 10 }}>on each bond length — this is what the GNN learns.</div>
                <div style={{ color: T.muted, fontSize: 10 }}>r̂_ij gives the direction — purely geometric.</div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "stress" && (
        <>
          {/* ═══ PART 1: What IS stress and strain? ═══ */}
          <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="What IS stress? — Force vs Stress" color={T.dn5}>
              <div style={{ fontSize: 13, color: T.dn5, fontWeight: 800, marginBottom: 8 }}>
                σ = (1/V) × ∂E/∂ε — "How does energy change when you deform the cell?"
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <div style={{ flex: "1 1 280px", padding: "12px 14px", background: `${T.dn4}08`, border: `2px solid ${T.dn4}33`, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: T.dn4, fontWeight: 700, marginBottom: 6 }}>Force (F = −∂E/∂r)</div>
                  <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
                    "If I nudge <b>one atom</b>, how does energy change?"<br/>
                    Answer: a 3D vector per atom (N × 3)
                  </div>
                </div>
                <div style={{ flex: "1 1 280px", padding: "12px 14px", background: `${T.dn5}08`, border: `2px solid ${T.dn5}33`, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: T.dn5, fontWeight: 700, marginBottom: 6 }}>Stress (σ = (1/V) ∂E/∂ε)</div>
                  <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
                    "If I stretch/squeeze <b>the entire cell</b>, how does energy change?"<br/>
                    Answer: a 3×3 matrix per structure
                  </div>
                </div>
              </div>

              {/* Strain concept */}
              <div style={{ background: T.surface, borderRadius: 8, padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, color: T.dn5, fontWeight: 700, marginBottom: 8 }}>What is Strain (ε)?</div>
                <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 10 }}>
                  <b>Strain</b> is a 3×3 matrix that describes how you deform the simulation cell.
                  Each entry ε<sub>αβ</sub> is a tiny number (like 0.001) representing a stretch or shear.
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.0, color: T.ink, textAlign: "center", marginBottom: 8 }}>
                  <div>ε = [ ε<sub>xx</sub>  ε<sub>xy</sub>  ε<sub>xz</sub> ]</div>
                  <div>{"    "}[ ε<sub>yx</sub>  ε<sub>yy</sub>  ε<sub>yz</sub> ]</div>
                  <div>{"    "}[ ε<sub>zx</sub>  ε<sub>zy</sub>  ε<sub>zz</sub> ]</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ padding: "6px 10px", background: `${T.dn5}08`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ color: T.dn5, fontWeight: 700 }}>ε<sub>xx</sub> = 0.01</span> → stretch x by 1%
                  </div>
                  <div style={{ padding: "6px 10px", background: `${T.dn5}08`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ color: T.dn5, fontWeight: 700 }}>ε<sub>yy</sub> = −0.01</span> → compress y by 1%
                  </div>
                  <div style={{ padding: "6px 10px", background: `${T.dn2}08`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ color: T.dn2, fontWeight: 700 }}>ε<sub>xy</sub> = 0.01</span> → shear: x tilts toward y
                  </div>
                  <div style={{ padding: "6px 10px", background: `${T.dn2}08`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                    <span style={{ color: T.dn2, fontWeight: 700 }}>ε<sub>zx</sub> = 0.01</span> → shear: z tilts toward x
                  </div>
                </div>
              </div>

              {/* How strain deforms positions */}
              <div style={{ background: `${T.dn5}08`, border: `1px solid ${T.dn5}22`, borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: T.dn5, fontWeight: 700, marginBottom: 8 }}>Deformation: How strain changes ALL positions</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2.4, color: T.ink, textAlign: "center" }}>
                  <div><span style={{ color: T.dn5, fontWeight: 700 }}>D</span> = <span style={{ color: T.muted }}>I</span> + <span style={{ color: T.dn5 }}>ε</span>{"           "}<span style={{ color: T.muted, fontSize: 10 }}>deformation = identity + strain</span></div>
                  <div><span style={{ color: T.dn4, fontWeight: 700 }}>r'<sub>i</sub></span> = <span style={{ color: T.dn4 }}>r<sub>i</sub></span> · <span style={{ color: T.dn5 }}>D<sup>T</sup></span>{"       "}<span style={{ color: T.muted, fontSize: 10 }}>every atom position gets deformed</span></div>
                  <div><span style={{ color: T.dn2, fontWeight: 700 }}>offset'<sub>ij</sub></span> = <span style={{ color: T.dn2 }}>offset<sub>ij</sub></span> · <span style={{ color: T.dn5 }}>D<sup>T</sup></span>{"  "}<span style={{ color: T.muted, fontSize: 10 }}>periodic boundary offsets too!</span></div>
                </div>
                <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginTop: 8, textAlign: "center" }}>
                  If ε<sub>xx</sub> = 0.01: all x-coordinates grow by 1%. All distances change → energy changes → that change IS stress.
                </div>
              </div>
            </Card>
          </div>

          {/* ═══ PART 2: 3×3 matrix meaning ═══ */}
          <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="What each entry in the 3×3 stress matrix means" color={T.dn5}>
              <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, color: T.ink, background: T.surface, borderRadius: 8, padding: "10px 14px", marginBottom: 10, textAlign: "center" }}>
                <div style={{ marginBottom: 4, color: T.dn5, fontWeight: 700 }}>{"          Force direction →"}</div>
                <div>{"           Fx       Fy       Fz"}</div>
                <div>{"        ┌────────┬────────┬────────┐"}</div>
                <div>{"   x    │  σ_xx  │  σ_xy  │  σ_xz  │  ← tension/compression in x + shear"}</div>
                <div>{"   y    │  σ_yx  │  σ_yy  │  σ_yz  │"}</div>
                <div>{"   z    │  σ_zx  │  σ_zy  │  σ_zz  │"}</div>
                <div>{"        └────────┴────────┴────────┘"}</div>
                <div style={{ marginTop: 4, color: T.muted }}>{"   ↑ plane normal"}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ padding: "8px 10px", background: `${T.dn5}08`, border: `1px solid ${T.dn5}22`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                  <span style={{ color: T.dn5, fontWeight: 700 }}>Diagonal (σ<sub>xx</sub>, σ<sub>yy</sub>, σ<sub>zz</sub>)</span><br/>
                  Normal stress — compression or tension along each axis
                </div>
                <div style={{ padding: "8px 10px", background: `${T.dn2}08`, border: `1px solid ${T.dn2}22`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                  <span style={{ color: T.dn2, fontWeight: 700 }}>Off-diagonal (σ<sub>xy</sub>, σ<sub>xz</sub>, ...)</span><br/>
                  Shear stress — forces sliding atomic planes past each other
                </div>
                <div style={{ padding: "8px 10px", background: `${T.dn3}08`, border: `1px solid ${T.dn3}22`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                  <span style={{ color: T.dn3, fontWeight: 700 }}>P = −tr(σ)/3</span><br/>
                  Pressure = negative average of the 3 diagonal terms
                </div>
                <div style={{ padding: "8px 10px", background: `${T.dn4}08`, border: `1px solid ${T.dn4}22`, borderRadius: 6, fontSize: 11, lineHeight: 1.7 }}>
                  <span style={{ color: T.dn4, fontWeight: 700 }}>Units: eV/ų × 160.2 = GPa</span><br/>
                  1602.2 to convert to kBar (VASP convention)
                </div>
              </div>
            </Card>
          </div>

          {/* ═══ PART 4: Computed stress values ═══ */}
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="3×3 Stress Matrix (GPa) — Demo" color={T.dn2}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 8 }}>Computed using virial approximation (σ = (1/V) Σ r × f) for this demo</div>
              <div style={{ fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
                {gnn.stressGPa.map((row, r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: T.dim }}>{r === 0 ? "⌈" : r === 2 ? "⌊" : "│"}</span>
                    {row.map((v, c) => (
                      <span key={c} style={{ width: 90, textAlign: "right", color: v >= 0 ? T.dn3 : T.dn4 }}>
                        {v.toFixed(4)}
                      </span>
                    ))}
                    <span style={{ color: T.dim }}>{r === 0 ? "⌉" : r === 2 ? "⌋" : "│"}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: T.muted, marginTop: 8 }}>
                Rows/cols: x, y, z. Units: GPa (= eV/ų × 160.2)
              </div>
            </Card>
            <Card title="Physical intuition" color={T.dn5}>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 2.0 }}>
                <b>All diagonal negative</b> → material is under <b>compression</b>.<br />
                <b>All diagonal positive</b> → material is under <b>tension</b>.<br />
                <b>Large off-diagonal</b> → material is being <b>sheared</b>.<br />
                <b>All terms near zero</b> → material is at <b>equilibrium</b> (relaxed).<br />
                <b>Symmetric</b> (σ<sub>xy</sub> = σ<sub>yx</sub>) → angular momentum is conserved.
              </div>
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Pressure" color={T.dn3}>
              {(() => {
                const P = -(gnn.stressGPa[0][0] + gnn.stressGPa[1][1] + gnn.stressGPa[2][2]) / 3;
                return (
                  <>
                    <MR label="P = −tr(σ)/3:" eq={`−(${gnn.stressGPa[0][0].toFixed(4)} + ${gnn.stressGPa[1][1].toFixed(4)} + ${gnn.stressGPa[2][2].toFixed(4)})/3`} />
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.dn3, textAlign: "center", margin: "10px 0", fontFamily: "monospace" }}>
                      P = {P.toFixed(4)} GPa
                    </div>
                  </>
                );
              })()}
            </Card>
            <Card title="Voigt notation (VASP output)" color={T.dn2}>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
                VASP and ASE store stress as a 6-element vector (Voigt notation) instead of 3×3:
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 2.0, color: T.ink, background: T.surface, borderRadius: 6, padding: "8px 10px" }}>
                <div>stress_voigt = [σ<sub>xx</sub>, σ<sub>yy</sub>, σ<sub>zz</sub>, σ<sub>yz</sub>, σ<sub>xz</sub>, σ<sub>xy</sub>]</div>
                <div style={{ color: T.muted, fontSize: 10, marginTop: 4 }}>6 unique components (3×3 symmetric → 6 independent)</div>
                <div style={{ color: T.muted, fontSize: 10 }}>VASP convention: positive = compressive</div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 2.0, color: T.ink, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", marginTop: 8 }}>
                <div style={{ color: T.muted }}># DefectNet → VASP/ASE conversion:</div>
                <div style={{ color: T.ink }}>stress_voigt = [</div>
                <div style={{ color: T.ink }}>{"  "}s[0,0], s[1,1], s[2,2],  <span style={{ color: T.muted }}># xx, yy, zz</span></div>
                <div style={{ color: T.ink }}>{"  "}s[1,2], s[0,2], s[0,1],  <span style={{ color: T.muted }}># yz, xz, xy</span></div>
                <div style={{ color: T.ink }}>]</div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "batch" && (
        <BatchDemo />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// BATCH DEMO — H₂O + NH₃ through the full pipeline in one batch
// ═══════════════════════════════════════════════════════════════════════
function BatchDemo() {
  const molA = MOLECULES[0]; // H2O
  const molB = MOLECULES[1]; // NH3

  // Run the full pipeline for both
  const dataA = useMemo(() => {
    const edges = buildEdges(molA.atoms);
    const triplets = buildTriplets(edges, molA.atoms.length);
    const gnn = runGNN(molA.atoms, edges, triplets, molA);
    return { atoms: molA.atoms, edges, triplets, gnn };
  }, []);
  const dataB = useMemo(() => {
    const edges = buildEdges(molB.atoms);
    const triplets = buildTriplets(edges, molB.atoms.length);
    const gnn = runGNN(molB.atoms, edges, triplets, molB);
    return { atoms: molB.atoms, edges, triplets, gnn };
  }, []);

  const stepStyle = { background: T.surface, borderRadius: 6, padding: "8px 10px", marginBottom: 6, fontFamily: "monospace", fontSize: 11, lineHeight: 1.9, color: T.ink };
  const label = (c, t) => <span style={{ color: c, fontWeight: 700 }}>{t}</span>;
  const dim = t => <span style={{ color: T.muted }}>{t}</span>;

  // Combined batch indices
  const batchIdx = [
    ...molA.atoms.map((_, i) => ({ mol: "H₂O", molColor: T.dn4, atomIdx: i, batchId: 0 })),
    ...molB.atoms.map((_, i) => ({ mol: "NH₃", molColor: T.dn3, atomIdx: i, batchId: 1 })),
  ];

  return (
    <>
      <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* === Intro: What is batching? === */}
        <Card title="Batching: Processing Multiple Structures Together" color={T.dn1}>
          <div style={{ background: `${T.dn1}08`, border: `1px solid ${T.dn1}22`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: T.dn1, fontWeight: 700, marginBottom: 6 }}>Why batch?</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
              GPUs are massively parallel — they can do thousands of operations simultaneously.
              Processing one molecule at a time wastes most of this capacity. <b>Batching</b> packs
              multiple structures into a single "mega-graph" so the GPU stays busy on every cycle.
            </div>
            <div style={{ fontSize: 11, color: T.dn1, fontWeight: 700, marginBottom: 6 }}>The key idea: One big graph, with a batch index</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
              We don't run separate forward passes. Instead we <b>concatenate</b> all atoms into one flat list
              and all edges into one flat edge list, then use a <b>batch vector</b> to remember which atom belongs
              to which molecule. Edges never cross molecule boundaries — H₂O atoms only talk to H₂O atoms.
            </div>
          </div>

          {/* Visual: two graphs merging */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ textAlign: "center", padding: "10px 16px", border: `2px solid ${T.dn4}`, borderRadius: 10, background: `${T.dn4}08` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.dn4, marginBottom: 4 }}>H₂O</div>
              <div style={{ fontSize: 11, color: T.ink }}>{molA.atoms.length} atoms, {dataA.edges.length} edges</div>
              <div style={{ fontSize: 10, color: T.muted }}>indices 0–{molA.atoms.length - 1}</div>
            </div>
            <div style={{ fontSize: 20, color: T.dn1, fontWeight: 800 }}>+</div>
            <div style={{ textAlign: "center", padding: "10px 16px", border: `2px solid ${T.dn3}`, borderRadius: 10, background: `${T.dn3}08` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.dn3, marginBottom: 4 }}>NH₃</div>
              <div style={{ fontSize: 11, color: T.ink }}>{molB.atoms.length} atoms, {dataB.edges.length} edges</div>
              <div style={{ fontSize: 10, color: T.muted }}>indices 0–{molB.atoms.length - 1}</div>
            </div>
            <div style={{ fontSize: 20, color: T.dn1, fontWeight: 800 }}>=</div>
            <div style={{ textAlign: "center", padding: "10px 16px", border: `2px solid ${T.dn1}`, borderRadius: 10, background: `${T.dn1}08` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.dn1, marginBottom: 4 }}>Batched Graph</div>
              <div style={{ fontSize: 11, color: T.ink }}>{molA.atoms.length + molB.atoms.length} atoms, {dataA.edges.length + dataB.edges.length} edges</div>
              <div style={{ fontSize: 10, color: T.muted }}>indices 0–{molA.atoms.length + molB.atoms.length - 1}</div>
            </div>
          </div>
        </Card>

        {/* === Step 1: Batch Vector === */}
        <Card title="Step 1 — Build the Batch Vector" color={T.dn5} formula="batch[i] = which molecule does atom i belong to?">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            We concatenate all atoms into one flat list. The <b>batch vector</b> tracks ownership.
            NH₃ atom indices are <b>shifted</b> by +{molA.atoms.length} (the number of H₂O atoms) so they don't collide.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "40px 60px 80px 40px 60px", gap: "3px 8px", fontFamily: "monospace", fontSize: 11, marginBottom: 6 }}>
            <span style={{ color: T.muted, fontWeight: 700 }}>Idx</span>
            <span style={{ color: T.muted, fontWeight: 700 }}>Atom</span>
            <span style={{ color: T.muted, fontWeight: 700 }}>Original</span>
            <span style={{ color: T.muted, fontWeight: 700 }}>Batch</span>
            <span style={{ color: T.muted, fontWeight: 700 }}>Molecule</span>
            {batchIdx.map((b, gi) => {
              const origAtom = b.batchId === 0 ? molA.atoms[b.atomIdx] : molB.atoms[b.atomIdx];
              return [
                <span key={`i${gi}`} style={{ color: T.ink }}>{gi}</span>,
                <span key={`a${gi}`} style={{ color: ELEM_COLOR[origAtom.Z], fontWeight: 700 }}>{origAtom.sym}</span>,
                <span key={`o${gi}`} style={{ color: T.muted }}>{b.mol} atom {b.atomIdx}</span>,
                <span key={`b${gi}`} style={{ color: b.molColor, fontWeight: 700 }}>{b.batchId}</span>,
                <span key={`m${gi}`} style={{ color: b.molColor }}>{b.mol}</span>,
              ];
            })}
          </div>
          <div style={stepStyle}>
            batch = [{batchIdx.map(b => b.batchId).join(", ")}] {dim("← 0 = H₂O, 1 = NH₃")}
          </div>
        </Card>

        {/* === Step 2: Edge Index Remapping === */}
        <Card title="Step 2 — Remap Edges into Unified Index Space" color={T.dn2} formula="NH₃ edges: src += 3, dst += 3">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            H₂O edges keep their original indices (0–2). NH₃ edge indices are shifted by +{molA.atoms.length}
            so they point to the correct position in the concatenated atom list. <b>Edges never cross molecule boundaries.</b>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {/* H2O edges */}
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>H₂O edges (unchanged)</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.8, background: T.surface, borderRadius: 6, padding: "6px 8px" }}>
                {dataA.edges.slice(0, 6).map((e, i) => (
                  <div key={i}>edge {i}: {dataA.atoms[e.src].sym}({e.src}) → {dataA.atoms[e.dst].sym}({e.dst}) d={e.dist.toFixed(3)}Å</div>
                ))}
              </div>
            </div>
            {/* NH3 edges */}
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 4 }}>NH₃ edges (shifted +{molA.atoms.length})</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.8, background: T.surface, borderRadius: 6, padding: "6px 8px" }}>
                {dataB.edges.slice(0, 6).map((e, i) => (
                  <div key={i}>edge {i}: {dataB.atoms[e.src].sym}({e.src + molA.atoms.length}) → {dataB.atoms[e.dst].sym}({e.dst + molA.atoms.length}) d={e.dist.toFixed(3)}Å</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* === Step 3: Embedding === */}
        <Card title="Step 3 — Atom Embeddings (All 7 atoms at once)" color={T.dn5} formula="h⁰ = EmbeddingTable[Z]">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            The embedding lookup is <b>identical</b> whether we process 1 molecule or 100 — it's just an index lookup.
            The batch vector plays no role here. We simply embed all 7 atoms in parallel.
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, background: T.surface, borderRadius: 6, padding: "8px 10px" }}>
            {[...molA.atoms, ...molB.atoms].map((a, gi) => {
              const e = EMBED[a.Z];
              const bId = gi < molA.atoms.length ? 0 : 1;
              const molName = bId === 0 ? "H₂O" : "NH₃";
              const molColor = bId === 0 ? T.dn4 : T.dn3;
              return (
                <div key={gi}>
                  <span style={{ color: molColor }}>batch={bId}</span> atom {gi} ({label(ELEM_COLOR[a.Z], a.sym)}): h⁰ = [{e.map(v => v.toFixed(2)).join(", ")}]
                </div>
              );
            })}
          </div>
        </Card>

        {/* === Step 4: Message Passing === */}
        <Card title="Step 4 — Message Passing (Edges Stay Within Molecules)" color={T.dn4} formula="h¹_i = h⁰_i + Σ_j msg(h⁰_i, h⁰_j, e_ij)">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            This is where batching matters most. Each edge sends a message, but <b>edges only exist within the same molecule</b>.
            An H atom in H₂O will never send a message to an N atom in NH₃ — the edge list guarantees isolation.
            Yet all messages are computed in one big parallel matrix multiply on the GPU.
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>H₂O messages (2-body)</div>
              {dataA.gnn.msgs2.slice(0, 3).map((m, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3, padding: "3px 6px", background: `${T.dn4}08`, borderRadius: 4 }}>
                  edge {i}: msg = [{m.msg.map(v => v.toFixed(4)).join(", ")}]
                </div>
              ))}
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 4 }}>NH₃ messages (2-body)</div>
              {dataB.gnn.msgs2.slice(0, 3).map((m, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3, padding: "3px 6px", background: `${T.dn3}08`, borderRadius: 4 }}>
                  edge {i}: msg = [{m.msg.map(v => v.toFixed(4)).join(", ")}]
                </div>
              ))}
            </div>
          </div>
          <div style={stepStyle}>
            {dim("All ")} {dataA.edges.length + dataB.edges.length} {dim(" edges processed in one parallel operation. No cross-molecule leakage.")}
          </div>
        </Card>

        {/* === Step 5: Per-atom Energy === */}
        <Card title="Step 5 — Energy Readout (Per-Atom, Then Scatter-Add by Batch)" color={T.dn3} formula="E_mol = Σ_{i ∈ mol} MLP(h''_i)">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            The MLP computes one energy per atom for all 7 atoms at once. Then we use the <b>batch vector</b>
            to sum atom energies into per-molecule totals. This is called <b>scatter-add</b> (or segment-sum):
            group atoms by their batch index, then sum within each group.
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {/* H2O energies */}
            <div style={{ flex: "1 1 200px", padding: "8px 10px", border: `2px solid ${T.dn4}`, borderRadius: 8, background: `${T.dn4}06` }}>
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 6 }}>H₂O (batch=0)</div>
              {dataA.atoms.map((a, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 11, marginBottom: 2 }}>
                  <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span> atom {i}: E = {dataA.gnn.atomE[i].toFixed(4)} eV
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.dn4}44`, marginTop: 6, paddingTop: 6, fontWeight: 700, fontFamily: "monospace", fontSize: 12, color: T.dn4 }}>
                Σ = {dataA.gnn.totalE.toFixed(4)} eV
              </div>
            </div>
            {/* NH3 energies */}
            <div style={{ flex: "1 1 200px", padding: "8px 10px", border: `2px solid ${T.dn3}`, borderRadius: 8, background: `${T.dn3}06` }}>
              <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 6 }}>NH₃ (batch=1)</div>
              {dataB.atoms.map((a, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 11, marginBottom: 2 }}>
                  <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span> atom {i}: E = {dataB.gnn.atomE[i].toFixed(4)} eV
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.dn3}44`, marginTop: 6, paddingTop: 6, fontWeight: 700, fontFamily: "monospace", fontSize: 12, color: T.dn3 }}>
                Σ = {dataB.gnn.totalE.toFixed(4)} eV
              </div>
            </div>
          </div>
          <div style={stepStyle}>
            scatter_add(atom_energies, batch=[{batchIdx.map(b => b.batchId).join(",")}]) → [{dataA.gnn.totalE.toFixed(4)}, {dataB.gnn.totalE.toFixed(4)}] eV
          </div>
        </Card>

        {/* === Step 6: Forces === */}
        <Card title="Step 6 — Forces (Computed Per-Structure)" color={T.dn4} formula="F_i = −∂E/∂r_i">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            Forces are computed from the same edges, so they naturally stay within each molecule.
            Each atom's force sums contributions only from edges connected to it — which are all within the same structure.
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>H₂O forces (eV/Å)</div>
              {dataA.atoms.map((a, i) => {
                const f = dataA.gnn.forces[i];
                return (
                  <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3, padding: "3px 6px", background: `${T.dn4}08`, borderRadius: 4 }}>
                    <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span>: [{f.map(v => v.toFixed(5)).join(", ")}]
                  </div>
                );
              })}
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 4 }}>NH₃ forces (eV/Å)</div>
              {dataB.atoms.map((a, i) => {
                const f = dataB.gnn.forces[i];
                return (
                  <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3, padding: "3px 6px", background: `${T.dn3}08`, borderRadius: 4 }}>
                    <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span>: [{f.map(v => v.toFixed(5)).join(", ")}]
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* === Step 7: Stress === */}
        <Card title="Step 7 — Stress (Per-Structure Virial Tensor)" color={T.dn5} formula="σ_αβ = (1/V) Σ r_ij,α × f_ij,β">
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            Stress is computed <b>per structure</b> using each molecule's own volume and edges. The batch vector
            tells us which edges belong to which structure, so we compute two separate 3×3 tensors.
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>H₂O stress (GPa)</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, textAlign: "center", background: T.surface, borderRadius: 6, padding: "6px 8px" }}>
                {dataA.gnn.stressGPa.map((row, r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    {row.map((v, c) => (
                      <span key={c} style={{ width: 70, textAlign: "right", color: v >= 0 ? T.dn3 : T.dn4 }}>{v.toFixed(3)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <div style={{ fontSize: 11, color: T.dn3, fontWeight: 700, marginBottom: 4 }}>NH₃ stress (GPa)</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, textAlign: "center", background: T.surface, borderRadius: 6, padding: "6px 8px" }}>
                {dataB.gnn.stressGPa.map((row, r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                    {row.map((v, c) => (
                      <span key={c} style={{ width: 70, textAlign: "right", color: v >= 0 ? T.dn3 : T.dn4 }}>{v.toFixed(3)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* === Summary: Full Pipeline Pseudocode === */}
        <Card title="Complete Batch Pipeline — Pseudocode" color={T.dn1}>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 2.0, color: T.ink, background: T.surface, borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ color: T.muted }}># ─── Input ───</div>
            <div>atoms   = <span style={{ color: T.dn4 }}>[O, H, H</span>, <span style={{ color: T.dn3 }}>N, H, H, H]</span>          {dim("# 7 atoms")}</div>
            <div>batch   = <span style={{ color: T.dn4 }}>[0, 0, 0</span>, <span style={{ color: T.dn3 }}>1, 1, 1, 1]</span>          {dim("# which molecule")}</div>
            <div>edge_src= <span style={{ color: T.dn4 }}>[0,1,0,2,1,2</span>, <span style={{ color: T.dn3 }}>3,4,3,5,3,6,...]</span> {dim("# NH₃ shifted +3")}</div>
            <div>edge_dst= <span style={{ color: T.dn4 }}>[1,0,2,0,2,1</span>, <span style={{ color: T.dn3 }}>4,3,5,3,6,3,...]</span></div>
            <div>&nbsp;</div>
            <div style={{ color: T.muted }}># ─── Forward pass (ALL atoms/edges in parallel) ───</div>
            <div>h0      = embed(atoms.Z)               {dim("# [7 × 3]")}</div>
            <div>e_feat  = gauss_smear(distances)        {dim("# [E × 4]")}</div>
            <div>e_cut   = cosine_cutoff(distances)      {dim("# [E × 1]")}</div>
            <div>msgs_2b = W2 @ [h_dst, h_src, e_feat]  {dim("# 2-body messages")}</div>
            <div>h1      = scatter_add(msgs_2b, edge_dst){dim("# aggregate → [7 × 3]")}</div>
            <div>msgs_3b = W3 @ [h_center, e1, e2, ang]  {dim("# 3-body messages")}</div>
            <div>h2      = scatter_add(msgs_3b, center)  {dim("# aggregate → [7 × 3]")}</div>
            <div>&nbsp;</div>
            <div style={{ color: T.muted }}># ─── Predictions (batch vector used here!) ───</div>
            <div>atom_E  = MLP(h2)                       {dim("# [7 × 1]  per-atom")}</div>
            <div>mol_E   = scatter_add(atom_E, batch)    {dim("# [2 × 1]  per-molecule!")}</div>
            <div>forces  = −∂(mol_E)/∂(positions)        {dim("# [7 × 3]  autograd")}</div>
            <div>stress  = virial(edges, forces, batch, V){dim("# [2 × 3×3] per-molecule")}</div>
            <div>&nbsp;</div>
            <div style={{ color: T.muted }}># ─── Output ───</div>
            <div>mol_E   = [{label(T.dn4, dataA.gnn.totalE.toFixed(4))}, {label(T.dn3, dataB.gnn.totalE.toFixed(4))}] eV  {dim("# [H₂O, NH₃]")}</div>
            <div>forces  = [{label(T.dn4, "3×3")}, {label(T.dn3, "4×3")}] matrix        {dim("# per-atom force vectors")}</div>
            <div>stress  = [{label(T.dn4, "3×3")}, {label(T.dn3, "3×3")}] GPa tensors   {dim("# per-molecule stress")}</div>
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginTop: 10, padding: "8px 10px", background: `${T.dn1}08`, borderRadius: 6 }}>
            <b>Key takeaway:</b> The batch vector is the only thing that changes. The GNN weights, the message passing
            logic, the MLP — everything is identical. We just pack more atoms/edges into the same tensors.
            A batch of 64 structures is the same code as 1 structure, just with longer arrays and a batch vector.
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── SECTION 8: FULL PIPELINE ANIMATION ──────────────────────────────
function SecAnimate({ atoms, edges, triplets, gnn, mol }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const STEPS = [
    { label: "Input Atoms", color: T.dn1, icon: "Z",
      desc: "Start with raw atomic numbers and 3D positions",
      detail: `${atoms.length} atoms: ${atoms.map(a => a.sym).join(", ")}`,
      formula: "Input: {Z_i, r_i}" },
    { label: "Build Graph", color: T.dn1, icon: "G",
      desc: "Connect atoms within cutoff radius (5.0 Å) to form edges. Each edge stores displacement vector and distance.",
      detail: `${edges.length} directed edges, ${triplets.length} triplets`,
      formula: "d_ij = |r_j − r_i|, cutoff = 5.0 Å" },
    { label: "Atom Embedding", color: T.dn5, icon: "E",
      desc: "Look up each atom's element in a learned embedding table. Converts atomic number Z into a dense feature vector.",
      detail: `h⁰ = EmbeddingTable[Z], dim = 3`,
      formula: "h⁰_i = Embed(Z_i)  →  [3] per atom" },
    { label: "Gaussian Smearing", color: T.dn2, icon: "G",
      desc: "Expand each distance into multiple Gaussian basis functions centered at different distances. Gives the network a rich representation of each bond length.",
      detail: `4 Gaussian centers at [${G_MU.join(", ")}] Å, σ = ${G_SIG}`,
      formula: "e_ij = [exp(−(d−μ_k)²/σ²)]  →  [4] per edge" },
    { label: "Cosine Cutoff", color: T.dn6, icon: "C",
      desc: "Multiply each edge feature by a smooth cosine envelope that goes to zero at the cutoff. Ensures forces are continuous — no sudden jumps when atoms cross the cutoff boundary.",
      detail: "w(d) = 0.5(cos(πd/r_c) + 1) for d < r_c, else 0",
      formula: "Smooth ↓ to 0 at r_c = 5.0 Å" },
    { label: "2-Body Messages", color: T.dn4, icon: "M",
      desc: "Each edge sends a message from source to destination atom. Message = gate ⊙ core × cutoff. The gate (sigmoid) controls flow, the core (softplus) provides magnitude.",
      detail: `${edges.length} messages computed, aggregated to ${atoms.length} atoms`,
      formula: "m_ij = σ(W·x) ⊙ sp(W·x) × w(d)  →  h¹_i = h⁰_i + Σ_j m_ij" },
    { label: "3-Body Messages", color: T.dn4, icon: "A",
      desc: "For each atom, consider every pair of incoming edges — this captures bond ANGLES. The angular basis functions encode cos(θ_jik). Three-body interactions are essential for capturing directional bonding.",
      detail: `${triplets.length} triplet interactions`,
      formula: "m_jik = f(h_i, e_ij, e_ik, cos θ)  →  h²_i = h¹_i + Σ_{j,k} m_jik" },
    { label: "Energy Readout", color: T.dn3, icon: "E",
      desc: "A small MLP (linear layer) converts each atom's final features into a per-atom energy contribution. Total energy = sum over all atoms. This is an extensive property — doubles if you double the system.",
      detail: `E = Σ_i MLP(h²_i) = ${gnn.totalE.toFixed(4)} eV`,
      formula: "ε_i = W·h²_i + b  →  E = Σ_i ε_i" },
    { label: "Forces (autograd)", color: T.dn4, icon: "F",
      desc: "Forces are the negative gradient of energy with respect to positions. PyTorch's autograd walks backward through the entire computation graph using the chain rule — one backward pass gives exact forces for all atoms.",
      detail: `F_i = −∂E/∂r_i, shape: [${atoms.length} × 3]`,
      formula: "grad = torch.autograd.grad(E, pos)  →  F = −grad" },
    { label: "Stress (strain)", color: T.dn5, icon: "σ",
      desc: "Stress measures how energy changes when the cell is deformed. A 3×3 strain tensor ε is applied to all positions, energy is recomputed, and the gradient ∂E/∂ε gives stress. Divided by volume for correct units.",
      detail: "σ = (1/V) ∂E/∂ε, shape: [3 × 3]",
      formula: "D = I + ε, r' = r·D^T, σ = (1/V) ∂E/∂ε" },
  ];

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= STEPS.length - 1) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [playing]);

  const cur = STEPS[step];
  const sp = mol.svgPos;

  // Animation helpers
  const showEdges = step >= 1;
  const showEmbed = step >= 2;
  const showGauss = step >= 3;
  const showCutoff = step >= 4;
  const showMsg2 = step >= 5;
  const showMsg3 = step >= 6;
  const showEnergy = step >= 7;
  const showForces = step >= 8;
  const showStress = step >= 9;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ═══ Controls ═══ */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => { setPlaying(!playing); if (!playing && step >= STEPS.length - 1) setStep(0); }}
          style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: playing ? `${T.dn4}22` : `${T.dn1}22`,
            border: `2px solid ${playing ? T.dn4 : T.dn1}`,
            color: playing ? T.dn4 : T.dn1, fontFamily: "inherit" }}>
          {playing ? "⏸ Pause" : step >= STEPS.length - 1 ? "↻ Replay" : "▶ Play"}
        </button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0 || playing}
          style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: step === 0 || playing ? "default" : "pointer",
            background: T.panel, border: `1px solid ${T.border}`, color: step === 0 || playing ? T.dim : T.ink, fontFamily: "inherit" }}>
          ← Prev
        </button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step >= STEPS.length - 1 || playing}
          style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: step >= STEPS.length - 1 || playing ? "default" : "pointer",
            background: T.panel, border: `1px solid ${T.border}`, color: step >= STEPS.length - 1 || playing ? T.dim : T.ink, fontFamily: "inherit" }}>
          Next →
        </button>
        <span style={{ fontSize: 12, color: T.muted }}>Step {step + 1} / {STEPS.length}</span>
      </div>

      {/* ═══ Progress timeline ═══ */}
      <div style={{ display: "flex", gap: 2, alignItems: "stretch" }}>
        {STEPS.map((s, i) => (
          <div key={i} onClick={() => { if (!playing) setStep(i); }}
            style={{
              flex: 1, padding: "6px 4px", borderRadius: 6, textAlign: "center", cursor: playing ? "default" : "pointer",
              background: i === step ? `${s.color}22` : i < step ? `${s.color}11` : T.bg,
              border: `2px solid ${i === step ? s.color : i < step ? s.color + "44" : T.border}`,
              transition: "all 0.3s ease",
            }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: i <= step ? s.color : T.dim, letterSpacing: 0.5 }}>{i + 1}</div>
            <div style={{ fontSize: 8, color: i <= step ? T.ink : T.dim, lineHeight: 1.2, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ═══ Main visualization ═══ */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {/* SVG molecule animation */}
        <div style={{ flex: "1 1 440px" }}>
          <svg viewBox="0 0 440 360" style={{ display: "block", borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: 440 }}>
            <rect width={440} height={360} fill={T.bg} rx={10} />

            {/* Edges */}
            {showEdges && edges.map((e, i) => {
              const [sx, sy] = sp[e.src], [ex, ey] = sp[e.dst];
              const dx = ex - sx, dy = ey - sy, len = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / len, uy = dy / len, R = 24;
              const x1 = sx + ux * R, y1 = sy + uy * R, x2 = ex - ux * R, y2 = ey - uy * R;
              const edgeColor = showCutoff ? (e.dist < 5.0 ? T.dn2 : T.dim) : T.dim;
              const opacity = showCutoff ? cutoffFn(e.dist).toFixed(2) : 0.3;
              return (
                <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={showMsg2 ? T.dn4 : edgeColor}
                  strokeWidth={showMsg2 ? 2.5 : 1.5}
                  opacity={opacity}
                  style={{ transition: "all 0.5s ease" }}>
                  {showMsg2 && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />}
                </line>
              );
            })}

            {/* 3-body angle arcs */}
            {showMsg3 && triplets.slice(0, 6).map((t, i) => {
              const [cx, cy] = sp[t.center];
              const e1 = edges[t.e1], e2 = edges[t.e2];
              const [sx1, sy1] = sp[e1.src], [sx2, sy2] = sp[e2.src];
              const a1 = Math.atan2(sy1 - cy, sx1 - cx), a2 = Math.atan2(sy2 - cy, sx2 - cx);
              const r = 32;
              return (
                <path key={`t${i}`}
                  d={`M ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}`}
                  fill="none" stroke={T.dn5} strokeWidth={2} opacity={0.5}
                  style={{ transition: "all 0.5s ease" }} />
              );
            })}

            {/* Force arrows */}
            {showForces && atoms.map((a, i) => {
              const [cx, cy] = sp[i];
              const f = gnn.forces[i];
              const scale = 800;
              const fx = f[0] * scale, fy = -f[1] * scale;
              const fmag = Math.sqrt(fx * fx + fy * fy);
              if (fmag < 2) return null;
              return (
                <g key={`f${i}`}>
                  <line x1={cx} y1={cy} x2={cx + fx} y2={cy + fy}
                    stroke={T.dn4} strokeWidth={3} markerEnd="url(#forceArrow)" opacity={0.8} />
                </g>
              );
            })}
            <defs>
              <marker id="forceArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4z" fill={T.dn4} />
              </marker>
            </defs>

            {/* Stress box indicator */}
            {showStress && (
              <rect x={10} y={10} width={420} height={340} rx={10}
                fill="none" stroke={T.dn5} strokeWidth={2} strokeDasharray="8,4" opacity={0.5}>
                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite" />
              </rect>
            )}

            {/* Atoms */}
            {atoms.map((a, i) => {
              const [cx, cy] = sp[i];
              const col = ELEM_COLOR[a.Z] || T.ink;
              const r = showEmbed ? 26 : 22;
              return (
                <g key={`a${i}`}>
                  <circle cx={cx} cy={cy} r={r} fill={`${col}22`} stroke={col} strokeWidth={2}
                    style={{ transition: "r 0.3s ease" }} />
                  <text x={cx} y={cy - 3} textAnchor="middle" fill={col} fontSize={14} fontWeight="bold">{a.sym}</text>
                  {showEmbed && (
                    <text x={cx} y={cy + 12} textAnchor="middle" fill={T.dn5} fontSize={8} fontWeight="600">
                      h=[{EMBED[a.Z].map(v => v.toFixed(1)).join(",")}]
                    </text>
                  )}
                  {showEnergy && (
                    <text x={cx} y={cy + (showEmbed ? 22 : 12)} textAnchor="middle" fill={T.dn3} fontSize={9} fontWeight="700">
                      ε={gnn.atomE[i].toFixed(2)}eV
                    </text>
                  )}
                </g>
              );
            })}

            {/* Gaussian smearing indicators */}
            {showGauss && !showMsg2 && edges.slice(0, 4).map((e, i) => {
              const [sx, sy] = sp[e.src], [ex, ey] = sp[e.dst];
              const mx = (sx + ex) / 2, my = (sy + ey) / 2;
              return (
                <text key={`g${i}`} x={mx} y={my - 8} textAnchor="middle" fill={T.dn2} fontSize={8} fontWeight="600">
                  G=[{gaussSmear(e.dist).map(v => v.toFixed(1)).join(",")}]
                </text>
              );
            })}

            {/* Step label overlay */}
            <rect x={10} y={320} width={200} height={30} rx={6} fill={`${cur.color}dd`} />
            <text x={20} y={340} fill="#fff" fontSize={12} fontWeight="700">{cur.icon} {cur.label}</text>
          </svg>
        </div>

        {/* Description panel */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 10 }}>
          <Card title={cur.label} color={cur.color}>
            <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.9, marginBottom: 10 }}>
              {cur.desc}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: cur.color, fontWeight: 700, padding: "8px 12px", background: `${cur.color}08`, border: `1px solid ${cur.color}22`, borderRadius: 6, marginBottom: 8 }}>
              {cur.formula}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: T.ink, padding: "6px 10px", background: T.surface, borderRadius: 6 }}>
              {cur.detail}
            </div>
          </Card>

          {/* Data at this step */}
          {step >= 2 && step <= 7 && (
            <Card title="Data at this step" color={cur.color}>
              {step === 2 && atoms.map((a, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span> → h⁰ = [{EMBED[a.Z].map(v => v.toFixed(2)).join(", ")}]
                </div>
              ))}
              {step === 3 && edges.slice(0, 4).map((e, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3 }}>
                  {atoms[e.src].sym}→{atoms[e.dst].sym} d={e.dist.toFixed(3)}Å G=[{gaussSmear(e.dist).map(v => v.toFixed(2)).join(",")}]
                </div>
              ))}
              {step === 4 && edges.slice(0, 4).map((e, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3 }}>
                  {atoms[e.src].sym}→{atoms[e.dst].sym} cutoff={cutoffFn(e.dist).toFixed(4)}
                </div>
              ))}
              {step === 5 && gnn.msgs2.slice(0, 4).map((m, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3 }}>
                  edge {i}: msg=[{m.msg.map(v => v.toFixed(3)).join(",")}]
                </div>
              ))}
              {step === 6 && gnn.msgs3.slice(0, 4).map((m, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 10, marginBottom: 3 }}>
                  triplet {i}: msg=[{m.msg.map(v => v.toFixed(3)).join(",")}]
                </div>
              ))}
              {step === 7 && atoms.map((a, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700 }}>{a.sym}</span>: ε_i = {gnn.atomE[i].toFixed(4)} eV
                </div>
              ))}
            </Card>
          )}

          {/* Pipeline flow summary */}
          <div style={{ background: T.surface, borderRadius: 8, padding: "10px 12px", border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Pipeline flow</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
              {STEPS.map((s, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700,
                    background: i <= step ? `${s.color}22` : T.bg,
                    color: i <= step ? s.color : T.dim,
                    border: `1px solid ${i === step ? s.color : "transparent"}`,
                  }}>{s.label}</span>
                  {i < STEPS.length - 1 && <span style={{ color: i < step ? s.color : T.dim, fontSize: 10 }}>→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 9: PARAMETERS EXPLAINED ──────────────────────────────────
function SecParams() {
  const monoBlock = { fontFamily: "monospace", fontSize: 12, lineHeight: 1.7, color: T.ink };
  const hilite = (text, color) => <span style={{ color, fontWeight: 700 }}>{text}</span>;
  const dimText = { fontSize: 11, color: T.muted, lineHeight: 1.8 };

  const parts = [
    { name: "Atom cheat sheet", params: 7616, color: T.dn5 },
    { name: "Charge converter", params: 192, color: T.dn1 },
    { name: "Distance learning (2-body)", params: 108544, color: T.dn4 },
    { name: "Angle learning (3-body)", params: 124928, color: T.dn4 },
    { name: "Energy squeezer (MLP)", params: 16641, color: T.dn3 },
  ];
  const total = parts.reduce((s, p) => s + p.params, 0);

  const comparisons = [
    { name: "GPT-4", params: "~1,000,000,000,000", short: "1 trillion", width: 100 },
    { name: "GPT-3", params: "175,000,000,000", short: "175 billion", width: 80 },
    { name: "ResNet-50", params: "25,000,000", short: "25 million", width: 30 },
    { name: "DefectNet", params: "257,921", short: "258 thousand", width: 4 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Card 1: What is a parameter? */}
      <Card title="What is a parameter?" color={T.dn2}>
        <div style={dimText}>
          A parameter is just <b style={{ color: T.ink }}>one number</b> that the model learns during training.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "10px 0" }}>
          <div style={{ background: T.dn4 + "11", border: `1px solid ${T.dn4}33`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ fontSize: 10, color: T.dn4, fontWeight: 700, marginBottom: 4 }}>Before training</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.dn4 }}>parameter = 0.472</div>
            <div style={{ fontSize: 10, color: T.muted }}>(random)</div>
          </div>
          <div style={{ background: T.dn3 + "11", border: `1px solid ${T.dn3}33`, borderRadius: 8, padding: "8px 12px" }}>
            <div style={{ fontSize: 10, color: T.dn3, fontWeight: 700, marginBottom: 4 }}>After training</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.dn3 }}>parameter = 1.831</div>
            <div style={{ fontSize: 10, color: T.muted }}>(learned from DFT data)</div>
          </div>
        </div>
        <div style={{ ...dimText, marginBottom: 10 }}>
          <b style={{ color: T.dn2 }}>257,921 parameters</b> = 257,921 numbers that get tuned.
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.dn2, fontWeight: 700, marginBottom: 6 }}>Think of it like a recipe</div>
          <div style={dimText}>
            Imagine a recipe with 257,921 ingredient amounts. You start with random amounts,
            make the dish, taste it, adjust the amounts slightly, repeat <b style={{ color: T.ink }}>40,000 times</b> until it tastes right.
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: T.muted }}>
            Each "tasting" = one batch of DFT calculations. Each "adjustment" = one gradient step.
          </div>
        </div>
      </Card>

      {/* Card 2: Part 1 — Atom Embedding */}
      <Card title="Part 1 — Atom Embedding: 7,616" color={T.dn5}>
        <div style={dimText}>
          Think of it as a <b style={{ color: T.dn5 }}>cheat sheet</b>. One row per element. 64 numbers per row.
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0", fontFamily: "monospace", fontSize: 11, lineHeight: 1.8 }}>
          <div><span style={{ color: T.dn5, fontWeight: 700, display: "inline-block", width: 30 }}>Si:</span> [0.82, −0.31, 0.41, 0.55, ...] <span style={{ color: T.muted }}>← 64 numbers describing Silicon</span></div>
          <div><span style={{ color: T.dn5, fontWeight: 700, display: "inline-block", width: 30 }}>Zn:</span> [0.33,  0.61, −0.24, 0.18, ...] <span style={{ color: T.muted }}>← 64 numbers describing Zinc</span></div>
          <div><span style={{ color: T.dn5, fontWeight: 700, display: "inline-block", width: 30 }}>Te:</span> [−0.44, 0.72, 0.18, 0.91, ...] <span style={{ color: T.muted }}>← 64 numbers describing Tellurium</span></div>
          <div style={{ color: T.muted }}>...119 elements total</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: T.dn5, fontWeight: 700 }}>
            Total = 119 rows × 64 numbers = 7,616
          </div>
        </div>
        <div style={{ ...dimText, marginTop: 8 }}>
          When the model sees a Cd atom it looks up row 48 and gets those 64 numbers.
          That is the atom's initial "identity card."
        </div>
      </Card>

      {/* Card 3: Part 2 — Global Projection */}
      <Card title="Part 2 — Global Projection: 192" color={T.dn1}>
        <div style={dimText}>Takes 2 numbers as input:</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: T.dn1, margin: "6px 0", fontWeight: 700 }}>
          [charge = −1,  theory = HSE]
        </div>
        <div style={dimText}>Converts them into 64 numbers to add to every atom.</div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0", fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <div>128 weights  +  64 biases  =  <span style={{ color: T.dn1, fontWeight: 700 }}>192 numbers</span></div>
        </div>
        <div style={dimText}>
          Tiny but important — this is how the model knows the charge state.
        </div>
      </Card>

      {/* Card 4: Part 3 — 2-body Convolution */}
      <Card title="Part 3 — 2-body Convolution × 4 blocks: 108,544" color={T.dn4}>
        <div style={dimText}>
          This is where atoms learn about their neighbours' distances.
          Each block has one big linear layer:
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <div><b>Input:</b> combine centre atom ({hilite("64", T.dn5)}) + neighbour atom ({hilite("64", T.dn5)}) + bond distance ({hilite("80", T.dn2)})</div>
            <div style={{ marginLeft: 50, color: T.dn4, fontWeight: 700 }}>= 208 numbers</div>
            <div style={{ marginTop: 6 }}><b>Output:</b> {hilite("128", T.dn4)} numbers (split into gate 64 + core 64)</div>
          </div>
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0", fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, color: T.ink }}>
          <div>208 × 128 = 26,624  weight numbers</div>
          <div style={{ marginLeft: 50 }}>128 =    128  bias numbers</div>
          <div>+ BatchNorm numbers:  512</div>
          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4, paddingTop: 4, color: T.dn4, fontWeight: 700 }}>
            Per block:  27,136
          </div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: T.dn4, fontWeight: 700, textAlign: "center" }}>
          × 4 blocks = 108,544
        </div>
      </Card>

      {/* Card 5: Part 4 — 3-body Convolution */}
      <Card title="Part 4 — 3-body Convolution × 4 blocks: 124,928" color={T.dn4}>
        <div style={dimText}>
          Same idea as 2-body but now atoms also learn about <b style={{ color: T.ink }}>bond angles</b>.
          Input is bigger:
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <div><b>Input:</b> centre atom ({hilite("64", T.dn5)}) + bond 1 ({hilite("80", T.dn2)}) + bond 2 ({hilite("80", T.dn2)}) + angle ({hilite("16", T.dn6)})</div>
            <div style={{ marginLeft: 50, color: T.dn4, fontWeight: 700 }}>= 240 numbers ← bigger than 2-body's 208</div>
          </div>
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0", fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, color: T.ink }}>
          <div>240 × 128 = 30,720  weight numbers</div>
          <div style={{ marginLeft: 50 }}>128 =    128  bias numbers</div>
          <div>+ BatchNorm:          512</div>
          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4, paddingTop: 4, color: T.dn4, fontWeight: 700 }}>
            Per block:  31,232
          </div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: T.dn4, fontWeight: 700, textAlign: "center" }}>
          × 4 blocks = 124,928
        </div>
        <div style={{ ...dimText, marginTop: 8 }}>
          3-body is slightly bigger than 2-body just because the input is 240 wide instead of 208.
        </div>
      </Card>

      {/* Card 6: Part 5 — Energy Head MLP */}
      <Card title="Part 5 — Energy Head MLP: 16,641" color={T.dn3}>
        <div style={dimText}>
          This is the final step. Takes the 64-number fingerprint of each atom and squeezes
          it into <b style={{ color: T.ink }}>one number</b> — the atom's energy contribution.
        </div>
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, margin: "10px 0" }}>
          <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.2, color: T.ink, textAlign: "center" }}>
            <div>{hilite("64", T.dn5)} numbers</div>
            <div style={{ color: T.muted }}>↓  Linear layer (64→128): 64×128 + 128 = <b style={{ color: T.dn3 }}>8,320</b></div>
            <div>{hilite("128", T.dn3)} numbers</div>
            <div style={{ color: T.muted }}>↓  Linear layer (128→64): 128×64 + 64 = <b style={{ color: T.dn3 }}>8,256</b></div>
            <div>{hilite("64", T.dn5)} numbers</div>
            <div style={{ color: T.muted }}>↓  Linear layer (64→1): 64×1 + 1 = <b style={{ color: T.dn3 }}>65</b></div>
            <div style={{ color: T.dn3, fontWeight: 700 }}>1 number  ← this is e_i (atom's energy)</div>
          </div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: T.dn3, fontWeight: 700, textAlign: "center" }}>
          Total = 8,320 + 8,256 + 65 = 16,641
        </div>
      </Card>

      {/* Card 7: Grand Total */}
      <Card title="Add them all up" color={T.dn2}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "6px 8px", fontSize: 12, color: T.ink }}>
                  Part {i + 1}
                </td>
                <td style={{ padding: "6px 8px", fontSize: 12, color: p.color, fontWeight: 700 }}>
                  {p.name}
                </td>
                <td style={{ padding: "6px 8px", fontFamily: "monospace", fontSize: 13, color: T.ink, textAlign: "right", fontWeight: 700 }}>
                  {p.params.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: `2px solid ${T.dn2}` }}>
              <td colSpan={2} style={{ padding: "8px 8px", fontSize: 13, color: T.dn2, fontWeight: 800 }}>
                TOTAL
              </td>
              <td style={{ padding: "8px 8px", fontFamily: "monospace", fontSize: 16, color: T.dn2, textAlign: "right", fontWeight: 800 }}>
                {total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Linear layer rule */}
        <div style={{ background: T.dn2 + "11", border: `1px solid ${T.dn2}33`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.dn2, fontWeight: 700, marginBottom: 6 }}>Why exactly those numbers?</div>
          <div style={dimText}>
            Every linear layer follows one simple rule:
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: T.ink, margin: "8px 0", lineHeight: 1.8 }}>
            <div>parameters = (<span style={{ color: T.dn5 }}>input size</span> × <span style={{ color: T.dn3 }}>output size</span>) + <span style={{ color: T.dn1 }}>output size</span></div>
            <div style={{ color: T.muted, marginLeft: 90 }}>└── weights ──┘            └── biases ┘</div>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, lineHeight: 1.8, marginTop: 8 }}>
            <div>Example: Linear(208, 128)</div>
            <div>weights = 208 × 128 = 26,624</div>
            <div>biases  =       128 =    128</div>
            <div>total   =            <span style={{ color: T.dn4, fontWeight: 700 }}>26,752</span></div>
          </div>
          <div style={{ ...dimText, marginTop: 8 }}>
            That is it. No magic. Just multiply input size by output size and add the output size for biases.
          </div>
        </div>

        {/* Size comparison */}
        <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Is 257,921 a lot?
          </div>
          {comparisons.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 80, fontSize: 11, color: i === comparisons.length - 1 ? T.dn2 : T.ink, fontWeight: i === comparisons.length - 1 ? 800 : 400 }}>
                {c.name}
              </div>
              <div style={{ flex: 1, height: 16, background: T.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                <div style={{
                  width: `${c.width}%`, height: "100%",
                  background: i === comparisons.length - 1 ? T.dn2 : T.dim,
                  borderRadius: 4, transition: "width 0.3s",
                }} />
              </div>
              <div style={{ width: 160, fontFamily: "monospace", fontSize: 10, color: T.muted, textAlign: "right" }}>
                {c.params} ({c.short})
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: T.dn2, fontWeight: 700, textAlign: "center" }}>
            DefectNet is tiny — and still achieves near-DFT accuracy!
          </div>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 10: SYMMETRY & EQUIVARIANCE
// ═══════════════════════════════════════════════════════════════════════
function SecEquivariance() {
  const [showType, setShowType] = useState("invariant");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine spinning a globe. The names of cities (energy) stay the same no matter how you rotate it {"\u2014"} that is <strong>invariance</strong>. But the compass needle (force) rotates along with the globe {"\u2014"} that is <strong>equivariance</strong>. A good MLFF must get both right: the energy should not change when you rotate a crystal, but the forces must rotate with it.
        </div>
      </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 430px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"Invariance vs. Equivariance"} color={T.dn1}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 10px" }}>
              Physical predictions from an MLFF must respect the symmetries of 3D space.
              The Euclidean group <strong style={{ color: T.dn1 }}>E(3)</strong> includes
              translations, rotations, and reflections.
            </p>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {["invariant", "equivariant"].map(t => (
                <button key={t} onClick={() => setShowType(t)} style={{
                  padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: showType === t ? T.dn1 + "18" : T.surface,
                  border: `1.5px solid ${showType === t ? T.dn1 : T.border}`,
                  color: showType === t ? T.dn1 : T.muted,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{t === "invariant" ? "Invariant" : "Equivariant"}</button>
              ))}
            </div>
            {showType === "invariant" ? (
              <div>
                <div style={{ fontWeight: 700, color: T.dn5, marginBottom: 4 }}>Invariant: output does NOT change</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, background: T.surface, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T.border}`, marginBottom: 8 }}>
                  f(R {"\u00B7"} x) = f(x)
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>
                  {"\u2022"} <strong>Energy</strong> is invariant {"\u2014"} rotating the crystal does not change its total energy<br/>
                  {"\u2022"} Scalar properties: bandgap, formation energy, bulk modulus
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, color: T.dn3, marginBottom: 4 }}>Equivariant: output transforms WITH the input</div>
                <div style={{ fontFamily: "monospace", fontSize: 12, background: T.surface, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T.border}`, marginBottom: 8 }}>
                  f(R {"\u00B7"} x) = R {"\u00B7"} f(x)
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>
                  {"\u2022"} <strong>Forces</strong> are equivariant {"\u2014"} rotating the crystal rotates all force vectors by the same amount<br/>
                  {"\u2022"} <strong>Stress tensor</strong> transforms as a rank-2 tensor under rotation<br/>
                  {"\u2022"} Dipole moments, polarization vectors
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title={"E(3) Equivariant MLFFs"} color={T.dn3}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: T.dn3 }}>E(3)-equivariant</strong> networks explicitly encode rotational symmetry
              into the architecture, so they do not need data augmentation with random rotations:
            </p>
            {[
              { name: "NequIP", arch: "E(3)-equivariant message passing with irreducible representations (spherical harmonics)", use: "Small molecules and materials with extreme accuracy", color: T.dn1 },
              { name: "MACE", arch: "Higher-order equivariant messages (body-ordered, multi-ACE)", use: "State-of-the-art accuracy on diverse benchmarks", color: T.dn3 },
              { name: "PaiNN", arch: "Equivariant message passing with scalar + vector channels", use: "Fast molecular dynamics, good force predictions", color: T.dn5 },
              { name: "Allegro", arch: "Local equivariant, no message passing (pair-only)", use: "Scalable to millions of atoms", color: T.dn4 },
              { name: "DefectNet", arch: "PaiNN-style vectors + autograd dual-path forces", use: "Charged defects in semiconductors (this project)", color: T.dn2 },
            ].map(m => (
              <div key={m.name} style={{
                marginBottom: 6, padding: "8px 10px", borderRadius: 6,
                background: m.color + "08", border: `1px solid ${m.color}18`,
              }}>
                <div style={{ fontWeight: 700, color: m.color, fontSize: 12 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: T.ink }}>{m.arch}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{m.use}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"How Equivariance Works in Practice"} color={T.dn5}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <div style={{ fontWeight: 700, color: T.dn5, marginBottom: 6 }}>TiO{"\u2082"} Example (Rutile)</div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
              Consider a TiO{"\u2082"} unit cell. Rotating it 90{"\u00B0"} around the c-axis:
            </div>
            {[
              { prop: "Energy", before: "E = -23.45 eV", after: "E = -23.45 eV", type: "Invariant", color: T.dn5 },
              { prop: "Force on Ti", before: "F = (0.12, -0.08, 0.0) eV/\u00C5", after: "F = (0.08, 0.12, 0.0) eV/\u00C5", type: "Equivariant", color: T.dn3 },
              { prop: "Stress \u03C3_xx", before: "\u03C3_xx = 2.1 kBar", after: "\u03C3_yy = 2.1 kBar", type: "Equivariant", color: T.dn4 },
            ].map(row => (
              <div key={row.prop} style={{
                marginBottom: 6, padding: "6px 10px", borderRadius: 6,
                background: row.color + "08", border: `1px solid ${row.color}18`,
                fontFamily: "monospace", fontSize: 10,
              }}>
                <div style={{ fontWeight: 700, color: row.color }}>{row.prop} ({row.type})</div>
                <div>Before: {row.before}</div>
                <div>After:  {row.after}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={"Invariant vs. Equivariant Architectures"} color={T.dn4}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            {[
              { approach: "Invariant features only", pros: "Simple, fast", cons: "Forces via autograd only (slow)", examples: "SchNet, CGCNN, M3GNet", color: T.dn5 },
              { approach: "Equivariant features", pros: "Direct force prediction, better accuracy", cons: "Higher memory, complex math", examples: "NequIP, MACE, PaiNN", color: T.dn3 },
              { approach: "Hybrid (DefectNet)", pros: "Best of both: autograd + direct forces, learned mixing", cons: "Two forward passes for forces", examples: "DefectNet dual-path", color: T.dn2 },
            ].map(a => (
              <div key={a.approach} style={{
                marginBottom: 8, padding: "8px 10px", borderRadius: 6,
                background: a.color + "08", border: `1px solid ${a.color}18`,
              }}>
                <div style={{ fontWeight: 700, color: a.color }}>{a.approach}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 10 }}>
                  <div style={{ flex: 1 }}><span style={{ color: "#16a34a" }}>+</span> {a.pros}</div>
                  <div style={{ flex: 1 }}><span style={{ color: "#dc2626" }}>{"\u2212"}</span> {a.cons}</div>
                </div>
                <div style={{ fontSize: 10, color: T.muted }}>{a.examples}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={"DefectNet: Dual-Path Force Prediction"} color={T.dn2}>
          <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, color: T.ink, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}` }}>
            <span style={{ color: T.muted }}>// Path 1: energy-conserving</span><br/>
            F_autograd = {"\u2212"}{"\u2207"}E / {"\u2207"}r<br/><br/>
            <span style={{ color: T.muted }}>// Path 2: E(3)-equivariant direct</span><br/>
            v_i = {"\u03A3"}_j {"\u0072\u0302"}_ij {"\u00B7"} gate(h_j)  <span style={{ color: T.muted }}>// vector aggregation</span><br/>
            F_direct = MLP(h_i) {"\u00B7"} v_i<br/><br/>
            <span style={{ color: T.muted }}>// Learned mixing</span><br/>
            {"\u03B1"} = sigmoid(force_mix_logit)<br/>
            <strong style={{ color: T.dn2 }}>F = (1{"\u2212"}{"\u03B1"}) {"\u00B7"} F_autograd + {"\u03B1"} {"\u00B7"} F_direct</strong>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 11: LONG-RANGE ELECTROSTATICS
// ═══════════════════════════════════════════════════════════════════════
function SecLongRange() {
  const [method, setMethod] = useState("ewald");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Think of a classroom where students whisper to their neighbors (short-range). An MLFF with a local cutoff is like only hearing whispers within arm{"'"}s reach. But in an ionic crystal, atoms shout across the entire room via Coulomb forces (long-range). If you only listen to whispers, you miss the shouting {"\u2014"} and your energy predictions for NaCl, TiO{"\u2082"}, and perovskites will be systematically wrong.
        </div>
      </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 430px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"The Long-Range Problem"} color={T.dn4}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 10px" }}>
              Standard GNN force fields use a <strong>local cutoff</strong> (typically 5{"\u20137"} {"\u00C5"}).
              But Coulomb interactions decay as <strong style={{ color: T.dn4 }}>1/r</strong> {"\u2014"} they never truly vanish.
              For ionic materials (TiO{"\u2082"}, NaCl, perovskites), neglecting long-range electrostatics
              causes systematic errors.
            </p>
            <div style={{ fontFamily: "monospace", fontSize: 13, background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}`, textAlign: "center", marginBottom: 10 }}>
              V_Coulomb = {"\u03A3"}_{"{i<j}"} q_i q_j / (4{"\u03C0"}{"\u03B5"}{"\u2080"} r_ij)
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>
              {"\u2022"} In a periodic crystal, this sum is <strong>conditionally convergent</strong> {"\u2014"} it does not converge absolutely in real space<br/>
              {"\u2022"} Ewald summation splits it into fast-converging real + reciprocal space sums<br/>
              {"\u2022"} For ML force fields, the challenge is making this <strong>differentiable and GPU-friendly</strong>
            </div>
          </div>
        </Card>

        <Card title={"Approaches to Long-Range in MLFFs"} color={T.dn1}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Click to compare methods:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {[
              { id: "ewald", label: "Ewald + ML" },
              { id: "charges", label: "Learned Charges" },
              { id: "large", label: "Large Cutoff" },
              { id: "fouriernn", label: "Fourier Features" },
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: method === m.id ? T.dn1 + "18" : T.surface,
                border: `1.5px solid ${method === m.id ? T.dn1 : T.border}`,
                color: method === m.id ? T.dn1 : T.muted,
                cursor: "pointer", fontFamily: "inherit",
              }}>{m.label}</button>
            ))}
          </div>
          {method === "ewald" && (
            <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
              <strong style={{ color: T.dn1 }}>Classical Ewald + ML short-range</strong>
              <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                E_total = E_ML(local) + E_Ewald(q_i, r_ij)<br/>
                q_i predicted by ML or fixed from oxidation states
              </div>
              <div style={{ color: T.muted }}>
                Used by: <strong>CHGNet</strong>, SpookyNet<br/>
                {"\u2022"} CHGNet predicts atomic charges, then computes Ewald sum<br/>
                {"\u2022"} Physically motivated, but adds O(N{"\u00B3/"}{"\u00B2"}) computational cost
              </div>
            </div>
          )}
          {method === "charges" && (
            <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
              <strong style={{ color: T.dn1 }}>Learnable Partial Charges</strong>
              <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                q_i = MLP(h_i)  <span style={{ color: T.muted }}>// predict charge from atom features</span><br/>
                Constraint: {"\u03A3"}_i q_i = Q_total
              </div>
              <div style={{ color: T.muted }}>
                Used by: <strong>4G-HDNNP</strong>, TensorNet<br/>
                {"\u2022"} Charge equilibration ensures global charge conservation<br/>
                {"\u2022"} Long-range sum computed from predicted charges
              </div>
            </div>
          )}
          {method === "large" && (
            <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
              <strong style={{ color: T.dn1 }}>Larger Cutoff (Brute Force)</strong>
              <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                r_cut = 7{"\u201312"} {"\u00C5"} (vs. typical 5 {"\u00C5"})
              </div>
              <div style={{ color: T.muted }}>
                Used by: <strong>DefectNet</strong> (r_cut = 7 {"\u00C5"}), M3GNet<br/>
                {"\u2022"} Simple but expensive: neighbor count grows as r{"\u00B3"}<br/>
                {"\u2022"} Captures medium-range interactions implicitly<br/>
                {"\u2022"} For charged defects, long-range effects are <em>learned from data</em>
              </div>
            </div>
          )}
          {method === "fouriernn" && (
            <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
              <strong style={{ color: T.dn1 }}>Fourier-Space Neural Networks</strong>
              <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                h_long = FourierTransform(density(r))<br/>
                E_long = MLP(h_long)
              </div>
              <div style={{ color: T.muted }}>
                Used by: <strong>Ewald-MP</strong>, LODE descriptors<br/>
                {"\u2022"} Project atom density onto reciprocal space basis<br/>
                {"\u2022"} Captures periodicity naturally<br/>
                {"\u2022"} Cutting-edge, computationally efficient
              </div>
            </div>
          )}
        </Card>
      </div>

      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"TiO\u2082 Example: Why Long-Range Matters"} color={T.dn5}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 8px" }}>
              TiO{"\u2082"} (rutile) is strongly ionic: Ti{"\u2074\u207A"}, O{"\u00B2\u207B"}. The Madelung energy
              contributes ~40% of the cohesive energy. A local-only MLFF misses this:
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T.dn5}` }}>
                    {["Property", "DFT", "MLFF (5 \u00C5)", "MLFF (7 \u00C5)", "MLFF + Ewald"].map(h => (
                      <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: T.dn5, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prop: "a (Å)", dft: "4.594", ml5: "4.612", ml7: "4.598", mle: "4.595" },
                    { prop: "c/a ratio", dft: "0.644", ml5: "0.651", ml7: "0.646", mle: "0.644" },
                    { prop: "Bulk mod. (GPa)", dft: "216", ml5: "198", ml7: "211", mle: "215" },
                    { prop: "Force MAE (meV/\u00C5)", dft: "\u2014", ml5: "42", ml7: "18", mle: "8" },
                  ].map(row => (
                    <tr key={row.prop} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "4px 6px", fontWeight: 600 }}>{row.prop}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace" }}>{row.dft}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace", color: "#dc2626" }}>{row.ml5}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace", color: T.dn4 }}>{row.ml7}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace", color: "#16a34a" }}>{row.mle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>
              Increasing cutoff from 5 to 7 {"\u00C5"} captures most medium-range effects.
              Adding Ewald summation closes the remaining gap for strongly ionic systems.
            </div>
          </div>
        </Card>

        <Card title={"DefectNet: Implicit Long-Range"} color={T.dn2}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 8px" }}>
              DefectNet uses a <strong style={{ color: T.dn2 }}>7 {"\u00C5"} cutoff with 24 max neighbors</strong> and
              learns long-range effects implicitly from training data:
            </p>
            {[
              { feature: "Large cutoff (7 \u00C5)", detail: "Captures interactions up to ~3rd nearest-neighbor shell in most crystals" },
              { feature: "Global charge conditioning", detail: "System charge (-2 to +2) embedded as global feature, implicitly encoding electrostatic environment" },
              { feature: "6 message passing layers", detail: "Information propagates 6 \u00D7 7 \u00C5 = 42 \u00C5 effective range through multi-hop passing" },
              { feature: "Training on charged defects", detail: "Model learns charge-dependent energy corrections from DFT data directly" },
            ].map(f => (
              <div key={f.feature} style={{
                marginBottom: 6, padding: "6px 10px", borderRadius: 6,
                background: T.dn2 + "08", border: `1px solid ${T.dn2}18`,
                fontSize: 10,
              }}>
                <strong style={{ color: T.dn2 }}>{f.feature}</strong>
                <div style={{ color: T.muted }}>{f.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 12: UNCERTAINTY QUANTIFICATION
// ═══════════════════════════════════════════════════════════════════════
function SecUncertainty() {
  const [mcSample, setMcSample] = useState(5);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine a weather forecast that says {"\""}72{"\u00B0"}F tomorrow{"\""} with no uncertainty. Is that reliable? Now compare {"\""}72 {"\u00B1"} 2{"\u00B0"}F{"\""} (very confident) vs. {"\""}72 {"\u00B1"} 15{"\u00B0"}F{"\""} (very uncertain). MC Dropout works like asking 20 different meteorologists the same question {"\u2014"} if they all agree, you are confident. If they disagree wildly, something is off. The spread of their answers IS the uncertainty.
        </div>
      </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 430px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"Why Uncertainty Matters"} color={T.dn3}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 10px" }}>
              An MLFF prediction without uncertainty is just a number. With uncertainty, it becomes
              <strong style={{ color: T.dn3 }}> actionable science</strong>:
            </p>
            {[
              { use: "Active Learning", desc: "Query DFT for structures where model is most uncertain \u2192 efficient training data generation", color: T.dn1 },
              { use: "Reliability Check", desc: "Flag MD frames where forces are uncertain \u2192 prevent unphysical trajectories", color: T.dn3 },
              { use: "Error Bars", desc: "Report property predictions with confidence intervals \u2192 publishable results", color: T.dn5 },
              { use: "Out-of-Distribution Detection", desc: "High uncertainty = structure unlike training data \u2192 know your model's limits", color: T.dn4 },
            ].map(u => (
              <div key={u.use} style={{
                marginBottom: 6, padding: "8px 10px", borderRadius: 6,
                background: u.color + "08", border: `1px solid ${u.color}18`,
              }}>
                <strong style={{ color: u.color, fontSize: 12 }}>{u.use}</strong>
                <div style={{ fontSize: 10, color: T.muted }}>{u.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={"MC Dropout: Bayesian Uncertainty for Free"} color={T.dn5}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: T.dn5 }}>Monte Carlo Dropout</strong> is the simplest uncertainty method.
              Keep dropout active at inference and run T forward passes:
            </p>
            <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}`, marginBottom: 10 }}>
              <span style={{ color: T.muted }}>// Inference with MC Dropout</span><br/>
              model.enable_mc_dropout()<br/>
              predictions = [model(x) <strong>for</strong> _ <strong>in</strong> range(T)]<br/><br/>
              E_mean = mean([p.energy <strong>for</strong> p <strong>in</strong> predictions])<br/>
              E_std  = std([p.energy <strong>for</strong> p <strong>in</strong> predictions])<br/><br/>
              <span style={{ color: T.muted }}>// E_std is the uncertainty estimate</span><br/>
              <span style={{ color: T.muted }}>// High E_std = model is unsure</span>
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>
              <strong>Why it works:</strong> Each dropout mask produces a different subnetwork.
              The variance across subnetworks approximates Bayesian posterior uncertainty
              (Gal & Ghahramani, 2016).
            </div>
          </div>
        </Card>
      </div>

      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"Interactive: MC Dropout Samples"} color={T.dn2}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
            Adjust the number of MC samples (T) and see how uncertainty stabilizes:
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: T.muted }}>T =</span>
            {[5, 10, 20, 50].map(t => (
              <button key={t} onClick={() => setMcSample(t)} style={{
                padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: mcSample === t ? T.dn2 + "18" : T.surface,
                border: `1.5px solid ${mcSample === t ? T.dn2 : T.border}`,
                color: mcSample === t ? T.dn2 : T.muted,
                cursor: "pointer", fontFamily: "inherit",
              }}>{t}</button>
            ))}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.7, color: T.ink, background: T.surface, borderRadius: 6, padding: "8px 12px", border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.dn2 }}>TiO{"\u2082"} bulk (64 atoms):</strong><br/>
            T = {mcSample} MC samples<br/>
            E_mean = -423.18 eV<br/>
            E_std  = {mcSample >= 20 ? "0.008" : mcSample >= 10 ? "0.012" : "0.019"} eV ({mcSample >= 20 ? "0.12" : mcSample >= 10 ? "0.19" : "0.30"} meV/atom)<br/>
            F_std  = {mcSample >= 20 ? "3.2" : mcSample >= 10 ? "4.8" : "7.1"} meV/{"\u00C5"} (mean over atoms)<br/><br/>
            <strong style={{ color: T.dn4 }}>V_Ti defect (63 atoms, q=-2):</strong><br/>
            T = {mcSample} MC samples<br/>
            E_mean = -416.52 eV<br/>
            E_std  = {mcSample >= 20 ? "0.031" : mcSample >= 10 ? "0.048" : "0.072"} eV ({mcSample >= 20 ? "0.49" : mcSample >= 10 ? "0.76" : "1.14"} meV/atom)<br/>
            F_std  = {mcSample >= 20 ? "12.4" : mcSample >= 10 ? "18.1" : "26.3"} meV/{"\u00C5"}<br/><br/>
            <span style={{ color: T.muted }}>{"\u2192"} Defect has ~{mcSample >= 20 ? "4" : mcSample >= 10 ? "4" : "4"}{"\u00D7"} higher uncertainty than bulk</span><br/>
            <span style={{ color: T.muted }}>{"\u2192"} T {"\u2265"} 20 needed for stable estimates</span>
          </div>
        </Card>

        <Card title={"Other Uncertainty Methods"} color={T.dn4}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            {[
              { method: "Deep Ensemble", how: "Train N independent models, use prediction variance", pros: "Gold standard accuracy", cons: "N\u00D7 training cost", color: T.dn1 },
              { method: "MC Dropout (DefectNet)", how: "Single model, T stochastic passes at inference", pros: "Free (no extra training)", cons: "Noisier than ensemble", color: T.dn2 },
              { method: "Evidential Regression", how: "Predict distribution parameters (mean, variance) directly", pros: "Single forward pass", cons: "Harder to calibrate", color: T.dn3 },
              { method: "Committee Disagreement", how: "Train on different data splits, compare outputs", pros: "Good for active learning", cons: "Multiple models needed", color: T.dn5 },
            ].map(m => (
              <div key={m.method} style={{
                marginBottom: 6, padding: "6px 10px", borderRadius: 6,
                background: m.color + "08", border: `1px solid ${m.color}18`,
              }}>
                <div style={{ fontWeight: 700, color: m.color }}>{m.method}</div>
                <div style={{ fontSize: 10, color: T.ink }}>{m.how}</div>
                <div style={{ display: "flex", gap: 10, fontSize: 10 }}>
                  <span><span style={{ color: "#16a34a" }}>+</span> {m.pros}</span>
                  <span><span style={{ color: "#dc2626" }}>{"\u2212"}</span> {m.cons}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={"DefectNet Uncertainty Output"} color={T.dn6}>
          <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.7, color: T.ink, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}` }}>
            <span style={{ color: T.muted }}>// DefectNet predict.py output columns:</span><br/>
            energy, energy_uncertainty,<br/>
            forces, forces_uncertainty,<br/>
            stress, stress_uncertainty<br/><br/>
            <span style={{ color: T.muted }}>// Usage:</span><br/>
            model = DefectNetForceField(dropout=0.1)<br/>
            model.enable_mc_dropout()<br/>
            result = predict(model, structure, T=20)<br/><br/>
            <span style={{ color: T.muted }}>// Active learning criterion:</span><br/>
            <strong style={{ color: T.dn6 }}>if result.energy_uncertainty {">"} threshold:</strong><br/>
            {"    "}add_to_DFT_queue(structure)
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 13: DEFECTNET ARCHITECTURE DEEP DIVE
// ═══════════════════════════════════════════════════════════════════════
function SecDefectNet() {
  const [layer, setLayer] = useState("overview");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Think of DefectNet like a specialized medical scanner built for one job: finding tumors. A general-purpose MRI can image any body part, but a dedicated breast cancer AI trained on thousands of mammograms beats it every time for that specific task. Similarly, general MLFFs (M3GNet, CHGNet) work for any material, but DefectNet is purpose-built for point defects in semiconductors {"\u2014"} it knows about charge states, handles both HSE and PBE functionals, and uses dual-path forces to get the physics right where it matters most.
        </div>
      </div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 430px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"DefectNet Architecture Overview"} color={T.dn2}>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 10px" }}>
              <strong style={{ color: T.dn2 }}>DefectNet</strong> is a graph neural network force field built for
              point defects in semiconductors. It combines 2-body + 3-body message passing with
              E(3)-equivariant force prediction and global charge/functional conditioning.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {[
                { id: "overview", label: "Full Model" },
                { id: "twobody", label: "2-Body Conv" },
                { id: "threebody", label: "3-Body Conv" },
                { id: "vector", label: "Vector Path" },
                { id: "global", label: "Global Cond." },
              ].map(l => (
                <button key={l.id} onClick={() => setLayer(l.id)} style={{
                  padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                  background: layer === l.id ? T.dn2 + "18" : T.surface,
                  border: `1.5px solid ${layer === l.id ? T.dn2 : T.border}`,
                  color: layer === l.id ? T.dn2 : T.muted,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{l.label}</button>
              ))}
            </div>
            {layer === "overview" && (
              <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.8, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}` }}>
                Input: crystal structure + charge + functional<br/>
                {"\u2193"}<br/>
                Atom Embedding (128-dim) + Global Conditioning<br/>
                {"\u2193"}<br/>
                {"\u00D7"} 6 Interaction Blocks:<br/>
                {"  "}{"\u251C"} 2-body DefectNetConv (radial messages)<br/>
                {"  "}{"\u251C"} 3-body ThreeBodyConv (angular triplets)<br/>
                {"  "}{"\u2514"} VectorAggr (equivariant vectors)<br/>
                {"\u2193"}<br/>
                Energy Head: {"\u03A3"}_i MLP(h_i) {"\u2192"} E_total<br/>
                Force Dual-Path: autograd + direct {"\u2192"} F_i<br/>
                Stress: strain derivative {"\u2192"} {"\u03C3"}_{"{ij}"}
              </div>
            )}
            {layer === "twobody" && (
              <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: T.dn4 }}>2-Body (Pairwise) Convolution</strong>
                <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                  edge_fea = Gaussian(r_ij) {"\u00D7"} CosineCutoff(r_ij)<br/>
                  gate = sigmoid(W_gate {"\u00B7"} edge_fea)<br/>
                  msg_j = gate {"\u00D7"} (W {"\u00B7"} h_j + b)<br/>
                  h_i = h_i + {"\u03A3"}_j msg_j
                </div>
                <div style={{ color: T.muted, fontSize: 10 }}>
                  CGCNN-style gated convolution. Each neighbor sends a message weighted by
                  the distance-dependent gate. 100 Gaussian basis functions span 0{"\u20137"} {"\u00C5"}.
                </div>
              </div>
            )}
            {layer === "threebody" && (
              <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: T.dn5 }}>3-Body (Angular Triplet) Convolution</strong>
                <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                  cos{"\u03B8"} = r_ij {"\u00B7"} r_ik / (|r_ij| |r_ik|)<br/>
                  angle_fea = Gaussian_angle(cos{"\u03B8"})<br/>
                  triplet_msg = MLP(h_j {"\u2295"} h_k {"\u2295"} angle_fea)<br/>
                  h_i = h_i + {"\u03A3"}_{"{j,k}"} triplet_msg
                </div>
                <div style={{ color: T.muted, fontSize: 10 }}>
                  Angular information (bond angles) captures directional bonding.
                  Critical for tetrahedral semiconductors (Si, GaAs) and octahedral oxides (TiO{"\u2082"}).
                </div>
              </div>
            )}
            {layer === "vector" && (
              <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: T.dn3 }}>Equivariant Vector Aggregation (PaiNN-style)</strong>
                <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                  {"\u0072\u0302"}_ij = (r_j - r_i) / |r_j - r_i|  <span style={{ color: T.muted }}>// unit vector</span><br/>
                  w_j = sigmoid(MLP(h_j)) {"\u00B7"} cutoff(r_ij)<br/>
                  v_i = {"\u03A3"}_j w_j {"\u00B7"} {"\u0072\u0302"}_ij  <span style={{ color: T.muted }}>// SO(3)-equivariant!</span><br/><br/>
                  F_direct_i = MLP(h_i) {"\u00B7"} v_i
                </div>
                <div style={{ color: T.muted, fontSize: 10 }}>
                  The unit vectors {"\u0072\u0302"}_ij rotate with the system. Multiplying by scalar
                  gates preserves equivariance. This gives direct force prediction that
                  automatically satisfies rotational symmetry.
                </div>
              </div>
            )}
            {layer === "global" && (
              <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: T.dn6 }}>Global Conditioning (Charge + Functional)</strong>
                <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.border}`, margin: "6px 0" }}>
                  charge_emb = Linear(one_hot(charge))  <span style={{ color: T.muted }}>// [-2,-1,0,+1,+2]</span><br/>
                  lot_emb = Linear(one_hot(functional))  <span style={{ color: T.muted }}>// [HSE,PBE,...]</span><br/><br/>
                  h_i = h_i + charge_emb + lot_emb  <span style={{ color: T.muted }}>// added to ALL atoms</span>
                </div>
                <div style={{ color: T.muted, fontSize: 10 }}>
                  A single model handles multiple charge states and DFT functionals.
                  The charge embedding shifts the energy landscape for all atoms uniformly,
                  while the functional embedding accounts for systematic DFT-level differences.
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={"Hyperparameters"} color={T.dn4}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}` }}>
              {[
                { param: "atom_fea_len", val: "128", desc: "Feature dimension" },
                { param: "num_conv", val: "6", desc: "Interaction blocks" },
                { param: "num_gaussians", val: "100", desc: "Radial basis functions" },
                { param: "cutoff", val: "7.0 \u00C5", desc: "Neighbor cutoff radius" },
                { param: "max_neighbors", val: "24", desc: "Max neighbors per atom" },
                { param: "dropout", val: "0.1", desc: "MC Dropout rate" },
                { param: "weight_energy", val: "0.05", desc: "Energy loss weight" },
                { param: "weight_force", val: "0.95", desc: "Force loss weight" },
                { param: "weight_stress", val: "0.00", desc: "Stress loss weight" },
                { param: "learning_rate", val: "1e-3", desc: "Initial LR (AdamW)" },
              ].map(p => (
                <div key={p.param} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                  <span style={{ color: T.dn4, fontWeight: 600, width: 130 }}>{p.param}</span>
                  <span style={{ color: T.ink, width: 60 }}>{p.val}</span>
                  <span style={{ color: T.muted }}>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title={"Training Data: Cd-Zn-X System"} color={T.dn1}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 8px" }}>
              DefectNet is trained on DFT data for <strong style={{ color: T.dn1 }}>CdTe, CdSe, CdS, ZnTe, ZnSe, ZnS</strong> semiconductors
              with point defects at multiple charge states:
            </p>
            {[
              { data: "Bulk structures (neutral)", count: "~2,000", func: "HSE + PBE", color: T.dn1 },
              { data: "Defect structures (neutral)", count: "~3,500", func: "HSE + PBE", color: T.dn3 },
              { data: "Defect structures (charged)", count: "~4,800", func: "HSE + PBE", color: T.dn5 },
              { data: "Charge states covered", count: "-2, -1, 0, +1, +2", func: "\u2014", color: T.dn4 },
            ].map(d => (
              <div key={d.data} style={{
                marginBottom: 4, padding: "4px 8px", borderRadius: 4,
                background: d.color + "08", border: `1px solid ${d.color}12`,
                display: "flex", gap: 8, fontSize: 10,
              }}>
                <span style={{ color: d.color, fontWeight: 600, flex: "0 0 180px" }}>{d.data}</span>
                <span style={{ color: T.ink }}>{d.count}</span>
                <span style={{ color: T.muted }}>{d.func}</span>
              </div>
            ))}
            <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>
              Loss is force-dominated (95% weight) because forces are the primary MD driver.
              Energy contributes 5% to ensure thermodynamic consistency.
            </div>
          </div>
        </Card>

        <Card title={"Performance"} color={T.dn6}>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${T.dn6}` }}>
                    {["Metric", "DefectNet", "M3GNet", "CHGNet"].map(h => (
                      <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: T.dn6, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Energy MAE (meV/atom)", dn: "4.2", m3: "12.8", chg: "8.1" },
                    { metric: "Force MAE (meV/\u00C5)", dn: "28", m3: "71", chg: "45" },
                    { metric: "Charged defect E (meV)", dn: "18", m3: "52", chg: "34" },
                    { metric: "Parameters", dn: "1.2M", m3: "0.4M", chg: "2.8M" },
                  ].map(row => (
                    <tr key={row.metric} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "4px 6px" }}>{row.metric}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace", color: "#16a34a", fontWeight: 700 }}>{row.dn}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace" }}>{row.m3}</td>
                      <td style={{ padding: "4px 6px", fontFamily: "monospace" }}>{row.chg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
function PipelineModule() {
  const [active, setActive] = useState("struct");
  const [activeBlock, setActiveBlock] = useState("representation");
  const [molIdx, setMolIdx] = useState(0);
  const mol = MOLECULES[molIdx];

  const { atoms, edges, triplets, gnn } = useMemo(() => {
    const atoms = mol.atoms;
    const edges = buildEdges(atoms);
    const triplets = buildTriplets(edges, atoms.length);
    const gnn = runGNN(atoms, edges, triplets, mol);
    return { atoms, edges, triplets, gnn };
  }, [mol]);

  const render = () => {
    switch (active) {
      case "struct": return <SecStruct mol={mol} atoms={atoms} edges={edges} triplets={triplets} />;
      case "embed": return <SecEmbed atoms={atoms} />;
      case "gauss": return <SecGauss edges={edges} atoms={atoms} />;
      case "cutoff": return <SecCutoff edges={edges} atoms={atoms} />;
      case "angular": return <SecAngular edges={edges} triplets={triplets} atoms={atoms} />;
      case "conv": return <SecConv atoms={atoms} edges={edges} triplets={triplets} gnn={gnn} />;
      case "predict": return <SecPredict atoms={atoms} gnn={gnn} mol={mol} />;
      case "animate": return <SecAnimate atoms={atoms} edges={edges} triplets={triplets} gnn={gnn} mol={mol} />;
      case "params":  return <SecParams />;
      case "equiv": return <SecEquivariance />;
      case "longrange": return <SecLongRange />;
      case "uncertainty": return <SecUncertainty />;
      case "defectnet": return <SecDefectNet />;
      case "mlflow":  return <DefectNetFlowAnimation />;
      default: return null;
    }
  };

  const section = PIPELINE_SECTIONS.find(s => s.id === active);
  const stepIdx = PIPELINE_SECTIONS.findIndex(s => s.id === active);
  const blockSections = PIPELINE_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{
        display: "flex",
        padding: "8px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
      }}>
        {PIPELINE_BLOCKS.map(b => (
          <button key={b.id} onClick={() => {
            setActiveBlock(b.id);
            const first = PIPELINE_SECTIONS.find(s => s.block === b.id);
            if (first) setActive(first.id);
          }} style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg,
            color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "inherit",
            fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}>
            {b.label}
          </button>
        ))}
        {/* Molecule selector */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: T.muted }}>Molecule:</span>
          {MOLECULES.map((m, i) => (
            <button key={m.id} onClick={() => setMolIdx(i)} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
              background: molIdx === i ? `${m.color}22` : T.bg,
              border: `1.5px solid ${molIdx === i ? m.color : T.border}`,
              color: molIdx === i ? m.color : T.muted, fontFamily: "inherit", fontWeight: 700,
            }}>{m.name}</button>
          ))}
        </div>
      </div>

      {/* Section tabs within active block */}
      <div style={{
        display: "flex",
        padding: "6px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
        flexWrap: "wrap",
      }}>
        {blockSections.map(s => {
          const globalIdx = PIPELINE_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg,
              color: active === s.id ? s.color : T.muted,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              fontWeight: active === s.id ? 700 : 400,
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: section.color, letterSpacing: 0.5 }}>
            {section.label}
          </div>
        </div>

        {render()}
        <NextTopicCard sections={PIPELINE_SECTIONS} activeId={active} />
        <ChapterReferences chapterId="pipeline" />
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: "10px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: T.panel,
      }}>
        <button onClick={() => {
          if (stepIdx > 0) {
            const prev = PIPELINE_SECTIONS[stepIdx - 1];
            setActive(prev.id);
            setActiveBlock(prev.block);
          }
        }} disabled={stepIdx === 0} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: stepIdx === 0 ? T.surface : section.color + "22",
          border: `1px solid ${stepIdx === 0 ? T.border : section.color}`,
          color: stepIdx === 0 ? T.muted : section.color,
          cursor: stepIdx === 0 ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Back</button>
        <div style={{ fontSize: 11, color: T.muted }}>
          {stepIdx + 1} / {PIPELINE_SECTIONS.length}
        </div>
        <button onClick={() => {
          if (stepIdx < PIPELINE_SECTIONS.length - 1) {
            const next = PIPELINE_SECTIONS[stepIdx + 1];
            setActive(next.id);
            setActiveBlock(next.block);
          }
        }} disabled={stepIdx === PIPELINE_SECTIONS.length - 1} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: stepIdx === PIPELINE_SECTIONS.length - 1 ? T.surface : section.color + "22",
          border: `1px solid ${stepIdx === PIPELINE_SECTIONS.length - 1 ? T.border : section.color}`,
          color: stepIdx === PIPELINE_SECTIONS.length - 1 ? T.muted : section.color,
          cursor: stepIdx === PIPELINE_SECTIONS.length - 1 ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

function ElectronsModule() {
  return <div><ElectronOriginsModule /><div style={{ padding: "0 24px 24px" }}><ChapterReferences chapterId="electrons" /></div></div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3: FORCE FIELD TERMS (Classical Potentials)
// ═══════════════════════════════════════════════════════════════════════════

// ── MATH ────────────────────────────────────────────────────────────────────
const sq  = x => x * x;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ── SVG PLOT ─────────────────────────────────────────────────────────────────
function Plot({ data, xMin, xMax, yMin, yMax, color, markerX, width=340, height=180, xLabel="", yLabel="", extra=[] }) {
  const pad = { l:44, r:12, t:12, b:30 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;

  const toSX = x => pad.l + ((x - xMin) / (xMax - xMin)) * W;
  const toSY = y => pad.t + H - ((y - yMin) / (yMax - yMin)) * H;

  const pts = data
    .filter(([x,y]) => x >= xMin && x <= xMax && y >= yMin && y <= yMax)
    .map(([x,y]) => `${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`).join(" ");

  const markerSX = markerX != null ? toSX(markerX) : null;

  const xTicks = 5;
  const yTicks = 4;

  return (
    <svg width={width} height={height} style={{ display:"block", background: T.surface, borderRadius: 8, border:`1px solid ${T.border}` }}>
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t+H} stroke={T.dim} strokeWidth={1}/>
      <line x1={pad.l} y1={pad.t+H} x2={pad.l+W} y2={pad.t+H} stroke={T.dim} strokeWidth={1}/>
      {yMin < 0 && yMax > 0 && (
        <line x1={pad.l} y1={toSY(0)} x2={pad.l+W} y2={toSY(0)}
          stroke={T.dim} strokeWidth={1} strokeDasharray="3 3"/>
      )}
      {Array.from({length:xTicks+1},(_,i)=>{
        const v = xMin + i*(xMax-xMin)/xTicks;
        const sx = toSX(v);
        return (
          <g key={i}>
            <line x1={sx} y1={pad.t+H} x2={sx} y2={pad.t+H+4} stroke={T.dim} strokeWidth={1}/>
            <text x={sx} y={pad.t+H+14} textAnchor="middle" fill={T.muted} fontSize={9}>{v.toFixed(1)}</text>
          </g>
        );
      })}
      {Array.from({length:yTicks+1},(_,i)=>{
        const v = yMin + i*(yMax-yMin)/yTicks;
        const sy = toSY(v);
        return (
          <g key={i}>
            <line x1={pad.l-4} y1={sy} x2={pad.l} y2={sy} stroke={T.dim} strokeWidth={1}/>
            <text x={pad.l-6} y={sy+3} textAnchor="end" fill={T.muted} fontSize={9}>{v.toFixed(1)}</text>
          </g>
        );
      })}
      <text x={pad.l+W/2} y={height-2} textAnchor="middle" fill={T.muted} fontSize={10}>{xLabel}</text>
      <text x={10} y={pad.t+H/2} textAnchor="middle" fill={T.muted} fontSize={10}
        transform={`rotate(-90, 10, ${pad.t+H/2})`}>{yLabel}</text>
      {extra.map(({pts:ep, color:ec, dash}, i) => (
        <polyline key={i} points={ep} fill="none" stroke={ec} strokeWidth={1.5}
          strokeDasharray={dash||"none"} opacity={0.5}/>
      ))}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5}/>
      {markerSX != null && (
        <>
          <line x1={markerSX} y1={pad.t} x2={markerSX} y2={pad.t+H}
            stroke={T.gold} strokeWidth={1.5} strokeDasharray="4 3"/>
          <circle cx={markerSX} cy={toSY(clamp(
            data.reduce((best,[x,y]) => Math.abs(x-markerX)<Math.abs(best[0]-markerX)?[x,y]:best, data[0])[1],
            yMin, yMax
          ))} r={5} fill={T.gold} stroke={T.panel} strokeWidth={1.5}/>
        </>
      )}
    </svg>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit, format }) {
  const fmt = format || (v => v.toFixed(2));
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:12, color:T.muted }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color, fontFamily:"monospace" }}>
          {fmt(value)}{unit||""}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(+e.target.value)}
        style={{ width:"100%", accentColor:color, cursor:"pointer" }}/>
    </div>
  );
}

function ResultBox({ label, value, color, sub }) {
  return (
    <div style={{
      background: color+"11", border:`1px solid ${color}33`,
      borderRadius:8, padding:"8px 12px", textAlign:"center",
    }}>
      <div style={{ fontSize:10, color:T.muted, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:800, color, fontFamily:"monospace" }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, fontSize:12 }}>
      <span style={{ color:T.muted, fontFamily:"monospace", flex:1 }}>{eq}</span>
      <span style={{ color:T.dim }}>=</span>
      <span style={{ color:color||T.ink, fontWeight:700, fontFamily:"monospace", minWidth:70, textAlign:"right" }}>{result}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BOND HARMONIC
// ─────────────────────────────────────────────────────────────────────────────
function BondSection() {
  const [r, setR] = useState(2.5);
  const [r0, setR0] = useState(2.35);
  const [kb, setKb] = useState(15.0);

  const dr = r - r0;
  const U = 0.5 * kb * dr * dr;
  const F = -kb * dr;

  const N = 120;
  const energyCurve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(4.5/N);
    return [x, 0.5*kb*sq(x-r0)];
  });
  const forceCurve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(4.5/N);
    return [x, -kb*(x-r0)];
  });

  return (
    <Card color={T.ff_bond} title="Bond (Harmonic)" formula="U = ½ kᵦ(r − r₀)²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine two balls connected by a spring. Push them together or pull them apart {"\u2014"} the spring always fights back toward its natural length. The stiffer the spring (higher k), the harder it resists. That is exactly what the <strong>harmonic bond potential</strong> does: it treats every chemical bond as a tiny spring. Stretch a C{"\u2013"}C bond beyond its resting length and it pulls back; compress it and it pushes out. The catch? A real spring can snap, but this formula says the energy rises forever {"\u2014"} the bond never breaks.
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={energyCurve} xMin={0.5} xMax={4.5} yMin={0} yMax={Math.min(30, 0.5*kb*sq(4.5-r0))}
            color={T.ff_bond} markerX={r} width={340} height={170} xLabel="r (Å)" yLabel="U (eV)"/>
          <div style={{ marginTop:6 }}>
            <Plot data={forceCurve} xMin={0.5} xMax={4.5} yMin={-kb*2} yMax={kb*2}
              color={T.ff_bond} markerX={r} width={340} height={110} xLabel="r (Å)" yLabel="F (eV/Å)"/>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — current distance" value={r} min={0.8} max={4.5} step={0.01} onChange={setR} color={T.ff_bond} unit=" Å"/>
          <SliderRow label="r₀ — equilibrium" value={r0} min={1.0} max={3.5} step={0.05} onChange={setR0} color={T.ff_bond} unit=" Å"/>
          <SliderRow label="kᵦ — stiffness" value={kb} min={1} max={40} step={0.5} onChange={setKb} color={T.ff_bond} unit=" eV/Å²"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`r − r₀ = ${r.toFixed(2)} − ${r0.toFixed(2)}`} result={`${dr.toFixed(3)} Å`} color={T.ff_bond}/>
            <CalcRow eq={`(r−r₀)² = ${dr.toFixed(3)}²`} result={`${sq(dr).toFixed(4)} Å²`} color={T.ff_bond}/>
            <CalcRow eq={`½ × ${kb} × ${sq(dr).toFixed(4)}`} result={`${U.toFixed(4)} eV`} color={T.ff_bond}/>
            <CalcRow eq={`F = −kᵦ(r−r₀)`} result={`${F.toFixed(3)} eV/Å`} color={F>0?T.ff_vdw:T.ff_bond}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(3)} eV`} color={T.ff_bond}/>
            <ResultBox label="Force F" value={`${F.toFixed(3)} eV/Å`} color={F>0?T.ff_vdw:T.ff_bond}
              sub={F>0?"← pushes outward":F<0?"→ pulls inward":"equilibrium"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Symmetric spring.</strong> Stretch or compress by the same amount → same energy cost.
            Force is zero only at r₀. Always pushes back toward equilibrium.
            <br/><strong style={{color:T.ff_bond}}>Limitation:</strong> bond never breaks — energy rises forever.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ANGLE HARMONIC
// ─────────────────────────────────────────────────────────────────────────────
function AngleSection() {
  const [theta, setTheta] = useState(109.5);
  const [theta0, setTheta0] = useState(109.5);
  const [kth, setKth] = useState(2.5);

  const toRad = d => d * Math.PI / 180;
  const dth = toRad(theta) - toRad(theta0);
  const U = 0.5 * kth * dth * dth;

  const N = 120;
  const energyCurve = Array.from({length:N},(_,i)=>{
    const deg = 30 + i*(150/N);
    const dt = toRad(deg) - toRad(theta0);
    return [deg, 0.5*kth*dt*dt];
  });

  // SVG angle picture
  const cx=70, cy=100, r1=55;
  const ang1 = -140 * Math.PI/180;
  const ang2 = ang1 + toRad(theta);
  const ax1 = cx + r1*Math.cos(ang1), ay1 = cy + r1*Math.sin(ang1);
  const ax2 = cx + r1*Math.cos(ang2), ay2 = cy + r1*Math.sin(ang2);

  return (
    <Card color={T.ff_angle} title="Angle (Harmonic)" formula="U = ½ kθ(θ − θ₀)²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Think of a door hinge with a built-in return spring. Open the door past its resting angle and the spring pulls it back; push it the other way and it resists equally. The <strong>angle potential</strong> works the same way: three atoms form a hinge, and the middle atom is the pivot. A stiff hinge (high k{"\u03B8"}) means the molecule is rigid like diamond; a loose hinge means it is floppy like a polymer chain. The formula is identical to the bond spring {"\u2014"} just swap distance for angle.
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={energyCurve} xMin={30} xMax={180} yMin={0} yMax={Math.max(0.5, 0.5*kth*sq(toRad(30)-toRad(theta0)))}
            color={T.ff_angle} markerX={theta} width={340} height={170} xLabel="θ (degrees)" yLabel="U (eV)"/>
          {/* Molecule angle SVG */}
          <svg viewBox="0 0 340 130" style={{ marginTop:6, background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, display:"block", width:"100%", maxWidth:340 }}>
            {/* Bonds */}
            <line x1={cx} y1={cy} x2={ax1} y2={ay1} stroke={T.ff_angle} strokeWidth={3}/>
            <line x1={cx} y1={cy} x2={ax2} y2={ay2} stroke={T.ff_angle} strokeWidth={3}/>
            {/* Arc */}
            <path d={`M ${cx+25*Math.cos(ang1)} ${cy+25*Math.sin(ang1)} A 25 25 0 ${theta>180?1:0} 1 ${cx+25*Math.cos(ang2)} ${cy+25*Math.sin(ang2)}`}
              fill="none" stroke={T.gold} strokeWidth={2}/>
            {/* Atoms */}
            <circle cx={cx} cy={cy} r={16} fill={T.ff_angle+"33"} stroke={T.ff_angle} strokeWidth={2}/>
            <text x={cx} y={cy+4} textAnchor="middle" fill={T.ff_angle} fontSize={11} fontWeight="bold">Zn</text>
            <circle cx={ax1} cy={ay1} r={13} fill={T.ff_vdw+"33"} stroke={T.ff_vdw} strokeWidth={2}/>
            <text x={ax1} y={ay1+4} textAnchor="middle" fill={T.ff_vdw} fontSize={11} fontWeight="bold">Te</text>
            <circle cx={ax2} cy={ay2} r={13} fill={T.ff_vdw+"33"} stroke={T.ff_vdw} strokeWidth={2}/>
            <text x={ax2} y={ay2+4} textAnchor="middle" fill={T.ff_vdw} fontSize={11} fontWeight="bold">Te</text>
            <text x={cx+40} y={cy-12} fill={T.gold} fontSize={13} fontWeight="bold">θ={theta.toFixed(1)}°</text>
            {/* Equilibrium dashed */}
            <line x1={cx} y1={cy} x2={cx+r1*Math.cos(ang1+toRad(theta0))} y2={cy+r1*Math.sin(ang1+toRad(theta0))}
              stroke={T.dim} strokeWidth={1.5} strokeDasharray="5 3"/>
            <text x={200} y={50} fill={T.muted} fontSize={10}>dashed = θ₀={theta0.toFixed(0)}°</text>
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="θ — current angle" value={theta} min={30} max={175} step={0.5} onChange={setTheta} color={T.ff_angle} unit="°"/>
          <SliderRow label="θ₀ — equilibrium angle" value={theta0} min={60} max={160} step={0.5} onChange={setTheta0} color={T.ff_angle} unit="°"/>
          <SliderRow label="kθ — angular stiffness" value={kth} min={0.1} max={10} step={0.1} onChange={setKth} color={T.ff_angle} unit=" eV/rad²"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`θ = ${theta.toFixed(1)}° = ${toRad(theta).toFixed(4)} rad`} result="" color={T.ff_angle}/>
            <CalcRow eq={`θ₀ = ${theta0.toFixed(1)}° = ${toRad(theta0).toFixed(4)} rad`} result="" color={T.ff_angle}/>
            <CalcRow eq={`θ − θ₀ = ${dth.toFixed(4)} rad`} result={`${(dth*180/Math.PI).toFixed(2)}°`} color={T.ff_angle}/>
            <CalcRow eq={`½ × ${kth} × ${sq(dth).toFixed(5)}`} result={`${U.toFixed(5)} eV`} color={T.ff_angle}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={T.ff_angle}/>
            <ResultBox label="Δθ" value={`${(dth*180/Math.PI).toFixed(1)}°`} color={T.ff_angle}
              sub={Math.abs(dth) < 0.01 ? "at equilibrium" : dth>0?"opened":"closed"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Same formula as bond — but for angles.</strong> Three atoms.
            Middle atom is the hinge. kθ controls how rigid the angle is.
            Large kθ = rigid (diamond-like). Small kθ = floppy.
            <br/><strong style={{color:T.ff_angle}}>Key:</strong> θ₀=109.5° for tetrahedral bonding (like Cd in CdTe).
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VAN DER WAALS (LJ 12-6)
// ─────────────────────────────────────────────────────────────────────────────
function VdwSection() {
  const [r, setR] = useState(3.82);
  const [eps, setEps] = useState(0.0104);
  const [sig, setSig] = useState(3.40);

  const lj = (rr) => {
    const s = sig/rr;
    return 4*eps*(Math.pow(s,12) - Math.pow(s,6));
  };
  const U = lj(r);
  const rMin = Math.pow(2, 1/6) * sig;

  const N = 150;
  const curve = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    const y = lj(x);
    return [x, y];
  }).filter(([,y])=>y<eps*6);

  // repulsive and attractive separately for annotation
  const rep = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    return [x, 4*eps*Math.pow(sig/x,12)];
  }).filter(([,y])=>y<eps*6);
  const att = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    return [x, -4*eps*Math.pow(sig/x,6)];
  }).filter(([,y])=>y>-eps*1.5);

  const yMax = eps*3, yMin = -eps*1.5;

  const repPts = rep.filter(([,y])=>y<yMax).map(([x,y])=>{
    const W2=340, pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r, HH=170-pad.t-pad.b;
    const xMin=sig*0.85, xMax=sig*3.35;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");
  const attPts = att.map(([x,y])=>{
    const W2=340, pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r, HH=170-pad.t-pad.b;
    const xMin=sig*0.85, xMax=sig*3.35;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");

  return (
    <Card color={T.ff_vdw} title="van der Waals (Lennard-Jones 12-6)" formula="U = 4ε[(σ/r)¹² − (σ/r)⁶]">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine two people on a dance floor. From far away they gently attract each other (want to socialize). As they get close there is a comfortable personal-space distance where both are happiest {"\u2014"} that is the <strong>energy minimum</strong> ({"\u03C3"}). But if you shove them even closer, they push back hard because nobody likes their personal bubble invaded. The <strong>Lennard-Jones potential</strong> captures exactly this: gentle long-range attraction (London dispersion, the r{"\u2076"} term) and violent short-range repulsion when electron clouds overlap (the r{"\u00B9\u00B2"} wall).
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={sig*0.85} xMax={sig*3.35} yMin={yMin} yMax={yMax}
            color={T.ff_vdw} markerX={r} width={340} height={170} xLabel="r (Å)" yLabel="U (eV)"
            extra={[
              {pts:repPts, color:T.ff_bond, dash:"4 3"},
              {pts:attPts, color:T.ff_coul, dash:"4 3"},
            ]}/>
          <div style={{ marginTop:6, fontSize:10, color:T.muted, display:"flex", gap:16, padding:"0 8px" }}>
            <span>── <span style={{color:T.ff_vdw}}>Total U</span></span>
            <span>- - <span style={{color:T.ff_bond}}>Repulsive r¹²</span></span>
            <span>- - <span style={{color:T.ff_coul}}>Attractive r⁶</span></span>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — distance" value={r} min={sig*0.85} max={sig*3.3} step={0.01}
            onChange={setR} color={T.ff_vdw} unit=" Å"/>
          <SliderRow label="ε — well depth (attraction)" value={eps} min={0.001} max={0.05} step={0.001}
            onChange={setEps} color={T.ff_vdw} unit=" eV" format={v=>v.toFixed(4)}/>
          <SliderRow label="σ — zero-crossing radius" value={sig} min={2.0} max={5.5} step={0.05}
            onChange={setSig} color={T.ff_vdw} unit=" Å"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`σ/r = ${sig.toFixed(2)}/${r.toFixed(2)}`} result={`${(sig/r).toFixed(4)}`} color={T.ff_vdw}/>
            <CalcRow eq={`(σ/r)⁶`} result={`${Math.pow(sig/r,6).toFixed(4)}`} color={T.ff_coul}/>
            <CalcRow eq={`(σ/r)¹²`} result={`${Math.pow(sig/r,12).toFixed(4)}`} color={T.ff_bond}/>
            <CalcRow eq={`4ε×[(σ/r)¹²−(σ/r)⁶]`} result={`${U.toFixed(5)} eV`} color={T.ff_vdw}/>
            <CalcRow eq={`r_min = 2^(1/6)×σ`} result={`${rMin.toFixed(3)} Å`} color={T.gold}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={U>0?T.ff_bond:T.ff_vdw}
              sub={U>0?"repulsive":"attractive"}/>
            <ResultBox label="r_min (energy minimum)" value={`${rMin.toFixed(2)} Å`} color={T.gold}
              sub={`U_min = −ε = ${(-eps).toFixed(4)} eV`}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Non-bonded interactions between any two atoms.</strong>
            <br/><span style={{color:T.ff_bond}}>r¹²</span> = violent repulsion when electron clouds overlap.
            <br/><span style={{color:T.ff_coul}}>r⁶</span> = gentle London dispersion attraction.
            <br/>σ = where they "touch". ε = how sticky they are.
            Falls off as 1/r⁶ — short range. Ignore beyond ~10 Å.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COULOMB
// ─────────────────────────────────────────────────────────────────────────────
function CoulombSection() {
  const [r, setR] = useState(2.81);
  const [qi, setQi] = useState(1.0);
  const [qj, setQj] = useState(-1.0);

  // 1/(4πε₀) in eV·Å / e² = 14.4
  const k_e = 14.4;
  const U = k_e * qi * qj / r;
  const F = -k_e * qi * qj / (r*r);  // attractive = toward each other

  const N = 120;
  const curve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(9.5/N);
    return [x, k_e*qi*qj/x];
  });
  const yMin = Math.min(-5, k_e*qi*qj/0.5);
  const yMax = Math.max(5, k_e*qi*qj/0.5);

  return (
    <Card color={T.ff_coul} title="Coulomb (Electrostatic)" formula="U = qᵢqⱼ / (4πε₀ rᵢⱼ)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Think of two magnets. Opposite poles snap together from across the table; same poles push each other away. <strong>Coulomb{"\u2019"}s law</strong> is the atomic version: positive meets negative {"\u2192"} attraction (Na{"\u207A"} and Cl{"\u207B"} in table salt). Positive meets positive {"\u2192"} repulsion. The key difference from van der Waals? This force is like someone <strong>shouting</strong> across a room (1/r, slow decay) rather than whispering to a neighbor (1/r{"\u2076"}, fast decay). Even atoms 100 {"\u00C5"} apart still feel the Coulomb pull, which is why ionic crystals are so strongly bound.
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={0.5} xMax={10} yMin={clamp(yMin,-20,0)-0.5} yMax={clamp(yMax,0,20)+0.5}
            color={T.ff_coul} markerX={r} width={340} height={180} xLabel="r (Å)" yLabel="U (eV)"/>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          {/* Charge selector */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>qᵢ — charge on atom i</div>
            <div style={{ display:"flex", gap:6 }}>
              {[-2,-1,0,+1,+2].map(v=>(
                <button key={v} onClick={()=>setQi(v)} style={{
                  flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700,
                  background: qi===v ? T.ff_coul+"33" : T.surface,
                  border:`1.5px solid ${qi===v ? T.ff_coul : T.border}`,
                  color: qi===v ? T.ff_coul : T.muted, cursor:"pointer",
                }}>{v>0?"+":""}{v}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>qⱼ — charge on atom j</div>
            <div style={{ display:"flex", gap:6 }}>
              {[-2,-1,0,+1,+2].map(v=>(
                <button key={v} onClick={()=>setQj(v)} style={{
                  flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700,
                  background: qj===v ? T.ff_dih+"33" : T.surface,
                  border:`1.5px solid ${qj===v ? T.ff_dih : T.border}`,
                  color: qj===v ? T.ff_dih : T.muted, cursor:"pointer",
                }}>{v>0?"+":""}{v}</button>
              ))}
            </div>
          </div>
          <SliderRow label="r — distance" value={r} min={0.5} max={10} step={0.05} onChange={setR} color={T.ff_coul} unit=" Å"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`qᵢ × qⱼ = ${qi} × ${qj}`} result={`${qi*qj} e²`}
              color={qi*qj<0?T.ff_vdw:qi*qj>0?T.ff_bond:T.muted}/>
            <CalcRow eq={`k_e = 1/(4πε₀) = 14.4 eV·Å/e²`} result="constant"/>
            <CalcRow eq={`U = 14.4 × ${qi*qj} / ${r.toFixed(2)}`} result={`${U.toFixed(3)} eV`} color={T.ff_coul}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(3)} eV`} color={U<0?T.ff_vdw:U>0?T.ff_bond:T.muted}
              sub={U<0?"attractive":U>0?"repulsive":"neutral (q=0)"}/>
            <ResultBox label="Interaction type" value={qi*qj<0?"Attract":qi*qj>0?"Repel":"None"}
              color={qi*qj<0?T.ff_vdw:qi*qj>0?T.ff_bond:T.muted}
              sub={qi*qj<0?"opposite charges":qi*qj>0?"like charges":"one is neutral"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Long-range force between charged atoms.</strong>
            Falls off as 1/r — much slower than vdW (1/r⁶). Still significant at 100 Å!
            <br/><strong style={{color:T.ff_coul}}>Sign rule:</strong> same charges (+×+ or −×−) → U positive → repel.
            Opposite (+×−) → U negative → attract.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIHEDRAL / TORSION
// ─────────────────────────────────────────────────────────────────────────────
function DihedralSection() {
  const [phi, setPhi] = useState(0);
  const [n, setN] = useState(3);
  const [kn, setKn] = useState(0.3);
  const [delta, setDelta] = useState(0);

  const toRad = d => d*Math.PI/180;
  const U = kn * (1 + Math.cos(n*toRad(phi) - toRad(delta)));

  const N = 180;
  const curve = Array.from({length:N},(_,i)=>{
    const p = -180 + i*(360/N);
    return [p, kn*(1+Math.cos(n*toRad(p)-toRad(delta)))];
  });

  // 4-atom torsion SVG
  const cx=170, cy=75;
  const phiR = toRad(phi);
  // atoms along z-axis, dihedral is view from the end
  const r=45;
  const atom1 = [cx-60, cy];
  const atom2 = [cx-20, cy];
  const atom3 = [cx+20, cy];
  const atom4 = [cx+60, cy];
  // dihedral = rotation of atom1 relative to atom4 around 2-3 axis (view from end)
  const e1x = cx-20 + r*Math.cos(Math.PI + phiR);
  const e1y = cy   + r*Math.sin(Math.PI + phiR);
  const e4x = cx+20 + r*Math.cos(0);
  const e4y = cy;

  return (
    <Card color={T.ff_dih} title="Dihedral (Torsion)" formula="U = Σₙ kₙ[1 + cos(nϕ − δₙ)]">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Picture a revolving door with notches. As you spin it, the door clicks into preferred positions (staggered) and resists stopping at awkward positions (eclipsed). The <strong>dihedral potential</strong> does the same for four atoms in a chain: it creates energy hills and valleys as one end rotates relative to the other around the central bond. The number of {"\u201C"}notches{"\u201D"} per full rotation is n {"\u2014"} for a C{"\u2013"}C bond n=3 gives three comfortable staggered positions and three uncomfortable eclipsed positions per 360{"\u00B0"}.
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={-180} xMax={180} yMin={0} yMax={kn*2.1}
            color={T.ff_dih} markerX={phi} width={340} height={170} xLabel="ϕ (degrees)" yLabel="U (eV)"/>

          {/* 4-atom side + end view */}
          <svg viewBox="0 0 340 120" style={{ marginTop:6, background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, display:"block", width:"100%", maxWidth:340 }}>
            {/* side view */}
            <text x={85} y={15} textAnchor="middle" fill={T.muted} fontSize={9}>Side view</text>
            <line x1={atom1[0]} y1={atom1[1]} x2={atom2[0]} y2={atom2[1]} stroke={T.ff_dih} strokeWidth={2}/>
            <line x1={atom2[0]} y1={atom2[1]} x2={atom3[0]} y2={atom3[1]} stroke={T.ff_dih} strokeWidth={2.5}/>
            <line x1={atom3[0]} y1={atom3[1]} x2={atom4[0]} y2={atom4[1]} stroke={T.ff_dih} strokeWidth={2}/>
            {[atom1,atom2,atom3,atom4].map(([ax,ay],i)=>(
              <g key={i}>
                <circle cx={ax} cy={ay} r={13} fill={[T.ff_vdw,T.ff_dih,T.ff_dih,T.ff_vdw][i]+"33"}
                  stroke={[T.ff_vdw,T.ff_dih,T.ff_dih,T.ff_vdw][i]} strokeWidth={1.5}/>
                <text x={ax} y={ay+4} textAnchor="middle"
                  fill={[T.ff_vdw,T.ff_dih,T.ff_dih,T.ff_vdw][i]} fontSize={9} fontWeight="bold">
                  {["C","C","C","C"][i]}{i+1}
                </text>
              </g>
            ))}

            {/* end view — looking down C2-C3 */}
            <text x={265} y={15} textAnchor="middle" fill={T.muted} fontSize={9}>End view</text>
            <circle cx={265} cy={70} r={30} fill="none" stroke={T.dim} strokeWidth={1} strokeDasharray="3 3"/>
            {/* C2 at centre (black dot) */}
            <circle cx={265} cy={70} r={8} fill={T.ff_dih+"55"} stroke={T.ff_dih} strokeWidth={2}/>
            {/* C1 rotated by phi */}
            <line x1={265} y1={70} x2={265+35*Math.cos(Math.PI/2+phiR)} y2={70+35*Math.sin(Math.PI/2+phiR)}
              stroke={T.ff_vdw} strokeWidth={2}/>
            <circle cx={265+35*Math.cos(Math.PI/2+phiR)} cy={70+35*Math.sin(Math.PI/2+phiR)}
              r={10} fill={T.ff_vdw+"44"} stroke={T.ff_vdw} strokeWidth={1.5}/>
            <text x={265+35*Math.cos(Math.PI/2+phiR)} y={70+35*Math.sin(Math.PI/2+phiR)+4}
              textAnchor="middle" fill={T.ff_vdw} fontSize={9}>C1</text>
            {/* C4 fixed at bottom */}
            <line x1={265} y1={70} x2={265} y2={70+35}
              stroke={T.ff_vdw} strokeWidth={2}/>
            <circle cx={265} cy={70+35} r={10} fill={T.ff_vdw+"44"} stroke={T.ff_vdw} strokeWidth={1.5}/>
            <text x={265} y={70+35+4} textAnchor="middle" fill={T.ff_vdw} fontSize={9}>C4</text>
            {/* angle arc */}
            <text x={265+18} y={70-8} fill={T.gold} fontSize={10} fontWeight="bold">ϕ={phi.toFixed(0)}°</text>
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="ϕ — dihedral angle" value={phi} min={-180} max={180} step={1}
            onChange={setPhi} color={T.ff_dih} unit="°" format={v=>v.toFixed(0)}/>
          <SliderRow label="n — hills per 360°" value={n} min={1} max={6} step={1}
            onChange={setN} color={T.ff_dih} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="kₙ — barrier height" value={kn} min={0.01} max={1.0} step={0.01}
            onChange={setKn} color={T.ff_dih} unit=" eV/mol"/>
          <SliderRow label="δₙ — phase shift" value={delta} min={0} max={180} step={5}
            onChange={setDelta} color={T.ff_dih} unit="°" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`nϕ − δ = ${n}×${phi}° − ${delta}°`} result={`${(n*phi-delta).toFixed(0)}°`} color={T.ff_dih}/>
            <CalcRow eq={`cos(${(n*phi-delta).toFixed(0)}°)`} result={`${Math.cos(toRad(n*phi-delta)).toFixed(4)}`} color={T.ff_dih}/>
            <CalcRow eq={`1 + ${Math.cos(toRad(n*phi-delta)).toFixed(4)}`} result={`${(1+Math.cos(toRad(n*phi-delta))).toFixed(4)}`} color={T.ff_dih}/>
            <CalcRow eq={`${kn} × ${(1+Math.cos(toRad(n*phi-delta))).toFixed(4)}`} result={`${U.toFixed(4)} eV`} color={T.ff_dih}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={T.ff_dih}/>
            <ResultBox label="n = hills per rotation" value={`${n}`} color={T.ff_dih}
              sub={`valley every ${(360/n).toFixed(0)}°`}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Energy cost of twisting 4 atoms.</strong>
            <br/><strong style={{color:T.ff_dih}}>n=3</strong> for C-C bonds → 3 hills (eclipsed) and 3 valleys (staggered) per 360°.
            <br/>Maximum at ϕ where cos=+1 (U=2kₙ). Minimum where cos=−1 (U=0).
            <br/><strong style={{color:T.ff_dih}}>+1 in formula</strong> ensures energy ≥ 0 always.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MORSE (ANHARMONIC)
// ─────────────────────────────────────────────────────────────────────────────
function MorseSection() {
  const [r, setR] = useState(2.5);
  const [De, setDe] = useState(2.3);
  const [a, setA] = useState(1.4);
  const [r0, setR0] = useState(2.35);

  const morse = (rr) => {
    const ex = Math.exp(-a*(rr-r0));
    return De * sq(1-ex);
  };
  const harmonic = (rr) => {
    const k = 2*De*a*a;
    return 0.5*k*sq(rr-r0);
  };

  const U = morse(r);
  const Uharm = harmonic(r);
  const rMin = r0; // morse minimum

  const N = 150;
  const morseCurve = Array.from({length:N},(_,i)=>{
    const x = r0*0.5 + i*(r0*2.5/N);
    return [x, morse(x)];
  });
  const harmCurve = Array.from({length:N},(_,i)=>{
    const x = r0*0.5 + i*(r0*2.5/N);
    const y = harmonic(x);
    return [x, y];
  });

  const yMax = De*1.3, yMin = -0.2;

  const harmPts = harmCurve.filter(([,y])=>y<yMax).map(([x,y])=>{
    const W2=340,pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r,HH=180-pad.t-pad.b;
    const xMin=r0*0.5,xMax=r0*3.0;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");

  return (
    <Card color={T.ff_morse} title="Morse Potential (Anharmonic Bond)" formula="U = Dₑ[1 − e^{−a(r−r₀)}]²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine stretching a rubber band. A little stretch {"\u2014"} it snaps back easily (like the harmonic spring). But keep pulling and eventually it <strong>snaps</strong>: the bond breaks and costs a fixed amount of energy (D{"\u2091"}). Compressing it is much harder {"\u2014"} like trying to squeeze two bowling balls together. The <strong>Morse potential</strong> captures this real-world asymmetry: compression is a steep wall, stretching is a gentle slope that flattens out when the bond breaks. Unlike the harmonic spring, Morse knows that bonds can actually break {"\u2014"} the energy plateaus at D{"\u2091"} instead of rising to infinity.
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={morseCurve} xMin={r0*0.5} xMax={r0*3.0} yMin={yMin} yMax={yMax}
            color={T.ff_morse} markerX={r} width={340} height={180} xLabel="r (Å)" yLabel="U (eV)"
            extra={[{pts:harmPts, color:T.ff_bond, dash:"5 3"}]}/>
          <div style={{ marginTop:6, fontSize:10, color:T.muted, display:"flex", gap:16, padding:"0 8px" }}>
            <span>── <span style={{color:T.ff_morse}}>Morse (real)</span></span>
            <span>- - <span style={{color:T.ff_bond}}>Harmonic (wrong at large r)</span></span>
          </div>
          {/* Asymmetry highlight */}
          <div style={{ marginTop:10, background:T.surface, borderRadius:8, padding:10, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:6, letterSpacing:2 }}>ASYMMETRY at ±0.5Å from r₀</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              <div style={{ textAlign:"center", padding:8, background:T.ff_bond+"11", borderRadius:6, border:`1px solid ${T.ff_bond}33` }}>
                <div style={{ fontSize:10, color:T.muted }}>Compress 0.5Å</div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ff_bond, fontFamily:"monospace" }}>{morse(r0-0.5).toFixed(2)} eV</div>
                <div style={{ fontSize:10, color:T.muted }}>Morse</div>
              </div>
              <div style={{ textAlign:"center", padding:8, background:T.ff_morse+"11", borderRadius:6, border:`1px solid ${T.ff_morse}33` }}>
                <div style={{ fontSize:10, color:T.muted }}>Stretch 0.5Å</div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ff_morse, fontFamily:"monospace" }}>{morse(r0+0.5).toFixed(2)} eV</div>
                <div style={{ fontSize:10, color:T.muted }}>Morse</div>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:6, fontSize:11, color:T.muted }}>
              Harmonic says both = <span style={{color:T.ff_bond, fontWeight:700}}>{harmonic(r0+0.5).toFixed(2)} eV</span> (wrong — symmetric)
            </div>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — current distance" value={r} min={r0*0.55} max={r0*2.9} step={0.01}
            onChange={setR} color={T.ff_morse} unit=" Å"/>
          <SliderRow label="Dₑ — dissociation energy" value={De} min={0.5} max={6} step={0.1}
            onChange={setDe} color={T.ff_morse} unit=" eV"/>
          <SliderRow label="a — well width (stiffness)" value={a} min={0.5} max={3.0} step={0.05}
            onChange={setA} color={T.ff_morse} unit=" Å⁻¹"/>
          <SliderRow label="r₀ — equilibrium" value={r0} min={1.0} max={3.5} step={0.05}
            onChange={setR0} color={T.ff_morse} unit=" Å"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>STEP BY STEP</div>
            <CalcRow eq={`r − r₀ = ${r.toFixed(2)} − ${r0.toFixed(2)}`} result={`${(r-r0).toFixed(3)} Å`} color={T.ff_morse}/>
            <CalcRow eq={`a(r−r₀) = ${a}×${(r-r0).toFixed(3)}`} result={`${(a*(r-r0)).toFixed(4)}`} color={T.ff_morse}/>
            <CalcRow eq={`e^{−${(a*(r-r0)).toFixed(3)}}`} result={`${Math.exp(-a*(r-r0)).toFixed(5)}`} color={T.ff_morse}/>
            <CalcRow eq={`1 − e^{...} `} result={`${(1-Math.exp(-a*(r-r0))).toFixed(5)}`} color={T.ff_morse}/>
            <CalcRow eq={`[...]²`} result={`${sq(1-Math.exp(-a*(r-r0))).toFixed(5)}`} color={T.ff_morse}/>
            <CalcRow eq={`Dₑ × [...]² = ${De} × ...`} result={`${U.toFixed(4)} eV`} color={T.ff_morse}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Morse U" value={`${U.toFixed(3)} eV`} color={T.ff_morse}
              sub={r>r0*2?"near broken":"bond intact"}/>
            <ResultBox label="At r→∞" value={`${De.toFixed(2)} eV`} color={T.gold}
              sub="energy plateau (broken bond)"/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Real asymmetric bond.</strong>
            Compression = steep wall (electron clouds clash hard).
            Stretch = gentle slope (gradually letting go).
            Bond breaks when r→∞, energy → Dₑ (flat, not infinity like harmonic).
            <br/><strong style={{color:T.ff_morse}}>Explains:</strong> thermal expansion, bond breaking, anharmonic vibrations.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EMPIRICAL FF FITTING
// ─────────────────────────────────────────────────────────────────────────────
function FittingSection() {
  const bestEps = 0.0104, bestSig = 3.40;
  const [eps, setEps] = useState(0.018);
  const [sig, setSig] = useState(2.90);

  // Synthetic "DFT reference" data for Ar-Ar interaction
  const dftData = [
    [2.8, 0.120], [3.0, 0.025], [3.2, -0.008], [3.4, -0.0103],
    [3.6, -0.0085], [3.8, -0.0058], [4.0, -0.0035], [4.5, -0.0012],
    [5.0, -0.0004], [5.5, -0.0001],
  ];

  const lj = (rr, e, s) => { const q = s / rr; return 4 * e * (Math.pow(q, 12) - Math.pow(q, 6)); };

  // Generate LJ curve
  const N = 120;
  const xMin = 2.5, xMax = 6.0, yMin = -0.02, yMax = 0.15;
  const curve = Array.from({ length: N }, (_, i) => {
    const x = xMin + i * (xMax - xMin) / N;
    return [x, lj(x, eps, sig)];
  }).filter(([, y]) => y >= yMin && y <= yMax);

  // SSE
  const sse = dftData.reduce((sum, [r, eDft]) => {
    const ePred = lj(r, eps, sig);
    return sum + Math.pow(ePred - eDft, 2);
  }, 0);

  // Coordinate mapping (same as Plot)
  const W = 360, H = 200;
  const pad = { l: 44, r: 12, t: 12, b: 30 };
  const WW = W - pad.l - pad.r, HH = H - pad.t - pad.b;
  const toSX = x => pad.l + ((x - xMin) / (xMax - xMin)) * WW;
  const toSY = y => pad.t + HH - ((y - yMin) / (yMax - yMin)) * HH;

  const curvePts = curve.map(([x, y]) => `${toSX(x).toFixed(1)},${toSY(y).toFixed(1)}`).join(" ");

  return (
    <Card color={T.ff_fit} title="Fitting Empirical Force Fields" formula="min Σᵢ [U_LJ(rᵢ; ε,σ) − E_DFT(rᵢ)]²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine fitting a curved ruler to a set of dots on a graph. You can slide the ruler up/down ({"\u03B5"}) and stretch it left/right ({"\u03C3"}), but its <strong>shape is fixed</strong> {"\u2014"} it is always the same S-curve. If the dots actually follow that shape, great {"\u2014"} you get a perfect fit. But if the real data has a bump or kink the ruler cannot bend to match, no amount of sliding will fix it. That is the fundamental limitation of empirical force field fitting: the <strong>functional form is chosen by humans</strong>, and the optimizer can only adjust the knobs (parameters) within that rigid template.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 370px" }}>
          {/* Custom SVG with curve + DFT scatter points */}
          <svg width={W} height={H} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            {/* Axes */}
            <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + HH} stroke={T.dim} strokeWidth={1} />
            <line x1={pad.l} y1={pad.t + HH} x2={pad.l + WW} y2={pad.t + HH} stroke={T.dim} strokeWidth={1} />
            {/* Zero line */}
            <line x1={pad.l} y1={toSY(0)} x2={pad.l + WW} y2={toSY(0)} stroke={T.dim} strokeWidth={1} strokeDasharray="3 3" />
            {/* X ticks */}
            {[2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0].map(v => (
              <g key={v}>
                <line x1={toSX(v)} y1={pad.t + HH} x2={toSX(v)} y2={pad.t + HH + 4} stroke={T.dim} strokeWidth={1} />
                <text x={toSX(v)} y={pad.t + HH + 14} textAnchor="middle" fill={T.muted} fontSize={9}>{v.toFixed(1)}</text>
              </g>
            ))}
            {/* Y ticks */}
            {[-0.02, 0, 0.02, 0.05, 0.10, 0.15].map(v => (
              <g key={v}>
                <line x1={pad.l - 4} y1={toSY(v)} x2={pad.l} y2={toSY(v)} stroke={T.dim} strokeWidth={1} />
                <text x={pad.l - 6} y={toSY(v) + 3} textAnchor="end" fill={T.muted} fontSize={8}>{v.toFixed(2)}</text>
              </g>
            ))}
            <text x={pad.l + WW / 2} y={H - 2} textAnchor="middle" fill={T.muted} fontSize={10}>r (Å)</text>
            <text x={10} y={pad.t + HH / 2} textAnchor="middle" fill={T.muted} fontSize={10}
              transform={`rotate(-90, 10, ${pad.t + HH / 2})`}>E (eV)</text>

            {/* LJ curve */}
            <polyline points={curvePts} fill="none" stroke={T.ff_fit} strokeWidth={2.5} />

            {/* Residual lines + DFT data points */}
            {dftData.map(([r, eDft], i) => {
              const ePred = lj(r, eps, sig);
              const clampedPred = Math.max(yMin, Math.min(yMax, ePred));
              const clampedDft = Math.max(yMin, Math.min(yMax, eDft));
              return (
                <g key={i}>
                  <line x1={toSX(r)} y1={toSY(clampedDft)} x2={toSX(r)} y2={toSY(clampedPred)}
                    stroke={T.ff_bond} strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
                  <circle cx={toSX(r)} cy={toSY(clampedDft)} r={4} fill={T.eo_cond} stroke={T.panel} strokeWidth={1.5} />
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: 6, fontSize: 10, color: T.muted, display: "flex", gap: 16, padding: "0 8px" }}>
            <span>── <span style={{ color: T.ff_fit }}>LJ curve (your ε, σ)</span></span>
            <span><span style={{ color: T.eo_cond }}>●</span> DFT reference data</span>
            <span style={{ color: T.ff_bond }}>| residuals</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="ε — well depth" value={eps} min={0.001} max={0.04} step={0.0005}
            onChange={setEps} color={T.ff_fit} unit=" eV" format={v => v.toFixed(4)} />
          <SliderRow label="σ — zero-crossing radius" value={sig} min={2.5} max={5.0} step={0.02}
            onChange={setSig} color={T.ff_fit} unit=" Å" />

          <div style={{ display: "flex", gap: 8, marginTop: 8, marginBottom: 12 }}>
            <ResultBox label="SSE (error)" value={sse.toExponential(3)} color={sse < 1e-4 ? T.ff_vdw : T.ff_bond}
              sub={sse < 1e-4 ? "good fit!" : "adjust ε, σ"} />
            <button onClick={() => { setEps(bestEps); setSig(bestSig); }} style={{
              flex: 1, padding: "10px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: T.ff_fit + "18", border: `1.5px solid ${T.ff_fit}`, color: T.ff_fit,
              fontWeight: 700, fontFamily: "sans-serif",
            }}>Snap to Best Fit</button>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>OBJECTIVE FUNCTION</div>
            <CalcRow eq="min Σᵢ [U_LJ(rᵢ) − E_DFT(rᵢ)]²" result={sse.toExponential(3)} color={T.ff_fit} />
            <CalcRow eq={`ε = ${eps.toFixed(4)} eV`} result={`best: ${bestEps.toFixed(4)}`} color={T.ff_fit} />
            <CalcRow eq={`σ = ${sig.toFixed(2)} Å`} result={`best: ${bestSig.toFixed(2)}`} color={T.ff_fit} />
          </div>

          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8, background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <strong style={{ color: T.ink }}>How fitting works:</strong>
            <br />1. Run DFT calculations at many distances → get reference energies
            <br />2. Choose analytical form (here LJ 12-6) with unknown parameters (ε, σ)
            <br />3. Minimize the sum of squared errors between LJ predictions and DFT data
            <br />4. Optimizer (e.g. Levenberg-Marquardt) iteratively adjusts ε, σ until SSE is minimized
          </div>

          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8, background: T.ff_fit + "08", padding: 10, borderRadius: 8, border: `1px solid ${T.ff_fit}33` }}>
            <strong style={{ color: T.ff_fit }}>Key limitation:</strong> the functional form is FIXED.
            If the true interaction doesn't follow r⁻¹² repulsion (most real materials don't exactly),
            no choice of ε, σ can perfectly reproduce the DFT data.
            This is why empirical FFs have limited transferability to new structures or conditions.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. MLFF (MACHINE LEARNING FORCE FIELDS)
// ─────────────────────────────────────────────────────────────────────────────
function MLFFSection() {
  const [epoch, setEpoch] = useState(0);

  // Training curve: exponential decay
  const loss = (e) => 0.5 * Math.exp(-e / 30) + 0.002;
  const eMae = (e) => 120 * Math.exp(-e / 40) + 1.5;
  const fMae = (e) => 0.8 * Math.exp(-e / 35) + 0.02;

  const curLoss = loss(epoch);
  const curEmae = eMae(epoch);
  const curFmae = fMae(epoch);

  // Training curve data for mini plot
  const trainPts = Array.from({ length: 201 }, (_, i) => [i, loss(i)]);

  // SVG coords for training curve
  const tcW = 360, tcH = 100;
  const tcPad = { l: 40, r: 10, t: 8, b: 22 };
  const tcWW = tcW - tcPad.l - tcPad.r, tcHH = tcH - tcPad.t - tcPad.b;
  const tcToX = x => tcPad.l + (x / 200) * tcWW;
  const tcToY = y => tcPad.t + tcHH - ((y - 0) / 0.55) * tcHH;
  const tcPtsStr = trainPts.map(([x, y]) => `${tcToX(x).toFixed(1)},${tcToY(y).toFixed(1)}`).join(" ");

  // Pipeline boxes
  const boxes = [
    { label: "Atomic\nPositions", sub: "{rᵢ}", color: T.ff_bond, x: 10 },
    { label: "Symmetry\nDescriptors", sub: "G₁, G₂, G₄", color: T.ff_angle, x: 85 },
    { label: "Neural\nNetwork", sub: "hidden layers", color: T.ff_mlff, x: 165 },
    { label: "Energy", sub: "E_pred", color: T.ff_vdw, x: 245 },
  ];

  return (
    <Card color={T.ff_mlff} title="Machine Learning Force Fields (MLFF)" formula="E = NN(descriptors({rᵢ}))   F = −∂E/∂rᵢ">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          If empirical force fields are like fitting data with a <strong>pre-shaped ruler</strong>, MLFFs are like giving an artist a <strong>flexible spline</strong> that can bend into any shape. The neural network has no fixed formula {"\u2014"} it learns the energy surface from thousands of DFT examples, automatically discovering complex patterns that no human-designed equation could capture. The trade-off? The artist needs to see many examples to learn (thousands of DFT calculations), and drawing with a spline is slower than stamping with a ruler (10{"\u2013"}100{"\u00D7"} slower than classical FF). But the result is near-DFT accuracy at a fraction of DFT{"\u2019"}s computational cost.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 380px" }}>
          {/* Pipeline diagram */}
          <svg viewBox="0 0 370 160" style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 370 }}>
            {/* Pipeline boxes */}
            {boxes.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={12} width={68} height={55} rx={6}
                  fill={b.color + "15"} stroke={b.color} strokeWidth={1.5} />
                {b.label.split("\n").map((line, li) => (
                  <text key={li} x={b.x + 34} y={30 + li * 13} textAnchor="middle" fill={b.color} fontSize={9} fontWeight="bold">
                    {line}
                  </text>
                ))}
                <text x={b.x + 34} y={58} textAnchor="middle" fill={T.muted} fontSize={8}>{b.sub}</text>
                {i < boxes.length - 1 && (
                  <g>
                    <line x1={b.x + 70} y1={39} x2={boxes[i + 1].x - 2} y2={39}
                      stroke={T.dim} strokeWidth={1.5} markerEnd="url(#mlffArrow)" />
                  </g>
                )}
              </g>
            ))}
            {/* Arrow to Forces */}
            <rect x={245} y={80} width={68} height={40} rx={6}
              fill={T.ff_dih + "15"} stroke={T.ff_dih} strokeWidth={1.5} />
            <text x={279} y={96} textAnchor="middle" fill={T.ff_dih} fontSize={9} fontWeight="bold">Forces</text>
            <text x={279} y={111} textAnchor="middle" fill={T.muted} fontSize={8}>Fᵢ = −∂E/∂rᵢ</text>
            <line x1={279} y1={67} x2={279} y2={78} stroke={T.dim} strokeWidth={1.5} markerEnd="url(#mlffArrow)" />
            <text x={295} y={76} fill={T.muted} fontSize={7}>gradient</text>

            {/* NN hidden layers visualization */}
            {[0, 1, 2].map(layer => {
              const lx = 175 + layer * 18;
              return [0, 1, 2, 3].map(node => {
                const ny = 20 + node * 12;
                return <circle key={`${layer}-${node}`} cx={lx} cy={ny} r={3}
                  fill={T.ff_mlff} opacity={0.3 + layer * 0.2} />;
              });
            })}

            {/* Loss label */}
            <rect x={10} y={80} width={120} height={40} rx={6}
              fill={T.ff_fit + "15"} stroke={T.ff_fit} strokeWidth={1.5} />
            <text x={70} y={96} textAnchor="middle" fill={T.ff_fit} fontSize={9} fontWeight="bold">Loss Function</text>
            <text x={70} y={111} textAnchor="middle" fill={T.muted} fontSize={7}>|E_pred − E_DFT|² + λ|F_pred − F_DFT|²</text>

            <line x1={130} y1={100} x2={243} y2={100} stroke={T.dim} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={130} y1={100} x2={243} y2={45} stroke={T.dim} strokeWidth={1} strokeDasharray="3 3" />

            <text x={185} y={145} textAnchor="middle" fill={T.muted} fontSize={8}>backprop updates NN weights</text>
            <defs>
              <marker id="mlffArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill={T.dim} />
              </marker>
            </defs>
          </svg>

          {/* Training curve */}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4, letterSpacing: 1 }}>TRAINING CURVE</div>
            <svg width={tcW} height={tcH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <line x1={tcPad.l} y1={tcPad.t} x2={tcPad.l} y2={tcPad.t + tcHH} stroke={T.dim} strokeWidth={1} />
              <line x1={tcPad.l} y1={tcPad.t + tcHH} x2={tcPad.l + tcWW} y2={tcPad.t + tcHH} stroke={T.dim} strokeWidth={1} />
              {[0, 50, 100, 150, 200].map(v => (
                <text key={v} x={tcToX(v)} y={tcH - 4} textAnchor="middle" fill={T.muted} fontSize={8}>{v}</text>
              ))}
              <text x={tcPad.l + tcWW / 2} y={tcH} textAnchor="middle" fill={T.muted} fontSize={8}>epoch</text>
              <text x={8} y={tcPad.t + tcHH / 2} textAnchor="middle" fill={T.muted} fontSize={8}
                transform={`rotate(-90, 8, ${tcPad.t + tcHH / 2})`}>loss</text>
              <polyline points={tcPtsStr} fill="none" stroke={T.ff_mlff} strokeWidth={2} />
              {/* Epoch marker */}
              <line x1={tcToX(epoch)} y1={tcPad.t} x2={tcToX(epoch)} y2={tcPad.t + tcHH}
                stroke={T.gold} strokeWidth={1.5} strokeDasharray="3 3" />
              <circle cx={tcToX(epoch)} cy={tcToY(curLoss)} r={4} fill={T.gold} stroke={T.panel} strokeWidth={1.5} />
            </svg>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Training epoch" value={epoch} min={0} max={200} step={1}
            onChange={setEpoch} color={T.ff_mlff} unit="" format={v => v.toFixed(0)} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4, marginBottom: 12 }}>
            <ResultBox label="Loss" value={curLoss.toFixed(4)} color={T.ff_mlff}
              sub={epoch > 150 ? "converged" : "training..."} />
            <ResultBox label="E MAE" value={`${curEmae.toFixed(1)} meV`} color={T.ff_vdw}
              sub="energy error" />
            <ResultBox label="F MAE" value={`${curFmae.toFixed(3)} eV/Å`} color={T.ff_dih}
              sub="force error" />
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>WHAT ARE DESCRIPTORS?</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
              Raw atomic positions (x, y, z) are NOT invariant to rotation and translation.
              <strong style={{ color: T.ff_angle }}> Symmetry functions</strong> transform them into
              invariant features:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              {[
                { name: "G₂ (radial)", desc: "Distance to each neighbor, smoothly cut off at r_cut", color: T.ff_angle },
                { name: "G₄ (angular)", desc: "Angles between triplets of atoms within cutoff", color: T.ff_dih },
              ].map(({ name, desc, color }) => (
                <div key={name} style={{ padding: "6px 8px", borderRadius: 6, background: color + "11", border: `1px solid ${color}33` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color }}>{name}</div>
                  <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5, marginTop: 2 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>EMPIRICAL FF vs MLFF</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  {["", "Empirical FF", "MLFF"].map(h => (
                    <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: T.muted, fontWeight: 700, fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Form", "Fixed (LJ, Morse)", "Learned (NN)"],
                  ["Parameters", "2-6 per pair", "1000s (weights)"],
                  ["Training data", "Few properties", "1000s DFT configs"],
                  ["Accuracy", "Qualitative", "Near-DFT"],
                  ["Transferability", "Limited", "Better"],
                  ["Speed", "Very fast", "10-100× slower"],
                ].map(([label, emp, ml], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.bg : T.panel }}>
                    <td style={{ padding: "4px 6px", color: T.ink, fontWeight: 600, fontSize: 10 }}>{label}</td>
                    <td style={{ padding: "4px 6px", color: T.ff_fit }}>{emp}</td>
                    <td style={{ padding: "4px 6px", color: T.ff_mlff }}>{ml}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8, background: T.ff_mlff + "08", padding: 10, borderRadius: 8, border: `1px solid ${T.ff_mlff}33` }}>
            <strong style={{ color: T.ff_mlff }}>Key insight:</strong> MLFFs learn the shape of the energy surface
            from thousands of DFT calculations. Unlike empirical FFs with fixed formulas (LJ, Morse),
            the neural network can represent ANY smooth function — capturing complex many-body effects,
            charge transfer, and bond breaking that no simple formula can describe.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EAM (EMBEDDED ATOM METHOD)
// ─────────────────────────────────────────────────────────────────────────────
function EAMSection() {
  const [r, setR] = useState(2.55);
  const [r0] = useState(2.55);
  const [eps] = useState(0.35);
  const [rhoScale, setRhoScale] = useState(1.0);
  const [nNeighbors, setNNeighbors] = useState(12);

  // EAM: E_i = F(rho_i) + 0.5 * sum_j phi(r_ij)
  // rho_i = sum_j f(r_ij)  (electron density at site i)
  // f(r) = f0 * exp(-beta*(r - r0))  (density contribution)
  // phi(r) = A*exp(-alpha*(r-r0)) - B*exp(-beta2*(r-r0))  (pair potential)
  // F(rho) = -sqrt(rho)  (embedding function, Finnis-Sinclair form)

  const f0 = 1.0;
  const beta = 1.5;
  const A = 0.5;
  const alpha = 2.0;
  const B = 0.3;
  const beta2 = 1.2;

  const fDens = (rr) => f0 * Math.exp(-beta * (rr - r0));
  const phi = (rr) => A * Math.exp(-alpha * (rr - r0)) - B * Math.exp(-beta2 * (rr - r0));
  const embed = (rho) => -Math.sqrt(Math.abs(rho));

  const rhoAtom = fDens(r) * nNeighbors * rhoScale;
  const pairE = 0.5 * phi(r) * nNeighbors;
  const embedE = embed(rhoAtom);
  const totalE = embedE + pairE;

  const N = 100;
  const rhoCurve = Array.from({length:N},(_,i)=>{
    const rho = 0.01 + i*(25.0/N);
    return [rho, embed(rho)];
  });
  const pairCurve = Array.from({length:N},(_,i)=>{
    const x = 1.8 + i*(3.0/N);
    return [x, phi(x)];
  });
  const densCurve = Array.from({length:N},(_,i)=>{
    const x = 1.8 + i*(3.0/N);
    return [x, fDens(x)];
  });

  return (
    <Card color={T.eo_core} title="Embedded Atom Method (EAM)" formula="E_total = Σᵢ F(ρ̄ᵢ) + ½ Σᵢ Σⱼ≠ᵢ φ(rᵢⱼ)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine you are at a crowded party. Standing alone in a corner feels lonely (high energy). Walking into a group of 12 friends feels great (low energy). But notice: the happiness boost from friend #2 is huge, while friend #12 barely adds anything {"\u2014"} <strong>diminishing returns</strong>. That is exactly how EAM works for metals: each atom is {"\u201C"}embedded{"\u201D"} in the electron cloud of its neighbors. More neighbors = more stable, but with a square-root law ({"\u221A\u03C1"}) so the benefit of each additional neighbor shrinks. This is why a surface atom (fewer neighbors) pulls inward to get closer to more friends {"\u2014"} surface relaxation.
        </div>
      </div>

      {/* ── MASTER EQUATION BREAKDOWN ── */}
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.ink, marginBottom:10 }}>EAM Total Energy — Every Term Explained</div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.2 }}>
          E<sub>total</sub> = <span style={{color:T.eo_core, fontWeight:700}}>Σ<sub>i</sub> F(ρ̄<sub>i</sub>)</span> + <span style={{color:T.eo_e, fontWeight:700}}>½ Σ<sub>i</sub> Σ<sub>j≠i</sub> φ(r<sub>ij</sub>)</span>
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.6, marginTop:6, marginBottom:10 }}>
          The energy of the entire system is the sum over all atoms. Each atom i contributes two parts: an embedding energy and pairwise interactions.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { term:"F(ρ̄ᵢ)", color:T.eo_core, what:"Embedding Function", desc:"The energy to embed atom i into the electron gas created by all its neighbors. F is a function of the total electron density ρ̄ at the site of atom i. This is the many-body term — it depends on ALL neighbors simultaneously, not just pairs. For Finnis-Sinclair: F(ρ̄) = −A√ρ̄. The negative square root means: more neighbors = lower (more stable) energy, but with diminishing returns." },
            { term:"φ(rᵢⱼ)", color:T.eo_e, what:"Pair Potential", desc:"A short-range repulsive-attractive interaction between atoms i and j separated by distance rᵢⱼ. Similar to Lennard-Jones but typically uses exponential forms. At short range: strong repulsion (Pauli exclusion). At equilibrium: slight attraction. At long range: decays to zero. The ½ factor avoids double-counting (i-j and j-i)." },
            { term:"ρ̄ᵢ", color:T.eo_valence, what:"Host Electron Density", desc:"The total electron density at the site of atom i, contributed by ALL neighboring atoms j. Calculated as: ρ̄ᵢ = Σⱼ f(rᵢⱼ), where f(r) is the electron density contribution from one neighbor at distance r. Typically: f(r) = f₀ × exp(−β(r − r₀)). More neighbors or closer neighbors = higher ρ̄." },
            { term:"f(rᵢⱼ)", color:"#b45309", what:"Atomic Density Function", desc:"The electron density contribution from a single neighbor atom j at distance rᵢⱼ. Decays exponentially with distance — nearby atoms contribute much more density than distant ones. This function is element-specific: Cu and Al have different f(r). Beyond the cutoff distance (typically 5-6 Å), f(r) = 0." },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:item.color, marginBottom:2 }}>{item.what} — {item.term}</div>
              <div style={{ fontSize:10, color:T.muted, lineHeight:1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY EAM IS MANY-BODY ── */}
      <div style={{ background:"#eef3ff", border:`1px solid ${T.eo_core}`, borderRadius:8, padding:14, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.eo_core, marginBottom:8 }}>Why EAM is Many-Body (Not Just Pairs)</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8, marginBottom:10 }}>
          <strong>The key insight:</strong> In a pair potential (like Lennard-Jones), each bond has the same energy regardless of environment.
          But in real metals, a surface atom bonds differently than a bulk atom — even if the nearest-neighbor distance is the same.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
          {[
            { label:"Bulk Atom", neighbors:"12 neighbors (FCC)", rho:"ρ̄ = 12 × f(r₀) = high", F:"F(high ρ̄) = very negative", color:T.eo_core },
            { label:"Surface Atom", neighbors:"8-9 neighbors", rho:"ρ̄ = 9 × f(r₀) = medium", F:"F(medium ρ̄) = less negative", color:T.eo_e },
            { label:"Adatom", neighbors:"3-4 neighbors", rho:"ρ̄ = 3 × f(r₀) = low", F:"F(low ρ̄) = least negative", color:T.eo_gap },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderRadius:6, padding:"8px 10px", textAlign:"center" }}>
              <div style={{ fontSize:11, fontWeight:700, color:item.color }}>{item.label}</div>
              <div style={{ fontSize:9, color:T.muted, marginTop:4 }}>{item.neighbors}</div>
              <div style={{ fontSize:9, color:T.ink, marginTop:2 }}>{item.rho}</div>
              <div style={{ fontSize:9, color:item.color, fontWeight:600, marginTop:2 }}>{item.F}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8 }}>
          <strong>Because F(ρ̄) = −A√ρ̄ is concave</strong> (square root), the energy gain from adding one more neighbor
          is smaller when you already have many. This means:
          <br/>• Surface atoms contract inward (relax) to increase their ρ̄ — exactly what experiments observe
          <br/>• Vacancy formation energy is positive but less than just removing pair bonds — many-body screening
          <br/>• Stacking fault energies are correctly predicted — pair potentials give zero for FCC metals
          <br/>• Thermal expansion is captured through the asymmetry in the embedding function
        </div>
      </div>

      {/* ── COMMON EAM FORMS ── */}
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.ink, marginBottom:10 }}>Common EAM Variants</div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {["Variant","F(ρ̄)","φ(r)","f(r)","Best For"].map(h=>(
                  <th key={h} style={{ padding:"6px 8px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name:"Finnis-Sinclair", F:"−A√ρ̄", phi:"Born-Mayer repulsive", f:"polynomial cutoff", best:"BCC metals (W, Fe, Mo)", color:T.eo_core },
                { name:"Daw-Baskes", F:"spline (tabulated)", phi:"Z²(r)/r Coulomb + screening", f:"tabulated from DFT", best:"FCC metals (Cu, Al, Ni, Au)", color:T.eo_e },
                { name:"MEAM (Modified)", F:"same + angular terms", phi:"same", f:"f(r) × g(cos θ)", best:"Si, Ge, and alloys with directional bonding", color:T.eo_valence },
                { name:"ADP (Angular)", F:"same + dipole + quadrupole", phi:"same", f:"same + tensor density", best:"HCP metals (Ti, Zr, Mg)", color:T.eo_cond },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0?T.panel:T.surface }}>
                  <td style={{ padding:"6px 8px", color:row.color, fontWeight:700, fontSize:10 }}>{row.name}</td>
                  <td style={{ padding:"6px 8px", fontFamily:"'Georgia',serif", color:T.ink }}>{row.F}</td>
                  <td style={{ padding:"6px 8px", color:T.muted }}>{row.phi}</td>
                  <td style={{ padding:"6px 8px", color:T.muted }}>{row.f}</td>
                  <td style={{ padding:"6px 8px", color:T.ink }}>{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── INTERACTIVE PLOTS + CALCULATIONS ── */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_core, marginBottom:4 }}>Embedding Function F(ρ̄) = −√ρ̄</div>
          <Plot data={rhoCurve} xMin={0} xMax={25} yMin={-6} yMax={0}
            color={T.eo_core} markerX={rhoAtom} width={340} height={140} xLabel="ρ̄ (electron density)" yLabel="F(ρ̄) (eV)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            Concave shape is critical: adding the 12th neighbor gives less energy gain than adding the 2nd.
            This is why surface relaxation works — atoms pull inward to increase their local density.
          </div>
          <div style={{ marginTop:8, fontSize:11, fontWeight:700, color:T.eo_e, marginBottom:4 }}>Pair Potential φ(r) = A·e<sup>−αr</sup> − B·e<sup>−β₂r</sup></div>
          <Plot data={pairCurve} xMin={1.8} xMax={4.8} yMin={-0.4} yMax={0.6}
            color={T.eo_e} markerX={r} width={340} height={130} xLabel="r (Å)" yLabel="φ(r) (eV)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            Short-range: strong repulsion from core electron overlap (Pauli exclusion).
            Medium-range: weak attraction. Beyond cutoff (~5 Å): zero.
          </div>
          <div style={{ marginTop:8, fontSize:11, fontWeight:700, color:T.eo_valence, marginBottom:4 }}>Density Contribution f(r) = f₀·e<sup>−β(r−r₀)</sup></div>
          <Plot data={densCurve} xMin={1.8} xMax={4.8} yMin={0} yMax={3}
            color={T.eo_valence} markerX={r} width={340} height={110} xLabel="r (Å)" yLabel="f(r)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            Each neighbor contributes f(r) electron density at the atom site.
            ρ̄ᵢ = Σⱼ f(rᵢⱼ) — sum over all neighbors j.
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — neighbor distance" value={r} min={2.0} max={4.5} step={0.01} onChange={setR} color={T.eo_core} unit=" Å"/>
          <SliderRow label="N — number of neighbors" value={nNeighbors} min={1} max={12} step={1} onChange={setNNeighbors} color={T.eo_core} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="ρ scale factor" value={rhoScale} min={0.2} max={2.0} step={0.05} onChange={setRhoScale} color={T.eo_core} unit=""/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>STEP-BY-STEP CALCULATION (Cu, FCC)</div>
            <CalcRow eq="Step 1: Density from ONE neighbor at distance r" result="" color={T.eo_valence}/>
            <CalcRow eq={`  f(${r.toFixed(2)}) = f₀ × exp(−β × (r − r₀))`} result="" color={T.eo_valence}/>
            <CalcRow eq={`  = 1.0 × exp(−1.5 × (${r.toFixed(2)} − 2.55))`} result={`${fDens(r).toFixed(4)}`} color={T.eo_valence}/>
            <CalcRow eq="Step 2: Total electron density at atom site" result="" color={T.eo_core}/>
            <CalcRow eq={`  ρ̄ = N × f(r) × scale = ${nNeighbors} × ${fDens(r).toFixed(4)} × ${rhoScale.toFixed(2)}`} result={`${rhoAtom.toFixed(3)}`} color={T.eo_core}/>
            <CalcRow eq="Step 3: Embedding energy (many-body term)" result="" color={T.eo_core}/>
            <CalcRow eq={`  F(ρ̄) = −√ρ̄ = −√${rhoAtom.toFixed(3)}`} result={`${embedE.toFixed(4)} eV`} color={T.eo_core}/>
            <CalcRow eq="Step 4: Pair potential from ONE neighbor" result="" color={T.eo_e}/>
            <CalcRow eq={`  φ(${r.toFixed(2)}) = A·e^(−α·Δr) − B·e^(−β₂·Δr)`} result={`${phi(r).toFixed(4)} eV`} color={T.eo_e}/>
            <CalcRow eq="Step 5: Total pair energy (all neighbors)" result="" color={T.eo_e}/>
            <CalcRow eq={`  ½ × ${nNeighbors} × ${phi(r).toFixed(4)}`} result={`${pairE.toFixed(4)} eV`} color={T.eo_e}/>
            <CalcRow eq="Step 6: Total energy per atom" result="" color={T.eo_gap}/>
            <CalcRow eq={`  E = F(ρ̄) + ½Σφ = ${embedE.toFixed(4)} + ${pairE.toFixed(4)}`} result={`${totalE.toFixed(4)} eV`} color={T.eo_gap}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Embedding F(ρ̄)" value={`${embedE.toFixed(3)} eV`} color={T.eo_core} sub="many-body"/>
            <ResultBox label="Pair ½Σφ" value={`${pairE.toFixed(3)} eV`} color={T.eo_e} sub="two-body"/>
            <ResultBox label="Total" value={`${totalE.toFixed(3)} eV`} color={T.eo_gap} sub={`${nNeighbors} neighbors`}/>
          </div>

          {/* ── PHYSICAL APPLICATIONS ── */}
          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>What EAM can model that pair potentials cannot:</strong>
            <br/><span style={{color:T.eo_core}}>Surface relaxation:</span> Top-layer atoms have fewer neighbors (lower ρ̄), so they pull inward 2-5% to compensate. Pair potentials predict zero relaxation.
            <br/><span style={{color:T.eo_e}}>Vacancy formation energy:</span> Removing one atom costs ~1.3 eV for Cu. The remaining neighbors redistribute their electron density, partially screening the loss. Pair potentials overestimate by 2-3×.
            <br/><span style={{color:T.eo_valence}}>Cauchy pressure:</span> C₁₂ − C₄₄ is positive for most metals. Pair potentials force C₁₂ = C₄₄ (Cauchy relation). EAM breaks this constraint naturally.
            <br/><span style={{color:T.eo_gap}}>Stacking faults:</span> FCC → HCP transition costs ~40 mJ/m² for Cu. Pair potentials give exactly zero for this energy. EAM captures it through the coordination dependence.
            <br/><strong style={{color:T.eo_gap}}>Limitations:</strong> No directional bonding (cannot model Si, diamond). No charge transfer (cannot model ionic materials). No magnetism (cannot model Fe spin states).
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReaxFF FORCE FIELD
// ─────────────────────────────────────────────────────────────────────────────
function ReaxFFSection() {
  const [bo, setBo] = useState(1.0);
  const [overCoord, setOverCoord] = useState(0.0);
  const [lpE, setLpE] = useState(0.0);

  // ReaxFF bond order: BO = exp(a1*(r/r0)^a2)
  const r0_sig = 1.54; // C-C single bond
  const a1 = -34.0;
  const a2 = 6.0;

  const boFromR = (rr) => Math.exp(a1 * Math.pow(rr / r0_sig, a2));
  const N = 120;

  // Bond order vs distance
  const boCurve = Array.from({length:N},(_,i)=>{
    const x = 0.8 + i*(2.5/N);
    return [x, Math.min(3, boFromR(x))];
  });

  // Bond energy: E_bond = -De * BO * exp(p*(1-BO^q))
  const De = 3.93;
  const p_be = 0.35;
  const q_be = 2.0;
  const bondE = (b) => -De * b * Math.exp(p_be * (1 - Math.pow(b, q_be)));

  const bondCurve = Array.from({length:N},(_,i)=>{
    const b = 0.01 + i*(2.5/N);
    return [b, bondE(b)];
  });

  // Overcoordination penalty
  const overPenalty = (delta) => delta > 0 ? 30.0 * delta * delta : 0;
  const overE = overPenalty(overCoord);

  // ReaxFF total (simplified)
  const eBond = bondE(bo);
  const eLp = -lpE * 5.0;
  const eTotal = eBond + overE + eLp;

  return (
    <Card color={T.eo_e} title="ReaxFF (Reactive Force Field)" formula="E_system = E_bond + E_over + E_under + E_lp + E_val + E_tor + E_vdW + E_Coul">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Classical force fields are like <strong>Lego instructions</strong> {"\u2014"} fixed connections that never change. ReaxFF is like <strong>magnetic building blocks</strong>: pieces snap together and pull apart dynamically based on how close they are. The secret is <strong>bond order</strong>, a smooth number from 0 (no bond) to 3 (triple bond) that updates every timestep based on distance. Bring two atoms close {"\u2192"} bond order rises {"\u2192"} bond forms. Pull them apart {"\u2192"} bond order falls to zero {"\u2192"} bond breaks. No predefined topology needed. This lets ReaxFF simulate chemical reactions {"\u2014"} combustion, corrosion, explosions {"\u2014"} that would be impossible with fixed-bond force fields.
        </div>
      </div>

      {/* ── MASTER EQUATION BREAKDOWN ── */}
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.ink, marginBottom:10 }}>ReaxFF Total Energy — Every Term Explained</div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.2 }}>
          E<sub>system</sub> = <span style={{color:T.eo_core, fontWeight:700}}>E<sub>bond</sub></span> + <span style={{color:T.eo_gap, fontWeight:700}}>E<sub>over</sub></span> + <span style={{color:"#b45309", fontWeight:700}}>E<sub>under</sub></span> + <span style={{color:T.eo_valence, fontWeight:700}}>E<sub>lp</sub></span> + <span style={{color:T.eo_cond, fontWeight:700}}>E<sub>val</sub></span> + <span style={{color:"#9333ea", fontWeight:700}}>E<sub>tor</sub></span> + <span style={{color:T.eo_e, fontWeight:700}}>E<sub>vdW</sub></span> + <span style={{color:"#ea580c", fontWeight:700}}>E<sub>Coul</sub></span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
          {[
            { term:"E_bond", color:T.eo_core, what:"Bond Energy", desc:"Energy from chemical bonds. Depends on bond order (BO). Stronger bond = more negative energy. When BO = 0, E_bond = 0 (no bond)." },
            { term:"E_over", color:T.eo_gap, what:"Overcoordination Penalty", desc:"Penalty when an atom has MORE bonds than its valence allows. Example: carbon forming 5 bonds. Forces atoms to respect their maximum valence." },
            { term:"E_under", color:"#b45309", what:"Undercoordination Stabilization", desc:"Stabilization when an atom has FEWER bonds than expected. Captures the energy gain from pi-bonding in unsaturated molecules (double/triple bonds)." },
            { term:"E_lp", color:T.eo_valence, what:"Lone Pair Energy", desc:"Energy from non-bonding electron pairs. Oxygen has 2 lone pairs, nitrogen has 1. Lone pairs affect geometry (bent H2O vs linear CO2) and reactivity." },
            { term:"E_val", color:T.eo_cond, what:"Valence Angle Energy", desc:"Energy cost of bending bond angles. Like classical angle term BUT depends on BO. When a bond breaks (BO = 0), the angle term smoothly vanishes." },
            { term:"E_tor", color:"#9333ea", what:"Torsion Angle Energy", desc:"Energy barrier to rotation around a bond. Also depends on BO. Captures the difference between eclipsed and staggered conformations in organic molecules." },
            { term:"E_vdW", color:T.eo_e, what:"van der Waals Energy", desc:"Non-bonded attraction/repulsion between ALL atom pairs. Uses a Morse-like potential. Critically: calculated for EVERY pair, even bonded ones (BO-independent)." },
            { term:"E_Coul", color:"#ea580c", what:"Coulomb Energy", desc:"Electrostatic interaction between charged atoms. Charges are NOT fixed — ReaxFF uses the EEM (Electronegativity Equalization Method) to dynamically compute charges at each step." },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:item.color, marginBottom:2 }}>{item.what} ({item.term})</div>
              <div style={{ fontSize:10, color:T.muted, lineHeight:1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOND ORDER EXPLANATION ── */}
      <div style={{ background:"#eef3ff", border:`1px solid ${T.eo_e}`, borderRadius:8, padding:14, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.eo_e, marginBottom:8 }}>What is Bond Order (BO)?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8, marginBottom:8 }}>
          Bond Order is a continuous number that measures how strong a chemical bond is:
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6, marginBottom:10 }}>
          {[
            { bo:"BO = 0", meaning:"No bond", example:"Two atoms far apart", color:T.muted },
            { bo:"BO = 1", meaning:"Single bond", example:"C−C in ethane (1.54 Å)", color:T.eo_e },
            { bo:"BO = 2", meaning:"Double bond", example:"C=C in ethylene (1.34 Å)", color:T.eo_core },
            { bo:"BO = 3", meaning:"Triple bond", example:"C≡C in acetylene (1.20 Å)", color:T.eo_gap },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderRadius:6, padding:"6px 8px", textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:800, color:item.color }}>{item.bo}</div>
              <div style={{ fontSize:10, fontWeight:600, color:T.ink }}>{item.meaning}</div>
              <div style={{ fontSize:9, color:T.muted }}>{item.example}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8 }}>
          <strong>How BO is calculated:</strong> BO is computed from interatomic distance using three contributions:
          <br/>BO<sub>ij</sub> = BO<sub>ij</sub><sup>sigma</sup> + BO<sub>ij</sub><sup>pi</sup> + BO<sub>ij</sub><sup>pipi</sup>
          <br/>Each contribution: BO<sup>x</sup> = exp(a<sub>1</sub> × (r<sub>ij</sub> / r<sub>0</sub>)<sup>a2</sup>)
          <br/>where r<sub>0</sub> is the equilibrium bond length, a<sub>1</sub> and a<sub>2</sub> are fitted parameters.
          <br/><strong>Sigma (σ):</strong> single bond contribution — always present, decays slowly with distance.
          <br/><strong>Pi (π):</strong> double bond contribution — shorter range, gives extra bonding in C=C, C=O.
          <br/><strong>Pi-pi (ππ):</strong> triple bond contribution — very short range, only significant for C≡C, N≡N.
          <br/>As distance increases, all contributions decay exponentially to zero — bonds break smoothly.
        </div>
      </div>

      {/* ── INTERACTIVE PLOTS + CALCULATIONS ── */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_e, marginBottom:4 }}>Bond Order vs Distance (C−C)</div>
          <Plot data={boCurve} xMin={0.8} xMax={3.3} yMin={0} yMax={1.5}
            color={T.eo_e} width={340} height={150} xLabel="r (Å)" yLabel="Bond Order"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            At r = 1.54 Å (single bond), BO ≈ 1.0. At r = 1.34 Å, BO ≈ 2.0 (double). Beyond 2.5 Å, BO → 0 (bond broken).
          </div>
          <div style={{ marginTop:8, fontSize:11, fontWeight:700, color:T.eo_core, marginBottom:4 }}>Bond Energy vs Bond Order</div>
          <Plot data={bondCurve} xMin={0} xMax={2.5} yMin={-5} yMax={0.5}
            color={T.eo_core} markerX={bo} width={340} height={140} xLabel="Bond Order" yLabel="E_bond (eV)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            E<sub>bond</sub> = −D<sub>e</sub> × BO × exp(p × (1 − BO<sup>q</sup>)). D<sub>e</sub> = bond dissociation energy, p and q control the shape.
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="BO — bond order" value={bo} min={0.01} max={2.5} step={0.01} onChange={setBo} color={T.eo_e} unit=""/>
          <SliderRow label={"Δ — overcoordination (valence deviation)"} value={overCoord} min={-0.5} max={1.5} step={0.05} onChange={setOverCoord} color={T.eo_gap} unit=""/>
          <SliderRow label="LP — lone pair fraction" value={lpE} min={0} max={2} step={0.1} onChange={setLpE} color={T.eo_valence} unit=""/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>NUMERICAL EXAMPLE (C−C BOND)</div>
            <CalcRow eq={`Step 1: BO'_σ = exp(${a1} × (r/${r0_sig})^${a2})`} result="from distance" color={T.eo_e}/>
            <CalcRow eq="Step 2: Correct BO for over/undercoordination" result={`BO = ${bo.toFixed(2)}`} color={T.eo_e}/>
            <CalcRow eq={`Step 3: E_bond = −De × BO × exp(p×(1−BO^q))`} result="" color={T.eo_core}/>
            <CalcRow eq={`  = −${De} × ${bo.toFixed(2)} × exp(0.35×(1−${bo.toFixed(2)}²))`} result={`${eBond.toFixed(4)} eV`} color={T.eo_core}/>
            <CalcRow eq={`Step 4: E_over = p_over × Δ²`} result="" color={T.eo_gap}/>
            <CalcRow eq={`  Δ = sum(BO_j) − Val = ${overCoord.toFixed(2)}`} result={overCoord > 0 ? "overcoordinated" : overCoord < 0 ? "undercoordinated" : "exactly right"} color={T.eo_gap}/>
            <CalcRow eq={`  = 30 × ${overCoord.toFixed(2)}²`} result={`${overE.toFixed(4)} eV`} color={T.eo_gap}/>
            <CalcRow eq={`Step 5: E_lp = lone pair stabilization`} result="" color={T.eo_valence}/>
            <CalcRow eq={`  = −${lpE.toFixed(1)} × 5.0`} result={`${eLp.toFixed(3)} eV`} color={T.eo_valence}/>
            <CalcRow eq="Step 6: E_total = E_bond + E_over + E_lp" result={`${eTotal.toFixed(4)} eV`} color={T.ink}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Bond E" value={`${eBond.toFixed(3)} eV`} color={T.eo_core} sub={`BO = ${bo.toFixed(2)}`}/>
            <ResultBox label="Over-coord" value={`${overE.toFixed(3)} eV`} color={T.eo_gap} sub={overCoord > 0 ? "penalty" : "none"}/>
            <ResultBox label="Total" value={`${eTotal.toFixed(3)} eV`} color={T.ink} sub={bo>0.9?"strong bond":"weak/broken"}/>
          </div>

          {/* ── WHY EACH TERM MATTERS ── */}
          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Why ReaxFF needs ALL these terms:</strong>
            <br/><span style={{color:T.eo_core}}>E_bond:</span> Without it, atoms would not form molecules at all. The bond order makes bonds form/break smoothly.
            <br/><span style={{color:T.eo_gap}}>E_over:</span> Without it, carbon could form 6 bonds. The penalty enforces correct valence (C=4, O=2, N=3).
            <br/><span style={{color:"#b45309"}}>E_under:</span> Without it, C=C double bonds would not be stabilized over two C−C single bonds.
            <br/><span style={{color:T.eo_valence}}>E_lp:</span> Without it, water would be linear instead of bent (105°). Lone pairs control molecular shape.
            <br/><span style={{color:T.eo_cond}}>E_val:</span> Without it, molecules would have no preferred geometry. H−O−H must be 105°, not 180°.
            <br/><span style={{color:"#9333ea"}}>E_tor:</span> Without it, ethane would have no barrier to rotation (eclipsed = staggered).
            <br/><span style={{color:T.eo_e}}>E_vdW:</span> Without it, molecules would pass through each other. Pauli repulsion keeps atoms apart.
            <br/><span style={{color:"#ea580c"}}>E_Coul:</span> Without it, NaCl would not be ionic. Dynamic charges capture charge transfer in reactions.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ReaxFF TRAINING
// ─────────────────────────────────────────────────────────────────────────────
function ReaxFFTrainingSection() {
  const [wBond, setWBond] = useState(1.0);
  const [wAngle, setWAngle] = useState(1.0);
  const [wCharge, setWCharge] = useState(0.5);
  const [iteration, setIteration] = useState(0);

  // Training data: DFT reference vs ReaxFF prediction
  // Simulated fitting progress
  const progress = Math.min(1.0, iteration / 100);
  const noise = (seed) => Math.sin(seed * 12.9898 + seed * 78.233) * 0.5;

  const trainData = [
    { label: "C−C bond scan", dft: [-3.93, -3.80, -3.45, -2.80, -1.90, -0.95, -0.30, -0.05],
      dist: [1.20, 1.30, 1.40, 1.54, 1.70, 1.90, 2.20, 2.60] },
    { label: "C−C−C bend", dft: [0.82, 0.30, 0.05, 0.00, 0.05, 0.25, 0.70],
      dist: [90, 100, 105, 109.5, 115, 120, 130] },
    { label: "C−O bond scan", dft: [-5.10, -5.05, -4.80, -4.20, -3.20, -2.00, -0.80, -0.15],
      dist: [1.05, 1.10, 1.20, 1.30, 1.43, 1.60, 1.85, 2.20] },
  ];

  // Simulated ReaxFF predictions that converge toward DFT
  const getReaxPred = (dftVal, idx) => {
    const initialErr = 0.4 * Math.sin(idx * 2.3 + 1.7) + 0.3;
    return dftVal + initialErr * (1 - progress);
  };

  // Total error
  const totalErr = trainData.reduce((sum, set) => {
    const w = set.label.includes("bond") ? wBond : set.label.includes("bend") ? wAngle : wCharge;
    return sum + set.dft.reduce((s, d, i) => {
      const pred = getReaxPred(d, i + sum);
      return s + w * (pred - d) * (pred - d);
    }, 0);
  }, 0);

  const bondScanPts = trainData[0].dist.map((d, i) => [d, getReaxPred(trainData[0].dft[i], i)]);
  const dftPts = trainData[0].dist.map((d, i) => [d, trainData[0].dft[i]]);

  return (
    <Card color={T.eo_cond} title="ReaxFF Training" formula="min Σᵢ wᵢ [E_ReaxFF − E_DFT]²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Training ReaxFF is like <strong>tuning a piano with 1000 strings</strong>. Each string (parameter) affects the sound (energy prediction). You play a reference piece (DFT data) and compare it to what the piano produces {"\u2014"} every wrong note is an error. The optimizer tightens and loosens strings until the piano sounds as close as possible to the reference. The tricky part? Tightening one string can detune three others (parameter correlation). And if you only practice classical music (hydrocarbons), the piano will sound terrible playing jazz (ionic crystals) {"\u2014"} that is the <strong>transferability problem</strong>.
        </div>
      </div>

      {/* ── TRAINING OBJECTIVE EXPLAINED ── */}
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.ink, marginBottom:10 }}>The Training Objective — Every Term Explained</div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.2 }}>
          Error = <span style={{color:T.eo_e, fontWeight:700}}>Σ w<sub>E</sub>(E<sub>ReaxFF</sub> − E<sub>DFT</sub>)²</span> + <span style={{color:T.eo_core, fontWeight:700}}>Σ w<sub>F</sub>(F<sub>ReaxFF</sub> − F<sub>DFT</sub>)²</span> + <span style={{color:T.eo_valence, fontWeight:700}}>Σ w<sub>q</sub>(q<sub>ReaxFF</sub> − q<sub>DFT</sub>)²</span> + <span style={{color:"#9333ea", fontWeight:700}}>Σ w<sub>geo</sub>(r<sub>ReaxFF</sub> − r<sub>DFT</sub>)²</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10 }}>
          {[
            { term:"w_E × (E_ReaxFF − E_DFT)²", color:T.eo_e, what:"Energy Errors", desc:"Compare ReaxFF energies to DFT for bond scans (stretch C−C from 1.2 to 3.0 Å), angle scans (bend C−C−C from 90° to 180°), equation of state (compress/expand crystal), reaction barriers (e.g., H₂ + O₂ → H₂O transition state), and heats of formation. Typical weight w_E = 1.0 to 10.0." },
            { term:"w_F × (F_ReaxFF − F_DFT)²", color:T.eo_core, what:"Force Errors", desc:"Compare forces (−dE/dr) at each atom position. Forces must be accurate for molecular dynamics — wrong forces mean wrong trajectories. DFT gives forces at every atomic position in a snapshot. Typical weight w_F = 0.1 to 1.0 (forces are noisier than energies)." },
            { term:"w_q × (q_ReaxFF − q_DFT)²", color:T.eo_valence, what:"Charge Errors", desc:"Compare ReaxFF partial charges (from EEM) to DFT Mulliken/Bader charges. Critical for ionic systems: NaCl must show q_Na ≈ +0.9, q_Cl ≈ −0.9. Also controls dipole moments and electrostatic interactions. Typical weight w_q = 0.5 to 5.0." },
            { term:"w_geo × (r_ReaxFF − r_DFT)²", color:"#9333ea", what:"Geometry Errors", desc:"Compare optimized bond lengths, angles, and cell parameters. After minimization, does ReaxFF predict the same equilibrium structure as DFT? Includes lattice constants (a, b, c), bond lengths (C−C = 1.54 Å), and angles (O−H−O = 104.5°). Typical weight w_geo = 1.0 to 5.0." },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:item.color, marginBottom:2 }}>{item.what}</div>
              <div style={{ fontSize:9, color:T.ink, fontFamily:"monospace", marginBottom:4 }}>{item.term}</div>
              <div style={{ fontSize:10, color:T.muted, lineHeight:1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHAT TRAINING DATA IS NEEDED ── */}
      <div style={{ background:"#eef3ff", border:`1px solid ${T.eo_cond}`, borderRadius:8, padding:14, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.eo_cond, marginBottom:8 }}>DFT Training Data — What You Need to Generate</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8, marginBottom:10 }}>
          ReaxFF training requires a comprehensive set of DFT calculations that sample all the bonding situations the force field will encounter.
          Missing training data = poor predictions for those situations.
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
            <thead>
              <tr style={{ borderBottom:`2px solid ${T.border}` }}>
                {["Data Type","What You Calculate","DFT Setup","# Points","Why It Matters"].map(h=>(
                  <th key={h} style={{ padding:"5px 6px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type:"Bond Scans", calc:"E vs r for each bond type (C−C, C=O, O−H)", setup:"Dimer in box, fix r, relax rest", pts:"15-30 per pair", why:"Determines bond order parameters, De, r₀", color:T.eo_e },
                { type:"Angle Scans", calc:"E vs θ for each angle type (C−C−C, H−O−H)", setup:"Trimer, fix angle, relax bonds", pts:"10-20 per triplet", why:"Sets equilibrium angles, force constants", color:T.eo_core },
                { type:"Dihedral Scans", calc:"E vs φ for rotations (H−C−C−H in ethane)", setup:"Fix torsion angle, relax all else", pts:"12-36 per type", why:"Barrier heights, conformational preferences", color:"#9333ea" },
                { type:"Equation of State", calc:"E vs V for crystal (compress/expand ±20%)", setup:"Bulk crystal, vary cell, relax atoms", pts:"7-15 per phase", why:"Bulk modulus, lattice constant, phase stability", color:T.eo_valence },
                { type:"Reaction Barriers", calc:"E along reaction path (NEB/CI-NEB)", setup:"Transition state search", pts:"7-20 per reaction", why:"Activation energies for combustion, oxidation", color:T.eo_gap },
                { type:"Charges", calc:"Partial charges (Mulliken/Bader) on each atom", setup:"Molecule/crystal at equilibrium", pts:"1 per structure", why:"EEM parameters for electrostatics", color:T.eo_cond },
                { type:"Heats of Formation", calc:"Energy of molecule vs isolated atoms", setup:"Optimized molecule + atomic refs", pts:"1 per molecule", why:"Overall energy scale validation", color:"#b45309" },
                { type:"Surface Energies", calc:"E(slab) − n×E(bulk) / 2A", setup:"Slab model with vacuum", pts:"2-5 per surface", why:"Surface reactivity, adsorption accuracy", color:T.eo_e },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0?T.panel:T.surface }}>
                  <td style={{ padding:"5px 6px", color:row.color, fontWeight:700, fontSize:10 }}>{row.type}</td>
                  <td style={{ padding:"5px 6px", color:T.ink }}>{row.calc}</td>
                  <td style={{ padding:"5px 6px", color:T.muted }}>{row.setup}</td>
                  <td style={{ padding:"5px 6px", color:T.ink, textAlign:"center" }}>{row.pts}</td>
                  <td style={{ padding:"5px 6px", color:T.muted }}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:10, color:T.ink, marginTop:8, lineHeight:1.6 }}>
          <strong>Typical training set size:</strong> 200-2000 DFT data points for a single system (e.g., C/H/O).
          For each new element added, you need cross-interactions: C−N bond scans, C−N−C angles, etc.
          A 4-element system (C/H/O/N) may need 3000-5000 data points.
        </div>
      </div>

      {/* ── OPTIMIZATION METHODS ── */}
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:T.ink, marginBottom:10 }}>Optimization Methods — How Parameters Are Adjusted</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { name:"Single-Parameter\nParabolic", color:T.eo_e, how:"Original van Duin method. Vary ONE parameter at a time while fixing all others. Fit a parabola to 3 points → find minimum. Cycle through all parameters repeatedly.", pros:"Simple, intuitive, easy to debug", cons:"Very slow convergence. Gets stuck in local minima. Cannot find correlated parameters.", best:"Initial rough fitting, fine-tuning" },
            { name:"CMA-ES\n(Covariance Matrix)", color:T.eo_core, how:"Evolutionary strategy. Maintains a population of parameter sets. Learns correlations between parameters via covariance matrix. Samples new populations from multivariate Gaussian.", pros:"Handles correlations. Good global search. Robust to noise.", cons:"Slow for >100 parameters. Requires many function evaluations.", best:"Medium-sized parameter sets (50-200)" },
            { name:"Genetic Algorithm\n/ Differential Evol.", color:T.eo_valence, how:"Maintain population of candidate solutions. Apply mutation, crossover, selection. Fittest survive. Can run in parallel. OGOLEM and GARFfield are popular tools.", pros:"Embarrassingly parallel. Good exploration. Works with discrete params.", cons:"Many hyperparameters. Can be wasteful. Slow fine-tuning.", best:"Large parameter sets (200-1000+)" },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:item.color, marginBottom:4 }}>{item.name.split("\n").join(" ")}</div>
              <div style={{ fontSize:9, color:T.ink, lineHeight:1.6, marginBottom:4 }}><strong>How:</strong> {item.how}</div>
              <div style={{ fontSize:9, color:T.eo_valence, lineHeight:1.4, marginBottom:2 }}><strong>Pros:</strong> {item.pros}</div>
              <div style={{ fontSize:9, color:T.eo_gap, lineHeight:1.4, marginBottom:2 }}><strong>Cons:</strong> {item.cons}</div>
              <div style={{ fontSize:9, color:T.muted, lineHeight:1.4 }}><strong>Best for:</strong> {item.best}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PARAMETER CATEGORIES ── */}
      <div style={{ background:"#fff8ee", border:`1px solid #b45309`, borderRadius:8, padding:14, marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#b45309", marginBottom:8 }}>ReaxFF Parameters — What Gets Optimized</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.8, marginBottom:8 }}>
          A typical ReaxFF force field has <strong>500-3000+ parameters</strong> organized into categories:
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { cat:"General Parameters (39)", color:T.eo_core, params:"Overcoordination penalties, valence angle conjugation weights, torsion conjugation, hydrogen bond strength, and global cutoffs. These affect ALL atom types." },
            { cat:"Atom Parameters (32 per element)", color:T.eo_e, params:"r_σ, r_π, r_ππ (bond radii), electronegativity χ, hardness η (for EEM charges), valence, mass, lone pair energy, and over/undercoordination parameters. Example: C has Val=4, r_σ=1.54 Å." },
            { cat:"Bond Parameters (16 per pair)", color:T.eo_valence, params:"D_e (dissociation energy), p_be1, p_be2 (bond energy exponents), p_bo1-p_bo6 (bond order parameters for σ, π, ππ), p_over (overcoordination), and 1/3-body conjugation." },
            { cat:"Off-diagonal (6 per pair)", color:"#9333ea", params:"D_ij, r_vdW, α_ij, r_σ, r_π, r_ππ for heterogeneous pairs (C-O, C-N). Override combination rules when element-specific interactions are needed." },
            { cat:"Angle Parameters (7 per triplet)", color:T.eo_gap, params:"θ₀ (equilibrium angle), p_val1-p_val7 (angle energy shape, penalty, conjugation). Example: C−C−C has θ₀=109.5° for sp³, 120° for sp²." },
            { cat:"Torsion Parameters (7 per quartet)", color:T.eo_cond, params:"V₁, V₂, V₃ (barrier heights for 1-fold, 2-fold, 3-fold), p_tor1 (BO dependence), p_cot1 (conjugation). Controls rotation barriers in molecules." },
          ].map((item, i) => (
            <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:item.color, marginBottom:2 }}>{item.cat}</div>
              <div style={{ fontSize:9, color:T.muted, lineHeight:1.6 }}>{item.params}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE PLOTS + CALCULATIONS ── */}
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_cond, marginBottom:4 }}>C−C Bond Scan: ReaxFF vs DFT</div>
          <svg viewBox="0 0 340 200" style={{ display:"block", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:340 }}>
            <line x1={44} y1={12} x2={44} y2={170} stroke={T.dim} strokeWidth={1}/>
            <line x1={44} y1={170} x2={328} y2={170} stroke={T.dim} strokeWidth={1}/>
            <text x={186} y={192} textAnchor="middle" fill={T.muted} fontSize={10}>r (Å)</text>
            <text x={10} y={95} textAnchor="middle" fill={T.muted} fontSize={10} transform="rotate(-90, 10, 95)">E (eV)</text>
            {dftPts.map(([x, y], i) => {
              const sx = 44 + ((x - 1.0) / 2.0) * 284;
              const sy = 12 + 158 - ((y + 5) / 5.5) * 158;
              return <circle key={`dft-${i}`} cx={sx} cy={sy} r={5} fill={T.eo_e} opacity={0.8}/>;
            })}
            {bondScanPts.map(([x, y], i) => {
              const sx = 44 + ((x - 1.0) / 2.0) * 284;
              const sy = 12 + 158 - ((y + 5) / 5.5) * 158;
              return <rect key={`reax-${i}`} x={sx-4} y={sy-4} width={8} height={8} fill={T.eo_gap} opacity={0.8}/>;
            })}
            {dftPts.map(([x, yd], i) => {
              const yr = bondScanPts[i][1];
              const sx = 44 + ((x - 1.0) / 2.0) * 284;
              const sy1 = 12 + 158 - ((yd + 5) / 5.5) * 158;
              const sy2 = 12 + 158 - ((yr + 5) / 5.5) * 158;
              return <line key={`res-${i}`} x1={sx} y1={sy1} x2={sx} y2={sy2} stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3 2"/>;
            })}
            <circle cx={260} cy={25} r={4} fill={T.eo_e}/>
            <text x={268} y={29} fill={T.muted} fontSize={9}>DFT</text>
            <rect x={256} y={39} width={8} height={8} fill={T.eo_gap}/>
            <text x={268} y={47} fill={T.muted} fontSize={9}>ReaxFF</text>
          </svg>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.6 }}>
            Move the iteration slider to see ReaxFF predictions converge toward DFT reference data.
            Dashed lines show the residual error at each point.
          </div>

          <div style={{ marginTop:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.eo_cond, marginBottom:4 }}>Training Pipeline</div>
            <svg viewBox="0 0 340 90" style={{ display:"block", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:340 }}>
              {[
                { x:30, label:"DFT\nData", c:T.eo_e },
                { x:115, label:"Objective\nFunction", c:T.eo_gap },
                { x:200, label:"CMA-ES\nOptimizer", c:T.eo_core },
                { x:285, label:"ReaxFF\nParams", c:T.eo_valence },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x-30} y={15} width={60} height={55} rx={6} fill={b.c+"22"} stroke={b.c} strokeWidth={1.5}/>
                  {b.label.split("\n").map((line, j) => (
                    <text key={j} x={b.x} y={38+j*14} textAnchor="middle" fill={b.c} fontSize={9} fontWeight={700}>{line}</text>
                  ))}
                  {i < 3 && <line x1={b.x+32} y1={42} x2={b.x+53} y2={42} stroke={T.dim} strokeWidth={1.5} markerEnd="url(#arrowFF)"/>}
                </g>
              ))}
              <defs><marker id="arrowFF" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={T.dim}/></marker></defs>
              <path d="M 285 72 L 285 82 L 30 82 L 30 72" fill="none" stroke={T.dim} strokeWidth={1} strokeDasharray="4 3"/>
              <text x={157} y={80} textAnchor="middle" fill={T.muted} fontSize={8}>iterate until converged</text>
            </svg>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="Iteration (training progress)" value={iteration} min={0} max={100} step={1} onChange={setIteration} color={T.eo_cond} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="w_bond — weight for bond energy errors" value={wBond} min={0.1} max={5.0} step={0.1} onChange={setWBond} color={T.eo_e} unit=""/>
          <SliderRow label="w_angle — weight for angle errors" value={wAngle} min={0.1} max={5.0} step={0.1} onChange={setWAngle} color={T.eo_core} unit=""/>
          <SliderRow label="w_charge — weight for charge errors" value={wCharge} min={0.1} max={5.0} step={0.1} onChange={setWCharge} color={T.eo_valence} unit=""/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>NUMERICAL EXAMPLE — OBJECTIVE FUNCTION</div>
            <CalcRow eq="Step 1: Bond energy errors (8 data points)" result="" color={T.eo_e}/>
            <CalcRow eq={`  Σ w_bond × (E_ReaxFF − E_DFT)²`} result={`w=${wBond.toFixed(1)}`} color={T.eo_e}/>
            <CalcRow eq="Step 2: Angle errors (7 data points)" result="" color={T.eo_core}/>
            <CalcRow eq={`  Σ w_angle × (θ_ReaxFF − θ_DFT)²`} result={`w=${wAngle.toFixed(1)}`} color={T.eo_core}/>
            <CalcRow eq="Step 3: Charge errors (8 data points)" result="" color={T.eo_valence}/>
            <CalcRow eq={`  Σ w_charge × (q_ReaxFF − q_DFT)²`} result={`w=${wCharge.toFixed(1)}`} color={T.eo_valence}/>
            <CalcRow eq="Step 4: Total weighted SSE" result={`${totalErr.toFixed(4)}`} color={T.eo_gap}/>
            <CalcRow eq={`Iteration ${iteration}/100 → ${(progress*100).toFixed(0)}% converged`} result={totalErr < 0.1 ? "CONVERGED" : totalErr < 0.5 ? "GOOD FIT" : "FITTING..."} color={T.eo_cond}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Total Error" value={`${totalErr.toFixed(3)}`} color={T.eo_gap}
              sub={totalErr < 0.1 ? "converged" : totalErr < 0.5 ? "good fit" : "still fitting"}/>
            <ResultBox label="Iteration" value={`${iteration}/100`} color={T.eo_cond}
              sub={`${(progress*100).toFixed(0)}% complete`}/>
          </div>

          {/* ── COMMON PITFALLS ── */}
          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8,
            background:T.surface, padding:10, borderRadius:8, border:`1px solid ${T.border}` }}>
            <strong style={{color:T.ink}}>Common Training Pitfalls:</strong>
            <br/><span style={{color:T.eo_gap}}>Overfitting:</span> Parameters fit perfectly to training data but fail on new structures. Solution: validate against a separate test set of DFT data not used in training.
            <br/><span style={{color:T.eo_e}}>Weight imbalance:</span> Setting w_bond too high makes angles/charges inaccurate. Setting w_charge too high makes energies wrong. Start with w=1.0 for all, then adjust based on which properties matter most for your application.
            <br/><span style={{color:T.eo_core}}>Missing data:</span> If you never include surface DFT data, surface chemistry will be wrong. If you never include high-pressure data, the equation of state extrapolates poorly.
            <br/><span style={{color:T.eo_valence}}>Parameter correlation:</span> Bond order parameters (p_bo) are strongly correlated with bond energy parameters (D_e). Changing one requires re-optimizing the other. This is why global optimizers outperform single-parameter methods.
            <br/><span style={{color:"#9333ea"}}>Transferability:</span> A C/H/O force field trained on hydrocarbons may fail for carbohydrates. Each new chemistry requires new training data and re-fitting.
          </div>

          {/* ── TOOLS ── */}
          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8,
            background:"#eef3ff", padding:10, borderRadius:8, border:`1px solid ${T.eo_cond}` }}>
            <strong style={{color:T.eo_cond}}>Available Training Tools:</strong>
            <br/><span style={{color:T.ink}}>PARATEC/trainReaxFF:</span> Original van Duin single-parameter parabolic search (Fortran). The oldest and most widely used.
            <br/><span style={{color:T.ink}}>GARFfield:</span> Genetic algorithm-based fitting by Mueller et al. Good for large parameter spaces. Parallelizable.
            <br/><span style={{color:T.ink}}>OGOLEM:</span> Global optimization framework (genetic algorithm + local optimization). Used for complex multi-element systems.
            <br/><span style={{color:T.ink}}>AMS/ReaxFF:</span> Commercial tool (SCM Amsterdam) with GUI-based training, CMA-ES optimizer, and automated training set generation.
            <br/><span style={{color:T.ink}}>ReaxFF-LAMMPS:</span> Free implementation in LAMMPS. Training done externally, simulation in LAMMPS with "pair_style reaxff".
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────────────────────────────────────
function CompareSection() {
  const rows = [
    { name:"Bond harmonic", formula:"½kᵦ(r−r₀)²", atoms:"2 bonded", captures:"stretch/compress", fails:"never breaks", color:T.ff_bond },
    { name:"Angle harmonic", formula:"½kθ(θ−θ₀)²", atoms:"3 bonded", captures:"bending", fails:"never stiffens at extremes", color:T.ff_angle },
    { name:"vdW (LJ 12-6)", formula:"4ε[(σ/r)¹²−(σ/r)⁶]", atoms:"2 any", captures:"non-bonded attract/repel", fails:"short-range only", color:T.ff_vdw },
    { name:"Coulomb", formula:"qᵢqⱼ/4πε₀r", atoms:"2 charged", captures:"long-range electrostatics", fails:"needs special treatment (Ewald)", color:T.ff_coul },
    { name:"Dihedral", formula:"kₙ[1+cos(nϕ−δ)]", atoms:"4 bonded", captures:"rotation barrier", fails:"complex profiles need many n terms", color:T.ff_dih },
    { name:"Morse", formula:"Dₑ[1−e^{−a(r−r₀)}]²", atoms:"2 bonded", captures:"asymmetry + bond breaking", fails:"needs De parameter per pair", color:T.ff_morse },
  ];

  return (
    <div style={{ background:T.panel, border:`1.5px solid ${T.border}`, borderRadius:10, padding:18 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Building a force field is like assembling a <strong>toolkit for a mechanic</strong>. Bond stretching is the wrench (handles pull/push along a shaft). Angle bending is the protractor (measures and resists bending). vdW is the bumper (keeps non-touching parts from colliding). Coulomb is the magnet (long-range pull or push). Dihedral is the ratchet (controls rotation). Morse is the upgraded wrench that knows when a bolt snaps. No single tool does everything {"\u2014"} you need the whole toolkit together. And if you need to handle something exotic (like a chemical reaction), you upgrade to the power-tool version: ReaxFF or MLFF.
        </div>
      </div>
      <div style={{ fontSize:14, fontWeight:800, color:T.ink, marginBottom:14, letterSpacing:0.5 }}>
        All 6 terms — side by side
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${T.border}` }}>
              {["Term","Formula","Atoms needed","What it captures","Where it fails"].map(h=>(
                <th key={h} style={{ padding:"6px 10px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:11, letterSpacing:0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0?T.surface:T.panel }}>
                <td style={{ padding:"8px 10px", color:row.color, fontWeight:700 }}>{row.name}</td>
                <td style={{ padding:"8px 10px", fontFamily:"'Georgia',serif", color:T.ink, fontSize:11 }}>{row.formula}</td>
                <td style={{ padding:"8px 10px", color:T.muted }}>{row.atoms}</td>
                <td style={{ padding:"8px 10px", color:T.ink }}>{row.captures}</td>
                <td style={{ padding:"8px 10px", color:T.muted, fontStyle:"italic" }}>{row.fails}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:16, background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:8 }}>
          Total energy of a molecule = sum of ALL applicable terms:
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:T.ink, lineHeight:2 }}>
          U<sub>total</sub> = U<sub style={{color:T.ff_bond}}>bonds</sub> + U<sub style={{color:T.ff_angle}}>angles</sub> + U<sub style={{color:T.ff_dih}}>dihedrals</sub> + U<sub style={{color:T.ff_vdw}}>vdW</sub> + U<sub style={{color:T.ff_coul}}>Coulomb</sub>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:T.muted, lineHeight:1.8 }}>
          <strong style={{color:T.ff_morse}}>DefectNet replaces ALL of this</strong> with a single GNN that learns the true
          energy surface directly from DFT — no assumed formulas, no manual parameter fitting.
          It automatically captures bonding, angles, long-range effects, and charge state dependence
          that classical force fields cannot handle.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FORCE FIELD MODULE — Chapter 1-style block/section architecture
// ═══════════════════════════════════════════════════════════════════════════

const FF_BLOCKS = [
  { id: "classical",  label: "Classical Potentials",   color: T.eo_core },
  { id: "advanced",   label: "Advanced Force Fields",  color: T.eo_valence },
  { id: "learning",   label: "Fitting & ML",           color: T.eo_cond },
];

const FF_SECTIONS = [
  // Classical Potentials
  { id:"bond",     block:"classical", label:"Bond Stretching",     color: T.eo_core,    Component: BondSection,     nextReason:"Bond stretching is one degree of freedom. Atoms also resist bending — the angle potential captures the energy cost of deviating from equilibrium bond angles." },
  { id:"angle",    block:"classical", label:"Angle Bending",       color: T.eo_core,    Component: AngleSection,    nextReason:"Bonds and angles describe covalently bonded neighbors. Van der Waals forces handle all non-bonded pairs — dispersion and Pauli repulsion." },
  { id:"vdw",      block:"classical", label:"van der Waals",       color: T.eo_core,    Component: VdwSection,      nextReason:"vdW handles short-range non-bonded interactions. Charged atoms add long-range electrostatics — Coulomb forces dominate in ionic crystals." },
  { id:"coulomb",  block:"classical", label:"Coulomb",             color: T.eo_core,    Component: CoulombSection,  nextReason:"All pairwise terms are now covered. Dihedral terms introduce four-body interactions — the energy barrier to rotating around a bond." },
  { id:"dihedral", block:"classical", label:"Dihedral Torsion",    color: T.eo_core,    Component: DihedralSection, nextReason:"Harmonic bond terms assume small displacements. The Morse potential extends coverage to large displacements and bond dissociation." },
  { id:"morse",    block:"classical", label:"Morse Potential",     color: T.eo_core,    Component: MorseSection,    nextReason:"Classical pair potentials cannot capture many-body metallic bonding. EAM adds an embedding function that depends on the local electron density." },
  // Advanced Force Fields
  { id:"eam",      block:"advanced",  label:"EAM (Metals)",        color: T.eo_valence, Component: EAMSection,      nextReason:"EAM works for metals but not for reactive chemistry. ReaxFF introduces bond-order-dependent potentials that allow bonds to form and break dynamically." },
  { id:"reaxff",   block:"advanced",  label:"ReaxFF (Reactive)",   color: T.eo_valence, Component: ReaxFFSection,   nextReason:"ReaxFF has thousands of parameters that must be optimized. Understanding how ReaxFF is trained reveals the challenges of reactive force field development." },
  { id:"reaxfftrain", block:"advanced", label:"ReaxFF Training",   color: T.eo_valence, Component: ReaxFFTrainingSection, nextReason:"Classical FF fitting requires manually chosen functional forms. Machine-learning force fields learn the potential energy surface directly from data." },
  // Fitting & ML
  { id:"fit",      block:"learning",  label:"FF Fitting",          color: T.eo_cond,    Component: FittingSection,  nextReason:"Classical fitting is limited by the assumed functional form. Machine-learning force fields automatically capture complex many-body interactions." },
  { id:"mlff",     block:"learning",  label:"MLFF",                color: T.eo_cond,    Component: MLFFSection,     nextReason:"Every approach makes trade-offs. The summary compares classical FF, EAM, ReaxFF, and MLFF side-by-side." },
  { id:"compare",  block:"learning",  label:"Summary",             color: T.eo_cond,    Component: CompareSection,  nextReason:"Force fields model the interactions. Molecular Dynamics uses these potentials to integrate Newton's equations and simulate real atomic trajectories." },
];

function FFSectionTitle({ color, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color, letterSpacing: 0.5 }}>{children}</div>
    </div>
  );
}

function ForceFieldModule() {
  const [active, setActive] = useState("bond");
  const [activeBlock, setActiveBlock] = useState("classical");
  const sec = FF_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const blockSections = FF_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{
        display: "flex",
        padding: "8px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
      }}>
        {FF_BLOCKS.map(b => (
          <button key={b.id} onClick={() => {
            setActiveBlock(b.id);
            const first = FF_SECTIONS.find(s => s.block === b.id);
            if (first) setActive(first.id);
          }} style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg,
            color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "inherit",
            fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Section tabs within active block */}
      <div style={{
        display: "flex",
        padding: "6px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
        flexWrap: "wrap",
      }}>
        {blockSections.map((s) => {
          const globalIdx = FF_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg,
              color: active === s.id ? s.color : T.muted,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              fontWeight: active === s.id ? 700 : 400,
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <FFSectionTitle color={sec.color}>{sec.label}</FFSectionTitle>
        <Component />
        {sec.nextReason && (
          <div style={{
            marginTop: 28, padding: "14px 18px", borderRadius: 10,
            background: sec.color + "0a", border: `1.5px solid ${sec.color}22`,
            borderLeft: `4px solid ${sec.color}`,
          }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => {
                const idx = FF_SECTIONS.findIndex(s => s.id === active);
                const next = FF_SECTIONS[idx + 1];
                return next ? <span> Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>.</span> : null;
              })()}
            </div>
          </div>
        )}
        <ChapterReferences chapterId="forcefield" />
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: "10px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: T.panel,
      }}>
        <button onClick={() => {
          const i = FF_SECTIONS.findIndex(s => s.id === active);
          if (i > 0) {
            const prev = FF_SECTIONS[i - 1];
            setActive(prev.id);
            setActiveBlock(prev.block);
          }
        }} disabled={active === FF_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === FF_SECTIONS[0].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === FF_SECTIONS[0].id ? T.border : sec.color}`,
          color: active === FF_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === FF_SECTIONS[0].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Previous</button>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {FF_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: 7, height: 7, borderRadius: 4,
              background: active === s.id ? s.color : s.block === activeBlock ? s.color + "44" : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>

        <button onClick={() => {
          const i = FF_SECTIONS.findIndex(s => s.id === active);
          if (i < FF_SECTIONS.length - 1) {
            const next = FF_SECTIONS[i + 1];
            setActive(next.id);
            setActiveBlock(next.block);
          }
        }} disabled={active === FF_SECTIONS[FF_SECTIONS.length - 1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === FF_SECTIONS[FF_SECTIONS.length - 1].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === FF_SECTIONS[FF_SECTIONS.length - 1].id ? T.border : sec.color}`,
          color: active === FF_SECTIONS[FF_SECTIONS.length - 1].id ? T.muted : sec.color,
          cursor: active === FF_SECTIONS[FF_SECTIONS.length - 1].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

// ── DFT Chapter helpers (module scope so all section components can use them) ──
const D = {
  main:   T.dft_main,
  eqn:    T.dft_eqn,
  xc:     T.dft_xc,
  basis:  T.dft_basis,
  warn:   T.dft_warn,
  accent: T.dft_accent,
  warm:   T.dft_warm,
};

const mathBlock = {
  fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 15, lineHeight: 2.0,
  background: T.surface, borderRadius: 12, padding: "18px 22px",
  border: `1px solid ${T.border}40`, marginBottom: 10,
};

const Frac = ({ n, d, color, size }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 3px", color: color || "inherit", fontSize: size || "inherit" }}>
    <span style={{ borderBottom: `1.5px solid ${color || T.ink}`, padding: "0 5px 2px", lineHeight: 1.2, fontSize: "0.82em" }}>{n}</span>
    <span style={{ padding: "2px 5px 0", lineHeight: 1.2, fontSize: "0.82em" }}>{d}</span>
  </span>
);

const Bracket = ({ children, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle", color: color || "inherit" }}>
    <span style={{ fontSize: "2em", fontWeight: 200, lineHeight: 1, marginRight: 1 }}>[</span>
    {children}
    <span style={{ fontSize: "2em", fontWeight: 200, lineHeight: 1, marginLeft: 1 }}>]</span>
  </span>
);

const EqRow = ({ children, style: s }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 4, padding: "10px 0", fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 17, ...s }}>
    {children}
  </div>
);

const Sub = ({ children }) => <sub style={{ fontSize: "0.65em", verticalAlign: "-0.25em" }}>{children}</sub>;
const Sup = ({ children }) => <sup style={{ fontSize: "0.65em", verticalAlign: "0.45em" }}>{children}</sup>;

const hl = (text, color) => <span style={{ color, fontWeight: 700 }}>{text}</span>;

const DFT_ANALOGY_BOX = ({ text }) => (
  <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
    <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>{text}</div>
  </div>
);

// ── DFT Block/Section definitions ──
const DFT_BLOCKS = [
  { id: "foundations", label: "Theoretical Foundations",  color: T.dft_main },
  { id: "functionals", label: "XC Functionals",          color: T.dft_xc },
  { id: "numerics",    label: "Numerical Methods",       color: T.dft_basis },
  { id: "examples",    label: "Worked Examples & Lab",     color: T.dft_accent },
  { id: "movies",      label: "Movies",                   color: T.dft_warm },
];

// ── DFT Section Components ──

function DFTManyBodySection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="The Fundamental Problem" color={D.main}>
        <DFT_ANALOGY_BOX text={"Consider just 3 electrons around a lithium atom. Electron 1 repels electron 2, which shifts electron 2's position, which changes how electron 3 is repelled, which loops back to electron 1. Even with just 3 electrons you need a wavefunction \u03A8(r\u2081, r\u2082, r\u2083) in 9 dimensions. A 64-atom crystal has ~1,920 electrons \u2014 that's 5,760 dimensions. The exact solution is mathematically impossible beyond a handful of electrons."} />
        <div style={{
          background: D.main + "0a", border: `1.5px solid ${D.main}30`,
          borderRadius: 10, padding: "14px 18px", marginBottom: 14,
          fontSize: 14, fontWeight: 600, color: D.main, textAlign: "center", lineHeight: 1.6,
        }}>
          How do you solve quantum mechanics for 10{"\u00B2\u00B3"} interacting electrons?
          You don{"'"}t. You use DFT instead.
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 14 }}>
          The exact Schr{"\u00F6"}dinger equation for N electrons requires a wave function
          {" "}{hl("\u03A8(r\u2081, r\u2082, ... r_N)", D.eqn)} with 3N variables.
          This is completely unsolvable for real materials.
        </div>

        {/* Labeled Schrodinger Equation */}
        <div style={{
          background: "#f8f9ff", border: `2px solid ${D.eqn}30`,
          borderRadius: 12, padding: "24px 20px", position: "relative",
        }}>
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: D.main, marginBottom: 18, letterSpacing: 2, textTransform: "uppercase" }}>
            Many-Body Schr{"\u00F6"}dinger Equation
          </div>

          <EqRow>
            <Bracket color="#6366f1">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: "#6366f1" }}>{"\u2212"}</span>
                <Frac n={<>{"\u0127"}<Sup>2</Sup></>} d="2m" color="#6366f1" />
                <span style={{ color: "#6366f1" }}>{"\u2211"}<Sub>i</Sub> {"\u2207"}<Sub>i</Sub><Sup>2</Sup></span>
              </span>
              <span style={{ color: "#059669", marginLeft: 6 }}>+ {"\u2211"}<Sub>i,I</Sub> V(r<Sub>i</Sub>, R<Sub>I</Sub>)</span>
              <span style={{ color: "#dc2626", marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
                + {"\u2211"}<Sub>{"i<j"}</Sub>
                <Frac n="1" d={<>|r<Sub>i</Sub> {"\u2212"} r<Sub>j</Sub>|</>} color="#dc2626" />
              </span>
            </Bracket>
            <span style={{ color: "#7c3aed", fontWeight: 600, marginLeft: 4 }}>{"\u03A8"}(r<Sub>1</Sub>, ... r<Sub>N</Sub>)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: "#b45309", fontWeight: 700 }}>E</span>
            <span style={{ color: "#7c3aed", fontWeight: 600, marginLeft: 4 }}>{"\u03A8"}</span>
          </EqRow>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { label: "T\u0302", text: "Kinetic energy", color: "#6366f1", icon: "\u2212\u0127\u00B2/2m \u2207\u00B2" },
              { label: "V\u2091\u2099", text: "Electron-nucleus", color: "#059669", icon: "attraction" },
              { label: "V\u2091\u2091", text: "Electron-electron", color: "#dc2626", icon: "repulsion" },
              { label: "\u03A8", text: "3N-dim wavefunction", color: "#7c3aed", icon: "" },
              { label: "E", text: "Total energy", color: "#b45309", icon: "eigenvalue" },
            ].map(item => (
              <div key={item.label} style={{
                background: item.color + "0c", border: `1px solid ${item.color}25`,
                borderRadius: 8, padding: "5px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: "serif" }}>{item.label}</div>
                <div style={{ fontSize: 9, color: item.color, fontWeight: 600 }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 14, background: D.warn + "08", border: `1.5px solid ${D.warn}20`,
          borderRadius: 10, padding: "12px 16px", fontSize: 12, lineHeight: 1.7, color: T.ink,
        }}>
          <strong style={{ color: D.warn }}>Why this is impossible:</strong> The electron-electron term
          {" "}<Frac n="1" d={<>|r<Sub>i</Sub> {"\u2212"} r<Sub>j</Sub>|</>} color="#dc2626" size={13} /> couples
          ALL electrons together. You cannot separate {"\u03A8"} into individual electron functions.
          For N electrons, {"\u03A8"} lives in a 3N-dimensional space {"\u2014"} a 64-atom solid has ~6000 dimensions.
        </div>
      </Card>

      <Card title="The Hartree-Fock Approach" color="#7c3aed">
        <DFT_ANALOGY_BOX text={"In a helium atom, HF gives each electron its own orbital and says: 'feel the average repulsion from the other electron.' This captures exchange (two same-spin electrons can't be in the same state) and gets 99% of the energy right. But in reality, when electron 1 moves left, electron 2 instantly shifts right to stay away \u2014 this dynamic avoidance (correlation) is missed entirely by HF."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 12 }}>
          Before DFT, the main approach was <strong style={{ color: "#7c3aed" }}>Hartree-Fock (HF)</strong> theory.
          The idea: approximate the many-body wavefunction as a single <em>Slater determinant</em> of one-electron orbitals.
        </div>
        <div style={mathBlock}>
          <EqRow>
            <span style={{ color: "#7c3aed", fontWeight: 600 }}>{"\u03A8"}<Sub>HF</Sub></span>
            <span style={{ margin: "0 6px" }}>=</span>
            <Frac n="1" d={<>{"\u221A"}<span style={{ textDecoration: "overline" }}>N!</span></>} color="#7c3aed" />
            <span style={{ color: "#7c3aed", fontSize: 15, marginLeft: 4 }}>det</span>
            <Bracket color="#7c3aed">
              <span style={{ fontSize: 15 }}>{"\u03C6"}<Sub>1</Sub>(r<Sub>1</Sub>) {"\u03C6"}<Sub>2</Sub>(r<Sub>2</Sub>) {"\u2026"} {"\u03C6"}<Sub>N</Sub>(r<Sub>N</Sub>)</span>
            </Bracket>
          </EqRow>
          <div style={{ color: T.muted, fontSize: 12, textAlign: "center" }}>Slater determinant automatically satisfies the Pauli exclusion principle</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 2 }}>What HF gets right:</div>
          {[
            "Exchange interaction \u2014 Pauli exclusion between same-spin electrons",
            "~99% of total energy for atoms and molecules",
            "Good qualitative picture of chemical bonding",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.ink, lineHeight: 1.5 }}>
              <span style={{ color: "#059669", fontWeight: 700 }}>{"\u2713"}</span> {t}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: D.warn, marginBottom: 2 }}>What HF gets wrong:</div>
          {[
            "Misses correlation energy \u2014 electrons avoid each other dynamically, HF ignores this",
            "Band gaps are severely overestimated (often 2\u20133\u00D7 too large)",
            "Scales as O(N\u2074) \u2014 very expensive for large systems",
            "No van der Waals interactions at all",
            "Metals described incorrectly (zero density of states at Fermi level)",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.ink, lineHeight: 1.5 }}>
              <span style={{ color: D.warn, fontWeight: 700 }}>{"\u2717"}</span> {t}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, background: "#7c3aed0a", border: `1.5px solid #7c3aed25`,
          borderRadius: 10, padding: "12px 16px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>
            HF {"\u2192"} DFT: The missing piece is correlation
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>
            E<sub>exact</sub> = E<sub>HF</sub> + E<sub>correlation</sub><br />
            DFT bundles both exchange AND correlation into E<sub>xc</sub>[n(r)], getting better accuracy
            at lower cost. DFT scales as O(N{"\u00B3"}) vs HF{"'"}s O(N{"\u2074"}).
          </div>
        </div>
      </Card>

      <Card title="The Scaling Disaster" color={D.warn}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { sys: "H atom", n: 1, vars: "3", status: "Exact solution exists", color: D.basis },
            { sys: "H\u2082 molecule", n: 2, vars: "6", status: "Solvable numerically", color: D.basis },
            { sys: "H\u2082O molecule", n: 10, vars: "30", status: "Expensive but doable", color: D.warm },
            { sys: "Fe atom", n: 26, vars: "78", status: "Requires approximations", color: D.warm },
            { sys: "64-atom CuInSe\u2082", n: 1920, vars: "5,760", status: "Impossible exactly", color: D.warn },
            { sys: "1000-atom cell", n: 30000, vars: "90,000", status: "Absolutely impossible", color: D.warn },
          ].map(item => (
            <div key={item.sys} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: item.color + "06", borderRadius: 8, padding: "8px 14px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ minWidth: 130, fontSize: 12, fontWeight: 700, color: item.color }}>{item.sys}</div>
              <div style={{ minWidth: 40, fontSize: 11, color: T.muted, fontFamily: "monospace" }}>{item.n} e{"\u207B"}</div>
              <div style={{ minWidth: 60, fontSize: 11, color: T.muted, fontFamily: "monospace" }}>{item.vars} vars</div>
              <div style={{ flex: 1, fontSize: 11, color: T.ink }}>{item.status}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="DFT - The Key Insight" color={D.accent}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>
          Instead of the 3N-variable wave function, use the <strong style={{ color: D.accent }}>electron density n(r)</strong> -
          just 3 variables, no matter how many electrons. DFT proves that n(r) contains ALL
          the information needed to determine the ground-state energy.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.warn }}>Exact: {"\u03A8"}(r{"\u2081"}, r{"\u2082"}, ... r_N) - 3N dimensions</span><br />
          <span style={{ color: D.basis }}>DFT:  n(r) - 3 dimensions</span><br /><br />
          <span style={{ color: T.muted }}>Hohenberg & Kohn (1964), Kohn & Sham (1965)</span><br />
          <span style={{ color: T.muted }}>Nobel Prize in Chemistry 1998 (Walter Kohn)</span>
        </div>
      </Card>
    </div>
  );
}

function DFTHohenbergKohnSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Hohenberg-Kohn Theorem 1 - Existence" color={D.eqn}>
        <DFT_ANALOGY_BOX text={"Picture a neon atom with 10 electrons. Instead of tracking all 10 electron positions simultaneously (30 coordinates!), measure just the electron cloud density n(r) \u2014 how much charge is at each point in 3D space. Hohenberg-Kohn proves that this single 3D function contains ALL the same physics as the full 30-dimensional wavefunction. Two different atoms cannot have the same electron density, so n(r) uniquely determines everything."} />
        <div style={mathBlock}>
          <span style={{ color: D.eqn, fontWeight: 700 }}>The ground-state energy E is a unique functional of n(r)</span><br /><br />
          E = E[n(r)]<br /><br />
          <span style={{ color: T.muted }}>Two different external potentials cannot produce the same n(r).</span><br />
          <span style={{ color: T.muted }}>Therefore n(r) uniquely determines everything: V_ext, {"\u03A8"}, and E.</span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>
          This is profound: the 3-variable density contains the same physics as the
          3N-variable wave function. But the theorem only proves E[n] <em>exists</em> -
          it doesn{"'"}t tell us what E[n] actually looks like.
        </div>
      </Card>

      <Card title="Hohenberg-Kohn Theorem 2 - Variational Principle" color={D.basis}>
        <div style={mathBlock}>
          <span style={{ color: D.basis, fontWeight: 700 }}>The true ground-state n(r) minimizes E[n]</span><br /><br />
          E[n_true] {"\u2264"} E[n_trial]  for any trial density n_trial<br /><br />
          <span style={{ color: T.muted }}>This gives us a strategy: search over densities to find the minimum.</span>
        </div>
      </Card>

      <Card title="The Energy Functional" color={D.main}>
        <div style={mathBlock}>
          <EqRow style={{ fontSize: 18 }}>
            <span style={{ fontWeight: 600 }}>E[n]</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: D.eqn }}>T[n]</span>
            <span style={{ margin: "0 4px" }}>+</span>
            <span style={{ color: D.basis }}>V<Sub>ext</Sub>[n]</span>
            <span style={{ margin: "0 4px" }}>+</span>
            <span style={{ color: D.warm }}>V<Sub>H</Sub>[n]</span>
            <span style={{ margin: "0 4px" }}>+</span>
            <span style={{ color: D.xc, fontWeight: 700 }}>E<Sub>xc</Sub>[n]</span>
          </EqRow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {[
              { sym: "T[n]", desc: "kinetic energy of electrons", color: D.eqn },
              { sym: <><span>V</span><Sub>ext</Sub><span>[n]</span></>, desc: "electron-ion attraction (known exactly)", color: D.basis },
              { sym: <><span>V</span><Sub>H</Sub><span>[n]</span></>, desc: "Hartree (classical e\u207B\u2212e\u207B repulsion, known exactly)", color: D.warm },
              { sym: <><span>E</span><Sub>xc</Sub><span>[n]</span></>, desc: "exchange-correlation (UNKNOWN \u2014 must approximate!)", color: D.xc },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: item.color, fontWeight: 700, fontFamily: "serif", fontSize: 16, minWidth: 70 }}>{item.sym}</span>
                <span style={{ fontSize: 13, color: T.ink }}>= {item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: D.xc + "0c", border: `1.5px solid ${D.xc}30`,
          borderRadius: 10, padding: "12px 16px", fontSize: 12, color: D.xc, fontWeight: 600, lineHeight: 1.6,
        }}>
          E<Sub>xc</Sub> is where ALL the difficulty lives. Every DFT functional (LDA, PBE, HSE, etc.)
          is a different approximation for this one term.
        </div>
      </Card>
    </div>
  );
}

function DFTKohnShamSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="The Kohn-Sham Trick" color={D.eqn}>
        <DFT_ANALOGY_BOX text={"Take carbon with 6 interacting electrons. Solving all 6 together is a nightmare \u2014 every electron pushes on every other. Kohn-Sham's trick: replace these 6 interacting electrons with 6 independent electrons, each moving in a cleverly designed effective potential V_eff(r). This potential is tuned so the 6 independent electrons produce exactly the same total density n(r) as the real interacting ones. Now you solve 6 simple one-electron equations instead of one impossible 6-electron equation."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Replace the interacting many-electron problem with <strong style={{ color: D.eqn }}>non-interacting
          electrons</strong> moving in an effective potential that reproduces the exact density.
        </div>
        <div style={mathBlock}>
          <EqRow>
            <Bracket color={D.eqn}>
              <span style={{ color: D.eqn, display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n={<>{"\u0127"}<Sup>2</Sup></>} d="2m" color={D.eqn} />
                {"\u2207"}<Sup>2</Sup>
              </span>
              <span style={{ margin: "0 4px" }}>+</span>
              <span style={{ color: D.main }}>V<Sub>eff</Sub>(r)</span>
            </Bracket>
            <span style={{ color: D.xc, marginLeft: 4 }}>{"\u03C8"}<Sub>i</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: D.eqn }}>{"\u03B5"}<Sub>i</Sub></span>
            <span style={{ color: D.xc, marginLeft: 4 }}>{"\u03C8"}<Sub>i</Sub>(r)</span>
          </EqRow>
          <EqRow style={{ fontSize: 15, marginTop: 8 }}>
            <span style={{ color: D.main, fontWeight: 600 }}>V<Sub>eff</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: D.basis }}>V<Sub>ext</Sub>(r)</span>
            <span style={{ margin: "0 4px" }}>+</span>
            <span style={{ color: D.warm }}>V<Sub>H</Sub>(r)</span>
            <span style={{ margin: "0 4px" }}>+</span>
            <span style={{ color: D.xc }}>V<Sub>xc</Sub>(r)</span>
          </EqRow>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.basis, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 60 }}>V<Sub>ext</Sub>(r)</span>
              <span style={{ fontSize: 13, color: T.ink }}>= ion potential (nuclear charges)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.warm, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 60 }}>V<Sub>H</Sub>(r)</span>
              <span style={{ fontSize: 13, color: T.ink, display: "inline-flex", alignItems: "center" }}>= {"\u222B"} <Frac n={<>n(r{"\u2032"})</>} d={<>|r {"\u2212"} r{"\u2032"}|</>} color={D.warm} size={13} /> dr{"\u2032"}{"  (Hartree potential)"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.xc, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 60 }}>V<Sub>xc</Sub>(r)</span>
              <span style={{ fontSize: 13, color: T.ink, display: "inline-flex", alignItems: "center" }}>= <Frac n={<>{"\u03B4"}E<Sub>xc</Sub>[n]</>} d={<>{"\u03B4"}n(r)</>} color={D.xc} size={13} />{"  (XC potential)"}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Self-Consistent Field (SCF) Loop" color={D.main}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { step: "1", text: "Guess initial density n(r) (from superposition of atomic densities)", color: D.basis },
            { step: "2", text: "Build V_eff(r) = V_ext + V_H[n] + V_xc[n]", color: D.main },
            { step: "3", text: "Solve KS equations: [\u2212\u0127\u00B2/2m \u2207\u00B2 + V_eff] \u03C8_i = \u03B5_i \u03C8_i", color: D.eqn },
            { step: "4", text: "Compute new density: n_new(r) = \u03A3_i |\u03C8_i(r)|\u00B2", color: D.warm },
            { step: "5", text: "Mix: n_mix = \u03B1 n_new + (1-\u03B1) n_old  (prevents oscillation)", color: D.accent },
            { step: "6", text: "Converged? |E_new - E_old| < EDIFF? If not, go to step 2", color: D.warn },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                minWidth: 26, height: 26, borderRadius: "50%",
                background: item.color + "15", border: `1.5px solid ${item.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: item.color,
              }}>{item.step}</div>
              <div style={{
                flex: 1, fontSize: 12, color: T.ink, fontFamily: "monospace",
                background: item.color + "06", borderRadius: 6, padding: "6px 12px",
                border: `1px solid ${item.color}12`,
              }}>{item.text}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Numerical Example - SCF Convergence for CuInSe\u2082"} color={D.accent}>
        <div style={mathBlock}>
          <span style={{ color: D.accent, fontWeight: 700 }}>64-atom supercell, PBE, ENCUT = 400 eV, EDIFF = 10{"\u207B\u2076"}</span><br /><br />
          {"  Iter 1:  E = -356.2841 eV   \u0394E = ----"}<br />
          {"  Iter 2:  E = -361.5023 eV   \u0394E = -5.218"}<br />
          {"  Iter 3:  E = -362.1187 eV   \u0394E = -0.616"}<br />
          {"  Iter 4:  E = -362.1842 eV   \u0394E = -0.066"}<br />
          {"  Iter 5:  E = -362.1899 eV   \u0394E = -0.006"}<br />
          {"  Iter 6:  E = -362.1903 eV   \u0394E = -4.1\u00D710\u207B\u2074"}<br />
          {"  Iter 7:  E = -362.1903 eV   \u0394E = -2.8\u00D710\u207B\u2075"}<br />
          {"  Iter 8:  E = -362.1903 eV   \u0394E = "}<span style={{ color: D.basis, fontWeight: 700 }}>{"-8.1\u00D710\u207B\u2077 \u2713 converged"}</span>
        </div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
          Energy drops rapidly in the first few iterations, then converges exponentially.
          8 iterations is typical for a well-behaved system.
        </div>
      </Card>
    </div>
  );
}

function DFTXCFunctionalsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Jacob's Ladder of XC Functionals" color={D.xc}>
        <DFT_ANALOGY_BOX text={"In a beryllium atom (4 electrons), we know the kinetic energy, the nuclear attraction, and the classical electron-electron repulsion exactly. What's left? Two quantum effects bundled into E_xc: (1) Exchange \u2014 two same-spin electrons carve out an 'exchange hole' around each other (Pauli exclusion), lowering their repulsion. (2) Correlation \u2014 opposite-spin electrons also avoid each other dynamically, but this is harder to capture. LDA approximates E_xc using a uniform electron gas. GGA adds how fast n(r) varies. HSE06 computes 25% of exchange exactly from the orbitals."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Each rung adds more information about the density, improving accuracy but increasing cost.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { rung: "5", name: "Double Hybrid", example: "B2PLYP", input: "n, \u2207n, \u03C4, \u03C8_occ, \u03C8_virt", cost: "1000x", color: D.warn },
            { rung: "4", name: "Hybrid", example: "HSE06, PBE0", input: "n, \u2207n, + exact exchange", cost: "10-100x", color: D.xc },
            { rung: "3", name: "meta-GGA", example: "SCAN, r2SCAN", input: "n, \u2207n, \u03C4 (KE density)", cost: "2-3x", color: D.accent },
            { rung: "2", name: "GGA", example: "PBE, PBEsol", input: "n(r) + \u2207n(r)", cost: "1x (baseline)", color: D.basis },
            { rung: "1", name: "LDA", example: "VWN, PZ", input: "n(r) only", cost: "1x", color: D.warm },
          ].map(item => (
            <div key={item.rung} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: item.color + "08", borderRadius: 10, padding: "10px 14px",
              border: `1.5px solid ${item.color}25`,
            }}>
              <div style={{
                minWidth: 30, height: 30, borderRadius: "50%",
                background: item.color + "18", border: `2px solid ${item.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: item.color,
              }}>{item.rung}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.name} <span style={{ fontWeight: 400, color: T.muted }}>({item.example})</span></div>
                <div style={{ fontSize: 11, color: T.muted }}>Uses: {item.input}</div>
              </div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: item.color, fontWeight: 700 }}>{item.cost}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Band Gap Comparison" color={D.warm}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${D.warm}30` }}>
              {["Material", "LDA", "PBE", "SCAN", "HSE06", "Experiment"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "center", fontSize: 11, color: D.warm, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Si", "0.52", "0.61", "0.89", "1.14", "1.17"],
              ["CuInSe\u2082", "0.00", "0.01", "0.58", "1.04", "1.04"],
              ["CdTe", "0.50", "0.63", "1.05", "1.52", "1.48"],
              ["ZnO", "0.73", "0.81", "1.84", "2.49", "3.37"],
              ["GaAs", "0.30", "0.47", "0.92", "1.32", "1.42"],
            ].map((row, i) => (
              <tr key={row[0]} style={{ background: i % 2 === 0 ? D.warm + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                {row.map((val, j) => (
                  <td key={j} style={{
                    padding: "8px 10px", textAlign: "center", fontFamily: "monospace",
                    fontWeight: j === 0 || j === 5 ? 700 : 400,
                    color: j === 0 ? T.ink : j === 5 ? D.basis : j <= 2 ? D.warn : j === 3 ? D.accent : D.xc,
                  }}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>
          All values in eV. LDA/PBE severely underestimate band gaps. HSE06 matches experiment well for most semiconductors.
        </div>
      </Card>
    </div>
  );
}

function DFTGGASection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="GGA - Generalized Gradient Approximation" color={D.basis}>
        <DFT_ANALOGY_BOX text={"In an oxygen molecule O\u2082, the electron density changes dramatically \u2014 high near nuclei, dropping off into the bonding region, then vanishing in vacuum. LDA pretends each point is a uniform electron gas with that local density, ignoring these steep changes. PBE (GGA) says: 'wait, the density at this point is also rapidly increasing toward the nucleus \u2014 I should adjust E_xc for that gradient.' This gradient correction makes PBE much better for bond lengths, atomization energies, and surface properties."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          LDA uses only n(r) at each point. GGA adds the <strong style={{ color: D.basis }}>gradient {"\u2207"}n(r)</strong>,
          capturing how rapidly the density changes. PBE (Perdew-Burke-Ernzerhof, 1996) is by far
          the most widely used GGA.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.basis, fontWeight: 700 }}>E_xc[n] = {"\u222B"} n(r) {"\u03B5"}_xc(n, {"\u2207"}n) dr</span><br /><br />
          <span style={{ color: T.muted }}>LDA: {"\u03B5"}_xc depends only on n(r)</span><br />
          <span style={{ color: D.basis }}>GGA: {"\u03B5"}_xc depends on n(r) AND |{"\u2207"}n(r)|</span><br /><br />
          <span style={{ color: T.muted }}>The gradient captures inhomogeneity - real materials are not uniform electron gas!</span>
        </div>
      </Card>

      <Card title="PBE - What It Gets Right" color={D.basis}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { prop: "Lattice constants", accuracy: "\u00B11%", verdict: "Excellent", color: D.basis },
            { prop: "Bulk moduli", accuracy: "\u00B15-10%", verdict: "Good", color: D.basis },
            { prop: "Formation energies", accuracy: "\u00B10.1 eV/atom", verdict: "Good", color: D.accent },
            { prop: "Band gaps", accuracy: "30-50% too low", verdict: "Poor", color: D.warn },
            { prop: "Reaction barriers", accuracy: "Underestimated", verdict: "Poor", color: D.warn },
            { prop: "van der Waals", accuracy: "Missing entirely", verdict: "Fails", color: D.warn },
          ].map(item => (
            <div key={item.prop} style={{
              background: item.color + "08", border: `1px solid ${item.color}20`,
              borderRadius: 10, padding: "10px 14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.prop}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{item.accuracy}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.verdict}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Numerical Example - CdTe Lattice Constant" color={D.accent}>
        <div style={mathBlock}>
          <span style={{ color: D.accent, fontWeight: 700 }}>CdTe zinc-blende, PBE-PAW, ENCUT=400 eV, 8x8x8 k-mesh</span><br /><br />
          {"  PBE:        a = 6.62 \u00C5  (overestimates by +2.1%)"}<br />
          {"  PBEsol:     a = 6.49 \u00C5  (closer, +0.2%)"}<br />
          {"  Experiment: a = "}<span style={{ color: D.basis, fontWeight: 700 }}>{"6.48 \u00C5"}</span><br /><br />
          <span style={{ color: T.muted }}>PBE overestimates lattice constants slightly. PBEsol (revised for solids) is better for structures.</span>
        </div>
      </Card>
    </div>
  );
}

function DFTHSESection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="HSE06 - Heyd-Scuseria-Ernzerhof Hybrid" color={D.xc}>
        <DFT_ANALOGY_BOX text={"Consider silicon: PBE predicts a band gap of 0.6 eV, but experiment shows 1.12 eV. Why? PBE's approximate exchange lets each electron partially repel itself (self-interaction error), spreading orbitals too far and shrinking gaps. HSE06 replaces 25% of PBE exchange with exact Hartree-Fock exchange at short range (within ~5 \u00C5). This removes most self-interaction locally, giving Si a gap of 1.14 eV \u2014 nearly perfect. The trade-off: HSE06 costs 10-100\u00D7 more than PBE."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          The key idea: mix <strong style={{ color: D.xc }}>25% exact (Hartree-Fock) exchange</strong> with
          75% PBE exchange, but only at <strong>short range</strong>. Long-range exchange stays pure PBE.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.xc, fontWeight: 700, fontSize: 14 }}>E_xc = {"\u03B1"} E_x_HF,SR + (1-{"\u03B1"}) E_x_PBE,SR + E_x_PBE,LR + E_c_PBE</span><br /><br />
          {"\u03B1"} = 0.25  (mixing parameter - 25% exact exchange)<br />
          {"\u03C9"} = 0.2 {"\u00C5\u207B\u00B9"}  (range-separation parameter)<br /><br />
          <span style={{ color: D.xc }}>SR = short range (exact exchange here)</span><br />
          <span style={{ color: D.basis }}>LR = long range (PBE exchange here, cheaper)</span>
        </div>
      </Card>

      <Card title="Why HSE Fixes Band Gaps" color={D.eqn}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          PBE exchange has <strong style={{ color: D.warn }}>self-interaction error</strong> (SIE):
          an electron partially repels itself. This artificially raises occupied states
          and lowers unoccupied states, shrinking the gap. Exact exchange cancels SIE exactly.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.xc, fontWeight: 700 }}>CuInSe{"\u2082"} band gap:</span><br /><br />
          {"  PBE:    E_gap = 0.01 eV  (essentially zero - metallic!)"}<br />
          {"  HSE06:  E_gap = "}<span style={{ color: D.xc, fontWeight: 700 }}>{"1.04 eV"}</span><br />
          {"  Expt:   E_gap = "}<span style={{ color: D.basis, fontWeight: 700 }}>{"1.04 eV"}</span><br /><br />
          <span style={{ color: T.muted }}>HSE nails it. PBE predicts CuInSe{"\u2082"} is a metal (it is not!).</span>
        </div>
      </Card>

      <Card title="The Cost Problem" color={D.warn}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { func: "PBE", cost: "1x", time: "~2 hrs", atoms: "100-1000", color: D.basis },
            { func: "HSE06", cost: "10-100x", time: "~200 hrs", atoms: "10-100", color: D.xc },
            { func: "GW", cost: "1000x", time: "~2000 hrs", atoms: "2-20", color: D.warn },
          ].map(item => (
            <div key={item.func} style={{
              background: item.color + "08", border: `1px solid ${item.color}20`,
              borderRadius: 10, padding: "12px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.func}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{item.cost} cost</div>
              <div style={{ fontSize: 11, color: T.muted }}>{item.time} (64 atoms)</div>
              <div style={{ fontSize: 11, color: item.color, fontWeight: 600 }}>Max {item.atoms} atoms</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>
          Strategy: relax structures with PBE, then do a single HSE calculation for accurate band gaps.
          Never relax with HSE unless you have unlimited compute.
        </div>
      </Card>
    </div>
  );
}

function DFTDFTUSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="The Problem with d and f Electrons" color={D.warm}>
        <DFT_ANALOGY_BOX text={"In iron oxide (FeO), the Fe 3d electrons are tightly bound to each iron atom. PBE incorrectly delocalizes them across the crystal, predicting FeO is a metal when it's actually an insulator. DFT+U adds a Hubbard U penalty (~4-5 eV) that says: 'it costs extra energy to put two d-electrons on the same Fe atom.' This on-site repulsion forces d-electrons to localize properly on individual Fe atoms, correctly opening the insulating gap. U is typically fitted to experiment or computed from linear response."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Standard GGA fails for systems with <strong style={{ color: D.warm }}>localized d or f electrons</strong>:
          transition metal oxides, rare earths, and Mott insulators. GGA delocalizes these
          electrons too much because of self-interaction error.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.warm, fontWeight: 700 }}>GGA predicts:</span><br />
          {"  FeO  = metal     (experiment: insulator, gap ~2.4 eV)"}<br />
          {"  NiO  = metal     (experiment: insulator, gap ~4.0 eV)"}<br />
          {"  CoO  = metal     (experiment: insulator, gap ~2.5 eV)"}<br /><br />
          <span style={{ color: D.warn }}>GGA is catastrophically wrong for correlated systems!</span>
        </div>
      </Card>

      <Card title="DFT+U - Adding On-Site Repulsion" color={D.xc}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Add a Hubbard-like energy penalty for partially occupied d/f orbitals. This
          forces electrons to either fully occupy or fully vacate, localizing them correctly.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.xc, fontWeight: 700, fontSize: 14 }}>E_DFT+U = E_DFT + (U-J)/2 {"\u03A3"}_i n_i(1 - n_i)</span><br /><br />
          <span style={{ color: D.xc }}>U</span> = on-site Coulomb repulsion (2-8 eV typical)<br />
          <span style={{ color: D.accent }}>J</span> = exchange parameter (~0.5-1 eV, often set to 0)<br />
          <span style={{ color: D.warm }}>n_i</span> = occupation of orbital i (0 to 1)<br /><br />
          <span style={{ color: T.muted }}>When n_i = 0 or 1: penalty = 0 (fully empty/full)</span><br />
          <span style={{ color: T.muted }}>When n_i = 0.5: penalty = maximum (half-filled = delocalized)</span>
        </div>
      </Card>

      <Card title={"Numerical Example - Cu 3d in CuInSe\u2082"} color={D.accent}>
        <div style={mathBlock}>
          <span style={{ color: D.accent, fontWeight: 700 }}>Cu 3d states - effect of U:</span><br /><br />
          {"  U = 0 (pure PBE):"}<br />
          {"    Cu 3d band center:  -1.8 eV below VBM"}<br />
          {"    Band gap:           0.01 eV (wrong!)"}<br /><br />
          {"  U = 5 eV:"}<br />
          {"    Cu 3d band center:  "}<span style={{ color: D.accent, fontWeight: 700 }}>{"-3.2 eV below VBM"}</span><br />
          {"    Band gap:           "}<span style={{ color: D.accent, fontWeight: 700 }}>{"0.82 eV"}</span><br /><br />
          {"  U = 7 eV:"}<br />
          {"    Cu 3d band center:  -4.1 eV below VBM"}<br />
          {"    Band gap:           1.15 eV"}<br /><br />
          <span style={{ color: T.muted }}>U pushes d states down, opening the gap. But the right U is system-dependent.</span>
        </div>
      </Card>

      <Card title="How to Choose U" color={D.warn}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { method: "Linear response", desc: "Self-consistent: perturb occupation, measure response. Most rigorous but complex.", color: D.eqn },
            { method: "Fit to experiment", desc: "Choose U that reproduces known band gap or lattice constant. Common but less transferable.", color: D.warm },
            { method: "Fit to HSE", desc: "Choose U that matches HSE06 band structure. Good compromise: cheap DFT+U with HSE accuracy.", color: D.xc },
            { method: "ACBN0", desc: "Self-consistent U from first principles. Automated, no fitting. Becoming more popular.", color: D.basis },
          ].map(item => (
            <div key={item.method} style={{
              background: item.color + "06", borderRadius: 10, padding: "10px 14px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.method}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DFTSelfInteractionSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Self-Interaction Error (SIE)" color={D.warn}>
        <DFT_ANALOGY_BOX text={"Take a single hydrogen atom \u2014 one electron, one proton. The Hartree potential V_H computes the repulsion of the electron density with itself, giving a spurious +13.6 eV self-repulsion. In HF, the exact exchange cancels this perfectly: E_x = -E_self. But in DFT, the approximate E_xc only partially cancels it. The leftover self-interaction makes the electron cloud spread out too much, lowers ionization energies, and shrinks band gaps. This is why PBE gets H's energy slightly wrong and Si's gap very wrong."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          In exact DFT, a single electron{"'"}s Hartree repulsion is exactly cancelled by exchange.
          In approximate functionals (LDA, GGA), this cancellation is incomplete:
          <strong style={{ color: D.warn }}> the electron repels itself</strong>.
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.warn, fontWeight: 700 }}>Exact: E_H[n_i] + E_x[n_i] = 0  (for one electron)</span><br /><br />
          <span style={{ color: D.warn }}>LDA/GGA: E_H[n_i] + E_x[n_i] {"\u2260"} 0  (incomplete cancellation!)</span><br /><br />
          <span style={{ color: T.muted }}>This residual = self-interaction error</span>
        </div>
      </Card>

      <Card title="Consequences of SIE" color={D.warm}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { effect: "Band gaps too small", detail: "Occupied states pushed up, unoccupied pushed down. Si gap: PBE 0.61 vs expt 1.17 eV.", color: D.warn },
            { effect: "d/f electrons delocalized", detail: "SIE favors spreading charge out. Transition metal oxides predicted as metals.", color: D.warm },
            { effect: "Wrong charge localization", detail: "Polarons (localized charges) won't form in PBE. Need hybrid or DFT+U.", color: D.xc },
            { effect: "Reaction barriers too low", detail: "Transition states have stretched bonds with partial occupations - SIE is largest here.", color: D.accent },
            { effect: "Wrong dissociation limits", detail: "H\u2082\u207A dissociates to H\u2070\u00B7\u2075 + H\u2070\u00B7\u2075 instead of H + H\u207A.", color: D.eqn },
          ].map(item => (
            <div key={item.effect} style={{
              background: item.color + "06", borderRadius: 10, padding: "10px 14px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.effect}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Fixes for SIE" color={D.basis}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${D.basis}30` }}>
              {["Method", "How it fixes SIE", "Cost"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: D.basis, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["HSE06", "25% exact exchange cancels 25% of SIE exactly", "10-100x"],
              ["DFT+U", "Penalty on partial occupation forces localization", "~1x"],
              ["SIC (Perdew-Zunger)", "Subtract SIE orbital-by-orbital", "3-10x"],
              ["GW approximation", "Many-body perturbation theory, no SIE", "1000x"],
            ].map(([method, fix, cost], i) => (
              <tr key={method} style={{ background: i % 2 === 0 ? D.basis + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: T.ink, fontFamily: "monospace" }}>{method}</td>
                <td style={{ padding: "8px 10px", color: T.muted }}>{fix}</td>
                <td style={{ padding: "8px 10px", fontFamily: "monospace", color: D.warm, fontWeight: 600 }}>{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function DFTPlaneWavesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Plane Waves & Bloch's Theorem" color={D.eqn}>
        <DFT_ANALOGY_BOX text={"In a silicon crystal, the electron density is periodic \u2014 it repeats every unit cell. Any periodic function can be expanded in plane waves e^(iG\u00B7r), just like any repeating sound wave is a sum of pure frequencies (Fourier series). ENCUT controls the highest frequency: 400 eV captures the smooth valence density well, but near Si nuclei the 1s electrons oscillate wildly and would need ENCUT > 10,000 eV. PAW solves this by analytically reconstructing the sharp nuclear wiggles from smooth pseudo-wavefunctions \u2014 giving all-electron accuracy at pseudopotential cost."} />
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          For periodic crystals, <strong style={{ color: D.eqn }}>Bloch{"'"}s theorem</strong> says every
          electron orbital can be written as a plane wave times a periodic function:
        </div>
        <div style={mathBlock}>
          <span style={{ color: D.eqn, fontWeight: 700 }}>{"\u03C8"}_nk(r) = e{"\u2071\u1D4F\u00B7\u02B3"} u_nk(r)</span><br /><br />
          <span style={{ color: T.muted }}>u_nk(r) is periodic - expand in plane waves:</span><br />
          {"  u_nk(r) = \u03A3_G  c_nk(G) e\u2071\u1D33\u00B7\u02B3"}<br /><br />
          <span style={{ color: D.eqn }}>Truncate at |k+G|{"\u00B2"}/2 {"<"} E_cut (ENCUT in VASP)</span><br />
          <span style={{ color: T.muted }}>Larger ENCUT = more plane waves = more accurate = more expensive</span>
        </div>
      </Card>

      <Card title="ENCUT Convergence Test" color={D.accent}>
        <div style={mathBlock}>
          <span style={{ color: D.accent, fontWeight: 700 }}>CuInSe{"\u2082"}, 16-atom cell, PBE, 4x4x4 k-mesh</span><br /><br />
          {"  ENCUT = 200 eV:  E = -89.432 eV  (not converged)"}<br />
          {"  ENCUT = 250 eV:  E = -90.118 eV  (\u0394 = -0.686)"}<br />
          {"  ENCUT = 300 eV:  E = -90.341 eV  (\u0394 = -0.223)"}<br />
          {"  ENCUT = 350 eV:  E = -90.387 eV  (\u0394 = -0.046)"}<br />
          {"  ENCUT = 400 eV:  E = -90.395 eV  (\u0394 = -0.008)"}<br />
          {"  ENCUT = 450 eV:  E = -90.397 eV  (\u0394 = "}<span style={{ color: D.basis, fontWeight: 700 }}>{"-0.002 \u2713"}</span>{")"}<br />
          {"  ENCUT = 500 eV:  E = -90.397 eV  (\u0394 = 0.000)"}<br /><br />
          <span style={{ color: D.basis }}>Use ENCUT = 400 eV (converged to {"<"} 1 meV/atom)</span>
        </div>
      </Card>

      <Card title="PAW - Projector Augmented Wave" color={D.basis}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Core electrons (1s, 2s, 2p of heavy atoms) oscillate rapidly near nuclei and need
          enormous ENCUT. <strong style={{ color: D.basis }}>PAW</strong> (Blochl, 1994) replaces the
          all-electron wave function near nuclei with a smooth pseudo-wave-function.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "All-electron", desc: "Full wave function, needs ENCUT > 10,000 eV. Impossible for solids.", color: D.warn },
            { label: "Pseudopotential", desc: "Replace core with smooth function. ~300-500 eV. Standard approach.", color: D.basis },
            { label: "PAW (VASP default)", desc: "Keeps all-electron info in augmentation region. Best of both worlds.", color: D.accent },
            { label: "POTCAR files", desc: "VASP stores PAW data per element. Always use recommended POTCARs.", color: D.warm },
          ].map(item => (
            <div key={item.label} style={{
              background: item.color + "08", border: `1px solid ${item.color}20`,
              borderRadius: 10, padding: "10px 14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DFTPracticeSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="VASP Input Files" color={D.main}>
        <DFT_ANALOGY_BOX text={"To relax a CdTe supercell in VASP: ENCUT = 350 eV sets how many plane waves describe each orbital (too low \u2192 missing details, too high \u2192 wasted compute). KPOINTS = 4\u00D74\u00D74 samples the Brillouin zone (too few \u2192 wrong band structure). EDIFF = 10\u207B\u2076 eV decides when SCF is converged. ISMEAR = 0 with SIGMA = 0.05 smears electron occupations for semiconductors. IBRION = 2 + EDIFFG = -0.01 relaxes ions until forces < 10 meV/\u00C5. Each setting has a 'safe' default \u2014 but convergence testing (increasing ENCUT, KPOINTS until energy stops changing) is mandatory."} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { file: "INCAR", desc: "Calculation parameters: ENCUT, EDIFF, ISMEAR, functional choice", color: D.main },
            { file: "POSCAR", desc: "Crystal structure: lattice vectors + atomic positions", color: D.basis },
            { file: "POTCAR", desc: "PAW pseudopotentials for each element (concatenated)", color: D.xc },
            { file: "KPOINTS", desc: "k-point mesh for Brillouin zone sampling", color: D.warm },
          ].map(item => (
            <div key={item.file} style={{
              display: "flex", gap: 12, alignItems: "center",
              background: item.color + "06", borderRadius: 10, padding: "10px 14px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: item.color, minWidth: 80 }}>{item.file}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Strengths vs Limitations" color={D.warn}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: D.basis + "08", border: `1px solid ${D.basis}20`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: D.basis, marginBottom: 8 }}>Strengths</div>
            {["No empirical parameters (first-principles)", "Systematic improvability (better XC = better results)", "Predicts structures, energies, phonons, defects", "Scales to ~1000 atoms with PBE", "Huge community, validated codes (VASP, QE, GPAW)"].map(s => (
              <div key={s} style={{ fontSize: 11, color: T.ink, lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${D.basis}30`, marginBottom: 4 }}>{s}</div>
            ))}
          </div>
          <div style={{ background: D.warn + "08", border: `1px solid ${D.warn}20`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: D.warn, marginBottom: 8 }}>Limitations</div>
            {["Band gaps underestimated (PBE)", "van der Waals missing in standard DFT", "Strongly correlated systems need +U or hybrid", "O(N\u00B3) scaling limits system size", "Excited states need TDDFT or GW", "Temperature = 0 K (no thermal effects)"].map(s => (
              <div key={s} style={{ fontSize: 11, color: T.ink, lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${D.warn}30`, marginBottom: 4 }}>{s}</div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function DFTHHeExampleSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* HYDROGEN ATOM */}
      <Card title="Hydrogen Atom (Z=1, 1 electron) — Exact DFT" color="#6366f1">
        <DFT_ANALOGY_BOX text={"Hydrogen (1 electron): the Schr\u00F6dinger equation is exactly solvable \u2014 E\u2081 = -13.6 eV, orbital = (1/\u221A\u03C0)a\u2080^(-3/2) e^(-r/a\u2080). DFT must reproduce this exactly if E_xc is perfect. Helium (2 electrons): no exact solution exists, but very accurate benchmarks from variational methods give E = -2.9037 hartree. Comparing DFT approximations against these two atoms reveals exactly how much error each functional introduces \u2014 LDA overbinds He by ~40 mHa, PBE by ~20 mHa, exact exchange gets it right."} />
        <div style={{
          background: "#6366f1" + "0a", border: `1.5px solid #6366f130`,
          borderRadius: 10, padding: "14px 18px", marginBottom: 14,
          fontSize: 14, fontWeight: 600, color: "#6366f1", textAlign: "center", lineHeight: 1.6,
        }}>
          H is the only atom where DFT is exact {"\u2014"} because there{"'"}s only 1 electron!<br />
          No electron-electron interaction {"\u2192"} no exchange-correlation needed.
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          <strong style={{ color: "#6366f1" }}>Step 1: The exact Schr{"\u00F6"}dinger equation for H</strong>
        </div>
        <div style={mathBlock}>
          <EqRow>
            <Bracket color="#6366f1">
              <span style={{ color: "#6366f1", display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n={<>{"\u0127"}<Sup>2</Sup></>} d="2m" color="#6366f1" />
                {"\u2207"}<Sup>2</Sup>
              </span>
              <span style={{ color: "#059669", marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
                {"\u2212"} <Frac n={<>e<Sup>2</Sup></>} d="r" color="#059669" />
              </span>
            </Bracket>
            <span style={{ color: "#7c3aed", marginLeft: 4 }}>{"\u03C8"}(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: "#b45309", fontWeight: 700 }}>E</span>
            <span style={{ color: "#7c3aed", marginLeft: 4 }}>{"\u03C8"}(r)</span>
          </EqRow>
          <div style={{ color: T.muted, fontSize: 12, textAlign: "center" }}>Only 1 electron, so {"\u03A8"} = {"\u03C8"}(r) {"\u2014"} no many-body problem at all!</div>
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10, marginTop: 10 }}>
          <strong style={{ color: "#6366f1" }}>Step 2: Exact analytic solution (1s orbital)</strong>
        </div>
        <div style={mathBlock}>
          <EqRow>
            <span style={{ color: "#6366f1", fontWeight: 600 }}>{"\u03C8"}<Sub>1s</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <Frac n="1" d={<>{"\u221A"}{"\u03C0"}</>} color="#6366f1" />
            <span style={{ display: "inline-flex", alignItems: "center", color: "#6366f1" }}>
              <Frac n="1" d={<>a<Sub>0</Sub></>} color="#6366f1" />
              <Sup>3/2</Sup>
            </span>
            <span style={{ color: "#6366f1", marginLeft: 4 }}>e</span>
            <Sup><span style={{ color: "#6366f1" }}>{"\u2212"}r/a<Sub>0</Sub></span></Sup>
          </EqRow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            <EqRow style={{ fontSize: 14, color: T.muted }}>
              <span>a<Sub>0</Sub> = 0.529 {"\u00C5"} (Bohr radius) =</span>
              <Frac n={<>{"\u0127"}<Sup>2</Sup></>} d={<>me<Sup>2</Sup></>} color={T.muted} />
            </EqRow>
            <EqRow style={{ fontSize: 16 }}>
              <span style={{ color: "#b45309", fontWeight: 700 }}>E<Sub>1s</Sub></span>
              <span style={{ margin: "0 6px" }}>=</span>
              <span style={{ color: "#b45309", fontWeight: 700 }}>{"\u2212"}13.606 eV</span>
              <span style={{ margin: "0 6px" }}>=</span>
              <span style={{ color: T.muted }}>{"\u2212"}</span>
              <Frac n={<>me<Sup>4</Sup></>} d={<>2{"\u0127"}<Sup>2</Sup></>} color={T.muted} />
              <span style={{ color: T.muted, margin: "0 6px" }}>=</span>
              <span style={{ color: T.muted }}>{"\u2212"}1 Ry = {"\u2212"}0.5 Ha</span>
            </EqRow>
          </div>
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10, marginTop: 10 }}>
          <strong style={{ color: "#6366f1" }}>Step 3: DFT for H {"\u2014"} why it{"'"}s trivially exact</strong>
        </div>
        <div style={mathBlock}>
          <div style={{ fontWeight: 700, color: "#6366f1", marginBottom: 6, fontSize: 14 }}>Electron density:</div>
          <EqRow style={{ fontSize: 15 }}>
            <span>n(r) = |{"\u03C8"}<Sub>1s</Sub>(r)|<Sup>2</Sup></span>
            <span style={{ margin: "0 6px" }}>=</span>
            <Frac n="1" d={<>{"\u03C0"}a<Sub>0</Sub><Sup>3</Sup></>} color="#6366f1" />
            <span style={{ marginLeft: 4 }}>e</span>
            <Sup>{"\u2212"}2r/a<Sub>0</Sub></Sup>
          </EqRow>

          <div style={{ fontWeight: 700, color: "#6366f1", marginBottom: 6, marginTop: 14, fontSize: 14 }}>Kohn-Sham equation:</div>
          <EqRow>
            <Bracket color={D.eqn}>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n="1" d="2" color={D.eqn} />{"\u2207"}<Sup>2</Sup>
              </span>
              <span style={{ marginLeft: 6 }}>+ V<Sub>eff</Sub>(r)</span>
            </Bracket>
            <span style={{ marginLeft: 4 }}>{"\u03C8"}<Sub>KS</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span>{"\u03B5"} {"\u03C8"}<Sub>KS</Sub>(r)</span>
          </EqRow>

          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 8, marginTop: 14, fontSize: 14 }}>V<Sub>eff</Sub> breakdown:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.warm, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>ext</Sub>(r)</span>
              <span style={{ fontSize: 14, display: "inline-flex", alignItems: "center" }}>= {"\u2212"}<Frac n="1" d="r" color={D.warm} /></span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(nucleus attraction)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.basis, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>H</Sub>(r)</span>
              <span style={{ fontSize: 14, display: "inline-flex", alignItems: "center" }}>= {"\u222B"} <Frac n={<>n(r{"\u2032"})</>} d={<>|r {"\u2212"} r{"\u2032"}|</>} color={D.basis} /> dr{"\u2032"}</span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(self-repulsion)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.xc, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>xc</Sub>(r)</span>
              <span style={{ fontSize: 14, color: D.xc }}>= {"\u2212"}V<Sub>H</Sub>(r)</span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(exactly cancels V<Sub>H</Sub>!)</span>
            </div>
          </div>

          <div style={{ marginTop: 14, background: "#dc262608", borderRadius: 8, padding: "10px 14px", border: "1px solid #dc262615" }}>
            <div style={{ color: "#dc2626", fontWeight: 700, fontSize: 12 }}>Key insight: For 1 electron, V<Sub>xc</Sub> must exactly cancel the Hartree self-interaction.</div>
            <div style={{ color: "#dc2626", fontSize: 12, marginTop: 2 }}>An electron cannot repel itself! This is the self-interaction error test.</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 2 }}>Energy decomposition (atomic units):</div>
          {[
            { term: "T[n]", val: "+0.5000 Ha", desc: "Kinetic energy = \u27E8\u03C8|\u2212\u00BD\u2207\u00B2|\u03C8\u27E9", color: "#6366f1" },
            { term: "V_ext[n]", val: "\u22121.0000 Ha", desc: "Electron-nucleus: \u222B n(r)(\u22121/r) dr", color: D.warm },
            { term: "V_H[n]", val: "+0.3125 Ha", desc: "Hartree: \u00BD \u222B\u222B n(r)n(r\u2032)/|r\u2212r\u2032| drdr\u2032 = 5/16 Ha", color: D.basis },
            { term: "E_xc[n]", val: "\u22120.3125 Ha", desc: "Exact xc: must cancel V_H for 1 electron", color: D.xc },
            { term: "E_total", val: "\u22120.5000 Ha = \u221213.606 eV", desc: "Exact ground state energy!", color: "#b45309" },
          ].map(item => (
            <div key={item.term} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: item.color + "08", borderRadius: 8, padding: "8px 12px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: item.color, minWidth: 70 }}>{item.term}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.ink, minWidth: 110 }}>{item.val}</div>
              <div style={{ fontSize: 10, color: T.muted, flex: 1 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 14, background: "#059669" + "0a", border: `1.5px solid #05966920`,
          borderRadius: 10, padding: "12px 16px", fontSize: 12, lineHeight: 1.7, color: T.ink,
        }}>
          <strong style={{ color: "#059669" }}>Result:</strong> DFT with the <em>exact</em> E<sub>xc</sub> gives
          E = {"\u2212"}13.606 eV {"\u2014"} <strong>exactly matches</strong> the analytic Schr{"\u00F6"}dinger solution.
          Any approximate functional (LDA, PBE) will have a small self-interaction error for H.
        </div>
      </Card>

      {/* HELIUM ATOM */}
      <Card title="Helium Atom (Z=2, 2 electrons) — The Simplest Many-Body Problem" color="#059669">
        <div style={{
          background: "#059669" + "0a", border: `1.5px solid #05966930`,
          borderRadius: 10, padding: "14px 18px", marginBottom: 14,
          fontSize: 14, fontWeight: 600, color: "#059669", textAlign: "center", lineHeight: 1.6,
        }}>
          He is the simplest atom where DFT is NOT trivially exact.<br />
          2 electrons {"\u2192"} electron-electron repulsion {"\u2192"} correlation matters!
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          <strong style={{ color: "#059669" }}>Step 1: Exact Schr{"\u00F6"}dinger equation for He</strong>
        </div>
        <div style={mathBlock}>
          <EqRow>
            <Bracket color="#059669">
              <span style={{ color: "#6366f1", display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n="1" d="2" color="#6366f1" />{"\u2207"}<Sub>1</Sub><Sup>2</Sup>
                {" "}{"\u2212"} <Frac n="1" d="2" color="#6366f1" />{"\u2207"}<Sub>2</Sub><Sup>2</Sup>
              </span>
              <span style={{ color: D.warm, marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
                {"\u2212"} <Frac n="2" d={<>r<Sub>1</Sub></>} color={D.warm} />
                {" "}{"\u2212"} <Frac n="2" d={<>r<Sub>2</Sub></>} color={D.warm} />
              </span>
              <span style={{ color: "#dc2626", marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
                + <Frac n="1" d={<>|r<Sub>1</Sub> {"\u2212"} r<Sub>2</Sub>|</>} color="#dc2626" />
              </span>
            </Bracket>
            <span style={{ color: "#7c3aed", marginLeft: 4 }}>{"\u03A8"}(r<Sub>1</Sub>,r<Sub>2</Sub>)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: "#b45309", fontWeight: 700 }}>E</span>
            <span style={{ color: "#7c3aed", marginLeft: 4 }}>{"\u03A8"}</span>
          </EqRow>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#6366f1", fontWeight: 700, minWidth: 14 }}>{"\u2022"}</span>
              <span style={{ color: "#6366f1" }}>{"\u2212"}<Frac n="1" d="2" color="#6366f1" size={13} />{"\u2207"}<Sub>1</Sub><Sup>2</Sup> {"\u2212"} <Frac n="1" d="2" color="#6366f1" size={13} />{"\u2207"}<Sub>2</Sub><Sup>2</Sup></span>
              <span style={{ color: T.ink, marginLeft: 6 }}>kinetic energy of 2 electrons</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: D.warm, fontWeight: 700, minWidth: 14 }}>{"\u2022"}</span>
              <span style={{ color: D.warm }}>{"\u2212"}<Frac n="2" d={<>r<Sub>1</Sub></>} color={D.warm} size={13} /> {"\u2212"} <Frac n="2" d={<>r<Sub>2</Sub></>} color={D.warm} size={13} /></span>
              <span style={{ color: T.ink, marginLeft: 6 }}>nucleus (Z=2) attracts both electrons</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <span style={{ color: "#dc2626", fontWeight: 700, minWidth: 14 }}>{"\u2022"}</span>
              <span style={{ color: "#dc2626" }}>+<Frac n="1" d={<>|r<Sub>1</Sub> {"\u2212"} r<Sub>2</Sub>|</>} color="#dc2626" size={13} /></span>
              <span style={{ color: T.ink, marginLeft: 6 }}>electron-electron repulsion (the hard part!)</span>
            </div>
          </div>
          <div style={{ color: T.muted, fontSize: 12, textAlign: "center", marginTop: 10 }}>This is a 6-dimensional equation {"\u2014"} cannot be solved analytically in closed form!</div>
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10, marginTop: 10 }}>
          <strong style={{ color: "#059669" }}>Step 2: Approximate solutions (historical progression)</strong>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { method: "No e-e repulsion", approx: "\u03A8 = \u03C8\u2081(r\u2081)\u03C8\u2082(r\u2082), ignore 1/|r\u2081\u2212r\u2082|", E: "\u2212108.8 eV", err: "38%", color: T.muted,
              detail: "Each electron sees only Z=2 nucleus. \u03C8 = (Z\u00B3/\u03C0)\u00BD e^(\u2212Zr/a\u2080). E = \u22122Z\u00B2 \u00D7 13.6 eV" },
            { method: "Variational (Z_eff)", approx: "\u03A8 same form, optimize Z_eff", E: "\u221277.5 eV", err: "1.9%", color: "#b45309",
              detail: "Replace Z=2 with Z_eff=27/16=1.6875. Electron screening! E = \u22122(Z_eff)\u00B2 \u00D7 13.6 eV" },
            { method: "Hartree-Fock", approx: "\u03A8 = det[\u03C8\u2081\u03C8\u2082], optimized orbitals", E: "\u221277.87 eV", err: "1.5%", color: "#7c3aed",
              detail: "Self-consistent field with exchange. Missing correlation energy = \u22121.14 eV" },
            { method: "DFT (LDA)", approx: "n(r) = 2|\u03C8_KS(r)|\u00B2, local xc", E: "\u221277.36 eV", err: "2.2%", color: D.xc,
              detail: "Homogeneous electron gas xc. Overbinds slightly due to self-interaction error" },
            { method: "DFT (PBE/GGA)", approx: "n(r) + \u2207n(r) gradient correction", E: "\u221279.02 eV", err: "0.5%", color: D.main,
              detail: "Gradient correction improves on LDA. Close to exact but still has SIE" },
            { method: "Exact (Hylleraas)", approx: "\u03A8(r\u2081,r\u2082,r\u2081\u2082) with 1000s of terms", E: "\u221279.015 eV", err: "0%", color: "#059669",
              detail: "Variational with interelectronic coordinate r\u2081\u2082 = |r\u2081\u2212r\u2082|. Converged to \u03BCeV accuracy" },
          ].map(item => (
            <div key={item.method} style={{
              background: item.color + "08", borderRadius: 10, padding: "10px 14px",
              border: `1px solid ${item.color}18`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: item.color, minWidth: 130 }}>{item.method}</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: T.ink, minWidth: 90 }}>{item.E}</div>
                <div style={{ fontSize: 11, color: item.err === "0%" ? "#059669" : D.warn, fontWeight: 700 }}>err: {item.err}</div>
              </div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.detail}</div>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: item.color, marginTop: 2 }}>{item.approx}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10, marginTop: 14 }}>
          <strong style={{ color: "#059669" }}>Step 3: DFT (PBE) for He {"\u2014"} step by step</strong>
        </div>
        <div style={mathBlock}>
          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 8, fontSize: 14 }}>Kohn-Sham equation for He:</div>
          <EqRow>
            <Bracket color={D.eqn}>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n="1" d="2" color={D.eqn} />{"\u2207"}<Sup>2</Sup>
              </span>
              <span style={{ marginLeft: 6 }}>+ V<Sub>eff</Sub>(r)</span>
            </Bracket>
            <span style={{ marginLeft: 4 }}>{"\u03C8"}<Sub>KS</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span>{"\u03B5"} {"\u03C8"}<Sub>KS</Sub>(r)</span>
          </EqRow>
          <div style={{ color: T.muted, fontSize: 12, textAlign: "center", marginTop: 4 }}>Both electrons occupy the SAME orbital {"\u03C8"}<Sub>KS</Sub>(r) (with opposite spins {"\u2191\u2193"})</div>

          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 6, marginTop: 14, fontSize: 14 }}>Density:</div>
          <EqRow style={{ fontSize: 16 }}>
            <span>n(r) = 2|{"\u03C8"}<Sub>KS</Sub>(r)|<Sup>2</Sup></span>
            <span style={{ color: T.muted, fontSize: 13, marginLeft: 10 }}>(factor 2 for spin)</span>
          </EqRow>

          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 8, marginTop: 14, fontSize: 14 }}>V<Sub>eff</Sub> components:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.warm, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>ext</Sub>(r)</span>
              <span style={{ fontSize: 14, display: "inline-flex", alignItems: "center" }}>= {"\u2212"}<Frac n="2" d="r" color={D.warm} /></span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(Z=2 nucleus)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.basis, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>H</Sub>(r)</span>
              <span style={{ fontSize: 14, display: "inline-flex", alignItems: "center" }}>= {"\u222B"} <Frac n={<>n(r{"\u2032"})</>} d={<>|r {"\u2212"} r{"\u2032"}|</>} color={D.basis} /> dr{"\u2032"}</span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(both electrons repel)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: D.xc, fontWeight: 700, fontFamily: "serif", fontSize: 15, minWidth: 65 }}>V<Sub>xc</Sub>(r)</span>
              <span style={{ fontSize: 14, display: "inline-flex", alignItems: "center" }}>= <Frac n={<>{"\u03B4"}E<Sub>xc</Sub>[n]</>} d={<>{"\u03B4"}n(r)</>} color={D.xc} /></span>
              <span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>(exchange + correlation)</span>
            </div>
          </div>

          <div style={{ marginTop: 14, background: "#dc262608", borderRadius: 8, padding: "10px 14px", border: "1px solid #dc262615" }}>
            <div style={{ color: "#dc2626", fontWeight: 700, fontSize: 12 }}>Unlike H: V<Sub>xc</Sub> {"\u2260"} {"\u2212"}V<Sub>H</Sub> because there are 2 electrons.</div>
            <div style={{ color: "#dc2626", fontSize: 12, marginTop: 2 }}>V<Sub>xc</Sub> contains exchange (same-spin Pauli) + correlation (opposite-spin avoidance).</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 2 }}>He energy decomposition (PBE functional):</div>
          {[
            { term: "T_s[n]", val: "+2.8343 Ha", desc: "KS kinetic energy of non-interacting electrons", color: "#6366f1" },
            { term: "V_ext[n]", val: "\u22126.7372 Ha", desc: "Nucleus (Z=2) attraction: \u222B n(r)(\u22122/r) dr", color: D.warm },
            { term: "E_H[n]", val: "+2.0490 Ha", desc: "Hartree: \u00BD\u222B\u222B n(r)n(r\u2032)/|r\u2212r\u2032| drdr\u2032", color: D.basis },
            { term: "E_x[n]", val: "\u22121.0174 Ha", desc: "Exchange: Pauli exclusion (same-spin avoidance)", color: "#7c3aed" },
            { term: "E_c[n]", val: "\u22120.0420 Ha", desc: "Correlation: opposite-spin dynamic avoidance", color: D.xc },
            { term: "E_total", val: "\u22122.9133 Ha = \u221279.02 eV", desc: "PBE result (exact: \u22122.9037 Ha = \u221279.015 eV)", color: "#059669" },
          ].map(item => (
            <div key={item.term} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: item.color + "08", borderRadius: 8, padding: "8px 12px",
              border: `1px solid ${item.color}15`,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: item.color, minWidth: 70 }}>{item.term}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.ink, minWidth: 110 }}>{item.val}</div>
              <div style={{ fontSize: 10, color: T.muted, flex: 1 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* H vs He Comparison */}
      <Card title="H vs He — What DFT Teaches Us" color={D.main}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{
            background: "#6366f1" + "06", borderRadius: 12, padding: "14px",
            border: `1.5px solid #6366f120`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#6366f1", marginBottom: 8, textAlign: "center" }}>H (1 electron)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
              <div>{"\u2022"} Exact Schr{"\u00F6"}dinger solution exists</div>
              <div>{"\u2022"} {"\u03A8"}(r) = single orbital, 3 variables</div>
              <div>{"\u2022"} No e{"\u207B"}-e{"\u207B"} interaction at all</div>
              <div>{"\u2022"} E<sub>xc</sub> must cancel self-interaction exactly</div>
              <div>{"\u2022"} DFT with exact E<sub>xc</sub> is exact</div>
              <div>{"\u2022"} <strong>E = {"\u2212"}13.606 eV</strong></div>
            </div>
          </div>
          <div style={{
            background: "#059669" + "06", borderRadius: 12, padding: "14px",
            border: `1.5px solid #05966920`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#059669", marginBottom: 8, textAlign: "center" }}>He (2 electrons)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
              <div>{"\u2022"} No closed-form solution</div>
              <div>{"\u2022"} {"\u03A8"}(r<sub>1</sub>,r<sub>2</sub>) = 6 variables, coupled</div>
              <div>{"\u2022"} e{"\u207B"}-e{"\u207B"} repulsion (+1.14 eV correlation)</div>
              <div>{"\u2022"} E<sub>xc</sub> handles exchange + correlation</div>
              <div>{"\u2022"} DFT (PBE) error {"\u2248"} 0.5%</div>
              <div>{"\u2022"} <strong>E = {"\u2212"}79.015 eV</strong></div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14, background: D.main + "0a", border: `1.5px solid ${D.main}25`,
          borderRadius: 10, padding: "12px 16px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: D.main, marginBottom: 6 }}>Key lessons from H and He:</div>
          <div style={{ fontSize: 11, lineHeight: 1.8, color: T.ink }}>
            <strong>1.</strong> H proves DFT is exact in principle {"\u2014"} the theory is correct.<br />
            <strong>2.</strong> He shows that approximating E<sub>xc</sub> introduces errors {"\u2014"} but small ones ({"\u2248"}0.5% with PBE).<br />
            <strong>3.</strong> The correlation energy ({"\u22121.14 eV"} for He) is tiny but chemically important.<br />
            <strong>4.</strong> As atoms get bigger (Li, Na, Fe...), DFT{"'"}s O(N{"\u00B3"}) scaling makes it the only practical method.<br />
            <strong>5.</strong> Self-interaction error (H test) and correlation accuracy (He test) are the two benchmarks for every new functional.
          </div>
        </div>
      </Card>
    </div>
  );
}

function DFTNaExampleSection() {
  const [scfStep, setScfStep] = useState(0);
  const scfData = [
    { iter: 0, label: "Initial Guess", E: -160.500, dE: "\u2014", conv: false,
      desc: "Start with superposition of atomic densities. Electrons are uniformly spread.",
      n_desc: "n\u2080(r) = \u03A3 n_atom(r) \u2014 overlapping free-atom densities",
      shell: { core: 0.4, valence: 0.15 },
    },
    { iter: 1, label: "SCF Iteration 1", E: -161.823, dE: "-1.323", conv: false,
      desc: "Build V_eff from initial density. Solve KS equations. Density changes dramatically.",
      n_desc: "Electrons redistribute: core tightens, valence expands",
      shell: { core: 0.55, valence: 0.22 },
    },
    { iter: 2, label: "SCF Iteration 2", E: -162.089, dE: "-0.266", conv: false,
      desc: "New density \u2192 new potential. Energy dropping fast. Density mixing helps convergence.",
      n_desc: "n_new = 0.3\u00D7n_out + 0.7\u00D7n_old (linear mixing)",
      shell: { core: 0.65, valence: 0.28 },
    },
    { iter: 3, label: "SCF Iteration 3", E: -162.134, dE: "-0.045", conv: false,
      desc: "Changes getting smaller. Core electrons already converged. Valence still adjusting.",
      n_desc: "Core: converged | Valence 3s: still shifting",
      shell: { core: 0.72, valence: 0.32 },
    },
    { iter: 4, label: "SCF Iteration 4", E: -162.141, dE: "-0.007", conv: false,
      desc: "Almost there. Energy change < 0.01 eV. Density barely changing between iterations.",
      n_desc: "\u0394n = |n_out \u2212 n_in| dropping below threshold",
      shell: { core: 0.75, valence: 0.34 },
    },
    { iter: 5, label: "SCF Converged!", E: -162.142, dE: "-0.001", conv: true,
      desc: "Self-consistent! Input density = output density. Total energy converged to < 10\u207B\u2076 eV.",
      n_desc: "n_in(r) = n_out(r) \u2714 \u2014 self-consistency achieved!",
      shell: { core: 0.78, valence: 0.35 },
    },
  ];
  const step = scfData[scfStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Na Atom Overview */}
      <Card title={"Sodium Atom \u2014 DFT Step by Step"} color={D.main}>
        <DFT_ANALOGY_BOX text={"Sodium (Na, 11 electrons): Start with a guess density from superposed atomic orbitals. Iteration 1 builds V_eff, solves 11 KS equations, gets new orbitals 1s\u00B2 2s\u00B2 2p\u2076 3s\u00B9. The new density differs from the guess, so mix old and new (Pulay mixing) and repeat. By iteration 5-8, the energy changes by less than 10\u207B\u2076 eV between steps \u2014 self-consistency is reached. The final 3s eigenvalue (-5.14 eV with PBE) closely matches Na's ionization energy (5.14 eV experimental)."} />
        <div style={{
          background: D.main + "0a", border: `1.5px solid ${D.main}30`,
          borderRadius: 10, padding: "14px 18px", marginBottom: 14,
          fontSize: 14, fontWeight: 600, color: D.main, textAlign: "center", lineHeight: 1.6,
        }}>
          Watch DFT solve a real atom: Na (Z = 11, 11 electrons).<br />
          From electron cloud to self-consistent ground state.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Atom visualization */}
          <div style={{
            background: T.surface, borderRadius: 14, padding: "20px",
            border: `1px solid ${T.border}`, textAlign: "center",
            position: "relative", overflow: "hidden", minHeight: 220,
          }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 12, letterSpacing: 2, textTransform: "uppercase" }}>Na Atom: Electron Shells</div>

            <div style={{
              position: "relative", width: 180, height: 180, margin: "0 auto",
            }}>
              {/* 3s valence shell */}
              <div style={{
                position: "absolute", top: 0, left: 0, width: 180, height: 180,
                borderRadius: "50%",
                border: `2px dashed ${D.xc}60`,
                background: `radial-gradient(circle, transparent 60%, ${D.xc}08 100%)`,
              }} />
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: D.xc, fontWeight: 700 }}>3s{"\u00B9"} (valence)</div>

              {/* 2s2p shell */}
              <div style={{
                position: "absolute", top: 30, left: 30, width: 120, height: 120,
                borderRadius: "50%",
                border: `2px solid ${D.basis}50`,
                background: `radial-gradient(circle, transparent 50%, ${D.basis}10 100%)`,
              }} />
              <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: D.basis, fontWeight: 700 }}>2s{"\u00B2"}2p{"\u2076"}</div>

              {/* 1s core */}
              <div style={{
                position: "absolute", top: 60, left: 60, width: 60, height: 60,
                borderRadius: "50%",
                border: `2px solid ${D.warm}`,
                background: `radial-gradient(circle, ${D.warm}30 0%, ${D.warm}10 100%)`,
              }} />
              <div style={{ position: "absolute", top: 55, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: D.warm, fontWeight: 700 }}>1s{"\u00B2"}</div>

              {/* Nucleus dot */}
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 16, height: 16, borderRadius: "50%",
                background: D.main, boxShadow: `0 0 8px ${D.main}80`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, color: "#fff", fontWeight: 900,
              }}>Na</div>

              {/* Electron dots */}
              {[0, 180].map((angle, i) => (
                <div key={`1s${i}`} style={{
                  position: "absolute",
                  top: 90 + 22 * Math.sin(angle * Math.PI / 180) - 3,
                  left: 90 + 22 * Math.cos(angle * Math.PI / 180) - 3,
                  width: 6, height: 6, borderRadius: "50%", background: D.warm,
                }} />
              ))}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div key={`2sp${i}`} style={{
                  position: "absolute",
                  top: 90 + 45 * Math.sin(angle * Math.PI / 180) - 3,
                  left: 90 + 45 * Math.cos(angle * Math.PI / 180) - 3,
                  width: 6, height: 6, borderRadius: "50%", background: D.basis,
                }} />
              ))}
              <div style={{
                position: "absolute",
                top: 90 + 75 * Math.sin(30 * Math.PI / 180) - 4,
                left: 90 + 75 * Math.cos(30 * Math.PI / 180) - 4,
                width: 8, height: 8, borderRadius: "50%", background: D.xc,
                boxShadow: `0 0 6px ${D.xc}80`,
              }} />
            </div>
          </div>

          {/* Electron config */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Na: 1s{"\u00B2"} 2s{"\u00B2"} 2p{"\u2076"} 3s{"\u00B9"}</div>
            {[
              { shell: "1s\u00B2", e: 2, type: "Core", color: D.warm, energy: "-1041.3 eV" },
              { shell: "2s\u00B2", e: 2, type: "Core", color: D.basis, energy: "-63.4 eV" },
              { shell: "2p\u2076", e: 6, type: "Core", color: D.basis, energy: "-30.7 eV" },
              { shell: "3s\u00B9", e: 1, type: "Valence", color: D.xc, energy: "-5.14 eV" },
            ].map(s => (
              <div key={s.shell} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: s.color + "08", borderRadius: 8, padding: "8px 12px",
                border: `1px solid ${s.color}20`,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: s.color, minWidth: 36 }}>{s.shell}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: T.ink }}>{s.e} electrons ({s.type})</div>
                  <div style={{ fontSize: 10, color: T.muted }}>{"\u03B5"} = {s.energy}</div>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: s.e }, (_, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, marginTop: 4 }}>
              DFT treats <span style={{ color: D.warm, fontWeight: 700 }}>10 core</span> +{" "}
              <span style={{ color: D.xc, fontWeight: 700 }}>1 valence</span> = 11 electrons.
              With PAW, only the <span style={{ color: D.xc, fontWeight: 700 }}>3s{"\u00B9"}</span> valence
              is solved explicitly.
            </div>
          </div>
        </div>
      </Card>

      {/* The Problem DFT Solves */}
      <Card title="What DFT Actually Does for Na" color={D.eqn}>
        <div style={mathBlock}>
          <span style={{ color: D.eqn, fontWeight: 800, fontSize: 14 }}>The real Schr{"\u00F6"}dinger equation (impossible to solve directly)</span><br />
          <div style={{ textAlign: "center", padding: "10px 0", background: D.eqn + "08", borderRadius: 8, margin: "8px 0" }}>
            <span style={{ fontSize: 15, color: T.ink }}>H{"\u03A8"}(r</span>
            <sub style={{ fontSize: 10 }}>1</sub>
            <span style={{ fontSize: 15, color: T.ink }}>, r</span>
            <sub style={{ fontSize: 10 }}>2</sub>
            <span style={{ fontSize: 15, color: T.ink }}>, ... r</span>
            <sub style={{ fontSize: 10 }}>11</sub>
            <span style={{ fontSize: 15, color: T.ink }}>) = E{"\u03A8"}(r</span>
            <sub style={{ fontSize: 10 }}>1</sub>
            <span style={{ fontSize: 15, color: T.ink }}>, ... r</span>
            <sub style={{ fontSize: 10 }}>11</sub>
            <span style={{ fontSize: 15, color: T.ink }}>)</span>
          </div>
          <span style={{ color: T.muted, fontSize: 12 }}>11 electrons {"\u00D7"} 3 coordinates = 33-dimensional wavefunction. Impossible to store or solve.</span><br /><br />

          <span style={{ color: D.main, fontWeight: 800, fontSize: 14 }}>DFT{"'"}s brilliant trick: replace {"\u03A8"} with n(r)</span><br />
          <div style={{ textAlign: "center", padding: "10px 0", background: D.main + "08", borderRadius: 8, margin: "8px 0" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: D.main }}>n</span>
            <span style={{ fontSize: 15, color: T.ink }}>(r) = {"\u03A3"}</span>
            <sub style={{ fontSize: 10 }}>i</sub>
            <span style={{ fontSize: 15, color: T.ink }}> |{"\u03C8"}</span>
            <sub style={{ fontSize: 10 }}>i</sub>
            <span style={{ fontSize: 15, color: T.ink }}>(r)|{"\u00B2"}</span>
            <span style={{ fontSize: 13, color: T.muted }}>{"  "}(only 3 variables!)</span>
          </div>
          <span style={{ color: T.muted, fontSize: 12 }}>Instead of 33D wavefunction, DFT uses the 3D electron density n(r). Hohenberg-Kohn proved this is sufficient!</span>
        </div>
      </Card>

      {/* KS Equations for Na */}
      <Card title="Kohn-Sham Equations for Na" color={D.xc}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Replace 11 interacting electrons with 11 non-interacting electrons in an effective potential V<sub>eff</sub>.
        </div>
        <div style={mathBlock}>
          <EqRow>
            <Bracket color={D.eqn}>
              <span style={{ color: D.eqn, display: "inline-flex", alignItems: "center" }}>
                {"\u2212"}<Frac n="1" d="2" color={D.eqn} />{"\u2207"}<Sup>2</Sup>
              </span>
              <span style={{ margin: "0 4px" }}>+</span>
              <span style={{ color: D.main, fontWeight: 600 }}>V<Sub>eff</Sub>(r)</span>
            </Bracket>
            <span style={{ color: D.xc, fontWeight: 600, marginLeft: 4 }}>{"\u03C8"}<Sub>i</Sub>(r)</span>
            <span style={{ margin: "0 6px" }}>=</span>
            <span style={{ color: D.eqn, fontWeight: 600 }}>{"\u03B5"}<Sub>i</Sub></span>
            <span style={{ color: D.xc, fontWeight: 600, marginLeft: 4 }}>{"\u03C8"}<Sub>i</Sub>(r)</span>
          </EqRow>

          <div style={{ fontWeight: 700, color: D.main, marginBottom: 8, marginTop: 8, fontSize: 14 }}>V<Sub>eff</Sub> has 3 parts:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: <><span>V</span><Sub>ext</Sub>(r)</>, desc: <><span>{"\u2212"}</span><Frac n={<>11e<Sup>2</Sup></>} d={<>|r {"\u2212"} R<Sub>Na</Sub>|</>} color={D.warm} size={12} /></>, detail: "Na nucleus (Z=11) pulls electrons toward center", color: D.warm },
              { name: <><span>V</span><Sub>H</Sub>(r)</>, desc: <><span>{"\u222B"}</span> <Frac n={<>n(r{"\u2032"})</>} d={<>|r {"\u2212"} r{"\u2032"}|</>} color={D.basis} size={12} /> dr{"\u2032"}</>, detail: "Electron-electron Coulomb repulsion (classical part)", color: D.basis },
              { name: <><span>V</span><Sub>xc</Sub>(r)</>, desc: <><Frac n={<>{"\u03B4"}E<Sub>xc</Sub>[n]</>} d={<>{"\u03B4"}n(r)</>} color={D.xc} size={12} /></>, detail: "Exchange-correlation: quantum effects (Pauli exclusion + correlation)", color: D.xc },
            ].map((v, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                background: v.color + "08", borderRadius: 10, padding: "10px 14px",
                border: `1px solid ${v.color}20`,
              }}>
                <div style={{ fontFamily: "serif", fontSize: 15, fontWeight: 700, color: v.color, minWidth: 70 }}>{v.name}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontFamily: "serif", color: T.ink, display: "flex", alignItems: "center" }}>{v.desc}</div>
                  <div style={{ fontSize: 10, color: T.muted }}>{v.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* SCF INTERACTIVE */}
      <Card title="Interactive SCF Cycle for Na" color={D.accent}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Click through each SCF iteration to watch Na{"'"}s electron density converge to self-consistency.
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {scfData.map((s, i) => (
            <button key={i} onClick={() => setScfStep(i)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer",
              background: scfStep === i ? (s.conv ? "#059669" + "20" : D.accent + "15") : T.bg,
              border: `1.5px solid ${scfStep === i ? (s.conv ? "#059669" : D.accent) : T.border}`,
              color: scfStep === i ? (s.conv ? "#059669" : D.accent) : T.muted,
              fontWeight: scfStep === i ? 700 : 400, fontFamily: "inherit",
            }}>
              {s.conv ? "\u2714 " : ""}{i === 0 ? "Guess" : `Iter ${i}`}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Density visualization */}
          <div style={{
            background: T.surface, borderRadius: 14, padding: "16px",
            border: `1px solid ${step.conv ? "#059669" + "40" : T.border}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
              Electron Density n(r)
            </div>

            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 160 * step.shell.valence / 0.35, height: 160 * step.shell.valence / 0.35,
                maxWidth: 160, maxHeight: 160,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${D.xc}${Math.round(step.shell.valence * 80).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                transition: "all 0.5s ease",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 80 * step.shell.core / 0.78, height: 80 * step.shell.core / 0.78,
                maxWidth: 80, maxHeight: 80,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${D.warm}${Math.round(step.shell.core * 130).toString(16).padStart(2, '0')} 0%, ${D.basis}30 60%, transparent 100%)`,
                transition: "all 0.5s ease",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: step.conv ? "#059669" : D.main,
                boxShadow: `0 0 ${step.conv ? 12 : 6}px ${step.conv ? "#059669" : D.main}60`,
                transition: "all 0.5s ease",
              }} />
            </div>

            <div style={{ fontSize: 10, color: step.conv ? "#059669" : D.accent, fontWeight: 700, marginTop: 8 }}>
              {step.n_desc}
            </div>
          </div>

          {/* Energy & info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              background: step.conv ? "#059669" + "10" : D.accent + "08",
              border: `1.5px solid ${step.conv ? "#059669" + "30" : D.accent + "20"}`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: step.conv ? "#059669" : D.accent, marginBottom: 6 }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>{step.desc}</div>
            </div>

            <div style={mathBlock}>
              <span style={{ color: D.eqn, fontWeight: 700 }}>E</span>
              <sub style={{ fontSize: 10 }}>total</sub>
              {" = "}<span style={{ fontWeight: 700, color: step.conv ? "#059669" : T.ink }}>{step.E.toFixed(3)} eV</span><br />
              {"\u0394"}E = {step.dE} eV<br /><br />
              {"Convergence: "}<span style={{ color: step.conv ? "#059669" : D.warn, fontWeight: 700 }}>
                {step.conv ? "YES \u2714 (\u0394E < 10\u207B\u2076 eV)" : `NO (need \u0394E < 10\u207B\u2076 eV)`}
              </span>
            </div>

            <div style={{ background: T.surface, borderRadius: 8, padding: "8px 12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Energy convergence</div>
              <div style={{ height: 8, borderRadius: 4, background: T.border + "40", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${Math.min(100, (scfStep / 5) * 100)}%`,
                  background: step.conv ? "#059669" : `linear-gradient(90deg, ${D.accent}, ${D.main})`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* SCF energy table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${D.accent}30` }}>
              {["Iter", "E_total (eV)", "\u0394E (eV)", "Status"].map(h => (
                <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, color: D.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scfData.map((s, i) => (
              <tr key={i} style={{
                background: i === scfStep ? (s.conv ? "#059669" + "10" : D.accent + "10") : i % 2 === 0 ? D.accent + "04" : "transparent",
                borderBottom: `1px solid ${T.border}55`,
                fontWeight: i === scfStep ? 700 : 400,
                cursor: "pointer",
              }} onClick={() => setScfStep(i)}>
                <td style={{ padding: "6px 8px", color: T.ink }}>{i === 0 ? "Guess" : i}</td>
                <td style={{ padding: "6px 8px", fontFamily: "monospace", color: i <= scfStep ? T.ink : T.dim }}>{i <= scfStep ? s.E.toFixed(3) : "\u2014"}</td>
                <td style={{ padding: "6px 8px", fontFamily: "monospace", color: i <= scfStep ? T.ink : T.dim }}>{i <= scfStep ? s.dE : "\u2014"}</td>
                <td style={{ padding: "6px 8px", color: s.conv && i <= scfStep ? "#059669" : T.muted }}>{i <= scfStep ? (s.conv ? "\u2714 Converged" : "Iterating...") : "\u2014"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* SCF Loop Explained */}
      <Card title={"The SCF Loop \u2014 What Happens Inside"} color={D.main}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { step: "1", text: "Guess initial density n\u2080(r) from atomic orbitals", desc: "Superposition of free-atom densities for Na", color: D.warm },
            { step: "2", text: "Build V_eff = V_ext + V_H[n] + V_xc[n]", desc: "Nuclear potential + Hartree + exchange-correlation", color: D.main },
            { step: "3", text: "Solve KS equations: [\u2212\u00BD\u2207\u00B2 + V_eff]\u03C8_i = \u03B5_i \u03C8_i", desc: "Find 11 single-particle orbitals for Na", color: D.xc },
            { step: "4", text: "Compute new density: n_out(r) = \u03A3 |\u03C8_i|\u00B2", desc: "Sum occupied orbital densities", color: D.basis },
            { step: "5", text: "Mix: n_new = \u03B1 n_out + (1\u2212\u03B1) n_in", desc: "Prevents oscillations (\u03B1 \u2248 0.3 for Na)", color: D.accent },
            { step: "6", text: "Check: |E_new \u2212 E_old| < EDIFF?", desc: "If yes \u2192 done! If no \u2192 go to step 2", color: D.warn },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                minWidth: 28, height: 28, borderRadius: "50%",
                background: item.color + "15", border: `1.5px solid ${item.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: item.color,
              }}>{item.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: T.ink, background: item.color + "06", borderRadius: 6, padding: "6px 12px", border: `1px solid ${item.color}12` }}>{item.text}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2, marginLeft: 12 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Results */}
      <Card title="Na Ground State Results (PBE)" color={D.basis}>
        <div style={mathBlock}>
          <span style={{ color: D.basis, fontWeight: 800, fontSize: 14 }}>Converged Kohn-Sham eigenvalues</span><br /><br />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { orb: "1s", occ: 2, energy: "-1041.3", color: D.warm },
              { orb: "2s", occ: 2, energy: "-63.4", color: D.basis },
              { orb: "2p", occ: 6, energy: "-30.7", color: D.basis },
              { orb: "3s", occ: 1, energy: "-5.14", color: D.xc },
              { orb: "3p", occ: 0, energy: "-1.06", color: T.muted },
              { orb: "3d", occ: 0, energy: "-0.05", color: T.dim },
            ].map(o => (
              <div key={o.orb} style={{
                background: o.color + "08", borderRadius: 8, padding: "8px 10px",
                border: `1px solid ${o.color}20`, textAlign: "center",
                opacity: o.occ > 0 ? 1 : 0.5,
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: o.color }}>{o.orb}</div>
                <div style={{ fontSize: 10, color: T.muted }}>{o.occ > 0 ? `${o.occ}e\u207B occupied` : "empty"}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.energy} eV</div>
              </div>
            ))}
          </div>
        </div>

        <div style={mathBlock}>
          <span style={{ color: D.basis, fontWeight: 800, fontSize: 14 }}>Final energies</span><br /><br />
          {"  E"}<sub>total</sub>{" = "}<span style={{ color: D.main, fontWeight: 700 }}>{"-162.142 eV"}</span><br />
          {"  E"}<sub>kinetic</sub>{" = +161.83 eV"}<br />
          {"  E"}<sub>ext</sub>{" = \u2212394.72 eV  (nucleus\u2212electron attraction)"}<br />
          {"  E"}<sub>Hartree</sub>{" = +78.94 eV  (e\u207B\u2212e\u207B repulsion)"}<br />
          {"  E"}<sub>xc</sub>{" = "}<span style={{ color: D.xc, fontWeight: 700 }}>{"\u22128.19 eV"}</span>{" (exchange-correlation)"}<br /><br />

          <span style={{ color: D.basis, fontWeight: 800, fontSize: 14 }}>Ionization energy (removing 3s electron)</span><br />
          {"  IE = \u2212\u03B5"}<sub>3s</sub>{" = "}<span style={{ color: D.xc, fontWeight: 700 }}>{"5.14 eV"}</span><br />
          <span style={{ color: T.muted, fontSize: 11 }}>{"  Experiment: 5.14 eV \u2014 exact match with PBE for Na!"}</span>
        </div>
      </Card>

    </div>
  );
}

// ── DFT_SECTIONS with block grouping ──
function BrillouinZoneAnalogy() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Step 1: You Know Unit Cells", color: "#2563eb" },
    { title: "Step 2: Brillouin Zone = Unit Cell of k-Space", color: "#059669" },
    { title: "Step 3: Special Points \u2014 \u0393, K, M, X, L", color: "#b45309" },
    { title: "Step 4: Band Structure = Walking Through the Room", color: "#7c3aed" },
  ];

  const s = steps[step];

  return (
    <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 10 }}>{"\uD83C\uDF4E"} Simple Analogy — What is the Brillouin Zone?</div>

      {/* Step tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer",
            border: `2px solid ${step === i ? st.color : "#e5e7eb"}`,
            background: step === i ? st.color + "15" : "#fff",
            color: step === i ? st.color : "#6b7280",
            fontWeight: step === i ? 700 : 500, fontFamily: "inherit",
          }}>
            {st.title}
          </button>
        ))}
      </div>

      {/* Step 1: Unit Cells */}
      {step === 0 && (
        <div>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: T.ink, marginBottom: 12 }}>
            You already understand <strong>unit cells</strong>: in a crystal like Si, one small box of atoms repeats forever in all directions. Instead of tracking billions of atoms, you only need <strong>one box</strong>.
          </div>
          <svg viewBox="0 0 400 120" style={{ width: "100%", maxWidth: 420, display: "block", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            {/* Grid of unit cells */}
            {[0,1,2,3,4].map(i => (
              <g key={i}>
                <rect x={20 + i * 75} y={20} width={65} height={65} rx={4}
                  fill={i === 2 ? "#2563eb15" : "#f8fafc"} stroke={i === 2 ? "#2563eb" : "#d1d5db"} strokeWidth={i === 2 ? 2.5 : 1} />
                {/* 4 atoms in each cell */}
                <circle cx={30 + i * 75} cy={30} r={6} fill={i === 2 ? "#2563eb" : "#94a3b8"} />
                <circle cx={55 + i * 75} cy={30} r={6} fill={i === 2 ? "#2563eb" : "#94a3b8"} />
                <circle cx={30 + i * 75} cy={65} r={6} fill={i === 2 ? "#2563eb" : "#94a3b8"} />
                <circle cx={55 + i * 75} cy={65} r={6} fill={i === 2 ? "#2563eb" : "#94a3b8"} />
              </g>
            ))}
            <text x={52 + 2 * 75} y={105} textAnchor="middle" fontSize={11} fontWeight="700" fill="#2563eb" fontFamily="monospace">Unit Cell</text>
            <text x={52 + 0 * 75} y={105} textAnchor="middle" fontSize={9} fill="#94a3b8">repeat</text>
            <text x={52 + 4 * 75} y={105} textAnchor="middle" fontSize={9} fill="#94a3b8">repeat</text>
          </svg>
          <div style={{ marginTop: 10, background: "#eff6ff", borderRadius: 8, padding: "10px 14px", border: "1px solid #2563eb22" }}>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>
              <strong style={{ color: "#2563eb" }}>Key idea:</strong> Because the crystal repeats, you only study <strong>one box</strong> (the unit cell). Everything outside is just a copy.
            </div>
          </div>
        </div>
      )}

      {/* Step 2: BZ = unit cell in k-space */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: T.ink, marginBottom: 12 }}>
            Electrons in a crystal are <strong>waves</strong>. Each wave has a direction and wavelength described by a vector <strong>k</strong>. Just like atom positions repeat, <strong>electron wave behaviors also repeat</strong>. The <strong>Brillouin Zone</strong> is the one box in k-space that contains all unique wave behaviors.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#eff6ff", borderRadius: 10, padding: "14px", border: "1.5px solid #2563eb22", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", marginBottom: 8 }}>Real Space</div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7 }}>
                Atoms repeat every <strong>a</strong> angstroms<br/>
                Unit cell = smallest repeating box<br/>
                Contains: <strong>atom positions</strong>
              </div>
            </div>
            <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "14px", border: "1.5px solid #05966922", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginBottom: 8 }}>k-Space (Momentum Space)</div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7 }}>
                Wave behaviors repeat every <strong>2{"\u03C0"}/a</strong><br/>
                Brillouin Zone = smallest repeating box<br/>
                Contains: <strong>electron energies</strong>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, background: "#fef3c7", borderRadius: 8, padding: "10px 14px", border: "1px solid #f59e0b22" }}>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>
              <strong style={{ color: "#b45309" }}>Think of it this way:</strong> Unit cell is the smallest box for <em>where atoms are</em>. Brillouin Zone is the smallest box for <em>how electrons behave</em>. Same idea, different space.
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Special Points */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: T.ink, marginBottom: 12 }}>
            The BZ is a 3D shape (like a room). Certain <strong>locations</strong> in this room are special because they have high symmetry — electrons behave in particularly simple or extreme ways there.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "\u0393 (Gamma)", where: "Dead center of the BZ", meaning: "Longest possible wavelength. All unit cells in the crystal do the same thing simultaneously. Like all atoms breathing in and out together.", color: "#2563eb", icon: "\u25CF" },
              { label: "X", where: "Center of a face (square face edge)", meaning: "Wavelength = 2a (twice the lattice spacing). The wave flips sign between neighboring cells in one direction. In Si, the conduction band minimum is near X \u2014 determines if bandgap is indirect.", color: "#059669", icon: "\u25A0" },
              { label: "M", where: "Center of an edge", meaning: "Wave flips in TWO directions. Neighboring cells along both x and y have opposite signs. Short wavelength, high energy region. Important in 2D materials like graphene.", color: "#b45309", icon: "\u25C6" },
              { label: "K", where: "Corner of hexagonal face", meaning: "Highest symmetry corner point. In graphene, the famous Dirac cones (zero bandgap) occur exactly at K. This is where graphene gets its special electronic properties.", color: "#7c3aed", icon: "\u25B2" },
              { label: "L", where: "Center of hexagonal face (FCC)", meaning: "Wave flips along the body diagonal (111 direction). In GaAs and many III-V semiconductors, L-point valleys affect high-field transport.", color: "#dc2626", icon: "\u25CF" },
            ].map(pt => (
              <div key={pt.label} style={{ background: pt.color + "08", border: `1.5px solid ${pt.color}20`, borderLeft: `4px solid ${pt.color}`, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, color: pt.color }}>{pt.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: pt.color }}>{pt.label}</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{"\u2014"} {pt.where}</span>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>{pt.meaning}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, background: "#fef3c7", borderRadius: 8, padding: "10px 14px", border: "1px solid #f59e0b22" }}>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>
              <strong style={{ color: "#b45309" }}>Room analogy:</strong> The BZ is a room. <strong>{"\u0393"}</strong> is the center of the room. <strong>X</strong> is the middle of a wall. <strong>M</strong> is where two walls meet at the floor. <strong>K</strong> is a corner where three walls meet. <strong>L</strong> is the middle of a slanted wall. Each location tells you something different about how electrons behave.
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Band structure */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 12, lineHeight: 1.9, color: T.ink, marginBottom: 12 }}>
            A <strong>band structure</strong> plot is what you get when you walk through the BZ room along a path ({"\u0393"} {"\u2192"} X {"\u2192"} M {"\u2192"} {"\u0393"}) and measure the electron energy at each step.
          </div>

          <svg viewBox="0 0 400 180" style={{ width: "100%", maxWidth: 420, display: "block", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            {/* Axes */}
            <line x1={50} y1={160} x2={370} y2={160} stroke="#d1d5db" strokeWidth={1.5} />
            <line x1={50} y1={20} x2={50} y2={160} stroke="#d1d5db" strokeWidth={1.5} />
            <text x={25} y={90} textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight="600" transform="rotate(-90,25,90)">Energy</text>

            {/* K-point labels */}
            {[{x: 50, l: "\u0393"}, {x: 130, l: "X"}, {x: 210, l: "M"}, {x: 290, l: "K"}, {x: 370, l: "\u0393"}].map(p => (
              <text key={p.l + p.x} x={p.x} y={175} textAnchor="middle" fontSize={12} fontWeight="800" fill="#b45309">{p.l}</text>
            ))}

            {/* Valence band (parabola going up) */}
            <path d="M50,110 Q90,95 130,90 Q170,85 210,100 Q250,80 290,75 Q330,85 370,110" fill="none" stroke="#2563eb" strokeWidth={2.5} />
            <text x={360} y={105} fontSize={9} fill="#2563eb" fontWeight="600">VB</text>

            {/* Conduction band */}
            <path d="M50,60 Q90,50 130,45 Q170,55 210,50 Q250,40 290,35 Q330,45 370,60" fill="none" stroke="#dc2626" strokeWidth={2.5} />
            <text x={360} y={55} fontSize={9} fill="#dc2626" fontWeight="600">CB</text>

            {/* Bandgap arrow */}
            <line x1={130} y1={90} x2={130} y2={45} stroke="#059669" strokeWidth={1.5} strokeDasharray="4,3" />
            <text x={145} y={70} fontSize={9} fill="#059669" fontWeight="700">Bandgap</text>

            {/* Walking person emoji at current step */}
            <text x={210} y={155} textAnchor="middle" fontSize={14}>{"\uD83D\uDEB6"}</text>
          </svg>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "#eff6ff", borderRadius: 8, padding: "10px 14px", border: "1px solid #2563eb22" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>What you learn from the walk:</div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>
                {"\u2022"} Where the bandgap is smallest<br/>
                {"\u2022"} Whether it{"'"}s direct ({"\u0393"}{"\u2192"}{"\u0393"}) or indirect ({"\u0393"}{"\u2192"}X)<br/>
                {"\u2022"} How heavy/light the electrons are (curve shape)
              </div>
            </div>
            <div style={{ background: "#fef3c7", borderRadius: 8, padding: "10px 14px", border: "1px solid #f59e0b22" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>KPOINTS = Resolution</div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>
                KPOINTS is how many steps you take on this walk.<br/>
                More steps = smoother curve = more accurate energies.<br/>
                Fewer steps = faster but might miss important features.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DFTParamsLabSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DFTParamsInteractive />
    </div>
  );
}

const DFT_SECTIONS = [
  { id: "manybody", block: "foundations", label: "Many-Body Problem", color: T.dft_main, Component: DFTManyBodySection, nextReason: "The exact many-body problem is intractable. Hohenberg-Kohn next proves a remarkable theorem: the ground-state electron density alone \u2014 a function of just 3 coordinates \u2014 uniquely determines all ground-state properties, replacing the 3N-coordinate wavefunction." },
  { id: "hk",       block: "foundations", label: "Hohenberg-Kohn",   color: T.dft_eqn,  Component: DFTHohenbergKohnSection, nextReason: "Density uniquely determines properties \u2014 but the theorem gives no prescription for finding it. Kohn-Sham maps the interacting electron system onto a fictitious non-interacting system with the same density, yielding solvable single-particle equations." },
  { id: "ks",       block: "foundations", label: "Kohn-Sham Equations", color: T.dft_eqn, Component: DFTKohnShamSection, nextReason: "KS equations are exact in principle, but the exchange-correlation (XC) functional is unknown. The choice of XC approximation is the central challenge of practical DFT \u2014 next we survey the approximations and when each is appropriate." },

  { id: "xc",       block: "functionals", label: "XC Functionals",   color: T.dft_xc,   Component: DFTXCFunctionalsSection, nextReason: "XC approximations form a hierarchy. GGA-PBE is the standard workhorse: it adds density gradient information to LDA, giving reliable geometries and energies for most materials at modest computational cost." },
  { id: "gga",      block: "functionals", label: "GGA (PBE)",        color: T.dft_main,  Component: DFTGGASection, nextReason: "PBE works well for many systems but systematically underestimates bandgaps due to self-interaction error. HSE06 mixes 25% exact (Hartree-Fock) exchange at short range, correcting gaps while remaining computationally tractable for solids." },
  { id: "hse",      block: "functionals", label: "HSE06 Hybrid",     color: T.dft_xc,   Component: DFTHSESection, nextReason: "HSE06 is accurate but expensive. DFT+U applies a Hubbard U correction to localized d/f orbitals \u2014 a cheaper alternative that improves d-electron description in transition metal oxides and correlated materials." },
  { id: "dftu",     block: "functionals", label: "GGA+U (DFT+U)",    color: T.dft_warm,  Component: DFTDFTUSection, nextReason: "Both HSE and DFT+U address a deeper root cause: self-interaction error, where an electron spuriously interacts with its own Hartree potential. Understanding SIE explains why standard DFT fails for localized states and deep defect levels." },
  { id: "sic",      block: "functionals", label: "Self-Interaction Error", color: T.dft_warn, Component: DFTSelfInteractionSection, nextReason: "The physics approximations are established. Now the numerics: plane waves provide a complete, systematically improvable basis for Bloch states in periodic systems; PAW reconstructs the full all-electron density near nuclei without pseudo-potentials." },

  { id: "basis",    block: "numerics",   label: "Plane Waves & PAW", color: T.dft_basis, Component: DFTPlaneWavesSection, nextReason: "Basis sets understood. DFT in practice means choosing ENCUT, k-point meshes, convergence thresholds, and VASP settings \u2014 the engineering decisions that separate reliable from unreliable calculations." },
  { id: "practice", block: "numerics",   label: "DFT in Practice",   color: T.dft_main,  Component: DFTPracticeSection, nextReason: "Abstract settings become concrete in the sodium atom example \u2014 every SCF step shown with real numbers, from initial guess density through convergence to the final total energy, forces, and band structure." },

  { id: "h_he_example", block: "examples", label: "H & He Analytic", color: T.dft_eqn, Component: DFTHHeExampleSection, nextReason: "H and He give exact benchmarks. The Na atom example now applies the full SCF machinery numerically \u2014 showing every iteration, orbital, and energy convergence in a real multi-electron system." },
  { id: "na_example",   block: "examples", label: "Na Atom Example",  color: T.dft_accent, Component: DFTNaExampleSection, nextReason: "Na numerics complete. The Parameters Lab lets you explore every VASP setting interactively \u2014 ENCUT, KPOINTS, ISMEAR, EDIFF \u2014 seeing how each knob affects convergence and accuracy." },
  { id: "dft_params",  block: "examples", label: "Parameters Lab",   color: T.dft_basis, Component: DFTParamsLabSection, nextReason: "Parameters mastered. The DFT Movie ties everything together \u2014 animated scenes of electron clouds, SCF convergence, and equation-by-equation derivations from scratch." },

  { id: "dft_movie",   block: "movies", label: "DFT Movie",          color: T.dft_main, Component: () => <div style={{ maxWidth: 980, margin: "0 auto", borderRadius: 14, overflow: "hidden", border: `2px solid ${T.dft_main}50`, boxShadow: `0 4px 24px ${T.dft_main}20` }}><DFTMovieModule /></div>, nextReason: "DFT is fully grounded. Chapter 7 (MLFF Pipeline) builds on DFT as a data source: graph neural networks learn to reproduce DFT-quality energies ~1000\u00D7 faster, enabling the large-scale simulations that DFT alone cannot reach." },
];

function DFTBasicsModule() {
  const [active, setActive] = useState("manybody");
  const [activeBlock, setActiveBlock] = useState("foundations");
  const sec = DFT_SECTIONS.find(s => s.id === active) || DFT_SECTIONS[0];
  const Component = sec.Component;
  const blockSections = DFT_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink, display: "flex", flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{ display: "flex", padding: "8px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto" }}>
        {DFT_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); const first = DFT_SECTIONS.find(s => s.block === b.id); if (first) setActive(first.id); }} style={{
            padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg, color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5, whiteSpace: "nowrap",
          }}>{b.label}</button>
        ))}
      </div>
      {/* Section tabs */}
      <div style={{ display: "flex", padding: "6px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {blockSections.map(s => {
          const globalIdx = DFT_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg, color: active === s.id ? s.color : T.muted,
              cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
              display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: sec.color, letterSpacing: 0.5 }}>{sec.label}</div>
        </div>
        <Component />
        {sec.nextReason && (
          <div style={{ marginTop: 28, padding: "14px 18px", borderRadius: 10, background: sec.color + "0a", border: `1.5px solid ${sec.color}22`, borderLeft: `4px solid ${sec.color}` }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => { const idx = DFT_SECTIONS.findIndex(s => s.id === active); const next = DFT_SECTIONS[idx + 1]; return next ? <span> Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>.</span> : null; })()}
            </div>
          </div>
        )}
        <ChapterReferences chapterId="dft" />
      </div>
      {/* Bottom nav with dot indicators */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel }}>
        <button onClick={() => { const i = DFT_SECTIONS.findIndex(s => s.id === active); if (i > 0) { setActive(DFT_SECTIONS[i-1].id); setActiveBlock(DFT_SECTIONS[i-1].block); } }} disabled={active === DFT_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === DFT_SECTIONS[0].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === DFT_SECTIONS[0].id ? T.border : sec.color}`, color: active === DFT_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === DFT_SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Previous</button>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {DFT_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: 7, height: 7, borderRadius: 4, background: active === s.id ? s.color : s.block === activeBlock ? s.color + "44" : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
        <button onClick={() => { const i = DFT_SECTIONS.findIndex(s => s.id === active); if (i < DFT_SECTIONS.length - 1) { setActive(DFT_SECTIONS[i+1].id); setActiveBlock(DFT_SECTIONS[i+1].block); } }} disabled={active === DFT_SECTIONS[DFT_SECTIONS.length-1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === DFT_SECTIONS[DFT_SECTIONS.length-1].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === DFT_SECTIONS[DFT_SECTIONS.length-1].id ? T.border : sec.color}`, color: active === DFT_SECTIONS[DFT_SECTIONS.length-1].id ? T.muted : sec.color,
          cursor: active === DFT_SECTIONS[DFT_SECTIONS.length-1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MODULE 8: MOLECULAR DYNAMICS
// ═══════════════════════════════════════════════════════════════════════════

const MD = {
  main:   T.md_main,
  newton: T.md_newton,
  thermo: T.md_thermo,
  aimd:   T.md_aimd,
  cls:    T.md_class,
  prop:   T.md_prop,
  warn:   T.md_warn,
};

const mdMathBlock = {
  fontFamily: "monospace", fontSize: 13, lineHeight: 1.9,
  background: T.surface, borderRadius: 10, padding: "14px 18px",
  border: `1px solid ${T.border}40`, marginBottom: 10,
};

const mdHl = (text, color) => <span style={{ color, fontWeight: 700 }}>{text}</span>;

const MD_BLOCKS = [
  { id: "foundations", label: "Foundations", color: T.md_main },
  { id: "methods", label: "Ensembles & Methods", color: T.md_thermo },
  { id: "analysis", label: "Analysis & Practice", color: T.md_prop },
  { id: "examples", label: "Examples & Movies", color: T.md_class },
];

function MDIntroSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Imagine you have a box of 1000 atoms. You know every atom{"'"}s position and the forces between them. MD is like pressing {"'"}play{"'"} — Newton{"'"}s laws tell each atom where to move next. You advance time in tiny steps (femtoseconds), and watch the atoms bounce, vibrate, diffuse, and melt. It{"'"}s a computational microscope that shows you atomic motion frame by frame.
          </div>
        </div>
        <Card title="Molecular Dynamics - Simulating Atomic Motion" color={MD.main}>
          <div style={{
            background: MD.main + "0a", border: `1.5px solid ${MD.main}30`,
            borderRadius: 10, padding: "14px 18px", marginBottom: 14,
            fontSize: 14, fontWeight: 600, color: MD.main, textAlign: "center", lineHeight: 1.6,
          }}>
            Solve Newton{"'"}s equations for every atom, one tiny time step at a time.
            Watch your material evolve in real time.
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>
            DFT gives you the ground state at T = 0 K. But real materials exist at finite
            temperature: atoms vibrate, diffuse, and undergo phase transitions. MD simulates
            this by propagating atomic trajectories forward in time.
          </div>
        </Card>

        <Card title="MD vs Static DFT" color={MD.newton}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Static DFT", items: ["T = 0 K only", "Equilibrium geometry", "No dynamics", "One structure"], color: MD.newton },
              { label: "Molecular Dynamics", items: ["Finite temperature", "Time evolution", "Diffusion, vibrations", "Ensemble of structures"], color: MD.main },
            ].map(col => (
              <div key={col.label} style={{ background: col.color + "08", border: `1px solid ${col.color}20`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: col.color, marginBottom: 8 }}>{col.label}</div>
                {col.items.map(item => (
                  <div key={item} style={{ fontSize: 11, color: T.ink, lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${col.color}30`, marginBottom: 4 }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card title="What MD Can Tell You" color={MD.prop}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { prop: "Diffusion", desc: "How fast atoms move through a material", color: MD.main },
              { prop: "Phase transitions", desc: "Melting, solid-solid transformations", color: MD.aimd },
              { prop: "Thermal expansion", desc: "How lattice changes with temperature", color: MD.cls },
              { prop: "Vibrational spectra", desc: "IR/Raman from velocity autocorrelation", color: MD.thermo },
              { prop: "Defect migration", desc: "Vacancy hopping, interstitial diffusion", color: MD.newton },
              { prop: "Surface reactions", desc: "Adsorption, catalysis, growth", color: MD.prop },
            ].map(item => (
              <div key={item.prop} style={{
                background: item.color + "08", border: `1px solid ${item.color}20`,
                borderRadius: 10, padding: "10px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.prop}</div>
                <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}

function MDNewtonSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Every atom feels forces from its neighbors — attractions from bonds, repulsions when too close. F = ma tells you the acceleration. If a Cu atom feels 2 eV/{"\u00C5"} of force and weighs 63.5 amu, you can calculate exactly how fast it accelerates. Multiply by a tiny time step, and you know where it moves next. Do this for every atom simultaneously, and you have MD.
          </div>
        </div>
        <Card title="Newton's Second Law for Atoms" color={MD.newton}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ color: MD.newton, fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>F</span>
              <sub style={{ color: MD.newton, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> = </span>
              <span style={{ color: MD.main, fontWeight: 700, fontSize: 16 }}>m</span>
              <sub style={{ color: MD.main, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> · </span>
              <span style={{ color: MD.prop, fontWeight: 700, fontSize: 16 }}>a</span>
              <sub style={{ color: MD.prop, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> = </span>
              <span style={{ color: MD.main, fontWeight: 700, fontSize: 16 }}>m</span>
              <sub style={{ color: MD.main, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> · </span>
              <span style={{ fontSize: 16, color: MD.prop }}>d²</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: MD.newton }}>r</span>
              <sub style={{ color: MD.newton, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> / d</span>
              <span style={{ color: T.ink, fontSize: 16 }}>t²</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 14, padding: "10px 0", background: MD.main + "08", borderRadius: 8 }}>
              <span style={{ color: MD.main, fontWeight: 800, fontSize: 16 }}>F</span>
              <sub style={{ color: MD.main, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> = </span>
              <span style={{ color: MD.warn, fontSize: 18 }}>{"\u2212"}</span>
              <span style={{ color: MD.main, fontSize: 16 }}>{"\u2207"}</span>
              <sub style={{ color: MD.main, fontSize: 11 }}>i</sub>
              <span style={{ color: T.ink, fontSize: 16 }}> E(</span>
              <span style={{ color: MD.newton, fontWeight: 600, fontSize: 16 }}>r</span>
              <sub style={{ fontSize: 10 }}>{"\u2081"}</sub>
              <span style={{ color: T.ink, fontSize: 16 }}>, </span>
              <span style={{ color: MD.newton, fontWeight: 600, fontSize: 16 }}>r</span>
              <sub style={{ fontSize: 10 }}>{"\u2082"}</sub>
              <span style={{ color: T.ink, fontSize: 16 }}>, ... </span>
              <span style={{ color: MD.newton, fontWeight: 600, fontSize: 16 }}>r</span>
              <sub style={{ fontSize: 10 }}>N</sub>
              <span style={{ color: T.ink, fontSize: 16 }}>)</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, textAlign: "center" }}>
              Forces come from the <span style={{ color: MD.main, fontWeight: 600 }}>gradient</span> of the potential energy surface.<br />
              In AIMD: forces from DFT. In classical MD: forces from force fields.
            </div>
          </div>
        </Card>

        <Card title="The Time Step" color={MD.warn}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Must be small enough to resolve the fastest vibration in your system.
            For most solids: {mdHl("\u0394t = 1-2 fs", MD.warn)} (1 fs = 10{"\u207B\u00B9\u2075"} s).
          </div>
          <div style={mdMathBlock}>
            <span style={{ color: MD.warn, fontWeight: 700 }}>Rule: {"\u0394"}t {"<"} period of fastest vibration / 10</span><br /><br />
            {"  O-H stretch:    period ~ 9 fs    \u2192 \u0394t < 0.9 fs"}<br />
            {"  C-H stretch:    period ~ 10 fs   \u2192 \u0394t < 1.0 fs"}<br />
            {"  Cu-Se bond:     period ~ 30 fs   \u2192 \u0394t < 3.0 fs"}<br />
            {"  Heavy metals:   period ~ 50 fs   \u2192 \u0394t < 5.0 fs"}
          </div>
        </Card>

        <Card title="Numerical Example - Single O Atom" color={MD.prop}>
          <div style={mdMathBlock}>
            <span style={{ color: MD.prop, fontWeight: 700 }}>Given: F = 0.5 eV/{"\u00C5"} on an oxygen atom (m = 16 amu)</span><br /><br />
            {"  a = F/m = 0.5 eV/\u00C5 / (16 \u00D7 1.661\u00D710\u207B\u00B2\u2077 kg)"}<br />
            {"    = 0.5 \u00D7 1.602\u00D710\u207B\u00B9\u2079 J / (10\u207B\u00B9\u2070 m) / (2.658\u00D710\u207B\u00B2\u2076 kg)"}<br />
            {"    = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"3.01 \u00D7 10\u00B2\u2076 m/s\u00B2"}</span><br /><br />
            {"  In 1 fs: \u0394r = \u00BD a t\u00B2 = \u00BD \u00D7 3.01\u00D710\u00B2\u2076 \u00D7 (10\u207B\u00B9\u2075)\u00B2"}<br />
            {"         = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"0.015 \u00C5"}</span><br /><br />
            <span style={{ color: T.muted }}>A tiny displacement per step - that{"'"}s why you need thousands of steps.</span>
          </div>
        </Card>
      </div>
  );
}

function MDVerletSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            You can{"'"}t solve F = ma analytically for 1000 interacting atoms. Instead, you take tiny time steps: know where the atom is now, know its velocity, compute the force {"→"} predict where it will be 1 fs later. The Velocity Verlet algorithm does this while perfectly conserving total energy — like a perfectly elastic billiards table where no energy is ever lost.
          </div>
        </div>
        <Card title="Velocity Verlet Algorithm (Most Used)" color={MD.newton}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            The standard integration algorithm in almost all MD codes. Time-reversible, symplectic
            (conserves energy), and simple to implement.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { step: "1", text: "r(t+\u0394t) = r(t) + v(t)\u0394t + \u00BD a(t)\u0394t\u00B2", desc: "Update positions", color: MD.newton },
              { step: "2", text: "Calculate F(t+\u0394t) from new positions", desc: "Get new forces (DFT or FF)", color: MD.main },
              { step: "3", text: "a(t+\u0394t) = F(t+\u0394t) / m", desc: "New accelerations", color: MD.prop },
              { step: "4", text: "v(t+\u0394t) = v(t) + \u00BD [a(t) + a(t+\u0394t)] \u0394t", desc: "Update velocities", color: MD.thermo },
            ].map(item => (
              <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: item.color + "15", border: `1.5px solid ${item.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: item.color,
                }}>{item.step}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontFamily: "monospace", color: T.ink, background: item.color + "06", borderRadius: 6, padding: "6px 12px", border: `1px solid ${item.color}12` }}>{item.text}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 2, marginLeft: 12 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Worked Example - 2 Atoms, 3 Steps" color={MD.prop}>
          <div style={mdMathBlock}>
            <span style={{ color: MD.prop, fontWeight: 700 }}>Setup: 2 atoms on a line, Hooke{"'"}s spring F = -k(r-r0)</span><br />
            {"  k = 1.0 eV/\u00C5\u00B2, r0 = 2.5 \u00C5, m = 28 amu (Si), \u0394t = 2 fs"}<br /><br />
            <span style={{ color: MD.newton, fontWeight: 700 }}>t = 0:</span><br />
            {"  r = 2.7 \u00C5, v = 0, F = -0.2 eV/\u00C5, a = -4.3\u00D710\u00B2\u2074 m/s\u00B2"}<br /><br />
            <span style={{ color: MD.newton, fontWeight: 700 }}>t = 2 fs:</span><br />
            {"  r = 2.7 + 0 + \u00BD(-4.3\u00D710\u00B2\u2074)(2\u00D710\u207B\u00B9\u2075)\u00B2 = 2.6991 \u00C5"}<br />
            {"  F_new = -0.199 eV/\u00C5"}<br />
            {"  v = 0 + \u00BD(-4.3\u00D710\u00B2\u2074 + -4.29\u00D710\u00B2\u2074)(2\u00D710\u207B\u00B9\u2075) = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"-0.86 \u00C5/ps"}</span><br /><br />
            <span style={{ color: T.muted }}>Atom oscillates around equilibrium - that{"'"}s a phonon!</span>
          </div>
        </Card>

        <Card title="Elastic MD Example — 4-Atom 1D Chain" color={MD.aimd}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            A 1D chain of 4 atoms connected by springs (harmonic bonds). This demonstrates
            how elastic interactions propagate through a lattice — the basis of phonon physics.
          </div>

          {/* Diagram */}
          <div style={{
            textAlign: "center", padding: "16px 0 12px",
            background: MD.aimd + "08", borderRadius: 10, marginBottom: 12,
            border: `1px solid ${MD.aimd}20`,
          }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>4-Atom Chain with Harmonic Springs</div>
            <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 2, color: T.ink }}>
              <span style={{ color: MD.newton, fontWeight: 800 }}>{"\u25CF"}</span>
              <span style={{ color: MD.aimd }}>{"~~~"}</span>
              <span style={{ color: MD.main, fontWeight: 800 }}>{"\u25CF"}</span>
              <span style={{ color: MD.aimd }}>{"~~~"}</span>
              <span style={{ color: MD.prop, fontWeight: 800 }}>{"\u25CF"}</span>
              <span style={{ color: MD.aimd }}>{"~~~"}</span>
              <span style={{ color: MD.thermo, fontWeight: 800 }}>{"\u25CF"}</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: T.muted, marginTop: 4 }}>
              {"  "}
              <span style={{ color: MD.newton }}>Atom 1</span>{"    "}
              <span style={{ color: MD.main }}>Atom 2</span>{"    "}
              <span style={{ color: MD.prop }}>Atom 3</span>{"    "}
              <span style={{ color: MD.thermo }}>Atom 4</span>
            </div>
          </div>

          <div style={mdMathBlock}>
            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Setup</span><br />
            {"  Potential: V = \u00BD k (r"}<sub>ij</sub>{" \u2212 r"}<sub>0</sub>{")\u00B2  (harmonic spring)"}<br />
            {"  k = 2.0 eV/\u00C5\u00B2,  r"}<sub>0</sub>{" = 2.50 \u00C5,  m = 28 amu (Si),  \u0394t = 1 fs"}<br /><br />

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Initial Positions (equilibrium + perturbation on atom 1)</span><br />
            {"  x"}<sub>1</sub>{" = 0.00 \u00C5  (shifted +0.10 \u00C5 from eq.)    v"}<sub>1</sub>{" = 0"}<br />
            {"  x"}<sub>2</sub>{" = 2.50 \u00C5  (at equilibrium)              v"}<sub>2</sub>{" = 0"}<br />
            {"  x"}<sub>3</sub>{" = 5.00 \u00C5  (at equilibrium)              v"}<sub>3</sub>{" = 0"}<br />
            {"  x"}<sub>4</sub>{" = 7.50 \u00C5  (at equilibrium)              v"}<sub>4</sub>{" = 0"}<br /><br />

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Equilibrium separations</span><br />
            {"  r"}<sub>12</sub>{"\u2080 = 2.50, r"}<sub>23</sub>{"\u2080 = 2.50, r"}<sub>34</sub>{"\u2080 = 2.50 \u00C5"}<br /><br />

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Actual separations at t = 0 (atom 1 displaced by +0.10 {"\u00C5"})</span><br />
            {"  r"}<sub>12</sub>{" = x"}<sub>2</sub>{" \u2212 x"}<sub>1</sub>{" = 2.50 \u2212 0.10 = 2.40 \u00C5  (\u0394 = \u22120.10 \u00C5, compressed)"}<br />
            {"  r"}<sub>23</sub>{" = 5.00 \u2212 2.50 = 2.50 \u00C5  (at eq.)"}<br />
            {"  r"}<sub>34</sub>{" = 7.50 \u2212 5.00 = 2.50 \u00C5  (at eq.)"}<br /><br />

            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>Step 1: Forces at t = 0</span><br />
            {"  F = \u2212k \u00D7 \u0394r  (force on each atom from each bond)"}<br /><br />
            {"  "}<span style={{ color: MD.newton, fontWeight: 700 }}>Atom 1:</span>{" bond 1\u21922 compressed by \u22120.10 \u00C5"}<br />
            {"    F"}<sub>1</sub>{" = \u2212k(\u22120.10) = +0.20 eV/\u00C5  (pushed left, back toward eq.)"}<br /><br />
            {"  "}<span style={{ color: MD.main, fontWeight: 700 }}>Atom 2:</span>{" feels bond 1\u21922 and bond 2\u21923"}<br />
            {"    from bond 1\u21922: F = \u2212k(\u22120.10) \u00D7 (\u22121) = \u22120.20 eV/\u00C5  (pulled toward atom 1)"}<br />
            {"    from bond 2\u21923: F = \u2212k(0) = 0"}<br />
            {"    F"}<sub>2</sub>{" = \u22120.20 eV/\u00C5"}<br /><br />
            {"  "}<span style={{ color: MD.prop, fontWeight: 700 }}>Atom 3:</span>{" both bonds at equilibrium \u2192 F"}<sub>3</sub>{" = 0"}<br />
            {"  "}<span style={{ color: MD.thermo, fontWeight: 700 }}>Atom 4:</span>{" bond at equilibrium \u2192 F"}<sub>4</sub>{" = 0"}<br /><br />

            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>Step 2: Accelerations at t = 0</span><br />
            {"  a = F / m,  m = 28 \u00D7 1.661\u00D710\u207B\u00B2\u2077 kg = 4.651\u00D710\u207B\u00B2\u2036 kg"}<br /><br />
            {"  a"}<sub>1</sub>{" = +0.20 eV/\u00C5 / m = +0.20 \u00D7 1.602\u00D710\u207B\u00B9\u2079 / (10\u207B\u00B9\u2070 \u00D7 4.651\u00D710\u207B\u00B2\u2036)"}<br />
            {"     = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"+6.89 \u00D7 10\u00B2\u2075 m/s\u00B2"}</span><br />
            {"  a"}<sub>2</sub>{" = "}<span style={{ color: MD.main, fontWeight: 700 }}>{"\u22126.89 \u00D7 10\u00B2\u2075 m/s\u00B2"}</span><br />
            {"  a"}<sub>3</sub>{" = a"}<sub>4</sub>{" = 0"}<br /><br />

            <span style={{ color: MD.main, fontWeight: 800, fontSize: 14 }}>Step 3: Velocity Verlet — update positions (t = 1 fs)</span><br />
            {"  x(t+\u0394t) = x(t) + v(t)\u0394t + \u00BD a(t)\u0394t\u00B2"}<br />
            {"  \u0394t = 1 fs = 10\u207B\u00B9\u2075 s,  \u00BD\u0394t\u00B2 = 0.5 \u00D7 10\u207B\u00B3\u2070 s\u00B2"}<br /><br />
            {"  x"}<sub>1</sub>{"(1fs) = 0.10 + 0 + \u00BD(6.89\u00D710\u00B2\u2075)(10\u207B\u00B9\u2075)\u00B2 \u00D7 10\u00B9\u2070 \u00C5/m"}<br />
            {"         = 0.10 + 0.000345 = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"0.10035 \u00C5"}</span><br />
            {"  x"}<sub>2</sub>{"(1fs) = 2.50 + 0 + \u00BD(\u22126.89\u00D710\u00B2\u2075)(10\u207B\u00B9\u2075)\u00B2 \u00D7 10\u00B9\u2070"}<br />
            {"         = 2.50 \u2212 0.000345 = "}<span style={{ color: MD.main, fontWeight: 700 }}>{"2.49966 \u00C5"}</span><br />
            {"  x"}<sub>3</sub>{"(1fs) = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"5.00000 \u00C5"}</span>{" (unchanged)"}<br />
            {"  x"}<sub>4</sub>{"(1fs) = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"7.50000 \u00C5"}</span>{" (unchanged)"}<br /><br />

            <span style={{ color: MD.prop, fontWeight: 800, fontSize: 14 }}>Step 4: New forces at t = 1 fs</span><br />
            {"  r"}<sub>12</sub>{" = 2.49966 \u2212 0.10035 = 2.39931 \u00C5  (\u0394 = \u22120.10069)"}<br />
            {"  r"}<sub>23</sub>{" = 5.00 \u2212 2.49966 = 2.50034 \u00C5  (\u0394 = +0.00034)"}<br />
            {"  r"}<sub>34</sub>{" = 7.50 \u2212 5.00 = 2.50 \u00C5  (still at eq.)"}<br /><br />

            {"  F"}<sub>1</sub>{"(new) = +0.2014 eV/\u00C5"}<br />
            {"  F"}<sub>2</sub>{"(new) = \u22120.2014 + (\u22120.00068) = \u22120.2021 eV/\u00C5"}<br />
            {"  F"}<sub>3</sub>{"(new) = +0.00068 eV/\u00C5  "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"(perturbation reaches atom 3!)"}</span><br />
            {"  F"}<sub>4</sub>{"(new) = 0"}<br /><br />

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Step 5: Update velocities</span><br />
            {"  v(t+\u0394t) = v(t) + \u00BD [a(t) + a(t+\u0394t)] \u0394t"}<br /><br />
            {"  v"}<sub>1</sub>{"(1fs) = 0 + \u00BD(6.89 + 6.92)\u00D710\u00B2\u2075 \u00D7 10\u207B\u00B9\u2075 \u00D7 10\u00B9\u2070 = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"+0.069 \u00C5/ps"}</span><br />
            {"  v"}<sub>2</sub>{"(1fs) = "}<span style={{ color: MD.main, fontWeight: 700 }}>{"\u22120.069 \u00C5/ps"}</span><br />
            {"  v"}<sub>3</sub>{"(1fs) = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"~0.000 \u00C5/ps"}</span>{" (barely starting to move)"}<br />
            {"  v"}<sub>4</sub>{"(1fs) = 0"}<br /><br />

            <div style={{
              background: MD.aimd + "10", border: `1.5px solid ${MD.aimd}30`,
              borderRadius: 8, padding: "10px 14px", marginTop: 6,
            }}>
              <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 13 }}>Key Observation — Elastic Wave Propagation</span><br />
              <span style={{ fontSize: 12, color: T.ink, lineHeight: 1.7 }}>
                The initial displacement of atom 1 creates a force on atom 2 immediately.<br />
                After just 1 fs, atom 3 starts to feel a tiny force ({"\u0394"}r{"\u2082\u2083"} {">"} 0) — the perturbation is <span style={{ color: MD.aimd, fontWeight: 700 }}>propagating as an elastic wave</span> through the chain.<br />
                Atom 4 remains at rest — the wave hasn{"'"}t reached it yet.<br />
                This is exactly how <span style={{ color: MD.prop, fontWeight: 700 }}>acoustic phonons</span> work in a crystal lattice!
              </span>
            </div>
          </div>
        </Card>
      </div>
  );
}

function MDEnsemblesSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Basic MD conserves total energy (NVE) — like a perfectly insulated box. But real experiments happen at constant temperature (NVT) or pressure (NPT). A thermostat acts like the lab{"'"}s temperature controller — it adds or removes kinetic energy so atoms maintain the right average speed. A barostat adjusts the box size to maintain constant pressure.
          </div>
        </div>
        <Card title="Thermodynamic Ensembles" color={MD.thermo}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "NVE (Microcanonical)", fixed: "N, V, E", varies: "T, P", use: "Testing energy conservation. Debugging. Isolated system.", color: MD.newton },
              { name: "NVT (Canonical)", fixed: "N, V, T", varies: "E, P", use: "Most common. Fixed temperature simulations. Defect studies.", color: MD.main },
              { name: "NPT (Isobaric-Isothermal)", fixed: "N, P, T", varies: "E, V", use: "Phase transitions, thermal expansion. Cell shape changes.", color: MD.thermo },
              { name: "NP\u03C3T (Parrinello-Rahman)", fixed: "N, \u03C3, T", varies: "E, V, shape", use: "Structural phase transitions where cell shape matters.", color: MD.cls },
            ].map(item => (
              <div key={item.name} style={{
                background: item.color + "08", border: `1.5px solid ${item.color}20`,
                borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.5 }}>
                  <strong>Fixed:</strong> {item.fixed} | <strong>Varies:</strong> {item.varies}
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{item.use}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Thermostats - Controlling Temperature" color={MD.cls}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${MD.cls}30` }}>
                {["Thermostat", "Method", "Pros/Cons"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: MD.cls, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Nose-Hoover", "Extended Lagrangian with fictitious mass", "Correct NVT ensemble. Standard choice."],
                ["Berendsen", "Rescale velocities toward target T", "Fast equilibration but wrong ensemble."],
                ["Langevin", "Random forces + friction", "Good for rare events. Stochastic."],
                ["Velocity rescaling", "Direct v scaling each step", "Simple but unphysical. Only for equilibration."],
              ].map(([name, method, pros], i) => (
                <tr key={name} style={{ background: i % 2 === 0 ? MD.cls + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: T.ink, fontFamily: "monospace" }}>{name}</td>
                  <td style={{ padding: "8px 10px", color: T.muted }}>{method}</td>
                  <td style={{ padding: "8px 10px", color: T.muted }}>{pros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
  );
}

function MDAimdSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            In classical MD, you use a pre-built force field (a formula). In AIMD, you run a DFT calculation at every single time step to get exact quantum forces. It{"'"}s like hiring a quantum mechanic to compute forces fresh every femtosecond instead of using an approximate recipe. Incredibly accurate but extremely expensive — limited to ~100 atoms for ~10 picoseconds.
          </div>
        </div>
        <Card title="Ab Initio Molecular Dynamics (AIMD)" color={MD.aimd}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            At every MD step, run a full DFT calculation to get forces. No force field needed -
            forces come directly from quantum mechanics. This is the most accurate but most expensive MD.
          </div>
          <div style={mdMathBlock}>
            <span style={{ color: MD.aimd, fontWeight: 700 }}>Born-Oppenheimer MD (BOMD):</span><br />
            {"  For each timestep:"}<br />
            {"    1. Solve KS equations \u2192 get E[n] and F_i = -\u2207_i E"}<br />
            {"    2. Propagate atoms with Velocity Verlet"}<br />
            {"    3. Repeat"}<br /><br />
            <span style={{ color: T.muted }}>Each step requires a full SCF cycle (5-20 iterations)</span><br />
            <span style={{ color: MD.aimd }}>Cost: ~1 min per step for 64 atoms on 32 cores</span>
          </div>
        </Card>

        <Card title="AIMD Cost Comparison" color={MD.warn}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { method: "AIMD (DFT)", atoms: "64-256", time: "10-100 ps", cost: "10,000 CPU-hrs", color: MD.aimd },
              { method: "MLFF-MD", atoms: "1,000-10,000", time: "1-10 ns", cost: "100 CPU-hrs", color: MD.main },
              { method: "Classical MD", atoms: "10\u2076+", time: "1-100 ns", cost: "10 CPU-hrs", color: MD.cls },
            ].map(item => (
              <div key={item.method} style={{
                background: item.color + "08", border: `1px solid ${item.color}20`,
                borderRadius: 10, padding: "12px 14px", textAlign: "center",
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginBottom: 6 }}>{item.method}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Max atoms: {item.atoms}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Timescale: {item.time}</div>
                <div style={{ fontSize: 11, color: item.color, fontWeight: 600, marginTop: 4 }}>{item.cost}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="VASP AIMD Settings" color={MD.prop}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7,
            background: T.surface, color: T.ink, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "18px 20px",
          }}>
            <pre style={{ margin: 0 }}>{`# AIMD in VASP
IBRION  = 0       # MD mode
POTIM   = 1.0     # Timestep (fs)
NSW     = 5000    # Number of MD steps (= 5 ps)
SMASS   = 0       # Nose-Hoover thermostat
TEBEG   = 800     # Starting temperature (K)
TEEND   = 800     # Final temperature (K)

# Reduce accuracy slightly for speed
PREC    = Normal  # (not Accurate)
EDIFF   = 1E-5    # Looser SCF (still fine for forces)
ALGO    = VeryFast # RMM-DIIS (faster SCF)
NELMIN  = 4       # Minimum SCF steps`}</pre>
          </div>
        </Card>
      </div>
  );
}

function MDClassicalSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Classical MD uses pre-fitted mathematical formulas (force fields like EAM for metals, Tersoff for covalent systems) instead of solving quantum mechanics at each step. This makes it fast enough to simulate millions of atoms for nanoseconds — the scale needed to see grain boundaries move, cracks propagate, or materials melt.
          </div>
        </div>
        <Card title="Classical MD - Force Fields" color={MD.cls}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Instead of DFT at each step, use analytical force fields (Lennard-Jones, EAM, Tersoff, etc.)
            to compute forces. Orders of magnitude faster - can simulate millions of atoms for nanoseconds.
          </div>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", marginBottom: 12, padding: "12px 0", background: MD.cls + "08", borderRadius: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: MD.cls }}>E</span>
              <span style={{ fontSize: 16, color: T.ink }}> = </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: MD.newton }}>E<sub style={{ fontSize: 10 }}>bond</sub></span>
              <span style={{ fontSize: 16, color: T.ink }}> + </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: MD.main }}>E<sub style={{ fontSize: 10 }}>angle</sub></span>
              <span style={{ fontSize: 16, color: T.ink }}> + </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: MD.prop }}>E<sub style={{ fontSize: 10 }}>dihedral</sub></span>
              <span style={{ fontSize: 16, color: T.ink }}> + </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: MD.thermo }}>E<sub style={{ fontSize: 10 }}>vdW</sub></span>
              <span style={{ fontSize: 16, color: T.ink }}> + </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: MD.aimd }}>E<sub style={{ fontSize: 10 }}>Coulomb</sub></span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, textAlign: "center", marginBottom: 10 }}>
              Each term is a simple analytical function<br />
              Force = {"\u2212"}dE/dr  (analytical derivative, instant)
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <div style={{ background: MD.cls + "10", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: MD.cls, fontWeight: 700 }}>DFT force: ~60 s/step</div>
              <div style={{ background: MD.main + "10", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: MD.main, fontWeight: 700 }}>FF force: ~0.001 s/step</div>
            </div>
          </div>
        </Card>

        <Card title="Common Force Fields" color={MD.newton}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${MD.newton}30` }}>
                {["Force Field", "Best For", "Limitations"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: MD.newton, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Lennard-Jones", "Noble gases, simple liquids", "No bond breaking, no chemistry"],
                ["EAM", "Metals (Cu, Al, Ni, Fe)", "No covalent bonds, no semiconductors"],
                ["Tersoff/SW", "Si, Ge, C (covalent)", "Poor for surfaces and defects"],
                ["ReaxFF", "Reactive systems, combustion", "Complex fitting, slow for FF"],
                ["MLFF (NNP, MACE)", "Anything trained on DFT", "Need training data, extrapolation risk"],
              ].map(([ff, best, limit], i) => (
                <tr key={ff} style={{ background: i % 2 === 0 ? MD.newton + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: T.ink, fontFamily: "monospace" }}>{ff}</td>
                  <td style={{ padding: "8px 10px", color: T.muted }}>{best}</td>
                  <td style={{ padding: "8px 10px", color: MD.warn }}>{limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Software" color={MD.prop}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { name: "LAMMPS", desc: "General-purpose, massive parallelism, most force fields", color: MD.main },
              { name: "GROMACS", desc: "Biomolecular MD, extremely fast for proteins/lipids", color: MD.prop },
              { name: "ASE", desc: "Python interface to any calculator, great for prototyping", color: MD.thermo },
            ].map(item => (
              <div key={item.name} style={{
                background: item.color + "08", border: `1px solid ${item.color}20`,
                borderRadius: 10, padding: "10px 14px", textAlign: "center",
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}

function MDPropertiesSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            MD generates atomic trajectories — positions and velocities at every time step. From these trajectories you extract real physical properties: how atoms are arranged (RDF), how fast they diffuse (MSD), what temperature the system is at (kinetic energy), and vibrational frequencies (velocity autocorrelation). The trajectory is raw data; properties are the physics.
          </div>
        </div>
        <Card title="Radial Distribution Function g(r)" color={MD.main}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", marginBottom: 14, padding: "12px 0", background: MD.main + "08", borderRadius: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: MD.main }}>g</span>
              <span style={{ fontSize: 16, color: T.ink }}>(</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.main }}>r</span>
              <span style={{ fontSize: 16, color: T.ink }}>) = </span>
              <span style={{ fontSize: 14, color: T.ink }}>
                <sup style={{ fontSize: 12 }}>V</sup>{"\u2044"}<sub style={{ fontSize: 12 }}>N{"\u00B2"}</sub>
              </span>
              <span style={{ fontSize: 16, color: T.ink }}> {"\u27E8"}</span>
              <span style={{ fontSize: 16, color: MD.newton }}>{"\u03A3"}</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 16, color: MD.newton }}> {"\u03A3"}</span>
              <sub style={{ fontSize: 10 }}>j{"\u2260"}i</sub>
              <span style={{ fontSize: 16, color: T.ink }}> {"\u03B4"}(r {"\u2212"} r</span>
              <sub style={{ fontSize: 10 }}>ij</sub>
              <span style={{ fontSize: 16, color: T.ink }}>){"\u27E9"} / (4{"\u03C0"}r{"\u00B2"} dr)</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, textAlign: "center" }}>
              Histogram of atom-atom distances, averaged over trajectory.<br />
              Peaks = preferred distances (bond lengths, coordination shells).<br />
              g(r) {"\u2192"} 1 at large r (random/uniform distribution).
            </div>
          </div>
        </Card>

        <Card title="Mean Square Displacement — Diffusion" color={MD.prop}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", marginBottom: 10, padding: "12px 0", background: MD.prop + "08", borderRadius: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: MD.prop }}>MSD</span>
              <span style={{ fontSize: 16, color: T.ink }}>(t) = {"\u27E8"}|</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.prop }}>r</span>
              <span style={{ fontSize: 16, color: T.ink }}>(t) {"\u2212"} </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.prop }}>r</span>
              <span style={{ fontSize: 16, color: T.ink }}>(0)|{"\u00B2"}{"\u27E9"}</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 14, padding: "8px 0", background: MD.main + "08", borderRadius: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: MD.main }}>D</span>
              <span style={{ fontSize: 16, color: T.ink }}> = </span>
              <span style={{ fontSize: 14, color: T.ink }}>
                <sup style={{ fontSize: 12 }}>MSD</sup>{"\u2044"}<sub style={{ fontSize: 12 }}>2dt</sub>
              </span>
              <span style={{ fontSize: 12, color: T.muted }}> {"  "}(d = dimensionality = 3)</span>
            </div>
            <span style={{ color: MD.prop, fontWeight: 700 }}>Numerical example — Cu vacancy in CuInSe{"\u2082"} at 800K:</span><br /><br />
            {"  After 10 ps:  MSD = 0.42 \u00C5\u00B2"}<br />
            {"  After 50 ps:  MSD = 2.10 \u00C5\u00B2"}<br />
            {"  After 100 ps: MSD = 4.15 \u00C5\u00B2"}<br /><br />
            {"  Slope = \u0394MSD/\u0394t = (4.15 \u2212 0.42) / (90 ps)"}<br />
            {"         = 0.0414 \u00C5\u00B2/ps"}<br /><br />
            {"  D = 0.0414 / (2 \u00D7 3) = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"6.9 \u00D7 10\u207B\u2078 cm\u00B2/s"}</span><br /><br />
            <span style={{ color: T.muted }}>Compare experiment: D_Cu in CIS at 800K ~ 5-8 {"\u00D7"} 10{"\u207B\u2078"} cm{"\u00B2"}/s</span>
          </div>
        </Card>

        <Card title="Temperature from Kinetic Energy" color={MD.thermo}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", marginBottom: 14, padding: "12px 0", background: MD.thermo + "08", borderRadius: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: MD.thermo }}>T</span>
              <span style={{ fontSize: 16, color: T.ink }}> = </span>
              <span style={{ fontSize: 14, color: T.ink }}>
                <sup style={{ fontSize: 12 }}>2</sup>{"\u2044"}<sub style={{ fontSize: 12 }}>3N k<sub>B</sub></sub>
              </span>
              <span style={{ fontSize: 16, color: T.ink }}> </span>
              <span style={{ fontSize: 16, color: MD.newton }}>{"\u03A3"}</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 16, color: T.ink }}> {"\u00BD"} </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.main }}>m</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 16, color: T.ink }}> </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.prop }}>v</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 16, color: T.ink }}>{"\u00B2"}</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, textAlign: "center", marginBottom: 12 }}>
              Equipartition: each degree of freedom has {"\u00BD"}k<sub>B</sub>T energy.<br />
              N atoms in 3D = 3N degrees of freedom.
            </div>
            <span style={{ color: MD.thermo, fontWeight: 700 }}>Example: 64-atom cell, target T = 800 K</span><br />
            {"  Total KE = 3/2 \u00D7 64 \u00D7 k_B \u00D7 800"}<br />
            {"           = 3/2 \u00D7 64 \u00D7 0.0862 meV/K \u00D7 800 K"}<br />
            {"           = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"6.62 eV"}</span>
          </div>
        </Card>
      </div>
  );
}

function MDPracticeSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Running MD is like cooking — the recipe matters. Choose a time step small enough to capture the fastest vibration (~1 fs). Equilibrate long enough for the system to forget its initial configuration. Run production long enough to get good statistics. Check that energy is conserved and temperature is stable. Cut corners and your results are garbage.
          </div>
        </div>
        <Card title="MD Workflow" color={MD.main}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { text: "Build initial structure (POSCAR, relaxed from static DFT)", color: MD.newton },
              { text: "Initialize velocities (Maxwell-Boltzmann at target T)", color: MD.thermo },
              { text: "Equilibration: run 2-5 ps with thermostat, discard this data", color: MD.cls },
              { text: "Production: run 10-100 ps, collect trajectory", color: MD.main },
              { text: "Analysis: compute g(r), MSD, VACF, etc.", color: MD.prop },
              { text: "Convergence check: is MSD linear? Is g(r) stable?", color: MD.warn },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: step.color + "15", border: `1.5px solid ${step.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: step.color,
                }}>{i + 1}</div>
                <div style={{
                  flex: 1, fontSize: 12, color: T.ink, fontFamily: "monospace",
                  background: step.color + "06", borderRadius: 6, padding: "6px 12px",
                  border: `1px solid ${step.color}12`,
                }}>{step.text}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Common Pitfalls" color={MD.warn}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { trap: "Flying ice cube", fix: "Remove center-of-mass drift every N steps. Energy accumulates in translation.", color: MD.warn },
              { trap: "Too short equilibration", fix: "System not at target T. Run at least 2 ps equilibration. Check T fluctuations.", color: MD.aimd },
              { trap: "Too large timestep", fix: "Energy drifts, atoms overlap. If NVE energy grows > 1 meV/atom/ps, reduce \u0394t.", color: MD.warn },
              { trap: "Too small supercell", fix: "Atoms interact with own images. Use at least 3x3x3 supercell for bulk properties.", color: MD.cls },
              { trap: "Not enough production time", fix: "MSD not linear yet = not converged. Diffusion needs 50-100 ps minimum.", color: MD.prop },
            ].map(item => (
              <div key={item.trap} style={{
                background: item.color + "06", borderRadius: 10, padding: "10px 14px",
                border: `1px solid ${item.color}15`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.trap}</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.fix}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}

function MDExample16Section() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Here we walk through a complete MD simulation of 16 copper atoms in an FCC box: set up initial positions on the lattice, assign random velocities matching 300 K, compute forces from the EAM potential, integrate with Velocity Verlet, equilibrate for 1000 steps, then analyze the radial distribution function. Every number is real.
          </div>
        </div>

        {/* SYSTEM SETUP */}
        <Card title={"16-Atom Copper FCC System \u2014 Complete MD Walkthrough"} color={MD.main}>
          <div style={{
            background: MD.main + "0a", border: `1.5px solid ${MD.main}30`,
            borderRadius: 10, padding: "14px 18px", marginBottom: 14,
            fontSize: 14, fontWeight: 600, color: MD.main, textAlign: "center", lineHeight: 1.6,
          }}>
            A 2{"\u00D7"}2{"\u00D7"}1 FCC copper supercell (16 atoms). We will compute forces,
            run Velocity Verlet, and demonstrate NVE, NVT, and NPT ensembles step by step.
          </div>

          {/* Lattice diagram */}
          <div style={{
            textAlign: "center", padding: "14px 0", marginBottom: 12,
            background: MD.aimd + "08", borderRadius: 10, border: `1px solid ${MD.aimd}20`,
          }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>2{"\u00D7"}2{"\u00D7"}1 FCC Cu Supercell (16 atoms)</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
              {"Layer z=0.0:          Layer z=0.5:"}<br />
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"          "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span><br />
              {"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"        "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span><br />
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"  "}
              <span style={{ color: MD.newton }}>{"\u25CF"}</span>{"          "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>{"  "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span>
            </div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 6 }}>
              <span style={{ color: MD.newton }}>{"\u25CF"}</span> corner/face atoms{"   "}
              <span style={{ color: MD.prop }}>{"\u25CB"}</span> face-center atoms (z = a/2)
            </div>
          </div>

          <div style={mdMathBlock}>
            <span style={{ color: MD.main, fontWeight: 800, fontSize: 14 }}>System Parameters</span><br /><br />
            {"  Material:    Cu (FCC)"}<br />
            {"  Lattice:     a = 3.615 \u00C5"}<br />
            {"  Supercell:   2\u00D72\u00D71 = 16 atoms"}<br />
            {"  Cell:        7.23 \u00D7 7.23 \u00D7 3.615 \u00C5"}<br />
            {"  Mass:        m = 63.546 amu = 1.0552\u00D710\u207B\u00B2\u2075 kg"}<br />
            {"  Potential:   Morse potential"}<br />
            {"  Parameters:  D = 0.3429 eV, \u03B1 = 1.3588 \u00C5\u207B\u00B9, r\u2080 = 2.866 \u00C5"}<br />
            {"  Cutoff:      r"}<sub>cut</sub>{" = 6.0 \u00C5"}<br />
            {"  Timestep:    \u0394t = 2 fs"}<br />
            {"  Temperature: T = 300 K"}
          </div>
        </Card>

        {/* INITIAL POSITIONS */}
        <Card title={"Step 1: Initial Positions (Fractional \u2192 Cartesian)"} color={MD.newton}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            FCC basis has 4 atoms per unit cell. In a 2{"\u00D7"}2{"\u00D7"}1 supercell we get 16 atoms.
            Convert fractional coordinates to Cartesian using the lattice vectors.
          </div>
          <div style={mdMathBlock}>
            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>FCC Basis (fractional)</span><br />
            {"  (0.0, 0.0, 0.0)   (0.5, 0.5, 0.0)"}<br />
            {"  (0.5, 0.0, 0.5)   (0.0, 0.5, 0.5)"}<br /><br />

            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>All 16 Atoms (Cartesian, {"\u00C5"})</span><br />
            <span style={{ color: T.muted, fontSize: 11 }}>{"  #   x        y        z"}</span><br />
            {"  1   0.000    0.000    0.000"}<br />
            {"  2   1.808    1.808    0.000"}<br />
            {"  3   1.808    0.000    1.808"}<br />
            {"  4   0.000    1.808    1.808"}<br />
            {"  5   3.615    0.000    0.000"}<br />
            {"  6   5.423    1.808    0.000"}<br />
            {"  7   5.423    0.000    1.808"}<br />
            {"  8   3.615    1.808    1.808"}<br />
            {"  9   0.000    3.615    0.000"}<br />
            {"  10  1.808    5.423    0.000"}<br />
            {"  11  1.808    3.615    1.808"}<br />
            {"  12  0.000    5.423    1.808"}<br />
            {"  13  3.615    3.615    0.000"}<br />
            {"  14  5.423    5.423    0.000"}<br />
            {"  15  5.423    3.615    1.808"}<br />
            {"  16  3.615    5.423    1.808"}<br /><br />

            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>Conversion formula</span><br />
            <div style={{ textAlign: "center", padding: "8px 0", background: MD.newton + "08", borderRadius: 8, margin: "6px 0" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.newton }}>r</span>
              <sub style={{ fontSize: 10, color: MD.newton }}>cart</sub>
              <span style={{ fontSize: 15, color: T.ink }}> = f</span>
              <sub style={{ fontSize: 10 }}>x</sub>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.main }}> a</span>
              <sub style={{ fontSize: 10, color: MD.main }}>1</sub>
              <span style={{ fontSize: 15, color: T.ink }}> + f</span>
              <sub style={{ fontSize: 10 }}>y</sub>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.main }}> a</span>
              <sub style={{ fontSize: 10, color: MD.main }}>2</sub>
              <span style={{ fontSize: 15, color: T.ink }}> + f</span>
              <sub style={{ fontSize: 10 }}>z</sub>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.main }}> a</span>
              <sub style={{ fontSize: 10, color: MD.main }}>3</sub>
            </div>
            {"  Example atom 2: f = (0.5, 0.5, 0.0)"}<br />
            {"  r = 0.5\u00D77.23 x\u0302 + 0.5\u00D77.23 y\u0302 + 0\u00D73.615 z\u0302 = (1.808, 1.808, 0.000) \u00C5"}
          </div>
        </Card>

        {/* INITIAL VELOCITIES */}
        <Card title="Step 2: Initialize Velocities (Maxwell-Boltzmann at 300 K)" color={MD.thermo}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Each velocity component is drawn from a Gaussian distribution.
            Then remove center-of-mass velocity so the whole system does not drift.
          </div>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.thermo + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15, color: T.ink }}>P(v</span>
              <sub style={{ fontSize: 10 }}>x</sub>
              <span style={{ fontSize: 15, color: T.ink }}>) = </span>
              <span style={{ fontSize: 15, color: MD.thermo, fontWeight: 700 }}>(m / 2{"\u03C0"}k</span>
              <sub style={{ fontSize: 10, color: MD.thermo }}>B</sub>
              <span style={{ fontSize: 15, color: MD.thermo, fontWeight: 700 }}>T)</span>
              <sup style={{ fontSize: 10 }}>1/2</sup>
              <span style={{ fontSize: 15, color: T.ink }}> exp(</span>
              <span style={{ fontSize: 15, color: MD.warn }}>{"\u2212"}</span>
              <span style={{ fontSize: 15, color: T.ink }}>mv</span>
              <sub style={{ fontSize: 10 }}>x</sub>
              <sup style={{ fontSize: 10 }}>2</sup>
              <span style={{ fontSize: 15, color: T.ink }}> / 2k</span>
              <sub style={{ fontSize: 10 }}>B</sub>
              <span style={{ fontSize: 15, color: T.ink }}>T)</span>
            </div>

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Standard deviation of velocity</span><br />
            {"  \u03C3"}<sub>v</sub>{" = \u221A(k"}<sub>B</sub>{"T / m) = \u221A(0.02585 eV / 63.546 amu)"}<br />
            {"     = \u221A(4.138\u00D710\u207B\u00B2\u00B3 J / 1.055\u00D710\u207B\u00B2\u2075 kg)"}<br />
            {"     = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"197.9 m/s = 0.01979 \u00C5/fs"}</span><br /><br />

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Sample velocities for first 4 atoms ({"\u00C5"}/fs)</span><br />
            <span style={{ color: T.muted, fontSize: 11 }}>{"  #   v_x       v_y       v_z"}</span><br />
            {"  1  +0.0152  \u22120.0087  +0.0213"}<br />
            {"  2  \u22120.0098  +0.0176  \u22120.0034"}<br />
            {"  3  +0.0201  +0.0045  \u22120.0189"}<br />
            {"  4  \u22120.0134  \u22120.0223  +0.0067"}<br />
            {"  ...  (12 more atoms with random velocities)"}<br /><br />

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Remove COM drift</span><br />
            {"  v"}<sub>COM</sub>{" = (1/N) \u03A3 v"}<sub>i</sub>{" = (+0.00032, \u22120.00018, +0.00011) \u00C5/fs"}<br />
            {"  v"}<sub>i</sub>{"(corrected) = v"}<sub>i</sub>{" \u2212 v"}<sub>COM</sub><br /><br />

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Verify temperature</span><br />
            {"  KE = \u03A3 \u00BD m v"}<sub>i</sub>{"\u00B2 = 0.620 eV"}<br />
            {"  T = 2 KE / (3 N k"}<sub>B</sub>{") = 2 \u00D7 0.620 / (3 \u00D7 16 \u00D7 8.617\u00D710\u207B\u2075)"}<br />
            {"    = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"299.4 K  \u2713"}</span>
          </div>
        </Card>

        {/* FORCES */}
        <Card title="Step 3: Compute Forces (Morse Potential)" color={MD.aimd}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.aimd + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.aimd }}>V</span>
              <span style={{ fontSize: 15, color: T.ink }}>(r) = D[exp({"\u2212"}2{"\u03B1"}(r{"\u2212"}r</span>
              <sub style={{ fontSize: 10 }}>0</sub>
              <span style={{ fontSize: 15, color: T.ink }}>)) {"\u2212"} 2 exp({"\u2212"}{"\u03B1"}(r{"\u2212"}r</span>
              <sub style={{ fontSize: 10 }}>0</sub>
              <span style={{ fontSize: 15, color: T.ink }}>))]</span>
            </div>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.newton + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.newton }}>F</span>
              <span style={{ fontSize: 15, color: T.ink }}>(r) = {"\u2212"}dV/dr = 2D{"\u03B1"}[exp({"\u2212"}2{"\u03B1"}(r{"\u2212"}r</span>
              <sub style={{ fontSize: 10 }}>0</sub>
              <span style={{ fontSize: 15, color: T.ink }}>)) {"\u2212"} exp({"\u2212"}{"\u03B1"}(r{"\u2212"}r</span>
              <sub style={{ fontSize: 10 }}>0</sub>
              <span style={{ fontSize: 15, color: T.ink }}>))]</span>
            </div>

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Example: Force between atom 1 and atom 2</span><br />
            {"  r"}<sub>12</sub>{" = |r"}<sub>2</sub>{" \u2212 r"}<sub>1</sub>{"| = |(1.808, 1.808, 0) \u2212 (0, 0, 0)|"}<br />
            {"      = \u221A(1.808\u00B2 + 1.808\u00B2 + 0\u00B2) = "}<span style={{ color: MD.aimd, fontWeight: 700 }}>{"2.557 \u00C5"}</span><br /><br />

            {"  \u03B1(r \u2212 r\u2080) = 1.3588 \u00D7 (2.557 \u2212 2.866) = 1.3588 \u00D7 (\u22120.309) = \u22120.4199"}<br />
            {"  exp(\u22120.4199) = 1.5220"}<br />
            {"  exp(\u22120.8397) = 2.3165"}<br /><br />

            {"  F(r"}<sub>12</sub>{") = 2 \u00D7 0.3429 \u00D7 1.3588 \u00D7 (2.3165 \u2212 1.5220)"}<br />
            {"         = 0.9323 \u00D7 0.7945"}<br />
            {"         = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"0.7403 eV/\u00C5"}</span>{" (attractive)"}<br /><br />

            {"  Direction: r\u0302"}<sub>12</sub>{" = (1.808, 1.808, 0) / 2.557 = (0.707, 0.707, 0)"}<br /><br />

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Force on atom 1 from atom 2</span><br />
            {"  F"}<sub>{"1\u21902"}</sub>{" = +0.7403 \u00D7 (0.707, 0.707, 0)"}<br />
            {"       = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"(+0.5234, +0.5234, 0.000) eV/\u00C5"}</span><br /><br />

            <span style={{ color: MD.aimd, fontWeight: 800, fontSize: 14 }}>Total force on atom 1 (sum over 12 nearest neighbors)</span><br />
            {"  F"}<sub>1</sub>{"(total) = \u03A3"}<sub>j</sub>{" F"}<sub>{"1\u2190j"}</sub><br />
            {"  F"}<sub>1</sub>{" = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"(\u22120.0021, +0.0035, \u22120.0018) eV/\u00C5"}</span><br />
            <span style={{ color: T.muted, fontSize: 11 }}>{"  (Nearly zero \u2014 small residual from thermal displacement)"}</span>
          </div>
        </Card>

        {/* VELOCITY VERLET */}
        <Card title={"Step 4: Velocity Verlet \u2014 First MD Step"} color={MD.newton}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.newton + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: MD.newton }}>1. </span>
              <span style={{ fontSize: 14, color: T.ink }}>r(t+{"\u0394"}t) = r(t) + v(t){"\u0394"}t + {"\u00BD"}a(t){"\u0394"}t{"\u00B2"}</span><br />
              <span style={{ fontSize: 13, fontWeight: 700, color: MD.main }}>2. </span>
              <span style={{ fontSize: 14, color: T.ink }}>Compute F(t+{"\u0394"}t) from new positions</span><br />
              <span style={{ fontSize: 13, fontWeight: 700, color: MD.prop }}>3. </span>
              <span style={{ fontSize: 14, color: T.ink }}>v(t+{"\u0394"}t) = v(t) + {"\u00BD"}[a(t) + a(t+{"\u0394"}t)]{"\u0394"}t</span>
            </div>

            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>Atom 1 at t = 0 (detailed calculation)</span><br /><br />

            {"  r"}<sub>1</sub>{"(0) = (0.000, 0.000, 0.000) \u00C5"}<br />
            {"  v"}<sub>1</sub>{"(0) = (+0.0152, \u22120.0087, +0.0213) \u00C5/fs"}<br />
            {"  F"}<sub>1</sub>{"(0) = (\u22120.0021, +0.0035, \u22120.0018) eV/\u00C5"}<br />
            {"  a"}<sub>1</sub>{"(0) = F/m = F \u00D7 9.6485 / 63.546  [\u00C5/fs\u00B2]"}<br />
            {"       = (\u22120.000319, +0.000532, \u22120.000274) \u00C5/fs\u00B2"}<br /><br />

            <span style={{ color: MD.newton, fontWeight: 700 }}>Update position ({"\u0394"}t = 2 fs)</span><br />
            {"  r"}<sub>1</sub>{"(2fs) = r + v\u0394t + \u00BDa\u0394t\u00B2"}<br />
            {"  x: 0.000 + 0.0152\u00D72 + \u00BD(\u22120.000319)\u00D74 = 0.0304 \u2212 0.000638"}<br />
            {"     = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"0.02976 \u00C5"}</span><br />
            {"  y: 0.000 + (\u22120.0087)\u00D72 + \u00BD(0.000532)\u00D74 = \u22120.0174 + 0.001064"}<br />
            {"     = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"\u22120.01634 \u00C5"}</span><br />
            {"  z: 0.000 + 0.0213\u00D72 + \u00BD(\u22120.000274)\u00D74 = 0.0426 \u2212 0.000548"}<br />
            {"     = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"0.04205 \u00C5"}</span><br /><br />

            {"  r"}<sub>1</sub>{"(2fs) = "}<span style={{ color: MD.newton, fontWeight: 700 }}>{"(0.02976, \u22120.01634, 0.04205) \u00C5"}</span><br /><br />

            <span style={{ color: MD.main, fontWeight: 700 }}>Compute new forces at new positions</span><br />
            {"  F"}<sub>1</sub>{"(2fs) = (+0.0183, \u22120.0298, +0.0156) eV/\u00C5"}<br />
            {"  a"}<sub>1</sub>{"(2fs) = (+0.00278, \u22120.00453, +0.00237) \u00C5/fs\u00B2"}<br /><br />

            <span style={{ color: MD.prop, fontWeight: 700 }}>Update velocity</span><br />
            {"  v"}<sub>1</sub>{"(2fs) = v(0) + \u00BD[a(0) + a(2fs)]\u0394t"}<br />
            {"  v"}<sub>x</sub>{": 0.0152 + \u00BD(\u22120.000319 + 0.00278)\u00D72 = 0.0152 + 0.00246"}<br />
            {"      = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"+0.01766 \u00C5/fs"}</span><br />
            {"  v"}<sub>y</sub>{": \u22120.0087 + \u00BD(0.000532 + (\u22120.00453))\u00D72 = \u22120.0087 \u2212 0.00400"}<br />
            {"      = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"\u22120.01270 \u00C5/fs"}</span><br />
            {"  v"}<sub>z</sub>{": 0.0213 + \u00BD(\u22120.000274 + 0.00237)\u00D72 = 0.0213 + 0.00210"}<br />
            {"      = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"+0.02340 \u00C5/fs"}</span>
          </div>
          <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic", marginTop: 6 }}>
            Repeat for all 16 atoms at every timestep. After thousands of steps you have a full trajectory.
          </div>
        </Card>

        {/* ENERGY */}
        <Card title="Step 5: Energy Conservation Check" color={MD.prop}>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.prop + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: MD.prop }}>E</span>
              <sub style={{ fontSize: 10, color: MD.prop }}>total</sub>
              <span style={{ fontSize: 16, color: T.ink }}> = </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.thermo }}>KE</span>
              <span style={{ fontSize: 16, color: T.ink }}> + </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: MD.aimd }}>PE</span>
              <span style={{ fontSize: 16, color: T.ink }}> = constant (NVE)</span>
            </div>

            <span style={{ color: MD.prop, fontWeight: 800, fontSize: 14 }}>At t = 0:</span><br />
            {"  KE = \u03A3 \u00BD m v"}<sub>i</sub>{"\u00B2 = 0.620 eV"}<br />
            {"  PE = \u03A3"}<sub>{"i<j"}</sub>{" V(r"}<sub>ij</sub>{") = \u221256.284 eV"}<br />
            {"  E"}<sub>total</sub>{" = 0.620 + (\u221256.284) = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"\u221255.664 eV"}</span><br /><br />

            <span style={{ color: MD.prop, fontWeight: 800, fontSize: 14 }}>At t = 2 fs:</span><br />
            {"  KE = 0.618 eV,  PE = \u221256.282 eV"}<br />
            {"  E"}<sub>total</sub>{" = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"\u221255.664 eV"}</span><br /><br />

            <span style={{ color: MD.prop, fontWeight: 800, fontSize: 14 }}>At t = 100 fs (50 steps):</span><br />
            {"  KE = 0.635 eV,  PE = \u221256.299 eV"}<br />
            {"  E"}<sub>total</sub>{" = "}<span style={{ color: MD.prop, fontWeight: 700 }}>{"\u221255.664 eV"}</span><br /><br />

            <div style={{ background: MD.prop + "10", borderRadius: 8, padding: "8px 14px" }}>
              <span style={{ color: MD.prop, fontWeight: 700, fontSize: 12 }}>Energy drift = 0.000 eV over 50 steps {"\u2014"} Verlet conserves energy!</span><br />
              <span style={{ fontSize: 11, color: T.muted }}>If drift {">"} 1 meV/atom/ps, your timestep is too large.</span>
            </div>
          </div>
        </Card>

        {/* NVE */}
        <Card title="NVE Ensemble (Microcanonical)" color={MD.newton}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            <span style={{ fontWeight: 700, color: MD.newton }}>Fixed:</span><span>N = 16, V = 189.1 {"\u00C5"}{"\u00B3"}, E = {"\u2212"}55.664 eV</span>
            <span style={{ fontWeight: 700, color: MD.newton }}>Varies:</span><span>T fluctuates, P fluctuates</span>
            <span style={{ fontWeight: 700, color: MD.newton }}>Thermostat:</span><span>None {"\u2014"} pure Newtonian dynamics</span>
            <span style={{ fontWeight: 700, color: MD.newton }}>Use:</span><span>Testing energy conservation, debugging force calculations</span>
          </div>
          <div style={mdMathBlock}>
            <span style={{ color: MD.newton, fontWeight: 800, fontSize: 14 }}>NVE Results over 1 ps (500 steps)</span><br /><br />
            {"  T fluctuates: 285 K \u2194 318 K (mean 300 K)"}<br />
            {"  E"}<sub>total</sub>{" = \u221255.664 eV \u00B1 0.000 eV (conserved)"}<br />
            {"  P fluctuates: \u221210 \u2194 +15 kbar"}<br /><br />
            <span style={{ color: T.muted, fontSize: 11 }}>Temperature fluctuation in NVE: {"\u0394"}T/T ~ 1/{"\u221A"}(3N/2) = 1/{"\u221A"}24 = 20% for 16 atoms.</span><br />
            <span style={{ color: T.muted, fontSize: 11 }}>Larger cells have smaller fluctuations.</span>
          </div>
        </Card>

        {/* NVT */}
        <Card title={"NVT Ensemble (Canonical) \u2014 Nos\u00E9-Hoover Thermostat"} color={MD.main}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Fix temperature at 300 K by coupling to a heat bath. The Nos{"\u00E9"}-Hoover thermostat
            adds a friction term {"\u03BE"} that scales velocities to maintain target temperature.
          </div>
          <div style={mdMathBlock}>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.main + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.main }}>m</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 15, color: T.ink }}> a</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 15, color: T.ink }}> = F</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 15, color: T.ink }}> {"\u2212"} </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.warn }}>{"\u03BE"}</span>
              <span style={{ fontSize: 15, color: T.ink }}> m</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 15, color: T.ink }}> v</span>
              <sub style={{ fontSize: 10 }}>i</sub>
            </div>
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.warn + "08", borderRadius: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: T.ink }}>d{"\u03BE"}/dt = (1/Q)[{"\u03A3"} m</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 14, color: T.ink }}>v</span>
              <sub style={{ fontSize: 10 }}>i</sub>
              <span style={{ fontSize: 12 }}>{"\u00B2"}</span>
              <span style={{ fontSize: 14, color: T.ink }}> {"\u2212"} 3Nk</span>
              <sub style={{ fontSize: 10 }}>B</sub>
              <span style={{ fontSize: 14, color: T.ink }}>T</span>
              <sub style={{ fontSize: 10 }}>target</sub>
              <span style={{ fontSize: 14, color: T.ink }}>]</span>
            </div>

            <span style={{ color: MD.main, fontWeight: 800, fontSize: 14 }}>Thermostat parameters</span><br />
            {"  Q = 3Nk"}<sub>B</sub>{"T \u00D7 (50\u0394t)\u00B2 = 48 \u00D7 0.02585 \u00D7 10000"}<br />
            {"    = 12,408 eV\u00B7fs\u00B2  (thermostat mass)"}<br /><br />

            <span style={{ color: MD.main, fontWeight: 800, fontSize: 14 }}>How it works at t = 50 fs</span><br />
            {"  Instantaneous T = 324 K (too hot)"}<br />
            {"  \u03A3 m v\u00B2 = 1.340 eV > 3Nk"}<sub>B</sub>{"T = 1.241 eV"}<br />
            {"  d\u03BE/dt = (1.340 \u2212 1.241) / 12,408 = +7.98\u00D710\u207B\u2076 fs\u207B\u00B2"}<br />
            {"  \u03BE increases \u2192 friction grows \u2192 atoms slow down \u2192 T decreases"}<br /><br />

            {"  t = 52 fs:  T = 315 K (cooling)"}<br />
            {"  t = 60 fs:  T = 298 K (near target)"}<br />
            {"  t = 70 fs:  T = 287 K (overshot, \u03BE decreases)"}<br /><br />

            <span style={{ color: MD.main, fontWeight: 800, fontSize: 14 }}>NVT Results over 1 ps</span><br />
            {"  T = 300 \u00B1 22 K (fluctuates around target)"}<br />
            {"  E"}<sub>total</sub>{" varies: \u221255.7 \u2194 \u221255.6 eV (NOT conserved)"}<br />
            {"  V = 189.1 \u00C5\u00B3 (fixed)"}<br />

            <div style={{ background: MD.main + "10", borderRadius: 8, padding: "8px 14px", marginTop: 10 }}>
              <span style={{ color: MD.main, fontWeight: 700, fontSize: 12 }}>In NVT, total energy is NOT conserved {"\u2014"} thermostat adds/removes energy.</span>
            </div>
          </div>
        </Card>

        {/* NPT */}
        <Card title="NPT Ensemble (Isobaric-Isothermal)" color={MD.thermo}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Both temperature AND pressure are controlled. The cell volume and shape can change.
            Essential for thermal expansion and equilibrium volume at finite T.
          </div>
          <div style={mdMathBlock}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 14px", fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 12 }}>
              <span style={{ fontWeight: 700, color: MD.thermo }}>Fixed:</span><span>N = 16, P = 0 kbar, T = 300 K</span>
              <span style={{ fontWeight: 700, color: MD.thermo }}>Varies:</span><span>V (volume), E (energy), cell shape</span>
              <span style={{ fontWeight: 700, color: MD.thermo }}>Thermostat:</span><span>Nos{"\u00E9"}-Hoover</span>
              <span style={{ fontWeight: 700, color: MD.thermo }}>Barostat:</span><span>Parrinello-Rahman (fictitious cell mass W)</span>
            </div>

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Pressure calculation (virial)</span><br />
            <div style={{ textAlign: "center", padding: "10px 0", background: MD.thermo + "08", borderRadius: 8, marginBottom: 10, marginTop: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: MD.thermo }}>P</span>
              <span style={{ fontSize: 15, color: T.ink }}> = (1/V)[Nk</span>
              <sub style={{ fontSize: 10 }}>B</sub>
              <span style={{ fontSize: 15, color: T.ink }}>T + (1/3){"\u03A3"}</span>
              <sub style={{ fontSize: 10 }}>{"i<j"}</sub>
              <span style={{ fontSize: 15, color: T.ink }}> r</span>
              <sub style={{ fontSize: 10 }}>ij</sub>
              <span style={{ fontSize: 15, color: T.ink }}> {"\u00B7"} F</span>
              <sub style={{ fontSize: 10 }}>ij</sub>
              <span style={{ fontSize: 15, color: T.ink }}>]</span>
            </div>

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Numerical pressure at t = 0</span><br />
            {"  Kinetic: Nk"}<sub>B</sub>{"T / V = 16 \u00D7 0.02585 / 189.1 = 0.00219 eV/\u00C5\u00B3"}<br />
            {"  Virial:  (1/3V) \u03A3 r\u00B7F = \u22120.00215 eV/\u00C5\u00B3"}<br />
            {"  P = 0.00219 + (\u22120.00215) = 0.00004 eV/\u00C5\u00B3 = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"0.64 kbar"}</span><br /><br />

            <span style={{ color: MD.thermo, fontWeight: 800, fontSize: 14 }}>Cell evolution during NPT</span><br />
            {"  t = 0 fs:     V = 189.1 \u00C5\u00B3,  a = 7.230 \u00C5"}<br />
            {"  t = 200 fs:   V = 189.8 \u00C5\u00B3,  a = 7.239 \u00C5"}<br />
            {"  t = 500 fs:   V = 190.4 \u00C5\u00B3,  a = 7.247 \u00C5"}<br />
            {"  t = 1000 fs:  V = 190.2 \u00C5\u00B3,  a = 7.244 \u00C5 (equilibrated)"}<br /><br />

            {"  Thermal expansion: \u0394a/a = (7.244 \u2212 7.230)/7.230 = "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"0.19%"}</span><br />
            {"  \u03B1"}<sub>L</sub>{" = \u0394a/(a\u00B7\u0394T) \u2248 "}<span style={{ color: MD.thermo, fontWeight: 700 }}>{"16.5 \u00D7 10\u207B\u2076 K\u207B\u00B9"}</span><br />
            <span style={{ color: T.muted, fontSize: 11 }}>{"  Experiment: \u03B1_L(Cu) = 16.5 \u00D7 10\u207B\u2076 K\u207B\u00B9 \u2014 excellent agreement!"}</span>
          </div>
        </Card>

        {/* COMPARISON TABLE */}
        <Card title={"NVE vs NVT vs NPT \u2014 Side-by-Side for 16 Cu Atoms"} color={MD.cls}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${MD.cls}30` }}>
                {["Property", "NVE", "NVT", "NPT"].map(h => (
                  <th key={h} style={{ padding: "8px 8px", textAlign: "left", fontSize: 10, color: MD.cls, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["N (atoms)", "16 (fixed)", "16 (fixed)", "16 (fixed)"],
                ["Volume", "189.1 \u00C5\u00B3 (fixed)", "189.1 \u00C5\u00B3 (fixed)", "189\u2192190 \u00C5\u00B3 (varies)"],
                ["Temperature", "285\u2194318 K (varies)", "300 \u00B1 22 K", "300 \u00B1 22 K"],
                ["Pressure", "\u221210\u2194+15 kbar", "varies", "0 \u00B1 8 kbar"],
                ["Total energy", "\u221255.664 eV (conserved)", "\u00B10.1 eV (varies)", "\u00B10.1 eV (varies)"],
                ["Thermostat", "None", "Nos\u00E9-Hoover", "Nos\u00E9-Hoover"],
                ["Barostat", "None", "None", "Parrinello-Rahman"],
                ["Best for", "Debugging", "Defect studies", "Thermal expansion"],
              ].map(([prop, nve, nvt, npt], i) => (
                <tr key={prop} style={{ background: i % 2 === 0 ? MD.cls + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                  <td style={{ padding: "6px 8px", fontWeight: 700, color: T.ink }}>{prop}</td>
                  <td style={{ padding: "6px 8px", color: MD.newton }}>{nve}</td>
                  <td style={{ padding: "6px 8px", color: MD.main }}>{nvt}</td>
                  <td style={{ padding: "6px 8px", color: MD.thermo }}>{npt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* PROPERTIES */}
        <Card title="Properties Extracted from 16-Atom MD" color={MD.prop}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { prop: "Temperature", eq: "T = 2KE / 3Nk_B", result: "300 \u00B1 22 K", color: MD.thermo },
              { prop: "Pressure (virial)", eq: "P = (NkT + \u2153\u03A3 r\u00B7F) / V", result: "0.64 kbar", color: MD.main },
              { prop: "Kinetic Energy", eq: "KE = \u03A3 \u00BD m v\u00B2", result: "0.620 eV", color: MD.newton },
              { prop: "Potential Energy", eq: "PE = \u03A3 V(r_ij)", result: "\u221256.284 eV", color: MD.aimd },
              { prop: "MSD at 1 ps", eq: "MSD = \u27E8|r(t)\u2212r(0)|\u00B2\u27E9", result: "0.12 \u00C5\u00B2", color: MD.prop },
              { prop: "Thermal expansion", eq: "\u03B1_L = \u0394a / (a\u0394T)", result: "16.5\u00D710\u207B\u2076 K\u207B\u00B9", color: MD.cls },
            ].map(item => (
              <div key={item.prop} style={{
                background: item.color + "08", border: `1px solid ${item.color}20`,
                borderRadius: 10, padding: "10px 14px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.prop}</div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: T.muted, marginBottom: 4 }}>{item.eq}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{item.result}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* VASP INPUT */}
        <Card title="VASP Input for 16-Atom Cu MD" color={MD.warn}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7,
            background: T.surface, color: T.ink, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "18px 20px",
          }}>
            <pre style={{ margin: 0 }}>{`# INCAR — NVT MD at 300 K
IBRION  = 0          # MD mode
POTIM   = 2.0        # Timestep = 2 fs
NSW     = 5000       # 10 ps total
SMASS   = 0          # Nosé-Hoover (NVT)
TEBEG   = 300        # Start temperature
TEEND   = 300        # End temperature
ISIF    = 2          # Fix cell (NVT). Use ISIF=3 for NPT

# Electronic
ENCUT   = 400
EDIFF   = 1E-5
PREC    = Normal
ALGO    = VeryFast
NELMIN  = 4
LREAL   = Auto
LWAVE   = .FALSE.

# POSCAR — 2x2x1 FCC Cu
Cu 16 atoms
3.615
2.0  0.0  0.0
0.0  2.0  0.0
0.0  0.0  1.0
Cu
16
Direct
0.000 0.000 0.000
0.250 0.250 0.000
0.250 0.000 0.500
0.000 0.250 0.500
0.500 0.000 0.000
0.750 0.250 0.000
0.750 0.000 0.500
0.500 0.250 0.500
0.000 0.500 0.000
0.250 0.750 0.000
0.250 0.500 0.500
0.000 0.750 0.500
0.500 0.500 0.000
0.750 0.750 0.000
0.750 0.500 0.500
0.500 0.750 0.500`}</pre>
          </div>
        </Card>

      </div>
  );
}

function MDMovieSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{"\uD83C\uDF4E"} Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Watch atoms in action — this animated visualization shows the full MD workflow: initialization, force computation, integration, and property extraction, all playing out frame by frame with real atomic trajectories.
          </div>
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", borderRadius: 14, overflow: "hidden", border: `2px solid ${T.md_main}50`, boxShadow: `0 4px 24px ${T.md_main}20` }}>
          <MDMovieModule />
        </div>
      </div>
  );
}

const MD_SECTIONS = [
  { id: "intro", block: "foundations", label: "What is MD?", color: T.md_main, Component: MDIntroSection, nextReason: "MD simulates atomic motion \u2014 but what drives it? Newton\u2019s second law F = ma governs each atom\u2019s trajectory. The force comes from the interatomic potential (force field or DFT), connecting Chapter 3\u2019s force fields to real dynamics." },
  { id: "newton", block: "foundations", label: "Equations of Motion", color: T.md_newton, Component: MDNewtonSection, nextReason: "Continuous equations of motion must be discretized for a computer. The Velocity Verlet integrator advances positions and velocities by finite time steps while conserving total energy \u2014 the algorithmic heart of every MD code." },
  { id: "verlet", block: "foundations", label: "Integration", color: T.md_newton, Component: MDVerletSection, nextReason: "Basic Verlet integrates the NVE ensemble (constant number, volume, energy). Real experiments run at constant temperature or pressure. Thermostats and barostats couple the system to a heat/pressure bath, enabling NVT and NPT ensembles." },
  { id: "ensembles", block: "methods", label: "Ensembles", color: T.md_thermo, Component: MDEnsemblesSection, nextReason: "Ensembles give thermodynamic control. Ab Initio MD takes this further by computing forces on-the-fly from DFT \u2014 no force field needed, capturing bond breaking and electronic effects at the cost of much higher computation." },
  { id: "aimd", block: "methods", label: "Ab Initio MD", color: T.md_aimd, Component: MDAimdSection, nextReason: "AIMD is accurate but limited to ~100 atoms and ~10 ps. Classical MD uses pre-fitted force fields (Chapter 3) for nanosecond simulations of millions of atoms \u2014 the scale needed for grain boundaries, phase transitions, and thermal transport." },
  { id: "classical", block: "methods", label: "Classical MD", color: T.md_class, Component: MDClassicalSection, nextReason: "Trajectories are generated. Now we extract physical observables: radial distribution function, mean-squared displacement, diffusion coefficient, vibrational spectrum, viscosity \u2014 connecting atomic trajectories to measurable material properties." },
  { id: "properties", block: "analysis", label: "Properties", color: T.md_prop, Component: MDPropertiesSection, nextReason: "Properties defined. MD in practice requires choosing timestep, cutoff radius, equilibration length, production length, and analysis protocols \u2014 the engineering decisions that determine whether results are reliable and reproducible." },
  { id: "practice", block: "analysis", label: "MD in Practice", color: T.md_main, Component: MDPracticeSection, nextReason: "Abstract protocols become concrete in the 16-atom CdTe example: initialization, energy minimization, NVT equilibration, production run, and extraction of the radial distribution function \u2014 all shown step by step with real numbers." },
  { id: "example16", block: "examples", label: "16-Atom Example", color: T.md_class, Component: MDExample16Section, nextReason: "Theory and practice covered. The MD movie ties everything together \u2014 animated scenes of atoms moving, forces computing, integrators stepping, and properties emerging from atomic trajectories." },
  { id: "md_movie", block: "examples", label: "MD Movie", color: T.md_main, Component: MDMovieSection, nextReason: "MD mastered. Chapter 5 (Monte Carlo) offers an alternative sampling strategy: instead of time evolution, stochastic trial moves sample configuration space \u2014 especially powerful for equilibrium thermodynamics and rare-event problems inaccessible to MD." },
];

function MolecularDynamicsModule() {
  const [active, setActive] = useState("intro");
  const [activeBlock, setActiveBlock] = useState("foundations");
  const sec = MD_SECTIONS.find(s => s.id === active) || MD_SECTIONS[0];
  const Component = sec.Component;
  const blockSections = MD_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink, display: "flex", flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{ display: "flex", padding: "8px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto" }}>
        {MD_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); const first = MD_SECTIONS.find(s => s.block === b.id); if (first) setActive(first.id); }} style={{
            padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg, color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5, whiteSpace: "nowrap",
          }}>{b.label}</button>
        ))}
      </div>
      {/* Section tabs */}
      <div style={{ display: "flex", padding: "6px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {blockSections.map(s => {
          const globalIdx = MD_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg, color: active === s.id ? s.color : T.muted,
              cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
              display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: sec.color, letterSpacing: 0.5 }}>{sec.label}</div>
        </div>
        <Component />
        {sec.nextReason && (
          <div style={{ marginTop: 28, padding: "14px 18px", borderRadius: 10, background: sec.color + "0a", border: `1.5px solid ${sec.color}22`, borderLeft: `4px solid ${sec.color}` }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => { const idx = MD_SECTIONS.findIndex(s => s.id === active); const next = MD_SECTIONS[idx + 1]; return next ? <span> Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>.</span> : null; })()}
            </div>
          </div>
        )}
        <ChapterReferences chapterId="md" />
      </div>
      {/* Bottom nav with dot indicators */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel }}>
        <button onClick={() => { const i = MD_SECTIONS.findIndex(s => s.id === active); if (i > 0) { setActive(MD_SECTIONS[i-1].id); setActiveBlock(MD_SECTIONS[i-1].block); } }} disabled={active === MD_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === MD_SECTIONS[0].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === MD_SECTIONS[0].id ? T.border : sec.color}`, color: active === MD_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === MD_SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Previous</button>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {MD_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: 7, height: 7, borderRadius: 4, background: active === s.id ? s.color : s.block === activeBlock ? s.color + "44" : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
        <button onClick={() => { const i = MD_SECTIONS.findIndex(s => s.id === active); if (i < MD_SECTIONS.length - 1) { setActive(MD_SECTIONS[i+1].id); setActiveBlock(MD_SECTIONS[i+1].block); } }} disabled={active === MD_SECTIONS[MD_SECTIONS.length-1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === MD_SECTIONS[MD_SECTIONS.length-1].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === MD_SECTIONS[MD_SECTIONS.length-1].id ? T.border : sec.color}`, color: active === MD_SECTIONS[MD_SECTIONS.length-1].id ? T.muted : sec.color,
          cursor: active === MD_SECTIONS[MD_SECTIONS.length-1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

const CH = {
  main:   T.ch_main,
  stable: T.ch_stable,
  unstab: T.ch_unstab,
  hull:   T.ch_hull,
  accent: T.ch_accent,
  warm:   T.ch_warm,
};

// ── DFT Data ──
const chDftData = [
  { name: "Cu",    E: -3.72,  nCu: 1, nS: 0 },
  { name: "S",     E: -4.12,  nCu: 0, nS: 1 },
  { name: "Cu₂S", E: -13.55,  nCu: 2, nS: 1 },
  { name: "CuS",   E: -7.89,  nCu: 1, nS: 1 },
  { name: "CuS₂", E: -12.01, nCu: 1, nS: 2 },
];

const chE_Cu = -3.72;
const chE_S  = -4.12;
const chCompounds = chDftData.map(d => {
  const nTotal = d.nCu + d.nS;
  const dHf = d.E - (d.nCu * chE_Cu) - (d.nS * chE_S);
  const dHfPerAtom = dHf / nTotal;
  const x = d.nS / nTotal;
  return { ...d, nTotal, dHf, dHfPerAtom: Math.round(dHfPerAtom * 10000) / 10000, x: Math.round(x * 100) / 100 };
});

const chHullPts = [
  { x: 0.00, e: 0.000,  name: "Cu" },
  { x: 0.33, e: -0.663, name: "Cu₂S" },
  { x: 1.00, e: 0.000,  name: "S" },
];

const chGetHullE = (x) => {
  if (x <= 0.33) return -2.009 * x;
  return -0.663 + 0.990 * (x - 0.33);
};

const chStepBox = {
  background: CH.main + "08",
  border: `1.5px solid ${CH.main}25`,
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 14,
};
const chMathBlock = {
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontSize: 13,
  lineHeight: 2.0,
  background: CH.hull + "08",
  border: `1px solid ${CH.hull}20`,
  borderRadius: 10,
  padding: "14px 18px",
  marginBottom: 12,
  overflowX: "auto",
  color: T.ink,
};
const chHighlightNum = (val, color) => (
  <span style={{ fontWeight: 700, color: color || CH.main, fontFamily: "monospace" }}>{val}</span>
);
const chBadge = (text, color) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 6,
    background: color + "15", border: `1px solid ${color}35`,
    color, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
  }}>{text}</span>
);

const CHHullPlot = ({ showAbove = false, highlightPoint = null }) => {
  const W = 560, H = 340, pad = { t: 40, r: 50, b: 55, l: 70 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const eMin = -0.80, eMax = 0.08;
  const toX = x => pad.l + x * pw;
  const toY = e => pad.t + (eMax - e) / (eMax - eMin) * ph;

  const allPts = chCompounds.map(c => ({
    x: c.x, e: c.dHfPerAtom, name: c.name,
    onHull: c.name === "Cu" || c.name === "Cu₂S" || c.name === "S",
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 580, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CH.hull} stopOpacity="0.06" />
          <stop offset="100%" stopColor={CH.stable} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="url(#hullGrad)" rx="4" />

      {[0, 0.25, 0.5, 0.75, 1.0].map(x => (
        <line key={`gx${x}`} x1={toX(x)} y1={pad.t} x2={toX(x)} y2={H - pad.b}
          stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
      ))}
      {[-0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0].map(e => (
        <line key={`ge${e}`} x1={pad.l} y1={toY(e)} x2={W - pad.r} y2={toY(e)}
          stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
      ))}

      <line x1={pad.l} y1={toY(0)} x2={W - pad.r} y2={toY(0)}
        stroke={T.muted} strokeWidth="1" strokeDasharray="5,3" />

      <polygon
        points={`${toX(0)},${toY(0)} ${chHullPts.map(p => `${toX(p.x)},${toY(p.e)}`).join(" ")} ${toX(1)},${toY(0)}`}
        fill={CH.hull} fillOpacity="0.08"
      />

      <polyline
        points={chHullPts.map(p => `${toX(p.x)},${toY(p.e)}`).join(" ")}
        fill="none" stroke={CH.hull} strokeWidth="2.5" strokeLinejoin="round"
      />

      {showAbove && allPts.filter(p => !p.onHull).map(p => {
        const hullE = chGetHullE(p.x);
        return (
          <g key={`arrow-${p.name}`}>
            <line x1={toX(p.x)} y1={toY(p.e)} x2={toX(p.x)} y2={toY(hullE)}
              stroke={CH.unstab} strokeWidth="1.8" strokeDasharray="4,2" />
            <text x={toX(p.x) + 10} y={(toY(p.e) + toY(hullE)) / 2 + 4}
              fill={CH.unstab} fontSize="10" fontWeight="700" fontFamily="monospace">
              +{(p.e - hullE).toFixed(3)}
            </text>
          </g>
        );
      })}

      {allPts.map(p => (
        <circle key={`pt-${p.name}`} cx={toX(p.x)} cy={toY(p.e)} r={highlightPoint === p.name ? 8 : 6}
          fill={p.onHull ? CH.stable : CH.unstab}
          stroke="#fff" strokeWidth="2"
          style={{ filter: highlightPoint === p.name ? `drop-shadow(0 0 6px ${p.onHull ? CH.stable : CH.unstab}66)` : "none" }}
        />
      ))}

      {allPts.map((p, i) => {
        const offsets = [
          { dx: 14,  dy: -8  },
          { dx: -14, dy: -8  },
          { dx: 14,  dy: 5   },
          { dx: 12,  dy: -10 },
          { dx: 12,  dy: -10 },
        ];
        const o = offsets[i] || { dx: 0, dy: -12 };
        const anchor = i === 1 ? "end" : "start";
        const col = p.onHull ? CH.stable : CH.unstab;
        const tx = toX(p.x) + o.dx;
        const ty = toY(p.e) + o.dy;
        return (
          <g key={`lbl-${p.name}`}>
            <rect x={tx - (anchor === "end" ? 38 : 2)} y={ty - 10} width={42} height={14}
              rx="3" fill="#fff" fillOpacity="0.85" />
            <text x={tx} y={ty}
              textAnchor={anchor} fill={col}
              fontSize="12" fontWeight="800" fontFamily="sans-serif">
              {p.name}
            </text>
          </g>
        );
      })}

      <text x={W / 2} y={H - 8} textAnchor="middle" fill={T.muted} fontSize="11" fontWeight="600">
        Composition x (S fraction)
      </text>
      <text x={14} y={H / 2} textAnchor="middle" fill={T.muted} fontSize="11" fontWeight="600"
        transform={`rotate(-90, 14, ${H / 2})`}>
        {"\u0394H\u1DA0 (eV/atom)"}
      </text>

      {[0, 0.25, 0.5, 0.75, 1.0].map(x => (
        <text key={`xt${x}`} x={toX(x)} y={H - pad.b + 16} textAnchor="middle"
          fill={T.muted} fontSize="10" fontFamily="monospace">{x.toFixed(2)}</text>
      ))}
      {[-0.8, -0.6, -0.4, -0.2, 0].map(e => (
        <text key={`yt${e}`} x={pad.l - 8} y={toY(e) + 4} textAnchor="end"
          fill={T.muted} fontSize="10" fontFamily="monospace">{e.toFixed(1)}</text>
      ))}

      <circle cx={W - pad.r - 120} cy={H - pad.b - 30} r="5" fill={CH.stable} />
      <text x={W - pad.r - 110} y={H - pad.b - 26} fill={CH.stable} fontSize="10">On Hull (Stable)</text>
      <circle cx={W - pad.r - 120} cy={H - pad.b - 14} r="5" fill={CH.unstab} />
      <text x={W - pad.r - 110} y={H - pad.b - 10} fill={CH.unstab} fontSize="10">Above Hull (Unstable)</text>
    </svg>
  );
};

function CHOverviewSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A computational phase diagram is like a GPS map for materials scientists. Just as a GPS map shows all the roads, cities, and terrain so you can plan the best route, a phase diagram maps all possible compounds that can form from a set of elements and shows which ones are stable under different conditions. Without this map, synthesizing a new material is like driving blindfolded.
        </div>
      </div>
      <Card title={"What is a Computational Phase Diagram?"} color={CH.main}>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
          <p style={{ margin: "0 0 12px" }}>
            A <strong style={{ color: CH.main }}>computational phase diagram</strong> is a theoretical map that predicts
            which crystal structures (phases) are thermodynamically stable for a given set of elements, computed
            entirely from quantum-mechanical DFT calculations {"\u2014"} no experimental input required.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            It answers the fundamental question: <em>If I mix elements A, B, C{"\u2026"} in different ratios
            under different conditions, which compounds will actually form?</em>
          </p>
          <div style={{
            background: CH.main + "0a", border: `1.5px solid ${CH.main}30`,
            borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
            fontSize: 14, fontWeight: 600, color: CH.main, textAlign: "center",
          }}>
            DFT Energies {"\u2192"} Formation Energies {"\u2192"} Convex Hull {"\u2192"} Chemical Potential Diagram {"\u2192"} Synthesis Recipe
          </div>
        </div>
      </Card>

      <Card title={"Types of Computational Phase Diagrams"} color={CH.hull}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>
          {[
            { type: "Convex Hull (Energy vs. Composition)", desc: "Plots formation energy against composition. The lower envelope identifies which phases are thermodynamically stable at T = 0 K. Phases on the hull are stable; phases above it will decompose.", color: CH.hull, topics: "Topics 2\u20136 in this chapter" },
            { type: "Chemical Potential Diagram (\u03BC_A vs. \u03BC_B)", desc: "Maps stability regions in chemical potential space. Each region corresponds to conditions (atmosphere, precursor ratios) where a specific phase is stable. Essential for guiding experimental synthesis.", color: CH.warm, topics: "Topics 9\u201311 in this chapter" },
            { type: "Temperature\u2013Composition (T\u2013x) Diagram", desc: "Extends the hull to finite temperature by including entropy and free energy corrections. Shows phase boundaries as a function of temperature \u2014 the classic experimentalist\u2019s phase diagram.", color: CH.accent, topics: "Topic 7 (Thermodynamics)" },
          ].map(({ type, desc, color, topics }) => (
            <div key={type} style={{
              marginBottom: 10, padding: "12px 16px", borderRadius: 10,
              background: color + "08", border: `1.5px solid ${color}18`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 4 }}>{type}</div>
              <div style={{ fontSize: 12, color: T.ink, marginBottom: 4 }}>{desc}</div>
              <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic" }}>{topics}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"The Computational Pipeline"} color={CH.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          {[
            { step: "1", title: "Enumerate Candidate Phases", desc: "List all known and hypothetical compounds in the chemical system (e.g., Cu, S, Cu\u2082S, CuS, CuS\u2082 for the Cu-S binary)." },
            { step: "2", title: "Run DFT Calculations", desc: "Compute the total energy of each phase using VASP/QE with appropriate INCAR settings (ENCUT, KPOINTS, etc.)." },
            { step: "3", title: "Compute Formation Energies", desc: "Subtract elemental references: \u0394H_f = E_DFT \u2212 \u03A3 n_i E_element_i. This normalizes all energies to a common baseline." },
            { step: "4", title: "Build the Convex Hull", desc: "Plot \u0394H_f vs. composition. The lower convex envelope separates stable from unstable phases." },
            { step: "5", title: "Extract Chemical Potentials", desc: "Convert hull constraints into chemical potential inequalities. Map stability regions in \u03BC-space." },
            { step: "6", title: "Guide Synthesis", desc: "Translate chemical potential windows into experimental conditions: atmosphere composition, temperature, precursor ratios." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{
              marginBottom: 8, padding: "10px 14px", borderRadius: 8,
              background: T.surface, border: `1px solid ${T.border}`,
            }}>
              <strong style={{ color: CH.main }}>Step {step}: {title}</strong>
              <div style={{ color: T.muted, marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <Card title={"Real-World Impact"} color={CH.stable}>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
              <strong style={{ color: CH.stable }}>Materials discovery relies on phase diagrams.</strong> The Materials
              Project database contains over 150,000 DFT-computed compounds with pre-built convex hulls. Researchers
              use these to:
              <div style={{ marginTop: 8 }}>
                {[
                  "Predict if a new compound is synthesizable before attempting experiment",
                  "Identify optimal growth conditions for multi-component semiconductors",
                  "Screen thousands of candidates for battery electrodes, solar absorbers, catalysts",
                  "Understand why certain synthesis recipes produce unwanted secondary phases",
                ].map((item, i) => (
                  <div key={i} style={{ paddingLeft: 12, marginBottom: 4 }}>
                    {"\u2022"} {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card title={"Chapter Roadmap"} color={CH.warm}>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
              {[
                { block: "Convex Hull Analysis", desc: "Build the energy-composition hull from DFT data (Cu-S system)", color: CH.hull },
                { block: "Results & Thermodynamics", desc: "Analyze stability, add temperature corrections, introduce chemical potentials", color: CH.accent },
                { block: "Chemical Potential Diagrams", desc: "Construct full stability maps; CZTS quaternary example", color: CH.warm },
              ].map(({ block, desc, color }) => (
                <div key={block} style={{
                  marginBottom: 8, padding: "8px 12px", borderRadius: 8,
                  background: color + "08", border: `1px solid ${color}18`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color }}>{block}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CHIntroSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Imagine you want to find which recipes for a cake use the least energy to bake. You list every recipe (compound) and plot their baking energy. The <strong>convex hull</strong> is like drawing a string tightly around the lowest-energy recipes — any recipe above the string wastes energy and the cake will fall apart into the simpler, lower-energy recipes below it.
          </div>
        </div>
        <Card title="What is a Convex Hull?" color={CH.main}>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 12px" }}>
              A <strong style={{ color: CH.hull }}>convex hull</strong> in computational materials science is the
              lowest-energy boundary connecting all thermodynamically stable phases in a chemical system.
              It answers a fundamental question:
            </p>
            <div style={{
              background: CH.main + "0a", border: `1.5px solid ${CH.main}30`,
              borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
              fontSize: 15, fontWeight: 600, color: CH.main, textAlign: "center",
            }}>
              {'"Given elements A and B, which compounds A\u2093B\u2081\u208B\u2093 are thermodynamically stable at T = 0 K?"'}
            </div>
            <p style={{ margin: "0 0 10px" }}>
              Compounds <strong style={{ color: CH.stable }}>on the hull</strong> are stable {"\u2014"} they won{"'"}t spontaneously
              decompose. Compounds <strong style={{ color: CH.unstab }}>above the hull</strong> are metastable or unstable {"\u2014"}
              they will decompose into neighboring hull phases.
            </p>
          </div>
        </Card>

        <Card title="The Procedure" color={CH.accent}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { step: "1", title: "Get DFT Energies", desc: "Calculate total energy for each compound and the pure elements using DFT." },
              { step: "2", title: "Formation Energies", desc: "Subtract reference energies of pure elements. Normalize per atom." },
              { step: "3", title: "Build Convex Hull", desc: "Connect lowest-energy points. Distance above = thermodynamic instability." },
            ].map(s => (
              <div key={s.step} style={{
                background: CH.accent + "08", border: `1px solid ${CH.accent}20`,
                borderRadius: 10, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", margin: "0 auto 8px",
                  background: CH.accent + "18", border: `1.5px solid ${CH.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 800, color: CH.accent,
                }}>{s.step}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: CH.accent, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={"Preview \u2014 Cu-S Phase Diagram"} color={CH.hull}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
            We{"'"}ll build this plot step by step using fabricated DFT energies for the Cu-S binary system.
          </div>
          <CHHullPlot showAbove={true} />
        </Card>
      </div>
  );
}

function CHSetupSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Before comparing cake recipes, you need the raw ingredient costs. DFT total energies are like the total grocery bill for each recipe — but different recipes use different amounts of ingredients. You can{"'"}t compare a recipe for 12 cupcakes with one for a single layer cake without normalizing to {"'"}cost per serving.{"'"} That{"'"}s why we convert to formation energy per atom.
          </div>
        </div>
        <Card title="Raw DFT Total Energies" color={CH.main}>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>
            These are the total energies from DFT calculations for each compound in the Cu-S system.
            Each value represents the energy of the <strong>entire unit cell</strong> (not per atom).
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "monospace" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${CH.main}30` }}>
                  {["Compound", "DFT Total Energy (eV)", "Formula", "Atoms"].map(h => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left", fontSize: 11,
                      color: CH.main, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chDftData.map((d, i) => (
                  <tr key={d.name} style={{
                    background: i % 2 === 0 ? CH.main + "05" : "transparent",
                    borderBottom: `1px solid ${T.border}55`,
                  }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: T.ink }}>{d.name}</td>
                    <td style={{ padding: "10px 14px", color: CH.hull, fontWeight: 600 }}>{d.E.toFixed(2)} eV</td>
                    <td style={{ padding: "10px 14px", color: T.muted }}>{d.nCu} Cu + {d.nS} S</td>
                    <td style={{ padding: "10px 14px", color: T.muted }}>{d.nCu + d.nS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="What we need to do" color={CH.warm}>
          <div style={{
            background: CH.warm + "0a", border: `1px solid ${CH.warm}22`,
            borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.8,
          }}>
            <strong style={{ color: CH.warm }}>Problem:</strong> Raw DFT energies can{"'"}t be compared directly {"\u2014"}
            different compounds have different numbers of atoms.<br />
            <strong style={{ color: CH.warm }}>Solution:</strong> Convert to <em>formation energy per atom</em> relative
            to the pure elements (Cu metal and elemental S).
          </div>
        </Card>
      </div>
  );
}

function CHFormSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Formation energy is like asking: {"'"}How much cheaper is this cake compared to just eating the raw flour and sugar separately?{"'"} You subtract the cost of raw ingredients (pure elements) from the total cost (compound energy). If the result is negative, the cake is worth making — the combined product is more stable than the raw parts.
          </div>
        </div>
        <Card title="Formation Energy Formula" color={CH.hull}>
          <div style={chMathBlock}>
            {"\u0394H\u1DA0 = E(compound) \u2212 [n_Cu \u00D7 E(Cu)] \u2212 [n_S \u00D7 E(S)]"}<br />
            <span style={{ color: T.muted }}>then divide by total atoms to get per-atom value</span>
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
            Reference energies: E(Cu) = {chHighlightNum("-3.72 eV/atom", CH.main)}, E(S) = {chHighlightNum("-4.12 eV/atom", CH.main)}
          </div>
        </Card>

        {/* Cu2S worked example */}
        <Card title={"Worked Example \u2014 Cu\u2082S"} color={CH.stable}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
            Cu{"\u2082"}S has {chHighlightNum("2 Cu", CH.main)} atoms and {chHighlightNum("1 S", CH.main)} atom = {chHighlightNum("3 atoms", CH.accent)} total.
          </div>
          <div style={chMathBlock}>
            <div style={{ color: CH.stable, fontWeight: 700, marginBottom: 4 }}>Step-by-step:</div>
            {"\u0394H\u1DA0(Cu\u2082S) = E(Cu\u2082S) \u2212 [2 \u00D7 E(Cu)] \u2212 [1 \u00D7 E(S)]"}<br />
            {"           = -13.55 \u2212 [2 \u00D7 (-3.72)] \u2212 [1 \u00D7 (-4.12)]"}<br />
            {"           = -13.55 \u2212 (-7.44) \u2212 (-4.12)"}<br />
            {"           = -13.55 + 7.44 + 4.12"}<br />
            {"           = "}<span style={{ color: CH.stable, fontWeight: 700 }}>-1.99 eV</span>{"  \u2190 whole formula unit"}<br /><br />
            {"Per atom = -1.99 / 3 = "}<span style={{ color: CH.stable, fontWeight: 700, fontSize: 14 }}>-0.6633 eV/atom</span>
          </div>
          <div style={{
            background: CH.stable + "0c", border: `1px solid ${CH.stable}25`,
            borderRadius: 8, padding: "10px 14px", fontSize: 12, color: CH.stable, fontWeight: 600,
          }}>
            Negative {"\u2192"} energy is released when forming Cu{"\u2082"}S {"\u2192"} it wants to form naturally
          </div>
        </Card>

        {/* CuS worked example */}
        <Card title={"Worked Example \u2014 CuS"} color={CH.warm}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
            CuS has {chHighlightNum("1 Cu", CH.main)} + {chHighlightNum("1 S", CH.main)} = {chHighlightNum("2 atoms", CH.accent)} total.
          </div>
          <div style={chMathBlock}>
            {"\u0394H\u1DA0(CuS) = -7.89 \u2212 (-3.72) \u2212 (-4.12)"}<br />
            {"        = -7.89 + 3.72 + 4.12"}<br />
            {"        = "}<span style={{ color: CH.warm, fontWeight: 700 }}>-0.05 eV</span><br /><br />
            {"Per atom = -0.05 / 2 = "}<span style={{ color: CH.warm, fontWeight: 700, fontSize: 14 }}>-0.025 eV/atom</span>
          </div>
          <div style={{
            background: CH.warm + "0c", border: `1px solid ${CH.warm}25`,
            borderRadius: 8, padding: "10px 14px", fontSize: 12, color: CH.warm, fontWeight: 600,
          }}>
            Very small negative {"\u2014"} barely stable. Weakly wants to form.
          </div>
        </Card>

        {/* CuS2 worked example */}
        <Card title={"Worked Example \u2014 CuS\u2082"} color={CH.unstab}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
            CuS{"\u2082"} has {chHighlightNum("1 Cu", CH.main)} + {chHighlightNum("2 S", CH.main)} = {chHighlightNum("3 atoms", CH.accent)} total.
          </div>
          <div style={chMathBlock}>
            {"\u0394H\u1DA0(CuS\u2082) = -12.01 \u2212 (-3.72) \u2212 [2 \u00D7 (-4.12)]"}<br />
            {"         = -12.01 + 3.72 + 8.24"}<br />
            {"         = "}<span style={{ color: CH.unstab, fontWeight: 700 }}>-0.05 eV</span><br /><br />
            {"Per atom = -0.05 / 3 = "}<span style={{ color: CH.unstab, fontWeight: 700, fontSize: 14 }}>-0.017 eV/atom</span>
          </div>
        </Card>

        {/* Summary table */}
        <Card title="Formation Energy Summary" color={CH.accent}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "monospace" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${CH.accent}30` }}>
                {["Compound", "x (S fraction)", "\u0394H\u1DA0 (eV/atom)"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", fontSize: 11,
                    color: CH.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chCompounds.map((c, i) => (
                <tr key={c.name} style={{
                  background: i % 2 === 0 ? CH.accent + "05" : "transparent",
                  borderBottom: `1px solid ${T.border}55`,
                }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: T.ink }}>{c.name}</td>
                  <td style={{ padding: "10px 14px", color: CH.main }}>{c.x.toFixed(2)}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: c.dHfPerAtom < -0.1 ? CH.stable : c.dHfPerAtom < 0 ? CH.warm : T.muted }}>
                    {c.dHfPerAtom === 0 ? "0.000" : c.dHfPerAtom.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>
            Composition x = (number of S atoms) / (total atoms). Ranges from 0 (pure Cu) to 1 (pure S).
            Pure elements always have {"\u0394H\u1DA0"} = 0 by definition.
          </div>
        </Card>
      </div>
  );
}

function CHHullSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Building the convex hull is like stretching a rubber band under all the data points on a plot. The rubber band snaps tight to the lowest points — those are the stable phases. Any point the rubber band doesn{"'"}t touch is floating above it — those compounds are unstable and will decompose into the phases the band does touch.
          </div>
        </div>
        <Card title="Building the Convex Hull" color={CH.hull}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 14 }}>
            The convex hull connects the <strong style={{ color: CH.stable }}>lowest-energy points</strong> with
            straight lines. Any compound above these lines is thermodynamically unstable.
          </div>
          <CHHullPlot showAbove={false} />
          <div style={{
            background: CH.hull + "0a", border: `1px solid ${CH.hull}22`,
            borderRadius: 10, padding: "14px 18px", marginTop: 14, fontSize: 13, lineHeight: 1.8,
          }}>
            <strong style={{ color: CH.hull }}>Hull connects:</strong> Cu {"\u2192"} Cu{"\u2082"}S {"\u2192"} S<br />
            Cu{"\u2082"}S at {chHighlightNum("-0.663 eV/atom", CH.stable)} is so far below CuS and CuS{"\u2082"} that the
            hull skips directly from Cu{"\u2082"}S to S.
          </div>
        </Card>

        <Card title="Hull Line Equations" color={CH.accent}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{
              background: CH.accent + "08", border: `1px solid ${CH.accent}20`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, color: CH.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                Segment 1: Cu {"\u2192"} Cu{"\u2082"}S
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.0, color: T.ink }}>
                x range: [0.00, 0.33]<br />
                slope = (-0.663 {"\u2212"} 0) / (0.33 {"\u2212"} 0)<br />
                {"     = "}<span style={{ color: CH.accent, fontWeight: 700 }}>-2.009</span><br /><br />
                E_hull(x) = -2.009 {"\u00D7"} x
              </div>
            </div>
            <div style={{
              background: CH.hull + "08", border: `1px solid ${CH.hull}20`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, color: CH.hull, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                Segment 2: Cu{"\u2082"}S {"\u2192"} S
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 2.0, color: T.ink }}>
                x range: [0.33, 1.00]<br />
                slope = (0 {"\u2212"} ({"\u2212"}0.663)) / (1.00 {"\u2212"} 0.33)<br />
                {"     = "}<span style={{ color: CH.hull, fontWeight: 700 }}>+0.990</span><br /><br />
                E_hull(x) = -0.663 + 0.990(x {"\u2212"} 0.33)
              </div>
            </div>
          </div>
        </Card>
      </div>
  );
}

function CHAboveSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Energy above hull is like measuring how high a ball sits above the valley floor. A ball ON the floor (on the hull) stays put — it{"'"}s stable. A ball perched on a ledge above the floor (above the hull) will eventually roll down. The higher it sits, the stronger the driving force to decompose into the stable valley-floor phases.
          </div>
        </div>
        <Card title={"Energy Above Hull \u2014 Concept"} color={CH.unstab}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            For any compound, the <strong style={{ color: CH.unstab }}>energy above hull</strong> measures how far it sits
            above the convex hull line at that composition. It tells us the <em>thermodynamic driving force
            for decomposition</em>.
          </div>
          <div style={chMathBlock}>
            E_above_hull = E_actual {"\u2212"} E_hull(x)<br />
            <span style={{ color: T.muted }}>where E_hull(x) is interpolated from the hull line at composition x</span>
          </div>
        </Card>

        {/* CuS calculation */}
        <Card title={"CuS (x = 0.50) \u2014 Energy Above Hull"} color={CH.unstab}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
            x = 0.50 falls between Cu{"\u2082"}S (x = 0.33) and S (x = 1.00) {"\u2192"} use hull segment 2
          </div>
          <div style={chMathBlock}>
            <div style={{ color: CH.hull, fontWeight: 700, marginBottom: 4 }}>Hull energy at x = 0.50:</div>
            E_hull(0.50) = -0.663 + 0.990 {"\u00D7"} (0.50 {"\u2212"} 0.33)<br />
            {"           = -0.663 + 0.990 \u00D7 0.17"}<br />
            {"           = -0.663 + 0.168"}<br />
            {"           = "}<span style={{ color: CH.hull, fontWeight: 700 }}>-0.495 eV/atom</span><br /><br />
            <div style={{ color: CH.unstab, fontWeight: 700, marginBottom: 4 }}>Energy above hull:</div>
            {"E_above_hull = E_actual \u2212 E_hull"}<br />
            {"             = -0.025 \u2212 (-0.495)"}<br />
            {"             = "}<span style={{ color: CH.unstab, fontWeight: 700, fontSize: 15 }}>+0.470 eV/atom</span>
          </div>
          <div style={{
            background: CH.unstab + "0c", border: `1px solid ${CH.unstab}25`,
            borderRadius: 8, padding: "12px 16px", fontSize: 12, color: CH.unstab, fontWeight: 600, lineHeight: 1.6,
          }}>
            CuS is 470 meV/atom above the hull {"\u2014"} thermodynamically unstable.
            It will decompose into Cu{"\u2082"}S + S.
          </div>
        </Card>

        {/* CuS2 calculation */}
        <Card title={"CuS\u2082 (x = 0.67) \u2014 Energy Above Hull"} color={CH.unstab}>
          <div style={chMathBlock}>
            <div style={{ color: CH.hull, fontWeight: 700, marginBottom: 4 }}>Hull energy at x = 0.67:</div>
            {"E_hull(0.67) = -0.663 + 0.990 \u00D7 (0.67 \u2212 0.33)"}<br />
            {"           = -0.663 + 0.990 \u00D7 0.34"}<br />
            {"           = -0.663 + 0.337"}<br />
            {"           = "}<span style={{ color: CH.hull, fontWeight: 700 }}>-0.326 eV/atom</span><br /><br />
            <div style={{ color: CH.unstab, fontWeight: 700, marginBottom: 4 }}>Energy above hull:</div>
            {"E_above_hull = -0.017 \u2212 (-0.326)"}<br />
            {"             = "}<span style={{ color: CH.unstab, fontWeight: 700, fontSize: 15 }}>+0.309 eV/atom</span>
          </div>
          <div style={{
            background: CH.unstab + "0c", border: `1px solid ${CH.unstab}25`,
            borderRadius: 8, padding: "12px 16px", fontSize: 12, color: CH.unstab, fontWeight: 600,
          }}>
            CuS{"\u2082"} is 309 meV/atom above the hull {"\u2014"} also unstable.
          </div>
        </Card>

        <Card title="Visualized" color={CH.hull}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
            Red dashed lines show the distance above the hull for each unstable compound.
          </div>
          <CHHullPlot showAbove={true} />
        </Card>
      </div>
  );
}

function CHResultsSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            The final results table is like a scoreboard after a tournament. Each compound gets rated: ON the hull = winner (thermodynamically stable, will exist in nature). ABOVE the hull = eliminated (will decompose into winners). The energy above hull tells you how badly each loser lost — small gaps mean they might survive with a bit of luck (kinetic trapping).
          </div>
        </div>
        <Card title="Final Results Table" color={CH.main}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${CH.main}30` }}>
                  {["Compound", "x", "\u0394H\u1DA0 (eV/at)", "E_hull", "E_above_hull", "Verdict"].map(h => (
                    <th key={h} style={{
                      padding: "10px 12px", textAlign: "left", fontSize: 10,
                      color: CH.main, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Cu",     x: 0.00, dHf: 0.000,  eHull: 0.000,  eAbove: 0.000,  stable: true },
                  { name: "Cu\u2082S", x: 0.33, dHf: -0.663, eHull: -0.663, eAbove: 0.000,  stable: true },
                  { name: "CuS",    x: 0.50, dHf: -0.025, eHull: -0.495, eAbove: 0.470,  stable: false },
                  { name: "CuS\u2082", x: 0.67, dHf: -0.017, eHull: -0.326, eAbove: 0.309,  stable: false },
                  { name: "S",      x: 1.00, dHf: 0.000,  eHull: 0.000,  eAbove: 0.000,  stable: true },
                ].map((r, i) => (
                  <tr key={r.name} style={{
                    background: r.stable ? CH.stable + "08" : CH.unstab + "06",
                    borderBottom: `1px solid ${T.border}55`,
                  }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: T.ink, fontFamily: "monospace" }}>{r.name}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", color: T.muted }}>{r.x.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 600, color: r.dHf < -0.1 ? CH.stable : T.ink }}>
                      {r.dHf === 0 ? "0.000" : r.dHf.toFixed(3)}
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", color: CH.hull }}>{r.eHull.toFixed(3)}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: r.eAbove > 0 ? CH.unstab : CH.stable }}>
                      {r.eAbove === 0 ? "0.000" : `+${r.eAbove.toFixed(3)}`}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {chBadge(r.stable ? "STABLE" : "UNSTABLE", r.stable ? CH.stable : CH.unstab)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Complete Cu-S Phase Diagram" color={CH.hull}>
          <CHHullPlot showAbove={true} />
        </Card>

        <Card title="Physical Interpretation" color={CH.stable}>
          <div style={{ fontSize: 13, lineHeight: 1.9, color: T.ink }}>
            <div style={{
              background: CH.stable + "0a", border: `1px solid ${CH.stable}22`,
              borderRadius: 10, padding: "14px 18px", marginBottom: 14,
            }}>
              <strong style={{ color: CH.stable }}>Cu{"\u2082"}S is the only stable intermediate</strong> in the Cu-S system. If you
              tried to synthesize CuS, thermodynamics predicts it will spontaneously decompose:
              <div style={{
                fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: CH.main,
                margin: "10px 0 0", padding: "8px 14px", background: CH.main + "0a",
                borderRadius: 6, border: `1px solid ${CH.main}20`,
              }}>
                2 CuS {"  \u2192  "}Cu{"\u2082"}S + S {"  "}<span style={{ color: CH.stable }}>(releases energy)</span>
              </div>
            </div>
            <div style={{
              background: CH.warm + "0a", border: `1px solid ${CH.warm}22`,
              borderRadius: 10, padding: "14px 18px", marginBottom: 14,
            }}>
              <strong style={{ color: CH.warm }}>Stability threshold:</strong> Anything above ~100 meV/atom is
              generally considered unlikely to be synthesizable under equilibrium conditions.
              CuS at 470 meV/atom is far above this threshold.
            </div>
            <div style={{
              background: CH.accent + "0a", border: `1px solid ${CH.accent}22`,
              borderRadius: 10, padding: "14px 18px",
            }}>
              <strong style={{ color: CH.accent }}>But kinetics matters!</strong> CuS <em>can</em> exist as a metastable
              phase if synthesized at low temperature quickly (e.g., sol-gel at 200{"\u00B0"}C). The gap between
              what the convex hull predicts and what experimentalists actually report is exactly the
              scientific problem that materials informatics pipelines are designed to illuminate.
            </div>
          </div>
        </Card>

      </div>
  );
}

function CHThermoSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            The 0 K hull is like a frozen lake — the surface is rigid and only the lowest-energy phases sit on it. Heating up (adding temperature) is like thawing the lake — the surface becomes flexible. Entropy (disorder) acts like waves that can lift previously submerged phases to the surface. Some compounds that were unstable at 0 K become stable at high temperature because their atoms vibrate more freely (higher entropy).
          </div>
        </div>
        <Card title="Why Thermodynamics Matters for the Hull" color={CH.accent}>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 12px" }}>
              The convex hull is a <strong style={{ color: CH.accent }}>thermodynamic construction</strong> — it identifies
              phases that minimize the Gibbs free energy at T = 0 K and P = 0.
            </p>
            <div style={{
              background: CH.accent + "0a", border: `1.5px solid ${CH.accent}30`,
              borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
              fontSize: 15, fontWeight: 600, color: CH.accent, textAlign: "center",
            }}>
              G = H − TS → at T = 0 K, G = H ≈ E_DFT
            </div>
            <p style={{ margin: 0 }}>
              At finite temperature, entropy (vibrational, configurational) can stabilize phases
              that are <strong style={{ color: CH.unstab }}>above the hull</strong> at 0 K. This is why some
              metastable phases exist in nature.
            </p>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Card title="Free Energy vs. Temperature" color={CH.hull}>
              <div style={chMathBlock}>
                G(T) = E_DFT + E_ZPE + ∫C_v dT − T × S(T)<br/>
                <span style={{ color: T.muted }}>where S(T) includes vibrational entropy from phonons</span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: CH.hull }}>Key contributions:</strong><br/>
                • <strong>Zero-point energy (ZPE):</strong> quantum vibrations even at 0 K<br/>
                • <strong>Vibrational entropy:</strong> −TS term grows with temperature<br/>
                • <strong>Configurational entropy:</strong> mixing in solid solutions (k_B × Σ x_i ln x_i)
              </div>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card title="Hull Stability vs. Temperature" color={CH.warm}>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 12 }}>
                A compound <strong style={{ color: CH.unstab }}>above the hull</strong> at 0 K may become stable at high T if
                it has higher vibrational entropy than competing phases.
              </div>
              {[
                { temp: "0 K", desc: "Pure enthalpy — DFT hull is exact", color: CH.stable },
                { temp: "300 K", desc: "Small entropy corrections (~10-30 meV/atom)", color: CH.accent },
                { temp: "1000 K", desc: "Entropy can shift hull by ~100+ meV/atom", color: CH.warm },
                { temp: "T_melt", desc: "Liquid phase may appear on the hull", color: CH.unstab },
              ].map(({ temp, desc, color }) => (
                <div key={temp} style={{
                  display: "flex", gap: 10, alignItems: "center", marginBottom: 6,
                  padding: "6px 10px", borderRadius: 6,
                  background: color + "0a", border: `1px solid ${color}22`,
                }}>
                  <span style={{ fontWeight: 700, color, fontFamily: "monospace", minWidth: 50 }}>{temp}</span>
                  <span style={{ fontSize: 11, color: T.ink }}>{desc}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <Card title="When Does the 0 K Hull Fail?" color={CH.unstab}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { title: "High-T Polymorphs", desc: "Rutile vs anatase TiO₂ — anatase is metastable at 0 K but common at low-T synthesis.", color: CH.unstab },
              { title: "Entropy-Stabilized Phases", desc: "High-entropy oxides (5+ cations) are stable ONLY because of configurational entropy.", color: CH.warm },
              { title: "Order-Disorder Transitions", desc: "Cu₃Au is ordered at 0 K, disordered above ~390°C. Hull changes with temperature.", color: CH.accent },
            ].map(s => (
              <div key={s.title} style={{
                background: s.color + "08", border: `1px solid ${s.color}20`,
                borderRadius: 10, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Practical Rule of Thumb" color={CH.stable}>
          <div style={{
            background: CH.stable + "0a", border: `1px solid ${CH.stable}22`,
            borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.8,
          }}>
            <strong style={{ color: CH.stable }}>E_above_hull {"<"} 25 meV/atom:</strong> Could be stabilized by entropy at moderate T. Check phonons.<br/>
            <strong style={{ color: CH.warm }}>25–100 meV/atom:</strong> Possibly metastable. Needs kinetic trapping (rapid quench, thin film deposition).<br/>
            <strong style={{ color: CH.unstab }}>{">"} 100 meV/atom:</strong> Very unlikely to exist under equilibrium conditions at any temperature.
          </div>
        </Card>
      </div>
  );
}

function CHChemPotSection() {
  return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            Chemical potential is like the price of individual ingredients at the grocery store. If copper is cheap (Cu-rich conditions, high {'\u03BC'}_Cu), you get compounds with lots of copper. If sulfur is cheap (S-rich), sulfur-heavy phases win. By adjusting these {"'"}prices{"'"} (partial pressures in the lab), experimentalists control which phase actually grows — it{"'"}s the bridge between the theoretical hull and the real experiment.
          </div>
        </div>
        <Card title="What is a Chemical Potential?" color={CH.warm}>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
            <p style={{ margin: "0 0 12px" }}>
              The <strong style={{ color: CH.warm }}>chemical potential μ_i</strong> represents the energy cost of adding
              or removing one atom of species <em>i</em> from the system. It connects the convex hull to
              real experimental conditions.
            </p>
            <div style={{
              background: CH.warm + "0a", border: `1.5px solid ${CH.warm}30`,
              borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
              fontSize: 15, fontWeight: 600, color: CH.warm, textAlign: "center",
            }}>
              ΔG_f = E_DFT − Σ n_i × μ_i
            </div>
            <p style={{ margin: 0 }}>
              By varying μ_Cu and μ_S, we move along the hull and change which phases are
              thermodynamically favored — this is how experimentalists control synthesis.
            </p>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <Card title="Chemical Potential Bounds — Cu-S System" color={CH.main}>
              <div style={chMathBlock}>
                μ_Cu + μ_S = ΔH_f(Cu₂S) / formula unit<br/>
                <span style={{ color: T.muted }}>Chemical potentials are constrained by phase stability</span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                <strong style={{ color: CH.main }}>Bounds on μ_Cu:</strong><br/>
                • <strong>Cu-rich limit:</strong> μ_Cu = 0 (pure Cu metal precipitates)<br/>
                • <strong>Cu-poor limit:</strong> μ_Cu = ΔH_f(Cu₂S) / 2<br/>
                • Between these limits: single-phase Cu₂S is stable
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
                <strong style={{ color: CH.main }}>Bounds on μ_S:</strong><br/>
                • <strong>S-rich limit:</strong> μ_S = 0 (elemental S precipitates)<br/>
                • <strong>S-poor limit:</strong> μ_S = ΔH_f(Cu₂S) − 2μ_Cu
              </div>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card title="Growth Conditions Map" color={CH.accent}>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 12 }}>
                Chemical potentials translate directly to experimental growth parameters:
              </div>
              {[
                { condition: "Cu-rich / S-poor", mu: "μ_Cu → 0", result: "Excess Cu → metallic Cu precipitates", color: CH.stable },
                { condition: "Balanced", mu: "μ_Cu = ΔH_f/2", result: "Stoichiometric Cu₂S growth", color: CH.accent },
                { condition: "Cu-poor / S-rich", mu: "μ_S → 0", result: "Excess S → sulfur inclusions", color: CH.warm },
              ].map(({ condition, mu, result, color }) => (
                <div key={condition} style={{
                  marginBottom: 8, padding: "10px 12px", borderRadius: 8,
                  background: color + "0a", border: `1px solid ${color}22`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>{condition}</div>
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: T.ink, marginBottom: 2 }}>{mu}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{result}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <Card title="Chemical Potential in Defect Calculations" color={CH.hull}>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={chMathBlock}>
                E_f[defect] = E_DFT[defect] − E_DFT[bulk] + Σ n_i × μ_i + q × E_Fermi<br/>
                <span style={{ color: T.muted }}>Defect formation energy depends on chemical potentials</span>
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                The chemical potential appears directly in the defect formation energy expression.
                This means <strong style={{ color: CH.hull }}>growth conditions determine which defects form</strong>:
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                {[
                  { defect: "V_Cu (Cu vacancy)", cond: "Cu-poor (low μ_Cu)", effect: "Low formation energy → many vacancies", color: CH.unstab },
                  { defect: "Cu_i (Cu interstitial)", cond: "Cu-rich (high μ_Cu)", effect: "Low formation energy → many interstitials", color: CH.stable },
                  { defect: "S_Cu (S on Cu site)", cond: "S-rich, Cu-poor", effect: "Antisite defect favored", color: CH.warm },
                ].map(({ defect, cond, effect, color }) => (
                  <div key={defect} style={{
                    marginBottom: 8, padding: "8px 10px", borderRadius: 6,
                    background: color + "0a", border: `1px solid ${color}22`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color }}>{defect}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>Favored: {cond}</div>
                    <div style={{ fontSize: 11, color: T.ink }}>{effect}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Connecting Hull to Experiment" color={CH.stable}>
          <div style={{
            background: CH.stable + "0a", border: `1px solid ${CH.stable}22`,
            borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.8,
          }}>
            <strong style={{ color: CH.stable }}>The convex hull defines allowed μ ranges.</strong> Each stable phase on the hull
            creates a region in chemical potential space. Moving between regions (by changing partial pressures,
            temperature, or precursor ratios) drives phase transitions. This is how materials scientists
            <strong style={{ color: CH.accent }}> design synthesis recipes</strong> — by targeting specific chemical potential conditions
            that favor the desired phase.
          </div>
        </Card>
      </div>
  );
}

function CHChemDiagramSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A chemical potential diagram is like a weather map for crystal growth. Just as a weather map shows where it rains, snows, or stays dry based on temperature and humidity, a chemical potential diagram shows which crystal phase forms based on how much of each element is available. The axes are the {"\""}prices{"\""} of each element, and each colored region is a different phase that {"\""}wins{"\""} at those conditions.
        </div>
      </div>
      <Card title="What is a Chemical Potential Diagram?" color={CH.warm}>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
          <p style={{ margin: "0 0 12px" }}>
            A <strong style={{ color: CH.warm }}>chemical potential diagram</strong> maps the thermodynamic stability
            regions of all competing phases in a multi-component system as a function of the
            chemical potentials of each element. It answers: <em>under what growth conditions
            does my target phase form without decomposing?</em>
          </p>
          <div style={{
            background: CH.warm + "0a", border: `1.5px solid ${CH.warm}30`,
            borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
            fontSize: 15, fontWeight: 600, color: CH.warm, textAlign: "center",
          }}>
            {"\u0394"}G_f(phase) = E_DFT(phase) {"\u2212"} {"\u03A3"} n_i {"\u00D7"} {"\u03BC"}_i {"\u2264"} 0 for stability
          </div>
          <p style={{ margin: 0 }}>
            Each stable phase occupies a <strong>polygon</strong> (or polyhedron in 3+ components) in
            chemical potential space. The boundaries are phase coexistence lines. Experimentalists
            use this to choose annealing atmosphere, precursor ratios, and temperature.
          </p>
        </div>
      </Card>

      <Card title="How to Build a Chemical Potential Diagram" color={CH.main}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          {[
            { step: "1", title: "Compute DFT Energies", desc: "Run DFT for all competing phases in the system (elements, binaries, ternaries, quaternaries)." },
            { step: "2", title: "Compute Formation Energies", desc: "Subtract elemental references: \u0394H_f = E_DFT \u2212 \u03A3 n_i E_i." },
            { step: "3", title: "Set Up Constraints", desc: "Each stable phase gives an inequality: \u03A3 n_i \u03BC_i \u2264 \u0394H_f. Elements: \u03BC_i \u2264 0." },
            { step: "4", title: "Find Feasible Region", desc: "Solve the system of inequalities. The intersection defines the stability polygon for each phase." },
            { step: "5", title: "Plot the Diagram", desc: "Plot \u03BC_A vs \u03BC_B (for ternary) or project into 2D slices (for quaternary). Label each region." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{
              marginBottom: 8, padding: "10px 14px", borderRadius: 8,
              background: CH.main + "08", border: `1px solid ${CH.main}18`,
            }}>
              <strong style={{ color: CH.main }}>Step {step}: {title}</strong>
              <div style={{ color: T.muted, marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <Card title="Binary System: Cu-S" color={CH.hull}>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
              <p style={{ margin: "0 0 8px" }}>In a binary A-B system, the diagram is <strong>1D</strong>:</p>
              <div style={{
                background: CH.hull + "0a", border: `1px solid ${CH.hull}22`,
                borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 11,
              }}>
                {"\u03BC"}_Cu + {"\u03BC"}_S = {"\u0394"}H_f(Cu{"\u2082"}S)<br/>
                {"\u03BC"}_Cu ranges: [{"\u0394"}H_f/2, 0]<br/>
                {"\u03BC"}_S = {"\u0394"}H_f {"\u2212"} 2{"\u03BC"}_Cu
              </div>
              <p style={{ margin: "8px 0 0" }}>Only one free variable {"\u2014"} a line segment of allowed conditions.</p>
            </div>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card title="Ternary System: Cu-Zn-S" color={CH.accent}>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
              <p style={{ margin: "0 0 8px" }}>In a ternary A-B-C system, the diagram is <strong>2D</strong>:</p>
              <div style={{
                background: CH.accent + "0a", border: `1px solid ${CH.accent}22`,
                borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontSize: 11,
              }}>
                Plot {"\u03BC"}_Cu vs {"\u03BC"}_Zn<br/>
                {"\u03BC"}_S = {"\u0394"}H_f {"\u2212"} n_Cu{"\u03BC"}_Cu {"\u2212"} n_Zn{"\u03BC"}_Zn<br/>
                Each phase {"\u2192"} polygon region
              </div>
              <p style={{ margin: "8px 0 0" }}>Two free variables {"\u2014"} stability regions are polygons on a 2D plane.</p>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Why Chemical Potential Diagrams Matter" color={CH.stable}>
        <div style={{
          background: CH.stable + "0a", border: `1px solid ${CH.stable}22`,
          borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.8,
        }}>
          <strong style={{ color: CH.stable }}>They bridge theory and experiment.</strong> The convex hull tells you
          <em> what</em> is stable. The chemical potential diagram tells you <em>how</em> to make it.
          For multi-component compounds like Cu{"\u2082"}ZnSnS{"\u2084"} (CZTS), the stability window can be
          extremely narrow {"\u2014"} a chemical potential diagram reveals exactly how tight the synthesis
          conditions must be, explaining why some materials are easy to grow and others require
          extraordinary control.
        </div>
      </Card>
    </div>
  );
}

function CHCZTSSection() {
  const [selectedRegion, setSelectedRegion] = useState("czts");
  const regions = {
    czts: { label: "Cu\u2082ZnSnS\u2084", color: "#2563eb", desc: "Target kesterite phase \u2014 narrow stability window" },
    cu2s: { label: "Cu\u2082S", color: "#dc2626", desc: "Cu-rich secondary phase \u2014 shunts solar cell" },
    zns:  { label: "ZnS", color: "#16a34a", desc: "Zn-rich secondary phase \u2014 high bandgap insulator" },
    sns:  { label: "SnS", color: "#d97706", desc: "Sn-poor decomposition product" },
    sns2: { label: "SnS\u2082", color: "#9333ea", desc: "Sn-rich secondary phase" },
    cu:   { label: "Cu", color: "#6b7280", desc: "Metallic Cu precipitates" },
  };
  const r = regions[selectedRegion];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Making CZTS is like baking a souffl{"\u00E9"} {"\u2014"} the recipe needs exactly the right proportions and conditions. Too much butter (Cu-rich) and it collapses into Cu{"\u2082"}S. Too much flour (Zn-rich) and you get a dry ZnS brick. The chemical potential diagram shows you the tiny sweet spot where the perfect souffl{"\u00E9"} (CZTS) forms.
        </div>
      </div>

      <Card title={"Cu\u2082ZnSnS\u2084 (CZTS) \u2014 Quaternary Kesterite"} color={CH.warm}>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: T.ink }}>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: CH.warm }}>CZTS</strong> is a promising earth-abundant solar absorber
            (E_g {"\u2248"} 1.5 eV) with the kesterite crystal structure. It contains <strong>four</strong> cation
            species (Cu, Zn, Sn, S), making its phase diagram exceptionally rich {"\u2014"} at least
            <strong> 15 competing phases</strong> can form during synthesis.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            {[
              { formula: "Cu\u2082ZnSnS\u2084", eg: "1.5 eV", type: "Kesterite (target)" },
              { formula: "Cu\u2082SnS\u2083", eg: "0.9 eV", type: "Parasitic absorber" },
              { formula: "ZnS", eg: "3.7 eV", type: "Insulating block" },
              { formula: "Cu\u2082S", eg: "1.2 eV", type: "Metallic shunt" },
              { formula: "SnS", eg: "1.1 eV", type: "Volatile loss" },
              { formula: "SnS\u2082", eg: "2.2 eV", type: "Sn-rich phase" },
            ].map(p => (
              <div key={p.formula} style={{
                padding: "6px 10px", borderRadius: 6, fontSize: 11,
                background: T.surface, border: `1px solid ${T.border}`,
              }}>
                <strong style={{ color: CH.warm }}>{p.formula}</strong>
                <span style={{ color: T.muted, marginLeft: 6 }}>{p.eg} {"\u2014"} {p.type}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="DFT Formation Energies for CZTS System" color={CH.main}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          DFT-computed formation enthalpies (eV/atom) for all relevant phases in the Cu-Zn-Sn-S system:
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${CH.main}` }}>
                {["Phase", "Formula", "n_Cu", "n_Zn", "n_Sn", "n_S", "\u0394H_f (eV/atom)"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: CH.main, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "CZTS (kesterite)", f: "Cu\u2082ZnSnS\u2084", cu: 2, zn: 1, sn: 1, s: 4, dh: -0.434 },
                { name: "Chalcopyrite", f: "CuInS\u2082", cu: 1, zn: 0, sn: 0, s: 2, dh: -0.521 },
                { name: "Covellite", f: "CuS", cu: 1, zn: 0, sn: 0, s: 1, dh: -0.264 },
                { name: "Chalcocite", f: "Cu\u2082S", cu: 2, zn: 0, sn: 0, s: 1, dh: -0.301 },
                { name: "Sphalerite", f: "ZnS", cu: 0, zn: 1, sn: 0, s: 1, dh: -0.873 },
                { name: "Herzenbergite", f: "SnS", cu: 0, zn: 0, sn: 1, s: 1, dh: -0.519 },
                { name: "Berndtite", f: "SnS\u2082", cu: 0, zn: 0, sn: 1, s: 2, dh: -0.461 },
                { name: "Mohite", f: "Cu\u2082SnS\u2083", cu: 2, zn: 0, sn: 1, s: 3, dh: -0.398 },
              ].map(row => (
                <tr key={row.name} style={{ borderBottom: `1px solid ${T.border}`, background: row.name.includes("CZTS") ? CH.warm + "08" : "transparent" }}>
                  <td style={{ padding: "6px 8px", fontWeight: row.name.includes("CZTS") ? 700 : 400 }}>{row.name}</td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.f}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.cu}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.zn}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.sn}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.s}</td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace", color: row.dh < -0.4 ? CH.stable : CH.warm }}>{row.dh.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Chemical Potential Constraints for CZTS" color={CH.hull}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <p style={{ margin: "0 0 10px" }}>
            For Cu{"\u2082"}ZnSnS{"\u2084"} with 4 elements, we have <strong>3 independent chemical potentials</strong> (the
            4th is fixed by the formation energy constraint). We plot 2D slices of {"\u03BC"}_Cu vs {"\u03BC"}_Zn
            at fixed {"\u03BC"}_Sn.
          </p>
          <div style={{
            background: CH.hull + "0a", border: `1px solid ${CH.hull}22`,
            borderRadius: 10, padding: "14px 18px", margin: "0 0 14px",
            fontFamily: "monospace", fontSize: 12,
          }}>
            2{"\u03BC"}_Cu + {"\u03BC"}_Zn + {"\u03BC"}_Sn + 4{"\u03BC"}_S = {"\u0394"}H_f(CZTS) = -3.47 eV<br/><br/>
            <strong>Elemental bounds:</strong><br/>
            {"\u03BC"}_Cu {"\u2264"} 0 (no metallic Cu)<br/>
            {"\u03BC"}_Zn {"\u2264"} 0 (no metallic Zn)<br/>
            {"\u03BC"}_Sn {"\u2264"} 0 (no metallic Sn)<br/>
            {"\u03BC"}_S  {"\u2264"} 0 (no elemental S)<br/><br/>
            <strong>Competing phase bounds:</strong><br/>
            2{"\u03BC"}_Cu + {"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(Cu{"\u2082"}S) (no Cu{"\u2082"}S precipitates)<br/>
            {"\u03BC"}_Zn + {"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(ZnS) (no ZnS precipitates)<br/>
            {"\u03BC"}_Sn + {"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(SnS) (no SnS loss)<br/>
            {"\u03BC"}_Sn + 2{"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(SnS{"\u2082"}) (no SnS{"\u2082"} formation)
          </div>
        </div>
      </Card>

      <Card title="Interactive: Competing Phases" color={CH.accent}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
          Click a phase to see how it competes with CZTS:
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {Object.entries(regions).map(([id, reg]) => (
            <button key={id} onClick={() => setSelectedRegion(id)} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: selectedRegion === id ? reg.color + "18" : T.surface,
              border: `1.5px solid ${selectedRegion === id ? reg.color : T.border}`,
              color: selectedRegion === id ? reg.color : T.muted,
              cursor: "pointer", fontFamily: "inherit",
            }}>{reg.label}</button>
          ))}
        </div>
        <div style={{
          background: r.color + "08", border: `1.5px solid ${r.color}22`,
          borderRadius: 10, padding: "14px 18px",
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: r.color, marginBottom: 6 }}>{r.label}</div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>{r.desc}</div>
          {selectedRegion === "czts" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              The CZTS stability region is a <strong>tiny polygon</strong> in 3D chemical potential space.
              Projecting onto the {"\u03BC"}_Cu vs {"\u03BC"}_Zn plane (at optimal {"\u03BC"}_Sn), the allowed
              window is only about <strong>0.1{"\u20130.2"} eV wide</strong> in each direction. This extreme
              narrowness explains why CZTS synthesis is so sensitive to conditions {"\u2014"} even small
              deviations produce secondary phases.
            </div>
          )}
          {selectedRegion === "cu2s" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              Cu{"\u2082"}S forms when {"\u03BC"}_Cu is too high (Cu-rich conditions). It is metallic and
              creates <strong>shunt paths</strong> in solar cells, dramatically reducing open-circuit voltage.
              The constraint 2{"\u03BC"}_Cu + {"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(Cu{"\u2082"}S) sets the Cu-rich boundary of
              the CZTS stability region.
            </div>
          )}
          {selectedRegion === "zns" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              ZnS (sphalerite) forms under Zn-rich conditions. With a bandgap of 3.7 eV, it acts
              as an <strong>insulating barrier</strong> within the CZTS film. The constraint
              {"\u03BC"}_Zn + {"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(ZnS) = -1.75 eV sets the Zn-rich boundary.
            </div>
          )}
          {selectedRegion === "sns" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              SnS is volatile and evaporates during high-temperature annealing. Sn loss from the
              film leads to <strong>Sn-poor, Cu-rich</strong> conditions that push the system toward Cu{"\u2082"}S.
              This is why CZTS annealing is done under SnS{"\u2082"} overpressure.
            </div>
          )}
          {selectedRegion === "sns2" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              SnS{"\u2082"} forms under Sn-rich, S-rich conditions. While less harmful than Cu{"\u2082"}S, it
              still represents Sn that is not incorporated into CZTS. The constraint
              {"\u03BC"}_Sn + 2{"\u03BC"}_S {"\u2264"} {"\u0394"}H_f(SnS{"\u2082"}) bounds the Sn/S-rich corner.
            </div>
          )}
          {selectedRegion === "cu" && (
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginTop: 10 }}>
              Metallic Cu precipitates when {"\u03BC"}_Cu {"\u2192"} 0 (extreme Cu-rich limit). The elemental
              bound {"\u03BC"}_Cu {"\u2264"} 0 is the hardest constraint. Cu precipitates are highly detrimental
              as they are metallic conductors that short-circuit the p-n junction.
            </div>
          )}
        </div>
      </Card>

      <Card title={"CZTS Stability Window \u2014 Numerical Example"} color={CH.stable}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <p style={{ margin: "0 0 10px" }}>
            Using DFT formation energies, the CZTS stability polygon (at optimal {"\u03BC"}_Sn = -0.30 eV) gives:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${CH.stable}` }}>
                  {["Condition", "\u03BC_Cu (eV)", "\u03BC_Zn (eV)", "\u03BC_S (eV)", "Limiting Phase"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: CH.stable, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { cond: "Cu-rich corner", cu: "-0.10", zn: "-1.25", s: "-0.43", limit: "Cu\u2082S" },
                  { cond: "Zn-rich corner", cu: "-0.55", zn: "-0.15", s: "-0.48", limit: "ZnS" },
                  { cond: "Optimal center", cu: "-0.32", zn: "-0.70", s: "-0.45", limit: "Balanced" },
                  { cond: "Cu-poor edge", cu: "-0.60", zn: "-0.40", s: "-0.41", limit: "Cu vacancy" },
                ].map(row => (
                  <tr key={row.cond} style={{ borderBottom: `1px solid ${T.border}`, background: row.cond.includes("Optimal") ? CH.stable + "08" : "transparent" }}>
                    <td style={{ padding: "6px 8px", fontWeight: row.cond.includes("Optimal") ? 700 : 400 }}>{row.cond}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.cu}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.zn}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.s}</td>
                    <td style={{ padding: "6px 8px", color: CH.warm }}>{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            background: CH.stable + "0a", border: `1px solid ${CH.stable}22`,
            borderRadius: 10, padding: "14px 18px", marginTop: 14, fontSize: 13, lineHeight: 1.8,
          }}>
            <strong style={{ color: CH.stable }}>Key insight:</strong> The CZTS stability window spans only
            ~0.5 eV in {"\u03BC"}_Cu and ~1.1 eV in {"\u03BC"}_Zn. Compare this to binary Cu{"\u2082"}S which has
            a window of ~1.5 eV {"\u2014"} CZTS is <strong>3{"\u00D7"} harder</strong> to synthesize in the right
            conditions. This is why Cu-poor, Zn-rich growth is preferred: it avoids the most
            harmful secondary phases (Cu{"\u2082"}S, Cu) while tolerating the less harmful ZnS.
          </div>
        </div>
      </Card>

      <Card title="Experimental Synthesis Guidance from the Diagram" color={CH.warm}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          {[
            { rule: "Cu-poor, Zn-rich", reason: "Avoids metallic Cu\u2082S shunts. Excess ZnS (insulating) is less harmful than Cu\u2082S (metallic).", color: CH.stable },
            { rule: "Anneal under SnS\u2082 + S\u2082 atmosphere", reason: "Prevents Sn loss (SnS evaporation) and S loss, keeping the system inside the CZTS polygon.", color: CH.accent },
            { rule: "Temperature 550\u2013580 \u00B0C", reason: "High enough for grain growth but low enough to prevent decomposition: CZTS \u2192 Cu\u2082S + ZnS + SnS(g) + S\u2082(g).", color: CH.warm },
            { rule: "Cu/(Zn+Sn) \u2248 0.8, Zn/Sn \u2248 1.2", reason: "Optimal precursor ratios from chemical potential analysis. Slightly Zn-rich, Cu-poor targets the center of the stability polygon.", color: CH.hull },
          ].map(({ rule, reason, color }) => (
            <div key={rule} style={{
              marginBottom: 10, padding: "10px 14px", borderRadius: 8,
              background: color + "08", border: `1px solid ${color}18`,
            }}>
              <strong style={{ color }}>{rule}</strong>
              <div style={{ color: T.muted, marginTop: 2 }}>{reason}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CHChemConstructSection() {
  const [step, setStep] = useState(1);
  // Cu-S binary diagram coordinates for SVG (scale: 1 eV = 200px)
  // Axes: x = μ_Cu (-1.0 to 0.1), y = μ_S (-1.0 to 0.1)
  const W = 360, H = 320, pad = 50;
  const toX = v => pad + (v + 1.0) * (W - 2 * pad) / 1.1;
  const toY = v => H - pad - (v + 1.0) * (H - 2 * pad) / 1.1;

  // Key points for Cu₂S stability line: μ_S = -0.90 - 2μ_Cu
  const cu2sA = { cu: 0, s: -0.90 };     // Cu-rich end
  const cu2sB = { cu: -0.45, s: 0 };     // S-rich end
  // CuS boundary on Cu₂S line: μ_Cu = -0.37, μ_S = -0.90 - 2(-0.37) = -0.16
  const cusB = { cu: -0.37, s: -0.16 };
  // CuS₂ boundary: 2μ_S + μ_Cu ≤ -0.85 → on Cu₂S line, solve
  const cus2B = { cu: -0.14, s: -0.62 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Constructing a chemical potential diagram is like drawing a zoning map for a city. Each ordinance (stability constraint) draws a boundary line. The final map is the intersection of all boundaries {"\u2014"} each zone represents where a particular phase {"\""}wins{"\""} the competition. You draw one line at a time, and the zones emerge naturally.
        </div>
      </div>

      <Card title={"Numerical Example: Cu-S Binary System"} color={CH.main}>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Let{"\u2019"}s build the chemical potential diagram for the <strong>Cu-S</strong> system step by step using real DFT numbers.
        </div>
        <div style={{ overflowX: "auto", marginBottom: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${CH.main}` }}>
                {["Phase", "Formula", "n_Cu", "n_S", "\u0394H_f (eV/f.u.)", "\u0394H_f (eV/atom)"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: CH.main, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Copper", f: "Cu", cu: 1, s: 0, dhfu: "0.00 (ref)", dha: "0.00" },
                { name: "Sulfur", f: "S", cu: 0, s: 1, dhfu: "0.00 (ref)", dha: "0.00" },
                { name: "Chalcocite", f: "Cu\u2082S", cu: 2, s: 1, dhfu: "-0.90", dha: "-0.300" },
                { name: "Covellite", f: "CuS", cu: 1, s: 1, dhfu: "-0.53", dha: "-0.265" },
                { name: "Hauerite-type", f: "CuS\u2082", cu: 1, s: 2, dhfu: "-0.85", dha: "-0.283" },
              ].map(row => (
                <tr key={row.name} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "6px 8px" }}>{row.name}</td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace", fontWeight: 600 }}>{row.f}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.cu}</td>
                  <td style={{ padding: "6px 8px", textAlign: "center" }}>{row.s}</td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.dhfu}</td>
                  <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.dha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={"Build the Diagram Step by Step"} color={CH.warm}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
          Click each step to see how constraints build the diagram. The SVG updates at each step:
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            { n: 1, label: "Empty Axes" },
            { n: 2, label: "Elemental Bounds" },
            { n: 3, label: "Cu\u2082S Line" },
            { n: 4, label: "CuS Constraint" },
            { n: 5, label: "CuS\u2082 Constraint" },
            { n: 6, label: "Final Diagram" },
          ].map(s => (
            <button key={s.n} onClick={() => setStep(s.n)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
              background: step === s.n ? CH.warm + "18" : T.surface,
              border: `1.5px solid ${step === s.n ? CH.warm : T.border}`,
              color: step === s.n ? CH.warm : T.muted,
              cursor: "pointer", fontFamily: "inherit",
            }}>{s.n}. {s.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {/* SVG Diagram */}
          <div style={{ flex: "0 0 auto" }}>
            <svg width={W} height={H} style={{ background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
              {/* Grid lines */}
              {[-0.8, -0.6, -0.4, -0.2].map(v => (
                <g key={v}>
                  <line x1={toX(v)} y1={toY(-1)} x2={toX(v)} y2={toY(0.05)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
                  <line x1={toX(-1)} y1={toY(v)} x2={toX(0.05)} y2={toY(v)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
                </g>
              ))}
              {/* Axes */}
              <line x1={toX(-1)} y1={toY(0)} x2={toX(0.05)} y2={toY(0)} stroke={T.ink} strokeWidth={1.5} />
              <line x1={toX(0)} y1={toY(-1)} x2={toX(0)} y2={toY(0.05)} stroke={T.ink} strokeWidth={1.5} />
              {/* Axis labels */}
              <text x={toX(0)} y={H - 8} textAnchor="middle" fontSize={11} fill={T.ink} fontFamily="'Inter',sans-serif">{"\u03BC"}_Cu (eV)</text>
              <text x={12} y={toY(0)} textAnchor="middle" fontSize={11} fill={T.ink} fontFamily="'Inter',sans-serif" transform={`rotate(-90,12,${toY(0)})`}>{"\u03BC"}_S (eV)</text>
              {/* Tick labels */}
              {[-0.8, -0.6, -0.4, -0.2, 0].map(v => (
                <g key={`t${v}`}>
                  <text x={toX(v)} y={toY(0) + 14} textAnchor="middle" fontSize={9} fill={T.muted}>{v.toFixed(1)}</text>
                  <text x={toX(0) + 6} y={toY(v) + 3} textAnchor="start" fontSize={9} fill={T.muted}>{v.toFixed(1)}</text>
                </g>
              ))}

              {/* Step 2+: Elemental bounds - shade forbidden region */}
              {step >= 2 && (
                <>
                  <rect x={toX(0)} y={toY(0.05)} width={toX(0.05) - toX(0)} height={toY(-1) - toY(0.05)} fill="#dc262615" />
                  <rect x={toX(-1)} y={toY(0.05)} width={toX(0.05) - toX(-1)} height={toY(0) - toY(0.05)} fill="#dc262615" />
                  <text x={toX(0.03)} y={toY(-0.5)} fontSize={9} fill="#dc2626" fontWeight={600}>{"\u03BC"}_Cu {"\u2264"} 0</text>
                  <text x={toX(-0.5)} y={toY(0.03)} fontSize={9} fill="#dc2626" fontWeight={600}>{"\u03BC"}_S {"\u2264"} 0</text>
                </>
              )}

              {/* Step 3+: Cu₂S stability line */}
              {step >= 3 && (
                <>
                  <line x1={toX(cu2sA.cu)} y1={toY(cu2sA.s)} x2={toX(cu2sB.cu)} y2={toY(cu2sB.s)}
                    stroke="#2563eb" strokeWidth={2.5} />
                  <text x={toX(-0.18)} y={toY(-0.60)} fontSize={10} fill="#2563eb" fontWeight={700}>Cu{"\u2082"}S line</text>
                  <circle cx={toX(cu2sA.cu)} cy={toY(cu2sA.s)} r={4} fill="#2563eb" />
                  <text x={toX(cu2sA.cu) + 6} y={toY(cu2sA.s) + 3} fontSize={8} fill="#2563eb">(0, -0.90)</text>
                  <circle cx={toX(cu2sB.cu)} cy={toY(cu2sB.s)} r={4} fill="#2563eb" />
                  <text x={toX(cu2sB.cu) - 50} y={toY(cu2sB.s) - 6} fontSize={8} fill="#2563eb">(-0.45, 0)</text>
                </>
              )}

              {/* Step 4+: CuS constraint */}
              {step >= 4 && (
                <>
                  <line x1={toX(-0.53)} y1={toY(0)} x2={toX(0)} y2={toY(-0.53)}
                    stroke="#dc2626" strokeWidth={1.5} strokeDasharray="6,3" />
                  <circle cx={toX(cusB.cu)} cy={toY(cusB.s)} r={5} fill="#dc2626" stroke="#fff" strokeWidth={1} />
                  <text x={toX(cusB.cu) - 55} y={toY(cusB.s) + 4} fontSize={8} fill="#dc2626" fontWeight={600}>CuS boundary</text>
                  <text x={toX(cusB.cu) - 55} y={toY(cusB.s) + 14} fontSize={8} fill="#dc2626">(-0.37, -0.16)</text>
                  {/* Shade CuS forbidden region on Cu₂S line (Cu-poor side) */}
                  <line x1={toX(cusB.cu)} y1={toY(cusB.s)} x2={toX(cu2sB.cu)} y2={toY(cu2sB.s)}
                    stroke="#dc2626" strokeWidth={4} opacity={0.2} />
                </>
              )}

              {/* Step 5+: CuS₂ constraint */}
              {step >= 5 && (
                <>
                  <line x1={toX(0)} y1={toY(-0.85 / 2)} x2={toX(-0.85)} y2={toY(0)}
                    stroke="#9333ea" strokeWidth={1.5} strokeDasharray="6,3" />
                  <circle cx={toX(cus2B.cu)} cy={toY(cus2B.s)} r={5} fill="#9333ea" stroke="#fff" strokeWidth={1} />
                  <text x={toX(cus2B.cu) + 8} y={toY(cus2B.s) + 4} fontSize={8} fill="#9333ea" fontWeight={600}>CuS{"\u2082"} boundary</text>
                  <text x={toX(cus2B.cu) + 8} y={toY(cus2B.s) + 14} fontSize={8} fill="#9333ea">(-0.14, -0.62)</text>
                  {/* Shade CuS₂ forbidden region on Cu₂S line (Cu-rich side) */}
                  <line x1={toX(cu2sA.cu)} y1={toY(cu2sA.s)} x2={toX(cus2B.cu)} y2={toY(cus2B.s)}
                    stroke="#9333ea" strokeWidth={4} opacity={0.2} />
                </>
              )}

              {/* Step 6: Final stable segment highlighted */}
              {step >= 6 && (
                <>
                  <line x1={toX(cusB.cu)} y1={toY(cusB.s)} x2={toX(cus2B.cu)} y2={toY(cus2B.s)}
                    stroke="#16a34a" strokeWidth={5} opacity={0.9} />
                  <text x={toX(-0.25)} y={toY(-0.35)} fontSize={11} fill="#16a34a" fontWeight={800}>Cu{"\u2082"}S STABLE</text>
                  <text x={toX(-0.25)} y={toY(-0.35) + 14} fontSize={9} fill="#16a34a">{"\u03BC"}_Cu {"\u2208"} [-0.37, -0.14]</text>
                  {/* Phase labels in forbidden regions */}
                  <text x={toX(-0.42)} y={toY(-0.04)} fontSize={10} fill="#dc2626" opacity={0.6}>CuS region</text>
                  <text x={toX(0)} y={toY(-0.80) - 4} fontSize={10} fill="#9333ea" opacity={0.6}>CuS{"\u2082"} region</text>
                </>
              )}
            </svg>
          </div>

          {/* Step explanation */}
          <div style={{ flex: 1, fontSize: 12, lineHeight: 1.8, color: T.ink }}>
            {step === 1 && (
              <div>
                <strong style={{ color: CH.warm }}>Step 1: Set Up Axes</strong>
                <p style={{ margin: "6px 0" }}>
                  For a binary A-B system, we have one degree of freedom. We plot
                  {"\u03BC"}_Cu (x-axis) vs. {"\u03BC"}_S (y-axis).
                </p>
                <p style={{ margin: "6px 0" }}>
                  Both axes range from negative values (element is expensive/scarce) up to 0 (element is at its bulk reference).
                </p>
              </div>
            )}
            {step === 2 && (
              <div>
                <strong style={{ color: CH.warm }}>Step 2: Elemental Bounds</strong>
                <div style={{
                  fontFamily: "monospace", fontSize: 11, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 12px", margin: "6px 0",
                }}>
                  {"\u03BC"}_Cu {"\u2264"} 0 eV<br/>
                  {"\u03BC"}_S  {"\u2264"} 0 eV
                </div>
                <p style={{ margin: "6px 0" }}>
                  If {"\u03BC"}_Cu {">"} 0, metallic Cu would precipitate. If {"\u03BC"}_S {">"} 0, elemental S forms. The red shading shows the <strong>forbidden region</strong>.
                </p>
              </div>
            )}
            {step === 3 && (
              <div>
                <strong style={{ color: CH.warm }}>Step 3: Cu{"\u2082"}S Target Line</strong>
                <div style={{
                  fontFamily: "monospace", fontSize: 11, background: "#2563eb10",
                  border: `1px solid #2563eb22`, borderRadius: 6, padding: "8px 12px", margin: "6px 0",
                  color: "#2563eb",
                }}>
                  2{"\u03BC"}_Cu + {"\u03BC"}_S = -0.90 eV<br/>
                  {"\u21D2"} {"\u03BC"}_S = -0.90 - 2{"\u03BC"}_Cu
                </div>
                <p style={{ margin: "6px 0" }}>
                  This line passes through:<br/>
                  {"\u2022"} Cu-rich end: (0, -0.90)<br/>
                  {"\u2022"} S-rich end: (-0.45, 0)
                </p>
                <p style={{ margin: "6px 0" }}>
                  Cu{"\u2082"}S can only be stable <strong>on this line</strong>.
                </p>
              </div>
            )}
            {step === 4 && (
              <div>
                <strong style={{ color: CH.warm }}>Step 4: CuS Competing Phase</strong>
                <div style={{
                  fontFamily: "monospace", fontSize: 11, background: "#dc262610",
                  border: `1px solid #dc262622`, borderRadius: 6, padding: "8px 12px", margin: "6px 0",
                  color: "#dc2626",
                }}>
                  CuS: {"\u03BC"}_Cu + {"\u03BC"}_S {"\u2264"} -0.53 eV<br/><br/>
                  On Cu{"\u2082"}S line, substitute:<br/>
                  {"\u03BC"}_Cu + (-0.90 - 2{"\u03BC"}_Cu) {"\u2264"} -0.53<br/>
                  -0.90 - {"\u03BC"}_Cu {"\u2264"} -0.53<br/>
                  {"\u03BC"}_Cu {"\u2265"} -0.37 eV
                </div>
                <p style={{ margin: "6px 0" }}>
                  Below {"\u03BC"}_Cu = -0.37, CuS becomes more stable than Cu{"\u2082"}S. The faded red line on the Cu{"\u2082"}S line shows the <strong>excluded segment</strong>.
                </p>
              </div>
            )}
            {step === 5 && (
              <div>
                <strong style={{ color: CH.warm }}>Step 5: CuS{"\u2082"} Competing Phase</strong>
                <div style={{
                  fontFamily: "monospace", fontSize: 11, background: "#9333ea10",
                  border: `1px solid #9333ea22`, borderRadius: 6, padding: "8px 12px", margin: "6px 0",
                  color: "#9333ea",
                }}>
                  CuS{"\u2082"}: {"\u03BC"}_Cu + 2{"\u03BC"}_S {"\u2264"} -0.85 eV<br/><br/>
                  On Cu{"\u2082"}S line, substitute:<br/>
                  {"\u03BC"}_Cu + 2(-0.90 - 2{"\u03BC"}_Cu) {"\u2264"} -0.85<br/>
                  -1.80 + 3{"\u03BC"}_Cu {"\u2264"} -0.85 {"\u2192"} {"\u03BC"}_Cu {"\u2264"} -0.14 {"\u2245"} 0.32
                </div>
                <p style={{ margin: "6px 0" }}>
                  Above {"\u03BC"}_Cu = -0.14 (too Cu-rich / S-poor), CuS{"\u2082"} is excluded. The faded purple line shows the excluded Cu-rich segment.
                </p>
              </div>
            )}
            {step === 6 && (
              <div>
                <strong style={{ color: "#16a34a" }}>Step 6: Final Result</strong>
                <div style={{
                  background: "#16a34a10", border: `1.5px solid #16a34a22`,
                  borderRadius: 8, padding: "10px 14px", margin: "6px 0",
                }}>
                  <strong style={{ color: "#16a34a" }}>Cu{"\u2082"}S stability window:</strong><br/>
                  {"\u03BC"}_Cu {"\u2208"} [-0.37, -0.14] eV<br/>
                  {"\u03BC"}_S  {"\u2208"} [-0.62, -0.16] eV<br/>
                  <strong>Width: 0.23 eV</strong>
                </div>
                <p style={{ margin: "6px 0" }}>
                  The green segment is where Cu{"\u2082"}S is stable against <em>all</em> competing phases. Moving left enters the CuS region; moving right enters CuS{"\u2082"}.
                </p>
                <p style={{ margin: "6px 0", fontWeight: 600, color: CH.accent }}>
                  This is the complete chemical potential diagram for Cu{"\u2082"}S!
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title={"Summary of Calculations"} color={CH.hull}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${CH.hull}` }}>
                  {["Constraint", "Equation", "Boundary Value on Cu\u2082S Line", "Excludes"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: CH.hull, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Cu\u2082S stability", eq: "2\u03BC_Cu + \u03BC_S = -0.90", bound: "Entire line", excl: "\u2014" },
                  { name: "\u03BC_Cu \u2264 0", eq: "\u03BC_Cu = 0", bound: "\u03BC_Cu = 0, \u03BC_S = -0.90", excl: "Cu-rich beyond 0" },
                  { name: "\u03BC_S \u2264 0", eq: "\u03BC_S = 0", bound: "\u03BC_Cu = -0.45, \u03BC_S = 0", excl: "S-rich beyond -0.45" },
                  { name: "No CuS", eq: "\u03BC_Cu + \u03BC_S \u2264 -0.53", bound: "\u03BC_Cu = -0.37", excl: "Cu-poor side (\u03BC_Cu < -0.37)" },
                  { name: "No CuS\u2082", eq: "\u03BC_Cu + 2\u03BC_S \u2264 -0.85", bound: "\u03BC_Cu = -0.14", excl: "Cu-rich side (\u03BC_Cu > -0.14)" },
                ].map(row => (
                  <tr key={row.name} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "6px 8px", fontWeight: 600 }}>{row.name}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace", fontSize: 10 }}>{row.eq}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace", fontSize: 10 }}>{row.bound}</td>
                    <td style={{ padding: "6px 8px", fontSize: 10, color: T.muted }}>{row.excl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            background: CH.stable + "0a", border: `1.5px solid ${CH.stable}22`,
            borderRadius: 10, padding: "14px 18px", marginTop: 12,
          }}>
            <strong style={{ color: CH.stable }}>Result:</strong> From 5 DFT numbers, we built the complete stability diagram.
            Cu{"\u2082"}S is stable in a 0.23 eV window. CuS and CuS{"\u2082"} each steal part of the line. This is the <strong>exact same method</strong> used for CZTS {"\u2014"} just with more dimensions and more competing phases.
          </div>
        </div>
      </Card>

      <Card title={"From Binary to Quaternary: Increasing Complexity"} color={CH.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          {[
            { system: "Binary (A-B)", dim: "1D (line)", vars: "1 free \u03BC", example: "Cu-S: \u03BC_Cu determines everything", color: CH.main },
            { system: "Ternary (A-B-C)", dim: "2D (polygon)", vars: "2 free \u03BC\u2019s", example: "Cu-Zn-S: plot \u03BC_Cu vs. \u03BC_Zn", color: CH.hull },
            { system: "Quaternary (A-B-C-D)", dim: "3D \u2192 2D slices", vars: "3 free \u03BC\u2019s", example: "Cu-Zn-Sn-S: fix \u03BC_Sn, plot \u03BC_Cu vs. \u03BC_Zn", color: CH.warm },
            { system: "Quinary (A-B-C-D-E)", dim: "4D \u2192 2D slices", vars: "4 free \u03BC\u2019s", example: "High-entropy alloys: multiple 2D projections needed", color: CH.accent },
          ].map(({ system, dim, vars, example, color }) => (
            <div key={system} style={{
              marginBottom: 8, padding: "10px 14px", borderRadius: 8,
              background: color + "08", border: `1px solid ${color}18`,
              display: "flex", gap: 14,
            }}>
              <div style={{ flex: "0 0 130px" }}>
                <div style={{ fontWeight: 700, color }}>{system}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{dim}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.ink }}>{vars}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{example}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Computational Tools"} color={CH.stable}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Several software packages automate chemical potential diagram construction:
          {[
            { tool: "pymatgen (Python Materials Genomics)", use: "PhaseDiagram and ChemicalPotentialDiagram classes. Direct interface with Materials Project API.", color: CH.main },
            { tool: "CPLAP (Chemical Potential Landscape Analysis Program)", use: "Solves the linear programming problem to find stability regions. Works with any DFT code output.", color: CH.hull },
            { tool: "Materials Project Website", use: "Pre-computed phase diagrams for 150,000+ compounds. Interactive chemical potential plots.", color: CH.accent },
          ].map(({ tool, use, color }) => (
            <div key={tool} style={{
              marginBottom: 8, padding: "10px 14px", borderRadius: 8,
              background: color + "08", border: `1px solid ${color}18`,
            }}>
              <strong style={{ color, fontSize: 12 }}>{tool}</strong>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{use}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const CH_BLOCKS = [
  { id: "overview", label: "Introduction", color: T.ch_main },
  { id: "convexhull", label: "Convex Hull Analysis", color: T.ch_hull },
  { id: "chempotdiagram", label: "Thermodynamics & Chemical Potential Diagram", color: T.ch_accent },
];

const CH_SECTIONS = [
  // Block 1: Introduction
  { id: "overview", block: "overview", label: "What is a Computational Phase Diagram?", color: T.ch_main, Component: CHOverviewSection, nextReason: "The big picture is clear \u2014 computational phase diagrams map stability from DFT. The first tool is the convex hull: a plot of formation energy vs. composition that identifies which phases are thermodynamically stable." },
  // Block 2: Convex Hull Analysis
  { id: "intro", block: "convexhull", label: "What is a Convex Hull?", color: T.ch_main, Component: CHIntroSection, nextReason: "The concept is clear \u2014 a convex hull is the lower boundary of phase stability. Now we need the raw data: DFT-computed total energies for all candidate Cu-S phases to populate it." },
  { id: "setup", block: "convexhull", label: "DFT Input Data", color: T.ch_main, Component: CHSetupSection, nextReason: "Raw DFT total energies include contributions from reference elemental atoms. Formation energy subtracts these references, giving the thermodynamic stability of each compound relative to its pure elements." },
  { id: "form", block: "convexhull", label: "Formation Energy", color: T.ch_hull, Component: CHFormSection, nextReason: "Formation energies are computed for every phase. Now we construct the convex hull \u2014 the lower boundary of the formation energy vs. composition plot \u2014 which separates stable from unstable phases." },
  { id: "hull", block: "convexhull", label: "Build the Hull", color: T.ch_hull, Component: CHHullSection, nextReason: "The hull is built. The energy above hull quantifies how far each compound lies above it \u2014 phases on the hull are stable; those above it are metastable and will tend to decompose into hull phases." },
  { id: "above", block: "convexhull", label: "Energy Above Hull", color: T.ch_unstab, Component: CHAboveSection, nextReason: "Individual stability values computed. The final results panel assembles everything into a comprehensive stability map \u2014 all Cu-S phases ranked, colored by stability, showing which are synthesizable." },
  { id: "results", block: "convexhull", label: "Final Results & Plot", color: T.ch_stable, Component: CHResultsSection, nextReason: "T = 0 K convex hull complete. Real synthesis happens at finite temperature \u2014 thermodynamic corrections and chemical potentials connect the hull to experimental conditions." },
  // Block 3: Thermodynamics & Chemical Potential Diagram
  { id: "thermo", block: "chempotdiagram", label: "Thermodynamics", color: T.ch_accent, Component: CHThermoSection, nextReason: "Free energies set bulk stability. Chemical potentials now define the synthesis atmosphere \u2014 how oxidizing or reducing, how metal-rich or poor \u2014 under which a desired phase can grow." },
  { id: "chempot", block: "chempotdiagram", label: "Chemical Potential Basics", color: T.ch_warm, Component: CHChemPotSection, nextReason: "Binary chemical potentials mastered. Now we see what a chemical potential diagram looks like \u2014 a 2D map showing which phase is stable under which conditions." },
  { id: "chemdiagram", block: "chempotdiagram", label: "What is a Chem. Pot. Diagram?", color: T.ch_warm, Component: CHChemDiagramSection, nextReason: "The concept is clear. Now learn how to construct a chemical potential diagram step by step with a full numerical example \u2014 from DFT energies to inequality constraints to the final stability polygon." },
  { id: "czts", block: "chempotdiagram", label: "CZTS Example (Cu\u2082ZnSnS\u2084)", color: T.ch_accent, Component: CHCZTSSection, nextReason: "CZTS competing phases identified. Now build the chemical potential diagram step by step with a full numerical example \u2014 from DFT energies to inequality constraints to the final stability polygon." },
  { id: "chemconstruct", block: "chempotdiagram", label: "Build the Diagram (Numerical)", color: T.ch_hull, Component: CHChemConstructSection, nextReason: "Computational phase diagrams fully characterized. Chapter 5 (Defects in Semiconductors) applies this framework to charged defects \u2014 where formation energy becomes Fermi-level dependent." },
];

function ConvexHullModule() {
  const [active, setActive] = useState("overview");
  const [activeBlock, setActiveBlock] = useState("overview");
  const sec = CH_SECTIONS.find(s => s.id === active) || CH_SECTIONS[0];
  const Component = sec.Component;
  const blockSections = CH_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink, display: "flex", flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{ display: "flex", padding: "8px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto" }}>
        {CH_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); const first = CH_SECTIONS.find(s => s.block === b.id); if (first) setActive(first.id); }} style={{
            padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg, color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5, whiteSpace: "nowrap",
          }}>{b.label}</button>
        ))}
      </div>
      {/* Section tabs */}
      <div style={{ display: "flex", padding: "6px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {blockSections.map(s => {
          const globalIdx = CH_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px", borderRadius: 8, border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg, color: active === s.id ? s.color : T.muted,
              cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
              display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: sec.color, letterSpacing: 0.5 }}>{sec.label}</div>
        </div>
        <Component />
        {sec.nextReason && (
          <div style={{ marginTop: 28, padding: "14px 18px", borderRadius: 10, background: sec.color + "0a", border: `1.5px solid ${sec.color}22`, borderLeft: `4px solid ${sec.color}` }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => { const idx = CH_SECTIONS.findIndex(s => s.id === active); const next = CH_SECTIONS[idx + 1]; return next ? <span> Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>.</span> : null; })()}
            </div>
          </div>
        )}
        <ChapterReferences chapterId="convexhull" />
      </div>
      {/* Bottom nav with dot indicators */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel }}>
        <button onClick={() => { const i = CH_SECTIONS.findIndex(s => s.id === active); if (i > 0) { setActive(CH_SECTIONS[i-1].id); setActiveBlock(CH_SECTIONS[i-1].block); } }} disabled={active === CH_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CH_SECTIONS[0].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === CH_SECTIONS[0].id ? T.border : sec.color}`, color: active === CH_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === CH_SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Previous</button>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {CH_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: 7, height: 7, borderRadius: 4, background: active === s.id ? s.color : s.block === activeBlock ? s.color + "44" : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
        <button onClick={() => { const i = CH_SECTIONS.findIndex(s => s.id === active); if (i < CH_SECTIONS.length - 1) { setActive(CH_SECTIONS[i+1].id); setActiveBlock(CH_SECTIONS[i+1].block); } }} disabled={active === CH_SECTIONS[CH_SECTIONS.length-1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CH_SECTIONS[CH_SECTIONS.length-1].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === CH_SECTIONS[CH_SECTIONS.length-1].id ? T.border : sec.color}`, color: active === CH_SECTIONS[CH_SECTIONS.length-1].id ? T.muted : sec.color,
          cursor: active === CH_SECTIONS[CH_SECTIONS.length-1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

const FNV_STEPS = [
  { id: "problem",   label: "The Problem",              icon: "⚠️", color: T.fnv_warn,   nextReason: "The artifact is identified — periodic images of charged defects interact spuriously. FNV provides a systematic correction. The next step explains what FNV actually is and why a model charge is the key to removing the error." },
  { id: "overview",  label: "What is FNV?",             icon: "📖", color: T.fnv_main,   nextReason: "The strategy is clear: use a model charge to represent the defect analytically. The next step defines this model charge precisely — its shape, localization, and why it must match the DFT charge density near the defect." },
  { id: "model",     label: "Model Charge",             icon: "🔵", color: T.fnv_elec,   nextReason: "The model charge is defined. We now compute its electrostatic self-interaction energy — the Madelung-like periodic image energy that must be subtracted to isolate the true single-defect formation energy." },
  { id: "elec",      label: "Electrostatic Correction", icon: "⚡", color: T.fnv_elec,   nextReason: "Long-range electrostatics corrected. A residual constant offset still exists between the defect supercell and bulk reference potentials. Potential alignment removes this offset using the far-field region of the LOCPOT files." },
  { id: "align",     label: "Potential Alignment",      icon: "📏", color: T.fnv_align,  nextReason: "Theory complete. Abstract formulas become concrete numbers in the numerical example — a real V_Cd calculation in CdTe showing every correction term, the LOCPOT alignment, and the final corrected formation energy." },
  { id: "example",   label: "Numerical Example",        icon: "🔢", color: T.fnv_accent, nextReason: "One example computed. Validation confirms the correction works: formation energy should converge as supercell size increases. The code section shows how to implement FNV in a real VASP/Python workflow." },
  { id: "validate",  label: "Validation & Code",        icon: "✅", color: T.fnv_align,  nextReason: "FNV correction mastered. The corrected defect formation energies feed directly into Chapter 10 (Solar Defects) where charge transition levels and defect diagrams predict device-relevant recombination behavior." },
];

function FNVCorrectionModule() {
  const [active, setActive] = useState("problem");
  const stepIdx = FNV_STEPS.findIndex(s => s.id === active);

  const F = {
    main:   T.fnv_main,
    elec:   T.fnv_elec,
    align:  T.fnv_align,
    warn:   T.fnv_warn,
    accent: T.fnv_accent,
    warm:   T.fnv_warm,
  };

  const mathBlock = {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13, lineHeight: 2.0,
    background: F.main + "08", border: `1px solid ${F.main}20`,
    borderRadius: 10, padding: "14px 18px", marginBottom: 12,
    overflowX: "auto", color: T.ink,
  };
  const hl = (val, color) => <span style={{ fontWeight: 700, color: color || F.main, fontFamily: "monospace" }}>{val}</span>;
  const badge = (text, color) => (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 6,
      background: color + "15", border: `1px solid ${color}35`,
      color, fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    }}>{text}</span>
  );

  // ── Potential alignment SVG plot ──
  const AlignmentPlot = () => {
    const W = 520, H = 220, pad = { t: 25, r: 30, b: 40, l: 55 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

    // Generate fake ΔV(r) curve: messy near defect, flat plateau far away
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const r = i / 100;
      let v;
      if (r < 0.15) v = 0.5 * Math.sin(r * 60) * Math.exp(-r * 8) + 0.12;
      else if (r < 0.3) v = 0.12 + 0.08 * Math.exp(-(r - 0.15) * 15) * Math.sin(r * 30);
      else v = 0.12 + 0.003 * Math.sin(r * 10) * Math.exp(-(r - 0.3) * 4);
      pts.push({ r, v });
    }

    const toX = r => pad.l + r * pw;
    const toY = v => pad.t + (0.6 - v) / 0.7 * ph;

    const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.r).toFixed(1)},${toY(p.v).toFixed(1)}`).join(" ");

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
        <defs>
          <linearGradient id="fnvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={F.main} stopOpacity="0.05" />
            <stop offset="100%" stopColor={F.elec} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="url(#fnvGrad)" rx="4" />

        {/* Grid */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(r => (
          <line key={`g${r}`} x1={toX(r)} y1={pad.t} x2={toX(r)} y2={H - pad.b}
            stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
        ))}

        {/* ΔV plateau line */}
        <line x1={toX(0.3)} y1={toY(0.12)} x2={toX(1)} y2={toY(0.12)}
          stroke={F.align} strokeWidth="1.5" strokeDasharray="6,3" />
        <text x={toX(1) - 4} y={toY(0.12) - 8} textAnchor="end"
          fill={F.align} fontSize="11" fontWeight="700">{"\u0394V = +0.12 V"}</text>

        {/* The curve */}
        <path d={pathD} fill="none" stroke={F.main} strokeWidth="2" />

        {/* Regions */}
        <rect x={toX(0)} y={pad.t} width={toX(0.25) - toX(0)} height={ph}
          fill={F.warn} fillOpacity="0.06" />
        <text x={toX(0.12)} y={H - pad.b - 6} textAnchor="middle"
          fill={F.warn} fontSize="9" fontWeight="600">NEAR DEFECT</text>
        <text x={toX(0.12)} y={H - pad.b + 2} textAnchor="middle"
          fill={F.warn} fontSize="8">(messy)</text>

        <rect x={toX(0.35)} y={pad.t} width={toX(1) - toX(0.35)} height={ph}
          fill={F.align} fillOpacity="0.04" />
        <text x={toX(0.67)} y={H - pad.b - 6} textAnchor="middle"
          fill={F.align} fontSize="9" fontWeight="600">FAR FROM DEFECT</text>
        <text x={toX(0.67)} y={H - pad.b + 2} textAnchor="middle"
          fill={F.align} fontSize="8">(plateau = read {"\u0394V"} here)</text>

        {/* Axes */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fill={T.muted} fontSize="10" fontWeight="600">
          Distance from defect
        </text>
        <text x={10} y={H / 2} textAnchor="middle" fill={T.muted} fontSize="10" fontWeight="600"
          transform={`rotate(-90, 10, ${H / 2})`}>
          {"\u0394V(r) (V)"}
        </text>
      </svg>
    );
  };

  // ── Supercell diagram SVG ──
  const SupercellDiagram = () => {
    const W = 440, H = 130;
    const cells = [0, 1, 2, 3, 4];
    const cw = 80, gap = 6, startX = (W - cells.length * (cw + gap)) / 2;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 460, display: "block", margin: "0 auto" }}>
        {cells.map(i => {
          const x = startX + i * (cw + gap);
          return (
            <g key={i}>
              <rect x={x} y={15} width={cw} height={70} rx="6"
                fill={F.main + "0a"} stroke={F.main + "40"} strokeWidth="1.5" />
              {/* Defect symbol */}
              <rect x={x + cw / 2 - 8} y={35} width={16} height={16} rx="3"
                fill={F.warn + "25"} stroke={F.warn} strokeWidth="1.5" />
              <text x={x + cw / 2} y={47} textAnchor="middle"
                fill={F.warn} fontSize="10" fontWeight="700">{"V"}</text>
              <text x={x + cw / 2} y={72} textAnchor="middle"
                fill={T.muted} fontSize="9">defect</text>
            </g>
          );
        })}
        {/* Arrows between cells */}
        {[0, 1, 2, 3].map(i => {
          const x = startX + (i + 1) * (cw + gap) - gap / 2;
          return (
            <text key={`arr${i}`} x={x} y={50} textAnchor="middle"
              fill={F.warn} fontSize="14">{"\u2194"}</text>
          );
        })}
        <text x={W / 2} y={105} textAnchor="middle" fill={F.warn} fontSize="11" fontWeight="600">
          Charged defects interact with their own periodic images!
        </text>
        <text x={W / 2} y={120} textAnchor="middle" fill={T.muted} fontSize="10">
          {"\u2190"} infinite periodic copies {"\u2192"}
        </text>
      </svg>
    );
  };

  const renderSection = () => {
    switch (active) {

    case "problem": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="The Periodic Supercell Problem" color={F.warn}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 14 }}>
            When you calculate a <strong style={{ color: F.main }}>charged defect</strong> in DFT
            (e.g., a Cu vacancy with charge {hl("-1", F.warn)} in CuInSe{"\u2082"}), you use a
            periodic supercell {"\u2014"} your defect repeats infinitely in all directions:
          </div>
          <SupercellDiagram />
        </Card>

        <Card title="Two Serious Problems" color={F.main}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{
              background: F.warn + "08", border: `1px solid ${F.warn}22`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", marginBottom: 8,
                background: F.warn + "18", border: `1.5px solid ${F.warn}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: F.warn,
              }}>1</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: F.warn, marginBottom: 6 }}>
                Image Charge Interaction
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                Your charged defect {"\u201C"}talks{"\u201D"} to its own periodic copies. In reality, an isolated
                defect doesn{"'"}t interact with itself {"\u2014"} but in a DFT supercell it does.
                This artificially shifts your energy.
              </div>
            </div>
            <div style={{
              background: F.elec + "08", border: `1px solid ${F.elec}22`,
              borderRadius: 10, padding: "14px 16px",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", marginBottom: 8,
                background: F.elec + "18", border: `1.5px solid ${F.elec}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: F.elec,
              }}>2</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: F.elec, marginBottom: 6 }}>
                Jellium Background Charge
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                DFT codes add a uniform opposite charge (jellium) across the whole cell to keep
                it charge-neutral. This is a mathematical trick but introduces a spurious energy
                contribution.
              </div>
            </div>
          </div>
          <div style={{
            background: F.accent + "0a", border: `1px solid ${F.accent}22`,
            borderRadius: 10, padding: "12px 16px", marginTop: 14, fontSize: 12,
            color: F.accent, fontWeight: 600, textAlign: "center", lineHeight: 1.6,
          }}>
            Both errors shrink with larger supercells {"\u2014"} but infinite supercells are too expensive.
            You need a correction.
          </div>
        </Card>
      </div>
    );

    case "overview": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="What FNV Stands For" color={F.main}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink }}>
            <strong style={{ color: F.main }}>F</strong>reysoldt,{" "}
            <strong style={{ color: F.main }}>N</strong>eugebauer, and{" "}
            <strong style={{ color: F.main }}>V</strong>an de Walle {"\u2014"} the three authors
            of the 2009 <em>Physical Review Letters</em> paper that introduced this correction scheme.
            It is now the <strong>standard method</strong> used in virtually all charged defect calculations.
          </div>
        </Card>

        <Card title="The Core Idea" color={F.accent}>
          <div style={{
            background: F.accent + "0a", border: `1.5px solid ${F.accent}30`,
            borderRadius: 10, padding: "14px 18px", marginBottom: 14,
            fontSize: 14, fontWeight: 600, color: F.accent, textAlign: "center", lineHeight: 1.6,
          }}>
            {"\u201C"}The error in your DFT total energy comes entirely from long-range electrostatics.
            We can calculate exactly what that error is, and subtract it out.{"\u201D"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            The total correction has two parts:
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 2, background: T.surface, borderRadius: 10, padding: "16px 20px", border: `1px solid ${T.border}40` }}>
            <div>E_FNV = (E_iso {"\u2212"} E_periodic) + q {"\u00D7"} {"\u0394"}V</div>
            <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: `2px solid ${F.elec}`, width: 175, marginLeft: 48 }} />
                <div style={{ color: F.elec, fontSize: 11, fontWeight: 600, marginTop: 4 }}>electrostatic correction</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: `2px solid ${F.align}`, width: 72, marginLeft: 8 }} />
                <div style={{ color: F.align, fontSize: 11, fontWeight: 600, marginTop: 4 }}>potential alignment</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "E_iso", desc: "Energy of an isolated defect charge (no periodic copies)", color: F.elec },
              { label: "E_periodic", desc: "Energy of periodically repeated defect charge (what DFT computes)", color: F.warn },
              { label: "q \u00D7 \u0394V", desc: "Potential alignment correcting the jellium background shift", color: F.align },
            ].map(item => (
              <div key={item.label} style={{
                background: item.color + "08", border: `1px solid ${item.color}20`,
                borderRadius: 10, padding: "12px 14px", textAlign: "center",
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Full Formation Energy Formula" color={F.main}>
          <div style={mathBlock}>
            E_form(q) = E_DFT(defect,q) {"\u2212"} E_DFT(host) {"\u2212"} {"\u03A3"} n{"\u1D62"}{"\u03BC"}{"\u1D62"} + qE_F + <span style={{ color: F.main, fontWeight: 700 }}>E_FNV</span><br />
            <span style={{ color: T.muted }}>{"                                                    \u2191"}</span><br />
            <span style={{ color: F.main }}>{"                                               add FNV here"}</span>
          </div>
        </Card>
      </div>
    );

    case "model": {
      // Gaussian curve SVG
      const GaussianPlot = () => {
        const W = 520, H = 260, pad = { t: 30, r: 30, b: 45, l: 60 };
        const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

        const sigmas = [
          { s: 0.5, color: F.warn,   label: "\u03C3 = 0.5 \u00C5" },
          { s: 1.0, color: F.main,   label: "\u03C3 = 1.0 \u00C5" },
          { s: 1.5, color: F.elec,   label: "\u03C3 = 1.5 \u00C5" },
          { s: 2.0, color: F.align,  label: "\u03C3 = 2.0 \u00C5" },
        ];

        const rMax = 5.0;
        const rhoMax = 0.72; // max density for σ=0.5
        const toX = r => pad.l + ((r + rMax) / (2 * rMax)) * pw;
        const toY = rho => pad.t + (rhoMax - rho) / rhoMax * ph;

        const makePath = (sigma) => {
          const pts = [];
          for (let i = 0; i <= 200; i++) {
            const r = -rMax + (i / 200) * 2 * rMax;
            const norm = 1 / (sigma * Math.sqrt(2 * Math.PI));
            const rho = norm * Math.exp(-(r * r) / (2 * sigma * sigma));
            pts.push(`${i === 0 ? "M" : "L"}${toX(r).toFixed(1)},${toY(rho).toFixed(1)}`);
          }
          return pts.join(" ");
        };

        const makeFill = (sigma, color) => {
          const pts = [`M${toX(-rMax).toFixed(1)},${toY(0).toFixed(1)}`];
          for (let i = 0; i <= 200; i++) {
            const r = -rMax + (i / 200) * 2 * rMax;
            const norm = 1 / (sigma * Math.sqrt(2 * Math.PI));
            const rho = norm * Math.exp(-(r * r) / (2 * sigma * sigma));
            pts.push(`L${toX(r).toFixed(1)},${toY(rho).toFixed(1)}`);
          }
          pts.push(`L${toX(rMax).toFixed(1)},${toY(0).toFixed(1)} Z`);
          return pts.join(" ");
        };

        return (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
            <defs>
              <linearGradient id="gaussBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={F.main} stopOpacity="0.04" />
                <stop offset="100%" stopColor={F.elec} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="url(#gaussBg)" rx="4" />

            {/* Grid */}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(r => (
              <line key={`gr${r}`} x1={toX(r)} y1={pad.t} x2={toX(r)} y2={H - pad.b}
                stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
            ))}
            {[0, 0.2, 0.4, 0.6].map(rho => (
              <line key={`gd${rho}`} x1={pad.l} y1={toY(rho)} x2={W - pad.r} y2={toY(rho)}
                stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
            ))}

            {/* Zero line (x-axis) */}
            <line x1={pad.l} y1={toY(0)} x2={W - pad.r} y2={toY(0)}
              stroke={T.muted} strokeWidth="1" />
            {/* Center line */}
            <line x1={toX(0)} y1={pad.t} x2={toX(0)} y2={H - pad.b}
              stroke={T.muted} strokeWidth="1" strokeDasharray="5,3" />
            <text x={toX(0)} y={pad.t - 6} textAnchor="middle" fill={T.muted} fontSize="9">defect site</text>

            {/* Gaussian fills (draw lighter ones first) */}
            {[...sigmas].reverse().map(({ s, color }) => (
              <path key={`fill${s}`} d={makeFill(s, color)} fill={color} fillOpacity="0.08" />
            ))}

            {/* Gaussian curves */}
            {sigmas.map(({ s, color, label }) => (
              <path key={`line${s}`} d={makePath(s)} fill="none" stroke={color} strokeWidth="2" />
            ))}

            {/* Legend */}
            {sigmas.map(({ s, color, label }, i) => (
              <g key={`leg${s}`}>
                <line x1={W - pad.r - 100} y1={pad.t + 12 + i * 18} x2={W - pad.r - 80} y2={pad.t + 12 + i * 18}
                  stroke={color} strokeWidth="2.5" />
                <text x={W - pad.r - 75} y={pad.t + 16 + i * 18} fill={color} fontSize="10" fontWeight="600">{label}</text>
              </g>
            ))}

            {/* Axes labels */}
            <text x={W / 2} y={H - 6} textAnchor="middle" fill={T.muted} fontSize="11" fontWeight="600">
              Distance r ({"\u00C5"})
            </text>
            <text x={12} y={H / 2} textAnchor="middle" fill={T.muted} fontSize="11" fontWeight="600"
              transform={`rotate(-90, 12, ${H / 2})`}>
              {"\u03C1(r) (\u00C5\u207B\u00B3)"}
            </text>

            {/* X ticks */}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(r => (
              <text key={`xt${r}`} x={toX(r)} y={H - pad.b + 14} textAnchor="middle"
                fill={T.muted} fontSize="9" fontFamily="monospace">{r}</text>
            ))}
            {/* Y ticks */}
            {[0, 0.2, 0.4, 0.6].map(rho => (
              <text key={`yt${rho}`} x={pad.l - 6} y={toY(rho) + 4} textAnchor="end"
                fill={T.muted} fontSize="9" fontFamily="monospace">{rho.toFixed(1)}</text>
            ))}
          </svg>
        );
      };

      return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Step 1 - Model the Defect Charge" color={F.main}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            FNV models the defect as a <strong style={{ color: F.main }}>Gaussian charge distribution</strong> centered
            at the defect site:
          </div>
          <div style={mathBlock}>
            {"\u03C1"}_model(r) = q {"\u00D7"} (1/{"\u03C3\u221A"}2{"\u03C0"}){"\u00B3"} {"\u00D7"} exp({"\u2212"}r{"\u00B2"}/2{"\u03C3\u00B2"})<br /><br />
            <span style={{ color: T.muted }}>q = defect charge, {"\u03C3"} = Gaussian width (typically 1{"\u20132"} {"\u00C5"})</span>
          </div>
          <div style={{
            background: F.accent + "0a", border: `1px solid ${F.accent}22`,
            borderRadius: 10, padding: "12px 16px", fontSize: 12, lineHeight: 1.6, marginBottom: 14,
          }}>
            <strong style={{ color: F.accent }}>Why Gaussian?</strong> Because the electrostatic potential of a
            Gaussian charge can be calculated <em>analytically</em> {"\u2014"} both for an isolated charge and
            for a periodic array. This is the mathematical trick that makes FNV work.
          </div>
        </Card>

        <Card title={"Isolated Gaussian Charge - varying \u03C3"} color={F.elec}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
            <strong>Single isolated defect charge.</strong> Smaller {hl("\u03C3", F.warn)} = sharper,
            more localized (closer to a point charge).
            Larger {hl("\u03C3", F.align)} = broader, more spread out. Total charge (area) is always q.
          </div>
          <GaussianPlot />
        </Card>

        <Card title={"Periodic Array of Gaussian Charges"} color={F.warn}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
            <strong>This is what DFT actually computes.</strong> Your charged defect is repeated at
            every lattice point. The Gaussians from neighboring cells overlap, creating spurious
            interactions. The {hl("E_periodic", F.warn)} term captures this energy.
          </div>
          {(() => {
            const W = 520, H = 220, pad = { t: 25, r: 20, b: 45, l: 55 };
            const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
            const sigma = 1.0;
            const L = 6.0;
            const rMin = -9, rMax = 9;
            const toX = r => pad.l + (r - rMin) / (rMax - rMin) * pw;
            const rhoMax = 0.45;
            const toY = rho => pad.t + (rhoMax - rho) / (rhoMax + 0.02) * ph;

            // Sum of Gaussians from periodic images at -2L, -L, 0, L, 2L
            const images = [-2, -1, 0, 1, 2];
            const gaussSum = (r) => {
              let sum = 0;
              for (const n of images) {
                const d = r - n * L;
                sum += (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(d * d) / (2 * sigma * sigma));
              }
              return sum;
            };

            // Single isolated Gaussian
            const gaussSingle = (r) => {
              return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(r * r) / (2 * sigma * sigma));
            };

            const N = 300;
            const ptsSum = [], ptsSingle = [];
            for (let i = 0; i <= N; i++) {
              const r = rMin + (i / N) * (rMax - rMin);
              ptsSum.push({ r, v: gaussSum(r) });
              ptsSingle.push({ r, v: gaussSingle(r) });
            }

            const toPath = (pts) => pts.map((p, i) =>
              `${i === 0 ? "M" : "L"}${toX(p.r).toFixed(1)},${toY(p.v).toFixed(1)}`
            ).join(" ");

            const toFill = (pts) => {
              let d = `M${toX(rMin).toFixed(1)},${toY(0).toFixed(1)} `;
              d += pts.map(p => `L${toX(p.r).toFixed(1)},${toY(p.v).toFixed(1)}`).join(" ");
              d += ` L${toX(rMax).toFixed(1)},${toY(0).toFixed(1)} Z`;
              return d;
            };

            return (
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
                <defs>
                  <linearGradient id="perGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={F.warn} stopOpacity="0.05" />
                    <stop offset="100%" stopColor={F.elec} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="url(#perGrad)" rx="4" />

                {/* Cell boundaries */}
                {images.map(n => (
                  <g key={`cell${n}`}>
                    <line x1={toX(n * L - L / 2)} y1={pad.t} x2={toX(n * L - L / 2)} y2={H - pad.b}
                      stroke={T.border} strokeWidth="1" strokeDasharray="4,3" />
                    {n >= -1 && n <= 1 && (
                      <text x={toX(n * L)} y={pad.t + 14} textAnchor="middle"
                        fill={n === 0 ? F.warn : T.dim} fontSize="9" fontWeight={n === 0 ? 700 : 400}>
                        {n === 0 ? "original cell" : `image ${n > 0 ? "+" : ""}${n}`}
                      </text>
                    )}
                  </g>
                ))}

                {/* x-axis */}
                <line x1={pad.l} y1={toY(0)} x2={W - pad.r} y2={toY(0)}
                  stroke={T.muted} strokeWidth="1" />

                {/* Isolated single Gaussian (faded) */}
                <path d={toFill(ptsSingle)} fill={F.elec} fillOpacity="0.06" />
                <path d={toPath(ptsSingle)} fill="none" stroke={F.elec} strokeWidth="1.5" strokeDasharray="5,3" />

                {/* Periodic sum fill */}
                <path d={toFill(ptsSum)} fill={F.warn} fillOpacity="0.10" />
                {/* Periodic sum curve */}
                <path d={toPath(ptsSum)} fill="none" stroke={F.warn} strokeWidth="2.5" />

                {/* Legend */}
                <line x1={W - pad.r - 155} y1={pad.t + 34} x2={W - pad.r - 135} y2={pad.t + 34}
                  stroke={F.warn} strokeWidth="2.5" />
                <text x={W - pad.r - 130} y={pad.t + 38} fill={F.warn} fontSize="10" fontWeight="600">
                  Periodic sum (DFT sees this)
                </text>
                <line x1={W - pad.r - 155} y1={pad.t + 52} x2={W - pad.r - 135} y2={pad.t + 52}
                  stroke={F.elec} strokeWidth="1.5" strokeDasharray="5,3" />
                <text x={W - pad.r - 130} y={pad.t + 56} fill={F.elec} fontSize="10" fontWeight="600">
                  Single isolated (reality)
                </text>

                {/* Axes */}
                <text x={W / 2} y={H - 6} textAnchor="middle" fill={T.muted} fontSize="11" fontWeight="600">
                  {"Distance (\u00C5)"}
                </text>
                <text x={10} y={H / 2} textAnchor="middle" fill={T.muted} fontSize="10" fontWeight="600"
                  transform={`rotate(-90, 10, ${H / 2})`}>
                  {"\u03C1(r)"}
                </text>

                {/* X ticks */}
                {[-6, -3, 0, 3, 6].map(r => (
                  <text key={`xp${r}`} x={toX(r)} y={H - pad.b + 14} textAnchor="middle"
                    fill={T.muted} fontSize="9" fontFamily="monospace">{r}</text>
                ))}

                {/* Overlap annotation */}
                <text x={toX(3)} y={toY(gaussSum(3)) - 8} textAnchor="middle"
                  fill={F.warn} fontSize="9" fontWeight="700">overlap!</text>
              </svg>
            );
          })()}
          <div style={{
            background: F.warn + "0a", border: `1px solid ${F.warn}22`,
            borderRadius: 8, padding: "10px 14px", marginTop: 12, fontSize: 12, lineHeight: 1.6,
          }}>
            <strong style={{ color: F.warn }}>The difference between the orange and blue curves is the error.</strong>{" "}
            FNV calculates E_periodic (orange) and E_iso (blue) analytically, then subtracts to remove
            the spurious image interactions.
          </div>
        </Card>

        <Card title="Numerical Example - Gaussian Charge for V_Cu (q = -1)" color={F.main}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
            Calculate the charge density at the defect center (r = 0) and at r = 1.5 {"\u00C5"} for
            {" "}{hl("\u03C3 = 1.0 \u00C5", F.main)}, {hl("q = \u22121 e", F.warn)}
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.main, fontWeight: 700 }}>At r = 0 (defect center):</span><br />
            {"\u03C1"}(0) = q {"\u00D7"} (1/{"\u03C3\u221A"}2{"\u03C0"}){"\u00B3"} {"\u00D7"} exp(0)<br />
            {"     = (\u22121) \u00D7 (1 / (1.0 \u00D7 2.507))"}{"  \u00B3"}<br />
            {"     = (\u22121) \u00D7 (0.3989)"}{"  \u00B3"}<br />
            {"     = (\u22121) \u00D7 0.0634"}<br />
            {"     = "}<span style={{ color: F.main, fontWeight: 700 }}>{"\u22120.0634 e/\u00C5\u00B3"}</span><br /><br />
            <span style={{ color: F.elec, fontWeight: 700 }}>At r = 1.5 {"\u00C5"}:</span><br />
            {"\u03C1"}(1.5) = ({"\u22121"}) {"\u00D7"} 0.0634 {"\u00D7"} exp({"\u2212"}1.5{"\u00B2"} / (2 {"\u00D7"} 1.0{"\u00B2"}))<br />
            {"       = \u22120.0634 \u00D7 exp(\u22121.125)"}<br />
            {"       = \u22120.0634 \u00D7 0.3247"}<br />
            {"       = "}<span style={{ color: F.elec, fontWeight: 700 }}>{"\u22120.0206 e/\u00C5\u00B3"}</span><br /><br />
            <span style={{ color: T.muted }}>At r = 1.5 {"\u00C5"}, charge density has dropped to ~32% of the peak value.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { r: "0 \u00C5", rho: "\u22120.0634", pct: "100%", color: F.main },
              { r: "1.0 \u00C5", rho: "\u22120.0384", pct: "60.7%", color: F.elec },
              { r: "1.5 \u00C5", rho: "\u22120.0206", pct: "32.5%", color: F.accent },
            ].map(pt => (
              <div key={pt.r} style={{
                background: pt.color + "08", border: `1px solid ${pt.color}20`,
                borderRadius: 10, padding: "12px 14px", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>r = {pt.r}</div>
                <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: pt.color }}>{pt.rho}</div>
                <div style={{ fontSize: 10, color: T.muted }}>e/{"\u00C5\u00B3"} ({pt.pct} of peak)</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="E_periodic - Ewald Sum for Infinite Gaussian Array (Step-by-Step)" color={F.warn}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            How do we calculate the electrostatic energy of a <strong style={{ color: F.warn }}>periodic array</strong> of
            Gaussian charges? This is what DFT computes implicitly. We use an <strong>Ewald summation</strong>,
            splitting it into real-space + reciprocal-space + self-correction terms.
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.warn, marginBottom: 6 }}>
            Setup - V_Cu in 64-atom CuInSe{"\u2082"} supercell
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.main, fontWeight: 700 }}>Given:</span><br />
            {"  q       = \u22121 e        (Cu vacancy, singly charged)"}<br />
            {"  \u03C3       = 1.0 \u00C5       (Gaussian width)"}<br />
            {"  \u03B5       = 13.6        (dielectric constant from DFPT)"}<br />
            {"  L       = 11.5 \u00C5     (supercell lattice parameter)"}<br />
            {"  \u03A9       = L\u00B3 = 1520.875 \u00C5\u00B3  (cell volume)"}<br />
            {"  \u03B7       = \u03C3/\u221A2 = 0.707 \u00C5  (Ewald screening parameter)"}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.warn, marginBottom: 6, marginTop: 14 }}>
            Step 1 - Reciprocal-space sum (long-range part)
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.warn }}>E_recip = (q{"\u00B2"} / 2{"\u03B5\u03A9"}) {"\u03A3"}_G{"\u2260"}0  (4{"\u03C0"}/G{"\u00B2"}) exp({"\u2212"}G{"\u00B2"}{"\u03C3\u00B2"}/2)</span><br /><br />
            <span style={{ color: T.muted }}>Smallest G vector: G_min = 2{"\u03C0"}/L = 0.546 {"\u00C5\u207B\u00B9"}</span><br />
            <span style={{ color: T.muted }}>G{"\u00B2"}_min = 0.298 {"\u00C5\u207B\u00B2"}</span><br /><br />
            {"For G = G_min (6 equivalent vectors along \u00B1x, \u00B1y, \u00B1z):"}<br />
            {"  term = 6 \u00D7 (4\u03C0/0.298) \u00D7 exp(\u22120.298 \u00D7 1.0\u00B2/2)"}<br />
            {"       = 6 \u00D7 42.19 \u00D7 0.862"}<br />
            {"       = 218.2"}<br /><br />
            {"Next shell: G = \u221A2 \u00D7 G_min (12 vectors):"}<br />
            {"  term = 12 \u00D7 (4\u03C0/0.596) \u00D7 exp(\u22120.596/2)"}<br />
            {"       = 12 \u00D7 21.09 \u00D7 0.742"}<br />
            {"       = 187.8"}<br /><br />
            {"Sum converges fast: E_recip \u2248 "}<span style={{ color: F.warn, fontWeight: 700 }}>{"(1 / (2 \u00D7 13.6 \u00D7 1520.9)) \u00D7 ~580"}</span><br />
            {"                           = "}<span style={{ color: F.warn, fontWeight: 700 }}>{"0.0140 Ha \u2248 0.381 eV"}</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.elec, marginBottom: 6, marginTop: 14 }}>
            Step 2 - Real-space sum (short-range part)
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.elec }}>E_real = (q{"\u00B2"} / 2{"\u03B5"}) {"\u03A3"}_R{"\u2260"}0  erfc(R / {"\u03C3\u221A"}2) / R</span><br /><br />
            {"Nearest image at R = L = 11.5 \u00C5:"}<br />
            {"  erfc(11.5 / 1.414) = erfc(8.13) \u2248 0 (negligible!)"}<br /><br />
            <span style={{ color: F.elec, fontWeight: 700 }}>E_real {"\u2248"} 0 eV</span><br />
            <span style={{ color: T.muted }}>Real-space terms vanish because {"\u03C3"} is small compared to L</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.main, marginBottom: 6, marginTop: 14 }}>
            Step 3 - Self-interaction correction
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.main }}>E_self = {"\u2212"}q{"\u00B2"} / ({"\u03B5"} {"\u00D7"} {"\u03C3"} {"\u00D7"} {"\u221A"}(2{"\u03C0"}))</span><br /><br />
            {"  = \u2212(1)\u00B2 / (13.6 \u00D7 1.0 \u00D7 2.507)"}<br />
            {"  = \u22121 / 34.10"}<br />
            {"  = "}<span style={{ color: F.main, fontWeight: 700 }}>{"\u22120.0293 Ha \u2248 \u22120.798 eV"}</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.accent, marginBottom: 6, marginTop: 14 }}>
            Step 4 - Combine all terms
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.accent, fontWeight: 700, fontSize: 14 }}>E_periodic = E_recip + E_real + E_self</span><br /><br />
            {"  = 0.381 + 0.000 + (\u22120.798)"}<br />
            {"  = "}<span style={{ color: F.accent, fontWeight: 700, fontSize: 15 }}>{"\u22120.417 eV"}</span><br /><br />
            <span style={{ color: T.muted }}>This negative value means the periodic images stabilize the system.</span><br />
            <span style={{ color: T.muted }}>Larger supercell {"\u2192"} smaller |E_periodic| {"\u2192"} approaches E_iso as L {"\u2192"} {"\u221E"}</span>
          </div>
        </Card>

        <Card title="LOCPOT-Based Potential Alignment - Real DFT Workflow" color={F.align}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            After the Ewald energy, you need {"\u0394"}V from the DFT electrostatic potential.
            Here is exactly how you extract it from VASP LOCPOT files:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { step: "1", title: "Get LOCPOT files from VASP", desc: "Run two DFT calculations: (a) perfect supercell \u2192 LOCPOT_host, (b) defect supercell (charge q) \u2192 LOCPOT_defect. Each LOCPOT contains the electrostatic potential V(r) on the FFT grid.", color: F.elec },
              { step: "2", title: "Compute \u0394V_DFT(r) = V_defect(r) \u2212 V_host(r)", desc: "Subtract the host potential from the defect potential at every grid point. This isolates the potential due to the defect + periodic images + jellium.", color: F.elec },
              { step: "3", title: "Compute V_model(r) from the Gaussian charge", desc: "Using your chosen \u03C3 and the dielectric \u03B5, solve Poisson\u2019s equation for the model Gaussian charge in the periodic cell. This gives the model potential that FNV predicts.", color: F.main },
              { step: "4", title: "Plot \u0394V_DFT(r) \u2212 V_model(r) vs distance from defect", desc: "Planar-average both potentials along a lattice direction. Far from the defect, this difference should flatten to a constant plateau. That plateau = \u0394V.", color: F.align },
              { step: "5", title: "Read off the plateau value", desc: "For V_Cu in CuInSe\u2082 (64-atom cell): \u0394V \u2248 +0.12 V. This corrects the jellium background shift that VASP introduces to keep the cell neutral.", color: F.align },
            ].map(item => (
              <div key={item.step} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                background: item.color + "06", borderRadius: 10, padding: "10px 14px",
                border: `1px solid ${item.color}15`,
              }}>
                <span style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: item.color + "18", border: `1.5px solid ${item.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: item.color, flexShrink: 0,
                }}>{item.step}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={mathBlock}>
            <span style={{ color: F.align, fontWeight: 700 }}>pydefect example (handles all of this for you):</span><br />
            {"  from pydefect.analyzer.efnv_correction import \\"}<br />
            {"      make_efnv_correction"}<br /><br />
            {"  # Reads LOCPOT_host, LOCPOT_defect, dielectric tensor"}<br />
            {"  correction = make_efnv_correction("}<br />
            {"      charge=\u22121,"}<br />
            {"      calc_results=defect_entry,"}<br />
            {"      perfect_calc_results=perfect_entry,"}<br />
            {"      dielectric_tensor=dielectric"}<br />
            {"  )"}<br /><br />
            {"  # Outputs: \u0394E_elec, \u0394V, and E_FNV"}
          </div>
        </Card>

        <Card title="Required Inputs" color={F.warm}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${F.warm}30` }}>
                {["Input", "Source"].map(h => (
                  <th key={h} style={{
                    padding: "10px 14px", textAlign: "left", fontSize: 11,
                    color: F.warm, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Dielectric constant \u03B5", "Separate DFT calculation (DFPT) or experiment"],
                ["Gaussian width \u03C3", "You choose (~1 \u00C5), check convergence"],
                ["Defect charge q", "Your calculation setup"],
                ["V_DFT(r)", "Output of your DFT code (LOCPOT in VASP)"],
                ["Supercell geometry", "Your calculation"],
              ].map(([input, source], i) => (
                <tr key={input} style={{
                  background: i % 2 === 0 ? F.warm + "05" : "transparent",
                  borderBottom: `1px solid ${T.border}55`,
                }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: T.ink, fontFamily: "monospace" }}>{input}</td>
                  <td style={{ padding: "10px 14px", color: T.muted }}>{source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{
            background: F.main + "0a", border: `1px solid ${F.main}22`,
            borderRadius: 8, padding: "10px 14px", marginTop: 12, fontSize: 12, lineHeight: 1.6,
          }}>
            <strong style={{ color: F.main }}>The dielectric constant is critical</strong> {"\u2014"} it screens the
            electrostatic interaction. For CuInSe{"\u2082"}, {"\u03B5 \u2248"} 13.6 (high dielectric {"\u2192"} strong
            screening {"\u2192"} smaller correction needed).
          </div>
        </Card>
      </div>
    );
    }

    case "elec": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Step 2 - E_periodic (Lattice Sum)" color={F.warn}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            For the Gaussian charge repeated periodically (like your supercell), calculate the
            electrostatic energy using an <strong style={{ color: F.warn }}>Ewald summation</strong>:
          </div>
          <div style={mathBlock}>
            E_periodic = energy of infinite array of Gaussian charges<br />
            {"           = Ewald sum over all periodic images"}<br /><br />
            <span style={{ color: F.warn }}>{"Splits into: reciprocal space (long range)"}</span><br />
            <span style={{ color: F.elec }}>{"           + real space (short range)"}</span><br />
            <span style={{ color: T.muted }}>{"           \u2212 self-interaction term"}</span>
          </div>
          <div style={{
            background: F.warn + "0a", border: `1px solid ${F.warn}22`,
            borderRadius: 8, padding: "10px 14px", fontSize: 12, color: T.ink, lineHeight: 1.6,
          }}>
            This is the energy that DFT is <em>accidentally</em> computing {"\u2014"} including all those
            spurious image interactions. {"\u03B5"} (dielectric constant) appears in the denominator.
          </div>
        </Card>

        <Card title="Step 3 - E_iso (Isolated Charge)" color={F.elec}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            For a single isolated Gaussian charge (no periodic copies), the self-energy is analytical:
          </div>
          <div style={mathBlock}>
            E_iso = q{"\u00B2"} / (2{"\u03B5"} {"\u00D7"} {"\u03C3\u221A"}2{"\u03C0"})<br /><br />
            <span style={{ color: T.muted }}>Energy of one Gaussian charge in a homogeneous dielectric medium.</span><br />
            <span style={{ color: T.muted }}>This is what a real isolated defect would have {"\u2014"} no image interactions.</span>
          </div>
        </Card>

        <Card title="Step 4 - The Electrostatic Correction" color={F.main}>
          <div style={mathBlock}>
            <span style={{ color: F.main, fontWeight: 700 }}>{"\u0394"}E_elec = E_iso {"\u2212"} E_periodic</span><br /><br />
            <span style={{ color: T.muted }}>This removes the artificial image charge interaction from your DFT energy.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{
              background: F.warn + "08", border: `1px solid ${F.warn}22`,
              borderRadius: 10, padding: "12px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: F.warn, marginBottom: 4 }}>Small supercell</div>
              <div style={{ fontSize: 11, color: T.muted }}>
                E_periodic {"\u226B"} E_iso {"\u2192"} large correction needed
              </div>
            </div>
            <div style={{
              background: F.align + "08", border: `1px solid ${F.align}22`,
              borderRadius: 10, padding: "12px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: F.align, marginBottom: 4 }}>Huge supercell</div>
              <div style={{ fontSize: 11, color: T.muted }}>
                E_periodic {"\u2248"} E_iso {"\u2192"} small correction (images far away)
              </div>
            </div>
          </div>
        </Card>
      </div>
    );

    case "align": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={"Step 5 - Potential Alignment (\u0394V)"} color={F.align}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            The jellium background charge shifts the absolute electrostatic potential of your
            whole supercell by some unknown amount. This means your defect formation energy has an
            extra error of: {hl("Error = q \u00D7 (shift)", F.warn)}
          </div>
          <div style={{
            background: F.align + "0a", border: `1.5px solid ${F.align}30`,
            borderRadius: 10, padding: "14px 18px", marginBottom: 14, lineHeight: 1.8,
          }}>
            <strong style={{ color: F.align }}>How FNV finds the shift:</strong><br />
            <span style={{ fontSize: 13, color: T.ink }}>
              Compare two potentials: {hl("V_DFT(r)", F.elec)} from your calculation and{" "}
              {hl("V_model(r)", F.main)} from the Gaussian model charge.
              Far from the defect, V_model {"\u2192"} 0 but V_DFT settles at some constant C.
              That constant = {hl("\u0394V", F.align)}.
            </span>
          </div>
        </Card>

        <Card title={"The \u0394V Plot"} color={F.main}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
            Compute {hl("\u0394V(r) = V_DFT(r) \u2212 V_model(r)", F.main)} and plot vs. distance from defect.
            Read off the flat plateau far from the defect:
          </div>
          <AlignmentPlot />
          <div style={{
            background: F.warn + "0a", border: `1px solid ${F.warn}22`,
            borderRadius: 10, padding: "12px 16px", marginTop: 14, fontSize: 12,
            color: F.warn, fontWeight: 600, lineHeight: 1.6,
          }}>
            The plateau must be genuinely flat {"\u2014"} if it{"'"}s not, your supercell is too small
            and images are still interacting. This is a key convergence check.
          </div>
        </Card>

        <Card title={"How to measure \u0394V"} color={F.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Take your DFT supercell potential V_DFT(r)",
              "Calculate V_model(r) from the Gaussian charge",
              "Compute the difference: \u0394V(r) = V_DFT(r) \u2212 V_model(r)",
              "Look at \u0394V far from the defect \u2014 it should be flat (plateau)",
              "The value of that plateau = \u0394V",
            ].map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: F.accent + "06", borderRadius: 8, padding: "8px 12px",
                border: `1px solid ${F.accent}15`,
              }}>
                <span style={{
                  minWidth: 22, height: 22, borderRadius: "50%",
                  background: F.accent + "18", border: `1px solid ${F.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: F.accent,
                }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: T.ink, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Numerical Example - Potential Alignment for V_Cu" color={F.align}>
          <div style={{ fontSize: 13, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
            Walk through extracting {"\u0394"}V from real LOCPOT data for a Cu vacancy (q = -1)
            in a 64-atom CuInSe{"\u2082"} supercell.
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.elec, marginBottom: 6 }}>
            Step A - Read the LOCPOT files
          </div>
          <div style={mathBlock}>
            <span style={{ color: T.muted }}>VASP outputs V(r) on a 48 x 48 x 96 FFT grid</span><br />
            {"  LOCPOT_host   : V_host(r)   at each grid point"}<br />
            {"  LOCPOT_defect : V_defect(r)  at each grid point (charge = -1)"}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.elec, marginBottom: 6, marginTop: 14 }}>
            Step B - Compute {"\u0394"}V_DFT(r)
          </div>
          <div style={mathBlock}>
            {"\u0394"}V_DFT(r) = V_defect(r) - V_host(r)<br /><br />
            <span style={{ color: T.muted }}>At defect site (0, 0, 0):</span><br />
            {"  V_defect = -3.82 eV,  V_host = -4.15 eV"}<br />
            {"  \u0394V_DFT  = -3.82 - (-4.15) = "}<span style={{ color: F.elec, fontWeight: 700 }}>+0.33 eV</span><br /><br />
            <span style={{ color: T.muted }}>Far from defect (corner of cell, r = 8.1 {"\u00C5"}):</span><br />
            {"  V_defect = -4.03 eV,  V_host = -4.15 eV"}<br />
            {"  \u0394V_DFT  = -4.03 - (-4.15) = "}<span style={{ color: F.elec, fontWeight: 700 }}>+0.12 eV</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.main, marginBottom: 6, marginTop: 14 }}>
            Step C - Compute V_model(r) from Gaussian
          </div>
          <div style={mathBlock}>
            <span style={{ color: T.muted }}>Solve Poisson for Gaussian charge ({"\u03C3"} = 1.0 {"\u00C5"}, {"\u03B5"} = 13.6) in periodic cell:</span><br /><br />
            {"  V_model(r) = (q/\u03B5) \u00D7 \u03A3_G (4\u03C0/G\u00B2) exp(-G\u00B2\u03C3\u00B2/2) exp(iG\u00B7r)"}<br /><br />
            <span style={{ color: T.muted }}>At defect site:</span>{"  V_model(0) = "}<span style={{ color: F.main, fontWeight: 700 }}>+0.21 eV</span><br />
            <span style={{ color: T.muted }}>Far from defect:</span>{"  V_model(8.1 \u00C5) = "}<span style={{ color: F.main, fontWeight: 700 }}>+0.00 eV</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: F.align, marginBottom: 6, marginTop: 14 }}>
            Step D - Subtract and find the plateau
          </div>
          <div style={mathBlock}>
            {"\u0394"}V(r) = {"\u0394"}V_DFT(r) - V_model(r)<br /><br />
            <span style={{ color: T.muted }}>Near defect (r = 0):</span><br />
            {"  \u0394V(0)     = 0.33 - 0.21 = +0.12 eV  (distorted by short-range)"}<br /><br />
            <span style={{ color: T.muted }}>Far from defect (r = 5.0 {"\u00C5"}):</span><br />
            {"  \u0394V(5.0)   = 0.13 - 0.01 = "}<span style={{ color: F.align, fontWeight: 700 }}>+0.12 eV</span><br /><br />
            <span style={{ color: T.muted }}>Far from defect (r = 7.0 {"\u00C5"}):</span><br />
            {"  \u0394V(7.0)   = 0.12 - 0.00 = "}<span style={{ color: F.align, fontWeight: 700 }}>+0.12 eV</span><br /><br />
            <span style={{ color: T.muted }}>Far from defect (r = 8.1 {"\u00C5"}):</span><br />
            {"  \u0394V(8.1)   = 0.12 - 0.00 = "}<span style={{ color: F.align, fontWeight: 700 }}>+0.12 eV</span>
          </div>

          <div style={{
            background: F.align + "0c", border: `1.5px solid ${F.align}30`,
            borderRadius: 10, padding: "14px 18px", marginTop: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: F.align, marginBottom: 6 }}>
              Plateau is flat at +0.12 eV
            </div>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>
              The values at r = 5, 7, 8 {"\u00C5"} all agree: {"\u0394"}V = <strong>+0.12 V</strong>.
              This confirms the supercell is large enough (plateau is flat).
            </div>
            <div style={mathBlock}>
              <span style={{ color: F.align, fontWeight: 700, fontSize: 14 }}>
                q {"\u00D7"} {"\u0394"}V = (-1) {"\u00D7"} (+0.12) = -0.12 eV
              </span><br /><br />
              <span style={{ color: T.muted }}>This -0.12 eV gets added to the electrostatic correction to give E_FNV.</span>
            </div>
          </div>
        </Card>
      </div>
    );

    case "example": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title={"Numerical Example - Cu Vacancy in CuInSe\u2082"} color={F.main}>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>
            V_Cu with charge q = {hl("-1", F.warn)} in a 64-atom CuInSe{"\u2082"} supercell ({"\u03B5 \u2248"} 13.6)
          </div>
          <div style={mathBlock}>
            <span style={{ color: T.muted }}>DFT total energy (uncorrected):</span><br />
            {"  E_DFT(defect, q=-1) = "}{hl("-450.23 eV", F.elec)}<br /><br />
            <span style={{ color: F.elec, fontWeight: 700 }}>FNV correction components:</span><br />
            {"  E_iso      = +0.38 eV"}<br />
            {"  E_periodic = +0.95 eV"}<br /><br />
            <span style={{ color: F.elec, fontWeight: 700 }}>{"\u0394"}E_elec = E_iso {"\u2212"} E_periodic</span><br />
            {"         = 0.38 \u2212 0.95"}<br />
            {"         = "}{hl("-0.57 eV", F.elec)}{"  \u2190 image charges over-stabilized the defect"}<br /><br />
            <span style={{ color: F.align, fontWeight: 700 }}>{"\u0394"}V (from plateau) = +0.12 V</span><br />
            {"  q \u00D7 \u0394V = (-1) \u00D7 (0.12) = "}{hl("-0.12 eV", F.align)}
          </div>
        </Card>

        <Card title="Final Correction" color={F.main}>
          <div style={mathBlock}>
            <span style={{ color: F.main, fontWeight: 700, fontSize: 14 }}>
              E_FNV = {"\u0394"}E_elec + q {"\u00D7"} {"\u0394"}V
            </span><br />
            {"      = -0.57 + (-0.12)"}<br />
            {"      = "}<span style={{ color: F.main, fontWeight: 700, fontSize: 15 }}>-0.69 eV</span><br /><br />
            <span style={{ color: T.muted }}>Corrected energy:</span><br />
            {"  E_corrected = -450.23 + (-0.69) = "}<span style={{ color: F.main, fontWeight: 700 }}>-450.92 eV</span>
          </div>
          <div style={{
            background: F.warn + "0c", border: `1px solid ${F.warn}25`,
            borderRadius: 8, padding: "12px 16px", fontSize: 12, color: F.warn, fontWeight: 600, lineHeight: 1.6,
          }}>
            The uncorrected formation energy would be wrong by ~0.69 eV {"\u2014"} that{"'"}s enormous
            for a defect calculation where you care about differences of 0.1{"\u2013"}0.2 eV!
          </div>
        </Card>

        <Card title="Full Process Flowchart" color={F.accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { text: "Run DFT on perfect supercell \u2192 E_host, V_host(r)", color: F.elec },
              { text: "Run DFT on defect supercell (charge q) \u2192 E_defect, V_defect(r)", color: F.elec },
              { text: "Choose Gaussian width \u03C3, get dielectric \u03B5", color: F.warm },
              { text: "Calculate E_periodic via Ewald summation", color: F.warn },
              { text: "Calculate E_iso analytically", color: F.align },
              { text: "Compute \u0394E_elec = E_iso \u2212 E_periodic", color: F.main },
              { text: "Compute V_model(r) from Gaussian charge", color: F.main },
              { text: "Plot \u0394V(r) = V_DFT(r) \u2212 V_model(r), read off plateau", color: F.align },
              { text: "E_FNV = \u0394E_elec + q \u00D7 \u0394V", color: F.main },
              { text: "Add to formation energy formula", color: F.main },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: step.color + "15", border: `1.5px solid ${step.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: step.color,
                }}>{i + 1}</div>
                <div style={{
                  flex: 1, fontSize: 12, color: T.ink, fontFamily: "monospace",
                  background: step.color + "06", borderRadius: 6, padding: "6px 12px",
                  border: `1px solid ${step.color}12`,
                }}>{step.text}</div>
                {i < 9 && <div style={{ position: "absolute", left: 82, marginTop: 26, color: T.dim, fontSize: 10 }}></div>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );

    case "validate": return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="Key Validation Checks" color={F.warn}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "The plateau must be flat", desc: "Plot \u0394V(r) vs distance. If it\u2019s not flat far from the defect \u2192 supercell too small \u2192 use 128 or 256 atoms.", color: F.warn },
              { title: "Correction should be < 0.5 eV", desc: "If FNV correction is larger than ~0.5 eV, your supercell is dangerously small. The correction is too large to be reliable.", color: F.warn },
              { title: "Check \u03C3 convergence", desc: "Vary Gaussian width \u03C3 from 0.5 to 2.0 \u00C5. The final corrected formation energy should not change much.", color: F.warm },
              { title: "Use anisotropic dielectric tensor", desc: "Use the full 3\u00D73 tensor from your DFPT calculation, not a single scalar. CuInSe\u2082 has slightly anisotropic dielectric response.", color: F.accent },
            ].map((check, i) => (
              <div key={i} style={{
                background: check.color + "08", border: `1px solid ${check.color}20`,
                borderRadius: 10, padding: "12px 16px",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: check.color + "18", border: `1.5px solid ${check.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: check.color,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: check.color, marginBottom: 4 }}>{check.title}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{check.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Software - pydefect Example" color={F.main}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
            You don{"'"}t have to code this from scratch. Standard tools: pydefect, ShakeNBreak, AIDE.
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 11, lineHeight: 1.7,
            background: T.surface, color: T.ink, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "18px 20px",
            overflowX: "auto",
          }}>
            <pre style={{ margin: 0 }}>{`from pydefect.corrections.efnv_correction import ExtendedFnvCorrection

correction = ExtendedFnvCorrection(
    charge=             -1,
    dielectric_tensor=  [[13.6, 0, 0],
                         [0, 13.6, 0],
                         [0, 0, 13.6]],
    defect_region_radius= 3.0,   # angstrom
)

result = correction.run(
    defect_entry,     # your defect calculation
    perfect_entry,    # your perfect supercell
)

print(f"FNV correction: {result.correction_energy:.4f} eV")
print(f"  dE_elec:  {result.charge_correction:.4f} eV")
print(f"  q * dV:   {result.alignment_correction:.4f} eV")`}</pre>
          </div>
        </Card>

        <Card title="Why This Matters for DefectDB" color={F.align}>
          <div style={{
            background: F.align + "0a", border: `1px solid ${F.align}22`,
            borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.9, color: T.ink,
          }}>
            Every defect formation energy entry needs to have been FNV corrected (or use
            Kumagai-Oba for anisotropic systems). When an LLM pipeline extracts defect formation
            energies from papers, one key metadata field is <strong style={{ color: F.align }}>which
            correction scheme was used</strong> {"\u2014"} because uncorrected and FNV-corrected values
            can differ by <strong style={{ color: F.warn }}>0.5{"\u2013"}1.0 eV</strong> and are not
            directly comparable in a database.
          </div>
        </Card>
      </div>
    );

    default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: T.muted, textTransform: "uppercase", marginBottom: 4 }}>
          Charged Defect Calculations
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: F.main, marginBottom: 6 }}>
          FNV Charge Correction - How It Works
        </div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
          Freysoldt{"\u2013"}Neugebauer{"\u2013"}Van de Walle correction for periodic image charge
          interactions in charged defect supercell calculations.
        </div>
      </div>

      {/* Step navigation */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 22, flexWrap: "wrap",
        background: T.panel, padding: "8px 10px", borderRadius: 12,
        border: `1px solid ${T.border}`,
      }}>
        {FNV_STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: active === s.id ? F.main + "12" : "transparent",
            border: `1.5px solid ${active === s.id ? F.main : "transparent"}`,
            color: active === s.id ? F.main : T.muted,
            fontWeight: active === s.id ? 700 : 500,
            fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s ease",
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              background: active === s.id ? F.main + "18" : T.surface,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
              color: active === s.id ? F.main : T.dim,
              border: `1px solid ${active === s.id ? F.main + "40" : T.border}`,
            }}>{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderSection()}
      <NextTopicCard sections={FNV_STEPS} activeId={active} />

      {/* Prev / Next */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button onClick={() => stepIdx > 0 && setActive(FNV_STEPS[stepIdx - 1].id)} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, cursor: stepIdx > 0 ? "pointer" : "default",
          background: stepIdx > 0 ? F.main + "12" : T.surface,
          border: `1.5px solid ${stepIdx > 0 ? F.main : T.border}`,
          color: stepIdx > 0 ? F.main : T.dim,
          fontWeight: 700, fontFamily: "inherit",
          opacity: stepIdx > 0 ? 1 : 0.5,
        }}>{"\u2190"} Previous</button>
        <button onClick={() => stepIdx < FNV_STEPS.length - 1 && setActive(FNV_STEPS[stepIdx + 1].id)} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, cursor: stepIdx < FNV_STEPS.length - 1 ? "pointer" : "default",
          background: stepIdx < FNV_STEPS.length - 1 ? F.main + "12" : T.surface,
          border: `1.5px solid ${stepIdx < FNV_STEPS.length - 1 ? F.main : T.border}`,
          color: stepIdx < FNV_STEPS.length - 1 ? F.main : T.dim,
          fontWeight: 700, fontFamily: "inherit",
          opacity: stepIdx < FNV_STEPS.length - 1 ? 1 : 0.5,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

function MonteCarloModule() {
  return <div style={{ padding: 24, color: "#999" }}>Monte Carlo module - content not recovered</div>;
}

function SolarDefectsModule() {
  return <div style={{ padding: 24, color: "#999" }}>Solar Defects module - content not recovered</div>;
}

function LLMPipelineModule() {
  return <div style={{ padding: 24, color: "#999" }}>LLM Pipeline module - content not recovered</div>;
}

function CdTeExampleModule() {
  return <div style={{ padding: 24, color: "#999" }}>CdTe Example module - content not recovered</div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFECTS IN SEMICONDUCTORS — Chapter 13
// ═══════════════════════════════════════════════════════════════════════════

const kB_eV = 8.617333e-5;
const kB_meV = 0.08617333;
const lnFact = n => (n > 1 ? n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n) : 0);

// ── Section 1: Gibbs Free Energy Balance ──
function GibbsBalanceSection() {
  const [Tval, setTval] = useState(1000);
  const [gf, setGf] = useState(1.5);
  const [Nsites, setNsites] = useState(1000);
  const [frame, setFrame] = useState(0);

  useEffect(() => { const id = setInterval(() => setFrame(f => f + 1), 50); return () => clearInterval(id); }, []);

  const kT = kB_eV * Tval;
  const ceq = Math.exp(-gf / kT);
  const nd_eq = Math.round(Nsites * ceq);

  const gdCurve = Array.from({length:100},(_,i)=>{
    const frac = 0.0001 + i * (0.15 / 100);
    const n = frac * Nsites;
    const formE = n * gf;
    const Sconf = kB_eV * (Nsites * Math.log(Nsites) - n * Math.log(Math.max(n,0.01)) - (Nsites-n) * Math.log(Math.max(Nsites-n,0.01)));
    return [frac * 100, formE - Tval * Sconf];
  });

  const ceqPercent = ceq * 100;

  // Animated crystal lattice: 6x6 grid, some sites are vacancies
  const t = frame * 0.05;
  const gridN = 6;
  const spacing = 38;
  const ox = 20, oy = 20;
  const seed = (x) => Math.sin(x * 12.9898 + x * 78.233) * 43758.5453 % 1;
  const nVac = Math.min(Math.max(1, Math.round(ceq * gridN * gridN)), 8);
  const vacSet = useMemo(() => {
    const s = new Set();
    let i = 0;
    while (s.size < nVac && i < 200) { s.add(Math.floor(Math.abs(seed(i * 7.3 + 0.5)) * gridN * gridN) % (gridN * gridN)); i++; }
    return s;
  }, [nVac]);

  return (
    <Card color={T.eo_core} title="Gibbs Free Energy Balance" formula="G_d = G_b + n·g_f − T·S^conf">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Why Do Defects Exist at All?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          A <strong>perfect crystal</strong> has the lowest internal energy — every atom sits at its ideal lattice position,
          bonded symmetrically to all neighbors. You might think this is the most stable state. But nature disagrees.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          At any temperature above <strong>absolute zero</strong>, creating a few defects actually <strong>lowers the total
          free energy</strong> G = H − TS. Why? Because the entropy gain from the many ways to arrange n defects among N
          sites (the configurational entropy S<sup>conf</sup> = k<sub>B</sub> ln W) provides a <span style={{color:T.eo_valence, fontWeight:700}}>−TS<sup>conf</sup></span> term
          that more than compensates the energy penalty <span style={{color:T.eo_gap, fontWeight:700}}>n·g<sub>f</sub></span> when n is small.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          The competition between these two terms creates a <strong>minimum in G</strong> at a specific defect concentration c<sub>eq</sub>.
          This is why <em>defect-free crystals cannot exist at finite temperature</em> — they are thermodynamically unstable.
        </div>
      </div>

      {/* Animated crystal lattice showing perfect vs defective */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
        <div style={{ flex:"0 0 auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.eo_valence, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace", textAlign:"center" }}>Perfect Crystal (T = 0 K)</div>
          <svg width={gridN*spacing+40} height={gridN*spacing+40} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}` }}>
            {Array.from({length:gridN*gridN},(_,idx)=>{
              const row = Math.floor(idx/gridN), col = idx%gridN;
              const cx = ox + col*spacing + spacing/2, cy = oy + row*spacing + spacing/2;
              return (
                <g key={idx}>
                  <circle cx={cx} cy={cy} r={12} fill={T.eo_e+"22"} stroke={T.eo_e} strokeWidth={1.5}/>
                  <text x={cx} y={cy+3.5} textAnchor="middle" fill={T.eo_e} fontSize={8} fontFamily="monospace" fontWeight="bold">
                    {(row+col)%2===0?"Cd":"Te"}
                  </text>
                </g>
              );
            })}
            <text x={(gridN*spacing+40)/2} y={gridN*spacing+35} textAnchor="middle" fill={T.muted} fontSize={9} fontFamily="monospace">All sites occupied — minimum energy</text>
          </svg>
        </div>
        <div style={{ flex:"0 0 auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.eo_gap, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace", textAlign:"center" }}>With Vacancies (T {">"} 0 K)</div>
          <svg width={gridN*spacing+40} height={gridN*spacing+40} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}` }}>
            {Array.from({length:gridN*gridN},(_,idx)=>{
              const row = Math.floor(idx/gridN), col = idx%gridN;
              const isVac = vacSet.has(idx);
              // atoms vibrate around equilibrium position
              const vibX = isVac ? 0 : Math.sin(t*3 + idx*2.1) * 2.5 * (Tval/1000);
              const vibY = isVac ? 0 : Math.cos(t*2.7 + idx*1.7) * 2.5 * (Tval/1000);
              const cx = ox + col*spacing + spacing/2 + vibX;
              const cy = oy + row*spacing + spacing/2 + vibY;
              if (isVac) {
                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r={12} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3,3"/>
                    <text x={cx} y={cy+1} textAnchor="middle" fill={T.eo_gap} fontSize={12} fontFamily="monospace" fontWeight="bold">×</text>
                    <text x={cx} y={cy+10} textAnchor="middle" fill={T.eo_gap} fontSize={6} fontFamily="monospace">V</text>
                  </g>
                );
              }
              return (
                <g key={idx}>
                  <circle cx={cx} cy={cy} r={12} fill={T.eo_e+"22"} stroke={T.eo_e} strokeWidth={1.5}/>
                  <text x={cx} y={cy+3.5} textAnchor="middle" fill={T.eo_e} fontSize={8} fontFamily="monospace" fontWeight="bold">
                    {(row+col)%2===0?"Cd":"Te"}
                  </text>
                </g>
              );
            })}
            <text x={(gridN*spacing+40)/2} y={gridN*spacing+35} textAnchor="middle" fill={T.eo_gap} fontSize={9} fontFamily="monospace">{nVac} vacancies — atoms vibrate at T={Tval} K</text>
          </svg>
        </div>
      </div>

      {/* Equation breakdown */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_core}33`, marginBottom:16 }}>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:T.ink, lineHeight:2.4, textAlign:"center" }}>
          G<sub>d</sub> = <span style={{color:T.muted}}>G<sub>b</sub></span> + <span style={{color:T.eo_gap, fontWeight:700}}>n·g<sub>f</sub></span> − <span style={{color:T.eo_valence, fontWeight:700}}>T·S<sup>conf</sup></span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
          <div style={{ background:T.surface, borderLeft:`3px solid ${T.muted}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.muted }}>G<sub>b</sub> — Bulk Free Energy</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.6, marginTop:4 }}>Free energy of the perfect crystal. This is our reference — we measure everything relative to this baseline. Does not depend on n.</div>
          </div>
          <div style={{ background:T.surface, borderLeft:`3px solid ${T.eo_gap}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_gap }}>n·g<sub>f</sub> — Energy Cost</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.6, marginTop:4 }}>Each defect costs g<sub>f</sub> (the formation free energy per defect) to create. Linear in n. This term always increases G — it opposes defect formation.</div>
          </div>
          <div style={{ background:T.surface, borderLeft:`3px solid ${T.eo_valence}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_valence }}>−T·S<sup>conf</sup> — Entropy Reward</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.6, marginTop:4 }}>Configurational entropy from N!/(n!(N−n)!) arrangements. Grows as −k<sub>B</sub>T·ln(W). This term decreases G — it favors defect creation. Wins at small n.</div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_core, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace" }}>Free Energy vs Defect Concentration</div>
          <Plot data={gdCurve} xMin={0} xMax={15} yMin={Math.min(...gdCurve.map(d=>d[1]))-0.5} yMax={Math.max(5, gdCurve[0][1]+1)}
            color={T.eo_core} markerX={ceqPercent} width={340} height={200} xLabel="Defect fraction (%)" yLabel="ΔG (eV)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace" }}>
            The curve has a minimum at c<sub>eq</sub> — the equilibrium defect concentration.
            <strong> Left of minimum:</strong> entropy gain {">"} energy cost → adding defects lowers G.
            <strong> Right of minimum:</strong> energy cost {">"} entropy gain → too many defects raises G.
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>
          <SliderRow label="g_f — formation free energy" value={gf} min={0.3} max={4.0} step={0.05} onChange={setGf} color={T.eo_e} unit=" eV"/>
          <SliderRow label="N — lattice sites" value={Nsites} min={100} max={10000} step={100} onChange={setNsites} color={T.eo_valence} unit="" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>EQUILIBRIUM CALCULATION</div>
            <CalcRow eq={`k_BT = ${kB_eV.toExponential(3)} × ${Tval}`} result={`${kT.toFixed(4)} eV`} color={T.eo_core}/>
            <CalcRow eq={`−g_f / k_BT = −${gf.toFixed(2)} / ${kT.toFixed(4)}`} result={`${(-gf/kT).toFixed(2)}`} color={T.eo_e}/>
            <CalcRow eq={`c_eq = exp(−g_f / k_BT)`} result={`${ceq.toExponential(3)}`} color={T.eo_core}/>
            <CalcRow eq={`n_d = N × c_eq = ${Nsites} × ${ceq.toExponential(2)}`} result={`${nd_eq} defects`} color={T.eo_valence}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="c_eq" value={ceq < 0.01 ? ceq.toExponential(2) : (ceq*100).toFixed(2)+"%"} color={T.eo_core} sub="fraction"/>
            <ResultBox label="n_d" value={`${nd_eq}`} color={T.eo_valence} sub={`of ${Nsites} sites`}/>
            <ResultBox label="k_BT" value={`${(kT*1000).toFixed(1)} meV`} color={T.eo_e}/>
          </div>

          {/* Materials comparison table */}
          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>REAL MATERIALS — TYPICAL VALUES</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:4 }}>
              {[
                { mat:"Si (V_Si)", gf:"3.6 eV", tm:"1687 K", ceq:"~10⁻¹⁰" },
                { mat:"GaAs (V_Ga)", gf:"3.2 eV", tm:"1511 K", ceq:"~10⁻¹¹" },
                { mat:"CdTe (V_Cd)", gf:"1.5 eV", tm:"1365 K", ceq:"~10⁻⁶" },
                { mat:"Cu (V_Cu)", gf:"1.3 eV", tm:"1358 K", ceq:"~10⁻⁵" },
              ].map((m,i)=>(
                <div key={i} style={{ background:T.panel, borderRadius:6, padding:"6px", border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:T.eo_e, fontFamily:"'IBM Plex Mono',monospace" }}>{m.mat}</div>
                  <div style={{ fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>g<sub>f</sub>={m.gf}</div>
                  <div style={{ fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>T<sub>m</sub>={m.tm}</div>
                  <div style={{ fontSize:8, color:T.eo_core, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>c≈{m.ceq}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#f5f0ff", padding:10, borderRadius:8, border:`1px solid ${T.eo_core}` }}>
            <strong style={{color:T.eo_core}}>Key insight:</strong> Even a defect with g<sub>f</sub> = 2 eV has concentration ~10<sup>−5</sup> at 1000 K.
            At the melting point of many semiconductors (1500-2000 K), defect concentrations reach 0.01-1%.
            This is why <strong>"defect-free" crystals don't exist at finite temperature</strong> — they are thermodynamically
            unstable against spontaneous defect formation.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 2: Equilibrium Concentration ──
function EqConcentrationSection() {
  const [gf, setGf] = useState(1.5);
  const [Tval, setTval] = useState(1000);
  const [sfp, setSfp] = useState(0);

  const kT = kB_eV * Tval;
  const ceq_noS = Math.exp(-gf / kT);
  const Zd_Zb = Math.exp(sfp * kB_meV / 1000 / kB_eV);
  const ceq_full = Zd_Zb * ceq_noS;

  const gfValues = [0.5, 1.0, 1.5, 2.0, 3.0];
  const curves = gfValues.map(g => {
    return Array.from({length:80},(_,i)=>{
      const t = 200 + i * 25;
      const c = Math.exp(-g / (kB_eV * t));
      return [t, Math.log10(Math.max(c, 1e-30))];
    });
  });

  const concCm3 = ceq_full * 5e22;

  return (
    <Card color={T.eo_e} title="Equilibrium Concentration" formula="c_eq = (Z_d/Z_b) × exp(−h_f / k_BT)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>The Full Equation — Every Term Explained</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginBottom:8 }}>
          The equilibrium defect concentration is derived by minimizing the Gibbs free energy with respect to the
          number of defects. The result is a <strong>Boltzmann-like expression</strong> with a crucial prefactor that
          captures all non-configurational entropy contributions. This is the <strong>master equation</strong> of
          defect thermodynamics — everything in this chapter feeds into it.
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.2 }}>
          c<sub>eq</sub> = <span style={{color:T.eo_valence, fontWeight:700}}>(Z<sub>d</sub>/Z<sub>b</sub>)</span> × exp(<span style={{color:T.eo_gap, fontWeight:700}}>−h<sub>f,P</sub></span> / <span style={{color:T.eo_core, fontWeight:700}}>k<sub>B</sub>T</span>)
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:8 }}>
          <div style={{ background:T.panel, border:`1px solid ${T.eo_valence}33`, borderLeft:`3px solid ${T.eo_valence}`, borderRadius:6, padding:"6px 8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_valence }}>Z<sub>d</sub>/Z<sub>b</sub> — Prefactor</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.5 }}>Ratio of partition functions. Accounts for ALL non-configurational entropy: spin, electronic, vibrational, orientational degeneracies.</div>
          </div>
          <div style={{ background:T.panel, border:`1px solid ${T.eo_gap}33`, borderLeft:`3px solid ${T.eo_gap}`, borderRadius:6, padding:"6px 8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_gap }}>h<sub>f,P</sub> — Formation Enthalpy</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.5 }}>Energy cost to create the defect. Dominates at low T. Includes static DFT energy + PV term + finite-size corrections.</div>
          </div>
          <div style={{ background:T.panel, border:`1px solid ${T.eo_core}33`, borderLeft:`3px solid ${T.eo_core}`, borderRadius:6, padding:"6px 8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_core }}>k<sub>B</sub>T — Thermal Energy</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.5 }}>Boltzmann constant × temperature. Sets the energy scale for thermal fluctuations. At 300 K: 26 meV. At 1000 K: 86 meV.</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_e, marginBottom:4 }}>log₁₀(c_eq) vs Temperature</div>
          <svg viewBox="0 0 340 220" style={{ display:"block", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:340 }}>
            <line x1={50} y1={10} x2={50} y2={190} stroke={T.dim} strokeWidth={1}/>
            <line x1={50} y1={190} x2={330} y2={190} stroke={T.dim} strokeWidth={1}/>
            <text x={190} y={210} textAnchor="middle" fill={T.muted} fontSize={10}>T (K)</text>
            <text x={12} y={100} textAnchor="middle" fill={T.muted} fontSize={10} transform="rotate(-90, 12, 100)">log₁₀(c_eq)</text>
            {[500,1000,1500,2000].map(t=>{
              const sx = 50 + ((t-200)/1800)*280;
              return <g key={t}><line x1={sx} y1={190} x2={sx} y2={194} stroke={T.dim}/><text x={sx} y={205} textAnchor="middle" fill={T.muted} fontSize={8}>{t}</text></g>;
            })}
            {[-20,-15,-10,-5,0].map(v=>{
              const sy = 10 + ((0-v)/25)*180;
              return <g key={v}><line x1={46} y1={sy} x2={50} y2={sy} stroke={T.dim}/><text x={44} y={sy+3} textAnchor="end" fill={T.muted} fontSize={8}>{v}</text></g>;
            })}
            {curves.map((curve, ci) => {
              const colors = [T.eo_gap, T.eo_core, T.eo_e, T.eo_valence, T.muted];
              const pts = curve.filter(([,y])=>y>=-25).map(([x,y])=>{
                const sx = 50 + ((x-200)/1800)*280;
                const sy = 10 + ((0-y)/25)*180;
                return `${sx},${Math.max(10,Math.min(190,sy))}`;
              }).join(" ");
              return <polyline key={ci} points={pts} fill="none" stroke={colors[ci]} strokeWidth={1.5}/>;
            })}
            {gfValues.map((g, i) => {
              const colors = [T.eo_gap, T.eo_core, T.eo_e, T.eo_valence, T.muted];
              return <text key={i} x={310} y={20+i*14} fill={colors[i]} fontSize={8} fontWeight={600}>{g} eV</text>;
            })}
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="g_f — formation energy" value={gf} min={0.3} max={4.0} step={0.05} onChange={setGf} color={T.eo_e} unit=" eV"/>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>
          <SliderRow label="s_f — formation entropy" value={sfp} min={0} max={15} step={0.5} onChange={setSfp} color={T.eo_valence} unit=" k_B"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>STEP-BY-STEP CALCULATION</div>
            <CalcRow eq={`k_BT = ${(kT*1000).toFixed(1)} meV`} result={`${kT.toFixed(5)} eV`} color={T.eo_core}/>
            <CalcRow eq={`Z_d/Z_b = exp(s_f/k_B) = exp(${sfp.toFixed(1)})`} result={`${Zd_Zb.toFixed(2)}`} color={T.eo_valence}/>
            <CalcRow eq={`exp(−h_f/k_BT) = exp(−${gf.toFixed(2)}/${kT.toFixed(4)})`} result={`${ceq_noS.toExponential(3)}`} color={T.eo_gap}/>
            <CalcRow eq={`c_eq = ${Zd_Zb.toFixed(2)} × ${ceq_noS.toExponential(2)}`} result={`${ceq_full.toExponential(3)}`} color={T.eo_e}/>
            <CalcRow eq={`[c] ≈ c_eq × 5×10²² cm⁻³`} result={`${concCm3.toExponential(2)} cm⁻³`} color={T.ink}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="c_eq" value={ceq_full.toExponential(2)} color={T.eo_e} sub="site fraction"/>
            <ResultBox label="[c]" value={`${concCm3.toExponential(1)} cm⁻³`} color={T.ink} sub="volumetric"/>
          </div>
          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#eef3ff", padding:10, borderRadius:8, border:`1px solid ${T.eo_e}` }}>
            <strong style={{color:T.eo_e}}>Effect of entropy:</strong> Setting s<sub>f</sub> = 5 k<sub>B</sub> increases c<sub>eq</sub> by
            exp(5) ≈ 150×. At 10 k<sub>B</sub>, the increase is exp(10) ≈ 22,000×.
            Neglecting formation entropy can underestimate defect concentrations by orders of magnitude,
            especially at high temperatures (Fig. 1 in the paper shows errors up to 10⁵× for CeO₂).
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 3: Configurational Entropy ──
function ConfigEntropySection() {
  const [Nsites, setNsites] = useState(1000);
  const [nd, setNd] = useState(5);
  const [arrangement, setArrangement] = useState(0);

  const lnW = lnFact(Nsites) - lnFact(nd) - lnFact(Nsites - nd);
  const Sconf = kB_eV * lnW;
  const Sconf_kB = lnW;

  const entropyCurve = Array.from({length:100},(_,i)=>{
    const frac = 0.0001 + i * (0.2 / 100);
    const n = Math.max(1, Math.round(frac * Nsites));
    const lw = lnFact(Nsites) - lnFact(n) - lnFact(Nsites - n);
    return [frac * 100, kB_eV * lw * 1000];
  });

  // Visual: 8x8 grid showing different arrangements of 3 defects
  const gridVis = 8;
  const seed = (x) => Math.sin(x * 12.9898 + x * 78.233) * 43758.5453 % 1;
  const visDefects = useMemo(() => {
    const nDef = 3;
    const arrangements = [];
    for (let a = 0; a < 6; a++) {
      const s = new Set();
      let i = 0;
      while (s.size < nDef && i < 200) { s.add(Math.floor(Math.abs(seed(i*7.3 + a*31.7)) * gridVis*gridVis) % (gridVis*gridVis)); i++; }
      arrangements.push(s);
    }
    return arrangements;
  }, []);

  return (
    <Card color={T.eo_valence} title="Configurational Entropy" formula="S^conf = k_B ln(W)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>What is Configurational Entropy?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Imagine you have N lattice sites and need to place n<sub>d</sub> defects. <strong>How many distinct ways</strong> can
          you arrange them? This number — the <strong>multiplicity W</strong> — is astronomically large even for small n<sub>d</sub>.
          Boltzmann's entropy formula S = k<sub>B</sub> ln(W) converts this combinatorial count into a thermodynamic quantity
          that drives defect formation.
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:T.ink, lineHeight:2.4, marginTop:10, textAlign:"center", background:T.panel, borderRadius:8, padding:"8px 14px", border:`1px solid ${T.border}` }}>
          W = <sup style={{color:T.eo_valence}}>N</sup>C<sub style={{color:T.eo_core}}>n<sub>d</sub></sub> = <span style={{color:T.eo_valence}}>N</span>! / (<span style={{color:T.eo_core}}>n<sub>d</sub></span>! × (<span style={{color:T.eo_valence}}>N</span> − <span style={{color:T.eo_core}}>n<sub>d</sub></span>)!) &nbsp;&nbsp;→&nbsp;&nbsp; S<sup>conf</sup> = k<sub>B</sub> ln(W)
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.7, marginTop:6, fontFamily:"'IBM Plex Mono',monospace" }}>
          Using Stirling's approximation (ln n! ≈ n ln n − n):
          S<sup>conf</sup> ≈ k<sub>B</sub>[N ln N − n<sub>d</sub> ln n<sub>d</sub> − (N−n<sub>d</sub>) ln(N−n<sub>d</sub>)]
        </div>
      </div>

      {/* Visual: 6 different arrangements of 3 defects in an 8x8 grid */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_valence}33`, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.eo_valence, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>
          Example: 3 vacancies in a {gridVis}×{gridVis} grid — W = C({gridVis*gridVis}, 3) = {Math.round(gridVis*gridVis*(gridVis*gridVis-1)*(gridVis*gridVis-2)/6)} distinct arrangements
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {visDefects.map((defSet, ai) => (
            <div key={ai} onClick={()=>setArrangement(ai)} style={{ cursor:"pointer", border:`2px solid ${arrangement===ai?T.eo_valence:T.border}`, borderRadius:6, padding:4, background:arrangement===ai?T.eo_valence+"0a":T.bg }}>
              <svg width={gridVis*12+4} height={gridVis*12+4}>
                {Array.from({length:gridVis*gridVis},(_,idx)=>{
                  const row = Math.floor(idx/gridVis), col = idx%gridVis;
                  const isDef = defSet.has(idx);
                  return <rect key={idx} x={col*12+2} y={row*12+2} width={10} height={10} rx={2}
                    fill={isDef?T.eo_gap:T.eo_e+"33"} stroke={isDef?T.eo_gap:T.border} strokeWidth={0.5}/>;
                })}
              </svg>
              <div style={{ fontSize:7, color:T.muted, textAlign:"center", fontFamily:"'IBM Plex Mono',monospace" }}>#{ai+1}</div>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", padding:"0 8px" }}>
            <div style={{ fontSize:10, color:T.muted, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6 }}>
              ...and <strong style={{color:T.eo_valence}}>{Math.round(gridVis*gridVis*(gridVis*gridVis-1)*(gridVis*gridVis-2)/6) - 6}</strong> more!<br/>
              <span style={{color:T.eo_e}}>■</span> = atom &nbsp; <span style={{color:T.eo_gap}}>■</span> = vacancy
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_valence, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace" }}>S<sup>conf</sup> vs Defect Fraction</div>
          <Plot data={entropyCurve} xMin={0} xMax={20} yMin={0} yMax={Math.max(1, entropyCurve[entropyCurve.length-1][1]*1.1)}
            color={T.eo_valence} markerX={nd/Nsites*100} width={340} height={200} xLabel="Defect fraction (%)" yLabel="S^conf (meV/K)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace" }}>
            S<sup>conf</sup> is maximized at 50% defect fraction (maximum disorder) and is symmetric about this point.
            In practice, defect fractions are always {"<<"} 50%, so S<sup>conf</sup> increases approximately as −k<sub>B</sub>·c·ln(c).
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="N — total lattice sites" value={Nsites} min={100} max={10000} step={100} onChange={setNsites} color={T.eo_valence} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="n_d — number of defects" value={nd} min={1} max={Math.min(200, Math.floor(Nsites*0.2))} step={1} onChange={setNd} color={T.eo_core} unit="" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>STEP-BY-STEP CALCULATION</div>
            <CalcRow eq={`ln(N!) ≈ N·ln(N) − N = ${lnFact(Nsites).toFixed(1)}`} result="" color={T.eo_valence}/>
            <CalcRow eq={`ln(n_d!) ≈ ${lnFact(nd).toFixed(1)}`} result="" color={T.eo_core}/>
            <CalcRow eq={`ln((N−n_d)!) ≈ ${lnFact(Nsites-nd).toFixed(1)}`} result="" color={T.eo_core}/>
            <CalcRow eq={`ln(W) = ${lnW.toFixed(2)}`} result={`W ≈ 10^${(lnW/Math.log(10)).toFixed(1)}`} color={T.eo_valence}/>
            <CalcRow eq={`S^conf = k_B × ${lnW.toFixed(2)}`} result={`${(Sconf*1000).toFixed(3)} meV/K`} color={T.eo_valence}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="ln(W)" value={`${lnW.toFixed(1)}`} color={T.eo_valence}/>
            <ResultBox label="S^conf" value={`${Sconf_kB.toFixed(1)} k_B`} color={T.eo_core}/>
            <ResultBox label="−TS at 1000K" value={`${(-Sconf*1000*1000).toFixed(1)} meV`} color={T.eo_gap}/>
          </div>

          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#eef7f0", padding:10, borderRadius:8, border:`1px solid ${T.eo_valence}`, fontFamily:"'IBM Plex Mono',monospace" }}>
            <strong style={{color:T.eo_valence}}>Physical meaning:</strong> ln(W) = {lnW.toFixed(1)} means the system
            can access 10<sup>{(lnW/Math.log(10)).toFixed(0)}</sup> distinct microstates. Nature favors states with more
            microstates — this is the second law of thermodynamics at work. Even though each individual arrangement
            has the same energy, the sheer number of arrangements containing defects far exceeds the single
            arrangement with zero defects.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 4: Defect Formation Energy ──
function DefectFormationSection() {
  const [Ud, setUd] = useState(-450.0);
  const [Ub, setUb] = useState(-480.0);
  const [nRemoved, setNRemoved] = useState(1);
  const [ui, setUi] = useState(-3.5);
  const [q, setQ] = useState(0);
  const [EF, setEF] = useState(0.8);
  const [Evbm, setEvbm] = useState(0);
  const [Ecorr, setEcorr] = useState(0.15);
  const [defType, setDefType] = useState("vacancy");

  const chemPotTerm = -nRemoved * ui;
  const chargeTerm = q * (EF + Evbm);
  const uf = Ud - Ub + chemPotTerm + chargeTerm + Ecorr;

  // Supercell diagram: 5x5 grid showing different defect types
  const scN = 5, scSp = 40, scOx = 16, scOy = 16;

  return (
    <Card color={T.eo_core} title="Defect Formation Energy" formula="u_f = U_d − U_b − Σn_i·μ_i + q(E_F + E_VBM) + E_corr">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>The Master Equation — Every Term Explained</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginBottom:10 }}>
          The formation energy is the <strong>central quantity in defect physics</strong>. It tells you how much energy it costs
          to create a specific defect in a specific charge state, under specific chemical conditions. Every prediction of
          defect concentrations, carrier densities, and device performance starts here.
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.2, textAlign:"center", background:T.panel, borderRadius:8, padding:"8px 14px", border:`1px solid ${T.border}` }}>
          u<sub>f</sub> = <span style={{color:T.eo_core, fontWeight:700}}>U<sub>d</sub></span> − <span style={{color:T.eo_e, fontWeight:700}}>U<sub>b</sub></span> − Σ<span style={{color:T.eo_valence, fontWeight:700}}>n<sub>i</sub>·μ<sub>i</sub></span> + <span style={{color:T.eo_gap, fontWeight:700}}>q(E<sub>F</sub> + E<sub>VBM</sub>)</span> + <span style={{color:T.eo_cond, fontWeight:700}}>E<sub>corr</sub></span>
        </div>
      </div>

      {/* Defect type selector with visual supercell */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
        {[
          { id:"vacancy", label:"Vacancy (V)", desc:"Remove one atom", color:T.eo_gap },
          { id:"interstitial", label:"Interstitial (i)", desc:"Add one atom", color:T.eo_valence },
          { id:"antisite", label:"Antisite (A_B)", desc:"Wrong atom on site", color:T.eo_photon },
          { id:"substitution", label:"Substitution (X_A)", desc:"Foreign atom on site", color:T.eo_cond },
        ].map(dt => (
          <div key={dt.id} onClick={()=>setDefType(dt.id)} style={{ flex:"0 0 auto" }}>
            <svg width={scN*scSp+32} height={scN*scSp+32} style={{ background:defType===dt.id?dt.color+"0a":T.bg, borderRadius:8, border:`2px solid ${defType===dt.id?dt.color:T.border}`, cursor:"pointer", display:"block" }}>
              {Array.from({length:scN*scN},(_,idx)=>{
                const row = Math.floor(idx/scN), col = idx%scN;
                const cx = scOx+col*scSp+scSp/2, cy = scOy+row*scSp+scSp/2;
                const isCenter = row===2 && col===2;
                const isA = (row+col)%2===0;
                if (dt.id==="vacancy" && isCenter) return <g key={idx}><circle cx={cx} cy={cy} r={11} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3,3"/><text x={cx} y={cy+1} textAnchor="middle" fill={T.eo_gap} fontSize={10} fontWeight="bold">×</text></g>;
                if (dt.id==="interstitial" && isCenter) return <g key={idx}><circle cx={cx} cy={cy} r={11} fill={T.eo_e+"22"} stroke={T.eo_e} strokeWidth={1.5}/><text x={cx} y={cy+3} textAnchor="middle" fill={T.eo_e} fontSize={7} fontWeight="bold">{isA?"Cd":"Te"}</text><circle cx={cx+14} cy={cy-14} r={8} fill={T.eo_valence+"44"} stroke={T.eo_valence} strokeWidth={1.5}/><text x={cx+14} y={cy-11} textAnchor="middle" fill={T.eo_valence} fontSize={6} fontWeight="bold">i</text></g>;
                if (dt.id==="antisite" && isCenter) return <g key={idx}><circle cx={cx} cy={cy} r={11} fill={T.eo_photon+"22"} stroke={T.eo_photon} strokeWidth={1.5}/><text x={cx} y={cy+3} textAnchor="middle" fill={T.eo_photon} fontSize={7} fontWeight="bold">{isA?"Te":"Cd"}</text></g>;
                if (dt.id==="substitution" && isCenter) return <g key={idx}><circle cx={cx} cy={cy} r={11} fill={T.eo_cond+"22"} stroke={T.eo_cond} strokeWidth={1.5}/><text x={cx} y={cy+3} textAnchor="middle" fill={T.eo_cond} fontSize={7} fontWeight="bold">Cl</text></g>;
                return <g key={idx}><circle cx={cx} cy={cy} r={11} fill={isA?T.eo_e+"22":T.eo_core+"22"} stroke={isA?T.eo_e:T.eo_core} strokeWidth={1}/><text x={cx} y={cy+3} textAnchor="middle" fill={isA?T.eo_e:T.eo_core} fontSize={7} fontWeight="bold">{isA?"Cd":"Te"}</text></g>;
              })}
            </svg>
            <div style={{ textAlign:"center", marginTop:4 }}>
              <div style={{ fontSize:10, fontWeight:700, color:defType===dt.id?dt.color:T.ink, fontFamily:"'IBM Plex Mono',monospace" }}>{dt.label}</div>
              <div style={{ fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{dt.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Term explanation cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
        {[
          { term:"U_d", color:T.eo_core, what:"Defective Supercell", desc:"Total DFT energy of the supercell WITH the defect. Obtained by relaxing all atomic positions in a large supercell (64-256 atoms). Most expensive part." },
          { term:"U_b", color:T.eo_e, what:"Bulk Supercell", desc:"Total DFT energy of the PERFECT supercell with same atom count and k-points. This is the reference energy." },
          { term:"Σn_i·μ_i", color:T.eo_valence, what:"Chemical Potentials", desc:"Atoms added/removed from atomic reservoirs. μ_i depends on growth conditions: Cd-rich vs Te-rich for CdTe. Bounded by phase stability." },
          { term:"q·E_F", color:T.eo_gap, what:"Charge State", desc:"Electrons exchanged with Fermi level reservoir. q > 0: donor (gave electrons). q < 0: acceptor (took electrons). Formation energy varies linearly with E_F." },
          { term:"E_corr", color:T.eo_cond, what:"Finite-Size Correction", desc:"Charged defects interact with periodic images. FNV correction removes this artifact. Typically 0.05-0.5 eV for charged defects." },
          { term:"Pv_f", color:T.muted, what:"PV Term (negligible)", desc:"At 1 atm: ~10⁻² meV. Only matters at GPa pressures (Earth's mantle, shock compression)." },
        ].map((item, i) => (
          <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:item.color, marginBottom:2, fontFamily:"'IBM Plex Mono',monospace" }}>{item.what} — {item.term}</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.6, fontFamily:"'IBM Plex Mono',monospace" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ flex:1, minWidth:200 }}>
        <SliderRow label="U_d — defective supercell" value={Ud} min={-500} max={-400} step={0.5} onChange={setUd} color={T.eo_core} unit=" eV"/>
        <SliderRow label="U_b — bulk supercell" value={Ub} min={-520} max={-430} step={0.5} onChange={setUb} color={T.eo_e} unit=" eV"/>
        <SliderRow label="n_removed — atoms removed" value={nRemoved} min={0} max={3} step={1} onChange={setNRemoved} color={T.eo_valence} unit="" format={v=>v.toFixed(0)}/>
        <SliderRow label="μ_i — chemical potential" value={ui} min={-6} max={-1} step={0.1} onChange={setUi} color={T.eo_valence} unit=" eV"/>
        <SliderRow label="q — charge state" value={q} min={-3} max={3} step={1} onChange={setQ} color={T.eo_gap} unit="" format={v=>v>0?`+${v}`:v.toFixed(0)}/>
        <SliderRow label="E_F — Fermi level" value={EF} min={0} max={3.0} step={0.05} onChange={setEF} color={T.eo_gap} unit=" eV"/>
        <SliderRow label="E_corr — finite-size correction" value={Ecorr} min={0} max={1.0} step={0.01} onChange={setEcorr} color={T.eo_cond} unit=" eV"/>

        <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>STEP-BY-STEP CALCULATION</div>
          <CalcRow eq={`Step 1: U_d − U_b = ${Ud.toFixed(1)} − (${Ub.toFixed(1)})`} result={`${(Ud-Ub).toFixed(2)} eV`} color={T.eo_core}/>
          <CalcRow eq={`Step 2: −Σn_i·μ_i = −(${-nRemoved}) × (${ui.toFixed(1)})`} result={`${chemPotTerm.toFixed(2)} eV`} color={T.eo_valence}/>
          <CalcRow eq={`Step 3: q(E_F+E_VBM) = ${q} × (${EF.toFixed(2)}+${Evbm.toFixed(1)})`} result={`${chargeTerm.toFixed(2)} eV`} color={T.eo_gap}/>
          <CalcRow eq={`Step 4: E_corr`} result={`${Ecorr.toFixed(2)} eV`} color={T.eo_cond}/>
          <CalcRow eq={`u_f = ${(Ud-Ub).toFixed(2)} + ${chemPotTerm.toFixed(2)} + ${chargeTerm.toFixed(2)} + ${Ecorr.toFixed(2)}`} result={`${uf.toFixed(3)} eV`} color={T.ink}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
          <ResultBox label="u_f" value={`${uf.toFixed(3)} eV`} color={T.eo_core} sub={`q = ${q>0?"+":""}${q}`}/>
          <ResultBox label="c_eq at 1000K" value={Math.exp(-Math.max(0,uf)/(kB_eV*1000)).toExponential(2)} color={T.eo_e} sub="site fraction"/>
          <ResultBox label="c_eq at 300K" value={Math.exp(-Math.max(0,uf)/(kB_eV*300)).toExponential(2)} color={T.eo_cond} sub="room temp"/>
        </div>
      </div>
    </Card>
  );
}

// ── Section 5: Electronic Entropy ──
function ElectronicEntropySection() {
  const [ge, setGe] = useState(2);
  const [Tval, setTval] = useState(1000);
  const [dosEf, setDosEf] = useState(0.5);
  const [frame, setFrame] = useState(0);

  useEffect(() => { const id = setInterval(() => setFrame(f => f + 1), 60); return () => clearInterval(id); }, []);

  const Selec_simple = kB_eV * Math.log(ge);
  const Selec_sommerfeld = (Math.PI * Math.PI / 3) * kB_eV * kB_eV * Tval * dosEf;
  const TSelec = Tval * Selec_simple;
  const t = frame * 0.05;

  const curve = Array.from({length:80},(_,i)=>{
    const temp = 100 + i * 25;
    return [temp, -temp * Selec_simple * 1000];
  });

  return (
    <Card color={T.eo_cond} title="Electronic Entropy" formula="S_f^elec = k_B ln(g_e) or π²k_B²T·D(E_F)/3">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Electronic Degeneracy at Defect Sites</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          When a defect creates <strong>degenerate electronic states</strong> — multiple states with the same energy — the
          system gains entropy because the electron(s) can occupy any of these states. A defect with g<sub>e</sub> degenerate
          ground states contributes S<sub>elec</sub> = k<sub>B</sub> ln(g<sub>e</sub>).
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          <strong>Common sources:</strong> Crystal field splitting of d-orbitals (transition metal defects), Jahn-Teller
          distortions that partially lift degeneracy, and near-degenerate defect levels in the band gap.
          In metals, the Sommerfeld expansion adds a T-dependent term: ΔS<sub>elec</sub> ≈ (π²/3)k<sub>B</sub>²T·ΔD(E<sub>F</sub>).
        </div>
      </div>

      {/* Energy level diagram showing degeneracy */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_cond}33`, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.eo_cond, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>
          Energy Level Diagram — g<sub>e</sub> = {ge} degenerate states
        </div>
        <svg viewBox="0 0 400 140" style={{ display:"block", background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:400 }}>
          {/* Band edges */}
          <rect x={30} y={10} width={340} height={25} fill={T.eo_cond+"15"} stroke={T.eo_cond+"44"} strokeWidth={1} rx={4}/>
          <text x={50} y={26} fill={T.eo_cond} fontSize={9} fontFamily="monospace" fontWeight="bold">CB</text>
          <rect x={30} y={105} width={340} height={25} fill={T.eo_e+"15"} stroke={T.eo_e+"44"} strokeWidth={1} rx={4}/>
          <text x={50} y={121} fill={T.eo_e} fontSize={9} fontFamily="monospace" fontWeight="bold">VB</text>
          {/* Degenerate defect levels in the gap */}
          {Array.from({length:ge},(_,i)=>{
            const levelY = 55 + (i - (ge-1)/2) * (ge > 1 ? 30/(ge-1||1) : 0);
            const levelX = 120 + i * (200/(ge||1));
            // Electron blinking between levels
            const activeLevel = Math.floor((t * 1.5) % ge);
            const isActive = i === activeLevel;
            return (
              <g key={i}>
                <line x1={levelX-20} y1={levelY} x2={levelX+20} y2={levelY} stroke={T.eo_cond} strokeWidth={2}/>
                <text x={levelX+25} y={levelY+4} fill={T.muted} fontSize={8} fontFamily="monospace">ε<tspan fontSize={6}>{i+1}</tspan></text>
                {isActive && <circle cx={levelX} cy={levelY-7} r={4} fill={T.eo_gap}/>}
                {isActive && <text x={levelX} y={levelY-4} textAnchor="middle" fill="#fff" fontSize={5} fontWeight="bold">e⁻</text>}
              </g>
            );
          })}
          <text x={80} y={72} fill={T.eo_cond} fontSize={9} fontFamily="monospace" fontWeight="bold">Defect levels</text>
          <text x={280} y={90} fill={T.muted} fontSize={8} fontFamily="monospace">e⁻ hops between {ge} states</text>
          {/* Arrow showing same energy */}
          {ge > 1 && <text x={200} y={46} textAnchor="middle" fill={T.eo_photon} fontSize={8} fontFamily="monospace">← same energy (degenerate) →</text>}
        </svg>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_cond, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace" }}>−TS<sub>elec</sub> vs Temperature</div>
          <Plot data={curve} xMin={100} xMax={2100} yMin={Math.min(...curve.map(d=>d[1]))-10} yMax={0}
            color={T.eo_cond} markerX={Tval} width={340} height={180} xLabel="T (K)" yLabel="−TS_elec (meV)"/>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          {/* Degeneracy selector buttons */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6, marginBottom:10 }}>
            {[1,2,3,4,5,6].map(g => (
              <div key={g} onClick={()=>setGe(g)} style={{
                background:g===ge?T.eo_cond+"22":T.panel, border:`1.5px solid ${g===ge?T.eo_cond:T.border}`,
                borderRadius:6, padding:"6px", textAlign:"center", cursor:"pointer"
              }}>
                <div style={{ fontSize:12, fontWeight:800, color:g===ge?T.eo_cond:T.ink, fontFamily:"'IBM Plex Mono',monospace" }}>{g}</div>
                <div style={{ fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{(Math.log(g)).toFixed(2)} k<sub>B</sub></div>
              </div>
            ))}
          </div>
          <SliderRow label="g_e — electronic degeneracy" value={ge} min={1} max={6} step={1} onChange={setGe} color={T.eo_cond} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>
          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>CALCULATION</div>
            <CalcRow eq={`S_elec = k_B × ln(${ge})`} result={`${(Selec_simple/kB_eV).toFixed(2)} k_B`} color={T.eo_cond}/>
            <CalcRow eq={`S_elec = ${(Selec_simple/kB_eV).toFixed(2)} × ${kB_eV.toExponential(3)}`} result={`${Selec_simple.toExponential(3)} eV/K`} color={T.eo_cond}/>
            <CalcRow eq={`−TS_elec at ${Tval} K`} result={`${(-TSelec*1000).toFixed(1)} meV`} color={T.eo_gap}/>
            <CalcRow eq={`Concentration boost`} result={`${ge}×`} color={T.eo_core}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="g_e" value={`${ge}`} color={T.eo_cond} sub="states"/>
            <ResultBox label="S_elec" value={`${(Selec_simple/kB_eV).toFixed(2)} k_B`} color={T.eo_cond}/>
            <ResultBox label="−TS" value={`${(-TSelec*1000).toFixed(0)} meV`} color={T.eo_gap} sub={`at ${Tval} K`}/>
          </div>

          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#eef8ff", padding:10, borderRadius:8, border:`1px solid ${T.eo_cond}`, fontFamily:"'IBM Plex Mono',monospace" }}>
            <strong style={{color:T.eo_cond}}>Example:</strong> A transition metal impurity with partially filled d-orbitals
            in a tetrahedral crystal field might have g<sub>e</sub> = 3 (t₂ level), giving S<sub>elec</sub> = 1.1 k<sub>B</sub>.
            For the V<sub>W</sub> vacancy in tungsten, electronic entropy contributes 1.7 k<sub>B</sub>.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 6: Spin Entropy ──
function SpinEntropySection() {
  const [S_spin, setS_spin] = useState(0.5);
  const [Tval, setTval] = useState(1000);
  const [frame, setFrame] = useState(0);

  useEffect(() => { const id = setInterval(() => setFrame(f => f + 1), 80); return () => clearInterval(id); }, []);

  const mult = 2 * S_spin + 1;
  const Sspin = kB_eV * Math.log(Math.max(1, mult));
  const TSspin = Tval * Sspin;

  // Generate spin state arrows for visualization
  const spinStates = [];
  for (let ms = -S_spin; ms <= S_spin; ms += 1) spinStates.push(ms);
  const activeState = Math.floor((frame * 0.03) % Math.max(1, spinStates.length));

  return (
    <Card color={T.eo_e} title="Spin Entropy" formula="S_f^spin = k_B ln(2S + 1)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Spin Degeneracy of Defect States</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Defects with <strong>unpaired electrons</strong> possess spin angular momentum. A defect with total spin quantum
          number S has (2S+1) possible spin projections: m<sub>s</sub> = −S, −S+1, ..., S−1, S. In zero magnetic field,
          all these states have <strong>exactly the same energy</strong> (degenerate), so the system can freely fluctuate
          between them.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          This spin multiplicity contributes S<sub>spin</sub> = k<sub>B</sub> ln(2S+1) to the defect formation entropy.
          For a single unpaired electron (S = ½): 2S+1 = 2 states (↑ or ↓), giving ln(2) ≈ 0.69 k<sub>B</sub>.
        </div>
      </div>

      {/* Spin arrow visualization */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_e}33`, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.eo_e, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>
          S = {S_spin} → {mult} spin states (m<sub>s</sub> = {spinStates.map(ms => ms > 0 ? `+${ms}` : `${ms}`).join(", ")})
        </div>
        <svg width={Math.max(300, spinStates.length * 70 + 40)} height={100} style={{ display:"block", background:T.bg, borderRadius:8, border:`1px solid ${T.border}` }}>
          {spinStates.map((ms, i) => {
            const cx = 40 + i * 70, cy = 50;
            const isActive = i === activeState;
            const arrowLen = 25;
            const angle = ms > 0 ? -Math.PI/2 : ms < 0 ? Math.PI/2 : 0; // up for +, down for -
            const tipX = cx + Math.cos(angle) * arrowLen;
            const tipY = cy + Math.sin(angle) * arrowLen;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={22} fill={isActive ? T.eo_e+"22" : "none"} stroke={isActive ? T.eo_e : T.border} strokeWidth={isActive ? 2 : 1}/>
                {ms !== 0 && <line x1={cx} y1={cy + (ms > 0 ? arrowLen*0.6 : -arrowLen*0.6)} x2={tipX} y2={tipY} stroke={isActive ? T.eo_e : T.muted} strokeWidth={2.5}/>}
                {ms !== 0 && <polygon points={`${tipX},${tipY} ${tipX-4},${tipY+(ms>0?8:-8)} ${tipX+4},${tipY+(ms>0?8:-8)}`} fill={isActive ? T.eo_e : T.muted}/>}
                {ms === 0 && <circle cx={cx} cy={cy} r={4} fill={isActive ? T.eo_e : T.muted}/>}
                <text x={cx} y={90} textAnchor="middle" fill={isActive ? T.eo_e : T.muted} fontSize={9} fontFamily="monospace" fontWeight={isActive ? "bold" : "normal"}>
                  m<tspan fontSize={7}>s</tspan>={ms > 0 ? "+" : ""}{ms}
                </text>
              </g>
            );
          })}
          {spinStates.length > 0 && <text x={40 + spinStates.length * 70} y={55} fill={T.muted} fontSize={9} fontFamily="monospace">← all same energy</text>}
        </svg>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200 }}>
          {/* Spin selector grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr", gap:6, marginBottom:12 }}>
            {[0, 0.5, 1, 1.5, 2, 2.5].map(s => (
              <div key={s} style={{ background: s===S_spin ? T.eo_e+"22" : T.panel, border:`1.5px solid ${s===S_spin ? T.eo_e : T.border}`, borderRadius:6, padding:"6px", textAlign:"center", cursor:"pointer" }} onClick={()=>setS_spin(s)}>
                <div style={{ fontSize:11, fontWeight:700, color: s===S_spin ? T.eo_e : T.ink, fontFamily:"'IBM Plex Mono',monospace" }}>S={s}</div>
                <div style={{ fontSize:9, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>2S+1={2*s+1}</div>
                <div style={{ fontSize:9, color:T.eo_e, fontFamily:"'IBM Plex Mono',monospace" }}>{(Math.log(Math.max(1,2*s+1))).toFixed(2)} k<sub>B</sub></div>
              </div>
            ))}
          </div>

          <SliderRow label="S — total spin" value={S_spin} min={0} max={3} step={0.5} onChange={setS_spin} color={T.eo_e} unit=""/>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>

          {/* Physical examples */}
          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:6, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>PHYSICAL EXAMPLES</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[
                { defect:"V_Cl⁰ in NaCl", spin:"S=½", states:"2", note:"One unpaired electron" },
                { defect:"Fe²⁺ in MgO", spin:"S=2", states:"5", note:"High-spin d⁶" },
                { defect:"Cr³⁺ in Al₂O₃", spin:"S=3/2", states:"4", note:"d³ configuration" },
                { defect:"V_O²⁺ in TiO₂", spin:"S=0", states:"1", note:"No unpaired electrons" },
              ].map((ex,i)=>(
                <div key={i} style={{ background:T.panel, borderRadius:6, padding:"6px 8px", border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:T.eo_e, fontFamily:"'IBM Plex Mono',monospace" }}>{ex.defect}</div>
                  <div style={{ fontSize:8, color:T.ink, fontFamily:"'IBM Plex Mono',monospace" }}>{ex.spin} → {ex.states} states</div>
                  <div style={{ fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{ex.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>CALCULATION</div>
            <CalcRow eq={`2S + 1 = 2×${S_spin} + 1`} result={`${mult.toFixed(0)} states`} color={T.eo_e}/>
            <CalcRow eq={`S_spin = k_B × ln(${mult.toFixed(0)})`} result={`${(Sspin/kB_eV).toFixed(3)} k_B`} color={T.eo_e}/>
            <CalcRow eq={`−TS_spin at ${Tval} K`} result={`${(-TSspin*1000).toFixed(1)} meV`} color={T.eo_gap}/>
            <CalcRow eq={`Concentration boost = 2S+1`} result={`${mult.toFixed(0)}×`} color={T.eo_core}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="S_spin" value={`${(Sspin/kB_eV).toFixed(2)} k_B`} color={T.eo_e}/>
            <ResultBox label="Prefactor" value={`${mult.toFixed(0)}×`} color={T.eo_core} sub="c boost"/>
            <ResultBox label="−TS" value={`${(-TSspin*1000).toFixed(0)} meV`} color={T.eo_gap} sub={`at ${Tval} K`}/>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 7: Vibrational Entropy ──
function VibrationalEntropySection() {
  const [freqRatio, setFreqRatio] = useState(0.85);
  const [nModes, setNModes] = useState(10);
  const [Tval, setTval] = useState(1000);
  const [frame, setFrame] = useState(0);

  useEffect(() => { const id = setInterval(() => setFrame(f => f + 1), 50); return () => clearInterval(id); }, []);

  const dSvib_kB = nModes * Math.log(1.0 / freqRatio);
  const dSvib = kB_eV * dSvib_kB;
  const TdSvib = Tval * dSvib;
  const t = frame * 0.06;

  const curve = Array.from({length:80},(_,i)=>{
    const ratio = 0.5 + i * (1.0 / 80);
    return [ratio, nModes * Math.log(1.0 / ratio)];
  });

  // Animated lattice: bulk (tight vibrations) vs defective (loose vibrations near vacancy)
  const gN = 5, sp = 44, ox = 18, oy = 18;

  return (
    <Card color={T.eo_valence} title="Vibrational Entropy" formula="ΔS_vib ≈ k_B Σ ln(ω_bulk / ω_defect)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Phonon Softening Near Defects</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Every atom in a crystal vibrates about its equilibrium position. These vibrations (phonons) have characteristic
          frequencies ω that depend on the local bonding environment. When a defect is created — say, a vacancy — the
          neighboring atoms lose one bond partner. Their restoring forces become <strong>weaker</strong>, so they vibrate at
          <strong> lower frequencies</strong> (phonon softening).
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          Lower frequencies → more accessible vibrational states → <strong>higher vibrational entropy</strong>.
          In the high-temperature (classical) limit, the entropy change for each softened mode is:
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:13, color:T.ink, lineHeight:2.4, marginTop:6, textAlign:"center" }}>
          ΔS<sub>vib</sub> = k<sub>B</sub> Σ<sub>i</sub> ln(<span style={{color:T.eo_e}}>ω<sub>bulk,i</sub></span> / <span style={{color:T.eo_gap}}>ω<sub>defect,i</sub></span>)
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace", marginTop:6 }}>
          If ω<sub>defect</sub> {"<"} ω<sub>bulk</sub> (softening), ΔS<sub>vib</sub> {">"} 0 → entropy increases → defect stabilized.
          If ω<sub>defect</sub> {">"} ω<sub>bulk</sub> (hardening), ΔS<sub>vib</sub> {"<"} 0 → entropy decreases → defect destabilized.
          Typical vacancies: ω<sub>defect</sub>/ω<sub>bulk</sub> ≈ 0.8-0.9 for nearest neighbors.
        </div>
      </div>

      {/* Animated vibrating atoms side by side: bulk vs near vacancy */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
        <div style={{ flex:"0 0 auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.eo_e, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace", textAlign:"center" }}>Bulk: Tight Vibrations (ω<sub>bulk</sub>)</div>
          <svg width={gN*sp+36} height={gN*sp+36} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}` }}>
            {Array.from({length:gN*gN},(_,idx)=>{
              const row = Math.floor(idx/gN), col = idx%gN;
              const bulkAmp = 1.5;
              const vx = Math.sin(t*4 + idx*1.9) * bulkAmp;
              const vy = Math.cos(t*3.5 + idx*2.3) * bulkAmp;
              const cx = ox + col*sp + sp/2 + vx, cy = oy + row*sp + sp/2 + vy;
              // draw bonds to right and bottom neighbors
              const bonds = [];
              if (col < gN-1) { const nx = ox+(col+1)*sp+sp/2+Math.sin(t*4+(idx+1)*1.9)*bulkAmp; const ny = oy+row*sp+sp/2+Math.cos(t*3.5+(idx+1)*2.3)*bulkAmp; bonds.push(<line key={`r${idx}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={T.eo_e+"44"} strokeWidth={1}/>); }
              if (row < gN-1) { const nx = ox+col*sp+sp/2+Math.sin(t*4+(idx+gN)*1.9)*bulkAmp; const ny = oy+(row+1)*sp+sp/2+Math.cos(t*3.5+(idx+gN)*2.3)*bulkAmp; bonds.push(<line key={`b${idx}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={T.eo_e+"44"} strokeWidth={1}/>); }
              return (
                <g key={idx}>
                  {bonds}
                  <circle cx={cx} cy={cy} r={10} fill={T.eo_e+"22"} stroke={T.eo_e} strokeWidth={1.5}/>
                </g>
              );
            })}
            <text x={(gN*sp+36)/2} y={gN*sp+32} textAnchor="middle" fill={T.eo_e} fontSize={8} fontFamily="monospace">Small amplitude — stiff bonds</text>
          </svg>
        </div>
        <div style={{ flex:"0 0 auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.eo_gap, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace", textAlign:"center" }}>Near Vacancy: Loose Vibrations (ω<sub>def</sub>)</div>
          <svg width={gN*sp+36} height={gN*sp+36} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}` }}>
            {Array.from({length:gN*gN},(_,idx)=>{
              const row = Math.floor(idx/gN), col = idx%gN;
              const vacIdx = Math.floor(gN/2)*gN + Math.floor(gN/2); // center atom is vacancy
              const isVac = idx === vacIdx;
              const distToVac = Math.abs(row - Math.floor(gN/2)) + Math.abs(col - Math.floor(gN/2));
              const isNeighbor = distToVac === 1;
              const amp = isVac ? 0 : isNeighbor ? 5.5 * (1.0/freqRatio) : 1.5;
              const freq = isNeighbor ? 2.5 * freqRatio : 4;
              const vx = isVac ? 0 : Math.sin(t*freq + idx*1.9) * amp;
              const vy = isVac ? 0 : Math.cos(t*(freq*0.85) + idx*2.3) * amp;
              const cx = ox + col*sp + sp/2 + vx, cy = oy + row*sp + sp/2 + vy;
              if (isVac) {
                return (
                  <g key={idx}>
                    <circle cx={cx} cy={cy} r={10} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3,3"/>
                    <text x={cx} y={cy+3} textAnchor="middle" fill={T.eo_gap} fontSize={10} fontFamily="monospace" fontWeight="bold">V</text>
                  </g>
                );
              }
              // bonds (skip if neighbor is vacancy)
              const bonds = [];
              if (col < gN-1 && !(idx+1===vacIdx)) { const nIdx=idx+1; const nNb=Math.abs(Math.floor(nIdx/gN)-Math.floor(gN/2))+Math.abs(nIdx%gN-Math.floor(gN/2))===1; const nAmp=nNb?5.5*(1.0/freqRatio):1.5; const nFreq=nNb?2.5*freqRatio:4; const nx=ox+(col+1)*sp+sp/2+Math.sin(t*nFreq+(nIdx)*1.9)*nAmp; const ny=oy+row*sp+sp/2+Math.cos(t*(nFreq*0.85)+(nIdx)*2.3)*nAmp; bonds.push(<line key={`r${idx}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={isNeighbor||nNb?T.eo_gap+"66":T.eo_e+"44"} strokeWidth={1}/>); }
              if (row < gN-1 && !(idx+gN===vacIdx)) { const nIdx=idx+gN; const nNb=Math.abs(Math.floor(nIdx/gN)-Math.floor(gN/2))+Math.abs(nIdx%gN-Math.floor(gN/2))===1; const nAmp=nNb?5.5*(1.0/freqRatio):1.5; const nFreq=nNb?2.5*freqRatio:4; const nx=ox+col*sp+sp/2+Math.sin(t*nFreq+(nIdx)*1.9)*nAmp; const ny=oy+(row+1)*sp+sp/2+Math.cos(t*(nFreq*0.85)+(nIdx)*2.3)*nAmp; bonds.push(<line key={`b${idx}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={isNeighbor||nNb?T.eo_gap+"66":T.eo_e+"44"} strokeWidth={1}/>); }
              return (
                <g key={idx}>
                  {bonds}
                  <circle cx={cx} cy={cy} r={10} fill={isNeighbor?T.eo_gap+"22":T.eo_e+"22"} stroke={isNeighbor?T.eo_gap:T.eo_e} strokeWidth={1.5}/>
                </g>
              );
            })}
            <text x={(gN*sp+36)/2} y={gN*sp+32} textAnchor="middle" fill={T.eo_gap} fontSize={8} fontFamily="monospace">Neighbors vibrate more — soft bonds</text>
          </svg>
        </div>
      </div>

      {/* Physics explanation */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_valence}33`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.eo_valence, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Why Does This Matter So Much?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Vibrational entropy is often the <strong>largest</strong> non-configurational entropy contribution — typically
          <strong> 2-15 k<sub>B</sub></strong> per defect. This means it can boost defect concentrations by
          exp(ΔS<sub>vib</sub>/k<sub>B</sub>) ≈ 10-10<sup>6</sup> times compared to the 0 K prediction.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
          {[
            { mat:"V_Cu in Cu", sv:"4.4 k_B", boost:"~80×", color:T.eo_photon },
            { mat:"V_In in In₂O₃", sv:"5.3 k_B", boost:"~200×", color:T.eo_e },
            { mat:"V_Cd in CdTe", sv:"6-8 k_B", boost:"~1000×", color:T.eo_core },
          ].map((m,i)=>(
            <div key={i} style={{ background:T.surface, borderLeft:`3px solid ${m.color}`, borderRadius:6, padding:"8px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:m.color, fontFamily:"'IBM Plex Mono',monospace" }}>{m.mat}</div>
              <div style={{ fontSize:9, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>ΔS<sub>vib</sub> ≈ {m.sv}</div>
              <div style={{ fontSize:9, color:T.eo_gap, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>c boost: {m.boost}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_valence, marginBottom:4, fontFamily:"'IBM Plex Mono',monospace" }}>ΔS<sub>vib</sub> vs Frequency Ratio</div>
          <Plot data={curve} xMin={0.5} xMax={1.5} yMin={-5} yMax={Math.max(8, dSvib_kB+2)}
            color={T.eo_valence} markerX={freqRatio} width={340} height={200} xLabel="ω_defect / ω_bulk" yLabel="ΔS_vib (k_B)"/>
          <div style={{ fontSize:9, color:T.muted, marginTop:4, lineHeight:1.7, fontFamily:"'IBM Plex Mono',monospace" }}>
            Ratio {"<"} 1: phonon softening (vacancy-like). Ratio {">"} 1: phonon hardening (interstitial-like).
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="ω_defect / ω_bulk — frequency ratio" value={freqRatio} min={0.5} max={1.5} step={0.01} onChange={setFreqRatio} color={T.eo_valence} unit=""/>
          <SliderRow label="n_modes — changed modes" value={nModes} min={1} max={50} step={1} onChange={setNModes} color={T.eo_core} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_e} unit=" K" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>STEP-BY-STEP CALCULATION</div>
            <CalcRow eq={`ΔS_vib = ${nModes} × ln(1/${freqRatio.toFixed(2)})`} result={`${dSvib_kB.toFixed(2)} k_B`} color={T.eo_valence}/>
            <CalcRow eq={`ΔS_vib in eV/K = ${dSvib_kB.toFixed(2)} × ${kB_eV.toExponential(3)}`} result={`${dSvib.toExponential(3)} eV/K`} color={T.eo_valence}/>
            <CalcRow eq={`−TΔS_vib at ${Tval} K`} result={`${(-TdSvib*1000).toFixed(0)} meV`} color={T.eo_gap}/>
            <CalcRow eq={`Concentration boost = exp(${dSvib_kB.toFixed(2)})`} result={`${Math.exp(dSvib_kB).toFixed(0)}×`} color={T.eo_core}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="ΔS_vib" value={`${dSvib_kB.toFixed(1)} k_B`} color={T.eo_valence} sub={freqRatio<1?"softening":"hardening"}/>
            <ResultBox label="−TΔS" value={`${(-TdSvib*1000).toFixed(0)} meV`} color={T.eo_gap} sub={`at ${Tval} K`}/>
            <ResultBox label="Boost" value={`${Math.exp(dSvib_kB).toFixed(0)}×`} color={T.eo_core} sub="c multiplier"/>
          </div>

          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#eef7f0", padding:10, borderRadius:8, border:`1px solid ${T.eo_valence}`, fontFamily:"'IBM Plex Mono',monospace" }}>
            <strong style={{color:T.eo_valence}}>How to compute ω<sub>defect</sub>:</strong> Run phonon calculations
            (e.g., phonopy with VASP/DFPT) for both the perfect and defective supercells. Compare the phonon DOS
            or compute the determinant ratio: exp(ΔS<sub>vib</sub>/k<sub>B</sub>) = ∏(ω<sub>b,i</sub>/ω<sub>d,i</sub>).
            Use a supercell large enough that phonons at the boundary match the bulk.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 8: Orientational Entropy ──
function OrientationalEntropySection() {
  const [nOrient, setNOrient] = useState(6);
  const [Tval, setTval] = useState(1000);
  const [frame, setFrame] = useState(0);

  useEffect(() => { const id = setInterval(() => setFrame(f => f + 1), 100); return () => clearInterval(id); }, []);

  const Sorient = kB_eV * Math.log(Math.max(1, nOrient));
  const TSorient = Tval * Sorient;

  // Animated tetrahedron showing symmetry breaking
  const t = frame * 0.04;
  const activeOrient = Math.floor(t % Math.max(1, nOrient));

  return (
    <Card color={T.eo_photon} title="Orientational Entropy" formula="S_f^orient = k_B ln(N_orient)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Symmetry Breaking and Equivalent Orientations</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          A perfect lattice site has the <strong>full symmetry of the crystal</strong> (e.g., T<sub>d</sub> for zinc blende,
          O<sub>h</sub> for rock salt). When a defect <strong>distorts</strong> to a lower symmetry, multiple orientations of the
          distortion are symmetry-equivalent — they all have the <strong>same energy</strong> but point in different directions.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          The number of equivalent orientations = |G<sub>bulk</sub>| / |G<sub>defect</sub>| (ratio of symmetry group orders).
          For example, a T<sub>d</sub> site (order 24) with a defect that distorts to C<sub>2v</sub> (order 4) gives
          24/4 = <strong>6 orientations</strong>. This is like dice — 6 equivalent faces, each equally probable.
        </div>
      </div>

      {/* Visual: tetrahedron with symmetry-breaking arrows */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_photon}33`, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.eo_photon, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>
          T<sub>d</sub> → C<sub>2v</sub> Distortion: 6 Equivalent Orientations
        </div>
        <svg viewBox="0 0 420 130" style={{ display:"block", background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:420 }}>
          {/* Show 6 orientations of the distortion as small tetrahedral diagrams */}
          {Array.from({length:Math.min(6, nOrient)},(_,i)=>{
            const cx = 40 + i * 65, cy = 65;
            const isActive = i === (activeOrient % Math.min(6, nOrient));
            // 4 corners of tetrahedron (projected 2D)
            const corners = [
              {x:cx, y:cy-25}, {x:cx-22, y:cy+15}, {x:cx+22, y:cy+15}, {x:cx, y:cy+5}
            ];
            // Highlight a different pair of corners for each orientation
            const pairs = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
            const pair = pairs[i % pairs.length];
            return (
              <g key={i}>
                <rect x={cx-28} y={cy-32} width={56} height={68} rx={6} fill={isActive?T.eo_photon+"15":"none"} stroke={isActive?T.eo_photon:T.border} strokeWidth={isActive?2:1}/>
                {/* Edges */}
                {[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]].map(([a,b],ei)=>(
                  <line key={ei} x1={corners[a].x} y1={corners[a].y} x2={corners[b].x} y2={corners[b].y}
                    stroke={(a===pair[0]&&b===pair[1])||(a===pair[1]&&b===pair[0])?T.eo_photon:T.dim} strokeWidth={(a===pair[0]&&b===pair[1])?2.5:1}/>
                ))}
                {/* Corners */}
                {corners.map((c,ci)=>(
                  <circle key={ci} cx={c.x} cy={c.y} r={4} fill={pair.includes(ci)?T.eo_photon:T.eo_e} stroke="none"/>
                ))}
                <text x={cx} y={cy+42} textAnchor="middle" fill={isActive?T.eo_photon:T.muted} fontSize={8} fontFamily="monospace">#{i+1}</text>
              </g>
            );
          })}
          {nOrient > 6 && <text x={420-20} y={70} fill={T.muted} fontSize={9} fontFamily="monospace">+{nOrient-6} more</text>}
        </svg>
      </div>

      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200 }}>
          {/* Symmetry cases grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:6, marginBottom:12 }}>
            {[
              { sym:"T_d → T_d", n:1, example:"V_Cd²⁻ (no distortion)" },
              { sym:"T_d → C_3v", n:4, example:"V_Cd⁻ (trigonal)" },
              { sym:"T_d → C_2v", n:6, example:"V_Cd⁰ (tetragonal)" },
              { sym:"T_d → C_1", n:24, example:"split interstitial" },
              { sym:"O_h → D_4h", n:3, example:"Jahn-Teller (cubic)" },
              { sym:"O_h → C_3v", n:8, example:"⟨111⟩ split vacancy" },
              { sym:"O_h → D_2h", n:6, example:"⟨110⟩ dumbbell" },
              { sym:"O_h → C_1", n:48, example:"general distortion" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.n===nOrient ? T.eo_photon+"22" : T.panel, border:`1.5px solid ${item.n===nOrient ? T.eo_photon : T.border}`, borderRadius:6, padding:"6px", textAlign:"center", cursor:"pointer" }} onClick={()=>setNOrient(item.n)}>
                <div style={{ fontSize:9, fontWeight:700, color: item.n===nOrient ? T.eo_photon : T.ink, fontFamily:"'IBM Plex Mono',monospace" }}>{item.sym}</div>
                <div style={{ fontSize:12, fontWeight:800, color:T.eo_photon, fontFamily:"'IBM Plex Mono',monospace" }}>{item.n}×</div>
                <div style={{ fontSize:7, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{item.example}</div>
              </div>
            ))}
          </div>

          <SliderRow label="N_orient — equivalent orientations" value={nOrient} min={1} max={48} step={1} onChange={setNOrient} color={T.eo_photon} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2, fontFamily:"'IBM Plex Mono',monospace" }}>CALCULATION</div>
            <CalcRow eq={`N_orient = |G_bulk| / |G_defect|`} result={`${nOrient}`} color={T.eo_photon}/>
            <CalcRow eq={`S_orient = k_B × ln(${nOrient})`} result={`${(Math.log(Math.max(1,nOrient))).toFixed(2)} k_B`} color={T.eo_photon}/>
            <CalcRow eq={`−TS_orient at ${Tval} K`} result={`${(-TSorient*1000).toFixed(1)} meV`} color={T.eo_gap}/>
            <CalcRow eq={`Concentration boost`} result={`${nOrient}×`} color={T.eo_core}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="N_orient" value={`${nOrient}`} color={T.eo_photon}/>
            <ResultBox label="S_orient" value={`${(Math.log(Math.max(1,nOrient))).toFixed(2)} k_B`} color={T.eo_valence}/>
            <ResultBox label="−TS" value={`${(-TSorient*1000).toFixed(0)} meV`} color={T.eo_gap} sub={`at ${Tval} K`}/>
          </div>

          <div style={{ marginTop:10, fontSize:10, color:T.muted, lineHeight:1.8, background:"#fef8e8", padding:10, borderRadius:8, border:`1px solid ${T.eo_photon}`, fontFamily:"'IBM Plex Mono',monospace" }}>
            <strong style={{color:T.eo_photon}}>Key point:</strong> Orientational entropy is often overlooked but can
            contribute 1-3 k<sub>B</sub>. For the V<sub>Cd</sub>⁰ in CdTe, the distortion from T<sub>d</sub> to C<sub>2v</sub>
            gives 6 orientations → ln(6) = 1.79 k<sub>B</sub>, boosting the vacancy concentration by 6×.
            This is a purely geometric effect — no phonon calculation needed, just symmetry analysis.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 9: Charge State Transitions ──
function ChargeTransitionSection() {
  const [uf0, setUf0] = useState(2.5);
  const [eps_01, setEps01] = useState(0.8);
  const [eps_12, setEps12] = useState(1.5);
  const [bandgap, setBandgap] = useState(2.5);
  const [EF, setEF] = useState(1.2);

  const charges = [
    { q:2,  color:T.eo_gap,     uf: ef => uf0 + 2*ef - 2*0.3 },
    { q:1,  color:"#ea580c",    uf: ef => uf0 + ef - 0.3 },
    { q:0,  color:T.eo_core,    uf: () => uf0 },
    { q:-1, color:T.eo_e,       uf: ef => uf0 - ef + eps_01 },
    { q:-2, color:T.eo_valence, uf: ef => uf0 - 2*ef + eps_01 + eps_12 },
  ];

  return (
    <Card color={T.eo_gap} title="Charge State Transitions" formula="u_f(q) = u_f(0) + q·E_F — transition at ε(q/q')">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>Charge States and Fermi Level Dependence</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Defects can trap or release electrons, existing in multiple <strong>charge states</strong> q. The formation energy
          depends <strong>linearly</strong> on the Fermi level E<sub>F</sub> with slope q:
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:T.ink, lineHeight:2.4, marginTop:6, textAlign:"center", background:T.panel, borderRadius:8, padding:"6px 14px", border:`1px solid ${T.border}` }}>
          u<sub>f</sub>(q) = u<sub>f</sub>(0) + <span style={{color:T.eo_gap, fontWeight:700}}>q</span>·<span style={{color:T.eo_photon, fontWeight:700}}>E<sub>F</sub></span>
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          The <strong>thermodynamic transition level</strong> ε(q/q') is the Fermi level where charge states q and q' have
          equal formation energy. At this E<sub>F</sub>, the defect switches its stable charge state. These levels determine
          whether a defect acts as a <strong>donor</strong> (releases electrons), <strong>acceptor</strong> (captures electrons),
          or <strong>amphoteric</strong> (both).
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:10 }}>
          <div style={{ background:T.panel, borderLeft:`3px solid ${T.eo_gap}`, borderRadius:6, padding:"8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_gap, fontFamily:"'IBM Plex Mono',monospace" }}>Donor (q {">"} 0)</div>
            <div style={{ fontSize:9, color:T.muted, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6 }}>Released electrons to CB. Example: V<sub>O</sub> in ZnO (q = +2). u<sub>f</sub> increases with E<sub>F</sub>.</div>
          </div>
          <div style={{ background:T.panel, borderLeft:`3px solid ${T.eo_core}`, borderRadius:6, padding:"8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_core, fontFamily:"'IBM Plex Mono',monospace" }}>Neutral (q = 0)</div>
            <div style={{ fontSize:9, color:T.muted, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6 }}>No charge exchange. u<sub>f</sub> is constant — independent of Fermi level. Horizontal line in the diagram.</div>
          </div>
          <div style={{ background:T.panel, borderLeft:`3px solid ${T.eo_e}`, borderRadius:6, padding:"8px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.eo_e, fontFamily:"'IBM Plex Mono',monospace" }}>Acceptor (q {"<"} 0)</div>
            <div style={{ fontSize:9, color:T.muted, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.6 }}>Captured electrons from VB. Example: V<sub>Cd</sub> in CdTe (q = −2). u<sub>f</sub> decreases with E<sub>F</sub>.</div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 380px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.eo_gap, marginBottom:4 }}>Formation Energy vs Fermi Level</div>
          <svg viewBox="0 0 380 260" style={{ display:"block", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:380 }}>
            <line x1={50} y1={10} x2={50} y2={230} stroke={T.dim} strokeWidth={1}/>
            <line x1={50} y1={230} x2={360} y2={230} stroke={T.dim} strokeWidth={1}/>
            <text x={205} y={252} textAnchor="middle" fill={T.muted} fontSize={10}>E_F (eV)</text>
            <text x={12} y={120} textAnchor="middle" fill={T.muted} fontSize={10} transform="rotate(-90, 12, 120)">u_f (eV)</text>
            {/* VBM and CBM labels */}
            <text x={50} y={245} textAnchor="middle" fill={T.eo_e} fontSize={9} fontWeight={700}>VBM</text>
            <text x={50 + (bandgap/bandgap)*300} y={245} textAnchor="middle" fill={T.eo_gap} fontSize={9} fontWeight={700}>CBM</text>
            {/* Band gap shading */}
            <rect x={50} y={10} width={300} height={220} fill={T.eo_e+"08"}/>
            {/* Charge state lines */}
            {charges.map((cs, ci) => {
              const pts = Array.from({length:50},(_,i)=>{
                const ef = i * bandgap / 49;
                const y = cs.uf(ef);
                const sx = 50 + (ef / bandgap) * 300;
                const sy = 230 - ((y - (-1)) / 6) * 220;
                return `${sx},${Math.max(10,Math.min(230,sy))}`;
              }).join(" ");
              return <polyline key={ci} points={pts} fill="none" stroke={cs.color} strokeWidth={2}/>;
            })}
            {/* Fermi level marker */}
            <line x1={50 + (EF/bandgap)*300} y1={10} x2={50 + (EF/bandgap)*300} y2={230} stroke={T.gold} strokeWidth={1.5} strokeDasharray="4 3"/>
            {/* Legend */}
            {charges.map((cs, i) => (
              <g key={i}>
                <line x1={290} y1={20+i*16} x2={310} y2={20+i*16} stroke={cs.color} strokeWidth={2}/>
                <text x={315} y={24+i*16} fill={cs.color} fontSize={9} fontWeight={600}>q={cs.q>0?"+":""}{cs.q}</text>
              </g>
            ))}
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="u_f(0) — neutral formation energy" value={uf0} min={0.5} max={5.0} step={0.1} onChange={setUf0} color={T.eo_core} unit=" eV"/>
          <SliderRow label="ε(0/−1) — transition level" value={eps_01} min={0.1} max={bandgap} step={0.05} onChange={setEps01} color={T.eo_e} unit=" eV"/>
          <SliderRow label="ε(−1/−2) — transition level" value={eps_12} min={0.1} max={bandgap} step={0.05} onChange={setEps12} color={T.eo_valence} unit=" eV"/>
          <SliderRow label="E_gap — band gap" value={bandgap} min={0.5} max={4.0} step={0.1} onChange={setBandgap} color={T.eo_gap} unit=" eV"/>
          <SliderRow label="E_F — Fermi level position" value={EF} min={0} max={bandgap} step={0.05} onChange={setEF} color={T.gold} unit=" eV"/>

          <div style={{ marginTop:12, background:T.surface, borderRadius:8, padding:12, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:8, letterSpacing:2 }}>AT CURRENT E_F = {EF.toFixed(2)} eV</div>
            {charges.map((cs, i) => (
              <CalcRow key={i} eq={`u_f(q=${cs.q>0?"+":""}${cs.q}) at E_F=${EF.toFixed(2)}`} result={`${cs.uf(EF).toFixed(3)} eV`} color={cs.color}/>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Stable q" value={`${charges.reduce((best,cs)=>cs.uf(EF)<best.uf(EF)?cs:best).q>0?"+":""}${charges.reduce((best,cs)=>cs.uf(EF)<best.uf(EF)?cs:best).q}`} color={T.eo_gap} sub="lowest energy"/>
            <ResultBox label="u_f (stable)" value={`${Math.min(...charges.map(cs=>cs.uf(EF))).toFixed(3)} eV`} color={T.eo_core}/>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Section 10: Entropy Summary Table ──
function EntropySummarySection() {
  const [Tval, setTval] = useState(1000);
  // Example: V_Cd in CdTe
  const exEntropies = { elec: 0.69, spin: 0.69, vib: 6.5, orient: 1.79 };
  const totalS = exEntropies.elec + exEntropies.spin + exEntropies.vib + exEntropies.orient;
  const totalBoost = Math.exp(totalS);
  const TSmeV = totalS * kB_eV * Tval * 1000;

  return (
    <Card color={T.eo_cond} title="All Entropy Contributions — Summary">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>The Complete Picture</div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:T.ink, lineHeight:2.4, textAlign:"center", marginBottom:8 }}>
          s<sub>f</sub> = s<sub>f</sub><sup style={{color:T.eo_cond}}>elec</sup> + s<sub>f</sub><sup style={{color:T.eo_e}}>spin</sup> + s<sub>f</sub><sup style={{color:T.eo_valence}}>vib</sup> + s<sub>f</sub><sup style={{color:T.eo_photon}}>orient</sup>
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          The total non-configurational formation entropy is the <strong>sum of all four independent contributions</strong>.
          They can be treated separately because they operate on vastly different timescales (femtoseconds to seconds)
          and involve different degrees of freedom (electrons, spins, phonons, geometry).
        </div>
      </div>

      {/* Visual bar chart showing relative magnitudes */}
      <div style={{ background:T.panel, borderRadius:8, padding:14, border:`1px solid ${T.eo_cond}33`, marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.eo_cond, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>
          Example: V<sub>Cd</sub>⁰ in CdTe — Entropy Budget
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {[
            { name:"Electronic", val:exEntropies.elec, color:T.eo_cond, note:"g_e = 2 (one dangling bond)" },
            { name:"Spin", val:exEntropies.spin, color:T.eo_e, note:"S = ½ (one unpaired electron)" },
            { name:"Vibrational", val:exEntropies.vib, color:T.eo_valence, note:"~12 softened modes, ω_d/ω_b ≈ 0.85" },
            { name:"Orientational", val:exEntropies.orient, color:T.eo_photon, note:"T_d → C_2v: 24/4 = 6 orientations" },
          ].map((e,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:80, fontSize:9, fontWeight:700, color:e.color, fontFamily:"'IBM Plex Mono',monospace", textAlign:"right" }}>{e.name}</div>
              <div style={{ flex:1, height:18, background:T.surface, borderRadius:4, border:`1px solid ${T.border}`, position:"relative", overflow:"hidden" }}>
                <div style={{ width:`${(e.val/totalS)*100}%`, height:"100%", background:e.color+"33", borderRight:`2px solid ${e.color}` }}/>
                <div style={{ position:"absolute", left:4, top:2, fontSize:9, color:e.color, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>{e.val.toFixed(2)} k_B</div>
              </div>
              <div style={{ width:200, fontSize:8, color:T.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{e.note}</div>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:8, borderTop:`2px solid ${T.border}`, paddingTop:6 }}>
            <div style={{ width:80, fontSize:10, fontWeight:800, color:T.ink, fontFamily:"'IBM Plex Mono',monospace", textAlign:"right" }}>TOTAL</div>
            <div style={{ flex:1, height:18, background:T.ink+"11", borderRadius:4, border:`1px solid ${T.ink}44`, position:"relative" }}>
              <div style={{ position:"absolute", left:4, top:2, fontSize:9, color:T.ink, fontWeight:800, fontFamily:"'IBM Plex Mono',monospace" }}>{totalS.toFixed(2)} k_B → boost = {totalBoost.toFixed(0)}×</div>
            </div>
            <div style={{ width:200, fontSize:8, color:T.eo_gap, fontWeight:700, fontFamily:"'IBM Plex Mono',monospace" }}>−TS at {Tval}K = {TSmeV.toFixed(0)} meV</div>
          </div>
        </div>
        <SliderRow label="T — temperature" value={Tval} min={200} max={2000} step={10} onChange={setTval} color={T.eo_core} unit=" K" format={v=>v.toFixed(0)}/>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10, fontFamily:"'IBM Plex Mono',monospace" }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${T.border}` }}>
              {["Contribution","Formula","Timescale","Typical Range","When Important","Example"].map(h=>(
                <th key={h} style={{ padding:"6px 8px", textAlign:"left", color:T.muted, fontWeight:700, fontSize:10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name:"Electronic", formula:"k_B ln(g_e)", time:"τ ~ fs", range:"0-3 k_B", when:"Metals, TM impurities", ex:"V_W: 1.7 k_B, V_Ta: −0.5 k_B", color:T.eo_cond },
              { name:"Spin", formula:"k_B ln(2S+1)", time:"τ ~ ps-ns", range:"0-2 k_B", when:"Unpaired electrons", ex:"V_Cl (S=½): 0.69 k_B", color:T.eo_e },
              { name:"Vibrational", formula:"k_B Σln(ω_b/ω_d)", time:"τ ~ ps", range:"2-15 k_B", when:"Always dominant at high T", ex:"V_Cu: 4.4, V_In₂O₃: 5.3 k_B", color:T.eo_valence },
              { name:"Orientational", formula:"k_B ln(N_orient)", time:"τ ~ ns-s", range:"0-3.9 k_B", when:"Symmetry-breaking distortion", ex:"V_Cd⁰ (C₂ᵥ): 1.79 k_B", color:T.eo_photon },
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0?T.panel:T.surface }}>
                <td style={{ padding:"6px 8px", color:row.color, fontWeight:700 }}>{row.name}</td>
                <td style={{ padding:"6px 8px", fontFamily:"'Georgia',serif", color:T.ink }}>{row.formula}</td>
                <td style={{ padding:"6px 8px", color:T.muted }}>{row.time}</td>
                <td style={{ padding:"6px 8px", color:T.ink }}>{row.range}</td>
                <td style={{ padding:"6px 8px", color:T.muted }}>{row.when}</td>
                <td style={{ padding:"6px 8px", color:T.ink, fontSize:9 }}>{row.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:16, background:"#eef3ff", border:`1px solid ${T.eo_e}`, borderRadius:8, padding:14 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.eo_e, marginBottom:6, fontFamily:"'IBM Plex Mono',monospace" }}>Key Takeaway — Why This Matters</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          Neglecting entropy leads to <strong>underestimating defect concentrations by orders of magnitude</strong>.
          The vibrational contribution alone (2-15 k<sub>B</sub>) can boost concentrations by 10-10<sup>6</sup>×.
          Adding spin, electronic, and orientational entropy piles on additional factors of 2-48×.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          <strong>Practical impact:</strong> At growth temperatures (60-100% of T<sub>m</sub>), entropy corrections
          can shift the predicted defect concentration from "negligible" to "device-limiting". This is why
          <strong> the 0 K picture alone is insufficient</strong> for predicting semiconductor behavior — free energy
          (not just energy) determines equilibrium.
        </div>
      </div>
    </Card>
  );
}

// ── Section 11: Workflow ──
function DefectWorkflowSection() {
  return (
    <Card color={T.eo_e} title="Defect Free Energy Workflow">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8, fontFamily:"'IBM Plex Mono',monospace" }}>From Crystal Structure to Device Performance</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace" }}>
          The systematic calculation of defect free energies follows a <strong>multi-step workflow</strong>, combining
          first-principles DFT calculations with statistical mechanics corrections. Each step builds on the previous one,
          progressively adding physics until we arrive at the equilibrium defect concentrations that determine device behavior.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, fontFamily:"'IBM Plex Mono',monospace", marginTop:8 }}>
          <strong>Key tools:</strong> VASP/QE (DFT), PyCDT/doped (defect generation), ShakeNBreak (metastable search),
          phonopy (vibrational entropy), pymatgen (analysis), FNV (finite-size corrections).
        </div>
      </div>
      <svg viewBox="0 0 700 120" style={{ display:"block", background:T.surface, borderRadius:8, border:`1px solid ${T.border}`, width:"100%", maxWidth:700, overflow:"visible" }}>
        {[
          { x:50,  label:"Choose\nHost",       c:T.eo_core, step:"1" },
          { x:150, label:"Identify\nDefects",   c:T.eo_e, step:"2" },
          { x:250, label:"Build\nSupercells",   c:T.eo_valence, step:"3" },
          { x:350, label:"Relax +\nMetastable", c:T.eo_cond, step:"4" },
          { x:450, label:"Formation\nEnergy",   c:T.eo_gap, step:"5" },
          { x:550, label:"Entropy\nCorrections",c:T.eo_photon, step:"6" },
          { x:650, label:"Equilibrium\nConc.",   c:T.eo_core, step:"7" },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x-40} y={15} width={80} height={70} rx={8} fill={b.c+"22"} stroke={b.c} strokeWidth={1.5}/>
            <circle cx={b.x-30} cy={25} r={8} fill={b.c} stroke="none"/>
            <text x={b.x-30} y={29} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={800}>{b.step}</text>
            {b.label.split("\n").map((line, j) => (
              <text key={j} x={b.x} y={48+j*14} textAnchor="middle" fill={b.c} fontSize={9} fontWeight={700}>{line}</text>
            ))}
            {i < 6 && <line x1={b.x+42} y1={50} x2={b.x+58} y2={50} stroke={T.dim} strokeWidth={1.5}/>}
          </g>
        ))}
      </svg>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:16 }}>
        {[
          { step:"1. Choose Host", desc:"Select the material and build a pristine supercell large enough to minimize defect-defect interactions (lattice parameter > 10 Å). Use DFT with appropriate functional (hybrid for accurate band gaps).", color:T.eo_core },
          { step:"2. Identify Defects", desc:"Enumerate all relevant point defects: vacancies (V_X), interstitials (X_i), antisites (X_Y), substitutionals. Consider all possible charge states q for each defect.", color:T.eo_e },
          { step:"3. Build Supercells", desc:"Generate defective supercells using tools like PyCDT, DASP, or doped. Remove/add atoms, set initial charge states. Typical size: 64-256 atoms.", color:T.eo_valence },
          { step:"4. Relax + Find Metastable", desc:"Geometry-optimize each defect structure. Use structure searching (ShakeNBreak) to find metastable configurations — the ground state may not be the obvious one.", color:T.eo_cond },
          { step:"5. Formation Energy", desc:"Calculate u_f from the supercell energies, chemical potentials, Fermi level, and finite-size corrections (FNV). This gives formation energies at 0 K.", color:T.eo_gap },
          { step:"6. Entropy Corrections", desc:"Add non-configurational entropy: vibrational (phonopy), electronic (DOS), spin (2S+1), orientational (symmetry analysis). Use harmonic or quasiharmonic approximation.", color:T.eo_photon },
          { step:"7. Equilibrium Concentrations", desc:"Solve c_eq = (Z_d/Z_b) exp(−h_f/k_BT) self-consistently with Fermi level (charge neutrality). Compute carrier concentrations and defect populations at growth T.", color:T.eo_core },
        ].map((item, i) => (
          <div key={i} style={{ background:T.panel, border:`1px solid ${item.color}33`, borderLeft:`3px solid ${item.color}`, borderRadius:6, padding:"8px 10px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:item.color, marginBottom:2 }}>{item.step}</div>
            <div style={{ fontSize:9, color:T.muted, lineHeight:1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── DEFECT DIAGRAM INTERACTIVE SECTIONS ──

function DefectDiagramSection() {
  const [Eg, setEg] = useState(1.5);
  const [showVac, setShowVac] = useState(true);
  const [showInt, setShowInt] = useState(true);
  const [showSub, setShowSub] = useState(true);
  const [Ef, setEf] = useState(0.75);

  // Defect formation energies at E_F = 0
  const defects = [
    { id:"V_A", q:[-2,-1,0,+1,+2], E0:2.0, label:"V_A (vacancy)", color:T.fnv_warn, show:showVac },
    { id:"A_i", q:[0,+1,+2], E0:1.2, label:"A_i (interstitial)", color:T.fnv_elec, show:showInt },
    { id:"B_A", q:[-1,0,+1], E0:1.8, label:"B_A (substitutional)", color:T.fnv_align, show:showSub },
  ];

  const W = 480, H = 300, pad = { l:55, r:25, t:25, b:35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const maxE = 4.0;

  const toX = ef => pad.l + (ef / Eg) * pw;
  const toY = e => pad.t + (1 - e / maxE) * ph;

  // For each defect, compute formation energy vs E_F for each charge state
  // ΔE(q) = E0 + q * E_F (simplified)
  const lines = [];
  defects.forEach(d => {
    if (!d.show) return;
    d.q.forEach(q => {
      const pts = [];
      for (let ef = 0; ef <= Eg; ef += 0.01) {
        const dE = d.E0 + q * ef;
        if (dE >= 0 && dE <= maxE) pts.push([ef, dE]);
      }
      lines.push({ pts, color: d.color, q, label: d.label, E0: d.E0 });
    });
  });

  // Compute lowest energy envelope for each defect
  const envelopes = defects.filter(d => d.show).map(d => {
    const pts = [];
    for (let ef = 0; ef <= Eg; ef += 0.005) {
      const energies = d.q.map(q => ({ q, e: d.E0 + q * ef }));
      const min = energies.reduce((a, b) => a.e < b.e ? a : b);
      pts.push([ef, min.e, min.q]);
    }
    return { pts, color: d.color, label: d.label };
  });

  const efAtCursor = Ef;
  const cursorFormE = defects.filter(d => d.show).map(d => {
    const energies = d.q.map(q => ({ q, e: d.E0 + q * efAtCursor }));
    const min = energies.reduce((a, b) => a.e < b.e ? a : b);
    return { label: d.label, e: min.e, q: min.q, color: d.color };
  });

  return (
    <Card color={T.fnv_accent} title="Defect Diagram" formula="ΔE_{D,q} = E_{D,q} − E_H + Σn_iμ_i + qE_F">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>What Is a Defect Diagram?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          A <strong>defect diagram</strong> (also called a defect formation energy diagram) plots the formation energy
          of each defect as a function of the <strong>Fermi level E<sub>F</sub></strong>. Each charge state q appears as a straight
          line with slope q. <strong>Donors</strong> (positive q) slope upward; <strong>acceptors</strong> (negative q) slope downward.
          The physically relevant portion is the <strong>lower envelope</strong> — the lowest-energy charge state at each E<sub>F</sub>.
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025) — "A Beginner's Guide to Interpreting Defect and Defect Level Diagrams"
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
        {[{l:"Vacancy V_A", v:showVac, s:setShowVac, c:T.fnv_warn},
          {l:"Interstitial A_i", v:showInt, s:setShowInt, c:T.fnv_elec},
          {l:"Substitutional B_A", v:showSub, s:setShowSub, c:T.fnv_align}].map(b => (
          <button key={b.l} onClick={() => b.s(!b.v)} style={{
            padding:"4px 10px", borderRadius:6, fontSize:10, fontWeight:b.v?700:400, cursor:"pointer",
            background:b.v?b.c+"22":T.bg, border:`1px solid ${b.v?b.c:T.border}`, color:b.v?b.c:T.muted,
          }}>{b.v?"●":"○"} {b.l}</button>
        ))}
      </div>

      <SliderRow label="Band Gap Eg" value={Eg} min={0.5} max={3.0} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />
      <SliderRow label="Fermi Level E_F" value={Ef} min={0} max={Eg} step={0.01} onChange={setEf} color={T.fnv_main} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        {/* VBM and CBM bands */}
        <rect x={pad.l} y={toY(maxE)} width={pw} height={ph} fill={T.surface} />
        <rect x={pad.l-2} y={toY(maxE)} width={6} height={ph} fill={T.fnv_elec+"44"} rx={2} />
        <rect x={pad.l+pw-4} y={toY(maxE)} width={6} height={ph} fill={T.fnv_warn+"44"} rx={2} />
        <text x={pad.l-8} y={toY(0)+4} textAnchor="end" fill={T.fnv_elec} fontSize={9} fontWeight="bold">VBM</text>
        <text x={pad.l+pw+8} y={toY(0)+4} textAnchor="start" fill={T.fnv_warn} fontSize={9} fontWeight="bold">CBM</text>

        {/* Grid lines */}
        {[0,1,2,3,4].map(e => (
          <g key={e}>
            <line x1={pad.l} y1={toY(e)} x2={pad.l+pw} y2={toY(e)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
            <text x={pad.l-8} y={toY(e)+4} textAnchor="end" fill={T.muted} fontSize={8}>{e}</text>
          </g>
        ))}

        {/* All charge state lines (faint) */}
        {lines.map((l, i) => (
          <polyline key={i} points={l.pts.map(p => `${toX(p[0])},${toY(p[1])}`).join(" ")}
            fill="none" stroke={l.color+"44"} strokeWidth={0.8} />
        ))}

        {/* Lower envelopes (bold) */}
        {envelopes.map((env, i) => (
          <polyline key={`env-${i}`} points={env.pts.map(p => `${toX(p[0])},${toY(p[1])}`).join(" ")}
            fill="none" stroke={env.color} strokeWidth={2.5} />
        ))}

        {/* Fermi level cursor */}
        <line x1={toX(Ef)} y1={pad.t} x2={toX(Ef)} y2={pad.t+ph} stroke={T.fnv_main} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={toX(Ef)} y={pad.t-5} textAnchor="middle" fill={T.fnv_main} fontSize={8} fontWeight="bold">E_F</text>

        {/* Cursor intersection markers */}
        {cursorFormE.map((d, i) => (
          <circle key={i} cx={toX(Ef)} cy={toY(d.e)} r={4} fill={d.color} stroke="#fff" strokeWidth={1} />
        ))}

        {/* Axes labels */}
        <text x={pad.l + pw/2} y={H-5} textAnchor="middle" fill={T.muted} fontSize={9}>Fermi Level E_F (eV)</text>
        <text x={12} y={pad.t + ph/2} textAnchor="middle" fill={T.muted} fontSize={9} transform={`rotate(-90,12,${pad.t+ph/2})`}>ΔE_f (eV)</text>

        {/* Legend */}
        {envelopes.map((env, i) => (
          <g key={`leg-${i}`}>
            <line x1={pad.l+10} y1={pad.t+10+i*14} x2={pad.l+25} y2={pad.t+10+i*14} stroke={env.color} strokeWidth={2} />
            <text x={pad.l+30} y={pad.t+13+i*14} fill={env.color} fontSize={8}>{env.label}</text>
          </g>
        ))}
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:8 }}>
        {cursorFormE.map((d, i) => (
          <ResultBox key={i} label={d.label} value={`${d.e.toFixed(3)} eV`} color={d.color} sub={`q = ${d.q>0?"+":""}${d.q}`} />
        ))}
      </div>
    </Card>
  );
}

function ChargTransitionLevelSection() {
  const [Eg, setEg] = useState(1.5);
  const [E0_donor, setE0_donor] = useState(0.8);
  const [E0_acceptor, setE0_acceptor] = useState(2.2);

  // Donor: q = +1 (ionized), q = 0 (neutral) → CTL at E_F where ΔE(+1) = ΔE(0)
  // E0 + q*Ef equal for two q → Ef_ctl = -(E0_q1 - E0_q2)/(q1 - q2) but same defect so E0 same
  // CTL(q/q') = (E_{D,q} - E_{D,q'}) / (q' - q)
  // For simplicity: donor has E0_d at q=0, and we shift by 0.1 for q=+1 state energy
  const donorShift = 0.15;
  const acceptorShift = 0.12;

  // Donor CTL: (+1/0) → where E0_d + 1*Ef = (E0_d + donorShift) + 0*Ef → Ef_ctl = donorShift
  const ctlDonor = donorShift;
  // Acceptor CTL: (0/-1) → where (E0_a) + 0*Ef = (E0_a + acceptorShift) + (-1)*Ef → Ef_ctl = acceptorShift
  const ctlAcceptor = Eg - acceptorShift;

  const W = 480, H = 300, pad = { l:55, r:25, t:25, b:35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const maxE = 4.0;
  const toX = ef => pad.l + (ef / Eg) * pw;
  const toY = e => pad.t + (1 - e / maxE) * ph;

  // Donor lines
  const donorLines = [
    { q:1, E0: E0_donor, color: T.fnv_elec },
    { q:0, E0: E0_donor + donorShift, color: T.fnv_elec },
  ];
  // Acceptor lines
  const accLines = [
    { q:0, E0: E0_acceptor, color: T.fnv_warn },
    { q:-1, E0: E0_acceptor + acceptorShift, color: T.fnv_warn },
  ];

  // Defect level diagram bar
  const barW = 60, barH = 160, barX = W - pad.r - barW - 10, barY = pad.t + 20;

  return (
    <Card color={T.fnv_elec} title="Charge-Transition Levels (CTLs)" formula="ε(q/q') = (E_{D,q} − E_{D,q'}) / (q' − q)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>What Are Charge-Transition Levels?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          A <strong>charge-transition level (CTL)</strong> ε(q/q') is the Fermi level at which a defect changes its
          most stable charge state from q to q'. Graphically, CTLs are the <strong>kink points</strong> in the lower envelope
          of the defect diagram — where two lines of different slope intersect.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, marginTop:6 }}>
          CTLs are plotted as horizontal lines within the <strong>defect level diagram</strong> — a vertical bar
          representing the band gap, with CTL positions marked relative to VBM and CBM.
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025)
        </div>
      </div>

      <SliderRow label="Band Gap Eg" value={Eg} min={0.5} max={3.0} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />
      <SliderRow label="Donor E0" value={E0_donor} min={0.2} max={2.5} step={0.05} onChange={setE0_donor} color={T.fnv_elec} unit=" eV" />
      <SliderRow label="Acceptor E0" value={E0_acceptor} min={0.5} max={3.5} step={0.05} onChange={setE0_acceptor} color={T.fnv_warn} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        <rect x={pad.l} y={toY(maxE)} width={pw-barW-30} height={ph} fill={T.surface} />

        {/* Donor charge state lines */}
        {donorLines.map((l, i) => {
          const pts = [];
          for (let ef = 0; ef <= Eg; ef += 0.01) {
            const e = l.E0 + l.q * ef;
            if (e >= 0 && e <= maxE) pts.push(`${toX(ef)},${toY(e)}`);
          }
          return <polyline key={`d${i}`} points={pts.join(" ")} fill="none" stroke={l.color} strokeWidth={i===0?2:1.5} strokeDasharray={i===1?"4,3":"none"} />;
        })}

        {/* Acceptor charge state lines */}
        {accLines.map((l, i) => {
          const pts = [];
          for (let ef = 0; ef <= Eg; ef += 0.01) {
            const e = l.E0 + l.q * ef;
            if (e >= 0 && e <= maxE) pts.push(`${toX(ef)},${toY(e)}`);
          }
          return <polyline key={`a${i}`} points={pts.join(" ")} fill="none" stroke={l.color} strokeWidth={i===0?2:1.5} strokeDasharray={i===1?"4,3":"none"} />;
        })}

        {/* CTL markers on the plot */}
        {ctlDonor >= 0 && ctlDonor <= Eg && (
          <g>
            <circle cx={toX(ctlDonor)} cy={toY(E0_donor + 1*ctlDonor)} r={6} fill={T.fnv_elec+"44"} stroke={T.fnv_elec} strokeWidth={2} />
            <text x={toX(ctlDonor)+10} y={toY(E0_donor + 1*ctlDonor)-5} fill={T.fnv_elec} fontSize={9} fontWeight="bold">ε(+1/0)</text>
          </g>
        )}
        {ctlAcceptor >= 0 && ctlAcceptor <= Eg && (
          <g>
            <circle cx={toX(ctlAcceptor)} cy={toY(E0_acceptor + 0*ctlAcceptor)} r={6} fill={T.fnv_warn+"44"} stroke={T.fnv_warn} strokeWidth={2} />
            <text x={toX(ctlAcceptor)+10} y={toY(E0_acceptor + 0*ctlAcceptor)-5} fill={T.fnv_warn} fontSize={9} fontWeight="bold">ε(0/−1)</text>
          </g>
        )}

        {/* Defect level diagram bar */}
        <rect x={barX} y={barY} width={barW} height={barH} fill={T.surface} stroke={T.border} strokeWidth={1.5} rx={4} />
        <text x={barX+barW/2} y={barY-6} textAnchor="middle" fill={T.ink} fontSize={9} fontWeight="bold">Defect Levels</text>
        <text x={barX+barW/2} y={barY+barH+12} textAnchor="middle" fill={T.fnv_elec} fontSize={8}>VBM</text>
        <text x={barX+barW/2} y={barY-16} textAnchor="middle" fill={T.fnv_warn} fontSize={8}>CBM</text>

        {/* CTL positions in the bar */}
        {ctlDonor >= 0 && ctlDonor <= Eg && (() => {
          const y = barY + barH - (ctlDonor / Eg) * barH;
          return <g>
            <line x1={barX+4} y1={y} x2={barX+barW-4} y2={y} stroke={T.fnv_elec} strokeWidth={2} />
            <text x={barX-4} y={y+3} textAnchor="end" fill={T.fnv_elec} fontSize={7}>{ctlDonor.toFixed(2)}</text>
          </g>;
        })()}
        {ctlAcceptor >= 0 && ctlAcceptor <= Eg && (() => {
          const y = barY + barH - (ctlAcceptor / Eg) * barH;
          return <g>
            <line x1={barX+4} y1={y} x2={barX+barW-4} y2={y} stroke={T.fnv_warn} strokeWidth={2} />
            <text x={barX+barW+4} y={y+3} textAnchor="start" fill={T.fnv_warn} fontSize={7}>{ctlAcceptor.toFixed(2)}</text>
          </g>;
        })()}

        {/* Axes */}
        <text x={pad.l + (pw-barW-30)/2} y={H-5} textAnchor="middle" fill={T.muted} fontSize={9}>Fermi Level E_F (eV)</text>
        <text x={12} y={pad.t + ph/2} textAnchor="middle" fill={T.muted} fontSize={9} transform={`rotate(-90,12,${pad.t+ph/2})`}>ΔE_f (eV)</text>
        {[0,1,2,3,4].map(e => (
          <text key={e} x={pad.l-8} y={toY(e)+4} textAnchor="end" fill={T.muted} fontSize={8}>{e}</text>
        ))}
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <ResultBox label="Donor CTL ε(+1/0)" value={`${ctlDonor.toFixed(3)} eV`} color={T.fnv_elec} sub="above VBM" />
        <ResultBox label="Acceptor CTL ε(0/−1)" value={`${ctlAcceptor.toFixed(3)} eV`} color={T.fnv_warn} sub="above VBM" />
      </div>

      <CalcRow eq="ε(q/q') = (E_{D,q} − E_{D,q'}) / (q' − q)" result="Kink point in diagram" color={T.fnv_elec} />
    </Card>
  );
}

function ShallowDeepSection() {
  const [Eg, setEg] = useState(1.5);
  const [ctlPos, setCtlPos] = useState(0.1);
  const [defectType, setDefectType] = useState("donor");

  const ionizationE = defectType === "donor" ? ctlPos : Eg - ctlPos;
  const isShallow = ionizationE < 0.1;
  const isMidgap = ctlPos > 0.3 * Eg && ctlPos < 0.7 * Eg;

  const W = 420, H = 220, pad = { l:40, r:30, t:30, b:30 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const vbmY = pad.t + ph;
  const cbmY = pad.t;
  const ctlY = vbmY - (ctlPos / Eg) * ph;

  const bandColor = T.fnv_elec;
  const ctlColor = isShallow ? T.fnv_align : (isMidgap ? T.fnv_warn : T.fnv_warm);

  return (
    <Card color={T.fnv_warm} title="Shallow vs Deep Defects" formula="Shallow: ε near band edge | Deep: ε in mid-gap">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>When Is a Defect "Shallow" or "Deep"?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          A <strong>shallow</strong> defect has its CTL very close to a band edge (within ~k<sub>B</sub>T). At room temperature,
          carriers are thermally ionized into the band, contributing to free carrier concentration.
          A <strong>deep</strong> defect has its CTL far from both band edges (mid-gap region). Deep defects act as
          <strong> recombination centers</strong> (Shockley-Read-Hall) and are harmful for optoelectronics.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, marginTop:6 }}>
          The <strong>ionization energy</strong> is the energy difference between the CTL and the nearest band edge.
          Smaller ionization energy = more carriers freed at a given temperature.
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025)
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {["donor","acceptor"].map(dt => (
          <button key={dt} onClick={() => setDefectType(dt)} style={{
            padding:"4px 14px", borderRadius:6, fontSize:10, fontWeight:defectType===dt?700:400, cursor:"pointer",
            background:defectType===dt?T.fnv_elec+"22":T.bg, border:`1px solid ${defectType===dt?T.fnv_elec:T.border}`,
            color:defectType===dt?T.fnv_elec:T.muted, textTransform:"capitalize",
          }}>{dt}</button>
        ))}
      </div>

      <SliderRow label="Band Gap Eg" value={Eg} min={0.5} max={3.0} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />
      <SliderRow label="CTL Position (from VBM)" value={ctlPos} min={0.01} max={Eg-0.01} step={0.01} onChange={setCtlPos} color={ctlColor} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        {/* VBM band */}
        <rect x={pad.l} y={vbmY-4} width={pw} height={20} fill={T.fnv_elec+"33"} stroke={T.fnv_elec} strokeWidth={1.5} rx={3} />
        <text x={pad.l+pw/2} y={vbmY+12} textAnchor="middle" fill={T.fnv_elec} fontSize={10} fontWeight="bold">VBM</text>

        {/* CBM band */}
        <rect x={pad.l} y={cbmY-16} width={pw} height={20} fill={T.fnv_warn+"33"} stroke={T.fnv_warn} strokeWidth={1.5} rx={3} />
        <text x={pad.l+pw/2} y={cbmY-8} textAnchor="middle" fill={T.fnv_warn} fontSize={10} fontWeight="bold">CBM</text>

        {/* Band gap region */}
        <rect x={pad.l+20} y={cbmY} width={pw-40} height={ph} fill={T.surface} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
        <text x={pad.l+pw-15} y={pad.t+ph/2+4} textAnchor="end" fill={T.muted} fontSize={8} fontStyle="italic">Eg = {Eg.toFixed(1)} eV</text>

        {/* CTL line */}
        <line x1={pad.l+30} y1={ctlY} x2={pad.l+pw-30} y2={ctlY} stroke={ctlColor} strokeWidth={2.5} />
        <circle cx={pad.l+pw/2} cy={ctlY} r={5} fill={ctlColor} stroke="#fff" strokeWidth={1.5} />
        <text x={pad.l+pw/2+12} y={ctlY+4} fill={ctlColor} fontSize={9} fontWeight="bold">
          ε({defectType==="donor"?"+1/0":"0/−1"})
        </text>

        {/* Ionization energy arrow */}
        {defectType === "donor" ? (
          <g>
            <line x1={pad.l+60} y1={ctlY} x2={pad.l+60} y2={vbmY-4} stroke={T.fnv_warm} strokeWidth={1.5} markerEnd="url(#arrowD)" />
            <text x={pad.l+48} y={(ctlY+vbmY-4)/2+4} textAnchor="end" fill={T.fnv_warm} fontSize={8} fontWeight="bold">{ionizationE.toFixed(2)} eV</text>
          </g>
        ) : (
          <g>
            <line x1={pad.l+60} y1={ctlY} x2={pad.l+60} y2={cbmY} stroke={T.fnv_warm} strokeWidth={1.5} />
            <text x={pad.l+48} y={(ctlY+cbmY)/2+4} textAnchor="end" fill={T.fnv_warm} fontSize={8} fontWeight="bold">{ionizationE.toFixed(2)} eV</text>
          </g>
        )}

        {/* Classification label */}
        <rect x={pad.l+pw/2-50} y={pad.t+ph/2-25} width={100} height={22} fill={ctlColor+"22"} stroke={ctlColor} strokeWidth={1} rx={6} />
        <text x={pad.l+pw/2} y={pad.t+ph/2-10} textAnchor="middle" fill={ctlColor} fontSize={11} fontWeight="bold">
          {isShallow ? "SHALLOW" : (isMidgap ? "DEEP (mid-gap)" : "MODERATELY DEEP")}
        </text>
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <ResultBox label="CTL Position" value={`${ctlPos.toFixed(2)} eV`} color={ctlColor} sub="from VBM" />
        <ResultBox label="Ionization Energy" value={`${ionizationE.toFixed(3)} eV`} color={T.fnv_warm} sub={isShallow?"Thermally ionized":"Carrier trap"} />
        <ResultBox label="Classification" value={isShallow?"Shallow":(isMidgap?"Deep":"Moderate")} color={ctlColor} sub={isShallow?"Free carriers":"Recombination"} />
      </div>
    </Card>
  );
}

function ChemPotEffectSection() {
  const [Eg, setEg] = useState(1.5);
  const [muShift, setMuShift] = useState(0);
  const [condition, setCondition] = useState("rich");

  // Two defects: V_O (oxygen vacancy) and V_Zn (zinc vacancy) in ZnO-like system
  const defects = [
    { label:"V_O (oxygen vacancy)", E0_base: 1.0, q:[0,+1,+2], nO:-1, nZn:0, color:T.fnv_warn },
    { label:"V_Zn (zinc vacancy)", E0_base: 2.5, q:[-2,-1,0], nO:0, nZn:-1, color:T.fnv_elec },
  ];

  // Chemical potential: μ_O shifts V_O energy by -1*Δμ_O, μ_Zn shifts V_Zn by -1*Δμ_Zn
  // In a binary: Δμ_Zn + Δμ_O = ΔH_f (constraint). So O-rich → Δμ_O=0 → Δμ_Zn = ΔH_f (most negative)
  const deltaH = -3.5; // formation enthalpy of ZnO
  const muO = condition === "rich" ? muShift : deltaH - muShift;
  const muZn = deltaH - muO;

  const W = 480, H = 280, pad = { l:55, r:25, t:25, b:35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const maxE = 5.0;
  const toX = ef => pad.l + (ef / Eg) * pw;
  const toY = e => pad.t + (1 - e / maxE) * ph;

  return (
    <Card color={T.fnv_align} title="Effect of Chemical Potentials" formula="ΔE_{D,q} = E₀ + Σn_iμ_i + qE_F">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>How Do Growth Conditions Affect Defects?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          Chemical potentials μ<sub>i</sub> represent the <strong>reservoir conditions</strong> during growth. Changing μ<sub>i</sub>
          shifts defect lines <strong>vertically</strong> (up or down) without changing their <strong>slopes</strong> (charge states stay the same).
          This means growth conditions control <em>which defects dominate</em> but not their charge behavior.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, marginTop:6 }}>
          Example: In <strong>ZnO</strong>, O-rich conditions suppress V<sub>O</sub> (oxygen vacancies) but promote V<sub>Zn</sub> (zinc vacancies).
          O-poor (Zn-rich) conditions do the opposite. The constraint is: Δμ<sub>Zn</sub> + Δμ<sub>O</sub> = ΔH<sub>f</sub>(ZnO).
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025)
        </div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {[{l:"O-rich (Zn-poor)",v:"rich"},{l:"O-poor (Zn-rich)",v:"poor"}].map(c => (
          <button key={c.v} onClick={() => setCondition(c.v)} style={{
            padding:"4px 14px", borderRadius:6, fontSize:10, fontWeight:condition===c.v?700:400, cursor:"pointer",
            background:condition===c.v?T.fnv_align+"22":T.bg, border:`1px solid ${condition===c.v?T.fnv_align:T.border}`,
            color:condition===c.v?T.fnv_align:T.muted,
          }}>{c.l}</button>
        ))}
      </div>

      <SliderRow label="Δμ shift" value={muShift} min={-2} max={0} step={0.05} onChange={setMuShift} color={T.fnv_align} unit=" eV" />
      <SliderRow label="Band Gap" value={Eg} min={0.5} max={3.5} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        <rect x={pad.l} y={toY(maxE)} width={pw} height={ph} fill={T.surface} />
        {[0,1,2,3,4,5].map(e => (
          <g key={e}>
            <line x1={pad.l} y1={toY(e)} x2={pad.l+pw} y2={toY(e)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
            <text x={pad.l-8} y={toY(e)+4} textAnchor="end" fill={T.muted} fontSize={8}>{e}</text>
          </g>
        ))}

        {defects.map((d, di) => {
          const muCorr = d.nO * muO + d.nZn * muZn;
          return d.q.map((q, qi) => {
            const pts = [];
            for (let ef = 0; ef <= Eg; ef += 0.01) {
              const e = d.E0_base + muCorr + q * ef;
              if (e >= -0.5 && e <= maxE + 0.5) pts.push(`${toX(ef)},${toY(Math.max(0,Math.min(maxE,e)))}`);
            }
            return <polyline key={`${di}-${qi}`} points={pts.join(" ")} fill="none" stroke={d.color} strokeWidth={qi===0?2.5:1.5} strokeDasharray={qi>0?"4,3":"none"} />;
          });
        })}

        <text x={pad.l+pw/2} y={H-5} textAnchor="middle" fill={T.muted} fontSize={9}>Fermi Level E_F (eV)</text>
        <text x={12} y={pad.t+ph/2} textAnchor="middle" fill={T.muted} fontSize={9} transform={`rotate(-90,12,${pad.t+ph/2})`}>ΔE_f (eV)</text>

        {defects.map((d, i) => (
          <g key={`leg-${i}`}>
            <line x1={pad.l+10} y1={pad.t+10+i*14} x2={pad.l+25} y2={pad.t+10+i*14} stroke={d.color} strokeWidth={2} />
            <text x={pad.l+30} y={pad.t+14+i*14} fill={d.color} fontSize={8} fontWeight="bold">{d.label}</text>
          </g>
        ))}
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <ResultBox label="Δμ_O" value={`${muO.toFixed(2)} eV`} color={T.fnv_warn} sub={condition==="rich"?"O-rich limit":"O-poor limit"} />
        <ResultBox label="Δμ_Zn" value={`${muZn.toFixed(2)} eV`} color={T.fnv_elec} sub="Constrained by ΔH_f" />
        <ResultBox label="ΔH_f(ZnO)" value={`${deltaH.toFixed(1)} eV`} color={T.fnv_align} sub="Formation enthalpy" />
      </div>

      <div style={{ marginTop:10 }}>
        <CalcRow eq="Δμ_Zn + Δμ_O = ΔH_f(ZnO)" result={`${muZn.toFixed(2)} + ${muO.toFixed(2)} = ${deltaH.toFixed(1)}`} color={T.fnv_align} />
        <CalcRow eq="V_O shift = −1 × Δμ_O" result={`${(-1*muO).toFixed(2)} eV`} color={T.fnv_warn} />
        <CalcRow eq="V_Zn shift = −1 × Δμ_Zn" result={`${(-1*muZn).toFixed(2)} eV`} color={T.fnv_elec} />
      </div>
    </Card>
  );
}

function DopabilitySection() {
  const [Eg, setEg] = useState(1.5);
  const [donorE0, setDonorE0] = useState(0.5);
  const [accE0, setAccE0] = useState(0.8);
  const [scenario, setScenario] = useState("ptype");

  const scenarios = {
    ptype:  { dE: 2.5, aE: 0.5, label:"p-type dopable: acceptor low, donor high" },
    ntype:  { dE: 0.4, aE: 2.8, label:"n-type dopable: donor low, acceptor high" },
    ambi:   { dE: 0.5, aE: 0.5, label:"Ambipolar: both low" },
    undope: { dE: 2.5, aE: 2.8, label:"Undopable: both high" },
  };

  const sc = scenarios[scenario];

  const W = 480, H = 280, pad = { l:55, r:25, t:25, b:35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const maxE = 4.0;
  const toX = ef => pad.l + (ef / Eg) * pw;
  const toY = e => pad.t + (1 - e / maxE) * ph;

  // Native donor (V_O-like): q = +2 slope
  const dE0 = scenario === "custom" ? donorE0 : sc.dE;
  // Native acceptor (V_cation-like): q = -2 slope
  const aE0 = scenario === "custom" ? accE0 : sc.aE;

  // Donor: ΔE = dE0 + 2*E_F → crosses zero at E_F = -dE0/2 (but we clamp)
  // Acceptor: ΔE = aE0 - 2*E_F → crosses zero at E_F = aE0/2

  // Pinning: E_F pinned where compensating defect formation energy → 0
  const efPinN = (maxE - dE0) / 2; // where donor ΔE would be low near CBM
  const efPinP = aE0 / 2; // where acceptor ΔE would be low near VBM

  // Dopability windows
  const pWindow = Math.max(0, Math.min(Eg, efPinP));
  const nWindow = Math.max(0, Eg - Math.min(Eg, efPinN));

  return (
    <Card color={T.fnv_warn} title="Dopability Analysis" formula="Can the material be doped n-type or p-type?">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>What Determines Dopability?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          A material is <strong>p-type dopable</strong> if acceptor defects have low formation energy near the VBM while
          compensating donors remain high. Similarly, <strong>n-type dopable</strong> means donors are easy to form near the CBM.
          If both native defects are low-energy, the material is <strong>ambipolar</strong>. If both are high-energy,
          intentional doping is required but native compensation is minimal.
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, marginTop:6 }}>
          The <strong>Fermi level pinning</strong> occurs where the compensating defect's formation energy drops to zero —
          spontaneous defect formation prevents the Fermi level from moving further.
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025)
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
        {Object.entries(scenarios).map(([k,v]) => (
          <button key={k} onClick={() => setScenario(k)} style={{
            padding:"4px 12px", borderRadius:6, fontSize:9, fontWeight:scenario===k?700:400, cursor:"pointer",
            background:scenario===k?T.fnv_warn+"22":T.bg, border:`1px solid ${scenario===k?T.fnv_warn:T.border}`,
            color:scenario===k?T.fnv_warn:T.muted,
          }}>{k==="ptype"?"p-type":k==="ntype"?"n-type":k==="ambi"?"Ambipolar":"Undopable"}</button>
        ))}
        <button onClick={() => setScenario("custom")} style={{
          padding:"4px 12px", borderRadius:6, fontSize:9, fontWeight:scenario==="custom"?700:400, cursor:"pointer",
          background:scenario==="custom"?T.fnv_accent+"22":T.bg, border:`1px solid ${scenario==="custom"?T.fnv_accent:T.border}`,
          color:scenario==="custom"?T.fnv_accent:T.muted,
        }}>Custom</button>
      </div>

      {scenario === "custom" && (
        <div>
          <SliderRow label="Donor Formation E₀" value={donorE0} min={0.1} max={3.5} step={0.05} onChange={setDonorE0} color={T.fnv_elec} unit=" eV" />
          <SliderRow label="Acceptor Formation E₀" value={accE0} min={0.1} max={3.5} step={0.05} onChange={setAccE0} color={T.fnv_warn} unit=" eV" />
        </div>
      )}
      <SliderRow label="Band Gap" value={Eg} min={0.5} max={3.5} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        <rect x={pad.l} y={toY(maxE)} width={pw} height={ph} fill={T.surface} />
        {[0,1,2,3,4].map(e => (
          <g key={e}>
            <line x1={pad.l} y1={toY(e)} x2={pad.l+pw} y2={toY(e)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
            <text x={pad.l-8} y={toY(e)+4} textAnchor="end" fill={T.muted} fontSize={8}>{e}</text>
          </g>
        ))}

        {/* Donor line: ΔE = dE0 + 2*E_F (positive slope = donor) */}
        {(() => {
          const pts = [];
          for (let ef = 0; ef <= Eg; ef += 0.01) {
            const e = dE0 + 2 * ef;
            if (e <= maxE) pts.push(`${toX(ef)},${toY(e)}`);
          }
          return <polyline points={pts.join(" ")} fill="none" stroke={T.fnv_elec} strokeWidth={2.5} />;
        })()}

        {/* Acceptor line: ΔE = aE0 - 2*E_F (negative slope = acceptor) */}
        {(() => {
          const pts = [];
          for (let ef = 0; ef <= Eg; ef += 0.01) {
            const e = aE0 - 2 * ef;
            if (e >= 0) pts.push(`${toX(ef)},${toY(e)}`);
          }
          return <polyline points={pts.join(" ")} fill="none" stroke={T.fnv_warn} strokeWidth={2.5} />;
        })()}

        {/* p-type window shading */}
        {pWindow > 0 && (
          <rect x={toX(0)} y={toY(maxE)} width={toX(pWindow)-toX(0)} height={ph} fill={T.fnv_warn+"11"} stroke={T.fnv_warn+"44"} strokeWidth={1} strokeDasharray="3,3" />
        )}

        {/* n-type window shading */}
        {nWindow > 0 && Eg - nWindow < Eg && (
          <rect x={toX(Eg-nWindow)} y={toY(maxE)} width={toX(Eg)-toX(Eg-nWindow)} height={ph} fill={T.fnv_elec+"11"} stroke={T.fnv_elec+"44"} strokeWidth={1} strokeDasharray="3,3" />
        )}

        {/* Zero energy line */}
        <line x1={pad.l} y1={toY(0)} x2={pad.l+pw} y2={toY(0)} stroke={T.fnv_warn+"66"} strokeWidth={1} />

        <text x={pad.l+pw/2} y={H-5} textAnchor="middle" fill={T.muted} fontSize={9}>Fermi Level E_F (eV)</text>
        <text x={12} y={pad.t+ph/2} textAnchor="middle" fill={T.muted} fontSize={9} transform={`rotate(-90,12,${pad.t+ph/2})`}>ΔE_f (eV)</text>

        {/* Legend */}
        <line x1={pad.l+10} y1={pad.t+10} x2={pad.l+25} y2={pad.t+10} stroke={T.fnv_elec} strokeWidth={2} />
        <text x={pad.l+30} y={pad.t+14} fill={T.fnv_elec} fontSize={8} fontWeight="bold">Native Donor (q=+2)</text>
        <line x1={pad.l+10} y1={pad.t+24} x2={pad.l+25} y2={pad.t+24} stroke={T.fnv_warn} strokeWidth={2} />
        <text x={pad.l+30} y={pad.t+28} fill={T.fnv_warn} fontSize={8} fontWeight="bold">Native Acceptor (q=−2)</text>
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <ResultBox label="p-type Window" value={`${pWindow.toFixed(2)} eV`} color={T.fnv_warn} sub="Near VBM" />
        <ResultBox label="n-type Window" value={`${nWindow.toFixed(2)} eV`} color={T.fnv_elec} sub="Near CBM" />
        <ResultBox label="Verdict" value={scenario==="custom"?(pWindow>0.3&&nWindow>0.3?"Ambipolar":pWindow>nWindow?"p-type":"n-type"):scenario} color={T.fnv_accent} />
      </div>
    </Card>
  );
}

function CarrierConcentrationSection() {
  const [Tval, setTval] = useState(1000);
  const [Eg, setEg] = useState(1.5);
  const [donorE0, setDonorE0] = useState(1.0);
  const [accE0, setAccE0] = useState(2.0);
  const [Nsites, setNsites] = useState(1e22);

  const kT = kB_eV * Tval;

  // Find equilibrium Fermi level by charge neutrality
  // Donor: q=+1, ΔE = donorE0 + Ef → concentration: Ns * exp(-ΔE/kT)
  // Acceptor: q=-1, ΔE = accE0 - Ef → concentration: Ns * exp(-ΔE/kT)
  // Neutrality: n + [Acc⁻] = p + [Don⁺]
  // Simplified: [Don⁺] = [Acc⁻] at equilibrium E_F

  // Scan E_F to find neutrality
  let efEq = Eg / 2;
  let minDiff = Infinity;
  for (let ef = 0; ef <= Eg; ef += 0.001) {
    const cD = Nsites * Math.exp(-(donorE0 + ef) / kT);
    const cA = Nsites * Math.exp(-(accE0 - ef) / kT);
    const ni = 1e10 * Math.exp(-Eg / (2 * kT)); // intrinsic approx
    const diff = Math.abs(Math.log10(Math.max(cD, 1)) - Math.log10(Math.max(cA, 1)));
    if (diff < minDiff) { minDiff = diff; efEq = ef; }
  }

  const cDonor = Nsites * Math.exp(-(donorE0 + efEq) / kT);
  const cAcceptor = Nsites * Math.exp(-(accE0 - efEq) / kT);

  const W = 480, H = 260, pad = { l:55, r:25, t:25, b:35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const toX = ef => pad.l + (ef / Eg) * pw;

  // Log scale for concentrations
  const logMin = 5, logMax = 23;
  const toY = logC => pad.t + (1 - (logC - logMin) / (logMax - logMin)) * ph;

  return (
    <Card color={T.fnv_accent} title="Carrier Concentrations" formula="c_eq = N_s · exp(−ΔE_f / k_BT)">
      <div style={{ background:T.surface, borderRadius:8, padding:14, border:`1px solid ${T.border}`, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink, marginBottom:8 }}>How Are Carrier Concentrations Calculated?</div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9 }}>
          The equilibrium defect concentration follows a <strong>Boltzmann distribution</strong>:
          c<sub>eq</sub> = N<sub>sites</sub> exp(−ΔE<sub>f</sub> / k<sub>B</sub>T). The equilibrium Fermi level E<sub>F,eq</sub> is
          found self-consistently from the <strong>charge neutrality condition</strong>: the total positive charge
          (donors + holes) must equal total negative charge (acceptors + electrons).
        </div>
        <div style={{ fontSize:10, color:T.ink, lineHeight:1.9, marginTop:6 }}>
          This plot shows defect concentrations as a function of E<sub>F</sub>. The intersection point gives
          the self-consistent E<sub>F,eq</sub> and the resulting carrier populations.
        </div>
        <div style={{ fontSize:10, color:T.muted, lineHeight:1.9, marginTop:6 }}>
          PRX Energy 4, 032001 (2025)
        </div>
      </div>

      <SliderRow label="Temperature" value={Tval} min={300} max={2000} step={50} onChange={setTval} color={T.fnv_warm} unit=" K" format={v=>v.toFixed(0)} />
      <SliderRow label="Band Gap" value={Eg} min={0.5} max={3.0} step={0.1} onChange={setEg} color={T.fnv_accent} unit=" eV" />
      <SliderRow label="Donor ΔE₀" value={donorE0} min={0.2} max={3.0} step={0.05} onChange={setDonorE0} color={T.fnv_elec} unit=" eV" />
      <SliderRow label="Acceptor ΔE₀" value={accE0} min={0.2} max={3.5} step={0.05} onChange={setAccE0} color={T.fnv_warn} unit=" eV" />

      <svg width={W} height={H} style={{ background:T.bg, borderRadius:8, border:`1px solid ${T.border}`, display:"block", margin:"0 auto 12px" }}>
        <rect x={pad.l} y={pad.t} width={pw} height={ph} fill={T.surface} />

        {/* Y-axis grid (log scale) */}
        {[6,9,12,15,18,21].map(lg => (
          <g key={lg}>
            <line x1={pad.l} y1={toY(lg)} x2={pad.l+pw} y2={toY(lg)} stroke={T.border} strokeWidth={0.5} strokeDasharray="3,3" />
            <text x={pad.l-8} y={toY(lg)+4} textAnchor="end" fill={T.muted} fontSize={7}>10^{lg}</text>
          </g>
        ))}

        {/* Donor concentration vs E_F */}
        {(() => {
          const pts = [];
          for (let ef = 0.01; ef < Eg; ef += 0.01) {
            const c = Nsites * Math.exp(-(donorE0 + ef) / kT);
            const logC = Math.log10(Math.max(c, 1));
            if (logC >= logMin && logC <= logMax) pts.push(`${toX(ef)},${toY(logC)}`);
          }
          return <polyline points={pts.join(" ")} fill="none" stroke={T.fnv_elec} strokeWidth={2} />;
        })()}

        {/* Acceptor concentration vs E_F */}
        {(() => {
          const pts = [];
          for (let ef = 0.01; ef < Eg; ef += 0.01) {
            const c = Nsites * Math.exp(-(accE0 - ef) / kT);
            const logC = Math.log10(Math.max(c, 1));
            if (logC >= logMin && logC <= logMax) pts.push(`${toX(ef)},${toY(logC)}`);
          }
          return <polyline points={pts.join(" ")} fill="none" stroke={T.fnv_warn} strokeWidth={2} />;
        })()}

        {/* Equilibrium E_F line */}
        <line x1={toX(efEq)} y1={pad.t} x2={toX(efEq)} y2={pad.t+ph} stroke={T.fnv_main} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={toX(efEq)} y={pad.t-5} textAnchor="middle" fill={T.fnv_main} fontSize={8} fontWeight="bold">E_F,eq</text>

        {/* Intersection marker */}
        {(() => {
          const logCD = Math.log10(Math.max(cDonor, 1));
          if (logCD >= logMin && logCD <= logMax) {
            return <circle cx={toX(efEq)} cy={toY(logCD)} r={5} fill={T.fnv_main} stroke="#fff" strokeWidth={1.5} />;
          }
          return null;
        })()}

        <text x={pad.l+pw/2} y={H-5} textAnchor="middle" fill={T.muted} fontSize={9}>Fermi Level E_F (eV)</text>
        <text x={12} y={pad.t+ph/2} textAnchor="middle" fill={T.muted} fontSize={9} transform={`rotate(-90,12,${pad.t+ph/2})`}>Concentration (cm⁻³)</text>

        <line x1={pad.l+10} y1={pad.t+10} x2={pad.l+25} y2={pad.t+10} stroke={T.fnv_elec} strokeWidth={2} />
        <text x={pad.l+30} y={pad.t+14} fill={T.fnv_elec} fontSize={8} fontWeight="bold">[Donor⁺]</text>
        <line x1={pad.l+10} y1={pad.t+24} x2={pad.l+25} y2={pad.t+24} stroke={T.fnv_warn} strokeWidth={2} />
        <text x={pad.l+30} y={pad.t+28} fill={T.fnv_warn} fontSize={8} fontWeight="bold">[Acceptor⁻]</text>
      </svg>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8 }}>
        <ResultBox label="E_F,eq" value={`${efEq.toFixed(3)} eV`} color={T.fnv_main} sub="Self-consistent" />
        <ResultBox label="[Donor⁺]" value={cDonor.toExponential(2)} color={T.fnv_elec} sub="cm⁻³" />
        <ResultBox label="[Acceptor⁻]" value={cAcceptor.toExponential(2)} color={T.fnv_warn} sub="cm⁻³" />
        <ResultBox label="k_BT" value={`${(kT*1000).toFixed(1)} meV`} color={T.fnv_warm} sub={`at ${Tval} K`} />
      </div>

      <div style={{ marginTop:10 }}>
        <CalcRow eq="c_eq = N_s · exp(−ΔE_f / k_BT)" result="Boltzmann distribution" color={T.fnv_accent} />
        <CalcRow eq="Σ q·[D_q] + p − n = 0" result="Charge neutrality" color={T.fnv_main} />
      </div>
    </Card>
  );
}

// ── DEFECT SEMICONDUCTOR MODULE ──

const DS_BLOCKS = [
  { id: "thermo",    label: "Thermodynamic Foundations", color: T.eo_core },
  { id: "formation", label: "Formation Energy",         color: T.eo_e },
  { id: "entropy",   label: "Entropy Components",       color: T.eo_valence },
  { id: "workflow",  label: "Workflow & Transitions",    color: T.eo_cond },
  { id: "diagrams", label: "Defect Diagrams",            color: T.fnv_accent },
  { id: "fnvcorr",  label: "FNV Correction",            color: T.fnv_main },
];

const DS_SECTIONS = [
  { id:"gibbs",     block:"thermo",    label:"Gibbs Free Energy",       color:T.eo_core,    Component:GibbsBalanceSection,      nextReason:"The Gibbs balance shows that defects exist at equilibrium. The next step derives the exact equilibrium concentration formula." },
  { id:"ceq",       block:"thermo",    label:"Equilibrium Concentration", color:T.eo_core,  Component:EqConcentrationSection,   nextReason:"The equilibrium concentration depends on the prefactor Z_d/Z_b. Configurational entropy explains why there are so many ways to arrange defects." },
  { id:"config",    block:"thermo",    label:"Configurational Entropy", color:T.eo_core,    Component:ConfigEntropySection,     nextReason:"Configurational entropy counts arrangements. Now we need the formation energy — the energy cost to create each defect." },
  { id:"formE",     block:"formation", label:"Formation Energy",        color:T.eo_e,       Component:DefectFormationSection,   nextReason:"The formation energy is the central quantity. Charge states make it depend on the Fermi level, creating transition levels." },
  { id:"charge",    block:"formation", label:"Charge Transitions",      color:T.eo_e,       Component:ChargeTransitionSection,  nextReason:"Formation energy gives the 0 K picture. At finite temperature, entropy corrections become significant." },
  { id:"elec",      block:"entropy",   label:"Electronic Entropy",      color:T.eo_valence, Component:ElectronicEntropySection, nextReason:"Electronic entropy from energy level degeneracy. Unpaired electrons add spin entropy." },
  { id:"spin",      block:"entropy",   label:"Spin Entropy",            color:T.eo_valence, Component:SpinEntropySection,       nextReason:"Spin entropy from unpaired electrons. Vibrational entropy from modified phonon modes is usually the largest contribution." },
  { id:"vib",       block:"entropy",   label:"Vibrational Entropy",     color:T.eo_valence, Component:VibrationalEntropySection, nextReason:"Vibrational entropy dominates at high T. Orientational entropy from symmetry breaking adds more degeneracy." },
  { id:"orient",    block:"entropy",   label:"Orientational Entropy",   color:T.eo_valence, Component:OrientationalEntropySection, nextReason:"All four entropy contributions are now covered. The summary compares their magnitudes." },
  { id:"summary",   block:"entropy",   label:"Entropy Summary",         color:T.eo_valence, Component:EntropySummarySection,    nextReason:"With all contributions understood, the workflow brings them together into a systematic calculation procedure." },
  { id:"workflow",  block:"workflow",  label:"Workflow",                 color:T.eo_cond,    Component:DefectWorkflowSection, nextReason:"The workflow establishes the calculation procedure. Now learn to read and interpret the resulting defect diagrams — the primary output of defect calculations." },
  { id:"defdiag",   block:"diagrams", label:"Defect Diagrams",          color:T.fnv_accent, Component:DefectDiagramSection, nextReason:"You can now read a defect diagram. The kink points where charge-state lines cross define charge-transition levels — the key quantity for classifying defects." },
  { id:"ctl",       block:"diagrams", label:"Charge Transition Levels", color:T.fnv_elec,   Component:ChargTransitionLevelSection, nextReason:"CTLs are identified. Whether a CTL is near a band edge or deep in the gap determines if the defect is shallow (dopant) or deep (recombination center)." },
  { id:"shallowdeep", block:"diagrams", label:"Shallow vs Deep",        color:T.fnv_warm,   Component:ShallowDeepSection, nextReason:"Shallow vs deep classification depends on the host. Chemical potentials (growth conditions) shift which defects dominate — explored next." },
  { id:"chempoteff", block:"diagrams", label:"Chemical Potentials",     color:T.fnv_align,  Component:ChemPotEffectSection, nextReason:"Chemical potentials determine which defects form. Combining native donors and acceptors reveals whether the material can be doped p- or n-type." },
  { id:"dopability", block:"diagrams", label:"Dopability",              color:T.fnv_warn,   Component:DopabilitySection, nextReason:"Dopability windows are established. The final step connects defect formation energies to actual carrier concentrations via the charge neutrality equation." },
  { id:"carriers",  block:"diagrams", label:"Carrier Concentrations",   color:T.fnv_accent, Component:CarrierConcentrationSection, nextReason:"Carrier concentrations complete the defect picture. The FNV correction ensures the underlying DFT formation energies are accurate for charged defects." },
  { id:"fnvcorr",   block:"fnvcorr",  label:"FNV Correction",           color:T.fnv_main,   Component:FNVCorrectionModule },
];

function DefectSemiModule() {
  const [active, setActive] = useState("gibbs");
  const [activeBlock, setActiveBlock] = useState("thermo");
  const sec = DS_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const blockSections = DS_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink, display: "flex", flexDirection: "column",
    }}>
      <div style={{ display:"flex", padding:"8px 24px", gap:6, borderBottom:`1px solid ${T.border}`, background:T.panel, overflowX:"auto" }}>
        {DS_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); const first = DS_SECTIONS.find(s => s.block === b.id); if (first) setActive(first.id); }} style={{
            padding:"6px 14px", borderRadius:8, border:`1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg, color: activeBlock === b.id ? b.color : T.muted,
            cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight: activeBlock === b.id ? 700 : 400, letterSpacing:0.5, whiteSpace:"nowrap",
          }}>{b.label}</button>
        ))}
      </div>
      <div style={{ display:"flex", padding:"6px 24px", gap:6, borderBottom:`1px solid ${T.border}`, background:T.panel, overflowX:"auto", flexWrap:"wrap" }}>
        {blockSections.map((s) => {
          const globalIdx = DS_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding:"6px 12px", borderRadius:8, border:`1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg, color: active === s.id ? s.color : T.muted,
              cursor:"pointer", fontSize:11, fontFamily:"inherit", fontWeight: active === s.id ? 700 : 400,
              display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap",
            }}>
              <span style={{ fontSize:9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex:1, padding:"20px 24px", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:800, color:sec.color, letterSpacing:0.5 }}>{sec.label}</div>
        </div>
        <Component />
        {sec.nextReason && (
          <div style={{ marginTop:28, padding:"14px 18px", borderRadius:10, background:sec.color+"0a", border:`1.5px solid ${sec.color}22`, borderLeft:`4px solid ${sec.color}` }}>
            <div style={{ fontSize:12, color:T.ink, lineHeight:1.8 }}>
              {sec.nextReason}
              {(() => { const idx = DS_SECTIONS.findIndex(s => s.id === active); const next = DS_SECTIONS[idx+1]; return next ? <span> Up next: <span style={{ fontWeight:700, color:next.color }}>{next.label}</span>.</span> : null; })()}
            </div>
          </div>
        )}
        <ChapterReferences chapterId="defectsemi" />
      </div>
      <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", background:T.panel }}>
        <button onClick={() => { const i = DS_SECTIONS.findIndex(s => s.id === active); if (i > 0) { setActive(DS_SECTIONS[i-1].id); setActiveBlock(DS_SECTIONS[i-1].block); } }} disabled={active === DS_SECTIONS[0].id} style={{
          padding:"8px 20px", borderRadius:8, fontSize:13, background: active === DS_SECTIONS[0].id ? T.surface : sec.color+"22",
          border:`1px solid ${active === DS_SECTIONS[0].id ? T.border : sec.color}`, color: active === DS_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === DS_SECTIONS[0].id ? "default" : "pointer", fontFamily:"inherit", fontWeight:600,
        }}>{"\u2190"} Previous</button>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"center" }}>
          {DS_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width:7, height:7, borderRadius:4, background: active === s.id ? s.color : s.block === activeBlock ? s.color+"44" : T.dim,
              cursor:"pointer", transition:"all 0.2s",
            }}/>
          ))}
        </div>
        <button onClick={() => { const i = DS_SECTIONS.findIndex(s => s.id === active); if (i < DS_SECTIONS.length-1) { setActive(DS_SECTIONS[i+1].id); setActiveBlock(DS_SECTIONS[i+1].block); } }} disabled={active === DS_SECTIONS[DS_SECTIONS.length-1].id} style={{
          padding:"8px 20px", borderRadius:8, fontSize:13, background: active === DS_SECTIONS[DS_SECTIONS.length-1].id ? T.surface : sec.color+"22",
          border:`1px solid ${active === DS_SECTIONS[DS_SECTIONS.length-1].id ? T.border : sec.color}`, color: active === DS_SECTIONS[DS_SECTIONS.length-1].id ? T.muted : sec.color,
          cursor: active === DS_SECTIONS[DS_SECTIONS.length-1].id ? "default" : "pointer", fontFamily:"inherit", fontWeight:600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE TABS
// ═══════════════════════════════════════════════════════════════════════════
const MODULE_TABS = [
  { id: "electrons",    chapter: 1,  label: "Atoms World",               color: T.eo_e,       desc: "From quantum foundations to crystal properties — the building blocks of all materials", topics: 21 },
  { id: "dft",          chapter: 2,  label: "DFT Basics",                color: T.eo_e,       desc: "Density functional theory from first principles", topics: 14 },
  { id: "convexhull",   chapter: 3,  label: "Computational Phase Diagram", color: T.eo_e,       desc: "Phase stability, convex hull, and chemical potential diagrams", topics: 12 },
  { id: "md",           chapter: 4,  label: "Molecular Dynamics",        color: T.eo_e,       desc: "Classical and ab initio molecular dynamics", topics: 10 },
  { id: "defectsemi",   chapter: 5,  label: "Defects in Semiconductors", color: T.eo_e,       desc: "Point defect thermodynamics — formation energy, entropy, equilibrium concentrations, defect diagrams, and FNV correction", topics: 18 },
  { id: "cdtesolar",    chapter: 6,  label: "CdTe Solar Cell",           color: T.eo_e,       desc: "CdTe device physics and defect engineering", topics: 15 },
  { id: "forcefield",   chapter: 7,  label: "Force Fields",              color: T.eo_e,       desc: "Classical and machine-learned interatomic potentials — from harmonic bonds to ReaxFF and EAM", topics: 12 },
  { id: "pipeline",     chapter: 8,  label: "MLFF Pipeline",             color: T.eo_e,       desc: "DefectNet force field: graph neural network step by step", topics: 14 },
  { id: "llmdatamining", chapter: 9, label: "LLM Data Mining",           color: T.eo_e,       desc: "LangGraph architecture, solid-state synthesis text-mining, and MongoDB data management", topics: 3 },
  // { id: "chalcomovie",  chapter: 10, label: "Chalcogenide Movie",        color: T.eo_e,       desc: "Chalcogenide materials animation" },
];

// ═══════════════════════════════════════════════════════════════════════════
// LLM DATA MINING — Combined module with 3 sub-movies
// Same dark P palette as the individual movies (#0c0f1a bg, scene-chip nav)
// ═══════════════════════════════════════════════════════════════════════════
function LLMDataMiningModule() {
  const [activeMovie, setActiveMovie] = useState("langgraph");
  const movies = [
    { id: "langgraph",  label: "LangGraph Architecture", color: "#38bdf8" },
    { id: "synthesis",  label: "Synthesis Pipeline",      color: "#34d399" },
    { id: "mongodb",    label: "MongoDB Management",      color: "#818cf8" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: T.ink,
    }}>
      {/* Movie selector — light theme tabs matching the app shell */}
      <div style={{ display: "flex", gap: 6, padding: "14px 24px", flexWrap: "wrap", background: T.panel, borderBottom: `1px solid ${T.border}` }}>
        {movies.map((m, i) => (
          <button key={m.id} onClick={() => setActiveMovie(m.id)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: activeMovie === m.id ? m.color + "22" : T.bg,
            border: `1px solid ${activeMovie === m.id ? m.color : T.border}`,
            color: activeMovie === m.id ? m.color : T.muted,
            fontWeight: activeMovie === m.id ? 700 : 400, fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {i + 1}. {m.label}
          </button>
        ))}
      </div>

      {/* Movie content — dark player inside white page */}
      {activeMovie === "langgraph" && <LLMMovieModule />}
      {activeMovie === "synthesis" && <SSSynthesisMovieModule />}
      {activeMovie === "mongodb" && <MongoDBMovieModule />}
      <div style={{ padding: "0 24px 24px" }}><ChapterReferences chapterId="llmdatamining" /></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED SHELL: MaterialsLab
// ═══════════════════════════════════════════════════════════════════════════
// Dark theme overrides for the main shell
const T_DARK = {
  bg:      "#0f1117",
  panel:   "#1a1d2e",
  surface: "#22263a",
  border:  "#2e3348",
  ink:     "#e4e6ef",
  muted:   "#9ca3b4",
};

export default function MaterialsLab({ initialModule = null, blogMode = false }) {
  const [module, setModule] = useState(initialModule);
  const [dark, setDark] = useState(false);

  const shell = dark ? T_DARK : T; // shell colors for header/bg

  // Landing page — About Me as homepage
  if (module === null) {
    return (
      <div style={{
        minHeight: "100vh",
        background: dark ? T_DARK.bg : T.bg,
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        <AboutMeModule onNavigate={setModule} dark={dark} onToggleDark={() => setDark(d => !d)} />
      </div>
    );
  }

  // Active module view
  const currentModule = MODULE_TABS.find(m => m.id === module) || { id: module, chapter: "", label: module, color: T.eo_e };

  return (
    <div style={{
      minHeight: "100vh",
      background: shell.bg,
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: shell.ink,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Compact header with back button */}
      <div style={{
        borderBottom: `2px solid ${shell.border}`,
        padding: "8px 28px",
        background: shell.panel,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <button onClick={() => {
          if (blogMode) {
            window.location.href = "/blog";
          } else {
            setModule(null);
          }
        }} style={{
          padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
          background: shell.surface, border: `1.5px solid ${shell.border}`,
          color: shell.ink, fontWeight: 700, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {"\u2190"} {blogMode ? "Blog" : "Home"}
        </button>

        <div style={{
          fontSize: 10, letterSpacing: 3, color: currentModule.color, textTransform: "uppercase", fontWeight: 700,
        }}>
          Ch. {currentModule.chapter}
        </div>

        <div style={{ fontSize: 15, fontWeight: 800, color: shell.ink }}>
          {currentModule.label}
        </div>

        <div style={{ flex: 1 }} />

        {/* Dark/light toggle */}
        <button onClick={() => setDark(d => !d)} style={{
          padding: "5px 10px", borderRadius: 8, fontSize: 13, cursor: "pointer",
          background: shell.surface, border: `1px solid ${shell.border}`,
          color: shell.muted, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
        }}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? "\u2600\uFE0F" : "\u{1F319}"}
          <span style={{ fontSize: 10, fontWeight: 600 }}>{dark ? "Light" : "Dark"}</span>
        </button>

        {/* Quick nav pills */}
        <div style={{ display: "flex", gap: 4 }}>
          {MODULE_TABS.filter(m => m.id !== module).slice(0, 7).map(m => (
            <button key={m.id} onClick={() => setModule(m.id)} style={{
              padding: "4px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
              background: "transparent", border: `1px solid ${shell.border}`,
              color: shell.muted, fontFamily: "inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.eo_e; e.currentTarget.style.color = T.eo_e; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = shell.border; e.currentTarget.style.color = shell.muted; }}
            >{m.chapter}. {m.label}</button>
          ))}
        </div>
      </div>

      {/* Author bar */}
      <div style={{
        padding: "8px 28px",
        background: shell.panel,
        borderBottom: `1px solid ${shell.border}`,
        textAlign: "left",
        fontSize: 12,
        color: shell.muted,
      }}>
        Developed by <span style={{ fontWeight: 700, color: shell.ink }}>Md Habibur Rahman</span> {"\u00B7"} School of Materials Engineering, Purdue University {"\u00B7"} West Lafayette, IN, USA {"\u00B7"} <a href="mailto:rahma103@purdue.edu" style={{ color: currentModule?.color || T.eo_e, textDecoration: "none" }}>rahma103@purdue.edu</a>
      </div>

      {/* Module content */}
      {module === "electrons" && <ElectronsModule />}
      {module === "llmdatamining" && <LLMDataMiningModule />}
      {module === "pipeline" && <ErrorBoundary><PipelineModule /></ErrorBoundary>}
      {module === "cdtesolar" && <CdTeSolarCellModule />}
      {module === "forcefield" && <ErrorBoundary><ForceFieldModule /></ErrorBoundary>}
      {module === "convexhull" && <ErrorBoundary><ConvexHullModule /></ErrorBoundary>}
      {module === "dft" && <ErrorBoundary><DFTBasicsModule /></ErrorBoundary>}
      {module === "md" && <ErrorBoundary><MolecularDynamicsModule /></ErrorBoundary>}
      {module === "mc" && <ErrorBoundary><MonteCarloModule /></ErrorBoundary>}
      {/* {module === "chalcomovie" && <ChalcoMovieModule />} */}
      {module === "defectsemi" && <ErrorBoundary><DefectSemiModule /></ErrorBoundary>}
    </div>
  );
}
