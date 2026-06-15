import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, ListOrdered, Map, Trophy } from 'lucide-react';
import styles from './BottomNav.module.css';

const ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home'    },
  { to: '/history',   icon: History,         label: 'History' },
  { to: '/queue',     icon: ListOrdered,     label: 'Queue'   },
  { to: '/city-map',  icon: Map,             label: 'Map'     },
  { to: '/rewards',   icon: Trophy,          label: 'Rewards' },
];

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {ITEMS.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
        >
          <Icon size={21} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
