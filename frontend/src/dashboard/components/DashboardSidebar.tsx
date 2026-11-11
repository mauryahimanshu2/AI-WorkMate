import type { User } from '../../auth/types/auth.types';
import { Brand } from '../../landing/components/Brand';

interface DashboardSidebarProps {
  user: User;
  activePage: 'dashboard' | 'studio' | 'content';
  isOpen: boolean;
  isSigningOut: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const navigation = [
  { id: 'dashboard', icon: '⌂', label: 'Overview', href: '/dashboard' },
  { id: 'studio', icon: '✦', label: 'Create content', href: '/studio' },
  { id: 'content', icon: '▤', label: 'My content', href: '/content' },
] as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function DashboardSidebar({
  user,
  activePage,
  isOpen,
  isSigningOut,
  onClose,
  onSignOut,
}: DashboardSidebarProps) {
  return (
    <>
      <button
        className={`dashboard-overlay ${isOpen ? 'dashboard-overlay--visible' : ''}`}
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className={`dashboard-sidebar ${isOpen ? 'dashboard-sidebar--open' : ''}`}>
        <div className="dashboard-sidebar__brand">
          <Brand href="/dashboard" />
          <button type="button" aria-label="Close navigation" onClick={onClose}>×</button>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <span className="dashboard-nav__label">Workspace</span>
          {navigation.map((item) => (
            <a
              className={item.id === activePage ? 'dashboard-nav__item dashboard-nav__item--active' : 'dashboard-nav__item'}
              href={item.href}
              key={item.label}
              onClick={onClose}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </a>
          ))}
          {user.role === 'admin' && (
            <>
              <span className="dashboard-nav__label dashboard-nav__label--admin">Administration</span>
              <a className="dashboard-nav__item dashboard-nav__item--admin" href="/admin" onClick={onClose}>
                <span aria-hidden="true">A</span>
                Admin workspace
              </a>
            </>
          )}
        </nav>

        <div className="dashboard-sidebar__tip">
          <span aria-hidden="true">✦</span>
          <strong>Writing tip</strong>
          <p>Add a clear audience and purpose to get a more focused first draft.</p>
        </div>

        <div className="dashboard-user">
          <div className="dashboard-user__profile">
            <span className="dashboard-user__avatar">{getInitials(user.name)}</span>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button
            className="dashboard-user__logout"
            type="button"
            disabled={isSigningOut}
            onClick={onSignOut}
          >
            {isSigningOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </aside>
    </>
  );
}
