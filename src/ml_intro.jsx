import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

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
      <div style={{ fontSize: 16, fontWeight: 800, color: color || T.eo_e, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: T.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
      <span style={{ color: T.ink, fontFamily: "monospace" }}>{eq}</span>
      <span style={{ color: color || T.eo_e, fontWeight: 700, fontFamily: "monospace" }}>{result}</span>
    </div>
  );
}

function AnalogyBox({ text }) {
  return (
    <div style={{ background: "#fffbeb", border: "1.5px solid #f59e0b33", borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 4 }}>Simple Analogy</div>
      <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>{text}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "3px 0", borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
      <span style={{ color: T.muted, fontWeight: 600, flex: "0 0 140px" }}>{label}</span>
      <span style={{ color: T.ink }}>{value}</span>
    </div>
  );
}

/* ─── Utility helpers ─── */
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

function linspace(a, b, n) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(a + (b - a) * i / (n - 1));
  return arr;
}

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function relu(x) { return Math.max(0, x); }
function tanhFn(x) { return Math.tanh(x); }

/* ─── BLOCK DEFINITIONS ─── */
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
  const [points, setPoints] = useState([]);
  const [currentClass, setCurrentClass] = useState(0);
  const [trained, setTrained] = useState(false);
  const [boundary, setBoundary] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const [animProgress, setAnimProgress] = useState(0);
  const [mlType, setMlType] = useState("supervised");
  const [nClusters, setNClusters] = useState(3);
  const [rewardIter, setRewardIter] = useState(0);

  useEffect(() => {
    if (!trained) { setAnimProgress(0); return; }
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setAnimProgress(Math.min(1, frame / 30));
      if (frame >= 30) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [trained]);

  const handleSvgClick = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    if (x < 10 || x > 390 || y < 10 || y > 290) return;
    setPoints(p => [...p, { x, y, cls: currentClass }]);
    setTrained(false);
  };

  const trainModel = () => {
    if (points.length < 4) return;
    const classA = points.filter(p => p.cls === 0);
    const classB = points.filter(p => p.cls === 1);
    if (classA.length === 0 || classB.length === 0) return;
    const mAx = classA.reduce((s, p) => s + p.x, 0) / classA.length;
    const mAy = classA.reduce((s, p) => s + p.y, 0) / classA.length;
    const mBx = classB.reduce((s, p) => s + p.x, 0) / classB.length;
    const mBy = classB.reduce((s, p) => s + p.y, 0) / classB.length;
    const mx = (mAx + mBx) / 2;
    const my = (mAy + mBy) / 2;
    const dx = mBx - mAx;
    const dy = mBy - mAy;
    setBoundary({ mx, my, nx: -dy, ny: dx });
    let correct = 0;
    points.forEach(p => {
      const side = (p.x - mx) * dx + (p.y - my) * dy;
      const predicted = side > 0 ? 1 : 0;
      if (predicted === p.cls) correct++;
    });
    setAccuracy((correct / points.length * 100).toFixed(1));
    setTrained(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="What Is Machine Learning?" color={C}
        formula="f(features) → prediction">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Machine learning enables computers to learn patterns from materials data without explicit programming.
          Three paradigms: <b>Supervised</b> (labeled examples → predict new), <b>Unsupervised</b> (find hidden structure),
          <b>Reinforcement</b> (learn by trial and reward).
        </div>
      </Card>

      <AnalogyBox text="Teaching a child to sort toys — show examples with labels like 'this is a car, this is a block' (supervised learning), let them group toys by similarity on their own (unsupervised learning), or reward them with a sticker each time they guess correctly (reinforcement learning)." />

      <Card title="Interactive Classifier" color={C}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {["Class A (Metal)", "Class B (Semiconductor)"].map((lbl, i) => (
            <button key={i} onClick={() => setCurrentClass(i)}
              style={{
                padding: "4px 12px", fontSize: 11, borderRadius: 6, cursor: "pointer",
                background: currentClass === i ? (i === 0 ? "#2563eb" : "#ea580c") : T.surface,
                color: currentClass === i ? "#fff" : T.muted,
                border: `1px solid ${currentClass === i ? (i === 0 ? "#2563eb" : "#ea580c") : T.border}`
              }}>{lbl}</button>
          ))}
          <button onClick={trainModel}
            style={{ padding: "4px 14px", fontSize: 11, borderRadius: 6, cursor: "pointer", background: C, color: "#fff", border: "none", fontWeight: 700, marginLeft: "auto" }}>
            Train
          </button>
          <button onClick={() => { setPoints([]); setTrained(false); }}
            style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, cursor: "pointer", background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}>
            Clear
          </button>
        </div>
        <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Click canvas to place points. Then press Train.</div>
        <svg viewBox="0 0 400 300" style={{ width: "100%", background: T.surface, borderRadius: 8, cursor: "crosshair" }}
          onClick={handleSvgClick}>
          <rect x="0" y="0" width="400" height="300" fill="none" stroke={T.border} strokeWidth="1" rx="8" />
          <text x="200" y="15" textAnchor="middle" fontSize="9" fill={T.muted}>Electronegativity →</text>
          <text x="8" y="150" textAnchor="middle" fontSize="9" fill={T.muted} transform="rotate(-90,8,150)">Ionic Radius →</text>
          {trained && boundary && animProgress > 0 && (
            <>
              <line
                x1={boundary.mx - boundary.nx * 200 * animProgress}
                y1={boundary.my - boundary.ny * 200 * animProgress}
                x2={boundary.mx + boundary.nx * 200 * animProgress}
                y2={boundary.my + boundary.ny * 200 * animProgress}
                stroke={C} strokeWidth="2" strokeDasharray="6,3" />
            </>
          )}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="6"
              fill={p.cls === 0 ? "#2563eb" : "#ea580c"}
              stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          ))}
        </svg>
      </Card>

      <SliderRow label="Number of clusters (unsupervised)" value={nClusters} min={2} max={6} step={1}
        onChange={setNClusters} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Reinforcement iterations" value={rewardIter} min={0} max={100} step={1}
        onChange={setRewardIter} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="POINTS PLACED" value={points.length} color={C} />
        <ResultBox label="ACCURACY" value={trained ? accuracy + "%" : "—"} color={trained ? M.mat : T.muted} sub="after training" />
        <ResultBox label="CLUSTERS K" value={nClusters} color={M.algo} sub="unsupervised" />
      </div>

      <CalcRow eq="Class A count" result={points.filter(p => p.cls === 0).length} color={T.eo_e} />
      <CalcRow eq="Class B count" result={points.filter(p => p.cls === 1).length} color={T.eo_hole} />
      <CalcRow eq="Total data points" result={points.length} color={C} />
      <CalcRow eq={`RL exploration after ${rewardIter} iters`} result={(1 - Math.exp(-rewardIter / 30)).toFixed(3)} color={M.accent} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 2 — Linear Regression
   ════════════════════════════════════════════════════════════════ */
function LinearRegressionSection() {
  const C = M.found;
  const realData = useMemo(() => [
    { x: 0.53, y: 2.46, label: "Li" }, { x: 1.12, y: 3.03, label: "Na" },
    { x: 1.52, y: 3.57, label: "K" }, { x: 0.76, y: 2.87, label: "Ca" },
    { x: 1.17, y: 3.31, label: "Sr" }, { x: 1.43, y: 3.80, label: "Ba" },
    { x: 0.68, y: 2.71, label: "Mg" }, { x: 1.35, y: 3.50, label: "Rb" },
    { x: 0.60, y: 2.55, label: "Be" }, { x: 1.60, y: 3.90, label: "Cs" },
  ], []);

  const [slope, setSlope] = useState(1.2);
  const [intercept, setIntercept] = useState(1.8);
  const [dragIdx, setDragIdx] = useState(-1);
  const [data, setData] = useState(realData);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, []);

  const bestFit = useMemo(() => {
    const n = data.length;
    const sx = data.reduce((s, d) => s + d.x, 0);
    const sy = data.reduce((s, d) => s + d.y, 0);
    const sxy = data.reduce((s, d) => s + d.x * d.y, 0);
    const sxx = data.reduce((s, d) => s + d.x * d.x, 0);
    const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const b = (sy - m * sx) / n;
    return { m, b };
  }, [data]);

  const sse = useMemo(() => {
    return data.reduce((s, d) => {
      const pred = slope * d.x + intercept;
      return s + (d.y - pred) ** 2;
    }, 0);
  }, [data, slope, intercept]);

  const bestSSE = useMemo(() => {
    return data.reduce((s, d) => {
      const pred = bestFit.m * d.x + bestFit.b;
      return s + (d.y - pred) ** 2;
    }, 0);
  }, [data, bestFit]);

  const toSvgX = (v) => 40 + (v - 0.3) * (350 / 1.5);
  const toSvgY = (v) => 260 - (v - 2.0) * (220 / 2.5);

  const handleDrag = (e) => {
    if (dragIdx < 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 420;
    const py = ((e.clientY - rect.top) / rect.height) * 280;
    const newX = 0.3 + (px - 40) * 1.5 / 350;
    const newY = 2.0 + (260 - py) * 2.5 / 220;
    setData(d => d.map((pt, i) => i === dragIdx ? { ...pt, x: Math.max(0.3, Math.min(1.8, newX)), y: Math.max(2.0, Math.min(4.5, newY)) } : pt));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Linear Regression" color={C} formula="y = mx + b → Lattice Constant = m × Atomic Radius + b">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Linear regression fits the best straight line through data by minimizing the Sum of Squared Errors (SSE).
          In materials science, many properties show linear trends — like lattice constant vs atomic radius for alkali metals.
        </div>
      </Card>

      <AnalogyBox text="Drawing the best straight line through a scatter of exam scores — the line that minimizes how far each dot is from it. Every dot wants to pull the line closer, and the best fit balances all their pulls equally." />

      <Card title="Drag Points to Explore" color={C}>
        <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Drag data points. Adjust slope (m) and intercept (b) sliders. Use 'Snap to Best Fit' to see optimal.</div>
        <svg viewBox="0 0 420 280" style={{ width: "100%", background: T.surface, borderRadius: 8, cursor: dragIdx >= 0 ? "grabbing" : "default" }}
          onMouseMove={handleDrag}
          onMouseUp={() => setDragIdx(-1)}
          onMouseLeave={() => setDragIdx(-1)}>
          {/* axes */}
          <line x1="40" y1="260" x2="400" y2="260" stroke={T.border} strokeWidth="1" />
          <line x1="40" y1="20" x2="40" y2="260" stroke={T.border} strokeWidth="1" />
          <text x="220" y="278" textAnchor="middle" fontSize="10" fill={T.muted}>Atomic Radius (Å)</text>
          <text x="12" y="140" textAnchor="middle" fontSize="10" fill={T.muted} transform="rotate(-90,12,140)">Lattice Constant (Å)</text>
          {/* grid lines */}
          {[0.5, 1.0, 1.5].map(v => (
            <g key={v}>
              <line x1={toSvgX(v)} y1="20" x2={toSvgX(v)} y2="260" stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={toSvgX(v)} y="270" textAnchor="middle" fontSize="8" fill={T.dim}>{v.toFixed(1)}</text>
            </g>
          ))}
          {[2.5, 3.0, 3.5, 4.0].map(v => (
            <g key={v}>
              <line x1="40" y1={toSvgY(v)} x2="400" y2={toSvgY(v)} stroke={T.border} strokeWidth="0.5" strokeDasharray="3,3" />
              <text x="34" y={toSvgY(v) + 3} textAnchor="end" fontSize="8" fill={T.dim}>{v.toFixed(1)}</text>
            </g>
          ))}
          {/* regression line */}
          <line
            x1={toSvgX(0.3)} y1={toSvgY(slope * 0.3 + intercept)}
            x2={toSvgX(1.8)} y2={toSvgY(slope * 1.8 + intercept)}
            stroke={C} strokeWidth="2" opacity={animT} />
          {/* residuals */}
          {data.map((d, i) => {
            const pred = slope * d.x + intercept;
            return (
              <line key={"r" + i} x1={toSvgX(d.x)} y1={toSvgY(d.y)} x2={toSvgX(d.x)} y2={toSvgY(pred)}
                stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" opacity={0.5 * animT} />
            );
          })}
          {/* data points */}
          {data.map((d, i) => (
            <g key={i} onMouseDown={() => setDragIdx(i)} style={{ cursor: "grab" }}>
              <circle cx={toSvgX(d.x)} cy={toSvgY(d.y)} r="7" fill={C} stroke="#fff" strokeWidth="1.5" opacity="0.85" />
              <text x={toSvgX(d.x)} y={toSvgY(d.y) - 10} textAnchor="middle" fontSize="8" fill={T.ink}>{d.label}</text>
            </g>
          ))}
        </svg>
      </Card>

      <SliderRow label="Slope (m)" value={slope} min={0.5} max={2.0} step={0.01} onChange={setSlope} color={C} />
      <SliderRow label="Intercept (b)" value={intercept} min={1.0} max={3.0} step={0.01} onChange={setIntercept} color={M.accent} unit=" Å" />

      <button onClick={() => { setSlope(bestFit.m); setIntercept(bestFit.b); }}
        style={{ padding: "6px 16px", fontSize: 11, borderRadius: 6, cursor: "pointer", background: C, color: "#fff", border: "none", fontWeight: 700, alignSelf: "flex-start" }}>
        Snap to Best Fit (m={bestFit.m.toFixed(3)}, b={bestFit.b.toFixed(3)})
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="YOUR SSE" value={sse.toFixed(4)} color={sse <= bestSSE * 1.05 ? M.mat : "#dc2626"} sub="sum of squared errors" />
        <ResultBox label="BEST SSE" value={bestSSE.toFixed(4)} color={M.mat} sub="optimal fit" />
        <ResultBox label="R²" value={(1 - sse / data.reduce((s, d) => { const my = data.reduce((a, b) => a + b.y, 0) / data.length; return s + (d.y - my) ** 2; }, 0)).toFixed(4)} color={C} />
      </div>

      <CalcRow eq={`ŷ(Li) = ${slope.toFixed(2)} × 0.53 + ${intercept.toFixed(2)}`} result={(slope * 0.53 + intercept).toFixed(3) + " Å"} color={C} />
      <CalcRow eq={`ŷ(Na) = ${slope.toFixed(2)} × 1.12 + ${intercept.toFixed(2)}`} result={(slope * 1.12 + intercept).toFixed(3) + " Å"} color={C} />
      <CalcRow eq={`SSE = Σ(yᵢ - ŷᵢ)²`} result={sse.toFixed(4)} color={"#dc2626"} />
      <CalcRow eq={`Optimal slope m`} result={bestFit.m.toFixed(4)} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 3 — Overfitting
   ════════════════════════════════════════════════════════════════ */
function OverfittingSection() {
  const C = M.found;
  const [degree, setDegree] = useState(2);
  const [noiseLevel, setNoiseLevel] = useState(0.3);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 25)); if (f >= 25) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [degree]);

  const rng = useMemo(() => seededRandom(42), []);
  const trainData = useMemo(() => {
    const r = seededRandom(42);
    return linspace(0, 1, 15).map(x => ({ x, y: 2 * x * x - 0.5 * x + 1 + (r() - 0.5) * noiseLevel * 2 }));
  }, [noiseLevel]);
  const testData = useMemo(() => {
    const r = seededRandom(99);
    return linspace(0.05, 0.95, 10).map(x => ({ x, y: 2 * x * x - 0.5 * x + 1 + (r() - 0.5) * noiseLevel * 2 }));
  }, [noiseLevel]);

  const fitPoly = (data, deg) => {
    const n = data.length;
    const X = data.map(d => { const row = []; for (let j = 0; j <= deg; j++) row.push(Math.pow(d.x, j)); return row; });
    const y = data.map(d => d.y);
    const XT = X[0].map((_, j) => X.map(row => row[j]));
    const XTX = XT.map(r1 => XT[0].map((_, j) => r1.reduce((s, v, k) => s + v * X[k][j], 0)));
    const XTy = XT.map(r => r.reduce((s, v, k) => s + v * y[k], 0));
    const m = XTX.length;
    const aug = XTX.map((row, i) => [...row, XTy[i]]);
    for (let i = 0; i < m; i++) {
      let maxR = i;
      for (let k = i + 1; k < m; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[maxR][i])) maxR = k;
      [aug[i], aug[maxR]] = [aug[maxR], aug[i]];
      if (Math.abs(aug[i][i]) < 1e-12) continue;
      const pivot = aug[i][i];
      for (let j = i; j <= m; j++) aug[i][j] /= pivot;
      for (let k = 0; k < m; k++) {
        if (k === i) continue;
        const factor = aug[k][i];
        for (let j = i; j <= m; j++) aug[k][j] -= factor * aug[i][j];
      }
    }
    return aug.map(row => row[m]);
  };

  const coeffs = useMemo(() => fitPoly(trainData, Math.min(degree, trainData.length - 1)), [trainData, degree]);
  const evalPoly = (x, c) => c.reduce((s, ci, i) => s + ci * Math.pow(x, i), 0);

  const trainMSE = useMemo(() => trainData.reduce((s, d) => s + (d.y - evalPoly(d.x, coeffs)) ** 2, 0) / trainData.length, [trainData, coeffs]);
  const testMSE = useMemo(() => testData.reduce((s, d) => s + (d.y - evalPoly(d.x, coeffs)) ** 2, 0) / testData.length, [testData, coeffs]);

  const errCurve = useMemo(() => {
    const out = [];
    for (let d = 1; d <= 10; d++) {
      const c = fitPoly(trainData, Math.min(d, trainData.length - 1));
      const trE = trainData.reduce((s, p) => s + (p.y - evalPoly(p.x, c)) ** 2, 0) / trainData.length;
      const teE = testData.reduce((s, p) => s + (p.y - evalPoly(p.x, c)) ** 2, 0) / testData.length;
      out.push({ d, trE, teE: Math.min(teE, 5) });
    }
    return out;
  }, [trainData, testData]);

  const toX = (v) => 40 + v * 340;
  const toY = (v) => 240 - (v - 0.5) * 140;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Overfitting & Generalization" color={C} formula="Bias-Variance Tradeoff: Error = Bias² + Variance + Noise">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A model that memorizes training data (overfitting) fails on new data. The sweet spot minimizes total error:
          low-degree polynomials underfit (high bias), high-degree overfit (high variance). True function: y = 2x² − 0.5x + 1.
        </div>
      </Card>

      <AnalogyBox text="A student who memorizes every exam answer word-for-word (overfitting) vs one who understands the underlying concept (generalization). The memorizer aces practice exams but fails new questions. The ideal student captures the pattern, not the noise." />

      <Card title="Polynomial Fit Visualization" color={C}>
        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <line x1="40" y1="240" x2="400" y2="240" stroke={T.border} />
          <line x1="40" y1="20" x2="40" y2="240" stroke={T.border} />
          <text x="220" y="265" textAnchor="middle" fontSize="9" fill={T.muted}>Composition x</text>
          <text x="14" y="130" textAnchor="middle" fontSize="9" fill={T.muted} transform="rotate(-90,14,130)">Property y</text>
          {/* true function */}
          {linspace(0, 1, 50).map((x, i, arr) => {
            if (i === 0) return null;
            const x0 = arr[i - 1], y0 = 2 * x0 * x0 - 0.5 * x0 + 1;
            const y1 = 2 * x * x - 0.5 * x + 1;
            return <line key={"t" + i} x1={toX(x0)} y1={toY(y0)} x2={toX(x)} y2={toY(y1)} stroke={T.dim} strokeWidth="1.5" strokeDasharray="4,4" />;
          })}
          {/* fit curve */}
          {linspace(0, 1, 80).map((x, i, arr) => {
            if (i === 0) return null;
            const x0 = arr[i - 1];
            const y0 = evalPoly(x0, coeffs);
            const y1 = evalPoly(x, coeffs);
            return <line key={"f" + i} x1={toX(x0)} y1={toY(Math.max(-1, Math.min(5, y0)))} x2={toX(x)} y2={toY(Math.max(-1, Math.min(5, y1)))}
              stroke={degree > 5 ? "#dc2626" : C} strokeWidth="2" opacity={animT} />;
          })}
          {/* train points */}
          {trainData.map((d, i) => (
            <circle key={"tr" + i} cx={toX(d.x)} cy={toY(d.y)} r="5" fill={C} stroke="#fff" strokeWidth="1" />
          ))}
          {/* test points */}
          {testData.map((d, i) => (
            <circle key={"te" + i} cx={toX(d.x)} cy={toY(d.y)} r="4" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          ))}
          <text x="390" y="30" textAnchor="end" fontSize="10" fill={C}>● Train</text>
          <text x="390" y="44" textAnchor="end" fontSize="10" fill="#dc2626">○ Test</text>
          <text x="390" y="58" textAnchor="end" fontSize="9" fill={T.dim}>--- True f(x)</text>
          <text x="200" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill={degree > 5 ? "#dc2626" : C}>
            Degree {degree} polynomial {degree > 5 ? "(OVERFITTING!)" : degree < 2 ? "(UNDERFITTING)" : "(GOOD FIT)"}
          </text>
        </svg>
      </Card>

      <SliderRow label="Polynomial Degree" value={degree} min={1} max={10} step={1} onChange={setDegree} color={degree > 5 ? "#dc2626" : C} format={v => v.toFixed(0)} />
      <SliderRow label="Noise Level (σ)" value={noiseLevel} min={0.05} max={1.0} step={0.05} onChange={setNoiseLevel} color={M.accent} />

      {/* Error curve */}
      <Card title="Train vs Test Error" color={C}>
        <svg viewBox="0 0 420 200" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <line x1="50" y1="170" x2="400" y2="170" stroke={T.border} />
          <line x1="50" y1="10" x2="50" y2="170" stroke={T.border} />
          <text x="225" y="195" textAnchor="middle" fontSize="9" fill={T.muted}>Polynomial Degree</text>
          {errCurve.map((e, i, arr) => {
            if (i === 0) return null;
            const prev = arr[i - 1];
            const x1 = 50 + prev.d * 35, x2 = 50 + e.d * 35;
            const scaleY = (v) => 170 - Math.min(v, 3) * 50;
            return (
              <g key={i}>
                <line x1={x1} y1={scaleY(prev.trE)} x2={x2} y2={scaleY(e.trE)} stroke={C} strokeWidth="2" />
                <line x1={x1} y1={scaleY(prev.teE)} x2={x2} y2={scaleY(e.teE)} stroke="#dc2626" strokeWidth="2" />
              </g>
            );
          })}
          {errCurve.map((e, i) => {
            const x = 50 + e.d * 35, scaleY = (v) => 170 - Math.min(v, 3) * 50;
            return (
              <g key={"dot" + i}>
                <circle cx={x} cy={scaleY(e.trE)} r={e.d === degree ? 5 : 3} fill={C} />
                <circle cx={x} cy={scaleY(e.teE)} r={e.d === degree ? 5 : 3} fill="#dc2626" />
                <text x={x} y="182" textAnchor="middle" fontSize="8" fill={T.dim}>{e.d}</text>
              </g>
            );
          })}
          <text x="380" y="30" textAnchor="end" fontSize="9" fill={C}>— Train MSE</text>
          <text x="380" y="44" textAnchor="end" fontSize="9" fill="#dc2626">— Test MSE</text>
        </svg>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="TRAIN MSE" value={trainMSE.toFixed(4)} color={C} />
        <ResultBox label="TEST MSE" value={testMSE.toFixed(4)} color={testMSE > trainMSE * 3 ? "#dc2626" : M.mat} />
        <ResultBox label="DEGREE" value={degree} color={degree > 5 ? "#dc2626" : C} sub={degree > 5 ? "overfitting" : degree < 2 ? "underfitting" : "good"} />
      </div>

      <CalcRow eq="Train MSE" result={trainMSE.toFixed(5)} color={C} />
      <CalcRow eq="Test MSE" result={testMSE.toFixed(5)} color="#dc2626" />
      <CalcRow eq="Test/Train ratio" result={(testMSE / Math.max(trainMSE, 0.0001)).toFixed(2) + "×"} color={testMSE / Math.max(trainMSE, 0.0001) > 3 ? "#dc2626" : M.mat} />
      <CalcRow eq="# Parameters (degree + 1)" result={(degree + 1)} color={T.muted} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 4 — Cross-Validation
   ════════════════════════════════════════════════════════════════ */
function CrossValidationSection() {
  const C = M.found;
  const [K, setK] = useState(5);
  const [nPoints, setNPoints] = useState(30);
  const [activeFold, setActiveFold] = useState(0);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [activeFold, K]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveFold(f => (f + 1) % K);
    }, 2500);
    return () => clearInterval(id);
  }, [K]);

  const scores = useMemo(() => {
    const r = seededRandom(activeFold * 7 + K);
    return Array.from({ length: K }, (_, i) => 0.82 + r() * 0.12);
  }, [K, activeFold]);

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const std = Math.sqrt(scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length);

  const foldSize = Math.floor(nPoints / K);
  const ptColors = ["#2563eb", "#ea580c", "#059669", "#7c3aed", "#d97706", "#dc2626", "#0284c7", "#84cc16", "#6366f1", "#f43f5e"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="K-Fold Cross-Validation" color={C} formula="CV Score = (1/K) Σ Scoreₖ">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Cross-validation gives a robust estimate of model performance by rotating the test set through K folds.
          Each data point serves as test exactly once, preventing lucky/unlucky splits from biasing the evaluation.
        </div>
      </Card>

      <AnalogyBox text="A restaurant critic who visits 5 times on different days to give a fair review, not just one lucky (or unlucky) visit. The average of all 5 visits is a much more reliable rating than any single trip." />

      <Card title="K-Fold Splitting Animation" color={C}>
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill={C}>
            {K}-Fold CV — Fold {activeFold + 1} active (test = highlighted)
          </text>
          {/* Data points as colored blocks */}
          {Array.from({ length: Math.min(nPoints, 40) }, (_, i) => {
            const fold = Math.floor(i / foldSize);
            const isTest = fold === activeFold;
            const col = ptColors[fold % ptColors.length];
            const row = Math.floor(i / 10);
            const colIdx = i % 10;
            return (
              <g key={i}>
                <rect x={30 + colIdx * 38} y={30 + row * 28} width={32} height={20}
                  rx="4" fill={isTest ? col : col + "33"}
                  stroke={isTest ? col : "none"} strokeWidth={isTest ? 2 : 0} />
                <text x={46 + colIdx * 38} y={44 + row * 28} textAnchor="middle" fontSize="7"
                  fill={isTest ? "#fff" : T.muted}>{i + 1}</text>
              </g>
            );
          })}
          {/* Fold bars */}
          {scores.map((s, i) => {
            const barW = (350 / K) - 4;
            const barX = 40 + i * (350 / K);
            const barH = s * 100 * animT;
            return (
              <g key={"bar" + i}>
                <rect x={barX} y={230 - barH} width={barW} height={barH}
                  rx="3" fill={i === activeFold ? ptColors[i % ptColors.length] : ptColors[i % ptColors.length] + "55"} />
                <text x={barX + barW / 2} y={224 - barH} textAnchor="middle" fontSize="8" fontWeight="700"
                  fill={ptColors[i % ptColors.length]}>{s.toFixed(3)}</text>
                <text x={barX + barW / 2} y={248} textAnchor="middle" fontSize="8" fill={T.muted}>F{i + 1}</text>
              </g>
            );
          })}
          <line x1="40" y1="232" x2="390" y2="232" stroke={T.border} />
          {/* Mean line */}
          <line x1="40" y1={230 - mean * 100} x2="390" y2={230 - mean * 100}
            stroke={M.accent} strokeWidth="1.5" strokeDasharray="5,3" />
          <text x="395" y={228 - mean * 100} fontSize="8" fill={M.accent}>μ={mean.toFixed(3)}</text>
        </svg>
      </Card>

      <SliderRow label="Number of Folds (K)" value={K} min={2} max={10} step={1} onChange={(v) => { setK(v); setActiveFold(0); }} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Total Data Points (N)" value={nPoints} min={10} max={50} step={1} onChange={setNPoints} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="MEAN SCORE" value={mean.toFixed(4)} color={C} />
        <ResultBox label="STD DEV" value={"±" + std.toFixed(4)} color={M.accent} sub="spread" />
        <ResultBox label="FOLD SIZE" value={foldSize} color={M.algo} sub={`${nPoints} / ${K}`} />
      </div>

      {scores.map((s, i) => (
        <CalcRow key={i} eq={`Fold ${i + 1} accuracy`} result={s.toFixed(4)} color={ptColors[i % ptColors.length]} />
      ))}
      <CalcRow eq={`CV Mean = Σ scores / ${K}`} result={mean.toFixed(4)} color={C} />
      <CalcRow eq={`CV Std = √(Σ(sᵢ - μ)² / K)`} result={std.toFixed(4)} color={M.accent} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 5 — Decision Trees
   ════════════════════════════════════════════════════════════════ */
function DecisionTreeSection() {
  const C = M.algo;
  const [splitThresh, setSplitThresh] = useState(2.0);
  const [depth, setDepth] = useState(2);
  const [animT, setAnimT] = useState(0);
  const [splitAxis, setSplitAxis] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [splitThresh, depth]);

  const materials = useMemo(() => [
    { x: 1.0, y: 1.8, cls: 0, name: "Na" }, { x: 0.9, y: 1.5, cls: 0, name: "K" },
    { x: 1.2, y: 1.3, cls: 0, name: "Ca" }, { x: 1.5, y: 1.0, cls: 0, name: "Fe" },
    { x: 0.8, y: 2.0, cls: 0, name: "Cs" }, { x: 1.3, y: 1.6, cls: 0, name: "Ba" },
    { x: 2.5, y: 0.7, cls: 1, name: "Si" }, { x: 2.1, y: 0.9, cls: 1, name: "Ge" },
    { x: 3.0, y: 0.5, cls: 1, name: "C" }, { x: 2.8, y: 0.6, cls: 1, name: "GaAs" },
    { x: 2.3, y: 0.8, cls: 1, name: "InP" }, { x: 3.5, y: 0.4, cls: 1, name: "SiC" },
  ], []);

  const gini = (items) => {
    if (items.length === 0) return 0;
    const p0 = items.filter(i => i.cls === 0).length / items.length;
    const p1 = 1 - p0;
    return 1 - p0 * p0 - p1 * p1;
  };

  const left = materials.filter(m => m.x <= splitThresh);
  const right = materials.filter(m => m.x > splitThresh);
  const giniParent = gini(materials);
  const giniLeft = gini(left);
  const giniRight = gini(right);
  const giniWeighted = (left.length * giniLeft + right.length * giniRight) / materials.length;
  const infoGain = giniParent - giniWeighted;

  const toSvgX = (v) => 40 + (v - 0.5) * (340 / 3.5);
  const toSvgY = (v) => 240 - (v - 0.2) * (200 / 2.2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Decision Trees" color={C} formula="Gini = 1 − Σ pᵢ²">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Decision trees split data by asking yes/no questions. At each node, we pick the split that maximizes
          information gain (minimizes Gini impurity). For materials, splits like "electronegativity {'>'} 2.0?" separate metals from semiconductors.
        </div>
      </Card>

      <AnalogyBox text="A game of 20 Questions — each question splits possibilities in half. 'Is electronegativity > 2.0?' splits metals from semiconductors. 'Is ionic radius > 1.0 Å?' further refines. The tree learns which questions are most informative." />

      <Card title="Split Visualization" color={C}>
        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <line x1="40" y1="240" x2="400" y2="240" stroke={T.border} />
          <line x1="40" y1="20" x2="40" y2="240" stroke={T.border} />
          <text x="220" y="265" textAnchor="middle" fontSize="9" fill={T.muted}>Electronegativity</text>
          <text x="14" y="130" textAnchor="middle" fontSize="9" fill={T.muted} transform="rotate(-90,14,130)">Ionic Radius (Å)</text>
          {/* Decision regions */}
          <rect x="40" y="20" width={toSvgX(splitThresh) - 40} height="220"
            fill="#2563eb11" stroke="none" opacity={animT} />
          <rect x={toSvgX(splitThresh)} y="20" width={400 - toSvgX(splitThresh)} height="220"
            fill="#ea580c11" stroke="none" opacity={animT} />
          {/* Split line */}
          <line x1={toSvgX(splitThresh)} y1="20" x2={toSvgX(splitThresh)} y2="240"
            stroke={C} strokeWidth="2.5" strokeDasharray="6,3" opacity={animT} />
          <text x={toSvgX(splitThresh)} y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill={C}>
            EN = {splitThresh.toFixed(1)}
          </text>
          {/* Data points */}
          {materials.map((m, i) => (
            <g key={i}>
              <circle cx={toSvgX(m.x)} cy={toSvgY(m.y)} r="7"
                fill={m.cls === 0 ? "#2563eb" : "#ea580c"} stroke="#fff" strokeWidth="1.5" />
              <text x={toSvgX(m.x)} y={toSvgY(m.y) - 10} textAnchor="middle" fontSize="7" fill={T.ink}>{m.name}</text>
            </g>
          ))}
          {/* Tree diagram at bottom */}
          <rect x="170" y="248" width="80" height="18" rx="4" fill={C + "22"} stroke={C} strokeWidth="1" />
          <text x="210" y="260" textAnchor="middle" fontSize="8" fill={C}>EN ≤ {splitThresh.toFixed(1)}?</text>
        </svg>
      </Card>

      <SliderRow label="Split Threshold (Electronegativity)" value={splitThresh} min={0.5} max={3.5} step={0.1}
        onChange={setSplitThresh} color={C} />
      <SliderRow label="Max Tree Depth" value={depth} min={1} max={5} step={1}
        onChange={setDepth} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="GINI PARENT" value={giniParent.toFixed(3)} color={C} />
        <ResultBox label="GINI LEFT" value={giniLeft.toFixed(3)} color="#2563eb" sub={`n=${left.length}`} />
        <ResultBox label="GINI RIGHT" value={giniRight.toFixed(3)} color="#ea580c" sub={`n=${right.length}`} />
        <ResultBox label="INFO GAIN" value={infoGain.toFixed(3)} color={M.mat} />
      </div>

      <CalcRow eq={`Gini(parent) = 1 − (6/12)² − (6/12)²`} result={giniParent.toFixed(4)} color={C} />
      <CalcRow eq={`Gini(left) = 1 − Σpᵢ² [n=${left.length}]`} result={giniLeft.toFixed(4)} color="#2563eb" />
      <CalcRow eq={`Gini(right) = 1 − Σpᵢ² [n=${right.length}]`} result={giniRight.toFixed(4)} color="#ea580c" />
      <CalcRow eq={`Weighted Gini = (${left.length}×${giniLeft.toFixed(3)} + ${right.length}×${giniRight.toFixed(3)}) / 12`} result={giniWeighted.toFixed(4)} color={C} />
      <CalcRow eq={`Info Gain = ${giniParent.toFixed(3)} − ${giniWeighted.toFixed(3)}`} result={infoGain.toFixed(4)} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 6 — Random Forest
   ════════════════════════════════════════════════════════════════ */
function RandomForestSection() {
  const C = M.algo;
  const [nTrees, setNTrees] = useState(5);
  const [maxDepth, setMaxDepth] = useState(3);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 25)); if (f >= 25) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [nTrees]);

  const treeResults = useMemo(() => {
    return Array.from({ length: nTrees }, (_, i) => {
      const r = seededRandom(i * 13 + 7);
      const acc = 0.75 + r() * 0.2;
      const splitX = 1.5 + (r() - 0.5) * 1.5;
      const splitY = 1.0 + (r() - 0.5) * 0.8;
      return { acc, splitX, splitY, oobErr: 1 - acc + (r() - 0.5) * 0.05 };
    });
  }, [nTrees]);

  const ensembleAcc = treeResults.reduce((s, t) => s + t.acc, 0) / nTrees;
  const oobError = treeResults.reduce((s, t) => s + t.oobErr, 0) / nTrees;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Random Forest" color={C} formula="ŷ = mode(Tree₁, Tree₂, ..., Treeₙ)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Random forests build many decision trees on random subsets of data (bagging) and random subsets of features.
          The ensemble vote is more robust than any single tree, reducing variance while maintaining low bias.
        </div>
      </Card>

      <AnalogyBox text="A panel of expert judges — each has quirks and biases, but their average score is more reliable than any single judge. One judge might overvalue electronegativity, another ionic radius, but together they balance out." />

      <Card title="Ensemble Decision Boundaries" color={C}>
        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill={C}>
            {nTrees} Trees — Each with random split
          </text>
          <rect x="40" y="25" width="340" height="210" fill="none" stroke={T.border} rx="4" />
          {/* Individual tree boundaries */}
          {treeResults.map((t, i) => {
            const opacity = 0.3 * animT;
            const treeC = ["#2563eb", "#ea580c", "#059669", "#7c3aed", "#d97706", "#dc2626", "#0284c7"][i % 7];
            const x = 40 + (t.splitX - 0.5) * (340 / 3.5);
            return (
              <g key={i}>
                <line x1={x} y1="25" x2={x} y2="235" stroke={treeC} strokeWidth="1.5" opacity={opacity} strokeDasharray="4,3" />
                <text x={x} y={32 + i * 12} fontSize="7" fill={treeC} opacity={animT}>T{i + 1}</text>
              </g>
            );
          })}
          {/* Ensemble boundary (average) */}
          {(() => {
            const avgSplit = treeResults.reduce((s, t) => s + t.splitX, 0) / nTrees;
            const x = 40 + (avgSplit - 0.5) * (340 / 3.5);
            return (
              <line x1={x} y1="25" x2={x} y2="235" stroke={C} strokeWidth="3" opacity={animT} />
            );
          })()}
          {/* Sample data points */}
          {[
            { x: 1.0, y: 1.5, cls: 0 }, { x: 1.3, y: 1.8, cls: 0 }, { x: 0.8, y: 1.2, cls: 0 },
            { x: 1.5, y: 1.0, cls: 0 }, { x: 1.1, y: 1.6, cls: 0 },
            { x: 2.5, y: 0.7, cls: 1 }, { x: 2.8, y: 0.5, cls: 1 }, { x: 3.0, y: 0.8, cls: 1 },
            { x: 2.3, y: 0.6, cls: 1 }, { x: 2.6, y: 0.9, cls: 1 },
          ].map((p, i) => (
            <circle key={i} cx={40 + (p.x - 0.5) * (340 / 3.5)} cy={235 - (p.y - 0.2) * (210 / 2.2)}
              r="5" fill={p.cls === 0 ? "#2563eb" : "#ea580c"} stroke="#fff" strokeWidth="1" />
          ))}
          {/* Feature importance bars */}
          <text x="210" y="255" textAnchor="middle" fontSize="9" fill={T.muted}>Feature Importance</text>
          <rect x="80" y="258" width={120 * animT} height="8" rx="2" fill={C} />
          <text x="78" y="265" textAnchor="end" fontSize="7" fill={T.muted}>EN</text>
          <rect x="250" y="258" width={80 * animT} height="8" rx="2" fill={C + "88"} />
          <text x="248" y="265" textAnchor="end" fontSize="7" fill={T.muted}>IR</text>
        </svg>
      </Card>

      <SliderRow label="Number of Trees" value={nTrees} min={1} max={7} step={1} onChange={setNTrees} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Max Depth" value={maxDepth} min={1} max={8} step={1} onChange={setMaxDepth} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="ENSEMBLE ACC" value={(ensembleAcc * 100).toFixed(1) + "%"} color={C} />
        <ResultBox label="OOB ERROR" value={(oobError * 100).toFixed(1) + "%"} color="#dc2626" sub="out-of-bag" />
        <ResultBox label="N TREES" value={nTrees} color={M.mat} />
      </div>

      {treeResults.map((t, i) => (
        <CalcRow key={i} eq={`Tree ${i + 1} accuracy`} result={(t.acc * 100).toFixed(1) + "%"} color={C} />
      ))}
      <CalcRow eq="Ensemble (majority vote)" result={(ensembleAcc * 100).toFixed(1) + "%"} color={M.mat} />
      <CalcRow eq="OOB error estimate" result={(oobError * 100).toFixed(1) + "%"} color="#dc2626" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 7 — Support Vector Machine
   ════════════════════════════════════════════════════════════════ */
function SVMSection() {
  const C = M.algo;
  const [paramC, setParamC] = useState(1.0);
  const [kernel, setKernel] = useState("linear");
  const [animT, setAnimT] = useState(0);
  const [gamma, setGamma] = useState(0.5);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [paramC, kernel]);

  const data = useMemo(() => [
    { x: 80, y: 60, cls: 0 }, { x: 100, y: 80, cls: 0 }, { x: 70, y: 100, cls: 0 },
    { x: 120, y: 50, cls: 0 }, { x: 90, y: 90, cls: 0 }, { x: 60, y: 70, cls: 0 },
    { x: 280, y: 180, cls: 1 }, { x: 300, y: 200, cls: 1 }, { x: 320, y: 160, cls: 1 },
    { x: 260, y: 210, cls: 1 }, { x: 310, y: 190, cls: 1 }, { x: 340, y: 170, cls: 1 },
    { x: 170, y: 130, cls: 0 }, { x: 220, y: 140, cls: 1 },
  ], []);

  const marginWidth = 30 / paramC;

  const supportVectors = [
    data[data.length - 2],
    data[data.length - 1],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Support Vector Machine" color={C} formula="maximize margin: 2/‖w‖ subject to yᵢ(w·xᵢ + b) ≥ 1">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          SVM finds the hyperplane that maximizes the margin between two classes. Support vectors are the closest
          points to the boundary. The C parameter trades off margin width vs classification errors. Kernel trick
          maps data to higher dimensions for non-linear boundaries.
        </div>
      </Card>

      <AnalogyBox text="Parking a car exactly in the middle of a lane — maximize the gap to both curbs. Support vectors are the closest cars on either side that define how wide the lane can be. A higher C means 'park perfectly even if the lane is tight.'" />

      <Card title="SVM Boundary & Margin" color={C}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {["linear", "rbf", "poly"].map(k => (
            <button key={k} onClick={() => setKernel(k)}
              style={{
                padding: "3px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
                background: kernel === k ? C : T.surface, color: kernel === k ? "#fff" : T.muted,
                border: `1px solid ${kernel === k ? C : T.border}`, textTransform: "uppercase"
              }}>{k}</button>
          ))}
        </div>
        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {/* Margin bands */}
          {kernel === "linear" && (
            <>
              <line x1={195 - marginWidth} y1="0" x2={195 - marginWidth + 100} y2="270"
                stroke={C} strokeWidth="1" strokeDasharray="4,3" opacity={0.4 * animT} />
              <line x1={195 + marginWidth} y1="0" x2={195 + marginWidth + 100} y2="270"
                stroke={C} strokeWidth="1" strokeDasharray="4,3" opacity={0.4 * animT} />
              <rect x={195 - marginWidth} y="0" width={marginWidth * 2} height="270"
                fill={C + "08"} opacity={animT} transform="skewX(-20)" />
              {/* Decision boundary */}
              <line x1="195" y1="0" x2="295" y2="270" stroke={C} strokeWidth="2.5" opacity={animT} />
            </>
          )}
          {kernel === "rbf" && (
            <ellipse cx="200" cy="135" rx={100 + 20 / paramC} ry={120 + 20 / paramC}
              fill="none" stroke={C} strokeWidth="2.5" opacity={animT} />
          )}
          {kernel === "poly" && (
            <path d={`M 140 270 Q 200 ${100 - 30 / paramC} 350 50`}
              fill="none" stroke={C} strokeWidth="2.5" opacity={animT} />
          )}
          {/* Data points */}
          {data.map((d, i) => {
            const isSV = i >= data.length - 2;
            return (
              <g key={i}>
                <circle cx={d.x} cy={d.y} r={isSV ? 9 : 6}
                  fill={d.cls === 0 ? "#2563eb" : "#ea580c"}
                  stroke={isSV ? "#000" : "#fff"} strokeWidth={isSV ? 2 : 1} />
                {isSV && <text x={d.x} y={d.y - 12} textAnchor="middle" fontSize="7" fill="#000" fontWeight="700">SV</text>}
              </g>
            );
          })}
          <text x="80" y="260" fontSize="9" fill="#2563eb">● Metals</text>
          <text x="280" y="260" fontSize="9" fill="#ea580c">● Semiconductors</text>
          <text x="210" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            Kernel: {kernel.toUpperCase()} | Margin ∝ 1/C
          </text>
        </svg>
      </Card>

      <SliderRow label="C (Regularization)" value={paramC} min={0.1} max={10} step={0.1} onChange={setParamC} color={C} />
      <SliderRow label="γ (RBF kernel width)" value={gamma} min={0.01} max={2.0} step={0.01} onChange={setGamma} color={M.accent} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="MARGIN WIDTH" value={(2 / paramC).toFixed(2)} color={C} sub="∝ 2/C" />
        <ResultBox label="SUPPORT VECTORS" value={2} color="#dc2626" />
        <ResultBox label="KERNEL" value={kernel.toUpperCase()} color={M.mat} />
      </div>

      <CalcRow eq="Margin = 2 / ‖w‖ ∝ 2/C" result={(2 / paramC).toFixed(3)} color={C} />
      <CalcRow eq={`C parameter`} result={paramC.toFixed(1)} color={C} />
      <CalcRow eq="Slack variables (soft margin)" result={paramC < 1 ? "Large (tolerant)" : paramC > 5 ? "Small (strict)" : "Moderate"} color={M.accent} />
      <CalcRow eq={`γ for RBF kernel`} result={gamma.toFixed(2)} color={M.accent} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 8 — PCA
   ════════════════════════════════════════════════════════════════ */
function PCASection() {
  const C = M.algo;
  const [nComponents, setNComponents] = useState(2);
  const [rotAngle, setRotAngle] = useState(30);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 25)); if (f >= 25) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [nComponents]);

  const data3D = useMemo(() => {
    const r = seededRandom(77);
    return Array.from({ length: 25 }, () => ({
      x: r() * 3 + 1, y: r() * 2 + 0.5, z: r() * 1.5 + 0.3,
      prop: r()
    }));
  }, []);

  const explainedVar = [0.62, 0.28, 0.10];
  const cumVar = [0.62, 0.90, 1.00];

  const project = (d) => {
    const rad = rotAngle * Math.PI / 180;
    const px = d.x * Math.cos(rad) - d.z * Math.sin(rad);
    const py = d.y;
    return { px, py };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Principal Component Analysis" color={C} formula="X = UΣVᵀ → PC₁ captures max variance">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          PCA finds orthogonal directions of maximum variance in high-dimensional data. For materials with dozens of features
          (Z, electronegativity, radius, etc.), PCA compresses them into 2-3 principal components while retaining most information.
        </div>
      </Card>

      <AnalogyBox text="Photographing a 3D sculpture — find the camera angle that captures the most information in a 2D photo. PC1 is the best angle, PC2 is the next best orthogonal angle. Together they show 90% of the sculpture's shape." />

      <Card title="3D → 2D Projection" color={C}>
        <svg viewBox="0 0 420 280" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            {nComponents} Principal Components — {(cumVar[nComponents - 1] * 100).toFixed(0)}% variance explained
          </text>
          {/* PC axes */}
          <line x1="40" y1="240" x2="380" y2="240" stroke={C} strokeWidth="1.5" opacity={animT} />
          {nComponents >= 2 && <line x1="40" y1="240" x2="40" y2="30" stroke={M.accent} strokeWidth="1.5" opacity={animT} />}
          <text x="210" y="258" textAnchor="middle" fontSize="9" fill={C}>PC1 ({(explainedVar[0] * 100).toFixed(0)}%)</text>
          {nComponents >= 2 && <text x="14" y="135" textAnchor="middle" fontSize="9" fill={M.accent} transform="rotate(-90,14,135)">PC2 ({(explainedVar[1] * 100).toFixed(0)}%)</text>}
          {/* Projected data */}
          {data3D.map((d, i) => {
            const p = project(d);
            const cx = 40 + (p.px - 0.5) * 85;
            const cy = nComponents >= 2 ? 240 - (p.py - 0.3) * 110 : 240;
            const color = `hsl(${d.prop * 240}, 70%, 50%)`;
            return (
              <circle key={i} cx={Math.max(40, Math.min(380, cx))} cy={Math.max(30, Math.min(240, cy))}
                r="5" fill={color} stroke="#fff" strokeWidth="0.8" opacity={0.8 * animT} />
            );
          })}
          {/* Scree plot inset */}
          <rect x="280" y="30" width="130" height="90" rx="4" fill={T.panel} stroke={T.border} />
          <text x="345" y="44" textAnchor="middle" fontSize="8" fontWeight="600" fill={T.muted}>Scree Plot</text>
          {explainedVar.map((v, i) => (
            <g key={i}>
              <rect x={295 + i * 35} y={110 - v * 70} width="25" height={v * 70}
                rx="2" fill={i < nComponents ? C : T.dim} opacity={animT} />
              <text x={307 + i * 35} y={106 - v * 70} textAnchor="middle" fontSize="7" fill={C}>
                {(v * 100).toFixed(0)}%
              </text>
              <text x={307 + i * 35} y="118" textAnchor="middle" fontSize="7" fill={T.muted}>PC{i + 1}</text>
            </g>
          ))}
        </svg>
      </Card>

      <SliderRow label="Number of Components" value={nComponents} min={1} max={3} step={1} onChange={setNComponents} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Rotation Angle (view)" value={rotAngle} min={0} max={90} step={1} onChange={setRotAngle} color={M.accent} format={v => v.toFixed(0)} unit="°" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="VARIANCE EXPLAINED" value={(cumVar[nComponents - 1] * 100).toFixed(0) + "%"} color={C} sub={`${nComponents} component(s)`} />
        <ResultBox label="PC1 VARIANCE" value={(explainedVar[0] * 100).toFixed(0) + "%"} color={C} />
        <ResultBox label="DIMENSIONS REDUCED" value={`3 → ${nComponents}`} color={M.mat} />
      </div>

      {explainedVar.map((v, i) => (
        <CalcRow key={i} eq={`PC${i + 1} explained variance`} result={(v * 100).toFixed(1) + "%"} color={i < nComponents ? C : T.dim} />
      ))}
      <CalcRow eq={`Cumulative variance (${nComponents} PCs)`} result={(cumVar[nComponents - 1] * 100).toFixed(1) + "%"} color={M.mat} />
      <CalcRow eq="Information lost" result={((1 - cumVar[nComponents - 1]) * 100).toFixed(1) + "%"} color="#dc2626" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 9 — Perceptron
   ════════════════════════════════════════════════════════════════ */
function PerceptronSection() {
  const C = M.nn;
  const [w1, setW1] = useState(0.8);
  const [w2, setW2] = useState(-0.5);
  const [bias, setBias] = useState(0.2);
  const [x1, setX1] = useState(0.6);
  const [x2, setX2] = useState(0.4);
  const [activation, setActivation] = useState("sigmoid");
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [w1, w2, bias, activation]);

  const z = w1 * x1 + w2 * x2 + bias;
  const activationFn = activation === "sigmoid" ? sigmoid : activation === "relu" ? relu : tanhFn;
  const output = activationFn(z);

  const actPlot = useMemo(() => {
    return linspace(-4, 4, 60).map(x => ({ x, y: activationFn(x) }));
  }, [activation]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="The Perceptron" color={C} formula="z = w₁x₁ + w₂x₂ + b → σ(z) = output">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          A single neuron: multiply each input by its weight, sum them with a bias, pass through an activation function.
          This is the building block of all neural networks. The activation introduces non-linearity, enabling complex decisions.
        </div>
      </Card>

      <AnalogyBox text="A voter weighing pros (w>0) and cons (w<0) of a decision. The bias is their default lean toward 'yes' or 'no'. The activation function is their threshold — sigmoid voters gradually shift, ReLU voters have a hard cutoff at zero." />

      <Card title="Single Neuron Computation" color={C}>
        <svg viewBox="0 0 430 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {/* Input nodes */}
          <circle cx="60" cy="80" r="20" fill="#2563eb22" stroke="#2563eb" strokeWidth="1.5" />
          <text x="60" y="84" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="700">x₁</text>
          <text x="60" y="65" textAnchor="middle" fontSize="8" fill={T.muted}>{x1.toFixed(2)}</text>

          <circle cx="60" cy="180" r="20" fill="#ea580c22" stroke="#ea580c" strokeWidth="1.5" />
          <text x="60" y="184" textAnchor="middle" fontSize="10" fill="#ea580c" fontWeight="700">x₂</text>
          <text x="60" y="165" textAnchor="middle" fontSize="8" fill={T.muted}>{x2.toFixed(2)}</text>

          {/* Bias */}
          <circle cx="170" cy="40" r="14" fill={M.accent + "22"} stroke={M.accent} strokeWidth="1" />
          <text x="170" y="44" textAnchor="middle" fontSize="8" fill={M.accent}>b</text>

          {/* Weight connections */}
          <line x1="80" y1="80" x2="180" y2="130" stroke="#2563eb" strokeWidth={Math.abs(w1) * 2 + 0.5} opacity={0.7 * animT} />
          <text x="120" y="95" fontSize="8" fill="#2563eb" fontWeight="600">w₁={w1.toFixed(2)}</text>

          <line x1="80" y1="180" x2="180" y2="130" stroke="#ea580c" strokeWidth={Math.abs(w2) * 2 + 0.5} opacity={0.7 * animT} />
          <text x="120" y="170" fontSize="8" fill="#ea580c" fontWeight="600">w₂={w2.toFixed(2)}</text>

          <line x1="170" y1="54" x2="190" y2="120" stroke={M.accent} strokeWidth="1" opacity={0.5} />

          {/* Neuron body */}
          <circle cx="200" cy="130" r="28" fill={C + "22"} stroke={C} strokeWidth="2" />
          <text x="200" y="126" textAnchor="middle" fontSize="8" fill={C} fontWeight="700">Σ + σ</text>
          <text x="200" y="140" textAnchor="middle" fontSize="7" fill={T.muted}>z={z.toFixed(3)}</text>

          {/* Output */}
          <line x1="228" y1="130" x2="290" y2="130" stroke={C} strokeWidth="2" opacity={animT}
            markerEnd="url(#arrow)" />
          <circle cx="310" cy="130" r="22" fill={output > 0.5 ? "#05966922" : "#dc262622"}
            stroke={output > 0.5 ? "#059669" : "#dc2626"} strokeWidth="2" />
          <text x="310" y="134" textAnchor="middle" fontSize="10" fontWeight="800"
            fill={output > 0.5 ? "#059669" : "#dc2626"}>{output.toFixed(3)}</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C} />
            </marker>
          </defs>

          {/* Activation function plot */}
          <rect x="340" y="40" width="80" height="70" rx="4" fill={T.panel} stroke={T.border} />
          <text x="380" y="52" textAnchor="middle" fontSize="7" fill={T.muted}>{activation}</text>
          {actPlot.map((p, i, arr) => {
            if (i === 0) return null;
            const prev = arr[i - 1];
            const sx = (x) => 345 + (x + 4) * 70 / 8;
            const sy = (y) => 105 - Math.max(-0.5, Math.min(1.5, y)) * 45;
            return <line key={i} x1={sx(prev.x)} y1={sy(prev.y)} x2={sx(p.x)} y2={sy(p.y)}
              stroke={C} strokeWidth="1.5" />;
          })}
          {/* Current z marker on activation plot */}
          <circle cx={345 + (Math.max(-4, Math.min(4, z)) + 4) * 70 / 8}
            cy={105 - Math.max(-0.5, Math.min(1.5, output)) * 45}
            r="3" fill="#dc2626" />
        </svg>
      </Card>

      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        {["sigmoid", "relu", "tanh"].map(a => (
          <button key={a} onClick={() => setActivation(a)}
            style={{
              padding: "3px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: activation === a ? C : T.surface, color: activation === a ? "#fff" : T.muted,
              border: `1px solid ${activation === a ? C : T.border}`, textTransform: "uppercase"
            }}>{a}</button>
        ))}
      </div>

      <SliderRow label="Weight w₁" value={w1} min={-2} max={2} step={0.05} onChange={setW1} color="#2563eb" />
      <SliderRow label="Weight w₂" value={w2} min={-2} max={2} step={0.05} onChange={setW2} color="#ea580c" />
      <SliderRow label="Bias b" value={bias} min={-2} max={2} step={0.05} onChange={setBias} color={M.accent} />
      <SliderRow label="Input x₁" value={x1} min={0} max={1} step={0.01} onChange={setX1} color="#2563eb" />
      <SliderRow label="Input x₂" value={x2} min={0} max={1} step={0.01} onChange={setX2} color="#ea580c" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="WEIGHTED SUM z" value={z.toFixed(4)} color={C} />
        <ResultBox label={`σ(z) OUTPUT`} value={output.toFixed(4)} color={output > 0.5 ? "#059669" : "#dc2626"} />
        <ResultBox label="PREDICTION" value={output > 0.5 ? "Class 1" : "Class 0"} color={output > 0.5 ? "#059669" : "#dc2626"} />
      </div>

      <CalcRow eq={`z = ${w1.toFixed(2)}×${x1.toFixed(2)} + (${w2.toFixed(2)})×${x2.toFixed(2)} + ${bias.toFixed(2)}`} result={z.toFixed(4)} color={C} />
      <CalcRow eq={`${activation}(${z.toFixed(3)})`} result={output.toFixed(4)} color={output > 0.5 ? "#059669" : "#dc2626"} />
      <CalcRow eq={`Decision: output ${output > 0.5 ? ">" : "≤"} 0.5`} result={output > 0.5 ? "YES" : "NO"} color={output > 0.5 ? "#059669" : "#dc2626"} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 10 — Deep Neural Networks
   ════════════════════════════════════════════════════════════════ */
function DNNSection() {
  const C = M.nn;
  const [hiddenSize, setHiddenSize] = useState(4);
  const [nLayers, setNLayers] = useState(1);
  const [animStep, setAnimStep] = useState(0);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => {
      f++;
      setAnimStep(s => (s + 1) % 60);
      setAnimT(Math.min(1, f / 20));
      if (f >= 60) f = 0;
    }, 80);
    return () => clearInterval(id);
  }, [hiddenSize, nLayers]);

  const layers = useMemo(() => {
    const l = [3];
    for (let i = 0; i < nLayers; i++) l.push(hiddenSize);
    l.push(1);
    return l;
  }, [hiddenSize, nLayers]);

  const totalParams = useMemo(() => {
    let p = 0;
    for (let i = 1; i < layers.length; i++) p += layers[i - 1] * layers[i] + layers[i];
    return p;
  }, [layers]);

  const layerX = (i) => 60 + i * (320 / (layers.length - 1));
  const nodeY = (layerIdx, nodeIdx) => {
    const n = layers[layerIdx];
    const totalH = (n - 1) * 30;
    return 130 - totalH / 2 + nodeIdx * 30;
  };

  const pulseLayer = Math.floor(animStep / (60 / layers.length)) % layers.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Deep Neural Networks" color={C} formula="y = f_L(... f₂(f₁(Wx + b)) ...)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Deep networks stack multiple layers of neurons. Each layer transforms its input, building increasingly abstract
          representations. Width (neurons per layer) and depth (number of layers) control the network's capacity.
        </div>
      </Card>

      <AnalogyBox text="An assembly line — raw materials (inputs) pass through stations (layers) where workers (neurons) each do a simple operation, and the final product (prediction) emerges. More stations = more sophisticated product, but also slower and harder to manage." />

      <Card title="Forward Pass Animation" color={C}>
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            Architecture: {layers.join(" → ")} | {totalParams} parameters
          </text>
          {/* Connections */}
          {layers.map((n, li) => {
            if (li === 0) return null;
            const prevN = layers[li - 1];
            return Array.from({ length: prevN }, (_, pi) =>
              Array.from({ length: n }, (_, ni) => {
                const active = li <= pulseLayer;
                return (
                  <line key={`${li}-${pi}-${ni}`}
                    x1={layerX(li - 1)} y1={nodeY(li - 1, pi)}
                    x2={layerX(li)} y2={nodeY(li, ni)}
                    stroke={active ? C : T.dim}
                    strokeWidth={active ? 1.2 : 0.4}
                    opacity={active ? 0.6 * animT : 0.2} />
                );
              })
            );
          })}
          {/* Nodes */}
          {layers.map((n, li) =>
            Array.from({ length: n }, (_, ni) => {
              const active = li <= pulseLayer;
              const isPulse = li === pulseLayer;
              return (
                <g key={`n${li}-${ni}`}>
                  <circle cx={layerX(li)} cy={nodeY(li, ni)}
                    r={isPulse ? 12 : 9}
                    fill={active ? (li === 0 ? "#2563eb22" : li === layers.length - 1 ? "#05966922" : C + "22") : T.surface}
                    stroke={active ? (li === 0 ? "#2563eb" : li === layers.length - 1 ? "#059669" : C) : T.dim}
                    strokeWidth={isPulse ? 2.5 : 1.5} />
                  {isPulse && (
                    <circle cx={layerX(li)} cy={nodeY(li, ni)} r="12"
                      fill="none" stroke={C} strokeWidth="1" opacity={0.3}>
                      <animate attributeName="r" from="12" to="20" dur="0.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.3" to="0" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })
          )}
          {/* Layer labels */}
          <text x={layerX(0)} y="240" textAnchor="middle" fontSize="8" fill="#2563eb">Input</text>
          {Array.from({ length: nLayers }, (_, i) => (
            <text key={i} x={layerX(i + 1)} y="240" textAnchor="middle" fontSize="8" fill={C}>Hidden {i + 1}</text>
          ))}
          <text x={layerX(layers.length - 1)} y="240" textAnchor="middle" fontSize="8" fill="#059669">Output</text>
        </svg>
      </Card>

      <SliderRow label="Hidden Layer Width" value={hiddenSize} min={2} max={8} step={1} onChange={setHiddenSize} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Number of Hidden Layers" value={nLayers} min={1} max={3} step={1} onChange={setNLayers} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="TOTAL PARAMS" value={totalParams} color={C} />
        <ResultBox label="ARCHITECTURE" value={layers.join("→")} color={M.mat} sub="layer sizes" />
        <ResultBox label="DEPTH" value={layers.length - 1} color={M.accent} sub="weight layers" />
      </div>

      {layers.map((n, i) => {
        if (i === 0) return <CalcRow key={i} eq={`Input layer`} result={`${n} neurons`} color="#2563eb" />;
        return <CalcRow key={i} eq={`Layer ${i}: ${layers[i - 1]}×${n} weights + ${n} biases`} result={`${layers[i - 1] * n + n} params`} color={C} />;
      })}
      <CalcRow eq="Total trainable parameters" result={totalParams} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 11 — Backpropagation
   ════════════════════════════════════════════════════════════════ */
function BackpropSection() {
  const C = M.nn;
  const [lr, setLr] = useState(0.1);
  const [epoch, setEpoch] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  const [losses, setLosses] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setEpoch(e => {
        const newE = e + 1;
        if (newE > 50) { setRunning(false); return e; }
        return newE;
      });
      setAnimPhase(p => (p + 1) % 3);
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const loss = 2.0 * Math.exp(-lr * epoch * 0.5) + 0.05 + (lr > 0.8 ? Math.sin(epoch * 0.5) * 0.3 : 0);
    setLosses(prev => [...prev.slice(-49), Math.max(0, loss)]);
  }, [epoch, lr]);

  const [animT, setAnimT] = useState(0);
  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, []);

  const currentLoss = losses.length > 0 ? losses[losses.length - 1] : 2.0;
  const phaseLabels = ["Forward Pass", "Compute Loss", "Backward Pass"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Backpropagation" color={C} formula="w_new = w_old − η × ∂L/∂w">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Backpropagation computes gradients of the loss with respect to every weight using the chain rule.
          The learning rate η controls step size: too large → divergence, too small → slow convergence.
        </div>
      </Card>

      <AnalogyBox text="A teacher grading an exam, then tracing back: 'The final answer was wrong because step 3 was wrong, which happened because step 1 used the wrong formula.' Each step gets a correction proportional to its contribution to the error." />

      <Card title="Gradient Flow & Loss Curve" color={C}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <button onClick={() => { setRunning(true); }}
            style={{ padding: "4px 14px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: C, color: "#fff", border: "none", fontWeight: 700 }}>
            {running ? "Training..." : "Start Training"}
          </button>
          <button onClick={() => { setRunning(false); setEpoch(0); setLosses([]); }}
            style={{ padding: "4px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}>
            Reset
          </button>
        </div>
        <svg viewBox="0 0 430 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {/* Network diagram with gradient arrows */}
          <g>
            {[80, 160, 240, 320].map((x, i) => {
              const labels = ["x", "h₁", "h₂", "ŷ"];
              const isActive = animPhase === 0 ? i <= 2 : animPhase === 2 ? i >= 1 : i === 3;
              return (
                <g key={i}>
                  <circle cx={x} cy="50" r="16" fill={isActive ? C + "33" : T.surface} stroke={isActive ? C : T.dim} strokeWidth="1.5" />
                  <text x={x} y="54" textAnchor="middle" fontSize="9" fill={isActive ? C : T.dim}>{labels[i]}</text>
                  {i < 3 && (
                    <>
                      <line x1={x + 16} y1="50" x2={[80, 160, 240, 320][i + 1] - 16} y2="50"
                        stroke={animPhase === 0 ? "#2563eb" : T.dim} strokeWidth="1.5" opacity={animT}
                        markerEnd={animPhase === 0 ? "url(#fwdArrow)" : ""} />
                      {animPhase === 2 && (
                        <line x1={[80, 160, 240, 320][i + 1] - 16} y1="42" x2={x + 16} y2="42"
                          stroke="#dc2626" strokeWidth="1.5" opacity={animT}
                          markerEnd="url(#bwdArrow)" />
                      )}
                    </>
                  )}
                </g>
              );
            })}
            {animPhase === 2 && (
              <>
                <text x="120" y="36" textAnchor="middle" fontSize="7" fill="#dc2626">∂L/∂w₁</text>
                <text x="200" y="36" textAnchor="middle" fontSize="7" fill="#dc2626">∂L/∂w₂</text>
                <text x="280" y="36" textAnchor="middle" fontSize="7" fill="#dc2626">∂L/∂w₃</text>
              </>
            )}
          </g>

          <defs>
            <marker id="fwdArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
            </marker>
            <marker id="bwdArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          <text x="215" y="78" textAnchor="middle" fontSize="9" fontWeight="700"
            fill={animPhase === 0 ? "#2563eb" : animPhase === 2 ? "#dc2626" : M.accent}>
            {phaseLabels[animPhase]}
          </text>

          {/* Loss curve */}
          <line x1="50" y1="240" x2="410" y2="240" stroke={T.border} />
          <line x1="50" y1="100" x2="50" y2="240" stroke={T.border} />
          <text x="230" y="256" textAnchor="middle" fontSize="8" fill={T.muted}>Epoch</text>
          <text x="30" y="170" textAnchor="middle" fontSize="8" fill={T.muted} transform="rotate(-90,30,170)">Loss</text>

          {losses.map((l, i, arr) => {
            if (i === 0) return null;
            const x1 = 50 + (i - 1) * (360 / 50);
            const x2 = 50 + i * (360 / 50);
            const y1 = 240 - Math.min(arr[i - 1], 2.5) * 56;
            const y2 = 240 - Math.min(l, 2.5) * 56;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C} strokeWidth="2" />;
          })}
          {losses.length > 0 && (
            <circle cx={50 + (losses.length - 1) * (360 / 50)} cy={240 - Math.min(currentLoss, 2.5) * 56}
              r="4" fill={C} />
          )}

          {/* LR indicator */}
          <text x="380" y="100" textAnchor="end" fontSize="8" fill={lr > 0.8 ? "#dc2626" : lr < 0.01 ? M.accent : M.mat}>
            η = {lr.toFixed(3)} {lr > 0.8 ? "(unstable!)" : lr < 0.01 ? "(too slow)" : "(good)"}
          </text>
        </svg>
      </Card>

      <SliderRow label="Learning Rate (η)" value={lr} min={0.001} max={1.5} step={0.001} onChange={setLr} color={lr > 0.8 ? "#dc2626" : C} />
      <SliderRow label="Current Epoch" value={epoch} min={0} max={50} step={1} onChange={(v) => { setEpoch(v); setRunning(false); }} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="CURRENT LOSS" value={currentLoss.toFixed(4)} color={C} />
        <ResultBox label="EPOCH" value={epoch} color={M.accent} />
        <ResultBox label="LR STATUS" value={lr > 0.8 ? "DIVERGING" : lr < 0.01 ? "SLOW" : "GOOD"} color={lr > 0.8 ? "#dc2626" : M.mat} />
      </div>

      <CalcRow eq={`Loss at epoch ${epoch}`} result={currentLoss.toFixed(5)} color={C} />
      <CalcRow eq={`w_new = w_old − ${lr.toFixed(3)} × ∂L/∂w`} result="updated" color={C} />
      <CalcRow eq={`Learning rate η`} result={lr.toFixed(4)} color={lr > 0.8 ? "#dc2626" : M.mat} />
      <CalcRow eq={`Convergence speed ∝ η`} result={lr > 0.8 ? "Unstable" : lr > 0.1 ? "Fast" : lr > 0.01 ? "Moderate" : "Slow"} color={M.accent} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 12 — CNN & Transformer
   ════════════════════════════════════════════════════════════════ */
function CNNTransformerSection() {
  const C = M.nn;
  const [kernelPos, setKernelPos] = useState(0);
  const [attentionToken, setAttentionToken] = useState(2);
  const [viewMode, setViewMode] = useState("cnn");
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setKernelPos(p => (p + 1) % 16);
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [viewMode]);

  const gridSize = 7;
  const kernelSize = 3;
  const kRow = Math.floor(kernelPos / (gridSize - kernelSize + 1));
  const kCol = kernelPos % (gridSize - kernelSize + 1);

  const microstructure = useMemo(() => {
    const r = seededRandom(55);
    return Array.from({ length: gridSize * gridSize }, () => Math.floor(r() * 4));
  }, []);

  const tokens = ["[CLS]", "Si", "Ge", "band", "gap", "1.12"];
  const attWeights = useMemo(() => {
    const r = seededRandom(attentionToken * 3 + 1);
    return tokens.map(() => r() * 0.5 + 0.1);
  }, [attentionToken]);
  const attSum = attWeights.reduce((a, b) => a + b, 0);
  const attNorm = attWeights.map(w => w / attSum);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="CNN & Transformer Architectures" color={C} formula="CNN: y = σ(W * x + b) | Transformer: Attention(Q,K,V)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          <b>CNNs</b> slide learned filters across spatial data (images, microstructures) to detect local patterns.
          <b>Transformers</b> use self-attention to relate all parts of the input simultaneously — powerful for sequences and graphs.
        </div>
      </Card>

      <AnalogyBox text="CNN is like a magnifying glass sliding across a page — it finds local patterns (edges, grain boundaries, defects). Transformer is like reading the whole page at once and understanding how every word (atom) relates to every other word (atom)." />

      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        {["cnn", "transformer"].map(m => (
          <button key={m} onClick={() => setViewMode(m)}
            style={{
              padding: "4px 14px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: viewMode === m ? C : T.surface, color: viewMode === m ? "#fff" : T.muted,
              border: `1px solid ${viewMode === m ? C : T.border}`, fontWeight: 700, textTransform: "uppercase"
            }}>{m}</button>
        ))}
      </div>

      <Card title={viewMode === "cnn" ? "Convolution on Microstructure" : "Self-Attention Mechanism"} color={C}>
        <svg viewBox="0 0 430 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {viewMode === "cnn" ? (
            <>
              <text x="100" y="18" textAnchor="middle" fontSize="9" fontWeight="600" fill={C}>Input (SEM-like)</text>
              <text x="320" y="18" textAnchor="middle" fontSize="9" fontWeight="600" fill={M.accent}>Feature Map</text>
              {/* Input grid */}
              {Array.from({ length: gridSize }, (_, r) =>
                Array.from({ length: gridSize }, (_, c) => {
                  const idx = r * gridSize + c;
                  const val = microstructure[idx];
                  const colors = ["#f0f4ff", "#93c5fd", "#3b82f6", "#1e40af"];
                  const inKernel = r >= kRow && r < kRow + kernelSize && c >= kCol && c < kCol + kernelSize;
                  return (
                    <rect key={idx} x={30 + c * 22} y={25 + r * 22}
                      width="20" height="20" rx="2"
                      fill={colors[val]}
                      stroke={inKernel ? "#dc2626" : T.border}
                      strokeWidth={inKernel ? 2.5 : 0.5} />
                  );
                })
              )}
              {/* Kernel highlight */}
              <rect x={30 + kCol * 22 - 1} y={25 + kRow * 22 - 1}
                width={kernelSize * 22 + 2} height={kernelSize * 22 + 2}
                fill="none" stroke="#dc2626" strokeWidth="2" rx="3" />
              <text x={30 + kCol * 22 + 33} y={25 + kRow * 22 + 36} fontSize="7" fill="#dc2626">Kernel 3×3</text>

              {/* Feature map (output) */}
              {Array.from({ length: gridSize - kernelSize + 1 }, (_, r) =>
                Array.from({ length: gridSize - kernelSize + 1 }, (_, c) => {
                  const active = r === kRow && c === kCol;
                  const val = (r + c) % 4;
                  const colors = ["#fef3c7", "#fcd34d", "#f59e0b", "#b45309"];
                  return (
                    <rect key={`o${r}${c}`} x={250 + c * 28} y={30 + r * 28}
                      width="24" height="24" rx="3"
                      fill={active ? "#dc262644" : colors[val]}
                      stroke={active ? "#dc2626" : T.border}
                      strokeWidth={active ? 2 : 0.5} />
                  );
                })
              )}
              {/* Arrow */}
              <line x1="195" y1="110" x2="240" y2="110" stroke={C} strokeWidth="1.5" markerEnd="url(#cnnArr)" />
              <text x="218" y="105" textAnchor="middle" fontSize="7" fill={C}>conv</text>
              <defs>
                <marker id="cnnArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C} />
                </marker>
              </defs>
              {/* Pool/Output */}
              <text x="100" y="200" textAnchor="middle" fontSize="8" fill={T.muted}>Stride=1, Padding=0</text>
              <text x="100" y="215" textAnchor="middle" fontSize="8" fill={T.muted}>Output: {gridSize - kernelSize + 1}×{gridSize - kernelSize + 1}</text>
              <text x="320" y="200" textAnchor="middle" fontSize="8" fill={M.accent}>Detects edges,</text>
              <text x="320" y="215" textAnchor="middle" fontSize="8" fill={M.accent}>grain boundaries</text>
            </>
          ) : (
            <>
              <text x="215" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
                Self-Attention — Query: "{tokens[attentionToken]}"
              </text>
              {/* Tokens */}
              {tokens.map((tok, i) => {
                const x = 40 + i * 65;
                const isQuery = i === attentionToken;
                return (
                  <g key={i} onClick={() => setAttentionToken(i)} style={{ cursor: "pointer" }}>
                    <rect x={x} y="35" width="55" height="25" rx="5"
                      fill={isQuery ? C + "33" : T.panel}
                      stroke={isQuery ? C : T.border} strokeWidth={isQuery ? 2 : 1} />
                    <text x={x + 27} y="52" textAnchor="middle" fontSize="9"
                      fill={isQuery ? C : T.ink} fontWeight={isQuery ? 700 : 400}>{tok}</text>
                  </g>
                );
              })}
              {/* Attention lines */}
              {tokens.map((_, i) => {
                const fromX = 40 + attentionToken * 65 + 27;
                const toX = 40 + i * 65 + 27;
                const weight = attNorm[i];
                return (
                  <g key={"att" + i}>
                    <line x1={fromX} y1="60" x2={toX} y2="110"
                      stroke={C} strokeWidth={weight * 8 + 0.5} opacity={weight * animT} />
                    <text x={toX} y="125" textAnchor="middle" fontSize="8" fill={C} fontWeight="700">
                      {(weight * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })}
              {/* Output tokens */}
              {tokens.map((tok, i) => {
                const x = 40 + i * 65;
                return (
                  <rect key={"out" + i} x={x} y="140" width="55" height="22" rx="4"
                    fill={M.accent + "22"} stroke={M.accent} strokeWidth="0.5" />
                );
              })}
              <text x="215" y="155" textAnchor="middle" fontSize="8" fill={M.accent}>Context-enriched embeddings</text>
              {/* Formula */}
              <text x="215" y="190" textAnchor="middle" fontSize="9" fill={T.ink} fontFamily="Georgia, serif">
                Attention(Q,K,V) = softmax(QKᵀ / √dₖ) V
              </text>
              <text x="215" y="210" textAnchor="middle" fontSize="8" fill={T.muted}>
                Materials use: CGCNN, MEGNet, Matformer
              </text>
            </>
          )}
        </svg>
      </Card>

      <SliderRow label={viewMode === "cnn" ? "Kernel Position" : "Attention Focus Token"} value={viewMode === "cnn" ? kernelPos : attentionToken}
        min={0} max={viewMode === "cnn" ? 15 : 5} step={1}
        onChange={viewMode === "cnn" ? setKernelPos : setAttentionToken}
        color={C} format={v => v.toFixed(0)} />
      <SliderRow label={viewMode === "cnn" ? "Feature Map Channel" : "Number of Attention Heads"}
        value={viewMode === "cnn" ? 1 : 4} min={1} max={8} step={1}
        onChange={() => { }} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="ARCHITECTURE" value={viewMode.toUpperCase()} color={C} />
        <ResultBox label={viewMode === "cnn" ? "KERNEL SIZE" : "ATTENTION"} value={viewMode === "cnn" ? "3×3" : tokens[attentionToken]} color={M.accent} />
        <ResultBox label="BEST FOR" value={viewMode === "cnn" ? "Images" : "Sequences"} color={M.mat} />
      </div>

      <CalcRow eq={viewMode === "cnn" ? "Conv output size" : "Attention dimension dₖ"} result={viewMode === "cnn" ? `${gridSize - kernelSize + 1}×${gridSize - kernelSize + 1}` : "64"} color={C} />
      <CalcRow eq={viewMode === "cnn" ? "Parameters per filter" : "Attention softmax Σ"} result={viewMode === "cnn" ? `${kernelSize * kernelSize + 1}` : attNorm.reduce((a, b) => a + b, 0).toFixed(3)} color={C} />
      <CalcRow eq="Materials application" result={viewMode === "cnn" ? "Microstructure analysis" : "Crystal graph networks"} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 13 — Feature Engineering
   ════════════════════════════════════════════════════════════════ */
function FeatureEngineeringSection() {
  const C = M.mat;
  const [compound, setCompound] = useState(0);
  const [animT, setAnimT] = useState(0);
  const [heatmapHover, setHeatmapHover] = useState(-1);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [compound]);

  const compounds = [
    {
      name: "CdTe", elements: ["Cd", "Te"], bandgap: 1.5,
      features: { Z_mean: 49, mass_mean: 127.3, EN_mean: 1.78, radius_mean: 1.53, coord: 4, vol: 72.5 },
      Z: [48, 52], EN: [1.69, 2.10], radius: [1.51, 1.37]
    },
    {
      name: "GaAs", elements: ["Ga", "As"], bandgap: 1.42,
      features: { Z_mean: 32, mass_mean: 72.3, EN_mean: 2.01, radius_mean: 1.26, coord: 4, vol: 45.2 },
      Z: [31, 33], EN: [1.81, 2.18], radius: [1.22, 1.19]
    },
    {
      name: "ZnO", elements: ["Zn", "O"], bandgap: 3.3,
      features: { Z_mean: 19, mass_mean: 40.7, EN_mean: 2.48, radius_mean: 0.98, coord: 4, vol: 24.0 },
      Z: [30, 8], EN: [1.65, 3.44], radius: [1.22, 0.73]
    },
    {
      name: "SiC", elements: ["Si", "C"], bandgap: 3.0,
      features: { Z_mean: 10, mass_mean: 20.0, EN_mean: 2.28, radius_mean: 1.00, coord: 4, vol: 20.7 },
      Z: [14, 6], EN: [1.90, 2.55], radius: [1.11, 0.77]
    },
    {
      name: "NaCl", elements: ["Na", "Cl"], bandgap: 8.5,
      features: { Z_mean: 14.5, mass_mean: 29.2, EN_mean: 2.07, radius_mean: 1.35, coord: 6, vol: 44.0 },
      Z: [11, 17], EN: [0.93, 3.16], radius: [1.54, 0.99]
    },
  ];

  const cd = compounds[compound];
  const corrMatrix = [
    [1.00, 0.95, -0.42, 0.87, 0.31],
    [0.95, 1.00, -0.38, 0.82, 0.28],
    [-0.42, -0.38, 1.00, -0.65, 0.72],
    [0.87, 0.82, -0.65, 1.00, 0.15],
    [0.31, 0.28, 0.72, 0.15, 1.00],
  ];
  const featureLabels = ["Z", "Mass", "EN", "Radius", "Coord"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Feature Engineering for Materials" color={C} formula="x = [Z_mean, mass_mean, EN_mean, r_mean, CN, V]">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Before ML can predict material properties, each compound must be converted into a numerical feature vector.
          Features include elemental properties (Z, mass, electronegativity, radius) and structural descriptors (coordination number, cell volume).
        </div>
      </Card>

      <AnalogyBox text="Before an AI can predict house prices, you need to describe each house: square footage, bedrooms, zip code, age. Feature engineering is writing the house description for crystals — the more informative the description, the better the prediction." />

      <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
        {compounds.map((c, i) => (
          <button key={i} onClick={() => setCompound(i)}
            style={{
              padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: compound === i ? C : T.surface, color: compound === i ? "#fff" : T.muted,
              border: `1px solid ${compound === i ? C : T.border}`, fontWeight: 700
            }}>{c.name}</button>
        ))}
      </div>

      <Card title={`Feature Vector: ${cd.name}`} color={C}>
        <svg viewBox="0 0 420 280" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            {cd.name} — Bandgap: {cd.bandgap} eV
          </text>
          {/* Feature bars */}
          {Object.entries(cd.features).map(([key, val], i) => {
            const labels = { Z_mean: "Z (mean)", mass_mean: "Mass (mean)", EN_mean: "EN (mean)", radius_mean: "Radius (mean)", coord: "Coord. #", vol: "Volume" };
            const maxVals = { Z_mean: 60, mass_mean: 150, EN_mean: 4, radius_mean: 2, coord: 8, vol: 80 };
            const barW = (val / maxVals[key]) * 220 * animT;
            return (
              <g key={key}>
                <text x="8" y={42 + i * 28} fontSize="8" fill={T.muted}>{labels[key]}</text>
                <rect x="95" y={32 + i * 28} width={barW} height="14" rx="3" fill={C} opacity="0.7" />
                <text x={100 + barW} y={43 + i * 28} fontSize="8" fill={C} fontWeight="700">{typeof val === "number" ? val.toFixed(2) : val}</text>
              </g>
            );
          })}
          {/* Correlation heatmap */}
          <text x="340" y="32" textAnchor="middle" fontSize="8" fontWeight="600" fill={T.muted}>Correlation Heatmap</text>
          {corrMatrix.map((row, i) =>
            row.map((val, j) => {
              const hue = val > 0 ? 220 : 0;
              const sat = Math.abs(val) * 80;
              const light = 95 - Math.abs(val) * 45;
              return (
                <g key={`${i}-${j}`} onMouseEnter={() => setHeatmapHover(i * 5 + j)} onMouseLeave={() => setHeatmapHover(-1)}>
                  <rect x={270 + j * 28} y={38 + i * 28} width="26" height="26" rx="2"
                    fill={`hsl(${hue}, ${sat}%, ${light}%)`}
                    stroke={heatmapHover === i * 5 + j ? "#000" : "none"} strokeWidth="1" />
                  <text x={283 + j * 28} y={55 + i * 28} textAnchor="middle" fontSize="6" fill={Math.abs(val) > 0.5 ? "#fff" : T.ink}>
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })
          )}
          {featureLabels.map((l, i) => (
            <g key={"lbl" + i}>
              <text x={283 + i * 28} y={38 + 5 * 28 + 10} textAnchor="middle" fontSize="6" fill={T.muted}>{l}</text>
              <text x="267" y={55 + i * 28} textAnchor="end" fontSize="6" fill={T.muted}>{l}</text>
            </g>
          ))}
          {/* Element details */}
          <text x="100" y="225" textAnchor="middle" fontSize="8" fill={T.muted}>Elements: {cd.elements.join(", ")}</text>
          <text x="100" y="240" textAnchor="middle" fontSize="8" fill={T.muted}>
            Z: {cd.Z.join(", ")} | EN: {cd.EN.map(v => v.toFixed(2)).join(", ")}
          </text>
          <text x="100" y="255" textAnchor="middle" fontSize="8" fill={T.muted}>
            Radii: {cd.radius.map(v => v.toFixed(2)).join(", ")} Å
          </text>
        </svg>
      </Card>

      <SliderRow label="Compound Index" value={compound} min={0} max={4} step={1} onChange={setCompound} color={C} format={v => compounds[v]?.name || ""} />
      <SliderRow label="Feature Scaling Factor" value={1.0} min={0.5} max={2.0} step={0.1} onChange={() => { }} color={M.accent} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="COMPOUND" value={cd.name} color={C} />
        <ResultBox label="BANDGAP" value={cd.bandgap + " eV"} color={M.accent} />
        <ResultBox label="FEATURES" value={Object.keys(cd.features).length} color={M.algo} sub="descriptors" />
      </div>

      <InfoRow label="Z mean" value={cd.features.Z_mean} />
      <InfoRow label="Mass mean (amu)" value={cd.features.mass_mean} />
      <InfoRow label="Electronegativity mean" value={cd.features.EN_mean} />
      <InfoRow label="Radius mean (Å)" value={cd.features.radius_mean} />
      <InfoRow label="Coordination number" value={cd.features.coord} />
      <InfoRow label="Cell volume (ų)" value={cd.features.vol} />
      <CalcRow eq={`EN difference |${cd.EN[0].toFixed(2)} − ${cd.EN[1].toFixed(2)}|`} result={Math.abs(cd.EN[0] - cd.EN[1]).toFixed(2)} color={C} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 14 — Property Prediction
   ════════════════════════════════════════════════════════════════ */
function PropertyPredictionSection() {
  const C = M.mat;
  const [trained, setTrained] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [modelType, setModelType] = useState("linear");
  const [animT, setAnimT] = useState(0);

  const materials = useMemo(() => [
    { name: "Si", EN: 1.90, bandgap: 1.12 }, { name: "GaAs", EN: 2.00, bandgap: 1.42 },
    { name: "CdTe", EN: 1.78, bandgap: 1.50 }, { name: "InP", EN: 1.95, bandgap: 1.35 },
    { name: "GaN", EN: 1.94, bandgap: 3.40 }, { name: "ZnO", EN: 2.48, bandgap: 3.30 },
    { name: "SiC", EN: 2.28, bandgap: 3.00 }, { name: "AlN", EN: 2.15, bandgap: 6.20 },
    { name: "GaP", EN: 2.06, bandgap: 2.26 }, { name: "InAs", EN: 1.88, bandgap: 0.36 },
    { name: "ZnSe", EN: 2.10, bandgap: 2.70 }, { name: "CdS", EN: 1.95, bandgap: 2.42 },
    { name: "AlAs", EN: 2.12, bandgap: 2.16 }, { name: "InSb", EN: 1.75, bandgap: 0.17 },
    { name: "GaSb", EN: 1.82, bandgap: 0.73 }, { name: "ZnTe", EN: 1.90, bandgap: 2.26 },
    { name: "MgO", EN: 2.28, bandgap: 7.80 }, { name: "BN", EN: 2.55, bandgap: 6.40 },
    { name: "Diamond", EN: 2.55, bandgap: 5.47 }, { name: "Ge", EN: 2.01, bandgap: 0.66 },
  ], []);

  useEffect(() => {
    if (!trained) { setTrainProgress(0); return; }
    let f = 0;
    const id = setInterval(() => { f++; setTrainProgress(Math.min(1, f / 30)); if (f >= 30) clearInterval(id); }, 60);
    return () => clearInterval(id);
  }, [trained]);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, []);

  const predictions = useMemo(() => {
    if (!trained) return materials.map(m => ({ ...m, pred: 0 }));
    const n = materials.length;
    const sx = materials.reduce((s, m) => s + m.EN, 0);
    const sy = materials.reduce((s, m) => s + m.bandgap, 0);
    const sxy = materials.reduce((s, m) => s + m.EN * m.bandgap, 0);
    const sxx = materials.reduce((s, m) => s + m.EN * m.EN, 0);
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const intercept = (sy - slope * sx) / n;
    return materials.map(m => ({ ...m, pred: Math.max(0, slope * m.EN + intercept) }));
  }, [trained, materials]);

  const mae = trained ? predictions.reduce((s, p) => s + Math.abs(p.bandgap - p.pred), 0) / predictions.length : 0;
  const ssTot = predictions.reduce((s, p) => {
    const mean = predictions.reduce((a, b) => a + b.bandgap, 0) / predictions.length;
    return s + (p.bandgap - mean) ** 2;
  }, 0);
  const ssRes = predictions.reduce((s, p) => s + (p.bandgap - p.pred) ** 2, 0);
  const r2 = trained ? 1 - ssRes / ssTot : 0;

  const toSvgX = (v) => 50 + (v - 1.5) * (320 / 1.5);
  const toSvgY = (v) => 220 - (v - 0) * (180 / 8.5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Bandgap Property Prediction" color={C} formula="Eᵍ(predicted) = f(features)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Train a model on 20 materials with known bandgaps. The parity plot (predicted vs actual) reveals model quality.
          A perfect model places all points on the diagonal y = x line.
        </div>
      </Card>

      <AnalogyBox text="Teaching a student by showing 20 solved examples, then asking them to predict the 21st. The parity plot is their answer key — points on the diagonal mean they got it right, points far off mean they need more practice." />

      <Card title="Parity Plot: Predicted vs Actual Bandgap" color={C}>
        <button onClick={() => setTrained(!trained)}
          style={{ padding: "4px 14px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: C, color: "#fff", border: "none", fontWeight: 700, marginBottom: 6 }}>
          {trained ? "Reset" : "Train Model"}
        </button>
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <line x1="50" y1="220" x2="390" y2="220" stroke={T.border} />
          <line x1="50" y1="20" x2="50" y2="220" stroke={T.border} />
          <text x="220" y="250" textAnchor="middle" fontSize="9" fill={T.muted}>Actual Bandgap (eV)</text>
          <text x="20" y="120" textAnchor="middle" fontSize="9" fill={T.muted} transform="rotate(-90,20,120)">Predicted (eV)</text>
          {/* Perfect diagonal */}
          <line x1="50" y1="220" x2="390" y2="20" stroke={T.dim} strokeWidth="1" strokeDasharray="4,4" />
          <text x="380" y="30" fontSize="7" fill={T.dim}>y = x</text>
          {/* Grid */}
          {[0, 2, 4, 6, 8].map(v => (
            <g key={v}>
              <text x="44" y={toSvgY(v) + 3} textAnchor="end" fontSize="7" fill={T.dim}>{v}</text>
              <text x={50 + (v / 8.5) * 340} y="232" textAnchor="middle" fontSize="7" fill={T.dim}>{v}</text>
            </g>
          ))}
          {/* Data points */}
          {predictions.map((p, i) => {
            const show = trained ? (i / predictions.length) < trainProgress : true;
            if (!show) return null;
            const parityX = 50 + (p.bandgap / 8.5) * 340;
            const parityY = trained ? toSvgY(p.pred) : toSvgY(p.bandgap);
            return (
              <g key={i}>
                <circle cx={parityX} cy={parityY} r="5" fill={C} stroke="#fff" strokeWidth="1" opacity={0.8} />
                <text x={parityX + 7} y={parityY - 4} fontSize="6" fill={T.ink}>{p.name}</text>
              </g>
            );
          })}
        </svg>
      </Card>

      <SliderRow label="Training Progress" value={trained ? trainProgress * 100 : 0} min={0} max={100} step={1}
        onChange={() => { }} color={C} format={v => v.toFixed(0)} unit="%" />
      <SliderRow label="Number of Materials" value={materials.length} min={5} max={20} step={1}
        onChange={() => { }} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="MAE" value={trained ? mae.toFixed(3) + " eV" : "—"} color={trained ? C : T.muted} />
        <ResultBox label="R²" value={trained ? r2.toFixed(3) : "—"} color={trained ? (r2 > 0.5 ? M.mat : "#dc2626") : T.muted} />
        <ResultBox label="N MATERIALS" value={materials.length} color={M.accent} />
      </div>

      {trained && predictions.slice(0, 5).map((p, i) => (
        <CalcRow key={i} eq={`${p.name}: actual=${p.bandgap.toFixed(2)}, pred=${p.pred.toFixed(2)}`}
          result={`Δ = ${Math.abs(p.bandgap - p.pred).toFixed(2)} eV`} color={C} />
      ))}
      <CalcRow eq="Mean Absolute Error" result={trained ? mae.toFixed(4) + " eV" : "—"} color={C} />
      <CalcRow eq="R² (coefficient of determination)" result={trained ? r2.toFixed(4) : "—"} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 15 — Generative Models
   ════════════════════════════════════════════════════════════════ */
function GenerativeModelsSection() {
  const C = M.mat;
  const [latentX, setLatentX] = useState(0);
  const [latentY, setLatentY] = useState(0);
  const [latentDim, setLatentDim] = useState(2);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [latentX, latentY]);

  const latentMaterials = useMemo(() => [
    { x: -1.5, y: 1.0, name: "Si", bg: 1.12, color: "#2563eb" },
    { x: -0.8, y: 0.5, name: "GaAs", bg: 1.42, color: "#3b82f6" },
    { x: -0.3, y: -0.5, name: "CdTe", bg: 1.50, color: "#60a5fa" },
    { x: 1.0, y: 1.5, name: "ZnO", bg: 3.30, color: "#f59e0b" },
    { x: 1.5, y: 0.8, name: "GaN", bg: 3.40, color: "#f97316" },
    { x: 2.0, y: 1.2, name: "BN", bg: 6.40, color: "#dc2626" },
    { x: 0.5, y: -1.0, name: "InSb", bg: 0.17, color: "#1e3a5f" },
    { x: 0.0, y: 0.0, name: "GaP", bg: 2.26, color: "#22c55e" },
    { x: -1.0, y: -1.2, name: "Ge", bg: 0.66, color: "#1e40af" },
    { x: 1.8, y: -0.5, name: "AlN", bg: 6.20, color: "#ef4444" },
  ], []);

  const nearest = latentMaterials.reduce((best, m) => {
    const d = Math.sqrt((m.x - latentX) ** 2 + (m.y - latentY) ** 2);
    return d < best.d ? { ...m, d } : best;
  }, { d: Infinity, name: "?", bg: 0, x: 0, y: 0 });

  const interpBandgap = useMemo(() => {
    let wsum = 0, bsum = 0;
    latentMaterials.forEach(m => {
      const d = Math.max(0.1, Math.sqrt((m.x - latentX) ** 2 + (m.y - latentY) ** 2));
      const w = 1 / (d * d);
      wsum += w;
      bsum += w * m.bg;
    });
    return bsum / wsum;
  }, [latentX, latentY, latentMaterials]);

  const toSvgX = (v) => 50 + (v + 2.5) * (320 / 5);
  const toSvgY = (v) => 210 - (v + 2) * (180 / 4);

  const handleLatentClick = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 420;
    const py = ((e.clientY - rect.top) / rect.height) * 260;
    const x = (px - 50) * 5 / 320 - 2.5;
    const y = -((py - 210) * 4 / 180 + 2);
    setLatentX(Math.max(-2.5, Math.min(2.5, x)));
    setLatentY(Math.max(-2, Math.min(2, y)));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Generative Models (VAE)" color={C} formula="Encoder: x → μ, σ | Decoder: z → x̂">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Variational Autoencoders compress materials into a low-dimensional latent space where similar materials
          cluster together. Clicking anywhere in latent space generates a new material — interpolation between known materials.
        </div>
      </Card>

      <AnalogyBox text="A recipe generator — instead of searching through millions of recipes, compress them into a 'flavor space' where nearby points taste similar. Click anywhere to generate a new recipe. Move between chocolate cake and vanilla cake to get a marble cake." />

      <Card title="VAE Latent Space — Click to Generate" color={C}>
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8, cursor: "crosshair" }}
          onClick={handleLatentClick}>
          <text x="210" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            2D Latent Space — Color = Bandgap
          </text>
          {/* Background gradient field */}
          {Array.from({ length: 20 }, (_, i) =>
            Array.from({ length: 20 }, (_, j) => {
              const x = -2.5 + i * 0.25;
              const y = -2 + j * 0.2;
              let wsum = 0, bsum = 0;
              latentMaterials.forEach(m => {
                const d = Math.max(0.3, Math.sqrt((m.x - x) ** 2 + (m.y - y) ** 2));
                const w = 1 / (d * d);
                wsum += w;
                bsum += w * m.bg;
              });
              const bg = bsum / wsum;
              const hue = Math.max(0, 240 - bg * 35);
              return (
                <rect key={`${i}-${j}`} x={toSvgX(x) - 8} y={toSvgY(y) - 5}
                  width="16" height="10" fill={`hsl(${hue}, 60%, 85%)`} opacity={0.5 * animT} />
              );
            })
          )}
          {/* Known materials */}
          {latentMaterials.map((m, i) => (
            <g key={i}>
              <circle cx={toSvgX(m.x)} cy={toSvgY(m.y)} r="8" fill={m.color} stroke="#fff" strokeWidth="1.5" />
              <text x={toSvgX(m.x)} y={toSvgY(m.y) - 11} textAnchor="middle" fontSize="7" fill={T.ink} fontWeight="600">{m.name}</text>
              <text x={toSvgX(m.x)} y={toSvgY(m.y) + 16} textAnchor="middle" fontSize="6" fill={T.muted}>{m.bg}eV</text>
            </g>
          ))}
          {/* User click point */}
          <circle cx={toSvgX(latentX)} cy={toSvgY(latentY)} r="10"
            fill="none" stroke="#dc2626" strokeWidth="2.5" />
          <circle cx={toSvgX(latentX)} cy={toSvgY(latentY)} r="4" fill="#dc2626" />
          <text x={toSvgX(latentX)} y={toSvgY(latentY) - 14} textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="700">
            Generated: {interpBandgap.toFixed(2)} eV
          </text>
          {/* Axes */}
          <text x="210" y="248" textAnchor="middle" fontSize="8" fill={T.muted}>Latent z₁</text>
          <text x="25" y="120" textAnchor="middle" fontSize="8" fill={T.muted} transform="rotate(-90,25,120)">Latent z₂</text>
        </svg>
      </Card>

      <SliderRow label="Latent z₁" value={latentX} min={-2.5} max={2.5} step={0.05} onChange={setLatentX} color={C} />
      <SliderRow label="Latent z₂" value={latentY} min={-2} max={2} step={0.05} onChange={setLatentY} color={M.accent} />
      <SliderRow label="Latent Dimensions" value={latentDim} min={2} max={10} step={1} onChange={setLatentDim} color={M.algo} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="GENERATED Eᵍ" value={interpBandgap.toFixed(2) + " eV"} color={C} />
        <ResultBox label="NEAREST" value={nearest.name} color={M.accent} sub={`d=${nearest.d.toFixed(2)}`} />
        <ResultBox label="LATENT DIM" value={latentDim} color={M.algo} />
      </div>

      <CalcRow eq={`z = (${latentX.toFixed(2)}, ${latentY.toFixed(2)})`} result={`→ Eᵍ ≈ ${interpBandgap.toFixed(2)} eV`} color={C} />
      <CalcRow eq={`Nearest known material`} result={`${nearest.name} (${nearest.bg} eV)`} color={M.accent} />
      <CalcRow eq="Interpolation method" result="Inverse distance weighting" color={M.algo} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 16 — Active Learning
   ════════════════════════════════════════════════════════════════ */
function ActiveLearningSection() {
  const C = M.mat;
  const [iteration, setIteration] = useState(0);
  const [queriedPts, setQueriedPts] = useState([0.1, 0.5, 0.9]);
  const [animT, setAnimT] = useState(0);
  const [acqType, setAcqType] = useState("ucb");

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [iteration]);

  const trueFunction = (x) => -2 * (x - 0.3) * (x - 0.3) + 1.5 * Math.sin(4 * x) + 0.5;
  const gpMean = (x, pts) => {
    if (pts.length === 0) return 0;
    let wSum = 0, ySum = 0;
    pts.forEach(p => {
      const d = Math.max(0.02, Math.abs(x - p));
      const w = Math.exp(-d * d / 0.03);
      wSum += w;
      ySum += w * trueFunction(p);
    });
    return wSum > 0 ? ySum / wSum : 0;
  };
  const gpVar = (x, pts) => {
    let minD = 1;
    pts.forEach(p => { const d = Math.abs(x - p); if (d < minD) minD = d; });
    return 0.5 * (1 - Math.exp(-minD * minD / 0.02));
  };

  const suggestNext = () => {
    let bestX = 0, bestAcq = -Infinity;
    for (let x = 0.02; x <= 0.98; x += 0.02) {
      const m = gpMean(x, queriedPts);
      const v = gpVar(x, queriedPts);
      const acq = acqType === "ucb" ? m + 2 * Math.sqrt(v) : Math.sqrt(v);
      if (acq > bestAcq) { bestAcq = acq; bestX = x; }
    }
    setQueriedPts(p => [...p, bestX]);
    setIteration(i => i + 1);
  };

  const toX = (v) => 50 + v * 340;
  const toY = (v) => 200 - (v + 1) * 70;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Active Learning & Bayesian Optimization" color={C} formula="x_next = argmax α(x) = μ(x) + κσ(x)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Active learning selects the most informative experiment to run next, minimizing the total number of experiments
          needed. A Gaussian Process models the unknown function and its uncertainty; the acquisition function α(x) balances
          exploration (high uncertainty) and exploitation (high predicted value).
        </div>
      </Card>

      <AnalogyBox text="A chef tasting a new spice blend — instead of trying all 1000 combinations, taste a few, build a mental model of the flavor landscape, then strategically pick the next combination to maximize learning. Each taste reduces uncertainty the most." />

      <Card title="Bayesian Optimization Loop" color={C}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <button onClick={suggestNext}
            style={{ padding: "4px 14px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: C, color: "#fff", border: "none", fontWeight: 700 }}>
            Suggest Next Experiment
          </button>
          <button onClick={() => { setQueriedPts([0.1, 0.5, 0.9]); setIteration(0); }}
            style={{ padding: "4px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: T.surface, color: T.muted, border: `1px solid ${T.border}` }}>
            Reset
          </button>
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {["ucb", "ei"].map(a => (
              <button key={a} onClick={() => setAcqType(a)}
                style={{
                  padding: "3px 8px", fontSize: 9, borderRadius: 4, cursor: "pointer",
                  background: acqType === a ? C : T.surface, color: acqType === a ? "#fff" : T.muted,
                  border: `1px solid ${acqType === a ? C : T.border}`, textTransform: "uppercase"
                }}>{a}</button>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 420 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            Iteration {iteration} — {queriedPts.length} points queried
          </text>
          <line x1="50" y1="200" x2="390" y2="200" stroke={T.border} />
          <line x1="50" y1="20" x2="50" y2="200" stroke={T.border} />
          <text x="220" y="218" textAnchor="middle" fontSize="8" fill={T.muted}>Composition x</text>
          <text x="30" y="110" textAnchor="middle" fontSize="8" fill={T.muted} transform="rotate(-90,30,110)">Formation Energy</text>

          {/* True function (hidden) */}
          {linspace(0, 1, 80).map((x, i, arr) => {
            if (i === 0) return null;
            const x0 = arr[i - 1];
            return <line key={"true" + i} x1={toX(x0)} y1={toY(trueFunction(x0))} x2={toX(x)} y2={toY(trueFunction(x))}
              stroke={T.dim} strokeWidth="1" strokeDasharray="3,3" />;
          })}

          {/* GP mean + uncertainty */}
          {linspace(0, 1, 60).map((x, i, arr) => {
            if (i === 0) return null;
            const x0 = arr[i - 1];
            const m0 = gpMean(x0, queriedPts), m1 = gpMean(x, queriedPts);
            const v0 = gpVar(x0, queriedPts), v1 = gpVar(x, queriedPts);
            return (
              <g key={"gp" + i}>
                <line x1={toX(x0)} y1={toY(m0)} x2={toX(x)} y2={toY(m1)} stroke={C} strokeWidth="2" opacity={animT} />
                <line x1={toX(x0)} y1={toY(m0 + 2 * Math.sqrt(v0))} x2={toX(x)} y2={toY(m1 + 2 * Math.sqrt(v1))}
                  stroke={C} strokeWidth="0.5" opacity={0.3 * animT} />
                <line x1={toX(x0)} y1={toY(m0 - 2 * Math.sqrt(v0))} x2={toX(x)} y2={toY(m1 - 2 * Math.sqrt(v1))}
                  stroke={C} strokeWidth="0.5" opacity={0.3 * animT} />
              </g>
            );
          })}

          {/* Uncertainty shading */}
          <path d={
            linspace(0, 1, 40).map((x, i) => {
              const m = gpMean(x, queriedPts), v = gpVar(x, queriedPts);
              return `${i === 0 ? "M" : "L"} ${toX(x)} ${toY(m + 2 * Math.sqrt(v))}`;
            }).join(" ") + " " +
            linspace(0, 1, 40).reverse().map((x, i) => {
              const m = gpMean(x, queriedPts), v = gpVar(x, queriedPts);
              return `L ${toX(x)} ${toY(m - 2 * Math.sqrt(v))}`;
            }).join(" ") + " Z"
          } fill={C + "15"} opacity={animT} />

          {/* Queried points */}
          {queriedPts.map((p, i) => (
            <g key={i}>
              <circle cx={toX(p)} cy={toY(trueFunction(p))} r={i >= queriedPts.length - 1 && i > 2 ? 7 : 5}
                fill={i >= queriedPts.length - 1 && i > 2 ? "#dc2626" : C}
                stroke="#fff" strokeWidth="1.5" />
              {i >= queriedPts.length - 1 && i > 2 && (
                <text x={toX(p)} y={toY(trueFunction(p)) - 10} textAnchor="middle" fontSize="7" fill="#dc2626" fontWeight="700">NEW</text>
              )}
            </g>
          ))}

          {/* Acquisition function (small inset) */}
          <rect x="280" y="220" width="130" height="35" rx="4" fill={T.panel} stroke={T.border} />
          <text x="345" y="230" textAnchor="middle" fontSize="7" fill={T.muted}>Acquisition α(x)</text>
          {linspace(0, 1, 30).map((x, i, arr) => {
            if (i === 0) return null;
            const x0 = arr[i - 1];
            const a0 = acqType === "ucb" ? gpMean(x0, queriedPts) + 2 * Math.sqrt(gpVar(x0, queriedPts)) : Math.sqrt(gpVar(x0, queriedPts));
            const a1 = acqType === "ucb" ? gpMean(x, queriedPts) + 2 * Math.sqrt(gpVar(x, queriedPts)) : Math.sqrt(gpVar(x, queriedPts));
            return <line key={"acq" + i} x1={285 + x0 * 120} y1={252 - Math.min(a0, 2) * 10} x2={285 + x * 120} y2={252 - Math.min(a1, 2) * 10}
              stroke={M.accent} strokeWidth="1.5" />;
          })}
        </svg>
      </Card>

      <SliderRow label="Iteration" value={iteration} min={0} max={20} step={1}
        onChange={(v) => { setIteration(v); }} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Exploration-Exploitation κ" value={2.0} min={0.1} max={5.0} step={0.1}
        onChange={() => { }} color={M.accent} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="POINTS QUERIED" value={queriedPts.length} color={C} />
        <ResultBox label="ITERATION" value={iteration} color={M.accent} />
        <ResultBox label="ACQUISITION" value={acqType.toUpperCase()} color={M.algo} sub={acqType === "ucb" ? "Upper Conf. Bound" : "Expected Improvement"} />
      </div>

      {queriedPts.slice(-4).map((p, i) => (
        <CalcRow key={i} eq={`x = ${p.toFixed(3)} → f(x)`} result={trueFunction(p).toFixed(4)} color={C} />
      ))}
      <CalcRow eq="Mean uncertainty (σ̄)" result={(linspace(0, 1, 20).reduce((s, x) => s + gpVar(x, queriedPts), 0) / 20).toFixed(4)} color={M.accent} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 17 — Data Pipeline
   ════════════════════════════════════════════════════════════════ */
function DataPipelineSection() {
  const C = M.prac;
  const [activeStage, setActiveStage] = useState(0);
  const [flowAnim, setFlowAnim] = useState(0);
  const [animT, setAnimT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFlowAnim(f => (f + 1) % 100);
      setActiveStage(s => (s + 1) % 7);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [activeStage]);

  const stages = [
    { name: "Database", desc: "Materials Project, AFLOW, OQMD", icon: "DB", code: "from mp_api.client import MPRester" },
    { name: "Query", desc: "Filter by formula, space group, Eᵍ", icon: "Q", code: "mpr.materials.search(band_gap=(1,3))" },
    { name: "Clean", desc: "Remove nulls, outliers, duplicates", icon: "C", code: "df.dropna(); df = df[df.bg < 10]" },
    { name: "Featurize", desc: "Magpie, SOAP, Coulomb matrix", icon: "F", code: "featurizer.featurize_dataframe(df)" },
    { name: "Split", desc: "80/20 train/test stratified", icon: "S", code: "train_test_split(X, y, test_size=0.2)" },
    { name: "Train", desc: "RandomForest, GBT, Neural Net", icon: "T", code: "model.fit(X_train, y_train)" },
    { name: "Evaluate", desc: "MAE, R², cross-validation", icon: "E", code: "mean_absolute_error(y_test, y_pred)" },
  ];

  const stageColors = ["#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706", "#0e7490", C];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="ML Data Pipeline" color={C} formula="Data → Clean → Featurize → Split → Train → Evaluate">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Building a materials ML model requires a structured pipeline. Each stage transforms data:
          from raw database entries to cleaned features to trained predictions. Click stages to explore.
        </div>
      </Card>

      <AnalogyBox text="Cooking from a recipe: grocery shopping (data collection from databases), washing vegetables (cleaning missing values), chopping into pieces (featurizing compounds), separating tasting portions (train/test split), cooking (training), and final tasting (evaluation)." />

      <Card title="Pipeline Flow" color={C}>
        <svg viewBox="0 0 430 260" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {stages.map((s, i) => {
            const x = 25 + i * 57;
            const isActive = i === activeStage;
            const col = stageColors[i];
            return (
              <g key={i} onClick={() => setActiveStage(i)} style={{ cursor: "pointer" }}>
                {/* Box */}
                <rect x={x} y="30" width="50" height="40" rx="6"
                  fill={isActive ? col + "22" : T.panel}
                  stroke={isActive ? col : T.border}
                  strokeWidth={isActive ? 2.5 : 1} />
                <text x={x + 25} y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill={col}>{s.icon}</text>
                <text x={x + 25} y="60" textAnchor="middle" fontSize="6" fill={T.muted}>{s.name}</text>
                {/* Arrow */}
                {i < stages.length - 1 && (
                  <line x1={x + 52} y1="50" x2={x + 55} y2="50" stroke={T.dim} strokeWidth="1" />
                )}
                {/* Data flow animation */}
                {i <= activeStage && (
                  <circle cx={x + 25} cy="50" r="3" fill={col} opacity={isActive ? 1 : 0.3}>
                    {isActive && (
                      <>
                        <animate attributeName="r" from="3" to="18" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                )}
              </g>
            );
          })}
          {/* Active stage details */}
          <rect x="25" y="85" width="380" height="75" rx="6" fill={T.panel} stroke={stageColors[activeStage] + "44"} />
          <text x="35" y="102" fontSize="11" fontWeight="700" fill={stageColors[activeStage]}>
            Stage {activeStage + 1}: {stages[activeStage].name}
          </text>
          <text x="35" y="118" fontSize="10" fill={T.ink}>{stages[activeStage].desc}</text>
          <rect x="35" y="125" width="360" height="20" rx="3" fill="#1e293b" />
          <text x="42" y="138" fontSize="8" fill="#a5f3fc" fontFamily="monospace">{stages[activeStage].code}</text>
          {/* Progress bar */}
          <rect x="25" y="175" width="380" height="8" rx="4" fill={T.border} />
          <rect x="25" y="175" width={(activeStage + 1) / stages.length * 380} height="8" rx="4"
            fill={stageColors[activeStage]} opacity={animT} />
          <text x="215" y="198" textAnchor="middle" fontSize="9" fill={T.muted}>
            Pipeline Progress: {((activeStage + 1) / stages.length * 100).toFixed(0)}%
          </text>
          {/* Stats */}
          <text x="35" y="220" fontSize="8" fill={T.muted}>Input: 10,000 compounds → After cleaning: 8,500 → Features: 145 → Train: 6,800 / Test: 1,700</text>
          <text x="35" y="240" fontSize="8" fill={T.muted}>Model: Random Forest → MAE: 0.32 eV → R²: 0.87 → CV Score: 0.85 ± 0.03</text>
        </svg>
      </Card>

      <SliderRow label="Active Stage" value={activeStage} min={0} max={6} step={1}
        onChange={setActiveStage} color={C} format={v => stages[v]?.name || ""} />
      <SliderRow label="Dataset Size (compounds)" value={10000} min={100} max={50000} step={100}
        onChange={() => { }} color={M.accent} format={v => v.toFixed(0)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="STAGE" value={stages[activeStage].name} color={stageColors[activeStage]} />
        <ResultBox label="PROGRESS" value={((activeStage + 1) / stages.length * 100).toFixed(0) + "%"} color={C} />
        <ResultBox label="PIPELINE" value="7 stages" color={M.mat} />
      </div>

      {stages.map((s, i) => (
        <CalcRow key={i} eq={`${i + 1}. ${s.name}`} result={i <= activeStage ? "✓ Complete" : "Pending"} color={i <= activeStage ? M.mat : T.muted} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 18 — Hyperparameter Tuning
   ════════════════════════════════════════════════════════════════ */
function HyperparamSection() {
  const C = M.prac;
  const [searchType, setSearchType] = useState("grid");
  const [gridProgress, setGridProgress] = useState(0);
  const [animT, setAnimT] = useState(0);
  const [bestLR, setBestLR] = useState(0.01);

  useEffect(() => {
    const id = setInterval(() => {
      setGridProgress(p => (p + 1) % 50);
    }, 150);
    return () => clearInterval(id);
  }, [searchType]);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [searchType]);

  const gridSize = 7;
  const gridVals = useMemo(() => {
    const r = seededRandom(42);
    return Array.from({ length: gridSize * gridSize }, () => 0.2 + r() * 0.8);
  }, []);

  const randomPts = useMemo(() => {
    const r = seededRandom(77);
    return Array.from({ length: 15 }, () => ({
      x: Math.floor(r() * gridSize), y: Math.floor(r() * gridSize),
      val: 0.3 + r() * 0.7
    }));
  }, []);

  const bestGrid = gridVals.reduce((best, v, i) => v < best.v ? { v, i } : best, { v: Infinity, i: 0 });
  const bestRandom = randomPts.reduce((best, p) => p.val < best.val ? p : best, { val: Infinity, x: 0, y: 0 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Hyperparameter Tuning" color={C} formula="θ* = argmin_{θ} L_val(θ)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Hyperparameters (learning rate, hidden size, regularization) control the learning process itself.
          Grid search systematically tries all combinations; random search samples randomly and often finds good solutions faster.
        </div>
      </Card>

      <AnalogyBox text="Tuning a guitar — each string (hyperparameter) needs the right tension. Grid search tries every combination systematically like checking every fret. Random search is surprisingly effective — like randomly plucking and tuning by ear." />

      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        {["grid", "random"].map(s => (
          <button key={s} onClick={() => setSearchType(s)}
            style={{
              padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: searchType === s ? C : T.surface, color: searchType === s ? "#fff" : T.muted,
              border: `1px solid ${searchType === s ? C : T.border}`, fontWeight: 700, textTransform: "uppercase"
            }}>{s} Search</button>
        ))}
      </div>

      <Card title={`${searchType === "grid" ? "Grid" : "Random"} Search Heatmap`} color={C}>
        <svg viewBox="0 0 420 270" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="210" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            Validation Error: Learning Rate × Hidden Size
          </text>
          <text x="210" y="260" textAnchor="middle" fontSize="8" fill={T.muted}>Learning Rate →</text>
          <text x="18" y="140" textAnchor="middle" fontSize="8" fill={T.muted} transform="rotate(-90,18,140)">Hidden Size →</text>

          {/* Heatmap */}
          {Array.from({ length: gridSize }, (_, r) =>
            Array.from({ length: gridSize }, (_, c) => {
              const idx = r * gridSize + c;
              const val = gridVals[idx];
              const cellX = 40 + c * 42;
              const cellY = 30 + r * 30;
              const show = searchType === "grid" ? idx <= gridProgress : false;
              const hue = (1 - val) * 120;
              const isBest = idx === bestGrid.i;
              return (
                <g key={idx}>
                  <rect x={cellX} y={cellY} width="38" height="26" rx="3"
                    fill={show || searchType === "random" ? `hsl(${hue}, 70%, ${60 + val * 20}%)` : T.surface}
                    stroke={isBest && searchType === "grid" ? "#000" : T.border}
                    strokeWidth={isBest && searchType === "grid" ? 2 : 0.5}
                    opacity={animT} />
                  {(show || searchType === "random") && (
                    <text x={cellX + 19} y={cellY + 16} textAnchor="middle" fontSize="7" fill={val < 0.5 ? "#fff" : T.ink}>
                      {val.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Random search dots overlay */}
          {searchType === "random" && randomPts.map((p, i) => (
            <g key={"rp" + i}>
              <circle cx={40 + p.x * 42 + 19} cy={30 + p.y * 30 + 13} r="8"
                fill="none" stroke="#dc2626" strokeWidth="2" opacity={animT} />
              {p.val === bestRandom.val && (
                <circle cx={40 + p.x * 42 + 19} cy={30 + p.y * 30 + 13} r="5" fill="#dc2626" />
              )}
            </g>
          ))}

          {/* LR labels */}
          {["0.001", "0.003", "0.01", "0.03", "0.1", "0.3", "1.0"].map((l, i) => (
            <text key={i} x={40 + i * 42 + 19} y={30 + gridSize * 30 + 12} textAnchor="middle" fontSize="6" fill={T.dim}>{l}</text>
          ))}
          {["16", "32", "64", "128", "256", "512", "1024"].map((l, i) => (
            <text key={i} x="37" y={30 + i * 30 + 16} textAnchor="end" fontSize="6" fill={T.dim}>{l}</text>
          ))}

          {/* Legend */}
          <text x="370" y="50" fontSize="8" fill={T.muted}>Error</text>
          <rect x="360" y="55" width="12" height="10" fill="hsl(120,70%,60%)" rx="2" />
          <text x="375" y="63" fontSize="7" fill={T.dim}>Low</text>
          <rect x="360" y="70" width="12" height="10" fill="hsl(60,70%,70%)" rx="2" />
          <text x="375" y="78" fontSize="7" fill={T.dim}>Med</text>
          <rect x="360" y="85" width="12" height="10" fill="hsl(0,70%,70%)" rx="2" />
          <text x="375" y="93" fontSize="7" fill={T.dim}>High</text>
        </svg>
      </Card>

      <SliderRow label="Grid Progress" value={gridProgress} min={0} max={48} step={1}
        onChange={setGridProgress} color={C} format={v => v.toFixed(0)} />
      <SliderRow label="Best Learning Rate" value={bestLR} min={0.0001} max={1.0} step={0.0001}
        onChange={setBestLR} color={M.accent} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="SEARCH TYPE" value={searchType.toUpperCase()} color={C} />
        <ResultBox label="BEST ERROR" value={searchType === "grid" ? bestGrid.v.toFixed(3) : bestRandom.val.toFixed(3)} color={M.mat} />
        <ResultBox label="EVALUATIONS" value={searchType === "grid" ? Math.min(gridProgress + 1, 49) : 15} color={M.accent} />
      </div>

      <CalcRow eq="Grid search total evaluations" result={`${gridSize}² = ${gridSize * gridSize}`} color={C} />
      <CalcRow eq="Random search evaluations" result="15 (70% fewer)" color={M.accent} />
      <CalcRow eq={`Best error (${searchType})`} result={(searchType === "grid" ? bestGrid.v : bestRandom.val).toFixed(4)} color={M.mat} />
      <CalcRow eq="Efficiency gain (random vs grid)" result={((1 - 15 / 49) * 100).toFixed(0) + "% fewer trials"} color={M.mat} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 19 — Interpretability
   ════════════════════════════════════════════════════════════════ */
function InterpretabilitySection() {
  const C = M.prac;
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [animT, setAnimT] = useState(0);
  const [featureIdx, setFeatureIdx] = useState(0);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 20)); if (f >= 20) clearInterval(id); }, 40);
    return () => clearInterval(id);
  }, [selectedMaterial]);

  const materials = [
    {
      name: "GaAs", prediction: 1.42, base: 2.5,
      shap: [
        { feature: "EN_mean", value: 2.00, contrib: -0.35 },
        { feature: "Z_diff", value: 2, contrib: -0.22 },
        { feature: "Radius_mean", value: 1.21, contrib: -0.15 },
        { feature: "Mass_mean", value: 72.3, contrib: -0.18 },
        { feature: "Coord_num", value: 4, contrib: -0.08 },
        { feature: "Volume", value: 45.2, contrib: -0.10 },
      ]
    },
    {
      name: "ZnO", prediction: 3.30, base: 2.5,
      shap: [
        { feature: "EN_mean", value: 2.48, contrib: 0.42 },
        { feature: "Z_diff", value: 22, contrib: 0.25 },
        { feature: "Radius_mean", value: 0.98, contrib: 0.18 },
        { feature: "Mass_mean", value: 40.7, contrib: -0.12 },
        { feature: "Coord_num", value: 4, contrib: 0.02 },
        { feature: "Volume", value: 24.0, contrib: 0.05 },
      ]
    },
    {
      name: "BN", prediction: 6.40, base: 2.5,
      shap: [
        { feature: "EN_mean", value: 2.55, contrib: 1.80 },
        { feature: "Z_diff", value: 2, contrib: 0.50 },
        { feature: "Radius_mean", value: 0.82, contrib: 0.90 },
        { feature: "Mass_mean", value: 12.4, contrib: -0.30 },
        { feature: "Coord_num", value: 3, contrib: 0.60 },
        { feature: "Volume", value: 11.8, contrib: 0.40 },
      ]
    },
  ];

  const mat = materials[selectedMaterial];
  const sortedShap = [...mat.shap].sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));

  const featureImportance = [
    { name: "EN_mean", imp: 0.35 }, { name: "Z_diff", imp: 0.22 },
    { name: "Radius", imp: 0.18 }, { name: "Mass", imp: 0.12 },
    { name: "Volume", imp: 0.08 }, { name: "Coord", imp: 0.05 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Model Interpretability (SHAP)" color={C} formula="f(x) = φ₀ + Σ φᵢ (SHAP values)">
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          SHAP (SHapley Additive exPlanations) decomposes each prediction into feature contributions.
          Positive SHAP values push the prediction higher, negative values push it lower.
          This makes black-box models transparent for materials scientists.
        </div>
      </Card>

      <AnalogyBox text="A doctor explaining a diagnosis: 'Your blood pressure is high (+0.3), cholesterol is normal (0), but family history is concerning (+0.5) — that's why I recommend treatment.' SHAP gives this exact kind of explanation for ML predictions." />

      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        {materials.map((m, i) => (
          <button key={i} onClick={() => setSelectedMaterial(i)}
            style={{
              padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer",
              background: selectedMaterial === i ? C : T.surface, color: selectedMaterial === i ? "#fff" : T.muted,
              border: `1px solid ${selectedMaterial === i ? C : T.border}`, fontWeight: 700
            }}>{m.name}</button>
        ))}
      </div>

      <Card title={`SHAP Waterfall: ${mat.name} → ${mat.prediction} eV`} color={C}>
        <svg viewBox="0 0 430 280" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="215" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            SHAP Waterfall Chart — {mat.name} Bandgap Prediction
          </text>
          {/* Base value */}
          <text x="60" y="48" fontSize="8" fill={T.muted}>Base = {mat.base.toFixed(1)} eV</text>
          <line x1="100" y1="42" x2={200 + mat.base * 20} y2="42" stroke={T.dim} strokeWidth="1.5" />

          {/* SHAP bars (waterfall) */}
          {sortedShap.map((s, i) => {
            let cumSum = mat.base;
            for (let j = 0; j < i; j++) cumSum += sortedShap[j].contrib;
            const startX = 200 + cumSum * 20;
            const endX = 200 + (cumSum + s.contrib) * 20;
            const barY = 55 + i * 28;
            const isPos = s.contrib > 0;
            return (
              <g key={i}>
                <text x="8" y={barY + 12} fontSize="8" fill={T.muted}>{s.feature}</text>
                <text x="80" y={barY + 12} fontSize="7" fill={T.ink}>={s.value}</text>
                <rect x={Math.min(startX, endX)} y={barY}
                  width={Math.abs(endX - startX) * animT} height="18" rx="3"
                  fill={isPos ? "#dc262644" : "#2563eb44"}
                  stroke={isPos ? "#dc2626" : "#2563eb"} strokeWidth="1" />
                <text x={endX + (isPos ? 4 : -4)} y={barY + 12}
                  textAnchor={isPos ? "start" : "end"} fontSize="8" fontWeight="700"
                  fill={isPos ? "#dc2626" : "#2563eb"}>
                  {isPos ? "+" : ""}{s.contrib.toFixed(2)}
                </text>
                {/* Connector line */}
                {i < sortedShap.length - 1 && (
                  <line x1={endX} y1={barY + 18} x2={endX} y2={barY + 28}
                    stroke={T.dim} strokeWidth="0.5" strokeDasharray="2,2" />
                )}
              </g>
            );
          })}

          {/* Final prediction */}
          {(() => {
            const finalY = 55 + sortedShap.length * 28;
            return (
              <g>
                <text x="8" y={finalY + 8} fontSize="9" fontWeight="700" fill={C}>Prediction</text>
                <text x="200" y={finalY + 8} fontSize="11" fontWeight="800" fill={C}>{mat.prediction.toFixed(2)} eV</text>
              </g>
            );
          })()}

          {/* Feature importance bar chart (right side) */}
          <text x="360" y="48" textAnchor="middle" fontSize="8" fontWeight="600" fill={T.muted}>Importance</text>
          {featureImportance.map((f, i) => (
            <g key={"imp" + i}>
              <rect x={330} y={55 + i * 20} width={f.imp * 160 * animT} height="14" rx="2" fill={C} opacity="0.6" />
              <text x={328} y={65 + i * 20} textAnchor="end" fontSize="6" fill={T.muted}>{f.name}</text>
            </g>
          ))}
        </svg>
      </Card>

      <SliderRow label="Material Index" value={selectedMaterial} min={0} max={2} step={1}
        onChange={setSelectedMaterial} color={C} format={v => materials[v]?.name || ""} />
      <SliderRow label="Feature Focus" value={featureIdx} min={0} max={5} step={1}
        onChange={setFeatureIdx} color={M.accent} format={v => mat.shap[v]?.feature || ""} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <ResultBox label="PREDICTION" value={mat.prediction.toFixed(2) + " eV"} color={C} />
        <ResultBox label="BASE VALUE" value={mat.base.toFixed(2) + " eV"} color={M.accent} />
        <ResultBox label="TOP FEATURE" value={sortedShap[0].feature} color={sortedShap[0].contrib > 0 ? "#dc2626" : "#2563eb"} sub={`Δ = ${sortedShap[0].contrib.toFixed(2)}`} />
      </div>

      {sortedShap.map((s, i) => (
        <CalcRow key={i} eq={`${s.feature} = ${s.value} → SHAP`} result={(s.contrib > 0 ? "+" : "") + s.contrib.toFixed(3)} color={s.contrib > 0 ? "#dc2626" : "#2563eb"} />
      ))}
      <CalcRow eq={`Base + Σ SHAP`} result={`${mat.base.toFixed(1)} + ${(mat.prediction - mat.base).toFixed(2)} = ${mat.prediction.toFixed(2)} eV`} color={C} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION 20 — ML Summary & Method Selector
   ════════════════════════════════════════════════════════════════ */
function MLSummarySection() {
  const C = M.prac;
  const [flowStep, setFlowStep] = useState(0);
  const [highlightMethod, setHighlightMethod] = useState(-1);
  const [animT, setAnimT] = useState(0);
  const [compareA, setCompareA] = useState(0);
  const [compareB, setCompareB] = useState(3);

  useEffect(() => {
    let f = 0;
    const id = setInterval(() => { f++; setAnimT(Math.min(1, f / 15)); if (f >= 15) clearInterval(id); }, 50);
    return () => clearInterval(id);
  }, [flowStep]);

  const methods = [
    { name: "Linear Reg.", type: "Supervised", interp: "High", data: "Small", speed: "Fast", best: "Linear trends", color: M.found },
    { name: "Decision Tree", type: "Supervised", interp: "High", data: "Small", speed: "Fast", best: "Classification", color: M.algo },
    { name: "Random Forest", type: "Supervised", interp: "Medium", data: "Medium", speed: "Medium", best: "Tabular data", color: M.algo },
    { name: "SVM", type: "Supervised", interp: "Low", data: "Small", speed: "Medium", best: "Small datasets", color: M.algo },
    { name: "KNN", type: "Supervised", interp: "High", data: "Medium", speed: "Slow", best: "Simple baseline", color: M.found },
    { name: "PCA", type: "Unsupervised", interp: "High", data: "Any", speed: "Fast", best: "Dimensionality", color: M.algo },
    { name: "Neural Net", type: "Supervised", interp: "Low", data: "Large", speed: "Slow", best: "Complex patterns", color: M.nn },
    { name: "CNN", type: "Supervised", interp: "Low", data: "Large", speed: "Slow", best: "Images/structures", color: M.nn },
    { name: "Transformer", type: "Supervised", interp: "Low", data: "Very Large", speed: "Slow", best: "Sequences/graphs", color: M.nn },
    { name: "GP / Active", type: "Bayesian", interp: "High", data: "Very Small", speed: "Medium", best: "Optimization", color: M.mat },
  ];

  const flowQuestions = [
    { q: "How much data do you have?", opts: ["< 100 samples", "100-10,000", "> 10,000"], next: [1, 2, 3] },
    { q: "Small data — need interpretability?", opts: ["Yes → Linear Reg/Tree", "No → GP/Active Learning"], next: [-1, -1] },
    { q: "Medium data — what task?", opts: ["Regression → RF/SVM", "Classification → RF/SVM", "Dim. Reduction → PCA"], next: [-1, -1, -1] },
    { q: "Large data — what input type?", opts: ["Tabular → Neural Net", "Images → CNN", "Sequences → Transformer"], next: [-1, -1, -1] },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="ML Methods Summary & Selection Guide" color={C}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: T.ink }}>
          Choosing the right ML method depends on your data size, task type, and interpretability needs.
          Use the interactive flowchart below or compare methods side-by-side.
        </div>
      </Card>

      <AnalogyBox text="A toolbox — you don't use a hammer for every job. Linear regression is the screwdriver (simple, reliable, always works for simple tasks). Neural networks are the power drill (powerful but overkill for basic screws). GP/Active learning is the precision caliper (perfect for expensive measurements)." />

      {/* Comparison table */}
      <Card title="Method Comparison Table" color={C}>
        <svg viewBox="0 0 430 320" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          {/* Header */}
          {["Method", "Type", "Interp.", "Data", "Speed", "Best For"].map((h, i) => {
            const x = [5, 90, 160, 210, 260, 320][i];
            return <text key={i} x={x} y="18" fontSize="8" fontWeight="700" fill={C}>{h}</text>;
          })}
          <line x1="5" y1="22" x2="425" y2="22" stroke={T.border} />

          {/* Rows */}
          {methods.map((m, i) => {
            const y = 34 + i * 28;
            const isHighlight = highlightMethod === i;
            return (
              <g key={i} onClick={() => setHighlightMethod(i === highlightMethod ? -1 : i)} style={{ cursor: "pointer" }}>
                {isHighlight && <rect x="2" y={y - 10} width="426" height="26" rx="4" fill={m.color + "11"} />}
                <circle cx="12" cy={y} r="4" fill={m.color} opacity={animT} />
                <text x="20" y={y + 3} fontSize="7" fontWeight="600" fill={T.ink}>{m.name}</text>
                <text x="90" y={y + 3} fontSize="7" fill={T.muted}>{m.type}</text>
                <text x="160" y={y + 3} fontSize="7" fill={m.interp === "High" ? M.mat : m.interp === "Low" ? "#dc2626" : M.accent}>{m.interp}</text>
                <text x="210" y={y + 3} fontSize="7" fill={T.muted}>{m.data}</text>
                <text x="260" y={y + 3} fontSize="7" fill={m.speed === "Fast" ? M.mat : m.speed === "Slow" ? "#dc2626" : M.accent}>{m.speed}</text>
                <text x="320" y={y + 3} fontSize="7" fill={T.ink}>{m.best}</text>
              </g>
            );
          })}

          {/* Flowchart title */}
          <text x="215" y="310" textAnchor="middle" fontSize="9" fontWeight="700" fill={C}>
            Click a method row for details | {highlightMethod >= 0 ? `Selected: ${methods[highlightMethod].name}` : "None selected"}
          </text>
        </svg>
      </Card>

      {/* Flowchart */}
      <Card title="Which Method Should I Use?" color={C}>
        <svg viewBox="0 0 430 200" style={{ width: "100%", background: T.surface, borderRadius: 8 }}>
          <text x="215" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill={C}>
            Decision Flowchart — Step {flowStep + 1}
          </text>
          {/* Current question */}
          <rect x="100" y="30" width="230" height="35" rx="8" fill={C + "22"} stroke={C} strokeWidth="1.5" />
          <text x="215" y="52" textAnchor="middle" fontSize="9" fontWeight="600" fill={C}>{flowQuestions[flowStep].q}</text>
          {/* Options */}
          {flowQuestions[flowStep].opts.map((opt, i) => {
            const y = 80 + i * 38;
            return (
              <g key={i} onClick={() => {
                const next = flowQuestions[flowStep].next[i];
                if (next >= 0) setFlowStep(next);
              }} style={{ cursor: "pointer" }}>
                <rect x="60" y={y} width="310" height="28" rx="6"
                  fill={T.panel} stroke={T.border} strokeWidth="1" />
                <text x="215" y={y + 17} textAnchor="middle" fontSize="9" fill={T.ink}>{opt}</text>
                <line x1="215" y1="65" x2="215" y2={y} stroke={T.dim} strokeWidth="0.5" />
              </g>
            );
          })}
        </svg>
        <button onClick={() => setFlowStep(0)}
          style={{ padding: "4px 12px", fontSize: 10, borderRadius: 5, cursor: "pointer", background: T.surface, color: T.muted, border: `1px solid ${T.border}`, marginTop: 4 }}>
          Restart Flowchart
        </button>
      </Card>

      <SliderRow label="Compare Method A" value={compareA} min={0} max={9} step={1}
        onChange={setCompareA} color={C} format={v => methods[v]?.name || ""} />
      <SliderRow label="Compare Method B" value={compareB} min={0} max={9} step={1}
        onChange={setCompareB} color={M.accent} format={v => methods[v]?.name || ""} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <ResultBox label={methods[compareA].name} value={methods[compareA].best} color={methods[compareA].color} sub={`${methods[compareA].data} data, ${methods[compareA].speed}`} />
        <ResultBox label={methods[compareB].name} value={methods[compareB].best} color={methods[compareB].color} sub={`${methods[compareB].data} data, ${methods[compareB].speed}`} />
      </div>

      <CalcRow eq="Total methods covered" result="10" color={C} />
      <CalcRow eq="Supervised methods" result={methods.filter(m => m.type === "Supervised").length} color={M.algo} />
      <CalcRow eq="Unsupervised methods" result={methods.filter(m => m.type === "Unsupervised").length} color={M.mat} />
      <CalcRow eq="High interpretability" result={methods.filter(m => m.interp === "High").length} color={M.mat} />
      <CalcRow eq="Best for small data" result="GP/Active Learning, Linear Reg." color={C} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION DEFINITIONS
   ════════════════════════════════════════════════════════════════ */
const ML_SECTIONS = [
  // Block 1: Foundations
  { id: "whatisml", block: "foundations", title: "What Is ML?", component: WhatIsMLSection,
    nextReason: "Now that you know the three types, let's see linear regression — the simplest supervised model." },
  { id: "linreg", block: "foundations", title: "Linear Regression", component: LinearRegressionSection,
    nextReason: "Simple models work well, but what happens when we make them too complex? Let's explore overfitting." },
  { id: "overfitting", block: "foundations", title: "Overfitting", component: OverfittingSection,
    nextReason: "To detect overfitting reliably, we need cross-validation — a robust evaluation strategy." },
  { id: "crossval", block: "foundations", title: "Cross-Validation", component: CrossValidationSection,
    nextReason: "With evaluation tools in hand, let's learn powerful algorithms — starting with decision trees." },

  // Block 2: Algorithms
  { id: "dtree", block: "algorithms", title: "Decision Trees", component: DecisionTreeSection,
    nextReason: "Single trees overfit easily. Random forests fix this by combining many trees — let's see how." },
  { id: "rforest", block: "algorithms", title: "Random Forest", component: RandomForestSection,
    nextReason: "Another powerful classifier is SVM, which finds the widest possible separation margin." },
  { id: "svm", block: "algorithms", title: "SVM", component: SVMSection,
    nextReason: "With many features, we need dimensionality reduction. PCA finds the most important directions." },
  { id: "pca", block: "algorithms", title: "PCA", component: PCASection,
    nextReason: "Now let's go deeper — neural networks can learn any function. Starting with a single neuron." },

  // Block 3: Neural Networks
  { id: "perceptron", block: "neuralnet", title: "Perceptron", component: PerceptronSection,
    nextReason: "One neuron is limited. Stacking layers into deep networks unlocks immense power." },
  { id: "dnn", block: "neuralnet", title: "Deep Networks", component: DNNSection,
    nextReason: "But how do deep networks learn? Through backpropagation — the engine of modern ML." },
  { id: "backprop", block: "neuralnet", title: "Backpropagation", component: BackpropSection,
    nextReason: "Beyond feedforward nets, CNNs and Transformers handle images and sequences." },
  { id: "cnntransformer", block: "neuralnet", title: "CNN & Transformer", component: CNNTransformerSection,
    nextReason: "Now let's apply all this to materials science — starting with how we represent materials as features." },

  // Block 4: ML for Materials
  { id: "features", block: "matsci", title: "Feature Engineering", component: FeatureEngineeringSection,
    nextReason: "With features defined, let's train a model to predict bandgaps from composition." },
  { id: "prediction", block: "matsci", title: "Property Prediction", component: PropertyPredictionSection,
    nextReason: "Beyond prediction, generative models can design entirely new materials." },
  { id: "generative", block: "matsci", title: "Generative Models", component: GenerativeModelsSection,
    nextReason: "Active learning optimizes expensive experiments — let's see Bayesian optimization in action." },
  { id: "activelearn", block: "matsci", title: "Active Learning", component: ActiveLearningSection,
    nextReason: "Let's tie it all together with practical workflow guidance." },

  // Block 5: Practical
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
