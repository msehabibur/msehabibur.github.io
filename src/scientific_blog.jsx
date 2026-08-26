import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Reuse the same module components from micro_lab
import MicroLab from "./micro_lab.jsx";

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
  { id: "electrons",        chapter: 1,  label: "Atoms World",                desc: "From quantum foundations to crystal properties \u2014 the building blocks of all materials", icon: "\u269B" },
  { id: "synthesis",        chapter: 2,  label: "Materials Synthesis",         desc: "CVD, PVD, sol-gel, ALD, MBE, spin coating, hydrothermal \u2014 step-by-step animated synthesis methods", icon: "\u{1F3ED}" },
  { id: "characterization", chapter: 3,  label: "Materials Characterization",  desc: "XRD, XPS, SEM, TEM, AFM, STM, Raman, XANES \u2014 interactive guides to every major characterization technique", icon: "\u{1F52C}" },
  { id: "dft",              chapter: 4,  label: "DFT Basics",                 desc: "Density functional theory from first principles \u2014 Kohn-Sham equations, exchange-correlation, and self-consistency", icon: "\u2211" },
  { id: "md",               chapter: 5,  label: "Molecular Dynamics",         desc: "Classical and ab initio molecular dynamics \u2014 ensembles, thermostats, and time integration", icon: "\u21BB" },
  { id: "convexhull",       chapter: 6,  label: "Computational Phase Diagram", desc: "Phase stability, convex hull construction, and chemical potential diagrams", icon: "\u25B3" },
  { id: "defectsemi",       chapter: 7,  label: "Defects in Semiconductors",  desc: "Point defect thermodynamics \u2014 formation energy, charge transitions, equilibrium concentrations, and FNV correction", icon: "\u26A1" },
  { id: "cdtesolar",        chapter: 8,  label: "CdTe Solar Cell",            desc: "CdTe device physics, defect engineering, and photovoltaic performance optimization", icon: "\u2600" },
  { id: "forcefield",       chapter: 9,  label: "Force Fields",               desc: "Classical and machine-learned interatomic potentials \u2014 from harmonic bonds to ReaxFF and EAM", icon: "\u2699" },
  { id: "pipeline",         chapter: 10, label: "MLFF Pipeline",              desc: "DefectNet force field: graph neural network architecture, training, and deployment", icon: "\u{1F9E0}" },
  { id: "mlintro",          chapter: 11, label: "Introduction to ML",         desc: "Machine learning foundations, algorithms, neural networks, and applications in materials science", icon: "\u{1F916}" },
  { id: "llmdatamining",    chapter: 12, label: "LLM Data Mining",            desc: "LangGraph architecture, solid-state synthesis text-mining, and MongoDB data management", icon: "\u{1F4DA}" },
  { id: "aimlroadmap",      chapter: 13, label: "AI / ML Roadmap (2026)",      desc: "A complete path from math and classical ML to deep learning, LLM systems, production, research, and interview readiness", icon: "" },
];

const T = LIGHT;

export default function ScientificBlog() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  // If a chapter is selected via URL, render full MicroLab with that chapter active
  // We pass the chapter selection through by rendering MicroLab with initial module
  if (chapterId) {
    return <MicroLab initialModule={chapterId} blogMode />;
  }

  return (
    <div className="cs-page">
      <div className="cs-top">
        <Link className="cs-home" to="/"><span>←</span><span className="cs-homelabel">Home</span></Link>
        <span className="cs-chapnum">MicroLab</span>
        <span className="cs-chaptitle">Interactive materials science</span>
        <span className="cs-spacer" />
      </div>

      <div className="bl-wrap">
        <p className="bl-intro">
          An interactive learning platform covering the full stack of computational
          materials science — from quantum mechanics and density functional theory to
          machine learning force fields and data mining. Each chapter is a self-contained,
          animated module with equations, visualisations and worked examples.
        </p>

        <ol className="bl-list">
          {BLOG_CHAPTERS.map(ch => (
            <li key={ch.id}>
              <button onClick={() => navigate(`/blog/${ch.id}`)}>
                <span className="bl-n">{ch.chapter}</span>
                <span className="bl-body">
                  <span className="bl-title">{ch.label}</span>
                  <span className="bl-desc">{ch.desc}</span>
                </span>
                <span className="bl-go">→</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <footer className="cs-credit">
        Md Habibur Rahman · School of Materials Engineering, Purdue University ·{" "}
        <a href="mailto:rahma103@purdue.edu">rahma103@purdue.edu</a>
      </footer>
    </div>
  );
}
