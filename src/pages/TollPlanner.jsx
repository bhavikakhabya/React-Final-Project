import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { getRoutesForTrip } from '../utils/mockData';
import styles from './TollPlanner.module.css';

const FROM_CITIES = ['Borivali', 'Goregaon', 'Andheri W', 'Andheri E', 'Powai', 'Thane'];
const TO_CITIES   = ['Churchgate', 'Bandra W', 'Kurla', 'Sion', 'Andheri E'];

export default function TollPlanner() {
  const [from, setFrom]               = useState('Thane');
  const [to, setTo]                   = useState('Churchgate');
  const [routes, setRoutes]           = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searched, setSearched]       = useState(false);

  const handleSearch = () => {
    const computed = getRoutesForTrip(from, to);
    setRoutes(computed);
    setSelectedRoute(null);
    setSearched(true);
  };

  const cheapest = routes.length
    ? routes.reduce((min, r) => r.total < min.total ? r : min, routes[0])
    : null;

  const maxTotal = routes.length ? Math.max(...routes.map(r => r.total)) : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <DollarSign size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Toll Cost Planner
        </h1>
        <p className="page-subtitle">
          Compare routes and find the cheapest path — prices update per origin &amp; destination
        </p>
      </div>

      {/* Route Selector */}
      <div className={`${styles.selectorCard} glass-card`}>
        <div className={styles.selects}>
          <div className="input-wrap">
            <label className="input-label">From</label>
            <select
              className="input-field"
              value={from}
              onChange={e => { setFrom(e.target.value); setSearched(false); }}
            >
              {FROM_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.arrow}>→</div>

          <div className="input-wrap">
            <label className="input-label">To</label>
            <select
              className="input-field"
              value={to}
              onChange={e => { setTo(e.target.value); setSearched(false); }}
            >
              {TO_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <motion.button
            className="btn btn-primary"
            style={{ alignSelf: 'flex-end' }}
            onClick={handleSearch}
            whileTap={{ scale: 0.97 }}
            disabled={from === to}
          >
            Find Routes
          </motion.button>
        </div>
      </div>

      {/* Route Cards */}
      <AnimatePresence mode="wait">
        {searched && routes.length > 0 && (
          <motion.div
            key={`${from}-${to}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={styles.routesGrid}
          >
            {routes.map((route, i) => {
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

                  <div className={styles.routeName} style={{ color: route.color }}>
                    {route.name}
                  </div>

                  {/* Stops visualization */}
                  <div className={styles.stops}>
                    {route.stops.map((stop, j) => (
                      <span key={j} className={styles.stopChip}>{stop}</span>
                    ))}
                  </div>

                  <div className={styles.routeStats}>
                    <div className={styles.statItem}>
                      <span>Distance</span>
                      <strong>{route.distance}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Time</span>
                      <strong>{route.time}</strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Toll</span>
                      <strong style={{ color: route.toll > 0 ? '#e67e22' : '#27ae60' }}>
                        {route.toll > 0 ? `₹${route.toll}` : 'Free'}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <span>Total Fare</span>
                      <strong style={{ fontSize: '1.1rem', color: isCheapest ? '#27ae60' : '#190019' }}>
                        ₹{route.total}
                      </strong>
                    </div>
                  </div>

                  {isCheapest && (
                    <div className={styles.savings}>
                      💰 Saves ₹{maxTotal - route.total} vs most expensive
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
          <p>Select your origin &amp; destination, then click <strong>Find Routes</strong></p>
        </div>
      )}
    </div>
  );
}
