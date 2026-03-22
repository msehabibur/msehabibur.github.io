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
