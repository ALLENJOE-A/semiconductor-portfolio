import { Link } from 'react-router-dom';
import { PROFILE } from '../../data/projects';
import styles from './Footer.module.css';

const NAV = [
  ['/', 'Home'], ['/projects', 'Projects'],
  ['/research', 'Research'], ['/about', 'About'], ['/contact', 'Contact'],
] as const;

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.name}>{PROFILE.name}</span>
            <span className={styles.tagline}>Electronics &amp; VLSI Engineering</span>
            <p className={styles.byline}>
              Engineering begins at the material level and becomes a complete system
              through design, modelling, verification, and implementation.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className={styles.col}>
            <h3 className={styles.colHead}>Navigation</h3>
            <ul role="list">
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className={styles.col}>
            <h3 className={styles.colHead}>Connect</h3>
            <ul role="list">
              <li>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <span className={`${styles.copy} text-mono`}>
            © {new Date().getFullYear()} {PROFILE.name}
          </span>
          <span className={`${styles.note} text-mono`}>
            VLSI &amp; Semiconductor Engineering
          </span>
        </div>
      </div>
    </footer>
  );
}
