<div align="center">

# 🚗 CarpoolFlow

### Smart Ride-Sharing Platform — React.js Final Project

**Semester II · Bhavika Khabya**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![React Router](https://img.shields.io/badge/React_Router-7.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com)

</div>

---

## 📖 Project Description

**CarpoolFlow** is a full-featured smart ride-sharing web application built as a React.js semester final project. It demonstrates real-world application of core React concepts including Hooks, Context API, reducers, memoisation, lazy loading, and persistent state — all wrapped in a premium, dark-themed UI with glass-morphism design.

The app allows users to book rides, manage a FIFO request queue, track price changes with undo history, analyse eco impact, earn reward points, and find passengers on an interactive map — all with **live, cross-page data synchronisation** via a shared context store.

---

## 🧑‍💻 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19.2 (with JSX) |
| **Build Tool** | Vite 8.0 |
| **Routing** | React Router DOM 7.0 |
| **Animations** | Framer Motion 12.4 |
| **Icons** | Lucide React |
| **Styling** | CSS Modules + Vanilla CSS (no Tailwind) |
| **State** | Context API + useReducer |
| **Persistence** | localStorage (via useEffect) |
| **Font** | Plus Jakarta Sans (Google Fonts) |
| **Linting** | ESLint + React Hooks Plugin |

---

## ✨ Features

### 🔐 Authentication
- Login & Register pages with form validation
- Auth state persisted in `localStorage` via `AuthContext`
- Protected routes — unauthenticated users are redirected to `/login`

### 📊 Dashboard
- Time-aware greeting (`Good morning / afternoon / evening`)
- Live stats grid: Total Rides, Available Drivers, Pending Requests, Money Saved, Active Carpools, Reward Points
- Available Drivers fetched from a live API (`dummyjson.com`) using `useEffect`
- Recent Activity feed
- Quick-action cards for every major feature

### 🗂️ Ride History
- Full history of all past rides (including rides booked via Queue)
- Search & filter by route or driver (`useMemo`)
- Stats banner: total spent, km travelled, drivers used
- Delete individual rides (dispatches to global reducer)

### 💰 Price Change Log
- Set the current ride fare with instant validation
- **Stack-based undo** — revert to any previous price
- Price timeline visualised with top-of-stack indicator
- Trend badge showing the change delta (+/−)

### 🚦 Ride Queue
- **FIFO Queue** — enqueue passengers, process them in order
- Processing a ride automatically:
  - ✅ Adds the ride to **Ride History**
  - ⭐ Awards **+80 Reward Points**
  - 🌱 Records **+2.4 kg CO₂** saved
  - 📈 Updates today's slot in the **Eco Score chart**
- Live stats bar showing current points and CO₂ saved
- Toast notification on every processed ride

### 📍 Location Finder
- Custom SVG city map with animated nodes
- Passenger markers (👧 / 👦) with name labels at real positions
- Click a node to see nearby passengers

### 🗺️ City Map
- Interactive SVG map with selectable source/destination nodes
- Highlights shortest path between any two stops
- Route summary with estimated fare and distance

### 🌱 Eco Score
- CO₂ saved, fuel saved, cars off road, tree equivalents — all from `useMemo`
- **Live weekly bar chart** — updates today's bar each time a ride is processed
- Eco grade (B / B+ / A / A+) based on total ride count
- Progress bar toward Platinum Eco status

### 🏆 Rewards
- Points balance from global state
- Redeemable reward tiers with progress tracking

### 👤 Profile
- Edit name, email, mobile, and role
- Stats: total rides, points, level
- Activity tab with live data (points, CO₂, queue rides)
- Inline colour-coded timeline dots

### 🪑 Seat Sorter
- Drag-and-drop style seat assignment UI
- Allocates passengers to available seats

### 🅿️ Pickup Planner & Toll Planner
- Route planning utilities with stop management

---

## 🪝 React Concepts Demonstrated

| Hook / Concept | Where Used |
|---|---|
| `useState` | Forms, toggles, local UI state across all pages |
| `useEffect` | API fetch in Dashboard, localStorage sync in RideContext |
| `useMemo` | Filtered rides in RideHistory, eco stats in EcoScore |
| `useReducer` | `RideContext` — manages rides, queue, price, points, eco data |
| `useContext` | `useRide()`, `useAuth()`, `useTheme()` custom hooks |
| `useCallback` | Event handlers in Dashboard driver list |
| `React.memo` | Driver card component in Dashboard |
| `React.lazy` + `Suspense` | All 14 pages are code-split |
| `AnimatePresence` | Page transitions, list enter/exit animations |
| `localStorage` | Auth state + entire ride state persisted across sessions |
| CSS Modules | Scoped styles for every page and component |

---

## 📁 Project Structure

```
react_finalproject/
├── public/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Layout.jsx          # App shell with sidebar + footer
│   │       ├── Layout.module.css
│   │       ├── Sidebar.jsx         # Collapsible navigation sidebar
│   │       ├── Sidebar.module.css
│   │       ├── BottomNav.jsx       # Mobile bottom navigation
│   │       └── ProtectedRoute.jsx  # Auth guard
│   ├── context/
│   │   ├── AuthContext.jsx         # Login / Register / user state
│   │   ├── RideContext.jsx         # Core reducer (rides, queue, price, points, eco)
│   │   └── ThemeContext.jsx        # Sidebar collapse state
│   ├── hooks/
│   │   └── useLocalStorage.js      # Generic localStorage hook
│   ├── pages/
│   │   ├── Login.jsx / .module.css
│   │   ├── Register.jsx / .module.css
│   │   ├── Dashboard.jsx / .module.css
│   │   ├── RideHistory.jsx / .module.css
│   │   ├── PriceChangeLog.jsx / .module.css
│   │   ├── RideQueue.jsx / .module.css
│   │   ├── LocationFinder.jsx / .module.css
│   │   ├── SeatSorter.jsx / .module.css
│   │   ├── CityMap.jsx / .module.css
│   │   ├── PickupPlanner.jsx / .module.css
│   │   ├── TollPlanner.jsx / .module.css
│   │   ├── EcoScore.jsx / .module.css
│   │   ├── Rewards.jsx / .module.css
│   │   └── Profile.jsx / .module.css
│   ├── styles/
│   │   └── global.css              # Design tokens, glass-card, buttons, inputs
│   ├── utils/
│   │   └── mockData.js             # Map nodes, edges, mock passengers
│   ├── App.jsx                     # Router + lazy-loaded routes
│   └── main.jsx                    # React DOM entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---
---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** ≥ 18.0 ([download](https://nodejs.org))
- **npm** ≥ 9.0 (comes with Node)
- Any modern browser (Chrome, Firefox, Edge, Safari)

### 1. Clone the Repository

```bash
git clone https://github.com/bhavikakhabya/React-Final-Project.git
cd react_finalproject
```

### 2. Install Dependencies

```bash
npm install
```

This installs React, Vite, Framer Motion, React Router, Lucide React, and all dev tools.

### 3. Start the Development Server

```bash
npm run dev
```

The app will start at **http://localhost:5173** (or `5174` if that port is in use).

### 4. Log In

Use the demo credentials on the login screen:

```
Email:    demo@carpoolflow.com
Password: demo123
```

Or click **"Create Account"** to register a new user.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local dev server with hot-reload |
| `npm run build` | Build production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

---

## 🌐 Live Demo

> 🔗 **https://reactfinalproject-gamma.vercel.app** 

---

## 🔄 Data Flow

```
User action (e.g. "Process Next" in Ride Queue)
        │
        ▼
dispatch({ type: 'PROCESS_REQUEST' })
        │
        ▼
rideReducer updates:
  ├── rides[]            → Ride History updates
  ├── points + 80        → Rewards & Profile update
  ├── totalCo2Saved      → Eco Score updates
  ├── weeklyEco[today]   → Bar chart updates
  └── completedRides++   → Activity tab updates
        │
        ▼
useEffect persists new state → localStorage
        │
        ▼
All consuming components re-render instantly via useContext
```

---

## 🧪 Testing the Live Data Flow

1. Go to **Ride Queue** (`/queue`)
2. Add a request: name → pickup → drop → **Enqueue Request**
3. Click **Process Next**
4. Observe the green toast: *"✅ Ride saved! +80 pts • +2.4 kg CO₂ tracked"*
5. Navigate to **Ride History** → the ride appears at the top
6. Navigate to **Eco Score** → today's bar has grown
7. Navigate to **Profile → Activity** → points and ride count updated
8. Refresh the page → all data persists from `localStorage`

---

## 🙋‍♀️ Author

**Bhavika Khabya**  
Semester II Final Project — React.js  
[GitHub Profile](https://github.com/bhavikakhabya)

---

<div align="center">

Made with ❤️ and React · © 2026 CarpoolFlow

</div>
