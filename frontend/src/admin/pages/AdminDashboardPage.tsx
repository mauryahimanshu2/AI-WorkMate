import { useCallback, useEffect, useState } from 'react';

import { getStoredUser, hasStoredSession, signOut } from '../../auth/services/authApi';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminStats } from '../components/AdminStats';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { UserFilters } from '../components/UserFilters';
import { UserStatusDialog } from '../components/UserStatusDialog';
import { UsersTable } from '../components/UsersTable';
import {
  getAdminSummary,
  getUserDetails,
  getUserHistory,
  getUsers,
  setUserStatus,
} from '../services/adminApi';
import type {
  AdminSummary,
  AdminUser,
  AdminUserDetails,
  AdminUserHistory,
  UserListFilters,
  UserListResponse,
} from '../types/admin.types';

const emptySummary: AdminSummary = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  administrators: 0,
};

const initialList: UserListResponse = {
  users: [],
  pagination: { page: 1, limit: 10, totalUsers: 0, totalPages: 0 },
};

export function AdminDashboardPage() {
  const currentUser = getStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [summary, setSummary] = useState(emptySummary);
  const [list, setList] = useState(initialList);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [filters, setFilters] = useState<UserListFilters>({ page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [history, setHistory] = useState<AdminUserHistory | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!hasStoredSession() || !currentUser) {
      window.location.replace('/signin');
    } else if (currentUser.role !== 'admin') {
      window.location.replace('/dashboard');
    }
  }, [currentUser]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setList(await getUsers(filters));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      setSummary(await getAdminSummary());
    } catch {
      // The user table still remains useful if the summary request fails.
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      void loadUsers();
      void loadSummary();
    }
  }, [currentUser?.role, loadSummary, loadUsers]);

  const openUser = async (user: AdminUser) => {
    setSelectedUser(user);
    setDetails(null);
    setHistory(null);
    setHistoryPage(1);
    setDrawerLoading(true);
    try {
      const [nextDetails, nextHistory] = await Promise.all([
        getUserDetails(user._id),
        getUserHistory(user._id),
      ]);
      setDetails(nextDetails);
      setHistory(nextHistory);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load user details.');
      setSelectedUser(null);
    } finally {
      setDrawerLoading(false);
    }
  };

  const changeHistoryPage = async (page: number) => {
    if (!selectedUser) return;
    setDrawerLoading(true);
    try {
      setHistory(await getUserHistory(selectedUser._id, page));
      setHistoryPage(page);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load generation history.');
    } finally {
      setDrawerLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!statusTarget) return;
    setIsUpdating(true);
    setError('');
    try {
      const updated = await setUserStatus(statusTarget._id, !statusTarget.isActive);
      setStatusTarget(null);
      await Promise.all([loadUsers(), loadSummary()]);
      if (selectedUser?._id === updated._id) await openUser(updated);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update this account.');
    } finally {
      setIsUpdating(false);
    }
  };

  const applyFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: search.trim(),
      status: status as UserListFilters['status'],
      role: role as UserListFilters['role'],
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setRole('');
    setFilters({ page: 1, limit: 10 });
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    window.location.replace('/signin');
  };

  if (!currentUser || currentUser.role !== 'admin') return null;

  return (
    <div className="admin-shell">
      <AdminSidebar
        user={currentUser}
        isOpen={sidebarOpen}
        isSigningOut={isSigningOut}
        onClose={() => setSidebarOpen(false)}
        onSignOut={() => void handleSignOut()}
      />

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <span /><span /><span />
          </button>
          <div><small>Administration</small><strong>Control center</strong></div>
          <a href="/dashboard">Open user workspace</a>
        </header>

        <main className="admin-content">
          <section className="admin-hero" id="overview">
            <div><span>ADMIN OVERVIEW</span><h1>Good to see you, {currentUser.name.split(' ')[0]}.</h1><p>Monitor accounts, review user activity, and control access from one secure workspace.</p></div>
            <div className="admin-hero__mark" aria-hidden="true">AW</div>
          </section>

          <AdminStats summary={summary} isLoading={summaryLoading} />

          <section className="admin-users" id="users">
            <div className="admin-section-heading">
              <div><span>USER MANAGEMENT</span><h2>Accounts</h2><p>{list.pagination.totalUsers} account{list.pagination.totalUsers === 1 ? '' : 's'} match the current view.</p></div>
              <button type="button" onClick={() => { void loadUsers(); void loadSummary(); }}>Refresh</button>
            </div>

            <UserFilters
              search={search}
              status={status}
              role={role}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onRoleChange={setRole}
              onApply={applyFilters}
              onClear={clearFilters}
            />

            {error && <div className="admin-error" role="alert"><span>!</span><p>{error}</p><button type="button" onClick={() => setError('')}>Dismiss</button></div>}

            <UsersTable
              users={list.users}
              isLoading={isLoading}
              currentUserId={currentUser._id}
              onView={(user) => void openUser(user)}
              onStatusChange={setStatusTarget}
            />

            {list.pagination.totalPages > 1 && (
              <nav className="admin-pagination" aria-label="User pages">
                <button type="button" disabled={filters.page === 1} onClick={() => setFilters((value) => ({ ...value, page: value.page - 1 }))}>Previous</button>
                <span>Page <strong>{list.pagination.page}</strong> of {list.pagination.totalPages}</span>
                <button type="button" disabled={filters.page === list.pagination.totalPages} onClick={() => setFilters((value) => ({ ...value, page: value.page + 1 }))}>Next</button>
              </nav>
            )}
          </section>
        </main>
      </div>

      {selectedUser && (
        <UserDetailDrawer
          details={details}
          history={history}
          isLoading={drawerLoading}
          historyPage={historyPage}
          onHistoryPageChange={(page) => void changeHistoryPage(page)}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {statusTarget && <UserStatusDialog user={statusTarget} isUpdating={isUpdating} onCancel={() => setStatusTarget(null)} onConfirm={() => void updateStatus()} />}
    </div>
  );
}
