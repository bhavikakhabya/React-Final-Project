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

export const TOLL_ROUTES = [
  {
    id: 'tr1', name: 'Express Highway', color: '#27ae60',
    stops: ['Thane', 'Powai', 'Andheri E', 'Churchgate'],
    distance: '32 km', time: '45 min', baseFare: 280, toll: 60, total: 340,
  },
  {
    id: 'tr2', name: 'City Road', color: '#e67e22',
    stops: ['Thane', 'Kurla', 'Bandra W', 'Churchgate'],
    distance: '38 km', time: '65 min', baseFare: 310, toll: 0, total: 310,
  },
  {
    id: 'tr3', name: 'Bypass Route', color: '#8e44ad',
    stops: ['Thane', 'Powai', 'Kurla', 'Sion', 'Churchgate'],
    distance: '42 km', time: '55 min', baseFare: 340, toll: 30, total: 370,
  },
];

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
