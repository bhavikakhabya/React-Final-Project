import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Navigation } from 'lucide-react';
import { CITY_NODES, CITY_EDGES } from '../utils/mockData';
import styles from './CityMap.module.css';

const nodeById = Object.fromEntries(CITY_NODES.map(n => [n.id, n]));

// Assign area types for styling
const nodeTypes = {
  n1: 'hub', n2: 'hub', n9: 'hub',
  n5: 'business', n10: 'business',
};

export default function CityMap() {
  const [selected, setSelected] = useState(null);

  const connections = selected
    ? CITY_EDGES
        .filter(e => e.from === selected.id || e.to === selected.id)
        .map(e => (e.from === selected.id ? nodeById[e.to] : nodeById[e.from]))
        .filter(Boolean)
    : [];

  const connectedIds = new Set(connections.map(c => c.id));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><Map size={24} style={{ verticalAlign:'middle', marginRight:8 }} />City Street Map Hub</h1>
        <p className="page-subtitle">Interactive road network — click any district to explore connections</p>
      </div>

      <div className={styles.layout}>
        {/* Map Panel */}
        <div className={`${styles.mapCard} glass-card`}>
          <div className={styles.mapHeader}>
            <Navigation size={14} />
            <span>Mumbai Road Network</span>
          </div>

          <svg viewBox="0 0 560 500" className={styles.mapSvg}>
            <defs>
              <linearGradient id="cityBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d8c4" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#d8c9b4" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#20212B" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Map background */}
            <rect x="0" y="0" width="560" height="500" fill="url(#cityBg)" rx="14" />

            {/* Block-style background zones */}
            <rect x="60" y="140" width="120" height="100" fill="rgba(45,67,84,0.05)" rx="6" />
            <rect x="230" y="160" width="160" height="100" fill="rgba(158,103,82,0.06)" rx="6" />
            <rect x="60" y="380" width="80" height="80" fill="rgba(45,67,84,0.07)" rx="6" />

            {/* Road edges */}
            {CITY_EDGES.map((edge, i) => {
              const a = nodeById[edge.from];
              const b = nodeById[edge.to];
              if (!a || !b) return null;
              const isHighlighted = selected && (edge.from === selected.id || edge.to === selected.id);

              return (
                <g key={i}>
                  {/* Road casing */}
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isHighlighted ? 'rgba(158,103,82,0.4)' : 'rgba(83,65,69,0.15)'}
                    strokeWidth={isHighlighted ? 10 : 7}
                    strokeLinecap="round"
                  />
                  {/* Road surface */}
                  <line
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={isHighlighted ? '#9E6752' : 'rgba(255,255,255,0.6)'}
                    strokeWidth={isHighlighted ? 4.5 : 3}
                    strokeLinecap="round"
                    filter={isHighlighted ? 'url(#glow)' : undefined}
                  />
                  {/* Centre dash on highlighted roads */}
                  {isHighlighted && (
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke="#FED7A5" strokeWidth="1.2" strokeLinecap="round"
                      strokeDasharray="6,8"
                    />
                  )}
                </g>
              );
            })}

            {/* Nodes (districts) */}
            {CITY_NODES.map(node => {
              const isSelected = selected?.id === node.id;
              const isConnected = connectedIds.has(node.id);
              const isHub = nodeTypes[node.id] === 'hub';

              let fillColor = 'rgba(255,255,255,0.55)';
              let strokeColor = 'rgba(83,65,69,0.45)';
              let r = isHub ? 16 : 13;
              if (isSelected) { fillColor = '#9E6752'; strokeColor = '#FED7A5'; r = 22; }
              else if (isConnected) { fillColor = '#2D4354'; strokeColor = '#FED7A5'; r = isHub ? 18 : 15; }

              return (
                <g
                  key={node.id}
                  onClick={() => setSelected(isSelected ? null : node)}
                  style={{ cursor: 'pointer' }}
                >
                  {isSelected && (
                    <motion.circle
                      cx={node.x} cy={node.y} r={r + 8}
                      fill="none"
                      stroke="#9E6752"
                      strokeWidth="2"
                      initial={{ r: r, opacity: 0.8 }}
                      animate={{ r: r + 14, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                  <motion.circle
                    cx={node.x} cy={node.y}
                    r={r}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    animate={{ r }}
                    transition={{ type: 'spring', stiffness: 280 }}
                    filter={isSelected ? 'url(#shadow)' : undefined}
                  />
                  {isSelected && (
                    <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="12"
                      style={{ userSelect: 'none' }}>📍</text>
                  )}
                  {!isSelected && isHub && (
                    <circle cx={node.x} cy={node.y} r={4}
                      fill={isConnected ? '#FED7A5' : '#73766A'} />
                  )}
                  {!isSelected && !isHub && (
                    <circle cx={node.x} cy={node.y} r={3}
                      fill={isConnected ? '#FED7A5' : 'rgba(115,118,106,0.6)'} />
                  )}
                  <text
                    x={node.x} y={node.y - (r + 6)}
                    textAnchor="middle"
                    fontSize={isSelected ? '11' : '9.5'}
                    fontWeight={isSelected ? '800' : '600'}
                    fill={isSelected ? '#20212B' : isConnected ? '#2D4354' : '#534145'}
                    style={{ userSelect: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}><span className={styles.dotSelected} /> Selected</div>
            <div className={styles.legendItem}><span className={styles.dotConnected} /> Connected</div>
            <div className={styles.legendItem}><span className={styles.dotDefault} /> Other</div>
            <div className={styles.legendItem}>── Highlighted road</div>
          </div>
        </div>

        {/* Info Panel */}
        <div>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                className={`${styles.infoCard} glass-card`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                key={selected.id}
              >
                <div className={styles.nodeIcon}>📍</div>
                <h3 className={styles.nodeName}>{selected.name}</h3>
                <p className={styles.nodeDesc}>
                  Connected to <strong>{connections.length}</strong> district{connections.length !== 1 ? 's' : ''}
                </p>
                <div className={styles.connectList}>
                  {connections.map(c => (
                    <div key={c.id} className={styles.connectItem}>
                      <span className={styles.connectDot} />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                  Clear Selection
                </button>
              </motion.div>
            ) : (
              <motion.div
                className={`${styles.hintCard} glass-card`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className={styles.hintEmoji}>🗺️</div>
                <p>Click any <strong>district</strong> on the map to explore its road connections.</p>
                <p className={styles.hintSub}>{CITY_NODES.length} districts · {CITY_EDGES.length} roads</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Node chips */}
          <div className={styles.nodeListWrap}>
            <h3 className="section-title" style={{ marginTop: 20 }}>All Districts ({CITY_NODES.length})</h3>
            <div className={styles.nodeChips}>
              {CITY_NODES.map(n => (
                <motion.button
                  key={n.id}
                  className={`${styles.chip} ${selected?.id === n.id ? styles.chipActive : ''}`}
                  onClick={() => setSelected(selected?.id === n.id ? null : n)}
                  whileTap={{ scale: 0.93 }}
                >
                  {n.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
