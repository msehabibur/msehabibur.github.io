import { useState, useEffect, useMemo, useRef } from "react";

const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  eo_e: "#2563eb", eo_hole: "#ea580c", eo_photon: "#ca8a04",
  eo_valence: "#059669", eo_core: "#7c3aed", eo_gap: "#dc2626", eo_cond: "#0284c7",
};

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

function SectionTitle({ color, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        fontSize: 15, fontWeight: 800, color,
        letterSpacing: 0.5,
      }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK A: QUANTUM & ATOMIC FOUNDATIONS
// ═══════════════════════════════════════════════════════════════════════════


function AnalogyBox({ children }) {
  return (
    <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "10px 16px", marginBottom: 12, width: "100%", flexShrink: 0, alignSelf: "flex-start" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
      <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>{children}</div>
    </div>
  );
}

// --- Section 1: AtomicModelsSection ---
function AtomicModelsSection() {
  const [model, setModel] = useState(0);
  const [frame, setFrame] = useState(0);
  const [bohrLevel, setBohrLevel] = useState(3);
  const [bohrTransition, setBohrTransition] = useState(null);
  const [transitionAnim, setTransitionAnim] = useState(0);
  const [qmOrbital, setQmOrbital] = useState("1s");

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bohrTransition) {
      setTransitionAnim(0);
      const id = setInterval(() => {
        setTransitionAnim(p => {
          if (p >= 1) {
            clearInterval(id);
            setBohrLevel(bohrTransition.to);
            setBohrTransition(null);
            return 0;
          }
          return p + 0.04;
        });
      }, 50);
      return () => clearInterval(id);
    }
  }, [bohrTransition]);

  const models = [
    { name: "Dalton", year: 1803, discoverer: "John Dalton", experiment: "Chemical combination ratios", equation: "None (conceptual)", right: "Atoms are fundamental units of elements", wrong: "Atoms are NOT indivisible" },
    { name: "Thomson", year: 1897, discoverer: "J.J. Thomson", experiment: "Cathode ray tube", equation: "e/m = 1.76×10¹¹ C/kg", right: "Discovered electrons, atoms have internal structure", wrong: "No nucleus; positive charge is NOT spread uniformly" },
    { name: "Rutherford", year: 1911, discoverer: "Ernest Rutherford", experiment: "Gold foil / alpha scattering", equation: "N(θ) ∝ 1/sin⁴(θ/2)", right: "Tiny dense positive nucleus; atom is mostly empty space", wrong: "Cannot explain atomic stability or spectral lines" },
    { name: "Bohr", year: 1913, discoverer: "Niels Bohr", experiment: "Hydrogen emission spectrum", equation: "Eₙ = -13.6/n² eV", right: "Correct energy levels for hydrogen; explains spectral lines", wrong: "Fails for multi-electron atoms; orbits are not real paths" },
    { name: "Sommerfeld", year: 1916, discoverer: "Arnold Sommerfeld", experiment: "Fine structure of spectral lines", equation: "Eₙₗ includes α² corrections", right: "Explains fine structure; introduces angular momentum quantum number", wrong: "Still semi-classical; no spin, no probability interpretation" },
    { name: "Quantum", year: "1926+", discoverer: "Schrödinger, Heisenberg, Born", experiment: "Davisson-Germer electron diffraction", equation: "Ĥψ = Eψ", right: "Complete and correct. Probability clouds, all quantum numbers", wrong: "Nothing fundamentally wrong — this IS the accepted model" },
  ];

  const cx = 170, cy = 170;
  const t = frame * 0.05;

  const balmerColors = { 3: "#ff4444", 4: "#00cccc", 5: "#4444ff", 6: "#8800aa" };

  const renderSVG = () => {
    switch (model) {
      case 0: {
        const pulse = 1 + 0.06 * Math.sin(t * 2);
        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            <circle cx={cx} cy={cy} r={60 * pulse} fill={T.eo_core} opacity={0.7} />
            <circle cx={cx} cy={cy} r={60 * pulse} fill="none" stroke={T.ink} strokeWidth={2} />
            <text x={cx} y={cy - 5} textAnchor="middle" fill="#fff" fontSize={11} fontFamily="monospace" fontWeight="bold">Indivisible</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize={11} fontFamily="monospace" fontWeight="bold">Atom</text>
            <text x={cx} y={cy + 80} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">Dalton 1803</text>
            <text x={cx} y={cy + 95} textAnchor="middle" fill={T.muted} fontSize={9} fontFamily="monospace">"Atoms are solid, indivisible spheres"</text>
          </svg>
        );
      }
      case 1: {
        const electrons = [];
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          const r = 30 + 25 * Math.sin(a * 3 + i);
          const jx = Math.cos(a) * r + Math.sin(t * 3 + i * 2) * 4;
          const jy = Math.sin(a) * r + Math.cos(t * 2.5 + i * 1.7) * 4;
          electrons.push({ x: cx + jx, y: cy + jy });
        }
        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            <circle cx={cx} cy={cy} r={70} fill={T.eo_e} opacity={0.15} />
            <circle cx={cx} cy={cy} r={70} fill="none" stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="4,3" />
            {[...Array(12)].map((_, i) => {
              const a2 = (Math.PI * 2 * i) / 12;
              const pr = 20 + 30 * ((i * 7 + 3) % 5) / 5;
              return <text key={i} x={cx + Math.cos(a2) * pr} y={cy + Math.sin(a2) * pr + 4} textAnchor="middle" fill={T.eo_e} fontSize={10} fontFamily="monospace" opacity={0.4}>+</text>;
            })}
            {electrons.map((e, i) => (
              <g key={i}>
                <circle cx={e.x} cy={e.y} r={6} fill={T.eo_hole} />
                <text x={e.x} y={e.y + 3.5} textAnchor="middle" fill="#fff" fontSize={8} fontFamily="monospace" fontWeight="bold">−</text>
              </g>
            ))}
            <text x={cx} y={cy + 90} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">"Plum Pudding" — Thomson 1897</text>
            <text x={cx} y={cy + 105} textAnchor="middle" fill={T.eo_e} fontSize={9} fontFamily="monospace">+ positive dough, − electron plums</text>
          </svg>
        );
      }
      case 2: {
        const alphas = [0, 1, 2].map(i => {
          const progress = ((t * 0.6 + i * 1.2) % 3.6) / 3.6;
          if (i === 2) {
            if (progress < 0.45) return { x: -30 + progress * 2.2 * 170, y: cy + 10, vis: true, deflected: false };
            const dp = (progress - 0.45) / 0.55;
            return { x: cx - 20 + dp * (-100), y: cy + 10 - dp * 130, vis: true, deflected: true };
          }
          const yOff = i === 0 ? -35 : 30;
          return { x: -30 + progress * 400, y: cy + yOff, vis: true, deflected: false };
        });
        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            <circle cx={cx} cy={cy} r={100} fill="none" stroke={T.dim} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
            <text x={cx + 75} y={cy - 75} textAnchor="middle" fill={T.dim} fontSize={8} fontFamily="monospace">mostly empty</text>
            <circle cx={cx} cy={cy} r={8} fill={T.eo_gap} />
            <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={7} fontFamily="monospace" fontWeight="bold">+</text>
            <text x={cx} y={cy + 22} textAnchor="middle" fill={T.eo_gap} fontSize={8} fontFamily="monospace">nucleus</text>
            {[...Array(5)].map((_, i) => {
              const ea = t * 0.4 + i * 1.26;
              const er = 40 + i * 18;
              return <circle key={i} cx={cx + Math.cos(ea) * er} cy={cy + Math.sin(ea) * er} r={3} fill={T.eo_e} opacity={0.6} />;
            })}
            {alphas.map((a, i) => a.vis && (
              <g key={i}>
                <circle cx={a.x} cy={a.y} r={4} fill={T.eo_photon} />
                <text x={a.x} y={a.y + 3} textAnchor="middle" fill="#fff" fontSize={6} fontFamily="monospace">α</text>
              </g>
            ))}
            <text x={20} y={cy - 50} textAnchor="start" fill={T.eo_photon} fontSize={8} fontFamily="monospace">α beam →</text>
            {alphas[2] && alphas[2].deflected && (
              <text x={cx - 80} y={cy - 80} textAnchor="middle" fill={T.eo_gap} fontSize={8} fontFamily="monospace" fontWeight="bold">← bounced back!</text>
            )}
            <rect x={cx - 5} y={30} width={10} height={280} fill={T.eo_photon} opacity={0.07} />
            <text x={cx} y={25} textAnchor="middle" fill={T.eo_photon} fontSize={8} fontFamily="monospace">gold foil</text>
            <text x={cx} y={cy + 130} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">Rutherford 1911 — Gold Foil Experiment</text>
          </svg>
        );
      }
      case 3: {
        const orbitRadii = [35, 62, 93, 119, 138, 154];
        const energies = orbitRadii.map((_, i) => (-13.6 / ((i + 1) * (i + 1))).toFixed(2));
        const electronAngle = (n) => t * (3.0 / n);

        let currentN = bohrLevel;
        let electronR = orbitRadii[currentN - 1];
        let electronA = electronAngle(currentN);

        if (bohrTransition && transitionAnim < 1) {
          const fromR = orbitRadii[bohrTransition.from - 1];
          const toR = orbitRadii[bohrTransition.to - 1];
          electronR = lerp(fromR, toR, transitionAnim);
          currentN = bohrTransition.from;
          electronA = electronAngle(currentN);
        }

        const eX = cx + Math.cos(electronA) * electronR;
        const eY = cy + Math.sin(electronA) * electronR;

        const photonVis = bohrTransition && transitionAnim > 0.3 && transitionAnim < 1 && bohrTransition.to < bohrTransition.from;
        const photonProgress = photonVis ? (transitionAnim - 0.3) / 0.7 : 0;
        const photonX = photonVis ? lerp(eX, 300, photonProgress) : 0;
        const photonY = photonVis ? lerp(eY, 30, photonProgress) : 0;
        const transColor = bohrTransition && bohrTransition.to === 2 ? (balmerColors[bohrTransition.from] || "#ca8a04") : "#ca8a04";

        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            {orbitRadii.map((r, i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={i + 1 === bohrLevel ? T.eo_e : T.dim} strokeWidth={i + 1 === bohrLevel ? 2 : 1} strokeDasharray={i + 1 === bohrLevel ? "none" : "4,3"} opacity={i + 1 === bohrLevel ? 1 : 0.5} />
                <text x={cx + r + 4} y={cy - 5} fill={T.muted} fontSize={7} fontFamily="monospace">n={i + 1}</text>
                <circle cx={cx + r} cy={cy - 16} r={8} fill="transparent" stroke="none" style={{ cursor: "pointer" }} onClick={() => {
                  if (i + 1 !== bohrLevel && !bohrTransition) {
                    setBohrTransition({ from: bohrLevel, to: i + 1 });
                  }
                }} />
              </g>
            ))}
            <circle cx={cx} cy={cy} r={10} fill={T.eo_gap} />
            <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#fff" fontSize={8} fontFamily="monospace" fontWeight="bold">+</text>
            <circle cx={eX} cy={eY} r={6} fill={T.eo_e} />
            <text x={eX} y={eY + 3} textAnchor="middle" fill="#fff" fontSize={6} fontFamily="monospace">e⁻</text>
            {photonVis && (
              <g>
                {[...Array(5)].map((_, wi) => {
                  const wx = photonX - wi * 6;
                  const wy = photonY + Math.sin((transitionAnim * 10) + wi) * 4;
                  return <circle key={wi} cx={wx} cy={wy} r={2} fill={transColor} opacity={0.7 - wi * 0.1} />;
                })}
                <text x={photonX + 10} y={photonY - 5} fill={transColor} fontSize={7} fontFamily="monospace">γ</text>
              </g>
            )}
            {orbitRadii.map((_, i) => {
              const lvlX = 295, lvlY = 50 + i * 30;
              const isCurrent = (i + 1) === bohrLevel;
              return (
                <g key={`e${i}`} onClick={() => {
                  if (i + 1 !== bohrLevel && !bohrTransition) setBohrTransition({ from: bohrLevel, to: i + 1 });
                }} style={{ cursor: "pointer" }}>
                  <line x1={lvlX - 20} y1={lvlY} x2={lvlX + 20} y2={lvlY} stroke={isCurrent ? T.eo_e : T.dim} strokeWidth={isCurrent ? 2.5 : 1.5} />
                  <text x={lvlX + 25} y={lvlY + 3} fill={isCurrent ? T.eo_e : T.muted} fontSize={7} fontFamily="monospace">{energies[i]} eV</text>
                  {isCurrent && <circle cx={lvlX} cy={lvlY - 5} r={3} fill={T.eo_e} />}
                </g>
              );
            })}
            <text x={295} y={38} textAnchor="middle" fill={T.ink} fontSize={8} fontFamily="monospace" fontWeight="bold">Energy</text>
            {bohrTransition && bohrTransition.to === 2 && transitionAnim > 0.1 && (
              <text x={cx} y={cy + 148} textAnchor="middle" fill={transColor} fontSize={8} fontFamily="monospace" fontWeight="bold">
                Balmer: n={bohrTransition.from}→2
              </text>
            )}
            <text x={cx} y={cy + 155} textAnchor="middle" fill={T.muted} fontSize={7} fontFamily="monospace">
              E = {energies[bohrLevel - 1]} eV | r = {((bohrLevel * bohrLevel) * 0.529).toFixed(2)} Å
            </text>
          </svg>
        );
      }
      case 4: {
        const ellipses = [
          { n: 1, l: 0, a: 35, b: 20, rot: 0 },
          { n: 2, l: 0, a: 70, b: 30, rot: 0 },
          { n: 2, l: 1, a: 62, b: 60, rot: 45 },
          { n: 3, l: 0, a: 105, b: 40, rot: 0 },
          { n: 3, l: 1, a: 95, b: 70, rot: 30 },
          { n: 3, l: 2, a: 93, b: 90, rot: 60 },
        ];
        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            <circle cx={cx} cy={cy} r={6} fill={T.eo_gap} />
            {ellipses.map((el, i) => {
              const speed = 2.0 / el.n;
              const angle = t * speed + i * 1.1;
              const ecosA = Math.cos(angle);
              const esinA = Math.sin(angle);
              const ex = el.a * ecosA;
              const ey = el.b * esinA;
              const rotRad = (el.rot * Math.PI) / 180;
              const rx = ex * Math.cos(rotRad) - ey * Math.sin(rotRad);
              const ry = ex * Math.sin(rotRad) + ey * Math.cos(rotRad);
              const hue = el.l === 0 ? T.eo_e : el.l === 1 ? T.eo_valence : T.eo_core;
              return (
                <g key={i}>
                  <ellipse cx={cx} cy={cy} rx={el.a} ry={el.b} fill="none" stroke={hue} strokeWidth={1} opacity={0.4} transform={`rotate(${el.rot},${cx},${cy})`} strokeDasharray="3,3" />
                  <circle cx={cx + rx} cy={cy + ry} r={3.5} fill={hue} opacity={0.8} />
                  <text x={cx + el.a + 8} y={cy - el.b + 8} fill={hue} fontSize={7} fontFamily="monospace" transform={`rotate(${el.rot},${cx},${cy})`} opacity={0.7}>
                    n={el.n},l={el.l}
                  </text>
                </g>
              );
            })}
            <text x={cx} y={20} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">Sommerfeld Elliptical Orbits</text>
            <text x={cx} y={315} textAnchor="middle" fill={T.muted} fontSize={8} fontFamily="monospace">l=0: very elliptical | l=n-1: circular</text>
            <text x={cx} y={330} textAnchor="middle" fill={T.muted} fontSize={7} fontFamily="monospace">Faster at perihelion, slower at aphelion (Kepler)</text>
          </svg>
        );
      }
      case 5: {
        const seed = (x) => Math.sin(x * 12.9898 + x * 78.233) * 43758.5453 % 1;

        const generateDots = (orbType, offsetX, offsetY, scale, color) => {
          const dots = [];
          const cxo = (offsetX || cx), cyo = (offsetY || cy), sc = (scale || 1);
          if (orbType === "1s") {
            for (let i = 0; i < 120; i++) {
              const r = Math.abs(seed(i * 3.1 + frame * 0.01)) * 90 * sc;
              const a = seed(i * 7.7) * Math.PI * 2;
              const prob = Math.exp(-r / (25 * sc));
              if (seed(i * 11 + frame * 0.03) < prob) dots.push({ x: cxo + Math.cos(a) * r, y: cyo + Math.sin(a) * r, o: prob * 0.7, c: color || T.eo_e });
            }
          } else if (orbType === "2s") {
            for (let i = 0; i < 120; i++) {
              const r = Math.abs(seed(i * 3.1 + frame * 0.01)) * 120 * sc;
              const a = seed(i * 7.7) * Math.PI * 2;
              const rn = r / (30 * sc);
              const prob = Math.exp(-rn / 2) * Math.abs(2 - rn) * 0.5;
              if (seed(i * 11 + frame * 0.03) < prob) dots.push({ x: cxo + Math.cos(a) * r, y: cyo + Math.sin(a) * r, o: prob * 0.6, c: color || T.eo_cond });
            }
          } else if (orbType === "2p") {
            for (let i = 0; i < 130; i++) {
              const r = Math.abs(seed(i * 3.1 + frame * 0.012)) * 110 * sc;
              const a = seed(i * 7.7) * Math.PI * 2;
              const cosTheta = Math.cos(a);
              const prob = Math.exp(-r / (40 * sc)) * cosTheta * cosTheta;
              if (seed(i * 11 + frame * 0.03) < prob) dots.push({ x: cxo + Math.cos(a) * r, y: cyo + Math.sin(a) * r * 0.5, o: prob * 0.6, c: color || T.eo_valence });
            }
          } else if (orbType === "3s") {
            for (let i = 0; i < 100; i++) {
              const r = Math.abs(seed(i * 3.3 + frame * 0.008)) * 140 * sc;
              const a = seed(i * 7.2) * Math.PI * 2;
              const rn = r / (35 * sc);
              const prob = Math.exp(-rn / 3) * Math.abs(3 - 2 * rn + rn * rn / 3) * 0.3;
              if (seed(i * 13 + frame * 0.025) < prob) dots.push({ x: cxo + Math.cos(a) * r, y: cyo + Math.sin(a) * r, o: prob * 0.5, c: color || T.eo_core });
            }
          } else if (orbType === "3p") {
            for (let i = 0; i < 100; i++) {
              const r = Math.abs(seed(i * 2.9 + frame * 0.009)) * 130 * sc;
              const a = seed(i * 8.1) * Math.PI * 2;
              const cosTheta = Math.cos(a);
              const prob = Math.exp(-r / (45 * sc)) * cosTheta * cosTheta * 0.7;
              if (seed(i * 12 + frame * 0.028) < prob) dots.push({ x: cxo + Math.cos(a) * r, y: cyo + Math.sin(a) * r * 0.55, o: prob * 0.5, c: color || T.eo_photon });
            }
          } else if (orbType === "3d") {
            for (let i = 0; i < 100; i++) {
              const r = Math.abs(seed(i * 3.5 + frame * 0.007)) * 120 * sc;
              const a = seed(i * 6.3) * Math.PI * 2;
              const cos2 = Math.cos(2 * a);
              const prob = Math.exp(-r / (50 * sc)) * cos2 * cos2 * 0.6;
              if (seed(i * 14 + frame * 0.02) < prob) {
                const dx = Math.cos(a) * r, dy = Math.sin(a) * r * 0.6;
                dots.push({ x: cxo + dx, y: cyo + dy, o: prob * 0.5, c: color || T.eo_gap });
              }
            }
          }
          return dots;
        };

        if (qmOrbital !== "all") {
          const dots = generateDots(qmOrbital);
          return (
            <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={2} fill={d.c} opacity={d.o} />
              ))}
              <circle cx={cx} cy={cy} r={3} fill={T.eo_gap} opacity={0.5} />
              <text x={cx} y={20} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">Quantum Mechanical — |{"ψ"}|{"²"} Probability</text>
              <text x={cx} y={cy + 140} textAnchor="middle" fill={T.muted} fontSize={9} fontFamily="monospace">Orbital: {qmOrbital}</text>
              <g>
                {["1s", "2s", "2p", "3d", "all"].map((orb, i) => (
                  <g key={orb} onClick={() => setQmOrbital(orb)} style={{ cursor: "pointer" }}>
                    <rect x={28 + i * 58} y={300} width={52} height={22} rx={4} fill={qmOrbital === orb ? T.eo_e : T.surface} stroke={qmOrbital === orb ? T.eo_e : T.border} strokeWidth={1} />
                    <text x={54 + i * 58} y={314} textAnchor="middle" fill={qmOrbital === orb ? "#fff" : T.ink} fontSize={9} fontFamily="monospace">{orb === "all" ? "All" : orb}</text>
                  </g>
                ))}
              </g>
            </svg>
          );
        }

        // "All Orbitals" mode — show all orbitals simultaneously with different colors
        const allDots = [
          ...generateDots("1s", cx, cy, 1, T.eo_e),
          ...generateDots("2s", cx, cy, 1, T.eo_cond),
          ...generateDots("2p", cx, cy, 1, T.eo_valence),
          ...generateDots("3s", cx, cy, 1, T.eo_core),
          ...generateDots("3p", cx, cy, 1, T.eo_photon),
          ...generateDots("3d", cx, cy, 1, T.eo_gap),
        ];
        return (
          <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
            {allDots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={1.8} fill={d.c} opacity={d.o * 0.8} />
            ))}
            <circle cx={cx} cy={cy} r={4} fill={T.ink} />
            <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={5} fontWeight="bold">Z</text>
            <text x={cx} y={18} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">All Orbitals — Probability Clouds</text>
            {/* Color legend */}
            {[
              { c: T.eo_e, l: "1s" }, { c: T.eo_cond, l: "2s" }, { c: T.eo_valence, l: "2p" },
              { c: T.eo_core, l: "3s" }, { c: T.eo_photon, l: "3p" }, { c: T.eo_gap, l: "3d" },
            ].map((item, i) => (
              <g key={i}>
                <circle cx={25 + i * 52} cy={275} r={4} fill={item.c} opacity={0.8} />
                <text x={33 + i * 52} y={278} fontSize={8} fill={T.muted} fontFamily="monospace">{item.l}</text>
              </g>
            ))}
            <text x={cx} y={295} textAnchor="middle" fill={T.muted} fontSize={8} fontFamily="monospace">
              Each color = different orbital shape and energy
            </text>
            <g>
              {["1s", "2s", "2p", "3d", "all"].map((orb, i) => (
                <g key={orb} onClick={() => setQmOrbital(orb)} style={{ cursor: "pointer" }}>
                  <rect x={28 + i * 58} y={305} width={52} height={22} rx={4} fill={qmOrbital === orb ? T.eo_e : T.surface} stroke={qmOrbital === orb ? T.eo_e : T.border} strokeWidth={1} />
                  <text x={54 + i * 58} y={319} textAnchor="middle" fill={qmOrbital === orb ? "#fff" : T.ink} fontSize={9} fontFamily="monospace">{orb === "all" ? "All" : orb}</text>
                </g>
              ))}
            </g>
          </svg>
        );
      }
      default: return null;
    }
  };

  const m = models[model];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Imagine you are looking at an object through a series of increasingly powerful microscopes. <strong>Dalton</strong> saw a solid marble. <strong>Thomson</strong> cracked it open and found raisins in a pudding. <strong>Rutherford</strong> zoomed in and discovered the marble is 99.99% empty space with a tiny dense core. <strong>Bohr</strong> saw electrons orbiting like planets. Finally, <strong>quantum mechanics</strong> revealed there are no orbits at all {"—"} just fuzzy probability clouds showing where the electron is <em>likely</em> to be. Each model did not destroy the last; it refined it.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        {renderSVG()}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {models.map((md, i) => (
            <button key={i} onClick={() => setModel(i)} style={{
              padding: "5px 8px", borderRadius: 4, border: `1px solid ${model === i ? T.eo_e : T.border}`,
              background: model === i ? T.eo_e : T.panel, color: model === i ? "#fff" : T.ink,
              fontFamily: "monospace", fontSize: 11, cursor: "pointer", lineHeight: 1.2,
            }}>
              {md.name}<br /><span style={{ fontSize: 9, opacity: 0.7 }}>{md.year}</span>
            </button>
          ))}
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, padding: 12 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6, color: T.eo_e }}>{m.name} Model ({m.year})</div>
          <div style={{ fontSize: 10, color: T.muted, marginBottom: 8 }}>Discoverer: {m.discoverer}</div>
          <div style={{ fontSize: 10, marginBottom: 4 }}><strong>Key Experiment:</strong> {m.experiment}</div>
          <div style={{ fontSize: 10, marginBottom: 4 }}><strong>Key Equation:</strong> {m.equation}</div>
          <div style={{ fontSize: 10, marginBottom: 4, color: T.eo_valence }}><strong>Got Right:</strong> {m.right}</div>
          <div style={{ fontSize: 10, color: T.eo_gap }}><strong>Got Wrong:</strong> {m.wrong}</div>
        </div>

        {model === 3 && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>Bohr Postulates</div>
            <div style={{ fontSize: 10, marginBottom: 3 }}>1. Electrons orbit in discrete circular paths without radiating.</div>
            <div style={{ fontSize: 10, marginBottom: 3 }}>2. Angular momentum is quantized: L = nℏ = nh/2π</div>
            <div style={{ fontSize: 10, marginBottom: 3 }}>3. Photon emitted/absorbed: ΔE = hν = 13.6(1/n²_f − 1/n²_i) eV</div>
            <div style={{ fontSize: 10, marginBottom: 6 }}>4. Stationary states: E_n = −13.6/n² eV, r_n = n²×0.529 Å</div>
            <div style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4, color: T.eo_e }}>Balmer Series Transitions (click energy levels):</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => { if (!bohrTransition) { setBohrLevel(n); setBohrTransition({ from: n, to: 2 }); } }} style={{
                  padding: "3px 7px", borderRadius: 3, border: `1px solid ${balmerColors[n]}`,
                  background: "transparent", color: balmerColors[n], fontFamily: "monospace", fontSize: 11, cursor: "pointer",
                }}>
                  {n}→2
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 10, fontWeight: "bold", marginBottom: 6 }}>Historical Timeline</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative", height: 30 }}>
            <div style={{ position: "absolute", top: 14, left: 0, right: 0, height: 2, background: T.dim }} />
            {models.map((md, i) => (
              <div key={i} onClick={() => setModel(i)} style={{
                flex: 1, textAlign: "center", position: "relative", cursor: "pointer", zIndex: 1,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", margin: "0 auto",
                  background: model === i ? T.eo_e : T.dim, marginTop: 10,
                }} />
                <div style={{ fontSize: 9, marginTop: 2, color: model === i ? T.eo_e : T.muted }}>{md.year}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Experiment</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            {model === 0 && "Dalton measured the mass ratios of elements combining in chemical reactions. He found that elements always combine in fixed whole-number ratios, suggesting matter is made of indivisible atoms. This was purely chemical evidence — no one had yet probed inside an atom."}
            {model === 1 && "Thomson applied high voltage across a glass tube with low-pressure gas. The mysterious 'cathode rays' were deflected by electric and magnetic fields, proving they were negatively charged particles. By measuring e/m, he showed these 'corpuscles' (electrons) were 1800x lighter than hydrogen — the first subatomic particle."}
            {model === 2 && "Rutherford's team fired alpha particles at thin gold foil. Most passed straight through, but about 1 in 8000 bounced back at large angles. Rutherford said it was 'as if you fired a cannon shell at tissue paper and it came back.' This proved atoms have a tiny, dense, positive nucleus."}
            {model === 3 && "Bohr studied the hydrogen emission spectrum — discrete colored lines, not a continuous rainbow. He postulated that electrons orbit only at specific radii where angular momentum is quantized (L = nh/2π). His formula Eₙ = -13.6/n² eV perfectly matched every observed hydrogen spectral line."}
            {model === 4 && "Sommerfeld noticed that hydrogen spectral lines, when examined at high resolution, split into closely spaced doublets (fine structure). He extended Bohr's circular orbits to elliptical ones and added relativistic corrections, introducing the angular momentum quantum number l. This explained the fine splitting but still treated electrons as classical particles on paths."}
            {model === 5 && "In 1927, Davisson and Germer fired electrons at a nickel crystal and observed a diffraction pattern — proving electrons are waves. Schrödinger then formulated his wave equation, replacing orbits with probability clouds. This quantum mechanical model explains everything: multi-electron atoms, chemical bonding, and the behavior of semiconductors."}
          </div>
        </div>

        <div style={{ background: "#eef3ff", border: `1px solid ${T.eo_e}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Key Insight</div>
          <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.5 }}>
            Each model improved on the last. The quantum mechanical model is the correct one,
            but Bohr{"’"}s model gives the right energy levels for hydrogen and builds intuition.
            For materials science, we use QM (DFT) for real calculations.
          </div>
        </div>

        <div style={{ background: `${T.eo_core}11`, border: `1px solid ${T.eo_core}44`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_core, marginBottom: 4 }}>Why Wave-Particle Duality Comes Next {"→"}</div>
          <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.5 }}>
            The quantum model says electrons are <strong>waves</strong>, not particles on orbits.
            But how do we know? The next section shows the experiment that proved it {"—"}
            firing electrons through crystals and watching them <strong>diffract like light waves</strong>.
            This is what forced physicists to abandon orbits and embrace wavefunctions.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


// --- Section 2: AufbauPrincipleSection ---
function AufbauPrincipleSection() {
  const [Z, setZ] = useState(14);
  const [animStep, setAnimStep] = useState(999);
  const [playing, setPlaying] = useState(false);
  const [showRule, setShowRule] = useState(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (playing && animStep < Z) {
      const id = setTimeout(() => setAnimStep(s => s + 1), 350);
      return () => clearTimeout(id);
    }
    if (playing && animStep >= Z) setPlaying(false);
  }, [playing, animStep, Z]);

  const orbitalOrder = [
    { name: "1s", l: 0, boxes: 1, max: 2 },
    { name: "2s", l: 0, boxes: 1, max: 2 },
    { name: "2p", l: 1, boxes: 3, max: 6 },
    { name: "3s", l: 0, boxes: 1, max: 2 },
    { name: "3p", l: 1, boxes: 3, max: 6 },
    { name: "4s", l: 0, boxes: 1, max: 2 },
    { name: "3d", l: 2, boxes: 5, max: 10 },
    { name: "4p", l: 1, boxes: 3, max: 6 },
    { name: "5s", l: 0, boxes: 1, max: 2 },
    { name: "4d", l: 2, boxes: 5, max: 10 },
    { name: "5p", l: 1, boxes: 3, max: 6 },
  ];

  const typeColors = { 0: T.eo_e, 1: T.eo_valence, 2: T.eo_core };

  const elements = ["", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr",
    "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te"];

  const anomalous = { 24: true, 29: true, 41: true, 42: true, 44: true, 45: true, 46: true, 47: true };

  const getConfig = (z) => {
    const fill = [];
    let remaining = z;
    const isAnomalous = anomalous[z];

    if (z === 24) {
      const pre = [2, 2, 6, 2, 6, 1, 5, 0, 0, 0, 0];
      return pre;
    }
    if (z === 29) {
      const pre = [2, 2, 6, 2, 6, 1, 10, 0, 0, 0, 0];
      return pre;
    }
    if (z === 46) {
      return [2, 2, 6, 2, 6, 0, 10, 6, 0, 0, 0];
    }
    if (z === 47) {
      return [2, 2, 6, 2, 6, 1, 10, 6, 0, 0, 0];
    }

    for (let i = 0; i < orbitalOrder.length; i++) {
      const take = Math.min(remaining, orbitalOrder[i].max);
      fill.push(take);
      remaining -= take;
      if (remaining <= 0) break;
    }
    while (fill.length < orbitalOrder.length) fill.push(0);
    return fill;
  };

  const config = getConfig(Z);
  const displayElectrons = animStep >= Z ? Z : animStep;

  const getConfigStr = (z) => {
    const c = getConfig(z);
    const sup = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹", "¹⁰"];
    let s = "";
    for (let i = 0; i < orbitalOrder.length; i++) {
      if (c[i] > 0) s += orbitalOrder[i].name + sup[c[i]] + " ";
    }
    return s.trim();
  };

  const quickElements = [
    { sym: "H", z: 1 }, { sym: "C", z: 6 }, { sym: "Si", z: 14 }, { sym: "Cu", z: 29 },
    { sym: "Zn", z: 30 }, { sym: "Ge", z: 32 }, { sym: "Se", z: 34 }, { sym: "Te", z: 52 },
  ];

  const boxW = 16, boxH = 18, gap2 = 2;

  const renderSVG = () => {
    let eCount = 0;
    const levels = [];
    const yStart = 340;
    const energyGap = 26;

    orbitalOrder.forEach((orb, oi) => {
      const y = yStart - oi * energyGap;
      const totalW = orb.boxes * (boxW + gap2);
      const xStart = 170 - totalW / 2;
      const col = typeColors[orb.l] || T.eo_photon;

      const boxes = [];
      let orbElectrons = config[oi] || 0;

      const arrowsPerBox = [];
      if (orb.boxes > 1 && orbElectrons > 0) {
        const arr = Array(orb.boxes).fill(0);
        let rem = orbElectrons;
        for (let pass = 0; pass < 2 && rem > 0; pass++) {
          for (let b = 0; b < orb.boxes && rem > 0; b++) {
            if (arr[b] < pass + 1) { arr[b]++; rem--; }
          }
        }
        for (let b = 0; b < orb.boxes; b++) arrowsPerBox.push(arr[b]);
      } else {
        arrowsPerBox.push(Math.min(orbElectrons, 2));
      }

      for (let b = 0; b < orb.boxes; b++) {
        const bx = xStart + b * (boxW + gap2);
        const nArrows = arrowsPerBox[b] || 0;

        let showUp = false, showDn = false;
        if (nArrows >= 1 && eCount < displayElectrons) { showUp = true; eCount++; }
        if (nArrows >= 2 && eCount < displayElectrons) { showDn = true; eCount++; }
        const isFlashing = eCount === displayElectrons && playing && (eCount === animStep);

        boxes.push(
          <g key={`${oi}-${b}`}>
            <rect x={bx} y={y} width={boxW} height={boxH} fill={isFlashing ? col : T.panel} stroke={col} strokeWidth={1} rx={2} opacity={isFlashing ? 0.5 + 0.5 * Math.sin(frame * 0.3) : 1} />
            {showUp && <text x={bx + (showDn ? 5 : 8)} y={y + 14} fill={col} fontSize={12} fontFamily="monospace">↑</text>}
            {showDn && <text x={bx + 10} y={y + 14} fill={col} fontSize={12} fontFamily="monospace">↓</text>}
          </g>
        );
      }

      levels.push(
        <g key={oi}>
          {boxes}
          <text x={xStart - 22} y={y + 13} fill={col} fontSize={8} fontFamily="monospace" fontWeight="bold">{orb.name}</text>
        </g>
      );
    });

    const arrowPts = orbitalOrder.map((_, i) => ({ x: 20, y: yStart - i * energyGap + 9 }));

    return (
      <svg viewBox="0 0 340 380" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
        <text x={170} y={15} textAnchor="middle" fill={T.ink} fontSize={11} fontFamily="monospace" fontWeight="bold">
          {elements[Z] || `Z=${Z}`} (Z={Z}) — Orbital Filling
        </text>
        {levels}
        {arrowPts.length > 1 && arrowPts.slice(0, -1).map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={arrowPts[i + 1].x} y2={arrowPts[i + 1].y} stroke={T.dim} strokeWidth={1} strokeDasharray="2,2" markerEnd="url(#arrowhead)" />
        ))}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={T.dim} />
          </marker>
        </defs>
        <rect x={5} y={yStart + 10} width={12} height={12} fill={T.eo_e} rx={2} opacity={0.6} />
        <text x={20} y={yStart + 19} fill={T.muted} fontSize={7} fontFamily="monospace">s</text>
        <rect x={35} y={yStart + 10} width={12} height={12} fill={T.eo_valence} rx={2} opacity={0.6} />
        <text x={50} y={yStart + 19} fill={T.muted} fontSize={7} fontFamily="monospace">p</text>
        <rect x={65} y={yStart + 10} width={12} height={12} fill={T.eo_core} rx={2} opacity={0.6} />
        <text x={80} y={yStart + 19} fill={T.muted} fontSize={7} fontFamily="monospace">d</text>
      </svg>
    );
  };

  const ruleContent = [
    {
      title: "Aufbau Principle",
      text: "Fill lowest energy orbital first. Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p. Note 4s fills before 3d because (n+l) is lower.",
      example: "C (Z=6): 1s² 2s² 2p² — fills 1s, then 2s, then starts 2p.",
    },
    {
      title: "Pauli Exclusion Principle",
      text: "No two electrons can have the same set of 4 quantum numbers (n, l, mₗ, mₛ). Each orbital holds max 2 electrons with opposite spin (↑↓).",
      example: "1s can hold ↑↓ = 2 electrons. Trying a 3rd is forbidden!",
    },
    {
      title: "Hund's Rule",
      text: "In degenerate orbitals (same energy), maximize unpaired spins first. Electrons spread out before pairing up.",
      example: "N (Z=7) 2p³: ↑ ↑ ↑ (correct) NOT ↑↓ ↑ _ (wrong — costs energy to pair).",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Filling electron orbitals is like filling seats in a movie theater. Everyone wants the best seats (lowest energy) first. The front row fills before the back. But there's a twist — each seat can only hold two people (Pauli exclusion), and within each row, people spread out to separate seats before doubling up (Hund's rule). The order isn't always front-to-back either: sometimes the balcony (4s) fills before the back of the main floor (3d) because it's slightly more comfortable (lower energy).
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        {renderSVG()}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>Element: {elements[Z] || `Z=${Z}`} (Z={Z})</div>
          <input type="range" min={1} max={36} value={Math.min(Z, 36)} onChange={e => { setZ(+e.target.value); setAnimStep(999); }}
            style={{ width: "100%", marginBottom: 6 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
            {quickElements.map(el => (
              <button key={el.sym} onClick={() => { setZ(el.z); setAnimStep(999); }} style={{
                padding: "3px 6px", borderRadius: 3, border: `1px solid ${Z === el.z ? T.eo_e : T.border}`,
                background: Z === el.z ? T.eo_e : T.panel, color: Z === el.z ? "#fff" : T.ink,
                fontFamily: "monospace", fontSize: 11, cursor: "pointer",
              }}>
                {el.sym}({el.z})
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.6 }}>
            <strong>Config:</strong> {getConfigStr(Z)}
          </div>
          <button onClick={() => { setAnimStep(0); setPlaying(true); }} style={{
            padding: "5px 12px", borderRadius: 4, border: `1px solid ${T.eo_e}`,
            background: T.eo_e, color: "#fff", fontFamily: "monospace", fontSize: 11, cursor: "pointer",
          }}>
            ▶ Animate Filling
          </button>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {ruleContent.map((r, i) => (
            <button key={i} onClick={() => setShowRule(i)} style={{
              flex: 1, padding: "4px 6px", borderRadius: 4,
              border: `1px solid ${showRule === i ? T.eo_core : T.border}`,
              background: showRule === i ? T.eo_core : T.panel,
              color: showRule === i ? "#fff" : T.ink,
              fontFamily: "monospace", fontSize: 11, cursor: "pointer",
            }}>
              {r.title}
            </button>
          ))}
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4, color: T.eo_core }}>{ruleContent[showRule].title}</div>
          <div style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>{ruleContent[showRule].text}</div>
          <div style={{ fontSize: 10, color: T.eo_valence, fontStyle: "italic" }}>Example: {ruleContent[showRule].example}</div>
        </div>

        {(Z === 29 || Z === 24) && (
          <div style={{ background: "#fff4e5", border: `1px solid ${T.eo_hole}`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_hole, marginBottom: 4 }}>⚠ Anomalous Configuration!</div>
            {Z === 29 && <div style={{ fontSize: 10, lineHeight: 1.5 }}>
              Cu is [Ar] 3d¹⁰ 4s¹ NOT [Ar] 3d⁹ 4s².<br />
              A full d¹⁰ shell is extra stable (exchange energy). One 4s electron is promoted to complete the 3d shell.
              This is why Cu is monovalent (Cu⁺) in kesterites like CZTS.
            </div>}
            {Z === 24 && <div style={{ fontSize: 10, lineHeight: 1.5 }}>
              Cr is [Ar] 3d⁵ 4s¹ NOT [Ar] 3d⁴ 4s².<br />
              A half-filled d⁵ shell is extra stable (maximum exchange energy). One 4s electron is promoted.
            </div>}
          </div>
        )}

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Niels Bohr and Wolfgang Pauli developed the Aufbau ("building up" in German) principle in the 1920s to explain why the periodic table has its characteristic shape. Pauli's exclusion principle (1925) established that no two electrons can share the same quantum state, limiting each orbital to two electrons. Friedrich Hund formulated his rule of maximum multiplicity in 1925, explaining why electrons spread out across orbitals before pairing up. Together, these rules let physicists predict the electron configuration of every element and finally understand chemical behavior from first principles.
          </div>
        </div>

        <div style={{ background: "#eef3ff", border: `1px solid ${T.eo_e}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Key Insight</div>
          <div style={{ fontSize: 10, lineHeight: 1.5 }}>
            Electron configuration determines chemical properties. Cu having 3d¹⁰4s¹ is why it's
            monovalent in kesterites. The Aufbau order (n+l rule) explains why 4s fills before 3d,
            and why the periodic table has the shape it does.
          </div>
        </div>

        <div style={{
          background: `${T.eo_core}11`, border: `1px solid ${T.eo_core}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_core, marginBottom: 4 }}>Coming Next: Periodic Trends {"→"}</div>
          <div style={{ color: T.ink }}>
            Electron configurations explain the periodic table's structure. But they also determine each element's size, how tightly it holds electrons, and how eagerly it grabs more. These periodic trends govern everything from bonding behavior to material properties.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


// --- Section 3: ElectronOriginsZnTeSection ---
function ElectronOriginsZnTeSection() {
  const [stage, setStage] = useState(0);
  const [frame, setFrame] = useState(0);
  const [bonding, setBonding] = useState(false);
  const [bondProgress, setBondProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bonding) {
      const id = setInterval(() => {
        setBondProgress(p => {
          if (p >= 1) { clearInterval(id); setBonding(false); return 1; }
          return p + 0.02;
        });
      }, 50);
      return () => clearInterval(id);
    }
  }, [bonding]);

  const stages = ["Isolated Atoms", "Bond Formation", "Unit Cell", "Supercell", "Band Structure"];
  const t = frame * 0.05;

  const znX = 85, teX = 255, atomY = 120;

  const renderSVG = () => {
    if (stage === 0 || stage === 1) {
      const bp = stage === 1 ? bondProgress : 0;
      const znDraw = lerp(znX, 130, bp);
      const teDraw = lerp(teX, 210, bp);
      const midX = (znDraw + teDraw) / 2;

      const znValenceElectrons = [
        { label: "4s↑", baseX: znX + 30, baseY: atomY - 15 },
        { label: "4s↓", baseX: znX + 30, baseY: atomY + 15 },
      ];
      const teValenceElectrons = [
        { label: "5s↑", baseX: teX - 30, baseY: atomY - 30 },
        { label: "5s↓", baseX: teX - 30, baseY: atomY - 15 },
        { label: "5p↑", baseX: teX - 30, baseY: atomY },
        { label: "5p↑", baseX: teX - 30, baseY: atomY + 15 },
        { label: "5p↑", baseX: teX - 25, baseY: atomY + 30 },
        { label: "5p↓", baseX: teX - 35, baseY: atomY + 30 },
      ];

      return (
        <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
          <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">
            {stage === 0 ? "Isolated Atoms: Zn + Te" : "Bond Formation"}
          </text>

          <circle cx={znDraw} cy={atomY} r={28} fill={T.eo_e} opacity={0.15} stroke={T.eo_e} strokeWidth={2} />
          <text x={znDraw} y={atomY + 4} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace" fontWeight="bold">Zn</text>
          <text x={znDraw} y={atomY + 18} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">30e⁻</text>

          <circle cx={teDraw} cy={atomY} r={32} fill={T.eo_hole} opacity={0.15} stroke={T.eo_hole} strokeWidth={2} />
          <text x={teDraw} y={atomY + 4} textAnchor="middle" fill={T.eo_hole} fontSize={12} fontFamily="monospace" fontWeight="bold">Te</text>
          <text x={teDraw} y={atomY + 18} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">52e⁻</text>

          {znValenceElectrons.map((e, i) => {
            const ex = lerp(e.baseX, midX + (i - 0.5) * 8, bp);
            const ey = lerp(e.baseY, atomY - 50 + i * 12, bp);
            return (
              <g key={`zv${i}`}>
                <circle cx={ex} cy={ey} r={5} fill={T.eo_e} opacity={0.8 + 0.2 * Math.sin(t + i)} />
                <text x={ex} y={ey + 3} textAnchor="middle" fill="#fff" fontSize={9} fontFamily="monospace">e⁻</text>
              </g>
            );
          })}
          {teValenceElectrons.map((e, i) => {
            const ex = lerp(e.baseX, midX + (i - 2.5) * 8, bp);
            const ey = lerp(e.baseY, atomY - 50 + (i + 2) * 12, bp);
            return (
              <g key={`tv${i}`}>
                <circle cx={ex} cy={ey} r={5} fill={T.eo_hole} opacity={0.8 + 0.2 * Math.sin(t + i)} />
                <text x={ex} y={ey + 3} textAnchor="middle" fill="#fff" fontSize={9} fontFamily="monospace">e⁻</text>
              </g>
            );
          })}

          {bp > 0.5 && (
            <g opacity={(bp - 0.5) * 2}>
              <ellipse cx={midX} cy={atomY} rx={35} ry={55} fill="none" stroke={T.eo_valence} strokeWidth={1.5} strokeDasharray="4,3" />
              <text x={midX} y={atomY + 68} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontFamily="monospace" fontWeight="bold">sp³ hybrid</text>
              <text x={midX} y={atomY + 80} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontFamily="monospace">2 + 6 = 8 valence e⁻</text>
            </g>
          )}

          <text x={znDraw} y={200} textAnchor="middle" fill={T.eo_e} fontSize={10} fontFamily="monospace">[Ar] 3d¹⁰ 4s²</text>
          <text x={znDraw} y={212} textAnchor="middle" fill={T.eo_e} fontSize={10} fontFamily="monospace" fontWeight="bold">↑ valence: 4s²</text>
          <text x={znDraw} y={224} textAnchor="middle" fill={T.eo_e} fontSize={10} fontFamily="monospace" fontWeight="bold">2 e⁻</text>

          <text x={teDraw} y={200} textAnchor="middle" fill={T.eo_hole} fontSize={10} fontFamily="monospace">[Kr] 4d¹⁰ 5s² 5p⁴</text>
          <text x={teDraw} y={212} textAnchor="middle" fill={T.eo_hole} fontSize={10} fontFamily="monospace" fontWeight="bold">↑ valence: 5s²5p⁴</text>
          <text x={teDraw} y={224} textAnchor="middle" fill={T.eo_hole} fontSize={10} fontFamily="monospace" fontWeight="bold">6 e⁻</text>

          {stage === 1 && bondProgress < 0.01 && (
            <g onClick={() => setBonding(true)} style={{ cursor: "pointer" }}>
              <rect x={130} y={260} width={80} height={24} rx={4} fill={T.eo_valence} />
              <text x={170} y={276} textAnchor="middle" fill="#fff" fontSize={10} fontFamily="monospace" fontWeight="bold">Form Bond</text>
            </g>
          )}

          {bp >= 1 && (
            <g>
              <rect x={30} y={250} width={280} height={60} rx={6} fill={T.panel} stroke={T.border} strokeWidth={1} />
              <text x={170} y={267} textAnchor="middle" fill={T.ink} fontSize={11} fontFamily="monospace" fontWeight="bold">Band Formation</text>
              <rect x={50} y={275} width={100} height={12} rx={3} fill={T.eo_valence} opacity={0.4} />
              <text x={100} y={284} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontFamily="monospace">Valence Band (4×↑↓=8e⁻)</text>
              <rect x={190} y={275} width={100} height={12} rx={3} fill={T.eo_cond} opacity={0.2} stroke={T.eo_cond} strokeDasharray="3,2" />
              <text x={240} y={284} textAnchor="middle" fill={T.eo_cond} fontSize={10} fontFamily="monospace">Conduction Band (empty)</text>
              <line x1={155} y1={278} x2={185} y2={278} stroke={T.eo_gap} strokeWidth={2} />
              <text x={170} y={300} textAnchor="middle" fill={T.eo_gap} fontSize={10} fontFamily="monospace">Eg = 2.26 eV</text>
            </g>
          )}
        </svg>
      );
    }

    if (stage === 2) {
      const unitSize = 60;
      const ox = 170 - unitSize, oy = 80;
      const atoms = [
        { x: 0, y: 0, type: "Zn" }, { x: unitSize, y: 0, type: "Te" },
        { x: 0, y: unitSize, type: "Te" }, { x: unitSize, y: unitSize, type: "Zn" },
        { x: unitSize / 2, y: unitSize / 2, type: "Zn" }, { x: unitSize * 1.5, y: unitSize / 2, type: "Te" },
        { x: unitSize / 2, y: unitSize * 1.5, type: "Te" }, { x: unitSize * 1.5, y: unitSize * 1.5, type: "Zn" },
      ];
      return (
        <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
          <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">Unit Cell — 4 formula units</text>
          <rect x={ox} y={oy} width={unitSize * 2} height={unitSize * 2} fill="none" stroke={T.ink} strokeWidth={1.5} strokeDasharray="4,4" />
          {atoms.map((a, i) => {
            const col = a.type === "Zn" ? T.eo_e : T.eo_hole;
            const pulse = 1 + 0.04 * Math.sin(t * 2 + i);
            return (
              <g key={i}>
                <circle cx={ox + a.x} cy={oy + a.y} r={14 * pulse} fill={col} opacity={0.2} />
                <circle cx={ox + a.x} cy={oy + a.y} r={10 * pulse} fill={col} opacity={0.6} />
                <text x={ox + a.x} y={oy + a.y + 3.5} textAnchor="middle" fill="#fff" fontSize={10} fontFamily="monospace" fontWeight="bold">{a.type}</text>
              </g>
            );
          })}
          <text x={170} y={230} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">4 Zn + 4 Te = 4 formula units</text>
          <text x={170} y={248} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontFamily="monospace">4 × 8 = 32 valence electrons</text>
          <text x={170} y={268} textAnchor="middle" fill={T.muted} fontSize={11} fontFamily="monospace">Each formula unit contributes 8 e⁻ to bands</text>
          <text x={170} y={288} textAnchor="middle" fill={T.eo_e} fontSize={10} fontFamily="monospace">Zn: 4×2=8 e⁻ | Te: 4×6=24 e⁻ | Total=32</text>
        </svg>
      );
    }

    if (stage === 3) {
      const dots = [];
      for (let ix = 0; ix < 4; ix++) {
        for (let iy = 0; iy < 4; iy++) {
          const bx = 30 + ix * 72;
          const by = 30 + iy * 55;
          const isZn = (ix + iy) % 2 === 0;
          dots.push({ x: bx, y: by, type: isZn ? "Zn" : "Te" });
          dots.push({ x: bx + 36, y: by + 27, type: isZn ? "Te" : "Zn" });
        }
      }
      return (
        <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
          <text x={170} y={15} textAnchor="middle" fill={T.ink} fontSize={11} fontFamily="monospace" fontWeight="bold">2×2×2 Supercell — 64 atoms</text>
          <rect x={10} y={15} width={320} height={245} fill="none" stroke={T.ink} strokeWidth={1.5} strokeDasharray="6,4" rx={4} />
          <text x={24} y={27} fill={T.muted} fontSize={8} fontFamily="monospace">2×2×2</text>
          {dots.slice(0, 32).map((d, i) => {
            const col = d.type === "Zn" ? T.eo_e : T.eo_hole;
            const o = 0.5 + 0.3 * Math.sin(t + i * 0.5);
            return <circle key={i} cx={d.x} cy={d.y + 10} r={5} fill={col} opacity={o} />;
          })}
          <text x={170} y={270} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">32 Zn + 32 Te = 64 atoms</text>
          <text x={170} y={288} textAnchor="middle" fill={T.eo_valence} fontSize={10} fontFamily="monospace">32×2 + 32×6 = 256 valence e⁻</text>
          <text x={170} y={306} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">Total valence electrons = 256</text>
        </svg>
      );
    }

    if (stage === 4) {
      const bandY = 140;
      const vbTop = bandY + 10;
      const cbBot = bandY - 10;
      const kPoints = 12;
      return (
        <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 340 }}>
          <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">Band Structure from Electrons</text>
          <line x1={40} y1={30} x2={40} y2={280} stroke={T.ink} strokeWidth={1} />
          <text x={15} y={145} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace" transform="rotate(-90,15,145)">Energy</text>
          <line x1={40} y1={280} x2={310} y2={280} stroke={T.ink} strokeWidth={1} />

          {[...Array(4)].map((_, band) => {
            const pts = [];
            for (let k = 0; k <= kPoints; k++) {
              const kx = 50 + (k / kPoints) * 240;
              const ky = vbTop + 20 + band * 22 + Math.sin((k / kPoints) * Math.PI) * 15;
              pts.push(`${k === 0 ? "M" : "L"}${kx},${ky}`);
            }
            return <path key={`vb${band}`} d={pts.join(" ")} fill="none" stroke={T.eo_valence} strokeWidth={1.5} opacity={0.7} />;
          })}

          {[...Array(3)].map((_, band) => {
            const pts = [];
            for (let k = 0; k <= kPoints; k++) {
              const kx = 50 + (k / kPoints) * 240;
              const ky = cbBot - 10 - band * 22 - Math.sin((k / kPoints) * Math.PI) * 12;
              pts.push(`${k === 0 ? "M" : "L"}${kx},${ky}`);
            }
            return <path key={`cb${band}`} d={pts.join(" ")} fill="none" stroke={T.eo_cond} strokeWidth={1.5} opacity={0.5} />;
          })}

          <rect x={50} y={vbTop} width={240} height={90} fill={T.eo_valence} opacity={0.06} />
          <text x={300} y={vbTop + 50} textAnchor="end" fill={T.eo_valence} fontSize={10} fontFamily="monospace">VB (filled)</text>
          <rect x={50} y={cbBot - 80} width={240} height={80} fill={T.eo_cond} opacity={0.04} />
          <text x={300} y={cbBot - 40} textAnchor="end" fill={T.eo_cond} fontSize={10} fontFamily="monospace">CB (empty)</text>

          <line x1={160} y1={vbTop} x2={160} y2={cbBot} stroke={T.eo_gap} strokeWidth={2} />
          <text x={170} y={bandY + 3} textAnchor="start" fill={T.eo_gap} fontSize={11} fontFamily="monospace" fontWeight="bold">Eg</text>

          {[...Array(8)].map((_, i) => {
            const eky = vbTop + 20 + Math.sin(t + i) * 8;
            const ekx = 70 + i * 28 + Math.sin(t * 0.5 + i * 2) * 5;
            return <circle key={i} cx={ekx} cy={eky} r={2.5} fill={T.eo_e} opacity={0.6 + 0.3 * Math.sin(t + i)} />;
          })}

          <text x={170} y={295} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">
            Each dot = electron from Zn or Te atom
          </text>
          <text x={170} y={310} textAnchor="middle" fill={T.ink} fontSize={10} fontFamily="monospace" fontWeight="bold">
            ALL band electrons came from atoms!
          </text>
        </svg>
      );
    }

    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Think of Zn and Te atoms as two people bringing ingredients to a potluck. Zinc brings 2 outer electrons (from its 4s orbital), and Tellurium brings 6 (from 5s and 5p). When they combine in a crystal, they pool their electrons into shared 'community bowls' — the valence and conduction bands. The valence band is the main dish everyone eats from (full), and the conduction band is dessert that nobody has reached yet (empty).
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        {renderSVG()}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {stages.map((s, i) => (
            <button key={i} onClick={() => { setStage(i); if (i === 1) { setBondProgress(0); setBonding(false); } }} style={{
              padding: "4px 8px", borderRadius: 4, border: `1px solid ${stage === i ? T.eo_valence : T.border}`,
              background: stage === i ? T.eo_valence : T.panel, color: stage === i ? "#fff" : T.ink,
              fontFamily: "monospace", fontSize: 9, cursor: "pointer",
            }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>Electron Count at Each Stage</div>
          <div style={{ fontSize: 9, lineHeight: 1.7 }}>
            <div style={{ color: T.eo_e }}>Zn: [Ar] 3d¹⁰ <strong>4s²</strong> → 2 valence e⁻</div>
            <div style={{ color: T.eo_hole }}>Te: [Kr] 4d¹⁰ <strong>5s² 5p⁴</strong> → 6 valence e⁻</div>
            <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4, paddingTop: 4 }}>
              <strong>1 pair:</strong> 2 + 6 = <strong>8</strong> valence e⁻<br />
              <strong>4 pairs (unit cell):</strong> 4 × 8 = <strong>32</strong> e⁻<br />
              <strong>2×2×2 supercell:</strong> 32 × 8 = <strong>256</strong> e⁻<br />
            </div>
          </div>
        </div>

        <div style={{ background: "#eef3ff", border: `1px solid ${T.eo_e}`, borderRadius: 6, padding: 10 }}>
          <div style={{ fontSize: 10, fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Key Insight</div>
          <div style={{ fontSize: 9, lineHeight: 1.5 }}>
            Every electron in the band structure came from atoms. Zn donates 2 valence electrons,
            Te donates 6. Together they fill 4 bonding orbitals per formula unit, creating the valence band.
            The antibonding orbitals remain empty — that is the conduction band.
          </div>
        </div>

        <div style={{
          background: `${T.eo_valence}11`, border: `1px solid ${T.eo_valence}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_valence, marginBottom: 4 }}>Coming Next: Molecular Orbitals {"→"}</div>
          <div style={{ color: T.ink }}>
            Individual atomic orbitals combine when atoms bond. Molecular orbital theory shows how atomic orbitals merge into bonding and antibonding states — the foundation for understanding electronic structure in solids.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// Section 1: Wave-Particle Duality
// ─────────────────────────────────────────────

function WaveDualitySection() {
  const [frame, setFrame] = useState(0);
  const [mode, setMode] = useState("quantum");
  const [hits, setHits] = useState([]);
  const [massIdx, setMassIdx] = useState(0);

  const masses = [
    { label: "Electron", m: 9.109e-31, v: 1e6 },
    { label: "Proton",   m: 1.673e-27, v: 1e4 },
    { label: "Baseball", m: 0.145,     v: 40  },
  ];
  const h = 6.626e-34;
  const cur = masses[massIdx];
  const lambda = h / (cur.m * cur.v);
  const fmtLambda = (l) => {
    if (l > 1e-3)  return l.toExponential(2) + " m";
    if (l > 1e-9)  return (l * 1e9).toFixed(3) + " nm";
    if (l > 1e-12) return (l * 1e12).toFixed(3) + " pm";
    if (l > 1e-15) return (l * 1e15).toFixed(3) + " fm";
    return l.toExponential(2) + " m";
  };

  // Fixed SVG size — no responsive viewBox to avoid resize crashes
  const W = 400, H = 200;
  const srcX = 22, srcY = 100;
  const barrX = 130;
  const scrX = 368;
  const s1Y = 82, s2Y = 118; // slit centres

  // Precompute interference CDF once for O(log n) sampling — avoids 2000-iter rejection loop
  const { cdf, yVals } = useMemo(() => {
    const ys = [], ps = [];
    for (let i = 0; i <= 180; i++) {
      const y = 15 + i;
      const d1 = Math.hypot(scrX - barrX, y - s1Y);
      const d2 = Math.hypot(scrX - barrX, y - s2Y);
      const phase = (d1 - d2) / 10 * Math.PI;
      ys.push(y);
      ps.push(Math.pow(Math.cos(phase), 2));
    }
    const total = ps.reduce((a, b) => a + b, 0);
    const cdf = [];
    let sum = 0;
    for (const p of ps) { sum += p / total; cdf.push(sum); }
    return { cdf, yVals: ys };
  }, []);

  const sampleY = () => {
    const r = Math.random();
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < r) lo = mid + 1; else hi = mid; }
    return yVals[lo] + (Math.random() - 0.5) * 1.5;
  };

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 60);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setHits([]); }, [mode]);

  useEffect(() => {
    if (mode === "wave") return;
    const id = setInterval(() => {
      setHits(prev => {
        if (prev.length >= 250) return prev.slice(-200);
        const y = mode === "quantum"
          ? sampleY()
          : srcY + (Math.random() + Math.random() - 1) * 30;
        return [...prev, { y, x: scrX + 1 + (Math.random() - 0.5) * 4 }];
      });
    }, 110);
    return () => clearInterval(id);
  }, [mode]);

  const eventPeriod = 60;
  const evPhase = (frame % eventPeriod) / eventPeriod;

  const renderSVG = () => {
    const els = [];

    // Barrier walls
    els.push(
      <rect key="b1" x={barrX - 4} y={0}          width={8} height={s1Y - 8}        fill="#334155" />,
      <rect key="b2" x={barrX - 4} y={s1Y + 8}    width={8} height={s2Y - s1Y - 16} fill="#334155" />,
      <rect key="b3" x={barrX - 4} y={s2Y + 8}    width={8} height={H - s2Y - 8}    fill="#334155" />,
      <text key="blbl" x={barrX} y={16} textAnchor="middle" fontSize={8} fill="#64748b">barrier</text>,
      <text key="s1l"  x={barrX + 14} y={s1Y + 3}  fontSize={7} fill="#94a3b8">slit 1</text>,
      <text key="s2l"  x={barrX + 14} y={s2Y + 3}  fontSize={7} fill="#94a3b8">slit 2</text>,
    );

    // Screen + label
    els.push(
      <text key="scrlbl" x={scrX + 5} y={16} textAnchor="middle" fontSize={8} fill="#64748b">screen</text>,
    );

    const interfProb = (y) => {
      const d1 = Math.hypot(scrX - barrX, y - s1Y);
      const d2 = Math.hypot(scrX - barrX, y - s2Y);
      return Math.pow(Math.cos((d1 - d2) / 10 * Math.PI), 2);
    };

    if (mode === "wave") {
      // Continuous interference pattern on screen
      for (let y = 10; y < 190; y += 2) {
        const p = interfProb(y);
        els.push(<rect key={`si${y}`} x={scrX} y={y} width={10} height={2} fill="#3b82f6" opacity={p * 0.95} />);
      }
      // Incoming circular wavefronts from source
      const t = frame * 0.07;
      for (let i = 0; i < 5; i++) {
        const r = ((t * 28 + i * 22) % 115);
        if (r > 3 && r < 112) {
          els.push(<circle key={`iw${i}`} cx={srcX} cy={srcY} r={r} fill="none" stroke="#3b82f6" strokeWidth={1.3} opacity={(1 - r / 112) * 0.7} clipPath="url(#wdLeft)" />);
        }
      }
      // Diffracted wavefronts from each slit
      [s1Y, s2Y].forEach((sy, si) => {
        for (let i = 0; i < 6; i++) {
          const r = ((t * 28 + i * 18) % 250);
          if (r > 3 && r < 245) {
            els.push(<circle key={`dw${si}${i}`} cx={barrX} cy={sy} r={r} fill="none"
              stroke={si === 0 ? "#3b82f6" : "#06b6d4"} strokeWidth={1}
              opacity={(1 - r / 245) * 0.4} clipPath="url(#wdRight)" />);
          }
        }
      });
    } else {
      // Screen background
      els.push(<rect key="scrbg" x={scrX} y={10} width={10} height={180} fill="#1e293b" stroke="#334155" strokeWidth={1} />);
      // Accumulated dots
      hits.forEach((h, i) => {
        els.push(<circle key={`h${i}`} cx={h.x} cy={h.y} r={1.5} fill="#3b82f6" opacity={0.75} />);
      });

      if (mode === "quantum") {
        // Ghost electron approaching barrier
        if (evPhase < 0.48) {
          const gx = srcX + (evPhase / 0.48) * (barrX - srcX - 14);
          const gy = srcY;
          els.push(
            <circle key="glow2" cx={gx} cy={gy} r={18} fill="#3b82f6" opacity={0.05} />,
            <circle key="glow1" cx={gx} cy={gy} r={10} fill="#3b82f6" opacity={0.12} />,
            <circle key="ghost" cx={gx} cy={gy} r={5}  fill="#3b82f6" opacity={0.45} />,
            <text key="psi" x={gx} y={gy - 14} textAnchor="middle" fontSize={9} fill="#3b82f6" opacity={0.8}>ψ</text>,
          );
          // Trail
          for (let k = 1; k <= 5; k++) {
            const tx = gx - k * 9;
            if (tx > srcX) {
              els.push(<circle key={`tr${k}`} cx={tx} cy={gy} r={4 - k * 0.6} fill="#3b82f6" opacity={0.12 - k * 0.02} />);
            }
          }
        } else {
          // Ghost wave expanding from slits
          const wp = (evPhase - 0.48) / 0.52;
          const r = wp * (scrX - barrX + 30);
          [s1Y, s2Y].forEach((sy, si) => {
            for (let k = 0; k < 3; k++) {
              const rk = Math.max(0, r - k * 16);
              if (rk > 0) {
                els.push(<circle key={`qw${si}k${k}`} cx={barrX} cy={sy} r={rk} fill="none"
                  stroke="#3b82f6" strokeWidth={1.5 - k * 0.4}
                  opacity={(1 - wp) * (0.6 - k * 0.18)} clipPath="url(#wdRight)" />);
              }
            }
          });
          // Collapse flash near screen
          if (wp > 0.82) {
            const flash = (wp - 0.82) / 0.18;
            for (let y = 10; y < 190; y += 4) {
              const p = interfProb(y);
              els.push(<rect key={`pf${y}`} x={scrX - 2} y={y} width={14} height={4} fill="#3b82f6" opacity={p * flash * 0.4} />);
            }
          }
        }
      } else {
        // Classical: single ball going straight through slit 1 only
        const px = srcX + evPhase * (scrX - srcX);
        const py = s1Y;
        if (px < scrX) {
          els.push(
            <circle key="ball" cx={px} cy={py} r={5} fill="#f59e0b" />,
            <circle key="ballg" cx={px} cy={py} r={9} fill="#f59e0b" opacity={0.2} />,
          );
        }
      }
    }

    // Source
    els.push(
      <circle key="src"    cx={srcX} cy={srcY} r={9} fill="#3b82f6" opacity={0.85} />,
      <text   key="srclbl" x={srcX}  y={srcY + 20} textAnchor="middle" fontSize={8} fill="#64748b">gun</text>,
    );

    return els;
  };

  const MODES = [
    { id: "classical", label: "1. Classical Bullet",        color: "#f59e0b" },
    { id: "wave",      label: "2. Continuous Wave",         color: "#3b82f6" },
    { id: "quantum",   label: "3. One Electron at a Time",  color: "#06b6d4" },
  ];

  const STEPS = {
    classical: [
      { head: "One ball, one slit",       body: "A classical bullet goes through exactly one slit. You can always say which slit — in principle and in practice." },
      { head: "Hits screen as a dot",     body: "Each bullet lands in one small spot near the slit it passed through. No spreading, no bands." },
      { head: "Two blobs, no bands",      body: "Send thousands of bullets → two piles of dots, one behind each slit. Completely predictable. This is classical physics." },
    ],
    wave: [
      { head: "Wave hits the whole barrier at once", body: "A water wave (or light wave) doesn't \"choose\" a slit — it spreads and hits both slits simultaneously." },
      { head: "Two new waves emerge",     body: "Each slit acts as a new wave source. Circular waves radiate from slit 1 and slit 2 independently." },
      { head: "The waves overlap and interfere", body: "Where two peaks meet → bright band (constructive). Where a peak meets a trough → dark band (destructive). This is normal wave physics." },
      { head: "Screen shows bands",       body: "The pattern of bright and dark stripes is the interference pattern. Completely expected for waves." },
    ],
    quantum: [
      { head: "Fire ONE electron",        body: "We send electrons one at a time, with a long gap between each. No two electrons are in the apparatus at the same time." },
      { head: "Each lands as ONE dot",    body: "Every electron hits the screen at a single point — exactly like a bullet. It never smears out visibly." },
      { head: "But thousands of dots…",   body: "After many electrons, the dots build the same interference pattern as the wave experiment. Each electron \"knew\" about both slits." },
      { head: "The electron went through BOTH slits", body: "Before measurement, the electron exists as a wavefunction ψ spread through space. ψ split at the barrier, went through both slits, and interfered with itself on the far side." },
      { head: "|ψ|² = probability",       body: "The wave amplitude squared gives the probability of landing at each point. High |ψ|² → bright band. Zero |ψ|² → dark band. The electron is forced to land where its own wave says is likely." },
      { head: "Measurement collapses ψ",  body: "The instant the electron hits the screen, the wavefunction collapses to one point. This is not ignorance — quantum mechanics says the position genuinely did not exist until then." },
    ],
  };

  const col = MODES.find(m => m.id === mode).color;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Imagine throwing a ball at a wall with two slits. You'd expect it to go through one slit or the other, leaving two piles on the other side. But electrons are bizarre — they act like waves passing through both slits simultaneously, creating an interference pattern of many stripes. It's as if each electron 'explores' all possible paths at once. Only when you watch which slit it goes through does it behave like a particle. This wave-particle duality is the foundation of quantum mechanics.
        </AnalogyBox>

      {/* Mode tabs */}
      <div style={{ display: "flex", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: "10px 6px", border: "none", cursor: "pointer",
            background: mode === m.id ? m.color + "18" : "transparent",
            borderBottom: `3px solid ${mode === m.id ? m.color : "transparent"}`,
            fontFamily: "inherit", fontSize: 11, fontWeight: mode === m.id ? 700 : 400,
            color: mode === m.id ? m.color : T.muted,
          }}>{m.label}</button>
        ))}
      </div>

      {/* Animation */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: "#0f172a", width: "100%", maxWidth: W }}>
          <defs>
            <clipPath id="wdLeft"><rect x={0} y={0} width={barrX} height={H} /></clipPath>
            <clipPath id="wdRight"><rect x={barrX} y={0} width={W - barrX} height={H} /></clipPath>
          </defs>
          {renderSVG()}
        </svg>

        {mode !== "wave" && (
          <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.border}`, fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: T.muted }}>Electrons on screen: <span style={{ color: col, fontWeight: 700 }}>{hits.length}</span></span>
            <span style={{ color: hits.length < 30 ? "#f59e0b" : hits.length < 100 ? "#06b6d4" : "#22c55e", fontSize: 10 }}>
              {hits.length < 30 ? "Firing… wait for pattern" : hits.length < 100 ? "Pattern forming…" : "Interference pattern visible!"}
            </span>
          </div>
        )}
      </div>

      {/* Step-by-step explanation */}
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: col, marginBottom: 14 }}>
          {mode === "classical" && "Result: two blobs — no interference"}
          {mode === "wave"      && "Result: interference bands — expected for waves"}
          {mode === "quantum"   && "Result: interference bands — from single electrons!"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS[mode].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: col + "20", border: `1.5px solid ${col}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: col,
              }}>{i + 1}</div>
              <div style={{ paddingTop: 2 }}>
                <span style={{ fontWeight: 700, color: T.ink, fontSize: 12 }}>{s.head}: </span>
                <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{s.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key insight — quantum only */}
      {mode === "quantum" && (
        <div style={{ background: "#06b6d418", border: "1.5px solid #06b6d433", borderLeft: "4px solid #06b6d4", borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#06b6d4", marginBottom: 8 }}>Why this matters for materials science</div>
          <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.75 }}>
            Every electron in a CdTe crystal behaves this way. Its wavefunction ψ is not localised to one atom — it spreads
            over the entire crystal lattice. When Bloch solved the Schrödinger equation for periodic crystals, he found that
            these spreading wavefunctions form <strong>energy bands</strong> — the conduction band and valence band that determine
            whether CdTe absorbs light and conducts electricity. The "weirdness" of quantum mechanics is precisely why solar
            cells work.
          </div>
        </div>
      )}

      {/* de Broglie section */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: T.eo_e }}>de Broglie Wavelength λ = h / mv</div>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>Select a particle:</div>
          <input type="range" min={0} max={2} step={1} value={massIdx}
            onChange={e => setMassIdx(Number(e.target.value))} style={{ width: "100%", accentColor: T.eo_e }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.muted, marginTop: 2 }}>
            <span>Electron</span><span>Proton</span><span>Baseball</span>
          </div>
          <div style={{ marginTop: 10, background: T.surface, padding: 10, borderRadius: 6, fontSize: 12 }}>
            <div><strong>{cur.label}</strong> · {cur.m.toExponential(2)} kg · {cur.v.toExponential(1)} m/s</div>
            <div style={{ marginTop: 6, fontSize: 14, color: T.eo_e }}>
              <strong>λ = {fmtLambda(lambda)}</strong>
            </div>
            {massIdx === 0 && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>≈ atomic spacing in CdTe → wave effects are huge</div>}
            {massIdx === 1 && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>much smaller, but still quantum</div>}
            {massIdx === 2 && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>far too tiny to ever observe — classical world</div>}
          </div>
        </div>
        <div style={{ flex: 2, minWidth: 280, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: T.eo_core }}>The Davisson–Germer Experiment (1927)</div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
            Clinton Davisson and Lester Germer at Bell Labs fired electrons at a nickel crystal and measured scattered
            intensity at different angles. They observed a sharp diffraction peak at 50° — identical to what X-rays produce —
            exactly matching de Broglie's predicted wavelength λ = h/mv.<br /><br />
            This was the first direct proof that particles have wavelengths. It earned Davisson the 1937 Nobel Prize and
            forced physicists to accept that electrons are quantum objects — neither purely wave nor purely particle — described
            by a wavefunction ψ whose square |ψ|² gives probabilities.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 2: Schr{"ö"}dinger Equation
// ─────────────────────────────────────────────

function SchrodingerSection() {
  const [frame, setFrame] = useState(0);
  const [nQ, setNQ] = useState(1); // quantum number 1-4
  const [showPsi2, setShowPsi2] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  // Hydrogen atom energy levels: E_n = -13.6/n² eV
  const energyN = (n) => -13.6 / (n * n);

  const cx = 160, cy = 160;
  const phase = frame * 0.04;

  // Radial probability density R²(r)·r² for hydrogen orbitals (normalized to peak ~1)
  const radialProbRaw = (n, r) => {
    const a0 = 1;
    const rn = r / (n * a0);
    if (n === 1) return 4 * rn * rn * Math.exp(-2 * rn); // 1s
    if (n === 2) return (rn * rn / 8) * Math.pow(2 - rn, 2) * Math.exp(-rn); // 2s
    if (n === 3) return (rn * rn / 729) * Math.pow(6 - 6 * rn + rn * rn, 2) * Math.exp(-2 * rn / 3); // 3s
    return (rn * rn / (n * n * 4)) * Math.exp(-2 * rn / n); // approximate
  };
  // Find peak value for current n to normalize
  const peakProbs = { 1: 0.54, 2: 0.19, 3: 0.41, 4: 0.034 };
  const peakP = peakProbs[nQ] || 0.05;
  const radialProb = (n, r) => radialProbRaw(n, r) / peakP;

  // Per-orbital data: rMax (code units), peak r (code units), peak r (pm), nodes
  const orbData = [
    { rMax: 6, peakR: 1, peakPm: 53, nodes: [], name: "1s", desc: "Single peak — electron most likely at 1 Bohr radius from nucleus." },
    { rMax: 16, peakR: 10.47, peakPm: 555, nodes: [{ r: 4, pm: 212 }], name: "2s", desc: "Two peaks separated by a node (zero probability) at 212 pm. Outer peak dominates." },
    { rMax: 50, peakR: 34.4, peakPm: 1825, nodes: [{ r: 3.8, pm: 202 }, { r: 14.2, pm: 752 }], name: "3s", desc: "Three peaks, two nodes. Electron mostly found far from nucleus — the outermost peak is largest." },
    { rMax: 80, peakR: 56, peakPm: 2968, nodes: [{ r: 4, pm: 212 }, { r: 16, pm: 848 }, { r: 36, pm: 1908 }], name: "4s", desc: "Four peaks, three nodes. Almost free — a single photon could ionize this electron." },
  ];
  const orb = orbData[nQ - 1];

  // Draw electron cloud as dots based on probability
  const cloudDots = [];
  const rMax = orb.rMax;
  const nDots = 400 + nQ * 100;
  for (let i = 0; i < nDots; i++) {
    const angle = (i * 2.399 + frame * 0.01) % (Math.PI * 2);
    const rFrac = ((i * 7 + 13) % (nDots)) / nDots;
    const r = rFrac * rMax;
    const prob = radialProb(nQ, r);
    if (prob > 0.15 * Math.random()) {
      const px = cx + Math.cos(angle) * (r / rMax) * 130;
      const py = cy + Math.sin(angle) * (r / rMax) * 130;
      if (px > 10 && px < 310 && py > 10 && py < 310) {
        cloudDots.push({ x: px, y: py, opacity: Math.min(prob * 0.6, 0.8) });
      }
    }
  }

  // Radial wavefunction curve
  const radialCurve = [];
  for (let i = 0; i <= 80; i++) {
    const r = (i / 80) * rMax;
    const prob = radialProb(nQ, r);
    const x = 40 + (i / 80) * 240;
    const y = 290 - prob * 80;
    radialCurve.push(`${i === 0 ? "M" : "L"}${x},${Math.max(205, y)}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          The Schr&ouml;dinger equation is like a recipe book for quantum mechanics. Give it the 'kitchen setup' (potential energy landscape) and it tells you every possible 'dish' (wavefunction) the electron can make, along with its 'calorie count' (energy). The wavefunction isn't the electron itself — it's a probability cloud showing where the electron is likely to be found, like a heat map of a cat's favorite napping spots in your house.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* LEFT: SVG */}
      <div style={{ flexShrink: 0 }}>
        <svg viewBox="0 0 320 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 320 }}>
          <text x={160} y={16} textAnchor="middle" fontSize={11} fill={T.ink} fontWeight="bold">
            Hydrogen Atom {"—"} {orb.name} orbital
          </text>

          {/* Nucleus */}
          <circle cx={cx} cy={cy} r={5} fill={T.eo_hole} />
          <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={6} fontWeight="bold">H{"⁺"}</text>

          {/* Orbital shells (dashed circles for reference) */}
          {[1, 2, 3, 4].map(n => {
            const r = (n / 4) * 120;
            return <circle key={n} cx={cx} cy={cy} r={r} fill="none" stroke={n === nQ ? T.eo_valence : T.dim} strokeWidth={n === nQ ? 1.5 : 0.5} strokeDasharray={n === nQ ? "none" : "3,4"} opacity={n === nQ ? 0.6 : 0.3} />;
          })}

          {/* Electron probability cloud */}
          {showPsi2 && cloudDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={1.5} fill={T.eo_valence} opacity={d.opacity} />
          ))}

          {/* Wavefunction (radial) */}
          {!showPsi2 && (
            <g>
              <line x1={40} y1={290} x2={280} y2={290} stroke={T.dim} strokeWidth={0.5} />
              <text x={280} y={300} fontSize={8} fill={T.muted}>r</text>
              <text x={25} y={250} fontSize={8} fill={T.muted} transform="rotate(-90,25,250)">R(r){"²"}{"·"}r{"²"}</text>
              <path d={radialCurve.join(" ")} fill="none" stroke={T.eo_valence} strokeWidth={2} />
              {/* Most probable radius marker (at actual peak) */}
              <line x1={40 + (orb.peakR / rMax) * 240} y1={195} x2={40 + (orb.peakR / rMax) * 240} y2={295} stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />
              <text x={40 + (orb.peakR / rMax) * 240} y={193} textAnchor="middle" fontSize={7} fill={T.eo_gap}>r{"ₘₐₓ"} = {orb.peakPm} pm</text>
              {/* Node markers (where probability = 0) */}
              {orb.nodes.map((nd, ni) => (
                <g key={ni}>
                  <line x1={40 + (nd.r / rMax) * 240} y1={280} x2={40 + (nd.r / rMax) * 240} y2={295} stroke={T.eo_hole} strokeWidth={1} opacity={0.7} />
                  <text x={40 + (nd.r / rMax) * 240} y={278} textAnchor="middle" fontSize={6} fill={T.eo_hole}>node</text>
                </g>
              ))}
            </g>
          )}

          {/* Energy level diagram (right side) */}
          <rect x={255} y={22} width={60} height={200} rx={4} fill={T.bg} stroke={T.border} strokeWidth={0.5} />
          <text x={285} y={34} textAnchor="middle" fontSize={7} fill={T.muted}>Energy (eV)</text>
          {[1, 2, 3, 4].map(n => {
            const eN = energyN(n);
            const yE = 42 + (1 - (eN + 13.6) / 13.6) * 160;
            const isSel = n === nQ;
            return (
              <g key={n} onClick={() => setNQ(n)} style={{ cursor: "pointer" }}>
                <line x1={261} y1={yE} x2={305} y2={yE} stroke={isSel ? T.eo_valence : T.dim} strokeWidth={isSel ? 2 : 1} />
                <text x={309} y={yE + 3} fontSize={7} fill={isSel ? T.eo_valence : T.muted}>n={n}</text>
                <text x={259} y={yE + 3} textAnchor="end" fontSize={6} fill={isSel ? T.eo_valence : T.muted}>{eN.toFixed(1)}</text>
              </g>
            );
          })}
          <text x={259} y={213} textAnchor="end" fontSize={7} fill={T.muted}>0 eV</text>
          <line x1={261} y1={208} x2={305} y2={208} stroke={T.dim} strokeWidth={0.5} strokeDasharray="2,2" />
          <text x={285} y={218} textAnchor="middle" fontSize={7} fill={T.eo_gap}>free</text>
        </svg>

        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={() => setShowPsi2(!showPsi2)}
            style={{
              padding: "5px 12px", fontFamily: "monospace", fontSize: 11,
              background: showPsi2 ? T.eo_valence : T.panel,
              color: showPsi2 ? "#fff" : T.ink,
              border: `1px solid ${T.eo_valence}`, borderRadius: 4, cursor: "pointer",
            }}
          >
            {showPsi2 ? "|ψ|² cloud" : "R(r) curve"}
          </button>
        </div>
      </div>

      {/* RIGHT: Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10, color: T.eo_valence }}>
            The Schr{"ö"}dinger Equation
          </div>
          <div style={{ fontSize: 13, color: T.eo_valence, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
            {"Ĥ"}{"ψ"} = E{"ψ"}
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 6 }}>
            <strong>{"Ĥ"}</strong> (H-hat) is the <strong>Hamiltonian operator</strong> {"—"} it represents the total energy of the system (kinetic + potential energy).
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 6 }}>
            <strong>{"ψ"}</strong> (psi) is the <strong>wavefunction</strong> {"—"} it describes the quantum state of the electron. |{"ψ"}|{"²"} gives the probability of finding the electron at each position.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8, marginBottom: 6 }}>
            <strong>E</strong> is the <strong>energy eigenvalue</strong> {"—"} only specific discrete energy values are allowed. These are the "energy levels."
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8, borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 6 }}>
            <strong>For hydrogen:</strong> E{"ₙ"} = {"-"}13.6/n{"²"} eV {"—"} the electron is bound by the Coulomb potential of the proton.
            Higher n = larger orbit = less tightly bound. At n={"∞"}, E=0 and the electron is free.
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8, marginTop: 4 }}>
            <strong>Most probable radius:</strong> The electron is not at a fixed distance {"—"} it forms a probability cloud.
            The R(r){"²"}{"·"}r{"²"} curve shows where you are most likely to find the electron at each distance from the nucleus.
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Select energy level (click or use buttons):</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} onClick={() => setNQ(n)} style={{
                flex: 1, height: 32, fontFamily: "monospace", fontSize: 12,
                background: n === nQ ? T.eo_valence : T.surface,
                color: n === nQ ? "#fff" : T.ink,
                border: `1px solid ${n === nQ ? T.eo_valence : T.border}`,
                borderRadius: 4, cursor: "pointer",
              }}>n={n}</button>
            ))}
          </div>
          <div style={{ background: T.surface, padding: 10, borderRadius: 6, fontSize: 12 }}>
            <div><strong>E{"ₙ"}</strong> = {energyN(nQ).toFixed(2)} eV</div>
            <div><strong>Most probable r</strong> = {orb.peakPm} pm</div>
            <div><strong>Nodes</strong> = {orb.nodes.length} (n{"−"}1 for s orbitals)</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{orb.desc}</div>
          </div>

          <div style={{ background: T.bg, padding: 10, borderRadius: 6, fontSize: 11, marginTop: 8, lineHeight: 1.7, color: T.ink }}>
            <div style={{ fontWeight: 600, color: T.eo_core, marginBottom: 4 }}>How to read the R(r){"²"}{"·"}r{"²"} curve</div>
            <div>This curve is the <strong>radial probability density</strong> {"—"} the chance of finding the electron at distance r from the nucleus.</div>
            <div style={{ marginTop: 4 }}><span style={{ color: T.eo_gap }}>{"●"}</span> <strong>Peaks</strong> = most likely distances (marked with dashed line)</div>
            <div><span style={{ color: T.eo_hole }}>{"●"}</span> <strong>Nodes</strong> = zero probability {"—"} the wavefunction crosses zero here. An ns orbital has (n{"−"}1) nodes.</div>
            <div style={{ marginTop: 4, color: T.muted }}>For n=1: one peak, no nodes. For n=2: two peaks separated by 1 node at 212 pm. The electron can be found on either side of the node but never at the node itself.</div>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Inspired by de Broglie{"'"}s 1924 thesis on matter waves, Erwin Schr{"ö"}dinger derived his famous wave equation during a Christmas vacation in 1925 at a villa in Arosa, Switzerland. Meanwhile, Werner Heisenberg independently developed an equivalent "matrix mechanics" approach in G{"ö"}ttingen. The two formulations were later shown to be mathematically identical. Max Born provided the crucial interpretation: the wavefunction {"ψ"} itself is not physical, but |{"ψ"}|{"²"} gives the probability of finding the electron at a given location — replacing deterministic orbits with probability clouds.
          </div>
        </div>

        <div style={{
          background: `${T.eo_valence}11`, border: `1px solid ${T.eo_valence}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_valence, marginBottom: 4 }}>Why This Leads to Quantum Numbers {"→"}</div>
          <div style={{ color: T.ink }}>
            Hydrogen has only <strong>one</strong> quantum number (n). But the full 3D solution reveals
            <strong> three more</strong>: l (shape), m{"ₗ"} (orientation), m{"ₛ"} (spin).
            Together they define every possible orbital {"—"} and explain the entire periodic table.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 3: Quantum Numbers & Orbitals
// ─────────────────────────────────────────────

function QuantumNumbersSection() {
  const [frame, setFrame] = useState(0);
  const [n, setN] = useState(2);
  const [l, setL] = useState(1);
  const [ml, setMl] = useState(0);
  const [ms, setMs] = useState(0.5);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  // Keep l in bounds when n changes
  useEffect(() => {
    if (l >= n) setL(n - 1);
  }, [n]);
  useEffect(() => {
    if (Math.abs(ml) > l) setMl(0);
  }, [l]);

  const subshellNames = ["s", "p", "d", "f", "g", "h", "i"];
  const orbitalName = `${n}${subshellNames[l]}`;
  const electronsInSubshell = 2 * (2 * l + 1);

  const cx = 160, cy = 160;
  const pulse = 1.0 + 0.05 * Math.sin(frame * 0.08);
  const rot = frame * 0.3;

  const drawOrbital = () => {
    const elems = [];
    const posColor = `${T.eo_e}99`;
    const negColor = `${T.eo_hole}99`;
    const posStroke = T.eo_e;
    const negStroke = T.eo_hole;

    if (l === 0) {
      // s orbital: sphere
      const r = (30 + n * 12) * pulse;
      elems.push(
        <circle key="s" cx={cx} cy={cy} r={r} fill={posColor} stroke={posStroke} strokeWidth={1.5} />
      );
      // Nucleus
      elems.push(
        <circle key="nuc" cx={cx} cy={cy} r={3} fill={T.ink} />
      );
    } else if (l === 1) {
      // p orbitals: dumbbell
      const size = (25 + n * 10) * pulse;
      const angle = ml === -1 ? -45 : ml === 0 ? 0 : 45;
      const rad = ((angle + rot) * Math.PI) / 180;
      const isZ = ml === 0;

      if (isZ) {
        // pz - vertical dumbbell
        const radR = (rot * Math.PI) / 180;
        const squeeze = Math.cos(radR) * 0.3 + 0.7;
        elems.push(
          <ellipse key="p-top" cx={cx} cy={cy - size * 0.8} rx={size * 0.4 * squeeze} ry={size * 0.7}
            fill={posColor} stroke={posStroke} strokeWidth={1.5}
            transform={`rotate(${rot * 0.1}, ${cx}, ${cy})`} />
        );
        elems.push(
          <ellipse key="p-bot" cx={cx} cy={cy + size * 0.8} rx={size * 0.4 * squeeze} ry={size * 0.7}
            fill={negColor} stroke={negStroke} strokeWidth={1.5}
            transform={`rotate(${rot * 0.1}, ${cx}, ${cy})`} />
        );
      } else {
        // px, py - rotated dumbbells
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);
        const dx = cosA * size * 0.8;
        const dy = sinA * size * 0.8;
        elems.push(
          <ellipse key="p-pos" cx={cx + dx} cy={cy + dy} rx={size * 0.7} ry={size * 0.4}
            fill={posColor} stroke={posStroke} strokeWidth={1.5}
            transform={`rotate(${angle + rot * 0.1}, ${cx + dx}, ${cy + dy})`} />
        );
        elems.push(
          <ellipse key="p-neg" cx={cx - dx} cy={cy - dy} rx={size * 0.7} ry={size * 0.4}
            fill={negColor} stroke={negStroke} strokeWidth={1.5}
            transform={`rotate(${angle + rot * 0.1}, ${cx - dx}, ${cy - dy})`} />
        );
      }
      elems.push(<circle key="nuc" cx={cx} cy={cy} r={3} fill={T.ink} />);
    } else if (l === 2) {
      // d orbitals: clover-leaf patterns
      const size = (20 + n * 8) * pulse;

      if (ml === 0) {
        // dz2: donut + two lobes
        elems.push(
          <ellipse key="dz-ring" cx={cx} cy={cy} rx={size * 1.0} ry={size * 0.3}
            fill={`${T.eo_e}33`} stroke={posStroke} strokeWidth={1}
            transform={`rotate(${rot * 0.1}, ${cx}, ${cy})`} />
        );
        elems.push(
          <ellipse key="dz-top" cx={cx} cy={cy - size * 0.9} rx={size * 0.35} ry={size * 0.6}
            fill={posColor} stroke={posStroke} strokeWidth={1.5}
            transform={`rotate(${rot * 0.1}, ${cx}, ${cy})`} />
        );
        elems.push(
          <ellipse key="dz-bot" cx={cx} cy={cy + size * 0.9} rx={size * 0.35} ry={size * 0.6}
            fill={posColor} stroke={posStroke} strokeWidth={1.5}
            transform={`rotate(${rot * 0.1}, ${cx}, ${cy})`} />
        );
      } else {
        // clover leaf: 4 lobes
        const baseAngle = ml === -2 ? 0 : ml === -1 ? 45 : ml === 1 ? 22.5 : 67.5;
        for (let i = 0; i < 4; i++) {
          const a = ((baseAngle + i * 90 + rot * 0.15) * Math.PI) / 180;
          const dx = Math.cos(a) * size * 0.7;
          const dy = Math.sin(a) * size * 0.7;
          const fillC = i % 2 === 0 ? posColor : negColor;
          const strokeC = i % 2 === 0 ? posStroke : negStroke;
          elems.push(
            <ellipse key={`d-${i}`} cx={cx + dx} cy={cy + dy}
              rx={size * 0.5} ry={size * 0.3}
              fill={fillC} stroke={strokeC} strokeWidth={1.5}
              transform={`rotate(${baseAngle + i * 90 + rot * 0.15}, ${cx + dx}, ${cy + dy})`} />
          );
        }
      }
      elems.push(<circle key="nuc" cx={cx} cy={cy} r={3} fill={T.ink} />);
    } else {
      // f and higher: show stylized multi-lobe
      const lobeCount = 2 * l + 1 + (l > 3 ? 0 : 1);
      const size = (15 + n * 6) * pulse;
      for (let i = 0; i < lobeCount; i++) {
        const a = ((i * 360) / lobeCount + rot * 0.12) * (Math.PI / 180);
        const dx = Math.cos(a) * size * 0.8;
        const dy = Math.sin(a) * size * 0.8;
        const fillC = i % 2 === 0 ? posColor : negColor;
        const strokeC = i % 2 === 0 ? posStroke : negStroke;
        elems.push(
          <ellipse key={`f-${i}`} cx={cx + dx} cy={cy + dy}
            rx={size * 0.4} ry={size * 0.25}
            fill={fillC} stroke={strokeC} strokeWidth={1}
            transform={`rotate(${(i * 360) / lobeCount + rot * 0.12}, ${cx + dx}, ${cy + dy})`} />
        );
      }
      elems.push(<circle key="nuc" cx={cx} cy={cy} r={3} fill={T.ink} />);
    }

    return elems;
  };

  const fillingOrder = [
    "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Quantum numbers are like an address system for electrons. The principal quantum number (n) is the city (energy level). The angular momentum number (l) is the street (orbital shape: s, p, d, f). The magnetic number (ml) is the house number (orientation in space). The spin number (ms) is which side of the bed you sleep on (up or down). No two electrons can have the same full address — that's the Pauli exclusion principle.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* LEFT: SVG */}
      <div style={{ flexShrink: 0 }}>
        <svg viewBox="0 0 320 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 320 }}>
          {!showAll ? (
            <g>
              {/* Axes */}
              <line x1={cx} y1={30} x2={cx} y2={290} stroke={T.dim} strokeWidth={0.5} strokeDasharray="3,3" />
              <line x1={30} y1={cy} x2={290} y2={cy} stroke={T.dim} strokeWidth={0.5} strokeDasharray="3,3" />
              <text x={cx + 4} y={28} fontSize={9} fill={T.muted}>z</text>
              <text x={292} y={cy - 4} fontSize={9} fill={T.muted}>x</text>
              {drawOrbital()}
              <text x={cx} y={308} fontSize={14} fill={T.eo_e} textAnchor="middle" fontWeight="bold">
                {orbitalName} (m_l={ml})
              </text>
              <rect x={10} y={10} width={10} height={10} fill={`${T.eo_e}99`} rx={2} />
              <text x={24} y={19} fontSize={9} fill={T.muted}>+ lobe</text>
              <rect x={10} y={24} width={10} height={10} fill={`${T.eo_hole}99`} rx={2} />
              <text x={24} y={33} fontSize={9} fill={T.muted}>{"−"} lobe</text>
            </g>
          ) : (
            <g>
              {/* Show all orbitals for selected n */}
              <text x={160} y={16} textAnchor="middle" fontSize={11} fill={T.ink} fontWeight="bold">
                All orbitals for n={n}
              </text>
              {Array.from({ length: n }, (_, li) => {
                const subName = ["s", "p", "d", "f"][li];
                const mlCount = 2 * li + 1;
                const cellW = 280 / Math.max(mlCount, 1);
                const rowY = 40 + li * 72;
                return (
                  <g key={li}>
                    <text x={10} y={rowY + 30} fontSize={10} fill={[T.eo_e, T.eo_valence, T.eo_core, T.eo_photon][li]} fontWeight="bold">
                      {n}{subName}
                    </text>
                    {Array.from({ length: mlCount }, (_, mi) => {
                      const mlVal = mi - li;
                      const orbCx = 30 + mi * cellW + cellW / 2;
                      const orbCy = rowY + 28;
                      const orbSize = Math.min(cellW * 0.35, 25);
                      const orbColor = [T.eo_e, T.eo_valence, T.eo_core, T.eo_photon][li];
                      return (
                        <g key={mi}>
                          {li === 0 && <circle cx={orbCx} cy={orbCy} r={orbSize} fill={orbColor} opacity={0.3} stroke={orbColor} strokeWidth={1} />}
                          {li === 1 && (
                            <g>
                              <ellipse cx={orbCx} cy={orbCy - orbSize * 0.5} rx={orbSize * 0.35} ry={orbSize * 0.6} fill={orbColor} opacity={0.3} stroke={orbColor} strokeWidth={0.8}
                                transform={`rotate(${mlVal * 45}, ${orbCx}, ${orbCy})`} />
                              <ellipse cx={orbCx} cy={orbCy + orbSize * 0.5} rx={orbSize * 0.35} ry={orbSize * 0.6} fill={`${T.eo_hole}66`} stroke={T.eo_hole} strokeWidth={0.8}
                                transform={`rotate(${mlVal * 45}, ${orbCx}, ${orbCy})`} />
                            </g>
                          )}
                          {li === 2 && (
                            <g>
                              {[0, 90, 180, 270].map((a, ai) => {
                                const rad = ((a + mlVal * 22) * Math.PI) / 180;
                                return <ellipse key={ai} cx={orbCx + Math.cos(rad) * orbSize * 0.4} cy={orbCy + Math.sin(rad) * orbSize * 0.4}
                                  rx={orbSize * 0.3} ry={orbSize * 0.2} fill={ai % 2 === 0 ? orbColor : `${T.eo_hole}66`} opacity={0.3}
                                  transform={`rotate(${a + mlVal * 22}, ${orbCx + Math.cos(rad) * orbSize * 0.4}, ${orbCy + Math.sin(rad) * orbSize * 0.4})`} />;
                              })}
                            </g>
                          )}
                          {li >= 3 && (
                            <g>
                              {Array.from({ length: 6 }, (_, fi) => {
                                const a = (fi * 60 + mlVal * 15) * Math.PI / 180;
                                return <ellipse key={fi} cx={orbCx + Math.cos(a) * orbSize * 0.4} cy={orbCy + Math.sin(a) * orbSize * 0.4}
                                  rx={orbSize * 0.22} ry={orbSize * 0.15} fill={fi % 2 === 0 ? orbColor : `${T.eo_hole}66`} opacity={0.3}
                                  transform={`rotate(${fi * 60 + mlVal * 15}, ${orbCx + Math.cos(a) * orbSize * 0.4}, ${orbCy + Math.sin(a) * orbSize * 0.4})`} />;
                              })}
                            </g>
                          )}
                          <circle cx={orbCx} cy={orbCy} r={2} fill={T.ink} />
                          <text x={orbCx} y={orbCy + orbSize + 12} textAnchor="middle" fontSize={7} fill={T.muted}>
                            m{"ₗ"}={mlVal > 0 ? `+${mlVal}` : mlVal}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
        <div style={{ marginTop: 6, textAlign: "center" }}>
          <button onClick={() => setShowAll(!showAll)} style={{
            padding: "5px 14px", fontFamily: "monospace", fontSize: 11,
            background: showAll ? T.eo_core : T.panel,
            color: showAll ? "#fff" : T.ink,
            border: `1px solid ${T.eo_core}`, borderRadius: 4, cursor: "pointer",
          }}>
            {showAll ? "Single Orbital View" : "Show All Orbitals"}
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Quantum number selectors */}
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10, color: T.eo_core }}>
            Quantum Numbers
          </div>

          {/* n */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.muted }}>n (principal, shell): </span>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                <button key={v} onClick={() => setN(v)} style={{
                  width: 26, height: 24, fontSize: 11, fontFamily: "monospace",
                  background: v === n ? T.eo_core : T.surface, color: v === n ? "#fff" : T.ink,
                  border: `1px solid ${v === n ? T.eo_core : T.border}`, borderRadius: 3, cursor: "pointer",
                }}>{v}</button>
              ))}
            </div>
          </div>

          {/* l */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.muted }}>l (angular, subshell): </span>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              {Array.from({ length: n }, (_, i) => i).map((v) => (
                <button key={v} onClick={() => setL(v)} style={{
                  minWidth: 30, height: 24, fontSize: 11, fontFamily: "monospace",
                  background: v === l ? T.eo_e : T.surface, color: v === l ? "#fff" : T.ink,
                  border: `1px solid ${v === l ? T.eo_e : T.border}`, borderRadius: 3, cursor: "pointer",
                  padding: "0 4px",
                }}>{v} ({subshellNames[v]})</button>
              ))}
            </div>
          </div>

          {/* ml */}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.muted }}>m_l (magnetic): </span>
            <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
              {Array.from({ length: 2 * l + 1 }, (_, i) => i - l).map((v) => (
                <button key={v} onClick={() => setMl(v)} style={{
                  width: 30, height: 24, fontSize: 11, fontFamily: "monospace",
                  background: v === ml ? T.eo_cond : T.surface, color: v === ml ? "#fff" : T.ink,
                  border: `1px solid ${v === ml ? T.eo_cond : T.border}`, borderRadius: 3, cursor: "pointer",
                }}>{v > 0 ? `+${v}` : v}</button>
              ))}
            </div>
          </div>

          {/* ms */}
          <div>
            <span style={{ fontSize: 11, color: T.muted }}>m_s (spin): </span>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              {[0.5, -0.5].map((v) => (
                <button key={v} onClick={() => setMs(v)} style={{
                  minWidth: 36, height: 24, fontSize: 11, fontFamily: "monospace",
                  background: v === ms ? T.eo_hole : T.surface, color: v === ms ? "#fff" : T.ink,
                  border: `1px solid ${v === ms ? T.eo_hole : T.border}`, borderRadius: 3, cursor: "pointer",
                }}>{v > 0 ? "+½" : "−½"}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            <strong>Orbital:</strong> {orbitalName} | <strong>Electrons in subshell:</strong> {electronsInSubshell}
          </div>
          <div style={{ fontSize: 11, color: T.muted }}>
            2(2l+1) = 2({2 * l + 1}) = {electronsInSubshell}
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: T.muted, marginBottom: 6 }}>
            Filling Order (Aufbau):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {fillingOrder.map((orb) => (
              <span key={orb} style={{
                fontSize: 10, padding: "2px 5px", borderRadius: 3,
                background: orb === orbitalName ? T.eo_e : T.surface,
                color: orb === orbitalName ? "#fff" : T.muted,
                border: `1px solid ${orb === orbitalName ? T.eo_e : T.border}`,
              }}>{orb}</span>
            ))}
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Spectroscopists in the late 1800s noticed that spectral lines split when atoms were placed in a magnetic field (the Zeeman effect), hinting that electrons have additional quantum properties beyond energy level. In 1922, Otto Stern and Walther Gerlach fired silver atoms through an inhomogeneous magnetic field and observed the beam split into exactly two spots — direct proof that angular momentum is quantized and that electrons possess an intrinsic "spin." These experiments revealed the four quantum numbers (n, l, m_l, m_s) needed to fully describe each electron in an atom.
          </div>
        </div>

        <div style={{
          background: `${T.eo_core}11`, border: `1px solid ${T.eo_core}44`,
          borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_core, marginBottom: 4 }}>
            Periodic Table Connection
          </div>
          <div style={{ color: T.ink, fontSize: 11 }}>
            s-block: groups 1{"–2"} | p-block: groups 13{"–18"} | d-block: groups 3{"–12"} | f-block: lanthanides/actinides.
            The filling of these orbitals gives the periodic table its shape.
          </div>
        </div>

        <div style={{
          background: `${T.eo_core}11`, border: `1px solid ${T.eo_core}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_core, marginBottom: 4 }}>Coming Next: Aufbau & Pauli {"→"}</div>
          <div style={{ color: T.ink }}>
            Now that we know the four quantum numbers (n, l, m_l, m_s) define every possible orbital, we need rules for how electrons actually fill them. The Aufbau principle and Pauli exclusion principle tell us the filling order — and explain why elements have the electron configurations they do.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 4: Periodic Trends
// ─────────────────────────────────────────────

function PeriodicTrendsSection() {
  const [frame, setFrame] = useState(0);
  const [property, setProperty] = useState("en"); // en, radius, ie, ea
  const [selectedEl, setSelectedEl] = useState("Si");

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 60);
    return () => clearInterval(id);
  }, []);

  // Element data: [symbol, row, col, Z, electronegativity, atomicRadius(pm), IE(eV), EA(eV)]
  const elements = [
    ["H",  0, 0,  1, 2.20, 53,  13.60, 0.75],
    ["Li", 1, 0,  3, 0.98, 167, 5.39,  0.62],
    ["Be", 1, 1,  4, 1.57, 112, 9.32,  -0.5],
    ["B",  1, 8,  5, 2.04, 87,  8.30,  0.28],
    ["C",  1, 9,  6, 2.55, 77,  11.26, 1.26],
    ["N",  1, 10, 7, 3.04, 75,  14.53, -0.07],
    ["O",  1, 11, 8, 3.44, 73,  13.62, 1.46],
    ["Na", 2, 0,  11, 0.93, 190, 5.14, 0.55],
    ["Mg", 2, 1,  12, 1.31, 145, 7.65, -0.4],
    ["Al", 2, 8,  13, 1.61, 118, 5.99, 0.43],
    ["Si", 2, 9,  14, 1.90, 111, 8.15, 1.39],
    ["P",  2, 10, 15, 2.19, 98,  10.49, 0.75],
    ["S",  2, 11, 16, 2.58, 88,  10.36, 2.08],
    ["K",  3, 0,  19, 0.82, 243, 4.34, 0.50],
    ["Ca", 3, 1,  20, 1.00, 194, 6.11, 0.02],
    ["Cu", 3, 6,  29, 1.90, 128, 7.73, 1.24],
    ["Zn", 3, 7,  30, 1.65, 134, 9.39, -0.6],
    ["Ga", 3, 8,  31, 1.81, 126, 5.99, 0.43],
    ["Ge", 3, 9,  32, 2.01, 122, 7.90, 1.23],
    ["As", 3, 10, 33, 2.18, 119, 9.79, 0.80],
    ["Se", 3, 11, 34, 2.55, 116, 9.75, 2.02],
    ["Ag", 4, 6,  47, 1.93, 144, 7.58, 1.30],
    ["Cd", 4, 7,  48, 1.69, 151, 8.99, -0.7],
    ["In", 4, 8,  49, 1.78, 167, 5.79, 0.30],
    ["Sn", 4, 9,  50, 1.96, 140, 7.34, 1.11],
    ["Sb", 4, 10, 51, 2.05, 140, 8.61, 1.05],
    ["Te", 4, 11, 52, 2.10, 143, 9.01, 1.97],
    ["Ba", 5, 1,  56, 0.89, 253, 5.21, 0.14],
    ["Hg", 5, 7,  80, 2.00, 151, 10.44, -0.5],
    ["Tl", 5, 8,  81, 1.62, 170, 6.11, 0.20],
    ["Pb", 5, 9,  82, 2.33, 175, 7.42, 0.36],
  ];

  const propConfig = {
    en:     { label: "Electronegativity", idx: 4, unit: "(Pauling)", min: 0.8, max: 3.5 },
    radius: { label: "Atomic Radius", idx: 5, unit: "(pm)", min: 50, max: 260 },
    ie:     { label: "Ionization Energy", idx: 6, unit: "(eV)", min: 4, max: 14 },
    ea:     { label: "Electron Affinity", idx: 7, unit: "(eV)", min: -1, max: 2.5 },
  };

  const pc = propConfig[property];

  const valToColor = (val) => {
    let t = (val - pc.min) / (pc.max - pc.min);
    t = Math.max(0, Math.min(1, t));
    // blue → white → red
    if (t < 0.5) {
      const s = t / 0.5;
      const r = Math.round(37 + s * (255 - 37));
      const g = Math.round(99 + s * (255 - 99));
      const b = Math.round(235 + s * (255 - 235));
      return `rgb(${r},${g},${b})`;
    } else {
      const s = (t - 0.5) / 0.5;
      const r = Math.round(255 - s * (255 - 234));
      const g = Math.round(255 - s * (255 - 88));
      const b = Math.round(255 - s * (255 - 12));
      return `rgb(${r},${g},${b})`;
    }
  };

  const cellW = 26, cellH = 24;
  const offsetX = 6, offsetY = 20;

  const selData = elements.find((e) => e[0] === selectedEl);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          The periodic table is like a seating chart that reveals personality. Moving left to right across a row, atoms grip their electrons tighter (higher ionization energy) and shrink in size — like a crowd squeezing into fewer seats. Moving down a column, atoms get larger and hold electrons more loosely — like moving from a cramped apartment to a mansion where you lose track of your belongings. These trends predict how atoms will bond, react, and behave in materials.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* LEFT: SVG */}
      <div style={{ flexShrink: 0 }}>
        <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          {/* Title */}
          <text x={170} y={14} fontSize={10} fill={T.muted} textAnchor="middle" fontWeight="bold">
            {pc.label} Heatmap
          </text>

          {/* Column headers (group labels) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => (
            <text key={`ch-${c}`} x={offsetX + c * cellW + cellW / 2} y={offsetY + 8}
              fontSize={7} fill={T.dim} textAnchor="middle">
              {c <= 1 ? c + 1 : c + 11}
            </text>
          ))}

          {elements.map(([sym, row, col, z, en, radius, ie, ea]) => {
            const x = offsetX + col * cellW;
            const y = offsetY + 12 + row * cellH;
            const val = [en, radius, ie, ea][[4, 5, 6, 7].indexOf(pc.idx)];
            const color = valToColor(val);
            const isSel = sym === selectedEl;
            const pulseScale = isSel ? 1.0 + 0.03 * Math.sin(frame * 0.12) : 1.0;

            return (
              <g key={sym} onClick={() => setSelectedEl(sym)} style={{ cursor: "pointer" }}
                transform={isSel ? `translate(${x + cellW / 2}, ${y + cellH / 2}) scale(${pulseScale}) translate(${-(x + cellW / 2)}, ${-(y + cellH / 2)})` : undefined}>
                <rect x={x} y={y} width={cellW - 2} height={cellH - 2} rx={3}
                  fill={color} stroke={isSel ? T.ink : T.border} strokeWidth={isSel ? 2 : 0.5} />
                <text x={x + (cellW - 2) / 2} y={y + (cellH - 2) / 2 + 1}
                  fontSize={8} fill={T.ink} textAnchor="middle" dominantBaseline="middle"
                  fontWeight={isSel ? "bold" : "normal"}>
                  {sym}
                </text>
              </g>
            );
          })}

          {/* Color bar legend */}
          <defs>
            <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(37,99,235)" />
              <stop offset="50%" stopColor="rgb(255,255,255)" />
              <stop offset="100%" stopColor="rgb(234,88,12)" />
            </linearGradient>
          </defs>
          <rect x={60} y={285} width={220} height={10} rx={3} fill="url(#heatGrad)" stroke={T.border} strokeWidth={0.5} />
          <text x={60} y={308} fontSize={8} fill={T.muted}>{pc.min.toFixed(1)}</text>
          <text x={280} y={308} fontSize={8} fill={T.muted} textAnchor="end">{pc.max.toFixed(1)}</text>
          <text x={170} y={308} fontSize={8} fill={T.muted} textAnchor="middle">{pc.unit}</text>

          {/* Trend arrows */}
          <g>
            <text x={310} y={offsetY + 30} fontSize={9} fill={T.eo_gap} textAnchor="middle">{"↓"}</text>
            <text x={170} y={offsetY + 168} fontSize={9} fill={T.eo_gap} textAnchor="middle">{"→"}</text>
          </g>
        </svg>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Property toggle */}
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: T.eo_gap, marginBottom: 8 }}>
            Select Property
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              ["en", "Electronegativity"],
              ["radius", "Atomic Radius"],
              ["ie", "Ionization Energy"],
              ["ea", "Electron Affinity"],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setProperty(key)} style={{
                padding: "5px 10px", fontSize: 10, fontFamily: "monospace",
                background: property === key ? T.eo_gap : T.surface,
                color: property === key ? "#fff" : T.ink,
                border: `1px solid ${property === key ? T.eo_gap : T.border}`,
                borderRadius: 4, cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Selected element detail */}
        {selData && (
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 8,
                background: valToColor(selData[pc.idx]),
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${T.ink}`,
                fontSize: 18, fontWeight: "bold", color: T.ink,
              }}>
                {selData[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: "bold" }}>{selData[0]}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Z = {selData[3]}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6, fontSize: 11 }}>
              <div style={{ background: T.surface, padding: 6, borderRadius: 4 }}>
                <div style={{ color: T.muted, fontSize: 9 }}>Electronegativity</div>
                <strong>{selData[4].toFixed(2)}</strong>
              </div>
              <div style={{ background: T.surface, padding: 6, borderRadius: 4 }}>
                <div style={{ color: T.muted, fontSize: 9 }}>Atomic Radius</div>
                <strong>{selData[5]} pm</strong>
              </div>
              <div style={{ background: T.surface, padding: 6, borderRadius: 4 }}>
                <div style={{ color: T.muted, fontSize: 9 }}>Ionization Energy</div>
                <strong>{selData[6].toFixed(2)} eV</strong>
              </div>
              <div style={{ background: T.surface, padding: 6, borderRadius: 4 }}>
                <div style={{ color: T.muted, fontSize: 9 }}>Electron Affinity</div>
                <strong>{selData[7].toFixed(2)} eV</strong>
              </div>
            </div>
          </div>
        )}

        {/* Property definition */}
        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>
            {property === "en" ? "What is Electronegativity?" : property === "radius" ? "What is Atomic Radius?" : property === "ie" ? "What is Ionization Energy?" : "What is Electron Affinity?"}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
            {property === "en" && <span>
              <strong>Electronegativity</strong> measures how strongly an atom pulls shared electrons in a bond.
              Pauling{"’"}s scale (0.7{"–"}4.0) uses bond energies. The <strong>difference</strong> ({"Δ"}{"χ"}) between bonded atoms predicts bond type:
              {"Δ"}{"χ"} {"<"} 0.4 = covalent, 0.4{"–"}1.7 = polar covalent, {">"} 1.7 = ionic.
              Example: Zn (1.65) vs Te (2.10) {"→"} {"Δ"}{"χ"} = 0.45 {"→"} ZnTe is polar covalent.
            </span>}
            {property === "radius" && <span>
              <strong>Atomic radius</strong> = distance from nucleus to outermost electron shell.
              Smaller atoms hold electrons more tightly. Across a period, more protons pull electrons inward.
              Down a group, new shells make atoms larger. Radius controls crystal packing and lattice constants.
            </span>}
            {property === "ie" && <span>
              <strong>Ionization energy</strong> = energy to remove one electron: A {"→"} A{"⁺"} + e{"⁻"}.
              High IE means the atom holds electrons tightly (noble gases). Low IE means it easily loses electrons (alkali metals).
              IE determines which elements form cations in ionic compounds and which are good electron donors.
            </span>}
            {property === "ea" && <span>
              <strong>Electron affinity</strong> = energy released when atom gains an electron: A + e{"⁻"} {"→"} A{"⁻"}.
              High EA means the atom wants electrons (halogens). Negative EA means it resists gaining electrons.
              EA determines which elements act as acceptors in semiconductor doping.
            </span>}
          </div>
        </div>

        {/* Trend explanation */}
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, fontSize: 11, lineHeight: 1.6 }}>
          <div style={{ fontWeight: "bold", marginBottom: 6, color: T.eo_gap }}>Periodic Trends</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
            <div>
              <span style={{ color: T.eo_gap }}>{"→"} Across period:</span>{" "}
              {property === "en" && "EN increases (more protons, same shell)"}
              {property === "radius" && "Radius decreases (stronger nuclear pull)"}
              {property === "ie" && "IE increases (harder to remove electrons)"}
              {property === "ea" && "EA generally increases (atoms want electrons)"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <span style={{ color: T.eo_gap }}>{"↓"} Down group:</span>{" "}
              {property === "en" && "EN decreases (electrons farther from nucleus)"}
              {property === "radius" && "Radius increases (more electron shells)"}
              {property === "ie" && "IE decreases (outer electrons easier to remove)"}
              {property === "ea" && "EA generally decreases (larger atoms, weaker pull)"}
            </div>
          </div>
        </div>

        <div style={{
          background: `${T.eo_gap}11`, border: `1px solid ${T.eo_gap}44`,
          borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_gap, marginBottom: 4 }}>Key Insight</div>
          <div style={{ color: T.ink, fontSize: 11 }}>
            Electronegativity difference predicts bond type. Radius determines crystal
            structure. These trends drive all of materials science {"—"} from semiconductor
            doping (Si + P/B) to compound formation (GaAs, CdTe, InSb).
          </div>
        </div>

        <div style={{
          background: `${T.eo_core}11`, border: `1px solid ${T.eo_core}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_core, marginBottom: 4 }}>Coming Next: Chemical Bonding {"→"}</div>
          <div style={{ color: T.ink }}>
            Electronegativity differences between atoms determine how they share or transfer electrons — which is exactly what defines bond types. Understanding periodic trends lets us predict whether atoms will form covalent, ionic, or metallic bonds.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// EXISTING: ATOM STRUCTURE (Section 3)
// ═══════════════════════════════════════════════════════════════════════════

// ── SECTION 1: ATOM STRUCTURE ──────────────────────────────────────────────
function AtomSection() {
  const [selAtom, setSelAtom] = useState(0);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 60);
    return () => clearInterval(id);
  }, []);

  const atoms = [
    {
      sym: "Zn", Z: 30, color: T.eo_valence,
      shells: [2, 8, 18, 2],
      labels: ["1s²", "2s²2p⁶", "3s²3p⁶3d¹⁰", "4s²"],
      valence: 2,
      desc: "Zinc has 2 valence electrons in the outer 4s shell. These are loosely held and participate in bonding.",
    },
    {
      sym: "Te", Z: 52, color: T.eo_hole,
      shells: [2, 8, 18, 18, 6],
      labels: ["1s²", "2s²2p⁶", "3s²3p⁶3d¹⁰", "4s²4p⁶4d¹⁰", "5s²5p⁴"],
      valence: 6,
      desc: "Tellurium has 6 valence electrons in the outer 5s5p shells. These form bonds with Zn.",
    },
    {
      sym: "Cu", Z: 29, color: T.eo_photon,
      shells: [2, 8, 18, 1],
      labels: ["1s²", "2s²2p⁶", "3s²3p⁶3d¹⁰", "4s¹"],
      valence: 1,
      desc: "Copper has 1 valence electron. This is why Cu forms monovalent bonds in kesterite structures.",
    },
  ];

  const a = atoms[selAtom];
  const cx = 160, cy = 160;
  const radii = [28, 52, 80, 112, 140];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox>
          An atom is like a tiny solar system — but weirder. The nucleus (sun) contains nearly all the mass, and electrons (planets) orbit around it. But unlike planets, electrons don't have fixed orbits. Instead, they exist as fuzzy probability clouds — imagine a blurred long-exposure photo of a firefly. The electron could be anywhere in that cloud, but some regions are much more likely than others. Those likely regions are what we call orbitals.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
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
        {/* Orbits */}
        {a.shells.map((_, i) => (
          <circle key={i} cx={cx} cy={cy} r={radii[i]}
            fill="none" stroke={i === a.shells.length - 1 ? a.color + "55" : T.dim}
            strokeWidth={i === a.shells.length - 1 ? 1.5 : 1}
            strokeDasharray={i === a.shells.length - 1 ? "4 3" : "2 4"} />
        ))}
        {/* Nucleus */}
        <circle cx={cx} cy={cy} r={20} fill={a.color + "33"} stroke={a.color} strokeWidth={2} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={a.color} fontSize={13} fontWeight="bold">{a.sym}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={T.muted} fontSize={10}>Z={a.Z}</text>
        {/* Electrons on each shell */}
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
              <g key={ei}>
                {isValence && (
                  <circle cx={ex} cy={ey} r={8} fill={a.color + "15"} />
                )}
                <circle cx={ex} cy={ey} r={isValence ? 5 : 3.5}
                  fill={isValence ? a.color : T.eo_core}
                  opacity={isValence ? 1 : 0.7} />
              </g>
            );
          });
        })}
        {/* Shell labels */}
        {a.shells.map((_, i) => (
          <text key={i} x={cx + radii[i] + 4} y={cy - 4}
            fill={i === a.shells.length - 1 ? a.color : T.muted}
            fontSize={9} fontWeight={i === a.shells.length - 1 ? 700 : 400}>
            {a.labels[i]}
          </text>
        ))}
      </svg>

      {/* Info panel */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: a.color, marginBottom: 8 }}>
          {a.sym} — {a.Z} electrons total
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <Tag color={T.eo_core}>Core: {a.shells.slice(0, -1).reduce((s, v) => s + v, 0)} electrons</Tag>
          <Tag color={a.color}>Valence: {a.valence} electrons</Tag>
        </div>
        <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.8, marginBottom: 14 }}>{a.desc}</p>

        {/* Shell breakdown table */}
        <div style={{ background: T.bg, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 0.5 }}>Shell breakdown</div>
          {a.shells.map((count, i) => {
            const isV = i === a.shells.length - 1;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "5px 8px", borderRadius: 6, marginBottom: 3,
                background: isV ? a.color + "15" : "transparent",
                border: isV ? `1px solid ${a.color}33` : "1px solid transparent",
              }}>
                <div style={{ fontSize: 11, color: isV ? a.color : T.muted, minWidth: 90, fontFamily: "monospace" }}>{a.labels[i]}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {Array.from({ length: Math.min(count, 10) }, (_, j) => (
                    <div key={j} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: isV ? a.color : T.eo_core,
                      opacity: isV ? 1 : 0.5,
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: isV ? a.color : T.muted, fontWeight: isV ? 700 : 400 }}>
                  {count}e⁻ {isV ? "← valence" : "← core"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK B: BONDING & STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

function ChemicalBondingSection() {
  const [dChi, setDChi] = useState(0);
  const [bondType, setBondType] = useState("Covalent");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.12);
  const cloudShift = dChi * 30;
  const cloudWidth = lerp(60, 20, Math.min(dChi / 2.5, 1));

  const bondTypes = {
    Covalent: {
      desc: "Electrons shared equally between atoms of similar electronegativity.",
      example: "Si-Si (Dc = 0), C-C, Ge-Ge",
      strength: "Strong (2-4 eV)",
      directionality: "Highly directional",
      conductivity: "Semiconductor/Insulator",
    },
    "Polar Covalent": {
      desc: "Electrons shared unequally; partial charges develop on atoms.",
      example: "Zn-Te (Dc = 0.6), Ga-As (Dc = 0.4)",
      strength: "Strong (1.5-4 eV)",
      directionality: "Directional",
      conductivity: "Semiconductor",
    },
    Ionic: {
      desc: "Complete electron transfer; electrostatic attraction between ions.",
      example: "Na-Cl (Dc = 2.1), Mg-O (Dc = 2.3)",
      strength: "Strong (3-8 eV)",
      directionality: "Non-directional",
      conductivity: "Insulator (solid)",
    },
    Metallic: {
      desc: "Delocalized electron sea shared among all atoms.",
      example: "Cu, Al, Fe, Au",
      strength: "Moderate (1-4 eV)",
      directionality: "Non-directional",
      conductivity: "High conductor",
    },
    "Van der Waals": {
      desc: "Weak dipole-dipole or London dispersion forces between molecules.",
      example: "Graphite layers, molecular crystals",
      strength: "Weak (0.01-0.1 eV)",
      directionality: "Non-directional",
      conductivity: "Insulator",
    },
  };

  const info = bondTypes[bondType];

  const atomPairs = [
    { label: "Si-Si", dchi: 0 },
    { label: "Zn-Te", dchi: 0.6 },
    { label: "Ga-As", dchi: 0.4 },
    { label: "Na-Cl", dchi: 2.1 },
  ];

  const pairLabel =
    dChi < 0.2
      ? "Si - Si"
      : dChi < 0.8
        ? "Zn - Te"
        : dChi < 1.5
          ? "Ga - As"
          : "Na - Cl";

  const leftAtomColor = dChi > 1.5 ? T.eo_e : T.eo_valence;
  const rightAtomColor = dChi > 1.5 ? T.eo_hole : T.eo_core;

  const bondEnergy = lerp(2.0, 5.0, Math.min(dChi / 2.5, 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Chemical bonding is like sharing or stealing toys. In an ionic bond (NaCl), one atom steals an electron from another — like a bully taking a toy, creating a positive and negative ion that attract. In a covalent bond (Si), atoms share electrons equally — like kids sharing toys nicely. In a metallic bond (Cu), everyone throws their toys into a communal pile that all atoms share — that's the electron sea. The type of sharing determines everything: hardness, conductivity, melting point.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ minWidth: 340 }}>
        <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          <defs>
            <marker id="arrowPolar" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={T.muted} /></marker>
            <marker id="arrowIonic" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={T.eo_gap} /></marker>
          </defs>
          <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
            {bondType === "Metallic" ? "Metallic Bonding" : bondType === "Van der Waals" ? "Van der Waals Forces" : `Chemical Bonding: ${pairLabel}`}
          </text>

          {/* === COVALENT === */}
          {bondType === "Covalent" && (<>
              <ellipse cx={170} cy={120} rx={50} ry={32} fill={T.eo_e} opacity={0.08} />
              <ellipse cx={130} cy={120} rx={35} ry={28} fill={T.eo_valence} opacity={0.12} stroke={T.eo_valence} strokeWidth={1} strokeDasharray="4,3" />
              <ellipse cx={210} cy={120} rx={35} ry={28} fill={T.eo_valence} opacity={0.12} stroke={T.eo_valence} strokeWidth={1} strokeDasharray="4,3" />
              <ellipse cx={170} cy={120} rx={30 * pulse} ry={22 * pulse} fill={T.eo_e} opacity={0.3} stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="4,3" />
              <circle cx={165 + 6 * Math.sin(frame * 0.1)} cy={115 + 4 * Math.cos(frame * 0.13)} r={4} fill={T.eo_e} opacity={0.7} />
              <circle cx={175 - 6 * Math.sin(frame * 0.1)} cy={125 - 4 * Math.cos(frame * 0.13)} r={4} fill={T.eo_e} opacity={0.7} />
              <circle cx={120} cy={120} r={28} fill={T.eo_valence} opacity={0.85} />
              <text x={120} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Si</text>
              <circle cx={220} cy={120} r={28} fill={T.eo_valence} opacity={0.85} />
              <text x={220} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Si</text>
              <text x={170} y={170} textAnchor="middle" fontSize={11} fill={T.muted}>Equal sharing</text>
          </>)}

          {/* === POLAR COVALENT === */}
          {bondType === "Polar Covalent" && (<>
              <ellipse cx={170 + cloudShift} cy={120} rx={cloudWidth * pulse} ry={25 * pulse} fill={T.eo_e} opacity={0.25} stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="4,3" />
              <circle cx={175 + cloudShift + 5 * Math.sin(frame * 0.12)} cy={116 + 3 * Math.cos(frame * 0.15)} r={4} fill={T.eo_e} opacity={0.7} />
              <circle cx={168 + cloudShift - 4 * Math.sin(frame * 0.1)} cy={124 - 3 * Math.cos(frame * 0.12)} r={4} fill={T.eo_e} opacity={0.7} />
              <circle cx={110} cy={120} r={25} fill={T.eo_valence} opacity={0.85} />
              <text x={110} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Zn</text>
              <circle cx={230} cy={120} r={31} fill={T.eo_core} opacity={0.85} />
              <text x={230} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Te</text>
              <text x={110} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.eo_hole}>{"δ+"}</text>
              <text x={230} y={86} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.eo_e}>{"δ−"}</text>
              <line x1={140} y1={155} x2={200} y2={155} stroke={T.muted} strokeWidth={1.5} markerEnd="url(#arrowPolar)" />
              <text x={170} y={168} textAnchor="middle" fontSize={11} fill={T.muted}>Dipole moment</text>
          </>)}

          {/* === IONIC === */}
          {bondType === "Ionic" && (<>
              <line x1={140} y1={120} x2={190} y2={120} stroke={T.eo_gap} strokeWidth={2} strokeDasharray="6,3" markerEnd="url(#arrowIonic)" />
              <line x1={200} y1={120} x2={150} y2={120} stroke={T.eo_gap} strokeWidth={2} strokeDasharray="6,3" markerEnd="url(#arrowIonic)" />
              <text x={170} y={112} textAnchor="middle" fontSize={10} fill={T.eo_gap}>Coulomb</text>
              <circle cx={100} cy={120} r={20} fill={T.eo_hole} opacity={0.85} />
              <text x={100} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Na</text>
              <text x={100} y={90} textAnchor="middle" fontSize={18} fontWeight={700} fill={T.eo_hole}>+</text>
              <circle cx={240} cy={120} r={36} fill={T.eo_e} opacity={0.75} />
              <text x={240} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Cl</text>
              <text x={240} y={82} textAnchor="middle" fontSize={18} fontWeight={700} fill={T.eo_e}>{"−"}</text>
              <circle cx={240 + 10 * Math.sin(frame * 0.15)} cy={95 + 6 * Math.cos(frame * 0.2)} r={5 * pulse} fill={T.eo_e} opacity={0.6} />
              <text x={240 + 10 * Math.sin(frame * 0.15)} y={95 + 6 * Math.cos(frame * 0.2) - 8} textAnchor="middle" fontSize={10} fill={T.muted}>{"e⁻"}</text>
              <text x={170} y={170} textAnchor="middle" fontSize={11} fill={T.muted}>Complete electron transfer</text>
          </>)}

          {/* === METALLIC === */}
          {bondType === "Metallic" && (() => {
            const metalAtoms = [80, 140, 200, 260];
            return (<>
                <rect x={50} y={110} rx={12} ry={12} width={240} height={60} fill={T.eo_e} opacity={0.1} />
                <rect x={50} y={110} rx={12} ry={12} width={240} height={60} fill="none" stroke={T.eo_e} strokeWidth={1} strokeDasharray="4,3" opacity={0.4} />
                {metalAtoms.map((ax, i) => (
                  <g key={i}>
                    <circle cx={ax} cy={110} r={22} fill={T.eo_core} opacity={0.8} />
                    <text x={ax} y={115} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">Cu</text>
                    <text x={ax} y={90} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_core}>+</text>
                  </g>
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const ex = 60 + ((i * 31 + frame * 1.5) % 220);
                  const ey = 135 + 10 * Math.sin(frame * 0.08 + i * 1.2);
                  return <circle key={i} cx={ex} cy={ey} r={3.5} fill={T.eo_e} opacity={0.7} />;
                })}
                <text x={170} y={80} textAnchor="middle" fontSize={11} fill={T.muted}>Positive ion cores</text>
                <text x={170} y={178} textAnchor="middle" fontSize={11} fill={T.eo_e}>Delocalized electron sea</text>
            </>);
          })()}

          {/* === VAN DER WAALS === */}
          {bondType === "Van der Waals" && (() => {
            const dipoleShift = 3 * Math.sin(frame * 0.08);
            return (<>
                <circle cx={80} cy={115} r={20} fill={T.eo_valence} opacity={0.8} />
                <circle cx={120} cy={115} r={20} fill={T.eo_core} opacity={0.8} />
                <line x1={95} y1={115} x2={105} y2={115} stroke="#fff" strokeWidth={3} />
                <text x={80} y={119} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">H</text>
                <text x={120} y={119} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">Cl</text>
                <text x={80} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_hole} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ+"}</text>
                <text x={120} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_e} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ−"}</text>
                <ellipse cx={100 + dipoleShift} cy={115} rx={30 * pulse} ry={18 * pulse} fill={T.eo_e} opacity={0.1} stroke={T.eo_e} strokeWidth={0.8} strokeDasharray="3,3" />
                <line x1={142} y1={115} x2={198} y2={115} stroke={T.muted} strokeWidth={1.5} strokeDasharray="3,4" opacity={0.5 + 0.3 * Math.sin(frame * 0.06)} />
                <text x={170} y={108} textAnchor="middle" fontSize={10} fill={T.dim}>weak</text>
                <circle cx={220} cy={115} r={20} fill={T.eo_valence} opacity={0.8} />
                <circle cx={260} cy={115} r={20} fill={T.eo_core} opacity={0.8} />
                <line x1={235} y1={115} x2={245} y2={115} stroke="#fff" strokeWidth={3} />
                <text x={220} y={119} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">H</text>
                <text x={260} y={119} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">Cl</text>
                <text x={220} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_e} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ−"}</text>
                <text x={260} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_hole} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ+"}</text>
                <ellipse cx={240 - dipoleShift} cy={115} rx={30 * pulse} ry={18 * pulse} fill={T.eo_e} opacity={0.1} stroke={T.eo_e} strokeWidth={0.8} strokeDasharray="3,3" />
                <text x={170} y={155} textAnchor="middle" fontSize={11} fill={T.muted}>Fluctuating dipoles induce attraction</text>
            </>);
          })()}

          {/* Bond energy diagram */}
          <text x={20} y={200} fontSize={11} fontWeight={600} fill={T.ink}>
            Bond Energy Diagram
          </text>
          <line x1={40} y1={210} x2={40} y2={300} stroke={T.muted} strokeWidth={1} />
          <line x1={40} y1={300} x2={310} y2={300} stroke={T.muted} strokeWidth={1} />
          <text x={15} y={255} fontSize={11} fill={T.muted} transform="rotate(-90,15,255)">
            E (eV)
          </text>
          <text x={175} y={315} fontSize={11} fill={T.muted} textAnchor="middle">
            Distance (A)
          </text>

          {/* Morse-like potential curve */}
          {(() => {
            const pts = [];
            const depth = bondEnergy;
            for (let i = 0; i < 50; i++) {
              const x = 50 + i * 5;
              const r = 0.5 + i * 0.08;
              const e = depth * (Math.exp(-2 * 2.5 * (r - 1.5)) - 2 * Math.exp(-2.5 * (r - 1.5)));
              const y = 260 + e * 12;
              pts.push(`${i === 0 ? "M" : "L"}${x},${Math.max(210, Math.min(298, y))}`);
            }
            return <path d={pts.join(" ")} fill="none" stroke={T.eo_e} strokeWidth={2} />;
          })()}

          <text x={100} y={295} fontSize={11} fill={T.eo_gap}>
            E_bond = {bondEnergy.toFixed(1)} eV
          </text>
        </svg>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>
            Electronegativity difference (Dc): {dChi.toFixed(1)}
          </div>
          <input
            type="range"
            min={0}
            max={2.5}
            step={0.1}
            value={dChi}
            onChange={(e) => setDChi(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.dim }}>
            <span>0 (Covalent)</span>
            <span>1 (Polar)</span>
            <span>2+ (Ionic)</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
          {atomPairs.map((p) => (
            <button
              key={p.label}
              onClick={() => setDChi(p.dchi)}
              style={{
                padding: "3px 8px",
                fontSize: 10,
                fontFamily: "monospace",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {p.label} (Dc={p.dchi})
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Chemical Bonding</div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {Object.keys(bondTypes).map((bt) => (
            <button
              key={bt}
              onClick={() => { setBondType(bt); setDChi(bt === "Covalent" ? 0 : bt === "Polar Covalent" ? 0.6 : bt === "Ionic" ? 2.1 : bt === "Metallic" ? 0 : 0); }}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontFamily: "monospace",
                background: bondType === bt ? T.eo_e : T.surface,
                color: bondType === bt ? "#fff" : T.ink,
                border: `1px solid ${bondType === bt ? T.eo_e : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {bt}
            </button>
          ))}
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 12, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{bondType}</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{info.desc}</div>
          <div style={{ fontSize: 11, color: T.eo_valence, marginTop: 4 }}>Example: {info.example}</div>
        </div>

        <div style={{ fontSize: 11, marginBottom: 6, fontWeight: 600 }}>Property Comparison</div>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <th style={{ textAlign: "left", padding: "4px 6px", color: T.muted }}>Property</th>
              <th style={{ textAlign: "left", padding: "4px 6px", color: T.muted }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Bond strength", info.strength],
              ["Directionality", info.directionality],
              ["Conductivity", info.conductivity],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "4px 6px" }}>{k}</td>
                <td style={{ padding: "4px 6px", color: T.eo_e }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1916, Gilbert N. Lewis proposed that atoms form bonds by sharing pairs of electrons, introducing the concept of the covalent bond using simple dot diagrams. Two decades later, Linus Pauling developed the electronegativity scale and published his landmark book "The Nature of the Chemical Bond" (1939), which unified ionic and covalent bonding into a single spectrum based on electronegativity difference. Pauling{"'"}s insight that bond character is a continuum — not a sharp binary — is essential for understanding why compound semiconductors like ZnTe and GaAs have partially ionic character.
          </div>
        </div>

        <div style={{ background: "#fef9c3", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
            ZnTe has Dc ~ 0.6 -- polar covalent. This partial ionicity affects defect formation energies
            and is why compound semiconductors have different native defect landscapes than elemental Si.
          </div>
        </div>

        <div style={{
          background: `${T.eo_valence}11`, border: `1px solid ${T.eo_valence}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_valence, marginBottom: 4 }}>Coming Next: Hybridization {"→"}</div>
          <div style={{ color: T.ink }}>
            We know atoms bond by sharing electrons, but how do atomic orbitals rearrange to form those bonds? Hybridization explains how s and p orbitals mix to create new shapes — giving molecules their 3D geometry.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function HybridizationSection() {
  const [hybridType, setHybridType] = useState("sp3");
  const [frame, setFrame] = useState(0);
  const [showMixing, setShowMixing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const mixT = showMixing ? Math.min((frame % 120) / 60, 1) : 1;

  const hybridData = {
    sp: {
      n: 2,
      geometry: "Linear",
      angle: "180deg",
      angleNum: 180,
      colors: [T.eo_e, T.eo_hole],
    },
    sp2: {
      n: 3,
      geometry: "Trigonal Planar",
      angle: "120deg",
      angleNum: 120,
      colors: [T.eo_e, T.eo_hole, T.eo_valence],
    },
    sp3: {
      n: 4,
      geometry: "Tetrahedral",
      angle: "109.5deg",
      angleNum: 109.5,
      colors: [T.eo_e, T.eo_hole, T.eo_valence, T.eo_core],
    },
  };

  const data = hybridData[hybridType];

  const drawSorbital = (cx, cy, r, opacity) => (
    <circle cx={cx} cy={cy} r={r} fill={T.eo_e} opacity={opacity} stroke={T.eo_e} strokeWidth={1} />
  );

  const drawPorbital = (cx, cy, angle, len, color, opacity) => {
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad) * len;
    const dy = Math.sin(rad) * len;
    return (
      <g opacity={opacity}>
        <ellipse
          cx={cx + dx * 0.5}
          cy={cy + dy * 0.5}
          rx={8}
          ry={len * 0.4}
          fill={color}
          opacity={0.4}
          transform={`rotate(${angle}, ${cx + dx * 0.5}, ${cy + dy * 0.5})`}
        />
        <ellipse
          cx={cx - dx * 0.5}
          cy={cy - dy * 0.5}
          rx={8}
          ry={len * 0.4}
          fill={color}
          opacity={0.25}
          transform={`rotate(${angle}, ${cx - dx * 0.5}, ${cy - dy * 0.5})`}
        />
      </g>
    );
  };

  const lobeAngles = {
    sp: [0, 180],
    sp2: [0, 120, 240],
    sp3: [0, 109.5, 220, 330],
  };

  const pulse = 0.95 + 0.05 * Math.sin(frame * 0.1);
  const ctrX = 170;
  const ctrY = 170;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          {`Hybridization is like mixing paint colors. A carbon atom has separate s and p orbitals (like separate red, blue, yellow paints). But when it bonds, it blends them into hybrid orbitals (like mixing paints to get new colors). sp³ hybridization mixes 1s + 3p to create 4 identical orbitals pointing to the corners of a tetrahedron — this is why methane (CH₄) and diamond have their specific shapes. The mixing happens because hybrid orbitals overlap better with neighbors, making stronger bonds.`}
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ minWidth: 340 }}>
        <svg viewBox="0 0 340 340" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
            {hybridType} Hybridization
          </text>

          {/* Unmixed orbitals (fade out during mixing) */}
          {drawSorbital(ctrX, ctrY, lerp(20, 5, mixT), lerp(0.4, 0, mixT))}
          {[90, 0, 180].slice(0, hybridType === "sp" ? 1 : hybridType === "sp2" ? 2 : 3).map((a, i) =>
            drawPorbital(ctrX, ctrY, a, 35, [T.eo_hole, T.eo_valence, T.eo_core][i], lerp(0.5, 0, mixT))
          )}

          {/* Hybrid lobes */}
          {lobeAngles[hybridType].map((angle, i) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const lobeLen = lerp(10, 55, mixT) * pulse;
            const ex = ctrX + Math.cos(rad) * lobeLen;
            const ey = ctrY + Math.sin(rad) * lobeLen;
            return (
              <g key={i} opacity={mixT}>
                <ellipse
                  cx={lerp(ctrX, (ctrX + ex) / 2, mixT)}
                  cy={lerp(ctrY, (ctrY + ey) / 2, mixT)}
                  rx={lerp(3, 12, mixT)}
                  ry={lerp(3, lobeLen * 0.7, mixT)}
                  fill={data.colors[i]}
                  opacity={0.35}
                  transform={`rotate(${angle - 90}, ${lerp(ctrX, (ctrX + ex) / 2, mixT)}, ${lerp(ctrY, (ctrY + ey) / 2, mixT)})`}
                />
                <line x1={ctrX} y1={ctrY} x2={ex} y2={ey} stroke={data.colors[i]} strokeWidth={2} opacity={0.6 * mixT} />
                {mixT > 0.8 && (
                  <text x={ex + Math.cos(rad) * 12} y={ey + Math.sin(rad) * 12} textAnchor="middle" fontSize={9} fill={data.colors[i]}>
                    {hybridType}
                  </text>
                )}
              </g>
            );
          })}

          {/* Central atom */}
          <circle cx={ctrX} cy={ctrY} r={6} fill={T.ink} />

          {/* Angle label */}
          {mixT > 0.8 && lobeAngles[hybridType].length >= 2 && (
            <text x={ctrX + 35} y={ctrY - 5} fontSize={10} fill={T.eo_gap} fontWeight={600}>
              {data.angle}
            </text>
          )}

          {/* Geometry label */}
          <text x={170} y={330} textAnchor="middle" fontSize={11} fill={T.muted}>
            Geometry: {data.geometry}
          </text>
        </svg>

        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {["sp", "sp2", "sp3"].map((h) => (
            <button
              key={h}
              onClick={() => { setHybridType(h); setFrame(0); }}
              style={{
                flex: 1,
                padding: "5px 0",
                fontSize: 12,
                fontFamily: "monospace",
                fontWeight: hybridType === h ? 700 : 400,
                background: hybridType === h ? T.eo_core : T.surface,
                color: hybridType === h ? "#fff" : T.ink,
                border: `1px solid ${hybridType === h ? T.eo_core : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {h === "sp2" ? "sp²" : h === "sp3" ? "sp³" : h}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setShowMixing(!showMixing); setFrame(0); }}
          style={{
            width: "100%",
            marginTop: 6,
            padding: "5px 0",
            fontSize: 11,
            fontFamily: "monospace",
            background: showMixing ? T.eo_valence : T.panel,
            color: showMixing ? "#fff" : T.ink,
            border: `1px solid ${showMixing ? T.eo_valence : T.border}`,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {showMixing ? "Stop Mixing Animation" : "Animate Orbital Mixing"}
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Hybridization</div>
        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, marginBottom: 10 }}>
          Atoms mix atomic orbitals (s, p, d) to form new <strong>hybrid orbitals</strong> optimized for bonding.
          The resulting geometry minimizes electron repulsion (VSEPR).
        </div>

        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${T.border}` }}>
              {["Type", "# Orbitals", "Geometry", "Angle"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "4px 6px", color: T.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["sp", "2", "Linear", "180°"],
              ["sp²", "3", "Trigonal Planar", "120°"],
              ["sp³", "4", "Tetrahedral", "109.5°"],
            ].map(([t, n, g, a]) => (
              <tr
                key={t}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: (t === "sp" && hybridType === "sp") || (t === "sp²" && hybridType === "sp2") || (t === "sp³" && hybridType === "sp3") ? "#eff6ff" : "transparent",
                }}
              >
                <td style={{ padding: "4px 6px", fontWeight: 600 }}>{t}</td>
                <td style={{ padding: "4px 6px" }}>{n}</td>
                <td style={{ padding: "4px 6px" }}>{g}</td>
                <td style={{ padding: "4px 6px", color: T.eo_core }}>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>What is Hybridization?</div>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.7 }}>
            <strong>Problem:</strong> Atomic orbitals (s, p) have different shapes and energies. But in CH{"₄"}, all 4 bonds are identical at 109.5{"°"}. How?<br /><br />
            <strong>Solution:</strong> Atoms mix their orbitals to create new <strong>equivalent</strong> hybrid orbitals optimized for bonding.<br /><br />
            {hybridType === "sp" && <><span style={{ color: T.eo_e }}><strong>sp:</strong></span> 1s + 1p {"→"} 2 hybrids at 180{"°"} (linear). Used in CO{"₂"}, acetylene. 2 leftover p orbitals form {"π"} bonds.</>}
            {hybridType === "sp2" && <><span style={{ color: T.eo_e }}><strong>sp{"²"}:</strong></span> 1s + 2p {"→"} 3 hybrids at 120{"°"} (planar). Used in graphene, ethylene. 1 leftover p forms {"π"} bond above/below.</>}
            {hybridType === "sp3" && <><span style={{ color: T.eo_e }}><strong>sp{"³"}:</strong></span> 1s + 3p {"→"} 4 hybrids at 109.5{"°"} (tetrahedral). Used in diamond, Si, ZnTe, GaAs. All form {"σ"} bonds. This is the bonding in ALL zincblende semiconductors.</>}
            <br /><br />
            <strong>Before:</strong> s and p have different shapes {"→"} <strong>After {hybridType}:</strong> {data.n} equivalent orbitals, each holding 1 electron for bonding.
            The hybrid shape determines crystal structure: sp{"³"} {"→"} tetrahedral, sp{"²"} {"→"} planar, sp {"→"} linear.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1931, Linus Pauling introduced the concept of hybridization to explain a puzzle: carbon has two 2s and two 2p electrons, yet methane (CH{"₄"}) has four identical bonds arranged tetrahedrally. Pauling showed that atomic orbitals can mathematically "mix" to form equivalent hybrid orbitals pointing in optimal directions. This idea was later applied to semiconductors — sp{"³"} hybridization explains why silicon, germanium, and zincblende compounds all adopt tetrahedral crystal structures with bond angles of 109.5{"°"}.
          </div>
        </div>

        <div style={{ background: "#fef9c3", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
            sp{"³"} hybridization is WHY zincblende semiconductors (ZnTe, CdTe, GaAs, CZTS) form
            tetrahedral crystal structures. Each atom forms 4 equivalent bonds at 109.5 degrees.
          </div>
        </div>

        <div style={{
          background: `${T.eo_valence}11`, border: `1px solid ${T.eo_valence}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_valence, marginBottom: 4 }}>Coming Next: Electron Origins {"→"}</div>
          <div style={{ color: T.ink }}>
            With bonding and orbital mixing understood, we can now trace where each electron in a real semiconductor comes from {"—"} how each atom contributes its valence electrons to build the crystal{"'"}s electronic structure.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function MolecularOrbitalSection() {
  const [stage, setStage] = useState(1);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.1);
  const transT = Math.min((frame % 100) / 60, 1);

  const stageInfo = {
    1: {
      title: "Two Isolated Atoms",
      desc: "Each atom has its own atomic orbital at the same energy. Electrons are localized on each atom.",
    },
    2: {
      title: "Molecular Orbitals (2 atoms)",
      desc: "When atoms bond, orbitals overlap. Constructive interference -> bonding MO (lower energy). Destructive -> antibonding MO (higher energy).",
    },
    3: {
      title: "4 Atoms -> 4 Levels",
      desc: "More atoms = more MOs. N atoms produce N molecular orbitals, spreading into bonding and antibonding groups.",
    },
    4: {
      title: "N Atoms -> Energy Bands",
      desc: "In a crystal (N~10^23), discrete levels merge into continuous bands. Bonding MOs -> valence band. Antibonding MOs -> conduction band.",
    },
  };

  const info = stageInfo[stage];

  const drawLevel = (x, y, w, color, label, filled, key) => (
    <g key={key}>
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={color} strokeWidth={2.5} />
      {filled && (
        <>
          <text x={x - 6} y={y - 5} fontSize={10} fill={color}>
            {"↑"}
          </text>
          <text x={x + 2} y={y - 5} fontSize={10} fill={color}>
            {"↓"}
          </text>
        </>
      )}
      {label && (
        <text x={x + w / 2 + 5} y={y + 4} fontSize={9} fill={T.muted}>
          {label}
        </text>
      )}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Molecular orbital theory is like what happens when two guitar strings vibrate near each other. They can vibrate in phase (both moving the same direction = bonding orbital, lower energy, stable) or out of phase (moving opposite = antibonding orbital, higher energy, unstable). When two atoms approach, their atomic orbitals combine the same way — creating bonding MOs that hold atoms together and antibonding MOs that push them apart. The net result determines if the molecule is stable.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ minWidth: 340 }}>
        <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
            {info.title}
          </text>

          {/* Energy axis */}
          <line x1={30} y1={40} x2={30} y2={280} stroke={T.muted} strokeWidth={1} />
          <text x={12} y={160} fontSize={9} fill={T.muted} transform="rotate(-90,12,160)">
            Energy
          </text>
          <text x={30} y={38} fontSize={8} fill={T.muted}>
            {"↑"}
          </text>

          {stage === 1 && (
            <>
              {/* Two isolated atoms with same energy level */}
              <circle cx={120} cy={160} r={22 * pulse} fill={T.eo_e} opacity={0.2} stroke={T.eo_e} strokeWidth={1.5} />
              <circle cx={220} cy={160} r={22 * pulse} fill={T.eo_hole} opacity={0.2} stroke={T.eo_hole} strokeWidth={1.5} />
              <text x={120} y={164} textAnchor="middle" fontSize={11} fontWeight={600} fill={T.eo_e}>
                A
              </text>
              <text x={220} y={164} textAnchor="middle" fontSize={11} fontWeight={600} fill={T.eo_hole}>
                B
              </text>
              {drawLevel(120, 160, 50, T.eo_e, "E_atom", true, "l1")}
              {drawLevel(220, 160, 50, T.eo_hole, "E_atom", true, "l2")}
            </>
          )}

          {stage === 2 && (
            <>
              {/* Bonding + antibonding */}
              {drawLevel(170, 210, 80, T.eo_valence, "σ (bonding)", true, "bond")}
              {drawLevel(170, 100, 80, T.eo_gap, "σ* (antibonding)", false, "antibond")}
              <text x={280} y={214} fontSize={9} fill={T.eo_valence}>
                HOMO
              </text>
              <text x={280} y={104} fontSize={9} fill={T.eo_gap}>
                LUMO
              </text>
              {/* Dashed lines connecting to atomic levels */}
              <line x1={80} y1={160} x2={130} y2={210} stroke={T.dim} strokeDasharray="3,3" />
              <line x1={80} y1={160} x2={130} y2={100} stroke={T.dim} strokeDasharray="3,3" />
              <line x1={260} y1={160} x2={210} y2={210} stroke={T.dim} strokeDasharray="3,3" />
              <line x1={260} y1={160} x2={210} y2={100} stroke={T.dim} strokeDasharray="3,3" />
              {drawLevel(80, 160, 40, T.eo_e, "", true, "al")}
              {drawLevel(260, 160, 40, T.eo_hole, "", true, "ar")}
              {/* Gap arrow */}
              <line x1={155} y1={200} x2={155} y2={110} stroke={T.eo_gap} strokeWidth={1.5} markerEnd="url(#arrowMO)" />
              <text x={137} y={158} fontSize={9} fill={T.eo_gap} fontWeight={600}>
                Gap
              </text>
              <defs>
                <marker id="arrowMO" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={T.eo_gap} />
                </marker>
              </defs>
            </>
          )}

          {stage === 3 && (
            <>
              {/* 4 levels splitting */}
              {[240, 220, 100, 80].map((y, i) => {
                const isBonding = i < 2;
                return drawLevel(170, y, 70, isBonding ? T.eo_valence : T.eo_gap, i === 0 ? "bonding" : i === 3 ? "antibonding" : "", isBonding, `lv${i}`);
              })}
              <rect x={140} y={105} width={60} height={10} fill={T.eo_gap} opacity={0.08} />
              <rect x={140} y={215} width={60} height={30} fill={T.eo_valence} opacity={0.08} />
              {/* Gap label */}
              <line x1={220} y1={215} x2={220} y2={105} stroke={T.eo_gap} strokeDasharray="3,3" />
              <text x={228} y={160} fontSize={9} fill={T.eo_gap}>
                Gap
              </text>
            </>
          )}

          {stage === 4 && (
            <>
              {/* Continuous bands */}
              <rect x={100} y={190} width={140} height={70} rx={4} fill={T.eo_valence} opacity={0.2} stroke={T.eo_valence} strokeWidth={1.5} />
              <rect x={100} y={60} width={140} height={60} rx={4} fill={T.eo_cond} opacity={0.15} stroke={T.eo_cond} strokeWidth={1.5} />
              {/* Fill lines in bands */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`vb${i}`} x1={108} y1={195 + i * 5} x2={232} y2={195 + i * 5} stroke={T.eo_valence} strokeWidth={0.7} opacity={0.5} />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`cb${i}`} x1={108} y1={65 + i * 6} x2={232} y2={65 + i * 6} stroke={T.eo_cond} strokeWidth={0.7} opacity={0.3} />
              ))}
              <text x={170} y={230} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_valence}>
                Valence Band
              </text>
              <text x={170} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill={T.eo_cond}>
                Conduction Band
              </text>
              <text x={260} y={260} fontSize={9} fill={T.eo_valence}>
                VBM
              </text>
              <text x={260} y={72} fontSize={9} fill={T.eo_cond}>
                CBM
              </text>
              {/* Band gap */}
              <line x1={80} y1={190} x2={80} y2={120} stroke={T.eo_gap} strokeWidth={2} />
              <line x1={75} y1={190} x2={85} y2={190} stroke={T.eo_gap} strokeWidth={2} />
              <line x1={75} y1={120} x2={85} y2={120} stroke={T.eo_gap} strokeWidth={2} />
              <text x={58} y={158} fontSize={9} fill={T.eo_gap} fontWeight={700}>
                E_g
              </text>
              {/* Photon excitation */}
              {frame % 80 < 40 && (
                <g>
                  <line x1={170} y1={190} x2={170} y2={120} stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="4,2" />
                  <circle cx={170} cy={lerp(190, 120, (frame % 40) / 40)} r={4} fill={T.eo_photon} />
                  <text x={180} y={155} fontSize={8} fill={T.eo_photon}>
                    h{"ν"}
                  </text>
                </g>
              )}
            </>
          )}
        </svg>

        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => { setStage(s); setFrame(0); }}
              style={{
                flex: 1,
                padding: "5px 0",
                fontSize: 11,
                fontFamily: "monospace",
                fontWeight: stage === s ? 700 : 400,
                background: stage === s ? T.eo_e : T.surface,
                color: stage === s ? "#fff" : T.ink,
                border: `1px solid ${stage === s ? T.eo_e : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Stage {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Molecular Orbital Theory</div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 12, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>
            Stage {stage}: {info.title}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{info.desc}</div>
        </div>

        <div style={{ fontSize: 11, marginBottom: 8, fontWeight: 600 }}>Progression</div>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${T.border}` }}>
              {["Atoms", "Levels", "Labels"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "4px 6px", color: T.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "1 AO", "Atomic orbital"],
              ["2", "2 MOs", "HOMO / LUMO"],
              ["4", "4 MOs", "Bonding / Antibonding"],
              ["N", "N levels", "VBM / CBM"],
            ].map(([a, l, lab], i) => (
              <tr
                key={a}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  background: stage === i + 1 ? "#eff6ff" : "transparent",
                }}
              >
                <td style={{ padding: "4px 6px" }}>{a}</td>
                <td style={{ padding: "4px 6px" }}>{l}</td>
                <td style={{ padding: "4px 6px", color: T.eo_e }}>{lab}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5 }}>
            <strong>HOMO</strong> (Highest Occupied MO) {"→"} becomes <strong>VBM</strong> (Valence Band Maximum)
            <br />
            <strong>LUMO</strong> (Lowest Unoccupied MO) {"→"} becomes <strong>CBM</strong> (Conduction Band Minimum)
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_cond }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In the 1920s-30s, Robert Mulliken and Friedrich Hund developed molecular orbital theory, challenging G.N. Lewis's picture of electrons localized between atoms. They showed that electrons belong to the entire molecule, not individual bonds. This was controversial but explained spectra that Lewis's model could not. When extended from molecules to infinite crystals, MO theory naturally becomes band theory -- the foundation of all semiconductor physics.
          </div>
        </div>

        <div style={{ background: "#fef9c3", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
            This is the origin of bands. Bonding orbitals {"→"} valence band. Antibonding {"→"} conduction band.
            The gap between them is the band gap E_g. For ZnTe, E_g = 2.26 eV.
          </div>
        </div>

        <div style={{
          background: `${T.eo_cond}11`, border: `1px solid ${T.eo_cond}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_cond, marginBottom: 4 }}>Coming Next: Crystal Symmetry {"→"}</div>
          <div style={{ color: T.ink }}>
            When billions of atoms arrange into a crystal, their molecular orbitals merge into bands. But the crystal's symmetry determines which orbital combinations are allowed — and symmetry operations define the repeating unit cell.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function CrystalSymmetrySection() {
  const [lattice, setLattice] = useState("Zincblende");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 60);
    return () => clearInterval(id);
  }, []);

  const angle = (frame * 0.8) % 360;
  const cosA = Math.cos((angle * Math.PI) / 180);
  const sinA = Math.sin((angle * Math.PI) / 180);
  const cosB = Math.cos((25 * Math.PI) / 180);
  const sinB = Math.sin((25 * Math.PI) / 180);

  const project = (x, y, z) => {
    const rx = x * cosA - z * sinA;
    const rz = x * sinA + z * cosA;
    const ry2 = y * cosB - rz * sinB;
    const px = 170 + rx * 55;
    const py = 175 - ry2 * 55;
    const depth = rz * cosB + y * sinB;
    return { px, py, depth };
  };

  const latticeData = {
    "Simple Cubic": {
      atoms: [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]],
      types: [0,0,0,0,0,0,0,0],
      perCell: 1, coord: 6, packing: "52.4%", spaceGroup: "Pm-3m (#221)",
      examples: "Po (only element), alpha-Po",
    },
    BCC: {
      atoms: [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1],[0.5,0.5,0.5]],
      types: [0,0,0,0,0,0,0,0,1],
      perCell: 2, coord: 8, packing: "68.0%", spaceGroup: "Im-3m (#229)",
      examples: "Fe, W, Cr, Na, K",
    },
    FCC: {
      atoms: [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1],
              [0.5,0.5,0],[0.5,0,0.5],[0,0.5,0.5],[1,0.5,0.5],[0.5,1,0.5],[0.5,0.5,1]],
      types: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      perCell: 4, coord: 12, packing: "74.0%", spaceGroup: "Fm-3m (#225)",
      examples: "Cu, Al, Au, Ag, Ni",
    },
    Zincblende: {
      atoms: [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1],
              [0.5,0.5,0],[0.5,0,0.5],[0,0.5,0.5],[1,0.5,0.5],[0.5,1,0.5],[0.5,0.5,1],
              [0.25,0.25,0.25],[0.75,0.75,0.25],[0.75,0.25,0.75],[0.25,0.75,0.75]],
      types: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
      perCell: 8, coord: 4, packing: "34.0%", spaceGroup: "F-43m (#216)",
      examples: "ZnTe, CdTe, GaAs, InP, Si",
    },
  };

  const data = latticeData[lattice];

  const edges = [
    [0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7],
  ];

  const projAtoms = data.atoms.map(([x, y, z]) => ({
    ...project(x - 0.5, y - 0.5, z - 0.5),
    type: data.types[data.atoms.indexOf([x, y, z])],
  }));

  const projEdgeCorners = [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]].map(
    ([x, y, z]) => project(x - 0.5, y - 0.5, z - 0.5)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Crystal symmetry is like wallpaper patterns. Just as a wallpaper designer creates a beautiful pattern by repeating a small tile in a specific arrangement, nature builds crystals by stacking identical unit cells in 3D. The unit cell is the smallest 'tile' that contains all the information. The 14 Bravais lattices are like 14 fundamental tile shapes. Knowing the tile tells you everything about the full wall — that's why crystallographers obsess over unit cells.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ minWidth: 340 }}>
        <svg viewBox="0 0 340 340" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
            {lattice} Structure
          </text>

          {/* Unit cell edges */}
          {edges.map(([a, b], i) => (
            <line
              key={`e${i}`}
              x1={projEdgeCorners[a].px}
              y1={projEdgeCorners[a].py}
              x2={projEdgeCorners[b].px}
              y2={projEdgeCorners[b].py}
              stroke={T.border}
              strokeWidth={1}
              opacity={0.6}
            />
          ))}

          {/* Atoms sorted by depth */}
          {data.atoms
            .map(([x, y, z], i) => {
              const p = project(x - 0.5, y - 0.5, z - 0.5);
              return { ...p, type: data.types[i], idx: i };
            })
            .sort((a, b) => a.depth - b.depth)
            .map((atom) => {
              const isAnion = atom.type === 0;
              const color = lattice === "Zincblende" ? (isAnion ? T.eo_e : T.eo_hole) : T.eo_e;
              const r = lerp(5, 10, (atom.depth + 1) / 2);
              return (
                <circle
                  key={atom.idx}
                  cx={atom.px}
                  cy={atom.py}
                  r={r}
                  fill={color}
                  opacity={lerp(0.4, 0.9, (atom.depth + 1) / 2)}
                  stroke={color}
                  strokeWidth={1}
                />
              );
            })}

          {/* Lattice parameter labels */}
          <text x={170} y={310} textAnchor="middle" fontSize={10} fill={T.muted}>
            a = b = c{lattice === "Simple Cubic" ? "" : " | α=β=γ=90°"}
          </text>

          {/* Tetrahedral bonds for zincblende */}
          {lattice === "Zincblende" && (
            <>
              {[[14, 0], [14, 8], [14, 10], [14, 9]].map(([a, b], i) => {
                const pa = project(data.atoms[a][0] - 0.5, data.atoms[a][1] - 0.5, data.atoms[a][2] - 0.5);
                const pb = project(data.atoms[b][0] - 0.5, data.atoms[b][1] - 0.5, data.atoms[b][2] - 0.5);
                return (
                  <line
                    key={`tb${i}`}
                    x1={pa.px}
                    y1={pa.py}
                    x2={pb.px}
                    y2={pb.py}
                    stroke={T.eo_valence}
                    strokeWidth={1.5}
                    opacity={0.5}
                    strokeDasharray="3,2"
                  />
                );
              })}
            </>
          )}

          {/* Legend */}
          {lattice === "Zincblende" && (
            <>
              <circle cx={30} cy={330} r={5} fill={T.eo_e} />
              <text x={40} y={334} fontSize={9} fill={T.muted}>
                Anion (Te)
              </text>
              <circle cx={110} cy={330} r={5} fill={T.eo_hole} />
              <text x={120} y={334} fontSize={9} fill={T.muted}>
                Cation (Zn)
              </text>
            </>
          )}
        </svg>

        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
          {Object.keys(latticeData).map((lt) => (
            <button
              key={lt}
              onClick={() => setLattice(lt)}
              style={{
                flex: 1,
                padding: "4px 2px",
                fontSize: 10,
                fontFamily: "monospace",
                fontWeight: lattice === lt ? 700 : 400,
                background: lattice === lt ? T.eo_core : T.surface,
                color: lattice === lt ? "#fff" : T.ink,
                border: `1px solid ${lattice === lt ? T.eo_core : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {lt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Crystal Symmetry</div>

        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
            {[
              ["Space Group", data.spaceGroup],
              ["Atoms / unit cell", String(data.perCell)],
              ["Coordination #", String(data.coord)],
              ["Packing fraction", data.packing],
              ["Examples", data.examples],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "5px 6px", fontWeight: 600, color: T.muted, width: "40%" }}>{k}</td>
                <td style={{ padding: "5px 6px", color: T.eo_e }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Bravais Lattice Comparison</div>
          <table style={{ width: "100%", fontSize: 9, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Lattice", "#/cell", "CN", "Pack%"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "3px 4px", color: T.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["SC", 1, 6, "52.4"],
                ["BCC", 2, 8, "68.0"],
                ["FCC", 4, 12, "74.0"],
                ["ZB", 8, 4, "34.0"],
              ].map(([l, n, cn, p]) => (
                <tr
                  key={l}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background:
                      (l === "SC" && lattice === "Simple Cubic") ||
                      (l === "BCC" && lattice === "BCC") ||
                      (l === "FCC" && lattice === "FCC") ||
                      (l === "ZB" && lattice === "Zincblende")
                        ? "#eff6ff"
                        : "transparent",
                  }}
                >
                  <td style={{ padding: "3px 4px", fontWeight: 600 }}>{l}</td>
                  <td style={{ padding: "3px 4px" }}>{n}</td>
                  <td style={{ padding: "3px 4px" }}>{cn}</td>
                  <td style={{ padding: "3px 4px" }}>{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_cond }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1850, Auguste Bravais classified all 14 possible lattice types in three dimensions -- a purely mathematical achievement. Decades later, in 1913, the Braggs used X-ray diffraction to reveal actual crystal structures for the first time. The zincblende structure of ZnS was among the earliest solved, confirming tetrahedral atomic arrangement.
          </div>
        </div>

        <div style={{ background: "#fef9c3", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
            Zincblende (F-43m) is THE structure for most important semiconductors: Si (diamond variant),
            GaAs, ZnTe, CdTe. The tetrahedral coordination arises directly from sp{"³"} hybridization.
          </div>
        </div>

        <div style={{
          background: `${T.eo_cond}11`, border: `1px solid ${T.eo_cond}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_cond, marginBottom: 4 }}>Coming Next: Reciprocal Space {"→"}</div>
          <div style={{ color: T.ink }}>
            Crystal symmetry in real space has a mathematical mirror: reciprocal space. X-ray diffraction patterns directly reveal the reciprocal lattice, and the Brillouin zone defines where we calculate electronic band structures.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function ReciprocalSpaceSection() {
  const [showReciprocal, setShowReciprocal] = useState(false);
  const [frame, setFrame] = useState(0);
  const [latticeType, setLatticeType] = useState("FCC");

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const transitionT = Math.min(frame / 40, 1);
  const tDir = showReciprocal ? transitionT : 1 - transitionT;
  const pulse = 0.95 + 0.05 * Math.sin(frame * 0.1);

  const ctrX = 170;
  const ctrY = 160;

  const realA1 = [50, 0];
  const realA2 = latticeType === "FCC" ? [25, -43] : latticeType === "BCC" ? [0, -50] : [50, 0];
  const realA2actual = latticeType === "Square" ? [0, -50] : realA2;

  const recipB1 = latticeType === "FCC" ? [40, 23] : latticeType === "BCC" ? [50, 0] : [50, 0];
  const recipB2 = latticeType === "FCC" ? [0, 46] : latticeType === "BCC" ? [0, 50] : [0, -50];

  const basisX = tDir < 0.5 ? realA1 : recipB1;
  const basisY = tDir < 0.5 ? realA2actual : recipB2;

  const bzPoints = latticeType === "FCC"
    ? [
        [0, -46], [40, -23], [40, 23], [0, 46], [-40, 23], [-40, -23],
      ]
    : latticeType === "BCC"
      ? [
          [-25, -43], [25, -43], [50, 0], [25, 43], [-25, 43], [-50, 0],
        ]
      : [
          [-25, -25], [25, -25], [25, 25], [-25, 25],
        ];

  const highSymPts = latticeType === "FCC"
    ? [
        { label: "Γ", x: 0, y: 0 },
        { label: "X", x: 40, y: 0 },
        { label: "L", x: 20, y: -35 },
        { label: "K", x: 35, y: -18 },
        { label: "W", x: 40, y: -23 },
      ]
    : [
        { label: "Γ", x: 0, y: 0 },
        { label: "X", x: 25, y: 0 },
        { label: "M", x: 25, y: -25 },
      ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Reciprocal space is like sheet music for a crystal. Real space shows you the actual atoms and their positions (like seeing musicians on a stage). Reciprocal space shows you the 'frequencies' and 'wavelengths' that matter — the spatial periodicities of the crystal (like reading the musical score). X-ray diffraction patterns directly photograph reciprocal space. Brillouin zones are like octaves — they organize all possible wavelengths into a compact, repeating framework.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ minWidth: 340 }}>
        <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 340 }}>
          <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
            {showReciprocal ? "Reciprocal Space" : "Real Space"} ({latticeType})
          </text>

          {/* Lattice points */}
          {!showReciprocal &&
            Array.from({ length: 7 }).map((_, i) =>
              Array.from({ length: 7 }).map((_, j) => {
                const ni = i - 3;
                const nj = j - 3;
                const px = ctrX + ni * realA1[0] / 2 + nj * realA2actual[0] / 2;
                const py = ctrY + ni * realA1[1] / 2 + nj * realA2actual[1] / 2;
                if (px < 20 || px > 320 || py < 30 || py > 300) return null;
                return (
                  <circle
                    key={`r${i}${j}`}
                    cx={px}
                    cy={py}
                    r={4 * pulse}
                    fill={T.eo_e}
                    opacity={0.6}
                  />
                );
              })
            )}

          {/* Basis vectors in real space */}
          {!showReciprocal && (
            <>
              <line x1={ctrX} y1={ctrY} x2={ctrX + realA1[0]} y2={ctrY + realA1[1]} stroke={T.eo_hole} strokeWidth={2.5} markerEnd="url(#arrowRS)" />
              <text x={ctrX + realA1[0] + 8} y={ctrY + realA1[1] + 4} fontSize={11} fill={T.eo_hole} fontWeight={700}>
                a{"₁"}
              </text>
              <line x1={ctrX} y1={ctrY} x2={ctrX + realA2actual[0]} y2={ctrY + realA2actual[1]} stroke={T.eo_valence} strokeWidth={2.5} markerEnd="url(#arrowRS2)" />
              <text x={ctrX + realA2actual[0] + 8} y={ctrY + realA2actual[1] + 4} fontSize={11} fill={T.eo_valence} fontWeight={700}>
                a{"₂"}
              </text>
            </>
          )}

          {/* Reciprocal space */}
          {showReciprocal && (
            <>
              {/* Reciprocal lattice points */}
              {Array.from({ length: 7 }).map((_, i) =>
                Array.from({ length: 7 }).map((_, j) => {
                  const ni = i - 3;
                  const nj = j - 3;
                  const px = ctrX + ni * recipB1[0] / 2 + nj * recipB2[0] / 2;
                  const py = ctrY + ni * recipB1[1] / 2 + nj * recipB2[1] / 2;
                  if (px < 20 || px > 320 || py < 30 || py > 300) return null;
                  return (
                    <circle
                      key={`k${i}${j}`}
                      cx={px}
                      cy={py}
                      r={3}
                      fill={T.eo_core}
                      opacity={0.5}
                    />
                  );
                })
              )}

              {/* First Brillouin zone */}
              <polygon
                points={bzPoints.map(([x, y]) => `${ctrX + x},${ctrY + y}`).join(" ")}
                fill={T.eo_cond}
                opacity={0.1}
                stroke={T.eo_cond}
                strokeWidth={2}
              />

              {/* High-symmetry points */}
              {highSymPts.map((pt) => (
                <g key={pt.label}>
                  <circle cx={ctrX + pt.x} cy={ctrY + pt.y} r={5} fill={T.eo_gap} opacity={0.8} />
                  <text x={ctrX + pt.x + 8} y={ctrY + pt.y + 4} fontSize={10} fontWeight={700} fill={T.eo_gap}>
                    {pt.label}
                  </text>
                </g>
              ))}

              {/* G->X->L path */}
              {latticeType === "FCC" && (
                <>
                  <line x1={ctrX} y1={ctrY} x2={ctrX + 40} y2={ctrY} stroke={T.eo_photon} strokeWidth={2} opacity={0.7} />
                  <line x1={ctrX + 40} y1={ctrY} x2={ctrX + 20} y2={ctrY - 35} stroke={T.eo_photon} strokeWidth={2} opacity={0.7} />
                  <line x1={ctrX + 20} y1={ctrY - 35} x2={ctrX} y2={ctrY} stroke={T.eo_photon} strokeWidth={2} opacity={0.7} strokeDasharray="4,2" />
                </>
              )}

              {/* Basis vectors */}
              <line x1={ctrX} y1={ctrY} x2={ctrX + recipB1[0]} y2={ctrY - recipB1[1]} stroke={T.eo_hole} strokeWidth={2} markerEnd="url(#arrowRS)" />
              <text x={ctrX + recipB1[0] + 8} y={ctrY - recipB1[1] + 4} fontSize={11} fill={T.eo_hole} fontWeight={700}>
                b{"₁"}
              </text>
              <line x1={ctrX} y1={ctrY} x2={ctrX + recipB2[0]} y2={ctrY - recipB2[1]} stroke={T.eo_valence} strokeWidth={2} markerEnd="url(#arrowRS2)" />
              <text x={ctrX + recipB2[0] + 8} y={ctrY - recipB2[1] + 4} fontSize={11} fill={T.eo_valence} fontWeight={700}>
                b{"₂"}
              </text>
            </>
          )}

          <defs>
            <marker id="arrowRS" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill={T.eo_hole} />
            </marker>
            <marker id="arrowRS2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill={T.eo_valence} />
            </marker>
          </defs>

          {/* Relationship formula */}
          <text x={170} y={300} textAnchor="middle" fontSize={10} fill={T.muted}>
            b{"ᵢ"} {"·"} a{"ⱼ"} = 2{"π"}{"δ"}{"ᵢⱼ"}
          </text>

          <text x={170} y={315} textAnchor="middle" fontSize={9} fill={T.dim}>
            (Reciprocal lattice vectors are orthogonal to real-space planes)
          </text>
        </svg>

        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button
            onClick={() => { setShowReciprocal(false); setFrame(0); }}
            style={{
              flex: 1,
              padding: "5px 0",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: !showReciprocal ? 700 : 400,
              background: !showReciprocal ? T.eo_e : T.surface,
              color: !showReciprocal ? "#fff" : T.ink,
              border: `1px solid ${!showReciprocal ? T.eo_e : T.border}`,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Real Space
          </button>
          <button
            onClick={() => { setShowReciprocal(true); setFrame(0); }}
            style={{
              flex: 1,
              padding: "5px 0",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: showReciprocal ? 700 : 400,
              background: showReciprocal ? T.eo_core : T.surface,
              color: showReciprocal ? "#fff" : T.ink,
              border: `1px solid ${showReciprocal ? T.eo_core : T.border}`,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Reciprocal Space
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {["FCC", "BCC", "Square"].map((lt) => (
            <button
              key={lt}
              onClick={() => setLatticeType(lt)}
              style={{
                flex: 1,
                padding: "4px 0",
                fontSize: 10,
                fontFamily: "monospace",
                background: latticeType === lt ? T.eo_valence : T.surface,
                color: latticeType === lt ? "#fff" : T.ink,
                border: `1px solid ${latticeType === lt ? T.eo_valence : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {lt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 280 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Reciprocal Space</div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 12, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Why Reciprocal Space?</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Electron wavefunctions in crystals are Bloch waves labeled by wavevector <strong>k</strong>.
            The set of all unique k-vectors forms the first <strong>Brillouin zone</strong> (BZ) in reciprocal space.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Band Structure = E(k)</div>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5 }}>
            Band structure plots E(k) along high-symmetry paths in the BZ:
          </div>
          <div style={{ fontSize: 11, color: T.eo_e, fontWeight: 600, marginTop: 4 }}>
            {"Γ"} {"→"} X {"→"} L {"→"} {"Γ"} {"→"} K
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4, lineHeight: 1.5 }}>
            {"Γ"} = (0,0,0) = zone center{"\n"}
            X = (1,0,0){"·"}{"π"}/a = zone edge along [100]{"\n"}
            L = ({"½"},{"½"},{"½"}){"·"}{"π"}/a = zone edge along [111]
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>High-Symmetry Points (FCC BZ)</div>
          <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Γ", "(0,0,0)", "Zone center"],
                ["X", "(1,0,0)π/a", "Square face center"],
                ["L", "(½,½,½)π/a", "Hexagonal face center"],
                ["K", "(¾,¾,0)π/a", "Edge midpoint"],
                ["W", "(1,½,0)π/a", "Corner point"],
              ].map(([pt, coord, desc]) => (
                <tr key={pt} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "3px 5px", fontWeight: 700, color: T.eo_gap }}>{pt}</td>
                  <td style={{ padding: "3px 5px", color: T.eo_e }}>{coord}</td>
                  <td style={{ padding: "3px 5px", color: T.muted }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_cond }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Max von Laue's 1912 X-ray diffraction experiment proved that crystals are periodic arrays of atoms. Leon Brillouin (1930) introduced zones in reciprocal space, showing that a crystal's Fourier transform determines its electronic properties. The Brillouin zone boundaries are where electron waves undergo Bragg reflection, opening up band gaps -- connecting diffraction physics directly to electronic structure.
          </div>
        </div>

        <div style={{ background: "#fef9c3", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
          <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
            Direct vs indirect band gap is determined by whether VBM and CBM are at the same k-point.
            ZnTe: direct gap at {"Γ"} (good for optics). Si: indirect gap {"Γ"}{"→"}X (poor absorber).
            This controls optical absorption strength.
          </div>
        </div>

        <div style={{
          background: `${T.eo_cond}11`, border: `1px solid ${T.eo_cond}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_cond, marginBottom: 4 }}>Coming Next: Energy Bands {"→"}</div>
          <div style={{ color: T.ink }}>
            The Brillouin zone gives us the stage. Now we calculate what happens on it — electrons moving through the periodic potential form energy bands, with allowed and forbidden energy ranges that define metals, semiconductors, and insulators.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXISTING: ENERGY BANDS (Section 11)
// ═══════════════════════════════════════════════════════════════════════════

// ── SECTION 3: ENERGY BANDS ────────────────────────────────────────────────
function BandSection() {
  const [temp, setTemp] = useState(0);   // 0=0K, 1=300K, 2=hot
  const [light, setLight] = useState(false);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 40);
    return () => clearInterval(id);
  }, []);

  const kT = [0, 0.026, 0.08][temp];
  const Egap = 2.26;
  const thermalExcited = temp === 0 ? 0 : temp === 1 ? 1 : 4;
  const lightExcited = light ? 3 : 0;
  const totalExcited = thermalExcited + lightExcited;

  // SVG band diagram
  const VBtop = 240, CBbot = 100, W = 320;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox>
          {`Energy bands are like floors in a building. In a single atom, electrons live on specific floors (discrete energy levels). But when trillions of atoms pack into a crystal, their floors merge into continuous ramps (bands). The valence band is the ground floor — full of residents (electrons). The conduction band is the upper floor — empty, with room to roam freely. The band gap is the staircase between them: easy to climb in semiconductors, impossible in insulators, nonexistent in metals.`}
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* Band diagram */}
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />

          {/* Valence band */}
          <rect x={20} y={VBtop} width={W - 40} height={60} rx={4}
            fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
          <text x={30} y={VBtop + 22} fill={T.eo_valence} fontSize={12} fontWeight="bold">Valence Band</text>
          <text x={30} y={VBtop + 38} fill={T.muted} fontSize={10}>All states filled with electrons</text>
          <text x={30} y={VBtop + 52} fill={T.muted} fontSize={10}>from Zn and Te atoms</text>

          {/* Conduction band */}
          <rect x={20} y={40} width={W - 40} height={55} rx={4}
            fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
          <text x={30} y={60} fill={T.eo_cond} fontSize={12} fontWeight="bold">Conduction Band</text>
          <text x={30} y={76} fill={T.muted} fontSize={10}>Empty in pure crystal</text>
          <text x={30} y={90} fill={T.muted} fontSize={10}>Free electrons here = conductivity</text>

          {/* Band gap */}
          <rect x={20} y={CBbot} width={W - 40} height={VBtop - CBbot} rx={0}
            fill={T.bg} />
          <line x1={20} y1={(CBbot + VBtop) / 2} x2={280} y2={(CBbot + VBtop) / 2}
            stroke={T.border} strokeDasharray="4 4" />
          <text x={W / 2} y={(CBbot + VBtop) / 2 + 4} textAnchor="middle" fill={T.eo_gap} fontSize={11} fontWeight="bold">GAP</text>
          <text x={W / 2} y={(CBbot + VBtop) / 2 + 18} textAnchor="middle" fill={T.muted} fontSize={10} fontWeight="bold">E = {Egap} eV</text>

          {/* Gap label with arrow */}
          <line x1={W / 2 + 60} y1={CBbot + 2} x2={W / 2 + 60} y2={VBtop - 2}
            stroke={T.eo_gap} strokeWidth={1.5} />
          <text x={170} y={(CBbot + VBtop) / 2 - 6} textAnchor="middle" fill={T.eo_gap} fontSize={10}>
            2.26 eV forbidden zone
          </text>

          {/* Excited electrons */}
          {Array.from({ length: totalExcited }, (_, i) => {
            const isLight = i >= thermalExcited;
            const ex = 50 + i * 35;
            const eyStart = VBtop + 30;
            const eyEnd = 60 + i * 5;
            const progress = ((frame * 0.015 + i * 0.5) % 1);
            const bounce = Math.abs(Math.sin(frame * 0.04 + i));
            return (
              <g key={i}>
                {/* Arrow showing excitation */}
                <line x1={ex} y1={eyStart - 5} x2={ex} y2={eyEnd + 5}
                  stroke={isLight ? T.eo_photon : T.eo_hole}
                  strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
                {/* Hole in VB */}
                <circle cx={ex} cy={eyStart} r={5}
                  fill="none" stroke={T.eo_hole} strokeWidth={1.5}
                  opacity={0.8} />
                {/* Electron in CB */}
                <circle cx={ex} cy={eyEnd + bounce * 15} r={5}
                  fill={T.eo_e} opacity={0.9} />
              </g>
            );
          })}

          {/* Filled electrons in VB (dots) */}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i}
              cx={35 + i * 33} cy={VBtop + 32}
              r={5} fill={T.eo_valence} opacity={0.7} />
          ))}
        </svg>

        {/* Controls */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 0.5 }}>Temperature</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["0 K", "300 K", "Hot"].map((t, i) => (
              <button key={i} onClick={() => setTemp(i)} style={{
                flex: 1, padding: "7px 0", borderRadius: 7, fontSize: 12,
                background: temp === i ? T.eo_hole + "22" : T.surface,
                border: `1px solid ${temp === i ? T.eo_hole : T.border}`,
                color: temp === i ? T.eo_hole : T.muted,
                cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>
          <button onClick={() => setLight(l => !l)} style={{
            padding: "8px 0", borderRadius: 7, fontSize: 12,
            background: light ? T.eo_photon + "22" : T.surface,
            border: `1px solid ${light ? T.eo_photon : T.border}`,
            color: light ? T.eo_photon : T.muted,
            cursor: "pointer",
            fontWeight: light ? 700 : 400,
          }}>
            {light ? "☀️ Light ON (photons hitting)" : "🌑 Light OFF"}
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          background: T.surface, borderRadius: 10, padding: 14,
          border: `1px solid ${T.border}`,
        }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 0.5 }}>Current state</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: totalExcited > 0 ? T.eo_e : T.eo_valence, marginBottom: 6 }}>
            {totalExcited} free electrons
          </div>
          <div style={{ fontSize: 12, color: T.muted }}>
            {temp === 0 && !light && "Perfect insulator at 0K — no free carriers"}
            {temp === 1 && !light && "Room temp: tiny thermal excitation (kT=0.026eV << 2.26eV gap)"}
            {temp === 2 && !light && "High temp: more thermal excitation across gap"}
            {light && "Photons exciting electrons across the band gap → solar cell!"}
          </div>
        </div>

        {/* Where electrons come from in each scenario */}
        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 0.5 }}>Where do free electrons come from?</div>
          {[
            { icon: "⚛️", title: "Always: from atom valence electrons", desc: "ALL electrons in the crystal originally came from Zn and Te atoms. Valence band = reservoir of these electrons.", color: T.eo_valence },
            { icon: "🌡️", title: "Thermal: kT energy kicks them up", desc: `At 300K, kT=0.026eV. Gap=2.26eV. Chance = e^(-87) ≈ 10⁻³⁸. Almost zero for ZnTe.`, color: T.eo_hole },
            { icon: "☀️", title: "Light: photon energy > band gap", desc: "Photon of 2.5eV hits a valence electron and kicks it to conduction band. This is photovoltaics!", color: T.eo_photon },
            { icon: "🔧", title: "Defect: missing atom creates gap states", desc: "V_Zn vacancy creates states inside gap. Electrons from Te dangling bonds sit there. Much easier to excite.", color: T.eo_gap },
          ].map(({ icon, title, desc, color }) => (
            <div key={title} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 18, flex: "0 0 24px" }}>{icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_photon }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1928, Felix Bloch solved the Schrodinger equation for electrons in a periodic potential, proving that electrons in crystals form continuous energy bands rather than discrete levels. Alan Wilson (1931) then used band theory to explain why some materials are metals, some insulators, and some -- semiconductors -- fall in between. This framework made the transistor revolution possible.
          </div>
        </div>

        <div style={{
          background: `${T.eo_photon}11`, border: `1px solid ${T.eo_photon}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_photon, marginBottom: 4 }}>Coming Next: Density of States {"→"}</div>
          <div style={{ color: T.ink }}>
            Band structure shows energy vs. momentum. But to predict real properties (optical absorption, conductivity), we need to count how many states exist at each energy — that's the density of states.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK C+D: ELECTRONIC PROPERTIES & THERMODYNAMICS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Section 1: Density of States ───────────────────────────────────────────

function DensityOfStatesSection() {
  const [frame, setFrame] = useState(0);
  const [eFermi, setEFermi] = useState(0.5);
  const [temperature, setTemperature] = useState(300);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const W = 340, H = 320;
  const marginL = 50, marginR = 20, marginT = 20, marginB = 40;
  const plotW = W - marginL - marginR;
  const plotH = H - marginT - marginB;

  const Ev = 0.0;
  const Ec = 1.5;
  const Emin = -2.0;
  const Emax = 4.0;

  const eToY = (e) => marginT + plotH * (1 - (e - Emin) / (Emax - Emin));
  const dosToX = (d) => marginL + d * plotW;

  const dosMax = 1.0;
  const kT = (temperature / 300) * 0.026;

  const fermiDirac = (E) => 1 / (1 + Math.exp((E - (Emin + eFermi * (Emax - Emin))) / Math.max(kT, 0.001)));

  const dosVB = (E) => {
    if (E > Ev || E < Emin) return 0;
    const depth = Ev - E;
    return Math.min(Math.sqrt(depth) * 0.5, dosMax);
  };

  const dosCB = (E) => {
    if (E < Ec || E > Emax) return 0;
    const above = E - Ec;
    return Math.min(Math.sqrt(above) * 0.5, dosMax);
  };

  const totalDos = (E) => dosVB(E) + dosCB(E);

  // Orbital-projected DOS (PDOS) for ZnTe-like material
  const dos_s = (E) => {
    if (E > Ev && E < Ec) return 0;
    if (E <= Ev && E >= Emin) {
      const d = Ev - E;
      return Math.min(0.12 * Math.pow(d, 0.8) * Math.exp(-0.3 * d), dosMax);
    }
    if (E >= Ec && E <= Emax) {
      const a = E - Ec;
      return Math.min(0.35 * Math.sqrt(a) * Math.exp(-0.5 * a), dosMax);
    }
    return 0;
  };
  const dos_p = (E) => {
    if (E > Ev && E < Ec) return 0;
    if (E <= Ev && E >= Emin) {
      const d = Ev - E;
      return Math.min(0.45 * Math.sqrt(d) * Math.exp(-0.15 * d), dosMax);
    }
    if (E >= Ec && E <= Emax) {
      const a = E - Ec;
      return Math.min(0.18 * Math.pow(a, 0.7), dosMax);
    }
    return 0;
  };
  const dos_d = (E) => {
    if (E > Ev && E < Ec) return 0;
    if (E <= Ev && E >= Emin) {
      const d = Ev - E;
      return Math.min(0.25 * Math.exp(-3.0 * Math.pow(d - 1.5, 2)), dosMax);
    }
    if (E >= Ec && E <= Emax) {
      const a = E - Ec;
      return Math.min(0.04 * a, dosMax);
    }
    return 0;
  };

  const steps = 120;
  let dosPath = "";
  let filledPath = "";
  let fermiPath = "";
  let sOrbPath = "", pOrbPath = "", dOrbPath = "";

  const eFermiActual = Emin + eFermi * (Emax - Emin);

  for (let i = 0; i <= steps; i++) {
    const E = Emin + (i / steps) * (Emax - Emin);
    const d = totalDos(E);
    const x = dosToX(d / dosMax);
    const y = eToY(E);
    dosPath += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    // orbital paths
    const sx = dosToX(dos_s(E) / dosMax);
    const px = dosToX(dos_p(E) / dosMax);
    const dx = dosToX(dos_d(E) / dosMax);
    sOrbPath += (i === 0 ? "M" : "L") + sx.toFixed(1) + "," + y.toFixed(1);
    pOrbPath += (i === 0 ? "M" : "L") + px.toFixed(1) + "," + y.toFixed(1);
    dOrbPath += (i === 0 ? "M" : "L") + dx.toFixed(1) + "," + y.toFixed(1);
  }

  let filledPts = [];
  for (let i = 0; i <= steps; i++) {
    const E = Emin + (i / steps) * (Emax - Emin);
    const d = totalDos(E);
    const fE = fermiDirac(E);
    const occupied = d * fE;
    filledPts.push({ x: dosToX(occupied / dosMax), y: eToY(E), E });
  }
  filledPath = "M" + dosToX(0).toFixed(1) + "," + eToY(Emin).toFixed(1);
  filledPts.forEach(p => { filledPath += "L" + p.x.toFixed(1) + "," + p.y.toFixed(1); });
  filledPath += "L" + dosToX(0).toFixed(1) + "," + eToY(Emax).toFixed(1) + "Z";

  for (let i = 0; i <= steps; i++) {
    const E = Emin + (i / steps) * (Emax - Emin);
    const fE = fermiDirac(E);
    const x = marginL + fE * plotW;
    const y = eToY(E);
    fermiPath += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }

  const pulseAlpha = 0.3 + 0.15 * Math.sin(frame * 0.08);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          The density of states is like a histogram of apartment availability in a building. At each 'floor' (energy level), it counts how many 'rooms' (quantum states) exist for electrons. A tall bar means many states are available at that energy — electrons have lots of options. A gap (zero bar) means no states exist — electrons are forbidden there. The Fermi level is like the current waterline: all rooms below are occupied, rooms above are empty (at 0 K).
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

      {/* Left: smaller SVG + controls */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 8 }}>
        <svg width={260} height={245} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: T.surface, borderRadius: 6 }}>
          <rect x={marginL} y={eToY(Ec)} width={plotW} height={eToY(Ev) - eToY(Ec)}
            fill={T.eo_gap} opacity={0.1} />
          <text x={marginL + plotW / 2} y={(eToY(Ec) + eToY(Ev)) / 2 + 4}
            textAnchor="middle" fontSize={12} fill={T.eo_gap} fontFamily="monospace">
            Band Gap
          </text>

          <path d={filledPath} fill={T.eo_valence} opacity={0.3} />

          <path d={"M" + dosToX(0).toFixed(1) + "," + eToY(Emin).toFixed(1) + dosPath.slice(1)}
            fill="none" stroke={T.eo_e} strokeWidth={2} />
          <path d={dosPath + "L" + dosToX(0).toFixed(1) + "," + eToY(Emax).toFixed(1) + "Z"}
            fill={T.eo_e} opacity={0.08} />

          {/* Orbital-resolved DOS curves */}
          <path d={sOrbPath} fill="none" stroke="#4a9eff" strokeWidth={1.3} opacity={0.85} />
          <path d={pOrbPath} fill="none" stroke="#2ecc71" strokeWidth={1.3} opacity={0.85} />
          <path d={dOrbPath} fill="none" stroke="#e67e22" strokeWidth={1.3} opacity={0.85} />

          {/* PDOS Legend */}
          <rect x={marginL + 4} y={marginT + 2} width={90} height={72} rx={3}
            fill={T.surface} stroke={T.border} strokeWidth={0.5} opacity={0.92} />
          <line x1={marginL + 8} y1={marginT + 14} x2={marginL + 22} y2={marginT + 14}
            stroke={T.eo_e} strokeWidth={2} />
          <text x={marginL + 25} y={marginT + 17} fontSize={13} fill={T.muted} fontFamily="monospace">Total</text>
          <line x1={marginL + 8} y1={marginT + 30} x2={marginL + 22} y2={marginT + 30}
            stroke="#4a9eff" strokeWidth={1.3} />
          <text x={marginL + 25} y={marginT + 33} fontSize={13} fill="#4a9eff" fontFamily="monospace">s-orb</text>
          <line x1={marginL + 8} y1={marginT + 46} x2={marginL + 22} y2={marginT + 46}
            stroke="#2ecc71" strokeWidth={1.3} />
          <text x={marginL + 25} y={marginT + 49} fontSize={13} fill="#2ecc71" fontFamily="monospace">p-orb</text>
          <line x1={marginL + 8} y1={marginT + 62} x2={marginL + 22} y2={marginT + 62}
            stroke="#e67e22" strokeWidth={1.3} />
          <text x={marginL + 25} y={marginT + 65} fontSize={13} fill="#e67e22" fontFamily="monospace">d-orb</text>

          <path d={fermiPath} fill="none" stroke={T.eo_photon} strokeWidth={1.5}
            strokeDasharray="4,3" opacity={0.8} />

          <line x1={marginL} y1={eToY(eFermiActual)} x2={marginL + plotW} y2={eToY(eFermiActual)}
            stroke={T.eo_hole} strokeWidth={2} strokeDasharray="6,4" />
          <text x={marginL + plotW + 2} y={eToY(eFermiActual) + 4}
            fontSize={12} fill={T.eo_hole} fontFamily="monospace">E_F</text>

          <line x1={marginL} y1={eToY(Ev)} x2={marginL + plotW} y2={eToY(Ev)}
            stroke={T.eo_valence} strokeWidth={1} opacity={0.5} />
          <text x={marginL - 4} y={eToY(Ev) + 4} textAnchor="end"
            fontSize={12} fill={T.eo_valence} fontFamily="monospace">E_v</text>

          <line x1={marginL} y1={eToY(Ec)} x2={marginL + plotW} y2={eToY(Ec)}
            stroke={T.eo_cond} strokeWidth={1} opacity={0.5} />
          <text x={marginL - 4} y={eToY(Ec) + 4} textAnchor="end"
            fontSize={12} fill={T.eo_cond} fontFamily="monospace">E_c</text>

          <line x1={marginL} y1={marginT} x2={marginL} y2={H - marginB}
            stroke={T.border} strokeWidth={1} />
          <line x1={marginL} y1={H - marginB} x2={W - marginR} y2={H - marginB}
            stroke={T.border} strokeWidth={1} />

          <text x={8} y={H / 2} textAnchor="middle" fontSize={12} fill={T.muted}
            fontFamily="monospace" transform={`rotate(-90,8,${H / 2})`}>Energy (eV)</text>
          <text x={marginL + plotW / 2} y={H - 5} textAnchor="middle" fontSize={12}
            fill={T.muted} fontFamily="monospace">g(E)</text>

          {[Emin, 0, 2, Emax].map((e, i) => (
            <text key={i} x={marginL - 6} y={eToY(e) + 3} textAnchor="end"
              fontSize={11} fill={T.dim} fontFamily="monospace">{e.toFixed(1)}</text>
          ))}

          {temperature > 100 && (
            <circle cx={dosToX(0.5)} cy={eToY(eFermiActual)}
              r={4} fill={T.eo_photon} opacity={pulseAlpha} />
          )}
        </svg>
      </div>

        {/* Controls below SVG */}
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, width: 260, boxSizing: "border-box" }}>
          <div style={{ fontSize: 11, marginBottom: 5 }}>
            <b>Fermi Level E_F:</b>{" "}
            <span style={{ color: T.eo_hole }}>{eFermiActual.toFixed(2)} eV</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={eFermi}
            onChange={e => setEFermi(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ fontSize: 11, marginTop: 8, marginBottom: 5 }}>
            <b>Temperature:</b>{" "}
            <span style={{ color: T.eo_photon }}>{temperature} K</span>
            <span style={{ fontSize: 10, color: T.dim }}> (kT = {kT.toFixed(4)} eV)</span>
          </div>
          <input type="range" min={1} max={2000} step={1} value={temperature}
            onChange={e => setTemperature(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ fontSize: 10, color: T.muted, marginTop: 8, lineHeight: 1.6 }}>
            <span style={{ color: T.eo_photon }}>--- dashed</span>: Fermi-Dirac f(E)<br />
            <span style={{ color: T.eo_valence }}>shaded</span>: occupied g(E)·f(E)<br />
            <span style={{ color: "#4a9eff" }}>s</span> / <span style={{ color: "#2ecc71" }}>p</span> / <span style={{ color: "#e67e22" }}>d</span>: orbital-projected DOS
          </div>
        </div>
      </div>

      {/* Right: text panels — fills remaining width */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_e }}>Density of States (DOS)</div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            The DOS tells us the <b>number of available quantum states per unit energy</b>.
            In a semiconductor, the valence band (VB) is full and the conduction band (CB) is empty at T = 0 K.
          </div>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_photon }}>Historical note</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1953, Leon Van Hove proved that singularities in the DOS correspond to flat regions of E(k). These Van Hove singularities produce sharp peaks measurable by photoemission spectroscopy (XPS/UPS) — bridging band theory and experiment.
          </div>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            In DFT output, DOS tells you where electrons can exist. <b>Peaks</b> mean many states bunched at that energy (flat bands, Van Hove singularities). A <b>gap</b> means no allowed states. <b>Defect states</b> appear as narrow peaks inside the gap, acting as traps or recombination centers.
          </div>
        </div>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, color: "#2ecc71" }}>Orbital-Projected DOS (PDOS)</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            The total DOS can be decomposed into contributions from each atomic orbital type — this is the <b>Projected DOS (PDOS)</b>. It reveals <em>which orbitals</em> contribute states at each energy:
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginTop: 6 }}>
            <span style={{ color: "#4a9eff", fontWeight: 600 }}>s-orbital</span>: Spherically symmetric. In ZnTe, Zn 4s dominates the <b>conduction band minimum</b> (CBM). Deeper VB has Te 5s.<br />
            <span style={{ color: "#2ecc71", fontWeight: 600 }}>p-orbital</span>: Directional (px, py, pz). Te 5p states dominate the <b>valence band maximum</b> (VBM) — the topmost occupied states.<br />
            <span style={{ color: "#e67e22", fontWeight: 600 }}>d-orbital</span>: Zn 3d states form a <b>narrow peak</b> deep in the VB (~1.5 eV below VBM). Their sharpness reflects localized, atom-like character.
          </div>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: T.eo_photon }}>DFT Connection: Computing PDOS</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In VASP, set <code style={{ background: T.panel, padding: "1px 4px", borderRadius: 3 }}>LORBIT=11</code> to project DOS onto atomic orbitals. The output <b>DOSCAR</b> contains total + atom/orbital-resolved DOS. Tools like <b>pymatgen</b>, <b>VASPKIT</b>, and <b>sumo</b> parse and plot PDOS. This reveals the orbital character of each band — essential for understanding optical transitions, bonding, and defect levels.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Interactive Polymer Builder ─────────────────────────────────────────────

function PolymerBuilder() {
  const monomers = [
    { id: "ethylene", label: "Ethylene (PE)", formula: "CH₂=CH₂", color: "#9333ea", repeat: "–CH₂–CH₂–", bandGap: "8.8 eV", use: "Bags, bottles, pipes" },
    { id: "propylene", label: "Propylene (PP)", formula: "CH₂=CHCH₃", color: "#7c3aed", repeat: "–CH₂–CH(CH₃)–", bandGap: "8.0 eV", use: "Containers, fibers, car parts" },
    { id: "styrene", label: "Styrene (PS)", formula: "CH₂=CHC₆H₅", color: "#6d28d9", repeat: "–CH₂–CH(C₆H₅)–", bandGap: "4.5 eV", use: "Foam cups, insulation" },
    { id: "vinylchloride", label: "Vinyl Chloride (PVC)", formula: "CH₂=CHCl", color: "#5b21b6", repeat: "–CH₂–CHCl–", bandGap: "6.2 eV", use: "Pipes, flooring, cables" },
    { id: "tetrafluoroethylene", label: "Tetrafluoroethylene (PTFE)", formula: "CF₂=CF₂", color: "#4c1d95", repeat: "–CF₂–CF₂–", bandGap: "10.0 eV", use: "Non-stick (Teflon), seals" },
    { id: "acetylene", label: "Acetylene (PA)", formula: "CH≡CH", color: "#dc2626", repeat: "–CH=CH–", bandGap: "1.5 eV", use: "Conducting polymer!" },
  ];

  const [chain, setChain] = useState([]);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const addMonomer = (m) => { if (chain.length < 12) setChain(c => [...c, m]); };
  const clearChain = () => setChain([]);

  const svgW = 500, svgH = 120;
  const spacing = chain.length > 0 ? Math.min(40, (svgW - 40) / chain.length) : 40;

  return (
    <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: "1.5px solid #9333ea33" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#9333ea", marginBottom: 10 }}>Interactive Polymer Builder</div>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
        Click monomers below to build a polymer chain. Each monomer links end-to-end through addition polymerization. Watch how the chain grows and properties change!
      </div>

      {/* Monomer buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {monomers.map(m => (
          <button key={m.id} onClick={() => addMonomer(m)} style={{
            padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: m.color + "15", border: `1.5px solid ${m.color}44`,
            color: m.color, cursor: "pointer",
          }}>+ {m.label}</button>
        ))}
        <button onClick={clearChain} style={{
          padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: T.eo_gap + "15", border: `1.5px solid ${T.eo_gap}44`,
          color: T.eo_gap, cursor: "pointer",
        }}>Clear</button>
      </div>

      {/* Chain visualization */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: svgW, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
        {chain.length === 0 && (
          <text x={svgW / 2} y={svgH / 2 + 4} textAnchor="middle" fill={T.muted} fontSize={12}>Click a monomer to start building</text>
        )}
        {chain.map((m, i) => {
          const x = 20 + i * spacing;
          const y = svgH / 2 + Math.sin(frame * 0.04 + i * 0.8) * 8;
          const nextX = 20 + (i + 1) * spacing;
          const nextY = i < chain.length - 1 ? svgH / 2 + Math.sin(frame * 0.04 + (i + 1) * 0.8) * 8 : y;
          return (
            <g key={i}>
              {i < chain.length - 1 && (
                <line x1={x + 8} y1={y} x2={nextX - 8} y2={nextY} stroke={m.color} strokeWidth={2.5} opacity={0.6} />
              )}
              <circle cx={x} cy={y} r={10} fill={m.color + "33"} stroke={m.color} strokeWidth={1.5} />
              <text x={x} y={y + 3.5} textAnchor="middle" fill={m.color} fontSize={7} fontWeight="bold">
                {m.id === "ethylene" ? "PE" : m.id === "propylene" ? "PP" : m.id === "styrene" ? "PS" : m.id === "vinylchloride" ? "PVC" : m.id === "tetrafluoroethylene" ? "PTFE" : "PA"}
              </text>
            </g>
          );
        })}
        {chain.length > 0 && <>
          <text x={10} y={15} fill={T.muted} fontSize={10}>n = {chain.length} units</text>
          <text x={svgW - 10} y={15} textAnchor="end" fill="#9333ea" fontSize={10} fontWeight="bold">
            {chain.length >= 3 ? "Polymer!" : chain.length >= 2 ? "Oligomer" : "Monomer"}
          </text>
        </>}
      </svg>

      {/* Chain info */}
      {chain.length > 0 && (() => {
        const last = chain[chain.length - 1];
        const isConjugated = chain.some(m => m.id === "acetylene");
        return (
          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 150, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Repeat Unit</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: last.color, fontFamily: "monospace" }}>{last.repeat}</div>
            </div>
            <div style={{ flex: 1, minWidth: 150, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Band Gap</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: last.color, fontFamily: "monospace" }}>{last.bandGap}</div>
            </div>
            <div style={{ flex: 1, minWidth: 150, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Application</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{last.use}</div>
            </div>
            {isConjugated && (
              <div style={{ width: "100%", background: "#dc262611", borderRadius: 8, padding: 10, border: "1px solid #dc262633" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>Conjugated Polymer Detected!</div>
                <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
                  Polyacetylene has alternating single and double bonds (conjugation). This creates delocalized electrons along the chain, dramatically reducing the band gap to ~1.5 eV. Shirakawa, MacDiarmid, and Heeger won the 2000 Nobel Prize for discovering that doping conjugated polymers makes them conductive like metals!
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

// ─── Section 2: Material Classes ────────────────────────────────────────────

function MaterialClassesSection() {
  const [frame, setFrame] = useState(0);
  const [selected, setSelected] = useState("metal");

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 45);
    return () => clearInterval(id);
  }, []);

  const matTypes = [
    { id: "metal",        label: "Metal",         color: "#2563eb", bandGap: 0,    example: "Cu, Al, Fe",    conductivity: "10⁶ – 10⁸ S/m" },
    { id: "semiconductor", label: "Semiconductor", color: "#059669", bandGap: 0.5,  example: "Si, GaAs, CdTe", conductivity: "10⁻⁶ – 10⁴ S/m" },
    { id: "insulator",    label: "Insulator",      color: "#dc2626", bandGap: 5.0,  example: "SiO₂, Diamond, Al₂O₃", conductivity: "< 10⁻¹⁰ S/m" },
    { id: "polymer",      label: "Polymer",        color: "#9333ea", bandGap: 3.5,  example: "PE, PMMA, Kevlar", conductivity: "10⁻¹⁴ – 10⁻¹⁰ S/m" },
    { id: "ceramic",      label: "Ceramic",        color: "#b45309", bandGap: 4.0,  example: "Al₂O₃, ZrO₂, SiC", conductivity: "10⁻¹² – 10² S/m" },
  ];

  const sel = matTypes.find(m => m.id === selected);

  // Detailed info for each material class
  const info = {
    metal: {
      analogy: "A metal is like a “mosh pit” at a concert. The fans (electrons) are not attached to any single person (atom) — they flow freely through the whole crowd. Push from one side (apply voltage) and the entire sea of fans surges in that direction. That is why metals conduct electricity so well: their outermost electrons are delocalized, shared by every atom in the crystal, forming an “electron sea.”",
      bonding: "Metallic bonding — positive ion cores sit in a sea of delocalized electrons. No directional preference.",
      bandDesc: "Conduction band and valence band OVERLAP — there is no gap. Electrons can move freely with any tiny push of energy.",
      properties: ["Excellent electrical & thermal conductor", "Ductile & malleable (electron sea allows planes to slide)", "Shiny / reflective (free electrons absorb & re-emit photons)", "High melting point (strong metallic bond in transition metals)"],
      weakness: "Corrodes in oxidizing environments. Heavy. Cannot be transparent.",
      animation: "freeElectrons",
    },
    semiconductor: {
      analogy: "A semiconductor is like a library with a “quiet room” (valence band) and a “work room” (conduction band) separated by a locked door (band gap). At zero temperature, everyone sits quietly — no current flows. But heat the room (add thermal energy) or shine a flashlight (photon) and some readers gain enough energy to jump through the door into the work room, where they can move freely. The bigger the gap, the harder the jump.",
      bonding: "Covalent bonding — atoms share electron pairs in directional sp³ bonds (like diamond structure for Si).",
      bandDesc: "Small band gap (0.1 – 4 eV). At 0 K: insulator. At room temperature: some electrons thermally excited across the gap.",
      properties: ["Conductivity tunable by doping (add impurities)", "Temperature-dependent conductivity (increases with T)", "Photosensitive (absorbs photons with E > E_gap)", "Foundation of all modern electronics (transistors, solar cells, LEDs)"],
      weakness: "Pure form is a poor conductor. Requires extreme purity for device fabrication.",
      animation: "gapJump",
    },
    insulator: {
      analogy: "An insulator is like a prison with an impossibly high wall (huge band gap). The inmates (electrons) are locked in their cells (valence band) and no amount of room-temperature energy can help them escape over the wall into freedom (conduction band). You would need an enormous energy boost — like a lightning strike — to force electrons across. That is why glass, rubber, and diamond do not conduct electricity under normal conditions.",
      bonding: "Strong ionic or covalent bonds lock electrons tightly to atoms. No free carriers available.",
      bandDesc: "Very large band gap (> 4 eV). Virtually no electrons in conduction band at room temperature.",
      properties: ["Excellent electrical insulator (used in capacitors, coatings)", "Often optically transparent (photon energy < band gap)", "High dielectric strength (resists breakdown)", "Thermally stable (strong bonds = high melting point)"],
      weakness: "Brittle. Cannot conduct electricity (a feature, not a bug, for insulation).",
      animation: "lockedElectrons",
    },
    polymer: {
      analogy: "A polymer is like a bowl of cooked spaghetti. Each noodle (polymer chain) is made of thousands of repeating units (monomers) linked end-to-end by strong covalent bonds. But the noodles themselves are held together only by weak van der Waals forces — so the whole bowl is flexible and soft. Heat it up and the noodles slide past each other (melting). Pull a single noodle and it stretches before breaking (ductility). Most polymers are electrical insulators because electrons are locked within each chain.",
      bonding: "Strong covalent bonds ALONG the chain. Weak van der Waals or hydrogen bonds BETWEEN chains.",
      bandDesc: "Large band gap (3–8 eV for most). Conjugated polymers (polyacetylene) can have smaller gaps and conduct.",
      properties: ["Lightweight and flexible", "Easy to process (injection molding, extrusion)", "Chemical resistance (PE resists acids, bases)", "Electrical insulator (used for wire coatings, plastic housings)"],
      weakness: "Low melting point. Degrades under UV. Poor thermal conductor. Not recyclable (thermosets).",
      animation: "chainWiggle",
    },
    ceramic: {
      analogy: "A ceramic is like a brick wall — incredibly strong under compression (you can stack thousands of bricks) but shatter it with a sideways blow (brittle under tension). The atoms are locked in a rigid ionic or covalent network with no free electrons and no ability for planes to slide. This makes ceramics hard, heat-resistant, and electrically insulating — perfect for furnace linings, spark plugs, and thermal barrier coatings — but one crack propagates instantly because there is no electron sea to absorb the blow.",
      bonding: "Mixed ionic + covalent bonds in a rigid 3D network. Highly directional and strong.",
      bandDesc: "Large band gap (3–8 eV typically). Some exceptions: SiC (3.3 eV) is a wide-gap semiconductor.",
      properties: ["Extremely hard and wear-resistant", "Very high melting point (Al₂O₃: 2072°C)", "Excellent thermal insulator (space shuttle tiles)", "Chemically inert (resists corrosion, oxidation)"],
      weakness: "Brittle — catastrophic fracture with no warning. Difficult to machine or shape.",
      animation: "rigidLattice",
    },
  };

  const cur = info[selected];

  // ── ANIMATED BAND DIAGRAM ──
  const W = 380, H = 260;
  const bandW = 200, bandL = (W - bandW) / 2 - 20, bandR = bandL + bandW;
  const bandH = 28;
  // Center the band diagram vertically: compute gap in pixels, then place symmetrically
  const gapPxRaw = selected === "metal" ? 0 : Math.min(100, sel.bandGap * 20);
  const centerY = H / 2 + 5; // vertical center (slightly below for title space)
  const VBtop = centerY + gapPxRaw / 2;
  const CBbot = centerY - gapPxRaw / 2;
  const gapPx = VBtop - CBbot;

  // Systematic electrons: evenly spaced, drifting left-to-right in CB, oscillating in VB
  const nCB = selected === "metal" ? 6 : selected === "semiconductor" ? 2 : 0;
  const nVB = selected === "metal" ? 4 : selected === "semiconductor" ? 3 : selected === "insulator" ? 5 : selected === "polymer" ? 4 : 3;
  const electrons = [];
  // CB electrons: drift systematically left to right
  for (let i = 0; i < nCB; i++) {
    const t = (frame * 0.8 + i * (bandW / nCB)) % bandW;
    electrons.push({ x: bandL + t, y: CBbot - bandH / 2 + Math.sin(frame * 0.05 + i * 1.5) * 4, inCB: true });
  }
  // VB electrons: sit in evenly spaced positions, gently oscillating
  for (let i = 0; i < nVB; i++) {
    const baseX = bandL + (i + 0.5) * (bandW / nVB);
    electrons.push({ x: baseX + Math.sin(frame * 0.03 + i * 2) * 3, y: VBtop + bandH / 2 + Math.sin(frame * 0.04 + i) * 2, inCB: false });
  }

  // Animated polymer chain — centered in the gap between CB and VB
  const chainYCenter = (CBbot + VBtop) / 2;
  const chainAmplitude = gapPx > 30 ? Math.min(12, (gapPx - 20) / 3) : 6;
  const chainPts = selected === "polymer" ? Array.from({ length: 16 }, (_, i) => {
    const baseX = bandL + i * (bandW / 15);
    const baseY = chainYCenter + Math.sin(i * 0.8 + frame * 0.06) * chainAmplitude + Math.cos(i * 1.3 + frame * 0.04) * (chainAmplitude * 0.4);
    return [baseX, baseY];
  }) : [];

  // Animated ceramic lattice — aligned between CB bottom edge and VB top edge
  const ceramicAtoms = selected === "ceramic" ? (() => {
    const atoms = [];
    const latticeTop = CBbot + 4;
    const latticeBot = VBtop - 4;
    const nRows = 4, nCols = 6;
    const rowSpacing = (latticeBot - latticeTop) / (nRows - 1);
    const colSpacing = bandW / (nCols + 1);
    for (let row = 0; row < nRows; row++) {
      for (let col = 0; col < nCols; col++) {
        const bx = bandL + colSpacing * (col + 1);
        const by = latticeTop + row * rowSpacing;
        const vib = Math.sin(frame * 0.05 + row * 2 + col * 3) * 1.5;
        atoms.push({ x: bx + vib, y: by + vib * 0.7, isIon: (row + col) % 2 === 0 });
      }
    }
    return atoms;
  })() : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── ANALOGY BOX ── */}
      <AnalogyBox>
          All materials are made of atoms, but they behave wildly differently because of <strong>how tightly they hold onto their electrons</strong>. A metal is a mosh pit (electrons roam free). A semiconductor is a library with a locked door (electrons need a push to move). An insulator is a prison with impossibly high walls (electrons are trapped). A polymer is a bowl of spaghetti (flexible chains, electrons stuck on each noodle). A ceramic is a brick wall (rigid, hard, brittle). Select each material below to see how its band structure, bonding, and properties differ.
        </AnalogyBox>

      {/* ── MATERIAL SELECTOR TABS ── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {matTypes.map(m => (
          <button key={m.id} onClick={() => setSelected(m.id)} style={{
            flex: "1 1 auto", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: selected === m.id ? m.color + "18" : T.surface,
            border: `1.5px solid ${selected === m.id ? m.color : T.border}`,
            color: selected === m.id ? m.color : T.muted, cursor: "pointer",
            transition: "all 0.2s",
          }}>{m.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {/* ── LEFT: ANIMATED VISUALIZATION ── */}
        <div style={{ flex: "0 0 350px" }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", maxWidth: 350, margin: "0 auto", background: T.surface, borderRadius: 10, border: `1.5px solid ${sel.color}33` }}>
            {/* Title */}
            <text x={W / 2} y={20} textAnchor="middle" fill={sel.color} fontSize={13} fontWeight="bold">{sel.label} Band Structure</text>

            {/* Conduction band */}
            <rect x={bandL} y={CBbot - bandH} width={bandW} height={bandH} rx={4}
              fill={T.eo_cond + "22"} stroke={T.eo_cond} strokeWidth={1.5} />
            <text x={W / 2} y={CBbot - bandH / 2 + 4} textAnchor="middle" fill={T.eo_cond} fontSize={12} fontWeight="bold">Conduction Band (CBM)</text>

            {/* Band gap label */}
            {gapPx > 10 && <>
              <rect x={bandL} y={CBbot} width={bandW} height={gapPx} fill={T.eo_gap + "08"} />
              <line x1={bandR + 8} y1={CBbot} x2={bandR + 8} y2={VBtop} stroke={T.eo_gap} strokeWidth={1.5} markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
              <text x={bandR + 14} y={(CBbot + VBtop) / 2 + 4} fill={T.eo_gap} fontSize={11} fontWeight="bold" textAnchor="start">
                E_g = {sel.bandGap} eV
              </text>
            </>}

            {/* Valence band */}
            <rect x={bandL} y={VBtop} width={bandW} height={bandH} rx={4}
              fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
            <text x={W / 2} y={VBtop + bandH / 2 + 4} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontWeight="bold">Valence Band (VBM)</text>

            {/* Overlap indicator for metals */}
            {selected === "metal" && (
              <text x={W / 2} y={VBtop + bandH + 16} textAnchor="middle" fill={T.eo_e} fontSize={11} fontWeight="bold">
                ↑ Bands OVERLAP ↓ No Gap
              </text>
            )}

            {/* Animated electrons — systematic placement */}
            {electrons.map((e, i) => (
              <g key={i}>
                <circle cx={e.x} cy={e.y} r={6} fill={e.inCB ? T.eo_e : T.eo_valence} opacity={0.9} />
                <text x={e.x} y={e.y + 3.5} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">e⁻</text>
              </g>
            ))}

            {/* Special animations per type */}
            {selected === "semiconductor" && (
              <g>
                {/* Photon arrow exciting electron */}
                <line x1={150} y1={VBtop + 15} x2={150} y2={CBbot - 5}
                  stroke={T.eo_photon} strokeWidth={2} strokeDasharray="5 3" opacity={0.5 + 0.5 * Math.sin(frame * 0.1)}>
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
                </line>
                <text x={158} y={(CBbot + VBtop) / 2} fill={T.eo_photon} fontSize={11} fontWeight="bold">hν ↑</text>
              </g>
            )}

            {selected === "insulator" && (
              <g>
                {/* Big X showing electrons can't cross */}
                <text x={W / 2} y={(CBbot + VBtop) / 2 + 5} textAnchor="middle" fill={T.eo_gap} fontSize={20} fontWeight="bold" opacity={0.4 + 0.3 * Math.sin(frame * 0.08)}>
                  ✖ TOO WIDE
                </text>
              </g>
            )}

            {/* Polymer chain animation */}
            {selected === "polymer" && chainPts.length > 1 && (
              <g>
                <polyline points={chainPts.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill="none" stroke={sel.color} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
                {chainPts.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 6 : 4}
                    fill={i % 3 === 0 ? sel.color : sel.color + "66"} />
                ))}
                <text x={W / 2} y={VBtop + bandH + 18} textAnchor="middle" fill={T.muted} fontSize={11}>Wiggling polymer chain (weak inter-chain forces)</text>
              </g>
            )}

            {/* Ceramic lattice animation */}
            {selected === "ceramic" && ceramicAtoms.length > 0 && (
              <g>
                {/* Bonds */}
                {ceramicAtoms.map((a, i) => {
                  return ceramicAtoms.filter((b, j) => j > i && Math.abs(a.x - b.x) < 50 && Math.abs(a.y - b.y) < 50 && Math.hypot(a.x - b.x, a.y - b.y) < 50).map((b, k) => (
                    <line key={`${i}-${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.dim} strokeWidth={1} />
                  ));
                })}
                {ceramicAtoms.map((a, i) => (
                  <g key={i}>
                    <circle cx={a.x} cy={a.y} r={a.isIon ? 10 : 7}
                      fill={a.isIon ? sel.color + "33" : T.eo_gap + "33"}
                      stroke={a.isIon ? sel.color : T.eo_gap} strokeWidth={1.5} />
                    <text x={a.x} y={a.y + 3.5} textAnchor="middle" fill={a.isIon ? sel.color : T.eo_gap}
                      fontSize={a.isIon ? 8 : 7} fontWeight="bold">{a.isIon ? "+" : "–"}</text>
                  </g>
                ))}
                <text x={W / 2} y={H - 10} textAnchor="middle" fill={T.muted} fontSize={11}>Rigid ionic/covalent lattice (barely vibrating)</text>
              </g>
            )}

            {/* Example label */}
            <text x={W / 2} y={H - 2} textAnchor="middle" fill={T.muted} fontSize={11}>Examples: {sel.example}</text>
          </svg>

          {/* ── BAND GAP COMPARISON BAR ── */}
          <div style={{ marginTop: 10, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>BAND GAP COMPARISON</div>
            {matTypes.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 85, fontSize: 10, fontWeight: selected === m.id ? 700 : 400, color: selected === m.id ? m.color : T.muted }}>{m.label}</div>
                <div style={{ flex: 1, height: 12, background: T.bg, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.border}` }}>
                  <div style={{
                    width: `${Math.min(100, m.bandGap * 12)}%`, height: "100%",
                    background: m.color, borderRadius: 6, transition: "width 0.5s",
                    opacity: selected === m.id ? 1 : 0.4,
                  }} />
                </div>
                <div style={{ width: 50, fontSize: 10, color: m.color, fontWeight: 600, textAlign: "right" }}>
                  {m.bandGap === 0 ? "0 eV" : `${m.bandGap} eV`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: DETAILS ── */}
        <div style={{ flex: 1, minWidth: 280, overflow: "hidden" }}>
          {/* Analogy for selected material */}
          <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>{sel.label} Analogy</div>
            <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>{cur.analogy}</div>
          </div>

          {/* Bonding */}
          <div style={{ background: sel.color + "08", border: `1.5px solid ${sel.color}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: sel.color, marginBottom: 4 }}>Bonding Type</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{cur.bonding}</div>
          </div>

          {/* Band structure explanation */}
          <div style={{ background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Band Structure</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.muted }}>{cur.bandDesc}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 8px", background: sel.color + "11", borderRadius: 6, border: `1px solid ${sel.color}33` }}>
                <div style={{ fontSize: 10, color: T.muted }}>Band Gap</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: sel.color, fontFamily: "monospace" }}>{sel.bandGap} eV</div>
              </div>
              <div style={{ flex: 1, textAlign: "center", padding: "6px 8px", background: sel.color + "11", borderRadius: 6, border: `1px solid ${sel.color}33` }}>
                <div style={{ fontSize: 10, color: T.muted }}>Conductivity</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: sel.color, fontFamily: "monospace" }}>{sel.conductivity}</div>
              </div>
            </div>
          </div>

          {/* Key properties */}
          <div style={{ background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Key Properties</div>
            {cur.properties.map((p, i) => (
              <div key={i} style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
                <span style={{ color: sel.color, fontWeight: 700, marginRight: 6 }}>•</span>{p}
              </div>
            ))}
          </div>

          {/* Limitation */}
          <div style={{ background: T.eo_gap + "08", border: `1px solid ${T.eo_gap}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>Limitation</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{cur.weakness}</div>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE POLYMER BUILDER ── */}
      {selected === "polymer" && (
        <PolymerBuilder />
      )}

      {/* ── COMPARISON TABLE ── */}
      <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1.5px solid ${T.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 10 }}>Material Classes — Side by Side</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", wordWrap: "break-word", fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {["Property", "Metal", "Semiconductor", "Insulator", "Polymer", "Ceramic"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: T.muted, fontWeight: 700, fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { prop: "Band Gap", vals: ["0 (overlap)", "0.1–4 eV", "> 4 eV", "3–8 eV", "3–8 eV"] },
                { prop: "Bonding", vals: ["Metallic", "Covalent", "Ionic / Covalent", "Covalent + vdW", "Ionic + Covalent"] },
                { prop: "Conductivity", vals: ["Very high", "Tunable (doping)", "Very low", "Very low", "Very low"] },
                { prop: "Mechanical", vals: ["Ductile", "Brittle (crystal)", "Brittle", "Flexible", "Hard & brittle"] },
                { prop: "Optical", vals: ["Opaque / shiny", "Absorbs > E_g", "Transparent", "Transparent/opaque", "Opaque (mostly)"] },
                { prop: "Thermal Cond.", vals: ["High", "Moderate", "Low", "Very low", "Low (except SiC)"] },
                { prop: "Melting Point", vals: ["Moderate–High", "High", "Very high", "Low", "Very high"] },
                { prop: "Density", vals: ["High", "Moderate", "Moderate", "Low", "Moderate–High"] },
                { prop: "Example Use", vals: ["Wires, beams", "Chips, solar cells", "Capacitors, glass", "Packaging, fibers", "Furnace tiles, armor"] },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : T.panel }}>
                  <td style={{ padding: "5px 8px", fontWeight: 700, color: T.ink, fontSize: 10 }}>{row.prop}</td>
                  {row.vals.map((v, j) => (
                    <td key={j} style={{ padding: "5px 8px", color: matTypes[j].color, fontSize: 10 }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ─── (Legacy placeholder: SemiconductorDopingSection removed) ───────────────

function SemiconductorDopingSection() {
  const [frame, setFrame] = useState(0);
  const [dopingType, setDopingType] = useState("intrinsic");

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const W = 340, H = 320;
  const bandL = 40, bandR = 300;
  const Ev_y = 220, Ec_y = 100;
  const gapH = Ev_y - Ec_y;

  const fermiY = dopingType === "intrinsic" ? (Ev_y + Ec_y) / 2
    : dopingType === "n-type" ? Ec_y + gapH * 0.2
    : Ev_y - gapH * 0.2;

  const donorY = Ec_y + gapH * 0.12;
  const acceptorY = Ev_y - gapH * 0.12;

  const t = frame * 0.06;
  const bounce = Math.sin(t) * 0.5 + 0.5;

  const nElectrons = dopingType === "n-type" ? 5 : dopingType === "intrinsic" ? 1 : 0;
  const nHoles = dopingType === "p-type" ? 5 : dopingType === "intrinsic" ? 1 : 0;

  const electrons = [];
  for (let i = 0; i < nElectrons; i++) {
    const phase = t + i * 1.3;
    const x = bandL + 30 + ((i * 47 + Math.sin(phase) * 20) % (bandR - bandL - 60));
    const y = Ec_y - 10 - Math.abs(Math.sin(phase * 0.7)) * 25 - i * 3;
    electrons.push({ x, y });
  }

  const holes = [];
  for (let i = 0; i < nHoles; i++) {
    const phase = t + i * 1.1;
    const x = bandL + 30 + ((i * 53 + Math.cos(phase) * 20) % (bandR - bandL - 60));
    const y = Ev_y + 10 + Math.abs(Math.sin(phase * 0.6)) * 20 + i * 3;
    holes.push({ x, y });
  }

  const kT = 0.026;
  const Eg = 1.5;
  const ncVal = dopingType === "n-type" ? 1e17 : dopingType === "p-type" ? 1e10 : 1e10;
  const pvVal = dopingType === "p-type" ? 1e17 : dopingType === "n-type" ? 1e10 : 1e10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Doping a semiconductor is like adding a few VIP guests to a sold-out concert. In n-type doping, you add atoms with an extra electron (like a guest who brings an extra ticket) {"—"} now there{"'"}s a free carrier in the conduction band. In p-type doping, you add atoms missing an electron (like a guest who needs a ticket) {"—"} this creates a {"'"}hole{"'"} in the valence band. These tiny impurities (1 in a million atoms) dramatically change conductivity, like adding a single drop of dye to a glass of water.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
          <rect x={bandL} y={Ev_y} width={bandR - bandL} height={50}
            fill={T.eo_valence} opacity={0.25} />
          <line x1={bandL} y1={Ev_y} x2={bandR} y2={Ev_y}
            stroke={T.eo_valence} strokeWidth={2.5} />
          <text x={bandR + 4} y={Ev_y + 4} fontSize={10} fill={T.eo_valence}
            fontFamily="monospace">E_v</text>
          <text x={bandL + 5} y={Ev_y + 18} fontSize={9} fill={T.eo_valence}
            fontFamily="monospace" opacity={0.7}>Valence Band</text>

          <rect x={bandL} y={Ec_y - 50} width={bandR - bandL} height={50}
            fill={T.eo_cond} opacity={0.12} />
          <line x1={bandL} y1={Ec_y} x2={bandR} y2={Ec_y}
            stroke={T.eo_cond} strokeWidth={2.5} />
          <text x={bandR + 4} y={Ec_y + 4} fontSize={10} fill={T.eo_cond}
            fontFamily="monospace">E_c</text>
          <text x={bandL + 5} y={Ec_y - 10} fontSize={9} fill={T.eo_cond}
            fontFamily="monospace" opacity={0.7}>Conduction Band</text>

          <rect x={bandL} y={Ec_y} width={bandR - bandL} height={Ev_y - Ec_y}
            fill={T.eo_gap} opacity={0.04} />
          <text x={(bandL + bandR) / 2} y={(Ec_y + Ev_y) / 2 + 4}
            textAnchor="middle" fontSize={10} fill={T.eo_gap}
            fontFamily="monospace" opacity={0.6}>
            E_g = {Eg} eV
          </text>

          {dopingType === "n-type" && (
            <>
              <line x1={bandL + 40} y1={donorY} x2={bandR - 40} y2={donorY}
                stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="5,3" />
              <text x={bandR - 38} y={donorY + 4} fontSize={9} fill={T.eo_e}
                fontFamily="monospace">E_d</text>
              {[0, 1, 2].map(i => {
                const px = bandL + 70 + i * 60;
                const jumping = Math.sin(t * 0.8 + i * 2) > 0.3;
                const py = jumping ? donorY - 8 - bounce * 20 : donorY;
                return (
                  <g key={i}>
                    <circle cx={px} cy={donorY} r={3} fill={T.eo_e} opacity={jumping ? 0.2 : 0.6} />
                    {jumping && (
                      <line x1={px} y1={donorY} x2={px} y2={py + 4}
                        stroke={T.eo_e} strokeWidth={0.5} strokeDasharray="2,2" opacity={0.4} />
                    )}
                  </g>
                );
              })}
            </>
          )}

          {dopingType === "p-type" && (
            <>
              <line x1={bandL + 40} y1={acceptorY} x2={bandR - 40} y2={acceptorY}
                stroke={T.eo_hole} strokeWidth={1.5} strokeDasharray="5,3" />
              <text x={bandR - 38} y={acceptorY + 4} fontSize={9} fill={T.eo_hole}
                fontFamily="monospace">E_a</text>
              {[0, 1, 2].map(i => {
                const px = bandL + 70 + i * 60;
                const jumping = Math.sin(t * 0.8 + i * 2) > 0.3;
                return (
                  <circle key={i} cx={px} cy={jumping ? acceptorY + 5 + bounce * 15 : acceptorY}
                    r={5} fill="none" stroke={T.eo_hole} strokeWidth={1.5}
                    opacity={jumping ? 0.4 : 0.7} />
                );
              })}
            </>
          )}

          <line x1={bandL} y1={fermiY} x2={bandR} y2={fermiY}
            stroke={T.eo_hole} strokeWidth={2} strokeDasharray="8,5" />
          <text x={bandR + 4} y={fermiY + 4} fontSize={10} fill={T.eo_hole}
            fontFamily="monospace" fontWeight={700}>E_F</text>

          {electrons.map((el, i) => (
            <circle key={"e" + i} cx={el.x} cy={el.y} r={4}
              fill={T.eo_e} opacity={0.8} />
          ))}
          {holes.map((h, i) => (
            <circle key={"h" + i} cx={h.x} cy={h.y} r={5}
              fill="none" stroke={T.eo_hole} strokeWidth={2} opacity={0.8} />
          ))}

          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace">
            {dopingType === "intrinsic" ? "Intrinsic" : dopingType === "n-type" ? "n-type Doped" : "p-type Doped"}
          </text>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_core }}>
            Semiconductor Doping
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {["intrinsic", "n-type", "p-type"].map(dt => (
              <button key={dt} onClick={() => setDopingType(dt)}
                style={{
                  padding: "5px 10px", borderRadius: 5, fontSize: 11, fontFamily: "monospace",
                  cursor: "pointer", border: `1px solid ${dopingType === dt ? T.eo_core : T.border}`,
                  background: dopingType === dt ? T.eo_core : T.panel,
                  color: dopingType === dt ? "#fff" : T.ink,
                }}>
                {dt}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            {dopingType === "intrinsic" && "Pure semiconductor. E_F sits at mid-gap. Very few carriers at room temperature."}
            {dopingType === "n-type" && "Donor impurity (e.g., P in Si, Cd_Zn in ZnTe). Donates electrons to CB. E_F shifts up toward E_c."}
            {dopingType === "p-type" && "Acceptor impurity (e.g., B in Si, V_Zn in ZnTe). Creates holes in VB. E_F shifts down toward E_v."}
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Carrier Concentration</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
            n_e = N_c exp(-(E_c - E_F)/kT)<br />
            <b>n_e</b> = <span style={{ color: T.eo_e }}>{ncVal.toExponential(1)} cm⁻³</span><br />
            <b>p_h</b> = <span style={{ color: T.eo_hole }}>{pvVal.toExponential(1)} cm⁻³</span><br />
            <span style={{ fontSize: 10, color: T.dim }}>n * p = n_i² (mass-action law)</span>
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Doping shifts the Fermi level. <b>n-type</b>: E_F moves toward CB.
            <b> p-type</b>: E_F moves toward VB.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_photon }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            In 1942, Karl Lark-Horovitz at Purdue discovered that adding minute impurities to germanium dramatically changed its electrical conductivity. This insight -- that parts per million of the right element could switch a material from insulating to conducting -- enabled Bardeen, Brattain, and Shockley to invent the transistor in 1947, launching the semiconductor revolution.
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
            Key Insight
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            In ZnTe, Zn vacancies act as acceptors - p-type. This is
            intrinsic doping from defects! Native point defects control
            carrier type without external dopants.
          </div>
        </div>

        <div style={{
          background: `${T.eo_photon}11`, border: `1px solid ${T.eo_photon}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_photon, marginBottom: 4 }}>Coming Next: Carrier Transport {"→"}</div>
          <div style={{ color: T.ink }}>
            Now that we have free carriers from doping, how do they move? Carrier transport — drift in electric fields and diffusion down concentration gradients — determines the current a device can carry.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Section 3: Carrier Transport ───────────────────────────────────────────

function CarrierTransportSection() {
  const [frame, setFrame] = useState(0);
  const [mode, setMode] = useState("none");
  const [eField, setEField] = useState(0.5);
  const [particles, setParticles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: 40 + Math.random() * 240, y: 80 + Math.random() * 160,
      vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setFrame(f => f + 1);
      setParticles(prev => prev.map(p => {
        let { x, y, vx, vy } = p;
        const drift = mode !== "none" ? eField * 0.8 : 0;
        const scatter = mode === "scatter" ? 0.25 : 0;

        vx += (Math.random() - 0.5) * 1.5 + drift * 0.15;
        vy += (Math.random() - 0.5) * 1.5;

        if (mode === "scatter" && Math.random() < 0.08) {
          vx = (Math.random() - 0.5) * 3 + drift * 0.3;
          vy = (Math.random() - 0.5) * 3;
        }

        vx *= 0.92; vy *= 0.92;
        x += vx; y += vy;

        if (x < 30) { x = 30; vx = Math.abs(vx); }
        if (x > 310) { x = 310; vx = -Math.abs(vx); }
        if (y < 60) { y = 60; vy = Math.abs(vy); }
        if (y > 260) { y = 260; vy = -Math.abs(vy); }

        return { x, y, vx, vy };
      }));
    }, 45);
    return () => clearInterval(id);
  }, [mode, eField]);

  const W = 340, H = 320;
  const atomY = 160;
  const atomSpacing = 30;
  const nAtoms = 10;

  const mu = mode === "scatter" ? 200 : 450;
  const sigma = 1e16 * 1.6e-19 * mu;
  const vDrift = mu * eField;
  const J = sigma * eField;

  const scatterPts = mode === "scatter" ? [
    { x: 100, y: 120 }, { x: 200, y: 200 }, { x: 260, y: 100 }, { x: 150, y: 230 },
  ] : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Carrier transport is like traffic flow on a highway. Electrons are cars, voltage is the slope of the road (makes cars roll), and resistance is traffic congestion. In drift, cars move because the road is tilted (electric field pushes them). In diffusion, cars spread from crowded areas to empty ones {"—"} like people leaving a packed concert. Mobility is how fast a car can go in traffic {"—"} higher in metals (empty highway) than in doped semiconductors (bumpy road with obstacles).
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
          {Array.from({ length: nAtoms }, (_, i) => {
            const cx = 35 + i * atomSpacing;
            return (
              <g key={i}>
                <circle cx={cx} cy={atomY - 60} r={8} fill={T.eo_core} opacity={0.15} />
                <circle cx={cx} cy={atomY} r={8} fill={T.eo_core} opacity={0.15} />
                <circle cx={cx} cy={atomY + 60} r={8} fill={T.eo_core} opacity={0.15} />
                {i < nAtoms - 1 && (
                  <>
                    <line x1={cx + 8} y1={atomY} x2={cx + atomSpacing - 8} y2={atomY}
                      stroke={T.dim} strokeWidth={1} opacity={0.4} />
                    <line x1={cx + 8} y1={atomY - 60} x2={cx + atomSpacing - 8} y2={atomY - 60}
                      stroke={T.dim} strokeWidth={1} opacity={0.4} />
                    <line x1={cx + 8} y1={atomY + 60} x2={cx + atomSpacing - 8} y2={atomY + 60}
                      stroke={T.dim} strokeWidth={1} opacity={0.4} />
                  </>
                )}
              </g>
            );
          })}

          {mode !== "none" && (
            <g>
              <defs>
                <marker id="arrowE" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0,0 8,3 0,6" fill={T.eo_gap} />
                </marker>
              </defs>
              <line x1={60} y1={30} x2={280} y2={30} stroke={T.eo_gap} strokeWidth={2}
                markerEnd="url(#arrowE)" />
              <text x={170} y={22} textAnchor="middle" fontSize={11} fill={T.eo_gap}
                fontFamily="monospace" fontWeight={700}>E-field</text>
            </g>
          )}

          {scatterPts.map((sp, i) => {
            const pulse = Math.sin(frame * 0.15 + i) * 3;
            return (
              <g key={i}>
                <circle cx={sp.x} cy={sp.y} r={10 + pulse} fill={T.eo_photon} opacity={0.12} />
                <text x={sp.x} y={sp.y + 3} textAnchor="middle" fontSize={8} fill={T.eo_photon}
                  fontFamily="monospace">~</text>
              </g>
            );
          })}

          {particles.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill={T.eo_e} opacity={0.85} />
              <line x1={p.x} y1={p.y} x2={p.x - p.vx * 3} y2={p.y - p.vy * 3}
                stroke={T.eo_e} strokeWidth={0.8} opacity={0.3} />
            </g>
          ))}

          {mode !== "none" && (
            <text x={170} y={H - 10} textAnchor="middle" fontSize={10} fill={T.muted}
              fontFamily="monospace">
              J = {J.toExponential(1)} A/m² | v_d = {vDrift.toFixed(0)} cm/s
            </text>
          )}
          {mode === "none" && (
            <text x={170} y={H - 10} textAnchor="middle" fontSize={10} fill={T.muted}
              fontFamily="monospace">Random thermal motion (no net drift)</text>
          )}
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_e }}>
            Carrier Transport
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {[["none", "No Field"], ["field", "E-Field"], ["scatter", "Scattering"]].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  padding: "5px 10px", borderRadius: 5, fontSize: 11, fontFamily: "monospace",
                  cursor: "pointer", border: `1px solid ${mode === m ? T.eo_e : T.border}`,
                  background: mode === m ? T.eo_e : T.panel,
                  color: mode === m ? "#fff" : T.ink,
                }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            {mode === "none" && "Electrons undergo random thermal motion. No net current flows."}
            {mode === "field" && "Electric field accelerates electrons. A net drift velocity arises: v_d = muE."}
            {mode === "scatter" && "Phonons and impurities scatter carriers, reducing mobility. Wavy circles = scatterers."}
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, marginBottom: 6 }}>
            <b>Electric Field:</b>{" "}
            <span style={{ color: T.eo_gap }}>{eField.toFixed(2)} V/cm</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={eField}
            onChange={e => setEField(+e.target.value)}
            style={{ width: "100%" }} />
          <div style={{ fontSize: 11, marginTop: 10, lineHeight: 1.8, color: T.muted }}>
            Mobility mu = <span style={{ color: T.eo_e }}>{mu} cm²/Vs</span><br />
            Conductivity sigma = nq*mu<br />
            J = sigma * E = nq*mu*E
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            <b>Matthiessen's rule:</b><br />
            1/mu = 1/mu_lattice + 1/mu_impurity<br />
            <b>Drift</b> = field-driven motion. <b>Diffusion</b> = concentration-gradient driven.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_photon }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Paul Drude (1900) first explained electrical conductivity by treating electrons as a classical gas bouncing off atoms. Arnold Sommerfeld then applied Fermi-Dirac statistics (1928), and Felix Bloch added quantum scattering theory. Together they showed that transport depends only on electrons near the Fermi level -- a profound insight that classical physics could never explain.
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
            Key Insight
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Mobility determines device speed. Defects scatter carriers
            - lower mobility - worse device performance.
          </div>
        </div>

        <div style={{
          background: `${T.eo_photon}11`, border: `1px solid ${T.eo_photon}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_photon, marginBottom: 4 }}>Coming Next: Thermodynamics {"→"}</div>
          <div style={{ color: T.ink }}>
            Device performance depends on the material existing stably. Thermodynamics tells us which phases are stable, whether a compound will form or decompose, and the energy cost of defects.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Section 4: Thermodynamics ──────────────────────────────────────────────

function ThermodynamicsSection() {
  const [frame, setFrame] = useState(0);
  const [tempK, setTempK] = useState(300);
  const [ballX, setBallX] = useState(0.2);
  const ballVelRef = useRef(0);

  const W = 340, H = 320;
  const marginL = 45, marginR = 15, marginT = 40, marginB = 35;
  const plotW = W - marginL - marginR;
  const plotH = H - marginT - marginB;

  const dH = 0.8;
  const dS = 0.0012;
  const dG = dH - tempK * dS;

  const landscape = (x) => {
    const reactant = 3.0 * (x - 0.25) * (x - 0.25);
    const product = 2.5 * (x - 0.75) * (x - 0.75) + (dG > 0 ? dG * 0.8 : dG * 0.5);
    const barrier = -1.2 * Math.exp(-((x - 0.5) * (x - 0.5)) / 0.008) + 2.5;
    const base = Math.min(reactant, product);
    const barrierContrib = Math.max(0, barrier - base) * Math.exp(-((x - 0.5) * (x - 0.5)) / 0.02);
    return base + barrierContrib * 0.5;
  };

  useEffect(() => {
    const id = setInterval(() => {
      setFrame(f => f + 1);
      setBallX(prev => {
        const dx = 0.005;
        const slope = (landscape(prev + dx) - landscape(prev - dx)) / (2 * dx);
        let vel = ballVelRef.current;
        vel -= slope * 0.0015;
        vel += (Math.random() - 0.5) * 0.0008 * (tempK / 300);
        vel *= 0.97;
        let newX = prev + vel;
        if (newX < 0.02) { newX = 0.02; vel = Math.abs(vel) * 0.5; }
        if (newX > 0.98) { newX = 0.98; vel = -Math.abs(vel) * 0.5; }
        ballVelRef.current = vel;
        return newX;
      });
    }, 50);
    return () => clearInterval(id);
  }, [tempK]);

  const xToSvg = (x) => marginL + x * plotW;
  // energy range: low energy at bottom, high energy at top
  const eMin = -1.0;
  const eMax = 2.5;
  const yToSvg = (g) => marginT + ((eMax - g) / (eMax - eMin)) * plotH;

  let curvePath = "";
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const g = landscape(x);
    curvePath += (i === 0 ? "M" : "L") + xToSvg(x).toFixed(1) + "," + yToSvg(g).toFixed(1);
  }

  const ballSvgX = xToSvg(ballX);
  const ballSvgY = yToSvg(landscape(ballX)) - 6;

  const Gval = landscape(0.25);
  const Gprod = landscape(0.75);
  const Eact = landscape(0.5) - Gval;

  const dgColor = dG < 0 ? T.eo_valence : T.eo_gap;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Thermodynamics is like accounting for energy. The first law says energy is conserved {"—"} you can{"'"}t create money from nothing. The second law says entropy (disorder) always increases {"—"} a clean room naturally gets messy, never the reverse. Free energy (G = H - TS) is like your bank balance: reactions {"'"}spend{"'"} enthalpy (H) and {"'"}earn{"'"} from entropy (TS). At equilibrium, the account is balanced. Temperature is like the exchange rate {"—"} higher T makes entropy worth more.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
          <path d={curvePath} fill="none" stroke={T.eo_core} strokeWidth={2.5} />

          <line x1={xToSvg(0.25)} y1={yToSvg(Gval)} x2={xToSvg(0.75)} y2={yToSvg(Gval)}
            stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />
          <line x1={xToSvg(0.75)} y1={yToSvg(Gval)} x2={xToSvg(0.75)} y2={yToSvg(Gprod)}
            stroke={dgColor} strokeWidth={2} />
          <text x={xToSvg(0.78)} y={(yToSvg(Gval) + yToSvg(Gprod)) / 2 + 4}
            fontSize={10} fill={dgColor} fontFamily="monospace" fontWeight={700}>
            dG
          </text>

          <line x1={xToSvg(0.25)} y1={yToSvg(Gval)} x2={xToSvg(0.25)} y2={yToSvg(landscape(0.5))}
            stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="3,2" />
          <text x={xToSvg(0.18)} y={(yToSvg(Gval) + yToSvg(landscape(0.5))) / 2}
            fontSize={9} fill={T.eo_photon} fontFamily="monospace">E_a</text>

          <rect x={xToSvg(0.1)} y={yToSvg(Gval) - 22} width={60} height={16}
            rx={3} fill={T.eo_cond} opacity={0.15} />
          <text x={xToSvg(0.1) + 30} y={yToSvg(Gval) - 10} textAnchor="middle"
            fontSize={9} fill={T.eo_cond} fontFamily="monospace">Reactants</text>

          <rect x={xToSvg(0.6)} y={yToSvg(Gprod) - 22} width={60} height={16}
            rx={3} fill={T.eo_valence} opacity={0.15} />
          <text x={xToSvg(0.6) + 30} y={yToSvg(Gprod) - 10} textAnchor="middle"
            fontSize={9} fill={T.eo_valence} fontFamily="monospace">Products</text>

          <circle cx={ballSvgX} cy={ballSvgY} r={6}
            fill={T.eo_photon} stroke={T.eo_hole} strokeWidth={1.5} />

          <line x1={marginL} y1={H - marginB} x2={W - marginR} y2={H - marginB}
            stroke={T.border} strokeWidth={1} />
          <line x1={marginL} y1={marginT} x2={marginL} y2={H - marginB}
            stroke={T.border} strokeWidth={1} />

          <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace">Reaction Coordinate</text>
          <text x={10} y={H / 2} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace" transform={`rotate(-90,10,${H / 2})`}>G (eV)</text>

          <text x={marginL + plotW / 2} y={marginT - 12} textAnchor="middle" fontSize={11}
            fill={dgColor} fontFamily="monospace" fontWeight={700}>
            dG = {dG.toFixed(3)} eV {dG < 0 ? "(favorable)" : "(unfavorable)"}
          </text>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_core }}>
            Thermodynamics
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            Free energy determines stability: <b>G = H - TS</b>.
            Reactions proceed when dG &lt; 0.
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, marginBottom: 6 }}>
            <b>Temperature:</b>{" "}
            <span style={{ color: T.eo_hole }}>{tempK} K</span>
          </div>
          <input type="range" min={0} max={2000} step={10} value={tempK}
            onChange={e => setTempK(+e.target.value)}
            style={{ width: "100%" }} />

          <div style={{ fontSize: 11, marginTop: 12, lineHeight: 1.8, color: T.muted }}>
            dH = <span style={{ color: T.eo_e }}>{dH.toFixed(3)} eV</span><br />
            dS = <span style={{ color: T.eo_valence }}>{dS.toFixed(4)} eV/K</span><br />
            TdS = <span style={{ color: T.eo_photon }}>{(tempK * dS).toFixed(3)} eV</span><br />
            <b>dG = dH - TdS = <span style={{ color: dgColor }}>{dG.toFixed(3)} eV</span></b><br />
            E_activation = <span style={{ color: T.eo_photon }}>{Eact.toFixed(2)} eV</span>
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Negative formation energy only means the compound is lower in energy than the
            separated elements. True stability requires it to also beat all competing phases.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            J. Willard Gibbs, working in relative obscurity at Yale in the 1870s, developed the concept of free energy -- the quantity that determines whether a reaction occurs spontaneously. His insight that G = H - TS captures the competition between energy minimization and entropy maximization. Today, DFT calculations of Gibbs free energy predict which semiconductor compounds are thermodynamically stable before anyone steps into the lab.
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
            Key Insight
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Thermodynamics decides which phase is lowest in free energy.
            Kinetics decides whether you can actually make it on lab timescales.
          </div>
        </div>

        <div style={{
          background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Coming Next: Phase Diagrams {"→"}</div>
          <div style={{ color: T.ink }}>
            Free energy determines stability, but real materials contain multiple elements at varying temperatures. Phase diagrams map out which phases exist under every condition — the recipe book for crystal growth.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Section 5: Phase Diagram ───────────────────────────────────────────────

function PhaseDiagramSection() {
  const [frame, setFrame] = useState(0);
  const [compX, setCompX] = useState(0.3);
  const [tempFrac, setTempFrac] = useState(0.6);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 55);
    return () => clearInterval(id);
  }, []);

  const W = 340, H = 320;
  const mL = 50, mR = 20, mT = 25, mB = 40;
  const pW = W - mL - mR;
  const pH_ = H - mT - mB;

  const Tmin = 200, Tmax = 1200;
  const tempK = Tmin + tempFrac * (Tmax - Tmin);

  const toSX = (c) => mL + c * pW;
  const toSY = (t) => mT + (1 - (t - Tmin) / (Tmax - Tmin)) * pH_;

  const eutecticX = 0.4;
  const eutecticT = 500;
  const meltA = 1000;
  const meltB = 900;

  const liquidusL = (x) => meltA + (eutecticT - meltA) * (x / eutecticX);
  const liquidusR = (x) => meltB + (eutecticT - meltB) * ((1 - x) / (1 - eutecticX));
  const liquidus = (x) => x <= eutecticX ? liquidusL(x) : liquidusR(x);

  const solidusT = eutecticT;

  let liquidusPath = "M" + toSX(0).toFixed(1) + "," + toSY(meltA).toFixed(1);
  for (let i = 1; i <= 50; i++) {
    const x = i / 50;
    const lt = liquidus(x);
    liquidusPath += "L" + toSX(x).toFixed(1) + "," + toSY(lt).toFixed(1);
  }

  let twoPhaseFill = "M" + toSX(0).toFixed(1) + "," + toSY(meltA).toFixed(1);
  for (let i = 0; i <= 50; i++) {
    const x = i / 50;
    twoPhaseFill += "L" + toSX(x).toFixed(1) + "," + toSY(liquidus(x)).toFixed(1);
  }
  twoPhaseFill += "L" + toSX(1).toFixed(1) + "," + toSY(solidusT).toFixed(1);
  twoPhaseFill += "L" + toSX(0).toFixed(1) + "," + toSY(solidusT).toFixed(1) + "Z";

  const cx = toSX(compX);
  const cy = toSY(tempK);

  const liqT = liquidus(compX);
  let phase;
  if (tempK > liqT) {
    phase = "Liquid";
  } else if (tempK > solidusT) {
    phase = "Liquid + Solid (two-phase)";
  } else {
    phase = "Solid (alpha + beta)";
  }

  const inTwoPhase = tempK <= liqT && tempK > solidusT;
  let leverFracLiq = 0;
  if (inTwoPhase) {
    let xL = 0, xS = 0;
    if (compX <= eutecticX) {
      xL = eutecticX * (1 - (tempK - solidusT) / (liquidusL(0) - solidusT));
      xS = 0;
    } else {
      xL = eutecticX + (1 - eutecticX) * ((tempK - solidusT) / (liquidusR(1) - solidusT));
      xS = 1;
    }
    const denom = Math.abs(xL - xS);
    leverFracLiq = denom > 0.01 ? Math.abs(compX - xS) / denom : 0.5;
    leverFracLiq = Math.max(0, Math.min(1, leverFracLiq));
  }

  const pulse = 0.5 + 0.3 * Math.sin(frame * 0.1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          A phase diagram is like a weather map for materials. Instead of predicting rain or sunshine based on pressure and temperature, it predicts which crystal structure (phase) is stable. The boundaries between phases are like weather fronts {"—"} cross them and the material transforms. The eutectic point is like the perfect storm where multiple phases coexist. Engineers use phase diagrams the way pilots use weather charts: to navigate safely through processing conditions.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
          <rect x={mL} y={mT} width={pW} height={toSY(solidusT) - mT}
            fill={T.eo_cond} opacity={0.06} />

          <path d={twoPhaseFill} fill={T.eo_photon} opacity={0.1} />

          <rect x={mL} y={toSY(solidusT)} width={pW} height={pH_ - (toSY(solidusT) - mT)}
            fill={T.eo_core} opacity={0.06} />

          <path d={liquidusPath} fill="none" stroke={T.eo_e} strokeWidth={2.5} />

          <line x1={mL} y1={toSY(solidusT)} x2={mL + pW} y2={toSY(solidusT)}
            stroke={T.eo_hole} strokeWidth={2} />

          <circle cx={toSX(eutecticX)} cy={toSY(eutecticT)} r={5}
            fill={T.eo_gap} stroke="#fff" strokeWidth={1.5} />
          <text x={toSX(eutecticX) + 8} y={toSY(eutecticT) - 6}
            fontSize={9} fill={T.eo_gap} fontFamily="monospace" fontWeight={700}>
            Eutectic
          </text>

          <text x={mL + pW / 2} y={mT + 15} textAnchor="middle"
            fontSize={10} fill={T.eo_cond} fontFamily="monospace" opacity={0.7}>Liquid</text>
          <text x={mL + pW * 0.2} y={toSY((solidusT + liqT) / 2)}
            fontSize={9} fill={T.eo_photon} fontFamily="monospace" opacity={0.6}>L+S</text>
          <text x={mL + pW / 2} y={toSY(solidusT) + 20} textAnchor="middle"
            fontSize={10} fill={T.eo_core} fontFamily="monospace" opacity={0.7}>
            Solid (alpha + beta)
          </text>

          <line x1={cx} y1={mT} x2={cx} y2={H - mB}
            stroke={T.eo_hole} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
          <line x1={mL} y1={cy} x2={mL + pW} y2={cy}
            stroke={T.eo_hole} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
          <circle cx={cx} cy={cy} r={6} fill={T.eo_hole} opacity={pulse}
            stroke={T.eo_hole} strokeWidth={2} />

          <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke={T.border} strokeWidth={1} />
          <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke={T.border} strokeWidth={1} />

          <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace">Composition (% B)</text>
          <text x={mL - 5} y={H - mB + 3} textAnchor="end" fontSize={8} fill={T.dim}
            fontFamily="monospace">0%</text>
          <text x={mL + pW + 2} y={H - mB + 3} fontSize={8} fill={T.dim}
            fontFamily="monospace">100%</text>

          <text x={8} y={H / 2} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace" transform={`rotate(-90,8,${H / 2})`}>Temperature (K)</text>
          {[Tmin, 500, 800, Tmax].map((tv, i) => (
            <text key={i} x={mL - 6} y={toSY(tv) + 3} textAnchor="end"
              fontSize={8} fill={T.dim} fontFamily="monospace">{tv}</text>
          ))}

          <text x={mL + 4} y={H - mB - 4} fontSize={8} fill={T.dim} fontFamily="monospace">Zn</text>
          <text x={mL + pW - 10} y={H - mB - 4} fontSize={8} fill={T.dim} fontFamily="monospace">Te</text>
        </svg>

      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_e }}>
            Phase Diagram
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            Binary eutectic phase diagram for the Zn-Te system.
            Drag crosshair to explore phase stability.
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, marginBottom: 6 }}>
            <b>Composition:</b>{" "}
            <span style={{ color: T.eo_e }}>{(compX * 100).toFixed(0)}% B (Te)</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={compX}
            onChange={e => setCompX(+e.target.value)}
            style={{ width: "100%" }} />

          <div style={{ fontSize: 11, marginTop: 10, marginBottom: 6 }}>
            <b>Temperature:</b>{" "}
            <span style={{ color: T.eo_hole }}>{tempK.toFixed(0)} K</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={tempFrac}
            onChange={e => setTempFrac(+e.target.value)}
            style={{ width: "100%" }} />
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Phase at Crosshair</div>
          <div style={{ fontSize: 12, color: T.eo_core, fontWeight: 700, marginBottom: 6 }}>
            {phase}
          </div>
          {inTwoPhase && (
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
              <b>Lever rule:</b><br />
              Liquid fraction: {(leverFracLiq * 100).toFixed(1)}%<br />
              Solid fraction: {((1 - leverFracLiq) * 100).toFixed(1)}%
            </div>
          )}
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Phase diagrams map stability. For CZTS, we need Cu2ZnSnS4
            to be stable against decomposing into CuS + ZnS + SnS2.
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Gibbs's phase rule F = C - P + 2 governs how many independent variables you can change without altering coexisting phases. Binary phase diagrams were historically determined by thermal analysis -- melting mixtures and recording cooling curves. Today, CALPHAD methods combine these measurements with DFT calculations to predict phase stability in complex multicomponent systems like CZTS.
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
            Key Insight
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Multinary compounds have complex phase spaces -
            competing phases - narrow stability windows.
          </div>
        </div>

        <div style={{
          background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Coming Next: Chemical Potential {"→"}</div>
          <div style={{ color: T.ink }}>
            Phase diagrams show bulk stability, but thin-film growth requires controlling individual element chemical potentials. The stability polygon tells us the narrow window of conditions where our desired phase forms without competing phases.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Section 6: Chemical Potential ──────────────────────────────────────────

function ChemicalPotentialSection() {
  const [frame, setFrame] = useState(0);
  const [muA, setMuA] = useState(-1.0);
  const [muB, setMuB] = useState(-1.0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 55);
    return () => clearInterval(id);
  }, []);

  const W = 340, H = 320;
  const mL = 45, mR = 15, mT = 20, mB = 40;
  const pW = W - mL - mR;
  const pH_ = H - mT - mB;

  const muMin = -3, muMax = 0;
  const toSX = (mu) => mL + ((mu - muMin) / (muMax - muMin)) * pW;
  const toSY = (mu) => mT + (1 - (mu - muMin) / (muMax - muMin)) * pH_;

  const dHf = -2.5;

  const polyPts = [
    { a: 0, b: dHf },
    { a: dHf * 0.3, b: dHf * 0.7 },
    { a: dHf * 0.5, b: dHf * 0.5 },
    { a: dHf * 0.7, b: dHf * 0.3 },
    { a: dHf, b: 0 },
  ];

  const boundaryMin = -2.8;
  const stablePoly = [
    { a: -0.2, b: dHf + 0.2 },
    { a: -0.5, b: dHf + 0.5 },
    { a: dHf / 2, b: dHf / 2 },
    { a: dHf + 0.5, b: -0.5 },
    { a: dHf + 0.2, b: -0.2 },
  ];

  const polyPath = stablePoly.map((p, i) =>
    (i === 0 ? "M" : "L") + toSX(p.a).toFixed(1) + "," + toSY(p.b).toFixed(1)
  ).join("") + "Z";

  const constraintLine = "M" + toSX(0).toFixed(1) + "," + toSY(dHf).toFixed(1) +
    "L" + toSX(dHf).toFixed(1) + "," + toSY(0).toFixed(1);

  const isStable = (a, b) => {
    const sum = a + b;
    return sum >= dHf - 0.3 && sum <= dHf + 0.3 && a <= -0.1 && b <= -0.1 && a >= dHf + 0.1 && b >= dHf + 0.1;
  };

  const ptX = toSX(muA);
  const ptY = toSY(muB);
  const sumAB = muA + muB;
  const deviation = sumAB - dHf;
  const isInStable = Math.abs(deviation) < 0.5 && muA < -0.1 && muB < -0.1 && muA > dHf + 0.1 && muB > dHf + 0.1;

  const regionLabel = muA > -0.5 ? "A-rich (Cu-rich)" :
    muB > -0.5 ? "B-rich (Zn-rich)" :
    isInStable ? "Stable compound AB" : "Near stability region";

  const regionColor = isInStable ? T.eo_valence :
    muA > -0.5 ? T.eo_cond : muB > -0.5 ? T.eo_gap : T.eo_photon;

  const pulse = 0.5 + 0.3 * Math.sin(frame * 0.12);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Chemical potential is like water pressure in connected tanks. Each tank (phase or species) has a water level (chemical potential). At equilibrium, water flows until all connected tanks reach the same level. If you add atoms to a crystal, the chemical potential tells you how much the system{"'"}s energy changes {"—"} like how much the water level rises when you pour more in. In defect physics, it controls which defects form: change the {"'"}pressure{"'"} (growth conditions) and different defects become favorable.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
      <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, display: "flex", alignItems: "center" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
          <rect x={mL} y={mT} width={toSX(-0.5) - mL} height={pH_}
            fill={T.eo_cond} opacity={0.06} />
          <rect x={mL} y={mT} width={pW} height={toSY(-0.5) - mT}
            fill={T.eo_gap} opacity={0.06} />

          <path d={polyPath} fill={T.eo_valence} opacity={0.2}
            stroke={T.eo_valence} strokeWidth={2} />

          <line x1={toSX(0)} y1={toSY(dHf)} x2={toSX(dHf)} y2={toSY(0)}
            stroke={T.eo_core} strokeWidth={1.5} strokeDasharray="6,4" />
          <text x={toSX(dHf / 2) + 8} y={toSY(dHf / 2) - 8}
            fontSize={9} fill={T.eo_core} fontFamily="monospace">
            mu_A + mu_B = dH_f
          </text>

          {stablePoly.map((p, i) => {
            const next = stablePoly[(i + 1) % stablePoly.length];
            return (
              <line key={i} x1={toSX(p.a)} y1={toSY(p.b)} x2={toSX(next.a)} y2={toSY(next.b)}
                stroke={T.eo_valence} strokeWidth={2} />
            );
          })}

          <text x={toSX(-0.3)} y={toSY(-0.3) + 15} fontSize={8} fill={T.eo_cond}
            fontFamily="monospace">A-rich</text>
          <text x={toSX(dHf + 0.3)} y={toSY(dHf + 0.3) - 20} fontSize={8} fill={T.eo_gap}
            fontFamily="monospace">B-rich</text>
          <text x={toSX(dHf / 2) - 15} y={toSY(dHf / 2) + 15} fontSize={9}
            fill={T.eo_valence} fontFamily="monospace" fontWeight={700}>Stable</text>

          <circle cx={ptX} cy={ptY} r={7} fill={regionColor} opacity={pulse}
            stroke={regionColor} strokeWidth={2} />
          <circle cx={ptX} cy={ptY} r={3} fill="#fff" />

          <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke={T.border} strokeWidth={1} />
          <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke={T.border} strokeWidth={1} />

          <text x={W / 2} y={H - 5} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace">mu_A (eV)</text>
          <text x={8} y={H / 2} textAnchor="middle" fontSize={10} fill={T.muted}
            fontFamily="monospace" transform={`rotate(-90,8,${H / 2})`}>mu_B (eV)</text>

          {[-3, -2, -1, 0].map((v, i) => (
            <g key={i}>
              <text x={toSX(v)} y={H - mB + 14} textAnchor="middle"
                fontSize={8} fill={T.dim} fontFamily="monospace">{v}</text>
              <text x={mL - 6} y={toSY(v) + 3} textAnchor="end"
                fontSize={8} fill={T.dim} fontFamily="monospace">{v}</text>
            </g>
          ))}
        </svg>

      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.eo_valence }}>
            Chemical Potentials
          </div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
            Chemical potential mu_i represents how much of element i is
            available during growth. The stability polygon shows where
            compound AB is thermodynamically stable.
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, marginBottom: 6 }}>
            <b>mu_A (Cu):</b>{" "}
            <span style={{ color: T.eo_cond }}>{muA.toFixed(2)} eV</span>
            <span style={{ fontSize: 10, color: T.dim }}>{muA > -0.5 ? " (Cu-rich)" : muA < -2 ? " (Cu-poor)" : ""}</span>
          </div>
          <input type="range" min={muMin} max={muMax} step={0.02} value={muA}
            onChange={e => setMuA(+e.target.value)}
            style={{ width: "100%" }} />

          <div style={{ fontSize: 11, marginTop: 10, marginBottom: 6 }}>
            <b>mu_B (Zn):</b>{" "}
            <span style={{ color: T.eo_gap }}>{muB.toFixed(2)} eV</span>
            <span style={{ fontSize: 10, color: T.dim }}>{muB > -0.5 ? " (Zn-rich)" : muB < -2 ? " (Zn-poor)" : ""}</span>
          </div>
          <input type="range" min={muMin} max={muMax} step={0.02} value={muB}
            onChange={e => setMuB(+e.target.value)}
            style={{ width: "100%" }} />
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Current Region</div>
          <div style={{ fontSize: 12, color: regionColor, fontWeight: 700, marginBottom: 6 }}>
            {regionLabel}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            mu_A + mu_B = <span style={{ color: T.eo_core }}>{sumAB.toFixed(2)} eV</span><br />
            dH_f(AB) = {dHf.toFixed(1)} eV<br />
            Deviation: {deviation.toFixed(2)} eV
          </div>
        </div>

        <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Defect formation energy depends on chemical potentials:<br />
            <b>E_f = E_defect - E_perfect + Sum(n_i * mu_i) + q * E_F</b>
          </div>
        </div>

        <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>The Story</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            Computational materials scientists use chemical potential diagrams (stability polygons) to predict growth conditions for defect-free semiconductors. By mapping which phases are stable at each combination of elemental chemical potentials, researchers can identify the narrow window of conditions where the desired compound forms without harmful secondary phases or excessive point defects.
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
            Key Insight
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Growth conditions (Cu-rich vs Cu-poor) determine which
            defects form. This is how experimentalists control doping!
          </div>
        </div>

        <div style={{
          background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Coming Next: From Atom to Device {"→"}</div>
          <div style={{ color: T.ink }}>
            We{"'"}ve traced electrons from atomic orbitals through crystal bands to doped semiconductors. Now we connect all the pieces {"—"} from a single atom{"'"}s quantum states to a working solar cell or LED.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXISTING: DEFECT STATES (Section 18)
// ═══════════════════════════════════════════════════════════════════════════

// ── SECTION 4: DEFECT STATES ────────────────────────────────────────────────
function DefectSection() {
  const [charge, setCharge] = useState(0);  // -2,-1,0,+1,+2
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const chargeStates = [
    {
      q: -2, label: "q = −2",
      nelect: "default + 2",
      filling: [2, 2, 2, 2],  // up to 4 defect levels, 0=empty,1=half,2=full
      color: T.eo_e,
      desc: "Two extra electrons added. All dangling bond states fully filled. Te atoms pull inward.",
      te_dist: "2.74 Å (inward)",
    },
    {
      q: -1, label: "q = −1",
      nelect: "default + 1",
      filling: [2, 2, 2, 1],
      color: "#93c5fd",
      desc: "One extra electron. Three full, one half-filled dangling bond state.",
      te_dist: "2.78 Å (inward)",
    },
    {
      q: 0, label: "q = 0",
      nelect: "default",
      filling: [2, 2, 1, 0],
      color: T.eo_valence,
      desc: "Neutral vacancy. Dangling bonds partially filled from Te atoms around the vacancy.",
      te_dist: "2.82 Å (reference)",
    },
    {
      q: +1, label: "q = +1",
      nelect: "default − 1",
      filling: [2, 2, 0, 0],
      color: T.eo_hole,
      desc: "One electron removed. A hole appears in the defect level. Te atoms push outward.",
      te_dist: "2.86 Å (outward)",
    },
    {
      q: +2, label: "q = +2",
      nelect: "default − 2",
      filling: [2, 0, 0, 0],
      color: T.eo_gap,
      desc: "Two electrons removed. Most dangling bonds empty. Te atoms pushed furthest out.",
      te_dist: "2.91 Å (outward)",
    },
  ];

  const cs = chargeStates[charge + 2];
  const VBtop = 240, CBbot = 80, defY = [150, 168, 186, 204];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox>
          Crystal defects are like typos in a perfectly written book. A vacancy is a missing letter. An interstitial is an extra letter squeezed in. A substitution is the wrong letter in the right place. An antisite is two letters swapped. Just as typos can change the meaning of a sentence, defects change a crystal{"'"}s properties {"—"} a single vacancy in ZnTe can turn an insulator into a p-type semiconductor. Defects aren{"'"}t mistakes; they{"'"}re features that engineers deliberately create.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {/* Diagram */}
      <div style={{ flex: "0 0 340px" }}>
        <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 320 }}>
          <rect width={320} height={320} fill={T.bg} rx={10} />

          {/* Valence band */}
          <rect x={20} y={VBtop} width={220} height={50} rx={4}
            fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
          <text x={30} y={VBtop + 22} fill={T.eo_valence} fontSize={12} fontWeight="bold">Valence Band</text>
          <text x={30} y={VBtop + 38} fill={T.muted} fontSize={10}>fully occupied (from Zn+Te atoms)</text>

          {/* Conduction band */}
          <rect x={20} y={40} width={220} height={35} rx={4}
            fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
          <text x={30} y={60} fill={T.eo_cond} fontSize={12} fontWeight="bold">Conduction Band</text>

          {/* Gap label */}
          <text x={250} y={170} fill={T.eo_gap} fontSize={10} fontWeight="bold">GAP</text>
          <text x={250} y={184} fill={T.muted} fontSize={9}>2.26 eV</text>

          {/* Defect levels */}
          {defY.map((y, i) => {
            const fill = cs.filling[i]; // 0=empty, 1=half, 2=full
            return (
              <g key={i}>
                <line x1={50} y1={y} x2={220} y2={y}
                  stroke={cs.color} strokeWidth={2} opacity={0.6} />
                <text x={30} y={y + 4} textAnchor="middle" fill={T.muted} fontSize={9}>
                  D{i + 1}
                </text>
                {/* Electron filling */}
                {fill >= 1 && (
                  <circle cx={110} cy={y - 7} r={5} fill={T.eo_e}>
                    <animate attributeName="cy" values={`${y - 7};${y - 9};${y - 7}`}
                      dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {fill >= 2 && (
                  <circle cx={140} cy={y - 7} r={5} fill={T.eo_e}>
                    <animate attributeName="cy" values={`${y - 7};${y - 9};${y - 7}`}
                      dur="2.3s" repeatCount="indefinite" />
                  </circle>
                )}
                {fill === 1 && (
                  <circle cx={140} cy={y - 7} r={5}
                    fill="none" stroke={T.eo_hole} strokeWidth={1.5} />
                )}
                {fill === 0 && (
                  <>
                    <circle cx={110} cy={y - 7} r={5}
                      fill="none" stroke={T.muted} strokeWidth={1} opacity={0.4} />
                    <circle cx={140} cy={y - 7} r={5}
                      fill="none" stroke={T.muted} strokeWidth={1} opacity={0.4} />
                  </>
                )}
              </g>
            );
          })}

          {/* Vacancy site */}
          <rect x={60} y={260} width={160} height={50} rx={8}
            fill={cs.color + "11"} stroke={cs.color} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={140} y={281} textAnchor="middle" fill={cs.color} fontSize={11} fontWeight="bold">
            V_Zn vacancy
          </text>
          <text x={140} y={297} textAnchor="middle" fill={T.muted} fontSize={10}>
            Te-vacancy: {cs.te_dist}
          </text>

          {/* NELECT label */}
          <text x={160} y={20} textAnchor="middle" fill={T.muted} fontSize={10}>
            NELECT = {cs.nelect}
          </text>
        </svg>

        {/* Charge state selector */}
        <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
          {chargeStates.map((c, i) => (
            <button key={i} onClick={() => setCharge(c.q)} style={{
              flex: 1, padding: "7px 2px", fontSize: 11, borderRadius: 7,
              background: charge === c.q ? c.color + "22" : T.surface,
              border: `1px solid ${charge === c.q ? c.color : T.border}`,
              color: charge === c.q ? c.color : T.muted,
              cursor: "pointer",
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          background: cs.color + "11",
          border: `1px solid ${cs.color}44`,
          borderRadius: 10,
          padding: 14,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: cs.color, marginBottom: 8 }}>
            {cs.label} — {cs.nelect}
          </div>
          <p style={{ fontSize: 13, color: T.ink, lineHeight: 1.8, margin: 0 }}>
            {cs.desc}
          </p>
        </div>

        {/* Dangling bond explanation */}
        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 0.5 }}>Why dangling bonds?</div>
          <p style={{ fontSize: 12, color: T.ink, lineHeight: 1.8, margin: "0 0 10px" }}>
            Zn normally bonds to 4 Te atoms, sharing its 2 electrons across 4 bonds (0.5e per bond from Zn side).
            Remove Zn → 4 Te atoms each have a half-bond pointing into empty space.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 8 }}>
            {[
              { label: "Normal Te-Zn bond", state: "Te ── Zn (shared electrons)", color: T.eo_valence },
              { label: "Dangling bond (V_Zn)", state: "Te ── [empty space]", color: T.eo_gap },
            ].map(({ label, state, color }) => (
              <div key={label} style={{
                padding: "8px 10px", borderRadius: 8,
                background: color + "11", border: `1px solid ${color}33`,
              }}>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color, fontFamily: "monospace" }}>{state}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bader charges */}
        <div style={{ background: T.surface, borderRadius: 10, padding: 14, border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, letterSpacing: 0.5 }}>Bader charge on Te atoms near vacancy</div>
          {[
            { q: 0, te: "6.00", delta: "0.00", color: T.eo_valence },
            { q: -1, te: "6.25", delta: "+0.25", color: T.eo_e },
            { q: 1, te: "5.75", delta: "−0.25", color: T.eo_hole },
          ].map(({ q: bq, te, delta, color }) => (
            <div key={bq} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "5px 8px", marginBottom: 4, borderRadius: 6,
              background: charge === bq ? color + "15" : "transparent",
              border: `1px solid ${charge === bq ? color + "44" : "transparent"}`,
            }}>
              <div style={{ fontSize: 11, color, minWidth: 55, fontFamily: "monospace" }}>q={bq > 0 ? "+" : ""}{bq}</div>
              <div style={{ fontSize: 12, color: T.ink, fontFamily: "monospace" }}>{te}e per Te atom</div>
              <div style={{ fontSize: 12, color, fontFamily: "monospace", fontWeight: 700 }}>Δ={delta}e</div>
            </div>
          ))}
          <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.6, margin: "8px 0 0" }}>
            The extra/missing electron distributes equally across the 4 Te atoms
            surrounding the vacancy — each gets ±0.25e.
            No single atom owns it entirely.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOCK E+F: DEFECTS & OPTICS + SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

// ── Section 1: DefectThermodynamicsSection ──────────────────────────────────

function DefectThermodynamicsSection() {
  const [fermiLevel, setFermiLevel] = useState(1.13);
  const [dragging, setDragging] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const bandGap = 2.26;
  const margin = { l: 55, r: 20, t: 30, b: 45 };
  const plotW = 340 - margin.l - margin.r;
  const plotH = 320 - margin.t - margin.b;

  const charges = [
    { q: 0, ef0: 1.2, color: T.eo_e, label: "q=0" },
    { q: -1, ef0: 0.6, color: T.eo_hole, label: "q=−1" },
    { q: -2, ef0: 0.3, color: T.eo_cond, label: "q=−2" },
  ];

  const toX = ef => margin.l + (ef / bandGap) * plotW;
  const toY = e => margin.t + plotH - (e / 4) * plotH;
  const formE = (c, ef) => c.ef0 + c.q * ef;

  const ctls = [];
  for (let i = 0; i < charges.length - 1; i++) {
    const a = charges[i], b = charges[i + 1];
    const ef_cross = (b.ef0 - a.ef0) / (a.q - b.q);
    if (ef_cross >= 0 && ef_cross <= bandGap) {
      ctls.push({ ef: ef_cross, e: formE(a, ef_cross), labelA: a.label, labelB: b.label });
    }
  }

  const envelopePoints = [];
  for (let ef = 0; ef <= bandGap; ef += 0.02) {
    const minE = Math.min(...charges.map(c => formE(c, ef)));
    envelopePoints.push({ x: toX(ef), y: toY(minE) });
  }
  const envelopePath = envelopePoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const stableQ = charges.reduce((best, c) => formE(c, fermiLevel) < formE(best, fermiLevel) ? c : best, charges[0]);
  const currentE = formE(stableQ, fermiLevel);

  const handleSvgMouse = (e) => {
    if (!dragging) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ef = Math.max(0, Math.min(bandGap, ((x - margin.l) / plotW) * bandGap));
    setFermiLevel(ef);
  };

  const pulse = Math.sin(frame * 0.12) * 0.5 + 0.5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Defect thermodynamics is like calculating the cost of leaving a seat empty in an airplane. The formation energy is the {"'"}ticket price{"'"} {"—"} how much energy it costs to create the defect. But empty seats also increase entropy (disorder = more seating arrangements), which nature loves. At any temperature, there{"'"}s an equilibrium number of defects that minimizes the total cost (free energy). Higher temperature = more defects, just as a hotter economy tolerates more vacancies.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg
        width={340} height={320}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, cursor: dragging ? "grabbing" : "default" }}
        onMouseMove={handleSvgMouse}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <rect x={margin.l} y={margin.t} width={plotW} height={plotH} fill={T.surface} />

        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <line x1={margin.l} y1={toY(i)} x2={margin.l + plotW} y2={toY(i)} stroke={T.dim} strokeWidth={0.5} />
            <text x={margin.l - 5} y={toY(i) + 4} textAnchor="end" fontSize={10} fill={T.muted}>{i}</text>
          </g>
        ))}

        {[0, 0.5, 1.0, 1.5, 2.0].map(v => (
          <g key={v}>
            <line x1={toX(v)} y1={margin.t} x2={toX(v)} y2={margin.t + plotH} stroke={T.dim} strokeWidth={0.5} />
            <text x={toX(v)} y={margin.t + plotH + 14} textAnchor="middle" fontSize={10} fill={T.muted}>{v.toFixed(1)}</text>
          </g>
        ))}

        <line x1={toX(0)} y1={margin.t} x2={toX(0)} y2={margin.t + plotH} stroke={T.eo_valence} strokeWidth={2} strokeDasharray="6,3" />
        <text x={toX(0) + 3} y={margin.t + 12} fontSize={9} fill={T.eo_valence}>VBM</text>
        <line x1={toX(bandGap)} y1={margin.t} x2={toX(bandGap)} y2={margin.t + plotH} stroke={T.eo_cond} strokeWidth={2} strokeDasharray="6,3" />
        <text x={toX(bandGap) - 3} y={margin.t + 12} textAnchor="end" fontSize={9} fill={T.eo_cond}>CBM</text>

        {charges.map((c, i) => {
          const x1 = toX(0), y1 = toY(formE(c, 0));
          const x2 = toX(bandGap), y2 = toY(formE(c, bandGap));
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
              <text x={x2 + 3} y={y2 + 4} fontSize={9} fill={c.color}>{c.label}</text>
            </g>
          );
        })}

        <path d={envelopePath} fill="none" stroke={T.ink} strokeWidth={2.5} />

        {ctls.map((ctl, i) => (
          <g key={i}>
            <circle cx={toX(ctl.ef)} cy={toY(ctl.e)} r={5} fill={T.eo_gap} opacity={0.8 + pulse * 0.2} />
            <text x={toX(ctl.ef)} y={toY(ctl.e) - 8} textAnchor="middle" fontSize={8} fill={T.eo_gap}>
              ε({ctl.labelA}/{ctl.labelB})
            </text>
          </g>
        ))}

        <line
          x1={toX(fermiLevel)} y1={margin.t} x2={toX(fermiLevel)} y2={margin.t + plotH}
          stroke={T.eo_e} strokeWidth={2} opacity={0.7}
        />
        <circle
          cx={toX(fermiLevel)} cy={toY(Math.max(0, currentE))}
          r={6} fill={stableQ.color} stroke={T.ink} strokeWidth={1.5}
          style={{ cursor: "grab" }}
          onMouseDown={() => setDragging(true)}
        />
        <text x={toX(fermiLevel)} y={margin.t - 5} textAnchor="middle" fontSize={9} fill={T.eo_e}>
          E_F={fermiLevel.toFixed(2)} eV
        </text>

        <text x={margin.l + plotW / 2} y={margin.t + plotH + 35} textAnchor="middle" fontSize={11} fill={T.ink}>
          Fermi Level (eV)
        </text>
        <text x={15} y={margin.t + plotH / 2} textAnchor="middle" fontSize={11} fill={T.ink}
          transform={`rotate(-90,15,${margin.t + plotH / 2})`}>
          Formation Energy (eV)
        </text>

        <text x={margin.l + plotW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
          V_Zn Defect in ZnTe
        </text>
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Formation Energy Formula</div>
          <div style={{ fontSize: 11, background: T.surface, padding: 8, borderRadius: 4, lineHeight: 1.6 }}>
            E<sub>f</sub> = E<sub>defect</sub> − E<sub>perfect</sub> + Σ n<sub>i</sub>μ<sub>i</sub> + q(E<sub>VBM</sub> + E<sub>F</sub>) + corrections
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 8, lineHeight: 1.6 }}>
            <div>• E<sub>defect</sub>: total energy of supercell with defect</div>
            <div>• E<sub>perfect</sub>: total energy of pristine supercell</div>
            <div>• n<sub>i</sub>μ<sub>i</sub>: chemical potential correction for added/removed atoms</div>
            <div>• q(E<sub>VBM</sub>+E<sub>F</sub>): charge state × Fermi level</div>
            <div>• corrections: image charge, potential alignment</div>
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>Charge Transition Level (CTL)</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            ε(q/q') = Fermi level where charge state changes from q to q'. Lines cross → lower energy state becomes stable.
          </div>
          <div style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
            <span style={{ color: T.eo_gap, fontWeight: "bold" }}>Deep levels</span> (mid-gap): trap carriers → recombination centers → bad for solar cells.
          </div>
          <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
            <span style={{ color: T.eo_valence, fontWeight: "bold" }}>Shallow levels</span> (near band edges): release carriers easily → good dopants.
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>Current State</div>
          <div style={{ fontSize: 11 }}>
            E<sub>F</sub> = {fermiLevel.toFixed(2)} eV → Stable: <span style={{ color: stableQ.color, fontWeight: "bold" }}>{stableQ.label}</span>,
            E<sub>f</sub> = {currentE.toFixed(2)} eV
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Drag the dot on the diagram to change Fermi level.</div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> Low formation energy → defect forms easily. Deep transition levels → defect traps carriers → bad for solar cells. Shallow levels → good dopant.
        </div>
      </div>
      </div>
    </div>
  );
}


// ── Section 2: PhononsSection ───────────────────────────────────────────────

function PhononsSection() {
  const [mode, setMode] = useState("acoustic");
  const [kFrac, setKFrac] = useState(0.3);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 45);
    return () => clearInterval(id);
  }, []);

  const nAtoms = 12;
  const a = 24;
  const chainY = 100;
  const svgW = 340, svgH = 320;
  const amplitude = 14;
  const omega = 0.08;
  const k = kFrac * Math.PI;
  const massRatio = 0.6;

  const atoms = [];
  for (let i = 0; i < nAtoms; i++) {
    const isHeavy = i % 2 === 0;
    const baseX = 30 + i * a;
    let dx;
    if (mode === "acoustic") {
      dx = amplitude * Math.sin(k * i - omega * frame);
    } else {
      const sign = isHeavy ? 1 : -1;
      const amp = isHeavy ? amplitude * massRatio : amplitude;
      dx = sign * amp * Math.sin(k * i - omega * frame);
    }
    atoms.push({
      x: baseX + dx,
      baseX,
      y: chainY,
      r: isHeavy ? 10 : 7,
      color: isHeavy ? T.eo_core : T.eo_valence,
      isHeavy,
    });
  }

  const dispH = 100;
  const dispY0 = 200;
  const dispMargin = { l: 50, r: 20 };
  const dispW = svgW - dispMargin.l - dispMargin.r;

  const acousticBranch = (kv) => 0.8 * Math.sin(kv / 2);
  const opticalBranch = (kv) => 1.0 - 0.15 * (1 - Math.cos(kv));

  const acousticPath = [];
  const opticalPath = [];
  for (let i = 0; i <= 50; i++) {
    const kv = (i / 50) * Math.PI;
    const xp = dispMargin.l + (i / 50) * dispW;
    acousticPath.push(`${i === 0 ? "M" : "L"}${xp},${dispY0 + dispH - acousticBranch(kv) * dispH}`);
    opticalPath.push(`${i === 0 ? "M" : "L"}${xp},${dispY0 + dispH - opticalBranch(kv) * dispH}`);
  }

  const currentKx = dispMargin.l + kFrac * dispW;
  const currentAcousticY = dispY0 + dispH - acousticBranch(k) * dispH;
  const currentOpticalY = dispY0 + dispH - opticalBranch(k) * dispH;
  const freqVal = mode === "acoustic" ? acousticBranch(k) : opticalBranch(k);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Phonons are like 'the wave' in a stadium. When fans stand up and sit down in sequence, a wave travels through the crowd — but no individual fan moves far. Similarly, phonons are quantized vibrations traveling through a crystal lattice. Acoustic phonons are like bass notes (atoms move in sync, low frequency). Optical phonons are like treble notes (adjacent atoms move opposite, high frequency). Phonons carry heat, scatter electrons, and determine thermal conductivity.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>

        <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
          {mode === "acoustic" ? "Acoustic Mode" : "Optical Mode"}
        </text>

        <rect x={10} y={30} width={svgW - 20} height={140} rx={6} fill={T.surface} stroke={T.border} />

        <line x1={20} y1={chainY} x2={svgW - 10} y2={chainY} stroke={T.dim} strokeWidth={0.5} strokeDasharray="2,2" />

        {atoms.map((at, i) => {
          if (i < atoms.length - 1) {
            const next = atoms[i + 1];
            return <line key={`b${i}`} x1={at.x} y1={at.y} x2={next.x} y2={next.y} stroke={T.border} strokeWidth={2} />;
          }
          return null;
        })}
        {atoms.map((at, i) => (
          <g key={i}>
            <circle cx={at.x} cy={at.y} r={at.r} fill={at.color} stroke={T.ink} strokeWidth={1} />
            {i < 2 && (
              <text x={at.x} y={at.y + at.r + 14} textAnchor="middle" fontSize={8} fill={T.muted}>
                {at.isHeavy ? "M" : "m"}
              </text>
            )}
          </g>
        ))}

        {atoms.map((at, i) => {
          const dx = at.x - at.baseX;
          if (Math.abs(dx) > 1) {
            return (
              <line key={`a${i}`} x1={at.baseX} y1={at.y - at.r - 4} x2={at.baseX + dx * 0.8} y2={at.y - at.r - 4}
                stroke={T.eo_gap} strokeWidth={1.5} markerEnd="url(#arrowPhon)" />
            );
          }
          return null;
        })}
        <defs>
          <marker id="arrowPhon" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill={T.eo_gap} />
          </marker>
        </defs>

        <text x={svgW / 2} y={dispY0 - 5} textAnchor="middle" fontSize={10} fontWeight="bold" fill={T.ink}>Dispersion: ω vs k</text>
        <rect x={dispMargin.l} y={dispY0} width={dispW} height={dispH} fill={T.surface} stroke={T.border} />

        <path d={acousticPath.join(" ")} fill="none" stroke={T.eo_e} strokeWidth={2} />
        <path d={opticalPath.join(" ")} fill="none" stroke={T.eo_hole} strokeWidth={2} />

        <text x={dispMargin.l + dispW + 2} y={currentAcousticY + 3} fontSize={8} fill={T.eo_e}>LA</text>
        <text x={dispMargin.l + dispW + 2} y={dispY0 + dispH - opticalBranch(Math.PI) * dispH + 3} fontSize={8} fill={T.eo_hole}>LO</text>

        <line x1={currentKx} y1={dispY0} x2={currentKx} y2={dispY0 + dispH} stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="3,2" />
        <circle cx={currentKx} cy={mode === "acoustic" ? currentAcousticY : currentOpticalY}
          r={5} fill={mode === "acoustic" ? T.eo_e : T.eo_hole} stroke={T.ink} strokeWidth={1.5} />

        <text x={dispMargin.l} y={dispY0 + dispH + 12} fontSize={9} fill={T.muted}>0</text>
        <text x={dispMargin.l + dispW} y={dispY0 + dispH + 12} textAnchor="end" fontSize={9} fill={T.muted}>π/a</text>
        <text x={dispMargin.l - 5} y={dispY0 + 8} textAnchor="end" fontSize={9} fill={T.muted}>ω</text>
        <text x={dispMargin.l + dispW / 2} y={dispY0 + dispH + 12} textAnchor="middle" fontSize={9} fill={T.muted}>k</text>
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Mode Selection</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["acoustic", "optical"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 4, border: `1px solid ${mode === m ? T.eo_e : T.border}`,
                  background: mode === m ? T.eo_e : T.panel, color: mode === m ? "#fff" : T.ink,
                  cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: "bold",
                }}>
                {m === "acoustic" ? "Acoustic (LA/TA)" : "Optical (LO/TO)"}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>k-vector: {(kFrac * Math.PI).toFixed(2)} (= {kFrac.toFixed(2)}π/a)</div>
            <input type="range" min={0.05} max={1} step={0.01} value={kFrac}
              onChange={e => setKFrac(+e.target.value)}
              style={{ width: "100%" }} />
          </div>
          <div style={{ fontSize: 11, marginTop: 6, color: T.eo_e }}>
            ω = {freqVal.toFixed(3)} (normalized)
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>
            {mode === "acoustic" ? "Acoustic Phonons" : "Optical Phonons"}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            {mode === "acoustic" ? (
              <>
                <div>• Adjacent atoms move <strong>in phase</strong></div>
                <div>• Carries sound waves through the crystal</div>
                <div>• ω → 0 as k → 0 (long wavelength limit)</div>
                <div>• Dominates <strong>thermal conductivity</strong></div>
              </>
            ) : (
              <>
                <div>• Adjacent atoms move <strong>out of phase</strong></div>
                <div>• Creates oscillating dipole → <strong>IR active</strong></div>
                <div>• Finite frequency at k=0 (zone center)</div>
                <div>• Probed by <strong>Raman spectroscopy</strong></div>
              </>
            )}
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>Properties</div>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>
            <div>• Thermal conductivity: governed by acoustic phonon scattering</div>
            <div>• IR absorption: optical phonons couple to EM radiation</div>
            <div>• Soft modes: imaginary frequency → structural instability</div>
          </div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> Phonons determine thermal stability and thermal conductivity. Soft phonon modes can indicate structural instability.
        </div>
      </div>
      </div>
    </div>
  );
}


// ── Section 3: OpticalPropertiesSection ─────────────────────────────────────

function OpticalPropertiesSection() {
  const [photonE, setPhotonE] = useState(2.0);
  const [gapType, setGapType] = useState("direct");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 45);
    return () => clearInterval(id);
  }, []);

  const bandGap = 1.5;
  const absorbed = photonE >= bandGap;
  const svgW = 340, svgH = 320;

  const eToColor = (e) => {
    if (e < 1.65) return "#880000";
    if (e < 1.9) return "#cc3300";
    if (e < 2.0) return "#ee6600";
    if (e < 2.1) return "#ddaa00";
    if (e < 2.3) return "#88cc00";
    if (e < 2.6) return "#00aa44";
    if (e < 2.8) return "#0066cc";
    if (e < 3.1) return "#4400cc";
    return "#6600aa";
  };
  const photonColor = photonE < 1.65 ? "#aa2222" : photonE > 3.1 ? "#8800cc" : eToColor(photonE);

  const eToWavelength = (e) => Math.round(1240 / e);

  const bandTop = 110;
  const vbTop = 200;
  const cbBottom = bandTop + 20;
  const bandLeft = 60;
  const bandRight = 280;

  const photonPhase = (frame * 3) % (svgW + 60);
  const photonX = -30 + photonPhase;
  const photonY = (vbTop + cbBottom) / 2;
  const waveLen = 16;

  const wavyPath = (x0, y0, length) => {
    let d = `M${x0},${y0}`;
    for (let i = 1; i <= length; i++) {
      const px = x0 + i * 2;
      const py = y0 + Math.sin(i * 0.8) * 4;
      d += ` L${px},${py}`;
    }
    return d;
  };

  const showAbsorption = absorbed && photonX > bandLeft && photonX < bandRight;
  const electronY = showAbsorption ? lerp(vbTop, cbBottom - 15, Math.min(1, (frame % 30) / 15)) : vbTop;
  const flashOpacity = showAbsorption ? Math.max(0, 1 - ((frame % 30) / 20)) : 0;

  const specLeft = 50, specRight = 300, specTop = 240, specBot = 310;
  const specW = specRight - specLeft;

  const alpha = (e) => {
    if (e < bandGap) return 0;
    if (gapType === "direct") return Math.sqrt(e - bandGap) * 0.7;
    return Math.pow(e - bandGap, 2) * 0.3;
  };

  const specPath = [];
  for (let i = 0; i <= 60; i++) {
    const e = 0.5 + (i / 60) * 3.5;
    const x = specLeft + (i / 60) * specW;
    const val = Math.min(1, alpha(e));
    const y = specBot - val * (specBot - specTop - 15);
    specPath.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }

  const currentAlpha = alpha(photonE);
  const indicatorX = specLeft + ((photonE - 0.5) / 3.5) * specW;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Optical properties are like a bouncer at a club. When a photon (light particle) arrives at a material, the bouncer checks its energy. If the photon's energy matches the band gap, it gets absorbed — the material is opaque at that color. If the energy is too low, the photon passes through — the material is transparent. If it gets reflected, the material is shiny. This is why glass (big gap) is transparent to visible light, silicon (small gap) absorbs it, and metals reflect it.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>

        <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
          Photon Absorption ({gapType} gap)
        </text>

        <rect x={bandLeft} y={25} width={bandRight - bandLeft} height={bandTop - 25} rx={4} fill="#e0f0ff" stroke={T.eo_cond} strokeWidth={1.5} />
        <text x={(bandLeft + bandRight) / 2} y={bandTop - 8} textAnchor="middle" fontSize={10} fill={T.eo_cond}>Conduction Band</text>

        <rect x={bandLeft} y={vbTop} width={bandRight - bandLeft} height={35} rx={4} fill="#e8f5e9" stroke={T.eo_valence} strokeWidth={1.5} />
        <text x={(bandLeft + bandRight) / 2} y={vbTop + 22} textAnchor="middle" fontSize={10} fill={T.eo_valence}>Valence Band</text>

        <text x={(bandLeft + bandRight) / 2} y={(cbBottom + vbTop) / 2 + 4} textAnchor="middle" fontSize={10} fill={T.eo_gap}>
          E_g = {bandGap} eV
        </text>
        <line x1={bandRight - 10} y1={cbBottom} x2={bandRight - 10} y2={vbTop} stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />

        {photonX < bandLeft && (
          <g>
            <path d={wavyPath(photonX, photonY, waveLen)} fill="none" stroke={photonColor} strokeWidth={2} />
            <polygon points={`${photonX + waveLen * 2 + 4},${photonY} ${photonX + waveLen * 2 - 2},${photonY - 4} ${photonX + waveLen * 2 - 2},${photonY + 4}`} fill={photonColor} />
          </g>
        )}

        {!absorbed && photonX >= bandLeft && (
          <g opacity={0.4}>
            <path d={wavyPath(photonX, photonY, waveLen)} fill="none" stroke={photonColor} strokeWidth={2} />
            <polygon points={`${photonX + waveLen * 2 + 4},${photonY} ${photonX + waveLen * 2 - 2},${photonY - 4} ${photonX + waveLen * 2 - 2},${photonY + 4}`} fill={photonColor} />
            <text x={photonX + waveLen} y={photonY - 12} textAnchor="middle" fontSize={8} fill={T.muted}>transparent</text>
          </g>
        )}

        {showAbsorption && (
          <g>
            <circle cx={(bandLeft + bandRight) / 2} cy={(cbBottom + vbTop) / 2} r={20} fill={T.eo_valence} opacity={flashOpacity * 0.3} />
            <circle cx={(bandLeft + bandRight) / 2} cy={electronY} r={5} fill={T.eo_e} stroke={T.ink} strokeWidth={1} />
            <circle cx={(bandLeft + bandRight) / 2} cy={vbTop + 5} r={4} fill="none" stroke={T.eo_hole} strokeWidth={1.5} />
          </g>
        )}

        <text x={specLeft} y={specTop - 2} fontSize={10} fontWeight="bold" fill={T.ink}>α(E) Absorption</text>
        <rect x={specLeft} y={specTop} width={specW} height={specBot - specTop} fill={T.surface} stroke={T.border} />
        <path d={specPath.join(" ")} fill="none" stroke={T.eo_gap} strokeWidth={2} />

        <line x1={specLeft + ((bandGap - 0.5) / 3.5) * specW} y1={specTop} x2={specLeft + ((bandGap - 0.5) / 3.5) * specW} y2={specBot}
          stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />
        <text x={specLeft + ((bandGap - 0.5) / 3.5) * specW} y={specBot + 10} textAnchor="middle" fontSize={8} fill={T.eo_gap}>E_g</text>

        {indicatorX >= specLeft && indicatorX <= specRight && (
          <circle cx={indicatorX} cy={specBot - Math.min(1, currentAlpha) * (specBot - specTop - 15)} r={4} fill={photonColor} stroke={T.ink} strokeWidth={1} />
        )}

        <text x={specLeft} y={specBot + 10} fontSize={8} fill={T.muted}>0.5</text>
        <text x={specRight} y={specBot + 10} textAnchor="end" fontSize={8} fill={T.muted}>4.0 eV</text>
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Photon Energy</div>
          <input type="range" min={0.5} max={4.0} step={0.05} value={photonE}
            onChange={e => setPhotonE(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
            <span>E = {photonE.toFixed(2)} eV</span>
            <span>λ = {eToWavelength(photonE)} nm</span>
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: photonColor, verticalAlign: "middle", border: `1px solid ${T.border}` }} />
          </div>
          <div style={{ fontSize: 11, marginTop: 6, color: absorbed ? T.eo_valence : T.muted, fontWeight: "bold" }}>
            {absorbed ? "ABSORBED — electron excited to CB" : "TRANSMITTED — photon passes through"}
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
            α = {currentAlpha.toFixed(3)} (normalized)
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Gap Type</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["direct", "indirect"].map(g => (
              <button key={g} onClick={() => setGapType(g)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 4, border: `1px solid ${gapType === g ? T.eo_e : T.border}`,
                  background: gapType === g ? T.eo_e : T.panel, color: gapType === g ? "#fff" : T.ink,
                  cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: "bold",
                }}>
                {g}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 8, lineHeight: 1.6 }}>
            {gapType === "direct"
              ? "Direct gap: α ~ √(E−E_g). Photon alone excites electron. Sharp absorption edge."
              : "Indirect gap: α ~ (E−E_g)². Needs phonon assistance → weaker absorption, gradual edge."}
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>SLME Connection</div>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>
            Spectroscopic Limited Maximum Efficiency uses α(E) to predict solar cell efficiency. Better absorption → higher SLME.
          </div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> This is why some materials are better solar absorbers than others. CdTe (direct, 1.5eV) absorbs sunlight in 1μm. Si (indirect, 1.1eV) needs 100μm.
        </div>
      </div>
      </div>
    </div>
  );
}


// ── Section 4: DielectricResponseSection ────────────────────────────────────

function DielectricResponseSection() {
  const [fieldOn, setFieldOn] = useState(false);
  const [frame, setFrame] = useState(0);
  const [fieldStrength, setFieldStrength] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame(f => f + 1);
      setFieldStrength(s => {
        const target = fieldOn ? 1 : 0;
        return lerp(s, target, 0.08);
      });
    }, 40);
    return () => clearInterval(id);
  }, [fieldOn]);

  const svgW = 340, svgH = 320;
  const gridRows = 4, gridCols = 5;
  const cellSize = 40;
  const gridX0 = (svgW - gridCols * cellSize) / 2;
  const gridY0 = 25;

  const charges = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const isPositive = (r + c) % 2 === 0;
      const cx = gridX0 + c * cellSize + cellSize / 2;
      const cy = gridY0 + r * cellSize + cellSize / 2;
      const displacement = fieldStrength * (isPositive ? 6 : -6);
      charges.push({
        x: cx + displacement,
        y: cy,
        isPositive,
        r: isPositive ? 9 : 7,
      });
    }
  }

  const epsElectronic = 7.2;
  const epsIonic = 3.8;
  const epsTotal = epsElectronic + epsIonic;

  const specY0 = 195;
  const specH = 110;
  const specLeft = 45;
  const specRight = svgW - 20;
  const specW = specRight - specLeft;

  const epsPlotPath = [];
  for (let i = 0; i <= 80; i++) {
    const frac = i / 80;
    const x = specLeft + frac * specW;
    let epsVal;
    if (frac < 0.25) {
      epsVal = epsTotal;
    } else if (frac < 0.35) {
      const t = (frac - 0.25) / 0.1;
      epsVal = epsTotal - epsIonic * t + 3 * Math.sin(t * Math.PI) * (1 - t);
    } else if (frac < 0.7) {
      epsVal = epsElectronic;
    } else if (frac < 0.8) {
      const t = (frac - 0.7) / 0.1;
      epsVal = epsElectronic - (epsElectronic - 1) * t + 2 * Math.sin(t * Math.PI) * (1 - t);
    } else {
      epsVal = 1;
    }
    const y = specY0 + specH - ((epsVal - 0) / 14) * specH;
    epsPlotPath.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }

  const pArrowLen = fieldStrength * 60;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Dielectric response is how a material 'answers the phone' when an electric field 'calls.' Apply a field, and the positive and negative charges inside shift slightly (polarize) — like people leaning when a bus brakes. The dielectric constant measures how strongly the material responds. A high dielectric constant means strong polarization (everyone leans a lot). This matters for capacitors, gate oxides in transistors, and screening of charged defects.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>

        <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
          Dielectric Response
        </text>

        <rect x={gridX0 - 5} y={gridY0 - 5} width={gridCols * cellSize + 10} height={gridRows * cellSize + 10}
          rx={4} fill={T.surface} stroke={T.border} />

        {charges.map((ch, i) => (
          <g key={i}>
            <circle cx={ch.x} cy={ch.y} r={ch.r}
              fill={ch.isPositive ? "#dbeafe" : "#fee2e2"} stroke={ch.isPositive ? T.eo_e : T.eo_hole} strokeWidth={1.5} />
            <text x={ch.x} y={ch.y + 4} textAnchor="middle" fontSize={ch.isPositive ? 14 : 12} fontWeight="bold"
              fill={ch.isPositive ? T.eo_e : T.eo_hole}>
              {ch.isPositive ? "+" : "−"}
            </text>
          </g>
        ))}

        {fieldStrength > 0.05 && (
          <g>
            <defs>
              <marker id="arrowE" viewBox="0 0 8 6" refX={7} refY={3} markerWidth={6} markerHeight={5} orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill={T.eo_gap} />
              </marker>
              <marker id="arrowP" viewBox="0 0 8 6" refX={7} refY={3} markerWidth={6} markerHeight={5} orient="auto">
                <path d="M0,0 L8,3 L0,6 Z" fill={T.eo_valence} />
              </marker>
            </defs>
            <line x1={gridX0 - 15} y1={gridY0 + gridRows * cellSize + 22} x2={gridX0 + 55} y2={gridY0 + gridRows * cellSize + 22}
              stroke={T.eo_gap} strokeWidth={2.5} markerEnd="url(#arrowE)" />
            <text x={gridX0 + 60} y={gridY0 + gridRows * cellSize + 26} fontSize={11} fontWeight="bold" fill={T.eo_gap}>E</text>

            {pArrowLen > 5 && (
              <>
                <line x1={svgW / 2 - pArrowLen / 2} y1={gridY0 + gridRows * cellSize + 38}
                  x2={svgW / 2 + pArrowLen / 2} y2={gridY0 + gridRows * cellSize + 38}
                  stroke={T.eo_valence} strokeWidth={2} markerEnd="url(#arrowP)" />
                <text x={svgW / 2 + pArrowLen / 2 + 8} y={gridY0 + gridRows * cellSize + 42} fontSize={11} fontWeight="bold" fill={T.eo_valence}>P</text>
              </>
            )}
          </g>
        )}

        <text x={specLeft - 2} y={specY0 - 5} fontSize={10} fontWeight="bold" fill={T.ink}>ε(ω)</text>
        <rect x={specLeft} y={specY0} width={specW} height={specH} fill={T.surface} stroke={T.border} />
        <path d={epsPlotPath.join(" ")} fill="none" stroke={T.eo_core} strokeWidth={2} />

        <line x1={specLeft} y1={specY0 + specH - (epsTotal / 14) * specH} x2={specLeft + specW * 0.25}
          y2={specY0 + specH - (epsTotal / 14) * specH} stroke={T.eo_e} strokeWidth={1} strokeDasharray="3,2" />
        <text x={specLeft + 2} y={specY0 + specH - (epsTotal / 14) * specH - 3} fontSize={8} fill={T.eo_e}>ε₀={epsTotal.toFixed(1)}</text>

        <line x1={specLeft + specW * 0.35} y1={specY0 + specH - (epsElectronic / 14) * specH} x2={specLeft + specW * 0.7}
          y2={specY0 + specH - (epsElectronic / 14) * specH} stroke={T.eo_cond} strokeWidth={1} strokeDasharray="3,2" />
        <text x={specLeft + specW * 0.5} y={specY0 + specH - (epsElectronic / 14) * specH - 3} fontSize={8} fill={T.eo_cond}>ε∞={epsElectronic.toFixed(1)}</text>

        <text x={specLeft + specW * 0.15} y={specY0 + specH + 10} textAnchor="middle" fontSize={8} fill={T.eo_hole}>IR (ionic)</text>
        <text x={specLeft + specW * 0.55} y={specY0 + specH + 10} textAnchor="middle" fontSize={8} fill={T.eo_cond}>UV (electronic)</text>
        <text x={specLeft + specW / 2} y={specY0 + specH + 10} textAnchor="middle" fontSize={8} fill={T.muted}>ω →</text>
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Electric Field</div>
          <button onClick={() => setFieldOn(!fieldOn)}
            style={{
              width: "100%", padding: "8px 0", borderRadius: 4,
              border: `1px solid ${fieldOn ? T.eo_gap : T.border}`,
              background: fieldOn ? T.eo_gap : T.panel, color: fieldOn ? "#fff" : T.ink,
              cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: "bold",
            }}>
            {fieldOn ? "E-Field ON" : "No Field"}
          </button>
          <div style={{ fontSize: 11, marginTop: 8, background: T.surface, padding: 8, borderRadius: 4 }}>
            ε = 1 + χ = 1 + P/(ε₀E)
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>Dielectric Constant</div>
          <div style={{ fontSize: 11, lineHeight: 1.8 }}>
            <div>ε<sub>electronic</sub> = <strong>{epsElectronic.toFixed(1)}</strong> (electron cloud response)</div>
            <div>ε<sub>ionic</sub> = <strong>{epsIonic.toFixed(1)}</strong> (ion displacement)</div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 4, marginTop: 4 }}>
              ε<sub>total</sub> = ε<sub>∞</sub> + ε<sub>ionic</sub> = <strong style={{ color: T.eo_core }}>{epsTotal.toFixed(1)}</strong>
            </div>
          </div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 8, lineHeight: 1.5 }}>
            Dielectric constant = how much a material screens electric fields. High ε → charges are screened → weaker Coulomb interactions.
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>Defect Connection</div>
          <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.6 }}>
            High ε → better screening of charged defects → shallower defect levels → better solar cell performance.
          </div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> ChalcoDB computes dielectric constants to predict defect tolerance. Materials with high ε tend to have better defect tolerance.
        </div>
      </div>
      </div>
    </div>
  );
}


// ── Section 5: RecombinationSection ─────────────────────────────────────────

function RecombinationSection() {
  const [mechanism, setMechanism] = useState("radiative");
  const [defectDensity, setDefectDensity] = useState(0.3);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 50);
    return () => clearInterval(id);
  }, []);

  const svgW = 340, svgH = 320;
  const panelH = 90;
  const panelGap = 8;
  const panelX = 15;
  const panelW = svgW - 30;

  const mechanisms = ["radiative", "srh", "auger"];
  const labels = { radiative: "Radiative", srh: "SRH (Trap)", auger: "Auger" };
  const colors = { radiative: T.eo_valence, srh: T.eo_gap, auger: T.eo_core };

  const tauRad = 1e-8;
  const tauSRH = 1e-9 / (0.1 + defectDensity * 2);
  const tauAuger = 1e-10;
  const totalRate = 1 / tauRad + 1 / tauSRH + 1 / tauAuger;
  const tauTotal = 1 / totalRate;

  const drawPanel = (mech, idx) => {
    const py = 18 + idx * (panelH + panelGap);
    const isActive = mechanism === mech;
    const cbY = py + 15;
    const vbY = py + panelH - 15;
    const midY = (cbY + vbY) / 2;
    const cx = panelX + panelW / 2;
    const t = (frame % 60) / 60;

    return (
      <g key={mech} opacity={isActive ? 1 : 0.35}>
        <rect x={panelX} y={py} width={panelW} height={panelH} rx={6}
          fill={isActive ? "#fafbff" : T.surface} stroke={isActive ? colors[mech] : T.border} strokeWidth={isActive ? 2 : 1} />

        <rect x={panelX + 10} y={cbY} width={panelW - 80} height={8} rx={2} fill="#dbeafe" stroke={T.eo_cond} strokeWidth={0.8} />
        <text x={panelX + panelW - 65} y={cbY + 7} fontSize={8} fill={T.eo_cond}>CB</text>

        <rect x={panelX + 10} y={vbY - 4} width={panelW - 80} height={8} rx={2} fill="#dcfce7" stroke={T.eo_valence} strokeWidth={0.8} />
        <text x={panelX + panelW - 65} y={vbY + 3} fontSize={8} fill={T.eo_valence}>VB</text>

        <text x={panelX + panelW - 60} y={midY + 4} fontSize={9} fontWeight="bold" fill={colors[mech]}>
          {labels[mech]}
        </text>

        {mech === "radiative" && (
          <g>
            {(() => {
              const elY = lerp(cbY + 4, vbY - 4, t);
              return (
                <>
                  <circle cx={cx} cy={elY} r={4} fill={T.eo_e} />
                  {t > 0.6 && (
                    <g opacity={(t - 0.6) / 0.4}>
                      <path d={`M${cx + 8},${midY} Q${cx + 18},${midY - 8} ${cx + 28},${midY} Q${cx + 38},${midY + 8} ${cx + 48},${midY}`}
                        fill="none" stroke={T.eo_photon} strokeWidth={2} />
                      <polygon points={`${cx + 52},${midY} ${cx + 47},${midY - 3} ${cx + 47},${midY + 3}`} fill={T.eo_photon} />
                      <text x={cx + 30} y={midY - 10} fontSize={7} fill={T.eo_photon}>hν</text>
                    </g>
                  )}
                </>
              );
            })()}
          </g>
        )}

        {mech === "srh" && (
          <g>
            <rect x={cx - 20} y={midY - 2} width={40} height={4} rx={1} fill={T.eo_gap} opacity={0.5} />
            <text x={cx + 25} y={midY + 3} fontSize={7} fill={T.eo_gap}>trap</text>
            {(() => {
              const phase1 = Math.min(1, t * 2);
              const phase2 = Math.max(0, t * 2 - 1);
              const elY = t < 0.5 ? lerp(cbY + 4, midY, phase1) : lerp(midY, vbY - 4, phase2);
              return <circle cx={cx - 5} cy={elY} r={4} fill={T.eo_e} />;
            })()}
          </g>
        )}

        {mech === "auger" && (
          <g>
            {(() => {
              const el1Y = lerp(cbY + 4, vbY - 4, t);
              const el2Y = t > 0.4 ? lerp(cbY + 4, cbY - 15 * Math.min(1, (t - 0.4) / 0.3), 1) : cbY + 4;
              const el2FallY = t > 0.7 ? lerp(cbY - 15, cbY + 4, (t - 0.7) / 0.3) : el2Y;
              return (
                <>
                  <circle cx={cx - 10} cy={el1Y} r={4} fill={T.eo_e} />
                  <circle cx={cx + 15} cy={t > 0.7 ? el2FallY : el2Y} r={4} fill={T.eo_core} />
                  {t > 0.35 && t < 0.7 && (
                    <line x1={cx - 5} y1={midY} x2={cx + 12} y2={el2Y + 4}
                      stroke={T.eo_core} strokeWidth={1.5} strokeDasharray="2,2" opacity={0.6} />
                  )}
                  <text x={cx + 25} y={el2Y - 5} fontSize={7} fill={T.eo_core}>
                    {t > 0.4 && t < 0.8 ? "↑ KE" : ""}
                  </text>
                </>
              );
            })()}
          </g>
        )}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Recombination is like an excited kid who jumped onto a table (conduction band) falling back to the floor (valence band). The energy released can come out as light (radiative recombination — that's how LEDs work) or as heat (non-radiative — through defects acting like hidden slides). Shockley-Read-Hall recombination happens when a defect creates a 'stepping stone' in the band gap — the electron steps down in two hops instead of one big jump. This limits solar cell efficiency.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>
        <text x={svgW / 2} y={14} textAnchor="middle" fontSize={11} fontWeight="bold" fill={T.ink}>
          Recombination Mechanisms
        </text>
        {mechanisms.map((m, i) => drawPanel(m, i))}
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 8 }}>Mechanism</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {mechanisms.map(m => (
              <button key={m} onClick={() => setMechanism(m)}
                style={{
                  padding: "6px 10px", borderRadius: 4, textAlign: "left",
                  border: `1px solid ${mechanism === m ? colors[m] : T.border}`,
                  background: mechanism === m ? colors[m] : T.panel,
                  color: mechanism === m ? "#fff" : T.ink,
                  cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: "bold",
                }}>
                {labels[m]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>Lifetimes</div>
          <div style={{ fontSize: 10, lineHeight: 1.8 }}>
            <div style={{ color: T.eo_valence }}>τ<sub>rad</sub> ~ {tauRad.toExponential(0)} s (photon emission)</div>
            <div style={{ color: T.eo_gap }}>τ<sub>SRH</sub> ~ {tauSRH.toExponential(1)} s (defect-mediated)</div>
            <div style={{ color: T.eo_core }}>τ<sub>Auger</sub> ~ {tauAuger.toExponential(0)} s (carrier-carrier)</div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 4, marginTop: 4 }}>
              1/τ = 1/τ<sub>rad</sub> + 1/τ<sub>SRH</sub> + 1/τ<sub>Auger</sub>
            </div>
            <div style={{ fontWeight: "bold" }}>
              τ<sub>total</sub> = {tauTotal.toExponential(1)} s
            </div>
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 6 }}>Defect Density</div>
          <input type="range" min={0.05} max={1} step={0.05} value={defectDensity}
            onChange={e => setDefectDensity(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>
            More defects → shorter τ<sub>SRH</sub> → faster non-radiative recombination → lower efficiency
          </div>
          <div style={{ fontSize: 10, color: T.eo_gap, marginTop: 4 }}>
            SRH is the defect-mediated killer. Deep mid-gap levels are the most effective traps.
          </div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> This is why defect tolerance matters! Materials where defects create only shallow levels avoid SRH recombination.
        </div>
      </div>
      </div>
    </div>
  );
}


// ── Section 6: AtomToDeviceSection ──────────────────────────────────────────

function AtomToDeviceSection() {
  const [frame, setFrame] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame(f => {
        const next = f + 1;
        setActiveStage(Math.floor((next % 360) / 60));
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, []);

  const svgW = 500, svgH = 320;
  const stages = [
    { label: "Atom", x: 45, color: T.eo_core },
    { label: "Bond", x: 125, color: T.eo_e },
    { label: "Crystal", x: 205, color: T.eo_valence },
    { label: "Bands", x: 285, color: T.eo_cond },
    { label: "Defects", x: 365, color: T.eo_gap },
    { label: "Solar Cell", x: 450, color: T.eo_photon },
  ];

  const signalProgress = (frame % 360) / 360;
  const signalX = 45 + signalProgress * (450 - 45);

  const stageDescriptions = [
    "Atomic properties: electron configuration, electronegativity, ionization energy determine bonding behavior.",
    "Chemical bonds: covalent, ionic, or metallic bonding determines how atoms share or transfer electrons.",
    "Crystal structure: atoms arrange into periodic lattices. Symmetry determines allowed electronic states.",
    "Band structure: periodic potential creates allowed energy bands separated by forbidden gaps.",
    "Defects: vacancies, antisites, and interstitials create states in the band gap that trap carriers.",
    "Solar cell: p-n junction separates photogenerated carriers. Defects limit open-circuit voltage and efficiency.",
  ];

  const drawAtom = (cx, cy, active) => (
    <g opacity={active ? 1 : 0.4}>
      <circle cx={cx} cy={cy} r={18} fill="none" stroke={T.eo_core} strokeWidth={1} strokeDasharray="3,2" />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={T.eo_core} strokeWidth={1} strokeDasharray="2,2" />
      <circle cx={cx} cy={cy} r={4} fill={T.eo_core} />
      <circle cx={cx + 10 * Math.cos(frame * 0.05)} cy={cy + 10 * Math.sin(frame * 0.05)} r={2.5} fill={T.eo_e} />
      <circle cx={cx + 18 * Math.cos(frame * 0.03 + 2)} cy={cy + 18 * Math.sin(frame * 0.03 + 2)} r={2.5} fill={T.eo_e} />
    </g>
  );

  const drawBond = (cx, cy, active) => (
    <g opacity={active ? 1 : 0.4}>
      <circle cx={cx - 12} cy={cy} r={8} fill={T.eo_core} opacity={0.7} />
      <circle cx={cx + 12} cy={cy} r={8} fill={T.eo_valence} opacity={0.7} />
      <ellipse cx={cx} cy={cy} rx={8} ry={5} fill={T.eo_e} opacity={0.3 + 0.2 * Math.sin(frame * 0.08)} />
      <circle cx={cx + 4 * Math.sin(frame * 0.06)} cy={cy} r={2} fill={T.eo_e} />
      <circle cx={cx - 4 * Math.sin(frame * 0.06)} cy={cy} r={2} fill={T.eo_e} />
    </g>
  );

  const drawCrystal = (cx, cy, active) => {
    const s = 8;
    const dots = [];
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        dots.push(
          <circle key={`${r}${c}`} cx={cx + c * s * 2} cy={cy + r * s * 2} r={3}
            fill={(r + c) % 2 === 0 ? T.eo_core : T.eo_valence} />
        );
      }
    }
    return <g opacity={active ? 1 : 0.4}>{dots}</g>;
  };

  const drawBands = (cx, cy, active) => (
    <g opacity={active ? 1 : 0.4}>
      <rect x={cx - 18} y={cy + 5} width={36} height={10} rx={2} fill="#dcfce7" stroke={T.eo_valence} strokeWidth={1} />
      <rect x={cx - 18} y={cy - 18} width={36} height={10} rx={2} fill="#dbeafe" stroke={T.eo_cond} strokeWidth={1} />
      <text x={cx} y={cy + 2} textAnchor="middle" fontSize={7} fill={T.eo_gap}>gap</text>
    </g>
  );

  const drawDefect = (cx, cy, active) => {
    const s = 7;
    const dots = [];
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) {
          dots.push(
            <circle key="vac" cx={cx} cy={cy} r={4} fill="none" stroke={T.eo_gap} strokeWidth={1.5} strokeDasharray="2,2" />
          );
        } else {
          dots.push(
            <circle key={`${r}${c}`} cx={cx + c * s * 2} cy={cy + r * s * 2} r={3} fill={T.eo_core} />
          );
        }
      }
    }
    return <g opacity={active ? 1 : 0.4}>{dots}</g>;
  };

  const drawSolarCell = (cx, cy, active) => (
    <g opacity={active ? 1 : 0.4}>
      <rect x={cx - 18} y={cy - 16} width={18} height={32} rx={2} fill="#dbeafe" stroke={T.eo_cond} strokeWidth={1} />
      <rect x={cx} y={cy - 16} width={18} height={32} rx={2} fill="#fee2e2" stroke={T.eo_hole} strokeWidth={1} />
      <text x={cx - 9} y={cy + 3} textAnchor="middle" fontSize={8} fontWeight="bold" fill={T.eo_cond}>n</text>
      <text x={cx + 9} y={cy + 3} textAnchor="middle" fontSize={8} fontWeight="bold" fill={T.eo_hole}>p</text>
      <path d={`M${cx - 28},${cy - 8} Q${cx - 24},${cy - 14} ${cx - 20},${cy - 8}`} fill="none" stroke={T.eo_photon} strokeWidth={1.5} />
      <polygon points={`${cx - 18},${cy - 8} ${cx - 22},${cy - 11} ${cx - 22},${cy - 5}`} fill={T.eo_photon} />
    </g>
  );

  const drawFns = [drawAtom, drawBond, drawCrystal, drawBands, drawDefect, drawSolarCell];
  const iconY = 140;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
      <AnalogyBox>
          Building a device from atoms is like constructing a skyscraper from individual bricks. First you understand the brick (atom: quantum mechanics). Then how bricks bond (chemical bonding). Then how stacked bricks form patterns (crystal structure). Then how electron highways emerge in the pattern (band structure). Then how imperfections change the highways (defects). Finally, you engineer all of this into a working device — a solar cell, transistor, or LED. Every chapter in this module is one floor of that skyscraper.
        </AnalogyBox>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>

        <text x={svgW / 2} y={20} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.ink}>
          From Atoms to Devices
        </text>

        {stages.map((s, i) => {
          if (i < stages.length - 1) {
            const next = stages[i + 1];
            return (
              <line key={`line${i}`} x1={s.x + 22} y1={iconY} x2={next.x - 22} y2={iconY}
                stroke={T.dim} strokeWidth={2} />
            );
          }
          return null;
        })}

        {stages.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={iconY} r={26} fill={i <= activeStage ? "#f0f4ff" : T.surface}
              stroke={i <= activeStage ? s.color : T.border} strokeWidth={i === activeStage ? 2.5 : 1} />
            {drawFns[i](s.x, iconY, i <= activeStage)}
            <text x={s.x} y={iconY + 38} textAnchor="middle" fontSize={9}
              fontWeight={i === activeStage ? "bold" : "normal"}
              fill={i === activeStage ? s.color : T.muted}>
              {s.label}
            </text>
          </g>
        ))}

        <circle cx={signalX} cy={iconY} r={4} fill={T.eo_photon} opacity={0.7 + 0.3 * Math.sin(frame * 0.15)}>
        </circle>
        <circle cx={signalX} cy={iconY} r={8} fill="none" stroke={T.eo_photon} strokeWidth={1}
          opacity={0.3 + 0.2 * Math.sin(frame * 0.15)} />

        <rect x={20} y={210} width={svgW - 40} height={100} rx={8} fill={T.surface} stroke={T.border} />
        <text x={svgW / 2} y={230} textAnchor="middle" fontSize={11} fontWeight="bold"
          fill={stages[activeStage].color}>
          Stage {activeStage + 1}: {stages[activeStage].label}
        </text>

        {(() => {
          const desc = stageDescriptions[activeStage];
          const words = desc.split(" ");
          const lines = [];
          let current = "";
          words.forEach(w => {
            if ((current + " " + w).length > 55) {
              lines.push(current);
              current = w;
            } else {
              current = current ? current + " " + w : w;
            }
          });
          if (current) lines.push(current);
          return lines.map((line, i) => (
            <text key={i} x={svgW / 2} y={248 + i * 14} textAnchor="middle" fontSize={10} fill={T.muted}>
              {line}
            </text>
          ));
        })()}
      </svg>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 8, color: stages[activeStage].color }}>
            {stages[activeStage].label}
          </div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
            {stageDescriptions[activeStage]}
          </div>
        </div>

        <div style={{ background: T.panel, padding: 14, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>Everything Connects</div>
          <div style={{ fontSize: 10, lineHeight: 1.7, color: T.muted }}>
            <div>Atomic properties</div>
            <div style={{ color: T.dim }}>{'  └→'} bond type</div>
            <div style={{ color: T.dim }}>{'     └→'} crystal structure</div>
            <div style={{ color: T.dim }}>{'        └→'} electronic bands</div>
            <div style={{ color: T.dim }}>{'           └→'} defect behavior</div>
            <div style={{ color: T.dim }}>{'              └→'} device performance</div>
          </div>
        </div>

        <div style={{ background: "#fffbe6", padding: 10, borderRadius: 6, border: "1px solid #f0d060", fontSize: 11, lineHeight: 1.5 }}>
          <strong>Key insight:</strong> Understanding this full chain is what enables rational materials design for solar energy.
        </div>

        <div style={{
          background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
          borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Full Circle {"→"}</div>
          <div style={{ color: T.ink }}>
            We started with a single atom and its quantum states. Through bonding, crystal structure, band theory, and thermodynamics, we've built a complete picture — from electron orbitals to working devices. Every property of a semiconductor traces back to the quantum mechanics of its atoms.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// SECTIONS REGISTRY — 22 sections organized as a story in 5 acts
// ═══════════════════════════════════════════════════════════════════════════

const BLOCKS = [
  { id: "atom",       label: "What is an Atom?",            color: T.eo_core },
  { id: "bonds",      label: "How Atoms Bond",              color: T.eo_valence },
  { id: "crystals",   label: "From Molecules to Crystals",  color: T.eo_cond },
  { id: "properties", label: "Properties of the Crystal",   color: T.eo_photon },
  { id: "design",     label: "Can We Make It?",             color: T.eo_e },
];

const ELECTRON_SECTIONS = [
  // ── Act 1: What is an Atom? ──
  { id: "atomicModels",    block: "atom", label: "Atomic Models",          icon: "⚛️", color: T.eo_core,    Component: AtomicModelsSection },
  { id: "waveDuality",     block: "atom", label: "Wave-Particle Duality",  icon: "\u{1F30A}", color: T.eo_core,    Component: WaveDualitySection },
  { id: "schrodinger",     block: "atom", label: "Schrödinger Equation", icon: "\u{1D6F9}",  color: T.eo_core,    Component: SchrodingerSection },
  { id: "quantumNums",     block: "atom", label: "Quantum Numbers",        icon: "\u{1F52E}", color: T.eo_core,    Component: QuantumNumbersSection },
  { id: "aufbau",          block: "atom", label: "Aufbau & Pauli",         icon: "\u{1F4DD}", color: T.eo_core,    Component: AufbauPrincipleSection },
  { id: "periodic",        block: "atom", label: "Periodic Trends",        icon: "\u{1F4CA}", color: T.eo_core,    Component: PeriodicTrendsSection },

  // ── Act 2: How Atoms Bond ──
  { id: "chemBonding",     block: "bonds", label: "Chemical Bonding",       icon: "\u{1F517}", color: T.eo_valence, Component: ChemicalBondingSection },
  { id: "hybridization",   block: "bonds", label: "Hybridization",          icon: "\u{1F504}", color: T.eo_valence, Component: HybridizationSection },
  { id: "electronOrigins", block: "bonds", label: "How Atoms Bond", icon: "\u{1F50D}", color: T.eo_valence, Component: ElectronOriginsZnTeSection },

  // ── Act 3: From Molecules to Crystals ──
  { id: "molecularOrb",    block: "crystals", label: "Molecular Orbitals",     icon: "\u{1F300}", color: T.eo_cond, Component: MolecularOrbitalSection },
  { id: "symmetry",        block: "crystals", label: "Crystal Symmetry",       icon: "\u{1F48E}", color: T.eo_cond, Component: CrystalSymmetrySection },
  { id: "reciprocal",      block: "crystals", label: "Reciprocal Space",       icon: "\u{1F310}", color: T.eo_cond, Component: ReciprocalSpaceSection },

  // ── Act 4: Properties of the Crystal ──
  { id: "bands",           block: "properties", label: "Energy Bands",           icon: "\u{1F4CA}", color: T.eo_photon, Component: BandSection },
  { id: "dos",             block: "properties", label: "Density of States",      icon: "\u{1F4C8}", color: T.eo_photon, Component: DensityOfStatesSection },
  { id: "materialClasses", block: "properties", label: "Material Classes",        icon: "\u{1F9F1}", color: T.eo_photon, Component: MaterialClassesSection },

  // ── Act 5: Can We Make It? ──
  { id: "thermoBasics",    block: "design", label: "Thermodynamics",         icon: "\u{1F525}", color: T.eo_e, Component: ThermodynamicsSection },
  { id: "phase",           block: "design", label: "Phase Diagrams",         icon: "\u{1F5FA}️", color: T.eo_e, Component: PhaseDiagramSection },
  { id: "chemPot",         block: "design", label: "Chemical Potential",     icon: "\u{2697}️",  color: T.eo_e, Component: ChemicalPotentialSection },
  { id: "atomToDevice",    block: "design", label: "From Atom to Device",    icon: "\u{1F680}", color: T.eo_e, Component: AtomToDeviceSection },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MODULE
// ═══════════════════════════════════════════════════════════════════════════

export default function ElectronOriginsModule() {
  const [active, setActive] = useState("atomicModels");
  const [activeBlock, setActiveBlock] = useState("atom");
  const sec = ELECTRON_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const blockSections = ELECTRON_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{
        display: "flex",
        padding: "8px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
      }}>
        {BLOCKS.map(b => (
          <button key={b.id} onClick={() => {
            setActiveBlock(b.id);
            const first = ELECTRON_SECTIONS.find(s => s.block === b.id);
            if (first) setActive(first.id);
          }} style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg,
            color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "inherit",
            fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Section tabs within active block */}
      <div style={{
        display: "flex",
        padding: "6px 24px",
        gap: 6,
        borderBottom: `1px solid ${T.border}`,
        background: T.panel,
        overflowX: "auto",
        flexWrap: "wrap",
      }}>
        {blockSections.map((s, i) => {
          const globalIdx = ELECTRON_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${active === s.id ? s.color : T.border}`,
              background: active === s.id ? s.color + "22" : T.bg,
              color: active === s.id ? s.color : T.muted,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "inherit",
              fontWeight: active === s.id ? 700 : 400,
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{globalIdx + 1}.</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <SectionTitle color={sec.color} icon={sec.icon}>{sec.label}</SectionTitle>
        <Component />
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: "10px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: T.panel,
      }}>
        <button onClick={() => {
          const i = ELECTRON_SECTIONS.findIndex(s => s.id === active);
          if (i > 0) {
            const prev = ELECTRON_SECTIONS[i - 1];
            setActive(prev.id);
            setActiveBlock(prev.block);
          }
        }} disabled={active === ELECTRON_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === ELECTRON_SECTIONS[0].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === ELECTRON_SECTIONS[0].id ? T.border : sec.color}`,
          color: active === ELECTRON_SECTIONS[0].id ? T.muted : sec.color,
          cursor: active === ELECTRON_SECTIONS[0].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>{"←"} Previous</button>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {ELECTRON_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: 7, height: 7, borderRadius: 4,
              background: active === s.id ? s.color : s.block === activeBlock ? s.color + "44" : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>

        <button onClick={() => {
          const i = ELECTRON_SECTIONS.findIndex(s => s.id === active);
          if (i < ELECTRON_SECTIONS.length - 1) {
            const next = ELECTRON_SECTIONS[i + 1];
            setActive(next.id);
            setActiveBlock(next.block);
          }
        }} disabled={active === ELECTRON_SECTIONS[ELECTRON_SECTIONS.length - 1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === ELECTRON_SECTIONS[ELECTRON_SECTIONS.length - 1].id ? T.surface : sec.color + "22",
          border: `1px solid ${active === ELECTRON_SECTIONS[ELECTRON_SECTIONS.length - 1].id ? T.border : sec.color}`,
          color: active === ELECTRON_SECTIONS[ELECTRON_SECTIONS.length - 1].id ? T.muted : sec.color,
          cursor: active === ELECTRON_SECTIONS[ELECTRON_SECTIONS.length - 1].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>Next {"→"}</button>
      </div>
    </div>
  );
}
