// Simplified local fallback data (used when APIs are unavailable)
export const DEMO_USER = {
  id: 'u1',
  name: 'Priya Sharma',
  email: 'demo@carpoolflow.com',
  password: 'demo123',
  mobile: '9876543210',
  role: 'Passenger',
  avatar: 'PS',
  points: 1240,
};

export const ROUTES_DATA = [
  { id: 'rt1', from: 'Andheri East', to: 'Bandra West',   distance: '8.2 km',  time: '22 min', baseFare: 120 },
  { id: 'rt2', from: 'Powai',        to: 'Churchgate',    distance: '14.5 km', time: '38 min', baseFare: 220 },
  { id: 'rt3', from: 'Borivali',     to: 'Andheri West',  distance: '12.1 km', time: '30 min', baseFare: 160 },
  { id: 'rt4', from: 'Goregaon',     to: 'Kurla',         distance: '10.8 km', time: '28 min', baseFare: 145 },
  { id: 'rt5', from: 'Thane',        to: 'Powai',         distance: '14.0 km', time: '35 min', baseFare: 185 },
];

export const CITY_NODES = [
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

export const CITY_EDGES = [
  { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' },
  { from: 'n2', to: 'n4' }, { from: 'n3', to: 'n4' },
  { from: 'n3', to: 'n6' }, { from: 'n4', to: 'n5' },
  { from: 'n4', to: 'n7' }, { from: 'n5', to: 'n10' },
  { from: 'n6', to: 'n9' }, { from: 'n6', to: 'n7' },
  { from: 'n7', to: 'n8' }, { from: 'n8', to: 'n9' },
  { from: 'n8', to: 'n10'},
];

// ── Real approximate road distances (km) between Mumbai locations ──────────
const TRIP_BASE_KM = {
  'Borivali':  { 'Churchgate': 46, 'Bandra W': 28, 'Kurla': 36, 'Sion': 38, 'Andheri E': 18 },
  'Goregaon':  { 'Churchgate': 38, 'Bandra W': 20, 'Kurla': 28, 'Sion': 30, 'Andheri E': 10 },
  'Andheri W': { 'Churchgate': 28, 'Bandra W': 12, 'Kurla': 20, 'Sion': 22, 'Andheri E':  6 },
  'Andheri E': { 'Churchgate': 30, 'Bandra W': 16, 'Kurla': 12, 'Sion': 16, 'Andheri E':  2 },
  'Powai':     { 'Churchgate': 34, 'Bandra W': 22, 'Kurla': 10, 'Sion': 14, 'Andheri E': 12 },
  'Thane':     { 'Churchgate': 32, 'Bandra W': 28, 'Kurla': 18, 'Sion': 22, 'Andheri E': 20 },
};

// Intermediate stops per route type for each origin → destination
const ROUTE_STOPS = {
  highway: {
    'Borivali':  { 'Churchgate': ['Andheri W','Bandra W'], 'Bandra W': ['Andheri W'],      'Kurla': ['Andheri E'],        'Sion': ['Andheri E'],          'Andheri E': []            },
    'Goregaon':  { 'Churchgate': ['Andheri W','Bandra W'], 'Bandra W': ['Andheri W'],      'Kurla': ['Andheri E'],        'Sion': ['Andheri E'],          'Andheri E': []            },
    'Andheri W': { 'Churchgate': ['Bandra W'],             'Bandra W': [],                 'Kurla': ['Andheri E'],        'Sion': ['Andheri E'],          'Andheri E': []            },
    'Andheri E': { 'Churchgate': ['Bandra W'],             'Bandra W': ['Sion'],           'Kurla': [],                   'Sion': [],                     'Andheri E': []            },
    'Powai':     { 'Churchgate': ['Kurla','Bandra W'],     'Bandra W': ['Kurla'],           'Kurla': [],                  'Sion': ['Kurla'],              'Andheri E': []            },
    'Thane':     { 'Churchgate': ['Powai','Andheri E'],    'Bandra W': ['Powai','Kurla'],   'Kurla': ['Powai'],            'Sion': ['Powai'],              'Andheri E': ['Powai']     },
  },
  city: {
    'Borivali':  { 'Churchgate': ['Goregaon','Andheri W','Mahim'],    'Bandra W': ['Goregaon','Andheri W'],   'Kurla': ['Goregaon','Andheri E'],   'Sion': ['Goregaon','Andheri E','Kurla'],  'Andheri E': ['Goregaon']         },
    'Goregaon':  { 'Churchgate': ['Andheri W','Mahim'],               'Bandra W': ['Andheri W'],              'Kurla': ['Andheri W','Andheri E'],  'Sion': ['Andheri E','Kurla'],            'Andheri E': ['Andheri W']        },
    'Andheri W': { 'Churchgate': ['Mahim','Dadar'],                   'Bandra W': ['Mahim'],                  'Kurla': ['Andheri E'],              'Sion': ['Andheri E','Kurla'],            'Andheri E': ['JVLR']             },
    'Andheri E': { 'Churchgate': ['Sion','Dadar'],                    'Bandra W': ['Sion','Mahim'],           'Kurla': ['JVLR'],                   'Sion': [],                               'Andheri E': []                   },
    'Powai':     { 'Churchgate': ['Andheri E','Sion','Dadar'],        'Bandra W': ['Kurla','Sion'],           'Kurla': ['JVLR'],                   'Sion': ['Kurla'],                        'Andheri E': ['JVLR']             },
    'Thane':     { 'Churchgate': ['Kurla','Sion','Dadar'],            'Bandra W': ['Kurla','Sion','Mahim'],   'Kurla': ['Mulund'],                 'Sion': ['Kurla'],                        'Andheri E': ['Mulund','Kurla']   },
  },
  bypass: {
    'Borivali':  { 'Churchgate': ['Goregaon','Powai','Kurla'],  'Bandra W': ['Powai','Kurla'],  'Kurla': ['Powai'],       'Sion': ['Powai','Kurla'],   'Andheri E': ['Powai']        },
    'Goregaon':  { 'Churchgate': ['Powai','Kurla','Sion'],      'Bandra W': ['Powai','Kurla'],  'Kurla': ['Powai'],       'Sion': ['Powai','Kurla'],   'Andheri E': ['Powai']        },
    'Andheri W': { 'Churchgate': ['Kurla','Sion'],              'Bandra W': ['Kurla','Mahim'],  'Kurla': ['Powai'],       'Sion': ['Powai','Kurla'],   'Andheri E': ['Powai']        },
    'Andheri E': { 'Churchgate': ['Powai','Kurla','Sion'],      'Bandra W': ['Powai','Sion'],   'Kurla': ['Powai'],       'Sion': ['Powai'],           'Andheri E': []               },
    'Powai':     { 'Churchgate': ['Thane','Kurla','Sion'],      'Bandra W': ['Thane','Sion'],   'Kurla': ['Thane'],       'Sion': ['Thane','Kurla'],   'Andheri E': ['Thane']        },
    'Thane':     { 'Churchgate': ['Andheri E','Kurla','Sion'],  'Bandra W': ['Andheri E','Sion'], 'Kurla': ['Andheri E'],'Sion': ['Andheri E'],       'Andheri E': ['Mulund']       },
  },
};

// ── Dynamic route calculator ─────────────────────────────────────────────────
export function getRoutesForTrip(from, to) {
  const baseKm  = TRIP_BASE_KM[from]?.[to] ?? 25;
  const PER_KM  = 8;  // ₹8 per km base fare

  // Express Highway  — shorter, fastest, has toll
  const hwyKm   = baseKm;
  const hwyTime = Math.round(hwyKm * 1.1);
  const hwyBase = Math.round(hwyKm * PER_KM);
  const hwyToll = hwyKm >= 20 ? 60 : hwyKm >= 10 ? 30 : 0;
  const hwyMid  = ROUTE_STOPS.highway[from]?.[to] ?? [];

  // City Road  — longer, slowest, toll-free
  const cityKm   = Math.round(hwyKm * 1.22);
  const cityTime = Math.round(hwyKm * 1.85);
  const cityBase = Math.round(cityKm * PER_KM);
  const cityMid  = ROUTE_STOPS.city[from]?.[to] ?? [];

  // Bypass  — medium distance, medium speed, small toll
  const bypassKm   = Math.round(hwyKm * 1.38);
  const bypassTime = Math.round(hwyKm * 1.45);
  const bypassBase = Math.round(bypassKm * PER_KM);
  const bypassToll = hwyKm >= 20 ? 30 : hwyKm >= 10 ? 15 : 0;
  const bypassMid  = ROUTE_STOPS.bypass[from]?.[to] ?? [];

  return [
    {
      id: 'tr1', name: 'Express Highway', color: '#27ae60',
      stops: [from, ...hwyMid, to],
      distance: `${hwyKm} km`, time: `${hwyTime} min`,
      baseFare: hwyBase, toll: hwyToll, total: hwyBase + hwyToll,
    },
    {
      id: 'tr2', name: 'City Road', color: '#e67e22',
      stops: [from, ...cityMid, to],
      distance: `${cityKm} km`, time: `${cityTime} min`,
      baseFare: cityBase, toll: 0, total: cityBase,
    },
    {
      id: 'tr3', name: 'Bypass Route', color: '#8e44ad',
      stops: [from, ...bypassMid, to],
      distance: `${bypassKm} km`, time: `${bypassTime} min`,
      baseFare: bypassBase, toll: bypassToll, total: bypassBase + bypassToll,
    },
  ];
}

// Keep static export for backward compatibility
export const TOLL_ROUTES = getRoutesForTrip('Thane', 'Churchgate');

export const PASSENGER_LOCATIONS = [
  { name: 'Priya Sharma',  area: 'Andheri East', lat: '19.1136° N', lng: '72.8697° E', latNum: 19.1136, lngNum: 72.8697, status: 'Ready',   gender: 'female', mapX: 270, mapY: 215 },
  { name: 'Aman Trivedi',  area: 'Bandra West',  lat: '19.0596° N', lng: '72.8295° E', latNum: 19.0596, lngNum: 72.8295, status: 'Waiting', gender: 'male',   mapX: 110, mapY: 310 },
  { name: 'Raj Malhotra',  area: 'Kurla',        lat: '19.0760° N', lng: '72.8777° E', latNum: 19.0760, lngNum: 72.8777, status: 'Ready',   gender: 'male',   mapX: 290, mapY: 305 },
  { name: 'Sia Kapoor',    area: 'Andheri West', lat: '19.1197° N', lng: '72.8468° E', latNum: 19.1197, lngNum: 72.8468, status: 'Away',    gender: 'female', mapX: 130, mapY: 220 },
  { name: 'Dev Nair',      area: 'Goregaon',     lat: '19.1655° N', lng: '72.8491° E', latNum: 19.1655, lngNum: 72.8491, status: 'Ready',   gender: 'male',   mapX: 190, mapY: 140 },
  { name: 'Maya Joshi',    area: 'Churchgate',   lat: '19.0221° N', lng: '72.8561° E', latNum: 19.0221, lngNum: 72.8561, status: 'Waiting', gender: 'female', mapX:  90, mapY: 435 },
  { name: 'Karan Shah',    area: 'Thane',        lat: '19.2183° N', lng: '72.9781° E', latNum: 19.2183, lngNum: 72.9781, status: 'Ready',   gender: 'male',   mapX: 460, mapY: 290 },
  { name: 'Nisha Gupta',   area: 'Borivali',     lat: '19.2082° N', lng: '72.8573° E', latNum: 19.2082, lngNum: 72.8573, status: 'Away',    gender: 'female', mapX: 180, mapY: 60  },
];



export const PICKUP_SEQUENCE = [
  { step: 1, passenger: 'Priya Sharma',  location: 'Andheri East', eta: '8 min'  },
  { step: 2, passenger: 'Raj Malhotra',  location: 'Kurla',        eta: '14 min' },
  { step: 3, passenger: 'Aman Trivedi',  location: 'Bandra West',  eta: '22 min' },
  { step: 4, passenger: 'Maya Joshi',    location: 'Churchgate',   eta: '32 min' },
];

export const BADGES_CONFIG = [
  { id: 'first_ride',   label: 'First Ride',   icon: '🚗', desc: 'Complete your first carpool', earned: true  },
  { id: 'eco_warrior',  label: 'Eco Warrior',  icon: '🌱', desc: 'Save 10 kg of CO₂',          earned: true  },
  { id: 'social_star',  label: 'Social Star',  icon: '⭐', desc: 'Ride with 5 different people', earned: false },
  { id: 'money_saver',  label: 'Money Saver',  icon: '💰', desc: 'Save ₹500 through carpooling', earned: true  },
  { id: 'loyal_rider',  label: 'Loyal Rider',  icon: '🏅', desc: '10 days of carpooling',        earned: false },
  { id: 'route_master', label: 'Route Master', icon: '🗺️', desc: 'Plan 5 pickup routes',         earned: false },
];
