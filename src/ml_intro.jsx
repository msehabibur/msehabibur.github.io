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
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>
      <span style={{ color: T.muted, fontFamily: "monospace", flex: 1 }}>{eq}</span>
      <span style={{ color: T.dim }}>=</span>
      <span style={{ color: color || T.ink, fontWeight: 700, fontFamily: "monospace", minWidth: 70, textAlign: "right" }}>{result}</span>
    </div>
  );
}

function HowItWorks({ steps, color }) {
  return (
    <div style={{ background: "#f0fdf4", border: "1.5px solid #05966933", borderRadius: 10, padding: "12px 16px", marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>How It Works — Step by Step</div>
      <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
        {steps.map((step, i) => (
          <div key={i} style={{ marginBottom: 2 }}><strong style={{ color: color || "#059669" }}>{i + 1}.</strong> {step}</div>
        ))}
      </div>
    </div>
  );
}

function CommonMistakes({ mistakes, color }) {
  return (
    <div style={{ marginTop: 10, background: "#fef2f2", border: "1.5px solid #dc262633", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>Common Mistakes — Watch Out!</div>
      <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
        {mistakes.map((m, i) => (
          <div key={i} style={{ marginBottom: 2 }}>&#x2717; {m}</div>
        ))}
      </div>
    </div>
  );
}

function MatSciExample({ text, color }) {
  return (
    <div style={{ marginTop: 10, background: "#eff6ff", border: "1.5px solid #2563eb33", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>Materials Science Example</div>
      <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>{text}</div>
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
  { id: "generative", label: "Generative & Advanced", color: "#9333ea" },
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

  const scaleX = (en) => 50 + (en - 1.5) * 550;
  const scaleY = (r) => 210 - (r - 1.10) * 450;

  return (
    <Card color={C} title="What Is Machine Learning?" formula="f(features) → prediction">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Teaching a child to sort toys: show examples with labels like "this is a car, this is a block" (supervised),
          let them group by similarity on their own (unsupervised), or reward with a sticker for correct guesses (reinforcement).
          The child does not need to know the physics of why a car rolls — they learn from patterns in the examples you show them.
          Over time, with enough examples, the child can classify new toys they have never seen before.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a librarian organizing books. In supervised learning, someone gives them a labeled catalog; in unsupervised learning, they group books by similarity (thickness, cover color, topic) without any catalog; in reinforcement learning, they try different shelving strategies and keep the ones that get the most reader checkouts.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Collect data: gather measurements (features) and outcomes (labels) for many materials.",
        "Choose features: decide which properties (electronegativity, radius, mass) to use as inputs.",
        "Pick a model type: supervised (if you have labels), unsupervised (if you want to discover groupings), or reinforcement (if you want to optimize a process).",
        "Train the model: feed the data to the algorithm so it learns the pattern linking features to outcomes.",
        "Evaluate: test the trained model on new data it has never seen to check if it truly learned generalizable patterns."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={500} height={240} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={170} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Materials Classification Dataset</text>
            {/* Axes */}
            <line x1={30} y1={180} x2={330} y2={180} stroke={T.border} strokeWidth={1} />
            <line x1={30} y1={20} x2={30} y2={180} stroke={T.border} strokeWidth={1} />
            <text x={180} y={196} textAnchor="middle" fontSize={12} fill={T.muted}>Electronegativity</text>
            <text x={10} y={100} textAnchor="middle" fontSize={12} fill={T.muted} transform="rotate(-90,10,100)">Atomic Radius (Å)</text>
            {/* Axis ticks */}
            {[1.6, 1.8, 2.0, 2.2].map(v => (
              <g key={v}>
                <line x1={scaleX(v)} y1={180} x2={scaleX(v)} y2={183} stroke={T.dim} />
                <text x={scaleX(v)} y={192} textAnchor="middle" fontSize={11} fill={T.dim}>{v.toFixed(1)}</text>
              </g>
            ))}
            {[1.15, 1.25, 1.35, 1.45].map(v => (
              <g key={v}>
                <line x1={27} y1={scaleY(v)} x2={30} y2={scaleY(v)} stroke={T.dim} />
                <text x={24} y={scaleY(v) + 3} textAnchor="end" fontSize={11} fill={T.dim}>{v.toFixed(2)}</text>
              </g>
            ))}
            {/* Data points */}
            {materials.map((m, i) => {
              const labelOffsets = [
                { dx: 0, dy: -14 },   // Si — above
                { dx: 14, dy: -8 },   // Ge — upper right
                { dx: 14, dy: 4 },    // GaAs — right
                { dx: -14, dy: -8 },  // Fe — upper left
                { dx: 14, dy: 10 },   // Cu — lower right (avoid Si)
                { dx: -14, dy: 10 },  // Al — lower left
              ];
              const off = labelOffsets[i] || { dx: 0, dy: -14 };
              return (
                <g key={i} onMouseEnter={() => setHighlight(i)} onMouseLeave={() => setHighlight(-1)} style={{ cursor: "pointer" }}>
                  <circle cx={scaleX(m.en)} cy={scaleY(m.radius)} r={highlight === i ? 10 : 7}
                    fill={m.color + "33"} stroke={m.color} strokeWidth={1.5} />
                  <text x={scaleX(m.en) + off.dx} y={scaleY(m.radius) + off.dy} textAnchor="middle"
                    fontSize={12} fill={m.color} fontWeight={600}>{m.name}</text>
                </g>
              );
            })}
            {/* Legend */}
            <circle cx={380} cy={30} r={5} fill="#2563eb33" stroke="#2563eb" strokeWidth={1} />
            <text x={392} y={34} fontSize={12} fill={T.muted}>Semiconductor</text>
            <circle cx={380} cy={50} r={5} fill="#ea580c33" stroke="#ea580c" strokeWidth={1} />
            <text x={392} y={54} fontSize={12} fill={T.muted}>Metal</text>
          </svg>

          {/* Type comparison table */}
          <div style={{ marginTop: 10, background: T.surface, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, letterSpacing: 2 }}>THREE TYPES OF ML</div>
            {types.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none", fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: C, minWidth: 95 }}>{t.name}</span>
                <span style={{ color: T.muted, flex: 1 }}>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>DATASET STATISTICS</div>
            <CalcRow eq="Total samples" result="6" color={C} />
            <CalcRow eq="Features per sample" result="2" color={C} />
            <CalcRow eq="Feature 1: Electronegativity range" result="1.61 – 2.18" color={C} />
            <CalcRow eq="Feature 2: Radius range (Å)" result="1.17 – 1.43" color={C} />
            <CalcRow eq="Class 0 (Semiconductor) count" result="3" color="#2563eb" />
            <CalcRow eq="Class 1 (Metal) count" result="3" color="#ea580c" />
            <CalcRow eq="Class balance ratio" result="1.00" color={C} />
            <CalcRow eq="Dimensionality of feature space" result="2D" color={C} />
          </div>

          <div style={{ marginTop: 10, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ML FINDS THE PATTERN</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Machine learning does not "know" physics.
            It finds statistical patterns in data — correlations between features (like electronegativity, radius) and
            properties (like metal vs semiconductor). The more relevant features and data you provide, the better it learns.
          </div>

          <CommonMistakes mistakes={[
            "Thinking ML understands physics — it only finds statistical correlations, not causal mechanisms.",
            "Using too few features — if the relevant information is not in the input, no algorithm can learn the pattern.",
            "Ignoring class imbalance — if 95% of samples are metals, the model can get 95% accuracy by always guessing 'metal'.",
            "Confusing correlation with causation — ML finds that electronegativity correlates with classification, but it does not prove EN causes a material to be a semiconductor."
          ]} />

          <MatSciExample text="The Materials Project database contains DFT-computed properties for over 150,000 inorganic compounds. ML models trained on this data can predict formation energies, bandgaps, and elastic moduli for hypothetical new compounds — screening millions of candidates in seconds instead of running expensive DFT calculations for each one." />
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

  const svgW = 500, svgH = 240;
  const xMin = 1.1, xMax = 1.5, yMin = 3.5, yMax = 6.5;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  return (
    <Card color={C} title="Linear Regression" formula="y = mx + b">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Drawing the best straight line through dots on a graph. The line should be as close as possible to all
          the data points. "Best" means the total squared distance from each point to the line is minimized.
          Imagine stretching a rubber band from each data point to the line — the best fit line is the one that minimizes the total tension in all rubber bands.
          <br/><br/><strong>Another way to think about it:</strong> If you scatter rice grains on a table and try to place a ruler so that every grain is as close as possible to the ruler's edge, you are doing linear regression by hand. The ruler is your model, the rice grains are your data, and the distances from each grain to the ruler are your errors.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Plot each data point in feature space — here, atomic radius (x-axis) vs. lattice constant (y-axis).",
        "Guess an initial line y = mx + b with some slope m and intercept b.",
        "For every data point, compute the vertical distance (error) between the actual y and the predicted y on the line.",
        "Square each error and sum them all up — this is the Sum of Squared Errors (SSE), our loss function.",
        "Adjust m and b to minimize SSE. The analytical solution uses calculus (normal equation), or you can use gradient descent iteratively."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Atomic Radius → Lattice Constant</text>
            {/* Axes */}
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 2} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={600}>Atomic Radius (Å)</text>
            <text x={12} y={svgH / 2 + 40} fontSize={12} fill={T.muted} fontWeight={600} transform={`rotate(-90,12,${svgH / 2 + 40})`}>Lattice Const (Å)</text>
            {/* Ticks */}
            {[1.15, 1.25, 1.35, 1.45].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={svgH - 30} x2={sx(v)} y2={svgH - 25} stroke={T.dim} strokeWidth={1.5} />
                <text x={sx(v)} y={svgH - 14} textAnchor="middle" fontSize={11} fill={T.ink}>{v.toFixed(2)}</text>
              </g>
            ))}
            {[4.0, 4.5, 5.0, 5.5, 6.0].map(v => (
              <g key={v}>
                <line x1={35} y1={sy(v)} x2={40} y2={sy(v)} stroke={T.dim} strokeWidth={1.5} />
                <text x={32} y={sy(v) + 4} textAnchor="end" fontSize={11} fill={T.ink}>{v.toFixed(1)}</text>
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
                <text x={sx(d.x) + 8} y={sy(d.y) - 4} fontSize={11} fill={C} fontWeight={600}>{d.name}</text>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The "best fit" line minimizes the total squared error
            (SSE). Try the sliders — watch how error changes. Click "Snap to Best Fit" to see the optimal m and b values
            found by the ordinary least squares formula.
          </div>

          <CommonMistakes mistakes={[
            "Using linear regression when the relationship is nonlinear — always plot your data first to check for curvature.",
            "Extrapolating far beyond the data range — a line fit from x = 1 to 1.5 may be wildly wrong at x = 10.",
            "Ignoring outliers — a single extreme point can dramatically tilt the best-fit line because errors are squared.",
            "Confusing R-squared with correctness — a high R-squared on training data does not guarantee good predictions on new data."
          ]} />

          <MatSciExample text="Vegard's law predicts that the lattice constant of a binary alloy A₁₋ₓBₓ varies linearly between the lattice constants of the pure components: a(x) = (1−x)·aA + x·aB. This is exactly a linear regression model! Deviations from Vegard's law (bowing parameters) indicate where nonlinear models might be needed." />
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

  const svgW = 500, svgH = 240;
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A student who memorizes answers word-for-word passes practice exams but fails new ones.
          Overfitting is the same — the model "memorizes" training data instead of learning general patterns.
          The memorizing student can recite every practice question perfectly, but when the wording changes even slightly on the real exam, they are lost.
          A truly understanding student grasps the underlying concepts and can handle novel questions.
          <br/><br/><strong>Another way to think about it:</strong> Imagine tracing the outline of a cloud with hundreds of tiny line segments versus drawing a simple oval shape. The detailed tracing fits that one cloud perfectly but is useless for describing other clouds. The simple oval captures the essential "cloud shape" and generalizes to new clouds.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Start with a simple model (low polynomial degree) and fit it to training data.",
        "Measure error on both training data and separate test data that the model has never seen.",
        "Gradually increase model complexity (higher polynomial degree) and watch both errors.",
        "At first, both errors decrease — the model is learning the true pattern (underfitting regime).",
        "Past a certain complexity, training error keeps dropping but test error starts rising — the model is memorizing noise (overfitting regime). The optimal complexity is at the 'elbow' where test error is minimized."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Polynomial Degree {degree} Fit</text>
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
            <text x={258} y={svgH - 12} fontSize={11} fill={T.muted}>Train</text>
            <circle cx={290} cy={svgH - 15} r={4} fill="#dc262644" stroke="#dc2626" />
            <text x={298} y={svgH - 12} fontSize={11} fill={T.muted}>Test</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Polynomial Degree" value={degree} min={1} max={7} step={1}
            onChange={setDegree} color={C} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> At low degree, both errors are high (underfitting).
            Around degree 2, the model matches the true y = x² well. At high degrees, train error drops near zero
            but test error explodes — that is overfitting. The sweet spot balances complexity and generalization.
          </div>

          <CommonMistakes mistakes={[
            "Only looking at training error — a model with zero training error is almost certainly overfit.",
            "Adding more features without more data — each new feature increases the risk of overfitting unless you have enough samples.",
            "Assuming a complex model is always better — a 7th-degree polynomial has more parameters but usually performs worse than a 2nd-degree one on this data.",
            "Forgetting regularization — techniques like L1/L2 penalty, dropout, or early stopping explicitly fight overfitting."
          ]} />

          <MatSciExample text="In materials informatics, datasets are often small (50–500 samples). A neural network with thousands of parameters will easily overfit such data. That is why random forests or regularized linear models often outperform deep learning on small materials datasets. The CGCNN (Crystal Graph CNN) paper showed that even for structure-based predictions, overfitting is a major risk with fewer than ~10,000 training structures." />
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
  const K = 5;

  const foldMAEs = [0.12, 0.15, 0.09, 0.18, 0.11];
  const meanMAE = foldMAEs.reduce((a, v) => a + v, 0) / K;
  const stdMAE = Math.sqrt(foldMAEs.reduce((a, v) => a + (v - meanMAE) ** 2, 0) / K);

  const dataPoints = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
  }, []);

  const foldColors = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#d97706"];
  const svgW = 500, svgH = 240;

  const foldAssignments = [
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
  ];

  return (
    <Card color={C} title="K-Fold Cross-Validation" formula="Mean Absolute Error (MAE) = mean ± std over K folds">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A restaurant critic visits 5 times on different days to give a fair review. Each visit tests
          a different aspect. The average of all visits is more reliable than a single visit.
          If the critic only visited once on a great day, they might give 5 stars to a 3-star restaurant. Multiple visits reveal the true average quality.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a teacher who gives 5 different quizzes on the same topic instead of one big exam. Each quiz uses different questions, so a student who got lucky on one quiz will not fool the system. The average quiz score is a much fairer measure of true understanding.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Divide your dataset into K = 5 equal-sized subsets (folds).",
        "For fold 1: train on folds 2–5, test on fold 1, record the Mean Absolute Error (MAE).",
        "For fold 2: train on folds 1, 3–5, test on fold 2, record MAE.",
        "Repeat for all 5 folds — each fold gets exactly one turn as the test set.",
        "Report mean MAE ± std over all 5 folds. The mean estimates true performance; the std estimates how stable your model is."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>5-Fold Cross-Validation — Each Fold Takes a Turn as Test Set</text>
            {/* Show each fold as a row */}
            {foldAssignments.map((testIds, fi) => {
              const rowY = 28 + fi * 34;
              const rowH = 28;
              return (
                <g key={fi}>
                  <text x={8} y={rowY + rowH / 2 + 3} fontSize={12} fill={T.muted} fontWeight={600}>F{fi + 1}</text>
                  {dataPoints.map((d, di) => {
                    const cellW = (svgW - 80) / 10;
                    const cx = 30 + di * cellW;
                    const isTest = testIds.includes(d.id);
                    return (
                      <g key={di}>
                        <rect x={cx} y={rowY} width={cellW - 2} height={rowH} rx={3}
                          fill={isTest ? foldColors[fi] + "55" : T.panel}
                          stroke={isTest ? foldColors[fi] : T.border} strokeWidth={isTest ? 1.5 : 0.5} />
                        <text x={cx + cellW / 2 - 1} y={rowY + rowH / 2 + 3} textAnchor="middle" fontSize={12} fill={isTest ? foldColors[fi] : T.dim} fontWeight={isTest ? 700 : 400}>
                          {isTest ? "TEST" : "train"}
                        </text>
                      </g>
                    );
                  })}
                  <text x={svgW - 5} y={rowY + rowH / 2 + 3} textAnchor="end" fontSize={12} fill={foldColors[fi]} fontWeight={700}>
                    MAE={foldMAEs[fi].toFixed(2)}
                  </text>
                </g>
              );
            })}
            {/* Point labels at bottom */}
            {dataPoints.map((d, di) => {
              const cellW = (svgW - 80) / 10;
              return (
                <text key={di} x={30 + di * cellW + cellW / 2 - 1} y={svgH - 8} textAnchor="middle" fontSize={12} fill={T.dim}>
                  {d.id}
                </text>
              );
            })}
            <rect x={30} y={svgH - 22} width={10} height={8} rx={2} fill={C + "55"} stroke={C} strokeWidth={1} />
            <text x={44} y={svgH - 15} fontSize={11} fill={T.muted}>= Test fold</text>
            <rect x={110} y={svgH - 22} width={10} height={8} rx={2} fill={T.panel} stroke={T.border} strokeWidth={0.5} />
            <text x={124} y={svgH - 15} fontSize={11} fill={T.muted}>= Train fold</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>K-FOLD VALIDATION SCORES (K=5)</div>
            <CalcRow eq="Total data points" result="10" color={C} />
            <CalcRow eq="Points per fold = 10 / 5" result="2" color={C} />
            {foldMAEs.map((mae, i) => (
              <CalcRow key={i} eq={`Fold ${i + 1} MAE`} result={mae.toFixed(2)} color={foldColors[i]} />
            ))}
            <CalcRow eq={`Mean MAE = (${foldMAEs.map(v => v.toFixed(2)).join(" + ")}) / 5`} result={meanMAE.toFixed(2)} color={C} />
            <CalcRow eq={`Std = √[ Σ(MAEᵢ − ${meanMAE.toFixed(2)})² / 5 ]`} result={stdMAE.toFixed(4)} color={M.accent} />
            <CalcRow eq="Final reported score" result={`${meanMAE.toFixed(2)} ± ${stdMAE.toFixed(3)}`} color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="MEAN MAE" value={meanMAE.toFixed(3)} color={C} />
            <ResultBox label="± STD" value={stdMAE.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Cross-validation uses every data point for both
            training and testing. With K=5, each of the 5 folds takes exactly one turn as the test set, producing 5 independent MAE scores.
            The mean estimates true performance; the standard deviation tells you how stable your model is — low std means reliable performance.
            Fold 3 has the lowest MAE (0.09) and Fold 4 the highest (0.18), showing some variability.
          </div>

          <CommonMistakes mistakes={[
            "Performing feature engineering (scaling, selection) before the split — this leaks test information into training, giving falsely optimistic results.",
            "Using K = 2 on small datasets — each fold only trains on half the data, giving a pessimistic estimate.",
            "Ignoring the standard deviation — a model with mean MAE 0.13 but std 0.04 is much less reliable than one with mean 0.14 but std 0.01.",
            "Shuffling time-series data randomly — for temporal data, use time-based splits to avoid leaking future information into the past."
          ]} />

          <MatSciExample text="In the Matbench benchmark suite, all models are evaluated using nested cross-validation with specific fold assignments. This ensures fair comparison across different ML approaches for materials property prediction tasks like predicting formation energy, bandgap, and bulk modulus." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 5 — Decision Trees (Regression)
   ════════════════════════════════════════════════════════════════ */
function DecisionTreeSection() {
  const C = M.algo;
  const [splitThreshold, setSplitThreshold] = useState(2.0);

  const materials = [
    { name: "Si",   en: 1.90, bg: 1.12 },
    { name: "Ge",   en: 2.01, bg: 0.67 },
    { name: "GaAs", en: 2.00, bg: 1.42 },
    { name: "CdTe", en: 1.90, bg: 1.50 },
    { name: "ZnO",  en: 2.55, bg: 3.37 },
    { name: "InP",  en: 2.00, bg: 1.35 },
  ];

  const leftPts = materials.filter(m => m.en <= splitThreshold);
  const rightPts = materials.filter(m => m.en > splitThreshold);

  const meanBg = (pts) => pts.length > 0 ? pts.reduce((s, p) => s + p.bg, 0) / pts.length : 0;
  const mse = (pts) => {
    if (pts.length === 0) return 0;
    const avg = meanBg(pts);
    return pts.reduce((s, p) => s + (p.bg - avg) ** 2, 0) / pts.length;
  };

  const allMean = meanBg(materials);
  const mseBefore = mse(materials);
  const mseLeft = mse(leftPts);
  const mseRight = mse(rightPts);
  const mseAfter = (leftPts.length / materials.length) * mseLeft + (rightPts.length / materials.length) * mseRight;
  const mseReduction = mseBefore - mseAfter;

  const leftPred = meanBg(leftPts);
  const rightPred = meanBg(rightPts);

  const svgW = 500, svgH = 240;
  const enMin = 1.7, enMax = 2.7, bgMin = 0, bgMax = 4;
  const sx = (v) => 40 + (v - enMin) / (enMax - enMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - bgMin) / (bgMax - bgMin) * (svgH - 50);

  return (
    <Card color={C} title="Decision Tree Regression" formula="MSE = (1/N) Σ(yᵢ − ȳ)²">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A game of 20 Questions, but instead of guessing a category, you are guessing a number. Each question splits possibilities into two groups.
          The best question makes each group's values as similar as possible — measured by Mean Squared Error (MSE).
          At each leaf, the prediction is simply the average of the samples in that leaf.
          <br/><br/><strong>Another way to think about it:</strong> Imagine sorting materials into bins by a property threshold. In each bin, you predict "the average bandgap of everything in this bin." The tree finds the threshold that makes each bin's values most uniform.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Start with all 6 materials in one node. Compute MSE of all bandgaps around their mean.",
        "For every possible feature and threshold, compute: what would the weighted MSE be if we split here?",
        "Pick the split that gives the largest reduction in MSE.",
        "Each leaf predicts the mean bandgap of samples in that leaf.",
        "Recursively repeat for each child node until a stopping criterion is met."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Split on Mean Electronegativity ≤ {splitThreshold.toFixed(2)}</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={12} fill={T.muted}>Mean Electronegativity</text>
            <text x={12} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,12,${svgH / 2})`}>Bandgap (eV)</text>
            {/* Split line */}
            <line x1={sx(splitThreshold)} y1={18} x2={sx(splitThreshold)} y2={svgH - 30} stroke={C} strokeWidth={2} strokeDasharray="5,3" />
            {/* Shaded regions */}
            <rect x={40} y={18} width={Math.max(0, sx(splitThreshold) - 40)} height={svgH - 48} fill="#059669" opacity={0.05} />
            <rect x={sx(splitThreshold)} y={18} width={Math.max(0, svgW - 10 - sx(splitThreshold))} height={svgH - 48} fill="#dc2626" opacity={0.05} />
            {/* Prediction lines (mean of each side) */}
            {leftPts.length > 0 && (
              <line x1={40} y1={sy(leftPred)} x2={sx(splitThreshold)} y2={sy(leftPred)}
                stroke="#059669" strokeWidth={2} strokeDasharray="6,3" />
            )}
            {rightPts.length > 0 && (
              <line x1={sx(splitThreshold)} y1={sy(rightPred)} x2={svgW - 10} y2={sy(rightPred)}
                stroke="#dc2626" strokeWidth={2} strokeDasharray="6,3" />
            )}
            {/* Data points */}
            {materials.map((m, i) => (
              <g key={i}>
                <circle cx={sx(m.en)} cy={sy(m.bg)} r={6}
                  fill={m.en <= splitThreshold ? "#05966933" : "#dc262633"}
                  stroke={m.en <= splitThreshold ? "#059669" : "#dc2626"} strokeWidth={1.5} />
                <text x={sx(m.en)} y={sy(m.bg) - 9} textAnchor="middle" fontSize={12} fill={T.ink} fontWeight={600}>{m.name}</text>
                <text x={sx(m.en)} y={sy(m.bg) + 14} textAnchor="middle" fontSize={12} fill={T.muted}>{m.bg} eV</text>
              </g>
            ))}
            {/* Axis ticks */}
            {[1.8, 2.0, 2.2, 2.4, 2.6].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={svgH - 30} x2={sx(v)} y2={svgH - 25} stroke={T.dim} />
                <text x={sx(v)} y={svgH - 16} textAnchor="middle" fontSize={11} fill={T.dim}>{v.toFixed(1)}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4].map(v => (
              <g key={v}>
                <line x1={35} y1={sy(v)} x2={40} y2={sy(v)} stroke={T.dim} />
                <text x={32} y={sy(v) + 3} textAnchor="end" fontSize={11} fill={T.dim}>{v}</text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Split threshold (Mean EN)" value={splitThreshold}
            min={1.8} max={2.6} step={0.01}
            onChange={setSplitThreshold} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>MSE CALCULATION</div>
            <CalcRow eq={`All 6 materials: mean bandgap ȳ`} result={`${allMean.toFixed(3)} eV`} color={C} />
            <CalcRow eq={`MSE before split = (1/6)Σ(yᵢ − ${allMean.toFixed(2)})²`} result={mseBefore.toFixed(4)} color={C} />
            <CalcRow eq={`Left (≤ ${splitThreshold.toFixed(2)}): ${leftPts.length} materials`} result={`ȳ = ${leftPred.toFixed(3)} eV`} color="#059669" />
            <CalcRow eq={`Left MSE = (1/${leftPts.length})Σ(yᵢ − ${leftPred.toFixed(2)})²`} result={mseLeft.toFixed(4)} color="#059669" />
            <CalcRow eq={`Right (> ${splitThreshold.toFixed(2)}): ${rightPts.length} materials`} result={`ȳ = ${rightPred.toFixed(3)} eV`} color="#dc2626" />
            <CalcRow eq={`Right MSE = (1/${rightPts.length})Σ(yᵢ − ${rightPred.toFixed(2)})²`} result={mseRight.toFixed(4)} color="#dc2626" />
            <CalcRow eq={`Weighted MSE = (${leftPts.length}/6)×${mseLeft.toFixed(3)} + (${rightPts.length}/6)×${mseRight.toFixed(3)}`} result={mseAfter.toFixed(4)} color={C} />
            <CalcRow eq={`MSE Reduction = ${mseBefore.toFixed(4)} − ${mseAfter.toFixed(4)}`} result={mseReduction.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="WEIGHTED MSE" value={mseAfter.toFixed(4)} color={C} />
            <ResultBox label="MSE REDUCTION" value={mseReduction.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> In regression trees, each leaf predicts the mean of its samples.
            The tree picks the split that maximizes MSE reduction. A low MSE means samples in each leaf have similar bandgaps.
            Try moving the threshold — watch how the left/right predictions (dashed lines) change.
          </div>

          <CommonMistakes mistakes={[
            "Growing the tree too deep — a fully grown tree memorizes training data (overfitting). Use max_depth or min_samples_leaf to limit growth.",
            "Assuming trees handle feature scaling — actually trees do NOT need scaled features, unlike Support Vector Machines or neural networks. This is an advantage.",
            "Forgetting that single trees are unstable — small changes in data can produce very different trees. Random forests fix this.",
            "Confusing classification trees (Gini) with regression trees (MSE) — for predicting continuous values like bandgap, always use MSE-based splits."
          ]} />

          <MatSciExample text="Regression trees are used in materials science to predict continuous properties like formation energy. A tree might split on electronegativity difference > 1.5 (first node) and mean atomic mass > 60 (second node) to predict bandgap values, with each leaf outputting the average bandgap of the materials in that partition." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 6 — Random Forest (Regression)
   ════════════════════════════════════════════════════════════════ */
function RandomForestSection() {
  const C = M.algo;

  const allMaterials = [
    { name: "Si",   en: 1.90, bg: 1.12 },
    { name: "Ge",   en: 2.01, bg: 0.67 },
    { name: "GaAs", en: 2.00, bg: 1.42 },
    { name: "CdTe", en: 1.90, bg: 1.50 },
    { name: "ZnO",  en: 2.55, bg: 3.37 },
    { name: "InP",  en: 2.00, bg: 1.35 },
  ];

  const testMaterial = allMaterials[5]; // InP

  const treeSubsets = [
    { id: 1, indices: [0, 1, 3, 4], pred: 1.28 },
    { id: 2, indices: [0, 2, 3, 4], pred: 1.40 },
    { id: 3, indices: [1, 2, 3, 4], pred: 1.35 },
  ];

  const preds = treeSubsets.map(t => t.pred);
  const rfPred = preds.reduce((a, v) => a + v, 0) / preds.length;
  const actual = testMaterial.bg;
  const error = Math.abs(rfPred - actual);

  const svgW = 500, svgH = 240;
  const treeColors = ["#2563eb", "#059669", "#d97706"];

  return (
    <Card color={C} title="Random Forest Regression" formula="Prediction = (1/N) Σ tree predictions">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A panel of judges scoring a gymnastics routine. Each judge sees the routine from a slightly different angle
          and has different expertise. The average score is more reliable than any single judge's opinion.
          Even if one judge is biased, the collective average washes out individual errors.
          <br/><br/><strong>Another way to think about it:</strong> Imagine asking 100 people to guess the number of jellybeans in a jar. Most individuals will be off, but the average of all 100 guesses is remarkably close to the true number. This is the "wisdom of crowds" effect, and random forests exploit exactly this principle with decision trees.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Create N regression trees (here N=3). Each tree trains on a random subset of the 6 materials (bootstrap sampling).",
        "At each split in each tree, only consider a random subset of features. This decorrelates the trees.",
        "Each tree independently predicts the bandgap for InP based on its own learned splits.",
        "The Random Forest prediction = average of all tree predictions: (1.28 + 1.40 + 1.35) / 3 = 1.343 eV.",
        "Compare to actual InP bandgap = 1.35 eV. Error = |1.343 − 1.35| = 0.007 eV — excellent!"
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Random Forest Regression: 3 Trees Predict InP Bandgap</text>
            {/* Draw each tree */}
            {treeSubsets.map((tree, i) => {
              const tx = 60 + i * 150;
              const ty = 35;
              return (
                <g key={i}>
                  <rect x={tx - 55} y={ty} width={110} height={90} rx={6} fill={treeColors[i] + "10"} stroke={treeColors[i]} strokeWidth={1} />
                  <text x={tx} y={ty + 14} textAnchor="middle" fontSize={12} fill={treeColors[i]} fontWeight={700}>Tree {tree.id}</text>
                  <text x={tx} y={ty + 28} textAnchor="middle" fontSize={11} fill={T.muted}>
                    Subset: {tree.indices.map(j => allMaterials[j].name).join(", ")}
                  </text>
                  <text x={tx} y={ty + 48} textAnchor="middle" fontSize={11} fill={T.muted}>Predicts InP →</text>
                  <text x={tx} y={ty + 68} textAnchor="middle" fontSize={14} fill={treeColors[i]} fontWeight={800}>
                    {tree.pred.toFixed(2)} eV
                  </text>
                  {/* Arrow to average */}
                  <line x1={tx} y1={ty + 92} x2={svgW / 2} y2={170} stroke={treeColors[i] + "66"} strokeWidth={1.5} />
                </g>
              );
            })}
            {/* Average box */}
            <rect x={svgW / 2 - 70} y={170} width={140} height={35} rx={6} fill={C + "15"} stroke={C} strokeWidth={1.5} />
            <text x={svgW / 2} y={183} textAnchor="middle" fontSize={11} fill={T.muted}>Random Forest Average:</text>
            <text x={svgW / 2} y={198} textAnchor="middle" fontSize={12} fill={C} fontWeight={800}>
              {rfPred.toFixed(3)} eV (actual: {actual} eV)
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>REGRESSION CALCULATION</div>
            <CalcRow eq="Test material" result="InP (actual = 1.35 eV)" color={C} />
            {treeSubsets.map((t, i) => (
              <CalcRow key={i} eq={`Tree ${t.id} (subset: ${t.indices.map(j => allMaterials[j].name).join(",")})`}
                result={`predicts ${t.pred.toFixed(2)} eV`} color={treeColors[i]} />
            ))}
            <CalcRow eq={`RF prediction = (${preds.map(p => p.toFixed(2)).join(" + ")}) / 3`} result={`${rfPred.toFixed(3)} eV`} color={C} />
            <CalcRow eq={`Error = |${rfPred.toFixed(3)} − ${actual}|`} result={`${error.toFixed(3)} eV`} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="RF PREDICTION" value={rfPred.toFixed(3) + " eV"} color={C} sub="InP bandgap" />
            <ResultBox label="ERROR" value={error.toFixed(3) + " eV"} color={M.accent} sub={`actual = ${actual} eV`} />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Each tree trains on a different random subset of data and features.
            This "randomness" makes individual trees different. Averaging their predictions (bagging) reduces overfitting and
            increases robustness. The error of 0.007 eV is much smaller than any single tree's likely error.
          </div>

          <CommonMistakes mistakes={[
            "Using too few trees — 10 trees is not a forest. Use at least 100; diminishing returns typically start around 300–500.",
            "Setting max_features too high — if every tree considers all features, the trees become correlated and the ensemble benefit is lost.",
            "Assuming random forests cannot overfit — they can, especially with very deep trees on noisy data. Use out-of-bag (OOB) error to monitor.",
            "Ignoring feature importances — random forests provide built-in feature importance rankings; always check which features the model relies on."
          ]} />

          <MatSciExample text="Random forests are the workhorse of materials informatics. The Automatminer pipeline uses gradient-boosted trees (a close cousin) as its default model. In the 2019 Matbench study, random forests achieved competitive performance on 8 out of 13 materials prediction tasks, often rivaling much more complex deep learning models." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 7 — Support Vector Regression (SVR)
   ════════════════════════════════════════════════════════════════ */
function SVMSection() {
  const C = M.algo;
  const [epsilon, setEpsilon] = useState(0.3);

  const materials = [
    { name: "Si",   en: 1.90, bg: 1.12, yhat: 1.20 },
    { name: "Ge",   en: 2.01, bg: 0.67, yhat: 0.80 },
    { name: "GaAs", en: 2.00, bg: 1.42, yhat: 1.35 },
    { name: "CdTe", en: 1.90, bg: 1.50, yhat: 1.40 },
    { name: "ZnO",  en: 2.55, bg: 3.37, yhat: 3.10 },
    { name: "InP",  en: 2.00, bg: 1.35, yhat: 1.30 },
  ];

  const losses = materials.map(m => ({
    ...m,
    residual: Math.abs(m.bg - m.yhat),
    loss: Math.max(0, Math.abs(m.bg - m.yhat) - epsilon),
    isSV: Math.abs(m.bg - m.yhat) > epsilon,
  }));

  const totalLoss = losses.reduce((s, l) => s + l.loss, 0);
  const nSV = losses.filter(l => l.isSV).length;

  const svgW = 500, svgH = 240;
  const enMin = 1.7, enMax = 2.7, bgMin = 0, bgMax = 4;
  const sx = (v) => 40 + (v - enMin) / (enMax - enMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - bgMin) / (bgMax - bgMin) * (svgH - 50);

  return (
    <Card color={C} title="Support Vector Regression" formula="Loss = max(0, |y − ŷ| − ε)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Imagine a tube around a regression line. Predictions within the tube are "close enough" — they incur zero penalty.
          Only points outside the tube (where the error exceeds ε) are penalized. The tube width ε controls your tolerance.
          A wide tube ignores small errors and focuses only on large deviations. A narrow tube demands near-perfect predictions.
          <br/><br/><strong>Another way to think about it:</strong> A teacher grading with a tolerance zone: answers within ε of the correct value get full marks (zero loss). Only answers outside this zone lose points, and the penalty is proportional to how far they are beyond the tolerance. Points outside the tube are called "support vectors" — they are the only ones that influence the model.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Fit a regression function ŷ = f(x) to the data, but instead of minimizing squared error, use the ε-insensitive loss.",
        "Define an ε-tube around the prediction: any data point with |y − ŷ| ≤ ε incurs zero loss.",
        "Points outside the tube have loss = |y − ŷ| − ε. These are the support vectors.",
        "The ε parameter controls the tube width: larger ε means more points inside the tube (simpler model, more tolerance).",
        "Support vectors (points outside the tube) are the only data points that influence the regression function."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Support Vector Regression: ε-Tube (ε = {epsilon.toFixed(2)})</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={12} fill={T.muted}>Mean Electronegativity</text>
            <text x={12} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,12,${svgH / 2})`}>Bandgap (eV)</text>
            {/* ε-tube around each prediction */}
            {materials.map((m, i) => (
              <g key={`tube${i}`}>
                <rect x={sx(m.en) - 8} y={sy(m.yhat + epsilon)} width={16}
                  height={sy(m.yhat - epsilon) - sy(m.yhat + epsilon)}
                  rx={2} fill={C} opacity={0.08} />
                <line x1={sx(m.en) - 8} y1={sy(m.yhat + epsilon)} x2={sx(m.en) + 8} y2={sy(m.yhat + epsilon)}
                  stroke={C} strokeWidth={0.5} strokeDasharray="2,2" />
                <line x1={sx(m.en) - 8} y1={sy(m.yhat - epsilon)} x2={sx(m.en) + 8} y2={sy(m.yhat - epsilon)}
                  stroke={C} strokeWidth={0.5} strokeDasharray="2,2" />
              </g>
            ))}
            {/* Prediction markers */}
            {materials.map((m, i) => (
              <line key={`pred${i}`} x1={sx(m.en) - 6} y1={sy(m.yhat)} x2={sx(m.en) + 6} y2={sy(m.yhat)}
                stroke={C} strokeWidth={2} />
            ))}
            {/* Data points */}
            {losses.map((m, i) => (
              <g key={i}>
                <circle cx={sx(m.en)} cy={sy(m.bg)} r={6}
                  fill={m.isSV ? "#dc262644" : "#05966944"}
                  stroke={m.isSV ? "#dc2626" : "#059669"} strokeWidth={2} />
                <text x={sx(m.en)} y={sy(m.bg) - 9} textAnchor="middle" fontSize={12} fill={T.ink} fontWeight={600}>
                  {m.name}{m.isSV ? " (SV)" : ""}
                </text>
              </g>
            ))}
            {/* Axis ticks */}
            {[1.8, 2.0, 2.2, 2.4, 2.6].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={svgH - 30} x2={sx(v)} y2={svgH - 25} stroke={T.dim} />
                <text x={sx(v)} y={svgH - 16} textAnchor="middle" fontSize={11} fill={T.dim}>{v.toFixed(1)}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4].map(v => (
              <g key={v}>
                <line x1={35} y1={sy(v)} x2={40} y2={sy(v)} stroke={T.dim} />
                <text x={32} y={sy(v) + 3} textAnchor="end" fontSize={11} fill={T.dim}>{v}</text>
              </g>
            ))}
            {/* Legend */}
            <circle cx={350} cy={25} r={4} fill="#05966944" stroke="#059669" strokeWidth={1.5} />
            <text x={358} y={28} fontSize={11} fill={T.muted}>Inside tube</text>
            <circle cx={350} cy={40} r={4} fill="#dc262644" stroke="#dc2626" strokeWidth={1.5} />
            <text x={358} y={43} fontSize={11} fill={T.muted}>Support vector</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="ε (epsilon — tube half-width)" value={epsilon} min={0.05} max={1.0} step={0.05}
            onChange={setEpsilon} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ε-INSENSITIVE LOSS</div>
            {losses.map((m, i) => (
              <CalcRow key={i} eq={`${m.name}: |${m.bg.toFixed(2)} − ${m.yhat.toFixed(2)}| = ${m.residual.toFixed(2)}, loss = max(0, ${m.residual.toFixed(2)} − ${epsilon.toFixed(2)})`}
                result={m.loss.toFixed(3) + (m.isSV ? " (SV)" : "")} color={m.isSV ? "#dc2626" : "#059669"} />
            ))}
            <CalcRow eq="Total ε-insensitive loss" result={totalLoss.toFixed(3)} color={C} />
            <CalcRow eq="Support vectors (outside tube)" result={`${nSV} of 6`} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="TOTAL LOSS" value={totalLoss.toFixed(3)} color={C} />
            <ResultBox label="SUPPORT VECTORS" value={`${nSV} / 6`} color={M.accent} sub="outside ε-tube" />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Larger ε means a wider tube — more points fall inside and incur zero loss,
            giving a simpler model. Smaller ε demands tighter predictions, making more points become support vectors.
            Only support vectors influence the model; all other points could be removed without changing the result.
          </div>

          <CommonMistakes mistakes={[
            "Forgetting to scale features — Support Vector Machines are sensitive to feature magnitudes. Always standardize features (mean 0, std 1) before using SVR.",
            "Using a linear kernel when the relationship is nonlinear — try RBF or polynomial kernels for curved relationships.",
            "Setting ε too small — this forces the model to fit every point tightly, leading to overfitting. Choose ε based on your acceptable error tolerance.",
            "Not understanding support vectors — removing a non-support-vector point changes nothing. Only points outside the ε-tube matter."
          ]} />

          <MatSciExample text="Support Vector Regression with radial basis function (RBF) kernel has been used to predict bandgap values from compositional descriptors. The ε-tube naturally handles the inherent measurement uncertainty in experimental bandgap values (typically ±0.1 eV), making SVR well-suited for noisy materials data." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 8 — Principal Component Analysis (PCA)
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

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Principal Component Analysis" formula="Cov(X) → eigenvalues, eigenvectors">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Photographing a 3D object — find the best camera angle that captures the most information in a flat 2D picture.
          PCA finds the directions (principal components) along which data varies the most.
          If you photograph a long, thin pencil from the side, you see its full length. Photograph it head-on, and it looks like a dot. PCA automatically finds the "side view" that preserves the most information.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a spreadsheet with 50 columns of material properties. Many columns are correlated (atomic mass and atomic number move together). PCA discovers these correlations and compresses the 50 columns into, say, 5 "super-columns" that capture 95% of all the variation. You lose only 5% of information but reduce complexity by 10x.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Standardize each feature to mean = 0 and std = 1, so no single feature dominates due to its scale.",
        "Compute the covariance matrix — this captures how every pair of features varies together.",
        "Find the eigenvalues and eigenvectors of the covariance matrix. Each eigenvector is a principal component direction; its eigenvalue tells how much variance lies along that direction.",
        "Sort components by eigenvalue (largest first). The first PC captures the most variance, the second captures the most remaining variance orthogonal to the first, and so on.",
        "Choose how many PCs to keep — typically enough to capture 90–95% of total variance. Project all data onto these PCs to get a reduced-dimensional representation."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Explained Variance by Component</text>
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
                  <text x={x + barW / 2} y={170} textAnchor="middle" fontSize={12} fill={T.muted}>PC{i + 1}</text>
                  <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={12} fill={active ? C : T.dim} fontWeight={700}>
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
                  <text x={x + 10} y={y + 3} fontSize={11} fill={M.accent} fontWeight={600}>{(c * 100).toFixed(0)}%</text>
                </g>
              );
            })}
            <text x={300} y={svgH - 8} fontSize={11} fill={M.accent}>Cumulative</text>
          </svg>

          {/* Covariance matrix */}
          <div style={{ marginTop: 8, background: T.surface, borderRadius: 8, padding: 8, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, letterSpacing: 2 }}>COVARIANCE MATRIX (standardized)</div>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> PCA compresses high-dimensional data by keeping only the
            directions with the most variance. If 2 PCs capture 92% of variance, you can safely drop the 3rd dimension.
            This helps with visualization and reducing overfitting.
          </div>

          <CommonMistakes mistakes={[
            "Applying PCA without standardizing first — if one feature is in GPa and another in eV, the GPa feature will dominate simply due to scale.",
            "Keeping too few components — if you retain only 60% of variance, you may lose critical information that hurts downstream models.",
            "Interpreting PCs as individual features — PC1 is a linear combination of ALL original features; it does not correspond to any single physical property.",
            "Using PCA on categorical data — PCA is designed for continuous numerical features. For categorical data, use techniques like MCA (Multiple Correspondence Analysis)."
          ]} />

          <MatSciExample text="In high-entropy alloy research, compositions can involve 5+ elements, each with dozens of elemental descriptors, creating a 100+ dimensional feature space. PCA is used to visualize this space in 2D, revealing clusters of similar alloys and guiding composition optimization. The first two PCs often separate alloys by phase stability (BCC vs FCC vs mixed)." />
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

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Perceptron (Single Neuron)" formula={`output = ${actName}(w₁x₁ + w₂x₂ + b)`}>
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A voter weighing pros and cons before making a decision. Each argument (input) has a weight (importance).
          The voter adds up all weighted arguments, applies a threshold, and decides yes or no.
          If "low cost" has weight 0.8 and "high durability" has weight 0.5, the voter multiplies each factor by its importance, sums them, and checks: is the total above my threshold? If yes, buy. If no, skip.
          <br/><br/><strong>Another way to think about it:</strong> A neuron in your brain works similarly — it receives signals from thousands of other neurons through synapses (connections with different strengths). If the combined signal exceeds a firing threshold, the neuron fires. An artificial neuron is a mathematical model of this biological process, simplified to weighted sum plus activation function.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Receive input values (x1, x2, ...) — these are your features, like electronegativity and atomic radius.",
        "Multiply each input by its weight (w1*x1, w2*x2, ...) — weights represent how important each feature is.",
        "Sum all weighted inputs and add a bias term: z = w1*x1 + w2*x2 + ... + b. The bias shifts the decision threshold.",
        "Apply an activation function to z. Sigmoid squashes z to range [0,1] (useful for probability). ReLU outputs max(0,z) (useful for deep networks because it avoids vanishing gradients).",
        "The output is the neuron's prediction. During training, weights and bias are adjusted to minimize the difference between predicted and actual values."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Single Neuron Diagram</text>
            {/* Input nodes */}
            <circle cx={60} cy={60} r={18} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={60} y={58} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>x₁</text>
            <text x={60} y={70} textAnchor="middle" fontSize={11} fill={T.muted}>{x1.toFixed(1)}</text>

            <circle cx={60} cy={140} r={18} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={60} y={138} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>x₂</text>
            <text x={60} y={150} textAnchor="middle" fontSize={11} fill={T.muted}>{x2.toFixed(1)}</text>

            {/* Weights on arrows */}
            <line x1={78} y1={60} x2={152} y2={90} stroke={C} strokeWidth={1.5} />
            <text x={108} y={68} fontSize={11} fill={C} fontWeight={600}>w₁={w1.toFixed(1)}</text>
            <line x1={78} y1={140} x2={152} y2={110} stroke={C} strokeWidth={1.5} />
            <text x={108} y={138} fontSize={11} fill={C} fontWeight={600}>w₂={w2.toFixed(1)}</text>

            {/* Neuron */}
            <circle cx={170} cy={100} r={22} fill={C + "20"} stroke={C} strokeWidth={2} />
            <text x={170} y={96} textAnchor="middle" fontSize={12} fill={C} fontWeight={700}>Σ + b</text>
            <text x={170} y={108} textAnchor="middle" fontSize={11} fill={T.muted}>{actName}</text>

            {/* Bias arrow */}
            <line x1={170} y1={45} x2={170} y2={78} stroke={M.accent} strokeWidth={1} strokeDasharray="3,2" />
            <text x={170} y={40} textAnchor="middle" fontSize={11} fill={M.accent}>b={bias.toFixed(1)}</text>

            {/* Output */}
            <line x1={192} y1={100} x2={260} y2={100} stroke={C} strokeWidth={2} markerEnd="url(#arrowhead)" />
            <circle cx={280} cy={100} r={20} fill={output > 0.5 ? "#05966920" : "#dc262620"}
              stroke={output > 0.5 ? "#059669" : "#dc2626"} strokeWidth={2} />
            <text x={280} y={97} textAnchor="middle" fontSize={11} fill={output > 0.5 ? "#059669" : "#dc2626"} fontWeight={800}>
              {output.toFixed(3)}
            </text>
            <text x={280} y={110} textAnchor="middle" fontSize={11} fill={T.muted}>output</text>

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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> A neuron computes a weighted sum of inputs, adds a bias,
            then applies an activation function. Sigmoid squashes everything to 0–1 (good for probabilities).
            ReLU passes positive values unchanged and kills negatives (faster training in deep networks).
          </div>

          <CommonMistakes mistakes={[
            "Thinking a single neuron can solve any problem — a single perceptron can only learn linearly separable patterns (e.g., it cannot learn XOR).",
            "Setting all weights to the same initial value — this causes symmetry problems where all neurons learn the same thing. Use random initialization.",
            "Ignoring the bias term — without bias, the decision boundary must pass through the origin, severely limiting what the neuron can learn.",
            "Confusing weights with feature importance — a large weight does not necessarily mean the feature is important if the feature values are very small."
          ]} />

          <MatSciExample text="A single neuron with sigmoid activation is essentially logistic regression — one of the first ML models used in materials science. It was applied to predict whether a binary compound will be a semiconductor or insulator based on Pauling electronegativity difference and average atomic number. This simple model achieves ~85% accuracy on this binary classification task." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 10 — Deep Neural Network (DNN)
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

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Deep Neural Network (DNN)" formula="output = σ(W₂ · σ(W₁ · x + b₁) + b₂)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          An assembly line with stations. Raw materials (inputs) pass through Station 1 (hidden layer 1),
          get partially processed, then move to Station 2 (output). Each station transforms the product in a specific way.
          At each station, workers combine incoming parts with different weights, add their own adjustments (bias), and pass the result to the next station. The final station produces the finished product.
          <br/><br/><strong>Another way to think about it:</strong> Think of a series of language translators. The first translator converts English to French, the second converts French to German, the third converts German to the target language. Each translation step loses some nuance but captures the essential meaning in a new representation. Similarly, each hidden layer "translates" the data into a new representation that is progressively more useful for the final prediction task.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Input layer receives raw features (e.g., x1 = electronegativity, x2 = atomic radius).",
        "Hidden layer 1: each hidden neuron computes z = w*x + b, then applies activation function sigma(z). This creates intermediate features h1, h2 that are combinations of the inputs.",
        "These intermediate features capture nonlinear relationships that a single neuron cannot — for example, h1 might represent 'metallic character' as a nonlinear mix of EN and radius.",
        "Output layer combines hidden outputs with another set of weights: output = sigma(w_o1*h1 + w_o2*h2 + b_o).",
        "The entire process from input to output is called a 'forward pass'. The network has many parameters (weights and biases) that are all learned during training via backpropagation."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>2-Layer Network: Forward Pass</text>
            {/* Input layer */}
            <circle cx={50} cy={65} r={16} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={50} y={62} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>x₁</text>
            <text x={50} y={73} textAnchor="middle" fontSize={12} fill={T.muted}>{x1.toFixed(1)}</text>
            <circle cx={50} cy={140} r={16} fill="#2563eb15" stroke="#2563eb" strokeWidth={1.5} />
            <text x={50} y={137} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>x₂</text>
            <text x={50} y={148} textAnchor="middle" fontSize={12} fill={T.muted}>{x2.toFixed(1)}</text>

            {/* Connections to hidden */}
            <line x1={66} y1={65} x2={142} y2={65} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={65} x2={142} y2={140} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={140} x2={142} y2={65} stroke={C + "66"} strokeWidth={1} />
            <line x1={66} y1={140} x2={142} y2={140} stroke={C + "66"} strokeWidth={1} />

            {/* Hidden layer */}
            <circle cx={158} cy={65} r={16} fill={C + "20"} stroke={C} strokeWidth={1.5} />
            <text x={158} y={62} textAnchor="middle" fontSize={12} fill={C} fontWeight={700}>h₁</text>
            <text x={158} y={73} textAnchor="middle" fontSize={12} fill={T.muted}>{h1.toFixed(3)}</text>
            <circle cx={158} cy={140} r={16} fill={C + "20"} stroke={C} strokeWidth={1.5} />
            <text x={158} y={137} textAnchor="middle" fontSize={12} fill={C} fontWeight={700}>h₂</text>
            <text x={158} y={148} textAnchor="middle" fontSize={12} fill={T.muted}>{h2.toFixed(3)}</text>

            {/* Connections to output */}
            <line x1={174} y1={65} x2={245} y2={100} stroke={C + "66"} strokeWidth={1} />
            <line x1={174} y1={140} x2={245} y2={100} stroke={C + "66"} strokeWidth={1} />

            {/* Output layer */}
            <circle cx={262} cy={100} r={18} fill={output > 0.5 ? "#05966920" : "#dc262620"}
              stroke={output > 0.5 ? "#059669" : "#dc2626"} strokeWidth={2} />
            <text x={262} y={97} textAnchor="middle" fontSize={12} fill={output > 0.5 ? "#059669" : "#dc2626"} fontWeight={800}>
              {output.toFixed(3)}
            </text>
            <text x={262} y={109} textAnchor="middle" fontSize={12} fill={T.muted}>output</text>

            {/* Labels */}
            <text x={50} y={svgH - 5} textAnchor="middle" fontSize={11} fill={T.dim}>Input</text>
            <text x={158} y={svgH - 5} textAnchor="middle" fontSize={11} fill={T.dim}>Hidden</text>
            <text x={262} y={svgH - 5} textAnchor="middle" fontSize={11} fill={T.dim}>Output</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Input x₁" value={inputVal} min={-2} max={2} step={0.1} onChange={setInputVal} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>FORWARD PASS CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Each layer transforms data through weighted sums + activations.
            The hidden layer creates intermediate representations — it "re-encodes" the input in a way that makes the output
            task easier. More layers = more abstraction levels = can learn more complex patterns.
          </div>

          <CommonMistakes mistakes={[
            "Thinking more layers always means better — deep networks need more data to train and are prone to vanishing gradients. Start shallow and add depth only if needed.",
            "Using sigmoid in hidden layers of deep networks — sigmoid causes vanishing gradients in deep networks. Use ReLU or its variants (LeakyReLU, GELU) for hidden layers.",
            "Not understanding the parameter count — a network with 2 inputs, 2 hidden, 1 output has 2*2 + 2 + 2*1 + 1 = 9 parameters. A slightly bigger network explodes in parameter count quickly.",
            "Treating the network as a black box — always inspect hidden layer activations. They often reveal what intermediate features the network has learned."
          ]} />

          <MatSciExample text="MEGNet (MatErials Graph Network) uses multiple neural network layers to learn atomic-level representations of crystal structures. The hidden layers progressively encode local bonding environment, then neighborhood coordination, then global crystal properties. Each layer builds a more abstract representation, exactly like our simple 2-layer example here but with graph convolutions." />
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
  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Backpropagation" formula="w_new = w_old − η × ∂L/∂w">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A teacher tracing back which step caused the wrong answer on a math test. If the final answer is wrong,
          the teacher checks each intermediate step to find where the biggest mistake was, then corrects those steps the most.
          Step 3 caused 60% of the error? Fix it aggressively. Step 1 only caused 5%? Barely touch it. This proportional blame assignment is exactly what backpropagation computes mathematically using the chain rule of calculus.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a factory producing defective widgets. You trace the defect backwards through the assembly line: the painting station added 10% of the defect, the welding station added 30%, the cutting station added 60%. You then improve each station proportionally. After each round of improvements, you run the line again and re-measure — that is one training epoch.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Forward pass: compute the output by passing inputs through all layers, recording every intermediate value (z, h, output).",
        "Compute the loss: compare the output to the true target value. Here, loss = (y_true - y_hat)^2.",
        "Backward pass: starting from the loss, compute dL/d(output), then use the chain rule to propagate gradients backwards through each layer.",
        "For each weight, compute dL/dw — this tells you how much the loss changes if you nudge that weight slightly. Large gradient means large blame.",
        "Update every weight: w_new = w_old - learning_rate * dL/dw. This is gradient descent — move each weight in the direction that decreases the loss. Repeat for many steps until the loss converges."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Loss Over Training Steps</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={20} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fontSize={12} fill={T.muted}>Training Step</text>
            <text x={12} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,12,${svgH / 2})`}>Loss</text>
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
            <text x={svgW - 12} y={svgH - 35} textAnchor="end" fontSize={11} fill="#059669">Target: Loss → 0</text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Learning Rate (η)" value={lr} min={0.05} max={2.0} step={0.05} onChange={setLr} color={C} />
          <SliderRow label="Training Step" value={step} min={0} max={10} step={1}
            onChange={setStep} color={M.accent} format={v => v.toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP {step} CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Backpropagation uses the chain rule of calculus to compute
            how much each weight contributed to the error. The learning rate controls step size — too large and you overshoot,
            too small and training is slow. Watch the loss curve decrease as gradients update the weights.
          </div>

          <CommonMistakes mistakes={[
            "Setting learning rate too high — the loss oscillates wildly or even increases. If loss is not decreasing smoothly, lower the learning rate.",
            "Setting learning rate too low — training takes forever and may get stuck in a local minimum. Use learning rate schedulers that decrease LR over time.",
            "Not monitoring the loss curve — always plot loss vs. step. A flat curve means the model stopped learning (try larger LR or different architecture).",
            "Confusing epochs with steps — one epoch = one pass through the entire dataset. One step = one gradient update (usually on a mini-batch). 100 epochs on 1000 samples with batch size 32 = ~3125 steps."
          ]} />

          <MatSciExample text="When training neural network interatomic potentials (like NequIP or MACE), the loss function includes forces and energies: L = w_E * (E_pred - E_DFT)^2 + w_F * sum(F_pred - F_DFT)^2. Backpropagation computes gradients through the entire potential energy surface model, enabling the network to learn quantum-mechanical-quality force fields from DFT training data." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 12 — Convolutional Neural Network (CNN)
   ════════════════════════════════════════════════════════════════ */
function CNNSection() {
  const C = M.nn;

  const kernel = [[1, 0, -1], [1, 0, -1], [1, 0, -1]];
  const inputPatch = [[2, 1, 0], [3, 2, 1], [4, 3, 2]];
  const convResult = inputPatch.reduce((s, row, i) =>
    s + row.reduce((rs, v, j) => rs + v * kernel[i][j], 0), 0);

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Convolutional Neural Network (CNN)" formula="Conv: Σ(input × kernel)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A Convolutional Neural Network (CNN) is like a magnifying glass sliding across a page, examining small patches one at a time.
          The magnifying glass (kernel) detects local patterns like edges, textures, and shapes. By stacking many layers, the network combines local patterns into global understanding: edges become shapes, shapes become objects.
          <br/><br/><strong>Another way to think about it:</strong> A CNN is like a quality inspector examining a circuit board with a small flashlight, checking each region systematically. The inspector uses the same flashlight (kernel) at every position, looking for the same pattern. Multiple inspectors with different flashlights detect different patterns (vertical edges, horizontal edges, textures). Stacking layers of inspectors builds up from local to global understanding.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "A small kernel (e.g., 3x3 matrix of learnable weights) slides across the input, computing element-wise multiply-and-sum at each position.",
        "Each kernel detects one pattern (vertical edge, horizontal edge, etc.). Multiple kernels detect multiple patterns. The output is a 'feature map' showing where each pattern occurs.",
        "Stacking convolutional layers creates a hierarchy: first layer detects edges, second detects textures, third detects shapes, deeper layers detect complex structures.",
        "Pooling layers (e.g., max pooling) downsample the feature maps, making the representation more compact and translation-invariant.",
        "Final fully-connected layers combine all detected features to make predictions (e.g., classifying a crystal structure image or predicting a property)."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>3×3 Convolution Operation</text>
            {/* Input patch */}
            <text x={70} y={35} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={600}>Input Patch</text>
            {inputPatch.map((row, i) => row.map((v, j) => (
              <g key={`i${i}${j}`}>
                <rect x={30 + j * 28} y={40 + i * 28} width={26} height={26} rx={3} fill="#2563eb11" stroke="#2563eb44" />
                <text x={43 + j * 28} y={57 + i * 28} textAnchor="middle" fontSize={11} fill="#2563eb" fontWeight={600}>{v}</text>
              </g>
            )))}
            {/* Multiply sign */}
            <text x={130} y={75} fontSize={16} fill={T.muted}>×</text>
            {/* Kernel */}
            <text x={200} y={35} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={600}>Kernel</text>
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
            <text x={svgW / 2} y={140} textAnchor="middle" fontSize={12} fill={T.muted}>Element-wise multiply then sum:</text>
            <text x={svgW / 2} y={155} textAnchor="middle" fontSize={11} fill={T.ink} fontFamily="monospace">
              2×1 + 1×0 + 0×(−1) + 3×1 + 2×0 + 1×(−1) + 4×1 + 3×0 + 2×(−1)
            </text>
            <text x={svgW / 2} y={170} textAnchor="middle" fontSize={12} fill={C} fontWeight={700}>
              = 2 + 0 + 0 + 3 + 0 − 1 + 4 + 0 − 2 = {convResult}
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CNN CALCULATION</div>
            <CalcRow eq="Kernel size" result="3 × 3 = 9 params" color={C} />
            <CalcRow eq="2×1 + 1×0 + 0×(−1)" result="2" color={C} />
            <CalcRow eq="3×1 + 2×0 + 1×(−1)" result="2" color={C} />
            <CalcRow eq="4×1 + 3×0 + 2×(−1)" result="2" color={C} />
            <CalcRow eq="Total sum = 2 + 2 + 2" result={convResult.toString()} color={C} />
            <CalcRow eq="This kernel detects" result="vertical edges" color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="CONVOLUTION" value="Local" color={C} sub="spatial patterns" />
            <ResultBox label="PARAMS" value="9" color={C} sub="per 3×3 kernel" />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Convolutional Neural Networks excel at local patterns (crystal structure images,
            electron density maps) by sliding small filters. Weight sharing (same kernel everywhere) makes CNNs parameter-efficient
            and translation-equivariant — a pattern detected at one location is recognized everywhere.
          </div>

          <CommonMistakes mistakes={[
            "Using CNNs when data has no spatial structure — CNNs assume local spatial correlations. For tabular materials data, use tree-based models or feedforward networks instead.",
            "Using kernels that are too large — large kernels capture global patterns but lose locality. Start with 3x3 kernels and stack layers for larger receptive fields.",
            "Forgetting pooling layers — without pooling, the network has too many parameters and is not translation-invariant.",
            "Not using pre-trained models when available — foundation models pre-trained on ImageNet or materials images can be fine-tuned for specific tasks with very little data."
          ]} />

          <MatSciExample text="ALIGNN (Atomistic Line Graph Neural Network) uses graph convolutions (similar to CNN) on crystal structure graphs where atoms are nodes and bonds are edges. Crystal structure images analyzed with 2D CNNs can classify phases, detect grain boundaries, and predict mechanical properties from microstructure images." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   Transformer Section
   ════════════════════════════════════════════════════════════════ */
function TransformerSection() {
  const C = "#9333ea";

  const attnTokens = ["Fe", "O", "forms", "rust"];
  const queryKey = [[0.9, 0.1, 0.0, 0.0], [0.1, 0.7, 0.1, 0.1], [0.0, 0.1, 0.8, 0.1], [0.0, 0.1, 0.1, 0.8]];

  const Q = [[1.0, 0.5], [0.3, 0.8], [0.9, 0.4]];
  const K = [[0.8, 0.6], [0.4, 0.9], [0.7, 0.5]];
  const V = [[0.2, 1.0], [0.9, 0.3], [0.3, 0.8]];
  const d_k = 2;
  const scale = Math.sqrt(d_k);

  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const QKt = Q.map(q => K.map(k => dot(q, k)));
  const QKt_scaled = QKt.map(row => row.map(v => v / scale));
  const softmaxRow = (row) => {
    const exps = row.map(v => Math.exp(v));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  };
  const attnWeights = QKt_scaled.map(row => softmaxRow(row));
  const attnOutput = attnWeights.map(row =>
    V[0].map((_, j) => row.reduce((s, w, k) => s + w * V[k][j], 0))
  );

  const svgW = 500, svgH = 240;

  return (
    <>
    <Card color={C} title="Transformer" formula="Attention(Q,K,V) = softmax(QK^T/√d_k)V">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A Transformer reads the whole page at once and decides which words relate to each other, no matter how far apart they are.
          Unlike a CNN that examines small patches sequentially, the Transformer computes attention scores between every pair of tokens simultaneously.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a meeting where every participant can talk to every other participant at the same time. Each person decides who to listen to most (attention weights). The result is that every person has a context-aware understanding of the entire discussion, not just what their neighbor said.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "For each token, compute Query, Key, and Value vectors by multiplying the embedding with learned weight matrices.",
        "Compute attention scores: dot product of each Query with all Keys, then scale by √d_k.",
        "Apply softmax to get attention weights — a probability distribution over all tokens.",
        "Multiply attention weights by Value vectors and sum to get the output for each token.",
        "Stack multiple layers and use multi-head attention to capture different relationship types."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Self-Attention Weights</text>
            {attnTokens.map((t, i) => (
              <g key={i}>
                <text x={90 + i * 55} y={38} textAnchor="middle" fontSize={12} fill={C} fontWeight={600}>{t}</text>
                <text x={30} y={58 + i * 35} textAnchor="end" fontSize={12} fill={C} fontWeight={600}>{t}</text>
              </g>
            ))}
            {queryKey.map((row, i) => row.map((v, j) => (
              <g key={`a${i}${j}`}>
                <rect x={65 + j * 55} y={44 + i * 35} width={50} height={30} rx={3}
                  fill={`rgba(147,51,234,${v * 0.5})`} stroke={T.border} />
                <text x={90 + j * 55} y={63 + i * 35} textAnchor="middle" fontSize={12} fill={T.ink} fontWeight={600}>
                  {v.toFixed(1)}
                </text>
              </g>
            )))}
            <text x={svgW / 2} y={svgH - 10} textAnchor="middle" fontSize={12} fill={T.muted}>
              Each row shows how much one token "attends" to others
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ATTENTION CALCULATION</div>
            <CalcRow eq="Tokens in sequence" result="4" color={C} />
            <CalcRow eq="Attention(Fe, Fe) = 0.9" result="strong self" color={C} />
            <CalcRow eq="Attention(Fe, O) = 0.1" result="weak" color={C} />
            <CalcRow eq="Attention(O, O) = 0.7" result="strong self" color={C} />
            <CalcRow eq="Each row sums to" result="1.0 (softmax)" color={M.accent} />
            <CalcRow eq="Complexity" result="O(n²) in seq length" color={C} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="ATTENTION" value="Global" color={C} sub="any-to-any" />
            <ResultBox label="COMPLEXITY" value="O(n²)" color={C} sub="in sequence length" />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Transformers excel at long-range relationships
            (atom-atom interactions across a molecule). Unlike CNNs that have limited receptive fields,
            every token can attend to every other token directly.
          </div>

          <CommonMistakes mistakes={[
            "Ignoring computational cost — attention is O(n²) in sequence length. For very large crystal structures (1000+ atoms), this becomes expensive.",
            "Not using pre-trained models when available — foundation models like MatBERT are pre-trained on millions of materials papers and can be fine-tuned with very little data.",
            "Confusing self-attention with cross-attention — self-attention relates tokens within the same sequence; cross-attention relates tokens between two different sequences.",
            "Assuming Transformers are always better than GNNs — for small crystal datasets (< 10k structures), simpler GNNs often outperform Transformers."
          ]} />

          <MatSciExample text="The Crystal Transformer applies self-attention to atomic environments, allowing each atom to attend to every other atom regardless of distance — capturing long-range electrostatic and strain interactions that local GNNs miss. MatBERT, a BERT-based Transformer, processes materials science text for named entity recognition and classification." />
        </div>
      </div>
    </Card>

    {/* ── Self-Attention Numerical Example ── */}
    <Card color={C} title="Self-Attention — Full Numerical Example" formula="Attention(Q,K,V) = softmax(QK^T/√d_k)V">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Setup: Three Atoms in FeO</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Consider three atoms in an FeO crystal: Fe(1), O, Fe(2). Each atom is represented by an embedding vector of dimension d=2.
          We multiply each embedding by three learned weight matrices to get Query (Q), Key (K), and Value (V) vectors.
          For simplicity, we use d_k = 2 (in practice, d_k = 64 or 128). We will compute every step of the attention mechanism by hand.
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP 1: Q, K, V MATRICES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ label: "Q (Query)", mat: Q, color: "#dc2626" }, { label: "K (Key)", mat: K, color: "#2563eb" }, { label: "V (Value)", mat: V, color: "#059669" }].map(({ label, mat, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8 }}>
                    {["Fe₁", " O ", "Fe₂"].map((atom, i) => (
                      <div key={i} style={{ color: T.ink }}>
                        <span style={{ fontSize: 8, color: T.muted }}>{atom}</span> [{mat[i].map(v => v.toFixed(1)).join(", ")}]
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP 2: QK^T (DOT PRODUCTS)</div>
            <div style={{ fontFamily: "monospace", fontSize: 11, lineHeight: 1.8, color: T.ink }}>
              {["Fe₁", " O ", "Fe₂"].map((rowAtom, i) => (
                <div key={i}>
                  {["Fe₁", " O ", "Fe₂"].map((colAtom, j) => (
                    <div key={j} style={{ marginLeft: 8, fontSize: 11 }}>
                      <span style={{ color: T.muted }}>{rowAtom}·{colAtom}:</span>{" "}
                      {Q[i].map((q, k) => `${q.toFixed(1)}×${K[j][k].toFixed(1)}`).join(" + ")}{" "}
                      = <strong style={{ color: C }}>{QKt[i][j].toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP 3: SCALE BY √d_k = √2 = {scale.toFixed(3)}</div>
            {Q.map((_, i) => (
              <CalcRow key={i} eq={`Row ${i + 1}: [${QKt[i].map(v => v.toFixed(2)).join(", ")}] / ${scale.toFixed(3)}`}
                result={`[${QKt_scaled[i].map(v => v.toFixed(3)).join(", ")}]`} color={C} />
            ))}
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP 4: SOFTMAX (EACH ROW)</div>
            {attnWeights.map((row, i) => (
              <CalcRow key={i} eq={`softmax(row ${i + 1})`}
                result={`[${row.map(v => v.toFixed(3)).join(", ")}]`} color={C} />
            ))}
            <CalcRow eq="Each row sums to" result="1.000" color={M.accent} />
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STEP 5: MULTIPLY BY V</div>
            {attnOutput.map((row, i) => (
              <CalcRow key={i} eq={`Output atom ${i + 1} = Σ(attn × V)`}
                result={`[${row.map(v => v.toFixed(3)).join(", ")}]`} color={C} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="Fe₁ → Fe₁" value={attnWeights[0][0].toFixed(2)} color={C} sub="self-attention" />
            <ResultBox label="Fe₁ → O" value={attnWeights[0][1].toFixed(2)} color={M.accent} sub="cross-atom" />
            <ResultBox label="O → Fe₂" value={attnWeights[1][2].toFixed(2)} color={C} sub="cross-atom" />
          </div>
        </div>
      </div>
    </Card>
    </>
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

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Feature Engineering" formula="Material → numerical feature vector">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Describing a house with numbers before predicting its price: square footage, number of bedrooms, age, location score.
          Similarly, we describe a material with numbers: atomic mass, electronegativity, radius — so ML can work with it.
          Just as a real estate agent knows which features matter (location, square footage) and which do not (wall color), a materials scientist must choose features that capture the relevant physics.
          <br/><br/><strong>Another way to think about it:</strong> You cannot feed a crystal structure directly into a spreadsheet. Feature engineering is the translation step — converting a chemical formula like "GaAs" into a row of numbers [mean_EN=1.99, delta_EN=0.37, mean_mass=72.3, ...] that a machine learning algorithm can process. The quality of this translation determines the ceiling of your ML model's performance.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Start with the chemical formula (e.g., CdTe, GaAs, ZnO) and look up elemental properties from a periodic table database.",
        "For each element, retrieve properties: electronegativity, atomic mass, covalent radius, ionization energy, electron affinity, etc.",
        "Compute compositional statistics: mean, difference, weighted average, min, max of each elemental property across the compound's elements.",
        "The difference features (like delta_EN) capture bond character — large delta_EN means ionic bonding; small means covalent.",
        "Assemble all computed numbers into a fixed-length feature vector. Every material, regardless of its complexity, becomes a single row of numbers that ML can process."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {compounds.map((comp, i) => (
              <button key={i} onClick={() => setCompound(i)}
                style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: compound === i ? C : T.surface, color: compound === i ? "#fff" : T.muted,
                  border: `1px solid ${compound === i ? C : T.border}`, fontWeight: 700 }}>{comp.name}</button>
            ))}
          </div>

          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>{c.name} — Elemental Properties</text>
            {/* Element A */}
            <rect x={30} y={30} width={130} height={140} rx={8} fill={C + "10"} stroke={C + "44"} />
            <text x={95} y={50} textAnchor="middle" fontSize={14} fill={C} fontWeight={800}>{c.a}</text>
            <text x={95} y={65} textAnchor="middle" fontSize={12} fill={T.muted}>Z = {c.Za}</text>
            <text x={95} y={80} textAnchor="middle" fontSize={12} fill={T.muted}>Mass = {c.ma}</text>
            <text x={95} y={95} textAnchor="middle" fontSize={12} fill={T.muted}>EN = {c.ena}</text>
            <text x={95} y={110} textAnchor="middle" fontSize={12} fill={T.muted}>r = {c.ra} Å</text>
            {/* Arrow */}
            <text x={170} y={100} fontSize={14} fill={T.dim}>+</text>
            {/* Element B */}
            <rect x={185} y={30} width={130} height={140} rx={8} fill={M.accent + "10"} stroke={M.accent + "44"} />
            <text x={250} y={50} textAnchor="middle" fontSize={14} fill={M.accent} fontWeight={800}>{c.b}</text>
            <text x={250} y={65} textAnchor="middle" fontSize={12} fill={T.muted}>Z = {c.Zb}</text>
            <text x={250} y={80} textAnchor="middle" fontSize={12} fill={T.muted}>Mass = {c.mb}</text>
            <text x={250} y={95} textAnchor="middle" fontSize={12} fill={T.muted}>EN = {c.enb}</text>
            <text x={250} y={110} textAnchor="middle" fontSize={12} fill={T.muted}>r = {c.rb} Å</text>
            {/* Arrow to feature vector */}
            <text x={svgW / 2} y={185} textAnchor="middle" fontSize={12} fill={C} fontWeight={700}>
              → Feature Vector: [{meanEN.toFixed(2)}, {diffEN.toFixed(2)}, {meanMass.toFixed(1)}, {meanRadius.toFixed(2)}, ...]
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>FEATURE CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The choice of features matters more than the choice of
            algorithm. Good features capture the physics: electronegativity difference tells about bond ionicity,
            mean atomic radius relates to lattice constant. Feature engineering is where domain knowledge meets ML.
          </div>

          <CommonMistakes mistakes={[
            "Using raw chemical formulas as input — ML needs numbers, not strings. 'GaAs' means nothing to an algorithm until you convert it to numerical features.",
            "Including redundant features — if you include both atomic number and number of electrons (which are equal for neutral atoms), you add noise without information.",
            "Ignoring structural features — composition-only features miss crucial information. Two materials with the same composition but different crystal structures (polymorphs) have different properties.",
            "Not normalizing features — if mass ranges from 1–238 and EN ranges from 0.7–4.0, the mass feature will dominate distance-based algorithms simply due to scale."
          ]} />

          <MatSciExample text="Matminer is a Python library that automates feature engineering for materials science. Its 'ElementProperty' featurizer can generate 60+ features from a composition string in one line of code. The Magpie feature set (mean, std, min, max, range, mode of 22 elemental properties) is one of the most widely used and produces 132 features per composition." />
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

  const svgW = 500, svgH = 240;
  const axMin = 0, axMax = 4;
  const sx = (v) => 40 + (v - axMin) / (axMax - axMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - axMin) / (axMax - axMin) * (svgH - 50);

  return (
    <Card color={C} title="Bandgap Prediction" formula="MAE = Σ|pred − actual| / N">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Showing a student 8 solved examples and then asking them to predict the 9th. The closer their answers
          match the actual values, the better they have learned the concept. The parity plot shows predicted vs actual.
          If all points fall on the diagonal (y = x line), predictions are perfect. Points scattered far from the diagonal indicate poor model performance.
          <br/><br/><strong>Another way to think about it:</strong> Imagine you are a weather forecaster. Your credibility depends on how close your predictions are to the actual temperatures. If you predict 72F and it is 73F, that is great (MAE = 1). If you predict 72F and it is 95F, your model is terrible. The MAE and R-squared metrics quantify exactly how "off" your predictions are on average.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Train a regression model on labeled data: input = compositional features, output = known bandgap values.",
        "For each material in the test set, the model outputs a predicted bandgap (e.g., Si predicted = 1.15 eV).",
        "Compare each prediction to the actual experimental value (Si actual = 1.12 eV). The difference is the residual error.",
        "Compute summary metrics: MAE = average of |predicted - actual| for all materials. R-squared = 1 - (sum of squared residuals)/(total variance).",
        "Plot the parity plot: actual on x-axis, predicted on y-axis. Points on the diagonal = perfect. Systematic offsets suggest bias; random scatter suggests noise."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Parity Plot: Predicted vs Actual Bandgap</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={10} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={12} fill={T.muted}>Actual (eV)</text>
            <text x={10} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,10,${svgH / 2})`}>Predicted (eV)</text>
            {/* Perfect line */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(4)} y2={sy(4)} stroke={T.dim} strokeWidth={1} strokeDasharray="4,3" />
            {/* Data points */}
            {predicted.map((p, i) => {
              const offsets = [
                { dx: 10, dy: -8 },   // Si
                { dx: 10, dy: 14 },   // Ge — below to avoid InP
                { dx: 10, dy: -8 },   // GaAs
                { dx: 10, dy: -8 },   // CdTe
                { dx: -35, dy: -8 },  // ZnO — left to avoid GaN
                { dx: 10, dy: 14 },   // InP — below
                { dx: 10, dy: -8 },   // GaN
                { dx: -30, dy: 14 },  // AlAs — lower left
              ];
              const off = offsets[i] || { dx: 10, dy: -8 };
              return (
                <g key={i}>
                  <circle cx={sx(p.actual)} cy={sy(p.pred)} r={6} fill={C + "44"} stroke={C} strokeWidth={1.5} />
                  <text x={sx(p.actual) + off.dx} y={sy(p.pred) + off.dy} fontSize={12} fill={C} fontWeight={600}>{p.name}</text>
                </g>
              );
            })}
            {/* Axis ticks */}
            {[0, 1, 2, 3, 4].map(v => (
              <g key={v}>
                <text x={sx(v)} y={svgH - 14} textAnchor="middle" fontSize={12} fill={T.ink}>{v}</text>
                <text x={32} y={sy(v) + 4} textAnchor="end" fontSize={12} fill={T.ink}>{v}</text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Model Bias Adjustment (eV)" value={bias} min={-0.5} max={0.5} step={0.01}
            onChange={setBias} color={C} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Points on the diagonal mean perfect predictions.
            MAE tells you the average error in eV. R-squared near 1 means the model explains most of the variance.
            Materials science ML typically achieves MAE of 0.1–0.3 eV for bandgap prediction.
          </div>

          <CommonMistakes mistakes={[
            "Reporting training error instead of test error — training MAE is always optimistically low. Always report metrics on held-out test data.",
            "Comparing R-squared across different datasets — R-squared depends on the variance of the target. An R-squared of 0.9 on wide-gap materials is easier than 0.9 on a narrow subset.",
            "Ignoring systematic bias — if all predictions are 0.3 eV too high, the MAE looks bad but is easily fixed with a simple offset correction.",
            "Using DFT bandgaps as 'ground truth' — DFT-PBE systematically underestimates bandgaps. Models trained on PBE data will inherit this bias. Use experimental values or higher-level theory (HSE06, GW) when possible."
          ]} />

          <MatSciExample text="The AFLOW-ML framework predicts electronic bandgaps for inorganic compounds with MAE around 0.3 eV using gradient-boosted trees on compositional features. For more accurate predictions, structure-aware models like CGCNN achieve MAE around 0.1 eV by learning directly from crystal structure graphs. These predictions can screen thousands of candidate solar cell absorbers in minutes." />
        </div>
      </div>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════
   Autoencoder (Variational) Section
   ════════════════════════════════════════════════════════════════ */
function AutoencoderSection() {
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

  /* ── VAE ELBO numerical example ── */
  const x_orig = [0.8, 0.6, 0.3];
  const x_recon = [0.75, 0.58, 0.35];
  const reconLoss = x_orig.reduce((s, v, i) => s + (v - x_recon[i]) ** 2, 0);
  const mu = [0.5, -0.3];
  const logvar = [-0.5, -0.8];
  const klTerms = mu.map((m, i) => -0.5 * (1 + logvar[i] - m * m - Math.exp(logvar[i])));
  const klTotal = klTerms.reduce((a, b) => a + b, 0);
  const elboLoss = reconLoss + klTotal;

  const svgW = 500, svgH = 240;
  const sx = (v) => svgW / 2 + v * 60;
  const sy = (v) => svgH / 2 - v * 55;

  return (
    <>
    <Card color={C} title="Variational Autoencoder (VAE)" formula="Encoder → Latent z → Decoder">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A recipe generator: compress known recipes into a "flavor space" (latent space), then explore new points in that
          space to generate novel recipes. The VAE does the same — encodes materials into a compact representation,
          then decodes new points back into material compositions.
          Nearby points in latent space correspond to similar materials, so you can smoothly interpolate between known materials to discover new ones.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a color wheel where every paint color you have ever mixed is a point. The encoder maps each paint mixture to coordinates on the wheel. The decoder converts any point on the wheel back to a paint mixture recipe. By exploring empty regions of the wheel, you can generate novel colors (materials) that no one has mixed before, with predictable properties based on their location.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Encoder: take a known material (e.g., GaAs with bandgap 1.42 eV) and compress its features into a low-dimensional latent vector z = (z1, z2).",
        "The latent space is organized so that similar materials cluster together. Materials with similar bandgaps will have nearby latent vectors.",
        "Decoder: given any point z in latent space, reconstruct the material properties. This is the generative part — you can decode points that do not correspond to any known material.",
        "Explore the latent space: move between known materials (interpolation) or venture into unexplored regions (extrapolation) to generate novel candidate materials.",
        "Validate: the decoded properties are predictions. Promising candidates (e.g., predicted bandgap in solar cell range 1.1–1.7 eV) are flagged for DFT verification or experimental synthesis."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>2D Latent Space</text>
            {/* Axes */}
            <line x1={20} y1={svgH / 2} x2={svgW - 10} y2={svgH / 2} stroke={T.border} strokeDasharray="3,3" />
            <line x1={svgW / 2} y1={20} x2={svgW / 2} y2={svgH - 15} stroke={T.border} strokeDasharray="3,3" />
            <text x={svgW - 10} y={svgH / 2 - 5} textAnchor="end" fontSize={11} fill={T.dim}>z₁</text>
            <text x={svgW / 2 + 5} y={25} fontSize={11} fill={T.dim}>z₂</text>
            {/* Known materials */}
            {knownMaterials.map((m, i) => (
              <g key={i}>
                <circle cx={sx(m.lx)} cy={sy(m.ly)} r={6} fill={C + "33"} stroke={C} strokeWidth={1.5} />
                <text x={sx(m.lx)} y={sy(m.ly) - 9} textAnchor="middle" fontSize={11} fill={C} fontWeight={600}>{m.name}</text>
              </g>
            ))}
            {/* Current point */}
            <circle cx={sx(latentX)} cy={sy(latentY)} r={7} fill="#dc262644" stroke="#dc2626" strokeWidth={2} />
            <text x={sx(latentX)} y={sy(latentY) - 10} textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={700}>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>DECODE CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> The latent space organizes materials by similarity.
            Nearby points have similar properties. By exploring empty regions between known materials, we can propose
            novel compositions with target properties — this is inverse materials design.
          </div>

          <MatSciExample text="iMatGen (inverse Materials Generator) uses a VAE trained on crystal structure images to generate new 2D van der Waals materials. The encoder compresses crystal structures into a 20-dimensional latent space, and the decoder generates new crystal structure images. Several VAE-generated structures were validated by DFT calculations to be thermodynamically stable — true computational discovery of new materials." />
        </div>
      </div>
    </Card>

    {/* ── VAE ELBO Loss Deep Dive ── */}
    <Card color={C} title="Variational Autoencoder Loss — ELBO" formula="L = Reconstruction + KL Divergence">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>The ELBO (Evidence Lower Bound)</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          The VAE loss has two parts that fight each other in a productive tension:
          <br/><strong>1. Reconstruction loss:</strong> How well can the decoder rebuild the original input from the latent code? This is measured as the squared difference between input and output. Low reconstruction loss means the VAE is faithful.
          <br/><strong>2. KL divergence:</strong> How close is the learned latent distribution to a standard normal N(0,1)? This regularizes the latent space, preventing the encoder from memorizing each material at an isolated point. It forces nearby latent codes to represent similar materials.
          <br/><br/>The balance between these two terms is crucial: too much reconstruction focus leads to memorization (no generalization); too much KL focus leads to blurry, generic outputs.
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>ENCODER ARCHITECTURE (TYPICAL)</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
              <strong>Input:</strong> Composition vector x = [{x_orig.join(", ")}] (3 elements)
              <br/><strong>Layer 1:</strong> Linear(3 → 64) + ReLU — expand to richer representation
              <br/><strong>Layer 2:</strong> Linear(64 → 32) + ReLU — compress
              <br/><strong>Layer 3:</strong> Linear(32 → 16) + ReLU — compress further
              <br/><strong>Output:</strong> Two heads:
              <br/>&nbsp;&nbsp;μ = Linear(16 → 2) outputs [{mu.join(", ")}]
              <br/>&nbsp;&nbsp;log σ² = Linear(16 → 2) outputs [{logvar.join(", ")}]
              <br/><strong>Sampling:</strong> z = μ + σ × ε, where ε ~ N(0,1) (reparameterization trick)
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>DECODER ARCHITECTURE (TYPICAL)</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
              <strong>Input:</strong> Latent vector z (dimension 2)
              <br/><strong>Layer 1:</strong> Linear(2 → 16) + ReLU — begin expanding
              <br/><strong>Layer 2:</strong> Linear(16 → 32) + ReLU — expand further
              <br/><strong>Layer 3:</strong> Linear(32 → 64) + ReLU — near original dimension
              <br/><strong>Output:</strong> Linear(64 → 3) + Sigmoid — reconstruct x
              <br/><strong>Reconstructed:</strong> x' = [{x_recon.join(", ")}]
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>RECONSTRUCTION LOSS (MSE)</div>
            <CalcRow eq={`x = [${x_orig.join(", ")}]`} result="original" color={C} />
            <CalcRow eq={`x' = [${x_recon.join(", ")}]`} result="reconstructed" color={C} />
            {x_orig.map((v, i) => (
              <CalcRow key={i} eq={`(${v} − ${x_recon[i]})²`} result={(v - x_recon[i]).toFixed(2) + "² = " + ((v - x_recon[i]) ** 2).toFixed(4)} color={C} />
            ))}
            <CalcRow eq={`L_recon = ${x_orig.map((v, i) => ((v - x_recon[i]) ** 2).toFixed(4)).join(" + ")}`} result={reconLoss.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>KL DIVERGENCE</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.muted, marginBottom: 6 }}>
              KL = −0.5 × Σ(1 + log σ² − μ² − σ²)
            </div>
            {mu.map((m, i) => (
              <CalcRow key={i} eq={`dim ${i + 1}: −0.5×(1 + ${logvar[i].toFixed(1)} − ${m.toFixed(1)}² − e^${logvar[i].toFixed(1)})`}
                result={klTerms[i].toFixed(4)} color={C} />
            ))}
            <CalcRow eq="KL total" result={klTotal.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>TOTAL ELBO LOSS</div>
            <CalcRow eq={`L_recon = ${reconLoss.toFixed(4)}`} result="fidelity" color={C} />
            <CalcRow eq={`L_KL = ${klTotal.toFixed(4)}`} result="regularization" color={C} />
            <CalcRow eq={`L_total = ${reconLoss.toFixed(4)} + ${klTotal.toFixed(4)}`} result={elboLoss.toFixed(4)} color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="RECON LOSS" value={reconLoss.toFixed(4)} color={C} sub="fidelity" />
            <ResultBox label="KL LOSS" value={klTotal.toFixed(4)} color={M.accent} sub="smoothness" />
            <ResultBox label="TOTAL ELBO" value={elboLoss.toFixed(4)} color="#dc2626" sub="minimize" />
          </div>

          <CommonMistakes mistakes={[
            "Expecting the decoder to produce physically valid materials every time — many decoded points may correspond to unstable or unsynthesizable compositions. Always validate with DFT or thermodynamic analysis.",
            "Using too few latent dimensions — if the latent space is too small, different materials get mapped to the same point (information loss). Too many dimensions make it sparse.",
            "Ignoring KL collapse — if the KL term dominates early in training, the encoder may ignore the input and always output z near zero. Use KL annealing: start with low KL weight and gradually increase it.",
            "Ignoring the reconstruction loss — if the VAE cannot accurately reconstruct known materials, its predictions for novel materials will be even less reliable."
          ]} />
        </div>
      </div>
    </Card>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Diffusion Model Section
   ════════════════════════════════════════════════════════════════ */
function DiffusionModelSection() {
  const C = "#9333ea";

  const [diffStep, setDiffStep] = useState(0);

  const x0 = [0.50, 0.25, 0.25];
  const diffSteps = [0, 10, 50, 100];
  const noiseAtStep = (t) => {
    const beta = 0.0001 + (0.02 - 0.0001) * (t / 100);
    const alpha_bar = Math.exp(-0.5 * beta * t);
    const noise_scale = Math.sqrt(1 - alpha_bar);
    const rng = seededRandom(t * 137 + 42);
    return x0.map(v => {
      const noise = (rng() - 0.5) * 2 * noise_scale;
      return Math.sqrt(alpha_bar) * v + noise;
    });
  };
  const diffusionSnapshots = diffSteps.map(t => ({ t, values: t === 0 ? [...x0] : noiseAtStep(t) }));

  return (
    <>
    <Card color={C} title="Diffusion Models for Materials" formula="x_t = √ᾱ_t·x₀ + √(1−ᾱ_t)·ε">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Imagine dropping ink into a glass of water. Over time, the ink spreads out until the water is uniformly cloudy — this is the <strong>forward process</strong> (adding noise). Now imagine watching a video of this in reverse: the cloudy water gradually organizes back into a sharp ink drop — this is the <strong>reverse process</strong> (denoising).
          <br/><br/>A diffusion model learns to reverse the noising process. Given pure noise, it learns to iteratively remove noise step by step until a valid crystal structure emerges. This is remarkably powerful because the model can generate diverse, high-quality structures by starting from different random noise samples.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Forward process: Start with a clean crystal structure x₀. At each timestep t, add a small amount of Gaussian noise. After T steps (typically T=100 to 1000), the structure becomes pure random noise.",
        "The noise schedule β₁, β₂, ..., β_T controls how much noise is added at each step. A linear schedule increases β from 0.0001 to 0.02. The cumulative product ᾱ_t determines total noise at step t.",
        "Training: The neural network (usually a U-Net or Transformer) learns to predict the noise ε that was added at each step. Given noisy x_t and timestep t, it outputs ε̂ ≈ ε.",
        "Loss function: Simple MSE between predicted and actual noise: L = ||ε − ε̂(x_t, t)||². Despite its simplicity, this objective is mathematically equivalent to maximizing a variational lower bound.",
        "Reverse process (generation): Start from pure noise x_T ~ N(0,I). At each step, use the trained model to predict and subtract the noise: x_{t-1} = f(x_t, ε̂(x_t, t)). After T reverse steps, you get a clean crystal structure."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          {/* Diffusion visualization */}
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>FORWARD PROCESS: NOISING Cu₂ZnSnS₄-LIKE VECTOR</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink, marginBottom: 8 }}>
              Starting composition vector x₀ = [0.50, 0.25, 0.25] representing (Cu, Zn, Sn) fractions.
            </div>
            <SliderRow label="Diffusion timestep t" value={diffStep} min={0} max={3} step={1}
              onChange={setDiffStep} color={C} format={v => `t=${diffSteps[v]}`} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {diffusionSnapshots.map((snap, i) => (
                <div key={i} style={{
                  flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 6,
                  background: i === diffStep ? C + "15" : T.panel,
                  border: `1.5px solid ${i === diffStep ? C : T.border}`,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: i === diffStep ? C : T.muted }}>t={snap.t}</div>
                  {snap.values.map((v, j) => (
                    <div key={j} style={{ fontSize: 10, fontFamily: "monospace", color: T.ink }}>{v.toFixed(3)}</div>
                  ))}
                  <div style={{ fontSize: 8, color: T.muted, marginTop: 2 }}>{snap.t === 0 ? "clean" : snap.t === 100 ? "~noise" : "noisy"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Forward process math */}
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>NOISE SCHEDULE CALCULATION</div>
            <CalcRow eq="β_min = 0.0001, β_max = 0.02" result="linear schedule" color={C} />
            <CalcRow eq="β_t = β_min + (β_max − β_min) × t/T" result="noise per step" color={C} />
            <CalcRow eq="α_t = 1 − β_t" result="signal retained" color={C} />
            <CalcRow eq="ᾱ_t = α₁ × α₂ × ... × α_t" result="cumulative signal" color={C} />
            <CalcRow eq="t=0: ᾱ = 1.000" result="100% signal" color={C} />
            <CalcRow eq="t=10: ᾱ ≈ 0.990" result="99% signal" color={C} />
            <CalcRow eq="t=50: ᾱ ≈ 0.607" result="61% signal" color={C} />
            <CalcRow eq="t=100: ᾱ ≈ 0.135" result="14% signal" color={M.accent} />
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.muted, marginTop: 6 }}>
              At t=100, only 14% of the original signal remains — the structure is almost pure noise.
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>REVERSE PROCESS: DENOISING</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
              Starting from noise x₁₀₀ ~ N(0, I), the model iteratively denoises:
            </div>
            <CalcRow eq="Step 100 → 99: predict ε̂₁₀₀" result="subtract noise" color={C} />
            <CalcRow eq="Step 99 → 98: predict ε̂₉₉" result="subtract noise" color={C} />
            <CalcRow eq="..." result="..." color={T.muted} />
            <CalcRow eq="Step 1 → 0: predict ε̂₁" result="final structure" color={C} />
            <CalcRow eq="x̂₀ = denoised output" result="[0.49, 0.26, 0.24]" color={M.accent} />
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.muted, marginTop: 6 }}>
              The denoised output [0.49, 0.26, 0.24] is close to a Cu₂ZnSnS₄-like composition. In practice, the model also generates lattice parameters and atom positions, not just compositions.
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>MATERIALS DIFFUSION MODELS</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
              <strong style={{ color: C }}>CDVAE</strong> (Crystal Diffusion VAE): Combines a VAE for composition and a diffusion process for atom coordinates. First generates the number of atoms and lattice, then iteratively places atoms via diffusion. Generates stable crystals validated by DFT.
              <br/><br/><strong style={{ color: C }}>DiffCSP</strong> (Diffusion for Crystal Structure Prediction): Given a composition, predicts the crystal structure by diffusing atom positions and lattice parameters jointly. Achieves state-of-the-art match rates on known structures.
              <br/><br/><strong style={{ color: C }}>MatterGen</strong> (Microsoft): A diffusion model that generates novel inorganic materials conditioned on target properties (bandgap, bulk modulus). It diffuses atom types, positions, and lattice simultaneously.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="FORWARD" value="Add noise" color={C} sub="structure → noise" />
            <ResultBox label="REVERSE" value="Remove noise" color={M.accent} sub="noise → structure" />
          </div>
        </div>
      </div>
    </Card>

    {/* ── GAN Brief + Comparison Table ── */}
    <Card color={C} title="Generative Adversarial Networks & Model Comparison" formula="VAE vs GAN vs Diffusion">
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Generative Adversarial Networks (GANs)</div>
            <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
              A GAN is a two-player game between a <strong>Generator</strong> (G) and a <strong>Discriminator</strong> (D):
              <br/>G takes random noise z and generates a fake material.
              <br/>D receives both real and generated materials and tries to tell them apart.
              <br/>G improves by trying to fool D; D improves by getting better at detecting fakes.
              <br/><br/>After training, G can generate realistic materials from noise. GANs produce sharp outputs but are notoriously hard to train — they suffer from mode collapse (generating only a few types of materials) and training instability.
              <br/><br/>In materials science, CrystalGAN generates ternary compounds by training on known binary compounds, and MatGAN generates alloy compositions with target properties.
            </div>
          </div>

          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>GAN TRAINING CALCULATION</div>
            <CalcRow eq="Generator loss: −log(D(G(z)))" result="fool discriminator" color={C} />
            <CalcRow eq="Discriminator loss (real): −log(D(x))" result="detect real" color={C} />
            <CalcRow eq="Discriminator loss (fake): −log(1−D(G(z)))" result="detect fake" color={C} />
            <CalcRow eq="Nash equilibrium: D(x) = 0.5" result="cannot distinguish" color={M.accent} />
            <CalcRow eq="Real material: D(SrTiO₃) = 0.95" result="clearly real" color={C} />
            <CalcRow eq="Fake material: D(XyZw₇) = 0.12" result="clearly fake" color={C} />
            <CalcRow eq="Good fake: D(BaTiO₃-like) = 0.48" result="almost fooled" color={M.accent} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>COMPARISON: VAE vs GAN vs DIFFUSION</div>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  {["Property", "VAE", "GAN", "Diffusion"].map(h => (
                    <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: C, fontWeight: 700, fontSize: 9 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Training", "Stable", "Unstable", "Stable"],
                  ["Output quality", "Blurry", "Sharp", "Sharp"],
                  ["Diversity", "Good", "Mode collapse risk", "Excellent"],
                  ["Latent space", "Smooth, structured", "No explicit", "No explicit"],
                  ["Speed (generate)", "Fast (1 pass)", "Fast (1 pass)", "Slow (T steps)"],
                  ["Loss function", "ELBO (recon + KL)", "Adversarial", "MSE on noise"],
                  ["Materials use", "iMatGen, FTCP", "CrystalGAN", "CDVAE, MatterGen"],
                  ["Best for", "Interpolation", "Sharp samples", "Diverse generation"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 === 0 ? T.surface : T.panel }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "4px 6px", fontSize: 10, color: j === 0 ? C : T.ink, fontWeight: j === 0 ? 700 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="VAE" value="Smooth" color={C} sub="latent space" />
            <ResultBox label="GAN" value="Sharp" color={M.accent} sub="output quality" />
            <ResultBox label="DIFFUSION" value="Diverse" color="#dc2626" sub="sample variety" />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> In 2024–2025, diffusion models have become the dominant approach for generative materials design.
            CDVAE, DiffCSP, and MatterGen all use diffusion and achieve the best results for crystal structure generation.
            VAEs remain useful when you need a structured latent space (e.g., for optimization or interpolation).
            GANs are less common in materials science due to training instability, but are still used for certain molecular generation tasks.
          </div>

          <CommonMistakes mistakes={[
            "Using GANs without checking for mode collapse — always verify that the generated materials are diverse, not just many copies of a few stable structures.",
            "Thinking diffusion models are too slow — modern schedulers (DDIM, DPM-Solver) reduce 1000 steps to 20–50 steps with minimal quality loss.",
            "Comparing models only on generation quality — also check validity (are generated structures physically reasonable?), uniqueness (are they diverse?), and novelty (are they truly new, not memorized from training data?).",
            "Not conditioning on target properties — unconditional generation produces random materials. For materials discovery, use conditional generation (e.g., generate a material with bandgap = 1.5 eV and bulk modulus > 100 GPa)."
          ]} />

          <MatSciExample text="MatterGen (Microsoft, 2024) generates novel inorganic crystals by diffusing atom types, coordinates, and lattice parameters simultaneously. Conditioned on target properties, it generated 15 previously unknown materials that were subsequently synthesized in the lab. CDVAE demonstrated that diffusion-based crystal generation produces 2× more stable structures than VAE-only approaches on the Materials Project dataset." />
        </div>
      </div>
    </Card>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   Active Learning — Al-Cu Alloy Optimization
   ════════════════════════════════════════════════════════════════ */
function ActiveLearningSection() {
  const C = "#9333ea";
  const [known, setKnown] = useState([
    { x: 0, y: 30 },
    { x: 4, y: 95 },
    { x: 10, y: 60 },
    { x: 50, y: 45 },
  ]);

  const predict = (xq) => {
    let wSum = 0, wTot = 0;
    known.forEach(p => {
      const d = Math.max(0.5, Math.abs(xq - p.x));
      const w = 1 / (d * d);
      wSum += w * p.y;
      wTot += w;
    });
    return wSum / wTot;
  };

  const uncertainty = (xq) => {
    const minDist = Math.min(...known.map(p => Math.abs(xq - p.x)));
    return minDist * 1.5;
  };

  const candidates = Array.from({ length: 50 }, (_, i) => {
    const x = i * 2;
    return { x, acq: uncertainty(x), pred: predict(x), unc: uncertainty(x) };
  });
  const bestCandidate = candidates.reduce((best, c) => c.acq > best.acq ? c : best, candidates[0]);

  const trueHardness = (x) => {
    return 30 + 70 * Math.exp(-0.5 * ((x - 4) / 2.5) ** 2) - 0.2 * x;
  };

  const addPoint = () => {
    const x = bestCandidate.x;
    const y = trueHardness(x) + (seededRandom(known.length * 7 + 3)() - 0.5) * 5;
    setKnown(prev => [...prev, { x, y: Math.round(y) }]);
  };

  const resetPoints = () => {
    setKnown([
      { x: 0, y: 30 },
      { x: 4, y: 95 },
      { x: 10, y: 60 },
      { x: 50, y: 45 },
    ]);
  };

  const svgW = 500, svgH = 240;
  const xMin = 0, xMax = 100, yMin = 0, yMax = 120;
  const sx = (v) => 40 + (v - xMin) / (xMax - xMin) * (svgW - 60);
  const sy = (v) => svgH - 30 - (v - yMin) / (yMax - yMin) * (svgH - 50);

  const gpPred = predict(bestCandidate.x);
  const gpUnc = uncertainty(bestCandidate.x);

  return (
    <Card color={C} title="Active Learning" formula="Next = argmax acquisition(x)">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy — Bayesian Optimization for Alloy Design</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Goal: find the Al-Cu alloy composition (0–100% Cu) that maximizes hardness. Experiments are expensive — each hardness test takes days.
          Instead of testing all compositions, we use a Gaussian Process (GP) surrogate model that predicts hardness ± uncertainty at untested compositions,
          then pick the most informative composition to test next.
          <br/><br/><strong>Known data:</strong> 0% Cu → hardness 30, 4% Cu → hardness 95, 10% Cu → hardness 60, 50% Cu → hardness 45.
          The GP sees high uncertainty near ~6% Cu (between the peak at 4% and the drop at 10%) — suggesting it next.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Start with 4 measured Al-Cu alloy compositions and their hardness values.",
        "Train a Gaussian Process (GP) surrogate that predicts hardness ± uncertainty at every composition.",
        "The acquisition function scores each untested composition — high uncertainty near the peak at 4% Cu suggests ~6% Cu as the next experiment.",
        "Test the suggested composition, add the result, and retrain the GP.",
        "Repeat until the optimum is found — typically in 8–15 iterations instead of 100+ random experiments."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Al-Cu Alloy Optimization: {known.length} experiments</text>
            <line x1={40} y1={svgH - 30} x2={svgW - 10} y2={svgH - 30} stroke={T.border} />
            <line x1={40} y1={20} x2={40} y2={svgH - 30} stroke={T.border} />
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={12} fill={T.muted}>Cu content (%)</text>
            <text x={12} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,12,${svgH / 2})`}>Hardness (HV)</text>
            {/* True function (hidden from model) */}
            {Array.from({ length: 50 }, (_, i) => {
              const x1 = i * 2;
              const x2 = (i + 1) * 2;
              return <line key={`t${i}`} x1={sx(x1)} y1={sy(trueHardness(x1))} x2={sx(x2)} y2={sy(trueHardness(x2))} stroke={T.dim} strokeWidth={1} strokeDasharray="3,3" />;
            })}
            {/* GP prediction + uncertainty band */}
            {Array.from({ length: 50 }, (_, i) => {
              const xv = i * 2;
              const pred = predict(xv);
              const unc = uncertainty(xv);
              return (
                <g key={`p${i}`}>
                  <line x1={sx(xv)} y1={sy(pred - unc)} x2={sx(xv)} y2={sy(pred + unc)}
                    stroke={C} strokeWidth={2} opacity={0.12} />
                </g>
              );
            })}
            {Array.from({ length: 49 }, (_, i) => {
              const x1 = i * 2, x2 = (i + 1) * 2;
              return <line key={`pr${i}`} x1={sx(x1)} y1={sy(predict(x1))} x2={sx(x2)} y2={sy(predict(x2))} stroke={C} strokeWidth={2} />;
            })}
            {/* Known points */}
            {known.map((p, i) => (
              <g key={i}>
                <circle cx={sx(p.x)} cy={sy(p.y)} r={5} fill={C + "44"} stroke={C} strokeWidth={2} />
                <text x={sx(p.x)} y={sy(p.y) - 8} textAnchor="middle" fontSize={12} fill={C} fontWeight={600}>{p.x}%→{p.y}</text>
              </g>
            ))}
            {/* Suggested next point */}
            <circle cx={sx(bestCandidate.x)} cy={sy(predict(bestCandidate.x))} r={6}
              fill="#dc262644" stroke="#dc2626" strokeWidth={2} />
            <text x={sx(bestCandidate.x)} y={sy(predict(bestCandidate.x)) - 10}
              textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={700}>Next? ({bestCandidate.x}% Cu)</text>
            {/* Axis ticks */}
            {[0, 20, 40, 60, 80, 100].map(v => (
              <g key={v}>
                <line x1={sx(v)} y1={svgH - 30} x2={sx(v)} y2={svgH - 25} stroke={T.dim} />
                <text x={sx(v)} y={svgH - 16} textAnchor="middle" fontSize={11} fill={T.dim}>{v}</text>
              </g>
            ))}
            {[0, 30, 60, 90, 120].map(v => (
              <g key={v}>
                <line x1={35} y1={sy(v)} x2={40} y2={sy(v)} stroke={T.dim} />
                <text x={32} y={sy(v) + 3} textAnchor="end" fontSize={11} fill={T.dim}>{v}</text>
              </g>
            ))}
          </svg>

          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={addPoint}
              style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                background: C, color: "#fff", border: "none", fontWeight: 700 }}>
              Test Suggested Composition
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>GAUSSIAN PROCESS PREDICTION</div>
            <CalcRow eq="Known experiments" result={known.length.toString()} color={C} />
            {known.map((p, i) => (
              <CalcRow key={i} eq={`${p.x}% Cu → hardness`} result={`${p.y} HV`} color={C} />
            ))}
            <CalcRow eq={`Suggested next: ${bestCandidate.x}% Cu`} result={`unc = ${gpUnc.toFixed(1)}`} color="#dc2626" />
            <CalcRow eq={`GP prediction at ${bestCandidate.x}% Cu`} result={`${gpPred.toFixed(1)} ± ${gpUnc.toFixed(1)} HV`} color={C} />
            <CalcRow eq="Strategy" result="Max uncertainty (explore)" color={M.accent} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <ResultBox label="EXPERIMENTS" value={known.length.toString()} color={C} sub="of ~100 possible" />
            <ResultBox label="NEXT TEST" value={`${bestCandidate.x}% Cu`} color="#dc2626" sub="highest uncertainty" />
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Active learning with Bayesian optimization reduces the number of expensive experiments
            needed. The GP uncertainty band (shaded) shows where the model is least confident — near 6% Cu, there is high uncertainty
            close to the peak at 4% Cu. Testing there is the most informative experiment. After 8–15 strategic experiments, the optimal composition is found.
          </div>

          <CommonMistakes mistakes={[
            "Always exploring (high uncertainty) without exploiting (high predicted value) — a good acquisition function balances exploration and exploitation.",
            "Using a model that does not provide uncertainty estimates — Gaussian processes, random forests, and ensemble methods provide uncertainty; a single neural network does not (without special techniques).",
            "Running too few iterations — active learning is iterative. If you only do 2 rounds, you have barely improved over random sampling.",
            "Ignoring batch active learning — in practice, you often want to run several experiments in parallel. Use batch-aware acquisition functions."
          ]} />

          <MatSciExample text="Researchers at NIST used Bayesian active learning to optimize the composition of NiTi-based shape memory alloys. Starting with only 10 experimental measurements, the active learning loop identified compositions with optimal transformation temperatures in just 25 iterations — a task that would have required hundreds of random experiments. This approach is now standard in high-throughput experimental materials discovery." />
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
  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="ML Data Pipeline" formula="Data → Clean → Feature → Split → Train → Evaluate">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Cooking: shopping for ingredients (database) → washing and cleaning (clean) → chopping and measuring
          (featurize) → setting aside a taste test portion (split) → cooking (train) → tasting (evaluate).
          If you skip the washing step, your dish will taste off no matter how good your cooking skills are. Similarly, if you skip data cleaning, your model will learn from noise and errors.
          <br/><br/><strong>Another way to think about it:</strong> Think of building a house. You need a blueprint (pipeline plan), quality materials (clean data), proper tools (algorithms), and an inspection (evaluation). Skipping any step — using rotten wood, ignoring the blueprint, or skipping the final inspection — guarantees a weak structure. An ML pipeline enforces discipline at every stage.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Acquire data: pull from databases (Materials Project, AFLOW, OQMD), literature, or in-house experiments. Record the source and provenance of each data point.",
        "Clean data: remove duplicates, handle missing values (impute or drop), detect and remove outliers, standardize units (all energies in eV, all distances in Angstroms).",
        "Featurize: convert chemical formulas and structures into numerical feature vectors using domain-informed descriptors (Magpie features, structural fingerprints, etc.).",
        "Split data: divide into train (70–80%), validation (10–15%), and test (10–15%) sets. Use stratified splitting to ensure each set has a representative distribution of target values.",
        "Train and evaluate: fit the model on training data, tune hyperparameters on validation data, and report final metrics on the held-out test set. Never touch the test set until the very end."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Pipeline Flow</text>
            {stages.map((s, i) => {
              const x = 20 + (i % 3) * 105;
              const y = i < 3 ? 30 : 110;
              const active = i === stage;
              return (
                <g key={i} onClick={() => setStage(i)} style={{ cursor: "pointer" }}>
                  <rect x={x} y={y} width={95} height={55} rx={8}
                    fill={active ? C + "22" : T.panel} stroke={active ? C : T.border} strokeWidth={active ? 2 : 1} />
                  <text x={x + 47} y={y + 20} textAnchor="middle" fontSize={12} fill={active ? C : T.muted} fontWeight={700}>
                    {s.icon}
                  </text>
                  <text x={x + 47} y={y + 35} textAnchor="middle" fontSize={11} fill={T.muted}>{s.name}</text>
                  <text x={x + 47} y={y + 47} textAnchor="middle" fontSize={11} fill={active ? C : T.dim}>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>STAGE: {cur.name.toUpperCase()}</div>
            <div style={{ fontSize: 14, color: T.ink, marginBottom: 8, lineHeight: 2.0 }}>{cur.desc}</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Data quality matters more than model complexity. Garbage in = garbage out.
            The train/test split must be done before any feature engineering on the test set to prevent data leakage.
            Always evaluate on data the model has never seen during training.
          </div>

          <CommonMistakes mistakes={[
            "Data leakage — fitting a scaler on the entire dataset (including test) before splitting. The test set must be treated as truly unseen data.",
            "Not recording data provenance — if you cannot trace where each data point came from, you cannot debug systematic errors later.",
            "Mixing DFT and experimental data without accounting for systematic differences — DFT-PBE bandgaps are systematically lower than experimental values.",
            "Removing too many 'outliers' — some apparent outliers are real physical effects (e.g., strongly correlated materials with anomalous bandgaps). Removing them biases your model."
          ]} />

          <MatSciExample text="The Materials Project API (mp-api) provides programmatic access to over 150,000 computed materials. A typical pipeline: query all binary oxides with mp-api, clean by removing entries with warnings, featurize with matminer's ElementProperty, split 80/20, train a random forest, and evaluate. This entire pipeline can be coded in about 30 lines of Python using pymatgen, matminer, and scikit-learn." />
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

  const svgW = 500, svgH = 240;

  return (
    <Card color={C} title="Hyperparameter Tuning" formula="Grid Search: try all (lr, hidden_size) pairs">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          Tuning a guitar — each string needs the right tension. Too loose or too tight and it sounds wrong.
          Hyperparameters are the "tuning knobs" of your ML model. Grid search tries every combination systematically.
          Just as a guitar has multiple strings that must be tuned together (not independently), ML hyperparameters interact — the best learning rate depends on the hidden size, and vice versa.
          <br/><br/><strong>Another way to think about it:</strong> Imagine baking a cake where you must choose oven temperature and baking time. You could try every combination: 300F for 20 min, 300F for 25 min, ..., 400F for 40 min. The combination that produces the best cake wins. Grid search does exactly this, but instead of temperature and time, you vary learning rate and network size.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Define the hyperparameter search space: which hyperparameters to tune and what values to try for each (e.g., learning_rate = [0.001, 0.01, 0.1, 1.0]).",
        "Grid search: create every possible combination of hyperparameter values. Here, 4 learning rates x 4 hidden sizes = 16 combinations.",
        "For each combination, train the model from scratch and evaluate on a validation set (NOT the test set). Record the validation error.",
        "Select the combination with the lowest validation error. This is your best hyperparameter setting.",
        "Finally, train a model with the best hyperparameters on ALL training data and evaluate once on the held-out test set. This is your final reported performance."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={16} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>Validation Error Heatmap</text>
            <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fontSize={12} fill={T.muted}>Hidden Size</text>
            <text x={10} y={svgH / 2} fontSize={12} fill={T.muted} transform={`rotate(-90,10,${svgH / 2})`}>Learning Rate</text>
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
                  <text x={x + cellW / 2 - 2} y={y + cellH / 2 + 1} textAnchor="middle" fontSize={12} fill="#fff" fontWeight={700}>
                    {err.toFixed(3)}
                  </text>
                </g>
              );
            }))}
            {/* Column labels */}
            {hsValues.map((h, j) => (
              <text key={j} x={55 + j * 65 + 30} y={svgH - 18} textAnchor="middle" fontSize={11} fill={T.dim}>{h}</text>
            ))}
            {/* Row labels */}
            {lrValues.map((lr, i) => (
              <text key={i} x={50} y={25 + i * 35 + 20} textAnchor="end" fontSize={11} fill={T.dim}>{lr}</text>
            ))}
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <SliderRow label="Learning Rate" value={lrIdx} min={0} max={3} step={1}
            onChange={setLrIdx} color={C} format={v => lrValues[v].toString()} />
          <SliderRow label="Hidden Size" value={hsIdx} min={0} max={3} step={1}
            onChange={setHsIdx} color={C} format={v => hsValues[v].toString()} />

          <div style={{ marginTop: 4, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>GRID SEARCH CALCULATION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Hyperparameters are NOT learned during training — you choose
            them before training starts. Grid search is simple but expensive (16 full trainings here). Random search or
            Bayesian optimization can find good hyperparameters faster with fewer trials.
          </div>

          <CommonMistakes mistakes={[
            "Tuning on the test set — if you use test set performance to select hyperparameters, the test set is no longer an unbiased estimate. Use a separate validation set.",
            "Grid search with too fine a grid — trying 100 values for each of 5 hyperparameters means 10 billion combinations. Use coarse grids first, then refine around the best region.",
            "Ignoring random search — Bergstra and Bengio (2012) showed that random search finds good hyperparameters faster than grid search because most hyperparameters have different importances.",
            "Not setting a random seed — without a fixed seed, results vary between runs, making it impossible to fairly compare hyperparameter settings."
          ]} />

          <MatSciExample text="When using scikit-learn's RandomForestRegressor for bandgap prediction, key hyperparameters include n_estimators (100–500), max_depth (5–None), min_samples_leaf (1–10), and max_features ('sqrt' or 'log2'). Optuna, a Bayesian hyperparameter optimization library, can find near-optimal settings in ~50 trials instead of the thousands needed for exhaustive grid search." />
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

  const svgW = 500, svgH = 240;
  const centerX = svgW / 2;

  return (
    <Card color={C} title="Interpretability (SHapley Additive exPlanations)" formula="Prediction = Base + Σ SHAP values">
      <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A doctor explaining why they recommend a treatment: "Your age adds risk (+), but your fitness reduces it (−),
          and your family history adds more (+). Overall score: moderate risk." SHAP does the same for ML predictions.
          Without this explanation, you only know the model predicts "moderate risk" but have no idea why — it is a black box. SHAP opens the box and shows you every contributing factor.
          <br/><br/><strong>Another way to think about it:</strong> Imagine a jury delivering a verdict. Just saying "guilty" is not enough — the jury must explain which evidence was most convincing and how each piece shifted their opinion. SHAP values are the ML equivalent: they decompose the final prediction into contributions from each input feature, so you can trace exactly why the model made its decision.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Start with the base value — the average prediction across all training samples. This is what you would predict with zero information about the specific material.",
        "For each feature of the specific material, compute its SHAP value: how much does knowing this feature's value shift the prediction away from the base?",
        "Positive SHAP values push the prediction higher (e.g., large delta_EN increases predicted bandgap). Negative SHAP values push it lower.",
        "All SHAP values sum to exactly (prediction - base_value). This is a mathematical guarantee from game theory (Shapley values), ensuring a complete and fair decomposition.",
        "Visualize with a waterfall plot: start at the base value, add each SHAP contribution as a colored bar, and arrive at the final prediction. The longest bar is the most important feature."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {materials.map((mat, i) => (
              <button key={i} onClick={() => setMaterial(i)}
                style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                  background: material === i ? C : T.surface, color: material === i ? "#fff" : T.muted,
                  border: `1px solid ${material === i ? C : T.border}`, fontWeight: 700 }}>{mat.name}</button>
            ))}
          </div>

          <svg width={svgW} height={svgH} style={{ display: "block", background: T.surface, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <text x={svgW / 2} y={14} textAnchor="middle" fontSize={12} fill={T.muted} fontWeight={700}>SHAP Waterfall — {m.name}</text>
            {/* Base value line */}
            <line x1={centerX} y1={25} x2={centerX} y2={svgH - 25} stroke={T.border} strokeDasharray="3,3" />
            <text x={centerX} y={34} textAnchor="middle" fontSize={11} fill={T.dim}>Base = {m.base.toFixed(1)} eV</text>
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
                    <text x={25} y={y + 12} fontSize={11} fill={T.muted}>{f.name}</text>
                    <text x={svgW - 10} y={y + 12} textAnchor="end" fontSize={11}
                      fill={isPos ? "#dc2626" : "#059669"} fontWeight={700}>
                      {isPos ? "+" : ""}{f.shap.toFixed(2)}
                    </text>
                  </g>
                );
              });
            })()}
            {/* Final prediction */}
            <text x={svgW / 2} y={svgH - 8} textAnchor="middle" fontSize={12} fill={C} fontWeight={800}>
              Prediction: {prediction.toFixed(2)} eV
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginTop: 0, background: T.surface, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>SHAP DECOMPOSITION</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> SHAP values explain how much each feature pushed the
            prediction up or down from the average. Positive SHAP = increases prediction. This is critical in materials
            science: it tells you which physical properties drive the prediction, not just the final number.
          </div>

          <CommonMistakes mistakes={[
            "Confusing feature importance with SHAP values — feature importance tells you which features matter globally; SHAP values explain individual predictions. Both are useful but answer different questions.",
            "Assuming SHAP reveals causation — SHAP shows correlation-based contributions. A high SHAP value for delta_EN does not prove that electronegativity difference causes the bandgap — only that the model uses it.",
            "Ignoring SHAP interactions — sometimes two features interact: neither alone has a large SHAP value, but together they strongly influence the prediction. Use SHAP interaction values to detect this.",
            "Not validating SHAP explanations with domain knowledge — if SHAP says 'atomic mass is the top predictor of bandgap', something is likely wrong. Good SHAP explanations should align with physical intuition."
          ]} />

          <MatSciExample text="In a random forest model predicting thermal conductivity of crystalline solids, SHAP analysis revealed that the average atomic mass and Gruneisen parameter were the top predictors — consistent with the physical Slack equation. When SHAP highlighted an unexpected feature (electronegativity variance), investigation revealed it was a proxy for bond anharmonicity, leading to new physical insights about phonon scattering." />
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
        <div style={{ fontSize: 13, lineHeight: 2.0, color: T.ink }}>
          A toolbox: you do not use a sledgehammer to hang a picture frame. Similarly, you do not need a billion-parameter
          neural network when 100 data points and linear regression will do. Choose the simplest method that works.
          A master carpenter knows every tool in the box and picks the right one for each job. An ML practitioner should know the strengths and weaknesses of each algorithm and pick based on data size, complexity, and interpretability needs.
          <br/><br/><strong>Another way to think about it:</strong> Transportation choices depend on the journey. Walking works for 500 meters, a bicycle for 5 km, a car for 50 km, and a plane for 5000 km. Using a plane for a 500-meter trip is absurd overkill; walking 5000 km is impractical. Similarly, neural networks for 50 data points is overkill, and linear regression for image recognition is impractical. Match the tool to the task.
        </div>
      </div>

      <HowItWorks color={C} steps={[
        "Assess your data: How many samples? How many features? Is the data labeled? Is it tabular, image, graph, or sequence data?",
        "Start simple: try linear regression or random forest first. These provide strong baselines and are interpretable. If they work well enough, stop here.",
        "Increase complexity only if needed: if simple models underperform, try gradient-boosted trees (XGBoost), then neural networks. Each step adds complexity and reduces interpretability.",
        "Always validate properly: use cross-validation, report mean and standard deviation, and compare to a naive baseline (e.g., always predicting the mean).",
        "Interpret and communicate: use SHAP values to explain predictions. A model that works well but cannot be understood or trusted by domain experts will never be adopted in practice."
      ]} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 510px" }}>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, letterSpacing: 2 }}>QUICK GUIDE</div>
            <div style={{ fontSize: 13, color: T.ink, lineHeight: 2.0 }}>
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
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, letterSpacing: 2 }}>COMPARISON</div>
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

          <div style={{ marginTop: 10, fontSize: 13, color: T.muted, lineHeight: 2.0,
            background: T.surface, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <strong style={{ color: T.ink }}>Key insight.</strong> Start simple. Linear regression with good features often
            beats a neural network with bad features. The most important decisions in ML are: (1) what data to collect,
            (2) what features to compute, (3) how to validate. The model choice is often the least important decision.
          </div>

          <CommonMistakes mistakes={[
            "Jumping straight to deep learning — for tabular materials data with fewer than ~5000 samples, tree-based methods (RF, XGBoost) almost always win.",
            "Not establishing a baseline — always compare your fancy model against a simple baseline. If random forest with 5 features gives R-squared = 0.92, a neural network giving 0.93 may not be worth the complexity.",
            "Ignoring the No Free Lunch theorem — no single algorithm is best for all problems. The best algorithm depends on your specific data and task.",
            "Publishing without code or data — reproducibility is critical in materials informatics. Always share your pipeline, data splits, and trained models."
          ]} />

          <MatSciExample text="A comprehensive 2020 benchmark by Dunn et al. (npj Computational Materials) compared 7 ML algorithms across 13 materials property prediction tasks. Key finding: gradient-boosted trees (with Matminer features) and CGCNN (from crystal structures) were the top performers overall, but no single method won every task. For small datasets (fewer than 500 samples), regularized linear models and random forests were most reliable." />
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

  { id: "dtree", block: "algorithms", title: "Decision Tree Regression", component: DecisionTreeSection,
    nextReason: "Single trees overfit easily. Random forests fix this by combining many trees — let's see how." },
  { id: "rforest", block: "algorithms", title: "Random Forest Regression", component: RandomForestSection,
    nextReason: "Another powerful algorithm is Support Vector Regression, which uses an epsilon-insensitive tube." },
  { id: "svm", block: "algorithms", title: "Support Vector Regression", component: SVMSection,
    nextReason: "With many features, we need dimensionality reduction. Principal Component Analysis finds the most important directions." },
  { id: "pca", block: "algorithms", title: "Principal Component Analysis", component: PCASection,
    nextReason: "Now let's go deeper — neural networks can learn any function. Starting with a single neuron." },

  { id: "perceptron", block: "neuralnet", title: "Perceptron", component: PerceptronSection,
    nextReason: "One neuron is limited. Stacking layers into deep networks unlocks immense power." },
  { id: "dnn", block: "neuralnet", title: "Deep Neural Network", component: DNNSection,
    nextReason: "But how do deep networks learn? Through backpropagation — the engine of modern ML." },
  { id: "backprop", block: "neuralnet", title: "Backpropagation", component: BackpropSection,
    nextReason: "Beyond feedforward nets, Convolutional Neural Networks handle images and spatial data." },
  { id: "cnn", block: "neuralnet", title: "Convolutional Neural Network", component: CNNSection,
    nextReason: "Now let's explore Transformers and generative models that power cutting-edge materials design." },

  { id: "transformer", block: "generative", title: "Transformer", component: TransformerSection,
    nextReason: "Transformers capture long-range relationships. Now let's see how Variational Autoencoders generate new materials." },
  { id: "autoencoder", block: "generative", title: "Variational Autoencoder", component: AutoencoderSection,
    nextReason: "VAEs generate by decoding latent space. Diffusion models take a different approach — denoising." },
  { id: "diffusion", block: "generative", title: "Diffusion Model", component: DiffusionModelSection,
    nextReason: "With generative models understood, let's see how active learning optimizes expensive experiments." },
  { id: "activelearn", block: "generative", title: "Active Learning", component: ActiveLearningSection,
    nextReason: "Now let's apply all this to materials science — starting with how we represent materials as features." },

  { id: "features", block: "matsci", title: "Feature Engineering", component: FeatureEngineeringSection,
    nextReason: "With features defined, let's train a model to predict bandgaps from composition." },
  { id: "prediction", block: "matsci", title: "Property Prediction", component: PropertyPredictionSection,
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
  const [active, setActive] = useState(ML_SECTIONS[0].id);
  const [activeBlock, setActiveBlock] = useState(ML_BLOCKS[0].id);
  const sec = ML_SECTIONS.find(s => s.id === active) || ML_SECTIONS[0];
  const Component = sec.component;
  const blockSections = ML_SECTIONS.filter(s => s.block === activeBlock);
  const blockColor = ML_BLOCKS.find(b => b.id === activeBlock)?.color || M.found;

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: T.ink,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Block tabs */}
      <div style={{
        display: "flex", padding: "8px 24px", gap: 6,
        borderBottom: `1px solid ${T.border}`, background: T.panel, overflowX: "auto",
      }}>
        {ML_BLOCKS.map(b => (
          <button key={b.id} onClick={() => {
            setActiveBlock(b.id);
            const first = ML_SECTIONS.find(s => s.block === b.id);
            if (first) setActive(first.id);
          }} style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1.5px solid ${activeBlock === b.id ? b.color : T.border}`,
            background: activeBlock === b.id ? b.color + "22" : T.bg,
            color: activeBlock === b.id ? b.color : T.muted,
            cursor: "pointer", fontSize: 11, fontFamily: "inherit",
            fontWeight: activeBlock === b.id ? 700 : 400,
            letterSpacing: 0.5, whiteSpace: "nowrap",
          }}>{b.label}</button>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{
        display: "flex", padding: "6px 24px", gap: 6,
        borderBottom: `1px solid ${T.border}`, background: T.panel,
        overflowX: "auto", flexWrap: "wrap",
      }}>
        {blockSections.map(s => {
          const globalIdx = ML_SECTIONS.findIndex(x => x.id === s.id);
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "6px 12px", borderRadius: 8,
              border: `1px solid ${active === s.id ? blockColor : T.border}`,
              background: active === s.id ? blockColor + "22" : T.bg,
              color: active === s.id ? blockColor : T.muted,
              cursor: "pointer", fontSize: 11, fontFamily: "inherit",
              fontWeight: active === s.id ? 700 : 400,
              display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 9, color: active === s.id ? blockColor : T.dim }}>{globalIdx + 1}.</span>
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: blockColor, letterSpacing: 0.5 }}>{sec.title}</div>
        </div>
        <Component />
        {sec.nextReason && (
          <div style={{
            marginTop: 28, padding: "14px 18px", borderRadius: 10,
            background: blockColor + "0a", border: `1.5px solid ${blockColor}22`,
            borderLeft: `4px solid ${blockColor}`,
          }}>
            <div style={{ fontSize: 12, color: T.ink, lineHeight: 1.8 }}>
              {sec.nextReason}
              {(() => {
                const idx = ML_SECTIONS.findIndex(s => s.id === active);
                const next = ML_SECTIONS[idx + 1];
                return next ? <span> Up next: <span style={{ fontWeight: 700, color: ML_BLOCKS.find(b => b.id === next.block)?.color || M.found }}>{next.title}</span>.</span> : null;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${T.border}`, padding: "10px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", background: T.panel,
      }}>
        <button onClick={() => {
          const i = ML_SECTIONS.findIndex(s => s.id === active);
          if (i > 0) { setActive(ML_SECTIONS[i - 1].id); setActiveBlock(ML_SECTIONS[i - 1].block); }
        }} disabled={active === ML_SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === ML_SECTIONS[0].id ? T.surface : blockColor + "22",
          border: `1px solid ${active === ML_SECTIONS[0].id ? T.border : blockColor}`,
          color: active === ML_SECTIONS[0].id ? T.muted : blockColor,
          cursor: active === ML_SECTIONS[0].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>← Previous</button>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {ML_SECTIONS.map(s => (
            <div key={s.id} onClick={() => { setActive(s.id); setActiveBlock(s.block); }} style={{
              width: active === s.id ? 16 : 6, height: 6, borderRadius: 3, cursor: "pointer",
              background: active === s.id ? (ML_BLOCKS.find(b => b.id === s.block)?.color || M.found) : T.dim,
              transition: "all 0.2s",
            }} />
          ))}
        </div>

        <button onClick={() => {
          const i = ML_SECTIONS.findIndex(s => s.id === active);
          if (i < ML_SECTIONS.length - 1) { setActive(ML_SECTIONS[i + 1].id); setActiveBlock(ML_SECTIONS[i + 1].block); }
        }} disabled={active === ML_SECTIONS[ML_SECTIONS.length - 1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === ML_SECTIONS[ML_SECTIONS.length - 1].id ? T.surface : blockColor + "22",
          border: `1px solid ${active === ML_SECTIONS[ML_SECTIONS.length - 1].id ? T.border : blockColor}`,
          color: active === ML_SECTIONS[ML_SECTIONS.length - 1].id ? T.muted : blockColor,
          cursor: active === ML_SECTIONS[ML_SECTIONS.length - 1].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>Next →</button>
      </div>
    </div>
  );
}

export default MLIntroModule;
