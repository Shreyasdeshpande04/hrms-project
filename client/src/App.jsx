import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Public Pages
import LandingPage from './pages/Home/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Candidate Pages
import JobPortal from './features/candidate/JobPortal';
import MyApplications from './features/candidate/MyApplications';
import ResumeBuilder from './pages/CandidatePortal/ResumeBuilder';
import Profile from './pages/CandidatePortal/Profile';

// HR Pages
import HRDashboard from './pages/HRDashboard/HRDashboard';
import HRAnalytics from './pages/HRDashboard/HRAnalytics';
import Interviews from './pages/HRDashboard/Interviews';
import JobManagement from './features/jobs/JobManagement';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserManagement from './features/admin/UserManagement';
import DepartmentManagement from './features/admin/DepartmentManagement';
import SystemLogs from './features/admin/SystemLogs';

// Protected Route Shield
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userInfo } = useStore();
  
  if (!userInfo) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { userInfo, logout } = useStore();

  return (
    <BrowserRouter>
      {/* Top Navigation */}
      <Navbar />
      
      <div style={{ display: 'flex' }}>
        {/* Sidebar only appears for logged-in users */}
        {userInfo && <Sidebar role={userInfo.role} />}
        
        <main style={{ 
          flex: 1, 
          padding: '0', 
          marginLeft: userInfo ? '260px' : '0', 
          backgroundColor: 'var(--bg-main)', 
          minHeight: 'calc(100vh - 85px)' 
        }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobPortal />} />

            {/* CANDIDATE PROTECTED ROUTES */}
            <Route path="/candidate/applications" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <MyApplications />
              </ProtectedRoute>
            } />
            <Route path="/candidate/resume" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <ResumeBuilder />
              </ProtectedRoute>
            } />
            <Route path="/candidate/profile" element={
              <ProtectedRoute allowedRoles={['CANDIDATE']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* HR PROTECTED ROUTES */}
            <Route path="/hr/pipeline" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <HRDashboard />
              </ProtectedRoute>
            } />
            <Route path="/hr/jobs" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <JobManagement />
              </ProtectedRoute>
            } />
            <Route path="/hr/interviews" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <Interviews />
              </ProtectedRoute>
            } />
            <Route path="/hr/analytics" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <HRAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/hr/profile" element={
              <ProtectedRoute allowedRoles={['HR']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* ADMIN PROTECTED ROUTES */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DepartmentManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/logs" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SystemLogs />
              </ProtectedRoute>
            } />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;