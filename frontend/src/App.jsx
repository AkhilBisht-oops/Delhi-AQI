import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import Trends from './pages/Trends';
import Login from './pages/Login';
import Register from './pages/Register';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import Tips from './pages/Tips';
import GlobeView from './pages/GlobeView';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Standalone homepage — no Layout wrapper for full-screen globe */}
            <Route path="/" element={<HomePage />} />

            {/* All other pages use Layout (navbar, sidebar, footer) */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="heatmap" element={<Heatmap />} />
              <Route path="trends" element={<Trends />} />
              <Route path="tips" element={<Tips />} />
              <Route path="globe" element={<GlobeView />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route path="alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />

              <Route path="admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;