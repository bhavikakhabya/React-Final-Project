import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, CheckCircle } from 'lucide-react';
import { TOLL_ROUTES } from '../utils/mockData';
import styles from './TollPlanner.module.css';

export default function TollPlanner() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [from, setFrom] = useState('Thane');
  const [to, setTo] = useState('Churchgate');
  const [searched, setSearched] = useState(false);

  const cheapest = searched
    ? TOLL_ROUTES.reduce((min, r) => r.total < min.total ? r : min, TOLL_ROUTES[0])
    : null;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><DollarSign size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Toll Cost Planner</h1>
        <p className="page-subtitle">Compare routes and find the cheapest path — route cost analysis with useState</p>
      </div>

      {/* Route Selector */}
      <div className={`${styles.selectorCard} glass-card`}>
        <div className={styles.selects}>
          <div className="input-wrap">
            <label className="input-label">From</label>
            <select className="input-field" value={from} onChange={e => { setFrom(e.target.value); setSearched(false); }}>
              {['Borivali','Goregaon','Andheri W','Andheri E','Powai','Thane'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.arrow}>→</div>
          <div className="input-wrap">
            <label className="input-label">To</label>
            <select className="input-field" value={to} onChange={e => { setTo(e.target.value); setSearched(false); }}>
              {['Churchgate','Bandra W','Kurla','Sion','Andheri E'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <motion.button
            className="btn btn-primary"
            style={{ alignSelf: 'flex-end' }}
            onClick={() => { setSearched(true); setSelectedRoute(null); }}
            whileTap={{ scale: 0.97 }}
          >
            Find Routes
          </motion.button>
        </div>
      </div>

      {/* Route Cards */}
      <AnimatePresence mode="wait">
        {searched && (
          <motion.div
            key="routes"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={styles.routesGrid}
          >
            {TOLL_ROUTES.map((route, i) => {
              const isCheapest = route.id === cheapest?.id;
              const isSelected = selectedRoute?.id === route.id;
              return (
                <motion.div
                  key={route.id}
                  className={`${styles.routeCard} glass-card ${isSelected ? styles.routeSelected : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedRoute(isSelected ? null : route)}
                  whileHover={{ scale: 1.02, y: -3 }}
                >
                  {isCheapest && <div className={styles.cheapestBadge}>⚡ Cheapest</div>}
                  <div className={styles.routeName} style={{ color: route.color }}>{route.name}</div>

                  {/* Stops visualization */}
                  <div className={styles.stops}>
                    {route.stops.map((stop, j) => (
                      <span key={j} className={styles.stopChip}>{stop}</span>
                    ))}
                  </div>

                  <div className={styles.routeStats}>
                    <div className={styles.statItem}><span>Distance</span><strong>{route.distance}</strong></div>
                    <div className={styles.statItem}><span>Time</span><strong>{route.time}</strong></div>
                    <div className={styles.statItem}><span>Toll</span><strong style={{ color: route.toll > 0 ? '#e67e22' : '#27ae60' }}>₹{route.toll}</strong></div>
                    <div className={styles.statItem}><span>Total Fare</span><strong style={{ fontSize: '1.1rem', color: isCheapest ? '#27ae60' : '#190019' }}>₹{route.total}</strong></div>
                  </div>

                  {isCheapest && (
                    <div className={styles.savings}>
                      💰 Saves ₹{Math.max(...TOLL_ROUTES.map(r => r.total)) - route.total} vs most expensive
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!searched && (
        <div className={styles.placeholder}>
          <DollarSign size={40} color="#DFB6B2" />
          <p>Select your origin & destination, then click <strong>Find Routes</strong></p>
        </div>
      )}
    </div>
  );
}
