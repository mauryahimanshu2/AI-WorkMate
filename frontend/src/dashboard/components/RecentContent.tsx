import type { ContentHistoryItem } from '../types/dashboard.types';

interface RecentContentProps {
  history: ContentHistoryItem[];
  search: string;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}

const typeLabels: Record<string, string> = {
  professional_email: 'Professional Email',
  social_media_post: 'Social Media Post',
  blog_article: 'Blog Article',
  blog_outline: 'Blog Outline',
  product_description: 'Product Description',
  marketing_copy: 'Marketing Copy',
  business_proposal: 'Business Proposal',
  job_description: 'Job Description',
  meeting_summary: 'Meeting Summary',
  custom_content: 'Custom Content',
};

const typeIcons: Record<string, string> = {
  professional_email: '✉',
  social_media_post: '#',
  blog_article: '▤',
  marketing_copy: '↗',
  meeting_summary: '✓',
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function RecentContent({
  history,
  search,
  isLoading,
  error,
  onRetry,
}: RecentContentProps) {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredHistory = history.filter((item) => {
    const typeLabel = typeLabels[item.contentType] || item.contentType;
    return `${item.title} ${typeLabel}`.toLowerCase().includes(normalizedSearch);
  });

  return (
    <section className="dashboard-section recent-section" id="recent">
      <div className="dashboard-section__heading dashboard-section__heading--row">
        <div>
          <p>Your work</p>
          <h2>Recent content</h2>
        </div>
        <span>{search ? `${filteredHistory.length} matching results` : 'Your latest saved generations'}</span>
      </div>

      {isLoading && (
        <div className="recent-list" aria-label="Loading recent content">
          {[1, 2, 3].map((item) => <div className="recent-skeleton" key={item} />)}
        </div>
      )}

      {!isLoading && error && (
        <div className="dashboard-empty">
          <span aria-hidden="true">!</span>
          <h3>We couldn’t load your content</h3>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}

      {!isLoading && !error && filteredHistory.length === 0 && (
        <div className="dashboard-empty">
          <span aria-hidden="true">✦</span>
          <h3>{search ? 'No matching content' : 'Your workspace is ready'}</h3>
          <p>{search ? 'Try a different title or content type.' : 'Choose a template above to start your first draft.'}</p>
        </div>
      )}

      {!isLoading && !error && filteredHistory.length > 0 && (
        <div className="recent-list">
          {filteredHistory.map((item) => (
            <a className="recent-item" href={`/content/${item._id}`} key={item._id}>
              <span className="recent-item__icon" aria-hidden="true">{typeIcons[item.contentType] || '◇'}</span>
              <div className="recent-item__title">
                <strong>{item.title}</strong>
                <span>{typeLabels[item.contentType] || item.contentType}</span>
              </div>
              <span className={`recent-item__status recent-item__status--${item.status}`}>{item.status}</span>
              <span className="recent-item__tokens">{(item.usage.inputTokens + item.usage.outputTokens).toLocaleString()} tokens</span>
              <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
