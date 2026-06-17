import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsListPage } from '@/pages/projects/ProjectsListPage';
import { ProjectDetailPage } from '@/pages/projects/ProjectDetailPage';
import { CreateProjectPage } from '@/pages/projects/CreateProjectPage';
import { TeamsListPage } from '@/pages/teams/TeamsListPage';
import { EventsListPage } from '@/pages/events/EventsListPage';
import { EventDetailPage } from '@/pages/events/EventDetailPage';
import { MessagesPage } from '@/pages/messaging/MessagesPage';
import { AIMentorPage } from '@/pages/ai/AIMentorPage';
import { AICoFounderPage } from '@/pages/ai/AICoFounderPage';
import { AIChatbotPage } from '@/pages/ai/AIChatbotPage';
import { CodingArenaPage } from '@/pages/coding/CodingArenaPage';
import { ChallengePage } from '@/pages/coding/ChallengePage';
import { LeaderboardPage } from '@/pages/coding/LeaderboardPage';
import { CompaniesListPage } from '@/pages/company/CompaniesListPage';
import { JobPostingsPage } from '@/pages/company/JobPostingsPage';
import { ResearchHubPage } from '@/pages/faculty/ResearchHubPage';
import { StartupHubPage } from '@/pages/startup/StartupHubPage';
import { AlumniNetworkPage } from '@/pages/alumni/AlumniNetworkPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { MyProfilePage } from '@/pages/profile/MyProfilePage';
import { WorkspacePage } from '@/pages/workspace/WorkspacePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main App Routes (Protected) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />

          {/* Teams */}
          <Route path="/teams" element={<TeamsListPage />} />

          {/* Events */}
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* Messaging */}
          <Route path="/messages" element={<MessagesPage />} />

          {/* AI */}
          <Route path="/ai/mentor" element={<AIMentorPage />} />
          <Route path="/ai/cofounder" element={<AICoFounderPage />} />
          <Route path="/ai/chatbot" element={<AIChatbotPage />} />

          {/* Coding Arena */}
          <Route path="/coding" element={<CodingArenaPage />} />
          <Route path="/coding/challenge/:id" element={<ChallengePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* Company & Jobs */}
          <Route path="/companies" element={<CompaniesListPage />} />
          <Route path="/jobs" element={<JobPostingsPage />} />

          {/* Research */}
          <Route path="/research" element={<ResearchHubPage />} />

          {/* Startups */}
          <Route path="/startups" element={<StartupHubPage />} />

          {/* Alumni */}
          <Route path="/alumni" element={<AlumniNetworkPage />} />

          {/* Analytics */}
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Profile */}
          <Route path="/profile" element={<MyProfilePage />} />

          {/* Workspace */}
          <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
