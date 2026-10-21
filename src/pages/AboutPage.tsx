import { PROFILE } from '../data/projects';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.title}>{PROFILE.name}</h1>
          <p className={styles.subtitle}>{PROFILE.headline}</p>
        </div>
      </header>

      <div className="container container--narrow">
        {/* Bio */}
        <section className={styles.section} aria-labelledby="bio-heading">
          <h2 id="bio-heading" className={styles.h2}>Background</h2>
          <p className={styles.prose}>{PROFILE.bio}</p>
          <p className={styles.prose}>
            My work spans from device-level physics in TCAD simulation environments to
            system-level RTL design and verification, with additional interest in
            applying machine learning to EDA and computational lithography problems.
          </p>
          <p className={styles.prose}>
            I approach engineering with emphasis on technical rigour, documented methodology,
            and honest representation of results — distinguishing between implemented,
            simulated, and proposed features at every stage.
          </p>
        </section>

        {/* Academic background */}
        <section className={styles.section} aria-labelledby="academic-heading">
          <h2 id="academic-heading" className={styles.h2}>Academic Background</h2>
          <div className={styles.infoNote} role="note">
            Academic details are not published here to avoid inaccuracy.
            Please refer to the{' '}
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
            >
              LinkedIn profile ↗
            </a>{' '}
            for verified institutional information.
          </div>
        </section>

        {/* Technical domains */}
        <section className={styles.section} aria-labelledby="domains-heading">
          <h2 id="domains-heading" className={styles.h2}>Technical Domains</h2>
          <ul className={styles.domainGrid} role="list">
            {PROFILE.domains.map(d => (
              <li key={d} className={styles.domainItem}>
                <span className={styles.dot} aria-hidden="true"/>
                {d}
              </li>
            ))}
          </ul>
        </section>

        {/* Tools */}
        <section className={styles.section} aria-labelledby="tools-heading">
          <h2 id="tools-heading" className={styles.h2}>Tools &amp; Languages</h2>
          <ul className={styles.toolsList} role="list" aria-label="Tools and languages">
            {PROFILE.tools.map(t => (
              <li key={t} className={styles.toolChip}>{t}</li>
            ))}
          </ul>
        </section>

        {/* Engineering philosophy */}
        <section className={styles.section} aria-labelledby="philosophy-heading">
          <h2 id="philosophy-heading" className={styles.h2}>Engineering Philosophy</h2>
          <blockquote className={styles.quote}>
            Engineering begins at the material level and becomes a complete system through
            design, modelling, verification, and implementation.
          </blockquote>
          <p className={styles.prose}>
            I believe that good engineering work is characterised by clear problem formulation,
            honest documentation of methodology, careful separation of results from
            speculation, and reproducible evidence wherever possible.
          </p>
        </section>

        {/* Links */}
        <section className={styles.section} aria-labelledby="links-heading">
          <h2 id="links-heading" className={styles.h2}>Professional Profiles</h2>
          <div className={styles.linkGrid}>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
              <span className={styles.profilePlatform}>GitHub</span>
              <span className={styles.profileHandle}>ALLENJOE-A ↗</span>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
              <span className={styles.profilePlatform}>LinkedIn</span>
              <span className={styles.profileHandle}>allen-joe-a ↗</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
