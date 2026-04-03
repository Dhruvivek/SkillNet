import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Lazy loading pages for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage.tsx'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage.tsx'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.tsx'));
const ExplorePage = React.lazy(() => import('./pages/ExplorePage.tsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.tsx'));
const TeamFinderPage = React.lazy(() => import('./pages/TeamFinderPage.tsx'));
const QuestionsPage = React.lazy(() => import('./pages/QuestionsPage.tsx'));
const QuestionDetailPage = React.lazy(() => import('./pages/QuestionDetailPage.tsx'));
const ChatPage = React.lazy(() => import('./pages/ChatPage.tsx'));
const AuthPage = React.lazy(() => import('./pages/AuthPage.tsx'));
const OTPPage = React.lazy(() => import('./pages/OTPPage.tsx'));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage.tsx'));
const BountiesPage = React.lazy(() => import('./pages/BountiesPage.tsx'));

const Loader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-bg-dark text-white">
    <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
  </div>
);

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark theme if no preference is saved
    if (savedTheme === 'dark' || (!savedTheme && prefersDark) || !savedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />
          
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="teams" element={<TeamFinderPage />} />
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="questions/:id" element={<QuestionDetailPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="bounties" element={<BountiesPage />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
