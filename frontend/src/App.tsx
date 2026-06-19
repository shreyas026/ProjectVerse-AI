import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Student Pages
import StudentDashboard from './pages/student/DashboardPage';
import ProfilePage from './pages/student/ProfilePage';
import AchievementsPage from './pages/student/AchievementsPage';
import ProjectsPage from './pages/student/ProjectsPage';
import EduAIPage from './pages/ai/EduAIPage';
import ProjectValidatorPage from './pages/ai/ProjectValidatorPage';
import QualityCheckerPage from './pages/ai/QualityCheckerPage';
import OriginalityCheckerPage from './pages/ai/OriginalityCheckerPage';
import TeamsPage from './pages/teams/TeamsPage';
import WorkspacePage from './pages/teams/WorkspacePage';
import SettingsPage from './pages/SettingsPage';

// Faculty Pages
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Public Showcase Pages
import ShowcasePage from './pages/showcase/ShowcasePage';
import ShowcaseDetailPage from './pages/showcase/ShowcaseDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(99,102,241,0.2)' } }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Student Portal */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/edu-ai" element={<EduAIPage />} />
            <Route path="/validate" element={<ProjectValidatorPage />} />
            <Route path="/quality-checker" element={<QualityCheckerPage />} />
            <Route path="/originality" element={<OriginalityCheckerPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id/workspace" element={<WorkspacePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Public Showcase browse inside layout */}
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/showcases/:id" element={<ShowcaseDetailPage />} />

            {/* Faculty Portal */}
            <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
              <Route path="/faculty/projects" element={<FacultyDashboardPage />} />
              <Route path="/faculty/students" element={<FacultyDashboardPage />} />
              <Route path="/faculty/analyze" element={<FacultyDashboardPage />} />
            </Route>

            {/* Admin Portal */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminDashboardPage />} />
              <Route path="/admin/projects" element={<AdminDashboardPage />} />
              <Route path="/admin/analytics" element={<AdminDashboardPage />} />
              <Route path="/admin/settings" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
