import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { PASSENGER_LOCATIONS } from '../utils/mockData';
import styles from './LocationFinder.module.css';

const statusColor = { Ready: '#27ae60', Waiting: '#e67e22', Away: '#e74c3c' };
const genderEmoji = { female: '👧', male: '👦' };

// City node positions for road background
const CITY_NODES = [
  { id: 'n1', name: 'Borivali',   x: 180, y: 60  },
  { id: 'n2', name: 'Goregaon',   x: 190, y: 140 },
  { id: 'n3', name: 'Andheri W',  x: 130, y: 220 },
  { id: 'n4', name: 'Andheri E',  x: 270, y: 215 },
  { id: 'n5', name: 'Powai',      x: 370, y: 175 },
  { id: 'n6', name: 'Bandra W',   x: 110, y: 310 },
  { id: 'n7', name: 'Kurla',      x: 290, y: 305 },
  { id: 'n8', name: 'Sion',       x: 265, y: 385 },
  { id: 'n9', name: 'Churchgate', x:  90, y: 435 },
  { id:'n10', name: 'Thane',      x: 460, y: 290 },
];
const CITY_EDGES = [
  ['n1','n2'],['n2','n3'],['n2','n4'],['n3','n4'],['n3','n6'],
  ['n4','n5'],['n4','n7'],['n5','n10'],['n6','n9'],['n6','n7'],
  ['n7','n8'],['n8','n9'],['n8','n10'],
];
const nodeById = Object.fromEntries(CITY_NODES.map(n => [n.id, n]));

export default function LocationFinder() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const local = PASSENGER_LOCATIONS.map((loc, i) => ({
        id: i + 1,
        displayName: loc.name,
        ...loc,
      }));
      setUsers(local);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      (u.area || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  const filteredIds = new Set(filtered.map(u => u.id));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <MapPin size={24} style={{ verticalAlign:'middle', marginRight:8 }} />Location Finder
        </h1>
        <p className="page-subtitle">See where everyone is on the map — 👧 girls &amp; 👦 boys</p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchRow}>
        <div className="input-icon-wrap" style={{ flex: 1, maxWidth: 420 }}>
          <Search size={17} className="input-icon" />
          <input
            ref={searchRef}
            type="text"
            id="location-search"
            className="input-field"
            placeholder="Search passenger or area…"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(null); }}
          />
        </div>
        {search && (
          <motion.span className={styles.resultCount} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </motion.span>
        )}
      </div>

      <div className={styles.layout}>
        {/* SVG Map with emoji markers */}
        <div className={`${styles.mapCard} glass-card`}>
          <div className={styles.mapTitle}>🗺️ Mumbai Carpool Map</div>
          <svg viewBox="0 0 560 500" className={styles.mapSvg}>
            <defs>
              <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d8c4" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#d4c5b0" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="560" height="500" fill="url(#mapBg)" rx="12" />

            {/* Road edges */}
            {CITY_EDGES.map(([fromId, toId], i) => {
              const a = nodeById[fromId];
              const b = nodeById[toId];
              if (!a || !b) return null;
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="rgba(83,65,69,0.18)" strokeWidth="7" strokeLinecap="round" />
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" strokeLinecap="round" />
                </g>
              );
            })}

            {/* Area label dots */}
            {CITY_NODES.map(node => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={8}
                  fill="rgba(45,67,84,0.12)" stroke="rgba(45,67,84,0.3)" strokeWidth="1.5" />
                <text x={node.x} y={node.y - 13} textAnchor="middle"
                  fontSize="8.5" fontWeight="600" fill="#534145"
                  style={{ userSelect: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {node.name}
                </text>
              </g>
            ))}

            {/* Passenger emoji markers */}
            {users.map(u => {
              const mx = u.mapX || 250;
              const my = u.mapY || 250;
              const isSelected = selected?.id === u.id;
              const isFiltered = filteredIds.has(u.id);
              const emoji = u.gender === 'female' ? '👧' : '👦';
              const sc = statusColor[u.status] || '#73766A';

              return (
                <g key={u.id}
                  onClick={() => setSelected(isSelected ? null : u)}
                  style={{ cursor: 'pointer' }}
                  opacity={search && !isFiltered ? 0.25 : 1}
                >
                  {isSelected && (
                    <motion.circle
                      cx={mx} cy={my} r={28}
                      fill="none" stroke={sc} strokeWidth="2"
                      initial={{ r: 18, opacity: 0.8 }}
                      animate={{ r: 32, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                  )}
                  <circle cx={mx} cy={my} r={isSelected ? 22 : 18}
                    fill={isSelected ? `${sc}30` : 'rgba(255,255,255,0.4)'}
                    stroke={sc} strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text x={mx} y={my + 7} textAnchor="middle"
                    fontSize={isSelected ? '18' : '14'}
                    style={{ userSelect: 'none' }}>
                    {emoji}
                  </text>
                  <g>
                    <rect
                      x={mx - 36} y={my + (isSelected ? 26 : 22)}
                      width="72" height="14" rx="4"
                      fill="rgba(32,33,43,0.75)"
                    />
                    <text x={mx} y={my + (isSelected ? 36 : 32)}
                      textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#FED7A5"
                      style={{ userSelect: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {u.displayName?.split(' ')[0]}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          <div className={styles.mapLegend}>
            <span>👧 Female passenger</span>
            <span>👦 Male passenger</span>
            <span className={styles.legendDot} style={{ background: '#27ae60' }} /> Ready
            <span className={styles.legendDot} style={{ background: '#e67e22' }} /> Waiting
            <span className={styles.legendDot} style={{ background: '#e74c3c' }} /> Away
          </div>
        </div>

        {/* Right panel: list + detail */}
        <div className={styles.rightPanel}>
          <div className={styles.passengerList}>
            {loading ? (
              <div className={styles.skeletonList}>
                {[1,2,3,4].map(i => <div key={i} className={`${styles.skel} skeleton`} />)}
              </div>
            ) : (
              <AnimatePresence>
                {filtered.map((u, i) => (
                  <motion.div
                    key={u.id}
                    className={`${styles.locationCard} glass-card ${selected?.id === u.id ? styles.active : ''}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(selected?.id === u.id ? null : u)}
                    layout
                  >
                    <div className={styles.avatarEmoji}>
                      {u.gender === 'female' ? '👧' : '👦'}
                    </div>
                    <div className={styles.info}>
                      <span className={styles.name}>{u.displayName}</span>
                      <span className={styles.area}><MapPin size={11} /> {u.area || '—'}</span>
                    </div>
                    {u.status && (
                      <span className={styles.statusBadge} style={{ color: statusColor[u.status] || '#73766A', borderColor: statusColor[u.status], background: `${statusColor[u.status] || '#73766A'}15` }}>
                        ● {u.status}
                      </span>
                    )}
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className={styles.empty}>No passengers found for "{search}"</div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Detail Card */}
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                className={`${styles.detailCard} glass-card`}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.detailEmoji}>{selected.gender === 'female' ? '👧' : '👦'}</div>
                <h3 className={styles.detailName}>{selected.displayName}</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}><span>Area</span><strong>{selected.area || '—'}</strong></div>
                  <div className={styles.detailItem}><span>Latitude</span><strong>{selected.lat}</strong></div>
                  <div className={styles.detailItem}><span>Longitude</span><strong>{selected.lng}</strong></div>
                  <div className={styles.detailItem}><span>Status</span>
                    <strong style={{ color: statusColor[selected.status] || '#73766A' }}>
                      {selected.status || 'Unknown'}
                    </strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
