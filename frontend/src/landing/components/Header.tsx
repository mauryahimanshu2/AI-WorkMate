import { useState } from 'react';

import { getStoredUser, hasStoredSession } from '../../auth/services/authApi';
import { Brand } from './Brand';

const navigation = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Content types', href: '#content-types' },
  { label: 'Features', href: '#features' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSignedIn = hasStoredSession();
  const user = getStoredUser();
  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header" id="top">
      <div className="container header__inner">
        <Brand />

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`navigation ${isMenuOpen ? 'navigation--open' : ''}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <div className="navigation__links">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="navigation__auth">
            {isSignedIn ? (
              <a className="button button--small" href={dashboardHref} onClick={closeMenu}>{user?.role === 'admin' ? 'Admin dashboard' : 'Dashboard'}</a>
            ) : (
              <>
                <a className="navigation__signin" href="/signin" onClick={closeMenu}>Sign in</a>
                <a className="button button--small" href="/signup" onClick={closeMenu}>Get started</a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
