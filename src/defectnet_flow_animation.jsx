import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME (light palette) ─────────────────────────────────────────
const T = {
  bg: "#f8f9fc",
  card: "#ffffff",
  border: "#d0d8e8",
  accent: "#4a7fc1",
  accentLight: "#e0ecfa",
  highlight: "#f0a040",
  highlightLight: "#fff4e0",
  text: "#2c3e50",
  textMid: "#5a6d80",
  textLight: "#8899aa",
  green: "#3dae73",
  greenLight: "#e2f5eb",
  purple: "#8b6fc0",
  purpleLight: "#f0eaf8",
  red: "#e06060",
  redLight: "#fde8e8",
  node: "#6ea8e0",
  nodeLight: "#dbeaf8",
  edge: "#b0c4de",
  particle: "#f0a040",
};

// ─── PIPELINE STAGES ───────────────────────────────────────────────
const STAGES = [
  {
    id: "crystal",
    label: "Crystal Structure",
    sub: "CdTe supercell with Cd vacancy",
    color: T.accent,
    bgColor: T.accentLight,
    icon: "🔷",
  },
  {
    id: "graph",
    label: "Graph Construction",
    sub: "Atoms → nodes, bonds → edges (K=12 neighbors)",
    color: T.purple,
    bgColor: T.purpleLight,
    icon: "🕸️",
  },
  {
    id: "features",
    label: "Feature Encoding",
    sub: "Gaussian smearing + angular basis + charge/theory conditioning",
    color: T.green,
    bgColor: T.greenLight,
    icon: "📊",
  },
  {
    id: "interaction",
    label: "Interaction Blocks (×4)",
    sub: "2-body (pairwise) + 3-body (angular) convolutions",
    color: T.highlight,
    bgColor: T.highlightLight,
    icon: "⚡",
  },
  {
    id: "output",
    label: "Output",
    sub: "Energy E, Forces F, Stress σ",
    color: T.red,
    bgColor: T.redLight,
    icon: "🎯",
  },
];

// ─── CRYSTAL LATTICE DATA ──────────────────────────────────────────
const LATTICE_ATOMS = [
  { x: 40, y: 30, el: "Cd", color: "#6ea8e0" },
  { x: 100, y: 30, el: "Te", color: "#e8a060" },
  { x: 160, y: 30, el: "Cd", color: "#6ea8e0" },
  { x: 70, y: 70, el: "Te", color: "#e8a060" },
  { x: 130, y: 70, el: "Cd", color: "#6ea8e0" },
  { x: 40, y: 110, el: "Cd", color: "#6ea8e0" },
  { x: 100, y: 110, el: "V", color: "#cc4444" }, // vacancy
  { x: 160, y: 110, el: "Te", color: "#e8a060" },
];

const LATTICE_BONDS = [
  [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4],
  [3, 5], [3, 6], [4, 6], [4, 7], [5, 6], [6, 7],
];

// ─── GRAPH NODES / EDGES ────────────────────────────────────────────
const GRAPH_NODES = [
  { x: 40, y: 40, label: "Cd₁" },
  { x: 110, y: 25, label: "Te₁" },
  { x: 170, y: 50, label: "Cd₂" },
  { x: 60, y: 90, label: "Te₂" },
  { x: 140, y: 85, label: "Cd₃" },
  { x: 30, y: 130, label: "Cd₄" },
  { x: 170, y: 125, label: "Te₃" },
];

const GRAPH_EDGES = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4],
  [3, 5], [4, 6], [3, 4], [5, 3], [2, 6],
];

// ─── SMALL NEURAL NETWORK DRAWING ──────────────────────────────────
function NeuralNetMini({ cx, cy, w, h, activeLayer, t }) {
  const layers = [3, 5, 5, 3];
  const layerX = layers.map((_, i) => cx - w / 2 + (w / (layers.length - 1)) * i);
  const nodes = [];
  layers.forEach((n, li) => {
    const gap = h / (n + 1);
    for (let ni = 0; ni < n; ni++) {
      nodes.push({
        lx: layerX[li],
        ly: cy - h / 2 + gap * (ni + 1),
        li,
        ni,
      });
    }
  });

  // edges
  const edges = [];
  let prevStart = 0;
  let prevCount = layers[0];
  for (let li = 1; li < layers.length; li++) {
    const curStart = prevStart + prevCount;
    for (let pi = prevStart; pi < prevStart + prevCount; pi++) {
      for (let ci = curStart; ci < curStart + layers[li]; ci++) {
        const active = li - 1 === activeLayer;
        edges.push({ from: nodes[pi], to: nodes[ci], active });
      }
    }
    prevStart = curStart;
    prevCount = layers[li];
  }

  return (
    <g>
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.from.lx} y1={e.from.ly}
          x2={e.to.lx} y2={e.to.ly}
          stroke={e.active ? T.highlight : T.edge}
          strokeWidth={e.active ? 1.5 : 0.6}
          opacity={e.active ? 0.7 + 0.3 * Math.sin(t * 3 + i) : 0.25}
        />
      ))}
      {nodes.map((n, i) => {
        const isActive = n.li === activeLayer || n.li === activeLayer + 1;
        return (
          <circle
            key={i}
            cx={n.lx} cy={n.ly}
            r={isActive ? 5 : 4}
            fill={isActive ? T.highlight : T.nodeLight}
            stroke={isActive ? T.highlight : T.node}
            strokeWidth={1}
            opacity={isActive ? 0.8 + 0.2 * Math.sin(t * 4 + i * 0.5) : 0.5}
          />
        );
      })}
    </g>
  );
}

// ─── PARTICLE SYSTEM (data flowing through pipeline) ────────────────
function FlowParticles({ fromX, fromY, toX, toY, count, t, color }) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const phase = (t * 0.5 + i / count) % 1;
    const x = fromX + (toX - fromX) * phase;
    const y = fromY + (toY - fromY) * phase;
    const r = 3 + Math.sin(phase * Math.PI) * 2;
    particles.push(
      <circle
        key={i}
        cx={x} cy={y} r={r}
        fill={color || T.particle}
        opacity={0.3 + 0.5 * Math.sin(phase * Math.PI)}
      />
    );
  }
  return <g>{particles}</g>;
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function DefectNetFlowAnimation() {
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  // animation loop
  useEffect(() => {
    if (!playing) return;
    const animate = (time) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      setT((prev) => prev + dt);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  // auto-advance stages
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [playing]);

  const W = 960;
  const H = 620;
  const stageW = 170;
  const stageH = 80;
  const stageGap = 15;
  const totalW = STAGES.length * stageW + (STAGES.length - 1) * stageGap;
  const startX = (W - totalW) / 2;
  const stageY = 40;

  const stagePositions = STAGES.map((_, i) => ({
    x: startX + i * (stageW + stageGap),
    y: stageY,
    cx: startX + i * (stageW + stageGap) + stageW / 2,
    cy: stageY + stageH / 2,
  }));

  // detail panel area
  const detailY = stageY + stageH + 50;
  const detailH = H - detailY - 20;

  return (
    <div style={{
      background: T.bg,
      borderRadius: 16,
      padding: 20,
      maxWidth: W + 40,
      margin: "0 auto",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, margin: 0 }}>
          DefectNet: Information Flow
        </h2>
        <p style={{ color: T.textMid, fontSize: 13, margin: "4px 0 0" }}>
          Crystal Structure → Graph → Features → Message Passing → Predictions
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            background: playing ? T.redLight : T.greenLight,
            color: playing ? T.red : T.green,
            border: `1px solid ${playing ? T.red : T.green}`,
            borderRadius: 6, padding: "4px 14px", cursor: "pointer",
            fontSize: 13, fontWeight: 600,
          }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        {STAGES.map((s, i) => (
          <button
            key={i}
            onClick={() => { setActiveStage(i); setPlaying(false); }}
            style={{
              background: activeStage === i ? s.bgColor : "#fff",
              color: activeStage === i ? s.color : T.textMid,
              border: `1px solid ${activeStage === i ? s.color : T.border}`,
              borderRadius: 6, padding: "4px 10px", cursor: "pointer",
              fontSize: 12, fontWeight: activeStage === i ? 700 : 400,
            }}
          >
            {s.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Main SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ background: "#fff", borderRadius: 12, border: `1px solid ${T.border}` }}
      >
        {/* ── Pipeline boxes ── */}
        {STAGES.map((s, i) => {
          const pos = stagePositions[i];
          const isActive = i === activeStage;
          const pulse = isActive ? 1 + 0.02 * Math.sin(t * 4) : 1;
          return (
            <g key={i} onClick={() => { setActiveStage(i); setPlaying(false); }} style={{ cursor: "pointer" }}>
              <rect
                x={pos.x} y={pos.y}
                width={stageW} height={stageH}
                rx={10}
                fill={isActive ? s.bgColor : "#fafbfd"}
                stroke={isActive ? s.color : T.border}
                strokeWidth={isActive ? 2.5 : 1}
                transform={`scale(${pulse})`}
                style={{ transformOrigin: `${pos.cx}px ${pos.cy}px` }}
              />
              <text
                x={pos.cx} y={pos.y + 30}
                textAnchor="middle"
                fill={isActive ? s.color : T.text}
                fontSize={13} fontWeight={700}
              >
                {s.label}
              </text>
              <text
                x={pos.cx} y={pos.y + 48}
                textAnchor="middle"
                fill={T.textLight}
                fontSize={9.5}
              >
                {s.sub.length > 30 ? s.sub.slice(0, 30) + "…" : s.sub}
              </text>
              {/* stage number circle */}
              <circle cx={pos.x + 14} cy={pos.y + 14} r={10}
                fill={isActive ? s.color : T.border} />
              <text x={pos.x + 14} y={pos.y + 18}
                textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* ── Arrows between stages ── */}
        {STAGES.slice(0, -1).map((_, i) => {
          const from = stagePositions[i];
          const to = stagePositions[i + 1];
          const ax = from.x + stageW + 2;
          const bx = to.x - 2;
          const ay = stageY + stageH / 2;
          const isFlowing = i === activeStage || i === activeStage - 1;
          return (
            <g key={`arrow-${i}`}>
              <line x1={ax} y1={ay} x2={bx} y2={ay}
                stroke={isFlowing ? STAGES[i + 1].color : T.border}
                strokeWidth={isFlowing ? 2 : 1}
                markerEnd="url(#arrowhead)"
              />
              {isFlowing && (
                <FlowParticles
                  fromX={ax} fromY={ay} toX={bx} toY={ay}
                  count={3} t={t} color={STAGES[i + 1].color}
                />
              )}
            </g>
          );
        })}

        {/* arrowhead marker */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={T.textMid} />
          </marker>
        </defs>

        {/* ── Active stage indicator line ── */}
        <line
          x1={stagePositions[activeStage].cx}
          y1={stageY + stageH + 5}
          x2={stagePositions[activeStage].cx}
          y2={detailY - 5}
          stroke={STAGES[activeStage].color}
          strokeWidth={2}
          strokeDasharray="4,3"
          opacity={0.5}
        />

        {/* ── DETAIL PANELS ── */}
        <rect x={20} y={detailY} width={W - 40} height={detailH}
          rx={12} fill={STAGES[activeStage].bgColor} stroke={STAGES[activeStage].color}
          strokeWidth={1.5} opacity={0.3} />

        {/* Stage 0: Crystal */}
        {activeStage === 0 && (
          <g>
            <text x={W / 2} y={detailY + 25} textAnchor="middle"
              fill={T.accent} fontSize={15} fontWeight={700}>
              Crystal Structure Input
            </text>
            {/* Lattice */}
            <g transform={`translate(${W / 2 - 100}, ${detailY + 40})`}>
              {LATTICE_BONDS.map(([a, b], i) => (
                <line key={i}
                  x1={LATTICE_ATOMS[a].x} y1={LATTICE_ATOMS[a].y}
                  x2={LATTICE_ATOMS[b].x} y2={LATTICE_ATOMS[b].y}
                  stroke={T.edge} strokeWidth={1.5} />
              ))}
              {LATTICE_ATOMS.map((a, i) => {
                const pulse = a.el === "V" ? 1 + 0.15 * Math.sin(t * 3) : 1;
                return (
                  <g key={i}>
                    <circle cx={a.x} cy={a.y} r={a.el === "V" ? 14 * pulse : 12}
                      fill={a.color} opacity={a.el === "V" ? 0.5 + 0.3 * Math.sin(t * 3) : 0.85}
                      stroke={a.el === "V" ? T.red : "#fff"} strokeWidth={a.el === "V" ? 2 : 1} />
                    <text x={a.x} y={a.y + 4} textAnchor="middle"
                      fill="#fff" fontSize={a.el === "V" ? 10 : 9} fontWeight={700}>
                      {a.el === "V" ? "V_Cd" : a.el}
                    </text>
                  </g>
                );
              })}
            </g>
            {/* Info text */}
            <g transform={`translate(${W / 2 + 140}, ${detailY + 60})`}>
              {[
                "• CdTe zinc-blende supercell",
                "• Cd vacancy (V_Cd) highlighted in red",
                "• Positions: fractional → Cartesian",
                "• Charge state q and DFT level",
                "  encoded as global conditioning",
                "• PBC: periodic boundary conditions",
              ].map((line, i) => (
                <text key={i} x={0} y={i * 22} fill={T.text} fontSize={13}>
                  {line}
                </text>
              ))}
            </g>
          </g>
        )}

        {/* Stage 1: Graph Construction */}
        {activeStage === 1 && (
          <g>
            <text x={W / 2} y={detailY + 25} textAnchor="middle"
              fill={T.purple} fontSize={15} fontWeight={700}>
              Graph Construction: Atoms → Nodes, Bonds → Directed Edges
            </text>
            <g transform={`translate(${W / 2 - 100}, ${detailY + 35})`}>
              {/* Edges with animation */}
              {GRAPH_EDGES.map(([a, b], i) => {
                const na = GRAPH_NODES[a];
                const nb = GRAPH_NODES[b];
                const progress = ((t * 0.8 + i * 0.3) % 2) / 2;
                return (
                  <g key={i}>
                    <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                      stroke={T.purple} strokeWidth={1.2} opacity={0.4} />
                    {/* directional arrow particle */}
                    <circle
                      cx={na.x + (nb.x - na.x) * progress}
                      cy={na.y + (nb.y - na.y) * progress}
                      r={3} fill={T.purple}
                      opacity={0.4 + 0.6 * Math.sin(progress * Math.PI)}
                    />
                  </g>
                );
              })}
              {/* Nodes */}
              {GRAPH_NODES.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={16}
                    fill={T.purpleLight} stroke={T.purple} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle"
                    fill={T.purple} fontSize={9} fontWeight={600}>
                    {n.label}
                  </text>
                </g>
              ))}
            </g>
            <g transform={`translate(${W / 2 + 140}, ${detailY + 55})`}>
              {[
                "• Each atom becomes a graph node",
                "• Bonds within cutoff r_c = 5 Å → edges",
                "• Directed edges: r_ij = r_j + o_ij − r_i",
                "• Keep K = 12 nearest neighbors per atom",
                "• 3-body: store angle θ_jik for triplets",
                "• Periodic boundary via Cartesian offsets",
              ].map((line, i) => (
                <text key={i} x={0} y={i * 22} fill={T.text} fontSize={13}>
                  {line}
                </text>
              ))}
            </g>
          </g>
        )}

        {/* Stage 2: Feature Encoding */}
        {activeStage === 2 && (
          <g>
            <text x={W / 2} y={detailY + 25} textAnchor="middle"
              fill={T.green} fontSize={15} fontWeight={700}>
              Feature Encoding
            </text>
            {/* Gaussian smearing visualization */}
            <g transform={`translate(${60}, ${detailY + 45})`}>
              <text x={110} y={0} textAnchor="middle" fill={T.green} fontSize={12} fontWeight={600}>
                Gaussian Smearing (80 centers)
              </text>
              {/* Draw Gaussian curves */}
              {[0, 1, 2, 3, 4].map((mu, i) => {
                const pts = [];
                for (let x = 0; x < 220; x += 2) {
                  const d = (x / 220) * 5;
                  const val = Math.exp(-((d - mu) ** 2) / 0.64);
                  pts.push(`${x},${100 - val * 70}`);
                }
                const shift = (t * 30 + i * 10) % 220;
                return (
                  <g key={i}>
                    <polyline points={pts.join(" ")}
                      fill="none" stroke={T.green} strokeWidth={1.5}
                      opacity={0.3 + 0.15 * i} />
                    <circle cx={shift} cy={100 - Math.exp(-((shift / 220 * 5 - mu) ** 2) / 0.64) * 70}
                      r={3} fill={T.green} opacity={0.8} />
                  </g>
                );
              })}
              <line x1={0} y1={100} x2={220} y2={100} stroke={T.textLight} strokeWidth={0.5} />
              <text x={0} y={115} fill={T.textLight} fontSize={10}>0 Å</text>
              <text x={210} y={115} fill={T.textLight} fontSize={10}>5 Å</text>
            </g>

            {/* Angular basis */}
            <g transform={`translate(${320}, ${detailY + 45})`}>
              <text x={100} y={0} textAnchor="middle" fill={T.green} fontSize={12} fontWeight={600}>
                Angular Basis (16 centers)
              </text>
              {[...Array(4)].map((_, i) => {
                const ctr = -1 + i * 0.67;
                const pts = [];
                for (let x = 0; x < 200; x += 2) {
                  const cosT = -1 + (x / 200) * 2;
                  const val = Math.exp(-((cosT - ctr) ** 2) / 0.25);
                  pts.push(`${x},${100 - val * 70}`);
                }
                return (
                  <polyline key={i} points={pts.join(" ")}
                    fill="none" stroke={T.green} strokeWidth={1.5}
                    opacity={0.3 + 0.15 * i} />
                );
              })}
              <line x1={0} y1={100} x2={200} y2={100} stroke={T.textLight} strokeWidth={0.5} />
              <text x={0} y={115} fill={T.textLight} fontSize={10}>cos θ = −1</text>
              <text x={160} y={115} fill={T.textLight} fontSize={10}>cos θ = 1</text>
            </g>

            {/* Feature list */}
            <g transform={`translate(${580}, ${detailY + 50})`}>
              {[
                ["Atom embed:", "Z → h_i ∈ ℝ^F (learnable)"],
                ["Global cond:", "[charge, theory] → MLP → ℝ^F"],
                ["Gaussian:", "d → exp(−(d−μ_k)²/σ²), k=1..80"],
                ["Cosine cutoff:", "w(d) = ½[cos(dπ/r_c)+1]"],
                ["Angular:", "cosθ → exp(−(cosθ−c_k)²/σ²)"],
                ["Envelope:", "u(d) = smooth → 0 at r_c"],
              ].map(([label, desc], i) => {
                const isHighlighted = Math.floor(t % 6) === i;
                return (
                  <g key={i}>
                    <rect x={-5} y={i * 28 - 4} width={350} height={24} rx={4}
                      fill={isHighlighted ? T.greenLight : "transparent"} />
                    <text x={0} y={i * 28 + 12} fill={T.green} fontSize={12} fontWeight={700}>
                      {label}
                    </text>
                    <text x={95} y={i * 28 + 12} fill={T.text} fontSize={11.5}>
                      {desc}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        )}

        {/* Stage 3: Interaction Blocks */}
        {activeStage === 3 && (
          <g>
            <text x={W / 2} y={detailY + 25} textAnchor="middle"
              fill={T.highlight} fontSize={15} fontWeight={700}>
              Message Passing: 4 Interaction Blocks
            </text>

            {/* Neural network mini visualization */}
            <NeuralNetMini
              cx={200} cy={detailY + 130} w={280} h={160}
              activeLayer={Math.floor(t * 0.8) % 3} t={t}
            />

            {/* Block labels */}
            <g transform={`translate(${380}, ${detailY + 50})`}>
              <text x={0} y={0} fill={T.highlight} fontSize={13} fontWeight={700}>
                2-body convolution (CGCNN-style):
              </text>
              <text x={0} y={22} fill={T.text} fontSize={12}>
                h'_i = sp( h_i + BN( Σ_j σ(W[h_i, h_j, e_ij]) ⊙ sp(·) ) )
              </text>

              <text x={0} y={55} fill={T.highlight} fontSize={13} fontWeight={700}>
                3-body convolution (angular):
              </text>
              <text x={0} y={77} fill={T.text} fontSize={12}>
                h''_i = sp( h'_i + BN( Σ_j,k g(h'_i, e_ij, e_ik, a_jik) ) )
              </text>

              <line x1={0} y1={95} x2={500} y2={95} stroke={T.border} strokeWidth={0.5} />

              {[
                "• Gating: σ(·) ⊙ softplus(·) controls info flow",
                "• Messages weighted by cosine cutoff w(d)",
                "• Residual connection + BatchNorm for stability",
                "• 4 blocks → progressively richer atom features",
              ].map((line, i) => (
                <text key={i} x={0} y={115 + i * 20} fill={T.text} fontSize={12}>
                  {line}
                </text>
              ))}
            </g>

            {/* Block iteration indicator */}
            <g transform={`translate(${60}, ${detailY + 220})`}>
              {[1, 2, 3, 4].map((block, i) => {
                const isActive = Math.floor(t % 4) === i;
                return (
                  <g key={i}>
                    <rect x={i * 70} y={0} width={55} height={28} rx={6}
                      fill={isActive ? T.highlightLight : "#fff"}
                      stroke={isActive ? T.highlight : T.border}
                      strokeWidth={isActive ? 2 : 1} />
                    <text x={i * 70 + 27.5} y={18} textAnchor="middle"
                      fill={isActive ? T.highlight : T.textMid}
                      fontSize={12} fontWeight={isActive ? 700 : 400}>
                      Block {block}
                    </text>
                    {i < 3 && (
                      <text x={i * 70 + 60} y={18} fill={T.textLight} fontSize={14}>→</text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        )}

        {/* Stage 4: Output */}
        {activeStage === 4 && (
          <g>
            <text x={W / 2} y={detailY + 25} textAnchor="middle"
              fill={T.red} fontSize={15} fontWeight={700}>
              Output: Energy, Forces, Stress
            </text>

            {/* Three output cards */}
            {[
              {
                title: "Energy E",
                eq: "ε_i = MLP(h_i) → E = Σ_i ε_i",
                desc: "Per-atom energies summed\nto total system energy",
                x: 60, color: "#e06060",
              },
              {
                title: "Forces F",
                eq: "F_i = −∂E / ∂r_i  (autograd)",
                desc: "Analytical gradients via\nautomatic differentiation",
                x: 350, color: "#d08040",
              },
              {
                title: "Stress σ",
                eq: "σ = (1/V) ∂E/∂ε |_{ε=0}",
                desc: "Strain derivative for\nlattice optimization",
                x: 640, color: "#c06080",
              },
            ].map((out, i) => {
              const isHighlighted = Math.floor(t % 3) === i;
              const cardW = 240;
              const cardH = 150;
              const cy = detailY + 55;
              return (
                <g key={i}>
                  <rect x={out.x} y={cy} width={cardW} height={cardH} rx={10}
                    fill={isHighlighted ? T.redLight : "#fff"}
                    stroke={out.color} strokeWidth={isHighlighted ? 2.5 : 1.5} />
                  <text x={out.x + cardW / 2} y={cy + 28} textAnchor="middle"
                    fill={out.color} fontSize={16} fontWeight={700}>
                    {out.title}
                  </text>
                  <rect x={out.x + 15} y={cy + 40} width={cardW - 30} height={30} rx={5}
                    fill={T.bg} />
                  <text x={out.x + cardW / 2} y={cy + 60} textAnchor="middle"
                    fill={T.text} fontSize={12} fontWeight={600}>
                    {out.eq}
                  </text>
                  {out.desc.split("\n").map((line, j) => (
                    <text key={j} x={out.x + cardW / 2} y={cy + 90 + j * 18}
                      textAnchor="middle" fill={T.textMid} fontSize={12}>
                      {line}
                    </text>
                  ))}
                  {/* Pulsing indicator */}
                  {isHighlighted && (
                    <circle cx={out.x + cardW / 2} cy={cy + 140}
                      r={4 + Math.sin(t * 5) * 2}
                      fill={out.color} opacity={0.6} />
                  )}
                </g>
              );
            })}

            {/* Arrow from Energy to Forces to Stress */}
            <g>
              <text x={310} y={detailY + 240} fill={T.textMid} fontSize={20}>→</text>
              <text x={600} y={detailY + 240} fill={T.textMid} fontSize={20}>→</text>
              <text x={190} y={detailY + 250} fill={T.textLight} fontSize={10}>differentiate</text>
              <text x={490} y={detailY + 250} fill={T.textLight} fontSize={10}>strain derivative</text>
            </g>
          </g>
        )}

        {/* Footer info */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fill={T.textLight} fontSize={10}>
          DefectNet: 257,921 params | F=64, r_c=5 Å, 80 Gaussians, 16 angular bases, 4 interaction blocks
        </text>
      </svg>
    </div>
  );
}
