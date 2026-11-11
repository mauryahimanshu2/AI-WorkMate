import type { User } from '../../auth/types/auth.types';
import { Brand } from '../../landing/components/Brand';

interface AdminSidebarProps {
  user: User;
  isOpen: boolean;
  isSigningOut: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function AdminSidebar({ user, isOpen, isSigningOut, onClose, onSignOut }: AdminSidebarProps) {
  return (
    <>
      <button className={`admin-overlay ${isOpen ? 'admin-overlay--visible' : ''}`} type="button" aria-label="Close admin navigation" onClick={onClose} />
      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand"><Brand href="/admin" /><button type="button" aria-label="Close navigation" onClick={onClose}>×</button></div>
        <div className="admin-badge"><span>Admin</span>Control center</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <a className="admin-nav__item admin-nav__item--active" href="#overview" onClick={onClose}><span>⌂</span>Overview</a>
          <a className="admin-nav__item" href="#users" onClick={onClose}><span>◎</span>User management</a>
          <a className="admin-nav__item" href="/dashboard"><span>↗</span>User workspace</a>
        </nav>
        <div className="admin-sidebar__note"><span>◆</span><div><strong>Protected area</strong><p>Every request is verified with administrator permissions.</p></div></div>
        <div className="admin-account">
          <div className="admin-account__profile"><span>{initials(user.name)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
          <button type="button" disabled={isSigningOut} onClick={onSignOut}>{isSigningOut ? 'Logging out…' : 'Log out'}</button>
        </div>
      </aside>
    </>
  );
}
