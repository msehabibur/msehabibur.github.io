import { useState, useEffect, useMemo, useRef } from "react";
import { T, FONT, LAYOUT, ANALOGY, BUTTON, PANEL, SVG } from "./sectionStyles.js";

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
 <div style={ANALOGY.box}>
 <div style={ANALOGY.title}>Simple Analogy</div>
 <div style={ANALOGY.body}>{children}</div>
 </div>
 );
}

/* ─── Numerical-Example Helpers (matching characterization.jsx pattern) ─── */
function NCard({ title, color, formula, children }) {
 return (
 <div style={{ background: T.panel, border: `1.5px solid ${(color || T.eo_e)}44`, borderLeft: `4px solid ${color || T.eo_e}`, borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
 {(title || formula) && (
 <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
 {title && <div style={{ fontSize: 12, letterSpacing: 2, color: color || T.eo_e, fontWeight: 700 }}>{title}</div>}
 {formula && <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: T.ink, background: (color || T.eo_e) + "11", padding: "2px 10px", borderRadius: 4, border: `1px solid ${(color || T.eo_e)}33` }}>{formula}</div>}
 </div>
 )}
 {children}
 </div>
 );
}

function InfoRow({ label, value }) {
 return (
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0", borderBottom: `1px solid ${T.border}44` }}>
 <span style={{ color: T.muted }}>{label}</span>
 <span style={{ color: T.ink, fontWeight: 600 }}>{value}</span>
 </div>
 );
}

function CalcRow({ eq, result, color }) {
 return (
 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
 <span style={{ color: T.ink, fontFamily: "monospace" }}>{eq}</span>
 <span style={{ color: color || T.eo_e, fontWeight: 700, fontFamily: "monospace" }}>{result}</span>
 </div>
 );
}

function ResultBox({ label, value, color, sub }) {
 return (
 <div style={{ background: (color || T.eo_e) + "0a", border: `1px solid ${(color || T.eo_e)}22`, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
 <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
 <div style={{ fontSize: 16, fontWeight: 800, color: color || T.eo_e, fontFamily: "monospace" }}>{value}</div>
 {sub && <div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>{sub}</div>}
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

 const balmerColors = { 3: "#7c3aed", 4: "#7c3aed", 5: "#7c3aed", 6: "#7c3aed" };

 const renderSVG = () => {
 switch (model) {
 case 0: {
 const pulse = 1 + 0.06 * Math.sin(t * 2);
 return (
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <circle cx={cx} cy={cy} r={60 * pulse} fill={T.eo_core} opacity={0.7} />
 <circle cx={cx} cy={cy} r={60 * pulse} fill="none" stroke={T.ink} strokeWidth={2} />
 <text x={cx} y={cy - 5} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace" fontWeight="bold">Indivisible</text>
 <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace" fontWeight="bold">Atom</text>
 <text x={cx} y={cy + 80} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">Dalton 1803</text>
 <text x={cx} y={cy + 95} textAnchor="middle" fill={T.muted} fontSize={13} fontFamily="monospace">"Atoms are solid, indivisible spheres"</text>
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
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <circle cx={cx} cy={cy} r={70} fill={T.eo_e} opacity={0.15} />
 <circle cx={cx} cy={cy} r={70} fill="none" stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="4,3" />
 {[...Array(12)].map((_, i) => {
 const a2 = (Math.PI * 2 * i) / 12;
 const pr = 20 + 30 * ((i * 7 + 3) % 5) / 5;
 return <text key={i} x={cx + Math.cos(a2) * pr} y={cy + Math.sin(a2) * pr + 4} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace" opacity={0.4}>+</text>;
 })}
 {electrons.map((e, i) => (
 <g key={i}>
 <circle cx={e.x} cy={e.y} r={6} fill={T.eo_hole} />
 <text x={e.x} y={e.y + 3.5} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace" fontWeight="bold">−</text>
 </g>
 ))}
 <text x={cx} y={cy + 90} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">"Plum Pudding" — Thomson 1897</text>
 <text x={cx} y={cy + 105} textAnchor="middle" fill={T.eo_e} fontSize={13} fontFamily="monospace">+ positive dough, − electron plums</text>
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
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <circle cx={cx} cy={cy} r={100} fill="none" stroke={T.dim} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
 <text x={cx + 75} y={cy - 75} textAnchor="middle" fill={T.dim} fontSize={13} fontFamily="monospace">mostly empty</text>
 <circle cx={cx} cy={cy} r={8} fill={T.eo_gap} />
 <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={12} fontFamily="monospace" fontWeight="bold">+</text>
 <text x={cx} y={cy + 22} textAnchor="middle" fill={T.eo_gap} fontSize={13} fontFamily="monospace">nucleus</text>
 {[...Array(5)].map((_, i) => {
 const ea = t * 0.4 + i * 1.26;
 const er = 40 + i * 18;
 return <circle key={i} cx={cx + Math.cos(ea) * er} cy={cy + Math.sin(ea) * er} r={3} fill={T.eo_e} opacity={0.6} />;
 })}
 {alphas.map((a, i) => a.vis && (
 <g key={i}>
 <circle cx={a.x} cy={a.y} r={4} fill={T.eo_photon} />
 <text x={a.x} y={a.y + 3} textAnchor="middle" fill="#fff" fontSize={12} fontFamily="monospace">α</text>
 </g>
 ))}
 <text x={20} y={cy - 50} textAnchor="start" fill={T.eo_photon} fontSize={13} fontFamily="monospace">α beam →</text>
 {alphas[2] && alphas[2].deflected && (
 <text x={cx - 80} y={cy - 80} textAnchor="middle" fill={T.eo_gap} fontSize={13} fontFamily="monospace" fontWeight="bold">← bounced back!</text>
 )}
 <rect x={cx - 5} y={30} width={10} height={280} fill={T.eo_photon} opacity={0.07} />
 <text x={cx} y={25} textAnchor="middle" fill={T.eo_photon} fontSize={13} fontFamily="monospace">gold foil</text>
 <text x={cx} y={cy + 130} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">Rutherford 1911 — Gold Foil Experiment</text>
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
 const transColor = bohrTransition && bohrTransition.to === 2 ? (balmerColors[bohrTransition.from] || "#7c3aed") : "#7c3aed";

 return (
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 {orbitRadii.map((r, i) => (
 <g key={i}>
 <circle cx={cx} cy={cy} r={r} fill="none" stroke={i + 1 === bohrLevel ? T.eo_e : T.dim} strokeWidth={i + 1 === bohrLevel ? 2 : 1} strokeDasharray={i + 1 === bohrLevel ? "none" : "4,3"} opacity={i + 1 === bohrLevel ? 1 : 0.5} />
 <text x={cx} y={cy - r - 4} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="monospace">n={i + 1}</text>
 <circle cx={cx + r} cy={cy - 16} r={8} fill="transparent" stroke="none" style={{ cursor: "pointer" }} onClick={() => {
 if (i + 1 !== bohrLevel && !bohrTransition) {
 setBohrTransition({ from: bohrLevel, to: i + 1 });
 }
 }} />
 </g>
 ))}
 <circle cx={cx} cy={cy} r={10} fill={T.eo_gap} />
 <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace" fontWeight="bold">+</text>
 <circle cx={eX} cy={eY} r={6} fill={T.eo_e} />
 <text x={eX} y={eY + 3} textAnchor="middle" fill="#fff" fontSize={12} fontFamily="monospace">e⁻</text>
 {photonVis && (
 <g>
 {[...Array(5)].map((_, wi) => {
 const wx = photonX - wi * 6;
 const wy = photonY + Math.sin((transitionAnim * 10) + wi) * 4;
 return <circle key={wi} cx={wx} cy={wy} r={2} fill={transColor} opacity={0.7 - wi * 0.1} />;
 })}
 <text x={photonX + 10} y={photonY - 5} fill={transColor} fontSize={12} fontFamily="monospace">γ</text>
 </g>
 )}
 {orbitRadii.map((_, i) => {
 const lvlX = 50, lvlY = 80 + i * 30;
 const isCurrent = (i + 1) === bohrLevel;
 return (
 <g key={`e${i}`} onClick={() => {
 if (i + 1 !== bohrLevel && !bohrTransition) setBohrTransition({ from: bohrLevel, to: i + 1 });
 }} style={{ cursor: "pointer" }}>
 <line x1={lvlX - 20} y1={lvlY} x2={lvlX + 20} y2={lvlY} stroke={isCurrent ? T.eo_e : T.dim} strokeWidth={isCurrent ? 2.5 : 1.5} />
 <text x={lvlX - 24} y={lvlY + 4} textAnchor="end" fill={isCurrent ? T.eo_e : T.muted} fontSize={10} fontFamily="monospace">{energies[i]}</text>
 {isCurrent && <circle cx={lvlX} cy={lvlY - 5} r={3} fill={T.eo_e} />}
 </g>
 );
 })}
 <text x={50} y={68} textAnchor="middle" fill={T.ink} fontSize={11} fontFamily="monospace" fontWeight="bold">E (eV)</text>
 {bohrTransition && bohrTransition.to === 2 && transitionAnim > 0.1 && (
 <text x={cx} y={cy + 148} textAnchor="middle" fill={transColor} fontSize={13} fontFamily="monospace" fontWeight="bold">
 Balmer: n={bohrTransition.from}→2
 </text>
 )}
 <text x={cx} y={cy + 155} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">
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
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
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
 <text x={cx + el.a + 8} y={cy - el.b + 8} fill={hue} fontSize={12} fontFamily="monospace" transform={`rotate(${el.rot},${cx},${cy})`} opacity={0.7}>
 n={el.n},l={el.l}
 </text>
 </g>
 );
 })}
 <text x={cx} y={20} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">Sommerfeld Elliptical Orbits</text>
 <text x={cx} y={315} textAnchor="middle" fill={T.muted} fontSize={13} fontFamily="monospace">l=0: very elliptical | l=n-1: circular</text>
 <text x={cx} y={330} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">Faster at perihelion, slower at aphelion (Kepler)</text>
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
 <svg viewBox="0 0 340 340" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 {dots.map((d, i) => (
 <circle key={i} cx={d.x} cy={d.y} r={2} fill={d.c} opacity={d.o} />
 ))}
 <circle cx={cx} cy={cy} r={3} fill={T.eo_gap} opacity={0.5} />
 <text x={cx} y={20} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">Quantum Mechanical — |{"ψ"}|{"²"} Probability</text>
 <text x={cx} y={cy + 140} textAnchor="middle" fill={T.muted} fontSize={13} fontFamily="monospace">Orbital: {qmOrbital}</text>
 <g>
 {["1s", "2s", "2p", "3d", "all"].map((orb, i) => (
 <g key={orb} onClick={() => setQmOrbital(orb)} style={{ cursor: "pointer" }}>
 <rect x={28 + i * 58} y={300} width={52} height={22} rx={4} fill={qmOrbital === orb ? T.eo_e : T.surface} stroke={qmOrbital === orb ? T.eo_e : T.border} strokeWidth={1} />
 <text x={54 + i * 58} y={314} textAnchor="middle" fill={qmOrbital === orb ? "#fff" : T.ink} fontSize={13} fontFamily="monospace">{orb === "all" ? "All" : orb}</text>
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
 <svg viewBox="0 0 340 350" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 {allDots.map((d, i) => (
 <circle key={i} cx={d.x} cy={d.y} r={1.8} fill={d.c} opacity={d.o * 0.8} />
 ))}
 <circle cx={cx} cy={cy} r={4} fill={T.ink} />
 <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={5} fontWeight="bold">Z</text>
 <text x={cx} y={18} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">All Orbitals — Probability Clouds</text>
 {/* Color legend */}
 {[
 { c: T.eo_e, l: "1s" }, { c: T.eo_cond, l: "2s" }, { c: T.eo_valence, l: "2p" },
 { c: T.eo_core, l: "3s" }, { c: T.eo_photon, l: "3p" }, { c: T.eo_gap, l: "3d" },
 ].map((item, i) => (
 <g key={i}>
 <circle cx={25 + i * 52} cy={275} r={4} fill={item.c} opacity={0.8} />
 <text x={33 + i * 52} y={278} fontSize={13} fill={T.muted} fontFamily="monospace">{item.l}</text>
 </g>
 ))}
 <text x={cx} y={295} textAnchor="middle" fill={T.muted} fontSize={13} fontFamily="monospace">
 Each color = different orbital shape and energy
 </text>
 <g>
 {["1s", "2s", "2p", "3d", "all"].map((orb, i) => (
 <g key={orb} onClick={() => setQmOrbital(orb)} style={{ cursor: "pointer" }}>
 <rect x={28 + i * 58} y={305} width={52} height={22} rx={4} fill={qmOrbital === orb ? T.eo_e : T.surface} stroke={qmOrbital === orb ? T.eo_e : T.border} strokeWidth={1} />
 <text x={54 + i * 58} y={319} textAnchor="middle" fill={qmOrbital === orb ? "#fff" : T.ink} fontSize={13} fontFamily="monospace">{orb === "all" ? "All" : orb}</text>
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
 Think of looking at a ball with better and better glasses. First it looks solid (<strong>Dalton</strong>). Then you see small dots inside (<strong>Thomson</strong>). Then you find it is mostly empty with a tiny center (<strong>Rutherford</strong>). Then you see layers like an onion (<strong>Bohr</strong>). Finally, <strong>quantum mechanics</strong> showed it is all fuzzy clouds, not solid at all. Each new idea made the picture clearer.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 {renderSVG()}
 </div>
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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
 <div style={{ fontSize: 10, marginBottom: 6 }}>4. Stationary states: E<sub>n</sub> = −13.6/n² eV, r<sub>n</sub> = n²×0.529 Å</div>
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


 <NCard title="Numerical Example: Bohr Model — Hydrogen Emission Spectrum" color={T.eo_core} formula="Eₙ = −13.6 / n² eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> When hydrogen gas is excited in a discharge tube, it emits visible light at only a few specific wavelengths — the Balmer series. Bohr's model predicts these exactly. Let's calculate the wavelength of the red Balmer-alpha line (n = 3 → n = 2).
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine an elevator that can only stop at certain floors. When it drops from floor 3 to floor 2, it releases a fixed amount of energy — that energy becomes a photon of a very specific color. No intermediate colors are possible, just as no intermediate floors exist.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Energy levels:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="E₃ = −13.6 / 3²" value="−1.511 eV" />
 <InfoRow label="E₂ = −13.6 / 2²" value="−3.400 eV" />
 <InfoRow label="ΔE = E₃ − E₂" value="1.889 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Convert to wavelength (λ = hc / ΔE):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="hc = 1240 eV·nm" result="" color={T.eo_core} />
 <CalcRow eq="λ = 1240 / 1.889" result="656.4 nm" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The predicted 656.4 nm matches the experimentally observed red Balmer-alpha line at 656.3 nm almost perfectly. This was the first time a simple formula explained atomic spectra — the triumph that launched quantum physics. The Balmer series also includes n=4→2 (486.1 nm, blue-green) and n=5→2 (434.0 nm, violet).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Bohr Radius and Orbital Speed" color={T.eo_core} formula="rₙ = 0.529 × n² Å, vₙ = 2.19×10⁶ / n m/s">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Bohr's model also predicts orbital radii and speeds. As n increases, orbits get much larger but electrons slow down. For heavy atoms, inner electrons move so fast that relativistic effects become significant — this is exactly why Sommerfeld's correction was needed.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Think of a ball on a string swinging in circles. A longer string (higher n) means a bigger orbit and a slower speed. But in atoms with many protons, the "pull" is much stronger, so the inner electrons whip around at incredible speeds — sometimes a significant fraction of the speed of light.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Calculate for hydrogen (Z = 1):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="n = 1: r₁ = 0.529 × 1² Å" value="0.529 Å" />
 <InfoRow label="n = 1: v₁ = 2.19 × 10⁶ m/s" value="0.73% of c" />
 <InfoRow label="n = 2: r₂ = 0.529 × 4 Å" value="2.116 Å" />
 <InfoRow label="n = 2: v₂ = 2.19 × 10⁶ / 2 m/s" value="1.095 × 10⁶ m/s" />
 <InfoRow label="n = 3: r₃ = 0.529 × 9 Å" value="4.761 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Heavy atom: Gold 1s electron (Z = 79):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="v₁ = Z × 2.19×10⁶ / n (for Z = 79, n = 1)" result="" color={T.eo_core} />
 <CalcRow eq="v₁ = 79 × 2.19×10⁶ = 1.73 × 10⁸ m/s" result="58% of c" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Gold's 1s electron moves at 58% the speed of light! At this speed, its relativistic mass increases by ~22%, which contracts the orbital radius. This relativistic contraction of inner s-orbitals is why gold appears yellow (not silver) and why mercury is a liquid at room temperature. Sommerfeld's relativistic correction was essential for understanding heavy-element chemistry relevant to materials like CdTe and PbS quantum dots.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Rydberg Formula — Predicting Lyman Series UV Lines" color={T.eo_core} formula="1/λ = R∞(1/n₁² − 1/n₂²)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> When hydrogen gas in a discharge tube is excited, it emits specific wavelengths of ultraviolet light. The Lyman series corresponds to electron transitions that end at n=1 (the ground state). Predicting these wavelengths was one of the earliest triumphs of atomic spectroscopy.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a staircase where each step has a specific height. When you drop a ball from step 2, 3, or 4 down to step 1, it releases a precise amount of energy each time. The Rydberg formula is the "ruler" that tells you exactly how tall each drop is.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify the Transitions:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Rydberg constant R∞" value="1.097 × 10⁷ m⁻¹" />
 <InfoRow label="Final state n₁" value="1 (ground state)" />
 <InfoRow label="Initial states n₂" value="2 (Lyman-α), 3 (Lyman-β)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Wavelengths:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Lyman-α: 1/λ = R∞(1/1² − 1/2²) = R∞ × 3/4" result="" color={T.eo_core} />
 <CalcRow eq="1/λ = 1.097×10⁷ × 0.75 = 8.228×10⁶ m⁻¹" result="" color={T.eo_core} />
 <CalcRow eq="λ_α = 1 / 8.228×10⁶" result="121.6 nm (UV)" color={T.eo_core} />
 <CalcRow eq="Lyman-β: 1/λ = R∞(1/1² − 1/3²) = R∞ × 8/9" result="" color={T.eo_core} />
 <CalcRow eq="λ_β = 1 / (1.097×10⁷ × 0.889)" result="102.5 nm (UV)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Both Lyman lines fall deep in the ultraviolet (below 200 nm), invisible to the eye. Lyman-α at 121.6 nm is the strongest UV emission line in the universe — it's used to detect distant galaxies. For materials science, these UV photons have enough energy (~10.2 eV for Lyman-α) to break chemical bonds, which is why hydrogen plasma can etch and clean semiconductor surfaces during fabrication.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Thomson's e/m Ratio from Cathode Ray Deflection" color={T.eo_core} formula="e/m = E / (B²r)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> J.J. Thomson (1897) fired cathode rays through crossed electric and magnetic fields. By balancing the forces to get zero deflection, then using the magnetic field alone to bend the beam in a circle, he measured the charge-to-mass ratio of the electron — proving it was a universal subatomic particle.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine rolling a ball through a corridor with a crosswind (electric field) and a magnet pulling sideways (magnetic field). By adjusting until the ball goes straight, you learn its speed. Then remove the wind and watch the magnet curve it — the tighter the curve, the lighter the ball.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify Given Values:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Electric field E" value="1.0 × 10⁴ V/m" />
 <InfoRow label="Magnetic field B" value="5.33 × 10⁻⁴ T" />
 <InfoRow label="Radius of curvature r" value="0.20 m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate e/m:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="At balance: eE = evB → v = E/B" result="" color={T.eo_core} />
 <CalcRow eq="v = 1.0×10⁴ / 5.33×10⁻⁴ = 1.876×10⁷ m/s" result="" color={T.eo_core} />
 <CalcRow eq="Circular motion: evB = mv²/r → e/m = v/(Br)" result="" color={T.eo_core} />
 <CalcRow eq="e/m = 1.876×10⁷ / (5.33×10⁻⁴ × 0.20)" result="1.76 × 10¹¹ C/kg" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Thomson's value of 1.76 × 10¹¹ C/kg was ~1800× larger than the e/m for hydrogen ions, proving the electron is far lighter than any atom. This was the first measurement of a subatomic particle's property. The same crossed-field geometry is still used in mass spectrometers (SIMS) that analyze the composition of semiconductor wafers.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Rutherford Scattering — Closest Approach of α Particle to Gold" color={T.eo_core} formula="d = kZze² / KE">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Rutherford fired 7.7 MeV alpha particles at a thin gold foil. Most passed through, but a few bounced back — proving the atom has a tiny, dense, positively charged nucleus. The distance of closest approach tells us the upper bound on nuclear size.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine rolling a bowling ball toward an invisible but powerful spring. The ball slows, stops, then bounces back. The closer the ball gets before stopping, the stronger (more charged) the spring must be. That stopping distance tells you where the "wall" is.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify Given Values:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="α particle charge z" value="2 (He nucleus)" />
 <InfoRow label="Gold nuclear charge Z" value="79" />
 <InfoRow label="Kinetic energy KE" value="7.7 MeV = 1.233 × 10⁻¹² J" />
 <InfoRow label="Coulomb constant k" value="8.99 × 10⁹ N·m²/C²" />
 <InfoRow label="Elementary charge e" value="1.602 × 10⁻¹⁹ C" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Distance of Closest Approach:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="At closest approach: KE = kZze²/d" result="" color={T.eo_core} />
 <CalcRow eq="d = kZze² / KE" result="" color={T.eo_core} />
 <CalcRow eq="d = (8.99×10⁹)(79)(2)(1.602×10⁻¹⁹)² / (1.233×10⁻¹²)" result="" color={T.eo_core} />
 <CalcRow eq="d = 3.646×10⁻²⁶ / 1.233×10⁻¹²" result="2.96 × 10⁻¹⁴ m" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The closest approach distance ~30 fm is about 10,000× smaller than the atom itself (~1 Å = 10⁻¹⁰ m). This proved the nucleus occupies only ~10⁻¹² of the atom's volume — the rest is "empty" space filled by electron wavefunctions. The gold nucleus (radius ~7 fm) fits well within this upper bound. Rutherford backscattering spectroscopy (RBS) still uses this same physics to measure thin film composition and thickness in semiconductor processing.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Moseley's Law — X-ray Frequency vs Atomic Number" color={T.eo_core} formula="√f = a(Z − b)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Henry Moseley (1913) measured characteristic K-alpha X-ray frequencies from many elements and discovered that √f varies linearly with Z, not atomic weight. This proved atomic number (not mass) is the fundamental ordering principle of elements — and allowed him to predict missing elements.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine each element as a bell with a slightly different pitch. Moseley showed that the pitch increases in a perfectly regular pattern with the number of protons — not the weight of the bell. One "note" was missing from the scale, which led to the discovery of a new element (hafnium).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Set Up Moseley's Law for K-alpha:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Moseley constant a" value="4.97 × 10⁷ √Hz" />
 <InfoRow label="Screening constant b" value="1 (for K-alpha)" />
 <InfoRow label="Target element" value="Copper (Z = 29)" />
 <InfoRow label="K-alpha transition" value="n=2 → n=1" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate K-alpha Frequency:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="√f = a(Z − b) = 4.97×10⁷ × (29 − 1)" result="" color={T.eo_core} />
 <CalcRow eq="√f = 4.97×10⁷ × 28 = 1.392×10⁹ √Hz" result="" color={T.eo_core} />
 <CalcRow eq="f = (1.392×10⁹)² " result="1.937 × 10¹⁸ Hz" color={T.eo_core} />
 <CalcRow eq="λ = c/f = 3×10⁸ / 1.937×10¹⁸" result="0.155 nm (X-ray)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The predicted Cu K-alpha wavelength of 0.155 nm matches the experimental value of 0.1542 nm within 0.5%. Cu K-alpha radiation is the most widely used X-ray source in X-ray diffraction (XRD), the workhorse technique for crystal structure analysis in materials science. Every time you run an XRD scan on a ZnTe thin film, you're using exactly the X-rays Moseley's law predicts.</div>
 </div>
 </NCard>

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
 <text x={xStart - 22} y={y + 13} fill={col} fontSize={13} fontFamily="monospace" fontWeight="bold">{orb.name}</text>
 </g>
 );
 });

 const arrowPts = orbitalOrder.map((_, i) => ({ x: 20, y: yStart - i * energyGap + 9 }));

 return (
 <svg viewBox="0 0 340 380" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <text x={170} y={15} textAnchor="middle" fill={T.ink} fontSize={13} fontFamily="monospace" fontWeight="bold">
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
 <text x={20} y={yStart + 19} fill={T.muted} fontSize={12} fontFamily="monospace">s</text>
 <rect x={35} y={yStart + 10} width={12} height={12} fill={T.eo_valence} rx={2} opacity={0.6} />
 <text x={50} y={yStart + 19} fill={T.muted} fontSize={12} fontFamily="monospace">p</text>
 <rect x={65} y={yStart + 10} width={12} height={12} fill={T.eo_core} rx={2} opacity={0.6} />
 <text x={80} y={yStart + 19} fill={T.muted} fontSize={12} fontFamily="monospace">d</text>
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
 Electrons fill energy levels like people filling seats in a room. Everyone sits in the lowest seat first. Each seat fits only two people. In a row, people spread out before sitting together. Sometimes a higher seat fills before a lower one because it is a bit more comfortable.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 {renderSVG()}
 </div>
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
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
 Animate Filling
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
 <div style={{ background: "#7c3aed08", border: `1px solid ${T.eo_hole}`, borderRadius: 6, padding: 10 }}>
 <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_hole, marginBottom: 4 }}>Anomalous Configuration!</div>
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

 <div style={{ background: "#7c3aed08", border: `1px solid ${T.eo_e}`, borderRadius: 6, padding: 10 }}>
 <div style={{ fontSize: 11, fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Key Insight</div>
 <div style={{ fontSize: 10, lineHeight: 1.5 }}>
 Electron configuration determines chemical properties. Cu having 3d¹⁰4s¹ is why it's
 monovalent in kesterites. The Aufbau order (n+l rule) explains why 4s fills before 3d,
 and why the periodic table has the shape it does.
 </div>
 </div>

 <NCard title="Numerical Example: Electron Configuration of Silicon (Z=14)" color={T.eo_core} formula="1s² 2s² 2p⁶ 3s² 3p²">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Silicon is the backbone of the semiconductor industry. To understand why it forms four covalent bonds and acts as a Group IV semiconductor, we must build up its electron configuration using the Aufbau principle.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine filling seats in a theater from front to back. The first row (1s) has 2 seats, the second row (2s) has 2, the third row (2p) has 6, and so on. Each electron takes the lowest available seat. By the time all 14 electrons of Si are seated, the last 4 sit in the third "balcony" — these are the valence electrons that determine all of Si's chemistry.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Fill orbitals using Aufbau order (n+l rule):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="1s (n+l = 1+0 = 1)" value="2 electrons → 1s²" />
 <InfoRow label="2s (n+l = 2+0 = 2)" value="2 electrons → 2s²" />
 <InfoRow label="2p (n+l = 2+1 = 3)" value="6 electrons → 2p⁶" />
 <InfoRow label="3s (n+l = 3+0 = 3)" value="2 electrons → 3s²" />
 <InfoRow label="3p (n+l = 3+1 = 4)" value="2 electrons → 3p²" />
 <InfoRow label="Total" value="2+2+6+2+2 = 14 " />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Identify valence electrons:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Core: [Ne] = 1s² 2s² 2p⁶ (10 e⁻)" result="" color={T.eo_core} />
 <CalcRow eq="Valence: 3s² 3p²" result="4 valence e⁻" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Silicon's 4 valence electrons (3s² 3p²) undergo sp³ hybridization, forming 4 equivalent tetrahedral bonds. This is why Si crystallizes in the diamond cubic structure with a bandgap of 1.12 eV — ideal for solar cells. Each Si atom shares one electron with each of 4 neighbors, creating the covalent backbone of every silicon wafer in the world.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Why Copper is [Ar]3d¹⁰4s¹ not [Ar]3d⁹4s²" color={T.eo_core} formula="Anomalous Configuration">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The Aufbau principle predicts Cu (Z=29) should be [Ar]3d⁹4s². But experimentally, it's [Ar]3d¹⁰4s¹. Why? Fully filled subshells have extra exchange energy stabilization. This matters for CZTS solar cells where Cu provides 1 valence electron.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine 10 parking spots in a row. Having all 10 filled (3d¹⁰) is more "stable" than having 9 filled and one empty, because symmetry lowers the total energy. Nature prefers the completed arrangement enough to "steal" one electron from the 4s orbital.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Count exchange pairs:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Exchange pairs for n parallel spins" value="n(n−1)/2" />
 <InfoRow label="[Ar]3d⁹4s²: 5↑ in d (max same-spin)" value="5(4)/2 = 10 pairs" />
 <InfoRow label="[Ar]3d¹⁰4s¹: 5↑ + 5↓ in d" value="5(4)/2 × 2 = 20 pairs" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Energy comparison:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Extra exchange stabilization for d¹⁰" result="+10 pairs" color={T.eo_core} />
 <CalcRow eq="Cost: promote 4s → 3d" result="~1.5 eV" color={T.eo_core} />
 <CalcRow eq="Net: exchange gain > promotion cost" result="d¹⁰s¹ wins" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Copper's actual configuration [Ar]3d¹⁰4s¹ means it's monovalent (Cu⁺ easily loses one 4s electron). This is critical for kesterite Cu₂ZnSnS₄ (CZTS) solar cells, where Cu must contribute exactly 1 electron per atom. Similarly, Cr is [Ar]3d⁵4s¹ (half-filled d) instead of [Ar]3d⁴4s² — another anomaly explained by exchange energy.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Ionization Energy of Helium — Why Is It So High?" color={T.eo_core} formula="IE = 13.6 × Z_eff² / n² eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Helium has the highest first ionization energy of any element at 24.6 eV, and its second ionization energy is a staggering 54.4 eV. Understanding why requires calculating the effective nuclear charge seen by each electron, accounting for electron-electron shielding in the 1s² configuration.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine two kids sharing a trampoline (the 1s orbital) near a strong magnet (Z=2 nucleus). Each kid partially blocks the magnet's pull from the other. Remove one kid (IE₁ = 24.6 eV) and the remaining kid feels the full unshielded pull — removing them costs far more (IE₂ = 54.4 eV).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Determine Effective Nuclear Charges:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="He nuclear charge Z" value="2" />
 <InfoRow label="Slater shielding (1s-1s pair)" value="σ = 0.30" />
 <InfoRow label="Z_eff for first electron" value="2 − 0.30 = 1.70" />
 <InfoRow label="Z_eff for He⁺ (one electron)" value="2.00 (no shielding)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Ionization Energies:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="IE₁ = 13.6 × (1.70)² / 1² " result="" color={T.eo_core} />
 <CalcRow eq="IE₁ = 13.6 × 2.89" result="≈ 39.3 eV (crude); expt = 24.6 eV" color={T.eo_core} />
 <CalcRow eq="IE₂ = 13.6 × (2.00)² / 1² (exact, hydrogen-like)" result="54.4 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The crude Slater estimate overestimates IE₁ because it ignores electron correlation, but IE₂ = 54.4 eV is exact (He⁺ is hydrogen-like with Z=2). The enormous jump from IE₁ to IE₂ (×2.2) shows how losing one shielding electron dramatically increases the nuclear pull on the survivor. This same principle explains why noble gases are chemically inert — their filled shells have very high ionization energies, making them useless as dopants but excellent as sputtering gases in thin-film deposition.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Electron Configuration of Chromium for Stainless Steel" color={T.eo_core} formula="Exchange pairs K = n(n−1)/2">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Chromium's electron configuration is [Ar]3d⁵4s¹ instead of the expected [Ar]3d⁴4s². This anomaly arises because a half-filled d-shell maximizes exchange energy — the quantum mechanical stabilization from having parallel spins. Cr is the key alloying element in stainless steel (≥10.5%), where its electronic structure determines corrosion resistance.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine 5 rooms (d orbitals) and 5 guests (electrons). Each guest pair that sits in separate rooms with matching orientation (parallel spin) earns a "harmony bonus." Having 5 guests in 5 rooms (all parallel) gives maximum bonus — far more than cramming 2 into one room.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Count Exchange Pairs:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Expected config [Ar]3d⁴4s²" value="4 parallel d-electrons" />
 <InfoRow label="Exchange pairs for d⁴" value="K = 4(3)/2 = 6 pairs" />
 <InfoRow label="Actual config [Ar]3d⁵4s¹" value="5 parallel d-electrons + 1 s" />
 <InfoRow label="Exchange pairs for d⁵" value="K = 5(4)/2 = 10 pairs" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Exchange Energy Gain:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔK = K(d⁵) − K(d⁴) = 10 − 6" result="4 extra pairs" color={T.eo_core} />
 <CalcRow eq="Exchange energy per pair J ≈ 0.5−1 eV" result="" color={T.eo_core} />
 <CalcRow eq="Extra stabilization ≈ 4 × J ≈ 2−4 eV" result="≫ promotion cost" color={T.eo_core} />
 <CalcRow eq="Promotion cost 4s → 3d" result="~1.5 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 4 extra exchange pairs provide 2–4 eV of stabilization, easily exceeding the ~1.5 eV cost of promoting one 4s electron to 3d. This is why half-filled and fully-filled d-shells are especially stable. In stainless steel, Cr's 3d⁵4s¹ configuration makes it highly reactive with oxygen, forming a thin Cr₂O₃ passivation layer that protects the underlying iron from corrosion.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Lanthanide Contraction — Why Hf and Zr Have the Same Radius" color={T.eo_core} formula="Z_eff increases across 4f series">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Hafnium (Z=72) and zirconium (Z=40) have nearly identical atomic radii (159 pm vs 160 pm) despite being separated by 32 elements. This is because the 14 lanthanide elements between them have poorly shielding 4f electrons, causing a gradual contraction that "erases" the expected size increase.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine adding layers of gauze (4f electrons) between you and a lightbulb (nucleus). The gauze is so thin and diffuse that each layer barely blocks any light. After 14 layers, you still feel almost the full brightness — meaning outer electrons feel nearly the full nuclear pull and stay close in.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Track Z<sub>eff</sub> Across Lanthanides:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="La (Z=57): [Xe]5d¹6s²" value="r = 187 pm" />
 <InfoRow label="4f shielding factor per electron" value="σ_4f ≈ 0.85 (vs ideal 1.00)" />
 <InfoRow label="Lu (Z=71): [Xe]4f¹⁴5d¹6s²" value="r = 175 pm" />
 <InfoRow label="Contraction across 14 elements" value="Δr ≈ 12 pm" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Cumulative Z<sub>eff</sub> Increase:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Each 4f electron adds +1 to Z but only +0.85 to shielding" result="" color={T.eo_core} />
 <CalcRow eq="Net ΔZ_eff per 4f electron = 1 − 0.85" result="+0.15" color={T.eo_core} />
 <CalcRow eq="Total ΔZ_eff across 14 4f electrons = 14 × 0.15" result="+2.1" color={T.eo_core} />
 <CalcRow eq="Hf (Z=72) vs Zr (Z=40): radius" result="159 pm ≈ 160 pm" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The +2.1 increase in Z<sub>eff</sub> compresses the 5d/6s orbitals enough that Hf ends up the same size as Zr directly above it. This has enormous practical consequences: Hf and Zr are chemically so similar that they always occur together in minerals and are extremely difficult to separate. In semiconductor technology, HfO₂ is used as a high-k gate dielectric precisely because its large Z gives it a high dielectric constant (κ ≈ 25) compared to ZrO₂ (κ ≈ 22).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Valence Electrons of Ga, In, Tl for III-V Semiconductors" color={T.eo_core} formula="Group IIIA → 3 valence electrons">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> III-V semiconductors like GaAs, InP, and TlBr are built from Group III elements bonded to Group V or VII elements. The electron configurations of Ga, In, and Tl reveal why each contributes exactly 3 valence electrons — and why heavier elements in the group show the "inert pair effect."
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each Group III atom brings exactly 3 gifts (valence electrons) to the bonding party. But for the heaviest member (Tl), the two innermost gifts (6s²) are wrapped so tightly by relativistic effects that they're hard to give away — this is the "inert pair effect."</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Build Electron Configurations:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Ga (Z=31)" value="[Ar] 3d¹⁰ 4s² 4p¹ → 3 valence e⁻" />
 <InfoRow label="In (Z=49)" value="[Kr] 4d¹⁰ 5s² 5p¹ → 3 valence e⁻" />
 <InfoRow label="Tl (Z=81)" value="[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹ → 3 valence e⁻" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Bonding in III-V Compounds:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="GaAs: 3(Ga) + 5(As) = 8 valence e⁻ per pair" result="4 sp³ bonds" color={T.eo_core} />
 <CalcRow eq="InP: 3(In) + 5(P) = 8 valence e⁻ per pair" result="4 sp³ bonds" color={T.eo_core} />
 <CalcRow eq="TlBr: Tl⁺ (loses only 6p¹) + Br⁻" result="ionic (inert pair)" color={T.eo_core} />
 <CalcRow eq="Band gaps: GaAs=1.42, InP=1.35, TlBr=2.68 eV" result="tunable!" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>All three elements have 3 valence electrons (ns²np¹), making them ideal partners for Group V atoms to form tetrahedral semiconductors with 8 electrons per bond pair. GaAs powers high-speed electronics and laser diodes; InP is the substrate for fiber-optic lasers at 1.55 μm. Thallium compounds behave differently because the relativistically stabilized 6s² pair resists bonding, making Tl prefer the +1 oxidation state — a direct consequence of the Aufbau principle meeting relativity.</div>
 </div>
 </NCard>

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
 <svg viewBox="0 0 340 360" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">
 {stage === 0 ? "Isolated Atoms: Zn + Te" : "Bond Formation"}
 </text>

 <circle cx={znDraw} cy={atomY} r={28} fill={T.eo_e} opacity={0.15} stroke={T.eo_e} strokeWidth={2} />
 <text x={znDraw} y={atomY + 4} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace" fontWeight="bold">Zn</text>
 <text x={znDraw} y={atomY + 18} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">30e⁻</text>

 <circle cx={teDraw} cy={atomY} r={32} fill={T.eo_hole} opacity={0.15} stroke={T.eo_hole} strokeWidth={2} />
 <text x={teDraw} y={atomY + 4} textAnchor="middle" fill={T.eo_hole} fontSize={12} fontFamily="monospace" fontWeight="bold">Te</text>
 <text x={teDraw} y={atomY + 18} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">52e⁻</text>

 {znValenceElectrons.map((e, i) => {
 const ex = lerp(e.baseX, midX + (i - 0.5) * 8, bp);
 const ey = lerp(e.baseY, atomY - 50 + i * 12, bp);
 return (
 <g key={`zv${i}`}>
 <circle cx={ex} cy={ey} r={5} fill={T.eo_e} opacity={0.8 + 0.2 * Math.sin(t + i)} />
 <text x={ex} y={ey + 3} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace">e⁻</text>
 </g>
 );
 })}
 {teValenceElectrons.map((e, i) => {
 const ex = lerp(e.baseX, midX + (i - 2.5) * 8, bp);
 const ey = lerp(e.baseY, atomY - 50 + (i + 2) * 12, bp);
 return (
 <g key={`tv${i}`}>
 <circle cx={ex} cy={ey} r={5} fill={T.eo_hole} opacity={0.8 + 0.2 * Math.sin(t + i)} />
 <text x={ex} y={ey + 3} textAnchor="middle" fill="#fff" fontSize={13} fontFamily="monospace">e⁻</text>
 </g>
 );
 })}

 {bp > 0.5 && (
 <g opacity={(bp - 0.5) * 2}>
 <ellipse cx={midX} cy={atomY} rx={35} ry={55} fill="none" stroke={T.eo_valence} strokeWidth={1.5} strokeDasharray="4,3" />
 <text x={midX} y={atomY + 68} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontFamily="monospace" fontWeight="bold">sp³ hybrid</text>
 <text x={midX} y={atomY + 80} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontFamily="monospace">2 + 6 = 8 valence e⁻</text>
 </g>
 )}

 <text x={znDraw} y={210} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace">[Ar] 3d¹⁰ 4s²</text>
 <text x={znDraw} y={224} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace" fontWeight="bold">↑ valence: 4s²</text>
 <text x={znDraw} y={238} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace" fontWeight="bold">2 e⁻</text>

 <text x={teDraw} y={210} textAnchor="middle" fill={T.eo_hole} fontSize={12} fontFamily="monospace">[Kr] 4d¹⁰ 5s² 5p⁴</text>
 <text x={teDraw} y={224} textAnchor="middle" fill={T.eo_hole} fontSize={12} fontFamily="monospace" fontWeight="bold">↑ valence: 5s²5p⁴</text>
 <text x={teDraw} y={238} textAnchor="middle" fill={T.eo_hole} fontSize={12} fontFamily="monospace" fontWeight="bold">6 e⁻</text>

 {stage === 1 && bondProgress < 0.01 && (
 <g onClick={() => setBonding(true)} style={{ cursor: "pointer" }}>
 <rect x={130} y={290} width={80} height={24} rx={4} fill={T.eo_valence} />
 <text x={170} y={306} textAnchor="middle" fill="#fff" fontSize={12} fontFamily="monospace" fontWeight="bold">Form Bond</text>
 </g>
 )}

 {bp >= 1 && (
 <g>
 <rect x={30} y={290} width={280} height={60} rx={6} fill={T.panel} stroke={T.border} strokeWidth={1} />
 <text x={170} y={307} textAnchor="middle" fill={T.ink} fontSize={13} fontFamily="monospace" fontWeight="bold">Band Formation</text>
 <rect x={50} y={315} width={100} height={12} rx={3} fill={T.eo_valence} opacity={0.4} />
 <text x={100} y={324} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontFamily="monospace">Valence Band (4×↑↓=8e⁻)</text>
 <rect x={190} y={315} width={100} height={12} rx={3} fill={T.eo_cond} opacity={0.2} stroke={T.eo_cond} strokeDasharray="3,2" />
 <text x={240} y={324} textAnchor="middle" fill={T.eo_cond} fontSize={12} fontFamily="monospace">Conduction Band (empty)</text>
 <line x1={155} y1={318} x2={185} y2={318} stroke={T.eo_gap} strokeWidth={2} />
 <text x={170} y={340} textAnchor="middle" fill={T.eo_gap} fontSize={12} fontFamily="monospace">Eg = 2.26 eV</text>
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
 <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">Unit Cell — 4 formula units</text>
 <rect x={ox} y={oy} width={unitSize * 2} height={unitSize * 2} fill="none" stroke={T.ink} strokeWidth={1.5} strokeDasharray="4,4" />
 {atoms.map((a, i) => {
 const col = a.type === "Zn" ? T.eo_e : T.eo_hole;
 const pulse = 1 + 0.04 * Math.sin(t * 2 + i);
 return (
 <g key={i}>
 <circle cx={ox + a.x} cy={oy + a.y} r={14 * pulse} fill={col} opacity={0.2} />
 <circle cx={ox + a.x} cy={oy + a.y} r={10 * pulse} fill={col} opacity={0.6} />
 <text x={ox + a.x} y={oy + a.y + 3.5} textAnchor="middle" fill="#fff" fontSize={12} fontFamily="monospace" fontWeight="bold">{a.type}</text>
 </g>
 );
 })}
 <text x={170} y={230} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">4 Zn + 4 Te = 4 formula units</text>
 <text x={170} y={248} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontFamily="monospace">4 × 8 = 32 valence electrons</text>
 <text x={170} y={268} textAnchor="middle" fill={T.muted} fontSize={13} fontFamily="monospace">Each formula unit contributes 8 e⁻ to bands</text>
 <text x={170} y={288} textAnchor="middle" fill={T.eo_e} fontSize={12} fontFamily="monospace">Zn: 4×2=8 e⁻ | Te: 4×6=24 e⁻ | Total=32</text>
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
 <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <text x={170} y={15} textAnchor="middle" fill={T.ink} fontSize={13} fontFamily="monospace" fontWeight="bold">2×2×2 Supercell — 64 atoms</text>
 <rect x={10} y={15} width={320} height={245} fill="none" stroke={T.ink} strokeWidth={1.5} strokeDasharray="6,4" rx={4} />
 <text x={24} y={27} fill={T.muted} fontSize={13} fontFamily="monospace">2×2×2</text>
 {dots.slice(0, 32).map((d, i) => {
 const col = d.type === "Zn" ? T.eo_e : T.eo_hole;
 const o = 0.5 + 0.3 * Math.sin(t + i * 0.5);
 return <circle key={i} cx={d.x} cy={d.y + 10} r={5} fill={col} opacity={o} />;
 })}
 <text x={170} y={270} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">32 Zn + 32 Te = 64 atoms</text>
 <text x={170} y={288} textAnchor="middle" fill={T.eo_valence} fontSize={12} fontFamily="monospace">32×2 + 32×6 = 256 valence e⁻</text>
 <text x={170} y={306} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">Total valence electrons = 256</text>
 </svg>
 );
 }

 if (stage === 4) {
 const bandY = 140;
 const vbTop = bandY + 10;
 const cbBot = bandY - 10;
 const kPoints = 12;
 return (
 <svg viewBox="0 0 340 320" style={{ background: T.bg, borderRadius: 8, width: "100%", maxWidth: 374 }}>
 <text x={170} y={18} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">Band Structure from Electrons</text>
 <line x1={40} y1={30} x2={40} y2={280} stroke={T.ink} strokeWidth={1} />
 <text x={15} y={145} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace" transform="rotate(-90,15,145)">Energy</text>
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
 <text x={300} y={vbTop + 50} textAnchor="end" fill={T.eo_valence} fontSize={12} fontFamily="monospace">VB (filled)</text>
 <rect x={50} y={cbBot - 80} width={240} height={80} fill={T.eo_cond} opacity={0.04} />
 <text x={300} y={cbBot - 40} textAnchor="end" fill={T.eo_cond} fontSize={12} fontFamily="monospace">CB (empty)</text>

 <line x1={160} y1={vbTop} x2={160} y2={cbBot} stroke={T.eo_gap} strokeWidth={2} />
 <text x={170} y={bandY + 3} textAnchor="start" fill={T.eo_gap} fontSize={13} fontFamily="monospace" fontWeight="bold">Eg</text>

 {[...Array(8)].map((_, i) => {
 const eky = vbTop + 20 + Math.sin(t + i) * 8;
 const ekx = 70 + i * 28 + Math.sin(t * 0.5 + i * 2) * 5;
 return <circle key={i} cx={ekx} cy={eky} r={2.5} fill={T.eo_e} opacity={0.6 + 0.3 * Math.sin(t + i)} />;
 })}

 <text x={170} y={295} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">
 Each dot = electron from Zn or Te atom
 </text>
 <text x={170} y={310} textAnchor="middle" fill={T.ink} fontSize={12} fontFamily="monospace" fontWeight="bold">
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
 Zinc brings 2 outer electrons and Tellurium brings 6. When they join in a crystal, they share all 8 electrons together. The shared electrons fill up the lower energy level (valence band). The upper energy level (conduction band) stays empty. This gap between them is what makes ZnTe a semiconductor.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 {renderSVG()}
 </div>
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
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

 <div style={{ background: "#7c3aed08", border: `1px solid ${T.eo_e}`, borderRadius: 6, padding: 10 }}>
 <div style={{ fontSize: 10, fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Key Insight</div>
 <div style={{ fontSize: 9, lineHeight: 1.5 }}>
 Every electron in the band structure came from atoms. Zn donates 2 valence electrons,
 Te donates 6. Together they fill 4 bonding orbitals per formula unit, creating the valence band.
 The antibonding orbitals remain empty — that is the conduction band.
 </div>
 </div>

 <NCard title="Numerical Example: ZnTe Bond Formation" color={T.eo_valence} formula="2 + 6 = 8 valence e⁻ → 4 sp³ bonds">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Zinc telluride forms when Zn and Te atoms combine. Each Zn ([Ar]3d¹⁰4s²) contributes 2 valence electrons; each Te ([Kr]4d¹⁰5s²5p⁴) contributes 6. Together, 8 valence electrons fill 4 sp³-hybridized bonding orbitals — creating the tetrahedral zinc blende crystal.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine Zn brings 2 chairs to a dinner party and Te brings 6. Together they have exactly 8 — enough to fill 4 two-seat tables (bonding orbitals). No seats are left empty at the bonding tables, and the antibonding tables upstairs stay completely vacant.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Identify valence electrons:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Zn config" value="[Ar] 3d¹⁰ 4s² → 2 valence e⁻" />
 <InfoRow label="Te config" value="[Kr] 4d¹⁰ 5s² 5p⁴ → 6 valence e⁻" />
 <InfoRow label="Total per ZnTe unit" value="2 + 6 = 8 e⁻" />
 <InfoRow label="Bonds formed" value="8 e⁻ / 2 per bond = 4 bonds" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Estimate bond energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Zn–Te bond dissociation energy" result="" color={T.eo_valence} />
 <CalcRow eq="E_bond ≈ 119 kJ/mol (experimental)" result="" color={T.eo_valence} />
 <CalcRow eq="Per bond: 119 / 96.485" result="≈ 1.23 eV/bond" color={T.eo_valence} />
 <CalcRow eq="4 bonds per unit → 4 × 1.23" result="≈ 4.93 eV total" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>All 8 valence electrons are consumed forming 4 tetrahedral bonds. The bonding orbitals (filled) become the valence band; the antibonding orbitals (empty) become the conduction band. The energy gap between them is the 2.26 eV band gap of ZnTe.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Lattice Constant from Covalent Radii" color={T.eo_valence} formula="a = 4d / √3">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Can we predict ZnTe{"'"}s crystal structure from atomic data alone? Using tabulated covalent radii we estimate the bond length, then calculate the cubic lattice constant and compare to the experimental value.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In the zinc blende structure, each atom sits at a corner of a tetrahedron. The bond runs along the body diagonal of a small cube. Geometry says the diagonal of that cube relates to the edge by √3 — so if you know the bond length, you can calculate the full lattice constant.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Estimate bond length from covalent radii:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Covalent radius of Zn" value="r_Zn = 1.22 Å" />
 <InfoRow label="Covalent radius of Te" value="r_Te = 1.36 Å" />
 <InfoRow label="Estimated bond length" value="d = 1.22 + 1.36 = 2.58 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate lattice constant:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="In zinc blende: d = a√3 / 4" result="" color={T.eo_valence} />
 <CalcRow eq="a = 4d / √3 = 4 × 2.58 / 1.732" result="" color={T.eo_valence} />
 <CalcRow eq="a (predicted)" result="≈ 5.96 Å" color={T.eo_valence} />
 <CalcRow eq="a (experimental)" result="6.10 Å" color={T.eo_valence} />
 <CalcRow eq="Error = (6.10 − 5.96)/6.10 × 100" result="≈ 2.3%" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Our prediction undershoots by ~2.3%. The discrepancy comes from the partial ionic character of the Zn–Te bond (Δχ ≈ 0.6). Ionic contributions slightly expand the lattice because the Coulomb attraction between Zn²⁺ and Te²⁻ ions operates at a larger equilibrium distance than pure covalent overlap.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Band Gap of ZnTe from Electronegativity Difference" color={T.eo_valence} formula="Eg ≈ 1.35|Δχ|² for II-VI compounds">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> There is an empirical correlation between electronegativity difference and band gap in II-VI semiconductors. We use it to predict Eg for ZnTe, ZnSe, and CdTe and compare with experimental values.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The bigger the electronegativity mismatch between atoms, the wider the energy gap between bonding and antibonding states — like a tug-of-war where a larger strength difference creates a bigger gap between winning and losing positions.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Electronegativity differences:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="ZnTe: Δχ = |2.10 − 1.65|" value="0.45" />
 <InfoRow label="ZnSe: Δχ = |2.55 − 1.65|" value="0.90" />
 <InfoRow label="CdTe: Δχ = |2.10 − 1.69|" value="0.41" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Predict band gaps:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ZnTe: Eg ≈ 1.35 × (0.45)² = 1.35 × 0.2025" result="≈ 0.27 eV" color={T.eo_valence} />
 <CalcRow eq="ZnTe experimental Eg" result="= 2.26 eV" color={T.eo_valence} />
 <CalcRow eq="ZnSe: Eg ≈ 1.35 × (0.90)² = 1.35 × 0.81" result="≈ 1.09 eV" color={T.eo_valence} />
 <CalcRow eq="ZnSe experimental Eg" result="= 2.70 eV" color={T.eo_valence} />
 <CalcRow eq="CdTe: Eg ≈ 1.35 × (0.41)² = 1.35 × 0.168" result="≈ 0.23 eV" color={T.eo_valence} />
 <CalcRow eq="CdTe experimental Eg" result="= 1.49 eV" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The simple Δχ² formula captures the correct trend (ZnSe {">"} ZnTe {">"} CdTe) but underestimates magnitudes because the band gap also depends on atomic size, spin-orbit coupling, and covalent contributions. The ionic part (Δχ) is only one ingredient — the full band gap requires solving the crystal Hamiltonian. Still, the trend is a useful screening tool for new materials.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Madelung Energy of ZnTe (Partial Ionic Model)" color={T.eo_valence} formula="E_Mad = −αe²q²/(4πε₀r)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> ZnTe is mostly covalent but has ~5% ionic character. We model it with fractional charges ±0.05e and calculate the Madelung energy, comparing with a fully covalent model (zero Madelung energy).
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Even though ZnTe is mostly covalent, the tiny charge imbalance (5% of a full electron) creates a small but real electrostatic attraction across the crystal. It is like a barely magnetized material — weak individually, but summed over billions of atoms it matters.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Madelung constant (zinc blende)" value="α = 1.6381" />
 <InfoRow label="Fractional charge" value="q* = 0.05e = 8.01 × 10⁻²¹ C" />
 <InfoRow label="Nearest-neighbor distance" value="r = 2.64 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate Madelung energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E_Mad = −α × k × (q*)² / r" result="" color={T.eo_valence} />
 <CalcRow eq="= −1.6381 × (8.988×10⁹) × (8.01×10⁻²¹)² / (2.64×10⁻¹⁰)" result="" color={T.eo_valence} />
 <CalcRow eq="= −1.6381 × 8.988×10⁹ × 6.42×10⁻⁴¹ / 2.64×10⁻¹⁰" result="" color={T.eo_valence} />
 <CalcRow eq="E_Mad per ion pair" result="≈ −3.58 × 10⁻²¹ J ≈ −0.022 eV" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Madelung energy with 5% ionic character is only ~0.022 eV per pair — tiny compared to NaCl{"'"}s ~8 eV. This confirms ZnTe is overwhelmingly covalent. The small ionic contribution does matter for piezoelectric properties and phonon splitting between LO and TO modes (the LO-TO splitting in ZnTe is ~21 cm⁻¹, directly proportional to the effective charge).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Cohesive Energy — Sum of ZnTe Bond Energies" color={T.eo_valence} formula="E_coh ≈ (bonds per atom) × E_bond">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In the zinc blende structure, each atom forms 4 tetrahedral bonds. We estimate the cohesive energy per formula unit from the average Zn–Te bond energy and compare with the experimental sublimation enthalpy.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Breaking a crystal apart is like disassembling a structure held together by springs. Count the springs attached to each node (4 per atom), but each spring is shared between two nodes. The total energy is the number of unique springs times the spring strength.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Bond counting:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Bonds per Zn atom" value="4 (tetrahedral)" />
 <InfoRow label="Bonds per Te atom" value="4 (tetrahedral)" />
 <InfoRow label="Bonds per ZnTe formula unit" value="4 (each bond shared)" />
 <InfoRow label="Average Zn–Te bond energy" value="≈ 1.23 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate cohesive energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E_coh = 4 bonds × 1.23 eV/bond" result="= 4.92 eV per formula unit" color={T.eo_valence} />
 <CalcRow eq="Convert: 4.92 eV × 96.485 kJ/(eV·mol)" result="= 475 kJ/mol" color={T.eo_valence} />
 <CalcRow eq="Experimental sublimation enthalpy" result="≈ 460 kJ/mol" color={T.eo_valence} />
 <CalcRow eq="Agreement" result="~3% overestimate" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The simple bond-counting model gives ~475 kJ/mol, within 3% of experiment. The small overestimate arises because we used isolated bond energies — in a crystal, bonds are slightly weakened by many-body effects. The cohesive energy sets the melting point (~1295°C for ZnTe) and mechanical stability.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Elastic Constants of ZnTe from Bond Stiffness" color={T.eo_valence} formula="C₁₁ from bond force constant">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The elastic constant C₁₁ measures how stiff a crystal is along a cube axis. We relate it to the bond force constant (second derivative of the bond energy) and estimate Young{"'"}s modulus for ZnTe.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each bond acts like a tiny spring. C₁₁ tells you how hard it is to compress the crystal along one direction — it depends on how stiff those springs are and how they are oriented relative to the compression axis.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Known elastic constants of ZnTe:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="C₁₁" value="71.3 GPa" />
 <InfoRow label="C₁₂" value="40.7 GPa" />
 <InfoRow label="C₄₄" value="31.2 GPa" />
 <InfoRow label="Lattice constant a" value="6.10 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate Young{"'"}s modulus and bond stiffness:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Young's modulus E = (C₁₁ − C₁₂)(C₁₁ + 2C₁₂) / (C₁₁ + C₁₂)" result="" color={T.eo_valence} />
 <CalcRow eq="E = (71.3 − 40.7)(71.3 + 81.4) / (71.3 + 40.7)" result="" color={T.eo_valence} />
 <CalcRow eq="E = 30.6 × 152.7 / 112.0" result="≈ 41.7 GPa" color={T.eo_valence} />
 <CalcRow eq="Bond force constant k ≈ C₁₁ × a" result="≈ 71.3 × 6.10×10⁻¹⁰ = 43.5 N/m" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ZnTe{"'"}s Young{"'"}s modulus (~42 GPa) is much lower than Si{"'"}s (~130 GPa) because Zn–Te bonds are longer and weaker than Si–Si bonds. The Zener anisotropy ratio A = 2C₄₄/(C₁₁−C₁₂) = 2(31.2)/30.6 = 2.04, indicating significant elastic anisotropy — the crystal is twice as stiff in some directions as others.</div>
 </div>
 </NCard>


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
 { label: "Proton", m: 1.673e-27, v: 1e4 },
 { label: "Baseball", m: 0.145, v: 40 },
 ];
 const h = 6.626e-34;
 const cur = masses[massIdx];
 const lambda = h / (cur.m * cur.v);
 const fmtLambda = (l) => {
 if (l > 1e-3) return l.toExponential(2) + " m";
 if (l > 1e-9) return (l * 1e9).toFixed(3) + " nm";
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
 <rect key="b1" x={barrX - 4} y={0} width={8} height={s1Y - 8} fill="#334155" />,
 <rect key="b2" x={barrX - 4} y={s1Y + 8} width={8} height={s2Y - s1Y - 16} fill="#334155" />,
 <rect key="b3" x={barrX - 4} y={s2Y + 8} width={8} height={H - s2Y - 8} fill="#334155" />,
 <text key="blbl" x={barrX} y={16} textAnchor="middle" fontSize={13} fill="#64748b">barrier</text>,
 <text key="s1l" x={barrX + 14} y={s1Y + 3} fontSize={12} fill="#94a3b8">slit 1</text>,
 <text key="s2l" x={barrX + 14} y={s2Y + 3} fontSize={12} fill="#94a3b8">slit 2</text>,
 );

 // Screen + label
 els.push(
 <text key="scrlbl" x={scrX + 5} y={16} textAnchor="middle" fontSize={13} fill="#64748b">screen</text>,
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
 els.push(<rect key={`si${y}`} x={scrX} y={y} width={10} height={2} fill="#7c3aed" opacity={p * 0.95} />);
 }
 // Incoming circular wavefronts from source
 const t = frame * 0.07;
 for (let i = 0; i < 5; i++) {
 const r = ((t * 28 + i * 22) % 115);
 if (r > 3 && r < 112) {
 els.push(<circle key={`iw${i}`} cx={srcX} cy={srcY} r={r} fill="none" stroke="#7c3aed" strokeWidth={1.3} opacity={(1 - r / 112) * 0.7} clipPath="url(#wdLeft)" />);
 }
 }
 // Diffracted wavefronts from each slit
 [s1Y, s2Y].forEach((sy, si) => {
 for (let i = 0; i < 6; i++) {
 const r = ((t * 28 + i * 18) % 250);
 if (r > 3 && r < 245) {
 els.push(<circle key={`dw${si}${i}`} cx={barrX} cy={sy} r={r} fill="none"
 stroke={si === 0 ? "#7c3aed" : "#7c3aed"} strokeWidth={1}
 opacity={(1 - r / 245) * 0.4} clipPath="url(#wdRight)" />);
 }
 }
 });
 } else {
 // Screen background
 els.push(<rect key="scrbg" x={scrX} y={10} width={10} height={180} fill="#1e293b" stroke="#334155" strokeWidth={1} />);
 // Accumulated dots
 hits.forEach((h, i) => {
 els.push(<circle key={`h${i}`} cx={h.x} cy={h.y} r={1.5} fill="#7c3aed" opacity={0.75} />);
 });

 if (mode === "quantum") {
 // Ghost electron approaching barrier
 if (evPhase < 0.48) {
 const gx = srcX + (evPhase / 0.48) * (barrX - srcX - 14);
 const gy = srcY;
 els.push(
 <circle key="glow2" cx={gx} cy={gy} r={18} fill="#7c3aed" opacity={0.05} />,
 <circle key="glow1" cx={gx} cy={gy} r={10} fill="#7c3aed" opacity={0.12} />,
 <circle key="ghost" cx={gx} cy={gy} r={5} fill="#7c3aed" opacity={0.45} />,
 <text key="psi" x={gx} y={gy - 14} textAnchor="middle" fontSize={13} fill="#7c3aed" opacity={0.8}>ψ</text>,
 );
 // Trail
 for (let k = 1; k <= 5; k++) {
 const tx = gx - k * 9;
 if (tx > srcX) {
 els.push(<circle key={`tr${k}`} cx={tx} cy={gy} r={4 - k * 0.6} fill="#7c3aed" opacity={0.12 - k * 0.02} />);
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
 stroke="#7c3aed" strokeWidth={1.5 - k * 0.4}
 opacity={(1 - wp) * (0.6 - k * 0.18)} clipPath="url(#wdRight)" />);
 }
 }
 });
 // Collapse flash near screen
 if (wp > 0.82) {
 const flash = (wp - 0.82) / 0.18;
 for (let y = 10; y < 190; y += 4) {
 const p = interfProb(y);
 els.push(<rect key={`pf${y}`} x={scrX - 2} y={y} width={14} height={4} fill="#7c3aed" opacity={p * flash * 0.4} />);
 }
 }
 }
 } else {
 // Classical: single ball going straight through slit 1 only
 const px = srcX + evPhase * (scrX - srcX);
 const py = s1Y;
 if (px < scrX) {
 els.push(
 <circle key="ball" cx={px} cy={py} r={5} fill="#7c3aed" />,
 <circle key="ballg" cx={px} cy={py} r={9} fill="#7c3aed" opacity={0.2} />,
 );
 }
 }
 }

 // Source
 els.push(
 <circle key="src" cx={srcX} cy={srcY} r={9} fill="#7c3aed" opacity={0.85} />,
 <text key="srclbl" x={srcX} y={srcY + 20} textAnchor="middle" fontSize={13} fill="#64748b">gun</text>,
 );

 return els;
 };

 const MODES = [
 { id: "classical", label: "1. Classical Bullet", color: "#7c3aed" },
 { id: "wave", label: "2. Continuous Wave", color: "#7c3aed" },
 { id: "quantum", label: "3. One Electron at a Time", color: "#7c3aed" },
 ];

 const STEPS = {
 classical: [
 { head: "One ball, one slit", body: "A classical bullet goes through exactly one slit. You can always say which slit — in principle and in practice." },
 { head: "Hits screen as a dot", body: "Each bullet lands in one small spot near the slit it passed through. No spreading, no bands." },
 { head: "Two blobs, no bands", body: "Send thousands of bullets → two piles of dots, one behind each slit. Completely predictable. This is classical physics." },
 ],
 wave: [
 { head: "Wave hits the whole barrier at once", body: "A water wave (or light wave) doesn't \"choose\" a slit — it spreads and hits both slits simultaneously." },
 { head: "Two new waves emerge", body: "Each slit acts as a new wave source. Circular waves radiate from slit 1 and slit 2 independently." },
 { head: "The waves overlap and interfere", body: "Where two peaks meet → bright band (constructive). Where a peak meets a trough → dark band (destructive). This is normal wave physics." },
 { head: "Screen shows bands", body: "The pattern of bright and dark stripes is the interference pattern. Completely expected for waves." },
 ],
 quantum: [
 { head: "Fire ONE electron", body: "We send electrons one at a time, with a long gap between each. No two electrons are in the apparatus at the same time." },
 { head: "Each lands as ONE dot", body: "Every electron hits the screen at a single point — exactly like a bullet. It never smears out visibly." },
 { head: "But thousands of dots…", body: "After many electrons, the dots build the same interference pattern as the wave experiment. Each electron \"knew\" about both slits." },
 { head: "The electron went through BOTH slits", body: "Before measurement, the electron exists as a wavefunction ψ spread through space. ψ split at the barrier, went through both slits, and interfered with itself on the far side." },
 { head: "|ψ|² = probability", body: "The wave amplitude squared gives the probability of landing at each point. High |ψ|² → bright band. Zero |ψ|² → dark band. The electron is forced to land where its own wave says is likely." },
 { head: "Measurement collapses ψ", body: "The instant the electron hits the screen, the wavefunction collapses to one point. This is not ignorance — quantum mechanics says the position genuinely did not exist until then." },
 ],
 };

 const col = MODES.find(m => m.id === mode).color;

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "monospace", color: T.ink }}>
 <AnalogyBox>
 If you throw a ball at a wall with two openings, it goes through one or the other. But electrons are different {"—"} they act like water waves and go through both openings at once. This creates a striped pattern on the other side, not two simple spots. Electrons behave like both a ball and a wave.
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

 {/* Animation + Why this matters */}
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ width: "100%" }}>
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
 <span style={{ color: hits.length < 30 ? "#7c3aed" : hits.length < 100 ? "#7c3aed" : "#7c3aed", fontSize: 10 }}>
 {hits.length < 30 ? "Firing… wait for pattern" : hits.length < 100 ? "Pattern forming…" : "Interference pattern visible!"}
 </span>
 </div>
 )}
 </div>
 </div>

 </div>

 {/* Step-by-step explanation */}
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: col, marginBottom: 14 }}>
 {mode === "classical" && "Result: two blobs — no interference"}
 {mode === "wave" && "Result: interference bands — expected for waves"}
 {mode === "quantum" && "Result: interference bands — from single electrons!"}
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

 {/* de Broglie section */}
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ width: "100%", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
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

 {/* Why this matters — full width, below de Broglie */}
 {mode === "quantum" && (
 <div style={{ background: "#7c3aed18", border: "1.5px solid #7c3aed33", borderLeft: "4px solid #7c3aed", borderRadius: 8, padding: 16 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 8 }}>Why this matters for materials science</div>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.75 }}>
 Every electron in a CdTe crystal behaves this way. Its wavefunction ψ is not localised to one atom — it spreads
 over the entire crystal lattice. When Bloch solved the Schrödinger equation for periodic crystals, he found that
 these spreading wavefunctions form <strong>energy bands</strong> — the conduction band and valence band that determine
 whether CdTe absorbs light and conducts electricity. The "weirdness" of quantum mechanics is precisely why solar
 cells work.
 </div>
 </div>
 )}

 <NCard title="Numerical Example: de Broglie Wavelength of an Electron in a TEM" color={T.eo_core} formula="λ = h / √(2m₀eV)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A transmission electron microscope (TEM) accelerates electrons through 200 kV. At this energy, the electron wavelength becomes tiny enough to resolve individual atoms in a crystal lattice. Let's calculate the wavelength with and without relativistic correction.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine throwing pebbles at a fence. Large, slow pebbles (visible light, λ ≈ 500 nm) can't "see" the gaps between fence posts 2 Å apart. But if you shrink the pebbles to the size of atoms (electron wavelength ≈ 0.025 Å), they easily pass through and diffract — revealing the atomic arrangement.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Non-relativistic calculation:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="h (Planck's constant)" value="6.626 × 10⁻³⁴ J·s" />
 <InfoRow label="m₀ (electron mass)" value="9.109 × 10⁻³¹ kg" />
 <InfoRow label="eV = 200,000 eV × 1.602×10⁻¹⁹ J/eV" value="3.204 × 10⁻¹⁴ J" />
 <InfoRow label="√(2m₀eV)" value="2.415 × 10⁻²² kg·m/s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Calculate wavelength (with relativistic correction):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="λ_NR = h / √(2m₀eV) = 6.626e-34 / 2.415e-22" result="2.74 pm" color={T.eo_core} />
 <CalcRow eq="Relativistic: eV/m₀c² = 200000/511000 = 0.391" result="" color={T.eo_core} />
 <CalcRow eq="λ_rel = λ_NR / √(1 + eV/2m₀c²)" result="" color={T.eo_core} />
 <CalcRow eq="λ_rel = 2.74 pm / √(1.196) = 2.74 / 1.094" result="2.51 pm = 0.0251 Å" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 200 kV, the electron wavelength (0.025 Å) is about 100× smaller than interatomic spacings (~2.5 Å in CdTe). This is why TEMs can image individual atomic columns in thin-film solar cells. The relativistic correction reduces the wavelength by ~8% at 200 kV — important for accurate crystallographic measurements. This is de Broglie's hypothesis made practical: electrons are waves, and we exploit their tiny wavelengths every day in materials characterization.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Davisson-Germer Electron Diffraction from Nickel" color={T.eo_core} formula="nλ = d sin θ">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In 1927, Davisson and Germer accelerated electrons to 54 eV and fired them at a nickel crystal. They observed a strong diffraction peak at 50° — proving electrons are waves. Let's verify this matches de Broglie's prediction.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>When ocean waves hit a breakwater with regularly spaced gaps, they create a pattern of constructive and destructive interference on the other side. The nickel crystal's regularly spaced atoms (d = 2.15 Å) act as the "breakwater" for electron waves. If electrons weren't waves, there would be no diffraction peak at any angle.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Calculate de Broglie wavelength at 54 eV:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Kinetic energy" value="54 eV = 8.65 × 10⁻¹⁸ J" />
 <InfoRow label="p = √(2m₀E)" value="3.97 × 10⁻²⁴ kg·m/s" />
 <InfoRow label="λ = h/p = 6.626e-34 / 3.97e-24" value="1.67 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Predict diffraction angle (n = 1):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Ni lattice spacing d = 2.15 Å" result="" color={T.eo_core} />
 <CalcRow eq="sin θ = nλ / d = 1.67 / 2.15" result="0.777" color={T.eo_core} />
 <CalcRow eq="θ = arcsin(0.777)" result="50.9°" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Our calculated 50.9° matches the experimentally observed peak at 50° almost exactly! This was the smoking gun that proved de Broglie right: electrons have wavelengths. This same principle underlies electron diffraction techniques (RHEED, LEED, TEM diffraction) used daily to characterize thin-film solar cell materials like CdTe and CIGS.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Heisenberg Uncertainty — Electron Confined to an Atom" color={T.eo_core} formula="Δx · Δp ≥ ℏ/2">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> If we know an electron is somewhere inside an atom (Δx ≈ 1 Å = 10⁻¹⁰ m), Heisenberg's uncertainty principle sets a minimum momentum — and therefore a minimum kinetic energy. This explains why electrons in atoms can never be "at rest" and gives us a quick estimate of atomic energy scales.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a hyperactive cat in a small room. The smaller the room (tighter confinement), the faster the cat bounces around. You can't pin down both its position and speed simultaneously. An electron in an atom-sized "room" must be moving with at least a few eV of kinetic energy.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Determine Minimum Momentum:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Position uncertainty Δx" value="1.0 × 10⁻¹⁰ m (1 Å)" />
 <InfoRow label="Reduced Planck constant ℏ" value="1.055 × 10⁻³⁴ J·s" />
 <InfoRow label="Electron mass m_e" value="9.109 × 10⁻³¹ kg" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Minimum Kinetic Energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Δp ≥ ℏ / (2Δx) = 1.055×10⁻³⁴ / (2×10⁻¹⁰)" result="5.28 × 10⁻²⁵ kg·m/s" color={T.eo_core} />
 <CalcRow eq="KE_min = (Δp)² / (2m_e)" result="" color={T.eo_core} />
 <CalcRow eq="= (5.28×10⁻²⁵)² / (2 × 9.109×10⁻³¹)" result="" color={T.eo_core} />
 <CalcRow eq="= 2.79×10⁻⁴⁹ / 1.822×10⁻³⁰" result="" color={T.eo_core} />
 <CalcRow eq="= 1.53×10⁻¹⁹ J ÷ 1.602×10⁻¹⁹" result="≈ 0.95 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Even with the most generous inequality (ℏ/2), confining an electron to atomic dimensions guarantees at least ~1 eV of kinetic energy. A more careful estimate using Δp ≈ ℏ/Δx gives ~3.8 eV, on the order of the hydrogen ground state (13.6 eV). This "zero-point motion" is why atoms don't collapse, why quantum dots have size-dependent band gaps, and why smaller nanocrystals glow bluer — tighter confinement means higher minimum energy.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Compton Scattering — Photon vs Electron Collision" color={T.eo_core} formula="Δλ = (h/m_e c)(1 − cos θ)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Arthur Compton (1923) scattered X-rays off electrons and found the scattered photon had a longer wavelength than the incident one. The wavelength shift depended only on the scattering angle — not the material. This proved photons carry momentum like particles, clinching wave-particle duality for light.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a cue ball (photon) hitting a stationary billiard ball (electron). After the collision, the cue ball moves slower (longer wavelength = less energy) and the billiard ball recoils. The angle determines how much energy transfers — a head-on hit transfers the most.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify Given Values:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Scattering angle θ" value="90°" />
 <InfoRow label="Planck constant h" value="6.626 × 10⁻³⁴ J·s" />
 <InfoRow label="Electron mass m_e" value="9.109 × 10⁻³¹ kg" />
 <InfoRow label="Speed of light c" value="3.0 × 10⁸ m/s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Compton Shift:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Compton wavelength λ_C = h/(m_e c)" result="" color={T.eo_core} />
 <CalcRow eq="= 6.626×10⁻³⁴ / (9.109×10⁻³¹ × 3×10⁸)" result="2.426 × 10⁻¹² m" color={T.eo_core} />
 <CalcRow eq="Δλ = λ_C(1 − cos 90°) = 2.426×10⁻¹² × (1 − 0)" result="" color={T.eo_core} />
 <CalcRow eq="Δλ" result="0.00243 nm" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Compton wavelength shift of 0.00243 nm (2.43 pm) is tiny but measurable with X-rays. At θ=180° (backscatter), the shift doubles to 0.00486 nm. This effect is negligible for visible light but dominant for gamma rays. In materials characterization, Compton scattering is the basis of electron density mapping and is the main source of background noise in energy-dispersive X-ray spectroscopy (EDS) used for compositional analysis of thin films.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Thermal de Broglie Wavelength at Room Temperature" color={T.eo_core} formula="λ_th = h / √(2πmk_BT)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> At thermal equilibrium, particles have an average kinetic energy of (3/2)k_BT. The thermal de Broglie wavelength tells us when quantum effects become important: if λ_th approaches the inter-particle spacing, quantum statistics (Fermi-Dirac or Bose-Einstein) must be used instead of classical Boltzmann statistics.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each particle is a "fuzzy blob" whose size is its thermal wavelength. If the blobs don't overlap (classical gas), you can treat them as billiard balls. But when temperature drops or mass decreases enough that blobs overlap, quantum weirdness takes over.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify Parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Temperature T" value="300 K (room temperature)" />
 <InfoRow label="Boltzmann constant k_B" value="1.381 × 10⁻²³ J/K" />
 <InfoRow label="Electron mass m_e" value="9.109 × 10⁻³¹ kg" />
 <InfoRow label="Neutron mass m_n" value="1.675 × 10⁻²⁷ kg" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate for Electrons and Neutrons:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Electron: λ_th = 6.626×10⁻³⁴ / √(2π × 9.109×10⁻³¹ × 1.381×10⁻²³ × 300)" result="" color={T.eo_core} />
 <CalcRow eq="= 6.626×10⁻³⁴ / √(2.373×10⁻⁵⁰)" result="" color={T.eo_core} />
 <CalcRow eq="= 6.626×10⁻³⁴ / 4.871×10⁻²⁵" result="λ_e = 1.36 nm" color={T.eo_core} />
 <CalcRow eq="Neutron: λ_th = h / √(2π × 1.675×10⁻²⁷ × k_BT)" result="" color={T.eo_core} />
 <CalcRow eq="= 6.626×10⁻³⁴ / 2.088×10⁻²³" result="λ_n = 0.0317 nm" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Electrons at 300 K have λ_th ≈ 1.36 nm — comparable to atomic spacings in crystals! This is why electrons in metals must be treated quantum mechanically (Fermi-Dirac statistics). Neutrons at 300 K have λ_th ≈ 0.032 nm — close to interatomic spacings too, which is why "thermal neutrons" are perfect probes for crystal structure determination via neutron diffraction, especially for locating light atoms like hydrogen in materials.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Double-Slit Experiment — Fringe Spacing for Electrons" color={T.eo_core} formula="Δy = λL / d">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Jönsson (1961) performed the double-slit experiment with electrons, directly showing interference fringes. For 50 keV electrons passing through slits separated by 100 nm with a screen 1 m away, we can calculate the fringe spacing — the ultimate proof of electron wave behavior.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine tossing pebbles through two narrow gaps in a wall into a pool. If pebbles were waves, you'd see alternating bands of big and small ripples on the far shore. That's exactly what happens with electrons — they arrive in bands, even when sent one at a time.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Find Electron Wavelength:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Accelerating voltage V" value="50,000 V" />
 <InfoRow label="Slit separation d" value="100 nm = 10⁻⁷ m" />
 <InfoRow label="Screen distance L" value="1.0 m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Fringe Spacing:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="λ = h/√(2m_e eV) = 1.226/√(50000) nm" result="" color={T.eo_core} />
 <CalcRow eq="λ = 1.226 / 223.6" result="0.00548 nm" color={T.eo_core} />
 <CalcRow eq="Fringe spacing Δy = λL/d" result="" color={T.eo_core} />
 <CalcRow eq="= (5.48×10⁻¹² × 1.0) / 10⁻⁷" result="" color={T.eo_core} />
 <CalcRow eq="Δy" result="54.8 μm (0.055 mm)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The fringe spacing of ~55 μm is tiny but measurable with an electron microscope detector. This experiment is the most direct demonstration of quantum mechanics: each electron goes through both slits simultaneously as a wave, yet arrives at the screen as a single particle. The pattern builds up statistically, one electron at a time. This wave-particle duality is the foundation of electron optics in TEM, SEM, and electron-beam lithography used in semiconductor fabrication.</div>
 </div>
 </NCard>
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

 // Hydrogen atom energy levels: E<sub>n</sub> = -13.6/n² eV
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
 The Schr&ouml;dinger equation is like a map that shows where an electron is likely to be found. Give it the shape of the space, and it tells you every possible way the electron can exist and how much energy each way needs. The answer is not a fixed path but a cloud showing where the electron probably is.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* SVG */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 320 520" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 352 }}>
 <text x={160} y={16} textAnchor="middle" fontSize={13} fill={T.ink} fontWeight="bold">
 Hydrogen Atom {"—"} {orb.name} orbital
 </text>

 {/* Nucleus */}
 <circle cx={cx} cy={cy} r={5} fill={T.eo_hole} />
 <text x={cx} y={cy + 3} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">H{"⁺"}</text>

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
 <text x={280} y={300} fontSize={13} fill={T.muted}>r</text>
 <text x={25} y={250} fontSize={13} fill={T.muted} transform="rotate(-90,25,250)">R(r){"²"}{"·"}r{"²"}</text>
 <path d={radialCurve.join(" ")} fill="none" stroke={T.eo_valence} strokeWidth={2} />
 {/* Most probable radius marker (at actual peak) */}
 <line x1={40 + (orb.peakR / rMax) * 240} y1={195} x2={40 + (orb.peakR / rMax) * 240} y2={295} stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />
 <text x={40 + (orb.peakR / rMax) * 240} y={193} textAnchor="middle" fontSize={12} fill={T.eo_gap}>r{"ₘₐₓ"} = {orb.peakPm} pm</text>
 {/* Node markers (where probability = 0) */}
 {orb.nodes.map((nd, ni) => (
 <g key={ni}>
 <line x1={40 + (nd.r / rMax) * 240} y1={280} x2={40 + (nd.r / rMax) * 240} y2={295} stroke={T.eo_hole} strokeWidth={1} opacity={0.7} />
 <text x={40 + (nd.r / rMax) * 240} y={278} textAnchor="middle" fontSize={12} fill={T.eo_hole}>node</text>
 </g>
 ))}
 </g>
 )}

 {/* Energy level diagram (centered below R(r) curve) */}
 <rect x={80} y={320} width={160} height={185} rx={6} fill={T.bg} stroke={T.border} strokeWidth={0.5} />
 <text x={160} y={335} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight="bold">Energy Level Diagram (eV)</text>
 {[1, 2, 3, 4].map(n => {
 const eN = energyN(n);
 const yE = 345 + [135, 85, 55, 35][n - 1];
 const isSel = n === nQ;
 return (
 <g key={n} onClick={() => setNQ(n)} style={{ cursor: "pointer" }}>
 <line x1={110} y1={yE} x2={210} y2={yE} stroke={isSel ? T.eo_valence : T.dim} strokeWidth={isSel ? 2.5 : 1} />
 <text x={218} y={yE + 4} fontSize={10} fill={isSel ? T.eo_valence : T.muted} fontWeight={isSel ? 700 : 400}>n={n}</text>
 <text x={103} y={yE + 4} textAnchor="end" fontSize={10} fill={isSel ? T.eo_valence : T.muted} fontWeight={isSel ? 700 : 400}>{eN.toFixed(1)}</text>
 </g>
 );
 })}
 <text x={103} y={498} textAnchor="end" fontSize={10} fill={T.muted}>0 eV</text>
 <line x1={110} y1={494} x2={210} y2={494} stroke={T.dim} strokeWidth={0.5} strokeDasharray="3,3" />
 <text x={160} y={508} textAnchor="middle" fontSize={10} fill={T.eo_gap}>free (ionized)</text>
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

 {/* Info */}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
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
 <div style={{ marginTop: 4 }}><span style={{ color: T.eo_gap }}></span> <strong>Peaks</strong> = most likely distances (marked with dashed line)</div>
 <div><span style={{ color: T.eo_hole }}></span> <strong>Nodes</strong> = zero probability {"—"} the wavefunction crosses zero here. An ns orbital has (n{"−"}1) nodes.</div>
 <div style={{ marginTop: 4, color: T.muted }}>For n=1: one peak, no nodes. For n=2: two peaks separated by 1 node at 212 pm. The electron can be found on either side of the node but never at the node itself.</div>
 </div>
 </div>

 <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_core }}>The Story</div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
 Inspired by de Broglie{"'"}s 1924 thesis on matter waves, Erwin Schr{"ö"}dinger derived his famous wave equation during a Christmas vacation in 1925 at a villa in Arosa, Switzerland. Meanwhile, Werner Heisenberg independently developed an equivalent "matrix mechanics" approach in G{"ö"}ttingen. The two formulations were later shown to be mathematically identical. Max Born provided the crucial interpretation: the wavefunction {"ψ"} itself is not physical, but |{"ψ"}|{"²"} gives the probability of finding the electron at a given location — replacing deterministic orbits with probability clouds.
 </div>
 </div>

 <NCard title="Numerical Example: Quantum Confinement in a CdSe Quantum Dot" color={T.eo_core} formula="Eₙ = n²h² / (8mL²)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A CdSe quantum dot is essentially a "particle in a box" — electrons are confined to a nanoscale region. Using the 1D particle-in-a-box model with L = 5 nm, we can estimate the confinement energy and predict why smaller dots glow bluer (quantum confinement blueshift).
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a guitar string. A shorter string vibrates at higher frequency (higher pitch). Similarly, an electron confined to a smaller box has a higher energy ground state. This is why 2 nm CdSe dots glow blue while 6 nm dots glow red — the "note" changes with size.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Given values:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="h (Planck's constant)" value="6.626 × 10⁻³⁴ J·s" />
 <InfoRow label="m* (CdSe effective mass ≈ 0.13 m₀)" value="1.184 × 10⁻³¹ kg" />
 <InfoRow label="L (dot diameter)" value="5 nm = 5 × 10⁻⁹ m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Calculate energy levels:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E₁ = h² / (8m*L²)" result="" color={T.eo_core} />
 <CalcRow eq="= (6.626e-34)² / (8 × 1.184e-31 × (5e-9)²)" result="" color={T.eo_core} />
 <CalcRow eq="= 4.39e-67 / 2.368e-47" result="1.854 × 10⁻²⁰ J" color={T.eo_core} />
 <CalcRow eq="E₁ = 1.854e-20 / 1.602e-19" result="0.116 eV" color={T.eo_core} />
 <CalcRow eq="E₂ = 4 × E₁" result="0.463 eV" color={T.eo_core} />
 <CalcRow eq="E₃ = 9 × E₁" result="1.043 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The confinement energy of 0.116 eV adds to CdSe's bulk bandgap of 1.74 eV, shifting the effective gap to ~1.86 eV for a 5 nm dot. For a 2 nm dot, confinement energy would be ~0.73 eV (scales as 1/L²), pushing the gap to ~2.47 eV (blue light). This is why quantum dot displays can produce any color simply by changing dot size — a direct, practical consequence of the Schr{"ö"}dinger equation.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Hydrogen Atom Ground State Energy" color={T.eo_core} formula="Eₙ = −13.6 / n² eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The Schr{"ö"}dinger equation for the hydrogen atom can be solved exactly. Let's verify the ground state energy using fundamental constants and find the most probable radius for the 1s orbital.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Schr{"ö"}dinger equation balances two competing effects: kinetic energy wants to spread the electron out (lowering momentum uncertainty), while the Coulomb attraction pulls it toward the nucleus. The ground state is nature's compromise — the Bohr radius a₀ is exactly where these two tendencies balance.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Fundamental constants:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="m_e (electron mass)" value="9.109 × 10⁻³¹ kg" />
 <InfoRow label="e (elementary charge)" value="1.602 × 10⁻¹⁹ C" />
 <InfoRow label="ε₀ (vacuum permittivity)" value="8.854 × 10⁻¹² F/m" />
 <InfoRow label="h (Planck's constant)" value="6.626 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Calculate ground state energy and Bohr radius:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E₁ = −m_e × e⁴ / (8ε₀²h²)" result="" color={T.eo_core} />
 <CalcRow eq="= −(9.109e-31)(1.602e-19)⁴ / (8(8.854e-12)²(6.626e-34)²)" result="" color={T.eo_core} />
 <CalcRow eq="= −2.179 × 10⁻¹⁸ J" result="−13.6 eV" color={T.eo_core} />
 <CalcRow eq="a₀ = ε₀h² / (πm_e e²)" result="" color={T.eo_core} />
 <CalcRow eq="= 5.292 × 10⁻¹¹ m" result="0.529 Å" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The ground state energy of −13.6 eV matches the ionization energy of hydrogen exactly. The Bohr radius a₀ = 0.529 Å is where the radial probability density 4πr²|ψ₁ₛ|² is maximum — the most likely place to find the 1s electron. Note that the wavefunction ψ₁ₛ = (1/√π)(1/a₀)^(3/2) × e^(−r/a₀) has no angular dependence — it's a perfect sphere, unlike Bohr's circular orbit.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Tunneling Probability Through a Barrier" color={T.eo_core} formula="T = exp(−2κL)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In classical physics, a ball can't pass through a wall if it lacks the energy to go over. But quantum mechanically, an electron can "tunnel" through a potential barrier — its wavefunction decays exponentially inside the barrier but doesn't reach zero. This is the basis of scanning tunneling microscopy (STM) and flash memory.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine rolling a ball toward a hill that's taller than the ball's energy allows it to climb. Classically, it bounces back every time. But if the hill is thin enough, quantum mechanics says there's a chance the ball "ghosts" through to the other side. The thinner and lower the hill, the better the odds.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Define the Barrier:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Electron energy E" value="1.0 eV = 1.602 × 10⁻¹⁹ J" />
 <InfoRow label="Barrier height V₀" value="2.0 eV = 3.204 × 10⁻¹⁹ J" />
 <InfoRow label="Barrier width L" value="0.5 nm = 5 × 10⁻¹⁰ m" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Tunneling Probability:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="κ = √(2m_e(V₀ − E)) / ℏ" result="" color={T.eo_core} />
 <CalcRow eq="= √(2 × 9.109×10⁻³¹ × 1.602×10⁻¹⁹) / 1.055×10⁻³⁴" result="" color={T.eo_core} />
 <CalcRow eq="= √(2.920×10⁻⁴⁹) / 1.055×10⁻³⁴" result="" color={T.eo_core} />
 <CalcRow eq="κ = 5.123×10⁹ m⁻¹" result="" color={T.eo_core} />
 <CalcRow eq="2κL = 2 × 5.123×10⁹ × 5×10⁻¹⁰ = 5.123" result="" color={T.eo_core} />
 <CalcRow eq="T = exp(−5.123)" result="≈ 0.006 (0.6%)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>About 0.6% of electrons tunnel through this 0.5 nm barrier — classically impossible but quantum mechanically routine. If the barrier were 1 nm, T drops to ~0.003%; at 0.1 nm, it rises to ~36%. This exponential sensitivity to distance is exploited in STM, where a tip-sample gap change of just 0.1 nm changes the tunnel current by an order of magnitude, giving atomic-resolution images of surfaces.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Infinite Square Well — Photon Absorbed in GaAs Quantum Wire" color={T.eo_core} formula="Eₙ = n²h² / (8m*L²)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A GaAs quantum wire confines electrons to a 10 nm region in one dimension. The effective mass of electrons in GaAs is only 0.067m_e due to the crystal potential. When an electron absorbs a photon and jumps from n=1 to n=2, the photon wavelength reveals the confinement energy.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a guitar string of fixed length. Its lowest note (n=1) has one half-wavelength fitting in the length. The next note (n=2) has two half-wavelengths and four times the energy. A quantum wire is an "electron guitar string" — shorter wires play higher notes (emit bluer light).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Define Parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Wire width L" value="10 nm = 10⁻⁸ m" />
 <InfoRow label="Effective mass m*" value="0.067 × 9.109×10⁻³¹ = 6.103×10⁻³² kg" />
 <InfoRow label="Planck constant h" value="6.626 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Transition Wavelength:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E₁ = (1)²(6.626×10⁻³⁴)² / (8 × 6.103×10⁻³² × (10⁻⁸)²)" result="" color={T.eo_core} />
 <CalcRow eq="= 4.390×10⁻⁶⁷ / 4.883×10⁻⁴⁷" result="E₁ = 0.0899 eV" color={T.eo_core} />
 <CalcRow eq="E₂ = 4 × E₁ = 0.360 eV" result="" color={T.eo_core} />
 <CalcRow eq="ΔE = E₂ − E₁ = 3 × E₁" result="0.270 eV" color={T.eo_core} />
 <CalcRow eq="λ = hc / ΔE = 1240 eV·nm / 0.270 eV" result="4593 nm (mid-IR)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 1→2 transition emits mid-infrared light at 4.6 μm. The light effective mass of GaAs (0.067m_e) amplifies confinement effects by ~15× compared to free electrons. This is exactly the physics behind quantum cascade lasers (QCLs), which use engineered quantum wells to produce tunable mid-IR and terahertz radiation for gas sensing, medical imaging, and defense applications.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Harmonic Oscillator — Phonon Energy in Diamond" color={T.eo_core} formula="Eₙ = (n + ½)ℏω">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Diamond has the highest optical phonon frequency of any material because of its light carbon atoms and extremely stiff sp³ bonds. The quantum harmonic oscillator model gives the discrete energy levels of these vibrations, including the zero-point energy that persists even at absolute zero.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine two carbon atoms connected by the stiffest spring in nature. Even at absolute zero, they can never stop vibrating — that's the zero-point energy, a purely quantum effect. Each additional quantum of vibration (phonon) adds exactly one energy step ℏω.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify Parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Diamond optical phonon frequency ω" value="2.5 × 10¹⁴ rad/s" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s" />
 <InfoRow label="1 eV" value="1.602 × 10⁻¹⁹ J" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Energy Levels:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ℏω = 1.055×10⁻³⁴ × 2.5×10¹⁴" result="2.638 × 10⁻²⁰ J" color={T.eo_core} />
 <CalcRow eq="ℏω = 2.638×10⁻²⁰ / 1.602×10⁻¹⁹" result="0.165 eV" color={T.eo_core} />
 <CalcRow eq="E₀ = ½ℏω (zero-point energy, n=0)" result="0.082 eV" color={T.eo_core} />
 <CalcRow eq="E₁ = (3/2)ℏω (first excited state, n=1)" result="0.247 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Diamond's phonon energy of 0.165 eV (1332 cm⁻¹) is the highest of any crystal, which is why diamond has extraordinary thermal conductivity (2200 W/m·K) — its stiff bonds transmit vibrations efficiently. The zero-point energy of 0.082 eV means the atoms never stop vibrating even at 0 K. At room temperature, k_BT = 0.026 eV {"<"} ℏω, so most phonon modes are frozen out, explaining diamond's low specific heat at moderate temperatures — a direct prediction of quantum mechanics that classical physics gets wrong.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Hydrogen 2p→1s Transition — Lyman Alpha Emission" color={T.eo_core} formula="ΔE = 13.6(1/n₁² − 1/n₂²) eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The 2p→1s transition in hydrogen produces the Lyman-alpha line at 121.6 nm — the most important spectral line in astrophysics. The Schrödinger equation predicts not only the energy but also the transition rate via the Einstein A coefficient, which depends on the overlap integral between the 2p and 1s wavefunctions.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine an electron on the second floor of a building jumping down to the first floor. It must release the exact energy difference as a photon. How fast it jumps depends on how well the two "rooms" (orbitals) connect — the 2p and 1s have good overlap because Δl = 1 (an allowed transition).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Calculate Energy and Wavelength:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="n₂ (initial)" value="2 (2p state)" />
 <InfoRow label="n₁ (final)" value="1 (1s state)" />
 <InfoRow label="E₂" value="−13.6/4 = −3.40 eV" />
 <InfoRow label="E₁" value="−13.6/1 = −13.6 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Photon Properties:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔE = E₂ − E₁ = −3.40 − (−13.6)" result="10.2 eV" color={T.eo_core} />
 <CalcRow eq="λ = hc/ΔE = 1240/10.2" result="121.6 nm (UV)" color={T.eo_core} />
 <CalcRow eq="Einstein A coefficient (2p→1s)" result="6.27 × 10⁸ s⁻¹" color={T.eo_core} />
 <CalcRow eq="Lifetime τ = 1/A" result="1.60 ns" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 2p state lives for only 1.6 nanoseconds before emitting a 121.6 nm UV photon — this is fast because 2p→1s is a dipole-allowed transition (Δl = 1). The 2s→1s transition is forbidden (Δl = 0) and takes ~0.14 seconds via two-photon emission — 10⁸ times slower! This selection rule comes directly from the angular parts of the Schrödinger wavefunctions and determines which spectral lines are bright vs. absent, critical for understanding emission spectra of semiconductor materials.</div>
 </div>
 </NCard>

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
 Every electron has a four-part address. The first number tells the energy level (which floor). The second tells the shape of its space (round, dumbbell, clover). The third tells which direction it points. The fourth tells its spin (up or down). No two electrons can share the exact same address.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* SVG */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 320 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 352 }}>
 {!showAll ? (
 <g>
 {/* Axes */}
 <line x1={cx} y1={30} x2={cx} y2={290} stroke={T.dim} strokeWidth={0.5} strokeDasharray="3,3" />
 <line x1={30} y1={cy} x2={290} y2={cy} stroke={T.dim} strokeWidth={0.5} strokeDasharray="3,3" />
 <text x={cx + 4} y={28} fontSize={13} fill={T.muted}>z</text>
 <text x={292} y={cy - 4} fontSize={13} fill={T.muted}>x</text>
 {drawOrbital()}
 <text x={cx} y={308} fontSize={14} fill={T.eo_e} textAnchor="middle" fontWeight="bold">
 {orbitalName} (m_l={ml})
 </text>
 <rect x={10} y={10} width={10} height={10} fill={`${T.eo_e}99`} rx={2} />
 <text x={24} y={19} fontSize={13} fill={T.muted}>+ lobe</text>
 <rect x={10} y={24} width={10} height={10} fill={`${T.eo_hole}99`} rx={2} />
 <text x={24} y={33} fontSize={13} fill={T.muted}>{"−"} lobe</text>
 </g>
 ) : (
 <g>
 {/* Show all orbitals for selected n */}
 <text x={160} y={16} textAnchor="middle" fontSize={13} fill={T.ink} fontWeight="bold">
 All orbitals for n={n}
 </text>
 {Array.from({ length: n }, (_, li) => {
 const subName = ["s", "p", "d", "f"][li];
 const mlCount = 2 * li + 1;
 const cellW = 280 / Math.max(mlCount, 1);
 const rowY = 40 + li * 72;
 return (
 <g key={li}>
 <text x={10} y={rowY + 30} fontSize={12} fill={[T.eo_e, T.eo_valence, T.eo_core, T.eo_photon][li]} fontWeight="bold">
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
 <text x={orbCx} y={orbCy + orbSize + 12} textAnchor="middle" fontSize={12} fill={T.muted}>
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
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <NCard title="Numerical Example: Enumerating Quantum States for n=3 Shell" color={T.eo_core} formula="Total states = 2n²">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> For the n = 3 shell, let's enumerate every valid combination of quantum numbers (n, l, m_l, m_s) and verify the formula gives 2n² = 2(9) = 18 states. This counting is essential for understanding shell capacities in electron configurations.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Think of a hotel where floor 3 has apartments of different sizes: one studio (l=0, s-orbital), three 1-bedrooms (l=1, p-orbitals), and five 2-bedrooms (l=2, d-orbitals). Each apartment holds exactly 2 guests (spin up/down). Total capacity = 2×(1+3+5) = 18 guests.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — List subshells (l = 0 to n−1):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="l = 0 (3s): mₗ = {0}" value="1 orbital × 2 spins = 2 states" />
 <InfoRow label="l = 1 (3p): mₗ = {−1, 0, +1}" value="3 orbitals × 2 spins = 6 states" />
 <InfoRow label="l = 2 (3d): mₗ = {−2, −1, 0, +1, +2}" value="5 orbitals × 2 spins = 10 states" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Verify total count:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Total orbitals = 1 + 3 + 5 = Σ(2l+1) for l=0 to 2" result="9 orbitals" color={T.eo_core} />
 <CalcRow eq="Total states = 9 × 2 (each orbital holds ms = ±½)" result="18 states" color={T.eo_core} />
 <CalcRow eq="Formula check: 2n² = 2(3²)" result="18 " color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The n=3 shell holds exactly 18 electrons (matching Period 4's 18-element span if 3d were filled in order). The general pattern 2n² explains shell capacities: n=1 holds 2, n=2 holds 8, n=3 holds 18, n=4 holds 32. The Pauli exclusion principle guarantees no two electrons share the same four quantum numbers — this is why matter has volume and doesn't collapse.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Stern-Gerlach — Predicting Beam Splitting" color={T.eo_core} formula="Beam spots = 2J + 1">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In 1922, Stern and Gerlach sent silver atoms through an inhomogeneous magnetic field. Classically, the beam should spread continuously. Instead, it split into exactly 2 discrete spots — direct evidence for spin quantization. Let's predict this from quantum numbers.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine tossing a coin through a sorting machine. A "classical" coin could land at any angle, producing a smeared-out pattern. But a quantum coin can only land heads or tails — nothing in between. The Stern-Gerlach experiment shows that electron spin is exactly like this: only "up" or "down," never sideways.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Silver atom electron configuration:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Ag (Z = 47)" value="[Kr] 4d¹⁰ 5s¹" />
 <InfoRow label="4d¹⁰ subshell" value="Filled → L=0, S=0" />
 <InfoRow label="5s¹ electron" value="l=0, so mₗ=0" />
 <InfoRow label="Total angular momentum" value="Only spin: J = S = ½" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Predict number of beam spots:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="For J = ½: mⱼ = −½, +½" result="2 values" color={T.eo_core} />
 <CalcRow eq="Spots = 2J + 1 = 2(½) + 1" result="2 spots " color={T.eo_core} />
 <CalcRow eq="Hypothetical p-electron (l=1): mₗ = −1, 0, +1" result="3 spots" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 2-spot splitting confirmed that electrons have an intrinsic angular momentum (spin) with only two allowed orientations. Stern and Gerlach originally thought they were testing orbital angular momentum — they accidentally discovered spin! If they had used boron (2p¹ electron, l=1), they would have seen 2 spots from J=½ (due to spin-orbit coupling), not 3. The ms = ±½ quantum number was the missing piece needed to explain the periodic table.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Spin-Orbit Coupling — Sodium D-Line Doublet" color={T.eo_core} formula="ΔE = (α²Eₙ) / (n³ l(l+½)(l+1))">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Sodium's famous yellow "D-line" is actually a doublet: two closely spaced lines at 589.0 nm and 589.6 nm. This splitting occurs because the 3p electron's orbital angular momentum (l=1) couples with its spin (s=½), creating two total angular momentum states j=3/2 and j=1/2 with slightly different energies.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a figure skater (electron) spinning (spin angular momentum) while orbiting the rink (orbital angular momentum). When the two rotations align (j=3/2), the total is larger; when opposed (j=1/2), it's smaller. Each configuration has a slightly different energy, splitting one spectral line into two.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Identify the Quantum Numbers:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Sodium 3p state: n, l" value="n = 3, l = 1" />
 <InfoRow label="Spin s" value="½" />
 <InfoRow label="Possible j values" value="j = l+s = 3/2 and j = l−s = 1/2" />
 <InfoRow label="Fine structure constant α" value="1/137 ≈ 7.297 × 10⁻³" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate the Splitting:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E₃ = −13.6 / 9 = −1.511 eV (hydrogen-like)" result="" color={T.eo_core} />
 <CalcRow eq="Spin-orbit ΔE ≈ α² × |E₃| / (n³ × l(l+1))" result="" color={T.eo_core} />
 <CalcRow eq="≈ (5.325×10⁻⁵ × 1.511) / (27 × 2)" result="" color={T.eo_core} />
 <CalcRow eq="≈ 1.49×10⁻⁶ eV (order of magnitude)" result="" color={T.eo_core} />
 <CalcRow eq="Experimental Na D-line splitting" result="2.13 × 10⁻³ eV (0.6 nm)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The hydrogen-like estimate gives the right order of magnitude but underestimates the splitting because sodium's 3p electron experiences a much larger effective nuclear charge than hydrogen's. The actual splitting (2.1 meV, 0.6 nm) makes sodium vapor lamps produce that characteristic warm yellow glow. Spin-orbit coupling scales as Z⁴, so for heavy atoms like Pb or Bi in thermoelectric materials, the splitting reaches hundreds of meV and profoundly affects band structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Selection Rules — Which Transitions Are Allowed?" color={T.eo_core} formula="Δl = ±1, Δm_l = 0, ±1">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Not all quantum transitions are equally likely. Electric dipole selection rules dictate that the orbital quantum number must change by exactly 1 (Δl = ±1) and the magnetic quantum number by 0 or ±1. This explains why some spectral lines are bright (allowed) and others are absent (forbidden).
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine an elevator that only goes up or down one floor at a time for the "l" number. It can't skip floors (Δl ≠ ±2) and it can't stay on the same floor (Δl ≠ 0). This rule comes from the photon carrying exactly 1 unit of angular momentum.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — List All 3d Substates:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="3d state: n=3, l=2" value="m_l = −2, −1, 0, +1, +2" />
 <InfoRow label="Possible lower states" value="2p (n=2, l=1) or 2s (n=2, l=0)" />
 <InfoRow label="Selection rule: Δl = ±1" value="3d → 2p: Δl = −1 " />
 <InfoRow label="Selection rule: Δl = ±1" value="3d → 2s: Δl = −2 FORBIDDEN" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Count Allowed Transitions:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="3d (m_l=0) → 2p (m_l=0): Δm_l=0" result=" Allowed" color={T.eo_core} />
 <CalcRow eq="3d (m_l=0) → 2p (m_l=±1): Δm_l=±1" result=" Allowed" color={T.eo_core} />
 <CalcRow eq="3d (m_l=2) → 2p (m_l=0): Δm_l=−2" result=" Forbidden" color={T.eo_core} />
 <CalcRow eq="3d → 3s: Δl=−2" result=" Forbidden" color={T.eo_core} />
 <CalcRow eq="3d → 2p: Total allowed (with m_l constraint)" result="9 transitions" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Of all possible downward transitions from 3d, only 3d → 2p is allowed by the Δl = ±1 rule. The 3d → 2s and 3d → 3s transitions are forbidden because Δl = 2 and the photon cannot carry 2 units of angular momentum. In materials science, these rules determine which optical transitions are "bright" (allowed) vs "dark" (forbidden), which is critical for understanding photoluminescence in quantum dots and LED efficiency in semiconductor devices.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Zeeman Effect — Splitting in External Magnetic Field" color={T.eo_core} formula="ΔE = m_l × μ_B × B">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> When an atom is placed in an external magnetic field B, each energy level with orbital quantum number l splits into (2l+1) sublevels corresponding to different m_l values. The Zeeman effect was one of the first confirmations that m_l is a real, measurable quantum number.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a compass needle (electron's orbital magnetic moment) in a magnetic field. It can point with the field, against it, or at specific angles in between. Each orientation has a different energy, splitting one spectral line into a fan of closely spaced lines.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Define the Setup:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="External magnetic field B" value="1.0 T" />
 <InfoRow label="Bohr magneton μ_B" value="9.274 × 10⁻²⁴ J/T = 5.788 × 10⁻⁵ eV/T" />
 <InfoRow label="Consider p orbital (l = 1)" value="m_l = −1, 0, +1" />
 <InfoRow label="Thermal energy at 300 K" value="k_BT = 0.0259 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Zeeman Splitting:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔE per m_l step = μ_B × B = 5.788×10⁻⁵ × 1.0" result="5.79 × 10⁻⁵ eV" color={T.eo_core} />
 <CalcRow eq="Total splitting (m_l = −1 to +1) = 2 × ΔE" result="1.16 × 10⁻⁴ eV" color={T.eo_core} />
 <CalcRow eq="Compare: ΔE / k_BT = 5.79×10⁻⁵ / 0.0259" result="0.0022" color={T.eo_core} />
 <CalcRow eq="ΔE ≪ k_BT at 300 K" result="Splitting unresolved thermally" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At B = 1 T, the Zeeman splitting (58 μeV) is ~450× smaller than thermal energy at room temperature. This means magnetic effects on orbital energies are negligible for most material properties at room temperature. However, at cryogenic temperatures (below ~1 K, where k_BT ≈ 86 μeV), Zeeman splitting becomes resolvable. In MRI machines (1.5–3 T), the nuclear Zeeman effect on proton spins is what produces medical images. In semiconductor spintronics, engineering the Zeeman splitting of carriers is key to spin-based quantum computing.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Counting Electrons in the d-Block — Iron" color={T.eo_core} formula="Fe: [Ar]3d⁶4s² → 4 unpaired electrons">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Iron (Z=26) is ferromagnetic — the most important magnetic material in technology. Its magnetism arises from 4 unpaired 3d electrons. By carefully enumerating all quantum numbers for the 3d⁶ configuration, we can predict exactly how many electrons are unpaired and therefore how strong the magnetism is.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine 5 parking spots (d orbitals) and 6 cars (electrons). Hund's rule says: fill each spot with one car first (all facing the same way), then start doubling up. With 6 cars in 5 spots, you get 4 single-occupied spots (4 unpaired electrons) and 1 double-occupied spot.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Enumerate 3d Quantum Numbers:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Fe (Z=26) config" value="[Ar] 3d⁶ 4s²" />
 <InfoRow label="3d orbitals (l=2)" value="m_l = −2, −1, 0, +1, +2" />
 <InfoRow label="Hund's rule: fill singly first" value="↑ ↑ ↑ ↑ ↑ (5 electrons, all m_s=+½)" />
 <InfoRow label="6th electron pairs up" value="↑↓ ↑ ↑ ↑ ↑ (m_l=−2 gets paired)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Count Unpaired Electrons and Magnetic Moment:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Unpaired electrons = 5 (from d⁵) − 1 (paired by 6th)" result="4 unpaired" color={T.eo_core} />
 <CalcRow eq="Spin-only magnetic moment μ = √(n(n+2)) μ_B" result="" color={T.eo_core} />
 <CalcRow eq="μ = √(4 × 6) μ_B = √24 μ_B" result="4.90 μ_B" color={T.eo_core} />
 <CalcRow eq="Experimental moment of Fe²⁺" result="~5.4 μ_B (includes orbital)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Iron's 4 unpaired 3d electrons give it a large magnetic moment of ~4.9 μ_B per atom. When these moments align cooperatively (ferromagnetism below the Curie temperature of 770°C), iron becomes the strongest common magnet. The predicted spin-only moment (4.9 μ_B) is close to the experimental value (~5.4 μ_B), with the small difference due to orbital angular momentum contribution. This same counting exercise predicts that Mn (3d⁵) has 5 unpaired electrons, Co (3d⁷) has 3, and Ni (3d⁸) has 2 — exactly matching their measured magnetic moments.</div>
 </div>
 </NCard>

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
 ["H", 0, 0, 1, 2.20, 53, 13.60, 0.75],
 ["Li", 1, 0, 3, 0.98, 167, 5.39, 0.62],
 ["Be", 1, 1, 4, 1.57, 112, 9.32, -0.5],
 ["B", 1, 8, 5, 2.04, 87, 8.30, 0.28],
 ["C", 1, 9, 6, 2.55, 77, 11.26, 1.26],
 ["N", 1, 10, 7, 3.04, 75, 14.53, -0.07],
 ["O", 1, 11, 8, 3.44, 73, 13.62, 1.46],
 ["Na", 2, 0, 11, 0.93, 190, 5.14, 0.55],
 ["Mg", 2, 1, 12, 1.31, 145, 7.65, -0.4],
 ["Al", 2, 8, 13, 1.61, 118, 5.99, 0.43],
 ["Si", 2, 9, 14, 1.90, 111, 8.15, 1.39],
 ["P", 2, 10, 15, 2.19, 98, 10.49, 0.75],
 ["S", 2, 11, 16, 2.58, 88, 10.36, 2.08],
 ["K", 3, 0, 19, 0.82, 243, 4.34, 0.50],
 ["Ca", 3, 1, 20, 1.00, 194, 6.11, 0.02],
 ["Cu", 3, 6, 29, 1.90, 128, 7.73, 1.24],
 ["Zn", 3, 7, 30, 1.65, 134, 9.39, -0.6],
 ["Ga", 3, 8, 31, 1.81, 126, 5.99, 0.43],
 ["Ge", 3, 9, 32, 2.01, 122, 7.90, 1.23],
 ["As", 3, 10, 33, 2.18, 119, 9.79, 0.80],
 ["Se", 3, 11, 34, 2.55, 116, 9.75, 2.02],
 ["Ag", 4, 6, 47, 1.93, 144, 7.58, 1.30],
 ["Cd", 4, 7, 48, 1.69, 151, 8.99, -0.7],
 ["In", 4, 8, 49, 1.78, 167, 5.79, 0.30],
 ["Sn", 4, 9, 50, 1.96, 140, 7.34, 1.11],
 ["Sb", 4, 10, 51, 2.05, 140, 8.61, 1.05],
 ["Te", 4, 11, 52, 2.10, 143, 9.01, 1.97],
 ["Ba", 5, 1, 56, 0.89, 253, 5.21, 0.14],
 ["Hg", 5, 7, 80, 2.00, 151, 10.44, -0.5],
 ["Tl", 5, 8, 81, 1.62, 170, 6.11, 0.20],
 ["Pb", 5, 9, 82, 2.33, 175, 7.42, 0.36],
 ];

 const propConfig = {
 en: { label: "Electronegativity", idx: 4, unit: "(Pauling)", min: 0.8, max: 3.5 },
 radius: { label: "Atomic Radius", idx: 5, unit: "(pm)", min: 50, max: 260 },
 ie: { label: "Ionization Energy", idx: 6, unit: "(eV)", min: 4, max: 14 },
 ea: { label: "Electron Affinity", idx: 7, unit: "(eV)", min: -1, max: 2.5 },
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
 The periodic table shows patterns. Moving left to right, atoms get smaller and hold their electrons more tightly. Moving top to bottom, atoms get bigger and hold electrons more loosely. These patterns help us predict how atoms will connect with each other and what properties they will have.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* SVG */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
 {/* Title */}
 <text x={170} y={14} fontSize={12} fill={T.muted} textAnchor="middle" fontWeight="bold">
 {pc.label} Heatmap
 </text>

 {/* Column headers (group labels) */}
 {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((c) => (
 <text key={`ch-${c}`} x={offsetX + c * cellW + cellW / 2} y={offsetY + 8}
 fontSize={12} fill={T.dim} textAnchor="middle">
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
 fontSize={13} fill={T.ink} textAnchor="middle" dominantBaseline="middle"
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
 <text x={60} y={308} fontSize={13} fill={T.muted}>{pc.min.toFixed(1)}</text>
 <text x={280} y={308} fontSize={13} fill={T.muted} textAnchor="end">{pc.max.toFixed(1)}</text>
 <text x={170} y={308} fontSize={13} fill={T.muted} textAnchor="middle">{pc.unit}</text>

 {/* Trend arrows */}
 <g>
 <text x={310} y={offsetY + 30} fontSize={13} fill={T.eo_gap} textAnchor="middle">{"↓"}</text>
 <text x={170} y={offsetY + 168} fontSize={13} fill={T.eo_gap} textAnchor="middle">{"→"}</text>
 </g>
 </svg>
 </div>

 {/* RIGHT */}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <NCard title="Numerical Example: Predicting Bond Character of ZnTe from Periodic Trends" color={T.eo_core} formula="Δχ → % ionic character">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> ZnTe is a II-VI semiconductor used in solar cell back contacts. Is it ionic or covalent? We can predict its bond character from electronegativity differences using the Pauling scale, and compare with a clearly ionic compound (NaCl).
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a tug-of-war between two atoms pulling on shared electrons. If both pull equally (Δχ ≈ 0), the bond is pure covalent. If one side is much stronger (Δχ {">"} 1.7), the electron is essentially kidnapped — that's ionic bonding. ZnTe is somewhere in between — mostly covalent but with a slight electron shift toward Te.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Look up electronegativities (Pauling scale):</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="χ(Zn)" value="1.65" />
 <InfoRow label="χ(Te)" value="2.10" />
 <InfoRow label="Δχ(ZnTe) = |2.10 − 1.65|" value="0.45" />
 <InfoRow label="For comparison: χ(Na) = 0.93, χ(Cl) = 3.16" value="Δχ(NaCl) = 2.23" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Estimate percent ionic character:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="% ionic ≈ (1 − e^(−Δχ²/4)) × 100" result="" color={T.eo_core} />
 <CalcRow eq="ZnTe: (1 − e^(−0.45²/4)) × 100 = (1 − e^(−0.0506)) × 100" result="≈ 5%" color={T.eo_core} />
 <CalcRow eq="NaCl: (1 − e^(−2.23²/4)) × 100 = (1 − e^(−1.243)) × 100" result="≈ 71%" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ZnTe is ~95% covalent (only ~5% ionic character), which is why it crystallizes in the zinc blende structure with sp³ tetrahedral bonding — just like Si and GaAs. NaCl, with 71% ionic character, forms the rock salt structure instead. This covalent nature gives ZnTe its semiconductor properties: a direct bandgap of 2.26 eV, useful as a back contact layer in CdTe solar cells.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Ionization Energies Across Period 3 Using Slater's Rules" color={T.eo_core} formula="Z_eff = Z − σ">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Ionization energy generally increases across a period because nuclear charge increases while shielding doesn't fully compensate. Let's calculate the effective nuclear charge Z<sub>eff</sub> using Slater's rules for Na through Ar and explain the anomalies at Al and S.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine trying to pull a child away from a crowd around a candy jar (the nucleus). Each person in the crowd (inner electrons) partially blocks the child's view of the candy. Slater's rules quantify how much each "blocker" reduces the effective attraction. More blockers (shielding) = easier to pull the child away (lower IE).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 1 — Slater's rules for 3p electron of Si [Ne]3s²3p²:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Same group (3s,3p) contribute 0.35 each" value="3 × 0.35 = 1.05" />
 <InfoRow label="(2s,2p) shell contributes 0.85 each" value="8 × 0.85 = 6.80" />
 <InfoRow label="(1s) shell contributes 1.00 each" value="2 × 1.00 = 2.00" />
 <InfoRow label="Total shielding σ" value="1.05 + 6.80 + 2.00 = 9.85" />
 <InfoRow label="Z_eff(Si) = 14 − 9.85" value="4.15" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
 <strong style={{ color: T.ink }}>Step 2 — Z<sub>eff</sub> across Period 3:</strong>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Na (Z=11): Z_eff = 11 − 8.80 = 2.20" result="IE = 5.14 eV" color={T.eo_core} />
 <CalcRow eq="Mg (Z=12): Z_eff = 12 − 9.15 = 2.85" result="IE = 7.65 eV" color={T.eo_core} />
 <CalcRow eq="Al (Z=13): Z_eff = 13 − 9.50 = 3.50" result="IE = 5.99 eV ↓" color={T.eo_core} />
 <CalcRow eq="Si (Z=14): Z_eff = 14 − 9.85 = 4.15" result="IE = 8.15 eV" color={T.eo_core} />
 <CalcRow eq="P (Z=15): Z_eff = 15 − 10.20 = 4.80" result="IE = 10.49 eV" color={T.eo_core} />
 <CalcRow eq="S (Z=16): Z_eff = 16 − 10.55 = 5.45" result="IE = 10.36 eV ↓" color={T.eo_core} />
 <CalcRow eq="Cl (Z=17): Z_eff = 17 − 10.90 = 6.10" result="IE = 12.97 eV" color={T.eo_core} />
 <CalcRow eq="Ar (Z=18): Z_eff = 18 − 11.25 = 6.75" result="IE = 15.76 eV" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Two anomalies break the upward trend: (1) Al (5.99 eV) is lower than Mg (7.65 eV) because Al's outermost electron is in a higher-energy 3p orbital, easier to remove than Mg's 3s. (2) S (10.36 eV) is lower than P (10.49 eV) because S's 3p⁴ forces electron pairing, and the pair repulsion makes one electron easier to remove than from P's half-filled 3p³. These anomalies directly affect doping behavior in semiconductors.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Electron Affinity Trend — Why Cl > F" color={T.eo_core} formula="EA: F = 3.40 eV, Cl = 3.61 eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Electron affinity (EA) measures the energy released when a neutral atom gains one electron. Naively, smaller atoms should have higher EA because the added electron is closer to the nucleus. But fluorine (3.40 eV) has a lower EA than chlorine (3.61 eV) — a famous anomaly explained by electron-electron repulsion in the compact 2p shell.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine two apartment rooms — one tiny (F's 2p) and one medium (Cl's 3p). Both have 5 tenants and want to add a 6th. The tiny room is so cramped that the new tenant feels strong repulsion from the others, even though the landlord (nucleus) is strong. The medium room accommodates the 6th tenant more comfortably.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Compare F and Cl:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="F (Z=9): [He]2s²2p⁵" value="Small 2p orbital, high e⁻ density" />
 <InfoRow label="Cl (Z=17): [Ne]3s²3p⁵" value="Larger 3p orbital, less crowding" />
 <InfoRow label="F atomic radius" value="64 pm (very compact)" />
 <InfoRow label="Cl atomic radius" value="99 pm (more spacious)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Analyze the Energy Balance:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="F: Nuclear attraction for added e⁻" result="Strong (small r)" color={T.eo_core} />
 <CalcRow eq="F: Electron-electron repulsion in 2p" result="Very strong (compact shell)" color={T.eo_core} />
 <CalcRow eq="F: Net EA = attraction − repulsion" result="3.40 eV" color={T.eo_core} />
 <CalcRow eq="Cl: Repulsion weaker (larger 3p shell)" result="" color={T.eo_core} />
 <CalcRow eq="Cl: Net EA = attraction − repulsion" result="3.61 eV > F!" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Chlorine has the highest electron affinity of all elements (3.61 eV) because it strikes the optimal balance between nuclear attraction and electron repulsion. This is why Cl is a better oxidizing agent in solution than F (despite F having higher electronegativity). For materials science, high EA elements like Cl and Br are used as etchants in semiconductor processing — they eagerly grab electrons from surface atoms, breaking bonds and volatilizing the products.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Lattice Constant from Atomic Radii — Si vs Ge vs Sn" color={T.eo_core} formula="a = 8r / √3 (diamond cubic)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Silicon, germanium, and tin (gray, α-Sn) all adopt the diamond cubic structure. The lattice constant a can be predicted from covalent radii because nearest neighbors touch along the body diagonal. This simple geometric relationship connects atomic-scale radii (a periodic trend) to measurable crystal parameters.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In the diamond cubic structure, atoms form a tetrahedral network. The bond length d equals twice the covalent radius. Four bond lengths fit along the cube's body diagonal (length a√3), giving us d = a√3/4, or a = 4d/√3 = 8r/√3.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Look Up Covalent Radii:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Si covalent radius" value="117 pm" />
 <InfoRow label="Ge covalent radius" value="122 pm" />
 <InfoRow label="α-Sn covalent radius" value="140 pm" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Lattice Constants:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Si: a = 8 × 117 / √3 = 936 / 1.732" result="540 pm (expt: 543 pm)" color={T.eo_core} />
 <CalcRow eq="Ge: a = 8 × 122 / √3 = 976 / 1.732" result="564 pm (expt: 566 pm)" color={T.eo_core} />
 <CalcRow eq="α-Sn: a = 8 × 140 / √3 = 1120 / 1.732" result="647 pm (expt: 649 pm)" color={T.eo_core} />
 <CalcRow eq="Agreement within" result="< 1% for all three!" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The predicted lattice constants agree with experiment to within 1% — remarkable for such a simple model. The trend Si {"<"} Ge {"<"} Sn follows the increase in atomic radius down Group IVA. This matters enormously for heteroepitaxy: growing Ge on Si creates 4.2% lattice mismatch strain, which can be exploited to engineer band gaps in SiGe alloys for high-speed transistors, or accommodated with graded buffer layers in multijunction solar cells.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Polarizability and Dielectric Constant Across Period 3" color={T.eo_core} formula="(ε−1)/(ε+2) = Nα / (3ε₀) (Clausius-Mossotti)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Atomic polarizability — how easily the electron cloud deforms in an electric field — increases with atomic size (a periodic trend). Through the Clausius-Mossotti relation, this microscopic property determines the macroscopic dielectric constant, which controls capacitance, optical refraction, and insulation in electronic devices.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine each atom as a water balloon. A small, tightly filled balloon (small atom) is hard to deform. A large, loosely filled balloon (large atom) squishes easily in an electric field. Pack many squishy balloons together and the whole material becomes highly polarizable — a high dielectric constant.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Silicon Parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Si electronic polarizability α" value="5.38 × 10⁻³⁰ m³ (≈ 5.38 ų)" />
 <InfoRow label="Si atomic density N" value="5.0 × 10²⁸ atoms/m³" />
 <InfoRow label="ε₀" value="8.854 × 10⁻¹² F/m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Apply Clausius-Mossotti:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Nα/(3ε₀) = (5.0×10²⁸ × 5.38×10⁻³⁰) / (3 × 8.854×10⁻¹²)" result="" color={T.eo_core} />
 <CalcRow eq="= 0.269 / 2.656×10⁻¹¹ = ...wait, use CGS:" result="" color={T.eo_core} />
 <CalcRow eq="Nα/(3) = 5.0×10²⁸ × 5.38×10⁻³⁰ / 3 = 0.897" result="" color={T.eo_core} />
 <CalcRow eq="(ε−1)/(ε+2) = 0.897 → ε − 1 = 0.897ε + 1.794" result="" color={T.eo_core} />
 <CalcRow eq="0.103ε = 2.794 → ε" result="≈ 11.7 (expt: 11.68)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Clausius-Mossotti relation predicts Si's dielectric constant of 11.7 almost exactly from just atomic polarizability and density. Going down Group IVA: C (diamond, ε=5.7), Si (ε=11.7), Ge (ε=16.2) — the dielectric constant increases with atomic radius because larger atoms are more polarizable. This trend directly affects semiconductor device design: higher ε means more capacitance per area, which is why Ge-based devices can achieve higher gate capacitance than Si at the same thickness.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Effective Nuclear Charge and Core-Level Binding Energies" color={T.eo_core} formula="Z_eff(1s) ≈ Z − σ(1s)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> X-ray photoelectron spectroscopy (XPS) measures the binding energy of core electrons. The 1s binding energy increases dramatically with atomic number because the 1s electron sees almost the full nuclear charge. Using Slater's rules for the 1s shell, we can predict these core-level energies for C, Si, and Ge.
 </div>
 <div style={{ background: T.eo_core + "06", border: `1px solid ${T.eo_core}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_core, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 1s electron sits right next to the nucleus, like a front-row seat at a concert. No matter how many people (electrons) fill the seats behind it, it hears the full sound (nuclear charge) with only minor interference from the one other person sharing its row (the other 1s electron).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Calculate Z<sub>eff</sub> for 1s Electrons:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Slater σ for 1s-1s pair" value="0.30" />
 <InfoRow label="C (Z=6): Z_eff(1s)" value="6 − 0.30 = 5.70" />
 <InfoRow label="Si (Z=14): Z_eff(1s)" value="14 − 0.30 = 13.70" />
 <InfoRow label="Ge (Z=32): Z_eff(1s)" value="32 − 0.30 = 31.70" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Predict 1s Binding Energies:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="BE(1s) ≈ 13.6 × Z_eff² eV (hydrogen-like)" result="" color={T.eo_core} />
 <CalcRow eq="C: BE = 13.6 × 5.70² = 442 eV" result="(XPS: 284 eV)" color={T.eo_core} />
 <CalcRow eq="Si: BE = 13.6 × 13.70² = 2553 eV" result="(XPS: 1839 eV)" color={T.eo_core} />
 <CalcRow eq="Ge: BE = 13.6 × 31.70² = 13,666 eV" result="(XPS: 11,103 eV)" color={T.eo_core} />
 </div>
 <div style={{ background: T.eo_core + "08", border: `1px solid ${T.eo_core}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_core, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The simple Z<sub>eff</sub> model correctly predicts that 1s binding energies scale roughly as Z² and captures the right order of magnitude. The systematic overestimate occurs because our formula ignores electron-electron correlation and relativistic effects (important for Ge). XPS exploits these element-specific binding energies for chemical identification: each element has unique core-level "fingerprints." In thin-film analysis, XPS can determine not just which elements are present but their oxidation states, since chemical bonding shifts core levels by 1–5 eV.</div>
 </div>
 </NCard>

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
 An atom has a tiny, heavy center (nucleus) and electrons around it. The electrons do not move in neat circles. Instead, they exist as clouds {"—"} some areas are more likely to have the electron than others. Think of it like a blurry photo: you know roughly where the electron is, but not exactly.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 <svg viewBox="0 0 320 320" style={{ flex: "0 0 320px", width: "100%", maxWidth: 352 }}>
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
 <text x={cx} y={cy + 10} textAnchor="middle" fill={T.muted} fontSize={12}>Z={a.Z}</text>
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
 fontSize={13} fontWeight={i === a.shells.length - 1 ? 700 : 400}>
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
 Atoms connect in different ways. Sometimes one atom gives an electron to another (ionic bond, like salt). Sometimes they share electrons equally (covalent bond, like diamond). Sometimes many atoms put their electrons in a shared pool (metallic bond, like copper). The way atoms share decides what the material is like.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ width: 340, maxWidth: 374, flexShrink: 0 }}>
 <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
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
 <text x={170} y={170} textAnchor="middle" fontSize={13} fill={T.muted}>Equal sharing</text>
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
 <text x={170} y={168} textAnchor="middle" fontSize={13} fill={T.muted}>Dipole moment</text>
 </>)}

 {/* === IONIC === */}
 {bondType === "Ionic" && (<>
 <line x1={140} y1={120} x2={190} y2={120} stroke={T.eo_gap} strokeWidth={2} strokeDasharray="6,3" markerEnd="url(#arrowIonic)" />
 <line x1={200} y1={120} x2={150} y2={120} stroke={T.eo_gap} strokeWidth={2} strokeDasharray="6,3" markerEnd="url(#arrowIonic)" />
 <text x={170} y={112} textAnchor="middle" fontSize={12} fill={T.eo_gap}>Coulomb</text>
 <circle cx={100} cy={120} r={20} fill={T.eo_hole} opacity={0.85} />
 <text x={100} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Na</text>
 <text x={100} y={90} textAnchor="middle" fontSize={18} fontWeight={700} fill={T.eo_hole}>+</text>
 <circle cx={240} cy={120} r={36} fill={T.eo_e} opacity={0.75} />
 <text x={240} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">Cl</text>
 <text x={240} y={82} textAnchor="middle" fontSize={18} fontWeight={700} fill={T.eo_e}>{"−"}</text>
 <circle cx={240 + 10 * Math.sin(frame * 0.15)} cy={95 + 6 * Math.cos(frame * 0.2)} r={5 * pulse} fill={T.eo_e} opacity={0.6} />
 <text x={240 + 10 * Math.sin(frame * 0.15)} y={95 + 6 * Math.cos(frame * 0.2) - 8} textAnchor="middle" fontSize={12} fill={T.muted}>{"e⁻"}</text>
 <text x={170} y={170} textAnchor="middle" fontSize={13} fill={T.muted}>Complete electron transfer</text>
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
 <text x={ax} y={115} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">Cu</text>
 <text x={ax} y={90} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_core}>+</text>
 </g>
 ))}
 {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
 const ex = 60 + ((i * 31 + frame * 1.5) % 220);
 const ey = 135 + 10 * Math.sin(frame * 0.08 + i * 1.2);
 return <circle key={i} cx={ex} cy={ey} r={3.5} fill={T.eo_e} opacity={0.7} />;
 })}
 <text x={170} y={80} textAnchor="middle" fontSize={13} fill={T.muted}>Positive ion cores</text>
 <text x={170} y={178} textAnchor="middle" fontSize={13} fill={T.eo_e}>Delocalized electron sea</text>
 </>);
 })()}

 {/* === VAN DER WAALS === */}
 {bondType === "Van der Waals" && (() => {
 const dipoleShift = 3 * Math.sin(frame * 0.08);
 return (<>
 <circle cx={80} cy={115} r={20} fill={T.eo_valence} opacity={0.8} />
 <circle cx={120} cy={115} r={20} fill={T.eo_core} opacity={0.8} />
 <line x1={95} y1={115} x2={105} y2={115} stroke="#fff" strokeWidth={3} />
 <text x={80} y={119} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">H</text>
 <text x={120} y={119} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">Cl</text>
 <text x={80} y={95} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_hole} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ+"}</text>
 <text x={120} y={95} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_e} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ−"}</text>
 <ellipse cx={100 + dipoleShift} cy={115} rx={30 * pulse} ry={18 * pulse} fill={T.eo_e} opacity={0.1} stroke={T.eo_e} strokeWidth={0.8} strokeDasharray="3,3" />
 <line x1={142} y1={115} x2={198} y2={115} stroke={T.muted} strokeWidth={1.5} strokeDasharray="3,4" opacity={0.5 + 0.3 * Math.sin(frame * 0.06)} />
 <text x={170} y={108} textAnchor="middle" fontSize={12} fill={T.dim}>weak</text>
 <circle cx={220} cy={115} r={20} fill={T.eo_valence} opacity={0.8} />
 <circle cx={260} cy={115} r={20} fill={T.eo_core} opacity={0.8} />
 <line x1={235} y1={115} x2={245} y2={115} stroke="#fff" strokeWidth={3} />
 <text x={220} y={119} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">H</text>
 <text x={260} y={119} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">Cl</text>
 <text x={220} y={95} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_e} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ−"}</text>
 <text x={260} y={95} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_hole} opacity={0.5 + 0.3 * Math.sin(frame * 0.08)}>{"δ+"}</text>
 <ellipse cx={240 - dipoleShift} cy={115} rx={30 * pulse} ry={18 * pulse} fill={T.eo_e} opacity={0.1} stroke={T.eo_e} strokeWidth={0.8} strokeDasharray="3,3" />
 <text x={170} y={155} textAnchor="middle" fontSize={13} fill={T.muted}>Fluctuating dipoles induce attraction</text>
 </>);
 })()}

 {/* Bond energy diagram */}
 <text x={20} y={200} fontSize={13} fontWeight={600} fill={T.ink}>
 Bond Energy Diagram
 </text>
 <line x1={40} y1={210} x2={40} y2={300} stroke={T.muted} strokeWidth={1} />
 <line x1={40} y1={300} x2={310} y2={300} stroke={T.muted} strokeWidth={1} />
 <text x={15} y={255} fontSize={13} fill={T.muted} transform="rotate(-90,15,255)">
 E (eV)
 </text>
 <text x={175} y={315} fontSize={13} fill={T.muted} textAnchor="middle">
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

 <text x={100} y={295} fontSize={13} fill={T.eo_gap}>
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

 <div style={{ background: "#7c3aed0a", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
 <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
 ZnTe has Dc ~ 0.6 -- polar covalent. This partial ionicity affects defect formation energies
 and is why compound semiconductors have different native defect landscapes than elemental Si.
 </div>
 </div>

 <NCard title="Numerical Example: Lattice Energy of NaCl" color={T.eo_valence} formula="U = -(N_A M z⁺ z⁻ e²)/(4πε₀ r₀) × (1 − 1/n)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The Born-Landé equation predicts the total electrostatic energy holding an ionic crystal together. For NaCl, we use the known Madelung constant, interionic distance, and Born exponent to calculate the lattice energy and compare with experiment.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Picture a city grid where every other building is positively or negatively charged. The Madelung constant captures the net attraction from all those neighbors — some attract, some repel, but the sum converges to a positive number (M = 1.748 for NaCl), meaning attraction wins. The Born repulsion term (1 − 1/n) is a small correction for electron cloud overlap at short range.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather constants:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Madelung constant M" value="1.748 (NaCl structure)" />
 <InfoRow label="Interionic distance r₀" value="2.81 Å = 2.81 × 10⁻¹⁰ m" />
 <InfoRow label="Born exponent n" value="8 (for Na⁺/Cl⁻ electron configs)" />
 <InfoRow label="z⁺, z⁻" value="+1, −1" />
 <InfoRow label="e²/(4πε₀)" value="1.389 eV·nm = 2.307 × 10⁻²⁸ J·m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate lattice energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="U = -(N_A × M × e²)/(4πε₀ r₀) × (1 − 1/n)" result="" color={T.eo_valence} />
 <CalcRow eq="Coulomb term = (6.022×10²³)(1.748)(2.307×10⁻²⁸) / (2.81×10⁻¹⁰)" result="" color={T.eo_valence} />
 <CalcRow eq="= 8.64 × 10⁵ J/mol = 864 kJ/mol" result="" color={T.eo_valence} />
 <CalcRow eq="Born correction: × (1 − 1/8) = × 0.875" result="" color={T.eo_valence} />
 <CalcRow eq="U = −864 × 0.875" result="≈ −756 kJ/mol" color={T.eo_valence} />
 <CalcRow eq="Experimental value" result="−786 kJ/mol" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Our calculated −756 kJ/mol is within 4% of the experimental −786 kJ/mol. The remaining error comes from van der Waals attractions and zero-point energy that the simple Born-Landé model neglects. The large magnitude (~8 eV per ion pair) explains why ionic crystals have high melting points and are mechanically hard.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Bond Polarity in ZnTe vs GaAs" color={T.eo_valence} formula="Δχ and % ionic character">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> How do we quantify whether a bond is more ionic or covalent? The Pauling electronegativity difference Δχ determines the percent ionic character and the bond dipole moment. We compare two important semiconductors: ZnTe and GaAs.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Electronegativity is like a tug-of-war score. When two atoms pull on shared electrons, the one with higher χ wins more electron density. The bigger the mismatch, the more the bond looks like an ionic bond rather than a fair 50-50 sharing.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Electronegativity values (Pauling scale):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Zn" value="χ = 1.65" />
 <InfoRow label="Te" value="χ = 2.10" />
 <InfoRow label="Δχ (ZnTe)" value="|2.10 − 1.65| = 0.45" />
 <InfoRow label="Ga" value="χ = 1.81" />
 <InfoRow label="As" value="χ = 2.18" />
 <InfoRow label="Δχ (GaAs)" value="|2.18 − 1.81| = 0.37" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate percent ionic character:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Pauling formula: % ionic = 100 × (1 − e^(−Δχ²/4))" result="" color={T.eo_valence} />
 <CalcRow eq="ZnTe: 100 × (1 − e^(−0.45²/4)) = 100 × (1 − e^(−0.0506))" result="" color={T.eo_valence} />
 <CalcRow eq="ZnTe % ionic" result="≈ 4.9%" color={T.eo_valence} />
 <CalcRow eq="GaAs: 100 × (1 − e^(−0.37²/4)) = 100 × (1 − e^(−0.0342))" result="" color={T.eo_valence} />
 <CalcRow eq="GaAs % ionic" result="≈ 3.4%" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ZnTe (Δχ = 0.45, ~5% ionic) is slightly more polar than GaAs (Δχ = 0.37, ~3.4% ionic). Both are predominantly covalent, but ZnTe{"'"}s extra polarity affects its defect chemistry: native point defects like V_Zn (zinc vacancies) carry effective charges that are influenced by this ionic component. This is why II-VI compounds generally have more complex defect landscapes than III-V semiconductors.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Coulomb Energy of an Ion Pair — Na⁺Cl⁻" color={T.eo_valence} formula="E = −kq²/r">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Before tackling an entire crystal, let us calculate the electrostatic energy of a single Na⁺Cl⁻ ion pair separated by their equilibrium distance. This gives the fundamental building block of ionic bonding energy.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Two opposite charges attract like magnets snapping together. The closer they get, the stronger the pull. The Coulomb energy tells us how much energy was released when the pair came together from infinity — like measuring how hard the magnets slammed.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Charge on Na⁺" value="q = +1.602 × 10⁻¹⁹ C" />
 <InfoRow label="Charge on Cl⁻" value="q = −1.602 × 10⁻¹⁹ C" />
 <InfoRow label="Equilibrium separation" value="r = 2.81 Å = 2.81 × 10⁻¹⁰ m" />
 <InfoRow label="Coulomb constant k" value="8.988 × 10⁹ N·m²/C²" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate Coulomb energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E = −kq²/r = −(8.988×10⁹)(1.602×10⁻¹⁹)² / (2.81×10⁻¹⁰)" result="" color={T.eo_valence} />
 <CalcRow eq="E = −(8.988×10⁹)(2.566×10⁻³⁸) / (2.81×10⁻¹⁰)" result="" color={T.eo_valence} />
 <CalcRow eq="E = −8.20 × 10⁻¹⁹ J" result="= −5.12 eV" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A single Na⁺Cl⁻ pair releases 5.12 eV of electrostatic energy. The NaCl crystal lattice energy is 7.86 eV per pair — much larger because the Madelung sum includes all neighbors. The single-pair result captures about 65% of the total, showing that nearest-neighbor attraction dominates but long-range interactions contribute significantly.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Born-Haber Cycle for MgO" color={T.eo_valence} formula="ΔH_f = sum of thermochemical steps">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The Born-Haber cycle breaks MgO formation into measurable steps: sublimation, ionization, dissociation, electron affinity, and lattice energy. By summing all steps we verify ΔH_f = −602 kJ/mol.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Building MgO from elements is like assembling furniture. You cannot measure the total effort in one step, but you can break it into pieces: unwrap parts (sublimation), reshape them (ionization), cut raw material (dissociation), snap pieces together (electron affinity), and assemble the structure (lattice energy). The total effort is the sum of all steps.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- List all thermochemical steps:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Sublimation of Mg(s)" value="ΔH_sub = +148 kJ/mol" />
 <InfoRow label="IE₁ + IE₂ of Mg" value="738 + 1451 = +2189 kJ/mol" />
 <InfoRow label="½ O₂ dissociation" value="½ × 498 = +249 kJ/mol" />
 <InfoRow label="EA₁ + EA₂ of O" value="−141 + (+744) = +603 kJ/mol" />
 <InfoRow label="Lattice energy U(MgO)" value="−3791 kJ/mol" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Sum the cycle:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔH_f = 148 + 2189 + 249 + 603 + (−3791)" result="" color={T.eo_valence} />
 <CalcRow eq="ΔH_f = 3189 − 3791" result="" color={T.eo_valence} />
 <CalcRow eq="ΔH_f" result="= −602 kJ/mol " color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The cycle closes perfectly at −602 kJ/mol, matching experiment. The enormous lattice energy (−3791 kJ/mol) dwarfs NaCl{"'"}s −786 kJ/mol because Mg²⁺ and O²⁻ carry double charges and sit closer together (2.11 vs 2.81 Å). This is why MgO melts at 2852°C, one of the highest melting points of any oxide.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Metallic Bond — Cohesive Energy of Copper" color={T.eo_valence} formula="E_coh ≈ (3/5)E_F per electron">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In the free-electron model, conduction electrons fill states up to the Fermi energy. The average kinetic energy per electron is (3/5)E_F. We estimate the cohesive energy of copper and compare with the experimental value.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Metallic bonding is like a communal pool — each copper atom donates one electron to a shared sea. The electrons zoom around with kinetic energy up to E_F. The average energy of this electron gas gives a rough estimate of how tightly the metal is held together.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Parameters for copper:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Fermi energy of Cu" value="E_F = 7.04 eV" />
 <InfoRow label="Valence electrons per atom" value="1" />
 <InfoRow label="Average KE per electron" value="⟨E⟩ = (3/5) × E_F" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate cohesive energy estimate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="⟨E⟩ = (3/5) × 7.04 eV" result="= 4.22 eV" color={T.eo_valence} />
 <CalcRow eq="Experimental cohesive energy of Cu" result="= 3.49 eV/atom" color={T.eo_valence} />
 <CalcRow eq="Overestimate: 4.22 / 3.49" result="≈ 1.21 (21% high)" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The free-electron estimate overshoots by ~21% because it ignores electron-ion attraction and correlation. Still, it captures the right order of magnitude and explains why metals with higher E_F (like tungsten, 9.2 eV) tend to have higher melting points. The non-directional electron sea also explains metallic ductility — planes slide without breaking directional bonds.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Hydrogen Bond Strength — Water vs Ice" color={T.eo_valence} formula="E_H-bond ≈ 0.25 eV">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Hydrogen bonds hold water molecules together in ice. Each molecule forms ~4 H-bonds. We estimate the energy to break all H-bonds in one mole of ice and compare with the experimental enthalpy of fusion ΔH_fus = 6.01 kJ/mol.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Ice is like a Lego structure where each brick connects to 4 neighbors with weak clips (H-bonds). Melting does not break all the clips — it only breaks enough to let bricks move around. That is why the heat of fusion is much less than the total H-bond energy.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- H-bond parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="H-bond energy" value="~0.25 eV ≈ 24.1 kJ/mol" />
 <InfoRow label="H-bonds per molecule in ice" value="4 (each shared by 2 molecules → 2 per molecule)" />
 <InfoRow label="Total H-bond energy per mole" value="2 × 24.1 = 48.2 kJ/mol" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Compare with enthalpy of fusion:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔH_fus (experimental)" result="= 6.01 kJ/mol" color={T.eo_valence} />
 <CalcRow eq="Fraction of H-bonds broken: 6.01 / 48.2" result="≈ 12.5%" color={T.eo_valence} />
 <CalcRow eq="H-bonds remaining in liquid water" result="≈ 87.5%" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Melting ice only breaks ~12.5% of hydrogen bonds. Liquid water retains most of its H-bond network — it is a highly structured liquid. This explains water{"'"}s anomalously high heat capacity and boiling point. For comparison, covalent bonds (~3-4 eV) are 12-16x stronger than H-bonds, which is why covalent solids like diamond melt at much higher temperatures.</div>
 </div>
 </NCard>


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
 When atoms form bonds, they sometimes mix their different-shaped spaces into new, equal-shaped spaces. For example, carbon can mix one round and three dumbbell spaces to make four equal spaces pointing to the corners of a triangle shape. This mixing lets atoms form stronger and more even bonds.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 340 340" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
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
 <text x={ex + Math.cos(rad) * 12} y={ey + Math.sin(rad) * 12} textAnchor="middle" fontSize={13} fill={data.colors[i]}>
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
 <text x={ctrX + 35} y={ctrY - 5} fontSize={12} fill={T.eo_gap} fontWeight={600}>
 {data.angle}
 </text>
 )}

 {/* Geometry label */}
 <text x={170} y={330} textAnchor="middle" fontSize={13} fill={T.muted}>
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
 background: (t === "sp" && hybridType === "sp") || (t === "sp²" && hybridType === "sp2") || (t === "sp³" && hybridType === "sp3") ? "#7c3aed08" : "transparent",
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

 <div style={{ background: "#7c3aed0a", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
 <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
 sp{"³"} hybridization is WHY zincblende semiconductors (ZnTe, CdTe, GaAs, CZTS) form
 tetrahedral crystal structures. Each atom forms 4 equivalent bonds at 109.5 degrees.
 </div>
 </div>

 <NCard title="Numerical Example: sp³ Hybridization in Diamond and Silicon" color={T.eo_valence} formula="cos⁻¹(−1/3) = 109.47°">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In sp³ hybridization, one s and three p orbitals mix to form four equivalent hybrid orbitals pointing toward the corners of a tetrahedron. We calculate the exact bond angle, then use lattice constants to find bond lengths in diamond and silicon.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine inflating four identical balloons tied at a central knot. They naturally push apart to maximize space, settling at exactly 109.47° apart — the tetrahedral angle. This is why diamond and silicon both form the same geometry despite being very different materials.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate the tetrahedral bond angle:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Four equivalent sp³ orbitals" value="pointing to tetrahedron vertices" />
 <InfoRow label="Dot product of two bond vectors" value="−⅓" />
 <InfoRow label="θ = cos⁻¹(−1/3)" value="= 109.47°" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate bond lengths from lattice constants:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bond length = a√3 / 4" result="" color={T.eo_valence} />
 <CalcRow eq="Diamond: a = 3.567 Å" result="" color={T.eo_valence} />
 <CalcRow eq="d_C–C = 3.567 × 1.732 / 4" result="= 1.545 Å" color={T.eo_valence} />
 <CalcRow eq="Silicon: a = 5.431 Å" result="" color={T.eo_valence} />
 <CalcRow eq="d_Si–Si = 5.431 × 1.732 / 4" result="= 2.352 Å" color={T.eo_valence} />
 <CalcRow eq="Ratio: d_Si / d_C = 2.352 / 1.545" result="= 1.52" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Both diamond and silicon have perfect tetrahedral sp³ bonding at 109.47°, but Si bonds are 52% longer. Longer bonds mean weaker overlap, which is why silicon{"'"}s band gap (1.12 eV) is much smaller than diamond{"'"}s (5.47 eV). The geometry is identical; the physics changes because of atomic size.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: sp² in Graphene" color={T.eo_valence} formula="a = √3 × d_CC = 2.46 Å">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In graphene, each carbon uses sp² hybridization to form three in-plane σ bonds at 120°, leaving one unhybridized p_z orbital perpendicular to the plane. We calculate the lattice constant from the C–C bond length and explain how the leftover p_z orbital creates the π band.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Think of graphene as a honeycomb tile floor. Each tile vertex connects to exactly three neighbors at 120°. The sp² bonds are the strong grout holding tiles together. But each carbon also has an electron sticking straight up (the p_z orbital) — these overlap sideways across the entire sheet, creating a highway for electron flow. That is why graphene is such an extraordinary conductor.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Bond geometry:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="C–C bond length in graphene" value="d = 1.42 Å" />
 <InfoRow label="Bond angle (sp²)" value="120° exactly" />
 <InfoRow label="Atoms per unit cell" value="2 (honeycomb has 2-atom basis)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate lattice constant and nearest-neighbor geometry:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Hexagonal lattice: a = √3 × d_CC" result="" color={T.eo_valence} />
 <CalcRow eq="a = 1.732 × 1.42" result="= 2.46 Å" color={T.eo_valence} />
 <CalcRow eq="Nearest-neighbor distance" result="= 1.42 Å (= d_CC)" color={T.eo_valence} />
 <CalcRow eq="Next-nearest neighbor = a" result="= 2.46 Å" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 1.42 Å C–C bond in graphene is shorter than diamond{"'"}s 1.54 Å because sp² bonds (33% s-character) overlap more strongly than sp³ (25% s-character). The unhybridized p_z orbitals overlap laterally across the entire sheet, forming a delocalized π band. At the K point of the Brillouin zone, these π and π* bands touch in a single point — making graphene a zero-gap semiconductor with linear (Dirac) dispersion.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: sp³d² in SF₆ — Octahedral Geometry" color={T.eo_valence} formula="6 equivalent hybrid orbitals at 90°">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Sulfur hexafluoride uses sp³d² hybridization to form 6 equivalent bonds pointing to the vertices of an octahedron. We verify the geometry and calculate the S–F bond length.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine you are holding 6 balloons tied at one point. They naturally push apart to form an octahedron — three pairs at 90° to each other. That is exactly what 6 equivalent hybrid orbitals do around sulfur.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Orbital accounting:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="S ground state" value="[Ne] 3s² 3p⁴" />
 <InfoRow label="S promoted state" value="3s¹ 3p³ 3d²" />
 <InfoRow label="Hybrid type" value="sp³d² → 6 equivalent orbitals" />
 <InfoRow label="Bond angles" value="90° between adjacent bonds" />
 <InfoRow label="Experimental S–F bond length" value="1.56 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Verify geometry:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Octahedron: 6 vertices, 12 edges, 8 faces" result="" color={T.eo_valence} />
 <CalcRow eq="Angle between adjacent vertices" result="= 90° " color={T.eo_valence} />
 <CalcRow eq="Angle between opposite vertices" result="= 180° " color={T.eo_valence} />
 <CalcRow eq="Sum of covalent radii: r_S + r_F = 1.02 + 0.64" result="= 1.66 Å" color={T.eo_valence} />
 <CalcRow eq="Actual bond length shorter due to ionic character" result="= 1.56 Å" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The S–F bonds are 6% shorter than the sum of covalent radii because of partial ionic character (F is highly electronegative). The perfect octahedral symmetry (O_h point group) makes SF₆ remarkably stable and chemically inert — it is used as an insulating gas in high-voltage equipment. Expanded octets like this are impossible for period-2 elements (no d orbitals available).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: GaAs — sp³ Bonding with Partially Ionic Character" color={T.eo_valence} formula="d = r_Ga + r_As, a = 4d/√3">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> GaAs uses sp³ hybridization like diamond, but with two different atoms. We calculate the bond length from covalent radii, predict the lattice constant, and compare with the experimental value a = 5.653 Å.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>GaAs is like diamond but with alternating colored marbles — Ga and As take turns at each tetrahedral site. Both atoms use sp³ hybrids, but since Ga and As have different sizes and electronegativities, the electron sharing is not perfectly equal.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Bond length from covalent radii:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Covalent radius of Ga" value="r_Ga = 1.26 Å" />
 <InfoRow label="Covalent radius of As" value="r_As = 1.19 Å" />
 <InfoRow label="Predicted bond length" value="d = 1.26 + 1.19 = 2.45 Å" />
 <InfoRow label="Experimental bond length" value="d = 2.448 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate lattice constant:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Zinc blende: a = 4d / √3" result="" color={T.eo_valence} />
 <CalcRow eq="a = 4 × 2.45 / 1.732" result="= 5.658 Å" color={T.eo_valence} />
 <CalcRow eq="Experimental a" result="= 5.653 Å" color={T.eo_valence} />
 <CalcRow eq="Error" result="= 0.09% " color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The prediction is excellent (0.09% error) because GaAs is predominantly covalent (Δχ = 0.37, only ~3.4% ionic). The sp³ tetrahedral geometry is nearly perfect. GaAs{"'"}s direct band gap of 1.42 eV makes it ideal for LEDs and solar cells — a direct consequence of the orbital symmetry at the Γ point in its zinc blende structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Vsepr vs Hybridization — NH₃ and H₂O Bond Angles" color={T.eo_valence} formula="Ideal sp³ = 109.5° → reduced by lone pairs">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> NH₃ and H₂O both use sp³ hybridization, but their bond angles differ from the ideal 109.5° because lone pairs occupy more angular space than bonding pairs. We quantify the deviation.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine 4 balloons tied together — they form a perfect tetrahedron. Now replace one balloon with a fatter one (a lone pair). The fat balloon pushes the others closer together, reducing the angle. Replace two balloons with fat ones, and the squeezing is even more pronounced.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Compare geometries:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="CH₄ (0 lone pairs)" value="Bond angle = 109.5° (ideal sp³)" />
 <InfoRow label="NH₃ (1 lone pair)" value="Bond angle = 107.3°" />
 <InfoRow label="H₂O (2 lone pairs)" value="Bond angle = 104.5°" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate deviations:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="NH₃ deviation = 109.5° − 107.3°" result="= −2.2° per lone pair" color={T.eo_valence} />
 <CalcRow eq="H₂O deviation = 109.5° − 104.5°" result="= −5.0° for 2 lone pairs" color={T.eo_valence} />
 <CalcRow eq="Per-lone-pair compression in H₂O" result="= −2.5° each" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each lone pair compresses bond angles by about 2.2–2.5°. This matters in semiconductors: when dopant atoms substitute into a lattice, their different number of valence electrons creates lone-pair-like states that distort local geometry. Understanding these distortions is key to predicting defect energy levels.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Promotion Energy — Why Carbon Hybridizes but Beryllium Prefers sp" color={T.eo_valence} formula="E_promo vs bond energy gain">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Carbon promotes an electron from 2s to 2p (costing energy) to form four sp³ bonds instead of two. We check whether the energy investment pays off by comparing promotion cost to bond energy gained.
 </div>
 <div style={{ background: T.eo_valence + "06", border: `1px solid ${T.eo_valence}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Promotion is like paying tuition — it costs energy upfront, but the extra bonds you can form (like a better salary) more than make up for it. Carbon{"'"}s tuition pays off handsomely; it gains 2 extra bonds worth ~4.3 eV each.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Energy accounting for carbon:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="C ground state" value="2s² 2p² → can form 2 bonds" />
 <InfoRow label="C promoted state" value="2s¹ 2p³ → can form 4 bonds" />
 <InfoRow label="Promotion energy cost" value="4.18 eV (2s → 2p)" />
 <InfoRow label="C–H bond energy" value="~4.3 eV per bond" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate net energy balance:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bonds gained by promotion" result="= 2 extra bonds" color={T.eo_valence} />
 <CalcRow eq="Energy gained = 2 × 4.3 eV" result="= 8.6 eV" color={T.eo_valence} />
 <CalcRow eq="Net gain = 8.6 − 4.18" result="= +4.42 eV " color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_valence, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Carbon gains a net 4.42 eV by promoting and forming 4 bonds instead of 2. This is why carbon always hybridizes in solids. For beryllium (2s²), promotion to 2s¹2p¹ costs 2.73 eV but Be–H bonds are only ~2.3 eV, so the gain from a 2nd bond barely exceeds the cost — Be prefers sp hybridization with just 2 bonds in a linear geometry (as in BeH₂).</div>
 </div>
 </NCard>


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
 <text x={x - 6} y={y - 5} fontSize={12} fill={color}>
 {"↑"}
 </text>
 <text x={x + 2} y={y - 5} fontSize={12} fill={color}>
 {"↓"}
 </text>
 </>
 )}
 {label && (
 <text x={x + w / 2 + 5} y={y + 4} fontSize={13} fill={T.muted}>
 {label}
 </text>
 )}
 </g>
 );

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
 <AnalogyBox>
 When two atoms come close, their electron spaces combine. They can combine in a helpful way (bonding {"—"} holds atoms together, lower energy) or in an unhelpful way (antibonding {"—"} pushes atoms apart, higher energy). Whether a molecule is stable depends on how many electrons are in the helpful spaces versus the unhelpful ones.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
 <text x={170} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink}>
 {info.title}
 </text>

 {/* Energy axis */}
 <line x1={30} y1={40} x2={30} y2={280} stroke={T.muted} strokeWidth={1} />
 <text x={12} y={160} fontSize={13} fill={T.muted} transform="rotate(-90,12,160)">
 Energy
 </text>
 <text x={30} y={38} fontSize={13} fill={T.muted}>
 {"↑"}
 </text>

 {stage === 1 && (
 <>
 {/* Two isolated atoms with same energy level */}
 <circle cx={120} cy={160} r={22 * pulse} fill={T.eo_e} opacity={0.2} stroke={T.eo_e} strokeWidth={1.5} />
 <circle cx={220} cy={160} r={22 * pulse} fill={T.eo_hole} opacity={0.2} stroke={T.eo_hole} strokeWidth={1.5} />
 <text x={120} y={164} textAnchor="middle" fontSize={13} fontWeight={600} fill={T.eo_e}>
 A
 </text>
 <text x={220} y={164} textAnchor="middle" fontSize={13} fontWeight={600} fill={T.eo_hole}>
 B
 </text>
 {drawLevel(120, 160, 50, T.eo_e, "E_atom", true, "l1")}
 {drawLevel(220, 160, 50, T.eo_hole, "E_atom", true, "l2")}
 </>
 )}

 {stage === 2 && (
 <>
 {/* Bonding + antibonding */}
 {drawLevel(150, 210, 70, T.eo_valence, "", true, "bond")}
 {drawLevel(150, 100, 70, T.eo_gap, "", false, "antibond")}
 <text x={190} y={224} fontSize={10} fill={T.eo_valence}>σ (bonding)</text>
 <text x={190} y={210} fontSize={10} fill={T.eo_valence} fontWeight={700}>HOMO</text>
 <text x={190} y={114} fontSize={10} fill={T.eo_gap}>σ* (antibonding)</text>
 <text x={190} y={100} fontSize={10} fill={T.eo_gap} fontWeight={700}>LUMO</text>
 {/* Dashed lines connecting to atomic levels */}
 <line x1={70} y1={160} x2={115} y2={210} stroke={T.dim} strokeDasharray="3,3" />
 <line x1={70} y1={160} x2={115} y2={100} stroke={T.dim} strokeDasharray="3,3" />
 <line x1={240} y1={160} x2={185} y2={210} stroke={T.dim} strokeDasharray="3,3" />
 <line x1={240} y1={160} x2={185} y2={100} stroke={T.dim} strokeDasharray="3,3" />
 {drawLevel(70, 160, 40, T.eo_e, "", true, "al")}
 {drawLevel(240, 160, 40, T.eo_hole, "", true, "ar")}
 {/* Gap arrow */}
 <line x1={110} y1={200} x2={110} y2={110} stroke={T.eo_gap} strokeWidth={1.5} markerEnd="url(#arrowMO)" />
 <text x={95} y={158} fontSize={11} fill={T.eo_gap} fontWeight={600}>
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
 return drawLevel(150, y, 60, isBonding ? T.eo_valence : T.eo_gap, i === 0 ? "bonding" : i === 3 ? "anti-bond" : "", isBonding, `lv${i}`);
 })}
 <rect x={140} y={105} width={60} height={10} fill={T.eo_gap} opacity={0.08} />
 <rect x={140} y={215} width={60} height={30} fill={T.eo_valence} opacity={0.08} />
 {/* Gap label */}
 <line x1={220} y1={215} x2={220} y2={105} stroke={T.eo_gap} strokeDasharray="3,3" />
 <text x={228} y={160} fontSize={13} fill={T.eo_gap}>
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
 <text x={170} y={230} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_valence}>
 Valence Band
 </text>
 <text x={170} y={55} textAnchor="middle" fontSize={12} fontWeight={600} fill={T.eo_cond}>
 Conduction Band
 </text>
 <text x={260} y={260} fontSize={13} fill={T.eo_valence}>
 VBM
 </text>
 <text x={260} y={72} fontSize={13} fill={T.eo_cond}>
 CBM
 </text>
 {/* Band gap */}
 <line x1={80} y1={190} x2={80} y2={120} stroke={T.eo_gap} strokeWidth={2} />
 <line x1={75} y1={190} x2={85} y2={190} stroke={T.eo_gap} strokeWidth={2} />
 <line x1={75} y1={120} x2={85} y2={120} stroke={T.eo_gap} strokeWidth={2} />
 <text x={58} y={158} fontSize={13} fill={T.eo_gap} fontWeight={700}>
 E_g
 </text>
 {/* Photon excitation */}
 {frame % 80 < 40 && (
 <g>
 <line x1={170} y1={190} x2={170} y2={120} stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="4,2" />
 <circle cx={170} cy={lerp(190, 120, (frame % 40) / 40)} r={4} fill={T.eo_photon} />
 <text x={180} y={155} fontSize={13} fill={T.eo_photon}>
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
 background: stage === i + 1 ? "#7c3aed08" : "transparent",
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

 <div style={{ background: "#7c3aed0a", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
 <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
 This is the origin of bands. Bonding orbitals {"→"} valence band. Antibonding {"→"} conduction band.
 The gap between them is the band gap E_g. For ZnTe, E_g = 2.26 eV.
 </div>
 </div>

 <NCard title="Numerical Example: MO Diagram and Bond Order of O₂" color={T.eo_cond} formula="Bond Order = (8 − 4)/2 = 2">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Oxygen has 8 electrons per atom, so O₂ has 16 total. By filling the molecular orbital diagram in energy order, we calculate the bond order and predict O₂{"'"}s magnetic behavior — a triumph of MO theory over Lewis structures.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each bonding MO is like a brick strengthening a wall; each antibonding MO removes a brick. Bond order counts the net bricks. For O₂, we end up with a net of 2 — a double bond. But the surprise is that the last two antibonding electrons go into separate orbitals with parallel spins (Hund{"'"}s rule), making O₂ paramagnetic.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Fill the MO diagram (16 electrons):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="σ(1s)" value="↑↓ (2 e⁻) — bonding" />
 <InfoRow label="σ*(1s)" value="↑↓ (2 e⁻) — antibonding" />
 <InfoRow label="σ(2s)" value="↑↓ (2 e⁻) — bonding" />
 <InfoRow label="σ*(2s)" value="↑↓ (2 e⁻) — antibonding" />
 <InfoRow label="σ(2p_z)" value="↑↓ (2 e⁻) — bonding" />
 <InfoRow label="π(2p_x), π(2p_y)" value="↑↓, ↑↓ (4 e⁻) — bonding" />
 <InfoRow label="π*(2p_x), π*(2p_y)" value="↑ , ↑ (2 e⁻) — antibonding, UNPAIRED" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate bond order:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bonding electrons: σ(1s) + σ(2s) + σ(2p) + π(2p)" result="= 2+2+2+4 = 10" color={T.eo_cond} />
 <CalcRow eq="Antibonding electrons: σ*(1s) + σ*(2s) + π*(2p)" result="= 2+2+2 = 6" color={T.eo_cond} />
 <CalcRow eq="Bond order = (10 − 6) / 2" result="= 2 (double bond)" color={T.eo_cond} />
 <CalcRow eq="Unpaired electrons in π*" result="= 2 → paramagnetic" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>MO theory correctly predicts O₂ is paramagnetic (attracted to magnets), which Lewis dot structures cannot explain. The two unpaired electrons in the degenerate π* orbitals give O₂ a magnetic moment of ~2.8 Bohr magnetons. This same MO counting approach scales to solids: in a crystal with N atoms, the N bonding MOs fill to become the valence band.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Why β-Carotene is Orange" color={T.eo_cond} formula="E = h²(2n+1) / (8mL²)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> β-carotene has 11 conjugated double bonds, creating a long π system. Using the particle-in-a-box model, we estimate the HOMO→LUMO transition energy and predict the absorption wavelength — explaining why carrots are orange.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The conjugated π electrons are like a ball rolling in a trough. The longer the trough (more double bonds), the lower the energy needed to jump to the next level. With 11 double bonds, the box is long enough that the HOMO→LUMO gap falls right in the blue-violet range — the molecule absorbs blue light and we see the complementary color: orange.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Set up the particle-in-a-box:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Conjugated double bonds" value="11" />
 <InfoRow label="π electrons (2 per double bond)" value="22 e⁻" />
 <InfoRow label="Box length L ≈ 11 × 2.8 Å" value="L = 30.8 Å = 3.08 nm" />
 <InfoRow label="HOMO level" value="n = 11 (22 e⁻ fill levels 1–11)" />
 <InfoRow label="LUMO level" value="n = 12" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate transition energy:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔE = h²(2n+1) / (8m_e L²), n = 11" result="" color={T.eo_cond} />
 <CalcRow eq="h²/(8m_e) = (6.626×10⁻³⁴)² / (8 × 9.109×10⁻³¹)" result="" color={T.eo_cond} />
 <CalcRow eq="= 6.025 × 10⁻³⁸ J·m²" result="" color={T.eo_cond} />
 <CalcRow eq="ΔE = 6.025×10⁻³⁸ × 23 / (3.08×10⁻¹⁰)²" result="" color={T.eo_cond} />
 <CalcRow eq="= 1.386×10⁻³⁶ / 9.486×10⁻¹⁹" result="" color={T.eo_cond} />
 <CalcRow eq="ΔE = 4.61 × 10⁻¹⁹ J" result="≈ 2.88 eV" color={T.eo_cond} />
 <CalcRow eq="λ = hc/ΔE = 1240 eV·nm / 2.88 eV" result="≈ 431 nm (violet-blue)" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>β-carotene absorbs at ~450 nm (experimental), and our simple box model gives ~431 nm — remarkably close. The molecule absorbs blue-violet light, so we see the transmitted/reflected orange. This same HOMO-LUMO concept maps directly to band gaps in semiconductors: the valence band is the collection of all filled HOMOs, and the conduction band is the collection of all empty LUMOs.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: N₂ Triple Bond — Why Nitrogen Is So Inert" color={T.eo_cond} formula="Bond Order = (10 − 4)/2 = 3">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> We fill the MO diagram for N₂ (14 electrons) and calculate the bond order. The result explains why N₂ has one of the strongest bonds in nature (945 kJ/mol) and is remarkably unreactive.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>N₂ is like a triple-locked door — you need to break three bonds (one σ + two π) to get through. That is why nitrogen gas is so inert that it takes extreme conditions (lightning, or the Haber process at 450°C and 200 atm) to crack it open.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Fill the MO diagram (14 electrons):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="σ1s²" value="2 e⁻ (bonding)" />
 <InfoRow label="σ*1s²" value="2 e⁻ (antibonding)" />
 <InfoRow label="σ2s²" value="2 e⁻ (bonding)" />
 <InfoRow label="σ*2s²" value="2 e⁻ (antibonding)" />
 <InfoRow label="π2p⁴ (two degenerate)" value="4 e⁻ (bonding)" />
 <InfoRow label="σ2p²" value="2 e⁻ (bonding)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate bond order:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bonding electrons: 2+2+4+2 = 10" result="" color={T.eo_cond} />
 <CalcRow eq="Antibonding electrons: 2+2 = 4" result="" color={T.eo_cond} />
 <CalcRow eq="Bond order = (10 − 4)/2" result="= 3 (triple bond)" color={T.eo_cond} />
 <CalcRow eq="N≡N bond energy" result="= 945 kJ/mol" color={T.eo_cond} />
 <CalcRow eq="Compare O=O (BO=2)" result="= 498 kJ/mol" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>N₂{"'"}s bond order of 3 gives it nearly twice the bond energy of O₂ (bond order 2). All bonding MOs are full and all antibonding MOs in the valence shell are empty — there are no unpaired electrons, so N₂ is diamagnetic. This electronic perfection is why 78% of our atmosphere is unreactive N₂.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: F₂ — The Weakest Homonuclear Halogen Bond" color={T.eo_cond} formula="Bond Order = 1, but unusually weak">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> F₂ has 18 electrons and a bond order of 1, yet its bond energy (155 kJ/mol) is surprisingly weaker than Cl₂ (242 kJ/mol). We use the MO diagram to understand why.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Fluorine atoms are tiny and packed with lone pairs. When two F atoms come close, their lone pairs bump into each other like two people in a narrow hallway — the repulsion weakens the bond despite the single-bond order.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Fill the MO diagram (18 electrons):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Core: σ1s², σ*1s², σ2s², σ*2s²" value="8 e⁻" />
 <InfoRow label="σ2p²" value="2 e⁻ (bonding)" />
 <InfoRow label="π2p⁴" value="4 e⁻ (bonding)" />
 <InfoRow label="π*2p⁴" value="4 e⁻ (antibonding)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Bond order and energy comparison:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bonding: 2+2+4+2 = 10, Antibonding: 2+2+4 = 8" result="" color={T.eo_cond} />
 <CalcRow eq="Bond order = (10 − 8)/2" result="= 1" color={T.eo_cond} />
 <CalcRow eq="F–F bond energy" result="= 155 kJ/mol" color={T.eo_cond} />
 <CalcRow eq="Cl–Cl bond energy" result="= 242 kJ/mol" color={T.eo_cond} />
 <CalcRow eq="Ratio: Cl₂/F₂" result="= 1.56×" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Despite the same bond order, F₂ is 36% weaker than Cl₂. The culprit is lone-pair repulsion: fluorine{"'"}s tiny atomic radius (0.64 Å) forces 3 lone pairs on each atom into close proximity. In Cl₂, the larger radius (0.99 Å) reduces this repulsion. This lone-pair effect is important in solid-state chemistry — it explains why fluorides often have different crystal structures than other halides.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: CO — Isoelectronic with N₂ but with a Surprise Dipole" color={T.eo_cond} formula="14 e⁻, same MO filling as N₂">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> CO has 14 electrons, identical to N₂. We fill the MO diagram and predict the bond order. The surprise: CO{"'"}s dipole moment points from O to C (C⁻O⁺), opposite to what electronegativity alone predicts.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>You might expect the more electronegative O to hog all the electrons (making C⁺O⁻). But the lone pair on carbon in the σ HOMO sticks out far from the molecule, creating a large opposing dipole that actually wins. It is like a tug-of-war where the losing side has a longer lever arm.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- MO filling (14 electrons):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="MO filling" value="Same sequence as N₂" />
 <InfoRow label="Bond order" value="(10 − 4)/2 = 3 (triple bond)" />
 <InfoRow label="HOMO" value="σ₃ (concentrated on C)" />
 <InfoRow label="Bond length" value="1.128 Å (vs N₂: 1.098 Å)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Dipole analysis:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Electronegativity dipole: C⁺ → O⁻" result="(toward O)" color={T.eo_cond} />
 <CalcRow eq="Lone pair dipole: C lone pair extends outward" result="(toward C)" color={T.eo_cond} />
 <CalcRow eq="Net dipole moment" result="= 0.112 D (toward C!)" color={T.eo_cond} />
 <CalcRow eq="Polarity assignment" result="C⁻O⁺" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>CO{"'"}s reversed dipole (0.112 D, C⁻O⁺) shows that MO theory captures subtleties that simple electronegativity arguments miss. The carbon lone pair in the HOMO is why CO is such a powerful ligand — it donates this lone pair to metals, forming strong metal-carbonyl bonds. This same concept (HOMO donation) governs how adsorbates bind to semiconductor surfaces.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Band Formation from MOs — From H₂ to H_N Chain" color={T.eo_cond} formula="Bandwidth W = 4t (tight-binding)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> We show how molecular orbitals of 2, 4, 8, and N hydrogen atoms progressively merge into a continuous energy band. The tight-binding model predicts a bandwidth W = 4t, where t is the hopping integral.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Start with 2 tuning forks coupled by a spring — you get 2 frequencies. Add more forks and you get more frequencies. With N = 10²³ forks, the individual frequencies blur into a continuous band. The bandwidth depends on how strongly the forks are coupled (the hopping integral t).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- MO count vs atom count:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="H₂ (N=2)" value="2 MOs: σ and σ*, split by 2t" />
 <InfoRow label="H₄ (N=4)" value="4 MOs spread over ~3.4t" />
 <InfoRow label="H₈ (N=8)" value="8 MOs spread over ~3.8t" />
 <InfoRow label="H_∞ (N→∞)" value="Continuous band, width = 4t" />
 <InfoRow label="Typical t for H chain (d=1Å)" value="t ≈ 3 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate bandwidth:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Tight-binding dispersion: E(k) = ε₀ − 2t cos(ka)" result="" color={T.eo_cond} />
 <CalcRow eq="Band minimum: E_min = ε₀ − 2t" result="" color={T.eo_cond} />
 <CalcRow eq="Band maximum: E_max = ε₀ + 2t" result="" color={T.eo_cond} />
 <CalcRow eq="Bandwidth W = E_max − E_min = 4t" result="= 4 × 3 = 12 eV" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>As N grows, discrete MO levels merge into a continuous band of width 4t. For a half-filled band (1 electron per atom), the chain is metallic. This is exactly how atomic s-orbitals form the valence band in real solids. The bandwidth determines the effective mass: wider bands mean lighter electrons and higher mobility — directly connecting MO theory to semiconductor transport.</div>
 </div>
 </NCard>


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
 A crystal is made by repeating one small block over and over in all directions, like tiles on a floor. This small block is called the unit cell. If you know the shape of one tile, you know the entire pattern. There are 14 basic tile shapes that nature uses to build all crystals.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 340 340" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
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
 <text x={170} y={310} textAnchor="middle" fontSize={12} fill={T.muted}>
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
 <circle cx={100} cy={332} r={5} fill={T.eo_e} />
 <text x={110} y={336} fontSize={10} fill={T.muted}>Anion (Te)</text>
 <circle cx={210} cy={332} r={5} fill={T.eo_hole} />
 <text x={220} y={336} fontSize={10} fill={T.muted}>Cation (Zn)</text>
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
 ? "#7c3aed08"
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

 <div style={{ background: "#7c3aed0a", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
 <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
 Zincblende (F-43m) is THE structure for most important semiconductors: Si (diamond variant),
 GaAs, ZnTe, CdTe. The tetrahedral coordination arises directly from sp{"³"} hybridization.
 </div>
 </div>

 <NCard title="Numerical Example: Miller Indices and d-spacing in Silicon" color={T.eo_cond} formula="d = a / √(h² + k² + l²)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> X-ray diffraction reveals crystal planes through sharp peaks at specific angles. We index the three strongest peaks of silicon and calculate their d-spacings from the known lattice constant.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Miller indices are like an address system for crystal planes. The (111) plane slices equally through all three axes; the (220) plane cuts twice along x and y but is parallel to z. The d-spacing is the distance between adjacent parallel planes — tighter-packed planes have larger d-spacings and diffract at smaller angles.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Identify planes and their (hkl) indices:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Silicon structure" value="Diamond cubic (FCC + basis), a = 5.431 Å" />
 <InfoRow label="Strongest reflections" value="(111), (220), (311)" />
 <InfoRow label="h²+k²+l² for (111)" value="1+1+1 = 3" />
 <InfoRow label="h²+k²+l² for (220)" value="4+4+0 = 8" />
 <InfoRow label="h²+k²+l² for (311)" value="9+1+1 = 11" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate d-spacings:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="d(111) = 5.431 / √3 = 5.431 / 1.732" result="= 3.136 Å" color={T.eo_cond} />
 <CalcRow eq="d(220) = 5.431 / √8 = 5.431 / 2.828" result="= 1.920 Å" color={T.eo_cond} />
 <CalcRow eq="d(311) = 5.431 / √11 = 5.431 / 3.317" result="= 1.637 Å" color={T.eo_cond} />
 <CalcRow eq="Bragg angle for (111) with Cu Kα (λ=1.5406Å):" result="" color={T.eo_cond} />
 <CalcRow eq="2θ = 2 × sin⁻¹(1.5406 / (2×3.136))" result="= 28.44°" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The (111) planes have the largest d-spacing (3.136 Å) and appear first in the XRD pattern at the lowest angle. Note that (100) and (200) reflections are absent in diamond cubic due to the two-atom basis — the structure factor causes destructive interference. This systematic absence is a fingerprint of the diamond crystal structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Zinc Blende Structure of ZnTe" color={T.eo_cond} formula="d_nn = a√3/4, CN = 4">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> ZnTe crystallizes in the zinc blende structure (space group F̄3m, #216). We work out the atom positions, count the coordination, and calculate the nearest-neighbor distance from the lattice constant.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Zinc blende is two interlocking FCC lattices, offset by one quarter of the body diagonal. Imagine two identical jungle gyms, one shifted so its corners sit inside the other{"'"}s cubes. Zn atoms form one gym, Te atoms form the other. Each atom touches exactly 4 atoms of the opposite type.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Atom positions in the unit cell:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Zn positions (FCC)" value="(0,0,0), (½,½,0), (½,0,½), (0,½,½)" />
 <InfoRow label="Te positions (FCC + ¼¼¼)" value="(¼,¼,¼), (¾,¾,¼), (¾,¼,¾), (¼,¾,¾)" />
 <InfoRow label="Atoms per unit cell" value="4 Zn + 4 Te = 8 total" />
 <InfoRow label="Formula units per cell" value="4 ZnTe" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate nearest-neighbor distance:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="a (ZnTe) = 6.10 Å" result="" color={T.eo_cond} />
 <CalcRow eq="d_nn = a√3 / 4" result="" color={T.eo_cond} />
 <CalcRow eq="d_nn = 6.10 × 1.732 / 4" result="= 2.641 Å" color={T.eo_cond} />
 <CalcRow eq="Coordination number" result="= 4 (tetrahedral)" color={T.eo_cond} />
 <CalcRow eq="Packing fraction (zinc blende)" result="≈ 34%" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 2.64 Å nearest-neighbor distance and coordination number of 4 confirm tetrahedral sp³ bonding. The low packing fraction (34% vs 74% for close-packed metals) reflects the directional covalent bonds — atoms sacrifice packing efficiency to maintain the optimal sp³ geometry. The F̄3m space group lacks inversion symmetry, which is why ZnTe is piezoelectric and has different properties along [111] vs [̒1̒1̒].</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Packing Fraction — FCC vs BCC vs Diamond" color={T.eo_cond} formula="PF = (atoms × V_atom) / V_cell">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Different crystal structures pack atoms with different efficiency. We calculate the packing fraction for FCC (74%), BCC (68%), and diamond (34%) from pure geometry.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine packing oranges in a box. FCC is like the optimal stacking at a grocery store (74% full). BCC leaves a bit more space (68%). Diamond cubic is like an airy framework — only 34% full — because directional bonds force atoms into specific positions rather than close-packed arrangements.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Geometry for each structure:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="FCC: atoms per cell" value="4, touching along face diagonal: 4r = a√2" />
 <InfoRow label="BCC: atoms per cell" value="2, touching along body diagonal: 4r = a√3" />
 <InfoRow label="Diamond: atoms per cell" value="8, touching along ¼ body diagonal: 8r = a√3" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate packing fractions:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="FCC: PF = 4×(4π/3)r³ / a³, a = 2√2 r" result="" color={T.eo_cond} />
 <CalcRow eq="FCC: PF = 4×(4π/3)r³ / (2√2 r)³ = π/(3√2)" result="= 74.05%" color={T.eo_cond} />
 <CalcRow eq="BCC: PF = 2×(4π/3)r³ / (4r/√3)³ = π√3/8" result="= 68.02%" color={T.eo_cond} />
 <CalcRow eq="Diamond: PF = 8×(4π/3)r³ / (8r/√3)³ = π√3/16" result="= 34.01%" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Diamond{"'"}s packing fraction is exactly half of FCC{"'"}s because it uses only half the tetrahedral sites. This open structure is the price of directional sp³ bonding — atoms must maintain 109.5° angles rather than pack as tightly as possible. The empty space in diamond/zinc blende structures creates channels that allow interstitial impurities to diffuse, which is critical for semiconductor doping.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Systematic Absences — Why FCC Shows Only Unmixed Indices" color={T.eo_cond} formula="F_hkl = 4f (unmixed) or 0 (mixed)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In FCC, certain X-ray reflections are systematically absent. We calculate the structure factor to show that only reflections with all-odd or all-even Miller indices appear.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine 4 speakers at FCC positions playing the same note. For some directions, two speakers are exactly half a wavelength out of phase with the other two — they cancel out perfectly. Only when all 4 speakers are in phase (unmixed indices) do you hear the full sound.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- FCC basis positions:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Atom 1" value="(0, 0, 0)" />
 <InfoRow label="Atom 2" value="(½, ½, 0)" />
 <InfoRow label="Atom 3" value="(½, 0, ½)" />
 <InfoRow label="Atom 4" value="(0, ½, ½)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate structure factor:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="F = f[1 + e^(iπ(h+k)) + e^(iπ(h+l)) + e^(iπ(k+l))]" result="" color={T.eo_cond} />
 <CalcRow eq="(111): F = f[1 + e^(2πi) + e^(2πi) + e^(2πi)] = f[1+1+1+1]" result="= 4f " color={T.eo_cond} />
 <CalcRow eq="(100): F = f[1 + e^(iπ) + e^(iπ) + e^(0)] = f[1−1−1+1]" result="= 0 " color={T.eo_cond} />
 <CalcRow eq="(200): F = f[1 + e^(2πi) + e^(2πi) + e^(0)] = f[1+1+1+1]" result="= 4f " color={T.eo_cond} />
 <CalcRow eq="(110): F = f[1 + e^(2πi) + e^(iπ) + e^(iπ)] = f[1+1−1−1]" result="= 0 " color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The selection rule is clear: F = 4f when h,k,l are all odd or all even (unmixed), and F = 0 for mixed indices. This is why the Si(100) reflection is forbidden while Si(111) is strong. In the diamond structure, an additional selection rule from the 2-atom basis further eliminates some unmixed reflections (like 200), making the diffraction pattern a unique fingerprint of the crystal structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Unit Cell Volume and Density of GaAs" color={T.eo_cond} formula="ρ = (Z × M) / (N_A × a³)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> GaAs has the zinc blende structure with a = 5.653 Å and 4 formula units per cell. We calculate the theoretical density and compare with the measured value of 5.317 g/cm³.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Density is just mass divided by volume. We know exactly how many atoms fit in one unit cell (4 Ga + 4 As) and the cell{"'"}s exact dimensions. It is like calculating the weight of a perfectly organized warehouse when you know the weight of each item and the warehouse dimensions.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Unit cell parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Lattice constant" value="a = 5.653 Å = 5.653 × 10⁻⁸ cm" />
 <InfoRow label="Formula units per cell" value="Z = 4" />
 <InfoRow label="Molar mass of GaAs" value="M = 69.72 + 74.92 = 144.64 g/mol" />
 <InfoRow label="Avogadro's number" value="N_A = 6.022 × 10²³" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate density:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="V_cell = a³ = (5.653 × 10⁻⁸)³" result="= 1.807 × 10⁻²² cm³" color={T.eo_cond} />
 <CalcRow eq="ρ = (4 × 144.64) / (6.022×10²³ × 1.807×10⁻²²)" result="" color={T.eo_cond} />
 <CalcRow eq="ρ = 578.56 / 108.84" result="= 5.316 g/cm³" color={T.eo_cond} />
 <CalcRow eq="Experimental density" result="= 5.317 g/cm³ " color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The calculated density matches experiment to 4 significant figures — a testament to the precision of X-ray crystallography. This calculation works in reverse too: measuring density and lattice constant reveals how many atoms are in the unit cell, which is how the zinc blende structure was originally confirmed.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Point Group Symmetry — Td vs Oh" color={T.eo_cond} formula="Td: no inversion; Oh: has inversion">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> ZnTe (zinc blende) belongs to point group Td while NaCl (rock salt) belongs to Oh. The key difference is inversion symmetry. We count symmetry operations and explain the consequences for Raman and IR spectroscopy.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Inversion symmetry means that for every atom at position (x,y,z) there is an identical atom at (−x,−y,−z). NaCl has this because Na and Cl form separate FCC lattices related by inversion. ZnTe does not — Zn and Te are different atoms, so swapping positions changes the crystal.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Count symmetry operations:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Td (ZnTe)" value="24 operations: E, 8C₃, 3C₂, 6S₄, 6σ_d" />
 <InfoRow label="Oh (NaCl)" value="48 operations: Td + inversion + related" />
 <InfoRow label="Key difference" value="Oh has inversion (i); Td does not" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Spectroscopic consequences:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Rule of mutual exclusion (Oh): IR-active ≠ Raman-active" result="" color={T.eo_cond} />
 <CalcRow eq="NaCl TO phonon: IR-active, Raman-inactive" result="" color={T.eo_cond} />
 <CalcRow eq="No mutual exclusion (Td): modes can be both" result="" color={T.eo_cond} />
 <CalcRow eq="ZnTe TO phonon: both IR-active AND Raman-active" result="" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The absence of inversion symmetry in Td (zinc blende) has profound consequences: it allows piezoelectricity (stress generates voltage), second-harmonic generation (frequency doubling of light), and Raman activity of polar phonons. These properties are forbidden in Oh (rock salt) structures. This is why ZnTe is used as a THz emitter — its lack of inversion symmetry enables optical rectification.</div>
 </div>
 </NCard>


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
 There are two ways to look at a crystal. Real space shows where the atoms are. Reciprocal space shows the repeating patterns and distances that matter most. X-ray experiments directly measure reciprocal space. It helps scientists understand which wavelengths of electrons fit naturally in the crystal.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 340 320" style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, width: "100%", maxWidth: 374 }}>
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
 <text x={ctrX + realA1[0] + 8} y={ctrY + realA1[1] + 4} fontSize={13} fill={T.eo_hole} fontWeight={700}>
 a{"₁"}
 </text>
 <line x1={ctrX} y1={ctrY} x2={ctrX + realA2actual[0]} y2={ctrY + realA2actual[1]} stroke={T.eo_valence} strokeWidth={2.5} markerEnd="url(#arrowRS2)" />
 <text x={ctrX + realA2actual[0] + 8} y={ctrY + realA2actual[1] + 4} fontSize={13} fill={T.eo_valence} fontWeight={700}>
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
 <text x={ctrX + pt.x + 8} y={ctrY + pt.y + 4} fontSize={12} fontWeight={700} fill={T.eo_gap}>
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
 <text x={ctrX + recipB1[0] + 8} y={ctrY - recipB1[1] + 4} fontSize={13} fill={T.eo_hole} fontWeight={700}>
 b{"₁"}
 </text>
 <line x1={ctrX} y1={ctrY} x2={ctrX + recipB2[0]} y2={ctrY - recipB2[1]} stroke={T.eo_valence} strokeWidth={2} markerEnd="url(#arrowRS2)" />
 <text x={ctrX + recipB2[0] + 8} y={ctrY - recipB2[1] + 4} fontSize={13} fill={T.eo_valence} fontWeight={700}>
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
 <text x={170} y={300} textAnchor="middle" fontSize={12} fill={T.muted}>
 b{"ᵢ"} {"·"} a{"ⱼ"} = 2{"π"}{"δ"}{"ᵢⱼ"}
 </text>

 <text x={170} y={315} textAnchor="middle" fontSize={9} fill={T.dim}>
 (Reciprocal vectors orthogonal to real-space planes)
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

 <div style={{ background: "#7c3aed0a", borderRadius: 6, padding: 10, border: `1px solid ${T.eo_photon}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_photon, marginBottom: 3 }}>Key Insight</div>
 <div style={{ fontSize: 11, lineHeight: 1.5, color: T.ink }}>
 Direct vs indirect band gap is determined by whether VBM and CBM are at the same k-point.
 ZnTe: direct gap at {"Γ"} (good for optics). Si: indirect gap {"Γ"}{"→"}X (poor absorber).
 This controls optical absorption strength.
 </div>
 </div>

 <NCard title="Numerical Example: Reciprocal Lattice of FCC Silicon" color={T.eo_cond} formula="b_i = 2π(a_j × a_k) / (a_1 · a_2 × a_3)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Silicon{"'"}s FCC real-space lattice has a BCC reciprocal lattice. We compute the reciprocal lattice vectors, verify the FCC → BCC duality, and calculate the volume of the first Brillouin zone.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Reciprocal space is like a frequency domain for crystals. Just as a short pulse in time has a broad frequency spectrum, a compact real-space unit cell produces a spread-out reciprocal lattice. FCC (tightly packed) transforms to BCC (less dense) in reciprocal space, and vice versa.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- FCC primitive vectors (a = 5.431 Å):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="a₁" value="(a/2)(0, 1, 1) = (0, 2.716, 2.716) Å" />
 <InfoRow label="a₂" value="(a/2)(1, 0, 1) = (2.716, 0, 2.716) Å" />
 <InfoRow label="a₃" value="(a/2)(1, 1, 0) = (2.716, 2.716, 0) Å" />
 <InfoRow label="Unit cell volume" value="V = a³/4 = 40.05 Å³" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate reciprocal vectors:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="b₁ = (2π/a)(−1, 1, 1)" result="" color={T.eo_cond} />
 <CalcRow eq="b₂ = (2π/a)(1, −1, 1)" result="" color={T.eo_cond} />
 <CalcRow eq="b₃ = (2π/a)(1, 1, −1)" result="" color={T.eo_cond} />
 <CalcRow eq="|b| = 2π√3/a = 2π × 1.732 / 5.431" result="= 2.004 Å⁻¹" color={T.eo_cond} />
 <CalcRow eq="These form a BCC lattice (FCC ↔ BCC duality)" result="" color={T.eo_cond} />
 <CalcRow eq="BZ volume = (2π)³ / V_real = 2 × (2π/a)³" result="= 3.11 Å⁻³" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The reciprocal lattice vectors point along (±1,±1,±1) directions — the body diagonals of a cube — confirming BCC symmetry. The first Brillouin zone is a truncated octahedron with high-symmetry points Γ (center), X (face center), L (body corner), and K (edge midpoint). Band structure calculations along Γ→X→L→Γ paths reveal the full electronic structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Bragg Diffraction as Reciprocal Space Condition" color={T.eo_cond} formula="2d sinθ = nλ ⇔ Δk = G">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Bragg{"'"}s law and the Laue condition are two ways of saying the same thing. We show their equivalence using Cu Kα radiation on silicon, and connect diffraction peaks to reciprocal lattice vectors via the Ewald sphere.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Ewald sphere is a clever geometric construction. Draw a sphere in reciprocal space with radius k = 2π/λ centered on the crystal. Wherever the sphere intersects a reciprocal lattice point, a diffraction peak appears. Bragg{"'"}s law just describes when these intersections occur.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Set up the Ewald sphere:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Cu Kα wavelength" value="λ = 1.5406 Å" />
 <InfoRow label="Wavevector magnitude" value="k = 2π/λ = 4.078 Å⁻¹" />
 <InfoRow label="Ewald sphere radius" value="4.078 Å⁻¹" />
 <InfoRow label="Si (111) d-spacing" value="3.136 Å" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Show Bragg ⇔ Laue equivalence:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Bragg: sinθ = λ/(2d) = 1.5406/(2×3.136)" result="" color={T.eo_cond} />
 <CalcRow eq="sinθ = 0.2457 → θ = 14.22°" result="" color={T.eo_cond} />
 <CalcRow eq="Laue: |G(111)| = 2π/d = 2π/3.136" result="= 2.003 Å⁻¹" color={T.eo_cond} />
 <CalcRow eq="Scattering: Δk = 2k sinθ = 2×4.078×0.2457" result="= 2.004 Å⁻¹" color={T.eo_cond} />
 <CalcRow eq="Δk = |G(111)| ?" result=" 2.003 ≈ 2.004" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The momentum transfer Δk exactly equals the reciprocal lattice vector G(111), confirming that Bragg{"'"}s law is just the real-space statement of the Laue condition Δk = G. Every XRD peak maps to a reciprocal lattice point. At Brillouin zone boundaries, electron waves satisfy this same condition — they undergo Bragg reflection inside the crystal, which is exactly what opens up band gaps.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Brillouin Zone Volume and Density of k-States" color={T.eo_cond} formula="V_BZ = (2π)³ / V_cell">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The first Brillouin zone contains exactly as many k-states as there are unit cells in the crystal. We calculate the BZ volume for silicon and the density of allowed k-points.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Real space and reciprocal space are inversely related — a large crystal has a tiny spacing between allowed k-points, like how a long guitar string has closely spaced harmonics. The BZ is the fundamental "container" holding all unique k-states.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Silicon unit cell:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Si lattice constant" value="a = 5.431 Å = 5.431 × 10⁻¹⁰ m" />
 <InfoRow label="FCC unit cell volume" value="V_cell = a³ = 1.602 × 10⁻²⁸ m³" />
 <InfoRow label="Atoms per unit cell" value="8 (diamond cubic)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate BZ volume:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="V_BZ = (2π)³ / V_cell" result="" color={T.eo_cond} />
 <CalcRow eq="V_BZ = 248.05 / (1.602 × 10⁻²⁸)" result="= 1.549 × 10³⁰ m⁻³" color={T.eo_cond} />
 <CalcRow eq="k-states per BZ (for 1 cm³ crystal)" result="" color={T.eo_cond} />
 <CalcRow eq="N = V_crystal / V_cell = 10⁻⁶ / 1.602×10⁻²⁸" result="= 6.24 × 10²¹" color={T.eo_cond} />
 <CalcRow eq="With spin: 2N states per band" result="= 1.25 × 10²²" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 1 cm³ silicon crystal has ~6.2 × 10²¹ allowed k-points in each band. With 2 spin states per k-point, each band holds ~1.25 × 10²² electrons. Since silicon has 4 valence electrons per atom and 5 × 10²² atoms per cm³, it needs ~5 filled bands — exactly matching the 4 valence bands in the silicon band structure.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Free Electron Band Structure — E(k) = ℏ²k²/2m" color={T.eo_cond} formula="E(k) = ℏ²k² / 2m">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In the free-electron model, E(k) is a simple parabola. When folded into the first Brillouin zone (reduced zone scheme), it creates multiple bands. We calculate the bandwidth of the first band.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a long staircase (the extended zone parabola) that you fold like an accordion at each zone boundary. The folded segments become different bands. The first fold — from k = −π/a to +π/a — creates the first band.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Set up for a 1D chain with spacing a = 3 Å:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Lattice constant" value="a = 3.0 Å = 3.0 × 10⁻¹⁰ m" />
 <InfoRow label="Zone boundary" value="k_max = π/a = 1.047 × 10¹⁰ m⁻¹" />
 <InfoRow label="ℏ²/2m" value="7.62 × 10⁻³⁸ J·m² = 0.476 eV·Å²" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate first-band width:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E(k=0) = 0" result="" color={T.eo_cond} />
 <CalcRow eq="E(k=π/a) = ℏ²(π/a)²/2m = 0.476 × (π/3.0)²" result="" color={T.eo_cond} />
 <CalcRow eq="E(π/a) = 0.476 × 1.097" result="= 0.522 eV" color={T.eo_cond} />
 <CalcRow eq="First band width W₁ = E(π/a) − E(0)" result="= 0.522 eV" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The free-electron first band spans ~0.52 eV for a = 3 Å. In a real crystal, the periodic potential opens gaps at the zone boundary — the free-electron bands split apart. The size of the gap depends on the Fourier component of the crystal potential. Weak potentials (nearly free electrons) give small gaps; strong potentials (tight binding) give large gaps. Silicon{"'"}s 1.12 eV gap arises from the intermediate-strength potential of its sp³ bonds.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Debye Model — Maximum Phonon Wavevector" color={T.eo_cond} formula="k_D = (6π²n)^(1/3)">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> The Debye model replaces the real Brillouin zone with a sphere of the same volume. We calculate the Debye wavevector k_D and Debye temperature Θ_D for copper.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The real BZ has a complicated shape (truncated octahedron for FCC). Debye{"'"}s trick: replace it with a sphere of equal volume. The sphere{"'"}s radius k_D sets the highest phonon frequency, and Θ_D = ℏω_D/k_B tells us the temperature scale where quantum effects in lattice vibrations kick in.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Copper parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Atom density of Cu" value="n = 8.49 × 10²⁸ m⁻³" />
 <InfoRow label="Speed of sound in Cu" value="v_s ≈ 3570 m/s (average)" />
 <InfoRow label="Boltzmann constant" value="k_B = 1.381 × 10⁻²³ J/K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate k_D and Θ_D:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="k_D = (6π² × 8.49×10²⁸)^(1/3)" result="" color={T.eo_cond} />
 <CalcRow eq="k_D = (5.03 × 10³⁰)^(1/3)" result="= 1.713 × 10¹⁰ m⁻¹" color={T.eo_cond} />
 <CalcRow eq="ω_D = v_s × k_D = 3570 × 1.713×10¹⁰" result="= 6.11 × 10¹³ rad/s" color={T.eo_cond} />
 <CalcRow eq="Θ_D = ℏω_D/k_B = (1.055×10⁻³⁴ × 6.11×10¹³) / 1.381×10⁻²³" result="≈ 467 K" color={T.eo_cond} />
 <CalcRow eq="Experimental Θ_D for Cu" result="= 343 K" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Our estimate (467 K) overshoots the experimental 343 K by ~36% because the Debye model uses a single average sound speed and assumes linear dispersion up to k_D, while real phonon dispersion curves flatten near the zone boundary. Below Θ_D, the heat capacity follows the T³ law; above it, C_V approaches the classical 3Nk_B (Dulong-Petit). At room temperature (300 K {"<"} 343 K), copper{"'"}s phonons are not yet fully classical.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: ARPES — Mapping Band Structure Experimentally" color={T.eo_cond} formula="E_B = hν − E_kin − φ, k∥ = √(2mE_kin)/ℏ × sinθ">
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Angle-Resolved Photoemission Spectroscopy (ARPES) directly maps E(k) by measuring the kinetic energy and emission angle of photoelectrons. We use He I radiation (21.2 eV) on a copper surface to extract a data point on the band structure.
 </div>
 <div style={{ background: T.eo_cond + "06", border: `1px solid ${T.eo_cond}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_cond, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ARPES is like shining light on a pinball machine and catching the balls that fly out. The speed of each ball tells you its energy inside the machine, and the angle tells you which direction it was moving. Together, you reconstruct the full energy-momentum map of the electrons.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Measurement parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Photon energy (He I)" value="hν = 21.2 eV" />
 <InfoRow label="Work function of Cu" value="φ = 4.65 eV" />
 <InfoRow label="Measured kinetic energy" value="E_kin = 16.1 eV" />
 <InfoRow label="Emission angle" value="θ = 30°" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Extract E(k):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Binding energy: E_B = hν − E_kin − φ" result="" color={T.eo_cond} />
 <CalcRow eq="E_B = 21.2 − 16.1 − 4.65" result="= 0.45 eV below E_F" color={T.eo_cond} />
 <CalcRow eq="k∥ = (1/ℏ)√(2m × E_kin) × sin(30°)" result="" color={T.eo_cond} />
 <CalcRow eq="k∥ = √(2 × 9.109×10⁻³¹ × 16.1 × 1.602×10⁻¹⁹) / (1.055×10⁻³⁴) × 0.5" result="" color={T.eo_cond} />
 <CalcRow eq="k∥ = 2.056 × 10⁹ × 0.5" result="= 1.03 Å⁻¹" color={T.eo_cond} />
 </div>
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_cond, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>We found one point on Cu{"'"}s band structure: an electron state at 0.45 eV below the Fermi level with parallel momentum 1.03 Å⁻¹. By sweeping the angle from −90° to +90°, ARPES traces out the full E(k) dispersion. This is how the Cu(111) Shockley surface state — a nearly free 2D electron gas with effective mass m* ≈ 0.42m_e — was directly observed, confirming band theory predictions.</div>
 </div>
 </NCard>


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
 const [temp, setTemp] = useState(0); // 0=0K, 1=300K, 2=hot
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
 In a single atom, electrons sit on specific energy levels, like steps on a staircase. But in a crystal with many atoms, these steps spread out into wide bands. The lower band (valence band) is full of electrons. The upper band (conduction band) is empty. The space between them (band gap) decides if the material is a metal, semiconductor, or insulator.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* Band diagram */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 352 }}>
 <rect width={320} height={320} fill={T.bg} rx={10} />

 {/* Valence band */}
 <rect x={20} y={VBtop} width={W - 40} height={60} rx={4}
 fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
 <text x={30} y={VBtop + 18} fill={T.eo_valence} fontSize={11} fontWeight="bold">Valence Band</text>
 <text x={30} y={VBtop + 32} fill={T.muted} fontSize={9}>All states filled with electrons</text>
 <text x={30} y={VBtop + 44} fill={T.muted} fontSize={9}>from Zn and Te atoms</text>

 {/* Conduction band */}
 <rect x={20} y={40} width={W - 40} height={55} rx={4}
 fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
 <text x={30} y={60} fill={T.eo_cond} fontSize={12} fontWeight="bold">Conduction Band</text>
 <text x={30} y={76} fill={T.muted} fontSize={12}>Empty in pure crystal</text>
 <text x={30} y={90} fill={T.muted} fontSize={12}>Free electrons here = conductivity</text>

 {/* Band gap */}
 <rect x={20} y={CBbot} width={W - 40} height={VBtop - CBbot} rx={0}
 fill={T.bg} />
 <line x1={20} y1={(CBbot + VBtop) / 2} x2={280} y2={(CBbot + VBtop) / 2}
 stroke={T.border} strokeDasharray="4 4" />
 <text x={W / 2} y={(CBbot + VBtop) / 2 + 4} textAnchor="middle" fill={T.eo_gap} fontSize={13} fontWeight="bold">GAP</text>
 <text x={W / 2} y={(CBbot + VBtop) / 2 + 18} textAnchor="middle" fill={T.muted} fontSize={12} fontWeight="bold">E = {Egap} eV</text>

 {/* Gap label with arrow */}
 <line x1={W / 2 + 60} y1={CBbot + 2} x2={W / 2 + 60} y2={VBtop - 2}
 stroke={T.eo_gap} strokeWidth={1.5} />
 <text x={170} y={(CBbot + VBtop) / 2 - 6} textAnchor="middle" fill={T.eo_gap} fontSize={12}>
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
 cx={35 + i * 33} cy={VBtop + 52}
 r={4} fill={T.eo_valence} opacity={0.7} />
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
 {light ? " Light ON (photons hitting)" : " Light OFF"}
 </button>
 </div>
 </div>

 {/* Explanation */}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
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
 { icon: "", title: "Always: from atom valence electrons", desc: "ALL electrons in the crystal originally came from Zn and Te atoms. Valence band = reservoir of these electrons.", color: T.eo_valence },
 { icon: "", title: "Thermal: kT energy kicks them up", desc: `At 300K, kT=0.026eV. Gap=2.26eV. Chance = e^(-87) ≈ 10⁻³⁸. Almost zero for ZnTe.`, color: T.eo_hole },
 { icon: "", title: "Light: photon energy > band gap", desc: "Photon of 2.5eV hits a valence electron and kicks it to conduction band. This is photovoltaics!", color: T.eo_photon },
 { icon: "", title: "Defect: missing atom creates gap states", desc: "V_Zn vacancy creates states inside gap. Electrons from Te dangling bonds sit there. Much easier to excite.", color: T.eo_gap },
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

 <NCard title="Numerical Example: Effective Mass of Electrons in GaAs" color={T.eo_photon} formula={"v_th = √(3k_BT / m*)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Near the conduction band minimum of GaAs, the energy dispersion is approximately parabolic: E = ℏ²k²/(2m*). GaAs has an effective electron mass m*_e = 0.067m_e -- much lighter than a free electron. Calculate the thermal velocity at 300K and compare with a free electron.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Effective mass is the "apparent weight" an electron feels inside a crystal. The periodic potential of the lattice acts like a moving walkway at an airport -- an electron on the walkway (in a crystal) accelerates differently than one standing on solid ground (in vacuum). In GaAs, electrons ride a very fast walkway, making them behave as if they weigh only 6.7% of their true mass.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="GaAs effective mass" value="m* = 0.067 × m_e = 0.067 × 9.109×10⁻³¹ kg" />
 <InfoRow label="Boltzmann constant" value="k_B = 1.381 × 10⁻²³ J/K" />
 <InfoRow label="Temperature" value="T = 300 K" />
 <InfoRow label="Free electron mass" value="m_e = 9.109 × 10⁻³¹ kg" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate thermal velocity:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="v_th(GaAs) = √(3 × 1.381×10⁻²³ × 300 / (0.067 × 9.109×10⁻³¹))" result="" color={T.eo_photon} />
 <CalcRow eq="= √(1.243×10⁻²⁰ / 6.103×10⁻³²)" result="" color={T.eo_photon} />
 <CalcRow eq="= √(2.037 × 10¹¹)" result="v_th(GaAs) = 4.51 × 10⁵ m/s" color={T.eo_photon} />
 <CalcRow eq="v_th(free) = √(3k_BT/m_e) = √(1.243×10⁻²⁰/9.109×10⁻³¹)" result="v_th(free) = 1.17 × 10⁵ m/s" color={T.eo_photon} />
 <CalcRow eq="Ratio: v_th(GaAs) / v_th(free) = 1/√0.067" result="= 3.86× faster" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Electrons in GaAs move nearly 4x faster than free electrons at the same temperature because their effective mass is only 6.7% of the free electron mass. This light effective mass translates to high mobility (μ = eτ/m*), which is why GaAs is preferred over silicon for high-speed electronics and microwave transistors. The lighter the effective mass, the steeper the band curvature near the band edge.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Direct vs Indirect Band Gap -- GaAs vs Silicon" color={T.eo_photon} formula={"λ = hc/E_g, α ∝ (E-E_g)^(1/2) (direct)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> GaAs has a direct band gap of 1.42 eV, while silicon has an indirect gap of 1.12 eV. Calculate the absorption edge wavelength for each, and explain why GaAs dominates in LEDs and lasers while Si dominates in solar cells and logic.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In a direct gap material, the conduction band minimum and valence band maximum line up at the same momentum (same k-point). An electron can absorb or emit a photon straight up/down -- like jumping between two floors in an elevator. In an indirect gap material, the electron must also change momentum -- like needing to walk across the building while changing floors. This requires a phonon to help, making the process 100-1000x less efficient.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate photon wavelengths at band edge:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="hc" value="1240 eV·nm" />
 <InfoRow label="GaAs band gap" value="1.42 eV (direct, at Γ-point)" />
 <InfoRow label="Si band gap" value="1.12 eV (indirect, Γ to X)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate wavelengths and compare absorption:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="GaAs: λ = 1240/1.42" result="= 873 nm (near-IR)" color={T.eo_photon} />
 <CalcRow eq="Si: λ = 1240/1.12" result="= 1107 nm (IR)" color={T.eo_photon} />
 <CalcRow eq="GaAs absorption coefficient at Eg:" result="α ≈ 10⁴ cm⁻¹" color={T.eo_photon} />
 <CalcRow eq="Si absorption coefficient at Eg:" result="α ≈ 1 cm⁻¹ (10,000× weaker)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>GaAs absorbs light 10,000x more strongly at its band edge because direct transitions are allowed without phonon assistance. This means a 1 μm GaAs layer absorbs as much light as a 1 cm Si wafer. GaAs is therefore ideal for LEDs (efficient photon emission), laser diodes, and thin-film solar cells. Silicon requires thicker wafers (200-300 μm) but is far cheaper to produce, which is why it dominates the solar and electronics markets.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Intrinsic Carrier Concentration vs Temperature in Ge" color={T.eo_photon} formula={"n_i = √(N_c N_v) exp(−E_g/2kT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Germanium has E_g = 0.66 eV, N_c = 1.04 × 10¹⁹ cm⁻³, and N_v = 6.0 × 10¹⁸ cm⁻³ at 300 K. Calculate n_i at 300 K and 400 K. How does the narrower gap compared to Si (1.12 eV) affect the carrier count?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The band gap is the height of a fence electrons must jump. Germanium's fence is only 0.66 eV -- about 60% the height of silicon's 1.12 eV fence. At room temperature, exponentially more electrons clear this shorter barrier. A modest 100 K temperature increase dramatically boosts the jump rate because the exponential tail of thermal energy extends further over the barrier.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Band gap (Ge)" value="Eg = 0.66 eV" />
 <InfoRow label="N_c (Ge, 300 K)" value="1.04 × 10¹⁹ cm⁻³" />
 <InfoRow label="N_v (Ge, 300 K)" value="6.0 × 10¹⁸ cm⁻³" />
 <InfoRow label="kT at 300 K" value="0.02585 eV" />
 <InfoRow label="kT at 400 K" value="0.03446 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="√(N_c N_v) = √(1.04×10¹⁹ × 6.0×10¹⁸) = 7.90 × 10¹⁸ cm⁻³" result="" color={T.eo_photon} />
 <CalcRow eq="At 300 K: Eg/(2kT) = 0.66/(2×0.02585) = 12.76" result="" color={T.eo_photon} />
 <CalcRow eq="nᵢ(300 K) = 7.90×10¹⁸ × exp(−12.76)" result="n_i = 2.33 × 10¹³ cm⁻³" color={T.eo_photon} />
 <CalcRow eq="At 400 K: Eg/(2kT) = 0.66/(2×0.03446) = 9.58" result="" color={T.eo_photon} />
 <CalcRow eq="nᵢ(400 K) = 7.90×10¹⁸ × exp(−9.58)" result="n_i = 5.54 × 10¹⁴ cm⁻³" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Germanium's n_i at 300 K is about 2.3 × 10¹³ cm⁻³ -- roughly 1000× higher than silicon's ~1.5 × 10¹⁰ cm⁻³. Heating to 400 K increases n_i by 24×. This high intrinsic carrier count is why Ge transistors failed in early computing: at modest temperatures, thermal carriers overwhelmed the doping, making devices unreliable. Silicon's wider gap gives 1000× fewer intrinsic carriers and much better thermal stability.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Kronig-Penney Model -- Band Gap at Zone Boundary" color={T.eo_photon} formula={"Gap ≈ 2|V₁| where V₁ is first Fourier coefficient"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In the Kronig-Penney model, a 1D periodic potential with rectangular barriers of height V₀ = 5 eV and width b = 0.5 A, period a = 3 A, creates band gaps at k = nπ/a. Estimate the first band gap using the nearly-free-electron approximation.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine rolling a ball along a wavy road. On a flat road (free electron), the ball speeds up smoothly. But the periodic bumps (crystal potential) reflect some of the ball's energy at specific wavelengths, creating "forbidden speeds" -- energy gaps. The stronger the bumps, the wider the forbidden range. The first Fourier component of the bumps sets the first gap.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Barrier height" value="V₀ = 5 eV" />
 <InfoRow label="Barrier width" value="b = 0.5 A" />
 <InfoRow label="Period" value="a = 3.0 A" />
 <InfoRow label="First Fourier coefficient" value="V₁ = (2V₀/πn) sin(nπb/a) for n=1" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="V₁ = (2 × 5)/(π) × sin(π × 0.5/3.0)" result="" color={T.eo_photon} />
 <CalcRow eq="= (10/π) × sin(0.5236) = 3.183 × 0.500" result="V₁ = 1.59 eV" color={T.eo_photon} />
 <CalcRow eq="First band gap Egap ≈ 2|V₁|" result="E_gap ≈ 3.18 eV" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Kronig-Penney model predicts a 3.18 eV gap at the first Brillouin zone boundary -- comparable to the gap of wide-gap semiconductors like GaN (3.4 eV). The gap scales linearly with the potential strength V₀ and depends on the barrier width fraction b/a. This model elegantly shows how periodicity alone creates forbidden energy regions, bridging the free-electron picture and real band structures.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Bloch Oscillation Period in a Superlattice" color={T.eo_photon} formula={"T_B = h/(eEd)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A GaAs/AlAs superlattice has period d = 10 nm. An electric field E = 5 × 10⁶ V/m is applied along the growth direction. Calculate the Bloch oscillation period and frequency. Can these oscillations produce THz radiation?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In a crystal, an electron accelerated by a constant electric field doesn't speed up forever. When it reaches the Brillouin zone edge, it Bragg-reflects back to the opposite edge -- oscillating back and forth like a ball bouncing between two walls. In a superlattice with a large period d, these "Bloch oscillations" occur at accessible frequencies in the terahertz range.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Superlattice period" value="d = 10 nm = 10⁻⁸ m" />
 <InfoRow label="Electric field" value="E = 5 × 10⁶ V/m" />
 <InfoRow label="Planck constant" value="h = 6.626 × 10⁻³⁴ J·s" />
 <InfoRow label="Electron charge" value="e = 1.602 × 10⁻¹⁹ C" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="T_B = h/(eEd) = 6.626×10⁻³⁴ / (1.602×10⁻¹⁹ × 5×10⁶ × 10⁻⁸)" result="" color={T.eo_photon} />
 <CalcRow eq="= 6.626×10⁻³⁴ / (8.01×10⁻²¹)" result="T_B = 8.27 × 10⁻¹⁴ s = 82.7 fs" color={T.eo_photon} />
 <CalcRow eq="f_B = 1/T_B" result="f_B = 12.1 THz" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Bloch oscillation frequency of 12.1 THz falls squarely in the "THz gap" -- the frequency range between microwave electronics and infrared optics. This makes superlattices potential THz emitters for imaging, spectroscopy, and security screening. In bulk crystals, scattering destroys Bloch oscillations (τ ~ 100 fs is too short), but superlattices with larger d bring T_B into an observable range.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Deformation Potential -- Band Gap Shift Under Strain" color={T.eo_photon} formula={"ΔE_g = (a_c − a_v) × ε_hydro"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A thin GaAs film is grown epitaxially on Si (lattice mismatch ε = -4.1%). The hydrostatic deformation potentials are a_c = -7.17 eV (conduction band) and a_v = -1.16 eV (valence band). Calculate the band gap shift under biaxial compression.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Squeezing a crystal is like pressing the keys of a piano closer together -- it changes the pitch (energy levels). The deformation potential tells you how much each band edge shifts per unit strain. Compressive strain pushes bands apart (widens the gap), while tensile strain pulls them closer (narrows the gap).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Lattice mismatch" value="ε_∥ = (a_Si − a_GaAs)/a_GaAs = −4.1%" />
 <InfoRow label="Hydrostatic strain (biaxial)" value="ε_hydro = 2ε_∥(1 − C₁₂/C₁₁) ≈ 2(−0.041)(1 − 0.453) ≈ −0.0448" />
 <InfoRow label="CB deformation potential" value="a_c = −7.17 eV" />
 <InfoRow label="VB deformation potential" value="a_v = −1.16 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔE_CB = a_c × ε_hydro = (−7.17)(−0.0448)" result="= +0.321 eV (CB shifts up)" color={T.eo_photon} />
 <CalcRow eq="ΔE_VB = a_v × ε_hydro = (−1.16)(−0.0448)" result="= +0.052 eV (VB shifts up)" color={T.eo_photon} />
 <CalcRow eq="ΔEg = ΔE_CB − ΔE_VB = 0.321 − 0.052" result="ΔE_g = +0.269 eV" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Biaxial compression widens the GaAs gap from 1.42 eV to about 1.69 eV -- a 19% increase. This strain engineering is used in strained-Si transistors (Intel's 90 nm node onward) to boost mobility and in III-V quantum wells to tune laser wavelengths. The large 4.1% mismatch with Si makes thick coherent GaAs-on-Si films impossible; beyond a critical thickness, misfit dislocations relieve the strain.</div>
 </div>
 </NCard>

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
 The density of states counts how many spaces are available for electrons at each energy level. Think of it as counting empty chairs on each floor of a building. Where there are many chairs, electrons have many options. Where there are no chairs (the gap), electrons cannot go. The highest filled level at zero temperature is called the Fermi level.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>

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
 <path d={sOrbPath} fill="none" stroke="#7c3aed" strokeWidth={1.3} opacity={0.85} />
 <path d={pOrbPath} fill="none" stroke="#7c3aed" strokeWidth={1.3} opacity={0.85} />
 <path d={dOrbPath} fill="none" stroke="#7c3aed" strokeWidth={1.3} opacity={0.85} />

 {/* PDOS Legend */}
 <rect x={marginL + 4} y={marginT + 2} width={90} height={72} rx={3}
 fill={T.surface} stroke={T.border} strokeWidth={0.5} opacity={0.92} />
 <line x1={marginL + 8} y1={marginT + 14} x2={marginL + 22} y2={marginT + 14}
 stroke={T.eo_e} strokeWidth={2} />
 <text x={marginL + 25} y={marginT + 17} fontSize={13} fill={T.muted} fontFamily="monospace">Total</text>
 <line x1={marginL + 8} y1={marginT + 30} x2={marginL + 22} y2={marginT + 30}
 stroke="#7c3aed" strokeWidth={1.3} />
 <text x={marginL + 25} y={marginT + 33} fontSize={13} fill="#7c3aed" fontFamily="monospace">s-orb</text>
 <line x1={marginL + 8} y1={marginT + 46} x2={marginL + 22} y2={marginT + 46}
 stroke="#7c3aed" strokeWidth={1.3} />
 <text x={marginL + 25} y={marginT + 49} fontSize={13} fill="#7c3aed" fontFamily="monospace">p-orb</text>
 <line x1={marginL + 8} y1={marginT + 62} x2={marginL + 22} y2={marginT + 62}
 stroke="#7c3aed" strokeWidth={1.3} />
 <text x={marginL + 25} y={marginT + 65} fontSize={13} fill="#7c3aed" fontFamily="monospace">d-orb</text>

 <path d={fermiPath} fill="none" stroke={T.eo_photon} strokeWidth={1.5}
 strokeDasharray="4,3" opacity={0.8} />

 <line x1={marginL} y1={eToY(eFermiActual)} x2={marginL + plotW} y2={eToY(eFermiActual)}
 stroke={T.eo_hole} strokeWidth={2} strokeDasharray="6,4" />
 <text x={marginL + plotW - 2} y={eToY(eFermiActual) - 5}
 textAnchor="end" fontSize={11} fill={T.eo_hole} fontFamily="monospace" fontWeight="bold">E_F</text>

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
 fontSize={13} fill={T.dim} fontFamily="monospace">{e.toFixed(1)}</text>
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
 <span style={{ color: "#7c3aed" }}>s</span> / <span style={{ color: "#7c3aed" }}>p</span> / <span style={{ color: "#7c3aed" }}>d</span>: orbital-projected DOS
 </div>
 </div>
 </div>

 {/* Right: text panels — fills remaining width */}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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
 <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, color: "#7c3aed" }}>Orbital-Projected DOS (PDOS)</div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
 The total DOS can be decomposed into contributions from each atomic orbital type — this is the <b>Projected DOS (PDOS)</b>. It reveals <em>which orbitals</em> contribute states at each energy:
 </div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginTop: 6 }}>
 <span style={{ color: "#7c3aed", fontWeight: 600 }}>s-orbital</span>: Spherically symmetric. In ZnTe, Zn 4s dominates the <b>conduction band minimum</b> (CBM). Deeper VB has Te 5s.<br />
 <span style={{ color: "#7c3aed", fontWeight: 600 }}>p-orbital</span>: Directional (px, py, pz). Te 5p states dominate the <b>valence band maximum</b> (VBM) — the topmost occupied states.<br />
 <span style={{ color: "#7c3aed", fontWeight: 600 }}>d-orbital</span>: Zn 3d states form a <b>narrow peak</b> deep in the VB (~1.5 eV below VBM). Their sharpness reflects localized, atom-like character.
 </div>
 </div>
 <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
 <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, color: T.eo_photon }}>DFT Connection: Computing PDOS</div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
 In VASP, set <code style={{ background: T.panel, padding: "1px 4px", borderRadius: 3 }}>LORBIT=11</code> to project DOS onto atomic orbitals. The output <b>DOSCAR</b> contains total + atom/orbital-resolved DOS. Tools like <b>pymatgen</b>, <b>VASPKIT</b>, and <b>sumo</b> parse and plot PDOS. This reveals the orbital character of each band — essential for understanding optical transitions, bonding, and defect levels.
 </div>
 </div>

 <NCard title="Numerical Example: Fermi Energy of Copper" color={T.eo_photon} formula={"E_F = (ℏ²/2m)(3π²n)^(2/3)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Copper has one free electron per atom, giving n = 8.49 × 10²⁸ m⁻³. Calculate the Fermi energy and Fermi temperature. Why are room-temperature electrons in copper considered "cold"?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Fermi energy is the highest occupied energy level at absolute zero -- like the water line in a filled pool. In copper, this "water line" sits at 7 eV, which corresponds to a temperature of 81,600K. Room temperature (300K) is only 0.4% of this, so thermal energy barely ripples the surface. Only electrons within kT of the Fermi surface can participate in conduction.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather constants:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Free electron density" value="n = 8.49 × 10²⁸ m⁻³" />
 <InfoRow label="Reduced Planck constant" value="ℏ = 1.055 × 10⁻³⁴ J·s" />
 <InfoRow label="Electron mass" value="m_e = 9.109 × 10⁻³¹ kg" />
 <InfoRow label="Boltzmann constant" value="k_B = 1.381 × 10⁻²³ J/K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate Fermi energy and temperature:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="3π²n = 3π²(8.49×10²⁸) = 2.51 × 10³⁰ m⁻³" result="" color={T.eo_photon} />
 <CalcRow eq="(3π²n)^(2/3) = (2.51×10³⁰)^(2/3) = 1.85 × 10²⁰ m⁻²" result="" color={T.eo_photon} />
 <CalcRow eq="E_F = (1.055×10⁻³⁴)²/(2×9.109×10⁻³¹) × 1.85×10²⁰" result="" color={T.eo_photon} />
 <CalcRow eq="E_F = 6.12×10⁻⁶⁸/(1.822×10⁻³⁰) × 1.85×10²⁰" result="E_F = 1.13 × 10⁻¹⁸ J = 7.04 eV" color={T.eo_photon} />
 <CalcRow eq="T_F = E_F/k_B = 1.13×10⁻¹⁸ / 1.381×10⁻²³" result="T_F = 81,600 K" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Fermi energy of 7.04 eV corresponds to T_F = 81,600K -- far above the melting point of copper (1358K). At room temperature, T/T_F = 300/81,600 = 0.004, meaning only ~0.4% of electrons near the Fermi surface are thermally excited. This explains why metals have small electronic heat capacities (C_e ~ γT) and why the Drude model needed quantum corrections -- most electrons are "frozen" deep below E_F.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Carrier Concentration in Intrinsic Silicon at 300K" color={T.eo_photon} formula={"n_i = √(N_c × N_v) × exp(-E_g / 2kT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Intrinsic (undoped) silicon at room temperature. The effective density of states is N_c = 2.8 × 10¹⁹ cm⁻³ in the conduction band and N_v = 1.04 × 10¹⁹ cm⁻³ in the valence band. With E_g = 1.12 eV, how many free carriers exist?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>N_c and N_v are like the number of seats in the conduction and valence band "auditoriums." The exponential factor exp(-E_g/2kT) is the fraction of electrons with enough thermal energy to jump across the gap. Even with billions of available seats, the exponential suppression is so severe that only 1 in 10¹³ atoms donates a free carrier at room temperature.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather the parameters:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Conduction band DOS" value="N_c = 2.8 × 10¹⁹ cm⁻³" />
 <InfoRow label="Valence band DOS" value="N_v = 1.04 × 10¹⁹ cm⁻³" />
 <InfoRow label="Band gap" value="Eg = 1.12 eV" />
 <InfoRow label="kT at 300K" value="0.02585 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate intrinsic carrier concentration:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="√(N_c × N_v) = √(2.8×10¹⁹ × 1.04×10¹⁹)" result="= 1.71 × 10¹⁹ cm⁻³" color={T.eo_photon} />
 <CalcRow eq="Eg/(2kT) = 1.12/(2 × 0.02585) = 21.66" result="" color={T.eo_photon} />
 <CalcRow eq="exp(-21.66) = 3.89 × 10⁻¹⁰" result="" color={T.eo_photon} />
 <CalcRow eq="nᵢ = 1.71×10¹⁹ × 3.89×10⁻¹⁰" result="n_i ≈ 6.7 × 10⁹ cm⁻³" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Only about 1.5 × 10¹⁰ cm⁻³ free carriers exist in pure Si at 300K (the standard value; our simplified calculation gives 6.7 × 10⁹, close to the accepted value when using more precise parameters). Compare this with 5 × 10²² atoms/cm³ -- only 1 in every 3 trillion atoms contributes a free carrier! This is why intrinsic Si is a poor conductor and why doping (adding 10¹⁵-10¹⁸ impurity atoms/cm³) is essential to make useful devices.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Sommerfeld Electronic Heat Capacity of Copper" color={T.eo_photon} formula={"C_e = γT = (π²/3)(k_B²/E_F)nk_BT"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> At low temperatures, the electronic heat capacity of copper is measured as C_e = γT with γ = 0.695 mJ/(mol·K²). Verify this using the free-electron model with E_F = 7.04 eV. Why is electronic heat capacity so small compared to lattice heat capacity at room temperature?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a swimming pool (the Fermi sea). Only the surface ripples when wind blows (thermal energy). Electrons deep below the surface cannot absorb kT of energy because all nearby states are already occupied (Pauli exclusion). Only the fraction ~kT/E_F of electrons near the surface participate in heat capacity. At 300 K, that is only 0.4% of all electrons.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Fermi energy (Cu)" value="E_F = 7.04 eV = 1.128 × 10⁻¹⁸ J" />
 <InfoRow label="Free electron density" value="n = 8.49 × 10²⁸ m⁻³" />
 <InfoRow label="k_B" value="1.381 × 10⁻²³ J/K" />
 <InfoRow label="Avogadro number" value="N_A = 6.022 × 10²³ mol⁻¹" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="γ = (π²/2)(N_A k_B²/E_F) = (π²/2)(6.022×10²³ × (1.381×10⁻²³)²/1.128×10⁻¹⁸)" result="" color={T.eo_photon} />
 <CalcRow eq="= (4.935)(6.022×10²³ × 1.907×10⁻⁴⁶ / 1.128×10⁻¹⁸)" result="" color={T.eo_photon} />
 <CalcRow eq="= 4.935 × 1.018×10⁻⁴" result="γ = 5.02 × 10⁻⁴ J/(mol·K²) = 0.502 mJ/(mol·K²)" color={T.eo_photon} />
 <CalcRow eq="Experimental: γ = 0.695 mJ/(mol·K²)" result="Ratio = 0.695/0.502 = 1.38" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The free-electron model gives γ = 0.50 mJ/(mol·K²), while experiment measures 0.695 -- about 38% higher. The difference comes from electron-phonon interactions that enhance the effective mass (m* ≈ 1.38 m_e). At 300 K, C_e = 0.695 × 300 = 0.21 J/(mol·K), compared with the lattice contribution of 3R = 24.9 J/(mol·K). Electronic heat capacity is only ~0.8% of the total -- vindicating Sommerfeld's quantum theory over the classical Drude model which predicted 50%.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Fermi Level Shift with Phosphorus Doping in Si" color={T.eo_photon} formula={"E_F − E_i = kT ln(n/n_i)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Silicon is doped with N_D = 10¹⁶ cm⁻³ phosphorus atoms (n-type). Given n_i = 1.5 × 10¹⁰ cm⁻³ at 300 K, how far does the Fermi level shift from its intrinsic (mid-gap) position toward the conduction band?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Fermi level is the "water table" of electrons. In pure silicon, the water table sits at mid-gap. Adding phosphorus donors is like drilling artesian wells -- each P atom releases a free electron, raising the water table toward the conduction band. The more donors, the higher E_F rises, until at very heavy doping the material becomes "degenerate" (metallic).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Donor concentration" value="N_D = 10¹⁶ cm⁻³" />
 <InfoRow label="Intrinsic carrier concentration" value="nᵢ = 1.5 × 10¹⁰ cm⁻³" />
 <InfoRow label="kT at 300 K" value="0.02585 eV" />
 <InfoRow label="Si band gap" value="Eg = 1.12 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="n ≈ N_D = 10¹⁶ cm⁻³ (full ionization at 300 K)" result="" color={T.eo_photon} />
 <CalcRow eq="E_F − E_i = kT ln(N_D/nᵢ) = 0.02585 × ln(10¹⁶/1.5×10¹⁰)" result="" color={T.eo_photon} />
 <CalcRow eq="= 0.02585 × ln(6.67 × 10⁵) = 0.02585 × 13.41" result="E_F − E_i = 0.347 eV" color={T.eo_photon} />
 <CalcRow eq="E_F position: E_c − E_F = Eg/2 − 0.347 = 0.56 − 0.347" result="= 0.213 eV below E_c" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Doping with 10¹⁶ P/cm³ shifts E_F by 0.347 eV above mid-gap, placing it 0.213 eV below E_c. This is well within the non-degenerate regime. The hole concentration drops to p = n_i²/n = 2.25 × 10⁴ cm⁻³ -- a factor of 10¹² below the electron concentration. This asymmetry is what creates rectifying p-n junctions and makes transistors possible.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: 1D van Hove Singularity -- DOS of a Carbon Nanotube" color={T.eo_photon} formula={"g₁D(E) = (1/π) × (2m*/ℏ²)^(1/2) × 1/√(E−Eₙ)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A (10,0) semiconducting carbon nanotube has its first van Hove singularity at E₁ = 0.45 eV above the charge neutrality point. Calculate the 1D DOS at E = 0.50 eV using effective mass m* = 0.06 m_e. What is the physical meaning of the divergence at E₁?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In 1D, the density of states diverges (blows up) at the bottom of each subband -- like cars piling up at a toll booth entrance. At the subband edge, the band is flat (dE/dk = 0), so many k-states map to the same energy. This creates sharp spikes in the DOS that produce dramatic optical absorption peaks, making nanotubes identifiable by color.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="First subband edge" value="E₁ = 0.45 eV" />
 <InfoRow label="Evaluation energy" value="E = 0.50 eV → E − E₁ = 0.05 eV" />
 <InfoRow label="Effective mass" value="m* = 0.06 m_e = 5.47 × 10⁻³² kg" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E − E₁ = 0.05 eV = 8.01 × 10⁻²¹ J" result="" color={T.eo_photon} />
 <CalcRow eq="(2m*/ℏ²)^(1/2) = (2 × 5.47×10⁻³² / (1.055×10⁻³⁴)²)^(1/2)" result="" color={T.eo_photon} />
 <CalcRow eq="= (9.83 × 10³⁶)^(1/2) = 3.135 × 10¹⁸ m⁻¹J⁻¹/²" result="" color={T.eo_photon} />
 <CalcRow eq="g₁D = (1/π) × 3.135×10¹⁸ / √(8.01×10⁻²¹)" result="g₁D = 1.12 × 10²⁸ m⁻¹J⁻¹" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Just 0.05 eV above the subband edge, the 1D DOS is already enormous due to the 1/√(E−E₁) singularity. At E = E₁ exactly, the DOS diverges to infinity (in theory; broadening rounds it in practice). These van Hove singularities create sharp absorption/emission peaks that depend on tube diameter, explaining why sorted nanotubes of specific chiralities display distinct colors and narrow-linewidth fluorescence.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: 2D Quantum Well DOS -- Step Function in GaAs" color={T.eo_photon} formula={"g₂D = m*/(πℏ²) per subband (constant)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A GaAs quantum well (m* = 0.067 m_e) of width L = 5 nm confines electrons to 2D. Calculate the constant DOS per subband and the energy of the first two subbands. How does 2D DOS differ from 3D?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In 3D, the DOS rises smoothly like a hill (∝ √E). In 2D, it looks like a staircase -- each step appears when a new quantum-well subband "turns on." Within each step, the DOS is perfectly flat because 2D motion has equal state density at every energy. This staircase shape gives quantum well lasers their superior threshold and gain properties compared to bulk lasers.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Effective mass" value="m* = 0.067 × 9.109×10⁻³¹ = 6.10 × 10⁻³² kg" />
 <InfoRow label="Well width" value="L = 5 nm = 5 × 10⁻⁹ m" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="g₂D = m*/(πℏ²) = 6.10×10⁻³² / (π × (1.055×10⁻³⁴)²)" result="" color={T.eo_photon} />
 <CalcRow eq="= 6.10×10⁻³² / (3.496×10⁻⁶⁸)" result="g₂D = 1.745 × 10³⁶ m⁻²J⁻¹ = 2.79 × 10¹⁷ m⁻²eV⁻¹" color={T.eo_photon} />
 <CalcRow eq="E₁ = ℏ²π²/(2m*L²) = (1.055×10⁻³⁴)²π²/(2×6.10×10⁻³²×(5×10⁻⁹)²)" result="E₁ = 0.036 eV" color={T.eo_photon} />
 <CalcRow eq="E₂ = 4 × E₁" result="E₂ = 0.144 eV" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Each 2D subband contributes a constant DOS of 2.79 × 10¹⁷ m⁻²eV⁻¹. The first subband starts at E₁ = 36 meV and the second at E₂ = 144 meV above the well bottom. The step-like DOS means that electrons accumulate at specific energies rather than spreading out, producing sharp optical transitions. This is why quantum well LEDs and lasers are more efficient and have narrower emission linewidths than bulk devices.</div>
 </div>
 </NCard>

 </div>
 </div>
 </div>
 );
}

// ─── Interactive Polymer Builder ─────────────────────────────────────────────

function PolymerBuilder() {
 const monomers = [
 { id: "ethylene", label: "Ethylene (PE)", formula: "CH₂=CH₂", color: "#7c3aed", repeat: "–CH₂–CH₂–", bandGap: "8.8 eV", use: "Bags, bottles, pipes" },
 { id: "propylene", label: "Propylene (PP)", formula: "CH₂=CHCH₃", color: "#7c3aed", repeat: "–CH₂–CH(CH₃)–", bandGap: "8.0 eV", use: "Containers, fibers, car parts" },
 { id: "styrene", label: "Styrene (PS)", formula: "CH₂=CHC₆H₅", color: "#7c3aed", repeat: "–CH₂–CH(C₆H₅)–", bandGap: "4.5 eV", use: "Foam cups, insulation" },
 { id: "vinylchloride", label: "Vinyl Chloride (PVC)", formula: "CH₂=CHCl", color: "#7c3aed", repeat: "–CH₂–CHCl–", bandGap: "6.2 eV", use: "Pipes, flooring, cables" },
 { id: "tetrafluoroethylene", label: "Tetrafluoroethylene (PTFE)", formula: "CF₂=CF₂", color: "#7c3aed", repeat: "–CF₂–CF₂–", bandGap: "10.0 eV", use: "Non-stick (Teflon), seals" },
 { id: "acetylene", label: "Acetylene (PA)", formula: "CH≡CH", color: "#7c3aed", repeat: "–CH=CH–", bandGap: "1.5 eV", use: "Conducting polymer!" },
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
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: "1.5px solid #7c3aed33" }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", marginBottom: 10 }}>Interactive Polymer Builder</div>
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
 <text x={x} y={y + 3.5} textAnchor="middle" fill={m.color} fontSize={12} fontWeight="bold">
 {m.id === "ethylene" ? "PE" : m.id === "propylene" ? "PP" : m.id === "styrene" ? "PS" : m.id === "vinylchloride" ? "PVC" : m.id === "tetrafluoroethylene" ? "PTFE" : "PA"}
 </text>
 </g>
 );
 })}
 {chain.length > 0 && <>
 <text x={10} y={15} fill={T.muted} fontSize={12}>n = {chain.length} units</text>
 <text x={svgW - 10} y={15} textAnchor="end" fill="#7c3aed" fontSize={12} fontWeight="bold">
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
 <div style={{ width: "100%", background: "#7c3aed11", borderRadius: 8, padding: 10, border: "1px solid #7c3aed33" }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>Conjugated Polymer Detected!</div>
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

// ─── Interactive Metal Alloy Explorer ────────────────────────────────────────

function MetalAlloyExplorer() {
 const [base, setBase] = useState("Cu");
 const [alloyElement, setAlloyElement] = useState("Zn");
 const [percentage, setPercentage] = useState(10);

 const bases = ["Cu", "Al", "Fe", "Ti"];
 const alloys = ["Zn", "Sn", "Ni", "Cr", "C"];

 const alloyNames = {
 "Cu+Zn": "Brass", "Cu+Sn": "Bronze", "Cu+Ni": "Cupronickel", "Cu+Cr": "Cu-Cr Alloy", "Cu+C": "Cu-C Composite",
 "Al+Zn": "Al-Zn Alloy", "Al+Sn": "Al-Sn Alloy", "Al+Ni": "Al-Ni Alloy", "Al+Cr": "Al-Cr Alloy", "Al+Cu": "Duralumin",
 "Fe+Zn": "Galvanized Steel", "Fe+Sn": "Tinplate Steel", "Fe+Ni": "Invar", "Fe+Cr": "Stainless Steel", "Fe+C": "Steel",
 "Ti+Zn": "Ti-Zn Alloy", "Ti+Sn": "Ti-Sn Alloy", "Ti+Ni": "Nitinol", "Ti+Cr": "Ti-Cr Alloy", "Ti+C": "Ti-C Composite",
 };

 const alloyProps = {
 "Cu+Zn": { strength: 60, conductivity: 55, corrosion: 65 },
 "Cu+Sn": { strength: 70, conductivity: 40, corrosion: 80 },
 "Cu+Ni": { strength: 55, conductivity: 30, corrosion: 85 },
 "Cu+Cr": { strength: 65, conductivity: 60, corrosion: 70 },
 "Cu+C": { strength: 50, conductivity: 65, corrosion: 50 },
 "Al+Zn": { strength: 65, conductivity: 50, corrosion: 40 },
 "Al+Sn": { strength: 40, conductivity: 55, corrosion: 45 },
 "Al+Ni": { strength: 60, conductivity: 45, corrosion: 55 },
 "Al+Cr": { strength: 55, conductivity: 48, corrosion: 65 },
 "Al+Cu": { strength: 80, conductivity: 45, corrosion: 50 },
 "Fe+Zn": { strength: 55, conductivity: 35, corrosion: 75 },
 "Fe+Sn": { strength: 50, conductivity: 30, corrosion: 70 },
 "Fe+Ni": { strength: 60, conductivity: 25, corrosion: 65 },
 "Fe+Cr": { strength: 70, conductivity: 20, corrosion: 95 },
 "Fe+C": { strength: 90, conductivity: 15, corrosion: 30 },
 "Ti+Zn": { strength: 65, conductivity: 15, corrosion: 80 },
 "Ti+Sn": { strength: 60, conductivity: 12, corrosion: 85 },
 "Ti+Ni": { strength: 75, conductivity: 10, corrosion: 90 },
 "Ti+Cr": { strength: 70, conductivity: 12, corrosion: 88 },
 "Ti+C": { strength: 85, conductivity: 8, corrosion: 92 },
 };

 const key = `${base}+${alloyElement}`;
 const name = alloyNames[key] || `${base}-${alloyElement} Alloy`;
 const props = alloyProps[key] || { strength: 50, conductivity: 50, corrosion: 50 };
 const baseColor = "#7c3aed";
 const alloyColor = "#7c3aed";

 // Generate lattice positions with some alloy atoms
 const gridSize = 8;
 const atoms = [];
 for (let row = 0; row < gridSize; row++) {
 for (let col = 0; col < gridSize; col++) {
 const isAlloy = ((row * 7 + col * 13 + row * col * 3) % 100) < percentage;
 atoms.push({ x: 30 + col * 35, y: 30 + row * 35, isAlloy });
 }
 }

 return (
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: "1.5px solid #7c3aed33" }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", marginBottom: 10 }}>Interactive Metal Alloy Explorer</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
 Pick a base metal and alloying element to see how alloys form. Adjust the percentage and watch the crystal lattice change!
 </div>

 {/* Controls */}
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Base Metal</div>
 <div style={{ display: "flex", gap: 4 }}>
 {bases.map(b => (
 <button key={b} onClick={() => setBase(b)} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: b === base ? baseColor + "22" : T.surface,
 border: `1.5px solid ${b === base ? baseColor : T.border}`,
 color: b === base ? baseColor : T.muted, cursor: "pointer",
 }}>{b}</button>
 ))}
 </div>
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Alloying Element</div>
 <div style={{ display: "flex", gap: 4 }}>
 {alloys.map(a => (
 <button key={a} onClick={() => setAlloyElement(a)} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: a === alloyElement ? alloyColor + "22" : T.surface,
 border: `1.5px solid ${a === alloyElement ? alloyColor : T.border}`,
 color: a === alloyElement ? alloyColor : T.muted, cursor: "pointer",
 }}>{a}</button>
 ))}
 </div>
 </div>
 </div>

 {/* Percentage slider */}
 <div style={{ marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Alloy Percentage: {percentage}%</div>
 <input type="range" min={0} max={30} value={percentage} onChange={e => setPercentage(Number(e.target.value))}
 style={{ width: "100%", accentColor: baseColor }} />
 </div>

 {/* Lattice SVG */}
 <svg viewBox="0 0 340 340" style={{ width: "100%", maxWidth: 374, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 12 }}>
 {atoms.map((a, i) => (
 <g key={i}>
 <circle cx={a.x} cy={a.y} r={12} fill={a.isAlloy ? alloyColor + "33" : baseColor + "33"} stroke={a.isAlloy ? alloyColor : baseColor} strokeWidth={1.5} />
 <text x={a.x} y={a.y + 4} textAnchor="middle" fill={a.isAlloy ? alloyColor : baseColor} fontSize={12} fontWeight="bold" fontFamily="monospace">
 {a.isAlloy ? alloyElement : base}
 </text>
 </g>
 ))}
 <text x={170} y={330} textAnchor="middle" fill={T.ink} fontSize={13} fontWeight="bold" fontFamily="monospace">
 {name} ({percentage}% {alloyElement})
 </text>
 </svg>

 {/* Property bars */}
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
 {[
 { label: "Strength", value: props.strength, color: "#7c3aed" },
 { label: "Conductivity", value: props.conductivity, color: "#7c3aed" },
 { label: "Corrosion Resistance", value: props.corrosion, color: "#7c3aed" },
 ].map(p => (
 <div key={p.label} style={{ flex: 1, minWidth: 90, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{p.label}</div>
 <div style={{ height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}>
 <div style={{ width: `${p.value}%`, height: "100%", background: p.color, borderRadius: 4, transition: "width 0.3s" }} />
 </div>
 <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginTop: 4 }}>{p.value}%</div>
 </div>
 ))}
 </div>
 </div>
 );
}

// ─── Interactive Semiconductor Doping Tool ──────────────────────────────────

function SemiconductorDopingTool() {
 const [host, setHost] = useState("Si");
 const [dopantType, setDopantType] = useState("n-type");
 const [concentration, setConcentration] = useState(16);
 const [frame, setFrame] = useState(0);

 useEffect(() => {
 const id = setInterval(() => setFrame(f => f + 1), 60);
 return () => clearInterval(id);
 }, []);

 const hosts = ["Si", "GaAs", "CdTe"];
 const dopant = dopantType === "n-type" ? "P" : "B";
 const carrierLabel = dopantType === "n-type" ? "Electron (e⁻)" : "Hole (h⁺)";
 const carrierColor = dopantType === "n-type" ? "#7c3aed" : "#7c3aed";
 const fermiShift = dopantType === "n-type" ? "Shifts UP toward conduction band" : "Shifts DOWN toward valence band";

 const concDisplay = `10^${concentration} cm⁻³`;
 const conductivityChange = concentration <= 15 ? "Low" : concentration <= 16 ? "Moderate" : concentration <= 17 ? "High" : "Very High";

 // 5x5 grid, dopant at (2,2)
 const gridN = 5;
 const spacing = 56;
 const offset = 30;
 const dopantRow = 2, dopantCol = 2;

 // Bouncing carrier animation
 const bx = offset + dopantCol * spacing + Math.sin(frame * 0.08) * 20;
 const by = offset + dopantRow * spacing - 20 + Math.cos(frame * 0.06) * 15;

 return (
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: "1.5px solid #7c3aed33" }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", marginBottom: 10 }}>Interactive Semiconductor Doping Simulator</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
 Select a host semiconductor and dopant type to see how doping creates free carriers. Watch the extra electron or hole bounce around!
 </div>

 {/* Controls */}
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Host Material</div>
 <div style={{ display: "flex", gap: 4 }}>
 {hosts.map(h => (
 <button key={h} onClick={() => setHost(h)} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: h === host ? "#7c3aed" + "22" : T.surface,
 border: `1.5px solid ${h === host ? "#7c3aed" : T.border}`,
 color: h === host ? "#7c3aed" : T.muted, cursor: "pointer",
 }}>{h}</button>
 ))}
 </div>
 </div>
 <div>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Dopant Type</div>
 <div style={{ display: "flex", gap: 4 }}>
 {["n-type", "p-type"].map(d => (
 <button key={d} onClick={() => setDopantType(d)} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: d === dopantType ? carrierColor + "22" : T.surface,
 border: `1.5px solid ${d === dopantType ? carrierColor : T.border}`,
 color: d === dopantType ? carrierColor : T.muted, cursor: "pointer",
 }}>{d}</button>
 ))}
 </div>
 </div>
 </div>

 {/* Concentration slider */}
 <div style={{ marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Dopant Concentration: {concDisplay}</div>
 <input type="range" min={14} max={18} step={0.5} value={concentration} onChange={e => setConcentration(Number(e.target.value))}
 style={{ width: "100%", accentColor: "#7c3aed" }} />
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted }}>
 <span>10^14</span><span>10^18</span>
 </div>
 </div>

 {/* Lattice SVG */}
 <svg viewBox="0 0 340 340" style={{ width: "100%", maxWidth: 374, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 12 }}>
 {Array.from({ length: gridN }, (_, row) =>
 Array.from({ length: gridN }, (_, col) => {
 const x = offset + col * spacing;
 const y = offset + row * spacing;
 const isDopant = row === dopantRow && col === dopantCol;
 const atomColor = isDopant ? carrierColor : "#6b7280";
 const atomLabel = isDopant ? dopant : (host === "Si" ? "Si" : host === "GaAs" ? ((row + col) % 2 === 0 ? "Ga" : "As") : ((row + col) % 2 === 0 ? "Cd" : "Te"));
 return (
 <g key={`${row}-${col}`}>
 {col < gridN - 1 && <line x1={x + 14} y1={y} x2={x + spacing - 14} y2={y} stroke={T.border} strokeWidth={1.5} />}
 {row < gridN - 1 && <line x1={x} y1={y + 14} x2={x} y2={y + spacing - 14} stroke={T.border} strokeWidth={1.5} />}
 <circle cx={x} cy={y} r={14} fill={isDopant ? carrierColor + "22" : "#6b728022"} stroke={atomColor} strokeWidth={isDopant ? 2.5 : 1.5} />
 <text x={x} y={y + 4} textAnchor="middle" fill={atomColor} fontSize={12} fontWeight={isDopant ? "bold" : "normal"} fontFamily="monospace">{atomLabel}</text>
 </g>
 );
 })
 )}
 {/* Bouncing carrier */}
 <circle cx={bx} cy={by} r={6} fill={carrierColor} opacity={0.8}>
 <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
 </circle>
 <text x={bx} y={by - 10} textAnchor="middle" fill={carrierColor} fontSize={12} fontWeight="bold" fontFamily="monospace">
 {dopantType === "n-type" ? "e⁻" : "h⁺"}
 </text>
 <text x={170} y={330} textAnchor="middle" fill={T.ink} fontSize={13} fontWeight="bold" fontFamily="monospace">
 {host} doped with {dopant} ({dopantType})
 </text>
 </svg>

 {/* Info panels */}
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
 {[
 { label: "Carrier Type", value: carrierLabel, color: carrierColor },
 { label: "Conductivity", value: conductivityChange, color: "#7c3aed" },
 { label: "Fermi Level", value: fermiShift, color: "#7c3aed" },
 ].map(p => (
 <div key={p.label} style={{ flex: 1, minWidth: 90, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{p.label}</div>
 <div style={{ fontSize: 12, fontWeight: 700, color: p.color, fontFamily: "monospace" }}>{p.value}</div>
 </div>
 ))}
 </div>
 </div>
 );
}

// ─── Interactive Insulator Breakdown Explorer ───────────────────────────────

function InsulatorExplorer() {
 const [material, setMaterial] = useState("SiO2");
 const [voltage, setVoltage] = useState(0);
 const [frame, setFrame] = useState(0);

 useEffect(() => {
 const id = setInterval(() => setFrame(f => f + 1), 50);
 return () => clearInterval(id);
 }, []);

 const materials = {
 SiO2: { label: "SiO₂", breakdownV: 30, gap: 9.0, color: "#7c3aed", dielectric: 30 },
 Diamond: { label: "Diamond", breakdownV: 20, gap: 5.5, color: "#7c3aed", dielectric: 20 },
 Al2O3: { label: "Al₂O₃", breakdownV: 17, gap: 8.8, color: "#7c3aed", dielectric: 17 },
 Glass: { label: "Glass", breakdownV: 12, gap: 7.0, color: "#7c3aed", dielectric: 12 },
 };

 const mat = materials[material];
 const isBreakdown = voltage >= mat.breakdownV;
 const voltageRatio = voltage / mat.breakdownV;

 // Band diagram coordinates
 const bandL = 40, bandR = 300;
 const Ev_y = 250, Ec_y = 80;
 const gapMid = (Ev_y + Ec_y) / 2;

 return (
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1.5px solid ${mat.color}33` }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", marginBottom: 10 }}>Interactive Insulator Breakdown Simulator</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
 Pick an insulator and increase the voltage. Watch what happens when the electric field exceeds the dielectric strength!
 </div>

 {/* Material selector */}
 <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
 {Object.entries(materials).map(([id, m]) => (
 <button key={id} onClick={() => { setMaterial(id); setVoltage(0); }} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: id === material ? m.color + "22" : T.surface,
 border: `1.5px solid ${id === material ? m.color : T.border}`,
 color: id === material ? m.color : T.muted, cursor: "pointer",
 }}>{m.label}</button>
 ))}
 </div>

 {/* Voltage slider */}
 <div style={{ marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: isBreakdown ? "#7c3aed" : T.ink, marginBottom: 4 }}>
 Applied Voltage: {voltage} MV/m {isBreakdown ? " — BREAKDOWN!" : ""}
 </div>
 <input type="range" min={0} max={Math.round(mat.breakdownV * 1.2)} value={voltage} onChange={e => setVoltage(Number(e.target.value))}
 style={{ width: "100%", accentColor: isBreakdown ? "#7c3aed" : mat.color }} />
 </div>

 {/* Band diagram SVG */}
 <svg viewBox="0 0 340 340" style={{ width: "100%", maxWidth: 374, background: T.surface, borderRadius: 8, border: `1px solid ${isBreakdown ? "#7c3aed" : T.border}`, marginBottom: 12 }}>
 {/* Conduction band */}
 <rect x={bandL} y={Ec_y - 10} width={bandR - bandL} height={20} fill={mat.color + "22"} stroke={mat.color} strokeWidth={1.5} rx={4} />
 <text x={bandL - 5} y={Ec_y + 5} textAnchor="end" fill={mat.color} fontSize={12} fontFamily="monospace">CB</text>

 {/* Valence band */}
 <rect x={bandL} y={Ev_y - 10} width={bandR - bandL} height={20} fill={mat.color + "22"} stroke={mat.color} strokeWidth={1.5} rx={4} />
 <text x={bandL - 5} y={Ev_y + 5} textAnchor="end" fill={mat.color} fontSize={12} fontFamily="monospace">VB</text>

 {/* Band gap label */}
 <line x1={bandR + 10} y1={Ec_y + 10} x2={bandR + 10} y2={Ev_y - 10} stroke={T.muted} strokeWidth={1} strokeDasharray="3,3" />
 <text x={bandR + 16} y={gapMid + 4} fill={T.muted} fontSize={11} fontFamily="monospace">
 {mat.gap} eV
 </text>

 {/* Arrows trying to push electrons across */}
 {Array.from({ length: Math.min(Math.floor(voltageRatio * 8), 8) }, (_, i) => {
 const ax = bandL + 20 + i * 30;
 const arrowLen = Math.min(voltageRatio * (Ev_y - Ec_y - 30), Ev_y - Ec_y - 30);
 return (
 <g key={i} opacity={0.4 + voltageRatio * 0.6}>
 <line x1={ax} y1={Ev_y - 15} x2={ax} y2={Ev_y - 15 - arrowLen} stroke="#7c3aed" strokeWidth={2} />
 <polygon points={`${ax},${Ev_y - 15 - arrowLen - 5} ${ax - 4},${Ev_y - 15 - arrowLen + 3} ${ax + 4},${Ev_y - 15 - arrowLen + 3}`} fill="#7c3aed" />
 </g>
 );
 })}

 {/* Breakdown effect */}
 {isBreakdown && Array.from({ length: 12 }, (_, i) => {
 const ex = bandL + 20 + (i * 23) % (bandR - bandL - 40);
 const ey = Ec_y + 10 + ((frame * 3 + i * 17) % (Ev_y - Ec_y - 20));
 return <circle key={i} cx={ex} cy={ey} r={4} fill="#7c3aed" opacity={0.6 + 0.4 * Math.sin(frame * 0.1 + i)}>
 <animate attributeName="r" values="3;6;3" dur="0.5s" repeatCount="indefinite" />
 </circle>;
 })}

 {isBreakdown && (
 <text x={170} y={gapMid} textAnchor="middle" fill="#7c3aed" fontSize={18} fontWeight="bold" fontFamily="monospace">
 BREAKDOWN!
 </text>
 )}

 <text x={170} y={20} textAnchor="middle" fill={T.ink} fontSize={12} fontWeight="bold" fontFamily="monospace">
 {mat.label} Band Diagram
 </text>
 </svg>

 {/* Dielectric strength comparison */}
 <div style={{ background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Dielectric Strength Comparison (MV/m)</div>
 {Object.entries(materials).map(([id, m]) => (
 <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
 <div style={{ width: 50, fontSize: 12, fontWeight: 600, color: m.color, fontFamily: "monospace" }}>{m.label}</div>
 <div style={{ flex: 1, height: 10, background: T.border, borderRadius: 4, overflow: "hidden" }}>
 <div style={{ width: `${(m.dielectric / 35) * 100}%`, height: "100%", background: m.color, borderRadius: 4 }} />
 </div>
 <div style={{ fontSize: 12, fontWeight: 600, color: m.color, width: 30, textAlign: "right" }}>{m.dielectric}</div>
 </div>
 ))}
 </div>
 </div>
 );
}

// ─── Interactive Ceramic Property Explorer ──────────────────────────────────

function CeramicExplorer() {
 const [selected, setSelected] = useState("Al2O3");

 const ceramics = {
 Al2O3: { label: "Al₂O₃", crystal: "Corundum (hexagonal)", app: "Abrasives, spark plugs, biomedical implants",
 hardness: 90, melting: 85, thermalCond: 30, fracture: 35, cost: 30 },
 ZrO2: { label: "ZrO₂", crystal: "Monoclinic / Tetragonal (stabilized)", app: "Dental crowns, thermal barriers, oxygen sensors",
 hardness: 75, melting: 80, thermalCond: 15, fracture: 70, cost: 55 },
 SiC: { label: "SiC", crystal: "Zinc blende / Wurtzite", app: "Brake discs, armor, power electronics (wide-gap semiconductor)",
 hardness: 95, melting: 90, thermalCond: 85, fracture: 30, cost: 65 },
 BN: { label: "BN", crystal: "Hexagonal (like graphite) or cubic", app: "Cutting tools (cBN), lubricant (hBN), cosmetics",
 hardness: 85, melting: 75, thermalCond: 70, fracture: 25, cost: 80 },
 Si3N4: { label: "Si₃N₄", crystal: "Hexagonal", app: "Bearings, turbocharger rotors, engine parts",
 hardness: 80, melting: 70, thermalCond: 25, fracture: 60, cost: 70 },
 };

 const cer = ceramics[selected];
 const mainColor = "#7c3aed";

 // Radar chart
 const stats = [
 { label: "Hardness", value: cer.hardness },
 { label: "Melt Pt", value: cer.melting },
 { label: "Therm.K", value: cer.thermalCond },
 { label: "Toughness", value: cer.fracture },
 { label: "Cost", value: cer.cost },
 ];
 const cx = 170, cy = 150, maxR = 100;
 const angleStep = (2 * Math.PI) / stats.length;

 const radarPoints = stats.map((s, i) => {
 const angle = -Math.PI / 2 + i * angleStep;
 const r = (s.value / 100) * maxR;
 return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
 });
 const radarPath = radarPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

 return (
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1.5px solid ${mainColor}33` }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: mainColor, marginBottom: 10 }}>Interactive Ceramic Property Explorer</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 10, lineHeight: 1.6 }}>
 Select a ceramic to compare properties on the radar chart. Each axis represents a normalized property (0-100 scale).
 </div>

 {/* Selector */}
 <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
 {Object.entries(ceramics).map(([id, c]) => (
 <button key={id} onClick={() => setSelected(id)} style={{
 padding: "5px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
 background: id === selected ? mainColor + "22" : T.surface,
 border: `1.5px solid ${id === selected ? mainColor : T.border}`,
 color: id === selected ? mainColor : T.muted, cursor: "pointer",
 }}>{c.label}</button>
 ))}
 </div>

 {/* Radar chart SVG */}
 <svg viewBox="0 0 340 340" style={{ width: "100%", maxWidth: 374, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 12 }}>
 {/* Grid rings */}
 {[20, 40, 60, 80, 100].map(pct => {
 const r = (pct / 100) * maxR;
 const pts = stats.map((_, i) => {
 const angle = -Math.PI / 2 + i * angleStep;
 return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
 }).join(" ");
 return <polygon key={pct} points={pts} fill="none" stroke={T.border} strokeWidth={1} />;
 })}

 {/* Axis lines and labels */}
 {stats.map((s, i) => {
 const angle = -Math.PI / 2 + i * angleStep;
 const lx = cx + (maxR + 20) * Math.cos(angle);
 const ly = cy + (maxR + 20) * Math.sin(angle);
 return (
 <g key={i}>
 <line x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke={T.border} strokeWidth={1} />
 <text x={lx} y={ly + 4} textAnchor="middle" fill={T.muted} fontSize={12} fontFamily="monospace">{s.label}</text>
 </g>
 );
 })}

 {/* Data polygon */}
 <path d={radarPath} fill={mainColor + "22"} stroke={mainColor} strokeWidth={2} />
 {radarPoints.map((p, i) => (
 <circle key={i} cx={p.x} cy={p.y} r={4} fill={mainColor} />
 ))}

 <text x={170} y={330} textAnchor="middle" fill={T.ink} fontSize={13} fontWeight="bold" fontFamily="monospace">
 {cer.label} Properties
 </text>
 </svg>

 {/* Info panels */}
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
 <div style={{ flex: 1, minWidth: 140, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Crystal Structure</div>
 <div style={{ fontSize: 12, fontWeight: 700, color: mainColor, fontFamily: "monospace" }}>{cer.crystal}</div>
 </div>
 <div style={{ flex: 1, minWidth: 140, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Key Application</div>
 <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{cer.app}</div>
 </div>
 </div>
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
 { id: "metal", label: "Metal", color: "#7c3aed", bandGap: 0, example: "Cu, Al, Fe", conductivity: "10⁶ – 10⁸ S/m" },
 { id: "semiconductor", label: "Semiconductor", color: "#7c3aed", bandGap: 0.5, example: "Si, GaAs, CdTe", conductivity: "10⁻⁶ – 10⁴ S/m" },
 { id: "insulator", label: "Insulator", color: "#7c3aed", bandGap: 5.0, example: "SiO₂, Diamond, Al₂O₃", conductivity: "< 10⁻¹⁰ S/m" },
 { id: "polymer", label: "Polymer", color: "#7c3aed", bandGap: 3.5, example: "PE, PMMA, Kevlar", conductivity: "10⁻¹⁴ – 10⁻¹⁰ S/m" },
 { id: "ceramic", label: "Ceramic", color: "#7c3aed", bandGap: 4.0, example: "Al₂O₃, ZrO₂, SiC", conductivity: "10⁻¹² – 10² S/m" },
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
 All materials are made of atoms, but they behave very differently based on <strong>how freely their electrons can move</strong>. In metals, electrons move easily. In semiconductors, electrons need a small push to move. In insulators, electrons are stuck and cannot move. In polymers, long chains make the material flexible. In ceramics, strong bonds make it hard and stiff.
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

 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* ── ANIMATED VISUALIZATION ── */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", maxWidth: 385, margin: "0 auto", background: T.surface, borderRadius: 10, border: `1.5px solid ${sel.color}33` }}>
 {/* Title */}
 <text x={W / 2} y={20} textAnchor="middle" fill={sel.color} fontSize={13} fontWeight="bold">{sel.label} Band Structure</text>

 {/* Conduction band */}
 <rect x={bandL} y={CBbot - bandH} width={bandW} height={bandH} rx={4}
 fill={T.eo_cond + "22"} stroke={T.eo_cond} strokeWidth={1.5} />
 <text x={W / 2} y={CBbot - bandH - 6} textAnchor="middle" fill={T.eo_cond} fontSize={11} fontWeight="bold">Conduction Band (CBM)</text>

 {/* Band gap label */}
 {gapPx > 10 && <>
 <rect x={bandL} y={CBbot} width={bandW} height={gapPx} fill={T.eo_gap + "08"} />
 <line x1={bandL - 10} y1={CBbot} x2={bandL - 10} y2={VBtop} stroke={T.eo_gap} strokeWidth={1.5} markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
 <text x={bandL - 14} y={(CBbot + VBtop) / 2 + 4} fill={T.eo_gap} fontSize={11} fontWeight="bold" textAnchor="end">
 E_g = {sel.bandGap} eV
 </text>
 </>}

 {/* Valence band */}
 <rect x={bandL} y={VBtop} width={bandW} height={bandH} rx={4}
 fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
 <text x={W / 2} y={VBtop + bandH + 14} textAnchor="middle" fill={T.eo_valence} fontSize={11} fontWeight="bold">Valence Band (VBM)</text>

 {/* Overlap indicator for metals */}
 {selected === "metal" && (
 <text x={W / 2} y={H - 10} textAnchor="middle" fill={T.eo_e} fontSize={11} fontWeight="bold">
 Bands OVERLAP — No Gap
 </text>
 )}

 {/* Animated electrons — systematic placement */}
 {electrons.map((e, i) => (
 <g key={i}>
 <circle cx={e.x} cy={e.y} r={6} fill={e.inCB ? T.eo_e : T.eo_valence} opacity={0.9} />
 <text x={e.x} y={e.y + 3.5} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold">e⁻</text>
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
 <text x={158} y={(CBbot + VBtop) / 2} fill={T.eo_photon} fontSize={13} fontWeight="bold">hν ↑</text>
 </g>
 )}

 {selected === "insulator" && (
 <g>
 {/* Big X showing electrons can't cross */}
 <text x={W / 2} y={(CBbot + VBtop) / 2 + 5} textAnchor="middle" fill={T.eo_gap} fontSize={20} fontWeight="bold" opacity={0.4 + 0.3 * Math.sin(frame * 0.08)}>
 TOO WIDE
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
 <text x={W / 2} y={VBtop + bandH + 18} textAnchor="middle" fill={T.muted} fontSize={13}>Wiggling polymer chain (weak inter-chain forces)</text>
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
 <text x={W / 2} y={H - 10} textAnchor="middle" fill={T.muted} fontSize={13}>Rigid ionic/covalent lattice (barely vibrating)</text>
 </g>
 )}

 {/* Example label */}
 <text x={W / 2} y={28} textAnchor="middle" fill={T.muted} fontSize={11}>Examples: {sel.example}</text>
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

 {/* ── DETAILS ── */}
 <div style={{ width: "100%", overflow: "hidden" }}>
 {/* Analogy for selected material */}
 <div style={{ background: "#7c3aed08", border: "1.5px solid #7c3aed33", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>{sel.label} Analogy</div>
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

 {/* ── INTERACTIVE BUILDERS ── */}
 {selected === "polymer" && <PolymerBuilder />}
 {selected === "metal" && <MetalAlloyExplorer />}
 {selected === "semiconductor" && <SemiconductorDopingTool />}
 {selected === "insulator" && <InsulatorExplorer />}
 {selected === "ceramic" && <CeramicExplorer />}

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

 <NCard title="Numerical Example: Resistivity Comparison -- Cu vs Si vs SiO₂" color={T.eo_photon} formula={"σ = 1/ρ, I = V/(ρL/A)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Compare the resistivities of copper (metal, ρ = 1.7×10⁻⁸ Ωm), silicon (semiconductor, ρ = 2.3×10³ Ωm), and SiO₂ (insulator, ρ = 10¹⁶ Ωm). Calculate conductivity for each and the current through a 1 cm cube with 1V applied.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a water pipe. A metal is a fire hose -- wide open, water gushes through. A semiconductor is a garden hose with a partially closed valve. An insulator is a sealed pipe -- virtually nothing gets through. The 24-order-of-magnitude range in resistivity is the largest span of any physical property in nature.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate conductivity σ = 1/ρ:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Cu resistivity" value="ρ = 1.7 × 10⁻⁸ Ωm" />
 <InfoRow label="Si resistivity (intrinsic)" value="ρ = 2.3 × 10³ Ωm" />
 <InfoRow label="SiO₂ resistivity" value="ρ = 10¹⁶ Ωm" />
 <InfoRow label="Cube dimensions" value="L = 1 cm = 0.01 m, A = 1 cm² = 10⁻⁴ m²" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate conductivity and current (I = VA/ρL):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Cu: σ = 1/(1.7×10⁻⁸) = 5.9×10⁷ S/m" result="I = 1×10⁻⁴/(1.7×10⁻⁸×0.01) = 588 A" color={T.eo_photon} />
 <CalcRow eq="Si: σ = 1/(2.3×10³) = 4.3×10⁻⁴ S/m" result="I = 10⁻⁴/(2.3×10³×0.01) = 4.3 μA" color={T.eo_photon} />
 <CalcRow eq="SiO₂: σ = 1/(10¹⁶) = 10⁻¹⁶ S/m" result="I = 10⁻⁴/(10¹⁶×0.01) = 10⁻¹⁸ A" color={T.eo_photon} />
 <CalcRow eq="Span: σ_Cu / σ_SiO₂ = 5.9×10⁷ / 10⁻¹⁶" result="≈ 10²⁴ (24 orders of magnitude!)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Copper pushes 588 amperes through a 1 cm cube -- enough to melt the wire instantly. Intrinsic silicon conducts only microamps. SiO₂ conducts less than one electron per second (10⁻¹⁸ A is about 6 electrons/second). This 24-order span arises directly from band structure: Cu has no gap (free electrons everywhere), Si has a small gap (few thermal carriers), and SiO₂ has a huge 9 eV gap (essentially zero carriers).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Temperature Dependence -- Metal vs Semiconductor" color={T.eo_photon} formula={"Metal: ρ(T) = ρ₀(1+αT); Semiconductor: σ ∝ exp(-E_g/2kT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Heat copper (metal) and silicon (semiconductor) from 300K to 400K. Copper has α = 0.00393/K. Silicon has E_g = 1.12 eV. How does each material{"'"}s conductivity change? Why do they respond in opposite ways?
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In a metal, electrons are already free -- heating shakes the lattice more, creating more obstacles (phonons) for electrons to crash into. It is like adding speed bumps to a highway. In a semiconductor, heating promotes more electrons across the band gap -- like opening more lanes on a toll road. More carriers overwhelm the increased scattering, so conductivity rises.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Metal (Cu) -- resistivity increases:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Cu resistivity at 300K" value="ρ₀ = 1.7 × 10⁻⁸ Ωm" />
 <InfoRow label="Temperature coefficient" value="α = 0.00393 /K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate changes:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Cu at 400K: ρ = 1.7×10⁻⁸(1 + 0.00393×100)" result="= 2.37 × 10⁻⁸ Ωm (+39%)" color={T.eo_photon} />
 <CalcRow eq="Cu conductivity ratio: σ(400K)/σ(300K) = ρ(300)/ρ(400)" result="= 0.72 (28% decrease)" color={T.eo_photon} />
 <CalcRow eq="Si at 300K: σ ∝ exp(-1.12/(2×0.02585))" result="∝ exp(-21.66)" color={T.eo_photon} />
 <CalcRow eq="Si at 400K: σ ∝ exp(-1.12/(2×0.03446))" result="∝ exp(-16.25)" color={T.eo_photon} />
 <CalcRow eq="Si ratio: σ(400K)/σ(300K) = exp(-16.25+21.66)" result="= exp(5.41) ≈ 224×" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Heating from 300K to 400K reduces copper conductivity by 28% (more phonon scattering), while silicon conductivity increases 224-fold (exponentially more carriers). These opposite trends are the defining signatures of metals vs semiconductors. This is why metals are used where stable conductivity matters (wires), while semiconductors are used where temperature sensitivity is exploited (thermistors, sensors).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Wiedemann-Franz Law -- Thermal Conductivity of Copper" color={T.eo_photon} formula={"κ_e = LσT, L = π²k_B²/(3e²)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Copper has electrical conductivity σ = 5.96 × 10⁷ S/m at 300 K. Using the Wiedemann-Franz law with the Lorenz number L = 2.44 × 10⁻⁸ WΩ/K², predict the electronic thermal conductivity. Compare with the measured total κ = 401 W/(m·K).
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Free electrons carry both charge and heat. Good electrical conductors are also good thermal conductors because the same electrons transport both. The Wiedemann-Franz law says the ratio κ/(σT) is a universal constant (the Lorenz number) -- determined only by fundamental constants. It is like saying that a highway good for cars (charge) is equally good for trucks (heat).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Electrical conductivity (Cu)" value="σ = 5.96 × 10⁷ S/m" />
 <InfoRow label="Temperature" value="T = 300 K" />
 <InfoRow label="Lorenz number" value="L = π²k_B²/(3e²) = 2.44 × 10⁻⁸ WΩ/K²" />
 <InfoRow label="Measured κ (Cu)" value="401 W/(m·K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="κ_e = LσT = 2.44×10⁻⁸ × 5.96×10⁷ × 300" result="" color={T.eo_photon} />
 <CalcRow eq="= 2.44×10⁻⁸ × 1.788×10¹⁰" result="κ_e = 436 W/(m·K)" color={T.eo_photon} />
 <CalcRow eq="Ratio: κ_e/κ_measured = 436/401" result="= 1.09 (9% overestimate)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Wiedemann-Franz prediction of 436 W/(m·K) is within 9% of the measured 401 W/(m·K), confirming that electrons dominate heat transport in copper. The small overestimate occurs because inelastic electron-phonon scattering slightly reduces the Lorenz number below the Sommerfeld value at intermediate temperatures. This law explains why metals feel cold to touch -- they conduct heat away from your skin efficiently.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Drude Relaxation Time in Copper" color={T.eo_photon} formula={"τ = m_e/(ne²ρ)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Copper has resistivity ρ = 1.68 × 10⁻⁸ Ωm and free electron density n = 8.49 × 10²⁸ m⁻³. Calculate the Drude relaxation time τ, the mean free path, and the drift velocity under a field of 1 V/m.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Electrons in a metal move at enormous thermal speeds (~10⁶ m/s) but scatter frequently off phonons and defects. The relaxation time τ is the average time between collisions -- like the time a pinball travels between bumpers. The drift velocity (net motion under a field) is tiny compared to thermal speed, like a gentle breeze superimposed on the random molecular chaos in a room.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Resistivity (Cu)" value="ρ = 1.68 × 10⁻⁸ Ωm" />
 <InfoRow label="Free electron density" value="n = 8.49 × 10²⁸ m⁻³" />
 <InfoRow label="Electron mass" value="m_e = 9.109 × 10⁻³¹ kg" />
 <InfoRow label="Fermi velocity (Cu)" value="v_F = 1.57 × 10⁶ m/s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="τ = m_e/(ne²ρ) = 9.109×10⁻³¹ / (8.49×10²⁸ × (1.602×10⁻¹⁹)² × 1.68×10⁻⁸)" result="" color={T.eo_photon} />
 <CalcRow eq="= 9.109×10⁻³¹ / (8.49×10²⁸ × 2.566×10⁻³⁸ × 1.68×10⁻⁸)" result="" color={T.eo_photon} />
 <CalcRow eq="= 9.109×10⁻³¹ / (3.66×10⁻¹⁷)" result="τ = 2.49 × 10⁻¹⁴ s = 24.9 fs" color={T.eo_photon} />
 <CalcRow eq="Mean free path: λ = v_F × τ = 1.57×10⁶ × 2.49×10⁻¹⁴" result="λ = 39.1 nm" color={T.eo_photon} />
 <CalcRow eq="Drift velocity: v_d = eEτ/m = 1.602×10⁻¹⁹ × 1 × 2.49×10⁻¹⁴ / 9.109×10⁻³¹" result="v_d = 4.38 × 10⁻³ m/s" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Electrons scatter every 25 femtoseconds, traveling ~39 nm between collisions -- about 100 atomic spacings. The drift velocity of 4.4 mm/s under 1 V/m is a million times slower than the thermal velocity. Current flows not because electrons race through the wire, but because a tiny bias is superimposed on their chaotic thermal motion. At the nanoscale (devices smaller than λ), transport becomes ballistic.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: PZT Piezoelectric Voltage from Mechanical Stress" color={T.eo_photon} formula={"V = g₃₃ × σ × t"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A PZT (lead zirconate titanate, PbZr₀.₅₂Ti₀.₄₈O₃) piezoelectric disc has g₃₃ = 25 × 10⁻³ Vm/N, thickness t = 1 mm. A mechanical stress of σ = 10 MPa is applied. Calculate the open-circuit voltage generated.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Piezoelectricity means "pressure electricity." In PZT, the crystal structure lacks a center of symmetry, so squeezing it shifts positive and negative ion sublattices in opposite directions, creating a voltage. It is like squeezing a lemon -- the harder you press, the more juice (voltage) comes out. PZT is the champion piezoelectric because its ions are especially easy to displace.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Piezoelectric voltage coefficient" value="g₃₃ = 25 × 10⁻³ Vm/N" />
 <InfoRow label="Applied stress" value="σ = 10 MPa = 10⁷ N/m²" />
 <InfoRow label="Disc thickness" value="t = 1 mm = 10⁻³ m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="V = g₃₃ × σ × t = 25×10⁻³ × 10⁷ × 10⁻³" result="" color={T.eo_photon} />
 <CalcRow eq="= 25 × 10" result="V = 250 V" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A modest 10 MPa stress on a 1 mm PZT disc generates 250 V -- enough to create a spark. This is exactly how lighters and gas igniters work: a spring-loaded hammer strikes a PZT crystal, generating kilovolts. PZT is also used in ultrasonic transducers (medical imaging), fuel injectors (diesel engines), and energy harvesters (harvesting vibrations from footsteps or machinery).</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: P3HT Polymer Semiconductor Band Gap and Absorption" color={T.eo_photon} formula={"λ_edge = hc/E_g"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Poly(3-hexylthiophene) (P3HT) is a conjugated polymer used in organic solar cells. Its optical band gap is E_g = 1.9 eV. Calculate the absorption edge wavelength and explain why P3HT appears reddish-purple.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Conjugated polymers have alternating single and double bonds along the backbone, creating delocalized electrons that behave like electrons in a 1D quantum box. The "box" length is the conjugation length -- typically 5-20 repeat units. Longer conjugation lowers the gap. P3HT's 1.9 eV gap absorbs blue and green light, transmitting red -- giving it a characteristic wine-purple color in thin films.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Band gap (P3HT)" value="Eg = 1.9 eV (HOMO-LUMO gap)" />
 <InfoRow label="hc" value="1240 eV·nm" />
 <InfoRow label="Visible spectrum" value="400 nm (violet) to 700 nm (red)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="λ_edge = hc/Eg = 1240/1.9" result="λ_edge = 653 nm (red edge)" color={T.eo_photon} />
 <CalcRow eq="Absorption peak: typically ~520 nm (green)" result="Absorbs violet, blue, green" color={T.eo_photon} />
 <CalcRow eq="Transmitted/reflected light:" result="Red → appears reddish-purple" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>P3HT absorbs photons with λ less than 653 nm, covering most of the visible spectrum. However, its 1.9 eV gap misses the infrared portion of sunlight (which carries ~50% of solar energy). This is why P3HT:PCBM organic solar cells reach only ~5% efficiency, compared to ~25% for silicon. Newer low-bandgap polymers like PTB7 (E_g ≈ 1.6 eV) capture more of the solar spectrum, pushing organic PV efficiencies above 18%.</div>
 </div>
 </NCard>

 </div>
 );
}

// ─── Section: 2D Materials & Thin Films ─────────────────────────────────────

function Synthesis3DView({ selected, frame }) {
 const t = frame * 0.03;
 const cfg = {
 graphene: { color: "#6b7280", temp: "1050°C", sub: "Cu foil", desc: "CH₄ → C honeycomb on Cu" },
 MoS2: { color: "#7c3aed", temp: "700°C", sub: "SiO₂/Si", desc: "MoO₃ + S → MoS₂ triangles" },
 hBN: { color: "#7c3aed", temp: "1000°C", sub: "Cu/Ni foil", desc: "Borazine → hBN honeycomb" },
 WS2: { color: "#7c3aed", temp: "800°C", sub: "SiO₂/Si", desc: "WO₃ + S → WS₂ monolayer" },
 blackP: { color: "#7c3aed", temp: "200°C / 1 GPa", sub: "Anvil press", desc: "Red P → Black P layers" },
 }[selected];

 const W = 240, H = 200;
 const cx = W / 2, cy = 115;
 const hexR = 12; // honeycomb cell size

 // Build honeycomb grid positions (axial coords → pixel)
 const hexAtoms = [];
 const maxRing = 4;
 for (let q = -maxRing; q <= maxRing; q++) {
 for (let r = -maxRing; r <= maxRing; r++) {
 if (Math.abs(q + r) > maxRing) continue;
 const px = cx + hexR * 1.5 * q;
 const py = cy + hexR * (Math.sqrt(3) * (r + q * 0.5));
 const dist = Math.hypot(px - cx, py - cy);
 hexAtoms.push({ x: px, y: py, dist });
 }
 }
 hexAtoms.sort((a, b) => a.dist - b.dist);

 // Growth front radius expands over time
 const growRadius = ((t * 0.6) % 3.5) * 25;

 // Gas molecules
 const gas = [];
 for (let i = 0; i < 5; i++) {
 const gx = 30 + (i * 50 + t * 20) % (W - 60);
 const gy = 10 + ((t * 35 + i * 45) % 55);
 gas.push({ x: gx, y: gy, op: 0.3 + 0.3 * Math.sin(t * 2 + i) });
 }

 return (
 <div>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", background: `linear-gradient(180deg, #0f1117 0%, #1a1d2e 100%)`, borderRadius: 8, display: "block", border: `1.5px solid ${cfg.color}33` }}>
 <text x={W / 2} y={14} textAnchor="middle" fontSize={9} fill="#7c3aed" fontWeight="bold" fontFamily="monospace">{cfg.temp}</text>

 {/* Gas precursors */}
 {gas.map((g, i) => (
 <g key={i} opacity={g.op}>
 <circle cx={g.x} cy={g.y} r={2.5} fill={cfg.color} />
 <line x1={g.x} y1={g.y + 3} x2={g.x} y2={g.y + 10} stroke={cfg.color} strokeWidth={0.5} opacity={0.4} strokeDasharray="1,2" />
 </g>
 ))}

 {/* Substrate base line */}
 <rect x={20} y={cy + 50} width={W - 40} height={18} rx={3} fill="#7c3aed11" stroke="#7c3aed33" strokeWidth={0.5} />
 <text x={W / 2} y={cy + 63} textAnchor="middle" fontSize={8} fill="#7c3aed" fontFamily="monospace">{cfg.sub}</text>

 {/* Honeycomb lattice growing outward */}
 {hexAtoms.map((atom, i) => {
 if (atom.dist > growRadius) return null;
 const fadein = Math.min(1, (growRadius - atom.dist) / 15);
 const pulse = 1 + 0.08 * Math.sin(t * 4 + i);
 const ar = 3.5 * pulse;
 return (
 <g key={i} opacity={fadein}>
 {/* Bonds to neighbors */}
 {hexAtoms.filter((b, j) => j < i && b.dist <= growRadius && Math.hypot(atom.x - b.x, atom.y - b.y) < hexR * 1.9).map((b, k) => (
 <line key={k} x1={atom.x} y1={atom.y} x2={b.x} y2={b.y}
 stroke={cfg.color} strokeWidth={1.2} opacity={fadein * 0.5} />
 ))}
 {/* Atom glow + atom */}
 <circle cx={atom.x} cy={atom.y} r={ar + 2} fill={cfg.color} opacity={0.1} />
 <circle cx={atom.x} cy={atom.y} r={ar} fill={cfg.color} opacity={0.85} />
 </g>
 );
 })}

 {/* Growth front ring */}
 <circle cx={cx} cy={cy} r={growRadius} fill="none" stroke={cfg.color} strokeWidth={0.8} opacity={0.2} strokeDasharray="3,3" />

 {/* Label */}
 <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={8} fill="#9ca3b4" fontFamily="monospace">{cfg.desc}</text>
 </svg>
 </div>
 );
}

function TwoDMaterialsSection() {
 const [selected, setSelected] = useState("graphene");
 const [layers, setLayers] = useState(1);
 const [frame, setFrame] = useState(0);
 const [viewMode, setViewMode] = useState("structure"); // "structure" or "synthesis"

 useEffect(() => {
 const id = setInterval(() => setFrame(f => f + 1), 50);
 return () => clearInterval(id);
 }, []);

 const materials2D = {
 graphene: {
 label: "Graphene", formula: "C", year: "2004 (isolated by Geim & Novoselov)",
 bandGap: 0, gapType: "Zero (semimetal)", color: "#6b7280",
 atomColors: { C: "#6b7280" },
 properties: ["Highest known electrical conductivity", "Strongest material ever measured (130 GPa)", "Extremely high thermal conductivity (~5000 W/mK)", "Optically transparent (97.7%)"],
 applications: "Flexible electronics, sensors, composites, batteries",
 synthesis: "Mechanical exfoliation, CVD on Cu foil, epitaxial growth on SiC",
 synthSteps: [
 { step: "1. Substrate prep", detail: "Polish Cu foil (25 μm), anneal at 1000°C in H₂/Ar for 30 min to enlarge grains and remove oxide" },
 { step: "2. Carbon source", detail: "Introduce CH₄ gas (5–35 sccm) mixed with H₂ at 1000–1050°C; methane decomposes on Cu surface" },
 { step: "3. Nucleation", detail: "Carbon adatoms diffuse on Cu, nucleate hexagonal islands at grain boundaries and defects" },
 { step: "4. Growth", detail: "Islands expand laterally, merge into continuous monolayer; Cu acts as self-limiting catalyst (low C solubility)" },
 { step: "5. Transfer", detail: "Spin-coat PMMA on graphene/Cu, etch Cu in FeCl₃, transfer PMMA/graphene to target substrate, dissolve PMMA in acetone" },
 ],
 gapVsLayers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 },
 MoS2: {
 label: "MoS₂", formula: "MoS₂", year: "2011 (monolayer transistor demonstrated)",
 bandGap: 1.8, gapType: "Direct (monolayer)", color: "#7c3aed",
 atomColors: { Mo: "#7c3aed", S: "#7c3aed" },
 properties: ["Direct band gap in monolayer (1.8 eV)", "Strong photoluminescence", "High on/off ratio in transistors", "Valley polarization for valleytronics"],
 applications: "Photodetectors, transistors, catalysis (HER), flexible optoelectronics",
 synthesis: "Mechanical exfoliation, CVD, liquid-phase exfoliation",
 synthSteps: [
 { step: "1. Precursors", detail: "Place MoO₃ powder in center of tube furnace, sulfur powder upstream at lower temperature zone" },
 { step: "2. Substrate", detail: "SiO₂/Si wafer placed face-down above MoO₃; surface cleaned with piranha or O₂ plasma" },
 { step: "3. Ramp & sulfurize", detail: "Heat to 700°C at 15°C/min under Ar flow; sulfur melts at 115°C, vapor carried downstream to react with MoO₃" },
 { step: "4. Growth", detail: "MoO₃₋ₓ + S → MoS₂ triangular islands nucleate, grow into equilateral triangles 10–100 μm; hold 15 min" },
 { step: "5. Cool down", detail: "Rapid cool under Ar to preserve monolayer quality; slow cooling causes multilayer growth" },
 ],
 gapVsLayers: [1.8, 1.6, 1.5, 1.4, 1.35, 1.3, 1.28, 1.25, 1.23, 1.2],
 },
 hBN: {
 label: "hBN", formula: "BN", year: "2004 (2D form studied alongside graphene)",
 bandGap: 6.0, gapType: "Indirect", color: "#7c3aed",
 atomColors: { B: "#7c3aed", N: "#7c3aed" },
 properties: ["Ultrawide band gap insulator (6 eV)", "Atomically flat surface — ideal substrate", "Chemically inert and thermally stable", "Deep UV emitter"],
 applications: "Substrate/encapsulant for 2D devices, deep UV LEDs, tunneling barriers",
 synthesis: "CVD, mechanical exfoliation, high-pressure synthesis",
 synthSteps: [
 { step: "1. Precursor", detail: "Ammonia borane (NH₃·BH₃) or borazine (B₃N₃H₆) as single-source B and N precursor" },
 { step: "2. Substrate", detail: "Cu or Ni foil, annealed at 1000°C in H₂ to flatten surface and remove oxide" },
 { step: "3. Deposition", detail: "Precursor vapor carried into furnace at 1000°C; decomposes on metal surface releasing B and N atoms" },
 { step: "4. Growth", detail: "B-N pairs assemble into hexagonal lattice; Ni allows multilayer (high B solubility), Cu gives monolayer" },
 { step: "5. Transfer", detail: "PMMA-assisted wet transfer (same as graphene); hBN used as atomically flat substrate for other 2D devices" },
 ],
 gapVsLayers: [6.0, 5.95, 5.9, 5.87, 5.85, 5.83, 5.82, 5.81, 5.8, 5.8],
 },
 WS2: {
 label: "WS₂", formula: "WS₂", year: "2012 (monolayer PL demonstrated)",
 bandGap: 2.1, gapType: "Direct (monolayer)", color: "#7c3aed",
 atomColors: { W: "#7c3aed", S: "#7c3aed" },
 properties: ["Largest direct band gap among TMDs (2.1 eV)", "Strong spin-orbit coupling", "Excellent valley coherence", "High quantum yield PL"],
 applications: "LEDs, photodetectors, spintronic devices, sensors",
 synthesis: "CVD, mechanical exfoliation, MOCVD",
 synthSteps: [
 { step: "1. Precursors", detail: "WO₃ powder (center zone) + sulfur powder (upstream); same two-zone setup as MoS₂" },
 { step: "2. Substrate", detail: "SiO₂/Si wafer; seed promoters (PTAS, NaCl) can be added to enhance nucleation density" },
 { step: "3. Growth", detail: "800°C under Ar/H₂; S vapor reduces WO₃ → WS₂ monolayer triangles with strong PL" },
 { step: "4. Optimization", detail: "H₂ flow controls triangle size vs coverage; higher H₂ gives larger single crystals but slower coalescence" },
 { step: "5. Characterization", detail: "PL mapping confirms monolayer (strong emission at 620 nm); Raman shows E′ and A′₁ modes" },
 ],
 gapVsLayers: [2.1, 1.8, 1.65, 1.55, 1.5, 1.45, 1.42, 1.4, 1.38, 1.35],
 },
 blackP: {
 label: "Black Phosphorus", formula: "P", year: "2014 (FET demonstrated)",
 bandGap: 2.0, gapType: "Direct (tunable)", color: "#7c3aed",
 atomColors: { P: "#7c3aed" },
 properties: ["Tunable band gap: 0.3 eV (bulk) to 2.0 eV (monolayer)", "High carrier mobility (~1000 cm²/Vs)", "Anisotropic electrical/optical properties", "Puckered structure gives unique mechanics"],
 applications: "IR photodetectors, flexible electronics, thermoelectrics",
 synthesis: "Mechanical exfoliation, CVD (challenging), liquid exfoliation",
 synthSteps: [
 { step: "1. Bulk synthesis", detail: "Red phosphorus heated to 200°C at 1 GPa in a multi-anvil press for hours → converts to layered black phosphorus" },
 { step: "2. Crystal growth", detail: "Alternative: Sn/I₂ flux method at 600°C produces mm-scale single crystals; slower but higher quality" },
 { step: "3. Exfoliation", detail: "Scotch-tape mechanical exfoliation (same as graphene); yields few-layer flakes 5–20 μm" },
 { step: "4. Encapsulation", detail: "CRITICAL: black P degrades in air within hours (reacts with O₂ and H₂O); must encapsulate with hBN in glovebox" },
 { step: "5. Device fabrication", detail: "All lithography and contact deposition done under inert atmosphere; Al₂O₃ or hBN capping layer applied immediately" },
 ],
 gapVsLayers: [2.0, 1.2, 0.8, 0.6, 0.5, 0.45, 0.4, 0.37, 0.35, 0.3],
 },
 };

 const mat = materials2D[selected];
 const currentGap = mat.gapVsLayers[Math.min(layers - 1, 9)];

 // Hexagonal lattice drawing helper
 // 3D isometric projection
 const iso3d = (x, y, z) => ({
 px: 120 + (x - y) * 0.75,
 py: 100 + (x + y) * 0.43 - z * 0.9,
 });

 const drawHexLattice = () => {
 const bonds = [];
 const atoms = [];
 const hR = 14; // hex spacing
 const maxRing = 3;

 // Generate hex grid positions
 const positions = [];
 for (let q = -maxRing; q <= maxRing; q++) {
 for (let r = -maxRing; r <= maxRing; r++) {
 if (Math.abs(q + r) > maxRing) continue;
 const fx = hR * 1.5 * q;
 const fy = hR * (Math.sqrt(3) * (r + q * 0.5));
 positions.push({ q, r, fx, fy });
 }
 }

 if (selected === "graphene") {
 // Bonds first (behind atoms)
 positions.forEach((a, i) => {
 positions.forEach((b, j) => {
 if (j <= i) return;
 const d = Math.hypot(a.fx - b.fx, a.fy - b.fy);
 if (d < hR * 1.9) {
 const p1 = iso3d(a.fx, a.fy, 0);
 const p2 = iso3d(b.fx, b.fy, 0);
 bonds.push(<line key={`b-${i}-${j}`} x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py} stroke="#6b728055" strokeWidth={1.5} />);
 }
 });
 });
 // Atoms with 3D shading
 positions.forEach((a, i) => {
 const { px, py } = iso3d(a.fx, a.fy, 0);
 atoms.push(
 <g key={`a-${i}`}>
 <circle cx={px} cy={py + 1} r={6} fill="#00000020" /> {/* shadow */}
 <circle cx={px} cy={py} r={6} fill="#9ca3af" stroke="#6b7280" strokeWidth={1} />
 <circle cx={px - 1.5} cy={py - 1.5} r={2} fill="#d1d5db" opacity={0.6} /> {/* highlight */}
 </g>
 );
 });
 } else if (selected === "MoS2" || selected === "WS2") {
 const mCol = selected === "MoS2" ? "#7c3aed" : "#7c3aed";
 const sCol = "#7c3aed";
 const mLabel = selected === "MoS2" ? "Mo" : "W";
 // 3 layers: S top (z=12), Metal mid (z=0), S bottom (z=-12)
 [{ z: -12, col: sCol, label: "S", r: 5 }, { z: 0, col: mCol, label: mLabel, r: 6.5 }, { z: 12, col: sCol, label: "S", r: 5 }].forEach((layer, li) => {
 positions.forEach((a, i) => {
 if (Math.abs(a.q) + Math.abs(a.r) + Math.abs(a.q + a.r) > maxRing * 2 - 1) return;
 const { px, py } = iso3d(a.fx, a.fy, layer.z);
 // Bonds within layer
 if (li === 1) {
 positions.forEach((b, j) => {
 if (j <= i || Math.abs(b.q) + Math.abs(b.r) + Math.abs(b.q + b.r) > maxRing * 2 - 1) return;
 if (Math.hypot(a.fx - b.fx, a.fy - b.fy) < hR * 1.9) {
 const p2 = iso3d(b.fx, b.fy, layer.z);
 bonds.push(<line key={`mb-${i}-${j}`} x1={px} y1={py} x2={p2.px} y2={p2.py} stroke={mCol + "33"} strokeWidth={1} />);
 }
 });
 }
 atoms.push(
 <g key={`l${li}-${i}`}>
 <circle cx={px} cy={py + 1} r={layer.r} fill="#00000015" />
 <circle cx={px} cy={py} r={layer.r} fill={layer.col + "cc"} stroke={layer.col} strokeWidth={0.8} />
 <circle cx={px - 1} cy={py - 1} r={layer.r * 0.35} fill="#ffffff33" />
 </g>
 );
 });
 });
 atoms.push(<text key="lbl-s1" x={225} y={70} fontSize={9} fill={sCol} fontWeight="bold">S</text>);
 atoms.push(<text key="lbl-m" x={225} y={95} fontSize={9} fill={mCol} fontWeight="bold">{mLabel}</text>);
 atoms.push(<text key="lbl-s2" x={225} y={120} fontSize={9} fill={sCol} fontWeight="bold">S</text>);
 } else if (selected === "hBN") {
 positions.forEach((a, i) => {
 positions.forEach((b, j) => {
 if (j <= i) return;
 if (Math.hypot(a.fx - b.fx, a.fy - b.fy) < hR * 1.9) {
 const p1 = iso3d(a.fx, a.fy, 0);
 const p2 = iso3d(b.fx, b.fy, 0);
 bonds.push(<line key={`b-${i}-${j}`} x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py} stroke="#7c3aed33" strokeWidth={1.5} />);
 }
 });
 });
 positions.forEach((a, i) => {
 const isB = (a.q + a.r + 100) % 2 === 0;
 const col = isB ? "#7c3aed" : "#7c3aed";
 const { px, py } = iso3d(a.fx, a.fy, 0);
 atoms.push(
 <g key={`a-${i}`}>
 <circle cx={px} cy={py + 1} r={5.5} fill="#00000018" />
 <circle cx={px} cy={py} r={5.5} fill={col + "cc"} stroke={col} strokeWidth={0.8} />
 <circle cx={px - 1} cy={py - 1} r={2} fill="#ffffff33" />
 <text x={px} y={py + 3} textAnchor="middle" fill="#fff" fontSize={6} fontWeight="bold">{isB ? "B" : "N"}</text>
 </g>
 );
 });
 } else if (selected === "blackP") {
 // Puckered: alternating z-heights
 const pPositions = [];
 for (let r = 0; r < 4; r++) {
 for (let c = 0; c < 5; c++) {
 const fx = (c - 2) * 16;
 const fy = (r - 1.5) * 20;
 const z = (c % 2 === 0 ? 6 : -6); // puckered
 pPositions.push({ fx, fy, z });
 }
 }
 pPositions.forEach((a, i) => {
 pPositions.forEach((b, j) => {
 if (j <= i) return;
 if (Math.hypot(a.fx - b.fx, a.fy - b.fy) < 22) {
 const p1 = iso3d(a.fx, a.fy, a.z);
 const p2 = iso3d(b.fx, b.fy, b.z);
 bonds.push(<line key={`b-${i}-${j}`} x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py} stroke="#7c3aed33" strokeWidth={1.5} />);
 }
 });
 });
 pPositions.forEach((a, i) => {
 const { px, py } = iso3d(a.fx, a.fy, a.z);
 atoms.push(
 <g key={`a-${i}`}>
 <circle cx={px} cy={py + 1} r={6} fill="#00000018" />
 <circle cx={px} cy={py} r={6} fill="#7c3aedcc" stroke="#7c3aed" strokeWidth={0.8} />
 <circle cx={px - 1.5} cy={py - 1.5} r={2} fill="#ffffff33" />
 </g>
 );
 });
 }
 return [...bonds, ...atoms];
 };

 return (
 <div style={{ padding: 0 }}>
 <AnalogyBox>
 2D materials are single layers of atoms peeled from a thicker block, like taking one sheet from a stack of paper. A single layer of graphene is just one atom thick but is very strong and conducts electricity well. By stacking different types of these thin sheets, scientists can create materials with new and useful properties.
 </AnalogyBox>

 {/* Material selector */}
 <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
 {Object.entries(materials2D).map(([id, m]) => (
 <button key={id} onClick={() => setSelected(id)} style={{
 padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
 background: id === selected ? m.color + "22" : T.surface,
 border: `1.5px solid ${id === selected ? m.color : T.border}`,
 color: id === selected ? m.color : T.muted, cursor: "pointer",
 }}>{m.label}</button>
 ))}
 </div>

 {/* Main content */}
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 14 }}>
 {/* Structure / Synthesis toggle */}
 <div style={{ width: "100%", maxWidth: 374 }}>
 {/* Toggle buttons */}
 <div style={{ display: "flex", marginBottom: 6, borderRadius: 6, overflow: "hidden", border: `1.5px solid ${mat.color}44` }}>
 {["structure", "synthesis"].map(mode => (
 <button key={mode} onClick={() => setViewMode(mode)} style={{
 flex: 1, padding: "5px 8px", fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
 background: viewMode === mode ? mat.color + "22" : T.surface,
 color: viewMode === mode ? mat.color : T.muted,
 borderBottom: `2px solid ${viewMode === mode ? mat.color : "transparent"}`,
 }}>{mode === "structure" ? "Crystal Structure" : "Synthesis Animation"}</button>
 ))}
 </div>

 {viewMode === "structure" ? (
 <svg viewBox="0 0 240 210" style={{ width: "100%", background: `radial-gradient(ellipse at center, ${mat.color}08 0%, ${T.surface} 70%)`, borderRadius: 10, border: `1.5px solid ${mat.color}33` }}>
 {drawHexLattice()}
 <text x={120} y={200} textAnchor="middle" fill={mat.color} fontSize={10} fontWeight="bold" fontFamily="monospace">
 {mat.label} — 3D Structure
 </text>
 </svg>
 ) : (
 <Synthesis3DView selected={selected} frame={frame} />
 )}
 </div>

 {/* Right: Info panels */}
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
 {/* Basic info */}
 <div style={{ background: T.panel, borderRadius: 10, padding: 12, border: `1.5px solid ${mat.color}33` }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: mat.color, marginBottom: 6 }}>{mat.label}</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 2, fontFamily: "monospace" }}>Formula: {mat.formula}</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>Isolated: {mat.year}</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>Band Gap: <span style={{ color: mat.color, fontWeight: 700 }}>{mat.bandGap} eV</span> ({mat.gapType})</div>
 </div>

 {/* Key properties */}
 <div style={{ background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Key Properties</div>
 {mat.properties.map((p, i) => (
 <div key={i} style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
 <span style={{ color: mat.color, fontWeight: 700, marginRight: 6 }}>&#8226;</span>{p}
 </div>
 ))}
 </div>

 {/* Applications */}
 <div style={{ background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Applications</div>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6 }}>{mat.applications}</div>
 </div>

 {/* Synthesis step-by-step */}
 <div style={{ background: T.surface, borderRadius: 8, padding: "10px 14px", border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: mat.color, marginBottom: 6 }}>Synthesis — Step by Step</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
 {mat.synthSteps.map((s, i, arr) => (
 <div key={i} style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16, flexShrink: 0 }}>
 <div style={{ width: 10, height: 10, borderRadius: "50%", background: mat.color, border: `2px solid ${T.panel}`, boxShadow: `0 0 0 1.5px ${mat.color}40`, flexShrink: 0, marginTop: 4 }} />
 {i < arr.length - 1 && <div style={{ width: 1.5, flex: 1, background: mat.color + "30" }} />}
 </div>
 <div style={{ paddingBottom: 8 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.ink }}>{s.step}</div>
 <div style={{ fontSize: 10, color: T.muted, lineHeight: 1.5 }}>{s.detail}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Thin Film Growth mini-panel */}
 <div style={{ background: T.panel, borderRadius: 10, padding: 12, border: `1.5px solid ${mat.color}33` }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: mat.color, marginBottom: 6 }}>Thin Film Growth — Band Gap vs Thickness</div>
 <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>Layers: {layers}</div>
 <input type="range" min={1} max={10} value={layers} onChange={e => setLayers(Number(e.target.value))}
 style={{ width: "100%", accentColor: mat.color, marginBottom: 6 }} />
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 6 }}>
 <span>1 layer</span><span>10 layers (bulk-like)</span>
 </div>
 <div style={{ fontSize: 13, fontWeight: 800, color: mat.color, fontFamily: "monospace" }}>
 Band Gap at {layers}L: {currentGap.toFixed(2)} eV
 </div>
 {/* Mini bar showing gap */}
 <div style={{ height: 10, background: T.border, borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
 <div style={{ width: `${Math.min((currentGap / 6.5) * 100, 100)}%`, height: "100%", background: mat.color, borderRadius: 4, transition: "width 0.3s" }} />
 </div>
 </div>
 </div>
 </div>

 {/* Comparison table */}
 <div style={{ background: T.panel, borderRadius: 10, padding: 14, border: `1.5px solid ${T.border}` }}>
 <div style={{ fontSize: 13, fontWeight: 800, color: T.ink, marginBottom: 10 }}>2D Materials — Side by Side</div>
 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", wordWrap: "break-word", fontSize: 12 }}>
 <thead>
 <tr style={{ borderBottom: `2px solid ${T.border}` }}>
 {["Property", "Graphene", "MoS₂", "hBN", "WS₂", "Black P"].map(h => (
 <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: T.muted, fontWeight: 700, fontSize: 12 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {[
 { prop: "Band Gap", vals: ["0 eV", "1.8 eV (direct)", "6.0 eV", "2.1 eV (direct)", "0.3–2.0 eV"] },
 { prop: "Type", vals: ["Semimetal", "Semiconductor", "Insulator", "Semiconductor", "Semiconductor"] },
 { prop: "Mobility", vals: ["200,000 cm²/Vs", "200 cm²/Vs", "N/A (insulator)", "50 cm²/Vs", "1,000 cm²/Vs"] },
 { prop: "Strength", vals: ["130 GPa", "23 GPa", "~30 GPa", "~22 GPa", "~18 GPa"] },
 { prop: "Key Use", vals: ["Electronics", "Transistors", "Substrate", "LEDs", "IR detectors"] },
 ].map((row, i) => {
 const colors = ["#6b7280", "#7c3aed", "#7c3aed", "#7c3aed", "#7c3aed"];
 return (
 <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : T.panel }}>
 <td style={{ padding: "5px 8px", fontWeight: 700, color: T.ink, fontSize: 12 }}>{row.prop}</td>
 {row.vals.map((v, j) => (
 <td key={j} style={{ padding: "5px 8px", color: colors[j], fontSize: 12 }}>{v}</td>
 ))}
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>

 <NCard title="Numerical Example: Graphene Carrier Mobility and Mean Free Path" color={T.eo_photon} formula={"σ = neμ, l = μ√(2m*kT)/e"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Graphene has an extraordinary electron mobility of μ = 200,000 cm²/Vs at a carrier density n = 10¹² cm⁻². Calculate the sheet conductivity, drift velocity at E = 1 V/cm, and mean free path. Compare with silicon (μ = 1,400 cm²/Vs).
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Mobility is like the top speed of a car on a highway. In silicon, electrons are like cars in city traffic -- constantly scattering off impurities and lattice vibrations. In graphene, the honeycomb lattice is so perfect that electrons are like race cars on an empty autobahn -- they travel micrometers before scattering, roughly 1000x farther than in silicon.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate conductivity and drift velocity:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Carrier density" value="n = 10¹² cm⁻² = 10¹⁶ m⁻²" />
 <InfoRow label="Mobility (graphene)" value="μ = 200,000 cm²/Vs = 20 m²/Vs" />
 <InfoRow label="Applied field" value="E = 1 V/cm = 100 V/m" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Sheet conductivity: σ = neμ = (10¹⁶)(1.6×10⁻¹⁹)(20)" result="= 3.2 × 10⁻² S/□" color={T.eo_photon} />
 <CalcRow eq="Drift velocity: v_d = μE = 200,000 × 1" result="= 2 × 10⁵ cm/s = 2 km/s" color={T.eo_photon} />
 <CalcRow eq="Mean free path: l ≈ μ(2m*kT)^½/e ≈ μ × v_F × m*/e" result="≈ 1 μm (at 300K)" color={T.eo_photon} />
 <CalcRow eq="Si comparison: l_Si ≈ (1400/200000) × 1 μm" result="≈ 7 nm (143× shorter)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Graphene electrons travel roughly 1 micrometer between scattering events -- 100-1000x farther than in conventional semiconductors. This ultra-long mean free path enables ballistic transport in devices shorter than 1 μm. The mobility is 143x higher than silicon, making graphene ideal for high-frequency transistors and ultra-sensitive sensors.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: MoS₂ Monolayer Band Gap and Photoluminescence" color={T.eo_photon} formula={"λ = hc/E_g"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Bulk MoS₂ has an indirect band gap of 1.29 eV, showing negligible photoluminescence. When exfoliated to a single monolayer, the gap becomes direct at 1.89 eV with strong PL. Calculate the emission wavelength and explain the quantum confinement effect.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In bulk MoS₂, the indirect gap means electrons must change momentum to emit a photon -- like needing to turn a corner before exiting a building. In a monolayer, the band structure reorganizes so the gap becomes direct -- electrons can emit photons straight out, like walking through an open door. The gap also widens because confining electrons to a thin sheet raises their energy (quantum confinement).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Compare bulk vs monolayer:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Bulk MoS₂ band gap" value="1.29 eV (indirect)" />
 <InfoRow label="Monolayer MoS₂ band gap" value="1.89 eV (direct)" />
 <InfoRow label="Gap increase" value="ΔE = 1.89 - 1.29 = 0.60 eV (46% increase)" />
 <InfoRow label="Planck constant × c" value="hc = 1240 eV·nm" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate PL emission wavelength:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="λ_bulk = hc/Eg = 1240/1.29" result="= 961 nm (infrared, not visible)" color={T.eo_photon} />
 <CalcRow eq="λ_mono = hc/Eg = 1240/1.89" result="= 656 nm (red light!)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Monolayer MoS₂ emits red light at 656 nm -- visible to the naked eye. The indirect-to-direct transition is key: bulk MoS₂ barely luminesces because photon emission requires a phonon to conserve momentum. In the monolayer, the direct gap allows radiative recombination with near-unity quantum yield. This makes monolayer TMDs ideal for atomically thin LEDs, photodetectors, and valleytronic devices.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Graphene Dirac Cone -- Electron Energy at Finite k" color={T.eo_photon} formula={"E(k) = ±ℏv_F|k|, v_F ≈ 10⁶ m/s"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Graphene has a linear (Dirac cone) dispersion near the K-point with Fermi velocity v_F = 1.0 × 10⁶ m/s. Calculate the energy of an electron at k = 0.1 A⁻¹ from the K-point, and compare with the parabolic dispersion of a free electron at the same k.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In most materials, electron energy grows as k² (parabolic, like a ball rolling in a bowl). In graphene, energy grows linearly with k (like a cone -- the "Dirac cone"). This means graphene electrons behave like massless relativistic particles (photons!), moving at a constant "speed of light" v_F = c/300. The linear dispersion gives graphene its extraordinary properties: zero band gap, ultra-high mobility, and Klein tunneling.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Fermi velocity" value="v_F = 1.0 × 10⁶ m/s" />
 <InfoRow label="Wavevector from K-point" value="k = 0.1 A⁻¹ = 10⁹ m⁻¹" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s = 6.582 × 10⁻¹⁶ eV·s" />
 <InfoRow label="Free electron mass" value="m_e = 9.109 × 10⁻³¹ kg" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Egraphene = ℏv_F k = 6.582×10⁻¹⁶ × 10⁶ × 10⁹" result="E = 0.658 eV" color={T.eo_photon} />
 <CalcRow eq="E_free = ℏ²k²/(2m_e) = (1.055×10⁻³⁴)² × (10⁹)²/(2 × 9.109×10⁻³¹)" result="" color={T.eo_photon} />
 <CalcRow eq="= 1.113×10⁻⁶⁸ × 10¹⁸ / 1.822×10⁻³⁰" result="E_free = 0.0611 eV" color={T.eo_photon} />
 <CalcRow eq="Ratio: Egraphene/E_free = 0.658/0.0611" result="= 10.8× higher" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At k = 0.1 A⁻¹, a graphene electron has 0.66 eV of energy -- nearly 11× more than a free electron. The linear dispersion means graphene electrons move at v_F regardless of energy (like photons), while free electrons slow down at low energy. This ultra-fast response makes graphene ideal for photodetectors with bandwidth exceeding 500 GHz and for saturable absorbers in ultrafast lasers.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: hBN Tunnel Barrier -- Tunneling Current Through Few Layers" color={T.eo_photon} formula={"T ≈ exp(−2κd), κ = √(2m*ΔE)/ℏ"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Hexagonal boron nitride (hBN) has a band gap of 6.0 eV. A graphene/hBN/graphene tunnel junction uses 3 layers of hBN (total thickness d = 1.0 nm). With the barrier height ΔE = 1.5 eV (Fermi level to hBN conduction band) and m* = 0.5 m_e, calculate the tunneling transmission coefficient.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>hBN is the "duct tape" of 2D materials -- an atomically flat insulator perfect for tunneling barriers. Electrons cannot classically cross the wide 6 eV gap, but quantum mechanically they tunnel through. Each hBN layer (~0.33 nm) exponentially attenuates the wave function. Three layers give measurable tunnel current; ten layers block it almost completely.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Barrier thickness" value="d = 1.0 nm = 10⁻⁹ m (3 layers)" />
 <InfoRow label="Barrier height" value="ΔE = 1.5 eV = 2.40 × 10⁻¹⁹ J" />
 <InfoRow label="Effective mass in hBN" value="m* = 0.5 m_e = 4.55 × 10⁻³¹ kg" />
 <InfoRow label="ℏ" value="1.055 × 10⁻³⁴ J·s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="κ = √(2m*ΔE)/ℏ = √(2 × 4.55×10⁻³¹ × 2.40×10⁻¹⁹) / 1.055×10⁻³⁴" result="" color={T.eo_photon} />
 <CalcRow eq="= √(2.184×10⁻⁴⁹) / 1.055×10⁻³⁴ = 4.674×10⁻²⁵ / 1.055×10⁻³⁴" result="κ = 4.43 × 10⁹ m⁻¹" color={T.eo_photon} />
 <CalcRow eq="2κd = 2 × 4.43×10⁹ × 10⁻⁹ = 8.86" result="" color={T.eo_photon} />
 <CalcRow eq="T = exp(−8.86)" result="T = 1.43 × 10⁻⁴" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>About 1 in 7,000 electrons tunnels through 3-layer hBN -- enough for measurable nanoampere currents in devices. Adding one more layer (d = 1.33 nm) drops T to ~2×10⁻⁵, and six layers (2 nm) gives T ~ 10⁻⁸. This exponential sensitivity makes hBN ideal as a tunnel barrier in magnetic tunnel junctions, single-electron transistors, and as a gate dielectric in 2D transistors with atomically sharp interfaces.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Magic Angle Twisted Bilayer Graphene" color={T.eo_photon} formula={"θ_magic ≈ 1.1°, flat band width ~ 10 meV"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> When two graphene layers are stacked with a twist angle θ = 1.1° (the "magic angle"), the Dirac cones hybridize to form ultra-flat bands. Calculate the moire superlattice period, the number of atoms per moire unit cell, and the bandwidth of the flat bands.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Twisting two graphene sheets creates a moire pattern -- like overlapping two window screens at a slight angle. At the magic angle, the interlayer coupling exactly flattens the bands, making electron kinetic energy nearly zero. When kinetic energy vanishes, interactions dominate, and exotic states emerge: superconductivity at 1.7 K and correlated insulators -- all in a two-atom-thick material.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Twist angle" value="θ = 1.1° = 0.0192 rad" />
 <InfoRow label="Graphene lattice constant" value="a = 2.46 A" />
 <InfoRow label="Interlayer coupling" value="w ≈ 110 meV" />
 <InfoRow label="Formula" value="L_moire = a / (2 sin(θ/2))" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="L_moire = a/(2 sin(θ/2)) = 2.46/(2 × sin(0.55°))" result="" color={T.eo_photon} />
 <CalcRow eq="= 2.46/(2 × 0.00960) = 2.46/0.01920" result="L_moire = 128 A = 12.8 nm" color={T.eo_photon} />
 <CalcRow eq="Atoms per moire cell ≈ 2 × (L/a)² × 4/√3" result="≈ 2 × (52.0)² × 2.31 ≈ 12,500 atoms" color={T.eo_photon} />
 <CalcRow eq="Flat band width W ≈ ℏv_F(2π/L) − 2w" result="W ≈ 10 meV (measured)" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 12.8 nm moire superlattice contains ~12,500 atoms per unit cell -- enormous by crystallography standards. The flat band width of ~10 meV is 100× narrower than normal graphene bandwidth, meaning electrons are nearly localized. This transforms graphene from a semimetal into a strongly correlated system. Discovered by Pablo Jarillo-Herrero at MIT in 2018, magic-angle twistronics opened an entirely new field of designer quantum materials.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: MoS₂ Exciton Binding Energy" color={T.eo_photon} formula={"E_b = (m_r e⁴)/(2ℏ²ε²) × (1/n²)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In monolayer MoS₂, the optical gap (absorption onset) is at 1.89 eV, but the electronic (quasiparticle) gap is 2.5 eV. The difference is the exciton binding energy. Compare this with the 2D hydrogen model using reduced mass m_r = 0.25 m_e and in-plane dielectric constant ε_eff ≈ 4.5.
 </div>
 <div style={{ background: T.eo_photon + "06", border: `1px solid ${T.eo_photon}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_photon, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>An exciton is an electron-hole pair bound by Coulomb attraction -- the solid-state analog of a hydrogen atom. In bulk semiconductors, screening reduces binding to ~10 meV (easily broken by room-temperature kT = 26 meV). In a monolayer, reduced screening and 2D confinement enhance binding to ~500 meV -- 20× room temperature. This means excitons in MoS₂ survive and dominate optical properties even at 300 K.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Optical gap (exciton)" value="E_opt = 1.89 eV" />
 <InfoRow label="Electronic gap (QP)" value="E_QP = 2.5 eV" />
 <InfoRow label="Experimental binding energy" value="E_b = E_QP − E_opt = 0.61 eV" />
 <InfoRow label="Reduced mass" value="m_r = 0.25 m_e" />
 <InfoRow label="Effective dielectric constant" value="ε_eff ≈ 4.5" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="2D hydrogen: E_b = 4 × Ry* (enhanced by 2D confinement)" result="" color={T.eo_photon} />
 <CalcRow eq="Ry* = 13.6 eV × (m_r/m_e) / ε² = 13.6 × 0.25 / (4.5)²" result="" color={T.eo_photon} />
 <CalcRow eq="= 3.40 / 20.25" result="Ry* = 0.168 eV" color={T.eo_photon} />
 <CalcRow eq="E_b(2D) = 4 × 0.168" result="= 0.67 eV (model)" color={T.eo_photon} />
 <CalcRow eq="Experiment: E_b = 0.61 eV" result="Agreement within ~10%" color={T.eo_photon} />
 </div>
 <div style={{ background: T.eo_photon + "08", border: `1px solid ${T.eo_photon}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_photon, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 2D hydrogen model predicts E_b = 0.67 eV, close to the measured 0.61 eV. This 600 meV binding energy is 23× larger than kT at 300 K, meaning excitons dominate the optical response at room temperature. Bulk MoS₂ has E_b ≈ 50 meV. The 12× enhancement in the monolayer comes from both reduced dimensionality (4× factor in 2D hydrogen) and weakened dielectric screening (no surrounding bulk material). These robust excitons make TMD monolayers ideal for excitonic devices, light-emitting diodes, and valley-polarized optoelectronics.</div>
 </div>
 </NCard>

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
 Doping means adding a tiny amount of different atoms into a semiconductor. If the added atom has one extra electron (n-type), there is now a free electron that can carry current. If the added atom has one fewer electron (p-type), it leaves an empty spot (hole) that also carries current. Even a tiny amount of doping changes how well the material conducts.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
 <rect x={bandL} y={Ev_y} width={bandR - bandL} height={50}
 fill={T.eo_valence} opacity={0.25} />
 <line x1={bandL} y1={Ev_y} x2={bandR} y2={Ev_y}
 stroke={T.eo_valence} strokeWidth={2.5} />
 <text x={bandR + 4} y={Ev_y + 4} fontSize={12} fill={T.eo_valence}
 fontFamily="monospace">E_v</text>
 <text x={bandL + 5} y={Ev_y + 18} fontSize={13} fill={T.eo_valence}
 fontFamily="monospace" opacity={0.7}>Valence Band</text>

 <rect x={bandL} y={Ec_y - 50} width={bandR - bandL} height={50}
 fill={T.eo_cond} opacity={0.12} />
 <line x1={bandL} y1={Ec_y} x2={bandR} y2={Ec_y}
 stroke={T.eo_cond} strokeWidth={2.5} />
 <text x={bandR + 4} y={Ec_y + 4} fontSize={12} fill={T.eo_cond}
 fontFamily="monospace">E_c</text>
 <text x={bandL + 5} y={Ec_y - 10} fontSize={13} fill={T.eo_cond}
 fontFamily="monospace" opacity={0.7}>Conduction Band</text>

 <rect x={bandL} y={Ec_y} width={bandR - bandL} height={Ev_y - Ec_y}
 fill={T.eo_gap} opacity={0.04} />
 <text x={(bandL + bandR) / 2} y={(Ec_y + Ev_y) / 2 + 4}
 textAnchor="middle" fontSize={12} fill={T.eo_gap}
 fontFamily="monospace" opacity={0.6}>
 E_g = {Eg} eV
 </text>

 {dopingType === "n-type" && (
 <>
 <line x1={bandL + 40} y1={donorY} x2={bandR - 40} y2={donorY}
 stroke={T.eo_e} strokeWidth={1.5} strokeDasharray="5,3" />
 <text x={bandR - 38} y={donorY + 4} fontSize={13} fill={T.eo_e}
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
 <text x={bandR - 38} y={acceptorY + 4} fontSize={13} fill={T.eo_hole}
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
 <text x={bandR + 4} y={fermiY + 4} fontSize={12} fill={T.eo_hole}
 fontFamily="monospace" fontWeight={700}>E_F</text>

 {electrons.map((el, i) => (
 <circle key={"e" + i} cx={el.x} cy={el.y} r={4}
 fill={T.eo_e} opacity={0.8} />
 ))}
 {holes.map((h, i) => (
 <circle key={"h" + i} cx={h.x} cy={h.y} r={5}
 fill="none" stroke={T.eo_hole} strokeWidth={2} opacity={0.8} />
 ))}

 <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fill={T.muted}
 fontFamily="monospace">
 {dopingType === "intrinsic" ? "Intrinsic" : dopingType === "n-type" ? "n-type Doped" : "p-type Doped"}
 </text>
 </svg>
 </div>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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
 Electrons move through a material in two main ways. In drift, an electric field pushes them in one direction, like a slope makes a ball roll. In diffusion, electrons spread out from crowded areas to empty areas, like a drop of ink spreading in water. How fast they move depends on how many obstacles are in the way.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 <text x={170} y={22} textAnchor="middle" fontSize={13} fill={T.eo_gap}
 fontFamily="monospace" fontWeight={700}>E-field</text>
 </g>
 )}

 {scatterPts.map((sp, i) => {
 const pulse = Math.sin(frame * 0.15 + i) * 3;
 return (
 <g key={i}>
 <circle cx={sp.x} cy={sp.y} r={10 + pulse} fill={T.eo_photon} opacity={0.12} />
 <text x={sp.x} y={sp.y + 3} textAnchor="middle" fontSize={13} fill={T.eo_photon}
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
 <text x={170} y={H - 10} textAnchor="middle" fontSize={12} fill={T.muted}
 fontFamily="monospace">
 J = {J.toExponential(1)} A/m² | v_d = {vDrift.toFixed(0)} cm/s
 </text>
 )}
 {mode === "none" && (
 <text x={170} y={H - 10} textAnchor="middle" fontSize={12} fill={T.muted}
 fontFamily="monospace">Random thermal motion (no net drift)</text>
 )}
 </svg>
 </div>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 const W = 400, H = 340;
 const marginL = 55, marginR = 25, marginT = 40, marginB = 45;
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
 Thermodynamics is about energy and change. Energy is never created or destroyed (first law). Things naturally move toward more disorder (second law). Free energy tells you if a change will happen on its own: if it goes down, the change is natural. Temperature matters because higher temperature makes disorder more important.
 </AnalogyBox>

 {/* ── REACTION COORDINATE (full width, top of section) ── */}
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W, display: "block", margin: "0 auto" }}>
 <path d={curvePath} fill="none" stroke={T.eo_core} strokeWidth={2.5} />

 <line x1={xToSvg(0.25)} y1={yToSvg(Gval)} x2={xToSvg(0.75)} y2={yToSvg(Gval)}
 stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />
 <line x1={xToSvg(0.75)} y1={yToSvg(Gval)} x2={xToSvg(0.75)} y2={yToSvg(Gprod)}
 stroke={dgColor} strokeWidth={2} />
 <text x={xToSvg(0.78)} y={(yToSvg(Gval) + yToSvg(Gprod)) / 2 + 4}
 fontSize={12} fill={dgColor} fontFamily="monospace" fontWeight={700}>
 dG
 </text>

 <line x1={xToSvg(0.25)} y1={yToSvg(Gval)} x2={xToSvg(0.25)} y2={yToSvg(landscape(0.5))}
 stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="3,2" />
 <text x={xToSvg(0.18)} y={(yToSvg(Gval) + yToSvg(landscape(0.5))) / 2}
 fontSize={13} fill={T.eo_photon} fontFamily="monospace">E_a</text>

 <rect x={xToSvg(0.1)} y={yToSvg(Gval) - 22} width={60} height={16}
 rx={3} fill={T.eo_cond} opacity={0.15} />
 <text x={xToSvg(0.1) + 30} y={yToSvg(Gval) - 10} textAnchor="middle"
 fontSize={13} fill={T.eo_cond} fontFamily="monospace">Reactants</text>

 <rect x={xToSvg(0.6)} y={yToSvg(Gprod) - 22} width={60} height={16}
 rx={3} fill={T.eo_valence} opacity={0.15} />
 <text x={xToSvg(0.6) + 30} y={yToSvg(Gprod) - 10} textAnchor="middle"
 fontSize={13} fill={T.eo_valence} fontFamily="monospace">Products</text>

 <circle cx={ballSvgX} cy={ballSvgY} r={6}
 fill={T.eo_photon} stroke={T.eo_hole} strokeWidth={1.5} />

 <line x1={marginL} y1={H - marginB} x2={W - marginR} y2={H - marginB}
 stroke={T.border} strokeWidth={1} />
 <line x1={marginL} y1={marginT} x2={marginL} y2={H - marginB}
 stroke={T.border} strokeWidth={1} />

 <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fill={T.muted}
 fontFamily="monospace">Reaction Coordinate</text>
 <text x={16} y={H / 2} textAnchor="middle" fontSize={13} fill={T.muted}
 fontFamily="monospace" transform={`rotate(-90,16,${H / 2})`}>G (eV)</text>

 <text x={marginL + plotW / 2} y={marginT - 12} textAnchor="middle" fontSize={13}
 fill={dgColor} fontFamily="monospace" fontWeight={700}>
 dG = {dG.toFixed(3)} eV {dG < 0 ? "(favorable)" : "(unfavorable)"}
 </text>
 </svg>
 </div>

 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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

 <NCard title="Numerical Example: Gibbs Free Energy of ZnTe Formation" color={T.eo_e} formula={"ΔG = ΔH - TΔS"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> ZnTe is a II-VI semiconductor used in solar cell back contacts. Its formation reaction is Zn(s) + Te(s) → ZnTe(s). With ΔH_f = -119 kJ/mol and ΔS ≈ -45 J/(mol·K), at what temperature does the reaction become thermodynamically unfavorable?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Gibbs free energy is a tug-of-war between enthalpy (the energy released by forming bonds) and entropy (disorder). At low T, the enthalpy term wins -- bond formation is favorable. But the -TΔS term grows with temperature. Since forming an ordered compound decreases entropy (ΔS is negative), -TΔS becomes positive and large, eventually overwhelming the favorable ΔH.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate ΔG at two temperatures:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Enthalpy of formation" value="ΔH_f = -119 kJ/mol" />
 <InfoRow label="Entropy change" value="ΔS = -45 J/(mol·K) = -0.045 kJ/(mol·K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Compute ΔG at 300K and 1000K:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="At 300K: ΔG = -119 - 300(-0.045) = -119 + 13.5" result="= -105.5 kJ/mol (favorable)" color={T.eo_e} />
 <CalcRow eq="At 1000K: ΔG = -119 - 1000(-0.045) = -119 + 45" result="= -74 kJ/mol (still favorable)" color={T.eo_e} />
 <CalcRow eq="ΔG = 0 when T = ΔH/ΔS = 119/0.045" result="T* = 2644 K" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ZnTe formation is strongly favorable at room temperature (ΔG = -105.5 kJ/mol) and remains so even at 1000K. The crossover temperature of 2644K is above the melting point of ZnTe (1295°C = 1568K), so in practice ZnTe is always thermodynamically stable as a solid compound. This is why ZnTe can be grown over a wide temperature range.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Entropy of Mixing in a Binary Alloy" color={T.eo_e} formula={"ΔS_mix = -nR[x ln(x) + (1-x) ln(1-x)]"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Brass is a Cu-Zn alloy. For 1 mol of Cu₀.₇Zn₀.₃ (x_Zn = 0.3), calculate the entropy of mixing and the resulting Gibbs free energy of mixing at 800K. Why do alloys form spontaneously?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Mixing is like shuffling a deck of cards. A perfectly sorted deck (pure Cu on one side, pure Zn on the other) is highly ordered. Shuffling increases entropy because there are astronomically more ways to arrange a mixed deck. Nature prefers the mixed state because it has higher entropy -- and at finite temperature, the -TΔS term lowers the free energy.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Calculate entropy of mixing:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Mole fraction Zn" value="x = 0.3" />
 <InfoRow label="Mole fraction Cu" value="1 - x = 0.7" />
 <InfoRow label="Gas constant R" value="8.314 J/(mol·K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate ΔS_mix and ΔG_mix:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔS_mix = -R[0.3 ln(0.3) + 0.7 ln(0.7)]" result="" color={T.eo_e} />
 <CalcRow eq="= -8.314 × [0.3(-1.204) + 0.7(-0.357)]" result="" color={T.eo_e} />
 <CalcRow eq="= -8.314 × [-0.361 + (-0.250)]" result="" color={T.eo_e} />
 <CalcRow eq="= -8.314 × (-0.611)" result="ΔS_mix = 5.08 J/(mol·K)" color={T.eo_e} />
 <CalcRow eq="ΔG_mix = -TΔS_mix = -800 × 5.08" result="= -4065 J/mol = -4.07 kJ/mol" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The entropy of mixing is always positive (5.08 J/(mol·K)) -- mixing always increases disorder. At 800K, this gives ΔG_mix = -4.07 kJ/mol, meaning mixing is spontaneous. The maximum entropy of mixing occurs at x = 0.5 (equal amounts), where ΔS_mix = R ln(2) = 5.76 J/(mol·K). This is why ideal solid solutions are thermodynamically stable -- entropy always favors mixing.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Clausius-Clapeyron -- CdTe Vapor Pressure vs Temperature" color={T.eo_e} formula={"dP/dT = ΔH_vap / (TΔV) ≈ ΔH_vap P / (RT²)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> CdTe sublimes with ΔH_sub = 200 kJ/mol. Its vapor pressure is P₁ = 1.0 Pa at T₁ = 900 K. Calculate the vapor pressure at T₂ = 1000 K during close-space sublimation (CSS) growth.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Vapor pressure is like the "eagerness" of atoms to escape a solid surface. At low temperature, atoms are tightly bound and few escape. As temperature rises, the exponential Boltzmann tail extends further, and vapor pressure rises steeply. The Clausius-Clapeyron equation captures this: each 100 K increase can multiply the vapor pressure by 10× or more, depending on the enthalpy of sublimation.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Sublimation enthalpy" value="ΔH_sub = 200 kJ/mol" />
 <InfoRow label="Reference pressure" value="P₁ = 1.0 Pa at T₁ = 900 K" />
 <InfoRow label="Target temperature" value="T₂ = 1000 K" />
 <InfoRow label="R" value="8.314 J/(mol·K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ln(P₂/P₁) = −ΔH/R × (1/T₂ − 1/T₁)" result="" color={T.eo_e} />
 <CalcRow eq="= −200000/8.314 × (1/1000 − 1/900)" result="" color={T.eo_e} />
 <CalcRow eq="= −24059 × (0.001000 − 0.001111)" result="" color={T.eo_e} />
 <CalcRow eq="= −24059 × (−1.111 × 10⁻⁴)" result="ln(P₂/P₁) = 2.673" color={T.eo_e} />
 <CalcRow eq="P₂ = P₁ × exp(2.673) = 1.0 × 14.49" result="P₂ = 14.5 Pa" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 100 K increase from 900 K to 1000 K raises CdTe vapor pressure by 14.5×. This steep dependence is why CSS source temperature must be controlled to ±1°C during solar cell deposition -- a 10 K drift changes the growth rate by ~30%. In CdTe photovoltaics (First Solar panels), the source is held at ~600°C and the substrate at ~500°C, creating a ~10 Pa pressure difference that drives vapor transport across a 2 mm gap.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Ellingham Diagram -- Can Al Reduce TiO₂?" color={T.eo_e} formula={"ΔG°_rxn = ΔG°_f(products) − ΔG°_f(reactants)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> At 1000 K, ΔG°_f(Al₂O₃) = -1480 kJ/mol and ΔG°_f(TiO₂) = -760 kJ/mol. Can aluminum reduce titanium dioxide? Calculate ΔG for the reaction 4Al + 3TiO₂ → 2Al₂O₃ + 3Ti.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The Ellingham diagram is a "league table" of oxide stabilities. Metals lower on the diagram (more negative ΔG_f) have a stronger grip on oxygen and can steal it from metals higher up. Aluminum sits very low (ΔG_f(Al₂O₃) is very negative), so it can reduce most metal oxides. This is the basis of the thermite reaction used to weld railroad tracks.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="ΔG°_f(Al₂O₃) at 1000 K" value="−1480 kJ/mol (per mol Al₂O₃)" />
 <InfoRow label="ΔG°_f(TiO₂) at 1000 K" value="−760 kJ/mol (per mol TiO₂)" />
 <InfoRow label="Reaction" value="4Al + 3TiO₂ → 2Al₂O₃ + 3Ti" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ΔG°_rxn = 2×ΔG°_f(Al₂O₃) + 3×ΔG°_f(Ti) − [4×ΔG°_f(Al) + 3×ΔG°_f(TiO₂)]" result="" color={T.eo_e} />
 <CalcRow eq="= 2(−1480) + 3(0) − [4(0) + 3(−760)]" result="" color={T.eo_e} />
 <CalcRow eq="= −2960 + 2280" result="ΔG°_rxn = −680 kJ/mol" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ΔG = −680 kJ/mol -- strongly negative, so yes, aluminum can reduce TiO₂. This is the aluminothermic (thermite) reaction, which reaches temperatures exceeding 2500°C. In materials science, Ellingham analysis tells us which crucible materials are safe for melting metals (Al₂O₃ crucibles must not contact molten Ti!), and which gettering metals can remove oxygen from vacuum systems.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: DFT Formation Energy of CdTe" color={T.eo_e} formula={"ΔH_f = E(CdTe) − E(Cd) − E(Te)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A DFT calculation (GGA-PBE functional) gives total energies: E(CdTe, zincblende) = -5.841 eV/atom, E(Cd, hcp) = -0.906 eV/atom, E(Te, trigonal) = -3.142 eV/atom. Calculate the formation enthalpy per formula unit and compare with experiment (-1.01 eV).
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>DFT is like a computational "balance sheet" for atoms. You calculate the total energy of the compound and subtract the energies of the pure elements. If the compound has lower energy, it is thermodynamically stable (ΔH_f is negative). The more negative, the more stable. This is the first-principles analog of the Born-Haber cycle, but without any experimental input.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="E(CdTe) per atom" value="−5.841 eV/atom (2 atoms per f.u.)" />
 <InfoRow label="E(Cd) per atom" value="−0.906 eV/atom" />
 <InfoRow label="E(Te) per atom" value="−3.142 eV/atom" />
 <InfoRow label="Experimental ΔH_f" value="−1.01 eV/f.u. (−97.4 kJ/mol)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E(CdTe) per f.u. = 2 × (−5.841) = −11.682 eV" result="" color={T.eo_e} />
 <CalcRow eq="E(Cd) + E(Te) = −0.906 + (−3.142) = −4.048 eV" result="" color={T.eo_e} />
 <CalcRow eq="ΔH_f = −11.682 − 2(−4.048) = −11.682 + 8.096" result="" color={T.eo_e} />
 <CalcRow eq="" result="ΔH_f = −0.89 eV/f.u. (DFT-GGA)" color={T.eo_e} />
 <CalcRow eq="Error vs experiment: |−0.89 − (−1.01)|/1.01 × 100" result="= 12% underestimate" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>DFT-GGA gives ΔH_f = −0.89 eV, about 12% less negative than the experimental −1.01 eV. GGA systematically underbinds (underestimates bond strength) because it approximates exchange-correlation. More advanced methods (HSE06 hybrid functional) typically give −0.95 to −1.05 eV, closer to experiment. Despite the ~10% error, DFT correctly predicts CdTe stability and is used to screen thousands of candidate solar absorbers in the Materials Project database.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Configurational Entropy of Defects in CdTe" color={T.eo_e} formula={"S_config = k_B ln(W), W = N!/(n!(N−n)!)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In CdTe at growth temperature T = 600°C = 873 K, Cd vacancies have formation energy E_f = 1.5 eV (under Te-rich conditions). Calculate the equilibrium vacancy concentration and the configurational entropy contribution to free energy.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Creating a vacancy costs energy (E_f), but it also creates disorder (entropy). Nature balances these: at T = 0, entropy does not matter and no vacancies form. At finite T, the TS_config term rewards disorder, and a nonzero vacancy concentration minimizes ΔG = nE_f − TS_config. The result is always some vacancies at equilibrium -- you cannot make a perfect crystal at finite temperature.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Vacancy formation energy" value="E_f = 1.5 eV" />
 <InfoRow label="Temperature" value="T = 873 K" />
 <InfoRow label="kT" value="0.0752 eV" />
 <InfoRow label="Cd sites in CdTe" value="N = 1.48 × 10²² cm⁻³" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="[V_Cd] / N = exp(−E_f/kT) = exp(−1.5/0.0752)" result="" color={T.eo_e} />
 <CalcRow eq="= exp(−19.95)" result="= 2.17 × 10⁻⁹" color={T.eo_e} />
 <CalcRow eq="[V_Cd] = 1.48×10²² × 2.17×10⁻⁹" result="= 3.2 × 10¹³ cm⁻³" color={T.eo_e} />
 <CalcRow eq="S_config per vacancy = k_B ln(N/n) ≈ k_B × 19.95" result="= 1.73 meV/K per vacancy" color={T.eo_e} />
 <CalcRow eq="TS_config = 873 × 1.73 meV/K" result="= 1.51 eV/vacancy" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 600°C, CdTe contains ~3 × 10¹³ Cd vacancies/cm³ -- enough to make it p-type with hole concentration on the order of 10¹³ cm⁻³. The entropy contribution (TS = 1.51 eV) nearly cancels the formation energy (1.5 eV), showing that at growth temperature the free energy cost of a vacancy is nearly zero. Rapid quenching freezes in this high-temperature concentration. Slow cooling allows vacancies to anneal out, reducing p-type doping. This is why CdTe solar cell annealing protocols are so critical.</div>
 </div>
 </NCard>

 <div style={{
 background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
 borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
 }}>
 <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Coming Next: Kinetics {"→"}</div>
 <div style={{ color: T.ink }}>
 Thermodynamics tells us what's stable — but kinetics tells us how fast we get there. Next we explore activation barriers, reaction rates, and the Arrhenius equation that governs every diffusion, nucleation, and phase transformation in materials science.
 </div>
 </div>
 </div>
 </div>
 );
}

// ─── Kinetics Section ─────────────────────────────────────────────────────

function KineticsSection() {
 const [ea, setEa] = useState(0.5);
 const [temp, setTemp] = useState(600);
 const [frame, setFrame] = useState(0);
 const [avramiT, setAvramiT] = useState(300);

 useEffect(() => {
 const id = setInterval(() => setFrame(f => f + 1), 50);
 return () => clearInterval(id);
 }, []);

 const kB = 8.617e-5; // eV/K
 const rate = 1e13 * Math.exp(-ea / (kB * temp));
 const logRate = Math.log10(rate || 1e-50);

 // Arrhenius for several materials
 const arrheniusExamples = [
 { name: "Vacancy diffusion in Si", ea: 0.43, D0: "0.015 cm²/s", color: T.eo_e },
 { name: "O interstitial in Si", ea: 2.44, D0: "0.19 cm²/s", color: T.eo_hole },
 { name: "Grain growth in Cu", ea: 1.2, D0: "—", color: T.eo_valence },
 { name: "Li in LiFePO₄", ea: 0.30, D0: "10⁻⁸ cm²/s", color: T.eo_cond },
 ];

 // Avrami: f(t) = 1 - exp(-k*t^n)
 const avK = 1.2e-4, avN = 2.5;
 const avramiF = 1 - Math.exp(-avK * Math.pow(avramiT, avN));
 const t50 = Math.pow(Math.log(2) / avK, 1 / avN);

 // SVG energy barrier
 const W = 280, H = 160;
 const barrierY = 30, reactY = 110, prodY = 130;
 const barrierScale = Math.min(1, ea / 2.5);
 const adjBarrierY = reactY - (reactY - barrierY) * barrierScale;
 const ballX = 40 + ((frame * 0.8) % 200);
 const onBarrier = ballX > 90 && ballX < 190;
 const ballY = onBarrier
 ? adjBarrierY + (reactY - adjBarrierY) * Math.pow(Math.abs(ballX - 140) / 50, 2)
 : (ballX <= 90 ? reactY : prodY);

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
 <div style={{ background: T.panel, borderRadius: 14, padding: 20, border: `1.5px solid ${T.border}`, boxShadow: "0 2px 12px #0001" }}>
 <SectionTitle color={T.eo_e}>Kinetics: Rates, Barriers & Reaction Dynamics</SectionTitle>

 <AnalogyBox>
 Thermodynamics says whether a change <em>can</em> happen. Kinetics says <em>how fast</em> it happens. Some changes are possible but very slow because there is a high energy barrier in the way. Higher temperature gives atoms more energy to get over the barrier, making things happen faster.
 </AnalogyBox>

 {/* ── ARRHENIUS EQUATION ── */}
 <div style={{ fontSize: 14, fontWeight: 800, color: T.eo_e, marginBottom: 10 }}>The Arrhenius Equation</div>

 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 14 }}>
 {/* Energy barrier SVG */}
 <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 320, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
 {/* Y-axis: Energy */}
 <line x1={25} y1={15} x2={25} y2={H - 20} stroke={T.dim} strokeWidth={1} />
 <line x1={25} y1={15} x2={21} y2={23} stroke={T.dim} strokeWidth={1} />
 <line x1={25} y1={15} x2={29} y2={23} stroke={T.dim} strokeWidth={1} />
 <text x={12} y={H / 2} fontSize={10} fill={T.muted} textAnchor="middle" transform={`rotate(-90, 12, ${H / 2})`}>Energy</text>

 {/* X-axis: Reaction coordinate */}
 <line x1={25} y1={H - 20} x2={W - 10} y2={H - 20} stroke={T.dim} strokeWidth={1} />
 <line x1={W - 10} y1={H - 20} x2={W - 18} y2={H - 24} stroke={T.dim} strokeWidth={1} />
 <line x1={W - 10} y1={H - 20} x2={W - 18} y2={H - 16} stroke={T.dim} strokeWidth={1} />
 <text x={W / 2 + 10} y={H - 4} fontSize={10} fill={T.muted} textAnchor="middle">Reaction coordinate</text>

 {/* Energy path */}
 <path d={`M 35,${reactY} C 70,${reactY} 100,${adjBarrierY} 140,${adjBarrierY} C 180,${adjBarrierY} 210,${prodY} 260,${prodY}`}
 fill="none" stroke={T.eo_e} strokeWidth={2.5} opacity={0.7} />

 {/* Labels */}
 <text x={45} y={reactY + 14} fontSize={9} fill={T.ink} fontWeight={600}>Reactants</text>
 <text x={220} y={prodY + 14} fontSize={9} fill={T.ink} fontWeight={600}>Products</text>
 <text x={140} y={adjBarrierY - 8} fontSize={9} fill={T.accent} fontWeight={700} textAnchor="middle">E<tspan dy={3} fontSize={7}>a</tspan><tspan dy={-3}> = {ea.toFixed(2)} eV</tspan></text>

 {/* Ea arrow */}
 <line x1={120} y1={reactY} x2={120} y2={adjBarrierY + 4} stroke={T.accent} strokeWidth={1.5} strokeDasharray="4,2" />
 <line x1={117} y1={adjBarrierY + 10} x2={120} y2={adjBarrierY + 4} stroke={T.accent} strokeWidth={1.5} />
 <line x1={123} y1={adjBarrierY + 10} x2={120} y2={adjBarrierY + 4} stroke={T.accent} strokeWidth={1.5} />

 {/* Animated ball */}
 <circle cx={ballX} cy={ballY - 6} r={6} fill={T.eo_e} opacity={0.8} />
 </svg>

 <div style={{ marginTop: 8 }}>
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 2 }}>
 <span>Activation energy Eₐ</span>
 <span style={{ color: T.eo_hole, fontWeight: 700 }}>{ea.toFixed(2)} eV</span>
 </div>
 <input type="range" min={0.1} max={3.0} step={0.05} value={ea} onChange={e => setEa(+e.target.value)}
 style={{ width: "100%", accentColor: T.eo_hole }} />
 </div>
 <div style={{ marginTop: 6 }}>
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 2 }}>
 <span>Temperature</span>
 <span style={{ color: T.eo_e, fontWeight: 700 }}>{temp} K</span>
 </div>
 <input type="range" min={200} max={2000} step={10} value={temp} onChange={e => setTemp(+e.target.value)}
 style={{ width: "100%", accentColor: T.eo_e }} />
 </div>
 </div>

 {/* Live results */}
 <div style={{ width: "100%" }}>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}33`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
 <div style={{ fontSize: 15, fontWeight: 800, color: T.eo_e, marginBottom: 6, fontFamily: "'Georgia',serif" }}>
 k = A · exp(−Eₐ / k<sub>B</sub>T)
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
 <InfoRow label="Attempt frequency A" value="10¹³ s⁻¹ (typical)" />
 <InfoRow label="Eₐ" value={`${ea.toFixed(2)} eV`} />
 <InfoRow label="Temperature" value={`${temp} K`} />
 <InfoRow label="kBT" value={`${(kB * temp).toFixed(4)} eV`} />
 <InfoRow label="Eₐ / kBT" value={(ea / (kB * temp)).toFixed(1)} />
 <InfoRow label="Rate constant k" value={rate > 0.01 ? rate.toExponential(2) + " s⁻¹" : rate.toExponential(2) + " s⁻¹"} />
 <InfoRow label="log₁₀(k)" value={logRate.toFixed(1)} />
 </div>
 </div>

 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
 <strong>Physical meaning:</strong> At {temp} K with Eₐ = {ea.toFixed(2)} eV,
 {ea / (kB * temp) > 40 ? " the barrier is insurmountable — the process is frozen." :
 ea / (kB * temp) > 20 ? " the process is extremely slow — geological timescales." :
 ea / (kB * temp) > 10 ? " the process occurs slowly — hours to days at lab scale." :
 ea / (kB * temp) > 5 ? " the process is fast enough for practical applications." :
 " the process is very fast — nearly every attempt succeeds."}
 </div>

 <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginBottom: 6, letterSpacing: 1 }}>MATERIALS EXAMPLES</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
 {arrheniusExamples.map((ex, i) => {
 const r = 1e13 * Math.exp(-ex.ea / (kB * temp));
 return (
 <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", borderBottom: `1px solid ${T.border}44` }}>
 <span style={{ color: ex.color, fontWeight: 600 }}>{ex.name}</span>
 <span style={{ color: T.ink, fontFamily: "monospace" }}>Eₐ={ex.ea} eV → k={r.toExponential(1)} s⁻¹</span>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* ── TRANSITION STATE THEORY ── */}
 <div style={{ fontSize: 14, fontWeight: 800, color: T.eo_e, marginBottom: 8, marginTop: 8 }}>Transition State Theory</div>
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
 <div style={{ flex: 1, minWidth: 260, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Eyring Equation</div>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 8 }}>
 k = (k<sub>B</sub>T / h) × exp(−ΔG‡ / k<sub>B</sub>T)
 </div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
 Unlike Arrhenius, Eyring separates the barrier into enthalpy (ΔH‡) and entropy (ΔS‡) contributions:
 ΔG‡ = ΔH‡ − TΔS‡. This explains why some reactions speed up more than Arrhenius predicts —
 the entropy of the transition state matters. In diffusion, a loose transition state (high ΔS‡) gives a larger pre-exponential factor.
 </div>
 </div>
 <div style={{ flex: 1, minWidth: 260, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>How Catalysts Work</div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7 }}>
 A catalyst provides an <strong style={{ color: T.ink }}>alternative reaction pathway</strong> with a lower activation energy.
 It does NOT change ΔG of the reaction — only how fast equilibrium is reached.
 In materials science: Pt surfaces catalyze H₂ dissociation (Eₐ drops from 4.5 eV in gas phase to ~0.7 eV on Pt).
 CdCl₂ treatment in CdTe solar cells acts as a flux, lowering the barrier for grain boundary passivation and recrystallization.
 </div>
 </div>
 </div>

 {/* ── LE CHATELIER'S PRINCIPLE ── */}
 <div style={{ fontSize: 14, fontWeight: 800, color: T.eo_e, marginBottom: 8 }}>Le Chatelier{"'"}s Principle</div>
 <div style={{ background: "#7c3aed08", border: "1.5px solid #7c3aed33", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
 <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>The Principle</div>
 <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
 When a system at equilibrium is subjected to a change in concentration, temperature, or pressure,
 the system shifts to partially counteract the imposed change and establish a new equilibrium.
 </div>
 </div>
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
 {[
 { title: "Temperature", color: T.eo_hole, icon: "",
 text: "Increasing T shifts equilibrium toward endothermic direction. CaCO₃ → CaO + CO₂ is endothermic — heating drives decomposition. This is how cement is made (calcination at 900°C). For ZnTe growth, higher T favors decomposition, limiting maximum growth temperature." },
 { title: "Pressure", color: T.eo_cond, icon: "",
 text: "Increasing P favors the denser (smaller volume) phase. Graphite → diamond requires ~5 GPa because diamond is 50% denser. In sputtering, Ar pressure controls whether films grow dense (low P, high energy) or columnar (high P, thermalized atoms)." },
 { title: "Concentration", color: T.eo_valence, icon: "",
 text: "Adding more reactant shifts equilibrium toward products. In semiconductor growth, increasing Te overpressure during ZnTe MBE suppresses Te vacancies (V_Te) because the system shifts to consume excess Te. This is why II-VI growth uses VI/II ratio > 1." },
 ].map((item, i) => (
 <div key={i} style={{ flex: 1, minWidth: 200, background: item.color + "08", border: `1px solid ${item.color}33`, borderRadius: 8, padding: 12 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.icon} {item.title}</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>{item.text}</div>
 </div>
 ))}
 </div>

 {/* ── REACTION ORDER & AVRAMI ── */}
 <div style={{ fontSize: 14, fontWeight: 800, color: T.eo_e, marginBottom: 8 }}>Reaction Kinetics in Materials</div>
 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
 <div style={{ flex: 1, minWidth: 260, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Reaction Orders</div>
 <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
 <InfoRow label="Zero-order" value="d[A]/dt = −k → [A] = [A]₀ − kt" />
 <InfoRow label="First-order" value="d[A]/dt = −k[A] → [A] = [A]₀ e⁻ᵏᵗ" />
 <InfoRow label="Second-order" value="d[A]/dt = −k[A]² → 1/[A] = 1/[A]₀ + kt" />
 <InfoRow label="Half-life (1st order)" value="t₁/₂ = ln(2)/k = 0.693/k" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginTop: 8 }}>
 <strong style={{ color: T.ink }}>Materials example:</strong> Radioactive decay (first-order), oxide layer growth on Si (parabolic/second-order at long times via Deal-Grove model), and corrosion of metals (often zero-order when limited by O₂ transport).
 </div>
 </div>
 <div style={{ flex: 1, minWidth: 260, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}>JMA / Avrami Equation</div>
 <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 6, fontFamily: "'Georgia',serif" }}>
 f(t) = 1 − exp(−kt<sup>n</sup>)
 </div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, marginBottom: 8 }}>
 Describes phase transformations via nucleation + growth.
 The Avrami exponent <strong style={{ color: T.ink }}>n</strong> encodes the transformation mechanism:
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
 <InfoRow label="n ≈ 1" value="Surface nucleation, 1D growth" />
 <InfoRow label="n ≈ 2" value="Constant nucleation rate, 1D growth" />
 <InfoRow label="n ≈ 2.5" value="Constant nucleation, 2D growth" />
 <InfoRow label="n ≈ 3" value="Constant nucleation, 2D growth (or instantaneous 3D)" />
 <InfoRow label="n ≈ 4" value="Constant nucleation, 3D growth" />
 </div>
 <div style={{ marginTop: 8 }}>
 <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 2 }}>
 <span>Time</span>
 <span style={{ color: T.eo_valence, fontWeight: 700 }}>{avramiT} s → f = {(avramiF * 100).toFixed(1)}%</span>
 </div>
 <input type="range" min={10} max={1000} step={10} value={avramiT} onChange={e => setAvramiT(+e.target.value)}
 style={{ width: "100%", accentColor: T.eo_valence }} />
 <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>
 n = {avN}, k = {avK} s⁻ⁿ (recrystallization of cold-worked Cu at 250°C) · t₅₀ = {t50.toFixed(0)} s
 </div>
 </div>
 </div>
 </div>

 {/* ── DFT AND KINETICS ── */}
 <div style={{ fontSize: 14, fontWeight: 800, color: T.eo_e, marginBottom: 8, marginTop: 8 }}>How Accurately Can DFT Model Kinetics?</div>

 <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
 <div style={{ flex: 1, minWidth: 260, background: T.eo_valence + "08", border: `1px solid ${T.eo_valence}33`, borderRadius: 8, padding: 12 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_valence, marginBottom: 6 }}> What DFT Does Well</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
 • <strong>Migration barriers via NEB</strong> — Nudged Elastic Band method maps minimum-energy paths between states, typically accurate to 0.1–0.3 eV<br />
 • <strong>Diffusion pathways</strong> — Identifies which path (vacancy, interstitial, kick-out) has the lowest barrier<br />
 • <strong>Transition state geometry</strong> — Finds saddle points on the potential energy surface<br />
 • <strong>Relative barrier comparison</strong> — Even if absolute values are off by 0.2 eV, ranking of mechanisms is usually correct<br />
 • <strong>Defect migration</strong> — Vacancy/interstitial hops in Si, metals, and oxides are well-described
 </div>
 </div>
 <div style={{ flex: 1, minWidth: 260, background: T.eo_gap + "08", border: `1px solid ${T.eo_gap}33`, borderRadius: 8, padding: 12 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 6 }}> Where DFT Struggles</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.8 }}>
 • <strong>Pre-exponential factor</strong> — Requires phonon calculations (expensive) + harmonic approximation breaks down at high T<br />
 • <strong>Entropic contributions</strong> — GGA-DFT gives 0 K energies; finite-T entropy needs AIMD or quasi-harmonic approx<br />
 • <strong>Long timescales</strong> — AIMD limited to ~ps-ns; real diffusion/nucleation occurs on µs-s timescales<br />
 • <strong>Strongly correlated systems</strong> — Transition metal oxides, f-electron systems: barriers can be off by 0.5+ eV<br />
 • <strong>Van der Waals</strong> — Standard DFT misses dispersion; need vdW-DF or DFT-D3 corrections for layered materials<br />
 • <strong>Band gap errors</strong> — PBE underestimates gaps by 30–50%, affecting charged defect barriers; HSE06 helps but is 10–100× more expensive
 </div>
 </div>
 </div>

 {/* DFT accuracy table */}
 <div style={{ background: T.panel, borderRadius: 8, padding: 12, border: `1.5px solid ${T.border}`, marginBottom: 14 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_e, marginBottom: 8 }}>DFT vs Experiment: Activation Barriers</div>
 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
 <thead>
 <tr style={{ borderBottom: `2px solid ${T.border}` }}>
 {["Process", "DFT (eV)", "Expt (eV)", "Error", "Method"].map(h => (
 <th key={h} style={{ padding: "5px 8px", textAlign: "left", color: T.muted, fontWeight: 700 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {[
 { proc: "Vacancy migration in Si", dft: "0.45", expt: "0.43", err: "+0.02", method: "PBE-NEB", color: T.eo_valence },
 { proc: "O interstitial in Si", dft: "2.3", expt: "2.44", err: "−0.14", method: "PBE-NEB", color: T.eo_valence },
 { proc: "Li diffusion in LiFePO₄", dft: "0.27", expt: "0.30", err: "−0.03", method: "GGA+U NEB", color: T.eo_valence },
 { proc: "N vacancy in GaN", dft: "2.6", expt: "2.4–4.1", err: "~0.2–1.5", method: "HSE-NEB", color: T.eo_photon },
 { proc: "Cu self-diffusion", dft: "0.72", expt: "0.70", err: "+0.02", method: "PBE-NEB", color: T.eo_valence },
 { proc: "H diffusion in Pd", dft: "0.16", expt: "0.23", err: "−0.07", method: "PBE-NEB", color: T.eo_photon },
 { proc: "CO oxidation on Pt(111)", dft: "0.7", expt: "1.0", err: "−0.3", method: "RPBE", color: T.eo_hole },
 { proc: "Perovskite ion migration", dft: "0.2–0.8", expt: "0.3–1.0", err: "~0.1–0.3", method: "PBE/HSE", color: T.eo_photon },
 ].map((row, i) => (
 <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : T.panel }}>
 <td style={{ padding: "4px 8px", color: T.ink, fontWeight: 600 }}>{row.proc}</td>
 <td style={{ padding: "4px 8px", color: T.eo_e, fontFamily: "monospace" }}>{row.dft}</td>
 <td style={{ padding: "4px 8px", color: T.ink, fontFamily: "monospace" }}>{row.expt}</td>
 <td style={{ padding: "4px 8px", color: Math.abs(parseFloat(row.err)) > 0.2 ? T.eo_hole : T.eo_valence, fontFamily: "monospace", fontWeight: 700 }}>{row.err}</td>
 <td style={{ padding: "4px 8px", color: T.muted }}>{row.method}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ fontSize: 10, color: T.muted, marginTop: 8, lineHeight: 1.6 }}>
 <strong style={{ color: T.ink }}>Rule of thumb:</strong> DFT-PBE gives migration barriers within ±0.1–0.3 eV for simple defects in covalent/metallic systems.
 Charged defects, surface reactions, and strongly correlated materials may need HSE06 or beyond.
 Since k ∝ exp(−Eₐ/k<sub>B</sub>T), a 0.2 eV error at 300 K changes the rate by ~2500×.
 At 1000 K, the same error changes it by only ~10×.
 </div>
 </div>

 {/* Machine-learned force fields bridge */}
 <div style={{ background: T.eo_cond + "08", border: `1px solid ${T.eo_cond}33`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_cond, marginBottom: 4 }}>Bridging the Gap: ML Force Fields</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
 Universal machine-learned force fields (M3GNet, CHGNet, MACE-MP) trained on millions of DFT calculations can
 run molecular dynamics 10,000× faster than AIMD while retaining near-DFT accuracy. This allows simulation of
 diffusion, phase transformations, and nucleation at realistic timescales (nanoseconds) and system sizes (thousands of atoms) —
 exactly the regime where pure DFT fails. These are the models powering tools like <strong>Materials Informatics Studio</strong> on nanoHUB.
 </div>
 </div>

 {/* ── NUMERICAL EXAMPLES ── */}
 <NCard title="Numerical Example: Vacancy Diffusion in Silicon" color={T.eo_e} formula={"D = D₀ exp(−Eₐ/kBT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> You are modeling dopant activation in a silicon wafer. Dopants move via a vacancy mechanism — they swap positions with neighboring vacancies. The vacancy migration barrier is Eₐ = 0.43 eV (experiment) or 0.45 eV (DFT-PBE), with D₀ = 0.015 cm²/s. Calculate the diffusion coefficient at room temperature (300 K) and at processing temperature (1000°C = 1273 K).
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine a crowded parking lot where cars can only move when there{"'"}s an empty space next to them. At low temperature (slow day), empty spaces are rare and cars barely move. At high temperature (busy day), spaces open up constantly and cars shuffle rapidly. The activation energy is the effort needed for a car to squeeze into the empty spot.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given values:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Eₐ (experiment)" value="0.43 eV" />
 <InfoRow label="Eₐ (DFT-PBE)" value="0.45 eV" />
 <InfoRow label="D₀" value="0.015 cm²/s" />
 <InfoRow label="kB" value="8.617 × 10⁻⁵ eV/K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate D at 300 K:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="kBT = 8.617×10⁻⁵ × 300 = 0.02585 eV" result="" color={T.eo_e} />
 <CalcRow eq="Eₐ/kBT = 0.43 / 0.02585 = 16.63" result="" color={T.eo_e} />
 <CalcRow eq="D = 0.015 × exp(−16.63)" result="" color={T.eo_e} />
 <CalcRow eq="D(300 K)" result="8.9 × 10⁻¹⁰ cm²/s" color={T.eo_e} />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Calculate D at 1273 K:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="kBT = 8.617×10⁻⁵ × 1273 = 0.1097 eV" result="" color={T.eo_e} />
 <CalcRow eq="Eₐ/kBT = 0.43 / 0.1097 = 3.92" result="" color={T.eo_e} />
 <CalcRow eq="D = 0.015 × exp(−3.92)" result="" color={T.eo_e} />
 <CalcRow eq="D(1273 K)" result="2.96 × 10⁻⁴ cm²/s" color={T.eo_e} />
 </div>
 <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
 <ResultBox label="D at 300 K" value="8.9×10⁻¹⁰" color={T.eo_e} sub="cm²/s (frozen)" />
 <ResultBox label="D at 1273 K" value="2.96×10⁻⁴" color={T.eo_e} sub="cm²/s (fast)" />
 <ResultBox label="Ratio" value="3.3×10⁵" color={T.eo_hole} sub="× faster at 1273 K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — DFT accuracy check:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Using DFT Eₐ = 0.45 eV instead of 0.43:" result="" color={T.eo_hole} />
 <CalcRow eq="D_DFT(300 K) = 0.015 × exp(−0.45/0.02585)" result="3.9 × 10⁻¹⁰ cm²/s" color={T.eo_hole} />
 <CalcRow eq="Error factor at 300 K: 8.9/3.9" result="~2.3× overestimate of barrier" color={T.eo_hole} />
 <CalcRow eq="D_DFT(1273 K) = 0.015 × exp(−0.45/0.1097)" result="2.44 × 10⁻⁴ cm²/s" color={T.eo_hole} />
 <CalcRow eq="Error factor at 1273 K: 2.96/2.44" result="~1.2× (much smaller!)" color={T.eo_valence} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
 Vacancy diffusion is essentially frozen at room temperature (D ~ 10⁻¹⁰ cm²/s) but rapid at 1000°C (D ~ 10⁻⁴ cm²/s) — a 300,000× increase. This is why dopant activation requires annealing at high temperatures. DFT{"'"}s 0.02 eV overestimate of the barrier causes a 2.3× error at 300 K but only 1.2× at 1273 K — high-T predictions are much more forgiving because the exponential sensitivity decreases as kBT grows.
 </div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Avrami Kinetics — Recrystallization of Cold-Worked Copper" color={T.eo_e} formula={"f(t) = 1 − exp(−kt^n)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> You cold-rolled a copper sheet to 50% reduction, introducing a high dislocation density (~10¹⁵ m⁻²). You anneal at 250°C and monitor the fraction recrystallized over time using hardness measurements. The Avrami parameters are n = 2.5 and k = 1.2 × 10⁻⁴ s⁻ⁿ. Calculate the recrystallized fraction at 60, 120, 300, and 600 seconds, and find the half-recrystallization time t₅₀.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Imagine popcorn kernels in a microwave. At first, nothing happens (nucleation lag). Then a few pop, then many pop rapidly (growth phase), then the rate slows as few un-popped kernels remain. The S-shaped curve of popping fraction vs time is exactly the Avrami equation. The exponent n tells you whether kernels pop independently (like 3D nucleation) or in chains (like 1D growth).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given values:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Avrami exponent n" value="2.5 (nucleation + 2D growth)" />
 <InfoRow label="Rate constant k" value="1.2 × 10⁻⁴ s⁻ⁿ" />
 <InfoRow label="Temperature" value="250°C (523 K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate f(t) at each time:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="t = 60 s: kt^n = 1.2×10⁻⁴ × 60^2.5 = 1.2×10⁻⁴ × 27,885" result="kt^n = 3.35" color={T.eo_e} />
 <CalcRow eq="f(60) = 1 − exp(−3.35)" result="f = 96.5%" color={T.eo_e} />
 <CalcRow eq="t = 120 s: kt^n = 1.2×10⁻⁴ × 120^2.5 = 1.2×10⁻⁴ × 157,744" result="kt^n = 18.9" color={T.eo_e} />
 <CalcRow eq="f(120) = 1 − exp(−18.9)" result="f ≈ 100%" color={T.eo_e} />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Find t₅₀ (half-recrystallization time):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Set f = 0.5: 0.5 = 1 − exp(−kt₅₀^n)" result="" color={T.eo_e} />
 <CalcRow eq="exp(−kt₅₀^n) = 0.5 → kt₅₀^n = ln(2) = 0.693" result="" color={T.eo_e} />
 <CalcRow eq="t₅₀^n = 0.693 / k = 0.693 / 1.2×10⁻⁴ = 5775" result="" color={T.eo_e} />
 <CalcRow eq="t₅₀ = 5775^(1/2.5) = 5775^0.4" result="t₅₀ = 38.1 s" color={T.eo_e} />
 </div>
 <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
 <ResultBox label="f at 60 s" value="96.5%" color={T.eo_e} sub="nearly complete" />
 <ResultBox label="t₅₀" value="38.1 s" color={T.eo_e} sub="half-recrystallized" />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
 Recrystallization at 250°C is remarkably fast — 50% complete in just 38 seconds and essentially done by 60 seconds. The sigmoidal shape is characteristic: slow nucleation → rapid growth → saturation. The Avrami exponent n = 2.5 suggests a combination of continuous nucleation with two-dimensional growth of new grains consuming the deformed matrix. At lower temperatures, k decreases exponentially (it follows Arrhenius!), making the same transformation take hours or days. This is why annealing temperature must be carefully controlled in metallurgical processing.
 </div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Nucleation Critical Radius for CdTe from Vapor" color={T.eo_e} formula={"r* = 2γV_m / (kT ln(S))"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> During CdTe vapor deposition, the surface energy is γ = 0.5 J/m², the molar volume V_m = 3.24 × 10⁻⁵ m³/mol, and the supersaturation ratio is S = P/P_eq = 5 at T = 873 K. Calculate the critical nucleus radius and the number of atoms in the critical nucleus.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A nucleus must reach a critical size before it can grow spontaneously. Too small, and the surface energy penalty (proportional to r²) outweighs the volume free energy gain (proportional to r³). It is like inflating a balloon -- you must blow hard to get past the initial resistance (surface tension dominates), but once the balloon is big enough, it inflates easily (volume wins).</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Surface energy" value="γ = 0.5 J/m²" />
 <InfoRow label="Atomic volume" value="Ω = V_m/N_A = 3.24×10⁻⁵/6.022×10²³ = 5.38 × 10⁻²⁹ m³" />
 <InfoRow label="Supersaturation" value="S = 5 → kT ln(S) = 0.0752 × 1.609 = 0.121 eV = 1.94 × 10⁻²⁰ J" />
 <InfoRow label="Temperature" value="T = 873 K" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="r* = 2γΩ/(kT ln S) = 2 × 0.5 × 5.38×10⁻²⁹ / 1.94×10⁻²⁰" result="" color={T.eo_e} />
 <CalcRow eq="= 5.38×10⁻²⁹ / 1.94×10⁻²⁰" result="r* = 2.77 × 10⁻⁹ m = 2.77 nm" color={T.eo_e} />
 <CalcRow eq="n* = (4/3)π(r*)³/Ω = (4/3)π(2.77×10⁻⁹)³ / 5.38×10⁻²⁹" result="" color={T.eo_e} />
 <CalcRow eq="= 8.89×10⁻²⁶ / 5.38×10⁻²⁹" result="n* ≈ 1650 atoms" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The critical nucleus is ~2.8 nm and contains ~1650 atoms. Clusters smaller than this dissolve back; larger ones grow irreversibly. Higher supersaturation (S) shrinks r*, promoting more nuclei (fine-grained film). Lower S gives fewer, larger nuclei (columnar growth). CdTe solar cells need large grains to minimize recombination at grain boundaries, so moderate supersaturation is preferred during CSS deposition.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Deal-Grove Model -- Silicon Oxidation Thickness" color={T.eo_e} formula={"x² + Ax = B(t + τ)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Dry oxidation of Si at 1000°C follows Deal-Grove kinetics with A = 0.165 μm, B = 0.0117 μm²/hr, and τ = 0.37 hr (for an initial oxide). Calculate the oxide thickness after 1 hour of oxidation. Is growth linear-limited or parabolic-limited?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Silicon oxidation is like painting a wall -- the first coat goes on fast (limited by surface reaction rate, linear regime). But each new coat means oxygen must diffuse through all previous coats to reach fresh silicon (parabolic regime, x² ∝ t). Thin oxides grow linearly; thick oxides grow as √t. The Deal-Grove model captures both regimes in one equation.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Linear rate constant" value="B/A = 0.0117/0.165 = 0.0709 μm/hr" />
 <InfoRow label="Parabolic rate constant" value="B = 0.0117 μm²/hr" />
 <InfoRow label="Time offset" value="τ = 0.37 hr" />
 <InfoRow label="Oxidation time" value="t = 1 hr" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="x² + 0.165x = 0.0117 × (1 + 0.37) = 0.01603 μm²" result="" color={T.eo_e} />
 <CalcRow eq="Solve quadratic: x = [−0.165 + √(0.165² + 4×0.01603)] / 2" result="" color={T.eo_e} />
 <CalcRow eq="= [−0.165 + √(0.02723 + 0.06413)] / 2" result="" color={T.eo_e} />
 <CalcRow eq="= [−0.165 + √0.09136] / 2 = [−0.165 + 0.3023] / 2" result="x = 0.0686 μm = 68.6 nm" color={T.eo_e} />
 <CalcRow eq="Check: x/A = 0.0686/0.165 = 0.42 (comparable to 1)" result="→ transitional regime" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>After 1 hour of dry oxidation at 1000°C, the SiO₂ thickness is 68.6 nm. Since x/A ≈ 0.42 (between 0 and 1), growth is in the transition between linear and parabolic regimes. For thinner oxides (gate dielectrics, ~2 nm), growth is purely linear. For thick field oxides (~500 nm), it is purely parabolic (x ∝ √t). The Deal-Grove model has guided CMOS fabrication since 1965 and remains the textbook standard for thermal oxidation.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Grain Growth Kinetics in CdTe" color={T.eo_e} formula={"d² − d₀² = kt, k = k₀ exp(−Q/RT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> CdTe thin films deposited by CSS have initial grain size d₀ = 0.5 μm. After CdCl₂ treatment at 400°C for 20 minutes, grains grow to d = 2.0 μm. Calculate the rate constant k and predict the grain size after 60 minutes.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Grain growth is like soap bubbles merging -- large bubbles consume small ones because the curved boundary has higher energy. The driving force is proportional to 1/d (smaller grains → more curvature → faster shrinkage). This gives parabolic kinetics: d² ∝ t. CdCl₂ treatment accelerates this by forming a liquid flux at grain boundaries, dramatically increasing boundary mobility.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Initial grain size" value="d₀ = 0.5 μm" />
 <InfoRow label="Final grain size at 20 min" value="d = 2.0 μm" />
 <InfoRow label="Treatment temperature" value="400°C = 673 K" />
 <InfoRow label="Treatment time" value="t = 20 min = 1200 s" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="k = (d² − d₀²)/t = ((2.0)² − (0.5)²)/1200 = (4.0 − 0.25)/1200" result="" color={T.eo_e} />
 <CalcRow eq="= 3.75/1200" result="k = 3.125 × 10⁻³ μm²/s" color={T.eo_e} />
 <CalcRow eq="At t = 60 min = 3600 s: d² = d₀² + kt = 0.25 + 3.125×10⁻³ × 3600" result="" color={T.eo_e} />
 <CalcRow eq="d² = 0.25 + 11.25 = 11.50 μm²" result="d = 3.39 μm" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>After CdCl₂ treatment, grains grow from 0.5 μm to 2.0 μm in 20 minutes and would reach 3.4 μm in 60 minutes (parabolic: doubling grain size requires 4× more time). Larger grains mean fewer grain boundaries and less recombination, directly improving solar cell voltage. However, excessively long treatments (more than 30 min) cause CdCl₂ to penetrate the entire film and degrade the back contact. Optimal CdTe solar cells target grain sizes of 2-5 μm.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Minority Carrier Diffusion Length in CdTe" color={T.eo_e} formula={"L = √(Dτ), D = μkT/e"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In CdTe solar cells, the electron (minority carrier) mobility is μ_e = 320 cm²/(V·s) and the recombination lifetime is τ = 2 ns. Calculate the diffusion coefficient, diffusion length, and whether a 5 μm CdTe absorber is thick enough.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A photogenerated minority carrier (electron in p-type CdTe) random-walks through the crystal until it either reaches the junction (collected -- current!) or recombines (lost -- heat). The diffusion length L is the average distance it travels before recombining. For a solar cell to work well, L must exceed the absorber thickness -- otherwise carriers generated deep in the film are lost.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Electron mobility" value="μ_e = 320 cm²/(V·s) = 3.2 × 10⁻² m²/(V·s)" />
 <InfoRow label="Recombination lifetime" value="τ = 2 ns = 2 × 10⁻⁹ s" />
 <InfoRow label="kT/e at 300 K" value="0.02585 V" />
 <InfoRow label="CdTe absorber thickness" value="~5 μm" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="D = μkT/e = 320 × 0.02585 = 8.27 cm²/s" result="" color={T.eo_e} />
 <CalcRow eq="L = √(Dτ) = √(8.27 × 2×10⁻⁹)" result="" color={T.eo_e} />
 <CalcRow eq="= √(1.654 × 10⁻⁸) cm" result="L = 1.29 × 10⁻⁴ cm = 1.29 μm" color={T.eo_e} />
 <CalcRow eq="Ratio: L/thickness = 1.29/5" result="= 0.26 (L < thickness!)" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>With L = 1.3 μm and a 5 μm absorber, only carriers generated within ~1.3 μm of the junction are collected. Photons absorbed deeper than L are wasted. This is why CdTe solar cells use a short-circuit collection mechanism aided by the built-in electric field (drift collection). Improving τ from 2 ns to 20 ns (via Cu doping and CdCl₂ treatment) extends L to 4.1 μm, dramatically boosting efficiency from ~15% to ~22%. Lifetime engineering is the key bottleneck in CdTe PV.</div>
 </div>
 </NCard>

 {/* Coming Next */}
 <div style={{
 background: `${T.eo_e}11`, border: `1px solid ${T.eo_e}44`,
 borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 1.6,
 }}>
 <div style={{ fontWeight: "bold", color: T.eo_e, marginBottom: 4 }}>Coming Next: Phase Diagrams {"→"}</div>
 <div style={{ color: T.ink }}>
 Kinetics tells us how fast — phase diagrams tell us where we end up. Next we map out which phases are stable under every combination of temperature and composition — the recipe book for crystal growth.
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

 const W = 400, H = 340;
 const mL = 55, mR = 25, mT = 25, mB = 50;
 const pW = W - mL - mR;
 const pH_ = H - mT - mB;

 // Cu-Ni isomorphous system (complete solid solution)
 const Tmin = 900, Tmax = 1600;
 const tempK = Tmin + tempFrac * (Tmax - Tmin);
 const meltCu = 1085; // Cu melting point (°C)
 const meltNi = 1455; // Ni melting point (°C)

 const toSX = (c) => mL + c * pW;
 const toSY = (t) => mT + (1 - (t - Tmin) / (Tmax - Tmin)) * pH_;

 // Liquidus: smooth curve between Cu and Ni melting points
 const liquidus = (x) => meltCu + (meltNi - meltCu) * x - 80 * Math.sin(Math.PI * x);
 // Solidus: below liquidus, same endpoints
 const solidus = (x) => meltCu + (meltNi - meltCu) * x - 180 * Math.sin(Math.PI * x);

 let liquidusPath = "M" + toSX(0).toFixed(1) + "," + toSY(meltCu).toFixed(1);
 let solidusPath = "M" + toSX(0).toFixed(1) + "," + toSY(meltCu).toFixed(1);
 for (let i = 1; i <= 50; i++) {
 const x = i / 50;
 liquidusPath += "L" + toSX(x).toFixed(1) + "," + toSY(liquidus(x)).toFixed(1);
 solidusPath += "L" + toSX(x).toFixed(1) + "," + toSY(solidus(x)).toFixed(1);
 }

 // Two-phase region fill (between liquidus and solidus)
 let twoPhaseFill = liquidusPath;
 for (let i = 50; i >= 0; i--) {
 const x = i / 50;
 twoPhaseFill += "L" + toSX(x).toFixed(1) + "," + toSY(solidus(x)).toFixed(1);
 }
 twoPhaseFill += "Z";

 const cx = toSX(compX);
 const cy = toSY(tempK);

 const liqT = liquidus(compX);
 const solT = solidus(compX);
 let phase;
 if (tempK > liqT) {
 phase = "Liquid";
 } else if (tempK > solT) {
 phase = "Liquid + Solid (two-phase)";
 } else {
 phase = "Solid (FCC solid solution)";
 }

 const inTwoPhase = tempK <= liqT && tempK > solT;
 let leverFracLiq = 0;
 if (inTwoPhase) {
 // Find liquidus and solidus compositions at this temperature using inverse
 // Simple linear interpolation for lever rule
 let xL = compX, xS = compX;
 for (let i = 0; i <= 100; i++) {
 const xx = i / 100;
 if (Math.abs(liquidus(xx) - tempK) < 5) xL = xx;
 if (Math.abs(solidus(xx) - tempK) < 5) xS = xx;
 }
 const denom = Math.abs(xL - xS);
 leverFracLiq = denom > 0.01 ? Math.abs(compX - xS) / denom : 0.5;
 leverFracLiq = Math.max(0, Math.min(1, leverFracLiq));
 }

 const pulse = 0.5 + 0.3 * Math.sin(frame * 0.1);

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "monospace", color: T.ink }}>
 <AnalogyBox>
 A phase diagram is like a map that shows which form of a material is stable at different temperatures and mixtures. Cross a boundary on the map and the material changes form (like ice melting to water). Engineers use these maps to know the right conditions for making materials.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
 <svg viewBox={`0 0 ${W} ${H}`} style={{ background: T.surface, borderRadius: 6, width: "100%", maxWidth: W }}>
 {/* Liquid region */}
 <rect x={mL} y={mT} width={pW} height={pH_}
 fill={T.accent} opacity={0.03} />

 {/* Two-phase region fill */}
 <path d={twoPhaseFill} fill={T.accent} opacity={0.1} />

 {/* Solid region label area */}
 <text x={mL + pW / 2} y={mT + 15} textAnchor="middle"
 fontSize={12} fill={T.accent} fontFamily="monospace" opacity={0.7}>Liquid</text>
 <text x={mL + pW * 0.5} y={toSY((liquidus(compX) + solidus(compX)) / 2)}
 textAnchor="middle" fontSize={12} fill={T.accent} fontFamily="monospace" opacity={0.6}>L + S</text>
 <text x={mL + pW / 2} y={H - mB - 15} textAnchor="middle"
 fontSize={12} fill={T.accent} fontFamily="monospace" opacity={0.7}>
 Solid (FCC)
 </text>

 {/* Liquidus curve */}
 <path d={liquidusPath} fill="none" stroke={T.accent} strokeWidth={2.5} />
 {/* Solidus curve */}
 <path d={solidusPath} fill="none" stroke={T.accent} strokeWidth={2} strokeDasharray="6,3" />

 {/* Legend */}
 <line x1={mL + 10} y1={mT + 30} x2={mL + 35} y2={mT + 30} stroke={T.accent} strokeWidth={2.5} />
 <text x={mL + 40} y={mT + 34} fontSize={10} fill={T.muted}>Liquidus</text>
 <line x1={mL + 100} y1={mT + 30} x2={mL + 125} y2={mT + 30} stroke={T.accent} strokeWidth={2} strokeDasharray="6,3" />
 <text x={mL + 130} y={mT + 34} fontSize={10} fill={T.muted}>Solidus</text>

 {/* Crosshair cursor */}
 <line x1={cx} y1={mT} x2={cx} y2={H - mB}
 stroke={T.accent} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
 <line x1={mL} y1={cy} x2={mL + pW} y2={cy}
 stroke={T.accent} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
 <circle cx={cx} cy={cy} r={6} fill={T.accent} opacity={pulse}
 stroke={T.accent} strokeWidth={2} />

 {/* Axes */}
 <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke={T.border} strokeWidth={1} />
 <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke={T.border} strokeWidth={1} />

 <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fill={T.muted}
 fontFamily="monospace">Composition (wt% Ni)</text>
 <text x={mL - 5} y={H - mB + 16} textAnchor="end" fontSize={11} fill={T.dim}
 fontFamily="monospace">0%</text>
 <text x={mL + pW + 2} y={H - mB + 16} fontSize={11} fill={T.dim}
 fontFamily="monospace">100%</text>

 <text x={14} y={H / 2} textAnchor="middle" fontSize={12} fill={T.muted}
 fontFamily="monospace" transform={`rotate(-90,14,${H / 2})`}>Temperature (°C)</text>
 {[Tmin, 1100, 1300, Tmax].map((tv, i) => (
 <text key={i} x={mL - 6} y={toSY(tv) + 3} textAnchor="end"
 fontSize={10} fill={T.dim} fontFamily="monospace">{tv}</text>
 ))}

 <text x={mL + 4} y={H - mB - 4} fontSize={12} fill={T.dim} fontFamily="monospace">Cu</text>
 <text x={mL + pW - 10} y={H - mB - 4} fontSize={12} fill={T.dim} fontFamily="monospace">Ni</text>
 </svg>

 {/* Synthesis Reaction Animation — below phase diagram */}
 <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: T.accent, marginBottom: 4 }}>Cu-Ni Alloy — Solidification Process</div>
 <svg viewBox="0 0 400 180" style={{ width: "100%", maxWidth: W, background: T.surface, borderRadius: 6, border: `1px solid ${T.border}` }}>
 {(() => {
 const t = frame * 0.04;
 const cycle = t % 12;
 const stage = cycle < 2 ? 0 : cycle < 4 ? 1 : cycle < 7 ? 2 : cycle < 9 ? 3 : 4;
 const stageProgress = stage === 0 ? cycle / 2 : stage === 1 ? (cycle - 2) / 2 : stage === 2 ? (cycle - 4) / 3 : stage === 3 ? (cycle - 7) / 2 : (cycle - 9) / 3;
 const flaskX = 150, flaskY = 40, flaskW = 80, flaskH = 85;
 const neckW = 24, neckH = 22;
 const znX = 15, teX = 80, bottleY = 25;
 const temp = stage === 0 ? 300 : stage === 1 ? 300 + stageProgress * 200 : stage === 2 ? 500 + stageProgress * 500 : stage === 3 ? 1000 - stageProgress * 700 : 300;
 const tempColor = temp > 800 ? T.eo_gap : temp > 500 ? T.eo_photon : T.eo_cond;
 const znAtoms = [], teAtoms = [];
 if (stage >= 1) {
 for (let i = 0; i < 4; i++) {
 const ax = flaskX + 15 + (i % 2) * 25 + Math.sin(t + i) * (stage >= 2 ? 6 : 2);
 const ay = stage >= 2 ? flaskY + 40 + Math.sin(t * 2 + i * 1.5) * 10 : flaskY + 15 + Math.min(1, stageProgress * 2 + i * 0.15) * 50;
 znAtoms.push({ x: ax, y: ay });
 }
 for (let i = 0; i < 4; i++) {
 const ax = flaskX + 25 + (i % 2) * 25 + Math.cos(t + i * 2) * (stage >= 2 ? 6 : 2);
 const ay = stage >= 2 ? flaskY + 45 + Math.cos(t * 2 + i * 1.3) * 10 : flaskY + 20 + Math.min(1, stageProgress * 2 + i * 0.12) * 45;
 teAtoms.push({ x: ax, y: ay });
 }
 }
 const productX = 300, productY = 50;
 return <g>
 {/* Step labels */}
 {["Precursors", "Mix", "Heat", "Cool", "Product"].map((s, i) => (
 <text key={i} x={20 + i * 78} y={12} textAnchor="middle" fontSize={12} fontFamily="monospace"
 fill={stage === i ? T.eo_e : T.dim} fontWeight={stage === i ? 700 : 400}>{s}</text>
 ))}
 {/* Zn bottle */}
 <rect x={znX} y={bottleY} width={30} height={40} rx={3} fill={T.eo_cond + "25"} stroke={T.eo_cond} strokeWidth={1} />
 <text x={znX + 15} y={bottleY + 25} textAnchor="middle" fontSize={13} fill={T.eo_cond} fontWeight={700} fontFamily="monospace">Zn</text>
 {/* Te bottle */}
 <rect x={teX} y={bottleY} width={30} height={40} rx={3} fill={T.eo_photon + "25"} stroke={T.eo_photon} strokeWidth={1} />
 <text x={teX + 15} y={bottleY + 25} textAnchor="middle" fontSize={13} fill={T.eo_photon} fontWeight={700} fontFamily="monospace">Te</text>
 {/* Arrows */}
 {stage >= 1 && <>
 <line x1={znX + 32} y1={bottleY + 18} x2={flaskX + 5} y2={flaskY + 8} stroke={T.eo_cond} strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />
 <line x1={teX + 32} y1={bottleY + 18} x2={flaskX + 10} y2={flaskY + 12} stroke={T.eo_photon} strokeWidth={1} strokeDasharray="3,2" opacity={0.5} />
 </>}
 {/* Flask */}
 <rect x={flaskX + (flaskW - neckW) / 2} y={flaskY - neckH} width={neckW} height={neckH} rx={2} fill="none" stroke={T.border} strokeWidth={1.5} />
 <path d={`M${flaskX + (flaskW - neckW) / 2},${flaskY} L${flaskX},${flaskY + 20} L${flaskX},${flaskY + flaskH} L${flaskX + flaskW},${flaskY + flaskH} L${flaskX + flaskW},${flaskY + 20} L${flaskX + (flaskW + neckW) / 2},${flaskY} Z`}
 fill={stage >= 2 ? (temp > 700 ? T.eo_gap + "12" : T.eo_photon + "08") : T.surface} stroke={T.border} strokeWidth={1.5} />
 {/* Flames */}
 {stage === 2 && [0, 1, 2].map(i => {
 const fx = flaskX + 20 + i * 18;
 const fh = 10 + Math.sin(t * 4 + i * 2) * 4;
 return <ellipse key={i} cx={fx} cy={flaskY + flaskH + 5} rx={6} ry={fh} fill={T.eo_gap} opacity={0.35 + Math.sin(t * 3 + i) * 0.15} />;
 })}
 {/* Atoms in flask */}
 {stage >= 1 && stage < 3 && znAtoms.map((a, i) => <circle key={`z${i}`} cx={a.x} cy={a.y} r={5} fill={T.eo_cond} opacity={0.8} />)}
 {stage >= 1 && stage < 3 && teAtoms.map((a, i) => <circle key={`t${i}`} cx={a.x} cy={a.y} r={5} fill={T.eo_photon} opacity={0.8} />)}
 {/* Bonding pairs */}
 {stage >= 2 && stageProgress > 0.5 && [...Array(3)].map((_, i) => {
 const px = flaskX + 15 + i * 22, py = flaskY + 42 + i * 10;
 const bond = Math.min(1, (stageProgress - 0.5) * 3);
 return <g key={`p${i}`}><circle cx={px} cy={py} r={4} fill={T.eo_cond} /><circle cx={px + 5 + (1 - bond) * 8} cy={py + 2} r={4} fill={T.eo_photon} />{bond > 0.5 && <line x1={px + 3} y1={py} x2={px + 6} y2={py + 1} stroke={T.ink} strokeWidth={1} />}</g>;
 })}
 {/* Product pairs cooling */}
 {stage >= 3 && [0, 1, 2].map(i => {
 const px = flaskX + 15 + i * 22, py = flaskY + 45 + (i % 2) * 14;
 return <g key={`pr${i}`}><circle cx={px} cy={py} r={4} fill={T.eo_cond} /><line x1={px + 3} y1={py} x2={px + 7} y2={py} stroke={T.ink} strokeWidth={1} /><circle cx={px + 10} cy={py} r={4} fill={T.eo_photon} /></g>;
 })}
 {/* Arrow to product */}
 {stage >= 4 && <line x1={flaskX + flaskW + 5} y1={flaskY + 45} x2={productX - 10} y2={productY + 15} stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />}
 {/* Product dish */}
 <ellipse cx={productX + 30} cy={productY + 35} rx={35} ry={10} fill="none" stroke={T.border} strokeWidth={1} />
 <path d={`M${productX - 5},${productY + 35} Q${productX + 30},${productY + 55} ${productX + 65},${productY + 35}`} fill="none" stroke={T.border} strokeWidth={1} />
 {stage >= 4 && <>
 <ellipse cx={productX + 30} cy={productY + 30} rx={22} ry={6} fill={T.eo_valence + "40"} />
 <text x={productX + 30} y={productY + 22} textAnchor="middle" fontSize={13} fill={T.eo_valence} fontWeight={700} fontFamily="monospace">ZnTe</text>
 </>}
 {/* Temp */}
 <rect x={275} y={120} width={70} height={20} rx={3} fill={tempColor + "15"} stroke={tempColor} strokeWidth={1} />
 <text x={310} y={134} textAnchor="middle" fontSize={12} fill={tempColor} fontWeight={700} fontFamily="monospace">{temp.toFixed(0)} K</text>
 {/* Equation */}
 <text x={200} y={170} textAnchor="middle" fontSize={13} fill={T.ink} fontFamily="monospace" fontWeight={700}>Zn + Te → ZnTe</text>
 </g>;
 })()}
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
 Cu-Ni is a classic isomorphous system: Cu and Ni are fully miscible in both liquid and solid (FCC) phases at all compositions. The liquidus and solidus curves define the two-phase region.
 </div>
 </div>

 <div style={{ background: T.surface, borderRadius: 6, padding: 10, marginBottom: 10, border: `1px solid ${T.border}` }}>
 <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: T.eo_e }}>The Story</div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
 Gibbs phase rule F = C - P + 2 tells how many variables you can change without changing the number of phases. For Cu-Ni (C=2), in the two-phase region (P=2), F=2: you can independently vary temperature and composition. At the melting point of pure Cu or Ni (P=2, C=1), F=0: the temperature is fixed.
 </div>
 </div>

 <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
 <div style={{ fontSize: 11, fontWeight: 700, color: T.eo_gap, marginBottom: 4 }}>
 Key Insight
 </div>
 <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
 Cu-Ni alloys are used in coins, marine hardware, and heat exchangers because the complete solid solution gives tunable strength and corrosion resistance across all compositions.
 </div>
 </div>

 <NCard title="Numerical Example: Lever Rule in Cu-Ni Phase Diagram" color={T.eo_e} formula={"f_L = (C₀ - C_S) / (C_L - C_S)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A Cu-Ni alloy with overall composition C₀ = 40 wt% Ni is held at 1300°C, where it sits in the two-phase (liquid + solid) region. The liquidus intersects at C_L = 50 wt% Ni and the solidus at C_S = 35 wt% Ni. What fraction is liquid and what fraction is solid?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The lever rule works like a seesaw. The overall composition is the fulcrum. The liquid and solid compositions are at opposite ends. The fraction of each phase is proportional to the distance from the fulcrum to the OTHER end -- just like balancing a seesaw where a heavier kid sits closer to the pivot.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Identify phase diagram data at T = 1300°C:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Overall composition (C₀)" value="40 wt% Ni" />
 <InfoRow label="Liquidus composition (C_L)" value="50 wt% Ni" />
 <InfoRow label="Solidus composition (C_S)" value="35 wt% Ni" />
 <InfoRow label="Tie-line length" value="C_L - C_S = 50 - 35 = 15 wt%" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Apply the lever rule:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="f_L = (C₀ - C_S) / (C_L - C_S) = (40 - 35) / (50 - 35)" result="" color={T.eo_e} />
 <CalcRow eq="f_L = 5 / 15" result="= 0.333 (33.3% liquid)" color={T.eo_e} />
 <CalcRow eq="f_S = 1 - f_L = 1 - 0.333" result="= 0.667 (66.7% solid)" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 1300°C, the alloy is 1/3 liquid (enriched in Ni at 50%) and 2/3 solid (depleted in Ni at 35%). As cooling continues, the liquidus and solidus compositions shift, and the solid fraction increases. This is the basis of solidification in all alloys -- the solid that forms first has a different composition than the liquid.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Eutectic Solidification in Pb-Sn Solder" color={T.eo_e} formula={"Eutectic: L → α + β at T_E"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A Pb-Sn solder with 50 wt% Sn is cooled from 250°C. The eutectic point is at 183°C and 61.9 wt% Sn. The maximum solubility of Sn in Pb (α phase) is 19.2 wt% at the eutectic temperature. What phases are present at 200°C and at 150°C?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Eutectic solidification is like a traffic split. Above 183°C, you have liquid + some solid (α). At exactly 183°C, the remaining liquid simultaneously crystallizes into a fine lamellar mixture of α + β -- this is the eutectic reaction. The eutectic composition (61.9% Sn) melts at the lowest temperature of any Pb-Sn mixture.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Analyze phases at 200°C (above eutectic):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Temperature" value="200°C (above T_E = 183°C)" />
 <InfoRow label="Phases present" value="Liquid + α (Pb-rich solid)" />
 <InfoRow label="Liquidus at 50% Sn" value="Liquid composition ≈ 58 wt% Sn" />
 <InfoRow label="Solidus at 200°C" value="α composition ≈ 18 wt% Sn" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Analyze phases at 150°C (below eutectic):</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="At 150°C: all liquid has solidified" result="" color={T.eo_e} />
 <CalcRow eq="Phases: α (Pb-rich, ~15 wt% Sn) + β (Sn-rich, ~98 wt% Sn)" result="" color={T.eo_e} />
 <CalcRow eq="f_α = (98 - 50)/(98 - 15) = 48/83" result="= 0.578 (57.8% α phase)" color={T.eo_e} />
 <CalcRow eq="f_β = (50 - 15)/(98 - 15) = 35/83" result="= 0.422 (42.2% β phase)" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 200°C the alloy is a mushy mix of liquid and α solid. At 183°C, the remaining liquid undergoes the eutectic reaction, solidifying into fine α+β lamellae. By 150°C, the microstructure contains primary α grains surrounded by eutectic α+β. The eutectic composition (61.9% Sn) is used in traditional solder because it has the lowest melting point (183°C) -- ideal for electronics assembly.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Gibbs Phase Rule -- Degrees of Freedom" color={T.eo_e} formula={"F = C − P + 2"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Apply the Gibbs phase rule to three scenarios in the Cu-Ni system: (a) single-phase liquid at 1500°C, (b) two-phase liquid+solid at 1300°C, and (c) the melting point of pure Ni. How many variables can you independently control in each case?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The phase rule is like counting "knobs" on a control panel. Each component (C) adds a composition knob. Each phase (P) imposes an equilibrium constraint that removes a knob. The +2 accounts for temperature and pressure knobs. At a eutectic point (C=2, P=3), F=1, meaning if you set pressure, temperature and compositions are all fixed -- a unique point on the phase diagram.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="System" value="Cu-Ni binary (C = 2 components)" />
 <InfoRow label="Assume" value="Constant pressure (isobaric, so use F = C − P + 1)" />
 <InfoRow label="Case (a)" value="Single phase liquid, P = 1" />
 <InfoRow label="Case (b)" value="Liquid + solid, P = 2" />
 <InfoRow label="Case (c)" value="Pure Ni melting: C = 1, P = 2 (liquid + solid)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="(a) F = 2 − 1 + 1 = 2" result="→ Can vary T and x independently" color={T.eo_e} />
 <CalcRow eq="(b) F = 2 − 2 + 1 = 1" result="→ Fix T, compositions are determined" color={T.eo_e} />
 <CalcRow eq="(c) F = 1 − 2 + 1 = 0" result="→ Invariant point: T = 1455°C (fixed)" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In the single-phase region, you have 2 degrees of freedom -- a 2D area on the phase diagram. In the two-phase region (F=1), choosing T fixes both liquid and solid compositions via the tie line -- a 1D line. For pure Ni melting (F=0), the melting point is a unique invariant point. The phase rule is the deepest constraint in thermodynamics: it tells you the dimensionality of every region on any phase diagram, no matter how complex.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Fe-C Steel Cooling -- Eutectoid Pearlite Formation" color={T.eo_e} formula={"γ → α + Fe₃C at 727°C, 0.76 wt% C"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A plain carbon steel with 0.40 wt% C is slowly cooled from 900°C. Using the Fe-C phase diagram, determine the phases and their fractions at 726°C (just below the eutectoid temperature). The eutectoid composition is 0.76% C, and the maximum solubility of C in ferrite (α) is 0.022% at 727°C.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The eutectoid reaction is the solid-state analog of a eutectic. Austenite (γ, FCC) transforms into a lamellar mixture of ferrite (α, BCC, soft) and cementite (Fe₃C, hard). A hypoeutectoid steel (less than 0.76% C) first precipitates proeutectoid ferrite at grain boundaries as it cools through the two-phase region, then the remaining austenite transforms to pearlite at 727°C.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Overall composition" value="C₀ = 0.40 wt% C" />
 <InfoRow label="Eutectoid composition" value="C_eut = 0.76 wt% C" />
 <InfoRow label="Max C in α" value="C_α = 0.022 wt% C at 727°C" />
 <InfoRow label="C in Fe₃C" value="C_cem = 6.67 wt% C" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Fraction proeutectoid α = (C_eut − C₀)/(C_eut − C_α)" result="" color={T.eo_e} />
 <CalcRow eq="= (0.76 − 0.40)/(0.76 − 0.022) = 0.36/0.738" result="f_proα = 0.488 (48.8%)" color={T.eo_e} />
 <CalcRow eq="Fraction pearlite = 1 − 0.488" result="f_pearlite = 0.512 (51.2%)" color={T.eo_e} />
 <CalcRow eq="Total α (in pearlite + proeutectoid): lever in α+Fe₃C" result="" color={T.eo_e} />
 <CalcRow eq="f_α(total) = (6.67 − 0.40)/(6.67 − 0.022)" result="= 94.3% ferrite" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 0.40% C steel is about half proeutectoid ferrite (soft, ductile) and half pearlite (hard, strong lamellar α+Fe₃C). This gives a good balance of strength and ductility, which is why medium-carbon steels (0.3-0.5% C) are used for axles, gears, and rails. Rapid cooling (quenching) bypasses the eutectoid and forms martensite instead -- much harder but brittle. The entire art of heat-treating steel is controlling these transformations.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Binary Solidus Temperature from Thermodynamics" color={T.eo_e} formula={"T_solidus from ΔG_mix(solid) = ΔG_mix(liquid)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> For the ideal Cu-Ni system, estimate the solidus temperature at x_Ni = 0.4 using the melting points T_Cu = 1358 K, T_Ni = 1728 K, and the approximation that ΔS_fus ≈ R (Richards' rule) for both elements.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The solidus and liquidus curves arise from the competition between liquid and solid free energies. Richards' rule says ΔS_fus ≈ R for most metals (about 8.3 J/(mol·K)), which gives ΔH_fus ≈ RT_m. The solidus temperature can be estimated by finding where the solid free energy curve first touches the liquid free energy curve as you cool an alloy.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="T_m(Cu)" value="1358 K" />
 <InfoRow label="T_m(Ni)" value="1728 K" />
 <InfoRow label="ΔS_fus" value="≈ R = 8.314 J/(mol·K) for both" />
 <InfoRow label="Composition" value="x_Ni = 0.4, x_Cu = 0.6" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Ideal solidus: 1/T_sol = x_Cu/T_m(Cu) + x_Ni/T_m(Ni)" result="" color={T.eo_e} />
 <CalcRow eq="= 0.6/1358 + 0.4/1728" result="" color={T.eo_e} />
 <CalcRow eq="= 4.418×10⁻⁴ + 2.315×10⁻⁴ = 6.733×10⁻⁴ K⁻¹" result="" color={T.eo_e} />
 <CalcRow eq="T_sol = 1/6.733×10⁻⁴" result="T_sol ≈ 1485 K (1212°C)" color={T.eo_e} />
 <CalcRow eq="Experimental solidus at x_Ni=0.4:" result="≈ 1480 K -- excellent agreement" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The ideal solution model predicts T_sol ≈ 1485 K for Cu-60Ni-40, very close to the experimental ~1480 K. This works well for Cu-Ni because the two metals have similar atomic radii (128 vs 125 pm) and form a complete solid solution (isomorphous system). The harmonic-mean formula gives a solidus that curves below the straight line connecting the two melting points -- the "lens-shaped" two-phase region characteristic of ideal isomorphous systems.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Cu-Sn Peritectic -- Bronze Formation" color={T.eo_e} formula={"Peritectic: L + α → β at T_p"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In the Cu-Sn system, a peritectic reaction occurs at 798°C: liquid (13.5 wt% Sn) + α (15.8 wt% Sn) → β (22.0 wt% Sn). An alloy with 20 wt% Sn (tin bronze) is cooled slowly through 798°C. What happens?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A peritectic is the opposite of a eutectic. In a eutectic, one phase (liquid) splits into two solids. In a peritectic, two phases (liquid + solid α) combine to form a new solid (β). It is like mixing two ingredients to bake a cake -- both reactants are consumed to make something new. The peritectic reaction is notoriously slow because it requires diffusion through the newly formed β shell surrounding the α grains.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Overall composition" value="C₀ = 20 wt% Sn" />
 <InfoRow label="Liquid at peritectic" value="C_L = 13.5 wt% Sn" />
 <InfoRow label="α at peritectic" value="C_α = 15.8 wt% Sn" />
 <InfoRow label="β phase" value="C_β = 22.0 wt% Sn" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Just above 798°C: phases are L + α" result="" color={T.eo_e} />
 <CalcRow eq="f_α = (C₀ − C_L)/(C_α − C_L) = (20 − 13.5)/(15.8 − 13.5)" result="" color={T.eo_e} />
 <CalcRow eq="= 6.5/2.3" result="f_α = 2.83 → C₀ is outside L+α field!" color={T.eo_e} />
 <CalcRow eq="Actually at 798°C+: all α (since 20% > 15.8%, we are in α field)" result="f_α = 100%" color={T.eo_e} />
 <CalcRow eq="At 798°C: peritectic → α transforms to β" result="L + α → β" color={T.eo_e} />
 <CalcRow eq="Just below 798°C: α + β (since 15.8 < 20 < 22)" result="f_β = (20−15.8)/(22−15.8) = 67.7%" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At the peritectic, α grains react with surrounding liquid to form β. With 20 wt% Sn, the alloy ends up as 68% β + 32% α just below 798°C. In practice, β forms a shell around α cores, blocking further reaction (coring). This makes Cu-Sn bronzes heterogeneous unless annealed for long times. Ancient bronze-smiths unknowingly dealt with peritectic kinetics -- their prolonged annealing at ~700°C homogenized the microstructure, producing the strong, corrosion-resistant bronze that defined an era.</div>
 </div>
 </NCard>

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

 const W = 400, H = 340;
 const mL = 55, mR = 25, mT = 25, mB = 50;
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
 Chemical potential tells you how much the energy changes when you add one more atom. Think of pouring water into connected cups {"—"} water flows until all cups reach the same level. Similarly, atoms move between phases until the chemical potential is equal everywhere. This decides which crystal structures are stable.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
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
 fontSize={13} fill={T.eo_core} fontFamily="monospace">
 mu_A + mu_B = dH_f
 </text>

 {stablePoly.map((p, i) => {
 const next = stablePoly[(i + 1) % stablePoly.length];
 return (
 <line key={i} x1={toSX(p.a)} y1={toSY(p.b)} x2={toSX(next.a)} y2={toSY(next.b)}
 stroke={T.eo_valence} strokeWidth={2} />
 );
 })}

 <text x={toSX(-0.3)} y={toSY(-0.3) + 15} fontSize={13} fill={T.eo_cond}
 fontFamily="monospace">A-rich</text>
 <text x={toSX(dHf + 0.3)} y={toSY(dHf + 0.3) - 20} fontSize={13} fill={T.eo_gap}
 fontFamily="monospace">B-rich</text>
 <text x={toSX(dHf / 2) - 15} y={toSY(dHf / 2) + 15} fontSize={13}
 fill={T.eo_valence} fontFamily="monospace" fontWeight={700}>Stable</text>

 <circle cx={ptX} cy={ptY} r={7} fill={regionColor} opacity={pulse}
 stroke={regionColor} strokeWidth={2} />
 <circle cx={ptX} cy={ptY} r={3} fill="#fff" />

 <line x1={mL} y1={mT} x2={mL} y2={H - mB} stroke={T.border} strokeWidth={1} />
 <line x1={mL} y1={H - mB} x2={W - mR} y2={H - mB} stroke={T.border} strokeWidth={1} />

 <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fill={T.muted}
 fontFamily="monospace">mu_A (eV)</text>
 <text x={14} y={H / 2} textAnchor="middle" fontSize={13} fill={T.muted}
 fontFamily="monospace" transform={`rotate(-90,14,${H / 2})`}>mu_B (eV)</text>

 {[-3, -2, -1, 0].map((v, i) => (
 <g key={i}>
 <text x={toSX(v)} y={H - mB + 18} textAnchor="middle"
 fontSize={13} fill={T.dim} fontFamily="monospace">{v}</text>
 <text x={mL - 8} y={toSY(v) + 4} textAnchor="end"
 fontSize={13} fill={T.dim} fontFamily="monospace">{v}</text>
 </g>
 ))}
 </svg>

 {/* MBE Growth Animation — below stability polygon */}
 <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: T.accent, marginBottom: 4, textAlign: "center" }}>MBE Thin Film Growth</div>
 <div style={{ display: "flex", justifyContent: "center" }}>
 <svg viewBox="0 0 400 170" style={{ width: "100%", maxWidth: 374, background: T.surface, borderRadius: 6, border: `1px solid ${T.border}` }}>
 {(() => {
 const t = frame * 0.05;
 const chX = 20, chY = 15, chW = 170, chH = 110;
 const subY = chY + chH - 18;
 const srcAx = chX + 20, srcBx = chX + chW - 60;
 const srcY = chY + chH - 38;
 const isARich = muA > -0.8 || muB < -2.0;
 const isBRich = muB > -0.8 || muA < -2.0;
 const isBalanced = !isARich && !isBRich;
 const aFrac = (muA - muMin) / (muMax - muMin);
 const bFrac = (muB - muMin) / (muMax - muMin);
 const nA = Math.round(2 + aFrac * 5);
 const nB = Math.round(2 + bFrac * 5);
 return <g>
 {/* Chamber */}
 <rect x={chX} y={chY} width={chW} height={chH} rx={5} fill={T.ink + "06"} stroke={T.border} strokeWidth={1.5} />
 <text x={chX + chW / 2} y={chY - 3} textAnchor="middle" fontSize={12} fill={T.muted} fontFamily="monospace">MBE Chamber</text>
 {/* Source A */}
 <path d={`M${srcAx},${srcY + 16} L${srcAx},${srcY} L${srcAx + 30},${srcY} L${srcAx + 30},${srcY + 16}`} fill={T.eo_cond + "25"} stroke={T.eo_cond} strokeWidth={1} />
 <text x={srcAx + 15} y={srcY + 11} textAnchor="middle" fontSize={12} fill={T.eo_cond} fontWeight={700} fontFamily="monospace">Cu</text>
 <ellipse cx={srcAx + 15} cy={srcY + 18} rx={13} ry={3} fill={T.eo_gap} opacity={0.1 + aFrac * 0.35} />
 {/* Source B */}
 <path d={`M${srcBx},${srcY + 16} L${srcBx},${srcY} L${srcBx + 30},${srcY} L${srcBx + 30},${srcY + 16}`} fill={T.eo_photon + "25"} stroke={T.eo_photon} strokeWidth={1} />
 <text x={srcBx + 15} y={srcY + 11} textAnchor="middle" fontSize={12} fill={T.eo_photon} fontWeight={700} fontFamily="monospace">Zn</text>
 <ellipse cx={srcBx + 15} cy={srcY + 18} rx={13} ry={3} fill={T.eo_gap} opacity={0.1 + bFrac * 0.35} />
 {/* Substrate */}
 <rect x={chX + 30} y={subY} width={chW - 60} height={6} rx={2} fill={T.eo_core} />
 <text x={chX + chW / 2} y={subY + 16} textAnchor="middle" fontSize={12} fill={T.eo_core} fontFamily="monospace">Substrate</text>
 {/* Film */}
 <rect x={chX + 32} y={subY - 4} width={chW - 64} height={4} rx={1} fill={isBalanced ? T.eo_valence : isARich ? T.eo_cond + "80" : T.eo_photon + "80"} />
 {/* A atoms */}
 {[...Array(nA)].map((_, i) => {
 const p = ((t * 0.8 + i * 1.2) % 4) / 4;
 const ax = srcAx + 10 + Math.sin(i * 2.3) * 8 + (chX + 50 + (i % 3) * 18 - srcAx - 10) * p;
 const ay = srcY - 3 - p * (srcY - subY - 10);
 return <circle key={`a${i}`} cx={ax} cy={ay} r={3.5} fill={T.eo_cond} opacity={0.7 - p * 0.3} />;
 })}
 {/* B atoms */}
 {[...Array(nB)].map((_, i) => {
 const p = ((t * 0.7 + i * 1.4 + 0.5) % 4) / 4;
 const bx = srcBx + 10 + Math.sin(i * 1.7) * 8 + (chX + 55 + (i % 3) * 16 - srcBx - 10) * p;
 const by = srcY - 3 - p * (srcY - subY - 10);
 return <circle key={`b${i}`} cx={bx} cy={by} r={3.5} fill={T.eo_photon} opacity={0.7 - p * 0.3} />;
 })}
 {/* Right info panel */}
 <text x={220} y={28} fontSize={12} fill={T.ink} fontWeight={700} fontFamily="monospace">Growth Conditions</text>
 <text x={220} y={48} fontSize={12} fill={T.eo_cond} fontFamily="monospace">Cu flux:</text>
 <rect x={280} y={38} width={Math.max(4, aFrac * 100)} height={12} rx={2} fill={T.eo_cond} opacity={0.7} />
 <text x={220} y={68} fontSize={12} fill={T.eo_photon} fontFamily="monospace">Zn flux:</text>
 <rect x={280} y={58} width={Math.max(4, bFrac * 100)} height={12} rx={2} fill={T.eo_photon} opacity={0.7} />
 <text x={220} y={90} fontSize={12} fill={T.muted} fontFamily="monospace">T_sub: 600 K</text>
 <rect x={215} y={100} width={170} height={22} rx={5}
 fill={isBalanced ? T.eo_valence + "18" : isARich ? T.eo_cond + "18" : T.eo_photon + "18"}
 stroke={isBalanced ? T.eo_valence : isARich ? T.eo_cond : T.eo_photon} strokeWidth={1} />
 <text x={300} y={115} textAnchor="middle" fontSize={12}
 fill={isBalanced ? T.eo_valence : isARich ? T.eo_cond : T.eo_photon}
 fontWeight={700} fontFamily="monospace">
 {isARich ? "Cu-rich → V_Zn" : isBRich ? "Zn-rich → V_Cu (p)" : "Balanced → CuZn"}
 </text>
 <text x={300} y={135} textAnchor="middle" fontSize={12} fill={T.muted} fontFamily="monospace">
 {isBalanced ? "Best quality!" : isARich ? "Secondary phases" : "p-type doping"}
 </text>
 {/* Legend */}
 <circle cx={220} cy={155} r={3} fill={T.eo_cond} />
 <text x={228} y={158} fontSize={12} fill={T.muted} fontFamily="monospace">Cu</text>
 <circle cx={260} cy={155} r={3} fill={T.eo_photon} />
 <text x={268} y={158} fontSize={12} fill={T.muted} fontFamily="monospace">Zn</text>
 </g>;
 })()}
 </svg>
 </div>
 </div>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
 <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
 <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: T.accent }}>
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

 <NCard title="Numerical Example: Chemical Potential of Zn and Te in ZnTe Growth" color={T.eo_e} formula={"μ_Zn + μ_Te = μ_ZnTe = ΔH_f(ZnTe)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> You are growing ZnTe thin films by MBE. The chemical potentials of Zn and Te must be controlled to avoid forming competing phases (pure Zn metal or pure Te). What is the allowed range of chemical potentials?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Chemical potential is like the "willingness" of an atom to leave its source. Too much Zn pressure (Zn-rich) and you get Zn droplets. Too much Te (Te-rich) and Te precipitates form. The stability window is the narrow "Goldilocks zone" where only ZnTe is thermodynamically favored.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Define the thermodynamic constraint:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Formation enthalpy of ZnTe" value="ΔH_f = -1.23 eV/formula unit" />
 <InfoRow label="Equilibrium condition" value="μ_Zn + μ_Te = ΔH_f(ZnTe) = -1.23 eV" />
 <InfoRow label="Zn-rich limit" value="μ_Zn = 0 (bulk Zn reference)" />
 <InfoRow label="Te-rich limit" value="μ_Te = 0 (bulk Te reference)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate allowed ranges:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="Zn-rich: μ_Zn = 0 → μ_Te = -1.23 - 0 = -1.23 eV" result="" color={T.eo_e} />
 <CalcRow eq="Te-rich: μ_Te = 0 → μ_Zn = -1.23 - 0 = -1.23 eV" result="" color={T.eo_e} />
 <CalcRow eq="Allowed range: -1.23 eV ≤ μ_Zn ≤ 0 eV" result="Window = 1.23 eV" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The allowed chemical potential window is only 1.23 eV wide. Under Zn-rich conditions (μ_Zn near 0), Te is starved (μ_Te = -1.23 eV), favoring Te vacancies (V_Te) which act as n-type donors. Under Te-rich conditions, Zn vacancies (V_Zn) dominate, giving p-type behavior. This is why MBE flux ratios directly control doping in ZnTe.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example: Equilibrium Vacancy Concentration" color={T.eo_e} formula={"n_v/N = exp(-E_v / k_BT)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Copper has a vacancy formation energy E_v = 1.0 eV. How many vacancies exist per atom at room temperature (300K) versus at 1000K near the melting point?
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A vacancy is a missing atom in the crystal lattice -- like an empty seat in a stadium. At low temperature, the energy cost is too high and almost no seats are empty. But as temperature rises, entropy favors disorder, and exponentially more vacancies appear. The Boltzmann factor exp(-E_v/kT) controls this exponential.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Gather constants:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Vacancy formation energy (Cu)" value="E_v = 1.0 eV" />
 <InfoRow label="Boltzmann constant" value="k_B = 8.617 × 10⁻⁵ eV/K" />
 <InfoRow label="kT at 300K" value="0.02585 eV" />
 <InfoRow label="kT at 1000K" value="0.08617 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate vacancy fraction:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="At 300K: n_v/N = exp(-1.0 / 0.02585) = exp(-38.7)" result="≈ 1.6 × 10⁻¹⁷" color={T.eo_e} />
 <CalcRow eq="At 1000K: n_v/N = exp(-1.0 / 0.08617) = exp(-11.6)" result="≈ 9.1 × 10⁻⁶" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At room temperature, only about 1 in 10^17 sites is vacant -- essentially zero. At 1000K, about 1 in 100,000 sites is empty. This 12-orders-of-magnitude increase shows the dramatic effect of temperature on defect concentration. High-temperature annealing equilibrates defects, and quenching "freezes in" the high-temperature vacancy population.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 3: Cd Vacancy Formation Energy from DFT" color={T.eo_e} formula={"E_f(V_Cd) = E(defect) − E(perfect) + μ_Cd"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> A DFT supercell calculation for CdTe gives: E(perfect 64-atom cell) = -372.68 eV, E(cell with V_Cd) = -367.21 eV. Under Te-rich conditions, μ_Cd = -1.23 eV (referenced to bulk Cd). Calculate the Cd vacancy formation energy and the equilibrium concentration at 600°C.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>To form a Cd vacancy, you remove a Cd atom and place it in a "reservoir" at chemical potential μ_Cd. The energy cost is the total energy difference, offset by the energy gained by putting the atom in the reservoir. Under Te-rich conditions, μ_Cd is low (Cd is scarce), making vacancies cheaper to form. This is why Te-rich growth produces more Cd vacancies and stronger p-type doping.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="E(perfect 64-atom cell)" value="−372.68 eV" />
 <InfoRow label="E(63-atom cell with V_Cd)" value="−367.21 eV" />
 <InfoRow label="μ_Cd (Te-rich)" value="−1.23 eV (relative to bulk Cd)" />
 <InfoRow label="E(bulk Cd) per atom" value="−0.906 eV/atom (from DFT)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="E_f = E(V_Cd cell) − E(perfect) + (E_Cd_bulk + μ_Cd)" result="" color={T.eo_e} />
 <CalcRow eq="= (−367.21) − (−372.68) + (−0.906 + (−1.23))" result="" color={T.eo_e} />
 <CalcRow eq="= 5.47 + (−2.136) = 5.47 − 2.14" result="E_f(V_Cd) = 3.33 eV (Te-rich, neutral)" color={T.eo_e} />
 <CalcRow eq="With charge q=−2: E_f reduces by ~2×(E_F − E_VBM)" result="E_f(V_Cd²⁻) ≈ 1.5 eV at midgap" color={T.eo_e} />
 <CalcRow eq="[V_Cd] at 873K = N exp(−1.5/0.0752)" result="≈ 3.2 × 10¹³ cm⁻³" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The neutral V_Cd has E_f = 3.33 eV -- too high for significant concentrations. But in p-type CdTe, V_Cd accepts two electrons (charge −2), lowering E_f to ~1.5 eV. This gives ~3 × 10¹³ cm⁻³ vacancies at growth temperature -- enough for measurable p-type conductivity. The strong dependence on chemical potential means that switching from Te-rich to Cd-rich conditions increases E_f by 1.23 eV, reducing [V_Cd] by 10⁷×. This is why growth stoichiometry is the primary knob for controlling doping.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 4: Te₂ Partial Pressure over CdTe" color={T.eo_e} formula={"P(Te₂) = P₀ exp(−ΔH_sub/(RT))"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> During CdTe sublimation, the dominant Te-containing species is Te₂ (diatomic tellurium). The sublimation enthalpy for CdTe → Cd(g) + ½Te₂(g) gives ΔH ≈ 170 kJ/mol for the Te₂ component. If P(Te₂) = 0.5 Pa at 900 K, calculate P(Te₂) at 1000 K and determine the Cd/Te flux ratio.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>CdTe does not evaporate as CdTe molecules. It dissociates into atomic Cd and molecular Te₂. The ratio of Cd to Te₂ pressures determines whether the growth surface is Cd-rich or Te-rich. Because Cd is more volatile than Te₂, Cd pressure rises faster with temperature, and at very high T, excess Cd escapes, leaving the film Te-rich. This is why high-temperature CdTe growth tends toward intrinsic p-type.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="ΔH(Te₂ component)" value="170 kJ/mol" />
 <InfoRow label="P(Te₂) at 900 K" value="0.5 Pa" />
 <InfoRow label="Target temperature" value="T₂ = 1000 K" />
 <InfoRow label="R" value="8.314 J/(mol·K)" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="ln(P₂/P₁) = −ΔH/R × (1/T₂ − 1/T₁)" result="" color={T.eo_e} />
 <CalcRow eq="= −170000/8.314 × (1/1000 − 1/900)" result="" color={T.eo_e} />
 <CalcRow eq="= −20446 × (−1.111 × 10⁻⁴)" result="= 2.272" color={T.eo_e} />
 <CalcRow eq="P₂ = 0.5 × exp(2.272) = 0.5 × 9.70" result="P(Te₂) at 1000K = 4.85 Pa" color={T.eo_e} />
 <CalcRow eq="CdTe stoichiometry: P(Cd) ≈ 2×P(Te₂)" result="Cd/Te₂ flux ratio ≈ 2:1" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Te₂ pressure increases ~10× from 900 K to 1000 K. For stoichiometric sublimation, P(Cd) = 2P(Te₂) because each CdTe unit produces one Cd atom but only half a Te₂ molecule. If the substrate is cooler than the source, excess Cd re-evaporates preferentially (lower sticking coefficient), making the film slightly Te-rich. Precise control of source temperature (±2°C) is critical for reproducible CdTe solar cell fabrication.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 5: Schottky vs Frenkel Defects in CdTe" color={T.eo_e} formula={"Schottky: V_Cd + V_Te; Frenkel: V_Cd + Cd_i"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> In CdTe, the Schottky pair (V_Cd + V_Te) has combined formation energy E_S = 3.0 eV, while the Cd Frenkel pair (V_Cd + Cd_i) has E_F = 4.5 eV. Which defect type dominates at 600°C? Calculate the concentration ratio.
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Schottky defects are like removing a brick from a wall -- an atom leaves its site and goes to the surface, creating a vacancy. Frenkel defects are like displacing a brick to squeeze between other bricks -- the atom goes to an interstitial site. In CdTe, Schottky pairs are cheaper because the large Te atoms make interstitial sites energetically expensive. The exponential Boltzmann factor amplifies even small energy differences into huge concentration ratios.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="Schottky pair energy" value="E_S = 3.0 eV" />
 <InfoRow label="Frenkel pair energy" value="E_F = 4.5 eV" />
 <InfoRow label="Temperature" value="T = 873 K" />
 <InfoRow label="kT" value="0.0752 eV" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="[Schottky] ∝ exp(−E_S/(2kT)) = exp(−3.0/(2×0.0752))" result="" color={T.eo_e} />
 <CalcRow eq="= exp(−19.95)" result="= 2.17 × 10⁻⁹" color={T.eo_e} />
 <CalcRow eq="[Frenkel] ∝ exp(−E_F/(2kT)) = exp(−4.5/(2×0.0752))" result="" color={T.eo_e} />
 <CalcRow eq="= exp(−29.92)" result="= 1.11 × 10⁻¹³" color={T.eo_e} />
 <CalcRow eq="Ratio: [Schottky]/[Frenkel] = 2.17×10⁻⁹ / 1.11×10⁻¹³" result="≈ 19,500×" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Schottky defects outnumber Frenkel defects by nearly 20,000× at 600°C. The 1.5 eV energy difference translates to an enormous concentration ratio because of the exponential dependence. This means CdTe is dominated by vacancy pairs, not interstitials. The V_Cd acts as a double acceptor (p-type) and V_Te as a double donor (n-type). Under Te-rich conditions, V_Cd dominates and CdTe is p-type; under Cd-rich conditions, V_Te dominates and CdTe tends n-type.</div>
 </div>
 </NCard>

 <NCard title="Numerical Example 6: Cu Doping of CdTe -- Substitutional vs Interstitial" color={T.eo_e} formula={"Cu_Cd (acceptor) vs Cu_i (donor)"}>
 <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
 <strong>The Experiment:</strong> Copper doping of CdTe creates two competing defects: Cu_Cd (Cu on Cd site, acceptor, E_f = 0.8 eV under Te-rich) and Cu_i (interstitial Cu, donor, E_f = 1.2 eV). Calculate the concentrations at 200°C (back-contact annealing temperature) for a Cu chemical potential μ_Cu = 0 (Cu-rich).
 </div>
 <div style={{ background: T.eo_e + "06", border: `1px solid ${T.eo_e}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
 <div style={{ fontSize: 10, fontWeight: 700, color: T.eo_e, marginBottom: 6 }}>Think of it this way:</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Cu is the essential back-contact dopant in CdTe solar cells -- it must substitute on Cd sites (acceptor, p-type) to improve the contact. But Cu is a fast interstitial diffuser, and interstitial Cu is a donor (compensates the desired p-type doping). The competition between Cu_Cd and Cu_i determines whether Cu helps or hurts the device. Too much Cu → interstitials dominate → device degradation over time.</div>
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 -- Given:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
 <InfoRow label="E_f(Cu_Cd) Te-rich" value="0.8 eV (acceptor)" />
 <InfoRow label="E_f(Cu_i) Te-rich" value="1.2 eV (donor)" />
 <InfoRow label="Temperature" value="200°C = 473 K" />
 <InfoRow label="kT" value="0.0408 eV" />
 <InfoRow label="Cd site density" value="N_Cd = 1.48 × 10²² cm⁻³" />
 </div>
 <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 -- Calculate:</strong></div>
 <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
 <CalcRow eq="[Cu_Cd] = N exp(−0.8/0.0408) = 1.48×10²² × exp(−19.61)" result="" color={T.eo_e} />
 <CalcRow eq="= 1.48×10²² × 3.01×10⁻⁹" result="[Cu_Cd] = 4.45 × 10¹³ cm⁻³" color={T.eo_e} />
 <CalcRow eq="[Cu_i] = N exp(−1.2/0.0408) = 1.48×10²² × exp(−29.41)" result="" color={T.eo_e} />
 <CalcRow eq="= 1.48×10²² × 1.67×10⁻¹³" result="[Cu_i] = 2.47 × 10⁹ cm⁻³" color={T.eo_e} />
 <CalcRow eq="Ratio: [Cu_Cd]/[Cu_i] = 4.45×10¹³ / 2.47×10⁹" result="≈ 18,000× more substitutional" color={T.eo_e} />
 </div>
 <div style={{ background: T.eo_e + "08", border: `1px solid ${T.eo_e}22`, borderRadius: 8, padding: "10px 12px" }}>
 <div style={{ fontSize: 9, letterSpacing: 2, color: T.eo_e, fontWeight: 700, marginBottom: 4 }}>Interpretation</div>
 <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 200°C, substitutional Cu_Cd outnumbers interstitial Cu_i by 18,000×, meaning Cu predominantly acts as an acceptor -- good for the back contact. However, Cu_i is a fast diffuser (D ~ 10⁻⁸ cm²/s at 200°C). Over years of solar panel operation, interstitial Cu migrates toward the junction, gradually compensating p-type doping and reducing efficiency. This Cu instability is the primary long-term degradation mechanism in CdTe solar cells, motivating research into Cu-free back contacts.</div>
 </div>
 </NCard>

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
 const [charge, setCharge] = useState(0); // -2,-1,0,+1,+2
 const [frame, setFrame] = useState(0);
 useEffect(() => {
 const id = setInterval(() => setFrame(f => f + 1), 50);
 return () => clearInterval(id);
 }, []);

 const chargeStates = [
 {
 q: -2, label: "q = −2",
 nelect: "default + 2",
 filling: [2, 2, 2, 2], // up to 4 defect levels, 0=empty,1=half,2=full
 color: T.eo_e,
 desc: "Two extra electrons added. All dangling bond states fully filled. Te atoms pull inward.",
 te_dist: "2.74 Å (inward)",
 },
 {
 q: -1, label: "q = −1",
 nelect: "default + 1",
 filling: [2, 2, 2, 1],
 color: "#7c3aed",
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
 Crystal defects are like mistakes in a perfect pattern. A vacancy is a missing piece. An extra piece squeezed in is called an interstitial. A wrong piece in the right spot is a substitution. These small mistakes change how the material behaves, often in big ways {"—"} they can make it conduct better or worse.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 {/* Diagram */}
 <div style={{ flexShrink: 0 }}>
 <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", maxWidth: 352 }}>
 <rect width={320} height={320} fill={T.bg} rx={10} />

 {/* Valence band */}
 <rect x={20} y={VBtop} width={220} height={50} rx={4}
 fill={T.eo_valence + "22"} stroke={T.eo_valence} strokeWidth={1.5} />
 <text x={30} y={VBtop + 22} fill={T.eo_valence} fontSize={12} fontWeight="bold">Valence Band</text>
 <text x={30} y={VBtop + 38} fill={T.muted} fontSize={12}>fully occupied (from Zn+Te atoms)</text>

 {/* Conduction band */}
 <rect x={20} y={40} width={220} height={35} rx={4}
 fill={T.eo_cond + "11"} stroke={T.eo_cond} strokeWidth={1.5} />
 <text x={30} y={60} fill={T.eo_cond} fontSize={12} fontWeight="bold">Conduction Band</text>

 {/* Gap label */}
 <text x={250} y={170} fill={T.eo_gap} fontSize={12} fontWeight="bold">GAP</text>
 <text x={250} y={184} fill={T.muted} fontSize={13}>2.26 eV</text>

 {/* Defect levels */}
 {defY.map((y, i) => {
 const fill = cs.filling[i]; // 0=empty, 1=half, 2=full
 return (
 <g key={i}>
 <line x1={50} y1={y} x2={220} y2={y}
 stroke={cs.color} strokeWidth={2} opacity={0.6} />
 <text x={30} y={y + 4} textAnchor="middle" fill={T.muted} fontSize={13}>
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
 <text x={140} y={281} textAnchor="middle" fill={cs.color} fontSize={13} fontWeight="bold">
 V_Zn vacancy
 </text>
 <text x={140} y={297} textAnchor="middle" fill={T.muted} fontSize={12}>
 Te-vacancy: {cs.te_dist}
 </text>

 {/* NELECT label */}
 <text x={160} y={20} textAnchor="middle" fill={T.muted} fontSize={12}>
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
 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
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
 Creating a defect costs energy (formation energy). But defects also add disorder, which nature likes. At any temperature, there is a balance between the cost and the benefit of disorder. Higher temperature means more defects form naturally. The Fermi level controls the charge state of each defect.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 <text x={margin.l - 5} y={toY(i) + 4} textAnchor="end" fontSize={12} fill={T.muted}>{i}</text>
 </g>
 ))}

 {[0, 0.5, 1.0, 1.5, 2.0].map(v => (
 <g key={v}>
 <line x1={toX(v)} y1={margin.t} x2={toX(v)} y2={margin.t + plotH} stroke={T.dim} strokeWidth={0.5} />
 <text x={toX(v)} y={margin.t + plotH + 14} textAnchor="middle" fontSize={12} fill={T.muted}>{v.toFixed(1)}</text>
 </g>
 ))}

 <line x1={toX(0)} y1={margin.t} x2={toX(0)} y2={margin.t + plotH} stroke={T.eo_valence} strokeWidth={2} strokeDasharray="6,3" />
 <text x={toX(0) + 3} y={margin.t + 12} fontSize={13} fill={T.eo_valence}>VBM</text>
 <line x1={toX(bandGap)} y1={margin.t} x2={toX(bandGap)} y2={margin.t + plotH} stroke={T.eo_cond} strokeWidth={2} strokeDasharray="6,3" />
 <text x={toX(bandGap) - 3} y={margin.t + 12} textAnchor="end" fontSize={13} fill={T.eo_cond}>CBM</text>

 {charges.map((c, i) => {
 const x1 = toX(0), y1 = toY(formE(c, 0));
 const x2 = toX(bandGap), y2 = toY(formE(c, bandGap));
 return (
 <g key={i}>
 <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
 <text x={x2 + 3} y={y2 + 4} fontSize={13} fill={c.color}>{c.label}</text>
 </g>
 );
 })}

 <path d={envelopePath} fill="none" stroke={T.ink} strokeWidth={2.5} />

 {ctls.map((ctl, i) => (
 <g key={i}>
 <circle cx={toX(ctl.ef)} cy={toY(ctl.e)} r={5} fill={T.eo_gap} opacity={0.8 + pulse * 0.2} />
 <text x={toX(ctl.ef)} y={toY(ctl.e) - 8} textAnchor="middle" fontSize={13} fill={T.eo_gap}>
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
 <text x={toX(fermiLevel)} y={margin.t - 5} textAnchor="middle" fontSize={13} fill={T.eo_e}>
 E_F={fermiLevel.toFixed(2)} eV
 </text>

 <text x={margin.l + plotW / 2} y={margin.t + plotH + 35} textAnchor="middle" fontSize={13} fill={T.ink}>
 Fermi Level (eV)
 </text>
 <text x={15} y={margin.t + plotH / 2} textAnchor="middle" fontSize={13} fill={T.ink}
 transform={`rotate(-90,15,${margin.t + plotH / 2})`}>
 Formation Energy (eV)
 </text>

 <text x={margin.l + plotW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
 V_Zn Defect in ZnTe
 </text>
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
 Phonons are vibrations that travel through a crystal, like a wave passing through a line of people. Each atom shakes a little and passes the motion to the next. Low-frequency vibrations (acoustic) are like a gentle sway. High-frequency vibrations (optical) are like neighbors moving in opposite directions. Phonons carry heat through the material.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 <text x={at.x} y={at.y + at.r + 14} textAnchor="middle" fontSize={13} fill={T.muted}>
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

 <text x={svgW / 2} y={dispY0 - 5} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>Dispersion: ω vs k</text>
 <rect x={dispMargin.l} y={dispY0} width={dispW} height={dispH} fill={T.surface} stroke={T.border} />

 <path d={acousticPath.join(" ")} fill="none" stroke={T.eo_e} strokeWidth={2} />
 <path d={opticalPath.join(" ")} fill="none" stroke={T.eo_hole} strokeWidth={2} />

 <text x={dispMargin.l + dispW + 2} y={currentAcousticY + 3} fontSize={13} fill={T.eo_e}>LA</text>
 <text x={dispMargin.l + dispW + 2} y={dispY0 + dispH - opticalBranch(Math.PI) * dispH + 3} fontSize={13} fill={T.eo_hole}>LO</text>

 <line x1={currentKx} y1={dispY0} x2={currentKx} y2={dispY0 + dispH} stroke={T.eo_photon} strokeWidth={1.5} strokeDasharray="3,2" />
 <circle cx={currentKx} cy={mode === "acoustic" ? currentAcousticY : currentOpticalY}
 r={5} fill={mode === "acoustic" ? T.eo_e : T.eo_hole} stroke={T.ink} strokeWidth={1.5} />

 <text x={dispMargin.l} y={dispY0 + dispH + 12} fontSize={13} fill={T.muted}>0</text>
 <text x={dispMargin.l + dispW} y={dispY0 + dispH + 12} textAnchor="end" fontSize={13} fill={T.muted}>π/a</text>
 <text x={dispMargin.l - 5} y={dispY0 + 8} textAnchor="end" fontSize={13} fill={T.muted}>ω</text>
 <text x={dispMargin.l + dispW / 2} y={dispY0 + dispH + 12} textAnchor="middle" fontSize={13} fill={T.muted}>k</text>
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
 if (e < 1.65) return "#7c3aed";
 if (e < 1.9) return "#7c3aed";
 if (e < 2.0) return "#7c3aed";
 if (e < 2.1) return "#7c3aed";
 if (e < 2.3) return "#7c3aed";
 if (e < 2.6) return "#7c3aed";
 if (e < 2.8) return "#7c3aed";
 if (e < 3.1) return "#7c3aed";
 return "#7c3aed";
 };
 const photonColor = photonE < 1.65 ? "#7c3aed" : photonE > 3.1 ? "#7c3aed" : eToColor(photonE);

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
 When light hits a material, what happens depends on the light{"'"}s energy compared to the band gap. If the energy is big enough, the light is absorbed and the material is not see-through. If the energy is too small, the light passes through and the material is clear. If the light bounces back, the material looks shiny.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <svg viewBox={`0 0 ${svgW} ${svgH}`}
 style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>

 <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill={T.ink}>
 Photon Absorption ({gapType} gap)
 </text>

 <rect x={bandLeft} y={25} width={bandRight - bandLeft} height={bandTop - 25} rx={4} fill="#7c3aed08" stroke={T.eo_cond} strokeWidth={1.5} />
 <text x={(bandLeft + bandRight) / 2} y={bandTop - 8} textAnchor="middle" fontSize={12} fill={T.eo_cond}>Conduction Band</text>

 <rect x={bandLeft} y={vbTop} width={bandRight - bandLeft} height={35} rx={4} fill="#7c3aed08" stroke={T.eo_valence} strokeWidth={1.5} />
 <text x={(bandLeft + bandRight) / 2} y={vbTop + 22} textAnchor="middle" fontSize={12} fill={T.eo_valence}>Valence Band</text>

 <text x={(bandLeft + bandRight) / 2} y={(cbBottom + vbTop) / 2 + 4} textAnchor="middle" fontSize={12} fill={T.eo_gap}>
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
 <text x={photonX + waveLen} y={photonY - 12} textAnchor="middle" fontSize={13} fill={T.muted}>transparent</text>
 </g>
 )}

 {showAbsorption && (
 <g>
 <circle cx={(bandLeft + bandRight) / 2} cy={(cbBottom + vbTop) / 2} r={20} fill={T.eo_valence} opacity={flashOpacity * 0.3} />
 <circle cx={(bandLeft + bandRight) / 2} cy={electronY} r={5} fill={T.eo_e} stroke={T.ink} strokeWidth={1} />
 <circle cx={(bandLeft + bandRight) / 2} cy={vbTop + 5} r={4} fill="none" stroke={T.eo_hole} strokeWidth={1.5} />
 </g>
 )}

 <text x={specLeft} y={specTop - 2} fontSize={12} fontWeight="bold" fill={T.ink}>α(E) Absorption</text>
 <rect x={specLeft} y={specTop} width={specW} height={specBot - specTop} fill={T.surface} stroke={T.border} />
 <path d={specPath.join(" ")} fill="none" stroke={T.eo_gap} strokeWidth={2} />

 <line x1={specLeft + ((bandGap - 0.5) / 3.5) * specW} y1={specTop} x2={specLeft + ((bandGap - 0.5) / 3.5) * specW} y2={specBot}
 stroke={T.eo_gap} strokeWidth={1} strokeDasharray="3,2" />
 <text x={specLeft + ((bandGap - 0.5) / 3.5) * specW} y={specBot + 10} textAnchor="middle" fontSize={13} fill={T.eo_gap}>E_g</text>

 {indicatorX >= specLeft && indicatorX <= specRight && (
 <circle cx={indicatorX} cy={specBot - Math.min(1, currentAlpha) * (specBot - specTop - 15)} r={4} fill={photonColor} stroke={T.ink} strokeWidth={1} />
 )}

 <text x={specLeft} y={specBot + 10} fontSize={13} fill={T.muted}>0.5</text>
 <text x={specRight} y={specBot + 10} textAnchor="end" fontSize={13} fill={T.muted}>4.0 eV</text>
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
 When you apply an electric field to a material, the charges inside shift a little. Positive charges move one way, negative charges the other. This shifting is called polarization. Materials that shift a lot have a high dielectric constant. This property matters for capacitors and transistors.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 fill={ch.isPositive ? "#7c3aed12" : "#7c3aed0a"} stroke={ch.isPositive ? T.eo_e : T.eo_hole} strokeWidth={1.5} />
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
 <text x={gridX0 + 60} y={gridY0 + gridRows * cellSize + 26} fontSize={13} fontWeight="bold" fill={T.eo_gap}>E</text>

 {pArrowLen > 5 && (
 <>
 <line x1={svgW / 2 - pArrowLen / 2} y1={gridY0 + gridRows * cellSize + 38}
 x2={svgW / 2 + pArrowLen / 2} y2={gridY0 + gridRows * cellSize + 38}
 stroke={T.eo_valence} strokeWidth={2} markerEnd="url(#arrowP)" />
 <text x={svgW / 2 + pArrowLen / 2 + 8} y={gridY0 + gridRows * cellSize + 42} fontSize={13} fontWeight="bold" fill={T.eo_valence}>P</text>
 </>
 )}
 </g>
 )}

 <text x={specLeft - 2} y={specY0 - 5} fontSize={12} fontWeight="bold" fill={T.ink}>ε(ω)</text>
 <rect x={specLeft} y={specY0} width={specW} height={specH} fill={T.surface} stroke={T.border} />
 <path d={epsPlotPath.join(" ")} fill="none" stroke={T.eo_core} strokeWidth={2} />

 <line x1={specLeft} y1={specY0 + specH - (epsTotal / 14) * specH} x2={specLeft + specW * 0.25}
 y2={specY0 + specH - (epsTotal / 14) * specH} stroke={T.eo_e} strokeWidth={1} strokeDasharray="3,2" />
 <text x={specLeft + 2} y={specY0 + specH - (epsTotal / 14) * specH - 3} fontSize={13} fill={T.eo_e}>ε₀={epsTotal.toFixed(1)}</text>

 <line x1={specLeft + specW * 0.35} y1={specY0 + specH - (epsElectronic / 14) * specH} x2={specLeft + specW * 0.7}
 y2={specY0 + specH - (epsElectronic / 14) * specH} stroke={T.eo_cond} strokeWidth={1} strokeDasharray="3,2" />
 <text x={specLeft + specW * 0.5} y={specY0 + specH - (epsElectronic / 14) * specH - 3} fontSize={13} fill={T.eo_cond}>ε∞={epsElectronic.toFixed(1)}</text>

 <text x={specLeft + specW * 0.15} y={specY0 + specH + 10} textAnchor="middle" fontSize={13} fill={T.eo_hole}>IR (ionic)</text>
 <text x={specLeft + specW * 0.55} y={specY0 + specH + 10} textAnchor="middle" fontSize={13} fill={T.eo_cond}>UV (electronic)</text>
 <text x={specLeft + specW / 2} y={specY0 + specH + 10} textAnchor="middle" fontSize={13} fill={T.muted}>ω →</text>
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
 fill={isActive ? "#7c3aed06" : T.surface} stroke={isActive ? colors[mech] : T.border} strokeWidth={isActive ? 2 : 1} />

 <rect x={panelX + 10} y={cbY} width={panelW - 80} height={8} rx={2} fill="#7c3aed12" stroke={T.eo_cond} strokeWidth={0.8} />
 <text x={panelX + panelW - 65} y={cbY + 7} fontSize={13} fill={T.eo_cond}>CB</text>

 <rect x={panelX + 10} y={vbY - 4} width={panelW - 80} height={8} rx={2} fill="#7c3aed0a" stroke={T.eo_valence} strokeWidth={0.8} />
 <text x={panelX + panelW - 65} y={vbY + 3} fontSize={13} fill={T.eo_valence}>VB</text>

 <text x={panelX + panelW - 60} y={midY + 4} fontSize={13} fontWeight="bold" fill={colors[mech]}>
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
 <text x={cx + 30} y={midY - 10} fontSize={12} fill={T.eo_photon}>hν</text>
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
 <text x={cx + 25} y={midY + 3} fontSize={12} fill={T.eo_gap}>trap</text>
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
 <text x={cx + 25} y={el2Y - 5} fontSize={12} fill={T.eo_core}>
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
 When an electron gets enough energy, it jumps from the valence band to the conduction band. Recombination is when it falls back down. The energy it releases can come out as light (used in LEDs) or as heat (wasted energy). Defects in the crystal create stepping stones that make electrons fall back faster.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
 <svg viewBox={`0 0 ${svgW} ${svgH}`}
 style={{ background: T.panel, borderRadius: 8, border: `1px solid ${T.border}`, flexShrink: 0, width: "100%", maxWidth: svgW }}>
 <text x={svgW / 2} y={14} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.ink}>
 Recombination Mechanisms
 </text>
 {mechanisms.map((m, i) => drawPanel(m, i))}
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
 <rect x={cx - 18} y={cy + 5} width={36} height={10} rx={2} fill="#7c3aed0a" stroke={T.eo_valence} strokeWidth={1} />
 <rect x={cx - 18} y={cy - 18} width={36} height={10} rx={2} fill="#7c3aed12" stroke={T.eo_cond} strokeWidth={1} />
 <text x={cx} y={cy + 2} textAnchor="middle" fontSize={12} fill={T.eo_gap}>gap</text>
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
 <rect x={cx - 18} y={cy - 16} width={18} height={32} rx={2} fill="#7c3aed12" stroke={T.eo_cond} strokeWidth={1} />
 <rect x={cx} y={cy - 16} width={18} height={32} rx={2} fill="#7c3aed0a" stroke={T.eo_hole} strokeWidth={1} />
 <text x={cx - 9} y={cy + 3} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.eo_cond}>n</text>
 <text x={cx + 9} y={cy + 3} textAnchor="middle" fontSize={13} fontWeight="bold" fill={T.eo_hole}>p</text>
 <path d={`M${cx - 28},${cy - 8} Q${cx - 24},${cy - 14} ${cx - 20},${cy - 8}`} fill="none" stroke={T.eo_photon} strokeWidth={1.5} />
 <polygon points={`${cx - 18},${cy - 8} ${cx - 22},${cy - 11} ${cx - 22},${cy - 5}`} fill={T.eo_photon} />
 </g>
 );

 const drawFns = [drawAtom, drawBond, drawCrystal, drawBands, drawDefect, drawSolarCell];
 const iconY = 140;

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", color: T.ink }}>
 <AnalogyBox>
 Building a device starts from the smallest piece: the atom. First you understand how atoms work. Then how they connect. Then how they form crystals. Then how electrons flow in those crystals. Each step builds on the one before, until you can design real devices like solar cells and transistors.
 </AnalogyBox>
 <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
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
 <circle cx={s.x} cy={iconY} r={26} fill={i <= activeStage ? "#7c3aed08" : T.surface}
 stroke={i <= activeStage ? s.color : T.border} strokeWidth={i === activeStage ? 2.5 : 1} />
 {drawFns[i](s.x, iconY, i <= activeStage)}
 <text x={s.x} y={iconY + 38} textAnchor="middle" fontSize={13}
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
 <text x={svgW / 2} y={230} textAnchor="middle" fontSize={13} fontWeight="bold"
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
 <text key={i} x={svgW / 2} y={248 + i * 14} textAnchor="middle" fontSize={12} fill={T.muted}>
 {line}
 </text>
 ));
 })()}
 </svg>

 <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
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
 <div style={{ color: T.dim }}>{' └→'} bond type</div>
 <div style={{ color: T.dim }}>{' └→'} crystal structure</div>
 <div style={{ color: T.dim }}>{' └→'} electronic bands</div>
 <div style={{ color: T.dim }}>{' └→'} defect behavior</div>
 <div style={{ color: T.dim }}>{' └→'} device performance</div>
 </div>
 </div>

 <div style={{ background: "#7c3aed08", padding: 10, borderRadius: 6, border: "1px solid #7c3aed", fontSize: 11, lineHeight: 1.5 }}>
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
// FAQ ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function FAQAccordion({ title, color, isOpen, onClick, children }) {
 return (
 <div style={{ borderRadius: 12, border: `1.5px solid ${isOpen ? color : T.border}`, overflow: "hidden", transition: "all 0.2s" }}>
 <button onClick={onClick} style={{
 width: "100%", padding: "12px 16px", background: isOpen ? color + "12" : T.surface,
 border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
 fontFamily: "inherit", textAlign: "left",
 }}>
 <span style={{ fontSize: 14, color: isOpen ? color : T.muted, fontWeight: 700, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}></span>
 <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? color : T.ink, flex: 1 }}>{title}</span>
 {isOpen && <span style={{ fontSize: 10, color, fontWeight: 600, padding: "2px 8px", background: color + "15", borderRadius: 6 }}>OPEN</span>}
 </button>
 {isOpen && (
 <div style={{ padding: "12px 16px", borderTop: `1px solid ${color}20`, background: T.surface, fontSize: 12, lineHeight: 1.7 }}>
 {children}
 </div>
 )}
 </div>
 );
}

// ═══════════════════════════════════════════════════════════════════════════
// BIG QUESTIONS — Deep FAQ for the Atoms World chapter
// ═══════════════════════════════════════════════════════════════════════════

function AtomsBigQuestionsSection() {
 const [openQ, setOpenQ] = useState("AQ1");
 const toggle = (q) => setOpenQ(openQ === q ? null : q);
 const mb = { fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, background: T.surface, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.border}40`, marginBottom: 8 };

 return (
 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

 {/* ── AQ1-AQ6: Atomic Models ── */}

 <FAQAccordion title="AQ1: Why doesn't the electron fall into the nucleus?" color={T.eo_core} isOpen={openQ === "AQ1"} onClick={() => toggle("AQ1")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a guitar string. You can pluck it, but it can only vibrate at certain frequencies — the fundamental, harmonics, etc. It cannot vibrate at "zero frequency" (a flat, motionless string with tension is the lowest energy, but it still has some vibration at the quantum level). Similarly, an electron is a standing wave around the nucleus. The lowest energy state still has a finite spread — it cannot "collapse" to a point.
 </div>
 <p><b>Simple English:</b> In classical physics, an orbiting charge should radiate energy and spiral inward. But quantum mechanics says the electron is not a point particle orbiting — it is a wave. The Heisenberg uncertainty principle forbids confining it to an infinitely small space. If you tried to squeeze it onto the nucleus, its momentum uncertainty would skyrocket, giving it enormous kinetic energy that pushes it back out. The ground state (1s orbital) is the balance point between electrostatic attraction pulling it in and quantum kinetic energy pushing it out.</p>
 <div style={mb}>
 ΔxΔp ≥ ℏ/2{"\n"}
 If Δx → 0, then Δp → ∞, so KE = p²/2m → ∞{"\n"}
 Ground state energy of hydrogen: E₁ = -13.6 eV{"\n"}
 Bohr radius a₀ = 0.529 Å — the most probable distance
 </div>
 <p><b>Numerical example:</b> If we tried to confine an electron to r = 10⁻¹⁵ m (the nuclear radius), Δp ≈ ℏ/(2×10⁻¹⁵) ≈ 5.3×10⁻²⁰ kg·m/s, giving KE ≈ 1.5×10⁻¹⁰ J ≈ 940 MeV. That is ~69,000× more energy than the 13.6 eV binding energy. The electron simply cannot stay there.</p>
 </FAQAccordion>

 <FAQAccordion title="AQ2: What exactly is wave-particle duality?" color={T.eo_core} isOpen={openQ === "AQ2"} onClick={() => toggle("AQ2")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of a coin. Heads or tails? It depends on how you look. But a coin is ALWAYS a coin — it has both sides simultaneously. An electron is always a quantum object. When you do a "which slit" experiment, you see the particle face. When you let it propagate freely, you see the wave face. It is not switching — your measurement picks which aspect you observe.
 </div>
 <p><b>Simple English:</b> Every quantum object (electron, photon, neutron, even molecules) behaves like a wave when propagating and like a particle when detected. The de Broglie relation connects the two: a particle with momentum p has a wavelength λ = h/p. This is not a metaphor — electrons literally create interference patterns in the double-slit experiment, just like water waves.</p>
 <div style={mb}>
 λ = h/p = h/(mv){"\n"}
 For an electron at 100 eV: v ≈ 5.93×10⁶ m/s{"\n"}
 λ = 6.626×10⁻³⁴ / (9.109×10⁻³¹ × 5.93×10⁶){"\n"}
 λ ≈ 1.23 Å — comparable to atomic spacings!
 </div>
 <p><b>Key insight:</b> This is why electron diffraction works for crystal structure determination. The electron wavelength at typical TEM energies (100-300 keV) is ~0.02-0.04 Å, smaller than atom spacing, giving excellent resolution.</p>
 </FAQAccordion>

 <FAQAccordion title="AQ3: What does |ψ|² really mean?" color={T.eo_core} isOpen={openQ === "AQ3"} onClick={() => toggle("AQ3")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine throwing darts at a board blindfolded millions of times. Each dart lands at a random spot, but after millions of throws, a pattern emerges — more darts near the center, fewer at the edges. |ψ|² is like the dart-density map: it does not tell you where the next dart will land, but it tells you the probability of landing in each region.
 </div>
 <p><b>Simple English:</b> ψ (psi) is the wavefunction — a complex-valued function of position and time. It has no direct physical meaning by itself. But |ψ(r)|² gives the probability density of finding the particle at position r. If you multiply by a small volume dV, you get the probability of finding the electron in that tiny volume: P = |ψ|²dV. The total probability over all space must equal 1 (the electron is somewhere).</p>
 <div style={mb}>
 ∫|ψ(r)|² dV = 1 (normalization condition){"\n"}
 For hydrogen 1s: ψ₁ₛ = (1/√π)(1/a₀)^(3/2) × e^(-r/a₀){"\n"}
 |ψ₁ₛ|² = (1/πa₀³) × e^(-2r/a₀){"\n"}
 Maximum probability density: at r = 0 (the nucleus!)
 But most probable RADIUS: r = a₀ = 0.529 Å
 </div>
 <p><b>Subtle point:</b> The probability density |ψ|² peaks at r=0 for the 1s orbital, but the radial probability 4πr²|ψ|² peaks at r = a₀. The factor 4πr² accounts for the growing spherical shell volume at larger r.</p>
 </FAQAccordion>

 <FAQAccordion title="AQ4: How does the Heisenberg Uncertainty Principle actually work?" color={T.eo_core} isOpen={openQ === "AQ4"} onClick={() => toggle("AQ4")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of a musical note. A pure tone (single frequency) goes on forever in time — you know the frequency perfectly but cannot say "when" the note is. A sharp clap is perfectly localized in time but contains ALL frequencies. You cannot have both a perfectly defined pitch and a perfectly defined moment. This is exactly the uncertainty principle for waves.
 </div>
 <p><b>Simple English:</b> The uncertainty principle is NOT about measurement clumsiness or instrument limitations. It is a fundamental property of waves. Position and momentum are "conjugate variables" — their operators do not commute. A state with well-defined position is a superposition of many momenta, and vice versa. This is mathematically identical to the bandwidth theorem in signal processing.</p>
 <div style={mb}>
 ΔxΔp ≥ ℏ/2 (position-momentum){"\n"}
 ΔEΔt ≥ ℏ/2 (energy-time){"\n"}
 ℏ = h/(2π) = 1.055×10⁻³⁴ J·s{"\n"}
 {"\n"}
 Example: electron in a 1 Å box (atom-sized){"\n"}
 Δp ≥ ℏ/(2×10⁻¹⁰) = 5.3×10⁻²⁵ kg·m/s{"\n"}
 KE ≈ (Δp)²/(2m) ≈ 1.5×10⁻¹⁹ J ≈ 0.95 eV
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ5: What are orbitals, really? Are they orbits?" color={T.eo_core} isOpen={openQ === "AQ5"} onClick={() => toggle("AQ5")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> An orbit is the path a planet takes around the Sun — a defined trajectory. An orbital is more like the region where a bee buzzes around a flower. You cannot predict where the bee is at any moment, but you can draw a cloud showing where it spends most of its time. The shape of that cloud IS the orbital.
 </div>
 <p><b>Simple English:</b> An orbital is a solution to the Schrödinger equation for an electron in the atom. It is a mathematical function ψ(r,θ,φ) that describes the quantum state. The shape we draw (the 3D lobes) is an isosurface of |ψ|² that encloses ~90% of the probability. Different orbitals (s, p, d, f) have different shapes because they correspond to different angular momentum quantum numbers.</p>
 <div style={mb}>
 s orbitals: l=0, spherical, 1 orientation{"\n"}
 p orbitals: l=1, dumbbell, 3 orientations (px, py, pz){"\n"}
 d orbitals: l=2, cloverleaf, 5 orientations{"\n"}
 f orbitals: l=3, complex shapes, 7 orientations{"\n"}
 Number of orbitals per l: (2l+1)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ6: Why do s orbitals fill before p orbitals?" color={T.eo_core} isOpen={openQ === "AQ6"} onClick={() => toggle("AQ6")}>
 <div style={{ background: T.eo_core + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine two bowling lanes. Lane S goes straight to the pins (the nucleus) — the ball gets close and feels the full force. Lane P has a bumper that keeps the ball farther away. Even if both balls are on the same "level" (same n), the S ball interacts more strongly with the pins because it penetrates closer. It is "more bound" and therefore lower energy.
 </div>
 <p><b>Simple English:</b> In hydrogen (one electron), all orbitals with the same n have the same energy (they are degenerate). But in multi-electron atoms, inner electrons shield outer electrons from the nuclear charge. An s electron penetrates closer to the nucleus than a p electron (the s wavefunction is nonzero at r=0), so it "sees" more nuclear charge through the inner electron cloud. This makes s orbitals lower in energy than p orbitals of the same n.</p>
 <div style={mb}>
 Effective nuclear charge: Z<sub>eff</sub> = Z - σ (Slater's rules){"\n"}
 Penetration order: s {">"} p {">"} d {">"} f{"\n"}
 So energy order: E(ns) {"<"} E(np) {"<"} E(nd) {"<"} E(nf){"\n"}
 For n=3 in Ar: E(3s) {"<"} E(3p) {"<"} E(3d)
 </div>
 </FAQAccordion>

 {/* ── AQ7-AQ10: Quantum Numbers ── */}

 <FAQAccordion title="AQ7: What do the four quantum numbers physically mean?" color={T.eo_e} isOpen={openQ === "AQ7"} onClick={() => toggle("AQ7")}>
 <div style={{ background: T.eo_e + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of quantum numbers as an address system. n = the floor (energy level), l = the apartment type (shape — studio, 1BR, 2BR), mₗ = the apartment number on that floor (orientation), and mₛ = which bed in the apartment (spin up or down). No two electrons can have the exact same address.
 </div>
 <p><b>Simple English:</b> Each quantum number corresponds to a physical property. n determines energy and average distance from nucleus. l determines the shape of the orbital and angular momentum. mₗ determines the spatial orientation. mₛ determines the intrinsic spin angular momentum (up +½ or down -½). Together, they uniquely identify every electron state in an atom.</p>
 <div style={mb}>
 n = 1, 2, 3, ... (principal: energy, size){"\n"}
 l = 0, 1, ..., n-1 (angular momentum: shape){"\n"}
 mₗ = -l, ..., 0, ..., +l (magnetic: orientation){"\n"}
 mₛ = +½ or -½ (spin: intrinsic angular momentum){"\n"}
 {"\n"}
 Angular momentum magnitude: L = √(l(l+1))ℏ{"\n"}
 z-component: Lz = mₗℏ{"\n"}
 Spin magnitude: S = √(s(s+1))ℏ = (√3/2)ℏ
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ8: Why can't two electrons have the same quantum numbers? (Pauli Exclusion)" color={T.eo_e} isOpen={openQ === "AQ8"} onClick={() => toggle("AQ8")}>
 <div style={{ background: T.eo_e + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine identical twins at a costume party where the rule is "no two people can wear the exact same costume." Since the twins already look alike, they MUST differ in at least one accessory — maybe one wears a red hat and the other blue. Electrons are identical fermions, so they MUST differ in at least one quantum number.
 </div>
 <p><b>Simple English:</b> The Pauli exclusion principle comes from the antisymmetry requirement for fermion wavefunctions. When you swap two identical fermions, the total wavefunction must change sign: ψ(1,2) = -ψ(2,1). If both are in the same state, then ψ(1,2) = -ψ(1,2), which means ψ = 0 — the state does not exist. This is why each orbital (defined by n, l, mₗ) holds at most 2 electrons (spin up and spin down).</p>
 <div style={mb}>
 Max electrons per shell n: 2n²{"\n"}
 n=1: 2 electrons (1s²){"\n"}
 n=2: 8 electrons (2s² 2p⁶){"\n"}
 n=3: 18 electrons (3s² 3p⁶ 3d¹⁰){"\n"}
 n=4: 32 electrons (4s² 4p⁶ 4d¹⁰ 4f¹⁴)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ9: What is orbital degeneracy and when does it break?" color={T.eo_e} isOpen={openQ === "AQ9"} onClick={() => toggle("AQ9")}>
 <div style={{ background: T.eo_e + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a perfectly round drum — it vibrates at certain frequencies, and some different vibration patterns happen to have the exact same frequency (degenerate). Now dent the drum — the symmetry is broken, and those previously equal frequencies split apart. In atoms, the spherical symmetry of hydrogen makes same-n orbitals degenerate, but other electrons or external fields break this symmetry.
 </div>
 <p><b>Simple English:</b> "Degenerate" means "same energy." In hydrogen, the 2s and 2p orbitals have the same energy because the potential is purely 1/r (perfect spherical symmetry). In multi-electron atoms, electron-electron repulsion breaks this degeneracy: 2s becomes lower than 2p. External magnetic fields split the mₗ sublevels (Zeeman effect). Crystal fields in solids split d orbitals into eg and t2g sets.</p>
 <div style={mb}>
 Hydrogen: E depends only on n → n² degenerate states{"\n"}
 Multi-electron: E depends on n and l → (2l+1) degenerate states per subshell{"\n"}
 In magnetic field B: E depends on n, l, mₗ → each mₗ splits{"\n"}
 Zeeman splitting: ΔE = mₗ × μ_B × B{"\n"}
 Crystal field (octahedral): d orbitals split into t₂g (3) and eg (2)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ10: What IS electron spin? Does the electron actually spin?" color={T.eo_e} isOpen={openQ === "AQ10"} onClick={() => toggle("AQ10")}>
 <div style={{ background: T.eo_e + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Spin is like a property of a playing card being face-up or face-down. It is not that the card is literally spinning — it is just an intrinsic two-state property. Similarly, electron spin is not physical rotation. It is an intrinsic quantum property that gives the electron a magnetic moment, as if it were a tiny bar magnet that can only point up or down.
 </div>
 <p><b>Simple English:</b> Electron spin is an intrinsic angular momentum with no classical analogue. If the electron were literally spinning, its surface would need to move faster than light to account for the observed magnetic moment. Spin emerges naturally from the Dirac equation (relativistic quantum mechanics). It has exactly two states: +ℏ/2 (spin-up) and -ℏ/2 (spin-down). Spin is what makes electrons fermions and is responsible for magnetism in materials.</p>
 <div style={mb}>
 Spin quantum number: s = ½{"\n"}
 Spin angular momentum: S = √(s(s+1))ℏ = (√3/2)ℏ{"\n"}
 z-component: Sz = mₛℏ = ±ℏ/2{"\n"}
 Magnetic moment: μ = -gₑ(e/2mₑ)S{"\n"}
 g-factor: gₑ ≈ 2.0023 (anomalous magnetic moment)
 </div>
 </FAQAccordion>

 {/* ── AQ11-AQ14: Aufbau & Periodic Trends ── */}

 <FAQAccordion title="AQ11: Why does 4s fill before 3d?" color={T.eo_valence} isOpen={openQ === "AQ11"} onClick={() => toggle("AQ11")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine hiking. There are two trails to the summit: a direct steep path (3d) and a longer winding path (4s). Even though the winding path goes to a higher "floor," it actually requires less total energy because the terrain is easier. The 4s orbital is farther from the nucleus but penetrates more effectively, making it lower energy than 3d for elements K and Ca.
 </div>
 <p><b>Simple English:</b> The Madelung (n+l) rule says orbitals fill in order of increasing n+l (and for equal n+l, increasing n). 4s has n+l = 4+0 = 4, while 3d has n+l = 3+2 = 5. So 4s fills first. However, after 3d starts filling (Sc onward), the 3d orbital actually drops below 4s in energy due to increasing nuclear charge. This is why transition metals lose 4s electrons first when forming ions.</p>
 <div style={mb}>
 Filling order (Madelung rule): 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, ...{"\n"}
 K (Z=19): [Ar] 4s¹ (not [Ar] 3d¹){"\n"}
 Ca (Z=20): [Ar] 4s²{"\n"}
 Sc (Z=21): [Ar] 3d¹ 4s²{"\n"}
 But Fe²⁺: [Ar] 3d⁶ (loses 4s electrons first!)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ12: What is electronegativity and why does it trend the way it does?" color={T.eo_valence} isOpen={openQ === "AQ12"} onClick={() => toggle("AQ12")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a tug-of-war between two atoms over shared electrons. The stronger player (higher electronegativity) pulls the electron rope closer to itself. Fluorine is the strongest puller (3.98), while cesium barely tries (0.79). In a bond, electrons spend more time near the more electronegative atom.
 </div>
 <p><b>Simple English:</b> Electronegativity measures how strongly an atom attracts bonding electrons. It increases going right across a period (more protons, same shell → stronger pull) and up a group (electrons closer to nucleus → stronger pull). Fluorine is the most electronegative element. The electronegativity difference between bonding atoms determines bond polarity: small difference → covalent, large difference → ionic.</p>
 <div style={mb}>
 Pauling scale: F (3.98) {">"} O (3.44) {">"} N (3.04) {">"} C (2.55){"\n"}
 Mulliken: χ = (IE + EA)/2{"\n"}
 |Δχ| {"<"} 0.5 → nonpolar covalent{"\n"}
 0.5 {"<"} |Δχ| {"<"} 1.7 → polar covalent{"\n"}
 |Δχ| {">"} 1.7 → ionic
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ13: Why does ionization energy increase across a period?" color={T.eo_valence} isOpen={openQ === "AQ13"} onClick={() => toggle("AQ13")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine pulling a metal ball off a magnet. A stronger magnet (more protons in the nucleus) holds the ball tighter, requiring more energy to remove it. Across a period, the nuclear charge increases but the shielding stays roughly the same, so each successive element holds its outer electrons more tightly.
 </div>
 <p><b>Simple English:</b> Ionization energy (IE) is the energy needed to remove the outermost electron. Across a period (left to right), the nuclear charge Z increases by 1 for each element while electrons go into the same shell. The effective nuclear charge Z<sub>eff</sub> increases, pulling electrons closer and binding them tighter. Exceptions occur at groups 3 and 6 due to subshell effects (p electron easier to remove than s; half-filled stability).</p>
 <div style={mb}>
 First IE trend (Period 2, in eV):{"\n"}
 Li: 5.39 → Be: 9.32 → B: 8.30* → C: 11.26 → N: 14.53{"\n"}
 → O: 13.62* → F: 17.42 → Ne: 21.56{"\n"}
 *B drops: removing p electron (easier than s){"\n"}
 *O drops: pairing penalty in p⁴ configuration
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ14: Why do atoms get smaller across a period but larger down a group?" color={T.eo_valence} isOpen={openQ === "AQ14"} onClick={() => toggle("AQ14")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a balloon on a string. Pulling the string tighter (increasing nuclear charge across a period) shrinks the balloon. Adding more layers of string (new electron shells down a group) makes the balloon bigger despite the string tension. Atomic radius decreases across periods and increases down groups.
 </div>
 <p><b>Simple English:</b> Across a period, electrons are added to the same shell while nuclear charge increases. Greater Z<sub>eff</sub> pulls the electron cloud inward, shrinking the atom. Down a group, a new principal shell is added, which is farther from the nucleus. Even though Z increases, the new inner shell provides significant shielding, so the outer electrons are farther away and the atom is larger.</p>
 <div style={mb}>
 Atomic radii (pm):{"\n"}
 Period 2: Li(152) → Be(112) → B(87) → C(77) → N(75) → O(73) → F(72){"\n"}
 Group 1: Li(152) → Na(186) → K(227) → Rb(248) → Cs(265){"\n"}
 Covalent radius of C: 77 pm{"\n"}
 Van der Waals radius of C: 170 pm
 </div>
 </FAQAccordion>

 {/* ── AQ15-AQ18: Chemical Bonding ── */}

 <FAQAccordion title="AQ15: What is the real difference between ionic, covalent, and metallic bonds?" color={T.eo_valence} isOpen={openQ === "AQ15"} onClick={() => toggle("AQ15")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of electrons as money. Ionic bonding: one atom gives money to another (electron transfer, like a donation). Covalent bonding: atoms share money equally or unequally (electron sharing, like a joint bank account). Metallic bonding: everyone puts money in a communal pool that all atoms draw from (delocalized electron sea, like a commune).
 </div>
 <p><b>Simple English:</b> These three are not distinct categories but points on a bonding triangle. Ionic bonds form between atoms with large electronegativity differences — one atom essentially takes electrons from another, creating charged ions attracted by Coulomb forces. Covalent bonds share electrons between atoms with similar electronegativities. Metallic bonds delocalize valence electrons over the entire crystal. Real bonds are often mixtures.</p>
 <div style={mb}>
 Ionic: NaCl → Na⁺ + Cl⁻ (Δχ = 2.23){"\n"}
 Covalent: H₂ → H–H (Δχ = 0){"\n"}
 Metallic: Cu → Cu⁺ ions in electron sea{"\n"}
 Polar covalent: HF (Δχ = 1.78) — mostly ionic character{"\n"}
 Bond energy: NaCl lattice energy = 786 kJ/mol{"\n"}
 H-H bond energy = 436 kJ/mol
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ16: What IS a chemical bond in quantum mechanical terms?" color={T.eo_valence} isOpen={openQ === "AQ16"} onClick={() => toggle("AQ16")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine two tuning forks near each other. Separately, each vibrates at its own frequency. Together, they couple and create two new frequencies — one lower (bonding) and one higher (antibonding). A chemical bond is when electrons occupy the lower-frequency (lower-energy) coupled state, making the system more stable than two separate atoms.
 </div>
 <p><b>Simple English:</b> A chemical bond forms when atomic orbitals overlap and combine into molecular orbitals. The bonding MO has lower energy than the original atomic orbitals because electron density builds up between the nuclei, reducing the potential energy. The key insight: it is not just about electrostatic attraction. The kinetic energy also decreases because the electron wavefunction spreads over a larger region (both atoms), lowering the kinetic energy via the uncertainty principle.</p>
 <div style={mb}>
 H₂ molecule:{"\n"}
 Two 1s orbitals → σ(bonding) + σ*(antibonding){"\n"}
 Bond energy = 4.52 eV (energy gained by forming bond){"\n"}
 Bond length = 0.74 Å{"\n"}
 Virial theorem: ⟨KE⟩ = -½⟨PE⟩ at equilibrium
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ17: What is bond order and why does it matter?" color={T.eo_valence} isOpen={openQ === "AQ17"} onClick={() => toggle("AQ17")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Bond order is like the number of ropes connecting two boats. One rope (single bond) is weak and the boats can drift apart easily. Two ropes (double bond) are stronger and hold them closer. Three ropes (triple bond) — very strong, very short. Zero ropes — no connection, the boats float apart.
 </div>
 <p><b>Simple English:</b> Bond order = (bonding electrons - antibonding electrons)/2. It tells you the net number of chemical bonds. Higher bond order means shorter, stronger, stiffer bonds. A bond order of zero means no stable bond forms (like He₂). Fractional bond orders are possible (e.g., O₃ has bond order 1.5).</p>
 <div style={mb}>
 Bond order = (N_bonding - N_antibonding) / 2{"\n"}
 H₂: (2-0)/2 = 1 → single bond, 436 kJ/mol, 0.74 Å{"\n"}
 O₂: (8-4)/2 = 2 → double bond, 498 kJ/mol, 1.21 Å{"\n"}
 N₂: (8-2)/2 = 3 → triple bond, 945 kJ/mol, 1.10 Å{"\n"}
 He₂: (2-2)/2 = 0 → no bond!
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ18: How does electronegativity difference determine bond type?" color={T.eo_valence} isOpen={openQ === "AQ18"} onClick={() => toggle("AQ18")}>
 <div style={{ background: T.eo_valence + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine two people of different strengths pulling on a spring with a ball in the middle. If equal strength (Δχ≈0), the ball stays centered — pure covalent. If one is much stronger (Δχ large), the ball moves almost entirely to one side — ionic. In between — polar covalent, with partial charges δ+ and δ−.
 </div>
 <p><b>Simple English:</b> The Pauling electronegativity difference Δχ between two bonded atoms predicts the ionic character of the bond. This is actually a continuous spectrum, not discrete categories. The percent ionic character can be estimated from Δχ. For materials science, this determines properties like dielectric constant, solubility, melting point, and band gap.</p>
 <div style={mb}>
 % ionic character ≈ (1 - e^(-0.25(Δχ)²)) × 100{"\n"}
 ZnTe: Zn(1.65) Te(2.10) → Δχ = 0.45 → ~5% ionic{"\n"}
 GaAs: Ga(1.81) As(2.18) → Δχ = 0.37 → ~3% ionic{"\n"}
 NaCl: Na(0.93) Cl(3.16) → Δχ = 2.23 → ~74% ionic{"\n"}
 SiC: Si(1.90) C(2.55) → Δχ = 0.65 → ~10% ionic
 </div>
 </FAQAccordion>

 {/* ── AQ19-AQ22: Hybridization ── */}

 <FAQAccordion title="AQ19: What is hybridization physically — do orbitals really mix?" color={T.eo_cond} isOpen={openQ === "AQ19"} onClick={() => toggle("AQ19")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine mixing red and blue paint. You do not get red OR blue — you get purple, a genuinely new color. Hybridization is mixing s and p orbitals to create new hybrid orbitals that are genuinely different from either parent. These new orbitals point in specific directions, optimizing bond overlap.
 </div>
 <p><b>Simple English:</b> Hybridization is a mathematical mixing (linear combination) of atomic orbitals on the SAME atom to create new orbitals better suited for bonding. It is a bookkeeping device from Valence Bond theory. The atom does not "decide" to hybridize — rather, when we analyze the bonding, we find that describing the atom's orbitals as hybrids better matches the observed molecular geometry. In MO theory, hybridization emerges naturally.</p>
 <div style={mb}>
 sp³ = ¼(s + px + py + pz) → tetrahedral, 109.5°{"\n"}
 sp² = ⅓(s + px + py) → trigonal planar, 120°{"\n"}
 sp = ½(s + px) → linear, 180°{"\n"}
 {"\n"}
 Each hybrid is normalized: ∫|ψ_hybrid|² dV = 1{"\n"}
 Hybrids are orthogonal: ∫ψᵢ*ψⱼ dV = 0 for i≠j
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ20: Why is sp3 tetrahedral, sp2 planar, and sp linear?" color={T.eo_cond} isOpen={openQ === "AQ20"} onClick={() => toggle("AQ20")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Tie balloons to a central point. Two balloons (sp) point in opposite directions — linear. Three balloons (sp²) spread into a flat Y — trigonal planar. Four balloons (sp³) form a 3D pyramid — tetrahedral. The balloons repel each other and settle into the geometry that maximizes the distance between them.
 </div>
 <p><b>Simple English:</b> The geometry comes from maximizing the overlap with bonding partners while minimizing electron-electron repulsion. sp³ mixes one s and three p orbitals to make four equivalent hybrids pointing to tetrahedral corners (109.5° apart). sp² mixes one s and two p orbitals for three planar hybrids at 120°, leaving one p orbital for π bonding. sp mixes one s and one p for two linear hybrids at 180°, leaving two p orbitals for π bonds.</p>
 <div style={mb}>
 sp³: CH₄ (methane), SiH₄, diamond → 109.5°{"\n"}
 sp²: C₂H₄ (ethylene), graphene, BF₃ → 120°{"\n"}
 sp: C₂H₂ (acetylene), CO₂, BeH₂ → 180°{"\n"}
 {"\n"}
 Bond angles predict molecular shape → VSEPR theory
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ21: Why does carbon hybridize so readily?" color={T.eo_cond} isOpen={openQ === "AQ21"} onClick={() => toggle("AQ21")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Carbon is like a versatile Lego brick with exactly 4 connectors. It can use all 4 equally (sp³, like diamond), use 3 and keep one special (sp², like graphite), or use 2 and keep two special (sp, like acetylene). No other element balances the s-p energy gap and number of valence electrons so perfectly for this versatility.
 </div>
 <p><b>Simple English:</b> Carbon has 4 valence electrons (2s² 2p²) and the 2s-2p energy gap is small enough (~4 eV) that the energy cost of promoting one electron from 2s to 2p is more than compensated by forming an additional bond (~3-4 eV per bond). Carbon can form 2, 3, or 4 bonds with nearly equal ease. Silicon, below carbon, has a larger s-p gap and prefers sp³. Nitrogen (5 valence e⁻) usually does sp³ with a lone pair.</p>
 <div style={mb}>
 Carbon 2s→2p promotion energy: ~4 eV{"\n"}
 C-H bond energy: ~4.3 eV → easily compensates{"\n"}
 Diamond: sp³ → 4 bonds → hardest natural material{"\n"}
 Graphene: sp² → 3σ + 1π → strongest 2D material{"\n"}
 Carbyne: sp → 2σ + 2π → extremely stiff chain
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ22: What is the real difference between sigma and pi bonds?" color={T.eo_cond} isOpen={openQ === "AQ22"} onClick={() => toggle("AQ22")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> A sigma bond is like a head-on handshake — the orbitals meet face-to-face along the bond axis, creating strong overlap. A pi bond is like linking arms side-by-side — the orbitals overlap laterally, above and below the bond axis. The handshake (σ) is stronger than linking arms (π), which is why π bonds are always the "second" bond in a double bond.
 </div>
 <p><b>Simple English:</b> σ bonds have cylindrical symmetry around the bond axis — the electron density is concentrated between the nuclei. π bonds have a nodal plane along the bond axis — electron density is above and below (or in front of and behind) the internuclear line. σ bonds can rotate freely; π bonds lock the molecule into a planar geometry because rotation would break the lateral overlap.</p>
 <div style={mb}>
 Single bond (C-C): 1σ, bond energy ~346 kJ/mol{"\n"}
 Double bond (C=C): 1σ + 1π, bond energy ~614 kJ/mol{"\n"}
 Triple bond (C≡C): 1σ + 2π, bond energy ~839 kJ/mol{"\n"}
 {"\n"}
 π bond energy ≈ 614 - 346 = 268 kJ/mol (weaker than σ){"\n"}
 Second π bond ≈ 839 - 614 = 225 kJ/mol (even weaker)
 </div>
 </FAQAccordion>

 {/* ── AQ23-AQ26: Molecular Orbitals ── */}

 <FAQAccordion title="AQ23: What is the difference between bonding and antibonding orbitals?" color={T.eo_cond} isOpen={openQ === "AQ23"} onClick={() => toggle("AQ23")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Two speakers playing the same note. In phase (constructive interference) — the sound is louder in the middle. That is a bonding orbital: electron density builds up between nuclei. Out of phase (destructive interference) — silence in the middle. That is an antibonding orbital: a node between nuclei where the electron density is zero.
 </div>
 <p><b>Simple English:</b> When two atomic orbitals combine, they always produce two molecular orbitals — one bonding (lower energy, constructive overlap) and one antibonding (higher energy, destructive overlap, marked with *). The bonding MO has increased electron density between nuclei, stabilizing the molecule. The antibonding MO has a node between nuclei and actually destabilizes. The antibonding orbital is always raised MORE in energy than the bonding orbital is lowered.</p>
 <div style={mb}>
 ψ_bonding = ψ_A + ψ_B (constructive){"\n"}
 ψ_antibonding = ψ_A - ψ_B (destructive){"\n"}
 {"\n"}
 Energy: E(σ*) - E(atom) {">"} E(atom) - E(σ){"\n"}
 This asymmetry is why He₂ does not form:{"\n"}
 He₂: σ(1s)² σ*(1s)² → net destabilization
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ24: What is the Homo-Lumo gap and why does it matter?" color={T.eo_cond} isOpen={openQ === "AQ24"} onClick={() => toggle("AQ24")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> HOMO is the highest occupied rung of a ladder (where the most energetic electron stands). LUMO is the next empty rung above. The gap between them determines how much energy is needed to "step up" — i.e., excite the molecule. A small gap means the molecule absorbs low-energy visible light (colored). A large gap means it is transparent.
 </div>
 <p><b>Simple English:</b> HOMO = Highest Occupied Molecular Orbital. LUMO = Lowest Unoccupied Molecular Orbital. The HOMO-LUMO gap determines the molecule's color (light absorption), chemical reactivity (small gap = more reactive), and electrical conductivity. In solids, this extends to the band gap between valence and conduction bands. The HOMO-LUMO gap is the molecular analogue of the semiconductor band gap.</p>
 <div style={mb}>
 Small HOMO-LUMO gap → colored, reactive, conductive{"\n"}
 Large HOMO-LUMO gap → colorless, stable, insulating{"\n"}
 {"\n"}
 β-carotene (orange): gap ≈ 2.4 eV → absorbs blue{"\n"}
 Benzene (colorless): gap ≈ 6.0 eV → absorbs UV only{"\n"}
 In Koopmans' theorem: IE ≈ -E(HOMO), EA ≈ -E(LUMO)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ25: Why is O₂ paramagnetic? (MO theory's triumph)" color={T.eo_cond} isOpen={openQ === "AQ25"} onClick={() => toggle("AQ25")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine assigning 12 students (electrons) to seats in a theater (molecular orbitals). The last two students arrive at a row with two equivalent seats (degenerate π* orbitals). Following Hund's rule, they each take a separate seat and both face the same direction (parallel spins). These unpaired spins make O₂ magnetic — attracted to a magnet!
 </div>
 <p><b>Simple English:</b> Lewis structures predict O₂ should have all electrons paired (O=O, double bond). But experimentally, liquid O₂ is attracted to magnets — it has unpaired electrons! MO theory explains this beautifully: O₂ has two electrons in degenerate π*₂p orbitals. By Hund's rule, they occupy separate orbitals with parallel spins, giving O₂ two unpaired electrons. This was a major validation of MO theory over Lewis structures.</p>
 <div style={mb}>
 O₂ MO configuration:{"\n"}
 (σ₂s)² (σ*₂s)² (σ₂p)² (π₂p)⁴ (π*₂p)²{"\n"}
 Bond order = (8-4)/2 = 2 (double bond){"\n"}
 Two unpaired electrons → paramagnetic {"\n"}
 Magnetic moment = 2√(s(s+1))μ_B ≈ 2.83 μ_B
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ26: MO theory vs. Valence Bond theory — which is right?" color={T.eo_cond} isOpen={openQ === "AQ26"} onClick={() => toggle("AQ26")}>
 <div style={{ background: T.eo_cond + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> MO and VB theories are like two different maps of the same city. The street map (VB) is great for navigating neighborhoods (localized bonds, molecular geometry). The subway map (MO) is better for understanding long-distance connections (delocalization, spectroscopy, magnetism). Neither is "wrong" — they emphasize different aspects.
 </div>
 <p><b>Simple English:</b> Valence Bond theory builds molecules from localized two-center bonds using hybrid orbitals. It is intuitive for predicting molecular geometry and understanding organic chemistry. MO theory builds molecules from delocalized orbitals spread over the entire molecule. It correctly predicts paramagnetism, spectroscopic properties, and band structure. For solids and materials science, MO theory naturally extends to band theory, making it more useful.</p>
 <div style={mb}>
 VB theory strengths: geometry, hybridization, resonance{"\n"}
 MO theory strengths: magnetism, spectroscopy, band theory{"\n"}
 {"\n"}
 Both give same results when fully converged.{"\n"}
 VB → localized picture: bonds, lone pairs{"\n"}
 MO → delocalized picture: energy levels, DOS{"\n"}
 For solids: MO theory → Band theory (essential!)
 </div>
 </FAQAccordion>

 {/* ── AQ27-AQ30: Crystal Symmetry ── */}

 <FAQAccordion title="AQ27: What is the difference between a unit cell and a primitive cell?" color={T.eo_photon} isOpen={openQ === "AQ27"} onClick={() => toggle("AQ27")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine tiling a bathroom floor. The primitive cell is the smallest tile that can cover the entire floor by repetition. The conventional unit cell is like using a larger, more convenient tile shape that might contain 2-4 copies of the primitive tile. Larger, but easier to work with because it shows the symmetry more clearly.
 </div>
 <p><b>Simple English:</b> A primitive cell contains exactly one lattice point and is the smallest repeating unit. The conventional unit cell is chosen to display the crystal's full symmetry and may contain 1, 2, or 4 lattice points. For example, FCC has a conventional cubic unit cell with 4 atoms but a primitive rhombohedral cell with 1 atom. We use conventional cells because they make the symmetry obvious.</p>
 <div style={mb}>
 Primitive cell: exactly 1 lattice point, minimum volume{"\n"}
 Conventional unit cells:{"\n"}
 Simple cubic (SC): 1 atom/cell → primitive{"\n"}
 BCC: 2 atoms/cell (conventional) → 1 atom (primitive){"\n"}
 FCC: 4 atoms/cell (conventional) → 1 atom (primitive){"\n"}
 Wigner-Seitz cell: primitive cell with full point group symmetry
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ28: What are Bravais lattices and why are there exactly 14?" color={T.eo_photon} isOpen={openQ === "AQ28"} onClick={() => toggle("AQ28")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of all possible ways to arrange identical dots in 3D space such that every dot "sees" the same environment. It is like asking: how many fundamentally different wallpaper patterns exist in 3D? Mathematics proves the answer is exactly 14. Any crystal must use one of these 14 lattice types — there are no others possible.
 </div>
 <p><b>Simple English:</b> A Bravais lattice is an infinite set of points generated by three translation vectors, where every point has an identical environment. There are 7 crystal systems (based on axis lengths and angles: cubic, tetragonal, orthorhombic, hexagonal, trigonal, monoclinic, triclinic) and centering types (P, I, F, C). Combining these gives 14 unique Bravais lattices. Some combinations are redundant (e.g., face-centered tetragonal = body-centered tetragonal).</p>
 <div style={mb}>
 7 crystal systems × centering types = 14 Bravais lattices:{"\n"}
 Cubic: P (SC), I (BCC), F (FCC) → 3{"\n"}
 Tetragonal: P, I → 2{"\n"}
 Orthorhombic: P, I, F, C → 4{"\n"}
 Hexagonal: P → 1{"\n"}
 Trigonal: P (R) → 1{"\n"}
 Monoclinic: P, C → 2{"\n"}
 Triclinic: P → 1 → Total: 14
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ29: What are point groups and space groups?" color={T.eo_photon} isOpen={openQ === "AQ29"} onClick={() => toggle("AQ29")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Hold a snowflake. The ways you can rotate and flip it so it looks the same form its point group (rotations and reflections about a fixed point). Now imagine a wallpaper — it also has translation symmetry (slide it and it looks the same). Space groups combine both: the rotational/reflective symmetry of the motif PLUS the translational symmetry of the lattice.
 </div>
 <p><b>Simple English:</b> A point group describes all symmetry operations (rotations, reflections, inversions) that leave at least one point fixed. There are 32 crystallographic point groups in 3D. A space group adds translational symmetry (lattice translations, screw axes, glide planes). There are exactly 230 space groups in 3D. Every crystal structure belongs to one of these 230 space groups. Space group determines many physical properties.</p>
 <div style={mb}>
 32 point groups (crystal classes){"\n"}
 230 space groups{"\n"}
 ZnTe (zinc blende): space group F-43m (No. 216){"\n"}
 Si (diamond): space group Fd-3m (No. 227){"\n"}
 NaCl (rock salt): space group Fm-3m (No. 225){"\n"}
 Point group of a cube: Oh (48 symmetry operations)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ30: What are Miller indices and how do you read them?" color={T.eo_photon} isOpen={openQ === "AQ30"} onClick={() => toggle("AQ30")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine slicing a loaf of bread. Miller indices (hkl) describe HOW you make the cut. (100) slices perpendicular to the x-axis. (110) slices diagonally through x and y. (111) slices diagonally through all three axes. The indices tell you the orientation of the crystal plane, which determines surface properties, cleavage, and X-ray diffraction patterns.
 </div>
 <p><b>Simple English:</b> Miller indices (hkl) specify a crystal plane by taking the reciprocals of the fractional intercepts with the crystal axes. If a plane cuts the x-axis at 1/h, y-axis at 1/k, and z-axis at 1/l (in units of lattice parameters), the Miller index is (hkl). Negative intercepts get a bar over the number. The spacing between parallel (hkl) planes is d_hkl, which determines diffraction angles via Bragg's law.</p>
 <div style={mb}>
 (100): intercepts at (1,∞,∞) → parallel to y and z{"\n"}
 (110): intercepts at (1,1,∞) → diagonal in xy{"\n"}
 (111): intercepts at (1,1,1) → diagonal through all axes{"\n"}
 {"\n"}
 For cubic: d_hkl = a/√(h²+k²+l²){"\n"}
 Bragg's law: 2d sinθ = nλ{"\n"}
 Si wafers: (100) orientation most common for electronics
 </div>
 </FAQAccordion>

 {/* ── AQ31-AQ33: Reciprocal Space ── */}

 <FAQAccordion title="AQ31: What IS reciprocal space? Why can't we just use real space?" color={T.eo_gap} isOpen={openQ === "AQ31"} onClick={() => toggle("AQ31")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Think of a musical chord. In "time space," you see a complicated oscillating wave. In "frequency space" (Fourier transform), you see three clean dots — one for each note. Reciprocal space is the frequency-domain version of a crystal. The messy repeating pattern in real space becomes elegant dots in reciprocal space, revealing the underlying periodicity.
 </div>
 <p><b>Simple English:</b> Reciprocal space (k-space) is the Fourier transform of the real-space lattice. Every crystal property that repeats with the lattice periodicity is naturally expressed in reciprocal space. Waves in the crystal (electrons, phonons, X-rays) are described by wavevectors k, which live in reciprocal space. X-ray diffraction patterns ARE reciprocal space images. Band structures plot E vs. k — that is reciprocal space. It is not just a mathematical trick; it is the natural language for periodic systems.</p>
 <div style={mb}>
 Real space vectors: a₁, a₂, a₃{"\n"}
 Reciprocal vectors: b₁ = 2π(a₂×a₃)/(a₁·a₂×a₃){"\n"}
 Property: aᵢ · bⱼ = 2πδᵢⱼ{"\n"}
 {"\n"}
 Reciprocal of FCC → BCC (and vice versa!){"\n"}
 Reciprocal of SC → SC{"\n"}
 Diffraction condition: Δk = G (reciprocal lattice vector)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ32: What is the Brillouin zone and why do we care about it?" color={T.eo_gap} isOpen={openQ === "AQ32"} onClick={() => toggle("AQ32")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> In a city with a repeating grid, you do not need to explore every block — just understand one block and the rest are copies. The Brillouin zone is that "one unique block" in reciprocal space. All the physics of electrons in the crystal is contained within this zone. Going outside it just takes you to a copy.
 </div>
 <p><b>Simple English:</b> The first Brillouin zone (BZ) is the Wigner-Seitz cell of the reciprocal lattice — the region of k-space closer to the origin than to any other reciprocal lattice point. Due to Bloch's theorem, all unique electron states can be labeled by k vectors within the first BZ. Band structures plot energy E(k) along high-symmetry paths in the BZ. High-symmetry points have special names (Γ, X, L, K, M, etc.).</p>
 <div style={mb}>
 FCC Brillouin zone: truncated octahedron{"\n"}
 High-symmetry points:{"\n"}
 Γ = (0,0,0) — zone center{"\n"}
 X = (1,0,0)π/a — zone face center{"\n"}
 L = (½,½,½)2π/a — zone corner{"\n"}
 K = (¾,¾,0)π/a — zone edge{"\n"}
 Band gap of Si: indirect Γ→X, 1.12 eV
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ33: What are k-points and why do DFT calculations need so many?" color={T.eo_gap} isOpen={openQ === "AQ33"} onClick={() => toggle("AQ33")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine measuring the average temperature of a room. You could put one thermometer in the center (1 k-point) and get a rough estimate, or place a grid of 100 thermometers throughout the room (10×10×10 k-grid) for an accurate average. k-points sample the Brillouin zone to compute properties like total energy, DOS, and charge density.
 </div>
 <p><b>Simple English:</b> In a DFT calculation, properties like total energy are integrals over the Brillouin zone: E = ∫E(k)dk. Since we cannot integrate analytically, we sample discrete k-points (usually a Monkhorst-Pack grid). More k-points = more accurate but more expensive. Metals need many more k-points than insulators because their Fermi surface has sharp features. Convergence testing means increasing k-points until the total energy stops changing.</p>
 <div style={mb}>
 Monkhorst-Pack grid: N₁ × N₂ × N₃ k-points{"\n"}
 Typical for bulk Si: 8×8×8 = 512 k-points{"\n"}
 With symmetry: reduces to ~60 irreducible k-points{"\n"}
 Metals: may need 20×20×20 or more{"\n"}
 Insulators: 4×4×4 often sufficient{"\n"}
 Convergence criterion: ΔE {"<"} 1 meV/atom
 </div>
 </FAQAccordion>

 {/* ── AQ34-AQ37: Band Theory ── */}

 <FAQAccordion title="AQ34: Where do energy bands come from? (From atoms to bands)" color={T.eo_photon} isOpen={openQ === "AQ34"} onClick={() => toggle("AQ34")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> One tuning fork has one frequency (one atomic energy level). Two coupled tuning forks split into two frequencies. N coupled tuning forks split into N closely-spaced frequencies — a "band" of frequencies. A crystal has ~10²³ atoms, so each atomic level splits into ~10²³ closely-spaced levels, forming a quasi-continuous energy band.
 </div>
 <p><b>Simple English:</b> Start with N isolated atoms, each with discrete energy levels. Bring them together to form a crystal. Their atomic orbitals overlap and split into bonding/antibonding combinations, just like in molecules. With N atoms, each atomic level splits into N molecular-orbital-like states. For N ~ 10²³, these N states are so closely spaced they form a continuous band. The bandwidth depends on the orbital overlap — greater overlap → wider band.</p>
 <div style={mb}>
 1 atom: discrete level E₀{"\n"}
 2 atoms: E₀ ± t (t = hopping integral){"\n"}
 N atoms: band from E₀ - 2t to E₀ + 2t{"\n"}
 Bandwidth W = 4t{"\n"}
 {"\n"}
 Si: 3s band width ≈ 12 eV{"\n"}
 Si: 3p band width ≈ 10 eV{"\n"}
 Band gap (between valence and conduction bands): 1.12 eV
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ35: What is the difference between direct and indirect band gaps?" color={T.eo_photon} isOpen={openQ === "AQ35"} onClick={() => toggle("AQ35")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine shooting a basketball. In a direct gap (like GaAs), the hoop is right above you — shoot straight up (photon carries energy, no momentum change needed). In an indirect gap (like Si), the hoop is across the court — you need someone to pass you the ball sideways (a phonon provides the momentum) while you also jump (photon provides energy). Much harder, much less probable.
 </div>
 <p><b>Simple English:</b> In a direct band gap, the valence band maximum (VBM) and conduction band minimum (CBM) occur at the same k-point. An electron can be excited by absorbing just a photon (which carries energy but negligible momentum). In an indirect gap, VBM and CBM are at different k-points. The transition requires both a photon (for energy) and a phonon (for momentum). This makes indirect transitions ~1000× less probable.</p>
 <div style={mb}>
 Direct gap materials: GaAs (1.42 eV), GaN (3.4 eV), CdTe (1.5 eV){"\n"}
 → Efficient light emitters → LEDs, lasers{"\n"}
 Indirect gap materials: Si (1.12 eV), Ge (0.66 eV), AlAs (2.16 eV){"\n"}
 → Poor light emitters but good for electronics{"\n"}
 {"\n"}
 ZnTe: direct gap = 2.26 eV (green light){"\n"}
 Si solar cells work despite indirect gap (thick absorber ~300 μm)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ36: What is effective mass and why does it differ from real mass?" color={T.eo_photon} isOpen={openQ === "AQ36"} onClick={() => toggle("AQ36")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> An electron in a crystal is like a swimmer in a pool. In vacuum, the swimmer moves freely with their true mass. In a pool with currents (the periodic potential of the crystal), the swimmer seems lighter (moves faster, as if the current helps) or heavier (current fights them). The effective mass encodes how the crystal potential modifies the electron's response to forces.
 </div>
 <p><b>Simple English:</b> In a crystal, an electron is not truly free — it interacts with all the ions. But remarkably, we can describe it as a FREE particle with a modified mass, called the effective mass m*. This m* comes from the band curvature: a sharply curved band means small m* (light, fast carrier), a flat band means large m* (heavy, slow carrier). Near the band edge, m* = ℏ²/(d²E/dk²).</p>
 <div style={mb}>
 m* = ℏ² / (d²E/dk²){"\n"}
 Sharply curved band → small m* → fast carrier{"\n"}
 Flat band → large m* → slow carrier{"\n"}
 {"\n"}
 GaAs electron m* = 0.067 mₑ (very light → fast){"\n"}
 Si electron m* = 0.26 mₑ (transverse){"\n"}
 GaAs hole m* = 0.45 mₑ (heavy hole){"\n"}
 Mobility: μ = eτ/m* → smaller m* → higher mobility
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ37: What is the Fermi level and why is it so important?" color={T.eo_photon} isOpen={openQ === "AQ37"} onClick={() => toggle("AQ37")}>
 <div style={{ background: T.eo_photon + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> The Fermi level is like the water line in a harbor. Below the line — everything is filled (occupied states). Above the line — empty (unoccupied states). The water line determines what is submerged and what is exposed. The Fermi level determines which states are filled with electrons and which are empty, and it controls essentially all electronic properties.
 </div>
 <p><b>Simple English:</b> The Fermi level (E_F) is the energy at which the probability of occupation is exactly 50% at any temperature. At T=0, all states below E_F are filled and all above are empty. In metals, E_F lies within a band (partially filled band = conductor). In semiconductors, E_F lies in the gap. In insulators, E_F lies in a large gap. Doping shifts E_F toward the conduction band (n-type) or valence band (p-type).</p>
 <div style={mb}>
 Fermi-Dirac distribution: f(E) = 1/(e^((E-E_F)/k_BT) + 1){"\n"}
 At T = 0: f(E) = 1 if E {"<"} E_F, 0 if E {">"} E_F{"\n"}
 At T = 300K: k_BT = 0.026 eV (thermal smearing){"\n"}
 {"\n"}
 Metal (Cu): E_F = 7.0 eV (inside the band){"\n"}
 Intrinsic Si: E_F = mid-gap ≈ 0.56 eV above VBM{"\n"}
 n-type Si: E_F shifts toward CBM
 </div>
 </FAQAccordion>

 {/* ── AQ38-AQ40: DOS and Material Classes ── */}

 <FAQAccordion title="AQ38: What does the density of states (DOS) actually measure?" color={T.eo_gap} isOpen={openQ === "AQ38"} onClick={() => toggle("AQ38")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a concert hall with seats at different heights (energies). DOS tells you how many seats exist at each height level. Many seats at a given energy = high DOS = many electrons can exist at that energy. No seats at a given energy = zero DOS = a gap. The DOS is like a histogram of available quantum states vs. energy.
 </div>
 <p><b>Simple English:</b> The density of states g(E) counts the number of available quantum states per unit energy per unit volume. It is the most fundamental quantity connecting band theory to measurable properties. The number of electrons at energy E is g(E)×f(E), where f(E) is the Fermi function. Integrating g(E)f(E) gives total electron density. DOS determines electronic specific heat, electrical conductivity, optical absorption, and more.</p>
 <div style={mb}>
 DOS: g(E) = number of states per unit energy per unit volume{"\n"}
 Total electrons: n = ∫ g(E)f(E) dE{"\n"}
 {"\n"}
 Free electron DOS (3D): g(E) = (1/2π²)(2m/ℏ²)^(3/2) √E{"\n"}
 Free electron DOS (2D): g(E) = m/(πℏ²) (constant!){"\n"}
 Free electron DOS (1D): g(E) ∝ 1/√E (van Hove singularity){"\n"}
 At band gap: g(E) = 0 (no states available)
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ39: Why do metals conduct electricity and insulators don't?" color={T.eo_gap} isOpen={openQ === "AQ39"} onClick={() => toggle("AQ39")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Imagine a parking garage. Metals have a half-full level — cars (electrons) can easily rearrange and move (conduct). Insulators have completely full levels with a huge empty gap above — no car can move because there is no empty space, and jumping to the next level requires too much energy. Semiconductors have a modest gap — a few cars can jump with a thermal boost.
 </div>
 <p><b>Simple English:</b> Conduction requires that electrons change their states in response to an electric field — they need to accelerate to slightly higher energy/momentum states. In a metal, the band is partially filled, so empty states are immediately available just above the Fermi level. In an insulator, the band is completely filled. An electron cannot accelerate because all nearby states are occupied (Pauli exclusion). It would need to jump across the large band gap, which requires enormous energy.</p>
 <div style={mb}>
 Metal (Cu): no gap, σ ≈ 5.9 × 10⁷ S/m{"\n"}
 Semiconductor (Si): Eg = 1.12 eV, σ ≈ 10⁻⁴ S/m (intrinsic){"\n"}
 Insulator (diamond): Eg = 5.5 eV, σ ≈ 10⁻¹⁴ S/m{"\n"}
 Insulator (SiO₂): Eg = 9 eV, σ ≈ 10⁻¹⁸ S/m{"\n"}
 {"\n"}
 Conductivity range: 10²⁵ orders of magnitude!{"\n"}
 This is the largest variation of any physical property.
 </div>
 </FAQAccordion>

 <FAQAccordion title="AQ40: What really distinguishes a semiconductor from an insulator?" color={T.eo_gap} isOpen={openQ === "AQ40"} onClick={() => toggle("AQ40")}>
 <div style={{ background: T.eo_gap + "10", borderRadius: 10, padding: 14, marginBottom: 10 }}>
 <b> Analogy:</b> Both semiconductors and insulators have a gap (a door between floors). In a semiconductor, the door is low enough that thermal energy (body heat) can occasionally push electrons through (~1 eV). In an insulator, the door is so high ({">"}4 eV) that thermal energy is hopeless. But there is no sharp line — it is a sliding scale. We call materials "semiconductors" when we can usefully control their conductivity by doping, temperature, or light.
 </div>
 <p><b>Simple English:</b> There is no fundamental physical difference — it is a matter of band gap size. Convention: band gap below ~3-4 eV is "semiconductor," above is "insulator." But the real distinction is practical: can we use the material in electronic devices? If doping can meaningfully change its conductivity, it is a useful semiconductor. Diamond (5.5 eV) is an insulator, but when doped with boron it becomes a p-type semiconductor. GaN (3.4 eV) was once called a "wide-gap semiconductor," now essential for blue LEDs.</p>
 <div style={mb}>
 Semiconductor examples:{"\n"}
 Si: 1.12 eV, Ge: 0.66 eV, GaAs: 1.42 eV{"\n"}
 ZnTe: 2.26 eV, GaN: 3.4 eV, SiC: 3.3 eV{"\n"}
 {"\n"}
 Insulator examples:{"\n"}
 Diamond: 5.5 eV, SiO₂: 9.0 eV, Al₂O₃: 8.8 eV{"\n"}
 {"\n"}
 At T=300K: k_BT = 0.026 eV{"\n"}
 Carrier concentration ∝ e^(-Eg/2k_BT){"\n"}
 Si: nᵢ ≈ 10¹⁰/cm³ vs Diamond: nᵢ ≈ 10⁻²⁷/cm³
 </div>
 </FAQAccordion>

 </div>
 );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTIONS REGISTRY — 22 sections organized as a story in 5 acts
// ═══════════════════════════════════════════════════════════════════════════

const BLOCKS = [
 { id: "atom", label: "What is an Atom?", color: T.eo_core },
 { id: "bonds", label: "How Atoms Bond", color: T.eo_valence },
 { id: "crystals", label: "From Molecules to Crystals", color: T.eo_cond },
 { id: "properties", label: "Properties of the Crystal", color: T.eo_photon },
 { id: "design", label: "Can We Make It?", color: T.eo_e },
 { id: "bigq", label: "Big Questions", color: T.eo_gap },
];

const ELECTRON_SECTIONS = [
 // ── Act 1: What is an Atom? ──
 { id: "atomicModels", block: "atom", label: "Atomic Models", icon: "", color: T.eo_core, Component: AtomicModelsSection },
 { id: "waveDuality", block: "atom", label: "Wave-Particle Duality", icon: "", color: T.eo_core, Component: WaveDualitySection },
 { id: "schrodinger", block: "atom", label: "Schrödinger Equation", icon: "", color: T.eo_core, Component: SchrodingerSection },
 { id: "quantumNums", block: "atom", label: "Quantum Numbers", icon: "", color: T.eo_core, Component: QuantumNumbersSection },
 { id: "aufbau", block: "atom", label: "Aufbau & Pauli", icon: "", color: T.eo_core, Component: AufbauPrincipleSection },
 { id: "periodic", block: "atom", label: "Periodic Trends", icon: "", color: T.eo_core, Component: PeriodicTrendsSection },

 // ── Act 2: How Atoms Bond ──
 { id: "chemBonding", block: "bonds", label: "Chemical Bonding", icon: "", color: T.eo_valence, Component: ChemicalBondingSection },
 { id: "hybridization", block: "bonds", label: "Hybridization", icon: "", color: T.eo_valence, Component: HybridizationSection },
 { id: "electronOrigins", block: "bonds", label: "How Atoms Bond", icon: "", color: T.eo_valence, Component: ElectronOriginsZnTeSection },

 // ── Act 3: From Molecules to Crystals ──
 { id: "molecularOrb", block: "crystals", label: "Molecular Orbitals", icon: "", color: T.eo_cond, Component: MolecularOrbitalSection },
 { id: "symmetry", block: "crystals", label: "Crystal Symmetry", icon: "", color: T.eo_cond, Component: CrystalSymmetrySection },
 { id: "reciprocal", block: "crystals", label: "Reciprocal Space", icon: "", color: T.eo_cond, Component: ReciprocalSpaceSection },

 // ── Act 4: Properties of the Crystal ──
 { id: "bands", block: "properties", label: "Energy Bands", icon: "", color: T.eo_photon, Component: BandSection },
 { id: "dos", block: "properties", label: "Density of States", icon: "", color: T.eo_photon, Component: DensityOfStatesSection },
 { id: "materialClasses", block: "properties", label: "Material Classes", icon: "", color: T.eo_photon, Component: MaterialClassesSection },
 { id: "twoDMaterials", block: "properties", label: "2D Materials", icon: "", color: T.eo_photon, Component: TwoDMaterialsSection },

 // ── Act 5: Can We Make It? ──
 { id: "thermoBasics", block: "design", label: "Thermodynamics", icon: "", color: T.eo_e, Component: ThermodynamicsSection },
 { id: "kinetics", block: "design", label: "Kinetics", icon: "", color: T.eo_e, Component: KineticsSection },
 { id: "phase", block: "design", label: "Phase Diagrams", icon: "", color: T.eo_e, Component: PhaseDiagramSection },
 { id: "chemPot", block: "design", label: "Chemical Potential", icon: "", color: T.eo_e, Component: ChemicalPotentialSection },
 { id: "atomToDevice", block: "design", label: "From Atom to Device", icon: "", color: T.eo_e, Component: AtomToDeviceSection },

 // ── Act 6: Big Questions ──
 { id: "bigQuestions", block: "bigq", label: "Big Questions", icon: "", color: T.eo_gap, Component: AtomsBigQuestionsSection },
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
