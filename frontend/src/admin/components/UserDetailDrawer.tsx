import type { AdminUserDetails, AdminUserHistory } from '../types/admin.types';

interface UserDetailDrawerProps {
  details: AdminUserDetails | null;
  history: AdminUserHistory | null;
  isLoading: boolean;
  historyPage: number;
  onHistoryPageChange: (page: number) => void;
  onClose: () => void;
}

const labels: Record<string, string> = {
  professional_email: 'Professional Email', social_media_post: 'Social Post', blog_article: 'Blog Article',
  blog_outline: 'Blog Outline', product_description: 'Product Description', marketing_copy: 'Marketing Copy',
  business_proposal: 'Business Proposal', job_description: 'Job Description', meeting_summary: 'Meeting Summary', custom_content: 'Custom Content',
};

function date(value?: string) { return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : 'Never'; }

export function UserDetailDrawer({ details, history, isLoading, historyPage, onHistoryPageChange, onClose }: UserDetailDrawerProps) {
  return (
    <div className="admin-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="admin-drawer" aria-label="User details">
        <div className="admin-drawer__header"><div><span>User details</span><h2>{details?.user.name || 'Loading…'}</h2></div><button type="button" aria-label="Close user details" onClick={onClose}>×</button></div>
        {isLoading && <div className="admin-drawer__loading">Loading account details…</div>}
        {!isLoading && details && <>
          <section className="admin-profile-card"><div className="admin-profile-card__avatar">{details.user.name.slice(0, 2).toUpperCase()}</div><div><h3>{details.user.name}</h3><p>{details.user.email}</p><div><span className={`admin-role admin-role--${details.user.role}`}>{details.user.role}</span><span className={`admin-status admin-status--${details.user.isActive ? 'active' : 'inactive'}`}><i />{details.user.isActive ? 'Active' : 'Inactive'}</span></div></div></section>
          <section className="admin-detail-grid"><div><span>Generations</span><strong>{details.generationCount}</strong></div><div><span>Joined</span><strong>{date(details.user.createdAt)}</strong></div><div><span>Last login</span><strong>{date(details.user.lastLoginAt)}</strong></div><div><span>Last updated</span><strong>{date(details.user.updatedAt)}</strong></div></section>
          <section className="admin-history"><div className="admin-history__heading"><h3>Generation history</h3><span>{history?.pagination.totalRecords || 0} total</span></div>{history?.history.length ? <div className="admin-history__list">{history.history.map((item) => <article key={item._id}><span>▤</span><div><strong>{item.title}</strong><small>{labels[item.contentType] || item.contentType} · {date(item.createdAt)}</small></div><em className={`recent-item__status recent-item__status--${item.status}`}>{item.status}</em></article>)}</div> : <p className="admin-history__empty">No generations found for this user.</p>}{history && history.pagination.totalPages > 1 && <div className="admin-history__pagination"><button type="button" disabled={historyPage === 1} onClick={() => onHistoryPageChange(historyPage - 1)}>←</button><span>{historyPage} / {history.pagination.totalPages}</span><button type="button" disabled={historyPage === history.pagination.totalPages} onClick={() => onHistoryPageChange(historyPage + 1)}>→</button></div>}</section>
        </>}
      </aside>
    </div>
  );
}
