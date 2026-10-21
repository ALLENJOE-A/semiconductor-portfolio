import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FullPageSemiconductorWorld } from '../components/3d/FullPageSemiconductorWorld';
import {
  BiosensorDeviceVisualizer,
  DmaArchitectureDiagram,
  DmaWaveformVisualizer,
  AdpllArchitectureVisualizer,
  GnnLithoArchitectureVisualizer,
} from '../components/evidence/ProjectVisualEvidence';
import { PROFILE } from '../data/projects';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Native document scroll tracking across the entire website (0.00 to 1.00)
  useEffect(() => {
    let animId: number;
    let targetP = 0;
    let currentP = 0;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetP = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };

    const updateLoop = () => {
      currentP += (targetP - currentP) * 0.1;
      setScrollProgress(currentP);
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

  return (
    <div className={styles.pageRoot} onMouseMove={handleMouseMove}>
      {/* ── CONTINUOUS 3D SEMICONDUCTOR WORLD (ACTIVE THROUGHOUT ENTIRE SITE) ── */}
      <FullPageSemiconductorWorld progress={scrollProgress} mouse={mouse} />

      {/* ── FOREGROUND CONTENT (CENTRED, LARGE, EDITORIAL COMPOSITION) ── */}
      <div className={styles.contentWrapper}>
        {/* ── 1. PERSONAL INTRODUCTION (FIRST SCREEN, 100vh) ── */}
        <section className={styles.heroSection} aria-label="Personal Introduction">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>◈</span>
              <span>{PROFILE.name} · {PROFILE.headline}</span>
            </div>

            <h1 className={styles.heroName}>Allen Joe A</h1>

            <p className={styles.heroHeadline}>
              Digital ASIC &amp; RTL Design · TCAD Semiconductor Physics · AI for EDA
            </p>

            <p className={styles.heroBio}>
              Specializing in synthesizable microarchitectures in SystemVerilog, self-checking functional verification, nanoscale quantum transport modeling in Synopsys Sentaurus TCAD, and graph neural networks for automated physical design.
            </p>

            {/* Recruiter-Ready Call to Action Group */}
            <div className={styles.heroActions}>
              <a href="#projects" className={styles.btnPrimary}>
                View Engineering Projects ↓
              </a>
              <a
                href="/resume.pdf"
                download="Allen_Joe_A_VLSI_Resume.pdf"
                className={styles.btnPrimary}
                style={{ background: '#e5c158' }}
              >
                Download Resume ⤓
              </a>
              <a href="#contact" className={styles.btnSecondary}>
                Contact Me ↓
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                GitHub Profile ↗
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                LinkedIn Profile ↗
              </a>
            </div>

            {/* Recruiter Fast-Facts Snapshot Bar */}
            <div className={styles.recruiterSnapshotGrid}>
              <div className={styles.snapshotCard}>
                <span className={styles.snapshotLabel}>Target Roles</span>
                <span className={styles.snapshotValue}>RTL Design · ASIC Architecture · TCAD Modeling · Physical Design</span>
              </div>
              <div className={styles.snapshotCard}>
                <span className={styles.snapshotLabel}>Core Languages &amp; EDA</span>
                <span className={styles.snapshotValue}>SystemVerilog, Sentaurus TCAD, ModelSim/Questa, PyTorch, OpenROAD</span>
              </div>
              <div className={styles.snapshotCard}>
                <span className={styles.snapshotLabel}>Academic Foundation</span>
                <span className={styles.snapshotValue}>B.E. in Electronics &amp; VLSI Engineering</span>
              </div>
            </div>

            <div className={styles.scrollCue} aria-hidden="true">
              <span>Scroll to Explore Technical Case Studies</span>
              <span>↓</span>
            </div>
          </div>
        </section>

        {/* ── 2. ENGINEERING INTERESTS & PILLARS ── */}
        <section className={styles.section} id="interests" aria-labelledby="interests-heading">
          <div className={styles.centeredContainer}>
            <header className={styles.sectionHeader}>
              <span className={styles.sectionPill}>Core Engineering Focus</span>
              <h2 id="interests-heading" className={styles.sectionTitle}>
                Technical Disciplines &amp; Problem Domains
              </h2>
              <p className={styles.sectionSubtitle}>
                Targeted research and hardware design areas spanning physics, architecture, verification, and machine learning.
              </p>
            </header>

            <div className={styles.interestsGrid}>
              <div className={styles.interestCard}>
                <span className={styles.interestNum}>01 // PHYSICAL DEVICES</span>
                <h3 className={styles.interestTitle}>Semiconductor Physics &amp; TCAD</h3>
                <p className={styles.interestText}>
                  Investigating sub-10nm short-channel physics, quantum drift-diffusion, band-to-band tunneling, and negative capacitance ferroelectric gate stacks using Synopsys Sentaurus (SDE &amp; SDevice).
                </p>
              </div>

              <div className={styles.interestCard}>
                <span className={styles.interestNum}>02 // DIGITAL ICs</span>
                <h3 className={styles.interestTitle}>Digital RTL &amp; ASIC Architecture</h3>
                <p className={styles.interestText}>
                  Designing high-throughput synthesizable hardware in SystemVerilog: AMBA AXI4/APB bus interfaces, dynamic burst-sizing DMA engines, and rapid-locking ADPLL clock synthesizers.
                </p>
              </div>

              <div className={styles.interestCard}>
                <span className={styles.interestNum}>03 // VERIFICATION</span>
                <h3 className={styles.interestTitle}>Functional Verification &amp; Testing</h3>
                <p className={styles.interestText}>
                  Constructing self-checking assertion-driven testbenches, non-intrusive performance counters, and comprehensive corner-case coverage in ModelSim / Questa.
                </p>
              </div>

              <div className={styles.interestCard}>
                <span className={styles.interestNum}>04 // AI FOR EDA</span>
                <h3 className={styles.interestTitle}>Machine Learning for Physical Design</h3>
                <p className={styles.interestText}>
                  Deploying Graph Neural Networks to accelerate computational lithography (OPC) and predict early-stage thermal hotspots and IR-drop anomalies on power distribution networks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED PROJECTS OVERVIEW ── */}
        <section className={styles.section} id="projects" aria-labelledby="projects-heading">
          <div className={styles.centeredContainer}>
            <header className={styles.sectionHeader}>
              <span className={styles.sectionPill}>Verified Hardware Implementations</span>
              <h2 id="projects-heading" className={styles.sectionTitle}>
                Prioritized Case Studies &amp; Research
              </h2>
              <p className={styles.sectionSubtitle}>
                Repository-backed implementations with explicit evidence categories: Category A (Source-verified), Category B (Test-verified), and Category C (Reported result).
              </p>
            </header>
          </div>
        </section>

        {/* ── 4. SEMICONDUCTOR DEVICE MODELLING & TCAD RESEARCH ── */}
        <section className={styles.section} id="tcad" aria-labelledby="tcad-heading">
          <div className={styles.centeredContainer}>
            {/* Project: FE-DGDM-JLTFET Biosensor */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#c87d46' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Semiconductor Devices &amp; TCAD</span>
                <span className={styles.cardStatus}>Research Prototype · Sentaurus TCAD</span>
              </div>

              <h3 id="tcad-heading" className={styles.cardMainTitle}>
                FE-DGDM-JLTFET Biosensor Device Physics Modelling (Sentaurus TCAD)
              </h3>

              <p className={styles.cardDescription}>
                TCAD investigation of a double-gate dielectric-modulated junctionless tunnel field-effect transistor with ferroelectric negative capacitance (FE-DGDM-JLTFET). Integrating ferroelectric polarization in HZO (Hf₀.₅Zr₀.₅O₂) overcomes the 60 mV/decade Boltzmann thermal limit through steep sub-thermionic switching for label-free biomolecular detection.
              </p>

              {/* Embedded Verified Device Cross-Section */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>FE-DGDM-JLTFET Cross-Section Schematic</span>
                  <span>Sentaurus TCAD Simulation Model (Tcl Decks)</span>
                </div>
                <BiosensorDeviceVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Subthreshold Swing (SS)</span>
                  <span className={styles.metricValue}>&lt; 52 mV/decade (Sub-Thermionic)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Ion / Ioff Current Ratio</span>
                  <span className={styles.metricValue}>&gt; 10⁷ High-Sensitivity Switching</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Gate Stack Architecture</span>
                  <span className={styles.metricValue}>TiN Metal Gate / Hf₀.₅Zr₀.₅O₂ (HZO)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>TCAD Physics Framework</span>
                  <span className={styles.metricValue}>Non-Local Band-to-Band Tunneling (SDevice)</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/jltfet-biosensor" className={styles.linkDetail}>
                  Read Detailed TCAD Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/FE-DGDM-JLTFET-Biosensor-TCAD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  TCAD Repository ↗
                </a>
              </footer>
            </article>

            {/* Project: DG Source-Pocket Engineered Vertical TFET */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#5CE1E6' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Semiconductor Devices &amp; TCAD</span>
                <span className={styles.cardStatus}>Research Prototype · Sentaurus TCAD</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                DG Source-Pocket Engineered Vertical TFET Simulation
              </h3>

              <p className={styles.cardDescription}>
                Sentaurus TCAD simulation study of a double-gate vertical tunnel FET incorporating source-pocket doping engineering. Enhancing the local electric field at the source-channel junction significantly increases band-to-band tunneling probability, boosting ON-state drive current without sacrificing the steep subthreshold slope.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Architecture</span>
                  <span className={styles.metricValue}>Vertical Double-Gate with Source Pocket</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Simulation Suite</span>
                  <span className={styles.metricValue}>Sentaurus SDE (Geometry) &amp; SDevice (Physics)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Physics Solvers</span>
                  <span className={styles.metricValue}>Drift-Diffusion &amp; Band-to-Band Tunneling</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Evidence Category</span>
                  <span className={styles.metricValue}>Cat C · Source-Deck Verified in Git</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/dgsp-vtfet" className={styles.linkDetail}>
                  View Vertical TFET Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/DG-Source-Pocket-Engineered-Vertical-TFET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  GitHub Repository ↗
                </a>
              </footer>
            </article>
          </div>
        </section>

        {/* ── 5. ASIC, RTL DESIGN, DMA & ADPLL PROJECTS ── */}
        <section className={styles.section} id="rtl" aria-labelledby="rtl-heading">
          <div className={styles.centeredContainer}>
            {/* Project 1: Gain-Scheduled All-Digital PLL */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#d4af37' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Digital Design &amp; ASIC Architecture</span>
                <span className={styles.cardStatus}>Research Prototype · Verilog &amp; OpenROAD</span>
              </div>

              <h3 id="rtl-heading" className={styles.cardMainTitle}>
                Gain-Scheduled All-Digital Phase-Locked Loop (GS-ADPLL) &amp; RTL-to-GDS Flow
              </h3>

              <p className={styles.cardDescription}>
                All-digital frequency synthesizer incorporating dynamic loop-filter gain adaptation to eliminate the conventional tradeoff between lock speed and output jitter. Operating with high loop gain during initial phase frequency acquisition achieves lock in under 100 cycles, transitioning dynamically to low gain upon lock to suppress DCO quantization noise and phase jitter.
              </p>

              {/* Embedded Architecture Visualizer */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>GS-ADPLL Dual-Mode Loop Architecture</span>
                  <span>Verilog RTL Microarchitecture &amp; Physical Flow</span>
                </div>
                <AdpllArchitectureVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Lock Acquisition Time</span>
                  <span className={styles.metricValue}>85 Reference Cycles (Simulated)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>RMS Phase Jitter</span>
                  <span className={styles.metricValue}>1.8 ps RMS @ 2.4 GHz Carrier</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Physical Design Flow</span>
                  <span className={styles.metricValue}>OpenLane / OpenROAD Standard Cell</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Implementation Status</span>
                  <span className={styles.metricValue}>Simulated RTL / Physical Flow Pending Sign-off</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/adpll-core" className={styles.linkDetail}>
                  View ADPLL Architecture Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/gs-adpll-core"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  GitHub Repository ↗
                </a>
              </footer>
            </article>

            {/* Project 2: 4-Channel Adaptive Burst DMA Controller */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#2E7BFF' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Digital Design &amp; Verification</span>
                <span className={styles.cardStatus}>Completed · SystemVerilog RTL</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                4-Channel Adaptive Burst DMA Controller with Hardware Performance Monitoring
              </h3>

              <p className={styles.cardDescription}>
                Synthesizable direct memory access controller implementing a dynamic burst-sizing engine that evaluates transfer length at runtime. Adapting from INCR4 up to INCR16 operations eliminates bus overhead on large transfers while preserving low latency on short descriptors, verified with 6,266 checks and dedicated hardware performance counters.
              </p>

              {/* Embedded Architecture Diagram & Waveform */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>Hardware Architecture &amp; Signal Waveform Trace</span>
                  <span>SystemVerilog Synthesizable RTL / ModelSim</span>
                </div>
                <DmaArchitectureDiagram />
                <DmaWaveformVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Burst Count Reduction</span>
                  <span className={styles.metricValue}>50% on 512-word transfer (Cat C)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Total Cycle Reduction</span>
                  <span className={styles.metricValue}>5.61% measured reduction (Cat C)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Verification Robustness</span>
                  <span className={styles.metricValue}>6,266 checks · 964 assertions · 0 failures</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Bus Protocol Interface</span>
                  <span className={styles.metricValue}>AMBA AXI4 Master / APB Slave</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/dma-controller" className={styles.linkDetail}>
                  View Complete DMA Case Study &amp; Benchmarks →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/4-Channel-Adaptive-Burst-DMA-Controller-with-Hardware-Performance-Monitoring"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  SystemVerilog Source ↗
                </a>
              </footer>
            </article>

            {/* Project 3: CNN PE Array Accelerator */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#2E7BFF' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Digital Design &amp; RTL</span>
                <span className={styles.cardStatus}>In-Progress · SystemVerilog / Verilog</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                Efficient Processing Element Array for CNN Accelerator
              </h3>

              <p className={styles.cardDescription}>
                RTL microarchitecture of a 2D systolic multiply-accumulate array optimized for convolutional neural network inference. Coordinates weight stationary dataflow, activation streaming buffers, and pipelined accumulation trees to achieve high arithmetic density on FPGA and standard-cell ASIC targets.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Architecture</span>
                  <span className={styles.metricValue}>2D Systolic Multiply-Accumulate Array</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Dataflow Strategy</span>
                  <span className={styles.metricValue}>Weight-Stationary Activation Streaming</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Target Implementation</span>
                  <span className={styles.metricValue}>FPGA / Standard-Cell ASIC Synthesis</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>HDL Toolchain</span>
                  <span className={styles.metricValue}>SystemVerilog, Verilog, ModelSim</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/pe-array-cnn" className={styles.linkDetail}>
                  Explore PE Array Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/DESIGN-AND-IMPLEMENTATION-OF-EFFICIENT-PROCESSING-ELEMENT-ARRAY-FOR-CNN-ACCELERATOR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  GitHub Repository ↗
                </a>
              </footer>
            </article>
          </div>
        </section>

        {/* ── 6. AI FOR EDA, COMPUTATIONAL LITHOGRAPHY & HOTSPOTS ── */}
        <section className={styles.section} id="ai-eda" aria-labelledby="ai-eda-heading">
          <div className={styles.centeredContainer}>
            {/* Project 1: GNN-T Computational Lithography */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#4ecdc4' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>AI for EDA &amp; Physical Design</span>
                <span className={styles.cardStatus}>In-Progress · PyTorch Geometric</span>
              </div>

              <h3 id="ai-eda-heading" className={styles.cardMainTitle}>
                GNN-T Edge Error Prediction for Computational Lithography
              </h3>

              <p className={styles.cardDescription}>
                Graph neural network approach mapping post-layout GDSII polygon vertices into spatial proximity graphs. A transformer-augmented spatial edge convolution pipeline predicts sub-resolution assist feature (SRAF) edge placement errors, demonstrating up to 14× inference speedup over expensive full-chip numerical diffraction simulation.
              </p>

              {/* Embedded GNN Architecture Pipeline */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>GNN-T Polygon Graph Neural Network Pipeline</span>
                  <span>Spatial Edge Convolution &amp; Attention</span>
                </div>
                <GnnLithoArchitectureVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Inference Acceleration</span>
                  <span className={styles.metricValue}>14× vs. Numerical Calibre OPC</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Edge Placement Error (EPE)</span>
                  <span className={styles.metricValue}>&lt; 1.2 nm RMS on benchmark layouts</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Graph Formulation</span>
                  <span className={styles.metricValue}>Polygon Edges as Nodes / Proximity as Edges</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Framework</span>
                  <span className={styles.metricValue}>PyTorch Geometric, NumPy, Python</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/gnn-lithography" className={styles.linkDetail}>
                  Read Computational Lithography Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/GNN-T_Edge-Error-Prediction-for-Computational-Lithography"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  GitHub Repository ↗
                </a>
              </footer>
            </article>

            {/* Project 2: CNN-Driven Explainable AI for Hotspot Detection */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#5CE1E6' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>AI for EDA &amp; Yield Optimization</span>
                <span className={styles.cardStatus}>In-Progress · PyTorch &amp; Grad-CAM</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                CNN-Driven Explainable AI for Lithography Hotspot Detection
              </h3>

              <p className={styles.cardDescription}>
                Convolutional neural network classifier trained on layout pattern images to detect yield-killing lithographic hotspots. Post-training Grad-CAM spatial attribution generates interpretable heatmaps highlighting the exact geometric features driving hotspot classifications, aiding physical design sign-off.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Classifier Architecture</span>
                  <span className={styles.metricValue}>Deep CNN with Residual Feature Extractors</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Explainability Framework</span>
                  <span className={styles.metricValue}>Grad-CAM Saliency &amp; Spatial Attribution</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Application Scope</span>
                  <span className={styles.metricValue}>Post-OPC Layout Verification &amp; Yield Learning</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Software Stack</span>
                  <span className={styles.metricValue}>PyTorch, Grad-CAM, NumPy, OpenCV</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/cnn-hotspot" className={styles.linkDetail}>
                  Read Hotspot Detection Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/CNN-Driven-Explainable-AI-for-Lithography-Hotspot-Detection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  GitHub Repository ↗
                </a>
              </footer>
            </article>
          </div>
        </section>

        {/* ── 7. TECHNICAL SKILLS GROUPED BY DISCIPLINE ── */}
        <section className={styles.section} id="skills" aria-labelledby="skills-heading">
          <div className={styles.centeredContainer}>
            <header className={styles.sectionHeader}>
              <span className={styles.sectionPill}>Engineering Competencies</span>
              <h2 id="skills-heading" className={styles.sectionTitle}>
                Technical Skills &amp; EDA Toolchains
              </h2>
              <p className={styles.sectionSubtitle}>
                Competencies grouped by semiconductor discipline, verified by project repositories and coursework.
              </p>
            </header>

            <div className={styles.skillCategoryGrid}>
              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>01</span>
                  <span>Digital RTL &amp; Microarchitecture</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['SystemVerilog', 'Verilog', 'AMBA AXI4 / APB', 'DMA Controllers', 'FIFO / Arbiter Design', 'Pipelined Datapaths'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>02</span>
                  <span>Functional Verification</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['SystemVerilog Assertions (SVA)', 'ModelSim / Questa', 'Self-Checking Testbenches', 'Cycle-Accurate Modeling', 'Performance Counters'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>03</span>
                  <span>Semiconductor Physics &amp; TCAD</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['Synopsys Sentaurus', 'Sentaurus SDE', 'Sentaurus SDevice', 'Quantum Drift-Diffusion', 'Band-to-Band Tunneling', 'Ferroelectric HZO'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>04</span>
                  <span>ASIC &amp; Physical Design Flow</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['OpenLane', 'OpenROAD', 'Static Timing Analysis (STA)', 'Clock Tree Synthesis (CTS)', 'Standard Cell Placement', 'RTL-to-GDSII'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>05</span>
                  <span>AI for EDA &amp; Scientific Computing</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['PyTorch', 'PyTorch Geometric (GNNs)', 'Grad-CAM XAI', 'Python / NumPy', 'Graph Edge Convolution', 'OPC Surrogate Modeling'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategoryCard}>
                <div className={styles.skillCategoryHeader}>
                  <span>06</span>
                  <span>Embedded Systems &amp; Tooling</span>
                </div>
                <div className={styles.toolsChipGrid}>
                  {['C / C++', 'STM32 Microcontrollers', 'ADC / DMA Drivers', 'Raspberry Pi 5 (Edge AI)', 'Git & Version Control', 'Tcl / Linux Shell'].map(t => (
                    <span key={t} className={styles.toolChip}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. EDUCATION & MILESTONES ── */}
        <section className={styles.section} id="education" aria-labelledby="education-heading">
          <div className={styles.centeredContainer}>
            <header className={styles.sectionHeader}>
              <span className={styles.sectionPill}>Academic Foundation</span>
              <h2 id="education-heading" className={styles.sectionTitle}>
                Education &amp; Academic Background
              </h2>
            </header>

            <div className={styles.milestoneCard}>
              <h3 className={styles.milestoneDegree}>{PROFILE.degree}</h3>
              <p className={styles.milestoneCoursework}>
                Rigorous curriculum covering the full hardware hierarchy: VLSI Physical Design &amp; Technology, Solid State Semiconductor Devices, Digital Microelectronics, Computer Architecture, Embedded Systems, and Modern Synthesis Algorithms.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. CONTACT & RECRUITER DETAILS ── */}
        <section className={styles.section} id="contact" aria-labelledby="contact-heading">
          <div className={styles.centeredContainer}>
            <div className={styles.contactCard}>
              <header className={styles.sectionHeader}>
                <span className={styles.sectionPill}>Open to Opportunities</span>
                <h2 id="contact-heading" className={styles.sectionTitle}>
                  Connect &amp; Collaborate
                </h2>
                <p className={styles.sectionSubtitle}>
                  Interested in discussing semiconductor engineering opportunities at Intel, AMD, Qualcomm, NVIDIA, or academic research collaborations? Reach out directly.
                </p>
              </header>

              <div className={styles.contactActions}>
                <a
                  href="/resume.pdf"
                  download="Allen_Joe_A_VLSI_Resume.pdf"
                  className={styles.btnPrimary}
                >
                  Download Resume ⤓
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  GitHub Profile ↗
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondary}
                >
                  LinkedIn Profile ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
