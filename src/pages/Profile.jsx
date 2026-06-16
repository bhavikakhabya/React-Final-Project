import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Shield, Edit3, Save, X, Star, Car, Trophy, MapPin, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { state } = useRide();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    role: user?.role || 'Passenger',
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email, mobile: user.mobile || '', role: user.role || 'Passenger' });
    setEditing(false);
  };

  const totalRides = 24 + (state.rides?.length || 0);
  const points = state.points || 1240;
  const co2Saved = (totalRides * 2.4).toFixed(1);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><User size={24} style={{ verticalAlign:'middle', marginRight:8 }} />My Profile</h1>
        <p className="page-subtitle">Manage your account and track your carpooling journey</p>
      </div>

      <div className={styles.pageGrid}>
        {/* LEFT — Hero Profile Card */}
        <motion.div
          className={`${styles.heroCard} glass-card`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Cover band */}
          <div className={styles.coverBand} />

          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{user?.avatar || 'U'}</div>
            <div className={styles.avatarBadge}><Camera size={12} /></div>
          </div>

          <div className={styles.heroInfo}>
            <h2 className={styles.heroName}>{user?.name || 'User'}</h2>
            <span className={styles.roleChip}>{user?.role || 'Passenger'}</span>
            <p className={styles.heroEmail}>{user?.email}</p>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <Car size={16} className={styles.statIcon} />
              <span className={styles.statNum}>{totalRides}</span>
              <span className={styles.statLbl}>Rides</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <Star size={16} className={styles.statIcon} />
              <span className={styles.statNum}>{points}</span>
              <span className={styles.statLbl}>Points</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <Trophy size={16} className={styles.statIcon} />
              <span className={styles.statNum}>Gold</span>
              <span className={styles.statLbl}>Level</span>
            </div>
          </div>

          {/* Eco badge */}
          <div className={styles.ecoBadge}>
            <span className={styles.ecoIcon}>🌿</span>
            <div>
              <div className={styles.ecoTitle}>{co2Saved} kg CO₂ saved</div>
              <div className={styles.ecoSub}>through carpooling</div>
            </div>
          </div>

          <AnimatePresence>
            {saved && (
              <motion.div className={styles.savedMsg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                ✅ Profile updated!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT — Tabbed Details Card */}
        <motion.div
          className={`${styles.detailCard} glass-card`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Tabs */}
          <div className={styles.tabs}>
            {['info', 'activity'].map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'info' ? '👤 Account' : '📊 Activity'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className={styles.formHeader}>
                  <span className={styles.formTitle}>Account Details</span>
                  {!editing ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                      <Edit3 size={14} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={14} /> Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={handleCancel}><X size={14} /></button>
                    </div>
                  )}
                </div>

                <div className={styles.fields}>
                  {[
                    { field: 'name',   label: 'Full Name',     icon: User,  type: 'text'  },
                    { field: 'email',  label: 'Email Address', icon: Mail,  type: 'email' },
                    { field: 'mobile', label: 'Mobile Number', icon: Phone, type: 'tel'   },
                  ].map(({ field, label, icon: Icon, type }) => (
                    <div key={field} className={styles.fieldWrap}>
                      <label className={styles.fieldLabel}>{label}</label>
                      <div className={styles.fieldInner}>
                        <Icon size={15} className={styles.fieldIcon} />
                        <input
                          type={type}
                          id={`profile-${field}`}
                          className={styles.fieldInput}
                          value={form[field]}
                          onChange={handleChange(field)}
                          disabled={!editing}
                        />
                      </div>
                    </div>
                  ))}

                  <div className={styles.fieldWrap}>
                    <label className={styles.fieldLabel}>Role</label>
                    <div className={styles.fieldInner}>
                      <Shield size={15} className={styles.fieldIcon} />
                      <select
                        className={styles.fieldInput}
                        value={form.role}
                        onChange={handleChange('role')}
                        disabled={!editing}
                        id="profile-role"
                      >
                        <option>Passenger</option>
                        <option>Driver</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="activity" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className={styles.activityList}>
                  {[
                    { icon: '🚗', label: 'Total rides completed', sub: `${totalRides} rides so far`, color: '#27ae60' },
                    { icon: '🌱', label: 'CO₂ saved', sub: `${co2Saved} kg through carpooling`, color: '#2D4354' },
                    { icon: '💰', label: `${state.completedRides || 0} rides via Queue`, sub: 'Fares split with co-riders', color: '#9E6752' },
                    { icon: '⭐', label: `${points} reward points`, sub: 'Earn 80 pts per completed ride', color: '#e67e22' },
                    { icon: '🏆', label: totalRides >= 20 ? 'Gold level reached' : 'Keep riding!', sub: `${totalRides} total rides`, color: '#9E6752' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={styles.activityItem}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className={styles.activityDot} style={{ background: item.color }} />
                      <div className={styles.activityEmoji}>{item.icon}</div>
                      <div className={styles.activityText}>
                        <span className={styles.activityLabel}>{item.label}</span>
                        <span className={styles.activitySub}>{item.sub}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
