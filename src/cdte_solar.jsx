import { useState, useEffect, useRef, useMemo } from "react";
import DefectMovieModule from "./defect_movie.jsx";
import SolarCellDegradationMovie from "./solar_degradation_movie.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED THEME — Light gray, readable on any screen (copy from materials_lab)
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

// ── SHARED HELPERS ───────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════

// ── TINY HELPERS ───────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

function Tag({ color, children }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      background: color + "22",
      border: `1px solid ${color}55`,
      color,
      letterSpacing: 1,
    }}>{children}</span>
  );
}

function SectionTitle({ color, icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: color + "22",
        border: `1px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>{icon}</div>
      <div style={{
        fontSize: 15, fontWeight: 800, color,
        letterSpacing: 1, textTransform: "uppercase",
      }}>{children}</div>
    </div>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────
const infoBox = (color) => ({
  background: color + "08", border: `1px solid ${color}22`,
  borderRadius: 8, padding: "10px 14px", marginBottom: 12,
});
const sectionPanel = {
  background: T.surface, borderRadius: 10, padding: 14,
  border: `1px solid ${T.border}`, marginBottom: 12,
};
const labelUpper = {
  fontSize: 11, color: T.muted, marginBottom: 10,
  letterSpacing: 2, textTransform: "uppercase",
};
const monoStep = {
  fontFamily: "monospace", fontSize: 11, lineHeight: 2.0,
  color: T.ink, background: T.surface, borderRadius: 6, padding: "8px 10px",
};

// ── SECTION 1: ATOM STRUCTURE — Cd & Te ──────────────────────────────────
function AtomSection() {
  const [selAtom, setSelAtom] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 60);
    return () => clearInterval(id);
  }, []);

  const atoms = [
    {
      sym: "Cd", Z: 48, color: T.eo_valence,
      shells: [2, 8, 18, 18, 2],
      labels: ["1s²", "2s²2p⁶", "3s²3p⁶3d¹⁰", "4s²4p⁶4d¹⁰", "5s²"],
      valence: 2, eneg: 1.69,
      config: "[Kr] 4d¹⁰ 5s²",
      desc: "Cadmium has 2 valence electrons in the outer 5s shell. These are loosely held (low electronegativity 1.69) and will be donated to form bonds with Te. The filled 4d shell acts as core electrons.",
      orbitalNote: "5s orbital: spherical. Both electrons sit here. During sp³ hybridization, one electron promotes to 5p to create 4 equivalent hybrid orbitals.",
    },
    {
      sym: "Te", Z: 52, color: T.eo_hole,
      shells: [2, 8, 18, 18, 6],
      labels: ["1s²", "2s²2p⁶", "3s²3p⁶3d¹⁰", "4s²4p⁶4d¹⁰", "5s²5p⁴"],
      valence: 6, eneg: 2.10,
      config: "[Kr] 4d¹⁰ 5s² 5p⁴",
      desc: "Tellurium has 6 valence electrons: 2 in 5s and 4 in 5p. The 5p shell needs 2 more electrons to be full — these come from Cd. Higher electronegativity (2.10) means Te pulls electron density toward itself.",
      orbitalNote: "5s: spherical (2e). 5p: three dumbbell-shaped orbitals (4e total, 2 orbitals full + 1 half). The two empty slots accept Cd electrons.",
    },
  ];

  const a = atoms[selAtom];
  const cx = 160, cy = 160;
  const radii = [28, 48, 72, 100, 132];

  return (
    <div>
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
      {/* Atom selector */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 80 }}>
        {atoms.map((at, i) => (
          <button key={i} onClick={() => setSelAtom(i)} style={{
            padding: "10px 0",
            borderRadius: 10,
            border: `2px solid ${i === selAtom ? at.color : T.border}`,
            background: i === selAtom ? at.color + "22" : T.surface,
            color: at.color,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 800,
          }}>{at.sym}<br /><span style={{ fontSize: 10, color: T.muted }}>Z={at.Z}</span></button>
        ))}
      </div>

      {/* Bohr model SVG */}
      <svg viewBox="0 0 320 320" style={{ flex: "0 0 320px", width: "100%", maxWidth: 320 }}>
        <rect width={320} height={320} fill={T.bg} rx={12} />
        {a.shells.map((_, i) => (
          <circle key={i} cx={cx} cy={cy} r={radii[i]}
            fill="none" stroke={i === a.shells.length - 1 ? a.color + "55" : T.dim}
            strokeWidth={i === a.shells.length - 1 ? 1.5 : 1}
            strokeDasharray={i === a.shells.length - 1 ? "4 3" : "2 4"} />
        ))}
        <circle cx={cx} cy={cy} r={18} fill={a.color + "33"} stroke={a.color} strokeWidth={2} />
        <text x={cx} y={cy - 3} textAnchor="middle" fill={a.color} fontSize={12} fontWeight="bold">{a.sym}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill={T.muted} fontSize={9}>Z={a.Z}</text>
        {a.shells.map((count, si) => {
          const r = radii[si];
          const isValence = si === a.shells.length - 1;
          const speed = isValence ? 0.008 : 0.003 * (si + 1);
          return Array.from({ length: Math.min(count, 8) }, (_, ei) => {
            const baseAngle = (ei / Math.min(count, 8)) * Math.PI * 2;
            const angle = baseAngle + frame * speed * (si % 2 === 0 ? 1 : -1);
            const ex = cx + r * Math.cos(angle);
            const ey = cy + r * Math.sin(angle);
            return (
              <g key={`${si}-${ei}`}>
                {isValence && <circle cx={ex} cy={ey} r={8} fill={a.color + "15"} />}
                <circle cx={ex} cy={ey} r={isValence ? 5 : 3}
                  fill={isValence ? a.color : T.eo_core}
                  opacity={isValence ? 1 : 0.6} />
              </g>
            );
          });
        })}
        {a.shells.map((_, i) => (
          <text key={i} x={cx + radii[i] + 4} y={cy - 4}
            fill={i === a.shells.length - 1 ? a.color : T.muted}
            fontSize={8} fontWeight={i === a.shells.length - 1 ? 700 : 400}>
            {a.labels[i]}
          </text>
        ))}
      </svg>

      {/* Info panel */}
      <div style={{ flex: "1 1 280px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: a.color, marginBottom: 4 }}>
          {a.sym} — {a.Z} electrons
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: "monospace" }}>{a.config}</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <Tag color={T.eo_core}>Core: {a.shells.slice(0, -1).reduce((s, v) => s + v, 0)}e</Tag>
          <Tag color={a.color}>Valence: {a.valence}e</Tag>
          <Tag color={T.eo_photon}>EN: {a.eneg}</Tag>
        </div>
        <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginBottom: 10 }}>{a.desc}</p>

        {/* Orbital note */}
        <div style={infoBox(a.color)}>
          <div style={{ fontSize: 11, color: a.color, fontWeight: 700, marginBottom: 4 }}>Orbital character</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>{a.orbitalNote}</div>
        </div>

        {/* Shell breakdown */}
        <div style={{ background: T.bg, borderRadius: 8, padding: 10, border: `1px solid ${T.border}`, marginBottom: 10 }}>
          <div style={labelUpper}>Shell breakdown</div>
          {a.shells.map((count, i) => {
            const isV = i === a.shells.length - 1;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "4px 8px", borderRadius: 6, marginBottom: 2,
                background: isV ? a.color + "15" : "transparent",
                border: isV ? `1px solid ${a.color}33` : "1px solid transparent",
              }}>
                <div style={{ fontSize: 10, color: isV ? a.color : T.muted, minWidth: 85, fontFamily: "monospace" }}>{a.labels[i]}</div>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: Math.min(count, 10) }, (_, j) => (
                    <div key={j} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: isV ? a.color : T.eo_core,
                      opacity: isV ? 1 : 0.5,
                    }} />
                  ))}
                  {count > 10 && <span style={{ fontSize: 9, color: T.muted }}>+{count - 10}</span>}
                </div>
                <div style={{ fontSize: 10, color: isV ? a.color : T.muted, fontWeight: isV ? 700 : 400 }}>
                  {count}e {isV ? "VALENCE" : "core"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Electronegativity comparison */}
        <div style={{ background: T.bg, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
          <div style={labelUpper}>Electronegativity (Pauling scale)</div>
          {atoms.map((at, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ width: 24, fontSize: 11, color: at.color, fontWeight: 700 }}>{at.sym}</span>
              <div style={{ flex: 1, height: 12, background: T.surface, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${at.eneg / 3 * 100}%`, height: "100%", background: at.color + "66", borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 11, color: at.color, fontFamily: "monospace", width: 32 }}>{at.eneg}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: T.muted, marginTop: 6, lineHeight: 1.6 }}>
            Te &gt; Cd: Te pulls electron density toward itself in CdTe bonds, giving partial ionic character (ΔEN = 0.41).
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 2: CRYSTAL FORMATION & HYBRIDIZATION ─────────────────────────
function CrystalSection() {
  const [stage, setStage] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const stages = [
    { label: "Isolated atoms", desc: "Cd and Te atoms exist separately. Cd has 2 valence electrons in 5s. Te has 6 valence electrons in 5s²5p⁴. No overlap." },
    { label: "Atoms approach", desc: "As Cd and Te come close, their valence electron clouds begin to overlap. The 5s orbital of Cd 'sees' the 5p orbitals of Te." },
    { label: "sp³ hybridization", desc: "Both Cd and Te hybridize their s and p orbitals into 4 equivalent sp³ hybrid orbitals, each pointing toward a corner of a tetrahedron (109.5° apart). Cd promotes one 5s electron to 5p to form 4 half-filled sp³ orbitals." },
    { label: "Bond formation", desc: "Each Cd sp³ orbital overlaps with a Te sp³ orbital, sharing 2 electrons per bond. Cd forms 4 bonds with 4 Te neighbors. Te forms 4 bonds with 4 Cd neighbors. This is the zincblende structure." },
    { label: "Unit cell", desc: "The CdTe zincblende unit cell has 8 atoms (4 Cd + 4 Te). Two interpenetrating FCC sublattices offset by (a/4, a/4, a/4). Lattice constant a = 6.48 Å. Space group F-43m (#216)." },
    { label: "64-atom supercell", desc: "For defect calculations, we replicate the 8-atom cell 2×2×2 = 64 atoms (32 Cd + 32 Te). This gives 256 valence electrons (32×2 + 32×6). Large enough to isolate a single point defect from its periodic images." },
  ];

  // Atom positions depend on stage
  const spread = stage < 2 ? 1 : stage < 4 ? 0.6 : 0.45;
  const atomPos = [
    [160 - 70 * spread, 120], [160 + 70 * spread, 120],
    [160 - 70 * spread, 240], [160 + 70 * spread, 240],
  ];
  const bonds = [[0,1],[0,2],[1,3],[2,3],[0,3],[1,2]];

  return (
    <div>
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />

          {/* Bonds in stage 3+ */}
          {stage >= 3 && bonds.slice(0, 4).map(([a, b], i) => (
            <line key={i} x1={atomPos[a][0]} y1={atomPos[a][1]}
              x2={atomPos[b][0]} y2={atomPos[b][1]}
              stroke={T.eo_valence} strokeWidth={2} strokeDasharray="4 3" opacity={0.5} />
          ))}

          {/* sp3 lobes in stage 2 */}
          {stage === 2 && atomPos.map(([ax, ay], i) => {
            const angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
            return angles.map((ang, li) => {
              const lx = ax + 30 * Math.cos(ang + frame * 0.01);
              const ly = ay + 30 * Math.sin(ang + frame * 0.01);
              return <ellipse key={`${i}-${li}`} cx={lx} cy={ly} rx={12} ry={8}
                transform={`rotate(${ang * 180/Math.PI}, ${lx}, ${ly})`}
                fill={(i % 2 === 0 ? T.eo_valence : T.eo_hole) + "22"}
                stroke={(i % 2 === 0 ? T.eo_valence : T.eo_hole)} strokeWidth={1} opacity={0.6} />;
            });
          })}

          {/* Electron sea in stage 4+ */}
          {stage >= 4 && Array.from({ length: 16 }, (_, i) => {
            const t = (frame * 0.012 + i * 0.4) % 1;
            const path = [[atomPos[0][0], atomPos[0][1]], [atomPos[1][0], atomPos[1][1]],
              [atomPos[3][0], atomPos[3][1]], [atomPos[2][0], atomPos[2][1]], [atomPos[0][0], atomPos[0][1]]];
            const seg = Math.floor(t * 4);
            const segT = (t * 4) - seg;
            const from = path[Math.min(seg, 3)];
            const to = path[Math.min(seg + 1, 4)];
            const ex = lerp(from[0], to[0], segT) + Math.sin(frame * 0.08 + i) * 15;
            const ey = lerp(from[1], to[1], segT) + Math.cos(frame * 0.06 + i * 1.2) * 15;
            return <circle key={i} cx={ex} cy={ey} r={3.5} fill={T.eo_e} opacity={0.7} />;
          })}

          {/* 64-atom grid in stage 5 */}
          {stage === 5 && Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isCd = (row + col) % 2 === 0;
            return <circle key={i} cx={40 + col * 34} cy={40 + row * 34} r={isCd ? 5 : 6}
              fill={isCd ? T.eo_valence : T.eo_hole} opacity={0.7} />;
          })}

          {/* Atoms (stages 0-4) */}
          {stage < 5 && atomPos.map(([ax, ay], i) => {
            const isCd = i % 2 === 0;
            const color = isCd ? T.eo_valence : T.eo_hole;
            return (
              <g key={i}>
                <circle cx={ax} cy={ay} r={24} fill={color + "22"} stroke={color} strokeWidth={2} />
                <text x={ax} y={ay - 2} textAnchor="middle" fill={color} fontSize={12} fontWeight="bold">
                  {isCd ? "Cd" : "Te"}
                </text>
                <text x={ax} y={ay + 10} textAnchor="middle" fill={T.muted} fontSize={9}>
                  {isCd ? "2e" : "6e"}
                </text>
                {stage < 2 && Array.from({ length: isCd ? 2 : 6 }, (_, ei) => {
                  const angle = (ei / (isCd ? 2 : 6)) * Math.PI * 2 + frame * 0.03;
                  return <circle key={ei} cx={ax + 36 * Math.cos(angle)} cy={ay + 36 * Math.sin(angle)}
                    r={4} fill={T.eo_e} />;
                })}
              </g>
            );
          })}

          <text x={160} y={18} textAnchor="middle" fill={T.muted} fontSize={11}>
            {stages[stage].label}
          </text>
          {stage === 5 && <text x={160} y={310} textAnchor="middle" fill={T.eo_e} fontSize={10} fontWeight="bold">
            2x2x2 supercell: 32 Cd + 32 Te = 64 atoms
          </text>}
        </svg>

        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {stages.map((s, i) => (
            <button key={i} onClick={() => setStage(i)} style={{
              flex: 1, padding: "5px 2px", fontSize: 9, borderRadius: 6,
              background: i === stage ? T.eo_valence + "22" : T.surface,
              border: `1px solid ${i === stage ? T.eo_valence : T.border}`,
              color: i === stage ? T.eo_valence : T.muted, cursor: "pointer",
            }}>{i + 1}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: "1 1 300px" }}>
        <div style={infoBox(T.eo_valence)}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>
            Stage {stage + 1}: {stages[stage].label}
          </div>
          <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, margin: 0 }}>{stages[stage].desc}</p>
        </div>

        {/* sp3 hybridization detail (always visible) */}
        <div style={sectionPanel}>
          <div style={labelUpper}>sp³ Hybridization in CdTe</div>
          <div style={monoStep}>
            <div><span style={{ color: T.eo_valence, fontWeight: 700 }}>Cd:</span> 5s² → promote → 5s¹5p¹ → hybridize → 4 × sp³ (half-filled)</div>
            <div><span style={{ color: T.eo_hole, fontWeight: 700 }}>Te:</span> 5s²5p⁴ → hybridize → 4 × sp³ (2 bonding + 2 lone pairs)</div>
            <div style={{ color: T.muted }}>Each sp³ = 25% s-character + 75% p-character</div>
            <div style={{ color: T.muted }}>Tetrahedral geometry: 109.5° between bonds</div>
            <div><span style={{ color: T.eo_e, fontWeight: 700 }}>Bond:</span> Cd(sp³) + Te(sp³) → σ bond, 2 electrons shared</div>
          </div>
        </div>

        {/* Electron counting */}
        <div style={sectionPanel}>
          <div style={labelUpper}>CdTe 64-atom supercell electrons</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <div style={{ padding: "5px 10px", background: T.eo_valence + "22", border: `1px solid ${T.eo_valence}44`, borderRadius: 6, fontSize: 12, color: T.eo_valence, fontFamily: "monospace" }}>
              32 Cd × 2e = 64e
            </div>
            <span style={{ color: T.muted }}>+</span>
            <div style={{ padding: "5px 10px", background: T.eo_hole + "22", border: `1px solid ${T.eo_hole}44`, borderRadius: 6, fontSize: 12, color: T.eo_hole, fontFamily: "monospace" }}>
              32 Te × 6e = 192e
            </div>
            <span style={{ color: T.muted }}>=</span>
            <div style={{ padding: "5px 10px", background: T.eo_e + "22", border: `1px solid ${T.eo_e}44`, borderRadius: 6, fontSize: 12, color: T.eo_e, fontFamily: "monospace", fontWeight: 700 }}>
              NELECT = 256
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
            128 bonds × 2e/bond = 256 bonding electrons. All 256 fill the valence band completely.
            Zero electrons in the conduction band at 0K. Every electron came from an atom — none from outside.
          </div>
        </div>

        {/* Zincblende structure info */}
        <div style={sectionPanel}>
          <div style={labelUpper}>Zincblende Structure</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 12px", fontSize: 11 }}>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Space group</span><span style={{ color: T.ink }}>F-43m (#216)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Lattice const.</span><span style={{ color: T.ink }}>a = 6.48 Å</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bond length</span><span style={{ color: T.ink }}>d(Cd-Te) = 2.81 Å = a√3/4</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Coordination</span><span style={{ color: T.ink }}>4 (tetrahedral for both Cd and Te)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Conventional cell</span><span style={{ color: T.ink }}>8 atoms (4 Cd + 4 Te)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>2×2×2 supercell</span><span style={{ color: T.ink }}>64 atoms (32 Cd + 32 Te)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Structure</span><span style={{ color: T.ink }}>Two interpenetrating FCC sublattices</span>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 3: 64-ATOM SUPERCELL ─────────────────────────────────────────
function SupercellSection() {
  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 340px" }}>
        {/* 64-atom supercell visualization */}
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />
          {/* Draw 64 atoms in an 8x8 grid with bonds */}
          {Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isCd = (row + col) % 2 === 0;
            const x = 28 + col * 36;
            const y = 28 + row * 36;
            return (
              <g key={i}>
                {col < 7 && <line x1={x + 5} y1={y} x2={x + 31} y2={y} stroke={T.border} strokeWidth={0.5} opacity={0.3} />}
                {row < 7 && <line x1={x} y1={y + 5} x2={x} y2={y + 31} stroke={T.border} strokeWidth={0.5} opacity={0.3} />}
                <circle cx={x} cy={y} r={isCd ? 6 : 7}
                  fill={isCd ? T.eo_valence + "cc" : T.eo_hole + "cc"}
                  stroke={isCd ? T.eo_valence : T.eo_hole} strokeWidth={1} />
                {i < 8 && row === 0 && <text x={x} y={y - 10} textAnchor="middle" fill={T.muted} fontSize={7}>{col}</text>}
              </g>
            );
          })}
          <text x={160} y={312} textAnchor="middle" fill={T.eo_e} fontSize={10} fontWeight="bold">
            2×2×2 CdTe supercell — 64 atoms
          </text>
          {/* Legend */}
          <circle cx={20} cy={310} r={5} fill={T.eo_valence} />
          <text x={28} y={313} fill={T.eo_valence} fontSize={8}>Cd</text>
          <circle cx={55} cy={310} r={5} fill={T.eo_hole} />
          <text x={63} y={313} fill={T.eo_hole} fontSize={8}>Te</text>
        </svg>
      </div>

      <div style={{ flex: "1 1 300px" }}>
        <div style={infoBox(T.eo_e)}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Why 64 atoms?</div>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
            A single unit cell (8 atoms) is too small for defect calculations — the defect would interact with its own periodic images.
            A 2×2×2 supercell gives enough separation (~13 Å between defect images) while keeping the computation feasible.
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Supercell construction</div>
          <div style={monoStep}>
            <div><span style={{ color: T.eo_valence, fontWeight: 700 }}>Primitive cell:</span> 2 atoms (1 Cd + 1 Te), FCC Bravais</div>
            <div><span style={{ color: T.eo_cond, fontWeight: 700 }}>Conventional cell:</span> 8 atoms (4 Cd + 4 Te), cubic a=6.48 Å</div>
            <div><span style={{ color: T.eo_e, fontWeight: 700 }}>2×2×2 supercell:</span> 64 atoms (32 Cd + 32 Te)</div>
            <div><span style={{ color: T.muted }}>Supercell vectors:</span> [12.96, 0, 0] [0, 12.96, 0] [0, 0, 12.96] Å</div>
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Periodic Boundary Conditions (PBC)</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            The 64-atom box is replicated infinitely in all 3 directions. An atom near the right edge "sees" atoms
            on the left edge as neighbors. This simulates an <b>infinite crystal</b> using a finite number of atoms.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 12px", fontSize: 11 }}>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>Total atoms</span><span>64 (32 Cd + 32 Te)</span>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>Valence e⁻</span><span>32×2 + 32×6 = 256 (NELECT)</span>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>Total e⁻ (all)</span><span>32×48 + 32×52 = 3200 (but PAW treats core implicitly)</span>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>k-points</span><span>2×2×2 Gamma-centered (sufficient for 64-atom cell)</span>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>ENCUT</span><span>~350 eV (plane-wave cutoff for CdTe)</span>
          </div>
        </div>


        <div style={infoBox(T.eo_gap)}>
          <div style={{ fontSize: 11, color: T.eo_gap, fontWeight: 700, marginBottom: 4 }}>Defect in supercell</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Remove 1 Cd → 63 atoms, 254 electrons. The missing atom creates a V_Cd vacancy.
            Defect concentration = 1/32 Cd sites = 3.125% in the cell. In real CdTe, typical
            concentration is ~10¹⁴-10¹⁶ cm⁻³ (parts per million).
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 4: ENERGY BANDS ────────────────────────────────────────────────
function BandSection() {
  const [temp, setTemp] = useState(0);
  const [light, setLight] = useState(false);
  const [frame, setFrame] = useState(0);
  const [act, setAct] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(id);
  }, []);

  // Auto-advance acts every ~220 frames (~9 s) when playing
  useEffect(() => {
    if (!playing) return;
    if (frame > 0 && frame % 220 === 0) setAct(a => (a < 3 ? a + 1 : 0));
  }, [frame, playing]);

  const ACTS = [
    {
      id: 0, label: "Isolated atoms",
      desc: "Each isolated Cd and Te atom has sharp, discrete energy levels — like a quantum fingerprint. Cd's outer electrons sit in the 5s orbital; Te's in the 5p orbital. No interaction, no sharing.",
    },
    {
      id: 1, label: "2-atom molecule",
      desc: "When Cd and Te bond, quantum mechanical interference splits every atomic level into two: a lower bonding state (electrons pulled between nuclei) and a higher antibonding state (electrons pushed out). 1 level → 2 levels.",
    },
    {
      id: 2, label: "8-atom cluster",
      desc: "With 8 atoms, each original atomic level splits into 8 closely spaced levels. They are starting to form clusters — embryonic bands. The gap between them is still visible but narrowing.",
    },
    {
      id: 3, label: "Crystal  (N → ∞)",
      desc: "In a real crystal (~10²³ atoms), the discrete levels merge into continuous energy bands. A forbidden gap of 1.44 eV opens. The lower band (VB) is fully filled with Te 5p electrons; the upper band (CB) is empty.",
    },
  ];

  // ── Band formation SVG ────────────────────────────────────────────────────
  const W = 520, H = 310;
  const xL = 70, xR = 460;
  const bW = xR - xL;
  const yVB = 210;   // valence band center y
  const yCB = 90;    // conduction band center y

  const renderAct = () => {
    const els = [];
    const t = (frame % 220) / 220; // 0-1 within current act

    // ── Energy axis ──
    els.push(
      <line key="eax" x1={xL - 12} y1={18} x2={xL - 12} y2={H - 20}
        stroke={T.border} strokeWidth={1.5} />,
      <text key="elbl" x={xL - 14} y={H / 2} textAnchor="middle"
        fontSize={9} fill={T.muted} transform={`rotate(-90,${xL - 14},${H / 2})`}>Energy (eV)</text>,
      <text key="hi" x={xL - 26} y={22} textAnchor="middle" fontSize={8} fill={T.muted}>high</text>,
      <text key="lo" x={xL - 26} y={H - 18} textAnchor="middle" fontSize={8} fill={T.muted}>low</text>,
    );

    // ── Act 0: isolated atoms ──────────────────────────────────────────────
    if (act === 0) {
      const pulse = 0.7 + 0.3 * Math.sin(frame * 0.07);
      // Cd atom + 5s level
      const cdX = W * 0.28;
      els.push(
        <circle key="cd" cx={cdX} cy={H - 44} r={22} fill={T.eo_cond + "33"} stroke={T.eo_cond} strokeWidth={2} />,
        <text key="cdl" x={cdX} y={H - 40} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.eo_cond}>Cd</text>,
        <text key="cds" x={cdX} y={H - 28} textAnchor="middle" fontSize={8} fill={T.muted}>5s²</text>,
        // orbital glow
        ...Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2 + frame * 0.03;
          return <circle key={`co${i}`} cx={cdX + Math.cos(a) * 28 * pulse} cy={(H - 44) + Math.sin(a) * 14 * pulse} r={2.5} fill={T.eo_cond} opacity={0.5} />;
        }),
        // energy level line
        <line key="cdlvl" x1={cdX - 45} y1={yCB} x2={cdX + 45} y2={yCB}
          stroke={T.eo_cond} strokeWidth={2.5} />,
        <text key="cdlvlt" x={cdX + 52} y={yCB + 4} fontSize={9} fill={T.eo_cond} fontWeight="bold">Cd 5s</text>,
      );
      // Te atom + 5p level
      const teX = W * 0.68;
      els.push(
        <circle key="te" cx={teX} cy={H - 44} r={24} fill={T.eo_valence + "33"} stroke={T.eo_valence} strokeWidth={2} />,
        <text key="tel" x={teX} y={H - 40} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.eo_valence}>Te</text>,
        <text key="tes" x={teX} y={H - 28} textAnchor="middle" fontSize={8} fill={T.muted}>5p⁴</text>,
        ...Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 - frame * 0.03;
          return <circle key={`to${i}`} cx={teX + Math.cos(a) * 32 * pulse} cy={(H - 44) + Math.sin(a) * 16 * pulse} r={2.5} fill={T.eo_valence} opacity={0.5} />;
        }),
        <line key="telvl" x1={teX - 45} y1={yVB} x2={teX + 45} y2={yVB}
          stroke={T.eo_valence} strokeWidth={2.5} />,
        <text key="telvlt" x={teX + 52} y={yVB + 4} fontSize={9} fill={T.eo_valence} fontWeight="bold">Te 5p</text>,
      );
      // label: no interaction
      els.push(
        <text key="sep" x={W / 2} y={H / 2 - 10} textAnchor="middle" fontSize={10} fill={T.muted} fontStyle="italic">
          — — no interaction — —
        </text>
      );
    }

    // ── Act 1: diatomic molecule — level splitting ─────────────────────────
    if (act === 1) {
      const split = 28 * Math.min(t * 3, 1); // animate split opening
      const bondPulse = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.06));
      // Atoms side by side
      els.push(
        <circle key="cd1" cx={W * 0.38} cy={H - 44} r={20} fill={T.eo_cond + "33"} stroke={T.eo_cond} strokeWidth={2} />,
        <text key="cd1l" x={W * 0.38} y={H - 40} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.eo_cond}>Cd</text>,
        <circle key="te1" cx={W * 0.58} cy={H - 44} r={22} fill={T.eo_valence + "33"} stroke={T.eo_valence} strokeWidth={2} />,
        <text key="te1l" x={W * 0.58} y={H - 40} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.eo_valence}>Te</text>,
        // bond
        <line key="bond" x1={W * 0.38 + 20} y1={H - 44} x2={W * 0.58 - 22} y2={H - 44}
          stroke={T.eo_e} strokeWidth={2.5} opacity={bondPulse} />,
        // animated bond electrons
        ...[0, 1].map(i => {
          const bx = W * 0.43 + ((frame * 1.2 + i * 40) % 60);
          return <circle key={`be${i}`} cx={bx} cy={H - 44} r={3} fill={T.eo_e} opacity={0.8} />;
        }),
      );
      // CB: split into bonding (lower) + antibonding (upper)
      els.push(
        <line key="cb_anti" x1={xL + 30} y1={yCB - split} x2={xR - 30} y2={yCB - split}
          stroke={T.eo_cond} strokeWidth={2} strokeDasharray="6,3" />,
        <text key="anti_lbl" x={xR - 20} y={yCB - split + 4} fontSize={8} fill={T.eo_cond}>σ* (antibonding)</text>,
        <line key="cb_bond" x1={xL + 30} y1={yCB + split * 0.5} x2={xR - 30} y2={yCB + split * 0.5}
          stroke={T.eo_cond} strokeWidth={2} />,
        <text key="bond_lbl" x={xR - 20} y={yCB + split * 0.5 + 4} fontSize={8} fill={T.eo_cond}>σ (bonding)</text>,
        // split arrows
        split > 4 && <path key="sarr1" d={`M ${xL + 15},${yCB - 4} L ${xL + 15},${yCB - split + 4}`}
          stroke={T.eo_cond} strokeWidth={1} markerEnd="url(#arrowSmall)" opacity={0.5} />,
        split > 4 && <path key="sarr2" d={`M ${xL + 15},${yCB + 4} L ${xL + 15},${yCB + split * 0.5 - 4}`}
          stroke={T.eo_cond} strokeWidth={1} opacity={0.5} />,
      );
      // VB: split into bonding (lower) + antibonding (upper)
      els.push(
        <line key="vb_anti" x1={xL + 30} y1={yVB - split * 0.8} x2={xR - 30} y2={yVB - split * 0.8}
          stroke={T.eo_valence} strokeWidth={2} strokeDasharray="6,3" />,
        <text key="vb_anti_lbl" x={xR - 20} y={yVB - split * 0.8 + 4} fontSize={8} fill={T.eo_valence}>π* (antibonding)</text>,
        <line key="vb_bond" x1={xL + 30} y1={yVB + split} x2={xR - 30} y2={yVB + split}
          stroke={T.eo_valence} strokeWidth={2} />,
        <text key="vb_bond_lbl" x={xR - 20} y={yVB + split + 4} fontSize={8} fill={T.eo_valence}>π (bonding)</text>,
        <text key="cnt" x={W / 2} y={H - 10} textAnchor="middle" fontSize={10} fill={T.muted}>
          1 level → 2 levels per orbital
        </text>,
      );
    }

    // ── Act 2: 8-atom cluster ──────────────────────────────────────────────
    if (act === 2) {
      const nAt = 8;
      const spread = 46;
      // Show 8 small atoms
      for (let i = 0; i < nAt; i++) {
        const ax = xL + 10 + (i / (nAt - 1)) * (bW - 20);
        const isCd = i % 2 === 0;
        els.push(
          <circle key={`at${i}`} cx={ax} cy={H - 36} r={13}
            fill={(isCd ? T.eo_cond : T.eo_valence) + "33"}
            stroke={isCd ? T.eo_cond : T.eo_valence} strokeWidth={1.5} />,
          <text key={`atl${i}`} x={ax} y={H - 32} textAnchor="middle" fontSize={9} fontWeight="bold"
            fill={isCd ? T.eo_cond : T.eo_valence}>{isCd ? "Cd" : "Te"}</text>,
        );
        if (i < nAt - 1) {
          const ax2 = xL + 10 + ((i + 1) / (nAt - 1)) * (bW - 20);
          els.push(
            <line key={`ab${i}`} x1={ax + 13} y1={H - 36} x2={ax2 - 13} y2={H - 36}
              stroke={T.eo_e} strokeWidth={1} opacity={0.5} />
          );
        }
      }
      // 8 levels per band region
      for (let i = 0; i < nAt; i++) {
        const offset = (i / (nAt - 1) - 0.5) * spread * 2;
        const wiggle = Math.sin(frame * 0.04 + i * 0.9) * 1.5;
        // CB levels
        els.push(
          <line key={`cbl${i}`} x1={xL + 10} y1={yCB + offset + wiggle} x2={xR - 10} y2={yCB + offset + wiggle}
            stroke={T.eo_cond} strokeWidth={1.5} opacity={0.65} />
        );
        // VB levels
        els.push(
          <line key={`vbl${i}`} x1={xL + 10} y1={yVB + offset + wiggle} x2={xR - 10} y2={yVB + offset + wiggle}
            stroke={T.eo_valence} strokeWidth={1.5} opacity={0.65} />
        );
      }
      els.push(
        <text key="cnt2" x={W / 2} y={(yCB + yVB) / 2} textAnchor="middle" fontSize={10} fill={T.eo_gap} fontWeight="bold">
          Gap narrowing...
        </text>,
        <text key="lbl2" x={W / 2} y={H - 10} textAnchor="middle" fontSize={10} fill={T.muted}>
          1 level → 8 levels — quasi-bands forming
        </text>,
      );
    }

    // ── Act 3: full crystal / continuous bands ─────────────────────────────
    if (act === 3) {
      const bandH = 44;
      // VB filled band
      els.push(
        <rect key="vbr" x={xL} y={yVB - bandH / 2} width={bW} height={bandH}
          fill={T.eo_valence} opacity={0.18} rx={4} />,
        <line key="vbt" x1={xL} y1={yVB - bandH / 2} x2={xR} y2={yVB - bandH / 2}
          stroke={T.eo_valence} strokeWidth={2.5} />,
        <line key="vbb" x1={xL} y1={yVB + bandH / 2} x2={xR} y2={yVB + bandH / 2}
          stroke={T.eo_valence} strokeWidth={2.5} />,
        <text key="vblbl" x={xL + 6} y={yVB + 5} fontSize={11} fontWeight="bold" fill={T.eo_valence}>Valence Band</text>,
        <text key="vbsub" x={xL + 6} y={yVB + 18} fontSize={8} fill={T.muted}>Te 5p — fully filled (256 e⁻)</text>,
      );
      // CB empty band
      els.push(
        <rect key="cbr" x={xL} y={yCB - bandH / 2} width={bW} height={bandH}
          fill={T.eo_cond} opacity={0.08} rx={4} />,
        <line key="cbt" x1={xL} y1={yCB - bandH / 2} x2={xR} y2={yCB - bandH / 2}
          stroke={T.eo_cond} strokeWidth={2.5} />,
        <line key="cbb" x1={xL} y1={yCB + bandH / 2} x2={xR} y2={yCB + bandH / 2}
          stroke={T.eo_cond} strokeWidth={2.5} />,
        <text key="cblbl" x={xL + 6} y={yCB - 8} fontSize={11} fontWeight="bold" fill={T.eo_cond}>Conduction Band</text>,
        <text key="cbsub" x={xL + 6} y={yCB + 5} fontSize={8} fill={T.muted}>Cd 5s* — empty at 0 K</text>,
      );
      // Gap bracket + label
      const gapTop = yCB + bandH / 2;
      const gapBot = yVB - bandH / 2;
      els.push(
        <rect key="gapr" x={xL} y={gapTop} width={bW} height={gapBot - gapTop}
          fill={T.bg} opacity={0.7} />,
        <line key="gapl" x1={xR + 8} y1={gapTop} x2={xR + 8} y2={gapBot}
          stroke={T.eo_gap} strokeWidth={1.5} />,
        <line key="gaptt" x1={xR + 4} y1={gapTop} x2={xR + 12} y2={gapTop}
          stroke={T.eo_gap} strokeWidth={1.5} />,
        <line key="gapbt" x1={xR + 4} y1={gapBot} x2={xR + 12} y2={gapBot}
          stroke={T.eo_gap} strokeWidth={1.5} />,
        <text key="gaplbl" x={xR + 22} y={(gapTop + gapBot) / 2 - 6} fontSize={11} fontWeight="bold" fill={T.eo_gap}>1.44 eV</text>,
        <text key="gaplbl2" x={xR + 22} y={(gapTop + gapBot) / 2 + 8} fontSize={9} fill={T.eo_gap}>band gap</text>,
        <text key="gapdirect" x={xR + 22} y={(gapTop + gapBot) / 2 + 20} fontSize={8} fill={T.muted}>direct at Γ</text>,
      );
      // Animated electrons drifting in VB
      for (let i = 0; i < 14; i++) {
        const ex = xL + 8 + ((i * 30 + frame * 0.7) % (bW - 16));
        const ey = yVB - 14 + Math.sin(frame * 0.06 + i * 0.8) * 11;
        els.push(
          <circle key={`ve${i}`} cx={ex} cy={ey} r={3} fill={T.eo_valence} opacity={0.7} />
        );
      }
      // Label: N atoms
      els.push(
        <text key="natoms" x={W / 2} y={H - 10} textAnchor="middle" fontSize={10} fill={T.muted}>
          ~10²³ atoms → continuous bands — 1.44 eV gap opens
        </text>
      );
    }

    return els;
  };

  const kT = [0, 0.026, 0.08][temp];
  const thermalExcited = temp === 0 ? 0 : temp === 1 ? 2 : 5;
  const lightExcited = light ? 4 : 0;
  const totalExcited = thermalExcited + lightExcited;
  const VBtop = 240, CBbot = 110, BW = 320;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── MOVIE: How bands form ─────────────────────────────────────── */}
      <div style={{ background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {/* Act selector */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
          {ACTS.map((a, i) => (
            <button key={a.id} onClick={() => { setAct(i); setPlaying(false); }} style={{
              flex: 1, padding: "9px 6px", border: "none", borderRight: `1px solid ${T.border}`,
              background: act === i ? T.eo_cond + "15" : "transparent",
              borderBottom: act === i ? `2.5px solid ${T.eo_cond}` : "2.5px solid transparent",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: act === i ? T.eo_cond : T.muted, marginBottom: 2 }}>
                Act {i + 1}
              </div>
              <div style={{ fontSize: 10, color: act === i ? T.ink : T.muted, lineHeight: 1.3 }}>{a.label}</div>
            </button>
          ))}
          <button onClick={() => setPlaying(p => !p)} style={{
            padding: "9px 14px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 16, color: T.muted,
          }}>{playing ? "⏸" : "▶"}</button>
        </div>

        {/* Animation SVG */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: T.bg, width: "100%", maxWidth: W }}>
          {renderAct()}
        </svg>

        {/* Act description */}
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.ink, lineHeight: 1.7, minHeight: 52 }}>
          <span style={{ fontWeight: 700, color: T.eo_cond }}>Act {act + 1} — {ACTS[act].label}: </span>
          {ACTS[act].desc}
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
          {ACTS.map((_, i) => (
            <div key={i} onClick={() => { setAct(i); setPlaying(false); }} style={{
              width: act === i ? 22 : 8, height: 8, borderRadius: 4,
              background: act === i ? T.eo_cond : T.dim,
              cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* ── Interactive band diagram (existing) ──────────────────────── */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 340px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Interactive Band Diagram</div>
          <svg viewBox={`0 0 ${BW} 320`} style={{ display: "block", width: "100%", maxWidth: BW }}>
            <rect width={BW} height={320} fill={T.bg} rx={10} />
            <rect x={20} y={VBtop} width={BW - 40} height={55} rx={4} fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
            <text x={30} y={VBtop + 18} fill={T.eo_valence} fontSize={11} fontWeight="bold">Valence Band</text>
            <text x={30} y={VBtop + 32} fill={T.muted} fontSize={9}>Te 5p character (bonding)</text>
            <rect x={20} y={35} width={BW - 40} height={50} rx={4} fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
            <text x={30} y={55} fill={T.eo_cond} fontSize={11} fontWeight="bold">Conduction Band</text>
            <text x={30} y={69} fill={T.muted} fontSize={9}>Cd 5s* character (antibonding)</text>
            <rect x={20} y={CBbot} width={BW - 40} height={VBtop - CBbot} fill={T.bg} />
            <line x1={20} y1={(CBbot + VBtop) / 2} x2={280} y2={(CBbot + VBtop) / 2} stroke={T.border} strokeDasharray="4 4" />
            <text x={290} y={(CBbot + VBtop) / 2 + 4} fill={T.eo_gap} fontSize={10} fontWeight="bold">GAP</text>
            <line x1={285} y1={CBbot + 2} x2={285} y2={VBtop - 2} stroke={T.eo_gap} strokeWidth={1} />
            <text x={170} y={(CBbot + VBtop) / 2 - 5} textAnchor="middle" fill={T.eo_gap} fontSize={10} fontWeight="bold">1.44 eV (direct at Γ)</text>
            <path d={`M 100,${CBbot} Q 160,${CBbot - 25} 220,${CBbot}`} fill="none" stroke={T.eo_cond} strokeWidth={1.5} opacity={0.5} />
            <path d={`M 100,${VBtop} Q 160,${VBtop + 25} 220,${VBtop}`} fill="none" stroke={T.eo_valence} strokeWidth={1.5} opacity={0.5} />
            <text x={160} y={CBbot - 8} textAnchor="middle" fill={T.muted} fontSize={8}>Γ</text>
            {Array.from({ length: totalExcited }, (_, i) => {
              const isLight = i >= thermalExcited;
              const ex = 45 + i * 30;
              const eyStart = VBtop + 25;
              const bounce = Math.abs(Math.sin(frame * 0.04 + i));
              return (
                <g key={i}>
                  <line x1={ex} y1={eyStart - 5} x2={ex} y2={55 + i * 4} stroke={isLight ? T.eo_photon : T.eo_hole} strokeWidth={1} strokeDasharray="3 3" opacity={0.3} />
                  <circle cx={ex} cy={eyStart} r={4} fill="none" stroke={T.eo_hole} strokeWidth={1.5} opacity={0.7} />
                  <circle cx={ex} cy={55 + i * 4 + bounce * 12} r={4} fill={T.eo_e} opacity={0.9} />
                </g>
              );
            })}
            {Array.from({ length: 8 }, (_, i) => (
              <circle key={i} cx={35 + i * 33} cy={VBtop + 28} r={4} fill={T.eo_valence} opacity={0.6} />
            ))}
          </svg>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>Temperature</div>
            <div style={{ display: "flex", gap: 5 }}>
              {["0 K", "300 K", "Hot"].map((t, i) => (
                <button key={i} onClick={() => setTemp(i)} style={{
                  flex: 1, padding: "6px 0", borderRadius: 6, fontSize: 11,
                  background: temp === i ? T.eo_hole + "22" : T.surface,
                  border: `1px solid ${temp === i ? T.eo_hole : T.border}`,
                  color: temp === i ? T.eo_hole : T.muted, cursor: "pointer",
                }}>{t}</button>
              ))}
            </div>
            <button onClick={() => setLight(l => !l)} style={{
              padding: "7px 0", borderRadius: 6, fontSize: 11,
              background: light ? T.eo_photon + "22" : T.surface,
              border: `1px solid ${light ? T.eo_photon : T.border}`,
              color: light ? T.eo_photon : T.muted, cursor: "pointer", fontWeight: light ? 700 : 400,
            }}>{light ? "Light ON (hν > 1.44 eV)" : "Light OFF"}</button>
          </div>
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={sectionPanel}>
            <div style={labelUpper}>Current state</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: totalExcited > 0 ? T.eo_e : T.eo_valence, marginBottom: 4 }}>
              {totalExcited} free electron-hole pairs
            </div>
            <div style={{ fontSize: 11, color: T.muted }}>
              {temp === 0 && !light && "Perfect insulator at 0 K. All 256 electrons locked in valence band."}
              {temp === 1 && !light && "Room temp: kT = 0.026 eV << 1.44 eV gap. Thermal excitation probability ~ e⁻⁵⁵ ≈ negligible. Very few intrinsic carriers."}
              {temp === 2 && !light && "High temp: intrinsic carrier concentration rises exponentially with T."}
              {light && "Photons with E > 1.44 eV excite electrons across the gap. CdTe absorbs 99% of sunlight in just ~2 μm."}
            </div>
          </div>

          <div style={sectionPanel}>
            <div style={labelUpper}>Why 1.44 eV is ideal for solar cells</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 6 }}>
              The Shockley-Queisser limit peaks at ~1.34 eV. CdTe at <b>1.44 eV</b> is nearly optimal — absorbs most solar photons, maintains good voltage. Record: <b>22.1%</b> (First Solar).
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2px 10px", fontSize: 11 }}>
              {[
                ["Band gap", "1.44 eV (direct at Γ-point)"],
                ["Absorption", "~10⁵ cm⁻¹ (100× stronger than Si)"],
                ["Thickness needed", "~2 μm (vs ~200 μm for Si)"],
                ["Direct gap", "No phonon needed for absorption"],
                ["VB character", "Te 5p (bonding orbitals)"],
                ["CB character", "Cd 5s* (antibonding orbitals)"],
              ].map(([k, v]) => (
                <>
                  <span key={k} style={{ color: T.eo_cond, fontWeight: 700 }}>{k}</span>
                  <span key={v}>{v}</span>
                </>
              ))}
            </div>
          </div>

          <div style={sectionPanel}>
            <div style={labelUpper}>Where do free electrons come from?</div>
            {[
              { title: "From atom valence electrons", desc: "All 256 electrons came from Cd (2e each) and Te (6e each). The VB is the reservoir.", color: T.eo_valence },
              { title: "Thermal: kT kicks them up", desc: "At 300 K, kT = 0.026 eV. Gap = 1.44 eV. Probability ~ e⁻⁵⁵. Intrinsic carrier density ~ 10⁶ cm⁻³.", color: T.eo_hole },
              { title: "Light: photon energy > 1.44 eV", desc: "Solar photons (visible + near-IR) have enough energy. CdTe absorbs almost all of them in 2 μm.", color: T.eo_photon },
              { title: "Defect: V_Cd creates gap states", desc: "Vacancy creates levels inside the gap — much easier to thermally excite than crossing the full 1.44 eV.", color: T.eo_gap },
            ].map(({ title, desc, color }) => (
              <div key={title} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 4, borderRadius: 2, background: color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 5: BOND NATURE ──────────────────────────────────────────────────
function BondNatureSection() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const ionicity = 0.72; // Phillips ionicity
  const covalency = 1 - ionicity;
  return (
    <div>
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 320px" }}>
        <svg viewBox="0 0 320 280" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 320 }}>
          {/* Cd atom (left) */}
          <circle cx={100} cy={140} r={30} fill={T.eo_valence + "33"} stroke={T.eo_valence} strokeWidth={2} />
          <text x={100} y={144} textAnchor="middle" fill={T.eo_valence} fontSize={14} fontWeight="bold">Cd</text>
          <text x={100} y={118} textAnchor="middle" fill={T.muted} fontSize={8}>+0.8e</text>

          {/* Te atom (right) — slightly larger due to gaining electrons */}
          <circle cx={220} cy={140} r={35} fill={T.eo_hole + "33"} stroke={T.eo_hole} strokeWidth={2} />
          <text x={220} y={144} textAnchor="middle" fill={T.eo_hole} fontSize={14} fontWeight="bold">Te</text>
          <text x={220} y={113} textAnchor="middle" fill={T.muted} fontSize={8}>-0.8e</text>

          {/* Bond line */}
          <line x1={130} y1={140} x2={185} y2={140} stroke={T.eo_valence} strokeWidth={2} />

          {/* Animated electrons flowing from Cd to Te */}
          {[0,1,2,3].map(i => {
            const progress = ((frame * 0.02 + i * 0.25) % 1);
            const ex = 130 + progress * 55;
            return <circle key={i} cx={ex} cy={140 + Math.sin(progress * Math.PI) * 8} r={3} fill={T.eo_e} opacity={0.4 + progress * 0.5} />;
          })}

          {/* Electron cloud around Te — denser, pulsing */}
          {Array.from({length: 20}, (_, i) => {
            const angle = (i / 20) * Math.PI * 2 + frame * 0.01;
            const r = 28 + 10 * Math.sin(frame * 0.03 + i);
            return <circle key={`te${i}`} cx={220 + Math.cos(angle) * r} cy={140 + Math.sin(angle) * r} r={2} fill={T.eo_e} opacity={0.3} />;
          })}

          {/* Electron cloud around Cd — sparser */}
          {Array.from({length: 8}, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 - frame * 0.01;
            const r = 24 + 6 * Math.sin(frame * 0.03 + i);
            return <circle key={`cd${i}`} cx={100 + Math.cos(angle) * r} cy={140 + Math.sin(angle) * r} r={2} fill={T.eo_e} opacity={0.2} />;
          })}

          {/* Dipole arrow */}
          <text x={160} y={180} textAnchor="middle" fill={T.eo_gap} fontSize={10} fontWeight="bold">{"δ+ → δ-"}</text>

          {/* Ionicity label */}
          <text x={160} y={30} textAnchor="middle" fill={T.ink} fontSize={11} fontWeight="bold">Charge Transfer in CdTe Bond</text>
          <text x={160} y={260} textAnchor="middle" fill={T.muted} fontSize={9}>Electrons pulled toward Te (higher electronegativity)</text>
        </svg>
      </div>
      <div style={{ flex: "1 1 300px" }}>
        <div style={infoBox(T.eo_valence)}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>CdTe Bond: Partially Ionic, Partially Covalent</div>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
            CdTe bonds are <b>not purely covalent</b> (like Si-Si) nor <b>purely ionic</b> (like NaCl).
            Te is more electronegative (2.10) than Cd (1.69), so it pulls electron density toward itself.
            The result: each bond has significant <b>charge transfer</b> from Cd to Te.
          </div>
        </div>

        {/* Ionicity bar */}
        <div style={sectionPanel}>
          <div style={labelUpper}>Phillips Ionicity Scale</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: T.eo_valence, fontWeight: 700 }}>Covalent</span>
            <div style={{ flex: 1, height: 20, background: T.bg, borderRadius: 4, overflow: "hidden", position: "relative", border: `1px solid ${T.border}` }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${ionicity * 100}%`, background: `linear-gradient(90deg, ${T.eo_valence}44, ${T.eo_hole}66)`, borderRadius: 4 }} />
              <div style={{ position: "absolute", left: `${ionicity * 100}%`, top: -2, width: 3, height: 24, background: T.eo_gap, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: T.eo_hole, fontWeight: 700 }}>Ionic</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 800, color: T.eo_e }}>
            CdTe: f_i = {ionicity.toFixed(2)} ({(ionicity * 100).toFixed(0)}% ionic)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 6, marginTop: 10 }}>
            {[
              { name: "Si", fi: 0.0, color: T.eo_valence },
              { name: "GaAs", fi: 0.31, color: T.eo_cond },
              { name: "CdTe", fi: 0.72, color: T.eo_e },
            ].map(m => (
              <div key={m.name} style={{ textAlign: "center", padding: "6px 4px", borderRadius: 6, background: m.color + "11", border: `1px solid ${m.color}33` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.name}</div>
                <div style={{ fontSize: 10, color: T.muted }}>f_i = {m.fi.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charge transfer */}
        <div style={sectionPanel}>
          <div style={labelUpper}>Charge transfer in CdTe</div>
          <div style={monoStep}>
            <div><span style={{ color: T.eo_valence }}>Cd:</span> donates ~0.5-0.8 e⁻ to each bond</div>
            <div><span style={{ color: T.eo_hole }}>Te:</span> gains ~0.5-0.8 e⁻ per bond</div>
            <div><span style={{ color: T.muted }}>Bader charge:</span> Cd ~ +0.8e, Te ~ -0.8e</div>
            <div><span style={{ color: T.muted }}>Born effective charge Z*:</span> Cd = +2.35, Te = -2.35</div>
            <div style={{ color: T.muted }}>(Much larger than nominal +2/-2, due to dynamic charge)</div>
          </div>
        </div>
      </div>

      <div style={{ flex: "1 1 300px" }}>
        {/* Bond properties */}
        <div style={sectionPanel}>
          <div style={labelUpper}>CdTe bond properties</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 11 }}>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bond length</span><span>2.81 Å</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bond type</span><span>sp³ sigma (σ) bond</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Coordination</span><span>4-fold tetrahedral</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bond angle</span><span>109.47° (tetrahedral)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bonds per atom</span><span>4 (each Cd bonded to 4 Te, vice versa)</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bonds in 64-atom cell</span><span>128 bonds × 2e = 256 bonding electrons</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Bond energy</span><span>~1.0 eV per bond</span>
            <span style={{ color: T.eo_valence, fontWeight: 700 }}>Dielectric constant</span><span>ε∞ = 7.1 (high-freq), ε₀ = 10.2 (static)</span>
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Why ionicity matters for defects</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
            High ionicity means <b>stronger Coulomb interactions</b> between charged defects and carriers.
            A V_Cd⁻² vacancy has a large electrostatic potential that can trap carriers from far away.
            This is why CdTe defect physics is dominated by <b>charged defects</b> — their formation energies
            depend strongly on the Fermi level position, unlike in purely covalent semiconductors like Si.
          </div>
        </div>

        <div style={infoBox(T.eo_photon)}>
          <div style={{ fontSize: 11, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Comparison with other solar materials</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto", gap: "3px 10px", fontSize: 10, fontFamily: "monospace" }}>
            <span style={{ fontWeight: 700, color: T.muted }}>Material</span><span style={{ fontWeight: 700, color: T.muted }}>Gap</span><span style={{ fontWeight: 700, color: T.muted }}>Type</span><span style={{ fontWeight: 700, color: T.muted }}>Ionicity</span>
            <span style={{ color: T.eo_valence }}>Si</span><span>1.12 eV</span><span>indirect</span><span>0.00</span>
            <span style={{ color: T.eo_cond }}>GaAs</span><span>1.42 eV</span><span>direct</span><span>0.31</span>
            <span style={{ color: T.eo_e, fontWeight: 700 }}>CdTe</span><span style={{ fontWeight: 700 }}>1.44 eV</span><span style={{ fontWeight: 700 }}>direct</span><span style={{ fontWeight: 700 }}>0.72</span>
            <span style={{ color: T.eo_hole }}>CdS</span><span>2.42 eV</span><span>direct</span><span>0.69</span>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 6: DEFECT STATES ────────────────────────────────────────────────
function DefectSection() {
  const [frame, setFrame] = useState(0);
  const [charge, setCharge] = useState(0); // 0=neutral, 1=-1, 2=-2
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const VBtop = 240, defY = [148, 166, 184, 202];
  const fillings = [
    [2, 2, 1, 0], // neutral V_Cd: D1 full, D2 full, D3 half, D4 empty
    [2, 2, 2, 0], // V_Cd^-1: D3 now full
    [2, 2, 2, 1], // V_Cd^-2: D4 gains 1
  ];
  const filling = fillings[charge];
  const chargeLabels = ["V_Cd⁰ (neutral)", "V_Cd⁻¹", "V_Cd⁻²"];

  return (
    <div>
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />
          <rect x={20} y={40} width={220} height={35} rx={4} fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
          <text x={30} y={60} fill={T.eo_cond} fontSize={11} fontWeight="bold">Conduction Band</text>
          <rect x={20} y={VBtop} width={220} height={50} rx={4} fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
          <text x={30} y={VBtop + 20} fill={T.eo_valence} fontSize={11} fontWeight="bold">Valence Band</text>
          <text x={30} y={VBtop + 36} fill={T.muted} fontSize={9}>Te 5p bonding states</text>
          <text x={255} y={160} fill={T.eo_gap} fontSize={10} fontWeight="bold" textAnchor="middle">GAP</text>
          <text x={255} y={174} fill={T.muted} fontSize={9} textAnchor="middle">1.44 eV</text>

          {/* Defect levels D1-D4 */}
          {defY.map((y, i) => {
            const f = filling[i];
            return (
              <g key={i}>
                <line x1={50} y1={y} x2={200} y2={y}
                  stroke={T.eo_gap} strokeWidth={2} opacity={0.6} />
                <text x={30} y={y + 4} textAnchor="middle" fill={T.muted} fontSize={9}>
                  D{i + 1}
                </text>
                {f >= 1 && (
                  <circle cx={100} cy={y - 7} r={5} fill={T.eo_e}>
                    <animate attributeName="cy" values={`${y - 7};${y - 9};${y - 7}`}
                      dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {f >= 2 && (
                  <circle cx={130} cy={y - 7} r={5} fill={T.eo_e}>
                    <animate attributeName="cy" values={`${y - 7};${y - 9};${y - 7}`}
                      dur="2.3s" repeatCount="indefinite" />
                  </circle>
                )}
                {f === 1 && (
                  <circle cx={130} cy={y - 7} r={5}
                    fill="none" stroke={T.eo_hole} strokeWidth={1.5} />
                )}
                {f === 0 && (
                  <>
                    <circle cx={100} cy={y - 7} r={5}
                      fill="none" stroke={T.muted} strokeWidth={1} opacity={0.4} />
                    <circle cx={130} cy={y - 7} r={5}
                      fill="none" stroke={T.muted} strokeWidth={1} opacity={0.4} />
                  </>
                )}
              </g>
            );
          })}

          {/* Vacancy site label */}
          <rect x={50} y={298} width={180} height={18} rx={4}
            fill={T.eo_gap + "11"} stroke={T.eo_gap} strokeWidth={1} strokeDasharray="4 3" />
          <text x={140} y={311} textAnchor="middle" fill={T.eo_gap} fontSize={9} fontWeight="bold">
            {chargeLabels[charge]}
          </text>
        </svg>
        {/* Charge state selector */}
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {chargeLabels.map((cl, i) => (
            <button key={i} onClick={() => setCharge(i)} style={{
              flex: 1, padding: "5px 2px", fontSize: 9, borderRadius: 6,
              background: i === charge ? T.eo_gap + "22" : T.surface,
              border: `1px solid ${i === charge ? T.eo_gap : T.border}`,
              color: i === charge ? T.eo_gap : T.muted, cursor: "pointer",
            }}>{cl}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={infoBox(T.eo_gap)}>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.eo_gap, marginBottom: 6 }}>
            V_Cd: Cadmium Vacancy in CdTe
          </div>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
            When a Cd atom is missing from the 64-atom supercell, 4 neighboring Te atoms
            have broken bonds pointing into empty space. These <b>dangling bonds</b> create
            electronic states inside the 1.44 eV band gap. In a {chargeLabels[charge]} state,
            {charge === 0 && " 5 electrons occupy the 4 dangling bond states (D1 full, D2 full, D3 half-filled)."}
            {charge === 1 && " 6 electrons fill D1-D3 completely. The extra electron came from the Fermi sea."}
            {charge === 2 && " 7 electrons now occupy D1-D4. Two extra electrons were captured from the crystal."}
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Why dangling bonds?</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 8 }}>
            Cd normally bonds to 4 Te atoms via sp³ orbitals. Remove Cd → each Te neighbor
            has one sp³ orbital pointing into empty space. These 4 dangling bonds
            hybridize into 4 defect levels (D1-D4) inside the gap.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6 }}>
            {[
              { label: "Normal Te-Cd bond", state: "Te(sp³) — Cd(sp³)", color: T.eo_valence },
              { label: "Dangling bond (V_Cd)", state: "Te(sp³) — [vacancy]", color: T.eo_gap },
            ].map(({ label, state, color }) => (
              <div key={label} style={{ padding: "6px 8px", borderRadius: 6, background: color + "11", border: `1px solid ${color}33` }}>
                <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 11, color, fontFamily: "monospace" }}>{state}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Charge states & transition levels</div>
          <div style={monoStep}>
            <div><span style={{ color: T.eo_gap }}>V_Cd⁰:</span> neutral, 5 electrons in gap states, acceptor</div>
            <div><span style={{ color: T.eo_gap }}>V_Cd⁻¹:</span> captured 1 e⁻, transition level ε(0/−1) ~ VBM + 0.2 eV</div>
            <div><span style={{ color: T.eo_gap }}>V_Cd⁻²:</span> captured 2 e⁻, transition level ε(−1/−2) ~ VBM + 0.4 eV</div>
            <div style={{ color: T.muted }}>Both levels are shallow → V_Cd is an efficient p-type dopant</div>
            <div style={{ color: T.muted }}>In 64-atom cell: 63 atoms, 254 valence electrons (lost 2 from Cd)</div>
          </div>
        </div>

        <div style={infoBox(T.eo_photon)}>
          <div style={{ fontSize: 11, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Why defect states kill solar cells</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Defect levels act as <b>stepping stones</b> — electrons recombine in 2 small jumps
            (CB→trap→VB) instead of 1 big jump across 1.44 eV. Energy goes to heat, not light.
            This is SRH recombination — the dominant loss mechanism in CdTe solar cells.
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 7: DEFECT CONFIGURATIONS — CdTe ─────────────────────────────
function DefectConfigSection() {
  const [selDefect, setSelDefect] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const defectTypes = [
    {
      id: "vacancy", label: "V_Cd (Cd vacancy)", icon: "V", color: T.eo_gap,
      desc: "A Cd atom is missing from the lattice. The 4 neighboring Te atoms each have one broken sp³ bond → 4 dangling bonds create D1-D4 levels in the gap. Most common native defect in CdTe.",
      electronEffect: "Removes 2 valence electrons (Cd's contribution). 4 Te dangling bonds create acceptor states in the gap. V_Cd is a shallow acceptor — the primary source of p-type conductivity in CdTe.",
      bandNote: "Acceptor levels near VBM: ε(0/−1) ~ VBM+0.2 eV, ε(−1/−2) ~ VBM+0.4 eV. Shallow → efficient p-type dopant.",
    },
    {
      id: "interstitial", label: "Cd_i (Cd interstitial)", icon: "i", color: T.eo_cond,
      desc: "An extra Cd atom squeezed between lattice sites. Brings 2 extra valence electrons that don't belong to the bonding network. Forms in Cd-rich growth conditions.",
      electronEffect: "The extra Cd donates 2 electrons to shallow donor levels just below the conduction band. These easily thermalize to the CB → n-type conductivity. Compensates p-type V_Cd.",
      bandNote: "Shallow donor: ε(+2/+1) ~ CBM−0.1 eV. Easily ionized at room temperature.",
    },
    {
      id: "antisite_cd", label: "Cd_Te (Cd on Te site)", icon: "AS", color: T.eo_photon,
      desc: "A Cd atom sits on a Te site. Cd has only 2 valence electrons but the Te site expects 6 for bonding. Creates a deep level — the most harmful recombination center in CdTe.",
      electronEffect: "4 missing electrons create deep levels in mid-gap. Acts as a powerful electron trap and non-radiative recombination center. This is the 'killer defect' for CdTe solar cells.",
      bandNote: "Deep mid-gap level: ε(+2/0) ~ VBM+0.7 eV. Deep = strong SRH recombination center.",
    },
    {
      id: "antisite_te", label: "Te_Cd (Te on Cd site)", icon: "TA", color: T.eo_e,
      desc: "A Te atom sits on a Cd site. Te has 6 valence electrons but the Cd site expects only 2 for bonding. 4 extra electrons create donor levels.",
      electronEffect: "4 excess electrons fill deep donor states. Can act as a compensating donor that partially neutralizes p-type V_Cd defects, reducing net carrier concentration.",
      bandNote: "Deep donor: ε(0/+1) ~ CBM−0.5 eV. Compensates V_Cd acceptors.",
    },
  ];

  const dt = defectTypes[selDefect];
  const sp = 55, ox = 25, oy = 25;
  const gridAtoms = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      gridAtoms.push({ r, c, x: ox + c * sp, y: oy + r * sp, type: (r + c) % 2 === 0 ? "Cd" : "Te" });
    }
  }
  const vacIdx = gridAtoms.findIndex(a => a.r === 1 && a.c === 1);
  const interX = ox + 1.5 * sp, interY = oy + 1.5 * sp;
  const antiIdx = gridAtoms.findIndex(a => a.r === 1 && a.c === 2);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08);

  return (
    <div>
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />

          {/* Bond lines */}
          {gridAtoms.map((a, i) => {
            if (selDefect === 0 && i === vacIdx) return null;
            return gridAtoms.filter((b, j) => {
              if (j <= i) return false;
              if (selDefect === 0 && j === vacIdx) return false;
              return (Math.abs(a.r - b.r) + Math.abs(a.c - b.c)) === 1;
            }).map((b, bi) => (
              <line key={`${i}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={T.border} strokeWidth={1} opacity={0.5} />
            ));
          })}

          {/* Atoms */}
          {gridAtoms.map((a, i) => {
            const isVacancy = selDefect === 0 && i === vacIdx;
            const isAntisite = (selDefect === 2 || selDefect === 3) && i === antiIdx;
            const isNeighborOfVac = selDefect === 0 && (
              (Math.abs(a.r - gridAtoms[vacIdx].r) + Math.abs(a.c - gridAtoms[vacIdx].c)) === 1
            );
            if (isVacancy) {
              return (
                <g key={i}>
                  <circle cx={a.x} cy={a.y} r={16} fill="none"
                    stroke={T.eo_gap} strokeWidth={2} strokeDasharray="4 3" opacity={0.7} />
                  <text x={a.x} y={a.y + 4} textAnchor="middle" fill={T.eo_gap} fontSize={8} fontWeight="bold">V</text>
                </g>
              );
            }
            const atomColor = a.type === "Cd" ? T.eo_cond : T.eo_valence;
            const displayType = isAntisite ? (selDefect === 2 ? "Cd" : "Te") : a.type;
            const displayColor = isAntisite ? (selDefect === 2 ? T.eo_cond : T.eo_hole) : atomColor;
            return (
              <g key={i}>
                {isNeighborOfVac && (
                  <circle cx={a.x} cy={a.y} r={20} fill={T.eo_gap + "22"} stroke={T.eo_gap} strokeWidth={1} opacity={pulse} />
                )}
                {isAntisite && (
                  <circle cx={a.x} cy={a.y} r={20} fill="none"
                    stroke={T.eo_photon} strokeWidth={2} strokeDasharray="3 2" opacity={0.8} />
                )}
                <circle cx={a.x} cy={a.y} r={14} fill={displayColor + "33"} stroke={displayColor} strokeWidth={1.5} />
                <text x={a.x} y={a.y + 4} textAnchor="middle" fill={displayColor} fontSize={9} fontWeight="bold">
                  {displayType}
                </text>
              </g>
            );
          })}

          {/* Interstitial extra atom */}
          {selDefect === 1 && (
            <g>
              <circle cx={interX} cy={interY} r={18} fill={T.eo_cond + "22"} stroke={T.eo_cond}
                strokeWidth={2} opacity={0.3 + 0.7 * pulse} />
              <circle cx={interX} cy={interY} r={14} fill={T.eo_cond + "44"} stroke={T.eo_cond} strokeWidth={2} />
              <text x={interX} y={interY + 4} textAnchor="middle" fill={T.eo_cond} fontSize={9} fontWeight="bold">Cd_i</text>
            </g>
          )}

          {/* Antisite label */}
          {(selDefect === 2 || selDefect === 3) && (
            <text x={gridAtoms[antiIdx].x} y={gridAtoms[antiIdx].y - 22} textAnchor="middle"
              fill={selDefect === 2 ? T.eo_photon : T.eo_e} fontSize={8} fontWeight="bold">wrong site!</text>
          )}

          {/* Mini band diagram sidebar */}
          <rect x={235} y={30} width={70} height={280} rx={6} fill={T.panel} stroke={T.border} strokeWidth={1} />
          <rect x={242} y={40} width={56} height={22} rx={3}
            fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1} />
          <text x={270} y={54} textAnchor="middle" fill={T.eo_cond} fontSize={8} fontWeight="bold">CB</text>
          <rect x={242} y={255} width={56} height={22} rx={3}
            fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1} />
          <text x={270} y={269} textAnchor="middle" fill={T.eo_valence} fontSize={8} fontWeight="bold">VB</text>

          {/* Defect levels in mini diagram */}
          {selDefect === 0 && [140, 155, 170, 185].map((dy, i) => (
            <line key={i} x1={248} y1={dy} x2={292} y2={dy}
              stroke={T.eo_gap} strokeWidth={1.5} opacity={0.6} />
          ))}
          {selDefect === 1 && (
            <line x1={248} y1={75} x2={292} y2={75}
              stroke={T.eo_cond} strokeWidth={2} />
          )}
          {selDefect === 2 && (
            <line x1={248} y1={150} x2={292} y2={150}
              stroke={T.eo_photon} strokeWidth={2} />
          )}
          {selDefect === 3 && (
            <line x1={248} y1={110} x2={292} y2={110}
              stroke={T.eo_e} strokeWidth={2} />
          )}

          {/* Animated electron */}
          {(() => {
            const p = ((frame * 0.012) % 1);
            const ey = selDefect === 0
              ? (p < 0.5 ? lerp(255, 160, p / 0.5) : 160)
              : selDefect === 1
              ? (p < 0.5 ? lerp(255, 50, p / 0.5) : 50)
              : (p < 0.5 ? lerp(255, 150, p / 0.5) : 150);
            return <circle cx={270} cy={ey} r={4} fill={T.eo_e} opacity={0.9} />;
          })()}

          <text x={270} y={298} textAnchor="middle" fill={T.muted} fontSize={7}>e⁻ path</text>
        </svg>

        {/* Defect type selector */}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {defectTypes.map((d, i) => (
            <button key={i} onClick={() => setSelDefect(i)} style={{
              flex: 1, padding: "7px 4px", fontSize: 11, borderRadius: 7,
              background: selDefect === i ? d.color + "22" : T.surface,
              border: `1px solid ${selDefect === i ? d.color : T.border}`,
              color: selDefect === i ? d.color : T.muted,
              cursor: "pointer", fontWeight: selDefect === i ? 700 : 400,
              fontFamily: "inherit",
            }}>{d.label}</button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          background: dt.color + "11",
          border: `1px solid ${dt.color}44`,
          borderRadius: 10, padding: 14,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: dt.color, marginBottom: 8 }}>
            {dt.label}
          </div>
          <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.8, margin: 0 }}>
            {dt.desc}
          </p>
        </div>

        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Where do the electrons go?
          </div>
          <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, margin: "0 0 10px" }}>
            {dt.electronEffect}
          </p>
          <div style={{ padding: "8px 10px", borderRadius: 8, background: dt.color + "11", border: `1px solid ${dt.color}33` }}>
            <div style={{ fontSize: 11, color: dt.color, fontWeight: 700 }}>Band diagram:</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>{dt.bandNote}</div>
          </div>
        </div>

        <div style={{ background: T.bg, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Defect type comparison
          </div>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Type", "Extra atoms", "Missing atoms", "Effect"].map(h => (
                <th key={h} style={{ fontSize: 10, color: T.muted, textAlign: "left", padding: "3px 6px", borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { type: "V_Cd", extra: "0", missing: "1 (Cd)", effect: "Shallow acceptor, p-type", color: T.eo_gap },
                { type: "Cd_i", extra: "1 (Cd)", missing: "0", effect: "Shallow donor, n-type", color: T.eo_cond },
                { type: "Cd_Te", extra: "0", missing: "0", effect: "Deep mid-gap, SRH killer", color: T.eo_photon },
                { type: "Te_Cd", extra: "0", missing: "0", effect: "Deep donor, compensating", color: T.eo_e },
              ].map(({ type, extra, missing, effect, color }) => (
                <tr key={type}>
                  <td style={{ padding: "5px 6px", color, fontWeight: 700, fontSize: 12 }}>{type}</td>
                  <td style={{ padding: "5px 6px", color: T.muted, fontSize: 11 }}>{extra}</td>
                  <td style={{ padding: "5px 6px", color: T.muted, fontSize: 11 }}>{missing}</td>
                  <td style={{ padding: "5px 6px", color: T.muted, fontSize: 11 }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 8: DEFECT ELECTRONS — How defects create electrons & holes ────
function DefectElectronsSection() {
  const [defect, setDefect] = useState(0); // 0=perfect, 1=V_Cd, 2=Cd_i, 3=Cd_Te
  const [nelDelta, setNelDelta] = useState(0); // NELECT offset from neutral
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const defs = [
    { label: "Perfect Crystal", short: "Perfect", color: T.eo_valence,
      atoms: 64, nelBase: 256, change: 0,
      vbFill: 256, defectE: 0, freeH: 0, freeE: 0,
      defectLevels: [],
      desc: "All 64 atoms on their lattice sites. 32 Cd each donate 2e, 32 Te each contribute 6e = 256 valence electrons. VB completely full, CB completely empty. No free carriers — perfect semiconductor at 0 K.",
      gridNote: "32 Cd (green) + 32 Te (orange) = 64 atoms",
      bandNote: "VB full (256 e⁻) | gap 1.44 eV | CB empty",
    },
    { label: "V_Cd (vacancy)", short: "V_Cd", color: T.eo_gap,
      atoms: 63, nelBase: 254, change: -2,
      vbFill: 249, defectE: 5, freeH: 2, freeE: 0,
      defectLevels: [
        { y: 148, label: "D1", fill: 2, color: T.eo_gap },
        { y: 164, label: "D2", fill: 2, color: T.eo_gap },
        { y: 180, label: "D3", fill: 1, color: T.eo_gap },
        { y: 196, label: "D4", fill: 0, color: T.eo_gap },
      ],
      desc: "Remove 1 Cd atom → lose 2 valence electrons. The 4 neighboring Te atoms each have a broken sp³ bond — these 'dangling bonds' create 4 new energy levels (D1-D4) inside the band gap.",
      gridNote: "63 atoms — one Cd missing, 4 Te neighbors have dangling bonds",
      bandNote: "NELECT = 254 | 2 holes created | p-type! Shallow acceptor.",
    },
    { label: "Cd_i (interstitial)", short: "Cd_i", color: T.eo_cond,
      atoms: 65, nelBase: 258, change: +2,
      vbFill: 256, defectE: 2, freeH: 0, freeE: 2,
      defectLevels: [
        { y: 80, label: "donor", fill: 2, color: T.eo_cond },
      ],
      desc: "Squeeze 1 extra Cd into the lattice → gain 2 extra valence electrons. These don't fit in the VB (already full), so they sit in a shallow donor level just below the CB. Easily thermalized to CB → n-type.",
      gridNote: "65 atoms — 1 extra Cd squeezed between sites",
      bandNote: "NELECT = 258 | 2 extra e⁻ | n-type! Shallow donor.",
    },
    { label: "Cd_Te (antisite)", short: "Cd_Te", color: T.eo_photon,
      atoms: 64, nelBase: 252, change: -4,
      vbFill: 248, defectE: 4, freeH: 4, freeE: 0,
      defectLevels: [
        { y: 145, label: "deep", fill: 2, color: T.eo_photon },
        { y: 170, label: "deep", fill: 2, color: T.eo_photon },
      ],
      desc: "A Cd atom sits on a Te site. The Te site expected 6 valence electrons but Cd only brings 2 → 4 electrons missing. Deep levels appear at mid-gap (VBM + 0.7 eV). These are the 'killer defects' — the most effective recombination centers in CdTe.",
      gridNote: "64 atoms — but Cd on a Te site (wrong atom, wrong electron count)",
      bandNote: "NELECT = 252 | 4 missing e⁻ | Deep mid-gap trap → SRH killer!",
    },
  ];

  const d = defs[defect];
  const baseNel = d.nelBase;
  const nel = baseNel + nelDelta;
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08);

  // ── 8×8 grid atoms ──
  const gridSp = 34, gridOx = 18, gridOy = 18;
  const gridAtoms = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      gridAtoms.push({ r, c, x: gridOx + c * gridSp, y: gridOy + r * gridSp, isCd: (r + c) % 2 === 0 });

  const vacIdx = 27; // row=3, col=3, a Cd site
  const antiIdx = 28; // row=3, col=4, a Te site
  const interX = gridOx + 3.5 * gridSp, interY = gridOy + 3.5 * gridSp;

  // Neighbors of vacancy (Manhattan distance = 1)
  const vacAtom = gridAtoms[vacIdx];
  const isVacNeighbor = (a) => Math.abs(a.r - vacAtom.r) + Math.abs(a.c - vacAtom.c) === 1;

  // ── Band diagram dimensions ──
  const bW = 190, bH = 270;
  const cbY = 40, cbH = 30;
  const vbY = 220, vbH = 30;

  // Extra electrons/holes from NELECT slider
  const extraE = nelDelta > 0 ? nelDelta : 0;
  const extraH = nelDelta < 0 ? -nelDelta : 0;
  const totalFreeE = d.freeE + extraE;
  const totalFreeH = d.freeH + extraH;

  return (
    <div>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {/* ═══ Left: 64-atom supercell grid ═══ */}
      <div style={{ flex: "0 0 auto" }}>
        <svg viewBox="0 0 300 300" style={{ display: "block", borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: 300 }}>
          <rect width={300} height={300} fill={T.bg} rx={10} />

          {/* Bond lines */}
          {gridAtoms.map((a, i) => {
            if (defect === 1 && i === vacIdx) return null;
            const bonds = [];
            if (a.c < 7) {
              const ri = i + 1;
              if (!(defect === 1 && ri === vacIdx))
                bonds.push(<line key={`h${i}`} x1={a.x} y1={a.y} x2={gridAtoms[ri].x} y2={gridAtoms[ri].y} stroke={T.dim} strokeWidth={0.5} opacity={0.3} />);
            }
            if (a.r < 7) {
              const bi = i + 8;
              if (!(defect === 1 && bi === vacIdx))
                bonds.push(<line key={`v${i}`} x1={a.x} y1={a.y} x2={gridAtoms[bi].x} y2={gridAtoms[bi].y} stroke={T.dim} strokeWidth={0.5} opacity={0.3} />);
            }
            return bonds;
          })}

          {/* Atoms */}
          {gridAtoms.map((a, i) => {
            const isVac = defect === 1 && i === vacIdx;
            const isAnti = defect === 3 && i === antiIdx;
            const isNbr = defect === 1 && isVacNeighbor(a);

            if (isVac) {
              return (
                <g key={i}>
                  <circle cx={a.x} cy={a.y} r={10} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.7 + 0.3 * pulse} />
                  <text x={a.x} y={a.y + 3} textAnchor="middle" fill={T.eo_gap} fontSize={7} fontWeight="bold">V</text>
                </g>
              );
            }

            let col = a.isCd ? T.eo_valence : T.eo_hole;
            let sym = a.isCd ? "Cd" : "Te";

            if (isAnti) { col = T.eo_valence; sym = "Cd"; }

            return (
              <g key={i}>
                {isNbr && <circle cx={a.x} cy={a.y} r={13} fill={T.eo_gap + "22"} stroke={T.eo_gap} strokeWidth={1} opacity={pulse} />}
                {isAnti && <circle cx={a.x} cy={a.y} r={13} fill="none" stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.8} />}
                <circle cx={a.x} cy={a.y} r={a.r >= 2 && a.r <= 4 && a.c >= 2 && a.c <= 5 ? 8 : 6}
                  fill={col + "33"} stroke={col} strokeWidth={1} />
                {a.r >= 2 && a.r <= 4 && a.c >= 2 && a.c <= 5 && (
                  <text x={a.x} y={a.y + 3} textAnchor="middle" fill={col} fontSize={6} fontWeight="bold">{sym}</text>
                )}
              </g>
            );
          })}

          {/* Interstitial extra atom */}
          {defect === 2 && (
            <g>
              <circle cx={interX} cy={interY} r={12} fill={T.eo_cond + "22"} stroke={T.eo_cond} strokeWidth={2} opacity={0.3 + 0.7 * pulse} />
              <circle cx={interX} cy={interY} r={9} fill={T.eo_cond + "44"} stroke={T.eo_cond} strokeWidth={1.5} />
              <text x={interX} y={interY + 3} textAnchor="middle" fill={T.eo_cond} fontSize={7} fontWeight="bold">Cd_i</text>
            </g>
          )}

          {/* Antisite label */}
          {defect === 3 && (
            <text x={gridAtoms[antiIdx].x} y={gridAtoms[antiIdx].y - 14} textAnchor="middle" fill={T.eo_photon} fontSize={7} fontWeight="bold">Cd on Te!</text>
          )}

          {/* Dangling bond arrows for vacancy */}
          {defect === 1 && gridAtoms.filter((a, i) => i !== vacIdx && isVacNeighbor(a)).map((a, i) => {
            const dx = vacAtom.x - a.x, dy = vacAtom.y - a.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len, uy = dy / len;
            return (
              <line key={`db${i}`} x1={a.x + ux * 10} y1={a.y + uy * 10} x2={a.x + ux * 22} y2={a.y + uy * 22}
                stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="2 2" opacity={0.5 + 0.5 * pulse} />
            );
          })}

          {/* Electron count overlay */}
          <rect x={4} y={272} width={120} height={24} rx={5} fill={T.panel + "dd"} stroke={T.border} strokeWidth={1} />
          <text x={10} y={288} fill={d.color} fontSize={10} fontWeight="700">
            {d.atoms} atoms | NELECT={nel}
          </text>

          {/* Hole indicators near vacancy */}
          {defect === 1 && totalFreeH > 0 && Array.from({ length: Math.min(totalFreeH, 4) }, (_, i) => {
            const angle = (i / Math.min(totalFreeH, 4)) * Math.PI * 2 + frame * 0.02;
            const hr = 18;
            return (
              <circle key={`hole${i}`} cx={vacAtom.x + hr * Math.cos(angle)} cy={vacAtom.y + hr * Math.sin(angle)}
                r={4} fill="none" stroke={T.eo_hole} strokeWidth={1.5} opacity={0.8} />
            );
          })}

          {/* Electron indicators near interstitial */}
          {defect === 2 && totalFreeE > 0 && Array.from({ length: Math.min(totalFreeE, 4) }, (_, i) => {
            const angle = (i / Math.min(totalFreeE, 4)) * Math.PI * 2 + frame * 0.025;
            const er = 18;
            return (
              <circle key={`elec${i}`} cx={interX + er * Math.cos(angle)} cy={interY + er * Math.sin(angle)}
                r={3} fill={T.eo_e} opacity={0.9} />
            );
          })}
        </svg>

        {/* Defect selector */}
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {defs.map((dd, i) => (
            <button key={i} onClick={() => { setDefect(i); setNelDelta(0); }} style={{
              flex: 1, padding: "6px 2px", fontSize: 10, borderRadius: 6,
              background: defect === i ? dd.color + "22" : T.surface,
              border: `1.5px solid ${defect === i ? dd.color : T.border}`,
              color: defect === i ? dd.color : T.muted,
              cursor: "pointer", fontWeight: defect === i ? 700 : 400, fontFamily: "inherit",
            }}>{dd.short}</button>
          ))}
        </div>
      </div>

      {/* ═══ Middle: Band diagram ═══ */}
      <div style={{ flex: "0 0 auto" }}>
        <svg viewBox={`0 0 ${bW} ${bH}`} style={{ display: "block", borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: bW }}>
          <rect width={bW} height={bH} fill={T.panel} rx={10} />

          {/* CB */}
          <rect x={20} y={cbY} width={bW - 40} height={cbH} rx={4} fill={T.eo_cond + "15"} stroke={T.eo_cond} strokeWidth={1.5} />
          <text x={bW / 2} y={cbY + 18} textAnchor="middle" fill={T.eo_cond} fontSize={10} fontWeight="700">CB (empty)</text>

          {/* VB */}
          <rect x={20} y={vbY} width={bW - 40} height={vbH} rx={4}
            fill={totalFreeH > 0 ? T.eo_valence + "22" : T.eo_valence + "33"} stroke={T.eo_valence} strokeWidth={1.5} />
          <text x={bW / 2} y={vbY + 18} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontWeight="700">
            VB ({Math.max(0, d.vbFill - extraH)}e⁻)
          </text>

          {/* Gap label */}
          <text x={bW - 16} y={(cbY + cbH + vbY) / 2 + 4} textAnchor="middle" fill={T.muted} fontSize={8} transform={`rotate(-90 ${bW - 16} ${(cbY + cbH + vbY) / 2 + 4})`}>
            1.44 eV gap
          </text>

          {/* Defect levels */}
          {d.defectLevels.map((lv, i) => (
            <g key={i}>
              <line x1={35} y1={lv.y} x2={bW - 35} y2={lv.y} stroke={lv.color} strokeWidth={2} />
              <text x={28} y={lv.y + 3} textAnchor="end" fill={lv.color} fontSize={7} fontWeight="600">{lv.label}</text>
              {/* Electrons on level */}
              {Array.from({ length: lv.fill }, (_, j) => (
                <circle key={j} cx={60 + j * 20} cy={lv.y} r={5} fill={T.eo_e} opacity={0.9}>
                  <animate attributeName="cy" values={`${lv.y - 2};${lv.y + 2};${lv.y - 2}`} dur="2s" repeatCount="indefinite" />
                </circle>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 2 - lv.fill }, (_, j) => (
                <circle key={`e${j}`} cx={60 + (lv.fill + j) * 20} cy={lv.y} r={5}
                  fill="none" stroke={T.eo_hole} strokeWidth={1.5} strokeDasharray="2 2" />
              ))}
            </g>
          ))}

          {/* Free electrons in CB */}
          {totalFreeE > 0 && Array.from({ length: Math.min(totalFreeE, 4) }, (_, i) => (
            <circle key={`fe${i}`} cx={40 + i * 22} cy={cbY + cbH / 2} r={5} fill={T.eo_e} opacity={0.9}>
              <animate attributeName="cx" values={`${35 + i * 22};${45 + i * 22};${35 + i * 22}`} dur="1.5s" repeatCount="indefinite" />
            </circle>
          ))}
          {totalFreeE > 0 && (
            <text x={bW / 2} y={cbY - 6} textAnchor="middle" fill={T.eo_e} fontSize={9} fontWeight="700">
              {totalFreeE} free e⁻ (n-type)
            </text>
          )}

          {/* Free holes in VB */}
          {totalFreeH > 0 && Array.from({ length: Math.min(totalFreeH, 4) }, (_, i) => (
            <circle key={`fh${i}`} cx={40 + i * 22} cy={vbY + vbH / 2} r={5}
              fill="none" stroke={T.eo_hole} strokeWidth={2}>
              <animate attributeName="cx" values={`${35 + i * 22};${45 + i * 22};${35 + i * 22}`} dur="1.8s" repeatCount="indefinite" />
            </circle>
          ))}
          {totalFreeH > 0 && (
            <text x={bW / 2} y={vbY + vbH + 14} textAnchor="middle" fill={T.eo_hole} fontSize={9} fontWeight="700">
              {totalFreeH} holes (p-type)
            </text>
          )}

          {/* Arrows showing electron flow */}
          {defect === 1 && (
            <g>
              <line x1={bW / 2 - 15} y1={vbY - 4} x2={bW / 2 - 15} y2={180 + 6} stroke={T.eo_e} strokeWidth={1.5} markerEnd="url(#earrow)" opacity={0.6} />
              <text x={bW / 2 + 10} y={(vbY + 180) / 2} fill={T.eo_e} fontSize={7}>e⁻ fills D levels</text>
            </g>
          )}
          {defect === 2 && (
            <g>
              <line x1={bW / 2} y1={80 - 6} x2={bW / 2} y2={cbY + cbH + 4} stroke={T.eo_e} strokeWidth={1.5} markerEnd="url(#earrow)" opacity={0.6} />
              <text x={bW / 2 + 16} y={(80 + cbY + cbH) / 2} fill={T.eo_e} fontSize={7}>e⁻ to CB</text>
            </g>
          )}
          {defect === 3 && (
            <g>
              <line x1={bW / 2 + 15} y1={cbY + cbH + 4} x2={bW / 2 + 15} y2={145 - 6} stroke={T.eo_e} strokeWidth={1.5} markerEnd="url(#earrow)" opacity={0.4} />
              <line x1={bW / 2 + 15} y1={170 + 6} x2={bW / 2 + 15} y2={vbY - 4} stroke={T.eo_e} strokeWidth={1.5} markerEnd="url(#earrow)" opacity={0.4} />
              <text x={bW / 2 - 20} y={130} fill={T.eo_photon} fontSize={7}>trap!</text>
            </g>
          )}
          <defs>
            <marker id="earrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3z" fill={T.eo_e} />
            </marker>
          </defs>
        </svg>

        {/* NELECT slider */}
        <div style={{ marginTop: 8, padding: "8px 10px", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: bW }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
            <span style={{ color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>NELECT control</span>
            <span style={{ color: d.color, fontWeight: 700, fontFamily: "monospace" }}>{nel}</span>
          </div>
          <input type="range" min={-4} max={4} step={1} value={nelDelta} onChange={e => setNelDelta(+e.target.value)}
            style={{ width: "100%", accentColor: d.color }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted }}>
            <span>−4 (remove e⁻)</span>
            <span style={{ color: d.color, fontWeight: 700 }}>{nelDelta === 0 ? "neutral" : nelDelta > 0 ? `+${nelDelta} e⁻` : `${nelDelta} e⁻`}</span>
            <span>+4 (add e⁻)</span>
          </div>
          {nelDelta !== 0 && (
            <div style={{ marginTop: 6, fontSize: 10, color: T.ink, lineHeight: 1.7, padding: "6px 8px", background: d.color + "08", borderRadius: 6, border: `1px solid ${d.color}22` }}>
              {nelDelta > 0
                ? <span><b>Adding {nelDelta} electrons</b> → extra e⁻ pushed into CB → more n-type. Charge state q = {-nelDelta}. In VASP: set NELECT = {nel}.</span>
                : <span><b>Removing {-nelDelta} electrons</b> → holes created in VB → more p-type. Charge state q = {-nelDelta}. In VASP: set NELECT = {nel}.</span>
              }
            </div>
          )}
        </div>
      </div>

      {/* ═══ Right: Info panel ═══ */}
      <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Description */}
        <div style={{ background: d.color + "11", border: `1px solid ${d.color}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: d.color, marginBottom: 6 }}>{d.label}</div>
          <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.9, margin: 0 }}>{d.desc}</p>
        </div>

        {/* Electron accounting */}
        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            Electron accounting
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 12px", fontFamily: "monospace", fontSize: 12 }}>
            <span style={{ color: T.muted }}>Atoms in cell</span>
            <span style={{ color: T.ink, fontWeight: 700 }}>{d.atoms}</span>
            <span style={{ color: T.muted }}>NELECT (neutral)</span>
            <span style={{ color: d.color, fontWeight: 700 }}>{d.nelBase}</span>
            {d.change !== 0 && <>
              <span style={{ color: T.muted }}>vs. perfect (256)</span>
              <span style={{ color: d.change > 0 ? T.eo_cond : T.eo_gap, fontWeight: 700 }}>{d.change > 0 ? "+" : ""}{d.change} e⁻</span>
            </>}
            <span style={{ color: T.muted }}>NELECT (current)</span>
            <span style={{ color: d.color, fontWeight: 800, fontSize: 14 }}>{nel}</span>
            {nelDelta !== 0 && <>
              <span style={{ color: T.muted }}>Slider offset</span>
              <span style={{ color: nelDelta > 0 ? T.eo_e : T.eo_hole, fontWeight: 700 }}>{nelDelta > 0 ? "+" : ""}{nelDelta} e⁻</span>
            </>}
            <span style={{ color: T.muted }}>Charge state (q)</span>
            <span style={{ color: T.ink, fontWeight: 700 }}>{nelDelta === 0 ? "neutral" : (nelDelta > 0 ? `q = ${-nelDelta}` : `q = +${-nelDelta}`)}</span>
          </div>
        </div>

        {/* Carrier summary */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: `${T.eo_e}08`, border: `1.5px solid ${T.eo_e}33`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.eo_e, fontFamily: "monospace" }}>{totalFreeE}</div>
            <div style={{ fontSize: 10, color: T.eo_e, fontWeight: 600 }}>free electrons</div>
            <div style={{ fontSize: 9, color: T.muted }}>(in CB)</div>
          </div>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: `${T.eo_hole}08`, border: `1.5px solid ${T.eo_hole}33`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.eo_hole, fontFamily: "monospace" }}>{totalFreeH}</div>
            <div style={{ fontSize: 10, color: T.eo_hole, fontWeight: 600 }}>holes</div>
            <div style={{ fontSize: 9, color: T.muted }}>(in VB)</div>
          </div>
          <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, background: `${d.color}08`, border: `1.5px solid ${d.color}33`, textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: d.color, fontFamily: "monospace" }}>
              {totalFreeE > totalFreeH ? "n-type" : totalFreeH > totalFreeE ? "p-type" : "intrinsic"}
            </div>
            <div style={{ fontSize: 10, color: d.color, fontWeight: 600 }}>conductivity</div>
            <div style={{ fontSize: 9, color: T.muted }}>e⁻ − h = {totalFreeE - totalFreeH}</div>
          </div>
        </div>

        {/* What happens physically */}
        <div style={{ background: T.bg, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            What happens physically
          </div>
          {defect === 0 && (
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.9 }}>
              In a perfect 64-atom CdTe crystal, all 256 valence electrons fill the valence band completely. The conduction band is empty. No free carriers means <b>zero conductivity at 0 K</b>. The Fermi level sits at mid-gap.
            </div>
          )}
          {defect === 1 && (
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.9 }}>
              Removing one Cd atom takes away <b>2 electrons</b> (its 5s²). The 4 neighboring Te atoms now have broken bonds — their sp³ orbitals point into the empty site. These "dangling bonds" create D1-D4 levels in the gap. With only 254 electrons but states that could hold 256, <b>2 holes appear</b> in the valence band → <b>p-type</b>. This is why CdTe is naturally p-type!
            </div>
          )}
          {defect === 2 && (
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.9 }}>
              Squeezing an extra Cd into the lattice brings <b>2 extra electrons</b>. The valence band is already full (256 states), so these 2 electrons must go into higher energy states — a shallow donor level just below the CB. At room temperature (kT = 0.026 eV), they easily jump to the CB → <b>n-type</b> conductivity. Cd interstitials <b>compensate</b> the p-type V_Cd.
            </div>
          )}
          {defect === 3 && (
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.9 }}>
              When Cd sits on a Te site, the site expected 6 electrons but only gets 2 → <b>4 electrons missing</b>. Deep levels appear at mid-gap (VBM + 0.7 eV). Electrons from the CB fall into these traps, then recombine with holes in the VB — this is <b>SRH (Shockley-Read-Hall) recombination</b>. The Cd_Te antisite is the #1 efficiency killer in CdTe solar cells.
            </div>
          )}
        </div>

        {/* Comparison table */}
        <div style={{ background: T.surface, borderRadius: 10, padding: 12, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            Defect comparison in 64-atom cell
          </div>
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
            <thead><tr>
              {["", "Perfect", "V_Cd", "Cd_i", "Cd_Te"].map((h, i) => (
                <th key={i} style={{ padding: "4px 6px", textAlign: i === 0 ? "left" : "center", color: defs[i]?.color || T.muted, borderBottom: `1px solid ${T.border}`, fontSize: 10 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { label: "Atoms", vals: ["64", "63", "65", "64"] },
                { label: "NELECT", vals: ["256", "254", "258", "252"] },
                { label: "Δe⁻", vals: ["—", "−2", "+2", "−4"] },
                { label: "Free e⁻", vals: ["0", "0", "2", "0"] },
                { label: "Holes", vals: ["0", "2", "0", "4"] },
                { label: "Type", vals: ["intrinsic", "p-type", "n-type", "deep trap"] },
              ].map(({ label, vals }) => (
                <tr key={label}>
                  <td style={{ padding: "3px 6px", color: T.muted, fontWeight: 600 }}>{label}</td>
                  {vals.map((v, j) => (
                    <td key={j} style={{ padding: "3px 6px", textAlign: "center", color: j === 0 ? T.ink : defs[j].color, fontWeight: v.includes("type") || v.includes("trap") ? 700 : 400 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 9: RECOMBINATION — CdTe ──────────────────────────────────────
function RecombinationSection() {
  const [mode, setMode] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(id);
  }, []);

  const modes = [
    {
      id: "radiative", label: "Radiative", color: T.eo_photon,
      title: "Radiative Recombination",
      desc: "An electron in the conduction band falls directly to the valence band, recombining with a hole. The energy difference is released as a photon (light). This is the fundamental process behind LEDs and lasers.",
      details: [
        "Energy of photon = band gap energy (Eg = 1.44 eV for CdTe → 860 nm near-IR)",
        "In solar cells this represents the ideal energy conversion process",
        "Shockley-Queisser limit for CdTe at 1.44 eV: theoretical max ~32% efficiency",
        "Rate is proportional to n × p (electron and hole concentrations)",
      ],
    },
    {
      id: "nonradiative", label: "Non-Radiative", color: T.eo_gap,
      title: "Non-Radiative Recombination (via Defects)",
      desc: "An electron falls from the conduction band to a defect level in the gap, then from the defect level to the valence band. Energy is released as heat (phonons) instead of light — two small jumps instead of one big one.",
      details: [
        "Two small energy jumps instead of one large jump across the full gap",
        "Energy goes to lattice vibrations (phonons = heat), not photons",
        "Dominant in CdTe — V_Cd and Cd_Te defects provide the trap levels",
        "This is the primary efficiency loss mechanism in CdTe solar cells",
      ],
    },
    {
      id: "srh", label: "SRH Model", color: T.eo_hole,
      title: "Shockley-Read-Hall (SRH) Recombination",
      desc: "The quantitative model for defect-assisted recombination. Step 1: an electron from the CB is captured by the defect trap. Step 2: a hole from the VB is captured (equivalent to the trapped electron falling to VB). The rate depends on defect density, capture cross-section, and trap energy.",
      details: [
        "Carrier lifetime: τ = 1 / (N_t × σ × v_th)",
        "N_t = defect density. CdTe typical: ~10¹⁴ cm⁻³. σ ≈ 10⁻¹⁵ cm². v_th ≈ 10⁷ cm/s",
        "τ = 1/(10¹⁴ × 10⁻¹⁵ × 10⁷) ≈ 10⁻⁶ s = 1 μs (typical CdTe carrier lifetime)",
        "Cd_Te antisite (deep mid-gap at 0.7 eV) is the most effective SRH center",
        "Reducing Cd_Te antisite density is the #1 priority for CdTe solar cell improvement",
      ],
    },
  ];

  const m = modes[mode];
  const p = ((frame * 0.01) % 1);

  return (
    <div>
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />

          {/* Conduction band */}
          <rect x={20} y={30} width={230} height={40} rx={4}
            fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
          <text x={30} y={53} fill={T.eo_cond} fontSize={11} fontWeight="bold">Conduction Band</text>

          {/* Valence band */}
          <rect x={20} y={240} width={230} height={40} rx={4}
            fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
          <text x={30} y={263} fill={T.eo_valence} fontSize={11} fontWeight="bold">Valence Band</text>

          {/* Gap label */}
          <text x={265} y={155} fill={T.muted} fontSize={9} textAnchor="middle">Eg</text>
          <text x={265} y={167} fill={T.muted} fontSize={8} textAnchor="middle">1.44 eV</text>

          {/* Mode 0: Radiative — electron falls CB→VB, photon emitted */}
          {mode === 0 && (() => {
            const ey = p < 0.6 ? lerp(50, 250, p / 0.6) : 250;
            const photonOn = p > 0.55;
            const photonOp = photonOn ? Math.min(1, (p - 0.55) * 4) : 0;
            return (
              <g>
                {/* Downward arrow path */}
                <line x1={140} y1={70} x2={140} y2={240} stroke={T.eo_photon} strokeWidth={1}
                  strokeDasharray="4 4" opacity={0.3} />
                {/* Electron */}
                <circle cx={140} cy={ey} r={6} fill={T.eo_e} />
                <text x={152} y={ey + 4} fill={T.eo_e} fontSize={8}>e⁻</text>
                {/* Hole at VB */}
                {p < 0.55 && (
                  <circle cx={140} cy={250} r={6} fill="none" stroke={T.eo_hole} strokeWidth={2} />
                )}
                {/* Photon emission */}
                <g opacity={photonOp}>
                  <path d="M 155,248 Q 170,238 185,248 Q 200,258 215,248" stroke={T.eo_photon} strokeWidth={2.5} fill="none" />
                  <text x={225} y={248} fill={T.eo_photon} fontSize={11} fontWeight="bold">hν</text>
                  <circle cx={190} cy={245} r={15} fill={T.eo_photon + "18"} />
                </g>
                <text x={140} y={155} textAnchor="middle" fill={T.eo_photon} fontSize={10} fontWeight="bold">
                  E = hν = Eg
                </text>
              </g>
            );
          })()}

          {/* Mode 1: Non-radiative — two-step via defect */}
          {mode === 1 && (() => {
            const trapY = 150;
            const ey = p < 0.35
              ? lerp(50, trapY - 5, p / 0.35)
              : p < 0.5
              ? trapY - 5
              : p < 0.85
              ? lerp(trapY - 5, 250, (p - 0.5) / 0.35)
              : 250;
            const phonon1 = p > 0.3 && p < 0.55;
            const phonon2 = p > 0.8;
            return (
              <g>
                {/* Defect trap level */}
                <line x1={60} y1={trapY} x2={200} y2={trapY}
                  stroke={T.eo_gap} strokeWidth={2.5} />
                <text x={210} y={trapY + 4} fill={T.eo_gap} fontSize={9} fontWeight="bold">trap</text>

                {/* Step arrows */}
                <line x1={120} y1={70} x2={120} y2={trapY} stroke={T.eo_gap} strokeWidth={1}
                  strokeDasharray="3 3" opacity={0.3} />
                <line x1={120} y1={trapY} x2={120} y2={240} stroke={T.eo_gap} strokeWidth={1}
                  strokeDasharray="3 3" opacity={0.3} />

                <text x={105} y={110} fill={T.muted} fontSize={8} textAnchor="end">step 1</text>
                <text x={105} y={200} fill={T.muted} fontSize={8} textAnchor="end">step 2</text>

                {/* Electron */}
                <circle cx={120} cy={ey} r={6} fill={T.eo_e} />

                {/* Phonon 1 */}
                {phonon1 && (
                  <g opacity={0.8}>
                    <path d="M 135,{trapY - 5} Q 150,{trapY - 15} 165,{trapY - 5} Q 180,{trapY + 5} 195,{trapY - 5}"
                      stroke={T.eo_hole} strokeWidth={1.5} fill="none"
                      d={`M 135,${trapY - 5} Q 150,${trapY - 15} 165,${trapY - 5} Q 180,${trapY + 5} 195,${trapY - 5}`} />
                    <text x={200} y={trapY - 8} fill={T.eo_hole} fontSize={8}>phonon</text>
                  </g>
                )}
                {/* Phonon 2 */}
                {phonon2 && (
                  <g opacity={0.8}>
                    <path d={`M 135,248 Q 150,238 165,248 Q 180,258 195,248`}
                      stroke={T.eo_hole} strokeWidth={1.5} fill="none" />
                    <text x={200} y={242} fill={T.eo_hole} fontSize={8}>phonon</text>
                  </g>
                )}

                {/* Labels */}
                <text x={160} y={105} fill={T.eo_gap} fontSize={9}>energy → heat</text>
                <text x={160} y={200} fill={T.eo_gap} fontSize={9}>energy → heat</text>
              </g>
            );
          })()}

          {/* Mode 2: SRH detail */}
          {mode === 2 && (() => {
            const trapY = 150;
            const p1 = ((frame * 0.008) % 1);
            const eCapY = p1 < 0.5 ? lerp(50, trapY, p1 / 0.5) : trapY;
            const hCapY = p1 > 0.5 ? lerp(trapY, 250, (p1 - 0.5) / 0.5) : trapY;
            return (
              <g>
                {/* Defect trap */}
                <line x1={40} y1={trapY} x2={220} y2={trapY}
                  stroke={T.eo_hole} strokeWidth={2.5} />
                <text x={130} y={trapY - 8} textAnchor="middle" fill={T.eo_hole} fontSize={9} fontWeight="bold">
                  Defect Trap (E_t)
                </text>

                {/* Left side: electron capture */}
                <g>
                  <text x={80} y={88} textAnchor="middle" fill={T.eo_e} fontSize={9} fontWeight="bold">
                    Step 1: e⁻ capture
                  </text>
                  <circle cx={80} cy={eCapY} r={5} fill={T.eo_e} />
                  <line x1={80} y1={70} x2={80} y2={trapY} stroke={T.eo_e} strokeWidth={1}
                    strokeDasharray="3 3" opacity={0.4} />
                </g>

                {/* Right side: hole capture (electron drops to VB) */}
                <g>
                  <text x={180} y={188} textAnchor="middle" fill={T.eo_hole} fontSize={9} fontWeight="bold">
                    Step 2: h⁺ capture
                  </text>
                  {p1 > 0.5 && (
                    <circle cx={180} cy={hCapY} r={5} fill={T.eo_e} opacity={0.8} />
                  )}
                  <line x1={180} y1={trapY} x2={180} y2={240} stroke={T.eo_hole} strokeWidth={1}
                    strokeDasharray="3 3" opacity={0.4} />
                  {p1 <= 0.5 && (
                    <circle cx={180} cy={250} r={5} fill="none" stroke={T.eo_hole} strokeWidth={2} />
                  )}
                </g>

                {/* SRH formula */}
                <rect x={30} y={282} width={220} height={28} rx={6} fill={T.surface} stroke={T.border} strokeWidth={1} />
                <text x={140} y={300} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace">
                  τ = 1 / (N_t · σ · v_th)
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {modes.map((md, i) => (
            <button key={i} onClick={() => setMode(i)} style={{
              flex: 1, padding: "7px 4px", fontSize: 11, borderRadius: 7,
              background: mode === i ? md.color + "22" : T.surface,
              border: `1px solid ${mode === i ? md.color : T.border}`,
              color: mode === i ? md.color : T.muted,
              cursor: "pointer", fontWeight: mode === i ? 700 : 400,
              fontFamily: "inherit",
            }}>{md.label}</button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          background: m.color + "11",
          border: `1px solid ${m.color}44`,
          borderRadius: 10, padding: 14,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: m.color, marginBottom: 8 }}>
            {m.title}
          </div>
          <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.8, margin: 0 }}>
            {m.desc}
          </p>
        </div>

        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>Key points</div>
          {m.details.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ color: m.color, fontSize: 12, flex: "0 0 16px", fontWeight: 700 }}>{i + 1}.</div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{ background: T.bg, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Radiative vs Non-radiative
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
            {[
              { label: "Radiative", output: "Photon (light)", note: "Desired for LEDs/lasers", color: T.eo_photon },
              { label: "Non-radiative", output: "Phonon (heat)", note: "Unwanted loss mechanism", color: T.eo_gap },
            ].map(({ label, output, note, color }) => (
              <div key={label} style={{
                padding: "8px 10px", borderRadius: 8,
                background: color + "11", border: `1px solid ${color}33`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Output: {output}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── SECTION 9: DEFECT THERMODYNAMICS ──────────────────────────────────────
function DefectThermoSection() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const [muCd, setMuCd] = useState(-0.5); // chemical potential offset
  const EfVCd = 1.5 + muCd; // V_Cd formation energy (Cd-poor = low, Cd-rich = high)
  const EfCdi = 2.0 - muCd;
  const EfCdTe = 3.5;
  const kB = 8.617e-5; // eV/K
  const Tgrowth = 600; // °C
  const TK = Tgrowth + 273;
  const Nsites = 32; // Cd sites in 64-atom cell
  const concVCd = Math.exp(-EfVCd / (kB * TK));
  const concCdi = Math.exp(-EfCdi / (kB * TK));

  return (
    <div>
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "0 0 320px" }}>
        <svg viewBox="0 0 320 280" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 320 }}>
          <text x={160} y={20} textAnchor="middle" fill={T.ink} fontSize={11} fontWeight="bold">Defect Formation — Thermal Activation</text>

          {/* Energy landscape curve */}
          <path d={`M 20,200 ${Array.from({length: 7}, (_, i) => {
            const x = 30 + i * 42;
            const wellY = 200;
            const barrierY = 200 - Math.max(10, EfVCd * 60);
            return `Q ${x + 10},${wellY} ${x + 21},${barrierY} Q ${x + 32},${wellY} ${x + 42},${wellY}`;
          }).join(" ")}`} fill="none" stroke={T.eo_core} strokeWidth={2} />

          {/* Atoms sitting in wells, vibrating */}
          {Array.from({length: 7}, (_, i) => {
            const x = 51 + i * 42;
            const vibration = Math.sin(frame * 0.1 + i * 2) * 3;
            const isEscaping = i === 3 && Math.sin(frame * 0.015) > 0.7;
            const escapeY = isEscaping ? -Math.abs(Math.sin(frame * 0.015) - 0.7) * 80 : 0;
            return (
              <g key={i}>
                <circle cx={x + vibration} cy={195 + escapeY} r={8}
                  fill={isEscaping ? T.eo_gap + "aa" : T.eo_valence + "aa"}
                  stroke={isEscaping ? T.eo_gap : T.eo_valence} strokeWidth={1} />
                <text x={x + vibration} y={198 + escapeY} textAnchor="middle" fill="#fff" fontSize={7} fontWeight="bold">
                  {i === 3 ? (isEscaping ? "V" : "Cd") : (i % 2 === 0 ? "Cd" : "Te")}
                </text>
              </g>
            );
          })}

          {/* E_f label */}
          <line x1={160} y1={200} x2={160} y2={200 - EfVCd * 60} stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />
          <text x={170} y={200 - EfVCd * 30} fill={T.eo_gap} fontSize={9}>E_f = {EfVCd.toFixed(2)} eV</text>

          {/* Temperature arrow */}
          <text x={160} y={250} textAnchor="middle" fill={T.eo_core} fontSize={10}>T = {Tgrowth}°C — kT = {(kB * TK).toFixed(3)} eV</text>
          <text x={160} y={268} textAnchor="middle" fill={T.muted} fontSize={9}>Higher T → more atoms escape → more defects</text>
        </svg>
      </div>
      <div style={{ flex: "1 1 300px" }}>
        <div style={infoBox(T.eo_core)}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Defect Formation Energy</div>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
            Whether a defect forms depends on its <b>formation energy</b> E_f. Lower E_f → more defects at thermal equilibrium.
            E_f depends on <b>chemical potentials</b> (growth conditions) and the <b>Fermi level</b> (for charged defects).
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Chemical potential slider</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: T.eo_gap, fontWeight: 700 }}>Cd-poor</span>
            <input type="range" min={-1.0} max={0} step={0.05} value={muCd}
              onChange={e => setMuCd(+e.target.value)}
              style={{ flex: 1, accentColor: T.eo_core }} />
            <span style={{ fontSize: 10, color: T.eo_valence, fontWeight: 700 }}>Cd-rich</span>
          </div>
          <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 12, color: T.eo_core }}>
            Δμ_Cd = {muCd.toFixed(2)} eV (from CdTe stability range)
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Formation energies (neutral, E_F at mid-gap)</div>
          {[
            { name: "V_Cd", ef: EfVCd, color: T.eo_gap, note: "Lower in Cd-poor (Te-rich) conditions" },
            { name: "Cd_i", ef: EfCdi, color: T.eo_cond, note: "Lower in Cd-rich conditions" },
            { name: "Cd_Te", ef: EfCdTe, color: T.eo_photon, note: "High E_f → rare, but devastating when present" },
          ].map(d => (
            <div key={d.name} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ width: 40, fontSize: 11, color: d.color, fontWeight: 700 }}>{d.name}</span>
                <div style={{ flex: 1, height: 14, background: T.bg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(0, Math.min(100, d.ef / 4 * 100))}%`, height: "100%", background: d.color + "66", borderRadius: 4, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 11, color: d.color, fontFamily: "monospace", width: 55 }}>{d.ef.toFixed(2)} eV</span>
              </div>
              <div style={{ fontSize: 9, color: T.muted, paddingLeft: 48 }}>{d.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: "1 1 300px" }}>
        <div style={sectionPanel}>
          <div style={labelUpper}>Equilibrium concentration</div>
          <div style={monoStep}>
            <div>c = exp(−E_f / k_B T)</div>
            <div>T_growth = {Tgrowth}°C = {TK} K</div>
            <div>k_B T = {(kB * TK).toFixed(4)} eV</div>
            <div style={{ marginTop: 4 }}><span style={{ color: T.eo_gap }}>V_Cd:</span> c = exp(−{EfVCd.toFixed(2)}/{(kB * TK).toFixed(4)}) = {concVCd.toExponential(2)}</div>
            <div><span style={{ color: T.eo_cond }}>Cd_i:</span> c = exp(−{EfCdi.toFixed(2)}/{(kB * TK).toFixed(4)}) = {concCdi.toExponential(2)}</div>
            <div style={{ color: T.muted, marginTop: 4 }}>Per Cd site. In 64-atom cell ({Nsites} Cd sites):</div>
            <div><span style={{ color: T.eo_gap }}>Expected V_Cd:</span> {(concVCd * Nsites).toExponential(2)} per cell</div>
          </div>
        </div>

        <div style={sectionPanel}>
          <div style={labelUpper}>Key insight: Growth conditions control defects</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
            <b>Cd-poor (Te-rich):</b> V_Cd forms easily (low E_f) → more p-type vacancies → more acceptors → good for solar cells.
            <br /><b>Cd-rich:</b> Cd_i forms easily → more donors → compensates V_Cd → bad for solar cells.
            <br /><b>Optimal:</b> Slightly Cd-poor to maximize V_Cd (desired acceptor) and minimize Cd_i (unwanted donor).
          </div>
        </div>

        <div style={infoBox(T.eo_photon)}>
          <div style={{ fontSize: 11, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>CdCl₂ activation treatment</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Real CdTe solar cells undergo CdCl₂ treatment at ~400°C. Cl substitutes on Te sites (Cl_Te),
            acting as a shallow donor. This modifies the Fermi level, which changes charged defect formation
            energies, and helps passivate grain boundary defects. Record cells achieve ~22% efficiency.
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}

// ── I-V CURVE & SOLAR CELL PERFORMANCE ────────────────────────────────────
function IVCurveSection() {
  const [defects, setDefects] = useState(2);
  const [light, setLight]     = useState(1.0);

  const kT = 0.02585;
  const Jsc0 = 29.5;
  const Jsc  = Math.max(0.1, Jsc0 * light * (1 - defects * 0.015));
  const J0   = 1e-10 * Math.pow(10, defects * 0.35);
  const n    = 1.0 + defects * 0.06;
  const Voc  = n * kT * Math.log(Jsc / J0 + 1);
  const Jcurve = (V) => Math.max(0, Jsc - J0 * (Math.exp(V / (n * kT)) - 1));

  let Pmax = 0, Vmpp = 0, Jmpp = 0;
  for (let i = 0; i <= 1000; i++) {
    const V  = (i / 1000) * Voc;
    const Jv = Jcurve(V);
    const P  = V * Jv;
    if (P > Pmax) { Pmax = P; Vmpp = V; Jmpp = Jv; }
  }
  const FF  = Pmax / (Math.max(0.001, Voc * Jsc));
  const eta = (Pmax / 100) * 100;

  const W = 320, H = 240;
  const mL = 52, mR = 16, mT = 18, mB = 40;
  const pW = W - mL - mR, pH = H - mT - mB;
  const Vmax = 1.1, Jmax = 35;
  const xV = (v) => mL + (v / Vmax) * pW;
  const yJ = (j) => mT + pH * (1 - j / Jmax);

  let ivPath = "", pwPath = "";
  for (let i = 0; i <= 300; i++) {
    const V  = (i / 300) * Math.min(Voc * 1.02, Vmax);
    const Jv = Jcurve(V);
    const p  = mT + pH * (1 - (V * Jv) / (Jmax * Vmax));
    ivPath += (i === 0 ? "M" : "L") + xV(V).toFixed(1) + "," + yJ(Jv).toFixed(1);
    pwPath += (i === 0 ? "M" : "L") + xV(V).toFixed(1) + "," + Math.min(p, mT + pH).toFixed(1);
  }

  return (
    <div style={{ display: "flex", gap: 20, fontFamily: "monospace", color: T.ink }}>
      {/* Left: plot + controls */}
      <div style={{ flexShrink: 0 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, display: "block", width: "100%", maxWidth: W }}>
          {/* Jsc × Voc outer rectangle */}
          <rect x={xV(0)} y={yJ(Jsc)} width={xV(Voc) - xV(0)} height={yJ(0) - yJ(Jsc)} fill={T.eo_e} opacity={0.05} />
          {/* MPP rectangle */}
          <rect x={xV(0)} y={yJ(Jmpp)} width={xV(Vmpp) - xV(0)} height={yJ(0) - yJ(Jmpp)} fill={T.eo_e} opacity={0.14} />

          {/* Axes */}
          <line x1={mL} y1={mT}     x2={mL}     y2={H - mB} stroke={T.border} strokeWidth={1.5} />
          <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke={T.border} strokeWidth={1.5} />

          {/* Power curve */}
          <path d={pwPath} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8} />
          {/* J-V curve */}
          <path d={ivPath} fill="none" stroke={T.eo_e}  strokeWidth={2.5} />

          {/* Voc line */}
          <line x1={xV(Voc)} y1={yJ(0)} x2={xV(Voc)} y2={H - mB} stroke={T.eo_hole} strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={xV(Voc)} y={H - mB + 12} textAnchor="middle" fontSize={8} fill={T.eo_hole}>Voc</text>
          <text x={xV(Voc)} y={H - mB + 22} textAnchor="middle" fontSize={7} fill={T.eo_hole}>{Voc.toFixed(3)} V</text>

          {/* Jsc line */}
          <line x1={mL} y1={yJ(Jsc)} x2={W - mR} y2={yJ(Jsc)} stroke={T.eo_cond} strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={mL - 4} y={yJ(Jsc) + 3} textAnchor="end" fontSize={8} fill={T.eo_cond}>Jsc</text>

          {/* MPP dot + cross-hairs */}
          <line x1={xV(Vmpp)} y1={yJ(Jmpp)} x2={xV(Vmpp)} y2={H - mB} stroke={T.eo_photon} strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
          <line x1={mL}       y1={yJ(Jmpp)} x2={xV(Vmpp)} y2={yJ(Jmpp)} stroke={T.eo_photon} strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
          <circle cx={xV(Vmpp)} cy={yJ(Jmpp)} r={5} fill={T.eo_photon} />
          <text x={xV(Vmpp) + 8} y={yJ(Jmpp) - 4} fontSize={8} fill={T.eo_photon} fontWeight="bold">MPP</text>

          {/* Tick labels */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(v => (
            <text key={v} x={xV(v)} y={H - mB + 12} textAnchor="middle" fontSize={8} fill={T.dim}>{v.toFixed(1)}</text>
          ))}
          {[10, 20, 30].map(j => (
            <g key={j}>
              <line x1={mL - 3} y1={yJ(j)} x2={mL} y2={yJ(j)} stroke={T.dim} strokeWidth={1} />
              <text x={mL - 6} y={yJ(j) + 3} textAnchor="end" fontSize={8} fill={T.dim}>{j}</text>
            </g>
          ))}

          <text x={14} y={mT + pH / 2} textAnchor="middle" fontSize={9} fill={T.muted}
            transform={`rotate(-90,14,${mT + pH / 2})`}>J (mA/cm²)</text>
          <text x={mL + pW / 2} y={H - 2} textAnchor="middle" fontSize={9} fill={T.muted}>Voltage (V)</text>

          {/* Legend */}
          <line x1={mL + 4} y1={mT + 8} x2={mL + 20} y2={mT + 8} stroke={T.eo_e} strokeWidth={2} />
          <text x={mL + 23} y={mT + 11} fontSize={8} fill={T.muted}>J-V</text>
          <line x1={mL + 45} y1={mT + 8} x2={mL + 61} y2={mT + 8} stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={mL + 64} y={mT + 11} fontSize={8} fill={T.muted}>Power</text>
        </svg>

        <div style={{ marginTop: 10, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, marginBottom: 5 }}>
            <b>Defects (V_Cd):</b> <span style={{ color: T.eo_gap }}>{defects}</span>
          </div>
          <input type="range" min={0} max={10} step={1} value={defects}
            onChange={e => setDefects(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ fontSize: 11, marginTop: 8, marginBottom: 5 }}>
            <b>Illumination:</b> <span style={{ color: T.eo_photon }}>{light.toFixed(1)} sun</span>
          </div>
          <input type="range" min={0.1} max={2.0} step={0.1} value={light}
            onChange={e => setLight(+e.target.value)} style={{ width: "100%" }} />
        </div>
      </div>

      {/* Right: metrics + explanation */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
          {[
            { label: "Voc",  value: `${Voc.toFixed(3)} V`,        desc: "Open-circuit voltage",       color: T.eo_hole,   tip: "When no current flows. Set by Fermi-level splitting under illumination. Reduced by recombination at defects (SRH)." },
            { label: "Jsc",  value: `${Jsc.toFixed(1)} mA/cm²`,   desc: "Short-circuit current",      color: T.eo_cond,   tip: "At zero voltage. One absorbed photon → one electron swept to contact. CdTe's direct gap gives Jsc ≈ 30 mA/cm² in just 2 µm." },
            { label: "FF",   value: `${(FF * 100).toFixed(1)}%`,   desc: "Fill Factor",                color: T.eo_e,      tip: "MPP rectangle ÷ (Jsc × Voc) rectangle. Defects and series resistance both reduce FF by rounding the knee of the curve." },
            { label: "η",    value: `${eta.toFixed(1)}%`,          desc: "Efficiency",                 color: T.eo_photon, tip: "η = FF × Voc × Jsc / Pin. Move the defect slider to watch all four metrics fall together as recombination worsens." },
          ].map(m => (
            <div key={m.label} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, borderLeft: `3px solid ${m.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: m.color, fontFamily: "monospace" }}>{m.value}</span>
              </div>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{m.desc}</div>
              <div style={{ fontSize: 10, color: T.dim, lineHeight: 1.5 }}>{m.tip}</div>
            </div>
          ))}
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_e, marginBottom: 10 }}>How to Read a J-V Curve</div>
          {[
            { label: "Left edge → Jsc",  color: T.eo_cond,   text: "The current at V = 0. Every absorbed photon contributes. CdTe's direct 1.44 eV gap means 99% of above-gap photons are absorbed in ~2 µm — giving a high Jsc from a very thin film." },
            { label: "Right edge → Voc", color: T.eo_hole,   text: "The voltage at J = 0. Governed by the diode equation: Voc = nkT/q · ln(Jsc/J₀ + 1). Defects increase J₀ exponentially (SRH), collapsing Voc." },
            { label: "MPP dot",          color: T.eo_photon, text: "Maximum Power Point — where V × J is maximum. Your inverter tracks this point continuously. The shaded rectangle is the actual power delivered." },
            { label: "Fill Factor",      color: T.eo_e,      text: "How 'square' is the J-V curve? A perfect cell has FF ≈ 90%. Defects and contact resistance round the knee, reducing FF and wasting potential power." },
            { label: "Power curve",      color: T.eo_gap,    text: "P = V × J (dashed). Its peak is the MPP. A sharp, tall peak means high FF. A broad, flat peak means resistive losses." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 3, borderRadius: 2, background: item.color, flexShrink: 0, alignSelf: "stretch" }} />
              <div style={{ fontSize: 11, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, color: item.color }}>{item.label}: </span>
                <span style={{ color: T.muted }}>{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: T.eo_photon + "0a", border: `1px solid ${T.eo_photon}33`, borderLeft: `3px solid ${T.eo_photon}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 4 }}>CdTe Record vs. Shockley–Queisser Limit</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
            SQ limit (1.44 eV): η ≈ 32%, Voc ≈ 1.17 V — if every recombination event radiated a photon back out.<br />
            First Solar record (2016): η = 22.1%, Voc = 0.887 V, Jsc = 30.25 mA/cm², FF = 79.4%<br />
            The ~10% gap is almost entirely non-radiative SRH recombination at V_Cd and grain boundaries.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 10: MACRO PROPERTIES — CdTe ──────────────────────────────────
function MacroSection() {
  const [defects, setDefects] = useState(3);
  const totalAtoms = 64;
  const conc = defects / 32; // fraction of Cd sites

  const intrinsicLifetime = 1e-6;  // 1μs for CdTe
  const defectLifetime = intrinsicLifetime / Math.max(1, defects * 5);
  const efficiencyLoss = Math.min(17, defects * 2.5);

  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: "0 0 300px" }}>
        <div style={sectionPanel}>
          <div style={labelUpper}>V_Cd defects in 64-atom CdTe cell</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: T.eo_gap, textAlign: "center", marginBottom: 8 }}>
            {defects}
          </div>
          <input type="range" min={0} max={10} step={1} value={defects}
            onChange={e => setDefects(+e.target.value)}
            style={{ width: "100%", accentColor: T.eo_gap }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.muted, marginTop: 4 }}>
            <span>0 (perfect)</span><span>10 V_Cd</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: T.muted, textAlign: "center" }}>
            {defects}/32 Cd sites = {(conc * 100).toFixed(1)}%
            <br />({64 - defects} atoms, {256 - defects * 2} electrons)
          </div>
        </div>

        <svg viewBox="0 0 280 180" style={{ display: "block", width: "100%", maxWidth: 280 }}>
          <rect width={280} height={180} fill={T.bg} rx={8} />
          {Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isCd = (row + col) % 2 === 0;
            const isDefect = isCd && i < defects * 2;
            const x = 22 + col * 30;
            const y = 14 + row * 20;
            return (
              <g key={i}>
                {isDefect ? (
                  <circle cx={x} cy={y} r={6} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3 2" />
                ) : (
                  <circle cx={x} cy={y} r={isCd ? 5 : 6} fill={isCd ? T.eo_valence + "aa" : T.eo_hole + "aa"} />
                )}
              </g>
            );
          })}
          <text x={140} y={175} textAnchor="middle" fill={T.muted} fontSize={8}>
            64-atom CdTe cell: dashed circles = V_Cd vacancies
          </text>
        </svg>
        <svg viewBox="0 0 280 100" style={{ display: "block", marginTop: 8, width: "100%", maxWidth: 280 }}>
          <rect width={280} height={100} fill={T.bg} rx={8} />
          <text x={140} y={14} textAnchor="middle" fill={T.muted} fontSize={9}>Carrier flow through crystal</text>
          {/* Moving electrons */}
          {Array.from({length: 8}, (_, i) => {
            const speed = 0.8 + (i % 3) * 0.3;
            const x = ((frame * speed + i * 35) % 280);
            const y = 35 + (i % 3) * 22;
            const hitDefect = defects > 0 && i < defects && Math.sin(frame * 0.02 + i) > 0.8;
            return (
              <g key={i}>
                {!hitDefect && <circle cx={x} cy={y} r={4} fill={T.eo_e} opacity={0.7} />}
                {hitDefect && <circle cx={x} cy={y} r={6} fill={T.eo_gap} opacity={0.5 + 0.3 * Math.sin(frame * 0.1)} />}
              </g>
            );
          })}
          {/* Defect traps */}
          {Array.from({length: Math.min(defects, 5)}, (_, i) => (
            <g key={`trap${i}`}>
              <circle cx={50 + i * 50} cy={55} r={8} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="3,2" />
              <text x={50 + i * 50} y={58} textAnchor="middle" fill={T.eo_gap} fontSize={7}>V</text>
            </g>
          ))}
          <text x={140} y={92} textAnchor="middle" fill={T.muted} fontSize={8}>
            {defects === 0 ? "No traps — all carriers reach contacts" : `${defects} traps capturing carriers — reduced lifetime`}
          </text>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            title: "Carrier Lifetime (τ)",
            icon: "⏱️",
            value: defects === 0 ? "~1 μs" : `~${(defectLifetime * 1e6).toFixed(1)} ns`,
            detail: defects === 0
              ? "No traps. Maximum radiative lifetime (~1 μs for CdTe)."
              : `SRH at ${defects} V_Cd traps. τ = ${(defectLifetime * 1e9).toFixed(0)} ns (reduced ${Math.round(intrinsicLifetime / defectLifetime)}×)`,
            color: T.eo_hole,
            change: defects === 0 ? "none" : "BAD",
          },
          {
            title: "Solar Cell Efficiency",
            icon: "☀️",
            value: defects === 0 ? "~32%" : `~${Math.max(8, 32 - efficiencyLoss).toFixed(0)}%`,
            detail: defects === 0
              ? "Shockley-Queisser limit for 1.44 eV. Record CdTe: 22.1% (First Solar)."
              : `−${efficiencyLoss.toFixed(0)}% points. Carriers recombine at traps before reaching contacts.`,
            color: T.eo_photon,
            change: defects === 0 ? "none" : "BAD",
          },
          {
            title: "Absorption Coefficient",
            icon: "🔆",
            value: "~10⁵ cm⁻¹",
            detail: "CdTe's direct gap means 99% absorption in ~2 μm. 100× thinner than Si (indirect gap, ~200 μm). Defects barely affect absorption.",
            color: T.eo_cond,
            change: "none",
          },
          {
            title: "p-type Doping (V_Cd)",
            icon: "⚡",
            value: defects === 0 ? "Intrinsic" : `${defects * 2} holes`,
            detail: defects === 0
              ? "No acceptors. Intrinsic carrier density ~ 10⁶ cm⁻³."
              : `Each V_Cd⁻² contributes 2 holes. ${defects}× V_Cd = ${defects * 2} holes. p-type conductivity.`,
            color: T.eo_gap,
            change: defects === 0 ? "none" : "HUGE",
          },
          {
            title: "Lattice Constant",
            icon: "📏",
            value: defects === 0 ? "a = 6.480 Å" : `a ≈ ${(6.48 - defects * 0.002).toFixed(3)} Å`,
            detail: defects === 0
              ? "Perfect CdTe zincblende: a = 6.48 Å."
              : `Local relaxation near V_Cd: neighbors move inward ~0.05 Å. Average a change: ${(defects * 0.002).toFixed(3)} Å (tiny).`,
            color: T.muted,
            change: defects > 3 ? "BAD" : "none",
          },
        ].map(({ title, icon, value, detail, color, change }) => (
          <div key={title} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: "10px 12px", borderRadius: 8,
            background: change !== "none" ? color + "11" : T.surface,
            border: `1px solid ${change !== "none" ? color + "44" : T.border}`,
          }}>
            <div style={{ fontSize: 18, flex: "0 0 24px", marginTop: 2 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: change !== "none" ? color : T.ink }}>{title}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: change !== "none" ? color : T.muted, fontFamily: "monospace" }}>
                  {value}
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>{detail}</div>
            </div>
          </div>
        ))}

        <div style={{
          padding: "10px 14px", borderRadius: 8,
          background: T.eo_gap + "11", border: `1px solid ${T.eo_gap}44`,
        }}>
          <div style={{ fontSize: 11, color: T.eo_gap, fontWeight: 700, marginBottom: 4 }}>CdTe solar cell: The defect balancing act</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
            V_Cd is both helpful (p-type doping) and harmful (SRH recombination center).<br />
            Too few V_Cd → not enough carriers → low current.<br />
            Too many V_Cd → short lifetime → carriers die before reaching contacts → low voltage.<br />
            Optimal: moderate V_Cd + CdCl₂ treatment to passivate grain boundaries.
          </div>
        </div>

      </div>
    </div>

        <div style={{
          background: `${T.eo_hole}11`, border: `1px solid ${T.eo_hole}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6, marginTop: 10,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_hole, marginBottom: 4 }}>Full Picture {"\u2192"}</div>
          <div style={{ color: T.ink }}>From individual Cd and Te atoms, through crystal bonding, band structure, and defect physics, to a working solar cell — every property traces back to the quantum mechanics of electrons. The challenge of CdTe photovoltaics is managing defects: enough V_Cd for p-type doping, but not so many that recombination kills the device.</div>
        </div>
    </div>
  );
}

// ── SECTION 11: CdTe SOLAR CELL DEVICE ANIMATION ──────────────────────────
function SolarCellDeviceSection() {
  const [frame, setFrame] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showPhotons, setShowPhotons] = useState(true);
  const [sunIntensity, setSunIntensity] = useState(1.0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(id);
  }, []);

  // Device layer stack (top to bottom as rendered)
  const layers = [
    {
      id: "glass",
      name: "Glass Substrate",
      formula: "SiO\u2082 (soda-lime glass)",
      thickness: "~3 mm",
      color: "#b8d4e8",
      h: 30,
      role: "Structural support and environmental protection",
      detail: "Transparent soda-lime glass lets sunlight through while protecting the cell from moisture, oxygen, and mechanical damage. Must have low iron content to maximize transmission in the solar spectrum.",
      bandgap: "~9 eV (fully transparent)",
      iconColor: T.eo_cond,
    },
    {
      id: "tco",
      name: "TCO (Front Contact)",
      formula: "SnO\u2082:F (FTO) or ITO",
      thickness: "~200-500 nm",
      color: "#7ec8e3",
      h: 22,
      role: "Transparent conducting oxide \u2014 lets light in, collects electrons",
      detail: "Fluorine-doped tin oxide (FTO) or indium tin oxide (ITO). Must be simultaneously transparent (Eg > 3.5 eV) and conductive (\u03C1 ~ 10\u207B\u2074 \u03A9\u00B7cm). Acts as the n-side contact, collecting photogenerated electrons from the CdS window layer.",
      bandgap: "~3.6 eV",
      iconColor: T.eo_e,
    },
    {
      id: "cds",
      name: "CdS Window Layer",
      formula: "CdS (n-type)",
      thickness: "~50-80 nm",
      color: "#f5d76e",
      h: 18,
      role: "n-type partner for the p-n junction \u2014 forms the heterojunction with CdTe",
      detail: "Cadmium sulfide is an n-type semiconductor (Eg = 2.4 eV). It forms the p-n heterojunction with CdTe. Must be thin enough to minimize parasitic absorption (photons absorbed here are lost). Deposited by chemical bath deposition (CBD). The CdS/CdTe interface is where the built-in electric field is strongest.",
      bandgap: "2.4 eV (absorbs blue/UV, transparent to red/IR)",
      iconColor: T.eo_photon,
    },
    {
      id: "cdte",
      name: "CdTe Absorber",
      formula: "CdTe (p-type)",
      thickness: "~2-8 \u03BCm",
      color: "#4a6741",
      h: 80,
      role: "Absorbs sunlight and generates electron-hole pairs \u2014 the heart of the cell",
      detail: "The main absorber layer. CdTe has a direct bandgap of 1.44 eV \u2014 nearly optimal for solar energy conversion (Shockley-Queisser limit: 32.1%). Its enormous absorption coefficient (\u03B1 > 10\u2075 cm\u207B\u00B9) means 99% of above-gap photons are absorbed in just 2 \u03BCm. p-type doping comes from native V_Cd vacancies. After deposition, CdCl\u2082 treatment at ~400\u00B0C recrystallizes grains and passivates grain boundary defects.",
      bandgap: "1.44 eV (absorbs visible + near-IR)",
      iconColor: T.eo_valence,
    },
    {
      id: "znte",
      name: "ZnTe Back Buffer",
      formula: "ZnTe:Cu (p\u207A-type)",
      thickness: "~50-100 nm",
      color: "#8b6fae",
      h: 20,
      role: "Reduces back-contact barrier \u2014 prevents voltage loss at the rear",
      detail: "ZnTe (Eg = 2.26 eV) doped with Cu creates a p\u207A layer that reduces the Schottky barrier between CdTe and the metal back contact. Without it, a blocking contact forms that opposes current flow (rollover in J-V curves). The Cu diffuses slightly into CdTe, creating beneficial Cu_Cd shallow acceptors near the back surface. Too much Cu causes deep traps \u2014 careful control is essential.",
      bandgap: "2.26 eV",
      iconColor: T.eo_core,
    },
    {
      id: "metal",
      name: "Metal Back Contact",
      formula: "Mo, Ni, or Au",
      thickness: "~100-500 nm",
      color: "#8c8c8c",
      h: 24,
      role: "Collects holes and provides rear electrical contact",
      detail: "A metal film (typically Mo, Ni, or Au) sputtered onto the ZnTe layer. Collects holes from the CdTe absorber. Must form an ohmic (non-blocking) contact with low resistance. Molybdenum is common in production cells due to its work function match and stability. The entire device is typically deposited in superstrate configuration: light enters through the glass.",
      bandgap: "Metal (no gap)",
      iconColor: T.muted,
    },
  ];

  const svgW = 520, svgH = 380;
  const stackX = 60, stackW = 200;
  let stackY = 30;

  // Pre-calculate layer positions
  const layerPositions = layers.map(l => {
    const y = stackY;
    stackY += l.h;
    return { ...l, y, yMid: y + l.h / 2 };
  });
  const totalH = stackY;

  // Photon paths (from sun down into layers)
  const photons = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: stackX + 30 + (i % 5) * 35,
      speed: 0.6 + (i % 3) * 0.25,
      delay: i * 18,
      absorbed: i < 9, // most get absorbed in CdTe
      absorbLayer: i < 1 ? 2 : 3, // first one in CdS, rest in CdTe
      color: ["#ffdd44", "#ffaa22", "#ff8833", "#ffcc00", "#ffe066"][i % 5],
    }));
  }, []);

  // Electron-hole pairs generated
  const carriers = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      baseX: stackX + 40 + (i % 4) * 40,
    }));
  }, []);

  const sel = selectedLayer !== null ? layerPositions.find(l => l.id === selectedLayer) : null;

  return (
    <div>
      <div style={{ display: "flex", gap: 20 }}>
        {/* SVG Animation */}
        <div style={{ flex: "0 0 auto" }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: svgW }}>
            <defs>
              <linearGradient id="sunGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff7cc" />
                <stop offset="100%" stopColor={T.bg} />
              </linearGradient>
              <filter id="photonGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Sun glow at top */}
            <rect x={stackX} y={0} width={stackW} height={28} fill="url(#sunGlow)" rx={4} />
            <text x={stackX + stackW / 2} y={16} textAnchor="middle" fontSize={11} fill="#b8860b" fontWeight={700}>
              {"\u2600\uFE0F"} Sunlight (AM1.5)
            </text>

            {/* Sun rays coming down */}
            {showPhotons && photons.map(p => {
              const cycleLen = 120;
              const t = ((frame * p.speed + p.delay) % cycleLen) / cycleLen;
              const absY = layerPositions[p.absorbLayer].y + layerPositions[p.absorbLayer].h * 0.5;
              const startY = 20;
              const endY = p.absorbed ? absY : totalH + 10;
              const y = startY + t * (endY - startY);
              const opacity = sunIntensity * (p.absorbed && y > absY - 5 ? Math.max(0, 1 - (y - absY + 5) / 8) : 0.8);

              if (y > endY) return null;
              return (
                <g key={`ph${p.id}`} filter="url(#photonGlow)">
                  <line x1={p.x} y1={y - 8} x2={p.x} y2={y} stroke={p.color} strokeWidth={2} opacity={opacity * 0.7} />
                  <circle cx={p.x} cy={y} r={2.5} fill={p.color} opacity={opacity} />
                </g>
              );
            })}

            {/* Layer stack */}
            {layerPositions.map((l, i) => {
              const isSelected = selectedLayer === l.id;
              const hoverScale = isSelected ? 2 : 0;
              return (
                <g key={l.id} onClick={() => setSelectedLayer(selectedLayer === l.id ? null : l.id)} style={{ cursor: "pointer" }}>
                  <rect x={stackX - hoverScale} y={l.y} width={stackW + hoverScale * 2} height={l.h}
                    fill={l.color} opacity={isSelected ? 0.95 : 0.75}
                    stroke={isSelected ? T.ink : l.color} strokeWidth={isSelected ? 2 : 0.5}
                    rx={i === 0 ? 6 : i === layers.length - 1 ? 0 : 0}
                  />
                  {/* Layer label inside */}
                  <text x={stackX + stackW / 2} y={l.yMid + (l.h > 30 ? -6 : 4)} textAnchor="middle"
                    fontSize={l.h > 30 ? 12 : 9} fontWeight={700} fill="#fff"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                    {l.name}
                  </text>
                  {l.h > 30 && (
                    <text x={stackX + stackW / 2} y={l.yMid + 10} textAnchor="middle"
                      fontSize={9} fill="#ffffffcc"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
                      {l.thickness}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Electron-hole pair generation in CdTe */}
            {showPhotons && carriers.map(c => {
              const cdteLayer = layerPositions[3]; // CdTe
              const cycleLen = 100;
              const t = ((frame * 0.5 + c.id * 25) % cycleLen) / cycleLen;

              // Electron moves UP (toward CdS/TCO)
              const eStartY = cdteLayer.y + cdteLayer.h * 0.4;
              const eEndY = layerPositions[1].yMid; // to TCO
              const eY = eStartY + t * (eEndY - eStartY);
              const eOpacity = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 0.8;

              // Hole moves DOWN (toward ZnTe/metal)
              const hStartY = cdteLayer.y + cdteLayer.h * 0.5;
              const hEndY = layerPositions[5].yMid; // to metal
              const hY = hStartY + t * (hEndY - hStartY);

              return (
                <g key={`carrier${c.id}`}>
                  {/* Electron (blue, moves up) */}
                  <circle cx={c.baseX - 6} cy={eY} r={3.5}
                    fill={T.eo_e} opacity={eOpacity * sunIntensity} />
                  {t < 0.15 && (
                    <text x={c.baseX - 6} y={eY + 1.5} textAnchor="middle" fontSize={5} fill="#fff" fontWeight={700}>e</text>
                  )}
                  {/* Hole (orange, moves down) */}
                  <circle cx={c.baseX + 6} cy={hY} r={3.5}
                    fill={T.eo_hole} opacity={eOpacity * sunIntensity} />
                  {t < 0.15 && (
                    <text x={c.baseX + 6} y={hY + 1.5} textAnchor="middle" fontSize={5} fill="#fff" fontWeight={700}>h</text>
                  )}
                </g>
              );
            })}

            {/* Current flow arrows on sides */}
            <g opacity={sunIntensity * 0.7}>
              {/* Electron current (up on left) */}
              <line x1={stackX - 20} y1={layerPositions[3].yMid} x2={stackX - 20} y2={layerPositions[1].y}
                stroke={T.eo_e} strokeWidth={2} markerEnd="url(#arrowBlue)" />
              <text x={stackX - 34} y={layerPositions[2].yMid + 4} fontSize={8} fill={T.eo_e} textAnchor="middle"
                transform={`rotate(-90,${stackX - 34},${layerPositions[2].yMid})`}>
                e{"\u207B"} current
              </text>

              {/* Hole current (down on right) */}
              <line x1={stackX + stackW + 20} y1={layerPositions[3].yMid} x2={stackX + stackW + 20} y2={layerPositions[5].y + layerPositions[5].h}
                stroke={T.eo_hole} strokeWidth={2} />
              <text x={stackX + stackW + 34} y={layerPositions[4].yMid} fontSize={8} fill={T.eo_hole} textAnchor="middle"
                transform={`rotate(90,${stackX + stackW + 34},${layerPositions[4].yMid})`}>
                h{"\u207A"} current
              </text>
            </g>

            {/* Band diagram on the right side */}
            {(() => {
              const bx = 310, bw = 190, bh = 200, by = 40;
              const bandLayers = [
                { name: "TCO", w: 25, ecTop: 0.15, evBot: 0.85, color: "#7ec8e3" },
                { name: "CdS", w: 30, ecTop: 0.22, evBot: 0.70, color: "#f5d76e" },
                { name: "CdTe", w: 90, ecTop: 0.35, evBot: 0.55, color: "#4a6741" },
                { name: "ZnTe", w: 25, ecTop: 0.25, evBot: 0.68, color: "#8b6fae" },
                { name: "Metal", w: 20, ecTop: 0.45, evBot: 0.45, color: "#8c8c8c" },
              ];
              let bxOff = 0;
              return (
                <g>
                  <text x={bx + bw / 2} y={by - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={T.ink}>
                    Band Diagram
                  </text>
                  <rect x={bx} y={by} width={bw} height={bh} fill={T.surface} stroke={T.border} strokeWidth={1} rx={4} />

                  {bandLayers.map((bl, i) => {
                    const x0 = bx + bxOff;
                    bxOff += bl.w;
                    const ecY = by + bl.ecTop * bh;
                    const evY = by + bl.evBot * bh;
                    const nextBl = bandLayers[i + 1];
                    const nextX = x0 + bl.w;
                    return (
                      <g key={bl.name}>
                        {/* Conduction band */}
                        <line x1={x0} y1={ecY} x2={x0 + bl.w} y2={ecY}
                          stroke={T.eo_e} strokeWidth={2} />
                        {/* Valence band */}
                        <line x1={x0} y1={evY} x2={x0 + bl.w} y2={evY}
                          stroke={T.eo_hole} strokeWidth={2} />
                        {/* Band gap fill */}
                        <rect x={x0} y={ecY} width={bl.w} height={evY - ecY}
                          fill={bl.color} opacity={0.15} />
                        {/* Interface lines to next layer */}
                        {nextBl && (
                          <>
                            <line x1={nextX} y1={ecY} x2={nextX} y2={by + nextBl.ecTop * bh}
                              stroke={T.eo_e} strokeWidth={1} strokeDasharray="2,2" />
                            <line x1={nextX} y1={evY} x2={nextX} y2={by + nextBl.evBot * bh}
                              stroke={T.eo_hole} strokeWidth={1} strokeDasharray="2,2" />
                          </>
                        )}
                        {/* Label */}
                        <text x={x0 + bl.w / 2} y={by + bh + 14} textAnchor="middle"
                          fontSize={7} fill={T.muted} fontWeight={600}>{bl.name}</text>
                      </g>
                    );
                  })}

                  {/* E_c / E_v labels */}
                  <text x={bx - 4} y={by + 0.2 * bh} textAnchor="end" fontSize={8} fill={T.eo_e}>E_c</text>
                  <text x={bx - 4} y={by + 0.75 * bh} textAnchor="end" fontSize={8} fill={T.eo_hole}>E_v</text>

                  {/* Electron flow arrow in band diagram */}
                  <path d={`M${bx + 120},${by + 0.38 * bh} L${bx + 40},${by + 0.18 * bh}`}
                    stroke={T.eo_e} strokeWidth={1.5} fill="none" markerEnd="url(#arrowBand)" opacity={0.6} />
                  <text x={bx + 75} y={by + 0.24 * bh} fontSize={7} fill={T.eo_e} textAnchor="middle">e{"\u207B"}</text>

                  <path d={`M${bx + 80},${by + 0.58 * bh} L${bx + 155},${by + 0.7 * bh}`}
                    stroke={T.eo_hole} strokeWidth={1.5} fill="none" opacity={0.6} />
                  <text x={bx + 125} y={by + 0.68 * bh} fontSize={7} fill={T.eo_hole} textAnchor="middle">h{"\u207A"}</text>

                  {/* Junction label */}
                  <line x1={bx + 55} y1={by + 5} x2={bx + 55} y2={by + bh - 5}
                    stroke={T.eo_gap} strokeWidth={0.8} strokeDasharray="3,3" opacity={0.5} />
                  <text x={bx + 55} y={by + bh - 8} textAnchor="middle" fontSize={7} fill={T.eo_gap}>p-n</text>
                </g>
              );
            })()}

            {/* External circuit */}
            <g opacity={sunIntensity * 0.6}>
              <path d={`M${stackX - 20},${layerPositions[1].y} L${stackX - 20},${totalH + 25} L${stackX + stackW + 20},${totalH + 25} L${stackX + stackW + 20},${layerPositions[5].y + layerPositions[5].h}`}
                fill="none" stroke={T.muted} strokeWidth={1.5} strokeDasharray="4,3" />
              <rect x={stackX + stackW / 2 - 24} y={totalH + 16} width={48} height={18} rx={4}
                fill={T.surface} stroke={T.muted} strokeWidth={1} />
              <text x={stackX + stackW / 2} y={totalH + 28} textAnchor="middle" fontSize={8} fill={T.muted} fontWeight={600}>
                Load
              </text>
            </g>
          </svg>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
            <label style={{ fontSize: 11, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
              <input type="checkbox" checked={showPhotons} onChange={e => setShowPhotons(e.target.checked)} />
              Photons
            </label>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 2 }}>Sun intensity</div>
              <input type="range" min={0} max={1} step={0.05} value={sunIntensity}
                onChange={e => setSunIntensity(+e.target.value)}
                style={{ width: "100%", accentColor: "#b8860b" }} />
            </div>
          </div>
        </div>

        {/* Right panel: layer details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={infoBox(T.eo_photon)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.eo_photon, marginBottom: 4 }}>CdTe Thin-Film Solar Cell</div>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>
              Click any layer in the device stack to see its function. Photons enter from the top (glass side),
              get absorbed in CdTe, and generate electron-hole pairs separated by the built-in p-n junction field.
            </div>
          </div>

          {/* Layer cards */}
          {sel ? (
            <div style={{
              background: T.surface, borderRadius: 10, padding: 16,
              border: `2px solid ${sel.iconColor}44`,
            }}>
              <button onClick={() => setSelectedLayer(null)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 6, fontSize: 11,
                background: T.bg, border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer", fontFamily: "inherit",
                marginBottom: 12,
              }}>
                ← Back to all layers
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: sel.color, opacity: 0.9,
                  border: `2px solid ${sel.iconColor}`,
                }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: sel.iconColor }}>{sel.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{sel.formula} | {sel.thickness}</div>
                </div>
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: sel.iconColor,
                marginBottom: 6, padding: "4px 10px", borderRadius: 6,
                background: sel.iconColor + "11", border: `1px solid ${sel.iconColor}22`,
                display: "inline-block",
              }}>
                {sel.role}
              </div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, marginTop: 8 }}>
                {sel.detail}
              </div>
              <div style={{
                marginTop: 10, fontSize: 11, color: T.muted,
                fontFamily: "monospace", padding: "6px 10px",
                background: T.bg, borderRadius: 6,
              }}>
                Bandgap: {sel.bandgap}
              </div>
            </div>
          ) : (
            <div style={sectionPanel}>
              <div style={labelUpper}>Device Layer Stack (click to explore)</div>
              {layerPositions.map(l => (
                <div key={l.id} onClick={() => setSelectedLayer(l.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
                  marginBottom: 4, borderRadius: 6, cursor: "pointer",
                  background: T.bg, border: `1px solid ${T.border}`,
                  transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 3,
                    background: l.color, opacity: 0.85, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{l.name}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{l.formula} | {l.thickness}</div>
                  </div>
                  <div style={{ fontSize: 9, color: l.iconColor, fontWeight: 600, maxWidth: 120, textAlign: "right" }}>
                    {l.role.split("\u2014")[0]}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key physics summary */}
          <div style={sectionPanel}>
            <div style={labelUpper}>How it works</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
              {[
                { step: "1", text: "Sunlight passes through glass and TCO into the cell", color: "#b8860b" },
                { step: "2", text: "CdS window: thin n-type layer forms the p-n junction with CdTe", color: T.eo_photon },
                { step: "3", text: "CdTe absorber: photons create electron-hole pairs (E_photon > 1.44 eV)", color: T.eo_valence },
                { step: "4", text: "Built-in field separates carriers: e\u207B \u2192 CdS/TCO, h\u207A \u2192 ZnTe/metal", color: T.eo_e },
                { step: "5", text: "ZnTe buffer prevents back-contact barrier (Schottky barrier)", color: T.eo_core },
                { step: "6", text: "External circuit: electrons flow through load, recombine with holes", color: T.muted },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: s.color + "22", border: `1px solid ${s.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 800, color: s.color,
                  }}>{s.step}</div>
                  <div style={{ fontSize: 11, color: T.ink }}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Record efficiency box */}
          <div style={{
            padding: "10px 14px", borderRadius: 8,
            background: T.eo_photon + "11", border: `1px solid ${T.eo_photon}44`,
          }}>
            <div style={{ fontSize: 11, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Record Efficiency</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
              <b style={{ color: T.eo_photon }}>22.1%</b> (First Solar, NREL certified) vs. Shockley-Queisser limit of 32.1% for 1.44 eV.<br />
              <b>Key loss:</b> V_Cd recombination + CdS parasitic absorption + back-contact barrier.<br />
              <b>CdCl{"\u2082"} treatment</b> at ~400{"\u00B0"}C is the critical activation step {"\u2014"} recrystallizes CdTe grains, passivates grain boundaries, and enables {">"}20% efficiency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CdTe Example Module (wraps all CdTe-specific sections) ───────────────
const CDTE_SUBSECTIONS = [
  { id: "atom",    label: "Cd & Te Atoms",    icon: "⚛️",  color: T.eo_core,    Component: AtomSection },
  { id: "crystal", label: "Crystal & sp³",    icon: "💎",  color: T.eo_valence, Component: CrystalSection },
  { id: "bonds",   label: "Bond Nature",      icon: "🔗",  color: T.eo_valence, Component: BondNatureSection },
  { id: "bands",   label: "Energy Bands",     icon: "📊",  color: T.eo_cond,    Component: BandSection },
  { id: "config",  label: "Defect Types",     icon: "🔧",  color: T.eo_e,       Component: DefectConfigSection },
  { id: "defect",  label: "Defect States",    icon: "🕳️",  color: T.eo_gap,     Component: DefectSection },
  { id: "defect_e",label: "Defect Electrons", icon: "⚡",  color: T.eo_cond,    Component: DefectElectronsSection },
  { id: "recomb",  label: "Recombination",    icon: "💡",  color: T.eo_photon,  Component: RecombinationSection },
  { id: "thermo",  label: "Defect Thermo",    icon: "🌡️",  color: T.eo_core,    Component: DefectThermoSection },
  { id: "macro",   label: "CdTe Solar Cell",  icon: "☀️",  color: T.eo_hole,    Component: MacroSection },
  { id: "device",  label: "Device Animation", icon: "🎬",  color: T.eo_photon,  Component: SolarCellDeviceSection },
];

function CdTeExampleModule() {
  const [active, setActive] = useState("atom");
  const sec = CDTE_SUBSECTIONS.find(s => s.id === active);
  const { Component } = sec;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Sub-navigation tabs */}
      <div style={{
        display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16,
        padding: "8px 12px", background: T.panel, borderRadius: 10,
        border: `1px solid ${T.border}`,
      }}>
        {CDTE_SUBSECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 11,
            border: `1px solid ${active === s.id ? s.color : T.border}`,
            background: active === s.id ? s.color + "22" : T.bg,
            color: active === s.id ? s.color : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
            display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Active sub-section */}
      <Component />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQAccordion (local copy for this file)
// ═══════════════════════════════════════════════════════════════════════════
function FAQAccordion({ title, color, isOpen, onClick, children }) {
  return (
    <div style={{ borderRadius: 12, border: `1.5px solid ${isOpen ? color : T.border}`, overflow: "hidden", transition: "all 0.2s" }}>
      <button onClick={onClick} style={{ width: "100%", padding: "12px 16px", background: isOpen ? color + "12" : T.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", textAlign: "left" }}>
        <span style={{ fontSize: 16, color: isOpen ? color : T.muted, fontWeight: 700, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? color : T.ink, flex: 1 }}>{title}</span>
        {isOpen && <span style={{ fontSize: 10, color, fontWeight: 600, padding: "2px 8px", background: color + "15", borderRadius: 6 }}>OPEN</span>}
      </button>
      {isOpen && <div style={{ padding: "14px 18px", borderTop: `1px solid ${color}20`, background: T.surface }}>{children}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CdTe SOLAR CELL MANUFACTURING — Step-by-step animated process
// ═══════════════════════════════════════════════════════════════════════════
function CdTeManufacturingSection() {
  const [openItem, setOpenItem] = useState("mfg_overview");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [mfgStep, setMfgStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  const mb = { fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, background: T.surface, borderRadius: 10, padding: "14px 18px", border: `1px solid ${T.border}40`, marginBottom: 10 };

  const mfgSteps = [
    { title: "Step 1: Glass Substrate Preparation", icon: "🪟", color: T.eo_cond,
      analogy: "Like cleaning a window before painting — any dust particle on the glass creates a pinhole in the solar cell. Substrates are cleaned with detergent, DI water, and UV-ozone to remove organics. The glass must be optically transparent (soda-lime or aluminosilicate, 2-3 mm thick).",
      details: "Soda-lime glass is cheap but Na diffusion can dope CdTe. Aluminosilicate (more expensive) avoids this. Substrate size: 60×120 cm² for production, 2.5×2.5 cm² for lab. Cleaning: ultrasonic in acetone → IPA → DI water → UV-ozone 15 min.",
      params: "Glass thickness: 2-3 mm | Transmittance: >90% at 400-850 nm | Roughness: <1 nm RMS" },
    { title: "Step 2: TCO Deposition (Front Contact)", icon: "⚡", color: "#22c55e",
      analogy: "Like laying down a transparent electrical highway. The TCO (typically FTO or ITO) must be both electrically conductive AND optically transparent — a rare combination. Light passes through, but electrons have a clear road to the external circuit.",
      details: "FTO (SnO₂:F) deposited by APCVD at 500°C from SnCl₄ + HF precursors. Sheet resistance ~8 Ω/□, transparency >80%. ITO (In₂O₃:Sn) is better optically but more expensive. The TCO surface roughness scatters light (light trapping).",
      params: "R_sheet: 8-15 Ω/□ | Thickness: 300-500 nm | Carrier density: ~10²⁰ cm⁻³" },
    { title: "Step 3: CdS Buffer Layer", icon: "🛡️", color: T.eo_photon,
      analogy: "Like a diplomatic ambassador between two countries. CdS (E_g = 2.4 eV) sits between the TCO and CdTe, forming the n-type partner of the p-n junction. It's thin enough (50-80 nm) that most light passes through to CdTe, but thick enough to prevent shunting.",
      details: "Deposited by Chemical Bath Deposition (CBD): CdSO₄ + thiourea in NH₄OH at 65°C for 12 min. Or by sputtering/CSS. CBD gives the best junction quality because it conformally coats the rough TCO. Too thick → absorbs blue light (parasitic). Too thin → pinholes → shunts.",
      params: "Thickness: 50-80 nm | E_g: 2.4 eV | Type: n-type (~10¹⁷ cm⁻³) | Method: CBD at 65°C" },
    { title: "Step 4: CdTe Absorber Deposition", icon: "☀️", color: T.eo_gap,
      analogy: "Like pouring the main ingredient into the cake pan. This is where the magic happens — the CdTe layer absorbs sunlight and generates electron-hole pairs. Close-Space Sublimation (CSS) heats CdTe powder to ~600°C in vacuum; atoms sublime and recrystallize on the substrate above.",
      details: "CSS: source at 600-640°C, substrate at 550-580°C, gap ~2 mm, N₂/O₂ ambient at 1-20 Torr. Deposition rate: 1-5 μm/min. Vapor Transport Deposition (VTD) used in production (First Solar). As-deposited grains are small (1-2 μm) with many grain boundaries — not yet good for solar cells.",
      params: "Thickness: 3-5 μm | E_g: 1.44 eV | Crystal: zinc-blende | Grain size: 1-2 μm (as-deposited)" },
    { title: "Step 5: CdCl₂ Activation Treatment", icon: "🔥", color: T.eo_hole,
      analogy: "Like annealing steel — heating with a catalyst that reorganizes the internal structure. CdCl₂ treatment is THE critical step. It recrystallizes CdTe grains from 1-2 μm to 5-10 μm, passivates grain boundaries with Cl, and activates p-type doping. Without this step, efficiency drops from ~18% to ~5%.",
      details: "Apply CdCl₂ solution (saturated in methanol) or evaporate CdCl₂ onto CdTe surface. Anneal at 380-420°C for 20-30 min in dry air. Cl diffuses along grain boundaries, promotes recrystallization via vapor-phase transport. CdCl₂ acts as a flux — lowers the activation energy for grain boundary motion. Rinse with DI water to remove excess CdCl₂.",
      params: "Temperature: 390-420°C | Time: 20-30 min | Ambient: dry air | Grain growth: 1→5-10 μm" },
    { title: "Step 6: Cu Doping & Back Contact", icon: "🔌", color: T.eo_core,
      analogy: "Like adding a pinch of spice to finish the dish. A tiny amount of Cu (~3 nm) is evaporated onto CdTe, then annealed at 200°C. Cu substitutes on Cd sites (Cu_Cd) creating a shallow acceptor that boosts p-type doping from ~10¹³ to ~10¹⁴-10¹⁵ cm⁻³. Too much Cu → deep traps → degradation.",
      details: "Evaporate 1-5 nm Cu, then 40 nm Au (or graphite/Mo). Anneal at 150-200°C for 20-45 min in N₂. Cu diffuses into CdTe — Cu_Cd is the primary acceptor. Back contact must be ohmic: CdTe has high electron affinity (4.3 eV) making ohmic contact difficult. ZnTe:Cu or Te-rich surface helps.",
      params: "Cu thickness: 1-5 nm | Anneal: 150-200°C, 20-45 min | Back metal: Au, Mo, or graphite" },
    { title: "Step 7: Characterization & Testing", icon: "📊", color: T.eo_cond,
      analogy: "Like a doctor's checkup — measure everything to see if the patient (solar cell) is healthy. J-V curves measure efficiency, EQE shows which wavelengths are collected, DLTS finds deep traps, PL identifies defect levels, and C-V profiling maps the doping profile.",
      details: "J-V under AM1.5G (100 mW/cm²): gives Voc, Jsc, FF, η. EQE(λ): photon-to-electron conversion vs wavelength. Dark J-V: reveals diode ideality factor n and recombination mechanism. DLTS: trap depth and density. PL at 10K: defect identification. C-V: doping profile N_A(x).",
      params: "Best lab cell: Voc=0.887 V, Jsc=31.7 mA/cm², FF=79.4%, η=22.1% (First Solar, 2016)" },
    { title: "Step 8: Module Assembly & Encapsulation", icon: "🏭", color: "#16a34a",
      analogy: "Like framing a painting and sealing it behind glass. Individual cells are scribed into series-connected strings (P1-P2-P3 laser scribing), then encapsulated between glass sheets with EVA lamination. The module must survive 25+ years of sun, rain, hail, and temperature cycling.",
      details: "Monolithic integration: P1 scribe (laser, through TCO), P2 scribe (mechanical, through CdTe), P3 scribe (laser, through back contact). This creates series-connected cells without wires. Encapsulation: front glass / EVA / cell / EVA / back glass. Lamination at 150°C, 15 min. Edge seal prevents moisture ingress.",
      params: "Module efficiency: 18-19% | Size: 60×120 cm² | Lifetime: 25+ years | Degradation: <0.5%/year" },
  ];

  const step = mfgSteps[mfgStep];

  // Layer stack animation positions
  const layerStack = [
    { label: "Glass", y: 200, h: 30, color: "#94a3b8", active: mfgStep >= 0 },
    { label: "TCO (FTO)", y: 185, h: 15, color: "#22c55e80", active: mfgStep >= 1 },
    { label: "CdS (n)", y: 177, h: 8, color: T.eo_photon + "90", active: mfgStep >= 2 },
    { label: "CdTe (p)", y: 132, h: 45, color: T.eo_gap + "80", active: mfgStep >= 3 },
    { label: "Back Contact", y: 122, h: 10, color: T.eo_core + "90", active: mfgStep >= 5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="Overview: How a CdTe Solar Cell is Made" color={T.eo_hole} isOpen={openItem === "mfg_overview"} onClick={() => toggle("mfg_overview")}>
        <div style={{ display: "flex", gap: 10, background: T.eo_hole + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.eo_hole + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🏭</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>
            Building a CdTe solar cell is like making a layered cake — each layer has a specific purpose, and the order matters. Glass (foundation) → TCO (transparent conductor) → CdS (n-type partner) → CdTe (light absorber) → CdCl₂ treatment (the secret sauce) → Cu doping + back contact → testing → encapsulation. Every step involves precise control of temperature, time, and chemistry.
          </span>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          CdTe solar cells use the <strong>superstrate</strong> configuration: light enters through the glass. This is opposite to Si cells (substrate configuration). The manufacturing flow takes ~2 hours from glass to finished cell. First Solar produces ~3 GW/year using Vapor Transport Deposition (VTD) — the fastest thin-film deposition technology.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 12 }}>
          {[
            { label: "Record η", value: "22.1%", color: T.eo_gap },
            { label: "Band gap", value: "1.44 eV", color: T.eo_cond },
            { label: "Absorber", value: "3-5 μm", color: T.eo_core },
            { label: "Module life", value: "25+ yrs", color: "#22c55e" },
          ].map(item => (
            <div key={item.label} style={{ background: item.color + "10", border: `1px solid ${item.color}30`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 9, color: T.muted }}>{item.label}</div>
            </div>
          ))}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step Manufacturing (click each step)" color={T.eo_cond} isOpen={openItem === "mfg_steps"} onClick={() => toggle("mfg_steps")}>
        {/* Step selector buttons */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {mfgSteps.map((s, i) => (
            <button key={i} onClick={() => setMfgStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${mfgStep === i ? s.color : T.border}`,
              background: mfgStep === i ? s.color + "18" : T.bg, color: mfgStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: mfgStep === i ? 800 : 400, transition: "all 0.2s",
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>

        {/* Analogy box */}
        <div style={{ display: "flex", gap: 10, background: step.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${step.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: step.color, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.analogy}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Animated layer stack */}
          <div style={{ flex: "0 0 280px" }}>
            <svg width={280} height={270} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block" }}>
              <text x={140} y={18} textAnchor="middle" fill={T.ink} fontSize={10} fontWeight={700}>CdTe Cell Cross-Section</text>

              {/* Sunlight arrows */}
              {mfgStep >= 3 && [50, 100, 150, 200, 230].map((x, i) => (
                <line key={i} x1={x} y1={25} x2={x} y2={120 + (tick * 2 + i * 10) % 15} stroke={T.eo_photon} strokeWidth={1.5} opacity={0.4 + 0.3 * Math.sin(tick * 0.1 + i)} strokeDasharray="4 3" />
              ))}
              {mfgStep >= 3 && <text x={240} y={40} fill={T.eo_photon} fontSize={9} fontWeight={700}>☀️ light</text>}

              {/* Layer stack */}
              {layerStack.map((layer, i) => layer.active && (
                <g key={i}>
                  <rect x={30} y={layer.y} width={200} height={layer.h} rx={3} fill={layer.color} stroke={T.ink + "30"} strokeWidth={0.5}>
                    {i === mfgStep && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />}
                  </rect>
                  <text x={240} y={layer.y + layer.h / 2 + 4} fill={T.ink} fontSize={8} fontWeight={i === mfgStep ? 700 : 400}>{layer.label}</text>
                </g>
              ))}

              {/* CdCl2 treatment visualization */}
              {mfgStep === 4 && <>
                <text x={140} y={125} textAnchor="middle" fill={T.eo_hole} fontSize={9} fontWeight={700}>CdCl₂ + 400°C</text>
                {[60, 100, 140, 180].map((x, i) => (
                  <circle key={i} cx={x} cy={135 + 5 * Math.sin(tick * 0.15 + i)} r={2} fill={T.eo_hole}>
                    <animate attributeName="cy" values={`${135};${170};${135}`} dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  </circle>
                ))}
                <text x={140} y={195} textAnchor="middle" fill={T.muted} fontSize={8}>Cl diffuses → grains grow 1→10 μm</text>
              </>}

              {/* Cu diffusion */}
              {mfgStep === 5 && <>
                {[70, 110, 150, 190].map((x, i) => (
                  <circle key={i} cx={x} cy={125 + (tick * 1.5 + i * 8) % 50} r={2.5} fill={T.eo_core}>
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  </circle>
                ))}
                <text x={140} y={118} textAnchor="middle" fill={T.eo_core} fontSize={9} fontWeight={700}>Cu diffusing into CdTe</text>
              </>}

              {/* Characterization */}
              {mfgStep === 6 && <>
                <text x={140} y={115} textAnchor="middle" fill={T.eo_cond} fontSize={10} fontWeight={700}>TESTING</text>
                <text x={140} y={255} textAnchor="middle" fill={T.muted} fontSize={8}>J-V, EQE, DLTS, PL, C-V</text>
              </>}

              {/* Encapsulation */}
              {mfgStep === 7 && <>
                <rect x={20} y={100} width={220} height={140} rx={6} fill="none" stroke="#16a34a" strokeWidth={3} strokeDasharray="6 3" />
                <text x={140} y={255} textAnchor="middle" fill="#16a34a" fontSize={9} fontWeight={700}>Encapsulated — 25+ year lifetime</text>
              </>}

              {/* e-h pair generation animation */}
              {mfgStep === 3 && <>
                <circle cx={100 + (tick * 3) % 80} cy={155} r={3} fill={T.eo_e}>
                  <animate attributeName="cy" values="155;140;155" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx={140 + (tick * 2) % 60} cy={165} r={3} fill={T.eo_hole}>
                  <animate attributeName="cy" values="165;175;165" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x={140} y={195} textAnchor="middle" fill={T.muted} fontSize={8}>e⁻/h⁺ pairs generated in CdTe</text>
              </>}
            </svg>
          </div>

          {/* Details panel */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: step.color, marginBottom: 6 }}>Process Details</div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.details}</div>
            </div>
            <div style={{ background: step.color + "08", borderRadius: 8, padding: "8px 12px", border: `1px solid ${step.color}15` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 4 }}>Key Parameters</div>
              <div style={{ fontSize: 11, color: T.ink, fontFamily: "monospace", lineHeight: 1.8 }}>{step.params}</div>
            </div>
          </div>
        </div>
      </FAQAccordion>

      <FAQAccordion title="The CdCl₂ Treatment — Why It's the Most Important Step" color={T.eo_hole} isOpen={openItem === "mfg_cdcl2"} onClick={() => toggle("mfg_cdcl2")}>
        <div style={{ display: "flex", gap: 10, background: T.eo_hole + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.eo_hole + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🔥</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>Without CdCl₂ treatment, CdTe solar cells are only ~5% efficient. WITH it, they reach 22%+. This single step is responsible for a 4× improvement. It{"'"}s the "secret sauce" of CdTe technology — and it took decades to fully understand why it works.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.eo_hole, fontWeight: 700 }}>What CdCl₂ treatment does — 5 simultaneous effects:</span><br /><br />
          {"  1. GRAIN GROWTH: 1-2 μm → 5-10 μm (fewer grain boundaries)"}<br />
          {"     Mechanism: Cl lowers grain boundary energy → grains coalesce"}<br />
          {"     Analogy: like soap reducing surface tension → small bubbles merge"}<br /><br />
          {"  2. GRAIN BOUNDARY PASSIVATION: Cl segregates to GBs"}<br />
          {"     Cl atoms fill dangling bonds at GBs → removes mid-gap states"}<br />
          {"     Analogy: like caulking cracks in a wall"}<br /><br />
          {"  3. CdS INTERMIXING: CdS₁₋ₓTeₓ alloy at interface"}<br />
          {"     Reduces lattice mismatch (CdS: 5.83 Å, CdTe: 6.48 Å)"}<br />
          {"     Analogy: like blending two colors at the border for a smooth transition"}<br /><br />
          {"  4. p-TYPE ACTIVATION: Cd vacancies form, act as acceptors"}<br />
          {"     V_Cd concentration increases with Cl treatment"}<br />
          {"     Hole density: 10¹³ → 10¹⁴ cm⁻³"}<br /><br />
          {"  5. STACKING FAULT REMOVAL: Cl removes planar defects"}<br />
          {"     Twin boundaries and stacking faults annealed out"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Without CdCl₂", value: "~5%", sub: "Small grains, many GBs, unpassivated", color: T.eo_gap },
            { label: "With CdCl₂", value: "~20%+", sub: "Large grains, passivated GBs, activated", color: "#22c55e" },
          ].map(item => (
            <div key={item.label} style={{ background: item.color + "10", border: `1.5px solid ${item.color}30`, borderRadius: 10, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color, margin: "4px 0" }}>{item.value}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Numerical Example: Full Cell Fabrication Parameters" color={T.eo_cond} isOpen={openItem === "mfg_numerical"} onClick={() => toggle("mfg_numerical")}>
        <div style={mb}>
          <span style={{ color: T.eo_cond, fontWeight: 800, fontSize: 14 }}>Complete recipe for a 20%+ CdTe cell:</span><br /><br />

          <span style={{ color: T.eo_cond, fontWeight: 700 }}>Layer 1: FTO/glass</span><br />
          {"  SnO₂:F by APCVD at 500°C | 400 nm | R_sh = 8 Ω/□ | T = 82%"}<br /><br />

          <span style={{ color: T.eo_photon, fontWeight: 700 }}>Layer 2: CdS buffer</span><br />
          {"  CBD: 0.015M CdSO₄ + 0.15M thiourea + 1.5M NH₄OH"}<br />
          {"  T = 65°C, t = 12 min → 70 nm film"}<br />
          {"  Post-anneal: 400°C, 10 min, air (densifies film)"}<br /><br />

          <span style={{ color: T.eo_gap, fontWeight: 700 }}>Layer 3: CdTe absorber</span><br />
          {"  CSS: source 625°C, substrate 565°C, gap 2 mm"}<br />
          {"  Ambient: 2 Torr N₂ + 0.1 Torr O₂"}<br />
          {"  Rate: 3 μm/min → 4 μm in 80 s"}<br /><br />

          <span style={{ color: T.eo_hole, fontWeight: 700 }}>Step 4: CdCl₂ activation</span><br />
          {"  Saturated CdCl₂ in methanol, spin-coat or dip"}<br />
          {"  Anneal: 400°C, 25 min, dry air (20% O₂, 80% N₂)"}<br />
          {"  Grain growth: 1.5 μm → 8 μm average"}<br />
          {"  Rinse: DI water × 3, N₂ dry"}<br /><br />

          <span style={{ color: T.eo_core, fontWeight: 700 }}>Step 5: Back contact</span><br />
          {"  Etch: NP etch (HNO₃:H₃PO₄:H₂O = 1:88:40) for 30s → Te-rich surface"}<br />
          {"  Evaporate: 3 nm Cu / 40 nm Au at 10⁻⁶ Torr"}<br />
          {"  Anneal: 200°C, 30 min, N₂ → Cu diffuses ~200 nm into CdTe"}<br /><br />

          <span style={{ color: "#22c55e", fontWeight: 700 }}>Result:</span><br />
          {"  Voc = 0.86 V | Jsc = 29.5 mA/cm² | FF = 78% | η = 19.8%"}<br />
          {"  Diode: n = 1.6, J₀ = 2×10⁻¹⁰ A/cm²"}<br />
          {"  Doping: N_A ≈ 2×10¹⁴ cm⁻³ (from C-V)"}<br />
          {"  Lifetime: τ = 3 ns (from TRPL)"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Common Failure Modes & How to Fix Them" color={T.eo_gap} isOpen={openItem === "mfg_failures"} onClick={() => toggle("mfg_failures")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { problem: "Low Voc (< 0.8 V)", cause: "Too many deep traps (V_Cd, Te_Cd). Insufficient CdCl₂ treatment or excess Cu.", fix: "Optimize CdCl₂ time/temp. Reduce Cu to 1-2 nm. Add MgZnO buffer instead of CdS.", icon: "📉", color: T.eo_gap },
            { problem: "Low Jsc (< 25 mA/cm²)", cause: "CdS too thick (absorbs blue light). CdTe too thin. Poor light trapping.", fix: "Reduce CdS to 50 nm or use MgZnO. Increase CdTe to 4+ μm. Texture TCO surface.", icon: "🔅", color: T.eo_photon },
            { problem: "Low FF (< 70%)", cause: "High series resistance (bad back contact) or shunting (pinholes in CdS).", fix: "NP etch before back contact. Ensure CdS fully covers TCO. Check for scribing damage.", icon: "📊", color: T.eo_cond },
            { problem: "Shunting (J_dark too high)", cause: "Pinholes in CdS expose TCO to CdTe → direct metal-semiconductor contact.", fix: "Increase CdS thickness to 80+ nm. Or add high-resistivity buffer (MgZnO, ZnSnO).", icon: "⚡", color: T.eo_hole },
            { problem: "Degradation over time", cause: "Cu migration from back contact through CdTe → creates deep donor Cu_i near junction.", fix: "Use diffusion barrier (ZnTe) between Cu and CdTe. Limit Cu to 1-2 nm. Proper encapsulation.", icon: "⏰", color: T.eo_core },
            { problem: "Roll-over in J-V curve", cause: "Back contact barrier (Schottky barrier at CdTe/metal interface).", fix: "Te-rich surface etch + Cu/Au contact. Or use ZnTe:Cu intermediate layer.", icon: "🔄", color: "#22c55e" },
          ].map(item => (
            <div key={item.problem} style={{ background: item.color + "06", borderRadius: 10, padding: "10px 14px", border: `1px solid ${item.color}15`, borderLeft: `4px solid ${item.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.problem}</span>
              </div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.5, marginBottom: 4 }}><strong>Cause:</strong> {item.cause}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}><strong>Fix:</strong> {item.fix}</div>
            </div>
          ))}
        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2: CdTe SOLAR CELL MODULE (CdTe + N-type + P-type tabs)
// ═══════════════════════════════════════════════════════════════════════════
const CDTE_SOLAR_SECTIONS = [
  { id: "atom",    label: "Cd & Te Atoms",        icon: "⚛️",  color: T.eo_core,    Component: AtomSection,              nextReason: "Cd and Te atoms have defined electron configurations that dictate how they interact. The next step is to see how these atoms arrange into the zinc-blende crystal lattice — the structural foundation from which every other CdTe property is derived." },
  { id: "crystal", label: "Crystal & sp³",        icon: "💎",  color: T.eo_valence, Component: CrystalSection,           nextReason: "The sp³ tetrahedral arrangement is established. Now we ask: what holds these atoms in place? Understanding the mixed ionic-covalent bond character of CdTe explains its bandgap magnitude, mechanical stability, and why defects form as they do." },
  { id: "bonds",   label: "Bond Nature",          icon: "🔗",  color: T.eo_valence, Component: BondNatureSection,        nextReason: "Atomic bonds, viewed quantum mechanically across the periodic crystal, smear into continuous energy bands via Bloch's theorem. The bonding orbitals form the valence band; antibonding orbitals form the conduction band — giving CdTe its 1.44 eV direct gap." },
  { id: "bands",   label: "Energy Bands",         icon: "📊",  color: T.eo_cond,    Component: BandSection,              nextReason: "Pure CdTe has a 1.44 eV gap but no free carriers. Controlled conductivity requires doping. The next section covers both n-type and p-type doping in CdTe — showing which dopants are used, how they shift the Fermi level, and how they set up the p-n junction." },
  { id: "doping",  label: "Doping (N & P type)",  icon: "⚗️",  color: "#0284c7",    Component: DopingModule, nextReason: "N-type and p-type semiconductors in isolation are just conductors. Bringing them together forms the p-n junction — the fundamental device that separates photogenerated electron-hole pairs and drives current through the external circuit." },
  { id: "config",  label: "Defect Types",         icon: "🔧",  color: T.eo_e,       Component: DefectConfigSection,      nextReason: "Different defect structures create different energy levels inside the bandgap. We now map exactly where these levels sit and whether each defect acts as a donor, acceptor, or amphoteric center — the first step to understanding their electronic impact." },
  { id: "defect",  label: "Defect States",        icon: "🕳️",  color: T.eo_gap,     Component: DefectSection,            nextReason: "Defect levels are positioned energetically. The critical next question: how are these levels populated? Fermi-level-dependent charge states and thermal ionization determine whether each defect is neutral, positively, or negatively charged at device operating conditions." },
  { id: "defect_e",label: "Defect Electrons",     icon: "⚡",  color: T.eo_cond,    Component: DefectElectronsSection,   nextReason: "Charged mid-gap defect levels act as Shockley-Read-Hall recombination traps — the primary efficiency killer in CdTe. Carriers generated by light fall into these traps and recombine before reaching the junction, directly reducing Voc and fill factor." },
  { id: "recomb",  label: "Recombination",        icon: "💡",  color: T.eo_photon,  Component: RecombinationSection,     nextReason: "To engineer lower recombination we must control defect concentrations. Defect thermodynamics — formation energy as a function of chemical potential and Fermi level — tells us which growth conditions suppress harmful traps and which inadvertently create them." },
  { id: "thermo",  label: "Defect Thermo",        icon: "🌡️",  color: T.eo_core,    Component: DefectThermoSection,      nextReason: "With complete atomic-scale defect physics in hand, we zoom out to the full device. How do all these microscopic effects — doping, trapping, recombination — translate into macroscopic solar cell metrics: Voc, Jsc, fill factor, and efficiency?" },
  { id: "macro",   label: "CdTe Solar Cell",      icon: "☀️",  color: T.eo_hole,    Component: MacroSection,             nextReason: "With defect physics established, we can now plot the full J-V curve — showing exactly how Voc, Jsc, fill factor, and efficiency emerge from the atomic-scale physics we've been building up." },
  { id: "ivcurve", label: "J-V Curve & Efficiency", icon: "📈",  color: "#22c55e",    Component: IVCurveSection,           nextReason: "The J-V curve summarises all device physics in one plot. The Device Animation shows all of these microscopic processes — photon absorption, carrier generation, drift, and collection — happening simultaneously in real time." },
  { id: "device",  label: "Device Animation",     icon: "🎬",  color: T.eo_photon,  Component: SolarCellDeviceSection,   nextReason: "The device is running. Now watch the full animated story — from atomistic simulations through defect physics to DFT and MLFF acceleration — in the DefectDB movie." },
  { id: "defectmovie", label: "Movie",  icon: "🎥",  color: "#f59e0b",    Component: DefectMovieModule,        nextReason: "The DefectDB movie covers the computational side. Now see how all these defect physics play out in real-world device aging — the Degradation Movie shows CdTe solar cells aging under light, heat, moisture, and mechanical stress." },
  { id: "degradation", label: "Degradation Movie", icon: "⚡", color: "#ef4444", Component: SolarCellDegradationMovie, nextReason: "Degradation physics covered. Now see the full manufacturing process — from glass substrate to finished solar cell module — with step-by-step animated fabrication, CdCl₂ activation, Cu doping, and characterization." },
  { id: "manufacturing", label: "Manufacturing", icon: "🏭", color: "#16a34a", Component: CdTeManufacturingSection },
];

function CdTeSolarCellModule() {
  const [active, setActive] = useState("atom");
  const sec = CDTE_SOLAR_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const secIdx = CDTE_SOLAR_SECTIONS.findIndex(s => s.id === active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Sub-navigation tabs */}
      <div style={{
        display: "flex", gap: 4, flexWrap: "wrap",
        padding: "8px 12px", background: T.panel,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {CDTE_SOLAR_SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 11,
            border: `1px solid ${active === s.id ? s.color : T.border}`,
            background: active === s.id ? s.color + "22" : T.bg,
            color: active === s.id ? s.color : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
            display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 10, color: active === s.id ? s.color : T.dim, marginRight: 1 }}>{i + 1}.</span>
            <span style={{ fontSize: 12 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Active sub-section */}
      <div style={{ padding: "20px 24px" }}>
        <Component />
        <NextTopicCard sections={CDTE_SOLAR_SECTIONS} activeId={active} />
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${T.border}`, padding: "10px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: T.panel,
      }}>
        <button onClick={() => { if (secIdx > 0) setActive(CDTE_SOLAR_SECTIONS[secIdx - 1].id); }}
          disabled={secIdx === 0} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontFamily: "inherit", fontWeight: 700,
            background: secIdx === 0 ? T.surface : sec.color + "22",
            border: `1.5px solid ${secIdx === 0 ? T.border : sec.color}`,
            color: secIdx === 0 ? T.muted : sec.color,
            cursor: secIdx === 0 ? "default" : "pointer",
          }}>← Previous</button>
        <div style={{ display: "flex", gap: 6 }}>
          {CDTE_SOLAR_SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{
              width: 8, height: 8, borderRadius: 4,
              background: active === s.id ? s.color : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
        <button onClick={() => { if (secIdx < CDTE_SOLAR_SECTIONS.length - 1) setActive(CDTE_SOLAR_SECTIONS[secIdx + 1].id); }}
          disabled={secIdx === CDTE_SOLAR_SECTIONS.length - 1} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontFamily: "inherit", fontWeight: 700,
            background: secIdx === CDTE_SOLAR_SECTIONS.length - 1 ? T.surface : sec.color + "22",
            border: `1.5px solid ${secIdx === CDTE_SOLAR_SECTIONS.length - 1 ? T.border : sec.color}`,
            color: secIdx === CDTE_SOLAR_SECTIONS.length - 1 ? T.muted : sec.color,
            cursor: secIdx === CDTE_SOLAR_SECTIONS.length - 1 ? "default" : "pointer",
          }}>Next →</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DOPING MODULE — N-type, P-type, p-n Junction (CdTe examples)
// ═══════════════════════════════════════════════════════════════════════════
function DopingModule({ initialTab }) {
  const [tab, setTab] = useState(initialTab || "ntype");
  const [frame, setFrame] = useState(0);
  const [dopingLevel, setDopingLevel] = useState(3);
  const [selN, setSelN] = useState(0);
  const [selP, setSelP] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(id);
  }, []);

  const CN = { main: "#0284c7", donor: "#2563eb", e: "#1d4ed8", band: "#059669", fermi: "#7c3aed" };
  const CP = { main: "#b91c1c", acceptor: "#ea580c", hole: "#dc2626", band: "#059669", fermi: "#7c3aed", e: "#2563eb" };

  const nDopants = [
    { name: "Indium (In)", symbol: "In", valence: 3, site: "Cd site", Ea: "14 meV", detail: "In substituting on a Cd site (In_Cd) donates one extra electron to the CdTe conduction band. It is the most commonly studied n-type dopant in CdTe, with a very shallow ionization energy (~14 meV), making it fully ionized at room temperature. Used in research-grade n-type CdTe layers.", color: CN.donor },
    { name: "Arsenic (As)", symbol: "As", site: "Te site", valence: 5, Ea: "~50 meV", detail: "As on a Te site (As_Te) has 5 valence electrons vs Te's 6 — initially acts as an acceptor. However, As can be activated as a donor through complex defect chemistry or compensation. As is being actively studied as an n-type dopant in CdTe by First Solar for next-generation cells.", color: "#0891b2" },
    { name: "Chlorine (Cl)", symbol: "Cl", site: "Te site", valence: 7, Ea: "~12 meV", detail: "Cl on a Te site (Cl_Te) is a shallow donor with very low ionization energy (~12 meV). CdCl₂ treatment — the key activation step in CdTe processing — introduces Cl_Te donors and passivates grain boundaries simultaneously. Cl is the dominant unintentional n-type dopant from the CdCl₂ anneal.", color: "#0f766e" },
    { name: "Bismuth (Bi)", symbol: "Bi", site: "Te site", valence: 5, Ea: "~70 meV", detail: "Bi on a Te site (Bi_Te) acts as a donor, contributing extra electrons to the conduction band. Bi has a larger ionic radius than Te, introducing local lattice strain. Research has shown Bi doping can push Fermi level toward the CB, enabling CdTe to become n-type — relevant for all-CdTe p-n homojunction designs.", color: "#7c3aed" },
  ];

  const pDopants = [
    { name: "Copper (Cu)", symbol: "Cu", site: "Cd site", valence: 1, Ea: "~220 meV", detail: "Cu substituting on a Cd site (Cu_Cd) is the dominant p-type dopant introduced during the Cu/ZnTe back contact deposition. Cu_Cd is an acceptor because Cu⁺ has one fewer valence electron than Cd²⁺. It diffuses into CdTe at moderate temperatures (~150–200 °C) and creates the p⁺ near-surface layer essential for ohmic contact formation.", color: CP.acceptor },
    { name: "Nitrogen (N)", symbol: "N", site: "Te site", valence: 5, Ea: "~56 meV", detail: "N on a Te site (N_Te) is a shallow acceptor in CdTe (Ea ≈ 56 meV) with one fewer valence electron than Te. N doping via plasma-assisted MBE or ion implantation can achieve p-type doping up to ~10¹⁷ cm⁻³. N_Te is promising for intentional p-type doping without the diffusion issues of Cu.", color: "#c2410c" },
    { name: "Phosphorus (P)", symbol: "P", site: "Te site", valence: 5, Ea: "~68 meV", detail: "P on a Te site (P_Te) acts as an acceptor in CdTe. P doping has been studied for p-type CdTe layers in tandem solar cells. The ionization energy (~68 meV) is slightly larger than N_Te, meaning partial ionization at room temperature. P is compatible with CdCl₂ processing and does not diffuse as aggressively as Cu.", color: "#9333ea" },
    { name: "Antimony (Sb)", symbol: "Sb", site: "Te site", valence: 5, Ea: "~115 meV", detail: "Sb on a Te site (Sb_Te) is a deeper acceptor in CdTe. Sb has been investigated as a p-type dopant in CdTe thin films. Its larger atomic radius compared to Te causes lattice strain but also reduces diffusivity — making it useful when sharp p-type profiles are needed. Sb doping combined with In doping enables p-n homojunctions entirely within CdTe.", color: "#0f766e" },
  ];

  const nd = [1e14, 1e15, 1e16, 1e17, 1e18][dopingLevel];
  const ndLabel = ["10¹⁴", "10¹⁵", "10¹⁶", "10¹⁷", "10¹⁸"][dopingLevel];
  const ni = 1.5e6; // CdTe intrinsic carrier density at 300K
  const n_e = nd;
  const n_h_n = (ni * ni) / n_e;
  const p_h = nd;
  const n_e_p = (ni * ni) / p_h;

  // ── Shared band diagram layout ──
  const svgW = 400, svgH = 240;
  const bX = 28, bW2 = 340, bH = 180, bY = 28;
  const Ec = bY, Ev = bY + bH, Eg = bH;

  const renderNBand = () => {
    const EfY = Ec + Eg * 0.12 + (1 - Math.min(Math.log10(nd / ni) / 18, 1)) * Eg * 0.3;
    const EdY = Ec + Eg * 0.07;
    const dop = nDopants[selN];
    const els = [];
    // CB
    els.push(
      <rect key="cbr" x={bX} y={Ec} width={bW2} height={Eg * 0.12} fill={CN.e + "22"} />,
      <line key="cbl" x1={bX} y1={Ec} x2={bX + bW2} y2={Ec} stroke={CN.e} strokeWidth={2.5} />,
      <text key="cbt" x={bX + bW2 + 5} y={Ec + 5} fontSize={9} fill={CN.e} fontWeight="bold">E_c</text>,
    );
    // VB
    els.push(
      <rect key="vbr" x={bX} y={Ev - Eg * 0.12} width={bW2} height={Eg * 0.12} fill={CN.band + "22"} />,
      <line key="vbl" x1={bX} y1={Ev} x2={bX + bW2} y2={Ev} stroke={CN.band} strokeWidth={2.5} />,
      <text key="vbt" x={bX + bW2 + 5} y={Ev + 4} fontSize={9} fill={CN.band} fontWeight="bold">E_v</text>,
    );
    // Gap
    els.push(
      <text key="gap" x={bX + bW2 / 2} y={(Ec + Ev) / 2} textAnchor="middle" fontSize={9} fill={T.muted}>1.44 eV gap</text>,
    );
    // Donor level
    els.push(
      <line key="ed" x1={bX + 30} y1={EdY} x2={bX + bW2 - 30} y2={EdY}
        stroke={dop.color} strokeWidth={1.5} strokeDasharray="6,4" />,
      <text key="edt" x={bX + bW2 + 5} y={EdY + 4} fontSize={8} fill={dop.color} fontWeight="bold">E_d</text>,
    );
    // Fermi level
    els.push(
      <line key="ef" x1={bX} y1={EfY} x2={bX + bW2} y2={EfY}
        stroke={CN.fermi} strokeWidth={1.5} strokeDasharray="3,3" />,
      <text key="eft" x={bX + bW2 + 5} y={EfY + 4} fontSize={8} fill={CN.fermi} fontWeight="bold">E_F</text>,
    );
    // Animated electrons in CB
    for (let i = 0; i < Math.min(6, 2 + dopingLevel); i++) {
      const speed = 0.8 + i * 0.3;
      const cx = bX + ((i * (bW2 / 6) + frame * speed * 0.6) % bW2);
      const cy = Ec + Eg * 0.06 + Math.sin(frame * 0.08 + i * 1.2) * 3;
      els.push(
        <circle key={`e${i}`} cx={cx} cy={cy} r={5} fill={CN.e} opacity={0.9} />,
        <text key={`et${i}`} x={cx} y={cy + 3.5} textAnchor="middle" fontSize={6} fill="#fff" fontWeight="bold">e⁻</text>,
        <line key={`etail${i}`} x1={cx - 7} y1={cy} x2={cx - 2} y2={cy} stroke={CN.e} strokeWidth={1.5} opacity={0.3} />,
      );
    }
    // Ionized donors (fixed)
    for (let i = 0; i < Math.min(6, 2 + dopingLevel); i++) {
      const x = bX + 25 + i * (bW2 - 50) / 5;
      els.push(
        <circle key={`d${i}`} cx={x} cy={EdY} r={6} fill={dop.color + "22"} stroke={dop.color} strokeWidth={1.5} />,
        <text key={`dt${i}`} x={x} y={EdY + 3.5} textAnchor="middle" fontSize={9} fill={dop.color} fontWeight="bold">+</text>,
      );
    }
    els.push(
      <text key="info" x={bX + bW2 / 2} y={svgH - 6} textAnchor="middle" fontSize={9} fill={T.muted}>
        Donor⁺ fixed — free electrons drift →
      </text>
    );
    return els;
  };

  const renderPBand = () => {
    const EfY = Ec + Eg * (0.55 + Math.min(Math.log10(nd / ni) / 18, 1) * 0.3);
    const EaY = Ev - Eg * 0.07;
    const dop = pDopants[selP];
    const els = [];
    els.push(
      <rect key="cbr" x={bX} y={Ec} width={bW2} height={Eg * 0.12} fill={CP.e + "22"} />,
      <line key="cbl" x1={bX} y1={Ec} x2={bX + bW2} y2={Ec} stroke={CP.e} strokeWidth={2.5} />,
      <text key="cbt" x={bX + bW2 + 5} y={Ec + 5} fontSize={9} fill={CP.e} fontWeight="bold">E_c</text>,
      <rect key="vbr" x={bX} y={Ev - Eg * 0.12} width={bW2} height={Eg * 0.12} fill={CP.band + "22"} />,
      <line key="vbl" x1={bX} y1={Ev} x2={bX + bW2} y2={Ev} stroke={CP.band} strokeWidth={2.5} />,
      <text key="vbt" x={bX + bW2 + 5} y={Ev + 4} fontSize={9} fill={CP.band} fontWeight="bold">E_v</text>,
      <text key="gap" x={bX + bW2 / 2} y={(Ec + Ev) / 2} textAnchor="middle" fontSize={9} fill={T.muted}>1.44 eV gap</text>,
      <line key="ea" x1={bX + 30} y1={EaY} x2={bX + bW2 - 30} y2={EaY}
        stroke={dop.color} strokeWidth={1.5} strokeDasharray="6,4" />,
      <text key="eat" x={bX + bW2 + 5} y={EaY + 4} fontSize={8} fill={dop.color} fontWeight="bold">E_a</text>,
      <line key="ef" x1={bX} y1={EfY} x2={bX + bW2} y2={EfY}
        stroke={CP.fermi} strokeWidth={1.5} strokeDasharray="3,3" />,
      <text key="eft" x={bX + bW2 + 5} y={EfY + 4} fontSize={8} fill={CP.fermi} fontWeight="bold">E_F</text>,
    );
    // Animated holes in VB
    for (let i = 0; i < Math.min(6, 2 + dopingLevel); i++) {
      const speed = 0.5 + i * 0.25;
      const cx = bX + ((bW2 - i * (bW2 / 6) - frame * speed * 0.5 + bW2 * 4) % bW2);
      const cy = Ev - Eg * 0.06 + Math.sin(frame * 0.07 + i * 1.4) * 3;
      els.push(
        <circle key={`h${i}`} cx={cx} cy={cy} r={5} fill="none" stroke={CP.hole} strokeWidth={2.5} />,
        <circle key={`hf${i}`} cx={cx} cy={cy} r={5} fill={CP.hole + "20"} />,
        <text key={`ht${i}`} x={cx} y={cy + 3.5} textAnchor="middle" fontSize={9} fill={CP.hole} fontWeight="bold">+</text>,
        <line key={`htail${i}`} x1={cx + 2} y1={cy} x2={cx + 8} y2={cy} stroke={CP.hole} strokeWidth={1.5} opacity={0.3} />,
      );
    }
    // Ionized acceptors (fixed)
    for (let i = 0; i < Math.min(6, 2 + dopingLevel); i++) {
      const x = bX + 25 + i * (bW2 - 50) / 5;
      els.push(
        <circle key={`a${i}`} cx={x} cy={EaY} r={6} fill={dop.color + "22"} stroke={dop.color} strokeWidth={1.5} />,
        <text key={`at${i}`} x={x} y={EaY + 3.5} textAnchor="middle" fontSize={9} fill={dop.color} fontWeight="bold">−</text>,
      );
    }
    els.push(
      <text key="info" x={bX + bW2 / 2} y={svgH - 6} textAnchor="middle" fontSize={9} fill={T.muted}>
        Acceptor⁻ fixed — free holes drift ←
      </text>
    );
    return els;
  };

  // ── p-n Junction animation ──
  const jW = 520, jH = 300;
  const jMid = jW / 2;
  const renderJunction = () => {
    const depW = 60; // depletion width each side
    const pLeft = 0, pRight = jMid - depW;
    const nLeft = jMid + depW, nRight = jW;
    const bandYtop = 60, bandYbot = 220;
    const bending = 50; // band bending amount

    const els = [];

    // Region labels
    els.push(
      <text key="plbl" x={(pLeft + pRight) / 2} y={20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={CP.main}>p-type CdTe</text>,
      <text key="psub" x={(pLeft + pRight) / 2} y={34} textAnchor="middle" fontSize={9} fill={T.muted}>Cu_Cd or N_Te doped</text>,
      <text key="nlbl" x={(nLeft + nRight) / 2} y={20} textAnchor="middle" fontSize={12} fontWeight="bold" fill={CN.main}>n-type CdTe (or CdS)</text>,
      <text key="nsub" x={(nLeft + nRight) / 2} y={34} textAnchor="middle" fontSize={9} fill={T.muted}>In_Cd or Cl_Te doped</text>,
      <text key="dlbl" x={jMid} y={20} textAnchor="middle" fontSize={10} fontWeight="bold" fill={T.eo_gap}>Depletion</text>,
      <text key="dsub" x={jMid} y={32} textAnchor="middle" fontSize={8} fill={T.eo_gap}>region</text>,
    );

    // Depletion region background
    els.push(
      <rect key="dep" x={pRight} y={40} width={depW * 2} height={jH - 50}
        fill={T.eo_gap + "0a"} stroke={T.eo_gap} strokeWidth={0.5} strokeDasharray="4,3" />
    );

    // Band bending — Ec
    const ecPath = `M ${pLeft + 10},${bandYtop} L ${pRight},${bandYtop} Q ${jMid},${bandYtop} ${jMid},${bandYtop + bending / 2} Q ${jMid},${bandYtop + bending} ${nLeft},${bandYtop + bending} L ${nRight - 10},${bandYtop + bending}`;
    const evPath = `M ${pLeft + 10},${bandYbot} L ${pRight},${bandYbot} Q ${jMid},${bandYbot} ${jMid},${bandYbot + bending / 2} Q ${jMid},${bandYbot + bending} ${nLeft},${bandYbot + bending} L ${nRight - 10},${bandYbot + bending}`;

    els.push(
      <path key="ec" d={ecPath} fill="none" stroke={CN.e} strokeWidth={2.5} />,
      <path key="ev" d={evPath} fill="none" stroke={CP.band} strokeWidth={2.5} />,
      <text key="eclbl" x={pLeft + 14} y={bandYtop - 6} fontSize={9} fill={CN.e} fontWeight="bold">E_c</text>,
      <text key="evlbl" x={pLeft + 14} y={bandYbot + 12} fontSize={9} fill={CP.band} fontWeight="bold">E_v</text>,
    );

    // Fermi level (flat at equilibrium)
    const efY = (bandYtop + bandYbot + bending) / 2;
    els.push(
      <line key="ef" x1={pLeft + 10} y1={efY} x2={nRight - 10} y2={efY}
        stroke={CP.fermi} strokeWidth={1.5} strokeDasharray="4,3" />,
      <text key="eflbl" x={nRight - 8} y={efY + 4} fontSize={9} fill={CP.fermi} fontWeight="bold">E_F</text>,
    );

    // Built-in field arrow
    els.push(
      <text key="fieldt" x={jMid} y={(bandYtop + bandYbot) / 2 + bending / 2} textAnchor="middle"
        fontSize={10} fontWeight="bold" fill={T.eo_gap}>← E_built-in</text>,
    );

    // Animated holes in p-region
    for (let i = 0; i < 6; i++) {
      const hx = pLeft + 15 + ((i * 48 + frame * 0.4) % (pRight - 30));
      const hy = bandYbot - 18 + Math.sin(frame * 0.05 + i) * 12;
      els.push(
        <circle key={`ph${i}`} cx={hx} cy={hy} r={5} fill="none" stroke={CP.hole} strokeWidth={2} />,
        <circle key={`phf${i}`} cx={hx} cy={hy} r={5} fill={CP.hole + "20"} />,
        <text key={`pht${i}`} x={hx} y={hy + 3.5} textAnchor="middle" fontSize={8} fill={CP.hole} fontWeight="bold">+</text>,
      );
    }

    // Animated electrons in n-region
    for (let i = 0; i < 6; i++) {
      const ex = nLeft + 15 + ((i * 44 + frame * 0.5) % (nRight - nLeft - 30));
      const ey = bandYtop + bending + 14 + Math.sin(frame * 0.06 + i * 1.1) * 10;
      els.push(
        <circle key={`ne${i}`} cx={ex} cy={ey} r={5} fill={CN.e} opacity={0.85} />,
        <text key={`net${i}`} x={ex} y={ey + 3.5} textAnchor="middle" fontSize={6} fill="#fff" fontWeight="bold">e⁻</text>,
      );
    }

    // Fixed ions in depletion region
    for (let i = 0; i < 4; i++) {
      const x = pRight + 6 + i * 14;
      els.push(
        <circle key={`ni${i}`} cx={x} cy={(bandYtop + bandYbot) / 2 + bending / 2} r={5} fill={CP.hole + "22"} stroke={CP.hole} strokeWidth={1.5} />,
        <text key={`nit${i}`} x={x} y={(bandYtop + bandYbot) / 2 + bending / 2 + 3.5} textAnchor="middle" fontSize={8} fill={CP.hole}>−</text>,
      );
    }
    for (let i = 0; i < 4; i++) {
      const x = jMid + 6 + i * 14;
      els.push(
        <circle key={`pi${i}`} cx={x} cy={(bandYtop + bandYbot) / 2 + bending / 2} r={5} fill={CN.donor + "22"} stroke={CN.donor} strokeWidth={1.5} />,
        <text key={`pit${i}`} x={x} y={(bandYtop + bandYbot) / 2 + bending / 2 + 3.5} textAnchor="middle" fontSize={8} fill={CN.donor}>+</text>,
      );
    }

    return els;
  };

  const dopant = tab === "ntype" ? nDopants[selN] : pDopants[selP];
  const C = tab === "ntype" ? CN : CP;

  return (
    <div style={{ padding: "20px 24px", fontFamily: "'Inter', sans-serif", color: T.ink, maxWidth: 980, margin: "0 auto" }}>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {[
          { id: "ntype",  label: "N-Type Semiconductor", color: CN.main },
          { id: "ptype",  label: "P-Type Semiconductor", color: CP.main },
          { id: "pnjunction", label: "p-n Junction",    color: T.eo_gap },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "11px 8px", border: "none",
            borderBottom: tab === t.id ? `3px solid ${t.color}` : "3px solid transparent",
            background: tab === t.id ? t.color + "12" : T.surface,
            cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t.id ? 700 : 500,
            fontSize: 12, color: tab === t.id ? t.color : T.muted,
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* N-Type tab */}
      {tab === "ntype" && (
        <div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>
            N-type doping in CdTe introduces donor atoms that contribute extra electrons to the conduction band. In CdTe, n-type behavior most commonly comes from Cl on Te sites (from CdCl₂ treatment) or In on Cd sites. Electrons are the <b>majority carriers</b>.
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto" }}>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ background: T.surface, borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: svgW }}>
                {renderNBand()}
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Select dopant in CdTe</div>
                {nDopants.map((d, i) => (
                  <button key={i} onClick={() => setSelN(i)} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8,
                    marginBottom: 5, cursor: "pointer", background: selN === i ? d.color + "15" : T.bg,
                    border: `1.5px solid ${selN === i ? d.color : T.border}`, fontFamily: "inherit", color: T.ink,
                  }}>
                    <span style={{ fontWeight: 700, color: d.color, marginRight: 8, fontFamily: "monospace" }}>{d.symbol}</span>
                    <span style={{ fontSize: 12 }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>({d.site})</span>
                  </button>
                ))}
              </div>
              <div style={{ background: nDopants[selN].color + "0d", borderRadius: 10, padding: 12, border: `1.5px solid ${nDopants[selN].color}33`, fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
                <b style={{ color: nDopants[selN].color }}>{nDopants[selN].name} ({nDopants[selN].site})</b><br />
                {nDopants[selN].detail}
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[["Ea", nDopants[selN].Ea], ["Valence e⁻", nDopants[selN].valence]].map(([k, v]) => (
                    <div key={k} style={{ background: T.surface, borderRadius: 6, padding: "3px 8px", fontSize: 10, border: `1px solid ${T.border}` }}>
                      <span style={{ color: T.muted }}>{k}: </span><b style={{ color: nDopants[selN].color, fontFamily: "monospace" }}>{v}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px", background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Doping concentration N_D</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input type="range" min={0} max={4} step={1} value={dopingLevel}
                  onChange={e => setDopingLevel(+e.target.value)} style={{ flex: 1, accentColor: CN.main }} />
                <b style={{ color: CN.main, fontFamily: "monospace", minWidth: 55, fontSize: 14 }}>{ndLabel} cm⁻³</b>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["Electrons n", ndLabel + " cm⁻³", CN.e, "majority"], ["Holes p", (n_h_n).toExponential(1) + " cm⁻³", "#ea580c", "minority"], ["n/nᵢ", "×" + nd.toExponential(0) , CN.fermi, "enhancement"]].map(([l, v, c, s]) => (
                  <div key={l} style={{ flex: "1 1 110px", background: c + "0d", borderRadius: 8, padding: "8px 10px", border: `1px solid ${c}33` }}>
                    <div style={{ fontSize: 10, color: T.muted }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: c, fontFamily: "monospace" }}>{v}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 280px", background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Key physics</div>
              {[
                { eq: "N_D ≈ n  (complete ionization at RT)", color: CN.e },
                { eq: "np = nᵢ²  (mass action law)", color: "#ea580c" },
                { eq: "E_F shifts toward E_c", color: CN.fermi },
                { eq: "σ = nqμₑ,  μₑ ≈ 1050 cm²/V·s in CdTe", color: CN.band },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ width: 3, borderRadius: 2, background: item.color, alignSelf: "stretch", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: item.color, fontWeight: 600 }}>{item.eq}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* P-Type tab */}
      {tab === "ptype" && (
        <div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>
            P-type doping in CdTe introduces acceptor atoms that create free holes in the valence band. In CdTe devices, p-type behavior comes primarily from Cu_Cd (back contact diffusion) and native V_Cd vacancies. Holes are the <b>majority carriers</b>.
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto" }}>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ background: T.surface, borderRadius: 10, border: `1px solid ${T.border}`, width: "100%", maxWidth: svgW }}>
                {renderPBand()}
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Select dopant in CdTe</div>
                {pDopants.map((d, i) => (
                  <button key={i} onClick={() => setSelP(i)} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8,
                    marginBottom: 5, cursor: "pointer", background: selP === i ? d.color + "15" : T.bg,
                    border: `1.5px solid ${selP === i ? d.color : T.border}`, fontFamily: "inherit", color: T.ink,
                  }}>
                    <span style={{ fontWeight: 700, color: d.color, marginRight: 8, fontFamily: "monospace" }}>{d.symbol}</span>
                    <span style={{ fontSize: 12 }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: T.muted, marginLeft: 6 }}>({d.site})</span>
                  </button>
                ))}
              </div>
              <div style={{ background: pDopants[selP].color + "0d", borderRadius: 10, padding: 12, border: `1.5px solid ${pDopants[selP].color}33`, fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
                <b style={{ color: pDopants[selP].color }}>{pDopants[selP].name} ({pDopants[selP].site})</b><br />
                {pDopants[selP].detail}
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[["Ea", pDopants[selP].Ea], ["Valence e⁻", pDopants[selP].valence]].map(([k, v]) => (
                    <div key={k} style={{ background: T.surface, borderRadius: 6, padding: "3px 8px", fontSize: 10, border: `1px solid ${T.border}` }}>
                      <span style={{ color: T.muted }}>{k}: </span><b style={{ color: pDopants[selP].color, fontFamily: "monospace" }}>{v}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px", background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Doping concentration N_A</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input type="range" min={0} max={4} step={1} value={dopingLevel}
                  onChange={e => setDopingLevel(+e.target.value)} style={{ flex: 1, accentColor: CP.main }} />
                <b style={{ color: CP.main, fontFamily: "monospace", minWidth: 55, fontSize: 14 }}>{ndLabel} cm⁻³</b>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["Holes p", ndLabel + " cm⁻³", CP.hole, "majority"], ["Electrons n", (n_e_p).toExponential(1) + " cm⁻³", CP.e, "minority"], ["p/nᵢ", "×" + nd.toExponential(0), CP.fermi, "enhancement"]].map(([l, v, c, s]) => (
                  <div key={l} style={{ flex: "1 1 110px", background: c + "0d", borderRadius: 8, padding: "8px 10px", border: `1px solid ${c}33` }}>
                    <div style={{ fontSize: 10, color: T.muted }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: c, fontFamily: "monospace" }}>{v}</div>
                    <div style={{ fontSize: 9, color: T.muted }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 280px", background: T.panel, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Key physics</div>
              {[
                { eq: "N_A ≈ p  (complete ionization at RT)", color: CP.hole },
                { eq: "np = nᵢ²  (mass action law)", color: CP.e },
                { eq: "E_F shifts toward E_v", color: CP.fermi },
                { eq: "σ = pqμₕ,  μₕ ≈ 100 cm²/V·s in CdTe", color: CP.band },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ width: 3, borderRadius: 2, background: item.color, alignSelf: "stretch", flexShrink: 0 }} />
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: item.color, fontWeight: 600 }}>{item.eq}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* p-n Junction tab */}
      {tab === "pnjunction" && (
        <div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>
            When p-type and n-type CdTe (or CdS/CdTe) are brought together, electrons diffuse from n→p and holes from p→n. This leaves behind fixed ionized charges forming a <b>depletion region</b> with a built-in electric field that drives carrier separation in the solar cell.
          </div>
          <svg viewBox={`0 0 ${jW} ${jH}`} style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`, display: "block", width: "100%", maxWidth: jW }}>
            {renderJunction()}
          </svg>
          <div style={{ marginTop: 16, display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { title: "Diffusion (before equilibrium)", desc: "Electrons from n-side diffuse into p-side; holes from p-side diffuse into n-side. This charge transfer depletes the region near the junction of free carriers.", color: CN.e },
              { title: "Built-in electric field", desc: "Fixed donor⁺ ions on n-side and acceptor⁻ ions on p-side create an electric field pointing n→p. This field sweeps photogenerated carriers in opposite directions.", color: T.eo_gap },
              { title: "Band bending", desc: "The built-in field raises the energy bands on the p-side relative to the n-side. At equilibrium, the Fermi level is flat across the junction — the thermodynamic condition for zero net current.", color: CP.fermi },
              { title: "In CdTe solar cells", desc: "The p-n junction is formed between p-type CdTe (Cu/V_Cd doped) and n-type CdS window layer. The built-in voltage Vbi ≈ 0.9–1.1 V drives carrier separation under illumination.", color: T.eo_hole },
            ].map(item => (
              <div key={item.title} style={{ flex: "1 1 200px", background: T.panel, borderRadius: 8, padding: "10px 12px", border: `1px solid ${item.color}22` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* References */}
      <div style={{ marginTop: 32, padding: "18px 20px", borderRadius: 12, background: T.panel, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.ink, marginBottom: 12, letterSpacing: 0.5 }}>REFERENCES</div>
        {[
          "Metzger, W.K. et al. Exceeding 20% Efficiency with In Situ Group V Doping in Polycrystalline CdTe Solar Cells. Nat. Energy 4, 837 (2019)",
          "Green, M.A. et al. Solar Cell Efficiency Tables (Version 64). Prog. Photovolt. Res. Appl. 32, 425 (2024)",
          "Wei, S.-H. & Zhang, S.B. Chemical Trends of Defect Formation and Doping Limits in II-VI Semiconductors. Phys. Rev. B 66, 155211 (2002)",
          "Yang, J. et al. Review on First-Principles Study of Defect Properties of CdTe as a Solar Cell Absorber. Semicond. Sci. Technol. 31, 083002 (2016)",
          "Burst, J.M. et al. CdTe Solar Cells with Open-Circuit Voltage Breaking the 1 V Barrier. Nat. Energy 1, 16015 (2016)",
        ].map((ref, i) => (
          <div key={i} style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginBottom: 6, paddingLeft: 16, textIndent: -16 }}>
            [{i + 1}] {ref}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CdTeSolarCellModule;
