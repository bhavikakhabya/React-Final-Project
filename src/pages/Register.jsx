import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Car, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Register.module.css';

const ROLES = ['Passenger', 'Driver'];

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', role: 'Passenger', password: '', confirm: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.mobile) e.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (!form.confirm) e.confirm = 'Please confirm password';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const ok = await register(form);
    if (ok) navigate('/dashboard');
  };

  const fields = [
    { key: 'name',   label: 'Full Name',     icon: User,  type: 'text',     placeholder: 'Jane Smith'          },
    { key: 'email',  label: 'Email Address', icon: Mail,  type: 'email',    placeholder: 'you@example.com'     },
    { key: 'mobile', label: 'Mobile Number', icon: Phone, type: 'tel',      placeholder: '9876543210'          },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={styles.header}>
          <div className={styles.logoWrap}><Car size={26} /></div>
          <h1 className={styles.title}>Join CarpoolFlow</h1>
          <p className={styles.subtitle}>Create your account today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="input-wrap">
              <label className="input-label">{label}</label>
              <div className="input-icon-wrap">
                <Icon size={17} className="input-icon" />
                <input
                  ref={key === 'name' ? nameRef : undefined}
                  type={type}
                  id={`reg-${key}`}
                  className={`input-field ${errors[key] ? 'error' : ''}`}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={handleChange(key)}
                />
              </div>
              {errors[key] && <span className="input-error">{errors[key]}</span>}
            </div>
          ))}

          {/* Role Selector */}
          <div className="input-wrap">
            <label className="input-label">I am a</label>
            <div className={styles.roleGroup}>
              {ROLES.map(r => (
                <button
                  key={r} type="button"
                  className={`${styles.roleBtn} ${form.role === r ? styles.roleActive : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r }))}
                >
                  {r === 'Driver' ? '🚗' : '🧑‍💼'} {r}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="input-wrap">
            <label className="input-label">Password</label>
            <div className="input-icon-wrap">
              <Lock size={17} className="input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                id="reg-password"
                className={`input-field ${errors.password ? 'error' : ''}`}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange('password')}
                style={{ paddingRight: 46 }}
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)} tabIndex={-1}>
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="input-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="input-wrap">
            <label className="input-label">Confirm Password</label>
            <div className="input-icon-wrap">
              <Lock size={17} className="input-icon" />
              <input
                type="password"
                id="reg-confirm"
                className={`input-field ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handleChange('confirm')}
              />
            </div>
            {errors.confirm && <span className="input-error">{errors.confirm}</span>}
          </div>

          <motion.button
            type="submit"
            id="reg-submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </motion.button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
