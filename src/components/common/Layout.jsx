import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useTheme } from '../../context/ThemeContext';
import styles from './Layout.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

/* ── Minimal SVG car for footer ── */
const CarSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12H3l1-4h12l1 4" stroke="#FED7A5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12v4h2m14 0h2v-4" stroke="#FED7A5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 16h14" stroke="#FED7A5" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="7.5" cy="16.5" r="1.5" fill="#9E6752" />
    <circle cx="16.5" cy="16.5" r="1.5" fill="#9E6752" />
    <path d="M7 8l1-3h8l1 3" stroke="#FED7A5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

const FOOTER_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/history', label: 'Ride History' },
  { to: '/queue', label: 'Ride Queue' },
  { to: '/location-finder', label: 'Location Finder' },
  { to: '/eco-score', label: 'Eco Score' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/profile', label: 'Profile' },
];

export default function Layout() {
  const { sidebarCollapsed } = useTheme();
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />
      <main
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            {/* Brand */}
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <CarSVG />
              </div>
              <div>
                <span className={styles.footerName}>CarpoolFlow</span>
                <span className={styles.footerTagline}>Smart Ride Sharing Platform</span>
              </div>
            </div>

            {/* Nav links */}
            <nav className={styles.footerNav} aria-label="Footer navigation">
              {FOOTER_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${styles.footerLink} ${location.pathname === link.to ? styles.footerLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom row */}
            <div className={styles.footerBottom}>
              <span className={styles.footerCopy}>
                © {new Date().getFullYear()} CarpoolFlow · Built with React.Js
                <br />Semester II Final Project by Bhavika Khabya
              </span>
              <div className={styles.footerEco}>
                {/* Leaf SVG inline */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6 2 3 8 3 12c0 5 4 9 9 9s9-4 9-9c0-7-4-10-9-10z" stroke="#27ae60" strokeWidth="1.8" fill="rgba(39,174,96,0.12)" />
                  <path d="M12 2c0 0-1 8 2 12" stroke="#27ae60" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>Every ride shared saves CO₂</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <BottomNav />
    </div>
  );
}
