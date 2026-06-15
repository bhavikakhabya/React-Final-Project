import { createContext, useContext, useReducer, useEffect } from 'react';

const RideContext = createContext(null);

// ── Reducer ──────────────────────────────────────────────────
function rideReducer(state, action) {
  switch (action.type) {
    case 'SET_RIDES':
      return { ...state, rides: action.payload };

    case 'ADD_TO_QUEUE':
      return { ...state, requestQueue: [...state.requestQueue, action.payload] };

    case 'PROCESS_REQUEST': {
      const [, ...rest] = state.requestQueue;
      const processed = state.requestQueue[0];
      return {
        ...state,
        requestQueue: rest,
        processedRequests: processed
          ? [processed, ...state.processedRequests]
          : state.processedRequests,
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

function getInitialState() {
  try {
    const saved = localStorage.getItem('cf_ride_state');
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    rides: [],
    requestQueue: [],
    processedRequests: [],
    points: 1240,
    currentPrice: 120,
    priceHistory: [120],
  };
}

export function RideProvider({ children }) {
  const [state, dispatch] = useReducer(rideReducer, undefined, getInitialState);

  // Persist ride state
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
