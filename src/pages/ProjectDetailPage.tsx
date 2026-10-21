import { useParams, Link } from 'react-router-dom';
import { PROJECTS, BENCHMARK_TABLE } from '../data/projects';
import { DmaArchitectureDiagram, DmaWaveformVisualizer, BiosensorDeviceVisualizer } from '../components/evidence/ProjectVisualEvidence';
import styles from './ProjectDetailPage.module.css';

// ── Benchmark table (DMA project) ──────────────────────────────────────────
function BenchmarkTable() {
  return (
    <div className={styles.tableWrap}>
      <p className={styles.tableNote}>
        ⓘ Results below are simulation results reported in the project README (Evidence category C —
        Reported result, not independently reproduced during portfolio build).
        Baseline = fixed burst; Adaptive = adaptive burst strategy.
      </p>
      <table className={styles.table} aria-label="DMA adaptive burst benchmark results">
        <thead>
          <tr>
            <th>Transfer Size</th>
            <th>Baseline Cycles</th>
            <th>Adaptive Cycles</th>
            <th>Cycle Reduction</th>
          </tr>
        </thead>
        <tbody>
          {BENCHMARK_TABLE.map(row => (
            <tr key={row.transferSize}>
              <td className="mono">{row.transferSize}</td>
              <td className="mono">{row.baseline.toLocaleString()}</td>
              <td className="mono">{row.adaptive.toLocaleString()}</td>
              <td className={`mono ${styles.reductionCell}`}>{row.reduction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Claims table ───────────────────────────────────────────────────────────
function ClaimsSection({ claims }: { claims: (typeof PROJECTS)[0]['claims'] }) {
  if (!claims.length) return null;
  const catLabel: Record<string, string> = {
    A: 'Source-verified',
    B: 'Test-verified',
    C: 'Reported result',
    D: 'Illustrative',
    E: 'Planned / Incomplete',
  };
  return (
    <section className={styles.section} aria-labelledby="claims-heading">
      <h2 id="claims-heading" className={styles.h2}>Technical Claims</h2>
      <p className={styles.claimsNote}>
        Evidence category definitions: A = Source-verified · B = Test-verified ·
        C = Reported result (not independently reproduced) · D = Illustrative · E = Planned
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label="Technical claims and evidence">
          <thead>
            <tr>
              <th>Claim</th>
              <th>Value</th>
              <th>Conditions</th>
              <th>Source</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c, i) => (
              <tr key={i}>
                <td>{c.claim}</td>
                <td className="mono">{c.value ?? '—'}{c.unit ? ` ${c.unit}` : ''}</td>
                <td className={styles.condCell}>{c.conditions ?? '—'}</td>
                <td className="mono">{c.sourceFile ?? '—'}</td>
                <td>
                  <span className={styles.evBadge} data-cat={c.evidenceCategory}>
                    {c.evidenceCategory} — {catLabel[c.evidenceCategory]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundCode}>404</p>
        <h1>Project not found</h1>
        <p>The project <code>{id}</code> doesn't exist in this portfolio.</p>
        <Link to="/projects" className={styles.backLink}>← Back to Projects</Link>
      </div>
    );
  }

  return (
    <article className={styles.page} aria-label={`Project: ${project.title}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <Link to="/projects" className={styles.back}>← All Projects</Link>
          <div className={styles.metaRow}>
            <span className={styles.status} data-status={project.status}>{project.status}</span>
            {project.category.map(c => (
              <span key={c} className={styles.cat}>{c}</span>
            ))}
          </div>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            View Repository on GitHub ↗
          </a>
        </div>
      </header>

      {/* Body */}
      <div className={styles.body}>
        <div className="container container--narrow">

          {/* Problem */}
          <section className={styles.section} aria-labelledby="problem-heading">
            <h2 id="problem-heading" className={styles.h2}>Problem Statement</h2>
            <p className={styles.prose}>{project.problem}</p>
          </section>

          {/* Motivation */}
          <section className={styles.section} aria-labelledby="motivation-heading">
            <h2 id="motivation-heading" className={styles.h2}>Motivation &amp; Objectives</h2>
            <p className={styles.prose}>{project.motivation}</p>
          </section>

          {/* Architecture */}
          <section className={styles.section} aria-labelledby="arch-heading">
            <h2 id="arch-heading" className={styles.h2}>Architecture</h2>
            <p className={styles.prose}>{project.architecture}</p>
            {project.id === 'dma-controller' && <DmaArchitectureDiagram />}
            {project.id === 'jltfet-biosensor' && <BiosensorDeviceVisualizer />}
          </section>

          {/* Methodology */}
          <section className={styles.section} aria-labelledby="method-heading">
            <h2 id="method-heading" className={styles.h2}>Implementation &amp; Methodology</h2>
            <p className={styles.prose}>{project.methodology}</p>
            {project.id === 'dma-controller' && <DmaWaveformVisualizer />}
          </section>

          {/* DMA-specific benchmark table */}
          {project.id === 'dma-controller' && (
            <section className={styles.section} aria-labelledby="bench-heading">
              <h2 id="bench-heading" className={styles.h2}>Adaptive Burst Benchmark Results</h2>
              <BenchmarkTable />
              <p className={styles.prose} style={{ marginTop: '1rem' }}>
                At 512 words, the adaptive strategy reduced total cycles by 5.61% and burst
                count by 50% relative to the fixed-burst baseline.
                The 32- and 64-word transfers show no cycle reduction because the transfer length
                does not exceed the minimum burst threshold.
                These are simulation results; no silicon measurements are claimed.
              </p>
            </section>
          )}

          {/* Technical claims */}
          <ClaimsSection claims={project.claims} />

          {/* Tools */}
          <section className={styles.section} aria-labelledby="tools-heading">
            <h2 id="tools-heading" className={styles.h2}>Tools &amp; Technologies</h2>
            <ul className={styles.toolList} role="list">
              {project.tools.map(t => (
                <li key={t} className={styles.toolChip}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <section className={styles.section} aria-labelledby="tags-heading">
            <h2 id="tags-heading" className={styles.h2}>Keywords</h2>
            <ul className={styles.tags} role="list">
              {project.tags.map(t => (
                <li key={t} className={styles.tag}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Repository link */}
          <div className={styles.repoBlock}>
            <p className={styles.repoLabel}>Source Repository</p>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoUrl}
            >
              {project.repoUrl} ↗
            </a>
          </div>

          {/* Back link */}
          <Link to="/projects" className={styles.backBottom}>← Back to All Projects</Link>
        </div>
      </div>
    </article>
  );
}
