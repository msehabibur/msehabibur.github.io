import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DFT PARAMETERS MOVIE — VASP computational parameters walkthrough
// ═══════════════════════════════════════════════════════════════════════════

const P = {
  bg:      "#0c0f1a",
  panel:   "#141825",
  surface: "#1a1f30",
  border:  "#2a3050",
  ink:     "#e8ecf4",
  muted:   "#7b8499",
  dim:     "#3a4060",
  blue:    "#38bdf8",
  purple:  "#818cf8",
  green:   "#34d399",
  amber:   "#f59e0b",
  pink:    "#f472b6",
  teal:    "#2dd4bf",
  red:     "#f87171",
  ok:      "#4ade80",
  warn:    "#f87171",
};

const SCENES = [
  { id: "title",       label: "DFT Parameters",       duration: 4500  },
  { id: "bz",          label: "Brillouin Zone",        duration: 9000  },
  { id: "kpoints",     label: "KPOINTS Mesh",          duration: 9000  },
  { id: "encut",       label: "ENCUT",                 duration: 9000  },
  { id: "ismear",      label: "ISMEAR & SIGMA",        duration: 8500  },
  { id: "algo",        label: "ALGO — SCF",            duration: 8000  },
  { id: "ediff",       label: "EDIFF & EDIFFG",        duration: 7500  },
  { id: "prec",        label: "PREC & NGF",            duration: 7000  },
  { id: "ibrion",      label: "IBRION & NSW",          duration: 8500  },
  { id: "lreal",       label: "LREAL",                 duration: 7000  },
  { id: "output",      label: "Output Flags",          duration: 7000  },
  { id: "summary",     label: "INCAR Recipe",          duration: 8000  },
];

const ease    = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const lerp    = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function DFTParamsMovieModule() {
  const [sceneIdx, setSceneIdx]     = useState(0);
  const [progress, setProgress]     = useState(0);
  const [playing, setPlaying]       = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const scene    = SCENES[sceneIdx];

  const tick = useCallback((ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const dur = SCENES[sceneIdx].duration;
    const p = Math.min(elapsed / dur, 1);
    setProgress(p);
    if (p >= 1) {
      if (sceneIdx < SCENES.length - 1) { setSceneIdx(i => i + 1); startRef.current = null; }
      else { setPlaying(false); return; }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [sceneIdx]);

  useEffect(() => {
    if (playing) { startRef.current = null; rafRef.current = requestAnimationFrame(tick); }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, sceneIdx, tick]);

  useEffect(() => {
    if (manualMode && !playing) {
      startRef.current = null; setProgress(0);
      const dur = SCENES[sceneIdx].duration; let id;
      const run = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const p = Math.min((ts - startRef.current) / dur, 1);
        setProgress(p); if (p < 1) id = requestAnimationFrame(run);
      };
      id = requestAnimationFrame(run);
      return () => cancelAnimationFrame(id);
    }
  }, [sceneIdx, manualMode, playing]);

  const goScene     = (i) => { setPlaying(false); setManualMode(true); setSceneIdx(i); setProgress(0); startRef.current = null; };
  const playAll     = () => { setManualMode(false); setSceneIdx(0); setProgress(0); startRef.current = null; setPlaying(true); };
  const togglePause = () => {
    if (playing) { setPlaying(false); setManualMode(true); }
    else { setManualMode(false); startRef.current = null; setPlaying(true); }
  };
  const nextScene = () => { if (sceneIdx < SCENES.length - 1) goScene(sceneIdx + 1); };
  const prevScene = () => { if (sceneIdx > 0) goScene(sceneIdx - 1); };

  const t = progress;

  const [visibleScene, setVisibleScene] = useState(sceneIdx);
  const [fadeOpacity, setFadeOpacity]   = useState(1);
  useEffect(() => {
    if (sceneIdx !== visibleScene) {
      setFadeOpacity(0);
      const timer = setTimeout(() => { setVisibleScene(sceneIdx); setFadeOpacity(1); }, 250);
      return () => clearTimeout(timer);
    }
  }, [sceneIdx, visibleScene]);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE RENDERERS
  // ═══════════════════════════════════════════════════════════════════════
  const renderScene = () => {
    const W = 760, H = 420;
    const LX = 10, LW = 310, RX = 330, RW = 420;

    switch (scene.id) {

    // ── 1. TITLE ─────────────────────────────────────────────────────────
    case "title": {
      const tOp  = ease(clamp01(t * 3));
      const sOp  = ease(clamp01((t - 0.25) * 3));
      const aOp  = ease(clamp01((t - 0.50) * 3));
      const eqOp = ease(clamp01((t - 0.65) * 4));

      const tags = ["ENCUT", "KPOINTS", "ISMEAR", "SIGMA", "ALGO", "EDIFF", "EDIFFG", "PREC", "IBRION", "NSW", "LREAL", "LORBIT", "LWAVE", "LCHARG"];
      const tagPositions = tags.map((tag, i) => {
        const angle = (i / tags.length) * Math.PI * 2 + t * Math.PI * 0.8;
        const rx = 160 + (i % 3) * 30;
        const ry = 80 + (i % 2) * 25;
        return {
          tag,
          x: W / 2 + rx * Math.cos(angle + i * 0.45),
          y: 210 + ry * Math.sin(angle + i * 0.45),
          col: [P.blue, P.green, P.purple, P.amber, P.pink, P.teal, P.red][i % 7],
        };
      });

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 22} x2={W} y2={i * 22} stroke={P.dim} strokeWidth="0.3" opacity={0.1} />
          ))}

          {tagPositions.map((tp, i) => {
            const op = ease(clamp01((t - 0.15 - i * 0.03) * 3));
            return (
              <g key={i} opacity={op * 0.6}>
                <rect x={tp.x - 24} y={tp.y - 8} width={48} height={16} rx="4"
                  fill={tp.col + "18"} stroke={tp.col + "40"} strokeWidth="1" />
                <text x={tp.x} y={tp.y + 4} textAnchor="middle" fill={tp.col} fontSize="7"
                  fontWeight="700" fontFamily="'Fira Code','Consolas',monospace">{tp.tag}</text>
              </g>
            );
          })}

          <text x={W / 2} y={80} textAnchor="middle" fill={P.ink} fontSize="30" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>DFT Parameters &amp; Settings</text>
          <rect x={W / 2 - ease(clamp01((t - 0.1) * 3)) * 180} y={90}
            width={ease(clamp01((t - 0.1) * 3)) * 360} height={3} rx="1.5" fill={P.blue} opacity={tOp * 0.85} />

          <text x={W / 2} y={118} textAnchor="middle" fill={P.muted} fontSize="14"
            fontFamily="'Inter',sans-serif" opacity={sOp}>
            VASP INCAR Tags — From Basis to Output
          </text>
          <text x={W / 2} y={140} textAnchor="middle" fill={P.purple} fontSize="11"
            fontFamily="'Inter',sans-serif" opacity={sOp * 0.85}>
            ENCUT · KPOINTS · ISMEAR · ALGO · EDIFF · IBRION · PREC · LORBIT
          </text>

          <rect x={W / 2 - 200} y={280} width={400} height={62} rx="10"
            fill={P.surface} stroke={P.border} strokeWidth="1.5" opacity={eqOp} />
          <rect x={W / 2 - 200} y={280} width={400} height={3} rx="1.5" fill={P.green} opacity={eqOp} />
          <text x={W / 2} y={300} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={eqOp}>Key convergence parameters control accuracy vs cost</text>
          <text x={W / 2} y={320} textAnchor="middle" fill={P.green} fontSize="14" fontWeight="700"
            fontFamily="'Fira Code','Consolas',monospace" opacity={eqOp}>ENCUT + KPOINTS → converge first!</text>
          <text x={W / 2} y={336} textAnchor="middle" fill={P.muted} fontSize="9"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.8}>then ISMEAR, ALGO, EDIFF, IBRION...</text>

          <text x={W / 2} y={376} textAnchor="middle" fill={P.muted} fontSize="11"
            fontFamily="'Inter',sans-serif" opacity={aOp}>Habibur Rahman · Purdue University</text>
          <text x={W / 2} y={396} textAnchor="middle" fill={P.dim} fontSize="10"
            fontFamily="'Inter',sans-serif" opacity={aOp}>rahma103@purdue.edu</text>
        </svg>
      );
    }

    // ── 2. BRILLOUIN ZONE ────────────────────────────────────────────────
    case "bz": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Brillouin Zone (BZ)",             color: P.blue,   delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "Real lattice vectors: a₁, a₂, a₃", color: P.amber, delay: 0.10 },
        { text: "",                                color: P.muted,  delay: 0.13 },
        { text: "Reciprocal lattice vectors:",     color: P.blue,   delay: 0.16 },
        { text: "b₁ = 2π(a₂×a₃)/(a₁·a₂×a₃)",     color: P.ink,    delay: 0.20 },
        { text: "b₂ = 2π(a₃×a₁)/(a₁·a₂×a₃)",     color: P.ink,    delay: 0.24 },
        { text: "b₃ = 2π(a₁×a₂)/(a₁·a₂×a₃)",     color: P.ink,    delay: 0.28 },
        { text: "",                                color: P.muted,  delay: 0.31 },
        { text: "BZ = Wigner-Seitz cell in",       color: P.green,  delay: 0.34 },
        { text: "reciprocal space",                color: P.green,  delay: 0.37 },
        { text: "",                                color: P.muted,  delay: 0.40 },
        { text: "High-symmetry points:",           color: P.purple, delay: 0.43 },
        { text: "Γ = (0,0,0) — zone center",       color: P.muted,  delay: 0.47 },
        { text: "X, M, K, L — zone boundary",      color: P.muted,  delay: 0.51 },
        { text: "",                                color: P.muted,  delay: 0.54 },
        { text: "Band structure calculated",       color: P.teal,   delay: 0.57 },
        { text: "along high-symmetry paths:",      color: P.teal,   delay: 0.60 },
        { text: "Γ → X → M → Γ → K",               color: P.ink,    delay: 0.64 },
        { text: "",                                color: P.muted,  delay: 0.67 },
        { text: "aᵢ · bⱼ = 2πδᵢⱼ",                 color: P.pink,   delay: 0.70 },
        { text: "(orthogonality condition)",        color: P.muted,  delay: 0.74 },
      ];

      const bzCx = RX + RW / 2, bzCy = 175, bzR = 95;
      const hexPts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 30) * Math.PI / 180;
        return { x: bzCx + bzR * Math.cos(a), y: bzCy + bzR * Math.sin(a) };
      });
      const hexStr = hexPts.map(p => `${p.x},${p.y}`).join(' ');

      const hsPoints = [
        { label: "\u0393", x: bzCx, y: bzCy, col: P.amber },
        { label: "X", x: (hexPts[0].x + hexPts[1].x) / 2, y: (hexPts[0].y + hexPts[1].y) / 2, col: P.green },
        { label: "M", x: hexPts[0].x, y: hexPts[0].y, col: P.purple },
        { label: "K", x: hexPts[1].x, y: hexPts[1].y, col: P.pink },
        { label: "L", x: (hexPts[2].x + hexPts[3].x) / 2, y: (hexPts[2].y + hexPts[3].y) / 2, col: P.teal },
      ];

      // Animated path along high-symmetry route
      const pathProgress = clamp01((t - 0.50) * 2.5);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Brillouin Zone &amp; Reciprocal Space</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={bzCx} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            Hexagonal Brillouin Zone
          </text>

          {/* Real→reciprocal transform arrows */}
          <g opacity={ease(clamp01((t - 0.12) * 5))}>
            <rect x={RX + 20} y={62} width={80} height={30} rx="5"
              fill={P.amber + "18"} stroke={P.amber + "50"} strokeWidth="1" />
            <text x={RX + 60} y={81} textAnchor="middle" fill={P.amber} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Real: a₁,a₂,a₃</text>
            <line x1={RX + 105} y1={77} x2={RX + 155} y2={77} stroke={P.green} strokeWidth="2" />
            <polygon points={`${RX + 155},${73} ${RX + 155},${81} ${RX + 163},${77}`} fill={P.green} />
            <text x={RX + 130} y={71} textAnchor="middle" fill={P.green} fontSize="7"
              fontFamily="'Inter',sans-serif">FT</text>
            <rect x={RX + 168} y={62} width={100} height={30} rx="5"
              fill={P.blue + "18"} stroke={P.blue + "50"} strokeWidth="1" />
            <text x={RX + 218} y={81} textAnchor="middle" fill={P.blue} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Recip: b₁,b₂,b₃</text>
          </g>

          {/* Hexagonal BZ */}
          <g opacity={ease(clamp01((t - 0.18) * 5))}>
            <polygon points={hexStr} fill={P.blue + "0c"} stroke={P.blue + "60"} strokeWidth="2" />
            {/* Inner grid lines */}
            {hexPts.map((p, i) => (
              <line key={i} x1={bzCx} y1={bzCy} x2={p.x} y2={p.y}
                stroke={P.dim} strokeWidth="0.6" opacity={0.4} />
            ))}
          </g>

          {/* Reciprocal lattice vectors b1, b2 */}
          <g opacity={ease(clamp01((t - 0.25) * 5))}>
            <line x1={bzCx} y1={bzCy} x2={bzCx + 70} y2={bzCy - 40} stroke={P.green} strokeWidth="2" />
            <polygon points={`${bzCx + 67},${bzCy - 44} ${bzCx + 73},${bzCy - 36} ${bzCx + 76},${bzCy - 46}`} fill={P.green} />
            <text x={bzCx + 80} y={bzCy - 42} fill={P.green} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">b₁</text>

            <line x1={bzCx} y1={bzCy} x2={bzCx - 70} y2={bzCy - 40} stroke={P.teal} strokeWidth="2" />
            <polygon points={`${bzCx - 67},${bzCy - 44} ${bzCx - 73},${bzCy - 36} ${bzCx - 76},${bzCy - 46}`} fill={P.teal} />
            <text x={bzCx - 88} y={bzCy - 42} fill={P.teal} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">b₂</text>
          </g>

          {/* High-symmetry points */}
          {hsPoints.map((pt, i) => {
            const op = ease(clamp01((t - 0.32 - i * 0.05) * 5));
            return (
              <g key={i} opacity={op}>
                <circle cx={pt.x} cy={pt.y} r={8} fill={pt.col + "30"} stroke={pt.col} strokeWidth="2" />
                <text x={pt.x} y={pt.y + 4} textAnchor="middle" fill={pt.col} fontSize="10" fontWeight="800"
                  fontFamily="'Inter',sans-serif">{pt.label}</text>
                <text x={pt.x + 12} y={pt.y - 8} fill={pt.col} fontSize="7" fontWeight="600"
                  fontFamily="'Inter',sans-serif">{pt.label}</text>
              </g>
            );
          })}

          {/* Animated path Gamma->X->M */}
          {pathProgress > 0 && (() => {
            const segments = [
              { from: hsPoints[0], to: hsPoints[1] },
              { from: hsPoints[1], to: hsPoints[2] },
              { from: hsPoints[2], to: hsPoints[0] },
            ];
            const segFrac = 1 / segments.length;
            return segments.map((seg, i) => {
              const segStart = i * segFrac;
              const segP = clamp01((pathProgress - segStart) / segFrac);
              if (segP <= 0) return null;
              const ex = seg.from.x + (seg.to.x - seg.from.x) * segP;
              const ey = seg.from.y + (seg.to.y - seg.from.y) * segP;
              return (
                <g key={i}>
                  <line x1={seg.from.x} y1={seg.from.y} x2={ex} y2={ey}
                    stroke={P.pink} strokeWidth="2.5" opacity={0.8} />
                  {segP > 0 && segP < 1 && (
                    <circle cx={ex} cy={ey} r={5} fill={P.pink} opacity={0.9} />
                  )}
                </g>
              );
            });
          })()}

          {/* Orthogonality condition */}
          <g opacity={ease(clamp01((t - 0.75) * 4))}>
            <rect x={RX + 30} y={300} width={RW - 60} height={50} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={bzCx} y={318} textAnchor="middle" fill={P.pink} fontSize="11" fontWeight="700"
              fontFamily="'Fira Code','Consolas',monospace">a_i · b_j = 2πδ_ij</text>
            <text x={bzCx} y={338} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">Real &amp; reciprocal lattices are dual</text>
          </g>

          {/* Wigner-Seitz label */}
          <g opacity={ease(clamp01((t - 0.82) * 4))}>
            <rect x={RX + 30} y={360} width={RW - 60} height={42} rx="6"
              fill={P.blue + "10"} stroke={P.blue + "40"} strokeWidth="1" />
            <text x={bzCx} y={378} textAnchor="middle" fill={P.blue} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">1st BZ = Wigner-Seitz cell in k-space</text>
            <text x={bzCx} y={394} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">Contains all unique k-points for Bloch states</text>
          </g>
        </svg>
      );
    }

    // ── 3. KPOINTS MESH ──────────────────────────────────────────────────
    case "kpoints": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "KPOINTS — k-point Sampling",      color: P.green,  delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "Monkhorst-Pack grid:",            color: P.blue,   delay: 0.10 },
        { text: "k = (n₁/N₁)b₁ + (n₂/N₂)b₂",     color: P.ink,    delay: 0.14 },
        { text: "    + (n₃/N₃)b₃",                 color: P.ink,    delay: 0.18 },
        { text: "",                                color: P.muted,  delay: 0.21 },
        { text: "n_i = 0,1,...,N_i-1",             color: P.muted,  delay: 0.24 },
        { text: "total k-pts = N₁×N₂×N₃",          color: P.amber,  delay: 0.28 },
        { text: "",                                color: P.muted,  delay: 0.31 },
        { text: "Gamma-centered:",                 color: P.purple, delay: 0.34 },
        { text: "includes Γ point explicitly",     color: P.muted,  delay: 0.38 },
        { text: "good for hexagonal systems",      color: P.muted,  delay: 0.41 },
        { text: "",                                color: P.muted,  delay: 0.44 },
        { text: "MP mesh:",                        color: P.teal,   delay: 0.47 },
        { text: "shifted away from Γ",              color: P.muted,  delay: 0.50 },
        { text: "better sampling efficiency",      color: P.muted,  delay: 0.53 },
        { text: "",                                color: P.muted,  delay: 0.56 },
        { text: "Convergence test:",               color: P.ok,     delay: 0.59 },
        { text: "increase k-mesh until ΔE<1meV",   color: P.muted,  delay: 0.63 },
        { text: "",                                color: P.muted,  delay: 0.66 },
        { text: "Denser mesh = more accurate",     color: P.warn,   delay: 0.69 },
        { text: "but O(N_k) cost scaling",         color: P.warn,   delay: 0.73 },
      ];

      const bzCx = RX + RW / 2, bzCy = 150, bzR = 85;
      const gridN = Math.min(6, 2 + Math.floor(ease(clamp01((t - 0.15) * 2)) * 4.99));

      // Convergence curve data
      const convData = [
        { mesh: "2x2x2", E: -12.3 },
        { mesh: "4x4x4", E: -12.85 },
        { mesh: "6x6x6", E: -12.92 },
        { mesh: "8x8x8", E: -12.945 },
        { mesh: "10x10", E: -12.950 },
        { mesh: "12x12", E: -12.951 },
      ];
      const gX = RX + 40, gW = RW - 80, gYt = 280, gH = 95;
      const Emin = -12.96, Emax = -12.2;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>KPOINTS — Brillouin Zone Sampling</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={bzCx} y={52} textAnchor="middle" fill={P.green} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            {gridN}x{gridN}x{gridN} Monkhorst-Pack Grid
          </text>

          {/* Hexagonal BZ outline */}
          <g opacity={ease(clamp01((t - 0.10) * 5))}>
            <polygon points={Array.from({ length: 6 }, (_, i) => {
              const a = (i * 60 - 30) * Math.PI / 180;
              return `${bzCx + bzR * Math.cos(a)},${bzCy + bzR * Math.sin(a)}`;
            }).join(' ')} fill={P.blue + "08"} stroke={P.blue + "40"} strokeWidth="1.5" />
          </g>

          {/* k-point grid dots appearing */}
          {Array.from({ length: gridN }, (_, i) => Array.from({ length: gridN }, (_, j) => {
            const kx = bzCx + ((i - (gridN - 1) / 2) / (gridN / 2)) * (bzR * 0.75);
            const ky = bzCy + ((j - (gridN - 1) / 2) / (gridN / 2)) * (bzR * 0.75);
            const dist = Math.sqrt((kx - bzCx) ** 2 + (ky - bzCy) ** 2);
            if (dist > bzR - 5) return null;
            const delay = 0.15 + (i + j) * 0.02;
            const op = ease(clamp01((t - delay) * 6));
            const isGamma = i === Math.floor((gridN - 1) / 2) && j === Math.floor((gridN - 1) / 2);
            return (
              <circle key={`${i}-${j}`} cx={kx} cy={ky} r={isGamma ? 5 : 3.5}
                fill={isGamma ? P.amber : P.pink} opacity={op * 0.85} />
            );
          }))}

          {/* Gamma label */}
          <g opacity={ease(clamp01((t - 0.30) * 5))}>
            <text x={bzCx + 10} y={bzCy - 8} fill={P.amber} fontSize="11" fontWeight="800"
              fontFamily="'Inter',sans-serif">{"\u0393"}</text>
          </g>

          {/* Grid density label */}
          <g opacity={ease(clamp01((t - 0.40) * 4))}>
            <text x={bzCx} y={bzCy + bzR + 20} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">Total k-points: {gridN * gridN * gridN} (irreducible: ~{Math.ceil(gridN * gridN * gridN / 8)})</text>
          </g>

          {/* Convergence curve */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <text x={bzCx} y={gYt - 8} textAnchor="middle" fill={P.teal} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Energy vs k-mesh Density</text>
            <line x1={gX} y1={gYt} x2={gX} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <line x1={gX} y1={gYt + gH} x2={gX + gW} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <text x={gX + gW / 2} y={gYt + gH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">k-mesh density</text>
            {/* Converged line */}
            <line x1={gX} y1={gYt + gH * (1 - (-12.951 - Emin) / (Emax - Emin))}
              x2={gX + gW} y2={gYt + gH * (1 - (-12.951 - Emin) / (Emax - Emin))}
              stroke={P.ok} strokeWidth="0.8" strokeDasharray="4,3" opacity={0.5} />
            <text x={gX + gW + 5} y={gYt + gH * (1 - (-12.951 - Emin) / (Emax - Emin)) + 3}
              fill={P.ok} fontSize="7" fontFamily="'Inter',sans-serif">conv.</text>
            {/* Curve */}
            {convData.map((d, i) => {
              const px = gX + (i / (convData.length - 1)) * gW;
              const py = gYt + gH * (1 - (d.E - Emin) / (Emax - Emin));
              const visP = ease(clamp01((t - 0.58 - i * 0.04) * 5));
              return (
                <g key={i} opacity={visP}>
                  {i > 0 && (
                    <line x1={gX + ((i - 1) / (convData.length - 1)) * gW}
                      y1={gYt + gH * (1 - (convData[i - 1].E - Emin) / (Emax - Emin))}
                      x2={px} y2={py} stroke={P.green} strokeWidth="2" />
                  )}
                  <circle cx={px} cy={py} r={4} fill={i === convData.length - 1 ? P.ok : P.green} />
                  <text x={px} y={gYt + gH + 10} textAnchor="middle" fill={P.muted} fontSize="6.5"
                    fontFamily="'Inter',sans-serif">{d.mesh}</text>
                </g>
              );
            })}
          </g>
        </svg>
      );
    }

    // ── 4. ENCUT ─────────────────────────────────────────────────────────
    case "encut": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "ENCUT — Plane Wave Cutoff",       color: P.amber,  delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "Plane wave expansion:",           color: P.blue,   delay: 0.10 },
        { text: "\u03c8_k(r) = \u03a3_G c_{k+G} e^{i(k+G)\u00b7r}", color: P.ink, delay: 0.14 },
        { text: "",                                color: P.muted,  delay: 0.18 },
        { text: "Cutoff condition:",               color: P.green,  delay: 0.21 },
        { text: "\u0127\u00b2|k+G|\u00b2/2m \u2264 ENCUT",  color: P.ink, delay: 0.25 },
        { text: "",                                color: P.muted,  delay: 0.28 },
        { text: "More G-vectors included as",      color: P.purple, delay: 0.31 },
        { text: "ENCUT increases:",                color: P.purple, delay: 0.34 },
        { text: "  200 eV → ~1000 PWs",            color: P.muted,  delay: 0.38 },
        { text: "  400 eV → ~8000 PWs",            color: P.muted,  delay: 0.41 },
        { text: "  600 eV → ~25000 PWs",           color: P.muted,  delay: 0.44 },
        { text: "",                                color: P.muted,  delay: 0.47 },
        { text: "Convergence test:",               color: P.ok,     delay: 0.50 },
        { text: "increase ENCUT until ΔE<1meV",    color: P.muted,  delay: 0.54 },
        { text: "",                                color: P.muted,  delay: 0.57 },
        { text: "Typical values:",                 color: P.teal,   delay: 0.60 },
        { text: "  O, N, F: 500-600 eV",           color: P.muted,  delay: 0.64 },
        { text: "  Si, Ge:  300-400 eV",           color: P.muted,  delay: 0.67 },
        { text: "  metals:  400 eV usually ok",    color: P.muted,  delay: 0.70 },
        { text: "",                                color: P.muted,  delay: 0.73 },
        { text: "ENCUT = 1.3 × ENMAX (POTCAR)",   color: P.warn,   delay: 0.76 },
      ];

      const circCx = RX + RW / 2, circCy = 145;
      const ecutProgress = ease(clamp01((t - 0.15) * 1.5));
      const currentENCUT = Math.round(lerp(100, 600, ecutProgress));
      const maxR = 110;
      const cutR = maxR * ecutProgress;

      // Convergence curve
      const convData = [
        { ecut: 200, E: -8.2 },
        { ecut: 300, E: -8.65 },
        { ecut: 400, E: -8.78 },
        { ecut: 500, E: -8.82 },
        { ecut: 600, E: -8.83 },
        { ecut: 700, E: -8.831 },
      ];
      const gX = RX + 40, gW = RW - 80, gYt = 280, gH = 95;
      const Emin = -8.85, Emax = -8.1;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>ENCUT — Plane Wave Energy Cutoff</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 15.5} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={circCx} y={52} textAnchor="middle" fill={P.amber} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            G-vector Sphere — ENCUT = {currentENCUT} eV
          </text>

          {/* Cutoff sphere */}
          <circle cx={circCx} cy={circCy} r={maxR} fill="none" stroke={P.dim} strokeWidth="1"
            opacity={ease(clamp01((t - 0.10) * 5)) * 0.3} strokeDasharray="4,3" />
          <circle cx={circCx} cy={circCy} r={cutR} fill={P.amber + "08"} stroke={P.amber + "50"}
            strokeWidth="2" opacity={ease(clamp01((t - 0.15) * 5))} />

          {/* G-vector dots inside sphere */}
          {Array.from({ length: 12 }, (_, ring) => {
            const ringR = (ring + 1) * 9;
            if (ringR > cutR) return null;
            const nPts = 4 + ring * 2;
            return Array.from({ length: nPts }, (_, j) => {
              const angle = (j / nPts) * Math.PI * 2 + ring * 0.3;
              const gx = circCx + ringR * Math.cos(angle);
              const gy = circCy + ringR * Math.sin(angle);
              const op = ease(clamp01((t - 0.18 - ring * 0.03) * 5));
              return (
                <circle key={`${ring}-${j}`} cx={gx} cy={gy} r={2}
                  fill={P.blue} opacity={op * 0.7} />
              );
            });
          })}

          {/* Center point */}
          <circle cx={circCx} cy={circCy} r={4} fill={P.amber} opacity={tOp} />
          <text x={circCx + 8} y={circCy + 4} fill={P.amber} fontSize="8" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={tOp}>k</text>

          {/* Cutoff radius label */}
          <g opacity={ease(clamp01((t - 0.35) * 5))}>
            <line x1={circCx} y1={circCy} x2={circCx + cutR} y2={circCy}
              stroke={P.green} strokeWidth="1.5" strokeDasharray="3,2" />
            <text x={circCx + cutR / 2} y={circCy - 6} textAnchor="middle" fill={P.green}
              fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">|k+G|_max</text>
          </g>

          {/* Convergence curve */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <text x={circCx} y={gYt - 8} textAnchor="middle" fill={P.teal} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Total Energy vs ENCUT</text>
            <line x1={gX} y1={gYt} x2={gX} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <line x1={gX} y1={gYt + gH} x2={gX + gW} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <text x={gX + gW / 2} y={gYt + gH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">ENCUT (eV)</text>
            {/* Converged line */}
            <line x1={gX} y1={gYt + gH * (1 - (-8.831 - Emin) / (Emax - Emin))}
              x2={gX + gW} y2={gYt + gH * (1 - (-8.831 - Emin) / (Emax - Emin))}
              stroke={P.ok} strokeWidth="0.8" strokeDasharray="4,3" opacity={0.5} />
            {convData.map((d, i) => {
              const px = gX + (i / (convData.length - 1)) * gW;
              const py = gYt + gH * (1 - (d.E - Emin) / (Emax - Emin));
              const visP = ease(clamp01((t - 0.58 - i * 0.04) * 5));
              return (
                <g key={i} opacity={visP}>
                  {i > 0 && (
                    <line x1={gX + ((i - 1) / (convData.length - 1)) * gW}
                      y1={gYt + gH * (1 - (convData[i - 1].E - Emin) / (Emax - Emin))}
                      x2={px} y2={py} stroke={P.amber} strokeWidth="2" />
                  )}
                  <circle cx={px} cy={py} r={4} fill={i >= 4 ? P.ok : P.amber} />
                  <text x={px} y={gYt + gH + 10} textAnchor="middle" fill={P.muted} fontSize="6.5"
                    fontFamily="'Inter',sans-serif">{d.ecut}</text>
                </g>
              );
            })}
          </g>

          {/* ENMAX tip */}
          <g opacity={ease(clamp01((t - 0.85) * 4))}>
            <rect x={RX + 30} y={388} width={RW - 60} height={20} rx="4"
              fill={P.warn + "15"} stroke={P.warn + "40"} strokeWidth="1" />
            <text x={circCx} y={402} textAnchor="middle" fill={P.warn} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Tip: ENCUT = 1.3 x ENMAX from POTCAR</text>
          </g>
        </svg>
      );
    }

    // ── 5. ISMEAR & SIGMA ────────────────────────────────────────────────
    case "ismear": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "ISMEAR — Smearing Method",        color: P.pink,   delay: 0.04 },
        { text: "SIGMA — Smearing Width (eV)",     color: P.pink,   delay: 0.08 },
        { text: "",                                color: P.muted,  delay: 0.11 },
        { text: "Occupation function f(ε):",       color: P.blue,   delay: 0.14 },
        { text: "",                                color: P.muted,  delay: 0.17 },
        { text: "ISMEAR=-1: Fermi-Dirac",          color: P.green,  delay: 0.20 },
        { text: "  f = 1/[exp((ε-μ)/σ)+1]",        color: P.ink,    delay: 0.24 },
        { text: "",                                color: P.muted,  delay: 0.27 },
        { text: "ISMEAR=0: Gaussian smearing",     color: P.amber,  delay: 0.30 },
        { text: "  f = ½[1-erf((ε-μ)/σ)]",         color: P.ink,    delay: 0.34 },
        { text: "",                                color: P.muted,  delay: 0.37 },
        { text: "ISMEAR=1,2: Methfessel-Paxton",   color: P.purple, delay: 0.40 },
        { text: "  higher order → less error",     color: P.muted,  delay: 0.44 },
        { text: "",                                color: P.muted,  delay: 0.47 },
        { text: "ISMEAR=-5: Tetrahedron+Blöchl",   color: P.teal,   delay: 0.50 },
        { text: "  best for DOS, needs k≥3×3×3",    color: P.muted,  delay: 0.54 },
        { text: "",                                color: P.muted,  delay: 0.57 },
        { text: "SIGMA too large → wrong entropy", color: P.warn,   delay: 0.60 },
        { text: "SIGMA too small → SCF issues",    color: P.warn,   delay: 0.64 },
        { text: "typical: SIGMA = 0.05-0.2 eV",    color: P.ok,     delay: 0.68 },
      ];

      const plotCx = RX + RW / 2, plotW = RW - 60, plotH = 120;
      const plotX = RX + 30, plotY = 65;

      // Occupation functions
      const smearProgress = ease(clamp01((t - 0.20) * 2));
      const sigma = lerp(0.001, 0.15, smearProgress);

      const stepFn = (x) => x < 0 ? 1 : 0;
      const gaussFn = (x, s) => 0.5 * (1 - erf(x / (s * 5)));
      const fermiFn = (x, s) => 1 / (1 + Math.exp(x / (s * 5)));

      function erf(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        const tt = 1 / (1 + p * x);
        const y = 1 - (((((a5 * tt + a4) * tt) + a3) * tt + a2) * tt + a1) * tt * Math.exp(-x * x);
        return sign * y;
      }

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>ISMEAR &amp; SIGMA — Electronic Smearing</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 17} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={plotCx} y={52} textAnchor="middle" fill={P.pink} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            Occupation Function f(ε) — σ={sigma.toFixed(3)} eV
          </text>

          {/* Axes */}
          <g opacity={ease(clamp01((t - 0.10) * 5))}>
            <line x1={plotX} y1={plotY} x2={plotX} y2={plotY + plotH} stroke={P.muted} strokeWidth="1" />
            <line x1={plotX} y1={plotY + plotH} x2={plotX + plotW} y2={plotY + plotH} stroke={P.muted} strokeWidth="1" />
            <text x={plotX + plotW / 2} y={plotY + plotH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">ε - μ (eV)</text>
            <text x={plotX - 5} y={plotY + plotH / 2} textAnchor="end" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${plotX - 5} ${plotY + plotH / 2})`}>f(ε)</text>
            {/* Fermi level line */}
            <line x1={plotX + plotW / 2} y1={plotY} x2={plotX + plotW / 2} y2={plotY + plotH}
              stroke={P.dim} strokeWidth="1" strokeDasharray="3,3" />
            <text x={plotX + plotW / 2} y={plotY - 3} textAnchor="middle" fill={P.muted} fontSize="7"
              fontFamily="'Inter',sans-serif">μ</text>
          </g>

          {/* Step function (no smearing) */}
          <g opacity={ease(clamp01((t - 0.14) * 5)) * 0.5}>
            {Array.from({ length: 50 }, (_, i) => {
              const x0 = (i / 49) * 2 - 1;
              const x1 = ((i + 1) / 49) * 2 - 1;
              const y0 = stepFn(x0);
              const y1 = stepFn(x1);
              return (
                <line key={i} x1={plotX + (i / 49) * plotW} y1={plotY + plotH - y0 * plotH}
                  x2={plotX + ((i + 1) / 49) * plotW} y2={plotY + plotH - y1 * plotH}
                  stroke={P.dim} strokeWidth="2" />
              );
            })}
          </g>

          {/* Gaussian smearing */}
          <g opacity={ease(clamp01((t - 0.22) * 5))}>
            {Array.from({ length: 80 }, (_, i) => {
              if (i === 79) return null;
              const x0 = (i / 79) * 2 - 1;
              const x1 = ((i + 1) / 79) * 2 - 1;
              return (
                <line key={i} x1={plotX + (i / 79) * plotW} y1={plotY + plotH - gaussFn(x0, sigma) * plotH}
                  x2={plotX + ((i + 1) / 79) * plotW} y2={plotY + plotH - gaussFn(x1, sigma) * plotH}
                  stroke={P.amber} strokeWidth="2" />
              );
            })}
          </g>

          {/* Fermi-Dirac */}
          <g opacity={ease(clamp01((t - 0.35) * 5))}>
            {Array.from({ length: 80 }, (_, i) => {
              if (i === 79) return null;
              const x0 = (i / 79) * 2 - 1;
              const x1 = ((i + 1) / 79) * 2 - 1;
              return (
                <line key={i} x1={plotX + (i / 79) * plotW} y1={plotY + plotH - fermiFn(x0, sigma) * plotH}
                  x2={plotX + ((i + 1) / 79) * plotW} y2={plotY + plotH - fermiFn(x1, sigma) * plotH}
                  stroke={P.green} strokeWidth="2" strokeDasharray="5,2" />
              );
            })}
          </g>

          {/* Legend */}
          <g opacity={ease(clamp01((t - 0.40) * 4))}>
            <rect x={plotX + plotW - 135} y={plotY + 5} width={130} height={56} rx="5"
              fill={P.bg + "cc"} stroke={P.border} strokeWidth="1" />
            <line x1={plotX + plotW - 125} y1={plotY + 20} x2={plotX + plotW - 105} y2={plotY + 20} stroke={P.dim} strokeWidth="2" />
            <text x={plotX + plotW - 100} y={plotY + 24} fill={P.dim} fontSize="7.5" fontFamily="'Inter',sans-serif">Step (T=0)</text>
            <line x1={plotX + plotW - 125} y1={plotY + 35} x2={plotX + plotW - 105} y2={plotY + 35} stroke={P.amber} strokeWidth="2" />
            <text x={plotX + plotW - 100} y={plotY + 39} fill={P.amber} fontSize="7.5" fontFamily="'Inter',sans-serif">Gaussian</text>
            <line x1={plotX + plotW - 125} y1={plotY + 50} x2={plotX + plotW - 105} y2={plotY + 50} stroke={P.green} strokeWidth="2" strokeDasharray="5,2" />
            <text x={plotX + plotW - 100} y={plotY + 54} fill={P.green} fontSize="7.5" fontFamily="'Inter',sans-serif">Fermi-Dirac</text>
          </g>

          {/* ISMEAR method comparison table */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <rect x={RX + 20} y={200} width={RW - 40} height={120} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={plotCx} y={218} textAnchor="middle" fill={P.purple} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">ISMEAR Method Guide</text>
            {[
              { tag: "ISMEAR=-5", desc: "Tetrahedron — DOS, accurate", use: "insulators", col: P.teal },
              { tag: "ISMEAR=-1", desc: "Fermi-Dirac — finite T", use: "metals (MD)", col: P.green },
              { tag: "ISMEAR=0",  desc: "Gaussian — general purpose", use: "semiconductors", col: P.amber },
              { tag: "ISMEAR=1",  desc: "Methfessel-Paxton — forces", use: "metals (relax)", col: P.purple },
            ].map((row, i) => (
              <g key={i}>
                <text x={RX + 30} y={237 + i * 20} fill={row.col} fontSize="9" fontWeight="700"
                  fontFamily="'Fira Code','Consolas',monospace">{row.tag}</text>
                <text x={RX + 130} y={237 + i * 20} fill={P.ink} fontSize="8.5"
                  fontFamily="'Inter',sans-serif">{row.desc}</text>
              </g>
            ))}
          </g>

          {/* Sigma warning */}
          <g opacity={ease(clamp01((t - 0.75) * 4))}>
            <rect x={RX + 20} y={332} width={RW - 40} height={72} rx="6"
              fill={P.warn + "0a"} stroke={P.warn + "40"} strokeWidth="1.5" />
            <text x={plotCx} y={350} textAnchor="middle" fill={P.warn} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">SIGMA Tradeoff</text>
            <text x={RX + 35} y={370} fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">σ too large → artificial entropy, wrong E</text>
            <text x={RX + 35} y={388} fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">σ too small → noisy forces, SCF convergence issues</text>
            <text x={plotCx} y={400} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Check: entropy T*S &lt; 1 meV/atom</text>
          </g>
        </svg>
      );
    }

    // ── 6. ALGO ──────────────────────────────────────────────────────────
    case "algo": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "ALGO — SCF Algorithm",            color: P.purple, delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "Electronic minimization:",        color: P.blue,   delay: 0.10 },
        { text: "",                                color: P.muted,  delay: 0.13 },
        { text: "ALGO=Normal (Davidson)",          color: P.green,  delay: 0.16 },
        { text: "  robust, moderate speed",        color: P.muted,  delay: 0.20 },
        { text: "  blocked Davidson iteration",    color: P.muted,  delay: 0.23 },
        { text: "",                                color: P.muted,  delay: 0.26 },
        { text: "ALGO=Fast",                       color: P.amber,  delay: 0.29 },
        { text: "  Davidson + RMM-DIIS",           color: P.muted,  delay: 0.33 },
        { text: "  good default for most systems", color: P.muted,  delay: 0.36 },
        { text: "",                                color: P.muted,  delay: 0.39 },
        { text: "ALGO=VeryFast (RMM-DIIS only)",   color: P.pink,   delay: 0.42 },
        { text: "  fastest but less robust",       color: P.muted,  delay: 0.46 },
        { text: "  can miss low eigenvalues",      color: P.muted,  delay: 0.49 },
        { text: "",                                color: P.muted,  delay: 0.52 },
        { text: "ALGO=All",                        color: P.teal,   delay: 0.55 },
        { text: "  Davidson then CG",              color: P.muted,  delay: 0.59 },
        { text: "  most robust, hybrid functionals", color: P.muted, delay: 0.62 },
        { text: "",                                color: P.muted,  delay: 0.65 },
        { text: "NELM = max SCF steps (default 60)", color: P.warn, delay: 0.68 },
      ];

      // SCF convergence trajectories
      const algos = [
        { name: "Normal", col: P.green,  data: [1, 0.5, 0.25, 0.12, 0.06, 0.03, 0.015, 0.008, 0.004, 0.002] },
        { name: "Fast",   col: P.amber,  data: [1, 0.4, 0.15, 0.05, 0.02, 0.008, 0.003, 0.001] },
        { name: "VFast",  col: P.pink,   data: [1, 0.6, 0.2, 0.08, 0.015, 0.006, 0.002] },
        { name: "All",    col: P.teal,   data: [1, 0.45, 0.18, 0.07, 0.025, 0.01, 0.004, 0.002, 0.001] },
      ];
      const gX = RX + 50, gW = RW - 90, gYt = 65, gH = 160;

      // SCF loop diagram
      const loopCx = RX + RW / 2, loopCy = 330, loopR = 55;
      const loopNodes = [
        { label: "H\u03c8=E\u03c8", angle: -90, col: P.purple },
        { label: "\u03c1_new",  angle: 0,   col: P.green },
        { label: "Mix",       angle: 90,  col: P.amber },
        { label: "V_KS",      angle: 180, col: P.blue },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>ALGO — SCF Algorithm Selection</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={RX + RW / 2} y={55} textAnchor="middle" fill={P.purple} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            SCF Convergence by Algorithm
          </text>

          {/* Convergence plot */}
          <g opacity={ease(clamp01((t - 0.15) * 5))}>
            <line x1={gX} y1={gYt} x2={gX} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <line x1={gX} y1={gYt + gH} x2={gX + gW} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <text x={gX + gW / 2} y={gYt + gH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">SCF Step</text>
            <text x={gX - 5} y={gYt + gH / 2} textAnchor="end" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${gX - 5} ${gYt + gH / 2})`}>log(ΔE)</text>
            {/* EDIFF threshold */}
            <line x1={gX} y1={gYt + gH * 0.85} x2={gX + gW} y2={gYt + gH * 0.85}
              stroke={P.ok} strokeWidth="1" strokeDasharray="4,3" opacity={0.6} />
            <text x={gX + gW + 5} y={gYt + gH * 0.85 + 3} fill={P.ok} fontSize="7"
              fontFamily="'Inter',sans-serif">EDIFF</text>
          </g>

          {/* Algorithm curves */}
          {algos.map((algo, ai) => {
            const op = ease(clamp01((t - 0.22 - ai * 0.08) * 5));
            const maxSteps = algo.data.length;
            return (
              <g key={ai} opacity={op}>
                {algo.data.map((val, i) => {
                  if (i === 0) return null;
                  const x1p = gX + ((i - 1) / (maxSteps - 1)) * gW;
                  const y1p = gYt + gH * (1 - Math.max(0, (-Math.log10(algo.data[i - 1])) / 3.5));
                  const x2p = gX + (i / (maxSteps - 1)) * gW;
                  const y2p = gYt + gH * (1 - Math.max(0, (-Math.log10(val)) / 3.5));
                  return (
                    <line key={i} x1={x1p} y1={y1p} x2={x2p} y2={y2p}
                      stroke={algo.col} strokeWidth="2" strokeLinecap="round" />
                  );
                })}
              </g>
            );
          })}

          {/* Legend */}
          <g opacity={ease(clamp01((t - 0.50) * 4))}>
            <rect x={gX + gW - 110} y={gYt + 5} width={108} height={70} rx="5"
              fill={P.bg + "cc"} stroke={P.border} strokeWidth="1" />
            {algos.map((algo, i) => (
              <g key={i}>
                <line x1={gX + gW - 100} y1={gYt + 20 + i * 15} x2={gX + gW - 80} y2={gYt + 20 + i * 15}
                  stroke={algo.col} strokeWidth="2" />
                <text x={gX + gW - 75} y={gYt + 24 + i * 15} fill={algo.col} fontSize="8" fontWeight="600"
                  fontFamily="'Inter',sans-serif">{algo.name}</text>
              </g>
            ))}
          </g>

          {/* SCF loop mini diagram */}
          <g opacity={ease(clamp01((t - 0.62) * 4))}>
            <text x={loopCx} y={loopCy - loopR - 12} textAnchor="middle" fill={P.blue} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">SCF Loop</text>
            <circle cx={loopCx} cy={loopCy} r={loopR} fill="none" stroke={P.dim}
              strokeWidth="1" strokeDasharray="4,3" opacity={0.5} />
            {/* Animated arc */}
            {(() => {
              const arcP = clamp01((t - 0.65) * 1.5);
              const sa = -Math.PI / 2;
              const ea = sa + arcP * 2 * Math.PI;
              const x1 = loopCx + loopR * Math.cos(sa), y1 = loopCy + loopR * Math.sin(sa);
              const x2 = loopCx + loopR * Math.cos(ea), y2 = loopCy + loopR * Math.sin(ea);
              const lg = arcP > 0.5 ? 1 : 0;
              return arcP > 0 ? (
                <path d={`M${x1},${y1} A${loopR},${loopR} 0 ${lg},1 ${x2},${y2}`}
                  fill="none" stroke={P.purple} strokeWidth="2.5" opacity={0.6} />
              ) : null;
            })()}
            {loopNodes.map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const nx = loopCx + loopR * Math.cos(rad);
              const ny = loopCy + loopR * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={nx} cy={ny} r={18} fill={node.col + "18"} stroke={node.col + "70"} strokeWidth="1.5" />
                  <text x={nx} y={ny + 4} textAnchor="middle" fill={node.col} fontSize="7.5" fontWeight="700"
                    fontFamily="'Inter',sans-serif">{node.label}</text>
                </g>
              );
            })}
          </g>
        </svg>
      );
    }

    // ── 7. EDIFF & EDIFFG ──────────────────────────────────────────────
    case "ediff": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "EDIFF — Electronic Convergence",  color: P.blue,   delay: 0.04 },
        { text: "EDIFFG — Ionic Convergence",      color: P.green,  delay: 0.08 },
        { text: "",                                color: P.muted,  delay: 0.11 },
        { text: "EDIFF (default 1E-4 eV):",        color: P.blue,   delay: 0.14 },
        { text: "  |E_n - E_{n-1}| < EDIFF",       color: P.ink,    delay: 0.18 },
        { text: "  per SCF step",                  color: P.muted,  delay: 0.21 },
        { text: "",                                color: P.muted,  delay: 0.24 },
        { text: "Tighter EDIFF = more SCF steps",  color: P.warn,   delay: 0.27 },
        { text: "  1E-4: standard",                color: P.muted,  delay: 0.31 },
        { text: "  1E-6: phonons, elastic const",  color: P.muted,  delay: 0.34 },
        { text: "  1E-8: NMR, dielectric props",   color: P.muted,  delay: 0.37 },
        { text: "",                                color: P.muted,  delay: 0.40 },
        { text: "EDIFFG (ionic relaxation):",      color: P.green,  delay: 0.43 },
        { text: "  EDIFFG < 0: force criterion",   color: P.ink,    delay: 0.47 },
        { text: "  |F_max| < |EDIFFG| (eV/\u00c5)", color: P.ink,  delay: 0.50 },
        { text: "  typical: EDIFFG = -0.02",       color: P.ok,     delay: 0.54 },
        { text: "",                                color: P.muted,  delay: 0.57 },
        { text: "  EDIFFG > 0: energy criterion",  color: P.ink,    delay: 0.60 },
        { text: "  |ΔE_ionic| < EDIFFG",            color: P.ink,    delay: 0.63 },
        { text: "",                                color: P.muted,  delay: 0.66 },
        { text: "Rule: EDIFF << EDIFFG always",    color: P.warn,   delay: 0.69 },
      ];

      // SCF convergence animation
      const gX = RX + 40, gW = RW - 80, gYt = 60, gH = 110;
      const scfSteps = 10;
      const scfData = Array.from({ length: scfSteps }, (_, i) => {
        const decay = Math.exp(-i * 0.6) * 0.8;
        const osc = Math.sin(i * 1.2) * decay * 0.3;
        return -5.0 + decay + osc;
      });
      const Emin2 = -5.1, Emax2 = -4.1;

      // Force vectors on atoms
      const atoms = [
        { x: RX + 100, y: 330 },
        { x: RX + 200, y: 310 },
        { x: RX + 300, y: 340 },
        { x: RX + 150, y: 370 },
        { x: RX + 250, y: 380 },
      ];
      const forceScale = 1 - ease(clamp01((t - 0.55) * 2));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>EDIFF &amp; EDIFFG — Convergence Criteria</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={RX + RW / 2} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            SCF Energy Convergence
          </text>

          {/* SCF convergence plot */}
          <g opacity={ease(clamp01((t - 0.12) * 5))}>
            <line x1={gX} y1={gYt} x2={gX} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <line x1={gX} y1={gYt + gH} x2={gX + gW} y2={gYt + gH} stroke={P.muted} strokeWidth="1" />
            <text x={gX + gW / 2} y={gYt + gH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">SCF Iteration</text>
            {/* EDIFF threshold */}
            {(() => {
              const threshY = gYt + gH * (1 - (-5.0 - Emin2) / (Emax2 - Emin2));
              return (
                <g>
                  <line x1={gX} y1={threshY} x2={gX + gW} y2={threshY}
                    stroke={P.ok} strokeWidth="1" strokeDasharray="4,3" opacity={0.6} />
                  <text x={gX + gW + 5} y={threshY + 3} fill={P.ok} fontSize="7"
                    fontFamily="'Inter',sans-serif">EDIFF</text>
                </g>
              );
            })()}
            {/* Energy curve */}
            {scfData.map((E, i) => {
              const visibleSteps = Math.floor(ease(clamp01((t - 0.15) * 1.8)) * scfSteps);
              if (i >= visibleSteps) return null;
              const px = gX + (i / (scfSteps - 1)) * gW;
              const py = gYt + gH * (1 - (E - Emin2) / (Emax2 - Emin2));
              return (
                <g key={i}>
                  {i > 0 && (
                    <line x1={gX + ((i - 1) / (scfSteps - 1)) * gW}
                      y1={gYt + gH * (1 - (scfData[i - 1] - Emin2) / (Emax2 - Emin2))}
                      x2={px} y2={py} stroke={P.blue} strokeWidth="2" />
                  )}
                  <circle cx={px} cy={py} r={3.5} fill={i === scfSteps - 1 ? P.ok : P.blue} />
                </g>
              );
            })}
          </g>

          {/* Ionic relaxation — EDIFFG */}
          <g opacity={ease(clamp01((t - 0.50) * 4))}>
            <text x={RX + RW / 2} y={200} textAnchor="middle" fill={P.green} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Ionic Relaxation — Forces Shrinking</text>
            <rect x={RX + 20} y={210} width={RW - 40} height={30} rx="5"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={RX + RW / 2} y={230} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">EDIFFG = -0.02 eV/Å → forces converge to zero</text>
          </g>

          {/* Crystal with shrinking force arrows */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <rect x={RX + 30} y={250} width={RW - 60} height={150} rx="6"
              fill={P.panel + "80"} stroke={P.border} strokeWidth="1" />
            {atoms.map((atom, i) => {
              const fLen = 25 * forceScale * (1 + i * 0.15);
              const fAngle = (i * 1.3 + 0.5);
              const fx = fLen * Math.cos(fAngle);
              const fy = fLen * Math.sin(fAngle);
              return (
                <g key={i}>
                  <circle cx={atom.x} cy={atom.y} r={10} fill={P.blue + "30"} stroke={P.blue} strokeWidth="1.5" />
                  {fLen > 2 && (
                    <line x1={atom.x} y1={atom.y} x2={atom.x + fx} y2={atom.y + fy}
                      stroke={P.red} strokeWidth="2" />
                  )}
                  {fLen > 2 && (
                    <circle cx={atom.x + fx} cy={atom.y + fy} r={2.5} fill={P.red} />
                  )}
                </g>
              );
            })}
            <text x={RX + RW / 2} y={280} textAnchor="middle" fill={forceScale < 0.1 ? P.ok : P.amber}
              fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">
              |F_max| = {(forceScale * 0.5).toFixed(3)} eV/Å {forceScale < 0.1 ? "— CONVERGED!" : ""}
            </text>
          </g>
        </svg>
      );
    }

    // ── 8. PREC & NGF ────────────────────────────────────────────────────
    case "prec": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "PREC — Precision Setting",        color: P.teal,   delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "Controls FFT grid density and",   color: P.blue,   delay: 0.10 },
        { text: "wrap-around errors:",             color: P.blue,   delay: 0.13 },
        { text: "",                                color: P.muted,  delay: 0.16 },
        { text: "PREC=Low:",                       color: P.warn,   delay: 0.19 },
        { text: "  NGXF = 2×NGX (coarse)",         color: P.muted,  delay: 0.23 },
        { text: "  fast, inaccurate",              color: P.muted,  delay: 0.26 },
        { text: "",                                color: P.muted,  delay: 0.29 },
        { text: "PREC=Normal:",                    color: P.amber,  delay: 0.32 },
        { text: "  NGXF = 2×NGX",                  color: P.muted,  delay: 0.36 },
        { text: "  default, usually sufficient",   color: P.muted,  delay: 0.39 },
        { text: "",                                color: P.muted,  delay: 0.42 },
        { text: "PREC=Accurate:",                  color: P.ok,     delay: 0.45 },
        { text: "  NGXF = 2×NGX (finer augment)",  color: P.muted,  delay: 0.49 },
        { text: "  ADDGRID=.TRUE. equivalent",     color: P.muted,  delay: 0.52 },
        { text: "  recommended for production",    color: P.ok,     delay: 0.55 },
        { text: "",                                color: P.muted,  delay: 0.58 },
        { text: "Egg-box effect:",                 color: P.pink,   delay: 0.61 },
        { text: "  coarse grid → E depends on",   color: P.muted,  delay: 0.65 },
        { text: "  atom position within grid",     color: P.muted,  delay: 0.68 },
        { text: "  → noisy forces!",               color: P.warn,   delay: 0.72 },
      ];

      const gridCx = RX + RW / 2, gridCy = 160;
      const coarseN = 6, fineN = 12;
      const gridSize = 160;
      const precProgress = ease(clamp01((t - 0.25) * 1.8));
      const currentN = Math.round(lerp(coarseN, fineN, precProgress));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>PREC &amp; NGF — FFT Grid Precision</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={gridCx} y={52} textAnchor="middle" fill={P.teal} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            FFT Grid: {currentN}x{currentN} ({precProgress < 0.3 ? "Coarse" : precProgress < 0.7 ? "Normal" : "Fine"})
          </text>

          {/* FFT grid */}
          <g opacity={ease(clamp01((t - 0.15) * 5))}>
            <rect x={gridCx - gridSize / 2} y={gridCy - gridSize / 2} width={gridSize} height={gridSize}
              fill="none" stroke={P.dim} strokeWidth="1" />
            {Array.from({ length: currentN + 1 }, (_, i) => {
              const pos = (i / currentN) * gridSize;
              return (
                <g key={`g-${i}`}>
                  <line x1={gridCx - gridSize / 2 + pos} y1={gridCy - gridSize / 2}
                    x2={gridCx - gridSize / 2 + pos} y2={gridCy + gridSize / 2}
                    stroke={P.teal + "30"} strokeWidth="0.5" />
                  <line x1={gridCx - gridSize / 2} y1={gridCy - gridSize / 2 + pos}
                    x2={gridCx + gridSize / 2} y2={gridCy - gridSize / 2 + pos}
                    stroke={P.teal + "30"} strokeWidth="0.5" />
                </g>
              );
            })}
            {/* Charge density blobs on grid */}
            {Array.from({ length: currentN }, (_, i) => Array.from({ length: currentN }, (_, j) => {
              const gx = gridCx - gridSize / 2 + (i + 0.5) / currentN * gridSize;
              const gy = gridCy - gridSize / 2 + (j + 0.5) / currentN * gridSize;
              const dist1 = Math.sqrt((gx - gridCx + 30) ** 2 + (gy - gridCy + 20) ** 2);
              const dist2 = Math.sqrt((gx - gridCx - 30) ** 2 + (gy - gridCy - 10) ** 2);
              const rho = Math.exp(-dist1 * dist1 / 1200) + 0.7 * Math.exp(-dist2 * dist2 / 800);
              const r = Math.max(1, (gridSize / currentN) * 0.35 * rho);
              return (
                <circle key={`${i}-${j}`} cx={gx} cy={gy} r={r}
                  fill={P.purple} opacity={rho * 0.6} />
              );
            }))}
          </g>

          {/* Egg-box effect */}
          <g opacity={ease(clamp01((t - 0.60) * 4))}>
            <text x={gridCx} y={gridCy + gridSize / 2 + 25} textAnchor="middle" fill={P.pink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Egg-box Effect</text>
            {/* Wavy energy line */}
            <g>
              <line x1={gridCx - 120} y1={gridCy + gridSize / 2 + 55}
                x2={gridCx - 120} y2={gridCy + gridSize / 2 + 105} stroke={P.muted} strokeWidth="1" />
              <line x1={gridCx - 120} y1={gridCy + gridSize / 2 + 105}
                x2={gridCx + 120} y2={gridCy + gridSize / 2 + 105} stroke={P.muted} strokeWidth="1" />
              <text x={gridCx} y={gridCy + gridSize / 2 + 118} textAnchor="middle" fill={P.muted} fontSize="7.5"
                fontFamily="'Inter',sans-serif">Atom position within grid cell</text>
              {/* Coarse: wavy */}
              {Array.from({ length: 60 }, (_, i) => {
                if (i === 59) return null;
                const x0 = -1 + (i / 59) * 2;
                const x1 = -1 + ((i + 1) / 59) * 2;
                const y0c = Math.sin(x0 * Math.PI * 6) * 12 * (1 - precProgress);
                const y1c = Math.sin(x1 * Math.PI * 6) * 12 * (1 - precProgress);
                return (
                  <line key={i}
                    x1={gridCx - 110 + (i / 59) * 220}
                    y1={gridCy + gridSize / 2 + 80 - y0c}
                    x2={gridCx - 110 + ((i + 1) / 59) * 220}
                    y2={gridCy + gridSize / 2 + 80 - y1c}
                    stroke={precProgress < 0.5 ? P.warn : P.ok} strokeWidth="2" />
                );
              })}
            </g>
          </g>

          {/* PREC comparison boxes */}
          <g opacity={ease(clamp01((t - 0.80) * 4))}>
            {[
              { label: "Low", col: P.warn, desc: "fast, noisy forces" },
              { label: "Normal", col: P.amber, desc: "default" },
              { label: "Accurate", col: P.ok, desc: "recommended" },
            ].map((p, i) => (
              <g key={i}>
                <rect x={RX + 30 + i * 125} y={388} width={115} height={20} rx="4"
                  fill={p.col + "15"} stroke={p.col + "50"} strokeWidth="1" />
                <text x={RX + 87 + i * 125} y={402} textAnchor="middle" fill={p.col} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{p.label}: {p.desc}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // ── 9. IBRION & NSW ──────────────────────────────────────────────────
    case "ibrion": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "IBRION — Ionic Relaxation",       color: P.amber,  delay: 0.04 },
        { text: "NSW — Max Ionic Steps",           color: P.amber,  delay: 0.08 },
        { text: "",                                color: P.muted,  delay: 0.11 },
        { text: "IBRION=-1: no ionic update",      color: P.muted,  delay: 0.14 },
        { text: "  single-point calculation",      color: P.muted,  delay: 0.17 },
        { text: "",                                color: P.muted,  delay: 0.20 },
        { text: "IBRION=1: quasi-Newton (RMM)",    color: P.green,  delay: 0.23 },
        { text: "  uses Hessian matrix",           color: P.muted,  delay: 0.27 },
        { text: "  fast near minimum",             color: P.muted,  delay: 0.30 },
        { text: "",                                color: P.muted,  delay: 0.33 },
        { text: "IBRION=2: conjugate gradient",    color: P.blue,   delay: 0.36 },
        { text: "  robust, safe default",          color: P.muted,  delay: 0.40 },
        { text: "  good far from minimum",         color: P.muted,  delay: 0.43 },
        { text: "",                                color: P.muted,  delay: 0.46 },
        { text: "IBRION=5,6: finite differences",  color: P.purple, delay: 0.49 },
        { text: "  phonon frequencies",            color: P.muted,  delay: 0.53 },
        { text: "",                                color: P.muted,  delay: 0.56 },
        { text: "IBRION=0: molecular dynamics",    color: P.pink,   delay: 0.59 },
        { text: "  POTIM = timestep (fs)",         color: P.muted,  delay: 0.63 },
        { text: "  TEBEG/TEEND = temperature",     color: P.muted,  delay: 0.66 },
        { text: "",                                color: P.muted,  delay: 0.69 },
        { text: "NSW = max ionic steps",           color: P.teal,   delay: 0.72 },
        { text: "  NSW=0 → single point",          color: P.muted,  delay: 0.75 },
      ];

      // PES with optimization path
      const pesCx = RX + RW / 2, pesYt = 60, pesW = RW - 60, pesH = 130;
      const pesX0 = RX + 30;
      const pesFunc = (x) => {
        const nx = (x - pesX0) / pesW * 4 - 2;
        return pesYt + pesH - 20 - (pesH - 40) * Math.exp(-nx * nx) + nx * nx * 8;
      };

      // Optimization path points
      const optProgress = ease(clamp01((t - 0.30) * 1.5));
      const optPath = [
        { frac: 0.1 },
        { frac: 0.25 },
        { frac: 0.38 },
        { frac: 0.45 },
        { frac: 0.48 },
        { frac: 0.50 },
      ];

      // Atoms moving
      const atomProgress = ease(clamp01((t - 0.50) * 2));
      const baseAtoms = [
        { x0: RX + 90,  x1: RX + 110, y: 310 },
        { x0: RX + 190, x1: RX + 180, y: 300 },
        { x0: RX + 290, x1: RX + 270, y: 320 },
        { x0: RX + 140, x1: RX + 155, y: 360 },
        { x0: RX + 240, x1: RX + 230, y: 350 },
        { x0: RX + 340, x1: RX + 320, y: 340 },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>IBRION &amp; NSW — Ionic Relaxation</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 15.5} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={pesCx} y={52} textAnchor="middle" fill={P.amber} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            Potential Energy Surface Optimization
          </text>

          {/* PES curve */}
          <g opacity={ease(clamp01((t - 0.12) * 5))}>
            <line x1={pesX0} y1={pesYt + pesH} x2={pesX0 + pesW} y2={pesYt + pesH} stroke={P.muted} strokeWidth="1" />
            <line x1={pesX0} y1={pesYt} x2={pesX0} y2={pesYt + pesH} stroke={P.muted} strokeWidth="1" />
            <text x={pesCx} y={pesYt + pesH + 15} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">Ionic coordinate</text>
            {Array.from({ length: 80 }, (_, i) => {
              if (i === 79) return null;
              const x0 = pesX0 + (i / 79) * pesW;
              const x1p = pesX0 + ((i + 1) / 79) * pesW;
              return (
                <line key={i} x1={x0} y1={pesFunc(x0)} x2={x1p} y2={pesFunc(x1p)}
                  stroke={P.green} strokeWidth="2" />
              );
            })}
          </g>

          {/* Optimization path dots */}
          <g opacity={ease(clamp01((t - 0.25) * 5))}>
            {optPath.map((pt, i) => {
              const visible = optProgress * optPath.length;
              if (i > visible) return null;
              const px = pesX0 + pt.frac * pesW;
              const py = pesFunc(px);
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r={5} fill={i === optPath.length - 1 && visible > optPath.length - 0.5 ? P.ok : P.amber} />
                  {i > 0 && (
                    <line x1={pesX0 + optPath[i - 1].frac * pesW} y1={pesFunc(pesX0 + optPath[i - 1].frac * pesW)}
                      x2={px} y2={py} stroke={P.amber} strokeWidth="1.5" strokeDasharray="3,2" />
                  )}
                </g>
              );
            })}
            <text x={pesX0 + 0.5 * pesW + 15} y={pesFunc(pesX0 + 0.5 * pesW) - 8} fill={P.ok} fontSize="8" fontWeight="700"
              fontFamily="'Inter',sans-serif" opacity={optProgress > 0.9 ? 1 : 0}>minimum</text>
          </g>

          {/* Method comparison */}
          <g opacity={ease(clamp01((t - 0.45) * 4))}>
            <text x={pesCx} y={215} textAnchor="middle" fill={P.purple} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Method Comparison</text>
            {[
              { name: "CG (IBRION=2)", desc: "safe, robust, zigzag path", col: P.blue },
              { name: "quasi-Newton (1)", desc: "fast near min, uses Hessian", col: P.green },
              { name: "MD (IBRION=0)", desc: "dynamics, explores phase space", col: P.pink },
            ].map((m, i) => (
              <g key={i}>
                <circle cx={RX + 45} cy={235 + i * 22} r={4} fill={m.col} />
                <text x={RX + 55} y={239 + i * 22} fill={m.col} fontSize="9" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{m.name}</text>
                <text x={RX + 200} y={239 + i * 22} fill={P.muted} fontSize="8.5"
                  fontFamily="'Inter',sans-serif">{m.desc}</text>
              </g>
            ))}
          </g>

          {/* Atoms moving toward equilibrium */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <text x={pesCx} y={305} textAnchor="middle" fill={P.teal} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Atoms Relaxing (forces → 0)</text>
            {baseAtoms.map((atom, i) => {
              const cx = lerp(atom.x0, atom.x1, atomProgress);
              const fLen = 20 * (1 - atomProgress);
              const fAngle = Math.atan2(atom.x1 - atom.x0, 0) + Math.PI / 2;
              return (
                <g key={i}>
                  <circle cx={cx} cy={atom.y} r={10} fill={P.blue + "28"} stroke={P.blue} strokeWidth="1.5" />
                  {fLen > 2 && (
                    <line x1={cx} y1={atom.y} x2={cx + fLen * Math.cos(fAngle)} y2={atom.y + fLen * Math.sin(fAngle)}
                      stroke={P.red} strokeWidth="1.5" />
                  )}
                </g>
              );
            })}
            <text x={pesCx} y={395} textAnchor="middle"
              fill={atomProgress > 0.9 ? P.ok : P.muted} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">
              NSW step {Math.floor(atomProgress * 20) + 1}/20 {atomProgress > 0.9 ? "— CONVERGED" : ""}
            </text>
          </g>
        </svg>
      );
    }

    // ── 10. LREAL ────────────────────────────────────────────────────────
    case "lreal": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "LREAL — Projection Space",        color: P.purple, delay: 0.04 },
        { text: "",                                color: P.muted,  delay: 0.07 },
        { text: "PAW projectors can be evaluated", color: P.blue,   delay: 0.10 },
        { text: "in real or reciprocal space:",    color: P.blue,   delay: 0.13 },
        { text: "",                                color: P.muted,  delay: 0.16 },
        { text: "LREAL=.FALSE.",                   color: P.green,  delay: 0.19 },
        { text: "  reciprocal space projection",   color: P.muted,  delay: 0.23 },
        { text: "  exact, no approximation",       color: P.muted,  delay: 0.26 },
        { text: "  O(N_pw × N_proj) per atom",     color: P.muted,  delay: 0.29 },
        { text: "  best for small cells (<20 at)", color: P.ok,     delay: 0.33 },
        { text: "",                                color: P.muted,  delay: 0.36 },
        { text: "LREAL=Auto:",                     color: P.amber,  delay: 0.39 },
        { text: "  real space projection",         color: P.muted,  delay: 0.43 },
        { text: "  O(N_grid_local) per atom",      color: P.muted,  delay: 0.46 },
        { text: "  faster for large cells",        color: P.muted,  delay: 0.49 },
        { text: "  slight approximation error",    color: P.warn,   delay: 0.53 },
        { text: "",                                color: P.muted,  delay: 0.56 },
        { text: "LREAL=On: user-set cutoff",       color: P.muted,  delay: 0.59 },
        { text: "",                                color: P.muted,  delay: 0.62 },
        { text: "Crossover: ~20 atoms",            color: P.pink,   delay: 0.65 },
        { text: "  <20: LREAL=.FALSE.",             color: P.green,  delay: 0.69 },
        { text: "  >20: LREAL=Auto",               color: P.amber,  delay: 0.72 },
      ];

      const plotCx = RX + RW / 2;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>LREAL — Real vs Reciprocal Projectors</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={plotCx} y={52} textAnchor="middle" fill={P.purple} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            Projector Functions
          </text>

          {/* Real space projector */}
          <g opacity={ease(clamp01((t - 0.15) * 5))}>
            <text x={RX + RW / 4} y={72} textAnchor="middle" fill={P.green} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Real Space</text>
            <rect x={RX + 30} y={78} width={RW / 2 - 40} height={100} rx="5"
              fill={P.panel} stroke={P.green + "40"} strokeWidth="1" />
            {/* Localized projector function */}
            {Array.from({ length: 60 }, (_, i) => {
              if (i === 59) return null;
              const x0 = (i / 59) * 2 - 1;
              const x1 = ((i + 1) / 59) * 2 - 1;
              const y0 = Math.exp(-x0 * x0 * 8) * Math.cos(x0 * 8) * 30;
              const y1 = Math.exp(-x1 * x1 * 8) * Math.cos(x1 * 8) * 30;
              const pw = (RW / 2 - 40);
              return (
                <line key={i}
                  x1={RX + 30 + (i / 59) * pw} y1={128 - y0}
                  x2={RX + 30 + ((i + 1) / 59) * pw} y2={128 - y1}
                  stroke={P.green} strokeWidth="2" />
              );
            })}
            <text x={RX + RW / 4} y={192} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">Localized, decays to 0</text>
          </g>

          {/* Reciprocal space projector */}
          <g opacity={ease(clamp01((t - 0.30) * 5))}>
            <text x={RX + 3 * RW / 4} y={72} textAnchor="middle" fill={P.blue} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Reciprocal Space</text>
            <rect x={RX + RW / 2 + 10} y={78} width={RW / 2 - 40} height={100} rx="5"
              fill={P.panel} stroke={P.blue + "40"} strokeWidth="1" />
            {/* Extended projector in k-space */}
            {Array.from({ length: 60 }, (_, i) => {
              if (i === 59) return null;
              const x0 = (i / 59) * 2 - 1;
              const x1 = ((i + 1) / 59) * 2 - 1;
              const y0 = (Math.sin(x0 * 12) / (x0 * 12 + 0.001) + 0.3) * 25;
              const y1 = (Math.sin(x1 * 12) / (x1 * 12 + 0.001) + 0.3) * 25;
              const pw = (RW / 2 - 40);
              return (
                <line key={i}
                  x1={RX + RW / 2 + 10 + (i / 59) * pw} y1={128 - y0}
                  x2={RX + RW / 2 + 10 + ((i + 1) / 59) * pw} y2={128 - y1}
                  stroke={P.blue} strokeWidth="2" />
              );
            })}
            <text x={RX + 3 * RW / 4} y={192} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">Extended, sinc-like</text>
          </g>

          {/* Cost scaling comparison */}
          <g opacity={ease(clamp01((t - 0.50) * 4))}>
            <text x={plotCx} y={220} textAnchor="middle" fill={P.pink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Cost vs System Size</text>
            {/* Cost curves */}
            <line x1={RX + 50} y1={235} x2={RX + 50} y2={340} stroke={P.muted} strokeWidth="1" />
            <line x1={RX + 50} y1={340} x2={RX + RW - 30} y2={340} stroke={P.muted} strokeWidth="1" />
            <text x={plotCx} y={355} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">Number of atoms</text>
            {/* Reciprocal: steeper */}
            {Array.from({ length: 50 }, (_, i) => {
              if (i === 49) return null;
              const x0 = i / 49;
              const x1 = (i + 1) / 49;
              const cw = RW - 80;
              const y0 = 340 - x0 * x0 * 95;
              const y1 = 340 - x1 * x1 * 95;
              return (
                <line key={`r-${i}`}
                  x1={RX + 50 + x0 * cw} y1={y0}
                  x2={RX + 50 + x1 * cw} y2={y1}
                  stroke={P.blue} strokeWidth="2" />
              );
            })}
            {/* Real: linear */}
            {Array.from({ length: 50 }, (_, i) => {
              if (i === 49) return null;
              const x0 = i / 49;
              const x1 = (i + 1) / 49;
              const cw = RW - 80;
              const y0 = 340 - x0 * 60;
              const y1 = 340 - x1 * 60;
              return (
                <line key={`a-${i}`}
                  x1={RX + 50 + x0 * cw} y1={y0}
                  x2={RX + 50 + x1 * cw} y2={y1}
                  stroke={P.green} strokeWidth="2" strokeDasharray="5,2" />
              );
            })}
            {/* Crossover */}
            <line x1={RX + 50 + 0.35 * (RW - 80)} y1={235}
              x2={RX + 50 + 0.35 * (RW - 80)} y2={340}
              stroke={P.pink} strokeWidth="1" strokeDasharray="4,3" />
            <text x={RX + 50 + 0.35 * (RW - 80)} y={232} textAnchor="middle" fill={P.pink} fontSize="8" fontWeight="700"
              fontFamily="'Inter',sans-serif">~20 atoms</text>
            {/* Legend */}
            <line x1={RX + RW - 140} y1={248} x2={RX + RW - 120} y2={248} stroke={P.blue} strokeWidth="2" />
            <text x={RX + RW - 115} y={252} fill={P.blue} fontSize="8" fontFamily="'Inter',sans-serif">reciprocal</text>
            <line x1={RX + RW - 140} y1={262} x2={RX + RW - 120} y2={262} stroke={P.green} strokeWidth="2" strokeDasharray="5,2" />
            <text x={RX + RW - 115} y={266} fill={P.green} fontSize="8" fontFamily="'Inter',sans-serif">real space</text>
          </g>

          {/* Recommendation */}
          <g opacity={ease(clamp01((t - 0.80) * 4))}>
            <rect x={RX + 30} y={365} width={RW - 60} height={40} rx="6"
              fill={P.ok + "10"} stroke={P.ok + "40"} strokeWidth="1.5" />
            <text x={plotCx} y={382} textAnchor="middle" fill={P.ok} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">&lt;20 atoms: LREAL=.FALSE. | &gt;20 atoms: LREAL=Auto</text>
            <text x={plotCx} y={398} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">LREAL=Auto is safe for relaxation, less so for phonons</text>
          </g>
        </svg>
      );
    }

    // ── 11. OUTPUT FLAGS ─────────────────────────────────────────────────
    case "output": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "LORBIT, LWAVE, LCHARG",           color: P.teal,   delay: 0.04 },
        { text: "— Output Control Flags",          color: P.teal,   delay: 0.08 },
        { text: "",                                color: P.muted,  delay: 0.11 },
        { text: "LORBIT=11:",                      color: P.blue,   delay: 0.14 },
        { text: "  projected DOS (DOSCAR, vasprun)", color: P.muted, delay: 0.18 },
        { text: "  s, p, d orbital contributions", color: P.muted,  delay: 0.21 },
        { text: "  per-atom decomposition",        color: P.muted,  delay: 0.24 },
        { text: "",                                color: P.muted,  delay: 0.27 },
        { text: "LWAVE=.TRUE.:",                   color: P.green,  delay: 0.30 },
        { text: "  writes WAVECAR file",           color: P.muted,  delay: 0.34 },
        { text: "  needed for: band structure,",   color: P.muted,  delay: 0.37 },
        { text: "  GW, exact exchange, restart",   color: P.muted,  delay: 0.40 },
        { text: "  WARNING: large file!",          color: P.warn,   delay: 0.44 },
        { text: "",                                color: P.muted,  delay: 0.47 },
        { text: "LCHARG=.TRUE.:",                  color: P.purple, delay: 0.50 },
        { text: "  writes CHGCAR file",            color: P.muted,  delay: 0.54 },
        { text: "  charge density n(r)",           color: P.muted,  delay: 0.57 },
        { text: "  useful for Bader analysis",     color: P.muted,  delay: 0.60 },
        { text: "  and charge density plots",      color: P.muted,  delay: 0.63 },
        { text: "",                                color: P.muted,  delay: 0.66 },
        { text: "NEDOS=2001: DOS grid points",     color: P.amber,  delay: 0.69 },
      ];

      const plotCx = RX + RW / 2;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Output Flags — LORBIT, LWAVE, LCHARG</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX + 10} y={50 + i * 16} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={plotCx} y={52} textAnchor="middle" fill={P.teal} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            DFT Output Files
          </text>

          {/* DOS Plot materializing */}
          <g opacity={ease(clamp01((t - 0.15) * 5))}>
            <rect x={RX + 20} y={60} width={RW / 2 - 25} height={120} rx="6"
              fill={P.panel} stroke={P.blue + "40"} strokeWidth="1" />
            <text x={RX + 20 + (RW / 2 - 25) / 2} y={78} textAnchor="middle" fill={P.blue} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Projected DOS (LORBIT=11)</text>
            {/* DOS curve */}
            <line x1={RX + 30} y1={90} x2={RX + 30} y2={168} stroke={P.muted} strokeWidth="0.8" />
            <line x1={RX + 30} y1={168} x2={RX + RW / 2 - 15} y2={168} stroke={P.muted} strokeWidth="0.8" />
            {/* s orbital */}
            {Array.from({ length: 40 }, (_, i) => {
              if (i === 39) return null;
              const x0 = i / 39, x1p = (i + 1) / 39;
              const pw = RW / 2 - 55;
              const y0 = Math.exp(-((x0 - 0.3) ** 2) / 0.01) * 30 + Math.exp(-((x0 - 0.7) ** 2) / 0.02) * 20;
              const y1 = Math.exp(-((x1p - 0.3) ** 2) / 0.01) * 30 + Math.exp(-((x1p - 0.7) ** 2) / 0.02) * 20;
              const revealP = ease(clamp01((t - 0.18) * 3));
              return i / 39 < revealP ? (
                <line key={`s-${i}`} x1={RX + 35 + x0 * pw} y1={165 - y0} x2={RX + 35 + x1p * pw} y2={165 - y1}
                  stroke={P.blue} strokeWidth="1.5" />
              ) : null;
            })}
            {/* p orbital */}
            {Array.from({ length: 40 }, (_, i) => {
              if (i === 39) return null;
              const x0 = i / 39, x1p = (i + 1) / 39;
              const pw = RW / 2 - 55;
              const y0 = Math.exp(-((x0 - 0.35) ** 2) / 0.015) * 40 + Math.exp(-((x0 - 0.75) ** 2) / 0.01) * 15;
              const y1 = Math.exp(-((x1p - 0.35) ** 2) / 0.015) * 40 + Math.exp(-((x1p - 0.75) ** 2) / 0.01) * 15;
              const revealP = ease(clamp01((t - 0.25) * 3));
              return i / 39 < revealP ? (
                <line key={`p-${i}`} x1={RX + 35 + x0 * pw} y1={165 - y0} x2={RX + 35 + x1p * pw} y2={165 - y1}
                  stroke={P.green} strokeWidth="1.5" />
              ) : null;
            })}
            <text x={RX + 45} y={100} fill={P.blue} fontSize="7" fontFamily="'Inter',sans-serif">s</text>
            <text x={RX + 65} y={95} fill={P.green} fontSize="7" fontFamily="'Inter',sans-serif">p</text>
          </g>

          {/* Charge density isosurface */}
          <g opacity={ease(clamp01((t - 0.40) * 4))}>
            <rect x={RX + RW / 2 + 5} y={60} width={RW / 2 - 25} height={120} rx="6"
              fill={P.panel} stroke={P.purple + "40"} strokeWidth="1" />
            <text x={RX + 3 * RW / 4 - 5} y={78} textAnchor="middle" fill={P.purple} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Charge Density (CHGCAR)</text>
            {/* Isosurface representation */}
            {[0.9, 0.7, 0.5, 0.3].map((op, i) => {
              const cxp = RX + 3 * RW / 4 - 5;
              const cyp = 130;
              const r = 15 + i * 12;
              const revealP = ease(clamp01((t - 0.43 - i * 0.05) * 4));
              return (
                <ellipse key={i} cx={cxp} cy={cyp} rx={r * 1.2} ry={r * 0.8}
                  fill="none" stroke={P.purple} strokeWidth="1.5"
                  opacity={revealP * op * 0.5} />
              );
            })}
            <circle cx={RX + 3 * RW / 4 - 25} cy={130} r={6} fill={P.red + "50"} stroke={P.red} strokeWidth="1.5" />
            <circle cx={RX + 3 * RW / 4 + 15} cy={130} r={6} fill={P.blue + "50"} stroke={P.blue} strokeWidth="1.5" />
            <text x={RX + 3 * RW / 4 - 5} y={170} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">n(r) isosurface</text>
          </g>

          {/* WAVECAR / band structure */}
          <g opacity={ease(clamp01((t - 0.55) * 4))}>
            <rect x={RX + 20} y={195} width={RW - 40} height={95} rx="6"
              fill={P.panel} stroke={P.green + "40"} strokeWidth="1" />
            <text x={plotCx} y={213} textAnchor="middle" fill={P.green} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Band Structure from WAVECAR (LWAVE=.TRUE.)</text>
            {/* Mini band structure */}
            <line x1={RX + 40} y1={225} x2={RX + 40} y2={280} stroke={P.muted} strokeWidth="0.8" />
            <line x1={RX + 40} y1={280} x2={RX + RW - 40} y2={280} stroke={P.muted} strokeWidth="0.8" />
            {/* Valence bands */}
            {[0, 1, 2].map((bi) => (
              <path key={`vb-${bi}`}
                d={`M${RX + 40},${265 - bi * 8} Q${plotCx},${255 - bi * 8} ${RX + RW - 40},${268 - bi * 8}`}
                fill="none" stroke={P.purple} strokeWidth="1.5" opacity={ease(clamp01((t - 0.60 - bi * 0.03) * 4))} />
            ))}
            {/* Conduction bands */}
            {[0, 1].map((bi) => (
              <path key={`cb-${bi}`}
                d={`M${RX + 40},${240 - bi * 8} Q${plotCx},${232 - bi * 8} ${RX + RW - 40},${238 - bi * 8}`}
                fill="none" stroke={P.blue} strokeWidth="1.5" opacity={ease(clamp01((t - 0.65 - bi * 0.03) * 4))} />
            ))}
            {["\u0393", "X", "M", "\u0393"].map((lbl, i) => (
              <text key={i} x={RX + 40 + i * ((RW - 80) / 3)} y={290} textAnchor="middle" fill={P.muted}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">{lbl}</text>
            ))}
          </g>

          {/* Output files table */}
          <g opacity={ease(clamp01((t - 0.75) * 4))}>
            <rect x={RX + 20} y={300} width={RW - 40} height={105} rx="6"
              fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={plotCx} y={318} textAnchor="middle" fill={P.amber} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Key Output Files</text>
            {[
              { file: "DOSCAR", flag: "LORBIT=11", size: "~1 MB", col: P.blue },
              { file: "WAVECAR", flag: "LWAVE=.TRUE.", size: "~1 GB!", col: P.green },
              { file: "CHGCAR", flag: "LCHARG=.TRUE.", size: "~50 MB", col: P.purple },
              { file: "vasprun.xml", flag: "always", size: "~10 MB", col: P.teal },
            ].map((f, i) => (
              <g key={i}>
                <text x={RX + 35} y={338 + i * 16} fill={f.col} fontSize="9" fontWeight="700"
                  fontFamily="'Fira Code','Consolas',monospace">{f.file}</text>
                <text x={RX + 160} y={338 + i * 16} fill={P.muted} fontSize="8.5"
                  fontFamily="'Inter',sans-serif">{f.flag}</text>
                <text x={RX + RW - 45} y={338 + i * 16} textAnchor="end" fill={P.dim} fontSize="8"
                  fontFamily="'Inter',sans-serif">{f.size}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // ── 12. SUMMARY — INCAR RECIPE ───────────────────────────────────────
    case "summary": {
      const tOp = ease(clamp01(t * 4));

      // INCAR file content
      const incarLines = [
        { text: "# === INCAR Recipe ===",            cat: "header",  delay: 0.04 },
        { text: "",                                  cat: "blank",   delay: 0.06 },
        { text: "# Basis set",                      cat: "basis",   delay: 0.08 },
        { text: "ENCUT  = 520",                      cat: "basis",   delay: 0.11 },
        { text: "PREC   = Accurate",                 cat: "basis",   delay: 0.14 },
        { text: "",                                  cat: "blank",   delay: 0.16 },
        { text: "# SCF convergence",                cat: "scf",     delay: 0.18 },
        { text: "ALGO   = Fast",                     cat: "scf",     delay: 0.21 },
        { text: "EDIFF  = 1E-6",                     cat: "scf",     delay: 0.24 },
        { text: "NELM   = 200",                      cat: "scf",     delay: 0.27 },
        { text: "",                                  cat: "blank",   delay: 0.29 },
        { text: "# Smearing",                       cat: "smear",   delay: 0.31 },
        { text: "ISMEAR = 0",                        cat: "smear",   delay: 0.34 },
        { text: "SIGMA  = 0.05",                     cat: "smear",   delay: 0.37 },
        { text: "",                                  cat: "blank",   delay: 0.39 },
        { text: "# Ionic relaxation",               cat: "ionic",   delay: 0.41 },
        { text: "IBRION = 2",                        cat: "ionic",   delay: 0.44 },
        { text: "NSW    = 100",                      cat: "ionic",   delay: 0.47 },
        { text: "EDIFFG = -0.02",                    cat: "ionic",   delay: 0.50 },
        { text: "",                                  cat: "blank",   delay: 0.52 },
        { text: "# Projectors",                     cat: "proj",    delay: 0.54 },
        { text: "LREAL  = Auto",                     cat: "proj",    delay: 0.57 },
        { text: "",                                  cat: "blank",   delay: 0.59 },
        { text: "# Output",                         cat: "output",  delay: 0.61 },
        { text: "LORBIT = 11",                       cat: "output",  delay: 0.64 },
        { text: "LWAVE  = .FALSE.",                  cat: "output",  delay: 0.67 },
        { text: "LCHARG = .TRUE.",                   cat: "output",  delay: 0.70 },
      ];

      const catColors = {
        header: P.ink,
        basis: P.amber,
        scf: P.purple,
        smear: P.pink,
        ionic: P.green,
        proj: P.teal,
        output: P.blue,
        blank: P.muted,
      };

      const plotCx = RX + RW / 2;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>INCAR Recipe — Complete Parameter Set</text>
          <line x1={LW + 20} y1={32} x2={LW + 20} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.6} />

          {/* LEFT: INCAR file */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={LX + LW / 2} y={48} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={tOp}>INCAR</text>
          {incarLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            const col = catColors[ln.cat] || P.muted;
            const isComment = ln.text.startsWith("#");
            return (
              <text key={i} x={LX + 12} y={62 + i * 13} fill={isComment ? P.muted : col} fontSize="9.5"
                fontWeight={isComment ? 400 : 600}
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />
          <text x={plotCx} y={52} textAnchor="middle" fill={P.ok} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t - 0.05) * 5))}>
            Convergence Testing Workflow
          </text>

          {/* Flowchart */}
          {(() => {
            const steps = [
              { label: "1. Converge ENCUT", sub: "fix k-points, vary ENCUT", col: P.amber, y: 70 },
              { label: "2. Converge KPOINTS", sub: "fix ENCUT, vary k-mesh", col: P.green, y: 120 },
              { label: "3. Set ISMEAR/SIGMA", sub: "metal vs insulator", col: P.pink, y: 170 },
              { label: "4. Choose ALGO", sub: "Fast (default) or All (hybrid)", col: P.purple, y: 220 },
              { label: "5. Set EDIFF/EDIFFG", sub: "1E-6 / -0.02 typical", col: P.blue, y: 270 },
              { label: "6. Production Run", sub: "IBRION=2, NSW=100", col: P.ok, y: 320 },
            ];
            return steps.map((step, i) => {
              const op = ease(clamp01((t - 0.12 - i * 0.08) * 5));
              const bw = RW - 60;
              return (
                <g key={i} opacity={op}>
                  <rect x={RX + 30} y={step.y} width={bw} height={38} rx="6"
                    fill={step.col + "15"} stroke={step.col + "50"} strokeWidth="1.5" />
                  <text x={RX + 42} y={step.y + 16} fill={step.col} fontSize="10" fontWeight="700"
                    fontFamily="'Inter',sans-serif">{step.label}</text>
                  <text x={RX + 42} y={step.y + 30} fill={P.muted} fontSize="8"
                    fontFamily="'Inter',sans-serif">{step.sub}</text>
                  {i > 0 && (
                    <line x1={plotCx} y1={step.y - 12} x2={plotCx} y2={step.y}
                      stroke={step.col + "60"} strokeWidth="1.5" />
                  )}
                  {i > 0 && (
                    <polygon points={`${plotCx - 4},${step.y} ${plotCx + 4},${step.y} ${plotCx},${step.y + 5}`}
                      fill={step.col + "60"} transform={`translate(0,-5)`} />
                  )}
                </g>
              );
            });
          })()}

          {/* Key message */}
          <g opacity={ease(clamp01((t - 0.80) * 4))}>
            <rect x={RX + 20} y={370} width={RW - 40} height={38} rx="6"
              fill={P.ok + "12"} stroke={P.ok + "50"} strokeWidth="1.5" />
            <text x={plotCx} y={388} textAnchor="middle" fill={P.ok} fontSize="11" fontWeight="800"
              fontFamily="'Inter',sans-serif">Always converge ENCUT &amp; KPOINTS first!</text>
            <text x={plotCx} y={402} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">Then tune smearing, algorithm, and output flags</text>
          </g>
        </svg>
      );
    }

    default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════════════════
  const totalDuration  = SCENES.reduce((s, sc) => s + sc.duration, 0);
  const elapsed        = SCENES.slice(0, sceneIdx).reduce((s, sc) => s + sc.duration, 0) + progress * scene.duration;
  const globalProgress = elapsed / totalDuration;

  return (
    <div style={{ width: "100%", padding: "4px 0", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
        aspectRatio: "16/9",
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "layout paint",
      }}>
        <div style={{ position: "absolute", top: 10, left: 14, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: P.blue + "25", border: `1px solid ${P.blue}50`, padding: "3px 10px",
            borderRadius: 6, fontSize: 10, fontWeight: 700, color: P.blue, letterSpacing: 1 }}>
            Scene {sceneIdx + 1}/{SCENES.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{scene.label}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 14, zIndex: 2, fontSize: 11, color: "#fff", fontWeight: 600, opacity: 0.65 }}>
          Habibur Rahman · rahma103@purdue.edu
        </div>
        <div style={{ opacity: fadeOpacity, transition: "opacity 0.25s ease-in-out", willChange: "opacity" }}>
          {renderScene()}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: P.dim + "30" }}>
          <div style={{ height: "100%", background: P.blue, width: `${progress * 100}%`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: P.panel, padding: "10px 14px", borderRadius: 12, border: `1px solid ${P.border}` }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.blue}`,
          background: P.blue + "15", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18, color: P.blue, fontWeight: 900, fontFamily: "inherit",
        }}>
          {playing ? "\u23F8" : (sceneIdx === SCENES.length - 1 && progress >= 1) ? "\u21BB" : "\u25B6"}
        </button>
        <button onClick={prevScene} disabled={sceneIdx === 0} style={{
          padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`,
          background: "transparent", cursor: sceneIdx > 0 ? "pointer" : "default",
          color: sceneIdx > 0 ? P.ink : P.dim, fontSize: 13, fontWeight: 700,
          fontFamily: "inherit", opacity: sceneIdx > 0 ? 1 : 0.4,
        }}>{"\u2190"}</button>
        <button onClick={nextScene} disabled={sceneIdx === SCENES.length - 1} style={{
          padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`,
          background: "transparent", cursor: sceneIdx < SCENES.length - 1 ? "pointer" : "default",
          color: sceneIdx < SCENES.length - 1 ? P.ink : P.dim, fontSize: 13, fontWeight: 700,
          fontFamily: "inherit", opacity: sceneIdx < SCENES.length - 1 ? 1 : 0.4,
        }}>{"\u2192"}</button>

        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ height: 6, background: P.dim + "30", borderRadius: 3, position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              let accum = 0;
              for (let i = 0; i < SCENES.length; i++) {
                const frac = SCENES[i].duration / totalDuration;
                if (accum + frac >= ratio) { goScene(i); break; }
                accum += frac;
              }
            }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${P.blue}, ${P.purple}, ${P.green})`, width: `${globalProgress * 100}%`, borderRadius: 3 }} />
            {SCENES.map((_, i) => {
              const pos = SCENES.slice(0, i).reduce((s, sc) => s + sc.duration, 0) / totalDuration;
              return i > 0 ? (
                <div key={i} style={{ position: "absolute", left: `${pos * 100}%`, top: -2, width: 1, height: 10, background: P.dim }} />
              ) : null;
            })}
          </div>
        </div>
        <span style={{ fontSize: 10, color: P.muted, fontFamily: "monospace", minWidth: 60, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {Math.floor(elapsed / 1000)}s / {Math.floor(totalDuration / 1000)}s
        </span>
      </div>

      {/* Scene chips */}
      <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.blue + "20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.blue : P.border}`,
            color: i === sceneIdx ? P.blue : i < sceneIdx ? P.green : P.muted,
            fontWeight: i === sceneIdx ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
