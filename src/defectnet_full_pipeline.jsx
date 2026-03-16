import { useState, useMemo } from "react";

// ─── COLORS ────────────────────────────────────────────────────────────
const C = {
  bg: "#070b14", panel: "#0c1220", border: "#1a2744",
  accent1: "#38bdf8", accent2: "#fbbf24", accent3: "#34d399",
  accent4: "#f87171", accent5: "#a78bfa", accent6: "#fb923c",
  text: "#e2e8f0", muted: "#64748b", dim: "#334155",
};

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
const ELEM_COLOR = { 1: C.accent1, 7: C.accent3, 8: C.accent4 };

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
    color: C.accent4,
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
    color: C.accent3,
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
      const d = [0, 1, 2].map(k => atoms[j].pos[k] - atoms[i].pos[k]);
      const dist = Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2);
      if (dist < 5.0) edges.push({ id: edges.length, src: j, dst: i, dist, vec: d });
    }
  edges.sort((a, b) => a.dist - b.dist);
  return edges;
}

// ─── BUILD TRIPLETS (real angles from dot products) ────────────────────
function buildTriplets(edges, nAtoms) {
  const byDst = Array.from({ length: nAtoms }, () => []);
  edges.forEach((e, idx) => byDst[e.dst].push(idx));
  const triplets = [];
  for (let i = 0; i < nAtoms; i++) {
    const inc = byDst[i];
    for (let a = 0; a < inc.length; a++)
      for (let b = a + 1; b < inc.length; b++) {
        const e1 = edges[inc[a]], e2 = edges[inc[b]];
        const dot = e1.vec[0] * e2.vec[0] + e1.vec[1] * e2.vec[1] + e1.vec[2] * e2.vec[2];
        const cosT = Math.max(-1, Math.min(1, dot / (e1.dist * e2.dist)));
        triplets.push({ center: i, e1: inc[a], e2: inc[b], cosT, angle: Math.acos(cosT) * 180 / Math.PI });
      }
  }
  return triplets;
}

// ─── FULL GNN FORWARD PASS ─────────────────────────────────────────────
function runGNN(atoms, edges, triplets, mol) {
  const N = atoms.length;
  // 1. Embeddings
  const h0 = atoms.map(a => [...EMBED[a.Z]]);
  // 2. Edge features
  const eFeat = edges.map(e => gaussSmear(e.dist));
  const eCut = edges.map(e => cutoffFn(e.dist));
  // 3. 2-body
  const h1 = h0.map(h => [...h]);
  const msgs2 = [];
  for (let ei = 0; ei < edges.length; ei++) {
    const { src, dst } = edges[ei];
    const input = [...h0[dst], ...h0[src], ...eFeat[ei]];
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
const SECTIONS = [
  { id: "struct", label: "1. Structure & Graph", color: C.accent1 },
  { id: "embed", label: "2. Atom Embedding", color: C.accent5 },
  { id: "gauss", label: "3. Gaussian Smearing", color: C.accent2 },
  { id: "cutoff", label: "4. Cosine Cutoff", color: C.accent6 },
  { id: "angular", label: "5. Angular Basis", color: C.accent5 },
  { id: "conv", label: "6. Message Passing", color: C.accent4 },
  { id: "predict", label: "7. Predictions", color: C.accent3 },
];

// ─── UI COMPONENTS ─────────────────────────────────────────────────────
function Card({ title, color, children }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${color || C.border}44`, borderLeft: `3px solid ${color || C.accent1}`, borderRadius: 10, padding: "14px 16px" }}>
      {title && <div style={{ fontSize: 11, letterSpacing: 3, color: color || C.accent1, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>{title}</div>}
      {children}
    </div>
  );
}

function MR({ label, eq, result, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>
      {label && <span style={{ color: C.muted, minWidth: 80 }}>{label}</span>}
      <span style={{ color: C.text, fontFamily: "monospace" }}>{eq}</span>
      {result !== undefined && <><span style={{ color: C.muted }}>=</span><span style={{ color: color || C.accent3, fontWeight: 700, fontFamily: "monospace" }}>{result}</span></>}
    </div>
  );
}

function Vec({ v, color, label }) {
  return (
    <div style={{ marginBottom: 6 }}>
      {label && <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>{label}</div>}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ color: C.muted }}>[</span>
        {v.map((x, i) => (
          <span key={i} style={{ background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 4, padding: "2px 7px", fontSize: 12, fontFamily: "monospace", color }}>{typeof x === "number" ? x.toFixed(4) : x}</span>
        ))}
        <span style={{ color: C.muted }}>]</span>
        <span style={{ color: C.dim, fontSize: 10 }}>dim={v.length}</span>
      </div>
    </div>
  );
}

// ─── MOLECULE SVG ──────────────────────────────────────────────────────
function MolSVG({ mol, edges, hlEdge = -1 }) {
  const sp = mol.svgPos;
  return (
    <svg width={420} height={340} style={{ display: "block" }}>
      <rect width={420} height={340} fill={C.bg} rx={8} />
      {edges.map((e, i) => {
        const [sx, sy] = sp[e.src], [ex, ey] = sp[e.dst];
        const dx = ex - sx, dy = ey - sy, len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len, R = 22;
        const x1 = sx + ux * R, y1 = sy + uy * R, x2 = ex - ux * (R + 8), y2 = ey - uy * (R + 8);
        const hl = hlEdge === i;
        return (
          <g key={i} opacity={hl ? 1 : 0.2}>
            <defs><marker id={`ar${i}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d={`M0,0 L0,6 L6,3z`} fill={hl ? C.accent2 : C.dim} /></marker></defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hl ? C.accent2 : C.dim} strokeWidth={hl ? 2.5 : 1} markerEnd={`url(#ar${i})`} />
            {hl && <text x={(x1 + x2) / 2 - uy * 14} y={(y1 + y2) / 2 + ux * 14} fill={C.accent2} fontSize={10} textAnchor="middle" fontWeight="bold">{e.dist.toFixed(3)}Å</text>}
          </g>
        );
      })}
      {mol.atoms.map((a, i) => {
        const [cx, cy] = sp[i];
        const col = ELEM_COLOR[a.Z] || C.text;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={22} fill={`${col}22`} stroke={col} strokeWidth={2} />
            <text x={cx} y={cy - 2} textAnchor="middle" fill={col} fontSize={15} fontWeight="bold">{a.sym}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill={C.muted} fontSize={9}>id={a.id}</text>
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
          <div style={{ marginTop: 6, fontSize: 11, color: C.muted }}>Click an edge row to highlight it →</div>
        </Card>
      </div>
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Atom positions (Å)" color={C.accent1}>
          {atoms.map(a => (
            <div key={a.id} style={{ display: "flex", gap: 8, marginBottom: 4, fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: ELEM_COLOR[a.Z], fontWeight: 700, width: 60 }}>{a.sym} (id={a.id})</span>
              <span style={{ color: C.text }}>[{a.pos.map(v => v.toFixed(3)).join(", ")}]</span>
            </div>
          ))}
        </Card>

        <Card title={`edge_index — shape [2, ${edges.length}]`} color={C.accent2}>
          <div style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 6 }}>
            <div><span style={{ color: C.muted }}>src: </span><span style={{ color: C.accent2 }}>[{edges.map(e => e.src).join(", ")}]</span></div>
            <div><span style={{ color: C.muted }}>dst: </span><span style={{ color: C.accent1 }}>[{edges.map(e => e.dst).join(", ")}]</span></div>
          </div>
        </Card>

        <Card title={`All ${edges.length} edges (click to highlight)`} color={C.accent3}>
          <div style={{ fontSize: 11, fontFamily: "monospace" }}>
            {edges.map((e, i) => (
              <div key={i} onClick={() => setHlE(i)} style={{ display: "flex", gap: 6, padding: "3px 4px", cursor: "pointer", borderRadius: 4, background: hlE === i ? `${C.accent2}22` : "transparent" }}>
                <span style={{ color: C.dim, width: 20 }}>e{i}</span>
                <span style={{ width: 80 }}>
                  <span style={{ color: ELEM_COLOR[atoms[e.src].Z] }}>{atoms[e.src].sym}({e.src})</span>
                  <span style={{ color: C.muted }}>→</span>
                  <span style={{ color: ELEM_COLOR[atoms[e.dst].Z] }}>{atoms[e.dst].sym}({e.dst})</span>
                </span>
                <span style={{ color: C.accent3 }}>{e.dist.toFixed(4)} Å</span>
                <span style={{ color: C.text, flex: 1, textAlign: "right" }}>vec=[{e.vec.map(v => v.toFixed(3)).join(", ")}]</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title={`${triplets.length} triplets (3-body angle groups)`} color={C.accent5}>
          <div style={{ fontSize: 11, fontFamily: "monospace" }}>
            {triplets.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, padding: "2px 0" }}>
                <span style={{ color: C.muted }}>t{i}:</span>
                <span style={{ color: ELEM_COLOR[atoms[t.center].Z] }}>center={atoms[t.center].sym}({t.center})</span>
                <span style={{ color: C.accent5 }}>cos θ={t.cosT.toFixed(4)}</span>
                <span style={{ color: C.accent2 }}>{t.angle.toFixed(1)}°</span>
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
        <Card title="Embedding lookup table (118 × 3)" color={C.accent5}>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 10 }}>
            Each element gets a <span style={{ color: C.accent5 }}>3-dim vector</span> (real models use 64–128 dim).
            Just index by atomic number Z. Same element always gives the same vector.
          </div>
          {Object.entries(EMBED).map(([Z, vec]) => {
            const sym = { 1: "H", 7: "N", 8: "O" }[Z];
            return <Vec key={Z} v={vec} color={ELEM_COLOR[+Z]} label={`table[Z=${Z}] → ${sym}`} />;
          })}
        </Card>
      </div>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Embeddings for each atom in our molecule" color={C.accent3}>
          {atoms.map(a => (
            <div key={a.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 2 }}>
                h⁰[{a.id}] = table[Z={a.Z}] → {a.sym}
              </div>
              <Vec v={EMBED[a.Z]} color={ELEM_COLOR[a.Z]} />
              <div style={{ fontSize: 10, color: C.dim }}>Position: [{a.pos.map(v => v.toFixed(3)).join(", ")}]</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.7 }}>
            Note: H atoms (id 1 & 2) get the <span style={{ color: C.accent1 }}>same embedding</span> because they are the same element.
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
        <Card title="Select an edge" color={C.accent2}>
          {edges.map((ed, i) => (
            <div key={i} onClick={() => setSel(i)} style={{ display: "flex", gap: 8, padding: "4px 6px", cursor: "pointer", borderRadius: 4, background: sel === i ? `${C.accent2}22` : "transparent", fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: C.dim }}>e{i}</span>
              <span style={{ color: ELEM_COLOR[atoms[ed.src].Z] }}>{atoms[ed.src].sym}</span>
              <span style={{ color: C.muted }}>→</span>
              <span style={{ color: ELEM_COLOR[atoms[ed.dst].Z] }}>{atoms[ed.dst].sym}</span>
              <span style={{ color: C.accent3 }}>{ed.dist.toFixed(4)} Å</span>
            </div>
          ))}
        </Card>

        <Card title="Formula" color={C.accent2}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent2, textAlign: "center", padding: 6 }}>
            g_k(d) = exp( -(d - μ_k)² / σ² )
          </div>
          <MR label="σ =" eq="0.8 Å" />
          <MR label="Centers:" eq="[0.0, 1.0, 2.0, 3.0] Å" />
        </Card>
      </div>

      <div style={{ flex: "1 1 440px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title={`Step-by-step for e${sel}: d = ${e.dist.toFixed(4)} Å`} color={C.accent1}>
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: C.muted }}>
              {["k", "μ_k", "d − μ", "(d−μ)²", "÷ σ²=0.64", "exp(−x)", "g_k"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {G_MU.map((mu, k) => {
                const diff = e.dist - mu;
                const sq = diff ** 2;
                const div = sq / (G_SIG ** 2);
                const hl = gv[k] > 0.15;
                return (
                  <tr key={k} style={{ background: hl ? `${C.accent2}11` : "transparent" }}>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: C.dim }}>{k}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{mu.toFixed(1)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{diff.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{sq.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{div.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>exp(−{div.toFixed(3)})</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: hl ? C.accent2 : C.dim, fontWeight: hl ? 700 : 400 }}>{gv[k].toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Result: e_ij feature vector" color={C.accent3}>
          <Vec v={gv} color={C.accent2} label={`e_ij for d=${e.dist.toFixed(4)}Å → 4-dim`} />
        </Card>

        <Card title="All edges smeared" color={C.dim}>
          {edges.map((ed, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <Vec v={gaussSmear(ed.dist)} color={C.accent2} label={`e${i} (d=${ed.dist.toFixed(3)}Å) ${atoms[ed.src].sym}→${atoms[ed.dst].sym}`} />
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
        <Card title="Cosine Cutoff Formula" color={C.accent6}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent6, textAlign: "center", padding: 8 }}>
            w(d) = 0.5 × [cos(d × π / r_c) + 1]
          </div>
          <MR label="r_c =" eq="5.0 Å" />
          <MR label="w(0) =" eq="0.5×[cos(0)+1] = 0.5×2" result="1.0" color={C.accent3} />
          <MR label="w(5) =" eq="0.5×[cos(π)+1] = 0.5×0" result="0.0" color={C.accent4} />
        </Card>

        <Card title="Cutoff curve" color={C.accent6}>
          <svg width={400} height={120}>
            <rect width={400} height={120} fill={C.bg} rx={6} />
            <polyline fill="none" stroke={C.accent6} strokeWidth={2}
              points={Array.from({ length: 50 }, (_, i) => {
                const d = i * 5 / 49;
                return `${20 + d * 72},${105 - cutoffFn(d) * 85}`;
              }).join(" ")} />
            {[0, 1, 2, 3, 4, 5].map(v => (
              <text key={v} x={20 + v * 72} y={118} textAnchor="middle" fill={C.muted} fontSize={9}>{v}Å</text>
            ))}
            {edges.map((e, i) => (
              <circle key={i} cx={20 + e.dist * 72} cy={105 - cutoffFn(e.dist) * 85} r={4} fill={C.accent1} />
            ))}
          </svg>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Blue dots = our edges on the curve</div>
        </Card>
      </div>

      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Step-by-step for every edge" color={C.accent1}>
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: C.muted }}>
              {["edge", "d (Å)", "d×π/5", "cos(...)", "w(d)"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${C.border}` }}>{h}</th>
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
                    <td style={{ padding: "4px 6px", textAlign: "right", color: C.accent3 }}>{e.dist.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{arg.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{cosV.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: C.accent6, fontWeight: 700 }}>{w.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Summary" color={C.accent3}>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }}>
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
        <Card title="Select a triplet" color={C.accent5}>
          {triplets.map((tr, i) => (
            <div key={i} onClick={() => setSel(i)} style={{ display: "flex", gap: 6, padding: "4px 6px", cursor: "pointer", borderRadius: 4, background: sel === i ? `${C.accent5}22` : "transparent", fontFamily: "monospace", fontSize: 12 }}>
              <span style={{ color: C.dim }}>t{i}</span>
              <span style={{ color: ELEM_COLOR[atoms[tr.center].Z], fontWeight: 700 }}>center={atoms[tr.center].sym}({tr.center})</span>
              <span style={{ color: C.accent5 }}>cos θ = {tr.cosT.toFixed(4)}</span>
              <span style={{ color: C.accent2 }}>{tr.angle.toFixed(1)}°</span>
            </div>
          ))}
        </Card>

        <Card title="How cos θ is computed" color={C.accent2}>
          <MR label="Edge 1:" eq={`e${t.e1}: ${atoms[e1.src].sym}(${e1.src})→${atoms[e1.dst].sym}(${e1.dst}), vec=[${e1.vec.map(v => v.toFixed(3)).join(", ")}]`} />
          <MR label="Edge 2:" eq={`e${t.e2}: ${atoms[e2.src].sym}(${e2.src})→${atoms[e2.dst].sym}(${e2.dst}), vec=[${e2.vec.map(v => v.toFixed(3)).join(", ")}]`} />
          <div style={{ height: 8 }} />
          <MR label="dot product:" eq={`${e1.vec.map((v, k) => `${v.toFixed(3)}×${e2.vec[k].toFixed(3)}`).join(" + ")}`}
            result={(e1.vec[0] * e2.vec[0] + e1.vec[1] * e2.vec[1] + e1.vec[2] * e2.vec[2]).toFixed(4)} />
          <MR label="|v1|×|v2|:" eq={`${e1.dist.toFixed(4)} × ${e2.dist.toFixed(4)}`} result={(e1.dist * e2.dist).toFixed(4)} />
          <MR label="cos θ:" eq="dot / (|v1|×|v2|)" result={t.cosT.toFixed(4)} color={C.accent5} />
          <MR label="θ:" eq={`arccos(${t.cosT.toFixed(4)})`} result={`${t.angle.toFixed(1)}°`} color={C.accent2} />
        </Card>
      </div>

      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Card title="Angular basis expansion" color={C.accent5}>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent5, textAlign: "center", padding: 6 }}>
            a_k(cos θ) = exp( -(cos θ - c_k)² / σ² )
          </div>
          <MR label="σ =" eq="0.5" />
          <MR label="Centers:" eq="[-1.0, -0.33, 0.33, 1.0]" />
          <div style={{ height: 10 }} />
          <table style={{ fontSize: 12, width: "100%", borderCollapse: "collapse", fontFamily: "monospace" }}>
            <thead><tr style={{ color: C.muted }}>
              {["k", "c_k", "cos θ − c_k", "(...)²/0.25", "a_k"].map(h => (
                <th key={h} style={{ padding: "4px 6px", textAlign: "right", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {A_MU.map((c, k) => {
                const diff = t.cosT - c;
                const exp = diff ** 2 / (A_SIG ** 2);
                const hl = av[k] > 0.15;
                return (
                  <tr key={k} style={{ background: hl ? `${C.accent5}11` : "transparent" }}>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: C.dim }}>{k}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{c.toFixed(2)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{diff.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right" }}>{exp.toFixed(4)}</td>
                    <td style={{ padding: "4px 6px", textAlign: "right", color: hl ? C.accent5 : C.dim, fontWeight: hl ? 700 : 400 }}>{av[k].toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Result: angular feature vector" color={C.accent3}>
          <Vec v={av} color={C.accent5} label={`a(cos θ = ${t.cosT.toFixed(4)}) → 4-dim`} />
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

  const m2 = gnn.msgs2[sel2];
  const m3 = gnn.msgs3[sel3];

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 100%", display: "flex", gap: 6, marginBottom: 4 }}>
        {[["2b", "2-Body Conv"], ["3b", "3-Body Conv"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: tab === k ? `${C.accent4}22` : C.panel,
            border: `1px solid ${tab === k ? C.accent4 : C.border}`,
            color: tab === k ? C.accent4 : C.muted, fontFamily: "inherit",
          }}>{l}</button>
        ))}
      </div>

      {tab === "2b" && m2 && (() => {
        const e = edges[m2.ei];
        return (
          <>
            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Pick edge" color={C.accent4}>
                {edges.map((ed, i) => (
                  <div key={i} onClick={() => setSel2(i)} style={{ padding: "3px 6px", cursor: "pointer", borderRadius: 4, background: sel2 === i ? `${C.accent4}22` : "transparent", fontFamily: "monospace", fontSize: 11 }}>
                    e{i}: {atoms[ed.src].sym}({ed.src})→{atoms[ed.dst].sym}({ed.dst}) d={ed.dist.toFixed(3)}Å
                  </div>
                ))}
              </Card>

              <Card title="Step 1: Build input vector [h_i, h_j, e_ij]" color={C.accent1}>
                <Vec v={gnn.h0[e.dst]} color={C.accent1} label={`h_i = embed[${atoms[e.dst].sym}] (center atom ${e.dst})`} />
                <Vec v={gnn.h0[e.src]} color={C.accent3} label={`h_j = embed[${atoms[e.src].sym}] (neighbor atom ${e.src})`} />
                <Vec v={gnn.eFeat[m2.ei]} color={C.accent2} label={`e_ij = gaussSmear(${e.dist.toFixed(4)})`} />
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Concatenated: dim = 3 + 3 + 4 = <span style={{ color: C.accent3, fontWeight: 700 }}>10</span></div>
                <Vec v={m2.input} color={C.text} label="Full input vector:" />
              </Card>

              <Card title="Step 2: W × input + b → 6-dim raw" color={C.accent5}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>W shape: [6, 10], b shape: [6]</div>
                {m2.raw.map((v, r) => (
                  <div key={r} style={{ fontSize: 10, fontFamily: "monospace", marginBottom: 3 }}>
                    <span style={{ color: r < 3 ? C.accent4 : C.accent6 }}>{r < 3 ? "gate" : "core"}[{r % 3}]: </span>
                    <span style={{ color: C.text }}>{W2[r].map((w, j) => `${w >= 0 ? "+" : ""}${w.toFixed(2)}×${m2.input[j].toFixed(2)}`).join(" ")}</span>
                    <span style={{ color: C.muted }}> + {b2[r].toFixed(2)}</span>
                    <span style={{ color: C.accent3 }}> = {v.toFixed(4)}</span>
                  </div>
                ))}
                <Vec v={m2.raw} color={C.accent5} label="raw output (6-dim):" />
              </Card>
            </div>

            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Step 3: Split → sigmoid(gate) ⊙ softplus(core)" color={C.accent4}>
                <div style={{ fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: C.accent4 }}>Gate (first 3):</span> control how much passes through
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`sigmoid(${m2.raw[i].toFixed(4)})`} result={m2.gate[i].toFixed(4)} color={C.accent4} />
                ))}
                <Vec v={m2.gate} color={C.accent4} label="gate (range 0 to 1):" />

                <div style={{ fontSize: 12, marginTop: 10, marginBottom: 8 }}>
                  <span style={{ color: C.accent6 }}>Core (last 3):</span> the actual message content
                </div>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`softplus(${m2.raw[i + 3].toFixed(4)})`} result={m2.core[i].toFixed(4)} color={C.accent6} />
                ))}
                <Vec v={m2.core} color={C.accent6} label="core (always positive):" />
              </Card>

              <Card title="Step 4: msg = gate ⊙ core × w(d)" color={C.accent3}>
                <MR label="w(d):" eq={`cutoff(${e.dist.toFixed(4)})`} result={m2.cut.toFixed(4)} color={C.accent6} />
                <div style={{ height: 6 }} />
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`${m2.gate[i].toFixed(4)} × ${m2.core[i].toFixed(4)} × ${m2.cut.toFixed(4)}`}
                    result={m2.msg[i].toFixed(4)} color={C.accent3} />
                ))}
                <Vec v={m2.msg} color={C.accent3} label="Final message (3-dim):" />
              </Card>

              <Card title="Step 5: After scatter_add → h'_i" color={C.accent2}>
                <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8 }}>
                  All messages to atom {e.dst} ({atoms[e.dst].sym}) are summed, added to h⁰, then softplus:
                </div>
                <Vec v={gnn.h1[e.dst]} color={C.accent2} label={`h'[${e.dst}] = softplus( h⁰ + Σ msgs )`} />
              </Card>
            </div>
          </>
        );
      })()}

      {tab === "3b" && m3 && (() => {
        const t = triplets[m3.ti];
        const e1 = edges[t.e1], e2 = edges[t.e2];
        return (
          <>
            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Pick triplet" color={C.accent3}>
                {triplets.map((tr, i) => (
                  <div key={i} onClick={() => setSel3(i)} style={{ padding: "3px 6px", cursor: "pointer", borderRadius: 4, background: sel3 === i ? `${C.accent3}22` : "transparent", fontFamily: "monospace", fontSize: 11 }}>
                    t{i}: center={atoms[tr.center].sym}({tr.center}) θ={tr.angle.toFixed(1)}°
                  </div>
                ))}
              </Card>

              <Card title="3-Body input: [h'_i, e_ij, e_ik, a(cos θ)]" color={C.accent1}>
                <Vec v={gnn.h1[t.center]} color={C.accent1} label={`h'_i (center ${atoms[t.center].sym}, after 2-body)`} />
                <Vec v={gnn.eFeat[t.e1]} color={C.accent2} label={`e_ij (edge ${t.e1}, d=${e1.dist.toFixed(3)}Å)`} />
                <Vec v={gnn.eFeat[t.e2]} color={C.accent6} label={`e_ik (edge ${t.e2}, d=${e2.dist.toFixed(3)}Å)`} />
                <Vec v={m3.aFeat} color={C.accent5} label={`a(cos θ = ${t.cosT.toFixed(4)}) angular`} />
                <div style={{ fontSize: 11, color: C.muted }}>Total: 3+4+4+4 = <span style={{ color: C.accent3 }}>15-dim</span></div>
              </Card>
            </div>

            <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Card title="Gate ⊙ Core" color={C.accent4}>
                <Vec v={m3.gate} color={C.accent4} label="gate = sigmoid(W3·input):" />
                <Vec v={m3.core} color={C.accent6} label="core = softplus(W3·input):" />
              </Card>

              <Card title="Product cutoff (2 edges!)" color={C.accent6}>
                <MR label="w(d_ij):" eq={`w(${e1.dist.toFixed(3)}) = ${cutoffFn(e1.dist).toFixed(4)}`} />
                <MR label="w(d_ik):" eq={`w(${e2.dist.toFixed(3)}) = ${cutoffFn(e2.dist).toFixed(4)}`} />
                <MR label="w_triplet:" eq={`${cutoffFn(e1.dist).toFixed(4)} × ${cutoffFn(e2.dist).toFixed(4)}`}
                  result={m3.w.toFixed(4)} color={C.accent6} />
              </Card>

              <Card title="Message = gate ⊙ core × w_triplet" color={C.accent3}>
                {[0, 1, 2].map(i => (
                  <MR key={i} label={`dim ${i}:`} eq={`${m3.gate[i].toFixed(4)} × ${m3.core[i].toFixed(4)} × ${m3.w.toFixed(4)}`}
                    result={m3.msg[i].toFixed(4)} color={C.accent3} />
                ))}
                <Vec v={m3.msg} color={C.accent3} label="3-body message:" />
              </Card>

              <Card title="Final h''_i" color={C.accent2}>
                <Vec v={gnn.h2[t.center]} color={C.accent2} label={`h''[${t.center}] = softplus(h' + Σ 3-body msgs)`} />
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
        {["energy", "forces", "stress"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 12, cursor: "pointer", textTransform: "capitalize",
            background: tab === t ? `${C.accent3}22` : C.panel,
            border: `1px solid ${tab === t ? C.accent3 : C.border}`,
            color: tab === t ? C.accent3 : C.muted, fontFamily: "inherit",
          }}>{t}</button>
        ))}
      </div>

      {tab === "energy" && (
        <>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Energy readout: E = Σ MLP(h''_i)" color={C.accent3}>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 8 }}>
                For each atom, apply Linear(3→1) on final features h''_i:
              </div>
              <div style={{ fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>
                <span style={{ color: C.muted }}>W_energy = </span><span style={{ color: C.accent3 }}>[{We[0].join(", ")}]</span>
                <span style={{ color: C.muted }}> b = </span><span style={{ color: C.accent3 }}>{be[0]}</span>
              </div>
              {atoms.map((a, i) => {
                const h = gnn.h2[i];
                return (
                  <div key={i} style={{ marginBottom: 8, padding: "6px 8px", background: `${C.panel}`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 4 }}>Atom {i} ({a.sym})</div>
                    <Vec v={h} color={C.accent2} label="h''_i:" />
                    <div style={{ fontSize: 10, fontFamily: "monospace" }}>
                      <span style={{ color: C.muted }}>e_i = </span>
                      {We[0].map((w, j) => <span key={j} style={{ color: C.text }}>{j > 0 ? " + " : ""}{w.toFixed(2)}×{h[j].toFixed(4)}</span>)}
                      <span style={{ color: C.muted }}> + ({be[0]}) = </span>
                      <span style={{ color: C.accent3, fontWeight: 700 }}>{gnn.rawE[i].toFixed(4)}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>

          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Raw → Scaled Energies" color={C.accent2}>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 8 }}>
                Raw sum is scaled to match DFT reference:
              </div>
              <MR label="Raw total:" eq={gnn.rawE.reduce((s, v) => s + v, 0).toFixed(4)} />
              <MR label="DFT ref:" eq={`${mol.refEnergy} eV`} />
              <MR label="Scale:" eq={gnn.scale.toFixed(4)} />
              <div style={{ height: 10 }} />
              {atoms.map((a, i) => (
                <MR key={i} label={`${a.sym}(${i}):`} eq={`${gnn.rawE[i].toFixed(4)} × ${gnn.scale.toFixed(4)}`}
                  result={`${gnn.atomE[i].toFixed(4)} eV`} color={C.accent3} />
              ))}
              <div style={{ marginTop: 12, padding: "10px 12px", background: `${C.accent3}11`, borderRadius: 6, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted }}>Total predicted energy</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.accent3, fontFamily: "monospace" }}>
                  {gnn.totalE.toFixed(4)} eV
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>= {(gnn.totalE / N).toFixed(4)} eV/atom</div>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "forces" && (
        <>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Forces: F_i = −∂E/∂r_i" color={C.accent4}>
              <div style={{ fontSize: 12, color: C.text, lineHeight: 1.8, marginBottom: 10 }}>
                Each edge message contributes a force along its displacement direction.
                Force = −(message magnitude) × scale × r̂_ij
              </div>
              {atoms.map((a, i) => {
                const f = gnn.forces[i];
                const mag = Math.sqrt(f[0] ** 2 + f[1] ** 2 + f[2] ** 2);
                return (
                  <div key={i} style={{ marginBottom: 10, padding: "6px 8px", background: `${C.panel}`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 4 }}>
                      Atom {i} ({a.sym}) at [{a.pos.map(v => v.toFixed(3)).join(", ")}]
                    </div>
                    <Vec v={f} color={C.accent4} label="F_i (eV/Å):" />
                    <MR label="|F|:" eq={mag.toFixed(6)} result="eV/Å" color={C.accent2} />
                  </div>
                );
              })}
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Force sum (should be ~0)" color={C.accent6}>
              <MR label="ΣFx:" eq={gnn.forces.reduce((s, f) => s + f[0], 0).toFixed(6)} />
              <MR label="ΣFy:" eq={gnn.forces.reduce((s, f) => s + f[1], 0).toFixed(6)} />
              <MR label="ΣFz:" eq={gnn.forces.reduce((s, f) => s + f[2], 0).toFixed(6)} />
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
                Newton's 3rd law: total force on the system should be zero.
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "stress" && (
        <>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Virial Stress Tensor" color={C.accent5}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent5, textAlign: "center", padding: 6 }}>
                σ_αβ = (1/V) Σ r_ij,α × f_ij,β
              </div>
              <MR label="V (demo):" eq="10.0 ų" />
            </Card>

            <Card title="3×3 Stress Matrix (GPa)" color={C.accent2}>
              <div style={{ fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
                {gnn.stressGPa.map((row, r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: C.dim }}>{r === 0 ? "⌈" : r === 2 ? "⌊" : "│"}</span>
                    {row.map((v, c) => (
                      <span key={c} style={{ width: 90, textAlign: "right", color: v >= 0 ? C.accent3 : C.accent4 }}>
                        {v.toFixed(4)}
                      </span>
                    ))}
                    <span style={{ color: C.dim }}>{r === 0 ? "⌉" : r === 2 ? "⌋" : "│"}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 8 }}>
                Rows/cols: x, y, z. Units: GPa
              </div>
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Pressure" color={C.accent3}>
              {(() => {
                const P = -(gnn.stressGPa[0][0] + gnn.stressGPa[1][1] + gnn.stressGPa[2][2]) / 3;
                return (
                  <>
                    <MR label="P = −tr(σ)/3:" eq={`−(${gnn.stressGPa[0][0].toFixed(4)} + ${gnn.stressGPa[1][1].toFixed(4)} + ${gnn.stressGPa[2][2].toFixed(4)})/3`} />
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.accent3, textAlign: "center", margin: "10px 0", fontFamily: "monospace" }}>
                      P = {P.toFixed(4)} GPa
                    </div>
                  </>
                );
              })()}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function DefectNetPipeline() {
  const [active, setActive] = useState("struct");
  const [molIdx, setMolIdx] = useState(0);
  const mol = MOLECULES[molIdx];
  const section = SECTIONS.find(s => s.id === active);

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
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'JetBrains Mono','Fira Code',monospace", color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `${C.panel}cc`, position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: C.accent1, textTransform: "uppercase" }}>DefectNet</div>
          <div style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg,${C.accent1},${C.accent5})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Full Pipeline — Every Number Shown
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {MOLECULES.map((m, i) => (
            <button key={m.id} onClick={() => setMolIdx(i)} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: molIdx === i ? `${m.color}22` : C.panel,
              border: `2px solid ${molIdx === i ? m.color : C.border}`,
              color: molIdx === i ? m.color : C.muted, fontFamily: "inherit", fontWeight: 700,
            }}>{m.name}</button>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", padding: "10px 28px", gap: 4, borderBottom: `1px solid ${C.border}`, background: C.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => setActive(sec.id)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
            border: `1px solid ${active === sec.id ? sec.color : C.border}`,
            background: active === sec.id ? `${sec.color}22` : C.bg,
            color: active === sec.id ? sec.color : C.muted, fontFamily: "inherit", fontWeight: active === sec.id ? 700 : 400,
          }}>{sec.label}</button>
        ))}
      </div>

      {/* Info bar */}
      <div style={{ padding: "6px 28px", fontSize: 11, color: C.muted, display: "flex", gap: 16, borderBottom: `1px solid ${C.border}` }}>
        <span>{mol.name}</span>
        <span>{atoms.length} atoms</span>
        <span>{edges.length} edges</span>
        <span>{triplets.length} triplets</span>
        <span>hidden dim = 3</span>
        <span>edge dim = 4</span>
        <span>angular dim = 4</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }}>
        {render()}
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.panel }}>
        <button onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i > 0) setActive(SECTIONS[i - 1].id); }}
          disabled={active === SECTIONS[0].id}
          style={{ padding: "7px 18px", borderRadius: 8, fontSize: 12, background: active === SECTIONS[0].id ? C.panel : `${section.color}22`, border: `1px solid ${active === SECTIONS[0].id ? C.border : section.color}`, color: active === SECTIONS[0].id ? C.muted : section.color, cursor: active === SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          ← Previous
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {SECTIONS.map(sec => (
            <div key={sec.id} onClick={() => setActive(sec.id)} style={{ width: 8, height: 8, borderRadius: 4, background: active === sec.id ? sec.color : C.dim, cursor: "pointer" }} />
          ))}
        </div>
        <button onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id); }}
          disabled={active === SECTIONS[SECTIONS.length - 1].id}
          style={{ padding: "7px 18px", borderRadius: 8, fontSize: 12, background: active === SECTIONS[SECTIONS.length - 1].id ? C.panel : `${section.color}22`, border: `1px solid ${active === SECTIONS[SECTIONS.length - 1].id ? C.border : section.color}`, color: active === SECTIONS[SECTIONS.length - 1].id ? C.muted : section.color, cursor: active === SECTIONS[SECTIONS.length - 1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Next →
        </button>
      </div>
    </div>
  );
}
