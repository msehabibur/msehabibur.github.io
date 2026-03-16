import { useState, useEffect } from "react";

const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0",
  df_primary: "#dc2626", df_vacancy: "#ef4444", df_interstitial: "#f97316",
  df_schottky: "#7c3aed", df_frenkel: "#2563eb", df_disloc: "#0d9488", df_grain: "#ca8a04",
};

function Tag({ color, children }) {
  return (
    <span style={{
      display: "inline-block", padding: "1px 8px", borderRadius: 4,
      fontSize: 11, fontWeight: 700, background: color + "22",
      border: `1px solid ${color}55`, color, letterSpacing: 1,
    }}>{children}</span>
  );
}

function SectionTitle({ color, icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: color + "22", border: `1px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>{icon}</div>
      <div style={{
        fontSize: 15, fontWeight: 800, color,
        letterSpacing: 1, textTransform: "uppercase",
      }}>{children}</div>
    </div>
  );
}

// ── SECTION 1: WHY DEFECTS MATTER ──────────────────────────────────────────
function IntroSection() {
  const [showDefect, setShowDefect] = useState(false);
  const gridSize = 7;
  const spacing = 40;
  const defectPos = { r: 3, c: 3 };

  return (
    <div>
      <SectionTitle color={T.df_primary} icon={"\u2757"}>Why Defects Matter</SectionTitle>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ color: T.ink, lineHeight: 1.8, fontSize: 14 }}>
            Real crystals are <b>never perfect</b>. Thermodynamics guarantees that defects exist at any temperature
            above 0 K because they increase entropy. The equilibrium defect concentration follows:
          </p>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, margin: "12px 0", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: T.df_primary, textAlign: "center" }}>
              ΔG = ΔH - TΔS &lt; 0 → defects are thermodynamically favorable
            </div>
          </div>
          <p style={{ color: T.muted, lineHeight: 1.8, fontSize: 13 }}>
            Defects control nearly every useful property: electrical conductivity, optical absorption,
            mechanical strength, diffusion rates, and chemical reactivity.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <Tag color={T.df_vacancy}>0D: Point</Tag>
            <Tag color={T.df_disloc}>1D: Line</Tag>
            <Tag color={T.df_grain}>2D: Planar</Tag>
            <Tag color={T.df_primary}>3D: Volume</Tag>
          </div>
        </div>
        <div>
          <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: 300 }}>
            <rect width={300} height={300} fill={T.bg} rx={12} />
            {Array.from({ length: gridSize }, (_, r) =>
              Array.from({ length: gridSize }, (_, c) => {
                const isDefect = showDefect && r === defectPos.r && c === defectPos.c;
                const x = 25 + c * spacing;
                const y = 25 + r * spacing;
                return (
                  <g key={`${r}-${c}`}>
                    <circle cx={x} cy={y} r={isDefect ? 0 : 10}
                      fill={T.df_frenkel + "88"} stroke={T.df_frenkel} strokeWidth={1} />
                    {isDefect && (
                      <circle cx={x} cy={y} r={12}
                        fill="none" stroke={T.df_vacancy} strokeWidth={2} strokeDasharray="4 3" />
                    )}
                  </g>
                );
              })
            )}
            <text x={150} y={290} textAnchor="middle" fontSize={11} fill={T.muted}>
              {showDefect ? "Crystal with vacancy" : "Perfect crystal"}
            </text>
          </svg>
          <button onClick={() => setShowDefect(!showDefect)} style={{
            marginTop: 8, padding: "6px 16px", borderRadius: 6,
            border: `1px solid ${T.df_primary}`, background: T.df_primary + "11",
            color: T.df_primary, cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}>{showDefect ? "Show perfect" : "Introduce defect"}</button>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 2: POINT DEFECTS ───────────────────────────────────────────────
function PointDefectsSection() {
  const [activeDefects, setActiveDefects] = useState({ vacancy: true, interstitial: false, substitutional: false });
  const gridSize = 6;
  const spacing = 44;

  const toggleDefect = (type) => setActiveDefects(prev => ({ ...prev, [type]: !prev[type] }));

  const defectInfo = [
    { type: "vacancy", label: "Vacancy", color: T.df_vacancy, desc: "Missing atom from lattice site", pos: { r: 2, c: 2 } },
    { type: "interstitial", label: "Interstitial", color: T.df_interstitial, desc: "Extra atom between lattice sites", pos: { r: 3, c: 3, offset: true } },
    { type: "substitutional", label: "Substitutional", color: T.df_schottky, desc: "Foreign atom on lattice site", pos: { r: 4, c: 4 } },
  ];

  return (
    <div>
      <SectionTitle color={T.df_vacancy} icon={"\u26AB"}>Point Defects</SectionTitle>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
            Point defects are <b>0-dimensional</b> disruptions involving single atoms or small clusters.
            They are the most fundamental type of crystal defect.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {defectInfo.map(d => (
              <button key={d.type} onClick={() => toggleDefect(d.type)} style={{
                padding: "8px 14px", borderRadius: 8, textAlign: "left",
                border: `2px solid ${activeDefects[d.type] ? d.color : T.border}`,
                background: activeDefects[d.type] ? d.color + "15" : T.surface,
                cursor: "pointer",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.label}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{d.desc}</div>
              </button>
            ))}
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Equilibrium Concentration</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_primary }}>
              n/N = exp(-E_f / k_B T)
            </div>
          </div>
        </div>
        <svg viewBox="0 0 290 290" style={{ width: "100%", maxWidth: 290 }}>
          <rect width={290} height={290} fill={T.bg} rx={12} />
          {Array.from({ length: gridSize }, (_, r) =>
            Array.from({ length: gridSize }, (_, c) => {
              const x = 25 + c * spacing;
              const y = 25 + r * spacing;
              const isVacancy = activeDefects.vacancy && r === 2 && c === 2;
              const isSub = activeDefects.substitutional && r === 4 && c === 4;
              return (
                <g key={`${r}-${c}`}>
                  {isVacancy ? (
                    <circle cx={x} cy={y} r={12} fill="none" stroke={T.df_vacancy} strokeWidth={2} strokeDasharray="4 3" />
                  ) : isSub ? (
                    <circle cx={x} cy={y} r={10} fill={T.df_schottky + "55"} stroke={T.df_schottky} strokeWidth={2} />
                  ) : (
                    <circle cx={x} cy={y} r={10} fill={T.df_frenkel + "55"} stroke={T.df_frenkel} strokeWidth={1} />
                  )}
                </g>
              );
            })
          )}
          {activeDefects.interstitial && (
            <circle cx={25 + 3.5 * spacing} cy={25 + 3.5 * spacing} r={8}
              fill={T.df_interstitial + "88"} stroke={T.df_interstitial} strokeWidth={2} />
          )}
        </svg>
      </div>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${T.border}` }}>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Material</th>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Defect</th>
            <th style={{ textAlign: "right", padding: 8, color: T.ink }}>E_f (eV)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Cu", "Vacancy", "1.28"], ["Al", "Vacancy", "0.75"], ["Si", "Vacancy", "3.6"],
            ["NaCl", "Schottky pair", "2.18"], ["AgBr", "Frenkel pair", "1.16"],
          ].map(([mat, def, ef], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: 8, color: T.ink, fontWeight: 600 }}>{mat}</td>
              <td style={{ padding: 8, color: T.muted }}>{def}</td>
              <td style={{ padding: 8, color: T.df_primary, textAlign: "right", fontFamily: "monospace" }}>{ef}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ── SECTION 3: SCHOTTKY & FRENKEL ──────────────────────────────────────────
function SchottkyFrenkelSection() {
  const [defectType, setDefectType] = useState("schottky");

  return (
    <div>
      <SectionTitle color={T.df_schottky} icon={"\uD83D\uDD73\uFE0F"}>Schottky & Frenkel Defects</SectionTitle>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {["schottky", "frenkel"].map(t => (
          <button key={t} onClick={() => setDefectType(t)} style={{
            padding: "8px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13,
            border: `2px solid ${defectType === t ? (t === "schottky" ? T.df_schottky : T.df_frenkel) : T.border}`,
            background: defectType === t ? (t === "schottky" ? T.df_schottky : T.df_frenkel) + "15" : T.surface,
            color: defectType === t ? (t === "schottky" ? T.df_schottky : T.df_frenkel) : T.muted,
            cursor: "pointer", textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          {defectType === "schottky" ? (
            <>
              <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
                A <b>Schottky defect</b> is a pair of vacancies: one cation and one anion missing from the lattice.
                The ions migrate to the crystal surface. Charge neutrality is preserved.
              </p>
              <div style={{ background: T.surface, borderRadius: 8, padding: 12, margin: "12px 0", border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_schottky }}>
                  n_s = N · exp(-E_s / 2k_BT)
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                  where E_s is the Schottky formation energy
                </div>
              </div>
              <p style={{ color: T.muted, fontSize: 13 }}>
                Common in ionic crystals with similar cation/anion sizes: NaCl, KCl, KBr, MgO.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
                A <b>Frenkel defect</b> occurs when an atom moves from its lattice site to an interstitial position,
                creating a vacancy-interstitial pair. Common when cation is much smaller than anion.
              </p>
              <div style={{ background: T.surface, borderRadius: 8, padding: 12, margin: "12px 0", border: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_frenkel }}>
                  n_f = √(N · N_i) · exp(-E_f / 2k_BT)
                </div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                  N_i = number of interstitial sites
                </div>
              </div>
              <p style={{ color: T.muted, fontSize: 13 }}>
                Common in: AgCl, AgBr, CaF₂ (anion Frenkel). Size ratio r_cation/r_anion is key.
              </p>
            </>
          )}
        </div>
        <svg viewBox="0 0 280 240" style={{ width: "100%", maxWidth: 280 }}>
          <rect width={280} height={240} fill={T.bg} rx={12} />
          {defectType === "schottky" ? (
            <>
              {/* NaCl-type lattice with Schottky pair */}
              {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => {
                const x = 30 + c * 50;
                const y = 30 + r * 40;
                const isCation = (r + c) % 2 === 0;
                const isVacancy = (r === 2 && c === 1) || (r === 2 && c === 3);
                return (
                  <g key={`${r}-${c}`}>
                    {isVacancy ? (
                      <circle cx={x} cy={y} r={10} fill="none" stroke={T.df_vacancy} strokeWidth={2} strokeDasharray="3 3" />
                    ) : (
                      <circle cx={x} cy={y} r={isCation ? 8 : 11}
                        fill={isCation ? T.df_frenkel + "66" : T.df_interstitial + "44"}
                        stroke={isCation ? T.df_frenkel : T.df_interstitial} strokeWidth={1} />
                    )}
                  </g>
                );
              }))}
              <text x={140} y={230} textAnchor="middle" fontSize={11} fill={T.muted}>Schottky pair in NaCl</text>
            </>
          ) : (
            <>
              {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => {
                const x = 30 + c * 50;
                const y = 30 + r * 40;
                const isCation = (r + c) % 2 === 0;
                const isMissing = r === 2 && c === 2 && isCation;
                return (
                  <g key={`${r}-${c}`}>
                    {isMissing ? (
                      <circle cx={x} cy={y} r={10} fill="none" stroke={T.df_vacancy} strokeWidth={2} strokeDasharray="3 3" />
                    ) : (
                      <circle cx={x} cy={y} r={isCation ? 8 : 11}
                        fill={isCation ? T.df_frenkel + "66" : T.df_interstitial + "44"}
                        stroke={isCation ? T.df_frenkel : T.df_interstitial} strokeWidth={1} />
                    )}
                  </g>
                );
              }))}
              {/* Interstitial atom */}
              <circle cx={155} cy={130} r={7} fill={T.df_frenkel} stroke={T.df_frenkel} strokeWidth={2} />
              <line x1={130} y1={110} x2={148} y2={126} stroke={T.df_frenkel} strokeWidth={1.5} strokeDasharray="3 2" markerEnd="url(#arrowF)" />
              <text x={140} y={230} textAnchor="middle" fontSize={11} fill={T.muted}>Frenkel defect</text>
            </>
          )}
        </svg>
      </div>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${T.border}` }}>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Material</th>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Defect Type</th>
            <th style={{ textAlign: "right", padding: 8, color: T.ink }}>E (eV)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["NaCl", "Schottky", "2.18"], ["MgO", "Schottky", "6.5"], ["KCl", "Schottky", "2.50"],
            ["AgCl", "Cation Frenkel", "1.40"], ["AgBr", "Cation Frenkel", "1.16"],
            ["CaF\u2082", "Anion Frenkel", "2.70"],
          ].map(([mat, type, e], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: 8, color: T.ink, fontWeight: 600 }}>{mat}</td>
              <td style={{ padding: 8, color: T.muted }}>{type}</td>
              <td style={{ padding: 8, color: T.df_primary, textAlign: "right", fontFamily: "monospace" }}>{e}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ── SECTION 4: KROGER-VINK NOTATION ────────────────────────────────────────
function KrogerVinkSection() {
  return (
    <div>
      <SectionTitle color={T.df_primary} icon={"\uD83D\uDCDD"}>Kröger-Vink Notation</SectionTitle>
      <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
        Kröger-Vink notation provides a systematic way to describe point defects in ionic crystals.
        Each symbol has three parts: <b>species</b> (main), <b>site</b> (subscript), <b>charge</b> (superscript).
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
        {[
          { sym: "\u00D7", name: "Neutral", desc: "Effective charge = 0" },
          { sym: "\u2022", name: "Positive", desc: "Each \u2022 = +1 effective charge" },
          { sym: "\u2032", name: "Negative", desc: "Each \u2032 = -1 effective charge" },
        ].map((ch, i) => (
          <div key={i} style={{
            padding: 12, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, flex: 1, minWidth: 120,
          }}>
            <div style={{ fontSize: 24, textAlign: "center", color: T.df_primary, fontWeight: 700 }}>{ch.sym}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, textAlign: "center" }}>{ch.name}</div>
            <div style={{ fontSize: 11, color: T.muted, textAlign: "center" }}>{ch.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${T.border}` }}>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Notation</th>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Meaning</th>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Example</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["M_M\u00D7", "Metal on metal site (neutral)", "Zn on Zn site in ZnO"],
            ["V_O\u2022\u2022", "Oxygen vacancy (+2 charge)", "Missing O in oxide"],
            ["O_i\u2032\u2032", "Oxygen interstitial (-2 charge)", "Extra O in interstitial"],
            ["Li_Na\u2032", "Li substituting Na (-1 charge)", "Li doping in NaCl"],
            ["e\u2032", "Free electron", "Conduction electron"],
            ["h\u2022", "Electron hole", "Valence band hole"],
          ].map(([not_, mean, ex], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: 8, fontFamily: "monospace", color: T.df_primary, fontWeight: 600 }}>{not_}</td>
              <td style={{ padding: 8, color: T.ink }}>{mean}</td>
              <td style={{ padding: 8, color: T.muted, fontSize: 11 }}>{ex}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div style={{ background: T.surface, borderRadius: 8, padding: 14, marginTop: 16, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Balance Rules</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["Mass balance", "Atoms are conserved on both sides"],
            ["Charge balance", "Total effective charge is the same on both sides"],
            ["Site balance", "Ratio of sites must match the crystal structure"],
          ].map(([rule, desc], i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Tag color={T.df_primary}>{rule}</Tag>
              <span style={{ fontSize: 12, color: T.muted }}>{desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: 13, color: T.df_schottky }}>
          Example (Schottky in MgO): null → V_Mg′′ + V_O••
        </div>
      </div>
    </div>
  );
}

// ── SECTION 5: DEFECT CHEMISTRY ────────────────────────────────────────────
function DefectChemistrySection() {
  const [logPO2, setLogPO2] = useState(0);

  const brouwerData = [
    { x: -20, lines: [{ y: -2, label: "[V_O]", color: T.df_vacancy }, { y: -3, label: "[e']", color: T.df_frenkel }, { y: -6, label: "[h\u2022]", color: T.df_interstitial }] },
    { x: -10, lines: [{ y: -3, label: "[V_O]", color: T.df_vacancy }, { y: -4, label: "[e']", color: T.df_frenkel }, { y: -5, label: "[h\u2022]", color: T.df_interstitial }] },
    { x: 0, lines: [{ y: -4.5, label: "[V_O]", color: T.df_vacancy }, { y: -4.5, label: "[e']", color: T.df_frenkel }, { y: -4.5, label: "[h\u2022]", color: T.df_interstitial }] },
    { x: 10, lines: [{ y: -5, label: "[V_O]", color: T.df_vacancy }, { y: -6, label: "[e']", color: T.df_frenkel }, { y: -3, label: "[h\u2022]", color: T.df_interstitial }] },
  ];

  return (
    <div>
      <SectionTitle color={T.df_schottky} icon={"\u2697\uFE0F"}>Defect Chemistry</SectionTitle>
      <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
        Defect concentrations depend on temperature, atmosphere (pO₂), and doping.
        <b> Brouwer diagrams</b> show log[defect] vs log(pO₂), revealing dominant defect regimes.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 12 }}>
        <svg viewBox="0 0 320 240" style={{ width: "100%", maxWidth: 320 }}>
          <rect width={320} height={240} fill={T.bg} rx={12} />
          {/* Axes */}
          <line x1={50} y1={200} x2={300} y2={200} stroke={T.ink} strokeWidth={1} />
          <line x1={50} y1={30} x2={50} y2={200} stroke={T.ink} strokeWidth={1} />
          <text x={175} y={225} textAnchor="middle" fontSize={11} fill={T.ink}>log(pO₂)</text>
          <text x={15} y={115} textAnchor="middle" fontSize={11} fill={T.ink} transform="rotate(-90, 15, 115)">log[defect]</text>
          {/* n-type region */}
          <line x1={60} y1={60} x2={160} y2={120} stroke={T.df_vacancy} strokeWidth={2} />
          <line x1={60} y1={50} x2={160} y2={130} stroke={T.df_frenkel} strokeWidth={2} />
          {/* Intrinsic */}
          <line x1={160} y1={120} x2={200} y2={120} stroke={T.df_vacancy} strokeWidth={2} strokeDasharray="4 2" />
          {/* p-type region */}
          <line x1={200} y1={120} x2={290} y2={170} stroke={T.df_interstitial} strokeWidth={2} />
          <line x1={200} y1={130} x2={290} y2={60} stroke={T.df_vacancy} strokeWidth={2} />
          {/* Labels */}
          <text x={80} y={45} fontSize={10} fill={T.df_frenkel}>n-type</text>
          <text x={165} y={110} fontSize={10} fill={T.muted}>intrinsic</text>
          <text x={250} y={55} fontSize={10} fill={T.df_interstitial}>p-type</text>
        </svg>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Mass Action Law</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_schottky }}>
              K = [V_O••][e′]² / pO₂^(-1/2)
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>
              At low pO₂: n-type (oxygen vacancies + electrons dominate)<br/>
              At high pO₂: p-type (holes dominate)
            </div>
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Electroneutrality</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: T.df_primary }}>
              2[V_O••] + [h•] = [e′] + 2[V_M′′]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 6: DISLOCATIONS ────────────────────────────────────────────────
function DislocationsSection() {
  const [dislType, setDislType] = useState("edge");

  return (
    <div>
      <SectionTitle color={T.df_disloc} icon={"\uD83D\uDCCF"}>Dislocations</SectionTitle>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {["edge", "screw"].map(t => (
          <button key={t} onClick={() => setDislType(t)} style={{
            padding: "8px 20px", borderRadius: 8, fontWeight: 700, fontSize: 13,
            border: `2px solid ${dislType === t ? T.df_disloc : T.border}`,
            background: dislType === t ? T.df_disloc + "15" : T.surface,
            color: dislType === t ? T.df_disloc : T.muted,
            cursor: "pointer", textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg viewBox="0 0 300 260" style={{ width: "100%", maxWidth: 300 }}>
          <rect width={300} height={260} fill={T.bg} rx={12} />
          {dislType === "edge" ? (
            <>
              {/* Edge dislocation - show rows of atoms with extra half-plane */}
              {[0,1,2,3,4,5].map(r => {
                const cols = r < 3 ? 7 : 6;
                const xOff = r < 3 ? 0 : 20;
                return Array.from({ length: cols }, (_, c) => {
                  const x = 25 + xOff + c * 40;
                  const y = 25 + r * 38;
                  const isExtra = r === 2 && c === 6;
                  return (
                    <circle key={`${r}-${c}`} cx={x} cy={y} r={8}
                      fill={isExtra ? T.df_disloc + "88" : T.df_frenkel + "44"}
                      stroke={isExtra ? T.df_disloc : T.df_frenkel}
                      strokeWidth={isExtra ? 2 : 1} />
                  );
                });
              })}
              {/* Burgers vector */}
              <line x1={200} y1={200} x2={240} y2={200} stroke={T.df_primary} strokeWidth={2} markerEnd="url(#arrowD)" />
              <text x={220} y={220} textAnchor="middle" fontSize={11} fill={T.df_primary} fontWeight={700}>b</text>
              <text x={150} y={250} textAnchor="middle" fontSize={11} fill={T.muted}>Edge dislocation (⊥)</text>
              <defs>
                <marker id="arrowD" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill={T.df_primary} />
                </marker>
              </defs>
            </>
          ) : (
            <>
              {/* Screw dislocation - show atoms in a helical pattern */}
              {[0,1,2,3,4,5].map(r =>
                Array.from({ length: 6 }, (_, c) => {
                  const x = 30 + c * 42;
                  const y = 25 + r * 36 + (c >= 3 && r >= 3 ? 10 : 0);
                  return (
                    <circle key={`${r}-${c}`} cx={x} cy={y} r={8}
                      fill={T.df_frenkel + "44"} stroke={T.df_frenkel} strokeWidth={1} />
                  );
                })
              )}
              <line x1={150} y1={200} x2={150} y2={240} stroke={T.df_primary} strokeWidth={2} markerEnd="url(#arrowD)" />
              <text x={165} y={225} fontSize={11} fill={T.df_primary} fontWeight={700}>b</text>
              <text x={150} y={255} textAnchor="middle" fontSize={11} fill={T.muted}>Screw dislocation</text>
            </>
          )}
        </svg>
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
            {dislType === "edge"
              ? "An edge dislocation is an extra half-plane of atoms inserted into the crystal. The Burgers vector b is perpendicular to the dislocation line."
              : "A screw dislocation creates a helical ramp around the dislocation line. The Burgers vector b is parallel to the dislocation line."}
          </p>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Peach-Koehler Force</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_disloc }}>
              F = (σ · b) × ξ
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
              σ = stress tensor, b = Burgers vector, ξ = line direction
            </div>
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 8, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Strain Energy</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_disloc }}>
              E ≈ Gb²/2 (per unit length)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 7: PLANAR DEFECTS ──────────────────────────────────────────────
function PlanarDefectsSection() {
  return (
    <div>
      <SectionTitle color={T.df_grain} icon={"\uD83D\uDCC4"}>Planar Defects</SectionTitle>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg viewBox="0 0 300 240" style={{ width: "100%", maxWidth: 300 }}>
          <rect width={300} height={240} fill={T.bg} rx={12} />
          {/* Grain boundary visualization */}
          {/* Left grain */}
          {[0,1,2,3,4,5].map(r =>
            Array.from({ length: 3 }, (_, c) => (
              <circle key={`L${r}-${c}`} cx={30 + c * 35} cy={25 + r * 36} r={7}
                fill={T.df_frenkel + "55"} stroke={T.df_frenkel} strokeWidth={1} />
            ))
          )}
          {/* Grain boundary line */}
          <line x1={140} y1={15} x2={140} y2={230} stroke={T.df_grain} strokeWidth={3} strokeDasharray="6 3" />
          {/* Right grain (tilted) */}
          {[0,1,2,3,4,5].map(r =>
            Array.from({ length: 3 }, (_, c) => {
              const angle = 15 * Math.PI / 180;
              const bx = 180 + c * 35;
              const by = 25 + r * 36;
              const rx = 160 + (bx - 160) * Math.cos(angle) - (by - 120) * Math.sin(angle);
              const ry = 120 + (bx - 160) * Math.sin(angle) + (by - 120) * Math.cos(angle);
              return (
                <circle key={`R${r}-${c}`} cx={rx} cy={ry} r={7}
                  fill={T.df_interstitial + "44"} stroke={T.df_interstitial} strokeWidth={1} />
              );
            })
          )}
          <text x={70} y={235} textAnchor="middle" fontSize={10} fill={T.muted}>Grain 1</text>
          <text x={230} y={235} textAnchor="middle" fontSize={10} fill={T.muted}>Grain 2</text>
          <text x={140} y={235} textAnchor="middle" fontSize={10} fill={T.df_grain} fontWeight={700}>GB</text>
        </svg>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Grain Boundaries", desc: "Interface between crystals of different orientation. Tilt (rotation about axis in boundary) and twist (rotation about axis normal to boundary).", color: T.df_grain },
              { name: "Twin Boundaries", desc: "Mirror reflection of crystal across the boundary plane. Lower energy than general grain boundaries.", color: T.df_disloc },
              { name: "Stacking Faults", desc: "Error in the stacking sequence (e.g., ABCABC\u2192ABCBABC in FCC). Bounded by partial dislocations.", color: T.df_frenkel },
              { name: "Antiphase Boundaries", desc: "In ordered alloys, region where sublattice assignment is reversed.", color: T.df_schottky },
            ].map((d, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.name}</div>
                <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{d.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Hall-Petch Relationship</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_grain }}>
              σ_y = σ_0 + k / √d
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
              Yield strength increases as grain size d decreases
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SECTION 8: DIFFUSION ───────────────────────────────────────────────────
function DiffusionSection() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTime(t => (t + 1) % 100), 80);
    return () => clearInterval(id);
  }, []);

  const gaussWidth = 10 + time * 0.6;

  return (
    <div>
      <SectionTitle color={T.df_frenkel} icon={"\uD83D\uDD00"}>Diffusion</SectionTitle>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ color: T.ink, fontSize: 14, lineHeight: 1.8 }}>
            Atomic diffusion in solids occurs primarily via <b>vacancy</b> and <b>interstitial</b> mechanisms.
            The rate is described by Fick's laws and follows Arrhenius temperature dependence.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {[
              { law: "Fick's 1st Law", eq: "J = -D (dc/dx)", desc: "Flux proportional to concentration gradient" },
              { law: "Fick's 2nd Law", eq: "\u2202c/\u2202t = D (\u2202\u00B2c/\u2202x\u00B2)", desc: "Concentration change with time" },
              { law: "Arrhenius", eq: "D = D\u2080 exp(-E_A / k_BT)", desc: "Diffusivity exponentially depends on temperature" },
            ].map((f, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.df_frenkel }}>{f.law}</div>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: T.df_primary, margin: "4px 0" }}>{f.eq}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <svg viewBox="0 0 280 220" style={{ width: "100%", maxWidth: 280 }}>
            <rect width={280} height={220} fill={T.bg} rx={12} />
            {/* Concentration profile */}
            <text x={140} y={18} textAnchor="middle" fontSize={11} fill={T.ink} fontWeight={600}>Concentration Profile</text>
            <line x1={30} y1={190} x2={260} y2={190} stroke={T.ink} strokeWidth={1} />
            <line x1={30} y1={30} x2={30} y2={190} stroke={T.ink} strokeWidth={1} />
            <text x={145} y={207} textAnchor="middle" fontSize={10} fill={T.muted}>Position x</text>
            <text x={12} y={110} textAnchor="middle" fontSize={10} fill={T.muted} transform="rotate(-90, 12, 110)">C(x)</text>
            {/* Gaussian curves at different times */}
            {[0, 30, 60, 90].map((tOff, idx) => {
              const w = 10 + tOff * 0.6;
              const amp = 150 / (1 + tOff * 0.02);
              const points = Array.from({ length: 50 }, (_, i) => {
                const x = 30 + i * (230 / 49);
                const xc = (i - 25) / 25;
                const y = 185 - amp * Math.exp(-(xc * xc) / (2 * (w / 50) * (w / 50)));
                return `${x},${y}`;
              }).join(" ");
              return (
                <polyline key={idx} points={points}
                  fill="none" stroke={T.df_frenkel} strokeWidth={idx === 0 ? 2 : 1}
                  opacity={1 - idx * 0.2} strokeDasharray={idx > 0 ? "4 3" : "none"} />
              );
            })}
            <text x={245} y={45} fontSize={9} fill={T.muted}>t=0</text>
            <text x={245} y={80} fontSize={9} fill={T.muted}>t=1</text>
            <text x={245} y={110} fontSize={9} fill={T.muted}>t=2</text>
            <text x={245} y={135} fontSize={9} fill={T.muted}>t=3</text>
          </svg>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${T.border}` }}>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>System</th>
            <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Mechanism</th>
            <th style={{ textAlign: "right", padding: 8, color: T.ink }}>E_A (eV)</th>
            <th style={{ textAlign: "right", padding: 8, color: T.ink }}>D₀ (cm²/s)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["C in Fe (\u03B1)", "Interstitial", "0.87", "0.02"],
            ["Cu in Cu", "Vacancy", "2.04", "0.20"],
            ["O in MgO", "Vacancy", "2.71", "4.3\u00D710\u207B\u00B2"],
            ["Ag in AgBr", "Frenkel", "0.35", "1.8\u00D710\u207B\u00B3"],
            ["Na in NaCl", "Schottky", "1.86", "1.5"],
          ].map(([sys, mech, ea, d0], i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: 8, color: T.ink, fontWeight: 600 }}>{sys}</td>
              <td style={{ padding: 8, color: T.muted }}>{mech}</td>
              <td style={{ padding: 8, color: T.df_primary, textAlign: "right", fontFamily: "monospace" }}>{ea}</td>
              <td style={{ padding: 8, color: T.df_frenkel, textAlign: "right", fontFamily: "monospace" }}>{d0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ── SECTIONS ARRAY ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "intro", label: "Why Defects Matter", icon: "\u2757", color: T.df_primary, Component: IntroSection },
  { id: "point", label: "Point Defects", icon: "\u26AB", color: T.df_vacancy, Component: PointDefectsSection },
  { id: "schottky", label: "Schottky & Frenkel", icon: "\uD83D\uDD73\uFE0F", color: T.df_schottky, Component: SchottkyFrenkelSection },
  { id: "kroger", label: "Kr\u00F6ger-Vink", icon: "\uD83D\uDCDD", color: T.df_primary, Component: KrogerVinkSection },
  { id: "chemistry", label: "Defect Chemistry", icon: "\u2697\uFE0F", color: T.df_schottky, Component: DefectChemistrySection },
  { id: "dislocations", label: "Dislocations", icon: "\uD83D\uDCCF", color: T.df_disloc, Component: DislocationsSection },
  { id: "planar", label: "Planar Defects", icon: "\uD83D\uDCC4", color: T.df_grain, Component: PlanarDefectsSection },
  { id: "diffusion", label: "Diffusion", icon: "\uD83D\uDD00", color: T.df_frenkel, Component: DiffusionSection },
];

// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function DefectsSolidsModule() {
  const [sec, setSec] = useState(0);
  const current = SECTIONS[sec];

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", padding: 32,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: 1 }}>
          Defects in Solids
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
          Point defects, dislocations & Kröger-Vink notation
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: "flex", gap: 4, overflowX: "auto", marginBottom: 20,
        padding: "4px 0", borderBottom: `2px solid ${T.border}`,
      }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setSec(i)} style={{
            padding: "8px 14px", borderRadius: "8px 8px 0 0",
            border: `1px solid ${i === sec ? s.color : "transparent"}`,
            borderBottom: i === sec ? `3px solid ${s.color}` : "3px solid transparent",
            background: i === sec ? s.color + "11" : "transparent",
            color: i === sec ? s.color : T.muted,
            cursor: "pointer", fontSize: 12, fontWeight: i === sec ? 700 : 500,
            whiteSpace: "nowrap", transition: "all 0.2s",
          }}>
            <span style={{ marginRight: 4 }}>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Pipeline flow */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, marginBottom: 20,
        overflowX: "auto", padding: "4px 0",
      }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <div onClick={() => setSec(i)} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i <= sec ? s.color : T.surface,
              border: `2px solid ${i <= sec ? s.color : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 12, color: i <= sec ? "#fff" : T.muted,
              fontWeight: 700, transition: "all 0.3s",
            }}>{i + 1}</div>
            {i < SECTIONS.length - 1 && (
              <div style={{
                width: 20, height: 2,
                background: i < sec ? SECTIONS[i + 1].color : T.border,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{
        background: T.panel, borderRadius: 16, padding: 28,
        border: `1px solid ${T.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>
        <current.Component />
      </div>

      {/* Bottom navigation */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 20, padding: "0 8px",
      }}>
        <button onClick={() => setSec(Math.max(0, sec - 1))} disabled={sec === 0} style={{
          padding: "8px 20px", borderRadius: 8,
          border: `1px solid ${sec === 0 ? T.dim : current.color}`,
          background: sec === 0 ? T.surface : current.color + "11",
          color: sec === 0 ? T.dim : current.color,
          cursor: sec === 0 ? "default" : "pointer", fontWeight: 600, fontSize: 13,
        }}>← Previous</button>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 6 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} onClick={() => setSec(i)} style={{
              width: i === sec ? 18 : 8, height: 8, borderRadius: 4,
              background: i === sec ? s.color : i < sec ? s.color + "55" : T.dim,
              cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>

        <button onClick={() => setSec(Math.min(SECTIONS.length - 1, sec + 1))} disabled={sec === SECTIONS.length - 1} style={{
          padding: "8px 20px", borderRadius: 8,
          border: `1px solid ${sec === SECTIONS.length - 1 ? T.dim : current.color}`,
          background: sec === SECTIONS.length - 1 ? T.surface : current.color + "11",
          color: sec === SECTIONS.length - 1 ? T.dim : current.color,
          cursor: sec === SECTIONS.length - 1 ? "default" : "pointer", fontWeight: 600, fontSize: 13,
        }}>Next →</button>
      </div>
    </div>
  );
}
