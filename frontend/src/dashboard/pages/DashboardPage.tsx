import { useCallback, useEffect, useState } from 'react';

import { QuickTemplates } from '../components/QuickTemplates';
import { RecentContent } from '../components/RecentContent';
import { StatsGrid } from '../components/StatsGrid';
import { WelcomePanel } from '../components/WelcomePanel';
import { WorkspaceShell } from '../components/WorkspaceShell';
import { getRecentContent } from '../services/dashboardApi';
import type { ContentHistoryItem } from '../types/dashboard.types';

export function DashboardPage() {
  const [history, setHistory] = useState<ContentHistoryItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getRecentContent();
      setHistory(data.history);
      setTotalRecords(data.pagination.totalRecords);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  return (
    <WorkspaceShell
      activePage="dashboard"
      search={search}
      searchPlaceholder="Search your recent content"
      onSearchChange={setSearch}
      actionHref="/studio"
      actionLabel="New content"
    >
      {(user) => (
        <main className="dashboard-content">
          <WelcomePanel name={user.name} />
          <StatsGrid history={history} totalRecords={totalRecords} isLoading={isLoading} />
          <QuickTemplates />
          <RecentContent history={history} search={search} isLoading={isLoading} error={error} onRetry={() => void loadDashboard()} />
        </main>
      )}
    </WorkspaceShell>
  );
}
