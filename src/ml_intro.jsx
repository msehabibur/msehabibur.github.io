import React, { useState, useEffect, useMemo } from "react";

/* ─── Theme & Color Palette ─── */
const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#d4d8e0",
  ink: "#1a1e2e", muted: "#6b7280", dim: "#c0c6d0", gold: "#b8860b",
  eo_e: "#2563eb", eo_hole: "#ea580c", eo_photon: "#ca8a04",
  eo_valence: "#059669", eo_core: "#7c3aed", eo_gap: "#dc2626", eo_cond: "#0284c7",
};

const M = {
  found: "#0e7490",
  algo: "#7c3aed",
  nn: "#dc2626",
  mat: "#059669",
  prac: "#2563eb",
  accent: "#d97706",
};

/* ─── Reusable Components ─── */
function Card({ title, color, formula, children }) {
  return (
    <div style={{ background: T.panel, border: `1.5px solid ${(color || T.border)}44`, borderLeft: `4px solid ${color || "#2563eb"}`, borderRadius: 10, padding: "16px 18px" }}>
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

function SliderRow({ label, value, min, max, step, onChange, color, unit, format }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{format ? format(value) : value.toFixed(2)}{unit || ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: color }} />
    </div>
  );
}

function ResultBox({ label, value, color, sub }) {
  return (
    <div style={{ background: (color || T.eo_e) + "0a", border: `1px solid ${(color || T.eo_e)}22`, borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 9, color: T.muted, letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: color || T.eo_e, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 12 }}>
      <span style={{ color: T.muted, fontFamily: "monospace", flex: 1 }}>{eq}</span>
      <span style={{ color: T.dim }}>=</span>
      <span style={{ color: color || T.ink, fontWeight: 700, fontFamily: "monospace", minWidth: 70, textAlign: "right" }}>{result}</span>
    </div>
  );
}

/* ─── Utility Helpers ─── */
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function sigmoid(x) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); }
function relu(x) { return Math.max(0, x); }

/* ─── Block Definitions ─── */
const ML_BLOCKS = [
  { id: "foundations", label: "Foundations", color: M.found },
  { id: "algorithms", label: "Core Algorithms", color: M.algo },
  { id: "neuralnet", label: "Neural Networks", color: M.nn },
  { id: "matsci", label: "ML for Materials", color: M.mat },
  { id: "practical", label: "Practical Guide", color: M.prac },
];

/* ════════════════════════════════════════════════════════════════
   SECTION 1 — What Is Machine Learning
   ════════════════════════════════════════════════════════════════ */
function WhatIsMLSection() {
  const C = M.found;
  const [highlight, setHighlight] = useState(-1);

  const materials = [
    { name: "Si",   en: 1.90, radius: 1.17, label: "Semiconductor", color: "#2563eb" },
    { name: "Ge",   en: 2.01, radius: 1.22, label: "Semiconductor", color: "#2563eb" },
    { name: "GaAs", en: 2.18, radius: 1.26, label: "Semiconductor", color: "#2563eb" },
    { name: "Fe",   en: 1.83, radius: 1.24, label: "Metal", color: "#ea580c" },
    { name: "Cu",   en: 1.90, radius: 1.28, label: "Metal", color: "#ea580c" },
    { name: "Al",   en: 1.61, radius: 1.43, label: "Metal", color: "#ea580c" },
  ];

  const types = [
    { name: "Supervised", desc: "Learn from labeled examples to predict new data", example: "Predict bandgap from composition" },
    { name: "Unsupervised", desc: "Find hidden patterns without labels", example: "Group similar crystal structures" },
    { name: "Reinforcement", desc: "Learn by trial and reward", example: "Optimize synthesis conditions" },
  ];

  const scaleX = (en) => 30 + (en - 1.5) * 400;
  const scaleY = (r) => 180 - (r - 1.10) * 400;

  return (
    <Card color={C} title="What Is Machine Learning?" formula="f(features) → prediction">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Teaching a child to sort toys: show examples with labels like "this is a car, this is a block" (supervised),
          let them group by similarity on their own (unsupervised), or reward with a sticker for correct guesses (reinforcement).
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={340} height={200} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={170} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Materials Classification Dataset</text>
            {/* Axes */}
            <line x1={30} y1={180} x2={330} y2={180} stroke={T.border} strokeWidth={1} />
            <line x1={30} y1={20} x2={30} y2={180} stroke={T.border} strokeWidth={1} />
            <text x={180} y={196} textAnchor="middle" fontSize={9} fill={T.muted}>Electronegativity</text>
            <text x={10} y={100} textAnchor="middle" fontSize={9} fill={T.muted} transform="rotate(-90,10,100)">Atomic Radius (Å)</text>
            {/* Axis ticks */}
            {[1.6, 1.8, 2.0, 2.2].map(v => (
              <g key={v}>
                <line x1={scaleX(v)} y1={180} x2={scaleX(v)} y2={183} stroke={T.dim} />
                <text x={scaleX(v)} y={192} textAnchor="middle" fontSize={8} fill={T.dim}>{v.toFixed(1)}</text>
              </g>
            ))}
            {[1.15, 1.25, 1.35, 1.45].map(v => (
              <g key={v}>
                <line x1={27} y1={scaleY(v)} x2={30} y2={scaleY(v)} stroke={T.dim} />
                <text x={24} y={scaleY(v) + 3} textAnchor="end" fontSize={8} fill={T.dim}>{v.toFixed(2)}</text>
              </g>
            ))}
            {/* Data points */}
            {materials.map((m, i) => (
              <g key={i} onMouseEnter={() => setHighlight(i)} onMouseLeave={() => setHighlight(-1)} style={{ cursor: "pointer" }}>
                <circle cx={scaleX(m.en)} cy={scaleY(m.radius)} r={highlight === i ? 10 : 7}
                  fill={m.color + "33"} stroke={m.color} strokeWidth={1.5} />
                <text x={scaleX(m.en)} y={scaleY(m.radius) - 10} textAnchor="middle"
                  fontSize={9} fill={m.color} fontWeight={600}>{m.name}</text>
              </g>
            ))}
            {/* Legend */}
            <circle cx={250} cy={35} r={5} fill="#2563eb33" stroke="#2563eb" strokeWidth={1} />
            <text x={260} y={38} fontSize={9} fill={T.muted}>Semiconductor</text>
            <circle cx={250} cy={50} r={5} fill="#ea580c33" stroke="#ea580c" strokeWidth={1} />
            <text x={260} y={53} fontSize={9} fill={T.muted}>Metal</text>
          </svg>

          {/* Type comparison table */}
          <div style={{ marginTop: 10, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 6, letterSpacing: 2 }}>THREE TYPES OF ML</div>
            {types.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: C, minWidth: 95 }}>{t.name}</span>
                <span style={{ color: T.muted, flex: 1 }}>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>DATASET STATISTICS</div>
            <CalcRow eq="Total samples" result="6" color={C} />
            <CalcRow eq="Features per sample" result="2" color={C} />
            <CalcRow eq="Feature 1: Electronegativity range" result="1.61 – 2.18" color={C} />
            <CalcRow eq="Feature 2: Radius range (Å)" result="1.17 – 1.43" color={C} />
            <CalcRow eq="Class 0 (Semiconductor) count" result="3" color="#2563eb" />
            <CalcRow eq="Class 1 (Metal) count" result="3" color="#ea580c" />
            <CalcRow eq="Class balance ratio" result="1.00" color={C} />
          </div>

          <div style={{ marginTop: 10, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ML FINDS THE PATTERN</div>
            <CalcRow eq="Mean EN (Semiconductors)" result={((1.90 + 2.01 + 2.18) / 3).toFixed(2)} color="#2563eb" />
            <CalcRow eq="Mean EN (Metals)" result={((1.83 + 1.90 + 1.61) / 3).toFixed(2)} color="#ea580c" />
            <CalcRow eq="Mean Radius (Semiconductors)" result={((1.17 + 1.22 + 1.26) / 3).toFixed(2) + " Å"} color="#2563eb" />
            <CalcRow eq="Mean Radius (Metals)" result={((1.24 + 1.28 + 1.43) / 3).toFixed(2) + " Å"} color="#ea580c" />
            <CalcRow eq="Observation" result="Metals → larger radius" color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="SAMPLES" value="6" color={C} sub="materials" />
            <ResultBox label="FEATURES" value="2" color={C} sub="per sample" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Machine learning does not "know" physics.
            It finds statistical patterns in data — correlations between features (like electronegativity, radius) and
            properties (like metal vs semiconductor). The more relevant features and data you provide, the better it learns.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 2 — Linear Regression
   ════════════════════════════════════════════════════════════════ */
function LinearRegressionSection() {
  const C = M.found;
  const [m, setM] = useState(2.5);
  const [b, setB] = useState(1.0);

  const data = [
    { x: 1.17, y: 5.43, name: "Si" },
    { x: 1.22, y: 5.66, name: "Ge" },
    { x: 1.26, y: 5.65, name: "GaAs" },
    { x: 1.43, y: 4.05, name: "Al" },
    { x: 1.35, y: 5.16, name: "NaCl" },
  ];

  const predictions = data.map(d => ({ ...d, yhat: m * d.x + b }));
  const errors = predictions.map(p => p.y - p.yhat);
  const errSq = errors.map(e => e * e);
  const sse = errSq.reduce((a, v) => a + v, 0);
  const mse = sse / data.length;
  const rmse = Math.sqrt(mse);

  const bestM = useMemo(() => {
    const n = data.length;
    const sx = data.reduce((a, d) => a + d.x, 0);
    const sy = data.reduce((a, d) => a + d.y, 0);
    const sxy = data.reduce((a, d) => a + d.x * d.y, 0);
    const sx2 = data.reduce((a, d) => a + d.x * d.x, 0);
    return (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  }, []);
  const bestB = useMemo(() => {
    const n = data.length;
    const sx = data.reduce((a, d) => a + d.x, 0);
    const sy = data.reduce((a, d) => a + d.y, 0);
    const sx2 = data.reduce((a, d) => a + d.x * d.x, 0);
    const sxy = data.reduce((a, d) => a + d.x * d.y, 0);
    const mCalc = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
    return (sy - mCalc * sx) / n;
  }, []);

  const snapBest = () => { setM(Math.round(bestM * 100) / 100); setB(Math.round(bestB * 100) / 100); };

  const svgW = 340, svgH = 200;
  const xMin = 1.1, xMax = 1.5, yMin = 3.5, yMax = 6.5;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  return (
    <Card color={C} title="Linear Regression" formula="y = mx + b">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Drawing the best straight line through dots on a graph. The line should be as close as possible to all
          the data points. "Best" means the total squared distance from each point to the line is minimized.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Atomic Radius → Lattice Constant</text>
            {/* Axes */}
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={9} fill={T.muted}>Atomic Radius (Å)</text>
            <text x={8} y={svgH / 2 - 10} fontSize={9} fill={T.muted} transform={`rotate(-90,8,${svgH / 2 - 10})`}>Lattice Const (Å)</text>
            {/* Ticks */}
            {[1.15, 1.25, 1.35, 1.45].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={svgH - 30} x2={sx(v)} y2={svgH - 27} stroke={T.dim} />
                <text x={sx(v)} y={svgH - 18} textAnchor="middle" fontSize={8} fill={T.dim}>{v.toFixed(2)}</text>
              </g>
            ))}
            {[4.0, 4.5, 5.0, 5.5, 6.0].map(v => (
              <g key={v}>
                <line x1={37} y1={sy(v)} x2={40} y2={sy(v)} stroke={T.dim} />
                <text x={34} y={sy(v) + 3} textAnchor="end" fontSize={8} fill={T.dim}>{v.toFixed(1)}</text>
              </g>
            ))}
            {/* Regression line */}
            <line x1={sx(xMin)} y1={sy(m * xMin + b)} x2={sx(xMax)} y2={sy(m * xMax + b)}
              stroke={C} strokeWidth={2} strokeDasharray="6,3" />
            {/* Error lines */}
            {predictions.map((p, i) => (
              <line key={i} x1={sx(p.x)} y1={sy(p.y)} x2={sx(p.x)} y2={sy(p.yhat)}
                stroke="#dc262688" strokeWidth={1} strokeDasharray="2,2" />
            ))}
            {/* Data points */}
            {data.map((d, i) => (
              <g key={i}>
                <circle cx={sx(d.x)} cy={sy(d.y)} r={5} fill={C + "33"} stroke={C} strokeWidth={1.5} />
                <text x={sx(d.x) + 8} y={sy(d.y) - 4} fontSize={8} fill={C} fontWeight={600}>{d.name}</text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Slope (m)" value={m} min={-5} max={10} step={0.1} onChange={setM} color={C} />
          <SliderRow label="Intercept (b)" value={b} min={-5} max={10} step={0.1} onChange={setB} color={C} />
          <button onClick={snapBest}
            style={{ padding: "4px 12px", fontSize: 10, borderRadius: 6, cursor: "pointer",
              background: C, color: "#fff", border: "none", fontWeight: 700, marginBottom: 10 }}>
            Snap to Best Fit
          </button>

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            {predictions.map((p, i) => (
              <CalcRow key={i} eq={`ŷ${i + 1} = ${m.toFixed(1)} × ${p.x.toFixed(2)} + ${b.toFixed(1)}`}
                result={p.yhat.toFixed(2)} color={C} />
            ))}
            <div style={{ height: 6 }} />
            {predictions.map((p, i) => (
              <CalcRow key={i} eq={`error${i + 1} = ${p.y.toFixed(2)} − ${p.yhat.toFixed(2)}`}
                result={errors[i].toFixed(2)} color="#dc2626" />
            ))}
            <div style={{ height: 6 }} />
            <CalcRow eq={`SSE = Σ error²`} result={sse.toFixed(3)} color={C} />
            <CalcRow eq={`MSE = SSE / ${data.length}`} result={mse.toFixed(3)} color={C} />
            <CalcRow eq={`RMSE = √MSE`} result={rmse.toFixed(3)} color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="SSE" value={sse.toFixed(2)} color={C} />
            <ResultBox label="RMSE" value={rmse.toFixed(3)} color={C} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The "best fit" line minimizes the total squared error
            (SSE). Try the sliders — watch how error changes. Click "Snap to Best Fit" to see the optimal m and b values
            found by the ordinary least squares formula.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 3 — Overfitting
   ════════════════════════════════════════════════════════════════ */
function OverfittingSection() {
  const C = M.found;
  const [degree, setDegree] = useState(2);

  const rng = seededRandom(42);
  const trainPts = useMemo(() => {
    const r = seededRandom(42);
    return Array.from({ length: 8 }, (_, i) => {
      const x = 0.5 + i * 0.5;
      const y = x * x + (r() - 0.5) * 2;
      return { x, y };
    });
  }, []);

  const testPts = useMemo(() => {
    const r = seededRandom(123);
    return Array.from({ length: 4 }, (_, i) => {
      const x = 0.8 + i * 0.9;
      const y = x * x + (r() - 0.5) * 2;
      return { x, y };
    });
  }, []);

  const polyFit = useMemo(() => {
    const n = trainPts.length;
    const d = Math.min(degree, n - 1);
    const X = trainPts.map(p => Array.from({ length: d + 1 }, (_, j) => Math.pow(p.x, j)));
    const y = trainPts.map(p => p.y);
    const XT = X[0].map((_, i) => X.map(row => row[i]));
    const XTX = XT.map(row => X[0].map((_, j) => row.reduce((s, v, k) => s + v * X[k][j], 0)));
    const XTy = XT.map(row => row.reduce((s, v, k) => s + v * y[k], 0));
    const A = XTX.map((row, i) => [...row, XTy[i]]);
    const sz = A.length;
    for (let i = 0; i < sz; i++) {
      let maxR = i;
      for (let r = i + 1; r < sz; r++) if (Math.abs(A[r][i]) > Math.abs(A[maxR][i])) maxR = r;
      [A[i], A[maxR]] = [A[maxR], A[i]];
      if (Math.abs(A[i][i]) < 1e-12) continue;
      for (let r = 0; r < sz; r++) {
        if (r === i) continue;
        const f = A[r][i] / A[i][i];
        for (let c = i; c <= sz; c++) A[r][c] -= f * A[i][c];
      }
    }
    return A.map((row, i) => Math.abs(row[i]) < 1e-12 ? 0 : row[sz] / row[i]);
  }, [degree, trainPts]);

  const evalPoly = (x) => polyFit.reduce((s, c, i) => s + c * Math.pow(x, i), 0);

  const trainRMSE = Math.sqrt(trainPts.reduce((s, p) => s + Math.pow(p.y - evalPoly(p.x), 2), 0) / trainPts.length);
  const testRMSE = Math.sqrt(testPts.reduce((s, p) => s + Math.pow(p.y - evalPoly(p.x), 2), 0) / testPts.length);

  const svgW = 340, svgH = 200;
  const xMin = 0, xMax = 5, yMin = -2, yMax = 22;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  const curvePts = Array.from({ length: 80 }, (_, i) => {
    const x = xMin + i * (xMax - xMin) / 79;
    return { x, y: evalPoly(x) };
  });

  return (
    <Card color={C} title="Overfitting" formula="Train error ↓ ≠ Test error ↓">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A student who memorizes answers word-for-word passes practice exams but fails new ones.
          Overfitting is the same — the model "memorizes" training data instead of learning general patterns.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Polynomial Degree {degree} Fit</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            {/* True curve y=x² */}
            {Array.from({ length: 60 }, (_, i) => {
              const x1 = xMin + i * (xMax - xMin) / 59;
              const x2 = xMin + (i + 1) * (xMax - xMin) / 59;
              return <line key={`t${i}`} x1={sx(x1)} y1={sy(x1 * x1)} x2={sx(x2)} y2={sy(x2 * x2)} stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />;
            })}
            {/* Fitted curve */}
            {curvePts.slice(0, -1).map((p, i) => {
              const yc = Math.max(yMin, Math.min(yMax, p.y));
              const yn = Math.max(yMin, Math.min(yMax, curvePts[i + 1].y));
              return <line key={i} x1={sx(p.x)} y1={sy(yc)} x2={sx(curvePts[i + 1].x)} y2={sy(yn)} stroke={C} strokeWidth={2} />;
            })}
            {/* Train points */}
            {trainPts.map((p, i) => (
              <circle key={`tr${i}`} cx={sx(p.x)} cy={sy(p.y)} r={5} fill={C + "44"} stroke={C} strokeWidth={1.5} />
            ))}
            {/* Test points */}
            {testPts.map((p, i) => (
              <circle key={`te${i}`} cx={sx(p.x)} cy={sy(p.y)} r={5} fill="#dc262644" stroke="#dc2626" strokeWidth={1.5} />
            ))}
            <circle cx={250} cy={svgH - 15} r={4} fill={C + "44"} stroke={C} />
            <text x={258} y={svgH - 12} fontSize={8} fill={T.muted}>Train</text>
            <circle cx={290} cy={svgH - 15} r={4} fill="#dc262644" stroke="#dc2626" />
            <text x={298} y={svgH - 12} fontSize={8} fill={T.muted}>Test</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Polynomial Degree" value={degree} min={1} max={7} step={1}
            onChange={setDegree} color={C} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq="Train data points" result="8" color={C} />
            <CalcRow eq="Test data points" result="4" color="#dc2626" />
            <CalcRow eq="Model parameters (degree+1)" result={(Math.min(degree, 7) + 1).toString()} color={C} />
            <CalcRow eq={`Train RMSE`} result={trainRMSE.toFixed(3)} color={C} />
            <CalcRow eq={`Test RMSE`} result={testRMSE.toFixed(3)} color="#dc2626" />
            <CalcRow eq="Test/Train RMSE ratio" result={trainRMSE > 0.001 ? (testRMSE / trainRMSE).toFixed(2) : "—"} color={M.accent} />
            <CalcRow eq="True function" result="y = x²" color={T.muted} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="TRAIN RMSE" value={trainRMSE.toFixed(3)} color={C} sub="lower is better" />
            <ResultBox label="TEST RMSE" value={testRMSE.toFixed(3)} color="#dc2626" sub="lower is better" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> At low degree, both errors are high (underfitting).
            Around degree 2, the model matches the true y = x² well. At high degrees, train error drops near zero
            but test error explodes — that is overfitting. The sweet spot balances complexity and generalization.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 4 — Cross-Validation
   ════════════════════════════════════════════════════════════════ */
function CrossValidationSection() {
  const C = M.found;
  const [K, setK] = useState(3);

  const dataPoints = useMemo(() => {
    const r = seededRandom(77);
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      x: 1 + r() * 4,
      y: 2 + r() * 3,
      val: (2 + r() * 3).toFixed(1),
    }));
  }, []);

  const folds = useMemo(() => {
    const result = [];
    const size = Math.floor(10 / K);
    for (let f = 0; f < K; f++) {
      const testStart = f * size;
      const testEnd = f === K - 1 ? 10 : (f + 1) * size;
      const testIds = dataPoints.slice(testStart, testEnd).map(d => d.id);
      const trainIds = dataPoints.filter(d => !testIds.includes(d.id)).map(d => d.id);
      const score = 0.75 + seededRandom(f * 13 + 7)() * 0.2;
      result.push({ fold: f + 1, testIds, trainIds, score: score.toFixed(3) });
    }
    return result;
  }, [K, dataPoints]);

  const scores = folds.map(f => parseFloat(f.score));
  const mean = scores.reduce((a, v) => a + v, 0) / scores.length;
  const std = Math.sqrt(scores.reduce((a, v) => a + (v - mean) ** 2, 0) / scores.length);

  const foldColors = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#d97706"];
  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="K-Fold Cross-Validation" formula="Score = mean ± std over K folds">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A restaurant critic visits 5 times on different days to give a fair review. Each visit tests
          a different aspect. The average of all visits is more reliable than a single visit.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>{K}-Fold Split Visualization</text>
            {/* Show each fold as a row */}
            {folds.map((f, fi) => {
              const rowY = 30 + fi * ((svgH - 50) / K);
              const rowH = Math.max(14, ((svgH - 50) / K) - 4);
              return (
                <g key={fi}>
                  <text x={8} y={rowY + rowH / 2 + 3} fontSize={9} fill={T.muted} fontWeight={600}>F{f.fold}</text>
                  {dataPoints.map((d, di) => {
                    const cellW = (svgW - 50) / 10;
                    const cx = 30 + di * cellW;
                    const isTest = f.testIds.includes(d.id);
                    return (
                      <rect key={di} x={cx} y={rowY} width={cellW - 2} height={rowH} rx={3}
                        fill={isTest ? foldColors[fi % 5] + "55" : T.panel}
                        stroke={isTest ? foldColors[fi % 5] : T.border} strokeWidth={isTest ? 1.5 : 0.5} />
                    );
                  })}
                  <text x={svgW - 5} y={rowY + rowH / 2 + 3} textAnchor="end" fontSize={8} fill={foldColors[fi % 5]} fontWeight={700}>
                    {f.score}
                  </text>
                </g>
              );
            })}
            {/* Point labels at bottom */}
            {dataPoints.map((d, di) => {
              const cellW = (svgW - 50) / 10;
              return (
                <text key={di} x={30 + di * cellW + cellW / 2 - 1} y={svgH - 8} textAnchor="middle" fontSize={7} fill={T.dim}>
                  {d.id}
                </text>
              );
            })}
            <rect x={30} y={svgH - 18} width={10} height={8} rx={2} fill={C + "55"} stroke={C} strokeWidth={1} />
            <text x={44} y={svgH - 11} fontSize={8} fill={T.muted}>= Test fold</text>
            <rect x={110} y={svgH - 18} width={10} height={8} rx={2} fill={T.panel} stroke={T.border} strokeWidth={0.5} />
            <text x={124} y={svgH - 11} fontSize={8} fill={T.muted}>= Train fold</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="K (number of folds)" value={K} min={2} max={5} step={1}
            onChange={setK} color={C} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq="Total data points" result="10" color={C} />
            <CalcRow eq={`Points per fold ≈ 10 / ${K}`} result={Math.floor(10 / K).toString()} color={C} />
            {folds.map((f, i) => (
              <CalcRow key={i} eq={`Fold ${f.fold} score`} result={f.score} color={foldColors[i % 5]} />
            ))}
            <CalcRow eq={`Mean = (${scores.map(s => s.toFixed(3)).join(" + ")}) / ${K}`} result={mean.toFixed(3)} color={C} />
            <CalcRow eq="Std deviation" result={std.toFixed(3)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="MEAN SCORE" value={mean.toFixed(3)} color={C} />
            <ResultBox label="± STD" value={std.toFixed(3)} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Cross-validation uses every data point for both
            training and testing. Higher K means each test set is smaller but more folds provide better estimates.
            The standard deviation tells you how stable your model is — low std means reliable performance.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 5 — Decision Trees
   ════════════════════════════════════════════════════════════════ */
function DecisionTreeSection() {
  const C = M.algo;
  const [splitX, setSplitX] = useState(2.0);
  const [splitAxis, setSplitAxis] = useState(0);

  const points = [
    { en: 1.61, r: 1.43, label: 1, name: "Al" },
    { en: 1.83, r: 1.24, label: 1, name: "Fe" },
    { en: 1.90, r: 1.28, label: 1, name: "Cu" },
    { en: 1.90, r: 1.17, label: 0, name: "Si" },
    { en: 2.01, r: 1.22, label: 0, name: "Ge" },
    { en: 2.18, r: 1.26, label: 0, name: "GaAs" },
    { en: 2.55, r: 0.77, label: 0, name: "C" },
    { en: 1.65, r: 1.54, label: 1, name: "Mg" },
  ];

  const featureName = splitAxis === 0 ? "Electronegativity" : "Radius";
  const getVal = (p) => splitAxis === 0 ? p.en : p.r;

  const leftPts = points.filter(p => getVal(p) <= splitX);
  const rightPts = points.filter(p => getVal(p) > splitX);

  const gini = (pts) => {
    if (pts.length === 0) return 0;
    const p0 = pts.filter(p => p.label === 0).length / pts.length;
    const p1 = 1 - p0;
    return 1 - p0 * p0 - p1 * p1;
  };

  const giniParent = gini(points);
  const giniLeft = gini(leftPts);
  const giniRight = gini(rightPts);
  const giniWeighted = (leftPts.length / points.length) * giniLeft + (rightPts.length / points.length) * giniRight;
  const infoGain = giniParent - giniWeighted;

  const svgW = 340, svgH = 200;
  const enMin = 1.5, enMax = 2.7, rMin = 0.7, rMax = 1.6;
  const sx = (v) => 40 + (v - enMin) / (enMax - enMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - rMin) / (rMax - rMin) * (svgH - 50);

  return (
    <Card color={C} title="Decision Trees" formula="Gini = 1 − Σ pᵢ²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A game of 20 Questions. Each question splits the possibilities into two groups. The best question
          creates the purest groups — one group mostly "yes", the other mostly "no". Gini impurity measures how mixed a group is.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Split on {featureName} ≤ {splitX.toFixed(2)}</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={9} fill={T.muted}>Electronegativity</text>
            {/* Split line */}
            {splitAxis === 0 ? (
              <line x1={sx(splitX)} y1={18} x2={sx(splitX)} y2={svgH - 30} stroke={C} strokeWidth={2} strokeDasharray="5,3" />
            ) : (
              <line x1={40} y1={sy(splitX)} x2={svgW - 10} y2={sy(splitX)} stroke={C} strokeWidth={2} strokeDasharray="5,3" />
            )}
            {/* Shaded regions */}
            {splitAxis === 0 && (
              <>
                <rect x={40} y={18} width={sx(splitX) - 40} height={svgH - 48} fill="#059669" opacity={0.05} />
                <rect x={sx(splitX)} y={18} width={svgW - 10 - sx(splitX)} height={svgH - 48} fill="#dc2626" opacity={0.05} />
              </>
            )}
            {/* Data points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={sx(p.en)} cy={sy(p.r)} r={6}
                  fill={p.label === 0 ? "#2563eb33" : "#ea580c33"}
                  stroke={p.label === 0 ? "#2563eb" : "#ea580c"} strokeWidth={1.5} />
                <text x={sx(p.en)} y={sy(p.r) - 8} textAnchor="middle" fontSize={7} fill={T.ink} fontWeight={600}>{p.name}</text>
              </g>
            ))}
            <circle cx={230} cy={svgH - 15} r={4} fill="#2563eb33" stroke="#2563eb" />
            <text x={238} y={svgH - 12} fontSize={8} fill={T.muted}>Semi</text>
            <circle cx={275} cy={svgH - 15} r={4} fill="#ea580c33" stroke="#ea580c" />
            <text x={283} y={svgH - 12} fontSize={8} fill={T.muted}>Metal</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["Electronegativity", "Radius"].map((lbl, i) => (
              <button key={i} onClick={() => setSplitAxis(i)}
                style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: splitAxis === i ? C : T.surface, color: splitAxis === i ? "#fff" : T.muted,
                  border: `1px solid ${splitAxis === i ? C : T.border}`, fontWeight: 600 }}>{lbl}</button>
            ))}
          </div>
          <SliderRow label={`Split threshold (${featureName})`} value={splitX}
            min={splitAxis === 0 ? 1.5 : 0.7} max={splitAxis === 0 ? 2.6 : 1.6} step={0.01}
            onChange={setSplitX} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq="Parent: 4 semi + 4 metal in 8" result={`Gini = ${giniParent.toFixed(3)}`} color={C} />
            <CalcRow eq={`Left (≤ ${splitX.toFixed(2)}): ${leftPts.filter(p => p.label === 0).length}S + ${leftPts.filter(p => p.label === 1).length}M in ${leftPts.length}`}
              result={`Gini = ${giniLeft.toFixed(3)}`} color="#059669" />
            <CalcRow eq={`Right (> ${splitX.toFixed(2)}): ${rightPts.filter(p => p.label === 0).length}S + ${rightPts.filter(p => p.label === 1).length}M in ${rightPts.length}`}
              result={`Gini = ${giniRight.toFixed(3)}`} color="#dc2626" />
            <CalcRow eq={`Weighted = (${leftPts.length}/8)×${giniLeft.toFixed(3)} + (${rightPts.length}/8)×${giniRight.toFixed(3)}`}
              result={giniWeighted.toFixed(3)} color={C} />
            <CalcRow eq={`Info Gain = ${giniParent.toFixed(3)} − ${giniWeighted.toFixed(3)}`}
              result={infoGain.toFixed(3)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="GINI (WEIGHTED)" value={giniWeighted.toFixed(3)} color={C} />
            <ResultBox label="INFO GAIN" value={infoGain.toFixed(3)} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> A Gini of 0 means a perfectly pure node (all one class).
            A Gini of 0.5 means maximum impurity (50-50 split). The tree picks the split with the highest information gain —
            the biggest drop in impurity.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 6 — Random Forest
   ════════════════════════════════════════════════════════════════ */
function RandomForestSection() {
  const C = M.algo;
  const [nTrees, setNTrees] = useState(3);

  const testSample = { en: 2.10, r: 1.20, name: "Unknown" };

  const treeResults = useMemo(() => {
    const trees = [];
    for (let t = 0; t < nTrees; t++) {
      const rng = seededRandom(t * 31 + 17);
      const subset = [0, 1, 2, 3, 4, 5, 6, 7].filter(() => rng() > 0.35);
      const threshold = 1.85 + (rng() - 0.5) * 0.4;
      const prediction = testSample.en > threshold ? 0 : 1;
      const confidence = 0.6 + rng() * 0.35;
      trees.push({ id: t + 1, subsetSize: subset.length, threshold: threshold.toFixed(2), prediction, confidence: confidence.toFixed(2) });
    }
    return trees;
  }, [nTrees]);

  const votes0 = treeResults.filter(t => t.prediction === 0).length;
  const votes1 = treeResults.filter(t => t.prediction === 1).length;
  const ensemblePred = votes0 >= votes1 ? "Semiconductor" : "Metal";

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Random Forest" formula="Ensemble = majority vote of N trees">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A panel of judges scoring a gymnastics routine. Each judge sees the routine from a slightly different angle
          and has different expertise. The average score is more reliable than any single judge's opinion.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Random Forest: {nTrees} Trees Voting</text>
            {/* Draw each tree as a simple diagram */}
            {treeResults.map((tree, i) => {
              const treeW = Math.min(100, (svgW - 40) / nTrees);
              const tx = 20 + i * treeW + treeW / 2;
              const ty = 35;
              const predColor = tree.prediction === 0 ? "#2563eb" : "#ea580c";
              return (
                <g key={i}>
                  {/* Tree trunk */}
                  <rect x={tx - 15} y={ty} width={30} height={60} rx={4} fill={C + "15"} stroke={C} strokeWidth={1} />
                  <text x={tx} y={ty + 14} textAnchor="middle" fontSize={8} fill={C} fontWeight={700}>Tree {tree.id}</text>
                  <text x={tx} y={ty + 28} textAnchor="middle" fontSize={7} fill={T.muted}>n={tree.subsetSize}</text>
                  <text x={tx} y={ty + 42} textAnchor="middle" fontSize={7} fill={T.muted}>θ={tree.threshold}</text>
                  <text x={tx} y={ty + 55} textAnchor="middle" fontSize={8} fill={predColor} fontWeight={700}>
                    {tree.prediction === 0 ? "Semi" : "Metal"}
                  </text>
                  {/* Arrow to vote */}
                  <line x1={tx} y1={ty + 62} x2={svgW / 2} y2={145} stroke={predColor + "66"} strokeWidth={1} />
                </g>
              );
            })}
            {/* Ensemble vote box */}
            <rect x={svgW / 2 - 55} y={145} width={110} height={30} rx={6} fill={votes0 >= votes1 ? "#2563eb15" : "#ea580c15"}
              stroke={votes0 >= votes1 ? "#2563eb" : "#ea580c"} strokeWidth={1.5} />
            <text x={svgW / 2} y={157} textAnchor="middle" fontSize={8} fill={T.muted}>Ensemble Vote:</text>
            <text x={svgW / 2} y={170} textAnchor="middle" fontSize={10} fill={votes0 >= votes1 ? "#2563eb" : "#ea580c"} fontWeight={800}>
              {ensemblePred}
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Number of Trees" value={nTrees} min={1} max={7} step={1}
            onChange={setNTrees} color={C} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq="Test sample: EN = 2.10, R = 1.20" result="Unknown" color={C} />
            {treeResults.map((t, i) => (
              <CalcRow key={i} eq={`Tree ${t.id}: EN ${testSample.en} > ${t.threshold}?`}
                result={t.prediction === 0 ? "Semi" : "Metal"} color={t.prediction === 0 ? "#2563eb" : "#ea580c"} />
            ))}
            <CalcRow eq={`Votes for Semiconductor`} result={votes0.toString()} color="#2563eb" />
            <CalcRow eq={`Votes for Metal`} result={votes1.toString()} color="#ea580c" />
            <CalcRow eq="Majority vote" result={ensemblePred} color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="PREDICTION" value={ensemblePred} color={C} />
            <ResultBox label="TREES" value={nTrees.toString()} color={C} sub="voting" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Each tree trains on a random subset of data and features.
            This "randomness" makes individual trees different. Combining their votes (bagging) reduces overfitting and
            increases robustness. More trees usually means better performance up to a point.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 7 — Support Vector Machine (SVM)
   ════════════════════════════════════════════════════════════════ */
function SVMSection() {
  const C = M.algo;
  const [cParam, setCParam] = useState(1.0);

  const pts = [
    { x: 1.0, y: 2.0, cls: 0 }, { x: 1.5, y: 2.5, cls: 0 }, { x: 1.2, y: 3.0, cls: 0 },
    { x: 3.0, y: 1.5, cls: 1 }, { x: 3.5, y: 2.0, cls: 1 }, { x: 3.2, y: 2.8, cls: 1 },
  ];

  const c0 = pts.filter(p => p.cls === 0);
  const c1 = pts.filter(p => p.cls === 1);
  const cx0 = c0.reduce((s, p) => s + p.x, 0) / c0.length;
  const cy0 = c0.reduce((s, p) => s + p.y, 0) / c0.length;
  const cx1 = c1.reduce((s, p) => s + p.x, 0) / c1.length;
  const cy1 = c1.reduce((s, p) => s + p.y, 0) / c1.length;

  const midX = (cx0 + cx1) / 2;
  const midY = (cy0 + cy1) / 2;
  const wX = cx1 - cx0;
  const wY = cy1 - cy0;
  const wNorm = Math.sqrt(wX * wX + wY * wY);

  const marginWidth = 2.0 / (wNorm * cParam);
  const marginHalf = marginWidth / 2;

  const svgW = 340, svgH = 200;
  const xMin = 0, xMax = 4.5, yMin = 0.5, yMax = 3.8;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  const perpX = -wY / wNorm;
  const perpY = wX / wNorm;

  return (
    <Card color={C} title="Support Vector Machine" formula="Maximize margin = 2 / ||w||">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Parking a car in the middle of a lane. You want equal space on both sides — that is the maximum margin.
          SVM finds the line that leaves the widest "lane" between two classes.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Maximum Margin Classifier</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            {/* Decision boundary (perpendicular to w, through midpoint) */}
            <line
              x1={sx(midX + perpX * 3)} y1={sy(midY + perpY * 3)}
              x2={sx(midX - perpX * 3)} y2={sy(midY - perpY * 3)}
              stroke={C} strokeWidth={2} />
            {/* Margin lines */}
            <line
              x1={sx(midX + marginHalf * wX / wNorm + perpX * 3)} y1={sy(midY + marginHalf * wY / wNorm + perpY * 3)}
              x2={sx(midX + marginHalf * wX / wNorm - perpX * 3)} y2={sy(midY + marginHalf * wY / wNorm - perpY * 3)}
              stroke={C} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
            <line
              x1={sx(midX - marginHalf * wX / wNorm + perpX * 3)} y1={sy(midY - marginHalf * wY / wNorm + perpY * 3)}
              x2={sx(midX - marginHalf * wX / wNorm - perpX * 3)} y2={sy(midY - marginHalf * wY / wNorm - perpY * 3)}
              stroke={C} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
            {/* Margin shading */}
            <rect
              x={sx(midX - marginHalf * wX / wNorm - 1.5)} y={20}
              width={Math.abs(sx(midX + marginHalf * wX / wNorm) - sx(midX - marginHalf * wX / wNorm))}
              height={svgH - 52} fill={C} opacity={0.05} rx={4} />
            {/* Data points */}
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={sx(p.x)} cy={sy(p.y)} r={6}
                  fill={p.cls === 0 ? "#2563eb33" : "#ea580c33"}
                  stroke={p.cls === 0 ? "#2563eb" : "#ea580c"} strokeWidth={2} />
              </g>
            ))}
            <circle cx={240} cy={svgH - 15} r={4} fill="#2563eb33" stroke="#2563eb" />
            <text x={248} y={svgH - 12} fontSize={8} fill={T.muted}>Class 0</text>
            <circle cx={290} cy={svgH - 15} r={4} fill="#ea580c33" stroke="#ea580c" />
            <text x={298} y={svgH - 12} fontSize={8} fill={T.muted}>Class 1</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="C (regularization)" value={cParam} min={0.1} max={5.0} step={0.1}
            onChange={setCParam} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq={`w = (c1_center − c0_center)`} result={`(${wX.toFixed(2)}, ${wY.toFixed(2)})`} color={C} />
            <CalcRow eq={`||w|| = √(${wX.toFixed(2)}² + ${wY.toFixed(2)}²)`} result={wNorm.toFixed(3)} color={C} />
            <CalcRow eq={`Margin = 2 / (||w|| × C)`} result={marginWidth.toFixed(3)} color={C} />
            <CalcRow eq={`C = ${cParam.toFixed(1)} (higher → narrower margin)`} result={cParam > 1 ? "Hard" : "Soft"} color={M.accent} />
            <CalcRow eq={`Midpoint = ((${cx0.toFixed(1)}+${cx1.toFixed(1)})/2, ...)`} result={`(${midX.toFixed(2)}, ${midY.toFixed(2)})`} color={C} />
            <CalcRow eq="Support vectors (closest points)" result="on margin lines" color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="MARGIN WIDTH" value={marginWidth.toFixed(3)} color={C} />
            <ResultBox label="C PARAM" value={cParam.toFixed(1)} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> High C penalizes misclassification heavily (hard margin,
            narrow lane). Low C allows some misclassification (soft margin, wider lane). The support vectors are
            the critical points closest to the decision boundary — they define the margin.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 8 — PCA (Principal Component Analysis)
   ════════════════════════════════════════════════════════════════ */
function PCASection() {
  const C = M.algo;
  const [nComp, setNComp] = useState(2);

  const materials = [
    { name: "Si",   f: [1.90, 28.09, 1.17] },
    { name: "Ge",   f: [2.01, 72.63, 1.22] },
    { name: "GaAs", f: [2.18, 72.32, 1.26] },
    { name: "Al",   f: [1.61, 26.98, 1.43] },
    { name: "Cu",   f: [1.90, 63.55, 1.28] },
  ];

  const featureNames = ["EN", "Mass", "Radius"];
  const n = materials.length;
  const d = 3;

  const means = [0, 1, 2].map(j => materials.reduce((s, m) => s + m.f[j], 0) / n);
  const stds = [0, 1, 2].map(j => {
    const v = materials.reduce((s, m) => s + (m.f[j] - means[j]) ** 2, 0) / n;
    return Math.sqrt(v);
  });

  const centered = materials.map(m => m.f.map((v, j) => stds[j] > 0 ? (v - means[j]) / stds[j] : 0));

  const cov = Array.from({ length: d }, (_, i) =>
    Array.from({ length: d }, (_, j) =>
      centered.reduce((s, row) => s + row[i] * row[j], 0) / n
    )
  );

  const eigenvalues = [1.85, 0.92, 0.23];
  const totalVar = eigenvalues.reduce((a, v) => a + v, 0);
  const explainedRatios = eigenvalues.map(e => e / totalVar);
  const cumulative = explainedRatios.reduce((acc, v) => {
    const last = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(last + v);
    return acc;
  }, []);

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Principal Component Analysis" formula="Cov(X) → eigenvalues, eigenvectors">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Photographing a 3D object — find the best camera angle that captures the most information in a flat 2D picture.
          PCA finds the directions (principal components) along which data varies the most.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Explained Variance by Component</text>
            {/* Bar chart */}
            {eigenvalues.map((ev, i) => {
              const barW = 50;
              const barH = explainedRatios[i] * 120;
              const x = 60 + i * 90;
              const y = 160 - barH;
              const active = i < nComp;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barW} height={barH} rx={4}
                    fill={active ? C : T.dim} opacity={active ? 0.7 : 0.3} />
                  <text x={x + barW / 2} y={170} textAnchor="middle" fontSize={9} fill={T.muted}>PC{i + 1}</text>
                  <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill={active ? C : T.dim} fontWeight={700}>
                    {(explainedRatios[i] * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}
            {/* Cumulative line */}
            {cumulative.map((c, i) => {
              const x = 85 + i * 90;
              const y = 160 - c * 120;
              return (
                <g key={`c${i}`}>
                  <circle cx={x} cy={y} r={3} fill={M.accent} />
                  {i > 0 && (
                    <line x1={85 + (i - 1) * 90} y1={160 - cumulative[i - 1] * 120} x2={x} y2={y}
                      stroke={M.accent} strokeWidth={1.5} />
                  )}
                  <text x={x + 10} y={y + 3} fontSize={8} fill={M.accent} fontWeight={600}>{(c * 100).toFixed(0)}%</text>
                </g>
              );
            })}
            <text x={300} y={svgH - 8} fontSize={8} fill={M.accent}>Cumulative</text>
          </svg>

          {/* Covariance matrix */}
          <div style={{ marginTop: 8, background: T.surface, borderRadius: 8, padding: 8, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.muted, marginBottom: 4, letterSpacing: 2 }}>COVARIANCE MATRIX (standardized)</div>
            <div style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 1.6 }}>
              {cov.map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 4 }}>
                  <span style={{ color: T.muted, width: 45 }}>{featureNames[i]}</span>
                  {row.map((v, j) => (
                    <span key={j} style={{ width: 55, textAlign: "right", color: i === j ? C : T.ink }}>{v.toFixed(3)}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Number of Components" value={nComp} min={1} max={3} step={1}
            onChange={setNComp} color={C} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq="Original features" result="3 (EN, Mass, Radius)" color={C} />
            <CalcRow eq="Mean EN = (1.90+2.01+2.18+1.61+1.90)/5" result={means[0].toFixed(3)} color={C} />
            <CalcRow eq={`Std EN`} result={stds[0].toFixed(3)} color={C} />
            {eigenvalues.map((ev, i) => (
              <CalcRow key={i} eq={`Eigenvalue λ${i + 1}`} result={ev.toFixed(2)} color={i < nComp ? C : T.dim} />
            ))}
            <CalcRow eq={`Total variance = Σ λ`} result={totalVar.toFixed(2)} color={C} />
            <CalcRow eq={`Kept with ${nComp} PC${nComp > 1 ? "s" : ""}`}
              result={`${(cumulative[nComp - 1] * 100).toFixed(1)}%`} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="COMPONENTS KEPT" value={nComp.toString()} color={C} sub={`of 3 original`} />
            <ResultBox label="VARIANCE KEPT" value={`${(cumulative[nComp - 1] * 100).toFixed(1)}%`} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> PCA compresses high-dimensional data by keeping only the
            directions with the most variance. If 2 PCs capture 92% of variance, you can safely drop the 3rd dimension.
            This helps with visualization and reducing overfitting.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 9 — Perceptron (Single Neuron)
   ════════════════════════════════════════════════════════════════ */
function PerceptronSection() {
  const C = M.nn;
  const [w1, setW1] = useState(0.5);
  const [w2, setW2] = useState(-0.3);
  const [bias, setBias] = useState(0.1);
  const [x1, setX1] = useState(1.0);
  const [x2, setX2] = useState(0.8);
  const [actFn, setActFn] = useState("sigmoid");

  const z = w1 * x1 + w2 * x2 + bias;
  const output = actFn === "sigmoid" ? sigmoid(z) : relu(z);
  const actName = actFn === "sigmoid" ? "σ" : "ReLU";

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Perceptron (Single Neuron)" formula={`output = ${actName}(w₁x₁ + w₂x₂ + b)`}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A voter weighing pros and cons before making a decision. Each argument (input) has a weight (importance).
          The voter adds up all weighted arguments, applies a threshold, and decides yes or no.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Single Neuron Diagram</text>
            {/* Input nodes */}
            <circle cx={60} cy={60} r={18} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={60} y={58} textAnchor="middle" fontSize={10} fill="#2563eb" fontWeight={700}>x₁</text>
            <text x={60} y={70} textAnchor="middle" fontSize={8} fill={T.muted}>{x1.toFixed(1)}</text>

            <circle cx={60} cy={140} r={18} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={60} y={138} textAnchor="middle" fontSize={10} fill="#2563eb" fontWeight={700}>x₂</text>
            <text x={60} y={150} textAnchor="middle" fontSize={8} fill={T.muted}>{x2.toFixed(1)}</text>

            {/* Weights on arrows */}
            <line x1={78} y1={60} x2={152} y2={90} stroke={C} strokeWidth={1.5} />
            <text x={108} y={68} fontSize={8} fill={C} fontWeight={600}>w₁={w1.toFixed(1)}</text>
            <line x1={78} y1={140} x2={152} y2={110} stroke={C} strokeWidth={1.5} />
            <text x={108} y={138} fontSize={8} fill={C} fontWeight={600}>w₂={w2.toFixed(1)}</text>

            {/* Neuron */}
            <circle cx={170} cy={100} r={22} fill={C + "20"} stroke={C} strokeWidth={2} />
            <text x={170} y={96} textAnchor="middle" fontSize={9} fill={C} fontWeight={700}>Σ + b</text>
            <text x={170} y={108} textAnchor="middle" fontSize={8} fill={T.muted}>{actName}</text>

            {/* Bias arrow */}
            <line x1={170} y1={45} x2={170} y2={78} stroke={M.accent} strokeWidth={1} strokeDasharray="3,2" />
            <text x={170} y={40} textAnchor="middle" fontSize={8} fill={M.accent}>b={bias.toFixed(1)}</text>

            {/* Output */}
            <line x1={192} y1={100} x2={260} y2={100} stroke={C} strokeWidth={2} markerEnd="url(#arrowhead)" />
            <circle cx={280} cy={100} r={20} fill={output > 0.5 ? "#05966920" : "#dc262620"}
              stroke={output > 0.5 ? "#059669" : "#dc2626"} strokeWidth={2} />
            <text x={280} y={97} textAnchor="middle" fontSize={11} fill={output > 0.5 ? "#059669" : "#dc2626"} fontWeight={800}>
              {output.toFixed(3)}
            </text>
            <text x={280} y={110} textAnchor="middle" fontSize={8} fill={T.muted}>output</text>

            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill={C} />
              </marker>
            </defs>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["sigmoid", "relu"].map(fn => (
              <button key={fn} onClick={() => setActFn(fn)}
                style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: actFn === fn ? C : T.surface, color: actFn === fn ? "#fff" : T.muted,
                  border: `1px solid ${actFn === fn ? C : T.border}`, fontWeight: 600 }}>
                {fn === "sigmoid" ? "Sigmoid" : "ReLU"}
              </button>
            ))}
          </div>

          <SliderRow label="w₁" value={w1} min={-2} max={2} step={0.1} onChange={setW1} color={C} />
          <SliderRow label="w₂" value={w2} min={-2} max={2} step={0.1} onChange={setW2} color={C} />
          <SliderRow label="bias (b)" value={bias} min={-2} max={2} step={0.1} onChange={setBias} color={M.accent} />
          <SliderRow label="x₁" value={x1} min={-2} max={2} step={0.1} onChange={setX1} color="#2563eb" />
          <SliderRow label="x₂" value={x2} min={-2} max={2} step={0.1} onChange={setX2} color="#2563eb" />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            <CalcRow eq={`w₁ × x₁ = ${w1.toFixed(1)} × ${x1.toFixed(1)}`} result={(w1 * x1).toFixed(3)} color={C} />
            <CalcRow eq={`w₂ × x₂ = ${w2.toFixed(1)} × ${x2.toFixed(1)}`} result={(w2 * x2).toFixed(3)} color={C} />
            <CalcRow eq={`z = ${(w1 * x1).toFixed(3)} + ${(w2 * x2).toFixed(3)} + ${bias.toFixed(1)}`} result={z.toFixed(3)} color={C} />
            <CalcRow eq={`${actName}(${z.toFixed(3)})`} result={output.toFixed(4)} color={C} />
            <CalcRow eq={actFn === "sigmoid" ? `σ(z) = 1/(1+e^(−z))` : `ReLU(z) = max(0, z)`} result={output.toFixed(4)} color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="WEIGHTED SUM (z)" value={z.toFixed(3)} color={C} />
            <ResultBox label="OUTPUT" value={output.toFixed(4)} color={output > 0.5 ? "#059669" : "#dc2626"} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> A neuron computes a weighted sum of inputs, adds a bias,
            then applies an activation function. Sigmoid squashes everything to 0–1 (good for probabilities).
            ReLU passes positive values unchanged and kills negatives (faster training in deep networks).
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 10 — Deep Neural Network
   ════════════════════════════════════════════════════════════════ */
function DNNSection() {
  const C = M.nn;
  const [inputVal, setInputVal] = useState(1.0);

  const x1 = inputVal;
  const x2 = 0.5;

  const w = {
    h1_1: 0.6, h1_2: -0.4,
    h2_1: 0.3, h2_2: 0.8,
    b1: 0.1, b2: -0.2,
    o1: 0.7, o2: -0.5,
    bo: 0.15,
  };

  const z1 = w.h1_1 * x1 + w.h1_2 * x2 + w.b1;
  const h1 = sigmoid(z1);
  const z2 = w.h2_1 * x1 + w.h2_2 * x2 + w.b2;
  const h2 = sigmoid(z2);
  const zO = w.o1 * h1 + w.o2 * h2 + w.bo;
  const output = sigmoid(zO);

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Deep Neural Network" formula="output = σ(W₂ · σ(W₁ · x + b₁) + b₂)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          An assembly line with stations. Raw materials (inputs) pass through Station 1 (hidden layer 1),
          get partially processed, then move to Station 2 (output). Each station transforms the product in a specific way.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>2-Layer Network: Forward Pass</text>
            {/* Input layer */}
            <circle cx={50} cy={65} r={16} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={50} y={62} textAnchor="middle" fontSize={9} fill="#2563eb" fontWeight={700}>x₁</text>
            <text x={50} y={73} textAnchor="middle" fontSize={7} fill={T.muted}>{x1.toFixed(1)}</text>
            <circle cx={50} cy={140} r={16} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={50} y={137} textAnchor="middle" fontSize={9} fill="#2563eb" fontWeight={700}>x₂</text>
            <text x={50} y={148} textAnchor="middle" fontSize={7} fill={T.muted}>{x2.toFixed(1)}</text>

            {/* Connections to hidden */}
            <line x1={66} y1={65} x2={142} y2={65} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={65} x2={142} y2={140} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={140} x2={142} y2={65} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={140} x2={142} y2={140} stroke={C + "66"} strokeWidth={1} />

            {/* Hidden layer */}
            <circle cx={158} cy={65} r={16} fill={C + "20"} stroke={C} strokeWidth={1.5} />
            <text x={158} y={62} textAnchor="middle" fontSize={9} fill={C} fontWeight={700}>h₁</text>
            <text x={158} y={73} textAnchor="middle" fontSize={7} fill={T.muted}>{h1.toFixed(3)}</text>
            <circle cx={158} cy={140} r={16} fill={C + "20"} stroke={C} strokeWidth={1.5} />
            <text x={158} y={137} textAnchor="middle" fontSize={9} fill={C} fontWeight={700}>h₂</text>
            <text x={158} y={148} textAnchor="middle" fontSize={7} fill={T.muted}>{h2.toFixed(3)}</text>

            {/* Connections to output */}
            <line x1={174} y1={65} x2={245} y2={100} stroke={C + "66"} strokeWidth={1} />
            <line x1={174} y1={140} x2={245} y2={100} stroke={C + "66"} strokeWidth={1} />

            {/* Output layer */}
            <circle cx={262} cy={100} r={18} fill={output > 0.5 ? "#05966920" : "#dc262620"}
              stroke={output > 0.5 ? "#059669" : "#dc2626"} strokeWidth={2} />
            <text x={262} y={97} textAnchor="middle" fontSize={10} fill={output > 0.5 ? "#059669" : "#dc2626"} fontWeight={800}>
              {output.toFixed(3)}
            </text>
            <text x={262} y={109} textAnchor="middle" fontSize={7} fill={T.muted}>output</text>

            {/* Labels */}
            <text x={50} y={svgH - 5} textAnchor="middle" fontSize={8} fill={T.dim}>Input</text>
            <text x={158} y={svgH - 5} textAnchor="middle" fontSize={8} fill={T.dim}>Hidden</text>
            <text x={262} y={svgH - 5} textAnchor="middle" fontSize={8} fill={T.dim}>Output</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Input x₁" value={inputVal} min={-2} max={2} step={0.1} onChange={setInputVal} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>FORWARD PASS CALCULATION</div>
            <CalcRow eq={`z₁ = ${w.h1_1}×${x1.toFixed(1)} + ${w.h1_2}×${x2} + ${w.b1}`} result={z1.toFixed(3)} color={C} />
            <CalcRow eq={`h₁ = σ(${z1.toFixed(3)})`} result={h1.toFixed(4)} color={C} />
            <CalcRow eq={`z₂ = ${w.h2_1}×${x1.toFixed(1)} + ${w.h2_2}×${x2} + ${w.b2}`} result={z2.toFixed(3)} color={C} />
            <CalcRow eq={`h₂ = σ(${z2.toFixed(3)})`} result={h2.toFixed(4)} color={C} />
            <CalcRow eq={`z_out = ${w.o1}×${h1.toFixed(3)} + ${w.o2}×${h2.toFixed(3)} + ${w.bo}`} result={zO.toFixed(4)} color={C} />
            <CalcRow eq={`output = σ(${zO.toFixed(4)})`} result={output.toFixed(4)} color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="h₁" value={h1.toFixed(3)} color={C} />
            <ResultBox label="h₂" value={h2.toFixed(3)} color={C} />
            <ResultBox label="OUTPUT" value={output.toFixed(3)} color={output > 0.5 ? "#059669" : "#dc2626"} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Each layer transforms data through weighted sums + activations.
            The hidden layer creates intermediate representations — it "re-encodes" the input in a way that makes the output
            task easier. More layers = more abstraction levels = can learn more complex patterns.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 11 — Backpropagation
   ════════════════════════════════════════════════════════════════ */
function BackpropSection() {
  const C = M.nn;
  const [lr, setLr] = useState(0.5);
  const [step, setStep] = useState(0);

  const x = 1.0;
  const yTrue = 0.8;

  const initW = [0.5, 0.3];
  const initB = [0.1, 0.05];

  const history = useMemo(() => {
    let w1 = initW[0], w2 = initW[1], b1 = initB[0], b2 = initB[1];
    const hist = [];
    for (let i = 0; i <= 10; i++) {
      const z1 = w1 * x + b1;
      const h = sigmoid(z1);
      const z2 = w2 * h + b2;
      const yhat = sigmoid(z2);
      const loss = (yTrue - yhat) ** 2;
      const dL_dyhat = -2 * (yTrue - yhat);
      const dyhat_dz2 = yhat * (1 - yhat);
      const dz2_dw2 = h;
      const dz2_dh = w2;
      const dh_dz1 = h * (1 - h);
      const dz1_dw1 = x;
      const dL_dw2 = dL_dyhat * dyhat_dz2 * dz2_dw2;
      const dL_dw1 = dL_dyhat * dyhat_dz2 * dz2_dh * dh_dz1 * dz1_dw1;
      const dL_db2 = dL_dyhat * dyhat_dz2;
      const dL_db1 = dL_dyhat * dyhat_dz2 * dz2_dh * dh_dz1;

      hist.push({ w1, w2, b1, b2, h, yhat, loss, dL_dw1, dL_dw2, dL_db1, dL_db2 });

      w1 -= lr * dL_dw1;
      w2 -= lr * dL_dw2;
      b1 -= lr * dL_db1;
      b2 -= lr * dL_db2;
    }
    return hist;
  }, [lr]);

  const cur = history[Math.min(step, history.length - 1)];
  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Backpropagation" formula="w_new = w_old − η × ∂L/∂w">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A teacher tracing back which step caused the wrong answer on a math test. If the final answer is wrong,
          the teacher checks each intermediate step to find where the biggest mistake was, then corrects those steps the most.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Loss Over Training Steps</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={20} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fontSize={9} fill={T.muted}>Training Step</text>
            <text x={12} y={svgH / 2} fontSize={9} fill={T.muted} transform={`rotate(-90,12,${svgH / 2})`}>Loss</text>
            {/* Loss curve */}
            {history.map((h, i) => {
              if (i >= history.length - 1) return null;
              const x1 = 40 + i * (svgW - 50) / 10;
              const x2 = 40 + (i + 1) * (svgW - 50) / 10;
              const maxLoss = Math.max(...history.map(hh => hh.loss), 0.01);
              const y1 = svgH - 30 - (h.loss / maxLoss) * (svgH - 55);
              const y2 = svgH - 30 - (history[i + 1].loss / maxLoss) * (svgH - 55);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth={2} />;
            })}
            {/* Current step marker */}
            {(() => {
              const maxLoss = Math.max(...history.map(h => h.loss), 0.01);
              const cx = 40 + step * (svgW - 50) / 10;
              const cy = svgH - 30 - (cur.loss / maxLoss) * (svgH - 55);
              return <circle cx={cx} cy={cy} r={5} fill={C} stroke="#fff" strokeWidth={2} />;
            })()}
            {/* Target line */}
            <line x1={40} y1={svgH - 32} x2={svgW - 10} y2={svgH - 32} stroke="#059669" strokeWidth={1} strokeDasharray="4,3" />
            <text x={svgW - 12} y={svgH - 35} textAnchor="end" fontSize={8} fill="#059669">Target: Loss → 0</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Learning Rate (η)" value={lr} min={0.05} max={2.0} step={0.05} onChange={setLr} color={C} />
          <SliderRow label="Training Step" value={step} min={0} max={10} step={1}
            onChange={setStep} color={M.accent} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP {step} CALCULATION</div>
            <CalcRow eq={`Forward: h = σ(${cur.w1.toFixed(3)}×${x} + ${cur.b1.toFixed(3)})`} result={cur.h.toFixed(4)} color={C} />
            <CalcRow eq={`Forward: ŷ = σ(${cur.w2.toFixed(3)}×${cur.h.toFixed(3)} + ${cur.b2.toFixed(3)})`} result={cur.yhat.toFixed(4)} color={C} />
            <CalcRow eq={`Loss = (${yTrue} − ${cur.yhat.toFixed(4)})²`} result={cur.loss.toFixed(5)} color="#dc2626" />
            <CalcRow eq="∂L/∂w₂ (backprop)" result={cur.dL_dw2.toFixed(4)} color={C} />
            <CalcRow eq="∂L/∂w₁ (backprop chain)" result={cur.dL_dw1.toFixed(4)} color={C} />
            <CalcRow eq={`w₂_new = ${cur.w2.toFixed(3)} − ${lr}×${cur.dL_dw2.toFixed(4)}`}
              result={(cur.w2 - lr * cur.dL_dw2).toFixed(4)} color={M.accent} />
            <CalcRow eq={`w₁_new = ${cur.w1.toFixed(3)} − ${lr}×${cur.dL_dw1.toFixed(4)}`}
              result={(cur.w1 - lr * cur.dL_dw1).toFixed(4)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="LOSS" value={cur.loss.toFixed(5)} color="#dc2626" sub={`step ${step}`} />
            <ResultBox label="PREDICTION" value={cur.yhat.toFixed(4)} color={C} sub={`target: ${yTrue}`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Backpropagation uses the chain rule of calculus to compute
            how much each weight contributed to the error. The learning rate controls step size — too large and you overshoot,
            too small and training is slow. Watch the loss curve decrease as gradients update the weights.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 12 — CNN & Transformer
   ════════════════════════════════════════════════════════════════ */
function CNNTransformerSection() {
  const C = M.nn;
  const [showCNN, setShowCNN] = useState(true);

  const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
  const inputPatch = [[2, 1, 0], [3, 2, 1], [4, 3, 2]];
  const convResult = inputPatch.reduce((s, row, i) =>
    s + row.reduce((rs, v, j) => rs + v * kernel[i][j], 0), 0);

  const attnTokens = ["Fe", "O", "forms", "rust"];
  const queryKey = [[0.9, 0.1, 0.0, 0.0], [0.1, 0.7, 0.1, 0.1], [0.0, 0.1, 0.8, 0.1], [0.0, 0.1, 0.1, 0.8]];

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="CNN & Transformer" formula="Conv: Σ(input × kernel) | Attn: softmax(QK^T/√d)V">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          CNN = a magnifying glass sliding across a page, examining small patches one at a time.
          Transformer = reading the whole page at once and deciding which words relate to each other.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["CNN (Convolution)", "Transformer (Attention)"].map((lbl, i) => (
              <button key={i} onClick={() => setShowCNN(i === 0)}
                style={{ padding: "3px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: (showCNN && i === 0) || (!showCNN && i === 1) ? C : T.surface,
                  color: (showCNN && i === 0) || (!showCNN && i === 1) ? "#fff" : T.muted,
                  border: `1px solid ${(showCNN && i === 0) || (!showCNN && i === 1) ? C : T.border}`, fontWeight: 600 }}>{lbl}</button>
            ))}
          </div>

          {showCNN ? (
            <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>3×3 Convolution Operation</text>
              {/* Input patch */}
              <text x={70} y={35} textAnchor="middle" fontSize={9} fill={T.muted} fontWeight={600}>Input Patch</text>
              {inputPatch.map((row, i) => row.map((v, j) => (
                <g key={`i${i}${j}`}>
                  <rect x={30 + j * 28} y={40 + i * 28} width={26} height={26} rx={3} fill="#2563eb11" stroke="#2563eb44" />
                  <text x={43 + j * 28} y={57 + i * 28} textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight={600}>{v}</text>
                </g>
              )))}
              {/* Multiply sign */}
              <text x={130} y={75} fontSize={16} fill={T.muted}>×</text>
              {/* Kernel */}
              <text x={200} y={35} textAnchor="middle" fontSize={9} fill={T.muted} fontWeight={600}>Kernel</text>
              {kernel.map((row, i) => row.map((v, j) => (
                <g key={`k${i}${j}`}>
                  <rect x={160 + j * 28} y={40 + i * 28} width={26} height={26} rx={3} fill={C + "11"} stroke={C + "44"} />
                  <text x={173 + j * 28} y={57 + i * 28} textAnchor="middle" fontSize={11} fill={C} fontWeight={600}>{v}</text>
                </g>
              )))}
              {/* Equals */}
              <text x={260} y={75} fontSize={16} fill={T.muted}>=</text>
              {/* Result */}
              <rect x={275} y={52} width={45} height={35} rx={6} fill={C + "22"} stroke={C} strokeWidth={1.5} />
              <text x={297} y={75} textAnchor="middle" fontSize={16} fill={C} fontWeight={800}>{convResult}</text>
              {/* Element-wise detail */}
              <text x={svgW / 2} y={140} textAnchor="middle" fontSize={9} fill={T.muted}>Element-wise multiply then sum:</text>
              <text x={svgW / 2} y={155} textAnchor="middle" fontSize={8} fill={T.ink} fontFamily="monospace">
                2×1 + 1×0 + 0×(−1) + 3×1 + 2×0 + 1×(−1) + 4×1 + 3×0 + 2×(−1)
              </text>
              <text x={svgW / 2} y={170} textAnchor="middle" fontSize={9} fill={C} fontWeight={700}>
                = 2 + 0 + 0 + 3 + 0 − 1 + 4 + 0 − 2 = {convResult}
              </text>
            </svg>
          ) : (
            <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Self-Attention Weights</text>
              {/* Token labels */}
              {attnTokens.map((t, i) => (
                <g key={i}>
                  <text x={90 + i * 55} y={38} textAnchor="middle" fontSize={9} fill={C} fontWeight={600}>{t}</text>
                  <text x={30} y={58 + i * 35} textAnchor="end" fontSize={9} fill={C} fontWeight={600}>{t}</text>
                </g>
              ))}
              {/* Attention matrix */}
              {queryKey.map((row, i) => row.map((v, j) => {
                const intensity = Math.floor(v * 255);
                return (
                  <g key={`a${i}${j}`}>
                    <rect x={65 + j * 55} y={44 + i * 35} width={50} height={30} rx={3}
                      fill={`rgba(220,38,38,${v * 0.5})`} stroke={T.border} />
                    <text x={90 + j * 55} y={63 + i * 35} textAnchor="middle" fontSize={10} fill={T.ink} fontWeight={600}>
                      {v.toFixed(1)}
                    </text>
                  </g>
                );
              }))}
              <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize={9} fill={T.muted}>
                Each row shows how much one token "attends" to others
              </text>
            </svg>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>
              {showCNN ? "CNN CALCULATION" : "ATTENTION CALCULATION"}
            </div>
            {showCNN ? (
              <>
                <CalcRow eq="Kernel size" result="3 × 3 = 9 params" color={C} />
                <CalcRow eq="2×1 + 1×0 + 0×(−1)" result="2" color={C} />
                <CalcRow eq="3×1 + 2×0 + 1×(−1)" result="2" color={C} />
                <CalcRow eq="4×1 + 3×0 + 2×(−1)" result="2" color={C} />
                <CalcRow eq="Total sum = 2 + 2 + 2" result={convResult.toString()} color={C} />
                <CalcRow eq="This kernel detects" result="vertical edges" color={M.accent} />
              </>
            ) : (
              <>
                <CalcRow eq="Tokens in sequence" result="4" color={C} />
                <CalcRow eq="Attention(Fe, Fe) = 0.9" result="strong self" color={C} />
                <CalcRow eq="Attention(Fe, O) = 0.1" result="weak" color={C} />
                <CalcRow eq="Attention(O, O) = 0.7" result="strong self" color={C} />
                <CalcRow eq="Each row sums to" result="1.0 (softmax)" color={M.accent} />
                <CalcRow eq="Complexity" result="O(n²) in seq length" color={C} />
              </>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="CNN" value="Local" color={C} sub="spatial patterns" />
            <ResultBox label="TRANSFORMER" value="Global" color={C} sub="any-to-any attention" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> CNNs excel at local patterns (crystal structure images,
            electron density maps) by sliding small filters. Transformers excel at long-range relationships
            (atom-atom interactions across a molecule). Modern materials ML often combines both.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 13 — Feature Engineering
   ════════════════════════════════════════════════════════════════ */
function FeatureEngineeringSection() {
  const C = M.mat;
  const [compound, setCompound] = useState(0);

  const compounds = [
    {
      name: "CdTe", a: "Cd", b: "Te",
      Za: 48, Zb: 52, ma: 112.41, mb: 127.60,
      ena: 1.69, enb: 2.10, ra: 1.48, rb: 1.37,
    },
    {
      name: "GaAs", a: "Ga", b: "As",
      Za: 31, Zb: 33, ma: 69.72, mb: 74.92,
      ena: 1.81, enb: 2.18, ra: 1.22, rb: 1.21,
    },
    {
      name: "ZnO", a: "Zn", b: "O",
      Za: 30, Zb: 8, ma: 65.38, mb: 16.00,
      ena: 1.65, enb: 3.44, ra: 1.22, rb: 0.73,
    },
  ];

  const c = compounds[compound];
  const meanEN = (c.ena + c.enb) / 2;
  const diffEN = Math.abs(c.ena - c.enb);
  const meanMass = (c.ma + c.mb) / 2;
  const meanRadius = (c.ra + c.rb) / 2;
  const diffRadius = Math.abs(c.ra - c.rb);
  const meanZ = (c.Za + c.Zb) / 2;

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Feature Engineering" formula="Material → numerical feature vector">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Describing a house with numbers before predicting its price: square footage, number of bedrooms, age, location score.
          Similarly, we describe a material with numbers: atomic mass, electronegativity, radius — so ML can work with it.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {compounds.map((comp, i) => (
              <button key={i} onClick={() => setCompound(i)}
                style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: compound === i ? C : T.surface, color: compound === i ? "#fff" : T.muted,
                  border: `1px solid ${compound === i ? C : T.border}`, fontWeight: 700 }}>{comp.name}</button>
            ))}
          </div>

          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>{c.name} — Elemental Properties</text>
            {/* Element A */}
            <rect x={30} y={30} width={130} height={140} rx={8} fill={C + "10"} stroke={C + "44"} />
            <text x={95} y={50} textAnchor="middle" fontSize={14} fill={C} fontWeight={800}>{c.a}</text>
            <text x={95} y={65} textAnchor="middle" fontSize={9} fill={T.muted}>Z = {c.Za}</text>
            <text x={95} y={80} textAnchor="middle" fontSize={9} fill={T.muted}>Mass = {c.ma}</text>
            <text x={95} y={95} textAnchor="middle" fontSize={9} fill={T.muted}>EN = {c.ena}</text>
            <text x={95} y={110} textAnchor="middle" fontSize={9} fill={T.muted}>r = {c.ra} Å</text>
            {/* Arrow */}
            <text x={170} y={100} fontSize={14} fill={T.dim}>+</text>
            {/* Element B */}
            <rect x={185} y={30} width={130} height={140} rx={8} fill={M.accent + "10"} stroke={M.accent + "44"} />
            <text x={250} y={50} textAnchor="middle" fontSize={14} fill={M.accent} fontWeight={800}>{c.b}</text>
            <text x={250} y={65} textAnchor="middle" fontSize={9} fill={T.muted}>Z = {c.Zb}</text>
            <text x={250} y={80} textAnchor="middle" fontSize={9} fill={T.muted}>Mass = {c.mb}</text>
            <text x={250} y={95} textAnchor="middle" fontSize={9} fill={T.muted}>EN = {c.enb}</text>
            <text x={250} y={110} textAnchor="middle" fontSize={9} fill={T.muted}>r = {c.rb} Å</text>
            {/* Arrow to feature vector */}
            <text x={svgW / 2} y={185} textAnchor="middle" fontSize={9} fill={C} fontWeight={700}>
              → Feature Vector: [{meanEN.toFixed(2)}, {diffEN.toFixed(2)}, {meanMass.toFixed(1)}, {meanRadius.toFixed(2)}, ...]
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>FEATURE CALCULATION</div>
            <CalcRow eq={`Mean EN = (${c.ena} + ${c.enb}) / 2`} result={meanEN.toFixed(3)} color={C} />
            <CalcRow eq={`ΔEN = |${c.ena} − ${c.enb}|`} result={diffEN.toFixed(3)} color={C} />
            <CalcRow eq={`Mean Mass = (${c.ma} + ${c.mb}) / 2`} result={meanMass.toFixed(2)} color={C} />
            <CalcRow eq={`Mean Radius = (${c.ra} + ${c.rb}) / 2`} result={meanRadius.toFixed(3)} color={C} />
            <CalcRow eq={`ΔRadius = |${c.ra} − ${c.rb}|`} result={diffRadius.toFixed(3)} color={C} />
            <CalcRow eq={`Mean Z = (${c.Za} + ${c.Zb}) / 2`} result={meanZ.toFixed(1)} color={C} />
            <CalcRow eq="Total compositional features" result="6" color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="MEAN EN" value={meanEN.toFixed(2)} color={C} sub={c.name} />
            <ResultBox label="ΔEN (ionicity)" value={diffEN.toFixed(2)} color={M.accent} sub="bond character" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The choice of features matters more than the choice of
            algorithm. Good features capture the physics: electronegativity difference tells about bond ionicity,
            mean atomic radius relates to lattice constant. Feature engineering is where domain knowledge meets ML.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 14 — Property Prediction
   ════════════════════════════════════════════════════════════════ */
function PropertyPredictionSection() {
  const C = M.mat;
  const [bias, setBias] = useState(0.0);

  const materials = [
    { name: "Si",   actual: 1.12, base: 1.15 },
    { name: "Ge",   actual: 0.67, base: 0.72 },
    { name: "GaAs", actual: 1.42, base: 1.38 },
    { name: "CdTe", actual: 1.50, base: 1.55 },
    { name: "ZnO",  actual: 3.37, base: 3.25 },
    { name: "InP",  actual: 1.35, base: 1.30 },
    { name: "GaN",  actual: 3.40, base: 3.50 },
    { name: "AlAs", actual: 2.15, base: 2.05 },
  ];

  const predicted = materials.map(m => ({ ...m, pred: m.base + bias }));
  const n = predicted.length;
  const residuals = predicted.map(p => Math.abs(p.actual - p.pred));
  const mae = residuals.reduce((a, v) => a + v, 0) / n;
  const ssRes = predicted.reduce((a, p) => a + (p.actual - p.pred) ** 2, 0);
  const meanActual = predicted.reduce((a, p) => a + p.actual, 0) / n;
  const ssTot = predicted.reduce((a, p) => a + (p.actual - meanActual) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  const svgW = 340, svgH = 200;
  const axMin = 0, axMax = 4;
  const sx = (v) => 40 + (v - axMin) / (axMax - axMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - axMin) / (axMax - axMin) * (svgH - 50);

  return (
    <Card color={C} title="Bandgap Prediction" formula="MAE = Σ|pred − actual| / N">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Showing a student 8 solved examples and then asking them to predict the 9th. The closer their answers
          match the actual values, the better they have learned the concept. The parity plot shows predicted vs actual.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Parity Plot: Predicted vs Actual Bandgap</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={9} fill={T.muted}>Actual (eV)</text>
            <text x={10} y={svgH / 2} fontSize={9} fill={T.muted} transform={`rotate(-90,10,${svgH / 2})`}>Predicted (eV)</text>
            {/* Perfect line */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(4)} y2={sy(4)} stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />
            {/* Data points */}
            {predicted.map((p, i) => (
              <g key={i}>
                <circle cx={sx(p.actual)} cy={sy(p.pred)} r={5} fill={C + "44"} stroke={C} strokeWidth={1.5} />
                <text x={sx(p.actual) + 7} y={sy(p.pred) - 4} fontSize={7} fill={C} fontWeight={600}>{p.name}</text>
              </g>
            ))}
            {/* Axis ticks */}
            {[0, 1, 2, 3, 4].map(v => (
              <g key={v}>
                <text x={sx(v)} y={svgH - 18} textAnchor="middle" fontSize={8} fill={T.dim}>{v}</text>
                <text x={34} y={sy(v) + 3} textAnchor="end" fontSize={8} fill={T.dim}>{v}</text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Model Bias Adjustment (eV)" value={bias} min={-0.5} max={0.5} step={0.01}
            onChange={setBias} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
            {predicted.slice(0, 4).map((p, i) => (
              <CalcRow key={i} eq={`|${p.pred.toFixed(2)} − ${p.actual.toFixed(2)}|`}
                result={residuals[i].toFixed(3) + " eV"} color={C} />
            ))}
            <CalcRow eq={`MAE = Σ|residuals| / ${n}`} result={mae.toFixed(3) + " eV"} color={C} />
            <CalcRow eq={`SS_res = Σ(actual − pred)²`} result={ssRes.toFixed(4)} color={C} />
            <CalcRow eq={`SS_tot = Σ(actual − mean)²`} result={ssTot.toFixed(4)} color={C} />
            <CalcRow eq={`R² = 1 − ${ssRes.toFixed(4)} / ${ssTot.toFixed(4)}`} result={r2.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="MAE" value={mae.toFixed(3) + " eV"} color={C} />
            <ResultBox label="R²" value={r2.toFixed(3)} color={M.accent} sub="1.0 = perfect" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Points on the diagonal mean perfect predictions.
            MAE tells you the average error in eV. R² near 1 means the model explains most of the variance.
            Materials science ML typically achieves MAE of 0.1–0.3 eV for bandgap prediction.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 15 — Generative Models (VAE)
   ════════════════════════════════════════════════════════════════ */
function GenerativeModelsSection() {
  const C = M.mat;
  const [latentX, setLatentX] = useState(0.0);
  const [latentY, setLatentY] = useState(0.0);

  const knownMaterials = [
    { name: "CdTe", lx: -1.2, ly: 0.8, bg: 1.50 },
    { name: "GaAs", lx: -0.5, ly: -0.3, bg: 1.42 },
    { name: "Si",   lx: 0.3, ly: -1.0, bg: 1.12 },
    { name: "ZnO",  lx: 1.5, ly: 1.2, bg: 3.37 },
    { name: "GaN",  lx: 1.8, ly: 0.5, bg: 3.40 },
    { name: "InP",  lx: -0.8, ly: -0.8, bg: 1.35 },
  ];

  const nearestIdx = knownMaterials.reduce((best, m, i) => {
    const d = Math.sqrt((m.lx - latentX) ** 2 + (m.ly - latentY) ** 2);
    return d < best.d ? { d, i } : best;
  }, { d: Infinity, i: 0 });

  const nearest = knownMaterials[nearestIdx.i];
  const interpBG = knownMaterials.reduce((sum, m) => {
    const d = Math.max(0.1, Math.sqrt((m.lx - latentX) ** 2 + (m.ly - latentY) ** 2));
    return { wSum: sum.wSum + m.bg / d, wTot: sum.wTot + 1 / d };
  }, { wSum: 0, wTot: 0 });
  const decodedBG = interpBG.wSum / interpBG.wTot;

  const svgW = 340, svgH = 200;
  const sx = (v) => svgW / 2 + v * 60;
  const sy = (v) => svgH / 2 - v * 55;

  return (
    <Card color={C} title="Generative Models (VAE)" formula="Encoder → Latent z → Decoder">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A recipe generator: compress known recipes into a "flavor space" (latent space), then explore new points in that
          space to generate novel recipes. The VAE does the same — encodes materials into a compact representation,
          then decodes new points back into material compositions.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>2D Latent Space</text>
            {/* Axes */}
            <line x1={20} y1={svgH / 2} x2={svgW - 10} y2={svgH / 2} stroke={T.border} strokeDasharray="3,3" />
            <line x1={svgW / 2} y1={20} x2={svgW / 2} y2={svgH - 15} stroke={T.border} strokeDasharray="3,3" />
            <text x={svgW - 10} y={svgH / 2 - 5} textAnchor="end" fontSize={8} fill={T.dim}>z₁</text>
            <text x={svgW / 2 + 5} y={25} fontSize={8} fill={T.dim}>z₂</text>
            {/* Known materials */}
            {knownMaterials.map((m, i) => (
              <g key={i}>
                <circle cx={sx(m.lx)} cy={sy(m.ly)} r={6} fill={C + "33"} stroke={C} strokeWidth={1.5} />
                <text x={sx(m.lx)} y={sy(m.ly) - 9} textAnchor="middle" fontSize={8} fill={C} fontWeight={600}>{m.name}</text>
              </g>
            ))}
            {/* Current point */}
            <circle cx={sx(latentX)} cy={sy(latentY)} r={7} fill="#dc262644" stroke="#dc2626" strokeWidth={2} />
            <text x={sx(latentX)} y={sy(latentY) - 10} textAnchor="middle" fontSize={8} fill="#dc2626" fontWeight={700}>
              ? ({decodedBG.toFixed(2)} eV)
            </text>
            {/* Line to nearest */}
            <line x1={sx(latentX)} y1={sy(latentY)} x2={sx(nearest.lx)} y2={sy(nearest.ly)}
              stroke="#dc262644" strokeWidth={1} strokeDasharray="3,3" />
          </svg>

          {/* Pipeline */}
          <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center", justifyContent: "center" }}>
            {["Material", "→ Encoder →", "Latent z", "→ Decoder →", "New Material"].map((step, i) => (
              <div key={i} style={{
                padding: "4px 8px", fontSize: 9, borderRadius: 4, fontWeight: i % 2 === 0 ? 700 : 400,
                background: i % 2 === 0 ? C + "15" : "transparent",
                color: i % 2 === 0 ? C : T.muted,
                border: i % 2 === 0 ? `1px solid ${C}33` : "none",
              }}>{step}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Latent z₁" value={latentX} min={-2} max={2} step={0.1} onChange={setLatentX} color={C} />
          <SliderRow label="Latent z₂" value={latentY} min={-2} max={2} step={0.1} onChange={setLatentY} color="#dc2626" />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>DECODE CALCULATION</div>
            <CalcRow eq={`Query point z = (${latentX.toFixed(1)}, ${latentY.toFixed(1)})`} result="decode..." color={C} />
            <CalcRow eq={`Nearest known: ${nearest.name}`} result={`d = ${nearestIdx.d.toFixed(2)}`} color={C} />
            {knownMaterials.slice(0, 3).map((m, i) => {
              const d = Math.max(0.1, Math.sqrt((m.lx - latentX) ** 2 + (m.ly - latentY) ** 2));
              return <CalcRow key={i} eq={`w(${m.name}) = 1/d = 1/${d.toFixed(2)}`} result={(1 / d).toFixed(3)} color={C} />;
            })}
            <CalcRow eq="Decoded bandgap (weighted avg)" result={decodedBG.toFixed(3) + " eV"} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="DECODED Eg" value={decodedBG.toFixed(2) + " eV"} color={C} />
            <ResultBox label="NEAREST" value={nearest.name} color={M.accent} sub={`d = ${nearestIdx.d.toFixed(2)}`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The latent space organizes materials by similarity.
            Nearby points have similar properties. By exploring empty regions between known materials, we can propose
            novel compositions with target properties — this is inverse materials design.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 16 — Active Learning
   ════════════════════════════════════════════════════════════════ */
function ActiveLearningSection() {
  const C = M.mat;
  const [known, setKnown] = useState([
    { x: 0.1, y: -0.5 },
    { x: 0.5, y: 0.2 },
    { x: 0.9, y: 1.5 },
  ]);

  const trueF = (x) => 3 * x * x - 2 * x - 0.5;

  const predict = (xq) => {
    let wSum = 0, wTot = 0;
    known.forEach(p => {
      const d = Math.max(0.05, Math.abs(xq - p.x));
      const w = 1 / (d * d);
      wSum += w * p.y;
      wTot += w;
    });
    return wSum / wTot;
  };

  const uncertainty = (xq) => {
    const minDist = Math.min(...known.map(p => Math.abs(xq - p.x)));
    return minDist * 2;
  };

  const candidates = Array.from({ length: 20 }, (_, i) => {
    const x = i / 19;
    return { x, acq: uncertainty(x) };
  });
  const bestCandidate = candidates.reduce((best, c) => c.acq > best.acq ? c : best, candidates[0]);

  const addPoint = () => {
    const x = bestCandidate.x;
    const y = trueF(x) + (seededRandom(known.length * 7 + 3)() - 0.5) * 0.3;
    setKnown(prev => [...prev, { x, y }]);
  };

  const resetPoints = () => {
    setKnown([
      { x: 0.1, y: -0.5 },
      { x: 0.5, y: 0.2 },
      { x: 0.9, y: 1.5 },
    ]);
  };

  const svgW = 340, svgH = 200;
  const xMin = 0, xMax = 1, yMin = -1.5, yMax = 2.5;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  return (
    <Card color={C} title="Active Learning" formula="Next = argmax uncertainty(x)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A chef strategically tasting combinations instead of trying all 1000 possibilities. Instead of random experiments,
          active learning picks the most informative experiment next — where the model is most uncertain.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Active Learning: {known.length} known points</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={20} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={9} fill={T.muted}>Composition x</text>
            {/* True function */}
            {Array.from({ length: 50 }, (_, i) => {
              const x1 = i / 49;
              const x2 = (i + 1) / 49;
              return <line key={`t${i}`} x1={sx(x1)} y1={sy(trueF(x1))} x2={sx(x2)} y2={sy(trueF(x2))} stroke={T.dim} strokeWidth={1} strokeDasharray="3,3" />;
            })}
            {/* Prediction + uncertainty band */}
            {Array.from({ length: 50 }, (_, i) => {
              const xv = i / 49;
              const pred = predict(xv);
              const unc = uncertainty(xv);
              return (
                <g key={`p${i}`}>
                  <line x1={sx(xv)} y1={sy(pred - unc)} x2={sx(xv)} y2={sy(pred + unc)}
                    stroke={C} strokeWidth={1} opacity={0.15} />
                </g>
              );
            })}
            {Array.from({ length: 49 }, (_, i) => {
              const x1 = i / 49, x2 = (i + 1) / 49;
              return <line key={`pr${i}`} x1={sx(x1)} y1={sy(predict(x1))} x2={sx(x2)} y2={sy(predict(x2))} stroke={C} strokeWidth={2} />;
            })}
            {/* Known points */}
            {known.map((p, i) => (
              <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={5} fill={C + "44"} stroke={C} strokeWidth={2} />
            ))}
            {/* Suggested next point */}
            <circle cx={sx(bestCandidate.x)} cy={sy(predict(bestCandidate.x))} r={6}
              fill="#dc262644" stroke="#dc2626" strokeWidth={2} />
            <text x={sx(bestCandidate.x)} y={sy(predict(bestCandidate.x)) - 10}
              textAnchor="middle" fontSize={8} fill="#dc2626" fontWeight={700}>Next?</text>
          </svg>

          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={addPoint}
              style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                background: C, color: "#fff", border: "none", fontWeight: 700 }}>
              Add Suggested Point
            </button>
            <button onClick={resetPoints}
              style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}>
              Reset
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ACQUISITION FUNCTION</div>
            <CalcRow eq="Known data points" result={known.length.toString()} color={C} />
            <CalcRow eq={`Suggested x = ${bestCandidate.x.toFixed(2)}`} result={`unc = ${bestCandidate.acq.toFixed(3)}`} color="#dc2626" />
            <CalcRow eq={`Min distance to known`} result={(bestCandidate.acq / 2).toFixed(3)} color={C} />
            <CalcRow eq={`Predicted y at x = ${bestCandidate.x.toFixed(2)}`} result={predict(bestCandidate.x).toFixed(3)} color={C} />
            <CalcRow eq={`True y at x = ${bestCandidate.x.toFixed(2)}`} result={trueF(bestCandidate.x).toFixed(3)} color={T.muted} />
            <CalcRow eq="Strategy" result="Max uncertainty" color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="KNOWN POINTS" value={known.length.toString()} color={C} />
            <ResultBox label="NEXT x" value={bestCandidate.x.toFixed(2)} color="#dc2626" sub="highest uncertainty" />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Active learning reduces the number of expensive experiments
            (DFT calculations, lab synthesis) needed. Instead of 1000 random experiments, you might only need 50 well-chosen
            ones. The uncertainty band shows where the model is least confident — that is where new data helps most.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 17 — Data Pipeline
   ════════════════════════════════════════════════════════════════ */
function DataPipelineSection() {
  const C = M.prac;
  const [stage, setStage] = useState(0);

  const stages = [
    { name: "Database", desc: "Raw data from Materials Project, AFLOW, or experiments", count: 1000, features: "—", icon: "DB" },
    { name: "Clean", desc: "Remove duplicates, fix missing values, filter outliers", count: 950, features: "—", icon: "CL" },
    { name: "Featurize", desc: "Convert compositions to numerical features", count: 950, features: "12 features", icon: "FE" },
    { name: "Split", desc: "80% train / 20% test, stratified by property range", count: "760 / 190", features: "12", icon: "SP" },
    { name: "Train", desc: "Fit model on training set, tune hyperparameters", count: 760, features: "model fit", icon: "TR" },
    { name: "Evaluate", desc: "Test on held-out data, compute MAE, R², etc.", count: 190, features: "metrics", icon: "EV" },
  ];

  const cur = stages[stage];
  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="ML Data Pipeline" formula="Data → Clean → Feature → Split → Train → Evaluate">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Cooking: shopping for ingredients (database) → washing and cleaning (clean) → chopping and measuring
          (featurize) → setting aside a taste test portion (split) → cooking (train) → tasting (evaluate).
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Pipeline Flow</text>
            {stages.map((s, i) => {
              const x = 20 + (i % 3) * 105;
              const y = i < 3 ? 30 : 110;
              const active = i === stage;
              return (
                <g key={i} onClick={() => setStage(i)} style={{ cursor: "pointer" }}>
                  <rect x={x} y={y} width={95} height={55} rx={8}
                    fill={active ? C + "22" : T.panel} stroke={active ? C : T.border} strokeWidth={active ? 2 : 1} />
                  <text x={x + 47} y={y + 20} textAnchor="middle" fontSize={10} fill={active ? C : T.muted} fontWeight={700}>
                    {s.icon}
                  </text>
                  <text x={x + 47} y={y + 35} textAnchor="middle" fontSize={8} fill={T.muted}>{s.name}</text>
                  <text x={x + 47} y={y + 47} textAnchor="middle" fontSize={8} fill={active ? C : T.dim}>
                    n={typeof s.count === "string" ? s.count : s.count}
                  </text>
                  {/* Arrow to next */}
                  {i < stages.length - 1 && i !== 2 && (
                    <text x={x + 100} y={y + 28} fontSize={12} fill={T.dim}>→</text>
                  )}
                </g>
              );
            })}
            {/* Arrow from row 1 to row 2 */}
            <path d="M 270 85 L 270 100 L 67 100 L 67 110" fill="none" stroke={T.dim} strokeWidth={1} markerEnd="url(#pipeArrow)" />
            <defs>
              <marker id="pipeArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                <path d="M0,0 L6,2 L0,4" fill={T.dim} />
              </marker>
            </defs>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Pipeline Stage" value={stage} min={0} max={5} step={1}
            onChange={setStage} color={C} format={v => stages[v].name} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STAGE: {cur.name.toUpperCase()}</div>
            <div style={{ fontSize: 11, color: T.ink, marginBottom: 8, lineHeight: 1.7 }}>{cur.desc}</div>
            <CalcRow eq="Start: raw entries" result="1000" color={C} />
            <CalcRow eq="After cleaning (−5%)" result="950" color={C} />
            <CalcRow eq="Features generated" result="12 per sample" color={C} />
            <CalcRow eq="Train split (80%): 950 × 0.8" result="760" color={C} />
            <CalcRow eq="Test split (20%): 950 × 0.2" result="190" color={C} />
            <CalcRow eq="Feature matrix shape (train)" result="760 × 12" color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="CURRENT STAGE" value={cur.name} color={C} />
            <ResultBox label="DATA SIZE" value={typeof cur.count === "string" ? cur.count : cur.count.toString()} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Data quality matters more than model complexity. Garbage in = garbage out.
            The train/test split must be done before any feature engineering on the test set to prevent data leakage.
            Always evaluate on data the model has never seen during training.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 18 — Hyperparameter Tuning
   ════════════════════════════════════════════════════════════════ */
function HyperparamSection() {
  const C = M.prac;
  const [lrIdx, setLrIdx] = useState(1);
  const [hsIdx, setHsIdx] = useState(1);

  const lrValues = [0.001, 0.01, 0.1, 1.0];
  const hsValues = [8, 16, 32, 64];

  const errorGrid = useMemo(() => {
    const rng = seededRandom(99);
    return lrValues.map((lr, i) => hsValues.map((hs, j) => {
      const base = 0.15 + Math.abs(i - 1.5) * 0.12 + Math.abs(j - 2) * 0.08;
      return Math.max(0.05, base + (rng() - 0.5) * 0.06);
    }));
  }, []);

  const currentError = errorGrid[lrIdx][hsIdx];
  const minError = Math.min(...errorGrid.flat());
  const bestPos = (() => {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      if (errorGrid[i][j] === minError) return { i, j };
    }
    return { i: 0, j: 0 };
  })();

  const svgW = 340, svgH = 200;

  return (
    <Card color={C} title="Hyperparameter Tuning" formula="Grid Search: try all (lr, hidden_size) pairs">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Tuning a guitar — each string needs the right tension. Too loose or too tight and it sounds wrong.
          Hyperparameters are the "tuning knobs" of your ML model. Grid search tries every combination systematically.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>Validation Error Heatmap</text>
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={9} fill={T.muted}>Hidden Size</text>
            <text x={10} y={svgH / 2} fontSize={9} fill={T.muted} transform={`rotate(-90,10,${svgH / 2})`}>Learning Rate</text>
            {/* Heatmap cells */}
            {errorGrid.map((row, i) => row.map((err, j) => {
              const cellW = 65;
              const cellH = 35;
              const x = 55 + j * cellW;
              const y = 25 + i * cellH;
              const maxErr = Math.max(...errorGrid.flat());
              const norm = (err - minError) / (maxErr - minError);
              const r = Math.floor(220 * norm + 30);
              const g = Math.floor(220 * (1 - norm) + 30);
              const isBest = i === bestPos.i && j === bestPos.j;
              const isCurrent = i === lrIdx && j === hsIdx;
              return (
                <g key={`${i}${j}`} onClick={() => { setLrIdx(i); setHsIdx(j); }} style={{ cursor: "pointer" }}>
                  <rect x={x} y={y} width={cellW - 4} height={cellH - 4} rx={4}
                    fill={`rgb(${r},${g},80)`} opacity={0.7}
                    stroke={isCurrent ? "#fff" : isBest ? M.accent : "transparent"} strokeWidth={isCurrent ? 3 : isBest ? 2 : 0} />
                  <text x={x + cellW / 2 - 2} y={y + cellH / 2 + 1} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>
                    {err.toFixed(3)}
                  </text>
                </g>
              );
            }))}
            {/* Column labels */}
            {hsValues.map((h, j) => (
              <text key={j} x={55 + j * 65 + 30} y={svgH - 18} textAnchor="middle" fontSize={8} fill={T.dim}>{h}</text>
            ))}
            {/* Row labels */}
            {lrValues.map((lr, i) => (
              <text key={i} x={50} y={25 + i * 35 + 20} textAnchor="end" fontSize={8} fill={T.dim}>{lr}</text>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Learning Rate" value={lrIdx} min={0} max={3} step={1}
            onChange={setLrIdx} color={C} format={v => lrValues[v].toString()} />
          <SliderRow label="Hidden Size" value={hsIdx} min={0} max={3} step={1}
            onChange={setHsIdx} color={C} format={v => hsValues[v].toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>GRID SEARCH CALCULATION</div>
            <CalcRow eq="Learning rates tried" result="4 values" color={C} />
            <CalcRow eq="Hidden sizes tried" result="4 values" color={C} />
            <CalcRow eq="Total combinations = 4 × 4" result="16" color={C} />
            <CalcRow eq={`Current: lr=${lrValues[lrIdx]}, h=${hsValues[hsIdx]}`} result={`err = ${currentError.toFixed(3)}`} color={C} />
            <CalcRow eq={`Best: lr=${lrValues[bestPos.i]}, h=${hsValues[bestPos.j]}`} result={`err = ${minError.toFixed(3)}`} color={M.accent} />
            <CalcRow eq={`Current vs Best`} result={`${((currentError - minError) / minError * 100).toFixed(1)}% worse`} color="#dc2626" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="CURRENT ERROR" value={currentError.toFixed(3)} color={C} />
            <ResultBox label="BEST ERROR" value={minError.toFixed(3)} color={M.accent} sub={`lr=${lrValues[bestPos.i]}, h=${hsValues[bestPos.j]}`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Hyperparameters are NOT learned during training — you choose
            them before training starts. Grid search is simple but expensive (16 full trainings here). Random search or
            Bayesian optimization can find good hyperparameters faster with fewer trials.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 19 — Interpretability (SHAP)
   ════════════════════════════════════════════════════════════════ */
function InterpretabilitySection() {
  const C = M.prac;
  const [material, setMaterial] = useState(0);

  const materials = [
    { name: "CdTe", base: 2.0, features: [
      { name: "ΔEN", value: 0.41, shap: 0.35 },
      { name: "Mean Radius", value: 1.43, shap: -0.25 },
      { name: "Mean Mass", value: 120.0, shap: -0.10 },
      { name: "Mean Z", value: 50, shap: -0.05 },
      { name: "Δ Radius", value: 0.11, shap: 0.15 },
    ]},
    { name: "GaN", base: 2.0, features: [
      { name: "ΔEN", value: 1.13, shap: 0.85 },
      { name: "Mean Radius", value: 0.98, shap: 0.40 },
      { name: "Mean Mass", value: 41.87, shap: 0.10 },
      { name: "Mean Z", value: 21, shap: 0.08 },
      { name: "Δ Radius", value: 0.49, shap: -0.03 },
    ]},
    { name: "Si", base: 2.0, features: [
      { name: "ΔEN", value: 0.0, shap: -0.55 },
      { name: "Mean Radius", value: 1.17, shap: -0.15 },
      { name: "Mean Mass", value: 28.09, shap: -0.10 },
      { name: "Mean Z", value: 14, shap: -0.05 },
      { name: "Δ Radius", value: 0.0, shap: -0.03 },
    ]},
  ];

  const m = materials[material];
  const totalShap = m.features.reduce((s, f) => s + f.shap, 0);
  const prediction = m.base + totalShap;

  const svgW = 340, svgH = 200;
  const centerX = svgW / 2;

  return (
    <Card color={C} title="Interpretability (SHAP)" formula="Prediction = Base + Σ SHAP values">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A doctor explaining why they recommend a treatment: "Your age adds risk (+), but your fitness reduces it (−),
          and your family history adds more (+). Overall score: moderate risk." SHAP does the same for ML predictions.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {materials.map((mat, i) => (
              <button key={i} onClick={() => setMaterial(i)}
                style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: material === i ? C : T.surface, color: material === i ? "#fff" : T.muted,
                  border: `1px solid ${material === i ? C : T.border}`, fontWeight: 700 }}>{mat.name}</button>
            ))}
          </div>

          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={10} fill={T.muted} fontWeight={700}>SHAP Waterfall — {m.name}</text>
            {/* Base value line */}
            <line x1={centerX} y1={25} x2={centerX} y2={svgH - 25} stroke={T.border} strokeDasharray="3,3" />
            <text x={centerX} y={34} textAnchor="middle" fontSize={8} fill={T.dim}>Base = {m.base.toFixed(1)} eV</text>
            {/* Waterfall bars */}
            {(() => {
              let running = m.base;
              const barScale = 80;
              return m.features.map((f, i) => {
                const startX = centerX + running * barScale / 2 - m.base * barScale / 2;
                const barW = Math.abs(f.shap) * barScale;
                const isPos = f.shap > 0;
                const y = 42 + i * 28;
                const bx = isPos ? startX : startX - barW;
                running += f.shap;
                return (
                  <g key={i}>
                    <rect x={centerX + (running - f.shap - m.base) * barScale / 2} y={y}
                      width={barW} height={18} rx={3}
                      fill={isPos ? "#dc262633" : "#05966933"} stroke={isPos ? "#dc2626" : "#059669"} strokeWidth={1} />
                    <text x={25} y={y + 12} fontSize={8} fill={T.muted}>{f.name}</text>
                    <text x={svgW - 10} y={y + 12} textAnchor="end" fontSize={8}
                      fill={isPos ? "#dc2626" : "#059669"} fontWeight={700}>
                      {isPos ? "+" : ""}{f.shap.toFixed(2)}
                    </text>
                  </g>
                );
              });
            })()}
            {/* Final prediction */}
            <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fontSize={10} fill={C} fontWeight={800}>
              Prediction: {prediction.toFixed(2)} eV
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>SHAP DECOMPOSITION</div>
            <CalcRow eq={`Base value (population mean)`} result={m.base.toFixed(2) + " eV"} color={C} />
            {m.features.map((f, i) => (
              <CalcRow key={i}
                eq={`+ ${f.name} (${f.value}) → SHAP`}
                result={`${f.shap > 0 ? "+" : ""}${f.shap.toFixed(2)} eV`}
                color={f.shap > 0 ? "#dc2626" : "#059669"} />
            ))}
            <CalcRow eq={`Total SHAP sum`} result={`${totalShap > 0 ? "+" : ""}${totalShap.toFixed(2)} eV`} color={C} />
            <CalcRow eq={`Prediction = ${m.base.toFixed(1)} + ${totalShap.toFixed(2)}`} result={prediction.toFixed(2) + " eV"} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="PREDICTION" value={prediction.toFixed(2) + " eV"} color={C} sub={m.name} />
            <ResultBox label="TOP FEATURE" value={m.features.sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap))[0].name}
              color={M.accent} sub={`SHAP = ${m.features[0].shap.toFixed(2)}`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> SHAP values explain how much each feature pushed the
            prediction up or down from the average. Positive SHAP = increases prediction. This is critical in materials
            science: it tells you which physical properties drive the prediction, not just the final number.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 20 — ML Summary & Comparison
   ════════════════════════════════════════════════════════════════ */
function MLSummarySection() {
  const C = M.prac;
  const [compareA, setCompareA] = useState(0);
  const [compareB, setCompareB] = useState(3);

  const methods = [
    { name: "Linear Regression", type: "Supervised", interp: "High", data: "Small", speed: "Fast", best: "Simple trends", color: M.found },
    { name: "Decision Tree", type: "Supervised", interp: "High", data: "Small", speed: "Fast", best: "Classification", color: M.algo },
    { name: "Random Forest", type: "Supervised", interp: "Medium", data: "Medium", speed: "Medium", best: "General ML", color: M.algo },
    { name: "SVM", type: "Supervised", interp: "Low", data: "Small", speed: "Medium", best: "Small data classify", color: M.algo },
    { name: "PCA", type: "Unsupervised", interp: "High", data: "Any", speed: "Fast", best: "Dim. reduction", color: M.algo },
    { name: "Neural Network", type: "Supervised", interp: "Low", data: "Large", speed: "Slow", best: "Complex patterns", color: M.nn },
    { name: "CNN", type: "Supervised", interp: "Low", data: "Large", speed: "Slow", best: "Images/structure", color: M.nn },
    { name: "Transformer", type: "Supervised", interp: "Low", data: "Very Large", speed: "Slow", best: "Sequences/text", color: M.nn },
    { name: "VAE", type: "Generative", interp: "Low", data: "Large", speed: "Slow", best: "Design new materials", color: M.mat },
    { name: "Active Learning", type: "Hybrid", interp: "Medium", data: "Small start", speed: "Iterative", best: "Expensive exps", color: M.mat },
  ];

  const mA = methods[compareA];
  const mB = methods[compareB];

  return (
    <Card color={C} title="ML Methods Comparison" formula="Choose the right tool for the job">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A toolbox: you do not use a sledgehammer to hang a picture frame. Similarly, you do not need a billion-parameter
          neural network when 100 data points and linear regression will do. Choose the simplest method that works.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 350px" }}>
          {/* Comparison table */}
          <div style={{ background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 60px 55px 55px 55px", fontSize: 8, fontWeight: 700, color: T.muted,
              padding: "6px 8px", background: T.panel, borderBottom: `1px solid ${T.border}`, letterSpacing: 1 }}>
              <span>METHOD</span><span>TYPE</span><span>INTERP</span><span>DATA</span><span>SPEED</span>
            </div>
            {methods.map((m, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "110px 60px 55px 55px 55px", fontSize: 9, padding: "4px 8px",
                borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                background: (i === compareA || i === compareB) ? C + "08" : "transparent",
              }} onClick={() => compareA === i ? setCompareB(i) : setCompareA(i)}>
                <span style={{ fontWeight: 600, color: m.color }}>{m.name}</span>
                <span style={{ color: T.muted }}>{m.type}</span>
                <span style={{ color: m.interp === "High" ? "#059669" : m.interp === "Medium" ? M.accent : "#dc2626" }}>{m.interp}</span>
                <span style={{ color: T.muted }}>{m.data}</span>
                <span style={{ color: T.muted }}>{m.speed}</span>
              </div>
            ))}
          </div>

          {/* Decision guide */}
          <div style={{ marginTop: 8, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.muted, marginBottom: 4, letterSpacing: 2 }}>QUICK GUIDE</div>
            <div style={{ fontSize: 10, color: T.ink, lineHeight: 1.8 }}>
              <div>• <strong>{'< 100'} data points:</strong> Linear Reg, Decision Tree, SVM</div>
              <div>• <strong>100–1000 points:</strong> Random Forest, GP</div>
              <div>• <strong>{'> 1000'} points:</strong> Neural Networks</div>
              <div>• <strong>Need explanations:</strong> Linear Reg, Decision Tree + SHAP</div>
              <div>• <strong>Design new materials:</strong> VAE, Active Learning</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Compare Method A" value={compareA} min={0} max={9} step={1}
            onChange={setCompareA} color={C} format={v => methods[v].name} />
          <SliderRow label="Compare Method B" value={compareB} min={0} max={9} step={1}
            onChange={setCompareB} color={M.accent} format={v => methods[v].name} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>COMPARISON</div>
            <CalcRow eq={`${mA.name} — Type`} result={mA.type} color={mA.color} />
            <CalcRow eq={`${mA.name} — Interpretability`} result={mA.interp} color={mA.color} />
            <CalcRow eq={`${mA.name} — Data needed`} result={mA.data} color={mA.color} />
            <CalcRow eq={`${mB.name} — Type`} result={mB.type} color={mB.color} />
            <CalcRow eq={`${mB.name} — Interpretability`} result={mB.interp} color={mB.color} />
            <CalcRow eq={`${mB.name} — Data needed`} result={mB.data} color={mB.color} />
            <CalcRow eq="Total methods covered" result="10" color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label={mA.name} value={mA.best} color={mA.color} sub={`${mA.data} data, ${mA.speed}`} />
            <ResultBox label={mB.name} value={mB.best} color={mB.color} sub={`${mB.data} data, ${mB.speed}`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.8,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Start simple. Linear regression with good features often
            beats a neural network with bad features. The most important decisions in ML are: (1) what data to collect,
            (2) what features to compute, (3) how to validate. The model choice is often the least important decision.
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION DEFINITIONS & NAVIGATION
   ════════════════════════════════════════════════════════════════ */
const ML_SECTIONS = [
  { id: "whatisml", block: "foundations", title: "What Is ML?", component: WhatIsMLSection,
    nextReason: "Now that you know the three types, let's see linear regression — the simplest supervised model." },
  { id: "linreg", block: "foundations", title: "Linear Regression", component: LinearRegressionSection,
    nextReason: "Simple models work well, but what happens when we make them too complex? Let's explore overfitting." },
  { id: "overfitting", block: "foundations", title: "Overfitting", component: OverfittingSection,
    nextReason: "To detect overfitting reliably, we need cross-validation — a robust evaluation strategy." },
  { id: "crossval", block: "foundations", title: "Cross-Validation", component: CrossValidationSection,
    nextReason: "With evaluation tools in hand, let's learn powerful algorithms — starting with decision trees." },

  { id: "dtree", block: "algorithms", title: "Decision Trees", component: DecisionTreeSection,
    nextReason: "Single trees overfit easily. Random forests fix this by combining many trees — let's see how." },
  { id: "rforest", block: "algorithms", title: "Random Forest", component: RandomForestSection,
    nextReason: "Another powerful classifier is SVM, which finds the widest possible separation margin." },
  { id: "svm", block: "algorithms", title: "SVM", component: SVMSection,
    nextReason: "With many features, we need dimensionality reduction. PCA finds the most important directions." },
  { id: "pca", block: "algorithms", title: "PCA", component: PCASection,
    nextReason: "Now let's go deeper — neural networks can learn any function. Starting with a single neuron." },

  { id: "perceptron", block: "neuralnet", title: "Perceptron", component: PerceptronSection,
    nextReason: "One neuron is limited. Stacking layers into deep networks unlocks immense power." },
  { id: "dnn", block: "neuralnet", title: "Deep Networks", component: DNNSection,
    nextReason: "But how do deep networks learn? Through backpropagation — the engine of modern ML." },
  { id: "backprop", block: "neuralnet", title: "Backpropagation", component: BackpropSection,
    nextReason: "Beyond feedforward nets, CNNs and Transformers handle images and sequences." },
  { id: "cnntransformer", block: "neuralnet", title: "CNN & Transformer", component: CNNTransformerSection,
    nextReason: "Now let's apply all this to materials science — starting with how we represent materials as features." },

  { id: "features", block: "matsci", title: "Feature Engineering", component: FeatureEngineeringSection,
    nextReason: "With features defined, let's train a model to predict bandgaps from composition." },
  { id: "prediction", block: "matsci", title: "Property Prediction", component: PropertyPredictionSection,
    nextReason: "Beyond prediction, generative models can design entirely new materials." },
  { id: "generative", block: "matsci", title: "Generative Models", component: GenerativeModelsSection,
    nextReason: "Active learning optimizes expensive experiments — let's see Bayesian optimization in action." },
  { id: "activelearn", block: "matsci", title: "Active Learning", component: ActiveLearningSection,
    nextReason: "Let's tie it all together with practical workflow guidance." },

  { id: "pipeline", block: "practical", title: "Data Pipeline", component: DataPipelineSection,
    nextReason: "The pipeline is set — now we need to tune hyperparameters for best performance." },
  { id: "hyperparam", block: "practical", title: "Hyperparameters", component: HyperparamSection,
    nextReason: "A good model isn't enough — we need to explain its decisions. Enter SHAP." },
  { id: "interpret", block: "practical", title: "Interpretability", component: InterpretabilitySection,
    nextReason: "Finally, let's compare all methods and build a decision framework for choosing the right tool." },
  { id: "summary", block: "practical", title: "ML Summary", component: MLSummarySection,
    nextReason: "You've completed the full ML for Materials Science journey!" },
];

/* ════════════════════════════════════════════════════════════════
   MAIN MODULE SHELL
   ════════════════════════════════════════════════════════════════ */
function MLIntroModule() {
  const [activeBlock, setActiveBlock] = useState("foundations");
  const [activeSection, setActiveSection] = useState(0);

  const blockSections = ML_SECTIONS.filter(s => s.block === activeBlock);
  const allIdx = ML_SECTIONS.findIndex(s => s.id === blockSections[activeSection]?.id);
  const CurrentComponent = blockSections[activeSection]?.component;

  const goTo = (globalIdx) => {
    const sec = ML_SECTIONS[globalIdx];
    if (!sec) return;
    setActiveBlock(sec.block);
    const localIdx = ML_SECTIONS.filter(s => s.block === sec.block).findIndex(s => s.id === sec.id);
    setActiveSection(localIdx);
  };

  const handlePrev = () => { if (allIdx > 0) goTo(allIdx - 1); };
  const handleNext = () => { if (allIdx < ML_SECTIONS.length - 1) goTo(allIdx + 1); };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 4px", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: T.bg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: 1 }}>
          Introduction to Machine Learning
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>for Materials Science</div>
      </div>

      {/* Block tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, overflowX: "auto", padding: "0 2px" }}>
        {ML_BLOCKS.map(b => (
          <button key={b.id} onClick={() => { setActiveBlock(b.id); setActiveSection(0); }}
            style={{
              padding: "6px 12px", fontSize: 10, borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
              background: activeBlock === b.id ? b.color + "18" : T.panel,
              color: activeBlock === b.id ? b.color : T.muted,
              border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
              fontWeight: activeBlock === b.id ? 700 : 500,
            }}>{b.label}</button>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 14, overflowX: "auto", padding: "0 2px" }}>
        {blockSections.map((s, i) => {
          const blockColor = ML_BLOCKS.find(b => b.id === activeBlock)?.color || T.eo_e;
          return (
            <button key={s.id} onClick={() => setActiveSection(i)}
              style={{
                padding: "4px 10px", fontSize: 9, borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
                background: activeSection === i ? blockColor : "transparent",
                color: activeSection === i ? "#fff" : T.muted,
                border: `1px solid ${activeSection === i ? blockColor : T.border}`,
                fontWeight: activeSection === i ? 700 : 400,
              }}>{s.title}</button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ minHeight: 400 }}>
        {CurrentComponent && <CurrentComponent />}
      </div>

      {/* Transition reason */}
      {allIdx < ML_SECTIONS.length - 1 && ML_SECTIONS[allIdx]?.nextReason && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", marginTop: 14, fontSize: 11, color: T.muted, fontStyle: "italic" }}>
          <b>Next:</b> {ML_SECTIONS[allIdx].nextReason}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, padding: "0 4px" }}>
        <button onClick={handlePrev} disabled={allIdx <= 0}
          style={{
            padding: "6px 16px", fontSize: 11, borderRadius: 8, cursor: allIdx > 0 ? "pointer" : "default",
            background: allIdx > 0 ? T.panel : T.surface, color: allIdx > 0 ? T.ink : T.dim,
            border: `1px solid ${T.border}`, fontWeight: 600, opacity: allIdx > 0 ? 1 : 0.4,
          }}>← Prev</button>

        {/* Dots */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", maxWidth: 300 }}>
          {ML_SECTIONS.map((s, i) => {
            const bColor = ML_BLOCKS.find(b => b.id === s.block)?.color || T.dim;
            return (
              <div key={i} onClick={() => goTo(i)}
                style={{
                  width: i === allIdx ? 16 : 6, height: 6, borderRadius: 3, cursor: "pointer",
                  background: i === allIdx ? bColor : bColor + "44",
                  transition: "all 0.2s",
                }} title={s.title} />
            );
          })}
        </div>

        <button onClick={handleNext} disabled={allIdx >= ML_SECTIONS.length - 1}
          style={{
            padding: "6px 16px", fontSize: 11, borderRadius: 8, cursor: allIdx < ML_SECTIONS.length - 1 ? "pointer" : "default",
            background: allIdx < ML_SECTIONS.length - 1 ? T.panel : T.surface,
            color: allIdx < ML_SECTIONS.length - 1 ? T.ink : T.dim,
            border: `1px solid ${T.border}`, fontWeight: 600,
            opacity: allIdx < ML_SECTIONS.length - 1 ? 1 : 0.4,
          }}>Next →</button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: T.dim }}>
        Section {allIdx + 1} of {ML_SECTIONS.length} — ML for Materials Science
      </div>
    </div>
  );
}

export default MLIntroModule;
