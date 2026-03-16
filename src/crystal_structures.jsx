import { useState, useEffect } from "react";

const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  cs_primary: "#0e7490", cs_accent: "#06b6d4", cs_lattice: "#0891b2",
  cs_symmetry: "#155e75", cs_miller: "#164e63", cs_cell: "#0d9488",
  cs_pack: "#0f766e", cs_struct: "#115e59",
};

function Tag({ color, children }) {
  return (
    <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: color + "22", border: `1px solid ${color}55`, color, letterSpacing: 1 }}>{children}</span>
  );
}
function SectionTitle({ color, icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "22", border: `1px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color, letterSpacing: 1, textTransform: "uppercase" }}>{children}</div>
    </div>
  );
}
function Card({ title, color, children }) {
  return (
    <div style={{ background: color + "08", border: `1px solid ${color}33`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
      {title && <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>}
      {children}
    </div>
  );
}
function Formula({ children, color }) {
  return (
    <div style={{ background: color + "11", border: `1px solid ${color}33`, borderRadius: 8, padding: "10px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: T.ink, marginBottom: 10, textAlign: "center" }}>{children}</div>
  );
}

// ── SECTION 1: CRYSTAL BASICS ──
function BasicsSection() {
  const [showOrdered, setShowOrdered] = useState(true);
  return (
    <div>
      <SectionTitle color={T.cs_primary} icon="🔷">Crystal Basics</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
        A <Tag color={T.cs_primary}>CRYSTAL</Tag> is a solid with atoms arranged in a periodically repeating pattern extending in all three dimensions. In contrast, an <Tag color={T.cs_accent}>AMORPHOUS</Tag> solid has no long-range order.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={() => setShowOrdered(true)} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${showOrdered ? T.cs_primary : T.border}`, background: showOrdered ? T.cs_primary + "22" : "transparent", color: showOrdered ? T.cs_primary : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Crystalline</button>
        <button onClick={() => setShowOrdered(false)} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${!showOrdered ? T.cs_accent : T.border}`, background: !showOrdered ? T.cs_accent + "22" : "transparent", color: !showOrdered ? T.cs_accent : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Amorphous</button>
      </div>
      <svg viewBox="0 0 400 200" style={{ width: "100%", maxWidth: 400, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {showOrdered ? (
          // Regular grid
          Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={30 + col * 38} cy={25 + row * 22} r={8} fill={T.cs_primary + "66"} stroke={T.cs_primary} strokeWidth={1.5} />
            ))
          )
        ) : (
          // Random positions
          [
            [35,42],[78,28],[120,65],[155,35],[198,55],[245,30],[280,70],[320,45],[360,62],[55,90],
            [95,110],[140,95],[175,130],[210,100],[260,120],[300,95],[345,115],[40,150],[88,170],
            [130,155],[178,175],[225,155],[270,170],[315,150],[365,170],[60,60],[150,70],[250,80]
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={8} fill={T.cs_accent + "55"} stroke={T.cs_accent} strokeWidth={1.5} />
          ))
        )}
        <text x={200} y={195} textAnchor="middle" fill={T.muted} fontSize={11}>{showOrdered ? "Periodic arrangement — long-range order" : "Random arrangement — no long-range order"}</text>
      </svg>
      <Card title="Translation Vectors" color={T.cs_primary}>
        <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.6, margin: 0 }}>
          Any lattice point can be reached by: <strong>R = n₁a₁ + n₂a₂ + n₃a₃</strong> where a₁, a₂, a₃ are primitive translation vectors and n₁, n₂, n₃ are integers. This translation symmetry is the defining property of a crystal.
        </p>
      </Card>
    </div>
  );
}

// ── SECTION 2: BRAVAIS LATTICES ──
function BravaisSection() {
  const systems = [
    { name: "Cubic", a: "a = b = c", ang: "α = β = γ = 90°", types: "P, I, F", count: 3, color: T.cs_primary },
    { name: "Tetragonal", a: "a = b ≠ c", ang: "α = β = γ = 90°", types: "P, I", count: 2, color: T.cs_accent },
    { name: "Orthorhombic", a: "a ≠ b ≠ c", ang: "α = β = γ = 90°", types: "P, I, F, C", count: 4, color: T.cs_lattice },
    { name: "Hexagonal", a: "a = b ≠ c", ang: "α = β = 90°, γ = 120°", types: "P", count: 1, color: T.cs_symmetry },
    { name: "Trigonal", a: "a = b = c", ang: "α = β = γ ≠ 90°", types: "R", count: 1, color: T.cs_miller },
    { name: "Monoclinic", a: "a ≠ b ≠ c", ang: "α = γ = 90° ≠ β", types: "P, C", count: 2, color: T.cs_cell },
    { name: "Triclinic", a: "a ≠ b ≠ c", ang: "α ≠ β ≠ γ ≠ 90°", types: "P", count: 1, color: T.cs_pack },
  ];
  const [sel, setSel] = useState(0);
  const s = systems[sel];
  return (
    <div>
      <SectionTitle color={T.cs_accent} icon="📐">Bravais Lattices</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        There are <Tag color={T.cs_primary}>7 CRYSTAL SYSTEMS</Tag> and <Tag color={T.cs_accent}>14 BRAVAIS LATTICES</Tag>. Each system is defined by relationships between lattice parameters a, b, c and angles α, β, γ.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {systems.map((sys, i) => (
          <button key={sys.name} onClick={() => setSel(i)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel === i ? sys.color : T.border}`, background: sel === i ? sys.color + "22" : "transparent", color: sel === i ? sys.color : T.muted, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{sys.name}</button>
        ))}
      </div>
      <Card title={s.name + " System"} color={s.color}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, fontSize: 12 }}>
          <div><strong>Lengths:</strong> {s.a}</div>
          <div><strong>Angles:</strong> {s.ang}</div>
          <div><strong>Lattice types:</strong> {s.types}</div>
          <div><strong>Count:</strong> {s.count} Bravais lattice(s)</div>
        </div>
      </Card>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: T.cs_primary + "15" }}>{["System", "Lengths", "Angles", "Types", "#"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${T.cs_primary}44`, color: T.cs_primary, fontWeight: 700 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {systems.map((sys, i) => (
              <tr key={sys.name} onClick={() => setSel(i)} style={{ background: i % 2 ? T.surface : T.panel, cursor: "pointer", fontWeight: sel === i ? 700 : 400 }}>
                <td style={{ padding: "6px 10px", color: sys.color }}>{sys.name}</td>
                <td style={{ padding: "6px 10px" }}>{sys.a}</td>
                <td style={{ padding: "6px 10px" }}>{sys.ang}</td>
                <td style={{ padding: "6px 10px" }}>{sys.types}</td>
                <td style={{ padding: "6px 10px" }}>{sys.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>P = Primitive, I = Body-centered, F = Face-centered, C = Base-centered, R = Rhombohedral. Total: 14 lattices.</p>
    </div>
  );
}

// ── SECTION 3: UNIT CELL ──
function UnitCellSection() {
  const [showWS, setShowWS] = useState(false);
  return (
    <div>
      <SectionTitle color={T.cs_lattice} icon="📦">Unit Cell</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        The <Tag color={T.cs_lattice}>UNIT CELL</Tag> is the smallest repeating unit that, when translated, fills all space. A <Tag color={T.cs_primary}>PRIMITIVE</Tag> cell contains exactly one lattice point; a <Tag color={T.cs_accent}>CONVENTIONAL</Tag> cell may contain more for convenience.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={() => setShowWS(false)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${!showWS ? T.cs_lattice : T.border}`, background: !showWS ? T.cs_lattice + "22" : "transparent", color: !showWS ? T.cs_lattice : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Conventional Cell</button>
        <button onClick={() => setShowWS(true)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${showWS ? T.cs_cell : T.border}`, background: showWS ? T.cs_cell + "22" : "transparent", color: showWS ? T.cs_cell : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>Wigner-Seitz Cell</button>
      </div>
      <svg viewBox="0 0 400 250" style={{ width: "100%", maxWidth: 400, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {!showWS ? (<>
          {/* Conventional unit cell */}
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={50 + c * 60} cy={30 + r * 50} r={5} fill={T.cs_lattice + "44"} stroke={T.cs_lattice} strokeWidth={1} />
          )))}
          <rect x={110} y={80} width={120} height={100} fill={T.cs_primary + "15"} stroke={T.cs_primary} strokeWidth={2} strokeDasharray="6,3" />
          <line x1={110} y1={180} x2={230} y2={180} stroke={T.cs_accent} strokeWidth={2} markerEnd="url(#arr)" />
          <text x={170} y={198} textAnchor="middle" fill={T.cs_accent} fontSize={12} fontWeight={700}>a</text>
          <line x1={230} y1={80} x2={230} y2={180} stroke={T.cs_cell} strokeWidth={2} />
          <text x={242} y={135} fill={T.cs_cell} fontSize={12} fontWeight={700}>b</text>
          <text x={200} y={245} textAnchor="middle" fill={T.muted} fontSize={11}>Conventional unit cell with lattice parameters a, b</text>
        </>) : (<>
          {/* Wigner-Seitz cell */}
          {Array.from({ length: 5 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={50 + c * 60} cy={30 + r * 50} r={5} fill={T.cs_lattice + "44"} stroke={T.cs_lattice} strokeWidth={1} />
          )))}
          {/* Perpendicular bisectors from center point */}
          <polygon points="170,105 200,80 230,105 230,155 200,180 170,155" fill={T.cs_cell + "22"} stroke={T.cs_cell} strokeWidth={2} />
          <circle cx={200} cy={130} r={6} fill={T.cs_cell} />
          {/* Bisector lines */}
          {[[140,130,170,105],[140,130,170,155],[200,30,200,80],[200,180,200,230],[260,130,230,105],[260,130,230,155]].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.cs_symmetry + "44"} strokeWidth={1} strokeDasharray="4,3" />
          ))}
          <text x={200} y={245} textAnchor="middle" fill={T.muted} fontSize={11}>Wigner-Seitz cell: perpendicular bisectors to nearest neighbors</text>
        </>)}
        <defs><marker id="arr" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto"><polygon points="0 0, 8 3, 0 6" fill={T.cs_accent} /></marker></defs>
      </svg>
      <Formula color={T.cs_lattice}>Volume = a · (b × c) — for primitive cell contains exactly 1 lattice point</Formula>
    </div>
  );
}

// ── SECTION 4: SYMMETRY OPERATIONS ──
function SymmetrySection() {
  const ops = [
    { name: "Rotation (Cₙ)", desc: "Rotation by 360°/n about an axis. Allowed: C₁, C₂, C₃, C₄, C₆", icon: "🔄" },
    { name: "Reflection (σ)", desc: "Mirror reflection through a plane. Maps (x,y,z) → (x,y,-z) for σₕ", icon: "🪞" },
    { name: "Inversion (i)", desc: "Every point (x,y,z) maps to (-x,-y,-z) through center of symmetry", icon: "🔃" },
    { name: "Improper Rotation (Sₙ)", desc: "Rotation by 360°/n followed by reflection perpendicular to rotation axis", icon: "🌀" },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <SectionTitle color={T.cs_symmetry} icon="🔄">Symmetry Operations</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        Symmetry operations transform a crystal into an indistinguishable configuration. The set of all symmetry operations forms a <Tag color={T.cs_symmetry}>GROUP</Tag>.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {ops.map((op, i) => (
          <button key={op.name} onClick={() => setSel(i)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${sel === i ? T.cs_symmetry : T.border}`, background: sel === i ? T.cs_symmetry + "22" : "transparent", color: sel === i ? T.cs_symmetry : T.muted, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{op.icon} {op.name}</button>
        ))}
      </div>
      <svg viewBox="0 0 400 200" style={{ width: "100%", maxWidth: 400, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {sel === 0 && (<>
          {/* Rotation */}
          <polygon points="200,50 240,130 160,130" fill={T.cs_symmetry + "33"} stroke={T.cs_symmetry} strokeWidth={2} />
          <circle cx={200} cy={100} r={4} fill={T.cs_symmetry} />
          <path d="M 220 60 A 40 40 0 0 1 250 100" fill="none" stroke={T.cs_accent} strokeWidth={2} markerEnd="url(#arr2)" />
          <text x={260} y={80} fill={T.cs_accent} fontSize={11}>C₃: 120°</text>
        </>)}
        {sel === 1 && (<>
          {/* Reflection */}
          <line x1={200} y1={30} x2={200} y2={180} stroke={T.cs_symmetry} strokeWidth={2} strokeDasharray="6,4" />
          <polygon points="120,80 160,140 100,140" fill={T.cs_primary + "33"} stroke={T.cs_primary} strokeWidth={2} />
          <polygon points="280,80 240,140 300,140" fill={T.cs_accent + "33"} stroke={T.cs_accent} strokeWidth={2} />
          <text x={200} y={195} textAnchor="middle" fill={T.muted} fontSize={11}>Mirror plane σ</text>
        </>)}
        {sel === 2 && (<>
          {/* Inversion */}
          <circle cx={200} cy={100} r={5} fill={T.cs_symmetry} />
          <circle cx={150} cy={70} r={10} fill={T.cs_primary + "44"} stroke={T.cs_primary} strokeWidth={2} />
          <circle cx={250} cy={130} r={10} fill={T.cs_accent + "44"} stroke={T.cs_accent} strokeWidth={2} />
          <line x1={155} y1={73} x2={245} y2={127} stroke={T.cs_symmetry} strokeWidth={1} strokeDasharray="4,3" />
          <text x={200} y={195} textAnchor="middle" fill={T.muted} fontSize={11}>(x,y,z) → (-x,-y,-z)</text>
        </>)}
        {sel === 3 && (<>
          {/* Improper rotation */}
          <polygon points="200,40 230,90 170,90" fill={T.cs_primary + "33"} stroke={T.cs_primary} strokeWidth={2} />
          <line x1={150} y1={110} x2={250} y2={110} stroke={T.cs_symmetry} strokeWidth={1.5} strokeDasharray="5,4" />
          <polygon points="200,170 170,120 230,120" fill={T.cs_accent + "33"} stroke={T.cs_accent} strokeWidth={2} />
          <path d="M 240 55 A 35 35 0 0 1 265 90" fill="none" stroke={T.cs_cell} strokeWidth={2} markerEnd="url(#arr2)" />
          <text x={200} y={195} textAnchor="middle" fill={T.muted} fontSize={11}>S₃ = C₃ + σₕ</text>
        </>)}
        <defs><marker id="arr2" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto"><polygon points="0 0, 8 3, 0 6" fill={T.cs_accent} /></marker></defs>
      </svg>
      <Card title="Crystallographic Restriction" color={T.cs_symmetry}>
        <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.6, margin: 0 }}>Only C₁, C₂, C₃, C₄, and C₆ rotations are compatible with translational periodicity. C₅ and C₇+ cannot tile space — this is why there are no pentagonal crystals.</p>
      </Card>
    </div>
  );
}

// ── SECTION 5: POINT & SPACE GROUPS ──
function GroupsSection() {
  const groups = [
    { system: "Cubic", point: "Oh, Td, O, Th, T", count: 5, example: "m3̄m (NaCl)" },
    { system: "Hexagonal", point: "C6v, D6h, C6h, ...", count: 7, example: "6/mmm (Mg)" },
    { system: "Tetragonal", point: "C4v, D4h, D2d, ...", count: 7, example: "4/mmm (TiO₂)" },
    { system: "Trigonal", point: "C3v, D3d, D3, ...", count: 5, example: "3̄m (Al₂O₃)" },
    { system: "Orthorhombic", point: "D2h, C2v, D2", count: 3, example: "mmm (BaSO₄)" },
    { system: "Monoclinic", point: "C2h, Cs, C2", count: 3, example: "2/m (gypsum)" },
    { system: "Triclinic", point: "Ci, C1", count: 2, example: "1̄ (K₂Cr₂O₇)" },
  ];
  return (
    <div>
      <SectionTitle color={T.cs_miller} icon="🏛️">Point & Space Groups</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        <Tag color={T.cs_miller}>32 POINT GROUPS</Tag> describe all possible combinations of rotation and reflection symmetries. Combined with translational symmetry (glide planes, screw axes), they form <Tag color={T.cs_symmetry}>230 SPACE GROUPS</Tag>.
      </p>
      <Card title="Hermann-Mauguin Notation" color={T.cs_miller}>
        <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.6, margin: 0 }}>
          Uses numbers for rotation axes (2, 3, 4, 6), m for mirror planes, and bars for improper rotations (3̄, 4̄). Screw axes: 2₁, 3₁, 4₁, 6₁, etc. Glide planes: a, b, c, n, d.
        </p>
      </Card>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginTop: 10 }}>
        <thead>
          <tr style={{ background: T.cs_miller + "15" }}>{["System", "Point Groups", "#", "Example"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${T.cs_miller}44`, color: T.cs_miller, fontWeight: 700 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {groups.map((g, i) => (
            <tr key={g.system} style={{ background: i % 2 ? T.surface : T.panel }}>
              <td style={{ padding: "6px 10px", fontWeight: 600 }}>{g.system}</td>
              <td style={{ padding: "6px 10px" }}>{g.point}</td>
              <td style={{ padding: "6px 10px" }}>{g.count}</td>
              <td style={{ padding: "6px 10px", color: T.cs_miller }}>{g.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>Total: 32 point groups → 230 space groups (with translations).</p>
    </div>
  );
}

// ── SECTION 6: MILLER INDICES ──
function MillerSection() {
  const planes = [
    { name: "(100)", intercepts: "a, ∞, ∞", desc: "Plane perpendicular to x-axis", pts: [[50,50],[50,200],[50,200]] },
    { name: "(110)", intercepts: "a, b, ∞", desc: "Plane cutting x and y axes", pts: [[50,50],[200,50],[200,200]] },
    { name: "(111)", intercepts: "a, b, c", desc: "Plane cutting all three axes", pts: [[50,50],[200,50],[125,200]] },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <SectionTitle color={T.cs_cell} icon="✂️">Miller Indices</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
        <Tag color={T.cs_cell}>MILLER INDICES</Tag> (hkl) describe crystal plane orientations. Steps: find axis intercepts → take reciprocals → reduce to smallest integers.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {planes.map((p, i) => (
          <button key={p.name} onClick={() => setSel(i)} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${sel === i ? T.cs_cell : T.border}`, background: sel === i ? T.cs_cell + "22" : "transparent", color: sel === i ? T.cs_cell : T.muted, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>{p.name}</button>
        ))}
      </div>
      <svg viewBox="0 0 300 250" style={{ width: "100%", maxWidth: 300, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {/* Cube wireframe */}
        <line x1={80} y1={180} x2={250} y2={180} stroke={T.border} strokeWidth={1.5} />
        <line x1={80} y1={180} x2={80} y2={40} stroke={T.border} strokeWidth={1.5} />
        <line x1={80} y1={180} x2={30} y2={220} stroke={T.border} strokeWidth={1.5} />
        <line x1={250} y1={180} x2={250} y2={40} stroke={T.border} strokeWidth={1.5} />
        <line x1={250} y1={180} x2={200} y2={220} stroke={T.border} strokeWidth={1.5} />
        <line x1={80} y1={40} x2={250} y2={40} stroke={T.border} strokeWidth={1.5} />
        <line x1={30} y1={220} x2={200} y2={220} stroke={T.border} strokeWidth={1.5} />
        <line x1={80} y1={40} x2={30} y2={80} stroke={T.border} strokeWidth={1.5} />
        <line x1={30} y1={80} x2={30} y2={220} stroke={T.border} strokeWidth={1.5} />
        <line x1={250} y1={40} x2={200} y2={80} stroke={T.border} strokeWidth={1.5} />
        <line x1={200} y1={80} x2={30} y2={80} stroke={T.border} strokeWidth={1.5} />
        <line x1={200} y1={80} x2={200} y2={220} stroke={T.border} strokeWidth={1.5} />
        {/* Plane highlight */}
        {sel === 0 && <polygon points="80,40 80,180 30,220 30,80" fill={T.cs_cell + "33"} stroke={T.cs_cell} strokeWidth={2} />}
        {sel === 1 && <polygon points="80,40 250,40 200,80 30,80" fill={T.cs_cell + "33"} stroke={T.cs_cell} strokeWidth={2} />}
        {sel === 2 && <polygon points="80,180 250,40 200,80" fill={T.cs_cell + "33"} stroke={T.cs_cell} strokeWidth={2} />}
        {/* Axis labels */}
        <text x={265} y={185} fill={T.cs_primary} fontSize={12} fontWeight={700}>a</text>
        <text x={75} y={30} fill={T.cs_accent} fontSize={12} fontWeight={700}>c</text>
        <text x={18} y={230} fill={T.cs_cell} fontSize={12} fontWeight={700}>b</text>
      </svg>
      <Card title={`Plane ${planes[sel].name}`} color={T.cs_cell}>
        <div style={{ fontSize: 12, color: T.ink }}>
          <div><strong>Intercepts:</strong> {planes[sel].intercepts}</div>
          <div><strong>Description:</strong> {planes[sel].desc}</div>
        </div>
      </Card>
      <Card title="Notation Guide" color={T.cs_symmetry}>
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7 }}>
          <div><strong>(hkl)</strong> — specific plane</div>
          <div><strong>[hkl]</strong> — specific direction</div>
          <div><strong>{"{hkl}"}</strong> — family of equivalent planes</div>
          <div><strong>⟨hkl⟩</strong> — family of equivalent directions</div>
        </div>
      </Card>
    </div>
  );
}

// ── SECTION 7: COMMON STRUCTURES ──
function StructuresSection() {
  const structures = [
    { name: "FCC", coord: 12, packing: "74%", examples: "Cu, Al, Au, Ag", atoms: 4 },
    { name: "BCC", coord: 8, packing: "68%", examples: "Fe, W, Cr, Mo", atoms: 2 },
    { name: "HCP", coord: 12, packing: "74%", examples: "Mg, Ti, Zn, Co", atoms: 2 },
    { name: "NaCl", coord: "6:6", packing: "~67%", examples: "NaCl, MgO, TiN", atoms: 8 },
    { name: "CsCl", coord: "8:8", packing: "~69%", examples: "CsCl, CsBr", atoms: 2 },
    { name: "Diamond", coord: 4, packing: "34%", examples: "C, Si, Ge", atoms: 8 },
    { name: "Zinc Blende", coord: "4:4", packing: "34%", examples: "GaAs, ZnS, InP", atoms: 8 },
    { name: "Perovskite", coord: "12/6", packing: "~", examples: "BaTiO₃, SrTiO₃", atoms: 5 },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <SectionTitle color={T.cs_struct} icon="💎">Common Structures</SectionTitle>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {structures.map((s, i) => (
          <button key={s.name} onClick={() => setSel(i)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${sel === i ? T.cs_struct : T.border}`, background: sel === i ? T.cs_struct + "22" : "transparent", color: sel === i ? T.cs_struct : T.muted, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>{s.name}</button>
        ))}
      </div>
      <svg viewBox="0 0 300 200" style={{ width: "100%", maxWidth: 300, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 10 }}>
        {sel === 0 && (<>
          {/* FCC */}
          {[[60,60],[180,60],[60,160],[180,160]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={14} fill={T.cs_primary+"44"} stroke={T.cs_primary} strokeWidth={2}/>)}
          {[[120,60],[60,110],[180,110],[120,160]].map(([x,y],i) => <circle key={`f${i}`} cx={x} cy={y} r={12} fill={T.cs_accent+"55"} stroke={T.cs_accent} strokeWidth={2}/>)}
          <circle cx={120} cy={110} r={10} fill={T.cs_cell+"55"} stroke={T.cs_cell} strokeWidth={2}/>
          <text x={240} y={110} fill={T.ink} fontSize={11} fontWeight={700}>FCC</text>
          <text x={240} y={126} fill={T.muted} fontSize={10}>4 atoms/cell</text>
        </>)}
        {sel === 1 && (<>
          {/* BCC */}
          {[[60,50],[180,50],[60,170],[180,170]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={14} fill={T.cs_primary+"44"} stroke={T.cs_primary} strokeWidth={2}/>)}
          <circle cx={120} cy={110} r={14} fill={T.cs_accent+"55"} stroke={T.cs_accent} strokeWidth={2}/>
          <text x={220} y={110} fill={T.ink} fontSize={11} fontWeight={700}>BCC</text>
          <text x={220} y={126} fill={T.muted} fontSize={10}>2 atoms/cell</text>
        </>)}
        {sel >= 2 && (<>
          <text x={150} y={90} textAnchor="middle" fill={T.cs_struct} fontSize={16} fontWeight={800}>{structures[sel].name}</text>
          <text x={150} y={115} textAnchor="middle" fill={T.muted} fontSize={12}>Coordination: {structures[sel].coord}</text>
          <text x={150} y={135} textAnchor="middle" fill={T.muted} fontSize={12}>Packing: {structures[sel].packing}</text>
          <text x={150} y={155} textAnchor="middle" fill={T.cs_struct} fontSize={11}>{structures[sel].examples}</text>
        </>)}
      </svg>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: T.cs_struct + "15" }}>{["Structure", "Coord #", "Packing", "Atoms/cell", "Examples"].map(h => <th key={h} style={{ padding: "7px 8px", textAlign: "left", borderBottom: `2px solid ${T.cs_struct}44`, color: T.cs_struct, fontWeight: 700 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {structures.map((s, i) => (
            <tr key={s.name} onClick={() => setSel(i)} style={{ background: i % 2 ? T.surface : T.panel, cursor: "pointer", fontWeight: sel === i ? 700 : 400 }}>
              <td style={{ padding: "5px 8px", color: T.cs_struct }}>{s.name}</td>
              <td style={{ padding: "5px 8px" }}>{s.coord}</td>
              <td style={{ padding: "5px 8px" }}>{s.packing}</td>
              <td style={{ padding: "5px 8px" }}>{s.atoms}</td>
              <td style={{ padding: "5px 8px" }}>{s.examples}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ── SECTION 8: CLOSE PACKING ──
function PackingSection() {
  const [stacking, setStacking] = useState("fcc");
  return (
    <div>
      <SectionTitle color={T.cs_pack} icon="🔵">Close Packing</SectionTitle>
      <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>
        Close-packed structures achieve the maximum packing efficiency of <Tag color={T.cs_pack}>74%</Tag>. The two arrangements differ only in their stacking sequence of hexagonal layers.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={() => setStacking("fcc")} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${stacking === "fcc" ? T.cs_primary : T.border}`, background: stacking === "fcc" ? T.cs_primary + "22" : "transparent", color: stacking === "fcc" ? T.cs_primary : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>FCC (ABCABC)</button>
        <button onClick={() => setStacking("hcp")} style={{ padding: "6px 16px", borderRadius: 6, border: `1px solid ${stacking === "hcp" ? T.cs_pack : T.border}`, background: stacking === "hcp" ? T.cs_pack + "22" : "transparent", color: stacking === "hcp" ? T.cs_pack : T.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>HCP (ABAB)</button>
      </div>
      <svg viewBox="0 0 400 220" style={{ width: "100%", maxWidth: 400, background: T.surface, borderRadius: 10, border: `1px solid ${T.border}` }}>
        {/* Layer A */}
        {[50,100,150,200,250,300,350].map((x, i) => <circle key={`a${i}`} cx={x} cy={40} r={18} fill={T.cs_primary + "44"} stroke={T.cs_primary} strokeWidth={1.5} />)}
        <text x={380} y={44} fill={T.cs_primary} fontSize={13} fontWeight={800}>A</text>
        {/* Layer B */}
        {[75,125,175,225,275,325].map((x, i) => <circle key={`b${i}`} cx={x} cy={80} r={18} fill={T.cs_accent + "44"} stroke={T.cs_accent} strokeWidth={1.5} />)}
        <text x={380} y={84} fill={T.cs_accent} fontSize={13} fontWeight={800}>B</text>
        {/* Layer C or A */}
        {stacking === "fcc" ? (
          <>
            {[100,150,200,250,300].map((x, i) => <circle key={`c${i}`} cx={x} cy={120} r={18} fill={T.cs_cell + "44"} stroke={T.cs_cell} strokeWidth={1.5} />)}
            <text x={380} y={124} fill={T.cs_cell} fontSize={13} fontWeight={800}>C</text>
            {[50,100,150,200,250,300,350].map((x, i) => <circle key={`a2${i}`} cx={x} cy={160} r={18} fill={T.cs_primary + "44"} stroke={T.cs_primary} strokeWidth={1.5} />)}
            <text x={380} y={164} fill={T.cs_primary} fontSize={13} fontWeight={800}>A</text>
          </>
        ) : (
          <>
            {[50,100,150,200,250,300,350].map((x, i) => <circle key={`a2${i}`} cx={x} cy={120} r={18} fill={T.cs_primary + "44"} stroke={T.cs_primary} strokeWidth={1.5} />)}
            <text x={380} y={124} fill={T.cs_primary} fontSize={13} fontWeight={800}>A</text>
            {[75,125,175,225,275,325].map((x, i) => <circle key={`b2${i}`} cx={x} cy={160} r={18} fill={T.cs_accent + "44"} stroke={T.cs_accent} strokeWidth={1.5} />)}
            <text x={380} y={164} fill={T.cs_accent} fontSize={13} fontWeight={800}>B</text>
          </>
        )}
        <text x={200} y={210} textAnchor="middle" fill={T.muted} fontSize={11}>{stacking === "fcc" ? "FCC: ...ABCABCABC... (Cu, Al, Au)" : "HCP: ...ABABAB... (Mg, Ti, Zn)"}</text>
      </svg>
      <Card title="Packing Efficiency Comparison" color={T.cs_pack}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8, fontSize: 12 }}>
          {[
            ["FCC / HCP", "74.05%"],
            ["BCC", "68.02%"],
            ["Simple Cubic", "52.36%"],
            ["Diamond", "34.01%"],
          ].map(([name, eff]) => (
            <div key={name} style={{ padding: "6px 10px", background: T.surface, borderRadius: 6 }}>
              <div style={{ fontWeight: 700, color: T.cs_pack }}>{name}</div>
              <div style={{ color: T.ink }}>{eff}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Interstitial Sites" color={T.cs_cell}>
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7 }}>
          <div><strong>Tetrahedral:</strong> 4 atoms surround the site. Radius ratio r/R ≤ 0.225. 2N sites per N atoms in FCC.</div>
          <div><strong>Octahedral:</strong> 6 atoms surround the site. Radius ratio r/R ≤ 0.414. N sites per N atoms in FCC.</div>
        </div>
      </Card>
    </div>
  );
}

// ── SECTIONS ARRAY ──
const CRYSTAL_SECTIONS = [
  { id: "basics",    label: "Crystal Basics",     icon: "🔷", color: T.cs_primary,  Component: BasicsSection },
  { id: "bravais",   label: "Bravais Lattices",   icon: "📐", color: T.cs_accent,   Component: BravaisSection },
  { id: "unitcell",  label: "Unit Cell",          icon: "📦", color: T.cs_lattice,  Component: UnitCellSection },
  { id: "symmetry",  label: "Symmetry Ops",       icon: "🔄", color: T.cs_symmetry, Component: SymmetrySection },
  { id: "groups",    label: "Point & Space Groups",icon: "🏛️", color: T.cs_miller,  Component: GroupsSection },
  { id: "miller",    label: "Miller Indices",      icon: "✂️", color: T.cs_cell,    Component: MillerSection },
  { id: "structures",label: "Common Structures",   icon: "💎", color: T.cs_struct,  Component: StructuresSection },
  { id: "packing",   label: "Close Packing",       icon: "🔵", color: T.cs_pack,    Component: PackingSection },
];

export default function CrystalStructuresModule() {
  const [active, setActive] = useState("basics");
  const sec = CRYSTAL_SECTIONS.find(s => s.id === active);
  const { Component } = sec;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace", color: T.ink, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.panel + "ee", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: T.cs_primary, textTransform: "uppercase" }}>Solid-State Physics</div>
          <div style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg, ${T.cs_primary}, ${T.cs_accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Crystal Structures</div>
        </div>
        <div style={{ fontSize: 11, color: T.muted }}>Bravais lattices, symmetry & Miller indices</div>
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", padding: "10px 24px", gap: 6, borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {CRYSTAL_SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${active === s.id ? s.color : T.border}`, background: active === s.id ? s.color + "22" : T.bg, color: active === s.id ? s.color : T.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
            <span>{s.icon}</span>
            <span style={{ fontSize: 10, color: active === s.id ? s.color : T.dim, marginRight: 2 }}>{i + 1}.</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Pipeline flow */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 24px", gap: 4, overflowX: "auto", background: T.panel }}>
        {CRYSTAL_SECTIONS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div onClick={() => setActive(s.id)} style={{ padding: "2px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer", background: active === s.id ? s.color + "33" : "transparent", color: active === s.id ? s.color : T.dim, border: `1px solid ${active === s.id ? s.color + "66" : "transparent"}`, whiteSpace: "nowrap" }}>{s.label}</div>
            {i < CRYSTAL_SECTIONS.length - 1 && <span style={{ color: T.dim, fontSize: 10 }}>→</span>}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <Component />
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel }}>
        <button onClick={() => { const i = CRYSTAL_SECTIONS.findIndex(s => s.id === active); if (i > 0) setActive(CRYSTAL_SECTIONS[i - 1].id); }} disabled={active === CRYSTAL_SECTIONS[0].id} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CRYSTAL_SECTIONS[0].id ? T.surface : sec.color + "22", border: `1px solid ${active === CRYSTAL_SECTIONS[0].id ? T.border : sec.color}`, color: active === CRYSTAL_SECTIONS[0].id ? T.muted : sec.color, cursor: active === CRYSTAL_SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>← Previous</button>
        <div style={{ display: "flex", gap: 6 }}>
          {CRYSTAL_SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{ width: 8, height: 8, borderRadius: 4, background: active === s.id ? s.color : T.dim, cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>
        <button onClick={() => { const i = CRYSTAL_SECTIONS.findIndex(s => s.id === active); if (i < CRYSTAL_SECTIONS.length - 1) setActive(CRYSTAL_SECTIONS[i + 1].id); }} disabled={active === CRYSTAL_SECTIONS[CRYSTAL_SECTIONS.length - 1].id} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CRYSTAL_SECTIONS[CRYSTAL_SECTIONS.length - 1].id ? T.surface : sec.color + "22", border: `1px solid ${active === CRYSTAL_SECTIONS[CRYSTAL_SECTIONS.length - 1].id ? T.border : sec.color}`, color: active === CRYSTAL_SECTIONS[CRYSTAL_SECTIONS.length - 1].id ? T.muted : sec.color, cursor: active === CRYSTAL_SECTIONS[CRYSTAL_SECTIONS.length - 1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>Next →</button>
      </div>
    </div>
  );
}
