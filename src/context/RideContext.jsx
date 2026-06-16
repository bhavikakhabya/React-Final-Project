import { createContext, useContext, useReducer, useEffect } from 'react';

const RideContext = createContext(null);

// ── Helpers ───────────────────────────────────────────────────
function randomDistance() {
  return (4 + Math.random() * 18).toFixed(1) + ' km';
}
function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

// ── Reducer ──────────────────────────────────────────────────
function rideReducer(state, action) {
  switch (action.type) {
    case 'SET_RIDES':
      return { ...state, rides: action.payload };

    case 'ADD_TO_QUEUE':
      return { ...state, requestQueue: [...state.requestQueue, action.payload] };

    // When a queued request is processed → add it to ride history,
    // award 80 reward points, and record the eco contribution
    case 'PROCESS_REQUEST': {
      if (!state.requestQueue.length) return state;
      const [completed, ...rest] = state.requestQueue;
      const fare      = state.currentPrice;
      const myShare   = Math.round(fare / 2);
      const distance  = randomDistance();
      const newRide   = {
        id:         `ride_${Date.now()}`,
        from:       completed.from,
        to:         completed.to,
        driver:     completed.name,          // the person who requested becomes the "driver" label
        passengers: ['You', completed.name],
        fare,
        myShare,
        date:       todayDate(),
        distance,
      };
      const POINTS_PER_RIDE = 80;
      const CO2_PER_RIDE    = 2.4;
      return {
        ...state,
        requestQueue:      rest,
        processedRequests: [completed, ...state.processedRequests],
        rides:             [newRide, ...state.rides],
        points:            state.points + POINTS_PER_RIDE,
        totalCo2Saved:     +(( (state.totalCo2Saved || 0) + CO2_PER_RIDE ).toFixed(1)),
        completedRides:    (state.completedRides || 0) + 1,
        // weekly eco: update today's slot
        weeklyEco:         updateWeeklyEco(state.weeklyEco || defaultWeekly(), CO2_PER_RIDE),
      };
    }

    case 'CLEAR_QUEUE':
      return { ...state, requestQueue: [] };

    case 'DELETE_RIDE':
      return { ...state, rides: state.rides.filter(r => r.id !== action.payload) };

    case 'ADD_POINTS':
      return { ...state, points: state.points + action.payload };

    case 'SET_PRICE':
      return {
        ...state,
        currentPrice: action.payload,
        priceHistory: [action.payload, ...state.priceHistory],
      };

    case 'UNDO_PRICE': {
      if (state.priceHistory.length < 2) return state;
      const [, ...rest] = state.priceHistory;
      return { ...state, currentPrice: rest[0], priceHistory: rest };
    }

    case 'RESET_PRICE_HISTORY':
      return { ...state, priceHistory: [state.currentPrice] };

    default:
      return state;
  }
}

// ── Weekly eco data helpers ────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function defaultWeekly() {
  return DAYS.map(day => ({ day, co2: 0 }));
}
function updateWeeklyEco(weekly, amount) {
  const todayIdx = new Date().getDay(); // 0=Sun … 6=Sat
  return weekly.map((entry, i) =>
    i === todayIdx ? { ...entry, co2: +(entry.co2 + amount).toFixed(1) } : entry
  );
}

// ── Initial state ─────────────────────────────────────────────
const SEED_WEEKLY = [
  { day: 'Sun', co2: 0   },
  { day: 'Mon', co2: 2.4 },
  { day: 'Tue', co2: 4.8 },
  { day: 'Wed', co2: 1.2 },
  { day: 'Thu', co2: 6.0 },
  { day: 'Fri', co2: 4.8 },
  { day: 'Sat', co2: 2.4 },
];

function getInitialState() {
  try {
    const saved = localStorage.getItem('cf_ride_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate: ensure new fields exist in saved state
      return {
        ...parsed,
        totalCo2Saved:  parsed.totalCo2Saved  ?? 0,
        completedRides: parsed.completedRides ?? 0,
        weeklyEco:      parsed.weeklyEco      ?? SEED_WEEKLY,
      };
    }
  } catch {}
  return {
    rides:            [],
    requestQueue:     [],
    processedRequests:[],
    points:           1240,
    currentPrice:     120,
    priceHistory:     [120],
    totalCo2Saved:    0,
    completedRides:   0,
    weeklyEco:        SEED_WEEKLY,
  };
}

export function RideProvider({ children }) {
  const [state, dispatch] = useReducer(rideReducer, undefined, getInitialState);

  // Persist every state change to localStorage
  useEffect(() => {
    localStorage.setItem('cf_ride_state', JSON.stringify(state));
  }, [state]);

  return (
    <RideContext.Provider value={{ state, dispatch }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  return useContext(RideContext);
}
