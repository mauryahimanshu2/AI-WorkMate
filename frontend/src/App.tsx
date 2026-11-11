import { LandingPage } from './landing/pages/LandingPage';
import { SignInPage } from './auth/pages/SignInPage';
import { SignUpPage } from './auth/pages/SignUpPage';
import { DashboardPage } from './dashboard/pages/DashboardPage';
import { ContentDetailPage } from './content/pages/ContentDetailPage';
import { ContentHistoryPage } from './content/pages/ContentHistoryPage';
import { ContentStudioPage } from './content/pages/ContentStudioPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/signin' || path === '/login') {
    return <SignInPage />;
  }

  if (path === '/signup' || path === '/register') {
    return <SignUpPage />;
  }

  if (path === '/dashboard') {
    return <DashboardPage />;
  }

  if (path === '/admin') {
    return <AdminDashboardPage />;
  }

  if (path === '/studio') {
    return <ContentStudioPage />;
  }

  if (path === '/content') {
    return <ContentHistoryPage />;
  }

  const contentMatch = path.match(/^\/content\/([^/]+)$/);
  if (contentMatch) {
    return <ContentDetailPage contentId={decodeURIComponent(contentMatch[1])} />;
  }

  return <LandingPage />;
}

export default App;

