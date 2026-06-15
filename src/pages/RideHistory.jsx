import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, MapPin, User, Calendar, IndianRupee } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './RideHistory.module.css';

const FALLBACK_RIDES = [
  { id:'r1', from:'Andheri East', to:'Bandra West',  driver:'Rahul V.', passengers:['You','Aman T.'], fare:120, myShare:40,  date:'2025-06-05', distance:'8.2 km'  },
  { id:'r2', from:'Powai',        to:'Churchgate',    driver:'Neha S.',  passengers:['You'],          fare:220, myShare:110, date:'2025-06-04', distance:'14.5 km' },
  { id:'r3', from:'Kurla',        to:'Andheri West',  driver:'Amit K.',  passengers:['You','Raj M.'], fare:90,  myShare:45,  date:'2025-06-03', distance:'6.1 km'  },
  { id:'r4', from:'Borivali',     to:'Thane',         driver:'Rahul V.', passengers:['You'],          fare:180, myShare:90,  date:'2025-06-02', distance:'18.3 km' },
  { id:'r5', from:'Goregaon',     to:'Powai',         driver:'Pooja P.', passengers:['You','Dev N.'], fare:140, myShare:70,  date:'2025-06-01', distance:'9.7 km'  },
];

export default function RideHistory() {
  const { state, dispatch } = useRide();
  const [search, setSearch] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect: load from context or fallback
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = state.rides?.length ? state.rides : FALLBACK_RIDES;
      setRides(data);
      if (!state.rides?.length) dispatch({ type: 'SET_RIDES', payload: FALLBACK_RIDES });
      setLoading(false);
    }, 600);
  }, []);

  // useMemo: filtered rides based on search
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
        <h1 className="page-title"><History size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />Ride History</h1>
        <p className="page-subtitle">All your past carpool rides (stored as a Stack — latest first)</p>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <div className="input-icon-wrap" style={{ maxWidth: 400 }}>
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
              🔍 No rides found for "{search}"
            </motion.div>
          ) : (
            <div className={styles.list}>
              {filtered.map((ride, i) => (
                <motion.div
                  key={ride.id}
                  className={`${styles.rideCard} glass-card`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  layout
                >
                  <div className={styles.routeLine}>
                    <MapPin size={15} color="#522B5B" />
                    <span className={styles.from}>{ride.from}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.to}>{ride.to}</span>
                    <span className={styles.dist}>{ride.distance}</span>
                  </div>
                  <div className={styles.meta}>
                    <span><User size={13} /> {ride.driver}</span>
                    <span><Calendar size={13} /> {ride.date}</span>
                    <span><IndianRupee size={13} /> My share: ₹{ride.myShare}</span>
                  </div>
                  <div className={styles.passengers}>
                    {ride.passengers.map(p => (
                      <span key={p} className="badge badge-purple">{p}</span>
                    ))}
                  </div>
                  <button
                    className={`btn btn-ghost btn-sm ${styles.deleteBtn}`}
                    onClick={() => handleDelete(ride.id)}
                    title="Delete ride"
                  >
                    <Trash2 size={15} />
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
