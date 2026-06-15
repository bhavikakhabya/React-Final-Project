import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Car, Users, Clock, Wallet, Activity, TrendingUp,
  Star, ArrowRight, Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

/* ── Stat card ── */
const StatCard = memo(function StatCard({ icon: Icon, label, value, color, delay, trend }) {
  return (
    <motion.div
      className={styles.statCard}
      style={{ '--accent-color': color }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className={styles.statTop}>
        <div className={styles.statIconWrap} style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && <span className={styles.statTrend}>↑ {trend}</span>}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statBar} style={{ background: `${color}22` }}>
        <motion.div
          className={styles.statBarFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: '65%' }}
          transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
});

/* ── Driver card ── */
const DriverCard = memo(function DriverCard({ driver, index }) {
  const rating = useMemo(() => (Math.random() * 0.8 + 4.1).toFixed(1), []);
  return (
    <motion.div
      className={styles.driverCard}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.35 }}
      whileHover={{ x: 4 }}
    >
      <div className={styles.driverAvatar}>
        {driver.firstName?.[0]}{driver.lastName?.[0]}
      </div>
      <div className={styles.driverInfo}>
        <span className={styles.driverName}>{driver.firstName} {driver.lastName}</span>
        <span className={styles.driverSub}>{driver.email}</span>
      </div>
      <div className={styles.driverMeta}>
        <div className={styles.driverRating}>
          <Star size={11} fill="#f4d03f" color="#f4d03f" />
          <span>{rating}</span>
        </div>
        <span className={styles.driverOnline}>● Online</span>
      </div>
    </motion.div>
  );
});

/* ── Quick Action card ── */
function ActionCard({ to, label, emoji, color, desc }) {
  return (
    <Link to={to} className={styles.actionCard}>
      <motion.div
        className={styles.actionInner}
        whileHover={{ y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.22 }}
      >
        <div className={styles.actionEmojiBg} style={{ background: `${color}18`, border: `1.5px solid ${color}28` }}>
          <span className={styles.actionEmoji}>{emoji}</span>
        </div>
        <span className={styles.actionLabel} style={{ color }}>{label}</span>
        {desc && <span className={styles.actionDesc}>{desc}</span>}
      </motion.div>
    </Link>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const { user } = useAuth();
  const { state } = useRide();
  const [drivers, setDrivers]           = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [apiError, setApiError]         = useState(false);
  const [currentTime, setCurrentTime]   = useState(new Date());

  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=6&skip=0')
      .then(r => r.json())
      .then(data => { setDrivers(data.users || []); setLoadingDrivers(false); })
      .catch(() => { setApiError(true); setLoadingDrivers(false); });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const moneySaved = useMemo(() => {
    if (!state.rides?.length) return 2840;
    return state.rides.reduce((acc, r) => acc + (r.fare - r.myShare || 0), 0);
  }, [state.rides]);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';

  const STATS = [
    { icon: Car,        label: 'Total Rides',      value: state.rides?.length || 24,          color: '#2D4354', delay: 0.05, trend: '12%' },
    { icon: Users,      label: 'Available Drivers', value: loadingDrivers ? '…' : drivers.length, color: '#27ae60', delay: 0.10 },
    { icon: Clock,      label: 'Pending Requests',  value: state.requestQueue?.length || 3,    color: '#9E6752', delay: 0.15, trend: '2 new' },
    { icon: Wallet,     label: 'Money Saved',       value: `₹${moneySaved}`,                  color: '#534145', delay: 0.20, trend: '₹320' },
    { icon: Activity,   label: 'Active Carpools',   value: 7,                                  color: '#73766A', delay: 0.25 },
    { icon: TrendingUp, label: 'Reward Points',     value: state.points || 1240,               color: '#9E6752', delay: 0.30, trend: '+80' },
  ];

  const ACTIONS = [
    { to: '/queue',          label: 'Request Ride',   emoji: '🚕', color: '#2D4354', desc: 'Find a ride now'     },
    { to: '/location-finder',label: 'Find Passenger', emoji: '📍', color: '#9E6752', desc: 'See who\'s nearby'   },
    { to: '/city-map',       label: 'City Map',       emoji: '🗺️', color: '#534145', desc: 'Explore routes'     },
    { to: '/eco-score',      label: 'Eco Impact',     emoji: '🌱', color: '#27ae60', desc: 'Your CO₂ savings'   },
    { to: '/rewards',        label: 'My Rewards',     emoji: '🏆', color: '#9E6752', desc: 'Redeem points'       },
    { to: '/history',        label: 'Ride History',   emoji: '📋', color: '#2D4354', desc: 'Past journeys'       },
  ];

  const todayDate = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={styles.page}>
      {/* ── Hero Banner ── */}
      <motion.div
        className={styles.heroBanner}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.heroLeft}>
          <div className={styles.heroGreetRow}>
            <span className={styles.heroEmoji}>{greetEmoji}</span>
            <div>
              <h1 className={styles.heroTitle}>{greeting}, {user?.name?.split(' ')[0]}!</h1>
              <p className={styles.heroDate}>{todayDate}</p>
            </div>
          </div>
          <p className={styles.heroSub}>Here's your carpool overview for today</p>
        </div>

        <div className={styles.heroRight}>
          <motion.div className={styles.pointsPill} whileHover={{ scale: 1.06 }}>
            <Star size={15} fill="#f4d03f" color="#f4d03f" />
            <span>{state.points || 1240} pts</span>
          </motion.div>
          <div className={styles.ecoChip}>
            <Leaf size={13} />
            <span>18.2 kg CO₂ saved</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Two column layout ── */}
      <div className={styles.mainGrid}>
        {/* Available Drivers */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <div className={styles.sectionDot} style={{ background: '#27ae60' }} />
              <h2 className={styles.sectionTitle}>Available Drivers</h2>
              <span className={styles.sectionBadge}>{loadingDrivers ? '…' : drivers.length} online</span>
            </div>
            <Link to="/seat-sorter" className={styles.viewAllBtn}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className={styles.driversList}>
            {loadingDrivers ? (
              [1,2,3,4].map(i => (
                <div key={i} className={`${styles.skeletonDriver} skeleton`} />
              ))
            ) : apiError ? (
              <div className={styles.errorState}>⚠️ Could not load drivers</div>
            ) : (
              drivers.map((d, i) => <DriverCard key={d.id} driver={d} index={i} />)
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          className={styles.section}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrap}>
              <div className={styles.sectionDot} style={{ background: '#9E6752' }} />
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
            </div>
          </div>

          <div className={styles.activityFeed}>
            {[
              { icon: '🚕', text: 'Ride from Andheri → Bandra', sub: '2 hrs ago', color: '#2D4354' },
              { icon: '🏆', text: '+80 reward points earned', sub: '5 hrs ago', color: '#9E6752' },
              { icon: '🌱', text: '2.4 kg CO₂ saved today', sub: 'Today', color: '#27ae60' },
              { icon: '💰', text: '₹320 saved this week', sub: 'This week', color: '#534145' },
              { icon: '⭐', text: 'Rated driver 5 stars', sub: 'Yesterday', color: '#f39c12' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={styles.activityItem}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
              >
                <div className={styles.activityIcon}
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div className={styles.activityText}>
                  <span className={styles.activityMain}>{item.text}</span>
                  <span className={styles.activitySub}>{item.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        className={styles.actionsSection}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className={styles.sectionHeader} style={{ marginBottom: 16 }}>
          <div className={styles.sectionTitleWrap}>
            <div className={styles.sectionDot} style={{ background: '#9E6752' }} />
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
        </div>
        <div className={styles.actionsGrid}>
          {ACTIONS.map(a => <ActionCard key={a.to} {...a} />)}
        </div>
      </motion.div>
    </div>
  );
}
