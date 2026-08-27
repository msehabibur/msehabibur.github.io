import { useState } from "react";

// Theme — light & dark variants
const LIGHT = {
  bg:      "#f4f6f6",
  panel:   "#2a8697",
  surface: "#2a8697",
  border:  "#2a8697",
  ink:     "#0f2428",
  muted:   "#6c7b7e",
  dim:     "#2a8697",
  accent:  "#2f7380",
  blue:    "#358190",
  green:   "#2c6b77",
  amber:   "#2e707d",
  red:     "#275f6a",
  teal:    "#2f7380",
  pink:    "#317583"
};
const DARK = {
  bg:      "#0f2428",
  panel:   "#0f2428",
  surface: "#0f2428",
  border:  "#17353b",
  ink:     "#2a8697",
  muted:   "#2a8697",
  dim:     "#214e57",
  accent:  "#2a8697",
  blue:    "#2a8697",
  green:   "#2a8697",
  amber:   "#2a8697",
  red:     "#2a8697",
  teal:    "#2a8697",
  pink:    "#accad0"
};

// Mutable theme ref — set at render time
let T = LIGHT;

const SectionTitle = ({ children, color }) => (
  <div style={{
    fontSize: 20, fontWeight: 500, color: color || T.accent, marginBottom: 16,
    borderBottom: `3px solid ${color || T.accent}`, paddingBottom: 8,
    fontFamily: "'Inter', sans-serif"
  }}>{children}</div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
    padding: 20, marginBottom: 16, ...style
  }}>{children}</div>
);

const Tag = ({ children, color }) => (
  <span style={{
    display: "inline-block", padding: "4px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 500, background: (color || T.accent) + "15",
    color: color || T.accent, border: `1px solid ${(color || T.accent)}30`,
    marginRight: 6, marginBottom: 4
  }}>{children}</span>
);

const LinkBtn = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{
    color: T.accent, fontSize: 12, fontWeight: 500, textDecoration: "none",
    borderBottom: `1px dashed ${T.accent}50`
  }}>{children}</a>
);

// Expandable publication card
function PubCard({ pub, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: T.panel, borderRadius: 12, border: `1px solid ${open ? T.accent + "60" : T.border}`,
      marginBottom: 12, overflow: "hidden", transition: "border-color 0.2s"
    }}>
      {/* Header — always visible */}
      <div style={{ padding: "16px 18px", cursor: "pointer" }} onClick={() => setOpen(!open)}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Number badge */}
          <div style={{
            minWidth: 32, height: 32, borderRadius: "50%",
            background: pub.me ? `linear-gradient(135deg, ${T.accent}20, ${T.blue}20)` : T.surface,
            border: `2px solid ${pub.me ? T.accent : T.border}`,
            color: pub.me ? T.accent : T.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 500, flexShrink: 0
          }}>{index + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: 6, color: T.ink }}>
              {pub.title}
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.4, marginBottom: 6 }}>
              {pub.authors}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <em style={{ fontSize: 12, color: T.ink }}>{pub.journal}</em>
              <Tag color={T.green}>{pub.year}</Tag>
              {pub.citations > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 500,
                  background: T.amber + "15", color: T.amber, border: `1px solid ${T.amber}30`
                }}>
                  {pub.citations} citations
                </span>
              )}
            </div>
          </div>
          {/* Expand arrow */}
          <div style={{
            minWidth: 28, height: 28, borderRadius: 8,
            background: open ? T.accent + "15" : T.surface,
            border: `1px solid ${open ? T.accent + "40" : T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: open ? T.accent : T.muted, flexShrink: 0,
            transition: "all 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)"
          }}>{"\u25BC"}</div>
        </div>
      </div>

      {/* Expandable details */}
      {open && (
        <div style={{
          padding: "0 18px 16px",
          borderTop: `1px solid ${T.border}`,
          marginTop: 0
        }}>
          {/* Abstract */}
          {pub.abstract && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                fontSize: 11, fontWeight: 500, color: T.accent, letterSpacing: 1,
                textTransform: "none", marginBottom: 6
              }}>Abstract</div>
              <div style={{
                fontSize: 13, lineHeight: 1.7, color: T.ink,
                padding: "12px 14px", background: T.surface, borderRadius: 8 
              }}>{pub.abstract}</div>
            </div>
          )}

          {/* Key contributions flowchart */}
          {pub.highlights && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                fontSize: 11, fontWeight: 500, color: T.green, letterSpacing: 1,
                textTransform: "none", marginBottom: 8
              }}>Key Contributions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {pub.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                    {/* Connector line */}
                    <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", background: T.accent,
                        border: `2px solid ${T.panel}`, boxShadow: `0 0 0 2px ${T.accent}40`,
                        flexShrink: 0, marginTop: 6
                      }} />
                      {i < pub.highlights.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: T.accent + "30" }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: 12, color: T.ink, lineHeight: 1.5,
                      padding: "4px 0 10px 8px"
                    }}>{h}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            {pub.link && (
              <a href={pub.link} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
                background: T.accent + "10", color: T.accent, textDecoration: "none",
                border: `1px solid ${T.accent}30`
              }}>View Paper {"\u2192"}</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
const TABS = [
  { id: "overview",      label: "Overview" },
  { id: "education",     label: "Education" },
  { id: "research",      label: "Research" },
  { id: "publications",  label: "Publications" },
  { id: "conferences",   label: "Conferences" },
  { id: "awards",        label: "Awards" },
  { id: "software",      label: "Software" },
  { id: "blog",          label: "MicroLab" },
];

const BLOG_CHAPTERS = [
  { id: "electrons",        chapter: 1,  label: "Atoms World",                desc: "From quantum foundations to crystal properties \u2014 the building blocks of all materials", icon: "\u269B" },
  { id: "synthesis",        chapter: 2,  label: "Materials Synthesis",         desc: "CVD, PVD, sol-gel, ALD, MBE, spin coating, hydrothermal \u2014 step-by-step animated synthesis methods", icon: "\u{1F3ED}" },
  { id: "characterization", chapter: 3,  label: "Materials Characterization",  desc: "XRD, XPS, SEM, TEM, AFM, STM, Raman, XANES \u2014 interactive guides to every major technique", icon: "\u{1F52C}" },
  { id: "dft",              chapter: 4,  label: "DFT Basics",                 desc: "Density functional theory from first principles \u2014 Kohn-Sham equations, exchange-correlation, and self-consistency", icon: "\u2211" },
  { id: "md",               chapter: 5,  label: "Molecular Dynamics",         desc: "Classical and ab initio molecular dynamics \u2014 ensembles, thermostats, and time integration", icon: "\u21BB" },
  { id: "convexhull",       chapter: 6,  label: "Computational Phase Diagram", desc: "Phase stability, convex hull construction, and chemical potential diagrams", icon: "\u25B3" },
  { id: "defectsemi",       chapter: 7,  label: "Defects in Semiconductors",  desc: "Point defect thermodynamics \u2014 formation energy, charge transitions, equilibrium concentrations, and FNV correction", icon: "\u26A1" },
  { id: "cdtesolar",        chapter: 8,  label: "CdTe Solar Cell",            desc: "CdTe device physics, defect engineering, and photovoltaic performance optimization", icon: "\u2600" },
  { id: "forcefield",       chapter: 9,  label: "Force Fields",               desc: "Classical and machine-learned interatomic potentials \u2014 from harmonic bonds to ReaxFF and EAM", icon: "\u2699" },
  { id: "pipeline",         chapter: 10, label: "MLFF Pipeline",              desc: "DefectNet force field: graph neural network architecture, training, and deployment", icon: "\u{1F9E0}" },
  { id: "mlintro",          chapter: 11, label: "Introduction to ML",         desc: "Machine learning foundations, algorithms, neural networks, and applications in materials science", icon: "\u{1F916}" },
  { id: "llmdatamining",    chapter: 12, label: "LLM Data Mining",            desc: "LangGraph architecture, solid-state synthesis text-mining, and MongoDB data management", icon: "\u{1F4DA}" },
];

const PUBLICATIONS = [
  // ── 2026 ──
  {
    authors: "Rahman, Md Habibur, Biswas, M., Mannodi-Kanakkithodi, A.",
    title: "DeFecT-FF: a machine learning force field framework for high throughput defect modeling in CdTe-based solar cells",
    journal: "Physical Chemistry Chemical Physics, 28, 10718\u201310730",
    year: "2026", me: true, citations: 8,
    link: "https://doi.org/10.1039/D6CP00170J",
    abstract: "The DeFecT-FF framework predicts energies and ground state configurations of native defects, extrinsic dopants and impurities, and defect complexes across Cd/Zn\u2013Te/Se/S compounds, important for CdTe-based solar cells.",
    highlights: ["Presents DeFecT-FF, a machine learning force field framework for high-throughput defect modelling in CdTe-based solar cells", "Predicts energies and ground state configurations of native defects across Cd/Zn\u2013Te/Se/S compounds", "Extends the same framework to extrinsic dopants, impurities and defect complexes", "Targets the defect chemistry that governs CdTe-based photovoltaic performance"]
  },
  {
    authors: "Rahman, Md Habibur, & Mannodi-Kanakkithodi, A.",
    title: "Data-driven discovery of novel chalcogenide semiconductors for solar absorption",
    journal: "EES Solar, 2, 984\u20131000",
    year: "2026", me: true, citations: 0,
    link: "https://doi.org/10.1039/D6EL00026F",
    abstract: "This framework combines high-throughput computations and machine learning to drive the discovery of stable and defect-tolerant chalcogenide semiconductor alloys with attractive optoelectronic properties.",
    highlights: ["Combines high-throughput computation with machine learning to search chalcogenide semiconductor alloys", "Screens for thermodynamic stability alongside optoelectronic quality rather than either alone", "Targets defect-tolerant compositions suited to solar absorption", "Delivers a discovery framework rather than a single candidate material"]
  },
  {
    authors: "Roy, A., Shen, K., MacBride, A., \u2026 Rahman, Md Habibur, et al. (353 authors)",
    title: "From Knowledge to Action: Outcomes of the 2025 Large Language Model (LLM) Hackathon for Applications in Materials Science and Chemistry",
    journal: "arXiv:2605.03205",
    year: "2026", me: true, citations: 3,
    link: "https://arxiv.org/abs/2605.03205",
    abstract: "Large language models are rapidly changing how researchers in materials science and chemistry discover, organize and act on scientific knowledge. This paper analyses a broad set of community-developed LLM applications to identify emerging patterns across the research lifecycle, organised into knowledge infrastructure and agentic action.",
    highlights: ["Analyses a broad set of community-developed LLM applications across materials science and chemistry", "Organises the projects into knowledge infrastructure and action systems as two complementary categories", "Documents the shift from single-purpose LLM tools toward integrated multi-agent workflows combining retrieval, reasoning, tool use and domain validation", "Offers a practical taxonomy for understanding emerging LLM-enabled scientific workflows"]
  },
  {
    authors: "Lee, J., Neralla, H., Rhys Campbell, C., \u2026 Rahman, Md Habibur, et al. (27 authors)",
    title: "Lessons learned from the 2025 agentic AI for science hackathon",
    journal: "Machine Learning: Science and Technology, 7, 040501",
    year: "2026", me: true, citations: 1,
    link: "https://doi.org/10.1088/2632-2153/ae7f6a",
    abstract: "The rapid emergence of agentic AI presents new opportunities and challenges for accelerating scientific discovery through tool-augmented reasoning, autonomous workflows and reproducible results. This paper reports what the community hackathon revealed about where such systems help and where they still fail.",
    highlights: ["Reports a model-agnostic community hackathon on agentic AI for science with 352 registered participants", "Benchmarks tool calling, asynchronous agents and multi-model reasoning across database retrieval, literature search and workflow automation", "Emphasises reproducibility, transparent tool usage and explicit agent-tool interaction over single-prompt question answering", "Identifies failure modes in contemporary chatbots and distils best practices for agent design in scientific contexts"]
  },
  {
    authors: "Tenorio, M., Rahman, Md Habibur, Mannodi-Kanakkithodi, A., Chapman, J.",
    title: "Out-of-distribution machine learning for materials discovery: challenges and opportunities",
    journal: "Chemical Physics Reviews, 7 (1), 011317",
    year: "2026", me: true, citations: 6,
    link: "https://doi.org/10.1063/5.0228239",
    abstract: "This review examines the challenge of out-of-distribution (OOD) generalization in machine learning models for materials science. We survey methods for detecting and handling distribution shifts, discuss failure modes of ML models when extrapolating beyond training data, and highlight opportunities for robust materials discovery using uncertainty quantification, domain adaptation, and active learning strategies.",
    highlights: ["Reviews the challenge of out-of-distribution generalization in ML models for materials science", "Surveys methods for detecting and handling distribution shifts in materials property prediction", "Discusses failure modes of ML models when extrapolating beyond training data distributions", "Highlights opportunities using uncertainty quantification, domain adaptation, and active learning for robust materials discovery"]
  },
  // ── 2025 ──
  {
    authors: "Rahman, Md Habibur, Agrawal, I., Mannodi-Kanakkithodi, A.",
    title: "Using Machine Learning to Explore Defect Configurations in Cd/Zn-Se/Te Compounds",
    journal: "2025 IEEE 53rd Photovoltaic Specialists Conference (PVSC), 0717\u20130719",
    year: "2025", me: true, citations: 3,
    link: "https://doi.org/10.1109/PVSC59419.2025.11133092",
    abstract: "To address the challenge of accurately and quickly predicting defect properties in semiconductors, we developed a workflow combining high-throughput density functional theory computations with active learning and crystal graph-based neural networks. Using a comprehensive DFT dataset of Cd/Zn-S/Se/Te configurations, we trained graph neural network models on over 6200 crystal structures to predict crystal formation energy for bulk and defective structures, then applied them to 13,000 hypothetical defects.",
    highlights: ["Combines high-throughput DFT with active learning and crystal graph neural networks to predict defect properties", "Trains ALIGNN models on more than 6200 Cd/Zn-S/Se/Te crystal structures", "Predicts crystal formation energy for both bulk and defective structures at high accuracy", "Applies the trained models to 13,000 hypothetical defects in Cd\u2093Zn\u2081\u208B\u2093Te"]
  },
  {
    authors: "Rahman, Md Habibur, Rojsatien, S., Krasikov, D., Chan, M.K.Y., Bertoni, M., Mannodi-Kanakkithodi, A.",
    title: "First principles investigation of dopants and defect complexes in CdSe\u2093Te\u2081\u208B\u2093",
    journal: "Solar Energy Materials and Solar Cells, 293, 113857",
    year: "2025", me: true, citations: 11,
    abstract: "We perform a comprehensive first-principles study of extrinsic dopants and defect complexes in CdSe\u2093Te\u2081\u208B\u2093 alloys, key absorber materials for high-efficiency thin-film solar cells. Using hybrid DFT calculations, we map out the formation energies, charge transition levels, and binding energies of dopant-vacancy complexes across compositions, identifying optimal doping strategies for carrier concentration control and defect passivation.",
    highlights: ["Comprehensive first-principles study of extrinsic dopants and defect complexes in CdSe\u2093Te\u2081\u208B\u2093 alloys for thin-film solar cells", "Uses hybrid DFT to compute formation energies, charge transition levels, and binding energies of dopant-vacancy complexes", "Maps dopant behavior across compositions to identify optimal doping strategies for carrier concentration control", "Provides guidance on defect passivation approaches in CdSeTe absorber materials"],
    link: "https://doi.org/10.1016/j.solmat.2025.113857"
  },
  {
    authors: "Rahman, Md Habibur, Mannodi-Kanakkithodi, A.",
    title: "High-throughput screening of ternary and quaternary chalcogenide semiconductors for photovoltaics",
    journal: "Computational Materials Science 249, 113654",
    year: "2025", me: true, citations: 8,
    abstract: "We perform high-throughput first-principles calculations to screen ternary and quaternary chalcogenide semiconductors for photovoltaic applications. By computing band gaps, absorption spectra, and thermodynamic stability across a wide compositional space, we identify promising candidates with optimal optoelectronic properties for thin-film solar cells.",
    highlights: ["High-throughput first-principles screening of ternary and quaternary chalcogenide semiconductors for photovoltaics", "Computes band gaps, absorption spectra, and thermodynamic stability across a wide compositional space", "Identifies promising candidates with optimal optoelectronic properties for thin-film solar cell applications", "Covers a broad compositional space to systematically evaluate chalcogenides for PV suitability"],
    link: "https://doi.org/10.1016/j.commatsci.2024.113654"
  },
  {
    authors: "Rahman, Md Habibur, Mannodi-Kanakkithodi, A.",
    title: "Defect modeling in semiconductors: the role of first principles simulations and machine learning",
    journal: "Journal of Physics: Materials, 8 (2), 022001",
    year: "2025", me: true, citations: 23,
    abstract: "This topical review covers the state-of-the-art in computational defect modeling for semiconductors. We discuss the theoretical foundations of defect thermodynamics, practical aspects of DFT supercell calculations including finite-size corrections, and emerging machine learning approaches that accelerate defect property predictions. The review bridges the gap between traditional first-principles methods and data-driven acceleration strategies.",
    highlights: ["Topical review covering state-of-the-art computational defect modeling for semiconductors", "Discusses theoretical foundations of defect thermodynamics and practical aspects of DFT supercell calculations", "Covers finite-size corrections and emerging ML approaches that accelerate defect property predictions", "Bridges the gap between traditional first-principles methods and data-driven acceleration strategies"],
    link: "https://doi.org/10.1088/2515-7639/adb181"
  },
  // ── 2024 ──
  {
    authors: "Rahman, Md Habibur, Biswas, M., Mannodi-Kanakkithodi, A.",
    title: "Understanding Defect-Mediated Ion Migration in Semiconductors using Atomistic Simulations and Machine Learning",
    journal: "ACS Materials Au, 4 (6), 557-573",
    year: "2024", me: true, citations: 35,
    abstract: "We investigate defect-mediated ion migration mechanisms in II-VI and halide perovskite semiconductors using a combination of nudged elastic band DFT calculations and machine learning models. By training graph neural networks on computed migration barriers, we enable rapid screening of diffusion pathways and identify compositional trends that govern ionic transport, critical for understanding device degradation and stability.",
    highlights: ["Investigates defect-mediated ion migration in II-VI and halide perovskite semiconductors using NEB DFT and ML", "Trains graph neural networks on computed migration barriers for rapid screening of diffusion pathways", "Identifies compositional trends governing ionic transport, critical for understanding device degradation", "Combines nudged elastic band calculations with ML to enable screening across multiple semiconductor families"],
    link: "https://doi.org/10.1021/acsmaterialsau.4c00095"
  },
  {
    authors: "Rahman, Md Habibur, Sun, Y., Mannodi-Kanakkithodi, A.",
    title: "High-throughput screening of single atom co-catalysts in ZnIn\u2082S\u2084 for photocatalysis",
    journal: "Materials Advances, 5 (21), 8673-8683",
    year: "2024", me: true, citations: 9,
    abstract: "We perform high-throughput DFT screening of 30+ transition metal single-atom co-catalysts embedded in ZnIn\u2082S\u2084, a promising photocatalyst for hydrogen evolution. By computing adsorption energies, charge transfer, and catalytic activity descriptors, we identify optimal co-catalyst species that enhance photocatalytic performance and provide design rules for rational catalyst engineering.",
    highlights: ["High-throughput DFT screening of 30+ transition metal single-atom co-catalysts embedded in ZnIn\u2082S\u2084", "Computes adsorption energies, charge transfer, and catalytic activity descriptors for hydrogen evolution", "Identifies optimal co-catalyst species that enhance photocatalytic performance for H\u2082 production", "Provides design rules for rational catalyst engineering on earth-abundant ZnIn\u2082S\u2084 photocatalysts"],
    link: "https://doi.org/10.1039/D4MA00726C"
  },
  {
    authors: "Rahman, Md Habibur, Gollapalli, P., Manganaris, P., Yadav, S.K., Pilania, G., DeCost, B., Choudhary, K., Mannodi-Kanakkithodi, A.",
    title: "Accelerating defect predictions in semiconductors using graph neural networks",
    journal: "APL Machine Learning, 2, 016122",
    year: "2024", me: true, citations: 53,
    abstract: "We develop a graph neural network framework for predicting point defect properties in semiconductors directly from crystal structure. Trained on a curated dataset of DFT-computed defect formation energies across multiple semiconductor families, the model achieves chemical accuracy while reducing computational cost by orders of magnitude, enabling rapid screening of defect-tolerant materials for optoelectronic applications.",
    highlights: ["Develops a graph neural network framework for predicting point defect properties directly from crystal structure", "Trained on a curated dataset of DFT-computed defect formation energies across multiple semiconductor families", "Achieves chemical accuracy while reducing computational cost by orders of magnitude vs. direct DFT", "Enables rapid screening of defect-tolerant materials for optoelectronic applications"],
    link: "https://doi.org/10.1063/5.0176333"
  },
  // ── 2023 ──
  {
    authors: "Han, C., Han, G., Rahman, Md Habibur, Mannodi-Kanakkithodi, A., Sun, Y.",
    title: "Photocatalytic Ketyl Radical Initiated C\u2013C Coupling on ZnIn\u2082S\u2084",
    journal: "Chemistry\u2014A European Journal, e202203785",
    year: "2023", me: false, citations: 11,
    abstract: "We demonstrate a novel photocatalytic strategy for C-C bond formation via ketyl radical intermediates on ZnIn\u2082S\u2084 semiconductor photocatalysts. Combined experimental and DFT studies reveal the mechanism of radical generation and coupling, providing insights into selective organic transformations driven by visible light on earth-abundant catalysts.",
    highlights: ["Demonstrates a novel photocatalytic C-C bond formation strategy via ketyl radical intermediates on ZnIn\u2082S\u2084", "Combined experimental and DFT studies reveal the mechanism of radical generation and coupling", "Provides insights into selective organic transformations driven by visible light on earth-abundant catalysts", "Establishes ZnIn\u2082S\u2084 as an effective semiconductor photocatalyst for ketyl radical-initiated C-C coupling"],
    link: "https://doi.org/10.1002/chem.202203785"
  },
  {
    authors: "Rahman, Md Habibur, Yang, J., Sun, Y., Mannodi-Kanakkithodi, A.",
    title: "Defect engineering in ZnIn\u2082X\u2084 (X=S, Se, Te) semiconductors for improved photocatalysis",
    journal: "Surfaces and Interfaces, 39, 102960",
    year: "2023", me: true, citations: 31,
    abstract: "We systematically investigate native point defects in ZnIn\u2082X\u2084 (X = S, Se, Te) photocatalysts using first-principles calculations. By mapping defect formation energies and charge transition levels across the three chalcogenides, we establish composition-dependent defect engineering strategies to optimize carrier concentrations and photocatalytic activity for water splitting applications.",
    highlights: ["Systematic first-principles investigation of native point defects in ZnIn\u2082X\u2084 (X = S, Se, Te) photocatalysts", "Maps defect formation energies and charge transition levels across the three chalcogenide compositions", "Establishes composition-dependent defect engineering strategies to optimize carrier concentrations", "Targets improved photocatalytic activity for water splitting applications through defect control"],
    link: "https://doi.org/10.1016/j.surfin.2023.102960"
  },
  {
    authors: "Singh, A., Yuan, B., Rahman, Md Habibur, et al.",
    title: "Two-Dimensional Halide Pb-Perovskite\u2013Double Perovskite Epitaxial Heterostructures",
    journal: "J. Am. Chem. Soc., 145 (36), 19885-19893",
    year: "2023", me: false, citations: 55,
    abstract: "We report the first epitaxial heterostructures between 2D lead halide perovskites and lead-free double perovskites, achieving atomically sharp interfaces. Through a combination of advanced electron microscopy, spectroscopy, and DFT calculations, we characterize the interfacial band alignment and charge transfer properties, opening new possibilities for stable, efficient perovskite optoelectronic devices.",
    highlights: ["Reports the first epitaxial heterostructures between 2D lead halide perovskites and lead-free double perovskites", "Achieves atomically sharp interfaces characterized by advanced electron microscopy and spectroscopy", "DFT calculations characterize the interfacial band alignment and charge transfer properties", "Opens new possibilities for stable, efficient perovskite optoelectronic devices"],
    link: "https://doi.org/10.1021/jacs.3c06127"
  },
  // ── 2022 ──
  {
    authors: "Rahman, Md Habibur, Jubair, Md, Rahaman, M.Z., Ahasan, M.S., Ostrikov, K.K., Roknuzzaman, Md",
    title: "RbSnX\u2083 (X=Cl, Br, I): promising lead-free metal halide perovskites for photovoltaics and optoelectronics",
    journal: "RSC Advances, 12 (12), 7497-7505",
    year: "2022", me: true, citations: 112,
    abstract: "We investigate RbSnX\u2083 (X = Cl, Br, I) as lead-free alternatives for perovskite photovoltaics using first-principles calculations. Comprehensive analysis of structural, electronic, optical, and mechanical properties reveals favorable band gaps, strong optical absorption, and good mechanical stability, establishing these materials as promising candidates for environmentally sustainable optoelectronic applications.",
    highlights: ["First-principles investigation of RbSnX\u2083 (X = Cl, Br, I) as lead-free alternatives for perovskite photovoltaics", "Comprehensive analysis of structural, electronic, optical, and mechanical properties reveals favorable band gaps", "Strong optical absorption and good mechanical stability established across all three compositions", "Identifies these materials as promising candidates for environmentally sustainable optoelectronic applications"],
    link: "https://doi.org/10.1039/D2RA00414C"
  },
  {
    authors: "Rahman, Md Habibur, Rahaman, M.Z., Chowdhury, E.H., Motalab, M., Hossain, A.K.M.A., Roknuzzaman, Md",
    title: "Understanding the role of rare-earth metal doping on the electronic structure and optical characteristics of ZnO",
    journal: "Molecular Systems Design & Engineering, 7, 1516-1528",
    year: "2022", me: true, citations: 48,
    abstract: "Using density functional theory, we investigate the effects of rare-earth metal doping on the electronic and optical properties of ZnO. All tested RE-doped samples exhibit negative formation energies and mechanical stability. Doping with Ce, Nd, Pm, Sm, Eu, and Gd substantially increases absorption and optical conductivity in the visible range, while electronic band structure analysis reveals reduced effective bandgaps facilitating photoelectron transfer.",
    highlights: ["DFT study of rare-earth metal doping effects on electronic and optical properties of ZnO", "All RE-doped samples exhibit negative formation energies and mechanical stability", "Ce, Nd, Pm, Sm, Eu, and Gd doping substantially increases absorption and optical conductivity in the visible range", "Electronic band structure analysis reveals reduced effective bandgaps facilitating photoelectron transfer"],
    link: "https://doi.org/10.1039/D2ME00093H"
  },
  {
    authors: "Rahman, Md Habibur, Rahaman, M.Z., Motalab, M., Hossain, A.K.M.A.",
    title: "First-principles prediction of outstanding mechanical and thermodynamic properties of YX\u2082Si\u2082 (X= Pd and Rh) superconductors",
    journal: "Materials Today Communications 31, 103785",
    year: "2022", me: true, citations: 10,
    abstract: "We investigate the mechanical and thermodynamic properties of YX\u2082Si\u2082 (X = Pd, Rh) superconductors using first-principles calculations. Comprehensive analysis of elastic constants, hardness, Debye temperature, and phonon properties reveals outstanding mechanical stability and favorable thermodynamic characteristics, establishing these materials as promising candidates for superconducting applications.",
    highlights: ["First-principles investigation of mechanical and thermodynamic properties of YX\u2082Si\u2082 (X = Pd, Rh) superconductors", "Comprehensive analysis of elastic constants, hardness, Debye temperature, and phonon properties", "Reveals outstanding mechanical stability and favorable thermodynamic characteristics", "Establishes these materials as promising candidates for superconducting applications"],
    link: "https://doi.org/10.1016/j.mtcomm.2022.103785"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Hong, S.",
    title: "Atomic-level investigation on the oxidation efficiency and corrosion resistance of lithium enhanced by the addition of two dimensional materials",
    journal: "RSC Advances 12 (9), 5458-5465",
    year: "2022", me: true, citations: 4,
    abstract: "We investigate the oxidation and corrosion resistance of lithium metal enhanced by two-dimensional material coatings using reactive molecular dynamics simulations. The addition of 2D materials such as graphene and hBN significantly improves the oxidation resistance of lithium surfaces, providing insights for designing protective coatings for lithium metal anodes in batteries.",
    highlights: ["Investigates oxidation and corrosion resistance of lithium metal enhanced by 2D material coatings", "Uses reactive molecular dynamics simulations to study Li surfaces coated with graphene and hBN", "2D material coatings significantly improve the oxidation resistance of lithium surfaces", "Provides insights for designing protective coatings for lithium metal anodes in batteries"],
    link: "https://doi.org/10.1039/D1RA07659K"
  },
  // ── 2021 ──
  {
    authors: "Redwan, D.A., Chowdhury, E.H., Rahman, Md Habibur, Prince, H.A.",
    title: "Numerical investigation on the electronic components' cooling for different coolants by finite element method",
    journal: "Heat Transfer, 50 (5), 4643\u20134655",
    year: "2021", me: true, citations: 5,
    link: "https://doi.org/10.1002/htj.22093",
    abstract: "A numerical simulation of the cooling performance of an aluminium finned heat sink attached to a silicon chip in a rectangular chamber, cooled by convective heat transfer using nine commercially available gases.",
    highlights: ["Simulates the cooling performance of an aluminium finned heat sink attached to a silicon chip", "Places the heat sink in a rectangular chamber cooled by convective heat transfer", "Compares nine commercially available gases as coolants using the finite element method", "Identifies which coolant choices give the best thermal performance for electronic components"]
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Hong, S.",
    title: "High temperature oxidation of monolayer MoS\u2082 and its effect on mechanical properties: A ReaxFF molecular dynamics study",
    journal: "Surfaces and Interfaces 26, 101371",
    year: "2021", me: true, citations: 58,
    abstract: "We investigate the oxidation kinetics of monolayer MoS\u2082 at elevated temperatures (1400\u20131800 K) using ReaxFF molecular dynamics. Oxidation starts by O\u2082 adsorption on S atoms and forms oxy-sulfide solid solution. Tensile simulations show oxidation notably degrades fracture strength, fracture strain, Young\u2019s modulus, and fracture toughness, with a phase transition from 2H to 1T phase observed in both pristine and oxidized MoS\u2082.",
    highlights: ["ReaxFF MD study of monolayer MoS\u2082 oxidation kinetics at elevated temperatures (1400\u20131800 K)", "Oxidation initiates by O\u2082 adsorption on S atoms, forming oxy-sulfide solid solution", "Tensile simulations show oxidation notably degrades fracture strength, fracture strain, Young\u2019s modulus, and fracture toughness", "Phase transition from 2H to 1T observed in both pristine and oxidized MoS\u2082 under tensile loading"],
    link: "https://www.sciencedirect.com/science/article/pii/S246802302100448X"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Redwan, D.A., Hong, S.",
    title: "Computational characterization of thermal and mechanical properties of single and bilayer germanene nanoribbon",
    journal: "Computational Materials Science, 190, 110272",
    year: "2021", me: true, citations: 40,
    abstract: "We employ equilibrium molecular dynamics simulations to reveal the mechanical strength, melting temperature, and phonon thermal conductivity of single-layer and bilayer germanene nanoribbon. Bilayer structures substantially reduce thermal conductivity compared to single-layer variants, while tensile strain increases phonon thermal conductivity. The study provides a comprehensive guideline for engineering the thermal conductivity of germanene for flexible nanoelectronics and thermoelectric devices.",
    highlights: ["Equilibrium MD simulations reveal mechanical strength, melting temperature, and thermal conductivity of germanene nanoribbons", "Bilayer structures substantially reduce thermal conductivity compared to single-layer variants", "Tensile strain increases phonon thermal conductivity in germanene nanoribbons", "Provides comprehensive guidelines for engineering thermal conductivity for flexible nanoelectronics and thermoelectrics"],
    link: "https://www.sciencedirect.com/science/article/abs/pii/S0927025620307229"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Shahadat, M.R.B., Islam, M.M.",
    title: "Engineered defects to modulate the phonon thermal conductivity of silicene: A nonequilibrium molecular dynamics study",
    journal: "Computational Materials Science, 191, 110338",
    year: "2021", me: true, citations: 40,
    abstract: "We employ optimized Tersoff potential to extensively investigate the thermal conductivity of pristine and defective silicene using non-equilibrium molecular dynamics simulations, analyzing the influence of temperature, carbon doping, and monovacancy concentration on phonon thermal conductivity along armchair and zigzag directions. The study offers a comprehensive roadmap for engineering the thermal conductivity of silicene for the semiconductor industry.",
    highlights: ["NEMD with optimized Tersoff potential investigates thermal conductivity of pristine and defective silicene", "Analyzes influence of temperature, carbon doping, and monovacancy concentration on phonon thermal conductivity", "Studies thermal transport along both armchair and zigzag directions in silicene", "Offers a comprehensive roadmap for engineering silicene thermal conductivity for the semiconductor industry"],
    link: "https://doi.org/10.1016/j.commatsci.2021.110338"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Redwan, D.A., Mitra, S., Hong, S.",
    title: "Nature of creep deformation in nanocrystalline cupronickel alloy: A molecular dynamics study",
    journal: "Results in Materials 10, 100191",
    year: "2021", me: true, citations: 26,
    abstract: "We use molecular dynamics to study the tensile, thermodynamic, and creep resistance of nanocrystalline cupronickel alloy. As copper content increases from 0 to 100%, the steady-state creep rate exhibits approximately a 12% increment, and the Cu\u2080.\u2085Ni\u2080.\u2085 alloy\u2019s creep rate increases dramatically under elevated stress, temperature, and decreasing grain size.",
    highlights: ["MD study of tensile, thermodynamic, and creep resistance of nanocrystalline cupronickel alloy", "Steady-state creep rate exhibits approximately 12% increment as copper content increases from 0 to 100%", "Cu\u2080.\u2085Ni\u2080.\u2085 alloy creep rate increases dramatically under elevated stress, temperature, and decreasing grain size", "Provides fundamental understanding of creep deformation mechanisms in nanocrystalline CuNi systems"],
    link: "https://www.sciencedirect.com/science/article/pii/S2590048X21000248"
  },
  {
    authors: "Rahman, Md Habibur, Islam, M.S., Islam, M.S., Chowdhury, E.H., Bose, P., Jayan, R., Islam, M.M.",
    title: "Phonon thermal conductivity of the stanene/hBN van der Waals heterostructure",
    journal: "Physical Chemistry Chemical Physics, 23 (18), 11028-11038",
    year: "2021", me: true, citations: 29,
    abstract: "We employ classical non-equilibrium molecular dynamics to examine phonon thermal conductivity in hexagonal boron nitride-supported stanene. The bulk thermal conductivities at room temperature are ~15.20, ~550, and ~232 W m\u207B\u00B9 K\u207B\u00B9 for bare stanene, hBN, and stanene/hBN respectively, indicating intermediate thermal properties between constituents with applications in nanoelectronic and thermoelectric devices.",
    highlights: ["NEMD study of phonon thermal conductivity in hBN-supported stanene van der Waals heterostructure", "Room-temperature bulk thermal conductivities: ~15.20 (stanene), ~550 (hBN), ~232 W/mK (stanene/hBN)", "Heterostructure exhibits intermediate thermal properties between its constituent materials", "Relevant for nanoelectronic and thermoelectric device applications"],
    link: "https://doi.org/10.1039/D1CP00343G"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Redwan, D.A., Mitra, S., Hong, S.",
    title: "Characterization of the mechanical properties of van der Waals heterostructures of stanene adsorbed on graphene, hexagonal boron-nitride and silicon carbide",
    journal: "Physical Chemistry Chemical Physics, 23 (9), 5244-5253",
    year: "2021", me: true, citations: 21,
    abstract: "We employ molecular dynamics simulations to investigate tensile strength in van der Waals heterostructures combining stanene with graphene, hexagonal boron nitride, and silicon carbide under armchair and zigzag loading at varying strain rates. The Sn/SiC heterostructure exhibits the lowest tensile strength while zigzag loading demonstrates superior strain tolerance, providing design insights for electronic, optoelectronic, and energy storage applications.",
    highlights: ["MD simulations of tensile strength in stanene/graphene, stanene/hBN, and stanene/SiC van der Waals heterostructures", "Studies armchair and zigzag loading directions at varying strain rates", "Sn/SiC heterostructure exhibits the lowest tensile strength; zigzag loading shows superior strain tolerance", "Provides design insights for electronic, optoelectronic, and energy storage applications"],
    link: "https://doi.org/10.1039/D0CP06426B"
  },
  {
    authors: "Chowdhury, E.H., Rahman, Md Habibur, Fatema, S., Islam, M.M.",
    title: "Investigation of the mechanical properties and fracture mechanisms of graphene/WSe\u2082 vertical heterostructure: A molecular dynamics study",
    journal: "Computational Materials Science 188, 110231",
    year: "2021", me: false, citations: 48,
    abstract: "We investigate the mechanical properties and fracture mechanisms of graphene/WSe\u2082 vertical heterostructures using molecular dynamics simulations. The effects of temperature, strain rate, and layer stacking on tensile behavior are systematically analyzed, revealing the role of interlayer interactions in determining the mechanical response of this promising 2D heterostructure.",
    highlights: ["MD investigation of mechanical properties and fracture mechanisms of graphene/WSe\u2082 vertical heterostructures", "Systematically analyzes effects of temperature, strain rate, and layer stacking on tensile behavior", "Reveals the role of interlayer interactions in determining heterostructure mechanical response", "Provides fundamental understanding of fracture mechanisms in this promising 2D heterostructure"],
    link: "https://doi.org/10.1016/j.commatsci.2020.110231"
  },
  {
    authors: "Chowdhury, E.H., Rahman, Md Habibur, Hong, S.",
    title: "Tensile strength and fracture mechanics of two-dimensional nanocrystalline silicon carbide",
    journal: "Computational Materials Science 197, 110580",
    year: "2021", me: false, citations: 29,
    abstract: "We investigate the tensile strength and fracture mechanics of two-dimensional nanocrystalline silicon carbide using molecular dynamics simulations. The effects of grain size, temperature, and strain rate on mechanical properties are systematically analyzed, providing insights into the deformation and failure mechanisms of this promising wide-bandgap semiconductor material.",
    highlights: ["MD investigation of tensile strength and fracture mechanics of 2D nanocrystalline silicon carbide", "Systematically analyzes effects of grain size, temperature, and strain rate on mechanical properties", "Provides insights into deformation and failure mechanisms of this wide-bandgap semiconductor", "Reveals fundamental fracture behavior relevant to SiC-based nanodevice applications"],
    link: "https://doi.org/10.1016/j.commatsci.2021.110580"
  },
  {
    authors: "Mitra, S., Rahman, Md Habibur, Motalab, M., Rakib, T., Bose, P.",
    title: "Tuning the mechanical properties of functionally graded nickel and aluminium alloy at the nanoscale",
    journal: "RSC Advances 11 (49), 30705-30718",
    year: "2021", me: false, citations: 22,
    abstract: "We investigate the mechanical properties of functionally graded nickel-aluminium alloy at the nanoscale using molecular dynamics simulations. The effects of composition gradient, temperature, and strain rate on tensile behavior are systematically analyzed, revealing how functional grading can be used to tune mechanical properties for advanced structural applications.",
    highlights: ["MD investigation of mechanical properties of functionally graded nickel-aluminium alloy at the nanoscale", "Analyzes effects of composition gradient, temperature, and strain rate on tensile behavior", "Reveals how functional grading can tune mechanical properties for advanced structural applications", "Provides guidance on optimizing composition gradients for improved mechanical performance"],
    link: "https://doi.org/10.1039/D1RA04571G"
  },
  {
    authors: "Chowdhury, E.H., Rahman, Md Habibur, Bose, P., Jayan, R., Islam, M.M.",
    title: "Atomistic investigation on the mechanical properties and failure behavior of zinc-blende cadmium selenide (CdSe) nanowire",
    journal: "Computational Materials Science, 186, 110001",
    year: "2021", me: false, citations: 34,
    abstract: "We investigate the mechanical properties and failure mechanism of zinc-blende CdSe nanowire at the atomistic level using molecular dynamics simulations. The effects of temperature (100\u2013600 K), nanowire size, loading along different crystal directions, and vacancy defects on uniaxial tensile behavior are analyzed. Young\u2019s modulus and ultimate strength show inverse relationship with temperature and defects.",
    highlights: ["Atomistic MD study of mechanical properties and failure mechanism of zinc-blende CdSe nanowire", "Analyzes effects of temperature (100\u2013600 K), nanowire size, crystal direction, and vacancy defects on tensile behavior", "Young\u2019s modulus and ultimate strength show inverse relationship with temperature and defect concentration", "Provides fundamental understanding of CdSe nanowire deformation and fracture at the atomic scale"],
    link: "https://www.sciencedirect.com/science/article/abs/pii/S0927025620304924"
  },
  // ── 2020 ──
  {
    authors: "Rahman, Md Habibur, Mitra, S., Redwan, D.A.",
    title: "Electronic Band Structure of Group IV 2D Materials: Graphene, Silicene, Germanene, Stanene using Tight Binding Approach",
    journal: "2020 2nd International Conference on Advanced Information and Communication Technology (ICAICT), 207\u2013212",
    year: "2020", me: true, citations: 8,
    link: "https://doi.org/10.1109/ICAICT51780.2020.9333480",
    abstract: "2D nanomaterials such as graphene, silicene, germanene and stanene are among the emerging materials for transistor scaling, with potential application in electronic, semiconductor and optoelectronic devices. Here the nearest neighbour tight-binding approach is used to extract the electronic band structure of these analogous 2D nanomaterials across armchair nanoribbon widths.",
    highlights: ["Applies a nearest neighbour tight-binding approach to graphene, silicene, germanene and stanene nanoribbons", "Extracts bandgaps of 1.91, 0.79, 0.80 and 0.60 eV for the four narrow 4-atom armchair nanoribbons", "Shows the gap collapsing to 0.35, 0.15, 0.15 and 0.11 eV at the wider 25-atom ribbon width", "Frames the results against the needs of transistor scaling in group IV two-dimensional materials"]
  },
  {
    authors: "Rahman, Md Habibur, Mitra, S., Motalab, M., Rakib, T.",
    title: "Investigation on the Temperature and Size Dependent Mechanical Properties and Failure Behavior of Zinc Blende (ZB) Gallium Nitride (GaN) Semiconducting Nanowire",
    journal: "2020 IEEE Region 10 Symposium (TENSYMP), 22\u201325",
    year: "2020", me: true, citations: 7,
    link: "https://doi.org/10.1109/TENSYMP50017.2020.9230906",
    abstract: "The mechanical properties of gallium nitride nanowire have drawn attention because of its use as an electronic and semiconducting material in LEDs, transistors, radars and Li-Fi communication systems. Molecular dynamics simulations with the Stillinger-Weber potential are used to explore the temperature-dependent mechanical properties of zinc-blende GaN nanowire under tensile loading from 100 K to 600 K.",
    highlights: ["Uses molecular dynamics with the Stillinger-Weber potential to load zinc-blende GaN nanowire in tension", "Varies temperature from 100 K to 600 K and tracks the resulting mechanical response", "Separates the temperature dependence from the size dependence of strength and failure", "Connects the results to GaN device use in LEDs, transistors, radars and Li-Fi systems"]
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Redwan, D.A., Prince, H.A., Amin, M.R.",
    title: "Numerical Investigation of Convective Heat Transfer on a Dynamic Wall Heat Exchanger With Varying Amplitude and Frequency",
    journal: "ASME International Mechanical Engineering Congress and Exposition, Volume 11: Heat Transfer and Thermal Engineering",
    year: "2020", me: true, citations: 3,
    link: "https://doi.org/10.1115/IMECE2020-23342",
    abstract: "A study of the thermo-hydraulic performance of a dynamic wall heat exchanger as the amplitude and frequency of the oscillating waveform are varied, with the lower wall under constant heat flux and the upper insulating wall deforming sinusoidally.",
    highlights: ["Investigates the thermo-hydraulic performance of a dynamic wall heat exchanger", "Varies both the amplitude and the frequency of the oscillating wall waveform", "Holds the lower wall at constant heat flux while the upper insulating wall deforms sinusoidally", "Maps how the oscillation parameters trade heat transfer against hydraulic cost"]
  },
  {
    authors: "Redwan, D.A., Rahman, Md Habibur, Prince, H.A., Chowdhury, E.H., Amin, M.R.",
    title: "Influence of Cu-Water and CNT-Water Nanofluid on Natural Convection Heat Transfer in a Triangular Solar Collector",
    journal: "ASME International Mechanical Engineering Congress and Exposition, Volume 11: Heat Transfer and Thermal Engineering",
    year: "2020", me: true, citations: 1,
    link: "https://doi.org/10.1115/IMECE2020-23191",
    abstract: "A numerical study of natural convection heat transfer in a right triangular solar collector filled with CNT-water and Cu-water nanofluids, with the inclined and bottom walls held at different temperatures.",
    highlights: ["Studies natural convection heat transfer in a right triangular solar collector", "Compares CNT-water and Cu-water nanofluids as the working fluid", "Holds the inclined and bottom walls at different temperatures to drive the convection", "Quantifies how nanoparticle choice changes collector heat transfer performance"]
  },
  {
    authors: "Chowdhury, E.H., Rahman, Md Habibur, Prince, H.A., Redwan, D.A., Rozin, E.H.",
    title: "Investigation on High Frequency Based Ultrasound Tissue Therapy by Finite Element Method",
    journal: "2020 2nd International Conference on Advanced Information and Communication Technology (ICAICT), 1\u20136",
    year: "2020", me: true, citations: 1,
    link: "https://doi.org/10.1109/ICAICT51780.2020.9333533",
    abstract: "High-intensity focused ultrasound is used both in cancer diagnosis and treatment and as a non-invasive cosmetic procedure for skin lifting and tightening. This model determines the effect of varying transducer frequency on the thermal response in the focal zone of a tissue phantom using multiphysics modelling.",
    highlights: ["Models high-intensity focused ultrasound therapy in a tissue phantom by finite element method", "Couples the Helmholtz pressure acoustic equation with Pennes' bio-heat and Stefan-Boltzmann equations", "Solves the coupled system using the Galerkin weighted residual finite element method", "Determines how transducer frequency changes the thermal response in the focal zone"]
  },
  {
    authors: "Rahman, Md Habibur, Mitra, S., Motalab, M., Bose, P.",
    title: "Investigation on the mechanical properties and fracture phenomenon of silicon doped graphene by molecular dynamics simulation",
    journal: "RSC Advances 10 (52), 31318-31332",
    year: "2020", me: true, citations: 52,
    abstract: "We investigate the mechanical properties and fracture phenomenon of silicon-doped graphene using molecular dynamics simulations. The effects of silicon doping concentration, temperature, and strain rate on tensile behavior are systematically analyzed, revealing how silicon substitution modifies the mechanical response and fracture mechanisms of graphene.",
    highlights: ["MD investigation of mechanical properties and fracture of silicon-doped graphene", "Systematically analyzes effects of Si doping concentration, temperature, and strain rate on tensile behavior", "Reveals how silicon substitution modifies the mechanical response and fracture mechanisms of graphene", "Provides insights into doping-induced changes in graphene mechanical performance"],
    link: "https://doi.org/10.1039/D0RA06085B"
  },
  {
    authors: "Rahman, Md Habibur, Chowdhury, E.H., Islam, M.M.",
    title: "Understanding mechanical properties and failure mechanism of germanium-silicon alloy at nanoscale",
    journal: "Journal of Nanoparticle Research 22, 1-12",
    year: "2020", me: true, citations: 33,
    abstract: "We investigate the mechanical properties and failure mechanisms of germanium-silicon alloy at the nanoscale using molecular dynamics simulations. The effects of composition, temperature, and crystal orientation on tensile behavior are systematically analyzed, providing fundamental insights into the deformation and fracture of this important semiconductor alloy.",
    highlights: ["MD investigation of mechanical properties and failure mechanisms of Ge-Si alloy at the nanoscale", "Analyzes effects of composition, temperature, and crystal orientation on tensile behavior", "Provides fundamental insights into deformation and fracture of this important semiconductor alloy", "Covers the full composition range to establish structure-property relationships"],
    link: "https://doi.org/10.1007/s11051-020-05040-0"
  },
  {
    authors: "Chowdhury, E.H., Rahman, Md Habibur, Bose, P., Jayan, R., Islam, M.M.",
    title: "Atomic-scale analysis of the physical strength and phonon transport mechanisms of monolayer \u03B2-bismuthene",
    journal: "Physical Chemistry Chemical Physics 22 (48), 28238-28255",
    year: "2020", me: false, citations: 30,
    abstract: "We perform atomic-scale analysis of the physical strength and phonon transport mechanisms of monolayer \u03B2-bismuthene using molecular dynamics simulations. The mechanical properties, thermal conductivity, and phonon dispersion are systematically characterized, providing fundamental understanding of this promising topological insulator material for thermoelectric and spintronic applications.",
    highlights: ["Atomic-scale MD analysis of physical strength and phonon transport in monolayer \u03B2-bismuthene", "Systematically characterizes mechanical properties, thermal conductivity, and phonon dispersion", "Provides fundamental understanding of this promising topological insulator material", "Relevant for thermoelectric and spintronic applications"],
    link: "https://doi.org/10.1039/D0CP04785F"
  },
];

export default function AboutMeModule({ onNavigate, dark, onToggleDark }) {
  const [tab, setTab] = useState("overview");

  // Set the mutable theme so all sub-components pick it up
  T = dark ? DARK : LIGHT;

  const totalCitations = 760;

  return (
    <div style={{
      width: 960, maxWidth: "100%", margin: "0 auto", padding: "24px 20px",
      fontFamily: '"Arial Narrow", "Archivo Narrow", "Roboto Condensed", Arial, sans-serif', color: T.ink,
      boxSizing: "border-box"
    }}>
      {/* Tab nav + dark/light toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        {TABS.map(t => (
          t.id === "blog" ? (
            <a key={t.id} href="/blog" style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.muted,
              fontWeight: 500, fontFamily: "inherit",
              transition: "all 0.15s",
              textDecoration: "none", display: "inline-block", whiteSpace: "nowrap"
            }}>
              {t.label}{"\u00A0"}{"\u2197"}
            </a>
          ) : (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: tab === t.id ? T.accent + "15" : T.surface,
              border: `1px solid ${tab === t.id ? T.accent : T.border}`,
              color: tab === t.id ? T.accent : T.muted,
              fontWeight: tab === t.id ? 500 : 500, fontFamily: "inherit",
              transition: "all 0.15s"
            }}>{t.label}</button>
          )
        ))}
        <div style={{ flex: 1 }} />
        {onToggleDark && (
          <button onClick={onToggleDark} style={{
            padding: "7px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer",
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.muted, fontFamily: "inherit", transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6
          }}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? "\u2600\uFE0F" : "\u{1F319}"}
            <span style={{ fontSize: 11, fontWeight: 500 }}>{dark ? "Light" : "Dark"}</span>
          </button>
        )}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === "overview" && (
        <div>
          <Card style={{ textAlign: "center", padding: "36px 24px" }}>
            <img src="/habibur.jpeg?v=2" alt="Md Habibur Rahman" style={{
              width: 110, height: 110, borderRadius: "50%", objectFit: "cover",
              margin: "0 auto 16px", display: "block",
              border: `3px solid ${T.accent}`,
              boxShadow: `0 4px 20px ${T.accent}25`
            }} />
            <div style={{ fontSize: 28, fontWeight: 500, marginBottom: 4 }}>Md Habibur Rahman</div>
            <div style={{ fontSize: 14, color: T.muted, marginBottom: 12 }}>
              Postdoctoral Researcher, Lawrence Berkeley National Laboratory
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <LinkBtn href="mailto:mhrahman@lbl.gov">mhrahman@lbl.gov</LinkBtn>
              <LinkBtn href="mailto:rahma103@purdue.edu">rahma103@purdue.edu</LinkBtn>
              <LinkBtn href="mailto:imd.habiburrahman@gmail.com">imd.habiburrahman@gmail.com</LinkBtn>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <LinkBtn href="https://github.com/msehabibur">GitHub</LinkBtn>
              <LinkBtn href="https://scholar.google.com/citations?user=vkAPzB0AAAAJ&hl=en">Google Scholar</LinkBtn>
              <LinkBtn href="https://www.linkedin.com/in/habibur-rahman-918466411/">LinkedIn</LinkBtn>
              <LinkBtn href="https://nanohub.org/members/274968/contributions">nanoHUB</LinkBtn>
              <LinkBtn href="https://github.com/msehabibur/DeepMSE">Tutorial</LinkBtn>
            </div>
          </Card>

          <SectionTitle>Summary</SectionTitle>
          <Card>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2.0, fontSize: 14, listStyleType: "disc" }}>
              <li>4+ years of experience in data-driven materials discovery and atomistic modeling, with publications in top-tier journals.</li>
              <li>3+ years of developing and deploying AI models and open science tools (e.g., nanoHUB).</li>
              <li>Recipient of the 2025 MRS Graduate Student Award, Boston.</li>
              <li>Recipient of the Vashti L. Magoon Research Excellence Award from Purdue University.</li>
              <li>Recipient of high-performance computing allocations from NSF ACCESS and Argonne National Laboratory.</li>
              <li>Recipient of the Materials Informatics Fellowship from GE Aerospace for Summer 2025 internship.</li>
              <li>Winner of the 2025 AI & ML for Microscopy Hackathon — Toyota Research Institute Prize.</li>
              <li>Winner of the 2025 LLM Hackathon for Applications in Materials Science and Engineering — Abstrax Prize.</li>
              <li>Winner of the 2025 NanoArtography Competition — promoting nanoscience through art.</li>
            </ul>
          </Card>

          <SectionTitle color={T.blue}>Research Keywords</SectionTitle>
          <Card>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2.0, fontSize: 14, listStyleType: "disc", color: T.ink }}>
              <li>Modelling & Simulations of Materials</li>
              <li>AI/ML for Accelerated Materials Discovery</li>
              <li>Defect Engineering in Semiconductors</li>
              <li>Photovoltaics</li>
              <li>Agentic System Design for Simulations at Scale</li>
              <li>High-Throughput DFT Databases</li>
              <li>Graph Neural Networks (GNN)</li>
              <li>Machine Learning Force Fields</li>
              <li>Active Learning & Uncertainty Quantification</li>
              <li>LLM-Based Data Mining (LangGraph)</li>
            </ul>
          </Card>

        </div>
      )}

      {/* ─── ELEMENT 119 ─── */}
      {tab === "blog" && (
        <div>
          <SectionTitle color={T.blue}>Interactive Materials Science</SectionTitle>
          <Card style={{ marginBottom: 16, padding: "16px 20px", background: T.blue + "06", border: `1px solid ${T.blue}25` }}>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: T.ink }}>
              An interactive learning platform covering the full stack of computational materials science — from
              quantum mechanics and density functional theory to machine learning force fields and data mining.
              Each chapter is a self-contained, animated module with equations, visualizations, and hands-on examples.
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {BLOG_CHAPTERS.map(ch => (
              <div key={ch.id} onClick={() => onNavigate && onNavigate(ch.id)} style={{
                background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
                padding: "18px 18px 14px", cursor: "pointer", transition: "all 0.2s",
                position: "relative", overflow: "hidden"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: T.accent, fontWeight: 500, letterSpacing: 1 }}>
                      CHAPTER {ch.chapter}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{ch.label}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{ch.desc}</div>
                <div style={{
                  marginTop: 10, fontSize: 11, color: T.accent, fontWeight: 500
                }}>Read chapter {"\u2192"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── EDUCATION ─── */}
      {tab === "education" && (
        <div>
          <SectionTitle color={T.blue}>Education</SectionTitle>
          <Card>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <strong style={{ fontSize: 15 }}>Purdue University</strong>
                <span style={{ fontSize: 12, color: T.muted }}>Aug 2022 – May 2026</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted }}>West Lafayette, Indiana, USA</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                PhD in Materials Engineering
              </div>
              <div style={{ fontSize: 13, color: T.ink, marginTop: 6, lineHeight: 1.6 }}>
                Thesis:{" "}
                <a
                  href="https://hammer.purdue.edu/articles/thesis/SIMULATING_AND_UNDERSTANDING_DEFECTS_IN_SEMICONDUCTORS_USING_DENSITY_FUNCTIONAL_THEORY_AND_MACHINE_LEARNING/32336814"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: T.accent, textDecoration: "none" }}
                >
                  Simulating and Understanding Defects in Semiconductors Using Density
                  Functional Theory and Machine Learning
                </a>
              </div>
              <Tag color={T.green}>Cgpa: 3.91 / 4.00</Tag>
              <div style={{ marginTop: 6 }}>
                <a href="https://engineering.purdue.edu/MSE/people/ptGradStudent?id=277454" target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 11, color: T.accent, textDecoration: "none", fontWeight: 500
                }}>View Purdue Profile {"\u2192"}</a>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <strong style={{ fontSize: 15 }}>Bangladesh University of Engineering and Technology (BUET)</strong>
                <span style={{ fontSize: 12, color: T.muted }}>Mar 2016 – Mar 2021</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted }}>Dhaka, Bangladesh</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>Bachelor of Science in Mechanical Engineering</div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── RESEARCH ─── */}
      {tab === "research" && (
        <div>
          <SectionTitle color={T.accent}>Atomistic Simulations & AI for Science</SectionTitle>

          {/* Block diagram */}
          <Card style={{ padding: 24 }}>
            {/* Top row: two input pillars */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 0 }}>
              {[
                { title: "First-Principles Simulations", color: T.blue, items: ["Density Functional Theory (VASP)", "GGA and HSE06 Functionals"] },
                { title: "Classical Simulations", color: T.green, items: ["Molecular Dynamics (LAMMPS)", "ReaxFF / EAM Potentials"] },
              ].map((block, i) => (
                <div key={i} style={{
                  flex: "1 1 260px", maxWidth: 340, background: block.color + "08",
                  border: `2px solid ${block.color}30`, borderRadius: 12, padding: "16px 18px"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: block.color, marginBottom: 10, textAlign: "center" }}>{block.title}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                    {block.items.map((item, j) => <div key={j}>{item}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow down */}
            <div style={{ textAlign: "center", fontSize: 24, color: T.muted, margin: "8px 0" }}>{"\u25BC"}</div>

            {/* Middle: Data & Training */}
            <div style={{
              maxWidth: 500, margin: "0 auto", background: T.amber + "08",
              border: `2px solid ${T.amber}30`, borderRadius: 12, padding: "16px 18px", marginBottom: 0
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.amber, marginBottom: 10, textAlign: "center" }}>Data-Driven Modeling & AI</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 12, lineHeight: 1.8, color: T.ink }}>
                <div>High-Throughput DFT Databases</div>
                <div>Graph Neural Networks (GNN)</div>
                <div>Machine Learning Force Fields</div>
                <div>Active Learning & Uncertainty Quantification</div>
                <div>LLM-Based Data Mining (LangGraph)</div>
              </div>
            </div>

            {/* Arrow down */}
            <div style={{ textAlign: "center", fontSize: 24, color: T.muted, margin: "8px 0" }}>{"\u25BC"}</div>

            {/* Bottom: application */}
            <div style={{
              maxWidth: 500, margin: "0 auto", background: T.teal + "08",
              border: `2px solid ${T.teal}30`, borderRadius: 12, padding: "16px 18px"
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.teal, marginBottom: 0, textAlign: "center" }}>Data-Driven Materials Design</div>
            </div>
          </Card>

          {/* Research Experience */}
          <SectionTitle color={T.green}>Research Experience</SectionTitle>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <strong style={{ fontSize: 14 }}>Postdoctoral Researcher, Lawrence Berkeley National Laboratory</strong>
                <span style={{ fontSize: 12, color: T.muted }}>2026 – Present</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                Agentic system design for simulations at scale — high-throughput DFT databases,
                graph neural networks, machine learning force fields, active learning and
                uncertainty quantification, and LLM-based data mining
              </div>
              <div style={{ fontSize: 12, color: T.accent, marginTop: 2 }}>Berkeley, California</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <strong style={{ fontSize: 14 }}>Material Informatics Fellow Intern, GE Aerospace</strong>
                <span style={{ fontSize: 12, color: T.muted }}>May 2025 – Aug 2025</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                AI-Driven Discovery of Thermal Barrier Coatings and Coolants for Aerospace Applications
              </div>
              <div style={{ fontSize: 12, color: T.accent, marginTop: 2 }}>Niskayuna, New York</div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                <strong style={{ fontSize: 14 }}>Graduate Research Assistant, Purdue University</strong>
                <span style={{ fontSize: 12, color: T.muted }}>Aug 2022 – May 2026</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                Modeling and Simulations of Semiconductors for Photovoltaics
              </div>
              <div style={{ fontSize: 12, color: T.accent, marginTop: 2 }}>West Lafayette, Indiana</div>
            </div>
          </Card>
        </div>
      )}

      {/* ─── PUBLICATIONS ─── */}
      {tab === "publications" && (
        <div>
          <SectionTitle color={T.green}>Publications</SectionTitle>

          {/* Stats banner */}
          <div style={{
            display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap"
          }}>
            <a href="https://scholar.google.com/citations?user=vkAPzB0AAAAJ&hl=en" target="_blank" rel="noopener noreferrer" style={{
              flex: "1 1 200px", padding: "16px 20px", borderRadius: 12,
              background: `linear-gradient(135deg, ${T.accent}12, ${T.blue}12)`,
              border: `1.5px solid ${T.accent}30`, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: T.accent + "20", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, flexShrink: 0
              }}>G</div>
              <div>
                <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, letterSpacing: 1, textTransform: "none" }}>Google Scholar</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: T.ink }}>918 citations</div>
                <div style={{ fontSize: 12, color: T.muted }}>h-index: 20 · i10-index: 23</div>
              </div>
            </a>
          </div>

          {/* Hint */}
          <div style={{
            fontSize: 12, color: T.muted, marginBottom: 14,
            padding: "8px 12px", background: T.surface, borderRadius: 8,
            border: `1px dashed ${T.border}`
          }}>
            Click on any paper to expand and see the abstract, key contributions, and links.
          </div>

          {/* Publication cards */}
          {PUBLICATIONS.map((pub, i) => (
            <PubCard key={i} pub={pub} index={i} />
          ))}
        </div>
      )}

      {/* ─── AWARDS ─── */}
      {tab === "awards" && (
        <div>
          <SectionTitle color={T.amber}>Awards & Honors</SectionTitle>
          {[
            { title: "2025 AI/ML for Microscopy Hackathon Winner — Toyota Research Institute Prize", org: "DeepScan Pro", color: T.green, link: "https://kaliningroup.github.io/mic_hackathon_2/awards/", github: "https://github.com/msehabibur/mic-hackathon-25" },
            { title: "2025 NanoArtography Competition Winner", org: "Promoting nanoscience through art", color: T.red, link: "https://www.nanoartography.org/2025" },
            { title: "2025 MRS Graduate Student Award", org: "Materials Research Society, Boston", color: T.amber, link: "https://www.mrs.org/advancing-careers/award-central/spring-awards/graduate-student-awards/past-recipients" },
            { title: "2025 LLM Hackathon for Applications in Materials Science & Chemistry Winner — Abstrax Prize", org: "LLM Hackathon for Materials Science & Engineering", color: T.pink, link: "https://llmhackathon.github.io/awards/", github: "https://github.com/msehabibur/gcxgc_peakcards" },
            { title: "2025 Vashti L. Magoon Research Excellence Award", org: "Purdue University", color: T.accent, link: "https://engineering.purdue.edu/Engr/People/Awards/Graduate/ptRecipientListing?group_id=237384&show_sub_groups=1" },
            { title: "2025 Materials Informatics Fellowship", org: "GE Aerospace, Summer 2025 Internship", color: T.blue },
            { title: "Frederick N. Andrews Environmental Travel Grant ($1,500)", org: "Purdue University Graduate School \u2014 Selected from many exceptional interdisciplinary applications across Purdue University for approved conference travel expenses.", color: T.green },
          ].map((award, i) => (
            <Card key={i} style={{ padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  minWidth: 36, height: 36, borderRadius: 10,
                  background: award.color + "15", border: `1.5px solid ${award.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16
                }}>{"\u2605"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{award.title}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{award.org}</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {award.link && (
                      <a href={award.link} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 11, color: award.color, textDecoration: "none", fontWeight: 500
                      }}>View details {"\u2192"}</a>
                    )}
                    {award.github && (
                      <a href={award.github} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: 11, color: T.muted, textDecoration: "none", fontWeight: 500
                      }}>GitHub {"\u2192"}</a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── CONFERENCES ─── */}
      {tab === "conferences" && (
        <div>
          <SectionTitle color={T.teal}>Conference Presentations</SectionTitle>
          <Card style={{ marginBottom: 12, padding: "10px 14px", background: T.teal + "08", border: `1px solid ${T.teal}30` }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.teal }}>10+ Conference and Seminar Presentations</div>
          </Card>
          {[
            { title: "Data-Driven Discovery of Ternary and Quaternary Chalcogenide Semiconductors for Photovoltaics", venue: "2025 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2025", link: "https://www.mrs.org/meetings-events/annual-meetings/archive/meeting/presentations/view/2025-mrs-fall-meeting/2025-mrs-fall-meeting-4377025" },
            { title: "Learning Defect Thermodynamics in Chalcogenide Semiconductors Using a Graph Neural Network Force Field", venue: "2025 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2025", link: "https://www.mrs.org/meetings-events/annual-meetings/archive/meeting/presentations/view/2025-mrs-fall-meeting/2025-mrs-fall-meeting-4376462" },
            { title: "Rational Computational Design of Next-Generation Semiconductors (Invited Talk)", venue: "Cyberinfrastructure Symposium, Purdue University", date: "Oct 2025", link: "https://www.rcac.purdue.edu/symposiums/cyberinfrastructure/wl-2025" },
            { title: "Tailoring Semiconductor Defect Properties using Multi-fidelity Graph Neural Networks and Active Learning", venue: "APS Global Physics Summit, Anaheim, CA", date: "Mar 2025", link: "https://summit.aps.org/events/MAR-C49/5" },
            { title: "Data-Driven Discovery of Novel Chalcogenides for Photovoltaics", venue: "2024 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2024", link: "https://www.mrs.org/meetings-events/annual-meetings/2024-mrs-fall-meeting/symposium-sessions/presentations/view/2024-fall-meeting/2024-fall-meeting-4149616" },
            { title: "Tailoring Semiconductor Defect Properties Using Graph Neural Networks and Active Learning", venue: "2024 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2024", link: "https://www.mrs.org/meetings-events/annual-meetings/2024-mrs-fall-meeting/symposium-sessions/presentations/view/2024-fall-meeting/2024-fall-meeting-4148678" },
            { title: "Accelerating Defect Predictions in Semiconductors Using Crystal Graphs", venue: "MS&T Fall 2024 Meeting, Pittsburgh, PA", date: "Oct 2024", link: "https://www.programmaster.org/PM/PM.nsf/ApprovedAbstracts/C034017F310DDE4285258B0F00685A59?OpenDocument" },
            { title: "Accelerating Defect Predictions in Semiconductors Using Graph Neural Networks", venue: "AIMS, NIST", date: "July 2023" },
          ].map((conf, i) => (
            <Card key={i} style={{ padding: "12px 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Tag color={T.teal}>{conf.date}</Tag>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, marginBottom: 3 }}>{conf.title}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{conf.venue}</div>
                  {conf.link && (
                    <a href={conf.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 11, color: T.teal, textDecoration: "none", fontWeight: 500
                    }}>View abstract {"\u2192"}</a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── SOFTWARE ─── */}
      {tab === "software" && (
        <div>
          <SectionTitle color={T.accent}>Open Source Software Developed</SectionTitle>

          {/* DefectDB */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: T.accent }}>DefectDB</div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 4 }}>
              An Open-Source Infrastructure for Defect Thermodynamics in II–VI Semiconductors
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
              Rahman, Md Habibur & Mannodi-Kanakkithodi, A. · nanoHUB Tool (2026)
            </div>
            {/* Flowchart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
              {["Curated database of defect formation energies and transition levels using HSE+SOC level of theory", "High-throughput DFT defect calculations for Cd/Zn-S/Se/Te compounds", "Interactive web interface for querying defect properties by composition", "Open-access deployment on nanoHUB for the research community"].map((h, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", background: T.accent,
                      border: `2px solid ${T.panel}`, boxShadow: `0 0 0 2px ${T.accent}40`,
                      flexShrink: 0, marginTop: 6
                    }} />
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: T.accent + "30" }} />}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.5, padding: "4px 0 10px 8px" }}>{h}</div>
                </div>
              ))}
            </div>
            <a href="https://nanohub.org/tools/defectdatabase" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              background: T.accent + "10", color: T.accent, textDecoration: "none",
              border: `1px solid ${T.accent}30`
            }}>Visit on nanoHUB {"\u2192"}</a>
          </Card>

          {/* ChalcoDB */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: T.green }}>ChalcoDB</div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 4 }}>
              An Open-Source Informatics Platform for Data-Driven Design of I–II–IV–VI and I–III–VI Semiconductors
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
              Rahman, Md Habibur & Mannodi-Kanakkithodi, A. · nanoHUB Tool (2026)
            </div>
            {/* Flowchart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
              {["Comprehensive DFT dataset for multinary chalcogenide semiconductors", "Band gap, formation energy, and stability predictions across compositions", "ML models for rapid property screening beyond the training set", "Interactive platform for materials selection and visualization"].map((h, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", background: T.green,
                      border: `2px solid ${T.panel}`, boxShadow: `0 0 0 2px ${T.green}40`,
                      flexShrink: 0, marginTop: 6
                    }} />
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: T.green + "30" }} />}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.5, padding: "4px 0 10px 8px" }}>{h}</div>
                </div>
              ))}
            </div>
            <a href="https://nanohub.org/resources/chalcodb" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              background: T.green + "10", color: T.green, textDecoration: "none",
              border: `1px solid ${T.green}30`
            }}>Visit on nanoHUB {"\u2192"}</a>
          </Card>

          {/* MATAIStudio */}
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: T.blue }}>Materials Informatics Studio</div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, marginBottom: 4 }}>
              An Integrated nanoHUB Platform for Computational Material Design
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
              Rahman, Md Habibur; Desai, Rushik & Mannodi-Kanakkithodi, Arun Kumar · nanoHUB Tool (2026)
            </div>
            {/* Flowchart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
              {["Interactive toolkit leveraging universal ML force fields (M3GNet, CHGNet, MACE-MP) for near-DFT accuracy at 3–4 orders of magnitude lower cost", "Universal Defect Simulator: end-to-end defect characterization with MD capabilities (NVT, NPT, Langevin ensembles)", "Surface Adsorption Simulator: automated slab generation, 50+ molecule library, and intelligent adsorption site detection for catalysis studies", "Diffusion Pathway Simulator: NEB methods with MLFF acceleration for migration barrier mapping and ion transport prediction"].map((h, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                  <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", background: T.blue,
                      border: `2px solid ${T.panel}`, boxShadow: `0 0 0 2px ${T.blue}40`,
                      flexShrink: 0, marginTop: 6
                    }} />
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: T.blue + "30" }} />}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.5, padding: "4px 0 10px 8px" }}>{h}</div>
                </div>
              ))}
            </div>
            <a href="https://nanohub.org/tools/mataistudio" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              background: T.blue + "10", color: T.blue, textDecoration: "none",
              border: `1px solid ${T.blue}30`
            }}>Visit on nanoHUB {"\u2192"}</a>
          </Card>
        </div>
      )}

    </div>
  );
}
