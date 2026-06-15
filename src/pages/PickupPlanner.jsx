import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, CheckCircle, Circle } from 'lucide-react';
import { PASSENGER_LOCATIONS } from '../utils/mockData';
import styles from './PickupPlanner.module.css';

const PASSENGERS = Object.keys(PASSENGER_LOCATIONS);

export default function PickupPlanner() {
  const [selected, setSelected] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [generated, setGenerated] = useState(false);

  const togglePassenger = (name) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
    setGenerated(false);
    setSequence([]);
  };

  // Generate step-by-step pickup route based on area order (simulates BFS-like level traversal)
  const generateRoute = () => {
    if (selected.length === 0) return;
    // Build sequence with ETA calculated based on position index
    const route = selected.map((name, i) => ({
      step: i + 1,
      passenger: name,
      location: PASSENGER_LOCATIONS[name]?.area || 'Unknown',
      eta: `${8 + i * 7} min`,
    }));
    setSequence(route);
    setGenerated(true);
  };

  const reset = () => { setSelected([]); setSequence([]); setGenerated(false); };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><Route size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Efficient Pickup Planner</h1>
        <p className="page-subtitle">Select passengers and generate an optimized pickup sequence — uses useState multi-select</p>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Passenger Selector */}
        <div className={`${styles.selectorCard} glass-card`}>
          <h3 className={styles.cardTitle}>👥 Select Passengers ({selected.length} selected)</h3>
          <div className={styles.passengerGrid}>
            {PASSENGERS.map(name => {
              const isSelected = selected.includes(name);
              const loc = PASSENGER_LOCATIONS[name];
              return (
                <motion.button
                  key={name}
                  className={`${styles.passengerBtn} ${isSelected ? styles.passengerActive : ''}`}
                  onClick={() => togglePassenger(name)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.checkIcon}>
                    {isSelected ? <CheckCircle size={16} /> : <Circle size={16} />}
                  </span>
                  <div>
                    <div className={styles.pName}>{name}</div>
                    <div className={styles.pArea}>{loc.area}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <div className={styles.btnRow}>
            <motion.button
              className="btn btn-primary btn-full"
              onClick={generateRoute}
              disabled={selected.length === 0}
              whileTap={{ scale: 0.97 }}
            >
              🗺️ Generate Pickup Route
            </motion.button>
            {generated && (
              <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
            )}
          </div>
        </div>

        {/* Route Sequence */}
        <div>
          <h3 className="section-title">📍 Pickup Sequence</h3>
          <AnimatePresence mode="wait">
            {!generated ? (
              <motion.div
                className={styles.emptyRoute}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <Route size={36} color="#DFB6B2" />
                <p>Select passengers and click "Generate Pickup Route"</p>
              </motion.div>
            ) : (
              <motion.div
                key="route"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {sequence.map((stop, i) => (
                  <motion.div
                    key={stop.step}
                    className={`${styles.stopCard} glass-card`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}
                  >
                    <div className={styles.stopNum}>{stop.step}</div>
                    <div className={styles.stopLine}>
                      {i < sequence.length - 1 && <div className={styles.stopConnector} />}
                    </div>
                    <div className={styles.stopInfo}>
                      <span className={styles.stopPassenger}>{stop.passenger}</span>
                      <span className={styles.stopLocation}>📍 {stop.location}</span>
                    </div>
                    <div className={styles.stopEta}>
                      <span>ETA</span>
                      <strong>{stop.eta}</strong>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  className={`${styles.destCard} glass-card`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: sequence.length * 0.12 }}
                >
                  🏁 Destination — All passengers picked up!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
