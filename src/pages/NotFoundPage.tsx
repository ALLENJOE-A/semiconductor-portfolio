import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.desc}>
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primary}>Return Home</Link>
          <Link to="/projects" className={styles.secondary}>View Projects</Link>
        </div>
      </div>
    </div>
  );
}
