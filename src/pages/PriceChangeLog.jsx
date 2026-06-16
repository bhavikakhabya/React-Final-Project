import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './PriceChangeLog.module.css';

/* ── Inline SVG illustrations ─────────────────────────── */
const PriceSVG = () => (
  <svg viewBox="0 0 120 90" fill="none" className={styles.heroSvg}>
    <circle cx="60" cy="45" r="38" fill="rgba(158,103,82,0.10)" />
    <circle cx="60" cy="45" r="26" fill="rgba(158,103,82,0.16)" />
    <text x="60" y="53" textAnchor="middle" fontSize="22" fontWeight="800" fill="#9E6752" fontFamily="Plus Jakarta Sans,sans-serif">₹</text>
    {/* tick marks around circle */}
    {[0,60,120,180,240,300].map((deg, i) => {
      const rad = (deg - 90) * Math.PI / 180;
      const x1 = 60 + 34 * Math.cos(rad), y1 = 45 + 34 * Math.sin(rad);
      const x2 = 60 + 29 * Math.cos(rad), y2 = 45 + 29 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9E6752" strokeWidth="2" strokeLinecap="round" opacity="0.5" />;
    })}
    {/* small arrow up */}
    <path d="M78 30 L84 22 L90 30" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="84" y1="22" x2="84" y2="36" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const StackSVG = () => (
  <svg viewBox="0 0 56 56" fill="none" className={styles.stackSvg}>
    <rect x="4"  y="36" width="48" height="12" rx="4" fill="rgba(45,67,84,0.12)" stroke="rgba(45,67,84,0.25)" strokeWidth="1.5"/>
    <rect x="8"  y="24" width="40" height="12" rx="4" fill="rgba(45,67,84,0.18)" stroke="rgba(45,67,84,0.3)"  strokeWidth="1.5"/>
    <rect x="12" y="12" width="32" height="12" rx="4" fill="rgba(45,67,84,0.28)" stroke="rgba(45,67,84,0.45)" strokeWidth="1.5"/>
  </svg>
);

export default function PriceChangeLog() {
  const { state, dispatch } = useRide();
  const [newPrice, setNewPrice]   = useState('');
  const [inputError, setInputError] = useState('');

  /* ── FIX: compare numbers strictly; don't block on equal price ── */
  const handleSetPrice = () => {
    const trimmed = newPrice.trim();
    if (!trimmed) { setInputError('Enter a price first'); return; }
    const val = parseFloat(trimmed);
    if (isNaN(val) || val <= 0) { setInputError('Enter a valid positive price'); return; }
    setInputError('');
    dispatch({ type: 'SET_PRICE', payload: val });
    setNewPrice('');
  };

  const handleUndo = () => {
    if (state.priceHistory.length < 2) return;
    dispatch({ type: 'UNDO_PRICE' });
  };

  const prevPrice = state.priceHistory[1];
  const delta = prevPrice !== undefined ? state.currentPrice - prevPrice : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💰 Price Change Log</h1>
        <p className="page-subtitle">Track ride fare changes with full undo history — powered by useReducer</p>
      </div>

      <div className={styles.layout}>
        {/* ── Left: Current Price Card ── */}
        <div className={styles.leftCol}>
          {/* Hero card */}
          <motion.div className={`${styles.priceCard} glass-card`} layout>
            <div className={styles.priceCardTop}>
              <div>
                <div className={styles.priceLabel}>Current Ride Price</div>
                <div className={styles.priceRow}>
                  <motion.div
                    className={styles.priceValue}
                    key={state.currentPrice}
                    initial={{ scale: 0.75, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    ₹{state.currentPrice}
                  </motion.div>
                  {delta !== 0 && (
                    <motion.span
                      className={`${styles.deltaBadge} ${delta > 0 ? styles.deltaUp : styles.deltaDown}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {delta > 0 ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
                      {delta > 0 ? '+' : ''}{delta.toFixed(0)}
                    </motion.span>
                  )}
                </div>
                <div className={styles.priceSubtext}>
                  {state.priceHistory.length} record{state.priceHistory.length !== 1 ? 's' : ''} in stack
                </div>
              </div>
              <PriceSVG />
            </div>

            {/* Set new price */}
            <div className={styles.inputSection}>
              <label className={styles.inputLabel} htmlFor="price-input">Set New Price</label>
              <div className={styles.inputRow}>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>₹</span>
                  <input
                    type="number"
                    id="price-input"
                    className={`${styles.priceInput} ${inputError ? styles.priceInputError : ''}`}
                    placeholder="e.g. 150"
                    value={newPrice}
                    min="1"
                    onChange={e => { setNewPrice(e.target.value); setInputError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSetPrice()}
                  />
                </div>
                <motion.button
                  className={styles.setBtn}
                  onClick={handleSetPrice}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Plus size={17} /> Set Price
                </motion.button>
              </div>
              <AnimatePresence>
                {inputError && (
                  <motion.span
                    className={styles.errorMsg}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ⚠️ {inputError}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Undo */}
            <motion.button
              className={styles.undoBtn}
              onClick={handleUndo}
              disabled={state.priceHistory.length < 2}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={15} />
              Undo Last Change
              {state.priceHistory.length >= 2 && prevPrice !== undefined && (
                <span className={styles.undoHint}>→ ₹{prevPrice}</span>
              )}
            </motion.button>
          </motion.div>

          {/* Info card */}
          <div className={`${styles.infoCard} glass-card`}>
            <StackSVG />
            <div className={styles.infoText}>
              <strong>Stack data structure</strong>
              <p>Each price push adds to the top. Undo pops the latest entry and restores the previous price.</p>
            </div>
          </div>
        </div>

        {/* ── Right: Price Timeline ── */}
        <div className={styles.rightCol}>
          <div className={`${styles.timelineCard} glass-card`}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineTitleRow}>
                <Clock size={16} />
                <h3 className={styles.timelineTitle}>Price Stack Timeline</h3>
              </div>
              <span className={styles.timelineBadge}>{state.priceHistory.length} entries</span>
            </div>

            <AnimatePresence mode="popLayout">
              {state.priceHistory.length === 0 ? (
                <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span style={{ fontSize: '2.2rem' }}>📭</span>
                  <p>Stack is empty. Set a price to begin.</p>
                </motion.div>
              ) : (
                state.priceHistory.map((price, i) => {
                  const isTop  = i === 0;
                  const isLast = i === state.priceHistory.length - 1;
                  return (
                    <motion.div
                      key={`${price}-${i}`}
                      className={`${styles.timelineItem} ${isTop ? styles.timelineItemTop : ''}`}
                      initial={{ opacity: 0, x: 24, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -24, height: 0 }}
                      transition={{ duration: 0.28 }}
                      layout
                    >
                      {/* Connector line */}
                      {!isLast && <div className={styles.connector} />}

                      <div className={`${styles.stackDot} ${isTop ? styles.topDot : ''}`}>
                        {isTop ? <span style={{ fontSize: '0.7rem' }}>●</span> : <Minus size={8} />}
                      </div>

                      <div className={styles.stackInfo}>
                        <span className={styles.stackPrice}>₹{price}</span>
                        <span className={`${styles.stackTag} ${isTop ? styles.topTag : ''}`}>
                          {isTop ? '🔝 Current (Top of Stack)' : `Stack[${i}] — previous`}
                        </span>
                      </div>

                      {isTop && (
                        <div className={styles.activePill}>Active</div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
