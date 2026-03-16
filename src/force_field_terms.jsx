import { useState, useEffect, useRef } from "react";
# Plan: Merge 3 JSX Apps into One Unified Light-Gray App

## Context
The user has 3 separate React apps (defectnet_full_pipeline, electron_origins, force_field_terms) each with their own dark/warm color schemes. They want them merged into **one single file** with a **light gray** color scheme since dark colors are hard to see.

## Files to Merge
- `/Users/habibur/Downloads/my-app/src/defectnet_full_pipeline.jsx` (~1385 lines) — GNN pipeline visualization
- `/Users/habibur/Downloads/my-app/src/electron_origins.jsx` (~1209 lines) — semiconductor physics education
- `/Users/habibur/Downloads/my-app/src/force_field_terms.jsx` (~936 lines) — classical force field terms

## Output
- **New file:** `/Users/habibur/Downloads/my-app/src/materials_lab.jsx` (~3700 lines)
- **Update:** `/Users/habibur/Downloads/my-app/src/main.jsx` to import `MaterialsLab`

---

## 1. Unified Light Gray Color Palette (`T`)

Replace all 3 color objects (`C`, `P`, `C`) with one `T` object:

| Key | Hex | Purpose |
|-----|-----|---------|
| bg | #f0f2f5 | Light gray background |
| panel | #ffffff | White panels |
| surface | #f7f8fa | Off-white nested areas |
| border | #d4d8e0 | Medium gray borders |
| ink | #1a1e2e | Dark text (replaces text/ink) |
| muted | #6b7280 | Secondary text |
| dim | #c0c6d0 | Faint elements |
| gold | #b8860b | Marker accent |
| dn1-dn6 | darkened accent colors | DefectNet semantic colors |
| eo_e, eo_hole, etc. | darkened physics colors | Electron Origins colors |
| ff_bond, ff_angle, etc. | darkened term colors | Force Field colors |

All accent colors darkened from their bright-on-dark originals to be readable on light gray.

## 2. Navigation: Two-Level Tabs

**Top level** — 3 module tabs in a sticky header:
- "GNN Pipeline" (defectnet)
- "Electron Origins"
- "Force Fields"

**Second level** — each module keeps its own section tabs (7 / 6 / 7 sections).
Each module preserves its own section state independently so switching modules doesn't lose position.

## 3. Conflict Resolution

| Conflict | Resolution |
|----------|------------|
| Two `C` color objects | Both replaced by single `T` |
| `P` color object | Replaced by `T` |
| Two `Card` components | Merged: unified Card supports both `title` and optional `formula` prop |
| `SECTIONS` arrays | Renamed: `PIPELINE_SECTIONS`, `ELECTRON_SECTIONS`, `FF_TABS` |
| Three default exports | Renamed to internal: `PipelineModule`, `ElectronsModule`, `ForceFieldModule` |

## 4. File Structure (top to bottom)

```
1. import { useState, useEffect, useRef, useMemo } from "react"
2. Unified palette T (~25 lines)
3. Shared Card component (~20 lines)
4. === DEFECTNET === math, data, builders, PIPELINE_SECTIONS, components (MR, Vec, MolSVG), 7 sections, PipelineModule
5. === ELECTRON ORIGINS === helpers, components (Tag, SectionTitle), ELECTRON_SECTIONS, 6 sections, ElectronsModule
6. === FORCE FIELDS === math, components (Plot, SliderRow, ResultBox, CalcRow), FF_TABS, 7 sections, ForceFieldModule
7. === UNIFIED SHELL === MODULE_TABS, export default MaterialsLab
```

## 5. Color Migration (search-replace per file)

- defectnet: `C.accent1`→`T.dn1`, ..., `C.text`→`T.ink`, `C.bg`→`T.bg`, etc.
- electron_origins: `P.e`→`T.eo_e`, `P.text`→`T.ink`, `P.card`→`T.surface`, etc.
- force_field: `C.bond`→`T.ff_bond`, `C.ink`→`T.ink`, `C.light`→`T.surface`, etc.

## 6. Each Module's Changes

Each module wrapper (`PipelineModule`, `ElectronsModule`, `ForceFieldModule`):
- Remove outermost `minHeight: 100vh` + background wrapper (unified shell provides it)
- Remove top header/title bar (unified header replaces it)
- Keep section tabs, content area, bottom nav
- Keep all internal state (section selection, molecule picker, etc.)

## 7. Verification

1. `npx vite build` — no errors
2. Click through all 3 module tabs
3. Click through every section in each module
4. Verify 3-body tab doesn't freeze browser
5. Check SVG visualizations look correct on light background
6. Verify interactive sliders/selectors work in Force Fields and Electron Origins

          <line x1={markerSX} y1={pad.t} x2={markerSX} y2={pad.t+H}
            stroke={C.gold} strokeWidth={1.5} strokeDasharray="4 3"/>
          <circle cx={markerSX} cy={toSY(clamp(
            data.reduce((best,[x,y]) => Math.abs(x-markerX)<Math.abs(best[0]-markerX)?[x,y]:best, data[0])[1],
            yMin, yMax
          ))} r={5} fill={C.gold} stroke={C.panel} strokeWidth={1.5}/>
        </>
      )}
    </svg>
  );
}

// ── SHARED CARD ──────────────────────────────────────────────────────────────
function Card({ color, title, formula, children }) {
  return (
    <div style={{
      background: C.panel,
      border: `1.5px solid ${color}44`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      padding: "16px 18px",
      marginBottom: 0,
    }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:10 }}>
        <div style={{ fontSize:13, fontWeight:800, color, letterSpacing:0.5 }}>{title}</div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:C.ink, background:color+"11",
          padding:"2px 10px", borderRadius:4, border:`1px solid ${color}33` }}>{formula}</div>
      </div>
      {children}
    </div>
  );
}

function SliderRow({ label, value, min, max, step, onChange, color, unit, format }) {
  const fmt = format || (v => v.toFixed(2));
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:12, color:C.muted }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color, fontFamily:"monospace" }}>
          {fmt(value)}{unit||""}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(+e.target.value)}
        style={{ width:"100%", accentColor:color, cursor:"pointer" }}/>
    </div>
  );
}

function ResultBox({ label, value, color, sub }) {
  return (
    <div style={{
      background: color+"11", border:`1px solid ${color}33`,
      borderRadius:8, padding:"8px 12px", textAlign:"center",
    }}>
      <div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:800, color, fontFamily:"monospace" }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function CalcRow({ eq, result, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, fontSize:12 }}>
      <span style={{ color:C.muted, fontFamily:"monospace", flex:1 }}>{eq}</span>
      <span style={{ color:C.dim }}>=</span>
      <span style={{ color:color||C.ink, fontWeight:700, fontFamily:"monospace", minWidth:70, textAlign:"right" }}>{result}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BOND HARMONIC
// ─────────────────────────────────────────────────────────────────────────────
function BondSection() {
  const [r, setR] = useState(2.5);
  const [r0, setR0] = useState(2.35);
  const [kb, setKb] = useState(15.0);

  const dr = r - r0;
  const U = 0.5 * kb * dr * dr;
  const F = -kb * dr;

  const N = 120;
  const energyCurve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(4.5/N);
    return [x, 0.5*kb*sq(x-r0)];
  });
  const forceCurve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(4.5/N);
    return [x, -kb*(x-r0)];
  });

  return (
    <Card color={C.bond} title="Bond (Harmonic)" formula="U = ½ kᵦ(r − r₀)²">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={energyCurve} xMin={0.5} xMax={4.5} yMin={0} yMax={Math.min(30, 0.5*kb*sq(4.5-r0))}
            color={C.bond} markerX={r} width={340} height={170} xLabel="r (Å)" yLabel="U (eV)"/>
          <div style={{ marginTop:6 }}>
            <Plot data={forceCurve} xMin={0.5} xMax={4.5} yMin={-kb*2} yMax={kb*2}
              color={C.bond} markerX={r} width={340} height={110} xLabel="r (Å)" yLabel="F (eV/Å)"/>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — current distance" value={r} min={0.8} max={4.5} step={0.01} onChange={setR} color={C.bond} unit=" Å"/>
          <SliderRow label="r₀ — equilibrium" value={r0} min={1.0} max={3.5} step={0.05} onChange={setR0} color={C.bond} unit=" Å"/>
          <SliderRow label="kᵦ — stiffness" value={kb} min={1} max={40} step={0.5} onChange={setKb} color={C.bond} unit=" eV/Å²"/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`r − r₀ = ${r.toFixed(2)} − ${r0.toFixed(2)}`} result={`${dr.toFixed(3)} Å`} color={C.bond}/>
            <CalcRow eq={`(r−r₀)² = ${dr.toFixed(3)}²`} result={`${sq(dr).toFixed(4)} Å²`} color={C.bond}/>
            <CalcRow eq={`½ × ${kb} × ${sq(dr).toFixed(4)}`} result={`${U.toFixed(4)} eV`} color={C.bond}/>
            <CalcRow eq={`F = −kᵦ(r−r₀)`} result={`${F.toFixed(3)} eV/Å`} color={F>0?C.vdw:C.bond}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(3)} eV`} color={C.bond}/>
            <ResultBox label="Force F" value={`${F.toFixed(3)} eV/Å`} color={F>0?C.vdw:C.bond}
              sub={F>0?"← pushes outward":F<0?"→ pulls inward":"equilibrium"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Symmetric spring.</strong> Stretch or compress by the same amount → same energy cost.
            Force is zero only at r₀. Always pushes back toward equilibrium.
            <br/><strong style={{color:C.bond}}>Limitation:</strong> bond never breaks — energy rises forever.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ANGLE HARMONIC
// ─────────────────────────────────────────────────────────────────────────────
function AngleSection() {
  const [theta, setTheta] = useState(109.5);
  const [theta0, setTheta0] = useState(109.5);
  const [kth, setKth] = useState(2.5);

  const toRad = d => d * Math.PI / 180;
  const dth = toRad(theta) - toRad(theta0);
  const U = 0.5 * kth * dth * dth;

  const N = 120;
  const energyCurve = Array.from({length:N},(_,i)=>{
    const deg = 30 + i*(150/N);
    const dt = toRad(deg) - toRad(theta0);
    return [deg, 0.5*kth*dt*dt];
  });

  // SVG angle picture
  const cx=70, cy=100, r1=55;
  const ang1 = -140 * Math.PI/180;
  const ang2 = ang1 + toRad(theta);
  const ax1 = cx + r1*Math.cos(ang1), ay1 = cy + r1*Math.sin(ang1);
  const ax2 = cx + r1*Math.cos(ang2), ay2 = cy + r1*Math.sin(ang2);

  return (
    <Card color={C.angle} title="Angle (Harmonic)" formula="U = ½ kθ(θ − θ₀)²">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={energyCurve} xMin={30} xMax={180} yMin={0} yMax={Math.max(0.5, 0.5*kth*sq(toRad(30)-toRad(theta0)))}
            color={C.angle} markerX={theta} width={340} height={170} xLabel="θ (degrees)" yLabel="U (eV)"/>
          {/* Molecule angle SVG */}
          <svg width={340} height={130} style={{ marginTop:6, background:C.light, borderRadius:8, border:`1px solid ${C.border}`, display:"block" }}>
            {/* Bonds */}
            <line x1={cx} y1={cy} x2={ax1} y2={ay1} stroke={C.angle} strokeWidth={3}/>
            <line x1={cx} y1={cy} x2={ax2} y2={ay2} stroke={C.angle} strokeWidth={3}/>
            {/* Arc */}
            <path d={`M ${cx+25*Math.cos(ang1)} ${cy+25*Math.sin(ang1)} A 25 25 0 ${theta>180?1:0} 1 ${cx+25*Math.cos(ang2)} ${cy+25*Math.sin(ang2)}`}
              fill="none" stroke={C.gold} strokeWidth={2}/>
            {/* Atoms */}
            <circle cx={cx} cy={cy} r={16} fill={C.angle+"33"} stroke={C.angle} strokeWidth={2}/>
            <text x={cx} y={cy+4} textAnchor="middle" fill={C.angle} fontSize={11} fontWeight="bold">Zn</text>
            <circle cx={ax1} cy={ay1} r={13} fill={C.vdw+"33"} stroke={C.vdw} strokeWidth={2}/>
            <text x={ax1} y={ay1+4} textAnchor="middle" fill={C.vdw} fontSize={11} fontWeight="bold">Te</text>
            <circle cx={ax2} cy={ay2} r={13} fill={C.vdw+"33"} stroke={C.vdw} strokeWidth={2}/>
            <text x={ax2} y={ay2+4} textAnchor="middle" fill={C.vdw} fontSize={11} fontWeight="bold">Te</text>
            <text x={cx+40} y={cy-12} fill={C.gold} fontSize={13} fontWeight="bold">θ={theta.toFixed(1)}°</text>
            {/* Equilibrium dashed */}
            <line x1={cx} y1={cy} x2={cx+r1*Math.cos(ang1+toRad(theta0))} y2={cy+r1*Math.sin(ang1+toRad(theta0))}
              stroke={C.dim} strokeWidth={1.5} strokeDasharray="5 3"/>
            <text x={200} y={50} fill={C.muted} fontSize={10}>dashed = θ₀={theta0.toFixed(0)}°</text>
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="θ — current angle" value={theta} min={30} max={175} step={0.5} onChange={setTheta} color={C.angle} unit="°"/>
          <SliderRow label="θ₀ — equilibrium angle" value={theta0} min={60} max={160} step={0.5} onChange={setTheta0} color={C.angle} unit="°"/>
          <SliderRow label="kθ — angular stiffness" value={kth} min={0.1} max={10} step={0.1} onChange={setKth} color={C.angle} unit=" eV/rad²"/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`θ = ${theta.toFixed(1)}° = ${toRad(theta).toFixed(4)} rad`} result="" color={C.angle}/>
            <CalcRow eq={`θ₀ = ${theta0.toFixed(1)}° = ${toRad(theta0).toFixed(4)} rad`} result="" color={C.angle}/>
            <CalcRow eq={`θ − θ₀ = ${dth.toFixed(4)} rad`} result={`${(dth*180/Math.PI).toFixed(2)}°`} color={C.angle}/>
            <CalcRow eq={`½ × ${kth} × ${sq(dth).toFixed(5)}`} result={`${U.toFixed(5)} eV`} color={C.angle}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={C.angle}/>
            <ResultBox label="Δθ" value={`${(dth*180/Math.PI).toFixed(1)}°`} color={C.angle}
              sub={Math.abs(dth) < 0.01 ? "at equilibrium" : dth>0?"opened":"closed"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Same formula as bond — but for angles.</strong> Three atoms.
            Middle atom is the hinge. kθ controls how rigid the angle is.
            Large kθ = rigid (diamond-like). Small kθ = floppy.
            <br/><strong style={{color:C.angle}}>Key:</strong> θ₀=109.5° for tetrahedral bonding (like Zn in ZnTe).
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VAN DER WAALS (LJ 12-6)
// ─────────────────────────────────────────────────────────────────────────────
function VdwSection() {
  const [r, setR] = useState(3.82);
  const [eps, setEps] = useState(0.0104);
  const [sig, setSig] = useState(3.40);

  const lj = (rr) => {
    const s = sig/rr;
    return 4*eps*(Math.pow(s,12) - Math.pow(s,6));
  };
  const U = lj(r);
  const rMin = Math.pow(2, 1/6) * sig;

  const N = 150;
  const curve = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    const y = lj(x);
    return [x, y];
  }).filter(([,y])=>y<eps*6);

  // repulsive and attractive separately for annotation
  const rep = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    return [x, 4*eps*Math.pow(sig/x,12)];
  }).filter(([,y])=>y<eps*6);
  const att = Array.from({length:N},(_,i)=>{
    const x = sig*0.85 + i*(sig*2.5/N);
    return [x, -4*eps*Math.pow(sig/x,6)];
  }).filter(([,y])=>y>-eps*1.5);

  const yMax = eps*3, yMin = -eps*1.5;

  const repPts = rep.filter(([,y])=>y<yMax).map(([x,y])=>{
    const W2=340, pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r, HH=170-pad.t-pad.b;
    const xMin=sig*0.85, xMax=sig*3.35;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");
  const attPts = att.map(([x,y])=>{
    const W2=340, pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r, HH=170-pad.t-pad.b;
    const xMin=sig*0.85, xMax=sig*3.35;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");

  return (
    <Card color={C.vdw} title="van der Waals (Lennard-Jones 12-6)" formula="U = 4ε[(σ/r)¹² − (σ/r)⁶]">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={sig*0.85} xMax={sig*3.35} yMin={yMin} yMax={yMax}
            color={C.vdw} markerX={r} width={340} height={170} xLabel="r (Å)" yLabel="U (eV)"
            extra={[
              {pts:repPts, color:C.bond, dash:"4 3"},
              {pts:attPts, color:C.coul, dash:"4 3"},
            ]}/>
          <div style={{ marginTop:6, fontSize:10, color:C.muted, display:"flex", gap:16, padding:"0 8px" }}>
            <span>── <span style={{color:C.vdw}}>Total U</span></span>
            <span>- - <span style={{color:C.bond}}>Repulsive r¹²</span></span>
            <span>- - <span style={{color:C.coul}}>Attractive r⁶</span></span>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — distance" value={r} min={sig*0.85} max={sig*3.3} step={0.01}
            onChange={setR} color={C.vdw} unit=" Å"/>
          <SliderRow label="ε — well depth (attraction)" value={eps} min={0.001} max={0.05} step={0.001}
            onChange={setEps} color={C.vdw} unit=" eV" format={v=>v.toFixed(4)}/>
          <SliderRow label="σ — zero-crossing radius" value={sig} min={2.0} max={5.5} step={0.05}
            onChange={setSig} color={C.vdw} unit=" Å"/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`σ/r = ${sig.toFixed(2)}/${r.toFixed(2)}`} result={`${(sig/r).toFixed(4)}`} color={C.vdw}/>
            <CalcRow eq={`(σ/r)⁶`} result={`${Math.pow(sig/r,6).toFixed(4)}`} color={C.coul}/>
            <CalcRow eq={`(σ/r)¹²`} result={`${Math.pow(sig/r,12).toFixed(4)}`} color={C.bond}/>
            <CalcRow eq={`4ε×[(σ/r)¹²−(σ/r)⁶]`} result={`${U.toFixed(5)} eV`} color={C.vdw}/>
            <CalcRow eq={`r_min = 2^(1/6)×σ`} result={`${rMin.toFixed(3)} Å`} color={C.gold}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={U>0?C.bond:C.vdw}
              sub={U>0?"repulsive":"attractive"}/>
            <ResultBox label="r_min (energy minimum)" value={`${rMin.toFixed(2)} Å`} color={C.gold}
              sub={`U_min = −ε = ${(-eps).toFixed(4)} eV`}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Non-bonded interactions between any two atoms.</strong>
            <br/><span style={{color:C.bond}}>r¹²</span> = violent repulsion when electron clouds overlap.
            <br/><span style={{color:C.coul}}>r⁶</span> = gentle London dispersion attraction.
            <br/>σ = where they "touch". ε = how sticky they are.
            Falls off as 1/r⁶ — short range. Ignore beyond ~10 Å.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COULOMB
// ─────────────────────────────────────────────────────────────────────────────
function CoulombSection() {
  const [r, setR] = useState(2.81);
  const [qi, setQi] = useState(1.0);
  const [qj, setQj] = useState(-1.0);

  // 1/(4πε₀) in eV·Å / e² = 14.4
  const k_e = 14.4;
  const U = k_e * qi * qj / r;
  const F = -k_e * qi * qj / (r*r);  // attractive = toward each other

  const N = 120;
  const curve = Array.from({length:N},(_,i)=>{
    const x = 0.5 + i*(9.5/N);
    return [x, k_e*qi*qj/x];
  });
  const yMin = Math.min(-5, k_e*qi*qj/0.5);
  const yMax = Math.max(5, k_e*qi*qj/0.5);

  return (
    <Card color={C.coul} title="Coulomb (Electrostatic)" formula="U = qᵢqⱼ / (4πε₀ rᵢⱼ)">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={0.5} xMax={10} yMin={clamp(yMin,-20,0)-0.5} yMax={clamp(yMax,0,20)+0.5}
            color={C.coul} markerX={r} width={340} height={180} xLabel="r (Å)" yLabel="U (eV)"/>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          {/* Charge selector */}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>qᵢ — charge on atom i</div>
            <div style={{ display:"flex", gap:6 }}>
              {[-2,-1,0,+1,+2].map(v=>(
                <button key={v} onClick={()=>setQi(v)} style={{
                  flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700,
                  background: qi===v ? C.coul+"33" : C.light,
                  border:`1.5px solid ${qi===v ? C.coul : C.border}`,
                  color: qi===v ? C.coul : C.muted, cursor:"pointer",
                }}>{v>0?"+":""}{v}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>qⱼ — charge on atom j</div>
            <div style={{ display:"flex", gap:6 }}>
              {[-2,-1,0,+1,+2].map(v=>(
                <button key={v} onClick={()=>setQj(v)} style={{
                  flex:1, padding:"6px 0", borderRadius:6, fontSize:12, fontWeight:700,
                  background: qj===v ? C.dih+"33" : C.light,
                  border:`1.5px solid ${qj===v ? C.dih : C.border}`,
                  color: qj===v ? C.dih : C.muted, cursor:"pointer",
                }}>{v>0?"+":""}{v}</button>
              ))}
            </div>
          </div>
          <SliderRow label="r — distance" value={r} min={0.5} max={10} step={0.05} onChange={setR} color={C.coul} unit=" Å"/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`qᵢ × qⱼ = ${qi} × ${qj}`} result={`${qi*qj} e²`}
              color={qi*qj<0?C.vdw:qi*qj>0?C.bond:C.muted}/>
            <CalcRow eq={`k_e = 1/(4πε₀) = 14.4 eV·Å/e²`} result="constant"/>
            <CalcRow eq={`U = 14.4 × ${qi*qj} / ${r.toFixed(2)}`} result={`${U.toFixed(3)} eV`} color={C.coul}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(3)} eV`} color={U<0?C.vdw:U>0?C.bond:C.muted}
              sub={U<0?"attractive":U>0?"repulsive":"neutral (q=0)"}/>
            <ResultBox label="Interaction type" value={qi*qj<0?"Attract":qi*qj>0?"Repel":"None"}
              color={qi*qj<0?C.vdw:qi*qj>0?C.bond:C.muted}
              sub={qi*qj<0?"opposite charges":qi*qj>0?"like charges":"one is neutral"}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Long-range force between charged atoms.</strong>
            Falls off as 1/r — much slower than vdW (1/r⁶). Still significant at 100 Å!
            <br/><strong style={{color:C.coul}}>Sign rule:</strong> same charges (+×+ or −×−) → U positive → repel.
            Opposite (+×−) → U negative → attract.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIHEDRAL / TORSION
// ─────────────────────────────────────────────────────────────────────────────
function DihedralSection() {
  const [phi, setPhi] = useState(0);
  const [n, setN] = useState(3);
  const [kn, setKn] = useState(0.3);
  const [delta, setDelta] = useState(0);

  const toRad = d => d*Math.PI/180;
  const U = kn * (1 + Math.cos(n*toRad(phi) - toRad(delta)));

  const N = 180;
  const curve = Array.from({length:N},(_,i)=>{
    const p = -180 + i*(360/N);
    return [p, kn*(1+Math.cos(n*toRad(p)-toRad(delta)))];
  });

  // 4-atom torsion SVG
  const cx=170, cy=75;
  const phiR = toRad(phi);
  // atoms along z-axis, dihedral is view from the end
  const r=45;
  const atom1 = [cx-60, cy];
  const atom2 = [cx-20, cy];
  const atom3 = [cx+20, cy];
  const atom4 = [cx+60, cy];
  // dihedral = rotation of atom1 relative to atom4 around 2-3 axis (view from end)
  const e1x = cx-20 + r*Math.cos(Math.PI + phiR);
  const e1y = cy   + r*Math.sin(Math.PI + phiR);
  const e4x = cx+20 + r*Math.cos(0);
  const e4y = cy;

  return (
    <Card color={C.dih} title="Dihedral (Torsion)" formula="U = Σₙ kₙ[1 + cos(nϕ − δₙ)]">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={curve} xMin={-180} xMax={180} yMin={0} yMax={kn*2.1}
            color={C.dih} markerX={phi} width={340} height={170} xLabel="ϕ (degrees)" yLabel="U (eV)"/>

          {/* 4-atom side + end view */}
          <svg width={340} height={120} style={{ marginTop:6, background:C.light, borderRadius:8, border:`1px solid ${C.border}`, display:"block" }}>
            {/* side view */}
            <text x={85} y={15} textAnchor="middle" fill={C.muted} fontSize={9}>Side view</text>
            <line x1={atom1[0]} y1={atom1[1]} x2={atom2[0]} y2={atom2[1]} stroke={C.dih} strokeWidth={2}/>
            <line x1={atom2[0]} y1={atom2[1]} x2={atom3[0]} y2={atom3[1]} stroke={C.dih} strokeWidth={2.5}/>
            <line x1={atom3[0]} y1={atom3[1]} x2={atom4[0]} y2={atom4[1]} stroke={C.dih} strokeWidth={2}/>
            {[atom1,atom2,atom3,atom4].map(([ax,ay],i)=>(
              <g key={i}>
                <circle cx={ax} cy={ay} r={13} fill={[C.vdw,C.dih,C.dih,C.vdw][i]+"33"}
                  stroke={[C.vdw,C.dih,C.dih,C.vdw][i]} strokeWidth={1.5}/>
                <text x={ax} y={ay+4} textAnchor="middle"
                  fill={[C.vdw,C.dih,C.dih,C.vdw][i]} fontSize={9} fontWeight="bold">
                  {["C","C","C","C"][i]}{i+1}
                </text>
              </g>
            ))}

            {/* end view — looking down C2-C3 */}
            <text x={265} y={15} textAnchor="middle" fill={C.muted} fontSize={9}>End view</text>
            <circle cx={265} cy={70} r={30} fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="3 3"/>
            {/* C2 at centre (black dot) */}
            <circle cx={265} cy={70} r={8} fill={C.dih+"55"} stroke={C.dih} strokeWidth={2}/>
            {/* C1 rotated by phi */}
            <line x1={265} y1={70} x2={265+35*Math.cos(Math.PI/2+phiR)} y2={70+35*Math.sin(Math.PI/2+phiR)}
              stroke={C.vdw} strokeWidth={2}/>
            <circle cx={265+35*Math.cos(Math.PI/2+phiR)} cy={70+35*Math.sin(Math.PI/2+phiR)}
              r={10} fill={C.vdw+"44"} stroke={C.vdw} strokeWidth={1.5}/>
            <text x={265+35*Math.cos(Math.PI/2+phiR)} y={70+35*Math.sin(Math.PI/2+phiR)+4}
              textAnchor="middle" fill={C.vdw} fontSize={9}>C1</text>
            {/* C4 fixed at bottom */}
            <line x1={265} y1={70} x2={265} y2={70+35}
              stroke={C.vdw} strokeWidth={2}/>
            <circle cx={265} cy={70+35} r={10} fill={C.vdw+"44"} stroke={C.vdw} strokeWidth={1.5}/>
            <text x={265} y={70+35+4} textAnchor="middle" fill={C.vdw} fontSize={9}>C4</text>
            {/* angle arc */}
            <text x={265+18} y={70-8} fill={C.gold} fontSize={10} fontWeight="bold">ϕ={phi.toFixed(0)}°</text>
          </svg>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="ϕ — dihedral angle" value={phi} min={-180} max={180} step={1}
            onChange={setPhi} color={C.dih} unit="°" format={v=>v.toFixed(0)}/>
          <SliderRow label="n — hills per 360°" value={n} min={1} max={6} step={1}
            onChange={setN} color={C.dih} unit="" format={v=>v.toFixed(0)}/>
          <SliderRow label="kₙ — barrier height" value={kn} min={0.01} max={1.0} step={0.01}
            onChange={setKn} color={C.dih} unit=" eV/mol"/>
          <SliderRow label="δₙ — phase shift" value={delta} min={0} max={180} step={5}
            onChange={setDelta} color={C.dih} unit="°" format={v=>v.toFixed(0)}/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>CALCULATION</div>
            <CalcRow eq={`nϕ − δ = ${n}×${phi}° − ${delta}°`} result={`${(n*phi-delta).toFixed(0)}°`} color={C.dih}/>
            <CalcRow eq={`cos(${(n*phi-delta).toFixed(0)}°)`} result={`${Math.cos(toRad(n*phi-delta)).toFixed(4)}`} color={C.dih}/>
            <CalcRow eq={`1 + ${Math.cos(toRad(n*phi-delta)).toFixed(4)}`} result={`${(1+Math.cos(toRad(n*phi-delta))).toFixed(4)}`} color={C.dih}/>
            <CalcRow eq={`${kn} × ${(1+Math.cos(toRad(n*phi-delta))).toFixed(4)}`} result={`${U.toFixed(4)} eV`} color={C.dih}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Energy U" value={`${U.toFixed(4)} eV`} color={C.dih}/>
            <ResultBox label="n = hills per rotation" value={`${n}`} color={C.dih}
              sub={`valley every ${(360/n).toFixed(0)}°`}/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Energy cost of twisting 4 atoms.</strong>
            <br/><strong style={{color:C.dih}}>n=3</strong> for C-C bonds → 3 hills (eclipsed) and 3 valleys (staggered) per 360°.
            <br/>Maximum at ϕ where cos=+1 (U=2kₙ). Minimum where cos=−1 (U=0).
            <br/><strong style={{color:C.dih}}>+1 in formula</strong> ensures energy ≥ 0 always.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MORSE (ANHARMONIC)
// ─────────────────────────────────────────────────────────────────────────────
function MorseSection() {
  const [r, setR] = useState(2.5);
  const [De, setDe] = useState(2.3);
  const [a, setA] = useState(1.4);
  const [r0, setR0] = useState(2.35);

  const morse = (rr) => {
    const ex = Math.exp(-a*(rr-r0));
    return De * sq(1-ex);
  };
  const harmonic = (rr) => {
    const k = 2*De*a*a;
    return 0.5*k*sq(rr-r0);
  };

  const U = morse(r);
  const Uharm = harmonic(r);
  const rMin = r0; // morse minimum

  const N = 150;
  const morseCurve = Array.from({length:N},(_,i)=>{
    const x = r0*0.5 + i*(r0*2.5/N);
    return [x, morse(x)];
  });
  const harmCurve = Array.from({length:N},(_,i)=>{
    const x = r0*0.5 + i*(r0*2.5/N);
    const y = harmonic(x);
    return [x, y];
  });

  const yMax = De*1.3, yMin = -0.2;

  const harmPts = harmCurve.filter(([,y])=>y<yMax).map(([x,y])=>{
    const W2=340,pad={l:44,r:12,t:12,b:30};
    const WW=W2-pad.l-pad.r,HH=180-pad.t-pad.b;
    const xMin=r0*0.5,xMax=r0*3.0;
    return `${pad.l+((x-xMin)/(xMax-xMin))*WW},${pad.t+HH-((y-yMin)/(yMax-yMin))*HH}`;
  }).join(" ");

  return (
    <Card color={C.morse} title="Morse Potential (Anharmonic Bond)" formula="U = Dₑ[1 − e^{−a(r−r₀)}]²">
      <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 350px" }}>
          <Plot data={morseCurve} xMin={r0*0.5} xMax={r0*3.0} yMin={yMin} yMax={yMax}
            color={C.morse} markerX={r} width={340} height={180} xLabel="r (Å)" yLabel="U (eV)"
            extra={[{pts:harmPts, color:C.bond, dash:"5 3"}]}/>
          <div style={{ marginTop:6, fontSize:10, color:C.muted, display:"flex", gap:16, padding:"0 8px" }}>
            <span>── <span style={{color:C.morse}}>Morse (real)</span></span>
            <span>- - <span style={{color:C.bond}}>Harmonic (wrong at large r)</span></span>
          </div>
          {/* Asymmetry highlight */}
          <div style={{ marginTop:10, background:C.light, borderRadius:8, padding:10, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:6, letterSpacing:2 }}>ASYMMETRY at ±0.5Å from r₀</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              <div style={{ textAlign:"center", padding:8, background:C.bond+"11", borderRadius:6, border:`1px solid ${C.bond}33` }}>
                <div style={{ fontSize:10, color:C.muted }}>Compress 0.5Å</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.bond, fontFamily:"monospace" }}>{morse(r0-0.5).toFixed(2)} eV</div>
                <div style={{ fontSize:10, color:C.muted }}>Morse</div>
              </div>
              <div style={{ textAlign:"center", padding:8, background:C.morse+"11", borderRadius:6, border:`1px solid ${C.morse}33` }}>
                <div style={{ fontSize:10, color:C.muted }}>Stretch 0.5Å</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.morse, fontFamily:"monospace" }}>{morse(r0+0.5).toFixed(2)} eV</div>
                <div style={{ fontSize:10, color:C.muted }}>Morse</div>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:6, fontSize:11, color:C.muted }}>
              Harmonic says both = <span style={{color:C.bond, fontWeight:700}}>{harmonic(r0+0.5).toFixed(2)} eV</span> (wrong — symmetric)
            </div>
          </div>
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <SliderRow label="r — current distance" value={r} min={r0*0.55} max={r0*2.9} step={0.01}
            onChange={setR} color={C.morse} unit=" Å"/>
          <SliderRow label="Dₑ — dissociation energy" value={De} min={0.5} max={6} step={0.1}
            onChange={setDe} color={C.morse} unit=" eV"/>
          <SliderRow label="a — well width (stiffness)" value={a} min={0.5} max={3.0} step={0.05}
            onChange={setA} color={C.morse} unit=" Å⁻¹"/>
          <SliderRow label="r₀ — equilibrium" value={r0} min={1.0} max={3.5} step={0.05}
            onChange={setR0} color={C.morse} unit=" Å"/>

          <div style={{ marginTop:12, background:C.light, borderRadius:8, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:2 }}>STEP BY STEP</div>
            <CalcRow eq={`r − r₀ = ${r.toFixed(2)} − ${r0.toFixed(2)}`} result={`${(r-r0).toFixed(3)} Å`} color={C.morse}/>
            <CalcRow eq={`a(r−r₀) = ${a}×${(r-r0).toFixed(3)}`} result={`${(a*(r-r0)).toFixed(4)}`} color={C.morse}/>
            <CalcRow eq={`e^{−${(a*(r-r0)).toFixed(3)}}`} result={`${Math.exp(-a*(r-r0)).toFixed(5)}`} color={C.morse}/>
            <CalcRow eq={`1 − e^{...} `} result={`${(1-Math.exp(-a*(r-r0))).toFixed(5)}`} color={C.morse}/>
            <CalcRow eq={`[...]²`} result={`${sq(1-Math.exp(-a*(r-r0))).toFixed(5)}`} color={C.morse}/>
            <CalcRow eq={`Dₑ × [...]² = ${De} × ...`} result={`${U.toFixed(4)} eV`} color={C.morse}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <ResultBox label="Morse U" value={`${U.toFixed(3)} eV`} color={C.morse}
              sub={r>r0*2?"near broken":"bond intact"}/>
            <ResultBox label="At r→∞" value={`${De.toFixed(2)} eV`} color={C.gold}
              sub="energy plateau (broken bond)"/>
          </div>

          <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8,
            background:C.light, padding:10, borderRadius:8, border:`1px solid ${C.border}` }}>
            <strong style={{color:C.ink}}>Real asymmetric bond.</strong>
            Compression = steep wall (electron clouds clash hard).
            Stretch = gentle slope (gradually letting go).
            Bond breaks when r→∞, energy → Dₑ (flat, not infinity like harmonic).
            <br/><strong style={{color:C.morse}}>Explains:</strong> thermal expansion, bond breaking, anharmonic vibrations.
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPARISON TABLE
// ─────────────────────────────────────────────────────────────────────────────
function CompareSection() {
  const rows = [
    { name:"Bond harmonic", formula:"½kᵦ(r−r₀)²", atoms:"2 bonded", captures:"stretch/compress", fails:"never breaks", color:C.bond },
    { name:"Angle harmonic", formula:"½kθ(θ−θ₀)²", atoms:"3 bonded", captures:"bending", fails:"never stiffens at extremes", color:C.angle },
    { name:"vdW (LJ 12-6)", formula:"4ε[(σ/r)¹²−(σ/r)⁶]", atoms:"2 any", captures:"non-bonded attract/repel", fails:"short-range only", color:C.vdw },
    { name:"Coulomb", formula:"qᵢqⱼ/4πε₀r", atoms:"2 charged", captures:"long-range electrostatics", fails:"needs special treatment (Ewald)", color:C.coul },
    { name:"Dihedral", formula:"kₙ[1+cos(nϕ−δ)]", atoms:"4 bonded", captures:"rotation barrier", fails:"complex profiles need many n terms", color:C.dih },
    { name:"Morse", formula:"Dₑ[1−e^{−a(r−r₀)}]²", atoms:"2 bonded", captures:"asymmetry + bond breaking", fails:"needs De parameter per pair", color:C.morse },
  ];

  return (
    <div style={{ background:C.panel, border:`1.5px solid ${C.border}`, borderRadius:10, padding:18 }}>
      <div style={{ fontSize:14, fontWeight:800, color:C.ink, marginBottom:14, letterSpacing:0.5 }}>
        All 6 terms — side by side
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`2px solid ${C.border}` }}>
              {["Term","Formula","Atoms needed","What it captures","Where it fails"].map(h=>(
                <th key={h} style={{ padding:"6px 10px", textAlign:"left", color:C.muted, fontWeight:700, fontSize:11, letterSpacing:0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,i)=>(
              <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background: i%2===0?C.light:C.panel }}>
                <td style={{ padding:"8px 10px", color:row.color, fontWeight:700 }}>{row.name}</td>
                <td style={{ padding:"8px 10px", fontFamily:"'Georgia',serif", color:C.ink, fontSize:11 }}>{row.formula}</td>
                <td style={{ padding:"8px 10px", color:C.muted }}>{row.atoms}</td>
                <td style={{ padding:"8px 10px", color:C.ink }}>{row.captures}</td>
                <td style={{ padding:"8px 10px", color:C.muted, fontStyle:"italic" }}>{row.fails}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop:16, background:C.light, borderRadius:8, padding:14, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.ink, marginBottom:8 }}>
          Total energy of a molecule = sum of ALL applicable terms:
        </div>
        <div style={{ fontFamily:"'Georgia',serif", fontSize:14, color:C.ink, lineHeight:2 }}>
          U<sub>total</sub> = U<sub style={{color:C.bond}}>bonds</sub> + U<sub style={{color:C.angle}}>angles</sub> + U<sub style={{color:C.dih}}>dihedrals</sub> + U<sub style={{color:C.vdw}}>vdW</sub> + U<sub style={{color:C.coul}}>Coulomb</sub>
        </div>
        <div style={{ marginTop:10, fontSize:11, color:C.muted, lineHeight:1.8 }}>
          <strong style={{color:C.morse}}>DefectNet replaces ALL of this</strong> with a single GNN that learns the true
          energy surface directly from DFT — no assumed formulas, no manual parameter fitting.
          It automatically captures bonding, angles, long-range effects, and charge state dependence
          that classical force fields cannot handle.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"bond",    label:"Bond",     icon:"⎯",  color:C.bond  },
  { id:"angle",   label:"Angle",    icon:"∠",  color:C.angle },
  { id:"vdw",     label:"vdW",      icon:"◎",  color:C.vdw   },
  { id:"coulomb", label:"Coulomb",  icon:"⚡",  color:C.coul  },
  { id:"dihedral",label:"Dihedral", icon:"↻",  color:C.dih   },
  { id:"morse",   label:"Morse",    icon:"〜",  color:C.morse },
  { id:"compare", label:"Summary",  icon:"≡",  color:C.gold  },
];

export default function ForceFieldTerms() {
  const [active, setActive] = useState("bond");
  const tab = TABS.find(t=>t.id===active);

  const render = () => {
    switch(active){
      case "bond":     return <BondSection/>;
      case "angle":    return <AngleSection/>;
      case "vdw":      return <VdwSection/>;
      case "coulomb":  return <CoulombSection/>;
      case "dihedral": return <DihedralSection/>;
      case "morse":    return <MorseSection/>;
      case "compare":  return <CompareSection/>;
      default:         return null;
    }
  };

  return (
    <div style={{
      minHeight:"100vh",
      background: C.bg,
      fontFamily:"'Georgia', 'Times New Roman', serif",
      color:C.ink,
      display:"flex",
      flexDirection:"column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom:`2px solid ${C.border}`,
        padding:"14px 28px",
        background:C.panel,
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        position:"sticky", top:0, zIndex:10,
      }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:4, color:C.muted, textTransform:"uppercase", fontFamily:"sans-serif" }}>
            Classical Force Field
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:C.ink, fontFamily:"sans-serif" }}>
            The 6 Potential Energy Terms
          </div>
        </div>
        <div style={{ fontSize:11, color:C.muted, fontFamily:"sans-serif", textAlign:"right" }}>
          Drag sliders to explore live<br/>each formula with real numbers
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:"flex",
        padding:"10px 28px",
        gap:6,
        borderBottom:`1px solid ${C.border}`,
        background:C.panel,
        overflowX:"auto",
      }}>
        {TABS.map((t,i)=>(
          <button key={t.id} onClick={()=>setActive(t.id)} style={{
            padding:"8px 16px",
            borderRadius:6,
            border:`1.5px solid ${active===t.id ? t.color : C.border}`,
            background: active===t.id ? t.color+"18" : C.bg,
            color: active===t.id ? t.color : C.muted,
            cursor:"pointer",
            fontSize:12,
            fontFamily:"sans-serif",
            fontWeight: active===t.id ? 800 : 400,
            display:"flex",
            alignItems:"center",
            gap:6,
            whiteSpace:"nowrap",
          }}>
            <span style={{ fontSize:14 }}>{t.icon}</span>
            <span style={{ fontSize:10, color:active===t.id?t.color:C.dim, marginRight:2 }}>{i+1}.</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:"20px 28px", overflowY:"auto" }}>
        {render()}
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop:`1px solid ${C.border}`,
        padding:"10px 28px",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        background:C.panel,
      }}>
        <button onClick={()=>{
          const i=TABS.findIndex(t=>t.id===active);
          if(i>0) setActive(TABS[i-1].id);
        }} disabled={active===TABS[0].id} style={{
          padding:"8px 20px", borderRadius:6, fontSize:13,
          background: active===TABS[0].id ? C.bg : tab.color+"18",
          border:`1.5px solid ${active===TABS[0].id ? C.border : tab.color}`,
          color: active===TABS[0].id ? C.muted : tab.color,
          cursor: active===TABS[0].id ? "default":"pointer",
          fontFamily:"sans-serif", fontWeight:700,
        }}>← Previous</button>

        <div style={{ display:"flex", gap:8 }}>
          {TABS.map(t=>(
            <div key={t.id} onClick={()=>setActive(t.id)} style={{
              width:10, height:10, borderRadius:5,
              background: active===t.id ? t.color : C.dim,
              cursor:"pointer", transition:"all 0.2s",
            }}/>
          ))}
        </div>

        <button onClick={()=>{
          const i=TABS.findIndex(t=>t.id===active);
          if(i<TABS.length-1) setActive(TABS[i+1].id);
        }} disabled={active===TABS[TABS.length-1].id} style={{
          padding:"8px 20px", borderRadius:6, fontSize:13,
          background: active===TABS[TABS.length-1].id ? C.bg : tab.color+"18",
          border:`1.5px solid ${active===TABS[TABS.length-1].id ? C.border : tab.color}`,
          color: active===TABS[TABS.length-1].id ? C.muted : tab.color,
          cursor: active===TABS[TABS.length-1].id ? "default":"pointer",
          fontFamily:"sans-serif", fontWeight:700,
        }}>Next →</button>
      </div>
    </div>
  );
}

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: P.muted, marginTop: 4 }}>
            <span>0 (perfect)</span><span>10 defects</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: P.muted, textAlign: "center" }}>
            Concentration: {conc.toExponential(1)}
            <br />({(conc * 100).toFixed(11)}%)
          </div>
        </div>

        {/* Visual crystal with defects */}
        <svg width={280} height={180} style={{ display: "block" }}>
          <rect width={280} height={180} fill={P.bg} rx={8} />
          {Array.from({ length: 100 }, (_, i) => {
            const row = Math.floor(i / 10);
            const col = i % 10;
            const isDefect = i < defects;
            const x = 20 + col * 24;
            const y = 15 + row * 16;
            const isZn = (row + col) % 2 === 0;
            return (
              <circle key={i} cx={x} cy={y} r={isDefect ? 0 : 7}
                fill={isDefect ? "none" : isZn ? P.valence + "aa" : P.hole + "aa"}
                stroke={isDefect ? P.gap : "none"}
                strokeWidth={isDefect ? 1.5 : 0}
                strokeDasharray={isDefect ? "3 2" : "none"} />
            );
          })}
          <text x={140} y={168} textAnchor="middle" fill={P.muted} fontSize={9}>
            Visual: {defects} missing atoms shown (100 atom grid, not 10¹¹)
          </text>
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            title: "Electrical Conductivity",
            icon: "⚡",
            value: defects === 0 ? "Intrinsic" : `×${conductivityRatio.toExponential(1)} increase`,
            detail: defects === 0
              ? "No free carriers. Near perfect insulator."
              : `${defects} vacancies × 2e each = ${defects * 2} extra carriers. Conductivity up by ~${conductivityRatio.toExponential(0)}×`,
            color: P.cond,
            change: defects === 0 ? "none" : "HUGE",
          },
          {
            title: "Carrier Lifetime (τ)",
            icon: "⏱️",
            value: defects === 0 ? "~1 ms" : `~${(defectLifetime * 1000).toFixed(2)} ms`,
            detail: defects === 0
              ? "No traps. Carriers survive long enough to reach contacts."
              : `SRH recombination at ${defects} trap centres. τ reduced by ${Math.round(intrinsicLifetime / defectLifetime)}×`,
            color: P.hole,
            change: defects === 0 ? "none" : "BAD",
          },
          {
            title: "Solar Cell Efficiency",
            icon: "☀️",
            value: defects === 0 ? "~25%" : `~${Math.max(5, 25 - efficiencyLoss).toFixed(0)}%`,
            detail: defects === 0
              ? "Maximum theoretical efficiency. No recombination losses."
              : `−${efficiencyLoss.toFixed(0)} percentage points lost. Carriers recombine at traps before reaching contacts.`,
            color: P.photon,
            change: defects === 0 ? "none" : "BAD",
          },
          {
            title: "Mechanical Strength",
            icon: "🔩",
            value: "Unchanged",
            detail: `${defects} atoms in 10¹¹ = ${(defects / 1e11 * 100).toFixed(10)}% change. Completely undetectable.`,
            color: P.muted,
            change: "none",
          },
          {
            title: "Lattice Constant",
            icon: "📏",
            value: "~0 change",
            detail: `Local distortion near vacancy ± 0.04 Å. Average lattice constant: change < 10⁻⁸ Å. Immeasurable.`,
            color: P.muted,
            change: "none",
          },
        ].map(({ title, icon, value, detail, color, change }) => (
          <div key={title} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: "10px 12px", borderRadius: 8,
            background: change !== "none" ? color + "11" : P.card,
            border: `1px solid ${change !== "none" ? color + "44" : P.border}`,
          }}>
            <div style={{ fontSize: 18, flex: "0 0 24px", marginTop: 2 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: change !== "none" ? color : P.text }}>{title}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: change !== "none" ? color : P.muted, fontFamily: "monospace" }}>
                  {value}
                </div>
              </div>
              <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.6 }}>{detail}</div>
            </div>
          </div>
        ))}

        <div style={{
          padding: "10px 14px", borderRadius: 8,
          background: P.gap + "11", border: `1px solid ${P.gap}44`,
        }}>
          <div style={{ fontSize: 11, color: P.gap, fontWeight: 700, marginBottom: 4 }}>Why electrical/optical but not mechanical?</div>
          <div style={{ fontSize: 11, color: P.muted, lineHeight: 1.7 }}>
            Mechanical: average over ALL 10¹¹ atoms → {defects} defects = nothing<br />
            Electrical: each trap independently kills one carrier → {defects} traps = {defects}× more recombination<br />
            It is like {defects} potholes in a 1000km highway — average road quality: perfect. But fragile cargo still gets destroyed.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "atom",    label: "Atom Structure",    icon: "⚛️",  color: P.core,    Component: AtomSection },
  { id: "crystal", label: "Crystal Formation", icon: "💎",  color: P.valence, Component: CrystalSection },
  { id: "bands",   label: "Energy Bands",      icon: "📊",  color: P.cond,    Component: BandSection },
  { id: "defect",  label: "Defect States",     icon: "🕳️",  color: P.gap,     Component: DefectSection },
  { id: "nelect",  label: "NELECT & Charge",   icon: "🔋",  color: P.e,       Component: NelectSection },
  { id: "macro",   label: "Macro Properties",  icon: "🔬",  color: P.photon,  Component: MacroSection },
];

export default function ElectronOrigins() {
  const [active, setActive] = useState("atom");
  const sec = SECTIONS.find(s => s.id === active);
  const { Component } = sec;

  return (
    <div style={{
      minHeight: "100vh",
      background: P.bg,
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace",
      color: P.text,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${P.border}`,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: P.panel + "ee",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: P.e, textTransform: "uppercase" }}>
            Semiconductor Physics
          </div>
          <div style={{
            fontSize: 18, fontWeight: 800,
            background: `linear-gradient(90deg, ${P.e}, ${P.valence})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Where Do Electrons Come From?
          </div>
        </div>
        <div style={{ fontSize: 11, color: P.muted }}>
          ZnTe / CdTe defect physics
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{
        display: "flex",
        padding: "10px 24px",
        gap: 6,
        borderBottom: `1px solid ${P.border}`,
        background: P.panel,
        overflowX: "auto",
        flexWrap: "wrap",
      }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: `1px solid ${active === s.id ? s.color : P.border}`,
            background: active === s.id ? s.color + "22" : P.bg,
            color: active === s.id ? s.color : P.muted,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
            fontWeight: active === s.id ? 700 : 400,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}>
            <span>{s.icon}</span>
            <span style={{ fontSize: 10, color: active === s.id ? s.color : P.dim, marginRight: 2 }}>{i + 1}.</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Pipeline flow */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 24px", gap: 4, overflowX: "auto", background: P.panel }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div onClick={() => setActive(s.id)} style={{
              padding: "2px 10px", borderRadius: 20, fontSize: 10, cursor: "pointer",
              background: active === s.id ? s.color + "33" : "transparent",
              color: active === s.id ? s.color : P.dim,
              border: `1px solid ${active === s.id ? s.color + "66" : "transparent"}`,
              whiteSpace: "nowrap",
            }}>{s.label}</div>
            {i < SECTIONS.length - 1 && <span style={{ color: P.dim, fontSize: 10 }}>→</span>}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <SectionTitle color={sec.color} icon={sec.icon}>{sec.label}</SectionTitle>
        <Component />
      </div>

      {/* Bottom nav */}
      <div style={{
        borderTop: `1px solid ${P.border}`,
        padding: "10px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: P.panel,
      }}>
        <button onClick={() => {
          const i = SECTIONS.findIndex(s => s.id === active);
          if (i > 0) setActive(SECTIONS[i - 1].id);
        }} disabled={active === SECTIONS[0].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === SECTIONS[0].id ? P.card : sec.color + "22",
          border: `1px solid ${active === SECTIONS[0].id ? P.border : sec.color}`,
          color: active === SECTIONS[0].id ? P.muted : sec.color,
          cursor: active === SECTIONS[0].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>← Previous</button>

        <div style={{ display: "flex", gap: 6 }}>
          {SECTIONS.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{
              width: 8, height: 8, borderRadius: 4,
              background: active === s.id ? s.color : P.dim,
              cursor: "pointer", transition: "all 0.2s",
            }} />
          ))}
        </div>

        <button onClick={() => {
          const i = SECTIONS.findIndex(s => s.id === active);
          if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id);
        }} disabled={active === SECTIONS[SECTIONS.length - 1].id} style={{
          padding: "8px 20px", borderRadius: 8, fontSize: 13,
          background: active === SECTIONS[SECTIONS.length - 1].id ? P.card : sec.color + "22",
          border: `1px solid ${active === SECTIONS[SECTIONS.length - 1].id ? P.border : sec.color}`,
          color: active === SECTIONS[SECTIONS.length - 1].id ? P.muted : sec.color,
          cursor: active === SECTIONS[SECTIONS.length - 1].id ? "default" : "pointer",
          fontFamily: "inherit", fontWeight: 600,
        }}>Next →</button>
      </div>
    </div>
  );
}

                  <div key={i} style={{ marginBottom: 10, padding: "6px 8px", background: `${C.panel}`, border: `1px solid ${C.border}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: ELEM_COLOR[a.Z], fontWeight: 700, marginBottom: 4 }}>
                      Atom {i} ({a.sym}) at [{a.pos.map(v => v.toFixed(3)).join(", ")}]
                    </div>
                    <Vec v={f} color={C.accent4} label="F_i (eV/Å):" />
                    <MR label="|F|:" eq={mag.toFixed(6)} result="eV/Å" color={C.accent2} />
                  </div>
                );
              })}
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Force sum (should be ~0)" color={C.accent6}>
              <MR label="ΣFx:" eq={gnn.forces.reduce((s, f) => s + f[0], 0).toFixed(6)} />
              <MR label="ΣFy:" eq={gnn.forces.reduce((s, f) => s + f[1], 0).toFixed(6)} />
              <MR label="ΣFz:" eq={gnn.forces.reduce((s, f) => s + f[2], 0).toFixed(6)} />
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
                Newton's 3rd law: total force on the system should be zero.
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "stress" && (
        <>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Virial Stress Tensor" color={C.accent5}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.accent5, textAlign: "center", padding: 6 }}>
                σ_αβ = (1/V) Σ r_ij,α × f_ij,β
              </div>
              <MR label="V (demo):" eq="10.0 ų" />
            </Card>

            <Card title="3×3 Stress Matrix (GPa)" color={C.accent2}>
              <div style={{ fontFamily: "monospace", fontSize: 13, textAlign: "center" }}>
                {gnn.stressGPa.map((row, r) => (
                  <div key={r} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: C.dim }}>{r === 0 ? "⌈" : r === 2 ? "⌊" : "│"}</span>
                    {row.map((v, c) => (
                      <span key={c} style={{ width: 90, textAlign: "right", color: v >= 0 ? C.accent3 : C.accent4 }}>
                        {v.toFixed(4)}
                      </span>
                    ))}
                    <span style={{ color: C.dim }}>{r === 0 ? "⌉" : r === 2 ? "⌋" : "│"}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 8 }}>
                Rows/cols: x, y, z. Units: GPa
              </div>
            </Card>
          </div>
          <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Card title="Pressure" color={C.accent3}>
              {(() => {
                const P = -(gnn.stressGPa[0][0] + gnn.stressGPa[1][1] + gnn.stressGPa[2][2]) / 3;
                return (
                  <>
                    <MR label="P = −tr(σ)/3:" eq={`−(${gnn.stressGPa[0][0].toFixed(4)} + ${gnn.stressGPa[1][1].toFixed(4)} + ${gnn.stressGPa[2][2].toFixed(4)})/3`} />
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.accent3, textAlign: "center", margin: "10px 0", fontFamily: "monospace" }}>
                      P = {P.toFixed(4)} GPa
                    </div>
                  </>
                );
              })()}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function DefectNetPipeline() {
  const [active, setActive] = useState("struct");
  const [molIdx, setMolIdx] = useState(0);
  const mol = MOLECULES[molIdx];
  const section = SECTIONS.find(s => s.id === active);

  const { atoms, edges, triplets, gnn } = useMemo(() => {
    const atoms = mol.atoms;
    const edges = buildEdges(atoms);
    const triplets = buildTriplets(edges, atoms.length);
    const gnn = runGNN(atoms, edges, triplets, mol);
    return { atoms, edges, triplets, gnn };
  }, [mol]);

  const render = () => {
    switch (active) {
      case "struct": return <SecStruct mol={mol} atoms={atoms} edges={edges} triplets={triplets} />;
      case "embed": return <SecEmbed atoms={atoms} />;
      case "gauss": return <SecGauss edges={edges} atoms={atoms} />;
      case "cutoff": return <SecCutoff edges={edges} atoms={atoms} />;
      case "angular": return <SecAngular edges={edges} triplets={triplets} atoms={atoms} />;
      case "conv": return <SecConv atoms={atoms} edges={edges} triplets={triplets} gnn={gnn} />;
      case "predict": return <SecPredict atoms={atoms} gnn={gnn} mol={mol} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'JetBrains Mono','Fira Code',monospace", color: C.text, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: `${C.panel}cc`, position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: C.accent1, textTransform: "uppercase" }}>DefectNet</div>
          <div style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg,${C.accent1},${C.accent5})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Full Pipeline — Every Number Shown
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {MOLECULES.map((m, i) => (
            <button key={m.id} onClick={() => setMolIdx(i)} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
              background: molIdx === i ? `${m.color}22` : C.panel,
              border: `2px solid ${molIdx === i ? m.color : C.border}`,
              color: molIdx === i ? m.color : C.muted, fontFamily: "inherit", fontWeight: 700,
            }}>{m.name}</button>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", padding: "10px 28px", gap: 4, borderBottom: `1px solid ${C.border}`, background: C.panel, overflowX: "auto", flexWrap: "wrap" }}>
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => setActive(sec.id)} style={{
            padding: "7px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
            border: `1px solid ${active === sec.id ? sec.color : C.border}`,
            background: active === sec.id ? `${sec.color}22` : C.bg,
            color: active === sec.id ? sec.color : C.muted, fontFamily: "inherit", fontWeight: active === sec.id ? 700 : 400,
          }}>{sec.label}</button>
        ))}
      </div>

      {/* Info bar */}
      <div style={{ padding: "6px 28px", fontSize: 11, color: C.muted, display: "flex", gap: 16, borderBottom: `1px solid ${C.border}` }}>
        <span>{mol.name}</span>
        <span>{atoms.length} atoms</span>
        <span>{edges.length} edges</span>
        <span>{triplets.length} triplets</span>
        <span>hidden dim = 3</span>
        <span>edge dim = 4</span>
        <span>angular dim = 4</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto" }}>
        {render()}
      </div>

      {/* Bottom nav */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.panel }}>
        <button onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i > 0) setActive(SECTIONS[i - 1].id); }}
          disabled={active === SECTIONS[0].id}
          style={{ padding: "7px 18px", borderRadius: 8, fontSize: 12, background: active === SECTIONS[0].id ? C.panel : `${section.color}22`, border: `1px solid ${active === SECTIONS[0].id ? C.border : section.color}`, color: active === SECTIONS[0].id ? C.muted : section.color, cursor: active === SECTIONS[0].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          ← Previous
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {SECTIONS.map(sec => (
            <div key={sec.id} onClick={() => setActive(sec.id)} style={{ width: 8, height: 8, borderRadius: 4, background: active === sec.id ? sec.color : C.dim, cursor: "pointer" }} />
          ))}
        </div>
        <button onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id); }}
          disabled={active === SECTIONS[SECTIONS.length - 1].id}
          style={{ padding: "7px 18px", borderRadius: 8, fontSize: 12, background: active === SECTIONS[SECTIONS.length - 1].id ? C.panel : `${section.color}22`, border: `1px solid ${active === SECTIONS[SECTIONS.length - 1].id ? C.border : section.color}`, color: active === SECTIONS[SECTIONS.length - 1].id ? C.muted : section.color, cursor: active === SECTIONS[SECTIONS.length - 1].id ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Next →
        </button>
      </div>
    </div>
  );
}
