import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Reuse the same module components from materials_lab
import MaterialsLab from "./materials_lab.jsx";

// Theme
const LIGHT = {
  bg:      "#f0f2f5",
  panel:   "#ffffff",
  surface: "#f7f8fa",
  border:  "#d4d8e0",
  ink:     "#1a1e2e",
  muted:   "#6b7280",
  dim:     "#c0c6d0",
  accent:  "#7c3aed",
  blue:    "#2563eb",
  green:   "#059669",
};

const BLOG_CHAPTERS = [
  { id: "electrons",    chapter: 1,  label: "Atoms World",                desc: "From quantum foundations to crystal properties \u2014 the building blocks of all materials", icon: "\u269B" },
  { id: "dft",          chapter: 2,  label: "DFT Basics",                 desc: "Density functional theory from first principles \u2014 Kohn-Sham equations, exchange-correlation, and self-consistency", icon: "\u2211" },
  { id: "convexhull",   chapter: 3,  label: "Computational Phase Diagram", desc: "Phase stability, convex hull construction, and chemical potential diagrams", icon: "\u25B3" },
  { id: "md",           chapter: 4,  label: "Molecular Dynamics",         desc: "Classical and ab initio molecular dynamics \u2014 ensembles, thermostats, and time integration", icon: "\u21BB" },
  { id: "defectsemi",   chapter: 5,  label: "Defects in Semiconductors",  desc: "Point defect thermodynamics \u2014 formation energy, charge transitions, equilibrium concentrations, and FNV correction", icon: "\u26A1" },
  { id: "cdtesolar",    chapter: 6,  label: "CdTe Solar Cell",            desc: "CdTe device physics, defect engineering, and photovoltaic performance optimization", icon: "\u2600" },
  { id: "forcefield",   chapter: 7,  label: "Force Fields",               desc: "Classical and machine-learned interatomic potentials \u2014 from harmonic bonds to ReaxFF and EAM", icon: "\u2699" },
  { id: "pipeline",     chapter: 8,  label: "MLFF Pipeline",              desc: "DefectNet force field: graph neural network architecture, training, and deployment", icon: "\u{1F9E0}" },
  { id: "llmdatamining", chapter: 9, label: "LLM Data Mining",            desc: "LangGraph architecture, solid-state synthesis text-mining, and MongoDB data management", icon: "\u{1F4DA}" },
  { id: "characterization", chapter: 10, label: "Materials Characterization", desc: "XRD, XPS, SEM, TEM, AFM, STM, Raman, XANES \u2014 interactive guides to every major characterization technique", icon: "\u{1F52C}" },
];

const T = LIGHT;

export default function ScientificBlog() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  // If a chapter is selected via URL, render full MaterialsLab with that chapter active
  // We pass the chapter selection through by rendering MaterialsLab with initial module
  if (chapterId) {
    return <MaterialsLab initialModule={chapterId} blogMode />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: T.ink,
    }}>
      {/* Header */}
      <div style={{
        background: T.panel,
        borderBottom: `2px solid ${T.border}`,
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <Link to="/" style={{
          padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
          background: T.surface, border: `1.5px solid ${T.border}`,
          color: T.ink, fontWeight: 700, fontFamily: "inherit",
          textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
        }}>
          {"\u2190"} Home
        </Link>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.accent, textTransform: "uppercase", fontWeight: 700 }}>
            SCIENTIFIC BLOG
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>
            Computational Materials Science
          </div>
        </div>
      </div>

      {/* Author bar */}
      <div style={{
        padding: "8px 28px",
        background: T.panel,
        borderBottom: `1px solid ${T.border}`,
        fontSize: 12,
        color: T.muted,
      }}>
        By <span style={{ fontWeight: 700, color: T.ink }}>Md Habibur Rahman</span> {"\u00B7"} School of Materials Engineering, Purdue University {"\u00B7"} <a href="mailto:rahma103@purdue.edu" style={{ color: T.accent, textDecoration: "none" }}>rahma103@purdue.edu</a>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 28px 0" }}>
        <div style={{
          background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
          padding: "18px 22px", marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: T.ink }}>
            An interactive learning platform covering the full stack of computational materials science — from
            quantum mechanics and density functional theory to machine learning force fields and data mining.
            Each chapter is a self-contained, animated module with equations, visualizations, and hands-on examples.
          </div>
        </div>

        {/* Chapter grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, paddingBottom: 48 }}>
          {BLOG_CHAPTERS.map(ch => (
            <div
              key={ch.id}
              onClick={() => navigate(`/blog/${ch.id}`)}
              style={{
                background: T.panel, borderRadius: 12, border: `1px solid ${T.border}`,
                padding: "18px 18px 14px", cursor: "pointer", transition: "all 0.2s",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.boxShadow = `0 4px 16px ${T.accent}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: 1 }}>
                  CHAPTER {ch.chapter}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{ch.label}</div>
              </div>
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{ch.desc}</div>
              <div style={{ marginTop: 10, fontSize: 11, color: T.accent, fontWeight: 600 }}>
                Read chapter {"\u2192"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
