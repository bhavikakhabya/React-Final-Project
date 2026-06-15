import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Fuel, Car } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './EcoScore.module.css';

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(interval); }
      else setValue(Math.round(start * 10) / 10);
    }, 40);
    return () => clearInterval(interval);
  }, [target]);
  return <span>{prefix}{value}{suffix}</span>;
}

export default function EcoScore() {
  const { state } = useRide();

  // useMemo: compute eco stats from ride count
  const ecoStats = useMemo(() => {
    const totalRides = (state.rides?.length || 0) + 24; // include demo count
    const co2Saved   = +(totalRides * 2.4).toFixed(1);   // ~2.4 kg per shared ride
    const fuelSaved  = +(totalRides * 0.9).toFixed(1);   // ~0.9 L per ride
    const carsOff    = Math.floor(totalRides / 3);       // avg 3 rides → 1 car off road
    const treesEq    = +(co2Saved / 21).toFixed(1);      // 1 tree absorbs ~21 kg CO2/yr
    return { totalRides, co2Saved, fuelSaved, carsOff, treesEq };
  }, [state.rides]);

  const STATS = [
    { icon: Leaf,  label: 'CO₂ Saved',         value: ecoStats.co2Saved,  suffix: ' kg',  color: '#27ae60', bg: 'rgba(39,174,96,0.12)',  desc: 'Less carbon emitted' },
    { icon: Fuel,  label: 'Fuel Saved',         value: ecoStats.fuelSaved, suffix: ' L',   color: '#e67e22', bg: 'rgba(230,126,34,0.12)', desc: 'Less fuel consumed' },
    { icon: Car,   label: 'Cars Off Road',       value: ecoStats.carsOff,   suffix: '',     color: '#8e44ad', bg: 'rgba(142,68,173,0.12)', desc: 'Equivalent reduction' },
    { icon: Wind,  label: 'Trees Equivalent',   value: ecoStats.treesEq,   suffix: ' 🌳',  color: '#16a085', bg: 'rgba(22,160,133,0.12)', desc: 'Annual absorption eq.' },
  ];

  // Weekly eco trend (mock data)
  const WEEKLY = [
    { day: 'Mon', co2: 2.4 }, { day: 'Tue', co2: 4.8 }, { day: 'Wed', co2: 1.2 },
    { day: 'Thu', co2: 6.0 }, { day: 'Fri', co2: 4.8 }, { day: 'Sat', co2: 2.4 }, { day: 'Sun', co2: 0 },
  ];
  const maxCo2 = Math.max(...WEEKLY.map(w => w.co2));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><Leaf size={24} style={{ verticalAlign:'middle', marginRight:8 }} />🌱 Eco Score</h1>
        <p className="page-subtitle">Your environmental impact from carpooling — calculated with useMemo</p>
      </div>

      {/* Hero Score */}
      <motion.div
        className={`${styles.heroCard} glass-card`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.heroLeft}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNum}>A+</span>
            <span className={styles.scoreLabel}>Eco Grade</span>
          </div>
        </div>
        <div className={styles.heroRight}>
          <h2 className={styles.heroTitle}>Great work, Eco Warrior! 🌍</h2>
          <p className={styles.heroDesc}>
            You've completed <strong>{ecoStats.totalRides} carpool rides</strong>, saving the environment significantly.
            Keep carpooling to reach Platinum Eco status!
          </p>
          <div className={styles.progressWrap}>
            <span className={styles.progressLabel}>Progress to Platinum Eco</span>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 1, delay: 0.3, ease: [0.4,0,0.2,1] }}
              />
            </div>
            <span className={styles.progressPct}>68%</span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            className={`${styles.statCard} glass-card`}
            style={{ borderTop: `3px solid ${s.color}` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            whileHover={{ scale: 1.04, y: -4 }}
          >
            <div className={styles.statIcon} style={{ background: s.bg }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div className={styles.statValue} style={{ color: s.color }}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statDesc}>{s.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <motion.div
        className={`${styles.chartCard} glass-card`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        <h3 className="section-title">📈 Weekly CO₂ Savings (kg)</h3>
        <div className={styles.barChart}>
          {WEEKLY.map((w, i) => (
            <div key={w.day} className={styles.barGroup}>
              <motion.div
                className={styles.bar}
                initial={{ height: 0 }}
                animate={{ height: `${(w.co2 / maxCo2) * 100}%` }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.4,0,0.2,1] }}
                title={`${w.co2} kg`}
              />
              <span className={styles.barLabel}>{w.day}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
