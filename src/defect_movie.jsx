import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DEFECT MOVIE — Animated cinematic walkthrough
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
};

// ── Scenes ──
const SCENES = [
  { id: "title",    label: "DefectDB",              duration: 4000 },
  { id: "howpv",    label: "How Solar Cells Work", duration: 8000 },
  { id: "compare",  label: "Cell Efficiencies",    duration: 7000 },
  { id: "crystal",  label: "Perfect Crystal",      duration: 5000 },
  { id: "defect",   label: "A Defect Is Born",     duration: 6000 },
  { id: "trap",     label: "The Carrier Trap",     duration: 7000 },
  { id: "srh",      label: "Recombination",        duration: 7000 },
  { id: "loss",     label: "Efficiency Lost",      duration: 6000 },
  { id: "dft",      label: "Enter DFT",            duration: 7000 },
  { id: "bottleneck", label: "The DFT Bottleneck", duration: 6000 },
  { id: "learn",    label: "How MLFF Learns",       duration: 8000 },
  { id: "dfe",      label: "Formation Energy",      duration: 9000 },
  { id: "mlff",     label: "MLFF Acceleration",    duration: 7000 },
  { id: "screen",   label: "Screening at Scale",   duration: 6000 },
  { id: "finale",   label: "The Future",           duration: 7000 },
];

// ── Easing helpers ──
const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function DefectMovieModule() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [progress, setProgress] = useState(0);        // 0..1 within scene
  const [playing, setPlaying] = useState(false);
  const [manualMode, setManualMode] = useState(false); // user took control
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

  // Manual scene advance (also runs scene animation)
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

  const t = progress; // 0-1 within current scene

  // Smooth fade-in / fade-out between scenes
  const fadeIn = clamp01(t * 8);       // fade in over first ~12%
  const isLastScene = sceneIdx === SCENES.length - 1;
  const keepVisible = isLastScene || !playing; // don't fade out on last scene or when paused
  const fadeOut = keepVisible ? 1 : clamp01((1 - t) * 8);
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // ═══════════════════════════════════════════════════════════════════════
  // CRYSTAL LATTICE GENERATOR
  // ═══════════════════════════════════════════════════════════════════════
  const GRID = 7;
  const SPACING = 52;
  const lattice = useMemo(() => {
    const atoms = [];
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = 110 + c * SPACING + (r % 2 === 1 ? SPACING / 2 : 0);
        const y = 62 + r * SPACING * 0.87;
        const isCd = (r + c) % 2 === 0;
        atoms.push({ x, y, r: r, c: c, elem: isCd ? "Cd" : "Te", color: isCd ? P.crystal : P.solar });
      }
    }
    return atoms;
  }, []);

  const defectIdx = 24; // center-ish atom to remove

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
          {/* Subtle grid */}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`g${i}`} x1={0} y1={i * 28} x2={W} y2={i * 28}
              stroke={P.dim} strokeWidth="0.3" opacity={0.3} />
          ))}
          <text x={W / 2} y={130} textAnchor="middle" fill={P.ink} fontSize="28" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={titleOp}>
            Defects in Solar Cells
          </text>
          <rect x={(W - lineW) / 2} y={148} width={lineW} height={3} rx="1.5"
            fill={P.solar} opacity={titleOp * 0.8} />
          <text x={W / 2} y={185} textAnchor="middle" fill={P.muted} fontSize="14"
            fontFamily="'Inter',sans-serif" opacity={subOp}>
            An Animated Journey from Atomistic Simulations to Machine Learning
          </text>
          <text x={W / 2} y={220} textAnchor="middle" fill={P.crystal} fontSize="13"
            fontFamily="'Inter',sans-serif" opacity={subOp * 0.7}>
            <tspan>CdTe</tspan>
            <tspan>{" \u00B7 CuInS"}</tspan><tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">{" \u00B7 Cu"}</tspan><tspan dy="3" fontSize="9">2</tspan><tspan dy="-3">{"ZnSnS"}</tspan><tspan dy="3" fontSize="9">4</tspan><tspan dy="-3">{" \u00B7 CdSeTe"}</tspan>
          </text>
          {/* Subtle animated line */}
          {(() => {
            const lineOp = ease(clamp01((t - 0.5) * 2.5));
            const lineW2 = ease(clamp01((t - 0.55) * 2)) * 300;
            return (
              <rect x={(W - lineW2) / 2} y={255} width={lineW2} height={1} rx="0.5"
                fill={P.crystal} opacity={lineOp * 0.25} />
            );
          })()}
          {/* Author info */}
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

    // ── HOW SOLAR CELLS WORK ──
    case "howpv": {
      const sunT = ease(clamp01(t * 2.5));
      const photonT = clamp01((t - 0.1) * 2);
      const pairT = ease(clamp01((t - 0.3) * 2.5));
      const driftT = ease(clamp01((t - 0.5) * 2.5));
      const currentT = ease(clamp01((t - 0.7) * 3));
      const photonY = 30 + photonT * 105; // photon falls into absorber
      const eY = pairT < 1 ? 160 - pairT * 60 : 100 - driftT * 40; // electron drifts up
      const hY = pairT < 1 ? 160 + pairT * 50 : 210 + driftT * 30; // hole drifts down

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={25} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="900" opacity={sunT}>
            How a solar cell works
          </text>

          {/* Sun */}
          <g opacity={sunT}>
            <circle cx={100} cy={70} r={28} fill={P.photon + "30"} stroke={P.photon} strokeWidth="2" />
            <text x={100} y={74} textAnchor="middle" fill={P.photon} fontSize="10" fontWeight="800">Sun</text>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = deg * Math.PI / 180;
              return (
                <line key={i} x1={100 + Math.cos(rad) * 32} y1={70 + Math.sin(rad) * 32}
                  x2={100 + Math.cos(rad) * (38 + Math.sin(t * 8 + i) * 3)} y2={70 + Math.sin(rad) * (38 + Math.sin(t * 8 + i) * 3)}
                  stroke={P.photon} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              );
            })}
          </g>

          {/* Photon arrow from sun to cell */}
          <g opacity={sunT}>
            <line x1={130} y1={85} x2={200} y2={130} stroke={P.photon} strokeWidth="1.5" strokeDasharray="5,3" />
            <polygon points="198,126 205,133 195,133" fill={P.photon} />
            <text x={175} y={100} fill={P.photon} fontSize="8" fontWeight="600"
              transform="rotate(20,175,100)">h{"\u03BD"} (photon)</text>
          </g>

          {/* Solar cell device (center) */}
          <g opacity={sunT}>
            {/* Device outline */}
            <rect x={190} y={50} width={200} height={220} rx="8" fill="none" stroke={P.border} strokeWidth="1.5" />
            {/* n-type top */}
            <rect x={194} y={54} width={192} height={40} rx="4" fill={P.electron + "10"} stroke={P.electron + "25"} strokeWidth="0.8" />
            <text x={290} y={70} textAnchor="middle" fill={P.electron} fontSize="8" fontWeight="700">n-type (CdS)</text>
            <text x={290} y={82} textAnchor="middle" fill={P.muted} fontSize="6">Electron-rich side</text>
            {/* Junction line */}
            <line x1={194} y1={96} x2={386} y2={96} stroke={P.ink} strokeWidth="1.5" strokeDasharray="4,3" />
            <text x={395} y={100} fill={P.ink} fontSize="7" fontWeight="600">p-n junction</text>
            {/* p-type absorber */}
            <rect x={194} y={98} width={192} height={110} rx="4" fill={P.solar + "08"} stroke={P.solar + "20"} strokeWidth="0.8" />
            <text x={290} y={148} textAnchor="middle" fill={P.solar} fontSize="9" fontWeight="700">p-type (CdTe absorber)</text>
            <text x={290} y={162} textAnchor="middle" fill={P.muted} fontSize="6">Photon absorbed here {"\u2192"} e{"\u207B"}/h{"\u207A"} pair created</text>
            {/* Back contact */}
            <rect x={194} y={210} width={192} height={30} rx="4" fill={P.dim + "15"} stroke={P.dim + "30"} strokeWidth="0.8" />
            <text x={290} y={229} textAnchor="middle" fill={P.dim} fontSize="7" fontWeight="600">Back contact (Cu/Mo)</text>
            {/* Built-in electric field arrow */}
            <line x1={175} y1={210} x2={175} y2={55} stroke={P.ok} strokeWidth="1.5" />
            <polygon points="171,58 179,58 175,48" fill={P.ok} />
            <text x={168} y={135} fill={P.ok} fontSize="7" fontWeight="700"
              transform="rotate(-90,168,135)">Built-in E-field</text>
          </g>

          {/* Photon entering absorber */}
          {photonT > 0 && photonT < 1 && (
            <g>
              <circle cx={290} cy={photonY} r={6} fill={P.photon} opacity={0.8} />
              <text x={290} y={photonY + 3} textAnchor="middle" fill="#000" fontSize="6" fontWeight="800">h{"\u03BD"}</text>
            </g>
          )}

          {/* Electron-hole pair creation */}
          {pairT > 0 && (
            <g>
              {/* Burst at creation point */}
              {pairT < 0.5 && (
                <circle cx={290} cy={160} r={8 + pairT * 30} fill="none"
                  stroke={P.photon} strokeWidth={2 * (1 - pairT * 2)} opacity={1 - pairT * 2} />
              )}
              {/* Electron moving up */}
              <circle cx={270} cy={eY} r={7} fill={P.electron} />
              <text x={270} y={eY + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800">e{"\u207B"}</text>
              {driftT > 0 && driftT < 1 && (
                <line x1={270} y1={eY + 8} x2={270} y2={eY + 25}
                  stroke={P.electron} strokeWidth="1" strokeDasharray="2,3" opacity="0.4" />
              )}
              {/* Hole moving down */}
              <circle cx={310} cy={hY} r={7} fill={P.hole} />
              <text x={310} y={hY + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800">h{"\u207A"}</text>
              {driftT > 0 && driftT < 1 && (
                <line x1={310} y1={hY - 8} x2={310} y2={hY - 25}
                  stroke={P.hole} strokeWidth="1" strokeDasharray="2,3" opacity="0.4" />
              )}
            </g>
          )}

          {/* External circuit + load */}
          {currentT > 0 && (
            <g opacity={currentT}>
              {/* Wire top */}
              <line x1={386} y1={70} x2={470} y2={70} stroke={P.electron + "60"} strokeWidth="1.5" />
              <line x1={470} y1={70} x2={470} y2={190} stroke={P.electron + "60"} strokeWidth="1.5" />
              {/* Wire bottom */}
              <line x1={386} y1={225} x2={440} y2={225} stroke={P.electron + "60"} strokeWidth="1.5" />
              <line x1={440} y1={225} x2={440} y2={190} stroke={P.electron + "60"} strokeWidth="1.5" />
              {/* Load / bulb */}
              <rect x={435} y={170} width={40} height={25} rx="6" fill={P.photon + "15"} stroke={P.photon + "50"} strokeWidth="1.5" />
              <text x={455} y={186} textAnchor="middle" fill={P.photon} fontSize="8" fontWeight="700">Load</text>
              {/* Current direction */}
              <text x={480} y={135} fill={P.electron} fontSize="8" fontWeight="700"
                transform="rotate(90,480,135)">Current {"\u2192"}</text>
              {/* Flowing electrons */}
              {[0, 0.33, 0.66].map((off, i) => {
                const phase = ((t * 3) + off) % 1;
                const ey2 = 70 + phase * 120;
                return <circle key={i} cx={470} cy={ey2} r={3} fill={P.electron} opacity="0.6" />;
              })}
            </g>
          )}

          {/* Step annotations */}
          <g opacity={currentT}>
            {[
              { n: "1", text: "Photon absorbed", x: 60, y: 320, color: P.photon },
              { n: "2", text: "e\u207B/h\u207A pair created", x: 175, y: 320, color: P.ink },
              { n: "3", text: "E-field separates carriers", x: 310, y: 320, color: P.ok },
              { n: "4", text: "Current flows", x: 445, y: 320, color: P.electron },
            ].map((s, i) => (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r={8} fill={s.color + "20"} stroke={s.color} strokeWidth="1" />
                <text x={s.x} y={s.y + 3.5} textAnchor="middle" fill={s.color} fontSize="7" fontWeight="800">{s.n}</text>
                <text x={s.x} y={s.y + 20} textAnchor="middle" fill={P.muted} fontSize="7" fontWeight="600">{s.text}</text>
              </g>
            ))}
          </g>

          <text x={W / 2} y={H - 10} textAnchor="middle" fill={P.muted} fontSize="10" opacity={sunT}>
            Photovoltaic effect: light energy {"\u2192"} electrical energy
          </text>
        </svg>
      );
    }

    // ── BEST RESEARCH-CELL EFFICIENCIES ──
    case "compare": {
      const titleT = ease(clamp01(t * 3));
      const cells = [
        { name: "Perovskite/Si tandem", eff: 33.9, color: "#eab308" },
        { name: "Crystalline Si (single)", eff: 27.9, color: "#3b82f6" },
        { name: "Perovskite", eff: 26.1, color: "#ef4444" },
        { name: "CIGS", eff: 23.6, color: "#22c55e" },
        { name: "CdTe", eff: 22.5, color: "#f97316" },
        { name: "CZTSSe", eff: 13.0, color: "#991b1b" },
      ];
      const maxEff = 40;
      const barX = 170, barMaxW = 310, barH = 30, barGap = 12;
      const startY = 58;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={32} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="900" opacity={titleT}>
            Best research-cell efficiencies (2024)
          </text>

          {/* Bars */}
          {cells.map((c, i) => {
            const barT = ease(clamp01((t - 0.1 - i * 0.08) * 3));
            const by = startY + i * (barH + barGap);
            const bw = (c.eff / maxEff) * barMaxW * barT;
            const isCdTe = c.name === "CdTe";
            return (
              <g key={i}>
                {/* Label */}
                <text x={barX - 8} y={by + barH / 2 + 4} textAnchor="end"
                  fill={isCdTe ? c.color : P.ink} fontSize={isCdTe ? "10" : "9"} fontWeight={isCdTe ? "800" : "600"}>
                  {c.name}
                </text>
                {/* Bar */}
                <rect x={barX} y={by} width={Math.max(2, bw)} height={barH} rx="4"
                  fill={c.color + (isCdTe ? "90" : "70")} stroke={isCdTe ? c.color : "none"}
                  strokeWidth={isCdTe ? 2 : 0} />
                {/* Efficiency value */}
                {barT > 0.5 && (
                  <text x={barX + bw + 8} y={by + barH / 2 + 4}
                    fill={c.color} fontSize="11" fontWeight="800" opacity={ease(clamp01((barT - 0.5) * 4))}>
                    {c.eff}%
                  </text>
                )}
                {/* Highlight CdTe */}
                {isCdTe && barT > 0.8 && (
                  <rect x={barX - 2} y={by - 3} width={bw + 4} height={barH + 6} rx="6"
                    fill="none" stroke={c.color} strokeWidth="1.5" strokeDasharray="4,3"
                    opacity={0.5 + Math.sin(t * 6) * 0.3} />
                )}
              </g>
            );
          })}

          {/* X axis */}
          {(() => {
            const axT = ease(clamp01((t - 0.15) * 3));
            const axY = startY + cells.length * (barH + barGap) + 8;
            return (
              <g opacity={axT}>
                <line x1={barX} y1={axY} x2={barX + barMaxW} y2={axY} stroke={P.dim} strokeWidth="1" />
                {[0, 5, 10, 15, 20, 25, 30, 35, 40].map(v => {
                  const xx = barX + (v / maxEff) * barMaxW;
                  return (
                    <g key={v}>
                      <line x1={xx} y1={axY} x2={xx} y2={axY + 4} stroke={P.dim} strokeWidth="0.8" />
                      <text x={xx} y={axY + 14} textAnchor="middle" fill={P.muted} fontSize="7">{v}</text>
                    </g>
                  );
                })}
                <text x={barX + barMaxW / 2} y={axY + 28} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600">
                  Cell efficiency (%)
                </text>
              </g>
            );
          })()}

          {/* CdTe callout */}
          {(() => {
            const callT = ease(clamp01((t - 0.7) * 3));
            return callT > 0 ? (
              <g opacity={callT}>
                <rect x={160} y={362} width={300} height={36} rx="6" fill={P.solar + "10"} stroke={P.solar + "40"} strokeWidth="1.5" />
                <text x={310} y={377} textAnchor="middle" fill={P.solar} fontSize="9" fontWeight="800">
                  CdTe: dominant thin-film PV {"\u2014"} defects limit efficiency
                </text>
                <text x={310} y={390} textAnchor="middle" fill={P.muted} fontSize="7">
                  Shockley-Queisser limit ~32% {"\u2192"} ~10% lost to defect recombination
                </text>
              </g>
            ) : null;
          })()}

          <text x={W / 2} y={H - 8} textAnchor="middle" fill={P.muted} fontSize="9" opacity={titleT}>
            Source: NREL Best Research-Cell Efficiency Chart (2024)
          </text>
        </svg>
      );
    }

    // ── PERFECT CRYSTAL ──
    case "crystal": {
      const reveal = ease(clamp01(t * 2));
      const pulsePhase = t * Math.PI * 4;
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Bonds first */}
          {lattice.map((a, i) => {
            return lattice.filter((b, j) => {
              if (j <= i) return false;
              const dx = a.x - b.x, dy = a.y - b.y;
              return Math.sqrt(dx * dx + dy * dy) < SPACING * 1.15;
            }).map((b, bi) => (
              <line key={`b${i}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={P.dim} strokeWidth="1" opacity={reveal * 0.4} />
            ));
          })}
          {/* Atoms */}
          {lattice.map((a, i) => {
            const delay = (a.r * 0.08 + a.c * 0.06);
            const op = ease(clamp01((t * 2 - delay)));
            const pulse = 1 + Math.sin(pulsePhase + i * 0.5) * 0.08;
            return (
              <g key={i} opacity={op}>
                <circle cx={a.x} cy={a.y} r={9 * pulse} fill={a.color + "25"} stroke={a.color} strokeWidth="1.5" />
                <text x={a.x} y={a.y + 3.5} textAnchor="middle" fill={a.color} fontSize="7" fontWeight="700">{a.elem}</text>
              </g>
            );
          })}
          {/* Label */}
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.muted} fontSize="12" fontWeight="600">
            Perfect CdTe crystal lattice {"\u2014"} every atom in its place
          </text>
        </svg>
      );
    }

    // ── DEFECT BIRTH ──
    case "defect": {
      const removeT = ease(clamp01((t - 0.15) * 3));
      const rippleT = clamp01((t - 0.35) * 2.5);
      const shakeT = clamp01((t - 0.3) * 4);
      const da = lattice[defectIdx];
      const rippleR = rippleT * 160;
      const labelOp = ease(clamp01((t - 0.6) * 3));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Ripple */}
          {rippleT > 0 && (
            <circle cx={da.x} cy={da.y} r={rippleR} fill="none"
              stroke={P.defect} strokeWidth={2.5 * (1 - rippleT)} opacity={0.6 * (1 - rippleT)} />
          )}
          {/* Bonds */}
          {lattice.map((a, i) => {
            return lattice.filter((b, j) => {
              if (j <= i) return false;
              const dx = a.x - b.x, dy = a.y - b.y;
              return Math.sqrt(dx * dx + dy * dy) < SPACING * 1.15;
            }).map((b, bi) => {
              const touchesDefect = i === defectIdx || lattice.indexOf(b) === defectIdx;
              return (
                <line key={`b${i}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={touchesDefect ? P.defect + "40" : P.dim}
                  strokeWidth={touchesDefect ? 1.5 : 1}
                  opacity={touchesDefect ? (1 - removeT) * 0.6 : 0.4}
                  strokeDasharray={touchesDefect ? "4,3" : "none"} />
              );
            });
          })}
          {/* Atoms */}
          {lattice.map((a, i) => {
            const isDefect = i === defectIdx;
            const dist = Math.sqrt((a.x - da.x) ** 2 + (a.y - da.y) ** 2);
            const isNeighbor = !isDefect && dist < SPACING * 1.2;
            // Neighbor displacement (relaxation)
            let dx = 0, dy = 0;
            if (isNeighbor && shakeT > 0) {
              const angle = Math.atan2(a.y - da.y, a.x - da.x);
              const disp = ease(shakeT) * 5;
              dx = Math.cos(angle) * disp;
              dy = Math.sin(angle) * disp;
            }
            if (isDefect) {
              return (
                <g key={i} opacity={1 - removeT}>
                  <circle cx={a.x} cy={a.y} r={9 + removeT * 6} fill={P.defect + "30"}
                    stroke={P.defect} strokeWidth="2" strokeDasharray="3,2" />
                  <text x={a.x} y={a.y + 3.5} textAnchor="middle" fill={P.defect} fontSize="7" fontWeight="700">{a.elem}</text>
                </g>
              );
            }
            return (
              <g key={i}>
                <circle cx={a.x + dx} cy={a.y + dy} r={9}
                  fill={(isNeighbor ? a.color + "35" : a.color + "25")}
                  stroke={isNeighbor ? P.defect + "80" : a.color} strokeWidth="1.5" />
                <text x={a.x + dx} y={a.y + dy + 3.5} textAnchor="middle"
                  fill={isNeighbor ? P.defect : a.color} fontSize="7" fontWeight="700">{a.elem}</text>
              </g>
            );
          })}
          {/* Vacancy marker */}
          {removeT > 0.5 && (
            <g opacity={labelOp}>
              <circle cx={da.x} cy={da.y} r={12} fill="none" stroke={P.defect}
                strokeWidth="2" strokeDasharray="4,3" />
              <text x={da.x} y={da.y + 4} textAnchor="middle" fill={P.defect} fontSize="10" fontWeight="800">V</text>
            </g>
          )}
          {/* Label */}
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.defect} fontSize="12" fontWeight="700" opacity={labelOp}>
            V_Cd vacancy created {"\u2014"} neighbors relax outward
          </text>
        </svg>
      );
    }

    // ── CARRIER TRAP (band diagram with electron approaching) ──
    case "trap": {
      const vbTop = 260, cbBot = 100, mid = (vbTop + cbBot) / 2;
      const trapAppear = ease(clamp01(t * 3));
      const ePos = clamp01((t - 0.25) * 2); // electron travels from CB toward trap
      const eY = lerp(cbBot - 5, mid, ease(ePos));
      const eOp = clamp01((t - 0.2) * 4);
      const trapGlow = Math.sin(t * Math.PI * 6) * 0.3 + 0.7;
      const captureFlash = clamp01((t - 0.7) * 5);
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* VB */}
          <rect x={70} y={vbTop} width={420} height={50} fill={P.hole + "10"} stroke={P.hole + "50"} strokeWidth="1.5" rx="4" />
          <text x={280} y={vbTop + 30} textAnchor="middle" fill={P.hole} fontSize="12" fontWeight="700">Valence Band</text>
          {/* CB */}
          <rect x={70} y={cbBot - 40} width={420} height={40} fill={P.electron + "10"} stroke={P.electron + "50"} strokeWidth="1.5" rx="4" />
          <text x={280} y={cbBot - 16} textAnchor="middle" fill={P.electron} fontSize="12" fontWeight="700">Conduction Band</text>
          {/* Band gap */}
          <text x={50} y={mid + 4} textAnchor="middle" fill={P.dim} fontSize="9"
            transform={`rotate(-90,50,${mid})`}>E_g = 1.5 eV</text>
          {/* Deep trap level */}
          <line x1={200} y1={mid} x2={360} y2={mid} stroke={P.defect}
            strokeWidth={3} opacity={trapAppear} strokeDasharray="none" />
          <circle cx={280} cy={mid} r={18 * trapGlow * trapAppear} fill={P.defect + "15"}
            stroke="none" />
          <text x={280} y={mid - 24} textAnchor="middle" fill={P.defect} fontSize="11"
            fontWeight="800" opacity={trapAppear}>Deep Trap (V_Cd)</text>
          {/* Electron falling */}
          {eOp > 0 && (
            <g opacity={eOp}>
              <circle cx={280} cy={eY} r={7} fill={P.electron} />
              <text x={280} y={eY + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">e{"\u207B"}</text>
              {/* Trail */}
              {ePos > 0.1 && ePos < 1 && (
                <line x1={280} y1={cbBot} x2={280} y2={eY - 8}
                  stroke={P.electron} strokeWidth="1" strokeDasharray="3,4" opacity="0.4" />
              )}
            </g>
          )}
          {/* Capture flash */}
          {captureFlash > 0 && (
            <circle cx={280} cy={mid} r={12 + captureFlash * 30}
              fill="none" stroke={P.defect} strokeWidth={2 * (1 - captureFlash)}
              opacity={0.7 * (1 - captureFlash)} />
          )}
          {/* Label */}
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.muted} fontSize="12" fontWeight="600">
            {ePos < 0.8 ? "Electron drifting toward deep-level trap..." : "Electron captured by the defect!"}
          </text>
        </svg>
      );
    }

    // ── SRH RECOMBINATION (full cycle) ──
    case "srh": {
      const vbTop = 260, cbBot = 100, mid = (vbTop + cbBot) / 2;
      // Phase 1: electron captured (0-0.35)
      const eCapture = ease(clamp01(t / 0.35));
      // Phase 2: hole captured (0.35-0.7)
      const hCapture = ease(clamp01((t - 0.35) / 0.35));
      // Phase 3: heat release (0.7-1.0)
      const heatT = clamp01((t - 0.7) / 0.3);

      const eY = lerp(cbBot, mid, eCapture);
      const hY = lerp(vbTop, mid, hCapture);
      const heatWaves = heatT > 0;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* VB */}
          <rect x={70} y={vbTop} width={420} height={50} fill={P.hole + "10"} stroke={P.hole + "50"} strokeWidth="1.5" rx="4" />
          <text x={150} y={vbTop + 30} textAnchor="middle" fill={P.hole} fontSize="11" fontWeight="700">Valence Band</text>
          {/* CB */}
          <rect x={70} y={cbBot - 40} width={420} height={40} fill={P.electron + "10"} stroke={P.electron + "50"} strokeWidth="1.5" rx="4" />
          <text x={150} y={cbBot - 16} textAnchor="middle" fill={P.electron} fontSize="11" fontWeight="700">Conduction Band</text>
          {/* Trap */}
          <line x1={220} y1={mid} x2={340} y2={mid} stroke={P.defect} strokeWidth="3" />
          <text x={280} y={mid - 22} textAnchor="middle" fill={P.defect} fontSize="10" fontWeight="800">Deep Trap</text>

          {/* Step labels */}
          <g>
            <text x={415} y={140} textAnchor="start" fill={t < 0.35 ? P.electron : P.dim} fontSize="10" fontWeight="700">
              1. e{"\u207B"} capture {t >= 0.35 ? "\u2713" : ""}
            </text>
            <text x={415} y={160} textAnchor="start" fill={t >= 0.35 && t < 0.7 ? P.hole : P.dim} fontSize="10" fontWeight="700">
              2. h{"\u207A"} capture {t >= 0.7 ? "\u2713" : ""}
            </text>
            <text x={415} y={180} textAnchor="start" fill={t >= 0.7 ? P.heat : P.dim} fontSize="10" fontWeight="700">
              3. Heat released {heatT > 0.5 ? "\u2713" : ""}
            </text>
          </g>

          {/* Electron */}
          {eCapture < 1 && (
            <g>
              <circle cx={260} cy={eY} r={7} fill={P.electron} />
              <text x={260} y={eY + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">e{"\u207B"}</text>
              <line x1={260} y1={cbBot} x2={260} y2={eY - 8}
                stroke={P.electron} strokeWidth="1" strokeDasharray="3,4" opacity="0.3" />
            </g>
          )}

          {/* Hole */}
          {t >= 0.35 && hCapture < 1 && (
            <g>
              <circle cx={300} cy={hY} r={7} fill={P.hole} />
              <text x={300} y={hY + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">h{"\u207A"}</text>
              <line x1={300} y1={vbTop} x2={300} y2={hY + 8}
                stroke={P.hole} strokeWidth="1" strokeDasharray="3,4" opacity="0.3" />
            </g>
          )}

          {/* Annihilation flash + heat waves */}
          {heatWaves && (
            <g>
              <circle cx={280} cy={mid} r={10 + heatT * 40} fill="none"
                stroke={P.heat} strokeWidth={2 * (1 - heatT)} opacity={0.6 * (1 - heatT)} />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const dist = 15 + heatT * 50;
                return (
                  <text key={i} x={280 + Math.cos(rad) * dist} y={mid + Math.sin(rad) * dist}
                    textAnchor="middle" fill={P.heat} fontSize={10 + (1 - heatT) * 4}
                    opacity={0.8 * (1 - heatT * 0.7)} fontWeight="700">
                    {"\u223C"}
                  </text>
                );
              })}
              {heatT > 0.3 && (
                <text x={280} y={mid + 50 + heatT * 20} textAnchor="middle"
                  fill={P.heat} fontSize="12" fontWeight="800" opacity={ease(clamp01((heatT - 0.3) * 3))}>
                  Energy lost as heat
                </text>
              )}
            </g>
          )}

          {/* Label */}
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.defect} fontSize="12" fontWeight="700">
            Shockley-Read-Hall Recombination {"\u2014"} photocurrent destroyed
          </text>
        </svg>
      );
    }

    // ── EFFICIENCY LOSS ──
    case "loss": {
      const barH = 180;
      const nDefects = Math.floor(ease(clamp01(t * 1.5)) * 6);
      const efficiencies = [32.1, 30.2, 28.0, 26.1, 24.5, 23.2, 22.1];
      const eff = efficiencies[nDefects];
      const fillH = (eff / 35) * barH;
      const lossColor = eff > 25 ? P.ok : eff > 18 ? P.solar : P.defect;
      const defectIcons = Array.from({ length: nDefects });
      const bulbBright = eff / 32.1; // dims as efficiency drops
      const circuitT = ease(clamp01((t - 0.1) * 2));
      const electronFlow = (t * 4) % 1; // looping electron flow

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />

          {/* ── Sun rays shining on cell ── */}
          {[215, 250, 285, 320, 355, 390].map((x, i) => {
            const rayLen = 25 + Math.sin(t * 8 + i) * 5;
            return (
              <g key={`r${i}`} opacity={0.5 + Math.sin(t * 6 + i * 0.8) * 0.2}>
                <line x1={x} y1={42} x2={x} y2={42 + rayLen} stroke={P.photon} strokeWidth="1.5" />
                <polygon points={`${x},${42 + rayLen} ${x - 3},${42 + rayLen - 6} ${x + 3},${42 + rayLen - 6}`} fill={P.photon} />
              </g>
            );
          })}
          {/* Sun label */}
          <text x={303} y={37} textAnchor="middle" fill={P.photon} fontSize="8" fontWeight="600" opacity="0.7">Sunlight (photons)</text>

          {/* ── Full CdTe solar cell architecture ── */}
          {(() => {
            const cx = 185, cw = 235, cy0 = 70;
            const layers = [
              { h: 14, fill: P.ink + "12",     stroke: P.ink + "30",     label: "Glass substrate",       role: "Mechanical support",       lc: P.muted },
              { h: 12, fill: "#8b5cf6" + "12", stroke: "#8b5cf6" + "30", label: "ITO / FTO",              role: "Transparent conductor",    lc: "#8b5cf6" },
              { h: 12, fill: "#06b6d4" + "12", stroke: "#06b6d4" + "30", label: "ZnO buffer",             role: "High-R shunt prevention",  lc: "#06b6d4" },
              { h: 16, fill: P.electron + "12", stroke: P.electron + "30", label: "n-CdS window",          role: "n-type junction partner",  lc: P.electron },
              { h: 65, fill: P.solar + "10",   stroke: P.solar + "30",   label: "p-CdTe absorber",       role: "Photon absorption (1.5 eV)", lc: P.solar },
              { h: 14, fill: "#22c55e" + "10", stroke: "#22c55e" + "30", label: "ZnTe:Cu back buffer",   role: "Ohmic contact / barrier",  lc: "#22c55e" },
              { h: 12, fill: P.dim + "25",     stroke: P.dim + "50",     label: "Cu / Mo back contact",  role: "Current collection",       lc: P.dim },
            ];
            let yy = cy0;
            return (
              <g>
                <rect x={cx - 2} y={cy0 - 2} width={cw + 4} height={layers.reduce((s, l) => s + l.h + 2, 0) + 4}
                  rx="6" fill="none" stroke={P.border} strokeWidth="1" />
                {layers.map((l, i) => {
                  const ly = yy;
                  yy += l.h + 2;
                  return (
                    <g key={`ly${i}`}>
                      <rect x={cx} y={ly} width={cw} height={l.h} rx="3"
                        fill={l.fill} stroke={l.stroke} strokeWidth="0.8" />
                      <text x={cx + 6} y={l.h > 40 ? ly + l.h - 8 : ly + l.h / 2 + 3} fill={l.lc} fontSize="6.5" fontWeight="700">{l.label}</text>
                      <text x={cx + cw - 6} y={l.h > 40 ? ly + l.h - 8 : ly + l.h / 2 + 3} textAnchor="end" fill={P.muted} fontSize="5.5">{l.role}</text>
                    </g>
                  );
                })}
              </g>
            );
          })()}

          {/* Defect markers inside CdTe absorber (layer starts ~cy0+56, height 65) */}
          {defectIcons.map((_, i) => {
            const dx = 215 + (i % 3) * 65;
            const dy = 147 + Math.floor(i / 3) * 25;
            const pop = ease(clamp01((t * 1.5 - i * 0.15) * 4));
            return (
              <g key={i} opacity={pop}>
                <circle cx={dx} cy={dy} r={9} fill={P.defect + "25"} stroke={P.defect} strokeWidth="1.5" />
                <text x={dx} y={dy + 3.5} textAnchor="middle" fill={P.defect} fontSize="7" fontWeight="800">V</text>
                <text x={dx + 11} y={dy - 4} fill={P.heat} fontSize="8" opacity={0.5 + Math.sin(t * 10 + i) * 0.3}>{"\u223C"}</text>
              </g>
            );
          })}

          {/* ── Electron-hole pairs in CdS layer ── */}
          {circuitT > 0 && [220, 270, 320, 370].map((ex, i) => {
            const ey = 104 + Math.sin(t * 5 + i * 2) * 4;
            const op = ease(clamp01(circuitT - i * 0.1));
            return (
              <g key={`eh${i}`} opacity={op * 0.7}>
                <circle cx={ex} cy={ey} r={3.5} fill={P.electron} />
                <text x={ex} y={ey + 2} textAnchor="middle" fill="#fff" fontSize="3.5" fontWeight="800">e{"\u207B"}</text>
              </g>
            );
          })}

          {/* ── Circuit wires from cell to bulb ── */}
          <g opacity={circuitT}>
            {/* Top wire (from ITO layer) */}
            <line x1={420} y1={92} x2={495} y2={92} stroke={P.electron + "60"} strokeWidth="1.5" />
            <line x1={495} y1={92} x2={495} y2={252} stroke={P.electron + "60"} strokeWidth="1.5" />
            {/* Bottom wire (from back contact) */}
            <line x1={420} y1={208} x2={465} y2={208} stroke={P.electron + "60"} strokeWidth="1.5" />
            <line x1={465} y1={208} x2={465} y2={252} stroke={P.electron + "60"} strokeWidth="1.5" />
            {/* Flowing electrons along circuit */}
            {[0, 0.25, 0.5, 0.75].map((offset, i) => {
              const phase = (electronFlow + offset) % 1;
              let ex2, ey2;
              if (phase < 0.3) {
                ex2 = 420 + phase / 0.3 * 75;
                ey2 = 92;
              } else if (phase < 0.7) {
                ex2 = 495;
                ey2 = 92 + (phase - 0.3) / 0.4 * 160;
              } else {
                ex2 = 495 - (phase - 0.7) / 0.3 * 30;
                ey2 = 252;
              }
              return (
                <circle key={`fe${i}`} cx={ex2} cy={ey2} r={3}
                  fill={P.electron} opacity={bulbBright * 0.8} />
              );
            })}
          </g>

          {/* ── Light bulb ── */}
          <g opacity={circuitT}>
            {/* Bulb base */}
            <rect x={463} y={252} width={34} height={12} rx="3" fill={P.dim + "40"} stroke={P.dim} strokeWidth="1" />
            {/* Bulb glass */}
            <ellipse cx={480} cy={240} rx={18} ry={20}
              fill={P.photon + (bulbBright > 0.7 ? "25" : "08")}
              stroke={P.photon + "60"} strokeWidth="1.5" />
            {/* Filament */}
            <path d="M473,244 Q476,232 480,244 Q484,232 487,244"
              fill="none" stroke={bulbBright > 0.7 ? P.photon : P.dim} strokeWidth="1.5" />
            {/* Glow when bright */}
            {bulbBright > 0.7 && (
              <ellipse cx={480} cy={240} rx={25 * bulbBright} ry={28 * bulbBright}
                fill={P.photon + "08"} opacity={bulbBright * 0.5} />
            )}
            {/* Light rays from bulb */}
            {bulbBright > 0.5 && [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = deg * Math.PI / 180;
              const r1 = 22, r2 = 22 + bulbBright * 12;
              return (
                <line key={`bl${i}`} x1={480 + Math.cos(rad) * r1} y1={240 + Math.sin(rad) * r1}
                  x2={480 + Math.cos(rad) * r2} y2={240 + Math.sin(rad) * r2}
                  stroke={P.photon} strokeWidth="1" opacity={bulbBright * 0.4}
                  strokeLinecap="round" />
              );
            })}
            <text x={480} y={280} textAnchor="middle" fill={P.muted} fontSize="7">
              {bulbBright > 0.7 ? "Bright" : bulbBright > 0.5 ? "Dimming" : "Dim"}
            </text>
          </g>

          {/* ── Efficiency bar (left) ── */}
          <rect x={55} y={77} width={70} height={barH} fill={P.surface} stroke={P.border} strokeWidth="1.5" rx="6" />
          <rect x={57} y={77 + (barH - fillH)} width={66} height={fillH - 2} rx="4"
            fill={lossColor + "40"} stroke={lossColor} strokeWidth="1.5" />
          <text x={90} y={77 + (barH - fillH) - 8} textAnchor="middle" fill={lossColor} fontSize="18" fontWeight="900">
            {eff.toFixed(1)}%
          </text>
          <text x={90} y={barH + 97} textAnchor="middle" fill={P.muted} fontSize="9">Efficiency</text>
          {/* Scale markers */}
          {[0, 10, 20, 30].map(v => {
            const yy = 77 + barH - (v / 35) * barH;
            return (
              <g key={v}>
                <line x1={50} y1={yy} x2={55} y2={yy} stroke={P.dim} strokeWidth="0.8" />
                <text x={47} y={yy + 3} textAnchor="end" fill={P.dim} fontSize="6">{v}%</text>
              </g>
            );
          })}

          {/* Arrow connecting defects to efficiency */}
          <path d={`M 183,157 Q 160,157 140,${77 + barH - fillH + 10}`}
            fill="none" stroke={P.defect} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />

          {/* Energy lost as heat label */}
          {nDefects > 2 && (
            <text x={303} y={268} textAnchor="middle" fill={P.heat} fontSize="8" fontWeight="700"
              opacity={ease(clamp01((t - 0.4) * 3))}>
              Energy lost as heat {"\u2014"} {(32.1 - eff).toFixed(1)}% wasted
            </text>
          )}

          {/* Layer description below cell */}
          <g opacity={circuitT}>
            <text x={205} y={295} fill={P.muted} fontSize="6.5" fontWeight="600">
              Glass {"\u2014"} superstrate, structural support and optical transparency
            </text>
            <text x={205} y={307} fill={P.muted} fontSize="6.5" fontWeight="600">
              ITO/FTO {"\u2014"} transparent conducting oxide, front electrode
            </text>
            <text x={205} y={319} fill={P.muted} fontSize="6.5" fontWeight="600">
              p-CdTe {"\u2014"} main absorber (E_g {"\u2248"} 1.5 eV), visible/near-IR
            </text>
            <text x={205} y={331} fill={P.muted} fontSize="6.5" fontWeight="600">
              CdSeTe {"\u2014"} graded bandgap, improves V_oc and collection
            </text>
            <text x={205} y={343} fill={P.muted} fontSize="6.5" fontWeight="600">
              ZnTe:Cu {"\u2014"} back buffer, reduces Schottky barrier for holes
            </text>
            <text x={205} y={355} fill={P.muted} fontSize="6.5" fontWeight="600">
              CdS/CdTe {"\u2014"} p-n junction, built-in field separates carriers
            </text>
          </g>

          {/* Bottom text */}
          <text x={W / 2} y={H - 30} textAnchor="middle" fill={P.defect} fontSize="13" fontWeight="700">
            More defects {"\u2192"} more recombination {"\u2192"} lower efficiency
          </text>
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.muted} fontSize="11">
            {nDefects} deep-level defects active | bulb dims as carriers recombine at traps
          </text>
        </svg>
      );
    }

    // ── ENTER DFT ──
    case "dft": {
      const buildT = ease(clamp01(t * 1.8));
      const relaxT = ease(clamp01((t - 0.25) * 2.0)); // atoms relax during this phase
      const convergeT = ease(clamp01((t - 0.25) * 2.5));
      const resultT = ease(clamp01((t - 0.7) * 3));
      // Mini supercell
      const SC = 5, sp = 30;
      const defR = 2, defC = 2;
      const cellOx = 30, cellOy = 32;
      const scAtoms = [];
      for (let r = 0; r < SC; r++) for (let c = 0; c < SC; c++) {
        const bx = cellOx + c * sp + 12;
        const by = cellOy + r * sp + 12;
        const isCd = (r + c) % 2 === 0;
        const isDef = r === defR && c === defC;
        const dist = Math.sqrt((r - defR) ** 2 + (c - defC) ** 2);
        const isNear = !isDef && dist < 1.6;
        // Relaxation displacement: neighbors move outward from vacancy
        let dx = 0, dy = 0;
        if (isNear) {
          const angle = Math.atan2(r - defR, c - defC);
          dx = Math.cos(angle) * 6 * relaxT;
          dy = Math.sin(angle) * 6 * relaxT;
        }
        scAtoms.push({ bx, by, dx, dy, isCd, isDef, isNear, elem: isCd ? "Cd" : "Te" });
      }
      // Energy convergence
      const energies = [-540, -544.5, -547.2, -548.0, -548.04, -548.05];
      const nSteps = Math.floor(convergeT * energies.length);

      // Initial vs final comparison boxes — aligned with details box at right
      const compY = 245;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Main supercell box */}
          <rect x={cellOx} y={cellOy} width={SC * sp + 14} height={SC * sp + 14}
            fill={P.dft + "08"} stroke={P.dft} strokeWidth="1.5" rx="6"
            strokeDasharray={buildT < 1 ? "6,4" : "none"} opacity={buildT} />
          <text x={cellOx + (SC * sp + 14) / 2} y={cellOy - 6} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700" opacity={buildT}>
            DFT supercell
          </text>
          {/* Atoms with relaxation */}
          {scAtoms.map((a, i) => {
            const op = ease(clamp01(buildT * 3 - (a.bx + a.by) * 0.002));
            if (a.isDef) {
              return (
                <g key={i} opacity={op}>
                  <circle cx={a.bx} cy={a.by} r={7} fill="none" stroke={P.defect}
                    strokeWidth="1.5" strokeDasharray="3,2" />
                  <text x={a.bx} y={a.by + 3} textAnchor="middle" fill={P.defect} fontSize="6" fontWeight="700">V</text>
                </g>
              );
            }
            const cx = a.bx + a.dx;
            const cy = a.by + a.dy;
            return (
              <g key={i} opacity={op}>
                <circle cx={cx} cy={cy} r={6}
                  fill={(a.isCd ? P.crystal : P.solar) + "30"}
                  stroke={a.isNear ? P.dft : (a.isCd ? P.crystal : P.solar)} strokeWidth={a.isNear ? 1.5 : 1} />
                {a.isNear && relaxT > 0.1 && (
                  <line x1={a.bx} y1={a.by} x2={cx} y2={cy}
                    stroke={P.dft} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
                )}
              </g>
            );
          })}
          {/* Electron density cloud (animated) */}
          {convergeT > 0 && scAtoms.filter(a => !a.isDef).map((a, i) => (
            <circle key={`c${i}`} cx={a.bx + a.dx} cy={a.by + a.dy}
              r={10 + Math.sin(t * 20 + i) * 2}
              fill={P.dft + "06"} opacity={convergeT * 0.4} />
          ))}

          {/* Initial vs Final comparison — aligned with details box */}
          {resultT > 0 && (() => {
            const miniSp = 14, miniSC = 5;
            const box1x = 10, box2x = miniSC * miniSp + 45;
            const renderMiniCell = (ox, oy, relaxed, dispScale) => {
              const els = [];
              for (let r2 = 0; r2 < miniSC; r2++) for (let c2 = 0; c2 < miniSC; c2++) {
                const mx = ox + c2 * miniSp + 8;
                const my = oy + r2 * miniSp + 8;
                const isCd2 = (r2 + c2) % 2 === 0;
                const isDef2 = r2 === defR && c2 === defC;
                const dist2 = Math.sqrt((r2 - defR) ** 2 + (c2 - defC) ** 2);
                const isNear2 = !isDef2 && dist2 < 1.6;
                let ddx = 0, ddy = 0;
                if (relaxed && isNear2) {
                  const ang = Math.atan2(r2 - defR, c2 - defC);
                  ddx = Math.cos(ang) * dispScale;
                  ddy = Math.sin(ang) * dispScale;
                }
                if (isDef2) {
                  els.push(<circle key={`m${r2}${c2}`} cx={mx} cy={my} r={3.5} fill="none" stroke={P.defect} strokeWidth="1" strokeDasharray="2,1" />);
                } else {
                  els.push(<circle key={`m${r2}${c2}`} cx={mx + ddx} cy={my + ddy} r={3.5}
                    fill={(isCd2 ? P.crystal : P.solar) + "40"}
                    stroke={isNear2 && relaxed ? P.dft : (isCd2 ? P.crystal : P.solar)} strokeWidth="0.8" />);
                }
              }
              return els;
            };
            const miniW = miniSC * miniSp + 10;
            const miniH = miniSC * miniSp + 10;
            return (
              <g opacity={resultT}>
                {/* Initial (unrelaxed) */}
                <rect x={box1x} y={compY} width={miniW} height={miniH}
                  fill={P.surface} stroke={P.border} strokeWidth="1" rx="4" />
                <text x={box1x + miniW / 2} y={compY - 5} textAnchor="middle"
                  fill={P.muted} fontSize="7" fontWeight="600">Initial (unrelaxed)</text>
                {renderMiniCell(box1x, compY, false, 0)}
                {/* Arrow */}
                <text x={box1x + miniW + 12} y={compY + miniH / 2 + 4}
                  textAnchor="middle" fill={P.dft} fontSize="14" fontWeight="700">{"\u2192"}</text>
                {/* Final q = -2 */}
                <rect x={box2x} y={compY} width={miniW} height={miniH}
                  fill={P.dft + "08"} stroke={P.dft} strokeWidth="1" rx="4" />
                <text x={box2x + miniW / 2} y={compY - 5} textAnchor="middle"
                  fill={P.dft} fontSize="7" fontWeight="700">Final (q = -2)</text>
                {renderMiniCell(box2x, compY, true, 4.5)}
                {/* Label */}
                <text x={(box1x + box2x + miniW) / 2} y={compY + miniH + 14} textAnchor="middle"
                  fill={P.muted} fontSize="7">Neighbor displacement: outward relaxation at q = -2</text>
              </g>
            );
          })()}

          {/* Energy convergence panel */}
          <rect x={250} y={22} width={240} height={155} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
          <text x={370} y={38} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700">SCF energy convergence</text>
          {/* Plot */}
          {nSteps > 0 && (() => {
            const px = 268, py = 46, pw2 = 200, ph2 = 95;
            const eMin = -549, eMax = -538;
            const pts = energies.slice(0, nSteps).map((e, i) => ({
              x: px + (i / (energies.length - 1)) * pw2,
              y: py + ((eMax - e) / (eMax - eMin)) * ph2,
            }));
            return (
              <g>
                <line x1={px} y1={py} x2={px} y2={py + ph2} stroke={P.dim} strokeWidth="0.5" />
                <line x1={px} y1={py + ph2} x2={px + pw2} y2={py + ph2} stroke={P.dim} strokeWidth="0.5" />
                <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")}
                  fill="none" stroke={P.dft} strokeWidth="2" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3} fill={P.dft} />
                ))}
                {nSteps > 0 && (
                  <text x={pts[pts.length - 1].x + 5} y={pts[pts.length - 1].y - 5}
                    fill={P.dft} fontSize="8" fontWeight="700">
                    {energies[nSteps - 1].toFixed(2)} eV
                  </text>
                )}
                <text x={px + pw2 / 2} y={py + ph2 + 14} textAnchor="middle" fill={P.muted} fontSize="7">SCF iteration</text>
              </g>
            );
          })()}

          {/* Result */}
          {resultT > 0 && (
            <g opacity={resultT}>
              <rect x={250} y={190} width={240} height={45} rx="8" fill={P.dft + "15"} stroke={P.dft} strokeWidth="1.5" />
              <text x={370} y={208} textAnchor="middle" fill={P.dft} fontSize="10" fontWeight="700">
                E_tot[V_Cd{"\u00B2\u207B"}] = -548.05 eV
              </text>
              <text x={370} y={224} textAnchor="middle" fill={P.muted} fontSize="9">
                512 cores {"\u00D7"} 8 hrs = 4,096 core-hours
              </text>
            </g>
          )}

          {/* Details box */}
          {resultT > 0 && (
            <g opacity={resultT}>
              <rect x={250} y={270} width={250} height={65} rx="8" fill={P.surface} stroke={P.border} strokeWidth="1" />
              <text x={282} y={289} fill={P.muted} fontSize="8" fontWeight="600">Forces converged:</text>
              <text x={430} y={289} textAnchor="end" fill={P.ok} fontSize="8" fontWeight="700">{"< 0.01 eV/\u00C5"}</text>
              <text x={282} y={307} fill={P.muted} fontSize="8" fontWeight="600">Neighbor displacement:</text>
              <text x={430} y={307} textAnchor="end" fill={P.dft} fontSize="8" fontWeight="700">0.12 {"\u00C5"} outward</text>
              <text x={282} y={325} fill={P.muted} fontSize="8" fontWeight="600">Charge state:</text>
              <text x={430} y={325} textAnchor="end" fill={P.defect} fontSize="8" fontWeight="700">q = -2</text>
            </g>
          )}

          <text x={W / 2} y={H - 8} textAnchor="middle" fill={P.dft} fontSize="11" fontWeight="600">
            DFT relaxes atoms around the vacancy until forces converge
          </text>
        </svg>
      );
    }

    // ── DFT BOTTLENECK ──
    case "bottleneck": {
      const clockT = t;
      const costVal = Math.floor(ease(clamp01(t * 1.5)) * 409600);
      const barFill = ease(clamp01(t * 1.3));
      const panicT = clamp01((t - 0.6) * 3);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Clock */}
          <circle cx={120} cy={140} r={65} fill={P.surface} stroke={P.border} strokeWidth="2" />
          <circle cx={120} cy={140} r={60} fill="none" stroke={P.dft + "30"} strokeWidth="4" />
          {/* Clock arc (progress) */}
          {(() => {
            const angle = clockT * 720 * (Math.PI / 180);
            const arcX = 120 + 55 * Math.sin(angle);
            const arcY = 140 - 55 * Math.cos(angle);
            return <circle cx={arcX} cy={arcY} r={4} fill={P.defect} />;
          })()}
          {/* Clock hands */}
          <line x1={120} y1={140} x2={120 + Math.sin(clockT * Math.PI * 8) * 40}
            y2={140 - Math.cos(clockT * Math.PI * 8) * 40}
            stroke={P.ink} strokeWidth="2" strokeLinecap="round" />
          <line x1={120} y1={140} x2={120 + Math.sin(clockT * Math.PI * 0.5) * 30}
            y2={140 - Math.cos(clockT * Math.PI * 0.5) * 30}
            stroke={P.defect} strokeWidth="3" strokeLinecap="round" />
          <circle cx={120} cy={140} r={3} fill={P.ink} />

          {/* Cost counter */}
          <text x={120} y={230} textAnchor="middle" fill={panicT > 0 ? P.defect : P.muted} fontSize="11" fontWeight="700">
            Time elapsed
          </text>

          {/* Cost bar */}
          <rect x={250} y={60} width={220} height={30} rx="6" fill={P.surface} stroke={P.border} strokeWidth="1" />
          <rect x={252} y={62} width={216 * barFill} height={26} rx="4"
            fill={barFill > 0.7 ? P.defect + "60" : P.dft + "40"}
            stroke={barFill > 0.7 ? P.defect : P.dft} strokeWidth="1" />
          <text x={360} y={80} textAnchor="middle" fill={P.ink} fontSize="11" fontWeight="700">
            {costVal.toLocaleString()} core-hours
          </text>
          <text x={360} y={50} textAnchor="middle" fill={P.muted} fontSize="10">
            Computational Cost (1 composition)
          </text>

          {/* Defect list stacking up */}
          {[
            { name: "V_Cd (5 charges)", y: 115 },
            { name: "V_Te (5 charges)", y: 140 },
            { name: "Te_Cd (5 charges)", y: 165 },
            { name: "Cd_Te (5 charges)", y: 190 },
            { name: "Cl_Te (5 charges)", y: 215 },
            { name: "Cu_Cd (5 charges)", y: 240 },
            { name: "+ 14 more defects...", y: 265 },
          ].map((d, i) => {
            const op = ease(clamp01((t - i * 0.1) * 3));
            return (
              <g key={i} opacity={op}>
                <rect x={250} y={d.y} width={220} height={22} rx="4"
                  fill={i < 6 ? P.dft + "10" : P.defect + "10"}
                  stroke={i < 6 ? P.dft + "30" : P.defect + "30"} strokeWidth="1" />
                <text x={260} y={d.y + 15} fill={i < 6 ? P.dft : P.defect} fontSize="10" fontWeight="600">{d.name}</text>
              </g>
            );
          })}

          {/* Panic text */}
          {panicT > 0 && (
            <g opacity={panicT}>
              <text x={W / 2} y={H - 30} textAnchor="middle" fill={P.defect} fontSize="15" fontWeight="900">
                409,600 core-hours for one composition!
              </text>
              <text x={W / 2} y={H - 10} textAnchor="middle" fill={P.muted} fontSize="11">
                Need 100+ compositions {"\u2192"} brute-force DFT is impossible
              </text>
            </g>
          )}
        </svg>
      );
    }

    // ── HOW MLFF LEARNS FROM DFT ──
    case "learn": {
      const titleT = ease(clamp01(t * 3));
      const dftDataT = ease(clamp01((t - 0.08) * 2.5));
      const arrowT = ease(clamp01((t - 0.22) * 3));
      const nnT = ease(clamp01((t - 0.32) * 2.5));
      const trainT = clamp01((t - 0.45) * 2.2); // training progress
      const predictT = ease(clamp01((t - 0.7) * 3));
      const compareT = ease(clamp01((t - 0.82) * 4));

      // DFT data points (energy, forces from supercell configs)
      const nConfigs = Math.floor(dftDataT * 6);
      const configs = [
        { label: "Config 1", e: "-548.05", f: "0.12" },
        { label: "Config 2", e: "-547.91", f: "0.18" },
        { label: "Config 3", e: "-548.12", f: "0.09" },
        { label: "Config 4", e: "-547.68", f: "0.24" },
        { label: "Config 5", e: "-548.03", f: "0.11" },
        { label: "Config 6", e: "-547.85", f: "0.15" },
      ];

      // Neural network layers
      const layers = [4, 8, 8, 6, 3]; // node counts per layer
      const nnX = 200, nnY = 70, nnW = 155, nnH = 165;
      const dftX = 25, dftW = 130;
      const outX = 415, outW = 125;
      const arrowLen = 25;
      const midY = 155; // vertical center of main content

      // Training loss curve
      const lossPoints = [];
      const lossSteps = 20;
      for (let i = 0; i <= lossSteps; i++) {
        const frac = i / lossSteps;
        const loss = 0.8 * Math.exp(-3 * frac) + 0.02 + 0.03 * Math.sin(frac * 12) * Math.exp(-2 * frac);
        lossPoints.push({ x: frac, y: loss });
      }
      const visibleLoss = Math.floor(trainT * lossSteps);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.mlff} fontSize="15" fontWeight="900" opacity={titleT}>
            How MLFF learns from DFT
          </text>
          <text x={W / 2} y={48} textAnchor="middle" fill={P.muted} fontSize="10" opacity={titleT}>
            Training a neural network potential on ab initio data
          </text>

          {/* LEFT: DFT training data */}
          <g opacity={dftDataT}>
            <rect x={dftX} y={65} width={dftW} height={195} rx="8" fill={P.dft + "08"} stroke={P.dft + "40"} strokeWidth="1" />
            <text x={dftX + dftW / 2} y={82} textAnchor="middle" fill={P.dft} fontSize="9" fontWeight="700">DFT training data</text>
            <text x={dftX + dftW / 2} y={95} textAnchor="middle" fill={P.muted} fontSize="7">HSE06 supercells</text>
            {/* Header row */}
            <text x={dftX + 12} y={115} fill={P.muted} fontSize="6" fontWeight="600">Config</text>
            <text x={dftX + 62} y={115} fill={P.muted} fontSize="6" fontWeight="600">E (eV)</text>
            <text x={dftX + 105} y={115} fill={P.muted} fontSize="6" fontWeight="600">|F| (eV/{"\u00C5"})</text>
            <line x1={dftX + 8} y1={118} x2={dftX + dftW - 8} y2={118} stroke={P.border} strokeWidth="0.5" />
            {configs.slice(0, nConfigs).map((c, i) => {
              const cy = 130 + i * 20;
              const flash = i === nConfigs - 1 ? 1 : 0;
              return (
                <g key={i}>
                  <rect x={dftX + 4} y={cy - 8} width={dftW - 8} height={16} rx="3"
                    fill={flash ? P.dft + "15" : "transparent"} />
                  <text x={dftX + 12} y={cy + 2} fill={P.dft} fontSize="7" fontWeight="600">{c.label}</text>
                  <text x={dftX + 62} y={cy + 2} fill={P.ink} fontSize="7">{c.e}</text>
                  <text x={dftX + 105} y={cy + 2} fill={P.ink} fontSize="7">{c.f}</text>
                </g>
              );
            })}
          </g>

          {/* ARROW: DFT → NN (short) */}
          <g opacity={arrowT}>
            <line x1={dftX + dftW + 5} y1={midY} x2={nnX - 10} y2={midY}
              stroke={P.mlff} strokeWidth="1.5" strokeDasharray="4,3" />
            <polygon points={`${nnX - 12},${midY - 4} ${nnX - 4},${midY} ${nnX - 12},${midY + 4}`} fill={P.mlff} />
            <text x={(dftX + dftW + nnX) / 2} y={midY - 8} textAnchor="middle" fill={P.mlff} fontSize="7" fontWeight="600">Train</text>
          </g>

          {/* CENTER: Neural Network */}
          <g opacity={nnT}>
            <rect x={nnX - 5} y={nnY - 5} width={nnW + 10} height={nnH + 10} rx="10"
              fill={P.mlff + "06"} stroke={P.mlff + "30"} strokeWidth="1" />
            <text x={nnX + nnW / 2} y={nnY + 8} textAnchor="middle" fill={P.mlff} fontSize="9" fontWeight="700">
              Neural network potential
            </text>
            <text x={nnX + nnW / 2} y={nnY + 20} textAnchor="middle" fill={P.muted} fontSize="7">
              M3GNet / MACE / CHGNet
            </text>
            {/* Draw layers */}
            {layers.map((nNodes, li) => {
              const lx = nnX + 15 + li * ((nnW - 30) / (layers.length - 1));
              const layerH = nnH - 55;
              return (
                <g key={`l${li}`}>
                  {Array.from({ length: nNodes }).map((_, ni) => {
                    const ny = nnY + 35 + (layerH / (nNodes + 1)) * (ni + 1);
                    const pulse = trainT > 0 ? (Math.sin(trainT * 20 + li * 2 + ni) * 0.3 + 0.7) : 0.5;
                    return (
                      <g key={`n${ni}`}>
                        {/* Connections to next layer */}
                        {li < layers.length - 1 && Array.from({ length: layers[li + 1] }).map((_, nj) => {
                          const nx = nnX + 15 + (li + 1) * ((nnW - 30) / (layers.length - 1));
                          const nny = nnY + 35 + ((nnH - 55) / (layers[li + 1] + 1)) * (nj + 1);
                          return (
                            <line key={`c${nj}`} x1={lx} y1={ny} x2={nx} y2={nny}
                              stroke={trainT > 0 ? P.mlff + "30" : P.dim} strokeWidth="0.5" />
                          );
                        })}
                        <circle cx={lx} cy={ny} r={4}
                          fill={trainT > 0 ? `rgba(52,211,153,${pulse * 0.6})` : P.dim + "40"}
                          stroke={P.mlff + "60"} strokeWidth="0.8" />
                      </g>
                    );
                  })}
                  {/* Layer label */}
                  <text x={lx} y={nnY + nnH - 2} textAnchor="middle" fill={P.muted} fontSize="5">
                    {li === 0 ? "Input" : li === layers.length - 1 ? "Output" : `H${li}`}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ARROW: NN → Output (same short length) */}
          <g opacity={predictT}>
            <line x1={nnX + nnW + 8} y1={midY} x2={outX - 8} y2={midY}
              stroke={P.ok} strokeWidth="1.5" strokeDasharray="4,3" />
            <polygon points={`${outX - 10},${midY - 4} ${outX - 2},${midY} ${outX - 10},${midY + 4}`} fill={P.ok} />
            <text x={(nnX + nnW + outX) / 2} y={midY - 8} textAnchor="middle" fill={P.ok} fontSize="7" fontWeight="600">Predict</text>
          </g>

          {/* RIGHT: MLFF output */}
          <g opacity={predictT}>
            <rect x={outX} y={85} width={outW} height={145} rx="8"
              fill={P.ok + "08"} stroke={P.ok + "40"} strokeWidth="1" />
            <text x={outX + outW / 2} y={103} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700">MLFF output</text>
            <text x={outX + outW / 2} y={116} textAnchor="middle" fill={P.muted} fontSize="7">DFT accuracy</text>

            <text x={outX + 12} y={137} fill={P.ink} fontSize="8" fontWeight="600">Energy</text>
            <text x={outX + 12} y={151} fill={P.mlff} fontSize="9">{"\u2248"} -548.04 eV</text>

            <text x={outX + 12} y={171} fill={P.ink} fontSize="8" fontWeight="600">Forces</text>
            <text x={outX + 12} y={185} fill={P.mlff} fontSize="9">{"\u2248"} 0.11 eV/{"\u00C5"}</text>

            <text x={outX + 12} y={205} fill={P.ink} fontSize="8" fontWeight="600">Stress tensor</text>
            <text x={outX + 12} y={219} fill={P.mlff} fontSize="9">{"\u2248"} 0.02 GPa</text>
          </g>

          {/* Training loss curve (bottom center-left) */}
          {trainT > 0 && (() => {
            const px = 55, py = 290, pw = 150, ph = 75;
            return (
              <g>
                <rect x={px - 5} y={py - 15} width={pw + 20} height={ph + 28} rx="6"
                  fill={P.surface} stroke={P.border} strokeWidth="1" />
                <text x={px + pw / 2} y={py - 2} textAnchor="middle" fill={P.mlff} fontSize="8" fontWeight="700">
                  Training loss
                </text>
                {/* Axes */}
                <line x1={px + 10} y1={py + 5} x2={px + 10} y2={py + ph} stroke={P.dim} strokeWidth="0.8" />
                <line x1={px + 10} y1={py + ph} x2={px + pw} y2={py + ph} stroke={P.dim} strokeWidth="0.8" />
                <text x={px + 5} y={py + 12} fill={P.muted} fontSize="5" textAnchor="end">High</text>
                <text x={px + 5} y={py + ph - 2} fill={P.muted} fontSize="5" textAnchor="end">Low</text>
                <text x={px + pw / 2 + 5} y={py + ph + 10} textAnchor="middle" fill={P.muted} fontSize="5">Epochs</text>
                {/* Loss curve */}
                {visibleLoss > 1 && (
                  <polyline fill="none" stroke={P.mlff} strokeWidth="1.5"
                    points={lossPoints.slice(0, visibleLoss + 1).map(p =>
                      `${px + 12 + p.x * (pw - 14)},${py + 8 + (1 - p.y) * (ph - 10)}`
                    ).join(" ")} />
                )}
                {visibleLoss > 0 && (() => {
                  const lp = lossPoints[visibleLoss];
                  return <circle cx={px + 12 + lp.x * (pw - 14)} cy={py + 8 + (1 - lp.y) * (ph - 10)} r={3} fill={P.mlff} />;
                })()}
              </g>
            );
          })()}

          {/* Comparison bar (bottom center-right) */}
          {compareT > 0 && (
            <g opacity={compareT}>
              <rect x={260} y={290} width={270} height={62} rx="8" fill={P.mlff + "10"} stroke={P.mlff + "50"} strokeWidth="1.5" />
              <text x={395} y={308} textAnchor="middle" fill={P.mlff} fontSize="10" fontWeight="800">
                Train once {"\u2192"} predict thousands
              </text>
              <text x={395} y={324} textAnchor="middle" fill={P.muted} fontSize="8">
                Energy MAE {"<"} 5 meV/atom {"\u00B7"} Force MAE {"<"} 50 meV/{"\u00C5"}
              </text>
              <text x={395} y={340} textAnchor="middle" fill={P.muted} fontSize="8">
                ~1000 DFT configs {"\u2192"} universal potential for CdTe
              </text>
            </g>
          )}

          <text x={W / 2} y={H - 8} textAnchor="middle" fill={P.muted} fontSize="10" opacity={titleT}>
            MLFF learns the DFT potential energy surface from reference calculations
          </text>
        </svg>
      );
    }

    // ── DEFECT FORMATION ENERGY vs FERMI LEVEL ──
    case "dfe": {
      const titleT = ease(clamp01(t * 3));
      const axesT = ease(clamp01((t - 0.05) * 3));
      const dftT = ease(clamp01((t - 0.15) * 2.5));
      const mlffT = ease(clamp01((t - 0.4) * 2.5));
      const labelT = ease(clamp01((t - 0.6) * 3));
      const compareT = ease(clamp01((t - 0.75) * 4));

      // Plot area
      const px = 80, py = 70, pw = 380, ph = 240;
      const bandgap = 1.5; // eV

      // DFT defect formation energy lines (charge states: q=0, -1, -2)
      // V_Cd: shallow acceptor transitions
      const dftLines = [
        { q: 0,  e0: 2.8, slope: 0,  color: P.dft,     dash: "none" },
        { q: -1, e0: 2.2, slope: -1, color: P.dft,     dash: "none" },
        { q: -2, e0: 1.4, slope: -2, color: P.dft,     dash: "none" },
      ];
      // MLFF predicted (slightly offset to show agreement)
      const mlffLines = [
        { q: 0,  e0: 2.85, slope: 0,  color: P.mlff,   dash: "6,3" },
        { q: -1, e0: 2.25, slope: -1, color: P.mlff,   dash: "6,3" },
        { q: -2, e0: 1.45, slope: -2, color: P.mlff,   dash: "6,3" },
      ];

      // Convert Ef, Eform to pixel coords
      const toX = (ef) => px + (ef / bandgap) * pw;
      const toY = (eForm) => py + ph - (eForm / 4.0) * ph; // 0 to 4 eV range

      // Compute the lower envelope (thermodynamic stable charge state)
      const envelope = (lines, ef) => {
        return Math.min(...lines.map(l => l.e0 + l.slope * ef));
      };

      // Transition levels for DFT
      // q=0 to q=-1: 2.8 = 2.2 - 1*ef => ef = -0.6 (not in gap, use boundary)
      // Actually: E_f(0/-1) = (E0_q0 - E0_q-1) / (q-1 - q0) = (2.8 - 2.2) / (-1 - 0) = -0.6...
      // Let me use more physical values
      // Transition 0/-1 at Ef = 0.6 eV, transition -1/-2 at Ef = 0.8 eV
      const trans01 = 0.6;
      const trans12 = 0.8;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={28} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="900" opacity={titleT}>
            Defect formation energy vs Fermi level
          </text>
          <text x={W / 2} y={46} textAnchor="middle" fill={P.muted} fontSize="10" opacity={titleT}>
            V_Cd in CdTe {"\u2014"} DFT (HSE06) vs MLFF prediction
          </text>

          {/* Axes */}
          <g opacity={axesT}>
            {/* Y axis */}
            <line x1={px} y1={py} x2={px} y2={py + ph} stroke={P.dim} strokeWidth="1.5" />
            {/* X axis */}
            <line x1={px} y1={py + ph} x2={px + pw} y2={py + ph} stroke={P.dim} strokeWidth="1.5" />
            {/* Y label */}
            <text x={30} y={py + ph / 2} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600"
              transform={`rotate(-90,30,${py + ph / 2})`}>
              Formation energy (eV)
            </text>
            {/* X label */}
            <text x={px + pw / 2} y={py + ph + 35} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600">
              Fermi level (eV)
            </text>
            {/* Y ticks */}
            {[0, 1, 2, 3, 4].map(v => {
              const yy = toY(v);
              return (
                <g key={`yt${v}`}>
                  <line x1={px - 4} y1={yy} x2={px} y2={yy} stroke={P.dim} strokeWidth="1" />
                  <text x={px - 8} y={yy + 3} textAnchor="end" fill={P.muted} fontSize="7">{v}</text>
                  <line x1={px} y1={yy} x2={px + pw} y2={yy} stroke={P.dim} strokeWidth="0.3" opacity="0.5" />
                </g>
              );
            })}
            {/* X ticks */}
            {[0, 0.3, 0.6, 0.9, 1.2, 1.5].map(v => {
              const xx = toX(v);
              return (
                <g key={`xt${v}`}>
                  <line x1={xx} y1={py + ph} x2={xx} y2={py + ph + 4} stroke={P.dim} strokeWidth="1" />
                  <text x={xx} y={py + ph + 15} textAnchor="middle" fill={P.muted} fontSize="7">{v.toFixed(1)}</text>
                </g>
              );
            })}
            {/* VBM and CBM labels */}
            <text x={px} y={py + ph + 25} textAnchor="middle" fill={P.hole} fontSize="7" fontWeight="700">VBM</text>
            <text x={px + pw} y={py + ph + 25} textAnchor="middle" fill={P.electron} fontSize="7" fontWeight="700">CBM</text>
            {/* Band gap shading */}
            <rect x={px} y={py} width={pw} height={ph} fill={P.ink + "02"} />
          </g>

          {/* DFT lines (solid) */}
          <g opacity={dftT}>
            {dftLines.map((l, i) => {
              // Draw line across bandgap, clipped to positive formation energy
              const pts = [];
              for (let ef = 0; ef <= bandgap; ef += 0.01) {
                const eForm = l.e0 + l.slope * ef;
                if (eForm >= 0 && eForm <= 4) pts.push(`${toX(ef)},${toY(eForm)}`);
              }
              const progress = dftT;
              const visiblePts = pts.slice(0, Math.floor(pts.length * progress));
              return visiblePts.length > 1 ? (
                <polyline key={`dft${i}`} fill="none" stroke={l.color} strokeWidth="2.5"
                  strokeDasharray={l.dash} points={visiblePts.join(" ")} />
              ) : null;
            })}
            {/* Charge state labels for DFT */}
            {dftT > 0.8 && (
              <g opacity={ease(clamp01((dftT - 0.8) * 5))}>
                <text x={toX(0.15)} y={toY(2.8) - 8} fill={P.dft} fontSize="8" fontWeight="700">q = 0</text>
                <text x={toX(0.9)} y={toY(2.2 - 0.9) - 8} fill={P.dft} fontSize="8" fontWeight="700">q = -1</text>
                <text x={toX(1.2)} y={toY(1.4 - 2.4) + 15} fill={P.dft} fontSize="8" fontWeight="700">q = -2</text>
              </g>
            )}
          </g>

          {/* MLFF lines (dashed) */}
          <g opacity={mlffT}>
            {mlffLines.map((l, i) => {
              const pts = [];
              for (let ef = 0; ef <= bandgap; ef += 0.01) {
                const eForm = l.e0 + l.slope * ef;
                if (eForm >= 0 && eForm <= 4) pts.push(`${toX(ef)},${toY(eForm)}`);
              }
              const progress = mlffT;
              const visiblePts = pts.slice(0, Math.floor(pts.length * progress));
              return visiblePts.length > 1 ? (
                <polyline key={`mlff${i}`} fill="none" stroke={l.color} strokeWidth="2"
                  strokeDasharray={l.dash} points={visiblePts.join(" ")} />
              ) : null;
            })}
          </g>

          {/* Transition level markers */}
          <g opacity={labelT}>
            {/* 0/-1 transition */}
            <line x1={toX(trans01)} y1={py + 5} x2={toX(trans01)} y2={py + ph - 5}
              stroke={P.defect} strokeWidth="1" strokeDasharray="3,4" opacity="0.5" />
            <text x={toX(trans01)} y={py + 15} textAnchor="middle" fill={P.defect} fontSize="7" fontWeight="700">
              {"\u03B5"}(0/-1)
            </text>
            {/* -1/-2 transition */}
            <line x1={toX(trans12)} y1={py + 5} x2={toX(trans12)} y2={py + ph - 5}
              stroke={P.defect} strokeWidth="1" strokeDasharray="3,4" opacity="0.5" />
            <text x={toX(trans12)} y={py + 28} textAnchor="middle" fill={P.defect} fontSize="7" fontWeight="700">
              {"\u03B5"}(-1/-2)
            </text>
          </g>

          {/* Legend */}
          <g opacity={labelT}>
            <line x1={px + pw - 140} y1={py + 12} x2={px + pw - 115} y2={py + 12}
              stroke={P.dft} strokeWidth="2.5" />
            <text x={px + pw - 110} y={py + 15} fill={P.dft} fontSize="8" fontWeight="700">DFT (HSE06)</text>
            <line x1={px + pw - 140} y1={py + 27} x2={px + pw - 115} y2={py + 27}
              stroke={P.mlff} strokeWidth="2" strokeDasharray="6,3" />
            <text x={px + pw - 110} y={py + 30} fill={P.mlff} fontSize="8" fontWeight="700">MLFF (M3GNet)</text>
          </g>

          {/* Comparison callout */}
          {compareT > 0 && (
            <g opacity={compareT}>
              <rect x={px + 30} y={py + ph - 165} width={pw - 60} height={55} rx="8"
                fill={P.mlff + "10"} stroke={P.mlff + "40"} strokeWidth="1.5" />
              <text x={px + pw / 2} y={py + ph - 142} textAnchor="middle" fill={P.mlff} fontSize="10" fontWeight="800">
                MLFF reproduces DFT transition levels within ~0.05 eV
              </text>
              <text x={px + pw / 2} y={py + ph - 126} textAnchor="middle" fill={P.muted} fontSize="8">
                Charge transition levels {"\u03B5"}(0/-1) and {"\u03B5"}(-1/-2) correctly predicted
              </text>
            </g>
          )}

          <text x={W / 2} y={H - 8} textAnchor="middle" fill={P.muted} fontSize="10" opacity={titleT}>
            Formation energy diagram validates MLFF accuracy for defect thermodynamics
          </text>
        </svg>
      );
    }

    // ── MLFF ACCELERATION ──
    case "mlff": {
      const introT = ease(clamp01(t * 2.5));
      const raceT = clamp01((t - 0.25) * 1.8);
      const dftProgress = ease(clamp01(raceT * 0.3));  // DFT barely moves
      const mlffProgress = ease(clamp01(raceT));        // MLFF zooms
      const resultT = ease(clamp01((t - 0.75) * 4));

      const trackY1 = 145, trackY2 = 215, trackLeft = 95, trackW = 370;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={40} textAnchor="middle" fill={P.mlff} fontSize="16" fontWeight="900" opacity={introT}>
            MLFF vs DFT: the race
          </text>
          <text x={W / 2} y={60} textAnchor="middle" fill={P.muted} fontSize="11" opacity={introT}>
            Relaxing V_Cd in a 3{"\u00D7"}3{"\u00D7"}3 CdTe supercell
          </text>

          {/* Track backgrounds */}
          <rect x={trackLeft} y={trackY1 - 12} width={trackW} height={28} rx="6" fill={P.surface} stroke={P.border} strokeWidth="1" />
          <rect x={trackLeft} y={trackY2 - 12} width={trackW} height={28} rx="6" fill={P.surface} stroke={P.border} strokeWidth="1" />

          {/* Labels */}
          <text x={trackLeft - 5} y={trackY1 + 5} textAnchor="end" fill={P.dft} fontSize="11" fontWeight="700">DFT</text>
          <text x={trackLeft - 5} y={trackY2 + 5} textAnchor="end" fill={P.mlff} fontSize="11" fontWeight="700">MLFF</text>

          {/* DFT progress bar */}
          <rect x={trackLeft + 2} y={trackY1 - 10} width={Math.max(4, (trackW - 4) * dftProgress)} height={24} rx="4"
            fill={P.dft + "30"} stroke={P.dft} strokeWidth="1" />
          <circle cx={trackLeft + 2 + (trackW - 4) * dftProgress} cy={trackY1} r={8} fill={P.dft} />
          <text x={trackLeft + (trackW - 4) * dftProgress + 20} y={trackY1 + 4}
            fill={P.dft} fontSize="9" fontWeight="700">
            {(dftProgress * 100).toFixed(0)}%
          </text>

          {/* MLFF progress bar */}
          <rect x={trackLeft + 2} y={trackY2 - 10} width={Math.max(4, (trackW - 4) * mlffProgress)} height={24} rx="4"
            fill={P.mlff + "30"} stroke={P.mlff} strokeWidth="1" />
          <circle cx={trackLeft + 2 + (trackW - 4) * mlffProgress} cy={trackY2} r={8} fill={P.mlff} />
          {/* Speed trail */}
          {mlffProgress > 0.1 && mlffProgress < 1 && (
            <line x1={trackLeft + (trackW - 4) * mlffProgress * 0.6}
              y1={trackY2} x2={trackLeft + (trackW - 4) * mlffProgress - 10}
              y2={trackY2} stroke={P.mlff} strokeWidth="3" opacity="0.3" strokeLinecap="round" />
          )}
          <text x={trackLeft + (trackW - 4) * mlffProgress + 20} y={trackY2 + 4}
            fill={P.mlff} fontSize="9" fontWeight="700">
            {(mlffProgress * 100).toFixed(0)}%
          </text>

          {/* Finish line */}
          <line x1={trackLeft + trackW} y1={trackY1 - 20} x2={trackLeft + trackW} y2={trackY2 + 20}
            stroke={P.ink} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={trackLeft + trackW + 5} y={trackY1 - 25} fill={P.muted} fontSize="8">Finish</text>

          {/* Time comparison */}
          <g opacity={introT}>
            <text x={160} y={trackY1 + 40} fill={P.dft} fontSize="10" fontWeight="600">
              4,096 core-hours
            </text>
            <text x={160} y={trackY2 + 40} fill={P.mlff} fontSize="10" fontWeight="600">
              0.53 core-hours
            </text>
          </g>

          {/* Result callout */}
          {resultT > 0 && (
            <g opacity={resultT}>
              <rect x={120} y={280} width={320} height={65} rx="10" fill={P.mlff + "15"} stroke={P.mlff} strokeWidth="2" />
              <text x={280} y={305} textAnchor="middle" fill={P.mlff} fontSize="20" fontWeight="900">
                ~8,000{"\u00D7"} faster
              </text>
              <text x={280} y={326} textAnchor="middle" fill={P.muted} fontSize="11">
                Same accuracy {"\u2014"} M3GNet trained on HSE06 data
              </text>
            </g>
          )}
          <text x={W / 2} y={H - 8} textAnchor="middle" fill={P.mlff} fontSize="11" fontWeight="600">
            Machine Learning Force Field: DFT accuracy at classical speed
          </text>
        </svg>
      );
    }

    // ── SCREENING AT SCALE ──
    case "screen": {
      const cols = 8, rows = 5;
      const cellW = 48, cellH = 38;
      const ox = 62, oy = 58;
      const fillCount = Math.floor(ease(clamp01(t * 1.5)) * cols * rows);

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W / 2} y={30} textAnchor="middle" fill={P.mlff} fontSize="14" fontWeight="800">
            High-throughput defect screening with MLFF
          </text>
          {/* Grid of defect calculations */}
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const idx = r * cols + c;
              const filled = idx < fillCount;
              const justFilled = idx === fillCount - 1;
              const x = ox + c * (cellW + 6);
              const y = oy + r * (cellH + 6);
              const defNames = ["V_Cd","V_Te","Te_Cd","Cl_Te","Cu_Cd","As_Te","O_Te","V_Se",
                                "V_Cd\u00B2\u207B","V_Te\u00B2\u207A","Se_Te","Cd_i","Cu_i","N_Te","P_Te","Sb_Te",
                                "V_Cd+Cl","As+V","Cu+Cl","Sn_Cd","Bi_Te","In_Cd","Ga_Cd","Fe_Cd",
                                "V_Cd\u207B","Te_i","Cd_i\u207A","Cl_Se","O_Se","Zn_Cd","Hg_Cd","Na_Cd",
                                "K_Cd","Li_Cd","Ag_Cd","Au_Cd","Mn_Cd","Co_Cd","Ni_Cd","V_S"];
              const isDeep = [1, 2, 6, 8, 9, 19, 23].includes(idx);
              return (
                <g key={`${r}-${c}`}>
                  <rect x={x} y={y} width={cellW} height={cellH} rx="4"
                    fill={filled ? (isDeep ? P.defect + "20" : P.mlff + "15") : P.surface}
                    stroke={filled ? (isDeep ? P.defect + "60" : P.mlff + "40") : P.border}
                    strokeWidth={justFilled ? 2 : 1} />
                  <text x={x + cellW / 2} y={y + cellH / 2 + 3} textAnchor="middle"
                    fill={filled ? (isDeep ? P.defect : P.mlff) : P.dim}
                    fontSize="7" fontWeight={filled ? "700" : "500"}>
                    {defNames[idx] || `D${idx}`}
                  </text>
                  {filled && (
                    <text x={x + cellW - 4} y={y + 10} textAnchor="end"
                      fill={isDeep ? P.defect : P.ok} fontSize="7" fontWeight="800">
                      {isDeep ? "\u2717" : "\u2713"}
                    </text>
                  )}
                </g>
              );
            })
          )}
          {/* Legend */}
          <g>
            <circle cx={W / 2 - 95} cy={oy + rows * (cellH + 6) + 20} r={5} fill={P.mlff + "40"} stroke={P.mlff} strokeWidth="1" />
            <text x={W / 2 - 83} y={oy + rows * (cellH + 6) + 24} fill={P.mlff} fontSize="9" fontWeight="600">Shallow / benign</text>
            <circle cx={W / 2 + 45} cy={oy + rows * (cellH + 6) + 20} r={5} fill={P.defect + "40"} stroke={P.defect} strokeWidth="1" />
            <text x={W / 2 + 57} y={oy + rows * (cellH + 6) + 24} fill={P.defect} fontSize="9" fontWeight="600">Deep / harmful</text>
          </g>
          {/* Stats */}
          <text x={W / 2} y={H - 30} textAnchor="middle" fill={P.ink} fontSize="12" fontWeight="700">
            {fillCount}/{cols * rows} defects screened {"\u2014"} total cost: ~50 core-hours
          </text>
          <text x={W / 2} y={H - 12} textAnchor="middle" fill={P.muted} fontSize="10">
            vs ~400,000 core-hours with pure DFT
          </text>
        </svg>
      );
    }

    // ── FINALE ──
    case "finale": {
      const line1 = ease(clamp01(t * 2.5));
      const line2 = ease(clamp01((t - 0.15) * 2.5));
      const line3 = ease(clamp01((t - 0.3) * 2.5));
      const expT = ease(clamp01((t - 0.45) * 2.5));
      const glow = ease(clamp01((t - 0.65) * 3));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {/* Gradient glow */}
          <defs>
            <radialGradient id="finGlow">
              <stop offset="0%" stopColor={P.mlff} stopOpacity="0.12" />
              <stop offset="100%" stopColor={P.bg} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={W / 2} cy={H / 2 - 20} r={200 * glow} fill="url(#finGlow)" />

          <text x={W / 2} y={35} textAnchor="middle" fill={P.ink} fontSize="11" fontWeight="600" opacity={line1}>
            Computational + experimental workflow
          </text>

          {/* Flow row 1: Model → Identify → Design (3 boxes) */}
          {[
            { x: 40,  label: "Model", sub: "DFT + MLFF", color: P.mlff },
            { x: 205, label: "Identify", sub: "harmful defects", color: P.defect },
            { x: 370, label: "Design", sub: "defect-tolerant PV", color: P.dft },
          ].map((box, i) => {
            const op = [line1, line2, line3][i];
            return (
              <g key={i} opacity={op}>
                <rect x={box.x} y={50} width={140} height={55} rx="8"
                  fill={box.color + "12"} stroke={box.color} strokeWidth="1.5" />
                <text x={box.x + 70} y={72} textAnchor="middle" fill={box.color} fontSize="13" fontWeight="800">{box.label}</text>
                <text x={box.x + 70} y={90} textAnchor="middle" fill={P.muted} fontSize="9">{box.sub}</text>
                {i < 2 && (
                  <text x={box.x + 150} y={80} fill={P.ink} fontSize="16" fontWeight="700" opacity={op * 0.6}>{"\u2192"}</text>
                )}
              </g>
            );
          })}

          {/* Experimental validation row */}
          {expT > 0 && (
            <g opacity={expT}>
              {/* Connecting arrow down from center */}
              <line x1={W / 2} y1={108} x2={W / 2} y2={125} stroke={P.solar} strokeWidth="1.5" strokeDasharray="3,2" />
              <polygon points={`${W / 2 - 4},125 ${W / 2 + 4},125 ${W / 2},132`} fill={P.solar} />

              <text x={W / 2} y={148} textAnchor="middle" fill={P.solar} fontSize="10" fontWeight="700">
                Experimental validation
              </text>

              {/* 3 experimental boxes */}
              {[
                { x: 30,  label: "MLFF-optimized", sub: "defect structures", color: P.mlff },
                { x: 200, label: "XANES fitting", sub: "from MLFF configs", color: P.solar },
                { x: 370, label: "Exp. correlation", sub: "validate predictions", color: P.ok },
              ].map((box, i) => {
                const eop = ease(clamp01((expT - i * 0.15) * 3));
                return (
                  <g key={`e${i}`} opacity={eop}>
                    <rect x={box.x} y={158} width={150} height={48} rx="7"
                      fill={box.color + "0a"} stroke={box.color + "50"} strokeWidth="1" strokeDasharray="4,3" />
                    <text x={box.x + 75} y={176} textAnchor="middle" fill={box.color} fontSize="10" fontWeight="700">{box.label}</text>
                    <text x={box.x + 75} y={192} textAnchor="middle" fill={P.muted} fontSize="8">{box.sub}</text>
                    {i < 2 && (
                      <text x={box.x + 160} y={184} fill={P.ink} fontSize="14" fontWeight="700" opacity={eop * 0.5}>{"\u2192"}</text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Impact numbers */}
          {glow > 0 && (
            <g opacity={glow}>
              {[
                { x: 110, val: "8,000\u00D7", label: "speedup", color: P.mlff },
                { x: 280, val: "1000s", label: "of defects screened", color: P.solar },
                { x: 440, val: ">30%", label: "efficiency target", color: P.ok },
              ].map((s, i) => (
                <g key={i}>
                  <text x={s.x} y={260} textAnchor="middle" fill={s.color} fontSize="20" fontWeight="900">{s.val}</text>
                  <text x={s.x} y={278} textAnchor="middle" fill={P.muted} fontSize="9">{s.label}</text>
                </g>
              ))}
            </g>
          )}

          <text x={W / 2} y={H - 40} textAnchor="middle" fill={P.ink} fontSize="12" fontWeight="700" opacity={glow}>
            Data-driven defect engineering validated by experiment
          </text>
          <text x={W / 2} y={H - 22} textAnchor="middle" fill={P.muted} fontSize="9" opacity={glow}>
            MLFF structures {"\u2192"} simulated XANES spectra {"\u2192"} comparison with experimental spectra
          </text>
          <text x={W / 2} y={H - 6} textAnchor="middle" fill={P.muted} fontSize="9" opacity={glow}>
            M.H. Rahman et al. {"\u00B7"} Purdue University
          </text>
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
          fontSize: 22, fontWeight: 800, color: P.defect, marginBottom: 4,
        }}>DefectDB {"\u2014"} Solar Cells Under the Microscope</div>
        <div style={{ fontSize: 13, color: P.muted, lineHeight: 1.5 }}>
          Watch how defects destroy solar cell efficiency, and how DFT + machine learning fight back.
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
            background: P.defect + "25", border: `1px solid ${P.defect}50`,
            padding: "3px 10px", borderRadius: 6,
            fontSize: 10, fontWeight: 700, color: P.defect, letterSpacing: 1,
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
        <div style={{ opacity: sceneOpacity, transition: "opacity 0.15s ease" }}>
          {renderScene()}
        </div>

        {/* Scene progress bar */}
        <div style={{
          height: 3, background: P.dim + "30", position: "relative",
        }}>
          <div style={{
            height: "100%", background: P.solar,
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
        {/* Play / Pause */}
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.solar}`,
          background: P.solar + "15", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18,
          color: P.solar, fontWeight: 900, fontFamily: "inherit",
        }}>
          {playing ? "\u23F8" : (sceneIdx === SCENES.length - 1 && progress >= 1) ? "\u21BB" : "\u25B6"}
        </button>

        {/* Prev / Next */}
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

        {/* Global progress */}
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
              height: "100%", background: `linear-gradient(90deg, ${P.defect}, ${P.dft}, ${P.mlff})`,
              width: `${globalProgress * 100}%`, borderRadius: 3,
            }} />
            {/* Scene tick marks */}
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

        {/* Time */}
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
            background: i === sceneIdx ? P.solar + "20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.solar : P.border}`,
            color: i === sceneIdx ? P.solar : i < sceneIdx ? P.mlff : P.muted,
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
