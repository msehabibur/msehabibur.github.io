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
  const [xrdPreset, setXrdPreset] = useState("Si");

  const xrdMaterials = useMemo(() => ({
    Si: { label: "Silicon", color: "#2563eb", peaks: [
      { twoTheta: 28.44, hkl: "(111)", intensity: 100, d: 3.135 },
      { twoTheta: 47.30, hkl: "(220)", intensity: 55, d: 1.920 },
      { twoTheta: 56.12, hkl: "(311)", intensity: 30, d: 1.637 },
      { twoTheta: 69.13, hkl: "(400)", intensity: 6, d: 1.358 },
      { twoTheta: 76.38, hkl: "(331)", intensity: 11, d: 1.246 },
      { twoTheta: 88.03, hkl: "(422)", intensity: 12, d: 1.109 },
    ]},
    Cu: { label: "Copper", color: "#d97706", peaks: [
      { twoTheta: 43.30, hkl: "(111)", intensity: 100, d: 2.088 },
      { twoTheta: 50.43, hkl: "(200)", intensity: 46, d: 1.808 },
      { twoTheta: 74.13, hkl: "(220)", intensity: 20, d: 1.278 },
      { twoTheta: 89.93, hkl: "(311)", intensity: 17, d: 1.090 },
      { twoTheta: 95.14, hkl: "(222)", intensity: 5, d: 1.044 },
    ]},
    NaCl: { label: "NaCl", color: "#059669", peaks: [
      { twoTheta: 27.37, hkl: "(111)", intensity: 13, d: 3.258 },
      { twoTheta: 31.70, hkl: "(200)", intensity: 100, d: 2.821 },
      { twoTheta: 45.45, hkl: "(220)", intensity: 55, d: 1.994 },
      { twoTheta: 53.87, hkl: "(311)", intensity: 2, d: 1.701 },
      { twoTheta: 56.49, hkl: "(222)", intensity: 15, d: 1.628 },
      { twoTheta: 66.23, hkl: "(400)", intensity: 12, d: 1.410 },
      { twoTheta: 75.30, hkl: "(420)", intensity: 8, d: 1.261 },
    ]},
    CdTe: { label: "CdTe", color: "#dc2626", peaks: [
      { twoTheta: 23.76, hkl: "(111)", intensity: 100, d: 3.742 },
      { twoTheta: 39.31, hkl: "(220)", intensity: 60, d: 2.290 },
      { twoTheta: 46.43, hkl: "(311)", intensity: 30, d: 1.954 },
      { twoTheta: 56.83, hkl: "(400)", intensity: 5, d: 1.619 },
      { twoTheta: 62.41, hkl: "(331)", intensity: 10, d: 1.487 },
      { twoTheta: 71.23, hkl: "(422)", intensity: 12, d: 1.323 },
    ]},
  }), []);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (xrdMaterials[xrdPreset]) {
      setD(xrdMaterials[xrdPreset].peaks[0].d);
    }
  }, [xrdPreset, xrdMaterials]);

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

      {/* ─── Live XRD Pattern with Material Presets ─── */}
      <Card title="Live XRD Pattern" color={C.struct} formula="2θ vs Intensity">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Select a material to see its realistic multi-peak diffraction pattern with Miller index labels.
        </div>
        {/* Material preset buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {Object.entries(xrdMaterials).map(([key, mat]) => (
            <button key={key} onClick={() => setXrdPreset(key)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: xrdPreset === key ? mat.color + "18" : T.surface,
              border: xrdPreset === key ? `1.5px solid ${mat.color}` : `1px solid ${T.border}`,
              color: xrdPreset === key ? mat.color : T.muted,
            }}>{mat.label}</button>
          ))}
        </div>

        {/* XRD Pattern SVG */}
        <svg viewBox="0 0 500 220" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {/* Axes */}
          <line x1={50} y1={180} x2={480} y2={180} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={180} x2={50} y2={20} stroke={T.ink} strokeWidth={1} />
          <text x={265} y={205} textAnchor="middle" fontSize={10} fill={T.muted}>2θ (degrees)</text>
          <text x={15} y={100} fontSize={9} fill={T.muted} transform="rotate(-90,15,100)">Intensity (a.u.)</text>

          {/* 2theta scale labels */}
          {[20, 30, 40, 50, 60, 70, 80, 90].map(deg => {
            const x = 50 + (deg - 15) / 85 * 430;
            return (
              <g key={deg}>
                <line x1={x} y1={180} x2={x} y2={183} stroke={T.ink} strokeWidth={0.5} />
                <text x={x} y={195} textAnchor="middle" fontSize={8} fill={T.dim}>{deg}°</text>
              </g>
            );
          })}

          {/* Diffraction peaks */}
          {xrdMaterials[xrdPreset].peaks.map((pk, i) => {
            const x = 50 + (pk.twoTheta - 15) / 85 * 430;
            const peakH = (pk.intensity / 100) * 140;
            const w = 5;
            const matCol = xrdMaterials[xrdPreset].color;
            if (x < 50 || x > 480) return null;
            return (
              <g key={i}>
                {/* Peak shape (Gaussian-like) */}
                <path d={`M${x - w * 2.5} 180 Q${x - w} ${180 - peakH * 0.3} ${x} ${180 - peakH} Q${x + w} ${180 - peakH * 0.3} ${x + w * 2.5} 180`}
                  fill={matCol + "33"} stroke={matCol} strokeWidth={1.5} />
                {/* hkl label */}
                <text x={x} y={180 - peakH - 8} textAnchor="middle" fontSize={8} fill={matCol} fontWeight={700}>{pk.hkl}</text>
                {/* 2theta value */}
                <text x={x} y={180 - peakH - 18} textAnchor="middle" fontSize={7} fill={T.muted}>{pk.twoTheta.toFixed(1)}°</text>
              </g>
            );
          })}

          {/* Animated scan line */}
          {(() => {
            const scanX = 50 + (animFrame / 120) * 430;
            return <line x1={scanX} y1={20} x2={scanX} y2={180} stroke={C.accent + "44"} strokeWidth={1} />;
          })()}

          <text x={265} y={15} textAnchor="middle" fontSize={11} fill={xrdMaterials[xrdPreset].color} fontWeight={700}>
            {xrdMaterials[xrdPreset].label} — XRD Pattern (Cu Kα, λ = 1.5406 Å)
          </text>
        </svg>

        {/* Peak table */}
        <div style={{ marginTop: 8, fontSize: 10, color: T.muted }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 4 }}>
            {xrdMaterials[xrdPreset].peaks.map((pk, i) => (
              <div key={i} style={{ background: xrdMaterials[xrdPreset].color + "08", border: `1px solid ${xrdMaterials[xrdPreset].color}22`, borderRadius: 6, padding: "4px 6px", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: xrdMaterials[xrdPreset].color }}>{pk.hkl}</div>
                <div>2θ = {pk.twoTheta.toFixed(1)}°</div>
                <div>d = {pk.d.toFixed(3)} Å</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.struct + "08", border: `1px solid ${C.struct}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.struct, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            Each crystal structure produces a unique set of peak positions and intensities -- like a fingerprint. The peak positions come from Bragg's law (plane spacings), while intensities depend on what atoms sit on those planes and where. This is why XRD is the gold standard for phase identification.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the XRD Lab" color={C.struct} formula="XRD of Silicon powder with Cu Kα">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> A colleague hands you a jar of fine white powder and says, "We think this is high-purity silicon for our semiconductor project, but we need to confirm -- and check for any crystalline impurities." You take the powder to the XRD lab. You pack it into an aluminum sample holder, pressing with a glass slide to get a flat, uniform surface (important: random grain orientations give reliable peak intensities). You mount it in the Bruker D8 diffractometer and set up a θ-2θ scan.
        </div>

        <div style={{ background: C.struct + "06", border: `1px solid ${C.struct}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.struct, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine shining a flashlight through a chain-link fence at a specific angle. At most angles, the light just passes through or gets absorbed. But at one special angle, the light bounces perfectly off each row of wires and adds up into a bright reflection. XRD does the same thing with X-rays and planes of atoms -- only at specific angles (where Bragg's law is satisfied) do you get a bright "peak."
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Instrument:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="X-ray source" value="Cu Kα (λ = 1.5406 Å)" />
          <InfoRow label="Generator settings" value="40 kV, 40 mA" />
          <InfoRow label="Scan range" value="10° to 90° 2θ" />
          <InfoRow label="Step size" value="0.02° (fine enough to resolve peak shapes)" />
          <InfoRow label="Dwell time per step" value="0.5 s (total scan ~33 min)" />
          <InfoRow label="Why Cu Kα?" value="Most common lab source; good resolution for metals/ceramics" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Output" value="Intensity (counts) vs 2θ angle" />
          <InfoRow label="Background level" value="~50 counts (flat, no amorphous hump)" />
          <InfoRow label="First strong peak" value="28.44° 2θ, ~12,000 counts" />
          <InfoRow label="Additional peaks" value="47.30°, 56.12°, 69.13°, 76.38°, 88.03°" />
          <InfoRow label="Any unexpected peaks?" value="None -- pattern is clean" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Focus on the First Peak (28.44° 2θ):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Peak position" value="2θ = 28.44°" />
          <InfoRow label="Peak intensity" value="100% (strongest in pattern)" />
          <InfoRow label="FWHM" value="0.12° (sharp → large crystallites)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate d-spacing (Bragg's Law):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Bragg's law: nλ = 2d sinθ (n = 1)" result="" color={C.struct} />
          <CalcRow eq="θ = 28.44° / 2 = 14.22°" result="" color={C.struct} />
          <CalcRow eq="d = λ / (2 sinθ) = 1.5406 / (2 × sin 14.22°)" result="" color={C.struct} />
          <CalcRow eq="d = 1.5406 / (2 × 0.2457)" result="3.135 Å" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Calculate Lattice Parameter:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="For cubic: d = a / √(h² + k² + l²)" result="" color={C.struct} />
          <CalcRow eq="First peak of Si is (111), so h²+k²+l² = 3" result="" color={C.struct} />
          <CalcRow eq="a = d × √3 = 3.135 × 1.732" result="5.431 Å" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 6 -- Phase Identification (Match to Database):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="JCPDS/ICDD card match" value="27-1402 (Silicon, diamond cubic)" />
          <InfoRow label="Reference a" value="5.4309 Å (your value: 5.431 Å → excellent match)" />
          <InfoRow label="Space group" value="Fd3̄m (#227)" />
          <InfoRow label="All 6 peaks accounted for?" value="Yes -- no unmatched peaks" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Pattern Statistics:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Phase identified" value="Silicon (diamond cubic), single phase" />
          <InfoRow label="Lattice parameter a" value="5.431 ± 0.001 Å" />
          <InfoRow label="Crystallite size (Scherrer)" value="> 200 nm (instrument-limited FWHM)" />
          <InfoRow label="Amorphous content" value="None detected (flat background)" />
          <InfoRow label="Impurity phases" value="None detected to XRD sensitivity (~1-2 wt%)" />
        </div>

        <div style={{ background: C.struct + "08", border: `1px solid ${C.struct}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.struct, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The powder is confirmed as phase-pure crystalline silicon with lattice parameter a = 5.431 Å, matching the reference value exactly. No extra peaks means no crystalline impurity phases (like SiO₂ or SiC) above the ~1-2 wt% detection limit. The sharp peaks (FWHM = 0.12°) indicate large, well-crystallized grains -- this is not nanocrystalline or amorphous material.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>What if the results looked different?</strong> If you saw a broad hump centered at ~22° 2θ with no sharp peaks, the powder would be amorphous SiO₂ (silica glass), not crystalline Si. If you saw the Si peaks PLUS extra peaks at 26.6° and 20.8°, you would have a quartz (SiO₂) impurity. If the Si peaks were very broad (FWHM &gt; 1°), the crystallites would be nanoscale -- you could estimate their size with the Scherrer equation.
          </div>
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

      <Card title="Numerical Example: A Day in the EBSD Lab" color={C.struct} formula="Grain boundary character in Ni superalloy">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You are studying a nickel-based superalloy (Inconel 718) turbine blade that was annealed at 800°C for 2 hours.
          Your goal: understand the grain boundary network, because high-angle grain boundaries are weak spots for creep failure at high temperature.
          You polish the sample down to 0.05 µm colloidal silica, mount it in the SEM at 70° tilt, and start the EBSD scan.
        </div>

        <div style={{ background: C.struct + "06", border: `1px solid ${C.struct}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.struct, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine each grain is a book lying on a table. Two books lying almost flat but tilted slightly differently (say 5° apart) -- that is a low-angle boundary. Two books where one is flat and one is standing up (45° apart) -- that is a high-angle boundary. EBSD reads the exact "tilt" of every book across the entire table.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Scan:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="SEM accelerating voltage" value="20 kV" />
          <InfoRow label="Working distance" value="15 mm" />
          <InfoRow label="Sample tilt" value="70° (required for EBSD)" />
          <InfoRow label="Step size chosen" value="0.5 µm (smaller than smallest expected grain)" />
          <InfoRow label="Scan area" value="200 x 200 µm (400 x 400 = 160,000 points)" />
          <InfoRow label="Time per point" value="~30 ms (total scan: ~80 min)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records (at each of 160,000 points):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Kikuchi pattern (raw)" value="Bands of diffracted electrons on phosphor screen" />
          <InfoRow label="Software auto-indexes bands" value="Finds zone axes, matches to Ni FCC crystal" />
          <InfoRow label="Output per pixel" value="Three Euler angles (φ₁, Φ, φ₂) = crystal orientation" />
          <InfoRow label="Confidence Index (CI)" value="0.92 (scale 0-1; above 0.1 is reliable)" />
          <InfoRow label="Image Quality (IQ)" value="Higher = sharper Kikuchi bands = less deformation" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Example: Two Adjacent Grains from Your Map:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Grain A orientation (φ₁, Φ, φ₂)" value="(45.2°, 32.1°, 67.4°)" />
          <InfoRow label="Grain B orientation (φ₁, Φ, φ₂)" value="(48.0°, 35.3°, 70.1°)" />
          <InfoRow label="Both grains" value="Indexed as FCC Ni (CI > 0.9)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate the Misorientation:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Convert each set of Euler angles to a 3x3 rotation matrix" result="g_A, g_B" color={C.struct} />
          <CalcRow eq="Compute misorientation: Δg = g_B · g_A⁻¹" result="3x3 matrix" color={C.struct} />
          <CalcRow eq="Extract angle: θ = arccos[(trace(Δg) - 1) / 2]" result="" color={C.struct} />
          <CalcRow eq="trace(Δg) = 2.989 (close to 3 means small rotation)" result="" color={C.struct} />
          <CalcRow eq="θ = arccos[(2.989 - 1) / 2] = arccos(0.9945)" result="≈ 5.0°" color={C.struct} />
          <CalcRow eq="Apply FCC crystal symmetry (24 operators)" result="Minimum angle = 5.0°" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Classify the Boundary:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="θ = 5° vs. threshold 15°" result="5° < 15° → LAGB" color={C.struct} />
          <CalcRow eq="Low-angle GB (LAGB)" result="Sub-grain boundary" color={C.struct} />
          <CalcRow eq="Brandon criterion for CSL: Δθ < 15°/Σ^(1/2)" result="" color={C.struct} />
          <CalcRow eq="Not a special CSL boundary (Σ3, Σ5, etc.)" result="General LAGB" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 6 -- Full Map Statistics (from all 160,000 scan points):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Total grains detected" value="342" />
          <InfoRow label="Average grain diameter" value="12.4 µm" />
          <InfoRow label="Low-angle GBs (< 15°)" value="28% of all boundaries" />
          <InfoRow label="High-angle GBs (> 15°)" value="72% of all boundaries" />
          <InfoRow label="Σ3 twin boundaries" value="38% of HAGBs (common in FCC Ni)" />
          <InfoRow label="Average CI across map" value="0.87 (excellent indexing quality)" />
          <InfoRow label="Dominant texture" value="Weak {100} cube texture from recrystallization" />
        </div>

        <div style={{ background: C.struct + "08", border: `1px solid ${C.struct}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.struct, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The specific boundary between Grain A and B has only 5° misorientation -- a low-angle grain boundary (LAGB). This means the two grains are almost the same crystal, separated by an array of dislocations that rearranged during the 800°C anneal (a process called recovery). LAGBs are desirable: they resist crack initiation and corrosion better than random high-angle boundaries.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            Looking at the full map: 38% of all high-angle boundaries are Σ3 twins -- this is excellent. Σ3 twin boundaries have very low energy, resist oxidation, and don't contribute to intergranular cracking. This high twin fraction is a signature of the annealing treatment and is deliberately engineered in "grain boundary engineering" to improve creep life and corrosion resistance in turbine blades.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> This alloy's grain boundary network looks healthy for high-temperature service. The combination of 28% LAGBs + 38% Σ3 twins means most boundaries are resistant to degradation. If you saw mostly random HAGBs with few twins, you would recommend a different heat treatment.
          </div>
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

      <Card title="Numerical Example: A Day in the TEM Diffraction Lab" color={C.struct} formula="SAED of BCC iron at 200 kV">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You are investigating the crystal structure of an iron thin foil that was electropolished from a bulk sample of what should be pure α-iron (BCC). You prepared the foil by jet electropolishing in a perchloric acid/ethanol solution until you got a small hole with electron-transparent edges. You insert the 3 mm disc into the TEM specimen holder, load it into a 200 kV JEOL TEM, and switch to diffraction mode.
        </div>

        <div style={{ background: C.struct + "06", border: `1px solid ${C.struct}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.struct, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine throwing a handful of pebbles at a picket fence. Most pebbles miss, but at certain angles they ricochet off the regularly spaced slats in a predictable pattern. In SAED, electrons are the pebbles and atomic planes are the slats. If you have a single crystal, you get an orderly pattern of bright dots (one for each set of planes). If you have many tiny crystals at random orientations, those dots smear into concentric rings.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the TEM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Accelerating voltage" value="200 kV" />
          <InfoRow label="Electron wavelength (relativistic)" value="0.02508 Å (much smaller than X-rays!)" />
          <InfoRow label="Camera length L" value="500 mm (set via intermediate lens excitation)" />
          <InfoRow label="Selected area aperture" value="200 µm (selects ~2 µm region on sample)" />
          <InfoRow label="Why 200 kV?" value="Good penetration through ~100 nm foil; small λ for sharp spots" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Pattern on screen" value="Bright spot at center (transmitted beam) + ring pattern" />
          <InfoRow label="Ring vs spot pattern" value="Rings → polycrystalline (many grains in selected area)" />
          <InfoRow label="First ring radius R₁" value="6.18 mm (measured from CCD image)" />
          <InfoRow label="Second ring radius R₂" value="8.74 mm" />
          <InfoRow label="Third ring radius R₃" value="10.71 mm" />
          <InfoRow label="Ring sharpness" value="Sharp, well-defined → crystalline grains (not amorphous)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure the First Ring:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Ring 1 radius R₁" value="6.18 mm" />
          <InfoRow label="Ring 1 intensity" value="Strong (consistent with (110) being BCC's strongest reflection)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate d-spacing (Camera Equation):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Camera equation: Rd = λL" result="" color={C.struct} />
          <CalcRow eq="d₁ = λL / R₁ = 0.02508 × 500 / 6.18" result="" color={C.struct} />
          <CalcRow eq="d₁ = 12.54 / 6.18" result="2.028 Å" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Identify the Structure Using Ring Ratios:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="d₂ = λL / R₂ = 12.54 / 8.74" result="1.435 Å" color={C.struct} />
          <CalcRow eq="d₃ = λL / R₃ = 12.54 / 10.71" result="1.171 Å" color={C.struct} />
          <CalcRow eq="Ratio R₂/R₁ = 8.74/6.18" result="1.414 = √2" color={C.struct} />
          <CalcRow eq="Ratio R₃/R₁ = 10.71/6.18" result="1.732 = √3" color={C.struct} />
          <CalcRow eq="√2, √3 sequence → BCC structure" result="Confirmed BCC!" color={C.struct} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 6 -- Match to Reference (BCC Fe, a = 2.866 Å):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Ring 1: d = 2.028 Å" value="BCC (110): d = 2.027 Å ✓" />
          <InfoRow label="Ring 2: d = 1.435 Å" value="BCC (200): d = 1.433 Å ✓" />
          <InfoRow label="Ring 3: d = 1.171 Å" value="BCC (211): d = 1.170 Å ✓" />
          <InfoRow label="Lattice parameter from d₁" value="a = d₁ × √2 = 2.028 × 1.414 = 2.868 Å" />
          <InfoRow label="Reference a for α-Fe" value="2.866 Å (within 0.1% error)" />
        </div>

        <div style={{ background: C.struct + "08", border: `1px solid ${C.struct}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.struct, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The ring pattern confirms this is polycrystalline (many small grains) rather than a single crystal (which would give discrete spots). The ring radii follow the √2, √3 ratio sequence, which is the fingerprint of a BCC structure. All three measured d-spacings match α-iron (BCC, a = 2.866 Å) to within measurement error.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The sharp rings (not diffuse halos) tell you the grains are crystalline, not amorphous. If you had tilted to a single grain and seen a spot pattern instead, you could index the zone axis and determine that specific grain's orientation. If unexpected extra rings appeared (say at d = 2.52 Å), you would suspect an oxide phase like Fe₃O₄ forming on the foil surface during preparation.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> This is confirmed as polycrystalline α-iron (BCC) with no detectable secondary phases. The ring pattern also tells you the selected area contains enough randomly oriented grains to produce complete rings -- if you had only a few grains, you would see spotty, incomplete rings.
          </div>
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
  const [xpsElement, setXpsElement] = useState("C");
  const [showChemShift, setShowChemShift] = useState(false);

  const xpsElements = useMemo(() => ({
    C: { be: 284.6, label: "C 1s", color: "#1a1e2e", peaks: [{ be: 284.6, label: "C 1s" }] },
    O: { be: 531.0, label: "O 1s", color: "#dc2626", peaks: [{ be: 531.0, label: "O 1s" }] },
    Si: { be: 99.3, label: "Si 2p", color: "#2563eb", peaks: [{ be: 99.3, label: "Si 2p" }, { be: 103.3, label: "SiO₂" }] },
    Cu: { be: 932.7, label: "Cu 2p₃/₂", color: "#d97706", peaks: [{ be: 932.7, label: "Cu 2p₃/₂" }, { be: 952.5, label: "Cu 2p₁/₂" }] },
    Zn: { be: 1021.8, label: "Zn 2p₃/₂", color: "#6b7280", peaks: [{ be: 1021.8, label: "Zn 2p₃/₂" }, { be: 1044.9, label: "Zn 2p₁/₂" }] },
    Cd: { be: 405.0, label: "Cd 3d₅/₂", color: "#7c3aed", peaks: [{ be: 405.0, label: "Cd 3d₅/₂" }, { be: 411.7, label: "Cd 3d₃/₂" }] },
    Te: { be: 572.9, label: "Te 3d₅/₂", color: "#059669", peaks: [{ be: 572.9, label: "Te 3d₅/₂" }, { be: 583.3, label: "Te 3d₃/₂" }] },
    S: { be: 162.0, label: "S 2p", color: "#ca8a04", peaks: [{ be: 162.0, label: "S 2p" }] },
  }), []);

  const chemShiftPeaks = useMemo(() => [
    { be: 284.6, label: "C-C", color: "#1a1e2e", desc: "sp³ carbon" },
    { be: 286.5, label: "C-O", color: "#2563eb", desc: "alcohol/ether" },
    { be: 288.0, label: "C=O", color: "#d97706", desc: "carbonyl" },
    { be: 289.5, label: "O-C=O", color: "#dc2626", desc: "carboxyl" },
  ], []);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (xpsElements[xpsElement]) {
      setEBind(xpsElements[xpsElement].be);
    }
  }, [xpsElement, xpsElements]);

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

      {/* ─── Element Selector & Chemical Shift ─── */}
      <Card title="Element Explorer" color={C.surface} formula="Binding Energy Lookup">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Click an element to see its core-level binding energy and where the peak appears in the XPS spectrum.
        </div>
        {/* Element buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {Object.entries(xpsElements).map(([key, el]) => (
            <button key={key} onClick={() => setXpsElement(key)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: xpsElement === key ? C.surface + "18" : T.surface,
              border: xpsElement === key ? `1.5px solid ${C.surface}` : `1px solid ${T.border}`,
              color: xpsElement === key ? C.surface : T.muted,
            }}>{key} ({el.label})</button>
          ))}
        </div>

        {/* XPS Survey Spectrum with selected element highlighted */}
        <svg viewBox="0 0 500 180" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <text x={250} y={15} textAnchor="middle" fontSize={10} fill={C.surface} fontWeight={700}>XPS Survey — {xpsElements[xpsElement].label} highlighted</text>
          <line x1={40} y1={155} x2={470} y2={155} stroke={T.ink} strokeWidth={1} />
          <line x1={40} y1={155} x2={40} y2={25} stroke={T.ink} strokeWidth={1} />
          <text x={250} y={175} textAnchor="middle" fontSize={9} fill={T.muted}>Binding Energy (eV)</text>
          {/* Scale: 0 to 1200 eV, note XPS plots right-to-left */}
          {[0, 200, 400, 600, 800, 1000, 1200].map(e => {
            const x = 40 + (1 - e / 1200) * 430;
            return <text key={e} x={x} y={167} textAnchor="middle" fontSize={7} fill={T.dim}>{e}</text>;
          })}
          {/* Background peaks */}
          {[
            { be: 284.6, h: 40, label: "C 1s", w: 6 },
            { be: 531, h: 35, label: "O 1s", w: 7 },
            { be: 99.3, h: 20, label: "Si 2p", w: 5 },
          ].map((pk, i) => {
            const x = 40 + (1 - pk.be / 1200) * 430;
            return (
              <g key={`bg${i}`}>
                <path d={`M${x - pk.w} 155 Q${x} ${155 - pk.h} ${x + pk.w} 155`}
                  fill={C.surface + "15"} stroke={C.surface + "44"} strokeWidth={0.8} />
                <text x={x} y={150 - pk.h} textAnchor="middle" fontSize={6} fill={T.muted}>{pk.label}</text>
              </g>
            );
          })}
          {/* Selected element peaks */}
          {xpsElements[xpsElement].peaks.map((pk, i) => {
            const x = 40 + (1 - pk.be / 1200) * 430;
            const h = i === 0 ? 60 : 40;
            if (x < 40 || x > 470) return null;
            return (
              <g key={`sel${i}`}>
                <path d={`M${x - 8} 155 Q${x} ${155 - h} ${x + 8} 155`}
                  fill={C.surface + "33"} stroke={C.surface} strokeWidth={1.5} />
                <text x={x} y={148 - h} textAnchor="middle" fontSize={8} fill={C.surface} fontWeight={700}>{pk.label}</text>
                <text x={x} y={138 - h} textAnchor="middle" fontSize={7} fill={T.muted}>{pk.be} eV</text>
              </g>
            );
          })}
        </svg>

        {/* Chemical Shift Toggle */}
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setShowChemShift(!showChemShift)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: showChemShift ? C.accent + "18" : T.surface,
            border: showChemShift ? `1.5px solid ${C.accent}` : `1px solid ${T.border}`,
            color: showChemShift ? C.accent : T.muted,
          }}>
            {showChemShift ? "Hide" : "Show"} C 1s Chemical Shift Example
          </button>
        </div>

        {showChemShift && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: T.ink, marginBottom: 6 }}>
              The C 1s peak shifts depending on the chemical environment. More electronegative neighbors pull electron density away, increasing binding energy:
            </div>
            <svg viewBox="0 0 500 160" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <text x={250} y={15} textAnchor="middle" fontSize={10} fill={C.accent} fontWeight={700}>C 1s Chemical Shift</text>
              <line x1={40} y1={130} x2={470} y2={130} stroke={T.ink} strokeWidth={1} />
              <line x1={40} y1={130} x2={40} y2={25} stroke={T.ink} strokeWidth={1} />
              <text x={250} y={150} textAnchor="middle" fontSize={9} fill={T.muted}>Binding Energy (eV)</text>
              {/* Scale 282 to 292 */}
              {[282, 284, 286, 288, 290, 292].map(e => {
                const x = 40 + (1 - (e - 282) / 10) * 430;
                return <text key={e} x={x} y={142} textAnchor="middle" fontSize={7} fill={T.dim}>{e}</text>;
              })}
              {/* Chemical shift peaks */}
              {chemShiftPeaks.map((pk, i) => {
                const x = 40 + (1 - (pk.be - 282) / 10) * 430;
                const h = 70 - i * 12;
                return (
                  <g key={i}>
                    <path d={`M${x - 12} 130 Q${x} ${130 - h} ${x + 12} 130`}
                      fill={pk.color + "22"} stroke={pk.color} strokeWidth={1.5} />
                    <text x={x} y={122 - h} textAnchor="middle" fontSize={8} fill={pk.color} fontWeight={700}>{pk.label}</text>
                    <text x={x} y={112 - h} textAnchor="middle" fontSize={7} fill={T.muted}>{pk.be} eV</text>
                    <text x={x} y={102 - h} textAnchor="middle" fontSize={6} fill={T.muted}>{pk.desc}</text>
                  </g>
                );
              })}
              {/* Arrow showing shift direction */}
              <line x1={380} y1={35} x2={100} y2={35} stroke={C.accent} strokeWidth={1} markerEnd="url(#arrow)" />
              <text x={240} y={30} textAnchor="middle" fontSize={8} fill={C.accent}>increasing oxidation →</text>
            </svg>
          </div>
        )}

        <div style={{ background: C.surface + "08", border: `1px solid ${C.surface}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.surface, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Did You Know?</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            XPS can distinguish between the same element in different chemical environments. For example, carbon bonded to oxygen (C-O at 286.5 eV) has a higher binding energy than carbon bonded to carbon (C-C at 284.6 eV) because oxygen's electronegativity pulls electron density away from the carbon atom, making its core electrons harder to eject.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the XPS Lab" color={C.surface} formula="XPS of CdTe solar cell surface">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> Your CdTe thin-film solar cell has been sitting in a drawer for two weeks and the efficiency dropped from 14.2% to 12.8%. You suspect the CdTe surface oxidized during storage, which would create a resistive barrier at the back contact. You load the sample into the XPS ultra-high vacuum (UHV) chamber through the loadlock, pump down, and wait for the pressure to reach &lt; 5 × 10⁻⁹ torr before transferring to the analysis chamber.
        </div>

        <div style={{ background: C.surface + "06", border: `1px solid ${C.surface}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.surface, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine throwing tennis balls (X-ray photons) at a wall of differently-weighted bricks. Each brick type needs a specific amount of energy to knock it loose. By measuring how fast the knocked-out bricks fly, you figure out how tightly each one was held -- and that tells you exactly what material the wall is made of and whether it has rusted (oxidized).
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Measurement:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="X-ray source" value="Al Kα (monochromated), hν = 1486.6 eV" />
          <InfoRow label="Chamber pressure" value="3 × 10⁻⁹ torr (UHV needed so surface stays clean)" />
          <InfoRow label="Beam spot size" value="400 µm (area-averaging multiple grains)" />
          <InfoRow label="Pass energy (survey)" value="160 eV (fast overview)" />
          <InfoRow label="Pass energy (high-res)" value="20 eV (for chemical state analysis)" />
          <InfoRow label="Work function (φ)" value="4.5 eV (instrument-calibrated)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Survey scan (0-1400 eV)" value="Peaks visible for Cd, Te, C, O" />
          <InfoRow label="Cd 3d doublet" value="405.0 eV (3d₅/₂) and 411.7 eV (3d₃/₂)" />
          <InfoRow label="Te 3d doublet" value="572.9 eV (3d₅/₂) and 583.3 eV (3d₃/₂)" />
          <InfoRow label="C 1s peak" value="284.8 eV (adventitious carbon from air exposure)" />
          <InfoRow label="O 1s peak" value="531.0 eV (very weak -- good sign!)" />
          <InfoRow label="Analysis depth" value="~5-10 nm (only the top few atomic layers)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Check for Oxidation (High-Res Te 3d Region):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Te 3d₅/₂ position" value="572.9 eV (matches CdTe reference)" />
          <InfoRow label="TeO₂ expected position" value="576.4 eV (3.5 eV higher if oxidized)" />
          <InfoRow label="Any shoulder at 576.4 eV?" value="None detected -- no TeO₂!" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate Kinetic Energy:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="E_kin = hν - E_bind - φ" result="" color={C.surface} />
          <CalcRow eq="E_kin(Cd 3d₅/₂) = 1486.6 - 405.0 - 4.5" result="1077.1 eV" color={C.surface} />
          <CalcRow eq="E_kin(Te 3d₅/₂) = 1486.6 - 572.9 - 4.5" result="909.2 eV" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Quantify Cd:Te Ratio (from Peak Areas):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Cd 3d₅/₂ peak area (Shirley background subtracted)" result="18,450 counts" color={C.surface} />
          <CalcRow eq="Te 3d₅/₂ peak area (Shirley background subtracted)" result="16,050 counts" color={C.surface} />
          <CalcRow eq="Sensitivity factors: Cd(SF=10.4), Te(SF=12.7)" result="" color={C.surface} />
          <CalcRow eq="Normalized Cd = 18450 / 10.4" result="1774" color={C.surface} />
          <CalcRow eq="Normalized Te = 16050 / 12.7" result="1264" color={C.surface} />
          <CalcRow eq="Cd at% = 1774 / (1774 + 1264) × 100" result="58.4%" color={C.surface} />
          <CalcRow eq="Te at% = 1264 / (1774 + 1264) × 100" result="41.6%" color={C.surface} />
          <CalcRow eq="Cd:Te ratio" result="1.40 (Cd-rich surface)" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Surface Composition:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Cd" value="42.1 at% (including C and O in total)" />
          <InfoRow label="Te" value="30.0 at%" />
          <InfoRow label="C (adventitious)" value="22.3 at% (surface contamination)" />
          <InfoRow label="O" value="5.6 at% (minor -- mostly from C-O bonds)" />
          <InfoRow label="Cd:Te (excluding C, O)" value="1.40 : 1 (Cd-enriched)" />
        </div>

        <div style={{ background: C.surface + "08", border: `1px solid ${C.surface}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.surface, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The critical finding: no TeO₂ peak at 576.4 eV. The surface has NOT oxidized despite two weeks in air. The efficiency drop must be caused by something else (perhaps back contact degradation or moisture ingress at edges).
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The Cd:Te ratio of 1.40 shows significant Cd enrichment at the surface. This is actually typical and expected after CdCl₂ treatment -- chlorine preferentially removes Te during the process, leaving a Cd-rich surface layer. For the back contact, this Cd-rich surface may need etching with a bromine-methanol solution to restore a Te-rich surface that makes better ohmic contact.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> Surface oxidation is ruled out as the cause of efficiency loss. The Cd-rich surface is normal for CdCl₂-treated CdTe. If you HAD seen a TeO₂ shoulder, you would recommend storing the samples in a nitrogen glovebox or applying the back contact immediately after CdCl₂ treatment.
          </div>
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

      <Card title="Numerical Example: A Day in the AES Lab" color={C.surface} formula="AES of S segregation on steel grain boundary">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> A stainless steel pipe in a chemical plant failed catastrophically along grain boundaries after 15 years of service at 500°C. The failure investigation team sends you a piece of the pipe. You need to determine WHY the grain boundaries failed -- the prime suspect is sulfur segregation, which is known to embrittle steel grain boundaries. You notch the sample and fracture it inside the UHV AES chamber to expose fresh grain boundary surfaces that have never seen air.
        </div>

        <div style={{ background: C.surface + "06", border: `1px solid ${C.surface}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.surface, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine a crime scene investigator dusting a doorknob for fingerprints. AES does something similar -- it scans a freshly broken surface with an electron beam and "dusts" for chemical fingerprints. But instead of ink powder, it detects Auger electrons that carry the unique energy signature of each element. The key advantage: you can point the beam at a specific spot (like a grain boundary facet) with ~10 nm precision.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Measurement:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Chamber pressure" value="2 × 10⁻¹⁰ torr (UHV -- critical for clean fracture surface)" />
          <InfoRow label="Primary beam energy" value="5 keV" />
          <InfoRow label="Beam current" value="10 nA" />
          <InfoRow label="Beam spot on fracture facet" value="~50 nm (aimed at a flat grain boundary facet)" />
          <InfoRow label="Why fracture in UHV?" value="Air exposure would instantly oxidize S and mask the signal" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Spectrum type" value="dN/dE (differentiated) vs kinetic energy" />
          <InfoRow label="Major peaks visible" value="Fe LMM (703 eV), Cr LMM (529 eV), S LMM (152 eV)" />
          <InfoRow label="Also detected" value="Small O KLL (510 eV), C KLL (272 eV) -- minimal" />
          <InfoRow label="S peak" value="Clearly visible at 152 eV -- sulfur is present!" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure Peak-to-Peak Heights:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="S LMM peak-to-peak (dN/dE)" value="15 units" />
          <InfoRow label="Fe LMM peak-to-peak (dN/dE)" value="85 units" />
          <InfoRow label="Cr LMM peak-to-peak (dN/dE)" value="22 units" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate Concentrations:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Formula: C_i = (I_i / S_i) / Σ(I_j / S_j)" result="" color={C.surface} />
          <CalcRow eq="Sensitivity factors: S(0.82), Fe(0.21), Cr(0.29)" result="" color={C.surface} />
          <CalcRow eq="Normalized S = 15 / 0.82" result="18.3" color={C.surface} />
          <CalcRow eq="Normalized Fe = 85 / 0.21" result="404.8" color={C.surface} />
          <CalcRow eq="Normalized Cr = 22 / 0.29" result="75.9" color={C.surface} />
          <CalcRow eq="Total = 18.3 + 404.8 + 75.9" result="499.0" color={C.surface} />
          <CalcRow eq="S at% = 18.3 / 499.0 × 100" result="3.7 at%" color={C.surface} />
          <CalcRow eq="Fe at% = 404.8 / 499.0 × 100" result="81.1 at%" color={C.surface} />
          <CalcRow eq="Cr at% = 75.9 / 499.0 × 100" result="15.2 at%" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Grain Boundary Composition:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Sulfur at grain boundary" value="3.7 at% (bulk steel has &lt; 0.01 at% S)" />
          <InfoRow label="Enrichment factor" value="~370× above bulk level" />
          <InfoRow label="Comparison: grain interior (moved beam)" value="S not detected (&lt; 0.1 at%)" />
          <InfoRow label="Cr at grain boundary" value="15.2 at% (slightly depleted from bulk 18 at%)" />
        </div>

        <div style={{ background: C.surface + "08", border: `1px solid ${C.surface}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.surface, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The smoking gun: 3.7 at% sulfur at the grain boundary is ~370 times the bulk level. This is classic temper embrittlement. During 15 years at 500°C, sulfur atoms diffused from the grain interiors and segregated to the grain boundaries, weakening the atomic bonds across the boundary. This explains the intergranular fracture mode.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The slight Cr depletion (15.2 vs 18 at% bulk) at the boundary is also concerning -- it suggests the boundary may also be sensitized (Cr-depleted), making it vulnerable to intergranular corrosion on top of the embrittlement.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> Sulfur segregation caused this failure. The recommendation: use a lower-sulfur steel grade (&lt; 0.005 wt% S), or add elements like Ce or La that bind sulfur as harmless precipitates in the grain interior rather than letting it migrate to boundaries.
          </div>
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

      <Card title="Numerical Example: A Day in the SIMS Lab" color={C.surface} formula="SIMS depth profile of B implant in Si">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> A semiconductor fab just implanted boron into silicon wafers at 10 keV with a target dose of 1 × 10¹⁵ atoms/cm². Before they build transistors on these wafers, they need to verify that the boron went to the correct depth and the dose is right. You load one of the test wafers into the SIMS instrument (a CAMECA IMS-7f) and set up an O₂⁺ primary beam -- oxygen primary ions are chosen because they enhance the ionization probability of electropositive elements like boron, giving much better sensitivity.
        </div>

        <div style={{ background: C.surface + "06", border: `1px solid ${C.surface}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.surface, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine a sandblaster slowly eroding a painted wall layer by layer, and a camera catching each chip of paint as it flies off to identify the color. SIMS works the same way: primary ions sandblast the sample surface atom by atom, and a mass spectrometer catches and identifies each sputtered ion. By tracking how the composition changes as you dig deeper, you build a depth profile.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Measurement:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Primary beam" value="O₂⁺ at 5 keV (enhances B⁺ yield)" />
          <InfoRow label="Primary beam current" value="50 nA" />
          <InfoRow label="Raster area" value="200 × 200 µm (sputter crater)" />
          <InfoRow label="Detected area (gated)" value="Central 60 µm diameter (avoids crater edges)" />
          <InfoRow label="Mass resolution M/ΔM" value="~4000 (separates ¹¹B from interfering species)" />
          <InfoRow label="Why O₂⁺ for boron?" value="O₂⁺ oxidizes the surface, boosting B⁺ ion yield by ~100×" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Output" value="¹¹B⁺ counts/s and ²⁸Si⁺ counts/s vs sputtering time" />
          <InfoRow label="Si matrix signal" value="2.8 × 10⁶ counts/s (constant -- this is the reference)" />
          <InfoRow label="B signal initially" value="Low (~1000 counts/s at surface)" />
          <InfoRow label="B signal rising" value="Increases rapidly with depth" />
          <InfoRow label="B signal at peak (t ≈ 5 min)" value="3.2 × 10⁵ counts/s" />
          <InfoRow label="B signal after peak" value="Drops off as you pass through the implant" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Convert Time to Depth:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Sputter rate (measured by profilometry of crater)" result="1.5 nm/min" color={C.surface} />
          <CalcRow eq="Depth at peak signal (t = 5 min) = 1.5 × 5" result="7.5 nm" color={C.surface} />
          <CalcRow eq="Total crater depth after 20 min = 1.5 × 20" result="30 nm" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Convert Counts to Concentration (Using RSF):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="[B] = (B counts × RSF) / Si matrix counts" result="" color={C.surface} />
          <CalcRow eq="RSF for B in Si with O₂⁺ (from reference)" result="1.84 × 10²² atoms/cm³" color={C.surface} />
          <CalcRow eq="[B] at peak = (3.2×10⁵ × 1.84×10²²) / 2.8×10⁶" result="" color={C.surface} />
          <CalcRow eq="[B] at peak = 5.89×10²⁷ / 2.8×10⁶" result="2.1 × 10¹⁸ atoms/cm³" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Profile Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Peak B concentration" value="2.1 × 10¹⁸ atoms/cm³" />
          <InfoRow label="Peak depth (Rp)" value="~8 nm (projected range)" />
          <InfoRow label="Profile width (ΔRp)" value="~5 nm (straggle)" />
          <InfoRow label="Integrated dose" value="1.05 × 10¹⁵ atoms/cm² (within 5% of target)" />
          <InfoRow label="SRIM prediction for 10 keV B in Si" value="Rp = 7.8 nm, ΔRp = 4.2 nm" />
        </div>

        <div style={{ background: C.surface + "08", border: `1px solid ${C.surface}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.surface, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The boron implant profile matches the specification: peak depth ~8 nm agrees with SRIM simulation for 10 keV, and the integrated dose of 1.05 × 10¹⁵ is within 5% of the target 1 × 10¹⁵ atoms/cm². The implanter is performing correctly.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The profile shape (Gaussian-like with a slight tail toward the surface) is expected for low-energy implants. After subsequent annealing to activate the dopant, you would re-measure by SIMS to check for diffusion broadening -- if the profile spreads too much, the transistor junction depth would be wrong.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> Implant verified. If the dose were off by &gt; 10%, you would recalibrate the ion implanter. If the depth were wrong, you would check the implant energy. SIMS is the gold standard for dopant profiling because it can detect B down to ~10¹⁵ atoms/cm³ -- that is parts per billion sensitivity, far beyond what any other technique can do.
          </div>
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

      <Card title="Numerical Example: A Day in the EDS Lab" color={C.surface} formula="EDS of 304 stainless steel">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> Your company received a shipment of stainless steel plate labeled "304 grade" for a food processing application. Before accepting the material, you need to verify the composition meets the AISI 304 specification (17-20 wt% Cr, 8-11 wt% Ni). You cut a small coupon, polish it to 1 µm diamond finish, and load it into the SEM. The SDD (silicon drift detector) EDS system is already cooled and ready.
        </div>

        <div style={{ background: C.surface + "06", border: `1px solid ${C.surface}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.surface, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            When you hit a piano key, you get a note at a specific frequency. Each element is like a different piano -- when the electron beam "plays" it, the element sings its own characteristic X-ray frequency. Iron sings at 6.40 keV, chromium at 5.41 keV, nickel at 7.47 keV. The EDS detector listens to all these notes simultaneously and tells you how much of each element is present.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the SEM-EDS:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Accelerating voltage" value="20 kV" />
          <InfoRow label="Why 20 kV?" value="Overvoltage for Ni Kα (7.47 keV): 20/7.47 = 2.7× (need > 2×)" />
          <InfoRow label="Working distance" value="10 mm (optimal for this detector geometry)" />
          <InfoRow label="Detector" value="SDD, 30 mm², ~130 eV resolution at Mn Kα" />
          <InfoRow label="Acquisition time" value="60 seconds live time (good statistics)" />
          <InfoRow label="Dead time" value="~25% (healthy -- not too high, not too low)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Full spectrum" value="0 to 20 keV energy range" />
          <InfoRow label="Dominant peak" value="Fe Kα at 6.40 keV (tallest -- iron is the matrix)" />
          <InfoRow label="Second peak" value="Cr Kα at 5.41 keV (clearly visible)" />
          <InfoRow label="Third peak" value="Ni Kα at 7.47 keV (moderate height)" />
          <InfoRow label="Small peak" value="Si Kα at 1.74 keV (just above background)" />
          <InfoRow label="Total counts in spectrum" value="~450,000 (good statistics)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Raw Peak Intensities:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Fe Kα net counts" value="45,230" />
          <InfoRow label="Cr Kα net counts" value="12,180" />
          <InfoRow label="Ni Kα net counts" value="5,840" />
          <InfoRow label="Si Kα net counts" value="320" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Apply ZAF Corrections:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Z correction (atomic number effect on e⁻ penetration)" result="Applied" color={C.surface} />
          <CalcRow eq="A correction (X-ray absorption in sample)" result="Applied" color={C.surface} />
          <CalcRow eq="F correction (secondary fluorescence)" result="Applied" color={C.surface} />
          <CalcRow eq="Fe wt% (ZAF corrected)" result="73.8 wt%" color={C.surface} />
          <CalcRow eq="Cr wt% (ZAF corrected)" result="17.5 wt%" color={C.surface} />
          <CalcRow eq="Ni wt% (ZAF corrected)" result="8.2 wt%" color={C.surface} />
          <CalcRow eq="Si wt% (ZAF corrected)" result="0.5 wt%" color={C.surface} />
          <CalcRow eq="Total" result="100.0 wt% (normalized)" color={C.surface} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Results vs AISI 304 Specification:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Cr: 17.5 wt%" value="Spec: 17-20 wt% ✓ (passes)" />
          <InfoRow label="Ni: 8.2 wt%" value="Spec: 8-11 wt% ✓ (passes)" />
          <InfoRow label="Si: 0.5 wt%" value="Spec: < 1.0 wt% ✓ (passes)" />
          <InfoRow label="Fe: balance (73.8 wt%)" value="As expected for 304" />
          <InfoRow label="Note" value="C not detected by EDS (too light, Z=6)" />
        </div>

        <div style={{ background: C.surface + "08", border: `1px solid ${C.surface}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.surface, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The composition (Fe-17.5Cr-8.2Ni-0.5Si) falls within the AISI 304 specification on all measurable elements. The shipment is genuine 304 stainless steel. The Si at 0.5 wt% is from deoxidation during steelmaking and is normal.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            One limitation: EDS cannot reliably measure carbon (the C Kα peak at 0.277 keV is heavily absorbed and overlaps with background). To verify the carbon content (&lt; 0.08 wt% for 304, &lt; 0.03 wt% for 304L), you would need WDS (wavelength dispersive spectroscopy) or combustion analysis.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> Material accepted. If the Cr had been below 17% or Ni below 8%, you would reject the shipment -- it could be a cheaper grade like 430 (ferritic, no Ni) sold as 304, which would corrode in the food processing environment.
          </div>
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
  const [xanesEdge, setXanesEdge] = useState("Cu_K");
  const [showOxComparison, setShowOxComparison] = useState(false);

  const xanesEdges = useMemo(() => ({
    Cu_K: { label: "Cu K-edge", energy: 8979, color: "#d97706", R: 2.55, N: 4 },
    Fe_K: { label: "Fe K-edge", energy: 7112, color: "#dc2626", R: 2.48, N: 6 },
    Ti_K: { label: "Ti K-edge", energy: 4966, color: "#2563eb", R: 1.96, N: 6 },
    Zn_K: { label: "Zn K-edge", energy: 9659, color: "#6b7280", R: 2.35, N: 4 },
  }), []);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (xanesEdges[xanesEdge]) {
      setR(xanesEdges[xanesEdge].R);
      setN(xanesEdges[xanesEdge].N);
    }
  }, [xanesEdge, xanesEdges]);

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

      {/* ─── XANES Edge Selector & Oxidation State ─── */}
      <Card title="XANES Edge Explorer" color={C.spec} formula="Absorption edge position → element & oxidation state">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Select an element edge to see its absorption energy. The XANES region is extremely sensitive to oxidation state and local coordination.
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {Object.entries(xanesEdges).map(([key, edge]) => (
            <button key={key} onClick={() => setXanesEdge(key)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: xanesEdge === key ? edge.color + "18" : T.surface,
              border: xanesEdge === key ? `1.5px solid ${edge.color}` : `1px solid ${T.border}`,
              color: xanesEdge === key ? edge.color : T.muted,
            }}>{edge.label} ({edge.energy} eV)</button>
          ))}
        </div>

        <svg viewBox="0 0 500 200" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <text x={250} y={18} textAnchor="middle" fontSize={11} fill={xanesEdges[xanesEdge].color} fontWeight={700}>
            {xanesEdges[xanesEdge].label} — XANES Region ({xanesEdges[xanesEdge].energy} eV)
          </text>
          <line x1={50} y1={170} x2={470} y2={170} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={170} x2={50} y2={30} stroke={T.ink} strokeWidth={1} />
          <text x={260} y={193} textAnchor="middle" fontSize={9} fill={T.muted}>Energy (eV)</text>
          <text x={15} y={100} fontSize={8} fill={T.muted} transform="rotate(-90,15,100)">μ(E)</text>

          {/* XANES spectrum */}
          {(() => {
            const e0 = xanesEdges[xanesEdge].energy;
            const col = xanesEdges[xanesEdge].color;
            return (
              <g>
                <polyline points={Array.from({ length: 200 }, (_, i) => {
                  const e = e0 - 30 + i * 0.6;
                  const x = 50 + (i / 200) * 420;
                  const rel = e - e0;
                  let mu;
                  if (rel < -5) mu = 0.1 + rel * 0.001;
                  else if (rel < 0) mu = 0.1 + (rel + 5) * 0.15;
                  else if (rel < 5) mu = 0.85 + 0.15 * Math.sin(rel * 1.2) * Math.exp(-rel * 0.1);
                  else mu = 0.85 + 0.1 * Math.sin(rel * 0.3) * Math.exp(-rel * 0.05);
                  const y = 170 - mu * 130;
                  return `${x},${Math.max(30, y)}`;
                }).join(" ")} fill="none" stroke={col} strokeWidth={2} />
                {/* Edge position marker */}
                <line x1={50 + (30 / 120) * 420} y1={30} x2={50 + (30 / 120) * 420} y2={170} stroke={col + "44"} strokeWidth={1} strokeDasharray="3,3" />
                <text x={50 + (30 / 120) * 420} y={28} textAnchor="middle" fontSize={8} fill={col}>E₀ = {e0} eV</text>
                {/* Pre-edge feature */}
                <text x={80} y={155} fontSize={7} fill={T.muted}>pre-edge</text>
                <text x={50 + (30 / 120) * 420 - 15} y={65} fontSize={7} fill={col}>white line</text>
                <text x={350} y={60} fontSize={7} fill={T.muted}>post-edge (EXAFS)</text>
              </g>
            );
          })()}
        </svg>

        {/* Oxidation state comparison */}
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setShowOxComparison(!showOxComparison)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: showOxComparison ? C.adv + "18" : T.surface,
            border: showOxComparison ? `1.5px solid ${C.adv}` : `1px solid ${T.border}`,
            color: showOxComparison ? C.adv : T.muted,
          }}>
            {showOxComparison ? "Hide" : "Show"} Fe²⁺ vs Fe³⁺ Oxidation State Comparison
          </button>
        </div>

        {showOxComparison && (
          <svg viewBox="0 0 500 180" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, marginTop: 8 }}>
            <text x={250} y={18} textAnchor="middle" fontSize={11} fill={C.adv} fontWeight={700}>
              Fe K-edge: Fe²⁺ vs Fe³⁺ Oxidation State Shift
            </text>
            <line x1={50} y1={150} x2={470} y2={150} stroke={T.ink} strokeWidth={1} />
            <line x1={50} y1={150} x2={50} y2={30} stroke={T.ink} strokeWidth={1} />
            <text x={260} y={173} textAnchor="middle" fontSize={9} fill={T.muted}>Energy (eV)</text>
            {/* Fe2+ spectrum */}
            <polyline points={Array.from({ length: 150 }, (_, i) => {
              const e = 7100 + i * 0.5;
              const x = 50 + (i / 150) * 420;
              const e0 = 7112;
              const rel = e - e0;
              let mu;
              if (rel < -3) mu = 0.1;
              else if (rel < 0) mu = 0.1 + (rel + 3) * 0.2;
              else if (rel < 5) mu = 0.7 + 0.15 * Math.sin(rel * 1.0);
              else mu = 0.75 + 0.08 * Math.sin(rel * 0.3) * Math.exp(-rel * 0.05);
              return `${x},${150 - mu * 110}`;
            }).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.8} />
            {/* Fe3+ spectrum (shifted ~3 eV higher) */}
            <polyline points={Array.from({ length: 150 }, (_, i) => {
              const e = 7100 + i * 0.5;
              const x = 50 + (i / 150) * 420;
              const e0 = 7115;
              const rel = e - e0;
              let mu;
              if (rel < -3) mu = 0.1;
              else if (rel < 0) mu = 0.1 + (rel + 3) * 0.25;
              else if (rel < 5) mu = 0.85 + 0.2 * Math.sin(rel * 1.2);
              else mu = 0.85 + 0.08 * Math.sin(rel * 0.3) * Math.exp(-rel * 0.05);
              return `${x},${150 - mu * 110}`;
            }).join(" ")} fill="none" stroke="#dc2626" strokeWidth={1.8} />
            {/* Legend */}
            <line x1={350} y1={40} x2={380} y2={40} stroke="#2563eb" strokeWidth={2} />
            <text x={385} y={43} fontSize={8} fill="#2563eb">Fe²⁺ (7112 eV)</text>
            <line x1={350} y1={55} x2={380} y2={55} stroke="#dc2626" strokeWidth={2} />
            <text x={385} y={58} fontSize={8} fill="#dc2626">Fe³⁺ (7115 eV)</text>
            {/* Shift arrow */}
            <line x1={50 + (12 / 75) * 420} y1={130} x2={50 + (15 / 75) * 420} y2={130} stroke={C.accent} strokeWidth={2} markerEnd="url(#arrow)" />
            <text x={50 + (13.5 / 75) * 420} y={126} textAnchor="middle" fontSize={7} fill={C.accent}>~3 eV shift</text>
          </svg>
        )}

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Did You Know?</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            The XANES edge shifts ~1-3 eV per oxidation state change. Fe²⁺ absorbs at ~7112 eV while Fe³⁺ absorbs at ~7115 eV. This makes XANES one of the most reliable ways to determine oxidation state in complex materials, even in amorphous or nanocrystalline samples where XRD fails.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day at the Synchrotron XANES Beamline" color={C.spec} formula="Fe K-edge XANES of iron oxide">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> An archaeologist brings you a rust-colored powder scraped from an ancient Roman nail found in a waterlogged site. They need to know the exact iron oxide phase -- is it hematite (α-Fe₂O₃), magnetite (Fe₃O₄), or goethite (α-FeOOH)? This matters because the oxide phase tells them about the burial environment (oxidizing vs reducing). You take the sample to a synchrotron beamline for Fe K-edge XANES, which can precisely determine the iron oxidation state and coordination geometry.
        </div>

        <div style={{ background: C.spec + "06", border: `1px solid ${C.spec}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.spec, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Think of tuning a radio dial past a station. Below the station frequency, you hear nothing. Right at the frequency, you hear a loud burst. Past it, the signal wobbles. In XANES, you tune X-ray energy past an element's absorption edge. The exact energy where absorption jumps tells you the oxidation state (like which station you are on), and the shape of the "wobbles" tells you the local atomic arrangement.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up at the Beamline:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Beamline" value="Fe K-edge (scan ~7050-7250 eV)" />
          <InfoRow label="Monochromator" value="Si(111) double crystal, ΔE/E ~ 10⁻⁴" />
          <InfoRow label="Sample preparation" value="Powder mixed with BN, pressed into 7 mm pellet" />
          <InfoRow label="Detection mode" value="Transmission (thin pellet optimized for 1 absorption length)" />
          <InfoRow label="Standards measured first" value="Fe metal foil, FeO, Fe₂O₃, Fe₃O₄ (same beamline session)" />
          <InfoRow label="Energy calibration" value="Fe metal foil edge defined as 7112.0 eV" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Pre-edge region (7050-7110 eV)" value="Flat, slowly rising absorption" />
          <InfoRow label="Small pre-edge peak" value="7114 eV (very weak)" />
          <InfoRow label="Main edge jump" value="Sharp rise centered at 7126 eV" />
          <InfoRow label="White line (absorption maximum)" value="Strong peak just above edge" />
          <InfoRow label="Post-edge oscillations" value="EXAFS wiggles extending to ~7400 eV" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Compare Edge Position to Standards:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Fe metal standard E₀" value="7112 eV (Fe⁰)" />
          <InfoRow label="FeO standard E₀" value="7119 eV (Fe²⁺)" />
          <InfoRow label="Fe₃O₄ standard E₀" value="7122 eV (mixed Fe²⁺/Fe³⁺)" />
          <InfoRow label="Fe₂O₃ standard E₀" value="7126 eV (Fe³⁺)" />
          <InfoRow label="Your sample E₀" value="7126 eV" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Determine Oxidation State:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Edge shift from Fe metal = 7126 - 7112" result="+14 eV" color={C.spec} />
          <CalcRow eq="FeO shift (Fe²⁺) = 7119 - 7112" result="+7 eV (no match)" color={C.spec} />
          <CalcRow eq="Fe₃O₄ shift (mixed) = 7122 - 7112" result="+10 eV (no match)" color={C.spec} />
          <CalcRow eq="Fe₂O₃ shift (Fe³⁺) = 7126 - 7112" result="+14 eV → MATCH" color={C.spec} />
          <CalcRow eq="Oxidation state conclusion" result="Fe³⁺" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Determine Coordination from Pre-edge:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Pre-edge peak at 7114 eV (1s → 3d transition)" result="" color={C.spec} />
          <CalcRow eq="Pre-edge intensity (normalized)" result="0.05 (weak)" color={C.spec} />
          <CalcRow eq="Tetrahedral Fe³⁺ pre-edge" result="~0.15 (strong -- allowed by mixing)" color={C.spec} />
          <CalcRow eq="Octahedral Fe³⁺ pre-edge" result="~0.05 (weak -- dipole forbidden)" color={C.spec} />
          <CalcRow eq="Your sample matches" result="Octahedral Fe³⁺" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full XANES Fingerprinting:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Edge position" value="7126 eV → Fe³⁺" />
          <InfoRow label="Pre-edge" value="Weak → octahedral coordination" />
          <InfoRow label="White line shape" value="Matches α-Fe₂O₃ (hematite) standard" />
          <InfoRow label="Ruled out" value="Magnetite (wrong edge), goethite (different white line)" />
          <InfoRow label="Phase identification" value="α-Fe₂O₃ (hematite)" />
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Scientist</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The powder is hematite (α-Fe₂O₃): pure Fe³⁺ in octahedral coordination. For the archaeologist, this means the burial environment was oxidizing (access to air or oxygenated water). If the nail had been in a reducing environment (deep waterlogged anaerobic sediment), you would expect magnetite (Fe₃O₄) with its mixed Fe²⁺/Fe³⁺ edge at 7122 eV.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The power of XANES here is that it works on powders, amorphous materials, and mixtures -- unlike XRD, which requires crystallinity, XANES gives oxidation state information regardless of crystallographic order. If the sample were a mixture of hematite and magnetite, you could do linear combination fitting of the XANES spectra to determine the fraction of each phase.
          </div>
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
  const [ramanPreset, setRamanPreset] = useState("Si");

  const ramanMaterials = useMemo(() => ({
    Si: { label: "Silicon", color: "#2563eb", peaks: [{ shift: 520, label: "Si-Si", intensity: 100 }] },
    Diamond: { label: "Diamond", color: "#6b7280", peaks: [{ shift: 1332, label: "sp³ C", intensity: 100 }] },
    Graphene: { label: "Graphene", color: "#059669", peaks: [
      { shift: 1350, label: "D", intensity: 10 },
      { shift: 1580, label: "G", intensity: 70 },
      { shift: 2680, label: "2D", intensity: 100 },
    ]},
    CdS: { label: "CdS", color: "#d97706", peaks: [
      { shift: 300, label: "1LO", intensity: 100 },
      { shift: 600, label: "2LO", intensity: 35 },
      { shift: 900, label: "3LO", intensity: 10 },
    ]},
  }), []);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ramanMaterials[ramanPreset]) {
      const mainPeak = ramanMaterials[ramanPreset].peaks.find(p => p.intensity === 100);
      if (mainPeak) setRamanShift(mainPeak.shift);
    }
  }, [ramanPreset, ramanMaterials]);

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

      {/* ─── Raman Material Presets ─── */}
      <Card title="Material Raman Spectra" color={C.spec} formula="Characteristic peaks for common materials">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Select a material to see its characteristic Raman spectrum with labeled peaks.
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {Object.entries(ramanMaterials).map(([key, mat]) => (
            <button key={key} onClick={() => setRamanPreset(key)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: ramanPreset === key ? mat.color + "18" : T.surface,
              border: ramanPreset === key ? `1.5px solid ${mat.color}` : `1px solid ${T.border}`,
              color: ramanPreset === key ? mat.color : T.muted,
            }}>{mat.label}</button>
          ))}
        </div>

        <svg viewBox="0 0 500 200" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <text x={250} y={15} textAnchor="middle" fontSize={11} fill={ramanMaterials[ramanPreset].color} fontWeight={700}>
            {ramanMaterials[ramanPreset].label} — Raman Spectrum
          </text>
          {/* Axes */}
          <line x1={50} y1={170} x2={470} y2={170} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={170} x2={50} y2={25} stroke={T.ink} strokeWidth={1} />
          <text x={260} y={193} textAnchor="middle" fontSize={9} fill={T.muted}>Raman Shift (cm⁻¹)</text>
          <text x={15} y={100} fontSize={8} fill={T.muted} transform="rotate(-90,15,100)">Intensity</text>
          {/* Scale */}
          {[0, 500, 1000, 1500, 2000, 2500, 3000].map(s => {
            const x = 50 + (s / 3000) * 420;
            return (
              <g key={s}>
                <line x1={x} y1={170} x2={x} y2={173} stroke={T.ink} strokeWidth={0.5} />
                <text x={x} y={183} textAnchor="middle" fontSize={7} fill={T.dim}>{s}</text>
              </g>
            );
          })}
          {/* Rayleigh line */}
          <path d="M50 170 Q53 60 56 170" fill={C.spec + "11"} stroke={C.spec + "44"} strokeWidth={0.8} />
          <text x={53} y={55} textAnchor="middle" fontSize={6} fill={T.dim}>Rayleigh</text>
          {/* Material peaks */}
          {ramanMaterials[ramanPreset].peaks.map((pk, i) => {
            const x = 50 + (pk.shift / 3000) * 420;
            const h = (pk.intensity / 100) * 120;
            const w = 8 + (pk.shift > 2000 ? 4 : 0);
            const matCol = ramanMaterials[ramanPreset].color;
            return (
              <g key={i}>
                <path d={`M${x - w} 170 Q${x} ${170 - h} ${x + w} 170`}
                  fill={matCol + "33"} stroke={matCol} strokeWidth={1.5} />
                <text x={x} y={170 - h - 8} textAnchor="middle" fontSize={9} fill={matCol} fontWeight={700}>{pk.label}</text>
                <text x={x} y={170 - h - 18} textAnchor="middle" fontSize={7} fill={T.muted}>{pk.shift} cm⁻¹</text>
              </g>
            );
          })}
        </svg>

        {/* Peak info boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 4, marginTop: 8 }}>
          {ramanMaterials[ramanPreset].peaks.map((pk, i) => (
            <div key={i} style={{ background: ramanMaterials[ramanPreset].color + "08", border: `1px solid ${ramanMaterials[ramanPreset].color}22`, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: ramanMaterials[ramanPreset].color, fontSize: 11 }}>{pk.label}</div>
              <div style={{ fontSize: 10, color: T.ink }}>{pk.shift} cm⁻¹</div>
              <div style={{ fontSize: 9, color: T.muted }}>I = {pk.intensity}%</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            {ramanPreset === "Si" && "The 520 cm⁻¹ peak of silicon is the most commonly used calibration standard in Raman spectroscopy. Stress in thin films shifts this peak: compressive stress shifts it up, tensile stress shifts it down."}
            {ramanPreset === "Diamond" && "Diamond's sharp 1332 cm⁻¹ peak distinguishes it from graphite. The sp³ bonding gives a single strong peak, making Raman the gold standard for verifying diamond quality."}
            {ramanPreset === "Graphene" && "The 2D/G peak ratio identifies the number of graphene layers: monolayer has I(2D)/I(G) > 2. The D peak only appears with defects -- a pristine graphene sheet has no D peak at all."}
            {ramanPreset === "CdS" && "CdS shows longitudinal optical (LO) phonon modes with clear overtones (2LO, 3LO). The ratio of overtone to fundamental intensity is related to electron-phonon coupling strength."}
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the Raman Lab" color={C.spec} formula="Raman spectroscopy of TiO₂ film">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You deposited a TiO₂ thin film by sol-gel on a glass substrate and annealed it at 450°C for 2 hours. The film is intended for photocatalytic water purification, which requires the anatase phase (not rutile -- anatase has better photocatalytic activity). Before testing the photocatalysis, you need to confirm the film crystallized into anatase. You place the sample under the confocal Raman microscope, focus the 532 nm laser through the 50× objective, and acquire a spectrum.
        </div>

        <div style={{ background: C.spec + "06", border: `1px solid ${C.spec}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.spec, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine bouncing a ball off a trampoline. Most of the time the ball bounces back with the same energy (Rayleigh scattering). But occasionally the trampoline is vibrating, and the ball picks up or loses a tiny bit of energy from the vibration. By measuring how much energy the ball gained or lost, you can figure out how fast the trampoline was vibrating. Raman does this with photons and molecular vibrations -- each crystal phase has its own vibration frequencies.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Raman Microscope:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Laser wavelength" value="532 nm (Nd:YAG doubled)" />
          <InfoRow label="Laser power at sample" value="5 mW (low to avoid heating the film)" />
          <InfoRow label="Objective" value="50× (spot size ~1 µm)" />
          <InfoRow label="Spectral range" value="100-1000 cm⁻¹ (covers all TiO₂ modes)" />
          <InfoRow label="Acquisition time" value="10 seconds × 3 accumulations" />
          <InfoRow label="Why 532 nm?" value="Good efficiency; minimal fluorescence for oxides" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Spectrum" value="Intensity vs Raman shift (cm⁻¹)" />
          <InfoRow label="Dominant peak" value="Very strong, sharp peak at 144 cm⁻¹" />
          <InfoRow label="Additional peaks" value="399, 513, 639 cm⁻¹ (moderate intensity)" />
          <InfoRow label="Background" value="Smooth, no broad fluorescence hump" />
          <InfoRow label="Glass substrate signal?" value="Minimal (confocal rejects out-of-focus signal)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure Peak Positions Precisely:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Peak 1" value="144 cm⁻¹ (very strong, Eg mode)" />
          <InfoRow label="Peak 2" value="399 cm⁻¹ (medium, B1g mode)" />
          <InfoRow label="Peak 3" value="513 cm⁻¹ (medium, A1g + B1g)" />
          <InfoRow label="Peak 4" value="639 cm⁻¹ (medium, Eg mode)" />
          <InfoRow label="FWHM of 144 cm⁻¹ peak" value="8 cm⁻¹" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Phase Identification by Peak Matching:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Anatase reference peaks" result="144, 399, 513, 639 cm⁻¹" color={C.spec} />
          <CalcRow eq="Your peaks" result="144, 399, 513, 639 cm⁻¹ → ALL match anatase" color={C.spec} />
          <CalcRow eq="Rutile signature peaks" result="447 cm⁻¹ (Eg), 612 cm⁻¹ (A1g)" color={C.spec} />
          <CalcRow eq="Any peaks at 447 or 612 cm⁻¹?" result="None detected" color={C.spec} />
          <CalcRow eq="Phase conclusion" result="Pure anatase TiO₂" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Assess Crystallinity from FWHM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="FWHM of 144 cm⁻¹ peak" result="8 cm⁻¹" color={C.spec} />
          <CalcRow eq="Bulk single crystal anatase FWHM" result="~6 cm⁻¹" color={C.spec} />
          <CalcRow eq="Phonon confinement broadening" result="Δω ∝ 1/d (grain size d)" color={C.spec} />
          <CalcRow eq="Estimated grain size from correlation" result="~15 nm" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Phase" value="Pure anatase TiO₂ (no rutile, no brookite)" />
          <InfoRow label="Crystallinity" value="Good (FWHM only 2 cm⁻¹ broader than single crystal)" />
          <InfoRow label="Estimated grain size" value="~15 nm" />
          <InfoRow label="Uniformity (5 spots checked)" value="Same spectrum everywhere -- uniform film" />
          <InfoRow label="144 cm⁻¹ peak shift" value="None (no residual stress detected)" />
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The 450°C anneal successfully crystallized the sol-gel film into pure anatase -- exactly the phase needed for photocatalysis. No rutile peaks means the annealing temperature was well below the anatase-to-rutile transition (typically 600-700°C). The ~15 nm grain size from FWHM analysis is reasonable for a sol-gel film annealed at 450°C.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>What if the results were different?</strong> If you saw peaks at 447 and 612 cm⁻¹ alongside the anatase peaks, the film would be a mixed anatase/rutile phase -- you could estimate the ratio from relative peak intensities. If the 144 cm⁻¹ peak were very broad (FWHM &gt; 20 cm⁻¹) or absent entirely, the film would be amorphous and you would need a higher annealing temperature.
          </div>
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
  const [showDefectPL, setShowDefectPL] = useState(true);
  const [plTempDemo, setPlTempDemo] = useState(300);

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

      {/* ─── Temperature-Dependent PL & Defect Toggle ─── */}
      <Card title="Temperature-Dependent PL" color={C.spec} formula="Peak broadening, shift & quenching with T">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Observe how the PL spectrum changes with temperature: peak broadens, red-shifts, and quenches. Toggle the defect emission to see sub-bandgap luminescence.
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button onClick={() => setShowDefectPL(!showDefectPL)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: showDefectPL ? C.adv + "18" : T.surface,
            border: showDefectPL ? `1.5px solid ${C.adv}` : `1px solid ${T.border}`,
            color: showDefectPL ? C.adv : T.muted,
          }}>{showDefectPL ? "Defect Peak: ON" : "Defect Peak: OFF"}</button>
        </div>

        <SliderRow label="Temperature" value={plTempDemo} min={10} max={600} step={5} onChange={setPlTempDemo} color={C.accent} unit=" K" format={v => v.toString()} />

        <svg viewBox="0 0 500 220" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <text x={250} y={18} textAnchor="middle" fontSize={11} fill={C.spec} fontWeight={700}>
            PL Spectrum at {plTempDemo} K (Eg = {bandgap} eV)
          </text>
          <line x1={50} y1={190} x2={470} y2={190} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={190} x2={50} y2={30} stroke={T.ink} strokeWidth={1} />
          <text x={260} y={210} textAnchor="middle" fontSize={9} fill={T.muted}>Energy (eV)</text>
          <text x={15} y={110} fontSize={8} fill={T.muted} transform="rotate(-90,15,110)">PL Intensity</text>
          {/* Energy scale */}
          {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map(e => {
            const x = 50 + (e - 0.3) / 3.7 * 420;
            return x <= 470 ? <text key={e} x={x} y={203} textAnchor="middle" fontSize={7} fill={T.dim}>{e}</text> : null;
          })}

          {/* Band-edge PL peak */}
          {(() => {
            const thermalShift = -0.0004 * plTempDemo;
            const peakE = bandgap + thermalShift;
            const fwhm = 0.02 + plTempDemo * 0.0003;
            const intensity = Math.max(0.05, 1 - 0.5 * (1 - Math.exp(-500 / plTempDemo)));
            const peakX = 50 + (peakE - 0.3) / 3.7 * 420;
            const peakH = intensity * 140;
            const peakW = fwhm * 420 / 3.7;

            return (
              <g>
                <path d={Array.from({ length: 80 }, (_, i) => {
                  const e = peakE - fwhm * 3 + i * fwhm * 6 / 80;
                  const x = 50 + (e - 0.3) / 3.7 * 420;
                  const gauss = intensity * Math.exp(-0.5 * Math.pow((e - peakE) / (fwhm * 0.5), 2));
                  const y = 190 - gauss * 140;
                  return (i === 0 ? "M" : "L") + `${x},${y}`;
                }).join(" ")} fill={C.spec + "33"} stroke={C.spec} strokeWidth={1.5} />
                <text x={peakX} y={190 - peakH - 8} textAnchor="middle" fontSize={8} fill={C.spec} fontWeight={700}>
                  Band-edge: {peakE.toFixed(3)} eV
                </text>
                <text x={peakX} y={190 - peakH - 18} textAnchor="middle" fontSize={7} fill={T.muted}>
                  FWHM: {(fwhm * 1000).toFixed(0)} meV
                </text>
              </g>
            );
          })()}

          {/* Defect peak */}
          {showDefectPL && (() => {
            const defE = bandgap - defectLvl;
            const defX = 50 + (defE - 0.3) / 3.7 * 420;
            const defFwhm = 0.08 + plTempDemo * 0.0002;
            const defInt = 0.3 * Math.exp(-plTempDemo * 0.002);
            if (defX < 50 || defX > 470) return null;
            return (
              <g>
                <path d={Array.from({ length: 60 }, (_, i) => {
                  const e = defE - defFwhm * 3 + i * defFwhm * 6 / 60;
                  const x = 50 + (e - 0.3) / 3.7 * 420;
                  const gauss = defInt * Math.exp(-0.5 * Math.pow((e - defE) / (defFwhm * 0.5), 2));
                  const y = 190 - gauss * 140;
                  return (i === 0 ? "M" : "L") + `${x},${y}`;
                }).join(" ")} fill={C.adv + "22"} stroke={C.adv} strokeWidth={1.2} />
                <text x={defX} y={190 - defInt * 140 - 8} textAnchor="middle" fontSize={8} fill={C.adv}>Defect: {defE.toFixed(2)} eV</text>
              </g>
            );
          })()}

          {/* Temperature indicators */}
          <g transform="translate(380, 40)">
            <text x={0} y={0} fontSize={8} fill={T.ink} fontWeight={600}>Effects at {plTempDemo} K:</text>
            <text x={0} y={15} fontSize={7} fill={C.spec}>Peak shift: {(-0.0004 * plTempDemo * 1000).toFixed(0)} meV</text>
            <text x={0} y={28} fontSize={7} fill={C.accent}>Broadening: {(20 + plTempDemo * 0.3).toFixed(0)} meV</text>
            <text x={0} y={41} fontSize={7} fill={C.adv}>Quenching: {((1 - Math.max(0.05, 1 - 0.5 * (1 - Math.exp(-500 / plTempDemo)))) * 100).toFixed(0)}%</text>
          </g>
        </svg>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            Low-temperature PL (4-10 K) is a powerful diagnostic: sharp peaks reveal bound excitons, donor-acceptor pairs, and specific defect identities. At room temperature, thermal broadening washes out these details. The defect peak often dominates at low T because non-radiative pathways are frozen out.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the PL Lab" color={C.spec} formula="PL of GaAs wafer at 10 K">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> A GaAs wafer supplier claims their new wafer has "ultra-high purity" suitable for high-electron-mobility transistor (HEMT) fabrication. Low-temperature PL is the gold standard for evaluating semiconductor crystal quality -- defects and impurities that are invisible to XRD or even TEM show up as telltale emission peaks. You mount the wafer on the cold finger of a closed-cycle helium cryostat, cool to 10 K, and focus a 532 nm laser on the surface.
        </div>

        <div style={{ background: C.spec + "06", border: `1px solid ${C.spec}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.spec, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine throwing a ball high into the air (excitation) and listening to the sound it makes when it lands (emission). A perfectly smooth floor makes one clean "thud" at a single pitch. But if there are holes or bumps (defects), the ball makes additional sounds at different pitches. Low-temperature PL works the same way: a perfect crystal emits one sharp peak at the bandgap energy, but defects create additional peaks at lower energies.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Measurement:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Temperature" value="10 K (closed-cycle He cryostat)" />
          <InfoRow label="Excitation laser" value="532 nm (2.33 eV) -- well above GaAs bandgap" />
          <InfoRow label="Laser power" value="10 mW (low to avoid heating)" />
          <InfoRow label="Spectrometer" value="0.75 m focal length, 1200 g/mm grating" />
          <InfoRow label="Detector" value="LN₂-cooled CCD (InGaAs for near-IR)" />
          <InfoRow label="Why 10 K?" value="Thermal broadening frozen out; defect peaks resolved" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Emission spectrum" value="Intensity vs photon energy (or wavelength)" />
          <InfoRow label="Dominant peak (Peak 1)" value="1.514 eV (819 nm) -- very sharp" />
          <InfoRow label="Second peak (Peak 2)" value="1.493 eV (831 nm) -- broader, weaker" />
          <InfoRow label="Deep-level emission" value="None visible (no broad bands at 0.8-1.2 eV)" />
          <InfoRow label="Peak 1 FWHM" value="3.2 meV (extremely narrow)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Identify Peak 1 (the Dominant Emission):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="GaAs bandgap at 10 K" result="1.519 eV" color={C.spec} />
          <CalcRow eq="Peak 1 energy" result="1.514 eV" color={C.spec} />
          <CalcRow eq="Offset below bandgap = 1.519 - 1.514" result="5 meV" color={C.spec} />
          <CalcRow eq="GaAs free exciton binding energy (literature)" result="4.2 meV" color={C.spec} />
          <CalcRow eq="5 meV ≈ exciton binding energy" result="→ Free exciton (FX) peak" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Identify Peak 2:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Peak 2 energy" result="1.493 eV" color={C.spec} />
          <CalcRow eq="Offset below bandgap = 1.519 - 1.493" result="26 meV" color={C.spec} />
          <CalcRow eq="Known GaAs transitions at ~26 meV below Eg" result="Donor-acceptor pair (DAP)" color={C.spec} />
          <CalcRow eq="DAP involves residual Si donor + C acceptor" result="Common in GaAs" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full PL Assessment:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Free exciton (FX) at 1.514 eV" value="Dominant -- excellent sign" />
          <InfoRow label="FX FWHM" value="3.2 meV (< 5 meV = high quality)" />
          <InfoRow label="DAP at 1.493 eV" value="Weak (FX/DAP intensity ratio > 10)" />
          <InfoRow label="Deep-level bands" value="None (no EL2, no dislocation bands)" />
          <InfoRow label="Overall quality grade" value="Excellent -- suitable for HEMT" />
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The dominant free exciton peak with FWHM of only 3.2 meV is the hallmark of a high-quality GaAs crystal. In poor material, the FX peak would be broad (&gt; 10 meV) or absent entirely, replaced by defect-related bands. The weak DAP peak tells you there are some residual Si and C impurities, but the high FX/DAP intensity ratio (&gt; 10) means these are at very low concentrations.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The absence of deep-level emission (no broad bands below 1.3 eV) means there are no significant EL2 deep traps or dislocation networks. This wafer is indeed high quality and suitable for HEMT epitaxy.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> The supplier's claim holds up. If the FX peak had been absent and you saw only DAP or broad defect bands, you would reject the wafer. PL at 10 K is far more sensitive to crystal quality than room-temperature PL, where thermal broadening masks everything.
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── 11. UV-Vis ─── */
function UVVisSection() {
  const [conc, setConc] = useState(0.01);
  const [pathLen, setPathLen] = useState(1.0);
  const [uvPreset, setUvPreset] = useState(null);
  const [taucLineX, setTaucLineX] = useState(null);
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

      {/* ─── Material Presets & Interactive Tauc ─── */}
      <Card title="Interactive Tauc Plot" color={C.spec} formula="Extrapolate (αhν)^n → bandgap">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Select a material preset or adjust the bandgap slider. Click on the Tauc plot to place an extrapolation line and determine the bandgap.
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[
            { id: "CdTe", label: "CdTe", eg: 1.5, direct: true, color: "#dc2626" },
            { id: "Si", label: "Si", eg: 1.1, direct: false, color: "#2563eb" },
            { id: "ZnO", label: "ZnO", eg: 3.3, direct: true, color: "#059669" },
            { id: "TiO2", label: "TiO₂", eg: 3.2, direct: false, color: "#7c3aed" },
          ].map(m => (
            <button key={m.id} onClick={() => { setUvPreset(m.id); setBg(m.eg); setIsDirect(m.direct); setTaucLineX(null); }} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: uvPreset === m.id ? m.color + "18" : T.surface,
              border: uvPreset === m.id ? `1.5px solid ${m.color}` : `1px solid ${T.border}`,
              color: uvPreset === m.id ? m.color : T.muted,
            }}>{m.label} ({m.eg} eV, {m.direct ? "direct" : "indirect"})</button>
          ))}
        </div>

        {/* Interactive Tauc Plot */}
        <svg viewBox="0 0 500 250" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, cursor: "crosshair" }}
          onClick={(e) => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 500;
            if (x >= 50 && x <= 470) setTaucLineX(x);
          }}>
          <text x={250} y={18} textAnchor="middle" fontSize={11} fill={C.spec} fontWeight={700}>
            Tauc Plot — {uvPreset || "Custom"} ({isDirect ? "Direct" : "Indirect"}, n = {isDirect ? 2 : 0.5})
          </text>
          {/* Axes */}
          <line x1={50} y1={220} x2={470} y2={220} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={220} x2={50} y2={30} stroke={T.ink} strokeWidth={1} />
          <text x={260} y={245} textAnchor="middle" fontSize={9} fill={T.muted}>hν (eV)</text>
          <text x={15} y={125} fontSize={9} fill={T.muted} transform="rotate(-90,15,125)">(αhν){isDirect ? "²" : "^½"}</text>
          {/* Energy scale */}
          {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(e => {
            const x = 50 + (e - 0.5) / 5.0 * 420;
            return x <= 470 ? (
              <g key={e}>
                <line x1={x} y1={220} x2={x} y2={223} stroke={T.ink} strokeWidth={0.5} />
                <text x={x} y={234} textAnchor="middle" fontSize={7} fill={T.dim}>{e}</text>
              </g>
            ) : null;
          })}
          {/* Tauc curve */}
          <polyline points={Array.from({ length: 120 }, (_, i) => {
            const hv = 0.5 + i * 0.04;
            const x = 50 + (hv - 0.5) / 5.0 * 420;
            const alpha = hv > bg ? Math.pow(hv - bg, 1 / n) * 80 : 0;
            const y = 220 - Math.min(185, alpha);
            return `${x},${y}`;
          }).join(" ")} fill="none" stroke={C.spec} strokeWidth={2} />

          {/* Bandgap marker */}
          {(() => {
            const bgx = 50 + (bg - 0.5) / 5.0 * 420;
            return (
              <g>
                <line x1={bgx} y1={220} x2={bgx} y2={30} stroke={C.adv + "44"} strokeWidth={1} strokeDasharray="4,4" />
                <circle cx={bgx} cy={220} r={5} fill={C.adv} />
                <text x={bgx} y={215} textAnchor="middle" fontSize={9} fill={C.adv} fontWeight={700}>Eg = {bg} eV</text>
              </g>
            );
          })()}

          {/* User extrapolation line */}
          {taucLineX !== null && (() => {
            const clickHv = 0.5 + ((taucLineX - 50) / 420) * 5.0;
            const alpha = clickHv > bg ? Math.pow(clickHv - bg, 1 / n) * 80 : 0;
            const clickY = 220 - Math.min(185, alpha);
            const bgx = 50 + (bg - 0.5) / 5.0 * 420;
            return (
              <g>
                <line x1={bgx} y1={220} x2={taucLineX + 30} y2={clickY - 30}
                  stroke={C.accent} strokeWidth={2} strokeDasharray="5,3" />
                <circle cx={taucLineX} cy={clickY} r={4} fill={C.accent} />
                <text x={taucLineX + 8} y={clickY - 8} fontSize={8} fill={C.accent}>
                  hν = {clickHv.toFixed(2)} eV
                </text>
              </g>
            );
          })()}

          <text x={400} y={45} fontSize={8} fill={T.muted}>Click to extrapolate</text>

          {/* Wavelength edge */}
          <text x={100} y={45} fontSize={8} fill={C.spec}>λ_edge = {(1240 / bg).toFixed(0)} nm</text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
          {[
            { label: "CdTe", eg: "1.5 eV", lam: "827 nm", type: "Direct" },
            { label: "Si", eg: "1.1 eV", lam: "1127 nm", type: "Indirect" },
            { label: "ZnO", eg: "3.3 eV", lam: "376 nm", type: "Direct" },
            { label: "TiO₂", eg: "3.2 eV", lam: "388 nm", type: "Indirect" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 6, padding: "6px 8px", textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: C.spec, fontSize: 11 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: T.ink }}>{m.eg}</div>
              <div style={{ fontSize: 9, color: T.muted }}>{m.lam} | {m.type}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            The Tauc plot method is the standard way to extract semiconductor bandgaps from UV-Vis data. The key is choosing the right exponent: n=2 for direct bandgap materials (like CdTe, GaAs, ZnO) and n=1/2 for indirect bandgap materials (like Si, TiO2). The bandgap is where the linear portion extrapolates to zero on the x-axis.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the UV-Vis Lab" color={C.spec} formula="UV-Vis of ZnO nanoparticles">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You synthesized ZnO nanoparticles by a sol-gel method and need to confirm they have the right bandgap for UV-blocking sunscreen applications. If the particles are small enough (below ~5 nm), quantum confinement will blue-shift the bandgap above the bulk value of 3.37 eV. You disperse a small amount of your white nanoparticle powder in ethanol by ultrasonication, transfer the colloidal suspension to a quartz cuvette (glass absorbs UV!), and load it into the UV-Vis spectrophotometer.
        </div>

        <div style={{ background: C.spec + "06", border: `1px solid ${C.spec}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.spec, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Think of a window with a colored tint. White light goes in, and some colors come out dimmer (absorbed) while others pass through freely (transmitted). UV-Vis shines every color of light (from UV through visible) through your sample one wavelength at a time, measuring how much is absorbed at each color. ZnO strongly absorbs UV but lets visible light through -- that is why it makes a good invisible sunscreen.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the Measurement:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Instrument" value="Double-beam UV-Vis spectrophotometer" />
          <InfoRow label="Scan range" value="200-800 nm" />
          <InfoRow label="Cuvette" value="Quartz, 1 cm path length" />
          <InfoRow label="Reference cuvette" value="Pure ethanol (baseline subtraction)" />
          <InfoRow label="Scan speed" value="120 nm/min, 1 nm steps" />
          <InfoRow label="Why quartz?" value="Glass absorbs below 300 nm; quartz transmits to 190 nm" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Output" value="Absorbance (A) vs wavelength (nm)" />
          <InfoRow label="Below 350 nm" value="Strong absorption (A > 2)" />
          <InfoRow label="350-370 nm" value="Sharp absorption edge (drops rapidly)" />
          <InfoRow label="Above 380 nm" value="Near-zero absorption (transparent in visible)" />
          <InfoRow label="Absorption edge midpoint" value="~368 nm" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Convert to Energy and Build Tauc Plot:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Convert wavelength to energy: E = 1240 / λ(nm)" result="" color={C.spec} />
          <CalcRow eq="At absorption edge 368 nm: E = 1240/368" result="3.37 eV" color={C.spec} />
          <CalcRow eq="ZnO is a direct bandgap semiconductor" result="Use n = 2" color={C.spec} />
          <CalcRow eq="Tauc relation: (αhν)² = A(hν - Eg)" result="" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Extract Bandgap from Tauc Plot:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Plot (αhν)² vs hν" result="" color={C.spec} />
          <CalcRow eq="Find the linear region above the absorption edge" result="" color={C.spec} />
          <CalcRow eq="Fit a straight line to the linear portion" result="" color={C.spec} />
          <CalcRow eq="Extrapolate to (αhν)² = 0 (x-axis intercept)" result="Eg = 3.37 eV" color={C.spec} />
          <CalcRow eq="Compare: bulk ZnO Eg (literature)" result="3.37 eV → exact match" color={C.spec} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Optical bandgap" value="3.37 eV (direct)" />
          <InfoRow label="Absorption edge wavelength" value="368 nm (UV-A region)" />
          <InfoRow label="Visible transparency" value="Excellent (A < 0.05 above 400 nm)" />
          <InfoRow label="Quantum confinement?" value="No (Eg = bulk value → particles > 10 nm)" />
          <InfoRow label="Scattering baseline" value="Slight rise at short wavelengths (Rayleigh scattering)" />
        </div>

        <div style={{ background: C.spec + "08", border: `1px solid ${C.spec}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.spec, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The bandgap of 3.37 eV matches bulk ZnO exactly, meaning your nanoparticles are large enough (probably &gt; 20 nm based on the Bohr exciton radius of ZnO being ~2.3 nm) that quantum confinement does not kick in. The sharp absorption edge at 368 nm with full transparency above 400 nm is ideal for UV-blocking applications.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>What if the results were different?</strong> If the bandgap had been 3.5 eV or higher (absorption edge at ~354 nm), you would have quantum-confined particles below ~5 nm. If you saw a gradual absorption tail extending into the visible range (Urbach tail), it would indicate poor crystallinity or surface defect states. If the absorbance exceeded 3.0 in the UV, the concentration is too high and you would dilute the suspension.
          </div>
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
  const [semMode, setSemMode] = useState("SE");

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

      {/* ─── SE vs BSE Mode & Simulated SEM Image ─── */}
      <Card title="Imaging Mode Comparison" color={C.micro} formula="SE vs BSE Contrast">
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {["SE", "BSE"].map(mode => (
            <button key={mode} onClick={() => setSemMode(mode)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: semMode === mode ? C.micro + "18" : T.surface,
              border: semMode === mode ? `1.5px solid ${C.micro}` : `1px solid ${T.border}`,
              color: semMode === mode ? C.micro : T.muted,
            }}>{mode === "SE" ? "Secondary Electron (SE)" : "Backscatter Electron (BSE)"}</button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          {semMode === "SE"
            ? "SE imaging (<50 eV electrons) provides topographic contrast. Edges and ridges appear bright because more SEs escape from tilted surfaces. Best for surface morphology at high resolution."
            : "BSE imaging (high-energy reflected electrons) provides Z-contrast: heavier elements appear brighter. Useful for compositional mapping. Resolution is slightly lower than SE due to larger interaction volume."}
        </div>

        {/* Simulated SEM image */}
        <svg viewBox="0 0 500 200" style={{ width: "100%", background: "#111", borderRadius: 8, border: `1px solid ${T.border}` }}>
          <text x={250} y={15} textAnchor="middle" fontSize={10} fill="#ccc" fontWeight={700}>
            Simulated {semMode} Image — {voltage} kV
          </text>
          {/* Generate simulated grain structure */}
          {(() => {
            const rects = [];
            const seed = 42;
            for (let i = 0; i < 12; i++) {
              for (let j = 0; j < 8; j++) {
                const gx = 30 + i * 38 + Math.sin(i * 3.7 + j * 2.1) * 8;
                const gy = 25 + j * 20 + Math.cos(i * 2.3 + j * 1.7) * 5;
                const z = ((i * 7 + j * 13 + seed) % 5) + 1;
                rects.push({ x: gx, y: gy, z, i, j });
              }
            }
            return rects;
          })().map((r, idx) => {
            const edgeBright = semMode === "SE"
              ? 0.3 + 0.5 * Math.abs(Math.sin(r.i * 0.8 + r.j * 0.6)) + (r.i % 3 === 0 ? 0.2 : 0)
              : 0.15 + (r.z / 5) * 0.7;
            const noiseV = Math.sin(r.i * 5.3 + r.j * 3.1 + voltage * 0.1) * 0.08;
            const bright = Math.max(0, Math.min(1, edgeBright + noiseV));
            const gray = Math.floor(bright * 255);
            return (
              <rect key={idx} x={r.x} y={r.y} width={34} height={18} rx={1}
                fill={`rgb(${gray},${gray},${gray})`} stroke={`rgba(255,255,255,${semMode === "SE" ? 0.12 : 0.06})`} strokeWidth={0.5} />
            );
          })}
          {/* Scale bar */}
          <line x1={380} y1={185} x2={450} y2={185} stroke="#fff" strokeWidth={2} />
          <text x={415} y={180} textAnchor="middle" fontSize={8} fill="#fff">10 μm</text>
          {/* Info overlay */}
          <text x={30} y={195} fontSize={8} fill="#999">
            {semMode === "SE" ? "Topographic contrast — edges bright" : "Z-contrast — heavy elements bright"}
          </text>
          <text x={470} y={195} textAnchor="end" fontSize={8} fill="#999">{voltage} kV</text>
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <div style={{ background: (semMode === "SE" ? C.spec : C.accent) + "08", border: `1px solid ${semMode === "SE" ? C.spec : C.accent}22`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: semMode === "SE" ? C.spec : C.accent, marginBottom: 4 }}>
              {semMode === "SE" ? "SE Mode Details" : "BSE Mode Details"}
            </div>
            <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.6 }}>
              {semMode === "SE"
                ? "Energy: <50 eV | Depth: ~5-50 nm | Contrast: topography, edges | Best for: morphology, fracture surfaces, nanostructures"
                : "Energy: >50 eV to beam energy | Depth: ~100 nm-1 μm | Contrast: atomic number (Z) | Best for: phase identification, compositional mapping"}
            </div>
          </div>
          <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
            <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.6 }}>
              Lower voltage (1-5 kV) improves surface sensitivity and reduces charging on insulators, but decreases BSE signal. Higher voltage (15-30 kV) gives better BSE contrast and EDS signal but worse surface detail.
            </div>
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the SEM Lab" color={C.micro} formula="SEM cross-section of CdTe solar cell">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You fabricated a CdTe thin-film solar cell and just completed the CdCl₂ treatment (a critical annealing step that grows the grains and improves efficiency). You need to measure the grain size after treatment -- larger grains mean fewer grain boundaries and better device performance. You cleave the glass substrate to expose a fresh cross-section, sputter-coat it with ~5 nm of gold to prevent charging, and load it into the FE-SEM.
        </div>

        <div style={{ background: C.micro + "06", border: `1px solid ${C.micro}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.micro, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine photographing a loaf of sliced bread from the side -- you can see each slice (grain), measure how thick they are, and check if any have holes. SEM cross-section imaging does exactly this: you cleave through the solar cell stack and photograph it edge-on, revealing every layer and every grain within each layer.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the SEM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Accelerating voltage" value="15 kV (good compromise: resolution vs depth)" />
          <InfoRow label="Working distance" value="5 mm (short for best SE resolution)" />
          <InfoRow label="Detector" value="In-lens SE (best surface detail)" />
          <InfoRow label="Gold coating" value="~5 nm (prevents charging on cleaved surface)" />
          <InfoRow label="Magnification" value="10,000× for grain measurement" />
          <InfoRow label="Why 15 kV?" value="Enough signal for good contrast; not so high that interaction volume blurs features" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Image Shows:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Cross-section layers visible" value="Glass / FTO / CdS / CdTe / back contact" />
          <InfoRow label="CdTe layer" value="Columnar grains visible edge-on" />
          <InfoRow label="Grain boundaries" value="Visible as bright lines (SE edge effect)" />
          <InfoRow label="Voids" value="A few small voids at some grain boundaries" />
          <InfoRow label="Film thickness" value="Directly measurable from image" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure Grain Diameters (25 Grains):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Measurement method" value="Line intercept on cross-section image" />
          <InfoRow label="Number of grains measured" value="25 (across 3 different regions)" />
          <InfoRow label="Scale bar verification" value="Calibrated against known standard" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate Statistics:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Mean grain size d̄ = Σdᵢ / N = 57.5 / 25" result="2.3 µm" color={C.micro} />
          <CalcRow eq="Std dev σ = √[Σ(dᵢ - d̄)² / (N-1)]" result="0.8 µm" color={C.micro} />
          <CalcRow eq="Film thickness from cross-section" result="4.5 µm" color={C.micro} />
          <CalcRow eq="Grain size / film thickness = 2.3 / 4.5" result="0.51" color={C.micro} />
          <CalcRow eq="Grain aspect ratio ≈ 0.5" result="Columnar (grains span ~half the film)" color={C.micro} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full SEM Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Mean grain diameter" value="2.3 ± 0.8 µm" />
          <InfoRow label="Smallest grain measured" value="0.9 µm" />
          <InfoRow label="Largest grain measured" value="4.1 µm" />
          <InfoRow label="Film thickness" value="4.5 µm (target was 4-5 µm)" />
          <InfoRow label="CdS window layer" value="~100 nm (visible as thin bright line)" />
          <InfoRow label="Voids" value="~3 per 10 µm of boundary (small, < 200 nm)" />
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The CdCl₂ treatment worked well: average grain size 2.3 µm is above the 1 µm threshold needed for good solar cell performance. Grains span roughly half the film thickness, indicating a columnar structure where most grain boundaries extend from top to bottom -- this is actually desirable because it means photogenerated carriers only need to travel laterally ~1 µm to reach a grain boundary (which can assist collection).
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The few small voids at grain boundaries are a minor concern -- they could act as shunt paths if the back contact metal fills them. If void density were much higher, you would adjust the CdCl₂ treatment temperature or time.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> Film microstructure looks good for a solar cell targeting &gt; 14% efficiency. If grains had been &lt; 0.5 µm (no CdCl₂ treatment or too low temperature), you would expect much lower efficiency due to recombination at grain boundaries.
          </div>
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

      <Card title="Numerical Example: A Day in the HR-TEM Lab" color={C.micro} formula="HR-TEM of CdTe lattice fringes">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You need to verify at the atomic level that individual grains in your CdTe solar cell absorber are single-crystalline with the correct zinc-blende structure. You prepared a cross-section TEM sample using FIB (focused ion beam): a Ga⁺ beam cut a thin lamella from the CdTe layer, thinned it to ~60 nm, and welded it to a copper half-grid. You load it in the 200 kV TEM and tilt the grain to a zone axis where you see crisp lattice fringes.
        </div>

        <div style={{ background: C.micro + "06", border: `1px solid ${C.micro}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.micro, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine looking at a chain-link fence from far away -- you just see a blur. But if you walk closer and look through at exactly the right angle, the rows of links line up and you see a clear repeating pattern. HR-TEM is like getting your eye so close to the crystal that you can see the individual rows of atoms as bright and dark fringes. The spacing and angles of these fringes tell you exactly what crystal structure you have.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the TEM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Accelerating voltage" value="200 kV" />
          <InfoRow label="Sample thickness" value="~60 nm (FIB-prepared cross-section)" />
          <InfoRow label="Imaging mode" value="HR-TEM (phase contrast)" />
          <InfoRow label="Defocus" value="Scherzer defocus (~-40 nm for this microscope)" />
          <InfoRow label="Magnification" value="500,000× (lattice fringes visible)" />
          <InfoRow label="Why Scherzer defocus?" value="Optimizes phase contrast transfer for lattice imaging" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Image Shows:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Lattice fringes" value="Two sets of parallel lines crossing at an angle" />
          <InfoRow label="Fringe set 1" value="Wider spacing, strong contrast" />
          <InfoRow label="Fringe set 2" value="Narrower spacing, moderate contrast" />
          <InfoRow label="Grain boundary nearby" value="Abrupt change in fringe orientation" />
          <InfoRow label="Defects visible?" value="No stacking faults or dislocations in this area" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure from FFT (Digital Diffraction Pattern):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Perform FFT of the HR-TEM image" value="Spots appear (like a diffraction pattern)" />
          <InfoRow label="Fringe spacing d₁ (from FFT spot distance)" value="3.74 Å" />
          <InfoRow label="Fringe spacing d₂ (from FFT spot distance)" value="2.29 Å" />
          <InfoRow label="Angle between fringe sets" value="54.7°" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Index the Planes and Zone Axis:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="CdTe zinc-blende, a = 6.481 Å" result="" color={C.micro} />
          <CalcRow eq="d₁ = 3.74 Å → CdTe (111): d = a/√3 = 3.742 Å" result="✓ match" color={C.micro} />
          <CalcRow eq="d₂ = 2.29 Å → CdTe (220): d = a/√8 = 2.291 Å" result="✓ match" color={C.micro} />
          <CalcRow eq="Angle (111)-(220) in cubic" result="54.74° ✓ match" color={C.micro} />
          <CalcRow eq="Zone axis = (111) × (220) cross product" result="[1̄1̄2] zone axis" color={C.micro} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full HR-TEM Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Crystal structure confirmed" value="Zinc-blende (F4̄3m)" />
          <InfoRow label="Zone axis" value="[1̄1̄2]" />
          <InfoRow label="d-spacing accuracy" value="Within 0.5% of reference" />
          <InfoRow label="Stacking faults" value="None observed in this 20 × 20 nm region" />
          <InfoRow label="Grain boundary character" value="Sharp, no amorphous interlayer" />
          <InfoRow label="FIB damage layer" value="~2 nm amorphous on surface (can be removed by low-kV cleaning)" />
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The grain is confirmed as single-crystalline CdTe in the zinc-blende structure. Both d-spacings and the inter-planar angle match the reference values perfectly, and the absence of stacking faults or dislocations in this region indicates high crystallographic quality within the grain. The sharp grain boundary (no amorphous interlayer) is good for carrier transport -- an amorphous layer would create a recombination barrier.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>What if you saw something different?</strong> If the fringes were wavy or had periodic interruptions, you would have stacking faults (common in CdTe). If the FFT showed streaks instead of sharp spots, it would indicate heavy defect density. If no fringes were visible at all despite thin sample, the grain might be amorphous (the CdCl₂ treatment may have failed for that region).
          </div>
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
  const [afmMode, setAfmMode] = useState("tapping");

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (afmMode === "contact") { setK(0.1); setTipDist(0.8); setAmplitude(0); }
    else if (afmMode === "tapping") { setK(40); setTipDist(2.0); setAmplitude(20); }
    else { setK(40); setTipDist(5.0); setAmplitude(5); }
  }, [afmMode]);

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

      {/* ─── AFM Mode Selector ─── */}
      <Card title="AFM Operating Modes" color={C.micro} formula="Contact | Tapping | Non-contact">
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[
            { id: "contact", label: "Contact Mode", col: C.micro },
            { id: "tapping", label: "Tapping Mode", col: C.accent },
            { id: "noncontact", label: "Non-contact Mode", col: C.spec },
          ].map(m => (
            <button key={m.id} onClick={() => setAfmMode(m.id)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: afmMode === m.id ? m.col + "18" : T.surface,
              border: afmMode === m.id ? `1.5px solid ${m.col}` : `1px solid ${T.border}`,
              color: afmMode === m.id ? m.col : T.muted,
            }}>{m.label}</button>
          ))}
        </div>

        {/* Mode-specific animation and force curve region */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* Cantilever animation */}
          <svg viewBox="0 0 240 180" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={120} y={15} textAnchor="middle" fontSize={9} fill={afmMode === "contact" ? C.micro : afmMode === "tapping" ? C.accent : C.spec} fontWeight={700}>
              {afmMode === "contact" ? "Contact Mode" : afmMode === "tapping" ? "Tapping Mode" : "Non-contact Mode"}
            </text>
            {/* Cantilever */}
            {(() => {
              const modeCol = afmMode === "contact" ? C.micro : afmMode === "tapping" ? C.accent : C.spec;
              const osc = afmMode === "contact" ? 0 : afmMode === "tapping" ? Math.sin(animFrame * 0.4) * 15 : Math.sin(animFrame * 0.6) * 4;
              const tipY = afmMode === "contact" ? 105 : 90 + osc;
              const surfY = 110;
              return (
                <g>
                  <rect x={20} y={55} width={25} height={8} fill={T.ink + "44"} stroke={T.ink} strokeWidth={1} />
                  <line x1={45} y1={59} x2={120} y2={59 + osc * 0.2} stroke={modeCol} strokeWidth={2} />
                  <polygon points={`115,${59 + osc * 0.2} 120,${tipY} 125,${59 + osc * 0.2}`}
                    fill={modeCol + "44"} stroke={modeCol} strokeWidth={1} />
                  {/* Surface */}
                  <path d={"M 10,110 " + Array.from({ length: 25 }, (_, i) => `L${10 + i * 9},${110 + Math.sin(i * 0.9) * 4}`).join(" ")}
                    fill={T.ink + "11"} stroke={T.ink} strokeWidth={1.5} />
                  {/* Force arrow */}
                  {afmMode === "contact" && (
                    <g>
                      <line x1={120} y1={tipY} x2={120} y2={surfY} stroke={C.adv} strokeWidth={1.5} />
                      <text x={130} y={surfY - 2} fontSize={7} fill={C.adv}>F (repulsive)</text>
                    </g>
                  )}
                  {afmMode === "tapping" && (
                    <g>
                      <line x1={120} y1={75} x2={120} y2={105} stroke={modeCol} strokeWidth={0.8} strokeDasharray="2,2" />
                      <text x={130} y={92} fontSize={7} fill={modeCol}>A = {amplitude} nm</text>
                    </g>
                  )}
                  {afmMode === "noncontact" && (
                    <g>
                      <line x1={120} y1={80} x2={120} y2={95} stroke={modeCol} strokeWidth={0.8} strokeDasharray="2,2" />
                      <text x={130} y={90} fontSize={7} fill={modeCol}>small osc.</text>
                      <text x={130} y={100} fontSize={6} fill={T.muted}>freq. shift → F</text>
                    </g>
                  )}
                  {/* Feedback label */}
                  <text x={120} y={145} textAnchor="middle" fontSize={7} fill={T.muted}>
                    {afmMode === "contact" ? "Feedback: constant deflection" : afmMode === "tapping" ? "Feedback: constant amplitude" : "Feedback: frequency shift (Δf)"}
                  </text>
                  <text x={120} y={160} textAnchor="middle" fontSize={7} fill={T.muted}>
                    {afmMode === "contact" ? "k ~ 0.01-1 N/m (soft)" : afmMode === "tapping" ? "k ~ 10-50 N/m (stiff)" : "k ~ 10-50 N/m (stiff)"}
                  </text>
                  <text x={120} y={175} textAnchor="middle" fontSize={7} fill={modeCol} fontWeight={600}>
                    {afmMode === "contact" ? "Best: hard surfaces, friction" : afmMode === "tapping" ? "Best: soft/bio samples" : "Best: true atomic res. (UHV)"}
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Force curve with highlighted region */}
          <svg viewBox="0 0 240 180" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={120} y={15} textAnchor="middle" fontSize={9} fill={T.ink} fontWeight={600}>Force-Distance Regime</text>
            <rect x={20} y={25} width={200} height={130} fill={T.panel} stroke={T.border} strokeWidth={1} rx={4} />
            <line x1={40} y1={90} x2={200} y2={90} stroke={T.ink} strokeWidth={0.8} />
            <line x1={100} y1={145} x2={100} y2={30} stroke={T.ink} strokeWidth={0.8} />
            <text x={200} y={86} fontSize={7} fill={T.muted}>d</text>
            <text x={104} y={35} fontSize={7} fill={T.muted}>F</text>

            {/* Highlight the active region */}
            {afmMode === "contact" && (
              <rect x={40} y={30} width={55} height={60} fill={C.micro + "15"} stroke={C.micro} strokeWidth={1} strokeDasharray="3,3" rx={3} />
            )}
            {afmMode === "tapping" && (
              <rect x={60} y={55} width={50} height={80} fill={C.accent + "15"} stroke={C.accent} strokeWidth={1} strokeDasharray="3,3" rx={3} />
            )}
            {afmMode === "noncontact" && (
              <rect x={100} y={90} width={80} height={45} fill={C.spec + "15"} stroke={C.spec} strokeWidth={1} strokeDasharray="3,3" rx={3} />
            )}

            {/* Force curve */}
            <polyline points={Array.from({ length: 60 }, (_, i) => {
              const d_val = 0.5 + i * 0.15;
              const fvdw = -1 / (d_val * d_val);
              const frep = d_val < 1.5 ? 50 / Math.pow(d_val, 12) : 0;
              const f = fvdw + frep;
              const x = 40 + i * 2.7;
              const y = 90 - f * 8;
              return `${x},${Math.max(30, Math.min(140, y))}`;
            }).join(" ")} fill="none" stroke={T.ink} strokeWidth={1.5} />

            <text x={55} y={148} fontSize={7} fill={C.micro} fontWeight={600}>contact</text>
            <text x={90} y={148} fontSize={7} fill={C.accent} fontWeight={600}>tapping</text>
            <text x={135} y={148} fontSize={7} fill={C.spec} fontWeight={600}>non-contact</text>
            <text x={55} y={42} fontSize={7} fill={C.adv}>repulsive</text>
            <text x={145} y={105} fontSize={7} fill={C.micro}>attractive</text>
          </svg>
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Did You Know?</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            Tapping mode AFM was a game-changer for biology -- it allows imaging of soft, delicate samples like DNA, proteins, and living cells without dragging and damaging them. The cantilever "taps" the surface briefly at each pixel, reducing lateral forces by orders of magnitude compared to contact mode.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the AFM Lab" color={C.micro} formula="AFM of polished Si wafer">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> Before growing an epitaxial GaAs layer on a silicon wafer, you must verify the wafer surface is ultra-smooth. Even a single scratch or particle can nucleate defects that propagate through the entire epitaxial film. The incoming wafer specification requires RMS roughness Rq &lt; 0.5 nm. You place the wafer on the AFM stage, engage a tapping-mode cantilever, and scan a 5 × 5 µm area.
        </div>

        <div style={{ background: C.micro + "06", border: `1px solid ${C.micro}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.micro, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine running your fingertip across a table to check if it is smooth. Your finger cannot feel bumps smaller than ~1 mm. Now imagine a finger so tiny it can feel bumps as small as the width of a single atom (~0.1 nm). That is what the AFM tip does -- it traces the surface with sub-angstrom vertical sensitivity, building a topographic map of every tiny bump and valley.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the AFM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Mode" value="Tapping (intermittent contact)" />
          <InfoRow label="Cantilever" value="Si, k ~ 40 N/m, f₀ ~ 300 kHz" />
          <InfoRow label="Tip radius" value="~8 nm (new, sharp tip for best lateral resolution)" />
          <InfoRow label="Scan area" value="5 × 5 µm" />
          <InfoRow label="Pixel resolution" value="512 × 512 (= 262,144 height measurements)" />
          <InfoRow label="Scan rate" value="1 Hz (1 line per second, ~9 min total)" />
          <InfoRow label="Why tapping mode?" value="Avoids scratching the delicate polished surface" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Image Shows:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Height image" value="Extremely flat with sub-nm features" />
          <InfoRow label="Color scale" value="±1.5 nm (total Z range fits in 3 nm)" />
          <InfoRow label="Surface features" value="Faint atomic steps visible (~0.3 nm height)" />
          <InfoRow label="Scratches" value="None detected" />
          <InfoRow label="Particles" value="None detected (clean surface)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Raw Height Statistics (from 262,144 pixels):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Z range (max - min)" value="2.8 nm" />
          <InfoRow label="Max peak-to-valley (Rt)" value="2.1 nm" />
          <InfoRow label="Mean height z̄" value="0.00 nm (leveled by plane fit)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate Roughness:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Rq (RMS roughness) = √[Σ(zᵢ - z̄)² / N]" result="" color={C.micro} />
          <CalcRow eq="N = 512 × 512 = 262,144 pixels" result="" color={C.micro} />
          <CalcRow eq="Rq" result="0.18 nm" color={C.micro} />
          <CalcRow eq="Ra (arithmetic average) = Σ|zᵢ - z̄| / N" result="0.14 nm" color={C.micro} />
          <CalcRow eq="Spec requirement: Rq < 0.5 nm" result="0.18 < 0.5 → PASS" color={C.micro} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full AFM Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Rq (RMS roughness)" value="0.18 nm (sub-angstrom!)" />
          <InfoRow label="Ra (arithmetic roughness)" value="0.14 nm" />
          <InfoRow label="Z range" value="2.8 nm" />
          <InfoRow label="Scratches detected" value="None in 5 × 5 µm scan" />
          <InfoRow label="Particles detected" value="None" />
          <InfoRow label="Atomic steps visible?" value="Yes (0.3 nm height, consistent with Si step height)" />
          <InfoRow label="Qualification" value="PASS -- suitable for epitaxial growth" />
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Rq = 0.18 nm is exceptional -- this is less than the diameter of a single silicon atom (0.22 nm). The visible atomic steps confirm the CMP (chemical mechanical polishing) achieved an epi-ready surface. The wafer passes the &lt; 0.5 nm specification with large margin and is approved for epitaxial growth.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>What would cause a FAIL?</strong> Rq &gt; 0.5 nm could come from CMP scratches (linear features in the height map), slurry particle contamination (bright spots 5-50 nm tall), or inadequate final cleaning (organic residue creating ~1 nm bumps). If any of these were present, you would send the wafer back for re-polishing or re-cleaning before loading it into the expensive epitaxy reactor.
          </div>
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
  const [stmScanning, setStmScanning] = useState(false);
  const [stmScanLine, setStmScanLine] = useState(0);
  const [stmScanData, setStmScanData] = useState([]);

  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => (f + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!stmScanning) return;
    const id = setInterval(() => {
      setStmScanLine(prev => {
        if (prev >= 19) { setStmScanning(false); return 19; }
        return prev + 1;
      });
      setStmScanData(prev => {
        const line = Array.from({ length: 20 }, (_, i) => {
          const atomX = i % 4;
          const atomY = (prev.length) % 4;
          const onAtom = (atomX === 1 || atomX === 3) && (atomY === 1 || atomY === 3);
          return onAtom ? 0.8 + Math.random() * 0.2 : 0.15 + Math.random() * 0.15;
        });
        return [...prev, line];
      });
    }, 200);
    return () => clearInterval(id);
  }, [stmScanning]);

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

      {/* ─── Simulated STM Scan ─── */}
      <Card title="Simulated STM Scan" color={C.micro} formula="Line-by-line image acquisition">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Watch the STM tip scan across a surface with atomic corrugation. Each scan line measures tunneling current variations that map to atom positions.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => { setStmScanning(true); setStmScanLine(0); setStmScanData([]); }} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: stmScanning ? C.micro + "18" : C.micro + "08",
            border: `1.5px solid ${C.micro}`, color: C.micro,
          }}>{stmScanning ? "Scanning..." : "Run Scan"}</button>
          <button onClick={() => { setStmScanning(false); setStmScanLine(0); setStmScanData([]); }} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: T.surface, border: `1px solid ${T.border}`, color: T.muted,
          }}>Reset</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* STM Image building up */}
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>STM Topography Image</div>
            <svg viewBox="0 0 220 220" style={{ width: "100%", background: "#111", borderRadius: 8, border: `1px solid ${T.border}` }}>
              {/* Built up scan lines */}
              {stmScanData.map((line, row) =>
                line.map((val, col) => {
                  const gray = Math.floor(val * 255);
                  return (
                    <rect key={`${row}-${col}`} x={10 + col * 10} y={10 + row * 10} width={10} height={10}
                      fill={`rgb(${Math.floor(gray * 0.7)},${gray},${Math.floor(gray * 0.8)})`} />
                  );
                })
              )}
              {/* Scanning tip indicator */}
              {stmScanning && stmScanLine < 20 && (
                <g>
                  <line x1={10} y1={10 + stmScanLine * 10 + 5} x2={210} y2={10 + stmScanLine * 10 + 5}
                    stroke={C.accent} strokeWidth={1} opacity={0.8} />
                  <polygon points={`${10 + (animFrame % 20) * 10},${10 + stmScanLine * 10 - 5} ${10 + (animFrame % 20) * 10 - 3},${10 + stmScanLine * 10 - 12} ${10 + (animFrame % 20) * 10 + 3},${10 + stmScanLine * 10 - 12}`}
                    fill={C.micro} />
                </g>
              )}
              {/* Atom grid overlay (expected positions) */}
              {stmScanData.length >= 19 && Array.from({ length: 5 }, (_, i) =>
                Array.from({ length: 5 }, (_, j) => (
                  <circle key={`a${i}-${j}`} cx={20 + i * 40 + 20} cy={20 + j * 40 + 20} r={12}
                    fill="none" stroke={C.accent + "33"} strokeWidth={0.5} strokeDasharray="2,2" />
                ))
              )}
              <text x={110} y={215} textAnchor="middle" fontSize={8} fill="#666">
                {stmScanData.length}/20 lines scanned
              </text>
            </svg>
          </div>

          {/* Tunneling current trace */}
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Tunneling Current (last scan line)</div>
            <svg viewBox="0 0 220 220" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <line x1={20} y1={190} x2={210} y2={190} stroke={T.ink} strokeWidth={0.8} />
              <line x1={20} y1={190} x2={20} y2={20} stroke={T.ink} strokeWidth={0.8} />
              <text x={115} y={210} textAnchor="middle" fontSize={8} fill={T.muted}>Position (Å)</text>
              <text x={8} y={105} fontSize={7} fill={T.muted} transform="rotate(-90,8,105)">I_t (nA)</text>
              {/* Current trace from last line */}
              {stmScanData.length > 0 && (() => {
                const lastLine = stmScanData[stmScanData.length - 1];
                const points = lastLine.map((val, i) => `${20 + i * 9.5},${190 - val * 150}`).join(" ");
                return <polyline points={points} fill="none" stroke={C.micro} strokeWidth={1.5} />;
              })()}
              {/* Atom markers */}
              {stmScanData.length > 0 && stmScanData[stmScanData.length - 1].map((val, i) => (
                val > 0.5 ? <circle key={i} cx={20 + i * 9.5} cy={190 - val * 150} r={3} fill={C.accent} opacity={0.7} /> : null
              ))}
              <text x={115} y={15} textAnchor="middle" fontSize={9} fill={C.micro} fontWeight={600}>
                Line {stmScanData.length} / 20
              </text>
            </svg>
          </div>
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Did You Know?</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            The STM was invented in 1981 by Gerd Binnig and Heinrich Rohrer at IBM Zurich, earning them the 1986 Nobel Prize. It was the first instrument to directly image individual atoms on a surface. A typical STM scan takes minutes to hours -- each pixel requires precise positioning of the tip to sub-angstrom accuracy.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the STM Lab" color={C.micro} formula="STM of Si(111)-7×7 reconstruction">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You are studying clean silicon surfaces for semiconductor processing research. You prepare a Si(111) sample by flash-annealing it to 1200°C in ultra-high vacuum (UHV) by passing a direct current through the wafer piece. The flash removes the native oxide and, upon cooling, the surface atoms rearrange into the famous 7×7 reconstruction. You approach a tungsten STM tip (electrochemically etched to atomic sharpness) and begin scanning.
        </div>

        <div style={{ background: C.micro + "06", border: `1px solid ${C.micro}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.micro, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine holding a metal needle so close to a surface that electrons can magically "jump" across the gap without touching -- that is quantum tunneling. The current depends exponentially on the gap distance: move 1 Å closer and the current increases ~10×. By scanning this needle and keeping the current constant (the needle rises over bumps and dips over valleys), you trace out the position of individual atoms.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the STM:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Chamber pressure" value="5 × 10⁻¹¹ torr (UHV -- atomically clean surface)" />
          <InfoRow label="Sample preparation" value="Flash anneal to 1200°C, slow cool through 850°C" />
          <InfoRow label="Tip material" value="Electrochemically etched tungsten" />
          <InfoRow label="Bias voltage" value="-2.0 V (sample negative → image filled states)" />
          <InfoRow label="Tunneling current setpoint" value="0.1 nA" />
          <InfoRow label="Scan mode" value="Constant current (tip height = topography)" />
          <InfoRow label="Scan area" value="20 × 20 nm" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Image Shows:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Overall pattern" value="Beautiful periodic array of triangular unit cells" />
          <InfoRow label="Bright protrusions" value="12 per unit cell, arranged in two triangular halves" />
          <InfoRow label="Dark spots" value="Corner holes at vertices of each unit cell" />
          <InfoRow label="Asymmetry" value="One triangular half is slightly brighter than the other" />
          <InfoRow label="Corrugation" value="Adatoms appear ~0.08 nm above background" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure the Unit Cell:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Unit cell size (measured)" value="2.69 nm" />
          <InfoRow label="Si(111) surface lattice constant" value="0.384 nm" />
          <InfoRow label="Adatoms per unit cell" value="12 (6 per half)" />
          <InfoRow label="Corner hole depth" value="0.15 nm" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Verify the 7×7 Reconstruction:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Periodicity = unit cell / surface lattice constant" result="" color={C.micro} />
          <CalcRow eq="= 2.69 nm / 0.384 nm" result="7.0×" color={C.micro} />
          <CalcRow eq="Expected for 7×7: 7 × 0.384 nm" result="2.688 nm" color={C.micro} />
          <CalcRow eq="Measured vs expected" result="2.69 ≈ 2.688 nm ✓" color={C.micro} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Check the DAS Model Features:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="12 adatoms per unit cell" result="✓ matches DAS model" color={C.micro} />
          <CalcRow eq="Corner holes at unit cell vertices" result="✓ observed (depth 0.15 nm)" color={C.micro} />
          <CalcRow eq="Faulted half brighter at -2 V bias?" result="✓ Yes (more filled states)" color={C.micro} />
          <CalcRow eq="Adatom corrugation" result="0.08 nm (typical for filled-state imaging)" color={C.micro} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full STM Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Reconstruction confirmed" value="Si(111)-7×7 DAS" />
          <InfoRow label="Unit cell periodicity" value="2.69 nm (7× surface lattice)" />
          <InfoRow label="Surface defect density" value="< 1 missing adatom per 50 unit cells" />
          <InfoRow label="Terrace width" value="~100 nm between atomic steps" />
          <InfoRow label="Step height" value="0.314 nm (one Si(111) bilayer)" />
        </div>

        <div style={{ background: C.micro + "08", border: `1px solid ${C.micro}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.micro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Scientist</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The 7×7 reconstruction is the most complex and well-known surface reconstruction in materials science. Your image perfectly matches the DAS (dimer-adatom-stacking fault) model proposed by Takayanagi in 1985: 12 adatoms, corner holes, and the faulted/unfaulted half asymmetry are all present. The very low defect density (less than 1 missing adatom per 50 unit cells) confirms an excellent preparation.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The brightness asymmetry between the two halves is a purely electronic effect: the faulted half has slightly higher local density of states (LDOS) at the Fermi level, so more electrons tunnel from it at -2 V bias. If you reversed the bias to +2 V (empty states), the asymmetry would change -- this demonstrates that STM images are NOT purely topographic but also reflect electronic structure.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> This is a textbook-perfect Si(111)-7×7 surface. The STM is working at true atomic resolution. If you had seen a disordered surface without the 7×7 pattern, it would mean the flash anneal was insufficient or the UHV had a leak contaminating the surface.
          </div>
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

      <Card title="Numerical Example: A Day at the Synchrotron SAXS Beamline" color={C.adv} formula="SAXS of SiO₂ nanoparticles">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You synthesized silica (SiO₂) nanoparticles by the Stöber process and need an accurate size measurement. DLS (dynamic light scattering) in your home lab gave ~35 nm, but DLS measures the hydrodynamic diameter including the solvation shell. You want the true particle diameter, so you bring your colloidal suspension to a synchrotron SAXS beamline where the intense, collimated X-ray beam gives highly precise scattering data.
        </div>

        <div style={{ background: C.adv + "06", border: `1px solid ${C.adv}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.adv, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine shining a flashlight through fog. The tiny water droplets scatter the light, and by measuring how the brightness varies with angle, you can figure out the droplet size. Larger droplets scatter light into narrower angles, smaller droplets scatter more broadly. SAXS does the same thing with X-rays and nanoparticles -- the scattering pattern at small angles encodes the particle size and shape.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up at the Beamline:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="X-ray energy" value="12 keV (λ = 1.033 Å)" />
          <InfoRow label="Sample" value="SiO₂ suspension in ethanol, 1 mg/mL" />
          <InfoRow label="Sample holder" value="1 mm quartz capillary (flow cell)" />
          <InfoRow label="Background" value="Pure ethanol (measured separately for subtraction)" />
          <InfoRow label="Detector" value="2D Pilatus detector, 2 m sample-to-detector distance" />
          <InfoRow label="Exposure time" value="1 second (synchrotron is very bright!)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Detector Records:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="2D pattern" value="Concentric rings (isotropic scattering)" />
          <InfoRow label="After azimuthal averaging" value="I(q) vs q curve" />
          <InfoRow label="q = 4π sinθ / λ" value="q range: 0.005 to 0.5 Å⁻¹" />
          <InfoRow label="Low-q region" value="Flat (Guinier plateau)" />
          <InfoRow label="Intermediate q" value="Steep drop-off" />
          <InfoRow label="High q" value="Oscillations (form factor fringes for monodisperse spheres)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Guinier Analysis (Low-q Region):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Guinier approximation: ln I(q) = ln I(0) - Rg²q²/3" result="" color={C.adv} />
          <CalcRow eq="Plot ln I vs q² (should be linear at low q)" result="" color={C.adv} />
          <CalcRow eq="Linear fit slope" result="-56.3 Å²" color={C.adv} />
          <CalcRow eq="Guinier validity: q_max × Rg < 1.3" result="✓ satisfied" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Calculate Radius of Gyration:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Slope = -Rg² / 3 = -56.3" result="" color={C.adv} />
          <CalcRow eq="Rg² = 56.3 × 3 = 168.9 Å²" result="" color={C.adv} />
          <CalcRow eq="Rg = √168.9" result="13.0 nm" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Convert to Particle Diameter:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="For a solid sphere: R = Rg × √(5/3)" result="" color={C.adv} />
          <CalcRow eq="R = 13.0 × √(5/3) = 13.0 × 1.291" result="16.8 nm" color={C.adv} />
          <CalcRow eq="Diameter = 2R" result="33.6 nm" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full SAXS Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Radius of gyration Rg" value="13.0 ± 0.2 nm" />
          <InfoRow label="Particle diameter (sphere model)" value="33.6 ± 0.5 nm" />
          <InfoRow label="DLS diameter (for comparison)" value="35 nm (slightly larger due to solvation shell)" />
          <InfoRow label="Polydispersity" value="Low (clean Guinier region, visible form factor fringes)" />
          <InfoRow label="Particle shape" value="Spherical (isotropic 2D pattern)" />
        </div>

        <div style={{ background: C.adv + "08", border: `1px solid ${C.adv}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.adv, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Scientist</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The SAXS-derived diameter of 33.6 nm agrees well with the DLS value of 35 nm -- the 1.4 nm difference is the solvation shell that DLS sees but SAXS does not. The clean linear Guinier region and visible form factor fringes at higher q confirm the particles are monodisperse spheres, exactly what the Stöber process should produce.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Why synchrotron SAXS?</strong> A lab SAXS instrument could do this measurement too, but would need ~30 minutes of exposure instead of 1 second, and the data would be noisier. The synchrotron advantage is speed and data quality -- critical if you are doing time-resolved studies (watching nanoparticle growth in real time) or have limited sample volume.
          </div>
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

      <Card title="Numerical Example: A Day in the In-Situ TEM Lab" color={C.adv} formula="In-situ TEM of Cu nanoparticle oxidation">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> You are studying copper oxidation kinetics at the nanoscale because your company makes copper nanoparticle inks for printed electronics. The inks degrade when Cu nanoparticles oxidize, so you need to understand the kinetics to design better passivation strategies. You drop-cast Cu nanoparticles onto a MEMS-based heating TEM chip, load it in an environmental TEM (ETEM), introduce 1 mbar of O₂, and ramp to 300°C while recording video at 5 frames per second.
        </div>

        <div style={{ background: C.adv + "06", border: `1px solid ${C.adv}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.adv, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Most TEM imaging is like taking a photograph of a finished painting. In-situ TEM is like filming the artist while they paint -- you watch the process happen in real time. Here you are filming copper particles as they grow an oxide shell, frame by frame, at atomic resolution.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Set Up the In-Situ Experiment:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Heating holder" value="MEMS chip (Protochips Aduro) -- minimal drift" />
          <InfoRow label="Temperature" value="300°C (ramp rate 100°C/min)" />
          <InfoRow label="Gas environment" value="1 mbar O₂ (ETEM differentially pumped)" />
          <InfoRow label="TEM voltage" value="200 kV (low dose to minimize beam effects)" />
          <InfoRow label="Recording" value="Direct electron detector, 5 fps, 2048 × 2048 pixels" />
          <InfoRow label="Why MEMS heater?" value="Drift &lt; 1 nm/min vs ~10 nm/min for old furnace holders" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What You See in the Video:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="t = 0 min" value="Clean Cu nanoparticle, ~20 nm diameter, single crystal" />
          <InfoRow label="t = 2 min" value="Thin shell (~1 nm) appears around the particle" />
          <InfoRow label="t = 5 min" value="Shell clearly visible, ~2 nm thick, shows lattice fringes" />
          <InfoRow label="t = 10 min" value="Shell grows to ~3 nm, Cu core is shrinking" />
          <InfoRow label="t = 20 min" value="Shell is ~4 nm thick, slowing down noticeably" />
          <InfoRow label="Shell lattice fringes" value="d = 2.47 Å visible in the oxide shell" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- Measure Oxide Thickness at Each Time Point:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="t = 0 min" value="x = 0 nm" />
          <InfoRow label="t = 5 min" value="x = 2.1 nm" />
          <InfoRow label="t = 10 min" value="x = 3.0 nm" />
          <InfoRow label="t = 20 min" value="x = 4.2 nm" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Fit to Parabolic Growth Law:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Parabolic law: x² = k × t (diffusion-limited)" result="" color={C.adv} />
          <CalcRow eq="At t = 5 min: k = (2.1)² / 5 = 4.41 / 5" result="0.88 nm²/min" color={C.adv} />
          <CalcRow eq="At t = 10 min: k = (3.0)² / 10 = 9.0 / 10" result="0.90 nm²/min" color={C.adv} />
          <CalcRow eq="At t = 20 min: k = (4.2)² / 20 = 17.64 / 20" result="0.88 nm²/min" color={C.adv} />
          <CalcRow eq="Average rate constant k" result="0.88 ± 0.01 nm²/min" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Identify the Oxide Phase:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Lattice fringes in shell: d = 2.47 Å" result="" color={C.adv} />
          <CalcRow eq="Cu₂O (111) reference: d = 2.465 Å" result="✓ match" color={C.adv} />
          <CalcRow eq="CuO (111) reference: d = 2.323 Å" result="✗ no match" color={C.adv} />
          <CalcRow eq="Oxide identification" result="Cu₂O (cuprous oxide)" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full In-Situ Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Oxide phase" value="Cu₂O (cuprous oxide, not CuO)" />
          <InfoRow label="Growth kinetics" value="Parabolic (x² ∝ t)" />
          <InfoRow label="Rate constant at 300°C" value="0.88 nm²/min" />
          <InfoRow label="Growth mechanism" value="Diffusion-limited (Cu⁺ ions through oxide shell)" />
          <InfoRow label="Oxide shell at t = 20 min" value="4.2 nm (approaching self-limiting thickness)" />
          <InfoRow label="Core-shell interface" value="Coherent (no void formation observed)" />
        </div>

        <div style={{ background: C.adv + "08", border: `1px solid ${C.adv}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.adv, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            The parabolic kinetics (x² ∝ t, constant k) prove the growth is diffusion-limited -- Cu⁺ ions must diffuse through the growing oxide shell to reach the gas interface, and this gets slower as the shell thickens. This is good news for the ink application: the oxide is self-limiting and will not consume the entire particle at 300°C.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The oxide is Cu₂O (Cu⁺), not CuO (Cu²⁺). This matters because Cu₂O is a p-type semiconductor that can actually be beneficial as a contact layer, while CuO is more resistive. For the printed electronics application, a thin Cu₂O shell (&lt; 5 nm) is tolerable -- it can be reduced back to Cu during sintering in forming gas (N₂/H₂).
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> The in-situ TEM experiment directly reveals the mechanism (diffusion-limited), the product (Cu₂O), and the kinetics (k = 0.88 nm²/min) -- information that ex-situ techniques could only infer indirectly.
          </div>
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
  const [aptShowFe, setAptShowFe] = useState(true);
  const [aptShowCu, setAptShowCu] = useState(true);
  const [aptShowC, setAptShowC] = useState(true);
  const [aptSlicePos, setAptSlicePos] = useState(50);

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

      {/* ─── Interactive 3D Reconstruction & Composition Profile ─── */}
      <Card title="Interactive 3D Reconstruction" color={C.adv} formula="Element filters & composition profile">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 10 }}>
          Toggle element visibility to isolate specific species in the reconstruction. Move the slice position to see how composition changes through the volume.
        </div>
        {/* Element filter buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[
            { id: "Fe", show: aptShowFe, set: setAptShowFe, color: C.adv, label: "Fe (matrix)" },
            { id: "Cu", show: aptShowCu, set: setAptShowCu, color: C.micro, label: "Cu (precipitate)" },
            { id: "C", show: aptShowC, set: setAptShowC, color: C.accent, label: "C (segregation)" },
          ].map(el => (
            <button key={el.id} onClick={() => el.set(!el.show)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: el.show ? el.color + "18" : T.surface,
              border: el.show ? `1.5px solid ${el.color}` : `1px solid ${T.border}`,
              color: el.show ? el.color : T.muted,
            }}>{el.show ? "✓ " : ""}{el.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {/* 3D Reconstruction */}
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>3D Atom Map</div>
            <svg viewBox="0 0 220 240" style={{ width: "100%", background: T.panel, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <rect x={10} y={10} width={200} height={200} fill={T.surface} stroke={T.border} strokeWidth={1} rx={4} />
              {/* Atoms */}
              {(() => {
                const atoms = [];
                for (let i = 0; i < 120; i++) {
                  const x = 15 + (i * 37 + Math.sin(i * 3.7) * 30) % 190;
                  const y = 15 + (i * 23 + Math.cos(i * 2.1) * 20) % 190;
                  const depthZ = (i * 17) % 100;
                  const isCu = (depthZ > 30 && depthZ < 70) && (x > 80 && x < 150) && (y > 60 && y < 140);
                  const isC = depthZ > 45 && depthZ < 55 && !isCu;
                  const type = isCu ? "Cu" : isC ? "C" : "Fe";
                  atoms.push({ x, y, depthZ, type });
                }
                return atoms;
              })().map((atom, i) => {
                const show = (atom.type === "Fe" && aptShowFe) || (atom.type === "Cu" && aptShowCu) || (atom.type === "C" && aptShowC);
                if (!show) return null;
                const col = atom.type === "Fe" ? C.adv : atom.type === "Cu" ? C.micro : C.accent;
                const r = atom.type === "Cu" ? 3 : atom.type === "C" ? 2.5 : 2;
                const nearSlice = Math.abs(atom.depthZ - aptSlicePos) < 5;
                return (
                  <circle key={i} cx={atom.x} cy={atom.y} r={nearSlice ? r + 1 : r}
                    fill={col} opacity={nearSlice ? 0.9 : 0.3 + atom.depthZ * 0.005}
                    stroke={nearSlice ? "#fff" : "none"} strokeWidth={nearSlice ? 0.5 : 0} />
                );
              })}
              {/* Slice indicator */}
              <line x1={10} y1={10 + aptSlicePos * 2} x2={210} y2={10 + aptSlicePos * 2}
                stroke={C.accent} strokeWidth={1} strokeDasharray="4,4" opacity={0.6} />
              <text x={215} y={14 + aptSlicePos * 2} fontSize={7} fill={C.accent}>z = {aptSlicePos}%</text>
              {/* Legend */}
              <g transform="translate(15, 218)">
                {aptShowFe && <><circle cx={5} cy={0} r={2} fill={C.adv} /><text x={10} y={3} fontSize={6} fill={T.muted}>Fe</text></>}
                {aptShowCu && <><circle cx={35} cy={0} r={3} fill={C.micro} /><text x={40} y={3} fontSize={6} fill={T.muted}>Cu</text></>}
                {aptShowC && <><circle cx={65} cy={0} r={2.5} fill={C.accent} /><text x={70} y={3} fontSize={6} fill={T.muted}>C</text></>}
              </g>
            </svg>
          </div>

          {/* Composition profile */}
          <div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>1D Composition Profile</div>
            <svg viewBox="0 0 220 240" style={{ width: "100%", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <text x={110} y={15} textAnchor="middle" fontSize={9} fill={T.ink} fontWeight={600}>Composition vs Depth</text>
              <line x1={30} y1={210} x2={200} y2={210} stroke={T.ink} strokeWidth={0.8} />
              <line x1={30} y1={210} x2={30} y2={25} stroke={T.ink} strokeWidth={0.8} />
              <text x={115} y={230} textAnchor="middle" fontSize={8} fill={T.muted}>Depth (%)</text>
              <text x={10} y={120} fontSize={7} fill={T.muted} transform="rotate(-90,10,120)">at%</text>
              {/* Fe profile */}
              {aptShowFe && (
                <polyline points={Array.from({ length: 50 }, (_, i) => {
                  const z = i * 2;
                  const x = 30 + (z / 100) * 170;
                  const fePct = (z > 30 && z < 70) ? 60 : 90;
                  const y = 210 - (fePct / 100) * 180;
                  return `${x},${y}`;
                }).join(" ")} fill="none" stroke={C.adv} strokeWidth={1.5} />
              )}
              {/* Cu profile */}
              {aptShowCu && (
                <polyline points={Array.from({ length: 50 }, (_, i) => {
                  const z = i * 2;
                  const x = 30 + (z / 100) * 170;
                  const cuPct = (z > 30 && z < 70) ? 30 * Math.exp(-0.01 * (z - 50) * (z - 50)) + 5 : 2;
                  const y = 210 - (cuPct / 100) * 180;
                  return `${x},${y}`;
                }).join(" ")} fill="none" stroke={C.micro} strokeWidth={1.5} />
              )}
              {/* C profile */}
              {aptShowC && (
                <polyline points={Array.from({ length: 50 }, (_, i) => {
                  const z = i * 2;
                  const x = 30 + (z / 100) * 170;
                  const cPct = (z > 45 && z < 55) ? 8 * Math.exp(-0.05 * (z - 50) * (z - 50)) + 1 : 1;
                  const y = 210 - (cPct / 100) * 180;
                  return `${x},${y}`;
                }).join(" ")} fill="none" stroke={C.accent} strokeWidth={1.5} />
              )}
              {/* Slice position marker */}
              <line x1={30 + (aptSlicePos / 100) * 170} y1={25} x2={30 + (aptSlicePos / 100) * 170} y2={210}
                stroke={C.accent + "66"} strokeWidth={1} strokeDasharray="3,3" />
              {/* Legend */}
              <g transform="translate(130, 30)">
                {aptShowFe && <><line x1={0} y1={0} x2={15} y2={0} stroke={C.adv} strokeWidth={2} /><text x={18} y={3} fontSize={7} fill={C.adv}>Fe</text></>}
                {aptShowCu && <><line x1={0} y1={12} x2={15} y2={12} stroke={C.micro} strokeWidth={2} /><text x={18} y={15} fontSize={7} fill={C.micro}>Cu</text></>}
                {aptShowC && <><line x1={0} y1={24} x2={15} y2={24} stroke={C.accent} strokeWidth={2} /><text x={18} y={27} fontSize={7} fill={C.accent}>C</text></>}
              </g>
              {/* Region labels */}
              <text x={70} y={40} fontSize={7} fill={T.muted}>matrix</text>
              <text x={115} y={40} textAnchor="middle" fontSize={7} fill={C.micro} fontWeight={600}>Cu precipitate</text>
              <text x={165} y={40} fontSize={7} fill={T.muted}>matrix</text>
            </svg>
          </div>
        </div>

        <SliderRow label="Slice position (depth)" value={aptSlicePos} min={0} max={100} step={1} onChange={setAptSlicePos} color={C.accent} unit="%" format={v => v.toString()} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 8 }}>
          <ResultBox label="Fe at slice" value={`${aptSlicePos > 30 && aptSlicePos < 70 ? "60" : "90"} at%`} color={C.adv} sub="matrix" />
          <ResultBox label="Cu at slice" value={`${aptSlicePos > 30 && aptSlicePos < 70 ? (30 * Math.exp(-0.01 * (aptSlicePos - 50) * (aptSlicePos - 50)) + 5).toFixed(0) : "2"} at%`} color={C.micro} sub="precipitate" />
          <ResultBox label="C at slice" value={`${aptSlicePos > 45 && aptSlicePos < 55 ? (8 * Math.exp(-0.05 * (aptSlicePos - 50) * (aptSlicePos - 50)) + 1).toFixed(1) : "1.0"} at%`} color={C.accent} sub="segregation" />
        </div>

        <div style={{ background: C.adv + "08", border: `1px solid ${C.adv}22`, borderRadius: 8, padding: "10px 12px", marginTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.adv, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Key Insight</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            APT is the only technique that provides true 3D atomic-scale chemical information. It can detect individual atoms with near-equal sensitivity for all elements (unlike EDS or EELS). The Cu precipitate shown here is typical in reactor pressure vessel steels -- these nm-scale precipitates cause embrittlement, and APT is the only way to directly observe them.
          </div>
        </div>
      </Card>

      <Card title="Numerical Example: A Day in the APT Lab" color={C.adv} formula="APT of Cu precipitate in RPV steel">
        <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
          <strong>The Experiment:</strong> A nuclear reactor pressure vessel (RPV) steel is showing an increased ductile-to-brittle transition temperature (ΔDBTT = +40°C) after 20 years of neutron irradiation. The leading theory: nanoscale Cu-rich precipitates form under irradiation and block dislocation motion. But these precipitates are only 2-5 nm in diameter -- invisible to SEM, TEM, and even STEM-EDS. Atom probe tomography is the only technique that can detect and chemically analyze individual precipitates this small. You FIB-prepare a needle-shaped specimen from the irradiated surveillance capsule material.
        </div>

        <div style={{ background: C.adv + "06", border: `1px solid ${C.adv}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.adv, marginBottom: 6 }}>Think of it this way:</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            Imagine peeling an apple atom by atom. Each atom that comes off is identified (apple? peel? seed?) and its 3D position is recorded. After removing millions of atoms, you reassemble them on a computer and have a 3D atomic map of the entire apple. APT does this with a metal needle: an enormous electric field rips atoms off one at a time, a detector identifies each one, and software reconstructs a 3D atom-by-atom map of the material.
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 1 -- Prepare and Run the Atom Probe:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Specimen preparation" value="FIB annular milling to < 80 nm tip radius" />
          <InfoRow label="Instrument" value="LEAP 5000 XR (local electrode atom probe)" />
          <InfoRow label="Temperature" value="50 K (cryo to reduce fracture)" />
          <InfoRow label="Voltage range" value="5,000-12,000 V (increases as tip blunts)" />
          <InfoRow label="Laser pulse" value="355 nm UV, 200 pJ, 200 kHz" />
          <InfoRow label="Detection efficiency" value="~57% (some ions miss the detector)" />
          <InfoRow label="Total ions collected" value="~15 million" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 2 -- What the Mass Spectrum Shows:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Dominant peaks" value="Fe⁺ (55.845 Da), Fe²⁺ (27.923 Da)" />
          <InfoRow label="Alloying elements" value="Cu⁺ (63.546 Da), Mn⁺ (54.938 Da), Ni⁺ (58.693 Da)" />
          <InfoRow label="Light elements" value="C⁺ (12.000 Da), Si²⁺ (14.003 Da)" />
          <InfoRow label="Mass resolving power" value="M/ΔM ~ 1000 (FWHM)" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 3 -- 3D Reconstruction Reveals Precipitates:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Matrix composition" value="95.2 at% Fe, 0.3 at% Cu, 0.1 at% C" />
          <InfoRow label="Cu isoconcentration surface (10 at%)" value="Reveals ~12 precipitates in the volume" />
          <InfoRow label="Precipitate size (from isosurface)" value="Diameter = 3.2 nm (average)" />
          <InfoRow label="Precipitate shape" value="Roughly spherical" />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 4 -- Proxigram Analysis (Composition Across Interface):</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Precipitate core composition" result="82.3 at% Cu, 12.5 at% Fe" color={C.adv} />
          <CalcRow eq="Cu enrichment = precipitate/matrix = 82.3/0.3" result="274× enrichment" color={C.adv} />
          <CalcRow eq="Shell enrichment: Mn" result="2.1 at% (3× matrix level)" color={C.adv} />
          <CalcRow eq="Shell enrichment: Ni" result="1.8 at% (2.5× matrix level)" color={C.adv} />
          <CalcRow eq="Shell enrichment: Si" result="1.3 at% (2× matrix level)" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Step 5 -- Calculate Precipitate Properties:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
          <CalcRow eq="Precipitate volume = (4/3)πr³ = (4/3)π(1.6)³" result="17.2 nm³" color={C.adv} />
          <CalcRow eq="BCC iron atom density" result="84.3 atoms/nm³" color={C.adv} />
          <CalcRow eq="Atoms per precipitate ≈ 17.2 × 84.3" result="≈ 1,450 atoms" color={C.adv} />
          <CalcRow eq="Number density (12 in analyzed volume)" result="≈ 5 × 10²³ m⁻³" color={C.adv} />
          <CalcRow eq="Volume fraction = N × V" result="≈ 0.086% (close to total Cu content)" color={C.adv} />
        </div>

        <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>
          <strong style={{ color: T.ink }}>Full APT Results:</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <InfoRow label="Precipitate type" value="Cu-rich with Mn/Ni/Si-enriched shell" />
          <InfoRow label="Average diameter" value="3.2 nm (~1,450 atoms each)" />
          <InfoRow label="Number density" value="~5 × 10²³ m⁻³" />
          <InfoRow label="Cu enrichment" value="274× above matrix level" />
          <InfoRow label="Shell chemistry" value="Mn, Ni, Si enriched (Cottrell atmosphere)" />
          <InfoRow label="Precipitate-free zone width" value="~8 nm around grain boundaries" />
        </div>

        <div style={{ background: C.adv + "08", border: `1px solid ${C.adv}22`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.adv, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation -- What This Tells the Engineer</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>
            These 3.2 nm Cu-rich precipitates are the smoking gun for the +40°C DBTT shift. At a number density of 5 × 10²³ m⁻³, they create a dense forest of obstacles to dislocation motion. Using the Russell-Brown hardening model, this precipitate population would contribute ~100 MPa of hardening -- consistent with the measured increase in yield strength.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            The Mn/Ni/Si-enriched shell around the Cu core is a classic signature of late-stage irradiation-enhanced precipitation. The shell forms because these solutes are dragged to the precipitate interface by radiation-induced point defect fluxes. This core-shell structure is unique to irradiation -- thermal aging produces Cu precipitates WITHOUT the Mn/Ni/Si shell.
          </div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7, marginTop: 8 }}>
            <strong>Bottom line:</strong> APT provided the definitive evidence that cannot be obtained by any other technique: the 3D chemistry of individual 3 nm precipitates. These results will be used to update the reactor's remaining life prediction model and determine whether the vessel can safely continue operating or needs to be annealed to dissolve the precipitates.
          </div>
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
