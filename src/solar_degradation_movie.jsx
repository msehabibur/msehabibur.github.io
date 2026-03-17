import React, { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CdTe SOLAR CELL DEGRADATION — Interactive Module
// Light theme, inline styles, SVG visualizations, sliders & toggles
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  bg:      "#f0f2f5",
  panel:   "#ffffff",
  surface: "#f7f8fa",
  border:  "#d4d8e0",
  ink:     "#1a1e2e",
  muted:   "#6b7280",
  dim:     "#c0c6d0",
};

const C = {
  glass:   "#93c5fd",
  tco:     "#67e8f9",
  cds:     "#fde047",
  cdte:    "#a78bfa",
  buffer:  "#d97706",
  contact: "#9ca3af",
  cu:      "#f59e0b",
  defect:  "#ef4444",
  electron:"#3b82f6",
  hole:    "#f97316",
  moisture:"#06b6d4",
  crack:   "#dc2626",
  healthy: "#22c55e",
  degrad:  "#ef4444",
  accent:  "#7c3aed",
  mitigation: "#059669",
};

function Card({ children, style }) {
  return (
    <div style={{
      background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
      padding: "16px 18px", ...style,
    }}>{children}</div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit = "", format }) {
  const fmt = format || (v => v.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ fontSize: 11, color: T.ink, fontWeight: 600, minWidth: 110 }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ flex: 1, accentColor: color, height: 4 }} />
      <div style={{ fontSize: 11, color, fontWeight: 700, minWidth: 55, textAlign: "right" }}>
        {fmt(value)}{unit}
      </div>
    </div>
  );
}

function EqnBlock({ equations, color }) {
  return (
    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: (color || C.accent) + "08", border: `1px solid ${(color || C.accent)}22` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: color || C.accent, marginBottom: 6, letterSpacing: 1 }}>KEY EQUATIONS</div>
      {equations.map((eq, i) => (
        <div key={i} style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: T.ink, lineHeight: 1.8, paddingLeft: 8, borderLeft: `2px solid ${(color || C.accent)}44`, marginBottom: 4 }}>
          {eq}
        </div>
      ))}
    </div>
  );
}

// ── SECTION 1: HEALTHY DEVICE ──────────────────────────────────────────
function HealthyDeviceSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

  const W = 520, H = 340;
  const layers = [
    { y: 30,  h: 28, color: C.glass,   label: "Glass Superstrate", labelColor: "#1e40af" },
    { y: 62,  h: 22, color: C.tco,     label: "TCO (SnO₂:F)", labelColor: "#0e7490" },
    { y: 88,  h: 14, color: C.cds,     label: "CdS Window (~100 nm)", labelColor: "#92400e" },
    { y: 106, h: 80, color: C.cdte,    label: "CdTe Absorber (3–5 µm)", labelColor: "#5b21b6" },
    { y: 190, h: 18, color: C.buffer,  label: "Buffer / ZnTe", labelColor: "#92400e" },
    { y: 212, h: 28, color: C.contact, label: "Back Contact (Cu/Au)", labelColor: "#374151" },
  ];

  // Photon rays
  const photons = Array.from({ length: 6 }, (_, i) => {
    const x = 80 + i * 70;
    const phase = (tick * 2 + i * 30) % 120;
    const y = 0 + phase * 2.5;
    const opacity = phase < 100 ? 0.8 : 0.8 - (phase - 100) * 0.04;
    return { x, y: Math.min(y, 105), opacity: Math.max(0, opacity) };
  });

  // Electron-hole pairs in CdTe
  const pairs = Array.from({ length: 8 }, (_, i) => {
    const cx = 100 + i * 50;
    const phase = (tick * 1.5 + i * 40) % 160;
    const ey = 146 - (phase > 80 ? (phase - 80) * 1.2 : 0); // electron goes up
    const hy = 146 + (phase > 80 ? (phase - 80) * 0.8 : 0); // hole goes down
    const vis = phase > 40 ? Math.min(1, (phase - 40) / 30) : 0;
    return { cx, ey: Math.max(62, ey), hy: Math.min(230, hy), vis };
  });

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        In a healthy CdTe solar cell, sunlight enters through the glass superstrate, generates electron-hole pairs in the CdTe absorber
        (E<sub>g</sub> = 1.44 eV), and the built-in junction field separates carriers for current extraction.
      </div>

      <Card>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* Sun rays */}
          {photons.map((p, i) => (
            <g key={i} opacity={p.opacity}>
              <line x1={p.x} y1={0} x2={p.x} y2={p.y} stroke={C.cu} strokeWidth={2.5} strokeDasharray="6 4" />
              <circle cx={p.x} cy={p.y} r={4} fill={C.cu} />
              <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize={6} fill="#fff" fontWeight={700}>γ</text>
            </g>
          ))}

          {/* Device layers */}
          {layers.map((l, i) => (
            <g key={i}>
              <rect x={60} y={l.y} width={400} height={l.h} rx={4} fill={l.color} opacity={0.5} stroke={l.color} strokeWidth={1} />
              <text x={468} y={l.y + l.h / 2 + 4} fontSize={9} fill={l.labelColor} fontWeight={600}>{l.label}</text>
            </g>
          ))}

          {/* Junction label */}
          <line x1={60} y1={102} x2={460} y2={102} stroke={C.degrad} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5} />
          <text x={70} y={100} fontSize={8} fill={C.degrad} fontWeight={700}>p-n junction</text>

          {/* Electron-hole pairs */}
          {pairs.map((p, i) => p.vis > 0 && (
            <g key={i} opacity={p.vis}>
              <circle cx={p.cx} cy={p.ey} r={5} fill={C.electron} />
              <text x={p.cx} y={p.ey + 3} textAnchor="middle" fontSize={6} fill="#fff" fontWeight={700}>e⁻</text>
              <circle cx={p.cx} cy={p.hy} r={5} fill={C.hole} />
              <text x={p.cx} y={p.hy + 3} textAnchor="middle" fontSize={6} fill="#fff" fontWeight={700}>h⁺</text>
            </g>
          ))}

          {/* Labels */}
          <text x={W / 2} y={H - 20} textAnchor="middle" fontSize={10} fill={T.muted}>
            Photon absorption → e⁻/h⁺ generation → drift separation → current
          </text>

          {/* Band gap label */}
          <rect x={60} y={255} width={400} height={30} rx={6} fill={C.healthy + "15"} stroke={C.healthy} strokeWidth={1} />
          <text x={260} y={274} textAnchor="middle" fontSize={10} fill={C.healthy} fontWeight={700}>
            PCE ≈ 22% · Eg = 1.44 eV · α {">"} 10⁴ cm⁻¹ · Only ~3 µm needed
          </text>
        </svg>
      </Card>

      <EqnBlock equations={[
        "PCE = (Voc × Jsc × FF) / Pin",
        "Eg(CdTe) = 1.44 eV — near-ideal for single-junction",
        "α(CdTe) > 10⁴ cm⁻¹ — strong optical absorption",
        "Jsc,max ≈ 30.5 mA/cm² (Shockley-Queisser limit at 1.44 eV)",
      ]} color={C.healthy} />
    </div>
  );
}

// ── SECTION 2: Cu MIGRATION ────────────────────────────────────────────
function CuMigrationSection() {
  const [years, setYears] = useState(0);
  const [temp, setTemp] = useState(60);
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const W = 520, H = 300;
  const D0 = 3.7e-4; // cm²/s
  const Ea = 0.67; // eV
  const kB = 8.617e-5; // eV/K
  const Tk = temp + 273.15;
  const D = D0 * Math.exp(-Ea / (kB * Tk));
  const diffLength = Math.sqrt(D * years * 365.25 * 24 * 3600) * 1e4; // µm

  // Cu atoms migrating from back contact
  const nCu = Math.min(20, Math.floor(years * 3 + 2));
  const cuAtoms = Array.from({ length: nCu }, (_, i) => {
    const progress = Math.min(1, (years / 15) * (1 + 0.3 * Math.sin(i * 1.7)));
    const x = 100 + (i % 5) * 80 + Math.sin(tick * 0.03 + i) * 5;
    const yStart = 220;
    const yEnd = 100 + (i % 4) * 20;
    const y = yStart - progress * (yStart - yEnd);
    return { x, y, opacity: Math.min(1, years * 0.5 + 0.2) };
  });

  const vocLoss = Math.min(0.25, years * 0.01 * (1 + (temp - 25) * 0.02));

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        Prolonged illumination activates <strong>Cu migration</strong> from the back contact into the CdTe absorber.
        Cu⁺ ions drift under the built-in field, creating donor-acceptor recombination centers and metastable defect complexes.
      </div>

      <SliderRow label="Operating years" value={years} min={0} max={25} step={1} onChange={setYears} color={C.cu} unit=" yr" />
      <SliderRow label="Temperature" value={temp} min={25} max={100} step={5} onChange={setTemp} color={C.degrad} unit="°C" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* CdTe absorber */}
          <rect x={50} y={60} width={420} height={130} rx={6} fill={C.cdte} opacity={0.3} stroke={C.cdte} strokeWidth={1} />
          <text x={60} y={78} fontSize={10} fill="#5b21b6" fontWeight={700}>CdTe Absorber</text>

          {/* Back contact */}
          <rect x={50} y={200} width={420} height={40} rx={6} fill={C.contact} opacity={0.4} stroke={C.contact} strokeWidth={1} />
          <text x={60} y={224} fontSize={10} fill="#374151" fontWeight={700}>Back Contact (Cu/Au)</text>

          {/* Cu atoms migrating */}
          {cuAtoms.map((a, i) => (
            <g key={i} opacity={a.opacity}>
              <circle cx={a.x} cy={a.y} r={7} fill={C.cu} stroke="#b45309" strokeWidth={1} />
              <text x={a.x} y={a.y + 3.5} textAnchor="middle" fontSize={7} fill="#fff" fontWeight={800}>Cu</text>
            </g>
          ))}

          {/* Arrows showing drift direction */}
          {years > 0 && (
            <g opacity={0.6}>
              <defs><marker id="arrowCu" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.cu} /></marker></defs>
              {[150, 260, 370].map(x => (
                <line key={x} x1={x} y1={195} x2={x} y2={110} stroke={C.cu} strokeWidth={1.5} markerEnd="url(#arrowCu)" strokeDasharray="4 3" />
              ))}
              <text x={260} y={160} textAnchor="middle" fontSize={9} fill={C.cu} fontWeight={600}>Cu⁺ drift under E-field</text>
            </g>
          )}

          {/* Metrics */}
          <rect x={50} y={255} width={200} height={30} rx={6} fill={C.cu + "15"} stroke={C.cu} strokeWidth={1} />
          <text x={150} y={274} textAnchor="middle" fontSize={10} fill={C.cu} fontWeight={600}>
            D(Cu) = {D.toExponential(1)} cm²/s
          </text>

          <rect x={270} y={255} width={200} height={30} rx={6} fill={C.degrad + "15"} stroke={C.degrad} strokeWidth={1} />
          <text x={370} y={274} textAnchor="middle" fontSize={10} fill={C.degrad} fontWeight={600}>
            Voc loss ≈ {(vocLoss * 1000).toFixed(0)} mV
          </text>
        </svg>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <Card style={{ padding: "10px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cu, marginBottom: 4 }}>Cu Diffusion Length</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>{diffLength.toFixed(2)} µm</div>
          <div style={{ fontSize: 10, color: T.muted }}>{diffLength > 3 ? "Exceeds absorber thickness!" : "Within absorber"}</div>
        </Card>
        <Card style={{ padding: "10px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.degrad, marginBottom: 4 }}>Degradation Mechanism</div>
          <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>
            Cu⁺ creates donor levels → compensates p-type doping → kills Voc
          </div>
        </Card>
      </div>

      <EqnBlock equations={[
        "D(Cu) = D₀·exp(−Ea/kT),  D₀ = 3.7×10⁻⁴ cm²/s,  Ea = 0.67 eV",
        "Diffusion length: L = √(D·t)",
        "Cu⁺ interstitial → fast donor → compensates VCd acceptors",
        "ΔVoc ≈ (nkT/q)·ln(J₀,new / J₀,initial)",
      ]} color={C.cu} />
    </div>
  );
}

// ── SECTION 3: THERMAL STRESS ──────────────────────────────────────────
function ThermalStressSection() {
  const [temp, setTemp] = useState(60);
  const [years, setYears] = useState(10);

  const Tk = temp + 273.15;
  const kB = 8.617e-5;
  // Interdiffusion at CdS/CdTe interface
  const Dinter = 1e-14 * Math.exp(-0.9 / (kB * Tk)); // approximate
  const interLength = Math.sqrt(Dinter * years * 365.25 * 24 * 3600) * 1e7; // nm
  // Thermal stress
  const dalpha = 2.5e-6; // CTE mismatch /K
  const stress = (70e9 * dalpha * (temp - 25)) / 1e6; // MPa approximate

  // Grain boundary diffusion enhancement
  const gbEnhance = 100;

  const W = 480, H = 200;
  const barMax = 120;
  const tempBarWidth = Math.min(barMax, ((temp - 25) / 75) * barMax);

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        Elevated temperatures accelerate <strong>interdiffusion</strong> at the CdS/CdTe interface, Cu migration through the absorber,
        and Te out-diffusion. Grain boundary diffusion is ~100× faster than bulk.
      </div>

      <SliderRow label="Temperature" value={temp} min={25} max={100} step={5} onChange={setTemp} color={C.degrad} unit="°C" />
      <SliderRow label="Years" value={years} min={1} max={30} step={1} onChange={setYears} color={C.cu} unit=" yr" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* Temperature bar */}
          <text x={20} y={30} fontSize={10} fill={T.ink} fontWeight={700}>Temperature Effects at {temp}°C</text>

          {/* CdS/CdTe interface mixing */}
          <rect x={20} y={50} width={200} height={50} rx={6} fill={C.cds} opacity={0.3} />
          <rect x={220} y={50} width={220} height={50} rx={6} fill={C.cdte} opacity={0.3} />
          {/* Mixing zone */}
          {(() => {
            const mixW = Math.min(100, interLength * 2);
            return <rect x={220 - mixW / 2} y={50} width={mixW} height={50} rx={4} fill="#f59e0b" opacity={0.3} />;
          })()}
          <text x={220} y={70} textAnchor="middle" fontSize={9} fill={C.cu} fontWeight={600}>CdS₁₋ₓTeₓ mixing zone</text>
          <text x={120} y={90} textAnchor="middle" fontSize={9} fill="#92400e">CdS</text>
          <text x={340} y={90} textAnchor="middle" fontSize={9} fill="#5b21b6">CdTe</text>

          {/* Stress bar */}
          <text x={20} y={125} fontSize={9} fill={T.ink} fontWeight={600}>Thermal Stress</text>
          <rect x={120} y={115} width={barMax} height={14} rx={4} fill={T.border} />
          <rect x={120} y={115} width={tempBarWidth} height={14} rx={4} fill={stress > 50 ? C.degrad : C.cu} />
          <text x={250} y={126} fontSize={9} fill={T.ink}>{stress.toFixed(1)} MPa</text>

          {/* GB diffusion */}
          <text x={20} y={155} fontSize={9} fill={T.ink} fontWeight={600}>GB vs Bulk Diffusion</text>
          <rect x={120} y={145} width={barMax} height={14} rx={4} fill={C.electron + "33"} />
          <rect x={120} y={145} width={Math.min(barMax, barMax * 0.01)} height={14} rx={4} fill={C.electron} />
          <text x={250} y={156} fontSize={9} fill={C.electron}>Bulk</text>

          <rect x={120} y={165} width={barMax} height={14} rx={4} fill={C.degrad + "33"} />
          <rect x={120} y={165} width={barMax} height={14} rx={4} fill={C.degrad} opacity={0.6} />
          <text x={250} y={176} fontSize={9} fill={C.degrad}>GB (100× faster)</text>
        </svg>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        <Card style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.cu, marginBottom: 3 }}>Intermixing</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{interLength.toFixed(1)} nm</div>
        </Card>
        <Card style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.degrad, marginBottom: 3 }}>Thermal Stress</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{stress.toFixed(0)} MPa</div>
        </Card>
        <Card style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 3 }}>Rs Increase</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{(years * temp * 0.001).toFixed(1)} Ω·cm²</div>
        </Card>
      </div>

      <EqnBlock equations={[
        "D_inter = D₀·exp(−Ea/kT),  Ea ≈ 0.9 eV for CdS-CdTe",
        "σ_thermal = E × Δα × ΔT  (biaxial thermal stress)",
        "D_GB ≈ 100 × D_bulk  (grain boundary fast path)",
        "CdS₁₋ₓTeₓ intermixing changes local bandgap profile",
      ]} color={C.degrad} />
    </div>
  );
}

// ── SECTION 4: MOISTURE & OXIDATION ────────────────────────────────────
function MoistureSection() {
  const [humidity, setHumidity] = useState(50);
  const [showReactions, setShowReactions] = useState(true);
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 100); return () => clearInterval(id); }, []);

  const W = 520, H = 260;
  const nDrops = Math.floor(humidity / 10);

  const reactions = [
    { reactants: "CdTe + H₂O", products: "CdO + TeO₂ + H₂↑", color: C.moisture, desc: "Surface oxidation destroys absorber" },
    { reactants: "Cu + O₂ + H₂O", products: "Cu(OH)₂ / CuOₓ", color: C.cu, desc: "Back contact corrosion" },
    { reactants: "TeO₂ layer", products: "Insulating barrier", color: C.degrad, desc: "Increases series resistance" },
    { reactants: "H₂O at grain boundaries", products: "Shunt paths", color: C.crack, desc: "Leakage current → hot spots" },
  ];

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        Moisture penetrates through the back contact or edge seals, <strong>oxidizing the Te-rich surface</strong>,
        corroding metal contacts, and creating shunt paths through the absorber.
      </div>

      <SliderRow label="Relative Humidity" value={humidity} min={10} max={95} step={5} onChange={setHumidity} color={C.moisture} unit="%" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* Device cross-section */}
          <rect x={50} y={40} width={420} height={60} rx={4} fill={C.cdte} opacity={0.3} stroke={C.cdte} strokeWidth={1} />
          <text x={260} y={65} textAnchor="middle" fontSize={10} fill="#5b21b6" fontWeight={600}>CdTe Absorber</text>
          <rect x={50} y={104} width={420} height={30} rx={4} fill={C.contact} opacity={0.3} stroke={C.contact} strokeWidth={1} />
          <text x={260} y={123} textAnchor="middle" fontSize={10} fill="#374151" fontWeight={600}>Back Contact</text>

          {/* Water droplets falling */}
          {Array.from({ length: nDrops }, (_, i) => {
            const x = 80 + i * 40;
            const phase = (tick * 3 + i * 25) % 200;
            const y = 140 + phase * 0.5;
            return (
              <g key={i} opacity={phase < 160 ? 0.7 : 0.7 - (phase - 160) * 0.02}>
                <ellipse cx={x} cy={Math.min(y, 230)} rx={4} ry={6} fill={C.moisture} opacity={0.6} />
                <text x={x} y={Math.min(y, 230) + 3} textAnchor="middle" fontSize={5} fill="#fff" fontWeight={700}>H₂O</text>
              </g>
            );
          })}

          {/* Corrosion spots */}
          {humidity > 40 && Array.from({ length: Math.floor((humidity - 40) / 10) }, (_, i) => (
            <circle key={i} cx={100 + i * 80} cy={104} r={8 + Math.sin(tick * 0.05 + i) * 2}
              fill={C.degrad} opacity={0.3} />
          ))}

          {/* Shunt paths */}
          {humidity > 60 && (
            <g opacity={0.5}>
              {[180, 340].map(x => (
                <line key={x} x1={x} y1={40} x2={x + 10} y2={134} stroke={C.crack} strokeWidth={2} strokeDasharray="3 2" />
              ))}
              <text x={260} y={85} textAnchor="middle" fontSize={8} fill={C.crack} fontWeight={600}>Shunt paths along GBs</text>
            </g>
          )}

          {/* WVTR target */}
          <rect x={50} y={H - 35} width={420} height={24} rx={6} fill={humidity > 70 ? C.degrad + "15" : C.healthy + "15"} stroke={humidity > 70 ? C.degrad : C.healthy} strokeWidth={1} />
          <text x={260} y={H - 18} textAnchor="middle" fontSize={9} fill={humidity > 70 ? C.degrad : C.healthy} fontWeight={600}>
            WVTR target: {"<"} 10⁻⁴ g/m²/day for 25-year life | RH = {humidity}%
          </text>
        </svg>
      </Card>

      {/* Reaction cards */}
      <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, marginTop: 14, marginBottom: 8 }}>CHEMICAL REACTIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {reactions.map((r, i) => (
          <Card key={i} style={{ padding: "10px 12px", borderLeft: `3px solid ${r.color}` }}>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: r.color, fontWeight: 700, marginBottom: 4 }}>
              {r.reactants} → {r.products}
            </div>
            <div style={{ fontSize: 10, color: T.muted }}>{r.desc}</div>
          </Card>
        ))}
      </div>

      <EqnBlock equations={[
        "CdTe + H₂O → CdO + TeO₂ + H₂↑",
        "Jshunt = V / Rsh — shunt current increases as Rsh drops",
        "WVTR < 10⁻⁴ g/m²/day required for 25-year lifetime",
      ]} color={C.moisture} />
    </div>
  );
}

// ── SECTION 5: DEFECT EVOLUTION ────────────────────────────────────────
function DefectEvolutionSection() {
  const [Ef, setEf] = useState(0.5);
  const [years, setYears] = useState(0);

  const Eg = 1.44;
  const W = 500, H = 240;
  const pad = { l: 55, r: 20, t: 20, b: 35 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const defects = [
    { label: "VCd²⁻", E0: 2.1, q: -2, color: "#7c3aed", type: "acceptor", desc: "Dominant p-type dopant" },
    { label: "VCd⁻", E0: 1.8, q: -1, color: "#8b5cf6", type: "acceptor", desc: "Shallow acceptor" },
    { label: "TeCd²⁺", E0: 1.4, q: 2, color: "#dc2626", type: "deep", desc: "Deep trap at Ev+0.6 eV" },
    { label: "Cui⁺", E0: 0.8, q: 1, color: C.cu, type: "donor", desc: "Fast-diffusing donor (harmful)" },
    { label: "CuCd⁰", E0: 1.0, q: 0, color: "#059669", type: "shallow", desc: "Shallow acceptor (beneficial)" },
    { label: "ClTe⁺", E0: 1.5, q: 1, color: "#0284c7", type: "donor", desc: "Shallow donor from CdCl₂ treatment" },
  ];

  const toX = ef => pad.l + (ef / Eg) * pw;
  const toY = e => pad.t + (1 - e / 3.5) * ph;

  // Aging shifts some defect formation energies
  const ageFactor = years / 25;

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        CdTe's native defect landscape evolves under operation. <strong>V<sub>Cd</sub></strong> is the dominant p-type dopant but also a recombination center.
        Cu interstitials are fast-diffusing donors that compensate p-type doping over time.
      </div>

      <SliderRow label="Fermi Level" value={Ef} min={0} max={Eg} step={0.02} onChange={setEf} color={C.accent} unit=" eV" />
      <SliderRow label="Operating Years" value={years} min={0} max={25} step={1} onChange={setYears} color={C.cu} unit=" yr" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* Axes */}
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={T.border} strokeWidth={1} />
          <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={T.border} strokeWidth={1} />
          <text x={pad.l - 10} y={pad.t + ph / 2} textAnchor="middle" fontSize={9} fill={T.muted} transform={`rotate(-90, ${pad.l - 10}, ${pad.t + ph / 2})`}>ΔEf (eV)</text>
          <text x={pad.l + pw / 2} y={H - 8} textAnchor="middle" fontSize={9} fill={T.muted}>Fermi Level (eV)</text>

          {/* VBM and CBM labels */}
          <text x={pad.l - 5} y={H - pad.b + 12} fontSize={8} fill={T.muted} textAnchor="end">VBM</text>
          <text x={W - pad.r + 5} y={H - pad.b + 12} fontSize={8} fill={T.muted}>CBM</text>

          {/* Defect lines */}
          {defects.map((d, i) => {
            const ageShift = d.type === "donor" ? -ageFactor * 0.3 : ageFactor * 0.1;
            const y0 = toY(d.E0 + ageShift);
            const y1 = toY(d.E0 + ageShift + d.q * Eg);
            return (
              <g key={i}>
                <line x1={toX(0)} y1={y0} x2={toX(Eg)} y2={y1} stroke={d.color} strokeWidth={2} opacity={0.7} />
                <text x={toX(Eg) + 3} y={y1 + 3} fontSize={8} fill={d.color} fontWeight={700}>{d.label}</text>
              </g>
            );
          })}

          {/* Fermi level marker */}
          <line x1={toX(Ef)} y1={pad.t} x2={toX(Ef)} y2={H - pad.b} stroke={C.accent} strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={toX(Ef)} y={pad.t - 5} textAnchor="middle" fontSize={9} fill={C.accent} fontWeight={700}>EF = {Ef.toFixed(2)} eV</text>
        </svg>
      </Card>

      {/* Defect legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
        {defects.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, background: d.color + "0a", border: `1px solid ${d.color}22` }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: d.color }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: d.color }}>{d.label}</div>
              <div style={{ fontSize: 9, color: T.muted }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <EqnBlock equations={[
        "Ef(q) = Ef⁰ + q·(εF + ΔV) + Δµ",
        "τ = 1 / (σ·vth·Nt) — carrier lifetime vs trap density",
        "SRH: R = σ·vth·Nt·(np − ni²) / (n + p + 2ni·cosh(ΔE/kT))",
      ]} color={C.accent} />
    </div>
  );
}

// ── SECTION 6: J-V CURVE DEGRADATION ───────────────────────────────────
function JVDegradationSection() {
  const [years, setYears] = useState(0);
  const [showIdeal, setShowIdeal] = useState(true);

  const W = 480, H = 280;
  const pad = { l: 55, r: 20, t: 20, b: 40 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  // Solar cell parameters degrade over time
  const rate = 0.006; // 0.6%/year
  const factor = Math.pow(1 - rate, years);
  const J0_ratio = Math.exp(years * 0.08);
  const Jsc0 = 30.5, Voc0 = 0.88, n = 1.5, Rs0 = 1.0, Rsh0 = 1000;
  const Jsc = Jsc0 * (1 - years * 0.002);
  const Voc = Voc0 - 0.026 * n * Math.log(J0_ratio);
  const Rs = Rs0 * (1 + years * 0.05);
  const Rsh = Rsh0 / (1 + years * 0.03);

  // J-V curve points
  const jvPoints = (jsc, voc, rs, rsh, isIdeal) => {
    const pts = [];
    for (let v = 0; v <= voc * 1.05; v += 0.01) {
      const jph = jsc;
      const j0 = jsc / (Math.exp(voc / (0.026 * n)) - 1);
      // Simplified single-diode: solve iteratively
      let j = jph;
      for (let iter = 0; iter < 5; iter++) {
        const vd = v + j * rs * 0.001; // rs in Ω·cm²
        j = jph - j0 * (Math.exp(vd / (0.026 * n)) - 1) - vd / rsh;
      }
      if (j < -2) break;
      pts.push({ v, j: Math.max(-1, j) });
    }
    return pts;
  };

  const idealPts = jvPoints(Jsc0, Voc0, Rs0, Rsh0, true);
  const degradPts = jvPoints(Jsc, Math.max(0.4, Voc), Rs, Rsh, false);

  const toX = v => pad.l + (v / 1.0) * pw;
  const toY = j => pad.t + (1 - j / 35) * ph;

  const ptsToPath = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.v).toFixed(1)},${toY(p.j).toFixed(1)}`).join(' ');

  // Calculate FF and PCE
  const calcPmax = (pts) => {
    let pmax = 0;
    pts.forEach(p => { const pw = p.v * p.j; if (pw > pmax) pmax = pw; });
    return pmax;
  };
  const pce0 = (calcPmax(idealPts) / 100 * 100).toFixed(1);
  const pceNow = (calcPmax(degradPts) / 100 * 100).toFixed(1);
  const ff0 = (calcPmax(idealPts) / (Jsc0 * Voc0) * 100).toFixed(1);
  const ffNow = degradPts.length > 0 ? (calcPmax(degradPts) / (Jsc * Math.max(0.4, Voc)) * 100).toFixed(1) : "0";

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        All degradation pathways compound: Cu migration lowers V<sub>oc</sub>, moisture reduces R<sub>sh</sub>,
        thermal stress increases R<sub>s</sub>, and defects kill carrier lifetime. Watch the <strong>J-V curve degrade</strong> over time.
      </div>

      <SliderRow label="Operating Years" value={years} min={0} max={25} step={1} onChange={setYears} color={C.degrad} unit=" yr" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* Grid */}
          {[0, 10, 20, 30].map(j => (
            <g key={j}>
              <line x1={pad.l} y1={toY(j)} x2={W - pad.r} y2={toY(j)} stroke={T.border} strokeWidth={0.5} />
              <text x={pad.l - 8} y={toY(j) + 3} textAnchor="end" fontSize={8} fill={T.muted}>{j}</text>
            </g>
          ))}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(v => (
            <g key={v}>
              <line x1={toX(v)} y1={pad.t} x2={toX(v)} y2={H - pad.b} stroke={T.border} strokeWidth={0.5} />
              <text x={toX(v)} y={H - pad.b + 14} textAnchor="middle" fontSize={8} fill={T.muted}>{v.toFixed(1)}</text>
            </g>
          ))}

          {/* Axes labels */}
          <text x={pad.l - 10} y={pad.t + ph / 2} textAnchor="middle" fontSize={9} fill={T.ink} fontWeight={600} transform={`rotate(-90, ${pad.l - 10}, ${pad.t + ph / 2})`}>J (mA/cm²)</text>
          <text x={pad.l + pw / 2} y={H - 8} textAnchor="middle" fontSize={9} fill={T.ink} fontWeight={600}>Voltage (V)</text>

          {/* Ideal J-V (year 0) */}
          {showIdeal && idealPts.length > 1 && (
            <path d={ptsToPath(idealPts)} fill="none" stroke={C.healthy} strokeWidth={2.5} strokeDasharray="6 4" opacity={0.6} />
          )}

          {/* Degraded J-V */}
          {degradPts.length > 1 && (
            <path d={ptsToPath(degradPts)} fill="none" stroke={years > 0 ? C.degrad : C.healthy} strokeWidth={2.5} />
          )}

          {/* Legend */}
          {showIdeal && (
            <g>
              <line x1={W - 160} y1={30} x2={W - 140} y2={30} stroke={C.healthy} strokeWidth={2} strokeDasharray="4 3" />
              <text x={W - 135} y={33} fontSize={9} fill={C.healthy}>Year 0</text>
            </g>
          )}
          <line x1={W - 160} y1={45} x2={W - 140} y2={45} stroke={years > 0 ? C.degrad : C.healthy} strokeWidth={2} />
          <text x={W - 135} y={48} fontSize={9} fill={years > 0 ? C.degrad : C.healthy}>Year {years}</text>
        </svg>
      </Card>

      <div style={{ display: "flex", gap: 4, marginTop: 6, marginBottom: 6 }}>
        <button onClick={() => setShowIdeal(!showIdeal)} style={{
          padding: "4px 12px", borderRadius: 6, fontSize: 10, cursor: "pointer",
          background: showIdeal ? C.healthy + "22" : T.bg, border: `1px solid ${showIdeal ? C.healthy : T.border}`,
          color: showIdeal ? C.healthy : T.muted, fontWeight: 600, fontFamily: "inherit",
        }}>Show Year 0 Reference</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
        {[
          { label: "Jsc", val: `${Jsc.toFixed(1)}`, unit: "mA/cm²", color: C.electron, init: Jsc0.toFixed(1) },
          { label: "Voc", val: `${Math.max(0.4, Voc).toFixed(3)}`, unit: "V", color: C.accent, init: Voc0.toFixed(3) },
          { label: "FF", val: `${ffNow}`, unit: "%", color: C.cu, init: ff0 },
          { label: "PCE", val: `${pceNow}`, unit: "%", color: years > 10 ? C.degrad : C.healthy, init: pce0 },
        ].map((m, i) => (
          <Card key={i} style={{ padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: m.color }}>{m.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{m.val}</div>
            <div style={{ fontSize: 9, color: T.muted }}>{m.unit} (was {m.init})</div>
          </Card>
        ))}
      </div>

      <EqnBlock equations={[
        "J = Jph − J₀[exp(q(V+J·Rs)/nkT) − 1] − (V+J·Rs)/Rsh",
        "PCE(t) = PCE₀ × (1 − r)ᵗ,  r ≈ 0.5–0.8%/year",
        "FF = (Vmp·Jmp) / (Voc·Jsc)",
        "Annual degradation: First Solar warranty ≤0.5%/year for 25 yr",
      ]} color={C.degrad} />
    </div>
  );
}

// ── SECTION 7: MECHANICAL DAMAGE ───────────────────────────────────────
function MechanicalSection() {
  const [stress, setStress] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const W = 500, H = 240;
  const Kic = 0.5; // MPa√m
  const crackLength = stress > 20 ? (stress - 20) * 0.15 : 0;

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        CdTe is brittle (fracture toughness K<sub>IC</sub> ≈ 0.5 MPa√m). Thermal cycling, hail impact, and mounting stress can
        <strong> crack the absorber</strong> and delaminate the back contact, creating electrically dead zones.
      </div>

      <SliderRow label="Applied Stress" value={stress} min={0} max={80} step={2} onChange={setStress} color={C.crack} unit=" MPa" />

      <Card style={{ marginTop: 8 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", borderRadius: 8 }}>
          <rect width={W} height={H} fill={T.surface} rx={8} />

          {/* CdTe absorber */}
          <rect x={40} y={50} width={420} height={120} rx={6} fill={C.cdte} opacity={0.3} stroke={C.cdte} strokeWidth={1} />
          <text x={50} y={68} fontSize={10} fill="#5b21b6" fontWeight={700}>CdTe Absorber</text>

          {/* Grain boundaries */}
          {[120, 200, 280, 360].map(x => (
            <line key={x} x1={x} y1={52} x2={x + 5} y2={168} stroke={C.cdte} strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
          ))}

          {/* Cracks appear under stress */}
          {stress > 20 && (
            <g>
              <line x1={180} y1={50} x2={185 + crackLength * 2} y2={50 + crackLength * 8}
                stroke={C.crack} strokeWidth={2.5} opacity={Math.min(1, (stress - 20) / 30)} />
              <line x1={320} y1={170} x2={315 - crackLength * 1.5} y2={170 - crackLength * 7}
                stroke={C.crack} strokeWidth={2.5} opacity={Math.min(1, (stress - 20) / 30)} />
            </g>
          )}

          {/* Hot spot at crack */}
          {stress > 40 && (
            <g>
              <circle cx={185 + crackLength * 2} cy={50 + crackLength * 8} r={10 + Math.sin(tick * 0.1) * 3}
                fill={C.degrad} opacity={0.3} />
              <text x={185 + crackLength * 2 + 15} y={50 + crackLength * 8 + 3} fontSize={8} fill={C.degrad} fontWeight={600}>Hot spot</text>
            </g>
          )}

          {/* Delamination at high stress */}
          {stress > 50 && (
            <g opacity={0.6}>
              <rect x={100} y={168} width={150} height={6} rx={3} fill={C.cu} opacity={0.5} />
              <text x={175} y={190} textAnchor="middle" fontSize={8} fill={C.cu} fontWeight={600}>Delamination gap</text>
            </g>
          )}

          {/* Stress intensity factor */}
          <rect x={40} y={H - 35} width={420} height={24} rx={6}
            fill={stress > 30 ? C.degrad + "15" : C.healthy + "15"}
            stroke={stress > 30 ? C.degrad : C.healthy} strokeWidth={1} />
          <text x={250} y={H - 18} textAnchor="middle" fontSize={9}
            fill={stress > 30 ? C.degrad : C.healthy} fontWeight={600}>
            KI = σ√(πa) = {(stress * Math.sqrt(Math.PI * crackLength * 1e-6) * 1e3).toFixed(2)} MPa√m
            {stress > 30 ? " — approaching KIC = 0.5 MPa√m!" : " — below KIC"}
          </text>
        </svg>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        {[
          { label: "Fracture Toughness", val: "0.5 MPa√m", desc: "CdTe is brittle", color: C.crack },
          { label: "Crack Length", val: `${crackLength.toFixed(1)} µm`, desc: stress > 20 ? "Growing!" : "No cracks", color: stress > 20 ? C.degrad : C.healthy },
          { label: "Area Loss", val: `${Math.min(30, crackLength * 2).toFixed(0)}%`, desc: "Electrically dead zones", color: C.accent },
        ].map((m, i) => (
          <Card key={i} style={{ padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: m.color, marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{m.val}</div>
            <div style={{ fontSize: 9, color: T.muted }}>{m.desc}</div>
          </Card>
        ))}
      </div>

      <EqnBlock equations={[
        "KI = σ√(πa) — stress intensity factor",
        "Fracture when KI ≥ KIC ≈ 0.5 MPa√m (CdTe)",
        "Jsc ∝ A_active — active area loss reduces current",
        "P_hot = I²·Rs(local) — current crowding at cracks",
      ]} color={C.crack} />
    </div>
  );
}

// ── SECTION 8: MITIGATION STRATEGIES ───────────────────────────────────
function MitigationSection() {
  const [cuFree, setCuFree] = useState(false);
  const [seAlloy, setSeAlloy] = useState(false);
  const [groupV, setGroupV] = useState(false);
  const [glassGlass, setGlassGlass] = useState(false);
  const [mgzno, setMgzno] = useState(false);

  const toggleBtn = (label, value, setter, color, desc) => (
    <button onClick={() => setter(!value)} style={{
      padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
      background: value ? color + "15" : T.bg, border: `1.5px solid ${value ? color : T.border}`,
      fontFamily: "inherit", transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, background: value ? color : T.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800 }}>
          {value ? "✓" : ""}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: value ? color : T.ink }}>{label}</div>
          <div style={{ fontSize: 10, color: T.muted }}>{desc}</div>
        </div>
      </div>
    </button>
  );

  const score = [cuFree, seAlloy, groupV, glassGlass, mgzno].filter(Boolean).length;
  const degradRate = Math.max(0.1, 0.8 - score * 0.13);
  const lifetime = Math.round(25 + score * 5);

  return (
    <div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 14, lineHeight: 1.7 }}>
        Modern CdTe technology has solved most historical stability issues. Toggle each mitigation strategy
        to see its impact on device lifetime and degradation rate.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {toggleBtn("Cu-Free Back Contact", cuFree, setCuFree, C.mitigation, "ZnTe or MoOₓ replaces Cu/Au")}
        {toggleBtn("CdSeTe Graded Absorber", seAlloy, setSeAlloy, "#2563eb", "Lower Voc deficit, better stability")}
        {toggleBtn("Group V Doping (As/P)", groupV, setGroupV, C.accent, "Stable p-type without Cu")}
        {toggleBtn("Glass-Glass Encapsulation", glassGlass, setGlassGlass, C.moisture, "Superior moisture barrier")}
        {toggleBtn("MgZnO Window Layer", mgzno, setMgzno, C.cu, "Replaces CdS — wider gap, no intermixing")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Card style={{ padding: "12px 14px", textAlign: "center", borderColor: score >= 3 ? C.mitigation : T.border }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.mitigation, marginBottom: 4 }}>Degradation Rate</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: degradRate < 0.3 ? C.mitigation : degradRate < 0.5 ? C.cu : C.degrad }}>
            {degradRate.toFixed(2)}%/yr
          </div>
          <div style={{ fontSize: 9, color: T.muted }}>Industry target: {"<"}0.3%/yr</div>
        </Card>
        <Card style={{ padding: "12px 14px", textAlign: "center", borderColor: score >= 3 ? C.mitigation : T.border }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginBottom: 4 }}>Expected Lifetime</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>{lifetime} yr</div>
          <div style={{ fontSize: 9, color: T.muted }}>With {score}/5 strategies</div>
        </Card>
        <Card style={{ padding: "12px 14px", textAlign: "center", borderColor: score >= 3 ? C.mitigation : T.border }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.electron, marginBottom: 4 }}>Total Power Loss</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.ink }}>
            {(degradRate * lifetime).toFixed(0)}%
          </div>
          <div style={{ fontSize: 9, color: T.muted }}>Over {lifetime}-year life</div>
        </Card>
      </div>

      <EqnBlock equations={[
        "CdSe₁₋ₓTeₓ: Eg = 1.44 − 0.74x + 0.28x² eV (bowing)",
        "Target: d(PCE)/dt < 0.3%/year for 30+ year life",
        "WVTR < 10⁻⁴ g/m²/day with glass-glass design",
        "First Solar Series 7: 0.2%/year demonstrated",
      ]} color={C.mitigation} />
    </div>
  );
}

// ── SECTION DEFINITIONS ────────────────────────────────────────────────
const DEGRAD_SECTIONS = [
  { id: "healthy",     label: "Healthy Device",        color: C.healthy,    Component: HealthyDeviceSection },
  { id: "cu",          label: "Cu Migration",           color: C.cu,         Component: CuMigrationSection },
  { id: "thermal",     label: "Thermal Stress",         color: C.degrad,     Component: ThermalStressSection },
  { id: "moisture",    label: "Moisture & Oxidation",   color: C.moisture,   Component: MoistureSection },
  { id: "defects",     label: "Defect Evolution",       color: C.accent,     Component: DefectEvolutionSection },
  { id: "jv",          label: "J-V Degradation",        color: C.degrad,     Component: JVDegradationSection },
  { id: "mechanical",  label: "Mechanical Damage",      color: C.crack,      Component: MechanicalSection },
  { id: "mitigation",  label: "Mitigation Strategies",  color: C.mitigation, Component: MitigationSection },
];

// ── MAIN EXPORT ────────────────────────────────────────────────────────
export default function SolarCellDegradationMovie() {
  const [active, setActive] = useState("healthy");
  const sec = DEGRAD_SECTIONS.find(s => s.id === active) || DEGRAD_SECTIONS[0];
  const { Component } = sec;
  const secIdx = DEGRAD_SECTIONS.findIndex(s => s.id === active);

  return (
    <div style={{
      maxWidth: 700,
      margin: "0 auto",
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.degrad, fontWeight: 700, textTransform: "uppercase" }}>
          INTERACTIVE MODULE
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>
          CdTe Solar Cell Degradation
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
          Explore how CdTe thin-film cells age under light, heat, moisture, defect migration, and mechanical stress.
        </div>
      </div>

      {/* Section tabs */}
      <div style={{
        display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16,
        padding: "8px 0", borderBottom: `1px solid ${T.border}`,
      }}>
        {DEGRAD_SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 11,
            border: `1px solid ${active === s.id ? s.color : T.border}`,
            background: active === s.id ? s.color + "18" : T.bg,
            color: active === s.id ? s.color : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 9, color: active === s.id ? s.color : T.dim }}>{i + 1}.</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: sec.color }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: sec.color, letterSpacing: 0.5 }}>{sec.label}</div>
        </div>
        <Component />
      </div>

      {/* Bottom nav */}
      <div style={{
        marginTop: 20, paddingTop: 12, borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <button onClick={() => { if (secIdx > 0) setActive(DEGRAD_SECTIONS[secIdx - 1].id); }}
          disabled={secIdx === 0} style={{
          padding: "6px 16px", borderRadius: 8, fontSize: 12,
          background: secIdx === 0 ? T.surface : sec.color + "18",
          border: `1px solid ${secIdx === 0 ? T.border : sec.color}`,
          color: secIdx === 0 ? T.muted : sec.color,
          cursor: secIdx === 0 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>{"\u2190"} Previous</button>

        <div style={{ display: "flex", gap: 4 }}>
          {DEGRAD_SECTIONS.map((s, i) => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{
              width: 7, height: 7, borderRadius: 4,
              background: active === s.id ? s.color : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>

        <button onClick={() => { if (secIdx < DEGRAD_SECTIONS.length - 1) setActive(DEGRAD_SECTIONS[secIdx + 1].id); }}
          disabled={secIdx === DEGRAD_SECTIONS.length - 1} style={{
          padding: "6px 16px", borderRadius: 8, fontSize: 12,
          background: secIdx === DEGRAD_SECTIONS.length - 1 ? T.surface : sec.color + "18",
          border: `1px solid ${secIdx === DEGRAD_SECTIONS.length - 1 ? T.border : sec.color}`,
          color: secIdx === DEGRAD_SECTIONS.length - 1 ? T.muted : sec.color,
          cursor: secIdx === DEGRAD_SECTIONS.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>Next {"\u2192"}</button>
      </div>
    </div>
  );
}
