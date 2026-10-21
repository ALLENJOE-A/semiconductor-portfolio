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
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#fff' }}>B.Tech in Electronics &amp; Communication Engineering</h3>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#5CE1E6', fontFamily: 'var(--font-mono)' }}>Focus: VLSI Systems, Semiconductor Physics &amp; AI for EDA</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#BFC8D0', lineHeight: 1.6 }}>
              Rigorous coursework in CMOS VLSI Design, Semiconductor Device Physics, Microarchitecture &amp; RTL Design, Computer Architecture, Synthesis &amp; Static Timing Analysis, and Machine Learning.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="/resume.pdf"
              download="Allen_Joe_A_VLSI_Resume.pdf"
              className={styles.inlineLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', padding: '0.4rem 0.8rem', borderRadius: '4px', color: '#d4af37', textDecoration: 'none' }}
            >
              Download Verified Resume (PDF) ⤓
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(92,225,230,0.08)', border: '1px solid rgba(92,225,230,0.25)', padding: '0.4rem 0.8rem', borderRadius: '4px', color: '#5CE1E6', textDecoration: 'none' }}
            >
              View Institutional Details on LinkedIn ↗
            </a>
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
