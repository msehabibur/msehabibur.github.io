import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE PYROCHLORE SCATTER PLOT
// X: Coefficient of Thermal Expansion (CTE)  [×10⁻⁶ K⁻¹]
// Y: Thermal Conductivity  [W/m·K]
// Color: Synthesis Probability (0–1) — LLM-predicted from literature stability
// ═══════════════════════════════════════════════════════════════════════════

const PYROCHLORE_DATA = [
  // Well-known stable (high synthesis prob)
  { label: "La₂Zr₂O₇",   cte: 9.1,  tc: 1.56, sp: 0.97 },
  { label: "La₂Hf₂O₇",   cte: 8.8,  tc: 1.42, sp: 0.95 },
  { label: "Gd₂Zr₂O₇",   cte: 10.4, tc: 1.60, sp: 0.98 },
  { label: "Gd₂Hf₂O₇",   cte: 10.1, tc: 1.48, sp: 0.93 },
  { label: "Nd₂Zr₂O₇",   cte: 9.6,  tc: 1.50, sp: 0.96 },
  { label: "Sm₂Zr₂O₇",   cte: 10.0, tc: 1.55, sp: 0.94 },
  { label: "Eu₂Zr₂O₇",   cte: 10.2, tc: 1.52, sp: 0.92 },
  { label: "Gd₂Ti₂O₇",   cte: 9.3,  tc: 3.40, sp: 0.96 },
  { label: "Y₂Ti₂O₇",    cte: 8.5,  tc: 3.20, sp: 0.94 },
  { label: "La₂Ti₂O₇",   cte: 8.0,  tc: 3.10, sp: 0.91 },
  { label: "Nd₂Ti₂O₇",   cte: 8.7,  tc: 3.30, sp: 0.90 },

  // Moderately stable
  { label: "Dy₂Zr₂O₇",   cte: 10.8, tc: 1.70, sp: 0.78 },
  { label: "Ho₂Zr₂O₇",   cte: 11.0, tc: 1.75, sp: 0.75 },
  { label: "Er₂Zr₂O₇",   cte: 11.2, tc: 1.80, sp: 0.72 },
  { label: "Yb₂Ti₂O₇",   cte: 7.8,  tc: 2.90, sp: 0.70 },
  { label: "Sm₂Ti₂O₇",   cte: 8.9,  tc: 3.05, sp: 0.73 },
  { label: "La₂Sn₂O₇",   cte: 7.5,  tc: 2.60, sp: 0.68 },
  { label: "Nd₂Hf₂O₇",   cte: 9.3,  tc: 1.38, sp: 0.80 },
  { label: "Sm₂Hf₂O₇",   cte: 9.8,  tc: 1.45, sp: 0.76 },
  { label: "Eu₂Hf₂O₇",   cte: 9.9,  tc: 1.40, sp: 0.74 },

  // Novel / less explored
  { label: "Lu₂Zr₂O₇",   cte: 11.5, tc: 1.85, sp: 0.45 },
  { label: "Tb₂Zr₂O₇",   cte: 10.6, tc: 1.65, sp: 0.55 },
  { label: "Pr₂Zr₂O₇",   cte: 9.4,  tc: 1.48, sp: 0.60 },
  { label: "Ce₂Zr₂O₇",   cte: 9.0,  tc: 1.44, sp: 0.38 },
  { label: "La₂Ce₂O₇",   cte: 8.3,  tc: 2.10, sp: 0.32 },
  { label: "Y₂Sn₂O₇",    cte: 7.2,  tc: 2.40, sp: 0.50 },
  { label: "Gd₂Sn₂O₇",   cte: 7.8,  tc: 2.50, sp: 0.52 },
  { label: "Nd₂Sn₂O₇",   cte: 7.6,  tc: 2.55, sp: 0.48 },

  // Hypothetical / predicted unstable
  { label: "Sc₂Zr₂O₇",   cte: 12.0, tc: 2.00, sp: 0.15 },
  { label: "La₂Pb₂O₇",   cte: 6.5,  tc: 1.90, sp: 0.10 },
  { label: "Ce₂Ti₂O₇",   cte: 8.2,  tc: 2.80, sp: 0.22 },
  { label: "Pr₂Hf₂O₇",   cte: 9.1,  tc: 1.35, sp: 0.28 },
  { label: "Tm₂Zr₂O₇",   cte: 11.3, tc: 1.82, sp: 0.20 },
  { label: "La₂V₂O₇",    cte: 7.0,  tc: 2.20, sp: 0.08 },
  { label: "Gd₂Ge₂O₇",   cte: 6.8,  tc: 2.30, sp: 0.12 },
  { label: "Y₂Hf₂O₇",    cte: 10.5, tc: 1.58, sp: 0.42 },
  { label: "Dy₂Ti₂O₇",   cte: 8.4,  tc: 3.00, sp: 0.65 },
  { label: "Ho₂Ti₂O₇",   cte: 8.1,  tc: 2.95, sp: 0.58 },
  { label: "Er₂Ti₂O₇",   cte: 7.9,  tc: 2.85, sp: 0.53 },
  { label: "Lu₂Ti₂O₇",   cte: 7.5,  tc: 2.70, sp: 0.18 },
];

// Color: deep blue (0) → teal (0.25) → gold (0.5) → orange (0.75) → deep red (1)
function spColor(prob) {
  const stops = [
    [0.0, [44, 62, 160]],
    [0.25, [30, 140, 160]],
    [0.5, [230, 190, 40]],
    [0.75, [230, 120, 30]],
    [1.0, [200, 30, 30]],
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (prob >= stops[i][0] && prob <= stops[i + 1][0]) {
      lo = stops[i]; hi = stops[i + 1]; break;
    }
  }
  const t = hi[0] === lo[0] ? 0 : (prob - lo[0]) / (hi[0] - lo[0]);
  const r = Math.round(lo[1][0] + t * (hi[1][0] - lo[1][0]));
  const g = Math.round(lo[1][1] + t * (hi[1][1] - lo[1][1]));
  const b = Math.round(lo[1][2] + t * (hi[1][2] - lo[1][2]));
  return `rgb(${r},${g},${b})`;
}

function spBadge(prob) {
  if (prob >= 0.85) return { text: "High", bg: "#dcfce7", color: "#166534" };
  if (prob >= 0.6) return { text: "Medium", bg: "#fef9c3", color: "#854d0e" };
  if (prob >= 0.3) return { text: "Low", bg: "#ffedd5", color: "#9a3412" };
  return { text: "Very Low", bg: "#fee2e2", color: "#991b1b" };
}

export default function PyrochloreScatter() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterRange, setFilterRange] = useState([0, 1]); // synthesis prob filter

  const W = 720, H = 500;
  const pad = { top: 50, right: 90, bottom: 60, left: 70 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const xMin = 6, xMax = 13;
  const yMin = 1.0, yMax = 3.8;

  const toX = v => pad.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const toY = v => pad.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [];
  for (let v = 6; v <= 13; v += 1) xTicks.push(v);
  const yTicks = [];
  for (let v = 1.0; v <= 3.8; v += 0.4) yTicks.push(Math.round(v * 10) / 10);

  const barX = W - pad.right + 20;
  const barY = pad.top + 10;
  const barW = 16;
  const barH = plotH - 20;
  const barStops = useMemo(() => {
    const stops = [];
    for (let i = 0; i <= 30; i++) {
      const p = i / 30;
      stops.push({ offset: `${(1 - p) * 100}%`, color: spColor(p) });
    }
    return stops;
  }, []);

  const filtered = PYROCHLORE_DATA.filter(d => d.sp >= filterRange[0] && d.sp <= filterRange[1]);

  const active = selected !== null ? PYROCHLORE_DATA[selected] : (hovered !== null ? PYROCHLORE_DATA[hovered] : null);
  const activeIdx = selected !== null ? selected : hovered;

  return (
    <div style={{
      background: "#f8f9fc",
      borderRadius: 14,
      padding: "16px 20px",
      maxWidth: 1100,
      margin: "0 auto",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <h2 style={{ color: "#1a1e2e", fontSize: 18, fontWeight: 800, margin: 0 }}>
          LLM-Predicted Properties of A₂B₂O₇ Pyrochlore Compositions
        </h2>
        <p style={{ color: "#6b7280", fontSize: 12, margin: "3px 0 0" }}>
          Hover over points to inspect — click to pin selection — filter by synthesis probability below
        </p>
      </div>

      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, marginBottom: 10, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Filter Synthesis Prob:</span>
        {[[0, 1, "All"], [0.8, 1, "≥ 0.8 (Stable)"], [0.5, 0.8, "0.5–0.8"], [0, 0.5, "< 0.5 (Novel)"]].map(([lo, hi, label]) => {
          const isActive = filterRange[0] === lo && filterRange[1] === hi;
          return (
            <button key={label} onClick={() => { setFilterRange([lo, hi]); setSelected(null); }}
              style={{
                padding: "4px 14px", borderRadius: 6, fontSize: 12, fontWeight: isActive ? 700 : 500,
                background: isActive ? "#1a1e2e" : "#fff",
                color: isActive ? "#fff" : "#6b7280",
                border: `1.5px solid ${isActive ? "#1a1e2e" : "#d4d8e0"}`,
                cursor: "pointer", transition: "all 0.15s",
              }}>
              {label}
            </button>
          );
        })}
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Showing {filtered.length} / {PYROCHLORE_DATA.length}
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* SVG Plot */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{
          flex: "1 1 auto", minWidth: 0,
          background: "#fff", borderRadius: 10, border: "1px solid #d4d8e0",
        }}>
          {/* Grid */}
          {xTicks.map(v => (
            <line key={`xg${v}`} x1={toX(v)} y1={pad.top} x2={toX(v)} y2={pad.top + plotH}
              stroke="#f0f1f4" strokeWidth={0.8} />
          ))}
          {yTicks.map(v => (
            <line key={`yg${v}`} x1={pad.left} y1={toY(v)} x2={pad.left + plotW} y2={toY(v)}
              stroke="#f0f1f4" strokeWidth={0.8} />
          ))}

          {/* Axes */}
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH}
            stroke="#1a1e2e" strokeWidth={1.5} />
          <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH}
            stroke="#1a1e2e" strokeWidth={1.5} />

          {/* X ticks */}
          {xTicks.map(v => (
            <g key={`xt${v}`}>
              <line x1={toX(v)} y1={pad.top + plotH} x2={toX(v)} y2={pad.top + plotH + 5}
                stroke="#1a1e2e" strokeWidth={1} />
              <text x={toX(v)} y={pad.top + plotH + 18} textAnchor="middle"
                fill="#1a1e2e" fontSize={11} fontFamily="monospace">{v}</text>
            </g>
          ))}
          <text x={pad.left + plotW / 2} y={H - 8} textAnchor="middle"
            fill="#1a1e2e" fontSize={13} fontWeight={700}>
            Coefficient of Thermal Expansion (×10⁻⁶ K⁻¹)
          </text>

          {/* Y ticks */}
          {yTicks.map(v => (
            <g key={`yt${v}`}>
              <line x1={pad.left - 5} y1={toY(v)} x2={pad.left} y2={toY(v)}
                stroke="#1a1e2e" strokeWidth={1} />
              <text x={pad.left - 10} y={toY(v) + 4} textAnchor="end"
                fill="#1a1e2e" fontSize={11} fontFamily="monospace">{v.toFixed(1)}</text>
            </g>
          ))}
          <text x={16} y={pad.top + plotH / 2} textAnchor="middle"
            fill="#1a1e2e" fontSize={13} fontWeight={700}
            transform={`rotate(-90, 16, ${pad.top + plotH / 2})`}>
            Thermal Conductivity (W/m·K)
          </text>

          {/* TBC region annotation */}
          <rect x={toX(9.0)} y={toY(2.0)}
            width={toX(12.5) - toX(9.0)} height={toY(1.2) - toY(2.0)}
            rx={6} fill="#7c3aed08" stroke="#7c3aed" strokeWidth={1.2} strokeDasharray="5,3" opacity={0.6} />
          <text x={(toX(9.0) + toX(12.5)) / 2} y={toY(2.0) - 5} textAnchor="middle"
            fill="#7c3aed" fontSize={9} fontWeight={600} opacity={0.7}>
            TBC design space (low κ, high CTE)
          </text>

          {/* Data points — filtered out ones shown as faded */}
          {PYROCHLORE_DATA.map((d, i) => {
            const cx = toX(d.cte);
            const cy = toY(d.tc);
            const inFilter = d.sp >= filterRange[0] && d.sp <= filterRange[1];
            const isHov = hovered === i;
            const isSel = selected === i;
            const dimmed = (selected !== null && !isSel) || !inFilter;

            return (
              <g key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === i ? null : i)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow ring */}
                {(isHov || isSel) && inFilter && (
                  <circle cx={cx} cy={cy} r={isSel ? 16 : 13}
                    fill="none" stroke={spColor(d.sp)} strokeWidth={2}
                    opacity={0.4} strokeDasharray={isSel ? "none" : "3,2"} />
                )}
                <circle
                  cx={cx} cy={cy}
                  r={isSel ? 8 : (isHov ? 7 : 5.5)}
                  fill={spColor(d.sp)}
                  stroke={isSel ? "#1a1e2e" : "#fff"}
                  strokeWidth={isSel ? 2 : 1.2}
                  opacity={dimmed ? 0.15 : 0.92}
                />
                {/* Show label on selected */}
                {isSel && inFilter && (
                  <text x={cx} y={cy - 14} textAnchor="middle"
                    fill="#1a1e2e" fontSize={10} fontWeight={700}
                    style={{ pointerEvents: "none" }}>
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover tooltip (only if not selected) */}
          {hovered !== null && selected === null && (() => {
            const d = PYROCHLORE_DATA[hovered];
            if (d.sp < filterRange[0] || d.sp > filterRange[1]) return null;
            const tx = toX(d.cte);
            const ty = toY(d.tc);
            const tipW = 195, tipH = 68;
            const flipX = tx + tipW + 16 > W;
            const flipY = ty - tipH - 10 < pad.top;
            const rx = flipX ? tx - tipW - 10 : tx + 12;
            const ry = flipY ? ty + 12 : ty - tipH - 4;
            return (
              <g style={{ pointerEvents: "none" }}>
                <rect x={rx} y={ry} width={tipW} height={tipH} rx={8}
                  fill="#1a1e2e" opacity={0.93} />
                <text x={rx + 10} y={ry + 18} fill="#fff" fontSize={13} fontWeight={700}>
                  {d.label}
                </text>
                <text x={rx + 10} y={ry + 35} fill="#c0c6d0" fontSize={10.5}>
                  CTE: {d.cte.toFixed(1)} ×10⁻⁶ K⁻¹   κ: {d.tc.toFixed(2)} W/m·K
                </text>
                <text x={rx + 10} y={ry + 52} fill={spColor(d.sp)} fontSize={11} fontWeight={700}>
                  Synth. Prob: {d.sp.toFixed(2)}
                </text>
              </g>
            );
          })()}

          {/* Color bar */}
          <defs>
            <linearGradient id="spGrad" x1="0" y1="1" x2="0" y2="0">
              {barStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          <rect x={barX} y={barY} width={barW} height={barH} rx={3}
            fill="url(#spGrad)" stroke="#d4d8e0" strokeWidth={1} />
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(v => {
            const cy = barY + barH * (1 - v);
            return (
              <g key={`cb${v}`}>
                <line x1={barX + barW} y1={cy} x2={barX + barW + 3} y2={cy}
                  stroke="#1a1e2e" strokeWidth={0.7} />
                <text x={barX + barW + 6} y={cy + 3.5} fill="#1a1e2e" fontSize={9.5}
                  fontFamily="monospace">{v.toFixed(1)}</text>
              </g>
            );
          })}
          <text x={barX + barW / 2} y={barY - 18} textAnchor="middle"
            fill="#1a1e2e" fontSize={9.5} fontWeight={700}>Synthesis</text>
          <text x={barX + barW / 2} y={barY - 7} textAnchor="middle"
            fill="#1a1e2e" fontSize={9.5} fontWeight={700}>Prob.</text>
        </svg>

        {/* Side detail panel */}
        <div style={{
          width: 280, minWidth: 280, flexShrink: 0,
          background: "#fff", borderRadius: 10, border: "1px solid #d4d8e0",
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #e8eaef",
            background: active ? spColor(active.sp) + "12" : "#f8f9fc",
          }}>
            {active ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1e2e" }}>{active.label}</div>
                <div style={{
                  display: "inline-block", marginTop: 4,
                  padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: spBadge(active.sp).bg, color: spBadge(active.sp).color,
                }}>
                  {spBadge(active.sp).text} Synthesis Prob.
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
                Hover or click a point to inspect
              </div>
            )}
          </div>

          {/* Properties */}
          {active ? (
            <div style={{ padding: "12px 16px", flex: 1 }}>
              {/* Property cards */}
              {[
                { label: "Thermal Conductivity", val: `${active.tc.toFixed(2)} W/m·K`, sub: "κ (LLM-predicted)", color: "#0284c7" },
                { label: "Coeff. Thermal Expansion", val: `${active.cte.toFixed(1)} ×10⁻⁶ K⁻¹`, sub: "CTE (LLM-predicted)", color: "#d97706" },
                { label: "Synthesis Probability", val: active.sp.toFixed(2), sub: active.sp >= 0.85 ? "Literature-confirmed stable" : active.sp >= 0.5 ? "Partially explored" : "Novel / hypothetical", color: spColor(active.sp) },
              ].map((p, i) => (
                <div key={i} style={{
                  padding: "10px 12px", marginBottom: 8,
                  background: "#f8f9fc", borderRadius: 8,
                  borderLeft: `3px solid ${p.color}`,
                }}>
                  <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1e2e", fontFamily: "'Fira Code', monospace", margin: "2px 0" }}>
                    {p.val}
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.sub}</div>
                </div>
              ))}

              {/* TBC suitability indicator */}
              {active.tc <= 2.0 && active.cte >= 9.0 && (
                <div style={{
                  padding: "8px 12px", borderRadius: 8,
                  background: "#f3e8ff", border: "1px solid #c084fc",
                  fontSize: 11, color: "#6b21a8", fontWeight: 600,
                }}>
                  ✓ In TBC design space (low κ + high CTE)
                </div>
              )}

              {selected !== null && (
                <button onClick={() => setSelected(null)} style={{
                  marginTop: 10, width: "100%", padding: "6px 0",
                  background: "#f0f2f5", border: "1.5px solid #d4d8e0",
                  borderRadius: 6, fontSize: 12, color: "#6b7280",
                  cursor: "pointer", fontWeight: 600,
                }}>
                  × Deselect
                </button>
              )}
            </div>
          ) : (
            <div style={{ padding: "16px", flex: 1 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7 }}>
                <strong style={{ color: "#1a1e2e" }}>Method</strong><br />
                All values predicted by LLM.<br /><br />
                <strong style={{ color: "#1a1e2e" }}>Synthesis Probability</strong><br />
                Calibrated from literature: confirmed-stable pyrochlores → prob ≈ 1.0<br /><br />
                <strong style={{ color: "#1a1e2e" }}>TBC Design Space</strong><br />
                Low thermal conductivity + high CTE is ideal for thermal barrier coatings.
              </div>
            </div>
          )}

          {/* Mini table at bottom */}
          <div style={{
            borderTop: "1px solid #e8eaef", maxHeight: 180, overflowY: "auto",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f8f9fc", position: "sticky", top: 0 }}>
                  <th style={{ padding: "5px 8px", textAlign: "left", color: "#6b7280", fontWeight: 700 }}>Comp.</th>
                  <th style={{ padding: "5px 6px", textAlign: "right", color: "#6b7280", fontWeight: 700 }}>CTE</th>
                  <th style={{ padding: "5px 6px", textAlign: "right", color: "#6b7280", fontWeight: 700 }}>κ</th>
                  <th style={{ padding: "5px 6px", textAlign: "right", color: "#6b7280", fontWeight: 700 }}>SP</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice()
                  .sort((a, b) => b.sp - a.sp)
                  .map((d, i) => {
                    const idx = PYROCHLORE_DATA.indexOf(d);
                    const isAct = activeIdx === idx;
                    return (
                      <tr key={i}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setSelected(selected === idx ? null : idx)}
                        style={{
                          background: isAct ? spColor(d.sp) + "18" : (i % 2 === 0 ? "#fff" : "#fafbfd"),
                          cursor: "pointer",
                          fontWeight: isAct ? 700 : 400,
                          transition: "background 0.1s",
                        }}
                      >
                        <td style={{ padding: "4px 8px", color: "#1a1e2e" }}>{d.label}</td>
                        <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: "monospace" }}>{d.cte.toFixed(1)}</td>
                        <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: "monospace" }}>{d.tc.toFixed(2)}</td>
                        <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: "monospace", color: spColor(d.sp), fontWeight: 700 }}>{d.sp.toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
