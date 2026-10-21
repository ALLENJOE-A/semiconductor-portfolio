import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/about',    label: 'About'    },
  { href: '/contact',  label: 'Contact'  },
];

export function Navigation() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <nav className={styles.nav} aria-label="Main navigation">
        <Link to="/" className={styles.logo} aria-label="Home — Allen Joe A">
          <span className={styles.logoMark}>AJA</span>
          <span className={styles.logoSub}>VLSI &amp; Semiconductor</span>
        </Link>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                to={href}
                className={`${styles.link} ${location.pathname === href ? styles.active : ''}`}
                aria-current={location.pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* External CTAs: Resume & GitHub */}
        <div className={styles.ctaGroup}>
          <a
            href="/resume.pdf"
            download="Allen_Joe_A_VLSI_Resume.pdf"
            className={styles.resumeBtn}
            aria-label="Download Resume (PDF)"
          >
            Resume ⤓
          </a>
          <a
            href="https://github.com/ALLENJOE-A"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
            aria-label="GitHub profile (opens in new tab)"
          >
            GitHub ↗
          </a>
          <div className={styles.mobileCtas}>
          <a
            href="/resume.pdf"
            download="Allen_Joe_A_VLSI_Resume.pdf"
            className={styles.mobileResumeBtn}
            tabIndex={menuOpen ? 0 : -1}
          >
            Download Resume ⤓
          </a>
          <a
            href="https://github.com/ALLENJOE-A"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileGithubBtn}
            tabIndex={menuOpen ? 0 : -1}
          >
            GitHub Profile ↗
          </a>
        </div>
      </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.menuToggle} ${menuOpen ? styles.menuOpen : ''}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                to={href}
                className={`${styles.mobileLink} ${location.pathname === href ? styles.active : ''}`}
                tabIndex={menuOpen ? 0 : -1}
                aria-current={location.pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/ALLENJOE-A"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileLink}
              tabIndex={menuOpen ? 0 : -1}
            >
              GitHub ↗
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/allen-joe-a-36069831b/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileLink}
              tabIndex={menuOpen ? 0 : -1}
            >
              LinkedIn ↗
            </a>
          </li>
        </ul>
        <div className={styles.mobileCtas}>
          <a
            href="/resume.pdf"
            download="Allen_Joe_A_VLSI_Resume.pdf"
            className={styles.mobileResumeBtn}
            tabIndex={menuOpen ? 0 : -1}
          >
            Download Resume ⤓
          </a>
          <a
            href="https://github.com/ALLENJOE-A"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileGithubBtn}
            tabIndex={menuOpen ? 0 : -1}
          >
            GitHub Profile ↗
          </a>
        </div>
      </div>
    </header>
  );
}
