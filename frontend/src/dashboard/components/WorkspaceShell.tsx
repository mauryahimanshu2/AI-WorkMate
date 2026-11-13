import { useEffect, useState, type ReactNode } from 'react';

import { getStoredUser, hasStoredSession, signOut } from '../../auth/services/authApi';
import type { User } from '../../auth/types/auth.types';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { navigate } from '../../routing/router';

interface WorkspaceShellProps {
  activePage: 'dashboard' | 'studio' | 'content';
  headerTitle?: string;
  headerSubtitle?: string;
  search?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actionHref: string;
  actionLabel: string;
  children: (user: User) => ReactNode;
}

export function WorkspaceShell(props: WorkspaceShellProps) {
  const [user] = useState(getStoredUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!user || !hasStoredSession()) navigate('/signin', { replace: true });
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    navigate('/signin', { replace: true });
  };

  if (!user || !hasStoredSession()) return <main className="dashboard-guard">Opening sign in…</main>;

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        user={user}
        activePage={props.activePage}
        isOpen={isSidebarOpen}
        isSigningOut={isSigningOut}
        onClose={() => setIsSidebarOpen(false)}
        onSignOut={() => void handleSignOut()}
      />
      <div className="dashboard-main">
        <DashboardHeader
          title={props.headerTitle}
          subtitle={props.headerSubtitle}
          search={props.search}
          searchPlaceholder={props.searchPlaceholder}
          onSearchChange={props.onSearchChange}
          actionHref={props.actionHref}
          actionLabel={props.actionLabel}
          onMenuOpen={() => setIsSidebarOpen(true)}
        />
        {props.children(user)}
      </div>
    </div>
  );
}
