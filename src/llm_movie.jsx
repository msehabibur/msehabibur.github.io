import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LLM PIPELINE MOVIE — LangGraph architecture walkthrough
// ═══════════════════════════════════════════════════════════════════════════

const P = {
  bg:      "#0c0f1a",
  panel:   "#141825",
  surface: "#1a1f30",
  border:  "#2a3050",
  ink:     "#e8ecf4",
  muted:   "#7b8499",
  dim:     "#3a4060",
  rag:     "#38bdf8",
  agent:   "#818cf8",
  llm:     "#34d399",
  data:    "#f59e0b",
  vector:  "#f472b6",
  ok:      "#4ade80",
  warn:    "#f87171",
  node:    "#2dd4bf",
  chunk:   "#a78bfa",
};

const SCENES = [
  { id: "title",       label: "LLM Pipeline",           duration: 3500 },
  { id: "arch",        label: "LangGraph Architecture", duration: 8500 },
  { id: "chunk_embed", label: "Chunk & Embed",          duration: 6500 },
  { id: "retrieve",    label: "Retrieve & Grade",       duration: 7000 },
  { id: "generate",    label: "Generate & Verify",      duration: 7000 },
  { id: "uncertainty", label: "Uncertainty Routing",    duration: 6500 },
  { id: "synthesis",   label: "Synthesis Recipe",       duration: 7500 },
  { id: "batch",       label: "Batch Processing",       duration: 6000 },
  { id: "code_walk",   label: "Python Code Walkthrough", duration: 10000 },
  { id: "finale",      label: "Pipeline Summary",        duration: 5500 },
];

const ease     = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const lerp     = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp01  = t => Math.max(0, Math.min(1, t));

export default function LLMMovieModule() {
  const [sceneIdx, setSceneIdx]   = useState(0);
  const [progress, setProgress]   = useState(0);
  const [playing, setPlaying]     = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [codeStep, setCodeStep]   = useState(0);
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

  const goScene = (i) => { setPlaying(false); setManualMode(true); setSceneIdx(i); setProgress(0); setCodeStep(0); startRef.current = null; };
  const playAll = () => { setManualMode(false); setSceneIdx(0); setProgress(0); setCodeStep(0); startRef.current = null; setPlaying(true); };
  const togglePause = () => {
    if (playing) { setPlaying(false); setManualMode(true); }
    else { setManualMode(false); startRef.current = null; setPlaying(true); }
  };
  const nextScene = () => { if (sceneIdx < SCENES.length - 1) goScene(sceneIdx + 1); };
  const prevScene = () => { if (sceneIdx > 0) goScene(sceneIdx - 1); };

  const CODE_STEPS = 6;
  const goCodeStep = (step) => {
    setCodeStep(step);
    setPlaying(false);
    setManualMode(true);
    setProgress(0);
    startRef.current = null;
  };

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

    switch (scene.id) {

    // ── TITLE ────────────────────────────────────────────────────────────
    case "title": {
      const tOp = ease(clamp01(t * 3));
      const sOp = ease(clamp01((t - 0.3) * 3));
      const lW  = ease(clamp01((t - 0.2) * 2.5)) * 240;
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={0} y1={i * 30} x2={W} y2={i * 30} stroke={P.dim} strokeWidth="0.3" opacity={0.2} />
          ))}
          <text x={W/2} y={130} textAnchor="middle" fill={P.ink} fontSize="28" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>LLM Literature Mining</text>
          <rect x={(W-lW)/2} y={146} width={lW} height={3} rx="1.5" fill={P.rag} opacity={tOp * 0.8} />
          <text x={W/2} y={182} textAnchor="middle" fill={P.muted} fontSize="13"
            fontFamily="'Inter',sans-serif" opacity={sOp}>
            A LangGraph pipeline from raw papers to synthesis recipes
          </text>
          <text x={W/2} y={210} textAnchor="middle" fill={P.agent} fontSize="11"
            fontFamily="'Inter',sans-serif" opacity={sOp * 0.8}>
            Retrieval · Grading · Generation · Uncertainty · Synthesis
          </text>
          <text x={W/2} y={310} textAnchor="middle" fill={P.muted} fontSize="10"
            fontFamily="'Inter',sans-serif" opacity={ease(clamp01((t-0.6)*3))}>
            Habibur Rahman · rahma103@purdue.edu · Purdue University
          </text>
        </svg>
      );
    }

    // ── LANGGRAPH ARCHITECTURE ───────────────────────────────────────────
    case "arch": {
      // Node layout (NW=80, NH=34) — all within 0-560 x 0-420
      // Top pipeline row y=52:  Ingest(18) Chunk(108) Embed(198) Retrieve(288)
      // Right column x=390:     Grade(y=52) Generate(y=148) Quality(y=244) Synthesize(y=340)
      // Left returns:            Retry(x=208,y=148)  Report(x=78,y=340)
      const NW = 80, NH = 34;
      const nodes = [
        { id:"ingest",     label:"Ingest",      sub:"load papers",       x:18,  y:52,  color:P.data  },
        { id:"chunk",      label:"Chunk",       sub:"split text",        x:108, y:52,  color:P.chunk },
        { id:"embed",      label:"Embed",       sub:"vectorize",         x:198, y:52,  color:P.vector},
        { id:"retrieve",   label:"Retrieve",    sub:"FAISS top-k",       x:288, y:52,  color:P.rag   },
        { id:"grade",      label:"Grade",       sub:"relevance score",   x:390, y:52,  color:P.data  },
        { id:"generate",   label:"Generate",    sub:"LLM drafts answer", x:390, y:148, color:P.agent },
        { id:"quality",    label:"Quality",     sub:"hallucination check",x:390, y:244, color:P.warn  },
        { id:"synthesize", label:"Synthesize",  sub:"recipe extraction", x:390, y:340, color:P.llm   },
        { id:"retry",      label:"Retry",       sub:"refine query",      x:208, y:148, color:P.warn  },
        { id:"report",     label:"Report",      sub:"structured output", x:78,  y:340, color:P.ok    },
      ];
      // Edge definitions: [fromIdx, toIdx, label, color, path]
      // path: "h"=horizontal, "v"=vertical, "bent"=L-shape
      const gc = (n) => ({ cx: n.x + NW/2, cy: n.y + NH/2, rx: n.x + NW, lx: n.x, ty: n.y, by: n.y + NH });
      const edgeData = [
        { f:0, t:1,  label:"",      color:P.dim, dash:""     },
        { f:1, t:2,  label:"",      color:P.dim, dash:""     },
        { f:2, t:3,  label:"",      color:P.dim, dash:""     },
        { f:3, t:4,  label:"",      color:P.dim, dash:"4,3"  },
        { f:4, t:5,  label:"pass",  color:P.ok,  dash:""     },
        { f:4, t:8,  label:"fail",  color:P.warn, dash:"5,3" },
        { f:8, t:3,  label:"retry", color:P.warn, dash:"5,3" },
        { f:5, t:6,  label:"",      color:P.dim, dash:""     },
        { f:6, t:7,  label:"pass",  color:P.ok,  dash:""     },
        { f:6, t:5,  label:"fail",  color:P.warn, dash:"5,3" },
        { f:7, t:9,  label:"",      color:P.llm, dash:""     },
      ];
      const titleOp = ease(clamp01(t * 4));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={titleOp}>LangGraph Architecture — 10-Node Pipeline</text>

          {/* Custom edges */}
          {(() => {
            const edges = [];
            // 0→1 horizontal
            edges.push({ key:"e01", d:`M${18+NW},${52+NH/2} L${108},${52+NH/2}`, color:P.dim, dash:"" });
            // 1→2
            edges.push({ key:"e12", d:`M${108+NW},${52+NH/2} L${198},${52+NH/2}`, color:P.dim, dash:"" });
            // 2→3
            edges.push({ key:"e23", d:`M${198+NW},${52+NH/2} L${288},${52+NH/2}`, color:P.dim, dash:"" });
            // 3→4 (gap between Retrieve right=368 and Grade left=390)
            edges.push({ key:"e34", d:`M${288+NW},${52+NH/2} L${390},${52+NH/2}`, color:P.rag, dash:"3,2" });
            // 4→5 (pass, vertical down from Grade bottom to Generate top)
            edges.push({ key:"e45p", d:`M${390+NW/2},${52+NH} L${390+NW/2},${148}`, color:P.ok, dash:"" });
            // 4→8 (fail, bent: Grade left → left → down to Retry top)
            edges.push({ key:"e48f", d:`M${390},${52+NH/2} L${370},${52+NH/2} L${370},${132} L${208+NW/2},${132} L${208+NW/2},${148}`, color:P.warn, dash:"5,3" });
            // 8→3 (retry → retrieve, route LEFT of Embed via gap at x=192)
            edges.push({ key:"e83", d:`M${248},${148} L${192},${148} L${192},${38} L${288+NW/2},${38} L${288+NW/2},${52}`, color:P.warn, dash:"5,3" });
            // 5→6 vertical
            edges.push({ key:"e56", d:`M${390+NW/2},${148+NH} L${390+NW/2},${244}`, color:P.dim, dash:"" });
            // 6→7 pass vertical
            edges.push({ key:"e67p", d:`M${390+NW/2},${244+NH} L${390+NW/2},${340}`, color:P.ok, dash:"" });
            // 6→5 fail (bent left side, up)
            edges.push({ key:"e65f", d:`M${390},${244+NH/2} L${374},${244+NH/2} L${374},${148+NH/2} L${390},${148+NH/2}`, color:P.warn, dash:"5,3" });
            // 7→9: Synthesize left → Report right (both at same y=357)
            edges.push({ key:"e79", d:`M${390},${340+NH/2} L${158},${340+NH/2}`, color:P.llm, dash:"" });
            return edges.map((e, i) => {
              const op = ease(clamp01((t - 0.04 - i * 0.06) * 5));
              return <path key={e.key} d={e.d} fill="none" stroke={e.color} strokeWidth="1.5"
                strokeDasharray={e.dash || "none"} opacity={op * 0.8} markerEnd="none" />;
            });
          })()}

          {/* Arrow tips — downward on vertical edges */}
          {[
            { x: 390+NW/2, y: 148, color:P.ok,   delay:0.28 },
            { x: 248,      y: 148, color:P.warn, delay:0.34 },
            { x: 288+NW/2, y: 52,  color:P.warn, delay:0.40 },
            { x: 390+NW/2, y: 244, color:P.dim,  delay:0.46 },
            { x: 390+NW/2, y: 340, color:P.ok,   delay:0.52 },
          ].map((a, i) => {
            const op = ease(clamp01((t - a.delay) * 5));
            return (
              <polygon key={i} points={`${a.x-4},${a.y} ${a.x+4},${a.y} ${a.x},${a.y+8}`}
                fill={a.color} opacity={op} />
            );
          })}
          {/* Synthesize→Report: leftward arrow at Report's right edge */}
          <polygon points="166,353 166,361 158,357"
            fill={P.llm} opacity={ease(clamp01((t-0.58)*5))} />

          {/* Nodes */}
          {nodes.map((n, i) => {
            const op = ease(clamp01((t - 0.02 - i * 0.07) * 5));
            return (
              <g key={n.id} opacity={op}>
                <rect x={n.x} y={n.y} width={NW} height={NH} rx="7"
                  fill={n.color + "18"} stroke={n.color + "90"} strokeWidth="1.8" />
                <text x={n.x + NW/2} y={n.y + 14} textAnchor="middle" fill={n.color}
                  fontSize="9.5" fontWeight="700" fontFamily="'Inter',sans-serif">{n.label}</text>
                <text x={n.x + NW/2} y={n.y + 26} textAnchor="middle" fill={P.muted}
                  fontSize="7.5" fontFamily="'Inter',sans-serif">{n.sub}</text>
              </g>
            );
          })}

          {/* Edge labels */}
          {[
            { x: 430, y: 108, label: "pass ✓", color: P.ok,   op: ease(clamp01((t-0.28)*5)) },
            { x: 342, y: 138, label: "fail ✗",  color: P.warn, op: ease(clamp01((t-0.34)*5)) },
            { x: 430, y: 300, label: "pass ✓", color: P.ok,   op: ease(clamp01((t-0.52)*5)) },
            { x: 368, y: 200, label: "fail ✗",  color: P.warn, op: ease(clamp01((t-0.46)*5)) },
          ].map((lb, i) => (
            <text key={i} x={lb.x} y={lb.y} fill={lb.color} fontSize="8" fontWeight="700"
              fontFamily="'Inter',sans-serif" opacity={lb.op}>{lb.label}</text>
          ))}

          {/* Legend — x=170 keeps it right of Report (x=78-158), left of Synthesize (x=390) */}
          {ease(clamp01((t-0.8)*4)) > 0 && (
            <g opacity={ease(clamp01((t-0.8)*4))}>
              <rect x={170} y={286} width={200} height={110} rx="6" fill={P.surface} stroke={P.border} strokeWidth="1"/>
              <text x={180} y={304} fill={P.muted} fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">Legend</text>
              {[
                { color: P.ok,   dash: "",    label: "pass (quality met)" },
                { color: P.warn, dash: "5,3", label: "fail → retry loop"  },
                { color: P.llm,  dash: "",    label: "synthesis output"   },
                { color: P.dim,  dash: "",    label: "pipeline flow"      },
              ].map((l, i) => (
                <g key={i}>
                  <line x1={180} y1={321 + i*20} x2={210} y2={321 + i*20}
                    stroke={l.color} strokeWidth="2" strokeDasharray={l.dash || "none"} />
                  <text x={218} y={325 + i*20} fill={P.muted} fontSize="8"
                    fontFamily="'Inter',sans-serif">{l.label}</text>
                </g>
              ))}
            </g>
          )}
        </svg>
      );
    }

    // ── CHUNK & EMBED ────────────────────────────────────────────────────
    case "chunk_embed": {
      const tOp = ease(clamp01(t * 4));
      // LEFT: chunking (x: 18–268), RIGHT: embedding (x: 292–542)
      const divOp = ease(clamp01((t - 0.04) * 5));
      const chunkOp = ease(clamp01((t - 0.1) * 4));
      const embedOp = ease(clamp01((t - 0.5) * 4));
      const chunks = [
        { color: P.data,   label: "Chunk 1", sub: "Intro / abstract" },
        { color: P.chunk,  label: "Chunk 2", sub: "Methods section"  },
        { color: P.rag,    label: "Chunk 3", sub: "Results / data"   },
        { color: P.vector, label: "Chunk 4", sub: "Discussion"       },
        { color: P.llm,    label: "Chunk 5", sub: "Conclusions"      },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Nodes 1–3: Ingest → Chunk → Embed</text>
          {/* Divider */}
          <line x1={275} y1={35} x2={275} y2={415} stroke={P.border} strokeWidth="1" opacity={divOp} />
          {/* LEFT — chunking */}
          <text x={144} y={46} textAnchor="middle" fill={P.chunk} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={chunkOp}>Text Splitting</text>
          {/* Source doc */}
          <rect x={24} y={56} width={230} height={60} rx="6" fill={P.data + "12"}
            stroke={P.data + "50"} strokeWidth="1.5" opacity={chunkOp} />
          <text x={139} y={74} textAnchor="middle" fill={P.data} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={chunkOp}>Source Paper (PDF / HTML)</text>
          {[84,94,104].map((ly,i) => (
            <rect key={i} x={36} y={ly} width={lerp(130,190,(i%2))} height={4} rx="2"
              fill={P.data} opacity={chunkOp * 0.2} />
          ))}
          {/* Chunks */}
          {chunks.map((c, i) => {
            const op = ease(clamp01((chunkOp - 0.15 - i*0.12)*4));
            return (
              <g key={i} opacity={op}>
                <rect x={24} y={130 + i*52} width={230} height={42} rx="6"
                  fill={c.color + "14"} stroke={c.color + "60"} strokeWidth="1.5" />
                <text x={139} y={147 + i*52} textAnchor="middle" fill={c.color}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{c.label}</text>
                <text x={139} y={161 + i*52} textAnchor="middle" fill={P.muted}
                  fontSize="8" fontFamily="'Inter',sans-serif">{c.sub}</text>
              </g>
            );
          })}
          {/* Params box */}
          <rect x={24} y={395} width={230} height={20} rx="4" fill={P.surface}
            stroke={P.border} strokeWidth="1" opacity={chunkOp} />
          <text x={139} y={408} textAnchor="middle" fill={P.dim} fontSize="8"
            fontFamily="monospace" opacity={chunkOp}>chunk_size=1000  overlap=200  separator="\n\n"</text>

          {/* RIGHT — embedding */}
          <text x={408} y={46} textAnchor="middle" fill={P.vector} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={embedOp}>Vector Embedding</text>
          {/* Chunk → vector */}
          {[0,1,2].map(i => {
            const op = ease(clamp01((embedOp - i*0.15)*4));
            const cy = 70 + i*108;
            return (
              <g key={i} opacity={op}>
                <rect x={284} y={cy} width={70} height={36} rx="5"
                  fill={chunks[i].color+"14"} stroke={chunks[i].color+"60"} strokeWidth="1.2"/>
                <text x={319} y={cy+14} textAnchor="middle" fill={chunks[i].color}
                  fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Chunk {i+1}</text>
                <text x={319} y={cy+26} textAnchor="middle" fill={P.dim}
                  fontSize="7" fontFamily="'Inter',sans-serif">text</text>
                <line x1={354} y1={cy+18} x2={368} y2={cy+18} stroke={P.muted} strokeWidth="1.5"/>
                <polygon points={`368,${cy+14} 376,${cy+18} 368,${cy+22}`} fill={P.muted}/>
                <rect x={378} y={cy} width={152} height={36} rx="5"
                  fill={P.vector+"12"} stroke={P.vector+"50"} strokeWidth="1.2"/>
                <text x={454} y={cy+14} textAnchor="middle" fill={P.vector}
                  fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">[0.82, -0.31, 0.54…]</text>
                <text x={454} y={cy+26} textAnchor="middle" fill={P.dim}
                  fontSize="7" fontFamily="'Inter',sans-serif">1536-dim float32</text>
              </g>
            );
          })}
          {/* Dot-dot-dot */}
          <text x={454} y={365} textAnchor="middle" fill={P.dim} fontSize="16"
            fontFamily="'Inter',sans-serif" opacity={embedOp}>···</text>
          {/* FAISS note */}
          <rect x={284} y={378} width={246} height={36} rx="6"
            fill={P.rag+"14"} stroke={P.rag+"50"} strokeWidth="1.5" opacity={embedOp}/>
          <text x={407} y={393} textAnchor="middle" fill={P.rag} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={embedOp}>Indexed in FAISS</text>
          <text x={407} y={407} textAnchor="middle" fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={embedOp}>O(log n) cosine similarity search</text>
        </svg>
      );
    }

    // ── RETRIEVE & GRADE ─────────────────────────────────────────────────
    case "retrieve": {
      const tOp    = ease(clamp01(t * 4));
      const searchOp = ease(clamp01((t - 0.08) * 4));
      const gradeOp  = ease(clamp01((t - 0.45) * 4));
      const routeOp  = ease(clamp01((t - 0.72) * 4));
      const chunks = [
        { sim: 0.91, pass: true,  label: "Chunk 7",  snippet: "ZnTe bandgap: 2.26 eV at 300K" },
        { sim: 0.88, pass: true,  label: "Chunk 3",  snippet: "synthesis via PVD at 500°C"    },
        { sim: 0.79, pass: true,  label: "Chunk 12", snippet: "p-type doping with Cu"         },
        { sim: 0.61, pass: false, label: "Chunk 21", snippet: "historical context 1960s"      },
        { sim: 0.44, pass: false, label: "Chunk 5",  snippet: "unrelated crystal system"      },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Nodes 4–5: Retrieve → Grade (Quality Score #1)</text>

          {/* Query box */}
          <rect x={18} y={36} width={524} height={36} rx="6"
            fill={P.data+"14"} stroke={P.data+"60"} strokeWidth="1.5" opacity={searchOp}/>
          <text x={280} y={51} textAnchor="middle" fill={P.data} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={searchOp}>Query: "What is the bandgap and synthesis method for ZnTe?"</text>
          <text x={280} y={65} textAnchor="middle" fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={searchOp}>→ embedded to 1536-d vector → FAISS search → top-5 chunks ranked by cosine similarity</text>

          {/* Retrieved chunks with scores */}
          <text x={18} y={96} fill={P.rag} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={gradeOp}>Retrieved chunks → Grade relevance (threshold = 0.70)</text>
          {chunks.map((c, i) => {
            const op = ease(clamp01((gradeOp - i*0.12)*5));
            const barW = c.sim * 160;
            return (
              <g key={i} opacity={op}>
                <rect x={18} y={110+i*56} width={524} height={46} rx="6"
                  fill={c.pass ? P.ok+"0a" : P.warn+"0a"}
                  stroke={c.pass ? P.ok+"40" : P.warn+"35"} strokeWidth="1.5"/>
                {/* Label */}
                <text x={30} y={127+i*56} fill={c.pass ? P.ok : P.warn}
                  fontSize="8.5" fontWeight="700" fontFamily="'Inter',sans-serif">{c.label}</text>
                {/* Snippet */}
                <text x={30} y={143+i*56} fill={P.muted}
                  fontSize="8" fontFamily="'Inter',sans-serif">"{c.snippet}"</text>
                {/* Score bar */}
                <rect x={340} y={117+i*56} width={160} height={8} rx="4" fill={P.dim} opacity={0.3}/>
                <rect x={340} y={117+i*56} width={barW} height={8} rx="4"
                  fill={c.pass ? P.ok : P.warn} opacity={0.8}/>
                <text x={508} y={126+i*56} fill={c.pass ? P.ok : P.warn}
                  fontSize="9" fontWeight="700" fontFamily="monospace">sim={c.sim.toFixed(2)}</text>
                {/* Pass/Fail badge */}
                <text x={542} y={143+i*56} textAnchor="end" fill={c.pass ? P.ok : P.warn}
                  fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">
                  {c.pass ? "✓ PASS → context" : "✗ FAIL → discard"}
                </text>
              </g>
            );
          })}

          {/* Routing summary */}
          <rect x={18} y={398} width={524} height={18} rx="4"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={routeOp}/>
          <text x={280} y={411} textAnchor="middle" fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={routeOp}>
            Grade score = cosine_sim(query_vec, chunk_vec) · 3 chunks pass (≥0.70) → sent to Generate · 2 discarded
          </text>
        </svg>
      );
    }

    // ── GENERATE & VERIFY ────────────────────────────────────────────────
    case "generate": {
      const tOp     = ease(clamp01(t * 4));
      const genOp   = ease(clamp01((t - 0.08) * 4));
      const checkOp = ease(clamp01((t - 0.45) * 4));
      const routeOp = ease(clamp01((t - 0.75) * 4));
      // Sentence grounding matrix
      const sentences = [
        { text: '"ZnTe has a direct bandgap of 2.26 eV."',           score: 0.94, grounded: true  },
        { text: '"Synthesis via physical vapor deposition at 500°C."', score: 0.87, grounded: true  },
        { text: '"p-type behavior from Cu substitution on Zn sites."', score: 0.81, grounded: true  },
        { text: '"Device efficiency exceeds 25%."',                    score: 0.23, grounded: false },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Node 6: Generate · Node 7: Quality (Score #2)</text>

          {/* LLM input */}
          <rect x={18} y={36} width={524} height={46} rx="6"
            fill={P.agent+"10"} stroke={P.agent+"50"} strokeWidth="1.5" opacity={genOp}/>
          <text x={280} y={53} textAnchor="middle" fill={P.agent} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={genOp}>Prompt → LLM (GPT-4 / Llama)</text>
          <text x={280} y={67} textAnchor="middle" fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={genOp}>
            System: "Answer using ONLY the provided context. Cite chunk IDs."  |  Context: 3 graded chunks
          </text>

          {/* Groundedness check header */}
          <text x={18} y={102} fill={P.warn} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={checkOp}>
            Quality Check: Sentence-level Groundedness (threshold = 0.75)
          </text>
          <text x={18} y={116} fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={checkOp}>
            Each answer sentence is re-embedded and compared to retrieved chunks. Low similarity = hallucination.
          </text>

          {/* Sentence rows */}
          {sentences.map((s, i) => {
            const op = ease(clamp01((checkOp - i*0.12)*4));
            const barW = s.score * 200;
            return (
              <g key={i} opacity={op}>
                <rect x={18} y={128+i*60} width={524} height={50} rx="6"
                  fill={s.grounded ? P.ok+"08" : P.warn+"08"}
                  stroke={s.grounded ? P.ok+"40" : P.warn+"40"} strokeWidth="1.5"/>
                <text x={30} y={146+i*60} fill={s.grounded ? P.ok : P.warn}
                  fontSize="8.5" fontFamily="'Inter',sans-serif">{s.text}</text>
                {/* Score bar */}
                <rect x={30} y={155+i*60} width={200} height={8} rx="4" fill={P.dim} opacity={0.3}/>
                <rect x={30} y={155+i*60} width={barW} height={8} rx="4"
                  fill={s.grounded ? P.ok : P.warn} opacity={0.75}/>
                <text x={240} y={163+i*60} fill={s.grounded ? P.ok : P.warn}
                  fontSize="8.5" fontWeight="700" fontFamily="monospace">
                  ground={s.score.toFixed(2)}
                </text>
                <text x={400} y={163+i*60} fill={s.grounded ? P.ok : P.warn}
                  fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">
                  {s.grounded ? "✓ cited in context" : "✗ hallucination → retry generate"}
                </text>
              </g>
            );
          })}

          {/* Overall quality score */}
          <rect x={18} y={375} width={524} height={38} rx="6"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={routeOp}/>
          <text x={280} y={390} textAnchor="middle" fill={P.muted} fontSize="8.5"
            fontFamily="'Inter',sans-serif" opacity={routeOp}>
            Overall groundedness = avg(sentence scores) = 0.71 · Threshold 0.75 NOT met → retry generation
          </text>
          <text x={280} y={406} textAnchor="middle" fill={P.warn} fontSize="8.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={routeOp}>
            Route: Quality FAIL → regenerate with stricter prompt ("cite specific chunk IDs only")
          </text>
        </svg>
      );
    }

    // ── UNCERTAINTY ROUTING ───────────────────────────────────────────────
    case "uncertainty": {
      const tOp     = ease(clamp01(t * 4));
      const srcOp   = ease(clamp01((t - 0.08) * 4));
      const calcOp  = ease(clamp01((t - 0.35) * 4));
      const routeOp = ease(clamp01((t - 0.6)  * 4));
      const outOp   = ease(clamp01((t - 0.8)  * 4));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>
            Single-Paper Uncertainty: Eg = 2.30 eV from 1 Source
          </text>

          {/* ① Single paper found */}
          <text x={18} y={46} fill={P.chunk} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={srcOp}>① Only 1 paper found for query "ZnTe bandgap"</text>
          <rect x={18} y={52} width={524} height={40} rx="6"
            fill={P.ok+"0c"} stroke={P.ok+"50"} strokeWidth="1.5" opacity={srcOp}/>
          <text x={28} y={69} fill={P.ok} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={srcOp}>Paper A</text>
          <text x={90} y={69} fill={P.ink} fontSize="9.5" fontWeight="800"
            fontFamily="monospace" opacity={srcOp}>Eg = 2.30 eV</text>
          <text x={220} y={69} fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={srcOp}>sim = 0.91 · groundedness = 0.87</text>
          <text x={28} y={84} fill={P.warn} fontSize="8" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={srcOp}>σ = UNKNOWN — cannot compute std dev from n=1 paper</text>

          {/* ② Confidence breakdown */}
          <text x={18} y={110} fill={P.chunk} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={calcOp}>② Confidence score — source-count penalty hurts single paper</text>

          {/* Left: component breakdown */}
          <rect x={18} y={116} width={252} height={110} rx="7"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={calcOp}/>
          {[
            { term: "α · groundedness", val: "0.5 × 0.87", result: "= 0.435", c: P.ok   },
            { term: "β · sim",          val: "0.3 × 0.91", result: "= 0.273", c: P.rag  },
            { term: "γ · f(n=1)",       val: "0.2 × 0.50", result: "= 0.100", c: P.warn },
          ].map((row, i) => (
            <g key={i} opacity={calcOp}>
              <text x={28}  y={133+i*26} fill={P.muted} fontSize="7.5" fontFamily="'Inter',sans-serif">{row.term}</text>
              <text x={155} y={133+i*26} fill={row.c}   fontSize="8"   fontFamily="monospace">{row.val}</text>
              <text x={215} y={133+i*26} fill={row.c}   fontSize="8"   fontFamily="monospace" fontWeight="700">{row.result}</text>
            </g>
          ))}
          <line x1={28} y1={207} x2={258} y2={207} stroke={P.border} strokeWidth="1" opacity={calcOp}/>
          <text x={28}  y={220} fill={P.muted} fontSize="8" fontFamily="'Inter',sans-serif" opacity={calcOp}>Total conf</text>
          <text x={105} y={220} fill={P.data}  fontSize="9.5" fontWeight="900" fontFamily="monospace" opacity={calcOp}>= 0.808 → MEDIUM</text>

          {/* Right: f(n) explanation */}
          <rect x={282} y={116} width={260} height={110} rx="7"
            fill={P.warn+"0e"} stroke={P.warn+"40"} strokeWidth="1.2" opacity={calcOp}/>
          <text x={412} y={132} textAnchor="middle" fill={P.warn} fontSize="8.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={calcOp}>Source-count penalty f(n)</text>
          {[
            { n: "n = 1", fn: "0.50", note: "← single paper (you are here)" },
            { n: "n = 2", fn: "0.75", note: "two independent sources"        },
            { n: "n ≥ 3", fn: "0.90", note: "multi-paper consensus"          },
          ].map((row, i) => (
            <g key={i} opacity={calcOp}>
              <text x={292} y={148+i*22} fill={i===0 ? P.warn : P.muted} fontSize="8"
                fontFamily="monospace" fontWeight={i===0 ? "700" : "400"}>{row.n}  f={row.fn}  {row.note}</text>
            </g>
          ))}
          <text x={412} y={215} textAnchor="middle" fill={P.muted} fontSize="7.5"
            fontFamily="'Inter',sans-serif" opacity={calcOp}>
            Even with high sim+ground, n=1 caps confidence ≤ 0.85
          </text>

          {/* ③ Route */}
          <text x={18} y={242} fill={P.chunk} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={routeOp}>③ Route by confidence</text>
          {[
            { label: "LOW",    range: "< 0.60",    color: P.warn, x: 18,  w: 158, active: false },
            { label: "MEDIUM", range: "0.60–0.85", color: P.data, x: 188, w: 184, active: true  },
            { label: "HIGH",   range: "≥ 0.85",    color: P.ok,   x: 384, w: 158, active: false },
          ].map((lane, i) => {
            const op = ease(clamp01((routeOp - i*0.08)*5));
            return (
              <g key={i} opacity={op}>
                <rect x={lane.x} y={248} width={lane.w} height={48} rx="7"
                  fill={lane.active ? lane.color+"28" : lane.color+"0c"}
                  stroke={lane.color+(lane.active ? "99" : "35")} strokeWidth={lane.active ? 2 : 1.2}/>
                <text x={lane.x+lane.w/2} y={266} textAnchor="middle" fill={lane.color}
                  fontSize="9" fontWeight="800" fontFamily="'Inter',sans-serif">{lane.label}</text>
                <text x={lane.x+lane.w/2} y={279} textAnchor="middle" fill={P.muted}
                  fontSize="7.5" fontFamily="'Inter',sans-serif">{lane.range}</text>
                {lane.active && (
                  <text x={lane.x+lane.w/2} y={291} textAnchor="middle" fill={lane.color}
                    fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">◀ conf=0.808</text>
                )}
              </g>
            );
          })}

          {/* Output */}
          <rect x={18} y={308} width={524} height={98} rx="7"
            fill={P.data+"10"} stroke={P.data+"50"} strokeWidth="1.5" opacity={outOp}/>
          <text x={280} y={326} textAnchor="middle" fill={P.data} fontSize="10" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={outOp}>Output (MEDIUM — single source)</text>
          {[
            { label: "Value",      val: "Eg = 2.30 eV  [Paper A, Chunk 7]",              c: P.ink  },
            { label: "Uncertainty",val: "σ = unknown (n=1) — no cross-paper σ available", c: P.warn },
            { label: "Confidence", val: "0.808  (penalized by f(n=1)=0.50)",              c: P.data },
            { label: "Note",       val: "\"Single source — further verification recommended\"", c: P.muted },
          ].map((r, i) => (
            <g key={i} opacity={outOp}>
              <text x={28}  y={341+i*16} fill={P.muted} fontSize="7.5" fontFamily="'Inter',sans-serif">{r.label}:</text>
              <text x={100} y={341+i*16} fill={r.c}     fontSize="7.5" fontFamily="monospace">{r.val}</text>
            </g>
          ))}
        </svg>
      );
    }

    // ── SYNTHESIS RECIPE ─────────────────────────────────────────────────
    case "synthesis": {
      const tOp      = ease(clamp01(t * 4));
      const extractOp = ease(clamp01((t - 0.08) * 3));
      const aggOp    = ease(clamp01((t - 0.4) * 3));
      const recipeOp = ease(clamp01((t - 0.65) * 3));
      // Extracted fields from 3 papers
      const papers = [
        { id: "Paper A", fields: ["material: ZnTe", "Tsynth: 490–510°C", "precursor: ZnI₂ + Te", "atm: N₂"] },
        { id: "Paper B", fields: ["material: ZnTe", "Tsynth: 500°C",     "precursor: Zn + Te", "atm: Ar"   ] },
        { id: "Paper C", fields: ["material: ZnTe", "Tsynth: 505°C",     "precursor: ZnI₂ + Te", "Eg: 2.26 eV"] },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Node 8: Synthesize — Recipe Extraction & Aggregation</text>

          {/* Step labels */}
          <text x={18}  y={44} fill={P.chunk} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={extractOp}>① Extract from each paper</text>
          <text x={300} y={44} fill={P.llm}   fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={recipeOp}>② Aggregate → Synthesis Recipe</text>
          <line x1={280} y1={35} x2={280} y2={300} stroke={P.border} strokeWidth="1" opacity={tOp}/>

          {/* Paper extraction boxes */}
          {papers.map((p, i) => {
            const op = ease(clamp01((extractOp - i*0.15)*4));
            return (
              <g key={i} opacity={op}>
                <rect x={18} y={54+i*80} width={246} height={70} rx="6"
                  fill={P.chunk+"10"} stroke={P.chunk+"50"} strokeWidth="1.5"/>
                <text x={30} y={69+i*80} fill={P.chunk} fontSize="8.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{p.id}</text>
                {p.fields.map((f, fi) => (
                  <text key={fi} x={30} y={82+i*80+fi*12} fill={P.muted}
                    fontSize="7.5" fontFamily="monospace">· {f}</text>
                ))}
              </g>
            );
          })}

          {/* Aggregation arrow */}
          <g opacity={aggOp}>
            <line x1={144} y1={298} x2={144} y2={320} stroke={P.llm} strokeWidth="2"/>
            <polygon points="140,320 148,320 144,328" fill={P.llm}/>
            <text x={144} y={310} textAnchor="middle" fill={P.muted} fontSize="7.5"
              fontFamily="'Inter',sans-serif"></text>
          </g>
          <rect x={18} y={330} width={246} height={80} rx="6"
            fill={P.llm+"10"} stroke={P.llm+"50"} strokeWidth="1.5" opacity={aggOp}/>
          <text x={139} y={346} textAnchor="middle" fill={P.llm} fontSize="9" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={aggOp}>Aggregated Parameters</text>
          {[
            "Tsynth: 500 ± 8°C  (n=3)",
            "Precursor: ZnI₂ + Te  (2/3 papers)",
            "Atmosphere: N₂ or Ar (inert)",
          ].map((f, i) => (
            <text key={i} x={30} y={360+i*14} fill={P.muted}
              fontSize="8" fontFamily="monospace" opacity={aggOp}>· {f}</text>
          ))}

          {/* Generated recipe */}
          <rect x={288} y={54} width={254} height={250} rx="8"
            fill={P.surface} stroke={P.llm+"60"} strokeWidth="1.5" opacity={recipeOp}/>
          <rect x={288} y={54} width={254} height={26} rx="7"
            fill={P.llm+"25"} stroke="none" opacity={recipeOp}/>
          <text x={415} y={71} textAnchor="middle" fill={P.llm} fontSize="9.5" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={recipeOp}>Generated Synthesis Recipe</text>
          {[
            { label: "Material",   val: "ZnTe (II-VI semiconductor)"    },
            { label: "Eg",         val: "2.26 eV (direct, Γ point)"     },
            { label: "Precursors", val: "ZnI₂ (99.9%) + Te (99.999%)"  },
            { label: "T_synth",    val: "500 ± 8°C"                     },
            { label: "Atmosphere", val: "N₂ or Ar (inert, 1 atm)"      },
            { label: "Duration",   val: "2–4 h (PVD)"                   },
            { label: "Dopant",     val: "Cu (p-type, Zn-site subst.)"  },
            { label: "Confidence", val: "HIGH (0.89) · 3 sources"       },
          ].map((f, i) => (
            <g key={i} opacity={recipeOp}>
              <text x={298} y={94+i*25} fill={P.rag} fontSize="8" fontWeight="700"
                fontFamily="monospace">{f.label}:</text>
              <text x={370} y={94+i*25} fill={P.muted} fontSize="8"
                fontFamily="monospace">{f.val}</text>
            </g>
          ))}

          {/* Uncertainty note */}
          <rect x={288} y={316} width={254} height={44} rx="6"
            fill={P.data+"10"} stroke={P.data+"40"} strokeWidth="1.2" opacity={recipeOp}/>
          <text x={415} y={332} textAnchor="middle" fill={P.data} fontSize="8.5" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={recipeOp}>Uncertainty Ranges</text>
          <text x={415} y={348} textAnchor="middle" fill={P.muted} fontSize="7.5"
            fontFamily="'Inter',sans-serif" opacity={recipeOp}>
            T_synth σ=8°C from 3 papers · atmosphere ambiguous (stated)
          </text>

        </svg>
      );
    }

    // ── BATCH PROCESSING ─────────────────────────────────────────────────
    case "batch": {
      const tOp   = ease(clamp01(t * 4));
      const gridOp = ease(clamp01((t - 0.08) * 4));
      const statOp = ease(clamp01((t - 0.7) * 4));
      const total = 20;
      const doneCount = Math.floor(t * total * 1.3);
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="15" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Batch Mode: 500 Papers Through the Full Pipeline</text>

          {/* Document grid: 5 cols × 4 rows */}
          {Array.from({ length: total }).map((_, i) => {
            const col = i % 5, row = Math.floor(i / 5);
            const dx = 26 + col * 106, dy = 36 + row * 76;
            const isDone = i < doneCount;
            const isActive = i === doneCount;
            const op = ease(clamp01((gridOp - i*0.03)*5));
            const color = isDone ? P.ok : isActive ? P.data : P.dim;
            return (
              <g key={i} opacity={op}>
                <rect x={dx} y={dy} width={86} height={62} rx="7"
                  fill={color + "12"} stroke={color + "60"} strokeWidth="1.5"/>
                {[8,18,28,38].map((ly, li) => (
                  <rect key={li} x={dx+8} y={dy+ly} width={lerp(40,66,(li%2))} height={5}
                    rx="2" fill={color} opacity={0.18}/>
                ))}
                <text x={dx+43} y={dy+56} textAnchor="middle" fill={color}
                  fontSize="8" fontFamily="'Inter',sans-serif">
                  {isDone ? "✓" : isActive ? "..." : `#${i+1}`}
                </text>
              </g>
            );
          })}

          {/* Pipeline mini diagram */}
          <rect x={18} y={352} width={524} height={62} rx="8"
            fill={P.surface} stroke={P.border} strokeWidth="1" opacity={statOp}/>
          <text x={280} y={370} textAnchor="middle" fill={P.muted} fontSize="9"
            fontFamily="'Inter',sans-serif" opacity={statOp}>Each paper: Ingest → Chunk → Embed → Retrieve → Grade → Generate → Quality → Synthesize → Report</text>
          {[
            { x:80,  val:"500",   label:"papers/run",      color:P.data  },
            { x:200, val:"~42",   label:"chunks/paper",    color:P.chunk },
            { x:310, val:"0.70",  label:"grade threshold", color:P.rag   },
            { x:415, val:"0.75",  label:"quality threshold",color:P.warn },
            { x:510, val:"JSON",  label:"recipe output",   color:P.llm   },
          ].map((s, i) => (
            <g key={i} opacity={statOp}>
              <text x={s.x} y={392} textAnchor="middle" fill={s.color}
                fontSize="13" fontWeight="900" fontFamily="'Inter',sans-serif">{s.val}</text>
              <text x={s.x} y={406} textAnchor="middle" fill={P.muted}
                fontSize="7.5" fontFamily="'Inter',sans-serif">{s.label}</text>
            </g>
          ))}
        </svg>
      );
    }

    // ── FINALE ────────────────────────────────────────────────────────────
    case "finale": {
      const tOp  = ease(clamp01(t * 3));
      const c1Op = ease(clamp01((t - 0.15) * 3));
      const c2Op = ease(clamp01((t - 0.3) * 3));
      const c3Op = ease(clamp01((t - 0.45) * 3));
      const nOp  = ease(clamp01((t - 0.65) * 3));
      const cols = [
        {
          title: "Retrieval Layer",
          color: P.rag,
          op: c1Op, x: 18,
          items: ["Chunk (1000 tok, 200 overlap)", "1536-d OpenAI embeddings", "FAISS cosine search (k=5)", "Grade: sim ≥ 0.70 → pass"],
        },
        {
          title: "Agent Loop",
          color: P.agent,
          op: c2Op, x: 200,
          items: ["Generate with graded context", "Groundedness check ≥ 0.75", "Retry: stricter cite-only prompt", "Confidence 3-way routing"],
        },
        {
          title: "Synthesis Output",
          color: P.llm,
          op: c3Op, x: 382,
          items: ["Extract: material / T / precursor", "Aggregate across papers", "Uncertainty ranges (σ)", "JSON recipe → database"],
        },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={26} textAnchor="middle" fill={P.ink} fontSize="17" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={tOp}>Complete LangGraph Pipeline</text>
          <rect x={(W - ease(clamp01(t*3))*260)/2} y={34} width={ease(clamp01(t*3))*260} height={3}
            rx="1.5" fill={P.rag} opacity={tOp*0.8}/>

          {cols.map((col) => (
            <g key={col.title} opacity={col.op}>
              <rect x={col.x} y={48} width={162} height={220} rx="8"
                fill={col.color + "0e"} stroke={col.color + "50"} strokeWidth="1.5"/>
              <rect x={col.x} y={48} width={162} height={26} rx="7"
                fill={col.color + "28"} stroke="none"/>
              <text x={col.x+81} y={64} textAnchor="middle" fill={col.color}
                fontSize="10" fontWeight="800" fontFamily="'Inter',sans-serif">{col.title}</text>
              {col.items.map((item, i) => (
                <g key={i}>
                  <circle cx={col.x+14} cy={88+i*38} r={3} fill={col.color} opacity={0.7}/>
                  <text x={col.x+22} y={92+i*38} fill={P.muted}
                    fontSize="8.5" fontFamily="'Inter',sans-serif">{item}</text>
                </g>
              ))}
            </g>
          ))}

          {/* Key numbers */}
          <g opacity={nOp}>
            <rect x={18} y={285} width={524} height={115} rx="8"
              fill={P.surface} stroke={P.border} strokeWidth="1"/>
            {[
              { x:100, val:"10",    label:"pipeline nodes",     color:P.agent },
              { x:210, val:"0.70",  label:"grade threshold",    color:P.rag   },
              { x:320, val:"0.75",  label:"quality threshold",  color:P.warn  },
              { x:430, val:"3-way", label:"uncertainty routing",color:P.data  },
              { x:520, val:"σ",     label:"recipe uncertainty", color:P.llm   },
            ].map((s) => (
              <g key={s.x}>
                <text x={s.x} y={318} textAnchor="middle" fill={s.color}
                  fontSize="17" fontWeight="900" fontFamily="'Inter',sans-serif">{s.val}</text>
                <text x={s.x} y={334} textAnchor="middle" fill={P.muted}
                  fontSize="7.5" fontFamily="'Inter',sans-serif">{s.label}</text>
              </g>
            ))}
            <text x={W/2} y={364} textAnchor="middle" fill={P.muted} fontSize="9"
              fontFamily="'Inter',sans-serif">
              Grounded · Self-correcting · Uncertainty-aware · Synthesis-ready
            </text>
            <text x={W/2} y={384} textAnchor="middle" fill={P.dim} fontSize="8.5"
              fontFamily="'Inter',sans-serif">
              Habibur Rahman · rahma103@purdue.edu · Purdue University
            </text>
          </g>
        </svg>
      );
    }

    // ── PYTHON CODE WALKTHROUGH ───────────────────────────────────────────
    case "code_walk": {
      // Split layout: LEFT = code (x 12-262), RIGHT = diagram (x 270-546)
      const CX = 12, CW = 250, DX = 270, DW = 276;
      const PY = 58, PH = 330; // panel y & height
      const LH = 19;
      const lc = (ln) => {
        if (!ln || ln.trim()==="") return P.muted;
        if (ln.trimStart().startsWith("#")) return "#5a6882";
        if (ln.startsWith("from ")||ln.startsWith("import ")) return P.chunk;
        return P.ink;
      };
      // arrow helper
      const arr = (x1,y1,x2,y2,col) => [
        <line key="l" x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth="1.5"/>,
        <polygon key="p" points={`${x2-4},${y2-4} ${x2+4},${y2-4} ${x2},${y2+4}`} fill={col}/>,
      ];
      const arrR = (x1,y1,x2,col) => [
        <line key="l" x1={x1} y1={y1} x2={x2} y2={y1} stroke={col} strokeWidth="1.5"/>,
        <polygon key="p" points={`${x2-5},${y1-4} ${x2-5},${y1+4} ${x2+1},${y1}`} fill={col}/>,
      ];

      const steps = [
        {
          label: "① Load & Chunk the PDF",
          color: P.chunk,
          lines: [
            `from langchain.document_loaders import PyPDFLoader`,
            `from langchain.text_splitter import (`,
            `    RecursiveCharacterTextSplitter`,
            `)`,
            ``,
            `loader = PyPDFLoader("ZnTe_synthesis.pdf")`,
            `docs   = loader.load()`,
            ``,
            `splitter = RecursiveCharacterTextSplitter(`,
            `    chunk_size=1000, chunk_overlap=200`,
            `)`,
            `chunks = splitter.split_documents(docs)`,
            `# ▶  42 chunks · avg 820 tokens`,
          ],
          note: "28-page PDF → 42 overlapping text windows",
          diagram: (op, lt) => {
            const chunks = [0,1,2,3,4];
            return (
              <g opacity={op}>
                {/* PDF box */}
                <rect x={DX+10} y={PY+20} width={56} height={72} rx="5"
                  fill={P.chunk+"18"} stroke={P.chunk} strokeWidth="1.5"/>
                <text x={DX+38} y={PY+52} textAnchor="middle" fill={P.chunk}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">PDF</text>
                <text x={DX+38} y={PY+66} textAnchor="middle" fill={P.muted}
                  fontSize="7" fontFamily="'Inter',sans-serif">28 pages</text>
                <text x={DX+38} y={PY+84} textAnchor="middle" fill={P.muted}
                  fontSize="6.5" fontFamily="'Inter',sans-serif">ZnTe_synthesis</text>
                {/* arrow to splitter */}
                {arrR(DX+66, PY+56, DX+110, P.chunk)}
                {/* splitter box */}
                <rect x={DX+110} y={PY+38} width={62} height={36} rx="5"
                  fill={P.surface} stroke={P.chunk+"80"} strokeWidth="1.2"/>
                <text x={DX+141} y={PY+54} textAnchor="middle" fill={P.chunk}
                  fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">Splitter</text>
                <text x={DX+141} y={PY+66} textAnchor="middle" fill={P.muted}
                  fontSize="6.5" fontFamily="'Inter',sans-serif">size=1000</text>
                {/* arrow to chunks */}
                {arrR(DX+172, PY+56, DX+196, P.chunk)}
                {/* chunk stack */}
                {chunks.map((_, i) => {
                  const op2 = ease(clamp01((lt - i*0.1)*6));
                  return (
                    <g key={i} opacity={op2}>
                      <rect x={DX+196} y={PY+18+i*28} width={72} height={22} rx="4"
                        fill={P.chunk+(i===0?"30":"15")} stroke={P.chunk+(i===0?"99":"40")} strokeWidth="1"/>
                      <text x={DX+232} y={PY+32+i*28} textAnchor="middle" fill={P.chunk}
                        fontSize="7" fontFamily="monospace">chunk {i===0?"7":i===1?"12":i===2?"3":i===3?"…":"42"}</text>
                    </g>
                  );
                })}
                {/* labels */}
                <text x={DX+10} y={PY+106} fill={P.muted} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">overlap = 200 tokens</text>
                <text x={DX+10} y={PY+118} fill={P.muted} fontSize="7.5"
                  fontFamily="'Inter',sans-serif">→ context preserved across chunks</text>
                {/* example chunk detail — pushed below chunk stack */}
                <rect x={DX+10} y={PY+175} width={DW-20} height={60} rx="5"
                  fill={P.surface} stroke={P.border} strokeWidth="1"/>
                <text x={DX+18} y={PY+189} fill={P.chunk} fontSize="7.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Chunk 7 (example):</text>
                <text x={DX+18} y={PY+203} fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif">"The bandgap of ZnTe was measured at</text>
                <text x={DX+18} y={PY+215} fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif"> 2.30 eV using UV-Vis spectroscopy…"</text>
                <text x={DX+18} y={PY+227} fill={P.dim} fontSize="6.5"
                  fontFamily="'Inter',sans-serif">source: page 7 · 847 tokens</text>
              </g>
            );
          },
        },
        {
          label: "② Embed Chunks & Store in FAISS",
          color: P.rag,
          lines: [
            `from langchain.embeddings import OpenAIEmbeddings`,
            `from langchain.vectorstores import FAISS`,
            ``,
            `embedder = OpenAIEmbeddings(`,
            `    model="text-embedding-3-small"`,
            `)`,
            `# each chunk → 1536-d float vector`,
            ``,
            `db = FAISS.from_documents(chunks, embedder)`,
            `db.save_local("faiss_index")`,
            ``,
            `# ▶  42 vectors · cosine similarity index`,
          ],
          note: "1536-d space — each chunk becomes a point in vector space",
          diagram: (op, lt) => (
            <g opacity={op}>
              {/* chunk */}
              <rect x={DX+8} y={PY+28} width={60} height={30} rx="5"
                fill={P.chunk+"20"} stroke={P.chunk} strokeWidth="1.2"/>
              <text x={DX+38} y={PY+47} textAnchor="middle" fill={P.chunk}
                fontSize="8" fontWeight="700" fontFamily="monospace">chunk</text>
              {/* arrow to model */}
              {arrR(DX+68, PY+43, DX+100, P.rag)}
              {/* embedding model */}
              <ellipse cx={DX+132} cy={PY+43} rx={30} ry={22}
                fill={P.rag+"18"} stroke={P.rag} strokeWidth="1.5"/>
              <text x={DX+132} y={PY+40} textAnchor="middle" fill={P.rag}
                fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">OpenAI</text>
              <text x={DX+132} y={PY+52} textAnchor="middle" fill={P.rag}
                fontSize="6.5" fontFamily="'Inter',sans-serif">embed</text>
              {/* arrow to vector */}
              {arrR(DX+162, PY+43, DX+188, P.rag)}
              {/* vector bar */}
              <rect x={DX+188} y={PY+30} width={78} height={26} rx="4"
                fill={P.vector+"18"} stroke={P.vector} strokeWidth="1.2"/>
              <text x={DX+227} y={PY+41} textAnchor="middle" fill={P.vector}
                fontSize="7" fontFamily="monospace">1536-d</text>
              <text x={DX+227} y={PY+51} textAnchor="middle" fill={P.muted}
                fontSize="6.5" fontFamily="monospace">[0.12, -0.34…]</text>
              {/* FAISS cylinder */}
              <rect x={DX+100} y={PY+88} width={80} height={50} rx="4"
                fill={P.rag+"15"} stroke={P.rag+"80"} strokeWidth="1.5"/>
              <ellipse cx={DX+140} cy={PY+88} rx={40} ry={8}
                fill={P.rag+"30"} stroke={P.rag} strokeWidth="1.2"/>
              <ellipse cx={DX+140} cy={PY+138} rx={40} ry={8}
                fill={P.rag+"20"} stroke={P.rag+"60"} strokeWidth="1"/>
              <text x={DX+140} y={PY+116} textAnchor="middle" fill={P.rag}
                fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">FAISS</text>
              <text x={DX+140} y={PY+130} textAnchor="middle" fill={P.muted}
                fontSize="7" fontFamily="'Inter',sans-serif">42 vectors</text>
              {/* arrow down to FAISS */}
              <line x1={DX+140} y1={PY+65} x2={DX+140} y2={PY+80} stroke={P.rag} strokeWidth="1.5"/>
              <polygon points={`${DX+135},${PY+80} ${DX+145},${PY+80} ${DX+140},${PY+88}`} fill={P.rag}/>
              {/* cosine search label */}
              <rect x={DX+8} y={PY+155} width={DW-18} height={38} rx="5"
                fill={P.surface} stroke={P.border} strokeWidth="1"/>
              <text x={DX+16} y={PY+169} fill={P.rag} fontSize="7.5" fontWeight="700"
                fontFamily="'Inter',sans-serif">Cosine similarity search:</text>
              <text x={DX+16} y={PY+181} fill={P.muted} fontSize="7"
                fontFamily="monospace">sim(q, c) = (q · c) / (|q| · |c|)</text>
              <text x={DX+16} y={PY+188} fill={P.dim} fontSize="6.5"
                fontFamily="'Inter',sans-serif">returns k nearest vectors to query</text>
            </g>
          ),
        },
        {
          label: "③ Retrieve & Grade (cosine ≥ 0.70)",
          color: P.llm,
          lines: [
            `query = "bandgap of ZnTe?"`,
            `results = db.similarity_search_with_score(`,
            `    query, k=5`,
            `)`,
            ``,
            `graded = []`,
            `for chunk, sim in results:`,
            `    if sim >= 0.70:`,
            `        graded.append(chunk)`,
            `    # else: discard`,
            ``,
            `# 3/5 passed · top sim = 0.91`,
          ],
          note: "Low-sim chunks never reach the LLM → fewer hallucinations",
          diagram: (op, lt) => {
            const results = [
              { label:"Chunk 7",  sim:0.91, pass:true  },
              { label:"Chunk 12", sim:0.83, pass:true  },
              { label:"Chunk 3",  sim:0.74, pass:true  },
              { label:"Chunk 18", sim:0.62, pass:false },
              { label:"Chunk 31", sim:0.55, pass:false },
            ];
            const bw = 160;
            return (
              <g opacity={op}>
                <text x={DX+8} y={PY+24} fill={P.muted} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">FAISS top-5 results — grade filter</text>
                {/* threshold line — between pass/fail rows */}
                <line x1={DX+8} y1={PY+105} x2={DX+DW-10} y2={PY+105}
                  stroke={P.warn} strokeWidth="1.2" strokeDasharray="4,3"/>
                <text x={DX+DW-12} y={PY+100} textAnchor="end" fill={P.warn}
                  fontSize="7" fontFamily="'Inter',sans-serif">threshold 0.70</text>
                {results.map((r, i) => {
                  const barOp = ease(clamp01((lt - i*0.12)*6));
                  const barW  = r.sim * bw;
                  const ry    = PY + 36 + i * 24;
                  const col   = r.pass ? P.ok : P.warn;
                  return (
                    <g key={i} opacity={barOp}>
                      <text x={DX+8} y={ry+12} fill={P.muted} fontSize="7.5"
                        fontFamily="monospace">{r.label}</text>
                      <rect x={DX+70} y={ry+2} width={barW} height={14} rx="3"
                        fill={col+"30"} stroke={col+"70"} strokeWidth="1"/>
                      <text x={DX+74+barW} y={ry+12} fill={col} fontSize="7.5"
                        fontFamily="monospace">{r.sim.toFixed(2)}</text>
                      <text x={DX+DW-12} y={ry+12} textAnchor="end" fill={col}
                        fontSize="7" fontWeight="700" fontFamily="'Inter',sans-serif">
                        {r.pass ? "✓ PASS" : "✗ FAIL"}
                      </text>
                    </g>
                  );
                })}
                {/* context box */}
                <rect x={DX+8} y={PY+160} width={DW-18} height={38} rx="5"
                  fill={P.ok+"10"} stroke={P.ok+"50"} strokeWidth="1" opacity={ease(clamp01((lt-0.6)*4))}/>
                <text x={DX+16} y={PY+174} fill={P.ok} fontSize="7.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif" opacity={ease(clamp01((lt-0.6)*4))}>3 chunks → LLM context window</text>
                <text x={DX+16} y={PY+187} fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif" opacity={ease(clamp01((lt-0.65)*4))}>Chunk 7 (0.91) · Chunk 12 (0.83) · Chunk 3 (0.74)</text>
                <text x={DX+16} y={PY+193} fill={P.dim} fontSize="6.5"
                  fontFamily="'Inter',sans-serif" opacity={ease(clamp01((lt-0.7)*4))}>2 discarded — sim below grade threshold</text>
              </g>
            );
          },
        },
        {
          label: "④ Generate + Groundedness Check",
          color: P.data,
          lines: [
            `llm  = ChatOpenAI(model="gpt-4o-mini")`,
            `resp = llm.invoke(`,
            `    prompt_with_context(graded)`,
            `)`,
            `# "ZnTe bandgap is 2.30 eV (direct)"`,
            ``,
            `ground = cosine(embed(resp),`,
            `                embed(graded[0]))`,
            ``,
            `if ground < 0.75:`,
            `    resp = retry_strict(graded)`,
            ``,
            `# ▶  ground=0.87  ≥ 0.75  → PASS`,
          ],
          note: "Groundedness = response must stay inside the retrieved context",
          diagram: (op, lt) => (
            <g opacity={op}>
              {/* flow: context → LLM → answer */}
              <rect x={DX+8} y={PY+22} width={60} height={28} rx="5"
                fill={P.ok+"18"} stroke={P.ok+"80"} strokeWidth="1.2"/>
              <text x={DX+38} y={PY+34} textAnchor="middle" fill={P.ok}
                fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">3 chunks</text>
              <text x={DX+38} y={PY+44} textAnchor="middle" fill={P.muted}
                fontSize="6.5" fontFamily="'Inter',sans-serif">context</text>
              {arrR(DX+68, PY+36, DX+98, P.data)}
              <rect x={DX+98} y={PY+18} width={60} height={36} rx="5"
                fill={P.data+"18"} stroke={P.data} strokeWidth="1.5"/>
              <text x={DX+128} y={PY+34} textAnchor="middle" fill={P.data}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">GPT</text>
              <text x={DX+128} y={PY+46} textAnchor="middle" fill={P.muted}
                fontSize="6.5" fontFamily="'Inter',sans-serif">4o-mini</text>
              {arrR(DX+158, PY+36, DX+190, P.data)}
              <rect x={DX+190} y={PY+22} width={76} height={28} rx="5"
                fill={P.rag+"18"} stroke={P.rag+"80"} strokeWidth="1.2"/>
              <text x={DX+228} y={PY+34} textAnchor="middle" fill={P.rag}
                fontSize="7" fontWeight="700" fontFamily="'Inter',sans-serif">"2.30 eV"</text>
              <text x={DX+228} y={PY+44} textAnchor="middle" fill={P.muted}
                fontSize="6.5" fontFamily="'Inter',sans-serif">response</text>
              {/* groundedness check */}
              <g opacity={ease(clamp01((lt-0.35)*4))}>
                <line x1={DX+228} y1={PY+50} x2={DX+228} y2={PY+78} stroke={P.data} strokeWidth="1.2"/>
                <polygon points={`${DX+223},${PY+78} ${DX+233},${PY+78} ${DX+228},${PY+86}`} fill={P.data}/>
                <rect x={DX+8} y={PY+86} width={DW-18} height={50} rx="6"
                  fill={P.surface} stroke={P.data+"60"} strokeWidth="1.2"/>
                <text x={DX+16} y={PY+102} fill={P.data} fontSize="7.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Groundedness check</text>
                <text x={DX+16} y={PY+116} fill={P.muted} fontSize="7"
                  fontFamily="monospace">cosine(embed(resp), embed(chunk[0]))</text>
                <text x={DX+16} y={PY+130} fill={P.ok} fontSize="8" fontWeight="700"
                  fontFamily="monospace">= 0.87  ≥  0.75  →  ✓ PASS</text>
              </g>
              {/* retry path */}
              <g opacity={ease(clamp01((lt-0.6)*4))}>
                <rect x={DX+8} y={PY+148} width={DW-18} height={42} rx="5"
                  fill={P.warn+"0e"} stroke={P.warn+"40"} strokeWidth="1"/>
                <text x={DX+16} y={PY+162} fill={P.warn} fontSize="7.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">If ground {"<"} 0.75 → retry</text>
                <text x={DX+16} y={PY+175} fill={P.muted} fontSize="7"
                  fontFamily="'Inter',sans-serif">Stricter prompt: "only cite provided text"</text>
                <text x={DX+16} y={PY+184} fill={P.dim} fontSize="6.5"
                  fontFamily="'Inter',sans-serif">Max 2 retries → flag LOW if still failing</text>
              </g>
            </g>
          ),
        },
        {
          label: "⑤ Confidence Score & Uncertainty",
          color: P.ok,
          lines: [
            `n  = len(graded)        # = 3`,
            `fn = {1:0.50,2:0.75}\\`,
            `       .get(n, 0.90)    # = 0.90`,
            ``,
            `conf = (0.5 * ground    # 0.435`,
            `      + 0.3 * top_sim   # 0.273`,
            `      + 0.2 * fn)       # 0.180`,
            `# ▶  conf = 0.888 → HIGH`,
            ``,
            `values = [2.30, 2.26, 2.28]`,
            `sigma  = np.std(values) # 0.017 eV`,
            ``,
            `# route: HIGH if ≥ 0.85`,
          ],
          note: "3 papers → f(n)=0.90, σ=0.017 eV — HIGH route",
          diagram: (op, lt) => {
            const bars = [
              { label:"α · groundedness", val:0.435, max:0.5,  color:P.ok,    desc:"0.5 × 0.87" },
              { label:"β · sim",          val:0.273, max:0.3,  color:P.rag,   desc:"0.3 × 0.91" },
              { label:"γ · f(n=3)",       val:0.180, max:0.2,  color:P.chunk, desc:"0.2 × 0.90" },
            ];
            return (
              <g opacity={op}>
                <text x={DX+8} y={PY+22} fill={P.muted} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Confidence formula breakdown</text>
                {bars.map((b, i) => {
                  const bop = ease(clamp01((lt - i*0.15)*5));
                  const bw  = (b.val / 0.5) * (DW - 110);
                  return (
                    <g key={i} opacity={bop}>
                      <text x={DX+8} y={PY+42+i*34} fill={P.muted} fontSize="7.5"
                        fontFamily="'Inter',sans-serif">{b.label}</text>
                      <rect x={DX+8} y={PY+46+i*34} width={bw} height={14} rx="3"
                        fill={b.color+"35"} stroke={b.color+"80"} strokeWidth="1"/>
                      <text x={DX+14+bw} y={PY+57+i*34} fill={b.color} fontSize="8"
                        fontFamily="monospace" fontWeight="700">{b.val.toFixed(3)}</text>
                      <text x={DX+DW-12} y={PY+57+i*34} textAnchor="end" fill={P.muted}
                        fontSize="7" fontFamily="monospace">{b.desc}</text>
                    </g>
                  );
                })}
                {/* total */}
                <g opacity={ease(clamp01((lt-0.5)*4))}>
                  <line x1={DX+8} y1={PY+150} x2={DX+DW-12} y2={PY+150} stroke={P.border} strokeWidth="1"/>
                  <text x={DX+8} y={PY+164} fill={P.muted} fontSize="8"
                    fontFamily="'Inter',sans-serif">Total conf</text>
                  <text x={DX+70} y={PY+164} fill={P.ok} fontSize="11" fontWeight="900"
                    fontFamily="monospace">= 0.888</text>
                </g>
                {/* route boxes */}
                {[
                  { label:"LOW",   range:"< 0.60",    color:P.warn,  active:false, x:DX+8   },
                  { label:"MED",   range:"0.60–0.85", color:P.data,  active:false, x:DX+98  },
                  { label:"HIGH",  range:"≥ 0.85",    color:P.ok,    active:true,  x:DX+188 },
                ].map((lane) => (
                  <g key={lane.label} opacity={ease(clamp01((lt-0.65)*4))}>
                    <rect x={lane.x} y={PY+175} width={80} height={36} rx="6"
                      fill={lane.color+(lane.active?"28":"0c")}
                      stroke={lane.color+(lane.active?"99":"35")} strokeWidth={lane.active?2:1}/>
                    <text x={lane.x+40} y={PY+191} textAnchor="middle" fill={lane.color}
                      fontSize="8.5" fontWeight="800" fontFamily="'Inter',sans-serif">{lane.label}</text>
                    <text x={lane.x+40} y={PY+203} textAnchor="middle" fill={P.muted}
                      fontSize="6.5" fontFamily="'Inter',sans-serif">{lane.range}</text>
                    {lane.active && <text x={lane.x+40} y={PY+224} textAnchor="middle" fill={lane.color}
                      fontSize="7" fontFamily="'Inter',sans-serif">◀ 0.888</text>}
                  </g>
                ))}
              </g>
            );
          },
        },
        {
          label: "⑥ Synthesize → JSON Recipe",
          color: P.vector,
          lines: [
            `recipe = {`,
            `  "material":   "ZnTe",`,
            `  "Eg_eV":      2.30,`,
            `  "sigma_eV":   0.017,`,
            `  "confidence": 0.888,`,
            `  "route":      "HIGH",`,
            `  "T_synth_C":  {`,
            `    "mean":500,"range":[490,510]`,
            `  },`,
            `  "precursor":  "ZnI2 + Te",`,
            `  "sources":    3,`,
            `}`,
            `print(json.dumps(recipe, indent=2))`,
          ],
          note: "Eg = 2.30 ± 0.017 eV · HIGH confidence · synthesis-ready",
          diagram: (op, lt) => {
            const fields = [
              { k:"material",   v:"ZnTe",          c:P.ok    },
              { k:"Eg_eV",      v:"2.30",           c:P.data  },
              { k:"sigma_eV",   v:"0.017 (σ)",      c:P.warn  },
              { k:"confidence", v:"0.888  HIGH",    c:P.ok    },
              { k:"T_synth_C",  v:"500°C [490-510]",c:P.rag   },
              { k:"precursor",  v:"ZnI₂ + Te",      c:P.chunk },
            ];
            return (
              <g opacity={op}>
                {/* document card */}
                <rect x={DX+8} y={PY+16} width={DW-18} height={148} rx="7"
                  fill={P.surface} stroke={P.vector+"60"} strokeWidth="1.5"/>
                <rect x={DX+8} y={PY+16} width={DW-18} height={18} rx="6"
                  fill={P.vector+"25"}/>
                <text x={DX+16} y={PY+28} fill={P.vector} fontSize="8" fontWeight="700"
                  fontFamily="monospace">recipe document</text>
                {fields.map((f, i) => (
                  <g key={i} opacity={ease(clamp01((lt - i*0.09)*6))}>
                    <text x={DX+16} y={PY+46+i*20} fill={P.muted} fontSize="7.5"
                      fontFamily="monospace">{f.k}:</text>
                    <text x={DX+100} y={PY+46+i*20} fill={f.c} fontSize="7.5"
                      fontFamily="monospace" fontWeight="700">{f.v}</text>
                  </g>
                ))}
                {/* arrow to output */}
                <g opacity={ease(clamp01((lt-0.6)*4))}>
                  <line x1={DX+DW/2} y1={PY+164} x2={DX+DW/2} y2={PY+182} stroke={P.vector} strokeWidth="1.5"/>
                  <polygon points={`${DX+DW/2-5},${PY+182} ${DX+DW/2+5},${PY+182} ${DX+DW/2},${PY+190}`} fill={P.vector}/>
                  {/* JSON output box */}
                  <rect x={DX+40} y={PY+190} width={DW-90} height={42} rx="6"
                    fill={P.ok+"15"} stroke={P.ok+"80"} strokeWidth="1.5"/>
                  <text x={DX+DW/2} y={PY+208} textAnchor="middle" fill={P.ok}
                    fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">JSON Recipe Output</text>
                  <text x={DX+DW/2} y={PY+222} textAnchor="middle" fill={P.muted}
                    fontSize="7" fontFamily="'Inter',sans-serif">synthesis-ready · structured data</text>
                </g>
              </g>
            );
          },
        },
      ];

      const N         = steps.length;
      const activeIdx = Math.min(codeStep, N - 1);
      const localT    = t;
      const cardOp    = ease(clamp01(localT * 6));
      const s         = steps[activeIdx];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={20} textAnchor="middle" fill={P.ink} fontSize="12" fontWeight="800"
            fontFamily="'Inter',sans-serif">Python Walkthrough — ZnTe Bandgap Example</text>
          {steps.map((st, di) => (
            <circle key={di} cx={W/2-(N-1)*16+di*32} cy={33} r={di===activeIdx?5.5:3.5}
              fill={di<=activeIdx?st.color:P.dim} opacity={di===activeIdx?1:0.45}/>
          ))}
          <text x={W/2} y={50} textAnchor="middle" fill={s.color} fontSize="10.5" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>{s.label}</text>

          {/* LEFT: code panel */}
          <rect x={CX} y={PY} width={CW} height={PH} rx="7"
            fill={P.surface} stroke={s.color+"50"} strokeWidth="1.3" opacity={cardOp}/>
          <rect x={CX} y={PY} width={CW} height={18} rx="6" fill={s.color+"22"} opacity={cardOp}/>
          <text x={CX+8} y={PY+13} fill={s.color} fontSize="7.5" fontWeight="700"
            fontFamily="monospace" opacity={cardOp}>python</text>
          {s.lines.map((ln, li) => {
            const lineOp = ease(clamp01((localT - li*0.055)*7));
            const y = PY+30+li*LH;
            return (
              <text key={li} x={CX+8} y={y} fill={lc(ln)} fontSize="7.8"
                fontFamily="'Fira Code','Consolas',monospace"
                fontStyle={ln.trimStart().startsWith("#")?"italic":"normal"}
                opacity={Math.min(cardOp, lineOp)}>{ln}</text>
            );
          })}

          {/* divider */}
          <line x1={CX+CW+4} y1={PY+10} x2={CX+CW+4} y2={PY+PH-10}
            stroke={P.border} strokeWidth="0.8" opacity={cardOp*0.5}/>

          {/* RIGHT: diagram panel */}
          <rect x={DX} y={PY} width={DW} height={PH} rx="7"
            fill={P.surface+"80"} stroke={s.color+"30"} strokeWidth="1" opacity={cardOp}/>
          {s.diagram(cardOp, localT)}

          {/* note bar */}
          <rect x={CX} y={PY+PH+4} width={W-CX*2} height={22} rx="5"
            fill={s.color+"18"} stroke={s.color+"45"} strokeWidth="1" opacity={cardOp}/>
          <text x={W/2} y={PY+PH+19} textAnchor="middle" fill={s.color} fontSize="8.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>▶  {s.note}</text>
        </svg>
      );
    }

    default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════════════════
  const totalDuration  = SCENES.reduce((s, sc) => s + sc.duration, 0);
  const elapsed        = SCENES.slice(0, sceneIdx).reduce((s, sc) => s + sc.duration, 0) + progress * scene.duration;
  const globalProgress = elapsed / totalDuration;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: P.muted, textTransform: "uppercase", marginBottom: 4 }}>
          Animated Module
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.rag, marginBottom: 4 }}>
          LLM Pipeline — LangGraph Architecture for Literature Mining
        </div>
        <div style={{ fontSize: 13, color: P.muted, lineHeight: 1.5 }}>
          10-node graph: retrieval grading · hallucination checking · uncertainty routing · synthesis recipe generation.
        </div>
      </div>

      {/* Cinema screen */}
      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
      }}>
        <div style={{ position: "absolute", top: 10, left: 14, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: P.rag+"25", border: `1px solid ${P.rag}50`, padding: "3px 10px",
            borderRadius: 6, fontSize: 10, fontWeight: 700, color: P.rag, letterSpacing: 1 }}>
            Scene {sceneIdx + 1}/{SCENES.length}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: P.ink }}>{scene.label}</span>
        </div>
        <div style={{ position: "absolute", top: 10, right: 14, zIndex: 2, fontSize: 11, color: "#fff", fontWeight: 600, opacity: 0.7 }}>
          Habibur Rahman · rahma103@purdue.edu
        </div>
        <div style={{ opacity: fadeClass, transition: "opacity 0.25s ease-in-out", willChange: "opacity" }}>
          {renderScene()}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: P.dim+"30" }}>
          <div style={{ height: "100%", background: P.rag, width: `${progress * 100}%`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: P.panel, padding: "10px 14px", borderRadius: 12, border: `1px solid ${P.border}` }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.rag}`,
          background: P.rag+"15", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18, color: P.rag, fontWeight: 900, fontFamily: "inherit",
        }}>
          {playing ? "\u23F8" : (sceneIdx === SCENES.length - 1 && progress >= 1) ? "\u21BB" : "\u25B6"}
        </button>
        <button onClick={prevScene} disabled={sceneIdx === 0} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`, background: "transparent", cursor: sceneIdx > 0 ? "pointer" : "default", color: sceneIdx > 0 ? P.ink : P.dim, fontSize: 13, fontWeight: 700, fontFamily: "inherit", opacity: sceneIdx > 0 ? 1 : 0.4 }}>{"\u2190"}</button>
        <button onClick={nextScene} disabled={sceneIdx === SCENES.length - 1} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${P.border}`, background: "transparent", cursor: sceneIdx < SCENES.length - 1 ? "pointer" : "default", color: sceneIdx < SCENES.length - 1 ? P.ink : P.dim, fontSize: 13, fontWeight: 700, fontFamily: "inherit", opacity: sceneIdx < SCENES.length - 1 ? 1 : 0.4 }}>{"\u2192"}</button>
        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ height: 6, background: P.dim+"30", borderRadius: 3, position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              let accum = 0;
              for (let i = 0; i < SCENES.length; i++) {
                const frac = SCENES[i].duration / totalDuration;
                if (accum + frac >= ratio) { goScene(i); break; }
                accum += frac;
              }
            }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${P.rag}, ${P.agent}, ${P.llm})`, width: `${globalProgress * 100}%`, borderRadius: 3 }} />
            {SCENES.map((_, i) => {
              const pos = SCENES.slice(0, i).reduce((s, sc) => s + sc.duration, 0) / totalDuration;
              return i > 0 ? <div key={i} style={{ position: "absolute", left: `${pos * 100}%`, top: -2, width: 1, height: 10, background: P.dim }} /> : null;
            })}
          </div>
        </div>
        <span style={{ fontSize: 10, color: P.muted, fontFamily: "monospace", minWidth: 50, textAlign: "right" }}>
          {Math.floor(elapsed / 1000)}s / {Math.floor(totalDuration / 1000)}s
        </span>
      </div>

      {/* Code step buttons — only shown in code_walk scene */}
      {scene.id === "code_walk" && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center", background: P.panel, padding: "8px 12px", borderRadius: 10, border: `1px solid ${P.border}` }}>
          <span style={{ fontSize: 10, color: P.muted, fontWeight: 700, marginRight: 4, letterSpacing: 1, textTransform: "uppercase" }}>Step</span>
          {[
            "① Load & Chunk",
            "② Embed & FAISS",
            "③ Retrieve & Grade",
            "④ Generate",
            "⑤ Confidence",
            "⑥ Recipe",
          ].map((label, i) => (
            <button key={i} onClick={() => goCodeStep(i)} style={{
              padding: "5px 11px", borderRadius: 7, fontSize: 10, cursor: "pointer",
              background: i === codeStep ? P.chunk+"25" : "transparent",
              border: `1px solid ${i === codeStep ? P.chunk : P.border}`,
              color: i === codeStep ? P.chunk : i < codeStep ? P.llm : P.muted,
              fontWeight: i === codeStep ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          <button onClick={() => codeStep > 0 && goCodeStep(codeStep - 1)} disabled={codeStep === 0}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: codeStep > 0 ? "pointer" : "default", color: codeStep > 0 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: codeStep > 0 ? 1 : 0.3 }}>←</button>
          <button onClick={() => codeStep < CODE_STEPS - 1 && goCodeStep(codeStep + 1)} disabled={codeStep === CODE_STEPS - 1}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: codeStep < CODE_STEPS - 1 ? "pointer" : "default", color: codeStep < CODE_STEPS - 1 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: codeStep < CODE_STEPS - 1 ? 1 : 0.3 }}>→</button>
        </div>
      )}

      {/* Scene chips */}
      <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.rag+"20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.rag : P.border}`,
            color: i === sceneIdx ? P.rag : i < sceneIdx ? P.llm : P.muted,
            fontWeight: i === sceneIdx ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
