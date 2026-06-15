import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useTheme } from '../../context/ThemeContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

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
      </main>
      <BottomNav />
    </div>
  );
}
