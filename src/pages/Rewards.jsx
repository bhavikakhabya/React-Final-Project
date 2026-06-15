import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { useRide } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';
import { BADGES_CONFIG } from '../utils/mockData';
import styles from './Rewards.module.css';

const LEVELS = [
  { name: 'Bronze',   min: 0,    max: 499,  color: '#cd7f32', bg: 'rgba(205,127,50,0.12)',  icon: '🥉', perks: ['Basic ride matching', 'Standard support'] },
  { name: 'Silver',   min: 500,  max: 999,  color: '#aaa9a9', bg: 'rgba(170,170,170,0.12)', icon: '🥈', perks: ['Priority matching', '5% fare discount', 'Email support'] },
  { name: 'Gold',     min: 1000, max: 2499, color: '#f4d03f', bg: 'rgba(244,208,63,0.12)',  icon: '🥇', perks: ['VIP matching', '10% fare discount', 'Priority support', 'Monthly badge'] },
  { name: 'Platinum', min: 2500, max: Infinity, color: '#85c1e9', bg: 'rgba(133,193,233,0.12)', icon: '💎', perks: ['Elite matching', '20% fare discount', '24/7 support', 'Exclusive events'] },
];

export default function Rewards() {
  const { state } = useRide();
  const { user } = useAuth();
  const points = state.points || 1240;

  // useMemo: compute current level from points
  const currentLevel = useMemo(() => {
    return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
  }, [points]);

  const nextLevel = useMemo(() => {
    const idx = LEVELS.findIndex(l => l.name === currentLevel.name);
    return LEVELS[idx + 1] || null;
  }, [currentLevel]);

  const progress = nextLevel
    ? Math.round(((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><Trophy size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Carpool Rewards</h1>
        <p className="page-subtitle">Your points, badges & level — stored in LocalStorage via RideContext</p>
      </div>

      {/* Points & Level Card */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        <motion.div
          className={`${styles.levelCard} glass-card`}
          style={{ borderTop: `4px solid ${currentLevel.color}` }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.levelIcon}>{currentLevel.icon}</div>
          <div className={styles.levelName} style={{ color: currentLevel.color }}>{currentLevel.name}</div>
          <div className={styles.points}><Star size={18} fill="#f4d03f" color="#f4d03f" /> {points} pts</div>

          {nextLevel && (
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                {nextLevel.min - points} pts to {nextLevel.icon} {nextLevel.name}
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  style={{ background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: [0.4,0,0.2,1] }}
                />
              </div>
              <span className={styles.progressPct}>{progress}%</span>
            </div>
          )}

          <div className={styles.perks}>
            <div className={styles.perksTitle}>Your Perks:</div>
            {currentLevel.perks.map(p => (
              <div key={p} className={styles.perkItem}>✓ {p}</div>
            ))}
          </div>
        </motion.div>

        {/* Level Ladder */}
        <div className={styles.ladder}>
          <h3 className="section-title"><Award size={15} /> Level Ladder</h3>
          {LEVELS.map((lvl, i) => (
            <motion.div
              key={lvl.name}
              className={`${styles.ladderItem} glass-card ${lvl.name === currentLevel.name ? styles.currentLvl : ''}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className={styles.ladderIcon}>{lvl.icon}</span>
              <div className={styles.ladderInfo}>
                <span className={styles.ladderName} style={{ color: lvl.color }}>{lvl.name}</span>
                <span className={styles.ladderRange}>{lvl.min}–{lvl.max === Infinity ? '∞' : lvl.max} pts</span>
              </div>
              {lvl.name === currentLevel.name && (
                <span className={styles.currentTag}>CURRENT</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <h3 className="section-title"><Award size={15} /> Badges</h3>
      <div className={styles.badgesGrid}>
        {BADGES_CONFIG.map((badge, i) => (
          <motion.div
            key={badge.id}
            className={`${styles.badgeCard} glass-card ${!badge.earned ? styles.locked : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: badge.earned ? 1.05 : 1 }}
          >
            <div className={styles.badgeEmoji} style={{ opacity: badge.earned ? 1 : 0.3 }}>
              {badge.icon}
            </div>
            <div className={styles.badgeLabel}>{badge.label}</div>
            <div className={styles.badgeDesc}>{badge.desc}</div>
            {!badge.earned && <div className={styles.lockOverlay}>🔒</div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
