import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, History, ListOrdered, MapPin, SlidersHorizontal,
  Map, DollarSign, Leaf, Trophy, User, LogOut, Car, ChevronLeft, ChevronRight,
  Navigation, BadgeDollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard,  label: 'Dashboard'       },
  { to: '/history',        icon: History,           label: 'Ride History'    },
  { to: '/price-log',      icon: DollarSign,        label: 'Price Log'       },
  { to: '/queue',          icon: ListOrdered,       label: 'Ride Queue'      },
  { to: '/location-finder',icon: MapPin,            label: 'Location Finder' },
  { to: '/seat-sorter',    icon: SlidersHorizontal, label: 'Seat Sorter'     },
  { to: '/city-map',       icon: Map,               label: 'City Map'        },
  { to: '/pickup-planner', icon: Navigation,        label: 'Pickup Planner'  },
  { to: '/toll-planner',   icon: BadgeDollarSign,   label: 'Toll Planner'    },
  { to: '/eco-score',      icon: Leaf,              label: 'Eco Score'       },
  { to: '/rewards',        icon: Trophy,            label: 'Rewards'         },
  { to: '/profile',        icon: User,              label: 'Profile'         },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.sidebarWrapper}>
      <motion.aside
        className={styles.sidebar}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Car size={22} /></div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                className={styles.logoText}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                CarpoolFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              title={sidebarCollapsed ? label : ''}
            >
              <span className={styles.navIcon}><Icon size={19} /></span>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    className={styles.navLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>{user?.avatar || 'U'}</div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                className={styles.userInfo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.userRole}>{user?.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </motion.aside>

      {/* Toggle button outside aside so it's never clipped */}
      <motion.button
        className={styles.toggleBtn}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        animate={{ left: sidebarCollapsed ? 58 : 246 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </motion.button>
    </div>
  );
}
