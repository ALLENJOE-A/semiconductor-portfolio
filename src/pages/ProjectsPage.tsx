import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS, type ProjectCategory } from '../data/projects';
import styles from './ProjectsPage.module.css';

const CATEGORIES: ProjectCategory[] = [
  'Digital Design & RTL',
  'ASIC & VLSI',
  'Semiconductor Devices & TCAD',
  'AI for Semiconductor Engineering',
  'Embedded Systems',
  'Verification & Testing',
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'All'>('All');

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category.includes(activeFilter));

  // Only show category chips that have matching projects
  const usedCategories = CATEGORIES.filter(cat =>
    PROJECTS.some(p => p.category.includes(cat))
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Engineering Portfolio</p>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>
            Digital design, semiconductor devices, AI for EDA, and embedded systems.
            Status labels reflect current repository evidence.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filter bar */}
        <div className={styles.filters} role="group" aria-label="Filter projects by category">
          <button
            className={`${styles.filterBtn} ${activeFilter === 'All' ? styles.active : ''}`}
            onClick={() => setActiveFilter('All')}
            aria-pressed={activeFilter === 'All'}
          >
            All ({PROJECTS.length})
          </button>
          {usedCategories.map(cat => {
            const count = PROJECTS.filter(p => p.category.includes(cat)).length;
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
                onClick={() => setActiveFilter(cat)}
                aria-pressed={activeFilter === cat}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Project list */}
        {filtered.length === 0 ? (
          <p className={styles.empty}>No projects in this category yet.</p>
        ) : (
          <ul className={styles.list} role="list">
            {filtered.map(project => (
              <li key={project.id}>
                <Link to={`/projects/${project.id}`} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <div className={styles.cardAccent} style={{ background: project.accentColor }} aria-hidden="true"/>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      <span className={styles.status} data-status={project.status}>
                        {project.status}
                      </span>
                      {project.category.map(c => (
                        <span key={c} className={styles.cat}>{c}</span>
                      ))}
                    </div>
                    <h2 className={styles.cardTitle}>{project.title}</h2>
                    <p className={styles.cardSummary}>{project.summary}</p>
                    <ul className={styles.tags} aria-label="Technologies">
                      {project.tags.slice(0, 5).map(t => (
                        <li key={t} className={styles.tag}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.cardArrow} aria-hidden="true">→</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
