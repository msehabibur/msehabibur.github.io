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

      <FAQAccordion title="Solar Cell Absorbers by CVD" color={T.syn_main} isOpen={openItem === "cvd_solar"} onClick={() => toggle("cvd_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>CVD is widely used for depositing solar cell absorber layers and buffer/window layers. Here are key materials grown by CVD for photovoltaics:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="CdTe" eg="1.44 eV" method="Close-Space Sublimation (CSS)" recipe="CdTe powder source at 600-640°C, substrate 550-580°C, N₂/O₂ ambient, 1-20 Torr. Growth rate 1-5 μm/min." eff="~22.1% (First Solar record)" color={T.syn_cvd}
            steps={[
              { icon: "🔥", title: "Step 1: Heat CdTe Source", desc: "CdTe powder sublimes at 600-640°C in N₂/O₂ ambient.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={35} rx={6} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={132} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>CdTe Source 640°C</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={90+i*35} y1={108} x2={90+i*35+Math.sin(tick*0.15+i)*6} y2={85-Math.abs(Math.sin(tick*0.1+i))*15} stroke={c+"70"} strokeWidth={2} strokeLinecap="round"/>)}
              </>)},
              { icon: "💨", title: "Step 2: Vapor Transport", desc: "CdTe vapor travels ~2mm gap to cooler substrate at 550-580°C.", render: (tick, c) => (<>
                <rect x={60} y={120} width={200} height={20} rx={4} fill={c+"20"} stroke={c} strokeWidth={1}/>
                <rect x={60} y={30} width={200} height={20} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={44} textAnchor="middle" fill={T.syn_sol} fontSize={9} fontWeight={700}>Substrate 560°C</text>
                {Array.from({length:8},(_,i)=><circle key={i} cx={80+i*22} cy={115-(tick*1.5+i*12)%80} r={3} fill={c+"90"}/>)}
              </>)},
              { icon: "🧊", title: "Step 3: Film Condensation", desc: "CdTe condenses on substrate, forming polycrystalline film at 1-5 μm/min.", render: (tick, c) => (<>
                <rect x={60} y={30} width={200} height={20} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <rect x={60} y={50} width={200} height={Math.min(tick*0.3,30)} rx={2} fill={c+"50"} stroke={c} strokeWidth={1}/>
                <text x={160} y={100} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>CdTe film growing</text>
                {Array.from({length:6},(_,i)=><rect key={i} x={70+i*30} y={50} width={20} height={Math.min(tick*0.3,30)} fill={c+((i%2===0)?"40":"60")}/>)}
              </>)},
              { icon: "⚗️", title: "Step 4: CdCl₂ Treatment", desc: "Post-deposition CdCl₂ at 400°C — recrystallizes grains, passivates grain boundaries.", render: (tick, c) => (<>
                <rect x={60} y={40} width={200} height={30} rx={4} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={60} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>CdTe Film</text>
                {Array.from({length:10},(_,i)=><circle key={i} cx={70+i*20} cy={80+Math.sin(tick*0.12+i*1.5)*20} r={2.5} fill={T.syn_main+"aa"}/>)}
                <text x={160} y={130} textAnchor="middle" fill={T.syn_main} fontSize={9}>CdCl₂ vapor 400°C</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CdSe₁₋ₓTeₓ" eg="1.36-1.44 eV (tunable)" method="CSS / co-sublimation" recipe="CdSe and CdTe co-deposited or graded. CdSe layer first (~100 nm), then CdTe (~3 μm). Interdiffusion during CdCl₂ treatment." eff="~22.1% (graded bandgap boosts Jsc)" color={T.syn_main}
            steps={[
              { icon: "1️⃣", title: "Step 1: Deposit CdSe Layer", desc: "CdSe sublimed first, ~100nm thin layer on substrate.", render: (tick, c) => (<>
                <rect x={60} y={30} width={200} height={18} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <rect x={60} y={110} width={200} height={25} rx={4} fill={T.syn_hydro+"20"} stroke={T.syn_hydro} strokeWidth={1}/>
                <text x={160} y={127} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>CdSe Source</text>
                {Array.from({length:6},(_,i)=><circle key={i} cx={80+i*25} cy={105-(tick*1.2+i*14)%70} r={2.5} fill={T.syn_hydro+"90"}/>)}
              </>)},
              { icon: "2️⃣", title: "Step 2: Deposit CdTe Layer", desc: "CdTe sublimed on top of CdSe, ~3μm thick absorber layer.", render: (tick, c) => (<>
                <rect x={60} y={30} width={200} height={18} rx={4} fill={T.syn_sol+"30"}/>
                <rect x={60} y={48} width={200} height={8} rx={2} fill={T.syn_hydro+"60"}/>
                <rect x={60} y={110} width={200} height={25} rx={4} fill={T.syn_cvd+"20"} stroke={T.syn_cvd} strokeWidth={1}/>
                <text x={160} y={127} textAnchor="middle" fill={T.syn_cvd} fontSize={9}>CdTe Source</text>
                {Array.from({length:7},(_,i)=><circle key={i} cx={75+i*24} cy={105-(tick*1.3+i*12)%50} r={3} fill={T.syn_cvd+"80"}/>)}
              </>)},
              { icon: "🔄", title: "Step 3: Interdiffusion", desc: "CdCl₂ treatment at 400°C creates graded CdSe₁₋ₓTeₓ alloy at the junction.", render: (tick, c) => (<>
                <rect x={60} y={40} width={200} height={12} rx={2} fill={T.syn_hydro+"50"}/>
                <rect x={60} y={52} width={200} height={40} rx={2} fill={T.syn_cvd+"40"}/>
                {Array.from({length:8},(_,i)=>{const yy=42+Math.sin(tick*0.08+i)*20; return <circle key={i} cx={70+i*24} cy={yy} r={3} fill={yy<52?T.syn_cvd+"90":T.syn_hydro+"90"}/>;
                })}
                <text x={160} y={115} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Graded alloy forming</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CIGS (CuIn₁₋ₓGaₓSe₂)" eg="1.0-1.7 eV (x-dependent)" method="MOCVD / 3-stage co-evaporation" recipe="Metal-organic precursors (Cu, In, Ga alkyls) + H₂Se at 400-550°C." eff="~23.6% (lab record, ZSW)" color={T.syn_pvd}
            steps={[
              { icon: "💨", title: "Step 1: Precursor Gas Flow", desc: "Metal-organic precursors of Cu, In, Ga carried by N₂ into MOCVD chamber.", render: (tick, c) => (<>
                <rect x={20} y={60} width={40} height={60} rx={6} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <text x={40} y={95} textAnchor="middle" fill={c} fontSize={8} fontWeight={700}>MO Gas</text>
                <rect x={200} y={40} width={100} height={80} rx={8} fill={T.bg} stroke={T.border} strokeWidth={1.5}/>
                {Array.from({length:6},(_,i)=><circle key={i} cx={65+(tick*2+i*25)%140} cy={70+Math.sin(tick*0.1+i)*15} r={3} fill={c+"80"}/>)}
              </>)},
              { icon: "⚗️", title: "Step 2: Decomposition at 500°C", desc: "Precursors decompose on hot substrate, releasing Cu, In, Ga, Se atoms.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={25} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={127} textAnchor="middle" fill={T.syn_sol} fontSize={9}>Substrate 500°C</text>
                {Array.from({length:8},(_,i)=>{const colors=[c,T.syn_main,T.syn_sol,T.syn_cvd]; return <circle key={i} cx={80+i*22} cy={105-Math.abs(Math.sin(tick*0.12+i))*40} r={3} fill={colors[i%4]+"90"}/>;
                })}
              </>)},
              { icon: "🔥", title: "Step 3: Selenization", desc: "H₂Se gas engulfs growing film, incorporating selenium into the crystal structure.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={15} rx={3} fill={c+"50"} stroke={c} strokeWidth={1}/>
                <text x={160} y={130} textAnchor="middle" fill={c} fontSize={9}>CIGS Film</text>
                {Array.from({length:12},(_,i)=><circle key={i} cx={60+i*17+Math.sin(tick*0.08+i)*8} cy={70+Math.cos(tick*0.1+i*0.7)*20} r={4+Math.sin(tick*0.06+i)*2} fill={T.syn_main+"30"}/>)}
                <text x={160} y={55} textAnchor="middle" fill={T.syn_main} fontSize={9}>H₂Se atmosphere</text>
              </>)},
              { icon: "📈", title: "Step 4: Ga Grading", desc: "Ga/(In+Ga) ratio varied through thickness for bandgap grading — boosts Voc.", render: (tick, c) => (<>
                <rect x={60} y={80} width={200} height={50} rx={4} fill={c+"20"} stroke={c} strokeWidth={1}/>
                {Array.from({length:10},(_,i)=>{const frac=i/9; return <rect key={i} x={60+i*20} y={80} width={20} height={50} fill={`rgba(124,58,237,${0.1+frac*0.5})`}/>;
                })}
                <text x={80} y={75} fill={T.syn_pvd} fontSize={8}>Low Ga</text>
                <text x={230} y={75} fill={T.syn_pvd} fontSize={8}>High Ga</text>
                <line x1={60} y1={130+Math.sin(tick*0.05)*3} x2={260} y2={80+Math.sin(tick*0.05)*3} stroke={T.syn_sol} strokeWidth={2}/>
                <text x={160} y={148} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Bandgap gradient</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="a-Si:H (amorphous silicon)" eg="1.7-1.8 eV" method="PECVD" recipe="SiH₄ + H₂ plasma at 200-250°C. RF power 10-50 mW/cm². p-i-n structure deposited sequentially." eff="~14% (single junction)" color={T.syn_sol}
            steps={[
              { icon: "⚡", title: "Step 1: Plasma Ignition", desc: "RF power ionizes SiH₄/H₂ mixture, creating reactive radicals (SiH₃, SiH₂).", render: (tick, c) => (<>
                <rect x={60} y={30} width={200} height={100} rx={8} fill={T.syn_pvd+"08"} stroke={T.syn_pvd} strokeWidth={1}/>
                {Array.from({length:8},(_,i)=><line key={i} x1={80+i*22} y1={50+Math.random()*5} x2={80+i*22+Math.sin(tick*0.2+i)*15} y2={110-Math.random()*5} stroke={T.syn_pvd+"60"} strokeWidth={1.5}/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_pvd} fontSize={10} fontWeight={700}>RF Plasma</text>
              </>)},
              { icon: "🎯", title: "Step 2: Radical Deposition", desc: "SiH₃ radicals diffuse to substrate and incorporate into growing a-Si:H film.", render: (tick, c) => (<>
                <rect x={60} y={120} width={200} height={20} rx={4} fill={c+"30"} stroke={c} strokeWidth={1}/>
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>Substrate 250°C</text>
                {Array.from({length:8},(_,i)=><circle key={i} cx={80+i*24} cy={40+(tick*1.5+i*10)%75} r={3} fill={c+"90"}>
                  <animate attributeName="cy" values={`${40+i*5};${118};${40+i*5}`} dur="2s" repeatCount="indefinite" begin={`${i*0.2}s`}/>
                </circle>)}
              </>)},
              { icon: "📊", title: "Step 3: p-i-n Stack", desc: "Sequentially deposit p-doped (B₂H₆), intrinsic, and n-doped (PH₃) layers.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={20} rx={3} fill={T.syn_ald+"40"} stroke={T.syn_ald} strokeWidth={1}/>
                <text x={160} y={54} textAnchor="middle" fill={T.syn_ald} fontSize={9} fontWeight={700}>p-layer</text>
                <rect x={80} y={60} width={160} height={40} rx={3} fill={c+"40"} stroke={c} strokeWidth={1}/>
                <text x={160} y={84} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>i-layer (absorber)</text>
                <rect x={80} y={100} width={160} height={20} rx={3} fill={T.syn_cvd+"40"} stroke={T.syn_cvd} strokeWidth={1}/>
                <text x={160} y={114} textAnchor="middle" fill={T.syn_cvd} fontSize={9} fontWeight={700}>n-layer</text>
                <line x1={260} y1={50+Math.sin(tick*0.08)*5} x2={300} y2={50+Math.sin(tick*0.08)*5} stroke={T.syn_ald} strokeWidth={2} markerEnd="url(#arr)"/>
              </>)}
            ]}
          />
          <SolarCellCard mat="GaAs" eg="1.42 eV (direct)" method="MOCVD" recipe="TMGa + AsH₃ at 600-700°C, V/III ratio ~50-100. Growth rate 1-3 μm/hr. AlGaAs window layer." eff="~29.1% (Alta Devices, single junction record)" color={T.syn_ald}
            steps={[
              { icon: "💨", title: "Step 1: Precursor Delivery", desc: "Trimethylgallium (TMGa) and arsine (AsH₃) flow into hot-wall reactor.", render: (tick, c) => (<>
                <rect x={20} y={55} width={50} height={30} rx={5} fill={c+"15"} stroke={c} strokeWidth={1}/>
                <text x={45} y={74} textAnchor="middle" fill={c} fontSize={8}>TMGa</text>
                <rect x={20} y={95} width={50} height={30} rx={5} fill={T.syn_main+"15"} stroke={T.syn_main} strokeWidth={1}/>
                <text x={45} y={114} textAnchor="middle" fill={T.syn_main} fontSize={8}>AsH₃</text>
                {Array.from({length:5},(_,i)=><circle key={i} cx={75+(tick*2+i*30)%170} cy={70+Math.sin(tick*0.1+i)*10} r={3} fill={c+"80"}/>)}
                {Array.from({length:5},(_,i)=><circle key={i+5} cx={75+(tick*2+i*30+15)%170} cy={110+Math.sin(tick*0.1+i)*10} r={3} fill={T.syn_main+"80"}/>)}
              </>)},
              { icon: "⚗️", title: "Step 2: Pyrolysis at 650°C", desc: "Precursors decompose on hot GaAs substrate releasing Ga and As atoms.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={25} rx={4} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={127} textAnchor="middle" fill={T.syn_sol} fontSize={9}>GaAs substrate 650°C</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={90+i*35} y1={108} x2={90+i*35+Math.sin(tick*0.15+i)*8} y2={80-Math.abs(Math.sin(tick*0.1+i))*20} stroke={T.syn_sol+"60"} strokeWidth={2} strokeLinecap="round"/>)}
                {Array.from({length:6},(_,i)=><circle key={i} cx={80+i*30} cy={70+Math.sin(tick*0.12+i*2)*25} r={3.5} fill={i%2===0?c+"90":T.syn_main+"90"}/>)}
              </>)},
              { icon: "📈", title: "Step 3: Epitaxial Growth", desc: "GaAs grows epitaxially, lattice-matched. AlGaAs window layer deposited on top.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={25} rx={3} fill={T.syn_sol+"20"}/>
                <rect x={60} y={80} width={200} height={Math.min(tick*0.4,20)} rx={2} fill={c+"50"} stroke={c} strokeWidth={1}/>
                <rect x={60} y={Math.max(80-Math.min(tick*0.3,15),65)} width={200} height={Math.min(tick*0.3,15)} rx={2} fill={T.syn_pvd+"40"} stroke={T.syn_pvd} strokeWidth={1}/>
                <text x={160} y={60} textAnchor="middle" fill={T.syn_pvd} fontSize={9}>AlGaAs window</text>
                <text x={160} y={95} textAnchor="middle" fill={c} fontSize={9}>GaAs absorber</text>
                <text x={160} y={117} textAnchor="middle" fill={T.syn_sol} fontSize={9}>Substrate</text>
              </>)},
              { icon: "✂️", title: "Step 4: Epitaxial Lift-Off", desc: "Sacrificial AlAs layer dissolved in HF — GaAs film peels off for flexible cells.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={25} rx={3} fill={T.syn_sol+"20"}/>
                <rect x={60} y={95} width={200} height={5} rx={1} fill={T.syn_main+"40"} stroke={T.syn_main} strokeWidth={0.5} strokeDasharray="4,3"/>
                <rect x={60} y={70-Math.min(tick*0.3,20)} width={200} height={25} rx={3} fill={c+"50"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={85-Math.min(tick*0.3,20)} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>GaAs film lifts off</text>
                <text x={160} y={140} textAnchor="middle" fill={T.syn_main} fontSize={9}>HF dissolves AlAs layer</text>
              </>)}
            ]}
          />
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

      <FAQAccordion title="Solar Cell Absorbers by PVD" color={T.syn_main} isOpen={openItem === "pvd_solar"} onClick={() => toggle("pvd_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>PVD (sputtering, evaporation, PLD) is a primary deposition method for many solar absorber and contact layers:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="CZTS (Cu₂ZnSnS₄)" eg="1.45-1.6 eV" method="Co-sputtering + sulfurization" recipe="Sputter Cu/Zn/Sn metal stack (~700 nm) onto Mo-coated glass. Sulfurize in S₂/N₂ at 550-580°C." eff="~11.0% (earth-abundant alternative to CIGS)" color={T.syn_pvd}
            steps={[
              { icon: "🎯", title: "Step 1: Sputter Metal Stack", desc: "Ar⁺ ions knock Cu, Zn, Sn atoms off targets onto Mo-coated glass substrate.", render: (tick, c) => (<>
                <rect x={100} y={20} width={120} height={20} rx={4} fill={c+"30"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={34} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Cu/Zn/Sn Target</text>
                <rect x={100} y={120} width={120} height={15} rx={3} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={131} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Mo/Glass</text>
                {Array.from({length:8},(_,i)=><circle key={i} cx={110+i*15} cy={45+(tick*2+i*10)%70} r={2.5} fill={[c,T.syn_main,T.syn_sol][i%3]+"90"}/>)}
              </>)},
              { icon: "🔥", title: "Step 2: Sulfurization", desc: "S₂ gas at 550-580°C reacts with metal stack to form Cu₂ZnSnS₄ compound.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={15} rx={3} fill={c+"40"} stroke={c} strokeWidth={1}/>
                <text x={160} y={130} textAnchor="middle" fill={c} fontSize={9}>Metal stack on Mo</text>
                {Array.from({length:14},(_,i)=><circle key={i} cx={60+i*16+Math.sin(tick*0.09+i)*8} cy={60+Math.cos(tick*0.07+i*0.8)*25} r={3+Math.sin(tick*0.05+i)*1.5} fill={T.syn_sol+"35"}/>)}
                <text x={160} y={45} textAnchor="middle" fill={T.syn_sol} fontSize={10} fontWeight={700}>S₂ vapor 570°C</text>
              </>)},
              { icon: "🧊", title: "Step 3: CZTS Crystallization", desc: "Kesterite phase forms — Cu₂ZnSnS₄ with bandgap ~1.5 eV ideal for PV.", render: (tick, c) => (<>
                <rect x={60} y={80} width={200} height={40} rx={4} fill={c+"35"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:8},(_,i)=>{const sz=6+Math.sin(tick*0.05+i)*3; return <rect key={i} x={70+i*24-sz/2} y={100-sz/2} width={sz} height={sz} fill={c+"60"} transform={`rotate(${tick*0.5+i*15},${70+i*24},${100})`}/>;
                })}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Kesterite CZTS</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CIGS (CuIn₁₋ₓGaₓSe₂)" eg="1.0-1.7 eV" method="3-stage co-evaporation" recipe="Stage 1: In+Ga+Se at 350°C. Stage 2: Cu+Se at 550°C. Stage 3: In+Ga+Se at 550°C." eff="~23.6% (ZSW record)" color={T.syn_cvd}
            steps={[
              { icon: "1️⃣", title: "Stage 1: In+Ga+Se (Cu-free)", desc: "Evaporate In, Ga, Se onto Mo substrate at 350°C — forms (In,Ga)₂Se₃ precursor.", render: (tick, c) => (<>
                {[{lbl:"In",x:60},{lbl:"Ga",x:140},{lbl:"Se",x:220}].map((s,i)=><g key={i}><rect x={s.x} y={120} width={50} height={20} rx={4} fill={c+"20"} stroke={c} strokeWidth={1}/><text x={s.x+25} y={134} textAnchor="middle" fill={c} fontSize={9}>{s.lbl}</text></g>)}
                <rect x={80} y={30} width={160} height={15} rx={3} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                {Array.from({length:9},(_,i)=><circle key={i} cx={80+i*20} cy={115-(tick*1.5+i*12)%75} r={2.5} fill={c+"80"}/>)}
              </>)},
              { icon: "2️⃣", title: "Stage 2: Cu+Se (Cu-rich)", desc: "Add Cu and Se at 550°C. Film goes Cu-rich, large grains form.", render: (tick, c) => (<>
                {[{lbl:"Cu",x:90,clr:T.syn_ald},{lbl:"Se",x:190,clr:T.syn_main}].map((s,i)=><g key={i}><rect x={s.x} y={120} width={50} height={20} rx={4} fill={s.clr+"20"} stroke={s.clr} strokeWidth={1}/><text x={s.x+25} y={134} textAnchor="middle" fill={s.clr} fontSize={9}>{s.lbl}</text></g>)}
                <rect x={80} y={30} width={160} height={20} rx={3} fill={c+"30"} stroke={c} strokeWidth={1}/>
                {Array.from({length:6},(_,i)=><circle key={i} cx={100+i*25} cy={115-(tick*1.8+i*15)%60} r={3} fill={T.syn_ald+"90"}/>)}
                <text x={160} y={70} textAnchor="middle" fill={T.syn_ald} fontSize={9}>Cu-rich phase 550°C</text>
              </>)},
              { icon: "3️⃣", title: "Stage 3: In+Ga+Se (Cu-poor)", desc: "More In+Ga+Se returns film to Cu-poor stoichiometry — optimal for PV.", render: (tick, c) => (<>
                <rect x={80} y={30} width={160} height={30} rx={3} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={50} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>CIGS Film</text>
                {Array.from({length:7},(_,i)=><circle key={i} cx={90+i*22} cy={115-(tick*1.4+i*11)%45} r={2.5} fill={T.syn_main+"90"}/>)}
                <text x={160} y={90} textAnchor="middle" fill={T.syn_main} fontSize={9}>In+Ga+Se flux</text>
              </>)},
              { icon: "✅", title: "Step 4: CdS Buffer + ZnO Window", desc: "Chemical bath CdS (50nm), sputtered i-ZnO + AZO for transparent contact.", render: (tick, c) => (<>
                <rect x={80} y={90} width={160} height={30} rx={3} fill={c+"40"}/>
                <text x={160} y={109} textAnchor="middle" fill={c} fontSize={8}>CIGS</text>
                <rect x={80} y={80} width={160} height={10} rx={2} fill={T.syn_sol+"50"}/>
                <text x={160} y={88} textAnchor="middle" fill={T.syn_sol} fontSize={7}>CdS</text>
                <rect x={80} y={65} width={160} height={15} rx={2} fill={T.syn_hydro+"40"}/>
                <text x={160} y={76} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>ZnO/AZO</text>
                <rect x={80} y={120} width={160} height={10} rx={2} fill={T.muted+"30"}/>
                <text x={160} y={128} textAnchor="middle" fill={T.muted} fontSize={7}>Mo back contact</text>
                {Array.from({length:3},(_,i)=><line key={i} x1={100+i*50} y1={55+Math.sin(tick*0.1+i)*3} x2={100+i*50} y2={40+Math.sin(tick*0.1+i)*3} stroke={T.syn_sol} strokeWidth={1.5} markerEnd="url(#arr)"/>)}
              </>)}
            ]}
          />
          <SolarCellCard mat="CdTe" eg="1.44 eV" method="RF magnetron sputtering" recipe="CdTe target, Ar gas, 5-20 mTorr, substrate at 200-300°C. Post-deposition CdCl₂ treatment." eff="~22.1% (CSS preferred industrially)" color={T.syn_main}
            steps={[
              { icon: "🎯", title: "Step 1: Sputtering CdTe", desc: "Ar⁺ ions bombard CdTe target, ejecting Cd and Te atoms toward substrate.", render: (tick, c) => (<>
                <rect x={100} y={15} width={120} height={20} rx={4} fill={c+"30"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={29} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>CdTe Target</text>
                <rect x={100} y={125} width={120} height={15} rx={3} fill={T.syn_sol+"30"}/>
                {Array.from({length:6},(_,i)=>{const ang=Math.PI*0.3+i*0.2; return <circle key={i} cx={160+Math.sin(ang+tick*0.1)*30} cy={40+(tick*2+i*15)%80} r={2.5} fill={c+"90"}/>;
                })}
                {Array.from({length:4},(_,i)=><circle key={i+10} cx={120+i*20} cy={20-5+Math.sin(tick*0.15+i)*4} r={2} fill={T.syn_pvd+"70"}/>)}
              </>)},
              { icon: "📈", title: "Step 2: Film Growth", desc: "CdTe film grows at 1-5 nm/min. Excellent uniformity across substrate.", render: (tick, c) => (<>
                <rect x={80} y={110} width={160} height={15} rx={3} fill={T.syn_sol+"30"}/>
                <rect x={80} y={100} width={160} height={Math.min(tick*0.5,35)} rx={2} fill={c+"45"} stroke={c} strokeWidth={1}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={100+i*30} cy={95-Math.abs(Math.sin(tick*0.1+i))*20} r={3} fill={c+"70"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9}>Uniform deposition</text>
              </>)},
              { icon: "⚗️", title: "Step 3: CdCl₂ Treatment", desc: "CdCl₂ at 400°C recrystallizes grains and passivates grain boundaries.", render: (tick, c) => (<>
                <rect x={80} y={60} width={160} height={30} rx={4} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={79} textAnchor="middle" fill={c} fontSize={9}>CdTe Film</text>
                {Array.from({length:10},(_,i)=><circle key={i} cx={90+i*16} cy={100+Math.sin(tick*0.12+i*1.2)*20} r={2} fill={T.syn_cvd+"aa"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_cvd} fontSize={9}>CdCl₂ vapor recrystallizes grains</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Sb₂Se₃" eg="1.1-1.3 eV" method="Thermal evaporation" recipe="Sb₂Se₃ powder evaporated at 350-400°C, substrate at 300°C. 1D ribbon crystal — orient [001] perpendicular." eff="~10.5% (emerging absorber)" color={T.syn_sol}
            steps={[
              { icon: "🔥", title: "Step 1: Thermal Evaporation", desc: "Sb₂Se₃ powder heated to 350-400°C in tungsten boat. Vapor rises toward substrate.", render: (tick, c) => (<>
                <rect x={120} y={120} width={80} height={20} rx={4} fill={c+"30"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={134} textAnchor="middle" fill={c} fontSize={8}>Sb₂Se₃ source</text>
                <rect x={80} y={25} width={160} height={15} rx={3} fill={T.syn_pvd+"20"} stroke={T.syn_pvd} strokeWidth={1}/>
                {Array.from({length:7},(_,i)=><circle key={i} cx={120+i*10} cy={115-(tick*1.5+i*13)%85} r={2.5} fill={c+"80"}/>)}
              </>)},
              { icon: "📐", title: "Step 2: Oriented Growth", desc: "1D ribbon crystal structure grows with [001] direction perpendicular to substrate for optimal carrier transport.", render: (tick, c) => (<>
                <rect x={80} y={25} width={160} height={15} rx={3} fill={T.syn_pvd+"20"}/>
                {Array.from({length:10},(_,i)=>{const h=Math.min(tick*0.4,40+i*3); return <rect key={i} x={90+i*15} y={40} width={4} height={h} rx={1} fill={c+"60"} stroke={c} strokeWidth={0.5}/>;
                })}
                <text x={160} y={110} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>[001] ribbons growing</text>
              </>)},
              { icon: "🔄", title: "Step 3: Se Vapor Anneal", desc: "Post-anneal in Se vapor corrects Se vacancies and improves crystallinity.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={40} rx={4} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:12},(_,i)=><circle key={i} cx={80+i*14+Math.sin(tick*0.08+i)*6} cy={100+Math.cos(tick*0.1+i*0.9)*15} r={3} fill={T.syn_main+"30"}/>)}
                <text x={160} y={60} textAnchor="middle" fill={c} fontSize={9}>Sb₂Se₃ film</text>
                <text x={160} y={140} textAnchor="middle" fill={T.syn_main} fontSize={9}>Se vapor annealing</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Cu₂O (cuprous oxide)" eg="2.0-2.1 eV" method="Reactive sputtering" recipe="Cu target in Ar/O₂ (O₂ 10-30%). Phase-pure Cu₂O requires careful O₂ control." eff="~8.1% (oxide PV, all-earth-abundant)" color={T.syn_ald}
            steps={[
              { icon: "🎯", title: "Step 1: Reactive Sputtering", desc: "Cu target sputtered in Ar/O₂ mix. O₂ partial pressure controls Cu₂O vs CuO phase.", render: (tick, c) => (<>
                <rect x={100} y={15} width={120} height={18} rx={4} fill={T.syn_pvd+"30"} stroke={T.syn_pvd} strokeWidth={1}/>
                <text x={160} y={28} textAnchor="middle" fill={T.syn_pvd} fontSize={9}>Cu Target</text>
                <rect x={100} y={125} width={120} height={15} rx={3} fill={T.syn_sol+"20"}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={120+i*20} cy={40+(tick*2+i*12)%80} r={3} fill={T.syn_pvd+"80"}/>)}
                {Array.from({length:5},(_,i)=><circle key={i+5} cx={110+i*25} cy={60+Math.sin(tick*0.1+i)*25} r={2} fill={c+"60"}/>)}
                <text x={280} y={80} fill={c} fontSize={8}>O₂</text>
              </>)},
              { icon: "⚖️", title: "Step 2: Phase Control", desc: "Precise O₂ flow ratio ensures Cu₂O phase, not CuO or Cu. Substrate temperature RT-300°C.", render: (tick, c) => (<>
                <rect x={40} y={50} width={100} height={60} rx={6} fill={c+"20"} stroke={c} strokeWidth={1.5}/>
                <text x={90} y={75} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Cu₂O</text>
                <text x={90} y={90} textAnchor="middle" fill={c} fontSize={8}>O₂ = 15%</text>
                <rect x={180} y={50} width={100} height={60} rx={6} fill={T.muted+"20"} stroke={T.muted} strokeWidth={1.5}/>
                <text x={230} y={75} textAnchor="middle" fill={T.muted} fontSize={10}>CuO</text>
                <text x={230} y={90} textAnchor="middle" fill={T.muted} fontSize={8}>O₂ = 30%</text>
                <line x1={90} y1={120} x2={90} y2={130+Math.sin(tick*0.1)*5} stroke={c} strokeWidth={3}/>
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Optimal O₂ window</text>
              </>)},
              { icon: "🔋", title: "Step 3: Device Stack", desc: "Cu₂O absorber with Ga₂O₃ or ZnO n-type layer forms heterojunction. Wide-gap for tandem.", render: (tick, c) => (<>
                <rect x={80} y={90} width={160} height={30} rx={3} fill={c+"40"}/>
                <text x={160} y={109} textAnchor="middle" fill={c} fontSize={9}>Cu₂O absorber (2.0 eV)</text>
                <rect x={80} y={70} width={160} height={20} rx={3} fill={T.syn_cvd+"30"}/>
                <text x={160} y={83} textAnchor="middle" fill={T.syn_cvd} fontSize={8}>Ga₂O₃ / ZnO</text>
                <rect x={80} y={55} width={160} height={15} rx={2} fill={T.syn_hydro+"25"}/>
                <text x={160} y={65} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>AZO (TCO)</text>
                {Array.from({length:3},(_,i)=><line key={i} x1={110+i*40} y1={50+Math.sin(tick*0.1+i)*3} x2={110+i*40} y2={35+Math.sin(tick*0.1+i)*3} stroke={T.syn_sol} strokeWidth={1.5}/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_sol} fontSize={9}>Sunlight ↓</text>
              </>)}
            ]}
          />
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

      <FAQAccordion title="Solar Cell Absorbers by Sol-Gel" color={T.syn_main} isOpen={openItem === "sg_solar"} onClick={() => toggle("sg_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>Sol-gel is a low-cost, solution-based route for depositing oxide and chalcogenide thin films for solar cells — no vacuum needed:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="MAPbI₃ (CH₃NH₃PbI₃)" eg="1.55 eV" method="Sol-gel spin/dip coating" recipe="Dissolve PbI₂ + MAI (1:1) in DMF:DMSO (4:1) at 1M. Spin 4000 rpm, anti-solvent drip at 15s. Anneal 100°C." eff="~26.1% (perovskite single junction record)" color={T.syn_sol}
            steps={[
              { icon: "🧪", title: "Step 1: Dissolve Precursors", desc: "Mix PbI₂ + MAI in DMF:DMSO (4:1) at 1M concentration. Clear yellow solution forms.", render: (tick, c) => (<>
                <rect x={100} y={50} width={120} height={80} rx={8} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={85} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>PbI₂ + MAI</text>
                {Array.from({length:8},(_,i)=><circle key={i} cx={115+i*14} cy={90+Math.sin(tick*0.12+i)*18} r={3} fill={c+"70"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.muted} fontSize={9}>DMF:DMSO solvent</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin Coating", desc: "Drop solution on substrate, spin at 4000 rpm. Centrifugal force spreads uniform wet film.", render: (tick, c) => (<>
                <ellipse cx={160} cy={90} rx={80+Math.sin(tick*0.15)*5} ry={20} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <ellipse cx={160} cy={90} rx={50} ry={12} fill={c+"25"} stroke={c} strokeWidth={1}/>
                <ellipse cx={160} cy={90} rx={20} ry={5} fill={c+"40"}/>
                <line x1={160} y1={90} x2={160+Math.cos(tick*0.3)*60} y2={90+Math.sin(tick*0.3)*15} stroke={c} strokeWidth={2}/>
                <text x={160} y={130} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>4000 RPM</text>
              </>)},
              { icon: "💧", title: "Step 3: Anti-solvent Drip", desc: "Chlorobenzene dripped at 15s mark — triggers rapid nucleation of perovskite crystals.", render: (tick, c) => (<>
                <ellipse cx={160} cy={100} rx={80} ry={18} fill={c+"20"} stroke={c} strokeWidth={1}/>
                <circle cx={160} cy={Math.max(30,100-((tick*2)%80))} r={5} fill={T.syn_hydro+"80"} stroke={T.syn_hydro} strokeWidth={1}/>
                <text x={160} y={22} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>Chlorobenzene</text>
                {tick>20 && Array.from({length:6},(_,i)=><rect key={i} x={120+i*15-3} y={96} width={6} height={6} fill={c+"80"} transform={`rotate(${45+i*10},${120+i*15},${99})`}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>Rapid crystallization</text>
              </>)},
              { icon: "🔥", title: "Step 4: Annealing 100°C", desc: "10 min anneal completes crystallization. Golden-brown mirror film of MAPbI₃.", render: (tick, c) => (<>
                <rect x={80} y={70} width={160} height={25} rx={4} fill={c+"50"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={87} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>MAPbI₃ Film</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={100+i*30} y1={100} x2={100+i*30+Math.sin(tick*0.15+i)*5} y2={120+Math.sin(tick*0.1+i)*8} stroke={T.syn_ald+"50"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_ald} fontSize={9}>100°C hotplate</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CsₓFA₁₋ₓPb(I₁₋ᵧBrᵧ)₃" eg="1.2-2.3 eV (tunable)" method="Mixed-cation sol-gel" recipe="FAI + CsI + PbI₂ + PbBr₂ in DMF:DMSO. Cs stabilizes the black phase. Anti-solvent or vacuum flash." eff="~26.1% (state-of-art perovskite)" color={T.syn_cvd}
            steps={[
              { icon: "🧪", title: "Step 1: Mix Multi-cation Solution", desc: "FAI + CsI + PbI₂ + PbBr₂ dissolved in DMF:DMSO. Multiple cations stabilize perovskite phase.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={90} rx={10} fill={c+"10"} stroke={c} strokeWidth={1.5}/>
                {["FAI","CsI","PbI₂","PbBr₂"].map((l,i)=><circle key={i} cx={110+i*30} cy={80+Math.sin(tick*0.1+i*1.5)*20} r={8} fill={[T.syn_sol,T.syn_ald,c,T.syn_pvd][i]+"50"}/>)}
                {["FAI","CsI","PbI₂","PbBr₂"].map((l,i)=><text key={i+10} x={110+i*30} y={83+Math.sin(tick*0.1+i*1.5)*20} textAnchor="middle" fill={[T.syn_sol,T.syn_ald,c,T.syn_pvd][i]} fontSize={6} fontWeight={700}>{l}</text>)}
              </>)},
              { icon: "🌀", title: "Step 2: Spin + Anti-solvent", desc: "Spin coat at 4000 rpm with diethyl ether anti-solvent drip for rapid nucleation.", render: (tick, c) => (<>
                <ellipse cx={160} cy={85} rx={75} ry={18} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <line x1={160} y1={85} x2={160+Math.cos(tick*0.25)*55} y2={85+Math.sin(tick*0.25)*14} stroke={c} strokeWidth={2}/>
                <circle cx={160} cy={Math.max(25,85-((tick*1.5)%65))} r={4} fill={T.syn_hydro+"80"}/>
                <text x={160} y={120} textAnchor="middle" fill={c} fontSize={9}>Spin + anti-solvent</text>
              </>)},
              { icon: "🔥", title: "Step 3: Anneal + Phase Stabilization", desc: "Anneal at 100°C. Cs prevents yellow delta-phase — stable black alpha-FAPbI₃ forms.", render: (tick, c) => (<>
                <rect x={80} y={60} width={70} height={50} rx={6} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={115} y={80} textAnchor="middle" fill={T.syn_sol} fontSize={8}>δ-phase</text>
                <text x={115} y={93} textAnchor="middle" fill={T.syn_sol} fontSize={7}>(yellow)</text>
                <text x={160} y={90} fill={c} fontSize={14}>→</text>
                <rect x={170} y={60} width={70} height={50} rx={6} fill={c+"30"} stroke={c} strokeWidth={1.5}/>
                <text x={205} y={80} textAnchor="middle" fill={c} fontSize={8} fontWeight={700}>α-phase</text>
                <text x={205} y={93} textAnchor="middle" fill={c} fontSize={7}>(black)</text>
                <text x={160} y={140} textAnchor="middle" fill={T.syn_ald} fontSize={9}>Cs⁺ stabilizes black phase</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CZTS (Cu₂ZnSnS₄)" eg="1.5 eV" method="Sol-gel + sulfurization" recipe="CuCl₂ + ZnCl₂ + SnCl₂ in 2-methoxyethanol + MEA. Spin coat 3-5 layers, sulfurize at 550°C." eff="~8.5% (low-cost earth-abundant)" color={T.syn_pvd}
            steps={[
              { icon: "🧪", title: "Step 1: Prepare Sol", desc: "Dissolve CuCl₂ + ZnCl₂ + SnCl₂ in 2-methoxyethanol with MEA stabilizer.", render: (tick, c) => (<>
                <rect x={100} y={40} width={120} height={80} rx={8} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:6},(_,i)=><circle key={i} cx={120+i*17} cy={80+Math.sin(tick*0.1+i)*20} r={4} fill={[T.syn_ald,T.syn_main,T.syn_sol][i%3]+"60"}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>Cu²⁺ + Zn²⁺ + Sn²⁺ in solution</text>
              </>)},
              { icon: "🌀", title: "Step 2: Multi-layer Spin Coat", desc: "Spin coat 3-5 layers, drying at 300°C between each coat to build thickness.", render: (tick, c) => (<>
                <rect x={80} y={110} width={160} height={12} rx={3} fill={T.syn_sol+"30"}/>
                {Array.from({length:Math.min(Math.floor(tick/15)+1,5)},(_,i)=><rect key={i} x={80} y={100-i*12} width={160} height={10} rx={2} fill={c+((i%2===0)?"30":"50")} stroke={c} strokeWidth={0.5}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>Layer {Math.min(Math.floor(tick/15)+1,5)} of 5</text>
              </>)},
              { icon: "🔥", title: "Step 3: Sulfurization at 550°C", desc: "S vapor at 550°C converts precursor layers into crystalline Cu₂ZnSnS₄ kesterite.", render: (tick, c) => (<>
                <rect x={80} y={80} width={160} height={30} rx={4} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:12},(_,i)=><circle key={i} cx={80+i*14+Math.sin(tick*0.08+i)*6} cy={50+Math.cos(tick*0.1+i*0.8)*20} r={3} fill={T.syn_sol+"35"}/>)}
                <text x={160} y={100} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>CZTS forming</text>
                <text x={160} y={140} textAnchor="middle" fill={T.syn_sol} fontSize={9}>S vapor 550°C</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Sb₂S₃" eg="1.7-1.8 eV" method="Chemical bath / sol-gel" recipe="SbCl₃ in acetone + Na₂S₂O₃ aqueous solution. Deposit at 5-10°C for 2 hrs. Anneal 300°C in N₂." eff="~7.5% (wide-gap, Cd-free)" color={T.syn_main}
            steps={[
              { icon: "🧪", title: "Step 1: Prepare Chemical Bath", desc: "SbCl₃ dissolved in acetone, mixed with Na₂S₂O₃ aqueous solution. Cooled to 5-10°C.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={90} rx={8} fill={T.syn_hydro+"10"} stroke={T.syn_hydro} strokeWidth={1.5}/>
                {Array.from({length:8},(_,i)=><circle key={i} cx={100+i*18} cy={80+Math.sin(tick*0.08+i)*25} r={3} fill={c+"60"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>5-10°C chemical bath</text>
              </>)},
              { icon: "📈", title: "Step 2: Film Growth (2 hrs)", desc: "Substrate immersed in bath. Sb₂S₃ slowly deposits as an orange-brown film.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={90} rx={8} fill={T.syn_hydro+"08"} stroke={T.syn_hydro} strokeWidth={1}/>
                <rect x={130} y={45} width={10} height={80} rx={2} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <rect x={130} y={45+Math.max(0,80-tick*0.8)} width={10} height={Math.min(tick*0.8,80)} rx={2} fill={c+"50"}/>
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9}>Sb₂S₃ growing on substrate</text>
              </>)},
              { icon: "🔥", title: "Step 3: Anneal in N₂", desc: "Anneal at 300°C in N₂ to crystallize amorphous Sb₂S₃ into orthorhombic phase.", render: (tick, c) => (<>
                <rect x={80} y={60} width={160} height={30} rx={4} fill={c+"45"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={80} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Sb₂S₃ film</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={100+i*30} y1={95} x2={100+i*30+Math.sin(tick*0.12+i)*5} y2={115+Math.sin(tick*0.1+i)*10} stroke={T.syn_ald+"50"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_ald} fontSize={9}>300°C anneal in N₂</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="SnO₂ (ETL for perovskites)" eg="3.6 eV" method="Sol-gel spin coating" recipe="SnCl₂·2H₂O in ethanol (0.1M). Spin 3000 rpm, anneal 150°C. Electron transport layer." eff="Used in >25% perovskite cells as ETL" color={T.syn_ald}
            steps={[
              { icon: "🧪", title: "Step 1: Prepare SnO₂ Sol", desc: "Dissolve SnCl₂·2H₂O in ethanol at 0.1M. Or use commercial SnO₂ nanoparticle colloid.", render: (tick, c) => (<>
                <rect x={100} y={50} width={120} height={70} rx={8} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:6},(_,i)=><circle key={i} cx={120+i*16} cy={85+Math.sin(tick*0.1+i)*15} r={3} fill={c+"60"}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>SnCl₂ in ethanol</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin Coat ETL", desc: "Spin at 3000 rpm onto ITO/FTO substrate. Ultrathin ~30nm compact layer.", render: (tick, c) => (<>
                <ellipse cx={160} cy={85} rx={75} ry={18} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                <line x1={160} y1={85} x2={160+Math.cos(tick*0.3)*55} y2={85+Math.sin(tick*0.3)*14} stroke={c} strokeWidth={2}/>
                <text x={160} y={120} textAnchor="middle" fill={c} fontSize={9}>3000 RPM</text>
                <text x={160} y={140} textAnchor="middle" fill={T.muted} fontSize={8}>~30 nm SnO₂ layer</text>
              </>)},
              { icon: "🔥", title: "Step 3: Low-T Anneal", desc: "Anneal at 150°C — compatible with flexible substrates. Forms compact, pinhole-free ETL.", render: (tick, c) => (<>
                <rect x={80} y={80} width={160} height={10} rx={2} fill={c+"50"} stroke={c} strokeWidth={1}/>
                <text x={160} y={88} textAnchor="middle" fill={c} fontSize={8} fontWeight={700}>SnO₂ ETL</text>
                <rect x={80} y={90} width={160} height={15} rx={2} fill={T.syn_hydro+"30"}/>
                <text x={160} y={101} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>ITO/FTO</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={100+i*30} y1={110} x2={100+i*30+Math.sin(tick*0.12+i)*4} y2={125+Math.sin(tick*0.1+i)*8} stroke={T.syn_ald+"40"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_ald} fontSize={9}>150°C anneal</text>
              </>)}
            ]}
          />
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

      <FAQAccordion title="Solar Cell Absorbers by ALD" color={T.syn_main} isOpen={openItem === "ald_solar"} onClick={() => toggle("ald_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>ALD excels at ultrathin, conformal layers — perfect for passivation, buffer, and interface engineering in solar cells:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="Al₂O₃ (passivation)" eg="~8.8 eV (insulator)" method="Thermal ALD" recipe="TMA + H₂O at 150-200°C. ~1 Å/cycle, 10-30 nm total. Reduces surface recombination velocity." eff="Enables >26% c-Si cells (PERC/TOPCon)" color={T.syn_ald}
            steps={[
              { icon: "1️⃣", title: "Pulse A: TMA Chemisorption", desc: "Trimethylaluminum molecules approach Si surface and react with -OH groups. Self-limiting.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={20} rx={3} fill={T.syn_sol+"20"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={124} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Si substrate with -OH groups</text>
                {Array.from({length:8},(_,i)=>{const targetY=108; const startY=40+i*5; const cy=Math.max(targetY-Math.max(0,(tick*1.5-i*8)),startY); return <circle key={i} cx={80+i*22} cy={cy} r={3.5} fill={c+"90"}/>;
                })}
                <text x={160} y={30} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>TMA molecules approaching</text>
              </>)},
              { icon: "💨", title: "Purge: Remove Excess", desc: "N₂ gas flushes out unreacted TMA and CH₄ byproducts. Critical to avoid CVD contamination.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={20} rx={3} fill={c+"20"} stroke={c} strokeWidth={1}/>
                <text x={160} y={124} textAnchor="middle" fill={c} fontSize={8}>Al-CH₃ on surface</text>
                {Array.from({length:5},(_,i)=><circle key={i} cx={80+i*30+(tick*2)%200} cy={70+Math.sin(tick*0.1+i)*15} r={2.5} fill={T.muted+"60"}/>)}
                <text x={160} y={40} textAnchor="middle" fill={T.syn_cvd} fontSize={10} fontWeight={700}>N₂ purge →</text>
              </>)},
              { icon: "2️⃣", title: "Pulse B: H₂O Reaction", desc: "Water vapor reacts with Al-CH₃ surface to form Al-OH. One monolayer of Al₂O₃ complete.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={20} rx={3} fill={c+"30"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={124} textAnchor="middle" fill={c} fontSize={8}>Al₂O₃ monolayer formed</text>
                {Array.from({length:6},(_,i)=>{const targetY=108; const cy=Math.max(targetY-Math.max(0,(tick*1.2-i*6)),30); return <circle key={i} cx={90+i*25} cy={cy} r={3} fill={T.syn_hydro+"80"}/>;
                })}
                <text x={160} y={25} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>H₂O molecules</text>
              </>)},
              { icon: "🔄", title: "Repeat: Build Thickness", desc: "Each cycle adds ~1 Å. 100 cycles = 10 nm Al₂O₃. Perfect thickness control.", render: (tick, c) => (<>
                <rect x={60} y={120} width={200} height={15} rx={3} fill={T.syn_sol+"20"}/>
                <text x={160} y={131} textAnchor="middle" fill={T.syn_sol} fontSize={7}>Si substrate</text>
                {Array.from({length:Math.min(Math.floor(tick/8)+1,10)},(_,i)=><rect key={i} x={60} y={118-i*4} width={200} height={3} rx={1} fill={c+((i%2===0)?"40":"60")}/>)}
                <text x={160} y={60} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Cycle {Math.min(Math.floor(tick/8)+1,10)} / 10</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="TiO₂ (ETL for perovskites)" eg="3.2 eV" method="Thermal ALD" recipe="TDMAT + H₂O at 150°C. ~0.5 Å/cycle. Compact, pinhole-free electron transport layer. 10-30 nm." eff="Used in >24% perovskite cells" color={T.syn_cvd}
            steps={[
              { icon: "1️⃣", title: "Pulse A: TDMAT Adsorption", desc: "TDMAT molecules chemisorb onto FTO substrate surface. Self-limiting reaction.", render: (tick, c) => (<>
                <rect x={60} y={115} width={200} height={18} rx={3} fill={T.syn_hydro+"20"} stroke={T.syn_hydro} strokeWidth={1}/>
                <text x={160} y={128} textAnchor="middle" fill={T.syn_hydro} fontSize={8}>FTO substrate</text>
                {Array.from({length:7},(_,i)=>{const cy=Math.max(112-Math.max(0,tick*1.5-i*7),30+i*3); return <circle key={i} cx={80+i*24} cy={cy} r={3} fill={c+"85"}/>;
                })}
                <text x={160} y={25} textAnchor="middle" fill={c} fontSize={9}>TDMAT molecules</text>
              </>)},
              { icon: "2️⃣", title: "Pulse B: H₂O Oxidation", desc: "Water vapor converts Ti-N bonds to Ti-O. Each cycle deposits ~0.5 Å of TiO₂.", render: (tick, c) => (<>
                <rect x={60} y={115} width={200} height={5} rx={1} fill={c+"50"}/>
                <rect x={60} y={120} width={200} height={15} rx={3} fill={T.syn_hydro+"20"}/>
                {Array.from({length:6},(_,i)=><circle key={i} cx={85+i*28} cy={Math.max(113-Math.max(0,tick*1.3-i*5),40)} r={3} fill={T.syn_hydro+"70"}/>)}
                <text x={160} y={30} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>H₂O pulse</text>
                <text x={160} y={148} textAnchor="middle" fill={c} fontSize={9}>~0.5 Å TiO₂ per cycle</text>
              </>)},
              { icon: "✅", title: "Complete: Pinhole-free ETL", desc: "60 cycles = 3 nm compact TiO₂. Blocks holes, passes electrons to FTO.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={12} rx={2} fill={c+"45"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={109} textAnchor="middle" fill={c} fontSize={8} fontWeight={700}>TiO₂ ETL (pinhole-free)</text>
                <rect x={60} y={112} width={200} height={15} rx={3} fill={T.syn_hydro+"20"}/>
                <text x={160} y={123} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>FTO</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={100+i*40} cy={85} r={3+Math.sin(tick*0.1+i)*1} fill={c+"50"}><animate attributeName="cy" values="85;98;85" dur="1.5s" repeatCount="indefinite" begin={`${i*0.3}s`}/></circle>)}
                <text x={160} y={75} textAnchor="middle" fill={c} fontSize={8}>e⁻ transport →</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="ZnO (TCO / buffer)" eg="3.3 eV" method="Thermal ALD" recipe="DEZn + H₂O at 150-200°C. ~1.8 Å/cycle. Cd-free buffer layer for CIGS replacing toxic CdS." eff="Cd-free CIGS buffer → ~21% cells" color={T.syn_main}
            steps={[
              { icon: "1️⃣", title: "Pulse A: DEZn Chemisorption", desc: "Diethylzinc (DEZn) reacts with surface -OH groups in self-limiting manner.", render: (tick, c) => (<>
                <rect x={60} y={115} width={200} height={18} rx={3} fill={T.syn_pvd+"15"} stroke={T.syn_pvd} strokeWidth={1}/>
                <text x={160} y={128} textAnchor="middle" fill={T.syn_pvd} fontSize={8}>CIGS absorber</text>
                {Array.from({length:6},(_,i)=>{const cy=Math.max(113-Math.max(0,tick*1.4-i*7),35+i*3); return <circle key={i} cx={85+i*27} cy={cy} r={3.5} fill={c+"85"}/>;
                })}
                <text x={160} y={28} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>DEZn molecules</text>
              </>)},
              { icon: "2️⃣", title: "Pulse B: H₂O → ZnO", desc: "Water completes the cycle. 1.8 Å ZnO per cycle. Al doping possible by adding TMA pulses.", render: (tick, c) => (<>
                <rect x={60} y={105} width={200} height={8} rx={2} fill={c+"40"} stroke={c} strokeWidth={1}/>
                <rect x={60} y={113} width={200} height={18} rx={3} fill={T.syn_pvd+"15"}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={95+i*30} cy={Math.max(103-Math.max(0,tick*1.2-i*6),40)} r={3} fill={T.syn_hydro+"70"}/>)}
                <text x={160} y={30} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>H₂O pulse</text>
                <text x={160} y={148} textAnchor="middle" fill={c} fontSize={9}>ZnO buffer on CIGS</text>
              </>)},
              { icon: "🔋", title: "Complete: CIGS Device Stack", desc: "ALD ZnO replaces toxic CdS buffer. Conformal coverage on rough CIGS surface.", render: (tick, c) => (<>
                <rect x={80} y={95} width={160} height={30} rx={3} fill={T.syn_pvd+"30"}/>
                <text x={160} y={114} textAnchor="middle" fill={T.syn_pvd} fontSize={8}>CIGS absorber</text>
                <rect x={80} y={82} width={160} height={13} rx={2} fill={c+"40"} stroke={c} strokeWidth={1}/>
                <text x={160} y={92} textAnchor="middle" fill={c} fontSize={7} fontWeight={700}>ALD ZnO buffer (Cd-free)</text>
                <rect x={80} y={68} width={160} height={14} rx={2} fill={T.syn_hydro+"25"}/>
                <text x={160} y={78} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>AZO window</text>
                {Array.from({length:3},(_,i)=><line key={i} x1={110+i*40} y1={60+Math.sin(tick*0.1+i)*3} x2={110+i*40} y2={45+Math.sin(tick*0.1+i)*3} stroke={T.syn_sol} strokeWidth={1.5}/>)}
              </>)}
            ]}
          />
          <SolarCellCard mat="SnO₂ (ETL for perovskites)" eg="3.6 eV" method="Thermal ALD" recipe="TDMASn + H₂O at 100-150°C. ~1.2 Å/cycle. Pinhole-free at 15 nm. Low-T flexible substrates." eff="Enables >25% perovskite cells" color={T.syn_pvd}
            steps={[
              { icon: "1️⃣", title: "Pulse A: TDMASn Adsorption", desc: "TDMASn chemisorbs on ITO surface. Self-limiting — only one monolayer reacts.", render: (tick, c) => (<>
                <rect x={60} y={115} width={200} height={18} rx={3} fill={T.syn_hydro+"20"} stroke={T.syn_hydro} strokeWidth={1}/>
                <text x={160} y={128} textAnchor="middle" fill={T.syn_hydro} fontSize={8}>ITO substrate</text>
                {Array.from({length:7},(_,i)=>{const cy=Math.max(113-Math.max(0,tick*1.3-i*6),30+i*4); return <circle key={i} cx={80+i*24} cy={cy} r={3} fill={c+"85"}/>;
                })}
                <text x={160} y={25} textAnchor="middle" fill={c} fontSize={9}>TDMASn molecules</text>
              </>)},
              { icon: "2️⃣", title: "Pulse B: H₂O Oxidation", desc: "H₂O completes SnO₂ formation. 1.2 Å per cycle at just 100-150°C.", render: (tick, c) => (<>
                <rect x={60} y={108} width={200} height={6} rx={2} fill={c+"50"}/>
                <rect x={60} y={114} width={200} height={18} rx={3} fill={T.syn_hydro+"20"}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={90+i*30} cy={Math.max(106-Math.max(0,tick*1.2-i*5),35)} r={3} fill={T.syn_hydro+"70"}/>)}
                <text x={160} y={28} textAnchor="middle" fill={T.syn_hydro} fontSize={9}>H₂O pulse</text>
                <text x={160} y={148} textAnchor="middle" fill={c} fontSize={9}>SnO₂ at 100°C (flexible-compatible)</text>
              </>)},
              { icon: "✅", title: "Complete: 15 nm Pinhole-free ETL", desc: "Just 12 cycles = 15 nm. Better band alignment than TiO₂ for wide-gap perovskites.", render: (tick, c) => (<>
                <rect x={80} y={95} width={160} height={10} rx={2} fill={c+"45"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={103} textAnchor="middle" fill={c} fontSize={7} fontWeight={700}>SnO₂ ETL (15 nm)</text>
                <rect x={80} y={105} width={160} height={15} rx={2} fill={T.syn_hydro+"20"}/>
                <text x={160} y={115} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>ITO</text>
                <rect x={80} y={70} width={160} height={25} rx={3} fill={T.syn_sol+"20"}/>
                <text x={160} y={86} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Perovskite absorber</text>
                {Array.from({length:3},(_,i)=><circle key={i} cx={110+i*35} cy={60+Math.sin(tick*0.12+i)*5} r={2.5} fill={c+"50"}><animate attributeName="cy" values={`${60};${93};${60}`} dur="2s" repeatCount="indefinite" begin={`${i*0.4}s`}/></circle>)}
              </>)}
            ]}
          />
          <SolarCellCard mat="Ga₂O₃ (passivation for CIGS)" eg="4.8 eV" method="Plasma-enhanced ALD" recipe="TMGa + O₂ plasma at 150°C. Ultrathin 2-5 nm passivation between CIGS and buffer." eff="Boosts CIGS Voc by 30-50 mV" color={T.syn_sol}
            steps={[
              { icon: "⚡", title: "Step 1: TMGa + O₂ Plasma", desc: "Plasma-enhanced ALD uses O₂ plasma instead of H₂O — more reactive, lower temperatures.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={18} rx={3} fill={T.syn_pvd+"15"} stroke={T.syn_pvd} strokeWidth={1}/>
                <text x={160} y={123} textAnchor="middle" fill={T.syn_pvd} fontSize={8}>CIGS surface</text>
                {Array.from({length:6},(_,i)=><circle key={i} cx={85+i*27} cy={Math.max(108-Math.max(0,tick*1.5-i*6),35)} r={3} fill={c+"80"}/>)}
                {Array.from({length:4},(_,i)=><line key={i+10} x1={100+i*35} y1={50} x2={100+i*35+Math.sin(tick*0.2+i)*10} y2={70} stroke={T.syn_pvd+"50"} strokeWidth={1.5}/>)}
                <text x={160} y={28} textAnchor="middle" fill={c} fontSize={9}>TMGa + O₂ plasma</text>
              </>)},
              { icon: "🧱", title: "Step 2: Ultrathin 2-5 nm Layer", desc: "Only 2-5 cycles needed. Ga₂O₃ passivates dangling bonds on CIGS surface.", render: (tick, c) => (<>
                <rect x={60} y={100} width={200} height={30} rx={3} fill={T.syn_pvd+"20"}/>
                <text x={160} y={119} textAnchor="middle" fill={T.syn_pvd} fontSize={8}>CIGS absorber</text>
                {Array.from({length:Math.min(Math.floor(tick/12)+1,5)},(_,i)=><rect key={i} x={60} y={98-i*3} width={200} height={2} rx={1} fill={c+((i%2===0)?"50":"70")}/>)}
                <text x={160} y={70} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Ga₂O₃ — {Math.min(Math.floor(tick/12)+1,5)} Å</text>
              </>)},
              { icon: "📈", title: "Step 3: Voc Improvement", desc: "Interface passivation reduces recombination. Voc increases by 30-50 mV.", render: (tick, c) => (<>
                <rect x={60} y={95} width={200} height={4} rx={1} fill={c+"60"} stroke={c} strokeWidth={1}/>
                <rect x={60} y={99} width={200} height={35} rx={3} fill={T.syn_pvd+"20"}/>
                <text x={160} y={120} textAnchor="middle" fill={T.syn_pvd} fontSize={8}>CIGS</text>
                <text x={160} y={90} textAnchor="middle" fill={c} fontSize={8}>Ga₂O₃ passivation</text>
                <text x={80} y={40} fill={T.syn_ald} fontSize={9}>Without:</text>
                <text x={80} y={55} fill={T.syn_ald} fontSize={11} fontWeight={700}>Voc = 0.72V</text>
                <text x={200} y={40} fill={T.syn_main} fontSize={9}>With Ga₂O₃:</text>
                <text x={200} y={55} fill={T.syn_main} fontSize={11} fontWeight={700}>Voc = 0.76V</text>
                <line x1={160} y1={35} x2={160} y2={60} stroke={T.border} strokeWidth={1}/>
              </>)}
            ]}
          />
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

      <FAQAccordion title="Solar Cell Absorbers by MBE" color={T.syn_main} isOpen={openItem === "mbe_solar"} onClick={() => toggle("mbe_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>MBE produces the highest-quality single-crystal films — record-efficiency III-V solar cells are grown by MBE:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="GaAs" eg="1.42 eV (direct)" method="MBE on GaAs(100)" recipe="Ga + As₄ beams, substrate 580-620°C, As/Ga BEP ratio ~15-20. Growth rate ~1 μm/hr." eff="~29.1% (single junction world record)" color={T.syn_mbe}
            steps={[
              { icon: "🔬", title: "Step 1: UHV Chamber + Beams", desc: "Effusion cells heat Ga and As sources. Molecular beams directed at heated GaAs substrate in 10⁻¹⁰ Torr.", render: (tick, c) => (<>
                <rect x={80} y={25} width={160} height={15} rx={3} fill={T.syn_sol+"25"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={36} textAnchor="middle" fill={T.syn_sol} fontSize={8}>GaAs substrate 600°C</text>
                <rect x={30} y={110} width={45} height={30} rx={5} fill={c+"20"} stroke={c} strokeWidth={1}/>
                <text x={52} y={130} textAnchor="middle" fill={c} fontSize={8}>Ga</text>
                <rect x={245} y={110} width={45} height={30} rx={5} fill={T.syn_main+"20"} stroke={T.syn_main} strokeWidth={1}/>
                <text x={267} y={130} textAnchor="middle" fill={T.syn_main} fontSize={8}>As₄</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={75+i*5+(tick*1.5+i*10)%70} cy={108-(tick*1.2+i*12)%75} r={2.5} fill={c+"80"}/>)}
                {Array.from({length:4},(_,i)=><circle key={i+4} cx={245-i*5-(tick*1.5+i*10)%70} cy={108-(tick*1.2+i*12)%75} r={2.5} fill={T.syn_main+"80"}/>)}
              </>)},
              { icon: "📐", title: "Step 2: Epitaxial Growth", desc: "Atoms land in registry with substrate crystal lattice. RHEED monitors surface in real-time.", render: (tick, c) => (<>
                <rect x={80} y={80} width={160} height={20} rx={3} fill={T.syn_sol+"20"}/>
                {Array.from({length:20},(_,i)=>{const row=Math.floor(i/10); const col=i%10; return <circle key={i} cx={90+col*16} cy={85+row*10} r={2} fill={c+"60"}/>;
                })}
                <rect x={80} y={70} width={160} height={Math.min(tick*0.3,10)} rx={1} fill={c+"40"} stroke={c} strokeWidth={0.5}/>
                {Array.from({length:5},(_,i)=><circle key={i+20} cx={100+i*30} cy={50+Math.sin(tick*0.15+i)*10} r={3} fill={c+"90"}><animate attributeName="cy" values={`${50};${68};${50}`} dur="1.5s" repeatCount="indefinite" begin={`${i*0.2}s`}/></circle>)}
                <text x={160} y={125} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Epitaxial GaAs</text>
              </>)},
              { icon: "📊", title: "Step 3: AlGaAs Window Layer", desc: "Al shutter opens — AlGaAs window layer reduces surface recombination. Abrupt interface.", render: (tick, c) => (<>
                <rect x={80} y={90} width={160} height={25} rx={3} fill={c+"30"}/>
                <text x={160} y={107} textAnchor="middle" fill={c} fontSize={8}>GaAs absorber</text>
                <rect x={80} y={75} width={160} height={Math.min(tick*0.4,15)} rx={2} fill={T.syn_pvd+"40"} stroke={T.syn_pvd} strokeWidth={1}/>
                <text x={160} y={72} textAnchor="middle" fill={T.syn_pvd} fontSize={9} fontWeight={700}>AlGaAs window</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={100+i*35} cy={50+Math.sin(tick*0.12+i)*12} r={3} fill={T.syn_pvd+"80"}><animate attributeName="cy" values={`${45};${73};${45}`} dur="2s" repeatCount="indefinite" begin={`${i*0.3}s`}/></circle>)}
              </>)},
              { icon: "✂️", title: "Step 4: Epitaxial Lift-Off", desc: "Sacrificial AlAs layer dissolved — ultrathin GaAs cell peeled off for flexible/lightweight PV.", render: (tick, c) => (<>
                <rect x={80} y={105} width={160} height={20} rx={3} fill={T.syn_sol+"20"}/>
                <text x={160} y={119} textAnchor="middle" fill={T.syn_sol} fontSize={7}>GaAs wafer (reusable)</text>
                <rect x={80} y={100} width={160} height={5} rx={1} fill={T.syn_main+"30"} strokeDasharray="4,3" stroke={T.syn_main} strokeWidth={0.5}/>
                <rect x={80} y={70-Math.min(tick*0.3,25)} width={160} height={30} rx={3} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={88-Math.min(tick*0.3,25)} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>GaAs solar cell</text>
                <text x={160} y={145} textAnchor="middle" fill={T.syn_main} fontSize={8}>HF dissolves AlAs</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="InGaP/GaAs/InGaAs (triple junction)" eg="1.9/1.42/1.0 eV" method="MBE multi-layer" recipe="Lattice-matched InGaP / GaAs / InGaAs. Tunnel junctions between each cell. ~10 μm total." eff="~39.2% (1-sun), ~47.6% (concentrated)" color={T.syn_cvd}
            steps={[
              { icon: "1️⃣", title: "Step 1: Bottom Cell (InGaAs)", desc: "Grow InGaAs (1.0 eV) on Ge substrate. Absorbs near-infrared photons.", render: (tick, c) => (<>
                <rect x={80} y={110} width={160} height={20} rx={3} fill={T.muted+"20"}/>
                <text x={160} y={124} textAnchor="middle" fill={T.muted} fontSize={8}>Ge substrate</text>
                <rect x={80} y={80} width={160} height={Math.min(tick*0.5,30)} rx={3} fill={T.syn_main+"30"} stroke={T.syn_main} strokeWidth={1}/>
                <text x={160} y={100} textAnchor="middle" fill={T.syn_main} fontSize={8}>InGaAs (1.0 eV)</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={100+i*35} cy={60+(tick+i*8)%30} r={2.5} fill={T.syn_main+"80"}/>)}
              </>)},
              { icon: "2️⃣", title: "Step 2: Middle Cell (GaAs)", desc: "Grow tunnel junction then GaAs (1.42 eV). Absorbs visible light.", render: (tick, c) => (<>
                <rect x={80} y={110} width={160} height={15} rx={2} fill={T.syn_main+"30"}/>
                <text x={160} y={121} textAnchor="middle" fill={T.syn_main} fontSize={7}>InGaAs</text>
                <rect x={80} y={105} width={160} height={5} rx={1} fill={T.syn_ald+"40"}/>
                <rect x={80} y={75} width={160} height={Math.min(tick*0.5,30)} rx={3} fill={c+"30"} stroke={c} strokeWidth={1}/>
                <text x={160} y={95} textAnchor="middle" fill={c} fontSize={8}>GaAs (1.42 eV)</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={105+i*35} cy={50+(tick+i*7)%30} r={2.5} fill={c+"80"}/>)}
              </>)},
              { icon: "3️⃣", title: "Step 3: Top Cell (InGaP)", desc: "Grow tunnel junction then InGaP (1.9 eV). Absorbs blue/UV photons.", render: (tick, c) => (<>
                <rect x={80} y={120} width={160} height={12} rx={2} fill={T.syn_main+"25"}/>
                <rect x={80} y={100} width={160} height={20} rx={2} fill={c+"25"}/>
                <rect x={80} y={95} width={160} height={5} rx={1} fill={T.syn_ald+"40"}/>
                <rect x={80} y={65} width={160} height={Math.min(tick*0.5,30)} rx={3} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={85} textAnchor="middle" fill={T.syn_sol} fontSize={8}>InGaP (1.9 eV)</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={100+i*35} cy={40+(tick+i*6)%30} r={2.5} fill={T.syn_sol+"80"}/>)}
              </>)},
              { icon: "☀️", title: "Step 4: Complete Triple Junction", desc: "Each subcell absorbs different wavelengths. Concentrated sunlight → 47.6% efficiency.", render: (tick, c) => (<>
                <rect x={100} y={40} width={120} height={15} rx={2} fill={T.syn_sol+"35"}/>
                <text x={160} y={51} textAnchor="middle" fill={T.syn_sol} fontSize={7}>InGaP 1.9eV (UV/blue)</text>
                <rect x={100} y={55} width={120} height={3} rx={1} fill={T.syn_ald+"40"}/>
                <rect x={100} y={58} width={120} height={15} rx={2} fill={c+"30"}/>
                <text x={160} y={69} textAnchor="middle" fill={c} fontSize={7}>GaAs 1.42eV (visible)</text>
                <rect x={100} y={73} width={120} height={3} rx={1} fill={T.syn_ald+"40"}/>
                <rect x={100} y={76} width={120} height={15} rx={2} fill={T.syn_main+"30"}/>
                <text x={160} y={87} textAnchor="middle" fill={T.syn_main} fontSize={7}>InGaAs 1.0eV (IR)</text>
                {[T.syn_sol,c,T.syn_main].map((cl,i)=><line key={i} x1={80+Math.sin(tick*0.1+i)*5} y1={20+i*3} x2={100} y2={40+i*18} stroke={cl} strokeWidth={1.5} opacity={0.6}/>)}
                <text x={160} y={110} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>47.6% under concentration</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CdTe/CdSe quantum dots" eg="Tunable (QD size)" method="MBE self-assembly" recipe="CdTe on ZnTe or CdSe on ZnSe. Stranski-Krastanov mode forms QDs at 2-5 ML. QD size 3-8 nm." eff="Research stage (intermediate band PV)" color={T.syn_pvd}
            steps={[
              { icon: "🧱", title: "Step 1: Wetting Layer Growth", desc: "First 1-2 monolayers grow flat (Frank-van der Merwe). Lattice strain accumulates.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={20} rx={3} fill={T.syn_main+"20"} stroke={T.syn_main} strokeWidth={1}/>
                <text x={160} y={124} textAnchor="middle" fill={T.syn_main} fontSize={8}>ZnTe substrate</text>
                <rect x={60} y={100} width={200} height={Math.min(tick*0.3,10)} rx={1} fill={c+"40"} stroke={c} strokeWidth={0.5}/>
                <text x={160} y={85} textAnchor="middle" fill={c} fontSize={9}>CdTe wetting layer growing</text>
              </>)},
              { icon: "🔮", title: "Step 2: QD Self-Assembly", desc: "At 2-5 ML coverage, strain relaxation triggers 3D island formation (Stranski-Krastanov).", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={20} rx={3} fill={T.syn_main+"20"}/>
                <rect x={60} y={105} width={200} height={5} rx={1} fill={c+"30"}/>
                {Array.from({length:6},(_,i)=>{const sz=Math.min(tick*0.2,4+i*0.5); return <circle key={i} cx={80+i*32} cy={103-sz} r={sz} fill={c+"60"} stroke={c} strokeWidth={0.5}/>;
                })}
                <text x={160} y={80} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>QDs nucleate spontaneously</text>
              </>)},
              { icon: "🌈", title: "Step 3: Size-Tunable Bandgap", desc: "QD diameter 3-8 nm controls bandgap through quantum confinement.", render: (tick, c) => (<>
                {[3,4,5,6,7,8].map((sz,i)=><g key={i}><circle cx={60+i*45} cy={80} r={sz*1.5} fill={c+((10-i)*10).toString()} stroke={c} strokeWidth={0.5}/><text x={60+i*45} y={80+sz*1.5+12} textAnchor="middle" fill={c} fontSize={7}>{sz}nm</text></g>)}
                <text x={160} y={30} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Quantum confinement</text>
                <text x={60} y={130} fill={T.syn_ald} fontSize={8}>Large E_g</text>
                <text x={250} y={130} fill={T.syn_main} fontSize={8}>Small E_g</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="GaSb" eg="0.73 eV" method="MBE on GaSb(100)" recipe="Ga + Sb beams, substrate 500-530°C. Low bandgap for thermophotovoltaic (TPV) cells." eff="~32% (TPV, thermal radiation)" color={T.syn_sol}
            steps={[
              { icon: "🔬", title: "Step 1: MBE Growth of GaSb", desc: "Ga and Sb₂ beams directed at GaSb(100) substrate at 510°C in UHV.", render: (tick, c) => (<>
                <rect x={80} y={25} width={160} height={15} rx={3} fill={c+"25"} stroke={c} strokeWidth={1}/>
                <text x={160} y={36} textAnchor="middle" fill={c} fontSize={8}>GaSb substrate 510°C</text>
                <rect x={30} y={110} width={40} height={25} rx={4} fill={T.syn_mbe+"20"} stroke={T.syn_mbe} strokeWidth={1}/>
                <text x={50} y={127} textAnchor="middle" fill={T.syn_mbe} fontSize={7}>Ga</text>
                <rect x={250} y={110} width={40} height={25} rx={4} fill={c+"20"} stroke={c} strokeWidth={1}/>
                <text x={270} y={127} textAnchor="middle" fill={c} fontSize={7}>Sb₂</text>
                {Array.from({length:4},(_,i)=><circle key={i} cx={70+(tick*1.5+i*10)%90} cy={105-(tick*1.2+i*12)%70} r={2.5} fill={T.syn_mbe+"80"}/>)}
                {Array.from({length:4},(_,i)=><circle key={i+4} cx={250-(tick*1.5+i*10)%90} cy={105-(tick*1.2+i*12)%70} r={2.5} fill={c+"80"}/>)}
              </>)},
              { icon: "🔥", title: "Step 2: TPV Cell Structure", desc: "p-n junction GaSb with back surface field. Optimized for infrared absorption below 1.7 μm.", render: (tick, c) => (<>
                <rect x={80} y={60} width={160} height={25} rx={3} fill={c+"25"}/>
                <text x={160} y={77} textAnchor="middle" fill={c} fontSize={8}>p-GaSb (absorber)</text>
                <rect x={80} y={85} width={160} height={15} rx={3} fill={T.syn_mbe+"25"}/>
                <text x={160} y={96} textAnchor="middle" fill={T.syn_mbe} fontSize={8}>n-GaSb (emitter)</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={70} y1={40+i*8+Math.sin(tick*0.1+i)*3} x2={80} y2={65+i*5} stroke={T.syn_ald+"50"} strokeWidth={1.5}/>)}
                <text x={40} y={75} fill={T.syn_ald} fontSize={8} transform="rotate(-90,40,75)">IR photons</text>
              </>)},
              { icon: "☀️", title: "Step 3: Heat-to-Electricity", desc: "TPV converts infrared radiation from hot emitter (1000-1500°C) to electricity. 32% efficiency.", render: (tick, c) => (<>
                <rect x={40} y={40} width={80} height={80} rx={8} fill={T.syn_ald+"20"} stroke={T.syn_ald} strokeWidth={1.5}/>
                <text x={80} y={75} textAnchor="middle" fill={T.syn_ald} fontSize={9}>Hot emitter</text>
                <text x={80} y={90} textAnchor="middle" fill={T.syn_ald} fontSize={8}>1200°C</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={125} y1={55+i*12} x2={180+Math.sin(tick*0.15+i)*5} y2={55+i*12} stroke={T.syn_ald+"60"} strokeWidth={1.5} strokeDasharray="4,4"/>)}
                <rect x={190} y={40} width={80} height={80} rx={8} fill={c+"20"} stroke={c} strokeWidth={1.5}/>
                <text x={230} y={75} textAnchor="middle" fill={c} fontSize={9}>GaSb TPV</text>
                <text x={230} y={90} textAnchor="middle" fill={c} fontSize={8} fontWeight={700}>32%</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Perovskite/Si tandem" eg="1.7/1.12 eV" method="MBE for recombination layer" recipe="n⁺⁺-GaAs/p⁺⁺-GaAs tunnel junction (~20 nm) by MBE on Si. Perovskite top cell by solution." eff="Tandem concept >30% target" color={T.syn_ald}
            steps={[
              { icon: "🧱", title: "Step 1: MBE Tunnel Junction on Si", desc: "Grow atomically sharp n⁺⁺/p⁺⁺ GaAs tunnel junction (~20 nm) by MBE on silicon.", render: (tick, c) => (<>
                <rect x={80} y={100} width={160} height={25} rx={3} fill={T.syn_mbe+"15"} stroke={T.syn_mbe} strokeWidth={1}/>
                <text x={160} y={116} textAnchor="middle" fill={T.syn_mbe} fontSize={8}>Si bottom cell (1.12 eV)</text>
                <rect x={80} y={85} width={160} height={Math.min(tick*0.3,15)} rx={2} fill={c+"40"} stroke={c} strokeWidth={1}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={100+i*30} cy={60+(tick+i*8)%30} r={2} fill={c+"80"}/>)}
                <text x={160} y={50} textAnchor="middle" fill={c} fontSize={9}>MBE depositing tunnel junction</text>
              </>)},
              { icon: "🧪", title: "Step 2: Solution-Coat Perovskite", desc: "Spin coat wide-gap perovskite (1.7 eV) top cell on the MBE tunnel junction.", render: (tick, c) => (<>
                <rect x={80} y={100} width={160} height={15} rx={2} fill={T.syn_mbe+"15"}/>
                <text x={160} y={111} textAnchor="middle" fill={T.syn_mbe} fontSize={7}>Si cell</text>
                <rect x={80} y={90} width={160} height={10} rx={2} fill={c+"35"}/>
                <text x={160} y={98} textAnchor="middle" fill={c} fontSize={6}>Tunnel junction</text>
                <rect x={80} y={60} width={160} height={Math.min(tick*0.5,30)} rx={3} fill={T.syn_sol+"30"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={78} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Perovskite (1.7 eV)</text>
              </>)},
              { icon: "☀️", title: "Step 3: >30% Tandem", desc: "Perovskite absorbs blue/green, Si absorbs red/IR. Together they exceed 30% efficiency.", render: (tick, c) => (<>
                <rect x={90} y={50} width={140} height={20} rx={3} fill={T.syn_sol+"30"}/>
                <text x={160} y={64} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Perovskite 1.7eV</text>
                <rect x={90} y={72} width={140} height={5} rx={1} fill={c+"40"}/>
                <rect x={90} y={77} width={140} height={25} rx={3} fill={T.syn_mbe+"20"}/>
                <text x={160} y={94} textAnchor="middle" fill={T.syn_mbe} fontSize={8}>Si 1.12eV</text>
                {[T.syn_sol,T.syn_cvd,T.syn_main].map((cl,i)=><line key={i} x1={120+i*20+Math.sin(tick*0.12+i)*3} y1={25} x2={120+i*20} y2={50} stroke={cl} strokeWidth={1.5} opacity={0.6}/>)}
                <text x={160} y={125} textAnchor="middle" fill={c} fontSize={11} fontWeight={700}>Target: {">"}30% PCE</text>
              </>)}
            ]}
          />
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

  const thickness = 100 * Math.sqrt(visc / rpm) * conc / 5;

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

      <FAQAccordion title="Solar Cell Absorbers by Spin Coating" color={T.syn_main} isOpen={openItem === "sc_solar"} onClick={() => toggle("sc_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>Spin coating is the dominant lab-scale method for perovskite and organic solar cells — simple, fast, and cheap:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="MAPbI₃ (methylammonium lead iodide)" eg="1.55 eV" method="1-step anti-solvent" recipe="1.2M PbI₂ + MAI in DMF:DMSO (4:1). Spin 1000→4000 rpm. Drip chlorobenzene at 15s. Anneal 100°C." eff="~21% (single cation)" color={T.syn_spin}
            steps={[
              { icon: "💧", title: "Step 1: Drop Solution", desc: "Pipette perovskite precursor solution (PbI₂ + MAI in DMF:DMSO) onto substrate center.", render: (tick, c) => (<>
                <ellipse cx={160} cy={100} rx={70} ry={16} fill={T.syn_sol+"15"} stroke={T.syn_sol} strokeWidth={1}/>
                <circle cx={160} cy={Math.min(30+tick*1.5,70)} r={6} fill={c+"80"} stroke={c} strokeWidth={1}/>
                {tick>25 && <ellipse cx={160} cy={100} rx={Math.min((tick-25)*2,40)} ry={Math.min((tick-25)*0.5,10)} fill={c+"30"}/>}
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>Drop precursor solution</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin at 4000 RPM", desc: "Two-stage spin: 1000 rpm 10s then 4000 rpm 30s. Centrifugal force thins film.", render: (tick, c) => (<>
                <ellipse cx={160} cy={85} rx={75+Math.sin(tick*0.15)*5} ry={18} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                <ellipse cx={160} cy={85} rx={45} ry={11} fill={c+"20"}/>
                <ellipse cx={160} cy={85} rx={15} ry={4} fill={c+"35"}/>
                <line x1={160} y1={85} x2={160+Math.cos(tick*0.35)*60} y2={85+Math.sin(tick*0.35)*15} stroke={c} strokeWidth={2}/>
                <text x={160} y={125} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>4000 RPM</text>
              </>)},
              { icon: "💧", title: "Step 3: Anti-solvent Drip", desc: "Chlorobenzene dripped at 15s — extracts DMF/DMSO, triggering instant perovskite nucleation.", render: (tick, c) => (<>
                <ellipse cx={160} cy={95} rx={70} ry={16} fill={c+"15"} stroke={c} strokeWidth={1}/>
                <line x1={160} y1={85} x2={160+Math.cos(tick*0.3)*55} y2={95+Math.sin(tick*0.3)*13} stroke={c} strokeWidth={1.5}/>
                <circle cx={160} cy={Math.max(20,95-((tick*2)%80))} r={5} fill={T.syn_hydro+"80"}/>
                <text x={160} y={18} textAnchor="middle" fill={T.syn_hydro} fontSize={8}>Chlorobenzene</text>
                {tick>15 && Array.from({length:8},(_,i)=><rect key={i} x={120+i*12-2} y={91} width={4} height={4} fill={c+"70"} transform={`rotate(${45+i*12},${120+i*12},93)`}/>)}
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>Crystals nucleate instantly</text>
              </>)},
              { icon: "🔥", title: "Step 4: Anneal 100°C", desc: "10 min on hotplate completes crystallization. Golden-brown mirror MAPbI₃ film.", render: (tick, c) => (<>
                <rect x={80} y={65} width={160} height={25} rx={4} fill={c+"50"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={82} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>MAPbI₃ mirror</text>
                {Array.from({length:6},(_,i)=><line key={i} x1={95+i*25} y1={95} x2={95+i*25+Math.sin(tick*0.15+i)*5} y2={115+Math.sin(tick*0.1+i)*10} stroke={T.syn_ald+"45"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={145} textAnchor="middle" fill={T.syn_ald} fontSize={9}>100°C hotplate, 10 min</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="FAPbI₃ (formamidinium lead iodide)" eg="1.48 eV" method="2-step sequential" recipe="Step 1: Spin PbI₂ in DMF. Step 2: Dip in FAI/IPA. Anneal 150°C. MACl additive." eff="~25.7% (with MACl additive)" color={T.syn_cvd}
            steps={[
              { icon: "1️⃣", title: "Step 1: Spin PbI₂ Layer", desc: "Spin coat PbI₂ in DMF (1.3M) at 3000 rpm onto substrate. Yellow PbI₂ film forms.", render: (tick, c) => (<>
                <ellipse cx={160} cy={85} rx={70} ry={16} fill={T.syn_sol+"15"} stroke={T.syn_sol} strokeWidth={1}/>
                <line x1={160} y1={85} x2={160+Math.cos(tick*0.3)*55} y2={85+Math.sin(tick*0.3)*13} stroke={T.syn_sol} strokeWidth={2}/>
                <rect x={90} y={90} width={140} height={Math.min(tick*0.3,8)} rx={2} fill={T.syn_sol+"40"}/>
                <text x={160} y={120} textAnchor="middle" fill={T.syn_sol} fontSize={9}>PbI₂ film (yellow)</text>
              </>)},
              { icon: "2️⃣", title: "Step 2: Dip in FAI Solution", desc: "Immerse PbI₂ film in FAI/IPA (10 mg/mL) at 60°C for 5 min. FAI intercalates into PbI₂.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={80} rx={8} fill={T.syn_hydro+"08"} stroke={T.syn_hydro} strokeWidth={1}/>
                <rect x={130} y={45} width={10} height={70} rx={2} fill={T.syn_sol+"30"}/>
                {Array.from({length:8},(_,i)=><circle key={i} cx={100+i*18} cy={70+Math.sin(tick*0.1+i)*20} r={2.5} fill={c+"60"}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>FAI/IPA intercalation at 60°C</text>
              </>)},
              { icon: "🔥", title: "Step 3: Anneal 150°C", desc: "Anneal converts PbI₂+FAI to black α-FAPbI₃. MACl additive helps stabilize the phase.", render: (tick, c) => (<>
                <rect x={80} y={60} width={160} height={25} rx={4} fill={c+"50"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={77} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>α-FAPbI₃ (black)</text>
                {Array.from({length:5},(_,i)=><line key={i} x1={100+i*28} y1={90} x2={100+i*28+Math.sin(tick*0.12+i)*5} y2={110+Math.sin(tick*0.1+i)*10} stroke={T.syn_ald+"45"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={140} textAnchor="middle" fill={T.syn_ald} fontSize={9}>150°C anneal, 15 min</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="RbCsMAFA perovskite (quadruple cation)" eg="1.53-1.63 eV" method="1-step spin coating" recipe="FAI + MABr + CsI + RbI + PbI₂ + PbBr₂ in DMF:DMSO. Anti-solvent at 25s. Anneal 100°C." eff="~26.1% (quadruple cation record)" color={T.syn_pvd}
            steps={[
              { icon: "🧪", title: "Step 1: Multi-cation Ink", desc: "Mix 4 cations (Rb, Cs, MA, FA) + 2 halides (I, Br) with Pb salts in DMF:DMSO.", render: (tick, c) => (<>
                <rect x={80} y={40} width={160} height={80} rx={10} fill={c+"10"} stroke={c} strokeWidth={1.5}/>
                {["Rb⁺","Cs⁺","MA⁺","FA⁺"].map((l,i)=><circle key={i} cx={105+i*30} cy={70+Math.sin(tick*0.1+i*1.3)*18} r={7} fill={[T.syn_ald,T.syn_hydro,T.syn_sol,c][i]+"40"}/>)}
                {["Rb⁺","Cs⁺","MA⁺","FA⁺"].map((l,i)=><text key={i+4} x={105+i*30} y={73+Math.sin(tick*0.1+i*1.3)*18} textAnchor="middle" fill={[T.syn_ald,T.syn_hydro,T.syn_sol,c][i]} fontSize={6} fontWeight={700}>{l}</text>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>Quadruple cation solution</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin + Anti-solvent", desc: "Spin at 4000 rpm with diethyl ether anti-solvent at 25s. Extremely uniform nucleation.", render: (tick, c) => (<>
                <ellipse cx={160} cy={80} rx={75} ry={18} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                <line x1={160} y1={80} x2={160+Math.cos(tick*0.3)*60} y2={80+Math.sin(tick*0.3)*15} stroke={c} strokeWidth={2}/>
                <circle cx={160} cy={Math.max(15,80-((tick*1.8)%70))} r={4} fill={T.syn_hydro+"80"}/>
                <text x={160} y={115} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Anti-solvent at 25s</text>
              </>)},
              { icon: "🔥", title: "Step 3: Anneal + Crystallize", desc: "100°C for 1 hour. All four cations co-crystallize into highly stable perovskite lattice.", render: (tick, c) => (<>
                <rect x={80} y={55} width={160} height={30} rx={4} fill={c+"50"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={74} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>RbCsMAFA perovskite</text>
                {Array.from({length:4},(_,i)=><line key={i} x1={110+i*30} y1={90} x2={110+i*30+Math.sin(tick*0.12+i)*4} y2={108+Math.sin(tick*0.1+i)*8} stroke={T.syn_ald+"45"} strokeWidth={2} strokeLinecap="round"/>)}
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>100°C anneal, 1 hr — 26.1% PCE</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Sn-Pb perovskite (narrow gap)" eg="1.2-1.3 eV" method="1-step in glovebox" recipe="FASnI₃ + MAPbI₃ 50:50. SnF₂ additive. MUST spin in N₂ glovebox. Anti-solvent toluene." eff="~23.1% (in 4T tandem)" color={T.syn_main}
            steps={[
              { icon: "🧪", title: "Step 1: Mix Sn-Pb Solution", desc: "Mix FASnI₃ + MAPbI₃ (50:50) with 10% SnF₂ to prevent Sn²⁺ oxidation.", render: (tick, c) => (<>
                <rect x={90} y={45} width={140} height={70} rx={8} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={110+i*25} cy={75+Math.sin(tick*0.1+i)*18} r={5} fill={i<3?c+"50":T.syn_pvd+"50"}/>)}
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>Sn²⁺/Pb²⁺ mixed precursor</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin in N₂ Glovebox", desc: "Spin coat MUST be done in inert atmosphere (<0.1 ppm O₂). Sn²⁺ oxidizes instantly in air.", render: (tick, c) => (<>
                <rect x={40} y={30} width={240} height={110} rx={12} fill={T.syn_cvd+"06"} stroke={T.syn_cvd} strokeWidth={1.5} strokeDasharray="6,4"/>
                <text x={160} y={48} textAnchor="middle" fill={T.syn_cvd} fontSize={9} fontWeight={700}>N₂ Glovebox ({"<"}0.1 ppm O₂)</text>
                <ellipse cx={160} cy={90} rx={60} ry={14} fill={c+"15"} stroke={c} strokeWidth={1}/>
                <line x1={160} y1={90} x2={160+Math.cos(tick*0.3)*45} y2={90+Math.sin(tick*0.3)*11} stroke={c} strokeWidth={2}/>
              </>)},
              { icon: "💧", title: "Step 3: Anti-solvent + Anneal", desc: "Toluene anti-solvent triggers crystallization. Narrow 1.2 eV gap — perfect bottom cell for tandems.", render: (tick, c) => (<>
                <rect x={80} y={60} width={160} height={25} rx={4} fill={c+"45"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={77} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Sn-Pb perovskite (1.2 eV)</text>
                <rect x={80} y={40} width={160} height={20} rx={3} fill={T.syn_sol+"25"}/>
                <text x={160} y={54} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Wide-gap perovskite top cell</text>
                {Array.from({length:3},(_,i)=><line key={i} x1={110+i*40+Math.sin(tick*0.12+i)*3} y1={25} x2={110+i*40} y2={40} stroke={T.syn_sol} strokeWidth={1.5} opacity={0.5}/>)}
                <text x={160} y={110} textAnchor="middle" fill={c} fontSize={9}>All-perovskite tandem: 23.1%</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="PM6:Y6 (organic solar cell)" eg="1.4 eV (optical gap)" method="Spin from solution" recipe="PM6:Y6 (1:1.2) in chloroform + 0.5% DIO, 16 mg/mL. Spin 3000 rpm 30s. Anneal 100°C." eff="~19.3% (organic PV record)" color={T.syn_sol}
            steps={[
              { icon: "🧪", title: "Step 1: Dissolve Donor:Acceptor", desc: "PM6 (donor) and Y6 (acceptor) dissolved 1:1.2 in chloroform with DIO additive.", render: (tick, c) => (<>
                <rect x={90} y={45} width={140} height={70} rx={8} fill={c+"10"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:5},(_,i)=><circle key={i} cx={110+i*25} cy={75+Math.sin(tick*0.1+i)*18} r={5} fill={i%2===0?c+"50":T.syn_pvd+"40"}/>)}
                {Array.from({length:5},(_,i)=><text key={i+5} x={110+i*25} y={78+Math.sin(tick*0.1+i)*18} textAnchor="middle" fill={i%2===0?c:T.syn_pvd} fontSize={5} fontWeight={700}>{i%2===0?"D":"A"}</text>)}
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9}>PM6:Y6 blend in CHCl₃</text>
              </>)},
              { icon: "🌀", title: "Step 2: Spin Coat BHJ", desc: "Spin at 3000 rpm 30s. Donor and acceptor phase-separate into bulk heterojunction (BHJ).", render: (tick, c) => (<>
                <ellipse cx={160} cy={80} rx={70} ry={16} fill={c+"12"} stroke={c} strokeWidth={1.5}/>
                <line x1={160} y1={80} x2={160+Math.cos(tick*0.3)*55} y2={80+Math.sin(tick*0.3)*13} stroke={c} strokeWidth={2}/>
                <text x={160} y={115} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>3000 RPM, 30s</text>
                <text x={160} y={135} textAnchor="middle" fill={T.muted} fontSize={8}>BHJ morphology forming</text>
              </>)},
              { icon: "🔥", title: "Step 3: Anneal + BHJ Optimization", desc: "100°C 10 min optimizes domain size to 20-30 nm — ideal for exciton diffusion length.", render: (tick, c) => (<>
                <rect x={80} y={55} width={160} height={40} rx={4} fill={c+"15"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:12},(_,i)=>{const x=90+i*13; const y=65+(i%3)*10; return <rect key={i} x={x} y={y} width={8+Math.sin(tick*0.05+i)*2} height={8+Math.cos(tick*0.05+i)*2} rx={2} fill={i%2===0?c+"40":T.syn_pvd+"30"}/>;
                })}
                <text x={160} y={110} textAnchor="middle" fill={c} fontSize={9}>20-30 nm BHJ domains</text>
                <text x={160} y={135} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Organic PV: 19.3% PCE</text>
              </>)}
            ]}
          />
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

      <FAQAccordion title="Solar Cell Absorbers by Hydrothermal" color={T.syn_main} isOpen={openItem === "ht_solar"} onClick={() => toggle("ht_solar")}>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: T.muted, marginBottom: 8 }}>Hydrothermal synthesis produces nanostructured materials for solar cells — nanowires, nanoparticles, and quantum dots:</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SolarCellCard mat="ZnO nanowire arrays (ETL)" eg="3.3 eV" method="Hydrothermal growth on seed layer" recipe="Seed: Zn acetate spin coat, 350°C. Growth: 25mM Zn(NO₃)₂ + HMTA, 90°C, 4 hrs. ~50 nm dia, ~1 μm long." eff="Enables ~18% perovskite on nanowire ETL" color={T.syn_hydro}
            steps={[
              { icon: "🌱", title: "Step 1: Seed Layer", desc: "Spin coat Zn acetate/ethanol, anneal 350°C. ZnO nanocrystal seeds form on substrate.", render: (tick, c) => (<>
                <rect x={60} y={105} width={200} height={18} rx={3} fill={T.syn_sol+"20"} stroke={T.syn_sol} strokeWidth={1}/>
                <text x={160} y={117} textAnchor="middle" fill={T.syn_sol} fontSize={8}>FTO substrate</text>
                {Array.from({length:15},(_,i)=><circle key={i} cx={70+i*14} cy={103} r={Math.min(tick*0.15,2.5)} fill={c+"70"}/>)}
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>ZnO seeds nucleating</text>
              </>)},
              { icon: "🫧", title: "Step 2: Hydrothermal Growth", desc: "Immerse in Zn(NO₃)₂ + HMTA at 90°C, 4 hours. Nanowires grow vertically from seeds.", render: (tick, c) => (<>
                <rect x={40} y={30} width={240} height={100} rx={10} fill={c+"06"} stroke={c} strokeWidth={1}/>
                <text x={160} y={48} textAnchor="middle" fill={c} fontSize={9}>90°C aqueous solution</text>
                <rect x={60} y={120} width={200} height={10} rx={2} fill={T.syn_sol+"20"}/>
                {Array.from({length:12},(_,i)=>{const h=Math.min(tick*0.5,40+i*2); return <rect key={i} x={70+i*16} y={120-h} width={3} height={h} rx={1} fill={c+"60"} stroke={c} strokeWidth={0.3}/>;
                })}
                {Array.from({length:6},(_,i)=><circle key={i+12} cx={80+i*35} cy={60+Math.sin(tick*0.08+i)*15} r={3} fill={c+"20"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9}>Nanowires growing from seeds</text>
              </>)},
              { icon: "📐", title: "Step 3: Vertical Nanowire Array", desc: "Aligned ZnO nanowires ~50 nm dia, ~1 μm long. Direct electron transport path for solar cells.", render: (tick, c) => (<>
                <rect x={60} y={120} width={200} height={10} rx={2} fill={T.syn_sol+"20"}/>
                {Array.from({length:15},(_,i)=><rect key={i} x={68+i*14} y={60} width={4} height={60} rx={1} fill={c+"50"} stroke={c} strokeWidth={0.5}/>)}
                {Array.from({length:4},(_,i)=><circle key={i+15} cx={100+i*40} cy={50} r={3} fill={T.syn_sol+"60"}><animate attributeName="cy" values="50;60;118" dur="2s" repeatCount="indefinite" begin={`${i*0.4}s`}/></circle>)}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Electrons flow through nanowires</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="TiO₂ nanoparticles (mesoporous ETL)" eg="3.2 eV" method="Hydrothermal crystallization" recipe="Ti(OBu)₄ + HNO₃ + water, autoclave 200°C, 12 hrs. ~20 nm anatase nanoparticles." eff="Standard in >25% mesoscopic perovskite cells" color={T.syn_cvd}
            steps={[
              { icon: "🫧", title: "Step 1: Autoclave Reaction", desc: "Ti(OBu)₄ + HNO₃ + water sealed in autoclave at 200°C for 12 hours.", render: (tick, c) => (<>
                <rect x={80} y={30} width={160} height={100} rx={12} fill={c+"08"} stroke={c} strokeWidth={2}/>
                <text x={160} y={50} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Autoclave 200°C</text>
                {Array.from({length:8},(_,i)=><circle key={i} cx={100+i*18} cy={80+Math.sin(tick*0.08+i)*20} r={3+Math.sin(tick*0.06+i)} fill={c+"40"}/>)}
                {Array.from({length:4},(_,i)=><circle key={i+8} cx={110+i*25} cy={100-(tick*0.5+i*5)%40} r={2} fill={c+"25"}/>)}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={8}>12 hours crystallization</text>
              </>)},
              { icon: "🔮", title: "Step 2: Anatase Nanoparticles", desc: "~20 nm anatase TiO₂ nanoparticles crystallize. High surface area for perovskite infiltration.", render: (tick, c) => (<>
                {Array.from({length:16},(_,i)=>{const x=70+(i%4)*60; const y=40+Math.floor(i/4)*28; const sz=3+Math.sin(tick*0.05+i)*1; return <circle key={i} cx={x+Math.sin(tick*0.03+i)*3} cy={y+Math.cos(tick*0.04+i)*3} r={sz} fill={c+"50"} stroke={c} strokeWidth={0.5}/>;
                })}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>~20 nm anatase TiO₂</text>
              </>)},
              { icon: "🏗️", title: "Step 3: Mesoporous Scaffold", desc: "Paste nanoparticles, doctor blade coat, sinter 500°C. Perovskite infiltrates mesoporous layer.", render: (tick, c) => (<>
                <rect x={80} y={90} width={160} height={12} rx={2} fill={T.syn_hydro+"25"}/>
                <text x={160} y={100} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>FTO/compact TiO₂</text>
                {Array.from({length:20},(_,i)=>{const x=85+(i%10)*15; const y=60+Math.floor(i/10)*15; return <circle key={i} cx={x} cy={y} r={3} fill={c+"40"} stroke={c} strokeWidth={0.3}/>;
                })}
                {Array.from({length:10},(_,i)=>{const x=90+(i%5)*30; const y=55+Math.floor(i/5)*20; return <rect key={i+20} x={x} y={y} width={8} height={8} rx={1} fill={T.syn_sol+"25"}/>;
                })}
                <text x={160} y={50} textAnchor="middle" fill={T.syn_sol} fontSize={8}>Perovskite fills pores</text>
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9}>Mesoporous TiO₂ scaffold</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CZTS nanocrystal ink" eg="1.5 eV" method="Hot-injection / hydrothermal" recipe="CuCl₂ + ZnCl₂ + SnCl₄ + thiourea in ethylene glycol, 200°C autoclave, 24 hrs. Ink-based." eff="~9.0% (nanocrystal ink approach)" color={T.syn_pvd}
            steps={[
              { icon: "🫧", title: "Step 1: Hydrothermal Synthesis", desc: "Precursors sealed in autoclave at 200°C for 24 hours. CZTS nanocrystals nucleate and grow.", render: (tick, c) => (<>
                <rect x={80} y={30} width={160} height={100} rx={12} fill={c+"08"} stroke={c} strokeWidth={2}/>
                <text x={160} y={48} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Autoclave 200°C</text>
                {Array.from({length:6},(_,i)=>{const sz=Math.min(tick*0.1,4+i*0.5); return <circle key={i} cx={100+i*25} cy={80+Math.sin(tick*0.08+i)*15} r={sz} fill={c+"50"}/>;
                })}
                {Array.from({length:4},(_,i)=><circle key={i+6} cx={110+i*30} cy={100-(tick*0.4+i*6)%35} r={2} fill={c+"20"}/>)}
              </>)},
              { icon: "🖌️", title: "Step 2: Nanocrystal Ink Coating", desc: "Wash nanocrystals, disperse in hexanethiol. Blade coat or spin coat onto Mo substrate.", render: (tick, c) => (<>
                <rect x={60} y={110} width={200} height={12} rx={2} fill={T.muted+"20"}/>
                <text x={160} y={119} textAnchor="middle" fill={T.muted} fontSize={7}>Mo substrate</text>
                <rect x={60+Math.min(tick*1.5,0)} y={95} width={Math.min(tick*2,200)} height={12} rx={2} fill={c+"35"} stroke={c} strokeWidth={0.5}/>
                <rect x={55+Math.min(tick*2,200)} y={85} width={15} height={25} rx={3} fill={c+"60"} stroke={c} strokeWidth={1}/>
                <text x={160} y={140} textAnchor="middle" fill={c} fontSize={9}>Blade coating CZTS ink</text>
              </>)},
              { icon: "🔥", title: "Step 3: Selenization at 500°C", desc: "Se vapor at 500°C converts CZTS nanocrystals into dense CZTSSe film. Grains grow and merge.", render: (tick, c) => (<>
                <rect x={60} y={85} width={200} height={25} rx={3} fill={c+"40"} stroke={c} strokeWidth={1.5}/>
                {Array.from({length:8},(_,i)=>{const sz=4+Math.sin(tick*0.04+i)*2; return <rect key={i} x={70+i*24-sz/2} y={97-sz/2} width={sz} height={sz} fill={c+"60"} transform={`rotate(${tick*0.3+i*20},${70+i*24},97)`}/>;
                })}
                {Array.from({length:10},(_,i)=><circle key={i+8} cx={70+i*18+Math.sin(tick*0.07+i)*5} cy={65+Math.cos(tick*0.09+i*0.8)*15} r={2.5} fill={T.syn_main+"30"}/>)}
                <text x={160} y={130} textAnchor="middle" fill={c} fontSize={9}>CZTSSe grains merging</text>
                <text x={160} y={145} textAnchor="middle" fill={T.syn_main} fontSize={8}>Se vapor 500°C</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="CdSe quantum dots (QD solar cell)" eg="1.7-2.5 eV (size-tunable)" method="Hydrothermal in oleic acid" recipe="CdO + Se + oleic acid + octadecene, 220°C autoclave, 4 hrs. QD size 3-6 nm." eff="~13.4% (PbS QD, CdSe shell/ETL)" color={T.syn_main}
            steps={[
              { icon: "🫧", title: "Step 1: QD Nucleation", desc: "CdO + Se in oleic acid/octadecene at 220°C. Tiny CdSe nuclei form in seconds.", render: (tick, c) => (<>
                <rect x={80} y={35} width={160} height={90} rx={12} fill={c+"08"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={55} textAnchor="middle" fill={c} fontSize={9}>220°C autoclave</text>
                {Array.from({length:8},(_,i)=>{const sz=Math.min(tick*0.1,2); return <circle key={i} cx={100+i*20} cy={80+Math.sin(tick*0.12+i)*15} r={sz} fill={c+"80"}/>;
                })}
                {Array.from({length:4},(_,i)=><circle key={i+8} cx={110+i*30} cy={95-(tick*0.3+i*5)%30} r={1.5} fill={c+"30"}/>)}
              </>)},
              { icon: "🔮", title: "Step 2: Size-Controlled Growth", desc: "Reaction time controls QD size (3-6 nm). Quantum confinement tunes bandgap from 1.7 to 2.5 eV.", render: (tick, c) => (<>
                {[3,4,5,6].map((sz,i)=><g key={i}><circle cx={80+i*55} cy={70} r={sz*2+Math.sin(tick*0.05+i)*1} fill={c+((10-i)*10).toString()} stroke={c} strokeWidth={0.5}/><text x={80+i*55} y={70+sz*2+14} textAnchor="middle" fill={c} fontSize={7}>{sz}nm</text><text x={80+i*55} y={70+sz*2+24} textAnchor="middle" fill={T.muted} fontSize={6}>{(2.8-i*0.3).toFixed(1)}eV</text></g>)}
                <text x={160} y={30} textAnchor="middle" fill={c} fontSize={10} fontWeight={700}>Size tunes bandgap</text>
              </>)},
              { icon: "📊", title: "Step 3: Layer-by-Layer Film", desc: "Ligand exchange (oleic acid to MPA), then layer-by-layer spin coating builds QD film.", render: (tick, c) => (<>
                <rect x={80} y={110} width={160} height={12} rx={2} fill={T.syn_hydro+"20"}/>
                <text x={160} y={119} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>FTO/ETL</text>
                {Array.from({length:Math.min(Math.floor(tick/10)+1,6)},(_,i)=>{return Array.from({length:8},(_2,j)=><circle key={i*8+j} cx={90+j*18} cy={107-i*8} r={3} fill={c+((i%2===0)?"40":"60")}/>);
                }).flat()}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9}>Layer {Math.min(Math.floor(tick/10)+1,6)} of QD film</text>
              </>)}
            ]}
          />
          <SolarCellCard mat="Bi₂S₃ nanorods (emerging absorber)" eg="1.3-1.7 eV" method="Hydrothermal on FTO" recipe="Bi(NO₃)₃ + Na₂S₂O₃ + EDTA, pH 2-3. Autoclave 150°C, 12 hrs on FTO. Vertical nanorods ~200 nm." eff="~1.5% (early stage, rapidly improving)" color={T.syn_sol}
            steps={[
              { icon: "🫧", title: "Step 1: Autoclave Growth", desc: "Bi and S precursors react at 150°C, 12 hours. Bi₂S₃ nucleates directly on FTO substrate.", render: (tick, c) => (<>
                <rect x={70} y={30} width={180} height={95} rx={12} fill={c+"08"} stroke={c} strokeWidth={1.5}/>
                <text x={160} y={50} textAnchor="middle" fill={c} fontSize={9}>Autoclave 150°C, 12 hrs</text>
                <rect x={90} y={115} width={140} height={10} rx={2} fill={T.syn_hydro+"25"}/>
                <text x={160} y={123} textAnchor="middle" fill={T.syn_hydro} fontSize={7}>FTO substrate</text>
                {Array.from({length:6},(_,i)=><circle key={i} cx={100+i*25} cy={85+Math.sin(tick*0.08+i)*15} r={3} fill={c+"40"}/>)}
                {Array.from({length:4},(_,i)=><circle key={i+6} cx={115+i*25} cy={100-(tick*0.4+i*5)%30} r={2} fill={c+"20"}/>)}
              </>)},
              { icon: "📐", title: "Step 2: Vertical Nanorod Array", desc: "Bi₂S₃ nanorods grow vertically from FTO, ~200 nm diameter. Earth-abundant and non-toxic.", render: (tick, c) => (<>
                <rect x={80} y={115} width={160} height={10} rx={2} fill={T.syn_hydro+"25"}/>
                {Array.from({length:10},(_,i)=>{const h=Math.min(tick*0.5,50+i*3); return <rect key={i} x={88+i*15} y={115-h} width={6} height={h} rx={2} fill={c+"50"} stroke={c} strokeWidth={0.5}/>;
                })}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={9} fontWeight={700}>Bi₂S₃ nanorods on FTO</text>
              </>)},
              { icon: "🔋", title: "Step 3: Solar Cell Device", desc: "Bi₂S₃ nanorod array acts as absorber. Earth-abundant, non-toxic, rapidly improving efficiency.", render: (tick, c) => (<>
                <rect x={80} y={120} width={160} height={10} rx={2} fill={T.syn_hydro+"25"}/>
                <text x={160} y={128} textAnchor="middle" fill={T.syn_hydro} fontSize={6}>FTO</text>
                {Array.from({length:10},(_,i)=><rect key={i} x={88+i*15} y={65} width={6} height={55} rx={2} fill={c+"50"}/>)}
                <rect x={80} y={55} width={160} height={10} rx={2} fill={T.syn_cvd+"30"}/>
                <text x={160} y={63} textAnchor="middle" fill={T.syn_cvd} fontSize={7}>CdS / TiO₂ buffer</text>
                <rect x={80} y={42} width={160} height={13} rx={2} fill={T.syn_main+"25"}/>
                <text x={160} y={52} textAnchor="middle" fill={T.syn_main} fontSize={7}>ITO window</text>
                {Array.from({length:3},(_,i)=><line key={i} x1={110+i*40+Math.sin(tick*0.12+i)*3} y1={25} x2={110+i*40} y2={42} stroke={T.syn_sol} strokeWidth={1.5} opacity={0.5}/>)}
                <text x={160} y={145} textAnchor="middle" fill={c} fontSize={8}>Non-toxic PV — improving fast</text>
              </>)}
            ]}
          />
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
