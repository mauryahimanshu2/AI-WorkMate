import type { ContentHistoryItem } from '../types/content.types';

interface HistoryListProps {
  items: ContentHistoryItem[];
  isLoading: boolean;
  onDelete: (item: ContentHistoryItem) => void;
}

const labels: Record<string, string> = {
  professional_email: 'Professional Email', social_media_post: 'Social Media Post',
  blog_article: 'Blog Article', blog_outline: 'Blog Outline', product_description: 'Product Description',
  marketing_copy: 'Marketing Copy', business_proposal: 'Business Proposal', job_description: 'Job Description',
  meeting_summary: 'Meeting Summary', custom_content: 'Custom Content',
};

export function HistoryList({ items, isLoading, onDelete }: HistoryListProps) {
  if (isLoading) return <div className="history-list">{[1, 2, 3, 4].map((item) => <div className="history-card history-card--loading" key={item} />)}</div>;
  if (!items.length) return <div className="content-empty"><span>✦</span><h2>No content found</h2><p>Create a new draft or adjust your filters.</p><a href="/studio">Create content</a></div>;

  return (
    <div className="history-list">
      {items.map((item) => (
        <article className="history-card" key={item._id}>
          <div className="history-card__top"><span className="history-card__icon">{item.contentType === 'professional_email' ? '✉' : '▤'}</span><span className={`recent-item__status recent-item__status--${item.status}`}>{item.status}</span></div>
          <div className="history-card__body"><span>{labels[item.contentType] || item.contentType}</span><h2>{item.title}</h2><p>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(item.updatedAt))} · {(item.usage.inputTokens + item.usage.outputTokens).toLocaleString()} tokens</p></div>
          <div className="history-card__actions"><a href={`/content/${item._id}`}>Open <span>→</span></a><button type="button" onClick={() => onDelete(item)} aria-label={`Delete ${item.title}`}>Delete</button></div>
        </article>
      ))}
    </div>
  );
}
