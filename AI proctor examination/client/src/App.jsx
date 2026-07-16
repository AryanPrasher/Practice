import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TestTaking from './pages/TestTaking';
import TestReport from './pages/TestReport';
import Leaderboard from './pages/Leaderboard';
import ContentCreator from './pages/ContentCreator';
import AdminDashboard from './pages/AdminDashboard';
import AdminReview from './pages/AdminReview';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          
          <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Shared Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/report/:sessionId" element={
                <ProtectedRoute>
                  <TestReport />
                </ProtectedRoute>
              } />
              
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />

              {/* Candidate Test Taking Route */}
              <Route path="/test-taking/:testSeriesId" element={
                <ProtectedRoute allowedRoles={['test-taker', 'admin']}>
                  <TestTaking />
                </ProtectedRoute>
              } />

              {/* Content Creator Routes */}
              <Route path="/creator" element={
                <ProtectedRoute allowedRoles={['content-creator', 'admin']}>
                  <ContentCreator />
                </ProtectedRoute>
              } />

              {/* System Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/review" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReview />
                </ProtectedRoute>
              } />

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
