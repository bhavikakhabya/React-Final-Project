import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListOrdered, Plus, ChevronRight, CheckCircle, Clock, Star, Leaf } from 'lucide-react';
import { useRide } from '../context/RideContext';
import styles from './RideQueue.module.css';

const AREAS = ['Andheri East','Bandra West','Powai','Churchgate','Goregaon','Kurla','Borivali','Thane'];

export default function RideQueue() {
  const { state, dispatch } = useRide();
  const [form, setForm] = useState({ name: '', from: AREAS[0], to: AREAS[1] });
  const [formError, setFormError] = useState('');
  const [processed, setProcessed] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleAdd = () => {
    if (!form.name.trim()) { setFormError('Passenger name is required'); return; }
    if (form.from === form.to) { setFormError('Pickup and drop cannot be the same'); return; }
    setFormError('');
    const req = {
      id: `q_${Date.now()}`,
      name: form.name,
      from: form.from,
      to: form.to,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    };
    dispatch({ type: 'ADD_TO_QUEUE', payload: req });
    setForm(f => ({ ...f, name: '' }));
  };

  const handleProcess = () => {
    if (!state.requestQueue.length) return;
    const front = state.requestQueue[0];
    setProcessed(p => [{ ...front, processedAt: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }, ...p]);
    dispatch({ type: 'PROCESS_REQUEST' });
    // Show feedback toast
    setFeedback(`✅ Ride saved! +80 pts • +2.4 kg CO₂ tracked`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><ListOrdered size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Ride Request Queue</h1>
        <p className="page-subtitle">FIFO Queue — processed rides auto-save to Ride History, award points & update Eco Score</p>
      </div>

      {/* Live stats bar */}
      <div className={styles.liveStats}>
        <div className={styles.liveStat}>
          <Star size={14} color="#e67e22" />
          <span><strong>{state.points}</strong> reward pts</span>
        </div>
        <div className={styles.liveStatDivider} />
        <div className={styles.liveStat}>
          <Leaf size={14} color="#27ae60" />
          <span><strong>{((state.totalCo2Saved || 0) + 57.6).toFixed(1)} kg</strong> CO₂ saved</span>
        </div>
        <div className={styles.liveStatDivider} />
        <div className={styles.liveStat}>
          <CheckCircle size={14} color="#2D4354" />
          <span><strong>{state.completedRides || 0}</strong> queue rides done</span>
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={styles.feedbackToast}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.28 }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Add Request Form */}
        <div className={`${styles.formCard} glass-card`}>
          <h3 className={styles.cardTitle}>➕ Add Ride Request</h3>
          <div className="input-wrap">
            <label className="input-label">Passenger Name</label>
            <input
              type="text" id="queue-name"
              className={`input-field ${formError ? 'error' : ''}`}
              placeholder="Enter name"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            {formError && <span className="input-error">{formError}</span>}
          </div>
          <div className="input-wrap">
            <label className="input-label">Pickup Location</label>
            <select className="input-field" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}>
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="input-wrap">
            <label className="input-label">Drop Location</label>
            <select className="input-field" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}>
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <motion.button className="btn btn-primary btn-full" onClick={handleAdd} whileTap={{ scale: 0.97 }}>
            <Plus size={16} /> Enqueue Request
          </motion.button>
        </div>

        {/* Queue Visualization */}
        <div>
          <div className={styles.queueHeader}>
            <h3 className="section-title"><Clock size={15} /> Waiting Queue ({state.requestQueue.length})</h3>
            <motion.button
              className="btn btn-secondary btn-sm"
              onClick={handleProcess}
              disabled={!state.requestQueue.length}
              whileTap={{ scale: 0.96 }}
            >
              <ChevronRight size={15} /> Process Next
            </motion.button>
          </div>

          <AnimatePresence mode="popLayout">
            {state.requestQueue.length === 0 ? (
              <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Queue is empty — add a request!
              </motion.div>
            ) : (
              state.requestQueue.map((req, i) => (
                <motion.div
                  key={req.id}
                  className={`${styles.queueItem} glass-card ${i === 0 ? styles.front : ''}`}
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  layout
                >
                  <div className={styles.queuePos}>{i === 0 ? '🔜 FRONT' : `#${i + 1}`}</div>
                  <div className={styles.queueInfo}>
                    <span className={styles.queueName}>{req.name}</span>
                    <span className={styles.queueRoute}>{req.from} → {req.to}</span>
                  </div>
                  <span className={styles.queueTime}>{req.time}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Processed */}
          {processed.length > 0 && (
            <div className={styles.processedSection}>
              <h3 className="section-title"><CheckCircle size={15} /> Processed</h3>
              <AnimatePresence>
                {processed.slice(0, 3).map(req => (
                  <motion.div
                    key={req.id + '_done'}
                    className={`${styles.processedItem} glass-card`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <CheckCircle size={16} color="#27ae60" />
                    <span>{req.name} — {req.from} → {req.to}</span>
                    <span className={styles.queueTime}>{req.processedAt}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
