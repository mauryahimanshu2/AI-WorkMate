import type { AdminSummary } from '../types/admin.types';

interface AdminStatsProps { summary: AdminSummary; isLoading: boolean; }

export function AdminStats({ summary, isLoading }: AdminStatsProps) {
  const stats = [
    { label: 'Total accounts', value: summary.totalUsers, icon: '◎', color: 'blue' },
    { label: 'Active users', value: summary.activeUsers, icon: '✓', color: 'green' },
    { label: 'Inactive users', value: summary.inactiveUsers, icon: '—', color: 'coral' },
    { label: 'Administrators', value: summary.administrators, icon: '◆', color: 'violet' },
  ];
  return (
    <section className="admin-stats" aria-label="Account summary">
      {stats.map((stat) => <article className="admin-stat" key={stat.label}><span className={`admin-stat__icon admin-stat__icon--${stat.color}`}>{stat.icon}</span><div><small>{stat.label}</small><strong>{isLoading ? '—' : stat.value}</strong></div></article>)}
    </section>
  );
}
