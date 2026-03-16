import { useState } from "react";

// Theme — matches main app
const T = {
  bg:      "#f0f2f5",
  panel:   "#ffffff",
  surface: "#f7f8fa",
  border:  "#d4d8e0",
  ink:     "#1a1e2e",
  muted:   "#6b7280",
  dim:     "#c0c6d0",
  accent:  "#7c3aed",
  blue:    "#2563eb",
  green:   "#059669",
  amber:   "#d97706",
  red:     "#dc2626",
  teal:    "#0891b2",
  pink:    "#ec4899",
};

const SectionTitle = ({ children, color }) => (
  <div style={{
    fontSize: 20, fontWeight: 800, color: color || T.accent, marginBottom: 16,
    borderBottom: `3px solid ${color || T.accent}`, paddingBottom: 8,
    fontFamily: "'Inter', sans-serif",
  }}>{children}</div>
);

const Card = ({ children, style }) => (
  <div style={{
    background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
    padding: 20, marginBottom: 16, ...style,
  }}>{children}</div>
);

const Tag = ({ children, color }) => (
  <span style={{
    display: "inline-block", padding: "4px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 600, background: (color || T.accent) + "15",
    color: color || T.accent, border: `1px solid ${(color || T.accent)}30`,
    marginRight: 6, marginBottom: 4,
  }}>{children}</span>
);

const LinkBtn = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{
    color: T.accent, fontSize: 12, fontWeight: 600, textDecoration: "none",
    borderBottom: `1px dashed ${T.accent}50`,
  }}>{children}</a>
);

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
const TABS = [
  { id: "overview",      label: "Overview" },
  { id: "education",     label: "Education" },
  { id: "publications",  label: "Publications" },
  { id: "awards",        label: "Awards" },
  { id: "conferences",   label: "Conferences" },
  { id: "software",      label: "Software" },
  { id: "skills",        label: "Skills" },
];

export default function AboutMeModule() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{
      maxWidth: 960, margin: "0 auto", padding: "24px 20px",
      fontFamily: "'Inter', -apple-system, sans-serif", color: T.ink,
    }}>
      {/* Tab nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "7px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
            background: tab === t.id ? T.accent + "15" : T.surface,
            border: `1px solid ${tab === t.id ? T.accent : T.border}`,
            color: tab === t.id ? T.accent : T.muted,
            fontWeight: tab === t.id ? 700 : 500, fontFamily: "inherit",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ─── OVERVIEW ─── */}
      {tab === "overview" && (
        <div>
          {/* Hero card */}
          <Card style={{ textAlign: "center", padding: "36px 24px" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.accent}, ${T.blue})`,
              margin: "0 auto 16px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 32, fontWeight: 900, color: "#fff",
            }}>MH</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Md Habibur Rahman</div>
            <div style={{ fontSize: 14, color: T.muted, marginBottom: 12 }}>
              PhD Candidate, School of Materials Engineering, Purdue University
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <LinkBtn href="mailto:rahma103@purdue.edu">rahma103@purdue.edu</LinkBtn>
              <LinkBtn href="mailto:imd.habiburrahman@gmail.com">imd.habiburrahman@gmail.com</LinkBtn>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <LinkBtn href="https://github.com/msehabibur">GitHub</LinkBtn>
              <LinkBtn href="https://scholar.google.com/citations?user=vkAPzB0AAAAJ&hl=en">Google Scholar</LinkBtn>
              <LinkBtn href="https://www.linkedin.com/in/habibur-rahman-55a932120/">LinkedIn</LinkBtn>
              <LinkBtn href="https://nanohub.org/members/274968/contributions">nanoHUB</LinkBtn>
              <LinkBtn href="https://github.com/msehabibur/DeepMSE">Tutorial</LinkBtn>
            </div>
          </Card>

          {/* Summary */}
          <SectionTitle>Summary</SectionTitle>
          <Card>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 14 }}>
              <li>4+ years of experience in <strong>data-driven materials discovery</strong> and atomistic modeling, with publications in top-tier journals.</li>
              <li>3+ years developing and deploying <strong>AI models and open science tools</strong> (e.g., nanoHUB).</li>
              <li>Recipient of the <strong>2025 MRS Graduate Student Award</strong>, Boston.</li>
              <li>Recipient of the <strong>Vashti L. Magoon Research Excellence Award</strong> from Purdue University.</li>
              <li>Recipient of high-performance computing allocations from NSF <strong>ACCESS</strong> and <strong>Argonne National Laboratory</strong>.</li>
              <li>Recipient of the <strong>Materials Informatics Fellowship</strong> from GE Aerospace for Summer 2025 internship.</li>
              <li>Winner of the <strong>2025 AI & ML for Microscopy Hackathon</strong> (Toyota Research Institute).</li>
              <li>Winner of the <strong>2025 LLM Hackathon</strong> for Applications in Materials Science and Engineering.</li>
              <li>Winner of the <strong>2025 NanoArtography Competition</strong> — promoting nanoscience through art.</li>
            </ul>
          </Card>

          {/* Research Interests */}
          <SectionTitle color={T.blue}>Research Interests</SectionTitle>
          <Card>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag color={T.blue}>Modelling & Simulations of Materials</Tag>
              <Tag color={T.green}>AI/ML for Accelerated Materials Discovery</Tag>
              <Tag color={T.amber}>Defect Engineering in Semiconductors</Tag>
              <Tag color={T.teal}>Photovoltaics</Tag>
              <Tag color={T.accent}>Machine Learning Force Fields</Tag>
              <Tag color={T.red}>High-Throughput DFT</Tag>
            </div>
          </Card>

          {/* Research Experience */}
          <SectionTitle color={T.green}>Research Experience</SectionTitle>
          <Card>
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
                <span style={{ fontSize: 12, color: T.muted }}>Aug 2022 – Present</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>
                Modeling and Simulations of Semiconductors for Photovoltaics
              </div>
              <div style={{ fontSize: 12, color: T.accent, marginTop: 2 }}>West Lafayette, Indiana</div>
            </div>
          </Card>
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
                <span style={{ fontSize: 12, color: T.muted }}>Aug 2022 – Present</span>
              </div>
              <div style={{ fontSize: 13, color: T.muted }}>West Lafayette, Indiana, USA</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                PhD in Materials Engineering — Supervisor: <strong>Prof. Arun Mannodi-Kanakkithodi</strong>
              </div>
              <Tag color={T.green}>CGPA: 3.91 / 4.00</Tag>
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

      {/* ─── PUBLICATIONS ─── */}
      {tab === "publications" && (
        <div>
          <SectionTitle color={T.green}>Recent Publications</SectionTitle>
          <Card style={{ marginBottom: 8, padding: "12px 16px", background: T.accent + "08", border: `1px solid ${T.accent}30` }}>
            <div style={{ fontSize: 13 }}>
              <strong>Google Scholar:</strong>{" "}
              <a href="https://scholar.google.com/citations?user=vkAPzB0AAAAJ&hl=en" target="_blank" rel="noopener noreferrer" style={{ color: T.accent, textDecoration: "none" }}>
                Citations: 740 · h-index: 18 · i10-index: 18
              </a>
            </div>
          </Card>

          {[
            {
              authors: "Rahman, Md Habibur, & Mannodi-Kanakkithodi, A.",
              title: "DeFecT-FF: Accelerated Modeling of Defects in Cd-Zn-Te-Se-S Compounds Combining High-Throughput DFT and Machine Learning Force Fields",
              journal: "arXiv preprint arXiv:2510.23514",
              year: "2025",
              me: true,
            },
            {
              authors: "Tenorio, Miguel; Rahman, Md Habibur; Mannodi-Kanakkithodi, Arun; Chapman, James",
              title: "Out-of-distribution machine learning for materials discovery: challenges and opportunities",
              journal: "Chemical Physics Reviews, Accepted",
              year: "2026",
              me: true,
            },
            {
              authors: "Rahman, Md Habibur, Rojsatien, S., Krasikov, D., Chan, M.K.Y., Bertoni, M., Mannodi-Kanakkithodi, A.",
              title: "First principles investigation of dopants and defect complexes in CdSe\u2093Te\u2081\u208B\u2093",
              journal: "Solar Energy Materials and Solar Cells, 293, 113857",
              year: "2025",
              me: true,
            },
            {
              authors: "Rahman, Md Habibur, Mannodi-Kanakkithodi, Arun",
              title: "Defect modeling in semiconductors: the role of first principles simulations and machine learning",
              journal: "Journal of Physics: Materials, 8 (2), 022001",
              year: "2025",
              me: true,
            },
            {
              authors: "Rahman, Md Habibur, Biswas, M., Mannodi-Kanakkithodi, A.",
              title: "Understanding Defect-Mediated Ion Migration in Semiconductors using Atomistic Simulations and Machine Learning",
              journal: "ACS Materials Au, 4 (6), 557-573",
              year: "2024",
              me: true,
            },
            {
              authors: "Rahman, Md Habibur, Sun, Y., Mannodi-Kanakkithodi, A.",
              title: "High-throughput screening of single atom co-catalysts in ZnIn\u2082S\u2084 for photocatalysis",
              journal: "Materials Advances, 5 (21), 8673-8683",
              year: "2024",
              me: true,
            },
            {
              authors: "Rahman, Md Habibur, Gollapalli, P., Manganaris, P., Yadav, S.K., Pilania, G., DeCost, B., Choudhary, K., Mannodi-Kanakkithodi, A.",
              title: "Accelerating defect predictions in semiconductors using graph neural networks",
              journal: "APL Machine Learning, 2, 016122",
              year: "2024",
              me: true,
            },
            {
              authors: "Han, C., Han, G., Rahman, Md Habibur, Mannodi-Kanakkithodi, A., Sun, Y.",
              title: "Photocatalytic Ketyl Radical Initiated C\u2013C Coupling on ZnIn\u2082S\u2084",
              journal: "Chemistry\u2014A European Journal, e202203785",
              year: "2023",
              me: false,
            },
            {
              authors: "Rahman, Md Habibur, Yang, J., Sun, Y., Mannodi-Kanakkithodi, A.",
              title: "Defect engineering in ZnIn\u2082X\u2084 (X=S, Se, Te) semiconductors for improved photocatalysis",
              journal: "Surfaces and Interfaces, 39, 102960",
              year: "2023",
              me: true,
            },
            {
              authors: "Singh, A., Yuan, B., Rahman, Md Habibur, Yang, H., De, A., Park, J.Y., Zhang, S., Huang, L., Mannodi-Kanakkithodi, A., Pennycook, T.J.",
              title: "Two-Dimensional Halide Pb-Perovskite\u2013Double Perovskite Epitaxial Heterostructures",
              journal: "J. Am. Chem. Soc., 145 (36), 19885-19893",
              year: "2023",
              me: false,
            },
            {
              authors: "Rahman, Md Habibur, Jubair, Md, Rahaman, M.Z., Ahasan, M.S., Ostrikov, K.K., Roknuzzaman, Md",
              title: "RbSnX\u2083 (X=Cl, Br, I): promising lead-free metal halide perovskites for photovoltaics and optoelectronics",
              journal: "RSC Advances, 12 (12), 7497-7505",
              year: "2022",
              me: true,
            },
          ].map((pub, i) => (
            <Card key={i} style={{ padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  minWidth: 28, height: 28, borderRadius: "50%",
                  background: pub.me ? T.accent + "15" : T.blue + "15",
                  color: pub.me ? T.accent : T.blue,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, marginTop: 2,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>
                    {pub.title}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                    {pub.authors}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    <em style={{ color: T.ink }}>{pub.journal}</em>
                    <Tag color={T.green}>{pub.year}</Tag>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── AWARDS ─── */}
      {tab === "awards" && (
        <div>
          <SectionTitle color={T.amber}>Awards & Honors</SectionTitle>
          {[
            { title: "2025 MRS Graduate Student Award", org: "Materials Research Society, Boston", color: T.amber, link: "https://www.mrs.org/advancing-careers/award-central/spring-awards/graduate-student-awards/past-recipients" },
            { title: "Vashti L. Magoon Research Excellence Award", org: "Purdue University", color: T.accent, link: "https://engineering.purdue.edu/Engr/People/Awards/Graduate/ptRecipientListing?group_id=237384&show_sub_groups=1" },
            { title: "Materials Informatics Fellowship", org: "GE Aerospace, Summer 2025 Internship", color: T.blue },
            { title: "NSF ACCESS & Argonne HPC Allocations", org: "High-performance computing for materials research", color: T.teal },
            { title: "2025 AI & ML for Microscopy Hackathon Winner", org: "Toyota Research Institute (TRI)", color: T.green, link: "https://kaliningroup.github.io/mic_hackathon_2/awards/" },
            { title: "2025 LLM Hackathon Winner", org: "LLM Hackathon for Materials Science & Engineering", color: T.pink, link: "https://llmhackathon.github.io/awards/" },
            { title: "2025 NanoArtography Competition Winner", org: "Promoting nanoscience through art", color: T.red, link: "https://www.nanoartography.org/2025" },
          ].map((award, i) => (
            <Card key={i} style={{ padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  minWidth: 36, height: 36, borderRadius: 10,
                  background: award.color + "15", border: `1.5px solid ${award.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>{"\u2605"}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{award.title}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{award.org}</div>
                  {award.link && (
                    <a href={award.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 11, color: award.color, textDecoration: "none", fontWeight: 600,
                    }}>View details {"\u2192"}</a>
                  )}
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
            <div style={{ fontSize: 13, fontWeight: 600, color: T.teal }}>10+ Conference and Seminar Presentations</div>
          </Card>
          {[
            { title: "Data-Driven Discovery of Ternary and Quaternary Chalcogenide Semiconductors for Photovoltaics", venue: "2025 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2025", link: null },
            { title: "Learning Defect Thermodynamics in Chalcogenide Semiconductors Using a Graph Neural Network Force Field", venue: "2025 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2025", link: null },
            { title: "Rational Computational Design of Next-Generation Semiconductors (Invited Talk)", venue: "Cyberinfrastructure Symposium, Purdue University", date: "Oct 2025", link: "https://www.rcac.purdue.edu/symposiums/cyberinfrastructure/wl-2025" },
            { title: "Tailoring Semiconductor Defect Properties using Multi-fidelity Graph Neural Networks and Active Learning", venue: "APS Global Physics Summit, Anaheim, CA", date: "Mar 2025", link: "https://summit.aps.org/events/MAR-C49/5" },
            { title: "Data-Driven Discovery of Novel Chalcogenides for Photovoltaics", venue: "2024 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2024", link: "https://www.mrs.org/meetings-events/annual-meetings/2024-mrs-fall-meeting/symposium-sessions/presentations/view/2024-fall-meeting/2024-fall-meeting-4149616" },
            { title: "Tailoring Semiconductor Defect Properties Using Graph Neural Networks and Active Learning", venue: "2024 MRS Fall Meeting & Exhibit, Boston, MA", date: "Dec 2024", link: "https://www.mrs.org/meetings-events/annual-meetings/2024-mrs-fall-meeting/symposium-sessions/presentations/view/2024-fall-meeting/2024-fall-meeting-4148678" },
            { title: "Accelerating Defect Predictions in Semiconductors Using Crystal Graphs", venue: "MS&T Fall 2024 Meeting, Pittsburgh, PA", date: "Oct 2024", link: "https://www.programmaster.org/PM/PM.nsf/ApprovedAbstracts/C034017F310DDE4285258B0F00685A59?OpenDocument" },
            { title: "Accelerating Defect Predictions in Semiconductors Using Graph Neural Networks", venue: "AIMS, NIST", date: "July 2023", link: null },
          ].map((conf, i) => (
            <Card key={i} style={{ padding: "12px 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Tag color={T.teal}>{conf.date}</Tag>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 3 }}>{conf.title}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{conf.venue}</div>
                  {conf.link && (
                    <a href={conf.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 11, color: T.teal, textDecoration: "none", fontWeight: 600,
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
          <Card>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>DefectDB</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                An Open-Source Infrastructure for Defect Thermodynamics in II–VI Semiconductors
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                Rahman, Md Habibur & Mannodi-Kanakkithodi, A. · nanoHUB Tool (2026)
              </div>
              <a href="https://nanohub.org/tools/defectdatabase" target="_blank" rel="noopener noreferrer" style={{
                fontSize: 12, color: T.accent, textDecoration: "none", fontWeight: 600,
              }}>Visit on nanoHUB {"\u2192"}</a>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>ChalcoDB</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                An Open-Source Informatics Platform for Data-Driven Design of I–II–IV–VI and I–III–VI Semiconductors
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                Rahman, Md Habibur & Mannodi-Kanakkithodi, A. · nanoHUB Tool (2026)
              </div>
              <a href="https://nanohub.org/resources/chalcodb" target="_blank" rel="noopener noreferrer" style={{
                fontSize: 12, color: T.accent, textDecoration: "none", fontWeight: 600,
              }}>Visit on nanoHUB {"\u2192"}</a>
            </div>
          </Card>
        </div>
      )}

      {/* ─── SKILLS ─── */}
      {tab === "skills" && (
        <div>
          <SectionTitle color={T.blue}>Skills Summary</SectionTitle>
          {[
            { category: "Atomic Scale Simulation Tools", items: ["VASP", "LAMMPS"], color: T.red },
            { category: "Data Preprocessing and Analysis", items: ["Pandas", "NumPy", "Matplotlib"], color: T.blue },
            { category: "Machine Learning Frameworks", items: ["Scikit-learn", "PyTorch", "TensorFlow", "Keras"], color: T.green },
            { category: "Generative AI", items: ["Fine-tuning generative AI models", "Deploying with Streamlit"], color: T.accent },
          ].map((skill, i) => (
            <Card key={i} style={{ padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: skill.color }}>{skill.category}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {skill.items.map((item, j) => (
                  <Tag key={j} color={skill.color}>{item}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
