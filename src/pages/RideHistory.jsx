import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, MapPin, User, Calendar, IndianRupee, Navigation } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './RideHistory.module.css';

const FALLBACK_RIDES = [
  { id:'r1', from:'Andheri East', to:'Bandra West',  driver:'Rahul V.', passengers:['You','Aman T.'], fare:120, myShare:40,  date:'2025-06-05', distance:'8.2 km'  },
  { id:'r2', from:'Powai',        to:'Churchgate',    driver:'Neha S.',  passengers:['You'],          fare:220, myShare:110, date:'2025-06-04', distance:'14.5 km' },
  { id:'r3', from:'Kurla',        to:'Andheri West',  driver:'Amit K.',  passengers:['You','Raj M.'], fare:90,  myShare:45,  date:'2025-06-03', distance:'6.1 km'  },
  { id:'r4', from:'Borivali',     to:'Thane',         driver:'Rahul V.', passengers:['You'],          fare:180, myShare:90,  date:'2025-06-02', distance:'18.3 km' },
  { id:'r5', from:'Goregaon',     to:'Powai',         driver:'Pooja P.', passengers:['You','Dev N.'], fare:140, myShare:70,  date:'2025-06-01', distance:'9.7 km'  },
];

/* Inline SVG: simple route line illustration */
const RouteSVG = () => (
  <svg viewBox="0 0 80 36" fill="none" className={styles.routeSvg} aria-hidden="true">
    <circle cx="8"  cy="18" r="5" fill="#9E6752" opacity="0.8"/>
    <circle cx="8"  cy="18" r="2.5" fill="#fff"/>
    <line x1="13" y1="18" x2="67" y2="18" stroke="#9E6752" strokeWidth="1.8" strokeDasharray="4 3" strokeLinecap="round" opacity="0.45"/>
    <circle cx="72" cy="18" r="5" fill="#2D4354" opacity="0.8"/>
    <circle cx="72" cy="18" r="2.5" fill="#fff"/>
    <text x="8"  y="32" textAnchor="middle" fontSize="5" fill="#9E6752" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">From</text>
    <text x="72" y="32" textAnchor="middle" fontSize="5" fill="#2D4354" fontWeight="700" fontFamily="Plus Jakarta Sans,sans-serif">To</text>
  </svg>
);

/* Stats summary banner */
function StatsBanner({ rides }) {
  const totalFare  = rides.reduce((a, r) => a + (r.myShare || 0), 0);
  const totalKm    = rides.reduce((a, r) => a + parseFloat(r.distance || 0), 0);
  const uniqueDrivers = new Set(rides.map(r => r.driver)).size;
  return (
    <div className={styles.statsBanner}>
      {[
        { label: 'Rides', value: rides.length, icon: '🚕' },
        { label: 'Total Spent', value: `₹${totalFare}`, icon: '💰' },
        { label: 'Km Travelled', value: `${totalKm.toFixed(1)} km`, icon: '📍' },
        { label: 'Drivers Used', value: uniqueDrivers, icon: '👤' },
      ].map(s => (
        <div key={s.label} className={styles.statBannerItem}>
          <span className={styles.statBannerEmoji}>{s.icon}</span>
          <div>
            <div className={styles.statBannerVal}>{s.value}</div>
            <div className={styles.statBannerLbl}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RideHistory() {
  const { state, dispatch } = useRide();
  const [search, setSearch] = useState('');
  const [rides, setRides]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = state.rides?.length ? state.rides : FALLBACK_RIDES;
      setRides(data);
      if (!state.rides?.length) dispatch({ type: 'SET_RIDES', payload: FALLBACK_RIDES });
      setLoading(false);
    }, 600);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rides;
    const q = search.toLowerCase();
    return rides.filter(r =>
      r.from.toLowerCase().includes(q) ||
      r.to.toLowerCase().includes(q) ||
      r.driver.toLowerCase().includes(q)
    );
  }, [rides, search]);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_RIDE', payload: id });
    setRides(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><History size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Ride History</h1>
        <p className="page-subtitle">All your past carpool journeys — latest first</p>
      </div>

      {/* Stats Banner */}
      {!loading && <StatsBanner rides={rides} />}

      {/* Search */}
      <div className={styles.searchWrap}>
        <div className="input-icon-wrap" style={{ maxWidth: 420, flex: 1 }}>
          <Search size={17} className="input-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by route or driver…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="history-search"
          />
        </div>
        <span className={styles.count}>{filtered.length} ride{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className={styles.skeletonList}>
          {[1,2,3].map(i => <div key={i} className={`${styles.skeleton} skeleton`} />)}
        </div>
      ) : (
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <p>No rides found for "{search}"</p>
            </motion.div>
          ) : (
            <div className={styles.list}>
              {filtered.map((ride, i) => (
                <motion.div
                  key={ride.id}
                  className={`${styles.rideCard} glass-card`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  layout
                >
                  {/* Top: route */}
                  <div className={styles.rideTop}>
                    <div className={styles.routeLine}>
                      <MapPin size={14} color="#9E6752" />
                      <span className={styles.from}>{ride.from}</span>
                      <Navigation size={13} color="#73766A" style={{ flexShrink: 0 }} />
                      <span className={styles.to}>{ride.to}</span>
                      <span className={styles.dist}>{ride.distance}</span>
                    </div>
                    <RouteSVG />
                  </div>

                  {/* Meta row */}
                  <div className={styles.meta}>
                    <span><User size={12} /> {ride.driver}</span>
                    <span><Calendar size={12} /> {ride.date}</span>
                    <span className={styles.fareChip}><IndianRupee size={12} /> My share: ₹{ride.myShare}</span>
                  </div>

                  {/* Passengers */}
                  <div className={styles.passengerRow}>
                    {ride.passengers.map(p => (
                      <span key={p} className={styles.passengerBadge}>{p}</span>
                    ))}
                    <span className={styles.totalFare}>Total fare: ₹{ride.fare}</span>
                  </div>

                  {/* Delete */}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(ride.id)}
                    title="Delete ride"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
