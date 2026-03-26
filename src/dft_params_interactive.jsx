import React, { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DFT PARAMETERS — Interactive step-by-step (MLFF Pipeline style)
// ═══════════════════════════════════════════════════════════════════════════

class ParamErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 20, color: "#dc2626", fontSize: 13, fontFamily: "monospace", whiteSpace: "pre-wrap", background: "#fef2f2", borderRadius: 10, border: "1.5px solid #dc262630" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Error in Worked Example:</div>
        {this.state.error.toString()}
        <div style={{ marginTop: 8, color: "#999", fontSize: 11 }}>{this.state.error.stack}</div>
      </div>
    );
    return this.props.children;
  }
}

const T = {
  bg: "#f0f2f5", surface: "#ffffff", ink: "#1a1a2e", muted: "#6b7280",
  border: "#e0e0e0", dim: "#9ca3af",
  main: "#2563eb", eqn: "#7c3aed", xc: "#059669", basis: "#0891b2",
  warn: "#dc2626", accent: "#d97706", warm: "#b45309",
};

const mathBlock = {
  fontFamily: "'Courier New', monospace", fontSize: 12, lineHeight: 1.9,
  background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 10,
  padding: "14px 18px", marginBottom: 10, color: T.ink, whiteSpace: "pre-wrap",
};

const PARAM_SECTIONS = [
  { id: "bz",       label: "1. Brillouin Zone",   color: T.main  },
  { id: "kpoints",  label: "2. KPOINTS Mesh",     color: T.eqn   },
  { id: "encut",    label: "3. ENCUT",             color: T.basis  },
  { id: "ismear",   label: "4. ISMEAR & SIGMA",   color: T.xc    },
  { id: "algo",     label: "5. ALGO — SCF",        color: T.accent },
  { id: "ediff",    label: "6. EDIFF & EDIFFG",   color: T.main  },
  { id: "ibrion",   label: "7. IBRION & NSW",     color: T.warm  },
  { id: "prec",     label: "8. PREC",             color: T.warn  },
  { id: "lreal",    label: "9. LREAL",            color: T.eqn   },
  { id: "reciprocal", label: "10. Reciprocal Space", color: T.basis },
  { id: "cdte_walkthrough", label: "11. CdTe Full Walkthrough", color: T.xc },
  { id: "incar",    label: "12. INCAR Builder",   color: T.eqn   },
];

function Card({ title, color, children }) {
  return (
    <div style={{
      background: T.surface, borderRadius: 14, padding: "18px 22px",
      border: `1.5px solid ${color}20`, boxShadow: `0 2px 12px ${color}08`,
    }}>
      {title && (
        <div style={{ fontSize: 14, fontWeight: 800, color, marginBottom: 12,
          borderBottom: `2px solid ${color}20`, paddingBottom: 8 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit, desc }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color, fontFamily: "monospace" }}>
          {value}{unit || ""}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step || 1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
      {desc && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{desc}</div>}
    </div>
  );
}

function InfoBox({ color, children, icon }) {
  return (
    <div style={{
      background: color + "08", border: `1.5px solid ${color}20`,
      borderLeft: `4px solid ${color}`, borderRadius: 10,
      padding: "10px 14px", fontSize: 12, lineHeight: 1.7, color: T.ink,
    }}>
      {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
      {children}
    </div>
  );
}

// ──── Section 1: Brillouin Zone ────
function SecBZ() {
  const [bzFrame, setBzFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setBzFrame(f => (f + 1) % 200), 40); return () => clearInterval(id); }, []);
  const [lattice, setLattice] = useState("fcc");
  const lattices = {
    fcc: {
      name: "FCC (Face-Centered Cubic)",
      examples: "Cu, Al, Si, CdTe, GaAs",
      bz: "Truncated Octahedron",
      points: [
        { label: "Γ", x: 150, y: 150, desc: "Zone center (0,0,0)" },
        { label: "X", x: 260, y: 150, desc: "Face center (1,0,0)·π/a" },
        { label: "L", x: 85, y: 60, desc: "Body diagonal (½,½,½)·2π/a" },
        { label: "W", x: 225, y: 80, desc: "Edge midpoint (1,½,0)·π/a" },
        { label: "K", x: 220, y: 210, desc: "Hexagonal face edge" },
        { label: "U", x: 245, y: 130, desc: "Between X and W" },
      ],
      path: "Γ → X → W → K → Γ → L → U → W → L → K",
      edges: [[0,1],[1,3],[3,4],[4,0],[0,2],[2,5],[5,3],[3,2],[2,4]],
    },
    bcc: {
      name: "BCC (Body-Centered Cubic)",
      examples: "Fe, W, Cr, V, Na",
      bz: "Rhombic Dodecahedron",
      points: [
        { label: "Γ", x: 150, y: 150, desc: "Zone center (0,0,0)" },
        { label: "H", x: 260, y: 90, desc: "Corner point (1,0,0)·π/a" },
        { label: "P", x: 100, y: 65, desc: "Edge center (½,½,½)·π/a" },
        { label: "N", x: 230, y: 200, desc: "Face center (½,½,0)·π/a" },
      ],
      path: "Γ → H → N → Γ → P → H → P → N",
      edges: [[0,1],[1,3],[3,0],[0,2],[2,1],[2,3]],
    },
    hex: {
      name: "Hexagonal",
      examples: "Ti, Zn, CdS, GaN, hBN",
      bz: "Hexagonal Prism",
      points: [
        { label: "Γ", x: 150, y: 150, desc: "Zone center (0,0,0)" },
        { label: "M", x: 260, y: 150, desc: "Edge midpoint" },
        { label: "K", x: 225, y: 80, desc: "Hexagonal corner" },
        { label: "A", x: 150, y: 250, desc: "Top center (0,0,½)·2π/c" },
        { label: "L", x: 260, y: 250, desc: "Top edge midpoint" },
        { label: "H", x: 225, y: 220, desc: "Top hexagonal corner" },
      ],
      path: "Γ → M → K → Γ → A → L → H → A | L → M | K → H",
      edges: [[0,1],[1,2],[2,0],[0,3],[3,4],[4,5],[5,3],[1,4],[2,5]],
    },
  };

  const L = lattices[lattice];
  const [hlPt, setHlPt] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Simple analogy first */}
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          In a crystal, atoms repeat in a pattern (unit cell). Electrons are waves, and their wave behaviors also repeat.
          The <strong>Brillouin Zone</strong> is the smallest box that captures all <em>unique</em> wave behaviors — anything outside is just a copy. Think of it as the <strong>unit cell for electron waves</strong>.
        </div>
      </div>

      <Card title="Electron Waves Repeat in the BZ" color={T.main}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Watch: electron waves repeat every 2pi/a — the BZ captures one full period</div>
        <svg viewBox="0 0 400 120" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <circle key={i} cx={25 + i * 50} cy={60} r={8} fill={T.main + "30"} stroke={T.main} strokeWidth={1.5} />
          ))}
          <polyline fill="none" stroke={T.main} strokeWidth={2} opacity={0.8}
            points={Array.from({length: 360}, (_, i) => {
              const x = i * (400/360);
              const y = 60 + 25 * Math.sin((i / 50) * Math.PI * 2 - bzFrame * 0.06);
              return `${x},${y}`;
            }).join(" ")} />
          <rect x={25} y={20} width={200} height={80} fill={T.main + "08"} stroke={T.main} strokeWidth={1.5} strokeDasharray="6,3" rx={4} />
          <text x={125} y={16} textAnchor="middle" fontSize={10} fill={T.main} fontWeight="700">1st Brillouin Zone</text>
          <rect x={225} y={20} width={175} height={80} fill={T.eqn + "06"} stroke={T.eqn + "40"} strokeWidth={1} strokeDasharray="4,4" rx={4} />
          <text x={312} y={16} textAnchor="middle" fontSize={9} fill={T.eqn}>copy (repeats)</text>
        </svg>
      </Card>

      <Card title="What is the Brillouin Zone?" color={T.main}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          The <strong style={{ color: T.main }}>Brillouin Zone (BZ)</strong> is the Wigner-Seitz cell
          of the reciprocal lattice — the region of <strong>k-space</strong> closest to the origin.
          Every electronic property (band structure, DOS) is defined within this zone.
        </div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
          <InfoBox color={T.main}>
            <strong>Real space:</strong> atoms repeat with lattice vectors <strong>a₁, a₂, a₃</strong>
          </InfoBox>
          <InfoBox color={T.eqn}>
            <strong>Reciprocal space:</strong> Fourier transform gives <strong>b₁, b₂, b₃</strong> where bᵢ · aⱼ = 2πδᵢⱼ
          </InfoBox>
        </div>
      </Card>

      {/* What are the special points? */}
      <Card title={"\u0393, X, K, M, L — What Are These Points?"} color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          These are <strong>high-symmetry points</strong> — special locations inside the BZ where electron waves have the simplest behavior. Click any point on the BZ diagram above to see its coordinates.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "\u0393 (Gamma)", loc: "Center of BZ", simple: "All unit cells do the same thing. Longest wavelength. Like every atom in the crystal breathing in sync.", color: T.main },
            { label: "X", loc: "Center of a square face", simple: "Wave flips sign between neighboring cells in one direction. In Si, electrons collect near X (indirect bandgap).", color: T.xc },
            { label: "K", loc: "Corner of hexagonal face", simple: "The highest-symmetry corner. In graphene, K is where the famous Dirac cone lives — zero bandgap, massless electrons.", color: T.accent },
            { label: "M", loc: "Midpoint of an edge", simple: "Wave flips in two directions at once. Important in 2D materials and surface states.", color: T.warn },
            { label: "L", loc: "Center of hexagonal face (FCC)", simple: "Wave flips along body diagonal (111). In GaAs, L-valleys matter for high-field electron transport.", color: T.eqn },
          ].map(pt => (
            <div key={pt.label} style={{ background: pt.color + "08", border: `1.5px solid ${pt.color}20`, borderLeft: `4px solid ${pt.color}`, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: pt.color }}>{pt.label} <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 11 }}>— {pt.loc}</span></div>
              <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink, marginTop: 2 }}>{pt.simple}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, background: "#fef3c7", borderRadius: 8, padding: "10px 14px", border: "1px solid #f59e0b22" }}>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink }}>
            <strong style={{ color: "#b45309" }}>Room analogy:</strong> The BZ is a room. <strong>{"\u0393"}</strong> = center of the room. <strong>X</strong> = middle of a wall. <strong>M</strong> = where two walls meet at the floor. <strong>K</strong> = corner where walls meet. Band structure = walking from {"\u0393"}{"\u2192"}X{"\u2192"}M{"\u2192"}{"\u0393"} and measuring electron energy at each step.
          </div>
        </div>
      </Card>

      <Card title="Interactive BZ Explorer" color={T.main}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {Object.keys(lattices).map(k => (
            <button key={k} onClick={() => { setLattice(k); setHlPt(null); }} style={{
              padding: "6px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: lattice === k ? T.main : T.surface,
              color: lattice === k ? "#fff" : T.ink,
              border: `1.5px solid ${lattice === k ? T.main : T.border}`,
              fontWeight: 700, fontFamily: "inherit",
            }}>
              {k.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: T.main, marginBottom: 4 }}>{L.name}</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>Examples: {L.examples}</div>

        <svg viewBox="0 0 300 300" style={{
          width: "100%", maxWidth: 380, margin: "0 auto", display: "block",
          background: T.main + "05", borderRadius: 12, border: `1px solid ${T.main}15`,
        }}>
          {/* BZ boundary shape */}
          <polygon points={L.points.filter((_, i) => i > 0).map(p => `${p.x},${p.y}`).join(" ")}
            fill={T.main + "08"} stroke={T.main + "30"} strokeWidth={1.5} />
          {/* Edges */}
          {L.edges.map(([a, b], i) => (
            <line key={i} x1={L.points[a].x} y1={L.points[a].y}
              x2={L.points[b].x} y2={L.points[b].y}
              stroke={T.main + "40"} strokeWidth={1} strokeDasharray="4,4" />
          ))}
          {/* Points */}
          {L.points.map((p, i) => (
            <g key={i} onClick={() => setHlPt(i)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={hlPt === i ? 12 : 8}
                fill={i === 0 ? T.warn : hlPt === i ? T.main : T.eqn}
                opacity={hlPt === i ? 1 : 0.8} />
              <text x={p.x} y={p.y - 14} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={i === 0 ? T.warn : T.eqn}>
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {hlPt !== null && (
          <InfoBox color={T.eqn}>
            <strong>{L.points[hlPt].label}:</strong> {L.points[hlPt].desc}
          </InfoBox>
        )}

        <div style={{ marginTop: 10, fontSize: 12, color: T.muted }}>
          <strong>Standard path:</strong>{" "}
          <span style={{ fontFamily: "monospace", color: T.main, fontWeight: 700 }}>{L.path}</span>
        </div>
      </Card>

      <Card title="Why High-Symmetry Points Matter" color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Band structures are plotted along paths connecting high-symmetry points because:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {[
            { label: "Band extrema", desc: "VBM and CBM often lie at Γ, X, L, or K — determining the bandgap type (direct vs indirect)" },
            { label: "Symmetry labels", desc: "Each k-point has a point group — irreducible representations label band character (s, p, d)" },
            { label: "Effective mass", desc: "Curvature of E(k) at band edges gives m* = ℏ²/(∂²E/∂k²) — determines carrier mobility" },
          ].map(item => (
            <InfoBox key={item.label} color={T.eqn}>
              <strong>{item.label}:</strong> {item.desc}
            </InfoBox>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──── Section 2: KPOINTS ────
function SecKpoints() {
  const [kpFrame, setKpFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setKpFrame(f => (f + 1) % 150), 45); return () => clearInterval(id); }, []);
  const [kDensity, setKDensity] = useState(4);

  const convData = [
    { k: 1, E: -89.100, dE: "—" },
    { k: 2, E: -90.023, dE: "-0.923" },
    { k: 3, E: -90.312, dE: "-0.289" },
    { k: 4, E: -90.378, dE: "-0.066" },
    { k: 5, E: -90.393, dE: "-0.015" },
    { k: 6, E: -90.396, dE: "-0.003" },
    { k: 7, E: -90.397, dE: "-0.001" },
    { k: 8, E: -90.397, dE: "0.000" },
  ];

  const gridPoints = [];
  for (let i = 0; i < kDensity; i++) {
    for (let j = 0; j < kDensity; j++) {
      gridPoints.push({
        x: 30 + (i + 0.5) * (240 / kDensity),
        y: 30 + (j + 0.5) * (240 / kDensity),
      });
    }
  }

  const converged = kDensity >= 4;
  const entry = convData[Math.min(kDensity - 1, convData.length - 1)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Imagine you want to know the average temperature in a room. You could measure at just one spot (fast but inaccurate) or place thermometers on a grid across the room (slower but accurate). <strong>KPOINTS</strong> is that grid of measurement points inside the Brillouin Zone. More points = more accurate electron energies, but each point costs computation time. For metals (complex temperature landscape), you need a dense grid. For semiconductors (smooth landscape), a coarse grid works fine.
        </div>
      </div>

      <Card title="Watch k-points Sample the BZ" color={T.eqn}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Points appear one by one, sampling electron energies across the zone</div>
        <svg viewBox="0 0 300 200" style={{ width: "100%", maxWidth: 340, display: "block", margin: "0 auto", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <rect x={30} y={20} width={240} height={160} fill={T.eqn + "05"} stroke={T.eqn + "30"} strokeWidth={1.5} rx={6} />
          <text x={150} y={14} textAnchor="middle" fontSize={10} fill={T.eqn} fontWeight="700">Brillouin Zone</text>
          {[40, 60, 80].map(r => (
            <ellipse key={r} cx={150} cy={100} rx={r} ry={r * 0.7} fill="none" stroke={T.border} strokeWidth={0.5} />
          ))}
          {(() => {
            const pts = [];
            for (let ix = 0; ix < 5; ix++) for (let iy = 0; iy < 4; iy++) {
              pts.push({ x: 55 + ix * 50, y: 35 + iy * 42, idx: ix * 4 + iy });
            }
            const visibleCount = Math.min(pts.length, Math.floor(kpFrame / 6));
            return pts.map((p, i) => {
              const visible = i < visibleCount;
              const justAppeared = i === visibleCount - 1 && kpFrame % 6 < 3;
              return visible ? (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={justAppeared ? 8 : 5} fill={T.eqn} opacity={justAppeared ? 1 : 0.7} />
                  {justAppeared && <circle cx={p.x} cy={p.y} r={12} fill="none" stroke={T.eqn} strokeWidth={1.5} opacity={0.4} />}
                </g>
              ) : null;
            });
          })()}
          <circle cx={150} cy={100} r={6} fill={T.warn} />
          <text x={150} y={118} textAnchor="middle" fontSize={9} fill={T.warn} fontWeight="700">{"\u0393"}</text>
        </svg>
      </Card>

      <Card title="What is a k-point Mesh?" color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Integrals over the BZ (e.g., total energy, DOS) must be approximated by sampling at
          discrete <strong style={{ color: T.eqn }}>k-points</strong>. The
          <strong style={{ color: T.eqn }}> Monkhorst-Pack</strong> scheme creates a uniform
          Γ-centered grid of N×N×N points.
        </div>
        <div style={{ marginTop: 8, fontFamily: "Georgia, serif", fontSize: 14, textAlign: "center",
          background: T.eqn + "08", padding: "12px 16px", borderRadius: 10, color: T.eqn }}>
          E<sub>total</sub> = (1/N<sub>k</sub>) Σ<sub>k</sub> Σ<sub>n</sub> f<sub>nk</sub> ε<sub>nk</sub>
          &nbsp;&nbsp;→&nbsp;&nbsp; converges as N<sub>k</sub> → ∞
        </div>
      </Card>

      <Card title="Interactive k-Mesh" color={T.eqn}>
        <SliderRow label="k-mesh density" value={kDensity} min={1} max={8} step={1}
          onChange={setKDensity} color={T.eqn} unit={`×${kDensity}×${kDensity}`}
          desc={`${kDensity ** 3} total k-points (${kDensity}³) — ${converged ? "✓ converged" : "✗ not converged"}`}
        />

        <svg viewBox="0 0 300 300" style={{
          width: "100%", maxWidth: 320, margin: "0 auto", display: "block",
          background: T.eqn + "05", borderRadius: 12, border: `1px solid ${T.eqn}15`,
        }}>
          {/* BZ boundary */}
          <rect x={30} y={30} width={240} height={240} fill="none"
            stroke={T.eqn + "30"} strokeWidth={1.5} rx={4} />
          <text x={150} y={22} textAnchor="middle" fontSize={10} fill={T.muted}>k_y</text>
          <text x={280} y={155} textAnchor="start" fontSize={10} fill={T.muted}>k_x</text>
          {/* Grid lines */}
          {Array.from({ length: kDensity + 1 }, (_, i) => {
            const pos = 30 + i * (240 / kDensity);
            return (
              <g key={i}>
                <line x1={pos} y1={30} x2={pos} y2={270} stroke={T.eqn + "10"} strokeWidth={0.5} />
                <line x1={30} y1={pos} x2={270} y2={pos} stroke={T.eqn + "10"} strokeWidth={0.5} />
              </g>
            );
          })}
          {/* k-points */}
          {gridPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={Math.max(2, 8 - kDensity * 0.6)}
              fill={T.eqn} opacity={0.7} />
          ))}
          {/* Γ point */}
          <circle cx={150} cy={150} r={5} fill={T.warn} stroke="#fff" strokeWidth={1.5} />
          <text x={150} y={165} textAnchor="middle" fontSize={10} fill={T.warn} fontWeight={700}>Γ</text>
        </svg>

        <div style={{
          marginTop: 10, padding: "10px 14px", borderRadius: 10,
          background: converged ? T.xc + "08" : T.warn + "08",
          border: `1.5px solid ${converged ? T.xc : T.warn}20`,
          fontSize: 12, color: T.ink,
        }}>
          <strong style={{ color: converged ? T.xc : T.warn }}>
            {kDensity}×{kDensity}×{kDensity}:
          </strong>{" "}
          E = {entry.E.toFixed(3)} eV, ΔE = {entry.dE} eV
          {converged ? " — converged (|ΔE| < 1 meV/atom)" : " — not converged yet"}
        </div>
      </Card>

      <Card title="k-point Convergence Table" color={T.eqn}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          Example convergence data for a typical semiconductor
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.eqn}30` }}>
                {["Mesh", "k-pts", "E (eV)", "ΔE (eV)", "Status"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: T.eqn, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {convData.map((row, i) => {
                const isActive = i === kDensity - 1;
                const conv = Math.abs(parseFloat(row.dE) || 0) < 0.01 && i > 0;
                return (
                  <tr key={i} onClick={() => setKDensity(row.k)}
                    style={{
                      cursor: "pointer", borderBottom: `1px solid ${T.border}`,
                      background: isActive ? T.eqn + "10" : "transparent",
                    }}>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace", fontWeight: isActive ? 800 : 400 }}>
                      {row.k}×{row.k}×{row.k}
                    </td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.k ** 3}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{row.E.toFixed(3)}</td>
                    <td style={{ padding: "6px 8px", fontFamily: "monospace", color: conv ? T.xc : T.warn }}>
                      {row.dE}
                    </td>
                    <td style={{ padding: "6px 8px", fontWeight: 700, color: conv ? T.xc : T.warn }}>
                      {conv ? "✓" : i === 0 ? "—" : "✗"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="KPOINTS Rules of Thumb" color={T.main}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
          {[
            { label: "Metals", val: "Dense mesh (≥12×12×12)", desc: "Fermi surface needs fine sampling", color: T.main },
            { label: "Semiconductors", val: "Moderate (6×6×6)", desc: "Smooth bands, converge faster", color: T.xc },
            { label: "Molecules (Γ only)", val: "1×1×1", desc: "Large cell = small BZ = single k-point", color: T.accent },
            { label: "Slab / 2D", val: "N×N×1", desc: "No periodicity in vacuum direction", color: T.eqn },
          ].map(item => (
            <div key={item.label} style={{
              background: item.color + "08", border: `1px solid ${item.color}20`,
              borderRadius: 10, padding: "10px 14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: "3px 0" }}>{item.val}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──── Section 3: ENCUT ────
function SecEncut() {
  const [encFrame, setEncFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setEncFrame(f => (f + 1) % 180), 40); return () => clearInterval(id); }, []);
  const [encut, setEncut] = useState(400);

  const convData = [
    { encut: 200, E: -89.432, npw: 2100 },
    { encut: 250, E: -90.118, npw: 3200 },
    { encut: 300, E: -90.341, npw: 4600 },
    { encut: 350, E: -90.387, npw: 6300 },
    { encut: 400, E: -90.395, npw: 8200 },
    { encut: 450, E: -90.397, npw: 10500 },
    { encut: 500, E: -90.397, npw: 13100 },
    { encut: 550, E: -90.397, npw: 16000 },
    { encut: 600, E: -90.397, npw: 19200 },
  ];

  const current = convData.find(d => d.encut === encut) || convData[4];
  const prev = convData.find(d => d.encut === encut - 50);
  const dE = prev ? (current.E - prev.E).toFixed(3) : "—";
  const converged = Math.abs(parseFloat(dE) || 999) < 0.01;

  // SVG convergence plot
  const plotW = 280, plotH = 160, padL = 40, padB = 24;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Electron wavefunctions are built from plane waves (simple sine waves added together), like building any sound from musical notes. <strong>ENCUT</strong> sets the highest note you allow. Low ENCUT = only bass notes = blurry picture of the electron. High ENCUT = bass + treble = sharp, detailed picture. But more notes means more computation. You increase ENCUT until the total energy stops changing {"\u2014"} that means you have enough detail.
        </div>
      </div>

      <Card title="Building a Wavefunction from Plane Waves" color={T.basis}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>More plane waves (higher ENCUT) = sharper, more accurate wavefunction</div>
        <svg viewBox="0 0 400 140" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          {(() => {
            const nHarmonics = Math.min(8, Math.floor(encFrame / 20) + 1);
            const pts = Array.from({length: 380}, (_, i) => {
              const x = 10 + i;
              let y = 70;
              for (let h = 1; h <= nHarmonics; h++) {
                y += (30 / h) * Math.sin(h * i * Math.PI * 2 / 95 + encFrame * 0.02);
              }
              return `${x},${Math.max(10, Math.min(130, y))}`;
            });
            return (
              <g>
                <polyline fill="none" stroke={T.basis} strokeWidth={2.5} points={pts.join(" ")} />
                <text x={200} y={14} textAnchor="middle" fontSize={11} fill={T.basis} fontWeight="700">
                  {nHarmonics} plane wave{nHarmonics > 1 ? "s" : ""} (ENCUT ~ {nHarmonics * 50} eV)
                </text>
                {[100, 200, 300].map(ax => (
                  <g key={ax}>
                    <line x1={ax} y1={25} x2={ax} y2={130} stroke={T.warn + "20"} strokeWidth={1} strokeDasharray="3,3" />
                    <circle cx={ax} cy={130} r={5} fill={T.warn + "60"} />
                  </g>
                ))}
              </g>
            );
          })()}
        </svg>
      </Card>

      <Card title="What is ENCUT?" color={T.basis}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <strong style={{ color: T.basis }}>ENCUT</strong> (energy cutoff) determines how many
          plane waves are used to expand the Kohn-Sham orbitals. Only plane waves with
          kinetic energy <strong>|k+G|²/2 ≤ ENCUT</strong> are included.
        </div>
        <div style={{ marginTop: 10, fontFamily: "Georgia, serif", fontSize: 14, textAlign: "center",
          background: T.basis + "08", padding: "12px 16px", borderRadius: 10, color: T.basis }}>
          ψ<sub>nk</sub>(r) = Σ<sub>G</sub> c<sub>nk</sub>(G) e<sup>i(k+G)·r</sup>
          &nbsp;&nbsp;where&nbsp;&nbsp; |k+G|²/2 {"<"} E<sub>cut</sub>
        </div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
          <InfoBox color={T.basis}>
            <strong>Higher ENCUT</strong> → More plane waves → More accurate
          </InfoBox>
          <InfoBox color={T.accent}>
            <strong>Cost scales</strong> as N<sub>pw</sub> × N<sub>bands</sub> → O(N³)
          </InfoBox>
          <InfoBox color={T.warn}>
            <strong>Rule:</strong> E_cut = 1.3 × max recommended cutoff for your elements
          </InfoBox>
        </div>
      </Card>

      <Card title="Worked Example: What are k and G? Plane Wave at ENCUT = 5 eV" color={T.basis}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Let's build a plane wave step by step for a simple 1D crystal with lattice constant a = 3 Å.
        </div>
        <div style={mathBlock}>
          <span style={{ color: T.basis, fontWeight: 700 }}>Step 1: What is k? (Crystal momentum)</span><br />
          {"  k lives in the first Brillouin zone: -\u03C0/a < k \u2264 \u03C0/a"}<br />
          {"  For a = 3 \u00C5: -\u03C0/3 < k \u2264 \u03C0/3 \u00C5\u207B\u00B9 = -1.047 to +1.047 \u00C5\u207B\u00B9"}<br />
          {"  Pick k = 0.5 \u00C5\u207B\u00B9 (a specific k-point in the BZ)"}<br /><br />

          <span style={{ color: T.basis, fontWeight: 700 }}>Step 2: What is G? (Reciprocal lattice vector)</span><br />
          {"  G = n \u00D7 (2\u03C0/a) where n = 0, \u00B11, \u00B12, ..."}<br />
          {"  For a = 3 \u00C5: G = n \u00D7 2.094 \u00C5\u207B\u00B9"}<br />
          {"  G\u2080 = 0, G\u2081 = 2.094, G\u208B\u2081 = -2.094, G\u2082 = 4.189, ..."}<br /><br />

          <span style={{ color: T.basis, fontWeight: 700 }}>Step 3: The plane wave basis function</span><br />
          {"  Each basis function is: \u03C6_G(r) = (1/\u221A\u03A9) \u00D7 e^(i(k+G)\u00B7r)"}<br />
          {"  For k = 0.5, G\u2080 = 0:  \u03C6\u2080(r) = (1/\u221A\u03A9) \u00D7 e^(i \u00D7 0.5 \u00D7 r)"}<br />
          {"  For k = 0.5, G\u2081 = 2.094:  \u03C6\u2081(r) = (1/\u221A\u03A9) \u00D7 e^(i \u00D7 2.594 \u00D7 r)"}<br /><br />

          <span style={{ color: T.accent, fontWeight: 700 }}>Step 4: Which G's survive at ENCUT = 5 eV?</span><br />
          {"  Kinetic energy of plane wave: E_kin = \u210F\u00B2|k+G|\u00B2/(2m\u2091)"}<br />
          {"  Convert: E(eV) = 7.62 \u00D7 |k+G|\u00B2  (with k+G in \u00C5\u207B\u00B9)"}<br /><br />

          {"  G\u2080:  |k+G| = |0.5 + 0| = 0.500 \u00C5\u207B\u00B9  \u2192  E = 7.62 \u00D7 0.25 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"1.91 eV \u2713"}</span><br />
          {"  G\u2081:  |k+G| = |0.5 + 2.094| = 2.594 \u00C5\u207B\u00B9  \u2192  E = 7.62 \u00D7 6.73 = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"51.3 eV \u2717 (> 5 eV)"}</span><br />
          {"  G\u208B\u2081: |k+G| = |0.5 - 2.094| = 1.594 \u00C5\u207B\u00B9  \u2192  E = 7.62 \u00D7 2.54 = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"19.4 eV \u2717 (> 5 eV)"}</span><br /><br />

          <span style={{ color: T.eqn, fontWeight: 700 }}>Result: At ENCUT = 5 eV, ONLY G\u2080 survives! The wavefunction is just:</span><br />
          {"  \u03C8_k(r) = c\u2080 \u00D7 e^(i \u00D7 0.5 \u00D7 r)"}<br />
          {"  This is terrible \u2014 just one sine wave, no detail at all."}<br /><br />

          <span style={{ color: T.basis, fontWeight: 700 }}>At ENCUT = 400 eV:</span><br />
          {"  |k+G|_max = \u221A(2 \u00D7 400 / 7.62) = 10.25 \u00C5\u207B\u00B9"}<br />
          {"  G = n \u00D7 2.094 \u00C5\u207B\u00B9, so |k + G| = |0.5 + 2.094n|"}<br />
          {"  Include all n where 7.62 \u00D7 |0.5 + 2.094n|\u00B2 < 400 eV:"}<br /><br />
          {"  n = -5: k+G = 0.5 + (-10.470) = -9.970  \u2192 E = 7.62 \u00D7 99.4 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"757 eV \u2714"}</span><br />
          {"  n = -4: k+G = 0.5 + (-8.376)  = -7.876  \u2192 E = 7.62 \u00D7 62.0 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"473 eV \u2718 (>400)"}</span><br />
          {"  Wait \u2014 let\u2019s redo carefully:"}<br /><br />
          {"  n   |  G = 2.094n  |  k+G = 0.5+G  |  |k+G|\u00B2   |  E (eV)    | Include?"}<br />
          {"  \u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"}<br />
          {"  -5  |  -10.470     |  -9.970        |  99.40     |  757.4     | \u2718"}<br />
          {"  -4  |  -8.376      |  -7.876        |  62.03     |  472.7     | \u2718"}<br />
          {"  -3  |  -6.282      |  -5.782        |  33.43     |  254.9     | \u2714"}<br />
          {"  -2  |  -4.188      |  -3.688        |  13.60     |  103.6     | \u2714"}<br />
          {"  -1  |  -2.094      |  -1.594        |   2.54     |   19.4     | \u2714"}<br />
          {"   0  |   0.000      |   0.500        |   0.25     |    1.9     | \u2714"}<br />
          {"  +1  |  +2.094      |  +2.594        |   6.73     |   51.3     | \u2714"}<br />
          {"  +2  |  +4.188      |  +4.688        |  21.98     |  167.5     | \u2714"}<br />
          {"  +3  |  +6.282      |  +6.782        |  46.00     |  350.5     | \u2714"}<br />
          {"  +4  |  +8.376      |  +8.876        |  78.78     |  600.3     | \u2718"}<br />
          {"  +5  |  +10.470     |  +10.970       | 120.34     |  917.0     | \u2718"}<br /><br />
          <span style={{ color: T.basis, fontWeight: 700 }}>{"Result: n = -3 to +3 survive \u2192 7 plane waves (1D at this k-point)"}</span><br /><br />
          {"  The 7 plane waves are:"}<br />
          {"  \u03C6\u2083(r) = (1/\u221A\u03A9) e^(i\u00D7(-5.782)\u00D7r)   [high-freq, leftward]"}<br />
          {"  \u03C6\u2082(r) = (1/\u221A\u03A9) e^(i\u00D7(-3.688)\u00D7r)"}<br />
          {"  \u03C6\u2081(r) = (1/\u221A\u03A9) e^(i\u00D7(-1.594)\u00D7r)"}<br />
          {"  \u03C6\u2080(r) = (1/\u221A\u03A9) e^(i\u00D7(+0.500)\u00D7r)   [lowest energy, 1.9 eV]"}<br />
          {"  \u03C6\u2081(r) = (1/\u221A\u03A9) e^(i\u00D7(+2.594)\u00D7r)"}<br />
          {"  \u03C6\u2082(r) = (1/\u221A\u03A9) e^(i\u00D7(+4.688)\u00D7r)"}<br />
          {"  \u03C6\u2083(r) = (1/\u221A\u03A9) e^(i\u00D7(+6.782)\u00D7r)   [high-freq, rightward]"}<br /><br />
          {"  The KS orbital is then: \u03C8_k(r) = c\u2083\u03C6\u2083 + c\u2082\u03C6\u2082 + ... + c\u2083\u03C6\u2083"}<br />
          {"  DFT finds the coefficients c_n by diagonalizing a 7\u00D77 Hamiltonian matrix."}<br /><br />
          {"  In 3D: each direction gets ~7 G-values \u2192 7\u00D77\u00D77 = 343 G-vectors"}<br />
          {"  (inside a sphere, not a cube: actual count \u2248 "}<span style={{ color: T.basis, fontWeight: 700 }}>{"~2,700"}</span>{" for Si at 400 eV)"}<br /><br />

          <span style={{ color: T.muted }}>This is why ENCUT = 5 eV gives nonsense (1 plane wave) but ENCUT = 400 eV is enough for most materials.</span>
        </div>
      </Card>

      <Card title="Interactive Convergence Test" color={T.basis}>
        <SliderRow label="ENCUT" value={encut} min={200} max={600} step={50}
          onChange={setEncut} color={T.basis} unit=" eV"
          desc={`${current.npw.toLocaleString()} plane waves — ${converged ? "✓ converged" : "✗ not converged"}`}
        />

        <svg viewBox={`0 0 ${plotW + 50} ${plotH + 40}`} style={{
          width: "100%", maxWidth: 400, margin: "0 auto", display: "block",
          background: T.basis + "03", borderRadius: 12,
        }}>
          {/* Axes */}
          <line x1={padL} y1={plotH} x2={padL + plotW} y2={plotH}
            stroke={T.border} strokeWidth={1} />
          <line x1={padL} y1={0} x2={padL} y2={plotH}
            stroke={T.border} strokeWidth={1} />
          <text x={padL + plotW / 2} y={plotH + 34} textAnchor="middle" fontSize={10} fill={T.muted}>
            ENCUT (eV)
          </text>
          <text x={12} y={plotH / 2} textAnchor="middle" fontSize={10} fill={T.muted}
            transform={`rotate(-90, 12, ${plotH / 2})`}>
            E (eV)
          </text>

          {/* Data points and line */}
          {convData.map((d, i) => {
            const x = padL + ((d.encut - 200) / 400) * plotW;
            const y = plotH - ((d.E - (-89.5)) / ((-90.4) - (-89.5))) * (plotH - 20) - 10;
            const isActive = d.encut === encut;
            return (
              <g key={i}>
                {i > 0 && (
                  <line
                    x1={padL + ((convData[i - 1].encut - 200) / 400) * plotW}
                    y1={plotH - ((convData[i - 1].E - (-89.5)) / ((-90.4) - (-89.5))) * (plotH - 20) - 10}
                    x2={x} y2={y}
                    stroke={T.basis} strokeWidth={1.5} />
                )}
                <circle cx={x} cy={y} r={isActive ? 7 : 4}
                  fill={isActive ? T.basis : T.basis + "80"}
                  stroke={isActive ? "#fff" : "none"} strokeWidth={2} />
                {isActive && (
                  <text x={x} y={y - 12} textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={T.basis}>
                    {d.E.toFixed(3)} eV
                  </text>
                )}
                <text x={x} y={plotH + 14} textAnchor="middle" fontSize={8} fill={T.muted}>
                  {d.encut}
                </text>
              </g>
            );
          })}

          {/* Converged region */}
          <rect x={padL + ((400 - 200) / 400) * plotW} y={2} width={padL + plotW - (padL + ((400 - 200) / 400) * plotW)}
            height={plotH - 2} fill={T.xc + "08"} />
          <text x={padL + plotW - 30} y={16} fontSize={9} fill={T.xc} fontWeight={700}>converged</text>
        </svg>

        <div style={{
          marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8,
        }}>
          <div style={{ textAlign: "center", padding: 10, borderRadius: 10, background: T.basis + "08" }}>
            <div style={{ fontSize: 11, color: T.muted }}>Plane waves</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.basis }}>{current.npw.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, borderRadius: 10, background: T.basis + "08" }}>
            <div style={{ fontSize: 11, color: T.muted }}>Energy</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>{current.E.toFixed(3)} eV</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, borderRadius: 10,
            background: converged ? T.xc + "08" : T.warn + "08" }}>
            <div style={{ fontSize: 11, color: T.muted }}>ΔE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: converged ? T.xc : T.warn }}>{dE} eV</div>
          </div>
        </div>
      </Card>

      <Card title="Plane Wave Count" color={T.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          The number of plane waves in the basis set grows as <strong>ENCUT<sup>3/2</sup></strong> (volume of
          the sphere in reciprocal space). Doubling ENCUT increases N<sub>pw</sub> by ~2.8×.
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 100, padding: "0 10px" }}>
          {convData.map(d => {
            const h = (d.npw / 19200) * 90;
            const isActive = d.encut === encut;
            return (
              <div key={d.encut} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
                onClick={() => setEncut(d.encut)}>
                <div style={{ fontSize: 8, color: T.muted, marginBottom: 2 }}>{(d.npw / 1000).toFixed(1)}k</div>
                <div style={{
                  width: "100%", height: h, borderRadius: "4px 4px 0 0", cursor: "pointer",
                  background: isActive ? T.basis : T.basis + "40",
                  border: isActive ? `2px solid ${T.basis}` : "none",
                }} />
                <div style={{ fontSize: 8, color: isActive ? T.basis : T.muted, fontWeight: isActive ? 800 : 400, marginTop: 2 }}>
                  {d.encut}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* PREC and LREAL moved to their own tabs (8 and 9) */}
    </div>
  );
}

// ──── Section 4: ISMEAR & SIGMA ────
function SecIsmear() {
  const [smFrame, setSmFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setSmFrame(f => (f + 1) % 200), 35); return () => clearInterval(id); }, []);
  const [ismear, setIsmear] = useState(0);
  const [sigma, setSigma] = useState(0.05);

  const smearingTypes = [
    { val: -5, label: "Tetrahedron (ISMEAR = -5)", desc: "Exact integration with Blöchl corrections. Best for DOS and total energy of semiconductors/insulators. Requires ≥3 k-points per direction.", color: T.xc },
    { val: 0, label: "Gaussian (ISMEAR = 0)", desc: "Standard Gaussian smearing. Good for insulators and semiconductors. The SIGMA value is the smearing width.", color: T.main },
    { val: 1, label: "Methfessel-Paxton (ISMEAR = 1)", desc: "First-order MP smearing. Ideal for metals — forces are more accurate than Gaussian. Use SIGMA = 0.1-0.2 eV for metals.", color: T.eqn },
    { val: 2, label: "2nd Order MP (ISMEAR = 2)", desc: "Second-order Methfessel-Paxton. More accurate for metals but can give negative occupations. Rarely needed.", color: T.accent },
  ];

  // Gaussian smearing function for visualization
  const gaussPts = Array.from({ length: 100 }, (_, i) => {
    const e = -1 + i * 0.02; // -1 to +1 eV range around E_F
    const f = 0.5 * (1 - erf(e / (sigma * Math.sqrt(2) || 0.001)));
    return { e, f };
  });

  function erf(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  }

  const plotW = 260, plotH = 140;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          In a metal, some electron energy levels are right at the boundary between occupied and empty (the Fermi level). At exactly T = 0 K, the occupation jumps sharply from 1 to 0 {"\u2014"} like a light switch. This sharp jump makes the math unstable. <strong>Smearing</strong> turns the light switch into a dimmer {"\u2014"} a smooth transition. For insulators (big gap between occupied and empty), the switch is already far from the action, so a tiny smear (SIGMA = 0.05) works. For metals, you need more smoothing (SIGMA = 0.1{"\u2013"}0.2).
        </div>
      </div>

      <Card title="Step Function vs Smooth Smearing" color={T.xc}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Watch the sharp step (T=0) smoothly transition to Gaussian smearing as SIGMA increases</div>
        <svg viewBox="0 0 400 140" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          {(() => {
            const animSigma = 0.01 + 0.3 * (0.5 + 0.5 * Math.sin(smFrame * 0.04));
            const pts = Array.from({length: 200}, (_, i) => {
              const e = -1 + i * 0.01;
              const t = 1 / (1 + 0.3275911 * Math.abs(e / (animSigma * Math.SQRT2)));
              const erfVal = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-Math.pow(e / (animSigma * Math.SQRT2), 2));
              const erf2 = e >= 0 ? erfVal : -erfVal;
              const f = 0.5 * (1 - erf2);
              const x = 50 + i * 1.6;
              const y = 125 - f * 105;
              return `${x},${Math.max(10, Math.min(130, y))}`;
            });
            return (
              <g>
                <polyline fill="none" stroke={T.muted + "40"} strokeWidth={1.5} strokeDasharray="5,5"
                  points="50,20 210,20 210,125 370,125" />
                <text x={380} y={128} fontSize={8} fill={T.muted}>T=0</text>
                <polyline fill="none" stroke={T.xc} strokeWidth={2.5} points={pts.join(" ")} />
                <line x1={210} y1={10} x2={210} y2={130} stroke={T.warn + "50"} strokeWidth={1} strokeDasharray="3,3" />
                <text x={210} y={138} textAnchor="middle" fontSize={9} fill={T.warn} fontWeight="700">E_F</text>
                <text x={300} y={55} fontSize={11} fill={T.xc} fontWeight="700">{"\u03C3"} = {animSigma.toFixed(2)} eV</text>
                <text x={60} y={138} fontSize={9} fill={T.muted}>f({"\u03B5"}) = occupation</text>
              </g>
            );
          })()}
        </svg>
      </Card>

      <Card title="What is Smearing?" color={T.xc}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          At T = 0 K, the Fermi-Dirac distribution is a sharp step function — occupations are
          exactly 0 or 1. This causes problems for numerical integration (especially in metals where
          bands cross E<sub>F</sub>). <strong style={{ color: T.xc }}>Smearing</strong> replaces the step with a smooth function.
        </div>
        <div style={{ marginTop: 10, fontFamily: "Georgia, serif", fontSize: 14, textAlign: "center",
          background: T.xc + "08", padding: "12px 16px", borderRadius: 10, color: T.xc }}>
          f(ε) = ½ [1 − erf((ε − E<sub>F</sub>) / (σ√2))] &nbsp;&nbsp;← Gaussian smearing
        </div>
      </Card>

      <Card title="Interactive Smearing Selector" color={T.xc}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {smearingTypes.map(s => (
            <div key={s.val} onClick={() => setIsmear(s.val)} style={{
              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
              background: ismear === s.val ? s.color + "12" : T.surface,
              border: `1.5px solid ${ismear === s.val ? s.color : T.border}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ismear === s.val ? s.color : T.ink }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {ismear >= 0 && (
          <>
            <SliderRow label="SIGMA" value={sigma} min={0.01} max={0.5} step={0.01}
              onChange={setSigma} color={T.xc} unit=" eV"
              desc={sigma <= 0.05 ? "Small — sharp step, best for insulators" :
                    sigma <= 0.15 ? "Moderate — good for metals" :
                    "Large — very broad, may cause unphysical occupations"} />

            <svg viewBox={`0 0 ${plotW + 60} ${plotH + 40}`} style={{
              width: "100%", maxWidth: 380, margin: "0 auto", display: "block",
              background: T.xc + "03", borderRadius: 12,
            }}>
              <text x={plotW / 2 + 30} y={plotH + 34} textAnchor="middle" fontSize={10} fill={T.muted}>
                ε − E_F (eV)
              </text>
              <text x={12} y={plotH / 2} textAnchor="middle" fontSize={10} fill={T.muted}
                transform={`rotate(-90, 12, ${plotH / 2})`}>f(ε)</text>

              {/* Axes */}
              <line x1={30} y1={plotH} x2={plotW + 30} y2={plotH} stroke={T.border} strokeWidth={1} />
              <line x1={30} y1={0} x2={30} y2={plotH} stroke={T.border} strokeWidth={1} />

              {/* Step function (T=0) for reference */}
              <polyline fill="none" stroke={T.muted + "60"} strokeWidth={1} strokeDasharray="4,4"
                points={`30,10 ${plotW / 2 + 30},10 ${plotW / 2 + 30},${plotH} ${plotW + 30},${plotH}`} />
              <text x={plotW + 35} y={plotH - 4} fontSize={8} fill={T.muted}>T=0</text>

              {/* Gaussian smearing curve */}
              <polyline fill="none" stroke={T.xc} strokeWidth={2.5}
                points={gaussPts.map(p => {
                  const x = 30 + ((p.e + 1) / 2) * plotW;
                  const y = plotH - p.f * (plotH - 10);
                  return `${x},${y}`;
                }).join(" ")} />

              {/* E_F line */}
              <line x1={plotW / 2 + 30} y1={0} x2={plotW / 2 + 30} y2={plotH}
                stroke={T.warn + "40"} strokeWidth={1} strokeDasharray="3,3" />
              <text x={plotW / 2 + 30} y={plotH + 14} textAnchor="middle" fontSize={9}
                fill={T.warn} fontWeight={700}>E_F</text>

              {/* Sigma arrows */}
              <line x1={plotW / 2 + 30} y1={plotH / 2} x2={plotW / 2 + 30 + sigma * plotW / 2} y2={plotH / 2}
                stroke={T.xc} strokeWidth={2} markerEnd="url(#arrowhead)" />
              <text x={plotW / 2 + 38 + sigma * plotW / 4} y={plotH / 2 - 6} fontSize={9}
                fill={T.xc} fontWeight={700}>σ = {sigma.toFixed(2)} eV</text>
            </svg>
          </>
        )}
      </Card>

      <Card title="Quick Guide" color={T.main}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
          {[
            { sys: "Semiconductor / Insulator", rec: "ISMEAR = 0, SIGMA = 0.05", why: "Clean gap, no states at E_F", color: T.xc },
            { sys: "Metal", rec: "ISMEAR = 1, SIGMA = 0.1-0.2", why: "States at E_F need smooth smearing", color: T.main },
            { sys: "DOS calculation", rec: "ISMEAR = -5", why: "Tetrahedron method gives exact DOS", color: T.eqn },
            { sys: "Molecular / Γ-only", rec: "ISMEAR = 0, SIGMA = 0.01", why: "Discrete levels, minimal smearing", color: T.accent },
          ].map(item => (
            <div key={item.sys} style={{
              background: item.color + "08", border: `1px solid ${item.color}20`,
              borderRadius: 10, padding: "10px 14px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.sys}</div>
              <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", color: T.ink, margin: "4px 0" }}>{item.rec}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{item.why}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──── Section 5: ALGO ────
function SecAlgo() {
  const [algo, setAlgo] = useState("Normal");

  const algos = [
    { val: "Normal", label: "Davidson (ALGO = Normal)", iters: 15,
      desc: "Blocked Davidson iteration. Default and robust. Good for most systems. Each step diagonalizes in the current subspace, then expands with residual vectors.",
      convergence: [1.0, 0.32, 0.10, 0.032, 0.010, 0.0032, 0.0010, 0.00032, 0.00010, 0.000032, 0.000010, 0.0000032, 0.0000010, 0.00000032, 0.00000010],
      color: T.main, pros: "Robust, well-tested", cons: "Slower per step, more memory" },
    { val: "Fast", label: "RMM-DIIS + Davidson (ALGO = Fast)", iters: 10,
      desc: "Alternates Davidson (first few) and RMM-DIIS. Faster for large systems. Can be less stable for difficult cases.",
      convergence: [1.0, 0.25, 0.06, 0.015, 0.004, 0.001, 0.00025, 0.00006, 0.000015, 0.000004],
      color: T.xc, pros: "2-4× faster", cons: "Can diverge for tricky systems" },
    { val: "VeryFast", label: "RMM-DIIS (ALGO = VeryFast)", iters: 8,
      desc: "Pure RMM-DIIS (Residual Minimization). Fastest but least stable. Best for continuation runs where wavefunctions are already close.",
      convergence: [1.0, 0.18, 0.03, 0.005, 0.0009, 0.00015, 0.000025, 0.000004],
      color: T.accent, pros: "Fastest", cons: "Fragile, needs good starting guess" },
    { val: "All", label: "All-Bands CG (ALGO = All)", iters: 20,
      desc: "Conjugate gradient on all bands simultaneously. Most memory-efficient. Very robust but slow. Good for small systems or when memory is limited.",
      convergence: [1.0, 0.50, 0.25, 0.13, 0.06, 0.03, 0.015, 0.008, 0.004, 0.002, 0.001, 0.0005, 0.00025, 0.00013, 0.00006, 0.00003, 0.000015, 0.000008, 0.000004, 0.000002],
      color: T.eqn, pros: "Low memory, very robust", cons: "Slow convergence" },
  ];

  const sel = algos.find(a => a.val === algo);
  const plotW = 280, plotH = 120;

  // Animation for algo visualization
  const [aFrame, setAFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Simple analogy */}
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          DFT solves equations by guessing an answer, checking how wrong it is, and improving — over and over. <strong>ALGO</strong> controls <em>how</em> it improves each guess. Think of finding the lowest point in a valley while blindfolded:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, marginTop: 10 }}>
          {[
            { algo: "Normal", analogy: "Take careful steps downhill. Before each step, feel the ground in many directions, pick the best. Slow steps but always goes downhill.", color: T.main },
            { algo: "Fast", analogy: "Start with careful steps, then switch to sliding downhill once you know the general direction. Faster but might overshoot on bumpy terrain.", color: T.xc },
            { algo: "VeryFast", analogy: "Just slide downhill immediately — no careful feeling first. Fastest if you are already near the bottom. Falls off a cliff if you start far away.", color: T.accent },
            { algo: "All", analogy: "Walk slowly and steadily along the steepest slope. Uses the least memory (one direction at a time). Very safe but takes many small steps.", color: T.eqn },
          ].map(a => (
            <div key={a.algo} style={{ background: a.color + "08", border: `1.5px solid ${a.color}20`, borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: a.color, marginBottom: 2 }}>{a.algo}</div>
              <div style={{ fontSize: 11, lineHeight: 1.6, color: T.ink }}>{a.analogy}</div>
            </div>
          ))}
        </div>
      </div>

      <Card title="SCF Algorithms" color={T.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          The <strong style={{ color: T.accent }}>ALGO</strong> tag controls which iterative algorithm
          solves the Kohn-Sham equations at each SCF step. The goal: minimize the energy functional
          with respect to orbital coefficients.
        </div>
      </Card>

      <Card title={`Animation: ${sel.label}`} color={sel.color}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>
          {algo === "Normal" ? "Davidson: careful probing in many directions before each step" :
           algo === "Fast" ? "Fast: starts careful (Davidson), then switches to quick sliding (RMM-DIIS)" :
           algo === "VeryFast" ? "VeryFast: rockets toward minimum but may overshoot and oscillate" :
           "All-bands CG: zigzag path — alternating conjugate directions, many small steps"}
        </div>
        <svg viewBox="0 0 400 180" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <path d="M0,30 Q100,40 150,80 Q200,130 250,140 Q300,130 350,80 Q400,40 400,30" fill={sel.color + "08"} stroke={sel.color + "30"} strokeWidth={1.5} />
          <circle cx={250} cy={140} r={4} fill={T.xc} />
          <text x={250} y={158} textAnchor="middle" fontSize={9} fill={T.xc} fontWeight="700">E_min</text>

          {algo === "Normal" && (() => {
            const phase = aFrame % 120;
            const step = Math.floor(phase / 30);
            const subPhase = (phase % 30) / 30;
            const positions = [{x:60, y:42}, {x:120, y:65}, {x:180, y:110}, {x:230, y:142}];
            const pos = positions[Math.min(step, positions.length - 1)];
            const nextPos = positions[Math.min(step + 1, positions.length - 1)];
            const cx = pos.x + (nextPos.x - pos.x) * subPhase;
            const cy = pos.y + (nextPos.y - pos.y) * subPhase;
            return (
              <g>
                {subPhase < 0.4 && [0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
                  const rad = angle * Math.PI / 180;
                  const len = 20;
                  return <line key={angle} x1={pos.x} y1={pos.y} x2={pos.x + Math.cos(rad) * len} y2={pos.y + Math.sin(rad) * len} stroke={T.main + "40"} strokeWidth={1} />;
                })}
                {positions.slice(0, step + 1).map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3} fill={T.main + "40"} />
                ))}
                <circle cx={cx} cy={cy} r={7} fill={T.main} />
                <text x={cx} y={cy - 12} textAnchor="middle" fontSize={8} fill={T.main} fontWeight="700">probe {step + 1}</text>
              </g>
            );
          })()}

          {algo === "Fast" && (() => {
            const phase = aFrame % 120;
            const switchPoint = 50;
            const isDavidson = phase < switchPoint;
            let cx, cy;
            if (isDavidson) {
              const t = phase / switchPoint;
              cx = 50 + t * 120;
              cy = 35 + t * 60;
            } else {
              const t = (phase - switchPoint) / (120 - switchPoint);
              cx = 170 + t * 80;
              cy = 95 + t * 55 + Math.sin(t * 6) * 5;
            }
            return (
              <g>
                <polyline fill="none" stroke={T.xc + "40"} strokeWidth={1.5} strokeDasharray="4,4"
                  points="50,35 90,50 130,70 170,95" />
                {!isDavidson && <polyline fill="none" stroke={T.xc} strokeWidth={2}
                  points={`170,85 ${cx},${cy}`} />}
                <rect x={cx - 30} y={cy - 28} width={60} height={14} rx={4} fill={isDavidson ? T.main + "20" : T.accent + "20"} />
                <text x={cx} y={cy - 18} textAnchor="middle" fontSize={8} fill={isDavidson ? T.main : T.accent} fontWeight="700">
                  {isDavidson ? "Davidson" : "RMM-DIIS"}
                </text>
                <circle cx={cx} cy={cy} r={7} fill={T.xc} />
              </g>
            );
          })()}

          {algo === "VeryFast" && (() => {
            const phase = aFrame % 120;
            const t = phase / 120;
            const cx = 350 + (250 - 350) * t + Math.sin(t * 12) * 30 * (1 - t);
            const valleyY = 30 + 120 * Math.exp(-((cx - 250) ** 2) / 5000);
            const cy = valleyY - 5;
            return (
              <g>
                <polyline fill="none" stroke={T.accent + "50"} strokeWidth={1.5}
                  points={Array.from({length: Math.floor(phase / 2)}, (_, i) => {
                    const tt = (i * 2) / 120;
                    const xx = 350 + (250 - 350) * tt + Math.sin(tt * 12) * 30 * (1 - tt);
                    const yy = 30 + 120 * Math.exp(-((xx - 250) ** 2) / 5000) - 5;
                    return `${xx},${yy}`;
                  }).join(" ")} />
                <circle cx={cx} cy={cy} r={7} fill={T.accent} />
                {t < 0.5 && <text x={cx} y={cy - 14} textAnchor="middle" fontSize={8} fill={T.warn} fontWeight="700">overshoot!</text>}
              </g>
            );
          })()}

          {algo === "All" && (() => {
            const phase = aFrame % 120;
            const zigzag = [
              {x: 40, y: 35}, {x: 80, y: 45}, {x: 100, y: 52},
              {x: 130, y: 62}, {x: 145, y: 72}, {x: 165, y: 88},
              {x: 180, y: 102}, {x: 195, y: 118}, {x: 210, y: 132},
              {x: 225, y: 142}, {x: 240, y: 147}, {x: 250, y: 150}
            ];
            const visCount = Math.min(zigzag.length, Math.floor(phase / 10) + 1);
            const pts = zigzag.slice(0, visCount);
            const last = pts[pts.length - 1];
            return (
              <g>
                {pts.length > 1 && <polyline fill="none" stroke={T.eqn + "50"} strokeWidth={1.5}
                  points={pts.map(p => `${p.x},${p.y}`).join(" ")} />}
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 7 : 3} fill={i === pts.length - 1 ? T.eqn : T.eqn + "50"} />
                ))}
                <text x={last.x} y={last.y - 12} textAnchor="middle" fontSize={8} fill={T.eqn} fontWeight="700">step {visCount}</text>
              </g>
            );
          })()}
        </svg>
      </Card>

      <Card title="Compare Algorithms" color={T.accent}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          {algos.map(a => (
            <div key={a.val} onClick={() => setAlgo(a.val)} style={{
              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
              background: algo === a.val ? a.color + "12" : T.surface,
              border: `1.5px solid ${algo === a.val ? a.color : T.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: algo === a.val ? a.color : T.ink }}>{a.label}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{a.desc}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: a.color, minWidth: 50, textAlign: "right" }}>
                ~{a.iters}
              </div>
            </div>
          ))}
        </div>

        {/* Convergence plot */}
        <div style={{ fontSize: 12, fontWeight: 700, color: sel.color, marginBottom: 6 }}>
          Convergence: {sel.label}
        </div>
        <svg viewBox={`0 0 ${plotW + 50} ${plotH + 30}`} style={{
          width: "100%", maxWidth: 380, margin: "0 auto", display: "block",
          background: sel.color + "03", borderRadius: 12,
        }}>
          <text x={plotW / 2 + 25} y={plotH + 26} textAnchor="middle" fontSize={10} fill={T.muted}>
            SCF iteration
          </text>
          <line x1={30} y1={plotH} x2={plotW + 30} y2={plotH} stroke={T.border} strokeWidth={1} />
          <line x1={30} y1={0} x2={30} y2={plotH} stroke={T.border} strokeWidth={1} />
          <text x={12} y={plotH / 2} textAnchor="middle" fontSize={9} fill={T.muted}
            transform={`rotate(-90, 12, ${plotH / 2})`}>log₁₀(ΔE)</text>

          {/* EDIFF threshold line */}
          <line x1={30} y1={plotH * 0.6} x2={plotW + 30} y2={plotH * 0.6}
            stroke={T.warn + "40"} strokeWidth={1} strokeDasharray="4,4" />
          <text x={plotW + 34} y={plotH * 0.6 + 4} fontSize={8} fill={T.warn}>EDIFF</text>

          {/* Convergence curve */}
          <polyline fill="none" stroke={sel.color} strokeWidth={2.5}
            points={sel.convergence.map((v, i) => {
              const x = 30 + (i / (sel.convergence.length - 1)) * plotW;
              const logV = Math.log10(Math.max(v, 1e-8));
              const y = plotH - ((-logV) / 8) * plotH;
              return `${x},${Math.max(2, Math.min(plotH - 2, y))}`;
            }).join(" ")} />

          {sel.convergence.map((v, i) => {
            const x = 30 + (i / (sel.convergence.length - 1)) * plotW;
            const logV = Math.log10(Math.max(v, 1e-8));
            const y = plotH - ((-logV) / 8) * plotH;
            return (
              <circle key={i} cx={x} cy={Math.max(2, Math.min(plotH - 2, y))} r={3}
                fill={sel.color} opacity={0.7} />
            );
          })}
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, marginTop: 10 }}>
          <InfoBox color={T.xc}><strong>Pros:</strong> {sel.pros}</InfoBox>
          <InfoBox color={T.warn}><strong>Cons:</strong> {sel.cons}</InfoBox>
        </div>
      </Card>

      <Card title="Recommendation" color={T.main}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
          {[
            { label: "Default choice", val: "ALGO = Fast", desc: "Good balance of speed and stability for most calculations" },
            { label: "Difficult convergence", val: "ALGO = Normal", desc: "Switch if Fast fails to converge (magnetic, strongly correlated)" },
            { label: "Hybrid functionals", val: "ALGO = All or Damped", desc: "CG or damped MD needed for exact exchange calculations" },
            { label: "Large systems", val: "ALGO = Fast + NELM = 200", desc: "More iterations allowed for 100+ atom cells" },
          ].map(item => (
            <InfoBox key={item.label} color={T.main}>
              <div style={{ fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 800, margin: "2px 0" }}>{item.val}</div>
              <div style={{ color: T.muted }}>{item.desc}</div>
            </InfoBox>
          ))}
        </div>
      </Card>

      <Card title="How Each Algorithm Works — Step by Step with Numbers" color={T.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Imagine you have a 3×3 Hamiltonian matrix (a toy version of the real 2700×2700 matrix).
          You need the lowest eigenvalue (ground state energy). Here's how each ALGO approaches it:
        </div>
        <div style={mathBlock}>
          <span style={{ color: T.main, fontWeight: 700 }}>ALGO = Normal (Block Davidson)</span><br />
          {"  H = [[5, 1, 0], [1, 3, 1], [0, 1, 4]]  (Hamiltonian)"}<br />
          {"  Guess: v\u2081 = [1, 0, 0] (start with first orbital)"}<br /><br />
          {"  Iteration 1:"}<br />
          {"    Hv\u2081 = [5, 1, 0]  \u2192  Rayleigh quotient \u03C1 = v\u2081\u00B7Hv\u2081/v\u2081\u00B7v\u2081 = 5.00"}<br />
          {"    Residual: r = Hv\u2081 - \u03C1v\u2081 = [0, 1, 0]  \u2192  |r| = 1.00"}<br />
          {"    Expand subspace: solve H in span{v\u2081, r} \u2192 2\u00D72 problem"}<br />
          {"    New eigenvalue estimate: "}<span style={{ color: T.main, fontWeight: 700 }}>{"\u03C1 = 2.38"}</span><br /><br />
          {"  Iteration 2:"}<br />
          {"    New residual |r| = 0.12"}<br />
          {"    Expand to 3\u00D73 subspace \u2192 "}<span style={{ color: T.main, fontWeight: 700 }}>{"\u03C1 = 2.268"}</span><br /><br />
          {"  Iteration 3:"}<br />
          {"    |r| = 0.003 \u2192 "}<span style={{ color: T.basis, fontWeight: 700 }}>{"\u03C1 = 2.2679 \u2713 converged"}</span><br />
          {"  Exact lowest eigenvalue: 2.2679. Davidson found it in 3 iterations."}<br /><br />
          <span style={{ color: T.muted }}>Davidson is robust: guaranteed to converge, but builds a growing subspace (memory).</span>
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.accent, fontWeight: 700 }}>ALGO = VeryFast (RMM-DIIS)</span><br />
          {"  Same H, same guess v\u2081 = [1, 0, 0]"}<br /><br />
          {"  Uses residual minimization: minimize |Hv - \u03B5v|\u00B2 directly"}<br />
          {"  Keeps last 4-5 trial vectors, fits a polynomial to predict the next"}<br /><br />
          {"  Iteration 1: \u03C1 = 5.00, |r| = 1.00"}<br />
          {"  Iteration 2: \u03C1 = 2.15 (jumps aggressively!), |r| = 0.35"}<br />
          {"  Iteration 3: \u03C1 = 2.31 (overshot, oscillating), |r| = 0.18"}<br />
          {"  Iteration 4: \u03C1 = 2.27, |r| = 0.01 \u2192 "}<span style={{ color: T.basis, fontWeight: 700 }}>{"converged \u2713"}</span><br /><br />
          <span style={{ color: T.muted }}>RMM-DIIS can overshoot but uses constant memory. Don't use from random start!</span>
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>ALGO = All (Conjugate Gradient)</span><br />
          {"  Steepest descent with conjugate correction:"}<br /><br />
          {"  Iteration 1: gradient g\u2081 = Hv\u2081 - \u03C1v\u2081 = [0, 1, 0]"}<br />
          {"    Search direction d\u2081 = -g\u2081 = [0, -1, 0]"}<br />
          {"    Line search along d\u2081 \u2192 \u03C1 = 3.00"}<br /><br />
          {"  Iteration 2: g\u2082 = new gradient"}<br />
          {"    \u03B2 = |g\u2082|\u00B2/|g\u2081|\u00B2 (conjugate correction)"}<br />
          {"    d\u2082 = -g\u2082 + \u03B2 \u00D7 d\u2081 (conjugate direction)"}<br />
          {"    Line search \u2192 \u03C1 = 2.45"}<br /><br />
          {"  ... iterations 3-7: slowly zigzags to minimum ..."}<br />
          {"  Iteration 8: \u03C1 = 2.2680 \u2192 "}<span style={{ color: T.basis, fontWeight: 700 }}>{"converged \u2713"}</span><br /><br />
          <span style={{ color: T.muted }}>CG uses minimal memory (one direction at a time) but needs many iterations. Best for huge systems.</span>
        </div>
      </Card>
    </div>
  );
}

// ──── Section 6: EDIFF & EDIFFG ────
function SecEdiff() {
  const [edFrame, setEdFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setEdFrame(f => (f + 1) % 180), 40); return () => clearInterval(id); }, []);
  const [ediff, setEdiff] = useState(-6);
  const [ediffg, setEdiffg] = useState(-0.02);

  const ediffVal = Math.pow(10, ediff);
  const ediffLabel = `1E${ediff}`;

  const scfSteps = {
    "-4": { steps: 8, desc: "Fast but inaccurate — forces noisy" },
    "-5": { steps: 12, desc: "Moderate — OK for quick screening" },
    "-6": { steps: 15, desc: "Standard — good balance of accuracy and speed" },
    "-7": { steps: 19, desc: "Tight — needed for phonons, elastic constants" },
    "-8": { steps: 24, desc: "Very tight — for benchmarks and reference calculations" },
  };

  const cur = scfSteps[String(ediff)] || scfSteps["-6"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          DFT has two nested loops, like focusing a camera on a moving target. <strong>EDIFF</strong> (inner loop): how sharp the focus needs to be each time you take a photo {"\u2014"} 10{"\u207B\u2076"} eV means the energy must settle to within a millionth of an eV before you trust it. <strong>EDIFFG</strong> (outer loop): how still the target needs to be before you stop {"\u2014"} it controls when the atoms have relaxed enough. Tighter values = sharper results but more computation steps.
        </div>
      </div>

      <Card title="Nested Convergence Loops" color={T.main}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Inner SCF loop converges electrons (fast), then outer ionic loop moves atoms (slow)</div>
        <svg viewBox="0 0 400 150" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          {(() => {
            const ionicStep = Math.floor(edFrame / 45);
            const scfPhase = (edFrame % 45) / 45;
            const scfRadius = 40 - scfPhase * 30;
            const ionicPositions = [{x:80, y:80}, {x:160, y:65}, {x:240, y:50}, {x:300, y:40}];
            const pos = ionicPositions[Math.min(ionicStep, ionicPositions.length - 1)];
            return (
              <g>
                {ionicPositions.slice(0, Math.min(ionicStep + 1, ionicPositions.length)).map((p, i) => (
                  <g key={i}>
                    {i > 0 && <line x1={ionicPositions[i-1].x} y1={ionicPositions[i-1].y} x2={p.x} y2={p.y} stroke={T.accent + "40"} strokeWidth={1.5} />}
                    <circle cx={p.x} cy={p.y} r={3} fill={T.accent + "60"} />
                  </g>
                ))}
                <circle cx={pos.x} cy={pos.y} r={scfRadius} fill="none" stroke={T.main} strokeWidth={2} opacity={0.6} />
                <circle cx={pos.x} cy={pos.y} r={Math.max(3, scfRadius * 0.3)} fill="none" stroke={T.main + "40"} strokeWidth={1} />
                <circle cx={pos.x} cy={pos.y} r={6} fill={T.main} />
                <text x={pos.x + scfRadius + 8} y={pos.y + 4} fontSize={9} fill={T.main} fontWeight="700">
                  SCF {Math.floor(scfPhase * 15) + 1}
                </text>
                <text x={20} y={140} fontSize={10} fill={T.accent} fontWeight="700">Ionic step {ionicStep + 1}</text>
                <text x={350} y={35} fontSize={9} fill={T.xc} fontWeight="700">converged</text>
                <circle cx={340} cy={32} r={4} fill={T.xc + "40"} />
              </g>
            );
          })()}
        </svg>
      </Card>

      <Card title="SCF vs Ionic Convergence" color={T.main}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          DFT has <strong>two nested loops</strong>:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, marginTop: 8 }}>
          <div style={{
            background: T.main + "08", border: `2px solid ${T.main}30`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.main }}>Inner Loop (SCF)</div>
            <div style={{ fontSize: 12, color: T.ink, marginTop: 6, lineHeight: 1.6 }}>
              Fixed ions → solve for electron density<br />
              <strong>EDIFF</strong> = energy change between SCF steps<br />
              <span style={{ fontFamily: "monospace", color: T.main }}>|E<sub>n</sub> − E<sub>n-1</sub>| {"<"} EDIFF</span>
            </div>
          </div>
          <div style={{
            background: T.accent + "08", border: `2px solid ${T.accent}30`,
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.accent }}>Outer Loop (Ionic)</div>
            <div style={{ fontSize: 12, color: T.ink, marginTop: 6, lineHeight: 1.6 }}>
              Move ions using forces → re-solve SCF<br />
              <strong>EDIFFG</strong> = force/energy threshold<br />
              <span style={{ fontFamily: "monospace", color: T.accent }}>
                {ediffg < 0 ? "|F_max|" : "ΔE"} {"<"} |EDIFFG|
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="EDIFF — SCF Convergence" color={T.main}>
        <SliderRow label="EDIFF (log₁₀)" value={ediff} min={-8} max={-4} step={1}
          onChange={setEdiff} color={T.main} unit={` → ${ediffLabel} eV`}
          desc={`~${cur.steps} SCF steps — ${cur.desc}`} />

        <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 11, color: T.muted, width: 60 }}>Precision:</div>
          {[-4, -5, -6, -7, -8].map(e => (
            <div key={e} onClick={() => setEdiff(e)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 8, textAlign: "center", cursor: "pointer",
              background: ediff === e ? T.main + "15" : T.main + "05",
              border: `1.5px solid ${ediff === e ? T.main : T.border}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: ediff === e ? T.main : T.muted }}>
                10<sup>{e}</sup>
              </div>
              <div style={{ fontSize: 8, color: T.muted, marginTop: 2 }}>
                {e === -4 ? "rough" : e === -5 ? "ok" : e === -6 ? "std" : e === -7 ? "tight" : "ref"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="EDIFFG — Ionic Convergence" color={T.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.7, color: T.ink, marginBottom: 10 }}>
          <strong style={{ color: T.accent }}>EDIFFG {"<"} 0:</strong> converge on <em>forces</em> (recommended) — |EDIFFG| = max force (eV/Å)<br />
          <strong style={{ color: T.accent }}>EDIFFG {">"} 0:</strong> converge on <em>energy change</em> — less reliable
        </div>

        <SliderRow label="EDIFFG" value={ediffg} min={-0.1} max={-0.005} step={0.005}
          onChange={setEdiffg} color={T.accent} unit=" eV/Å"
          desc={Math.abs(ediffg) <= 0.01 ? "Tight — good for defect calculations" :
                Math.abs(ediffg) <= 0.03 ? "Standard — OK for most relaxations" :
                "Loose — fast screening only"} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginTop: 8 }}>
          {[
            { label: "Screening", val: "-0.05", desc: "Quick check", color: T.muted },
            { label: "Standard", val: "-0.02", desc: "Most calculations", color: T.accent },
            { label: "Accurate", val: "-0.01", desc: "Defects, phonons", color: T.xc },
          ].map(item => (
            <div key={item.label} onClick={() => setEdiffg(parseFloat(item.val))} style={{
              textAlign: "center", padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              background: item.color + "08", border: `1.5px solid ${item.color}20`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: T.ink }}>{item.val}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──── Section 7: IBRION & NSW ────
function SecIbrion() {
  const [ibFrame, setIbFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setIbFrame(f => (f + 1) % 160), 40); return () => clearInterval(id); }, []);
  const [ibrion, setIbrion] = useState(2);

  const methods = [
    { val: -1, label: "IBRION = -1: No Update", desc: "Ions are NOT moved. Use for single-point energy calculations (SCF only).",
      steps: ["Fixed ion positions", "Run SCF → get E, forces", "Done — no relaxation"],
      useCase: "Single-point energy, DOS, band structure", color: T.muted },
    { val: 1, label: "IBRION = 1: RMM-DIIS (Quasi-Newton)", desc: "Uses ionic history to build an approximate Hessian. Fast convergence near minimum. Can fail far from minimum.",
      steps: ["Compute forces F₁", "Build approximate Hessian from history", "Quasi-Newton step: Δx = H⁻¹·F", "Update positions, re-run SCF", "Repeat until |F| < EDIFFG"],
      useCase: "Near-equilibrium structures, continuation runs", color: T.eqn },
    { val: 2, label: "IBRION = 2: Conjugate Gradient", desc: "Robust, no history needed. Each step: line minimization along conjugate direction. Standard workhorse for relaxation.",
      steps: ["Compute forces F₁ (steepest descent direction)", "Line minimization along d₁", "Compute new forces F₂", "Build conjugate direction: d₂ = F₂ + β·d₁", "Line minimize along d₂", "Repeat until |F| < EDIFFG"],
      useCase: "Default for structure relaxation, always works", color: T.xc },
    { val: 5, label: "IBRION = 5: Finite Differences (Phonons)", desc: "Displaces each atom ±δ in x,y,z and computes forces to build the force constant matrix (Hessian). Used for phonon calculations.",
      steps: ["Equilibrium: compute F₀", "Displace atom 1 by +δx → forces", "Displace atom 1 by −δx → forces", "Φᵢⱼ = −(F⁺ − F⁻) / 2δ", "Repeat for all atoms × 3 directions", "Diagonalize → phonon frequencies"],
      useCase: "Phonon frequencies, thermodynamics, IR spectra", color: T.accent },
    { val: 6, label: "IBRION = 6: Finite Differences (Elastic)", desc: "Applies strain deformations ±ε to the cell to compute the elastic tensor Cᵢⱼ. Needs ISIF = 3.",
      steps: ["Equilibrium structure", "Apply strain ε₁₁ = +δ → relax ions → stress", "Apply strain ε₁₁ = −δ → relax ions → stress", "Cᵢⱼ = −(σ⁺ − σ⁻) / 2δ", "Repeat for all 6 independent strains", "Full 6×6 elastic tensor"],
      useCase: "Elastic constants, bulk modulus, mechanical properties", color: T.warm },
  ];

  const sel = methods.find(m => m.val === ibrion);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          After solving for electrons (SCF), you need to move the atoms to their lowest-energy positions. <strong>IBRION</strong> controls how atoms move. Think of placing a ball on a hilly surface: <strong>IBRION = 2</strong> (Conjugate Gradient) rolls the ball downhill step by step {"\u2014"} always works, standard choice. <strong>IBRION = 1</strong> (Quasi-Newton) remembers the shape of the hill from previous steps and takes smarter jumps {"\u2014"} faster near the bottom but can overshoot. <strong>IBRION = 5/6</strong> don{"'"}t relax at all {"\u2014"} they wiggle each atom slightly to measure the hill{"'"}s curvature (phonons, elastic constants). <strong>NSW</strong> = maximum number of steps allowed.
        </div>
      </div>

      <Card title="Ionic Relaxation Animation" color={T.warm}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>
          {ibrion === 2 ? "Conjugate Gradient: steady downhill steps with line minimization" :
           ibrion === 1 ? "Quasi-Newton: uses history to take smarter, larger steps" :
           ibrion === -1 ? "No movement — atoms stay fixed (single-point calculation)" :
           "Finite differences: wiggle each atom to measure curvature (forces)"}
        </div>
        <svg viewBox="0 0 400 170" style={{ width: "100%", maxWidth: 440, display: "block", background: "#fafafa", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <path d="M10,20 Q80,30 140,60 Q200,110 260,130 Q310,120 350,90 Q380,60 400,20" fill={T.warm + "08"} stroke={T.warm + "30"} strokeWidth={1.5} />
          <circle cx={260} cy={130} r={4} fill={T.xc} />
          <text x={260} y={148} textAnchor="middle" fontSize={9} fill={T.xc} fontWeight="700">E_min</text>

          {ibrion === -1 && (
            <g>
              <circle cx={100} cy={55} r={8} fill={T.muted} />
              <text x={100} y={78} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight="700">fixed (no relaxation)</text>
            </g>
          )}

          {ibrion === 2 && (() => {
            const steps = [{x:50, y:22}, {x:100, y:45}, {x:150, y:70}, {x:200, y:100}, {x:240, y:125}, {x:260, y:130}];
            const visCount = Math.min(steps.length, Math.floor(ibFrame / 25) + 1);
            const pts = steps.slice(0, visCount);
            const last = pts[pts.length - 1];
            return (
              <g>
                {pts.length > 1 && <polyline fill="none" stroke={T.xc + "60"} strokeWidth={1.5} points={pts.map(p => `${p.x},${p.y}`).join(" ")} />}
                {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 7 : 3} fill={i === pts.length - 1 ? T.xc : T.xc + "40"} />)}
                <text x={last.x} y={last.y - 14} textAnchor="middle" fontSize={8} fill={T.xc} fontWeight="700">CG step {visCount}</text>
              </g>
            );
          })()}

          {ibrion === 1 && (() => {
            const steps = [{x:50, y:22}, {x:160, y:75}, {x:245, y:127}, {x:260, y:130}];
            const visCount = Math.min(steps.length, Math.floor(ibFrame / 35) + 1);
            const pts = steps.slice(0, visCount);
            const last = pts[pts.length - 1];
            return (
              <g>
                {pts.length > 1 && <polyline fill="none" stroke={T.eqn + "60"} strokeWidth={1.5} points={pts.map(p => `${p.x},${p.y}`).join(" ")} />}
                {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 7 : 3} fill={i === pts.length - 1 ? T.eqn : T.eqn + "40"} />)}
                <text x={last.x} y={last.y - 14} textAnchor="middle" fontSize={8} fill={T.eqn} fontWeight="700">QN step {visCount}</text>
              </g>
            );
          })()}

          {(ibrion === 5 || ibrion === 6) && (() => {
            const atomX = 260;
            const atomY = 130;
            const disp = 15 * Math.sin(ibFrame * 0.12);
            return (
              <g>
                <circle cx={atomX + disp} cy={atomY} r={7} fill={T.accent} />
                <line x1={atomX - 18} y1={atomY} x2={atomX + 18} y2={atomY} stroke={T.accent + "40"} strokeWidth={1} strokeDasharray="3,3" />
                <text x={atomX} y={atomY - 18} textAnchor="middle" fontSize={9} fill={T.accent} fontWeight="700">
                  {ibrion === 5 ? "measuring force constants" : "measuring elastic response"}
                </text>
                <line x1={atomX} y1={atomY + 12} x2={atomX + 15} y2={atomY + 12} stroke={T.warn} strokeWidth={1.5} />
                <line x1={atomX} y1={atomY + 12} x2={atomX - 15} y2={atomY + 12} stroke={T.warn} strokeWidth={1.5} />
                <text x={atomX + 20} y={atomY + 16} fontSize={8} fill={T.warn}>+{"\u03B4"}</text>
                <text x={atomX - 28} y={atomY + 16} fontSize={8} fill={T.warn}>-{"\u03B4"}</text>
              </g>
            );
          })()}
        </svg>
      </Card>

      <Card title="Ionic Relaxation Methods" color={T.warm}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <strong style={{ color: T.warm }}>IBRION</strong> controls how ions are moved between
          SCF cycles. <strong style={{ color: T.warm }}>NSW</strong> sets the maximum number of
          ionic steps (0 = single-point, 50-100 for relaxation).
        </div>
      </Card>

      <Card title="Select Method" color={T.warm}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {methods.map(m => (
            <div key={m.val} onClick={() => setIbrion(m.val)} style={{
              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
              background: ibrion === m.val ? m.color + "12" : T.surface,
              border: `1.5px solid ${ibrion === m.val ? m.color : T.border}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ibrion === m.val ? m.color : T.ink }}>
                {m.label}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={`Step-by-Step: ${sel.label}`} color={sel.color}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sel.steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              padding: "8px 12px", borderRadius: 8,
              background: sel.color + "06", borderLeft: `3px solid ${sel.color}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: sel.color, color: "#fff", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
        <InfoBox color={sel.color}>
          <strong>Best for:</strong> {sel.useCase}
        </InfoBox>
      </Card>

      <Card title="ISIF — What Gets Relaxed?" color={T.eqn}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.eqn}30` }}>
                {["ISIF", "Forces", "Stress", "Ions", "Cell Shape", "Cell Volume", "Use Case"].map(h => (
                  <th key={h} style={{ padding: "6px 6px", textAlign: "center", color: T.eqn, fontWeight: 700, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { isif: 0, f: "✓", s: "✗", i: "✓", sh: "✗", v: "✗", use: "MD simulation" },
                { isif: 2, f: "✓", s: "✓", i: "✓", sh: "✗", v: "✗", use: "Fixed cell, relax ions" },
                { isif: 3, f: "✓", s: "✓", i: "✓", sh: "✓", v: "✓", use: "Full relaxation" },
                { isif: 4, f: "✓", s: "✓", i: "✓", sh: "✓", v: "✗", use: "Fixed volume, relax shape" },
                { isif: 7, f: "✓", s: "✓", i: "✗", sh: "✗", v: "✓", use: "Volume only (EOS)" },
              ].map(row => (
                <tr key={row.isif} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "6px", textAlign: "center", fontWeight: 800, color: T.eqn }}>{row.isif}</td>
                  {[row.f, row.s, row.i, row.sh, row.v].map((v, j) => (
                    <td key={j} style={{ padding: "6px", textAlign: "center", color: v === "✓" ? T.xc : T.warn }}>{v}</td>
                  ))}
                  <td style={{ padding: "6px", fontSize: 11, color: T.muted }}>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ──── Section 8: PREC ────
function SecPrec() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Think of PREC as choosing between a low-resolution and high-resolution camera. <strong>Normal</strong> is like a 720p camera — fine for viewing the big picture but blurs fine details. <strong>Accurate</strong> is 4K — every detail is sharp. The FFT grid is the pixel count: more grid points = more pixels = no aliasing artifacts. For forces and phonons, you need every pixel to be right.
        </div>
      </div>

      <Card title="What PREC Controls" color={T.warn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          <strong style={{ color: T.warn }}>PREC</strong> sets the FFT grid density used to represent the charge density and potentials in real space.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { prec: "Normal", grid: "2 × G_max", desc: "Minimum grid that avoids obvious errors. The charge density is smooth enough but forces can have wrap-around errors of ~10 meV/Å.", when: "Quick tests, initial relaxations where forces don't need to be exact.", color: T.muted },
            { prec: "Accurate", grid: "2.5 × G_max (25% more points)", desc: "Eliminates wrap-around (aliasing) errors. Forces are correct to ~0.1 meV/Å. Stress tensor is reliable.", when: "Production relaxations, phonons, elastic constants, formation energies, anything published.", color: T.warn },
            { prec: "High", grid: "3 × G_max (50% more points)", desc: "Overkill for most purposes. Only needed for very hard pseudopotentials or debugging.", when: "Almost never. Only if Accurate still shows grid artifacts.", color: T.accent },
          ].map(item => (
            <div key={item.prec} style={{ background: item.color + "08", border: `1px solid ${item.color}22`, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: "monospace" }}>PREC = {item.prec}</div>
                <div style={{ fontSize: 11, color: item.color }}>{item.grid}</div>
              </div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>{item.desc}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontStyle: "italic" }}>When to use: {item.when}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Wrap-Around Error — Why PREC Matters" color={T.warn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          When you multiply two functions on an FFT grid (e.g., density × potential), high-frequency components can alias into low frequencies if the grid is too coarse. This is called <strong>wrap-around error</strong>.
        </div>
        <div style={mathBlock}>
          <span style={{ color: T.warn, fontWeight: 700 }}>Example: Si phonon frequency at Gamma</span><br /><br />
          {"  PREC = Normal:   FFT grid 24×24×24"}<br />
          {"  ω(Γ₂₅') = 15.21 THz"}<br /><br />
          {"  PREC = Accurate: FFT grid 32×32×32"}<br />
          {"  ω(Γ₂₅') = 15.53 THz"}<br /><br />
          {"  Experiment:      ω(Γ₂₅') = 15.53 THz"}<br /><br />
          {"  PREC = Normal gives "}<span style={{ color: T.warn, fontWeight: 700 }}>{"2.1% error"}</span>{" — entirely from aliasing!"}<br /><br />
          <span style={{ color: T.warn, fontWeight: 700 }}>CdTe formation energy:</span><br />
          {"  PREC = Normal:   ΔH_f = -0.48 eV/atom"}<br />
          {"  PREC = Accurate: ΔH_f = -0.52 eV/atom"}<br />
          {"  The 40 meV/atom difference can flip stability predictions on the convex hull!"}
        </div>
      </Card>

      <Card title="Recommendation" color={T.basis}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <strong style={{ color: T.basis }}>Always use PREC = Accurate</strong> for production calculations. The ~10% speed cost is negligible compared to the risk of publishing wrong phonon frequencies or incorrect phase stability.
          The only exception: quick pre-relaxations where you just need atoms roughly in place before a final Accurate run.
        </div>
      </Card>
    </div>
  );
}

// ──── Section 9: LREAL ────
function SecLreal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          PAW projections compute how much of each atomic orbital is "inside" each atom. <strong>LREAL = .FALSE.</strong> does this calculation exactly using all plane waves (reciprocal space). <strong>LREAL = Auto</strong> approximates the same thing by only looking within a sphere around each atom (real space) — much faster for big cells, but the sphere has a finite radius, so you miss contributions from the edges. For small cells, the sphere overlaps with its own periodic image, causing errors.
        </div>
      </div>

      <Card title="LREAL: Real vs Reciprocal Space Projections" color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          The PAW method needs to evaluate overlap integrals {"<"}p_i|ψ_nk{">"} between projector functions p_i and KS orbitals.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { val: ".FALSE.", desc: "Compute projections in reciprocal space. Exact — no truncation error. Cost scales as N_pw × N_proj. Dominant cost for small cells.", when: "< 20 atoms. Always for phonons, elastic constants, and high-precision work.", color: T.eqn },
            { val: "Auto", desc: "Compute projections in real space within a cutoff sphere around each atom. The radius is set automatically. Scales as N_atoms × N_grid_in_sphere. Much faster for large cells.", when: "> 50 atoms. MD runs, large supercell relaxations, defect calculations.", color: T.accent },
            { val: ".TRUE.", desc: "Same as Auto but with a user-defined (or default) cutoff. Rarely used — Auto picks good cutoffs automatically.", when: "Almost never. Use Auto instead.", color: T.muted },
          ].map(item => (
            <div key={item.val} style={{ background: item.color + "08", border: `1px solid ${item.color}22`, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: item.color, fontFamily: "monospace", marginBottom: 4 }}>LREAL = {item.val}</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>{item.desc}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontStyle: "italic" }}>When: {item.when}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Numerical Impact" color={T.eqn}>
        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>8-atom Si cell (small — LREAL matters!):</span><br /><br />
          {"  LREAL = .FALSE.: E = -43.3847 eV  (exact)"}<br />
          {"  LREAL = Auto:    E = -43.3812 eV  (real-space)"}<br />
          {"  Error: "}<span style={{ color: T.warn, fontWeight: 700 }}>{"3.5 meV/atom"}</span><br />
          {"  → Unacceptable for formation energies (need < 1 meV/atom)"}<br /><br />
          <span style={{ color: T.eqn, fontWeight: 700 }}>64-atom Si supercell (medium):</span><br /><br />
          {"  LREAL = .FALSE.: E = -347.076 eV, time = 8.2 min/SCF"}<br />
          {"  LREAL = Auto:    E = -347.074 eV, time = 3.1 min/SCF"}<br />
          {"  Error: "}<span style={{ color: T.basis, fontWeight: 700 }}>{"0.03 meV/atom — negligible"}</span><br />
          {"  Speedup: "}<span style={{ color: T.basis, fontWeight: 700 }}>{"2.6×"}</span><br /><br />
          <span style={{ color: T.eqn, fontWeight: 700 }}>216-atom CdTe supercell (large — LREAL essential):</span><br /><br />
          {"  LREAL = .FALSE.: 12 min/SCF step"}<br />
          {"  LREAL = Auto:    4 min/SCF step"}<br />
          {"  Error: 0.2 meV/atom"}<br />
          {"  Speedup: "}<span style={{ color: T.basis, fontWeight: 700 }}>{"3× — saves hours over 50+ ionic steps"}</span>
        </div>
      </Card>

      <Card title="Decision Flowchart" color={T.basis}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { q: "Is your cell < 20 atoms?", a: "→ LREAL = .FALSE. (always)", color: T.eqn },
            { q: "Is your cell 20–50 atoms?", a: "→ Test both. If energy differs < 1 meV/atom, use Auto.", color: T.accent },
            { q: "Is your cell > 50 atoms?", a: "→ LREAL = Auto (necessary for speed)", color: T.basis },
            { q: "Are you computing phonons or elastic constants?", a: "→ LREAL = .FALSE. regardless of cell size", color: T.warn },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", background: item.color + "06", borderRadius: 8, padding: "8px 12px", border: `1px solid ${item.color}18` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color, minWidth: 220 }}>{item.q}</div>
              <div style={{ fontSize: 11, color: T.ink }}>{item.a}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ──── Section 10: Reciprocal Space in DFT ────
function SecReciprocal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Why Reciprocal Space?</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          In a periodic crystal, the electron density repeats every unit cell. Computing anything in real space means dealing with an infinite crystal. But in reciprocal space (Fourier space), periodicity becomes a discrete set of G-vectors — turning an infinite problem into a finite sum. This is why DFT codes like VASP work in reciprocal space: convolutions become multiplications, derivatives become multiplications by ik, and the Kohn-Sham equations become a matrix eigenvalue problem you can solve on a computer.
        </div>
      </div>

      <Card title="Real Space → Reciprocal Space: The Fourier Transform" color={T.basis}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          Any periodic function f(r) (like electron density) can be written as a sum of plane waves:
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, textAlign: "center",
          background: T.basis + "08", padding: "14px 18px", borderRadius: 10, color: T.basis, marginBottom: 12 }}>
          f(r) = Σ<sub>G</sub> f̃(G) e<sup>iG·r</sup>
          &nbsp;&nbsp;&nbsp;⟺&nbsp;&nbsp;&nbsp;
          f̃(G) = (1/Ω) ∫<sub>cell</sub> f(r) e<sup>−iG·r</sup> dr
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ background: T.main + "08", border: `1px solid ${T.main}22`, borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.main, marginBottom: 4 }}>Real Space</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
              • Functions defined on a 3D grid of points<br />
              • Convolution (Hartree potential) = expensive O(N²)<br />
              • Derivatives = finite differences (approximate)<br />
              • Kinetic energy = hard to compute<br />
              • Good for: local operations (V_xc, forces)
            </div>
          </div>
          <div style={{ background: T.basis + "08", border: `1px solid ${T.basis}22`, borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.basis, marginBottom: 4 }}>Reciprocal Space</div>
            <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
              • Functions stored as Fourier coefficients f̃(G)<br />
              • Convolution → simple multiplication O(N)<br />
              • Derivatives → multiply by iG (exact!)<br />
              • Kinetic energy = |k+G|²/2 (diagonal!)<br />
              • Good for: Hartree potential, kinetic energy, plane wave basis
            </div>
          </div>
        </div>
        <div style={{ background: T.accent + "08", border: `1px solid ${T.accent}22`, borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 4 }}>The Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            VASP switches between real and reciprocal space using the <strong>Fast Fourier Transform (FFT)</strong> — O(N log N) cost. It computes V_xc in real space (local), V_Hartree in reciprocal space (convolution → multiplication), and kinetic energy in reciprocal space (diagonal). This dual approach is the engine of every plane-wave DFT code.
          </div>
        </div>
      </Card>

      <Card title="Complete Worked Example: Si Unit Cell" color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 8 }}>
          Let{"'"}s convert a real-space quantity to reciprocal space step by step for a silicon unit cell.
        </div>
        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>Step 1: Define the real-space lattice</span><br /><br />
          {"  Si FCC: a = 5.43 Å"}<br />
          {"  Primitive vectors (FCC):"}<br />
          {"    a₁ = (a/2)(0, 1, 1) = (0, 2.715, 2.715) Å"}<br />
          {"    a₂ = (a/2)(1, 0, 1) = (2.715, 0, 2.715) Å"}<br />
          {"    a₃ = (a/2)(1, 1, 0) = (2.715, 2.715, 0) Å"}<br /><br />
          {"  Unit cell volume: Ω = a₁ · (a₂ × a₃) = a³/4 = "}<span style={{ color: T.eqn, fontWeight: 700 }}>{"40.03 ų"}</span><br /><br />

          <span style={{ color: T.eqn, fontWeight: 700 }}>Step 2: Compute reciprocal lattice vectors</span><br /><br />
          {"  b₁ = 2π(a₂ × a₃) / Ω"}<br /><br />
          {"  a₂ × a₃ = |i        j        k      |"}<br />
          {"             |2.715    0        2.715  |"}<br />
          {"             |2.715    2.715    0      |"}<br />
          {"           = i(0×0 − 2.715×2.715) − j(2.715×0 − 2.715×2.715) + k(2.715×2.715 − 0×2.715)"}<br />
          {"           = (−7.371, 7.371, 7.371) ų"}<br /><br />
          {"  b₁ = 2π × (−7.371, 7.371, 7.371) / 40.03"}<br />
          {"     = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"(−1.157, 1.157, 1.157) Å⁻¹"}</span><br /><br />
          {"  Similarly:"}<br />
          {"  b₂ = (1.157, −1.157, 1.157) Å⁻¹"}<br />
          {"  b₃ = (1.157, 1.157, −1.157) Å⁻¹"}<br /><br />
          {"  Check: a₁ · b₁ = 0×(−1.157) + 2.715×1.157 + 2.715×1.157"}<br />
          {"        = 0 + 3.142 + 3.142 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"6.283 = 2π ✓"}</span><br />
          {"  Check: a₁ · b₂ = 0×1.157 + 2.715×(−1.157) + 2.715×1.157 = 0 ✓"}<br /><br />

          <span style={{ color: T.eqn, fontWeight: 700 }}>Step 3: Build the G-vector set (determines ENCUT)</span><br /><br />
          {"  G = n₁b₁ + n₂b₂ + n₃b₃  where n₁, n₂, n₃ are integers"}<br /><br />
          {"  G(0,0,0) = (0, 0, 0)  →  |G|² = 0"}<br />
          {"  G(1,0,0) = (−1.157, 1.157, 1.157)  →  |G|² = 4.02 Å⁻²"}<br />
          {"  G(1,1,0) = (0, 0, 2.314)  →  |G|² = 5.35 Å⁻²"}<br />
          {"  G(1,1,1) = (1.157, 1.157, 1.157)  →  |G|² = 4.02 Å⁻²"}<br /><br />
          {"  Kinetic energy: E_G = ℏ²|G|²/(2mₑ) = 7.62 × |G|² (eV, with G in Å⁻¹)"}<br /><br />
          {"  G(0,0,0): E = 0 eV           ✓ always included"}<br />
          {"  G(1,0,0): E = 7.62 × 4.02 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"30.6 eV  ✓ (< ENCUT=400)"}</span><br />
          {"  G(1,1,0): E = 7.62 × 5.35 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"40.8 eV  ✓"}</span><br />
          {"  G(5,5,5): E = 7.62 × 100.4 = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"765 eV  ✗ (> ENCUT=400)"}</span><br /><br />

          <span style={{ color: T.eqn, fontWeight: 700 }}>Step 4: Count the plane waves at ENCUT = 400 eV</span><br /><br />
          {"  |G|_max = √(2 × 400 / 7.62) = √(104.99) = 10.25 Å⁻¹"}<br />
          {"  All G's inside a sphere of radius 10.25 Å⁻¹ are included"}<br />
          {"  Volume of G-sphere: (4π/3)(10.25)³ = 4510 ų⁻³"}<br />
          {"  G-points per unit volume: 1/Ω* = Ω/(2π)³ = 40.03/248.05 = 0.161"}<br />
          {"  N_PW ≈ 4510 × 0.161 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"~726 G-vectors"}</span><br />
          {"  With 2 atoms/cell and 2 k-points spin: "}<span style={{ color: T.basis, fontWeight: 700 }}>{"~2,700 plane waves per k-point"}</span>
        </div>
      </Card>

      <Card title="Why Reciprocal Space Makes DFT Efficient" color={T.accent}>
        <div style={mathBlock}>
          <span style={{ color: T.accent, fontWeight: 700 }}>The Hartree potential: real space vs reciprocal space</span><br /><br />
          {"  Real space: V_H(r) = ∫ n(r')/|r−r'| dr'"}<br />
          {"  This is a 6D integral (3D for r, 3D for r')!"}<br />
          {"  On an N-point grid: O(N²) operations"}<br />
          {"  For N = 64³ = 262,144: that's 6.9 × 10¹⁰ operations — impossibly slow"}<br /><br />
          <span style={{ color: T.accent, fontWeight: 700 }}>In reciprocal space (Poisson equation):</span><br />
          {"  ∇²V_H = −4πn(r)  →  Fourier transform both sides:"}<br />
          {"  −|G|²Ṽ_H(G) = −4π ñ(G)"}<br />
          {"  Ṽ_H(G) = 4π ñ(G) / |G|²"}<br /><br />
          {"  Just DIVIDE each Fourier coefficient by |G|²!"}<br />
          {"  Cost: O(N) — one division per G-vector"}<br />
          {"  For N = 2,700: only 2,700 divisions!"}<br /><br />
          <span style={{ color: T.basis, fontWeight: 700 }}>Speedup: 6.9×10¹⁰ / 2,700 = 25 million times faster</span><br /><br />

          <span style={{ color: T.accent, fontWeight: 700 }}>Numerical example for Si:</span><br /><br />
          {"  Given: ñ(G₁₁₁) = 0.234 electrons/ų  (Fourier coeff of density)"}<br />
          {"         |G₁₁₁|² = 4.02 Å⁻²"}<br /><br />
          {"  Ṽ_H(G₁₁₁) = 4π × 0.234 / 4.02 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"0.731 Ha·Å² = 19.9 eV·Å²"}</span><br /><br />
          {"  That's it — one multiplication and one division."}<br />
          {"  In real space, this single G-component would require"}<br />
          {"  integrating over the entire unit cell."}
        </div>
      </Card>

      <Card title="The Kinetic Energy is Diagonal in Reciprocal Space" color={T.eqn}>
        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>Real space kinetic energy:</span><br />
          {"  T̂ψ = −(ℏ²/2m)∇²ψ   (second derivative — needs finite differences)"}<br /><br />
          <span style={{ color: T.eqn, fontWeight: 700 }}>Reciprocal space kinetic energy:</span><br />
          {"  T̂ψ_G = (ℏ²/2m)|k+G|² × c_G   (just multiply by a number!)"}<br /><br />
          {"  The kinetic energy operator is DIAGONAL in the plane wave basis."}<br />
          {"  This means the kinetic part of the Hamiltonian matrix is:"}<br /><br />
          {"  H_GG'(kinetic) = (ℏ²/2m)|k+G|² × δ_GG'"}<br /><br />
          {"  For Si at k=Γ with ENCUT=400:"}<br />
          {"  H is 2700×2700 but the kinetic part has only 2700 nonzero entries"}<br />
          {"  (on the diagonal). In real space, ∇² couples all grid points — dense matrix!"}
        </div>
      </Card>

      <Card title="Complete SCF Cycle: Where Each Space is Used" color={T.main}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "1. Store ψ_nk(G)", space: "Reciprocal", why: "Compact: only ~2,700 coefficients per band per k-point", color: T.basis },
            { step: "2. Compute kinetic energy T̂ψ", space: "Reciprocal", why: "Diagonal: just multiply each c_G by |k+G|²/2", color: T.basis },
            { step: "3. FFT ψ(G) → ψ(r)", space: "G → R", why: "Need real-space ψ to compute density n(r) = Σ|ψ(r)|²", color: T.accent },
            { step: "4. Compute n(r) = Σ|ψ_nk(r)|²", space: "Real", why: "Squaring is pointwise — trivial in real space", color: T.main },
            { step: "5. Compute V_xc[n(r)]", space: "Real", why: "XC is a local functional of n(r) — must be in real space", color: T.xc },
            { step: "6. FFT n(r) → ñ(G)", space: "R → G", why: "Need ñ(G) to compute Hartree potential", color: T.accent },
            { step: "7. Compute Ṽ_H(G) = 4πñ(G)/|G|²", space: "Reciprocal", why: "Poisson equation is algebraic in G-space", color: T.basis },
            { step: "8. FFT V_H(G) → V_H(r)", space: "G → R", why: "Add V_H(r) + V_xc(r) + V_ext(r) in real space", color: T.accent },
            { step: "9. Apply V_eff(r)ψ(r)", space: "Real", why: "Potential × wavefunction is pointwise multiplication", color: T.main },
            { step: "10. FFT result → reciprocal", space: "R → G", why: "Back to G-space to add kinetic term and diagonalize", color: T.accent },
          ].map((item, i, arr) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18, flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 6 }} />
                {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: item.color + "30" }} />}
              </div>
              <div style={{ paddingBottom: 8, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.ink }}>{item.step}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: item.color, background: item.color + "15", padding: "1px 6px", borderRadius: 4 }}>{item.space}</div>
                </div>
                <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5 }}>{item.why}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: T.main + "08", border: `1px solid ${T.main}22`, borderRadius: 8, padding: "10px 14px", marginTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.main, marginBottom: 4 }}>Cost Summary for Si (2 atoms, ENCUT=400, 8×8×8 k-mesh)</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            • FFT: 4 transforms/SCF step × 2,700 PW × O(N log N) ≈ <strong>44,000 operations</strong><br />
            • Hartree: 2,700 divisions = <strong>2,700 operations</strong><br />
            • Kinetic: 2,700 multiplications = <strong>2,700 operations</strong><br />
            • V_xc: 32³ = 32,768 grid evaluations<br />
            • Diagonalization (Davidson): 2,700 × 4 bands × ~10 iterations ≈ <strong>108,000 operations</strong><br />
            <br />
            Without reciprocal space: Hartree alone would be 32,768² = <strong>1.07 billion operations</strong>.<br />
            <strong style={{ color: T.basis }}>Reciprocal space makes DFT possible.</strong>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ──── Section 11: CdTe Full DFT Walkthrough ────
function SecCdTeWalkthrough() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>What This Section Does</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          We take <strong>one CdTe unit cell (2 atoms)</strong> and walk through the <em>entire</em> DFT calculation with real numbers at every step — from choosing which electrons to treat, to the final converged energy. Nothing is skipped.
        </div>
      </div>

      {/* ── STEP 0: THE SYSTEM ── */}
      <Card title="Step 0 — Define the System" color={T.xc}>
        <div style={mathBlock}>
          <span style={{ color: T.xc, fontWeight: 700 }}>CdTe zinc blende (space group F-43m, #216)</span><br /><br />
          {"  Lattice constant: a = 6.48 Å"}<br />
          {"  Atoms per unit cell: 2 (1 Cd at (0,0,0), 1 Te at (¼,¼,¼))"}<br />
          {"  Nearest-neighbor distance: d = a√3/4 = 6.48 × 0.433 = 2.81 Å"}<br /><br />
          {"  Primitive vectors (FCC):"}<br />
          {"    a₁ = (a/2)(0,1,1) = (0, 3.24, 3.24) Å"}<br />
          {"    a₂ = (a/2)(1,0,1) = (3.24, 0, 3.24) Å"}<br />
          {"    a₃ = (a/2)(1,1,0) = (3.24, 3.24, 0) Å"}<br /><br />
          {"  Unit cell volume: Ω = a³/4 = 68.02 ų"}
        </div>
      </Card>

      {/* ── STEP 1: CORE vs VALENCE ── */}
      <Card title="Step 1 — Split Electrons: Core vs Valence (PAW)" color={T.basis}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
          PAW pseudopotentials freeze deep core electrons and only solve for valence electrons. This is why DFT is fast — we skip most electrons.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ background: T.xc + "08", border: `1px solid ${T.xc}22`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.xc, marginBottom: 6 }}>Cadmium (Z = 48)</div>
            <div style={mathBlock}>
              {"Full config: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s²"}<br /><br />
              <span style={{ color: T.muted }}>{"CORE (frozen in PAW):"}</span><br />
              {"  1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶"}<br />
              {"  = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"36 core electrons (frozen)"}</span><br /><br />
              <span style={{ color: T.xc }}>{"VALENCE (solved by DFT):"}</span><br />
              {"  4d¹⁰ 5s²"}<br />
              {"  = "}<span style={{ color: T.xc, fontWeight: 700 }}>{"12 valence electrons"}</span>
            </div>
          </div>
          <div style={{ background: T.eqn + "08", border: `1px solid ${T.eqn}22`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.eqn, marginBottom: 6 }}>Tellurium (Z = 52)</div>
            <div style={mathBlock}>
              {"Full config: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰ 5s² 5p⁴"}<br /><br />
              <span style={{ color: T.muted }}>{"CORE (frozen in PAW):"}</span><br />
              {"  1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s² 4p⁶ 4d¹⁰"}<br />
              {"  = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"46 core electrons (frozen)"}</span><br /><br />
              <span style={{ color: T.eqn }}>{"VALENCE (solved by DFT):"}</span><br />
              {"  5s² 5p⁴"}<br />
              {"  = "}<span style={{ color: T.eqn, fontWeight: 700 }}>{"6 valence electrons"}</span>
            </div>
          </div>
        </div>
        <div style={{ background: T.basis + "08", border: `1px solid ${T.basis}22`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.basis, marginBottom: 4 }}>Summary</div>
          <div style={mathBlock}>
            {"  Total electrons in CdTe: 48 + 52 = 100"}<br />
            {"  Core electrons (frozen):  36 + 46 = "}<span style={{ color: T.warn, fontWeight: 700 }}>{"82 (not computed!)"}</span><br />
            {"  Valence electrons (DFT):  12 + 6  = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"18 (these are what we solve for)"}</span><br /><br />
            {"  Each KS orbital holds 2 electrons (spin up + spin down)"}<br />
            {"  Number of occupied bands: 18/2 = "}<span style={{ color: T.basis, fontWeight: 700 }}>{"9 bands"}</span><br /><br />
            {"  We saved 82/100 = 82% of the work by using PAW!"}
          </div>
        </div>
      </Card>

      {/* ── STEP 2: K-POINTS ── */}
      <Card title="Step 2 — Choose k-point Mesh" color={T.eqn}>
        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>Monkhorst-Pack grid: 8×8×8</span><br /><br />
          {"  Total k-points in full BZ: 8 × 8 × 8 = 512"}<br />
          {"  FCC has 48 symmetry operations → reduce by symmetry:"}<br />
          {"  Irreducible k-points: 512 / 48 ≈ "}<span style={{ color: T.eqn, fontWeight: 700 }}>{"60 unique k-points"}</span><br /><br />
          {"  At EACH k-point we must solve for all 9 occupied bands."}<br />
          {"  Total eigenvalue problems: 60 k-points × 1 = 60 matrix diagonalizations"}<br /><br />
          {"  Special k-points in CdTe BZ:"}<br />
          {"    Γ = (0, 0, 0)         — zone center"}<br />
          {"    X = (0, ½, 0)2π/a     — zone face"}<br />
          {"    L = (½, ½, ½)2π/a     — zone corner"}<br />
          {"    K = (¾, ¾, 0)2π/a     — zone edge"}
        </div>
      </Card>

      {/* ── STEP 3: PLANE WAVES ── */}
      <Card title="Step 3 — Build Plane Wave Basis (ENCUT = 400 eV)" color={T.basis}>
        <div style={mathBlock}>
          <span style={{ color: T.basis, fontWeight: 700 }}>How many plane waves per k-point?</span><br /><br />
          {"  |G|_max = √(2mₑ × ENCUT) / ℏ"}<br />
          {"  In practical units: |G|_max = √(2 × 400 / 7.62) = 10.24 Å⁻¹"}<br /><br />
          {"  Volume of G-sphere: (4π/3)(10.24)³ = 4,499 ų⁻³"}<br />
          {"  G-point density: Ω/(2π)³ = 68.02/248.05 = 0.274 per ų⁻³"}<br />
          {"  N_PW ≈ 4,499 × 0.274 ≈ "}<span style={{ color: T.basis, fontWeight: 700 }}>{"1,233 G-vectors"}</span><br /><br />
          {"  VASP reports: NBANDS = 16 (9 occupied + 7 empty for better convergence)"}<br />
          {"  At each k-point: diagonalize a "}<span style={{ color: T.basis, fontWeight: 700 }}>{"1233 × 1233"}</span>{" Hamiltonian"}<br />
          {"  But we only need the lowest 16 eigenvalues → Davidson algorithm"}<br /><br />
          {"  Each plane wave is: φ_G(r) = (1/√Ω) e^(i(k+G)·r)"}<br />
          {"  The KS orbital: ψ_nk(r) = Σ_G c_nk(G) φ_G(r)"}<br />
          {"  Finding c_nk(G) is the eigenvalue problem H·c = ε·c"}
        </div>
      </Card>

      {/* ── STEP 4: INITIAL GUESS ── */}
      <Card title="Step 4 — Initial Density Guess" color={T.main}>
        <div style={mathBlock}>
          <span style={{ color: T.main, fontWeight: 700 }}>Superposition of atomic densities</span><br /><br />
          {"  n⁰(r) = n_Cd_atom(r − R_Cd) + n_Te_atom(r − R_Te)"}<br /><br />
          {"  This is a rough guess — it ignores bonding."}<br />
          {"  Cd atom is spherical with 12 valence electrons"}<br />
          {"  Te atom is spherical with 6 valence electrons"}<br />
          {"  Total: ∫ n⁰(r) dr = 18 electrons ✓"}<br /><br />
          {"  The guess density is too atomic — it doesn't know about"}<br />
          {"  the covalent bond between Cd and Te. The SCF loop will fix this."}
        </div>
      </Card>

      {/* ── STEP 5: SCF ITERATION 1 ── */}
      <Card title="Step 5 — SCF Iteration 1 (The Big One)" color={T.xc}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 8 }}>
          This is where the real computation happens. Every step is shown.
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.accent, fontWeight: 700 }}>5a. Build the effective potential from n⁰(r)</span><br /><br />
          {"  V_eff(r) = V_ext(r) + V_H(r) + V_xc(r)"}<br /><br />
          {"  V_ext(r) = PAW pseudopotential from Cd and Te nuclei"}<br />
          {"    (tabulated, read from POTCAR, not computed)"}<br /><br />
          {"  V_H(r) = Hartree potential (electron-electron Coulomb):"}<br />
          {"    FFT n⁰(r) → ñ⁰(G)"}<br />
          {"    Ṽ_H(G) = 4π ñ⁰(G) / |G|²  for each of 1233 G-vectors"}<br />
          {"    FFT Ṽ_H(G) → V_H(r) on real-space grid (48×48×48 = 110,592 points)"}<br /><br />
          {"  V_xc(r) = PBE exchange-correlation (local, computed at each grid point):"}<br />
          {"    At each of 110,592 grid points:"}<br />
          {"    V_xc[n⁰(r)] = dE_xc/dn evaluated using PBE formula"}<br />
          {"    (involves n, |∇n|, and analytic PBE parametrization)"}
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.eqn, fontWeight: 700 }}>5b. Solve KS equations at each k-point (Davidson algorithm)</span><br /><br />
          {"  For each of the 60 irreducible k-points:"}<br /><br />
          {"    Build H(k): 1233×1233 matrix"}<br />
          {"      H_GG'(k) = (ℏ²/2m)|k+G|² δ_GG'  +  Ṽ_eff(G−G')"}<br />
          {"               = kinetic (diagonal) + potential (dense)"}<br /><br />
          {"    Davidson diagonalization → lowest 16 eigenvalues:"}<br /><br />
          {"    k = Γ (0,0,0):"}<br />
          {"      Band 1:  ε₁ = −9.83 eV  (Te 5s, deep)  ← 2 electrons"}<br />
          {"      Band 2:  ε₂ = −8.12 eV  (Cd 4d)        ← 2 electrons"}<br />
          {"      Band 3:  ε₃ = −8.09 eV  (Cd 4d)        ← 2 electrons"}<br />
          {"      Band 4:  ε₄ = −8.07 eV  (Cd 4d)        ← 2 electrons"}<br />
          {"      Band 5:  ε₅ = −7.95 eV  (Cd 4d)        ← 2 electrons"}<br />
          {"      Band 6:  ε₆ = −7.93 eV  (Cd 4d)        ← 2 electrons"}<br />
          {"      Band 7:  ε₇ = −1.24 eV  (bonding sp³)  ← 2 electrons"}<br />
          {"      Band 8:  ε₈ = −1.24 eV  (bonding sp³)  ← 2 electrons"}<br />
          {"      Band 9:  ε₉ = −1.24 eV  (bonding sp³)  ← 2 electrons"}<br />
          {"      ─────── BAND GAP ≈ 0.6 eV (PBE underestimates!) ─────"}<br />
          {"      Band 10: ε₁₀ = −0.62 eV (antibonding, empty)"}<br />
          {"      ...bands 11-16: empty conduction states"}<br /><br />
          {"    Bands 1-9 are occupied → 9 bands × 2 e⁻ = 18 electrons ✓"}<br /><br />
          {"    Repeat for all 60 k-points (eigenvalues shift with k)"}
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.main, fontWeight: 700 }}>5c. Compute new electron density from occupied states</span><br /><br />
          {"  n¹(r) = (2/N_k) Σ_k Σ_{n=1}^{9} |ψ_nk(r)|²"}<br /><br />
          {"  For each of the 9 occupied bands at each of 60 k-points:"}<br />
          {"    1. Take coefficients c_nk(G) from Davidson"}<br />
          {"    2. FFT c_nk(G) → ψ_nk(r) on real-space grid"}<br />
          {"    3. Compute |ψ_nk(r)|² at each grid point"}<br />
          {"    4. Add to running sum with k-point weight"}<br /><br />
          {"  Total operations: 60 k × 9 bands × 1 FFT each = 540 FFTs"}<br /><br />
          {"  Check: ∫ n¹(r) dr = 18.000 electrons ✓"}<br />
          {"  (VASP enforces this by adjusting the Fermi level)"}
        </div>

        <div style={mathBlock}>
          <span style={{ color: T.xc, fontWeight: 700 }}>5d. Compute total energy (iteration 1)</span><br /><br />
          {"  E_total = E_kinetic + E_ext + E_Hartree + E_xc + E_ion-ion"}<br /><br />
          {"  E_kinetic = Σ_k Σ_n f_nk × ⟨ψ_nk|−∇²/2|ψ_nk⟩"}<br />
          {"    = sum of (ℏ²/2m)|k+G|² × |c_nk(G)|² over all occupied states"}<br />
          {"    ≈ +28.34 eV"}<br /><br />
          {"  E_ext = ∫ n(r) V_ext(r) dr  (electron-nucleus attraction)"}<br />
          {"    ≈ −142.56 eV"}<br /><br />
          {"  E_Hartree = ½ ∫∫ n(r)n(r')/|r−r'| dr dr'"}<br />
          {"    = ½ Σ_G 4π|ñ(G)|²/|G|²"}<br />
          {"    ≈ +63.21 eV"}<br /><br />
          {"  E_xc = ∫ ε_xc[n(r)] × n(r) dr  (PBE functional)"}<br />
          {"    ≈ −18.45 eV"}<br /><br />
          {"  E_ion-ion = Ewald sum (Cd²⁺ — Te²⁻ Coulomb)"}<br />
          {"    = −constant (computed once, never changes)"}<br />
          {"    ≈ −24.82 eV"}<br /><br />
          <span style={{ color: T.xc, fontWeight: 700 }}>{"  E₁_total = 28.34 − 142.56 + 63.21 − 18.45 − 24.82 = −94.280 eV"}</span>
        </div>
      </Card>

      {/* ── STEP 6: SCF ITERATIONS 2-N ── */}
      <Card title="Step 6 — SCF Iterations 2→N (Convergence)" color={T.accent}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 8 }}>
          The density from iteration 1 is mixed with the guess, then we repeat. VASP uses Pulay mixing (AMIX=0.4 default).
        </div>
        <div style={mathBlock}>
          <span style={{ color: T.accent, fontWeight: 700 }}>Density mixing (Pulay/Broyden):</span><br />
          {"  n_in² = 0.4 × n_out¹ + 0.6 × n_in¹   (AMIX = 0.4)"}<br />
          {"  Why mix? Using n_out¹ directly causes charge sloshing."}<br /><br />

          <span style={{ color: T.accent, fontWeight: 700 }}>Convergence history:</span><br /><br />
          {"  Iter | E_total (eV)    | ΔE (eV)      | |Δn|         | Converged?"}<br />
          {"  ─────┼─────────────────┼──────────────┼─────────────┼──────────"}<br />
          {"   1   | −94.2803        | —            | 0.8200      | no"}<br />
          {"   2   | −94.6541        | −3.738×10⁻¹  | 0.1840      | no"}<br />
          {"   3   | −94.7012        | −4.710×10⁻²  | 0.0423      | no"}<br />
          {"   4   | −94.7089        | −7.700×10⁻³  | 0.0098      | no"}<br />
          {"   5   | −94.7098        | −9.000×10⁻⁴  | 0.0021      | no"}<br />
          {"   6   | −94.7099        | −1.000×10⁻⁴  | 4.5×10⁻⁴    | no"}<br />
          {"   7   | −94.7100        | −1.000×10⁻⁵  | 9.8×10⁻⁵    | no"}<br />
          {"   8   | −94.7100        | −8.000×10⁻⁷  | 2.1×10⁻⁵    | "}<span style={{ color: T.basis, fontWeight: 700 }}>{"YES (ΔE < EDIFF=10⁻⁶)"}</span><br /><br />

          <span style={{ color: T.basis, fontWeight: 700 }}>Converged total energy: E = −94.7100 eV per unit cell</span><br />
          {"  = −94.7100 / 2 = −47.355 eV per atom"}<br /><br />
          {"  8 SCF iterations × 60 k-points × 1233 PW × 16 bands"}<br />
          {"  ≈ 9.5 million eigenvalue operations"}<br />
          {"  Wall time: ~45 seconds on 4 cores"}
        </div>
      </Card>

      {/* ── STEP 7: WHAT WE GET ── */}
      <Card title="Step 7 — Converged Results" color={T.basis}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ background: T.basis + "08", border: `1px solid ${T.basis}22`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.basis, marginBottom: 6 }}>Energies</div>
            <div style={mathBlock}>
              {"E_total = −94.710 eV"}<br />
              {"E/atom = −47.355 eV"}<br />
              {"E_kinetic = +28.89 eV"}<br />
              {"E_Hartree = +62.44 eV"}<br />
              {"E_xc(PBE) = −18.67 eV"}<br />
              {"E_Fermi = −0.93 eV"}
            </div>
          </div>
          <div style={{ background: T.eqn + "08", border: `1px solid ${T.eqn}22`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.eqn, marginBottom: 6 }}>Band Structure at Γ</div>
            <div style={mathBlock}>
              {"Band 1 (Te 5s):  −9.61 eV"}<br />
              {"Bands 2-6 (Cd 4d): −7.8 to −8.1 eV"}<br />
              {"Bands 7-9 (VBM):  −1.12 eV"}<br />
              {"── gap = 0.58 eV (PBE) ──"}<br />
              {"Band 10 (CBM):  −0.54 eV"}<br /><br />
              {"Expt gap: 1.51 eV"}<br />
              <span style={{ color: T.warn }}>{"PBE underestimates by 62%!"}</span>
            </div>
          </div>
        </div>
        <div style={{ background: T.main + "08", border: `1px solid ${T.main}22`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.main, marginBottom: 6 }}>Formation Energy</div>
          <div style={mathBlock}>
            {"  ΔH_f(CdTe) = E(CdTe) − E(Cd_bulk) − E(Te_bulk)"}<br />
            {"  = −94.710 − (−46.380) − (−47.780)"}<br />
            {"  = −94.710 + 46.380 + 47.780"}<br />
            {"  = "}<span style={{ color: T.main, fontWeight: 700 }}>{"−0.550 eV/f.u. = −53.1 kJ/mol"}</span><br /><br />
            {"  Experiment: −0.52 eV (−50.2 kJ/mol)"}<br />
            {"  Error: 6% — excellent for PBE!"}
          </div>
        </div>
      </Card>

      {/* ── COMPUTATIONAL COST ── */}
      <Card title="Computational Cost Breakdown" color={T.accent}>
        <div style={mathBlock}>
          <span style={{ color: T.accent, fontWeight: 700 }}>Per SCF iteration:</span><br />
          {"  60 k-points × 16 bands × 1233 PW"}<br />
          {"  = 1,184,160 wavefunction coefficients to optimize"}<br /><br />
          {"  FFTs: 60 k × 16 bands × 2 (fwd+back) = 1,920 FFTs"}<br />
          {"  Each FFT: 48³ × log(48³) = 110,592 × 16.8 ≈ 1.9M operations"}<br />
          {"  Total FFT cost: 1,920 × 1.9M = 3.6 billion operations"}<br /><br />
          {"  Davidson: ~5 iterations × 1233² per k-point = 91M per k × 60 = 5.5B"}<br /><br />
          <span style={{ color: T.accent, fontWeight: 700 }}>Total per SCF: ~9 billion floating-point operations</span><br />
          {"  × 8 SCF steps = ~72 billion operations total"}<br /><br />
          {"  Modern CPU: ~100 GFLOPS → "}<span style={{ color: T.basis, fontWeight: 700 }}>{"~45 seconds on 4 cores"}</span><br /><br />
          {"  Without PAW (all 100 electrons): ENCUT > 5000 eV needed"}<br />
          {"  N_PW ≈ 200,000 → matrix 200,000² → "}<span style={{ color: T.warn, fontWeight: 700 }}>{"months, not seconds"}</span>
        </div>
      </Card>
    </div>
  );
}

// ──── Section 12: INCAR Builder ────
function SecIncar() {
  const [system, setSystem] = useState("semiconductor");
  const [task, setTask] = useState("relax");

  const presets = {
    semiconductor: {
      relax: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: "-0.02", ISMEAR: 0, SIGMA: 0.05, ALGO: "Fast", IBRION: 2, NSW: 50, ISIF: 3, LREAL: ".FALSE.", PREC: "Accurate", extra: [] },
      singlepoint: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Fast", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11  # projected DOS"] },
      dos: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: -5, SIGMA: null, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "NEDOS = 2001", "EMIN = -10", "EMAX = 10"] },
      bands: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "ICHARG = 11  # read CHGCAR"] },
      phonon: { ENCUT: 500, EDIFF: "1E-8", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Normal", IBRION: 5, NSW: 1, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["NFREE = 2  # central differences", "POTIM = 0.015  # displacement (Å)"] },
    },
    metal: {
      relax: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: "-0.02", ISMEAR: 1, SIGMA: 0.1, ALGO: "Fast", IBRION: 2, NSW: 50, ISIF: 3, LREAL: ".FALSE.", PREC: "Accurate", extra: [] },
      singlepoint: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 1, SIGMA: 0.1, ALGO: "Fast", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11"] },
      dos: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: -5, SIGMA: null, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "NEDOS = 3001", "EMIN = -15", "EMAX = 10"] },
      bands: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 1, SIGMA: 0.1, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "ICHARG = 11"] },
      phonon: { ENCUT: 500, EDIFF: "1E-8", EDIFFG: null, ISMEAR: 1, SIGMA: 0.1, ALGO: "Normal", IBRION: 5, NSW: 1, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["NFREE = 2", "POTIM = 0.015"] },
    },
    defect: {
      relax: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: "-0.01", ISMEAR: 0, SIGMA: 0.05, ALGO: "Fast", IBRION: 2, NSW: 100, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["# Fixed cell — defect in supercell"] },
      singlepoint: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Fast", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "# Use relaxed CONTCAR as POSCAR"] },
      dos: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: -5, SIGMA: null, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "NEDOS = 2001"] },
      bands: { ENCUT: 400, EDIFF: "1E-6", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Normal", IBRION: -1, NSW: 0, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["LORBIT = 11", "ICHARG = 11"] },
      phonon: { ENCUT: 500, EDIFF: "1E-8", EDIFFG: null, ISMEAR: 0, SIGMA: 0.05, ALGO: "Normal", IBRION: 5, NSW: 1, ISIF: 2, LREAL: ".FALSE.", PREC: "Accurate", extra: ["NFREE = 2", "POTIM = 0.015"] },
    },
  };

  const p = presets[system]?.[task] || presets.semiconductor.relax;

  const incarText = [
    `SYSTEM  = ${system}_${task}`,
    ``,
    `# Accuracy`,
    `ENCUT   = ${p.ENCUT}`,
    `EDIFF   = ${p.EDIFF}`,
    ...(p.EDIFFG ? [`EDIFFG  = ${p.EDIFFG}`] : []),
    `PREC    = ${p.PREC}`,
    `LREAL   = ${p.LREAL}`,
    ``,
    `# Electronic`,
    `ISMEAR  = ${p.ISMEAR}`,
    ...(p.SIGMA !== null ? [`SIGMA   = ${p.SIGMA}`] : []),
    `ALGO    = ${p.ALGO}`,
    `NELM    = 100`,
    ``,
    `# Ionic`,
    `IBRION  = ${p.IBRION}`,
    `NSW     = ${p.NSW}`,
    `ISIF    = ${p.ISIF}`,
    ...(p.extra.length > 0 ? [``, `# Additional`, ...p.extra] : []),
  ].join("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          The <strong>INCAR</strong> file is the instruction sheet you give VASP before it starts calculating. It{"'"}s like a recipe card: you tell it what ingredients to use (ENCUT, KPOINTS), how to cook (ALGO, IBRION), and when to stop (EDIFF, EDIFFG). Different dishes (relaxation, band structure, phonons) need different recipes. This builder picks the right recipe for your system.
        </div>
      </div>

      <Card title="Build Your INCAR" color={T.eqn}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink, marginBottom: 12 }}>
          Select your <strong>system type</strong> and <strong>calculation task</strong> to generate
          a ready-to-use INCAR file with recommended parameters.
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eqn, marginBottom: 6 }}>System Type</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { val: "semiconductor", label: "Semiconductor", icon: "💎" },
              { val: "metal", label: "Metal", icon: "🔩" },
              { val: "defect", label: "Defect Calc", icon: "⚡" },
            ].map(s => (
              <button key={s.val} onClick={() => setSystem(s.val)} style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                background: system === s.val ? T.eqn : T.surface,
                color: system === s.val ? "#fff" : T.ink,
                border: `1.5px solid ${system === s.val ? T.eqn : T.border}`,
                fontWeight: 700, fontFamily: "inherit",
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eqn, marginBottom: 6 }}>Calculation Task</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { val: "relax", label: "Relaxation" },
              { val: "singlepoint", label: "Single Point" },
              { val: "dos", label: "DOS" },
              { val: "bands", label: "Band Structure" },
              { val: "phonon", label: "Phonons" },
            ].map(t => (
              <button key={t.val} onClick={() => setTask(t.val)} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                background: task === t.val ? T.accent : T.surface,
                color: task === t.val ? "#fff" : T.ink,
                border: `1.5px solid ${task === t.val ? T.accent : T.border}`,
                fontWeight: 700, fontFamily: "inherit",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Generated INCAR" color={T.eqn}>
        <pre style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, lineHeight: 1.7,
          background: "#f8f9fc", color: "#1a1e2e", borderRadius: 12,
          padding: "18px 20px", margin: 0, overflowX: "auto",
          border: `2px solid ${T.eqn}40`, whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}>
          {incarText}
        </pre>
        <div style={{ marginTop: 8, fontSize: 11, color: T.muted }}>
          Each parameter is explained in the previous sections. Click through tabs 1-7 for details.
        </div>
      </Card>

      <Card title="Parameter Summary" color={T.main}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6 }}>
          {[
            { tag: "ENCUT", val: `${p.ENCUT} eV`, why: "Plane wave cutoff energy" },
            { tag: "EDIFF", val: p.EDIFF, why: "SCF convergence threshold" },
            { tag: "ISMEAR", val: String(p.ISMEAR), why: p.ISMEAR === -5 ? "Tetrahedron method" : p.ISMEAR === 0 ? "Gaussian smearing" : "Methfessel-Paxton" },
            { tag: "ALGO", val: p.ALGO, why: "SCF algorithm" },
            { tag: "IBRION", val: String(p.IBRION), why: p.IBRION === -1 ? "No relaxation" : p.IBRION === 2 ? "Conjugate gradient" : p.IBRION === 5 ? "Finite differences" : "Quasi-Newton" },
            { tag: "ISIF", val: String(p.ISIF), why: p.ISIF === 2 ? "Relax ions only" : p.ISIF === 3 ? "Full cell + ions" : "Ions only" },
            { tag: "PREC", val: p.PREC, why: "FFT grid density" },
            { tag: "LREAL", val: p.LREAL, why: "Projections in reciprocal space" },
          ].map(item => (
            <div key={item.tag} style={{
              display: "flex", gap: 8, alignItems: "center",
              padding: "6px 10px", borderRadius: 8,
              background: T.main + "05", border: `1px solid ${T.main}10`,
            }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: T.main, minWidth: 65 }}>{item.tag}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.ink, minWidth: 60 }}>{item.val}</div>
              <div style={{ fontSize: 10, color: T.muted }}>{item.why}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function DFTParamsInteractive() {
  const [active, setActive] = useState("bz");
  const stepIdx = PARAM_SECTIONS.findIndex(s => s.id === active);
  const cur = PARAM_SECTIONS[stepIdx];

  const renderSection = () => {
    switch (active) {
      case "bz":      return <SecBZ />;
      case "kpoints": return <SecKpoints />;
      case "encut":   return <SecEncut />;
      case "ismear":  return <SecIsmear />;
      case "algo":    return <SecAlgo />;
      case "ediff":   return <SecEdiff />;
      case "ibrion":  return <SecIbrion />;
      case "prec":    return <SecPrec />;
      case "lreal":      return <SecLreal />;
      case "reciprocal":       return <SecReciprocal />;
      case "cdte_walkthrough": return <SecCdTeWalkthrough />;
      case "incar":            return <SecIncar />;
      default:        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PARAM_SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer",
            background: active === s.id ? (s.color || T.main) : T.surface,
            color: active === s.id ? "#fff" : T.ink,
            border: `1.5px solid ${active === s.id ? (s.color || T.main) : T.border}`,
            fontWeight: active === s.id ? 800 : 500,
            fontFamily: "inherit",
            boxShadow: active === s.id ? `0 2px 8px ${s.color}30` : "none",
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <ParamErrorBoundary key={active}>
        {renderSection()}
      </ParamErrorBoundary>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={() => stepIdx > 0 && setActive(PARAM_SECTIONS[stepIdx - 1].id)} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, cursor: stepIdx > 0 ? "pointer" : "default",
          background: stepIdx > 0 ? (cur.color || T.main) + "12" : T.surface,
          border: `1.5px solid ${stepIdx > 0 ? (cur.color || T.main) : T.border}`,
          color: stepIdx > 0 ? (cur.color || T.main) : T.dim,
          fontWeight: 700, fontFamily: "inherit",
          opacity: stepIdx > 0 ? 1 : 0.5,
        }}>
          {"\u2190"} Back
        </button>
        <button onClick={() => stepIdx < PARAM_SECTIONS.length - 1 && setActive(PARAM_SECTIONS[stepIdx + 1].id)} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          cursor: stepIdx < PARAM_SECTIONS.length - 1 ? "pointer" : "default",
          background: stepIdx < PARAM_SECTIONS.length - 1 ? (cur.color || T.main) + "12" : T.surface,
          border: `1.5px solid ${stepIdx < PARAM_SECTIONS.length - 1 ? (cur.color || T.main) : T.border}`,
          color: stepIdx < PARAM_SECTIONS.length - 1 ? (cur.color || T.main) : T.dim,
          fontWeight: 700, fontFamily: "inherit",
          opacity: stepIdx < PARAM_SECTIONS.length - 1 ? 1 : 0.5,
        }}>
          Next {"\u2192"}
        </button>
      </div>
    </div>
  );
}
