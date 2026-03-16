import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Droplets,
  Thermometer,
  Zap,
  AlertTriangle,
  Layers,
  Activity,
  ShieldAlert,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Gauge,
  Sigma,
  BarChart3,
  BookOpen,
  TimerReset,
  Sparkles,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// CdTe SOLAR CELL DEGRADATION MOVIE
// Themed for CdTe: Cd (blue-gray #5B8CA9), Te (amber #C4944A),
// device layers use CdTe-specific colors
// ═══════════════════════════════════════════════════════════════════════════

const timeline = [
  {
    id: 0,
    title: "Healthy CdTe Solar Cell",
    subtitle: "Initial operating condition",
    icon: Sun,
    color: "text-amber-300",
    summary:
      "The CdTe device starts in a healthy state. Sunlight enters through the glass superstrate, passes the CdS window layer, generates electron-hole pairs in the CdTe absorber (Eg = 1.44 eV), and current flows through the back contact.",
    details: [
      "Glass superstrate protects the device and transmits sunlight.",
      "TCO (SnO\u2082:F or ITO) serves as the front contact with high transparency.",
      "CdS window layer (~100 nm) forms the n-type side of the p-n junction.",
      "CdTe absorber (~3\u20135 \u00B5m) converts photons into electron-hole pairs.",
      "Back contact (Cu/Au or ZnTe:Cu) extracts holes from the p-type CdTe.",
      "The built-in field at the CdS/CdTe junction separates carriers efficiently.",
    ],
    stress: "No degradation. Power output near 22% record efficiency.",
    mechanism:
      "Photons with E \u2265 1.44 eV are absorbed in the CdTe layer. The p-n junction field sweeps electrons to CdS and holes to the back contact. Low defect density means long carrier lifetime.",
    equations: [
      "PCE = (V\u2092\u0063 \u00D7 J\u209B\u0063 \u00D7 FF) / P\u1D62\u2099",
      "E\u209A(CdTe) = 1.44 eV \u2014 ideal for single-junction",
      "\u03B1(CdTe) > 10\u2074 cm\u207B\u00B9 \u2014 strong absorption",
    ],
    takeaway:
      "CdTe's direct bandgap and high absorption coefficient make it ideal for thin-film solar cells. Only ~3 \u00B5m of material is needed.",
  },
  {
    id: 1,
    title: "Light-Induced Degradation",
    subtitle: "Photo-induced metastable defects",
    icon: Zap,
    color: "text-yellow-300",
    summary:
      "Prolonged illumination creates metastable defect complexes in CdTe, particularly Cu migration from the back contact and changes in V\u0043\u0064 (cadmium vacancy) charge states.",
    details: [
      "Cu atoms from the back contact become mobile under illumination.",
      "V\u0043\u0064 vacancies change charge state under light soaking.",
      "Metastable A-center complexes (V\u0043\u0064\u2013Cl\u0054\u0065) can form.",
      "Interface states at CdS/CdTe increase non-radiative recombination.",
      "Light soaking can initially improve performance (light soaking effect).",
      "Long-term exposure eventually creates deep traps in the bandgap.",
    ],
    stress: "Early V\u2092\u0063 loss from increased recombination at interfaces.",
    mechanism:
      "Photon energy breaks weak bonds and activates defect migration. Cu\u207A ions drift under the built-in field, creating donor-acceptor pair recombination centers.",
    equations: [
      "R\u209B\u1D63\u2095 \u221D (np \u2212 n\u1D62\u00B2) / [\u03C4\u209A(n+n\u2081) + \u03C4\u2099(p+p\u2081)]",
      "V\u2092\u0063 loss \u2248 (nkT/q) ln(J\u2080,new / J\u2080,initial)",
      "Cu\u207A drift: v = \u00B5E, D = D\u2080 exp(\u2212E\u2090/kT)",
    ],
    takeaway:
      "Cu migration from the back contact is the primary light-induced degradation mechanism unique to CdTe technology.",
  },
  {
    id: 2,
    title: "Thermal Stress & Diffusion",
    subtitle: "High-temperature interdiffusion",
    icon: Thermometer,
    color: "text-red-300",
    summary:
      "Elevated temperatures accelerate interdiffusion at the CdS/CdTe interface, Cu migration through the absorber, and Te out-diffusion from the back contact region.",
    details: [
      "CdS\u2093Te\u2081\u208B\u2093 intermixing at the junction changes the bandgap profile.",
      "Cu diffusion coefficient in CdTe: D \u2248 10\u207B\u00B9\u00B2 cm\u00B2/s at 80\u00B0C.",
      "Te-rich back surface can develop high-resistance oxide layers.",
      "Thermal expansion mismatch between glass and CdTe creates stress.",
      "Grain boundary diffusion is 100\u00D7 faster than bulk diffusion.",
      "CdCl\u2082 treatment residues can become mobile at high temperature.",
    ],
    stress: "Series resistance rises, fill factor drops from contact degradation.",
    mechanism:
      "Thermally activated diffusion redistributes Cu, Cl, and S atoms. Grain boundaries act as fast diffusion paths, creating non-uniform doping profiles.",
    equations: [
      "D(Cu) = D\u2080 exp(\u2212E\u2090/kT), E\u2090 \u2248 0.67 eV",
      "\u03C3\u209C\u2095 = E \u00D7 \u0394\u03B1 \u00D7 \u0394T",
      "R\u209B(t) = R\u209B\u2080 + \u0394R \u00D7 (1 \u2212 exp(\u2212t/\u03C4))",
    ],
    takeaway:
      "CdTe modules in hot climates degrade faster due to accelerated Cu and impurity diffusion through grain boundaries.",
  },
  {
    id: 3,
    title: "Moisture & Oxidation",
    subtitle: "Environmental attack on contacts",
    icon: Droplets,
    color: "text-cyan-300",
    summary:
      "Moisture penetration through the back contact or edge seals oxidizes the Te-rich surface, corrodes the metal contact, and creates shunt paths through the absorber.",
    details: [
      "Water reacts with CdTe: CdTe + H\u2082O \u2192 CdO + TeO\u2082 + H\u2082.",
      "Back contact Cu/Au layer corrodes forming CuO\u2093 compounds.",
      "TeO\u2082 insulating layer increases back contact resistance.",
      "Moisture along grain boundaries creates leakage paths (shunts).",
      "Edge seal failure accelerates moisture ingress from module perimeter.",
      "Delamination of encapsulant exposes more surface to moisture.",
    ],
    stress: "Shunt resistance drops, causing power loss and hot spots.",
    mechanism:
      "Water molecules diffuse along grain boundaries and react with CdTe surfaces. Oxidation products are insulating, blocking current flow and creating alternative leakage paths.",
    equations: [
      "J\u209B\u2095 = V / R\u209B\u2095 \u2014 shunt current increases",
      "CdTe + O\u2082 \u2192 CdO + TeO\u2082",
      "WVTR target < 10\u207B\u2074 g/m\u00B2/day for 25-year life",
    ],
    takeaway:
      "Robust encapsulation and edge sealing are critical for CdTe module longevity, especially in humid climates.",
  },
  {
    id: 4,
    title: "Defect Evolution in CdTe",
    subtitle: "Native defects control lifetime",
    icon: Activity,
    color: "text-fuchsia-300",
    summary:
      "CdTe's native defect landscape evolves under operation. Cd vacancies (V\u0043\u0064), Te antisites (Te\u0043\u0064), and Cu interstitials (Cu\u1D62) form deep traps that reduce carrier lifetime.",
    details: [
      "V\u0043\u0064 is the dominant p-type dopant but also a recombination center.",
      "Te\u0043\u0064 antisite creates a deep level at E\u1D65 + 0.6 eV.",
      "Cu\u0043\u0064 substitutional acts as a shallow acceptor (beneficial).",
      "Cu\u1D62 interstitial is a fast-diffusing donor (harmful).",
      "Defect complexes: (V\u0043\u0064\u2013Cl\u0054\u0065) A-center is amphoteric.",
      "Grain boundaries accumulate defects and become recombination highways.",
    ],
    stress: "Carrier lifetime \u03C4 drops from >10 ns to <1 ns in degraded regions.",
    mechanism:
      "Under bias and illumination, defect formation energies shift with the Fermi level. This changes the equilibrium defect population, often increasing harmful deep-level concentrations.",
    equations: [
      "E\u1DA0(q) = E\u1DA0\u2070 + q(\u03B5\u1DA0 + \u0394V) + \u0394\u00B5",
      "\u03C4 = 1 / (\u03C3 v\u209C\u2095 N\u209C)",
      "SRH: R = \u03C3 v\u209C\u2095 N\u209C (np \u2212 n\u1D62\u00B2) / (n + p + 2n\u1D62 cosh(\u0394E/kT))",
    ],
    takeaway:
      "Understanding the defect formation energy landscape is key to engineering more stable CdTe absorbers.",
  },
  {
    id: 5,
    title: "Mechanical Damage",
    subtitle: "Cracks and delamination",
    icon: Layers,
    color: "text-orange-300",
    summary:
      "CdTe is brittle (fracture toughness ~0.5 MPa\u221Am). Thermal cycling, hail impact, and mounting stress can crack the absorber and delaminate the back contact.",
    details: [
      "CdTe grain boundaries are weak fracture paths.",
      "Microcracks electrically isolate cell regions, reducing active area.",
      "Delamination at CdTe/back-contact increases series resistance.",
      "Glass breakage from hail is a leading field failure mode.",
      "Current crowding around cracks creates local hot spots.",
      "Crack tips concentrate stress and propagate under thermal cycling.",
    ],
    stress: "Active area loss and localized heating accelerate further damage.",
    mechanism:
      "Brittle fracture along grain boundaries and interfaces creates electrically dead zones. These zones force current through smaller cross-sections, increasing local heating.",
    equations: [
      "K\u1D6C = \u03C3\u221A(\u03C0a) \u2014 stress intensity factor",
      "J\u209B\u0063 \u221D A\u2090\u0063\u209C\u1D62\u1D65\u0065",
      "P\u2095\u2092\u209C = I\u00B2R\u209B(local) \u2014 hot spot power",
    ],
    takeaway:
      "CdTe's brittleness requires careful module design, mounting, and qualification testing for mechanical resilience.",
  },
  {
    id: 6,
    title: "Performance Decline",
    subtitle: "Coupled degradation effects",
    icon: AlertTriangle,
    color: "text-rose-300",
    summary:
      "All degradation pathways compound: Cu migration lowers V\u2092\u0063, moisture reduces R\u209B\u2095, thermal stress increases R\u209B, and defects kill carrier lifetime. The J-V curve degrades visibly.",
    details: [
      "J\u209B\u0063 falls from optical losses and reduced collection efficiency.",
      "V\u2092\u0063 falls from increased J\u2080 due to higher recombination.",
      "Fill factor drops from both higher R\u209B and lower R\u209B\u2095.",
      "The J-V curve becomes more rounded and less rectangular.",
      "Annual degradation rate for CdTe: typically 0.5\u20130.8%/year.",
      "First Solar warranty: \u226498% Year 1, then \u22640.5%/year for 25 years.",
    ],
    stress: "Observable: 10\u201320% efficiency loss over 25-year lifetime.",
    mechanism:
      "The modified diode equation captures all loss mechanisms: increased J\u2080 (recombination), increased R\u209B (contacts), decreased R\u209B\u2095 (shunts), reduced J\u209A\u2095 (optical).",
    equations: [
      "J = J\u209A\u2095 \u2212 J\u2080[exp(q(V+JR\u209B)/nkT) \u2212 1] \u2212 (V+JR\u209B)/R\u209B\u2095",
      "FF = (V\u2098\u209AJ\u2098\u209A) / (V\u2092\u0063J\u209B\u0063)",
      "PCE(t) = PCE\u2080 \u00D7 (1 \u2212 r)\u1D57, r \u2248 0.5%/year",
    ],
    takeaway:
      "CdTe degradation is manageable \u2014 modern modules routinely achieve 25+ year lifetimes with <15% total power loss.",
  },
  {
    id: 7,
    title: "CdTe-Specific Mitigation",
    subtitle: "Engineering solutions for stability",
    icon: ShieldAlert,
    color: "text-emerald-300",
    summary:
      "CdTe stability is improved through Cu-free back contacts (ZnTe, MoO\u2093), Se alloying (CdSeTe), group V doping (As, P), improved encapsulation, and interface passivation.",
    details: [
      "Cu-free back contacts eliminate the primary degradation source.",
      "CdSeTe graded absorber: lower V\u2092\u0063 deficit, better stability.",
      "Group V doping (As\u0054\u0065) provides stable p-type doping without Cu.",
      "MgZnO replaces CdS: wider gap, better lattice match, no intermixing.",
      "Glass-glass encapsulation with edge seal for moisture barrier.",
      "First Solar's Series 7 achieves 0.2%/year degradation rate.",
    ],
    stress: "Goal: <0.3%/year degradation for 30+ year module lifetime.",
    mechanism:
      "Removing Cu, controlling grain boundaries with Se, and using stable contacts address the root causes rather than symptoms of CdTe degradation.",
    equations: [
      "CdSe\u2093Te\u2081\u208B\u2093: E\u209A = 1.44 \u2212 0.74x + 0.28x\u00B2 eV",
      "Target: d(PCE)/dt < 0.3%/year",
      "WVTR < 10\u207B\u2074 g/m\u00B2/day with glass-glass design",
    ],
    takeaway:
      "Modern CdTe technology has solved most historical stability issues. CdSeTe with Cu-free contacts represents the state of the art.",
  },
];

// ── Layer colors matching CdTe device structure ──
const LAYER = {
  glass:    { bg: "rgba(186, 230, 253, 0.85)", border: "rgba(125, 211, 252, 0.7)", label: "Glass" },
  tco:      { bg: "rgba(103, 232, 249, 0.65)", border: "rgba(34, 211, 238, 0.5)",  label: "TCO (SnO\u2082:F)" },
  cds:      { bg: "rgba(253, 224, 71, 0.55)",  border: "rgba(250, 204, 21, 0.5)",  label: "CdS Window" },
  cdte:     { bg: "linear-gradient(90deg, rgba(139, 92, 246, 0.65), rgba(168, 85, 247, 0.65), rgba(124, 58, 237, 0.65))", border: "rgba(139, 92, 246, 0.5)", label: "CdTe Absorber" },
  buffer:   { bg: "rgba(180, 134, 11, 0.75)",  border: "rgba(161, 98, 7, 0.5)",    label: "Buffer" },
  contact:  { bg: "rgba(161, 161, 170, 0.75)", border: "rgba(113, 113, 122, 0.5)", label: "Back Contact (Cu/Au)" },
};

function SunRays({ active }) {
  return (
    <div className="absolute inset-x-0 top-0 h-28 overflow-hidden pointer-events-none">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-28 w-1 rounded-full bg-yellow-300/60"
          style={{ left: `${10 + i * 9}%`, rotate: `${-25 + i * 6}deg` }}
          animate={active ? { opacity: [0.2, 0.8, 0.2], y: [0, 10, 0] } : { opacity: 0.15 }}
          transition={{ repeat: Infinity, duration: 1.8 + i * 0.08 }}
        />
      ))}
    </div>
  );
}

function LayerStack({ stage, paused }) {
  const damage = stage.id;
  const playState = paused ? "paused" : "running";
  return (
    <div className="relative mx-auto w-full max-w-2xl h-80 rounded-3xl border border-white/10 bg-slate-950/60 overflow-hidden shadow-2xl">
      <div style={{ animationPlayState: playState }}>
        <SunRays active={stage.id <= 2} />
      </div>

      {/* Glass superstrate */}
      <div className="absolute left-10 right-10 top-16 h-6 rounded-xl border"
        style={{ background: LAYER.glass.bg, borderColor: LAYER.glass.border }} />
      {/* TCO */}
      <div className="absolute left-12 right-12 top-24 h-5 rounded-lg"
        style={{ background: LAYER.tco.bg }} />
      {/* CdS window */}
      <div className="absolute left-13 right-13 top-[7.5rem] h-3 rounded-lg"
        style={{ background: LAYER.cds.bg }} />
      {/* CdTe absorber */}
      <div className="absolute left-14 right-14 top-[8.5rem] h-16 rounded-xl"
        style={{ background: LAYER.cdte.bg }} />
      {/* Buffer */}
      <div className="absolute left-12 right-12 top-[12.5rem] h-5 rounded-lg"
        style={{ background: LAYER.buffer.bg }} />
      {/* Back contact */}
      <div className="absolute left-10 right-10 top-[14.25rem] h-7 rounded-xl"
        style={{ background: LAYER.contact.bg }} />

      {/* Layer labels */}
      <div className="absolute left-4 top-16 text-[11px] text-slate-300">{LAYER.glass.label}</div>
      <div className="absolute left-4 top-24 text-[11px] text-slate-300">{LAYER.tco.label}</div>
      <div className="absolute left-4 top-[7.5rem] text-[11px] text-cyan-200">{LAYER.cds.label}</div>
      <div className="absolute left-4 top-[8.5rem] text-[11px] text-purple-200">{LAYER.cdte.label}</div>
      <div className="absolute left-4 top-[12.5rem] text-[11px] text-slate-300">{LAYER.buffer.label}</div>
      <div className="absolute left-4 top-[14.25rem] text-[11px] text-slate-300">{LAYER.contact.label}</div>

      {/* Carrier flow animation */}
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"
          style={{ left: `${18 + i * 5}%`, top: `${36 + (i % 3) * 6}%`, animationPlayState: playState }}
          animate={{ x: [0, 14, 28], opacity: [0.3, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 + (i % 4) * 0.3, delay: i * 0.05 }}
        />
      ))}

      {/* Stage 1: Light-induced traps */}
      {damage >= 1 && [...Array(5)].map((_, i) => (
        <motion.div
          key={`trap-${i}`}
          className="absolute h-3 w-3 rounded-full bg-yellow-200/80 shadow-[0_0_14px_rgba(253,224,71,0.8)]"
          style={{ left: `${28 + i * 12}%`, top: `${40 + (i % 2) * 8}%`, animationPlayState: playState }}
          animate={{ opacity: [0.25, 0.9, 0.25], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.12 }}
        />
      ))}

      {/* Stage 2: Thermal stress */}
      {damage >= 2 && [...Array(6)].map((_, i) => (
        <motion.div
          key={`heat-${i}`}
          className="absolute text-red-300 text-xs"
          style={{ left: `${20 + i * 12}%`, top: `${18 + (i % 2) * 6}%`, animationPlayState: playState }}
          animate={{ y: [0, -12, -4], opacity: [0.2, 0.9, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 + i * 0.05 }}
        >
          ~
        </motion.div>
      ))}

      {/* Stage 3: Moisture */}
      {damage >= 3 && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`drop-${i}`}
              className="absolute h-3 w-2 rounded-b-full rounded-t-full bg-cyan-300/80"
              style={{ left: `${12 + i * 8}%`, top: `${5 + (i % 3) * 3}%`, animationPlayState: playState }}
              animate={{ y: [0, 90, 170], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.12 }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`corrosion-${i}`}
              className="absolute h-4 w-8 rounded-full bg-emerald-400/40 blur-sm"
              style={{ left: `${30 + i * 10}%`, top: `${54 + (i % 2) * 3}%`, animationPlayState: playState }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          ))}
        </>
      )}

      {/* Stage 4: Defect migration */}
      {damage >= 4 && [...Array(8)].map((_, i) => (
        <motion.div
          key={`def-${i}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-fuchsia-300"
          style={{ left: `${24 + i * 7}%`, top: `${43 + (i % 3) * 7}%`, animationPlayState: playState }}
          animate={{ x: [0, 8, -6, 0], y: [0, -4, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.07 }}
        />
      ))}

      {/* Stage 5: Cracks */}
      {damage >= 5 && (
        <>
          <motion.div
            className="absolute left-[28%] top-[27%] h-32 w-[2px] bg-white/70"
            style={{ animationPlayState: playState }}
            animate={{ opacity: [0.2, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <motion.div
            className="absolute left-[56%] top-[20%] h-40 w-[2px] bg-white/70 rotate-12"
            style={{ animationPlayState: playState }}
            animate={{ opacity: [0.2, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
          />
        </>
      )}

      {/* Stage 6: Overall degradation overlay */}
      {damage >= 6 && (
        <motion.div
          className="absolute inset-0 bg-rose-900/20"
          style={{ animationPlayState: playState }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </div>
  );
}

function MetricBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 text-slate-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}

function EquationCard({ equations }) {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/60 p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Sigma className="h-5 w-5 text-cyan-300" />
        <h3 className="text-xl font-semibold">Key equations</h3>
      </div>
      <div className="space-y-3">
        {equations.map((eq, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm md:text-base text-cyan-200 overflow-x-auto">
            {eq}
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlButton({ children, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 transition ${active ? "border-cyan-300/50 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}

function StatTile({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-2xl border border-white/10 bg-slate-950/60 flex items-center justify-center ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
          <div className="text-xl font-semibold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function CompactInfoCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl h-full">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-cyan-300" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-slate-300 leading-7 text-sm md:text-base">{children}</div>
    </div>
  );
}

export default function SolarCellDegradationMovie() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sceneDuration, setSceneDuration] = useState(5000);
  const stage = timeline[index];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % timeline.length);
    }, sceneDuration);
    return () => clearInterval(id);
  }, [paused, sceneDuration]);

  const metrics = useMemo(() => {
    const efficiency = Math.max(28, 100 - stage.id * 10);
    const voltage = Math.max(35, 100 - stage.id * 8);
    const stability = Math.max(20, 100 - stage.id * 11);
    return { efficiency, voltage, stability };
  }, [stage]);

  const Icon = stage.icon;
  const goPrev = () => setIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
  const goNext = () => setIndex((prev) => (prev + 1) % timeline.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-4 md:p-6">
      <div className="max-w-[1500px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-white/10 px-5 md:px-8 py-5 md:py-6 bg-gradient-to-r from-purple-500/10 via-transparent to-amber-500/10">
            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-purple-200 mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  CdTe degradation lesson
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">CdTe Solar Cell Degradation</h1>
                <p className="mt-3 text-slate-300 max-w-4xl leading-7 text-sm md:text-lg">
                  How CdTe thin-film solar cells age under light, heat, moisture, and defect migration &mdash;
                  from Cu back-contact diffusion to CdSeTe mitigation strategies.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-full xl:min-w-[520px] xl:max-w-[620px]">
                <StatTile icon={BarChart3} label="Scene" value={`${index + 1}/${timeline.length}`} tone="text-cyan-300" />
                <StatTile icon={paused ? Pause : Play} label="Playback" value={paused ? "Paused" : "Running"} tone="text-emerald-300" />
                <StatTile icon={Gauge} label="Duration" value={`${sceneDuration / 1000}s`} tone="text-amber-300" />
                <StatTile icon={TimerReset} label="Trend" value={stage.id < 3 ? "Early" : stage.id < 6 ? "Mid" : "Late"} tone="text-fuchsia-300" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-5 md:px-8 py-5 border-b border-white/10 bg-slate-950/30">
            <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-4 items-center">
              <div className="flex flex-wrap items-center gap-3">
                <ControlButton onClick={goPrev}>
                  <span className="flex items-center gap-2"><SkipBack className="h-4 w-4" /> Previous</span>
                </ControlButton>
                <ControlButton onClick={() => setPaused((p) => !p)} active={paused}>
                  <span className="flex items-center gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Play" : "Pause"}</span>
                </ControlButton>
                <ControlButton onClick={goNext}>
                  <span className="flex items-center gap-2"><SkipForward className="h-4 w-4" /> Next</span>
                </ControlButton>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
                <Gauge className="h-5 w-5 text-cyan-300 shrink-0" />
                <span className="text-sm text-slate-300 whitespace-nowrap">Scene duration</span>
                <input
                  type="range"
                  min="3000"
                  max="12000"
                  step="1000"
                  value={sceneDuration}
                  onChange={(e) => setSceneDuration(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-slate-300 whitespace-nowrap">{sceneDuration / 1000}s</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="px-5 md:px-8 py-5 md:py-6 grid xl:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
            <div className="space-y-6">
              <motion.div layout className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6 shadow-2xl">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                        <Icon className={`h-6 w-6 ${stage.color}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-semibold leading-tight">{stage.title}</h2>
                        <p className="text-slate-400">{stage.subtitle}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <MetricBar label="Efficiency" value={metrics.efficiency} color="bg-emerald-400" />
                      <MetricBar label="Voltage" value={metrics.voltage} color="bg-cyan-400" />
                      <MetricBar label="Stability" value={metrics.stability} color="bg-fuchsia-400" />
                    </div>

                    <CompactInfoCard title="Scene summary" icon={BookOpen}>
                      {stage.summary}
                    </CompactInfoCard>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <LayerStack stage={stage} paused={paused} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${stage.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl"
                  >
                    <h3 className="text-xl font-semibold mb-3">Detailed points</h3>
                    <ul className="space-y-3 mb-5">
                      {stage.details.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex gap-3 text-slate-300 leading-7"
                        >
                          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-purple-400 shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-6">
                  <CompactInfoCard title="Physical mechanism" icon={Activity}>
                    {stage.mechanism}
                  </CompactInfoCard>
                  <CompactInfoCard title="Main lesson" icon={Sparkles}>
                    {stage.takeaway}
                  </CompactInfoCard>
                  <CompactInfoCard title="Main degradation effect" icon={AlertTriangle}>
                    {stage.stress}
                  </CompactInfoCard>
                </div>
              </div>
            </div>

            <div className="space-y-6 xl:sticky xl:top-6">
              <EquationCard equations={stage.equations} />

              <motion.div layout className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl">
                <h3 className="text-xl font-semibold mb-4">Timeline navigator</h3>
                <div className="grid gap-3 max-h-[620px] overflow-y-auto pr-1">
                  {timeline.map((item, i) => {
                    const ItemIcon = item.icon;
                    const active = i === index;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setIndex(i)}
                        className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
                          active
                            ? "bg-purple-400/10 border-purple-300/40"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-10 w-10 rounded-2xl border border-white/10 bg-slate-950/60 flex items-center justify-center ${active ? "text-purple-300" : "text-slate-400"}`}>
                            <ItemIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium leading-6">{item.title}</div>
                            <div className="text-sm text-slate-400">{item.subtitle}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
