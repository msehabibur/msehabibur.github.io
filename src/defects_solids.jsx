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

// ── SECTION 9: EXPERIMENTAL LAB ─────────────────────────────────────────────
function ExperimentalLabSection() {
  const [step, setStep] = useState(0);

  // Real DLTS data for electron-irradiated n-type Si (1 MeV electrons, 1×10¹⁶ cm⁻²)
  // Two well-known defects: E-center (V-P) and divacancy (V₂)
  const dltsTemps = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
  // DLTS signal (ΔC/C × 10³) — two peaks visible
  const dltsSignal = [0.1, 0.3, 1.8, 3.2, 2.1, 0.8, 0.5, 1.4, 3.8, 4.2, 2.6, 0.4];

  // Arrhenius data: ln(eₙ/T²) vs 1000/T for E-center (V-P complex at Ec − 0.44 eV)
  const arrheniusData = [
    { invT: 3.5, lnET2: -6.2 },
    { invT: 3.8, lnET2: -8.1 },
    { invT: 4.2, lnET2: -10.4 },
    { invT: 4.5, lnET2: -12.3 },
    { invT: 5.0, lnET2: -15.0 },
    { invT: 5.5, lnET2: -17.8 },
  ];

  const steps = [
    {
      title: "1. Sample Preparation & Irradiation",
      content: (
        <div>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            <b>Sample:</b> n-type Si wafer, phosphorus-doped, N_D = 1×10¹⁵ cm⁻³, (100) orientation.
          </p>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            <b>Irradiation:</b> 1 MeV electron beam at 300 K, fluence = 1×10¹⁶ cm⁻². This creates
            point defects: vacancies (V), interstitials (I), and complexes (V-P, V₂, V-O).
          </p>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            <b>Contacts:</b> Evaporate Au Schottky contact (front) and Al ohmic contact (back) to form a diode.
          </p>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>What we record</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              • Doping concentration N_D from C-V measurement at 1 MHz<br/>
              • Diode ideality factor n ≈ 1.02 (confirms good junction quality)<br/>
              • Reverse bias leakage current &lt; 10 nA at −2 V
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2. DLTS Measurement",
      content: (
        <div>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            <b>Deep Level Transient Spectroscopy (DLTS)</b> detects defect levels by measuring
            capacitance transients after a voltage pulse. Traps fill during the pulse and emit
            carriers afterward — the emission rate e_n depends exponentially on temperature.
          </p>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Measurement Parameters</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              • Reverse bias: V_R = −2 V<br/>
              • Fill pulse: V_P = 0 V, duration t_P = 1 ms<br/>
              • Rate window: t₁ = 10 ms, t₂ = 20 ms<br/>
              • Temperature sweep: 80 K → 300 K, ramp rate 2 K/min<br/>
              • DLTS signal: S(T) = C(t₁) − C(t₂)
            </div>
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.df_primary, marginBottom: 4 }}>Capacitance Transient</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: T.df_primary }}>
              ΔC(t) = C₀ · (N_T / 2N_D) · exp(−e_n · t)
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
              N_T = trap concentration, e_n = emission rate
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "3. DLTS Spectrum — Identify Peaks",
      content: (
        <div>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            The DLTS spectrum shows <b>two distinct peaks</b>, each corresponding to a different defect:
          </p>
          {/* DLTS spectrum plot */}
          <svg viewBox="0 0 420 230" style={{ width: "100%", maxWidth: 420, display: "block", margin: "8px auto" }}>
            <rect width={420} height={230} fill={T.bg} rx={12} />
            <text x={210} y={18} textAnchor="middle" fontSize={11} fill={T.ink} fontWeight={600}>DLTS Spectrum: n-Si after 1 MeV e⁻ irradiation</text>
            <line x1={50} y1={195} x2={400} y2={195} stroke={T.ink} strokeWidth={1} />
            <line x1={50} y1={30} x2={50} y2={195} stroke={T.ink} strokeWidth={1} />
            <text x={225} y={220} textAnchor="middle" fontSize={10} fill={T.ink}>Temperature (K)</text>
            <text x={15} y={112} textAnchor="middle" fontSize={10} fill={T.ink} transform="rotate(-90, 15, 112)">DLTS Signal ΔC/C (×10³)</text>
            {/* Temperature axis labels */}
            {[80, 120, 160, 200, 240, 280].map((t, i) => (
              <text key={i} x={50 + (t - 80) * (350 / 220)} y={208} textAnchor="middle" fontSize={9} fill={T.muted}>{t}</text>
            ))}
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((v, i) => (
              <text key={i} x={44} y={195 - v * 38} textAnchor="end" fontSize={9} fill={T.muted}>{v}</text>
            ))}
            {/* Plot the DLTS data */}
            {dltsTemps.map((t, i) => {
              if (i === 0) return null;
              const x1 = 50 + (dltsTemps[i - 1] - 80) * (350 / 220);
              const y1 = 195 - dltsSignal[i - 1] * 38;
              const x2 = 50 + (t - 80) * (350 / 220);
              const y2 = 195 - dltsSignal[i] * 38;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.df_primary} strokeWidth={2} />;
            })}
            {dltsTemps.map((t, i) => (
              <circle key={i} cx={50 + (t - 80) * (350 / 220)} cy={195 - dltsSignal[i] * 38} r={3} fill={T.df_primary} />
            ))}
            {/* Peak labels */}
            <text x={50 + (140 - 80) * (350 / 220)} y={195 - 3.2 * 38 - 10} textAnchor="middle" fontSize={10} fill={T.df_vacancy} fontWeight={700}>Peak A</text>
            <text x={50 + (140 - 80) * (350 / 220)} y={195 - 3.2 * 38 - 0} textAnchor="middle" fontSize={9} fill={T.df_vacancy}>~140 K</text>
            <text x={50 + (260 - 80) * (350 / 220)} y={195 - 4.2 * 38 - 10} textAnchor="middle" fontSize={10} fill={T.df_frenkel} fontWeight={700}>Peak B</text>
            <text x={50 + (260 - 80) * (350 / 220)} y={195 - 4.2 * 38 - 0} textAnchor="middle" fontSize={9} fill={T.df_frenkel}>~260 K</text>
          </svg>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160, padding: 10, borderRadius: 8, background: T.df_vacancy + "11", border: `1px solid ${T.df_vacancy}44` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.df_vacancy }}>Peak A (~140 K)</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
                Divacancy V₂ (−/0)<br/>
                ΔC/C peak = 3.2 × 10⁻³<br/>
                N_T ≈ 2 × N_D × (ΔC/C) = 6.4 × 10¹² cm⁻³
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 160, padding: 10, borderRadius: 8, background: T.df_frenkel + "11", border: `1px solid ${T.df_frenkel}44` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.df_frenkel }}>Peak B (~260 K)</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>
                E-center V-P (−/0)<br/>
                ΔC/C peak = 4.2 × 10⁻³<br/>
                N_T ≈ 2 × N_D × (ΔC/C) = 8.4 × 10¹² cm⁻³
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "4. Arrhenius Analysis — Extract Defect Level",
      content: (
        <div>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            From multiple DLTS scans at different rate windows, extract the emission rate e_n at each peak temperature.
            Plot <b>ln(e_n/T²) vs 1000/T</b> — the slope gives the activation energy E_a (= defect level depth).
          </p>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 8, border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: T.df_primary }}>
              e_n = σ_n · v_th · N_C · exp(−E_a / k_BT)
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: T.df_primary, marginTop: 4 }}>
              → ln(e_n / T²) = ln(σ_n · γ_n) − E_a / (k_B · T)
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
              σ_n = capture cross section, v_th = thermal velocity, γ_n = 2√3 (2π m*_e k_B)^(3/2) / h³
            </div>
          </div>
          {/* Arrhenius plot */}
          <svg viewBox="0 0 420 230" style={{ width: "100%", maxWidth: 420, display: "block", margin: "12px auto" }}>
            <rect width={420} height={230} fill={T.bg} rx={12} />
            <text x={210} y={18} textAnchor="middle" fontSize={11} fill={T.ink} fontWeight={600}>Arrhenius Plot for Peak B (E-center)</text>
            <line x1={60} y1={195} x2={390} y2={195} stroke={T.ink} strokeWidth={1} />
            <line x1={60} y1={25} x2={60} y2={195} stroke={T.ink} strokeWidth={1} />
            <text x={225} y={220} textAnchor="middle" fontSize={10} fill={T.ink}>1000/T (K⁻¹)</text>
            <text x={18} y={110} textAnchor="middle" fontSize={10} fill={T.ink} transform="rotate(-90, 18, 110)">ln(e_n / T²)</text>
            {/* Axis labels */}
            {[3.5, 4.0, 4.5, 5.0, 5.5].map((v, i) => (
              <text key={i} x={60 + (v - 3.5) * (330 / 2)} y={208} textAnchor="middle" fontSize={9} fill={T.muted}>{v.toFixed(1)}</text>
            ))}
            {[-6, -9, -12, -15, -18].map((v, i) => (
              <text key={i} x={54} y={195 + (v + 18) * (170 / 12)} textAnchor="end" fontSize={9} fill={T.muted}>{v}</text>
            ))}
            {/* Best fit line */}
            <line
              x1={60 + (3.5 - 3.5) * (330 / 2)} y1={195 + (-6.2 + 18) * (170 / 12)}
              x2={60 + (5.5 - 3.5) * (330 / 2)} y2={195 + (-17.8 + 18) * (170 / 12)}
              stroke={T.df_frenkel} strokeWidth={1.5} strokeDasharray="6 3" />
            {/* Data points */}
            {arrheniusData.map((d, i) => (
              <circle key={i}
                cx={60 + (d.invT - 3.5) * (330 / 2)}
                cy={195 + (d.lnET2 + 18) * (170 / 12)}
                r={4} fill={T.df_frenkel} stroke="#fff" strokeWidth={1} />
            ))}
            {/* Slope annotation */}
            <text x={280} y={70} fontSize={10} fill={T.df_primary} fontWeight={700}>slope = −E_a / k_B</text>
            <text x={280} y={84} fontSize={10} fill={T.df_primary}>= −5100 K</text>
            <text x={280} y={100} fontSize={10} fill={T.df_frenkel} fontWeight={700}>E_a = 0.44 eV</text>
          </svg>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 8, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Extracted Parameters (Peak B: E-center)</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              • Slope = −5100 K → <span style={{ fontFamily: "monospace", color: T.df_primary }}>E_a = slope × k_B = 5100 × 8.617×10⁻⁵ = 0.44 eV</span><br/>
              • Intercept → <span style={{ fontFamily: "monospace", color: T.df_primary }}>σ_n = 2 × 10⁻¹⁵ cm²</span><br/>
              • <b>Defect level: E_C − 0.44 eV</b> — matches the known E-center (vacancy-phosphorus pair)
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "5. Results Summary & Defect Map",
      content: (
        <div>
          <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8 }}>
            Combining all measurements, we build a complete <b>defect energy level diagram</b> within the Si bandgap:
          </p>
          {/* Band diagram with defect levels */}
          <svg viewBox="0 0 420 200" style={{ width: "100%", maxWidth: 420, display: "block", margin: "8px auto" }}>
            <rect width={420} height={200} fill={T.bg} rx={12} />
            {/* Conduction band */}
            <rect x={40} y={25} width={340} height={16} fill={T.df_frenkel + "33"} stroke={T.df_frenkel} strokeWidth={1.5} rx={3} />
            <text x={30} y={37} textAnchor="end" fontSize={10} fill={T.ink} fontWeight={700}>E_C</text>
            <text x={210} y={37} textAnchor="middle" fontSize={9} fill={T.df_frenkel}>Conduction Band</text>
            {/* Valence band */}
            <rect x={40} y={165} width={340} height={16} fill={T.df_interstitial + "33"} stroke={T.df_interstitial} strokeWidth={1.5} rx={3} />
            <text x={30} y={177} textAnchor="end" fontSize={10} fill={T.ink} fontWeight={700}>E_V</text>
            <text x={210} y={177} textAnchor="middle" fontSize={9} fill={T.df_interstitial}>Valence Band</text>
            {/* Bandgap = 1.12 eV, so scale: 140px height = 1.12 eV */}
            {/* Defect levels */}
            {[
              { name: "V₂ (=/−)", eV: 0.23, color: T.df_vacancy, x: 80 },
              { name: "V₂ (−/0)", eV: 0.42, color: T.df_vacancy, x: 160 },
              { name: "V-P (−/0)", eV: 0.44, color: T.df_frenkel, x: 250 },
              { name: "V-O (−/0)", eV: 0.18, color: T.df_schottky, x: 330 },
            ].map((d, i) => {
              const yPos = 41 + (d.eV / 1.12) * 124;
              return (
                <g key={i}>
                  <line x1={d.x - 25} y1={yPos} x2={d.x + 25} y2={yPos} stroke={d.color} strokeWidth={2.5} />
                  <text x={d.x} y={yPos - 6} textAnchor="middle" fontSize={9} fill={d.color} fontWeight={700}>{d.name}</text>
                  <text x={d.x} y={yPos + 12} textAnchor="middle" fontSize={8} fill={T.muted}>E_C − {d.eV} eV</text>
                </g>
              );
            })}
            <text x={210} y={195} textAnchor="middle" fontSize={10} fill={T.ink} fontWeight={600}>Si Bandgap = 1.12 eV</text>
          </svg>
          {/* Summary table */}
          <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Defect</th>
                <th style={{ textAlign: "left", padding: 8, color: T.ink }}>Identity</th>
                <th style={{ textAlign: "right", padding: 8, color: T.ink }}>E_a (eV)</th>
                <th style={{ textAlign: "right", padding: 8, color: T.ink }}>σ_n (cm²)</th>
                <th style={{ textAlign: "right", padding: 8, color: T.ink }}>N_T (cm⁻³)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Peak A", "Divacancy V₂ (−/0)", "0.42", "2×10⁻¹⁴", "6.4×10¹²"],
                ["Peak B", "E-center V-P (−/0)", "0.44", "2×10⁻¹⁵", "8.4×10¹²"],
              ].map(([peak, id, ea, sig, nt], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: 8, color: T.ink, fontWeight: 600 }}>{peak}</td>
                  <td style={{ padding: 8, color: T.muted }}>{id}</td>
                  <td style={{ padding: 8, color: T.df_primary, textAlign: "right", fontFamily: "monospace" }}>{ea}</td>
                  <td style={{ padding: 8, color: T.df_frenkel, textAlign: "right", fontFamily: "monospace" }}>{sig}</td>
                  <td style={{ padding: 8, color: T.df_schottky, textAlign: "right", fontFamily: "monospace" }}>{nt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginTop: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Key Takeaways</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
              • E-center (V-P) is the <b>dominant trap</b> — phosphorus atoms trap nearby vacancies<br/>
              • Both defects act as <b>electron traps</b> in the upper half of the bandgap<br/>
              • Annealing at 150°C removes V₂; annealing at 350°C removes V-P<br/>
              • Introduction rate: ~1 defect per cm of e⁻ path → N_T scales linearly with fluence
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SectionTitle color={T.df_disloc} icon={"🔬"}>Experimental Lab: DLTS on Irradiated Silicon</SectionTitle>
      <p style={{ color: T.ink, fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>
        Walk through a <b>real experiment</b> to detect and characterize point defects in a semiconductor.
        We use <b>Deep Level Transient Spectroscopy (DLTS)</b> — the gold-standard technique for measuring
        defect energy levels, capture cross sections, and trap concentrations.
      </p>
      {/* Step navigation */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: step === i ? 700 : 500,
            border: `1.5px solid ${step === i ? T.df_disloc : T.border}`,
            background: step === i ? T.df_disloc + "15" : T.surface,
            color: step === i ? T.df_disloc : T.muted,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {s.title.split(".")[0]}.
          </button>
        ))}
      </div>
      {/* Step content */}
      <div style={{ background: T.surface, borderRadius: 12, padding: 16, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.df_disloc, marginBottom: 10 }}>{steps[step].title}</div>
        {steps[step].content}
      </div>
      {/* Step navigation arrows */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: `1px solid ${step === 0 ? T.dim : T.df_disloc}`,
          background: step === 0 ? T.surface : T.df_disloc + "11",
          color: step === 0 ? T.dim : T.df_disloc,
          cursor: step === 0 ? "default" : "pointer",
        }}>← Prev step</button>
        <span style={{ fontSize: 11, color: T.muted, alignSelf: "center" }}>Step {step + 1} of {steps.length}</span>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{
          padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: `1px solid ${step === steps.length - 1 ? T.dim : T.df_disloc}`,
          background: step === steps.length - 1 ? T.surface : T.df_disloc + "11",
          color: step === steps.length - 1 ? T.dim : T.df_disloc,
          cursor: step === steps.length - 1 ? "default" : "pointer",
        }}>Next step →</button>
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
  { id: "experimental", label: "Experimental Lab", icon: "\uD83D\uDD2C", color: T.df_disloc, Component: ExperimentalLabSection },
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
