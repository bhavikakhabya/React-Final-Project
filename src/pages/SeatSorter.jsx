import { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, Car, Star } from 'lucide-react';
import styles from './SeatSorter.module.css';

// React.memo: driver card only re-renders if props change
const DriverCard = memo(function DriverCard({ driver, index, rank }) {
  const seatsColor = driver.availableSeats >= 4 ? '#27ae60' : driver.availableSeats >= 2 ? '#e67e22' : '#e74c3c';
  return (
    <motion.div
      className={`${styles.card} glass-card`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.4,0,0.2,1] }}
      whileHover={{ scale: 1.03, y: -4 }}
      layout
    >
      <div className={styles.rank}>#{rank}</div>
      <div className={styles.avatar}>
        {driver.firstName?.[0]}{driver.lastName?.[0]}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{driver.firstName} {driver.lastName}</span>
        <span className={styles.vehicle}><Car size={13} /> {driver.company?.name || 'Private Vehicle'}</span>
        <div className={styles.meta}>
          <span className={styles.rating}><Star size={12} fill="#f4d03f" color="#f4d03f" /> {driver.rating?.toFixed(1) || (Math.random()*0.8+4.1).toFixed(1)}</span>
        </div>
      </div>
      <div className={styles.seats} style={{ color: seatsColor }}>
        <span className={styles.seatsNum}>{driver.availableSeats}</span>
        <span className={styles.seatsLabel}>seats</span>
      </div>
    </motion.div>
  );
});

export default function SeatSorter() {
  const [rawDrivers, setRawDrivers] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // useEffect: fetch users from DummyJSON as drivers
  useEffect(() => {
    setLoading(true);
    fetch('https://dummyjson.com/users?limit=12')
      .then(r => r.json())
      .then(data => {
        const drivers = (data.users || []).map(u => ({
          ...u,
          availableSeats: Math.floor(Math.random() * 6) + 1,
          rating: +(Math.random() * 0.8 + 4.1).toFixed(1),
        }));
        setRawDrivers(drivers);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // useMemo: sort list only when rawDrivers or sortOrder changes
  const sorted = useMemo(() => {
    return [...rawDrivers].sort((a, b) =>
      sortOrder === 'asc'
        ? a.availableSeats - b.availableSeats
        : b.availableSeats - a.availableSeats
    );
  }, [rawDrivers, sortOrder]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><SlidersHorizontal size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Available Seat Sorter</h1>
        <p className="page-subtitle">Sort drivers by available seats using Array.sort() + useMemo • Data from DummyJSON API</p>
      </div>

      <div className={styles.controls}>
        <span className={styles.label}>Sort by seats:</span>
        <div className={styles.toggleGroup}>
          {(['desc', 'asc']).map(order => (
            <motion.button
              key={order}
              className={`btn btn-sm ${sortOrder === order ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSortOrder(order)}
              whileTap={{ scale: 0.96 }}
            >
              <ArrowUpDown size={14} />
              {order === 'desc' ? 'Most Seats First' : 'Fewest Seats First'}
            </motion.button>
          ))}
        </div>
        {!loading && <span className={styles.count}>{sorted.length} drivers</span>}
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1,2,3,4,5,6].map(i => <div key={i} className={`${styles.skel} skeleton`} />)}
        </div>
      ) : error ? (
        <div className={styles.errorBox}>⚠️ Could not fetch drivers. Check your connection.</div>
      ) : (
        <motion.div className={styles.grid} layout>
          {sorted.map((d, i) => (
            <DriverCard key={d.id} driver={d} index={i} rank={i + 1} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
