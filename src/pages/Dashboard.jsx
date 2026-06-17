import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Users, Clock, Wallet, Activity, TrendingUp,
  Star, ArrowRight, Leaf, CheckCircle, XCircle, ChevronDown, MapPin, User2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

/* ── Seed pending requests (stable reference so count is consistent) ── */
const SEED_REQUESTS = [
  { id: 'seed1', name: 'Aman Trivedi',  from: 'Andheri E',  to: 'Churchgate', time: '2 min ago' },
  { id: 'seed2', name: 'Sia Kapoor',    from: 'Goregaon',   to: 'Bandra W',   time: '5 min ago' },
  { id: 'seed3', name: 'Dev Nair',      from: 'Borivali',   to: 'Kurla',      time: '9 min ago' },
];

/* ── Mock active carpools ── */
const ACTIVE_CARPOOLS = [
  { id: 'cp1', route: 'Andheri E → Bandra W',  driver: 'Emily Johnson',   seats: 3, eta: '12 min', status: 'En route'   },
  { id: 'cp2', route: 'Borivali → Churchgate', driver: 'Michael Williams', seats: 2, eta: '28 min', status: 'Picking up' },
  { id: 'cp3', route: 'Powai → Kurla',          driver: 'Sophia Brown',    seats: 4, eta: '6 min',  status: 'En route'   },
  { id: 'cp4', route: 'Goregaon → Sion',        driver: 'James Davis',     seats: 1, eta: '35 min', status: 'Scheduled'  },
  { id: 'cp5', route: 'Thane → Andheri E',      driver: 'Raj Malhotra',    seats: 3, eta: '18 min', status: 'En route'   },
  { id: 'cp6', route: 'Kurla → Churchgate',     driver: 'Maya Joshi',      seats: 2, eta: '22 min', status: 'Picking up' },
  { id: 'cp7', route: 'Andheri W → Bandra W',  driver: 'Dev Nair',        seats: 2, eta: '8 min',  status: 'En route'   },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/* Stat Card — clickable, shows chevron, highlights when active               */
/* ─────────────────────────────────────────────────────────────────────────── */
const StatCard = memo(function StatCard({ icon: Icon, label, value, color, delay, trend, onClick, active }) {
  return (
    <motion.div
      className={`${styles.statCard} ${active ? styles.statCardActive : ''}`}
      style={{ '--accent-color': color, cursor: onClick ? 'pointer' : 'default' }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
    >
      <div className={styles.statTop}>
        <div className={styles.statIconWrap} style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend && <span className={styles.statTrend}>↑ {trend}</span>}
          {onClick && (
            <motion.span
              className={styles.statChevron}
              animate={{ rotate: active ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={14} color={color} />
            </motion.span>
          )}
        </div>
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

/* ─────────────────────────────────────────────────────────────────────────── */
/* Driver Card                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────── */
/* Quick Action Card — all 6 are proper navigable Links                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function ActionCard({ to, label, emoji, color, desc }) {
  return (
    <Link to={to} className={styles.actionCard} id={`action-${label.replace(/\s+/g, '-').toLowerCase()}`}>
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

/* ─────────────────────────────────────────────────────────────────────────── */
/* Pending Requests Panel                                                      */
/* dismissed & allRequests are managed by parent so count stays in sync       */
/* ─────────────────────────────────────────────────────────────────────────── */
function PendingRequestsPanel({ allRequests, onApprove, onReject }) {
  return (
    <motion.div
      className={styles.expandPanel}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.panelInner}>
        <div className={styles.panelHeader}>
          <Clock size={15} color="#9E6752" />
          <h3 className={styles.panelTitle}>Pending Ride Requests</h3>
          <span className={styles.panelCount}>{allRequests.length} pending</span>
        </div>

        <div className={styles.requestList}>
          <AnimatePresence initial={false}>
            {allRequests.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={styles.emptyState}
              >
                ✅ All requests handled!
              </motion.p>
            ) : (
              allRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  className={styles.requestRow}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, scaleY: 0.8 }}
                  transition={{ delay: i * 0.05, duration: 0.28 }}
                  layout
                >
                  <div className={styles.requestAvatar}>
                    {req.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={styles.requestInfo}>
                    <span className={styles.requestName}>{req.name}</span>
                    <span className={styles.requestRoute}>
                      <MapPin size={10} /> {req.from} → {req.to}
                    </span>
                    {req.time && <span className={styles.requestTime}>{req.time}</span>}
                  </div>
                  <div className={styles.requestActions}>
                    <motion.button
                      className={styles.approveBtn}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onApprove(req)}
                    >
                      <CheckCircle size={15} /> Approve
                    </motion.button>
                    <motion.button
                      className={styles.rejectBtn}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onReject(req)}
                      title="Reject"
                    >
                      <XCircle size={15} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <Link to="/queue" className={styles.panelFooterLink}>
          View full queue <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Active Carpools Panel                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function ActiveCarpoolsPanel() {
  const statusColor = { 'En route': '#27ae60', 'Picking up': '#e67e22', 'Scheduled': '#2D4354' };
  return (
    <motion.div
      className={styles.expandPanel}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.panelInner}>
        <div className={styles.panelHeader}>
          <Activity size={15} color="#73766A" />
          <h3 className={styles.panelTitle}>Active Carpools</h3>
          <span className={styles.panelCount} style={{ background: 'rgba(115,118,106,0.12)', color: '#73766A', borderColor: 'rgba(115,118,106,0.2)' }}>
            {ACTIVE_CARPOOLS.length} live
          </span>
        </div>

        <div className={styles.carpoolList}>
          {ACTIVE_CARPOOLS.map((cp, i) => (
            <motion.div
              key={cp.id}
              className={styles.carpoolRow}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.carpoolStatus} style={{ background: `${statusColor[cp.status]}18`, borderColor: `${statusColor[cp.status]}30` }}>
                <span style={{ color: statusColor[cp.status], fontSize: '0.65rem', fontWeight: 700 }}>
                  ● {cp.status}
                </span>
              </div>
              <div className={styles.carpoolInfo}>
                <span className={styles.carpoolRoute}>{cp.route}</span>
                <span className={styles.carpoolMeta}>
                  <User2 size={10} /> {cp.driver} · {cp.seats} seats · ETA {cp.eta}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/queue" className={styles.panelFooterLink}>
          Manage carpools <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Dashboard                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user }       = useAuth();
  const { state, dispatch } = useRide();
  const navigate       = useNavigate();

  const [drivers, setDrivers]               = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [apiError, setApiError]             = useState(false);
  const [currentTime, setCurrentTime]       = useState(new Date());
  const [activePanel, setActivePanel]       = useState(null); // 'requests' | 'carpools' | null

  // ── Dismissed requests state lives HERE so the count badge stays in sync ──
  const [dismissed, setDismissed] = useState([]);

  // Merge real queue + seeds, filter dismissed
  const allRequests = useMemo(() => {
    const realQueue = (state.requestQueue || []).map(q => ({
      ...q,
      id: q.id || (q.name + q.from),
    }));
    return [...realQueue, ...SEED_REQUESTS].filter(r => !dismissed.includes(r.id));
  }, [state.requestQueue, dismissed]);

  // Approve: process real queue item if it's in there, always remove from panel
  const handleApprove = useCallback((req) => {
    const isReal = (state.requestQueue || []).some(
      q => q.id === req.id || q.name === req.name
    );
    if (isReal) dispatch({ type: 'PROCESS_REQUEST' });
    setDismissed(d => [...d, req.id]);
  }, [state.requestQueue, dispatch]);

  const handleReject = useCallback((req) => {
    setDismissed(d => [...d, req.id]);
  }, []);

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
    if (!state.rides?.length) return 395;
    return state.rides.reduce((acc, r) => acc + (r.fare - r.myShare || 0), 0);
  }, [state.rides]);

  const hour        = currentTime.getHours();
  const greeting    = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetEmoji  = hour < 12 ? '🌅' : hour < 17 ? '☀️' : '🌙';
  const todayDate   = currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel);

  /* ── All 6 stat cards — 4 navigate, 2 expand panels ── */
  const STATS = [
    {
      icon: Car, label: 'Total Rides',
      value: state.rides?.length || 5,
      color: '#2D4354', delay: 0.05, trend: '12%',
      onClick: () => navigate('/history'),
    },
    {
      icon: Users, label: 'Available Drivers',
      value: loadingDrivers ? '…' : drivers.length,
      color: '#27ae60', delay: 0.10,
      onClick: () => navigate('/location-finder'),
    },
    {
      icon: Clock, label: 'Pending Requests',
      value: allRequests.length,              // ← live count, always in sync
      color: '#9E6752', delay: 0.15, trend: allRequests.length > 0 ? `${allRequests.length} new` : null,
      onClick: () => togglePanel('requests'),
      active: activePanel === 'requests',
    },
    {
      icon: Wallet, label: 'Money Saved',
      value: `₹${moneySaved}`,
      color: '#534145', delay: 0.20, trend: '₹320',
      onClick: () => navigate('/price-log'),
    },
    {
      icon: Activity, label: 'Active Carpools',
      value: ACTIVE_CARPOOLS.length,
      color: '#73766A', delay: 0.25,
      onClick: () => togglePanel('carpools'),
      active: activePanel === 'carpools',
    },
    {
      icon: TrendingUp, label: 'Reward Points',
      value: state.points || 1240,
      color: '#9E6752', delay: 0.30, trend: '+80',
      onClick: () => navigate('/rewards'),
    },
  ];

  /* ── All 6 quick actions — all link to valid routes ── */
  const ACTIONS = [
    { to: '/queue',          label: 'Request Ride',   emoji: '🚕', color: '#2D4354', desc: 'Find a ride now'   },
    { to: '/location-finder',label: 'Find Passenger', emoji: '📍', color: '#9E6752', desc: "See who's nearby"  },
    { to: '/city-map',       label: 'City Map',       emoji: '🗺️', color: '#534145', desc: 'Explore routes'    },
    { to: '/eco-score',      label: 'Eco Impact',     emoji: '🌱', color: '#27ae60', desc: 'Your CO₂ savings'  },
    { to: '/rewards',        label: 'My Rewards',     emoji: '🏆', color: '#9E6752', desc: 'Redeem points'      },
    { to: '/history',        label: 'Ride History',   emoji: '📋', color: '#2D4354', desc: 'Past journeys'      },
  ];

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

      {/* ── Stats Grid (all 6 clickable) ── */}
      <div className={styles.statsGrid}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Expandable Panels ── */}
      <AnimatePresence mode="wait">
        {activePanel === 'requests' && (
          <PendingRequestsPanel
            key="requests"
            allRequests={allRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        {activePanel === 'carpools' && (
          <ActiveCarpoolsPanel key="carpools" />
        )}
      </AnimatePresence>

      {/* ── Two-column layout ── */}
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
              [1,2,3,4].map(i => <div key={i} className={`${styles.skeletonDriver} skeleton`} />)
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
              { icon: '🚕', text: 'Ride from Andheri → Bandra', sub: '2 hrs ago',  color: '#2D4354' },
              { icon: '🏆', text: '+80 reward points earned',    sub: '5 hrs ago',  color: '#9E6752' },
              { icon: '🌱', text: '2.4 kg CO₂ saved today',     sub: 'Today',      color: '#27ae60' },
              { icon: '💰', text: '₹320 saved this week',       sub: 'This week',  color: '#534145' },
              { icon: '⭐', text: 'Rated driver 5 stars',        sub: 'Yesterday',  color: '#f39c12' },
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

      {/* ── Quick Actions (all 6 navigate to their pages) ── */}
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
