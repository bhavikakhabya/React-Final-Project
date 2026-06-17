<div align="center">

# 🚗 CarpoolFlow

### Smart Ride-Sharing Platform 


</div>

---

## 📖 Project Description

**CarpoolFlow** is a full-featured smart ride-sharing web application built as a React.js semester final project. It demonstrates real-world application of core React concepts including Hooks, Context API, reducers, memoisation, lazy loading, and persistent state — all wrapped in a premium, dark-themed UI with glass-morphism design.

---

## 🧑‍💻 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | React 19.2 (with JSX) |
| **Build Tool** | Vite 8.0 |
| **Routing** | React Router DOM 7.0 |
| **Styling** | CSS Modules + Vanilla CSS (no Tailwind) |

---

## ✨ Features

### 🔐 Authentication
- Login & Register pages with form validation
- Auth state persisted in `localStorage` via `AuthContext`
- Protected routes — unauthenticated users are redirected to `/login`

### 📊 Dashboard
- Time-aware greeting (`Good morning / afternoon / evening`)
- Live stats grid: Total Rides, Available Drivers, Pending Requests, Money Saved, Active Carpools, Reward Points
- **All 6 stat cards are now interactive:**
  - 🚗 **Total Rides** → navigates to Ride History
  - 👥 **Available Drivers** → navigates to Location Finder
  - ⏰ **Pending Requests** → expands inline approve/reject panel (count updates live)
  - 💰 **Money Saved** → navigates to Price Log
  - 🏎️ **Active Carpools** → expands inline live carpools panel
  - 🏆 **Reward Points** → navigates to Rewards

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

### 🗺️ Pickup Planner
- Route planning utility with stop management
- Now accessible from the sidebar navigation

### 💵 Toll Cost Planner *(updated — now fully dynamic)*
- **Smart route comparison** across 3 route types per trip:
  - 🟢 **Express Highway** — shortest distance, fastest, paid toll (₹30–₹60 based on distance)
  - 🟠 **City Road** — longer, slowest, completely toll-free
  - 🟣 **Bypass Route** — medium distance, medium speed, small toll (₹15–₹30)

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

---

## 🌐 Live Demo

> 🔗 ** https://carpool-flow.netlify.app ** 

---

Semester II Final Project — React.js  
[GitHub Profile](https://github.com/bhavikakhabya)

---
