import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { mount, unmount } from "svelte";
import { Structure } from "matterviz/structure";

// ---- theme (matches site convention) ----
const T = {
  bg: "#f0f2f5", panel: "#ffffff", surface: "#f7f8fa", border: "#e5eef0",
  ink: "#0c1f23", muted: "#6b7280", accent: "#0c1f23", accent2: "#75b5c1",
  cov: "#1b4750", ion: "#7ab7c3", spont: "#0c1f23" };
const rowh = 34, cols = [
  { k: "formula", t: "Host", w: 120 },
  { k: "defect", t: "Defect", w: 190 },
  { k: "class", t: "Class", w: 110 },
  { k: "Ef_CHGNet", t: "CHGNet (eV)", w: 110, num: 1 },
  { k: "Ef_M3GNet", t: "M3GNet (eV)", w: 110, num: 1 },
  { k: "Ef_MACE", t: "MACE (eV)", w: 100, num: 1 },
  { k: "Ef_DFT", t: "DFT (eV)", w: 95, num: 1 },
  { k: "best_condition", t: "Best growth", w: 110 },
  { k: "band_gap", t: "Gap (eV)", w: 90, num: 1 },
];

async function loadGz(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch " + url + " " + res.status);
  const stream = res.body.pipeThrough(new DecompressionStream("gzip"));
  return JSON.parse(await new Response(stream).text());
}
const fmt = (v) => (v === null || v === undefined || Number.isNaN(v) ? "—" : (typeof v === "number" ? v.toFixed(2) : v));

// strip point-group suffix so a clicked config maps to its merged charged-level entry
const PG = /_(C2v|C2h|C3v|C3i|C3h|C4v|C4h|C6v|C6h|D2d|D2h|D3d|D3h|D4h|D6h|C1|Ci|Cs|C2|C3|C4|C6|S4|S6|D2|D3|D4|D6|Td|Th|Oh)(_.*)?$/;
const baseDefect = (n) => (n.includes("+") ? n : n.replace(PG, ""));
const lvLookup = (levels, row) => levels && (levels[row.mp_id]?.[row.defect] || levels[row.mp_id]?.[baseDefect(row.defect)]);

// ---- charged-state transition-level band diagram (VBM=0 → CBM=gap) ----
function BandDiagram({ data }) {
  const { gap, transitions } = data;
  const W = 250, H = 250, padT = 24, padB = 24, barX = 28, barW = 70, plotH = H - padT - padB;
  const yOf = (e) => padT + (1 - e / gap) * plotH;
  const depthColor = (e) => { const d = Math.min(e, gap - e); return d < 0.5 ? T.cov : d < 1.2 ? T.ion : T.spont; };
  // stagger label y's to avoid overlap
  const sorted = [...transitions].map((t, i) => ({ ...t, i })).sort((a, b) => b.e - a.e);
  const ly = []; let last = -1e9;
  for (const t of sorted) { let y = yOf(t.e); if (y - last < 15) y = last + 15; ly[t.i] = y; last = y; }
  return (
    <svg width={W} height={H} style={{ display: "block" }}><rect x={barX} y={padT} width={barW} height={plotH} fill="#2a8697" stroke={T.border} /><text x={barX + barW / 2} y={padT - 8} textAnchor="middle" fontSize="11" fontWeight="500" fill={T.muted}>CBM ({gap.toFixed(2)})</text><text x={barX + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize="11" fontWeight="500" fill={T.muted}>VBM (0)</text> {transitions.map((t, i) => {
        const y = yOf(t.e), c = depthColor(t.e);
        return (
          <g key={i}><line x1={barX} y1={y} x2={barX + barW} y2={y} stroke={c} strokeWidth="2.5" /><line x1={barX + barW} y1={y} x2={barX + barW + 14} y2={ly[i]} stroke={c} strokeWidth="1" strokeDasharray="2 2" /><text x={barX + barW + 18} y={ly[i] + 4} fontSize="12" fill={T.ink} fontFamily="'IBM Plex Mono',monospace"> {t.t} <tspan fontWeight="500" fill={c}>{t.e.toFixed(2)}</tspan></text></g> );
      })}
    </svg> );
}

// ---- strip LaTeX from measured-value strings for HTML display ----
const subc = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "/": "⁄", "+": "₊", "-": "₋" };
function cleanTex(s) {
  if (!s) return s;
  return String(s)
    .replace(/~?\\cite\{([^}]*)\}/g, (m, r) => " [" + r.replace(/,/g, ", ") + "]")
    .replace(/\\approx/g, "≈").replace(/\\sim/g, "~").replace(/\\times/g, "×").replace(/\\,/g, " ")
    .replace(/[_^]\{([^}]*)\}/g, (m, inner) => inner.split("").map((c) => subc[c] || c).join(""))
    .replace(/\$/g, "").replace(/\s+/g, " ").trim();
}

// ---- minimal CIF parse + defect-atom detection (client-side, index order = matterviz's) ----
const deg = Math.PI / 180;
function latFromParams(a, b, c, al, be, ga) {
  al *= deg; be *= deg; ga *= deg;
  const cg = Math.cos(ga), sg = Math.sin(ga), cb = Math.cos(be), ca = Math.cos(al);
  const cy = (ca - cb * cg) / sg;
  return [[a, 0, 0], [b * cg, b * sg, 0], [c * cb, c * cy, c * Math.sqrt(Math.max(0, 1 - cb * cb - cy * cy))]];
}
function vmul(v, M) { return [0, 1, 2].map((j) => v[0] * M[0][j] + v[1] * M[1][j] + v[2] * M[2][j]); }
function inv3(m) {
  const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2];
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C; if (Math.abs(det) < 1e-9) return null;
  return [[A, -(b * i - c * h), b * f - c * e], [B, a * i - c * g, -(a * f - c * d)], [C, -(a * h - b * g), a * e - b * d]].map((r) => r.map((x) => x / det));
}
function parseCif(text) {
  if (!text) return null;
  const num = (re) => { const m = text.match(re); return m ? parseFloat(m[1]) : null; };
  const a = num(/_cell_length_a\s+([\d.]+)/), b = num(/_cell_length_b\s+([\d.]+)/), c = num(/_cell_length_c\s+([\d.]+)/);
  if (a == null) return null;
  const L = latFromParams(a, b, c, num(/_cell_angle_alpha\s+([\d.]+)/) || 90, num(/_cell_angle_beta\s+([\d.]+)/) || 90, num(/_cell_angle_gamma\s+([\d.]+)/) || 90);
  const lines = text.split("\n");
  const cols = []; for (const ln of lines) { const t = ln.trim(); if (t.startsWith("_atom_site_")) cols.push(t); }
  const ci = {}; cols.forEach((c2, i) => (ci[c2] = i));
  const iEl = ci._atom_site_type_symbol != null ? ci._atom_site_type_symbol : ci._atom_site_label;
  const ix = ci._atom_site_fract_x, iy = ci._atom_site_fract_y, iz = ci._atom_site_fract_z;
  if (ix == null || iEl == null) return null;
  const sites = [];
  for (const ln of lines) {
    const t = ln.trim();
    if (!t || t.startsWith("_") || t.startsWith("loop_") || t.startsWith("#") || t.startsWith("data_")) continue;
    const p = t.split(/\s+/); if (p.length < cols.length) continue;
    const fx = parseFloat(p[ix]); if (Number.isNaN(fx)) continue;
    sites.push({ el: String(p[iEl]).replace(/[^A-Za-z]/g, ""), abc: [fx, parseFloat(p[iy]), parseFloat(p[iz])] });
  }
  return { L, sites };
}
function detectDefectSites(defCif, bulkCif) {
  try {
    const D = parseCif(defCif), B = parseCif(bulkCif);
    if (!D || !B || !D.sites.length || !B.sites.length) return [];
    const Binv = inv3(B.L), Dinv = inv3(D.L); if (!Binv || !Dinv) return [];
    const M = vmul3(D.L, Binv).map((r) => r.map(Math.round));
    let mx = 1; M.forEach((r) => r.forEach((v) => (mx = Math.max(mx, Math.abs(v)))));
    const bsuper = [];
    for (const s of B.sites)
      for (let i = -1; i <= mx; i++) for (let j = -1; j <= mx; j++) for (let k = -1; k <= mx; k++) {
        const fD = vmul(vmul([s.abc[0] + i, s.abc[1] + j, s.abc[2] + k], B.L), Dinv);
        if (fD.every((x) => x >= -2e-3 && x < 1 - 2e-3)) bsuper.push({ el: s.el, fD });
      }
    if (!bsuper.length) return [];
    const dist = (fa, fb) => { const d = [0, 1, 2].map((q) => { let x = fa[q] - fb[q]; return x - Math.round(x); }); const c = vmul(d, D.L); return Math.hypot(c[0], c[1], c[2]); };
    const tol = 0.8, hi = new Set();
    D.sites.forEach((d, idx) => {
      let best = 1e9, bel = null;
      for (const bb of bsuper) { const r = dist(d.abc, bb.fD); if (r < best) { best = r; bel = bb.el; } }
      if (best > tol) hi.add(idx); else if (bel !== d.el) hi.add(idx);
    });
    for (const bb of bsuper) {
      let best = 1e9; for (const d of D.sites) { const r = dist(bb.fD, d.abc); if (r < best) best = r; }
      if (best > tol) D.sites.forEach((d, idx) => { if (dist(bb.fD, d.abc) < 2.9) hi.add(idx); });
    }
    return [...hi];
  } catch (e) { return []; }
}
function vmul3(A, B) { return A.map((row) => [0, 1, 2].map((j) => row[0] * B[0][j] + row[1] * B[1][j] + row[2] * B[2][j])); }

// ---- 3D structure viewer (matterviz) ----
function StructureViewer({ cif, label, bulkCif }) {
  const ref = useRef(null);
  const highlight = useMemo(() => (bulkCif && cif && bulkCif !== cif ? detectDefectSites(cif, bulkCif) : []), [cif, bulkCif]);
  useEffect(() => {
    if (!cif || !ref.current) return;
    let app;
    try {
      app = mount(Structure, {
        target: ref.current,
        props: { structure_string: cif, style: "width:100%;height:340px", show_controls: true, highlighted_sites: highlight } });
    } catch (e) { /* parse/mount failure handled by empty view */ }
    return () => { try { app && unmount(app); } catch (e) {} };
  }, [cif, highlight]);
  return (
    <div><div style={{ fontSize: 11, fontWeight: 500, color: T.muted, marginBottom: 4 }}>{label}</div><div ref={ref} style={{ width: "100%", height: 340, position: "relative", border: `1px solid ${T.border}`, borderRadius: 8, background: "#fff", overflow: "hidden" }} /></div> );
}

// parse "(+2/+1)" -> [2,1] ; "(+0/-2)" -> [0,-2]
function parseQ(s) {
  const p = s.replace(/[()]/g, "").split("/");
  const n = (x) => parseInt(x.replace("+", ""), 10);
  return [n(p[0]), n(p[1])];
}
// reconstruct absolute E_f^q(E_F=0) for every charge state from the neutral anchor + transitions
function buildEf0(lv, anchor) {
  const ef0 = { 0: anchor };
  const edges = lv.transitions.map((t) => { const [a, b] = parseQ(t.t); return { a, b, e: t.e }; });
  for (let iter = 0; iter < edges.length + 2; iter++)
    for (const { a, b, e } of edges) {            // E_f^a(0) - E_f^b(0) = (b-a)*e
      if (ef0[a] !== undefined && ef0[b] === undefined) ef0[b] = ef0[a] - (b - a) * e;
      else if (ef0[b] !== undefined && ef0[a] === undefined) ef0[a] = ef0[b] + (b - a) * e;
    }
  const qs = new Set(); edges.forEach(({ a, b }) => { qs.add(a); qs.add(b); });
  for (const q of qs) if (ef0[q] === undefined) return null;   // neutral disconnected (metastable) → can't anchor
  return ef0;
}
const qLabel = (q) => (q > 0 ? "+" + q : q < 0 ? "−" + -q : "0");

// ---- defect formation energy vs Fermi level (lower envelope), with growth-condition selector ----
function EfFermiPlot({ lv, conds }) {
  const condList = conds && conds.length ? conds : null;
  const defIdx = useMemo(() => {
    if (!condList) return 0; let bi = 0, bv = Infinity;
    condList.forEach((c, i) => { if (c.Ef_CHGNet != null && c.Ef_CHGNet < bv) { bv = c.Ef_CHGNet; bi = i; } });
    return bi;
  }, [condList]);
  const [ci, setCi] = useState(0);
  useEffect(() => { setCi(defIdx); }, [defIdx]);
  if (!condList) return <div style={{ color: T.muted, fontSize: 13 }}>loading…</div>;
  const anchor = condList[ci]?.Ef_CHGNet;
  const ef0 = anchor == null ? null : buildEf0(lv, anchor);
  const gap = lv.gap, W = 360, H = 256, mL = 58, mR = 14, mT = 12, mB = 52, pW = W - mL - mR, pH = H - mT - mB;
  let body;
  if (!ef0) {
    body = <div style={{ color: T.muted, fontSize: 12.5, height: H, display: "flex", alignItems: "center", padding: 12, border: `1px dashed ${T.border}`, borderRadius: 8 }}> The neutral state is metastable for this defect, so the E<sub>f</sub>(E<sub>F</sub>) curve cannot be anchored from the neutral energy alone.</div>;
  } else {
    const qs = Object.keys(ef0).map(Number);
    const env = (EF) => Math.min(...qs.map((q) => ef0[q] + q * EF));
    const N = 72, xs = []; for (let i = 0; i <= N; i++) xs.push((i / N) * gap);
    const ys = xs.map(env);
    let ymin = Math.min(...ys), ymax = Math.max(...ys); const pad = Math.max(0.3, (ymax - ymin) * 0.08); ymin -= pad; ymax += pad;
    const xpx = (EF) => mL + (EF / gap) * pW, ypx = (E) => mT + (1 - (E - ymin) / (ymax - ymin || 1)) * pH;
    const path = xs.map((x, i) => (i ? "L" : "M") + xpx(x).toFixed(1) + " " + ypx(ys[i]).toFixed(1)).join(" ");
    // active charge per sample → runs for segment labels
    const act = xs.map((x) => qs.reduce((b, q) => (ef0[q] + q * x < ef0[b] + b * x ? q : b), qs[0]));
    const runs = []; let cur = null;
    act.forEach((q, i) => { if (!cur || cur.q !== q) { cur = { q, i0: i, i1: i }; runs.push(cur); } else cur.i1 = i; });
    const yticks = [ymin, (ymin + ymax) / 2, ymax];
    const xticks = Array.from({ length: 5 }, (_, i) => (gap * i) / 4);
    body = (
      <svg width={W} height={H} style={{ display: "block" }}><rect x={mL} y={mT} width={pW} height={pH} fill="#2a8697" stroke={T.border} /> {yticks.map((v, i) => (
          <g key={i}><line x1={mL} y1={ypx(v)} x2={mL + pW} y2={ypx(v)} stroke={T.border} strokeDasharray="2 3" /><text x={mL - 6} y={ypx(v) + 4} textAnchor="end" fontSize="10.5" fill={T.muted}>{v.toFixed(1)}</text></g> ))}
        <path d={path} fill="none" stroke={T.accent} strokeWidth="2.6" strokeLinejoin="round" /> {lv.transitions.filter((t) => t.e > 0.001 && t.e < gap - 0.001).map((t, i) => (
          <circle key={i} cx={xpx(t.e)} cy={ypx(env(t.e))} r="3.2" fill="#fff" stroke={T.accent} strokeWidth="1.6" /> ))}
        {runs.filter((r) => r.i1 - r.i0 > 4).map((r, i) => {
          const mid = Math.round((r.i0 + r.i1) / 2);
          return <text key={i} x={xpx(xs[mid])} y={ypx(ys[mid]) - 6} textAnchor="middle" fontSize="11" fontWeight="500" fill={T.muted} fontFamily="'IBM Plex Mono',monospace">{qLabel(r.q)}</text>;
        })}
        {xticks.map((xv, i) => (
          <g key={i}><line x1={xpx(xv)} y1={mT + pH} x2={xpx(xv)} y2={mT + pH + 4} stroke={T.muted} /><text x={xpx(xv)} y={mT + pH + 15} textAnchor="middle" fontSize="9.5" fill={T.muted}>{xv.toFixed(1)}</text></g> ))}
        <text x={mL} y={mT + pH + 27} textAnchor="middle" fontSize="9.5" fontWeight="500" fill={T.muted}>VBM</text><text x={mL + pW} y={mT + pH + 27} textAnchor="middle" fontSize="9.5" fontWeight="500" fill={T.muted}>CBM</text><text x={mL + pW / 2} y={H - 4} textAnchor="middle" fontSize="11" fill={T.ink}>Fermi level E<tspan baselineShift="sub" fontSize="8">F</tspan> (eV)</text><text x={15} y={mT + pH / 2} textAnchor="middle" fontSize="11" fill={T.ink} transform={`rotate(-90 15 ${mT + pH / 2})`}>Defect formation energy (eV)</text></svg> );
  }
  return (
    <div><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, fontSize: 12.5 }}><span style={{ color: T.muted }}>Growth condition:</span><select value={ci} onChange={(e) => setCi(+e.target.value)} style={{ padding: "3px 6px", fontSize: 12.5, borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", color: T.ink }}> {condList.map((c, i) =><option key={i} value={i}>{c.condition}-rich</option>)}
        </select></div><div style={{ display: "flex", justifyContent: "center" }}>{body}</div></div> );
}

// ---- expandable per-defect detail (conditions + structures) ----
function DefectDetail({ row, condIndex, ensureConds, levels }) {
  const lv = lvLookup(levels, row);
  const [conds, setConds] = useState(null);
  const [cifs, setCifs] = useState(null);
  const [view, setView] = useState("chgnet");
  const [err, setErr] = useState(null);
  useEffect(() => {
    ensureConds().then((idx) => setConds(idx[row.did] || []));
    loadGz(`/wbg/cifs/${row.mp_id}.jsongz`).then(setCifs).catch((e) => setErr(String(e)));
  }, [row.did]);
  const cur = cifs && (view === "bulk" ? cifs["__bulk__"]?.chgnet : (view === "init" ? cifs[row.defect]?.init : cifs[row.defect]?.chgnet));
  return (
    <div style={{ padding: "14px 18px", background: T.surface, borderTop: `1px solid ${T.border}` }}><div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22 }}><div><div style={{ fontSize: 13, fontWeight: 500, color: T.accent, marginBottom: 8 }}> Neutral (q = 0) formation energy of <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{row.defect}</span> at each growth condition
          </div> {!conds ? <div style={{ color: T.muted, fontSize: 13 }}>loading…</div> :
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ color: T.muted, textAlign: "right" }}><th style={{ textAlign: "left", padding: 4 }}>Condition</th><th style={{ padding: 4 }}>CHGNet</th><th style={{ padding: 4 }}>M3GNet</th><th style={{ padding: 4 }}>Mace</th><th style={{ padding: 4 }}>DFT</th></tr></thead><tbody>{conds.map((c, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${T.border}`, textAlign: "right" }}><td style={{ textAlign: "left", padding: 4, fontWeight: 500 }}>{c.condition}-rich</td><td style={{ padding: 4 }}>{fmt(c.Ef_CHGNet)}</td><td style={{ padding: 4 }}>{fmt(c.Ef_M3GNet)}</td><td style={{ padding: 4 }}>{fmt(c.Ef_MACE)}</td><td style={{ padding: 4, color: c.Ef_DFT != null ? T.accent : T.muted, fontWeight: c.Ef_DFT != null ? 500 : 400 }}>{fmt(c.Ef_DFT)}</td></tr>))}</tbody></table>}
          <div style={{ fontSize: 11, color: T.muted, marginTop: 6, lineHeight: 1.4 }}> All four columns are <b>neutral (q&nbsp;=&nbsp;0)</b> formation energies (eV). DFT = Quantum-ESPRESSO validation subset; “—” means DFT not yet computed for that defect. Charged states (q&nbsp;≠&nbsp;0) appear in the transition-level panels below.
          </div></div><div><div style={{ display: "flex", gap: 6, marginBottom: 8 }}> {[["chgnet", "Relaxed (CHGNet)"], ["init", "Unrelaxed"], ["bulk", "Bulk host"]].map(([k, t]) => (
              <button key={k} onClick={() => setView(k)} style={{
                padding: "4px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRadius: 6,
                border: `1px solid ${view === k ? T.accent : T.border}`, background: view === k ? T.accent : "#fff", color: view === k ? "#fff" : T.ink }}>{t}</button> ))}
          </div> {(() => {
            const ph = (txt) =><div style={{ color: T.muted, fontSize: 13, height: 320, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 16, border: `1px dashed ${T.border}`, borderRadius: 8 }}>{txt}</div>;
            if (err) return ph("structure unavailable");
            if (!cifs) return ph("loading structure…");
            if (!cur) return ph(view === "init" ? "Unrelaxed (input) geometry was not stored for this defect — only the CHGNet-relaxed structure is available." : view === "bulk" ? "Bulk host structure unavailable." : "Relaxed structure unavailable.");
            return <StructureViewer cif={cur} bulkCif={cifs["__bulk__"]?.chgnet} label={(view === "bulk" ? "Pristine host supercell" : view === "init" ? "Unrelaxed input geometry — defect atoms highlighted" : "CHGNet-relaxed defect — defect atoms highlighted")} />;
          })()}
        </div></div> {lv && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}> {/* left: E_f(E_F) plot with growth-condition selector */}
          <div><div style={{ fontSize: 13, fontWeight: 500, color: T.accent, marginBottom: 8, textAlign: "center" }}>Formation energy vs Fermi level — <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{row.defect}</span></div><EfFermiPlot lv={lv} conds={conds} /><div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.5, marginTop: 8 }}> Lower envelope of E<sub>f</sub><sup>q</sup>(E<sub>F</sub>) across charge states. Segment slope = charge state (q labels); kinks (○) are the transition levels. The whole curve shifts rigidly with growth condition (chemical potential); shape is condition-independent. Neutral anchor from CHGNet, transition levels from DFT.
            </div></div> {/* right: transition-level band diagram + table */}
          <div><div style={{ fontSize: 13, fontWeight: 500, color: T.accent, marginBottom: 8, textAlign: "center" }}>Charge-state transition levels ε(q/q′) · eV above VBM — <span style={{ fontFamily: "'IBM Plex Mono',monospace" }}>{row.defect}</span></div><div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 6, alignItems: "center", justifyContent: "center" }}><BandDiagram data={lv} /><div style={{ fontSize: 13, color: T.ink }}><table style={{ borderCollapse: "collapse", fontSize: 12.5, marginBottom: 10 }}><tbody> {lv.transitions.map((t, i) => {
                      const d = Math.min(t.e, lv.gap - t.e);
                      return (
                        <tr key={i} style={{ borderTop: i ? `1px solid ${T.border}` : "none" }}><td style={{ padding: "3px 12px 3px 0", fontFamily: "'IBM Plex Mono',monospace", fontWeight: 500 }}>{t.t}</td><td style={{ padding: "3px 12px 3px 0", fontFamily: "'IBM Plex Mono',monospace", textAlign: "right" }}>{t.e.toFixed(2)}</td><td style={{ padding: "3px 0", color: d < 0.5 ? T.cov : d < 1.2 ? T.ion : T.spont, fontWeight: 500 }}>{d < 0.5 ? "shallow" : d < 1.2 ? "intermediate" : "deep"}</td></tr> );
                    })}
                  </tbody></table> {lv.exp && <div style={{ fontSize: 12, color: T.ink, marginBottom: 6 }}><b>Measured:</b> {cleanTex(lv.exp)}</div>}
              </div></div><div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.5, marginTop: 4 }}> {lv.natoms ? `${lv.natoms}-atom` : "Defect"} supercells, Makov–Payne charge correction, dielectric ε = {lv.eps}; experimental gap = {lv.gap.toFixed(2)} eV. Shallow levels (near a band edge) are benign; deep mid-gap levels are likely carrier traps.
            </div></div></div> )}
    </div> );
}

// ---- main ----
export default function WbgExplorer() {
  const [tab, setTab] = useState("explorer");
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [spontOnly, setSpontOnly] = useState(false);
  const [noSwap, setNoSwap] = useState(true);
  const [levelsOnly, setLevelsOnly] = useState(false);
  const [levels, setLevels] = useState(null);
  const [sortK, setSortK] = useState("Ef_CHGNet");
  const [sortDir, setSortDir] = useState(1);
  const [open, setOpen] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [vh, setVh] = useState(560);
  const condCache = useRef(null);
  const scroller = useRef(null);

  useEffect(() => { loadGz("/wbg/defects.jsongz").then(setRows).catch((e) => setRows({ error: String(e) })); }, []);
  useEffect(() => { loadGz("/wbg/levels.jsongz").then(setLevels).catch(() => setLevels({})); }, []);
  const ensureConds = useCallback(async () => {
    if (condCache.current) return condCache.current;
    const arr = await loadGz("/wbg/defect_conditions.jsongz");
    const idx = {}; for (const r of arr) (idx[r.did] = idx[r.did] || []).push(r);
    condCache.current = idx; return idx;
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    const s = q.trim().toLowerCase();
    let f = rows.filter((r) => (cls === "all" || r.class === cls) &&
      (!spontOnly || r.spontaneous) &&
      (!noSwap || !r.swap_pair) &&
      (!levelsOnly || !!lvLookup(levels, r)) &&
      (!s || (r.formula + " " + r.defect + " " + r.host + " " + r.class).toLowerCase().includes(s)));
    const k = sortK;
    f = [...f].sort((a, b) => {
      let av = a[k], bv = b[k];
      if (av == null) return 1; if (bv == null) return -1;
      if (typeof av === "string") return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
    return f;
  }, [rows, q, cls, spontOnly, noSwap, levelsOnly, levels, sortK, sortDir]);
  const nLevels = useMemo(() => (Array.isArray(rows) && levels ? rows.reduce((a, r) => a + (lvLookup(levels, r) ? 1 : 0), 0) : 0), [rows, levels]);

  const total = filtered.length;
  const start = Math.max(0, Math.floor(scrollTop / ROWH) - 4);
  const count = Math.ceil(vh / ROWH) + 8;
  const slice = filtered.slice(start, start + count);

  const downloadCSV = () => {
    const cols = COLS.map((c) => c.k);
    const head = cols.join(",");
    const body = filtered.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(",")).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a"); a.href = url.createObjectURL(blob); a.download = "wbg_defects_filtered.csv"; a.click();
  };
  const setSort = (k) => { if (k === sortK) setSortDir(-sortDir); else { setSortK(k); setSortDir(1); } };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}> {/* header + tabs */}
      <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: "16px 26px" }}><div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}><div style={{ fontSize: 20, fontWeight: 500, letterSpacing: 0.3 }}>Wide-Bandgap Defect Atlas</div><div style={{ fontSize: 13, color: T.muted }}>80,741 native defects · 364 hosts · CHGNet / M3GNet / mace + DFT</div><Link to="/" style={{ marginLeft: "auto", fontSize: 13, color: T.accent, fontWeight: 500 }}>← home</Link></div><div style={{ display: "flex", gap: 8, marginTop: 12 }}> {[["explorer", "Defect Explorer"], ["about", "About the Project"]].map(([k, t]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 8,
              border: `1px solid ${tab === k ? T.accent : T.border}`, background: tab === k ? T.accent : "#fff", color: tab === k ? "#fff" : T.ink }}>{t}</button> ))}
        </div></div> {tab === "about" ? <About /> : (
        <div style={{ padding: "18px 26px" }}> {/* toolbar */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search host, defect, class (e.g. GaN, V_O, vacancy)…"
              style={{ flex: "1 1 320px", padding: "9px 12px", fontSize: 14, borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff" }} /> {["all", "vacancy", "interstitial", "antisite", "complex"].map((c) => (
              <button key={c} onClick={() => setCls(c)} style={{ padding: "6px 11px", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRadius: 7, textTransform: "capitalize",
                border: `1px solid ${cls === c ? T.accent : T.border}`, background: cls === c ? T.accent : "#fff", color: cls === c ? "#fff" : T.ink }}>{c}</button> ))}
            <label style={{ fontSize: 12, display: "flex", gap: 5, alignItems: "center", color: T.ink }}><input type="checkbox" checked={spontOnly} onChange={(e) => setSpontOnly(e.target.checked)} />spontaneous (Eᶠ&lt;0)</label><label style={{ fontSize: 12, display: "flex", gap: 5, alignItems: "center", color: T.ink }}><input type="checkbox" checked={noSwap} onChange={(e) => setNoSwap(e.target.checked)} />exclude swap pairs</label><label style={{ fontSize: 12, display: "flex", gap: 5, alignItems: "center", color: T.ink }} title={`${nLevels} defects with charged transition levels`}><input type="checkbox" checked={levelsOnly} onChange={(e) => setLevelsOnly(e.target.checked)} /> has charge levels{nLevels ? ` (${nLevels})` : ""}</label><button onClick={downloadCSV} style={{ padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", borderRadius: 7, border: `1px solid ${T.accent2}`, background: "#fff", color: T.accent }}> CSV ({total.toLocaleString()})</button></div> {!rows ? <div style={{ color: T.muted, padding: 40 }}>Loading 80,741 defects…</div> :
            rows.error ? <div style={{ color: T.spont, padding: 40 }}>Failed to load data: {rows.error}</div> : (
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}> {/* header row */}
                <div style={{ display: "flex", background: T.surface, borderBottom: `2px solid ${T.border}`, fontWeight: 500, fontSize: 12, color: T.muted, letterSpacing: 0.2 }}> {COLS.map((c) => (
                    <div key={c.k} onClick={() => setSort(c.k)} style={{ width: c.w, padding: "9px 8px", cursor: "pointer", textAlign: c.num ? "right" : "left", userSelect: "none" }}> {c.t}{sortK === c.k ? (sortDir > 0 ? " ▲" : " ▼") : ""}
                    </div> ))}
                </div> {/* virtualized body */}
                <div ref={scroller} onScroll={(e) => setScrollTop(e.target.scrollTop)} style={{ height: vh, overflowY: "auto", position: "relative" }}><div style={{ height: total * rowh, position: "relative" }}> {slice.map((r, i) => {
                      const idx = start + i; const isOpen = open === r.did; const hasLv = !!lvLookup(levels, r);
                      return (
                        <div key={r.did} style={{ position: "absolute", top: idx * rowh, left: 0, right: 0 }}><div onClick={() => setOpen(isOpen ? null : r.did)} style={{ display: "flex", height: rowh, alignItems: "center", fontSize: 13, cursor: "pointer", borderBottom: `1px solid ${T.border}`, background: isOpen ? T.accent + "12" : (idx % 2 ? "#fff" : "color-mix(in srgb, var(--sunk) 53%, transparent)") }}> {COLS.map((c) => (
                              <div key={c.k} style={{ width: c.w, padding: "0 8px", textAlign: c.num ? "right" : "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                color: c.k === "Ef_CHGNet" && r.spontaneous ? T.spont : (c.k === "class" ? (["vacancy", "interstitial"].includes(r.class) ? T.accent : T.ion) : T.ink),
                                fontWeight: c.k === "formula" ? 500 : 400, fontFamily: c.num || c.k === "defect" ? "'ibm Plex Mono',monospace" : "inherit" }}> {c.num ? fmt(r[c.k]) : r[c.k]}
                                {c.k === "defect" && hasLv && <span title="charge-state transition levels available" style={{ marginLeft: 6, color: T.accent2 }}></span>}
                              </div> ))}
                          </div></div> );
                    })}
                  </div></div> {/* expanded detail (rendered below, follows selection) */}
                {open && filtered.find((r) => r.did === open) &&
                  <DefectDetail row={filtered.find((r) => r.did === open)} ensureConds={ensureConds} levels={levels} />}
              </div> )}
          <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}> Click any row to see its formation energy at every growth condition and view the relaxed / unrelaxed / bulk structure in 3D. Showing {total.toLocaleString()} of {Array.isArray(rows) ? rows.length.toLocaleString() : "…"} defects.
          </div></div> )}
    </div> );
}

function Stat({ n, l }) {
  return <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", minWidth: 150 }}><div style={{ fontSize: 26, fontWeight: 500, color: T.accent }}>{n}</div><div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{l}</div></div>;
}
function About() {
  return (
    <div style={{ padding: "26px", maxWidth: 980, margin: "0 auto" }}><div style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>A foundation-model atlas of native defects in wide-bandgap semiconductors</div><div style={{ fontSize: 15, color: T.muted, marginBottom: 20, lineHeight: 1.5 }}> Which wide-bandgap host keeps its native defects benign, how should it be grown, and which defects must be controlled?
        We screened 364 hosts and ~78,000 native defects with three foundation machine-learning force fields, and release every
        defect, its formation energy at each growth condition, and its relaxed structure here for the community to query.
      </div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}><Stat n="80,741" l="native defects" /><Stat n="364" l="WBG hosts" /><Stat n="3" l="foundation MLFFs" /><Stat n="638" l="DFT-validated" /></div> {[
        ["Bonding character governs tolerance", "Covalent carbides and nitrides separate cleanly from ionic oxides and halides — bonding type, not band gap, is the first filter when choosing a host."],
        ["The champions re-emerge, blind", "Without any experimental input the ranking recovers β-Si₃N₄, diamond, BN, GaN, and AlN at the top."],
        ["Dark-horse oxides", "Under-explored but defect-tolerant oxides — GeO₂, MgO, SiO₂, CaAl₂O₄, HfO₂, GaPO₄ and more — emerge as fresh candidates worth experimental study."],
        ["Universal weak spots", "A small recurring set of defects — alkali interstitials and the oxygen vacancy — limits almost every chemistry."],
      ].map(([h, b], i) => (
        <div key={i} style={{ background: "#fff", border: `1px solid ${T.border}`,  borderRadius: 10, padding: "14px 18px", marginBottom: 12 }}><div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{h}</div><div style={{ fontSize: 14, color: T.muted, lineHeight: 1.5 }}>{b}</div></div> ))}
    </div> );
}
