import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import Trends from './pages/Trends';
import Login from './pages/Login';
import Register from './pages/Register';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import Tips from './pages/Tips';
import Globe from './pages/Globe';
import Profile from './pages/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Standalone pages — no Layout wrapper */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All other pages use Layout (navbar, sidebar, footer) */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="heatmap" element={
                <ProtectedRoute>
                  <Heatmap />
                </ProtectedRoute>
              } />
              <Route path="trends" element={
                <ProtectedRoute>
                  <Trends />
                </ProtectedRoute>
              } />
              <Route path="tips" element={
                <ProtectedRoute>
                  <Tips />
                </ProtectedRoute>
              } />
              <Route path="globe" element={
                <ProtectedRoute>
                  <Globe />
                </ProtectedRoute>
              } />

              {/* Protected Routes */}
              <Route path="alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />

              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
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