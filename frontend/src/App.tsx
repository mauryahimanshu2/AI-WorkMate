import { LandingPage } from './landing/pages/LandingPage';
import { SignInPage } from './auth/pages/SignInPage';
import { SignUpPage } from './auth/pages/SignUpPage';

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/signin' || path === '/login') {
    return <SignInPage />;
  }

  if (path === '/signup' || path === '/register') {
    return <SignUpPage />;
  }

  return <LandingPage />;
}

export default App;

