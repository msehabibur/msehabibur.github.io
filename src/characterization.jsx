import React, { useState, useEffect, useMemo } from "react";

/* ─── Theme ─── */
const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0", gold: "#b8860b",
  eo_e: "#2563eb", eo_hole: "#ea580c", eo_photon: "#ca8a04",
  eo_valence: "#059669", eo_core: "#7c3aed", eo_gap: "#dc2626", eo_cond: "#0284c7",
};

/* ─── Characterization colors ─── */
const C = {
  struct: "#0e7490",
  surface: "#7c3aed",
  spec: "#059669",
  micro: "#2563eb",
  adv: "#dc2626",
  accent: "#d97706",
};

/* ─── Helper Components ─── */
function Card({ title, color, formula, children }) {
  return (
    <div style={{ background: T.panel, border: `1.5px solid ${(color || T.border)}44`, borderLeft: `4px solid ${color || "#2563eb"}`, borderRadius: 10, padding: "16px 18px" }}>
      {(title || formula) && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          {title && <div style={{ fontSize: 12, letterSpacing: 2, color: color || "#2563eb", textTransform: "uppercase", fontWeight: 700 }}>{title}</div>}
          {formula && <div style={{ fontFamily: "'Georgia',serif", fontSize: 14, color: T.ink, background: (color || "#2563eb") + "11", padding: "2px 10px", borderRadius: 4, border: `1px solid ${(color || "#2563eb")}33` }}>{formula}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit, format }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{format ? format(value) : value.toFixed(2)}{unit || ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: color }} />
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

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
      <span style={{ color: T.ink, fontFamily: "monospace" }}>{eq}</span>
      <span style={{ color: color || T.eo_e, fontWeight: 700, fontFamily: "monospace" }}>{result}</span>
    </div>
  );
}

function AnalogyBox({ text }) {
  return (
    <div style={{ background: C.accent + "08", border: `1px solid ${C.accent}22`, borderLeft: `3px solid ${C.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: C.accent, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Simple Analogy</div>
      <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.6, fontStyle: "italic" }}>{text}</div>
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

/* ════════════════════════════════════════════════════════════════════
   BLOCK 1 — STRUCTURAL TECHNIQUES
   ════════════════════════════════════════════════════════════════════ */

/* ─── 1. XRD ─── */
function XRDSection() {
  const [d, setD] = useState(2.87);
  const [lam, setLam] = useState(1.5406);
  const [n, setN] = useState(1);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const theta = Math.asin((n * lam) / (2 * d));
  const thetaDeg = (theta * 180) / Math.PI;
  const twoTheta = 2 * thetaDeg;
  const valid = !isNaN(theta) && isFinite(theta);

  const wavePhase = animFrame * 0.12;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Tennis balls bouncing off a picket fence at specific angles -- only at certain angles do they all bounce back in sync (constructive interference)." />

      <Card title="Bragg's Law" color={C.struct} formula="nλ = 2d·sin(θ)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          X-ray diffraction measures the spacing between crystal planes. When X-rays hit parallel planes of atoms,
          they reflect. Constructive interference happens only when the extra path length (2d sinθ) equals an
          integer number of wavelengths.
        </div>

        {/* SVG Animation */}
        <svg viewBox="0 0 420 240" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Crystal planes */}
          {[0, 1, 2].map(i => (
            <g key={i}>
              <line x1={80} y1={100 + i * 50} x2={380} y2={100 + i * 50} stroke={C.struct + "44"} strokeWidth={1} strokeDasharray="4,4" />
              {[0, 1, 2, 3, 4, 5, 6].map(j => (
                <circle key={j} cx={100 + j * 45} cy={100 + i * 50} r={5} fill={C.struct + "66"} stroke={C.struct} strokeWidth={1} />
              ))}
              {i < 2 && (
                <text x={45} y={128 + i * 50} fontSize={10} fill={T.muted} textAnchor="middle">d</text>
              )}
              {i < 2 && (
                <line x1={55} y1={102 + i * 50} x2={55} y2={148 + i * 50} stroke={C.accent} strokeWidth={1} markerEnd="url(#arrow)" />
              )}
            </g>
          ))}

          {/* d-spacing bracket */}
          <defs>
            <marker id="arrow" markerWidth={6} markerHeight={4} refX={3} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4" fill={C.accent} />
            </marker>
          </defs>

          {/* Incoming X-ray beam */}
          {valid && (() => {
            const angle = theta;
            const hitX = 200;
            const hitY = 100;
            const beamLen = 120;
            const sx = hitX - beamLen * Math.cos(angle);
            const sy = hitY - beamLen * Math.sin(angle);
            const phase = wavePhase;
            return (
              <g>
                {/* Incoming wavefronts */}
                {[0, 1, 2, 3, 4].map(i => {
                  const frac = ((phase + i * 0.25) % 1.0);
                  const wx = sx + (hitX - sx) * frac;
                  const wy = sy + (hitY - sy) * frac;
                  const perpX = -Math.sin(angle) * 8;
                  const perpY = Math.cos(angle) * 8;
                  return (
                    <line key={`in${i}`} x1={wx - perpX} y1={wy - perpY} x2={wx + perpX} y2={wy + perpY}
                      stroke={C.struct} strokeWidth={1.5} opacity={0.4 + 0.4 * (1 - frac)} />
                  );
                })}
                <line x1={sx} y1={sy} x2={hitX} y2={hitY} stroke={C.struct} strokeWidth={1.5} />
                <text x={sx + 10} y={sy - 5} fontSize={10} fill={C.struct} fontWeight={700}>X-ray</text>

                {/* Reflected beam */}
                {(() => {
                  const rx = hitX + beamLen * Math.cos(angle);
                  const ry = hitY - beamLen * Math.sin(angle);
                  return (
                    <g>
                      <line x1={hitX} y1={hitY} x2={rx} y2={ry} stroke={C.accent} strokeWidth={1.5} />
                      {[0, 1, 2, 3].map(i => {
                        const frac = ((phase + i * 0.25) % 1.0);
                        const wx = hitX + (rx - hitX) * frac;
                        const wy = hitY + (ry - hitY) * frac;
                        const perpX = Math.sin(angle) * 8;
                        const perpY = Math.cos(angle) * 8;
                        return (
                          <line key={`out${i}`} x1={wx - perpX} y1={wy - perpY} x2={wx + perpX} y2={wy + perpY}
                            stroke={C.accent} strokeWidth={1.5} opacity={0.4 + 0.4 * (1 - frac)} />
                        );
                      })}
                      <text x={rx - 10} y={ry - 5} fontSize={10} fill={C.accent} fontWeight={700}>Diffracted</text>
                    </g>
                  );
                })()}

                {/* 2nd plane reflection */}
                {(() => {
                  const hit2X = 200 + d * 8;
                  const hit2Y = 150;
                  const sx2 = hit2X - beamLen * Math.cos(angle);
                  const sy2 = hit2Y - beamLen * Math.sin(angle);
                  return (
                    <line x1={sx2} y1={sy2} x2={hit2X} y2={hit2Y} stroke={C.struct} strokeWidth={0.8} opacity={0.4} strokeDasharray="3,3" />
                  );
                })()}

                {/* Angle arc */}
                <path d={`M ${hitX + 30} ${hitY} A 30 30 0 0 0 ${hitX + 30 * Math.cos(angle)} ${hitY - 30 * Math.sin(angle)}`}
                  fill="none" stroke={C.accent} strokeWidth={1} />
                <text x={hitX + 36} y={hitY - 8} fontSize={9} fill={C.accent}>θ</text>
              </g>
            );
          })()}

          {!valid && (
            <text x={210} y={60} textAnchor="middle" fontSize={12} fill={T.eo_gap}>
              nλ {">"} 2d: no diffraction possible
            </text>
          )}

          <text x={210} y={230} textAnchor="middle" fontSize={10} fill={T.muted}>
            Bragg diffraction from crystal planes (d = {d.toFixed(2)} Å)
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="d-spacing" value={d} min={1.0} max={5.0} step={0.01} onChange={setD} color={C.struct} unit=" Å" />
            <SliderRow label="Wavelength λ" value={lam} min={0.5} max={2.3} step={0.001} onChange={setLam} color={C.accent}
              unit=" Å" format={v => v === 1.5406 ? "1.5406 (Cu Kα)" : v === 0.7107 ? "0.7107 (Mo Kα)" : v.toFixed(4)} />
            <SliderRow label="Order n" value={n} min={1} max={5} step={1} onChange={setN} color={C.struct} format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`nλ = ${n} × ${lam.toFixed(4)}`} result={`${(n * lam).toFixed(4)} Å`} color={C.struct} />
            <CalcRow eq={`2d = 2 × ${d.toFixed(2)}`} result={`${(2 * d).toFixed(2)} Å`} color={C.struct} />
            <CalcRow eq={`sin(θ) = ${(n * lam).toFixed(4)} / ${(2 * d).toFixed(2)}`}
              result={valid ? (Math.sin(theta)).toFixed(4) : "N/A"} color={C.struct} />
            <CalcRow eq={`θ (Bragg angle)`} result={valid ? `${thetaDeg.toFixed(2)}°` : "No solution"} color={C.accent} />
            <CalcRow eq={`2θ (measured)`} result={valid ? `${twoTheta.toFixed(2)}°` : "No solution"} color={C.accent} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="BRAGG ANGLE θ" value={valid ? `${thetaDeg.toFixed(2)}°` : "---"} color={C.struct} sub="angle of incidence" />
          <ResultBox label="2θ POSITION" value={valid ? `${twoTheta.toFixed(2)}°` : "---"} color={C.accent} sub="detector angle" />
          <ResultBox label="PLANE SPACING" value={`${d.toFixed(3)} Å`} color={C.struct} sub="crystal lattice" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Crystal structure, phase ID, lattice parameters" />
          <InfoRow label="Resolution" value="~0.01° 2θ (high-res), d-spacing to 0.001 Å" />
          <InfoRow label="Sample" value="Powders, thin films, single crystals" />
          <InfoRow label="Limitation" value="Needs crystalline material; amorphous gives broad humps" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 2. EBSD ─── */
function EBSDSection() {
  const [misor, setMisor] = useState(15);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  const grainColors = useMemo(() => {
    const cols = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c", "#f39c12", "#e91e63", "#00bcd4"];
    return cols;
  }, []);

  const grains = useMemo(() => {
    const seeds = [];
    for (let i = 0; i < 12; i++) {
      seeds.push({ x: 60 + (i % 4) * 90 + (Math.sin(i * 3.7) * 20), y: 40 + Math.floor(i / 4) * 65 + (Math.cos(i * 2.3) * 15), col: grainColors[i % grainColors.length], euler: [Math.floor(Math.random() * 360), Math.floor(Math.random() * 90), Math.floor(Math.random() * 360)] });
    }
    return seeds;
  }, [grainColors]);

  const gbCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < grains.length; i++) {
      for (let j = i + 1; j < grains.length; j++) {
        const dist = Math.sqrt((grains[i].x - grains[j].x) ** 2 + (grains[i].y - grains[j].y) ** 2);
        if (dist < 100) {
          const angleDiff = Math.abs(grains[i].euler[0] - grains[j].euler[0]) % 180;
          if (angleDiff > misor) count++;
        }
      }
    }
    return count;
  }, [grains, misor]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Each crystal grain has a unique fingerprint -- like a thumbprint, the Kikuchi pattern reveals its exact orientation. EBSD reads these fingerprints across the entire surface." />

      <Card title="Electron Backscatter Diffraction" color={C.struct} formula="Kikuchi pattern → Euler angles (φ1, Φ, φ2)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          A focused electron beam hits a tilted (70°) sample. Backscattered electrons diffract from crystal planes, forming
          Kikuchi bands on a phosphor screen. Indexing these bands gives the crystal orientation at each pixel, building an
          orientation map (IPF = Inverse Pole Figure).
        </div>

        {/* SVG: Grain orientation map */}
        <svg viewBox="0 0 420 240" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Grain map */}
          {grains.map((g, i) => {
            const r = 28 + Math.sin(i * 1.7) * 8;
            const pulse = 1 + 0.02 * Math.sin(animFrame * 0.1 + i);
            return (
              <g key={i}>
                <ellipse cx={g.x} cy={g.y} rx={r * pulse * 1.1} ry={r * pulse * 0.9}
                  fill={g.col + "55"} stroke={g.col} strokeWidth={1.5}
                  transform={`rotate(${g.euler[0] * 0.5}, ${g.x}, ${g.y})`} />
                <text x={g.x} y={g.y + 3} textAnchor="middle" fontSize={7} fill={T.ink}>
                  {g.euler[0]}°
                </text>
              </g>
            );
          })}

          {/* Grain boundaries (high-angle) */}
          {grains.map((g1, i) =>
            grains.slice(i + 1).map((g2, j) => {
              const dist = Math.sqrt((g1.x - g2.x) ** 2 + (g1.y - g2.y) ** 2);
              const angleDiff = Math.abs(g1.euler[0] - g2.euler[0]) % 180;
              if (dist < 100 && angleDiff > misor) {
                const mx = (g1.x + g2.x) / 2;
                const my = (g1.y + g2.y) / 2;
                return (
                  <line key={`${i}-${j}`} x1={g1.x} y1={g1.y} x2={g2.x} y2={g2.y}
                    stroke={T.ink} strokeWidth={angleDiff > 40 ? 2 : 1} opacity={0.4}
                    strokeDasharray={angleDiff < 30 ? "3,3" : "none"} />
                );
              }
              return null;
            })
          )}

          {/* Scanning beam indicator */}
          {(() => {
            const scanX = 60 + (animFrame % 50) * 6.4;
            const scanY = 30 + Math.floor((animFrame % 100) / 50) * 90;
            return (
              <g>
                <line x1={scanX} y1={5} x2={scanX} y2={scanY} stroke={C.struct} strokeWidth={1} opacity={0.6} />
                <circle cx={scanX} cy={scanY} r={3} fill={C.struct} opacity={0.8}>
                  <animate attributeName="r" values="2;4;2" dur="0.5s" repeatCount="indefinite" />
                </circle>
                <text x={scanX + 6} y={12} fontSize={8} fill={C.struct}>e-beam</text>
              </g>
            );
          })()}

          {/* IPF triangle legend */}
          <g transform="translate(340, 180)">
            <polygon points="0,0 50,0 25,-43" fill="none" stroke={T.ink} strokeWidth={1} />
            <circle cx={0} cy={0} r={3} fill="#e74c3c" />
            <circle cx={50} cy={0} r={3} fill="#3498db" />
            <circle cx={25} cy={-43} r={3} fill="#2ecc71" />
            <text x={-3} y={12} fontSize={7} fill={T.muted}>[001]</text>
            <text x={43} y={12} fontSize={7} fill={T.muted}>[101]</text>
            <text x={18} y={-47} fontSize={7} fill={T.muted}>[111]</text>
            <text x={15} y={25} fontSize={8} fill={T.muted}>IPF key</text>
          </g>

          <text x={210} y={232} textAnchor="middle" fontSize={10} fill={T.muted}>
            Grain orientation map (misorientation threshold: {misor}°)
          </text>
        </svg>

        <SliderRow label="Misorientation threshold" value={misor} min={2} max={60} step={1} onChange={setMisor} color={C.struct} unit="°" format={v => v.toString()} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
          <ResultBox label="GRAINS" value={grains.length} color={C.struct} sub="mapped" />
          <ResultBox label="HIGH-ANGLE GBs" value={gbCount} color={C.accent} sub={`> ${misor}°`} />
          <ResultBox label="ANGULAR RES." value="~0.5°" color={C.struct} sub="typical" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Crystal orientation, texture, grain boundaries" />
          <InfoRow label="Spatial resolution" value="~20-50 nm (FEG-SEM)" />
          <InfoRow label="Sample" value="Polished flat surface, conductive" />
          <InfoRow label="Limitation" value="Surface technique (~50 nm depth); needs good polish" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 3. TEM Diffraction (SAED) ─── */
function TEMDiffractionSection() {
  const [camL, setCamL] = useState(500);
  const [voltage, setVoltage] = useState(200);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 60);
    return () => clearInterval(id);
  }, []);

  const lam = 12.264 / Math.sqrt(voltage * 1000 * (1 + voltage * 1000 * 0.9785e-6));
  const d = 2.87;
  const R = lam * camL * 10 / d;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Like a projector shining through an ultra-thin slide -- the electrons pass through and form a pattern of dots on the screen, each dot revealing a set of crystal planes." />

      <Card title="Selected Area Electron Diffraction" color={C.struct} formula="Rd = λL (camera equation)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          In SAED, a parallel electron beam passes through a thin specimen. The diffracted beams form spots on the
          screen at distance R from the central beam. The reciprocal lattice is directly imaged: Rd = λL where
          R = spot distance, d = plane spacing, λ = electron wavelength, L = camera length.
        </div>

        {/* SVG: Diffraction pattern */}
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* TEM column schematic - left */}
          <g transform="translate(30, 10)">
            <text x={40} y={10} textAnchor="middle" fontSize={9} fill={C.struct} fontWeight={700}>TEM Column</text>
            {/* Electron gun */}
            <polygon points="25,20 55,20 40,30" fill={C.struct + "44"} stroke={C.struct} strokeWidth={1} />
            <text x={70} y={28} fontSize={7} fill={T.muted}>gun</text>
            {/* Beam */}
            <line x1={40} y1={30} x2={40} y2={90} stroke={C.struct} strokeWidth={1.5} />
            {/* Condenser lens */}
            <ellipse cx={40} cy={50} rx={20} ry={4} fill="none" stroke={C.accent} strokeWidth={1} />
            <text x={70} y={53} fontSize={7} fill={T.muted}>cond.</text>
            {/* Specimen */}
            <rect x={25} y={88} width={30} height={4} fill={C.struct + "66"} stroke={C.struct} strokeWidth={1} />
            <text x={70} y={93} fontSize={7} fill={T.muted}>specimen</text>
            {/* Objective lens */}
            <ellipse cx={40} cy={110} rx={22} ry={4} fill="none" stroke={C.accent} strokeWidth={1} />
            {/* SA aperture */}
            <rect x={30} y={125} width={8} height={3} fill={T.ink} />
            <rect x={42} y={125} width={8} height={3} fill={T.ink} />
            <text x={70} y={130} fontSize={7} fill={T.muted}>SA apt.</text>
            {/* Diffracted beams */}
            <line x1={40} y1={92} x2={40} y2={200} stroke={C.struct} strokeWidth={1} />
            <line x1={40} y1={92} x2={55} y2={200} stroke={C.accent} strokeWidth={0.8} opacity={0.6} />
            <line x1={40} y1={92} x2={25} y2={200} stroke={C.accent} strokeWidth={0.8} opacity={0.6} />
            {/* Screen */}
            <rect x={15} y={198} width={50} height={4} fill={C.struct + "22"} stroke={C.struct} strokeWidth={1} />
            <text x={70} y={204} fontSize={7} fill={T.muted}>screen</text>
            {/* Labels */}
            <text x={5} y={150} fontSize={7} fill={C.accent}>L</text>
            <line x1={12} y1={95} x2={12} y2={198} stroke={C.accent} strokeWidth={0.5} strokeDasharray="2,2" />
          </g>

          {/* Diffraction pattern - right */}
          <g transform="translate(250, 130)">
            <circle cx={0} cy={0} r={95} fill="#000011" stroke={T.border} strokeWidth={1} />
            {/* Reciprocal lattice spots */}
            {[-3, -2, -1, 0, 1, 2, 3].map(h =>
              [-3, -2, -1, 0, 1, 2, 3].map(k => {
                const rr = Math.sqrt(h * h + k * k);
                if (rr > 3.2) return null;
                const spotR = rr * R * 0.15;
                const spotX = h * R * 0.15;
                const spotY = k * R * 0.15;
                const intensity = Math.max(0.2, 1 - rr * 0.2);
                const pulse = 1 + 0.15 * Math.sin(animFrame * 0.08 + h + k);
                const size = h === 0 && k === 0 ? 5 : 3 * pulse * intensity;
                return (
                  <circle key={`${h}${k}`} cx={spotX} cy={spotY} r={size}
                    fill={h === 0 && k === 0 ? "#ffffff" : C.accent}
                    opacity={intensity} />
                );
              })
            )}
            {/* R measurement */}
            <line x1={0} y1={0} x2={R * 0.15} y2={0} stroke={C.struct} strokeWidth={0.8} strokeDasharray="2,2" />
            <text x={R * 0.075} y={-5} textAnchor="middle" fontSize={8} fill={C.struct}>R</text>
          </g>

          <text x={250} y={248} textAnchor="middle" fontSize={9} fill={T.muted}>
            SAED pattern (R = {R.toFixed(1)} mm for d = {d} Å)
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Camera length L" value={camL} min={100} max={2000} step={10} onChange={setCamL} color={C.struct} unit=" mm" format={v => v.toString()} />
            <SliderRow label="Accelerating voltage" value={voltage} min={80} max={300} step={10} onChange={setVoltage} color={C.accent} unit=" kV" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`λ (rel.) = 12.264/√(eV*(1+...))`} result={`${(lam * 1000).toFixed(4)} pm`} color={C.struct} />
            <CalcRow eq={`R = λL/d = ${(lam).toFixed(5)}×${camL}/${d}`} result={`${R.toFixed(2)} mm`} color={C.accent} />
            <CalcRow eq={`d from R: d = λL/R`} result={`${d.toFixed(2)} Å`} color={C.struct} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="λ ELECTRON" value={`${(lam * 1000).toFixed(3)} pm`} color={C.struct} sub={`at ${voltage} kV`} />
          <ResultBox label="SPOT DISTANCE R" value={`${R.toFixed(1)} mm`} color={C.accent} sub={`d = ${d} Å`} />
          <ResultBox label="CAMERA LENGTH" value={`${camL} mm`} color={C.struct} sub="adjustable" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Crystal structure, orientation, zone axis" />
          <InfoRow label="Resolution" value="~0.1 nm (HRTEM lattice fringes)" />
          <InfoRow label="Sample" value="<100 nm thin foil or particles" />
          <InfoRow label="Limitation" value="Tedious sample prep; small analyzed area" />
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BLOCK 2 — SURFACE & COMPOSITION
   ════════════════════════════════════════════════════════════════════ */

/* ─── 4. XPS ─── */
function XPSSection() {
  const [source, setSource] = useState(1486.6);
  const [eBind, setEBind] = useState(284.6);
  const [phi, setPhi] = useState(4.5);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const eKin = source - eBind - phi;
  const valid = eKin > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Einstein's photoelectric effect with X-rays -- shine X-rays on a surface, knock out core electrons, and measure their kinetic energy to figure out which elements are there and their chemical state." />

      <Card title="X-ray Photoelectron Spectroscopy" color={C.surface} formula="E_bind = hν - E_kin - φ">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          XPS irradiates a surface with monochromatic X-rays. Core electrons are ejected with kinetic energy
          E_kin = hν - E_bind - φ (work function). By measuring E_kin, we determine binding energy,
          identifying elements and their oxidation states. Surface-sensitive: top ~5-10 nm.
        </div>

        <svg viewBox="0 0 420 280" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Atom model */}
          <g transform="translate(120, 140)">
            {/* Nucleus */}
            <circle cx={0} cy={0} r={12} fill={C.surface + "44"} stroke={C.surface} strokeWidth={1.5} />
            <text x={0} y={3} textAnchor="middle" fontSize={8} fill={C.surface} fontWeight={700}>+</text>
            {/* Core shell */}
            <circle cx={0} cy={0} r={30} fill="none" stroke={C.surface + "44"} strokeWidth={1} strokeDasharray="3,3" />
            <text x={35} y={-25} fontSize={7} fill={T.muted}>1s (core)</text>
            {/* Valence shell */}
            <circle cx={0} cy={0} r={55} fill="none" stroke={C.spec + "44"} strokeWidth={1} strokeDasharray="3,3" />
            <text x={55} y={-50} fontSize={7} fill={T.muted}>valence</text>
            {/* Core electrons */}
            {[0, 180].map((ang, i) => {
              const rad = (ang * Math.PI) / 180;
              return (
                <circle key={i} cx={30 * Math.cos(rad)} cy={30 * Math.sin(rad)} r={3}
                  fill={C.surface} opacity={i === 0 ? 0.3 + 0.7 * Math.max(0, 1 - animFrame / 40) : 1} />
              );
            })}
            {/* Valence electrons */}
            {[0, 72, 144, 216, 288].map((ang, i) => {
              const rad = ((ang + animFrame * 0.5) * Math.PI) / 180;
              return (
                <circle key={i} cx={55 * Math.cos(rad)} cy={55 * Math.sin(rad)} r={2.5} fill={C.spec} opacity={0.7} />
              );
            })}
          </g>

          {/* X-ray photon incoming */}
          {(() => {
            const phase = animFrame % 60;
            const startX = 10;
            const startY = 70;
            const endX = 95;
            const endY = 130;
            if (phase < 30) {
              const t = phase / 30;
              const cx = startX + (endX - startX) * t;
              const cy = startY + (endY - startY) * t;
              return (
                <g>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={C.accent} strokeWidth={1} strokeDasharray="4,4" />
                  {/* Wavy photon */}
                  {[0, 1, 2, 3].map(i => {
                    const px = cx - i * 8 * (endX - startX) / 80;
                    const py = cy - i * 8 * (endY - startY) / 80;
                    const off = Math.sin(i * 2 + animFrame * 0.3) * 4;
                    return <circle key={i} cx={px + off} cy={py} r={2} fill={C.accent} opacity={0.7 - i * 0.15} />;
                  })}
                  <text x={startX + 5} y={startY - 5} fontSize={9} fill={C.accent} fontWeight={700}>hν = {source} eV</text>
                </g>
              );
            }
            return null;
          })()}

          {/* Ejected photoelectron */}
          {(() => {
            const phase = animFrame % 60;
            if (phase >= 25 && valid) {
              const t = Math.min(1, (phase - 25) / 25);
              const ex = 90 + t * 180;
              const ey = 130 - t * 100;
              return (
                <g>
                  <circle cx={ex} cy={ey} r={3} fill={C.surface} />
                  <line x1={90} y1={130} x2={ex} y2={ey} stroke={C.surface} strokeWidth={1} strokeDasharray="2,2" opacity={0.5} />
                  <text x={ex + 5} y={ey - 5} fontSize={8} fill={C.surface}>e⁻ (E_kin = {eKin.toFixed(1)} eV)</text>
                </g>
              );
            }
            return null;
          })()}

          {/* XPS Spectrum */}
          <g transform="translate(240, 30)">
            <text x={80} y={0} textAnchor="middle" fontSize={9} fill={C.surface} fontWeight={700}>XPS Spectrum</text>
            <rect x={0} y={5} width={160} height={100} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            {/* Axes */}
            <line x1={15} y1={95} x2={150} y2={95} stroke={T.ink} strokeWidth={0.8} />
            <line x1={15} y1={95} x2={15} y2={15} stroke={T.ink} strokeWidth={0.8} />
            <text x={80} y={108} textAnchor="middle" fontSize={7} fill={T.muted}>Binding Energy (eV)</text>
            <text x={5} y={55} fontSize={7} fill={T.muted} transform="rotate(-90,5,55)">Counts</text>
            {/* Peaks */}
            {[
              { be: 284.6, h: 60, label: "C 1s", w: 6 },
              { be: 530, h: 45, label: "O 1s", w: 7 },
              { be: 100, h: 30, label: "Si 2p", w: 5 },
              { be: eBind, h: 55, label: "selected", w: 6, highlight: true },
            ].map((pk, i) => {
              const x = 15 + (1 - pk.be / 600) * 130;
              if (x < 15 || x > 150) return null;
              return (
                <g key={i}>
                  <path d={`M${x - pk.w} 90 Q${x} ${90 - pk.h} ${x + pk.w} 90`}
                    fill={pk.highlight ? C.surface + "44" : C.surface + "22"} stroke={pk.highlight ? C.surface : C.surface + "66"} strokeWidth={pk.highlight ? 1.5 : 0.8} />
                  <text x={x} y={85 - pk.h} textAnchor="middle" fontSize={6} fill={pk.highlight ? C.surface : T.muted}>{pk.label}</text>
                </g>
              );
            })}
          </g>

          {/* Energy level diagram */}
          <g transform="translate(240, 155)">
            <text x={80} y={0} textAnchor="middle" fontSize={9} fill={T.ink} fontWeight={600}>Energy Levels</text>
            <rect x={30} y={10} width={100} height={90} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={4} />
            {/* Vacuum */}
            <line x1={35} y1={15} x2={125} y2={15} stroke={T.ink} strokeWidth={0.8} />
            <text x={128} y={18} fontSize={7} fill={T.muted}>vacuum</text>
            {/* Fermi */}
            <line x1={35} y1={25} x2={125} y2={25} stroke={C.accent} strokeWidth={0.8} strokeDasharray="3,3" />
            <text x={128} y={28} fontSize={7} fill={C.accent}>E_F</text>
            {/* phi arrow */}
            <line x1={40} y1={15} x2={40} y2={25} stroke={C.accent} strokeWidth={0.8} />
            <text x={28} y={22} fontSize={6} fill={C.accent}>φ</text>
            {/* Core level */}
            <line x1={35} y1={85} x2={125} y2={85} stroke={C.surface} strokeWidth={1.2} />
            <text x={128} y={88} fontSize={7} fill={C.surface}>core</text>
            {/* E_bind arrow */}
            <line x1={60} y1={25} x2={60} y2={85} stroke={C.surface} strokeWidth={0.8} />
            <text x={50} y={58} fontSize={7} fill={C.surface} transform="rotate(-90,50,58)">E_bind</text>
            {/* hv arrow */}
            <line x1={80} y1={85} x2={80} y2={15} stroke={C.accent} strokeWidth={1} markerEnd="url(#arrow)" />
            <text x={85} y={50} fontSize={7} fill={C.accent}>hν</text>
            {/* E_kin arrow */}
            <line x1={100} y1={15} x2={100} y2={25} stroke={C.spec} strokeWidth={1} />
            <text x={105} y={22} fontSize={6} fill={C.spec}>E_kin</text>
          </g>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="X-ray source hν" value={source} min={1000} max={1500} step={0.1} onChange={setSource} color={C.accent}
              unit=" eV" format={v => v === 1486.6 ? "1486.6 (Al Kα)" : v === 1253.6 ? "1253.6 (Mg Kα)" : v.toFixed(1)} />
            <SliderRow label="Binding energy E_bind" value={eBind} min={0} max={1200} step={0.5} onChange={setEBind} color={C.surface} unit=" eV" />
            <SliderRow label="Work function φ" value={phi} min={3.0} max={6.0} step={0.1} onChange={setPhi} color={T.muted} unit=" eV" />
          </div>
          <div>
            <CalcRow eq={`E_kin = hν - E_bind - φ`} result={valid ? `${eKin.toFixed(1)} eV` : "< 0 (no emission)"} color={C.surface} />
            <CalcRow eq={`= ${source} - ${eBind} - ${phi}`} result={`${(source - eBind - phi).toFixed(1)} eV`} color={C.surface} />
            <CalcRow eq="Depth probed" result="~5-10 nm" color={T.muted} />
            <CalcRow eq="Energy resolution" result="~0.1-0.5 eV" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="KINETIC ENERGY" value={valid ? `${eKin.toFixed(1)} eV` : "---"} color={C.surface} sub="measured" />
          <ResultBox label="BINDING ENERGY" value={`${eBind.toFixed(1)} eV`} color={C.accent} sub="element + state ID" />
          <ResultBox label="SENSITIVITY" value="~0.1 at%" color={C.surface} sub="except H, He" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Elemental composition, oxidation state, bonding" />
          <InfoRow label="Resolution" value="~0.1-0.5 eV energy; ~10 μm spatial" />
          <InfoRow label="Sample" value="UHV compatible solids; conductive or charge-neutralized" />
          <InfoRow label="Limitation" value="Cannot detect H/He; surface only; needs UHV" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 5. AES ─── */
function AESSection() {
  const [eK, setEK] = useState(2472);
  const [eL1, setEL1] = useState(2307);
  const [eL2, setEL2] = useState(2200);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 150), 50);
    return () => clearInterval(id);
  }, []);

  const eAuger = eK - eL1 - eL2;

  const step = animFrame < 50 ? 1 : animFrame < 100 ? 2 : 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="A chain reaction -- one event triggers two more. An incoming electron knocks out a core electron, a higher electron fills the hole, and the released energy ejects yet another electron (the Auger electron)." />

      <Card title="Auger Electron Spectroscopy" color={C.surface} formula="E_Auger = E_K - E_L1 - E_L2">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          AES is a 3-step process: (1) Primary beam ionizes a core level K, (2) electron from L1 fills the hole,
          (3) energy released ejects an Auger electron from L2. The Auger energy is element-specific and independent
          of primary beam energy. Extremely surface-sensitive (~1-3 nm).
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Energy level diagram */}
          <g transform="translate(30, 20)">
            <text x={70} y={0} textAnchor="middle" fontSize={10} fill={C.surface} fontWeight={700}>Auger Process (Step {step}/3)</text>

            {/* Levels */}
            {[
              { y: 40, label: "Vacuum", col: T.ink },
              { y: 80, label: "L2,3", col: C.spec },
              { y: 110, label: "L1", col: C.spec },
              { y: 190, label: "K", col: C.surface },
            ].map((lv, i) => (
              <g key={i}>
                <line x1={30} y1={lv.y} x2={130} y2={lv.y} stroke={lv.col} strokeWidth={1.2} />
                <text x={140} y={lv.y + 4} fontSize={8} fill={lv.col}>{lv.label}</text>
              </g>
            ))}

            {/* Electrons on levels */}
            {/* K electrons */}
            <circle cx={50} cy={190} r={4} fill={C.surface} opacity={step >= 2 ? 0.2 : 1} />
            <circle cx={70} cy={190} r={4} fill={C.surface} />
            {/* L1 electrons */}
            <circle cx={50} cy={110} r={4} fill={C.spec} opacity={step >= 2 ? 0.2 : 1} />
            <circle cx={70} cy={110} r={4} fill={C.spec} />
            {/* L2 electrons */}
            <circle cx={50} cy={80} r={4} fill={C.spec} opacity={step >= 3 ? 0.2 : 1} />
            <circle cx={70} cy={80} r={4} fill={C.spec} />
            <circle cx={90} cy={80} r={4} fill={C.spec} />

            {/* Step 1: ionization */}
            {step === 1 && (
              <g>
                <line x1={50} y1={220} x2={50} y2={195} stroke={C.accent} strokeWidth={2} markerEnd="url(#arrow)" />
                <text x={55} y={215} fontSize={8} fill={C.accent}>e⁻ (primary)</text>
                {/* Ejected core e */}
                {animFrame > 25 && (
                  <g>
                    <line x1={50} y1={190} x2={50} y2={40 - (animFrame - 25) * 0.5} stroke={C.surface} strokeWidth={1} strokeDasharray="2,2" />
                    <circle cx={50} cy={Math.max(20, 40 - (animFrame - 25) * 0.5)} r={3} fill={C.surface} />
                    <text x={5} y={Math.max(20, 40 - (animFrame - 25) * 0.5)} fontSize={7} fill={C.surface}>ejected K</text>
                  </g>
                )}
              </g>
            )}

            {/* Step 2: relaxation */}
            {step === 2 && (
              <g>
                <line x1={50} y1={110} x2={50} y2={190} stroke={C.spec} strokeWidth={2} markerEnd="url(#arrow)" />
                <text x={55} y={155} fontSize={8} fill={C.spec}>L1 → K</text>
                <text x={55} y={167} fontSize={7} fill={C.accent}>ΔE released</text>
                {/* Wavy arrow showing energy */}
                {[0, 1, 2, 3].map(i => (
                  <circle key={i} cx={90 + Math.sin(i * 2 + animFrame * 0.1) * 5} cy={130 + i * 10}
                    r={2} fill={C.accent} opacity={0.6} />
                ))}
              </g>
            )}

            {/* Step 3: Auger emission */}
            {step === 3 && (
              <g>
                <line x1={50} y1={80} x2={50 + (animFrame - 100) * 1.5} y2={80 - (animFrame - 100) * 1.2}
                  stroke={C.surface} strokeWidth={1.5} strokeDasharray="2,2" />
                <circle cx={50 + Math.min(50, (animFrame - 100) * 1.5)} cy={80 - Math.min(50, (animFrame - 100) * 1.2)}
                  r={4} fill={C.surface} />
                <text x={50 + Math.min(50, (animFrame - 100) * 1.5) + 5}
                  y={80 - Math.min(50, (animFrame - 100) * 1.2) - 5}
                  fontSize={8} fill={C.surface} fontWeight={700}>Auger e⁻</text>
                <text x={55} y={95} fontSize={7} fill={C.accent}>E = E_K - E_L1 - E_L2</text>
              </g>
            )}
          </g>

          {/* Auger spectrum */}
          <g transform="translate(230, 30)">
            <text x={80} y={0} textAnchor="middle" fontSize={9} fill={C.surface} fontWeight={700}>dN/dE Spectrum</text>
            <rect x={0} y={8} width={160} height={100} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={15} y1={60} x2={150} y2={60} stroke={T.ink} strokeWidth={0.5} />
            <line x1={15} y1={98} x2={15} y2={15} stroke={T.ink} strokeWidth={0.8} />
            <text x={80} y={118} textAnchor="middle" fontSize={7} fill={T.muted}>Kinetic Energy (eV)</text>

            {/* Auger peaks (derivative form) */}
            {[
              { e: 272, label: "C KLL" },
              { e: 510, label: "O KLL" },
              { e: eAuger > 0 ? eAuger * 0.15 + 50 : 120, label: "KL1L2" },
            ].map((pk, i) => {
              const x = 15 + (pk.e / 1500) * 130;
              return (
                <g key={i}>
                  <path d={`M${x - 6} 60 Q${x - 2} 35 ${x} 60 Q${x + 2} 80 ${x + 6} 60`}
                    fill="none" stroke={i === 2 ? C.surface : C.surface + "66"} strokeWidth={i === 2 ? 1.5 : 0.8} />
                  <text x={x} y={28} textAnchor="middle" fontSize={6} fill={C.surface}>{pk.label}</text>
                </g>
              );
            })}
          </g>

          {/* Step indicators */}
          <g transform="translate(230, 150)">
            {[
              { n: 1, label: "Ionization", active: step === 1 },
              { n: 2, label: "Relaxation", active: step === 2 },
              { n: 3, label: "Emission", active: step === 3 },
            ].map((s, i) => (
              <g key={i} transform={`translate(${i * 55}, 0)`}>
                <circle cx={15} cy={15} r={12} fill={s.active ? C.surface : T.surface} stroke={C.surface} strokeWidth={1.5} />
                <text x={15} y={19} textAnchor="middle" fontSize={10} fill={s.active ? "#fff" : C.surface} fontWeight={700}>{s.n}</text>
                <text x={15} y={35} textAnchor="middle" fontSize={7} fill={s.active ? C.surface : T.muted}>{s.label}</text>
              </g>
            ))}
          </g>

          <text x={210} y={250} textAnchor="middle" fontSize={10} fill={T.muted}>
            Auger process animated (E_Auger = {eAuger > 0 ? eAuger : "---"} eV)
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="E_K (core level)" value={eK} min={500} max={5000} step={10} onChange={setEK} color={C.surface} unit=" eV" format={v => v.toString()} />
            <SliderRow label="E_L1" value={eL1} min={100} max={4000} step={10} onChange={setEL1} color={C.spec} unit=" eV" format={v => v.toString()} />
            <SliderRow label="E_L2" value={eL2} min={100} max={4000} step={10} onChange={setEL2} color={C.spec} unit=" eV" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`E_Auger = E_K - E_L1 - E_L2`} result={`${eAuger} eV`} color={C.surface} />
            <CalcRow eq={`= ${eK} - ${eL1} - ${eL2}`} result={`${eAuger} eV`} color={C.surface} />
            <CalcRow eq="Depth sensitivity" result="~1-3 nm" color={T.muted} />
            <CalcRow eq="Spatial resolution" result="~10 nm (SAM)" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="AUGER ENERGY" value={`${eAuger} eV`} color={C.surface} sub="element fingerprint" />
          <ResultBox label="DEPTH" value="1-3 nm" color={C.accent} sub="surface sensitive" />
          <ResultBox label="SENSITIVITY" value="~0.1 at%" color={C.surface} sub="except H, He" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Surface composition, depth profiles" />
          <InfoRow label="Resolution" value="~10 nm spatial (scanning Auger)" />
          <InfoRow label="Sample" value="UHV; conductive surfaces" />
          <InfoRow label="Limitation" value="Electron beam can damage organics; no H/He; UHV" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 6. SIMS ─── */
function SIMSSection() {
  const [ionE, setIonE] = useState(5);
  const [sputterRate, setSputterRate] = useState(1.5);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const depth = sputterRate * 10;
  const massRes = 300 + ionE * 80;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Ping-pong balls bombarding a sand castle -- the primary ions slam into the surface, knocking off atoms and small clusters. A mass spectrometer catches the debris and identifies every element and isotope." />

      <Card title="Secondary Ion Mass Spectrometry" color={C.surface} formula="m/q from TOF or magnetic sector">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          A focused primary ion beam (Cs+, O2+, Ga+, Bi+) bombards the sample surface. Sputtered secondary ions
          are analyzed by mass spectrometry. Depth profiling: track composition vs depth with nm resolution.
          Sensitivity down to ppb for some elements.
        </div>

        <svg viewBox="0 0 420 250" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Surface cross-section */}
          <rect x={80} y={140} width={260} height={60} fill={C.surface + "11"} stroke={C.surface + "44"} strokeWidth={1} />
          {/* Layers */}
          <rect x={80} y={150} width={260} height={10} fill={C.spec + "22"} />
          <rect x={80} y={160} width={260} height={15} fill={C.accent + "22"} />
          <rect x={80} y={175} width={260} height={25} fill={C.struct + "22"} />
          <text x={350} y={158} fontSize={7} fill={C.spec}>Layer A</text>
          <text x={350} y={170} fontSize={7} fill={C.accent}>Layer B</text>
          <text x={350} y={188} fontSize={7} fill={C.struct}>Substrate</text>

          {/* Sputter crater */}
          {(() => {
            const craterDepth = Math.min(30, animFrame * 0.3);
            return (
              <path d={`M 170 140 Q 210 ${140 + craterDepth} 250 140`}
                fill={T.bg} stroke={C.surface} strokeWidth={1} />
            );
          })()}

          {/* Primary ion beam */}
          <line x1={210} y1={20} x2={210} y2={135} stroke={C.surface} strokeWidth={2} />
          {[0, 1, 2].map(i => {
            const y = 20 + ((animFrame * 2 + i * 30) % 100);
            return (
              <circle key={i} cx={210} cy={y} r={3} fill={C.surface}>
                <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
              </circle>
            );
          })}
          <text x={220} y={30} fontSize={9} fill={C.surface} fontWeight={700}>Primary ions</text>
          <text x={220} y={42} fontSize={7} fill={T.muted}>{ionE} keV</text>

          {/* Sputtered secondary ions */}
          {animFrame > 20 && [0, 1, 2, 3, 4].map(i => {
            const t = ((animFrame - 20 + i * 15) % 60) / 60;
            const angle = -Math.PI / 2 + (i - 2) * 0.4;
            const dist = t * 80;
            const sx = 210 + Math.cos(angle) * dist;
            const sy = 135 - Math.sin(Math.abs(angle)) * dist;
            const cols = [C.spec, C.accent, C.struct, C.surface, C.accent];
            return (
              <g key={i} opacity={1 - t}>
                <circle cx={sx} cy={sy} r={2} fill={cols[i]} />
                {i === 0 && t < 0.3 && <text x={sx + 5} y={sy} fontSize={7} fill={cols[i]}>+</text>}
              </g>
            );
          })}

          {/* Mass spec / detector */}
          <rect x={100} y={20} width={50} height={25} fill={T.panel} stroke={C.surface} strokeWidth={1} rx={4} />
          <text x={125} y={36} textAnchor="middle" fontSize={7} fill={C.surface}>Detector</text>

          {/* Depth profile chart */}
          <g transform="translate(20, 30)">
            <text x={30} y={0} fontSize={8} fill={T.ink} fontWeight={600}>Depth Profile</text>
            <rect x={0} y={5} width={60} height={70} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            <text x={30} y={82} textAnchor="middle" fontSize={6} fill={T.muted}>Depth (nm)</text>
            {/* Simulated profile lines */}
            <polyline points="5,60 15,58 20,30 25,15 30,55 40,65 50,68 55,68" fill="none" stroke={C.spec} strokeWidth={1} />
            <polyline points="5,68 15,65 20,60 25,50 30,20 40,55 50,67 55,68" fill="none" stroke={C.accent} strokeWidth={1} />
            <polyline points="5,70 15,70 20,68 25,65 30,50 40,25 50,15 55,15" fill="none" stroke={C.struct} strokeWidth={1} />
          </g>

          <text x={210} y={240} textAnchor="middle" fontSize={10} fill={T.muted}>
            SIMS depth profiling (sputter rate: {sputterRate.toFixed(1)} nm/min)
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Primary ion energy" value={ionE} min={0.5} max={25} step={0.5} onChange={setIonE} color={C.surface} unit=" keV" />
            <SliderRow label="Sputter rate" value={sputterRate} min={0.1} max={10} step={0.1} onChange={setSputterRate} color={C.accent} unit=" nm/min" />
          </div>
          <div>
            <CalcRow eq={`Depth after 10 min`} result={`${depth.toFixed(1)} nm`} color={C.surface} />
            <CalcRow eq={`Mass resolution (M/ΔM)`} result={`~${massRes.toFixed(0)}`} color={C.accent} />
            <CalcRow eq="Detection limit" result="ppb - ppm" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="DEPTH (10 min)" value={`${depth.toFixed(0)} nm`} color={C.surface} sub="sputtered" />
          <ResultBox label="MASS RES." value={`${massRes.toFixed(0)}`} color={C.accent} sub="M/ΔM (TOF)" />
          <ResultBox label="SENSITIVITY" value="ppb" color={C.surface} sub="best case" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Elemental/isotopic depth profiles, trace impurities" />
          <InfoRow label="Resolution" value="~1 nm depth; ~50 nm lateral (nanoSIMS)" />
          <InfoRow label="Sample" value="Solids (destructive)" />
          <InfoRow label="Limitation" value="Matrix effects; destructive; quantification difficult" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 7. EDS ─── */
function EDSSection() {
  const [voltage, setVoltage] = useState(20);
  const [zElement, setZElement] = useState(26);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const elements = { 6: "C", 8: "O", 13: "Al", 14: "Si", 22: "Ti", 26: "Fe", 29: "Cu", 30: "Zn", 79: "Au" };
  const sigma = 1.0;
  const eKalpha = 0.0136 * (zElement - sigma) * (zElement - sigma);
  const eLalpha = zElement > 20 ? eKalpha * 0.11 : 0;
  const overvoltage = voltage / eKalpha;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Each element sings its own note -- when a high-energy electron knocks out an inner electron, the atom emits an X-ray at a characteristic frequency unique to that element, like a musical fingerprint." />

      <Card title="Energy Dispersive X-ray Spectroscopy" color={C.surface} formula="E ∝ (Z - σ)² (Moseley's law)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          EDS detects characteristic X-rays emitted when an electron beam ionizes inner-shell electrons.
          The emitted X-ray energy follows Moseley's law: E ∝ (Z-σ)². Typically coupled with SEM or TEM
          for elemental mapping. K, L, M line series correspond to which shell was ionized.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Atom with shells */}
          <g transform="translate(100, 130)">
            <circle cx={0} cy={0} r={10} fill={C.surface + "44"} stroke={C.surface} strokeWidth={1} />
            <text x={0} y={3} textAnchor="middle" fontSize={8} fill={C.surface}>Z={zElement}</text>
            {/* K shell */}
            <circle cx={0} cy={0} r={25} fill="none" stroke={C.surface + "66"} strokeWidth={1} />
            <text x={28} y={-20} fontSize={7} fill={T.muted}>K</text>
            {/* L shell */}
            <circle cx={0} cy={0} r={42} fill="none" stroke={C.spec + "66"} strokeWidth={1} />
            <text x={45} y={-37} fontSize={7} fill={T.muted}>L</text>
            {/* M shell */}
            <circle cx={0} cy={0} r={58} fill="none" stroke={C.accent + "66"} strokeWidth={1} />
            <text x={60} y={-53} fontSize={7} fill={T.muted}>M</text>

            {/* Electrons */}
            {[0, 180].map((ang, i) => {
              const r = 25;
              const rad = ((ang + animFrame * 0.5) * Math.PI) / 180;
              const ejected = i === 0 && animFrame > 30 && animFrame < 70;
              return (
                <circle key={`k${i}`} cx={r * Math.cos(rad)} cy={r * Math.sin(rad)} r={3}
                  fill={C.surface} opacity={ejected ? 0.2 : 0.9} />
              );
            })}
            {[0, 120, 240].map((ang, i) => {
              const r = 42;
              const rad = ((ang + animFrame * 0.3) * Math.PI) / 180;
              return <circle key={`l${i}`} cx={r * Math.cos(rad)} cy={r * Math.sin(rad)} r={2.5} fill={C.spec} opacity={0.7} />;
            })}

            {/* Incoming e-beam */}
            {animFrame < 40 && (
              <g>
                <line x1={-80} y1={-80} x2={-25 * (1 - animFrame / 40)} y2={-25 * (1 - animFrame / 40)}
                  stroke={C.micro} strokeWidth={1.5} />
                <circle cx={-80 + 55 * (animFrame / 40)} cy={-80 + 55 * (animFrame / 40)} r={3} fill={C.micro} />
              </g>
            )}

            {/* X-ray emission */}
            {animFrame >= 40 && animFrame < 80 && (
              <g>
                {/* L to K transition */}
                <line x1={42 * Math.cos(Math.PI)} y1={42 * Math.sin(Math.PI)} x2={0} y2={25}
                  stroke={C.spec} strokeWidth={1} opacity={0.5} strokeDasharray="2,2" />
                {/* X-ray photon */}
                {(() => {
                  const t = (animFrame - 40) / 40;
                  const xr = t * 120;
                  const yr = -t * 60;
                  return (
                    <g>
                      <line x1={0} y1={0} x2={xr} y2={yr} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" />
                      {[0, 1, 2].map(i => (
                        <circle key={i} cx={xr - i * 15 * Math.cos(0.46)} cy={yr + i * 15 * Math.sin(0.46)}
                          r={2} fill={C.accent} opacity={0.8 - i * 0.2} />
                      ))}
                      <text x={xr + 5} y={yr - 5} fontSize={8} fill={C.accent} fontWeight={700}>
                        Kα X-ray ({eKalpha.toFixed(2)} keV)
                      </text>
                    </g>
                  );
                })()}
              </g>
            )}
          </g>

          {/* EDS Spectrum */}
          <g transform="translate(230, 20)">
            <text x={80} y={10} textAnchor="middle" fontSize={9} fill={C.surface} fontWeight={700}>EDS Spectrum</text>
            <rect x={0} y={15} width={170} height={110} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={20} y1={115} x2={160} y2={115} stroke={T.ink} strokeWidth={0.8} />
            <line x1={20} y1={115} x2={20} y2={25} stroke={T.ink} strokeWidth={0.8} />
            <text x={90} y={132} textAnchor="middle" fontSize={7} fill={T.muted}>Energy (keV)</text>

            {/* Peaks for several elements */}
            {[
              { e: 0.277, h: 30, label: "C K" },
              { e: 0.525, h: 40, label: "O K" },
              { e: 1.74, h: 35, label: "Si K" },
              { e: eKalpha, h: 55, label: `Z=${zElement} Kα`, highlight: true },
              { e: eLalpha, h: eLalpha > 0 ? 25 : 0, label: `Lα` },
            ].filter(p => p.h > 0 && p.e > 0 && p.e < 20).map((pk, i) => {
              const x = 20 + (pk.e / 20) * 135;
              if (x > 160) return null;
              return (
                <g key={i}>
                  <path d={`M${x - 4} 115 Q${x} ${115 - pk.h} ${x + 4} 115`}
                    fill={pk.highlight ? C.surface + "44" : C.surface + "22"} stroke={pk.highlight ? C.surface : C.surface + "66"} strokeWidth={pk.highlight ? 1.5 : 0.8} />
                  <text x={x} y={110 - pk.h} textAnchor="middle" fontSize={6} fill={pk.highlight ? C.surface : T.muted}>{pk.label}</text>
                </g>
              );
            })}

            {/* Energy scale */}
            {[0, 5, 10, 15, 20].map(e => {
              const x = 20 + (e / 20) * 135;
              return <text key={e} x={x} y={124} textAnchor="middle" fontSize={6} fill={T.dim}>{e}</text>;
            })}
          </g>

          {/* Detector */}
          <g transform="translate(310, 150)">
            <rect x={0} y={0} width={40} height={30} fill={T.panel} stroke={C.surface} strokeWidth={1} rx={4} />
            <text x={20} y={18} textAnchor="middle" fontSize={7} fill={C.surface}>SDD</text>
            <text x={20} y={40} textAnchor="middle" fontSize={7} fill={T.muted}>detector</text>
          </g>

          <text x={210} y={250} textAnchor="middle" fontSize={10} fill={T.muted}>
            EDS: characteristic X-ray emission from Z = {zElement} ({elements[zElement] || "?"})
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Accelerating voltage" value={voltage} min={5} max={30} step={1} onChange={setVoltage} color={C.surface} unit=" kV" format={v => v.toString()} />
            <SliderRow label="Element Z" value={zElement} min={6} max={79} step={1} onChange={setZElement} color={C.accent}
              format={v => `${v} (${elements[v] || "?"})`} />
          </div>
          <div>
            <CalcRow eq={`E_Kα ≈ 0.0136(Z-σ)²`} result={`${eKalpha.toFixed(2)} keV`} color={C.surface} />
            <CalcRow eq={`Overvoltage = V/E_K`} result={overvoltage > 0 ? `${overvoltage.toFixed(1)}x` : "---"} color={C.accent} />
            <CalcRow eq="Need overvoltage" result="> 2x for good signal" color={T.muted} />
            <CalcRow eq="Energy resolution" result="~130 eV (SDD)" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="Kα ENERGY" value={`${eKalpha.toFixed(2)} keV`} color={C.surface} sub={`Z = ${zElement}`} />
          <ResultBox label="OVERVOLTAGE" value={`${overvoltage.toFixed(1)}x`} color={overvoltage >= 2 ? C.spec : C.adv} sub={overvoltage >= 2 ? "sufficient" : "too low!"} />
          <ResultBox label="DETECTION" value="~0.1 wt%" color={C.surface} sub="typical" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Elemental composition, mapping" />
          <InfoRow label="Resolution" value="~130 eV energy; ~1 μm spatial (SEM-EDS)" />
          <InfoRow label="Sample" value="Bulk or thin; conductive preferred" />
          <InfoRow label="Limitation" value="Cannot detect H-Be; overlapping peaks; light element issues" />
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BLOCK 3 — SPECTROSCOPY
   ════════════════════════════════════════════════════════════════════ */

/* ─── 8. XANES / EXAFS ─── */
function XANESSection() {
  const [R, setR] = useState(2.5);
  const [N, setN] = useState(4);
  const [sigma2, setSigma2] = useState(0.005);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const kMax = 12;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Tuning a radio past a station -- the signal wobbles because the outgoing photoelectron wave bounces off neighboring atoms and interferes with itself, creating oscillations (EXAFS) that encode neighbor distances." />

      <Card title="X-ray Absorption Spectroscopy" color={C.spec} formula="χ(k) = Σ N·sin(2kR+φ) / kR²">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          XAS measures X-ray absorption vs energy near an absorption edge. XANES (near-edge) gives oxidation state
          and coordination geometry. EXAFS (extended fine structure) oscillations arise from photoelectron scattering
          off neighbors, encoding bond distances R, coordination N, and disorder σ².
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Absorption spectrum */}
          <g transform="translate(20, 15)">
            <text x={190} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>X-ray Absorption Spectrum</text>
            <rect x={0} y={8} width={380} height={100} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={20} y1={95} x2={370} y2={95} stroke={T.ink} strokeWidth={0.8} />
            <line x1={20} y1={95} x2={20} y2={18} stroke={T.ink} strokeWidth={0.8} />
            <text x={190} y={115} textAnchor="middle" fontSize={7} fill={T.muted}>Energy (eV)</text>
            <text x={8} y={55} fontSize={7} fill={T.muted} transform="rotate(-90,8,55)">μ(E)</text>

            {/* Pre-edge */}
            <polyline points={Array.from({ length: 40 }, (_, i) => {
              const x = 25 + i * 2;
              const y = 85 - i * 0.3;
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1.5} />

            {/* Edge jump */}
            <polyline points={Array.from({ length: 20 }, (_, i) => {
              const x = 105 + i * 1.5;
              const y = 73 - 40 * (1 / (1 + Math.exp(-(i - 10) * 0.8)));
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1.5} />

            {/* EXAFS oscillations */}
            <polyline points={Array.from({ length: 200 }, (_, i) => {
              const x = 135 + i * 1.2;
              const k = (i / 200) * kMax;
              const chi = N * Math.sin(2 * k * R) * Math.exp(-2 * k * k * sigma2) / (k * R * R + 0.01);
              const y = 33 - chi * 15;
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1.2} />

            {/* Labels */}
            <text x={60} y={80} fontSize={7} fill={T.muted}>pre-edge</text>
            <text x={105} y={65} fontSize={7} fill={C.spec} fontWeight={600}>XANES</text>
            <text x={250} y={25} fontSize={7} fill={C.spec} fontWeight={600}>EXAFS</text>

            {/* Animated scanning line */}
            {(() => {
              const scanX = 25 + (animFrame / 120) * 350;
              return <line x1={scanX} y1={15} x2={scanX} y2={100} stroke={C.accent} strokeWidth={0.5} opacity={0.5} />;
            })()}
          </g>

          {/* Scattering diagram */}
          <g transform="translate(100, 180)">
            {/* Central absorbing atom */}
            <circle cx={0} cy={0} r={10} fill={C.spec + "44"} stroke={C.spec} strokeWidth={1.5} />
            <text x={0} y={3} textAnchor="middle" fontSize={7} fill={C.spec}>abs.</text>
            {/* Neighbor atoms */}
            {Array.from({ length: N }, (_, i) => {
              const angle = (i * 2 * Math.PI) / N;
              const nx = R * 25 * Math.cos(angle);
              const ny = R * 25 * Math.sin(angle);
              return (
                <g key={i}>
                  <circle cx={nx} cy={ny} r={7} fill={C.accent + "44"} stroke={C.accent} strokeWidth={1} />
                  <text x={nx} y={ny + 3} textAnchor="middle" fontSize={6} fill={C.accent}>nb</text>
                </g>
              );
            })}
            {/* Photoelectron wave */}
            {(() => {
              const waveR = (animFrame % 40) * 2;
              return (
                <circle cx={0} cy={0} r={waveR} fill="none" stroke={C.spec} strokeWidth={0.8}
                  opacity={Math.max(0, 1 - waveR / 80)} />
              );
            })()}
            {/* R label */}
            <line x1={12} y1={0} x2={R * 25 - 9} y2={0} stroke={C.accent} strokeWidth={0.8} strokeDasharray="2,2" />
            <text x={R * 12.5} y={-5} textAnchor="middle" fontSize={7} fill={C.accent}>R = {R.toFixed(1)} Å</text>
          </g>

          <text x={320} y={200} fontSize={8} fill={T.muted}>N = {N} neighbors</text>
          <text x={320} y={215} fontSize={8} fill={T.muted}>σ² = {sigma2.toFixed(3)} Å²</text>
          <text x={320} y={230} fontSize={8} fill={T.muted}>R = {R.toFixed(2)} Å</text>

          <text x={210} y={255} textAnchor="middle" fontSize={10} fill={T.muted}>
            EXAFS: photoelectron backscattering from {N} neighbors at R = {R.toFixed(2)} Å
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Neighbor distance R" value={R} min={1.5} max={5.0} step={0.05} onChange={setR} color={C.spec} unit=" Å" />
            <SliderRow label="Coordination number N" value={N} min={1} max={12} step={1} onChange={setN} color={C.accent} format={v => v.toString()} />
            <SliderRow label="Debye-Waller σ²" value={sigma2} min={0.001} max={0.03} step={0.001} onChange={setSigma2} color={C.spec} unit=" Å²" format={v => v.toFixed(3)} />
          </div>
          <div>
            <CalcRow eq={`χ(k=5) ≈ N·sin(2kR)/kR²`} result={`${(N * Math.sin(2 * 5 * R) * Math.exp(-50 * sigma2) / (5 * R * R)).toFixed(4)}`} color={C.spec} />
            <CalcRow eq={`exp(-2k²σ²) at k=5`} result={Math.exp(-50 * sigma2).toFixed(4)} color={C.accent} />
            <CalcRow eq="XANES gives" result="oxidation state, symmetry" color={T.muted} />
            <CalcRow eq="EXAFS gives" result="R, N, σ²" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="BOND DISTANCE" value={`${R.toFixed(2)} Å`} color={C.spec} sub="from EXAFS" />
          <ResultBox label="COORDINATION" value={N.toString()} color={C.accent} sub="nearest neighbors" />
          <ResultBox label="σ² DISORDER" value={`${(sigma2 * 1000).toFixed(1)} ×10⁻³ Å²`} color={C.spec} sub="thermal + static" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Oxidation state, local structure, bond distances" />
          <InfoRow label="Resolution" value="±0.01 Å for distances" />
          <InfoRow label="Source" value="Synchrotron radiation (tunable)" />
          <InfoRow label="Limitation" value="Needs synchrotron; element-specific; no long-range order" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 9. Raman ─── */
function RamanSection() {
  const [laserWL, setLaserWL] = useState(532);
  const [temp, setTemp] = useState(300);
  const [ramanShift, setRamanShift] = useState(520);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const laserE = 1240 / laserWL;
  const hv = ramanShift * 0.000124;
  const kT = 0.0000862 * temp;
  const ratio = Math.exp(-hv / kT);
  const stokesWL = 1 / (1 / laserWL - ramanShift * 1e-7);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="A rubber ball bouncing off a vibrating wall -- most photons bounce back unchanged (Rayleigh), but a few gain or lose energy from molecular vibrations (Raman scattering), revealing the molecule's fingerprint." />

      <Card title="Raman Spectroscopy" color={C.spec} formula="Δν = 1/λ_in - 1/λ_out">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Raman spectroscopy measures inelastic light scattering. A laser photon excites a molecule to a virtual state;
          it then relaxes emitting a photon shifted in energy. Stokes (lower E) and anti-Stokes (higher E) shifts
          correspond to vibrational modes. The Stokes/anti-Stokes ratio gives temperature via Boltzmann.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Energy level diagram */}
          <g transform="translate(30, 20)">
            <text x={80} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>Raman Energy Diagram</text>
            {/* Ground vibrational levels */}
            <line x1={10} y1={200} x2={160} y2={200} stroke={T.ink} strokeWidth={1.5} />
            <text x={170} y={203} fontSize={7} fill={T.ink}>v=0</text>
            <line x1={10} y1={175} x2={160} y2={175} stroke={T.ink} strokeWidth={1} />
            <text x={170} y={178} fontSize={7} fill={T.ink}>v=1</text>
            <line x1={10} y1={155} x2={160} y2={155} stroke={T.ink + "66"} strokeWidth={0.8} />
            <text x={170} y={158} fontSize={7} fill={T.muted}>v=2</text>

            {/* Virtual state */}
            <line x1={10} y1={60} x2={160} y2={60} stroke={C.spec} strokeWidth={1} strokeDasharray="4,4" />
            <text x={170} y={63} fontSize={7} fill={C.spec}>virtual</text>

            {/* Rayleigh */}
            <g transform="translate(30, 0)">
              <line x1={0} y1={200} x2={0} y2={60} stroke={C.spec + "88"} strokeWidth={1.5} />
              <line x1={0} y1={60} x2={0} y2={200} stroke={C.spec + "88"} strokeWidth={1.5} strokeDasharray="4,2" />
              <circle cx={0} cy={60 + (animFrame % 30) * 4.7} r={3} fill={C.spec} opacity={0.6} />
              <text x={0} y={215} textAnchor="middle" fontSize={7} fill={T.muted}>Rayleigh</text>
            </g>

            {/* Stokes */}
            <g transform="translate(75, 0)">
              <line x1={0} y1={200} x2={0} y2={60} stroke={C.accent} strokeWidth={1.5} />
              <line x1={0} y1={60} x2={0} y2={175} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="4,2" />
              <circle cx={0} cy={60 + Math.min(115, (animFrame % 40) * 3.5)} r={3} fill={C.accent} opacity={0.6} />
              <text x={0} y={215} textAnchor="middle" fontSize={7} fill={C.accent}>Stokes</text>
              <text x={0} y={225} textAnchor="middle" fontSize={6} fill={T.muted}>(-ΔE)</text>
            </g>

            {/* Anti-Stokes */}
            <g transform="translate(120, 0)">
              <line x1={0} y1={175} x2={0} y2={60} stroke="#2563eb" strokeWidth={1.5} />
              <line x1={0} y1={60} x2={0} y2={200} stroke="#059669" strokeWidth={1.5} strokeDasharray="4,2" />
              <circle cx={0} cy={Math.max(60, 175 - (animFrame % 40) * 3.5)} r={3} fill="#2563eb" opacity={0.6} />
              <text x={0} y={215} textAnchor="middle" fontSize={7} fill="#2563eb">Anti-Stokes</text>
              <text x={0} y={225} textAnchor="middle" fontSize={6} fill={T.muted}>(+ΔE)</text>
            </g>
          </g>

          {/* Raman Spectrum */}
          <g transform="translate(220, 20)">
            <text x={90} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>Raman Spectrum</text>
            <rect x={0} y={8} width={180} height={110} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={90} y1={105} x2={90} y2={20} stroke={T.ink} strokeWidth={1.5} />
            <line x1={15} y1={105} x2={170} y2={105} stroke={T.ink} strokeWidth={0.8} />
            <text x={90} y={126} textAnchor="middle" fontSize={7} fill={T.muted}>Raman Shift (cm⁻¹)</text>

            {/* Rayleigh peak (center) */}
            <path d={`M85 105 Q90 30 95 105`} fill={C.spec + "22"} stroke={C.spec} strokeWidth={1} />
            <text x={90} y={25} textAnchor="middle" fontSize={6} fill={C.spec}>Rayleigh</text>

            {/* Stokes peaks */}
            {[ramanShift, ramanShift * 1.5, ramanShift * 0.6].map((shift, i) => {
              const x = 90 + (shift / 1500) * 70;
              const h = i === 0 ? 50 : 25;
              if (x > 168) return null;
              return (
                <g key={`s${i}`}>
                  <path d={`M${x - 3} 105 Q${x} ${105 - h} ${x + 3} 105`}
                    fill={C.accent + "22"} stroke={C.accent} strokeWidth={i === 0 ? 1.2 : 0.8} />
                  {i === 0 && <text x={x} y={105 - h - 4} textAnchor="middle" fontSize={6} fill={C.accent}>{shift} cm⁻¹</text>}
                </g>
              );
            })}

            {/* Anti-Stokes (weaker) */}
            {[ramanShift].map((shift, i) => {
              const x = 90 - (shift / 1500) * 70;
              const h = 50 * ratio;
              return (
                <g key={`as${i}`}>
                  <path d={`M${x - 3} 105 Q${x} ${105 - h} ${x + 3} 105`}
                    fill={"#2563eb22"} stroke={"#2563eb"} strokeWidth={0.8} />
                </g>
              );
            })}

            <text x={130} y={100} fontSize={6} fill={C.accent}>Stokes</text>
            <text x={45} y={100} fontSize={6} fill={"#2563eb"}>Anti-Stokes</text>
          </g>

          {/* Molecule vibration */}
          <g transform="translate(280, 170)">
            <text x={40} y={0} textAnchor="middle" fontSize={8} fill={T.ink}>Molecular vibration</text>
            {(() => {
              const dx = Math.sin(animFrame * 0.15) * 8;
              return (
                <g>
                  <circle cx={20 - dx} cy={30} r={8} fill={C.spec + "44"} stroke={C.spec} strokeWidth={1} />
                  <line x1={28 - dx} y1={30} x2={52 + dx} y2={30} stroke={T.ink} strokeWidth={2} />
                  <circle cx={60 + dx} cy={30} r={8} fill={C.accent + "44"} stroke={C.accent} strokeWidth={1} />
                  <text x={40} y={55} textAnchor="middle" fontSize={7} fill={T.muted}>stretch mode</text>
                </g>
              );
            })()}
          </g>

          <text x={210} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            Raman: {ramanShift} cm⁻¹ shift, λ = {laserWL} nm, T = {temp} K
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Laser wavelength" value={laserWL} min={325} max={1064} step={1} onChange={setLaserWL} color={C.spec} unit=" nm" format={v => v.toString()} />
            <SliderRow label="Temperature" value={temp} min={77} max={1000} step={5} onChange={setTemp} color={C.accent} unit=" K" format={v => v.toString()} />
            <SliderRow label="Raman shift" value={ramanShift} min={100} max={1600} step={10} onChange={setRamanShift} color={C.spec} unit=" cm⁻¹" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`Laser energy = 1240/${laserWL}`} result={`${laserE.toFixed(3)} eV`} color={C.spec} />
            <CalcRow eq={`Stokes λ = 1/(1/${laserWL}-Δν)`} result={`${stokesWL.toFixed(1)} nm`} color={C.accent} />
            <CalcRow eq={`Anti-Stokes/Stokes ratio`} result={ratio.toFixed(4)} color={C.spec} />
            <CalcRow eq={`= exp(-hν/kT) at ${temp}K`} result={ratio.toFixed(4)} color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="RAMAN SHIFT" value={`${ramanShift} cm⁻¹`} color={C.spec} sub="vibration frequency" />
          <ResultBox label="STOKES λ" value={`${stokesWL.toFixed(1)} nm`} color={C.accent} sub="scattered light" />
          <ResultBox label="AS/S RATIO" value={ratio.toFixed(4)} color={C.spec} sub={`T = ${temp} K`} />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Vibrational modes, phase ID, stress/strain" />
          <InfoRow label="Resolution" value="~1 cm⁻¹; ~1 μm spatial (confocal)" />
          <InfoRow label="Sample" value="Non-destructive; liquids, solids, gases" />
          <InfoRow label="Limitation" value="Fluorescence interference; weak signal (1 in 10⁸ photons)" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 10. PL ─── */
function PLSection() {
  const [bandgap, setBandgap] = useState(1.5);
  const [excWL, setExcWL] = useState(350);
  const [defectLvl, setDefectLvl] = useState(0.3);
  const [temperature, setTemperature] = useState(300);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const excE = 1240 / excWL;
  const emWL = 1240 / bandgap;
  const defectWL = 1240 / (bandgap - defectLvl);
  const canExcite = excE > bandgap;
  const thermalQuench = Math.exp(-0.1 / (0.0000862 * temperature));
  const plIntensity = canExcite ? (1 - thermalQuench * 0.3).toFixed(2) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text='A UV flashlight on a white T-shirt -- the shirt absorbs UV (invisible) and re-emits visible light (glows). Similarly, PL excites above the bandgap and captures emission at the bandgap energy.' />

      <Card title="Photoluminescence" color={C.spec} formula="Excite above Eg → Emit at Eg">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          PL excites electrons above the bandgap with a laser. Electrons thermalize to the conduction band edge,
          then recombine radiatively, emitting photons at the bandgap energy. Defect emissions appear at sub-bandgap
          energies. Temperature quenching reduces intensity at high T.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Band diagram */}
          <g transform="translate(30, 20)">
            <text x={75} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>Band Diagram</text>

            {/* Conduction band */}
            <rect x={10} y={30} width={140} height={8} fill={C.micro + "22"} stroke={C.micro} strokeWidth={1} />
            <text x={160} y={37} fontSize={7} fill={C.micro}>CB</text>

            {/* Valence band */}
            <rect x={10} y={130} width={140} height={8} fill={C.spec + "22"} stroke={C.spec} strokeWidth={1} />
            <text x={160} y={137} fontSize={7} fill={C.spec}>VB</text>

            {/* Bandgap */}
            <line x1={5} y1={38} x2={5} y2={130} stroke={C.accent} strokeWidth={0.8} strokeDasharray="2,2" />
            <text x={2} y={85} fontSize={7} fill={C.accent} transform="rotate(-90,2,85)">Eg = {bandgap} eV</text>

            {/* Defect level */}
            <line x1={30} y1={130 - (bandgap - defectLvl) / bandgap * 92} x2={120} y2={130 - (bandgap - defectLvl) / bandgap * 92}
              stroke={C.adv} strokeWidth={1} strokeDasharray="3,3" />
            <text x={125} y={130 - (bandgap - defectLvl) / bandgap * 92 + 3} fontSize={6} fill={C.adv}>defect</text>

            {/* Excitation arrow */}
            {canExcite && (
              <g>
                <line x1={40} y1={134} x2={40} y2={25} stroke={C.surface} strokeWidth={1.5} markerEnd="url(#arrow)" />
                <text x={25} y={80} fontSize={7} fill={C.surface}>hν_exc</text>
              </g>
            )}

            {/* Thermalization */}
            {canExcite && (
              <g>
                <path d="M45,25 Q55,28 45,33 Q55,36 48,38" fill="none" stroke={C.accent} strokeWidth={0.8} />
                <text x={60} y={28} fontSize={6} fill={C.accent}>therm.</text>
              </g>
            )}

            {/* Radiative recombination */}
            {canExcite && animFrame > 30 && (
              <g>
                <line x1={80} y1={38} x2={80} y2={130} stroke={C.spec} strokeWidth={2} markerEnd="url(#arrow)" />
                {/* Wavy photon */}
                {[0, 1, 2].map(i => {
                  const py = 84 + i * 5;
                  const px = 85 + Math.sin(animFrame * 0.2 + i) * 4;
                  return <circle key={i} cx={px} cy={py} r={1.5} fill={C.spec} opacity={0.7} />;
                })}
                <text x={95} y={90} fontSize={7} fill={C.spec} fontWeight={700}>PL</text>
                <text x={95} y={100} fontSize={6} fill={C.spec}>{emWL.toFixed(0)} nm</text>
              </g>
            )}

            {/* Electron */}
            {canExcite && (() => {
              const t = (animFrame % 60) / 60;
              const ey = t < 0.4 ? 134 - t * (134 - 25) / 0.4 : t < 0.5 ? 25 + (t - 0.4) * 130 : 38;
              return <circle cx={t < 0.5 ? 40 : 80} cy={ey} r={3} fill={C.micro} opacity={0.8} />;
            })()}
          </g>

          {/* PL Spectrum */}
          <g transform="translate(220, 20)">
            <text x={85} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>PL Spectrum</text>
            <rect x={0} y={8} width={180} height={110} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={15} y1={105} x2={170} y2={105} stroke={T.ink} strokeWidth={0.8} />
            <line x1={15} y1={105} x2={15} y2={18} stroke={T.ink} strokeWidth={0.8} />
            <text x={90} y={126} textAnchor="middle" fontSize={7} fill={T.muted}>Wavelength (nm)</text>

            {canExcite && (
              <g>
                {/* Band-edge emission */}
                {(() => {
                  const px = 15 + (emWL - 300) / 900 * 150;
                  const h = 60 * parseFloat(plIntensity);
                  return (
                    <g>
                      <path d={`M${px - 10} 105 Q${px} ${105 - h} ${px + 10} 105`}
                        fill={C.spec + "33"} stroke={C.spec} strokeWidth={1.5} />
                      <text x={px} y={100 - h} textAnchor="middle" fontSize={6} fill={C.spec}>
                        {emWL.toFixed(0)} nm
                      </text>
                    </g>
                  );
                })()}
                {/* Defect emission */}
                {(() => {
                  const px = 15 + (defectWL - 300) / 900 * 150;
                  const h = 25;
                  if (px > 15 && px < 170) {
                    return (
                      <g>
                        <path d={`M${px - 12} 105 Q${px} ${105 - h} ${px + 12} 105`}
                          fill={C.adv + "22"} stroke={C.adv} strokeWidth={0.8} />
                        <text x={px} y={100 - h} textAnchor="middle" fontSize={6} fill={C.adv}>defect</text>
                      </g>
                    );
                  }
                  return null;
                })()}

                {/* Excitation marker */}
                {(() => {
                  const px = 15 + (excWL - 300) / 900 * 150;
                  return (
                    <g>
                      <line x1={px} y1={105} x2={px} y2={20} stroke={C.surface} strokeWidth={0.8} strokeDasharray="2,2" />
                      <text x={px} y={16} textAnchor="middle" fontSize={6} fill={C.surface}>exc. {excWL}nm</text>
                    </g>
                  );
                })()}
              </g>
            )}
            {!canExcite && (
              <text x={90} y={60} textAnchor="middle" fontSize={10} fill={C.adv}>Excitation below bandgap!</text>
            )}
          </g>

          {/* Temperature quenching note */}
          <g transform="translate(220, 155)">
            <text x={85} y={0} textAnchor="middle" fontSize={8} fill={T.ink}>Temperature effect on PL</text>
            <rect x={0} y={5} width={170} height={50} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            {/* Simple intensity vs T */}
            <polyline points={Array.from({ length: 50 }, (_, i) => {
              const t = 77 + i * 20;
              const x = 10 + i * 3;
              const inten = (1 - Math.exp(-0.1 / (0.0000862 * t)) * 0.3);
              const y = 50 - inten * 35;
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1} />
            <text x={80} y={62} textAnchor="middle" fontSize={6} fill={T.muted}>77 K → 1000 K</text>
            {/* Current T marker */}
            {(() => {
              const x = 10 + ((temperature - 77) / (1000 - 77)) * 150;
              return <circle cx={x} cy={50 - parseFloat(plIntensity) * 35} r={3} fill={C.accent} />;
            })()}
          </g>

          <text x={210} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            PL: Eg = {bandgap} eV, emit at {canExcite ? `${emWL.toFixed(0)} nm` : "---"}
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Bandgap" value={bandgap} min={0.5} max={4.0} step={0.05} onChange={setBandgap} color={C.spec} unit=" eV" />
            <SliderRow label="Excitation wavelength" value={excWL} min={200} max={800} step={5} onChange={setExcWL} color={C.surface} unit=" nm" format={v => v.toString()} />
            <SliderRow label="Defect level (below CB)" value={defectLvl} min={0.05} max={1.0} step={0.05} onChange={setDefectLvl} color={C.adv} unit=" eV" />
            <SliderRow label="Temperature" value={temperature} min={10} max={800} step={5} onChange={setTemperature} color={C.accent} unit=" K" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`Exc. energy = 1240/${excWL}`} result={`${excE.toFixed(3)} eV`} color={C.surface} />
            <CalcRow eq={`Emission λ = 1240/${bandgap}`} result={canExcite ? `${emWL.toFixed(0)} nm` : "no PL"} color={C.spec} />
            <CalcRow eq={`Defect emission λ`} result={`${defectWL.toFixed(0)} nm`} color={C.adv} />
            <CalcRow eq={`PL intensity (norm.)`} result={plIntensity} color={C.accent} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="EMISSION λ" value={canExcite ? `${emWL.toFixed(0)} nm` : "---"} color={C.spec} sub="band-edge" />
          <ResultBox label="DEFECT EMISSION" value={`${defectWL.toFixed(0)} nm`} color={C.adv} sub={`${defectLvl} eV below CB`} />
          <ResultBox label="PL INTENSITY" value={`${(parseFloat(plIntensity) * 100).toFixed(0)}%`} color={C.accent} sub={`T = ${temperature} K`} />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Bandgap, defect states, recombination dynamics" />
          <InfoRow label="Resolution" value="~1 meV (low-T); ~1 μm spatial" />
          <InfoRow label="Sample" value="Semiconductors, quantum dots, phosphors" />
          <InfoRow label="Limitation" value="Non-radiative paths invisible; temp-dependent quenching" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 11. UV-Vis ─── */
function UVVisSection() {
  const [conc, setConc] = useState(0.01);
  const [pathLen, setPathLen] = useState(1.0);
  const [bg, setBg] = useState(2.5);
  const [isDirect, setIsDirect] = useState(true);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const epsilon = 5000;
  const absorbance = epsilon * conc * pathLen;
  const transmittance = Math.pow(10, -absorbance) * 100;
  const n = isDirect ? 2 : 0.5;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Colored glass filtering white light -- the glass absorbs certain wavelengths and transmits others. UV-Vis measures which wavelengths are absorbed and by how much, revealing concentration (Beer-Lambert) or bandgap (Tauc)." />

      <Card title="UV-Vis Spectroscopy" color={C.spec} formula="A = εcl (Beer-Lambert)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          UV-Vis measures absorption/transmission of light (200-800 nm). Beer-Lambert law relates absorbance to
          concentration. For semiconductors, the Tauc plot extracts the bandgap: (αhν)^n vs hν,
          where n = 2 (direct) or 1/2 (indirect).
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Cuvette diagram */}
          <g transform="translate(30, 30)">
            <text x={55} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>Beer-Lambert</text>

            {/* Light source */}
            <circle cx={0} cy={60} r={12} fill={C.accent + "44"} stroke={C.accent} strokeWidth={1} />
            <text x={0} y={63} textAnchor="middle" fontSize={7} fill={C.accent}>I₀</text>

            {/* Light beam going in */}
            {[0, 1, 2, 3].map(i => {
              const x = 15 + ((animFrame * 1.5 + i * 20) % 80);
              const opacity = x < 55 ? 1 : transmittance / 100;
              return (
                <circle key={i} cx={x} cy={60} r={2} fill={C.accent} opacity={opacity * 0.8} />
              );
            })}

            {/* Cuvette */}
            <rect x={30} y={35} width={50} height={50} fill={C.spec + `${Math.min(99, Math.floor(absorbance * 30))}`}
              stroke={T.ink} strokeWidth={1} rx={2} />
            <text x={55} y={60} textAnchor="middle" fontSize={7} fill={T.panel}>l = {pathLen} cm</text>
            <text x={55} y={72} textAnchor="middle" fontSize={6} fill={T.panel}>c = {conc}</text>

            {/* Transmitted light */}
            <line x1={80} y1={60} x2={110} y2={60} stroke={C.accent} strokeWidth={1} opacity={transmittance / 100} />
            <circle cx={115} cy={60} r={8} fill={C.accent + "22"} stroke={C.accent} strokeWidth={0.8} />
            <text x={115} y={63} textAnchor="middle" fontSize={6} fill={C.accent}>I</text>

            {/* Path length arrow */}
            <line x1={30} y1={92} x2={80} y2={92} stroke={T.ink} strokeWidth={0.8} />
            <text x={55} y={102} textAnchor="middle" fontSize={7} fill={T.muted}>l</text>
          </g>

          {/* Tauc plot */}
          <g transform="translate(220, 20)">
            <text x={85} y={0} textAnchor="middle" fontSize={9} fill={C.spec} fontWeight={700}>Tauc Plot</text>
            <rect x={0} y={8} width={180} height={110} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={20} y1={105} x2={170} y2={105} stroke={T.ink} strokeWidth={0.8} />
            <line x1={20} y1={105} x2={20} y2={18} stroke={T.ink} strokeWidth={0.8} />
            <text x={95} y={126} textAnchor="middle" fontSize={7} fill={T.muted}>hν (eV)</text>
            <text x={8} y={60} fontSize={7} fill={T.muted} transform="rotate(-90,8,60)">(αhν)^n</text>

            {/* Tauc curve */}
            <polyline points={Array.from({ length: 80 }, (_, i) => {
              const hv = 1.0 + i * 0.05;
              const x = 20 + (hv - 1.0) / 4.0 * 145;
              const alpha = hv > bg ? Math.pow(hv - bg, 1 / n) * 50 : 0;
              const y = 105 - Math.min(85, alpha);
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1.5} />

            {/* Linear extrapolation */}
            {(() => {
              const bgx = 20 + (bg - 1.0) / 4.0 * 145;
              return (
                <g>
                  <line x1={bgx} y1={105} x2={bgx + 40} y2={60} stroke={C.adv} strokeWidth={1} strokeDasharray="3,3" />
                  <circle cx={bgx} cy={105} r={3} fill={C.adv} />
                  <text x={bgx} y={115} textAnchor="middle" fontSize={7} fill={C.adv} fontWeight={700}>Eg = {bg} eV</text>
                </g>
              );
            })()}

            <text x={155} y={25} fontSize={7} fill={T.muted}>n = {n}</text>
            <text x={155} y={35} fontSize={7} fill={T.muted}>{isDirect ? "direct" : "indirect"}</text>
          </g>

          {/* Toggle direct/indirect */}
          <g transform="translate(220, 150)">
            <rect x={0} y={0} width={80} height={22} rx={11} fill={isDirect ? C.spec + "22" : T.surface}
              stroke={C.spec} strokeWidth={1} cursor="pointer"
              onClick={() => setIsDirect(!isDirect)} />
            <circle cx={isDirect ? 60 : 20} cy={11} r={8} fill={C.spec} />
            <text x={isDirect ? 20 : 60} y={15} textAnchor="middle" fontSize={7} fill={C.spec}>
              {isDirect ? "Direct" : "Indirect"}
            </text>
          </g>

          {/* Absorption spectrum */}
          <g transform="translate(30, 130)">
            <text x={80} y={0} textAnchor="middle" fontSize={8} fill={T.ink}>Absorbance Spectrum</text>
            <rect x={0} y={5} width={160} height={70} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            <line x1={15} y1={65} x2={150} y2={65} stroke={T.ink} strokeWidth={0.5} />
            <polyline points={Array.from({ length: 60 }, (_, i) => {
              const wl = 200 + i * 10;
              const x = 15 + (wl - 200) / 600 * 130;
              const hv = 1240 / wl;
              const abs = hv > bg ? Math.min(3, epsilon * conc * pathLen * (hv - bg) / bg) : 0.05;
              const y = 65 - abs * 18;
              return `${x},${y}`;
            }).join(" ")} fill="none" stroke={C.spec} strokeWidth={1} />
            <text x={80} y={80} textAnchor="middle" fontSize={6} fill={T.muted}>Wavelength (nm)</text>
          </g>

          <text x={210} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            UV-Vis: A = {absorbance.toFixed(2)}, T = {transmittance.toFixed(1)}%, Eg = {bg} eV
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Concentration c" value={conc} min={0.001} max={0.1} step={0.001} onChange={setConc} color={C.spec} unit=" M" format={v => v.toFixed(3)} />
            <SliderRow label="Path length l" value={pathLen} min={0.1} max={5.0} step={0.1} onChange={setPathLen} color={C.accent} unit=" cm" />
            <SliderRow label="Bandgap (Tauc)" value={bg} min={0.5} max={5.0} step={0.05} onChange={setBg} color={C.spec} unit=" eV" />
          </div>
          <div>
            <CalcRow eq={`A = εcl = ${epsilon}×${conc.toFixed(3)}×${pathLen}`} result={absorbance.toFixed(3)} color={C.spec} />
            <CalcRow eq={`T = 10^(-A) × 100`} result={`${transmittance.toFixed(1)}%`} color={C.accent} />
            <CalcRow eq={`Tauc: n = ${n} (${isDirect ? "direct" : "indirect"})`} result={`Eg = ${bg} eV`} color={C.spec} />
            <CalcRow eq={`λ_edge = 1240/Eg`} result={`${(1240 / bg).toFixed(0)} nm`} color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="ABSORBANCE" value={absorbance.toFixed(3)} color={C.spec} sub="A = εcl" />
          <ResultBox label="TRANSMITTANCE" value={`${transmittance.toFixed(1)}%`} color={C.accent} sub="I/I₀" />
          <ResultBox label="BANDGAP" value={`${bg} eV`} color={C.spec} sub={isDirect ? "direct" : "indirect"} />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Absorption, bandgap, concentration" />
          <InfoRow label="Resolution" value="~0.1 nm wavelength" />
          <InfoRow label="Sample" value="Solutions, thin films, powders (DRS)" />
          <InfoRow label="Limitation" value="Scattering effects; Beer-Lambert fails at high conc." />
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BLOCK 4 — MICROSCOPY
   ════════════════════════════════════════════════════════════════════ */

/* ─── 12. SEM ─── */
function SEMSection() {
  const [voltage, setVoltage] = useState(15);
  const [wd, setWd] = useState(10);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const resolution = Math.max(1, 0.5 + wd * 0.1 + (30 - voltage) * 0.05);
  const interactionDepth = voltage * 0.05;
  const seYield = Math.min(2, 0.5 + 20 / voltage);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Fingertip scanning in the dark -- just as your fingertip feels surface texture by touch, the SEM's electron beam 'feels' the surface topography by collecting secondary electrons from each point, building a 3D-like image." />

      <Card title="Scanning Electron Microscopy" color={C.micro} formula="Resolution ∝ beam size, WD, voltage">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          SEM rasters a focused electron beam across the surface. Secondary electrons (SE, &lt;50 eV) give topographic
          contrast from edges and ridges. Backscattered electrons (BSE) give atomic number contrast.
          The pear-shaped interaction volume determines spatial resolution and signal depth.
        </div>

        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* SEM column */}
          <g transform="translate(100, 10)">
            {/* Electron gun */}
            <polygon points="0,-5 20,-5 10,5" fill={C.micro + "44"} stroke={C.micro} strokeWidth={1} />
            <text x={30} y={2} fontSize={7} fill={T.muted}>FEG</text>

            {/* Condenser lens */}
            <ellipse cx={10} cy={25} rx={15} ry={3} fill="none" stroke={C.accent} strokeWidth={1} />

            {/* Beam */}
            <line x1={10} y1={8} x2={10} y2={25} stroke={C.micro} strokeWidth={2} />
            <line x1={10} y1={28} x2={10} y2={60} stroke={C.micro} strokeWidth={1.5} />

            {/* Objective lens */}
            <ellipse cx={10} cy={60} rx={18} ry={3} fill="none" stroke={C.accent} strokeWidth={1} />

            {/* Focused beam */}
            <line x1={10} y1={63} x2={10} y2={63 + wd * 3} stroke={C.micro} strokeWidth={1} />

            {/* WD label */}
            <text x={25} y={63 + wd * 1.5} fontSize={7} fill={T.muted}>WD={wd}mm</text>

            {/* Scan coils */}
            <rect x={-5} y={45} width={8} height={10} fill={C.accent + "22"} stroke={C.accent} strokeWidth={0.5} />
            <rect x={17} y={45} width={8} height={10} fill={C.accent + "22"} stroke={C.accent} strokeWidth={0.5} />
            <text x={30} y={53} fontSize={6} fill={T.muted}>scan</text>
          </g>

          {/* Surface with topography */}
          <g transform="translate(30, 165)">
            <path d="M0,0 L30,-15 L50,-5 L80,-25 L100,-10 L130,-20 L160,-8 L190,-30 L220,-12 L250,-5 L280,0 L300,5 L320,0"
              fill={T.ink + "22"} stroke={T.ink} strokeWidth={1.5} />
            <text x={160} y={20} textAnchor="middle" fontSize={8} fill={T.muted}>Sample surface (topography)</text>
          </g>

          {/* Interaction volume (pear shape) */}
          <g transform="translate(180, 140)">
            <ellipse cx={0} cy={interactionDepth * 200} rx={voltage * 1.2} ry={interactionDepth * 200}
              fill={C.micro + "11"} stroke={C.micro + "44"} strokeWidth={1} />
            <text x={voltage * 1.5} y={interactionDepth * 200} fontSize={7} fill={C.micro}>
              {(interactionDepth * 1000).toFixed(0)} nm depth
            </text>

            {/* SE emission zone */}
            <ellipse cx={0} cy={5} rx={8} ry={5} fill={C.spec + "22"} stroke={C.spec} strokeWidth={0.8} />
            <text x={-25} y={8} fontSize={6} fill={C.spec}>SE</text>

            {/* BSE emission zone */}
            <ellipse cx={0} cy={15} rx={15} ry={10} fill={C.accent + "11"} stroke={C.accent} strokeWidth={0.5} />
          </g>

          {/* SE flying off */}
          {[0, 1, 2, 3].map(i => {
            const t = ((animFrame + i * 25) % 50) / 50;
            const angle = -Math.PI / 2 + (i - 1.5) * 0.5;
            return (
              <circle key={i} cx={180 + Math.cos(angle) * t * 50} cy={140 - Math.sin(Math.abs(angle)) * t * 50}
                r={1.5} fill={C.spec} opacity={1 - t} />
            );
          })}
          <text x={140} y={110} fontSize={7} fill={C.spec}>SE detector</text>
          <rect x={120} y={112} width={25} height={15} fill={C.spec + "22"} stroke={C.spec} strokeWidth={0.8} rx={3} />

          {/* Beam scanning indicator */}
          {(() => {
            const scanX = 100 + (animFrame % 50) * 4.4;
            return (
              <line x1={scanX} y1={140} x2={scanX} y2={160} stroke={C.micro} strokeWidth={1} opacity={0.6}>
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.3s" repeatCount="indefinite" />
              </line>
            );
          })()}

          {/* Signal types legend */}
          <g transform="translate(320, 40)">
            <text x={0} y={0} fontSize={8} fill={T.ink} fontWeight={600}>Signals</text>
            {[
              { label: "SE (<50 eV)", col: C.spec, info: "topography" },
              { label: "BSE", col: C.accent, info: "Z contrast" },
              { label: "X-rays", col: C.surface, info: "composition" },
              { label: "CL", col: C.adv, info: "bandgap" },
            ].map((s, i) => (
              <g key={i} transform={`translate(0, ${15 + i * 18})`}>
                <circle cx={5} cy={0} r={3} fill={s.col} />
                <text x={12} y={3} fontSize={7} fill={T.ink}>{s.label}</text>
                <text x={12} y={12} fontSize={6} fill={T.muted}>{s.info}</text>
              </g>
            ))}
          </g>

          <text x={210} y={262} textAnchor="middle" fontSize={10} fill={T.muted}>
            SEM: {voltage} kV, WD = {wd} mm, resolution ≈ {resolution.toFixed(1)} nm
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Accelerating voltage" value={voltage} min={1} max={30} step={1} onChange={setVoltage} color={C.micro} unit=" kV" format={v => v.toString()} />
            <SliderRow label="Working distance" value={wd} min={2} max={25} step={0.5} onChange={setWd} color={C.accent} unit=" mm" />
          </div>
          <div>
            <CalcRow eq="Resolution estimate" result={`~${resolution.toFixed(1)} nm`} color={C.micro} />
            <CalcRow eq="Interaction depth" result={`~${(interactionDepth * 1000).toFixed(0)} nm`} color={C.accent} />
            <CalcRow eq="SE yield" result={`~${seYield.toFixed(1)} e⁻/e⁻`} color={C.spec} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="RESOLUTION" value={`${resolution.toFixed(1)} nm`} color={C.micro} sub="SE imaging" />
          <ResultBox label="DEPTH" value={`${(interactionDepth * 1000).toFixed(0)} nm`} color={C.accent} sub="interaction volume" />
          <ResultBox label="MAGNIFICATION" value="10x-1Mx" color={C.micro} sub="typical range" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Topography, morphology, composition (with EDS)" />
          <InfoRow label="Resolution" value="~1 nm (FEG-SEM)" />
          <InfoRow label="Sample" value="Conductive or coated; vacuum compatible" />
          <InfoRow label="Limitation" value="Surface only; charging on insulators; vacuum needed" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 13. TEM Imaging ─── */
function TEMImagingSection() {
  const [voltage, setVoltage] = useState(200);
  const [defocus, setDefocus] = useState(-40);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const lambda = 12.264 / Math.sqrt(voltage * 1000 * (1 + voltage * 1000 * 0.9785e-6));
  const lambdaPm = lambda * 1000;
  const resolution = 0.61 * lambda / 0.01;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="A slide projector with electrons -- instead of light passing through a transparency, electrons pass through an ultra-thin sample, and magnetic lenses focus them into a magnified image showing atomic structure." />

      <Card title="TEM Imaging" color={C.micro} formula="λ = h / √(2meV)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          TEM transmits electrons through thin (&lt;100 nm) samples. De Broglie wavelength at 200 kV is ~2.5 pm,
          enabling atomic resolution. Bright-field/dark-field modes, phase contrast (HRTEM), and mass-thickness
          contrast reveal microstructure. Defocus controls phase contrast transfer.
        </div>

        <svg viewBox="0 0 420 280" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* TEM column schematic */}
          <g transform="translate(60, 10)">
            {/* Gun */}
            <polygon points="30,0 50,0 40,12" fill={C.micro + "66"} stroke={C.micro} strokeWidth={1} />
            <text x={55} y={8} fontSize={7} fill={T.muted}>{voltage} kV</text>

            {/* C1 lens */}
            <ellipse cx={40} cy={35} rx={25} ry={4} fill="none" stroke={C.accent} strokeWidth={1.5} />
            <text x={70} y={38} fontSize={6} fill={T.muted}>C1</text>
            {/* C2 lens */}
            <ellipse cx={40} cy={60} rx={22} ry={3} fill="none" stroke={C.accent} strokeWidth={1} />
            <text x={67} y={63} fontSize={6} fill={T.muted}>C2</text>

            {/* Parallel beam */}
            <line x1={30} y1={65} x2={30} y2={100} stroke={C.micro} strokeWidth={0.8} />
            <line x1={50} y1={65} x2={50} y2={100} stroke={C.micro} strokeWidth={0.8} />

            {/* Specimen */}
            <rect x={15} y={100} width={50} height={5} fill={C.struct + "44"} stroke={C.struct} strokeWidth={1.5} />
            <text x={70} y={105} fontSize={7} fill={C.struct}>specimen</text>

            {/* Objective lens */}
            <ellipse cx={40} cy={120} rx={28} ry={4} fill="none" stroke={C.accent} strokeWidth={1.5} />
            <text x={72} y={123} fontSize={6} fill={T.muted}>Obj.</text>

            {/* OA */}
            <rect x={33} y={135} width={3} height={3} fill={T.ink} />
            <rect x={44} y={135} width={3} height={3} fill={T.ink} />
            <text x={72} y={139} fontSize={6} fill={T.muted}>OA</text>

            {/* Intermediate/Projector */}
            <ellipse cx={40} cy={155} rx={20} ry={3} fill="none" stroke={C.accent} strokeWidth={0.8} />
            <ellipse cx={40} cy={180} rx={18} ry={3} fill="none" stroke={C.accent} strokeWidth={0.8} />

            {/* Rays diverging to screen */}
            <line x1={30} y1={105} x2={15} y2={230} stroke={C.micro} strokeWidth={0.5} opacity={0.4} />
            <line x1={50} y1={105} x2={65} y2={230} stroke={C.micro} strokeWidth={0.5} opacity={0.4} />
            <line x1={40} y1={105} x2={40} y2={230} stroke={C.micro} strokeWidth={0.5} opacity={0.4} />

            {/* Screen */}
            <rect x={10} y={228} width={60} height={5} fill={C.accent + "22"} stroke={C.accent} strokeWidth={1} />
            <text x={72} y={234} fontSize={6} fill={T.muted}>screen/CCD</text>
          </g>

          {/* HRTEM lattice image simulation */}
          <g transform="translate(210, 20)">
            <text x={90} y={0} textAnchor="middle" fontSize={9} fill={C.micro} fontWeight={700}>HRTEM Image (simulated)</text>
            <rect x={0} y={8} width={180} height={120} fill="#111" stroke={T.border} strokeWidth={1} rx={4} />
            {/* Lattice fringes */}
            {Array.from({ length: 15 }, (_, i) =>
              Array.from({ length: 12 }, (_, j) => {
                const x = 12 + i * 12;
                const y = 18 + j * 10;
                const defocusEffect = Math.cos(defocus * 0.05 + (i + j) * 0.3);
                const bright = 0.3 + 0.5 * Math.abs(defocusEffect);
                const pulse = 0.05 * Math.sin(animFrame * 0.05 + i * 0.5 + j * 0.3);
                return (
                  <circle key={`${i}-${j}`} cx={x} cy={y} r={3 + pulse * 10}
                    fill={`rgba(255,255,255,${bright})`} />
                );
              })
            )}

            {/* Scale bar */}
            <line x1={130} y1={118} x2={165} y2={118} stroke="#fff" strokeWidth={1.5} />
            <text x={147} y={115} textAnchor="middle" fontSize={7} fill="#fff">2 nm</text>
          </g>

          {/* Contrast modes */}
          <g transform="translate(210, 160)">
            <text x={90} y={0} textAnchor="middle" fontSize={8} fill={T.ink} fontWeight={600}>Contrast Modes</text>
            {[
              { label: "Bright Field (BF)", desc: "Direct beam only", col: C.micro },
              { label: "Dark Field (DF)", desc: "Diffracted beam only", col: C.accent },
              { label: "Phase Contrast (HRTEM)", desc: "Interference of multiple beams", col: C.spec },
              { label: "HAADF-STEM", desc: "Z-contrast (Z² dependence)", col: C.surface },
            ].map((m, i) => (
              <g key={i} transform={`translate(0, ${15 + i * 20})`}>
                <circle cx={8} cy={0} r={3} fill={m.col} />
                <text x={16} y={3} fontSize={8} fill={T.ink}>{m.label}</text>
                <text x={16} y={13} fontSize={7} fill={T.muted}>{m.desc}</text>
              </g>
            ))}
          </g>

          <text x={210} y={272} textAnchor="middle" fontSize={10} fill={T.muted}>
            TEM at {voltage} kV: λ = {lambdaPm.toFixed(2)} pm, defocus = {defocus} nm
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Accelerating voltage" value={voltage} min={80} max={300} step={10} onChange={setVoltage} color={C.micro} unit=" kV" format={v => v.toString()} />
            <SliderRow label="Defocus" value={defocus} min={-100} max={100} step={5} onChange={setDefocus} color={C.accent} unit=" nm" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`λ = h/√(2meV*(1+eV/2mc²))`} result={`${lambdaPm.toFixed(3)} pm`} color={C.micro} />
            <CalcRow eq={`Point resolution ≈ 0.61λ/α`} result={`~${resolution.toFixed(2)} Å`} color={C.accent} />
            <CalcRow eq="Scherzer defocus" result={`≈ -${Math.sqrt(1.2 * lambda * 1e6).toFixed(0)} nm`} color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="λ ELECTRON" value={`${lambdaPm.toFixed(2)} pm`} color={C.micro} sub={`at ${voltage} kV`} />
          <ResultBox label="RESOLUTION" value={`~${resolution.toFixed(1)} Å`} color={C.accent} sub="point resolution" />
          <ResultBox label="MAGNIFICATION" value="50x-1.5Mx" color={C.micro} sub="typical" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Atomic structure, defects, interfaces, nanoparticles" />
          <InfoRow label="Resolution" value="~0.5 Å (aberration-corrected STEM)" />
          <InfoRow label="Sample" value="<100 nm thin foil (FIB, ion milling)" />
          <InfoRow label="Limitation" value="Extremely thin sample needed; beam damage; costly" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 14. AFM ─── */
function AFMSection() {
  const [k, setK] = useState(0.5);
  const [tipDist, setTipDist] = useState(2.0);
  const [amplitude, setAmplitude] = useState(20);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const vdW = -1.0 / (tipDist * tipDist);
  const repulsive = tipDist < 1.5 ? 50 / Math.pow(tipDist, 12) : 0;
  const force = vdW + repulsive;
  const deflection = force / k;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Reading Braille at the nanoscale -- a tiny tip on a flexible cantilever 'feels' the surface, mapping every bump and valley with sub-nanometer precision, much like a finger reads raised dots." />

      <Card title="Atomic Force Microscopy" color={C.micro} formula="F = -kx (Hooke's law)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          AFM uses a sharp tip on a cantilever to scan the surface. In contact mode, the tip drags across with constant
          force. In tapping mode, the cantilever oscillates and amplitude change maps topography.
          A laser reflected off the cantilever detects deflection via a photodetector.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Cantilever + tip */}
          <g transform="translate(50, 40)">
            {/* Cantilever */}
            {(() => {
              const osc = Math.sin(animFrame * 0.3) * amplitude * 0.1;
              const tipY = 80 + osc;
              return (
                <g>
                  {/* Chip */}
                  <rect x={0} y={55} width={30} height={10} fill={T.ink + "44"} stroke={T.ink} strokeWidth={1} />
                  {/* Cantilever beam */}
                  <line x1={30} y1={60} x2={100} y2={60 + osc * 0.3} stroke={C.micro} strokeWidth={2} />
                  {/* Tip */}
                  <polygon points={`95,${60 + osc * 0.3} 100,${tipY} 105,${60 + osc * 0.3}`}
                    fill={C.micro + "44"} stroke={C.micro} strokeWidth={1} />

                  {/* Laser beam */}
                  <line x1={140} y1={20} x2={90} y2={55 + osc * 0.3} stroke="#dc2626" strokeWidth={1} />
                  <line x1={90} y1={55 + osc * 0.3} x2={160} y2={55 + osc * 0.3 - 20} stroke="#dc2626" strokeWidth={1} strokeDasharray="3,3" />
                  <circle cx={140} cy={20} r={5} fill="#dc262244" stroke="#dc2626" strokeWidth={0.8} />
                  <text x={148} y={18} fontSize={7} fill="#dc2626">laser</text>
                  {/* Detector */}
                  <rect x={155} y={30 + osc * 0.3} width={15} height={15} fill={C.accent + "22"} stroke={C.accent} strokeWidth={0.8} />
                  <text x={162} y={55} fontSize={6} fill={C.accent}>PD</text>

                  {/* Surface */}
                  <path d={`M -10,${tipY + 15} ` + Array.from({ length: 30 }, (_, i) => {
                    const x = -10 + i * 8;
                    const y = tipY + 15 + Math.sin(i * 0.8) * 5 + Math.cos(i * 1.3) * 3;
                    return `L${x},${y}`;
                  }).join(" ")} fill={T.ink + "11"} stroke={T.ink} strokeWidth={1.5} />

                  {/* Scan direction */}
                  <line x1={-10} y1={tipY + 35} x2={220} y2={tipY + 35} stroke={T.muted} strokeWidth={0.5} />
                  <text x={100} y={tipY + 45} textAnchor="middle" fontSize={7} fill={T.muted}>scan direction →</text>
                </g>
              );
            })()}
          </g>

          {/* Force-distance curve */}
          <g transform="translate(260, 20)">
            <text x={70} y={0} textAnchor="middle" fontSize={9} fill={C.micro} fontWeight={700}>Force-Distance Curve</text>
            <rect x={0} y={8} width={140} height={110} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={20} y1={65} x2={130} y2={65} stroke={T.ink} strokeWidth={0.8} />
            <line x1={70} y1={108} x2={70} y2={15} stroke={T.ink} strokeWidth={0.8} />
            <text x={130} y={60} fontSize={6} fill={T.muted}>d</text>
            <text x={74} y={18} fontSize={6} fill={T.muted}>F</text>
            <text x={100} y={55} fontSize={6} fill={C.adv}>repulsive</text>
            <text x={100} y={80} fontSize={6} fill={C.micro}>attractive</text>

            {/* Force curve */}
            <polyline points={Array.from({ length: 50 }, (_, i) => {
              const d = 0.5 + i * 0.15;
              const fvdw = -1 / (d * d);
              const frep = d < 1.5 ? 50 / Math.pow(d, 12) : 0;
              const f = fvdw + frep;
              const x = 25 + i * 2.1;
              const y = 65 - f * 8;
              return `${x},${Math.max(15, Math.min(108, y))}`;
            }).join(" ")} fill="none" stroke={C.micro} strokeWidth={1.5} />

            {/* Current point */}
            {(() => {
              const x = 25 + ((tipDist - 0.5) / 7.5) * 105;
              const y = 65 - force * 8;
              return <circle cx={Math.max(25, Math.min(130, x))} cy={Math.max(15, Math.min(108, y))} r={4} fill={C.accent} />;
            })()}

            {/* Contact/non-contact regions */}
            <line x1={45} y1={15} x2={45} y2={108} stroke={T.dim} strokeWidth={0.5} strokeDasharray="2,2" />
            <text x={33} y={105} fontSize={5} fill={T.muted}>contact</text>
            <text x={80} y={105} fontSize={5} fill={T.muted}>non-contact</text>
          </g>

          {/* Mode comparison */}
          <g transform="translate(260, 155)">
            <text x={70} y={0} textAnchor="middle" fontSize={8} fill={T.ink} fontWeight={600}>AFM Modes</text>
            {[
              { mode: "Contact", desc: "Constant force, drag tip", col: C.micro },
              { mode: "Tapping", desc: "Oscillate, amplitude feedback", col: C.accent },
              { mode: "Non-contact", desc: "Small osc., frequency shift", col: C.spec },
            ].map((m, i) => (
              <g key={i} transform={`translate(0, ${15 + i * 20})`}>
                <circle cx={5} cy={0} r={3} fill={m.col} />
                <text x={12} y={3} fontSize={7} fill={T.ink} fontWeight={600}>{m.mode}</text>
                <text x={12} y={13} fontSize={6} fill={T.muted}>{m.desc}</text>
              </g>
            ))}
          </g>

          <text x={210} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            AFM: k = {k} N/m, tip distance = {tipDist.toFixed(1)} nm, amp = {amplitude} nm
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Spring constant k" value={k} min={0.01} max={50} step={0.01} onChange={setK} color={C.micro} unit=" N/m" />
            <SliderRow label="Tip-surface distance" value={tipDist} min={0.5} max={8} step={0.1} onChange={setTipDist} color={C.accent} unit=" nm" />
            <SliderRow label="Oscillation amplitude" value={amplitude} min={1} max={100} step={1} onChange={setAmplitude} color={C.spec} unit=" nm" format={v => v.toString()} />
          </div>
          <div>
            <CalcRow eq={`F_vdW ∝ -1/d²`} result={`${vdW.toFixed(3)} nN`} color={C.micro} />
            <CalcRow eq={`F_repulsive (d<1.5)`} result={`${repulsive.toFixed(3)} nN`} color={C.adv} />
            <CalcRow eq={`F_net = F_vdW + F_rep`} result={`${force.toFixed(3)} nN`} color={C.accent} />
            <CalcRow eq={`Deflection = F/k`} result={`${deflection.toFixed(3)} nm`} color={C.micro} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="NET FORCE" value={`${force.toFixed(3)} nN`} color={C.micro} sub="tip-surface" />
          <ResultBox label="DEFLECTION" value={`${Math.abs(deflection).toFixed(3)} nm`} color={C.accent} sub="cantilever" />
          <ResultBox label="RESOLUTION" value="~0.1 nm (Z)" color={C.micro} sub="vertical" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Topography, force curves, mechanical properties" />
          <InfoRow label="Resolution" value="~0.1 nm vertical; ~1-10 nm lateral" />
          <InfoRow label="Sample" value="Any surface (air, liquid, vacuum)" />
          <InfoRow label="Limitation" value="Slow scanning; tip convolution; limited scan area" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 15. STM ─── */
function STMSection() {
  const [dist, setDist] = useState(5);
  const [phi, setPhi] = useState(4.5);
  const [bias, setBias] = useState(0.5);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const kappa = Math.sqrt(2 * 9.109e-31 * phi * 1.602e-19) / (1.055e-34);
  const kappaInvAng = kappa * 1e-10;
  const current = bias * Math.exp(-2 * kappaInvAng * dist);
  const currentNorm = current * 1e10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Two magnets almost touching -- electrons quantum tunnel across the tiny vacuum gap between the tip and sample. The tunneling current drops exponentially with distance, so even a fraction of an angstrom changes the signal dramatically." />

      <Card title="Scanning Tunneling Microscopy" color={C.micro} formula="I ∝ V·exp(-2κd), κ = √(2mφ)/ℏ">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          STM exploits quantum tunneling: a sharp metallic tip is brought within ~5-10 Å of a conducting surface.
          Applying a bias V causes electrons to tunnel across the gap. The current decays exponentially with distance d,
          giving atomic-resolution topography and electronic structure (LDOS).
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* STM tip */}
          <g transform="translate(80, 30)">
            {/* Tip */}
            <polygon points="0,0 40,0 20,70" fill={C.micro + "44"} stroke={C.micro} strokeWidth={1.5} />
            <text x={45} y={20} fontSize={8} fill={C.micro}>tip</text>

            {/* Gap */}
            <line x1={10} y1={75} x2={30} y2={75} stroke={C.accent} strokeWidth={0.5} strokeDasharray="2,2" />
            <text x={35} y={78} fontSize={7} fill={C.accent}>d = {dist} Å</text>

            {/* Tunneling wavefunction */}
            <polyline points={Array.from({ length: 40 }, (_, i) => {
              const x = 20;
              const y = 70 + i * 1;
              const psi = Math.exp(-kappaInvAng * (i * dist / 40)) * Math.sin(animFrame * 0.2 + i * 0.5);
              return `${x + psi * 15},${y}`;
            }).join(" ")} fill="none" stroke={C.micro} strokeWidth={1.2} opacity={0.6} />

            {/* Surface atoms */}
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={-20 + i * 12} cy={75 + dist * 2 + 5} r={5}
                fill={T.ink + "33"} stroke={T.ink} strokeWidth={1} />
            ))}

            {/* Tunneling electrons */}
            {[0, 1, 2].map(i => {
              const t = ((animFrame * 2 + i * 33) % 100) / 100;
              const ey = 68 + t * (dist * 2 + 5);
              const opacity = Math.exp(-kappaInvAng * t * dist) * 0.8;
              return (
                <circle key={i} cx={20 + Math.sin(t * 5 + i) * 3} cy={ey} r={2}
                  fill={C.micro} opacity={opacity} />
              );
            })}
          </g>

          {/* I vs d plot */}
          <g transform="translate(230, 20)">
            <text x={80} y={0} textAnchor="middle" fontSize={9} fill={C.micro} fontWeight={700}>Tunneling Current vs Distance</text>
            <rect x={0} y={8} width={170} height={100} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={20} y1={95} x2={160} y2={95} stroke={T.ink} strokeWidth={0.8} />
            <line x1={20} y1={95} x2={20} y2={18} stroke={T.ink} strokeWidth={0.8} />
            <text x={90} y={113} textAnchor="middle" fontSize={7} fill={T.muted}>d (Å)</text>
            <text x={8} y={55} fontSize={7} fill={T.muted} transform="rotate(-90,8,55)">I (a.u.)</text>

            {/* Exponential curve */}
            <polyline points={Array.from({ length: 60 }, (_, i) => {
              const d_val = 3 + i * 0.15;
              const x = 20 + (d_val - 3) / 7 * 135;
              const I_val = Math.exp(-2 * kappaInvAng * d_val);
              const y = 95 - I_val * 2e5;
              return `${x},${Math.max(18, y)}`;
            }).join(" ")} fill="none" stroke={C.micro} strokeWidth={1.5} />

            {/* Current point */}
            {(() => {
              const x = 20 + (dist - 3) / 7 * 135;
              const I_val = Math.exp(-2 * kappaInvAng * dist);
              const y = 95 - I_val * 2e5;
              return <circle cx={Math.max(20, Math.min(160, x))} cy={Math.max(18, y)} r={4} fill={C.accent} />;
            })()}
          </g>

          {/* Constant current mode */}
          <g transform="translate(230, 140)">
            <text x={80} y={0} textAnchor="middle" fontSize={8} fill={T.ink} fontWeight={600}>STM Modes</text>
            <rect x={0} y={8} width={170} height={50} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            {/* Constant current - tip follows surface */}
            <polyline points="15,35 30,25 45,30 60,20 75,28 90,22 105,35 120,30 135,25 150,32"
              fill="none" stroke={C.micro} strokeWidth={1.2} />
            <text x={85} y={50} textAnchor="middle" fontSize={7} fill={C.micro}>Constant current → topography</text>

            {/* dI/dV */}
            <text x={85} y={75} textAnchor="middle" fontSize={7} fill={C.accent}>dI/dV spectroscopy → LDOS</text>
          </g>

          {/* Energy diagram */}
          <g transform="translate(30, 160)">
            <text x={60} y={0} textAnchor="middle" fontSize={8} fill={T.ink}>Energy Diagram</text>
            {/* Tip */}
            <rect x={0} y={15} width={40} height={60} fill={C.micro + "11"} stroke={C.micro} strokeWidth={1} />
            <text x={20} y={80} textAnchor="middle" fontSize={6} fill={C.micro}>tip</text>
            {/* Barrier */}
            <rect x={40} y={15} width={dist * 5} height={60} fill={C.accent + "08"} stroke={C.accent} strokeWidth={0.5} strokeDasharray="2,2" />
            <text x={40 + dist * 2.5} y={12} textAnchor="middle" fontSize={6} fill={C.accent}>φ = {phi} eV</text>
            {/* Sample */}
            <rect x={40 + dist * 5} y={15 + bias * 15} width={40} height={60 - bias * 15} fill={C.spec + "11"} stroke={C.spec} strokeWidth={1} />
            <text x={60 + dist * 5} y={80} textAnchor="middle" fontSize={6} fill={C.spec}>sample</text>
            {/* Fermi levels */}
            <line x1={0} y1={45} x2={40} y2={45} stroke={C.micro} strokeWidth={1} />
            <line x1={40 + dist * 5} y1={45 + bias * 15} x2={80 + dist * 5} y2={45 + bias * 15} stroke={C.spec} strokeWidth={1} />
            <text x={-5} y={42} fontSize={6} fill={C.micro}>E_F</text>
            <text x={85 + dist * 5} y={48 + bias * 15} fontSize={6} fill={C.spec}>E_F</text>
            {/* eV label */}
            <text x={40 + dist * 2.5} y={48} textAnchor="middle" fontSize={7} fill={C.accent}>eV = {bias} V</text>
          </g>

          <text x={210} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            STM: d = {dist} Å, φ = {phi} eV, V = {bias} V
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Tip-surface distance d" value={dist} min={3} max={10} step={0.1} onChange={setDist} color={C.micro} unit=" Å" />
            <SliderRow label="Work function φ" value={phi} min={3.0} max={5.5} step={0.1} onChange={setPhi} color={C.accent} unit=" eV" />
            <SliderRow label="Bias voltage V" value={bias} min={0.01} max={3.0} step={0.01} onChange={setBias} color={C.micro} unit=" V" />
          </div>
          <div>
            <CalcRow eq={`κ = √(2mφ)/ℏ`} result={`${(kappaInvAng).toFixed(3)} Å⁻¹`} color={C.micro} />
            <CalcRow eq={`exp(-2κd) = exp(-${(2 * kappaInvAng * dist).toFixed(2)})`} result={Math.exp(-2 * kappaInvAng * dist).toExponential(2)} color={C.accent} />
            <CalcRow eq={`I ∝ V·exp(-2κd)`} result={`${currentNorm.toExponential(2)} a.u.`} color={C.micro} />
            <CalcRow eq="Δd = 1Å → I change" result={`${(Math.exp(2 * kappaInvAng)).toFixed(0)}x`} color={C.accent} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="TUNNEL CURRENT" value={currentNorm.toExponential(2)} color={C.micro} sub="arb. units" />
          <ResultBox label="DECAY CONST κ" value={`${kappaInvAng.toFixed(2)} Å⁻¹`} color={C.accent} sub="inv. decay length" />
          <ResultBox label="RESOLUTION" value="~0.1 nm" color={C.micro} sub="atomic" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Atomic topography, LDOS, electronic structure" />
          <InfoRow label="Resolution" value="~0.01 nm vertical, ~0.1 nm lateral" />
          <InfoRow label="Sample" value="Conductive/semiconducting; UHV or ambient" />
          <InfoRow label="Limitation" value="Needs conducting sample; vibration-sensitive; UHV preferred" />
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BLOCK 5 — ADVANCED & IN-SITU
   ════════════════════════════════════════════════════════════════════ */

/* ─── 16. Synchrotron ─── */
function SynchrotronSection() {
  const [electronE, setElectronE] = useState(3.0);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const criticalE = 0.665 * electronE * electronE * 1.5;
  const brilliance = Math.pow(10, 18 + (electronE - 2) * 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Flashlight vs laser searchlight -- a synchrotron is millions of times brighter than an X-ray tube, like comparing a laser to a candle. It produces tunable, polarized, pulsed X-rays for every technique imaginable." />

      <Card title="Synchrotron Radiation" color={C.adv} formula="E_c = 0.665 × E² × B (keV)">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Synchrotrons accelerate electrons to near light-speed in a storage ring. When bent by magnets,
          they emit extremely bright, collimated X-rays across a broad spectrum. Insertion devices (undulators,
          wigglers) further boost brilliance. Key advantage: tunable energy for XAS, diffraction, imaging.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Storage ring */}
          <g transform="translate(130, 120)">
            <ellipse cx={0} cy={0} rx={80} ry={60} fill="none" stroke={C.adv} strokeWidth={2} />

            {/* Bending magnets */}
            {[0, 60, 120, 180, 240, 300].map((ang, i) => {
              const rad = (ang * Math.PI) / 180;
              const mx = 80 * Math.cos(rad);
              const my = 60 * Math.sin(rad);
              return (
                <g key={i}>
                  <rect x={mx - 6} y={my - 4} width={12} height={8} fill={C.accent + "44"} stroke={C.accent} strokeWidth={1} rx={2}
                    transform={`rotate(${ang}, ${mx}, ${my})`} />
                  {/* Beamline */}
                  <line x1={mx} y1={my} x2={mx + Math.cos(rad + Math.PI / 2) * 30} y2={my + Math.sin(rad + Math.PI / 2) * 30}
                    stroke={C.adv} strokeWidth={0.8} strokeDasharray="2,2" opacity={0.5} />
                </g>
              );
            })}

            {/* Electron bunch */}
            {(() => {
              const ang = ((animFrame * 3) % 360) * Math.PI / 180;
              return (
                <g>
                  <circle cx={80 * Math.cos(ang)} cy={60 * Math.sin(ang)} r={4} fill={C.adv}>
                    <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  {/* Trail */}
                  {[1, 2, 3].map(i => {
                    const ta = ang - i * 0.15;
                    return (
                      <circle key={i} cx={80 * Math.cos(ta)} cy={60 * Math.sin(ta)} r={2}
                        fill={C.adv} opacity={0.5 - i * 0.15} />
                    );
                  })}
                </g>
              );
            })()}

            {/* Injection */}
            <line x1={85} y1={0} x2={110} y2={-20} stroke={C.micro} strokeWidth={1} />
            <text x={112} y={-22} fontSize={7} fill={C.micro}>injection</text>

            {/* Beamline extending out */}
            <line x1={0} y1={-60} x2={0} y2={-90} stroke={C.adv} strokeWidth={1.5} />
            <rect x={-8} y={-100} width={16} height={8} fill={T.panel} stroke={C.adv} strokeWidth={1} rx={2} />
            <text x={0} y={-105} textAnchor="middle" fontSize={7} fill={C.adv}>beamline</text>

            <text x={0} y={5} textAnchor="middle" fontSize={8} fill={C.adv} fontWeight={700}>{electronE} GeV</text>
          </g>

          {/* Brilliance comparison */}
          <g transform="translate(280, 20)">
            <text x={55} y={0} textAnchor="middle" fontSize={9} fill={C.adv} fontWeight={700}>Brilliance</text>
            {[
              { label: "X-ray tube", val: 8, col: T.muted },
              { label: "Rotating anode", val: 10, col: T.muted },
              { label: "Bend. magnet", val: 15, col: C.accent },
              { label: "Wiggler", val: 17, col: C.accent },
              { label: "Undulator", val: 20, col: C.adv },
              { label: "4th gen (FEL)", val: 25, col: C.adv },
            ].map((s, i) => (
              <g key={i} transform={`translate(0, ${15 + i * 30})`}>
                <rect x={0} y={0} width={s.val * 4.5} height={16} fill={s.col + "22"} stroke={s.col} strokeWidth={0.8} rx={3} />
                <text x={5} y={12} fontSize={7} fill={s.col} fontWeight={600}>10^{s.val}</text>
                <text x={0} y={25} fontSize={6} fill={T.muted}>{s.label}</text>
              </g>
            ))}
            <text x={55} y={208} textAnchor="middle" fontSize={7} fill={T.muted}>ph/s/mm²/mrad²/0.1%BW</text>
          </g>

          <text x={130} y={252} textAnchor="middle" fontSize={10} fill={T.muted}>
            Synchrotron: {electronE} GeV, E_c = {criticalE.toFixed(1)} keV
          </text>
        </svg>

        <SliderRow label="Electron energy" value={electronE} min={2} max={8} step={0.5} onChange={setElectronE} color={C.adv} unit=" GeV" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <div>
            <CalcRow eq={`E_c = 0.665 × ${electronE}² × 1.5T`} result={`${criticalE.toFixed(1)} keV`} color={C.adv} />
            <CalcRow eq="Brilliance (undulator)" result={`~10²⁰ ph/s/...`} color={C.accent} />
          </div>
          <div>
            <CalcRow eq="Pulse length" result="~100 ps" color={T.muted} />
            <CalcRow eq="Energy range" result="IR to hard X-ray" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="CRITICAL ENERGY" value={`${criticalE.toFixed(1)} keV`} color={C.adv} sub={`at ${electronE} GeV`} />
          <ResultBox label="BRILLIANCE" value={`~10²⁰`} color={C.accent} sub="undulator peak" />
          <ResultBox label="TUNABILITY" value="Continuous" color={C.adv} sub="IR → hard X-ray" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it enables" value="XAS, diffraction, imaging, ptychography, SAXS/WAXS" />
          <InfoRow label="Advantage" value="10¹-10¹⁰x brighter than lab sources" />
          <InfoRow label="Facilities" value="APS, ESRF, SPring-8, Diamond, NSLS-II" />
          <InfoRow label="Limitation" value="Requires facility access; beamtime allocation" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 17. In-situ TEM ─── */
function InSituTEMSection() {
  const [temperature, setTemperature] = useState(300);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 150), 50);
    return () => clearInterval(id);
  }, []);

  const nucleationRate = Math.exp(-5000 / temperature) * 1e10;
  const growthRate = temperature > 400 ? (temperature - 400) * 0.01 : 0;
  const phase = temperature > 600 ? "transformed" : temperature > 400 ? "nucleating" : "parent";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text='Watching a movie vs looking at a photograph -- in-situ TEM lets you observe phase transformations, crystal growth, and reactions in real time at atomic resolution, like filming instead of just snapping a photo.' />

      <Card title="In-situ TEM" color={C.adv} formula="Real-time observation at atomic scale">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          In-situ TEM uses specialized holders (heating, biasing, gas cell, liquid cell) to observe dynamic processes
          inside the TEM. Environmental TEM (ETEM) allows gas-phase reactions. MEMS-based heaters reach &gt;1000°C with
          minimal drift. Captures nucleation, growth, phase transitions, sintering, catalysis in real time.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Phase transformation animation */}
          <g transform="translate(30, 20)">
            <text x={170} y={0} textAnchor="middle" fontSize={9} fill={C.adv} fontWeight={700}>
              Phase Transformation ({phase}) at {temperature} K
            </text>

            {/* Parent matrix */}
            <rect x={0} y={15} width={340} height={160} fill={C.struct + "11"} stroke={C.struct} strokeWidth={1} rx={4} />

            {/* Parent crystal grid */}
            {Array.from({ length: 20 }, (_, i) =>
              Array.from({ length: 10 }, (_, j) => {
                const x = 10 + i * 17;
                const y = 25 + j * 15;
                const isNucleated = temperature > 400 && Math.sqrt((x - 170) ** 2 + (y - 95) ** 2) < growthRate * 20 + 15;
                const isNucleated2 = temperature > 500 && Math.sqrt((x - 80) ** 2 + (y - 70) ** 2) < (growthRate - 1) * 15 + 10;
                const isNucleated3 = temperature > 550 && Math.sqrt((x - 260) ** 2 + (y - 120) ** 2) < (growthRate - 1.5) * 12 + 8;
                const transformed = isNucleated || isNucleated2 || isNucleated3;

                const jitter = transformed ? Math.sin(animFrame * 0.1 + i + j) * 1 : 0;
                return (
                  <circle key={`${i}-${j}`} cx={x + jitter} cy={y + jitter * 0.5}
                    r={transformed ? 3.5 : 2.5}
                    fill={transformed ? C.adv + "88" : C.struct + "44"}
                    stroke={transformed ? C.adv : C.struct + "66"} strokeWidth={0.5} />
                );
              })
            )}

            {/* Nucleation sites with labels */}
            {temperature > 400 && (
              <g>
                <circle cx={170} cy={95} r={growthRate * 20 + 15} fill="none" stroke={C.adv} strokeWidth={1} strokeDasharray="3,3" />
                <text x={170} y={95} textAnchor="middle" fontSize={7} fill={C.adv}>nucleus 1</text>
              </g>
            )}
            {temperature > 500 && (
              <circle cx={80} cy={70} r={(growthRate - 1) * 15 + 10} fill="none" stroke={C.adv} strokeWidth={0.8} strokeDasharray="3,3" />
            )}
            {temperature > 550 && (
              <circle cx={260} cy={120} r={(growthRate - 1.5) * 12 + 8} fill="none" stroke={C.adv} strokeWidth={0.8} strokeDasharray="3,3" />
            )}

            {/* Temperature indicator */}
            <rect x={290} y={25} width={40} height={140} fill={T.panel} stroke={T.border} strokeWidth={1} rx={3} />
            <rect x={295} y={25 + 130 * (1 - (temperature - 200) / 800)} width={30}
              height={130 * ((temperature - 200) / 800)}
              fill={temperature > 600 ? C.adv : temperature > 400 ? C.accent : C.struct}
              rx={2} />
            <text x={310} y={20} textAnchor="middle" fontSize={7} fill={T.ink}>{temperature} K</text>
          </g>

          {/* Timeline bar */}
          <g transform="translate(30, 200)">
            <rect x={0} y={0} width={340} height={20} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            <rect x={0} y={0} width={340 * (animFrame / 150)} height={20} fill={C.adv + "22"} rx={3} />
            {/* Stage markers */}
            <line x1={0} y1={22} x2={0} y2={30} stroke={C.struct} strokeWidth={1} />
            <text x={0} y={38} fontSize={6} fill={C.struct}>start</text>
            <line x1={113} y1={22} x2={113} y2={30} stroke={C.accent} strokeWidth={1} />
            <text x={113} y={38} textAnchor="middle" fontSize={6} fill={C.accent}>nucleation</text>
            <line x1={226} y1={22} x2={226} y2={30} stroke={C.adv} strokeWidth={1} />
            <text x={226} y={38} textAnchor="middle" fontSize={6} fill={C.adv}>growth</text>
            <line x1={340} y1={22} x2={340} y2={30} stroke={C.adv} strokeWidth={1} />
            <text x={340} y={38} textAnchor="end" fontSize={6} fill={C.adv}>complete</text>
          </g>

          <text x={210} y={255} textAnchor="middle" fontSize={10} fill={T.muted}>
            In-situ TEM: {phase} phase at {temperature} K
          </text>
        </svg>

        <SliderRow label="Temperature" value={temperature} min={200} max={1000} step={10} onChange={setTemperature} color={C.adv} unit=" K" format={v => v.toString()} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <div>
            <CalcRow eq="Nucleation rate ∝ exp(-Q/kT)" result={nucleationRate.toExponential(1)} color={C.adv} />
            <CalcRow eq="Growth rate" result={`${growthRate.toFixed(2)} nm/s`} color={C.accent} />
          </div>
          <div>
            <CalcRow eq="Phase state" result={phase} color={C.adv} />
            <CalcRow eq="Frame rate" result="30-1000 fps" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="TEMPERATURE" value={`${temperature} K`} color={C.adv} sub="MEMS heater" />
          <ResultBox label="PHASE" value={phase} color={phase === "transformed" ? C.adv : C.struct} sub="current state" />
          <ResultBox label="TIME RES." value="~ms" color={C.adv} sub="direct electron det." />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="Dynamic processes: nucleation, growth, sintering" />
          <InfoRow label="Capabilities" value="Heating (1200°C), gas (1 bar), liquid, biasing" />
          <InfoRow label="Resolution" value="Atomic (with aberration correction)" />
          <InfoRow label="Limitation" value="Electron beam effects; thin sample limits; drift" />
        </div>
      </Card>
    </div>
  );
}

/* ─── 18. APT ─── */
function APTSection() {
  const [voltage, setVoltage] = useState(5000);
  const [detEff, setDetEff] = useState(0.57);
  const [animFrame, setAnimFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const flightDist = 0.1;
  const massExample = 56;
  const tof = flightDist * Math.sqrt(massExample * 1.66e-27 / (2 * 1.602e-19 * voltage)) * 1e9;
  const evapField = 30 + voltage * 0.005;
  const atomsDetected = Math.floor(1000000 * detEff);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnalogyBox text="Peeling an onion atom by atom -- APT rips individual atoms from a needle-shaped specimen using an enormous electric field, then identifies each one by mass and maps its original 3D position. It's the only technique that gives true 3D atomic-scale chemistry." />

      <Card title="Atom Probe Tomography" color={C.adv} formula="m/q = 2eV(t/d)²">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          APT applies a high voltage (+ laser pulse) to a needle specimen (&lt;100 nm tip radius). Atoms are field-evaporated
          as ions and fly to a position-sensitive detector. Time-of-flight gives mass-to-charge ratio: m/q = 2eV(t/d)².
          Hit positions + sequence = 3D atomic reconstruction.
        </div>

        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Needle specimen */}
          <g transform="translate(60, 50)">
            {/* Specimen base */}
            <rect x={-10} y={100} width={30} height={40} fill={T.ink + "22"} stroke={T.ink} strokeWidth={1} />
            {/* Needle */}
            <polygon points="-8,100 18,100 10,20 2,20" fill={C.adv + "44"} stroke={C.adv} strokeWidth={1.5} />
            {/* Tip atoms */}
            {Array.from({ length: 6 }, (_, i) =>
              Array.from({ length: Math.max(1, 4 - i) }, (_, j) => {
                const x = 5 + (j - (Math.max(1, 4 - i) - 1) / 2) * 5;
                const y = 25 + i * 5;
                const evaporating = i === 0 && j === Math.floor(animFrame / 30) % Math.max(1, 4 - i);
                return (
                  <circle key={`${i}-${j}`} cx={x} cy={y} r={2}
                    fill={evaporating ? C.accent : C.adv + "88"} stroke={evaporating ? C.accent : C.adv} strokeWidth={0.5}>
                    {evaporating && <animate attributeName="r" values="2;1;2" dur="0.3s" repeatCount="indefinite" />}
                  </circle>
                );
              })
            )}
            <text x={5} y={155} textAnchor="middle" fontSize={8} fill={T.muted}>specimen</text>
            <text x={5} y={12} textAnchor="middle" fontSize={7} fill={C.adv}>tip</text>
          </g>

          {/* Flying ions */}
          {[0, 1, 2, 3].map(i => {
            const t = ((animFrame * 2 + i * 30) % 120) / 120;
            const sx = 65;
            const sy = 25 + i * 3;
            const ex = 300;
            const ey = 80 + (i - 1.5) * 40;
            const cx = sx + (ex - sx) * t;
            const cy = sy + (ey - sy) * t;
            const colors = [C.adv, C.micro, C.accent, C.spec];
            return (
              <g key={i} opacity={t < 0.95 ? 0.8 : 0}>
                <circle cx={cx} cy={cy} r={2.5} fill={colors[i]} />
                {t < 0.3 && <text x={cx + 5} y={cy} fontSize={6} fill={colors[i]}>+</text>}
              </g>
            );
          })}

          {/* Flight path */}
          <line x1={65} y1={50} x2={290} y2={50} stroke={C.adv} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.3} />

          {/* Position-sensitive detector */}
          <g transform="translate(290, 20)">
            <rect x={0} y={0} width={60} height={120} fill={T.panel} stroke={C.adv} strokeWidth={1.5} rx={4} />
            <text x={30} y={-5} textAnchor="middle" fontSize={8} fill={C.adv} fontWeight={700}>Detector</text>
            {/* Detected hits */}
            {Array.from({ length: 20 }, (_, i) => {
              const hx = 5 + Math.random() * 50;
              const hy = 5 + Math.random() * 110;
              const colors = [C.adv, C.micro, C.accent, C.spec, C.struct];
              return (
                <circle key={i} cx={hx} cy={hy} r={1.5} fill={colors[i % 5]}
                  opacity={0.3 + 0.5 * Math.sin(animFrame * 0.1 + i)} />
              );
            })}
            <text x={30} y={135} textAnchor="middle" fontSize={7} fill={T.muted}>x,y + TOF</text>
          </g>

          {/* 3D reconstruction */}
          <g transform="translate(210, 160)">
            <text x={70} y={0} textAnchor="middle" fontSize={9} fill={C.adv} fontWeight={700}>3D Reconstruction</text>
            <rect x={0} y={8} width={140} height={80} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            {/* 3D scatter of atoms */}
            {Array.from({ length: 50 }, (_, i) => {
              const ax = 10 + (i * 7 + Math.sin(i * 2.1) * 15) % 120;
              const ay = 15 + (i * 11 + Math.cos(i * 1.7) * 10) % 65;
              const isType2 = i % 3 === 0;
              const isType3 = i % 5 === 0;
              const depth = (i * 13) % 30;
              return (
                <circle key={i} cx={ax} cy={ay} r={isType3 ? 3 : isType2 ? 2.5 : 2}
                  fill={isType3 ? C.accent : isType2 ? C.micro : C.adv}
                  opacity={0.4 + depth * 0.02} />
              );
            })}
            {/* Legend */}
            <g transform="translate(5, 75)">
              <circle cx={5} cy={0} r={2} fill={C.adv} /><text x={10} y={3} fontSize={5} fill={T.muted}>Fe</text>
              <circle cx={30} cy={0} r={2} fill={C.micro} /><text x={35} y={3} fontSize={5} fill={T.muted}>Cu</text>
              <circle cx={55} cy={0} r={2} fill={C.accent} /><text x={60} y={3} fontSize={5} fill={T.muted}>C</text>
            </g>
          </g>

          {/* Mass spectrum */}
          <g transform="translate(30, 170)">
            <text x={70} y={0} textAnchor="middle" fontSize={8} fill={T.ink}>Mass Spectrum</text>
            <rect x={0} y={5} width={140} height={60} fill={T.panel} stroke={T.border} strokeWidth={0.8} rx={3} />
            <line x1={10} y1={55} x2={130} y2={55} stroke={T.ink} strokeWidth={0.5} />
            {/* Peaks */}
            {[
              { m: 12, h: 25, label: "C" },
              { m: 28, h: 40, label: "Fe²⁺" },
              { m: 56, h: 50, label: "Fe⁺" },
              { m: 63, h: 20, label: "Cu" },
            ].map((pk, i) => {
              const x = 10 + (pk.m / 80) * 120;
              return (
                <g key={i}>
                  <line x1={x} y1={55} x2={x} y2={55 - pk.h} stroke={C.adv} strokeWidth={1.5} />
                  <text x={x} y={55 - pk.h - 3} textAnchor="middle" fontSize={5} fill={C.adv}>{pk.label}</text>
                </g>
              );
            })}
            <text x={70} y={72} textAnchor="middle" fontSize={6} fill={T.muted}>m/q (Da)</text>
          </g>

          <text x={210} y={255} textAnchor="middle" fontSize={10} fill={T.muted}>
            APT: {voltage} V, detection eff. = {(detEff * 100).toFixed(0)}%, TOF = {tof.toFixed(1)} ns
          </text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
          <div>
            <SliderRow label="Applied voltage" value={voltage} min={1000} max={15000} step={100} onChange={setVoltage} color={C.adv} unit=" V" format={v => v.toString()} />
            <SliderRow label="Detection efficiency" value={detEff} min={0.30} max={0.80} step={0.01} onChange={setDetEff} color={C.accent}
              format={v => (v * 100).toFixed(0) + "%"} />
          </div>
          <div>
            <CalcRow eq={`TOF (Fe, d=0.1m)`} result={`${tof.toFixed(1)} ns`} color={C.adv} />
            <CalcRow eq={`m/q = 2eV(t/d)²`} result={`56 Da (Fe⁺)`} color={C.accent} />
            <CalcRow eq={`Atoms detected (1M total)`} result={`${atomsDetected.toLocaleString()}`} color={C.adv} />
            <CalcRow eq="Spatial resolution" result="~0.2 nm (depth)" color={T.muted} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          <ResultBox label="TOF (Fe)" value={`${tof.toFixed(1)} ns`} color={C.adv} sub="time of flight" />
          <ResultBox label="DETECTION" value={`${(detEff * 100).toFixed(0)}%`} color={C.accent} sub="of evaporated ions" />
          <ResultBox label="VOLUME" value="~100×100×300 nm" color={C.adv} sub="typical tip" />
        </div>

        <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
          <InfoRow label="What it measures" value="3D atomic composition, interfaces, segregation" />
          <InfoRow label="Resolution" value="~0.1-0.3 nm depth; ~0.3-0.5 nm lateral" />
          <InfoRow label="Sample" value="Needle <100 nm tip; FIB prepared" />
          <InfoRow label="Limitation" value="Small volume; reconstruction artifacts; complex prep" />
        </div>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION & BLOCK DEFINITIONS
   ════════════════════════════════════════════════════════════════════ */

const CHAR_BLOCKS = [
  { id: "structural", label: "Structural Techniques", color: C.struct },
  { id: "surface", label: "Surface & Composition", color: C.surface },
  { id: "spectroscopy", label: "Spectroscopy", color: C.spec },
  { id: "microscopy", label: "Microscopy", color: C.micro },
  { id: "advanced", label: "Advanced & In-situ", color: C.adv },
];

const CHAR_SECTIONS = [
  // Block 1: Structural
  { id: "xrd", label: "X-ray Diffraction", block: "structural", color: C.struct, Component: XRDSection,
    nextReason: "Now that we can identify crystal structures, let's map grain orientations with EBSD." },
  { id: "ebsd", label: "EBSD", block: "structural", color: C.struct, Component: EBSDSection,
    nextReason: "EBSD maps orientations in bulk SEM. For thin samples, TEM diffraction gives even more detail." },
  { id: "tem-diff", label: "TEM Diffraction", block: "structural", color: C.struct, Component: TEMDiffractionSection,
    nextReason: "Structural techniques done! Next: surface and compositional analysis starting with XPS." },

  // Block 2: Surface & Composition
  { id: "xps", label: "XPS", block: "surface", color: C.surface, Component: XPSSection,
    nextReason: "XPS identifies elements by binding energy. Auger spectroscopy offers even better spatial resolution." },
  { id: "aes", label: "Auger (AES)", block: "surface", color: C.surface, Component: AESSection,
    nextReason: "AES gives surface composition with nm resolution. For depth profiles, SIMS sputters layer by layer." },
  { id: "sims", label: "SIMS", block: "surface", color: C.surface, Component: SIMSSection,
    nextReason: "SIMS profiles depth composition. For quick elemental ID in the electron microscope, we use EDS." },
  { id: "eds", label: "EDS", block: "surface", color: C.surface, Component: EDSSection,
    nextReason: "Surface and composition techniques covered! Moving on to spectroscopy for bonding and electronic structure." },

  // Block 3: Spectroscopy
  { id: "xanes", label: "XANES / EXAFS", block: "spectroscopy", color: C.spec, Component: XANESSection,
    nextReason: "X-ray absorption probes local bonding. Raman uses light scattering for vibrational fingerprints." },
  { id: "raman", label: "Raman", block: "spectroscopy", color: C.spec, Component: RamanSection,
    nextReason: "Raman reveals vibrations. Photoluminescence probes electronic recombination at bandgaps and defects." },
  { id: "pl", label: "Photoluminescence", block: "spectroscopy", color: C.spec, Component: PLSection,
    nextReason: "PL maps radiative recombination. UV-Vis measures optical absorption and extracts bandgaps." },
  { id: "uvvis", label: "UV-Vis / Tauc", block: "spectroscopy", color: C.spec, Component: UVVisSection,
    nextReason: "Spectroscopy complete! Now for real-space imaging with microscopy techniques." },

  // Block 4: Microscopy
  { id: "sem", label: "SEM", block: "microscopy", color: C.micro, Component: SEMSection,
    nextReason: "SEM images surfaces. For internal structure at atomic resolution, we need TEM." },
  { id: "tem-img", label: "TEM Imaging", block: "microscopy", color: C.micro, Component: TEMImagingSection,
    nextReason: "TEM reveals atomic structure. AFM maps topography without electrons, even in air or liquid." },
  { id: "afm", label: "AFM", block: "microscopy", color: C.micro, Component: AFMSection,
    nextReason: "AFM feels the surface with a tip. STM uses quantum tunneling for true atomic resolution on conductors." },
  { id: "stm", label: "STM", block: "microscopy", color: C.micro, Component: STMSection,
    nextReason: "All microscopy techniques covered! Finally: advanced and in-situ methods pushing the frontier." },

  // Block 5: Advanced
  { id: "synchrotron", label: "Synchrotron", block: "advanced", color: C.adv, Component: SynchrotronSection,
    nextReason: "Synchrotrons provide the light. In-situ TEM uses it (and electrons) to watch reactions in real time." },
  { id: "insitu-tem", label: "In-situ TEM", block: "advanced", color: C.adv, Component: InSituTEMSection,
    nextReason: "In-situ TEM watches dynamics. Atom probe tomography maps composition in 3D, atom by atom." },
  { id: "apt", label: "Atom Probe (APT)", block: "advanced", color: C.adv, Component: APTSection,
    nextReason: "" },
];

/* ════════════════════════════════════════════════════════════════════
   MAIN MODULE
   ════════════════════════════════════════════════════════════════════ */

function CharacterizationModule() {
  const [active, setActive] = useState(CHAR_SECTIONS[0].id);
  const [activeBlock, setActiveBlock] = useState(CHAR_BLOCKS[0].id);
  const sec = CHAR_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const blockSections = CHAR_SECTIONS.filter(s => s.block === activeBlock);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink, display: "flex", flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{ display: "flex", gap: 0, background: T.panel, borderBottom: `1.5px solid ${T.border}`, overflowX: "auto" }}>
        {CHAR_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); const first = CHAR_SECTIONS.find(s => s.block === b.id); if (first) setActive(first.id); }} style={{
            flex: 1, padding: "12px 10px", cursor: "pointer", border: "none", fontSize: 11, fontWeight: 700,
            background: activeBlock === b.id ? b.color + "12" : T.panel,
            borderBottom: activeBlock === b.id ? `3px solid ${b.color}` : "3px solid transparent",
            color: activeBlock === b.id ? b.color : T.muted,
            fontFamily: "'IBM Plex Mono', monospace", minWidth: 100,
          }}>{b.label}</button>
        ))}
      </div>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, padding: "8px 16px", background: T.surface, borderBottom: `1px solid ${T.border}`, overflowX: "auto", flexWrap: "wrap" }}>
        {blockSections.map((s, i) => {
          const globalIdx = CHAR_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 10, cursor: "pointer", border: "none",
              background: active === s.id ? sec.color + "18" : T.panel,
              color: active === s.id ? sec.color : T.muted, fontWeight: active === s.id ? 700 : 500,
              fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap",
              boxShadow: active === s.id ? `0 0 0 1.5px ${sec.color}` : `0 0 0 1px ${T.border}`,
            }}>{globalIdx + 1}. {s.label}</button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "18px 20px 30px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <Component />
        {/* Next reason */}
        <div style={{ marginTop: 18, fontSize: 12, color: T.muted, lineHeight: 1.8, background: T.surface, padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}` }}>
          {(() => { const idx = CHAR_SECTIONS.findIndex(s => s.id === active); const next = CHAR_SECTIONS[idx + 1]; return next ? <span>Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>. {sec.nextReason}</span> : <span style={{ fontWeight: 700, color: C.adv }}>Chapter complete! You have explored all 18 materials characterization techniques.</span>; })()}
        </div>
        {/* Prev/Next */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <button onClick={() => { const i = CHAR_SECTIONS.findIndex(s => s.id === active); if (i > 0) { setActive(CHAR_SECTIONS[i-1].id); setActiveBlock(CHAR_SECTIONS[i-1].block); } }} disabled={active === CHAR_SECTIONS[0].id} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CHAR_SECTIONS[0].id ? T.surface : sec.color + "22",
            border: `1px solid ${active === CHAR_SECTIONS[0].id ? T.border : sec.color}`, color: active === CHAR_SECTIONS[0].id ? T.muted : sec.color,
            cursor: active === CHAR_SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>{"←"} Prev</button>
          <div style={{ display: "flex", gap: 4 }}>
            {CHAR_SECTIONS.map(s => (
              <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{ width: 8, height: 8, borderRadius: 4, background: active === s.id ? sec.color : T.dim, cursor: "pointer" }} />
            ))}
          </div>
          <button onClick={() => { const i = CHAR_SECTIONS.findIndex(s => s.id === active); if (i < CHAR_SECTIONS.length - 1) { setActive(CHAR_SECTIONS[i+1].id); setActiveBlock(CHAR_SECTIONS[i+1].block); } }} disabled={active === CHAR_SECTIONS[CHAR_SECTIONS.length-1].id} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, background: active === CHAR_SECTIONS[CHAR_SECTIONS.length-1].id ? T.surface : sec.color + "22",
            border: `1px solid ${active === CHAR_SECTIONS[CHAR_SECTIONS.length-1].id ? T.border : sec.color}`, color: active === CHAR_SECTIONS[CHAR_SECTIONS.length-1].id ? T.muted : sec.color,
            cursor: active === CHAR_SECTIONS[CHAR_SECTIONS.length-1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>Next {"→"}</button>
        </div>
      </div>
    </div>
  );
}

export default CharacterizationModule;
