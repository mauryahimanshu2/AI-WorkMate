import type { ContentHistoryItem } from '../types/dashboard.types';

interface StatsGridProps {
  history: ContentHistoryItem[];
  totalRecords: number;
  isLoading: boolean;
}

export function StatsGrid({ history, totalRecords, isLoading }: StatsGridProps) {
  const completed = history.filter((item) => item.status === 'completed').length;
  const recentTokens = history.reduce(
    (total, item) => total + item.usage.inputTokens + item.usage.outputTokens,
    0,
  );
  const formatsUsed = new Set(history.map((item) => item.contentType)).size;

  const stats = [
    { icon: '▤', label: 'Total creations', value: totalRecords, note: 'All saved content', color: 'coral' },
    { icon: '✓', label: 'Recently completed', value: completed, note: `From your latest ${history.length}`, color: 'green' },
    { icon: '⌁', label: 'Recent tokens', value: recentTokens.toLocaleString(), note: 'Input and output', color: 'violet' },
    { icon: '◇', label: 'Formats used', value: formatsUsed, note: 'Across recent content', color: 'gold' },
  ];

  return (
    <section className="stats-grid" aria-label="Content overview">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span className={`stat-card__icon stat-card__icon--${stat.color}`} aria-hidden="true">{stat.icon}</span>
          <div>
            <span>{stat.label}</span>
            <strong>{isLoading ? '—' : stat.value}</strong>
            <small>{stat.note}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
