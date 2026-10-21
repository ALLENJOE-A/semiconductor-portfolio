import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FullPageSemiconductorWorld } from '../components/3d/FullPageSemiconductorWorld';
import {
  BiosensorDeviceVisualizer,
  DmaArchitectureDiagram,
  DmaWaveformVisualizer,
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
              Bridging semiconductor device physics with high-performance digital RTL architectures and AI-accelerated physical design.
            </p>

            <p className={styles.heroBio}>
              I am an engineering student focused on the full silicon pipeline—from sub-10nm quantum transport modeling in Synopsys Sentaurus TCAD to synthesizable SystemVerilog RTL, cycle-accurate verification, and graph neural networks for automated electronic design.
            </p>

            <div className={styles.heroActions}>
              <a href="#projects" className={styles.btnPrimary}>
                Explore Featured Projects ↓
              </a>
              <a href="#tcad" className={styles.btnSecondary}>
                TCAD &amp; Device Physics ↓
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                GitHub Repositories ↗
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

            <div className={styles.scrollCue} aria-hidden="true">
              <span>Scroll to Explore Engineering Portfolio</span>
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
                Targeted research and hardware design areas spanning physics, architecture, and machine learning.
              </p>
            </header>

            <div className={styles.interestsGrid}>
              <div className={styles.interestCard}>
                <span className={styles.interestNum}>01 // PHYSICAL DEVICES</span>
                <h3 className={styles.interestTitle}>Semiconductor Physics &amp; TCAD</h3>
                <p className={styles.interestText}>
                  Investigating sub-10nm short-channel physics, quantum drift-diffusion, band-to-band tunneling, and negative capacitance ferroelectric gate stacks using Synopsys Sentaurus.
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
                  Constructing self-checking assertion-driven testbenches, hardware performance monitors, and waveform validation across corner cases in ModelSim / Questa.
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
                Featured Engineering Work
              </h2>
              <p className={styles.sectionSubtitle}>
                Open-source repositories, simulation models, and hardware testbenches with measured performance metrics.
              </p>
            </header>
          </div>
        </section>

        {/* ── 4. SEMICONDUCTOR DEVICE MODELLING & TCAD RESEARCH ── */}
        <section className={styles.section} id="tcad" aria-labelledby="tcad-heading">
          <div className={styles.centeredContainer}>
            <article className={styles.frostedCard} style={{ '--card-accent': '#c87d46' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Semiconductor Devices &amp; TCAD</span>
                <span className={styles.cardStatus}>Research Prototype · Sentaurus TCAD</span>
              </div>

              <h3 id="tcad-heading" className={styles.cardMainTitle}>
                Sub-10nm Junctionless TFET TCAD Modelling &amp; FE-DGDM Biosensor Investigation
              </h3>

              <p className={styles.cardDescription}>
                Investigation of a double-gate dielectric-modulated junctionless tunnel field-effect transistor with ferroelectric negative capacitance (FE-DGDM-JLTFET). By exploiting band-to-band tunneling and ferroelectric polarization in HZO (Hf₀.₅Zr₀.₅O₂), the device achieves sub-thermionic subthreshold swing, overcoming conventional MOSFET thermal limits for high-sensitivity label-free biomolecular detection.
              </p>

              {/* Embedded Verified Device Cross-Section */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>FE-DGDM-JLTFET Cross-Section Schematic</span>
                  <span>Sentaurus TCAD Simulation Model</span>
                </div>
                <BiosensorDeviceVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Subthreshold Swing (SS)</span>
                  <span className={styles.metricValue}>&lt; 52 mV/decade</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Ion / Ioff Current Ratio</span>
                  <span className={styles.metricValue}>&gt; 10⁷</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Ferroelectric Gate Stack</span>
                  <span className={styles.metricValue}>TiN / Hf₀.₅Zr₀.₅O₂ (HZO)</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Transport Framework</span>
                  <span className={styles.metricValue}>Non-Local Band-to-Band Tunneling</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/jltfet-biosensor" className={styles.linkDetail}>
                  Read TCAD Simulation Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/tcad-jltfet-biosensor"
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
            {/* Project A: 4-Channel Adaptive Burst DMA Controller */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#d4af37' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Digital Design &amp; RTL</span>
                <span className={styles.cardStatus}>Completed · SystemVerilog RTL</span>
              </div>

              <h3 id="rtl-heading" className={styles.cardMainTitle}>
                4-Channel Adaptive Burst DMA Controller with Hardware Performance Monitoring
              </h3>

              <p className={styles.cardDescription}>
                Synthesizable direct memory access controller implementing a dynamic burst-sizing engine that evaluates transfer length at runtime. Adapting from INCR4 up to INCR16 operations eliminates bus overhead on large transfers while preserving low latency on short descriptors, verified with non-intrusive 64-bit performance counters.
              </p>

              {/* Embedded Architecture Diagram & Waveform */}
              <div className={styles.artifactFrame}>
                <div className={styles.artifactTitleRow}>
                  <span>Hardware Architecture Block Diagram</span>
                  <span>SystemVerilog Synthesizable Structure</span>
                </div>
                <DmaArchitectureDiagram />
                <DmaWaveformVisualizer />
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Burst Count Reduction</span>
                  <span className={styles.metricValue}>50% on 512-word transfer</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Total Cycle Reduction</span>
                  <span className={styles.metricValue}>5.61% measured reduction</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Bus Protocol</span>
                  <span className={styles.metricValue}>AMBA AXI4 Master / APB Slave</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Independent Channels</span>
                  <span className={styles.metricValue}>4 Channels w/ Priority Arbiter</span>
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

            {/* Project B: Gain-Scheduled All-Digital PLL */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#2e7bff' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>Mixed-Signal &amp; VLSI Clocking</span>
                <span className={styles.cardStatus}>Completed · Verilog &amp; Simulink</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                Gain-Scheduled All-Digital Phase-Locked Loop (GS-ADPLL)
              </h3>

              <p className={styles.cardDescription}>
                All-digital frequency synthesizer incorporating dynamic loop-filter gain adaptation. High loop gain enables fast initial phase acquisition during frequency steps, switching seamlessly to low gain upon lock to suppress phase noise and DCO quantization jitter.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Lock Acquisition Time</span>
                  <span className={styles.metricValue}>85 reference cycles</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Phase Jitter</span>
                  <span className={styles.metricValue}>1.8 ps RMS @ 2.4 GHz</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Operating Frequency</span>
                  <span className={styles.metricValue}>2.4 GHz Carrier</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Implementation</span>
                  <span className={styles.metricValue}>Synthesizable Verilog &amp; Simulink</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <a
                  href="https://github.com/ALLENJOE-A"
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
            {/* Project C: Computational Lithography via GNN */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#4ecdc4' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>AI for EDA &amp; Physical Design</span>
                <span className={styles.cardStatus}>Under-Validation · PyTorch Geometric</span>
              </div>

              <h3 id="ai-eda-heading" className={styles.cardMainTitle}>
                Computational Lithography &amp; Mask Synthesis via Graph Neural Networks
              </h3>

              <p className={styles.cardDescription}>
                Graph representation of post-layout polygons for sub-resolution assist feature (SRAF) generation and optical proximity correction (OPC). Using spatial graph convolution replaces computationally prohibitive numerical diffraction solvers with inference acceleration on sub-14nm Manhattan layout geometries.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Inference Acceleration</span>
                  <span className={styles.metricValue}>14× vs. Numerical Calibre OPC</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Edge Placement Error (EPE)</span>
                  <span className={styles.metricValue}>&lt; 1.2 nm RMS</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Graph Structure</span>
                  <span className={styles.metricValue}>Edge-Attributed Layout Polygon Mesh</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Target Process Node</span>
                  <span className={styles.metricValue}>Sub-14nm Standard Cell Libraries</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/gnn-lithography" className={styles.linkDetail}>
                  View Computational Lithography Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/gnn-computational-lithography"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkRepo}
                >
                  Model Architecture ↗
                </a>
              </footer>
            </article>

            {/* Project D: Explainable Thermal Hotspot & IR Drop */}
            <article className={styles.frostedCard} style={{ '--card-accent': '#d4af37' } as React.CSSProperties}>
              <div className={styles.cardTopAccent} />
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardTag}>AI for EDA &amp; Power Integrity</span>
                <span className={styles.cardStatus}>Under-Validation · GNN &amp; CNN</span>
              </div>

              <h3 className={styles.cardMainTitle}>
                Explainable Thermal Hotspot and Dynamic IR-Drop Prediction
              </h3>

              <p className={styles.cardDescription}>
                Physics-informed graph neural network surrogate model that predicts power distribution network (PDN) dynamic IR-drop violations and localized thermal hotspots prior to routing sign-off. Incorporates GNNExplainer attribution to highlight high-resistance via bottlenecks.
              </p>

              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Hotspot Detection Recall</span>
                  <span className={styles.metricValue}>94.2% on Sub-7nm Power Grids</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>False Positive Rate</span>
                  <span className={styles.metricValue}>&lt; 3.8% across benchmark circuits</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Surrogate Speedup</span>
                  <span className={styles.metricValue}>120× vs SPICE simulation</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Explainability</span>
                  <span className={styles.metricValue}>Node &amp; Edge Feature Attribution</span>
                </div>
              </div>

              <footer className={styles.cardFooter}>
                <Link to="/projects/cnn-hotspot" className={styles.linkDetail}>
                  View Hotspot Predictor Case Study →
                </Link>
                <a
                  href="https://github.com/ALLENJOE-A/explainable-hotspot-gnn"
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

        {/* ── 7. TECHNICAL SKILLS & TOOLS ── */}
        <section className={styles.section} id="skills" aria-labelledby="skills-heading">
          <div className={styles.centeredContainer}>
            <header className={styles.sectionHeader}>
              <span className={styles.sectionPill}>Toolchains &amp; Competencies</span>
              <h2 id="skills-heading" className={styles.sectionTitle}>
                Technical Skills &amp; EDA Environments
              </h2>
            </header>

            <div className={styles.frostedCard}>
              <div className={styles.toolsChipGrid}>
                {PROFILE.tools.map((t) => (
                  <span key={t} className={styles.toolChip}>
                    {t}
                  </span>
                ))}
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
                Education &amp; Academic Milestones
              </h2>
            </header>

            <div className={styles.milestoneCard}>
              <h3 className={styles.milestoneDegree}>{PROFILE.degree}</h3>
              <p className={styles.milestoneCoursework}>
                Specialization coursework: VLSI Physical Design, Solid State Semiconductor Devices, Digital System Design, Computer Architecture, Embedded System Design, and Hardware Description Languages.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. CONTACT & COLLABORATION ── */}
        <section className={styles.section} id="contact" aria-labelledby="contact-heading">
          <div className={styles.centeredContainer}>
            <div className={styles.contactCard}>
              <header className={styles.sectionHeader}>
                <span className={styles.sectionPill}>Open to Opportunities</span>
                <h2 id="contact-heading" className={styles.sectionTitle}>
                  Let&apos;s Connect &amp; Collaborate
                </h2>
                <p className={styles.sectionSubtitle}>
                  Interested in semiconductor device physics, digital ASIC design, or ML-accelerated EDA workflows? Connect directly or explore open repositories.
                </p>
              </header>

              <div className={styles.contactActions}>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnPrimary}
                >
                  GitHub Repositories ↗
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
