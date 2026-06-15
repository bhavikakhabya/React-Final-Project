import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Car, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const FEATURES = [
  { emoji: '🚗', text: 'Smart carpool matching' },
  { emoji: '💰', text: 'Split fares instantly' },
  { emoji: '🌱', text: 'Reduce carbon footprint' },
  { emoji: '🏆', text: 'Earn reward points' },
];

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors]   = useState({});
  const [focused, setFocused] = useState('');
  const { login, loading, error } = useAuth();
  const navigate   = useNavigate();
  const emailRef   = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
    const remembered = localStorage.getItem('cf_remember');
    if (remembered) setForm(f => ({ ...f, email: remembered, remember: true }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const ok = await login(form.email, form.password, form.remember);
    if (ok) navigate('/dashboard');
  };

  const handleDemo = async () => {
    setForm({ email: 'demo@carpoolflow.com', password: 'demo123', remember: false });
    const ok = await login('demo@carpoolflow.com', 'demo123', false);
    if (ok) navigate('/dashboard');
  };

  const handleChange = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div className={styles.page}>
      {/* Animated background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.split}>
        {/* ── LEFT PANEL ── */}
        <motion.div
          className={styles.leftPanel}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Car size={24} /></div>
            <span className={styles.brandName}>CarpoolFlow</span>
          </div>

          <div className={styles.heroText}>
            <h2 className={styles.heroHeading}>
              Commute smarter,<br />
              <span className={styles.heroAccent}>together.</span>
            </h2>
            <p className={styles.heroSub}>
              Join thousands of commuters saving money and the planet — one shared ride at a time.
            </p>
          </div>

          {/* Feature list */}
          <ul className={styles.featureList}>
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                className={styles.featureItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <span className={styles.featureEmoji}>{f.emoji}</span>
                <span>{f.text}</span>
              </motion.li>
            ))}
          </ul>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {[['12K+', 'Active Users'], ['₹4.2L', 'Saved Monthly'], ['98%', 'Satisfaction']].map(([val, lbl]) => (
              <div key={lbl} className={styles.statItem}>
                <span className={styles.statVal}>{val}</span>
                <span className={styles.statLbl}>{lbl}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT PANEL — Form ── */}
        <div className={styles.rightPanel}>
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Card header */}
            <div className={styles.cardHeader}>
              <h1 className={styles.title}>Welcome back 👋</h1>
              <p className={styles.subtitle}>Sign in to continue your journey</p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className={styles.errorBanner}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              {/* Email */}
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel} htmlFor="login-email">Email Address</label>
                <div className={`${styles.fieldInner} ${focused === 'email' ? styles.fieldFocused : ''} ${errors.email ? styles.fieldError : ''}`}>
                  <Mail size={16} className={styles.fieldIcon} />
                  <input
                    ref={emailRef}
                    type="email"
                    id="login-email"
                    className={styles.fieldInput}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className={styles.fieldErrorMsg}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div className={styles.fieldWrap}>
                <label className={styles.fieldLabel} htmlFor="login-password">Password</label>
                <div className={`${styles.fieldInner} ${focused === 'password' ? styles.fieldFocused : ''} ${errors.password ? styles.fieldError : ''}`}>
                  <Lock size={16} className={styles.fieldIcon} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    id="login-password"
                    className={styles.fieldInput}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange('password')}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    style={{ paddingRight: 46 }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPwd(s => !s)}
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className={styles.fieldErrorMsg}>{errors.password}</span>}
              </div>

              {/* Remember */}
              <div className={styles.rememberRow}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    id="login-remember"
                    checked={form.remember}
                    onChange={handleChange('remember')}
                    className={styles.checkbox}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                id="login-submit"
                className={styles.submitBtn}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading
                  ? <span className={styles.spinner} />
                  : <><span>Sign In</span><ArrowRight size={18} /></>
                }
              </motion.button>
            </form>

            {/* Divider */}
            <div className={styles.divider}><span>or continue with</span></div>

            {/* Demo button */}
            <motion.button
              id="demo-login"
              className={styles.demoBtn}
              onClick={handleDemo}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap size={16} />
              Try Demo Account
            </motion.button>

            <p className={styles.footer}>
              Don't have an account?{' '}
              <Link to="/register" className={styles.footerLink}>Create one free →</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
