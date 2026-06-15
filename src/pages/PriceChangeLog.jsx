import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, RotateCcw, Plus, Clock } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './PriceChangeLog.module.css';

export default function PriceChangeLog() {
  const { state, dispatch } = useRide();
  const [newPrice, setNewPrice] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSetPrice = () => {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val <= 0) { setInputError('Enter a valid positive price'); return; }
    if (val === state.currentPrice) { setInputError('Price is already set to this value'); return; }
    setInputError('');
    dispatch({ type: 'SET_PRICE', payload: val });
    setNewPrice('');
  };

  const handleUndo = () => {
    if (state.priceHistory.length < 2) return;
    dispatch({ type: 'UNDO_PRICE' });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><DollarSign size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Price Change Log</h1>
        <p className="page-subtitle">Track ride price changes using useReducer — supports undo</p>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems:'start' }}>
        {/* Current Price Card */}
        <motion.div className={`${styles.priceCard} glass-card`} layout>
          <div className={styles.priceLabel}>Current Ride Price</div>
          <motion.div
            className={styles.priceValue}
            key={state.currentPrice}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            ₹{state.currentPrice}
          </motion.div>

          {/* Set New Price */}
          <div className={styles.inputRow}>
            <div className="input-icon-wrap" style={{ flex: 1 }}>
              <DollarSign size={16} className="input-icon" />
              <input
                type="number"
                className={`input-field ${inputError ? 'error' : ''}`}
                placeholder="Enter new price"
                value={newPrice}
                onChange={e => { setNewPrice(e.target.value); setInputError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSetPrice()}
                id="price-input"
                min="1"
              />
            </div>
            <motion.button
              className="btn btn-primary"
              onClick={handleSetPrice}
              whileTap={{ scale: 0.96 }}
            >
              <Plus size={16} /> Set
            </motion.button>
          </div>
          {inputError && <span className="input-error">{inputError}</span>}

          <motion.button
            className={`btn btn-secondary btn-full`}
            onClick={handleUndo}
            disabled={state.priceHistory.length < 2}
            whileTap={{ scale: 0.96 }}
            style={{ marginTop: 8 }}
          >
            <RotateCcw size={16} /> Undo Last Change
          </motion.button>
          <p className={styles.historyCount}>
            {state.priceHistory.length} price record{state.priceHistory.length !== 1 ? 's' : ''} in stack
          </p>
        </motion.div>

        {/* Price Timeline */}
        <div className={styles.timeline}>
          <h3 className="section-title"><Clock size={15} /> Price Timeline (Stack)</h3>
          <AnimatePresence mode="popLayout">
            {state.priceHistory.map((price, i) => (
              <motion.div
                key={`${price}-${i}`}
                className={`${styles.timelineItem} glass-card`}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <div className={`${styles.stackDot} ${i === 0 ? styles.topDot : ''}`} />
                <div className={styles.stackInfo}>
                  <span className={styles.stackPrice}>₹{price}</span>
                  <span className={styles.stackTag}>
                    {i === 0 ? '🔝 Top of Stack (Current)' : `Stack[${i}]`}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {state.priceHistory.length === 0 && (
            <div className={styles.empty}>Stack is empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
