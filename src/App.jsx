import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RideProvider } from './context/RideContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import './styles/global.css';

// ── Lazy-loaded pages (code splitting) ─────────────────────
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const RideHistory   = lazy(() => import('./pages/RideHistory'));
const PriceChangeLog= lazy(() => import('./pages/PriceChangeLog'));
const RideQueue     = lazy(() => import('./pages/RideQueue'));
const LocationFinder= lazy(() => import('./pages/LocationFinder'));
const SeatSorter    = lazy(() => import('./pages/SeatSorter'));
const CityMap       = lazy(() => import('./pages/CityMap'));
const PickupPlanner = lazy(() => import('./pages/PickupPlanner'));
const TollPlanner   = lazy(() => import('./pages/TollPlanner'));
const EcoScore      = lazy(() => import('./pages/EcoScore'));
const Rewards       = lazy(() => import('./pages/Rewards'));
const Profile       = lazy(() => import('./pages/Profile'));

// ── Loading Fallback ────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(82,43,91,0.2)',
        borderTopColor: '#522B5B', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#854F6C', fontSize: '0.88rem' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RideProvider>
          <ThemeProvider>
            <div className="app-bg">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login"    element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes — wrapped in Layout */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard"       element={<Dashboard />} />
                    <Route path="/history"         element={<RideHistory />} />
                    <Route path="/price-log"       element={<PriceChangeLog />} />
                    <Route path="/queue"           element={<RideQueue />} />
                    <Route path="/location-finder" element={<LocationFinder />} />
                    <Route path="/seat-sorter"     element={<SeatSorter />} />
                    <Route path="/city-map"        element={<CityMap />} />
                    <Route path="/pickup-planner"  element={<PickupPlanner />} />
                    <Route path="/toll-planner"    element={<TollPlanner />} />
                    <Route path="/eco-score"       element={<EcoScore />} />
                    <Route path="/rewards"         element={<Rewards />} />
                    <Route path="/profile"         element={<Profile />} />
                  </Route>

                  {/* Default redirect */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </div>
          </ThemeProvider>
        </RideProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
