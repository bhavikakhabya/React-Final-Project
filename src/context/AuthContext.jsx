import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USER } from '../utils/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cf_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist user session
  useEffect(() => {
    if (user) localStorage.setItem('cf_user', JSON.stringify(user));
    else localStorage.removeItem('cf_user');
  }, [user]);

  const login = async (email, password, remember) => {
    setLoading(true);
    setError('');
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 900));
    // Accept demo credentials or any email/password pair for demo
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const loggedUser = { ...DEMO_USER };
      setUser(loggedUser);
      if (remember) localStorage.setItem('cf_remember', email);
      else localStorage.removeItem('cf_remember');
      setLoading(false);
      return true;
    }
    setError('Invalid email or password. Use demo@carpoolflow.com / demo123');
    setLoading(false);
    return false;
  };

  const register = async (formData) => {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    const newUser = {
      id: `u_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      role: formData.role,
      avatar: formData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      points: 0,
    };
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cf_user');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
