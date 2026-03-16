import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// MD BASICS MOVIE — Molecular Dynamics simulation walkthrough
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
  { id: "title",          label: "MD Simulation",        duration: 4500 },
  { id: "newtons_laws",   label: "Newton's Laws",        duration: 8000 },
  { id: "verlet",         label: "Verlet Integration",   duration: 8500 },
  { id: "lennard_jones",  label: "Lennard-Jones",        duration: 8000 },
  { id: "thermostats",    label: "Thermostats",          duration: 8000 },
  { id: "ensembles",     label: "Ensembles",          duration: 12000 },
  { id: "time_loop",      label: "Time Integration",     duration: 7000 },
  { id: "properties",     label: "Properties",           duration: 8500 },
  { id: "summary",        label: "Summary",              duration: 6000 },
];

const ease    = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const lerp    = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function MDMovieModule() {
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
    const LX = 10, LW = 340, RX = 365, RW = 380;

    switch (scene.id) {

    // ── 1. TITLE ─────────────────────────────────────────────────────────
    case "title": {
      const tOp  = ease(clamp01(t * 3));
      const sOp  = ease(clamp01((t - 0.25) * 3));
      const aOp  = ease(clamp01((t - 0.50) * 3));
      const eqOp = ease(clamp01((t - 0.72) * 4));

      // Floating atoms
      const atoms = [
        { x: 160, y: 180, r: 14, color: P.blue,   vx: 30,  vy: -20 },
        { x: 320, y: 200, r: 12, color: P.red,    vx: -25, vy: 15 },
        { x: 480, y: 170, r: 10, color: P.green,  vx: 15,  vy: 25 },
        { x: 240, y: 250, r: 11, color: P.purple, vx: -20, vy: -18 },
        { x: 550, y: 230, r: 13, color: P.amber,  vx: 20,  vy: -12 },
        { x: 400, y: 280, r: 9,  color: P.teal,   vx: -18, vy: 20 },
        { x: 600, y: 160, r: 11, color: P.pink,   vx: -22, vy: 10 },
        { x: 130, y: 260, r: 10, color: P.blue,   vx: 28,  vy: 14 },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Grid lines */}
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={0} y1={i*30} x2={W} y2={i*30} stroke={P.dim} strokeWidth="0.3" opacity={0.12} />
          ))}

          {/* Floating atoms with trails */}
          {atoms.map((atom, i) => {
            const ax = atom.x + atom.vx * t;
            const ay = atom.y + atom.vy * t;
            const op = tOp * 0.8;
            return (
              <g key={i} opacity={op}>
                {/* Trail */}
                <line x1={atom.x} y1={atom.y} x2={ax} y2={ay}
                  stroke={atom.color} strokeWidth="1.5" opacity={0.25} />
                {/* Atom */}
                <circle cx={ax} cy={ay} r={atom.r} fill={atom.color+"30"} stroke={atom.color} strokeWidth="2" />
                {/* Glow */}
                <circle cx={ax} cy={ay} r={atom.r + 4} fill="none" stroke={atom.color} strokeWidth="0.8" opacity={0.2} />
              </g>
            );
          })}

          {/* Title */}
          <text x={W/2} y={72} textAnchor="middle" fill={P.ink} fontSize="30" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Molecular Dynamics Simulation</text>

          {/* Animated underline */}
          <rect x={W/2 - ease(clamp01((t-0.1)*3))*200} y={82}
            width={ease(clamp01((t-0.1)*3))*400} height={3} rx="1.5" fill={P.blue} opacity={tOp * 0.85} />

          <text x={W/2} y={108} textAnchor="middle" fill={P.muted} fontSize="14"
            fontFamily="'Inter',sans-serif" opacity={sOp}>
            Simulating Atomic Motion Through Classical Mechanics
          </text>
          <text x={W/2} y={128} textAnchor="middle" fill={P.purple} fontSize="11"
            fontFamily="'Inter',sans-serif" opacity={sOp * 0.85}>
            Newton's Laws · Verlet · Lennard-Jones · Thermostats · Properties
          </text>

          {/* Newton equation box */}
          <rect x={W/2-180} y={310} width={360} height={62} rx="10"
            fill={P.surface} stroke={P.border} strokeWidth="1.5" opacity={eqOp} />
          <rect x={W/2-180} y={310} width={360} height={3} rx="1.5" fill={P.green} opacity={eqOp} />
          <text x={W/2} y={330} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={eqOp}>Newton's equation of motion — the heart of MD</text>
          <text x={W/2} y={350} textAnchor="middle" fill={P.green} fontSize="16" fontWeight="700"
            fontFamily="'Fira Code','Consolas',monospace" opacity={eqOp}>F = m·a = m·d²r/dt²</text>
          <text x={W/2} y={365} textAnchor="middle" fill={P.muted} fontSize="9"
            fontFamily="'Inter',sans-serif" opacity={eqOp * 0.8}>solve numerically for every atom at each timestep</text>

          <text x={W/2} y={395} textAnchor="middle" fill={P.muted} fontSize="10"
            fontFamily="'Inter',sans-serif" opacity={aOp}>
            Habibur Rahman · Purdue University
          </text>
          <text x={W/2} y={410} textAnchor="middle" fill={P.dim} fontSize="9"
            fontFamily="'Inter',sans-serif" opacity={aOp}>
            rahma103@purdue.edu
          </text>
        </svg>
      );
    }

    // ── 2. NEWTON'S LAWS ──────────────────────────────────────────────────
    case "newtons_laws": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Newton's 2nd Law:",              color: P.blue,   delay: 0.04 },
        { text: "",                               color: P.muted,  delay: 0.07 },
        { text: "Fᵢ = mᵢ · aᵢ",                 color: P.ink,    delay: 0.10 },
        { text: "",                               color: P.muted,  delay: 0.14 },
        { text: "Force on atom i:",               color: P.blue,   delay: 0.17 },
        { text: "Fᵢ = -∇ᵢ V(r₁, r₂, ... rN)",    color: P.green,  delay: 0.21 },
        { text: "  (gradient of potential)",       color: P.muted,  delay: 0.25 },
        { text: "",                               color: P.muted,  delay: 0.28 },
        { text: "Acceleration:",                  color: P.amber,  delay: 0.31 },
        { text: "aᵢ = Fᵢ / mᵢ",                 color: P.amber,  delay: 0.35 },
        { text: "",                               color: P.muted,  delay: 0.38 },
        { text: "Velocity update:",               color: P.purple, delay: 0.41 },
        { text: "vᵢ(t+Δt) = vᵢ(t) + aᵢ·Δt",     color: P.purple, delay: 0.45 },
        { text: "",                               color: P.muted,  delay: 0.48 },
        { text: "Position update:",               color: P.teal,   delay: 0.51 },
        { text: "rᵢ(t+Δt) = rᵢ(t) + vᵢ·Δt",     color: P.teal,   delay: 0.55 },
        { text: "",                               color: P.muted,  delay: 0.58 },
        { text: "Typical Δt = 1-2 femtoseconds",  color: P.red,    delay: 0.62 },
        { text: "  (10⁻¹⁵ seconds!)",             color: P.muted,  delay: 0.66 },
      ];

      // Animated atoms with force vectors
      const atomPositions = [
        { x: 520, y: 120, r: 18, color: P.blue,  label: "Ar", fx: -35, fy: 20 },
        { x: 620, y: 180, r: 16, color: P.red,   label: "Ne", fx: 25, fy: -30 },
        { x: 560, y: 260, r: 20, color: P.green, label: "Xe", fx: 15, fy: 25 },
        { x: 680, y: 130, r: 14, color: P.amber, label: "Kr", fx: -20, fy: 15 },
        { x: 470, y: 200, r: 15, color: P.purple,label: "He", fx: 30, fy: -10 },
      ];

      const forceOp = ease(clamp01((t - 0.25) * 4));
      const accelOp = ease(clamp01((t - 0.40) * 4));
      const moveT = clamp01((t - 0.60) * 2.5);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Newton's Laws of Motion</text>
          <line x1={390} y1={32} x2={390} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel — equations */}
          <rect x={LX} y={32} width={360} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+14} y={55 + i*18} fill={ln.color} fontSize="10.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel — atoms with force vectors */}
          <rect x={400} y={32} width={350} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={575} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            Forces and Accelerations
          </text>

          {/* Simulation box */}
          <rect x={420} y={60} width={320} height={260} rx="6"
            fill="none" stroke={P.dim} strokeWidth="1" opacity={ease(clamp01((t-0.08)*5))*0.6} />

          {/* Atoms */}
          {atomPositions.map((atom, i) => {
            const op = ease(clamp01((t - 0.10 - i*0.04) * 5));
            const mx = atom.x + atom.fx * moveT * 0.5;
            const my = atom.y + atom.fy * moveT * 0.5;
            return (
              <g key={i} opacity={op}>
                {/* Force arrow */}
                {forceOp > 0 && (
                  <g opacity={forceOp}>
                    <line x1={mx} y1={my} x2={mx + atom.fx * 1.2} y2={my + atom.fy * 1.2}
                      stroke={P.warn} strokeWidth="2" markerEnd="url(#arrowRed)" />
                    <text x={mx + atom.fx * 1.4} y={my + atom.fy * 1.4} fill={P.warn}
                      fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif"
                      textAnchor="middle">F</text>
                  </g>
                )}
                {/* Acceleration arrow */}
                {accelOp > 0 && (
                  <g opacity={accelOp * 0.7}>
                    <line x1={mx} y1={my} x2={mx + atom.fx * 0.7} y2={my + atom.fy * 0.7}
                      stroke={P.amber} strokeWidth="1.5" strokeDasharray="4,2" />
                    <text x={mx + atom.fx * 0.85} y={my + atom.fy * 0.85 - 6} fill={P.amber}
                      fontSize="7" fontFamily="'Inter',sans-serif" textAnchor="middle">a</text>
                  </g>
                )}
                {/* Atom circle */}
                <circle cx={mx} cy={my} r={atom.r} fill={atom.color+"28"} stroke={atom.color} strokeWidth="2" />
                <text x={mx} y={my + 4} textAnchor="middle" fill={atom.color}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{atom.label}</text>
              </g>
            );
          })}

          {/* Arrow marker definitions */}
          <defs>
            <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill={P.warn} />
            </marker>
          </defs>

          {/* Legend */}
          <g opacity={ease(clamp01((t-0.50)*4))}>
            <rect x={420} y={332} width={320} height={74} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <line x1={432} y1={350} x2={455} y2={350} stroke={P.warn} strokeWidth="2"/>
            <text x={462} y={354} fill={P.warn} fontSize="9" fontFamily="'Inter',sans-serif">Force vectors (F = -∇V)</text>
            <line x1={432} y1={370} x2={455} y2={370} stroke={P.amber} strokeWidth="1.5" strokeDasharray="4,2"/>
            <text x={462} y={374} fill={P.amber} fontSize="9" fontFamily="'Inter',sans-serif">Acceleration (a = F/m)</text>
            <text x={435} y={396} fill={P.muted} fontSize="8.5" fontFamily="'Inter',sans-serif">
              Atoms move under pairwise interatomic forces
            </text>
          </g>
        </svg>
      );
    }

    // ── 3. VERLET INTEGRATION ──────────────────────────────────────────────
    case "verlet": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Velocity Verlet Algorithm:",       color: P.blue,   delay: 0.04 },
        { text: "",                                 color: P.muted,  delay: 0.08 },
        { text: "Step 1: Half-kick velocities",     color: P.muted,  delay: 0.11 },
        { text: "v(t+½Δt) = v(t) + ½a(t)·Δt",     color: P.green,  delay: 0.15 },
        { text: "",                                 color: P.muted,  delay: 0.19 },
        { text: "Step 2: Update positions",         color: P.muted,  delay: 0.22 },
        { text: "r(t+Δt) = r(t) + v(t+½Δt)·Δt",   color: P.amber,  delay: 0.26 },
        { text: "",                                 color: P.muted,  delay: 0.30 },
        { text: "Step 3: Compute new forces",       color: P.muted,  delay: 0.33 },
        { text: "F(t+Δt) = -∇V(r(t+Δt))",         color: P.red,    delay: 0.37 },
        { text: "a(t+Δt) = F(t+Δt)/m",            color: P.red,    delay: 0.41 },
        { text: "",                                 color: P.muted,  delay: 0.44 },
        { text: "Step 4: Full-kick velocities",     color: P.muted,  delay: 0.47 },
        { text: "v(t+Δt) = v(t+½Δt) + ½a(t+Δt)·Δt", color: P.purple, delay: 0.51 },
        { text: "",                                 color: P.muted,  delay: 0.55 },
        { text: "Störmer-Verlet (original):",       color: P.teal,   delay: 0.58 },
        { text: "r(t+Δt) = 2r(t) - r(t-Δt)",      color: P.teal,   delay: 0.62 },
        { text: "         + a(t)·Δt²",             color: P.teal,   delay: 0.65 },
        { text: "",                                 color: P.muted,  delay: 0.68 },
        { text: "Time-reversible & symplectic!",    color: P.ok,     delay: 0.72 },
        { text: "Energy conserved over long runs",  color: P.ok,     delay: 0.76 },
      ];

      // Animated atom with position trail
      const trailSteps = 12;
      const baseX = 550, baseY = 200;
      const trailRadius = 80;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Verlet Integration</text>
          <line x1={390} y1={32} x2={390} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel — algorithm */}
          <rect x={LX} y={32} width={370} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+12} y={52 + i*17} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel — trajectory animation */}
          <rect x={400} y={32} width={350} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={575} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            Position Update with Trail
          </text>

          {/* Trail dots */}
          {Array.from({ length: trailSteps }).map((_, i) => {
            const frac = i / trailSteps;
            const showT = clamp01(t * 1.3 - frac * 0.3);
            if (showT <= 0) return null;
            const angle = frac * Math.PI * 2.5;
            const px = baseX + trailRadius * Math.cos(angle) * (0.6 + 0.4 * Math.sin(frac * 3));
            const py = baseY + trailRadius * Math.sin(angle) * 0.7;
            const op = ease(clamp01(showT * 3)) * (0.3 + 0.7 * frac);
            return (
              <g key={i}>
                <circle cx={px} cy={py} r={3} fill={P.blue} opacity={op * 0.5} />
                {i > 0 && (() => {
                  const prevAngle = ((i - 1) / trailSteps) * Math.PI * 2.5;
                  const prevFrac = (i - 1) / trailSteps;
                  const ppx = baseX + trailRadius * Math.cos(prevAngle) * (0.6 + 0.4 * Math.sin(prevFrac * 3));
                  const ppy = baseY + trailRadius * Math.sin(prevAngle) * 0.7;
                  return (
                    <line x1={ppx} y1={ppy} x2={px} y2={py}
                      stroke={P.blue} strokeWidth="1" opacity={op * 0.4} />
                  );
                })()}
              </g>
            );
          })}

          {/* Current atom position */}
          {(() => {
            const curAngle = t * Math.PI * 2.5;
            const curFrac = t;
            const cx = baseX + trailRadius * Math.cos(curAngle) * (0.6 + 0.4 * Math.sin(curFrac * 3));
            const cy = baseY + trailRadius * Math.sin(curAngle) * 0.7;
            return (
              <g opacity={ease(clamp01(t * 5))}>
                <circle cx={cx} cy={cy} r={14} fill={P.blue+"30"} stroke={P.blue} strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r={20} fill="none" stroke={P.blue} strokeWidth="1" opacity={0.3} />
                <text x={cx} y={cy + 4} textAnchor="middle" fill={P.blue}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">r(t)</text>
                {/* Velocity arrow */}
                {ease(clamp01((t - 0.2) * 4)) > 0 && (() => {
                  const vAngle = curAngle + Math.PI / 2;
                  const vLen = 35;
                  const vx = cx + vLen * Math.cos(vAngle);
                  const vy = cy + vLen * Math.sin(vAngle) * 0.7;
                  return (
                    <g opacity={ease(clamp01((t - 0.2) * 4))}>
                      <line x1={cx} y1={cy} x2={vx} y2={vy}
                        stroke={P.green} strokeWidth="2" markerEnd="url(#arrowGreen)" />
                      <text x={vx + 5} y={vy} fill={P.green} fontSize="8" fontWeight="700"
                        fontFamily="'Inter',sans-serif">v</text>
                    </g>
                  );
                })()}
              </g>
            );
          })()}

          <defs>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill={P.green} />
            </marker>
          </defs>

          {/* Time steps labels */}
          <g opacity={ease(clamp01((t-0.30)*4))}>
            <rect x={420} y={310} width={310} height={95} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={575} y={330} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Verlet Properties</text>
            {[
              { label: "Time-reversible", icon: "\u2713", color: P.ok, y: 348 },
              { label: "Symplectic (preserves phase space)", icon: "\u2713", color: P.ok, y: 364 },
              { label: "O(\u0394t\u00B2) local error, O(\u0394t\u00B2) global", icon: "\u2713", color: P.ok, y: 380 },
              { label: "Excellent long-term energy conservation", icon: "\u2713", color: P.ok, y: 396 },
            ].map((prop, i) => (
              <g key={i} opacity={ease(clamp01((t - 0.40 - i * 0.06) * 5))}>
                <text x={435} y={prop.y} fill={prop.color} fontSize="9" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{prop.icon}</text>
                <text x={448} y={prop.y} fill={P.muted} fontSize="9"
                  fontFamily="'Inter',sans-serif">{prop.label}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // ── 4. LENNARD-JONES ──────────────────────────────────────────────────
    case "lennard_jones": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Lennard-Jones Potential:",         color: P.blue,   delay: 0.04 },
        { text: "",                                 color: P.muted,  delay: 0.08 },
        { text: "V(r) = 4ε [(σ/r)¹² - (σ/r)⁶]",  color: P.ink,    delay: 0.12 },
        { text: "",                                 color: P.muted,  delay: 0.16 },
        { text: "ε = depth of potential well",      color: P.green,  delay: 0.20 },
        { text: "σ = distance at V=0",              color: P.amber,  delay: 0.24 },
        { text: "",                                 color: P.muted,  delay: 0.28 },
        { text: "(σ/r)¹² → Pauli repulsion",       color: P.red,    delay: 0.32 },
        { text: "  (short range, very steep!)",     color: P.muted,  delay: 0.36 },
        { text: "",                                 color: P.muted,  delay: 0.39 },
        { text: "-(σ/r)⁶ → van der Waals",        color: P.purple, delay: 0.42 },
        { text: "  (London dispersion, longer range)", color: P.muted, delay: 0.46 },
        { text: "",                                 color: P.muted,  delay: 0.50 },
        { text: "Minimum at r = 2^(1/6) · σ",      color: P.teal,   delay: 0.53 },
        { text: "  ≈ 1.122 σ",                     color: P.teal,   delay: 0.57 },
        { text: "",                                 color: P.muted,  delay: 0.60 },
        { text: "Force: F = -dV/dr",               color: P.blue,   delay: 0.63 },
        { text: "F(r) = 24ε/r [2(σ/r)¹²-(σ/r)⁶]", color: P.blue,   delay: 0.67 },
      ];

      // LJ potential curve
      const curveOp = ease(clamp01((t - 0.10) * 4));
      const curveX0 = 420, curveY0 = 280, curveW = 310, curveH = 220;
      const sigma = 0.22; // fraction of curveW
      const epsilon = 0.6; // fraction of curveH

      const ljPoints = [];
      for (let i = 0; i <= 100; i++) {
        const frac = 0.15 + i * 0.85 / 100; // r/sigma from ~0.8 to ~3.5
        const rSig = 0.8 + frac * 2.7;
        const sig_r = 1 / rSig;
        const vLJ = 4 * (Math.pow(sig_r, 12) - Math.pow(sig_r, 6));
        const clampedV = Math.max(-1.2, Math.min(4, vLJ));
        const px = curveX0 + 30 + (i / 100) * (curveW - 50);
        const py = curveY0 - (clampedV / 5) * curveH * 0.8;
        ljPoints.push(`${px},${py}`);
      }

      // Repulsive part (red) and attractive part (blue)
      const repPoints = [];
      const attPoints = [];
      for (let i = 0; i <= 100; i++) {
        const rSig = 0.8 + (0.15 + i * 0.85 / 100) * 2.7;
        const sig_r = 1 / rSig;
        const rep = 4 * Math.pow(sig_r, 12);
        const att = -4 * Math.pow(sig_r, 6);
        const px = curveX0 + 30 + (i / 100) * (curveW - 50);
        repPoints.push(`${px},${curveY0 - (Math.min(4, rep) / 5) * curveH * 0.8}`);
        attPoints.push(`${px},${curveY0 - (Math.max(-1.2, att) / 5) * curveH * 0.8}`);
      }

      // Two approaching atoms
      const atomApproachT = clamp01((t - 0.35) * 2);
      const atom1X = curveX0 + 60;
      const atom2X = lerp(curveX0 + curveW - 40, curveX0 + 130, ease(atomApproachT));
      const atomY = 90;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Lennard-Jones Potential</text>
          <line x1={400} y1={32} x2={400} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel */}
          <rect x={LX} y={32} width={380} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+14} y={52 + i*18.5} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel */}
          <rect x={410} y={32} width={340} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {/* Two atoms approaching */}
          <g opacity={ease(clamp01((t-0.08)*5))}>
            <text x={575} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
              fontFamily="'Inter',sans-serif">Two Atoms Interacting</text>

            {/* Atom 1 */}
            <circle cx={atom1X} cy={atomY} r={18} fill={P.blue+"28"} stroke={P.blue} strokeWidth="2" />
            <text x={atom1X} y={atomY+4} textAnchor="middle" fill={P.blue}
              fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">A</text>

            {/* Atom 2 */}
            <circle cx={atom2X} cy={atomY} r={18} fill={P.red+"28"} stroke={P.red} strokeWidth="2" />
            <text x={atom2X} y={atomY+4} textAnchor="middle" fill={P.red}
              fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">B</text>

            {/* Distance label */}
            <line x1={atom1X+20} y1={atomY+28} x2={atom2X-20} y2={atomY+28}
              stroke={P.muted} strokeWidth="1" />
            <text x={(atom1X+atom2X)/2} y={atomY+42} textAnchor="middle" fill={P.amber}
              fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">
              r = {(2.5 - 1.5 * ease(atomApproachT)).toFixed(1)}σ
            </text>

            {/* Repulsion/attraction indication */}
            {atomApproachT > 0.7 && (
              <text x={(atom1X+atom2X)/2} y={atomY-20} textAnchor="middle" fill={P.red}
                fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif"
                opacity={ease(clamp01((atomApproachT-0.7)*5))}>
                ← Repulsion →
              </text>
            )}
            {atomApproachT > 0.2 && atomApproachT <= 0.7 && (
              <text x={(atom1X+atom2X)/2} y={atomY-20} textAnchor="middle" fill={P.green}
                fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif"
                opacity={0.8}>
                → Attraction ←
              </text>
            )}
          </g>

          {/* LJ Curve */}
          <g opacity={curveOp}>
            {/* Axes */}
            <line x1={curveX0+30} y1={curveY0-curveH*0.7} x2={curveX0+30} y2={curveY0+30}
              stroke={P.muted} strokeWidth="1" />
            <line x1={curveX0+20} y1={curveY0} x2={curveX0+curveW} y2={curveY0}
              stroke={P.muted} strokeWidth="1" />
            <text x={curveX0+15} y={curveY0-curveH*0.6} fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif" textAnchor="middle">V(r)</text>
            <text x={curveX0+curveW-5} y={curveY0+15} fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif" textAnchor="middle">r</text>

            {/* Repulsive curve */}
            <polyline points={repPoints.join(" ")} fill="none" stroke={P.red}
              strokeWidth="1" opacity={ease(clamp01((t-0.32)*4)) * 0.5} strokeDasharray="4,3" />
            {/* Attractive curve */}
            <polyline points={attPoints.join(" ")} fill="none" stroke={P.purple}
              strokeWidth="1" opacity={ease(clamp01((t-0.42)*4)) * 0.5} strokeDasharray="4,3" />
            {/* Total LJ curve */}
            <polyline points={ljPoints.join(" ")} fill="none" stroke={P.green}
              strokeWidth="2.5" opacity={0.9} />

            {/* Epsilon marker */}
            <g opacity={ease(clamp01((t-0.25)*4))}>
              <line x1={curveX0+30} y1={curveY0 + curveH*0.8*0.2}
                x2={curveX0+90} y2={curveY0 + curveH*0.8*0.2}
                stroke={P.green} strokeWidth="1" strokeDasharray="3,2" />
              <text x={curveX0+95} y={curveY0 + curveH*0.8*0.2+4} fill={P.green} fontSize="9"
                fontWeight="700" fontFamily="'Inter',sans-serif">-ε</text>
            </g>

            {/* Sigma marker */}
            <g opacity={ease(clamp01((t-0.28)*4))}>
              <line x1={curveX0+68} y1={curveY0} x2={curveX0+68} y2={curveY0+25}
                stroke={P.amber} strokeWidth="1" strokeDasharray="3,2" />
              <text x={curveX0+68} y={curveY0+35} textAnchor="middle" fill={P.amber} fontSize="9"
                fontWeight="700" fontFamily="'Inter',sans-serif">σ</text>
            </g>

            {/* Labels */}
            <text x={curveX0+curveW-40} y={curveY0-curveH*0.5} fill={P.red} fontSize="8"
              fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.35)*4))}>r⁻¹² repulsive</text>
            <text x={curveX0+curveW-50} y={curveY0+25} fill={P.purple} fontSize="8"
              fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.45)*4))}>-r⁻⁶ attractive</text>
          </g>
        </svg>
      );
    }

    // ── 5. THERMOSTATS ──────────────────────────────────────────────────
    case "thermostats": {
      const tOp = ease(clamp01(t * 4));

      const eqLines = [
        { text: "Statistical Ensembles:",           color: P.blue,   delay: 0.04 },
        { text: "",                                 color: P.muted,  delay: 0.07 },
        { text: "NVE (Microcanonical):",            color: P.green,  delay: 0.10 },
        { text: "  E = const, no thermostat",       color: P.muted,  delay: 0.14 },
        { text: "  Natural MD — just F=ma",         color: P.muted,  delay: 0.17 },
        { text: "",                                 color: P.muted,  delay: 0.20 },
        { text: "NVT (Canonical):",                 color: P.amber,  delay: 0.23 },
        { text: "  T = const, fixed volume",        color: P.muted,  delay: 0.26 },
        { text: "  Nosé-Hoover thermostat:",        color: P.amber,  delay: 0.29 },
        { text: "  ṗᵢ = Fᵢ - ξ·pᵢ",               color: P.ink,    delay: 0.33 },
        { text: "  ξ̇ = (T - T₀) / Q",              color: P.ink,    delay: 0.37 },
        { text: "  Q = coupling constant",          color: P.muted,  delay: 0.40 },
        { text: "",                                 color: P.muted,  delay: 0.43 },
        { text: "NPT (Isothermal-Isobaric):",      color: P.purple, delay: 0.46 },
        { text: "  T,P = const, V varies",          color: P.muted,  delay: 0.49 },
        { text: "  Barostat rescales box size",     color: P.muted,  delay: 0.52 },
        { text: "",                                 color: P.muted,  delay: 0.55 },
        { text: "Berendsen (simple):",              color: P.teal,   delay: 0.58 },
        { text: "  λ = [1 + Δt/τ(T₀/T-1)]^½",     color: P.teal,   delay: 0.62 },
        { text: "  v_new = λ · v_old",              color: P.teal,   delay: 0.65 },
        { text: "  (does NOT give canonical!)",     color: P.red,    delay: 0.69 },
      ];

      // Temperature visualization
      const tempBarOp = ease(clamp01((t - 0.15) * 4));
      const targetT = 300;

      // Velocity rescaling animation
      const rescaleT = clamp01((t - 0.35) * 2);

      // Jiggling atoms to show temperature
      const thermoAtoms = [
        { x: 500, y: 160 }, { x: 540, y: 140 }, { x: 580, y: 170 },
        { x: 520, y: 200 }, { x: 560, y: 190 }, { x: 600, y: 150 },
        { x: 490, y: 220 }, { x: 640, y: 180 }, { x: 540, y: 230 },
        { x: 580, y: 220 }, { x: 620, y: 210 }, { x: 660, y: 160 },
      ];

      // Current T oscillates then settles to target
      const currentT = lerp(420, targetT, ease(clamp01(t * 1.5)))
        + Math.sin(t * 20) * lerp(50, 2, clamp01(t * 1.5));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Thermostats & Ensembles</text>
          <line x1={400} y1={32} x2={400} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel */}
          <rect x={LX} y={32} width={380} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {eqLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+14} y={52 + i*17} fill={ln.color} fontSize="9.5"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel */}
          <rect x={410} y={32} width={340} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={580} y={52} textAnchor="middle" fill={P.amber} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            Temperature Control (NVT)
          </text>

          {/* Simulation box with jiggling atoms */}
          <rect x={430} y={120} width={270} height={150} rx="6"
            fill="none" stroke={P.dim} strokeWidth="1" opacity={tOp * 0.6} />
          {thermoAtoms.map((atom, i) => {
            const jiggle = 6 * Math.sin(t * 30 + i * 2.1) * lerp(1, 0.3, ease(clamp01(t * 1.5)));
            const jiggleY = 5 * Math.cos(t * 25 + i * 1.7) * lerp(1, 0.3, ease(clamp01(t * 1.5)));
            const op = ease(clamp01((t - 0.08 - i*0.02) * 5));
            const hue = currentT > targetT + 20 ? P.red : currentT < targetT - 20 ? P.blue : P.amber;
            return (
              <circle key={i} cx={atom.x + jiggle} cy={atom.y + jiggleY} r={8}
                fill={hue+"30"} stroke={hue} strokeWidth="1.5" opacity={op} />
            );
          })}

          {/* Temperature display */}
          <g opacity={tempBarOp}>
            {/* Thermometer */}
            <rect x={710} y={130} width={18} height={130} rx="9" fill={P.panel} stroke={P.border} strokeWidth="1" />
            <rect x={712} y={lerp(255, 135, clamp01((currentT - 100) / 500))} width={14}
              height={260 - lerp(255, 135, clamp01((currentT - 100) / 500))} rx="7"
              fill={currentT > targetT + 20 ? P.red : currentT < targetT - 20 ? P.blue : P.amber} opacity={0.8} />
            <circle cx={719} cy={270} r={12} fill={currentT > targetT + 20 ? P.red : P.amber} opacity={0.8} />
            <text x={719} y={274} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700"
              fontFamily="'Inter',sans-serif">T</text>

            {/* Target line */}
            <line x1={706} y1={lerp(255, 135, clamp01((targetT - 100) / 500))}
              x2={735} y2={lerp(255, 135, clamp01((targetT - 100) / 500))}
              stroke={P.ok} strokeWidth="1.5" strokeDasharray="3,2" />
            <text x={738} y={lerp(255, 135, clamp01((targetT - 100) / 500)) + 4} fill={P.ok} fontSize="8"
              fontFamily="'Inter',sans-serif">T₀</text>
          </g>

          {/* Current temperature readout */}
          <g opacity={tempBarOp}>
            <rect x={430} y={65} width={160} height={46} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={440} y={82} fill={P.muted} fontSize="9" fontFamily="'Inter',sans-serif">Current T:</text>
            <text x={525} y={82} fill={currentT > targetT + 20 ? P.red : P.amber} fontSize="11" fontWeight="700"
              fontFamily="'Fira Code','Consolas',monospace">{Math.round(currentT)} K</text>
            <text x={440} y={102} fill={P.muted} fontSize="9" fontFamily="'Inter',sans-serif">Target T₀:</text>
            <text x={525} y={102} fill={P.ok} fontSize="11" fontWeight="700"
              fontFamily="'Fira Code','Consolas',monospace">{targetT} K</text>
          </g>

          {/* Ensemble comparison */}
          <g opacity={ease(clamp01((t-0.55)*4))}>
            <rect x={430} y={290} width={300} height={105} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={580} y={310} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Ensemble Comparison</text>
            {[
              { name: "NVE", fixed: "N, V, E", varies: "T, P", color: P.green },
              { name: "NVT", fixed: "N, V, T", varies: "E, P", color: P.amber },
              { name: "NPT", fixed: "N, P, T", varies: "E, V", color: P.purple },
            ].map((ens, i) => (
              <g key={i} opacity={ease(clamp01((t - 0.58 - i * 0.06) * 5))}>
                <rect x={440} y={318 + i * 24} width={45} height={18} rx="4"
                  fill={ens.color+"20"} stroke={ens.color+"60"} strokeWidth="1" />
                <text x={462} y={331 + i * 24} textAnchor="middle" fill={ens.color}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{ens.name}</text>
                <text x={498} y={331 + i * 24} fill={P.muted} fontSize="8.5"
                  fontFamily="'Inter',sans-serif">Fixed: {ens.fixed}</text>
                <text x={620} y={331 + i * 24} fill={P.dim} fontSize="8.5"
                  fontFamily="'Inter',sans-serif">Varies: {ens.varies}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // ── ENSEMBLES — NVE / NVT / NPT with analogies & animations ──────
    case "ensembles": {
      const tOp = ease(clamp01(t * 4));
      const W_=W, H_=H;

      // Sub-phase timing (3 ensembles, each ~1/3 of the scene)
      const phase = t < 0.33 ? 0 : t < 0.66 ? 1 : 2; // NVE, NVT, NPT
      const phaseT = t < 0.33 ? t / 0.33 : t < 0.66 ? (t - 0.33) / 0.33 : (t - 0.66) / 0.34;

      const ensembles = [
        {
          name: "NVE", subtitle: "Microcanonical",
          color: P.green, fixed: "N, V, E", varies: "T, P",
          analogy: "A perfectly insulated thermos — no heat in or out, total energy stays constant.",
          icon: "E",
          desc: [
            "No thermostat, no barostat",
            "Total energy E = KE + PE = const",
            "Natural Newtonian dynamics: F = ma",
            "T fluctuates around average",
          ],
        },
        {
          name: "NVT", subtitle: "Canonical",
          color: P.amber, fixed: "N, V, T", varies: "E, P",
          analogy: "A lab experiment in a water bath — the bath keeps temperature constant no matter what.",
          icon: "T",
          desc: [
            "Thermostat controls temperature",
            "Nosé-Hoover: ṗᵢ = Fᵢ - ξ·pᵢ",
            "Energy exchanges with heat bath",
            "Most common for equilibrium sims",
          ],
        },
        {
          name: "NPT", subtitle: "Isothermal-Isobaric",
          color: P.purple, fixed: "N, P, T", varies: "E, V",
          analogy: "A balloon in a room — pressure and temperature match the surroundings, volume adjusts freely.",
          icon: "P",
          desc: [
            "Thermostat + Barostat",
            "Box volume V changes to fix P",
            "Closest to real lab conditions",
            "Used for density & phase transitions",
          ],
        },
      ];

      const ens = ensembles[phase];
      const eOp = ease(clamp01(phaseT * 3));

      // Atoms for animation — 15 atoms in a box
      const baseAtoms = [];
      for (let i = 0; i < 15; i++) {
        baseAtoms.push({
          x: 470 + (i % 5) * 55 + 10,
          y: 100 + Math.floor(i / 5) * 55 + 10,
          color: [P.blue, P.red, P.green, P.amber, P.purple, P.teal, P.pink][i % 7],
        });
      }

      // NVE: constant energy, atoms jiggle freely, box stays same
      // NVT: atoms slow down/speed up, thermostat bar shown, box stays same
      // NPT: box expands/contracts, atoms redistribute

      const boxX = 440, boxY = 75;
      const boxBaseW = 280, boxBaseH = 250;

      // NPT box breathing
      const boxScale = phase === 2 ? 1 + 0.06 * Math.sin(phaseT * Math.PI * 4) : 1;
      const boxW = boxBaseW * boxScale;
      const boxH = boxBaseH * boxScale;
      const boxOffX = (boxBaseW - boxW) / 2;
      const boxOffY = (boxBaseH - boxH) / 2;

      // NVE: constant speed jiggle
      // NVT: jiggle dampens then stabilizes (thermostat effect)
      // NPT: jiggle + position shift with box
      const jiggleAmp = phase === 1
        ? lerp(8, 4, ease(clamp01(phaseT * 2))) // NVT: dampens
        : phase === 0 ? 6 : 5; // NVE: constant, NPT: moderate

      // NVT temperature bar
      const nvtTemp = phase === 1
        ? lerp(450, 300, ease(clamp01(phaseT * 2))) + Math.sin(phaseT * 20) * lerp(30, 2, clamp01(phaseT * 2))
        : phase === 0
          ? 300 + 40 * Math.sin(phaseT * 15) // NVE: fluctuates
          : 300 + 5 * Math.sin(phaseT * 10); // NPT: stable

      // Phase indicator pills
      const pillY = 48;

      return (
        <svg viewBox={`0 0 ${W_} ${H_}`} style={{ width: "100%" }}>
          <rect width={W_} height={H_} fill={P.bg} />
          <text x={W_/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Statistical Ensembles</text>

          {/* Phase pills at top */}
          {ensembles.map((e, i) => {
            const active = i === phase;
            const px = W_/2 + (i - 1) * 120 - 50;
            return (
              <g key={i} opacity={tOp}>
                <rect x={px} y={pillY} width={100} height={24} rx={12}
                  fill={active ? e.color + "30" : P.surface}
                  stroke={active ? e.color : P.border} strokeWidth={active ? 2 : 1} />
                <text x={px + 50} y={pillY + 16} textAnchor="middle"
                  fill={active ? e.color : P.muted} fontSize="10" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{e.name}</text>
              </g>
            );
          })}

          <line x1={410} y1={78} x2={410} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp * 0.5} />

          {/* LEFT PANEL — Info */}
          <rect x={LX} y={78} width={390} height={330} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />

          {/* Ensemble name + subtitle */}
          <text x={LX + 14} y={100} fill={ens.color} fontSize="16" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={eOp}>{ens.name}</text>
          <text x={LX + 14 + ens.name.length * 11} y={100} fill={P.muted} fontSize="11"
            fontFamily="'Inter',sans-serif" opacity={eOp}> — {ens.subtitle}</text>

          {/* Fixed / Varies */}
          <g opacity={ease(clamp01((phaseT - 0.05) * 4))}>
            <rect x={LX + 14} y={110} width={170} height={24} rx={5}
              fill={ens.color + "15"} stroke={ens.color + "40"} strokeWidth="1" />
            <text x={LX + 22} y={126} fill={ens.color} fontSize="10" fontWeight="700"
              fontFamily="'Fira Code','Consolas',monospace">Fixed: {ens.fixed}</text>
            <rect x={LX + 195} y={110} width={170} height={24} rx={5}
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={LX + 203} y={126} fill={P.muted} fontSize="10" fontWeight="600"
              fontFamily="'Fira Code','Consolas',monospace">Varies: {ens.varies}</text>
          </g>

          {/* Description lines */}
          {ens.desc.map((line, i) => (
            <text key={i} x={LX + 20} y={158 + i * 20} fill={P.ink} fontSize="10"
              fontFamily="'Fira Code','Consolas',monospace"
              opacity={ease(clamp01((phaseT - 0.08 - i * 0.04) * 5))}>
              • {line}
            </text>
          ))}

          {/* Analogy box */}
          <g opacity={ease(clamp01((phaseT - 0.30) * 4))}>
            <rect x={LX + 10} y={250} width={370} height={70} rx="8"
              fill={ens.color + "08"} stroke={ens.color + "35"} strokeWidth="1.5" />
            <text x={LX + 24} y={270} fill={ens.color} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">💡 Real-world analogy:</text>
            <text x={LX + 24} y={290} fill={P.ink} fontSize="9.5"
              fontFamily="'Inter',sans-serif" opacity={0.85}>{ens.analogy.substring(0, 55)}</text>
            {ens.analogy.length > 55 && (
              <text x={LX + 24} y={306} fill={P.ink} fontSize="9.5"
                fontFamily="'Inter',sans-serif" opacity={0.85}>{ens.analogy.substring(55)}</text>
            )}
          </g>

          {/* Analogy icon */}
          <g opacity={ease(clamp01((phaseT - 0.35) * 4))}>
            {phase === 0 && (
              <g>
                {/* Thermos icon for NVE */}
                <rect x={LX + 320} y={340} width={40} height={55} rx="6"
                  fill={P.green + "20"} stroke={P.green} strokeWidth="1.5" />
                <rect x={LX + 326} y={336} width={28} height={8} rx="3"
                  fill={P.green} opacity={0.6} />
                <text x={LX + 340} y={374} textAnchor="middle" fill={P.green}
                  fontSize="10" fontWeight="700">E</text>
                <line x1={LX + 316} y1={355} x2={LX + 316} y2={385}
                  stroke={P.red + "50"} strokeWidth="2" strokeDasharray="3,3" />
                <text x={LX + 310} y={370} textAnchor="end" fill={P.red}
                  fontSize="7" opacity={0.7}>✗ heat</text>
              </g>
            )}
            {phase === 1 && (
              <g>
                {/* Water bath icon for NVT */}
                <rect x={LX + 300} y={340} width={80} height={55} rx="6"
                  fill={P.amber + "15"} stroke={P.amber} strokeWidth="1.5" />
                <rect x={LX + 310} y={348} width={25} height={35} rx="4"
                  fill={P.panel} stroke={P.amber + "60"} strokeWidth="1" />
                <text x={LX + 322} y={370} textAnchor="middle" fill={P.amber}
                  fontSize="8" fontWeight="700">sys</text>
                {/* Wavy water lines */}
                {[0, 1, 2].map(i => (
                  <path key={i} d={`M${LX + 340} ${358 + i * 10} q5 ${3 * Math.sin(phaseT * 10 + i)} 10 0 q5 ${-3 * Math.sin(phaseT * 10 + i)} 10 0`}
                    fill="none" stroke={P.amber} strokeWidth="1" opacity={0.5} />
                ))}
                <text x={LX + 360} y={370} fill={P.amber}
                  fontSize="8" fontWeight="600">bath</text>
              </g>
            )}
            {phase === 2 && (
              <g>
                {/* Balloon icon for NPT */}
                <ellipse cx={LX + 340} cy={360} rx={20 + 4 * Math.sin(phaseT * Math.PI * 4)}
                  ry={25 + 5 * Math.sin(phaseT * Math.PI * 4)}
                  fill={P.purple + "20"} stroke={P.purple} strokeWidth="1.5" />
                <line x1={LX + 340} y1={385 + 5 * Math.sin(phaseT * Math.PI * 4)}
                  x2={LX + 340} y2={400}
                  stroke={P.purple} strokeWidth="1.5" />
                <text x={LX + 340} y={365} textAnchor="middle" fill={P.purple}
                  fontSize="9" fontWeight="700">V</text>
              </g>
            )}
          </g>

          {/* RIGHT PANEL — Animated simulation box */}
          <rect x={boxX + boxOffX - 4} y={boxY + boxOffY - 4} width={boxW + 8} height={boxH + 8} rx="8"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp * 0.4} />

          {/* Simulation box */}
          <rect x={boxX + boxOffX} y={boxY + boxOffY} width={boxW} height={boxH} rx="4"
            fill="none" stroke={ens.color + "60"} strokeWidth={phase === 2 ? 2 : 1.5}
            strokeDasharray={phase === 2 ? "6,3" : "none"} opacity={eOp} />

          {/* Box label */}
          <text x={boxX + boxBaseW / 2} y={boxY + boxOffY - 10} textAnchor="middle"
            fill={ens.color} fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif"
            opacity={eOp}>
            {phase === 0 ? "Isolated Box (no heat exchange)" : phase === 1 ? "Box + Thermostat (T controlled)" : "Flexible Box (V adjusts for P)"}
          </text>

          {/* Atoms in box */}
          {baseAtoms.map((atom, i) => {
            const jx = jiggleAmp * Math.sin(phaseT * 25 + i * 2.1);
            const jy = jiggleAmp * Math.cos(phaseT * 20 + i * 1.7);
            const sx = phase === 2 ? boxScale : 1;
            const ax = boxX + boxOffX + (atom.x - boxX) * sx + jx;
            const ay = boxY + boxOffY + (atom.y - boxY) * sx + jy;
            const atomOp = ease(clamp01((phaseT - 0.02 - i * 0.01) * 5));
            // NVT: color shifts based on temperature control
            const atomColor = phase === 1
              ? (nvtTemp > 350 ? P.red : nvtTemp < 250 ? P.blue : P.amber)
              : atom.color;
            return (
              <g key={i} opacity={atomOp}>
                {/* Velocity arrow */}
                <line x1={ax} y1={ay}
                  x2={ax + jx * 1.5} y2={ay + jy * 1.5}
                  stroke={atomColor + "60"} strokeWidth="1" />
                <circle cx={ax} cy={ay} r={9}
                  fill={atomColor + "25"} stroke={atomColor} strokeWidth="1.5" />
              </g>
            );
          })}

          {/* NVE: energy bar (constant) */}
          {phase === 0 && (
            <g opacity={ease(clamp01((phaseT - 0.15) * 4))}>
              <rect x={boxX + boxBaseW + 20} y={boxY + 20} width={16} height={200} rx="8"
                fill={P.panel} stroke={P.border} strokeWidth="1" />
              {/* KE portion */}
              <rect x={boxX + boxBaseW + 22} y={boxY + 20 + 200 * (1 - 0.5 - 0.15 * Math.sin(phaseT * 12))}
                width={12} height={200 * (0.5 + 0.15 * Math.sin(phaseT * 12))} rx="6"
                fill={P.red} opacity={0.7} />
              {/* PE portion */}
              <rect x={boxX + boxBaseW + 22} y={boxY + 22}
                width={12} height={200 * (0.5 - 0.15 * Math.sin(phaseT * 12))} rx="6"
                fill={P.blue} opacity={0.7} />
              <text x={boxX + boxBaseW + 28} y={boxY + 240} textAnchor="middle"
                fill={P.green} fontSize="8" fontWeight="700">E=const</text>
              <text x={boxX + boxBaseW + 44} y={boxY + 80} fill={P.blue}
                fontSize="7" fontWeight="600">PE</text>
              <text x={boxX + boxBaseW + 44} y={boxY + 180} fill={P.red}
                fontSize="7" fontWeight="600">KE</text>
            </g>
          )}

          {/* NVT: temperature gauge */}
          {phase === 1 && (
            <g opacity={ease(clamp01((phaseT - 0.10) * 4))}>
              {/* Thermometer */}
              <rect x={boxX + boxBaseW + 20} y={boxY + 20} width={16} height={180} rx="8"
                fill={P.panel} stroke={P.border} strokeWidth="1" />
              <rect x={boxX + boxBaseW + 22}
                y={boxY + 20 + 180 * (1 - clamp01((nvtTemp - 100) / 500))}
                width={12}
                height={180 * clamp01((nvtTemp - 100) / 500)} rx="6"
                fill={nvtTemp > 350 ? P.red : nvtTemp < 250 ? P.blue : P.amber} opacity={0.7} />
              <circle cx={boxX + boxBaseW + 28} cy={boxY + 210} r={10}
                fill={P.amber} opacity={0.8} />
              <text x={boxX + boxBaseW + 28} y={boxY + 214} textAnchor="middle"
                fill="#fff" fontSize="7" fontWeight="700">T</text>
              {/* Target line */}
              <line x1={boxX + boxBaseW + 16} y1={boxY + 20 + 180 * (1 - clamp01((300 - 100) / 500))}
                x2={boxX + boxBaseW + 42} y2={boxY + 20 + 180 * (1 - clamp01((300 - 100) / 500))}
                stroke={P.ok} strokeWidth="1.5" strokeDasharray="3,2" />
              <text x={boxX + boxBaseW + 46} y={boxY + 20 + 180 * (1 - clamp01((300 - 100) / 500)) + 3}
                fill={P.ok} fontSize="7">T₀=300K</text>
              <text x={boxX + boxBaseW + 28} y={boxY + 240} textAnchor="middle"
                fill={P.amber} fontSize="8" fontWeight="700">{Math.round(nvtTemp)}K</text>
            </g>
          )}

          {/* NPT: pressure + volume indicators */}
          {phase === 2 && (
            <g opacity={ease(clamp01((phaseT - 0.10) * 4))}>
              {/* Arrows showing box expansion/contraction */}
              {[
                { x1: boxX + boxOffX - 10, y1: boxY + boxBaseH / 2, dx: -8, dy: 0 },
                { x1: boxX + boxOffX + boxW + 10, y1: boxY + boxBaseH / 2, dx: 8, dy: 0 },
                { x1: boxX + boxBaseW / 2, y1: boxY + boxOffY - 10, dx: 0, dy: -8 },
                { x1: boxX + boxBaseW / 2, y1: boxY + boxOffY + boxH + 10, dx: 0, dy: 8 },
              ].map((arr, i) => (
                <line key={i} x1={arr.x1} y1={arr.y1}
                  x2={arr.x1 + arr.dx * (1 + 0.5 * Math.sin(phaseT * Math.PI * 4))}
                  y2={arr.y1 + arr.dy * (1 + 0.5 * Math.sin(phaseT * Math.PI * 4))}
                  stroke={P.purple} strokeWidth="2" markerEnd="none" opacity={0.6} />
              ))}
              <text x={boxX + boxBaseW / 2} y={boxY + boxBaseH + 30} textAnchor="middle"
                fill={P.purple} fontSize="9" fontWeight="700">
                V = {(boxScale * 100).toFixed(0)}% | P = const
              </text>
            </g>
          )}

          {/* Bottom comparison strip */}
          <g opacity={ease(clamp01((phaseT - 0.50) * 3))}>
            <rect x={LX} y={H_ - 18} width={W_ - 2 * LX} height={16} rx="4"
              fill={P.panel} stroke={P.border} strokeWidth="0.5" />
            <text x={W_/2} y={H_ - 7} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">
              NVE = isolated thermos | NVT = water bath experiment | NPT = balloon in a room (closest to lab)
            </text>
          </g>
        </svg>
      );
    }

    // ── 7. TIME INTEGRATION LOOP ────────────────────────────────────────
    case "time_loop": {
      const tOp = ease(clamp01(t * 4));

      // MD loop steps
      const steps = [
        { label: "Compute Forces",     desc: "F = -∇V(r)",           color: P.red,    icon: "F" },
        { label: "Update Velocities",  desc: "v += F/m · Δt",        color: P.green,  icon: "v" },
        { label: "Update Positions",   desc: "r += v · Δt",          color: P.blue,   icon: "r" },
        { label: "Apply Constraints",  desc: "SHAKE/RATTLE",         color: P.amber,  icon: "C" },
        { label: "Apply Thermostat",   desc: "Rescale v for T",      color: P.purple, icon: "T" },
        { label: "Output Properties",  desc: "E, T, P, ...",         color: P.teal,   icon: "O" },
      ];

      // Circular loop layout
      const cx = 575, cy = 210, loopR = 110;
      const nSteps = steps.length;

      // Rotating highlight
      const highlightIdx = Math.floor(t * nSteps * 2) % nSteps;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>The MD Time Integration Loop</text>
          <line x1={400} y1={32} x2={400} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel — pseudocode */}
          <rect x={LX} y={32} width={380} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {[
            { text: "MD Algorithm Pseudocode:",     color: P.blue,   delay: 0.04 },
            { text: "",                             color: P.muted,  delay: 0.07 },
            { text: "initialize positions r(0)",    color: P.muted,  delay: 0.10 },
            { text: "initialize velocities v(0)",   color: P.muted,  delay: 0.13 },
            { text: "  from Maxwell-Boltzmann @ T", color: P.dim,    delay: 0.16 },
            { text: "",                             color: P.muted,  delay: 0.19 },
            { text: "for step = 1 to N_steps:",     color: P.ink,    delay: 0.22 },
            { text: "  F = compute_forces(r)",      color: P.red,    delay: 0.26 },
            { text: "  v += 0.5*F/m*dt",            color: P.green,  delay: 0.30 },
            { text: "  r += v*dt",                  color: P.blue,   delay: 0.34 },
            { text: "  F = compute_forces(r)",      color: P.red,    delay: 0.38 },
            { text: "  v += 0.5*F/m*dt",            color: P.green,  delay: 0.42 },
            { text: "  apply_thermostat(v, T₀)",    color: P.purple, delay: 0.46 },
            { text: "  apply_barostat(r, P₀)",      color: P.amber,  delay: 0.50 },
            { text: "  if mod(step, N_out):",       color: P.teal,   delay: 0.54 },
            { text: "    output(r, v, E, T, P)",    color: P.teal,   delay: 0.58 },
            { text: "end for",                      color: P.ink,    delay: 0.62 },
            { text: "",                             color: P.muted,  delay: 0.65 },
            { text: "Typical: 10⁶-10⁹ steps",      color: P.amber,  delay: 0.68 },
            { text: "Δt = 1-2 fs, total ~ns-μs",   color: P.amber,  delay: 0.72 },
          ].map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+14} y={52 + i*17} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel — circular loop diagram */}
          <rect x={410} y={32} width={340} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          <text x={cx} y={52} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*5))}>
            Integration Cycle
          </text>

          {/* Circular loop arrows */}
          <circle cx={cx} cy={cy} r={loopR} fill="none" stroke={P.dim} strokeWidth="1.5" opacity={tOp * 0.4}
            strokeDasharray="6,4" />

          {/* Loop steps */}
          {steps.map((step, i) => {
            const angle = (i / nSteps) * Math.PI * 2 - Math.PI / 2;
            const sx = cx + loopR * Math.cos(angle);
            const sy = cy + loopR * Math.sin(angle);
            const op = ease(clamp01((t - 0.10 - i * 0.06) * 5));
            const isHighlighted = i === highlightIdx && t > 0.3;
            const scale = isHighlighted ? 1.15 : 1;

            return (
              <g key={i} opacity={op}>
                {/* Node */}
                <circle cx={sx} cy={sy} r={22 * scale}
                  fill={isHighlighted ? step.color+"40" : step.color+"18"}
                  stroke={step.color} strokeWidth={isHighlighted ? 2.5 : 1.5} />
                <text x={sx} y={sy - 3} textAnchor="middle" fill={step.color}
                  fontSize={isHighlighted ? "12" : "10"} fontWeight="800"
                  fontFamily="'Inter',sans-serif">{step.icon}</text>
                <text x={sx} y={sy + 9} textAnchor="middle" fill={step.color}
                  fontSize="5.5" fontFamily="'Inter',sans-serif" opacity={0.8}>
                  {step.label.split(" ")[0]}
                </text>

                {/* Connecting arrow to next step */}
                {(() => {
                  const nextAngle = ((i + 1) / nSteps) * Math.PI * 2 - Math.PI / 2;
                  const midAngle = (angle + nextAngle) / 2 + (i === nSteps - 1 ? Math.PI : 0);
                  const arrowX = cx + (loopR + 5) * Math.cos(midAngle);
                  const arrowY = cy + (loopR + 5) * Math.sin(midAngle);
                  return (
                    <text x={arrowX} y={arrowY} textAnchor="middle" fill={P.muted}
                      fontSize="10" fontWeight="700" opacity={0.5}
                      transform={`rotate(${(midAngle * 180 / Math.PI) + 90} ${arrowX} ${arrowY})`}>▼</text>
                  );
                })()}
              </g>
            );
          })}

          {/* Center label */}
          <g opacity={ease(clamp01((t-0.20)*4))}>
            <text x={cx} y={cy - 5} textAnchor="middle" fill={P.ink} fontSize="11" fontWeight="700"
              fontFamily="'Inter',sans-serif">MD Loop</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">repeat each Δt</text>
          </g>

          {/* Step details at bottom */}
          <g opacity={ease(clamp01((t-0.35)*4))}>
            <rect x={425} y={340} width={310} height={65} rx="6"
              fill={P.panel} stroke={steps[highlightIdx].color+"60"} strokeWidth="1.5" />
            <text x={435} y={358} fill={steps[highlightIdx].color} fontSize="11" fontWeight="700"
              fontFamily="'Inter',sans-serif">{steps[highlightIdx].label}</text>
            <text x={435} y={376} fill={P.muted} fontSize="10"
              fontFamily="'Fira Code','Consolas',monospace">{steps[highlightIdx].desc}</text>
            <text x={435} y={396} fill={P.dim} fontSize="9"
              fontFamily="'Inter',sans-serif">
              Step {highlightIdx + 1} of {nSteps} in each iteration
            </text>
          </g>
        </svg>
      );
    }

    // ── 8. PROPERTIES ──────────────────────────────────────────────────
    case "properties": {
      const tOp = ease(clamp01(t * 4));

      const propLines = [
        { text: "Extractable Properties:",          color: P.blue,   delay: 0.04 },
        { text: "",                                 color: P.muted,  delay: 0.07 },
        { text: "Temperature:",                     color: P.amber,  delay: 0.10 },
        { text: "T = 2/(3Nk_B) · Σ ½mᵢvᵢ²",      color: P.amber,  delay: 0.14 },
        { text: "  (kinetic energy theorem)",       color: P.muted,  delay: 0.17 },
        { text: "",                                 color: P.muted,  delay: 0.20 },
        { text: "Pressure (virial):",               color: P.green,  delay: 0.23 },
        { text: "P = NkT/V + 1/(3V) Σ rᵢⱼ·Fᵢⱼ",  color: P.green,  delay: 0.27 },
        { text: "",                                 color: P.muted,  delay: 0.30 },
        { text: "Radial Distribution g(r):",        color: P.purple, delay: 0.33 },
        { text: "g(r) = V/(N²) <Σᵢ≠ⱼ δ(r-rᵢⱼ)>",  color: P.purple, delay: 0.37 },
        { text: "  (pair correlation function)",    color: P.muted,  delay: 0.40 },
        { text: "",                                 color: P.muted,  delay: 0.43 },
        { text: "Mean Square Displacement:",        color: P.teal,   delay: 0.46 },
        { text: "MSD(t) = <|r(t)-r(0)|²>",        color: P.teal,   delay: 0.50 },
        { text: "D = lim MSD/(6t)  (diffusion)",   color: P.teal,   delay: 0.54 },
        { text: "",                                 color: P.muted,  delay: 0.57 },
        { text: "Also: stress tensor, heat capacity,", color: P.muted, delay: 0.60 },
        { text: "viscosity, thermal conductivity...",   color: P.muted, delay: 0.63 },
      ];

      // Animated graphs
      const graphW = 130, graphH = 60;

      // g(r) curve
      const grPoints = [];
      for (let i = 0; i <= 80; i++) {
        const r = i / 80 * 4;
        const gr = r < 0.8 ? 0 : 1 + 2.5 * Math.exp(-((r - 1.1) ** 2) / 0.08)
          + 1.2 * Math.exp(-((r - 2.0) ** 2) / 0.15)
          + 0.5 * Math.exp(-((r - 3.1) ** 2) / 0.3);
        const showFrac = clamp01((t - 0.33) * 3);
        if (i / 80 > showFrac) break;
        const px = 425 + (i / 80) * graphW;
        const py = 105 - (Math.min(gr, 3.5) / 3.5) * graphH;
        grPoints.push(`${px},${py}`);
      }

      // MSD curve (linear for diffusion)
      const msdPoints = [];
      for (let i = 0; i <= 80; i++) {
        const tFrac = i / 80;
        const showFrac = clamp01((t - 0.46) * 3);
        if (tFrac > showFrac) break;
        const msd = 6 * 0.05 * tFrac + 0.3 * Math.sin(tFrac * 8) * 0.1;
        const px = 590 + tFrac * graphW;
        const py = 105 - (msd / 0.35) * graphH;
        msdPoints.push(`${px},${py}`);
      }

      // Temperature fluctuation
      const tempPoints = [];
      for (let i = 0; i <= 80; i++) {
        const tFrac = i / 80;
        const showFrac = clamp01((t - 0.10) * 3);
        if (tFrac > showFrac) break;
        const temp = 300 + 15 * Math.sin(tFrac * 12) + 8 * Math.cos(tFrac * 7);
        const px = 425 + tFrac * graphW;
        const py = 210 - ((temp - 260) / 80) * graphH;
        tempPoints.push(`${px},${py}`);
      }

      // Pressure fluctuation
      const pressPoints = [];
      for (let i = 0; i <= 80; i++) {
        const tFrac = i / 80;
        const showFrac = clamp01((t - 0.23) * 3);
        if (tFrac > showFrac) break;
        const press = 1 + 0.3 * Math.sin(tFrac * 15) + 0.15 * Math.cos(tFrac * 9);
        const px = 590 + tFrac * graphW;
        const py = 210 - ((press - 0.3) / 1.4) * graphH;
        pressPoints.push(`${px},${py}`);
      }

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Measurable Properties</text>
          <line x1={400} y1={32} x2={400} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT panel */}
          <rect x={LX} y={32} width={380} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />
          {propLines.map((ln, i) => {
            const op = ease(clamp01((t - ln.delay) * 5));
            if (!ln.text) return null;
            return (
              <text key={i} x={LX+14} y={52 + i*18.5} fill={ln.color} fontSize="10"
                fontFamily="'Fira Code','Consolas',monospace" opacity={op}>{ln.text}</text>
            );
          })}

          {/* RIGHT panel — graphs */}
          <rect x={410} y={32} width={340} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {/* g(r) graph */}
          <g opacity={ease(clamp01((t-0.30)*4))}>
            <text x={490} y={48} textAnchor="middle" fill={P.purple} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">g(r)</text>
            <rect x={420} y={45} width={graphW+10} height={graphH+10} rx="4"
              fill={P.panel} stroke={P.border} strokeWidth="0.8" />
            <line x1={425} y1={105} x2={425+graphW} y2={105} stroke={P.dim} strokeWidth="0.5" />
            <line x1={425} y1={105} x2={425} y2={45} stroke={P.dim} strokeWidth="0.5" />
            {grPoints.length > 1 && (
              <polyline points={grPoints.join(" ")} fill="none" stroke={P.purple} strokeWidth="1.8" />
            )}
            <text x={425} y={115} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">0</text>
            <text x={555} y={115} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">r</text>
          </g>

          {/* MSD graph */}
          <g opacity={ease(clamp01((t-0.43)*4))}>
            <text x={655} y={48} textAnchor="middle" fill={P.teal} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">MSD(t)</text>
            <rect x={585} y={45} width={graphW+10} height={graphH+10} rx="4"
              fill={P.panel} stroke={P.border} strokeWidth="0.8" />
            <line x1={590} y1={105} x2={590+graphW} y2={105} stroke={P.dim} strokeWidth="0.5" />
            <line x1={590} y1={105} x2={590} y2={45} stroke={P.dim} strokeWidth="0.5" />
            {msdPoints.length > 1 && (
              <polyline points={msdPoints.join(" ")} fill="none" stroke={P.teal} strokeWidth="1.8" />
            )}
            <text x={590} y={115} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">0</text>
            <text x={720} y={115} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">t</text>
            {/* D = slope label */}
            {t > 0.55 && (
              <text x={650} y={80} fill={P.teal} fontSize="8" fontFamily="'Inter',sans-serif"
                opacity={ease(clamp01((t-0.55)*5))}>D = slope/6</text>
            )}
          </g>

          {/* Temperature graph */}
          <g opacity={ease(clamp01((t-0.08)*4))}>
            <text x={490} y={152} textAnchor="middle" fill={P.amber} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">T(t)</text>
            <rect x={420} y={148} width={graphW+10} height={graphH+10} rx="4"
              fill={P.panel} stroke={P.border} strokeWidth="0.8" />
            <line x1={425} y1={210} x2={425+graphW} y2={210} stroke={P.dim} strokeWidth="0.5" />
            <line x1={425} y1={210} x2={425} y2={150} stroke={P.dim} strokeWidth="0.5" />
            {/* Target T line */}
            <line x1={425} y1={180} x2={425+graphW} y2={180}
              stroke={P.ok} strokeWidth="0.8" strokeDasharray="3,2" opacity={0.5} />
            {tempPoints.length > 1 && (
              <polyline points={tempPoints.join(" ")} fill="none" stroke={P.amber} strokeWidth="1.8" />
            )}
            <text x={558} y={183} fill={P.ok} fontSize="7" fontFamily="'Inter',sans-serif">T₀=300K</text>
          </g>

          {/* Pressure graph */}
          <g opacity={ease(clamp01((t-0.20)*4))}>
            <text x={655} y={152} textAnchor="middle" fill={P.green} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">P(t)</text>
            <rect x={585} y={148} width={graphW+10} height={graphH+10} rx="4"
              fill={P.panel} stroke={P.border} strokeWidth="0.8" />
            <line x1={590} y1={210} x2={590+graphW} y2={210} stroke={P.dim} strokeWidth="0.5" />
            <line x1={590} y1={210} x2={590} y2={150} stroke={P.dim} strokeWidth="0.5" />
            {pressPoints.length > 1 && (
              <polyline points={pressPoints.join(" ")} fill="none" stroke={P.green} strokeWidth="1.8" />
            )}
            <text x={590} y={222} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">0</text>
            <text x={720} y={222} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">t</text>
          </g>

          {/* Property summary table */}
          <g opacity={ease(clamp01((t-0.60)*4))}>
            <rect x={420} y={235} width={320} height={170} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={580} y={255} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Property Summary</text>
            {[
              { prop: "Temperature", eq: "T = 2E_kin/(3Nk_B)", color: P.amber },
              { prop: "Pressure", eq: "P = NkT/V + virial", color: P.green },
              { prop: "RDF g(r)", eq: "pair correlation", color: P.purple },
              { prop: "Diffusion", eq: "D = MSD/(6t)", color: P.teal },
              { prop: "Energy", eq: "E = KE + PE (conserved)", color: P.blue },
              { prop: "Heat Capacity", eq: "Cv = <δE²>/(kT²)", color: P.pink },
            ].map((row, i) => (
              <g key={i} opacity={ease(clamp01((t - 0.63 - i * 0.04) * 5))}>
                <circle cx={435} cy={272 + i * 21} r={4} fill={row.color} opacity={0.7} />
                <text x={445} y={276 + i * 21} fill={row.color} fontSize="9" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{row.prop}</text>
                <text x={540} y={276 + i * 21} fill={P.muted} fontSize="8.5"
                  fontFamily="'Fira Code','Consolas',monospace">{row.eq}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // ── 9. SUMMARY ──────────────────────────────────────────────────────
    case "summary": {
      const tOp = ease(clamp01(t * 4));

      const summaryBlocks = [
        {
          title: "Key Equations",
          items: [
            { text: "F = -∇V(r)", color: P.red },
            { text: "V_LJ = 4ε[(σ/r)¹²-(σ/r)⁶]", color: P.green },
            { text: "r(t+Δt) = 2r(t)-r(t-Δt)+a·Δt²", color: P.blue },
            { text: "T = 2E_kin / (3Nk_B)", color: P.amber },
          ],
          delay: 0.05,
          x: LX + 5,
          y: 40,
          w: 365,
          h: 120,
        },
        {
          title: "MD Workflow",
          items: [
            { text: "1. Setup: positions, velocities, box", color: P.muted },
            { text: "2. Equilibration: reach steady state", color: P.muted },
            { text: "3. Production: collect trajectory", color: P.muted },
            { text: "4. Analysis: compute properties", color: P.muted },
          ],
          delay: 0.20,
          x: LX + 5,
          y: 170,
          w: 365,
          h: 120,
        },
        {
          title: "Common Force Fields",
          items: [
            { text: "Lennard-Jones (noble gases)", color: P.green },
            { text: "EAM (metals)", color: P.blue },
            { text: "Tersoff/REBO (covalent: C, Si)", color: P.amber },
            { text: "OPLS/AMBER/CHARMM (biomolecules)", color: P.purple },
          ],
          delay: 0.35,
          x: LX + 5,
          y: 300,
          w: 365,
          h: 110,
        },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={24} textAnchor="middle" fill={P.ink} fontSize="16" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>MD Simulation — Summary</text>
          <rect x={W/2 - ease(clamp01((t-0.02)*3))*160} y={30}
            width={ease(clamp01((t-0.02)*3))*320} height={3} rx="1.5" fill={P.blue} opacity={tOp * 0.85} />

          <line x1={385} y1={38} x2={385} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* Summary blocks on left */}
          {summaryBlocks.map((block, bi) => {
            const blockOp = ease(clamp01((t - block.delay) * 4));
            return (
              <g key={bi} opacity={blockOp}>
                <rect x={block.x} y={block.y} width={block.w} height={block.h} rx="7"
                  fill={P.surface} stroke={P.border} strokeWidth="1" />
                <text x={block.x + 12} y={block.y + 20} fill={P.ink} fontSize="11" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{block.title}</text>
                {block.items.map((item, i) => (
                  <text key={i} x={block.x + 16} y={block.y + 40 + i * 18} fill={item.color}
                    fontSize="9.5" fontFamily="'Fira Code','Consolas',monospace"
                    opacity={ease(clamp01((t - block.delay - 0.03 - i * 0.03) * 5))}>
                    {item.text}
                  </text>
                ))}
              </g>
            );
          })}

          {/* RIGHT panel — visual recap */}
          <rect x={395} y={40} width={355} height={280} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={ease(clamp01((t-0.10)*4))*0.4} />

          {/* Mini simulation box */}
          <g opacity={ease(clamp01((t-0.15)*4))}>
            <text x={572} y={60} textAnchor="middle" fill={P.blue} fontSize="11" fontWeight="700"
              fontFamily="'Inter',sans-serif">Simulation at a Glance</text>
            <rect x={420} y={70} width={305} height={160} rx="6"
              fill="none" stroke={P.dim} strokeWidth="1" />

            {/* Animated atoms in the recap box */}
            {[
              { x: 460, y: 120, r: 12, color: P.blue },
              { x: 520, y: 140, r: 10, color: P.red },
              { x: 580, y: 110, r: 14, color: P.green },
              { x: 640, y: 150, r: 11, color: P.amber },
              { x: 500, y: 180, r: 13, color: P.purple },
              { x: 560, y: 190, r: 10, color: P.teal },
              { x: 620, y: 105, r: 12, color: P.pink },
              { x: 680, y: 170, r: 11, color: P.blue },
              { x: 450, y: 170, r: 10, color: P.red },
              { x: 700, y: 130, r: 9, color: P.green },
            ].map((atom, i) => {
              const jx = 5 * Math.sin(t * 15 + i * 1.8);
              const jy = 4 * Math.cos(t * 12 + i * 2.3);
              return (
                <g key={i} opacity={ease(clamp01((t - 0.18 - i * 0.02) * 5))}>
                  <circle cx={atom.x + jx} cy={atom.y + jy} r={atom.r}
                    fill={atom.color+"25"} stroke={atom.color} strokeWidth="1.5" />
                </g>
              );
            })}

            {/* Bonds between nearby atoms */}
            {[[0,1],[1,2],[2,3],[4,5],[6,7],[8,0],[3,7]].map(([a,b], i) => {
              const atoms = [
                { x: 460, y: 120 }, { x: 520, y: 140 }, { x: 580, y: 110 },
                { x: 640, y: 150 }, { x: 500, y: 180 }, { x: 560, y: 190 },
                { x: 620, y: 105 }, { x: 680, y: 170 }, { x: 450, y: 170 },
                { x: 700, y: 130 },
              ];
              const jx1 = 5 * Math.sin(t * 15 + a * 1.8);
              const jy1 = 4 * Math.cos(t * 12 + a * 2.3);
              const jx2 = 5 * Math.sin(t * 15 + b * 1.8);
              const jy2 = 4 * Math.cos(t * 12 + b * 2.3);
              return (
                <line key={i} x1={atoms[a].x+jx1} y1={atoms[a].y+jy1}
                  x2={atoms[b].x+jx2} y2={atoms[b].y+jy2}
                  stroke={P.dim} strokeWidth="1" opacity={ease(clamp01((t-0.25)*4))*0.4} />
              );
            })}
          </g>

          {/* Applications box */}
          <g opacity={ease(clamp01((t-0.50)*4))}>
            <rect x={420} y={245} width={305} height={68} rx="6"
              fill={P.panel} stroke={P.border} strokeWidth="1" />
            <text x={572} y={264} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Applications</text>
            <text x={572} y={280} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">
              Materials science · Drug discovery · Polymer physics
            </text>
            <text x={572} y={294} textAnchor="middle" fill={P.muted} fontSize="8.5"
              fontFamily="'Inter',sans-serif">
              Protein folding · Nanotech · Phase transitions
            </text>
            <text x={572} y={308} textAnchor="middle" fill={P.dim} fontSize="8"
              fontFamily="'Inter',sans-serif">
              LAMMPS · GROMACS · NAMD · VASP (AIMD)
            </text>
          </g>

          {/* Final badge */}
          <g opacity={ease(clamp01((t-0.70)*4))}>
            <rect x={395} y={335} width={355} height={72} rx="8"
              fill={P.ok+"10"} stroke={P.ok+"50"} strokeWidth="1.5" />
            <text x={572} y={356} textAnchor="middle" fill={P.ok} fontSize="12" fontWeight="800"
              fontFamily="'Inter',sans-serif">Molecular Dynamics: the computational microscope</text>
            <text x={572} y={374} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">
              Watching atoms move one femtosecond at a time
            </text>
            <text x={572} y={394} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">
              Habibur Rahman · Purdue University · rahma103@purdue.edu
            </text>
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
          Habibur Rahman · rahma103@purdue.edu
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

      {/* Scene chips */}
      <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.blue+"20" : "transparent",
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
