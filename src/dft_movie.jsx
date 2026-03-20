import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DFT BASICS MOVIE — Density Functional Theory walkthrough (detailed v2)
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
  { id: "title",          label: "DFT",                  duration: 4500 },
  { id: "many_body",      label: "Many-Body Problem",   duration: 8000 },
  { id: "born_opp",       label: "Born-Oppenheimer",    duration: 7000 },
  { id: "hohenberg_kohn", label: "Hohenberg-Kohn",      duration: 8500 },
  { id: "kohn_sham",      label: "Kohn-Sham Equations", duration: 9000 },
  { id: "xc_functional",  label: "XC Functional",       duration: 8000 },
  { id: "scf_cycle",      label: "SCF Cycle",           duration: 9000 },
  { id: "basis_sets",     label: "Basis Sets",          duration: 8000 },
  { id: "output",         label: "DFT Outputs",         duration: 8000 },
];

const ease    = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const lerp    = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function DFTMovieModule() {
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
    const W = 560, H = 420;
    const LX = 10, LW = 248, RX = 268, RW = 280;

    switch (scene.id) {

    // ── 1. TITLE ─────────────────────────────────────────────────────────
    case "title": {
      const tOp  = ease(clamp01(t * 3));
      const sOp  = ease(clamp01((t - 0.25) * 3));
      const aOp  = ease(clamp01((t - 0.50) * 3));
      const eqOp = ease(clamp01((t - 0.72) * 4));

      // Orbiting electron angle
      const eAngle = t * Math.PI * 4;
      const eOrbitRx = 55, eOrbitRy = 22;
      const atomCy = 175;
      const ex = W/2 + eOrbitRx * Math.cos(eAngle);
      const ey = atomCy + eOrbitRy * Math.sin(eAngle);

      // Density cloud circles (|psi|^2)
      const cloudRadii = [14, 24, 36, 48, 60];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Grid lines */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={0} y1={i*30} x2={W} y2={i*30} stroke={P.dim} strokeWidth="0.3" opacity={0.12} />
          ))}

          {/* Density cloud */}
          {cloudRadii.map((r, i) => (
            <circle key={i} cx={W/2} cy={atomCy} r={r}
              fill="none" stroke={P.blue}
              strokeWidth={i === 0 ? 1.5 : 0.8}
              opacity={tOp * (0.30 - i * 0.04)} />
          ))}

          {/* Orbital ellipses (3 planes) */}
          {[0, 60, 120].map((rot, i) => (
            <ellipse key={i} cx={W/2} cy={atomCy}
              rx={eOrbitRx} ry={eOrbitRy}
              fill="none" stroke={P.blue} strokeWidth="0.8"
              opacity={tOp * 0.25}
              transform={`rotate(${rot} ${W/2} ${atomCy})`} />
          ))}

          {/* Nucleus */}
          <circle cx={W/2} cy={atomCy} r={8} fill={P.red} opacity={tOp * 0.9} />
          <text x={W/2} y={atomCy+4} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>+</text>

          {/* Orbiting electron */}
          <circle cx={ex} cy={ey} r={4} fill={P.blue} opacity={tOp * 0.95} />
          <circle cx={ex} cy={ey} r={7} fill="none" stroke={P.blue} strokeWidth="1" opacity={tOp * 0.35} />

          {/* Title */}
          <text x={W/2} y={52} textAnchor="middle" fill={P.ink} fontSize="28" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Density Functional Theory</text>

          {/* Animated underline */}
          <rect x={W/2 - ease(clamp01((t-0.1)*3))*150} y={61}
            width={ease(clamp01((t-0.1)*3))*300} height={3} rx="1.5" fill={P.blue} opacity={tOp * 0.85} />

          <text x={W/2} y={82} textAnchor="middle" fill={P.muted} fontSize="13"
            fontFamily="'Inter',sans-serif" opacity={sOp}>
            From Many-Body Problem to Practical Calculation
          </text>

          {/* KS equation box — large prominent block */}
          <rect x={W/2-260} y={235} width={520} height={130} rx="14"
            fill={P.surface} stroke={P.border} strokeWidth="1.5" opacity={eqOp} />
          <rect x={W/2-260} y={235} width={520} height={4} rx="2" fill={P.purple} opacity={eqOp} />
          <text x={W/2} y={260} textAnchor="middle" fill={P.purple} fontSize="12" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={eqOp}>Kohn-Sham Equation — The Heart of DFT</text>
          <text x={W/2} y={292} textAnchor="middle" fill={P.green} fontSize="16" fontWeight="700"
            fontFamily="'Fira Code','Consolas',monospace" opacity={eqOp}>{"[-½∇² + v_ext(r) + v_H(r) + v_xc(r)] φᵢ(r) = εᵢ φᵢ(r)"}</text>
          <line x1={W/2-220} y1={308} x2={W/2+220} y2={308} stroke={P.border} strokeWidth="0.8" opacity={eqOp * 0.5} />
          <text x={W/2-150} y={326} fill={P.amber} fontSize="9.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.9}>v_ext = nuclear pull</text>
          <text x={W/2-10} y={326} fill={P.blue} fontSize="9.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.9}>v_H = e⁻ repulsion</text>
          <text x={W/2+135} y={326} fill={P.pink} fontSize="9.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.9}>v_xc = quantum fix</text>
          <text x={W/2} y={352} textAnchor="middle" fill={P.muted} fontSize="9.5"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.7}>Solve for each orbital φᵢ → get density → repeat until self-consistent</text>
        </svg>
      );
    }

    // ── 2. MANY-BODY PROBLEM ──────────────────────────────────────────────
    case "many_body": {
      const tOp = ease(clamp01(t * 4));

      const lines = [
        { text: "The Problem:",                    color: P.blue,   delay: 0.04 },
        { text: "Electrons and nuclei interact",   color: P.ink,    delay: 0.10 },
        { text: "through 4 types of forces:",      color: P.ink,    delay: 0.14 },
        { text: "",                                color: P.muted,  delay: 0.17 },
        { text: "1. Electrons move (kinetic E)",   color: P.green,  delay: 0.20 },
        { text: "",                                color: P.muted,  delay: 0.24 },
        { text: "2. Electrons repel each other",   color: P.warn,   delay: 0.27 },
        { text: "   (this is the HARD part!)",     color: P.warn,   delay: 0.31 },
        { text: "",                                color: P.muted,  delay: 0.34 },
        { text: "3. Nuclei attract electrons",     color: P.amber,  delay: 0.37 },
        { text: "",                                color: P.muted,  delay: 0.41 },
        { text: "4. Nuclei move (very slowly)",    color: P.purple, delay: 0.44 },
        { text: "",                                color: P.muted,  delay: 0.48 },
        { text: "To solve exactly, you need the",  color: P.ink,    delay: 0.52 },
        { text: "position of EVERY electron at",   color: P.ink,    delay: 0.56 },
        { text: "once: 3 coords × N electrons",    color: P.ink,    delay: 0.60 },
        { text: "",                                color: P.muted,  delay: 0.64 },
        { text: "N=10 → need ~10³⁰ numbers!",     color: P.red,    delay: 0.67 },
        { text: "This is completely impossible.",   color: P.red,    delay: 0.72 },
      ];

      const electrons = [
        { x: 55,  y: 95  },
        { x: 120, y: 75  },
        { x: 175, y: 105 },
        { x: 60,  y: 155 },
        { x: 140, y: 140 },
        { x: 195, y: 165 },
      ];
      const nuclei = [
        { x: 95,  y: 120, Z: "11" },
        { x: 160, y: 130, Z: "8"  },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>The Many-Body Problem</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {lines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={50 + i*18} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.blue} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            N electrons + M nuclei
          </text>

          {/* Box for particles */}
          <rect x={RX+15} y={58} width={RW-30} height={190} rx="6"
            fill="none" stroke={P.dim} strokeWidth="1" opacity={ease(clamp01((t-0.08)*5))*0.6} />

          {/* e-e repulsion arrows */}
          {electrons.map((e1, i) => electrons.map((e2, j) => {
            if (j <= i) return null;
            const op = ease(clamp01((t-0.32)*5)) * 0.3;
            return (
              <line key={`ee-${i}-${j}`}
                x1={RX+e1.x} y1={e1.y+58} x2={RX+e2.x} y2={e2.y+58}
                stroke={P.warn} strokeWidth="0.8" opacity={op} strokeDasharray="3,2" />
            );
          }))}

          {/* e-nucleus attraction arrows */}
          {electrons.map((e, i) => nuclei.map((n, j) => {
            const op = ease(clamp01((t-0.38)*5)) * 0.45;
            return (
              <line key={`en-${i}-${j}`}
                x1={RX+e.x} y1={e.y+58} x2={RX+n.x} y2={n.y+58}
                stroke={P.green} strokeWidth="0.9" opacity={op} strokeDasharray="2,3" />
            );
          }))}

          {/* Electrons */}
          {electrons.map((e, i) => {
            const op = ease(clamp01((t - 0.10 - i*0.05) * 5));
            return (
              <g key={i} opacity={op}>
                <circle cx={RX+e.x} cy={e.y+58} r={9} fill={P.blue+"28"} stroke={P.blue} strokeWidth="1.5" />
                <text x={RX+e.x} y={e.y+62} textAnchor="middle" fill={P.blue}
                  fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">e⁻</text>
              </g>
            );
          })}

          {/* Nuclei */}
          {nuclei.map((n, i) => {
            const op = ease(clamp01((t - 0.08 - i*0.08) * 5));
            return (
              <g key={i} opacity={op}>
                <circle cx={RX+n.x} cy={n.y+58} r={15} fill={P.red+"28"} stroke={P.red} strokeWidth="2" />
                <text x={RX+n.x} y={n.y+53} textAnchor="middle" fill={P.red}
                  fontSize="7" fontFamily="'Inter',sans-serif">Z={n.Z}</text>
                <text x={RX+n.x} y={n.y+65} textAnchor="middle" fill={P.red}
                  fontSize="10" fontWeight="800" fontFamily="'Inter',sans-serif">+</text>
              </g>
            );
          })}

          {/* Legend */}
          <g opacity={ease(clamp01((t-0.55)*4))}>
            <rect x={RX+15} y={260} width={RW-30} height={74} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <circle cx={RX+30} cy={275} r={6} fill={P.blue+"28"} stroke={P.blue} strokeWidth="1.5"/>
            <text x={RX+42} y={279} fill={P.blue} fontSize="8.5" fontFamily="'Inter',sans-serif">electrons (blue)</text>
            <circle cx={RX+30} cy={293} r={8} fill={P.red+"28"} stroke={P.red} strokeWidth="2"/>
            <text x={RX+44} y={297} fill={P.red} fontSize="8.5" fontFamily="'Inter',sans-serif">nuclei (red, +)</text>
            <line x1={RX+22} y1={311} x2={RX+40} y2={311} stroke={P.warn} strokeWidth="1.2" strokeDasharray="3,2"/>
            <text x={RX+44} y={315} fill={P.warn} fontSize="8.5" fontFamily="'Inter',sans-serif">e⁻-e⁻ repulsion</text>
            <line x1={RX+22} y1={327} x2={RX+40} y2={327} stroke={P.green} strokeWidth="1.2" strokeDasharray="2,3"/>
            <text x={RX+44} y={331} fill={P.green} fontSize="8.5" fontFamily="'Inter',sans-serif">e⁻-nucleus attraction</text>
          </g>

          {/* Complexity badge */}
          <g opacity={ease(clamp01((t-0.72)*4))}>
            <rect x={RX+15} y={342} width={RW-30} height={62} rx="6"
              fill={P.red+"12"} stroke={P.red+"55"} strokeWidth="1.5" />
            <text x={RX+RW/2} y={360} textAnchor="middle" fill={P.red} fontSize="11" fontWeight="800"
              fontFamily="'Inter',sans-serif">Exponential Wall!</text>
            <text x={RX+RW/2} y={376} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">Ψ lives in 3N-dimensional space</text>
            <text x={RX+RW/2} y={392} textAnchor="middle" fill={P.warn} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">N=10 → need ~10³⁰ numbers → intractable</text>
          </g>
        </svg>
      );
    }

    // ── 3. BORN-OPPENHEIMER ───────────────────────────────────────────────
    case "born_opp": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Key idea: separate fast & slow", color: P.blue,   delay: 0.04 },
        { text: "",                              color: P.muted,  delay: 0.08 },
        { text: "A proton is 1836× heavier",     color: P.amber,  delay: 0.11 },
        { text: "than an electron",               color: P.amber,  delay: 0.15 },
        { text: "→ nuclei move much slower!",     color: P.green,  delay: 0.19 },
        { text: "",                              color: P.muted,  delay: 0.23 },
        { text: "So we can:",                    color: P.blue,   delay: 0.26 },
        { text: "1. Freeze the nuclei in place", color: P.ink,    delay: 0.30 },
        { text: "2. Solve for electrons only",   color: P.ink,    delay: 0.34 },
        { text: "3. Get the energy at that",     color: P.ink,    delay: 0.38 },
        { text: "   nuclear arrangement",         color: P.ink,    delay: 0.42 },
        { text: "",                              color: P.muted,  delay: 0.46 },
        { text: "Repeat for different nuclear",  color: P.purple, delay: 0.49 },
        { text: "positions → you map out the",   color: P.purple, delay: 0.53 },
        { text: "Potential Energy Surface (PES)", color: P.green,  delay: 0.57 },
        { text: "",                              color: P.muted,  delay: 0.61 },
        { text: "PES tells nuclei where to go:", color: P.teal,   delay: 0.64 },
        { text: "the valley = equilibrium",       color: P.teal,   delay: 0.68 },
        { text: "structure of the material",      color: P.muted,  delay: 0.72 },
      ];

      // Animated electrons on fast orbits
      const fastAngle = t * Math.PI * 8;
      const ePts = [
        { cx: 80,  cy: 155, rx: 40, ry: 18, phase: 0.0 },
        { cx: 80,  cy: 155, rx: 26, ry: 36, phase: 0.3 },
        { cx: 175, cy: 155, rx: 38, ry: 20, phase: 0.6 },
        { cx: 128, cy: 155, rx: 60, ry: 25, phase: 0.15 },
      ];
      // Slow nuclei positions (barely move)
      const nucPos = [
        { x: 80,  y: 155 },
        { x: 175, y: 155 },
      ];
      // PES curve points
      const pesY = (x) => 320 + 45 * Math.pow((x - 128) / 65, 2) - 15;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Born-Oppenheimer Approximation</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={50+i*18} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {/* Timescale labels */}
          <g opacity={ease(clamp01((t-0.10)*5))}>
            <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.blue} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Two Timescales</text>
          </g>

          {/* Electron cloud shading */}
          {ePts.map((o, i) => {
            const op = ease(clamp01((t - 0.12 - i*0.05) * 5));
            return (
              <ellipse key={`cloud-${i}`} cx={RX+o.cx} cy={o.cy}
                rx={o.rx} ry={o.ry}
                fill={P.blue+"0a"} stroke={P.blue} strokeWidth="0.7"
                opacity={op * 0.5} />
            );
          })}

          {/* Animated electrons */}
          {ePts.map((o, i) => {
            const angle = fastAngle + o.phase * Math.PI * 2;
            const ex = RX + o.cx + o.rx * Math.cos(angle);
            const ey = o.cy + o.ry * Math.sin(angle);
            const op = ease(clamp01((t - 0.15 - i*0.05) * 5));
            return (
              <circle key={`el-${i}`} cx={ex} cy={ey} r={4.5}
                fill={P.blue} opacity={op * 0.9} />
            );
          })}

          {/* Nuclei (fixed) */}
          {nucPos.map((n, i) => {
            const op = ease(clamp01((t - 0.10 - i*0.06) * 5));
            return (
              <g key={`nuc-${i}`} opacity={op}>
                <circle cx={RX+n.x} cy={n.y} r={13} fill={P.red+"25"} stroke={P.red} strokeWidth="2"/>
                <line x1={RX+n.x-9} y1={n.y} x2={RX+n.x+9} y2={n.y} stroke={P.red} strokeWidth="2.5"/>
                <line x1={RX+n.x} y1={n.y-9} x2={RX+n.x} y2={n.y+9} stroke={P.red} strokeWidth="2.5"/>
                <text x={RX+n.x} y={n.y+26} textAnchor="middle" fill={P.red} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">R{i+1} fixed</text>
              </g>
            );
          })}

          {/* Speed labels */}
          <g opacity={ease(clamp01((t-0.40)*5))}>
            <text x={RX+RW/2} y={205} textAnchor="middle" fill={P.blue} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">electrons: fast (fs timescale)</text>
            <text x={RX+RW/2} y={220} textAnchor="middle" fill={P.red} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">nuclei: slow (ps timescale)</text>
          </g>

          {/* PES diagram */}
          <g opacity={ease(clamp01((t-0.55)*4))}>
            <text x={RX+RW/2} y={245} textAnchor="middle" fill={P.amber} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Potential Energy Surface E(R)</text>
            {/* Axes */}
            <line x1={RX+20} y1={370} x2={RX+RW-15} y2={370} stroke={P.muted} strokeWidth="1"/>
            <line x1={RX+20} y1={255} x2={RX+20} y2={370} stroke={P.muted} strokeWidth="1"/>
            <text x={RX+RW/2} y={385} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">Nuclear coordinate R</text>
            <text x={RX+14} y={315} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${RX+14} 315)`}>E (eV)</text>
            {/* PES curve */}
            <path d={Array.from({length:50}, (_,i) => {
              const x = 20 + i * (RW-35)/49;
              const dataX = x - 20; const domainX = dataX / (RW-35) * 260 - 130;
              const y = 370 - Math.max(0, 100 - 1.2*domainX*domainX/100);
              return `${i===0?'M':'L'}${RX+x},${y}`;
            }).join(' ')} fill="none" stroke={P.green} strokeWidth="2.2"/>
            {/* Equilibrium marker */}
            <circle cx={RX+148} cy={270} r={5} fill={P.amber} opacity={0.9}/>
            <line x1={RX+148} y1={270} x2={RX+148} y2={370} stroke={P.amber} strokeWidth="1" strokeDasharray="4,3" opacity={0.5}/>
            <text x={RX+155} y={268} fill={P.amber} fontSize="7.5"
              fontFamily="'Inter',sans-serif">R_eq</text>
          </g>
        </svg>
      );
    }

    // ── 4. HOHENBERG-KOHN ─────────────────────────────────────────────────
    case "hohenberg_kohn": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Two Breakthrough Theorems (1964)", color: P.amber, delay: 0.04 },
        { text: "",                               color: P.muted,  delay: 0.08 },
        { text: "Theorem 1:",                     color: P.blue,   delay: 0.11 },
        { text: "The electron density n(r)",      color: P.ink,    delay: 0.15 },
        { text: "uniquely determines everything", color: P.ink,    delay: 0.19 },
        { text: "about the ground state.",         color: P.ink,    delay: 0.23 },
        { text: "",                               color: P.muted,  delay: 0.27 },
        { text: "Theorem 2:",                     color: P.purple, delay: 0.30 },
        { text: "The true density minimizes",     color: P.ink,    delay: 0.34 },
        { text: "the total energy. Any wrong",    color: P.ink,    delay: 0.38 },
        { text: "density gives higher energy.",    color: P.ink,    delay: 0.42 },
        { text: "",                               color: P.muted,  delay: 0.46 },
        { text: "Why this changes everything:",   color: P.green,  delay: 0.49 },
        { text: "The wavefunction Ψ lives in",    color: P.muted,  delay: 0.53 },
        { text: "3N dimensions (N = # electrons)", color: P.muted, delay: 0.57 },
        { text: "",                               color: P.muted,  delay: 0.61 },
        { text: "But the density n(r) lives in",  color: P.pink,   delay: 0.64 },
        { text: "just 3 dimensions!",              color: P.pink,   delay: 0.68 },
        { text: "100 electrons: 300D → 3D",        color: P.pink,   delay: 0.72 },
      ];

      // Triangle nodes — apex up, centred in right panel
      const triCx = RX + RW/2;
      const triNodes = [
        { label: "v_ext(r)",       sub:"external potential",    x: triCx,      y: 80,  col: P.amber  },
        { label: "n(r)",           sub:"ground-state density",  x: triCx - 80, y: 240, col: P.green  },
        { label: "Ψ(r₁..rN)",     sub:"many-body wavefunction",x: triCx + 80, y: 240, col: P.purple },
      ];
      const triEdges = [
        { from: 1, to: 0, label: "HK1",         col: P.blue   },
        { from: 0, to: 2, label: "Schrödinger",  col: P.ink    },
        { from: 2, to: 1, label: "density def.", col: P.teal   },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Hohenberg-Kohn Theorems</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={50+i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.amber} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            The HK Triangle
          </text>

          {/* Triangle edges */}
          {triEdges.map((e, i) => {
            const op = ease(clamp01((t - 0.28 - i*0.08) * 5));
            const n1 = triNodes[e.from], n2 = triNodes[e.to];
            const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
            const dx = n2.x - n1.x, dy = n2.y - n1.y;
            const len = Math.sqrt(dx*dx + dy*dy);
            const ux = dx/len, uy = dy/len;
            const x1 = n1.x + ux*28, y1 = n1.y + uy*28;
            const x2 = n2.x - ux*28, y2 = n2.y - uy*28;
            return (
              <g key={i} opacity={op}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.col} strokeWidth="1.5" strokeDasharray="5,3"/>
                <polygon points={`${x2-uy*4},${y2+ux*4} ${x2+uy*4},${y2-ux*4} ${x2+ux*7},${y2+uy*7}`} fill={e.col}/>
                <rect x={mx-28} y={my-9} width={56} height={14} rx="4" fill={P.bg+"cc"}/>
                <text x={mx} y={my+4} textAnchor="middle" fill={e.col} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{e.label}</text>
              </g>
            );
          })}

          {/* Triangle nodes */}
          {triNodes.map((n, i) => {
            const op = ease(clamp01((t - 0.18 - i*0.08) * 5));
            return (
              <g key={i} opacity={op}>
                <circle cx={n.x} cy={n.y} r={28} fill={n.col+"20"} stroke={n.col+"90"} strokeWidth="2"/>
                <text x={n.x} y={n.y-2} textAnchor="middle" fill={n.col} fontSize="10" fontWeight="800"
                  fontFamily="'Inter',sans-serif">{n.label}</text>
                <text x={n.x} y={n.y+13} textAnchor="middle" fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif">{n.sub}</text>
              </g>
            );
          })}

          {/* Dimensionality reduction visual — centred below triangle */}
          <g opacity={ease(clamp01((t-0.62)*4))}>
            <rect x={RX+15} y={275} width={RW-30} height={86} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1"/>
            <text x={RX+RW/2} y={292} textAnchor="middle" fill={P.pink} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Dimensionality Reduction</text>
            {/* 3N box */}
            <rect x={triCx-75} y={301} width={50} height={28} rx="4" fill={P.warn+"20"} stroke={P.warn} strokeWidth="1.5"/>
            <text x={triCx-50} y={317} textAnchor="middle" fill={P.warn} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">3N=300</text>
            {/* Arrow */}
            <line x1={triCx-23} y1={315} x2={triCx+5} y2={315} stroke={P.green} strokeWidth="2"/>
            <polygon points={`${triCx+5},${315-4} ${triCx+5},${315+4} ${triCx+13},${315}`} fill={P.green}/>
            <text x={triCx-5} y={309} textAnchor="middle" fill={P.green} fontSize="7"
              fontFamily="'Inter',sans-serif">HK</text>
            {/* 3D box */}
            <rect x={triCx+15} y={301} width={40} height={28} rx="4" fill={P.green+"20"} stroke={P.green} strokeWidth="1.5"/>
            <text x={triCx+35} y={317} textAnchor="middle" fill={P.green} fontSize="10" fontWeight="800"
              fontFamily="'Inter',sans-serif">3D</text>
            <text x={RX+RW/2} y={353} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">n(r) encodes everything about ground state</text>
          </g>
        </svg>
      );
    }

    // ── 5. KOHN-SHAM ─────────────────────────────────────────────────────
    case "kohn_sham": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "The Kohn-Sham Trick (1965)",     color: P.purple, delay: 0.04 },
        { text: "",                               color: P.muted,  delay: 0.08 },
        { text: "Replace interacting electrons",  color: P.blue,   delay: 0.11 },
        { text: "with fictional independent ones", color: P.blue,  delay: 0.15 },
        { text: "that give the same density!",    color: P.blue,   delay: 0.19 },
        { text: "",                               color: P.muted,  delay: 0.23 },
        { text: "Each electron feels 3 things:",  color: P.purple, delay: 0.26 },
        { text: "",                               color: P.muted,  delay: 0.30 },
        { text: "1. Nuclear attraction",          color: P.amber,  delay: 0.33 },
        { text: "   (pulled toward nuclei)",       color: P.muted,  delay: 0.37 },
        { text: "",                               color: P.muted,  delay: 0.40 },
        { text: "2. Hartree repulsion",           color: P.blue,   delay: 0.43 },
        { text: "   (repelled by other e\u207B)",  color: P.muted,  delay: 0.47 },
        { text: "",                               color: P.muted,  delay: 0.50 },
        { text: "3. XC correction",               color: P.pink,   delay: 0.53 },
        { text: "   (quantum exchange + corr.)",  color: P.warn,   delay: 0.57 },
        { text: "   This part is approximate!",   color: P.warn,   delay: 0.61 },
        { text: "",                               color: P.muted,  delay: 0.65 },
        { text: "Solve for each orbital, get",    color: P.ok,     delay: 0.68 },
        { text: "density, repeat until stable",   color: P.ok,     delay: 0.72 },
      ];

      // Circular SCF flowchart
      const fcCx = RX + RW/2;
      const fcCy = 210;
      const fcR  = 100;
      const fcNodes = [
        { label: "Initial n(r)", sub: "guess", angle: -90, col: P.blue   },
        { label: "Build v_KS",   sub: "v_ext+v_H+v_xc", angle: -18, col: P.purple },
        { label: "Solve KS",     sub: "get φᵢ,εᵢ", angle: 54,  col: P.amber  },
        { label: "New n(r)",     sub: "Σᵢfᵢ|φᵢ|²", angle: 126, col: P.green  },
        { label: "Converged?",   sub: "|Δn|<tol",  angle: 198, col: P.ok     },
      ];

      // Moving dot along the circle
      const dotAngle = (t * 2.5 % 1) * 2 * Math.PI - Math.PI/2;
      const dotX = fcCx + fcR * Math.cos(dotAngle);
      const dotY = fcCy + fcR * Math.sin(dotAngle);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Kohn-Sham Equations</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={50+i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={fcCx} y={50} textAnchor="middle" fill={P.purple} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            SCF Flowchart
          </text>

          {/* Ring track */}
          <circle cx={fcCx} cy={fcCy} r={fcR} fill="none" stroke={P.dim}
            strokeWidth="1.2" opacity={ease(clamp01((t-0.15)*5))*0.5} strokeDasharray="6,4"/>

          {/* Animated progress arc */}
          {(() => {
            const op = ease(clamp01((t-0.30)*4));
            if (op <= 0) return null;
            const pa = clamp01((t-0.30)*1.2);
            const sa = -Math.PI/2;
            const ea = sa + pa * 2 * Math.PI;
            const x1 = fcCx + fcR*Math.cos(sa), y1 = fcCy + fcR*Math.sin(sa);
            const x2 = fcCx + fcR*Math.cos(ea), y2 = fcCy + fcR*Math.sin(ea);
            const lg = pa > 0.5 ? 1 : 0;
            return (
              <path d={`M${x1},${y1} A${fcR},${fcR} 0 ${lg},1 ${x2},${y2}`}
                fill="none" stroke={P.purple} strokeWidth="2.5" opacity={op*0.7}/>
            );
          })()}

          {/* Moving dot */}
          {ease(clamp01((t-0.35)*4)) > 0 && (
            <circle cx={dotX} cy={dotY} r={6} fill={P.amber}
              opacity={ease(clamp01((t-0.35)*4))*0.9}/>
          )}

          {/* Nodes */}
          {fcNodes.map((node, i) => {
            const op = ease(clamp01((t - 0.18 - i*0.07) * 5));
            const rad = (node.angle * Math.PI) / 180;
            const nx = fcCx + fcR * Math.cos(rad);
            const ny = fcCy + fcR * Math.sin(rad);
            return (
              <g key={i} opacity={op}>
                <circle cx={nx} cy={ny} r={26} fill={node.col+"18"} stroke={node.col+"80"} strokeWidth="1.8"/>
                <text x={nx} y={ny-4} textAnchor="middle" fill={node.col}
                  fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">{node.label}</text>
                <text x={nx} y={ny+9} textAnchor="middle" fill={P.muted}
                  fontSize="6.5" fontFamily="'Inter',sans-serif">{node.sub}</text>
              </g>
            );
          })}

          {/* Yes/No feedback */}
          <g opacity={ease(clamp01((t-0.72)*4))}>
            <line x1={fcCx-26} y1={fcCy+fcR*Math.sin(198*Math.PI/180)}
                  x2={fcCx-85} y2={fcCy+fcR*Math.sin(198*Math.PI/180)}
                  stroke={P.warn} strokeWidth="1.5"/>
            <line x1={fcCx-85} y1={fcCy+fcR*Math.sin(198*Math.PI/180)}
                  x2={fcCx-85} y2={fcCy - fcR - 5}
                  stroke={P.warn} strokeWidth="1.5" strokeDasharray="5,3"/>
            <line x1={fcCx-85} y1={fcCy - fcR - 5}
                  x2={fcCx - fcR*Math.cos(18*Math.PI/180) - 20}
                  y2={fcCy - fcR - 5}
                  stroke={P.warn} strokeWidth="1.5"/>
            <text x={fcCx-90} y={fcCy-10} fill={P.warn} fontSize="7.5" fontWeight="700"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${fcCx-90} ${fcCy-10})`}>No</text>
            <text x={fcCx+40} y={fcCy+fcR*Math.sin(198*Math.PI/180)+4}
              fill={P.ok} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Yes</text>
          </g>

          {/* Output box */}
          <g opacity={ease(clamp01((t-0.83)*4))}>
            <rect x={RX+15} y={328} width={RW-30} height={76} rx="6"
              fill={P.ok+"12"} stroke={P.ok+"50"} strokeWidth="1.5"/>
            <text x={fcCx} y={346} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="800"
              fontFamily="'Inter',sans-serif">Converged!</text>
            <text x={fcCx} y={362} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">Output: E_tot, n(r), {"{φᵢ}"}, {"{εᵢ}"}</text>
            <text x={fcCx} y={378} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">→ band structure, forces, DOS</text>
            <text x={fcCx} y={394} textAnchor="middle" fill={P.dim} fontSize="7.5"
              fontFamily="'Inter',sans-serif">typical: 20-100 SCF iterations</text>
          </g>
        </svg>
      );
    }

    // ── 6. XC FUNCTIONAL ─────────────────────────────────────────────────
    case "xc_functional": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "The XC Functional",               color: P.pink,   delay: 0.04 },
        { text: "Nobody knows the exact form!",     color: P.warn,   delay: 0.08 },
        { text: "We use approximations:",           color: P.muted,  delay: 0.12 },
        { text: "",                                color: P.muted,  delay: 0.16 },
        { text: "LDA: pretend electrons are a",     color: P.blue,   delay: 0.19 },
        { text: "uniform gas. Simplest, cheapest.", color: P.muted,  delay: 0.23 },
        { text: "",                                color: P.muted,  delay: 0.27 },
        { text: "GGA (PBE): also look at how",     color: P.green,  delay: 0.30 },
        { text: "fast density changes. Better",     color: P.muted,  delay: 0.34 },
        { text: "for molecules and surfaces.",      color: P.muted,  delay: 0.38 },
        { text: "",                                color: P.muted,  delay: 0.42 },
        { text: "meta-GGA: adds kinetic energy",   color: P.teal,   delay: 0.45 },
        { text: "density info. Even more accurate.", color: P.muted, delay: 0.49 },
        { text: "",                                color: P.muted,  delay: 0.53 },
        { text: "Hybrid (HSE06): mixes in 25%",    color: P.purple, delay: 0.56 },
        { text: "exact exchange from HF theory.",   color: P.muted,  delay: 0.60 },
        { text: "Best for band gaps, expensive.",   color: P.muted,  delay: 0.64 },
        { text: "",                                color: P.muted,  delay: 0.68 },
        { text: "Higher rung = more accurate",     color: P.pink,   delay: 0.71 },
        { text: "but more computationally costly",  color: P.pink,   delay: 0.75 },
      ];

      // Jacob's Ladder rungs
      const rungs = [
        { label: "LDA",          sub: "local density",        col: P.blue,   y: 330, w: 90  },
        { label: "GGA (PBE)",    sub: "density + gradient",   col: P.green,  y: 283, w: 122 },
        { label: "meta-GGA",     sub: "+ KE density τ",       col: P.teal,   y: 236, w: 155 },
        { label: "Hybrid HSE06", sub: "25% HF exchange",      col: P.purple, y: 189, w: 188 },
        { label: "RPA / exact",  sub: "full correlation",     col: P.pink,   y: 142, w: 220 },
      ];
      const ladderX = RX + 30;
      const railX1  = ladderX - 8;
      const railX2  = ladderX + 232;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Exchange-Correlation Functionals</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={48+i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.amber} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.04)*5))}>
            Jacob's Ladder of DFT
          </text>

          {/* Ladder rails */}
          {ease(clamp01((t-0.14)*5)) > 0 && (() => {
            const op = ease(clamp01((t-0.14)*5));
            return (
              <g opacity={op}>
                <line x1={railX1} y1={130} x2={railX1} y2={362} stroke={P.dim} strokeWidth="3" strokeLinecap="round"/>
                <line x1={railX2} y1={130} x2={railX2} y2={362} stroke={P.dim} strokeWidth="3" strokeLinecap="round"/>
              </g>
            );
          })()}

          {/* Heaven label */}
          <g opacity={ease(clamp01((t-0.16)*5))}>
            <text x={RX+RW/2} y={75} textAnchor="middle" fill={P.amber} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Chemical Accuracy Heaven</text>
            <line x1={RX+RW/2-60} y1={80} x2={RX+RW/2+60} y2={80} stroke={P.amber} strokeWidth="1" opacity={0.4} strokeDasharray="4,3"/>
          </g>

          {/* Axis labels */}
          <g opacity={ease(clamp01((t-0.18)*5))}>
            <text x={RX+15} y={250} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${RX+15} 250)`}>Accuracy</text>
            <text x={RX+RW-12} y={250} textAnchor="middle" fill={P.warn} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(90 ${RX+RW-12} 250)`}>Cost</text>
          </g>

          {/* Rung bars */}
          {rungs.map((rung, i) => {
            const op = ease(clamp01((t - 0.22 - i*0.09) * 5));
            return (
              <g key={i} opacity={op}>
                <rect x={ladderX} y={rung.y} width={rung.w} height={32} rx="6"
                  fill={rung.col+"1a"} stroke={rung.col+"80"} strokeWidth="2"/>
                <text x={ladderX+8} y={rung.y+13} fill={rung.col} fontSize="10" fontWeight="800"
                  fontFamily="'Inter',sans-serif">{rung.label}</text>
                <text x={ladderX+8} y={rung.y+26} fill={P.muted} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">{rung.sub}</text>
                {/* Cost indicator dot */}
                <circle cx={ladderX + rung.w - 12} cy={rung.y+16}
                  r={lerp(3, 9, i/4)} fill={rung.col} opacity={0.7}/>
              </g>
            );
          })}

          {/* Bottom label */}
          <g opacity={ease(clamp01((t-0.72)*4))}>
            <text x={RX+RW/2} y={380} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">More rungs = more accuracy and cost</text>
            <text x={RX+RW/2} y={395} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">GGA-PBE: workhorse of DFT calculations</text>
          </g>
        </svg>
      );
    }

    // ── 7. SCF CYCLE ─────────────────────────────────────────────────────
    case "scf_cycle": {
      const tOp = ease(clamp01(t * 4));

      const steps = [
        { text: "How SCF Works (Na atom):",       color: P.amber,  delay: 0.04 },
        { text: "",                               color: P.muted,  delay: 0.07 },
        { text: "Step 1: Make an initial guess",  color: P.blue,   delay: 0.10 },
        { text: "for the electron density",        color: P.muted,  delay: 0.14 },
        { text: "",                               color: P.muted,  delay: 0.17 },
        { text: "Step 2: Build the effective",    color: P.purple, delay: 0.20 },
        { text: "potential each electron feels",   color: P.muted,  delay: 0.24 },
        { text: "",                               color: P.muted,  delay: 0.27 },
        { text: "Step 3: Solve for orbitals",     color: P.amber,  delay: 0.30 },
        { text: "(where the electrons live)",      color: P.muted,  delay: 0.34 },
        { text: "",                               color: P.muted,  delay: 0.37 },
        { text: "Step 4: Compute new density",    color: P.green,  delay: 0.40 },
        { text: "from the orbitals you found",     color: P.muted,  delay: 0.44 },
        { text: "",                               color: P.muted,  delay: 0.48 },
        { text: "Step 5: Compare old vs new",     color: P.ok,     delay: 0.51 },
        { text: "If they match → done!",          color: P.ok,     delay: 0.55 },
        { text: "If not → go back to step 2",    color: P.warn,   delay: 0.59 },
        { text: "",                               color: P.muted,  delay: 0.63 },
        { text: "Typically converges in",         color: P.teal,   delay: 0.66 },
        { text: "20-100 iterations",               color: P.teal,   delay: 0.70 },
      ];

      // Convergence graph data (energy vs iteration)
      const convData = [
        { iter: 1, E: -161.2  },
        { iter: 2, E: -161.7  },
        { iter: 3, E: -161.84 },
        { iter: 4, E: -161.85 },
        { iter: 5, E: -161.855},
        { iter: 6, E: -161.856},
      ];
      const gX = RX + 25, gW = RW - 45, gYtop = 195, gH = 90;
      const Emin = -161.86, Emax = -161.15;
      const toGx = (iter) => gX + (iter-1)/(5) * gW;
      const toGy = (E) => gYtop + (1 - (E - Emin)/(Emax - Emin)) * gH;

      // SCF cycle nodes (compact version on right)
      const cx = RX + RW/2, cycleR = 72, cycleY = 108;
      const cycleNodes = [
        { label: "n(r)",     angle: -90, col: P.blue   },
        { label: "v_KS",     angle:  -2, col: P.purple },
        { label: "KS solve", angle:  70, col: P.amber  },
        { label: "n_new",    angle: 142, col: P.green  },
        { label: "conv?",    angle: 214, col: P.ok     },
      ];
      const iterCount = Math.min(6, Math.floor(t * 10));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>SCF Cycle — Na Atom Example</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {steps.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={48+i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={cx} y={50} textAnchor="middle" fill={P.green} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            SCF Loop
          </text>

          {/* Compact cycle */}
          <circle cx={cx} cy={cycleY} r={cycleR} fill="none" stroke={P.dim}
            strokeWidth="1" opacity={ease(clamp01((t-0.15)*5))*0.5} strokeDasharray="5,3"/>
          {cycleNodes.map((node, i) => {
            const op = ease(clamp01((t-0.18-i*0.06)*5));
            const rad = (node.angle * Math.PI) / 180;
            const nx = cx + cycleR * Math.cos(rad);
            const ny = cycleY + cycleR * Math.sin(rad);
            return (
              <g key={i} opacity={op}>
                <circle cx={nx} cy={ny} r={19} fill={node.col+"18"} stroke={node.col+"80"} strokeWidth="1.5"/>
                <text x={nx} y={ny+4} textAnchor="middle" fill={node.col}
                  fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">{node.label}</text>
              </g>
            );
          })}
          <text x={cx} y={cycleY+4} textAnchor="middle" fill={P.amber} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.40)*4))}>
            iter {iterCount}
          </text>

          {/* Convergence graph */}
          <g opacity={ease(clamp01((t-0.55)*4))}>
            <text x={cx} y={188} textAnchor="middle" fill={P.teal} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Convergence — Na Total Energy</text>
            <line x1={gX} y1={gYtop} x2={gX} y2={gYtop+gH} stroke={P.muted} strokeWidth="1"/>
            <line x1={gX} y1={gYtop+gH} x2={gX+gW} y2={gYtop+gH} stroke={P.muted} strokeWidth="1"/>
            <text x={gX+gW/2} y={gYtop+gH+14} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">SCF Iteration</text>
            <text x={gX-4} y={gYtop+gH/2} textAnchor="end" fill={P.muted} fontSize="7"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${gX-4} ${gYtop+gH/2})`}>E (eV)</text>
            {/* Converged line */}
            <line x1={gX} y1={toGy(-161.856)} x2={gX+gW} y2={toGy(-161.856)}
              stroke={P.ok} strokeWidth="0.8" strokeDasharray="4,3" opacity={0.5}/>
            {/* Curve */}
            {convData.map((d, i) => {
              if (i === 0) return null;
              const x1c = toGx(convData[i-1].iter), y1c = toGy(convData[i-1].E);
              const x2c = toGx(d.iter), y2c = toGy(d.E);
              return <line key={i} x1={x1c} y1={y1c} x2={x2c} y2={y2c}
                stroke={P.green} strokeWidth="2" strokeLinecap="round"/>;
            })}
            {/* Dots */}
            {convData.map((d, i) => (
              <circle key={i} cx={toGx(d.iter)} cy={toGy(d.E)} r={3.5}
                fill={i === convData.length-1 ? P.ok : P.green}/>
            ))}
            {/* Axis tick labels */}
            {convData.map((d, i) => (
              <text key={i} x={toGx(d.iter)} y={gYtop+gH+10} textAnchor="middle"
                fill={P.muted} fontSize="7" fontFamily="'Inter',sans-serif">{d.iter}</text>
            ))}
          </g>

          {/* Density profile for Na */}
          <g opacity={ease(clamp01((t-0.75)*4))}>
            <text x={cx} y={312} textAnchor="middle" fill={P.purple} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Na Radial Density n(r)</text>
            <line x1={gX} y1={330} x2={gX} y2={395} stroke={P.muted} strokeWidth="1"/>
            <line x1={gX} y1={395} x2={gX+gW} y2={395} stroke={P.muted} strokeWidth="1"/>
            {/* 1s peak */}
            {Array.from({length:40}, (_,i) => {
              const x = i/39;
              const y = Math.exp(-x*25)*55 + Math.exp(-(x-0.12)*2/0.001)*8
                + Math.exp(-(x-0.25)*2/0.004)*12 + Math.exp(-(x-0.85)*2/0.025)*6;
              const px = gX + x*gW;
              const py = 395 - Math.min(y, 60);
              if (i === 0) return null;
              const px0 = gX + (i-1)/39*gW;
              const py0 = 395 - Math.min(
                Math.exp(-(i-1)/39*25)*55 + Math.exp(-((i-1)/39-0.25)*2/0.004)*12
                + Math.exp(-((i-1)/39-0.85)*2/0.025)*6, 60);
              return <line key={i} x1={px0} y1={py0} x2={px} y2={py}
                stroke={P.blue} strokeWidth="1.5"/>;
            })}
            <text x={gX+5} y={340} fill={P.muted} fontSize="6.5" fontFamily="'Inter',sans-serif">1s</text>
            <text x={gX+gW*0.23} y={370} fill={P.muted} fontSize="6.5" fontFamily="'Inter',sans-serif">2s,2p</text>
            <text x={gX+gW*0.75} y={385} fill={P.muted} fontSize="6.5" fontFamily="'Inter',sans-serif">3s</text>
            <text x={gX+gW/2} y={410} textAnchor="middle" fill={P.muted} fontSize="7"
              fontFamily="'Inter',sans-serif">r (au)</text>
          </g>
        </svg>
      );
    }

    // ── 8. BASIS SETS ─────────────────────────────────────────────────────
    case "basis_sets": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "What is a Basis Set?",            color: P.amber,  delay: 0.04 },
        { text: "Building blocks for describing",  color: P.muted,  delay: 0.08 },
        { text: "where electrons can be.",          color: P.muted,  delay: 0.12 },
        { text: "",                               color: P.muted,  delay: 0.16 },
        { text: "For crystals: Plane Waves",      color: P.blue,   delay: 0.19 },
        { text: "Simple sine waves added up.",     color: P.muted,  delay: 0.23 },
        { text: "More waves = sharper picture.",   color: P.muted,  delay: 0.27 },
        { text: "Energy cutoff controls how",      color: P.green,  delay: 0.31 },
        { text: "many waves you include.",          color: P.green,  delay: 0.35 },
        { text: "",                               color: P.muted,  delay: 0.39 },
        { text: "For molecules: Gaussians",       color: P.green,  delay: 0.42 },
        { text: "Atom-centered bell curves.",      color: P.muted,  delay: 0.46 },
        { text: "Good for isolated systems.",      color: P.muted,  delay: 0.50 },
        { text: "",                               color: P.muted,  delay: 0.54 },
        { text: "The core electron trick:",       color: P.purple, delay: 0.57 },
        { text: "Inner electrons rarely change,", color: P.muted,  delay: 0.61 },
        { text: "so replace them with a smooth",  color: P.teal,   delay: 0.65 },
        { text: "effective potential (pseudo-",    color: P.teal,   delay: 0.69 },
        { text: "potential). PAW recovers full",   color: P.pink,   delay: 0.73 },
        { text: "detail near nuclei when needed.", color: P.muted,  delay: 0.77 },
      ];

      const bzCx = RX + 120, bzCy = 220, bzR = 72;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Basis Sets & Pseudopotentials</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={48+i*16} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {/* Pseudo vs AE wavefunction diagram */}
          <g opacity={ease(clamp01((t-0.12)*5))}>
            <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.purple} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Pseudopotential Concept</text>
            <line x1={RX+15} y1={120} x2={RX+15} y2={55} stroke={P.muted} strokeWidth="1"/>
            <line x1={RX+15} y1={120} x2={RX+RW-15} y2={120} stroke={P.muted} strokeWidth="1"/>
            <text x={RX+RW/2} y={133} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">r</text>
            <text x={RX+10} y={90} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${RX+10} 90)`}>ψ(r)</text>

            {/* All-electron wavefunction (oscillates near nucleus) */}
            {Array.from({length:55}, (_,i) => {
              const x0 = i/54; const x1 = (i+1)/54;
              const ae0 = x0 < 0.35
                ? Math.sin(x0*Math.PI*8)*22 * Math.exp(-x0*3)
                : Math.sin(x0*Math.PI*1.5)*14 * Math.exp(-(x0-0.35)*1.5);
              const ae1 = x1 < 0.35
                ? Math.sin(x1*Math.PI*8)*22 * Math.exp(-x1*3)
                : Math.sin(x1*Math.PI*1.5)*14 * Math.exp(-(x1-0.35)*1.5);
              const px0 = RX+15+x0*(RW-30), py0 = 88 - ae0;
              const px1 = RX+15+x1*(RW-30), py1 = 88 - ae1;
              return <line key={i} x1={px0} y1={py0} x2={px1} y2={py1}
                stroke={P.warn} strokeWidth="1.5" opacity={0.85}/>;
            })}

            {/* Pseudo wavefunction (smooth) */}
            {Array.from({length:55}, (_,i) => {
              const x0 = i/54; const x1 = (i+1)/54;
              const ps = x => Math.sin(x*Math.PI*1.4)*12 * Math.exp(-x*1.2);
              const px0 = RX+15+x0*(RW-30), py0 = 88 - ps(x0);
              const px1 = RX+15+x1*(RW-30), py1 = 88 - ps(x1);
              return <line key={i} x1={px0} y1={py0} x2={px1} y2={py1}
                stroke={P.teal} strokeWidth="1.8" strokeDasharray="4,2" opacity={0.9}/>;
            })}

            {/* r_c vertical line */}
            <line x1={RX+15+0.35*(RW-30)} y1={55} x2={RX+15+0.35*(RW-30)} y2={120}
              stroke={P.amber} strokeWidth="1.2" strokeDasharray="4,3"/>
            <text x={RX+18+0.35*(RW-30)} y={63} fill={P.amber} fontSize="7.5"
              fontFamily="'Inter',sans-serif">r_c</text>

            {/* Legend */}
            <line x1={RX+20} y1={143} x2={RX+42} y2={143} stroke={P.warn} strokeWidth="1.8"/>
            <text x={RX+46} y={147} fill={P.warn} fontSize="8" fontFamily="'Inter',sans-serif">all-electron</text>
            <line x1={RX+130} y1={143} x2={RX+152} y2={143} stroke={P.teal} strokeWidth="1.8" strokeDasharray="4,2"/>
            <text x={RX+156} y={147} fill={P.teal} fontSize="8" fontFamily="'Inter',sans-serif">pseudo</text>
          </g>

          {/* Brillouin Zone */}
          <g opacity={ease(clamp01((t-0.45)*5))}>
            <text x={RX+RW/2} y={178} textAnchor="middle" fill={P.blue} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Brillouin Zone & k-points</text>

            {/* Hexagonal BZ */}
            {(() => {
              const pts = Array.from({length:6}, (_,i) => {
                const a = (i*60 - 30)*Math.PI/180;
                return `${bzCx+bzR*Math.cos(a)},${bzCy+bzR*Math.sin(a)}`;
              }).join(' ');
              return <polygon points={pts} fill={P.blue+"0a"} stroke={P.blue+"60"} strokeWidth="1.5"/>;
            })()}

            {/* k-point grid (Monkhorst-Pack) */}
            {Array.from({length:5}, (_,i) => Array.from({length:5}, (_,j) => {
              const kx = bzCx + (i-2)*26;
              const ky = bzCy + (j-2)*26;
              const dist = Math.sqrt((kx-bzCx)**2 + (ky-bzCy)**2);
              if (dist > bzR - 8) return null;
              return <circle key={`${i}-${j}`} cx={kx} cy={ky} r={3}
                fill={P.pink} opacity={0.85}/>;
            }))}

            {/* High-symmetry points */}
            {[
              { label: "Γ", x: bzCx,      y: bzCy     },
              { label: "K", x: bzCx+bzR,  y: bzCy     },
              { label: "M", x: bzCx+bzR*Math.cos(30*Math.PI/180), y: bzCy+bzR*Math.sin(30*Math.PI/180) },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={5} fill={P.amber} opacity={0.9}/>
                <text x={p.x+8} y={p.y+4} fill={P.amber} fontSize="8.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{p.label}</text>
              </g>
            ))}
            <text x={RX+RW/2} y={bzCy+bzR+18} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">5×5 Monkhorst-Pack grid</text>
          </g>

          {/* ENCUT info */}
          <g opacity={ease(clamp01((t-0.72)*4))}>
            <rect x={RX+15} y={345} width={RW-30} height={52} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1"/>
            <text x={RX+RW/2} y={363} textAnchor="middle" fill={P.green} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Convergence Parameters</text>
            <text x={RX+RW/2} y={380} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">E_cut: 300-600 eV typical (plane waves)</text>
            <text x={RX+RW/2} y={394} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">k-mesh: denser → more accurate bands</text>
          </g>
        </svg>
      );
    }

    // ── 9. DFT OUTPUTS ────────────────────────────────────────────────────
    case "output": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "What DFT Tells You:",             color: P.ok,     delay: 0.04 },
        { text: "",                               color: P.muted,  delay: 0.07 },
        { text: "1. Total energy",                color: P.blue,   delay: 0.10 },
        { text: "   Is this structure stable?",    color: P.muted,  delay: 0.14 },
        { text: "",                               color: P.muted,  delay: 0.18 },
        { text: "2. Forces on atoms",             color: P.green,  delay: 0.21 },
        { text: "   Which way do atoms want",      color: P.muted,  delay: 0.25 },
        { text: "   to move? (relax structure)",   color: P.muted,  delay: 0.29 },
        { text: "",                               color: P.muted,  delay: 0.33 },
        { text: "3. Band structure",              color: P.purple, delay: 0.36 },
        { text: "   Metal or insulator?",          color: P.muted,  delay: 0.40 },
        { text: "   What is the band gap?",        color: P.muted,  delay: 0.44 },
        { text: "",                               color: P.muted,  delay: 0.48 },
        { text: "4. Density of states (DOS)",     color: P.amber,  delay: 0.51 },
        { text: "   Which orbitals contribute?",   color: P.muted,  delay: 0.55 },
        { text: "",                               color: P.muted,  delay: 0.59 },
        { text: "5. Charge density map",          color: P.teal,   delay: 0.62 },
        { text: "   Where is the electron glue?", color: P.muted,  delay: 0.66 },
        { text: "   (bonding visualization)",      color: P.muted,  delay: 0.70 },
      ];

      // Band structure
      const bsX = RX + 40, bsW = 170, bsYt = 60, bsH = 170;
      const kPts = [0, 56, 113, 170];
      const kLbs = ["Γ", "K", "M", "Γ"];

      const vb = [[0,165],[28,155],[56,148],[85,140],[113,148],[141,158],[170,165]];
      const cb = [[0,90],[28,82],[56,88],[85,75],[113,84],[141,92],[170,90]];

      const toBS = (pts) => pts.map(([kx,ky]) =>
        `${bsX+kx},${bsYt+ky}`).join(' ');

      // DOS
      const dosX = RX + 218;
      const dosData = [
        { ey: 90,  dos: 8  }, { ey: 100, dos: 16 },
        { ey: 110, dos: 12 }, { ey: 120, dos: 5  },
        { ey: 133, dos: 0  }, { ey: 147, dos: 0  },
        { ey: 155, dos: 10 }, { ey: 162, dos: 22 },
        { ey: 168, dos: 28 }, { ey: 174, dos: 18 },
        { ey: 180, dos: 8  }, { ey: 188, dos: 3  },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>DFT Outputs</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+10} y={50+i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={RX+RW/2} y={50} textAnchor="middle" fill={P.purple} fontSize="9.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            Band Structure + DOS — ZnTe
          </text>

          {/* Axes */}
          <g opacity={ease(clamp01((t-0.10)*5))}>
            <line x1={bsX} y1={bsYt} x2={bsX} y2={bsYt+bsH} stroke={P.muted} strokeWidth="1"/>
            <line x1={bsX} y1={bsYt+bsH} x2={bsX+bsW} y2={bsYt+bsH} stroke={P.muted} strokeWidth="1"/>
            <text x={bsX-4} y={bsYt+bsH/2} textAnchor="end" fill={P.muted} fontSize="7"
              fontFamily="'Inter',sans-serif" transform={`rotate(-90 ${bsX-4} ${bsYt+bsH/2})`}>Energy (eV)</text>
            {kLbs.map((lb, i) => (
              <g key={i}>
                <line x1={bsX+kPts[i]} y1={bsYt} x2={bsX+kPts[i]} y2={bsYt+bsH}
                  stroke={P.dim} strokeWidth="0.6" opacity={0.6}/>
                <text x={bsX+kPts[i]} y={bsYt+bsH+13} textAnchor="middle"
                  fill={P.muted} fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{lb}</text>
              </g>
            ))}
          </g>

          {/* Fermi level */}
          <line x1={bsX} y1={bsYt+170} x2={bsX+bsW} y2={bsYt+170}
            stroke={P.muted} strokeWidth="0.8" strokeDasharray="4,3"
            opacity={ease(clamp01((t-0.12)*5))*0.5}/>
          <text x={bsX-4} y={bsYt+174} textAnchor="end" fill={P.muted} fontSize="7"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.12)*5))}>E_F</text>

          {/* Valence band (filled) */}
          {ease(clamp01((t-0.18)*5)) > 0 && (() => {
            const op = ease(clamp01((t-0.18)*5));
            const vbFill = [...vb, [170, bsH], [0, bsH]];
            return (
              <g opacity={op}>
                <polygon points={vbFill.map(([kx,ky])=>`${bsX+kx},${bsYt+ky}`).join(' ')}
                  fill={P.purple+"22"}/>
                <polyline points={toBS(vb)} fill="none" stroke={P.purple} strokeWidth="2.2"/>
                <text x={bsX+85} y={bsYt+162} textAnchor="middle" fill={P.purple} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Valence Band</text>
              </g>
            );
          })()}

          {/* Conduction band */}
          {ease(clamp01((t-0.28)*5)) > 0 && (() => {
            const op = ease(clamp01((t-0.28)*5));
            return (
              <g opacity={op}>
                <polyline points={toBS(cb)} fill="none" stroke={P.blue} strokeWidth="2.2"/>
                <text x={bsX+85} y={bsYt+72} textAnchor="middle" fill={P.blue} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Conduction Band</text>
              </g>
            );
          })()}

          {/* Bandgap arrow */}
          {ease(clamp01((t-0.40)*5)) > 0 && (() => {
            const op = ease(clamp01((t-0.40)*5));
            const gapX = bsX + 85;
            const topY = bsYt + 75; const botY = bsYt + 140;
            return (
              <g opacity={op}>
                <line x1={gapX} y1={topY} x2={gapX} y2={botY} stroke={P.ok} strokeWidth="1.5"/>
                <polygon points={`${gapX-4},${topY} ${gapX+4},${topY} ${gapX},${topY-8}`} fill={P.ok}/>
                <polygon points={`${gapX-4},${botY} ${gapX+4},${botY} ${gapX},${botY+8}`} fill={P.ok}/>
                <rect x={gapX+6} y={(topY+botY)/2-14} width={56} height={28} rx="4"
                  fill={P.ok+"1a"} stroke={P.ok+"60"} strokeWidth="1"/>
                <text x={gapX+34} y={(topY+botY)/2-2} textAnchor="middle" fill={P.ok} fontSize="8.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Eg</text>
                <text x={gapX+34} y={(topY+botY)/2+10} textAnchor="middle" fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif">2.26 eV</text>
              </g>
            );
          })()}

          {/* DOS panel */}
          {ease(clamp01((t-0.50)*5)) > 0 && (() => {
            const op = ease(clamp01((t-0.50)*5));
            return (
              <g opacity={op}>
                <text x={dosX+24} y={55} textAnchor="middle" fill={P.muted} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">DOS</text>
                <line x1={dosX} y1={bsYt} x2={dosX} y2={bsYt+bsH} stroke={P.muted} strokeWidth="0.8"/>
                {dosData.map((d, i) => (
                  <rect key={i} x={dosX} y={bsYt+d.ey-7} width={d.dos} height={9} rx="1"
                    fill={d.ey < 133 ? P.blue : P.purple} opacity={0.75}/>
                ))}
                {/* Gap region */}
                <rect x={dosX} y={bsYt+133} width={35} height={14} rx="1" fill={P.bg} opacity={0.9}/>
                <text x={dosX+18} y={bsYt+144} textAnchor="middle" fill={P.dim} fontSize="6.5"
                  fontFamily="'Inter',sans-serif">gap</text>
              </g>
            );
          })()}

          {/* ZnTe comparison table */}
          <g opacity={ease(clamp01((t-0.65)*4))}>
            <rect x={RX+15} y={252} width={RW-30} height={92} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1"/>
            <text x={RX+RW/2} y={270} textAnchor="middle" fill={P.teal} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">ZnTe Bandgap Comparison</text>
            {[
              { label: "GGA-PBE",   val: "2.26 eV", err: "-0.04 eV", col: P.green  },
              { label: "HSE06",     val: "2.50 eV", err: "+0.20 eV", col: P.purple },
              { label: "Expt.",     val: "2.30 eV", err: "ref",      col: P.ok     },
            ].map((row, i) => {
              const ry = 284 + i*20;
              return (
                <g key={i}>
                  <text x={RX+24} y={ry} fill={row.col} fontSize="9" fontWeight="700"
                    fontFamily="'Inter',sans-serif">{row.label}</text>
                  <text x={RX+105} y={ry} fill={P.ink} fontSize="9"
                    fontFamily="'Inter',sans-serif">{row.val}</text>
                  <text x={RX+162} y={ry} fill={P.muted} fontSize="8"
                    fontFamily="'Inter',sans-serif">{row.err}</text>
                </g>
              );
            })}
            <text x={RX+RW/2} y={336} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">GGA underestimates · HSE06 more accurate</text>
          </g>

          {/* Summary box */}
          <g opacity={ease(clamp01((t-0.80)*4))}>
            <rect x={RX+15} y={352} width={RW-30} height={56} rx="6"
              fill={P.surface} stroke={P.ok+"50"} strokeWidth="1.5"/>
            <text x={RX+RW/2} y={370} textAnchor="middle" fill={P.ok} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">DFT: workhorse of computational</text>
            <text x={RX+RW/2} y={386} textAnchor="middle" fill={P.ok} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">materials science</text>
            <text x={RX+RW/2} y={401} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">10,000+ publications per year use DFT</text>
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
      {/* Cinema screen — GPU layer to stop shaking */}
      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
        aspectRatio: "4/3",
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "layout paint",
      }}>
        <div style={{ position: "absolute", top: 10, left: 14, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: P.blue+"25", border: `1px solid ${P.blue}50`, padding: "3px 10px",
            borderRadius: 6, fontSize: 10, fontWeight: 700, color: P.blue, letterSpacing: 1 }}>
            Scene {sceneIdx + 1}/{SCENES.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{scene.label}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 14, zIndex: 2, fontSize: 11, color: "#fff", fontWeight: 600, opacity: 0.65 }}>
          DFT Basics
        </div>
        <div style={{ opacity: fadeOpacity, transition: "opacity 0.25s ease-in-out", willChange: "opacity" }}>
          {renderScene()}
        </div>
        {/* Scene progress bar — no transition to avoid fighting RAF */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: P.dim+"30" }}>
          <div style={{ height: "100%", background: P.blue, width: `${progress * 100}%`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: P.panel, padding: "10px 14px", borderRadius: 12, border: `1px solid ${P.border}` }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.blue}`,
          background: P.blue+"15", cursor: "pointer", display: "flex", alignItems: "center",
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

        {/* Global timeline scrubber */}
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ height: 6, background: P.dim+"30", borderRadius: 3, position: "relative", cursor: "pointer" }}
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

      {/* Scene analogies */}
      {(() => {
        const analogies = {
          title: [
            { icon: "\uD83C\uDFA8", text: "DFT is like predicting the weather: instead of tracking every air molecule (impossible), you use the overall air density and temperature fields. DFT replaces tracking every electron with tracking the electron density." },
            { icon: "\uD83C\uDFB5", text: "Like reconstructing a song from its frequency spectrum instead of tracking each speaker cone vibration \u2014 the density contains all the physics, just as the spectrum contains all the music." },
          ],
          many_body: [
            { icon: "\uD83C\uDFAD", text: "Imagine choreographing a dance for 100 dancers where every dancer\u2019s move depends on all other dancers simultaneously. With 3 coordinates per dancer, you need a script written in 300-dimensional space \u2014 that\u2019s the many-body problem." },
            { icon: "\uD83C\uDFB2", text: "Like a chess game where every piece on the board changes the rules for every other piece on every turn. You can\u2019t simplify \u2014 every piece-to-piece interaction matters." },
            { icon: "\uD83C\uDF0A", text: "Think of waves in a crowded pool: each swimmer creates ripples that affect all other swimmers. Solving for all wave patterns simultaneously is exponentially hard as you add more swimmers." },
          ],
          born_opp: [
            { icon: "\uD83D\uDE82", text: "Nuclei are like slow freight trains and electrons are like buzzing flies around them. The flies adjust instantly to wherever the trains are, so you can solve the fly problem first at each train position." },
            { icon: "\uD83C\uDFAC", text: "Like filming a time-lapse of a glacier (nuclei) while hummingbirds (electrons) zip around it. At each glacier snapshot, the hummingbirds have already reached their equilibrium pattern." },
            { icon: "\u2693", text: "Imagine anchoring heavy ships (nuclei) in a harbor and watching how the water currents (electrons) flow around them. Move the ships slightly and the currents re-adjust almost instantly." },
          ],
          hohenberg_kohn: [
            { icon: "\uD83D\uDDFA\uFE0F", text: "HK1 is like saying: if you know the terrain map (density) of a landscape, you can uniquely reconstruct the gravitational field (external potential) that shaped it. No two different gravitational fields produce the same terrain." },
            { icon: "\uD83D\uDD0D", text: "Like a fingerprint: just as every person has a unique fingerprint, every external potential produces a unique ground-state density. The density IS the fingerprint of the system." },
            { icon: "\uD83D\uDCE6", text: "Instead of shipping a 3N-dimensional package (the full wavefunction), HK says: just ship a 3D package (the density) \u2014 it contains all the same information. Massive compression!" },
          ],
          kohn_sham: [
            { icon: "\uD83C\uDFAD", text: "KS is a con artist\u2019s trick: replace the hard problem (interacting electrons) with a fake system of independent electrons that gives the same density. It\u2019s like replacing a tangled rope with separate strings that form the same shape." },
            { icon: "\uD83C\uDFB9", text: "Like playing a complex chord: instead of solving for all string vibrations coupled together, KS finds independent notes (orbitals) that, when combined, reproduce the correct sound (density)." },
            { icon: "\uD83C\uDFE0", text: "Building a house: instead of calculating every load simultaneously, engineers solve for each beam independently using an effective load that accounts for all the other beams. Same idea \u2014 single-particle equations with an effective potential." },
          ],
          xc_functional: [
            { icon: "\uD83C\uDF70", text: "The XC functional is like a recipe correction: LDA is \u2018use local ingredients only\u2019 (crude), GGA adds \u2018also taste the neighbors\u2019, meta-GGA adds \u2018and note the cooking temperature\u2019, hybrids add \u2018and a pinch of the exact spice\u2019." },
            { icon: "\uD83D\uDCF7", text: "Like image resolution: LDA is a blurry photo (just local color), GGA adds edges (gradients), meta-GGA adds texture, hybrid adds fine details from a reference photo (exact exchange). More information = clearer picture." },
            { icon: "\uD83E\uDE9C", text: "Jacob\u2019s Ladder is like map resolution \u2014 from a globe (LDA) to a country map (GGA) to Google Street View (hybrid). Each rung is more detailed but costs more to produce." },
          ],
          scf_cycle: [
            { icon: "\uD83C\uDFAF", text: "SCF is like adjusting a thermostat: you set a temperature (guess density), the heater responds (solve KS), the room reaches a new temperature (new density), and you re-adjust. Eventually the room stabilizes (convergence)." },
            { icon: "\uD83D\uDD04", text: "Like focusing binoculars: you start with a blurry image (initial guess), adjust the lens (solve equations), check if it\u2019s sharp (convergence test), and keep tweaking until the image is clear." },
            { icon: "\uD83C\uDF10", text: "Like a GPS finding your location: it starts with a rough estimate, uses satellites (KS equations) to refine, checks accuracy, and iterates until the position is pinpointed within tolerance." },
          ],
          basis_sets: [
            { icon: "\uD83E\uDDE9", text: "A basis set is your set of LEGO bricks. Plane waves are like uniform square bricks \u2014 great for building periodic patterns (crystals). Gaussians are like rounded bricks \u2014 better for building isolated shapes (molecules). More bricks = more detail, but costs more time." },
            { icon: "\uD83C\uDFB6", text: "Like synthesizing any sound from pure tones (Fourier): plane waves are the pure tones of crystal calculations. The energy cutoff is the highest pitch you include \u2014 more tones give a sharper wavefunction, like more overtones give a richer sound." },
            { icon: "\uD83D\uDCD6", text: "Pseudopotentials are like using cliff notes for the boring parts. Core electrons (near nuclei) are predictable and expensive to describe. The pseudopotential summarizes them, so you only compute the interesting valence electrons in full detail." },
          ],
          output: [
            { icon: "\uD83D\uDCCA", text: "DFT outputs are like a medical checkup for a material: total energy (overall health), band structure (how electrons flow = blood test), DOS (electron population = blood cell count), forces (structural stability = bone density scan)." },
            { icon: "\uD83D\uDD2C", text: "Like getting a lab report: the raw numbers (energies, eigenvalues) need interpretation. Band gap tells you insulator vs metal (conductivity), forces tell you stability (will it hold its shape), charge density shows bonding (where the glue is)." },
          ],
        };
        const items = analogies[scene.id];
        if (!items) return null;
        return (
          <div style={{ marginTop: 12, background: P.panel, borderRadius: 12, border: `1px solid ${P.border}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P.blue, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Analogies</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, lineHeight: "20px", flexShrink: 0 }}>{a.icon}</span>
                  <span style={{ fontSize: 11, lineHeight: 1.7, color: P.ink }}>{a.text}</span>
                </div>
              ))}
            </div>
            {/* Summary table for output scene */}
            {scene.id === "output" && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${P.border}`, paddingTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: P.purple, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>DFT Methods at a Glance</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${P.border}` }}>
                      {["Method", "Accuracy", "Cost", "Best for"].map(h => (
                        <th key={h} style={{ padding: "5px 6px", textAlign: "left", color: P.blue, fontWeight: 700, fontSize: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { m: "LDA",      acc: "Low",      cost: "1x",      use: "Quick estimates, trends",        col: P.blue   },
                      { m: "GGA-PBE",  acc: "Good",     cost: "1x",      use: "Structures, energetics, phonons", col: P.green  },
                      { m: "meta-GGA", acc: "Better",   cost: "2-3x",    use: "Diverse bonding, surfaces",      col: P.teal   },
                      { m: "DFT+U",    acc: "Good (d/f)", cost: "~1x",   use: "TM oxides, correlated systems",  col: P.amber  },
                      { m: "HSE06",    acc: "High",     cost: "10-100x", use: "Band gaps, defect levels",       col: P.purple },
                      { m: "GW",       acc: "Very high", cost: "1000x",  use: "Quasiparticle spectra",          col: P.pink   },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${P.dim}30` }}>
                        <td style={{ padding: "4px 6px", fontWeight: 700, color: r.col }}>{r.m}</td>
                        <td style={{ padding: "4px 6px", color: P.ink }}>{r.acc}</td>
                        <td style={{ padding: "4px 6px", color: P.muted, fontFamily: "monospace" }}>{r.cost}</td>
                        <td style={{ padding: "4px 6px", color: P.muted }}>{r.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* Scene chips */}
      <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.blue+"20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.blue : P.border}`,
            color: i === sceneIdx ? P.blue : P.muted,
            fontWeight: i === sceneIdx ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
