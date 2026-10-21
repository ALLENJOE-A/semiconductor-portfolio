import { PROFILE } from '../data/projects';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Interested in discussing semiconductor engineering, digital RTL design,
            TCAD simulation, or joint research? Connect via GitHub or LinkedIn.
          </p>
        </div>
      </header>

      <div className="container container--narrow">
        <section className={styles.section} aria-labelledby="connect-heading">
          <h2 id="connect-heading" className={styles.h2}>Connect</h2>
          <p className={styles.prose}>
            The best way to reach me is through GitHub or LinkedIn.
            I am open to discussing engineering projects, research directions,
            and academic collaboration.
          </p>

          <div className={styles.cards}>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <span className={styles.cardPlatform}>GitHub</span>
              <span className={styles.cardHandle}>github.com/ALLENJOE-A</span>
              <span className={styles.cardDesc}>
                Source code, project repositories, and engineering work.
              </span>
              <span className={styles.cardCta}>Visit profile ↗</span>
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <span className={styles.cardPlatform}>LinkedIn</span>
              <span className={styles.cardHandle}>allen-joe-a-36069831b</span>
              <span className={styles.cardDesc}>
                Professional background and academic details.
              </span>
              <span className={styles.cardCta}>View profile ↗</span>
            </a>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="collab-heading">
          <h2 id="collab-heading" className={styles.h2}>Areas of Interest</h2>
          <ul className={styles.interestList} role="list">
            {[
              'Semiconductor device simulation and TCAD',
              'Digital RTL design and functional verification',
              'AI and machine learning applied to EDA',
              'Computational lithography research',
              'Hardware accelerator architecture',
              'Embedded systems and microcontroller firmware',
            ].map(item => (
              <li key={item} className={styles.interestItem}>
                <span className={styles.dot} aria-hidden="true"/>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
