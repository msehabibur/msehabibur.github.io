import React, { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// MongoDB for Materials Science — Animated Movie (4 scenes)
// ═══════════════════════════════════════════════════════════════════════

const SCENES = [
  { id: "title",    label: "MongoDB",                  duration: 3500 },
  { id: "what",     label: "What is MongoDB?",         duration: 8000 },
  { id: "compare",  label: "MongoDB vs Excel",         duration: 8000 },
  { id: "pymongo",  label: "Python + pymongo",         duration: 9000 },
  { id: "workflow", label: "Materials DB Workflow",     duration: 9000 },
];

const ease    = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const clamp01 = t => Math.max(0,Math.min(1,t));

const W = 560, H = 420;

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
  chunk:   "#60a5fa",
  mongo:   "#818cf8",
};

export default function MongoDBMovieModule() {
  const [sceneIdx, setSceneIdx]     = useState(0);
  const [progress, setProgress]     = useState(0);
  const [playing, setPlaying]       = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [pyStep, setPyStep]         = useState(0);
  const [wfStep, setWfStep]         = useState(0);
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
      if (sceneIdx < SCENES.length - 1) { setSceneIdx(i => i+1); startRef.current = null; }
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

  const goScene = (i) => { setPlaying(false); setManualMode(true); setSceneIdx(i); setProgress(0); setPyStep(0); setWfStep(0); startRef.current = null; };
  const playAll = () => { setManualMode(false); setSceneIdx(0); setProgress(0); setPyStep(0); setWfStep(0); startRef.current = null; setPlaying(true); };
  const togglePause = () => {
    if (playing) { setPlaying(false); setManualMode(true); }
    else { setManualMode(false); startRef.current = null; setPlaying(true); }
  };
  const nextScene = () => { if (sceneIdx < SCENES.length-1) goScene(sceneIdx+1); };
  const prevScene = () => { if (sceneIdx > 0) goScene(sceneIdx-1); };

  const PY_STEPS = 6;
  const goPyStep = (step) => { setPyStep(step); setPlaying(false); setManualMode(true); setProgress(0); startRef.current = null; };
  const WF_STEPS = 6;
  const goWfStep = (step) => { setWfStep(step); setPlaying(false); setManualMode(true); setProgress(0); startRef.current = null; };

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
  // RENDER SCENE
  // ═══════════════════════════════════════════════════════════════════════
  const renderScene = () => {
    switch (SCENES[visibleScene].id) {

    // ── TITLE ───────────────────────────────────────────────────────────
    case "title": {
      const titleOp = ease(clamp01(t*4));
      const subOp   = ease(clamp01((t-0.3)*4));
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
          <rect width={W} height={H} fill={P.bg}/>
          {/* DB icon */}
          <g opacity={ease(clamp01((t-0.1)*4))} transform={`translate(${W/2},150)`}>
            <rect x={-40} y={-30} width={80} height={50} rx="6"
              fill={P.mongo+"18"} stroke={P.mongo} strokeWidth="2"/>
            <ellipse cx={0} cy={-30} rx={40} ry={10} fill={P.mongo+"30"} stroke={P.mongo} strokeWidth="1.5"/>
            <ellipse cx={0} cy={20} rx={40} ry={10} fill={P.mongo+"18"} stroke={P.mongo+"60"} strokeWidth="1"/>
            <text x={0} y={2} textAnchor="middle" fill={P.mongo} fontSize="14" fontWeight="800"
              fontFamily="'Inter',sans-serif">DB</text>
          </g>
          <text x={W/2} y={230} textAnchor="middle" fill={P.mongo} fontSize="24" fontWeight="900"
            fontFamily="'Inter',sans-serif" opacity={titleOp}>MongoDB</text>
          <text x={W/2} y={256} textAnchor="middle" fill={P.ink} fontSize="13" fontWeight="700"
            fontFamily="'Inter',sans-serif" opacity={titleOp}>for Materials Science</text>
          <text x={W/2} y={286} textAnchor="middle" fill={P.muted} fontSize="10"
            fontFamily="'Inter',sans-serif" opacity={subOp}>
            Document Database · Flexible Schema · Python + pymongo
          </text>
          <text x={W/2} y={384} textAnchor="middle" fill={P.dim} fontSize="8.5"
            fontFamily="'Inter',sans-serif" opacity={subOp}>
            Habibur Rahman · rahma103@purdue.edu · Purdue University
          </text>
        </svg>
      );
    }

    // ── WHAT IS MONGODB ─────────────────────────────────────────────────
    case "what": {
      const op = ease(clamp01(t*5));
      // SQL table
      const sqlCols = ["id","material","Eg_eV"];
      const sqlRow  = ["1","ZnTe","2.30"];
      const colW = 48, tX = 30, tY = 68;
      const items = [
        { label:"NoSQL Document Store", desc:"Stores JSON-like documents instead of rows & columns", color:P.mongo },
        { label:"Flexible Schema", desc:"Add new fields anytime — no ALTER TABLE or migration needed", color:P.rag },
        { label:"Rich Queries", desc:"Filter, sort, aggregate, index — all server-side", color:P.data },
        { label:"Python Driver", desc:"pymongo: insert_one, find, aggregate — native Python API", color:P.ok },
        { label:"Atlas Cloud", desc:"Free tier (512 MB) · managed backups · TLS encryption", color:P.vector },
      ];
      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
          <rect width={W} height={H} fill={P.bg}/>
          <text x={W/2} y={28} textAnchor="middle" fill={P.mongo} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={op}>What is MongoDB?</text>

          {/* SQL table */}
          <g opacity={ease(clamp01((t-0.05)*5))}>
            <rect x={20} y={46} width={170} height={80} rx="8" fill={P.surface} stroke={P.dim+"60"} strokeWidth="1.5"/>
            <text x={105} y={62} textAnchor="middle" fill={P.muted} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">Relational (SQL)</text>
            {sqlCols.map((c, ci) => (
              <g key={ci}>
                <rect x={tX+ci*colW} y={tY} width={colW} height={18} fill={P.dim+"20"}
                  stroke={P.dim+"50"} strokeWidth="0.8"/>
                <text x={tX+ci*colW+colW/2} y={tY+13} textAnchor="middle" fill={P.muted}
                  fontSize="7.5" fontWeight="700" fontFamily="monospace">{c}</text>
              </g>
            ))}
            {sqlRow.map((v, ci) => (
              <g key={ci}>
                <rect x={tX+ci*colW} y={tY+18} width={colW} height={18} fill="transparent"
                  stroke={P.dim+"50"} strokeWidth="0.8"/>
                <text x={tX+ci*colW+colW/2} y={tY+31} textAnchor="middle" fill={P.muted}
                  fontSize="7.5" fontFamily="monospace">{v}</text>
              </g>
            ))}
          </g>

          {/* arrow */}
          <g opacity={ease(clamp01((t-0.1)*5))}>
            <line x1={200} y1={86} x2={228} y2={86} stroke={P.dim} strokeWidth="1.5"/>
            <polygon points="226,82 226,90 234,86" fill={P.dim}/>
          </g>

          {/* NoSQL document */}
          <g opacity={ease(clamp01((t-0.15)*5))}>
            <rect x={240} y={46} width={298} height={80} rx="8" fill={P.surface} stroke={P.mongo+"60"} strokeWidth="1.5"/>
            <text x={389} y={62} textAnchor="middle" fill={P.mongo} fontSize="9" fontWeight="700"
              fontFamily="'Inter',sans-serif">MongoDB (NoSQL)</text>
            <text x={254} y={78} fill={P.mongo} fontSize="8" fontFamily="monospace" fontWeight="700">{"{"}</text>
            <text x={264} y={90} fill={P.muted} fontSize="7.5" fontFamily="monospace">"material": "ZnTe",  "Eg_eV": 2.30,</text>
            <text x={264} y={102} fill={P.muted} fontSize="7.5" fontFamily="monospace">"T_synth": {"{"}mean: 500, range: [490,510]{"}"}</text>
            <text x={254} y={114} fill={P.mongo} fontSize="8" fontFamily="monospace" fontWeight="700">{"}"}</text>
          </g>

          {/* feature list */}
          {items.map((item, i) => {
            const iop = ease(clamp01((t - 0.2 - i*0.1)*5));
            return (
              <g key={i} opacity={iop}>
                <rect x={20} y={140+i*52} width={W-40} height={44} rx="7"
                  fill={P.surface} stroke={item.color+"45"} strokeWidth="1.2"/>
                <circle cx={38} cy={160+i*52} r={4} fill={item.color}/>
                <text x={52} y={163+i*52} fill={item.color} fontSize="10" fontWeight="700"
                  fontFamily="'Inter',sans-serif">{item.label}</text>
                <text x={52} y={178+i*52} fill={P.muted} fontSize="8"
                  fontFamily="'Inter',sans-serif">{item.desc}</text>
              </g>
            );
          })}
        </svg>
      );
    }

    // ── MONGODB vs EXCEL ────────────────────────────────────────────────
    case "compare": {
      const op = ease(clamp01(t*5));
      const colW2 = 248, gap2 = 14;
      const lx = 24, rx2 = lx + colW2 + gap2;
      const topY = 48;

      const mongoAdv = [
        { label: "Nested / complex data",    desc: "Arrays, sub-documents, mixed types per field" },
        { label: "Scales to millions of rows", desc: "Indexing + aggregation stay fast at scale" },
        { label: "Programmatic access",       desc: "Python / JS drivers — automate pipelines" },
        { label: "Concurrent multi-user",     desc: "Many researchers read/write simultaneously" },
        { label: "Schema evolution",           desc: "Add new fields anytime — no migration needed" },
        { label: "Cloud backups & replication", desc: "Atlas free tier — automatic snapshots" },
      ];

      const excelAdv = [
        { label: "Familiar interface",         desc: "Point-and-click — no coding required" },
        { label: "Quick visual inspection",    desc: "Scroll, sort, filter interactively" },
        { label: "Built-in charting",          desc: "Instant plots without extra libraries" },
        { label: "Easy sharing",               desc: "Email a .xlsx — everyone can open it" },
      ];

      const excelLim = [
        { label: "Row limit ~1M",              desc: "Large datasets crash or slow down" },
        { label: "No nested data",             desc: "Flat rows only — no arrays or sub-docs" },
        { label: "Manual, error-prone",        desc: "Copy-paste mistakes, no version control" },
        { label: "Single-user editing",        desc: "Conflicts when multiple people edit" },
      ];

      const rh = 26;

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
          <rect width={W} height={H} fill={P.bg}/>
          <text x={W/2} y={28} textAnchor="middle" fill={P.mongo} fontSize="13" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={op}>MongoDB vs Excel</text>
          <text x={W/2} y={42} textAnchor="middle" fill={P.muted} fontSize="8"
            fontFamily="'Inter',sans-serif" opacity={op}>When to use which for materials data</text>

          {/* MongoDB column */}
          <g opacity={ease(clamp01((t-0.05)*5))}>
            <rect x={lx} y={topY} width={colW2} height={rh*6+34} rx="8"
              fill={P.surface} stroke={P.mongo+"60"} strokeWidth="1.5"/>
            <rect x={lx} y={topY} width={colW2} height={20} rx="8" fill={P.mongo+"22"}/>
            <rect x={lx} y={topY+12} width={colW2} height={8} fill={P.mongo+"22"}/>
            <circle cx={lx+12} cy={topY+10} r={3.5} fill={P.mongo}/>
            <text x={lx+22} y={topY+14} fill={P.mongo} fontSize="9" fontWeight="800"
              fontFamily="'Inter',sans-serif">MongoDB Advantages</text>
            {mongoAdv.map((item, i) => {
              const iop = ease(clamp01((t - 0.1 - i*0.06)*5));
              const iy = topY + 26 + i*rh;
              return (
                <g key={i} opacity={iop}>
                  <circle cx={lx+12} cy={iy+8} r={2.5} fill={P.ok}/>
                  <text x={lx+22} y={iy+8} fill={P.ink} fontSize="7.5" fontWeight="700"
                    fontFamily="'Inter',sans-serif" dominantBaseline="middle">{item.label}</text>
                  <text x={lx+22} y={iy+19} fill={P.muted} fontSize="6.5"
                    fontFamily="'Inter',sans-serif">{item.desc}</text>
                </g>
              );
            })}
          </g>

          {/* Excel column - advantages */}
          <g opacity={ease(clamp01((t-0.15)*5))}>
            <rect x={rx2} y={topY} width={colW2} height={rh*4+34} rx="8"
              fill={P.surface} stroke={P.rag+"60"} strokeWidth="1.5"/>
            <rect x={rx2} y={topY} width={colW2} height={20} rx="8" fill={P.rag+"22"}/>
            <rect x={rx2} y={topY+12} width={colW2} height={8} fill={P.rag+"22"}/>
            <circle cx={rx2+12} cy={topY+10} r={3.5} fill={P.rag}/>
            <text x={rx2+22} y={topY+14} fill={P.rag} fontSize="9" fontWeight="800"
              fontFamily="'Inter',sans-serif">Excel Advantages</text>
            {excelAdv.map((item, i) => {
              const iop = ease(clamp01((t - 0.2 - i*0.06)*5));
              const iy = topY + 26 + i*rh;
              return (
                <g key={i} opacity={iop}>
                  <circle cx={rx2+12} cy={iy+8} r={2.5} fill={P.rag}/>
                  <text x={rx2+22} y={iy+8} fill={P.ink} fontSize="7.5" fontWeight="700"
                    fontFamily="'Inter',sans-serif" dominantBaseline="middle">{item.label}</text>
                  <text x={rx2+22} y={iy+19} fill={P.muted} fontSize="6.5"
                    fontFamily="'Inter',sans-serif">{item.desc}</text>
                </g>
              );
            })}
          </g>

          {/* Excel column - limitations */}
          <g opacity={ease(clamp01((t-0.35)*5))}>
            <rect x={rx2} y={topY + rh*4 + 42} width={colW2} height={rh*4+34} rx="8"
              fill={P.surface} stroke={P.warn+"60"} strokeWidth="1.5"/>
            <rect x={rx2} y={topY + rh*4 + 42} width={colW2} height={20} rx="8" fill={P.warn+"22"}/>
            <rect x={rx2} y={topY + rh*4 + 54} width={colW2} height={8} fill={P.warn+"22"}/>
            <circle cx={rx2+12} cy={topY + rh*4 + 52} r={3.5} fill={P.warn}/>
            <text x={rx2+22} y={topY + rh*4 + 56} fill={P.warn} fontSize="9" fontWeight="800"
              fontFamily="'Inter',sans-serif">Excel Limitations</text>
            {excelLim.map((item, i) => {
              const iop = ease(clamp01((t - 0.4 - i*0.06)*5));
              const iy = topY + rh*4 + 68 + i*rh;
              return (
                <g key={i} opacity={iop}>
                  <circle cx={rx2+12} cy={iy+8} r={2.5} fill={P.warn}/>
                  <text x={rx2+22} y={iy+8} fill={P.ink} fontSize="7.5" fontWeight="700"
                    fontFamily="'Inter',sans-serif" dominantBaseline="middle">{item.label}</text>
                  <text x={rx2+22} y={iy+19} fill={P.muted} fontSize="6.5"
                    fontFamily="'Inter',sans-serif">{item.desc}</text>
                </g>
              );
            })}
          </g>

          {/* Bottom recommendation */}
          <g opacity={ease(clamp01((t-0.6)*4))}>
            <rect x={24} y={H-34} width={W-48} height={26} rx="6"
              fill={P.mongo+"15"} stroke={P.mongo+"50"} strokeWidth="1"/>
            <text x={W/2} y={H-17} textAnchor="middle" fill={P.mongo} fontSize="8.5" fontWeight="700"
              fontFamily="'Inter',sans-serif">
              Use MongoDB when data is complex, large, or shared — Excel for quick one-off exploration
            </text>
          </g>
        </svg>
      );
    }

    // ── PYTHON + PYMONGO ────────────────────────────────────────────────
    case "pymongo": {
      const CX = 12, CW = 250, DX = 270, DW = 276;
      const PY2 = 58, PH2 = 330;
      const LH = 19;
      const lc = (ln) => {
        if (!ln||ln.trim()==="") return P.muted;
        if (ln.trimStart().startsWith("#")) return "#5a6882";
        if (ln.startsWith("from ")||ln.startsWith("import ")) return P.chunk;
        if (ln.trimStart().startsWith('"$')) return P.data;
        return P.ink;
      };
      const arrR = (x1,y1,x2,col) => [
        <line key="l" x1={x1} y1={y1} x2={x2} y2={y1} stroke={col} strokeWidth="1.5"/>,
        <polygon key="p" points={`${x2-5},${y1-4} ${x2-5},${y1+4} ${x2+1},${y1}`} fill={col}/>,
      ];
      const dbCyl = (cx,cy,rx2,ry2,col,label,sub,op2) => (
        <g opacity={op2}>
          <rect x={cx-rx2} y={cy-ry2+8} width={rx2*2} height={ry2*2-8} rx="4"
            fill={col+"18"} stroke={col+"70"} strokeWidth="1.5"/>
          <ellipse cx={cx} cy={cy-ry2+8} rx={rx2} ry={8} fill={col+"30"} stroke={col} strokeWidth="1.2"/>
          <ellipse cx={cx} cy={cy+ry2} rx={rx2} ry={8} fill={col+"18"} stroke={col+"60"} strokeWidth="1"/>
          <text x={cx} y={cy+5} textAnchor="middle" fill={col} fontSize="8.5" fontWeight="700"
            fontFamily="'Inter',sans-serif">{label}</text>
          {sub && <text x={cx} y={cy+18} textAnchor="middle" fill={P.muted} fontSize="7"
            fontFamily="'Inter',sans-serif">{sub}</text>}
        </g>
      );

      const pySteps = [
        {
          label: "\u2460 Connect to Atlas",
          color: P.ok,
          lines: [
            `from pymongo import MongoClient`,
            `from dotenv import load_dotenv`,
            `import os`,
            ``,
            `load_dotenv()`,
            ``,
            `client = MongoClient(`,
            `    os.getenv("MONGO_URI")`,
            `)`,
            `db      = client["materials_db"]`,
            `recipes = db["recipes"]`,
            `papers  = db["papers"]`,
            `# \u25B6  Atlas cluster connected`,
          ],
          note: "Cloud Atlas \u2014 free tier \u00B7 500 MB \u00B7 no local install",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <rect x={DX+8} y={PY2+30} width={64} height={40} rx="6"
                fill={P.chunk+"18"} stroke={P.chunk} strokeWidth="1.5"/>
              <text x={DX+40} y={PY2+47} textAnchor="middle" fill={P.chunk}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Python</text>
              <text x={DX+40} y={PY2+62} textAnchor="middle" fill={P.muted}
                fontSize="7" fontFamily="'Inter',sans-serif">app</text>
              {arrR(DX+72, PY2+50, DX+108, P.ok)}
              <ellipse cx={DX+136} cy={PY2+50} rx={24} ry={18} fill={P.surface} stroke={P.border} strokeWidth="1.2"/>
              <text x={DX+136} y={PY2+47} textAnchor="middle" fill={P.muted}
                fontSize="7" fontFamily="'Inter',sans-serif">TLS</text>
              {arrR(DX+160, PY2+50, DX+188, P.ok)}
              {dbCyl(DX+222, PY2+46, 42, 26, P.ok, "Atlas", "MongoDB", op2)}
              <rect x={DX+8} y={PY2+100} width={DW-18} height={28} rx="5"
                fill={P.surface} stroke={P.border} strokeWidth="1" opacity={ease(clamp01((lt-0.5)*4))}/>
              <text x={DX+16} y={PY2+118} fill={P.muted} fontSize="7"
                fontFamily="monospace" opacity={ease(clamp01((lt-0.5)*4))}>mongodb+srv://user:***@cluster.mongodb.net</text>
            </g>
          ),
        },
        {
          label: "\u2461 Document Schema",
          color: P.data,
          lines: [
            `# One MongoDB doc per recipe`,
            `{`,
            `  "_id":        ObjectId(),`,
            `  "material":   "ZnTe",`,
            `  "Eg_eV":      2.30,`,
            `  "sigma_eV":   0.017,`,
            `  "confidence": 0.888,`,
            `  "route":      "HIGH",`,
            `  "T_synth_C":  {`,
            `    "mean":500,"range":[490,510]`,
            `  },`,
            `  "sources":    3,`,
            `}`,
          ],
          note: "Flexible schema \u2014 add new fields any time without migration",
          diagram: (op2, lt) => {
            const fields = [
              { k:"_id",        v:"ObjectId (auto)",  c:P.dim   },
              { k:"material",   v:'"ZnTe"',           c:P.ok    },
              { k:"Eg_eV",      v:"2.30",             c:P.data  },
              { k:"sigma_eV",   v:"0.017 eV",         c:P.data  },
              { k:"confidence", v:"0.888",            c:P.ok    },
              { k:"route",      v:'"HIGH"',           c:P.ok    },
              { k:"T_synth_C",  v:"{mean:500}",       c:P.rag   },
              { k:"sources",    v:"3 papers",         c:P.chunk },
            ];
            return (
              <g opacity={op2}>
                <text x={DX+8} y={PY2+22} fill={P.muted} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Recipe document structure</text>
                <rect x={DX+8} y={PY2+28} width={DW-18} height={fields.length*24+8} rx="7"
                  fill={P.surface} stroke={P.data+"60"} strokeWidth="1.5"/>
                {fields.map((f, i) => (
                  <g key={i} opacity={ease(clamp01((lt-i*0.08)*5))}>
                    <text x={DX+16} y={PY2+47+i*24} fill={P.muted} fontSize="7.5"
                      fontFamily="monospace">{f.k}:</text>
                    <text x={DX+100} y={PY2+47+i*24} fill={f.c} fontSize="7.5"
                      fontFamily="monospace" fontWeight="700">{f.v}</text>
                  </g>
                ))}
              </g>
            );
          },
        },
        {
          label: "\u2462 Insert Recipe",
          color: P.rag,
          lines: [
            `recipe_doc = {`,
            `  "material":   "ZnTe",`,
            `  "Eg_eV":      2.30,`,
            `  "sigma_eV":   0.017,`,
            `  "confidence": 0.888,`,
            `  "route":      "HIGH",`,
            `  "T_synth_C":  {"mean":500},`,
            `  "sources":    3,`,
            `}`,
            ``,
            `result = recipes.insert_one(`,
            `    recipe_doc`,
            `)`,
            `# \u25B6  Inserted _id: 6732f1a8...`,
          ],
          note: "insert_one \u2192 returns ObjectId linking paper docs",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <rect x={DX+8} y={PY2+22} width={84} height={80} rx="6"
                fill={P.chunk+"15"} stroke={P.chunk+"70"} strokeWidth="1.2"/>
              <text x={DX+50} y={PY2+36} textAnchor="middle" fill={P.chunk}
                fontSize="7.5" fontWeight="700" fontFamily="'Inter',sans-serif">Python dict</text>
              {["material","Eg_eV","sigma","conf","route"].map((f,i)=>(
                <text key={i} x={DX+16} y={PY2+50+i*12} fill={P.muted} fontSize="7"
                  fontFamily="monospace">{f}: \u2026</text>
              ))}
              {arrR(DX+92, PY2+62, DX+130, P.rag)}
              <text x={DX+111} y={PY2+56} textAnchor="middle" fill={P.rag} fontSize="7"
                fontFamily="'Inter',sans-serif">insert_one()</text>
              <g opacity={ease(clamp01((lt-0.35)*4))}>
                <rect x={DX+130} y={PY2+22} width={DW-142} height={80} rx="6"
                  fill={P.surface} stroke={P.rag+"80"} strokeWidth="1.5"/>
                <text x={DX+138} y={PY2+35} fill={P.rag} fontSize="7.5" fontWeight="700"
                  fontFamily="'Inter',sans-serif">recipes</text>
                {[0,1,2].map(i=>(
                  <rect key={i} x={DX+138} y={PY2+42+i*16} width={DW-158} height={12} rx="2"
                    fill={i===0?P.rag+"25":P.dim+"20"} stroke={i===0?P.rag+"80":P.border} strokeWidth={i===0?1.2:0.5}/>
                ))}
                <text x={DX+146} y={PY2+52} fill={P.rag} fontSize="7"
                  fontFamily="monospace">{"\u2190"} new doc</text>
              </g>
            </g>
          ),
        },
        {
          label: "\u2463 Query",
          color: P.llm,
          lines: [
            `cursor = recipes.find({`,
            `    "material":   "ZnTe",`,
            `    "confidence":{`,
            `        "$gte": 0.85`,
            `    },`,
            `    "sources":{ "$gte": 2 },`,
            `})`,
            ``,
            `for doc in cursor:`,
            `    print(doc["Eg_eV"],`,
            `          doc["route"])`,
            `# \u25B6  2.30  HIGH`,
            `# Uses index on {material,conf}`,
          ],
          note: "Indexed query \u2192 sub-millisecond even across millions of docs",
          diagram: (op2, lt) => {
            const docs = [
              { mat:"ZnTe", conf:0.888, route:"HIGH",   match:true  },
              { mat:"ZnTe", conf:0.752, route:"MED",    match:false },
              { mat:"ZnTe", conf:0.920, route:"HIGH",   match:true  },
            ];
            return (
              <g opacity={op2}>
                <text x={DX+8} y={PY2+22} fill={P.muted} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Query filter → matching docs</text>
                <rect x={DX+8} y={PY2+30} width={DW-18} height={36} rx="5"
                  fill={P.surface} stroke={P.llm+"60"} strokeWidth="1.2"/>
                <text x={DX+16} y={PY2+45} fill={P.llm} fontSize="7.5" fontWeight="700"
                  fontFamily="monospace">material="ZnTe" AND conf{"\u2265"}0.85</text>
                {docs.map((d, i) => {
                  const dop = ease(clamp01((lt-0.3-i*0.1)*5));
                  return (
                    <g key={i} opacity={dop}>
                      <rect x={DX+8} y={PY2+76+i*28} width={DW-18} height={22} rx="4"
                        fill={d.match?P.llm+"15":P.surface}
                        stroke={d.match?P.llm+"70":P.border} strokeWidth={d.match?1.5:0.8}/>
                      <text x={DX+16} y={PY2+91+i*28} fill={P.muted} fontSize="7.5"
                        fontFamily="monospace">{d.mat}  conf={d.conf}  {d.route}</text>
                      <text x={DX+DW-20} y={PY2+91+i*28} textAnchor="end"
                        fill={d.match?P.llm:P.warn} fontSize="7.5" fontFamily="monospace"
                        fontWeight="700">{d.match?"\u2713":"\u2717"}</text>
                    </g>
                  );
                })}
              </g>
            );
          },
        },
        {
          label: "\u2464 Aggregate",
          color: P.vector,
          lines: [
            `pipeline = [`,
            `  {"$match": {`,
            `    "material":"ZnTe"`,
            `  }},`,
            `  {"$group": {`,
            `    "_id":    "$material",`,
            `    "meanEg": {"$avg":"$Eg_eV"},`,
            `    "stdEg":  {"$stdDevPop":`,
            `               "$Eg_eV"},`,
            `    "count":  {"$sum": 1},`,
            `  }},`,
            `]`,
            `result = recipes.aggregate(pipeline)`,
          ],
          note: "Server-side aggregation \u2014 no data pulled to Python",
          diagram: (op2, lt) => {
            const stages = [
              { name:"$match", desc:"ZnTe only",    color:P.vector },
              { name:"$group", desc:"avg, std, n",   color:P.data   },
            ];
            return (
              <g opacity={op2}>
                <text x={DX+8} y={PY2+22} fill={P.muted} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Aggregation pipeline</text>
                {stages.map((s, i) => (
                  <g key={i} opacity={ease(clamp01((lt-0.1-i*0.2)*5))}>
                    {i>0 && <line x1={DX+DW/2} y1={PY2+32+i*52-6} x2={DX+DW/2} y2={PY2+32+i*52+4}
                      stroke={s.color} strokeWidth="1.5"/>}
                    <rect x={DX+20} y={PY2+36+i*52} width={DW-40} height={38} rx="6"
                      fill={P.surface} stroke={s.color+"60"} strokeWidth="1.5"/>
                    <text x={DX+30} y={PY2+54+i*52} fill={s.color} fontSize="9" fontWeight="800"
                      fontFamily="monospace">{s.name}</text>
                    <text x={DX+100} y={PY2+54+i*52} fill={P.muted} fontSize="8"
                      fontFamily="'Inter',sans-serif">{s.desc}</text>
                  </g>
                ))}
                <g opacity={ease(clamp01((lt-0.55)*4))}>
                  <line x1={DX+DW/2} y1={PY2+126} x2={DX+DW/2} y2={PY2+140} stroke={P.ok} strokeWidth="1.5"/>
                  <polygon points={`${DX+DW/2-4},${PY2+138} ${DX+DW/2+4},${PY2+138} ${DX+DW/2},${PY2+146}`} fill={P.ok}/>
                  <rect x={DX+20} y={PY2+148} width={DW-40} height={52} rx="6"
                    fill={P.surface} stroke={P.ok+"60"} strokeWidth="1.5"/>
                  <text x={DX+30} y={PY2+164} fill={P.ok} fontSize="8" fontWeight="700"
                    fontFamily="'Inter',sans-serif">Result</text>
                  {[["meanEg","2.28 eV"],["stdEg","0.017 eV"],["count","3"]].map(([k,v],i) => (
                    <text key={k} x={DX+30} y={PY2+178+i*12} fill={P.muted} fontSize="7"
                      fontFamily="monospace">{k}: {v}</text>
                  ))}
                </g>
              </g>
            );
          },
        },
        {
          label: "\u2465 Full Pipeline",
          color: P.mongo,
          lines: [
            `# Complete workflow:`,
            `# 1. PDF \u2192 chunks (LangChain)`,
            `# 2. Chunks \u2192 embeddings (OpenAI)`,
            `# 3. Query \u2192 retrieve \u2192 LLM`,
            `# 4. LLM \u2192 JSON recipe`,
            `# 5. recipe \u2192 MongoDB Atlas`,
            `# 6. Query/Aggregate from DB`,
            ``,
            `# All data persisted in MongoDB`,
            `# Indexed for fast retrieval`,
            `# Aggregation on server-side`,
            `# Confidence-routed pipeline`,
            `# Reproducible & auditable`,
          ],
          note: "End-to-end: PDF \u2192 LLM \u2192 MongoDB \u2192 insights",
          diagram: (op2, lt) => {
            const flow = [
              { label:"PDF",      color:P.chunk },
              { label:"Chunks",   color:P.chunk },
              { label:"LLM",      color:P.rag   },
              { label:"Recipe",   color:P.ok    },
              { label:"MongoDB",  color:P.mongo },
              { label:"Query",    color:P.llm   },
              { label:"Insights", color:P.data  },
            ];
            return (
              <g opacity={op2}>
                {flow.map((f, i) => {
                  const fop = ease(clamp01((lt - i*0.08)*5));
                  const fy = PY2+20+i*36;
                  return (
                    <g key={i} opacity={fop}>
                      {i > 0 && (
                        <>
                          <line x1={DX+DW/2} y1={fy-8} x2={DX+DW/2} y2={fy} stroke={f.color+"60"} strokeWidth="1.5"/>
                          <polygon points={`${DX+DW/2-3},${fy-2} ${DX+DW/2+3},${fy-2} ${DX+DW/2},${fy+3}`} fill={f.color+"60"}/>
                        </>
                      )}
                      <rect x={DX+60} y={fy+2} width={DW-120} height={24} rx="5"
                        fill={P.surface} stroke={f.color+"60"} strokeWidth="1.2"/>
                      <text x={DX+DW/2} y={fy+18} textAnchor="middle" fill={f.color}
                        fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{f.label}</text>
                    </g>
                  );
                })}
              </g>
            );
          },
        },
      ];

      const N         = pySteps.length;
      const activeIdx = Math.min(pyStep, N - 1);
      const localT    = t;
      const cardOp    = ease(clamp01(localT * 6));
      const s         = pySteps[activeIdx];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={20} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif">Python + pymongo — Materials Database</text>
          {pySteps.map((st, di) => (
            <circle key={di} cx={W/2-(N-1)*16+di*32} cy={33} r={di===activeIdx?5.5:3.5}
              fill={di<=activeIdx?st.color:P.dim} opacity={di===activeIdx?1:0.45}/>
          ))}
          <text x={W/2} y={50} textAnchor="middle" fill={s.color} fontSize="10.5" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>{s.label}</text>

          <rect x={CX} y={PY2} width={CW} height={PH2} rx="7"
            fill={P.surface} stroke={s.color+"50"} strokeWidth="1.3" opacity={cardOp}/>
          <rect x={CX} y={PY2} width={CW} height={18} rx="6" fill={s.color+"22"} opacity={cardOp}/>
          <text x={CX+8} y={PY2+13} fill={s.color} fontSize="7.5" fontWeight="700"
            fontFamily="monospace" opacity={cardOp}>python</text>
          {s.lines.map((ln, li) => {
            const lineOp = ease(clamp01((localT - li*0.055)*7));
            const y = PY2+30+li*LH;
            return (
              <text key={li} x={CX+8} y={y} fill={lc(ln)} fontSize="7.8"
                fontFamily="'Fira Code','Consolas',monospace"
                fontStyle={ln.trimStart().startsWith("#")?"italic":"normal"}
                opacity={Math.min(cardOp, lineOp)}>{ln}</text>
            );
          })}

          <line x1={CX+CW+4} y1={PY2+10} x2={CX+CW+4} y2={PY2+PH2-10}
            stroke={P.border} strokeWidth="0.8" opacity={cardOp*0.5}/>

          <rect x={DX} y={PY2} width={DW} height={PH2} rx="7"
            fill={P.surface+"80"} stroke={s.color+"30"} strokeWidth="1" opacity={cardOp}/>
          {s.diagram(cardOp, localT)}

          <rect x={CX} y={PY2+PH2+4} width={W-CX*2} height={22} rx="5"
            fill={s.color+"18"} stroke={s.color+"45"} strokeWidth="1" opacity={cardOp}/>
          <text x={W/2} y={PY2+PH2+19} textAnchor="middle" fill={s.color} fontSize="8.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>{"\u25B6"}  {s.note}</text>
        </svg>
      );
    }

    // ── MATERIALS DB WORKFLOW ────────────────────────────────────────────
    case "workflow": {
      const CX = 12, CW = 250, DX = 270, DW = 276;
      const PY2 = 58, PH2 = 330;
      const LH = 19;
      const lc = (ln) => {
        if (!ln||ln.trim()==="") return P.muted;
        if (ln.trimStart().startsWith("#")) return "#5a6882";
        if (ln.startsWith("from ")||ln.startsWith("import ")) return P.chunk;
        return P.ink;
      };

      const wfSteps = [
        {
          label: "\u2460 Load PDF & Chunk",
          color: P.chunk,
          lines: [
            `from langchain.document_loaders \\`,
            `    import PyPDFLoader`,
            `from langchain.text_splitter \\`,
            `    import RecursiveCharacterTextSplitter`,
            ``,
            `loader = PyPDFLoader("ZnTe.pdf")`,
            `docs   = loader.load()`,
            `splitter = RecursiveCharacterTextSplitter(`,
            `    chunk_size=1000,`,
            `    chunk_overlap=200`,
            `)`,
            `chunks = splitter.split_documents(docs)`,
            `# \u2192 42 chunks stored in memory`,
          ],
          note: "PDF \u2192 text chunks \u2192 ready for embedding & storage",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <rect x={DX+20} y={PY2+30} width={80} height={60} rx="6"
                fill={P.surface} stroke={P.chunk+"70"} strokeWidth="1.2"/>
              <text x={DX+60} y={PY2+55} textAnchor="middle" fill={P.chunk}
                fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">PDF</text>
              <text x={DX+60} y={PY2+70} textAnchor="middle" fill={P.muted}
                fontSize="7" fontFamily="'Inter',sans-serif">28 pages</text>
              <line x1={DX+100} y1={PY2+60} x2={DX+130} y2={PY2+60} stroke={P.chunk} strokeWidth="1.5"/>
              <polygon points={`${DX+128},${PY2+56} ${DX+128},${PY2+64} ${DX+136},${PY2+60}`} fill={P.chunk}/>
              {[0,1,2,3,4].map(i => (
                <g key={i} opacity={ease(clamp01((lt-0.3-i*0.08)*5))}>
                  <rect x={DX+140} y={PY2+24+i*26} width={110} height={20} rx="4"
                    fill={P.surface} stroke={i===0?P.chunk+"80":P.dim+"40"} strokeWidth="1"/>
                  <text x={DX+195} y={PY2+38+i*26} textAnchor="middle" fill={i===0?P.chunk:P.dim}
                    fontSize="7" fontFamily="monospace">chunk {i+1}</text>
                </g>
              ))}
            </g>
          ),
        },
        {
          label: "\u2461 LLM Extracts Recipe",
          color: P.rag,
          lines: [
            `from langchain_openai import ChatOpenAI`,
            ``,
            `llm = ChatOpenAI(model="gpt-4o-mini")`,
            ``,
            `prompt = f"""Extract from:`,
            `{relevant_chunks}`,
            ``,
            `Return JSON with:`,
            `  material, Eg_eV, sigma_eV,`,
            `  confidence, route, T_synth_C,`,
            `  precursor, sources""`,
            ``,
            `recipe = llm.invoke(prompt)`,
          ],
          note: "LLM reads chunks \u2192 structured JSON recipe",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <rect x={DX+20} y={PY2+20} width={80} height={40} rx="6"
                fill={P.surface} stroke={P.chunk+"60"} strokeWidth="1"/>
              <text x={DX+60} y={PY2+44} textAnchor="middle" fill={P.chunk}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">Chunks</text>
              <line x1={DX+100} y1={PY2+40} x2={DX+130} y2={PY2+40} stroke={P.rag} strokeWidth="1.5"/>
              <polygon points={`${DX+128},${PY2+36} ${DX+128},${PY2+44} ${DX+136},${PY2+40}`} fill={P.rag}/>
              <rect x={DX+140} y={PY2+20} width={100} height={50} rx="8"
                fill={P.surface} stroke={P.rag} strokeWidth="1.5"/>
              <text x={DX+190} y={PY2+42} textAnchor="middle" fill={P.rag}
                fontSize="9" fontWeight="800" fontFamily="'Inter',sans-serif">GPT-4o</text>
              <text x={DX+190} y={PY2+56} textAnchor="middle" fill={P.muted}
                fontSize="7" fontFamily="'Inter',sans-serif">extract</text>
              <line x1={DX+190} y1={PY2+70} x2={DX+190} y2={PY2+90} stroke={P.ok} strokeWidth="1.5"/>
              <polygon points={`${DX+186},${PY2+88} ${DX+194},${PY2+88} ${DX+190},${PY2+96}`} fill={P.ok}/>
              <rect x={DX+130} y={PY2+96} width={120} height={80} rx="6"
                fill={P.surface} stroke={P.ok+"60"} strokeWidth="1.2"/>
              <text x={DX+140} y={PY2+112} fill={P.ok} fontSize="8" fontWeight="700"
                fontFamily="monospace">JSON recipe</text>
              {["material: ZnTe","Eg_eV: 2.30","confidence: 0.888","route: HIGH"].map((f,i) => (
                <text key={i} x={DX+140} y={PY2+126+i*13} fill={P.muted} fontSize="7"
                  fontFamily="monospace" opacity={ease(clamp01((lt-0.4-i*0.08)*5))}>{f}</text>
              ))}
            </g>
          ),
        },
        {
          label: "\u2462 Store in MongoDB",
          color: P.mongo,
          lines: [
            `from pymongo import MongoClient`,
            ``,
            `client = MongoClient(MONGO_URI)`,
            `db = client["materials_db"]`,
            ``,
            `# Store recipe`,
            `db.recipes.insert_one(recipe)`,
            ``,
            `# Store paper metadata`,
            `db.papers.insert_many(paper_docs)`,
            ``,
            `# Create index for fast lookup`,
            `db.recipes.create_index(`,
            `    [("material",1),("confidence",-1)]`,
            `)`,
          ],
          note: "Recipe + papers \u2192 MongoDB Atlas \u00B7 indexed for fast queries",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <rect x={DX+20} y={PY2+20} width={80} height={35} rx="6"
                fill={P.surface} stroke={P.ok+"60"} strokeWidth="1"/>
              <text x={DX+60} y={PY2+42} textAnchor="middle" fill={P.ok}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">recipe</text>
              <rect x={DX+20} y={PY2+65} width={80} height={35} rx="6"
                fill={P.surface} stroke={P.chunk+"60"} strokeWidth="1"/>
              <text x={DX+60} y={PY2+87} textAnchor="middle" fill={P.chunk}
                fontSize="8" fontWeight="700" fontFamily="'Inter',sans-serif">papers (3)</text>
              <line x1={DX+100} y1={PY2+37} x2={DX+150} y2={PY2+70} stroke={P.mongo} strokeWidth="1.5"/>
              <line x1={DX+100} y1={PY2+82} x2={DX+150} y2={PY2+82} stroke={P.mongo} strokeWidth="1.5"/>
              <g opacity={ease(clamp01((lt-0.3)*5))}>
                <rect x={DX+150} y={PY2+50} width={100} height={60} rx="6"
                  fill={P.surface} stroke={P.mongo+"70"} strokeWidth="1.5"/>
                <ellipse cx={DX+200} cy={PY2+50} rx={50} ry={8} fill={P.mongo+"25"} stroke={P.mongo} strokeWidth="1.2"/>
                <text x={DX+200} y={PY2+82} textAnchor="middle" fill={P.mongo}
                  fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">MongoDB</text>
                <text x={DX+200} y={PY2+96} textAnchor="middle" fill={P.muted}
                  fontSize="7" fontFamily="'Inter',sans-serif">materials_db</text>
              </g>
              <g opacity={ease(clamp01((lt-0.6)*4))}>
                <rect x={DX+20} y={PY2+130} width={DW-40} height={40} rx="6"
                  fill={P.surface} stroke={P.mongo+"40"} strokeWidth="1"/>
                <text x={DX+30} y={PY2+148} fill={P.mongo} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Compound Index</text>
                <text x={DX+30} y={PY2+162} fill={P.muted} fontSize="7"
                  fontFamily="monospace">{"{"}material: 1, confidence: -1{"}"}</text>
              </g>
            </g>
          ),
        },
        {
          label: "\u2463 Query & Retrieve",
          color: P.llm,
          lines: [
            `# Find high-confidence recipes`,
            `results = db.recipes.find({`,
            `    "material": "ZnTe",`,
            `    "confidence": {"$gte": 0.85},`,
            `    "sources":    {"$gte": 2},`,
            `}).sort("confidence", -1)`,
            ``,
            `for doc in results:`,
            `    print(f"{doc['material']}")`,
            `    print(f"  Eg = {doc['Eg_eV']}")`,
            `    print(f"  conf = {doc['confidence']}")`,
            `    print(f"  route = {doc['route']}")`,
            `# \u25B6 ZnTe  Eg=2.30  conf=0.888  HIGH`,
          ],
          note: "Indexed query \u2192 sub-millisecond \u00B7 sorted by confidence",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <text x={DX+8} y={PY2+22} fill={P.muted} fontSize="8" fontWeight="700"
                fontFamily="'Inter',sans-serif">Query → Filter → Sort → Return</text>
              <rect x={DX+8} y={PY2+30} width={DW-18} height={36} rx="5"
                fill={P.surface} stroke={P.llm+"60"} strokeWidth="1.2"/>
              <text x={DX+16} y={PY2+45} fill={P.llm} fontSize="7.5" fontWeight="700"
                fontFamily="monospace">Filter: material="ZnTe" AND conf{"\u2265"}0.85</text>
              <text x={DX+16} y={PY2+58} fill={P.muted} fontSize="7"
                fontFamily="monospace">Sort: confidence DESC</text>
              {[
                { mat:"ZnTe", conf:"0.920", route:"HIGH", match:true },
                { mat:"ZnTe", conf:"0.888", route:"HIGH", match:true },
                { mat:"ZnTe", conf:"0.752", route:"MED",  match:false },
              ].map((d, i) => {
                const dop = ease(clamp01((lt-0.3-i*0.1)*5));
                return (
                  <g key={i} opacity={dop}>
                    <rect x={DX+8} y={PY2+76+i*28} width={DW-18} height={22} rx="4"
                      fill={d.match?P.llm+"15":P.surface}
                      stroke={d.match?P.llm+"70":P.border} strokeWidth={d.match?1.5:0.8}/>
                    <text x={DX+16} y={PY2+91+i*28} fill={P.muted} fontSize="7.5"
                      fontFamily="monospace">{d.mat}  conf={d.conf}  {d.route}</text>
                    <text x={DX+DW-20} y={PY2+91+i*28} textAnchor="end"
                      fill={d.match?P.llm:P.warn} fontSize="7.5" fontFamily="monospace"
                      fontWeight="700">{d.match?"\u2713":"\u2717"}</text>
                  </g>
                );
              })}
            </g>
          ),
        },
        {
          label: "\u2464 Aggregate Stats",
          color: P.vector,
          lines: [
            `pipeline = [`,
            `  {"$match": {`,
            `      "material":"ZnTe"`,
            `  }},`,
            `  {"$group": {`,
            `    "_id": "$material",`,
            `    "meanEg":{"$avg":"$Eg_eV"},`,
            `    "stdEg": {"$stdDevPop":`,
            `              "$Eg_eV"},`,
            `    "count": {"$sum": 1}`,
            `  }}`,
            `]`,
            `stats = db.recipes.aggregate(pipeline)`,
          ],
          note: "All computation on server \u2014 only result sent to Python",
          diagram: (op2, lt) => (
            <g opacity={op2}>
              <text x={DX+8} y={PY2+22} fill={P.muted} fontSize="8" fontWeight="700"
                fontFamily="'Inter',sans-serif">Server-side aggregation</text>
              {[
                { stage:"$match", desc:"ZnTe only", color:P.vector },
                { stage:"$group", desc:"avg, std, n", color:P.data },
              ].map((s, i) => (
                <g key={i} opacity={ease(clamp01((lt-0.1-i*0.2)*5))}>
                  {i>0 && <line x1={DX+DW/2} y1={PY2+32+i*52-6} x2={DX+DW/2} y2={PY2+32+i*52+4}
                    stroke={s.color} strokeWidth="1.5"/>}
                  <rect x={DX+20} y={PY2+36+i*52} width={DW-40} height={38} rx="6"
                    fill={P.surface} stroke={s.color+"60"} strokeWidth="1.5"/>
                  <text x={DX+30} y={PY2+54+i*52} fill={s.color} fontSize="9" fontWeight="800"
                    fontFamily="monospace">{s.stage}</text>
                  <text x={DX+100} y={PY2+54+i*52} fill={P.muted} fontSize="8"
                    fontFamily="'Inter',sans-serif">{s.desc}</text>
                </g>
              ))}
              <g opacity={ease(clamp01((lt-0.55)*4))}>
                <line x1={DX+DW/2} y1={PY2+126} x2={DX+DW/2} y2={PY2+140} stroke={P.ok} strokeWidth="1.5"/>
                <polygon points={`${DX+DW/2-4},${PY2+138} ${DX+DW/2+4},${PY2+138} ${DX+DW/2},${PY2+146}`} fill={P.ok}/>
                <rect x={DX+20} y={PY2+148} width={DW-40} height={52} rx="6"
                  fill={P.surface} stroke={P.ok+"60"} strokeWidth="1.5"/>
                <text x={DX+30} y={PY2+164} fill={P.ok} fontSize="8" fontWeight="700"
                  fontFamily="'Inter',sans-serif">Result</text>
                {[["meanEg","2.28 eV"],["stdEg","0.017 eV"],["count","3"]].map(([k,v],i) => (
                  <text key={k} x={DX+30} y={PY2+178+i*12} fill={P.muted} fontSize="7"
                    fontFamily="monospace">{k}: {v}</text>
                ))}
              </g>
            </g>
          ),
        },
        {
          label: "\u2465 Full Pipeline",
          color: P.mongo,
          lines: [
            `# Complete workflow:`,
            `# 1. PDF \u2192 chunks (LangChain)`,
            `# 2. Chunks \u2192 embeddings`,
            `# 3. Query \u2192 retrieve \u2192 LLM`,
            `# 4. LLM \u2192 JSON recipe`,
            `# 5. recipe \u2192 MongoDB Atlas`,
            `# 6. Query / Aggregate from DB`,
            ``,
            `# All data persisted in MongoDB`,
            `# Indexed for fast retrieval`,
            `# Aggregation on server-side`,
            `# Confidence-routed pipeline`,
            `# Reproducible & auditable`,
          ],
          note: "End-to-end: PDF \u2192 LLM \u2192 MongoDB \u2192 insights",
          diagram: (op2, lt) => {
            const flow = [
              { label:"PDF",      color:P.chunk },
              { label:"Chunks",   color:P.chunk },
              { label:"LLM",      color:P.rag   },
              { label:"Recipe",   color:P.ok    },
              { label:"MongoDB",  color:P.mongo },
              { label:"Query",    color:P.llm   },
              { label:"Insights", color:P.data  },
            ];
            return (
              <g opacity={op2}>
                {flow.map((f, i) => {
                  const fop = ease(clamp01((lt - i*0.08)*5));
                  const fy = PY2+20+i*36;
                  return (
                    <g key={i} opacity={fop}>
                      {i > 0 && (
                        <>
                          <line x1={DX+DW/2} y1={fy-8} x2={DX+DW/2} y2={fy} stroke={f.color+"60"} strokeWidth="1.5"/>
                          <polygon points={`${DX+DW/2-3},${fy-2} ${DX+DW/2+3},${fy-2} ${DX+DW/2},${fy+3}`} fill={f.color+"60"}/>
                        </>
                      )}
                      <rect x={DX+60} y={fy+2} width={DW-120} height={24} rx="5"
                        fill={P.surface} stroke={f.color+"60"} strokeWidth="1.2"/>
                      <text x={DX+DW/2} y={fy+18} textAnchor="middle" fill={f.color}
                        fontSize="9" fontWeight="700" fontFamily="'Inter',sans-serif">{f.label}</text>
                    </g>
                  );
                })}
              </g>
            );
          },
        },
      ];

      const N         = wfSteps.length;
      const activeIdx = Math.min(wfStep, N - 1);
      const localT    = t;
      const cardOp    = ease(clamp01(localT * 6));
      const s         = wfSteps[activeIdx];

      return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
          <rect width={W} height={H} fill={P.bg} />
          <text x={W/2} y={20} textAnchor="middle" fill={P.ink} fontSize="10" fontWeight="700"
            fontFamily="'Inter',sans-serif">Materials DB Workflow — End-to-End</text>
          {wfSteps.map((st, di) => (
            <circle key={di} cx={W/2-(N-1)*16+di*32} cy={33} r={di===activeIdx?5.5:3.5}
              fill={di<=activeIdx?st.color:P.dim} opacity={di===activeIdx?1:0.45}/>
          ))}
          <text x={W/2} y={50} textAnchor="middle" fill={s.color} fontSize="10.5" fontWeight="800"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>{s.label}</text>

          <rect x={CX} y={PY2} width={CW} height={PH2} rx="7"
            fill={P.surface} stroke={s.color+"50"} strokeWidth="1.3" opacity={cardOp}/>
          <rect x={CX} y={PY2} width={CW} height={18} rx="6" fill={s.color+"22"} opacity={cardOp}/>
          <text x={CX+8} y={PY2+13} fill={s.color} fontSize="7.5" fontWeight="700"
            fontFamily="monospace" opacity={cardOp}>python</text>
          {s.lines.map((ln, li) => {
            const lineOp = ease(clamp01((localT - li*0.055)*7));
            const y = PY2+30+li*LH;
            return (
              <text key={li} x={CX+8} y={y} fill={lc(ln)} fontSize="7.8"
                fontFamily="'Fira Code','Consolas',monospace"
                fontStyle={ln.trimStart().startsWith("#")?"italic":"normal"}
                opacity={Math.min(cardOp, lineOp)}>{ln}</text>
            );
          })}

          <line x1={CX+CW+4} y1={PY2+10} x2={CX+CW+4} y2={PY2+PH2-10}
            stroke={P.border} strokeWidth="0.8" opacity={cardOp*0.5}/>

          <rect x={DX} y={PY2} width={DW} height={PH2} rx="7"
            fill={P.surface+"80"} stroke={s.color+"30"} strokeWidth="1" opacity={cardOp}/>
          {s.diagram(cardOp, localT)}

          <rect x={CX} y={PY2+PH2+4} width={W-CX*2} height={22} rx="5"
            fill={s.color+"18"} stroke={s.color+"45"} strokeWidth="1" opacity={cardOp}/>
          <text x={W/2} y={PY2+PH2+19} textAnchor="middle" fill={s.color} fontSize="8.5" fontWeight="600"
            fontFamily="'Inter',sans-serif" opacity={cardOp}>{"\u25B6"}  {s.note}</text>
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
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: P.muted, textTransform: "uppercase", marginBottom: 4 }}>
          Animated Module
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.mongo, marginBottom: 4 }}>
          MongoDB — Document Database for Materials Science
        </div>
        <div style={{ fontSize: 13, color: P.muted, lineHeight: 1.5 }}>
          What is MongoDB · Python pymongo · end-to-end materials workflow.
        </div>
      </div>

      <div style={{
        background: P.bg, borderRadius: 16, overflow: "hidden",
        border: `2px solid ${P.border}`, position: "relative",
      }}>
        <div style={{ position: "absolute", top: 10, left: 14, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: P.mongo+"25", border: `1px solid ${P.mongo}50`, padding: "3px 10px",
            borderRadius: 6, fontSize: 10, fontWeight: 700, color: P.mongo, letterSpacing: 1 }}>
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
          <div style={{ height: "100%", background: P.mongo, width: `${progress * 100}%`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: P.panel, padding: "10px 14px", borderRadius: 12, border: `1px solid ${P.border}` }}>
        <button onClick={sceneIdx === SCENES.length - 1 && !playing ? playAll : togglePause} style={{
          width: 40, height: 40, borderRadius: 10, border: `2px solid ${P.mongo}`,
          background: P.mongo+"15", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18, color: P.mongo, fontWeight: 900, fontFamily: "inherit",
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
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${P.mongo}, ${P.rag}, ${P.data})`, width: `${globalProgress * 100}%`, borderRadius: 3 }} />
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

      {/* pymongo step buttons */}
      {scene.id === "pymongo" && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center", background: P.panel, padding: "8px 12px", borderRadius: 10, border: `1px solid ${P.border}` }}>
          <span style={{ fontSize: 10, color: P.muted, fontWeight: 700, marginRight: 4, letterSpacing: 1, textTransform: "uppercase" }}>Step</span>
          {["\u2460 Connect","\u2461 Schema","\u2462 Insert","\u2463 Query","\u2464 Aggregate","\u2465 Pipeline"].map((label, i) => (
            <button key={i} onClick={() => goPyStep(i)} style={{
              padding: "5px 11px", borderRadius: 7, fontSize: 10, cursor: "pointer",
              background: i === pyStep ? P.mongo+"25" : "transparent",
              border: `1px solid ${i === pyStep ? P.mongo : P.border}`,
              color: i === pyStep ? P.mongo : i < pyStep ? P.rag : P.muted,
              fontWeight: i === pyStep ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          <button onClick={() => pyStep > 0 && goPyStep(pyStep - 1)} disabled={pyStep === 0}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: pyStep > 0 ? "pointer" : "default", color: pyStep > 0 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: pyStep > 0 ? 1 : 0.3 }}>{"\u2190"}</button>
          <button onClick={() => pyStep < PY_STEPS - 1 && goPyStep(pyStep + 1)} disabled={pyStep === PY_STEPS - 1}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: pyStep < PY_STEPS - 1 ? "pointer" : "default", color: pyStep < PY_STEPS - 1 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: pyStep < PY_STEPS - 1 ? 1 : 0.3 }}>{"\u2192"}</button>
        </div>
      )}

      {/* workflow step buttons */}
      {scene.id === "workflow" && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center", background: P.panel, padding: "8px 12px", borderRadius: 10, border: `1px solid ${P.border}` }}>
          <span style={{ fontSize: 10, color: P.muted, fontWeight: 700, marginRight: 4, letterSpacing: 1, textTransform: "uppercase" }}>Step</span>
          {["\u2460 Load PDF","\u2461 LLM Extract","\u2462 Store DB","\u2463 Query","\u2464 Aggregate","\u2465 Pipeline"].map((label, i) => (
            <button key={i} onClick={() => goWfStep(i)} style={{
              padding: "5px 11px", borderRadius: 7, fontSize: 10, cursor: "pointer",
              background: i === wfStep ? P.mongo+"25" : "transparent",
              border: `1px solid ${i === wfStep ? P.mongo : P.border}`,
              color: i === wfStep ? P.mongo : i < wfStep ? P.rag : P.muted,
              fontWeight: i === wfStep ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }}/>
          <button onClick={() => wfStep > 0 && goWfStep(wfStep - 1)} disabled={wfStep === 0}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: wfStep > 0 ? "pointer" : "default", color: wfStep > 0 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: wfStep > 0 ? 1 : 0.3 }}>{"\u2190"}</button>
          <button onClick={() => wfStep < WF_STEPS - 1 && goWfStep(wfStep + 1)} disabled={wfStep === WF_STEPS - 1}
            style={{ padding: "5px 12px", borderRadius: 7, border: `1px solid ${P.border}`, background: "transparent", cursor: wfStep < WF_STEPS - 1 ? "pointer" : "default", color: wfStep < WF_STEPS - 1 ? P.ink : P.dim, fontSize: 13, fontFamily: "inherit", opacity: wfStep < WF_STEPS - 1 ? 1 : 0.3 }}>{"\u2192"}</button>
        </div>
      )}

      {/* Scene chips */}
      <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => goScene(i)} style={{
            padding: "5px 10px", borderRadius: 6, fontSize: 10, cursor: "pointer",
            background: i === sceneIdx ? P.mongo+"20" : "transparent",
            border: `1px solid ${i === sceneIdx ? P.mongo : P.border}`,
            color: i === sceneIdx ? P.mongo : i < sceneIdx ? P.rag : P.muted,
            fontWeight: i === sceneIdx ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
