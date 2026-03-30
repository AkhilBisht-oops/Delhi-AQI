# 🌍 Delhi-AQI Dashboard

A premium, real-time Air Quality Index (AQI) monitoring platform designed to provide actionable insights into pollution levels in Delhi and across the globe. Built with a modern tech stack focusing on performance, visual excellence, and user engagement.

[Live Demo](https://delhi-aqi-delta.vercel.app/)

## 🚀 Key Features

- **Live Real-time Monitoring**: Instant updates on PM2.5, PM10, and other key pollutants.
- **Interactive Heatmaps**: Visualize air quality across Delhi districts with high-precision maps (Leaflet & Mapbox).
- **Global Trends**: Expanded analytical capabilities to track pollution patterns for major cities worldwide.
- **3D Globe Visualization**: Interactive 3D globe to explore global AQI data.
- **Secure Authentication**: Social login integration with Google and GitHub using Passport.js.
- **Automated Data Fetching**: Cron jobs for periodic data updates from OpenWeather API.
- **Responsive Design**: Elegant and professional UI built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Context API](https://react.dev/reference/react/useContext)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Maps**: [Leaflet](https://leafletjs.com/) & [Mapbox GL](https://www.mapbox.com/mapbox-gl-js)
- **Visuals**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication**: [Passport.js](https://www.passportjs.org/) (OAuth 2.0) & [JWT](https://jwt.io/)
- **Services**: [Node-cron](https://www.npmjs.com/package/node-cron) (Scheduled jobs), [Nodemailer](https://nodemailer.com/)

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or later)
- [MongoDB](https://www.mongodb.com/community/home) (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/AkhilBisht-oops/Delhi-AQI.git
cd Delhi-AQI
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
OPENWEATHER_API_KEY=your_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
Delhi-AQI/
├── backend/
│   ├── config/      # Passport & DB configuration
│   ├── cron/        # Scheduled jobs (Data fetching)
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic (AQI services)
│   └── server.js    # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # Auth & Data contexts
│   │   ├── pages/       # Page views (Home, Heatmap, Login)
│   │   ├── utils/       # Global utilities/API calls
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## 📜 License
This project is licensed under the [ISC License](LICENSE).

---
*Created with ❤️ by Akhil Bisht*
