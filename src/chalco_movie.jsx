import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CHALCO MOVIE — Animated cinematic walkthrough for ChalcoDB
// ═══════════════════════════════════════════════════════════════════════════

const P = {
  bg:      "#0c0f1a",
  panel:   "#141825",
  surface: "#1a1f30",
  border:  "#2a3050",
  ink:     "#e8ecf4",
  muted:   "#7b8499",
  dim:     "#3a4060",

  solar:   "#f59e0b",
  crystal: "#38bdf8",
  defect:  "#ef4444",
  electron:"#60a5fa",
  hole:    "#f97316",
  dft:     "#818cf8",
  mlff:    "#34d399",
  heat:    "#fbbf24",
  photon:  "#fde047",
  ok:      "#4ade80",
  warn:    "#f87171",
  chalco:  "#a78bfa",
  teal:    "#2dd4bf",
};

// ── Scenes ──
const SCENES = [
  { id: "title",      label: "ChalcoDB",                duration: 4000 },
  { id: "challenge",  label: "The Challenge",           duration: 7000 },
  { id: "zincblende", label: "Crystal Structures",      duration: 7000 },
  { id: "properties", label: "Target Properties",       duration: 7000 },
  { id: "hse",        label: "HSE06 + SOC",             duration: 7000 },
  { id: "dataset",    label: "The Dataset",             duration: 7000 },
  { id: "features",   label: "Composition Features",    duration: 7000 },
  { id: "rf",         label: "Random Forest",           duration: 8000 },
  { id: "screening",  label: "Screening 500K",          duration: 7000 },
  { id: "mlff",       label: "Crystal Graph MLFF",      duration: 8000 },
  { id: "geometry",   label: "Geometry Optimization",   duration: 7000 },
  { id: "defecttol",  label: "Defect Tolerance",        duration: 7000 },
  { id: "champion",   label: "Champion Compound",       duration: 7000 },
  { id: "platform",   label: "ChalcoDB Platform",       duration: 7000 },
  { id: "finale",     label: "The Future",              duration: 7000 },
];

// ── Easing helpers ──
const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function ChalcoMovieModule() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const scene = SCENES[sceneIdx];

  // ── Auto-play engine ──
  const tick = useCallback((ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const dur = SCENES[sceneIdx].duration;
    const p = Math.min(elapsed / dur, 1);
    setProgress(p);
    if (p >= 1) {
      if (sceneIdx < SCENES.length - 1) {
        setSceneIdx(i => i + 1);
        startRef.current = null;
      } else {
        setPlaying(false);
        return;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [sceneIdx]);

  useEffect(() => {
    if (playing) {
      startRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, sceneIdx, tick]);

  useEffect(() => {
    if (manualMode && !playing) {
      startRef.current = null;
      setProgress(0);
      const dur = SCENES[sceneIdx].duration;
      let id;
      const run = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const p = Math.min((ts - startRef.current) / dur, 1);
        setProgress(p);
        if (p < 1) id = requestAnimationFrame(run);
      };
      id = requestAnimationFrame(run);
      return () => cancelAnimationFrame(id);
    }
  }, [sceneIdx, manualMode, playing]);

  const goScene = (i) => {
    setPlaying(false);
    setManualMode(true);
    setSceneIdx(i);
    setProgress(0);
    startRef.current = null;
  };

  const playAll = () => {
    setManualMode(false);
    setSceneIdx(0);
    setProgress(0);
    startRef.current = null;
    setPlaying(true);
  };

  const togglePause = () => {
    if (playing) {
      setPlaying(false);
      setManualMode(true);
    } else {
      setManualMode(false);
      startRef.current = null;
      setPlaying(true);
    }
  };

  const nextScene = () => {
    if (sceneIdx < SCENES.length - 1) goScene(sceneIdx + 1);
  };
  const prevScene = () => {
    if (sceneIdx > 0) goScene(sceneIdx - 1);
  };

  const t = progress;

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE RENDERERS
  // ═══════════════════════════════════════════════════════════════════════

  const renderScene = () => {
    const W = 560, H = 420;

    switch (scene.id) {

    // ── TITLE ──
    case "title": {
      const titleOp = ease(clamp01(t * 3));
      const subOp = ease(clamp01((t - 0.3) * 3));
      const lineW = ease(clamp01((t - 0.2) * 2.5)) * 200;
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`g${i}`} x1={0} y1={i * 28} x2={W} y2={i * 28}
              stroke={P.dim} strokeWidth="0.3" opacity={0.3} />
          ))}
          <text x={W / 2} y={120} textAnchor="middle" fill={P.ink} fontSize="28" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={titleOp}>
            ChalcoDB
          </text>
          <rect x={(W - lineW) / 2} y={138} width={lineW} height={3} rx="1.5"
            fill={P.chalco} opacity={titleOp * 0.8} />
          <text x={W / 2} y={170} textAnchor="middle" fill={P.muted} fontSize="13"
            fontFamily="'Inter',sans-serif" opacity={subOp}>
            Data-Driven Design of Multinary Chalcogenide Semiconductors
          </text>
          <text x={W / 2} y={195} textAnchor="middle" fill={P.muted} fontSize="12"
            fontFamily="'Inter',sans-serif" opacity={subOp * 0.8}>
            High-Throughput DFT + Machine Learning for Solar Absorbers
          </text>
          <text x={W / 2} y={225} textAnchor="middle" fill={P.crystal} fontSize="12"
            fontFamily="'Inter',sans-serif" opacity={subOp * 0.7}>
            <tspan>{"A"}</tspan><tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">{"BCX"}</tspan><tspan dy="3" fontSize="9">4</tspan>
            <tspan dy="-3">{" \u00B7 ABX"}</tspan><tspan dy="3" fontSize="9">2</tspan>
            <tspan dy="-3">{" \u00B7 Zincblende-derived"}</tspan>
          </text>
          {(() => {
            const lineOp = ease(clamp01((t - 0.5) * 2.5));
            const lineW2 = ease(clamp01((t - 0.55) * 2)) * 300;
            return (
              <rect x={(W - lineW2) / 2} y={255} width={lineW2} height={1} rx="0.5"
                fill={P.chalco} opacity={lineOp * 0.25} />
            );
          })()}
          {(() => {
            const infoOp = ease(clamp01((t - 0.55) * 2.5));
            return (
              <g opacity={infoOp}>
                <text x={W / 2} y={305} textAnchor="middle" fill={P.muted} fontSize="10"
                  fontFamily="'Inter',sans-serif">
                  Developed by Habibur Rahman {"\u00B7"} rahma103@purdue.edu
                </text>
                <text x={W / 2} y={325} textAnchor="middle" fill={P.dim} fontSize="9"
                  fontFamily="'Inter',sans-serif">
                  School of Materials Engineering, Purdue University
                </text>
              </g>
            );
          })()}
        </svg>
      );
    }

    // ── THE CHALLENGE ──
    case "challenge": {
      const titleT = ease(clamp01(t * 3));
      const box1T = ease(clamp01((t - 0.15) * 3));
      const box2T = ease(clamp01((t - 0.3) * 3));
      const box3T = ease(clamp01((t - 0.45) * 3));
      const arrowT = ease(clamp01((t - 0.6) * 3));
      const questionT = ease(clamp01((t - 0.75) * 3));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={32} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            The Chalcogenide Challenge
          </text>
          {/* Vast compositional space */}
          <g opacity={box1T} transform={`translate(${40 + (1 - box1T) * 20}, 55)`}>
            <rect width={145} height={80} rx="8" fill={P.chalco + "20"} stroke={P.chalco} strokeWidth="1.5" />
            <text x={72} y={25} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">Vast Chemical</text>
            <text x={72} y={40} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">Space</text>
            <text x={72} y={58} textAnchor="middle" fill={P.muted} fontSize="8">500,000+ possible</text>
            <text x={72} y={70} textAnchor="middle" fill={P.muted} fontSize="8">compositions</text>
          </g>
          {/* Good optoelectronic properties */}
          <g opacity={box2T} transform={`translate(${207 + (1 - box2T) * 20}, 55)`}>
            <rect width={145} height={80} rx="8" fill={P.ok + "20"} stroke={P.ok} strokeWidth="1.5" />
            <text x={72} y={25} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="700">Excellent</text>
            <text x={72} y={40} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="700">Optoelectronics</text>
            <text x={72} y={58} textAnchor="middle" fill={P.muted} fontSize="8">Tunable band gaps</text>
            <text x={72} y={70} textAnchor="middle" fill={P.muted} fontSize="8">Earth-abundant</text>
          </g>
          {/* But defects limit */}
          <g opacity={box3T} transform={`translate(${375 + (1 - box3T) * 20}, 55)`}>
            <rect width={145} height={80} rx="8" fill={P.warn + "20"} stroke={P.warn} strokeWidth="1.5" />
            <text x={72} y={25} textAnchor="middle" fill={P.warn} fontSize="10" fontWeight="700">Poor Defect</text>
            <text x={72} y={40} textAnchor="middle" fill={P.warn} fontSize="10" fontWeight="700">Tolerance</text>
            <text x={72} y={58} textAnchor="middle" fill={P.muted} fontSize="8">Unfavorable doping</text>
            <text x={72} y={70} textAnchor="middle" fill={P.muted} fontSize="8">Limits performance</text>
          </g>
          {/* Arrows between boxes */}
          <g opacity={arrowT}>
            <line x1={188} y1={95} x2={204} y2={95} stroke={P.dim} strokeWidth="1.5" markerEnd="url(#arrowC)" />
            <line x1={355} y1={95} x2={372} y2={95} stroke={P.dim} strokeWidth="1.5" markerEnd="url(#arrowC)" />
          </g>
          {/* Solution arrow */}
          <g opacity={questionT}>
            <line x1={W / 2} y1={150} x2={W / 2} y2={175} stroke={P.chalco} strokeWidth="2" markerEnd="url(#arrowP)" />
            <rect x={100} y={180} width={360} height={95} rx="10" fill={P.surface} stroke={P.chalco} strokeWidth="1.5" />
            <text x={W / 2} y={205} textAnchor="middle" fill={P.chalco} fontSize="12" fontWeight="800">
              Composition Engineering + Data-Driven Design
            </text>
            <text x={W / 2} y={225} textAnchor="middle" fill={P.muted} fontSize="9">
              Simultaneously optimize bulk stability, electronic structure,
            </text>
            <text x={W / 2} y={240} textAnchor="middle" fill={P.muted} fontSize="9">
              and defect physics using high-throughput DFT + ML
            </text>
            <text x={W / 2} y={260} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700">
              DFT (HSE06+SOC) + Random Forest + Crystal Graph MLFF
            </text>
          </g>
          {/* Key materials */}
          {(() => {
            const matT = ease(clamp01((t - 0.85) * 4));
            const mats = ["CdTe", "CuInS\u2082", "Cu\u2082ZnSnS\u2084", "CZTSSe", "CuGaSe\u2082"];
            return (
              <g opacity={matT}>
                <text x={W / 2} y={310} textAnchor="middle" fill={P.dim} fontSize="8" fontWeight="600">
                  TARGET MATERIALS SPACE
                </text>
                {mats.map((m, i) => (
                  <g key={i}>
                    <rect x={35 + i * 100} y={320} width={90} height={24} rx="5"
                      fill={P.chalco + "15"} stroke={P.chalco + "40"} strokeWidth="1" />
                    <text x={80 + i * 100} y={336} textAnchor="middle" fill={P.crystal} fontSize="9" fontWeight="600">
                      {m}
                    </text>
                  </g>
                ))}
              </g>
            );
          })()}
          <defs>
            <marker id="arrowC" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke={P.dim} strokeWidth="1" />
            </marker>
            <marker id="arrowP" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
              <path d="M0,0 L3,6 L6,0" fill="none" stroke={P.chalco} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── ZINCBLENDE STRUCTURES ──
    case "zincblende": {
      const titleT = ease(clamp01(t * 3));
      const struct1T = ease(clamp01((t - 0.1) * 3));
      const struct2T = ease(clamp01((t - 0.35) * 3));
      const labelT = ease(clamp01((t - 0.6) * 3));
      // Draw a simple zincblende-derived unit cell
      const drawCell = (ox, oy, label, sublabel, atoms, op) => {
        const cellW = 140, cellH = 120;
        return (
          <g opacity={op}>
            <rect x={ox} y={oy} width={cellW} height={cellH} rx="6"
              fill={P.surface} stroke={P.chalco + "60"} strokeWidth="1.5" />
            {atoms.map((a, i) => (
              <circle key={i} cx={ox + a.x} cy={oy + a.y} r={a.r}
                fill={a.color} opacity={0.85} />
            ))}
            {/* Bonds */}
            {atoms.map((a, i) => atoms.slice(i + 1).map((b, j) => {
              const d = Math.hypot(a.x - b.x, a.y - b.y);
              return d < 50 ? (
                <line key={`${i}-${j}`} x1={ox + a.x} y1={oy + a.y} x2={ox + b.x} y2={oy + b.y}
                  stroke={P.dim} strokeWidth="0.8" opacity={0.5} />
              ) : null;
            }))}
            <text x={ox + cellW / 2} y={oy + cellH + 18} textAnchor="middle"
              fill={P.ink} fontSize="11" fontWeight="700">{label}</text>
            <text x={ox + cellW / 2} y={oy + cellH + 32} textAnchor="middle"
              fill={P.muted} fontSize="8">{sublabel}</text>
          </g>
        );
      };

      const a2bcx4Atoms = [
        { x: 30, y: 30, r: 8, color: P.crystal },   // A
        { x: 70, y: 25, r: 8, color: P.crystal },   // A
        { x: 110, y: 35, r: 7, color: P.chalco },   // B
        { x: 50, y: 60, r: 7, color: P.ok },         // C
        { x: 30, y: 90, r: 6, color: P.solar },      // X
        { x: 70, y: 85, r: 6, color: P.solar },      // X
        { x: 110, y: 90, r: 6, color: P.solar },     // X
        { x: 90, y: 60, r: 6, color: P.solar },      // X
      ];

      const abx2Atoms = [
        { x: 40, y: 30, r: 8, color: P.crystal },   // A
        { x: 100, y: 35, r: 7, color: P.chalco },   // B
        { x: 30, y: 70, r: 6, color: P.solar },      // X
        { x: 70, y: 65, r: 6, color: P.solar },      // X
        { x: 110, y: 70, r: 6, color: P.solar },     // X (extra for visual)
        { x: 70, y: 100, r: 7, color: P.crystal },   // A repeat
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={32} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Zincblende-Derived Crystal Structures
          </text>

          {drawCell(80, 60, "A\u2082BCX\u2084", "e.g. Cu\u2082ZnSnS\u2084", a2bcx4Atoms, struct1T)}
          {drawCell(335, 60, "ABX\u2082", "e.g. CuInS\u2082", abx2Atoms, struct2T)}

          {/* Legend */}
          <g opacity={labelT}>
            <circle cx={120} y={250} cx={120} cy={250} r={6} fill={P.crystal} />
            <text x={132} y={254} fill={P.ink} fontSize="9">A (Cu, Ag...)</text>
            <circle cx={220} cy={250} r={6} fill={P.chalco} />
            <text x={232} y={254} fill={P.ink} fontSize="9">B (Zn, Cd, Ca...)</text>
            <circle cx={340} cy={250} r={6} fill={P.ok} />
            <text x={352} y={254} fill={P.ink} fontSize="9">C (Sn, Ge...)</text>
            <circle cx={450} cy={250} r={6} fill={P.solar} />
            <text x={462} y={254} fill={P.ink} fontSize="9">X (S, Se, Te)</text>
          </g>

          {/* Description box */}
          {(() => {
            const descT = ease(clamp01((t - 0.7) * 3));
            return (
              <g opacity={descT}>
                <rect x={70} y={280} width={420} height={100} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
                <text x={W / 2} y={302} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
                  Pre-Defined Chemical Space
                </text>
                <text x={W / 2} y={320} textAnchor="middle" fill={P.muted} fontSize="9">
                  Cation sites: Cu, Ag, Li, Na, K, Tl, Ba, Ca, Sr, Cd, Zn, Hg, Mg, Be
                </text>
                <text x={W / 2} y={335} textAnchor="middle" fill={P.muted} fontSize="9">
                  B-site: Sn, Ge, Si, Pb, Ti, Zr, Hf {"\u00B7"} Anion: S, Se, Te
                </text>
                <text x={W / 2} y={355} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="600">
                  {"\u2192"} ~500,000 candidate compositions
                </text>
              </g>
            );
          })()}
        </svg>
      );
    }

    // ── TARGET PROPERTIES ──
    case "properties": {
      const titleT = ease(clamp01(t * 3));
      const props = [
        { name: "Band Gap (E\u2097)", icon: "\u2600", desc: "1.0\u20131.8 eV ideal for solar", color: P.solar },
        { name: "Decomposition Energy", icon: "\u0394", desc: "\u0394H\u1D48 < 0 for thermodynamic stability", color: P.ok },
        { name: "PV Efficiency (SLME)", icon: "\u26A1", desc: "Spectroscopic limited max efficiency", color: P.chalco },
        { name: "Defect Formation E\u1DA0", icon: "\u2B24", desc: "Point defect tolerance criterion", color: P.warn },
        { name: "Lattice Parameters", icon: "\u25A3", desc: "Optimized a, b, c for alloy matching", color: P.crystal },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={32} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Target Properties
          </text>
          <text x={W / 2} y={50} textAnchor="middle" fill={P.muted} fontSize="9" opacity={titleT}>
            What we compute for each compound
          </text>
          {props.map((p, i) => {
            const pT = ease(clamp01((t - 0.1 - i * 0.1) * 3));
            const by = 68 + i * 58;
            return (
              <g key={i} opacity={pT} transform={`translate(${(1 - pT) * 30}, 0)`}>
                <rect x={80} y={by} width={400} height={48} rx="8"
                  fill={p.color + "12"} stroke={p.color + "40"} strokeWidth="1" />
                <text x={105} y={by + 28} textAnchor="middle" fill={p.color} fontSize="18">{p.icon}</text>
                <text x={130} y={by + 20} fill={P.ink} fontSize="11" fontWeight="700">{p.name}</text>
                <text x={130} y={by + 36} fill={P.muted} fontSize="9">{p.desc}</text>
              </g>
            );
          })}
          {(() => {
            const noteT = ease(clamp01((t - 0.8) * 4));
            return (
              <text x={W / 2} y={370} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="600" opacity={noteT}>
                All computed with hybrid HSE06 + spin-orbit coupling
              </text>
            );
          })()}
        </svg>
      );
    }

    // ── HSE06 + SOC ──
    case "hse": {
      const titleT = ease(clamp01(t * 3));
      const cellT = ease(clamp01((t - 0.1) * 3));
      const scfT = ease(clamp01((t - 0.3) * 3));
      const detailT = ease(clamp01((t - 0.5) * 3));
      const resultT = ease(clamp01((t - 0.7) * 3));
      // SCF convergence animation
      const scfSteps = 8;
      const scfProgress = clamp01((t - 0.35) * 3);
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            High-Throughput HSE06 + SOC
          </text>

          {/* Unit cell */}
          <g opacity={cellT}>
            <rect x={30} y={55} width={130} height={130} rx="8" fill={P.surface} stroke={P.dft + "60"} strokeWidth="1.5" />
            <text x={95} y={75} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700">Unit Cell</text>
            {/* Simple atom arrangement */}
            {[
              { x: 55, y: 95, r: 7, c: P.crystal },
              { x: 85, y: 90, r: 6, c: P.solar },
              { x: 115, y: 100, r: 7, c: P.chalco },
              { x: 70, y: 125, r: 6, c: P.solar },
              { x: 100, y: 130, r: 7, c: P.crystal },
              { x: 130, y: 120, r: 6, c: P.solar },
              { x: 60, y: 155, r: 6, c: P.ok },
              { x: 90, y: 160, r: 6, c: P.solar },
            ].map((a, i) => (
              <circle key={i} cx={a.x} cy={a.y} r={a.r} fill={a.c} opacity={0.8} />
            ))}
          </g>

          {/* Arrow to SCF */}
          <g opacity={scfT}>
            <line x1={168} y1={120} x2={195} y2={120} stroke={P.dft} strokeWidth="1.5" markerEnd="url(#arwHSE)" />
          </g>

          {/* SCF convergence */}
          <g opacity={scfT}>
            <rect x={200} y={55} width={160} height={130} rx="8" fill={P.surface} stroke={P.dft + "40"} strokeWidth="1" />
            <text x={280} y={75} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700">SCF Convergence</text>
            {/* Energy convergence plot */}
            {Array.from({ length: scfSteps }).map((_, i) => {
              const frac = i / (scfSteps - 1);
              const show = frac <= scfProgress;
              if (!show) return null;
              const px = 215 + frac * 130;
              const energy = 0.5 * Math.exp(-3 * frac) + 0.05;
              const py = 90 + (1 - energy) * 75;
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r={2.5} fill={P.dft} />
                  {i > 0 && (
                    <line x1={215 + (i - 1) / (scfSteps - 1) * 130}
                      y1={90 + (1 - (0.5 * Math.exp(-3 * (i - 1) / (scfSteps - 1)) + 0.05)) * 75}
                      x2={px} y2={py} stroke={P.dft} strokeWidth="1" opacity={0.6} />
                  )}
                </g>
              );
            })}
            <text x={280} y={178} textAnchor="middle" fill={P.muted} fontSize="7">SCF iteration</text>
          </g>

          {/* Arrow to result */}
          <g opacity={resultT}>
            <line x1={368} y1={120} x2={395} y2={120} stroke={P.dft} strokeWidth="1.5" markerEnd="url(#arwHSE)" />
          </g>

          {/* Result */}
          <g opacity={resultT}>
            <rect x={400} y={55} width={135} height={130} rx="8" fill={P.dft + "15"} stroke={P.dft} strokeWidth="1.5" />
            <text x={467} y={80} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700">Output</text>
            <text x={467} y={100} textAnchor="middle" fill={P.ink} fontSize="8">E_total</text>
            <text x={467} y={115} textAnchor="middle" fill={P.ink} fontSize="8">Band gap</text>
            <text x={467} y={130} textAnchor="middle" fill={P.ink} fontSize="8">Forces</text>
            <text x={467} y={145} textAnchor="middle" fill={P.ink} fontSize="8">Stress tensor</text>
            <text x={467} y={160} textAnchor="middle" fill={P.ok} fontSize="8" fontWeight="600">SLME</text>
          </g>

          {/* Details box */}
          <g opacity={detailT}>
            <rect x={60} y={210} width={440} height={85} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={232} textAnchor="middle" fill={P.dft} fontSize="10" fontWeight="700">
              Why HSE06 + SOC?
            </text>
            <text x={W / 2} y={250} textAnchor="middle" fill={P.muted} fontSize="9">
              GGA underestimates band gaps by 30-50% {"\u2014"} HSE06 hybrid functional
            </text>
            <text x={W / 2} y={265} textAnchor="middle" fill={P.muted} fontSize="9">
              includes exact exchange for accurate gaps. SOC critical for heavy elements (Te, Se, Cd)
            </text>
            <text x={W / 2} y={282} textAnchor="middle" fill={P.ink} fontSize="9" fontWeight="600">
              Cost: ~100{"\u00D7"} more expensive than GGA {"\u2192"} need ML acceleration
            </text>
          </g>

          {/* Bottom stat */}
          {(() => {
            const statT = ease(clamp01((t - 0.85) * 4));
            return (
              <g opacity={statT}>
                <text x={W / 2} y={330} textAnchor="middle" fill={P.chalco} fontSize="11" fontWeight="700">
                  Thousands of HSE06+SOC calculations performed
                </text>
                <text x={W / 2} y={348} textAnchor="middle" fill={P.muted} fontSize="9">
                  Each compound: geometry optimization + electronic structure + defect calculations
                </text>
              </g>
            );
          })()}

          <defs>
            <marker id="arwHSE" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke={P.dft} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── THE DATASET ──
    case "dataset": {
      const titleT = ease(clamp01(t * 3));
      const cols = ["Compound", "a (\u00C5)", "E\u2097 (eV)", "\u0394H\u1D48", "SLME (%)", "E\u1DA0 (eV)"];
      const rows = [
        ["Cu\u2082ZnSnS\u2084", "5.43", "1.50", "-0.12", "28.1", "0.85"],
        ["CuInS\u2082", "5.52", "1.53", "-0.34", "29.5", "1.12"],
        ["Cu\u2082CdSnS\u2084", "5.58", "1.38", "-0.08", "25.6", "0.62"],
        ["AgGaSe\u2082", "5.76", "1.68", "-0.22", "26.3", "0.95"],
        ["Cu\u2082CaSnS\u2084", "5.61", "1.45", "-0.15", "27.8", "1.05"],
        ["\u22EE", "\u22EE", "\u22EE", "\u22EE", "\u22EE", "\u22EE"],
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            The DFT Dataset
          </text>
          <text x={W / 2} y={48} textAnchor="middle" fill={P.muted} fontSize="9" opacity={titleT}>
            Thousands of compounds computed at HSE06+SOC level
          </text>

          {/* Table header */}
          {cols.map((c, i) => {
            const colT = ease(clamp01((t - 0.1) * 3));
            const cx = 55 + i * 82;
            return (
              <g key={i} opacity={colT}>
                <rect x={cx - 36} y={60} width={76} height={22} rx="4" fill={P.dft + "20"} />
                <text x={cx} y={75} textAnchor="middle" fill={P.dft} fontSize="8" fontWeight="700">{c}</text>
              </g>
            );
          })}

          {/* Table rows */}
          {rows.map((row, ri) => {
            const rowT = ease(clamp01((t - 0.2 - ri * 0.07) * 3));
            const ry = 90 + ri * 28;
            return (
              <g key={ri} opacity={rowT}>
                <rect x={19} y={ry} width={522} height={24} rx="3"
                  fill={ri % 2 === 0 ? P.surface : "transparent"} />
                {row.map((val, ci) => (
                  <text key={ci} x={55 + ci * 82} y={ry + 16} textAnchor="middle"
                    fill={ci === 0 ? P.crystal : P.ink} fontSize="8.5"
                    fontWeight={ci === 0 ? "600" : "400"}>
                    {val}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Summary stats */}
          {(() => {
            const statT = ease(clamp01((t - 0.7) * 3));
            const stats = [
              { label: "Compounds", value: "~3,000", color: P.chalco },
              { label: "Properties", value: "6+", color: P.dft },
              { label: "CPU hours", value: "~2M", color: P.warn },
            ];
            return (
              <g opacity={statT}>
                {stats.map((s, i) => (
                  <g key={i}>
                    <rect x={85 + i * 150} y={290} width={120} height={55} rx="8"
                      fill={s.color + "12"} stroke={s.color + "30"} strokeWidth="1" />
                    <text x={145 + i * 150} y={312} textAnchor="middle"
                      fill={s.color} fontSize="16" fontWeight="900">{s.value}</text>
                    <text x={145 + i * 150} y={330} textAnchor="middle"
                      fill={P.muted} fontSize="8" fontWeight="600">{s.label}</text>
                  </g>
                ))}
              </g>
            );
          })()}

          {/* Bottom note */}
          {(() => {
            const noteT = ease(clamp01((t - 0.85) * 4));
            return (
              <text x={W / 2} y={370} textAnchor="middle" fill={P.muted} fontSize="9" opacity={noteT}>
                Dataset includes lattice parameters, decomposition energy, band gap, SLME, and defect Eᶠ
              </text>
            );
          })()}
        </svg>
      );
    }

    // ── COMPOSITION FEATURES ──
    case "features": {
      const titleT = ease(clamp01(t * 3));
      const featT = ease(clamp01((t - 0.15) * 3));
      const formulaT = ease(clamp01((t - 0.35) * 3));
      const vecT = ease(clamp01((t - 0.55) * 3));
      const descT = ease(clamp01((t - 0.75) * 3));

      const feats = [
        "Electronegativity", "Ionic radius", "Atomic mass",
        "Electron affinity", "1st ionization E", "Mendeleev #",
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Composition-Weighted Elemental Features
          </text>

          {/* Formula example */}
          <g opacity={formulaT}>
            <rect x={140} y={50} width={280} height={40} rx="8" fill={P.surface} stroke={P.chalco + "50"} strokeWidth="1.5" />
            <text x={W / 2} y={75} textAnchor="middle" fill={P.crystal} fontSize="13" fontWeight="700">
              Cu{"\u2082"}ZnSnS{"\u2084"} {"\u2192"} feature vector
            </text>
          </g>

          {/* Feature boxes */}
          <g opacity={featT}>
            {feats.map((f, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const fx = 65 + col * 160;
              const fy = 105 + row * 50;
              return (
                <g key={i}>
                  <rect x={fx} y={fy} width={140} height={38} rx="6"
                    fill={P.dft + "12"} stroke={P.dft + "30"} strokeWidth="1" />
                  <text x={fx + 70} y={fy + 23} textAnchor="middle" fill={P.ink} fontSize="9" fontWeight="600">
                    {f}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Arrow down */}
          <g opacity={vecT}>
            <line x1={W / 2} y1={210} x2={W / 2} y2={240} stroke={P.chalco} strokeWidth="2" markerEnd="url(#arwFeat)" />
          </g>

          {/* Feature vector visualization */}
          <g opacity={vecT}>
            <rect x={100} y={248} width={360} height={45} rx="8" fill={P.surface} stroke={P.chalco + "40"} strokeWidth="1" />
            <text x={115} y={270} fill={P.chalco} fontSize="9" fontWeight="700">x =</text>
            {Array.from({ length: 12 }).map((_, i) => {
              const bx = 140 + i * 26;
              const bh = 10 + Math.random() * 20;
              return (
                <rect key={i} x={bx} y={280 - bh} width={18} height={bh} rx="2"
                  fill={P.chalco + "60"} />
              );
            })}
            <text x={465} y={275} fill={P.muted} fontSize="8">... 145 features</text>
          </g>

          {/* Description */}
          <g opacity={descT}>
            <rect x={70} y={310} width={420} height={70} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={332} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
              Composition-Weighted Averaging
            </text>
            <text x={W / 2} y={350} textAnchor="middle" fill={P.muted} fontSize="9">
              Each element{"\u2019"}s property weighted by stoichiometric fraction
            </text>
            <text x={W / 2} y={365} textAnchor="middle" fill={P.muted} fontSize="9">
              Statistics: mean, std, min, max, range {"\u2192"} fixed-length descriptor
            </text>
          </g>

          <defs>
            <marker id="arwFeat" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
              <path d="M0,0 L3,6 L6,0" fill="none" stroke={P.chalco} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── RANDOM FOREST ──
    case "rf": {
      const titleT = ease(clamp01(t * 3));
      const inputT = ease(clamp01((t - 0.1) * 3));
      const treeT = ease(clamp01((t - 0.25) * 3));
      const outputT = ease(clamp01((t - 0.5) * 3));
      const metricsT = ease(clamp01((t - 0.7) * 3));

      // Draw a simple tree
      const drawTree = (ox, oy, scale, op) => (
        <g opacity={op} transform={`translate(${ox},${oy}) scale(${scale})`}>
          <line x1={25} y1={0} x2={10} y2={20} stroke={P.ok} strokeWidth="1.5" />
          <line x1={25} y1={0} x2={40} y2={20} stroke={P.ok} strokeWidth="1.5" />
          <line x1={10} y1={20} x2={2} y2={38} stroke={P.ok} strokeWidth="1" />
          <line x1={10} y1={20} x2={18} y2={38} stroke={P.ok} strokeWidth="1" />
          <line x1={40} y1={20} x2={32} y2={38} stroke={P.ok} strokeWidth="1" />
          <line x1={40} y1={20} x2={48} y2={38} stroke={P.ok} strokeWidth="1" />
          <circle cx={25} cy={0} r={5} fill={P.ok} />
          <circle cx={10} cy={20} r={4} fill={P.ok + "90"} />
          <circle cx={40} cy={20} r={4} fill={P.ok + "90"} />
          <circle cx={2} cy={38} r={3} fill={P.ok + "60"} />
          <circle cx={18} cy={38} r={3} fill={P.ok + "60"} />
          <circle cx={32} cy={38} r={3} fill={P.ok + "60"} />
          <circle cx={48} cy={38} r={3} fill={P.ok + "60"} />
        </g>
      );

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Random Forest Regression
          </text>

          {/* Input */}
          <g opacity={inputT}>
            <rect x={20} y={60} width={100} height={70} rx="8" fill={P.surface} stroke={P.chalco + "50"} strokeWidth="1.5" />
            <text x={70} y={82} textAnchor="middle" fill={P.chalco} fontSize="9" fontWeight="700">Features</text>
            <text x={70} y={98} textAnchor="middle" fill={P.muted} fontSize="8">145-dim vector</text>
            <text x={70} y={112} textAnchor="middle" fill={P.muted} fontSize="8">per composition</text>
          </g>

          {/* Arrow */}
          <g opacity={treeT}>
            <line x1={125} y1={95} x2={150} y2={95} stroke={P.dim} strokeWidth="1.5" markerEnd="url(#arwRF)" />
          </g>

          {/* Trees */}
          <g opacity={treeT}>
            <rect x={155} y={50} width={240} height={100} rx="8" fill={P.surface} stroke={P.ok + "40"} strokeWidth="1" />
            <text x={275} y={70} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700">Ensemble of 500 Trees</text>
            {drawTree(170, 78, 0.9, treeT)}
            {drawTree(230, 78, 0.9, treeT)}
            {drawTree(290, 78, 0.9, treeT)}
            {drawTree(345, 78, 0.7, treeT * 0.5)}
          </g>

          {/* Arrow */}
          <g opacity={outputT}>
            <line x1={400} y1={95} x2={425} y2={95} stroke={P.dim} strokeWidth="1.5" markerEnd="url(#arwRF)" />
          </g>

          {/* Output */}
          <g opacity={outputT}>
            <rect x={430} y={55} width={110} height={85} rx="8" fill={P.chalco + "15"} stroke={P.chalco} strokeWidth="1.5" />
            <text x={485} y={78} textAnchor="middle" fill={P.chalco} fontSize="9" fontWeight="700">Predictions</text>
            <text x={485} y={95} textAnchor="middle" fill={P.ink} fontSize="8">Band gap</text>
            <text x={485} y={108} textAnchor="middle" fill={P.ink} fontSize="8">{"\u0394"}H decomp</text>
            <text x={485} y={121} textAnchor="middle" fill={P.ink} fontSize="8">SLME</text>
            <text x={485} y={134} textAnchor="middle" fill={P.ink} fontSize="8">Defect Eᶠ</text>
          </g>

          {/* Metrics */}
          <g opacity={metricsT}>
            <rect x={50} y={175} width={460} height={100} rx="10" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={198} textAnchor="middle" fill={P.ok} fontSize="11" fontWeight="700">
              Model Performance
            </text>
            {[
              { prop: "Band Gap", r2: "0.92", mae: "0.15 eV" },
              { prop: "Decomp. Energy", r2: "0.88", mae: "0.03 eV/atom" },
              { prop: "SLME", r2: "0.90", mae: "2.1%" },
            ].map((m, i) => (
              <g key={i}>
                <text x={100} y={220 + i * 17} fill={P.ink} fontSize="9" fontWeight="600">{m.prop}</text>
                <text x={270} y={220 + i * 17} fill={P.ok} fontSize="9">R{"\u00B2"} = {m.r2}</text>
                <text x={370} y={220 + i * 17} fill={P.muted} fontSize="9">MAE = {m.mae}</text>
              </g>
            ))}
          </g>

          {/* Bottom note */}
          {(() => {
            const noteT = ease(clamp01((t - 0.85) * 4));
            return (
              <g opacity={noteT}>
                <text x={W / 2} y={310} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
                  Deploy to predict ~500,000 compositions in seconds
                </text>
                <text x={W / 2} y={328} textAnchor="middle" fill={P.muted} fontSize="9">
                  Train on ~3,000 DFT data points {"\u2192"} predict entire chemical space
                </text>
              </g>
            );
          })()}

          <defs>
            <marker id="arwRF" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke={P.dim} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── SCREENING 500K ──
    case "screening": {
      const titleT = ease(clamp01(t * 3));
      const funnelT = ease(clamp01((t - 0.15) * 2.5));
      const stages = [
        { label: "Chemical Space", count: "~500,000", w: 400, color: P.dim },
        { label: "Stability Filter (\u0394H < 0)", count: "~50,000", w: 320, color: P.chalco + "60" },
        { label: "Band Gap 1.0\u20131.8 eV", count: "~12,000", w: 240, color: P.dft + "70" },
        { label: "SLME > 20%", count: "~4,500", w: 180, color: P.solar + "80" },
        { label: "Defect Tolerant", count: "~1,200", w: 120, color: P.ok },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Screening at Scale
          </text>

          {/* Funnel */}
          {stages.map((s, i) => {
            const sT = ease(clamp01((funnelT - i * 0.15) * 3));
            const sy = 55 + i * 60;
            const sx = (W - s.w) / 2;
            return (
              <g key={i} opacity={sT}>
                <rect x={sx} y={sy} width={s.w * sT} height={42} rx="6"
                  fill={s.color + "20"} stroke={s.color} strokeWidth="1.5" />
                <text x={W / 2} y={sy + 18} textAnchor="middle"
                  fill={P.ink} fontSize="9" fontWeight="600">{s.label}</text>
                <text x={W / 2} y={sy + 34} textAnchor="middle"
                  fill={s.color} fontSize="12" fontWeight="800">{s.count}</text>
                {i < stages.length - 1 && (
                  <line x1={W / 2} y1={sy + 44} x2={W / 2} y2={sy + 57}
                    stroke={P.dim} strokeWidth="1" strokeDasharray="3,2" opacity={0.5} />
                )}
              </g>
            );
          })}

          {/* Result callout */}
          {(() => {
            const resT = ease(clamp01((t - 0.8) * 4));
            return (
              <g opacity={resT}>
                <rect x={130} y={365} width={300} height={35} rx="8"
                  fill={P.ok + "15"} stroke={P.ok} strokeWidth="1.5" />
                <text x={W / 2} y={387} textAnchor="middle" fill={P.ok} fontSize="11" fontWeight="700">
                  ~1,200 stable compounds with ideal PV properties
                </text>
              </g>
            );
          })()}
        </svg>
      );
    }

    // ── CRYSTAL GRAPH MLFF ──
    case "mlff": {
      const titleT = ease(clamp01(t * 3));
      const graphT = ease(clamp01((t - 0.1) * 3));
      const nnT = ease(clamp01((t - 0.3) * 3));
      const trainT = ease(clamp01((t - 0.5) * 3));
      const resultT = ease(clamp01((t - 0.7) * 3));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Crystal Graph Neural Network MLFF
          </text>

          {/* Crystal graph */}
          <g opacity={graphT}>
            <rect x={25} y={55} width={145} height={130} rx="8" fill={P.surface} stroke={P.crystal + "50"} strokeWidth="1.5" />
            <text x={97} y={75} textAnchor="middle" fill={P.crystal} fontSize="9" fontWeight="700">Crystal Graph</text>
            {/* Nodes and edges */}
            {[
              { x: 55, y: 95, c: P.crystal },
              { x: 95, y: 90, c: P.solar },
              { x: 135, y: 100, c: P.chalco },
              { x: 65, y: 130, c: P.ok },
              { x: 105, y: 135, c: P.crystal },
              { x: 140, y: 125, c: P.solar },
              { x: 80, y: 160, c: P.solar },
              { x: 120, y: 155, c: P.chalco },
            ].map((n, i, arr) => (
              <g key={i}>
                {arr.slice(i + 1).filter((_, j) => Math.random() > 0.3).map((m, j) => (
                  <line key={j} x1={n.x} y1={n.y} x2={m.x} y2={m.y}
                    stroke={P.dim} strokeWidth="0.7" opacity={0.4} />
                ))}
                <circle cx={n.x} cy={n.y} r={5} fill={n.c} opacity={0.85} />
              </g>
            ))}
          </g>

          {/* Arrow */}
          <g opacity={nnT}>
            <line x1={175} y1={120} x2={200} y2={120} stroke={P.mlff} strokeWidth="1.5" markerEnd="url(#arwML)" />
          </g>

          {/* Neural network */}
          <g opacity={nnT}>
            <rect x={205} y={55} width={150} height={130} rx="8" fill={P.surface} stroke={P.mlff + "50"} strokeWidth="1.5" />
            <text x={280} y={75} textAnchor="middle" fill={P.mlff} fontSize="9" fontWeight="700">GNN Layers</text>
            {/* Message passing visualization */}
            {[0, 1, 2].map(layer => {
              const lx = 225 + layer * 40;
              return Array.from({ length: 4 }).map((_, ni) => {
                const ny = 90 + ni * 22;
                return (
                  <g key={`${layer}-${ni}`}>
                    <circle cx={lx} cy={ny} r={4} fill={P.mlff + "80"} />
                    {layer < 2 && Array.from({ length: 4 }).map((_, nj) => (
                      <line key={nj} x1={lx} y1={ny} x2={lx + 40} y2={90 + nj * 22}
                        stroke={P.mlff} strokeWidth="0.3" opacity={0.3} />
                    ))}
                  </g>
                );
              });
            })}
          </g>

          {/* Arrow */}
          <g opacity={resultT}>
            <line x1={360} y1={120} x2={385} y2={120} stroke={P.mlff} strokeWidth="1.5" markerEnd="url(#arwML)" />
          </g>

          {/* Output */}
          <g opacity={resultT}>
            <rect x={390} y={55} width={140} height={130} rx="8" fill={P.mlff + "15"} stroke={P.mlff} strokeWidth="1.5" />
            <text x={460} y={78} textAnchor="middle" fill={P.mlff} fontSize="9" fontWeight="700">Predictions</text>
            <text x={460} y={98} textAnchor="middle" fill={P.ink} fontSize="8">E (energy)</text>
            <text x={460} y={113} textAnchor="middle" fill={P.ink} fontSize="8">F (forces)</text>
            <text x={460} y={128} textAnchor="middle" fill={P.ink} fontSize="8">{"\u03C3"} (stress)</text>
            <text x={460} y={148} textAnchor="middle" fill={P.ok} fontSize="8" fontWeight="600">~1000{"\u00D7"} faster</text>
            <text x={460} y={162} textAnchor="middle" fill={P.ok} fontSize="8" fontWeight="600">than DFT</text>
          </g>

          {/* Training details */}
          <g opacity={trainT}>
            <rect x={50} y={210} width={460} height={85} rx="10" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={232} textAnchor="middle" fill={P.mlff} fontSize="10" fontWeight="700">
              Training: DFT Data {"\u2192"} Neural Network Potential
            </text>
            <text x={W / 2} y={252} textAnchor="middle" fill={P.muted} fontSize="9">
              Input: atomic positions + species {"\u2192"} crystal graph representation
            </text>
            <text x={W / 2} y={268} textAnchor="middle" fill={P.muted} fontSize="9">
              Message passing between neighboring atoms learns local chemical environments
            </text>
            <text x={W / 2} y={284} textAnchor="middle" fill={P.ink} fontSize="9" fontWeight="600">
              Models: M3GNet / MACE / CHGNet architectures
            </text>
          </g>

          {/* Bottom */}
          {(() => {
            const noteT = ease(clamp01((t - 0.85) * 4));
            return (
              <text x={W / 2} y={325} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700" opacity={noteT}>
                Enables rapid geometry optimization for new configurations
              </text>
            );
          })()}

          <defs>
            <marker id="arwML" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke={P.mlff} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── GEOMETRY OPTIMIZATION ──
    case "geometry": {
      const titleT = ease(clamp01(t * 3));
      const initialT = ease(clamp01((t - 0.1) * 3));
      const arrowT = ease(clamp01((t - 0.35) * 3));
      const relaxT = ease(clamp01((t - 0.5) * 3));
      const compareT = ease(clamp01((t - 0.7) * 3));

      // Atoms that "relax" over time
      const relaxProgress = clamp01((t - 0.5) * 2);
      const initialAtoms = [
        { x: 40, y: 30, r: 7 }, { x: 85, y: 25, r: 6 }, { x: 120, y: 40, r: 7 },
        { x: 30, y: 65, r: 6 }, { x: 75, y: 70, r: 7 }, { x: 115, y: 60, r: 6 },
        { x: 45, y: 100, r: 6 }, { x: 90, y: 95, r: 7 }, { x: 125, y: 105, r: 6 },
      ];
      const finalAtoms = [
        { x: 35, y: 30, r: 7 }, { x: 80, y: 30, r: 6 }, { x: 125, y: 30, r: 7 },
        { x: 35, y: 67, r: 6 }, { x: 80, y: 67, r: 7 }, { x: 125, y: 67, r: 6 },
        { x: 35, y: 104, r: 6 }, { x: 80, y: 104, r: 7 }, { x: 125, y: 104, r: 6 },
      ];
      const colors = [P.crystal, P.solar, P.chalco, P.solar, P.crystal, P.ok, P.chalco, P.solar, P.crystal];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Rapid Geometry Optimization
          </text>

          {/* Initial structure */}
          <g opacity={initialT}>
            <rect x={30} y={60} width={160} height={150} rx="8" fill={P.surface} stroke={P.warn + "50"} strokeWidth="1.5" />
            <text x={110} y={80} textAnchor="middle" fill={P.warn} fontSize="9" fontWeight="700">Unrelaxed</text>
            {initialAtoms.map((a, i) => (
              <circle key={i} cx={30 + a.x} cy={55 + a.y} r={a.r} fill={colors[i]} opacity={0.8} />
            ))}
          </g>

          {/* MLFF arrow */}
          <g opacity={arrowT}>
            <rect x={210} y={110} width={90} height={35} rx="6" fill={P.mlff + "20"} stroke={P.mlff} strokeWidth="1" />
            <text x={255} y={132} textAnchor="middle" fill={P.mlff} fontSize="9" fontWeight="700">MLFF</text>
            <line x1={195} y1={128} x2={208} y2={128} stroke={P.mlff} strokeWidth="1.5" markerEnd="url(#arwGeo)" />
            <line x1={302} y1={128} x2={325} y2={128} stroke={P.mlff} strokeWidth="1.5" markerEnd="url(#arwGeo)" />
          </g>

          {/* Relaxed structure */}
          <g opacity={relaxT}>
            <rect x={330} y={60} width={160} height={150} rx="8" fill={P.surface} stroke={P.ok + "50"} strokeWidth="1.5" />
            <text x={410} y={80} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700">Relaxed</text>
            {finalAtoms.map((a, i) => {
              const cx = lerp(initialAtoms[i].x, a.x, relaxProgress);
              const cy = lerp(initialAtoms[i].y, a.y, relaxProgress);
              return (
                <circle key={i} cx={330 + cx} cy={55 + cy} r={a.r} fill={colors[i]} opacity={0.8} />
              );
            })}
          </g>

          {/* Comparison */}
          <g opacity={compareT}>
            <rect x={60} y={240} width={440} height={90} rx="10" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={262} textAnchor="middle" fill={P.mlff} fontSize="10" fontWeight="700">
              MLFF vs DFT Geometry Optimization
            </text>
            <text x={150} y={282} textAnchor="middle" fill={P.warn} fontSize="9" fontWeight="600">DFT (HSE06)</text>
            <text x={150} y={298} textAnchor="middle" fill={P.muted} fontSize="9">~48 hours / compound</text>
            <text x={W / 2} y={290} textAnchor="middle" fill={P.dim} fontSize="14">vs</text>
            <text x={400} y={282} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="600">MLFF</text>
            <text x={400} y={298} textAnchor="middle" fill={P.muted} fontSize="9">~3 minutes / compound</text>
            <text x={W / 2} y={320} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="700">
              ~1000{"\u00D7"} speedup with DFT-level accuracy
            </text>
          </g>

          {/* Bottom */}
          {(() => {
            const noteT = ease(clamp01((t - 0.85) * 4));
            return (
              <text x={W / 2} y={360} textAnchor="middle" fill={P.muted} fontSize="9" opacity={noteT}>
                Both bulk and defect-containing configurations optimized with MLFF
              </text>
            );
          })()}

          <defs>
            <marker id="arwGeo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke={P.mlff} strokeWidth="1" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── DEFECT TOLERANCE ──
    case "defecttol": {
      const titleT = ease(clamp01(t * 3));
      const diagT = ease(clamp01((t - 0.15) * 3));
      const goodT = ease(clamp01((t - 0.4) * 3));
      const badT = ease(clamp01((t - 0.55) * 3));
      const criteriaT = ease(clamp01((t - 0.75) * 3));

      // Formation energy diagram
      const px = 60, py = 60, pw = 200, ph = 160;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Defect Tolerance Screening
          </text>

          {/* Formation energy plot - Good */}
          <g opacity={goodT}>
            <rect x={px - 10} y={py - 10} width={pw + 20} height={ph + 40} rx="6" fill={P.surface} stroke={P.ok + "40"} strokeWidth="1" />
            <text x={px + pw / 2} y={py + 5} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700">
              Defect Tolerant
            </text>
            {/* Axes */}
            <line x1={px} y1={py + ph} x2={px + pw} y2={py + ph} stroke={P.dim} strokeWidth="1" />
            <line x1={px} y1={py + 15} x2={px} y2={py + ph} stroke={P.dim} strokeWidth="1" />
            <text x={px + pw / 2} y={py + ph + 15} textAnchor="middle" fill={P.muted} fontSize="7">E_Fermi</text>
            <text x={px - 8} y={py + ph / 2} textAnchor="middle" fill={P.muted} fontSize="7"
              transform={`rotate(-90 ${px - 8} ${py + ph / 2})`}>E_f</text>
            {/* High formation energy lines */}
            <line x1={px + 10} y1={py + 40} x2={px + pw / 2} y2={py + 60}
              stroke={P.ok} strokeWidth="2" />
            <line x1={px + pw / 2} y1={py + 60} x2={px + pw - 10} y2={py + 50}
              stroke={P.ok} strokeWidth="2" />
            <line x1={px + 20} y1={py + 55} x2={px + pw - 20} y2={py + 45}
              stroke={P.crystal} strokeWidth="1.5" strokeDasharray="4,2" />
            <text x={px + pw / 2} y={py + ph + 28} textAnchor="middle" fill={P.ok} fontSize="8" fontWeight="600">
              High E_f {"\u2192"} few defects
            </text>
          </g>

          {/* Formation energy plot - Bad */}
          <g opacity={badT}>
            <rect x={px + pw + 50} y={py - 10} width={pw + 20} height={ph + 40} rx="6" fill={P.surface} stroke={P.warn + "40"} strokeWidth="1" />
            <text x={px + pw + 50 + (pw + 20) / 2} y={py + 5} textAnchor="middle" fill={P.warn} fontSize="9" fontWeight="700">
              Not Tolerant
            </text>
            <line x1={px + pw + 60} y1={py + ph} x2={px + 2 * pw + 60} y2={py + ph} stroke={P.dim} strokeWidth="1" />
            <line x1={px + pw + 60} y1={py + 15} x2={px + pw + 60} y2={py + ph} stroke={P.dim} strokeWidth="1" />
            <text x={px + pw + 60 + pw / 2} y={py + ph + 15} textAnchor="middle" fill={P.muted} fontSize="7">E_Fermi</text>
            {/* Low formation energy */}
            <line x1={px + pw + 70} y1={py + ph - 20} x2={px + pw + 60 + pw / 2} y2={py + ph - 40}
              stroke={P.warn} strokeWidth="2" />
            <line x1={px + pw + 60 + pw / 2} y1={py + ph - 40} x2={px + 2 * pw + 50} y2={py + ph - 25}
              stroke={P.warn} strokeWidth="2" />
            <line x1={px + pw + 80} y1={py + ph - 10} x2={px + 2 * pw + 40} y2={py + ph - 30}
              stroke={P.defect} strokeWidth="1.5" strokeDasharray="4,2" />
            <text x={px + pw + 60 + pw / 2} y={py + ph + 28} textAnchor="middle" fill={P.warn} fontSize="8" fontWeight="600">
              Low E_f {"\u2192"} many defects
            </text>
          </g>

          {/* Criteria box */}
          <g opacity={criteriaT}>
            <rect x={70} y={290} width={420} height={90} rx="10" fill={P.surface} stroke={P.chalco + "40"} strokeWidth="1" />
            <text x={W / 2} y={312} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
              Defect Tolerance Criteria
            </text>
            <text x={W / 2} y={332} textAnchor="middle" fill={P.muted} fontSize="9">
              1. No deep trap levels in the band gap (shallow defects only)
            </text>
            <text x={W / 2} y={348} textAnchor="middle" fill={P.muted} fontSize="9">
              2. High formation energy for killer defects (vacancies, antisites)
            </text>
            <text x={W / 2} y={364} textAnchor="middle" fill={P.muted} fontSize="9">
              3. Favorable doping: n-type or p-type dopability without compensation
            </text>
          </g>
        </svg>
      );
    }

    // ── CHAMPION COMPOUND ──
    case "champion": {
      const titleT = ease(clamp01(t * 3));
      const formulaT = ease(clamp01((t - 0.15) * 3));
      const propsT = ease(clamp01((t - 0.35) * 3));
      const structT = ease(clamp01((t - 0.55) * 3));
      const whyT = ease(clamp01((t - 0.75) * 3));

      const props = [
        { label: "Band Gap", value: "~1.4 eV", status: "\u2713", color: P.ok },
        { label: "Stability", value: "\u0394H < 0", status: "\u2713", color: P.ok },
        { label: "SLME", value: "> 28%", status: "\u2713", color: P.ok },
        { label: "Defect Tolerance", value: "High E\u1DA0", status: "\u2713", color: P.ok },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            Champion Compound
          </text>

          {/* Formula */}
          <g opacity={formulaT}>
            <rect x={100} y={48} width={360} height={50} rx="10"
              fill={P.chalco + "15"} stroke={P.chalco} strokeWidth="2" />
            <text x={W / 2} y={80} textAnchor="middle" fill={P.ink} fontSize="20" fontWeight="900"
              fontFamily="'Inter',sans-serif">
              <tspan>Cu</tspan><tspan dy="5" fontSize="13">2</tspan>
              <tspan dy="-5">Ca</tspan><tspan dy="5" fontSize="13">0.5</tspan>
              <tspan dy="-5">Cd</tspan><tspan dy="5" fontSize="13">0.5</tspan>
              <tspan dy="-5">SnS</tspan><tspan dy="5" fontSize="13">4</tspan>
            </text>
          </g>

          {/* Properties checklist */}
          <g opacity={propsT}>
            {props.map((p, i) => {
              const py = 120 + i * 35;
              return (
                <g key={i}>
                  <rect x={95} y={py} width={370} height={28} rx="6"
                    fill={p.color + "10"} stroke={p.color + "30"} strokeWidth="1" />
                  <text x={120} y={py + 19} fill={p.color} fontSize="13" fontWeight="800">{p.status}</text>
                  <text x={145} y={py + 18} fill={P.ink} fontSize="10" fontWeight="600">{p.label}</text>
                  <text x={430} y={py + 18} textAnchor="end" fill={p.color} fontSize="10" fontWeight="700">{p.value}</text>
                </g>
              );
            })}
          </g>

          {/* Structure description */}
          <g opacity={structT}>
            <rect x={70} y={268} width={420} height={55} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={290} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
              Zincblende-derived kesterite structure
            </text>
            <text x={W / 2} y={308} textAnchor="middle" fill={P.muted} fontSize="9">
              Ca/Cd mixing on the II-site enables band gap tuning while maintaining stability
            </text>
          </g>

          {/* Why it matters */}
          <g opacity={whyT}>
            <rect x={70} y={338} width={420} height={55} rx="8" fill={P.ok + "10"} stroke={P.ok + "40"} strokeWidth="1" />
            <text x={W / 2} y={358} textAnchor="middle" fill={P.ok} fontSize="10" fontWeight="700">
              Why this matters
            </text>
            <text x={W / 2} y={376} textAnchor="middle" fill={P.muted} fontSize="9">
              Satisfies all three criteria: thermodynamic stability + PV band gap + defect tolerance
            </text>
          </g>
        </svg>
      );
    }

    // ── CHALCODB PLATFORM ──
    case "platform": {
      const titleT = ease(clamp01(t * 3));
      const logoT = ease(clamp01((t - 0.15) * 3));
      const featuresT = ease(clamp01((t - 0.35) * 3));
      const workflowT = ease(clamp01((t - 0.6) * 3));

      const features = [
        { label: "Search Compounds", desc: "Query by composition, band gap, stability", icon: "\uD83D\uDD0D" },
        { label: "Predict Properties", desc: "RF models for instant predictions", icon: "\u26A1" },
        { label: "Optimize Structures", desc: "MLFF geometry optimization", icon: "\uD83D\uDD27" },
        { label: "Download Data", desc: "Full DFT dataset available", icon: "\uD83D\uDCBE" },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            ChalcoDB on nanoHUB
          </text>

          {/* Platform box */}
          <g opacity={logoT}>
            <rect x={130} y={48} width={300} height={50} rx="10"
              fill={P.chalco + "15"} stroke={P.chalco} strokeWidth="2" />
            <text x={W / 2} y={70} textAnchor="middle" fill={P.chalco} fontSize="18" fontWeight="900">
              ChalcoDB
            </text>
            <text x={W / 2} y={88} textAnchor="middle" fill={P.muted} fontSize="9">
              Open-access tool on nanoHUB.org
            </text>
          </g>

          {/* Features */}
          {features.map((f, i) => {
            const fT = ease(clamp01((featuresT - i * 0.1) * 3));
            const row = Math.floor(i / 2);
            const col = i % 2;
            const fx = 55 + col * 240;
            const fy = 115 + row * 68;
            return (
              <g key={i} opacity={fT}>
                <rect x={fx} y={fy} width={220} height={55} rx="8"
                  fill={P.surface} stroke={P.chalco + "30"} strokeWidth="1" />
                <text x={fx + 15} y={fy + 22} fill={P.chalco} fontSize="12">{f.icon}</text>
                <text x={fx + 35} y={fy + 22} fill={P.ink} fontSize="10" fontWeight="700">{f.label}</text>
                <text x={fx + 35} y={fy + 40} fill={P.muted} fontSize="8">{f.desc}</text>
              </g>
            );
          })}

          {/* Workflow */}
          <g opacity={workflowT}>
            <rect x={50} y={275} width={460} height={95} rx="10" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={298} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">
              Complete Computational Workflow
            </text>
            {[
              { label: "Input\nComposition", x: 85, color: P.crystal },
              { label: "RF\nScreening", x: 185, color: P.ok },
              { label: "MLFF\nRelaxation", x: 285, color: P.mlff },
              { label: "Property\nPrediction", x: 385, color: P.chalco },
              { label: "Result\nExport", x: 465, color: P.solar },
            ].map((s, i, arr) => (
              <g key={i}>
                <rect x={s.x - 35} y={315} width={70} height={38} rx="6"
                  fill={s.color + "15"} stroke={s.color + "40"} strokeWidth="1" />
                {s.label.split("\n").map((line, li) => (
                  <text key={li} x={s.x} y={330 + li * 12} textAnchor="middle"
                    fill={s.color} fontSize="8" fontWeight="600">{line}</text>
                ))}
                {i < arr.length - 1 && (
                  <line x1={s.x + 38} y1={334} x2={arr[i + 1].x - 38} y2={334}
                    stroke={P.dim} strokeWidth="1" markerEnd="url(#arwPlat)" />
                )}
              </g>
            ))}
          </g>

          <defs>
            <marker id="arwPlat" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="none" stroke={P.dim} strokeWidth="0.8" />
            </marker>
          </defs>
        </svg>
      );
    }

    // ── FINALE ──
    case "finale": {
      const titleT = ease(clamp01(t * 3));
      const box1T = ease(clamp01((t - 0.15) * 3));
      const box2T = ease(clamp01((t - 0.35) * 3));
      const impactT = ease(clamp01((t - 0.6) * 3));
      const futureT = ease(clamp01((t - 0.8) * 3));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={32} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="900" opacity={titleT}>
            The Future of Chalcogenide Design
          </text>

          {/* Key achievements */}
          <g opacity={box1T}>
            <rect x={30} y={55} width={240} height={105} rx="8" fill={P.surface} stroke={P.chalco + "40"} strokeWidth="1" />
            <text x={150} y={78} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="700">What We Achieved</text>
            <text x={150} y={98} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} 500K compositions screened</text>
            <text x={150} y={114} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} ~1,200 stable candidates found</text>
            <text x={150} y={130} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} Champion: Cu{"\u2082"}Ca{"\u2080"}{"\u2085"}Cd{"\u2080"}{"\u2085"}SnS{"\u2084"}</text>
            <text x={150} y={146} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} ChalcoDB released on nanoHUB</text>
          </g>

          {/* Methods */}
          <g opacity={box2T}>
            <rect x={290} y={55} width={240} height={105} rx="8" fill={P.surface} stroke={P.mlff + "40"} strokeWidth="1" />
            <text x={410} y={78} textAnchor="middle" fill={P.mlff} fontSize="10" fontWeight="700">Methods Developed</text>
            <text x={410} y={98} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} HSE06+SOC high-throughput DFT</text>
            <text x={410} y={114} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} RF regression (composition features)</text>
            <text x={410} y={130} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} Crystal graph MLFF models</text>
            <text x={410} y={146} textAnchor="middle" fill={P.ink} fontSize="9">{"\u2022"} Defect tolerance screening</text>
          </g>

          {/* Impact numbers */}
          <g opacity={impactT}>
            {[
              { label: "Speedup", value: "1000\u00D7", sub: "MLFF vs DFT", color: P.mlff, x: 110 },
              { label: "Candidates", value: "~1,200", sub: "stable compounds", color: P.ok, x: 280 },
              { label: "Community", value: "Open", sub: "nanoHUB access", color: P.chalco, x: 450 },
            ].map((s, i) => (
              <g key={i}>
                <text x={s.x} y={200} textAnchor="middle" fill={s.color} fontSize="22" fontWeight="900">{s.value}</text>
                <text x={s.x} y={216} textAnchor="middle" fill={P.ink} fontSize="9" fontWeight="600">{s.label}</text>
                <text x={s.x} y={230} textAnchor="middle" fill={P.muted} fontSize="8">{s.sub}</text>
              </g>
            ))}
          </g>

          {/* Future directions */}
          <g opacity={futureT}>
            <rect x={50} y={250} width={460} height={100} rx="10" fill={P.surface} stroke={P.border} strokeWidth="1" />
            <text x={W / 2} y={275} textAnchor="middle" fill={P.chalco} fontSize="11" fontWeight="700">
              Next Steps
            </text>
            {[
              { label: "Experimental validation of predicted champion compounds", x: W / 2, y: 295 },
              { label: "Extend to pentanary and higher-order alloys", x: W / 2, y: 312 },
              { label: "Active learning: iterative DFT + MLFF refinement", x: W / 2, y: 329 },
            ].map((s, i) => (
              <text key={i} x={s.x} y={s.y} textAnchor="middle" fill={P.muted} fontSize="9">
                {i + 1}. {s.label}
              </text>
            ))}
          </g>

          {/* Sign off */}
          {(() => {
            const signT = ease(clamp01((t - 0.9) * 5));
            return (
              <text x={W / 2} y={380} textAnchor="middle" fill={P.chalco} fontSize="10" fontWeight="600" opacity={signT}>
                ChalcoDB {"\u2014"} Accelerating chalcogenide discovery with data-driven design
              </text>
            );
          })()}
        </svg>
      );
    }

    default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════════════════
  const totalDuration = SCENES.reduce((s, sc) => s + sc.duration, 0);
  const elapsed = SCENES.slice(0, sceneIdx).reduce((s, sc) => s + sc.duration, 0) + progress * scene.duration;
  const globalProgress = elapsed / totalDuration;

  return (
    <div style={{
      maxWidth: 1100, margin: "0 auto", padding: "24px 20px",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 10, letterSpacing: 4, color: P.muted, textTransform: "uppercase", marginBottom: 4,
        }}>Animated Module</div>
        <div style={{
          fontSize: 22, fontWeight: 800, color: P.chalco, marginBottom: 4,
        }}>ChalcoDB {"\u2014"} Data-Driven Chalcogenide Design</div>
        <div style={{ fontSize: 13, color: P.muted, lineHeight: 1.5 }}>
          From high-throughput DFT to machine learning: designing multinary chalcogenide solar absorbers.
        </div>
      </div>

      {/* Cinema screen */}
      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
      }}>
        {/* Scene title overlay */}
        <div style={{
          position: "absolute", top: 10, left: 14, zIndex: 2,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            background: P.chalco + "25", border: `1px solid ${P.chalco}50`,
            padding: "3px 10px", borderRadius: 6,
            fontSize: 10, fontWeight: 700, color: P.chalco, letterSpacing: 1,
          }}>Scene {sceneIdx + 1}/{SCENES.length}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{scene.label}</span>
        </div>

        {/* Author watermark */}
        <div style={{
          position: "absolute", top: 10, right: 14, zIndex: 2,
          fontSize: 11, color: "#ffffff", fontWeight: 600, opacity: 0.85,
        }}>
          Developed by Habibur Rahman {"\u00B7"} rahma103@purdue.edu
        </div>

        {/* SVG Scene */}
        {renderScene()}

        {/* Scene progress bar */}
        <div style={{
          height: 3, background: P.dim + "30", position: "relative",
        }}>
          <div style={{
            height: "100%", background: P.chalco,
            width: `${progress * 100}%`, borderRadius: 2,
            transition: playing ? "none" : "width 0.1s",
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginTop: 14,
        background: P.panel, padding: "10px 14px", borderRadius: 12,
        border: `1px solid ${P.border}`,
      }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.chalco}`,
          background: P.chalco + "15", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18,
          color: P.chalco, fontWeight: 900, fontFamily: "inherit",
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
          <div style={{
            height: 6, background: P.dim + "30", borderRadius: 3, position: "relative", cursor: "pointer",
          }} onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            let accum = 0;
            for (let i = 0; i < SCENES.length; i++) {
              const sceneFrac = SCENES[i].duration / totalDuration;
              if (accum + sceneFrac >= clickRatio) {
                goScene(i);
                break;
              }
              accum += sceneFrac;
            }
          }}>
            <div style={{
              height: "100%", background: `linear-gradient(90deg, ${P.chalco}, ${P.dft}, ${P.mlff})`,
              width: `${globalProgress * 100}%`, borderRadius: 3,
            }} />
            {SCENES.map((_, i) => {
              const pos = SCENES.slice(0, i).reduce((s, sc) => s + sc.duration, 0) / totalDuration;
              return i > 0 ? (
                <div key={i} style={{
                  position: "absolute", left: `${pos * 100}%`, top: -2,
                  width: 1, height: 10, background: P.dim,
                }} />
              ) : null;
            })}
          </div>
        </div>

        <span style={{ fontSize: 10, color: P.muted, fontFamily: "monospace", minWidth: 50, textAlign: "right" }}>
          {Math.floor(elapsed / 1000)}s / {Math.floor(totalDuration / 1000)}s
        </span>
      </div>

      {/* Scene selector chips */}
      <div style={{
        display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap",
      }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.chalco + "20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.chalco : P.border}`,
            color: i === sceneIdx ? P.chalco : i < sceneIdx ? P.mlff : P.muted,
            fontWeight: i === sceneIdx ? 700 : 500, fontFamily: "inherit",
            transition: "all 0.15s",
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
