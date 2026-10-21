import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import { UnifiedSemiconductorScene } from '../3d/UnifiedSemiconductorScene';
import {
  BiosensorDeviceVisualizer,
  DmaArchitectureDiagram,
  DmaWaveformVisualizer,
} from '../evidence/ProjectVisualEvidence';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { PROFILE } from '../../data/projects';
import styles from './IntegratedPortfolioJourney.module.css';

// ── Check WebGL safely ─────────────────────────────────────────────
function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// ── Chapter Metadata ──────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'material',
    label: '01 / MATERIAL',
    navLabel: '01. Material',
    title: 'Crystalline Substrate & Electronic-Grade Silicon',
    narrative:
      'Every integrated circuit begins at the atomic material level. High-purity quartz silica (SiO₂) is reduced to 9N (99.9999999%) Electronic-Grade Silicon and pulled into a monocrystalline ingot boule through Czochralski growth at 1,420°C.',
    metrics: [
      { label: 'Feedstock', value: 'High-Purity Quartz (SiO₂)' },
      { label: 'Purity Level', value: '99.9999999% (9N EGS)' },
      { label: 'Lattice Constant', value: '5.431 Å (Diamond Cubic)' },
      { label: 'Growth Process', value: 'Czochralski (CZ) Boule' },
    ],
    range: [0.00, 0.20],
  },
  {
    id: 'substrate',
    label: '02 / SUBSTRATE',
    navLabel: '02. Wafer',
    title: 'Substrate Slicing & Semiconductor Device TCAD',
    narrative:
      'The monocrystalline boule is sliced with diamond-wire saws into 775µm discs and chemical-mechanically planarized to atomic flatness. Here, physical device engineering begins: designing next-generation sub-10nm architectures to combat short-channel effects and quantum leakage.',
    metrics: [
      { label: 'Wafer Diameter', value: '300 mm (SEMI M1.15)' },
      { label: 'Substrate Thickness', value: '775 ± 20 µm' },
      { label: 'TCAD Simulation', value: 'Synopsys Sentaurus' },
      { label: 'Transport Solver', value: 'Quantum Drift-Diffusion' },
    ],
    project: {
      id: 'tcad-jltfet',
      title: 'Sub-10nm TCAD Device Physics & FE-JLTFET',
      repoUrl: 'https://github.com/ALLENJOE-A/tcad-jltfet-biosensor',
    },
    range: [0.20, 0.40],
  },
  {
    id: 'device',
    label: '03 / DEVICE PHYSICS',
    navLabel: '03. Transistor',
    title: 'Nanoscale Conduction & Quantum Tunneling',
    narrative:
      'Diving into an individual die reveals the 3D FinFET gate stack. Investigating the FE-DGDM-JLTFET architecture: integrating ferroelectric negative capacitance (HZO) with a dielectric-modulated bio-cavity enables sub-60 mV/decade subthreshold swing and high-sensitivity label-free biomolecular detection.',
    metrics: [
      { label: 'Subthreshold Swing', value: '< 52 mV/decade' },
      { label: 'Ion / Ioff Ratio', value: '> 10⁷' },
      { label: 'High-κ Gate Stack', value: 'TiN / Hf₀.₅Zr₀.₅O₂ (HZO)' },
      { label: 'Channel Length', value: '10 nm Sub-Fin' },
    ],
    project: {
      id: 'tcad-jltfet',
      title: 'FE-DGDM-JLTFET TCAD Simulation Model',
      repoUrl: 'https://github.com/ALLENJOE-A/tcad-jltfet-biosensor',
    },
    range: [0.40, 0.60],
  },
  {
    id: 'architecture',
    label: '04 / DIGITAL VLSI',
    navLabel: '04. Circuit',
    title: 'Circuit Synthesis: GS-ADPLL & Adaptive Burst DMA',
    narrative:
      'Nanometer transistors interconnect through multi-tier copper dual-damascene metallization (M1–M4) into synthesized RTL blocks. My digital IC work focuses on high-efficiency data movement and phase-locked timing networks: a 4-channel AXI4/APB burst DMA controller and a gain-scheduled all-digital PLL.',
    metrics: [
      { label: 'DMA Transfer Sizing', value: 'INCR4 → INCR16 Dynamic' },
      { label: 'Bus Architecture', value: 'AMBA AXI4 Master / APB' },
      { label: 'ADPLL Lock Time', value: '85 Reference Cycles' },
      { label: 'ADPLL Phase Jitter', value: '1.8 ps RMS @ 2.4 GHz' },
    ],
    projects: [
      {
        id: 'burst-dma',
        title: '4-Channel Adaptive Burst DMA Controller',
        repoUrl: 'https://github.com/ALLENJOE-A/adaptive-burst-dma-controller',
      },
      {
        id: 'gs-adpll',
        title: 'Gain-Scheduled All-Digital PLL (GS-ADPLL)',
        repoUrl: 'https://github.com/ALLENJOE-A/gs-adpll-core',
      },
    ],
    range: [0.60, 0.80],
  },
  {
    id: 'chip',
    label: '05 / SYSTEM ON CHIP',
    navLabel: '05. Chip & AI',
    title: 'Packaged SoC & Machine Learning for EDA',
    narrative:
      'The synthesized functional cores assemble into a complete packaged chip with flip-chip BGA solder pads and copper heat spreader. At this integration scale, modern physical design relies on AI-driven EDA: Graph Neural Networks for optical proximity correction (OPC) and explainable thermal/IR drop hotspot prediction.',
    metrics: [
      { label: 'GNN Litho Acceleration', value: '14× vs Numerical OPC' },
      { label: 'Edge Placement Error', value: '< 1.2 nm RMS' },
      { label: 'Hotspot Detection Recall', value: '94.2% on Sub-7nm Grids' },
      { label: 'EDA Pipeline', value: 'PyTorch Geometric & Verilog' },
    ],
    projects: [
      {
        id: 'litho-gnn',
        title: 'Computational Lithography OPC via GNN',
        repoUrl: 'https://github.com/ALLENJOE-A/gnn-computational-lithography',
      },
      {
        id: 'hotspot-gnn',
        title: 'Explainable IR Drop & Thermal Hotspot Predictor',
        repoUrl: 'https://github.com/ALLENJOE-A/explainable-hotspot-gnn',
      },
    ],
    range: [0.80, 1.00],
  },
];

// ──────────────────────────────────────────────────────────────────
// REDUCED MOTION & NON-WEBGL ACCESSIBLE FALLBACK
// ──────────────────────────────────────────────────────────────────
function AccessibleFallback() {
  return (
    <div className={styles.fallbackContainer}>
      <header>
        <span className="text-mono" style={{ color: '#d4af37', fontSize: '0.8rem' }}>
          ENGINEERING ORIGIN STORY
        </span>
        <h1 style={{ fontSize: '2.4rem', color: '#fff', margin: '0.5rem 0 1rem' }}>
          From Silicon Physics to Advanced Digital Architectures
        </h1>
        <p style={{ color: '#9aa4b2', lineHeight: 1.6, maxWidth: '750px' }}>
          A unified engineering progression tracing semiconductor manufacturing and design: from silica crystal pulling, to nanoscale FinFET TCAD physics, digital RTL synthesis, and machine learning for EDA.
        </p>
      </header>

      {CHAPTERS.map((ch) => (
        <article key={ch.id} className={styles.fallbackCard}>
          <span className="text-mono" style={{ color: '#d4af37', fontSize: '0.75rem' }}>
            {ch.label}
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: '0.2rem 0 0.5rem' }}>
            {ch.title}
          </h2>
          <p style={{ color: '#9aa4b2', lineHeight: 1.6 }}>{ch.narrative}</p>

          {ch.id === 'device' && <BiosensorDeviceVisualizer />}
          {ch.id === 'architecture' && (
            <>
              <DmaArchitectureDiagram />
              <DmaWaveformVisualizer />
            </>
          )}

          <div className={styles.metricsGrid}>
            {ch.metrics.map((m, idx) => (
              <div key={idx} className={styles.metricItem}>
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// MAIN COMPONENT: INTEGRATED PORTFOLIO JOURNEY
// ──────────────────────────────────────────────────────────────────
export function IntegratedPortfolioJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported] = useState(() => checkWebGL());
  const reducedMotion = useReducedMotion();

  // Screen size detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 960);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Coordinated scroll tracking
  useEffect(() => {
    let animId: number;
    let targetP = 0;
    let currentP = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalDist = rect.height - window.innerHeight;
      if (totalDist <= 0) return;

      const scrolledDist = -rect.top;
      targetP = Math.min(Math.max(scrolledDist / totalDist, 0), 1);
    };

    const updateLoop = () => {
      currentP += (targetP - currentP) * 0.12;
      setScrollProgress(currentP);

      // Determine active chapter
      const idx = CHAPTERS.findIndex(
        (c) => currentP >= c.range[0] && currentP <= c.range[1]
      );
      if (idx !== -1) setActiveIdx(idx);

      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2,
    });
  }, []);

  const scrollToChapter = (idx: number) => {
    if (!containerRef.current) return;
    const ch = CHAPTERS[idx];
    const rect = containerRef.current.getBoundingClientRect();
    const runwayTop = window.scrollY + rect.top;
    const totalDist = rect.height - window.innerHeight;
    window.scrollTo({
      top: runwayTop + ch.range[0] * totalDist + 20,
      behavior: 'smooth',
    });
  };

  if (reducedMotion || !webglSupported) {
    return <AccessibleFallback />;
  }

  return (
    <div
      ref={containerRef}
      className={styles.journeyWrapper}
      onMouseMove={handleMouseMove}
      aria-label="Integrated Semiconductor Engineering Journey"
    >
      {/* ── STICKY 3D STAGE VIEWPORT ── */}
      <div className={styles.stickyCanvasStage}>
        <div className={styles.canvasInner}>
          <Canvas
            camera={{ position: [1.35, 1.0, 10.0], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <UnifiedSemiconductorScene
              progress={scrollProgress}
              mouse={mouse}
              isMobile={isMobile}
            />
          </Canvas>
        </div>

        {/* Minimal Unobtrusive Branding HUD */}
        <div className={styles.topHud}>
          <div className={styles.hudIdentity}>
            <span className={styles.hudName}>{PROFILE.name}</span>
            <span className={styles.hudDiscipline}>VLSI &amp; Semiconductor Engineering</span>
          </div>
          <div className={styles.hudPill}>
            <span className={styles.hudDot} aria-hidden="true" />
            <span>{CHAPTERS[activeIdx].label}</span>
          </div>
        </div>

        {/* Stage Scrubber Rail (Left margin) */}
        <nav className={styles.stageScrubber} aria-label="Journey stages">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              className={`${styles.scrubBtn} ${activeIdx === idx ? styles.active : ''}`}
              onClick={() => scrollToChapter(idx)}
              aria-label={`Jump to ${ch.navLabel}`}
            >
              <div className={styles.scrubBar} />
              <span className={styles.scrubLabel}>{ch.navLabel}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── COORDINATED EDITORIAL STORY TRACK ── */}
      <div className={styles.storyTrack}>
        {/* Chapter 1: Material */}
        <section className={styles.chapterSection} id="chapter-material">
          <div className={styles.editorialColumn}>
            <span className={styles.chapterBadge}>
              <span>◈</span> {CHAPTERS[0].label}
            </span>
            <h2 className={styles.chapterTitle}>{CHAPTERS[0].title}</h2>
            <p className={styles.chapterNarrative}>{CHAPTERS[0].narrative}</p>

            <div className={styles.artifactBox}>
              <div className={styles.artifactHeader}>
                <span>Material Physics &amp; Crystal Growth</span>
                <span>Substrate 01</span>
              </div>
              <div className={styles.metricsGrid}>
                {CHAPTERS[0].metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricValue}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 2: Substrate & Wafer */}
        <section className={styles.chapterSection} id="chapter-substrate">
          <div className={styles.editorialColumn}>
            <span className={styles.chapterBadge}>
              <span>◈</span> {CHAPTERS[1].label}
            </span>
            <h2 className={styles.chapterTitle}>{CHAPTERS[1].title}</h2>
            <p className={styles.chapterNarrative}>{CHAPTERS[1].narrative}</p>

            <div className={styles.artifactBox}>
              <div className={styles.artifactHeader}>
                <span>300mm Substrate Specifications</span>
                <span>SEMI Standards</span>
              </div>
              <div className={styles.metricsGrid}>
                {CHAPTERS[1].metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricValue}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.projectLinkRow}>
              <Link to="/projects/tcad-jltfet" className={styles.viewCaseStudyBtn}>
                Explore TCAD Device Research →
              </Link>
              <a
                href="https://github.com/ALLENJOE-A/tcad-jltfet-biosensor"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoBadge}
              >
                GitHub Repository ↗
              </a>
            </div>
          </div>
        </section>

        {/* Chapter 3: Device Physics & FinFET Biosensor */}
        <section className={styles.chapterSection} id="chapter-device">
          <div className={styles.editorialColumn}>
            <span className={styles.chapterBadge}>
              <span>◈</span> {CHAPTERS[2].label}
            </span>
            <h2 className={styles.chapterTitle}>{CHAPTERS[2].title}</h2>
            <p className={styles.chapterNarrative}>{CHAPTERS[2].narrative}</p>

            {/* Embedded Verified TCAD Schematic Artifact */}
            <div className={styles.artifactBox}>
              <div className={styles.artifactHeader}>
                <span>FE-DGDM-JLTFET Cross-Section</span>
                <span>Sentaurus TCAD</span>
              </div>
              <BiosensorDeviceVisualizer />
              <div className={styles.metricsGrid}>
                {CHAPTERS[2].metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricValue}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.projectLinkRow}>
              <Link to="/projects/tcad-jltfet" className={styles.viewCaseStudyBtn}>
                View Biosensor Case Study &amp; Physics →
              </Link>
              <a
                href="https://github.com/ALLENJOE-A/tcad-jltfet-biosensor"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoBadge}
              >
                Simulation Code ↗
              </a>
            </div>
          </div>
        </section>

        {/* Chapter 4: Digital VLSI Architectures */}
        <section className={styles.chapterSection} id="chapter-architecture">
          <div className={styles.editorialColumn}>
            <span className={styles.chapterBadge}>
              <span>◈</span> {CHAPTERS[3].label}
            </span>
            <h2 className={styles.chapterTitle}>{CHAPTERS[3].title}</h2>
            <p className={styles.chapterNarrative}>{CHAPTERS[3].narrative}</p>

            {/* Embedded Verified DMA Architecture & Timing Artifacts */}
            <div className={styles.artifactBox}>
              <div className={styles.artifactHeader}>
                <span>RTL Architecture &amp; Signal Waveforms</span>
                <span>SystemVerilog / Questa</span>
              </div>
              <DmaArchitectureDiagram />
              <DmaWaveformVisualizer />
              <div className={styles.metricsGrid}>
                {CHAPTERS[3].metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricValue}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.projectLinkRow}>
              <Link to="/projects/burst-dma" className={styles.viewCaseStudyBtn}>
                DMA Controller Case Study →
              </Link>
              <Link to="/projects/gs-adpll" className={styles.viewCaseStudyBtn}>
                GS-ADPLL Core →
              </Link>
            </div>
          </div>
        </section>

        {/* Chapter 5: Packaged SoC & AI for EDA */}
        <section className={styles.chapterSection} id="chapter-chip">
          <div className={styles.editorialColumn}>
            <span className={styles.chapterBadge}>
              <span>◈</span> {CHAPTERS[4].label}
            </span>
            <h2 className={styles.chapterTitle}>{CHAPTERS[4].title}</h2>
            <p className={styles.chapterNarrative}>{CHAPTERS[4].narrative}</p>

            <div className={styles.artifactBox}>
              <div className={styles.artifactHeader}>
                <span>Machine Learning for Physical Design</span>
                <span>GNN EDA Acceleration</span>
              </div>
              <div className={styles.metricsGrid}>
                {CHAPTERS[4].metrics.map((m, idx) => (
                  <div key={idx} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{m.label}</span>
                    <span className={styles.metricValue}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.projectLinkRow}>
              <Link to="/projects/litho-gnn" className={styles.viewCaseStudyBtn}>
                Litho-GNN Case Study →
              </Link>
              <Link to="/projects/hotspot-gnn" className={styles.viewCaseStudyBtn}>
                Hotspot Predictor →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
