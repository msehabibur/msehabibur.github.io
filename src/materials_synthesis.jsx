import { useState, useEffect } from "react";

const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  syn_main: "#059669", syn_cvd: "#2563eb", syn_pvd: "#7c3aed", syn_sol: "#d97706",
  syn_spin: "#0891b2", syn_ald: "#dc2626", syn_mbe: "#ca8a04", syn_hydro: "#0284c7",
};

function FAQAccordion({ title, color, isOpen, onClick, children }) {
  return (
    <div style={{ borderRadius: 12, border: `1.5px solid ${isOpen ? color : T.border}`, overflow: "hidden", transition: "all 0.2s" }}>
      <button onClick={onClick} style={{ width: "100%", padding: "12px 16px", background: isOpen ? color + "12" : T.surface, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", textAlign: "left" }}>
        <span style={{ fontSize: 16, color: isOpen ? color : T.muted, fontWeight: 700, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: isOpen ? color : T.ink, flex: 1 }}>{title}</span>
        {isOpen && <span style={{ fontSize: 10, color, fontWeight: 600, padding: "2px 8px", background: color + "15", borderRadius: 6 }}>OPEN</span>}
      </button>
      {isOpen && <div style={{ padding: "14px 18px", borderTop: `1px solid ${color}20`, background: T.surface }}>{children}</div>}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit, format }) {
  const fmt = format || (v => v.toFixed(2));
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: T.muted }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "monospace" }}>{fmt(value)}{unit || ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
    </div>
  );
}

function ResultBox({ label, value, color, sub }) {
  return (
    <div style={{ background: color + "11", border: `1px solid ${color}33`, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 10, color: T.muted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, color, formula, children }) {
  return (
    <div style={{ background: T.panel, border: `1.5px solid ${(color || T.border)}44`, borderLeft: `4px solid ${color || "#2563eb"}`, borderRadius: 10, padding: "16px 18px", marginBottom: 10 }}>
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

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
      <span style={{ color: T.ink, fontFamily: "monospace" }}>{eq}</span>
      <span style={{ color: color || T.syn_main, fontWeight: 700, fontFamily: "monospace" }}>{result}</span>
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

const mb = { fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, background: T.surface, borderRadius: 10, padding: "14px 18px", border: `1px solid ${T.border}40`, marginBottom: 10 };

// ═══════════════════════════════════════════════════════════════════════════
// SOLAR CELL CARD WITH STEP-BY-STEP ANIMATION
// ═══════════════════════════════════════════════════════════════════════════
function SolarCellCard({ mat, eg, method, recipe, eff, color, steps }) {
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => { if (!expanded) return; const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, [expanded]);

  return (
    <div style={{ background: color + "06", border: `1px solid ${color}18`, borderRadius: 8, padding: "8px 10px", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color }}>{mat}</div>
        <span style={{ fontSize: 9, color: expanded ? color : T.muted, fontWeight: 600 }}>{expanded ? "▼ CLOSE" : "▶ ANIMATE"}</span>
      </div>
      <div style={{ fontSize: 10, color: T.ink, marginTop: 2 }}>E<sub>g</sub> = {eg}</div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}><b>Method:</b> {method}</div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}><b>Recipe:</b> {recipe}</div>
      <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 4 }}>Best η: {eff}</div>

      {expanded && steps && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${color}20`, paddingTop: 8 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", gap: 3, marginBottom: 6, flexWrap: "wrap" }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)} style={{
                padding: "3px 8px", borderRadius: 6, border: `1.5px solid ${activeStep === i ? color : T.border}`,
                background: activeStep === i ? color + "18" : T.bg, color: activeStep === i ? color : T.muted,
                cursor: "pointer", fontSize: 9, fontFamily: "inherit", fontWeight: activeStep === i ? 800 : 400,
              }}>{s.icon} {i + 1}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4 }}>{steps[activeStep].title}</div>
          <div style={{ fontSize: 10, lineHeight: 1.6, color: T.ink, marginBottom: 6 }}>{steps[activeStep].desc}</div>

          <svg width="100%" viewBox="0 0 320 160" style={{ background: T.bg, borderRadius: 8, border: `1px solid ${T.border}`, display: "block" }}>
            {steps[activeStep].render(tick, color)}
          </svg>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CVD SECTION
// ═══════════════════════════════════════════════════════════════════════════
function CVDSection() {
  const [openItem, setOpenItem] = useState("cvd_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [cvdStep, setCvdStep] = useState(0);
  const [tick, setTick] = useState(0);
  const [cvdT, setCvdT] = useState(600);
  const [cvdP, setCvdP] = useState(10);
  const [cvdRate, setCvdRate] = useState(5);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const steps = [
    { title: "Step 1: Precursor Gas Flow", icon: "💨", color: T.syn_cvd,
      analogy: "Like spraying perfume into a room. Gaseous precursors (e.g., SiH₄ for Si, TiCl₄ for TiO₂) are carried by an inert gas (N₂ or Ar) into the reaction chamber. The flow rate controls how much material reaches the substrate." },
    { title: "Step 2: Gas-Phase Reaction", icon: "⚗️", color: T.syn_sol,
      analogy: "Like cooking in mid-air. Precursor molecules partially decompose or react in the hot gas above the substrate. Temperature determines which reactions occur — too cold and nothing happens, too hot and you get powder (homogeneous nucleation) instead of a film." },
    { title: "Step 3: Adsorption on Surface", icon: "🎯", color: T.syn_main,
      analogy: "Like flies landing on a sticky surface. Reactive fragments adsorb onto the heated substrate. They diffuse across the surface looking for energetically favorable sites — step edges, kink sites, or existing islands." },
    { title: "Step 4: Surface Diffusion & Reaction", icon: "🏃", color: T.syn_spin,
      analogy: "Like ants finding food. Adsorbed molecules crawl across the surface, meet other molecules, and react to form the film material. Higher substrate temperature = faster diffusion = larger crystalline grains." },
    { title: "Step 5: Film Growth & Byproduct Desorption", icon: "📈", color: T.syn_pvd,
      analogy: "Like building with LEGOs while sweeping away packaging. The film grows atom-by-atom while volatile byproducts (HCl, H₂, CO₂) desorb from the surface and are pumped away. The growth rate depends on temperature, pressure, and precursor flux." },
  ];

  const cvdVariants = [
    { name: "APCVD", pressure: "Atmospheric (760 Torr)", temp: "300-500°C", rate: "1-10 μm/min", use: "TCO (FTO), SiO₂, low-cost coatings", color: T.syn_cvd },
    { name: "LPCVD", pressure: "0.1-10 Torr", temp: "400-900°C", rate: "1-50 nm/min", use: "Poly-Si, Si₃N₄, high-quality conformal films", color: T.syn_main },
    { name: "PECVD", pressure: "0.1-2 Torr", temp: "200-400°C", rate: "10-100 nm/min", use: "a-Si:H, SiNx passivation, low-T deposition", color: T.syn_pvd },
    { name: "MOCVD", pressure: "10-760 Torr", temp: "500-800°C", rate: "0.1-5 μm/hr", use: "III-V (GaAs, InP), LEDs, laser diodes", color: T.syn_sol },
  ];

  const step = steps[cvdStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is CVD? (Chemical Vapor Deposition)" color={T.syn_cvd} isOpen={openItem === "cvd_what"} onClick={() => toggle("cvd_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_cvd + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_cvd + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🏭</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>Like invisible spray painting with chemistry. Gas-phase precursors flow over a hot substrate, decompose, and deposit a thin film atom by atom. The substrate never sees a liquid or solid source — everything arrives as vapor. CVD is the workhorse of the semiconductor industry: Si wafers, SiO₂ insulators, Si₃N₄ passivation, III-V LEDs, and diamond coatings.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_cvd, fontWeight: 700 }}>General CVD reaction:</span><br />
          {"  Precursor(gas) + Energy(heat/plasma) → Film(solid) + Byproducts(gas)"}<br /><br />
          {"  Example: SiH₄(g) → Si(s) + 2H₂(g)       (silicon deposition)"}<br />
          {"  Example: TiCl₄(g) + 2H₂O(g) → TiO₂(s) + 4HCl(g)  (titanium dioxide)"}<br />
          {"  Example: WF₆(g) + 3H₂(g) → W(s) + 6HF(g)  (tungsten contacts)"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {cvdVariants.map(v => (
            <div key={v.name} style={{ background: v.color + "08", border: `1px solid ${v.color}20`, borderRadius: 8, padding: "8px", fontSize: 10 }}>
              <div style={{ fontWeight: 800, color: v.color, fontSize: 12, marginBottom: 4 }}>{v.name}</div>
              <div style={{ color: T.muted }}>{v.pressure}</div>
              <div style={{ color: T.muted }}>{v.temp}</div>
              <div style={{ color: T.ink, fontWeight: 600, marginTop: 4 }}>{v.use}</div>
            </div>
          ))}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step CVD Process (click each step)" color={T.syn_main} isOpen={openItem === "cvd_steps"} onClick={() => toggle("cvd_steps")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setCvdStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${cvdStep === i ? s.color : T.border}`,
              background: cvdStep === i ? s.color + "18" : T.bg, color: cvdStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: cvdStep === i ? 800 : 400,
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: step.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${step.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: step.color, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.analogy}</div>
          </div>
        </div>

        <svg width={420} height={260} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={230} rx={6} fill={T.surface} />
          {/* Chamber walls */}
          <rect x={40} y={40} width={340} height={180} rx={10} fill={T.bg} stroke={T.ink + "30"} strokeWidth={2} />
          {/* Substrate (heated stage) */}
          <rect x={100} y={185} width={220} height={20} rx={3} fill={T.syn_sol + "60"} stroke={T.syn_sol} strokeWidth={1.5} />
          <text x={210} y={198} textAnchor="middle" fill={T.syn_sol} fontSize={9} fontWeight={700}>Substrate ({cvdT}°C)</text>
          {/* Growing film */}
          <rect x={100} y={178} width={220} height={7} rx={2} fill={T.syn_cvd + "70"} stroke={T.syn_cvd} strokeWidth={0.5}>
            {cvdStep >= 4 && <animate attributeName="height" values="3;7;3" dur="2s" repeatCount="indefinite" />}
          </rect>

          {/* Gas inlet */}
          <rect x={20} y={80} width={25} height={40} rx={3} fill={T.syn_cvd + "20"} stroke={T.syn_cvd} strokeWidth={1} />
          <text x={32} y={105} textAnchor="middle" fill={T.syn_cvd} fontSize={7} fontWeight={700}>GAS IN</text>

          {/* Gas outlet */}
          <rect x={375} y={80} width={25} height={40} rx={3} fill={T.muted + "20"} stroke={T.muted} strokeWidth={1} />
          <text x={387} y={105} textAnchor="middle" fill={T.muted} fontSize={7}>OUT</text>

          {/* Step-specific animations */}
          {cvdStep === 0 && Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={50 + (tick * 2 + i * 30) % 300} cy={80 + i * 10 + 5 * Math.sin(tick * 0.1 + i)} r={3} fill={T.syn_cvd + "90"} />
          ))}

          {cvdStep === 1 && <>
            {Array.from({ length: 6 }, (_, i) => {
              const x = 100 + i * 40; const y = 100 + 20 * Math.sin(tick * 0.12 + i);
              return <g key={i}><circle cx={x} cy={y} r={4} fill={T.syn_cvd + "60"} /><circle cx={x + 5} cy={y - 5} r={2.5} fill={T.syn_sol + "80"} /></g>;
            })}
            <text x={210} y={70} textAnchor="middle" fill={T.syn_sol} fontSize={10} fontWeight={700}>Gas-phase decomposition</text>
          </>}

          {cvdStep === 2 && Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={110 + i * 22} cy={150 + (tick + i * 5) % 30} r={3} fill={T.syn_main + "cc"}>
              <animate attributeName="cy" values={`${120};${175};${175}`} dur="1.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
            </circle>
          ))}

          {cvdStep === 3 && Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={120 + (tick * 1.5 + i * 25) % 180} cy={176} r={3} fill={T.syn_spin + "cc"}>
              <animate attributeName="cx" values={`${120 + i * 25};${130 + i * 25};${120 + i * 25}`} dur="1s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
            </circle>
          ))}

          {cvdStep === 4 && <>
            {Array.from({ length: 5 }, (_, i) => (
              <circle key={i} cx={150 + i * 30} cy={140 - (tick + i * 8) % 60} r={2.5} fill={T.muted + "80"}>
                <animate attributeName="cy" values={`${170};${60}`} dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            ))}
            <text x={280} y={70} fill={T.muted} fontSize={9}>Byproducts ↑</text>
          </>}

          <text x={210} y={248} textAnchor="middle" fill={T.muted} fontSize={9} fontWeight={600}>{step.title}</text>
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Interactive: CVD Growth Rate Calculator" color={T.syn_pvd} isOpen={openItem === "cvd_calc"} onClick={() => toggle("cvd_calc")}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <SliderRow label="Substrate temperature" value={cvdT} min={200} max={1000} step={10} onChange={setCvdT} color={T.syn_sol} unit=" °C" format={v => v.toFixed(0)} />
            <SliderRow label="Chamber pressure" value={cvdP} min={0.01} max={760} step={0.1} onChange={setCvdP} color={T.syn_cvd} unit=" Torr" format={v => v < 1 ? v.toFixed(2) : v.toFixed(0)} />
            <SliderRow label="Growth rate" value={cvdRate} min={0.1} max={100} step={0.1} onChange={setCvdRate} color={T.syn_main} unit=" nm/min" />
            <div style={{ marginTop: 8, fontSize: 11, color: T.muted, lineHeight: 1.6, background: T.syn_cvd + "08", borderRadius: 8, padding: "8px 12px" }}>
              {cvdT < 300 && <span style={{ color: T.syn_ald, fontWeight: 700 }}>Very low T — consider PECVD (plasma assists decomposition).</span>}
              {cvdT >= 300 && cvdT < 600 && <span>Moderate T — LPCVD range. Good for conformal coatings.</span>}
              {cvdT >= 600 && <span style={{ color: T.syn_sol }}>High T — thermal CVD. Excellent crystallinity, fast growth.</span>}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <ResultBox label="1 μm film" value={((1000 / cvdRate)).toFixed(1)} color={T.syn_cvd} sub="minutes" />
              <ResultBox label="100 nm film" value={(100 / cvdRate).toFixed(1)} color={T.syn_main} sub="minutes" />
              <ResultBox label="Regime" value={cvdP > 100 ? "APCVD" : cvdP > 1 ? "LPCVD" : "UHV-CVD"} color={T.syn_pvd} sub={`${cvdP} Torr`} />
              <ResultBox label="Mean free path" value={cvdP > 0 ? (5 / cvdP).toFixed(1) : "∞"} color={T.syn_spin} sub="cm (approx)" />
            </div>
          </div>
        </div>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: CVD in the Lab" color={T.syn_cvd} isOpen={openItem === "cvd_examples"} onClick={() => toggle("cvd_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: LPCVD Poly-Si Deposition Rate" color={T.syn_cvd} formula="Arrhenius: R = R₀·exp(−Eₐ/kT)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You need to deposit 300 nm of polycrystalline silicon (poly-Si) by LPCVD using silane (SiH₄) decomposition. Your advisor says "run the furnace at 625°C." You need to calculate the deposition rate, total deposition time, and verify the regime is surface-reaction limited.
            </div>
            <div style={{ background: T.syn_cvd + "06", border: `1px solid ${T.syn_cvd}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_cvd, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>CVD growth rate follows the Arrhenius equation — just like baking a cake, higher temperature speeds up the reaction exponentially. But there are two regimes: at low temperature, the surface reaction is slow (reaction-limited, good uniformity); at high temperature, gas transport can't keep up (mass-transport-limited, poor uniformity).</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Precursor" value="SiH₄ (silane) → Si + 2H₂" />
              <InfoRow label="Chamber pressure" value="0.3 Torr (LPCVD)" />
              <InfoRow label="Substrate temperature" value="625°C = 898 K" />
              <InfoRow label="Activation energy Eₐ" value="1.7 eV (for SiH₄ → Si)" />
              <InfoRow label="Pre-exponential R₀" value="1.5 × 10⁸ nm/min" />
              <InfoRow label="Target thickness" value="300 nm" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Deposition Rate:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="R = R₀ · exp(−Eₐ / kT)" result="" color={T.syn_cvd} />
              <CalcRow eq="kT = (8.617 × 10⁻⁵ eV/K)(898 K)" result="0.0774 eV" color={T.syn_cvd} />
              <CalcRow eq="Eₐ/kT = 1.7 / 0.0774" result="21.96" color={T.syn_cvd} />
              <CalcRow eq="exp(−21.96)" result="2.89 × 10⁻¹⁰" color={T.syn_cvd} />
              <CalcRow eq="R = 1.5 × 10⁸ × 2.89 × 10⁻¹⁰" result="43.4 nm/min" color={T.syn_cvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Calculate Deposition Time:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t = thickness / rate = 300 nm / 43.4 nm/min" result="6.9 min" color={T.syn_cvd} />
              <CalcRow eq="Round up with safety margin" result="~8 min total" color={T.syn_cvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Verify Regime:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="At 625°C" value="Surface-reaction limited (good!)" />
              <InfoRow label="Transition temperature" value="~700°C for SiH₄ LPCVD" />
              <InfoRow label="Uniformity expected" value="< 2% thickness variation across wafer" />
              <InfoRow label="Why this matters" value="Uniform poly-Si gate electrodes across 150mm wafer" />
            </div>
            <div style={{ background: T.syn_cvd + "08", border: `1px solid ${T.syn_cvd}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_cvd, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 625°C, poly-Si grows at ~43 nm/min in LPCVD. The 300 nm film needs ~7-8 minutes. Because we are in the surface-reaction-limited regime (below 700°C), film thickness will be uniform across the wafer. If we raised temperature to 800°C, the rate would jump to ~500 nm/min but uniformity would degrade — gas can't reach the wafer center fast enough.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: PECVD SiNₓ Anti-Reflection Coating" color={T.syn_cvd} formula="λ/4n thickness for minimum reflection">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are fabricating a silicon solar cell and need to deposit a SiNₓ anti-reflection coating by PECVD. The coating must minimize reflection at 600 nm (peak of solar spectrum). You need to calculate the optimal thickness and the deposition time.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Design Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Target wavelength" value="λ = 600 nm" />
              <InfoRow label="SiNₓ refractive index" value="n = 2.05 (at 600 nm)" />
              <InfoRow label="Optimal condition" value="λ/4n (quarter-wave coating)" />
              <InfoRow label="PECVD gases" value="SiH₄ + NH₃ + N₂ at 400°C" />
              <InfoRow label="Deposition rate" value="15 nm/min (typical PECVD SiNₓ)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Optimal Thickness:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t = λ / (4n)" result="" color={T.syn_pvd} />
              <CalcRow eq="t = 600 nm / (4 × 2.05)" result="" color={T.syn_pvd} />
              <CalcRow eq="t = 600 / 8.20" result="73.2 nm" color={T.syn_pvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Deposition Time:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="time = 73.2 nm / 15 nm/min" result="4.9 min" color={T.syn_pvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Reflection Reduction:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Bare Si reflection" value="~35% at 600 nm" />
              <InfoRow label="With SiNₓ coating" value="< 3% at 600 nm" />
              <InfoRow label="Weighted average (AM1.5)" value="~8% average across 400-1100 nm" />
              <InfoRow label="Current gain" value="Jsc increases from ~33 to ~39 mA/cm²" />
            </div>
            <div style={{ background: T.syn_pvd + "08", border: `1px solid ${T.syn_pvd}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_pvd, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 73 nm SiNₓ coating deposited in just 5 minutes by PECVD cuts reflection from 35% to under 3% at the target wavelength. This is why every commercial silicon solar cell has a blue-purple appearance — that's the SiNₓ anti-reflection coating! The PECVD process also passivates surface dangling bonds with hydrogen, reducing recombination.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: MOCVD GaAs Growth Rate from TMGa Flow" color={T.syn_cvd} formula="R = F_TMGa × M_GaAs / (ρ × A)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You're growing a GaAs solar cell absorber by MOCVD. The trimethylgallium (TMGa) bubbler is set to deliver 10 μmol/min of Ga. You need to calculate the expected growth rate on a 2-inch (50 mm diameter) substrate.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="TMGa molar flow" value="F = 10 μmol/min" />
              <InfoRow label="GaAs molar mass" value="M = 144.6 g/mol" />
              <InfoRow label="GaAs density" value="ρ = 5.32 g/cm³" />
              <InfoRow label="Substrate area" value="A = π(2.5)² = 19.63 cm²" />
              <InfoRow label="Growth temperature" value="650°C, V/III = 60" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Volume of GaAs deposited per minute:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="mass/min = F × M = 10×10⁻⁶ mol/min × 144.6 g/mol" result="1.446 × 10⁻³ g/min" color={T.syn_main} />
              <CalcRow eq="volume/min = mass/ρ = 1.446×10⁻³ / 5.32" result="2.72 × 10⁻⁴ cm³/min" color={T.syn_main} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Growth Rate:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="R = volume / area = 2.72×10⁻⁴ cm³/min / 19.63 cm²" result="1.39 × 10⁻⁵ cm/min" color={T.syn_main} />
              <CalcRow eq="Convert to μm/hr: × 10⁴ × 60" result="8.3 nm/min = 0.50 μm/hr" color={T.syn_main} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Time for 3 μm absorber:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t = 3 μm / 0.50 μm/hr" result="6.0 hours" color={T.syn_main} />
            </div>
            <div style={{ background: T.syn_main + "08", border: `1px solid ${T.syn_main}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_main, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>In MOCVD at 650°C, the growth rate is controlled by the Group III precursor flow (TMGa). At 10 μmol/min, GaAs grows at ~0.5 μm/hr. A 3 μm solar cell absorber takes ~6 hours — this is why MOCVD GaAs cells are expensive. Doubling the TMGa flow doubles the rate, but V/III ratio drops and crystal quality suffers.</div>
            </div>
          </Card>

          <Card title="Numerical Example 4: CVD Mean Free Path and Regime Selection" color={T.syn_cvd} formula="λ_mfp = kT / (√2 · π · d² · P)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You're choosing between APCVD (760 Torr) and LPCVD (0.5 Torr) for depositing SiO₂. You need to calculate the mean free path in each case to understand why LPCVD gives better step coverage on 3D features.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Gas molecule diameter" value="d ≈ 4.0 Å (SiH₄)" />
              <InfoRow label="Temperature" value="T = 700°C = 973 K" />
              <InfoRow label="Boltzmann constant k" value="1.381 × 10⁻²³ J/K" />
              <InfoRow label="APCVD pressure" value="760 Torr = 1.013 × 10⁵ Pa" />
              <InfoRow label="LPCVD pressure" value="0.5 Torr = 66.7 Pa" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Mean Free Path at APCVD (760 Torr):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="λ = kT / (√2 · π · d² · P)" result="" color={T.syn_sol} />
              <CalcRow eq="λ = (1.381×10⁻²³)(973) / (√2 · π · (4×10⁻¹⁰)² · 1.013×10⁵)" result="" color={T.syn_sol} />
              <CalcRow eq="λ_APCVD" result="~0.19 μm" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Mean Free Path at LPCVD (0.5 Torr):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="λ_LPCVD = λ_APCVD × (760 / 0.5)" result="" color={T.syn_sol} />
              <CalcRow eq="λ_LPCVD = 0.19 μm × 1520" result="~290 μm" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Impact on Step Coverage:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="APCVD mean free path" value="0.19 μm (< feature size)" />
              <InfoRow label="LPCVD mean free path" value="290 μm (>> feature size)" />
              <InfoRow label="Trench width" value="1 μm" />
              <InfoRow label="APCVD step coverage" value="~30% (poor, many collisions in trench)" />
              <InfoRow label="LPCVD step coverage" value=">95% (excellent, molecules reach bottom)" />
            </div>
            <div style={{ background: T.syn_sol + "08", border: `1px solid ${T.syn_sol}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_sol, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At atmospheric pressure, gas molecules collide every 0.19 μm — they can't reach the bottom of a 1 μm trench, so the film is thicker at the top (poor step coverage). At 0.5 Torr, the mean free path is 290 μm — molecules fly straight into trenches without collisions, coating all surfaces uniformly. This is exactly why LPCVD is used for conformal SiO₂ and Si₃N₄ in CMOS fabrication.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PVD SECTION
// ═══════════════════════════════════════════════════════════════════════════
function PVDSection() {
  const [openItem, setOpenItem] = useState("pvd_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [pvdStep, setPvdStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const pvdSteps = [
    { title: "Step 1: Create Vacuum", icon: "🫧", color: T.syn_pvd,
      analogy: "Like emptying a room of air so thrown baseballs travel in straight lines. At 10⁻⁶ Torr, the mean free path is ~50 meters — atoms travel from source to substrate without colliding with gas molecules." },
    { title: "Step 2: Vaporize Source Material", icon: "🔥", color: T.syn_ald,
      analogy: "Like boiling water to make steam, but with metals. Thermal evaporation uses resistive heating (W boats) or e-beam heating. Sputtering uses Ar⁺ ions to knock atoms off a target — like microscopic billiards." },
    { title: "Step 3: Transport Through Vacuum", icon: "✈️", color: T.syn_cvd,
      analogy: "Atoms fly in straight lines through vacuum — like bullets from a gun. In sputtering, Ar gas scatters them slightly, giving better step coverage. In evaporation, it's line-of-sight: shadowed areas get no film." },
    { title: "Step 4: Condensation & Film Growth", icon: "❄️", color: T.syn_main,
      analogy: "Like frost forming on a cold window. Atoms arrive at the substrate, lose energy, and stick. Substrate temperature controls crystallinity: cold → amorphous, warm → polycrystalline, hot → epitaxial single crystal." },
  ];

  const step = pvdSteps[pvdStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is PVD? (Physical Vapor Deposition)" color={T.syn_pvd} isOpen={openItem === "pvd_what"} onClick={() => toggle("pvd_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_pvd + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_pvd + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🎯</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>Like spray painting with individual atoms. PVD physically moves material from a solid/liquid source to the substrate through vacuum — no chemical reactions involved. The source is vaporized (by heat, electron beam, or ion bombardment), and atoms condense on the cool substrate to form a thin film.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          {[
            { name: "Thermal Evaporation", desc: "Resistive heating or e-beam melts source. Line-of-sight. Simple, cheap, fast.", use: "Metals (Au, Al, Cu), organics (OLEDs)", color: T.syn_pvd },
            { name: "Sputtering", desc: "Ar⁺ ions knock atoms off target. Better uniformity than evaporation.", use: "Metals, oxides, nitrides, alloys", color: T.syn_cvd },
            { name: "Pulsed Laser (PLD)", desc: "Laser ablates target. Preserves stoichiometry of complex materials.", use: "Complex oxides (YBCO, BaTiO₃), multicomponent films", color: T.syn_ald },
          ].map(v => (
            <div key={v.name} style={{ background: v.color + "08", border: `1px solid ${v.color}20`, borderRadius: 8, padding: "10px", fontSize: 10 }}>
              <div style={{ fontWeight: 800, color: v.color, fontSize: 11, marginBottom: 4 }}>{v.name}</div>
              <div style={{ color: T.ink, lineHeight: 1.5, marginBottom: 4 }}>{v.desc}</div>
              <div style={{ color: T.muted, fontStyle: "italic" }}>{v.use}</div>
            </div>
          ))}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step PVD Process" color={T.syn_main} isOpen={openItem === "pvd_steps"} onClick={() => toggle("pvd_steps")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {pvdSteps.map((s, i) => (
            <button key={i} onClick={() => setPvdStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${pvdStep === i ? s.color : T.border}`,
              background: pvdStep === i ? s.color + "18" : T.bg, color: pvdStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: pvdStep === i ? 800 : 400,
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: step.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${step.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: step.color, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.analogy}</div>
          </div>
        </div>

        <svg width={420} height={260} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={230} rx={6} fill={T.surface} />
          {/* Vacuum chamber */}
          <rect x={40} y={30} width={340} height={200} rx={10} fill={T.bg} stroke={T.ink + "30"} strokeWidth={2} />
          {pvdStep === 0 && <text x={210} y={130} textAnchor="middle" fill={T.syn_pvd} fontSize={14} fontWeight={800}>VACUUM: 10⁻⁶ Torr</text>}

          {/* Source at bottom */}
          <rect x={160} y={200} width={100} height={20} rx={4} fill={T.syn_ald + "50"} stroke={T.syn_ald} strokeWidth={1.5} />
          <text x={210} y={214} textAnchor="middle" fill={T.syn_ald} fontSize={9} fontWeight={700}>Source</text>

          {/* Substrate at top */}
          <rect x={120} y={45} width={180} height={15} rx={3} fill={T.syn_main + "40"} stroke={T.syn_main} strokeWidth={1.5} />
          <text x={210} y={55} textAnchor="middle" fill={T.syn_main} fontSize={8} fontWeight={700}>Substrate</text>

          {/* Evaporation plume */}
          {pvdStep >= 1 && <>
            <text x={210} y={195} textAnchor="middle" fill={T.syn_ald} fontSize={10} fontWeight={700}>
              {pvdStep === 1 ? "HEATING SOURCE" : ""}
            </text>
          </>}

          {/* Flying atoms */}
          {pvdStep >= 2 && Array.from({ length: 10 }, (_, i) => {
            const startX = 170 + Math.random() * 80;
            const progress = ((tick * 2 + i * 15) % 120) / 120;
            const x = startX + (210 - startX) * (1 - progress) * 0.3;
            const y = 195 - progress * 140;
            return y > 60 ? <circle key={i} cx={x} cy={y} r={3} fill={T.syn_pvd + "cc"} /> : null;
          })}

          {/* Film growing on substrate */}
          {pvdStep >= 3 && <rect x={120} y={60} width={180} height={4 + (tick % 30) * 0.2} rx={2} fill={T.syn_pvd + "60"} stroke={T.syn_pvd} strokeWidth={0.5}>
            <animate attributeName="height" values="2;6;2" dur="3s" repeatCount="indefinite" />
          </rect>}

          {/* Sputtering ions */}
          {pvdStep === 1 && Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <circle cx={180 + i * 20} cy={195 - (tick * 3 + i * 10) % 30} r={2} fill={T.syn_ald}>
                <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          <text x={210} y={248} textAnchor="middle" fill={T.muted} fontSize={9} fontWeight={600}>{step.title}</text>
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: PVD in the Lab" color={T.syn_pvd} isOpen={openItem === "pvd_examples"} onClick={() => toggle("pvd_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: Sputtering Deposition Rate" color={T.syn_pvd} formula="DC magnetron sputtering of Cu">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You need to deposit a 200 nm Cu seed layer by DC magnetron sputtering for interconnect metallization. The sputter system runs at 300 W DC power on a 3-inch Cu target. You need to calculate the sputter yield, deposition rate, and time.
            </div>
            <div style={{ background: T.syn_pvd + "06", border: `1px solid ${T.syn_pvd}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_pvd, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Sputtering is atomic-scale billiards. Ar⁺ ions accelerated by 300-600 V slam into the Cu target. Each Ar⁺ ion knocks out ~2 Cu atoms (the sputter yield). These Cu atoms fly across the vacuum and land on your substrate.</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Given Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="DC power" value="300 W at 400 V → I = 0.75 A" />
              <InfoRow label="Ar⁺ ion current" value="0.75 A = 4.69 × 10¹⁸ ions/sec" />
              <InfoRow label="Sputter yield (Cu at 400 eV Ar⁺)" value="Y = 2.3 atoms/ion" />
              <InfoRow label="Cu atomic mass" value="63.55 g/mol" />
              <InfoRow label="Cu density" value="8.96 g/cm³" />
              <InfoRow label="Target-to-substrate distance" value="10 cm" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Atoms Sputtered per Second:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Flux = I/e × Y = 4.69×10¹⁸ × 2.3" result="1.08 × 10¹⁹ Cu atoms/s" color={T.syn_pvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Deposition Rate (assuming 30% collection efficiency):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Atoms reaching 6-inch wafer ≈ 30% of total" result="3.24 × 10¹⁸ atoms/s" color={T.syn_pvd} />
              <CalcRow eq="Wafer area = π(7.5)² = 176.7 cm²" result="" color={T.syn_pvd} />
              <CalcRow eq="Atom flux on wafer = 3.24×10¹⁸ / 176.7" result="1.83 × 10¹⁶ atoms/cm²·s" color={T.syn_pvd} />
              <CalcRow eq="Cu monolayer density ≈ 1.53 × 10¹⁵ atoms/cm²" result="" color={T.syn_pvd} />
              <CalcRow eq="Monolayers/sec = 1.83×10¹⁶ / 1.53×10¹⁵" result="12 ML/s" color={T.syn_pvd} />
              <CalcRow eq="Rate ≈ 12 × 0.18 nm/ML" result="~2.2 nm/s = 130 nm/min" color={T.syn_pvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Deposition Time:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t = 200 nm / 130 nm/min" result="~1.5 min (90 seconds)" color={T.syn_pvd} />
            </div>
            <div style={{ background: T.syn_pvd + "08", border: `1px solid ${T.syn_pvd}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_pvd, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 300 W DC, Cu sputters at ~130 nm/min — a 200 nm seed layer is done in 90 seconds. This is fast! However, the step coverage is only ~30% on vertical sidewalls (line-of-sight deposition). For high-aspect-ratio vias, you'd need ionized PVD (iPVD) to improve directionality.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: Thermal Evaporation — Knudsen Cell Flux" color={T.syn_pvd} formula="J = (P·Aₑ)/(π·r²) × 1/(2πmkT)^½">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are evaporating gold (Au) from a thermal boat to deposit 100 nm contacts on a solar cell. The Au source temperature is 1400°C. You need to estimate the evaporation rate and whether the film thickness is uniform across the substrate.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Vapor Pressure of Au at 1400°C:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Au melting point" value="1064°C" />
              <InfoRow label="Source temperature" value="1400°C = 1673 K" />
              <InfoRow label="Vapor pressure at 1673 K" value="P ≈ 0.1 Torr (from Clausius-Clapeyron)" />
              <InfoRow label="Source-to-substrate distance" value="r = 30 cm" />
              <InfoRow label="Source aperture area" value="Aₑ = 1 cm²" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Evaporation Flux (Hertz-Knudsen):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="J = P / √(2πmkT)" result="" color={T.syn_sol} />
              <CalcRow eq="m(Au) = 197 × 1.66×10⁻²⁷ = 3.27×10⁻²⁵ kg" result="" color={T.syn_sol} />
              <CalcRow eq="J = 0.1 Torr / √(2π × 3.27×10⁻²⁵ × 1.381×10⁻²³ × 1673)" result="" color={T.syn_sol} />
              <CalcRow eq="Evaporation flux from source" result="~6.8 × 10²⁰ atoms/m²·s" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Rate at Substrate (inverse-square law):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Flux at substrate = J × Aₑ / (π × r²)" result="" color={T.syn_sol} />
              <CalcRow eq="= 6.8×10²⁰ × 1×10⁻⁴ / (π × 0.09)" result="2.4 × 10¹⁷ atoms/m²·s" color={T.syn_sol} />
              <CalcRow eq="Au monolayer = 1.39 × 10¹⁹ atoms/m²" result="" color={T.syn_sol} />
              <CalcRow eq="Rate = 2.4×10¹⁷ / 1.39×10¹⁹ × 0.24 nm" result="~4 nm/s ≈ 240 nm/min" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Uniformity Check:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Thickness at center" value="100 nm (directly above source)" />
              <InfoRow label="Thickness at 5 cm off-center" value="100 × cos⁴(θ) ≈ 97.3 nm" />
              <InfoRow label="Thickness at edge (10 cm)" value="100 × cos⁴(θ) ≈ 89.0 nm" />
              <InfoRow label="Uniformity" value="~11% variation (needs planetary rotation!)" />
            </div>
            <div style={{ background: T.syn_sol + "08", border: `1px solid ${T.syn_sol}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_sol, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Au evaporates fast (~240 nm/min at 1400°C), so 100 nm contacts take only ~25 seconds. But the cos⁴(θ) distribution causes 11% thickness variation across the wafer. In production, substrates rotate on a planetary fixture to even out the deposition — achieving {"<"}2% uniformity.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: Sputter Gas Pressure and Mean Free Path" color={T.syn_pvd} formula="λ_mfp = 1/(n·σ) where n = P/kT">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You're sputtering ITO (indium tin oxide) for a transparent electrode. You need to choose the Ar pressure: 2 mTorr vs 20 mTorr. Calculate the mean free path at each pressure and explain the impact on film properties.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Calculate Mean Free Path:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="At 2 mTorr: λ = 5 cm / P(mTorr) = 5/2" result="~2.5 cm" color={T.syn_cvd} />
              <CalcRow eq="At 20 mTorr: λ = 5/20" result="~0.25 cm" color={T.syn_cvd} />
              <CalcRow eq="Target-substrate distance" result="10 cm" color={T.syn_cvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Number of Collisions en Route:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="At 2 mTorr: collisions = 10 cm / 2.5 cm" result="~4 collisions" color={T.syn_cvd} />
              <CalcRow eq="At 20 mTorr: collisions = 10 cm / 0.25 cm" result="~40 collisions" color={T.syn_cvd} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Impact on Film Properties:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="At 2 mTorr (few collisions)" value="Energetic atoms → dense film, low resistivity" />
              <InfoRow label="ITO resistivity at 2 mTorr" value="~2 × 10⁻⁴ Ω·cm" />
              <InfoRow label="At 20 mTorr (many collisions)" value="Thermalized atoms → porous film, high resistivity" />
              <InfoRow label="ITO resistivity at 20 mTorr" value="~8 × 10⁻⁴ Ω·cm (4× worse)" />
              <InfoRow label="But transmittance at 20 mTorr" value="Higher (less absorption, more porous)" />
            </div>
            <div style={{ background: T.syn_cvd + "08", border: `1px solid ${T.syn_cvd}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_cvd, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 2 mTorr, sputtered atoms arrive with high kinetic energy (few collisions), making a dense, conductive ITO film. At 20 mTorr, atoms thermalize before reaching the substrate — the film is porous and 4× more resistive. For solar cells, the optimal is ~5 mTorr: good conductivity AND high transparency. This pressure-property tradeoff is the #1 optimization knob in sputter deposition.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SOL-GEL SECTION
// ═══════════════════════════════════════════════════════════════════════════
function SolGelSection() {
  const [openItem, setOpenItem] = useState("sg_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [sgStep, setSgStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 100); return () => clearInterval(id); }, []);

  const steps = [
    { title: "Step 1: Precursor Solution (Sol)", icon: "🧪", color: T.syn_sol,
      analogy: "Like making a special soup. Dissolve metal alkoxides (e.g., TEOS for SiO₂, Ti-isopropoxide for TiO₂) in alcohol. The sol is a colloidal suspension — tiny particles floating in liquid, smaller than visible light wavelength." },
    { title: "Step 2: Hydrolysis & Condensation", icon: "💧", color: T.syn_hydro,
      analogy: "Like gelatin setting. Add water → alkoxide groups hydrolyze (M-OR + H₂O → M-OH + ROH). Then M-OH groups condense (M-OH + HO-M → M-O-M + H₂O) forming a 3D network. The sol becomes a gel — a wet solid sponge." },
    { title: "Step 3: Film Deposition (Spin/Dip Coating)", icon: "🌀", color: T.syn_spin,
      analogy: "Like spreading pizza dough by spinning. Spin coating: drop sol on substrate, spin at 2000-6000 RPM → centrifugal force spreads a uniform film. Dip coating: dip substrate in sol, withdraw at controlled speed → film thickness controlled by withdrawal rate." },
    { title: "Step 4: Drying & Calcination", icon: "🔥", color: T.syn_ald,
      analogy: "Like firing pottery in a kiln. First dry at 100-200°C (remove solvent). Then calcine at 400-600°C (burn organics, crystallize). The wet gel shrinks ~30% as pores collapse. Final film: dense, crystalline oxide." },
  ];

  const step = steps[sgStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is Sol-Gel?" color={T.syn_sol} isOpen={openItem === "sg_what"} onClick={() => toggle("sg_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_sol + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_sol + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🧪</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>Chemistry in a beaker that becomes a solid film. Start with a liquid solution of metal compounds, trigger polymerization reactions, coat it on a substrate, and bake. No vacuum needed! Sol-gel is the cheapest way to make oxide thin films (TiO₂, SiO₂, ZnO, ITO) and the backbone of many coating industries.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_sol, fontWeight: 700 }}>Sol-Gel chemistry:</span><br />
          {"  Hydrolysis:    M(OR)₄ + H₂O → M(OR)₃(OH) + ROH"}<br />
          {"  Condensation:  2 M-OH → M-O-M + H₂O  (water condensation)"}<br />
          {"                 M-OH + M-OR → M-O-M + ROH  (alcohol condensation)"}<br /><br />
          {"  Common precursors:"}<br />
          {"    SiO₂:  TEOS (tetraethyl orthosilicate)"}<br />
          {"    TiO₂:  Titanium isopropoxide"}<br />
          {"    ZnO:   Zinc acetate dihydrate"}<br />
          {"    ITO:   InCl₃ + SnCl₂ in ethanol"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step Sol-Gel Process" color={T.syn_spin} isOpen={openItem === "sg_steps"} onClick={() => toggle("sg_steps")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setSgStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${sgStep === i ? s.color : T.border}`,
              background: sgStep === i ? s.color + "18" : T.bg, color: sgStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: sgStep === i ? 800 : 400,
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: step.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${step.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: step.color, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.analogy}</div>
          </div>
        </div>

        <svg width={420} height={250} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={220} rx={6} fill={T.surface} />

          {/* Step 1: Beaker with solution */}
          {sgStep === 0 && <>
            <rect x={140} y={60} width={140} height={130} rx={8} fill={T.syn_sol + "15"} stroke={T.syn_sol} strokeWidth={2} />
            {Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={160 + (i % 4) * 30} cy={90 + Math.floor(i / 4) * 30 + 3 * Math.sin(tick * 0.1 + i)} r={4} fill={T.syn_sol + "80"} />
            ))}
            <text x={210} y={55} textAnchor="middle" fill={T.syn_sol} fontSize={11} fontWeight={700}>Colloidal Sol</text>
            <text x={210} y={205} textAnchor="middle" fill={T.muted} fontSize={9}>Metal alkoxide + solvent + catalyst</text>
          </>}

          {/* Step 2: Gelation network forming */}
          {sgStep === 1 && <>
            <rect x={140} y={60} width={140} height={130} rx={8} fill={T.syn_hydro + "10"} stroke={T.syn_hydro} strokeWidth={2} />
            {Array.from({ length: 15 }, (_, i) => {
              const x = 155 + (i % 5) * 25; const y = 80 + Math.floor(i / 5) * 35;
              return <g key={i}>
                <circle cx={x} cy={y} r={4} fill={T.syn_hydro + "80"} />
                {i % 5 < 4 && <line x1={x + 4} y1={y} x2={x + 21} y2={y} stroke={T.syn_hydro + "50"} strokeWidth={1.5} />}
                {Math.floor(i / 5) < 2 && <line x1={x} y1={y + 4} x2={x} y2={y + 31} stroke={T.syn_hydro + "50"} strokeWidth={1.5} />}
              </g>;
            })}
            <text x={210} y={55} textAnchor="middle" fill={T.syn_hydro} fontSize={11} fontWeight={700}>Gel Network Forming</text>
            <text x={210} y={205} textAnchor="middle" fill={T.muted} fontSize={9}>M-O-M bonds crosslink → 3D network</text>
          </>}

          {/* Step 3: Spin coating */}
          {sgStep === 2 && <>
            <rect x={120} y={140} width={180} height={15} rx={3} fill={T.syn_main + "40"} stroke={T.syn_main} strokeWidth={1.5} />
            <text x={210} y={152} textAnchor="middle" fill={T.syn_main} fontSize={8}>Substrate</text>
            {/* Spinning arrows */}
            <text x={210} y={90} textAnchor="middle" fill={T.syn_spin} fontSize={30} style={{ transform: `rotate(${tick * 10}deg)`, transformOrigin: "210px 90px" }}>🌀</text>
            {/* Film spreading */}
            <rect x={130 - (tick % 30) * 1} y={133} width={160 + (tick % 30) * 2} height={7} rx={2} fill={T.syn_sol + "60"} />
            <text x={210} y={120} textAnchor="middle" fill={T.syn_spin} fontSize={11} fontWeight={700}>{(3000 + tick * 10 % 3000)} RPM</text>
            <text x={210} y={205} textAnchor="middle" fill={T.muted} fontSize={9}>Centrifugal force spreads uniform thin film</text>
          </>}

          {/* Step 4: Calcination */}
          {sgStep === 3 && <>
            <rect x={120} y={120} width={180} height={15} rx={3} fill={T.syn_main + "40"} stroke={T.syn_main} strokeWidth={1.5} />
            <rect x={120} y={113} width={180} height={7} rx={2} fill={T.syn_ald + "60"} stroke={T.syn_ald} strokeWidth={0.5} />
            {/* Heat waves */}
            {Array.from({ length: 5 }, (_, i) => (
              <text key={i} x={140 + i * 35} y={155 + 5 * Math.sin(tick * 0.15 + i)} fill={T.syn_ald} fontSize={14} opacity={0.5 + 0.3 * Math.sin(tick * 0.1 + i)}>🔥</text>
            ))}
            {/* Organics burning off */}
            {Array.from({ length: 4 }, (_, i) => (
              <text key={i} x={150 + i * 30} y={100 - (tick + i * 5) % 40} fill={T.muted} fontSize={8} opacity={0.7}>CO₂↑</text>
            ))}
            <text x={210} y={85} textAnchor="middle" fill={T.syn_ald} fontSize={11} fontWeight={700}>500°C — Crystallization</text>
            <text x={210} y={205} textAnchor="middle" fill={T.muted} fontSize={9}>Organics burn off, oxide crystallizes</text>
          </>}

          <text x={210} y={238} textAnchor="middle" fill={T.muted} fontSize={9} fontWeight={600}>{step.title}</text>
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: Sol-Gel in the Lab" color={T.syn_sol} isOpen={openItem === "sg_examples"} onClick={() => toggle("sg_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: TEOS Hydrolysis — Molar Ratio Calculation" color={T.syn_sol} formula="TEOS + 4H₂O → Si(OH)₄ + 4EtOH">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are preparing a SiO₂ sol-gel solution using TEOS (tetraethyl orthosilicate). Your recipe calls for a water:TEOS molar ratio (r) of 4:1 with HCl catalyst. You need to calculate the volumes to mix for 50 mL of sol.
            </div>
            <div style={{ background: T.syn_sol + "06", border: `1px solid ${T.syn_sol}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_sol, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Making sol-gel is like following a baking recipe — the ratio of ingredients determines whether you get a delicate soufflé (thin film) or a brick (monolith). The water:TEOS ratio r controls the gel structure: r=2 gives linear chains (good for fibers), r=4 gives branched networks (good for films), r{">>"}4 gives dense particles.</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Target Composition:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="TEOS concentration" value="0.5 M in ethanol" />
              <InfoRow label="Water:TEOS ratio (r)" value="4:1 (stoichiometric)" />
              <InfoRow label="Catalyst" value="0.01 M HCl (acid-catalyzed)" />
              <InfoRow label="Total volume" value="50 mL" />
              <InfoRow label="TEOS molecular weight" value="208.3 g/mol, density 0.934 g/cm³" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate TEOS Volume:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="moles TEOS = 0.5 M × 0.050 L" result="0.025 mol" color={T.syn_sol} />
              <CalcRow eq="mass TEOS = 0.025 × 208.3 g/mol" result="5.21 g" color={T.syn_sol} />
              <CalcRow eq="volume TEOS = 5.21 g / 0.934 g/cm³" result="5.58 mL" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Calculate Water Volume:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="moles H₂O = 4 × 0.025 mol" result="0.100 mol" color={T.syn_sol} />
              <CalcRow eq="volume H₂O = 0.100 mol × 18 g/mol / 1.0 g/cm³" result="1.80 mL" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Final Recipe:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="TEOS" value="5.58 mL" />
              <InfoRow label="DI water + HCl" value="1.80 mL (pH ≈ 2)" />
              <InfoRow label="Ethanol (balance)" value="42.62 mL" />
              <InfoRow label="Total" value="50.00 mL" />
              <InfoRow label="Gel time at pH 2" value="~48 hours (acid-catalyzed, slow)" />
            </div>
            <div style={{ background: T.syn_sol + "08", border: `1px solid ${T.syn_sol}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_sol, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>With r=4, every TEOS molecule has exactly enough water to fully hydrolyze (replace all 4 ethoxy groups with -OH). Acid catalysis (pH 2) promotes linear chain growth — ideal for spin-coating smooth films. If you used base catalysis (pH 10), you'd get spherical colloidal particles instead (Stöber process for SiO₂ nanoparticles).</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: Dip-Coating Film Thickness (Landau-Levich)" color={T.syn_sol} formula="t = 0.94 × (η·v)^(2/3) / (γ^(1/6) · (ρg)^(1/2))">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are dip-coating a TiO₂ sol-gel film onto glass for a self-cleaning window coating. The withdrawal speed is 2 mm/s. Calculate the wet film thickness from the Landau-Levich equation and the final dry oxide thickness.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Sol Properties:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Sol viscosity η" value="5 mPa·s (≈ 5 cP)" />
              <InfoRow label="Surface tension γ" value="25 × 10⁻³ N/m" />
              <InfoRow label="Sol density ρ" value="0.9 g/cm³ = 900 kg/m³" />
              <InfoRow label="Withdrawal speed v" value="2 mm/s = 2 × 10⁻³ m/s" />
              <InfoRow label="Oxide content in sol" value="~3 wt% TiO₂ equivalent" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Wet Film Thickness (Landau-Levich):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t_wet = 0.94 × (η·v)^(2/3) / (γ^(1/6) · (ρg)^(1/2))" result="" color={T.syn_sol} />
              <CalcRow eq="η·v = 5×10⁻³ × 2×10⁻³ = 1×10⁻⁵" result="" color={T.syn_sol} />
              <CalcRow eq="(η·v)^(2/3) = (1×10⁻⁵)^(2/3)" result="4.64 × 10⁻⁴" color={T.syn_sol} />
              <CalcRow eq="γ^(1/6) = (25×10⁻³)^(1/6)" result="0.540" color={T.syn_sol} />
              <CalcRow eq="(ρg)^(1/2) = (900 × 9.81)^(1/2)" result="93.9" color={T.syn_sol} />
              <CalcRow eq="t_wet = 0.94 × 4.64×10⁻⁴ / (0.540 × 93.9)" result="~8.6 μm" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Dry Oxide Thickness:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t_dry ≈ t_wet × (oxide wt fraction) × (ρ_sol/ρ_oxide)" result="" color={T.syn_sol} />
              <CalcRow eq="t_dry ≈ 8.6 μm × 0.03 × (0.9/3.9)" result="~60 nm" color={T.syn_sol} />
            </div>
            <div style={{ background: T.syn_sol + "08", border: `1px solid ${T.syn_sol}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_sol, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The wet film is 8.6 μm thick, but after drying and calcination, only ~60 nm of dense TiO₂ remains — a 99.3% volume reduction! This is typical for sol-gel: most of the coating is solvent. To get a 200 nm coating, you need 3-4 dip cycles. Faster withdrawal (4 mm/s) would give ~110 nm per coat.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: Sol-Gel ZnO Thin Film for Solar Cell Window" color={T.syn_sol} formula="Zinc acetate → ZnO at 500°C">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are making a ZnO window layer for a CdTe solar cell by sol-gel spin coating. The recipe uses zinc acetate dihydrate in 2-methoxyethanol with monoethanolamine (MEA) stabilizer. Calculate the solution concentration needed for a 40 nm film per coat.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Empirical Relation for Sol-Gel Spin Coating:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Spin speed" value="3000 RPM, 30 seconds" />
              <InfoRow label="Target per-coat thickness" value="40 nm" />
              <InfoRow label="Empirical rule" value="t(nm) ≈ K × c(M) at 3000 RPM" />
              <InfoRow label="K for ZnAc/MEE system" value="~130 nm per M" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Required Concentration:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="c = t / K = 40 nm / 130 nm/M" result="0.31 M" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Recipe for 50 mL (0.31 M):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="moles Zn(CH₃COO)₂·2H₂O = 0.31 × 0.050" result="0.0155 mol" color={T.syn_sol} />
              <CalcRow eq="mass = 0.0155 × 219.5 g/mol" result="3.40 g" color={T.syn_sol} />
              <CalcRow eq="MEA (equimolar stabilizer) = 0.0155 mol × 61.08 g/mol" result="0.95 g (0.95 mL)" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Multi-coat Process:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Per-coat thickness" value="~40 nm (after 300°C bake)" />
              <InfoRow label="For 200 nm total ZnO" value="5 coats × (spin + bake 300°C, 10 min)" />
              <InfoRow label="Final anneal" value="500°C, 1 hour in air" />
              <InfoRow label="Result" value="200 nm polycrystalline ZnO, wurtzite phase" />
              <InfoRow label="Resistivity" value="~10⁻² Ω·cm (Al-doped: ~10⁻³)" />
            </div>
            <div style={{ background: T.syn_sol + "08", border: `1px solid ${T.syn_sol}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_sol, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 0.31 M zinc acetate solution gives ~40 nm ZnO per spin coat. Five coats with intermediate bakes build up a 200 nm window layer. Sol-gel ZnO costs ~$0.50/wafer vs ~$50/wafer for sputtered ZnO — 100× cheaper! The trade-off: sol-gel ZnO has higher resistivity and more grain boundaries, but it's perfectly adequate for research-scale solar cells.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ALD SECTION
// ═══════════════════════════════════════════════════════════════════════════
function ALDSection() {
  const [openItem, setOpenItem] = useState("ald_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [aldStep, setAldStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 100); return () => clearInterval(id); }, []);

  const steps = [
    { title: "Pulse A: First Precursor", icon: "1️⃣", color: T.syn_ald,
      analogy: "Like putting glue on a surface — one layer sticks, extra bounces off. Precursor A (e.g., TMA = trimethylaluminum) flows in and reacts with surface -OH groups. Once all sites are occupied, the reaction STOPS — it's self-limiting. This is the magic of ALD." },
    { title: "Purge 1: Remove Excess", icon: "💨", color: T.syn_cvd,
      analogy: "Like clearing the table before the next course. Inert gas (N₂/Ar) flushes out unreacted precursor A and byproducts. If you skip this, precursors A and B meet in the gas phase → CVD contamination → non-uniform film." },
    { title: "Pulse B: Second Precursor", icon: "2️⃣", color: T.syn_hydro,
      analogy: "Like pouring water on the glued surface to set it. Precursor B (e.g., H₂O for oxides, NH₃ for nitrides) reacts with the chemisorbed A layer. Again self-limiting — one monolayer reacts, then stops. This completes one ALD cycle." },
    { title: "Purge 2 → Repeat", icon: "🔄", color: T.syn_main,
      analogy: "Like building a brick wall one layer at a time. Purge again, then repeat from Pulse A. Each cycle deposits exactly ~1 Å (one atomic layer). 100 cycles = 10 nm. Perfect thickness control, perfect conformality." },
  ];

  const step = steps[aldStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is ALD? (Atomic Layer Deposition)" color={T.syn_ald} isOpen={openItem === "ald_what"} onClick={() => toggle("ald_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_ald + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_ald + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🧱</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>The most precise thin-film technique — deposits exactly ONE atomic layer per cycle. ALD alternates between two self-limiting surface reactions. No matter how much precursor you flow, only one monolayer reacts. Repeat 100 times → exactly 10 nm. Used for gate oxides in every modern transistor (HfO₂), barrier layers, and passivation coatings.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_ald, fontWeight: 700 }}>ALD of Al₂O₃ (most common ALD process):</span><br /><br />
          {"  Pulse A:  Al(CH₃)₃ + surface-OH → surface-O-Al(CH₃)₂ + CH₄↑"}<br />
          {"  Purge:    N₂ flush (remove CH₄ and excess TMA)"}<br />
          {"  Pulse B:  H₂O + surface-Al(CH₃)₂ → surface-Al(OH)₂ + 2CH₄↑"}<br />
          {"  Purge:    N₂ flush"}<br /><br />
          {"  Net: 2Al(CH₃)₃ + 3H₂O → Al₂O₃ + 6CH₄"}<br />
          {"  Growth per cycle: ~1.1 Å/cycle at 200°C"}<br />
          {"  Conformality: >99% on 100:1 aspect ratio trenches"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: ALD Cycle Animation (click each half-cycle)" color={T.syn_main} isOpen={openItem === "ald_steps"} onClick={() => toggle("ald_steps")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => setAldStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${aldStep === i ? s.color : T.border}`,
              background: aldStep === i ? s.color + "18" : T.bg, color: aldStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: aldStep === i ? 800 : 400,
            }}>{s.icon}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: step.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${step.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: step.color, marginBottom: 4 }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{step.analogy}</div>
          </div>
        </div>

        <svg width={420} height={220} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={190} rx={6} fill={T.surface} />
          {/* Substrate */}
          <rect x={60} y={160} width={300} height={25} rx={4} fill={T.syn_main + "30"} stroke={T.syn_main} strokeWidth={1.5} />
          <text x={210} y={178} textAnchor="middle" fill={T.syn_main} fontSize={9} fontWeight={700}>Substrate</text>

          {/* Surface OH groups (before pulse A) */}
          {(aldStep === 0) && Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <line x1={85 + i * 35} y1={160} x2={85 + i * 35} y2={148} stroke={T.syn_hydro} strokeWidth={1.5} />
              <circle cx={85 + i * 35} cy={145} r={4} fill={T.syn_hydro + "80"} />
              <text x={85 + i * 35} y={140} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>OH</text>
            </g>
          ))}

          {/* Pulse A: TMA molecules arriving */}
          {aldStep === 0 && Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <circle cx={100 + i * 45} cy={80 + (tick + i * 8) % 50} r={5} fill={T.syn_ald + "90"}>
                <animate attributeName="cy" values={`${60};${140};${140}`} dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
              </circle>
              <text x={100 + i * 45 + 8} y={78 + (tick + i * 8) % 50} fill={T.syn_ald} fontSize={7}>TMA</text>
            </g>
          ))}

          {/* Purge 1 */}
          {aldStep === 1 && <>
            {Array.from({ length: 6 }, (_, i) => (
              <circle key={i} cx={60 + (tick * 3 + i * 50) % 320} cy={100 + 10 * Math.sin(tick * 0.1 + i)} r={3} fill={T.syn_cvd + "60"} />
            ))}
            <text x={210} y={90} textAnchor="middle" fill={T.syn_cvd} fontSize={12} fontWeight={700}>N₂ PURGE →</text>
            {/* Attached Al-CH3 groups */}
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i}>
                <line x1={85 + i * 35} y1={160} x2={85 + i * 35} y2={145} stroke={T.syn_ald} strokeWidth={2} />
                <circle cx={85 + i * 35} cy={142} r={4} fill={T.syn_ald + "80"} />
              </g>
            ))}
          </>}

          {/* Pulse B: H2O */}
          {aldStep === 2 && <>
            {Array.from({ length: 5 }, (_, i) => (
              <circle key={i} cx={90 + i * 50} cy={70 + (tick + i * 6) % 60} r={4} fill={T.syn_hydro + "90"}>
                <animate attributeName="cy" values={`${50};${135};${135}`} dur="1.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
              </circle>
            ))}
            <text x={210} y={45} textAnchor="middle" fill={T.syn_hydro} fontSize={11} fontWeight={700}>H₂O pulse</text>
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i}>
                <line x1={85 + i * 35} y1={160} x2={85 + i * 35} y2={145} stroke={T.syn_ald} strokeWidth={2} />
                <circle cx={85 + i * 35} cy={142} r={4} fill={T.syn_ald + "80"} />
              </g>
            ))}
          </>}

          {/* Complete cycle - new OH surface */}
          {aldStep === 3 && <>
            <text x={210} y={45} textAnchor="middle" fill={T.syn_main} fontSize={12} fontWeight={800}>1 cycle complete → ~1 Å deposited</text>
            <rect x={60} y={152} width={300} height={8} rx={2} fill={T.syn_ald + "50"} stroke={T.syn_ald} strokeWidth={0.5} />
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i}>
                <line x1={85 + i * 35} y1={152} x2={85 + i * 35} y2={140} stroke={T.syn_hydro} strokeWidth={1.5} />
                <circle cx={85 + i * 35} cy={137} r={3} fill={T.syn_hydro + "80"} />
                <text x={85 + i * 35} y={133} textAnchor="middle" fill={T.syn_hydro} fontSize={6}>OH</text>
              </g>
            ))}
            <text x={210} y={120} textAnchor="middle" fill={T.syn_main} fontSize={10}>Ready for next cycle!</text>
          </>}

          <text x={210} y={208} textAnchor="middle" fill={T.muted} fontSize={9} fontWeight={600}>{step.title}</text>
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: ALD in the Lab" color={T.syn_ald} isOpen={openItem === "ald_examples"} onClick={() => toggle("ald_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: ALD Al₂O₃ Thickness from Cycle Count" color={T.syn_ald} formula="t = GPC × N_cycles">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You need to deposit exactly 15 nm of Al₂O₃ by ALD using TMA/H₂O at 200°C for passivating a silicon solar cell (Al₂O₃ rear passivation). Calculate the number of ALD cycles required and the total process time.
            </div>
            <div style={{ background: T.syn_ald + "06", border: `1px solid ${T.syn_ald}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_ald, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ALD is like painting a wall one coat at a time, where each coat is exactly one atom thick. You can't apply half a coat or two coats at once — each cycle adds precisely one layer. So the thickness is simply: (atoms per coat) × (number of coats).</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — ALD Process Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Precursor A" value="TMA (Al(CH₃)₃)" />
              <InfoRow label="Precursor B" value="H₂O" />
              <InfoRow label="Temperature" value="200°C (middle of ALD window)" />
              <InfoRow label="Growth per cycle (GPC)" value="1.1 Å/cycle at 200°C" />
              <InfoRow label="Target thickness" value="15 nm = 150 Å" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Number of Cycles:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="N = t / GPC = 150 Å / 1.1 Å/cycle" result="136 cycles" color={T.syn_ald} />
              <CalcRow eq="Round to nearest integer" result="136 cycles" color={T.syn_ald} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Process Time:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="TMA pulse" value="0.1 s" />
              <InfoRow label="Purge 1" value="4.0 s" />
              <InfoRow label="H₂O pulse" value="0.1 s" />
              <InfoRow label="Purge 2" value="4.0 s" />
              <InfoRow label="Total per cycle" value="8.2 s" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Total time = 136 × 8.2 s" result="1,115 s = 18.6 min" color={T.syn_ald} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Verify Quality:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Expected thickness" value="15.0 ± 0.1 nm (< 1% error!)" />
              <InfoRow label="Uniformity across 300mm wafer" value="< 1% variation" />
              <InfoRow label="Conformality on textured Si" value="> 99% (even in pyramid valleys)" />
              <InfoRow label="Dit (interface defect density)" value="~10¹¹ cm⁻² eV⁻¹ (excellent passivation)" />
            </div>
            <div style={{ background: T.syn_ald + "08", border: `1px solid ${T.syn_ald}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_ald, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>136 ALD cycles in ~19 minutes deposits exactly 15 nm of Al₂O₃ with sub-angstrom precision. This Al₂O₃ layer provides field-effect passivation (fixed negative charges repel electrons from the rear surface) and chemical passivation (saturates Si dangling bonds). It boosted PERC solar cell efficiency from ~20% to ~24% — the single most impactful ALD application in photovoltaics.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: ALD Window — GPC vs Temperature" color={T.syn_ald} formula="Growth per cycle as function of T">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You ran ALD Al₂O₃ (TMA/H₂O) at five different temperatures and measured the growth per cycle. Identify the ALD window and explain the deviations outside it.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Measured GPC Data:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="100°C" value="GPC = 1.8 Å/cycle (too high!)" />
              <InfoRow label="150°C" value="GPC = 1.2 Å/cycle (slightly above)" />
              <InfoRow label="200°C" value="GPC = 1.1 Å/cycle (ALD window)" />
              <InfoRow label="250°C" value="GPC = 1.1 Å/cycle (ALD window)" />
              <InfoRow label="350°C" value="GPC = 0.7 Å/cycle (too low!)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Identify the ALD Window:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="ALD window" value="175–300°C (constant GPC = 1.1 Å)" />
              <InfoRow label="Below window (100°C)" value="TMA condenses on surface → extra material" />
              <InfoRow label="Above window (350°C)" value="TMA decomposes in gas phase → CVD mode" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Why This Matters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="At 100°C" value="Film is 64% too thick! Not self-limiting." />
              <InfoRow label="At 200°C" value="Perfect self-limiting. Same 1.1 Å everywhere." />
              <InfoRow label="At 350°C" value="TMA cracks → parasitic CVD. 36% less per cycle." />
              <InfoRow label="Practical rule" value="Always run in ALD window for reliable thickness" />
            </div>
            <div style={{ background: T.syn_ald + "08", border: `1px solid ${T.syn_ald}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_ald, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The ALD window for TMA/H₂O is 175-300°C. Within this range, GPC is constant at 1.1 Å because reactions are truly self-limiting. Outside the window, the process breaks down: condensation at low T, decomposition at high T. Every ALD process has its own window — HfO₂ (HfCl₄/H₂O) is 200-350°C, TiO₂ (TDMAT/H₂O) is 100-250°C. Always verify your process is in the window!</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: ALD Conformality in High-Aspect-Ratio Trench" color={T.syn_ald} formula="Step coverage = t_bottom / t_top × 100%">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You deposited 20 nm Al₂O₃ by ALD into a trench with 50:1 aspect ratio (5 μm deep, 100 nm wide). You cross-section the sample for TEM. Calculate the expected step coverage and compare with CVD and PVD.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Trench Geometry:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Trench width" value="100 nm" />
              <InfoRow label="Trench depth" value="5 μm = 5000 nm" />
              <InfoRow label="Aspect ratio" value="50:1" />
              <InfoRow label="Target Al₂O₃ thickness" value="20 nm" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Measured Thickness at Different Positions:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Top of trench" value="20.0 nm" />
              <InfoRow label="Middle (2.5 μm deep)" value="19.8 nm" />
              <InfoRow label="Bottom (5 μm deep)" value="19.5 nm" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Step Coverage Comparison:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="ALD step coverage = 19.5/20.0 × 100%" result="97.5%" color={T.syn_ald} />
              <CalcRow eq="LPCVD (same trench)" result="~70%" color={T.syn_main} />
              <CalcRow eq="PVD sputtering (same trench)" result="~5%" color={T.syn_pvd} />
              <CalcRow eq="Thermal evaporation (same trench)" result="~0% (no bottom coverage)" color={T.syn_sol} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Why ALD Wins:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="ALD mechanism" value="Self-limiting → every surface site reacts equally" />
              <InfoRow label="Remaining gap after ALD" value="100 - 2×20 = 60 nm (still open!)" />
              <InfoRow label="Application" value="DRAM capacitor dielectric (50:1+ trenches)" />
              <InfoRow label="Why not CVD?" value="CVD pinches off the top before filling bottom" />
            </div>
            <div style={{ background: T.syn_ald + "08", border: `1px solid ${T.syn_ald}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_ald, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ALD achieves 97.5% step coverage in a 50:1 trench — nearly perfect. This is impossible with PVD (line-of-sight) or even CVD (preferential top deposition). Every modern DRAM chip uses ALD to coat capacitor trenches with HfO₂/ZrO₂ dielectrics. Without ALD conformality, we couldn't build memory chips beyond ~20 nm node.</div>
            </div>
          </Card>

          <Card title="Numerical Example 4: ALD HfO₂ Gate Oxide — EOT Calculation" color={T.syn_ald} formula="EOT = t_HfO₂ × (k_SiO₂ / k_HfO₂)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> Intel replaced SiO₂ gate oxide with ALD HfO₂ at the 45 nm node. You need to deposit HfO₂ with an equivalent oxide thickness (EOT) of 0.9 nm. Calculate the physical HfO₂ thickness needed and verify the leakage current improvement.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Material Properties:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="SiO₂ dielectric constant" value="k(SiO₂) = 3.9" />
              <InfoRow label="HfO₂ dielectric constant" value="k(HfO₂) = 25" />
              <InfoRow label="Target EOT" value="0.9 nm" />
              <InfoRow label="ALD precursors" value="HfCl₄ + H₂O at 300°C" />
              <InfoRow label="GPC for HfO₂" value="0.9 Å/cycle" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Physical Thickness:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="EOT = t_phys × (k_SiO₂ / k_HfO₂)" result="" color={T.syn_ald} />
              <CalcRow eq="t_phys = EOT × (k_HfO₂ / k_SiO₂)" result="" color={T.syn_ald} />
              <CalcRow eq="t_phys = 0.9 nm × (25 / 3.9)" result="5.8 nm" color={T.syn_ald} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — ALD Cycles Needed:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="N = 5.8 nm / 0.09 nm/cycle" result="64 cycles" color={T.syn_ald} />
              <CalcRow eq="Process time ≈ 64 × 10 s/cycle" result="~10.7 min" color={T.syn_ald} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Leakage Current Improvement:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="SiO₂ at 0.9 nm EOT (physical)" value="0.9 nm → tunnel leakage ~100 A/cm²" />
              <InfoRow label="HfO₂ at 0.9 nm EOT (5.8 nm physical)" value="Leakage ~0.01 A/cm²" />
              <InfoRow label="Reduction factor" value="~10,000× less leakage!" />
              <InfoRow label="Power savings" value="Critical for mobile processors" />
            </div>
            <div style={{ background: T.syn_ald + "08", border: `1px solid ${T.syn_ald}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_ald, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>A 5.8 nm HfO₂ film (64 ALD cycles) gives the same capacitance as 0.9 nm SiO₂ but is physically 6.4× thicker — thick enough to block quantum tunneling. This reduced gate leakage by 10,000×, enabling modern low-power processors. Only ALD could deposit this film with the required thickness control (±0.1 nm) and conformality over billions of transistors per chip.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MBE SECTION
// ═══════════════════════════════════════════════════════════════════════════
function MBESection() {
  const [openItem, setOpenItem] = useState("mbe_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 100); return () => clearInterval(id); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is MBE? (Molecular Beam Epitaxy)" color={T.syn_mbe} isOpen={openItem === "mbe_what"} onClick={() => toggle("mbe_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_mbe + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_mbe + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🔬</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>The Rolls-Royce of thin-film deposition. Ultra-high vacuum (10⁻¹⁰ Torr), molecular beams of pure elements directed at a heated crystal substrate. Atoms land one at a time in perfect registry with the substrate lattice. Used for quantum wells, superlattices, 2D electron gases, and the highest-quality semiconductor heterostructures.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_mbe, fontWeight: 700 }}>MBE characteristics:</span><br />
          {"  Vacuum:     10⁻¹⁰ - 10⁻⁹ Torr (ultra-high vacuum)"}<br />
          {"  Growth rate: 0.1 - 1 monolayer/sec (~0.3-3 Å/s)"}<br />
          {"  Substrate T: 400-700°C (material dependent)"}<br />
          {"  Sources:     Knudsen effusion cells (heated crucibles)"}<br />
          {"  Monitoring:  RHEED (real-time surface diffraction)"}<br /><br />
          {"  Advantages:  atomic-level control, abrupt interfaces, in-situ RHEED"}<br />
          {"  Disadvantages: slow, expensive, small wafers (2-4 inch)"}<br /><br />
          {"  Key products: GaAs/AlGaAs quantum wells, InGaAs HEMTs,"}<br />
          {"               HgCdTe IR detectors, topological insulator films"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Animated: MBE Growth Chamber" color={T.syn_main} isOpen={openItem === "mbe_anim"} onClick={() => toggle("mbe_anim")}>
        <svg width={420} height={280} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={250} rx={6} fill={T.surface} />
          <text x={210} y={35} textAnchor="middle" fill={T.syn_mbe} fontSize={11} fontWeight={700}>MBE Growth Chamber (UHV: 10⁻¹⁰ Torr)</text>

          {/* Substrate at top (inverted geometry) */}
          <rect x={140} y={50} width={140} height={15} rx={3} fill={T.syn_main + "40"} stroke={T.syn_main} strokeWidth={1.5} />
          <text x={210} y={60} textAnchor="middle" fill={T.syn_main} fontSize={8} fontWeight={700}>Substrate (600°C)</text>
          {/* Growing film */}
          <rect x={140} y={65} width={140} height={5} rx={2} fill={T.syn_mbe + "60"}>
            <animate attributeName="height" values="3;6;3" dur="3s" repeatCount="indefinite" />
          </rect>

          {/* Effusion cells (Knudsen cells) */}
          {[
            { x: 50, label: "Ga", color: T.syn_cvd },
            { x: 150, label: "As", color: T.syn_ald },
            { x: 260, label: "Al", color: T.syn_pvd },
            { x: 350, label: "In", color: T.syn_sol },
          ].map((cell, ci) => (
            <g key={ci}>
              <rect x={cell.x - 15} y={200} width={30} height={40} rx={4} fill={cell.color + "20"} stroke={cell.color} strokeWidth={1.5} />
              <text x={cell.x} y={225} textAnchor="middle" fill={cell.color} fontSize={10} fontWeight={700}>{cell.label}</text>
              {/* Molecular beams */}
              {Array.from({ length: 3 }, (_, i) => (
                <circle key={i} cx={cell.x + (210 - cell.x) * ((tick * 2 + i * 20 + ci * 15) % 100) / 100} cy={200 - ((tick * 2 + i * 20 + ci * 15) % 100) / 100 * 130} r={2.5} fill={cell.color + "cc"} />
              ))}
            </g>
          ))}

          {/* RHEED */}
          <line x1={30} y1={70} x2={140} y2={68} stroke={T.syn_mbe} strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={30} y={85} fill={T.syn_mbe} fontSize={8} fontWeight={700}>RHEED</text>
          <rect x={350} y={55} width={40} height={30} rx={3} fill={T.syn_mbe + "15"} stroke={T.syn_mbe} strokeWidth={1} />
          <text x={370} y={73} textAnchor="middle" fill={T.syn_mbe} fontSize={7}>Screen</text>

          {/* Shutters */}
          {[50, 150, 260, 350].map((x, i) => (
            <rect key={i} x={x - 12} y={193} width={24} height={4} rx={1} fill={i % 2 === tick % 4 ? T.syn_main : T.muted} stroke={T.ink + "30"} strokeWidth={0.5} />
          ))}

          <text x={210} y={260} textAnchor="middle" fill={T.muted} fontSize={9}>Shutters control which beams reach substrate — monolayer control</text>
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: MBE in the Lab" color={T.syn_mbe} isOpen={openItem === "mbe_examples"} onClick={() => toggle("mbe_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: Effusion Cell Flux — Knudsen Equation" color={T.syn_mbe} formula="J = P/(2πmkT)^½ × cos(θ)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are growing GaAs by MBE. The Ga effusion cell is at 950°C. Calculate the Ga beam flux at the substrate (30 cm away) and the resulting growth rate assuming As overpressure (Ga-limited regime).
            </div>
            <div style={{ background: T.syn_mbe + "06", border: `1px solid ${T.syn_mbe}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_mbe, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>An effusion cell is like a tiny furnace with a small opening. Atoms escape through the opening one by one, forming a molecular "beam." The flux depends exponentially on temperature (vapor pressure) and falls off as 1/r² with distance — like light from a flashlight.</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Ga Vapor Pressure at 950°C:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Ga cell temperature" value="950°C = 1223 K" />
              <InfoRow label="Ga vapor pressure at 1223 K" value="P ≈ 3.5 × 10⁻³ Torr" />
              <InfoRow label="Cell orifice area" value="A = 5 cm² (2.5 cm diameter)" />
              <InfoRow label="Source-substrate distance" value="r = 30 cm" />
              <InfoRow label="Ga atomic mass" value="69.72 amu" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Beam Equivalent Pressure (BEP) at Substrate:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Flux from cell: J = P·A / (2πmkT)^½" result="" color={T.syn_mbe} />
              <CalcRow eq="Total Ga atoms/sec from cell" result="~1.2 × 10¹⁶ atoms/s" color={T.syn_mbe} />
              <CalcRow eq="At substrate (cosine distribution, r=30cm)" result="" color={T.syn_mbe} />
              <CalcRow eq="Flux at substrate center" result="~6.3 × 10¹⁴ atoms/cm²·s" color={T.syn_mbe} />
              <CalcRow eq="BEP (ion gauge reading)" result="~1.5 × 10⁻⁶ Torr" color={T.syn_mbe} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Growth Rate:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="GaAs(100) surface density" result="6.26 × 10¹⁴ atoms/cm²" color={T.syn_mbe} />
              <CalcRow eq="Monolayers/sec = 6.3×10¹⁴ / 6.26×10¹⁴" result="~1.0 ML/s" color={T.syn_mbe} />
              <CalcRow eq="1 monolayer GaAs(100) = 2.83 Å" result="" color={T.syn_mbe} />
              <CalcRow eq="Growth rate = 1.0 × 2.83 Å/s" result="2.83 Å/s ≈ 1.0 μm/hr" color={T.syn_mbe} />
            </div>
            <div style={{ background: T.syn_mbe + "08", border: `1px solid ${T.syn_mbe}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_mbe, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At a Ga cell temperature of 950°C, GaAs grows at ~1 ML/s (1.0 μm/hr). This is 10-100× slower than CVD — but the crystalline perfection is unmatched. In MBE, you control the flux by adjusting cell temperature: +20°C roughly doubles the rate (exponential dependence on T). The As cell is kept in overpressure (BEP ratio As/Ga ~15-20) so growth is entirely controlled by the Ga flux.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: RHEED Oscillations — Real-Time Growth Monitoring" color={T.syn_mbe} formula="1 oscillation = 1 monolayer = 2.83 Å for GaAs(100)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> During GaAs MBE growth, you observe RHEED intensity oscillations. The oscillation period is 1.05 seconds. Calculate the growth rate and verify against the ion gauge BEP measurement.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — RHEED Oscillation Data:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="RHEED oscillation period" value="T = 1.05 s per oscillation" />
              <InfoRow label="Number of oscillations observed" value="50 clear oscillations" />
              <InfoRow label="Total time for 50 oscillations" value="52.5 s" />
              <InfoRow label="GaAs(100) monolayer thickness" value="a/2 = 5.653/2 = 2.827 Å" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Growth Rate from RHEED:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Rate = 1 ML per 1.05 s = 0.952 ML/s" result="" color={T.syn_mbe} />
              <CalcRow eq="= 0.952 × 2.827 Å/s" result="2.69 Å/s" color={T.syn_mbe} />
              <CalcRow eq="= 2.69 × 3600 / 10000 μm/hr" result="0.97 μm/hr" color={T.syn_mbe} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Cross-Check with BEP:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Ga BEP measured" value="1.4 × 10⁻⁶ Torr" />
              <InfoRow label="Expected rate from BEP" value="~0.95 μm/hr" />
              <InfoRow label="RHEED measurement" value="0.97 μm/hr" />
              <InfoRow label="Agreement" value="Within 2% — excellent!" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Using RHEED for Quantum Well Thickness:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Target: 10 nm GaAs quantum well" value="= 35.4 monolayers" />
              <InfoRow label="Count RHEED oscillations" value="Stop at exactly 35 oscillations" />
              <InfoRow label="Close Ga shutter" value="Film = 35 × 2.83 Å = 9.9 nm" />
              <InfoRow label="Precision" value="±1 monolayer = ±0.3 nm" />
            </div>
            <div style={{ background: T.syn_mbe + "08", border: `1px solid ${T.syn_mbe}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_mbe, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>RHEED oscillations give you real-time, monolayer-precise growth rate measurement — like having a speedometer while driving. Each oscillation = one complete monolayer. By counting oscillations, you can grow quantum wells to ±1 monolayer precision. This is how researchers grow GaAs/AlGaAs quantum well structures for high-efficiency multi-junction solar cells and laser diodes.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: AlGaAs/GaAs Quantum Well Energy Levels" color={T.syn_mbe} formula="E_n = n²π²ℏ² / (2m*L²)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You grew a GaAs quantum well (L = 8 nm) sandwiched between Al₀.₃Ga₀.₇As barriers by MBE. Calculate the confinement energy of the first electron level and the expected PL emission wavelength.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Material Parameters:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="GaAs bandgap" value="Eg = 1.424 eV at 300 K" />
              <InfoRow label="Al₀.₃Ga₀.₇As bandgap" value="Eg = 1.798 eV" />
              <InfoRow label="Conduction band offset" value="ΔEc = 0.65 × ΔEg = 0.243 eV" />
              <InfoRow label="Electron effective mass (GaAs)" value="m*e = 0.067 m₀" />
              <InfoRow label="Heavy hole effective mass" value="m*hh = 0.45 m₀" />
              <InfoRow label="Well width" value="L = 8 nm" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Electron Confinement Energy (infinite well approximation):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="E₁ = π²ℏ² / (2m*eL²)" result="" color={T.syn_mbe} />
              <CalcRow eq="ℏ² = (1.055×10⁻³⁴)² = 1.113 × 10⁻⁶⁸ J²·s²" result="" color={T.syn_mbe} />
              <CalcRow eq="2m*eL² = 2 × 0.067 × 9.109×10⁻³¹ × (8×10⁻⁹)²" result="" color={T.syn_mbe} />
              <CalcRow eq="= 2 × 6.103×10⁻³² × 6.4×10⁻¹⁷" result="7.81 × 10⁻⁴⁸" color={T.syn_mbe} />
              <CalcRow eq="E₁(e) = 9.87 × 1.113×10⁻⁶⁸ / 7.81×10⁻⁴⁸" result="0.047 eV" color={T.syn_mbe} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Heavy Hole Confinement:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="E₁(hh) = E₁(e) × (m*e / m*hh)" result="" color={T.syn_mbe} />
              <CalcRow eq="E₁(hh) = 0.047 × (0.067 / 0.45)" result="0.007 eV" color={T.syn_mbe} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — PL Emission Energy and Wavelength:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="E_PL = Eg + E₁(e) + E₁(hh)" result="" color={T.syn_mbe} />
              <CalcRow eq="= 1.424 + 0.047 + 0.007" result="1.478 eV" color={T.syn_mbe} />
              <CalcRow eq="λ = 1240 / E(eV) = 1240 / 1.478" result="839 nm (near-IR)" color={T.syn_mbe} />
            </div>
            <div style={{ background: T.syn_mbe + "08", border: `1px solid ${T.syn_mbe}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_mbe, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>The 8 nm GaAs quantum well emits at 839 nm — blue-shifted from bulk GaAs (870 nm) due to quantum confinement. By changing the well width, you tune the emission: 5 nm well → 810 nm, 15 nm well → 860 nm. This is the foundation of III-V quantum well lasers and multi-junction solar cells, where MBE's monolayer precision directly controls the bandgap engineering.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPIN COATING SECTION
// ═══════════════════════════════════════════════════════════════════════════
function SpinCoatingSection() {
  const [openItem, setOpenItem] = useState("sc_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [rpm, setRpm] = useState(3000);
  const [visc, setVisc] = useState(10);
  const [conc, setConc] = useState(5);
  const [scStep, setScStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const thickness = 100 * Math.sqrt(visc / rpm) * conc / 5;

  const scSteps = [
    { title: "Step 1: Dispense Solution", icon: "💧", color: T.syn_spin,
      analogy: "Like pouring pancake batter onto the center of a pan. A small volume (20-100 μL) of precursor solution is pipetted onto the center of the substrate. The amount must be enough to cover the surface when spread, but not so much that it flies off the edge." },
    { title: "Step 2: Spin-Up (Acceleration)", icon: "🌀", color: T.syn_sol,
      analogy: "Like a figure skater starting to spin — the solution begins to spread outward. The substrate accelerates to the target RPM (typically 1000-6000 RPM) in 1-3 seconds. Centrifugal force pushes solution radially outward, rapidly thinning the film." },
    { title: "Step 3: Steady-State Thinning", icon: "🎯", color: T.syn_main,
      analogy: "Like wringing water from a towel — the film gets progressively thinner. At constant RPM, viscous flow and solvent evaporation work together. The film thins as t ∝ 1/√ω. Most excess material is flung off the edge within the first 10 seconds." },
    { title: "Step 4: Edge Bead & Drying", icon: "🔥", color: T.syn_cvd,
      analogy: "Like a pizza crust being thicker at the rim. Surface tension at the substrate edge creates an 'edge bead' — a ring of thicker film 2-5 mm wide. Meanwhile, solvent evaporates, leaving behind a solid thin film. The final thickness is typically 10-1000 nm." },
  ];

  const scStep_ = scSteps[scStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is Spin Coating?" color={T.syn_spin} isOpen={openItem === "sc_what"} onClick={() => toggle("sc_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_spin + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_spin + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🌀</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>The simplest thin-film method: drop solution on substrate, spin fast, centrifugal force spreads it into a uniform thin film. The final thickness depends on spin speed, solution viscosity, and concentration. Used everywhere: photoresist in lithography, perovskite solar cells, organic electronics, sol-gel coatings. Cost: ~$5,000 for a spin coater vs ~$1M for a CVD system.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_spin, fontWeight: 700 }}>Film thickness formula (empirical):</span><br />
          {"  t ∝ η^(1/2) · ω^(-1/2) · c"}<br /><br />
          {"  t = film thickness (nm)"}<br />
          {"  η = solution viscosity (cP)"}<br />
          {"  ω = spin speed (RPM)"}<br />
          {"  c = solute concentration (wt%)"}<br /><br />
          {"  Higher RPM → thinner film"}<br />
          {"  Higher viscosity → thicker film"}<br />
          {"  Higher concentration → thicker film"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step Spin Coating Process" color={T.syn_main} isOpen={openItem === "sc_anim"} onClick={() => toggle("sc_anim")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {scSteps.map((s, i) => (
            <button key={i} onClick={() => setScStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${scStep === i ? s.color : T.border}`,
              background: scStep === i ? s.color + "18" : T.bg, color: scStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: scStep === i ? 800 : 400,
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: scStep_.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${scStep_.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{scStep_.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: scStep_.color, marginBottom: 4 }}>{scStep_.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{scStep_.analogy}</div>
          </div>
        </div>

        <svg width={420} height={260} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={230} rx={6} fill={T.surface} />

          {/* Step 1: Dispense Solution */}
          {scStep === 0 && <>
            {/* Substrate */}
            <rect x={120} y={180} width={180} height={20} rx={4} fill={T.syn_sol+"40"} stroke={T.syn_sol} strokeWidth={1.5}/>
            <text x={210} y={194} textAnchor="middle" fill={T.syn_sol} fontSize={9} fontWeight={700}>Substrate</text>
            {/* Pipette */}
            <rect x={205} y={30} width={10} height={80} rx={3} fill={T.syn_spin+"30"} stroke={T.syn_spin} strokeWidth={1.5}/>
            <rect x={200} y={25} width={20} height={12} rx={3} fill={T.syn_spin+"50"} stroke={T.syn_spin} strokeWidth={1}/>
            <text x={210} y={22} textAnchor="middle" fill={T.syn_spin} fontSize={8} fontWeight={700}>Pipette</text>
            {/* Falling droplet */}
            <ellipse cx={210} cy={Math.min(115 + (tick * 2) % 65, 175)} rx={6} ry={8} fill={T.syn_spin+"70"}/>
            {/* Solution pool growing on substrate */}
            <ellipse cx={210} cy={178} rx={Math.min(tick * 0.8, 50)} ry={Math.min(tick * 0.15, 8)} fill={T.syn_spin+"35"}/>
            <text x={210} y={225} textAnchor="middle" fill={T.syn_spin} fontSize={10} fontWeight={700}>Dispense 20-100 μL onto center</text>
          </>}

          {/* Step 2: Spin-Up */}
          {scStep === 1 && <>
            {/* Substrate spinning */}
            <ellipse cx={210} cy={150} rx={90+Math.sin(tick*0.15)*5} ry={22} fill={T.syn_sol+"20"} stroke={T.syn_sol} strokeWidth={1.5}/>
            <ellipse cx={210} cy={150} rx={55} ry={14} fill={T.syn_sol+"30"}/>
            <ellipse cx={210} cy={150} rx={20} ry={5} fill={T.syn_sol+"45"}/>
            {/* Spinning arm indicator */}
            <line x1={210} y1={150} x2={210+Math.cos(tick*0.3)*80} y2={150+Math.sin(tick*0.3)*20} stroke={T.syn_spin} strokeWidth={2.5} strokeLinecap="round"/>
            {/* Solution spreading outward */}
            {Array.from({length:6},(_,i)=>{
              const angle = tick*0.3 + i*Math.PI/3;
              const r = 30 + (tick*0.5+i*8)%60;
              return <circle key={i} cx={210+Math.cos(angle)*r} cy={150+Math.sin(angle)*r*0.25} r={3-r*0.02} fill={T.syn_spin+"60"}/>;
            })}
            {/* RPM indicator */}
            <text x={210} y={60} textAnchor="middle" fill={T.syn_spin} fontSize={16} fontWeight={800}>↻ Accelerating</text>
            <text x={210} y={80} textAnchor="middle" fill={T.muted} fontSize={10}>0 → 4000 RPM in 2 seconds</text>
            {/* Arrows showing outward flow */}
            {Array.from({length:4},(_,i)=>{
              const angle = i*Math.PI/2;
              return <line key={i+6} x1={210+Math.cos(angle)*35} y1={150+Math.sin(angle)*9} x2={210+Math.cos(angle)*(60+Math.sin(tick*0.2)*8)} y2={150+Math.sin(angle)*(15+Math.sin(tick*0.2)*2)} stroke={T.syn_spin+"60"} strokeWidth={2} markerEnd="url(#arr)"/>;
            })}
            <text x={210} y={225} textAnchor="middle" fill={T.syn_sol} fontSize={10} fontWeight={700}>Centrifugal force spreads solution outward</text>
          </>}

          {/* Step 3: Steady-State Thinning */}
          {scStep === 2 && <>
            {/* Substrate */}
            <ellipse cx={210} cy={155} rx={95} ry={24} fill={T.syn_sol+"15"} stroke={T.syn_sol} strokeWidth={1.5}/>
            {/* Thin film on substrate */}
            <ellipse cx={210} cy={153} rx={90} ry={22} fill={T.syn_spin+"20"}/>
            {/* Fast spinning arm */}
            <line x1={210} y1={155} x2={210+Math.cos(tick*0.5)*85} y2={155+Math.sin(tick*0.5)*21} stroke={T.syn_main} strokeWidth={2} strokeLinecap="round"/>
            <line x1={210} y1={155} x2={210+Math.cos(tick*0.5+Math.PI)*85} y2={155+Math.sin(tick*0.5+Math.PI)*21} stroke={T.syn_main+"60"} strokeWidth={1.5} strokeLinecap="round"/>
            {/* Excess droplets flying off edge */}
            {Array.from({length:5},(_,i)=>{
              const phase = tick*0.15+i*1.2;
              const r = 95+(tick*1.2+i*20)%60;
              return <circle key={i} cx={210+Math.cos(phase)*r} cy={155+Math.sin(phase)*r*0.25} r={2} fill={T.syn_spin+"50"} opacity={Math.max(0, 1-r/150)}/>;
            })}
            {/* Evaporation arrows */}
            {Array.from({length:6},(_,i)=><line key={i+5} x1={140+i*28} y1={145} x2={140+i*28+Math.sin(tick*0.1+i)*3} y2={120-Math.sin(tick*0.08+i)*8} stroke={T.syn_cvd+"35"} strokeWidth={1.5} strokeDasharray="3,3"/>)}
            <text x={210} y={55} textAnchor="middle" fill={T.syn_main} fontSize={14} fontWeight={800}>4000 RPM — Steady State</text>
            <text x={210} y={75} textAnchor="middle" fill={T.muted} fontSize={10}>t ∝ 1/√ω — film thinning</text>
            <text x={210} y={95} textAnchor="middle" fill={T.syn_cvd} fontSize={9}>↑ solvent evaporating</text>
            <text x={210} y={225} textAnchor="middle" fill={T.syn_main} fontSize={10} fontWeight={700}>Viscous flow + evaporation thin the film</text>
          </>}

          {/* Step 4: Edge Bead & Drying */}
          {scStep === 3 && <>
            {/* Substrate */}
            <rect x={80} y={145} width={260} height={20} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
            <text x={210} y={159} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Substrate</text>
            {/* Uniform thin film */}
            <rect x={100} y={139} width={220} height={6} rx={2} fill={T.syn_spin+"40"}/>
            {/* Edge beads — thicker at edges */}
            <rect x={80} y={133} width={20} height={12} rx={3} fill={T.syn_spin+"65"} stroke={T.syn_spin} strokeWidth={0.5}/>
            <rect x={320} y={133} width={20} height={12} rx={3} fill={T.syn_spin+"65"} stroke={T.syn_spin} strokeWidth={0.5}/>
            {/* Edge bead labels */}
            <text x={90} y={125} textAnchor="middle" fill={T.syn_cvd} fontSize={7} fontWeight={700}>Edge bead</text>
            <text x={330} y={125} textAnchor="middle" fill={T.syn_cvd} fontSize={7} fontWeight={700}>Edge bead</text>
            {/* Arrows pointing to edge beads */}
            <line x1={90} y1={127} x2={90} y2={133} stroke={T.syn_cvd} strokeWidth={1}/>
            <line x1={330} y1={127} x2={330} y2={133} stroke={T.syn_cvd} strokeWidth={1}/>
            {/* Evaporation wavy lines */}
            {Array.from({length:8},(_,i)=><line key={i} x1={120+i*25} y1={135} x2={120+i*25+Math.sin(tick*0.12+i)*4} y2={100-Math.sin(tick*0.1+i)*12} stroke={T.syn_cvd+"30"} strokeWidth={1.5} strokeDasharray="4,3"/>)}
            {/* Film thickness annotation */}
            <line x1={150} y1={139} x2={150} y2={145} stroke={T.syn_spin} strokeWidth={1.5}/>
            <text x={155} y={144} fill={T.syn_spin} fontSize={7} fontWeight={700}>~500 nm</text>
            {/* Heat from below */}
            {Array.from({length:5},(_,i)=><line key={i+8} x1={130+i*40} y1={170} x2={130+i*40+Math.sin(tick*0.15+i)*5} y2={185+Math.sin(tick*0.1+i)*8} stroke={T.syn_ald+"40"} strokeWidth={2} strokeLinecap="round"/>)}
            <text x={210} y={55} textAnchor="middle" fill={T.syn_cvd} fontSize={13} fontWeight={800}>Drying & Solidification</text>
            <text x={210} y={75} textAnchor="middle" fill={T.muted} fontSize={10}>Solvent evaporates → solid thin film</text>
            <text x={210} y={205} textAnchor="middle" fill={T.syn_ald} fontSize={9}>Hotplate anneal (80-150°C)</text>
            <text x={210} y={225} textAnchor="middle" fill={T.syn_spin} fontSize={10} fontWeight={700}>Uniform film with edge bead at rim</text>
          </>}
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Spin Coating Thickness Calculator" color={T.syn_main} isOpen={openItem === "sc_calc"} onClick={() => toggle("sc_calc")}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <SliderRow label="Spin speed" value={rpm} min={500} max={8000} step={100} onChange={setRpm} color={T.syn_spin} unit=" RPM" format={v => v.toFixed(0)} />
            <SliderRow label="Viscosity" value={visc} min={1} max={100} step={1} onChange={setVisc} color={T.syn_sol} unit=" cP" format={v => v.toFixed(0)} />
            <SliderRow label="Concentration" value={conc} min={0.5} max={20} step={0.5} onChange={setConc} color={T.syn_cvd} unit=" wt%" />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <ResultBox label="Film thickness" value={thickness.toFixed(0)} color={T.syn_spin} sub="nm (approx)" />
              <ResultBox label="Regime" value={rpm < 2000 ? "Slow" : rpm < 5000 ? "Normal" : "Fast"} color={T.syn_main} sub={`${rpm} RPM`} />
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.6, background: T.syn_spin + "08", borderRadius: 8, padding: "8px 12px" }}>
              {thickness < 50 && <span style={{ color: T.syn_cvd, fontWeight: 700 }}>Very thin — may have pinholes. Consider multi-coat.</span>}
              {thickness >= 50 && thickness < 200 && <span>Good range for most applications (sol-gel, perovskite).</span>}
              {thickness >= 200 && <span style={{ color: T.syn_sol }}>Thick film — may crack during drying. Reduce concentration or increase RPM.</span>}
            </div>
          </div>
        </div>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: Spin Coating in the Lab" color={T.syn_spin} isOpen={openItem === "sc_examples"} onClick={() => toggle("sc_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: Perovskite Film Thickness Optimization" color={T.syn_spin} formula="t ∝ ω^(-1/2) × c × η^(1/2)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are optimizing MAPbI₃ perovskite spin coating for a solar cell. Your solution is 1.2 M PbI₂ + MAI in DMF:DMSO (4:1). You need 500 nm thickness for optimal absorption. Find the right spin speed.
            </div>
            <div style={{ background: T.syn_spin + "06", border: `1px solid ${T.syn_spin}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_spin, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Spin coating is like spreading pizza dough by spinning it — faster spin means thinner crust. The relationship is roughly t ∝ 1/√ω. So to halve the thickness, you need to spin 4× faster (not 2×). This square-root dependence is key to understanding the process.</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Calibration Data (same solution):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="At 2000 RPM" value="thickness = 720 nm (too thick)" />
              <InfoRow label="At 3000 RPM" value="thickness = 590 nm (close)" />
              <InfoRow label="At 5000 RPM" value="thickness = 450 nm (too thin)" />
              <InfoRow label="Anti-solvent" value="Chlorobenzene at 15 s" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Fit the t ∝ ω^(-1/2) Model:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="t = K / √ω" result="" color={T.syn_spin} />
              <CalcRow eq="From 2000 RPM data: K = 720 × √2000" result="K = 32,200 nm·√RPM" color={T.syn_spin} />
              <CalcRow eq="Check at 5000 RPM: t = 32200/√5000" result="455 nm ✓ (matches 450)" color={T.syn_spin} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Find RPM for 500 nm:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="500 = 32200 / √ω" result="" color={T.syn_spin} />
              <CalcRow eq="√ω = 32200 / 500 = 64.4" result="" color={T.syn_spin} />
              <CalcRow eq="ω = 64.4²" result="4147 RPM → use 4000 RPM" color={T.syn_spin} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Verify and Optimize:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Predicted at 4000 RPM" value="509 nm" />
              <InfoRow label="Measured at 4000 RPM" value="510 ± 15 nm ✓" />
              <InfoRow label="Absorption at 500 nm thickness" value="Absorbs >95% of light above Eg" />
              <InfoRow label="Optimized spin recipe" value="1000 RPM (10s) → 4000 RPM (30s)" />
            </div>
            <div style={{ background: T.syn_spin + "08", border: `1px solid ${T.syn_spin}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_spin, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 4000 RPM, the perovskite film is 510 nm — optimal for absorption without excess recombination in thick films. The t ∝ 1/√ω calibration curve is a powerful tool: once you measure 2-3 points, you can predict the thickness at any spin speed. In practice, the anti-solvent timing (15 s for chlorobenzene) is equally critical for grain size and uniformity.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: Photoresist Coating for Lithography" color={T.syn_spin} formula="Meyerhofer equation: t = kc^β ω^(-1/2)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are spin-coating AZ5214E photoresist for lift-off lithography. The target thickness is 1.4 μm for patterning 100 nm Au contacts. Calculate the required spin speed and determine if the resist profile will work for lift-off.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — AZ5214E Spin Curve Data:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="At 2000 RPM" value="2.0 μm" />
              <InfoRow label="At 3000 RPM" value="1.6 μm" />
              <InfoRow label="At 4000 RPM" value="1.4 μm" />
              <InfoRow label="At 6000 RPM" value="1.1 μm" />
              <InfoRow label="Resist viscosity" value="24 cSt" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Recipe for 1.4 μm:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Spin speed" value="4000 RPM, 30 s" />
              <InfoRow label="Acceleration" value="2000 RPM/s (to 4000 in 2 s)" />
              <InfoRow label="Soft bake" value="90°C, 60 s on hotplate" />
              <InfoRow label="Resist:metal ratio" value="1.4 μm / 0.1 μm = 14:1 (excellent for lift-off)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Edge Bead Calculation:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="Edge bead width ≈ 2-5 mm from edge" result="" color={T.syn_spin} />
              <CalcRow eq="Edge bead height ≈ 2-3× nominal thickness" result="~3.5 μm" color={T.syn_spin} />
              <CalcRow eq="Usable area on 25mm substrate" value="" result="~20 × 20 mm" color={T.syn_spin} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 4 — Lift-off Viability:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Resist thickness" value="1.4 μm" />
              <InfoRow label="Metal thickness" value="100 nm" />
              <InfoRow label="Rule of thumb" value="Resist > 3× metal for clean lift-off" />
              <InfoRow label="Our ratio" value="14:1 → excellent lift-off expected" />
              <InfoRow label="Undercut (image reversal)" value="~0.3 μm with AZ5214E in IR mode" />
            </div>
            <div style={{ background: T.syn_spin + "08", border: `1px solid ${T.syn_spin}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_spin, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 4000 RPM, AZ5214E gives 1.4 μm — 14× thicker than the 100 nm Au to be deposited, ensuring clean lift-off. The edge bead (3.5 μm at wafer edges) can cause focus problems during exposure, so you lose 2-3 mm of usable area per edge. In production, edge bead removal (EBR) nozzles spray solvent on the wafer edge during spinning to eliminate this.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: Multi-Layer Spin Coating — OLED Stack" color={T.syn_spin} formula="Sequential spin coating with orthogonal solvents">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are building a solution-processed OLED by spin coating three layers: PEDOT:PSS (40 nm), emissive polymer (80 nm), and electron injection layer (5 nm). The challenge: each layer must not dissolve the one beneath it.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Layer Stack Design:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Layer 1: PEDOT:PSS" value="40 nm, spin from water at 4000 RPM" />
              <InfoRow label="Bake 1" value="140°C, 10 min (crosslinks, becomes insoluble)" />
              <InfoRow label="Layer 2: MEH-PPV" value="80 nm, spin from toluene at 2000 RPM" />
              <InfoRow label="Why toluene?" value="Doesn't dissolve baked PEDOT:PSS" />
              <InfoRow label="Layer 3: ZnO nanoparticles" value="5 nm, spin from ethanol at 5000 RPM" />
              <InfoRow label="Why ethanol?" value="Doesn't dissolve MEH-PPV (needs toluene/chloroform)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Thickness Calculations:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="PEDOT:PSS: 1.3 wt% in H₂O at 4000 RPM" result="40 nm ✓" color={T.syn_spin} />
              <CalcRow eq="MEH-PPV: 8 mg/mL in toluene at 2000 RPM" result="80 nm ✓" color={T.syn_spin} />
              <CalcRow eq="ZnO NPs: 2 mg/mL in EtOH at 5000 RPM" result="5 nm ✓" color={T.syn_spin} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Solvent Orthogonality Check:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Water on bare ITO" value="Wets — OK for PEDOT:PSS" />
              <InfoRow label="Toluene on baked PEDOT:PSS" value="No dissolution — safe ✓" />
              <InfoRow label="Ethanol on MEH-PPV" value="No dissolution — safe ✓" />
              <InfoRow label="Critical failure mode" value="Chloroform would dissolve BOTH layers below!" />
            </div>
            <div style={{ background: T.syn_spin + "08", border: `1px solid ${T.syn_spin}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_spin, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Multi-layer spin coating requires orthogonal solvents: each new layer's solvent must not dissolve the layer below. Water → toluene → ethanol is a classic orthogonal sequence. The key trick: thermally crosslinking PEDOT:PSS at 140°C makes it insoluble in everything. This orthogonal solvent strategy is how all solution-processed OLEDs and organic solar cells are built.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HYDROTHERMAL SECTION
// ═══════════════════════════════════════════════════════════════════════════
function HydrothermalSection() {
  const [openItem, setOpenItem] = useState("ht_what");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);
  const [htStep, setHtStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

  const htSteps = [
    { title: "Step 1: Prepare Precursor Solution", icon: "🧪", color: T.syn_hydro,
      analogy: "Like making a recipe — dissolve metal salts (Zn(NO₃)₂, TiCl₄, BaCl₂) and mineralizers (NaOH, KOH, HMTA) in water. The solution chemistry (pH, concentration, additives) determines what crystal phase and morphology you get." },
    { title: "Step 2: Seal in Autoclave", icon: "🔒", color: T.syn_sol,
      analogy: "Like a pressure cooker for crystals. The Teflon liner holds the solution, and the stainless steel jacket seals it. Fill to 60-80% capacity — the remaining space allows steam pressure to build. Never overfill — the vessel can rupture at high temperature!" },
    { title: "Step 3: Heat & Pressurize", icon: "🔥", color: T.syn_pvd,
      analogy: "Like cooking in a sealed pot — temperature rises and pressure builds autogenously (from steam). At 200°C, pressure reaches ~16 atm. The superheated water becomes a powerful solvent that dissolves oxides and silicates that normal water cannot." },
    { title: "Step 4: Nucleation & Crystal Growth", icon: "🔮", color: T.syn_main,
      analogy: "Like rock candy forming on a string. As the solution becomes supersaturated, tiny crystal nuclei form. Then atoms add layer by layer to growing crystal faces. Slow growth (hours to days) produces well-faceted, high-quality crystals with few defects." },
    { title: "Step 5: Cool, Wash & Harvest", icon: "✨", color: T.syn_ald,
      analogy: "Like taking bread out of the oven. Cool the autoclave to room temperature (natural cooling or quenching). Open carefully — residual pressure! Wash the crystals (centrifuge, filter) to remove unreacted precursors. Dry at 60-80°C." },
  ];

  const htStep_ = htSteps[htStep];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="What is Hydrothermal Synthesis?" color={T.syn_hydro} isOpen={openItem === "ht_what"} onClick={() => toggle("ht_what")}>
        <div style={{ display: "flex", gap: 10, background: T.syn_hydro + "06", borderRadius: 8, padding: "8px 12px", border: "1px solid " + T.syn_hydro + "12", marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🫧</span>
          <span style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>Nature{"'"}s own crystal growth method — like how quartz crystals form deep underground. Dissolve precursors in water, seal in a high-pressure vessel (autoclave), heat to 100-300°C. The supercritical water dissolves things that normal water can{"'"}t, and crystals grow slowly from solution. Perfect for ZnO nanowires, TiO₂ nanoparticles, and zeolites.</span>
        </div>
        <div style={mb}>
          <span style={{ color: T.syn_hydro, fontWeight: 700 }}>Hydrothermal conditions:</span><br />
          {"  Temperature: 100-300°C (above water boiling point)"}<br />
          {"  Pressure: 1-100 atm (autogenous from sealed vessel)"}<br />
          {"  Time: 2-48 hours (slow crystallization)"}<br />
          {"  Vessel: Teflon-lined stainless steel autoclave"}<br /><br />
          <span style={{ color: T.syn_hydro, fontWeight: 700 }}>Common products:</span><br />
          {"  ZnO nanowires:  Zn(NO₃)₂ + hexamine, 90°C, 4 hrs"}<br />
          {"  TiO₂ nanotubes: TiO₂ powder + 10M NaOH, 150°C, 24 hrs"}<br />
          {"  BaTiO₃:         BaCl₂ + TiO₂ + NaOH, 200°C, 12 hrs"}<br />
          {"  Zeolites:       Na₂SiO₃ + Al₂O₃ + template, 180°C, 48 hrs"}
        </div>
      </FAQAccordion>

      <FAQAccordion title="Interactive: Step-by-Step Hydrothermal Process" color={T.syn_main} isOpen={openItem === "ht_anim"} onClick={() => toggle("ht_anim")}>
        <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
          {htSteps.map((s, i) => (
            <button key={i} onClick={() => setHtStep(i)} style={{
              padding: "5px 10px", borderRadius: 8, border: `2px solid ${htStep === i ? s.color : T.border}`,
              background: htStep === i ? s.color + "18" : T.bg, color: htStep === i ? s.color : T.muted,
              cursor: "pointer", fontSize: 10, fontFamily: "inherit", fontWeight: htStep === i ? 800 : 400,
            }}>{s.icon} {i + 1}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, background: htStep_.color + "08", borderRadius: 10, padding: "10px 14px", border: `1.5px solid ${htStep_.color}20`, marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{htStep_.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: htStep_.color, marginBottom: 4 }}>{htStep_.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: T.ink }}>{htStep_.analogy}</div>
          </div>
        </div>

        <svg width={420} height={260} style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.border}`, display: "block", margin: "0 auto", overflow: "hidden" }}>
          <rect x={15} y={15} width={390} height={230} rx={6} fill={T.surface} />

          {/* Step 1: Precursor Solution */}
          {htStep === 0 && <>
            {/* Beaker */}
            <rect x={140} y={60} width={140} height={140} rx={8} fill={T.syn_hydro+"12"} stroke={T.syn_hydro} strokeWidth={2}/>
            <text x={210} y={55} textAnchor="middle" fill={T.syn_hydro} fontSize={11} fontWeight={700}>Precursor Solution</text>
            {/* Dissolving precursor particles */}
            {Array.from({length:10},(_,i)=>{
              const x = 160+(i%5)*22;
              const y = 90+Math.floor(i/5)*40+Math.sin(tick*0.08+i)*12;
              return <circle key={i} cx={x} cy={y} r={4+Math.sin(tick*0.06+i)*1.5} fill={[T.syn_hydro,T.syn_sol,T.syn_main,T.syn_cvd,T.syn_ald][i%5]+"50"}/>;
            })}
            {/* Stirring bar at bottom */}
            <rect x={185} y={182} width={50} height={8} rx={4} fill={T.muted+"50"} transform={`rotate(${tick*2%360},210,186)`}/>
            {/* Labels */}
            <text x={210} y={215} textAnchor="middle" fill={T.muted} fontSize={9}>Zn(NO₃)₂ + HMTA in H₂O</text>
            <text x={210} y={228} textAnchor="middle" fill={T.syn_hydro} fontSize={9} fontWeight={700}>pH controlled, stirring</text>
          </>}

          {/* Step 2: Seal in Autoclave */}
          {htStep === 1 && <>
            {/* Outer steel jacket */}
            <rect x={120} y={45} width={180} height={170} rx={14} fill={T.muted+"15"} stroke={T.muted} strokeWidth={3}/>
            {/* Inner Teflon liner */}
            <rect x={140} y={60} width={140} height={140} rx={10} fill={T.syn_sol+"12"} stroke={T.syn_sol} strokeWidth={2} strokeDasharray="6,3"/>
            {/* Solution inside */}
            <rect x={145} y={100} width={130} height={95} rx={6} fill={T.syn_hydro+"15"}/>
            {/* Particles in solution */}
            {Array.from({length:8},(_,i)=><circle key={i} cx={160+i*15} cy={130+Math.sin(tick*0.06+i)*20} r={3} fill={T.syn_hydro+"40"}/>)}
            {/* Lid bolting animation */}
            <rect x={125} y={40} width={170} height={18} rx={6} fill={T.muted+"30"} stroke={T.muted} strokeWidth={2}/>
            {/* Bolts */}
            {Array.from({length:4},(_,i)=><circle key={i+8} cx={145+i*42} cy={49} r={5} fill={T.muted+"40"} stroke={T.muted} strokeWidth={1.5}/>)}
            {/* Labels */}
            <text x={210} y={36} textAnchor="middle" fill={T.muted} fontSize={10} fontWeight={700}>Stainless Steel Cap</text>
            <text x={295} y={130} textAnchor="start" fill={T.syn_sol} fontSize={8}>Teflon</text>
            <text x={295} y={142} textAnchor="start" fill={T.syn_sol} fontSize={8}>liner</text>
            <text x={80} y={130} textAnchor="end" fill={T.muted} fontSize={8}>Steel</text>
            <text x={80} y={142} textAnchor="end" fill={T.muted} fontSize={8}>jacket</text>
            <text x={210} y={228} textAnchor="middle" fill={T.syn_sol} fontSize={10} fontWeight={700}>Fill 60-80% — leave room for steam</text>
          </>}

          {/* Step 3: Heat & Pressurize */}
          {htStep === 2 && <>
            {/* Autoclave body */}
            <rect x={140} y={50} width={140} height={145} rx={12} fill={T.syn_pvd+"10"} stroke={T.syn_pvd} strokeWidth={2.5}/>
            <rect x={145} y={55} width={130} height={135} rx={8} fill={T.syn_hydro+"08"}/>
            {/* Bubbling solution */}
            {Array.from({length:12},(_,i)=>{
              const x = 160+(i%4)*28;
              const baseY = 150;
              const y = baseY - (tick*0.8+i*12)%80;
              const opacity = Math.max(0.1, 1 - ((tick*0.8+i*12)%80)/80);
              return <circle key={i} cx={x+Math.sin(tick*0.05+i)*5} cy={y} r={2+Math.sin(tick*0.1+i)} fill={T.syn_hydro+"40"} opacity={opacity}/>;
            })}
            {/* Steam pressure arrows pushing outward */}
            {Array.from({length:6},(_,i)=>{
              const angle = i*Math.PI/3 + tick*0.02;
              const cx = 210, cy = 120;
              const r1 = 35, r2 = 55+Math.sin(tick*0.1+i)*5;
              return <line key={i+12} x1={cx+Math.cos(angle)*r1} y1={cy+Math.sin(angle)*r1*0.7} x2={cx+Math.cos(angle)*r2} y2={cy+Math.sin(angle)*r2*0.7} stroke={T.syn_pvd+"40"} strokeWidth={2} strokeLinecap="round"/>;
            })}
            {/* Heat waves below */}
            {Array.from({length:5},(_,i)=><line key={i+18} x1={155+i*28} y1={200} x2={155+i*28+Math.sin(tick*0.15+i)*5} y2={218+Math.sin(tick*0.1+i)*10} stroke={T.syn_pvd+"50"} strokeWidth={2.5} strokeLinecap="round"/>)}
            {/* Temperature & pressure readout */}
            <text x={210} y={42} textAnchor="middle" fill={T.syn_pvd} fontSize={14} fontWeight={800}>200°C — 16 atm</text>
            <text x={210} y={228} textAnchor="middle" fill={T.syn_pvd} fontSize={10} fontWeight={700}>Superheated water dissolves metal oxides</text>
          </>}

          {/* Step 4: Nucleation & Crystal Growth */}
          {htStep === 3 && <>
            {/* Solution background */}
            <rect x={100} y={45} width={220} height={155} rx={10} fill={T.syn_main+"06"} stroke={T.syn_main} strokeWidth={1.5}/>
            {/* Growing crystals — hexagonal shapes */}
            {Array.from({length:6},(_,i)=>{
              const cx = 130+i*35;
              const cy = 120+Math.sin(i*1.5)*20;
              const sz = Math.min(tick*0.12, 6+i*2);
              const pts = Array.from({length:6},(_,j)=>{
                const angle = j*Math.PI/3 - Math.PI/6;
                return `${cx+Math.cos(angle)*sz},${cy+Math.sin(angle)*sz}`;
              }).join(" ");
              return <polygon key={i} points={pts} fill={T.syn_main+"40"} stroke={T.syn_main} strokeWidth={1}/>;
            })}
            {/* Atoms migrating toward crystals */}
            {Array.from({length:10},(_,i)=>{
              const targetX = 130+(i%6)*35;
              const targetY = 120+Math.sin((i%6)*1.5)*20;
              const startX = 110+i*20;
              const startY = 60+Math.sin(tick*0.08+i)*15;
              const progress = Math.min(1, (tick*0.02+i*0.1)%1.5);
              const x = startX + (targetX-startX)*progress;
              const y = startY + (targetY-startY)*progress;
              return <circle key={i+6} cx={x} cy={y} r={2} fill={T.syn_hydro+"50"} opacity={1-progress*0.6}/>;
            })}
            <text x={210} y={38} textAnchor="middle" fill={T.syn_main} fontSize={12} fontWeight={800}>Crystal Growth — Layer by Layer</text>
            <text x={210} y={215} textAnchor="middle" fill={T.muted} fontSize={9}>Slow growth (2-48 hrs) → well-faceted crystals</text>
            <text x={210} y={228} textAnchor="middle" fill={T.syn_main} fontSize={10} fontWeight={700}>Atoms add to crystal faces from solution</text>
          </>}

          {/* Step 5: Cool, Wash & Harvest */}
          {htStep === 4 && <>
            {/* Cooling autoclave */}
            <rect x={50} y={60} width={100} height={110} rx={10} fill={T.syn_ald+"08"} stroke={T.syn_ald} strokeWidth={1.5}/>
            <text x={100} y={55} textAnchor="middle" fill={T.syn_ald} fontSize={9} fontWeight={700}>Cool Down</text>
            {/* Cooling arrows */}
            {Array.from({length:3},(_,i)=><line key={i} x1={50+i*35+Math.sin(tick*0.12+i)*3} y1={175} x2={50+i*35} y2={185+Math.sin(tick*0.08+i)*8} stroke={T.syn_ald+"40"} strokeWidth={2} strokeLinecap="round" strokeDasharray="3,3"/>)}
            {/* Thermometer dropping */}
            <text x={100} y={125} textAnchor="middle" fill={T.syn_ald} fontSize={10}>{Math.max(25,200-Math.floor(tick*0.8))}°C</text>
            {/* Arrow to washing */}
            <line x1={155} y1={115} x2={185} y2={115} stroke={T.muted} strokeWidth={2} markerEnd="url(#arr)"/>
            {/* Washing — centrifuge tube */}
            <rect x={190} y={70} width={50} height={100} rx={6} fill={T.syn_hydro+"10"} stroke={T.syn_hydro} strokeWidth={1.5}/>
            <text x={215} y={55} textAnchor="middle" fill={T.syn_hydro} fontSize={9} fontWeight={700}>Wash</text>
            {/* Crystals settling in tube */}
            {Array.from({length:5},(_,i)=><circle key={i+3} cx={200+i*8} cy={150-i*3+Math.sin(tick*0.06+i)*3} r={3} fill={T.syn_main+"60"}/>)}
            <text x={215} y={120} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>H₂O wash</text>
            {/* Arrow to harvest */}
            <line x1={245} y1={115} x2={275} y2={115} stroke={T.muted} strokeWidth={2} markerEnd="url(#arr)"/>
            {/* Final crystals */}
            <rect x={280} y={80} width={90} height={80} rx={8} fill={T.syn_main+"08"} stroke={T.syn_main} strokeWidth={1.5}/>
            <text x={325} y={55} textAnchor="middle" fill={T.syn_main} fontSize={9} fontWeight={700}>Harvest</text>
            {Array.from({length:4},(_,i)=>{
              const cx = 300+i*18;
              const cy = 120;
              const sz = 6+Math.sin(tick*0.05+i)*1;
              const pts = Array.from({length:6},(_,j)=>{
                const angle = j*Math.PI/3;
                return `${cx+Math.cos(angle)*sz},${cy+Math.sin(angle)*sz}`;
              }).join(" ");
              return <polygon key={i+8} points={pts} fill={T.syn_main+"50"} stroke={T.syn_main} strokeWidth={1}/>;
            })}
            <text x={325} y={145} textAnchor="middle" fill={T.syn_main} fontSize={8}>Pure crystals</text>
            <text x={210} y={210} textAnchor="middle" fill={T.muted} fontSize={9}>Natural cooling → wash by centrifuge → dry at 60°C</text>
            <text x={210} y={228} textAnchor="middle" fill={T.syn_ald} fontSize={10} fontWeight={700}>High-quality nanocrystals ready for use</text>
          </>}
        </svg>
      </FAQAccordion>

      <FAQAccordion title="Numerical Examples: Hydrothermal in the Lab" color={T.syn_hydro} isOpen={openItem === "ht_examples"} onClick={() => toggle("ht_examples")}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Card title="Numerical Example 1: ZnO Nanowire Growth — Length vs Time" color={T.syn_hydro} formula="L(t) = L_max × (1 − exp(−t/τ))">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are growing ZnO nanowire arrays on FTO glass for a perovskite solar cell electron transport layer. The growth solution is 25 mM Zn(NO₃)₂ + 25 mM hexamethylenetetramine (HMTA) at 90°C. You measure nanowire length at different growth times.
            </div>
            <div style={{ background: T.syn_hydro + "06", border: `1px solid ${T.syn_hydro}18`, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.syn_hydro, marginBottom: 6 }}>Think of it this way:</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Hydrothermal nanowire growth is like growing a garden — fast at first when nutrients are plentiful, then slowing as the solution is depleted. The length follows a saturating exponential: rapid initial growth, then plateau when precursors run out.</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Measured Data:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="1 hour" value="L = 0.4 μm (initial growth)" />
              <InfoRow label="2 hours" value="L = 0.7 μm" />
              <InfoRow label="4 hours" value="L = 1.1 μm (target for solar cell)" />
              <InfoRow label="8 hours" value="L = 1.5 μm (approaching saturation)" />
              <InfoRow label="16 hours" value="L = 1.7 μm (saturated)" />
              <InfoRow label="Nanowire diameter" value="~50 nm (constant, set by seed layer)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Fit Growth Kinetics:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="L(t) = L_max × (1 − exp(−t/τ))" result="" color={T.syn_hydro} />
              <CalcRow eq="From saturation: L_max ≈ 1.8 μm" result="" color={T.syn_hydro} />
              <CalcRow eq="From t=4h data: 1.1 = 1.8 × (1 − exp(−4/τ))" result="" color={T.syn_hydro} />
              <CalcRow eq="exp(−4/τ) = 1 − 0.611 = 0.389" result="" color={T.syn_hydro} />
              <CalcRow eq="−4/τ = ln(0.389) = −0.944" result="" color={T.syn_hydro} />
              <CalcRow eq="τ" result="4.24 hours" color={T.syn_hydro} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Optimal Growth for Solar Cell:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Target length" value="1.0 μm (optimal for perovskite infiltration)" />
              <InfoRow label="Required time" value="1.0 = 1.8×(1−exp(−t/4.24)) → t = 3.5 hours" />
              <InfoRow label="Growth rate (initial)" value="~0.4 μm/hr (at t=0)" />
              <InfoRow label="Growth rate (at 4 hr)" value="~0.15 μm/hr (slowing)" />
            </div>
            <div style={{ background: T.syn_hydro + "08", border: `1px solid ${T.syn_hydro}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_hydro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>ZnO nanowire growth follows first-order kinetics with τ = 4.2 hours. For a 1 μm nanowire array (optimal for perovskite ETL), you need 3.5 hours at 90°C. Going beyond 8 hours gives diminishing returns. To grow longer wires, refresh the growth solution or increase concentration — but longer wires have more recombination, so 1 μm is the sweet spot for solar cells.</div>
            </div>
          </Card>

          <Card title="Numerical Example 2: Autoclave Pressure — Antoine Equation" color={T.syn_hydro} formula="log₁₀(P) = A − B/(C + T)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are running a hydrothermal synthesis at 200°C in a sealed Teflon-lined autoclave. Your lab manager asks: "What's the pressure inside?" Calculate the autogenous pressure from the water vapor pressure at 200°C.
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Antoine Equation for Water:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Antoine constants (water, 100-374°C)" value="A=8.07, B=1730.6, C=233.4" />
              <InfoRow label="Temperature" value="T = 200°C" />
              <InfoRow label="Fill fraction" value="70% (standard for autoclave)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Calculate Vapor Pressure:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="log₁₀(P) = A − B/(C + T)" result="" color={T.syn_hydro} />
              <CalcRow eq="= 8.07 − 1730.6/(233.4 + 200)" result="" color={T.syn_hydro} />
              <CalcRow eq="= 8.07 − 1730.6/433.4" result="" color={T.syn_hydro} />
              <CalcRow eq="= 8.07 − 3.99" result="4.08" color={T.syn_hydro} />
              <CalcRow eq="P = 10^4.08 mmHg" result="12,023 mmHg" color={T.syn_hydro} />
              <CalcRow eq="Convert: ÷ 760 mmHg/atm" result="15.8 atm ≈ 232 psi" color={T.syn_hydro} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Safety Check:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Pressure at 200°C" value="~16 atm (232 psi)" />
              <InfoRow label="Autoclave rating (typical)" value="35 atm (500 psi)" />
              <InfoRow label="Safety factor" value="35/16 = 2.2× (acceptable, >1.5×)" />
              <InfoRow label="At 250°C (caution!)" value="~40 atm — exceeds rated pressure!" />
              <InfoRow label="At 300°C" value="~86 atm — DANGEROUS, needs special vessel" />
            </div>
            <div style={{ background: T.syn_hydro + "08", border: `1px solid ${T.syn_hydro}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_hydro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>At 200°C, the autoclave reaches ~16 atm — well within the safety limit of a standard Teflon-lined vessel. But at 250°C it's already near the limit, and at 300°C it's 86 atm — you'd need a Hastelloy high-pressure reactor. This is why most hydrothermal recipes stay below 200°C. The elevated pressure keeps water liquid above its normal boiling point, dramatically increasing solubility of metal oxides.</div>
            </div>
          </Card>

          <Card title="Numerical Example 3: TiO₂ Nanoparticle Size Control" color={T.syn_hydro} formula="d ∝ t^(1/n) × exp(−Eₐ/nRT)">
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.7, marginBottom: 14 }}>
              <strong>The Experiment:</strong> You are synthesizing TiO₂ nanoparticles by hydrothermal method for a mesoporous perovskite solar cell scaffold. The particle size must be ~20 nm for optimal pore size. You test three temperatures and measure crystallite size by XRD (Scherrer equation).
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 1 — Experimental Results:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="150°C, 12 hours" value="d = 8 nm (too small)" />
              <InfoRow label="180°C, 12 hours" value="d = 15 nm" />
              <InfoRow label="200°C, 12 hours" value="d = 22 nm (target!)" />
              <InfoRow label="200°C, 24 hours" value="d = 28 nm (Ostwald ripening)" />
              <InfoRow label="220°C, 12 hours" value="d = 35 nm (too large)" />
              <InfoRow label="Phase (all samples)" value="Anatase (confirmed by XRD)" />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 2 — Temperature Dependence (Arrhenius):</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              <CalcRow eq="ln(d) vs 1/T plot (at constant 12 hrs):" result="" color={T.syn_hydro} />
              <CalcRow eq="ln(8) = 2.08  at  1/T = 1/423 = 2.364×10⁻³" result="" color={T.syn_hydro} />
              <CalcRow eq="ln(22) = 3.09  at  1/T = 1/473 = 2.114×10⁻³" result="" color={T.syn_hydro} />
              <CalcRow eq="Slope = (3.09−2.08)/(2.114−2.364)×10⁻³" result="" color={T.syn_hydro} />
              <CalcRow eq="Eₐ/R = −slope = 4040 K" result="" color={T.syn_hydro} />
              <CalcRow eq="Eₐ = 4040 × 8.314 J/mol" result="Eₐ ≈ 33.6 kJ/mol" color={T.syn_hydro} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}><strong style={{ color: T.ink }}>Step 3 — Optimal Recipe for 20 nm:</strong></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
              <InfoRow label="Best conditions" value="200°C, 10-12 hours" />
              <InfoRow label="Precursor" value="Ti(OBu)₄ + acetic acid + water" />
              <InfoRow label="Resulting particles" value="~20 nm anatase, uniform, high crystallinity" />
              <InfoRow label="Surface area (BET)" value="~80 m²/g" />
              <InfoRow label="Pore size in film" value="~20-30 nm (good for perovskite infiltration)" />
            </div>
            <div style={{ background: T.syn_hydro + "08", border: `1px solid ${T.syn_hydro}22`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.syn_hydro, fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Interpretation</div>
              <div style={{ fontSize: 11, color: T.ink, lineHeight: 1.7 }}>Particle size is controlled by temperature and time. At 200°C for 12 hours, you get ~22 nm anatase TiO₂ — ideal for mesoporous perovskite solar cells. The activation energy (~34 kJ/mol) shows the growth is kinetically controlled. Longer times (24h) cause Ostwald ripening — small particles dissolve and redeposit on larger ones. This is the same TiO₂ paste used in the world-record 25%+ perovskite solar cells.</div>
            </div>
          </Card>

        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS COMPARISON
// ═══════════════════════════════════════════════════════════════════════════
function SynthesisComparisonSection() {
  const [openItem, setOpenItem] = useState("comp_table");
  const toggle = (id) => setOpenItem(openItem === id ? null : id);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FAQAccordion title="Method Comparison: Which Technique to Use?" color={T.syn_main} isOpen={openItem === "comp_table"} onClick={() => toggle("comp_table")}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.syn_main}30` }}>
                {["Method", "Vacuum?", "Temp", "Rate", "Thickness Control", "Conformality", "Cost", "Best For"].map(h => (
                  <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: T.syn_main, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 700, fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["CVD", "Low-Med", "300-900°C", "1-100 nm/min", "Good", "Excellent", "$$", "Si, SiO₂, Si₃N₄"],
                ["PVD (Sputter)", "High", "RT-300°C", "1-50 nm/min", "Good", "Poor (line-of-sight)", "$$", "Metals, ITO, barrier layers"],
                ["ALD", "Medium", "150-350°C", "~1 Å/cycle", "Atomic!", "Perfect", "$$$", "Gate oxides, passivation"],
                ["Sol-Gel", "None", "RT-600°C", "50-500 nm/coat", "Moderate", "N/A (coating)", "$", "Oxide coatings, TiO₂, ZnO"],
                ["MBE", "UHV", "400-700°C", "~1 ML/s", "Atomic!", "N/A (epitaxial)", "$$$$", "III-V, quantum wells, 2DEG"],
                ["Spin Coat", "None", "RT", "50-1000 nm/coat", "Good", "N/A (planar)", "$", "Resist, perovskite, organics"],
                ["Hydrothermal", "None (sealed)", "100-300°C", "Slow (hrs)", "Shape control", "N/A (particles)", "$", "Nanoparticles, nanowires"],
              ].map(([method, vac, temp, rate, ctrl, conf, cost, best], i) => (
                <tr key={method} style={{ background: i % 2 === 0 ? T.syn_main + "05" : "transparent", borderBottom: `1px solid ${T.border}55` }}>
                  <td style={{ padding: "6px 8px", fontWeight: 700, color: T.ink }}>{method}</td>
                  <td style={{ padding: "6px 8px", color: T.muted }}>{vac}</td>
                  <td style={{ padding: "6px 8px", color: T.muted }}>{temp}</td>
                  <td style={{ padding: "6px 8px", color: T.muted }}>{rate}</td>
                  <td style={{ padding: "6px 8px", color: T.ink, fontWeight: 600 }}>{ctrl}</td>
                  <td style={{ padding: "6px 8px", color: T.muted }}>{conf}</td>
                  <td style={{ padding: "6px 8px", color: T.muted }}>{cost}</td>
                  <td style={{ padding: "6px 8px", color: T.syn_main, fontWeight: 600 }}>{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FAQAccordion>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN MODULE
// ═══════════════════════════════════════════════════════════════════════════
const SYNTH_SECTIONS = [
  { id: "cvd",      label: "CVD",               icon: "🏭", color: T.syn_cvd,   Component: CVDSection,    nextReason: "CVD uses gas-phase chemistry. PVD takes a simpler approach — physically vaporize the source material in vacuum and let atoms fly to the substrate." },
  { id: "pvd",      label: "PVD",               icon: "🎯", color: T.syn_pvd,   Component: PVDSection,    nextReason: "PVD deposits atoms ballistically. Sol-gel takes a completely different approach — start from a liquid solution and build the film through wet chemistry." },
  { id: "solgel",   label: "Sol-Gel",           icon: "🧪", color: T.syn_sol,   Component: SolGelSection, nextReason: "Sol-gel coats from solution. ALD takes precision to the extreme — depositing exactly one atomic layer per cycle through self-limiting surface reactions." },
  { id: "ald",      label: "ALD",               icon: "🧱", color: T.syn_ald,   Component: ALDSection,    nextReason: "ALD gives atomic-level control. MBE takes this further with molecular beams in ultra-high vacuum — the ultimate tool for epitaxial heterostructures." },
  { id: "mbe",      label: "MBE",               icon: "🔬", color: T.syn_mbe,   Component: MBESection,    nextReason: "MBE is the pinnacle of epitaxial growth. Spin coating is the opposite extreme — the simplest, cheapest method for solution-processed thin films." },
  { id: "spin",     label: "Spin Coating",      icon: "🌀", color: T.syn_spin,  Component: SpinCoatingSection, nextReason: "Spin coating is simple and cheap. Hydrothermal synthesis grows crystals from solution under pressure — nature's own crystal growth method." },
  { id: "hydro",    label: "Hydrothermal",      icon: "🫧", color: T.syn_hydro, Component: HydrothermalSection, nextReason: "All synthesis methods covered. The comparison table helps you choose the right technique for your material and application." },
  { id: "compare",  label: "Comparison",        icon: "📊", color: T.syn_main,  Component: SynthesisComparisonSection },
];

export default function MaterialsSynthesisModule() {
  const [active, setActive] = useState("cvd");
  const sec = SYNTH_SECTIONS.find(s => s.id === active);
  const { Component } = sec;
  const secIdx = SYNTH_SECTIONS.findIndex(s => s.id === active);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace", color: T.ink, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "8px 12px", background: T.panel, borderBottom: `1px solid ${T.border}` }}>
        {SYNTH_SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 11,
            border: `1px solid ${active === s.id ? s.color : T.border}`,
            background: active === s.id ? s.color + "22" : T.bg,
            color: active === s.id ? s.color : T.muted,
            cursor: "pointer", fontFamily: "inherit", fontWeight: active === s.id ? 700 : 400,
            display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span> {s.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: sec.color, letterSpacing: 0.5, marginBottom: 16 }}>{sec.label}</div>
        <Component />
        {sec.nextReason && (
          <div style={{ marginTop: 28, padding: "14px 18px", borderRadius: 10, background: sec.color + "0a", border: `1.5px solid ${sec.color}22`, borderLeft: `4px solid ${sec.color}` }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => { const next = SYNTH_SECTIONS[secIdx + 1]; return next ? <span> Up next: <span style={{ fontWeight: 700, color: next.color }}>{next.label}</span>.</span> : null; })()}
            </div>
          </div>
        )}
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel }}>
        <button onClick={() => { if (secIdx > 0) setActive(SYNTH_SECTIONS[secIdx - 1].id); }} disabled={secIdx === 0} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: secIdx === 0 ? T.surface : sec.color + "22",
          border: `1px solid ${secIdx === 0 ? T.border : sec.color}`, color: secIdx === 0 ? T.muted : sec.color,
          cursor: secIdx === 0 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>← Previous</button>
        <div style={{ display: "flex", gap: 4 }}>
          {SYNTH_SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{
              width: 7, height: 7, borderRadius: 4, background: active === s.id ? s.color : T.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>
        <button onClick={() => { if (secIdx < SYNTH_SECTIONS.length - 1) setActive(SYNTH_SECTIONS[secIdx + 1].id); }} disabled={secIdx === SYNTH_SECTIONS.length - 1} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13, background: secIdx === SYNTH_SECTIONS.length - 1 ? T.surface : sec.color + "22",
          border: `1px solid ${secIdx === SYNTH_SECTIONS.length - 1 ? T.border : sec.color}`, color: secIdx === SYNTH_SECTIONS.length - 1 ? T.muted : sec.color,
          cursor: secIdx === SYNTH_SECTIONS.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>Next →</button>
      </div>
    </div>
  );
}
