import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import styles from './ResearchPage.module.css';

const RESEARCH_IDS = ['jltfet-biosensor', 'dgsp-vtfet', 'gnn-lithography', 'cnn-hotspot'];

export default function ResearchPage() {
  const researchProjects = PROJECTS.filter(p => RESEARCH_IDS.includes(p.id));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Academic Research</p>
          <h1 className={styles.title}>Semiconductor Research</h1>
          <p className={styles.subtitle}>
            TCAD device simulation, AI-driven computational lithography, and advanced
            semiconductor device concepts explored through simulation and modelling.
          </p>
        </div>
      </header>

      <div className="container">
        {/* Disclaimer */}
        <div className={styles.disclaimer} role="note">
          <strong>Note on visualisations:</strong> 3D illustrations and conceptual diagrams
          on this site are artistic representations. They are not simulation outputs and
          should not be interpreted as measured or validated scientific data.
          Where specific TCAD results are referenced, the source file and evidence
          category are clearly identified.
        </div>

        {/* Research areas */}
        <section className={styles.areas} aria-labelledby="areas-heading">
          <h2 id="areas-heading" className={styles.h2}>Research Directions</h2>
          <ul className={styles.areaGrid} role="list">
            {[
              {
                title: 'Semiconductor Device Modelling',
                desc: 'TCAD-based simulation of advanced FET structures including tunnel FETs, junctionless devices, ferroelectric gates, and biosensor configurations using Sentaurus.',
                icon: '⬡',
              },
              {
                title: 'Computational Lithography & AI for EDA',
                desc: 'Machine learning approaches to optical proximity correction, edge-placement error prediction, and lithographic hotspot detection using CNNs and GNNs.',
                icon: '◈',
              },
              {
                title: 'Digital RTL Design & Verification',
                desc: 'Synthesisable RTL design of controllers, memory interfaces, and datapath components with formal-style self-checking testbenches in SystemVerilog.',
                icon: '◻',
              },
              {
                title: 'Hardware Accelerator Architecture',
                desc: 'PE array design for CNN inference acceleration, targeting high arithmetic density with minimal area and power overhead.',
                icon: '⬢',
              },
            ].map(area => (
              <li key={area.title} className={styles.areaCard}>
                <span className={styles.areaIcon} aria-hidden="true">{area.icon}</span>
                <h3 className={styles.areaTitle}>{area.title}</h3>
                <p className={styles.areaDesc}>{area.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Research projects */}
        <section className={styles.projects} aria-labelledby="rproj-heading">
          <h2 id="rproj-heading" className={styles.h2}>Research Projects</h2>
          <ul className={styles.projList} role="list">
            {researchProjects.map(p => (
              <li key={p.id}>
                <Link to={`/projects/${p.id}`} className={styles.projCard}>
                  <div className={styles.projAccent} style={{ background: p.accentColor }} aria-hidden="true"/>
                  <div className={styles.projBody}>
                    <span className={styles.projStatus} data-status={p.status}>{p.status}</span>
                    <h3 className={styles.projTitle}>{p.title}</h3>
                    <p className={styles.projSummary}>{p.summary}</p>
                    <ul className={styles.projTags} aria-label="Keywords">
                      {p.tags.slice(0, 5).map(t => (
                        <li key={t} className={styles.tag}>{t}</li>
                      ))}
                    </ul>
                    <span className={styles.projLink}>View project details →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
