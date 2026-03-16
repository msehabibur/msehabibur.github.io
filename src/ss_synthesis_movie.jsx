import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SOLID-STATE SYNTHESIS TEXT-MINING MOVIE
// Based on: Lee et al., Sci. Data 12:1969 (2025)
// "Text-mined dataset of solid-state syntheses with impurity phases using LLM"
// ═══════════════════════════════════════════════════════════════════════════

const P = {
  bg:      "#0c0f1a",
  panel:   "#141825",
  surface: "#1a1f30",
  border:  "#2a3050",
  ink:     "#e8ecf4",
  muted:   "#7b8499",
  dim:     "#3a4060",
  lit:     "#38bdf8",   // literature / pipeline
  bert:    "#818cf8",   // MatBERT
  gpt:     "#34d399",   // GPT-4o
  data:    "#f59e0b",   // dataset
  pure:    "#3b82f6",   // phase-pure
  impure:  "#ef4444",   // phase-impure
  ok:      "#4ade80",
  warn:    "#f87171",
  thermo:  "#a78bfa",   // thermodynamics
  target:  "#2dd4bf",
};

const SCENES = [
  { id: "title",       label: "Title",                   duration: 4000 },
  { id: "problem",     label: "The Problem",             duration: 7000 },
  { id: "pipeline",    label: "Extraction Pipeline",     duration: 8000 },
  { id: "matbert",     label: "MatBERT Classification",  duration: 7000 },
  { id: "gpt4o",       label: "GPT-4o Extraction",       duration: 7500 },
  { id: "dataset",     label: "Dataset Overview",        duration: 7000 },
  { id: "top_rxns",    label: "Top Reactions",           duration: 8000 },
  { id: "thermo",      label: "Thermodynamic Validation",duration: 8000 },
  { id: "validation",  label: "Technical Validation",    duration: 7000 },
  { id: "impact",      label: "Impact & Applications",   duration: 6000 },
];

const ease    = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp    = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01 = t => Math.max(0, Math.min(1, t));

export default function SSSynthesisMovieModule() {
  const [sceneIdx, setSceneIdx]     = useState(0);
  const [progress, setProgress]     = useState(0);
  const [playing, setPlaying]       = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const scene    = SCENES[sceneIdx];

  const tick = useCallback((ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const dur = SCENES[sceneIdx].duration;
    const p = Math.min(elapsed / dur, 1);
    setProgress(p);
    if (p >= 1) {
      if (sceneIdx < SCENES.length - 1) { setSceneIdx(i => i + 1); startRef.current = null; }
      else { setPlaying(false); return; }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [sceneIdx]);

  useEffect(() => {
    if (playing) { startRef.current = null; rafRef.current = requestAnimationFrame(tick); }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, sceneIdx, tick]);

  useEffect(() => {
    if (manualMode && !playing) {
      startRef.current = null; setProgress(0);
      const dur = SCENES[sceneIdx].duration; let id;
      const run = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const p = Math.min((ts - startRef.current) / dur, 1);
        setProgress(p); if (p < 1) id = requestAnimationFrame(run);
      };
      id = requestAnimationFrame(run);
      return () => cancelAnimationFrame(id);
    }
  }, [sceneIdx, manualMode, playing]);

  const goScene    = (i) => { setPlaying(false); setManualMode(true); setSceneIdx(i); setProgress(0); startRef.current = null; };
  const playAll    = () => { setManualMode(false); setSceneIdx(0); setProgress(0); startRef.current = null; setPlaying(true); };
  const togglePause = () => {
    if (playing) { setPlaying(false); setManualMode(true); }
    else { setManualMode(false); startRef.current = null; setPlaying(true); }
  };
  const nextScene = () => { if (sceneIdx < SCENES.length - 1) goScene(sceneIdx + 1); };
  const prevScene = () => { if (sceneIdx > 0) goScene(sceneIdx - 1); };

  const t = progress;

  const [visibleScene, setVisibleScene] = useState(sceneIdx);
  const [fadeClass, setFadeClass]       = useState(1);
  useEffect(() => {
    if (sceneIdx !== visibleScene) {
      setFadeClass(0);
      const timer = setTimeout(() => { setVisibleScene(sceneIdx); setFadeClass(1); }, 250);
      return () => clearTimeout(timer);
    }
  }, [sceneIdx, visibleScene]);

  // ═══════════════════════════════════════════════════════════════════════
  // SCENE RENDERERS
  // ═══════════════════════════════════════════════════════════════════════
  const renderScene = () => {
    const W = 560, H = 420;
    const LX = 10, LW = 248, RX = 268, RW = 280;

    switch (scene.id) {

    // ── TITLE ──────────────────────────────────────────────────────────
    case "title": {
      const tOp = ease(clamp01(t * 3));
      const sOp = ease(clamp01((t - 0.3) * 3));
      const lW  = ease(clamp01((t - 0.2) * 2.5)) * 280;
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke={P.dim} strokeWidth="0.3" opacity={0.2} />
          ))}
          <text x={W/2} y={130} textAnchor="middle" fill={P.ink} fontSize="16" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Text-Mined Solid-State Synthesis</text>
          <text x={W/2} y={155} textAnchor="middle" fill={P.data} fontSize="14" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Dataset with Impurity Phases</text>
          <rect x={(W-lW)/2} y={166} width={lW} height={3} rx="1.5" fill={P.lit} opacity={tOp * 0.8} />
          <text x={W/2} y={195} textAnchor="middle" fill={P.gpt} fontSize="11" fontWeight="700"
            fontFamily="'Fira Code',monospace" opacity={sOp}>80,806 reactions extracted via LLM</text>
          <text x={W/2} y={215} textAnchor="middle" fill={P.muted} fontSize="10"
            fontFamily="'Inter',sans-serif" opacity={sOp}>MatBERT classification + GPT-4o extraction</text>

          {/* Paper citation */}
          <text x={W/2} y={260} textAnchor="middle" fill={P.muted} fontSize="8.5"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.5)*3))}>
            Lee, Cruse, Baibakova, Ceder &amp; Jain — Scientific Data 12:1969 (2025)
          </text>

          {/* Stats boxes */}
          {[
            { label: "8.8M", sub: "papers", color: P.lit, x: 120 },
            { label: "80,806", sub: "reactions", color: P.data, x: 230 },
            { label: "18,869", sub: "with impurities", color: P.impure, x: 370 },
          ].map((s, i) => {
            const op = ease(clamp01((t - 0.55 - i*0.1) * 4));
            return (
              <g key={i} opacity={op}>
                <rect x={s.x-48} y={290} width={96} height={52} rx="8" fill={s.color+"15"} stroke={s.color+"50"} strokeWidth="1.5"/>
                <text x={s.x} y={314} textAnchor="middle" fill={s.color} fontSize="16" fontWeight="900"
                  fontFamily="'Inter',sans-serif">{s.label}</text>
                <text x={s.x} y={330} textAnchor="middle" fill={P.muted} fontSize="8"
                  fontFamily="'Inter',sans-serif">{s.sub}</text>
              </g>
            );
          })}

          <text x={W/2} y={378} textAnchor="middle" fill={P.muted} fontSize="9"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.4)*3))}>
            Habibur Rahman · Purdue University
          </text>
        </svg>
      );
    }

    // ── THE PROBLEM ────────────────────────────────────────────────────
    case "problem": {
      const tOp = ease(clamp01(t * 4));

      // Compact blocks instead of free-flowing text
      const blocks = [
        { title: "Solid-State Synthesis", lines: ["Most common route for inorganic", "materials: batteries, ceramics..."], color: P.ink, delay: 0.04 },
        { title: "Challenge", lines: ["No general theory!", "Impurity phases often ignored"], color: P.warn, delay: 0.16 },
        { title: "Prior Work", lines: ["Kononova et al.: 19,488 rxns", "But NO impurity phase data"], color: P.lit, delay: 0.28 },
        { title: "This Work", lines: ["80,806 reactions extracted", "18,869 with impurity phases!"], color: P.data, delay: 0.40 },
        { title: "Why Impurities Matter", lines: ["→ reveal reaction mechanisms", "→ guide synthesis optimization"], color: P.ok, delay: 0.52 },
      ];

      const bH = 62;
      const bGap = 8;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="14" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>The Problem: Missing Impurity Data</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT — problem blocks (consistent size) */}
          {blocks.map((b, i) => {
            const op = ease(clamp01((t - b.delay) * 4));
            const y = 38 + i * (bH + bGap);
            return (
              <g key={i} opacity={op}>
                <rect x={LX+4} y={y} width={LW-8} height={bH} rx="6" fill={b.color+"10"} stroke={b.color+"30"} strokeWidth="1"/>
                <text x={LX+14} y={y+16} fill={b.color} fontSize="9" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{b.title}</text>
                {b.lines.map((ln, li) => (
                  <text key={li} x={LX+14} y={y+30+li*14} fill={P.muted} fontSize="8"
                    fontFamily="'Fira Code','Consolas',monospace">{ln}</text>
                ))}
              </g>
            );
          })}

          {/* RIGHT — example: BiFeO3 — consistent block heights */}
          {/* Reaction equation */}
          <g opacity={ease(clamp01((t-0.08)*4))}>
            <rect x={RX+8} y={38} width={RW-16} height={50} rx="6" fill={P.lit+"12"} stroke={P.lit+"30"} strokeWidth="1"/>
            <text x={RX+RW/2} y={54} textAnchor="middle" fill={P.data} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Example: BiFeO₃ Synthesis</text>
            <text x={RX+RW/2} y={76} textAnchor="middle" fill={P.lit} fontSize="9" fontWeight="700"
              fontFamily="'Fira Code',monospace">0.5 Bi₂O₃ + 0.5 Fe₂O₃ → BiFeO₃</text>
          </g>

          {/* Target */}
          <g opacity={ease(clamp01((t-0.2)*4))}>
            <rect x={RX+8} y={96} width={RW-16} height={50} rx="6" fill={P.ok+"12"} stroke={P.ok+"30"} strokeWidth="1"/>
            <text x={RX+18} y={112} fill={P.ok} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Target (desired)</text>
            <text x={RX+RW/2} y={134} textAnchor="middle" fill={P.ink} fontSize="12" fontWeight="800"
              fontFamily="'Fira Code',monospace">BiFeO₃</text>
          </g>

          {/* Impurity phases */}
          <g opacity={ease(clamp01((t-0.32)*4))}>
            <rect x={RX+8} y={154} width={RW-16} height={62} rx="6" fill={P.impure+"12"} stroke={P.impure+"30"} strokeWidth="1"/>
            <text x={RX+18} y={170} fill={P.impure} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Impurity phases (unwanted)</text>
            <text x={RX+RW/2} y={190} textAnchor="middle" fill={P.warn} fontSize="10" fontWeight="700"
              fontFamily="'Fira Code',monospace">Bi₂Fe₄O₉</text>
            <text x={RX+RW/2} y={206} textAnchor="middle" fill={P.warn} fontSize="10" fontWeight="700"
              fontFamily="'Fira Code',monospace">Bi₂₅FeO₄₀</text>
          </g>

          {/* Why it matters */}
          <g opacity={ease(clamp01((t-0.44)*4))}>
            <rect x={RX+8} y={224} width={RW-16} height={80} rx="6" fill={P.thermo+"10"} stroke={P.thermo+"30"} strokeWidth="1"/>
            <text x={RX+RW/2} y={240} textAnchor="middle" fill={P.thermo} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Why BiFeO₃ is challenging</text>
            <text x={RX+18} y={256} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">• Narrow thermodynamic stability</text>
            <text x={RX+18} y={270} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">• Bi volatility at high temperature</text>
            <text x={RX+18} y={284} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">• 107/221 reactions report impurities</text>
            <text x={RX+18} y={298} fill={P.data} fontSize="8" fontWeight="600" fontFamily="'Inter',sans-serif">• Most studied impure reaction</text>
          </g>

          {/* Data stat */}
          <g opacity={ease(clamp01((t-0.56)*4))}>
            <rect x={RX+8} y={312} width={RW-16} height={62} rx="6" fill={P.data+"12"} stroke={P.data+"30"} strokeWidth="1.5"/>
            <text x={RX+RW/2} y={334} textAnchor="middle" fill={P.data} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Dataset captures both outcomes:</text>
            <text x={RX+RW/2} y={356} textAnchor="middle" fill={P.ink} fontSize="9"
              fontFamily="'Fira Code',monospace">phase-pure ✓  &amp;  phase-impure ✗</text>
          </g>
        </svg>
      );
    }

    // ── PIPELINE OVERVIEW ──────────────────────────────────────────────
    case "pipeline": {
      const tOp = ease(clamp01(t * 4));

      // Consistent block sizes: all same width/height, evenly spaced, centered
      const bW = 200, bH = 44, cx = W/2;
      const steps = [
        { label: "Literature DB",      sub: "~8.8M papers",             color: P.lit    },
        { label: "Recipe Classifier",  sub: "MatBERT",                  color: P.bert   },
        { label: "SS Synthesis",       sub: "116K paper portions",      color: P.lit    },
        { label: "Rxn Extractor",      sub: "GPT-4o (few-shot)",        color: P.gpt    },
        { label: "Post-Processing",    sub: "MaterialParser + balance", color: P.target },
      ];
      const startY = 38;
      const gap = 10;
      const stepH = bH + gap + 12; // block + gap + arrow space

      // Output boxes — side by side, centered below pipeline
      const outY = startY + steps.length * stepH + 4;
      const outW = 120, outH = 44, outGap = 20;
      const outLx = cx - outW - outGap/2;
      const outRx = cx + outGap/2;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Extraction Pipeline Overview</text>

          {/* Pipeline steps — consistent blocks */}
          {steps.map((s, i) => {
            const op = ease(clamp01((t - 0.05 - i*0.08) * 4));
            const y = startY + i * stepH;
            return (
              <g key={i} opacity={op}>
                <rect x={cx - bW/2} y={y} width={bW} height={bH} rx="7" fill={s.color+"18"} stroke={s.color+"50"} strokeWidth="1.5"/>
                <text x={cx} y={y+18} textAnchor="middle" fill={s.color} fontSize="10" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{s.label}</text>
                <text x={cx} y={y+33} textAnchor="middle" fill={P.muted} fontSize="8"
                  fontFamily="'Inter',sans-serif">{s.sub}</text>
                {i < steps.length - 1 && (
                  <g>
                    <line x1={cx} y1={y+bH} x2={cx} y2={y+bH+gap+8} stroke={P.dim} strokeWidth="1.5"/>
                    <polygon points={`${cx-4},${y+bH+gap+4} ${cx+4},${y+bH+gap+4} ${cx},${y+bH+gap+10}`} fill={P.dim}/>
                  </g>
                )}
              </g>
            );
          })}

          {/* Split arrow — vertical down then branch left/right */}
          <g opacity={ease(clamp01((t-0.5)*4))}>
            {/* vertical stem */}
            <line x1={cx} y1={startY + (steps.length-1)*stepH + bH} x2={cx} y2={outY - 6} stroke={P.dim} strokeWidth="1.5"/>
            {/* left branch */}
            <line x1={cx} y1={outY - 6} x2={outLx + outW/2} y2={outY - 6} stroke={P.pure} strokeWidth="1.5"/>
            <line x1={outLx + outW/2} y1={outY - 6} x2={outLx + outW/2} y2={outY} stroke={P.pure} strokeWidth="1.5"/>
            {/* right branch */}
            <line x1={cx} y1={outY - 6} x2={outRx + outW/2} y2={outY - 6} stroke={P.impure} strokeWidth="1.5"/>
            <line x1={outRx + outW/2} y1={outY - 6} x2={outRx + outW/2} y2={outY} stroke={P.impure} strokeWidth="1.5"/>
          </g>

          {/* Output boxes — same height */}
          {[
            { label: "Phase-pure",   count: "61,937", color: P.pure,   x: outLx },
            { label: "Phase-impure", count: "18,869", color: P.impure, x: outRx },
          ].map((o, i) => {
            const op = ease(clamp01((t - 0.55 - i*0.06) * 4));
            return (
              <g key={i} opacity={op}>
                <rect x={o.x} y={outY} width={outW} height={outH} rx="7" fill={o.color+"18"} stroke={o.color+"60"} strokeWidth="1.5"/>
                <text x={o.x+outW/2} y={outY+18} textAnchor="middle" fill={o.color} fontSize="12" fontWeight="900"
                  fontFamily="'Inter',sans-serif">{o.count}</text>
                <text x={o.x+outW/2} y={outY+34} textAnchor="middle" fill={P.muted} fontSize="8"
                  fontFamily="'Inter',sans-serif">{o.label}</text>
              </g>
            );
          })}

          {/* Filtering annotations on right side */}
          {[
            { text: "Output blank: 3K",   delay: 0.4 },
            { text: "Error post-proc: 8K", delay: 0.43 },
            { text: "Hallucinations: 2K",  delay: 0.46 },
          ].map((a, i) => {
            const ay = startY + 3*stepH + 10 + i*15;
            return (
              <g key={i} opacity={ease(clamp01((t-a.delay)*5))}>
                <line x1={cx+bW/2+4} y1={ay} x2={cx+bW/2+20} y2={ay} stroke={P.warn+"60"} strokeWidth="1" strokeDasharray="3,2"/>
                <text x={cx+bW/2+24} y={ay+3} fill={P.warn} fontSize="7.5" fontFamily="'Fira Code',monospace">{a.text}</text>
              </g>
            );
          })}

          {/* Publishers on far right */}
          <g opacity={ease(clamp01((t-0.12)*4))}>
            <text x={470} y={50} fill={P.muted} fontSize="7.5" fontWeight="600" fontFamily="'Inter',sans-serif">Publishers (2000–2024)</text>
            {["ACS", "AIP", "APS", "Elsevier", "IoP", "Springer Nature", "RSC", "Wiley"].map((pub, i) => (
              <text key={i} x={470} y={65+i*13} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">• {pub}</text>
            ))}
          </g>
        </svg>
      );
    }

    // ── MATBERT CLASSIFICATION ──────────────────────────────────────────
    case "matbert": {
      const tOp = ease(clamp01(t * 4));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Step 1: Recipe Paragraph Classification</text>
          <line x1={262} y1={32} x2={262} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT — process flow */}
          <rect x={LX} y={32} width={LW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          {/* Funnel stages */}
          {[
            { label: "292M paragraphs", sub: "from 8.8M papers", w: 200, color: P.lit, delay: 0.06 },
            { label: "58.5M paragraphs", sub: "keyword filter (-233.5M)", w: 170, color: P.lit, delay: 0.15 },
            { label: "145K SS paragraphs", sub: "MatBERT classifier", w: 140, color: P.bert, delay: 0.25 },
            { label: "116K papers", sub: "score > 0.8 filter", w: 120, color: P.gpt, delay: 0.35 },
          ].map((s, i) => {
            const op = ease(clamp01((t - s.delay) * 4));
            const cx = LX + LW/2;
            const y = 55 + i * 80;
            return (
              <g key={i} opacity={op}>
                <rect x={cx - s.w/2} y={y} width={s.w} height={38} rx="6"
                  fill={s.color+"18"} stroke={s.color+"50"} strokeWidth="1.5"/>
                <text x={cx} y={y+16} textAnchor="middle" fill={s.color} fontSize="10" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{s.label}</text>
                <text x={cx} y={y+30} textAnchor="middle" fill={P.muted} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">{s.sub}</text>
                {i < 3 && <polygon points={`${cx-5},${y+44} ${cx+5},${y+44} ${cx},${y+50}`} fill={P.dim} opacity={0.6}/>}
              </g>
            );
          })}

          {/* RIGHT — MatBERT details */}
          <rect x={RX} y={32} width={RW} height={380} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          <text x={RX+RW/2} y={52} textAnchor="middle" fill={P.bert} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.1)*4))}>MatBERT Classifier</text>

          {/* Classification categories */}
          <g opacity={ease(clamp01((t-0.3)*4))}>
            <text x={RX+15} y={75} fill={P.muted} fontSize="8" fontWeight="600" fontFamily="'Inter',sans-serif">Classifies into 5 categories:</text>
            {[
              { label: "Solid-state", color: P.ok, w: 110 },
              { label: "Sol-gel", color: P.data, w: 65 },
              { label: "Precipitation", color: P.thermo, w: 85 },
              { label: "Hydrothermal", color: P.lit, w: 80 },
              { label: "Something else", color: P.dim, w: 85 },
            ].map((c, i) => {
              const op2 = ease(clamp01((t - 0.33 - i*0.04) * 5));
              return (
                <g key={i} opacity={op2}>
                  <rect x={RX+15} y={85+i*26} width={c.w} height={20} rx="4"
                    fill={c.color+"18"} stroke={c.color+"50"} strokeWidth="1"/>
                  <text x={RX+20} y={85+i*26+14} fill={c.color} fontSize="8.5" fontWeight="600"
                    fontFamily="'Inter',sans-serif">{c.label}</text>
                </g>
              );
            })}
          </g>

          {/* Keyword filter */}
          <g opacity={ease(clamp01((t-0.5)*4))}>
            <rect x={RX+15} y={225} width={RW-30} height={55} rx="5" fill={P.target+"10"} stroke={P.target+"30"} strokeWidth="1"/>
            <text x={RX+RW/2} y={242} textAnchor="middle" fill={P.target} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Keyword Pre-Filter</text>
            <text x={RX+25} y={258} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              "preparation", "method", "material"</text>
            <text x={RX+25} y={270} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              "experiment", "synthesis", "prepared"</text>
          </g>

          {/* Performance */}
          <g opacity={ease(clamp01((t-0.65)*4))}>
            <rect x={RX+15} y={295} width={RW-30} height={70} rx="5" fill={P.ok+"10"} stroke={P.ok+"30"} strokeWidth="1"/>
            <text x={RX+RW/2} y={312} textAnchor="middle" fill={P.ok} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">MatBERT Performance</text>
            <text x={RX+30} y={330} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">Precision: 0.84</text>
            <text x={RX+140} y={330} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">Recall: 0.97</text>
            <text x={RX+30} y={348} fill={P.ok} fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">F1 Score: 0.90</text>
          </g>
        </svg>
      );
    }

    // ── GPT-4o EXTRACTION ──────────────────────────────────────────────
    case "gpt4o": {
      const tOp = ease(clamp01(t * 4));

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Step 2: GPT-4o Reaction Extraction</text>
          <line x1={280} y1={32} x2={280} y2={415} stroke={P.border} strokeWidth="1" opacity={tOp*0.6} />

          {/* LEFT — paper input */}
          <rect x={10} y={36} width={260} height={375} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          <text x={140} y={55} textAnchor="middle" fill={P.lit} fontSize="9.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.05)*4))}>Paper Input (Relevant Portions)</text>

          {/* Simulated paper text */}
          <g opacity={ease(clamp01((t-0.1)*4))}>
            <rect x={20} y={65} width={240} height={125} rx="5" fill={P.bg} stroke={P.border} strokeWidth="1"/>
            <text x={30} y={82} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              "2.1 Synthesis of lanthanum</text>
            <text x={30} y={94} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              silicate oxyapatite powders</text>
            <text x={30} y={112} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              The powders were synthesized by a</text>
            <text x={30} y={124} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              conventional solid state reaction</text>
            <text x={30} y={136} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              process using high purity </text>
            <text x={205} y={136} fill={P.gpt} fontSize="7" fontWeight="700" fontFamily="'Fira Code',monospace">La₂O₃</text>
            <text x={30} y={148} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              , </text>
            <text x={40} y={148} fill={P.gpt} fontSize="7" fontWeight="700" fontFamily="'Fira Code',monospace">SiO₂</text>
            <text x={65} y={148} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              , BaCO₃, SrCO₃, CaCO₃...</text>
            <text x={30} y={166} fill={P.muted} fontSize="6.5" fontFamily="'Fira Code',monospace">
              ...</text>
            <text x={30} y={178} fill={P.muted} fontSize="7" fontFamily="'Fira Code',monospace">
              a secondary phase, </text>
            <text x={155} y={178} fill={P.impure} fontSize="7" fontWeight="700" fontFamily="'Fira Code',monospace">La₂Si₂O₅</text>
          </g>

          {/* Sections used */}
          <g opacity={ease(clamp01((t-0.25)*4))}>
            <text x={30} y={210} fill={P.muted} fontSize="7.5" fontWeight="600" fontFamily="'Inter',sans-serif">Sections used:</text>
            {["Abstract", "Synthesis paragraph(s)", "Results", "Discussion"].map((s, i) => (
              <g key={i}>
                <rect x={20+i*60} y={215} width={55} height={18} rx="3" fill={P.lit+"15"} stroke={P.lit+"30"} strokeWidth="0.8"/>
                <text x={20+i*60+27.5} y={227} textAnchor="middle" fill={P.lit} fontSize="6.5" fontFamily="'Inter',sans-serif">{s}</text>
              </g>
            ))}
            <text x={30} y={250} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">
              Intro &amp; Conclusion excluded (repeated info)
            </text>
          </g>

          {/* RIGHT — GPT-4o output */}
          <rect x={290} y={36} width={260} height={375} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={tOp*0.4} />

          <text x={420} y={55} textAnchor="middle" fill={P.gpt} fontSize="9.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.35)*4))}>GPT-4o Output (JSON)</text>

          {/* JSON output */}
          <g opacity={ease(clamp01((t-0.4)*4))}>
            <rect x={300} y={65} width={240} height={140} rx="5" fill={P.bg} stroke={P.gpt+"40"} strokeWidth="1.5"/>
            {[
              { t: '{', c: P.dim },
              { t: '  "precursors": [', c: P.muted },
              { t: '    "La₂O₃", "SiO₂"', c: P.gpt },
              { t: '  ],', c: P.muted },
              { t: '  "target":', c: P.muted },
              { t: '    "La₁₀Si₆O₂₆.₅"', c: P.data },
              { t: '  "impurity_phases": [', c: P.muted },
              { t: '    "La₂Si₂O₅"', c: P.impure },
              { t: '  ]', c: P.muted },
              { t: '}', c: P.dim },
            ].map((ln, i) => (
              <text key={i} x={310} y={82+i*13} fill={ln.c} fontSize="7.5" fontWeight={ln.c === P.gpt || ln.c === P.data || ln.c === P.impure ? "700" : "400"}
                fontFamily="'Fira Code',monospace" opacity={ease(clamp01((t-0.42-i*0.02)*5))}>{ln.t}</text>
            ))}
          </g>

          {/* Post-processing */}
          <g opacity={ease(clamp01((t-0.6)*4))}>
            <text x={420} y={225} textAnchor="middle" fill={P.target} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Post-Processing</text>
            {[
              { label: "MaterialParser", desc: "detect formulas", color: P.target },
              { label: "ReactionBalancer", desc: "balance equations", color: P.lit },
              { label: "LLM Verifier", desc: "validate formulas", color: P.gpt },
              { label: "Materials Project", desc: "fetch mp_id", color: P.data },
            ].map((s, i) => {
              const op2 = ease(clamp01((t - 0.63 - i*0.05) * 4));
              return (
                <g key={i} opacity={op2}>
                  <rect x={300} y={235+i*32} width={110} height={26} rx="4" fill={s.color+"15"} stroke={s.color+"40"} strokeWidth="1"/>
                  <text x={310} y={252+i*32} fill={s.color} fontSize="8" fontWeight="600" fontFamily="'Inter',sans-serif">{s.label}</text>
                  <text x={420} y={252+i*32} fill={P.muted} fontSize="7" fontFamily="'Inter',sans-serif">{s.desc}</text>
                </g>
              );
            })}
          </g>

          {/* Config */}
          <g opacity={ease(clamp01((t-0.82)*4))}>
            <rect x={300} y={370} width={240} height={30} rx="5" fill={P.gpt+"10"} stroke={P.gpt+"30"} strokeWidth="1"/>
            <text x={420} y={389} textAnchor="middle" fill={P.gpt} fontSize="7.5" fontWeight="600"
              fontFamily="'Fira Code',monospace">gpt-4o-2024-05-13 · temp=0 · few-shot</text>
          </g>
        </svg>
      );
    }

    // ── DATASET OVERVIEW ───────────────────────────────────────────────
    case "dataset": {
      const tOp = ease(clamp01(t * 4));

      const stats = [
        { label: "Total Reactions",        value: "80,806", color: P.data },
        { label: "Phase-pure",             value: "61,937", color: P.pure },
        { label: "Phase-impure",           value: "18,869", color: P.impure },
        { label: "Balanced target rxn",    value: "52,637", color: P.target },
        { label: "Has heating temp",       value: "64,087", color: P.data },
        { label: "Products have MP ID",    value: "34,830", color: P.gpt },
      ];

      // Bar chart
      const barData = [
        { label: "Phase-pure", val: 61937, max: 62000, color: P.pure },
        { label: "Phase-impure", val: 18869, max: 62000, color: P.impure },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Dataset Overview: 80,806 Reactions</text>

          {/* Stats grid */}
          {stats.map((s, i) => {
            const op = ease(clamp01((t - 0.05 - i*0.06) * 4));
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 30 + col * 175;
            const y = 40 + row * 65;
            return (
              <g key={i} opacity={op}>
                <rect x={x} y={y} width={160} height={52} rx="7" fill={s.color+"12"} stroke={s.color+"40"} strokeWidth="1.5"/>
                <text x={x+80} y={y+22} textAnchor="middle" fill={s.color} fontSize="16" fontWeight="900"
                  fontFamily="'Inter',sans-serif">{s.value}</text>
                <text x={x+80} y={y+40} textAnchor="middle" fill={P.muted} fontSize="8"
                  fontFamily="'Inter',sans-serif">{s.label}</text>
              </g>
            );
          })}

          {/* Bar chart */}
          <g opacity={ease(clamp01((t-0.4)*4))}>
            <text x={W/2} y={190} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="600"
              fontFamily="'Inter',sans-serif">Distribution</text>
            {barData.map((b, i) => {
              const bw = ease(clamp01((t - 0.45 - i*0.08) * 3)) * (b.val / b.max) * 400;
              return (
                <g key={i}>
                  <text x={30} y={215+i*35} fill={b.color} fontSize="8.5" fontWeight="600" fontFamily="'Inter',sans-serif">{b.label}</text>
                  <rect x={130} y={203+i*35} width={bw} height={18} rx="3" fill={b.color+"40"} stroke={b.color} strokeWidth="1"/>
                  <text x={135+bw} y={216+i*35} fill={b.color} fontSize="9" fontWeight="700"
                    fontFamily="'Inter',sans-serif">{b.val.toLocaleString()}</text>
                </g>
              );
            })}
          </g>

          {/* Data record format */}
          <g opacity={ease(clamp01((t-0.6)*4))}>
            <rect x={20} y={270} width={W-40} height={135} rx="7" fill={P.surface} stroke={P.border} strokeWidth="1"/>
            <text x={W/2} y={290} textAnchor="middle" fill={P.data} fontSize="9.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">Data Record Format</text>
            {[
              { field: "DOI", type: "string", color: P.lit },
              { field: "target_reaction", type: "balanced equation", color: P.target },
              { field: "impurity_phase_reaction", type: "side reactions", color: P.impure },
              { field: "target", type: "{formula, composition, mp_id}", color: P.data },
              { field: "impurity_phase", type: "list of phases", color: P.warn },
              { field: "precursors", type: "list of materials", color: P.gpt },
              { field: "conditions_forDOI", type: "{temp, time, atmosphere}", color: P.thermo },
            ].map((f, i) => {
              const op2 = ease(clamp01((t - 0.63 - i*0.03) * 5));
              return (
                <g key={i} opacity={op2}>
                  <text x={35} y={308+i*13} fill={f.color} fontSize="7.5" fontWeight="600"
                    fontFamily="'Fira Code',monospace">{f.field}</text>
                  <text x={200} y={308+i*13} fill={P.muted} fontSize="7"
                    fontFamily="'Inter',sans-serif">{f.type}</text>
                </g>
              );
            })}
          </g>
        </svg>
      );
    }

    // ── TOP REACTIONS ──────────────────────────────────────────────────
    case "top_rxns": {
      const tOp = ease(clamp01(t * 4));

      const reactions = [
        { rxn: "Bi₂O₃ + Fe₂O₃ → BiFeO₃", imp: "Bi₂Fe₄O₉, Bi₂₅FeO₄₀", count: "107/221", color: P.impure },
        { rxn: "CaCO₃ + CuO + TiO₂ → CCTO", imp: "CaTiO₃, CuO", count: "119/179", color: P.data },
        { rxn: "BaCO₃ + CuO + Y₂O₃ → YBCO", imp: "Y₂BaCuO₅", count: "91/138", color: P.thermo },
        { rxn: "C + Si + Ti → Ti₃SiC₂", imp: "TiC, SiC", count: "26/71", color: P.bert },
        { rxn: "BaCO₃ + TiO₂ → BaTiO₃", imp: "Ba₂TiO₄", count: "258/302", color: P.lit },
        { rxn: "Al + C + Ti → Ti₃AlC₂", imp: "TiC", count: "52/91", color: P.gpt },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Top Reactions with Impurity Phases</text>

          {/* Table header */}
          <g opacity={ease(clamp01((t-0.05)*4))}>
            <rect x={15} y={35} width={W-30} height={22} rx="4" fill={P.data+"15"}/>
            <text x={30} y={50} fill={P.data} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Reaction</text>
            <text x={305} y={50} fill={P.impure} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Impurity Phases</text>
            <text x={470} y={50} fill={P.muted} fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Impure/Total</text>
          </g>

          {/* Reaction rows */}
          {reactions.map((r, i) => {
            const op = ease(clamp01((t - 0.1 - i*0.08) * 4));
            const y = 65 + i * 52;
            return (
              <g key={i} opacity={op}>
                <rect x={15} y={y} width={W-30} height={44} rx="5" fill={P.surface} stroke={P.border} strokeWidth="0.8"/>
                <text x={30} y={y+18} fill={r.color} fontSize="8.5" fontWeight="700"
                  fontFamily="'Fira Code',monospace">{r.rxn}</text>
                <text x={305} y={y+18} fill={P.warn} fontSize="8" fontFamily="'Fira Code',monospace">{r.imp}</text>
                <rect x={470} y={y+6} width={65} height={18} rx="3" fill={P.impure+"15"} stroke={P.impure+"30"} strokeWidth="0.8"/>
                <text x={502} y={y+19} textAnchor="middle" fill={P.impure} fontSize="8.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{r.count}</text>
                <text x={30} y={y+35} fill={P.dim} fontSize="7" fontFamily="'Inter',sans-serif">
                  {i===0 ? "Multiferroic — narrow stability, Bi volatility" :
                   i===1 ? "Giant dielectric — CuO tenorite impurity common" :
                   i===2 ? "High-Tc superconductor — slow diffusion at 930°C" :
                   i===3 ? "MAX phase — TiC competes as impurity" :
                   i===4 ? "Piezoelectric ceramic — most studied reaction" :
                   "MAX phase — precursor route matters"}
                </text>
              </g>
            );
          })}

          {/* Note */}
          <g opacity={ease(clamp01((t-0.8)*4))}>
            <text x={W/2} y={395} textAnchor="middle" fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif">
              Precursor selection critically affects impurity formation (e.g. Ti₃AlC₂: elemental vs compound route)
            </text>
          </g>
        </svg>
      );
    }

    // ── THERMODYNAMIC VALIDATION ───────────────────────────────────────
    case "thermo": {
      const tOp = ease(clamp01(t * 4));

      // Histogram bars (simplified)
      const bins = [
        { x: -0.6, h: 8 }, { x: -0.5, h: 25 }, { x: -0.4, h: 65 }, { x: -0.3, h: 120 },
        { x: -0.2, h: 200 }, { x: -0.1, h: 350 }, { x: 0.0, h: 600 },
        { x: 0.1, h: 280 }, { x: 0.2, h: 100 }, { x: 0.3, h: 40 }, { x: 0.4, h: 15 },
      ];
      const maxH = 600;
      const chartX = 80, chartY = 80, chartW = 400, chartH = 180;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Thermodynamic Validation: E_hull Analysis</text>

          {/* Chart background */}
          <rect x={chartX} y={chartY} width={chartW} height={chartH} fill={P.surface} stroke={P.border} strokeWidth="1" rx="4" opacity={tOp*0.5}/>

          {/* Zero line */}
          <line x1={chartX + chartW * 0.545} y1={chartY} x2={chartX + chartW * 0.545} y2={chartY + chartH}
            stroke={P.ink+"40"} strokeWidth="1" strokeDasharray="4,3" opacity={ease(clamp01((t-0.1)*4))}/>

          {/* Bars */}
          {bins.map((b, i) => {
            const op = ease(clamp01((t - 0.15 - i*0.03) * 4));
            const bx = chartX + (i / bins.length) * chartW + 5;
            const bw = (chartW / bins.length) - 8;
            const bh = (b.h / maxH) * (chartH - 10);
            const isImpureStable = b.x < 0;
            return (
              <g key={i} opacity={op}>
                <rect x={bx} y={chartY + chartH - bh} width={bw} height={bh} rx="2"
                  fill={isImpureStable ? P.impure+"60" : P.pure+"60"}
                  stroke={isImpureStable ? P.impure : P.pure} strokeWidth="1"/>
              </g>
            );
          })}

          {/* Axis labels */}
          <g opacity={ease(clamp01((t-0.15)*4))}>
            <text x={chartX + chartW/2} y={chartY + chartH + 18} textAnchor="middle" fill={P.muted} fontSize="8"
              fontFamily="'Inter',sans-serif">E_hull(impurity) − E_hull(target) (eV/atom)</text>
            <text x={chartX - 5} y={chartY + chartH + 5} fill={P.muted} fontSize="7" textAnchor="end"
              fontFamily="'Inter',sans-serif">−0.6</text>
            <text x={chartX + chartW + 5} y={chartY + chartH + 5} fill={P.muted} fontSize="7"
              fontFamily="'Inter',sans-serif">0.4</text>
            <text x={chartX + chartW * 0.545} y={chartY + chartH + 5} textAnchor="middle" fill={P.ink} fontSize="7" fontWeight="700"
              fontFamily="'Inter',sans-serif">0.0</text>
          </g>

          {/* Annotations */}
          <g opacity={ease(clamp01((t-0.4)*4))}>
            <text x={chartX + chartW * 0.25} y={chartY - 8} textAnchor="middle" fill={P.impure} fontSize="8" fontWeight="700"
              fontFamily="'Inter',sans-serif">← Impurity more stable</text>
            <text x={chartX + chartW * 0.8} y={chartY - 8} textAnchor="middle" fill={P.pure} fontSize="8" fontWeight="700"
              fontFamily="'Inter',sans-serif">Target more stable →</text>
          </g>

          {/* Key findings */}
          <g opacity={ease(clamp01((t-0.5)*4))}>
            <rect x={30} y={300} width={500} height={105} rx="7" fill={P.surface} stroke={P.border} strokeWidth="1"/>
            <text x={W/2} y={320} textAnchor="middle" fill={P.thermo} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Key Findings (3,267 reactions analyzed)</text>
            {[
              { text: "31% — impurity has lower E_hull (thermodynamically expected)", color: P.impure, icon: "●" },
              { text: "54% — both on convex hull (E_hull = 0)", color: P.data, icon: "●" },
              { text: "15% — impurity has HIGHER E_hull but still forms!", color: P.warn, icon: "!" },
            ].map((f, i) => {
              const op2 = ease(clamp01((t - 0.55 - i*0.06) * 4));
              return (
                <g key={i} opacity={op2}>
                  <text x={50} y={340+i*20} fill={f.color} fontSize="9" fontWeight="700"
                    fontFamily="'Inter',sans-serif">{f.icon}</text>
                  <text x={65} y={340+i*20} fill={P.ink} fontSize="8.5"
                    fontFamily="'Inter',sans-serif">{f.text}</text>
                </g>
              );
            })}
            <text x={W/2} y={395} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif">
              E_hull alone is insufficient to predict impurity formation — kinetics matter!
            </text>
          </g>
        </svg>
      );
    }

    // ── TECHNICAL VALIDATION ───────────────────────────────────────────
    case "validation": {
      const tOp = ease(clamp01(t * 4));

      const metrics = [
        { entity: "Recipe Classifier", method: "MatBERT", prec: "0.84", rec: "0.97", f1: "0.90", color: P.bert },
        { entity: "Targets", method: "GPT4o + post", prec: "0.90", rec: "0.69", f1: "0.78", color: P.target },
        { entity: "Precursors", method: "GPT4o + post", prec: "0.95", rec: "0.97", f1: "0.96", color: P.gpt },
        { entity: "Impurity phases", method: "GPT4o + post", prec: "0.86", rec: "0.90", f1: "0.88", color: P.impure },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Technical Validation</text>

          {/* Table header */}
          <g opacity={ease(clamp01((t-0.05)*4))}>
            <rect x={20} y={40} width={W-40} height={24} rx="4" fill={P.data+"15"}/>
            <text x={40} y={56} fill={P.data} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Entity</text>
            <text x={190} y={56} fill={P.muted} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Method</text>
            <text x={320} y={56} fill={P.ok} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Precision</text>
            <text x={385} y={56} fill={P.ok} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Recall</text>
            <text x={450} y={56} fill={P.ok} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">F1</text>
          </g>

          {/* Rows */}
          {metrics.map((m, i) => {
            const op = ease(clamp01((t - 0.1 - i*0.08) * 4));
            const y = 72 + i * 38;
            return (
              <g key={i} opacity={op}>
                <rect x={20} y={y} width={W-40} height={32} rx="4" fill={P.surface} stroke={P.border} strokeWidth="0.8"/>
                <text x={40} y={y+20} fill={m.color} fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{m.entity}</text>
                <text x={190} y={y+20} fill={P.muted} fontSize="8" fontFamily="'Fira Code',monospace">{m.method}</text>
                <text x={330} y={y+20} fill={P.ink} fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">{m.prec}</text>
                <text x={395} y={y+20} fill={P.ink} fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">{m.rec}</text>
                {/* F1 bar */}
                <rect x={440} y={y+8} width={parseFloat(m.f1)*70} height={14} rx="3" fill={m.color+"30"} stroke={m.color+"60"} strokeWidth="1"/>
                <text x={445+parseFloat(m.f1)*70} y={y+19} fill={m.color} fontSize="9" fontWeight="800" fontFamily="'Inter',sans-serif">{m.f1}</text>
              </g>
            );
          })}

          {/* Validation details */}
          <g opacity={ease(clamp01((t-0.5)*4))}>
            <rect x={20} y={230} width={W-40} height={170} rx="7" fill={P.surface} stroke={P.border} strokeWidth="1"/>
            <text x={W/2} y={252} textAnchor="middle" fill={P.lit} fontSize="10" fontWeight="700"
              fontFamily="'Inter',sans-serif">Validation Methodology</text>

            {[
              { text: "480 paragraphs manually annotated (stratified: 10/publisher × 6 classes)", delay: 0.55 },
              { text: "2 PhD annotators: 89% agreement → ground truth via discussion", delay: 0.6 },
              { text: "78 paper portions → 98 reactions hand-annotated for extraction", delay: 0.65 },
              { text: "Micro-averaged precision, recall, F1 across all entities", delay: 0.7 },
              { text: "F1 increases to 0.93 for impurity phases when filtering balanced only", delay: 0.75 },
            ].map((v, i) => (
              <text key={i} x={35} y={272+i*18} fill={P.muted} fontSize="8"
                fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-v.delay)*5))}>• {v.text}</text>
            ))}

            <g opacity={ease(clamp01((t-0.8)*4))}>
              <rect x={40} y={365} width={W-80} height={24} rx="5" fill={P.ok+"12"} stroke={P.ok+"30"} strokeWidth="1"/>
              <text x={W/2} y={381} textAnchor="middle" fill={P.ok} fontSize="9" fontWeight="700"
                fontFamily="'Inter',sans-serif">GPT-4o captures long-range context: impurity info often in Discussion, not Recipe</text>
            </g>
          </g>
        </svg>
      );
    }

    // ── IMPACT & APPLICATIONS ──────────────────────────────────────────
    case "impact": {
      const tOp = ease(clamp01(t * 4));

      const apps = [
        { title: "Cross-Validation", desc: "Compare recipes across groups — consistent pure = reliable route", icon: "✓", color: P.ok },
        { title: "Failure Analysis", desc: "Conflicting results reveal hidden variables in synthesis", icon: "⚠", color: P.warn },
        { title: "Exploration Gaps", desc: "Map unexplored synthesis space — find anthropogenic bias", icon: "🔍", color: P.lit },
        { title: "ML Training Data", desc: "Predict synthesis outcomes with impurity-aware models", icon: "🤖", color: P.gpt },
        { title: "Autonomous Labs", desc: "Guide high-throughput experiments with data-driven routes", icon: "🔬", color: P.thermo },
      ];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={22} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Impact &amp; Applications</text>

          {/* Dataset summary */}
          <g opacity={ease(clamp01((t-0.05)*4))}>
            <rect x={30} y={35} width={W-60} height={55} rx="8" fill={P.data+"12"} stroke={P.data+"40"} strokeWidth="1.5"/>
            <text x={W/2} y={55} textAnchor="middle" fill={P.data} fontSize="11" fontWeight="800"
              fontFamily="'Inter',sans-serif">80,806 solid-state synthesis reactions</text>
            <text x={W/2} y={75} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">Including 18,869 with reported impurity phases — first dataset of its kind</text>
          </g>

          {/* Application cards */}
          {apps.map((a, i) => {
            const op = ease(clamp01((t - 0.15 - i*0.1) * 4));
            const y = 105 + i * 56;
            return (
              <g key={i} opacity={op}>
                <rect x={30} y={y} width={W-60} height={46} rx="7" fill={a.color+"10"} stroke={a.color+"35"} strokeWidth="1.5"/>
                <text x={55} y={y+20} fill={a.color} fontSize="13" fontFamily="'Inter',sans-serif">{a.icon}</text>
                <text x={75} y={y+18} fill={a.color} fontSize="10" fontWeight="700" fontFamily="'Inter',sans-serif">{a.title}</text>
                <text x={75} y={y+35} fill={P.muted} fontSize="8.5" fontFamily="'Inter',sans-serif">{a.desc}</text>
              </g>
            );
          })}

          {/* Citation */}
          <g opacity={ease(clamp01((t-0.7)*4))}>
            <text x={W/2} y={395} textAnchor="middle" fill={P.dim} fontSize="7.5"
              fontFamily="'Inter',sans-serif">
              Lee et al., Scientific Data 12:1969 (2025) · doi.org/10.1038/s41597-025-06222-y
            </text>
            <text x={W/2} y={410} textAnchor="middle" fill={P.dim} fontSize="7"
              fontFamily="'Inter',sans-serif">
              Dataset: figshare.30423274 · Code: github.com/CederGroupHub/text-mined-synthesis_public
            </text>
          </g>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={H/2} textAnchor="middle" fill={P.muted} fontSize="14"
            fontFamily="'Inter',sans-serif">Scene: {scene.id}</text>
        </svg>
      );
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // PLAYER UI
  // ═══════════════════════════════════════════════════════════════════════
  const totalDuration = SCENES.reduce((s, sc) => s + sc.duration, 0);
  const elapsed        = SCENES.slice(0, sceneIdx).reduce((s, sc) => s + sc.duration, 0) + progress * scene.duration;
  const globalProgress = elapsed / totalDuration;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: P.muted, textTransform: "uppercase", marginBottom: 4 }}>
          Animated Module
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.data, marginBottom: 4 }}>
          Text-Mined Solid-State Synthesis Dataset
        </div>
        <div style={{ fontSize: 13, color: P.muted, lineHeight: 1.5 }}>
          80,806 reactions extracted from 8.8M papers using MatBERT + GPT-4o, including 18,869 with impurity phases.
        </div>
      </div>

      {/* Cinema screen */}
      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
      }}>
        <div style={{ position: "absolute", top: 10, left: 14, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: P.data+"25", border: `1px solid ${P.data}50`, padding: "3px 10px",
            borderRadius: 6, fontSize: 10, fontWeight: 700, color: P.data, letterSpacing: 1 }}>
            Scene {sceneIdx + 1}/{SCENES.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{scene.label}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 14, zIndex: 2, fontSize: 11, color: "#fff", fontWeight: 600, opacity: 0.7 }}>
          Habibur Rahman · rahma103@purdue.edu
        </div>
        <div style={{ opacity: fadeClass, transition: "opacity 0.25s ease-in-out" }}>
          {renderScene()}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: P.dim+"30" }}>
          <div style={{ height: "100%", background: P.data, width: `${progress * 100}%`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: P.panel, padding: "10px 14px", borderRadius: 12, border: `1px solid ${P.border}` }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.data}`,
          background: P.data+"15", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18, color: P.data, fontWeight: 900, fontFamily: "inherit",
        }}>
          {playing ? "\u23F8" : (sceneIdx === SCENES.length - 1 && progress >= 1) ? "\u21BB" : "\u25B6"}
        </button>
        <button onClick={prevScene} disabled={sceneIdx === 0} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`, background: "transparent", cursor: sceneIdx > 0 ? "pointer" : "default", color: sceneIdx > 0 ? P.ink : P.dim, fontSize: 13, fontWeight: 700, fontFamily: "inherit", opacity: sceneIdx > 0 ? 1 : 0.4 }}>{"\u2190"}</button>
        <button onClick={nextScene} disabled={sceneIdx === SCENES.length - 1} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`, background: "transparent", cursor: sceneIdx < SCENES.length - 1 ? "pointer" : "default", color: sceneIdx < SCENES.length - 1 ? P.ink : P.dim, fontSize: 13, fontWeight: 700, fontFamily: "inherit", opacity: sceneIdx < SCENES.length - 1 ? 1 : 0.4 }}>{"\u2192"}</button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ height: 6, background: P.dim+"30", borderRadius: 3, position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              let acc = 0;
              for (let i = 0; i < SCENES.length; i++) {
                const next = acc + SCENES[i].duration / totalDuration;
                if (x <= next) { goScene(i); break; }
                acc = next;
              }
            }}>
            <div style={{ height: "100%", background: P.data, width: `${globalProgress * 100}%`, borderRadius: 3, transition: playing ? "none" : "width 0.1s" }} />
            {SCENES.map((_, i) => {
              const pos = SCENES.slice(0, i).reduce((s, sc) => s + sc.duration, 0) / totalDuration * 100;
              return i === 0 ? null : <div key={i} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: "100%", background: P.dim }} />;
            })}
          </div>
          <div style={{ display: "flex", marginTop: 6, gap: 4, flexWrap: "wrap" }}>
            {SCENES.map((sc, i) => (
              <button key={i} onClick={() => goScene(i)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11,
                background: i === sceneIdx ? P.data+"25" : "transparent",
                border: `1px solid ${i === sceneIdx ? P.data : P.dim}`,
                color: i === sceneIdx ? P.data : P.muted,
                cursor: "pointer", fontFamily: "inherit", fontWeight: i === sceneIdx ? 700 : 400,
                whiteSpace: "nowrap",
              }}>{sc.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
